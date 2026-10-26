"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, RefreshCw, AlertCircle, CheckCircle2, SlidersHorizontal, Users } from "lucide-react";

type Pass = {
  id: string;
  name: string;
  code: string;
  capacity: number | null;
  publicCapacity: number | null;
  reservedAllocation: number;
  soldCount: number;
  heldCount: number;
  committed: number;
  remaining: number;
  isActive: boolean;
};

type Snapshot = {
  venueCapacity: number;
  operationalReserve: number;
  sellableEventCapacity: number;
  soldCount: number;
  heldCount: number;
  eventRemaining: number;
  utilisationPercent: number;
  capacityMode: "SHARED" | "SEPARATE";
  passTypes: Pass[];
  waitlistEnabled?: boolean;
  allowAdminIncrease?: boolean;
};

export default function CapacityDashboard({ eventId }: { eventId: string }) {
  const [data, setData] = useState<Snapshot | null>(null);
  const [venueCapacity, setVenueCapacity] = useState(500);
  const [operationalReserve, setOperationalReserve] = useState(30);
  const [capacityMode, setCapacityMode] = useState<"SHARED" | "SEPARATE">("SHARED");
  const [waitlistEnabled, setWaitlistEnabled] = useState(false);
  const [allowAdminIncrease, setAllowAdminIncrease] = useState(false);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/events/${eventId}/capacity`, { cache: "no-store" });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error ?? "Unable to load capacity.");
      setData(json);
      setVenueCapacity(json.venueCapacity);
      setOperationalReserve(json.operationalReserve);
      setCapacityMode(json.capacityMode);
      setWaitlistEnabled(Boolean(json.waitlistEnabled));
      setAllowAdminIncrease(Boolean(json.allowAdminIncrease));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load capacity.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    void load();
  }, [load]);

  const utilization = useMemo(() => data?.utilisationPercent ?? 0, [data]);

  async function save() {
    setMessage("");
    setMessageType("");
    setIsSaving(true);
    try {
      const response = await fetch(`/api/events/${eventId}/capacity`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          venueCapacity,
          operationalReserve,
          capacityMode,
          waitlistEnabled,
          allowAdminIncrease,
          reason,
        }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error ?? "Unable to save capacity.");
      setMessage("Capacity settings saved and logged to immutable audit ledger.");
      setMessageType("success");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save capacity.");
      setMessageType("error");
    } finally {
      setIsSaving(false);
    }
  }

  if (loading && !data) {
    return (
      <main className="min-h-screen bg-[#07090e] text-neutral-100 p-6 md:p-12 font-sans flex items-center justify-center">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#0b101c] border border-white/10 text-center space-y-4 shadow-2xl">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <div className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
            ZEN EVENTS / OPERATIONS
          </div>
          <h1 className="text-2xl font-bold font-display text-white">Pass Capacity Manager</h1>
          <p className="text-sm text-neutral-400">Synchronizing real-time inventory and seat reservations...</p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#07090e] text-neutral-100 p-6 md:p-12 font-sans flex items-center justify-center">
        <div className="max-w-lg w-full p-8 rounded-3xl bg-[#0b101c] border border-rose-500/30 text-center space-y-5 shadow-2xl">
          <div className="inline-flex p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="text-xs font-mono uppercase tracking-widest text-rose-400 font-bold">
            CAPACITY RECORD NOT FOUND
          </div>
          <h1 className="text-2xl font-bold text-white">Event Capacity Unavailable</h1>
          <p className="text-sm text-neutral-400">
            {message || "The requested event capacity record could not be loaded."}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => void load()}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs uppercase tracking-wider transition"
            >
              Retry Sync
            </button>
            <Link
              href="/events"
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-mono text-xs uppercase tracking-wider border border-white/10 transition"
            >
              Back to Events
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isInvalidReserve = venueCapacity <= operationalReserve;
  const isBelowCommitted = venueCapacity < data.soldCount + data.heldCount + operationalReserve;

  return (
    <div className="min-h-screen bg-[#06080e] text-neutral-100 selection:bg-amber-400 selection:text-black">
      {/* Top Header Navigation */}
      <header className="border-b border-white/10 bg-[#080b14]/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/events/${eventId}`}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition"
              title="Return to Event"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  ZEN EVENTS • OPERATIONS ENGINE
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-400">
                  ID: {eventId}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white font-display">
                Pass Capacity &amp; Allocation Manager
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/events/${eventId}/manage`}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 text-xs font-mono flex items-center gap-1.5 transition"
            >
              <span>Host Command Center</span>
            </Link>
            <button
              onClick={() => void load()}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
        {/* Intro Subtitle */}
        <div className="space-y-1">
          <p className="text-sm text-neutral-400 max-w-3xl leading-relaxed">
            Control event-wide inventory pools, separate pass allocations, temporary 12-minute checkout holds, and protected reserve seats with atomic transactional integrity.
          </p>
        </div>

        {/* 4 Metric Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c1220] to-[#070a12] border border-white/10 shadow-lg space-y-2">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">Venue Capacity</span>
            <div className="text-3xl font-extrabold text-white font-mono">{data.venueCapacity.toLocaleString()}</div>
            <p className="text-[11px] text-neutral-500 font-mono">Approved physical / room ceiling</p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c1220] to-[#070a12] border border-white/10 shadow-lg space-y-2">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">Committed Passes</span>
            <div className="text-3xl font-extrabold text-amber-300 font-mono">
              {(data.soldCount + data.heldCount).toLocaleString()}
            </div>
            <p className="text-[11px] text-neutral-500 font-mono">
              {data.soldCount} confirmed sold • {data.heldCount} in active checkout
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c1220] to-[#070a12] border border-white/10 shadow-lg space-y-2">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">Available to Sell</span>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">
              {data.eventRemaining.toLocaleString()}
            </div>
            <p className="text-[11px] text-neutral-500 font-mono">
              {data.operationalReserve} seats reserved for speakers/secretariat
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c1220] to-[#070a12] border border-white/10 shadow-lg space-y-2">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">Utilisation Rate</span>
            <div className="text-3xl font-extrabold text-cyan-400 font-mono">{utilization}%</div>
            <p className="text-[11px] text-neutral-500 font-mono">Committed passes / sellable capacity</p>
          </div>
        </div>

        {/* Panel 1: Event Capacity Rules */}
        <section className="p-6 sm:p-7 rounded-3xl bg-[#0a0e18] border border-white/10 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white font-display">Event Capacity Rules</h2>
              <p className="text-xs text-neutral-400">
                These constraints govern all ticket tiers, delegate allocations, and live checkout locks.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-neutral-400 font-semibold">Capacity Mode:</span>
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                capacityMode === 'SHARED'
                  ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                  : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
              }`}>
                {capacityMode === 'SHARED' ? 'SHARED EVENT POOL' : 'SEPARATE PASS ALLOCATIONS'}
              </span>
            </div>
          </div>

          {/* Utilisation Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>Current Seat Saturation</span>
              <span className="font-bold text-white">{utilization}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, utilization)}%` }}
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-neutral-300">
                VENUE / SUMMIT TOTAL CAPACITY
              </label>
              <input
                type="number"
                min={1}
                value={venueCapacity}
                onChange={(e) => setVenueCapacity(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-sm font-mono text-white focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-neutral-500 font-mono">Maximum legal or physical occupancy</span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-neutral-300">
                OPERATIONAL RESERVE
              </label>
              <input
                type="number"
                min={0}
                value={operationalReserve}
                onChange={(e) => setOperationalReserve(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-sm font-mono text-white focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-neutral-500 font-mono">Withheld from public ticketing (Secretariat, VIPs, Staff)</span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-neutral-300">
                CAPACITY POOLING MODE
              </label>
              <select
                value={capacityMode}
                onChange={(e) => setCapacityMode(e.target.value as "SHARED" | "SEPARATE")}
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="SHARED">Shared Event Pool (Passes draw from common event ceiling)</option>
                <option value="SEPARATE">Separate Pass Allocations (Each pass has strict dedicated quota)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-neutral-300">
                AUDIT LOG REASON (RECOMMENDED)
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Venue floor plan approval / Added 50 seats"
                maxLength={500}
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-neutral-500 font-mono">Logged to immutable capacity ledger for compliance</span>
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <label className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3 cursor-pointer hover:bg-white/[0.05] transition">
              <input
                type="checkbox"
                checked={waitlistEnabled}
                onChange={(e) => setWaitlistEnabled(e.target.checked)}
                className="mt-1 accent-amber-400"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">Enable Waitlist</span>
                <span className="text-[11px] text-neutral-400 leading-snug block">
                  Allow delegates to queue up on priority waitlist when passes are fully committed.
                </span>
              </div>
            </label>

            <label className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3 cursor-pointer hover:bg-white/[0.05] transition">
              <input
                type="checkbox"
                checked={allowAdminIncrease}
                onChange={(e) => setAllowAdminIncrease(e.target.checked)}
                className="mt-1 accent-amber-400"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">Allow Admin Capacity Increases</span>
                <span className="text-[11px] text-neutral-400 leading-snug block">
                  Permit authorized organizers to expand capacity mid-conference with an audit reason.
                </span>
              </div>
            </label>
          </div>

          {/* Warnings */}
          {isInvalidReserve && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>Operational reserve must be strictly lower than venue capacity.</span>
            </div>
          )}

          {isBelowCommitted && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Venue capacity cannot be reduced below currently committed tickets and reserve seats ({data.soldCount + data.heldCount + operationalReserve}).</span>
            </div>
          )}

          {/* Actions & Status */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => void save()}
              disabled={isInvalidReserve || isBelowCommitted || isSaving}
              className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold font-mono text-xs uppercase tracking-wider transition cursor-pointer shadow-md"
            >
              {isSaving ? "Saving..." : "Save Capacity Rules"}
            </button>
            <button
              onClick={() => void load()}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-mono border border-white/10 transition cursor-pointer"
            >
              Cancel / Refresh
            </button>
          </div>

          {message && (
            <div className={`p-3.5 rounded-xl border text-xs font-mono flex items-center gap-2 ${
              messageType === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              {messageType === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span>{message}</span>
            </div>
          )}
        </section>

        {/* Panel 2: Pass-Type Capacity Breakdown */}
        <section className="p-6 sm:p-7 rounded-3xl bg-[#0a0e18] border border-white/10 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white font-display">Pass-Type Allocations</h2>
              <p className="text-xs text-neutral-400">
                Individual tier capacities, checkout holds, and confirmed tickets.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold">
              {data.passTypes.length} Pass Tiers
            </span>
          </div>

          {data.passTypes.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-neutral-400 bg-white/[0.02] rounded-2xl border border-white/5">
              No pass types configured for this event yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 text-[11px] uppercase">
                    <th className="pb-3 font-semibold">Pass Type &amp; Code</th>
                    <th className="pb-3 font-semibold">Tier Cap</th>
                    <th className="pb-3 font-semibold">Sold</th>
                    <th className="pb-3 font-semibold">Held (12m)</th>
                    <th className="pb-3 font-semibold">Remaining Available</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.passTypes.map((pass) => (
                    <tr key={pass.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3.5 pr-4">
                        <div className="font-bold text-white font-sans text-sm">{pass.name}</div>
                        <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                          {pass.code} • {pass.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <div className="font-bold text-white">
                          {pass.capacity === null ? 'Shared Pool' : pass.capacity.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          {pass.reservedAllocation > 0 ? `${pass.reservedAllocation} withheld` : 'No reserve'}
                        </div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <div className="font-bold text-neutral-200">{pass.soldCount.toLocaleString()}</div>
                        <div className="text-[10px] text-neutral-500">Confirmed</div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <div className="font-bold text-amber-300">{pass.heldCount.toLocaleString()}</div>
                        <div className="text-[10px] text-neutral-500">In checkout</div>
                      </td>
                      <td className="py-3.5">
                        <div className={`font-bold text-base ${
                          pass.remaining === 0 ? 'text-rose-400' : 'text-emerald-400'
                        }`}>
                          {pass.remaining.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-neutral-500">Public seats</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-neutral-400 leading-relaxed font-mono">
            💡 <strong>Shared mode</strong> allows all passes to draw dynamically from the total event capacity. <strong>Separate mode</strong> enforces individual tier quotas whose sum cannot exceed the event's total sellable capacity. Checkout holds automatically expire in 12 minutes if unconfirmed.
          </div>
        </section>

        {/* Panel 3: Capacity Invariants & Integrity Notice */}
        <section className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/20 via-black to-purple-950/20 border border-cyan-500/20 space-y-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>Cryptographic &amp; Operational Invariants Enforced</span>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-neutral-400 text-[11px] leading-relaxed">
            <li>• Sold passes + active checkout holds strictly cannot exceed venue capacity minus reserve.</li>
            <li>• Checkout holds lock seats atomically in transactional memory to prevent overselling.</li>
            <li>• Expired holds release inventory back to the available pool automatically.</li>
            <li>• Every capacity adjustment is recorded with actor ID, timestamp, and audit justification.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
