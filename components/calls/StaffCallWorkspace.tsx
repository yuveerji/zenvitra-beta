'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Video, 
  Mic, 
  PhoneOff, 
  Radio, 
  Users, 
  Clock, 
  Calendar, 
  ShieldAlert, 
  ShieldCheck, 
  RefreshCw, 
  Search, 
  Filter, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertTriangle, 
  Activity, 
  Settings, 
  Sliders, 
  CheckCircle2, 
  XCircle,
  Eye,
  Plus,
  Play,
  Share2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  CallSessionItem, 
  CallMeetingItem, 
  CallReportItem, 
  CallPolicyData 
} from '@/types/call';

export function StaffCallWorkspace() {
  const { user, profile } = useAuth();
  const operatorName = profile?.display_name || user?.name || 'Operations Officer';

  // State
  const [activeTab, setActiveTab] = useState<'active_calls' | 'meetings' | 'reports' | 'diagnostics'>('active_calls');
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Data states
  const [sessions, setSessions] = useState<CallSessionItem[]>([]);
  const [meetings, setMeetings] = useState<CallMeetingItem[]>([]);
  const [reports, setReports] = useState<CallReportItem[]>([]);
  const [policy, setPolicy] = useState<CallPolicyData | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [reportStatusFilter, setReportStatusFilter] = useState<string>('ALL');

  // Action states
  const [terminatingSessionId, setTerminatingSessionId] = useState<string | null>(null);
  const [updatingReportId, setUpdatingReportId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sessRes, meetRes, repRes, polRes] = await Promise.all([
        fetch('/api/calls/sessions'),
        fetch('/api/calls/meetings'),
        fetch('/api/calls/reports'),
        fetch('/api/calls/policy')
      ]);

      const [sessData, meetData, repData, polData] = await Promise.all([
        sessRes.json(),
        meetRes.json(),
        repRes.json(),
        polRes.json()
      ]);

      if (sessData.success && Array.isArray(sessData.sessions)) {
        setSessions(sessData.sessions);
      }
      if (meetData.success && Array.isArray(meetData.meetings)) {
        setMeetings(meetData.meetings);
      }
      if (repData.success && Array.isArray(repData.reports)) {
        setReports(repData.reports);
      }
      if (polData.success && polData.policy) {
        setPolicy(polData.policy);
      }
    } catch (err) {
      console.error('Failed to load calling operational data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll every 8 seconds for real-time monitoring
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTerminateSession = async (sessionId: string) => {
    if (!confirm('EMERGENCY TERMINATION: Are you sure you want to forcibly disconnect this call session immediately?')) {
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

  const handleUpdateReportStatus = async (reportId: string, newStatus: string) => {
    try {
      setUpdatingReportId(reportId);
      const res = await fetch('/api/calls/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus as any } : r));
      } else {
        alert(data.error || 'Failed to update report status');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating report');
    } finally {
      setUpdatingReportId(null);
    }
  };

  // Filtered lists
  const activeSessions = sessions.filter(s => s.status !== 'ENDED');
  const filteredSessions = sessions.filter(s => {
    if (typeFilter !== 'ALL' && s.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.roomCode.toLowerCase().includes(q) ||
        s.hostName.toLowerCase().includes(q) ||
        s.callNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredMeetings = meetings.filter(m => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.meetingId.toLowerCase().includes(q) ||
        m.hostName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingReportsCount = reports.filter(r => r.status === 'PENDING').length;
  const filteredReports = reports.filter(r => {
    if (reportStatusFilter !== 'ALL' && r.status !== reportStatusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.reason.toLowerCase().includes(q) ||
        r.reporterName.toLowerCase().includes(q) ||
        r.sessionId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#070913] border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.06)] relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>LIVE SESSIONS</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-3xl font-black text-white mt-1.5 font-mono tracking-tight flex items-baseline gap-2">
            <span>{activeSessions.length}</span>
            <span className="text-xs text-neutral-500 font-normal">in progress</span>
          </div>
          <div className="text-[11px] text-cyan-400/80 font-mono mt-1">
            {sessions.filter(s => s.status === 'CONNECTED').length} connected · {sessions.filter(s => s.status === 'RINGING').length} ringing
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#070913] border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>SCHEDULED MEETINGS</span>
            <Calendar className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-3xl font-black text-white mt-1.5 font-mono tracking-tight flex items-baseline gap-2">
            <span>{meetings.filter(m => m.status === 'SCHEDULED').length}</span>
            <span className="text-xs text-neutral-500 font-normal">upcoming</span>
          </div>
          <div className="text-[11px] text-neutral-400 font-mono mt-1">
            Total {meetings.length} booked rooms
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#070913] border border-rose-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>ABUSE REPORTS</span>
            <ShieldAlert className={`w-4 h-4 ${pendingReportsCount > 0 ? 'text-rose-400 animate-bounce' : 'text-neutral-500'}`} />
          </div>
          <div className="text-3xl font-black text-white mt-1.5 font-mono tracking-tight flex items-baseline gap-2">
            <span className={pendingReportsCount > 0 ? 'text-rose-400' : 'text-white'}>{pendingReportsCount}</span>
            <span className="text-xs text-neutral-500 font-normal">pending triage</span>
          </div>
          <div className="text-[11px] text-neutral-400 font-mono mt-1">
            Total {reports.length} security flags
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#070913] border border-emerald-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>WEBRTC RELAY MESH</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 mt-2 font-mono tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>OPERATIONAL</span>
          </div>
          <div className="text-[11px] text-neutral-400 font-mono mt-1">
            STUN / TURN Active · RTT ~24ms
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 font-mono text-xs">
          <button
            onClick={() => setActiveTab('active_calls')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'active_calls'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Active Calls ({activeSessions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('meetings')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'meetings'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Meetings Desk ({meetings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'reports'
                ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Abuse Reports ({pendingReportsCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'diagnostics'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Diagnostics</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rooms, handles, codes..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 w-52"
            />
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition"
            title="Refresh calling stream"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/meet/new"
            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Meeting</span>
          </Link>
        </div>
      </div>

      {/* TAB 1: ACTIVE CALLS */}
      {activeTab === 'active_calls' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-neutral-400">Filter Type:</span>
              {(['ALL', 'VOICE', 'VIDEO', 'MEET', 'STAGE', 'ROOM'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition ${
                    typeFilter === t
                      ? 'bg-white/20 text-white font-bold'
                      : 'bg-white/5 text-neutral-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <span className="text-[11px] font-mono text-neutral-500">
              Showing {filteredSessions.length} total sessions
            </span>
          </div>

          {filteredSessions.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#05060b] border border-white/10">
              <Video className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
              <div className="text-sm font-mono text-neutral-400">No matching call sessions found</div>
              <div className="text-xs text-neutral-600 mt-1">Start a call from ZEN.CALL or schedule one via ZEN.MEET</div>
              <div className="mt-4 flex items-center justify-center gap-3">
                <Link
                  href="/call"
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30 transition"
                >
                  Launch ZEN.VOICE/VIDEO
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredSessions.map((s) => {
                const isLive = s.status !== 'ENDED';
                const durationMinutes = Math.floor(s.durationSeconds / 60);

                return (
                  <div
                    key={s.id}
                    className={`p-4 rounded-2xl border transition relative flex flex-col justify-between ${
                      isLive 
                        ? 'bg-[#060812] border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.08)]' 
                        : 'bg-[#05060a] border-white/5 opacity-75'
                    }`}
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider ${
                          s.type === 'STAGE' 
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : s.type === 'VIDEO'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : s.type === 'VOICE'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}>
                          {s.type}
                        </span>

                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          {isLive ? (
                            <span className="flex items-center gap-1 text-emerald-400 font-bold">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              <span>{s.status}</span>
                            </span>
                          ) : (
                            <span className="text-neutral-500">ENDED</span>
                          )}
                        </div>
                      </div>

                      {/* Title & Call Number */}
                      <h4 className="text-sm font-bold text-white font-sans line-clamp-1">{s.title}</h4>
                      <div className="text-[11px] font-mono text-neutral-400 mt-0.5 flex items-center gap-2">
                        <span>{s.callNumber}</span>
                        <span>·</span>
                        <span>Room: <code className="text-cyan-300">{s.roomCode}</code></span>
                      </div>

                      {/* Host & Participants */}
                      <div className="mt-3.5 space-y-1.5 text-xs font-mono text-neutral-300 border-t border-white/5 pt-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500 text-[11px]">Host:</span>
                          <span className="text-white font-medium">{s.hostName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500 text-[11px]">Participants:</span>
                          <span className="text-white font-bold flex items-center gap-1">
                            <Users className="w-3 h-3 text-cyan-400" />
                            <span>{s.participantsCount || 1}</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500 text-[11px]">Elapsed:</span>
                          <span className="text-neutral-300 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-neutral-500" />
                            <span>{durationMinutes}m {s.durationSeconds % 60}s</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                      <button
                        onClick={() => copyToClipboard(`${window.location.origin}/call?room=${s.roomCode}`, s.id)}
                        className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 text-[11px] font-mono transition flex items-center gap-1"
                        title="Copy invite URL"
                      >
                        {copiedId === s.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === s.id ? 'Copied' : 'Invite'}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        {isLive && (
                          <button
                            onClick={() => handleTerminateSession(s.id)}
                            disabled={terminatingSessionId === s.id}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-[11px] font-mono font-bold transition flex items-center gap-1"
                            title="Force terminate call"
                          >
                            <PhoneOff className="w-3 h-3" />
                            <span>{terminatingSessionId === s.id ? 'Stopping...' : 'Kill Call'}</span>
                          </button>
                        )}

                        <Link
                          href={s.type === 'STAGE' ? `/stage/${s.roomCode}` : `/call?room=${s.roomCode}`}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 text-cyan-300 text-[11px] font-mono font-bold transition flex items-center gap-1"
                        >
                          <Play className="w-3 h-3" />
                          <span>Join</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SCHEDULED MEETINGS */}
      {activeTab === 'meetings' && (
        <div className="space-y-4">
          {filteredMeetings.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#05060b] border border-white/10">
              <Calendar className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
              <div className="text-sm font-mono text-neutral-400">No scheduled meetings found</div>
              <div className="text-xs text-neutral-600 mt-1">Plan a committee debate, personal briefing, or webinar</div>
              <div className="mt-4">
                <Link
                  href="/meet/new"
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30 transition"
                >
                  Schedule New Meeting
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[#05060b] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-white/5 border-b border-white/10 text-neutral-400">
                    <tr>
                      <th className="p-3.5 font-bold">MEETING CODE</th>
                      <th className="p-3.5 font-bold">TITLE &amp; HOST</th>
                      <th className="p-3.5 font-bold">TYPE</th>
                      <th className="p-3.5 font-bold">START TIME</th>
                      <th className="p-3.5 font-bold">SECURITY</th>
                      <th className="p-3.5 font-bold">STATUS</th>
                      <th className="p-3.5 font-bold text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredMeetings.map((m) => {
                      const startDate = new Date(m.scheduledStart);
                      const isPast = startDate < new Date();

                      return (
                        <tr key={m.id} className="hover:bg-white/[0.02] transition">
                          <td className="p-3.5 font-bold text-cyan-300">
                            <code>{m.meetingId}</code>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-white font-sans">{m.title}</div>
                            <div className="text-[11px] text-neutral-400 font-mono">By {m.hostName}</div>
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-neutral-300">
                              {m.type}
                            </span>
                          </td>
                          <td className="p-3.5 text-neutral-300">
                            <div>{startDate.toLocaleDateString()}</div>
                            <div className="text-[10px] text-neutral-500">{startDate.toLocaleTimeString()}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-1.5 text-[10px]">
                              {m.passcode && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  PASSCODE
                                </span>
                              )}
                              {m.waitingRoom && (
                                <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                  LOBBY
                                </span>
                              )}
                              {!m.passcode && !m.waitingRoom && (
                                <span className="text-neutral-500">OPEN</span>
                              )}
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              m.status === 'LIVE'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : m.status === 'SCHEDULED'
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                : 'bg-neutral-800 text-neutral-400'
                            }`}>
                              {m.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => copyToClipboard(`${window.location.origin}/meet/${m.meetingId}`, m.id)}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition"
                                title="Copy meeting link"
                              >
                                {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>

                              <Link
                                href={`/meet/${m.meetingId}`}
                                className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/30 transition flex items-center gap-1"
                              >
                                <Play className="w-3 h-3" />
                                <span>Lobby</span>
                              </Link>
                            </div>
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
      )}

      {/* TAB 3: ABUSE REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-neutral-400">Status Filter:</span>
              {(['ALL', 'PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setReportStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition ${
                    reportStatusFilter === st
                      ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30'
                      : 'bg-white/5 text-neutral-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <span className="text-[11px] font-mono text-neutral-500">
              {filteredReports.length} incident reports
            </span>
          </div>

          {filteredReports.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#05060b] border border-white/10">
              <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
              <div className="text-sm font-mono text-neutral-300">Clean Incident Log</div>
              <div className="text-xs text-neutral-500 mt-1">No reported misconduct or call violations found in this queue.</div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReports.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-2xl bg-[#060812] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.status === 'PENDING'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : r.status === 'INVESTIGATING'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : r.status === 'RESOLVED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {r.status}
                      </span>
                      <span className="text-neutral-500 text-[11px]">Session:</span>
                      <code className="text-cyan-300">{r.sessionId}</code>
                      <span className="text-neutral-500 text-[11px]">·</span>
                      <span className="text-neutral-400 text-[11px]">{new Date(r.createdAt).toLocaleString()}</span>
                    </div>

                    <div className="text-white font-sans text-sm font-semibold pt-1">
                      Reason: "{r.reason}"
                    </div>

                    <div className="text-neutral-400 text-[11px]">
                      Reporter: <span className="text-white font-medium">{r.reporterName}</span>
                      {r.reportedUserId && (
                        <span> · Reported User: <span className="text-rose-300">{r.reportedUserId}</span></span>
                      )}
                    </div>
                  </div>

                  {/* Triage buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    {r.status !== 'INVESTIGATING' && r.status !== 'RESOLVED' && (
                      <button
                        onClick={() => handleUpdateReportStatus(r.id, 'INVESTIGATING')}
                        disabled={updatingReportId === r.id}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold transition"
                      >
                        Investigate
                      </button>
                    )}

                    {r.status !== 'RESOLVED' && (
                      <button
                        onClick={() => handleUpdateReportStatus(r.id, 'RESOLVED')}
                        disabled={updatingReportId === r.id}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold transition flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolve</span>
                      </button>
                    )}

                    {r.status !== 'DISMISSED' && (
                      <button
                        onClick={() => handleUpdateReportStatus(r.id, 'DISMISSED')}
                        disabled={updatingReportId === r.id}
                        className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 transition"
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: DIAGNOSTICS & RELAY MESH */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#060812] border border-cyan-500/20 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-bold text-white font-mono">Signaling &amp; ICE Network</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                  HEALTHY
                </span>
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                  <span className="text-neutral-400">STUN Server Pool:</span>
                  <span className="text-emerald-400 font-bold">stun.l.google.com:19302</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                  <span className="text-neutral-400">TURN Relay Fallback:</span>
                  <span className="text-cyan-300">Active (Geo-Distributed)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                  <span className="text-neutral-400">Average RTT Ping:</span>
                  <span className="text-emerald-400 font-bold">24 ms</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                  <span className="text-neutral-400">ICE Candidate Harvesting:</span>
                  <span className="text-white">Host + Server Reflexive</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#060812] border border-purple-500/20 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-bold text-white font-mono">Media Engine &amp; Codecs</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">
                  OPTIMAL
                </span>
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                  <span className="text-neutral-400">Audio Codec:</span>
                  <span className="text-white font-bold">Opus 48 kHz (Stereo)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                  <span className="text-neutral-400">Video Codec:</span>
                  <span className="text-purple-300 font-bold">VP9 / AV1 Simulcast</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                  <span className="text-neutral-400">Noise Suppression:</span>
                  <span className="text-emerald-400">DSP Echo Cancellation</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                  <span className="text-neutral-400">End-to-End Encryption:</span>
                  <span className="text-emerald-400 font-bold">DTLS-SRTP Enabled</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-xs font-bold text-white font-mono">Hardware &amp; Stream Configuration</div>
                <div className="text-[11px] text-neutral-400">Test microphone levels, camera feed, and virtual backgrounds.</div>
              </div>
            </div>

            <Link
              href="/call/settings"
              className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 text-cyan-300 font-mono text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Launch Device Inspector</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
