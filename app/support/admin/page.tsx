import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSupportActor } from "@/lib/support/auth";
import { hasPermission } from "@/lib/support/permissions";
import { TicketStatusBadge } from "@/components/support/TicketStatusBadge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  LifeBuoy, 
  ShieldCheck, 
  ArrowLeft, 
  Lock, 
  Filter, 
  Clock, 
  Users, 
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Inbox
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SupportAdminPage() {
  const actor = await getSupportActor();

  if (!actor) redirect("/login");

  if (!hasPermission(actor.role, "support:read:all")) {
    redirect("/support");
  }

  const canReadSensitive = hasPermission(actor.role, "support:read:sensitive");

  const tickets = await prisma.supportTicket.findMany({
    where: canReadSensitive ? {} : { isSensitive: false },
    orderBy: [
      { priority: "desc" },
      { updatedAt: "desc" },
    ],
    take: 100,
    select: {
      id: true,
      ticketNumber: true,
      requesterUserId: true,
      userName: true,
      userEmail: true,
      subject: true,
      category: true,
      priority: true,
      status: true,
      assignedToUserId: true,
      assignedToName: true,
      isSensitive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const counts = await prisma.supportTicket.groupBy({
    by: ["status"],
    _count: { _all: true },
    where: canReadSensitive ? {} : { isSensitive: false },
  });

  const statusMap = counts.reduce((acc, curr) => {
    acc[curr.status] = curr._count._all;
    return acc;
  }, {} as Record<string, number>);

  const totalTickets = tickets.length;
  const openCount = (statusMap["OPEN"] || 0) + (statusMap["NEW"] || 0);
  const inProgressCount = statusMap["IN_PROGRESS"] || 0;
  const waitingCount = (statusMap["WAITING_ON_USER"] || 0) + (statusMap["WAITING_USER"] || 0);
  const resolvedCount = (statusMap["RESOLVED"] || 0) + (statusMap["CLOSED"] || 0);

  return (
    <div className="min-h-screen bg-[#030407] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header Breadcrumbs & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <Link href="/support" className="text-neutral-400 hover:text-white transition flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Support Home
              </Link>
              <span>/</span>
              <span className="uppercase tracking-wider">Internal Operations Desk</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-cyan-400 bg-clip-text text-transparent flex items-center gap-3">
              <LifeBuoy className="w-8 h-8 text-cyan-400" />
              <span>ZEN.SUPPORT Admin</span>
            </h1>
            <p className="mt-1 text-sm text-neutral-400">
              Department routing, SLA compliance, issue resolution, and restricted escalations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 font-mono text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Staff Clearance: {actor.role}</span>
            </div>

            <Link
              href="/core-team-panel/support"
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition flex items-center gap-2"
            >
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Core Workspace</span>
            </Link>
          </div>
        </div>

        {/* Status Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
              <span>Open Queue</span>
              <Inbox className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="mt-2 text-3xl font-extrabold font-mono text-emerald-400">{openCount}</p>
            <p className="mt-1 text-[11px] text-neutral-500">Requires triage or reply</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
              <span>In Progress</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="mt-2 text-3xl font-extrabold font-mono text-cyan-400">{inProgressCount}</p>
            <p className="mt-1 text-[11px] text-neutral-500">Assigned & actively handled</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
              <span>Awaiting User</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <p className="mt-2 text-3xl font-extrabold font-mono text-amber-400">{waitingCount}</p>
            <p className="mt-1 text-[11px] text-neutral-500">Waiting for user follow-up</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
              <span>Resolved</span>
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
            </div>
            <p className="mt-2 text-3xl font-extrabold font-mono text-teal-400">{resolvedCount}</p>
            <p className="mt-1 text-[11px] text-neutral-500">Completed & closed requests</p>
          </div>
        </div>

        {/* Ticket Queue Table */}
        <section className="rounded-3xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Incoming Ticket Queue ({totalTickets})
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-white/[0.02] text-neutral-400 uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="py-3.5 px-5">Ticket ID</th>
                  <th className="py-3.5 px-5">Subject</th>
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-5">Priority</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Requester</th>
                  <th className="py-3.5 px-5">Assignee</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-neutral-300">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-neutral-500 text-xs">
                      No tickets currently in queue.
                    </td>
                  </tr>
                ) : (
                  tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <Link href={`/support/${t.id}`} className="text-cyan-400 hover:underline font-bold">
                          {t.ticketNumber}
                        </Link>
                      </td>
                      <td className="py-3.5 px-5 font-sans font-medium text-white max-w-xs truncate">
                        <div className="flex items-center gap-1.5">
                          {t.isSensitive && <Lock className="w-3 h-3 text-amber-400 shrink-0" />}
                          <span className="truncate">{t.subject}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 whitespace-nowrap text-neutral-400">
                        {t.category.replace(/_/g, " ")}
                      </td>
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] ${
                            t.priority === "HIGH" || t.priority === "P1_CRITICAL"
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              : t.priority === "LOW"
                              ? "bg-neutral-500/10 text-neutral-400"
                              : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          }`}
                        >
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <TicketStatusBadge status={t.status} />
                      </td>
                      <td className="py-3.5 px-5 whitespace-nowrap text-neutral-400">
                        {t.userName || t.userEmail || "Anonymous"}
                      </td>
                      <td className="py-3.5 px-5 whitespace-nowrap text-neutral-400">
                        {t.assignedToName || <span className="text-neutral-600">Unassigned</span>}
                      </td>
                      <td className="py-3.5 px-5 whitespace-nowrap text-right">
                        <Link
                          href={`/support/${t.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition text-[11px]"
                        >
                          <span>Manage</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
