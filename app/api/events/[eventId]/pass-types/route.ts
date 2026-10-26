import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { apiError, CapacityError } from "@/lib/capacityHttp";
import { requireActor, canManageCapacity } from "@/lib/capacityAuth";

type Context = { params: Promise<{ eventId: string }> };

const passSchema = z.object({
  name: z.string().trim().min(2).max(80),
  code: z.string().trim().min(2).max(32).regex(/^[A-Z0-9_-]+$/),
  description: z.string().trim().max(500).optional(),
  capacity: z.number().int().min(1).max(1_000_000).nullable().optional(),
  reservedAllocation: z.number().int().min(0).max(1_000_000).default(0),
  maxPerOrder: z.number().int().min(1).max(100).default(10),
});

export async function GET(_request: Request, { params }: Context) {
  try {
    const { eventId } = await params;
    const event = await prisma.event.findFirst({
      where: { OR: [{ id: eventId }, { slug: eventId }] },
    });
    if (!event) throw new CapacityError("EVENT_NOT_FOUND", "Event was not found.", 404);

    const passes = await prisma.passType.findMany({
      where: { eventId: event.id },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(passes);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request, { params }: Context) {
  try {
    const actor = await requireActor();
    if (!canManageCapacity(actor.role)) {
      throw new CapacityError("FORBIDDEN", "You do not have permission to manage pass types.", 403);
    }
    const { eventId } = await params;
    const input = passSchema.parse(await request.json());
    if (input.capacity != null && input.reservedAllocation >= input.capacity) {
      throw new CapacityError("INVALID_ALLOCATION", "Reserved allocation must be less than pass capacity.", 400);
    }
    const event = await prisma.event.findFirst({
      where: { OR: [{ id: eventId }, { slug: eventId }] },
    });
    if (!event) throw new CapacityError("EVENT_NOT_FOUND", "Event was not found.", 404);

    const pass = await prisma.passType.create({
      data: {
        eventId: event.id,
        name: input.name,
        code: input.code,
        description: input.description,
        capacity: input.capacity ?? null,
        reservedAllocation: input.reservedAllocation,
        maxPerOrder: input.maxPerOrder,
      },
    });

    await prisma.capacityAuditLog.create({
      data: {
        eventId: event.id,
        actorId: actor.id,
        action: "PASS_CAPACITY_UPDATED",
        entityType: "PassType",
        entityId: pass.id,
        afterData: JSON.stringify({
          name: pass.name,
          code: pass.code,
          capacity: pass.capacity,
          reservedAllocation: pass.reservedAllocation,
        }),
      },
    });

    return NextResponse.json(pass, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
