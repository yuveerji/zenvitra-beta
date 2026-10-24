import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSupportActor } from "@/lib/support/auth";
import { createTicketSchema } from "@/lib/support/validation";
import { createSupportTicket } from "@/lib/support/ticket-service";
import { hasPermission } from "@/lib/support/permissions";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const actor = await getSupportActor();

  if (!actor) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const url = new URL(request.url);
  const adminView = url.searchParams.get("view") === "admin";

  if (adminView && !hasPermission(actor.role, "support:read:all")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const page = Math.max(
    1,
    Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1
  );

  const statusFilter = url.searchParams.get("status");
  const categoryFilter = url.searchParams.get("category");

  const whereClause: any = adminView
    ? {
        ...(hasPermission(actor.role, "support:read:sensitive")
          ? {}
          : { isSensitive: false }),
        ...(statusFilter && statusFilter !== "ALL" ? { status: statusFilter } : {}),
        ...(categoryFilter && categoryFilter !== "ALL" ? { category: categoryFilter } : {}),
      }
    : {
        OR: [
          { requesterUserId: actor.id },
          { userId: actor.id },
          ...(actor.email ? [{ userEmail: actor.email }] : []),
        ],
        ...(statusFilter && statusFilter !== "ALL" ? { status: statusFilter } : {}),
        ...(categoryFilter && categoryFilter !== "ALL" ? { category: categoryFilter } : {}),
      };

  const tickets = await prisma.supportTicket.findMany({
    where: whereClause,
    orderBy: { updatedAt: "desc" },
    skip: (page - 1) * 25,
    take: 25,
    select: {
      id: true,
      ticketNumber: true,
      subject: true,
      category: true,
      priority: true,
      status: true,
      isSensitive: true,
      createdAt: true,
      updatedAt: true,
      requesterUserId: true,
      userId: true,
      userName: true,
      userEmail: true,
      assignedToUserId: true,
      assignedToName: true,
    },
  });

  const total = await prisma.supportTicket.count({ where: whereClause });

  return NextResponse.json({ tickets, page, total });
}

export async function POST(request: Request) {
  const actor = await getSupportActor();

  if (!actor) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  try {
    const rawData = await request.json();
    const parsed = createTicketSchema.safeParse(rawData);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid ticket parameters",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const ticket = await createSupportTicket(actor, parsed.data);

    return NextResponse.json(
      {
        ticket: {
          id: ticket.id,
          ticketNumber: ticket.ticketNumber,
          status: ticket.status,
          subject: ticket.subject,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[SUPPORT_TICKET_CREATE_ERROR]", err);
    return NextResponse.json(
      { error: "Unable to create ticket", message: err?.message },
      { status: 500 }
    );
  }
}
