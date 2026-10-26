import { prisma } from "@/lib/db";
import { CapacityError } from "@/lib/capacityHttp";

const HOLD_MINUTES = 12;

export function capacitySnapshot(
  event: {
    venueCapacity: number;
    operationalReserve: number;
    soldCount: number;
    heldCount: number;
    waitlistEnabled: boolean;
    allowAdminIncrease: boolean;
  },
  passTypes: Array<{
    id: string;
    name: string;
    code: string;
    capacity: number | null;
    reservedAllocation: number;
    soldCount: number;
    heldCount: number;
    isActive: boolean;
  }>,
  mode: string
) {
  const sellableEventCapacity = Math.max(0, event.venueCapacity - event.operationalReserve);
  const eventRemaining = Math.max(0, sellableEventCapacity - event.soldCount - event.heldCount);
  const tiers = passTypes.map((pass) => {
    const tierLimit = pass.capacity == null ? null : Math.max(0, pass.capacity - pass.reservedAllocation);
    const remaining = tierLimit == null
      ? eventRemaining
      : Math.max(0, tierLimit - pass.soldCount - pass.heldCount);
    return {
      ...pass,
      publicCapacity: tierLimit,
      remaining: pass.isActive ? Math.min(eventRemaining, remaining) : 0,
      committed: pass.soldCount + pass.heldCount,
    };
  });

  return {
    venueCapacity: event.venueCapacity,
    operationalReserve: event.operationalReserve,
    sellableEventCapacity,
    soldCount: event.soldCount,
    heldCount: event.heldCount,
    eventRemaining,
    utilisationPercent: sellableEventCapacity === 0
      ? 0
      : Math.min(100, Math.round(((event.soldCount + event.heldCount) / sellableEventCapacity) * 100)),
    capacityMode: mode as "SHARED" | "SEPARATE",
    waitlistEnabled: event.waitlistEnabled,
    allowAdminIncrease: event.allowAdminIncrease,
    passTypes: tiers,
  };
}

/**
 * Creates a short-lived checkout hold.
 * All counters and the reservation record change atomically in one transaction.
 */
export async function createCapacityHold(input: {
  eventId: string;
  passTypeId: string;
  quantity: number;
  buyerId?: string;
  pricingPhaseId?: string;
}) {
  if (!Number.isInteger(input.quantity) || input.quantity < 1) {
    throw new CapacityError("INVALID_QUANTITY", "Quantity must be a positive integer.", 400);
  }

  return prisma.$transaction(async (tx) => {
    const event = await tx.event.findUnique({ where: { id: input.eventId } });
    if (!event) throw new CapacityError("EVENT_NOT_FOUND", "Event was not found.", 404);

    const pass = await tx.passType.findFirst({
      where: { id: input.passTypeId, eventId: input.eventId },
    });
    if (!pass) throw new CapacityError("PASS_NOT_FOUND", "Pass type was not found for this event.", 404);
    if (!pass.isActive) throw new CapacityError("PASS_INACTIVE", "This pass is not currently available.");
    if (input.quantity > pass.maxPerOrder) {
      throw new CapacityError("ORDER_LIMIT", `This pass allows at most ${pass.maxPerOrder} per order.`);
    }

    const sellableEvent = event.venueCapacity - event.operationalReserve;
    if (event.soldCount + event.heldCount + input.quantity > sellableEvent) {
      throw new CapacityError("EVENT_CAPACITY_REACHED", "Not enough event capacity remains.");
    }

    if (pass.capacity !== null && pass.soldCount + pass.heldCount + input.quantity > pass.capacity - pass.reservedAllocation) {
      throw new CapacityError("PASS_CAPACITY_REACHED", "Not enough capacity remains for this pass type.");
    }

    let phaseId: string | undefined;
    if (input.pricingPhaseId) {
      const phase = await tx.pricingPhase.findFirst({
        where: { id: input.pricingPhaseId, eventId: input.eventId },
      });
      if (!phase) throw new CapacityError("PHASE_NOT_FOUND", "Pricing phase was not found.", 404);
      const now = new Date();
      if (!phase.isActive || (phase.startsAt && phase.startsAt > now) || (phase.endsAt && phase.endsAt < now)) {
        throw new CapacityError("PHASE_INACTIVE", "This pricing phase is not active.");
      }
      if (phase.capacity !== null && phase.soldCount + phase.heldCount + input.quantity > phase.capacity) {
        throw new CapacityError("PHASE_CAPACITY_REACHED", "This pricing phase has sold out.");
      }
      phaseId = phase.id;
      await tx.pricingPhase.update({
        where: { id: phase.id },
        data: { heldCount: { increment: input.quantity } },
      });
    }

    await tx.event.update({
      where: { id: event.id },
      data: { heldCount: { increment: input.quantity } },
    });

    await tx.passType.update({
      where: { id: pass.id },
      data: { heldCount: { increment: input.quantity } },
    });

    const reservation = await tx.capacityReservation.create({
      data: {
        eventId: event.id,
        passTypeId: pass.id,
        pricingPhaseId: phaseId,
        quantity: input.quantity,
        buyerId: input.buyerId,
        status: "HELD",
        expiresAt: new Date(Date.now() + HOLD_MINUTES * 60_000),
      },
    });

    await tx.capacityAuditLog.create({
      data: {
        eventId: event.id,
        actorId: input.buyerId ?? "system:checkout",
        action: "RESERVATION_CREATED",
        entityType: "CapacityReservation",
        entityId: reservation.id,
        afterData: JSON.stringify({
          quantity: input.quantity,
          passTypeId: pass.id,
          pricingPhaseId: phaseId ?? null,
        }),
      },
    });

    return reservation;
  }, { timeout: 10_000 });
}

