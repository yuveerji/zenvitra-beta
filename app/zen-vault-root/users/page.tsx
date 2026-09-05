'use client';

import React, { useState, useEffect } from 'react';
import { Users, Crown, ShieldAlert, CheckCircle2, Search, Plus, Save, Award } from 'lucide-react';
import { getAllUserOverrides, saveUserOverride, UserNodeOverride } from '@/lib/founderControl';

export default function SovereignUsersPage() {
  const [userOverrides, setUserOverrides] = useState<Record<string, UserNodeOverride>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [targetHandle, setTargetHandle] = useState('');
  const [targetRole, setTargetRole] = useState<any>('ADMIN');
  const [targetBadge, setTargetBadge] = useState<any>('GOLD');
  const [pointsAmount, setPointsAmount] = useState('5000');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setUserOverrides(getAllUserOverrides());
  }, []);

  const notify = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetHandle.trim()) return;
    const pts = parseInt(pointsAmount, 10) || 0;
    const updated = saveUserOverride(targetHandle, {
      role: targetRole,
      verifiedBadge: targetBadge,
      extraCivicPoints: pts,
      banned: targetRole === 'SUSPENDED',
    });
    setUserOverrides(getAllUserOverrides());
    setTargetHandle('');
    notify(`Node @${updated.username} elevated to ${updated.role} (Badge: ${updated.verifiedBadge}, +${pts} PTS)`);
  };

  const filteredNodes = Object.values(userOverrides).filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/30">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>SOVEREIGN NODE REGISTRY</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold font-mono text-white tracking-wide uppercase">
            User Identities &amp; Clearances
          </h1>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            Real-time ledger of verified delegates, creators, press nodes, and core architects.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3.5 py-1.5 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold">
            👑 ROOT CLEARANCE (@yuveer)
          </span>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs flex items-center gap-2 shadow">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Quick Promotion Form */}
      <form onSubmit={handleSave} className="p-6 rounded-3xl bg-[#080a10] border border-white/10 space-y-4 font-mono text-xs">
        <h3 className="font-bold text-white uppercase text-sm flex items-center gap-2">
          <Plus className="w-4 h-4 text-cyan-400" />
          <span>Direct Node Clearance &amp; Faucet Elevation</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            required
            value={targetHandle}
            onChange={(e) => setTargetHandle(e.target.value)}
            placeholder="Target @handle"
            className="px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white focus:outline-none focus:border-cyan-400"
          />

          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value as any)}
            className="px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="FOUNDER">👑 FOUNDER (Supreme Root)</option>
            <option value="ADMIN">🛡️ ADMIN (Operational Console)</option>
            <option value="MODERATOR">⚖️ MODERATOR (Disputes &amp; Feed)</option>
            <option value="ORGANIZER">🏛️ ORGANIZER (Chamber Lead)</option>
            <option value="DELEGATE">📜 DELEGATE (Standard Node)</option>
            <option value="SUSPENDED">🚫 SUSPENDED (Ban from Mesh)</option>
          </select>

          <select
            value={targetBadge}
            onChange={(e) => setTargetBadge(e.target.value as any)}
            className="px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="GOLD">🏅 GOLD Checkmark</option>
            <option value="BLUE">🔹 BLUE Checkmark</option>
            <option value="NONE">❌ No Badge</option>
          </select>

          <input
            type="number"
            value={pointsAmount}
            onChange={(e) => setPointsAmount(e.target.value)}
            placeholder="Points Amount"
            className="px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition shadow flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 fill-black" />
            <span>Apply Clearance</span>
          </button>
        </div>
      </form>

      {/* Directory Table */}
      <div className="p-6 rounded-3xl border border-white/10 bg-[#06070a]/90 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <span className="font-mono text-xs font-bold text-neutral-400 uppercase">
            Active Registry ({filteredNodes.length} nodes)
          </span>

          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search handle or role..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-black border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto font-mono text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 text-[10px] uppercase">
                <th className="pb-3 px-3">Identity</th>
                <th className="pb-3 px-3">Role</th>
                <th className="pb-3 px-3">Badge</th>
                <th className="pb-3 px-3">Civic Points</th>
                <th className="pb-3 px-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredNodes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-500 font-mono">
                    No custom node overrides registered. Add a user above.
                  </td>
                </tr>
              ) : (
                filteredNodes.map((u) => (
                  <tr key={u.username} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center font-bold text-white uppercase text-[11px]">
                          {u.username[0]}
                        </div>
                        <span className="font-semibold text-white">@{u.username}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`text-[11px] ${u.verifiedBadge === 'GOLD' ? 'text-amber-400 font-bold' : u.verifiedBadge === 'BLUE' ? 'text-blue-400 font-bold' : 'text-neutral-500'}`}>
                        {u.verifiedBadge}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-emerald-400 font-bold">
                      +{u.extraCivicPoints || 0} PTS
                    </td>
                    <td className="py-3.5 px-3">
                      <button
                        type="button"
                        onClick={() => {
                          saveUserOverride(u.username, { role: 'DELEGATE', verifiedBadge: 'NONE', extraCivicPoints: 0 });
                          setUserOverrides(getAllUserOverrides());
                          notify(`Reset override for @${u.username}`);
                        }}
                        className="text-neutral-400 hover:text-white transition text-xs"
                      >
                        Reset
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
