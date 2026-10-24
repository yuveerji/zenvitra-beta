import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSupportActor } from "@/lib/support/auth";
import { getVisibleTicket } from "@/lib/support/ticket-service";
import { updateTicketSchema } from "@/lib/support/validation";
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

  return NextResponse.json({ ticket });
}

export async function PATCH(request: Request, context: Context) {
  const actor = await getSupportActor();

  if (!actor) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  if (!hasPermission(actor.role, "support:manage")) {
    return NextResponse.json({ error: "Forbidden: Management access required" }, { status: 403 });
  }

  const parsed = updateTicketSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid update data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { ticketId } = await context.params;
  const current = await prisma.supportTicket.findFirst({
    where: {
      OR: [{ id: ticketId }, { ticketNumber: ticketId }],
    },
  });

  if (!current) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  const changes = parsed.data;

  // Sensitive ticket restriction
  if (current.isSensitive && !hasPermission(actor.role, "support:read:sensitive")) {
    return NextResponse.json({ error: "Forbidden: Sensitive complaint" }, { status: 403 });
  }

  // Assignment authorization check
  if (changes.assignedToUserId !== undefined && !hasPermission(actor.role, "support:assign")) {
    return NextResponse.json({ error: "Forbidden: Assignment permission required" }, { status: 403 });
  }

  // Sensitive flag authorization check
  if (changes.isSensitive !== undefined && !hasPermission(actor.role, "support:read:sensitive")) {
    return NextResponse.json({ error: "Forbidden: Cannot toggle sensitivity" }, { status: 403 });
  }

  // Validate assignee against authorized staff registry (Security Correction 12.B)
  let assigneeName: string | null = null;
  if (changes.assignedToUserId) {
    const assignee = await prisma.user.findUnique({
      where: { id: changes.assignedToUserId },
      select: { id: true, name: true, role: true, email: true },
    });

    if (!assignee) {
      return NextResponse.json({ error: "Assignee user not found" }, { status: 400 });
    }

    // Verify assignee has at least support/staff role
    const assigneeRole = (assignee.role || "USER").toUpperCase();
    const isStaffRole = [
      "FOUNDER",
      "CO_FOUNDER",
      "ADMIN",
      "CORE_TEAM",
      "SUPPORT_LEAD",
      "SUPPORT_AGENT",
      "STAFF",
      "SECRETARIAT",
      "CHAIR",
    ].includes(assigneeRole);

    if (!isStaffRole) {
      return NextResponse.json(
        { error: "Assignee must be an active support agent or authorized staff member." },
        { status: 400 }
      );
    }

    assigneeName = assignee.name || assignee.email;
  }

  const updated = await prisma.$transaction(async (tx) => {
    const ticket = await tx.supportTicket.update({
      where: { id: current.id },
      data: {
        ...(changes.status !== undefined && { status: changes.status }),
        ...(changes.priority !== undefined && { priority: changes.priority }),
        ...(changes.assignedToUserId !== undefined && {
          assignedToUserId: changes.assignedToUserId,
          assignedToId: changes.assignedToUserId,
          ...(assigneeName ? { assignedToName: assigneeName } : {}),
        }),
        ...(changes.isSensitive !== undefined && { isSensitive: changes.isSensitive }),
        ...(changes.status === "RESOLVED" && { resolvedAt: new Date() }),
        ...(changes.status === "CLOSED" && { closedAt: new Date() }),
      },
    });

    await tx.supportEvent.create({
      data: {
        ticketId: current.id,
        actorUserId: actor.id,
        action: "TICKET_UPDATED",
        details: JSON.stringify(changes),
      },
    });

    await tx.supportAuditLog.create({
      data: {
        ticketId: current.id,
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role,
        action: "STATUS_CHANGED",
        details: JSON.stringify(changes),
      },
    });

    return ticket;
  });

  return NextResponse.json({ ticket: updated });
}
