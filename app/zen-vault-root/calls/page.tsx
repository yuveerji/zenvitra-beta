'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Crown, 
  ShieldAlert, 
  Sliders, 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Check, 
  X, 
  ArrowLeft, 
  Lock,
  Unlock,
  Video,
  Mic,
  PhoneOff,
  Users,
  Share2,
  Disc,
  ExternalLink,
  ShieldCheck,
  Flame,
  Radio,
  Eye,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isFounder, isFounderSessionActive } from '@/lib/founderControl';
import { CallPolicyData, CallSessionItem } from '@/types/call';

export default function FounderCallsOversightPage() {
  const { user, profile } = useAuth();
  const founderName = profile?.display_name || user?.name || '@yuveer (Founder)';

  const [policy, setPolicy] = useState<CallPolicyData | null>(null);
  const [sessions, setSessions] = useState<CallSessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingPolicy, setSavingPolicy] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states for policy
  const [callsActive, setCallsActive] = useState(true);
  const [emergencyCallLockdown, setEmergencyCallLockdown] = useState(false);
  const [screenShareAllowed, setScreenShareAllowed] = useState(true);
  const [recordingAllowed, setRecordingAllowed] = useState(true);
  const [maxParticipants, setMaxParticipants] = useState(50);
  const [p2pMeshLimit, setP2pMeshLimit] = useState(12);

  // Action state
  const [terminatingSessionId, setTerminatingSessionId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [polRes, sessRes] = await Promise.all([
        fetch('/api/calls/policy'),
        fetch('/api/calls/sessions')
      ]);

      const [polData, sessData] = await Promise.all([
        polRes.json(),
        sessRes.json()
      ]);

      if (polData.success && polData.policy) {
        setPolicy(polData.policy);
        setCallsActive(polData.policy.callsActive);
        setEmergencyCallLockdown(polData.policy.emergencyCallLockdown);
        setScreenShareAllowed(polData.policy.screenShareAllowed);
        setRecordingAllowed(polData.policy.recordingAllowed);
        setMaxParticipants(polData.policy.maxParticipantsPerCall);
        setP2pMeshLimit(polData.policy.p2pMeshLimit);
      }

      if (sessData.success && Array.isArray(sessData.sessions)) {
        setSessions(sessData.sessions);
      }
    } catch (err) {
      console.error('Failed to load founder call data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSavePolicy = async () => {
    try {
      setSavingPolicy(true);
      const res = await fetch('/api/calls/policy', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callsActive,
          emergencyCallLockdown,
          screenShareAllowed,
          recordingAllowed,
          maxParticipantsPerCall: maxParticipants,
          p2pMeshLimit
        })
      });

      const data = await res.json();
      if (data.success && data.policy) {
        setPolicy(data.policy);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert(data.error || 'Failed to update call policy');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving policy');
    } finally {
      setSavingPolicy(false);
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    if (!confirm('FOUNDER EXECUTIVE OVERRIDE: Forcibly terminate this call immediately across all peers?')) {
      return;
    }

    try {
      setTerminatingSessionId(sessionId);
      const res = await fetch(`/api/calls/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ENDED' })
      });
      const data = await res.json();
      if (data.success) {
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: 'ENDED' } : s));
      } else {
        alert(data.error || 'Failed to terminate session');
      }
    } catch (err: any) {
      alert(err.message || 'Termination error');
    } finally {
      setTerminatingSessionId(null);
    }
  };

  const activeCalls = sessions.filter(s => s.status !== 'ENDED');

  return (
    <div className="space-y-8 font-sans">
      
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/zen-vault-root"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition flex items-center gap-1.5 font-mono text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Founder Master Control</span>
          </Link>
          <span className="text-neutral-600">/</span>
          <span className="font-mono text-xs text-amber-300 font-bold flex items-center gap-1.5">
            <Video className="w-4 h-4 text-amber-400" />
            <span>ZEN.CALL Master Oversight</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/core-team-panel/calls"
            className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold transition flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Switch to Admin Desk</span>
          </Link>

          <div className="flex items-center gap-2 font-mono text-[11px] text-amber-400">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>LEVEL 0 ROOT AUTHORITY</span>
          </div>
        </div>
      </div>

      {/* Hero Master Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#070913] to-rose-950/30 border border-amber-500/30 shadow-[0_0_30px_rgba(251,191,36,0.08)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono text-xs font-black uppercase">
              ZEN.CALL ENCLAVE
            </span>
            <span className="text-neutral-400 text-xs font-mono">Module 06 of 10</span>
          </div>
          <h1 
            className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight"
            style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
          >
            Global Real-Time Communication Controls
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Configure platform-wide WebRTC mesh limits, emergency audio/video lockdowns, participant quotas, and sovereign recording policy with zero server latency.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-bold transition flex items-center gap-2 shrink-0 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync State</span>
        </button>
      </div>

      {/* Emergency Global Policies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Master Killswitches */}
        <div className="p-6 rounded-2xl bg-[#060812] border border-amber-500/30 space-y-5 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-base font-bold text-white font-mono">Platform Calling Policy</h3>
                <p className="text-neutral-400 text-xs">Live enforcement parameters across all devices and clients</p>
              </div>
            </div>

            {saveSuccess && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-xs font-bold animate-pulse">
                <Check className="w-3.5 h-3.5" />
                <span>Policy Synced</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Master Toggle */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white font-mono">Master Calls Subsystem</div>
                <div className="text-[11px] text-neutral-400">Permits voice &amp; video initiation</div>
              </div>
              <button
                type="button"
                onClick={() => setCallsActive(!callsActive)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  callsActive ? 'bg-emerald-500' : 'bg-neutral-700'
                }`}
              >
                <span
                  className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    callsActive ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Emergency Lockdown */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              emergencyCallLockdown 
                ? 'bg-rose-950/40 border-rose-500/40' 
                : 'bg-white/5 border-white/10'
            }`}>
              <div>
                <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>Emergency Lockdown</span>
                </div>
                <div className="text-[11px] text-neutral-400">Instantly blocks all AV mesh peers</div>
              </div>
              <button
                type="button"
                onClick={() => setEmergencyCallLockdown(!emergencyCallLockdown)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  emergencyCallLockdown ? 'bg-rose-600' : 'bg-neutral-700'
                }`}
              >
                <span
                  className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    emergencyCallLockdown ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Screen Share Permitted */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Screen Sharing Enabled</span>
                </div>
                <div className="text-[11px] text-neutral-400">Window, tab &amp; desktop broadcast</div>
              </div>
              <button
                type="button"
                onClick={() => setScreenShareAllowed(!screenShareAllowed)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  screenShareAllowed ? 'bg-cyan-500' : 'bg-neutral-700'
                }`}
              >
                <span
                  className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    screenShareAllowed ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Cloud Recording Permitted */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                  <Disc className="w-3.5 h-3.5 text-purple-400" />
                  <span>Meeting Recording</span>
                </div>
                <div className="text-[11px] text-neutral-400">Consent-based session archiving</div>
              </div>
              <button
                type="button"
                onClick={() => setRecordingAllowed(!recordingAllowed)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  recordingAllowed ? 'bg-purple-500' : 'bg-neutral-700'
                }`}
              >
                <span
                  className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    recordingAllowed ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Numeric Thresholds */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400">Max Participants Per Call:</span>
                <span className="text-amber-300 font-bold">{maxParticipants} delegates</span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                step="10"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(Number(e.target.value))}
                className="w-full accent-amber-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                <span>10</span>
                <span>150</span>
                <span>300 (Plenary Stage)</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400">P2P Mesh Limit (Peers):</span>
                <span className="text-cyan-300 font-bold">{p2pMeshLimit} direct streams</span>
              </div>
              <input
                type="range"
                min="4"
                max="25"
                step="1"
                value={p2pMeshLimit}
                onChange={(e) => setP2pMeshLimit(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                <span>4 (Low Bandwidth)</span>
                <span>12 (Default)</span>
                <span>25 (High Capacity)</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end">
            <button
              onClick={handleSavePolicy}
              disabled={savingPolicy}
              className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black tracking-wider uppercase transition shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {savingPolicy ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              <span>Commit Policy to Root Vault</span>
            </button>
          </div>
        </div>

        {/* Card 2: Privacy & Security Guardrails */}
        <div className="p-6 rounded-2xl bg-[#060812] border border-white/10 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white font-mono">Privacy Enclave Guarantees</h3>
          </div>

          <div className="space-y-3 font-mono text-xs text-neutral-300">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5 text-[11px]">
                <Check className="w-3.5 h-3.5" />
                <span>Zero Silent Activation</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Microphones, cameras, and screens are strictly guarded by explicit browser permission gates and visible on-screen states.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5 text-[11px]">
                <Check className="w-3.5 h-3.5" />
                <span>DTLS-SRTP Stream Encryption</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Audio and video payloads travel directly peer-to-peer or via ephemeral TURN relays with zero raw stream storage on server disks.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5 text-[11px]">
                <Check className="w-3.5 h-3.5" />
                <span>Immutable Telemetry Ledger</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Only call metadata (room tokens, timestamps, durations) is logged in SQLite for audit and dispute verification.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Global Call Sessions Ledger */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <span>Executive Call Sessions Ledger</span>
              <span className="text-xs font-normal text-neutral-500">({sessions.length} recorded)</span>
            </h3>
            <p className="text-neutral-400 text-xs mt-0.5">Live platform telemetry from all active and completed communication sessions</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-neutral-400">Live Active:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
              {activeCalls.length}
            </span>
          </div>
        </div>

        {sessions.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#05060b] border border-white/10">
            <Video className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
            <div className="text-sm font-mono text-neutral-400">Zero session records found</div>
            <div className="text-xs text-neutral-600 mt-1">Sessions will appear here in real-time as users join calls.</div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-[#05060b] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-neutral-400">
                  <tr>
                    <th className="p-3.5 font-bold">SESSION / CODE</th>
                    <th className="p-3.5 font-bold">ROOM TITLE</th>
                    <th className="p-3.5 font-bold">TYPE</th>
                    <th className="p-3.5 font-bold">HOST</th>
                    <th className="p-3.5 font-bold">DURATION</th>
                    <th className="p-3.5 font-bold">PEERS</th>
                    <th className="p-3.5 font-bold">STATUS</th>
                    <th className="p-3.5 font-bold text-right">OVERRIDE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sessions.map((s) => {
                    const isLive = s.status !== 'ENDED';
                    const durationMinutes = Math.floor(s.durationSeconds / 60);

                    return (
                      <tr key={s.id} className="hover:bg-white/[0.02] transition">
                        <td className="p-3.5">
                          <div className="font-bold text-white">{s.callNumber}</div>
                          <div className="text-[11px] text-cyan-300"><code>{s.roomCode}</code></div>
                        </td>
                        <td className="p-3.5 font-sans font-medium text-white max-w-xs truncate">
                          {s.title}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-neutral-300">
                            {s.type}
                          </span>
                        </td>
                        <td className="p-3.5 text-neutral-300">
                          {s.hostName}
                        </td>
                        <td className="p-3.5 text-neutral-300">
                          {durationMinutes}m {s.durationSeconds % 60}s
                        </td>
                        <td className="p-3.5">
                          <span className="flex items-center gap-1 text-neutral-300">
                            <Users className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{s.participantsCount || 1}</span>
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isLive
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-neutral-800 text-neutral-500'
                          }`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          {isLive ? (
                            <button
                              onClick={() => handleTerminateSession(s.id)}
                              disabled={terminatingSessionId === s.id}
                              className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-[11px] font-bold transition inline-flex items-center gap-1"
                            >
                              <PhoneOff className="w-3 h-3" />
                              <span>{terminatingSessionId === s.id ? 'Killing...' : 'Kill'}</span>
                            </button>
                          ) : (
                            <span className="text-neutral-600 text-[11px]">Archived</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
