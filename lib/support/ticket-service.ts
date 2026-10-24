import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/db";
import { hasPermission, type SupportPermission } from "./permissions";
import type { SupportActor } from "./auth";

function can(actor: SupportActor, permission: SupportPermission) {
  return hasPermission(actor.role, permission);
}

export async function getVisibleTicket(ticketId: string, actor: SupportActor) {
  const ticket = await prisma.supportTicket.findFirst({
    where: {
      OR: [
        { id: ticketId },
        { ticketNumber: ticketId },
      ],
    },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      events: { orderBy: { createdAt: "asc" } },
      internalNotes: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!ticket) return null;

  const isOwner =
    ticket.requesterUserId === actor.id ||
    ticket.userId === actor.id ||
    (Boolean(ticket.userEmail) && ticket.userEmail.toLowerCase() === actor.email.toLowerCase());

  const isAssigned =
    ticket.assignedToUserId === actor.id ||
    ticket.assignedToId === actor.id;

  const canReadAll = can(actor, "support:read:all");
  const canReadAssigned = isAssigned && can(actor, "support:read:assigned");

  if (!isOwner && !canReadAll && !canReadAssigned) {
    return null;
  }

  if (ticket.isSensitive && !can(actor, "support:read:sensitive")) {
    return null;
  }

  return {
    ...ticket,
    messages: ticket.messages
      .filter((message) => !message.isInternal || canReadAll)
      .map((m) => ({
        ...m,
        body: m.body || m.content,
      })),
    events: canReadAll ? ticket.events : [],
    internalNotes: canReadAll ? ticket.internalNotes : [],
  };
}

export async function createSupportTicket(
  actor: SupportActor,
  input: {
    subject: string;
    description: string;
    category: string;
    priority: string;
    relatedModule?: string;
    isSensitive?: boolean;
  }
) {
  const year = new Date().getUTCFullYear();
  const hex = randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
  const ticketNumber = `ZS-${year}-${hex}`;

  return prisma.$transaction(async (tx) => {
    const ticket = await tx.supportTicket.create({
      data: {
        ticketNumber,
        requesterUserId: actor.id,
        userId: actor.id,
        userEmail: actor.email || "support@zenvitra.xyz",
        userName: actor.name || "Zenvitra Member",
        userHandle: actor.username || null,
        subject: input.subject,
        description: input.description,
        category: input.category,
        priority: input.priority,
        status: "OPEN",
        relatedModule: input.relatedModule || null,
        isSensitive: Boolean(input.isSensitive),
      },
    });

    await tx.supportMessage.create({
      data: {
        ticketId: ticket.id,
        senderUserId: actor.id,
        senderId: actor.id,
        senderName: actor.name || "Member",
        senderRole: actor.role || "USER",
        body: input.description,
        content: input.description,
        isInternal: false,
      },
    });

    await tx.supportEvent.create({
      data: {
        ticketId: ticket.id,
        actorUserId: actor.id,
        action: "TICKET_CREATED",
        details: JSON.stringify({
          category: input.category,
          priority: input.priority,
          isSensitive: input.isSensitive || false,
        }),
      },
    });

    // Also populate legacy audit log for complete backward compatibility
    await tx.supportAuditLog.create({
      data: {
        ticketId: ticket.id,
        actorId: actor.id,
        actorName: actor.name || "Member",
        actorRole: actor.role || "USER",
        action: "CREATED",
        details: `Ticket created: ${input.subject}`,
      },
    });

    return ticket;
  });
}
