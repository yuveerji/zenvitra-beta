import { z } from "zod";

export const ticketCategories = [
  "ACCOUNT",
  "TECHNICAL",
  "PAYMENTS",
  "EVENTS_MUN",
  "EVENTS",
  "MUN",
  "APPLICATIONS",
  "CONDUCT",
  "SAFETY",
  "GENERAL",
] as const;

export const ticketPriorities = [
  "LOW",
  "NORMAL",
  "HIGH",
  "P1_CRITICAL",
  "P2_HIGH",
  "P3_NORMAL",
  "P4_LOW",
] as const;

export const createTicketSchema = z.object({
  subject: z.string().trim().min(3).max(150),
  description: z.string().trim().min(5).max(10000),
  category: z.string().transform((val) => {
    const upper = val.toUpperCase().trim();
    if (upper === "EVENTS" || upper === "MUN" || upper === "EVENTS_MUN") return "EVENTS_MUN";
    if (upper === "CONDUCT" || upper === "SAFETY") return "CONDUCT";
    return upper;
  }),
  priority: z.string().default("NORMAL").transform((val) => {
    const upper = val.toUpperCase().trim();
    if (upper.includes("HIGH") || upper.includes("P1") || upper.includes("P2")) return "HIGH";
    if (upper.includes("LOW") || upper.includes("P4")) return "LOW";
    return "NORMAL";
  }),
  relatedModule: z.string().trim().max(80).optional(),
  isSensitive: z.boolean().optional().default(false),
});

export const replySchema = z.object({
  body: z.string().trim().min(1).max(10000),
  isInternal: z.boolean().default(false),
});

export const updateTicketSchema = z.object({
  status: z.enum([
    "NEW",
    "OPEN",
    "TRIAGED",
    "IN_PROGRESS",
    "WAITING_ON_USER",
    "WAITING_USER",
    "ESCALATED",
    "RESOLVED",
    "CLOSED",
  ]).optional(),
  priority: z.enum(ticketPriorities).optional(),
  assignedToUserId: z.string().min(1).nullable().optional(),
  isSensitive: z.boolean().optional(),
}).refine(
  (value) => Object.values(value).some((v) => v !== undefined),
  "At least one update is required."
);
