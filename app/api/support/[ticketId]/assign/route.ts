import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSupportActor } from "@/lib/support/auth";
import { hasPermission } from "@/lib/support/permissions";

type Context = {
  params: Promise<{ ticketId: string }>;
};

export async function POST(request: Request, context: Context) {
  const actor = await getSupportActor();

  if (!actor) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  if (!hasPermission(actor.role, "support:assign")) {
    return NextResponse.json({ error: "Forbidden: Assignment permission required" }, { status: 403 });
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

  const body = await request.json();
  const { assignedToUserId } = body;

  let assigneeName: string | null = null;
  if (assignedToUserId) {
    const assignee = await prisma.user.findUnique({
      where: { id: assignedToUserId },
      select: { id: true, name: true, role: true, email: true },
    });

    if (!assignee) {
      return NextResponse.json({ error: "Assignee not found" }, { status: 400 });
    }

    const assigneeRole = (assignee.role || "USER").toUpperCase();
    const isStaff = [
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

    if (!isStaff) {
      return NextResponse.json(
        { error: "Assignee must be an active support agent or authorized staff member." },
        { status: 400 }
      );
    }

    assigneeName = assignee.name || assignee.email;
  }

  const updated = await prisma.$transaction(async (tx) => {
    const res = await tx.supportTicket.update({
      where: { id: ticket.id },
      data: {
        assignedToUserId: assignedToUserId || null,
        assignedToId: assignedToUserId || null,
        assignedToName: assigneeName,
        status: ticket.status === "OPEN" && assignedToUserId ? "IN_PROGRESS" : ticket.status,
      },
    });

    await tx.supportEvent.create({
      data: {
        ticketId: ticket.id,
        actorUserId: actor.id,
        action: "TICKET_ASSIGNED",
        details: JSON.stringify({ assignedToUserId, assigneeName }),
      },
    });

    await tx.supportAuditLog.create({
      data: {
        ticketId: ticket.id,
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role,
        action: "ASSIGNED",
        details: `Assigned to ${assigneeName || "Unassigned"}`,
      },
    });

    return res;
  });

  return NextResponse.json({ ticket: updated });
}
