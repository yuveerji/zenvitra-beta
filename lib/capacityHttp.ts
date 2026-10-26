import { ZodError } from "zod";
import { NextResponse } from "next/server";

export class CapacityError extends Error {
  constructor(public code: string, message: string, public status = 409) {
    super(message);
    this.name = "CapacityError";
  }
}

export function apiError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: "Validation failed", details: error.flatten() }, { status: 400 });
  }
  if (error instanceof CapacityError) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
  }
  console.error('[CAPACITY_API_ERROR]', error);
  return NextResponse.json({ error: (error as any)?.message || "Internal server error" }, { status: 500 });
}
