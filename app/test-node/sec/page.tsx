'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Send, 
  Sparkles,
  Calendar,
  Layers,
  FileCheck2,
  XCircle
} from 'lucide-react';
import { TestNodeProvider, useTestNode } from '@/context/TestNodeContext';
import { TestNodeShell } from '@/components/test-node/TestNodeShell';

function TestSecContent() {
  const { conference, ebApplications, updateEbApplicationStatus, activePersona } = useTestNode();

  // Simulated Alert Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim()) return;
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 4000);
    setBroadcastTitle('');
    setBroadcastMessage('');
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#0a0d18] to-black border border-purple-500/30 space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] uppercase font-bold tracking-wider">
            ZEN.SEC // DEMO SECRETARIAT COMMAND
          </span>
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
            EVENT MANAGEMENT SANDBOX
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase font-display">
          Secretariat Executive Suite &bull; {conference.shortName}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl font-sans">
          Manage simulated Executive Board recruitment workflows, assign committee quotas, dispatch emergency decrees, and oversee the master event timeline without impacting real applicants.
        </p>
      </div>

      {/* Broadcast Flash Feedback */}
      {broadcastSent && (
        <div className="p-4 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>✓ Emergency Secretariat decree transmitted across all 4 sandbox chambers!</span>
        </div>
      )}

      {/* Main Grid: EB Recruitment + Broadcast Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: EB Applications Workflow (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#080d1c] border border-white/15 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <h2 className="text-base font-bold text-white font-display">
                Executive Board Recruitment Applications
              </h2>
            </div>
            <span className="text-xs font-mono text-neutral-400">
              {ebApplications.length} Submissions
            </span>
          </div>

          <div className="space-y-3">
            {ebApplications.map((app) => {
              const isApproved = app.status === 'APPROVED';
              const isShortlisted = app.status === 'SHORTLISTED';
              const isRejected = app.status === 'REJECTED';

              return (
                <div
                  key={app.id}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 text-xs font-sans"
                >
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="font-bold text-white text-xs">{app.applicantName}</span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                        isApproved
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : isShortlisted
                          ? 'bg-amber-500/20 text-amber-300'
                          : isRejected
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-cyan-500/20 text-cyan-300'
                      }`}
                    >
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-cyan-300">
                    Target Role: <strong>{app.preferredCommittee}</strong> &bull; {app.email}
                  </div>

                  <p className="text-neutral-400 text-xs leading-relaxed italic">
                    &ldquo;{app.priorExperience}&rdquo;
                  </p>

                  {/* Secretariat Review Action Buttons */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between font-mono text-xs">
                    <span className="text-[10px] text-neutral-500">Applied: {app.appliedDate}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateEbApplicationStatus(app.id, 'APPROVED')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold transition cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => updateEbApplicationStatus(app.id, 'SHORTLISTED')}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold transition cursor-pointer"
                      >
                        Shortlist
                      </button>
                      <button
                        type="button"
                        onClick={() => updateEbApplicationStatus(app.id, 'REJECTED')}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[10px] font-bold transition cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Emergency Secretariat Broadcast Desk (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#080d1c] border border-white/15 space-y-5">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white font-display">
              Simulated Emergency Broadcast
            </h2>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-[10px] text-neutral-400 uppercase block mb-1">Decree Headline</label>
              <input
                type="text"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="e.g. UNSC Chamber Re-convening at 14:00 IST..."
                className="w-full bg-[#111422] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-[10px] text-neutral-400 uppercase block mb-1">Broadcast Details</label>
              <textarea
                rows={3}
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Enter formal Secretariat dispatch to be simulated across delegate dashboards..."
                className="w-full bg-[#111422] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast to All Chambers</span>
            </button>
          </form>

          {/* Master Run of Show */}
          <div className="space-y-2 pt-4 border-t border-white/10">
            <span className="text-xs font-mono text-white font-bold uppercase">Master Run of Show</span>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                <span className="text-neutral-400">09:00 - 10:00</span>
                <span className="text-white font-semibold">Opening Plenary &bull; Main Hall</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                <span className="text-neutral-400">10:30 - 13:00</span>
                <span className="text-cyan-300 font-semibold">Committee Session 1 &bull; Chambers</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                <span className="text-neutral-400">14:00 - 17:30</span>
                <span className="text-purple-300 font-semibold">Working Paper Deliberations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestSecPage() {
  return (
    <TestNodeProvider>
      <TestNodeShell>
        <TestSecContent />
      </TestNodeShell>
    </TestNodeProvider>
  );
}
