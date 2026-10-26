import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { capacitySnapshot } from "@/lib/capacity";
import { apiError, CapacityError } from "@/lib/capacityHttp";
import { requireActor, canManageCapacity } from "@/lib/capacityAuth";
import { z } from "zod";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ eventId: string }> };

export async function GET(_request: Request, { params }: Context) {
  try {
    const { eventId } = await params;
    const event = await prisma.event.findFirst({
      where: { OR: [{ id: eventId }, { slug: eventId }] },
      include: { passTypes: { orderBy: { createdAt: "asc" } } },
    });
    if (!event) throw new CapacityError("EVENT_NOT_FOUND", "Event was not found.", 404);
    return NextResponse.json(capacitySnapshot(event, event.passTypes, event.capacityMode));
  } catch (error) {
    return apiError(error);
  }
}

const updateSchema = z.object({
  venueCapacity: z.number().int().min(1).max(1_000_000),
  operationalReserve: z.number().int().min(0).max(1_000_000),
  capacityMode: z.enum(["SHARED", "SEPARATE"]),
  waitlistEnabled: z.boolean(),
  allowAdminIncrease: z.boolean(),
  reason: z.string().trim().max(500).optional(),
}).refine((v) => v.operationalReserve < v.venueCapacity, {
  message: "Reserve must be lower than venue capacity.",
  path: ["operationalReserve"],
});

export async function PATCH(request: Request, { params }: Context) {
  try {
    const actor = await requireActor();
    if (!canManageCapacity(actor.role)) {
      throw new CapacityError("FORBIDDEN", "You do not have permission to manage capacity.", 403);
    }
    const { eventId } = await params;
    const input = updateSchema.parse(await request.json());
    const before = await prisma.event.findFirst({
      where: { OR: [{ id: eventId }, { slug: eventId }] },
    });
    if (!before) throw new CapacityError("EVENT_NOT_FOUND", "Event was not found.", 404);

    if (input.venueCapacity < before.soldCount + before.heldCount + input.operationalReserve) {
      throw new CapacityError(
        "BELOW_COMMITTED",
        "New capacity cannot be below sold passes plus active holds and reserve."
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.event.update({
        where: { id: before.id },
        data: {
          venueCapacity: input.venueCapacity,
          operationalReserve: input.operationalReserve,
          capacityMode: input.capacityMode,
          waitlistEnabled: input.waitlistEnabled,
          allowAdminIncrease: input.allowAdminIncrease,
        },
      });

      await tx.capacityAuditLog.create({
        data: {
          eventId: before.id,
          actorId: actor.id,
          action: "EVENT_CAPACITY_UPDATED",
          entityType: "Event",
          entityId: before.id,
          beforeData: JSON.stringify({
            venueCapacity: before.venueCapacity,
            operationalReserve: before.operationalReserve,
            capacityMode: before.capacityMode,
          }),
          afterData: JSON.stringify({
            venueCapacity: result.venueCapacity,
            operationalReserve: result.operationalReserve,
            capacityMode: result.capacityMode,
          }),
          reason: input.reason,
        },
      });

      return result;
    });

    return NextResponse.json(updated);
  } catch (error) {
    return apiError(error);
  }
}
