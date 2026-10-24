import React from "react";

type Props = {
  status: string;
  className?: string;
};

export function TicketStatusBadge({ status, className = "" }: Props) {
  const norm = (status || "OPEN").toUpperCase().replace(/_/g, " ");

  let colors = "bg-neutral-800 text-neutral-300 border-neutral-700";

  if (norm.includes("OPEN") || norm.includes("NEW")) {
    colors = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  } else if (norm.includes("PROGRESS") || norm.includes("TRIAGED")) {
    colors = "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
  } else if (norm.includes("WAITING") || norm.includes("USER")) {
    colors = "bg-amber-500/10 text-amber-400 border-amber-500/30";
  } else if (norm.includes("ESCALATED")) {
    colors = "bg-purple-500/10 text-purple-400 border-purple-500/30";
  } else if (norm.includes("RESOLVED")) {
    colors = "bg-teal-500/10 text-teal-400 border-teal-500/30";
  } else if (norm.includes("CLOSED")) {
    colors = "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${colors} ${className}`}
    >
      {norm}
    </span>
  );
}
