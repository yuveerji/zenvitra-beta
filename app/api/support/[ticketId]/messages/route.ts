import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSupportActor } from "@/lib/support/auth";
import { replySchema } from "@/lib/support/validation";
import { getVisibleTicket } from "@/lib/support/ticket-service";
import { hasPermission } from "@/lib/support/permissions";

type Context = {
  params: Promise<{ ticketId: string }>;
};

export async function GET(_: Request, context: Context) {
  const actor = await getSupportActor();

  if (!actor) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { ticketId } = await context.params;
  const ticket = await getVisibleTicket(ticketId, actor);

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  return NextResponse.json({ messages: ticket.messages });
}

export async function POST(request: Request, context: Context) {
  const actor = await getSupportActor();

  if (!actor) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { ticketId } = await context.params;
  const ticket = await prisma.supportTicket.findFirst({
    where: {
      OR: [{ id: ticketId }, { ticketNumber: ticketId }],
    },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  // Security Correction 12.A: Restrict staff replies to assigned tickets or authorized queues
  const isOwner =
    ticket.requesterUserId === actor.id ||
    ticket.userId === actor.id ||
    (Boolean(ticket.userEmail) && ticket.userEmail.toLowerCase() === actor.email.toLowerCase());

  const isAssigned =
    ticket.assignedToUserId === actor.id ||
    ticket.assignedToId === actor.id;

  const canReplyAll = hasPermission(actor.role, "support:reply:all");
  const canReadAll = hasPermission(actor.role, "support:read:all");

  const canAccessAsStaff = canReplyAll && (isAssigned || canReadAll);

  if (!isOwner && !canAccessAsStaff) {
    return NextResponse.json({ error: "Forbidden: Not authorized to reply to this ticket" }, { status: 403 });
  }

  // Security check for sensitive tickets
  if (ticket.isSensitive && !hasPermission(actor.role, "support:read:sensitive")) {
    return NextResponse.json({ error: "Forbidden: Confidential complaint access restricted" }, { status: 403 });
  }

  const parsed = replySchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid message body", details: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.isInternal && !hasPermission(actor.role, "support:reply:all")) {
    return NextResponse.json({ error: "Forbidden: Internal notes are restricted to staff" }, { status: 403 });
  }

  if (["CLOSED", "RESOLVED"].includes(ticket.status)) {
    return NextResponse.json(
      { error: "This ticket is closed to replies. Please reopen or create a new ticket." },
      { status: 409 }
    );
  }

  const message = await prisma.$transaction(async (tx) => {
    const created = await tx.supportMessage.create({
      data: {
        ticketId: ticket.id,
        senderUserId: actor.id,
        senderId: actor.id,
        senderName: actor.name || "Member",
        senderRole: actor.role || "USER",
        body: parsed.data.body,
        content: parsed.data.body,
        isInternal: parsed.data.isInternal,
        isOfficial: !isOwner,
      },
    });

    const nextStatus = parsed.data.isInternal
      ? ticket.status
      : isOwner
      ? "OPEN"
      : "WAITING_ON_USER";

    await tx.supportTicket.update({
      where: { id: ticket.id },
      data: {
        status: nextStatus,
        updatedAt: new Date(),
      },
    });

    await tx.supportEvent.create({
      data: {
        ticketId: ticket.id,
        actorUserId: actor.id,
        action: parsed.data.isInternal ? "INTERNAL_NOTE_ADDED" : "REPLY_ADDED",
        details: JSON.stringify({ isInternal: parsed.data.isInternal }),
      },
    });

    if (parsed.data.isInternal) {
      await tx.supportInternalNote.create({
        data: {
          ticketId: ticket.id,
          authorId: actor.id,
          authorName: actor.name || "Staff",
          authorRole: actor.role || "STAFF",
          note: parsed.data.body,
        },
      });
    } else {
      await tx.supportAuditLog.create({
        data: {
          ticketId: ticket.id,
          actorId: actor.id,
          actorName: actor.name,
          actorRole: actor.role,
          action: "REPLY_SENT",
          details: `Reply from ${actor.name}`,
        },
      });
    }

    return created;
  });

  return NextResponse.json(
    {
      message: {
        id: message.id,
        body: message.body || message.content,
        isInternal: message.isInternal,
        senderUserId: message.senderUserId,
        createdAt: message.createdAt,
      },
    },
    { status: 201 }
  );
}
