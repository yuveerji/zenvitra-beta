import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cancelCapacityHold } from "@/lib/capacity";
import { apiError, CapacityError } from "@/lib/capacityHttp";
import { requireActor } from "@/lib/capacityAuth";

type Context = { params: Promise<{ eventId: string; reservationId: string }> };

export async function POST(_request: Request, { params }: Context) {
  try {
    const actor = await requireActor();
    const { eventId, reservationId } = await params;

    const event = await prisma.event.findFirst({
      where: { OR: [{ id: eventId }, { slug: eventId }] },
    });
    if (!event) throw new CapacityError("EVENT_NOT_FOUND", "Event was not found.", 404);

    const cancelled = await cancelCapacityHold(reservationId, event.id, actor.id);
    return NextResponse.json({
      reservationId: cancelled.id,
      status: cancelled.status,
      cancelledAt: cancelled.cancelledAt,
    });
  } catch (error) {
    return apiError(error);
  }
}
