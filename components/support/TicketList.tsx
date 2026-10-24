"use client";

import React from "react";
import Link from "next/link";
import { TicketStatusBadge } from "./TicketStatusBadge";
import { Clock, MessageSquare, ArrowRight, ShieldAlert, Lock } from "lucide-react";

export type TicketSummary = {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  isSensitive?: boolean;
  updatedAt: string | Date;
  createdAt?: string | Date;
  assignedToName?: string | null;
};

export function TicketList({
  tickets,
  emptyMessage = "No support tickets found.",
}: {
  tickets: TicketSummary[];
  emptyMessage?: string;
}) {
  if (tickets.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-neutral-900/40 p-10 text-center">
        <MessageSquare className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-neutral-300">No Tickets Yet</h3>
        <p className="mt-1 text-xs text-neutral-500 max-w-sm mx-auto">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {tickets.map((ticket) => (
        <Link
          key={ticket.id}
          href={`/support/${ticket.id}`}
          className="group block rounded-2xl border border-white/10 bg-neutral-900/50 hover:bg-neutral-900/80 p-5 transition backdrop-blur-sm border-l-4 border-l-cyan-500/80 hover:border-l-cyan-400"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-cyan-400">
                {ticket.ticketNumber}
              </span>
              <span className="text-neutral-600">·</span>
              <span className="text-xs text-neutral-400 uppercase tracking-wider font-mono">
                {ticket.category.replace(/_/g, " ")}
              </span>
              {ticket.isSensitive && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Lock className="w-2.5 h-2.5" /> CONFIDENTIAL
                </span>
              )}
            </div>

            <TicketStatusBadge status={ticket.status} />
          </div>

          <h3 className="mt-2 text-base font-medium text-white group-hover:text-cyan-300 transition flex items-center justify-between">
            <span>{ticket.subject}</span>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition text-cyan-400 -translate-x-2 group-hover:translate-x-0" />
          </h3>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-neutral-400 font-mono">
            <span>Priority: <span className="text-neutral-200">{ticket.priority}</span></span>
            {ticket.assignedToName && (
              <span>Agent: <span className="text-neutral-200">{ticket.assignedToName}</span></span>
            )}
            <span className="flex items-center gap-1 text-neutral-500">
              <Clock className="w-3.5 h-3.5" />
              {new Date(ticket.updatedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