export async function confirmCapacityHold(reservationId: string, eventId: string) {
  return prisma.$transaction(async (tx) => {
    const reservation = await tx.capacityReservation.findFirst({ where: { id: reservationId, eventId } });
    if (!reservation) throw new CapacityError("RESERVATION_NOT_FOUND", "Reservation was not found.", 404);
    if (reservation.status !== "HELD") throw new CapacityError("INVALID_RESERVATION_STATE", "Only active holds can be confirmed.");
    if (reservation.expiresAt && reservation.expiresAt <= new Date()) throw new CapacityError("HOLD_EXPIRED", "This checkout hold has expired.");

    await tx.event.update({
      where: { id: eventId },
      data: {
        heldCount: { decrement: reservation.quantity },
        soldCount: { increment: reservation.quantity },
      },
    });

    await tx.passType.update({
      where: { id: reservation.passTypeId },
      data: {
        heldCount: { decrement: reservation.quantity },
        soldCount: { increment: reservation.quantity },
      },
    });

    if (reservation.pricingPhaseId) {
      await tx.pricingPhase.update({
        where: { id: reservation.pricingPhaseId },
        data: {
          heldCount: { decrement: reservation.quantity },
          soldCount: { increment: reservation.quantity },
        },
      });
    }

    const updated = await tx.capacityReservation.update({
      where: { id: reservation.id },
      data: { status: "CONFIRMED", confirmedAt: new Date(), expiresAt: null },
    });

    await tx.capacityAuditLog.create({
      data: {
        eventId,
        actorId: "system:payment",
        action: "RESERVATION_CONFIRMED",
        entityType: "CapacityReservation",
        entityId: reservation.id,
        afterData: JSON.stringify({ quantity: reservation.quantity }),
      },
    });

    return updated;
  });
}

export async function cancelCapacityHold(reservationId: string, eventId: string, actorId: string) {
  return prisma.$transaction(async (tx) => {
    const reservation = await tx.capacityReservation.findFirst({ where: { id: reservationId, eventId } });
    if (!reservation) throw new CapacityError("RESERVATION_NOT_FOUND", "Reservation was not found.", 404);
    if (reservation.status !== "HELD") throw new CapacityError("INVALID_RESERVATION_STATE", "Only active holds can be cancelled by this endpoint.");

    await tx.event.update({
      where: { id: eventId },
      data: { heldCount: { decrement: reservation.quantity } },
    });

    await tx.passType.update({
      where: { id: reservation.passTypeId },
      data: { heldCount: { decrement: reservation.quantity } },
    });

    if (reservation.pricingPhaseId) {
      await tx.pricingPhase.update({
        where: { id: reservation.pricingPhaseId },
        data: { heldCount: { decrement: reservation.quantity } },
      });
    }

    const updated = await tx.capacityReservation.update({
      where: { id: reservation.id },
      data: { status: "CANCELLED", cancelledAt: new Date(), expiresAt: null },
    });

    await tx.capacityAuditLog.create({
      data: {
        eventId,
        actorId,
        action: "RESERVATION_CANCELLED",
        entityType: "CapacityReservation",
        entityId: reservation.id,
        afterData: JSON.stringify({ quantity: reservation.quantity }),
      },
    });

    return updated;
  });
}

/** Run from a scheduled job or cron periodically */
export async function expireCapacityHolds() {
  const expired = await prisma.capacityReservation.findMany({
    where: { status: "HELD", expiresAt: { lte: new Date() } },
    take: 200,
    orderBy: { expiresAt: "asc" },
  });

  let count = 0;
  for (const reservation of expired) {
    try {
      await prisma.$transaction(async (tx) => {
        const fresh = await tx.capacityReservation.findUnique({ where: { id: reservation.id } });
        if (!fresh || fresh.status !== "HELD" || !fresh.expiresAt || fresh.expiresAt > new Date()) return;

        await tx.event.update({
          where: { id: fresh.eventId },
          data: { heldCount: { decrement: fresh.quantity } },
        });

        await tx.passType.update({
          where: { id: fresh.passTypeId },
          data: { heldCount: { decrement: fresh.quantity } },
        });

        if (fresh.pricingPhaseId) {
          await tx.pricingPhase.update({
            where: { id: fresh.pricingPhaseId },
            data: { heldCount: { decrement: fresh.quantity } },
          });
        }

        await tx.capacityReservation.update({
          where: { id: fresh.id },
          data: { status: "EXPIRED", expiresAt: null },
        });

        await tx.capacityAuditLog.create({
          data: {
            eventId: fresh.eventId,
            actorId: "system:expiry-worker",
            action: "RESERVATION_EXPIRED",
            entityType: "CapacityReservation",
            entityId: fresh.id,
            afterData: JSON.stringify({ quantity: fresh.quantity }),
          },
        });

        count++;
      });
    } catch (error) {
      console.error("Failed to expire hold", reservation.id, error);
    }
  }
  return { expired: count };
}
