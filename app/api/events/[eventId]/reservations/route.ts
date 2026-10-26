import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createCapacityHold } from "@/lib/capacity";
import { apiError, CapacityError } from "@/lib/capacityHttp";
import { requireActor } from "@/lib/capacityAuth";

const schema = z.object({
  passTypeId: z.string().min(1),
  quantity: z.number().int().min(1).max(100),
  pricingPhaseId: z.string().optional(),
});

type Context = { params: Promise<{ eventId: string }> };

export async function POST(request: Request, { params }: Context) {
  try {
    const actor = await requireActor();
    const { eventId } = await params;
    const input = schema.parse(await request.json());

    const event = await prisma.event.findFirst({
      where: { OR: [{ id: eventId }, { slug: eventId }] },
    });
    if (!event) throw new CapacityError("EVENT_NOT_FOUND", "Event was not found.", 404);

    const reservation = await createCapacityHold({
      eventId: event.id,
      passTypeId: input.passTypeId,
      quantity: input.quantity,
      pricingPhaseId: input.pricingPhaseId,
      buyerId: actor.id,
    });

    return NextResponse.json(
      {
        reservationId: reservation.id,
        status: reservation.status,
        quantity: reservation.quantity,
        expiresAt: reservation.expiresAt,
      },
      { status: 201 }
    );
  } catch (error) {
    return apiError(error);
  }
}
