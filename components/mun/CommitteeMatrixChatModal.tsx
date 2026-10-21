'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Radio,
  Layers,
  X,
  Calendar,
  Shield,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  AlertCircle,
  Users,
  Settings,
  Lock,
  ArrowRight,
  Share2,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useMun } from '@/context/MunContext';
import { useMatrixChat } from '@/context/MatrixChatContext';
import { CommitteeLogoBadge } from '@/components/mun/CommitteeLogoBadges';
import { MunCommittee, MunConference } from '@/types/mun';
import { CommitteeMatrixRoom, MatrixConnectionMode } from '@/types/matrixChat';

interface CommitteeMatrixChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCommittee?: MunCommittee;
  initialConferenceId?: string;
  initialDate?: string;
}

export function CommitteeMatrixChatModal({
  isOpen,
  onClose,
  initialCommittee,
  initialConferenceId,
  initialDate
}: CommitteeMatrixChatModalProps) {
  const { user } = useAuth();
  const { conferences, activeConference } = useMun();
  const { 
    rooms, 
    loading, 
    connectMatrixRoom, 
    approveRoom, 
    rejectRoom, 
    reconfigureRoom, 
    disconnectRoom,
    openInZenChat,
    fetchRooms
  } = useMatrixChat();

  // Active Tab: 'CONNECT' | 'ROOMS' | 'SECRETARIAT' | 'AUDIT'
  const [activeTab, setActiveTab] = useState<'CONNECT' | 'ROOMS' | 'SECRETARIAT' | 'AUDIT'>('CONNECT');

  // Multi-step Wizard State
  const [selectedMunId, setSelectedMunId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedCommitteeId, setSelectedCommitteeId] = useState<string>('');
  const [connectionMode, setConnectionMode] = useState<MatrixConnectionMode>('DIRECT');
  const [discretionNotes, setDiscretionNotes] = useState<string>('');
  const [customServer, setCustomServer] = useState<string>('matrix.zenvitra.xyz');
  const [customAlias, setCustomAlias] = useState<string>('');
  
  // Status feedback
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [copiedAlias, setCopiedAlias] = useState<string | null>(null);

  // Secretariat action sub-modal
  const [reviewingRoom, setReviewingRoom] = useState<CommitteeMatrixRoom | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [approvalNotes, setApprovalNotes] = useState<string>('');

  // Check if current user is Secretariat / Admin
  const isSecretariat = useMemo(() => {
    const roles = [
      ...(user?.role ? [user.role.toUpperCase()] : []),
      ...((user as any)?.zenvitraRoles ? (user as any).zenvitraRoles.map((r: string) => r.toUpperCase()) : [])
    ];
    return roles.some(r => [
      'SECRETARIAT', 
      'SECRETARY_GENERAL', 
      'DIRECTOR_GENERAL', 
      'USG', 
      'ORGANISER', 
      'ORGANIZER', 
      'ADMIN', 
      'FOUNDER', 
      'CHAIR',
      'EXECUTIVE_BOARD'
    ].includes(r));
  }, [user]);

  // Determine accessible MUN list (clean state from MunContext, plus active conference)
  const accessibleMuns = useMemo(() => {
    const list: Array<{ id: string; name: string; shortName: string; startDate: string; endDate: string; committees: MunCommittee[] }> = [];

    // Add active conference if available
    if (activeConference) {
      const comms = (activeConference.committees || []).map(c => typeof c === 'string' ? {
        id: c,
        eventId: activeConference.id,
        name: c.toUpperCase(),
        shortName: c.toUpperCase(),
        agenda: 'General Deliberations',
        type: 'PARLIAMENTARY' as const,
        totalDelegates: 25,
        presentCount: 0,
        presentAndVotingCount: 0,
        quorumNeeded: 13,
        dais: { chair: 'Executive Board', viceChair: 'Vice Chair' }
      } : c);

      list.push({
        id: activeConference.id,
        name: activeConference.name,
        shortName: activeConference.shortName || activeConference.name,
        startDate: activeConference.startDate || new Date().toISOString().slice(0, 10),
        endDate: activeConference.endDate || new Date().toISOString().slice(0, 10),
        committees: comms
      });
    }

    // Add other conferences from state
    for (const conf of conferences) {
      if (!list.some(item => item.id === conf.id)) {
        const comms = (conf.committees || []).map(c => typeof c === 'string' ? {
          id: c,
          eventId: conf.id,
          name: c.toUpperCase(),
          shortName: c.toUpperCase(),
          agenda: 'General Deliberations',
          type: 'PARLIAMENTARY' as const,
          totalDelegates: 25,
          presentCount: 0,
          presentAndVotingCount: 0,
          quorumNeeded: 13,
          dais: { chair: 'Executive Board', viceChair: 'Vice Chair' }
        } : c);

        list.push({
          id: conf.id,
          name: conf.name,
          shortName: conf.shortName || conf.name,
          startDate: conf.startDate || new Date().toISOString().slice(0, 10),
          endDate: conf.endDate || new Date().toISOString().slice(0, 10),
          committees: comms
        });
      }
    }

    // If user has a standalone initial committee not in any conference, create a direct chamber item
    if (initialCommittee && !list.some(m => m.committees.some(c => c.id === initialCommittee.id))) {
      list.push({
        id: initialCommittee.eventId || 'chamber-current',
        name: activeConference?.name || 'Active Parliamentary Session',
        shortName: activeConference?.shortName || 'CHAMBER',
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10),
        committees: [initialCommittee]
      });
    }

    return list;
  }, [conferences, activeConference, initialCommittee]);

  // Pre-fill selection based on arriving props or active chamber
  useEffect(() => {
    if (!isOpen) return;

    fetchRooms();

    let paramMun = '';
    let paramDate = '';
    let paramCommittee = '';
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      paramMun = searchParams.get('mun') || searchParams.get('event') || searchParams.get('munId') || '';
      paramDate = searchParams.get('date') || searchParams.get('eventDate') || '';
      paramCommittee = searchParams.get('committee') || searchParams.get('committeeId') || searchParams.get('comm') || '';
    }

    // 1. Preselect MUN
    const targetMunId = paramMun || initialConferenceId || activeConference?.id || accessibleMuns[0]?.id || '';
    setSelectedMunId(targetMunId);

    // 2. Preselect Date
    const targetDate = paramDate || initialDate || activeConference?.startDate || new Date().toISOString().slice(0, 10);
    setSelectedDate(targetDate);

    // 3. Preselect Committee
    if (paramCommittee) {
      const commFound = accessibleMuns.flatMap(m => m.committees).find(c => c.id.toLowerCase() === paramCommittee.toLowerCase() || (c.shortName || '').toLowerCase() === paramCommittee.toLowerCase());
      if (commFound) {
        setSelectedCommitteeId(commFound.id);
      } else {
        setSelectedCommitteeId(paramCommittee);
      }
    } else if (initialCommittee?.id) {
      setSelectedCommitteeId(initialCommittee.id);
    } else {
      const currentMun = accessibleMuns.find(m => m.id === targetMunId);
      if (currentMun && currentMun.committees.length > 0) {
        setSelectedCommitteeId(currentMun.committees[0].id);
      }
    }

    setSubmitError(null);
    setSubmitSuccess(null);
  }, [isOpen, initialCommittee, initialConferenceId, initialDate, activeConference, accessibleMuns, fetchRooms]);

  // Currently selected MUN object
  const currentSelectedMun = useMemo(() => {
    return accessibleMuns.find(m => m.id === selectedMunId) || accessibleMuns[0];
  }, [accessibleMuns, selectedMunId]);

  // Currently selected committee object
  const currentSelectedCommittee = useMemo(() => {
    if (!currentSelectedMun) return initialCommittee;
    return currentSelectedMun.committees.find(c => c.id === selectedCommitteeId) || currentSelectedMun.committees[0] || initialCommittee;
  }, [currentSelectedMun, selectedCommitteeId, initialCommittee]);

  // Check if a room is already mapped for the currently chosen (MUN, Committee, Date)
  const existingActiveRoom = useMemo(() => {
    if (!currentSelectedMun || !currentSelectedCommittee || !selectedDate) return undefined;
    const normDate = selectedDate.slice(0, 10);
    return rooms.find(r => 
      r.munId.toLowerCase() === currentSelectedMun.id.toLowerCase() &&
      (r.committeeId.toLowerCase() === currentSelectedCommittee.id.toLowerCase() || 
       r.committeeShort.toLowerCase() === (currentSelectedCommittee.shortName || '').toLowerCase()) &&
      r.eventDate.slice(0, 10) === normDate &&
      r.status !== 'DISCONNECTED'
    );
  }, [rooms, currentSelectedMun, currentSelectedCommittee, selectedDate]);

  // Pending approval rooms for Secretariat review
  const pendingDiscretionRooms = useMemo(() => {
    return rooms.filter(r => r.status === 'PENDING_APPROVAL');
  }, [rooms]);

  // Handle Connect or Submit Request
  const handleConnectOrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!currentSelectedMun) {
      setSubmitError('Please select a valid MUN conference or convening.');
      return;
    }

    if (!selectedDate) {
      setSubmitError('Please select an event / session date.');
      return;
    }

    if (!currentSelectedCommittee) {
      setSubmitError('Please select a committee.');
      return;
    }

    const res = await connectMatrixRoom({
      munId: currentSelectedMun.id,
      munName: currentSelectedMun.name,
      edition: activeConference?.slug || '2026 Edition',
      eventDate: selectedDate,
      committeeId: currentSelectedCommittee.id,
      committeeName: currentSelectedCommittee.name,
      committeeShort: currentSelectedCommittee.shortName || currentSelectedCommittee.name,
      committeeType: currentSelectedCommittee.type || 'PARLIAMENTARY',
      connectionMode,
      discretionNotes: connectionMode === 'SECRETARIAT_DISCRETION' ? discretionNotes : undefined,
      serverName: customServer.trim() || 'matrix.zenvitra.xyz',
      customAlias: customAlias.trim() || undefined
    });

    if (res.success && res.room) {
      if (res.room.status === 'ACTIVE') {
        setSubmitSuccess(`Successfully connected Matrix room ${res.room.matrixRoomAlias}!`);
      } else {
        setSubmitSuccess('Your connection request has been securely submitted for Secretariat Discretion review.');
      }
      setTimeout(() => {
        fetchRooms();
      }, 1000);
    } else {
      setSubmitError(res.error || 'Failed to connect Matrix room.');
    }
  };

  const handleCopyAlias = (alias: string) => {
    navigator.clipboard.writeText(alias);
    setCopiedAlias(alias);
    setTimeout(() => setCopiedAlias(null), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="relative w-full max-w-4xl bg-[#0b0e14] border border-cyan-500/25 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-amber-400 to-cyan-500" />

        {/* Modal Top Bar */}
        <div className="px-5 sm:px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-display font-bold text-white tracking-wide flex items-center gap-2">
                  <span>Connect Matrix</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    ZEN.CHAT × ZEN.MUN
                  </span>
                </h2>
              </div>
              <p className="text-xs font-mono text-neutral-400">
                Federated, encrypted committee communications segregated by MUN edition and date
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 sm:px-6 pt-3 pb-1 border-b border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0 bg-black/40">
          <button
            type="button"
            onClick={() => setActiveTab('CONNECT')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'CONNECT'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Connect Chamber</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ROOMS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'ROOMS'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Active Rooms ({rooms.filter(r => r.status === 'ACTIVE').length})</span>
          </button>

          {isSecretariat && (
            <button
              type="button"
              onClick={() => setActiveTab('SECRETARIAT')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'SECRETARIAT'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Secretariat Desk</span>
              {pendingDiscretionRooms.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-400 text-black text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {pendingDiscretionRooms.length}
                </span>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('AUDIT')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'AUDIT'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

          {/* TAB 1: CONNECT WIZARD */}
          {activeTab === 'CONNECT' && (
            <div className="space-y-6">

              {/* Existing Room Alert Banner */}
              {existingActiveRoom && (
                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                        Active Matrix Connection Found
                      </p>
                      <p className="text-sm font-bold text-white">
                        {existingActiveRoom.committeeShort} on {existingActiveRoom.eventDate}
                      </p>
                      <p className="text-xs font-mono text-cyan-400/80">
                        {existingActiveRoom.matrixRoomAlias}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyAlias(existingActiveRoom.matrixRoomAlias)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-white flex items-center gap-1.5 transition"
                    >
                      {copiedAlias === existingActiveRoom.matrixRoomAlias ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Alias</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        openInZenChat(existingActiveRoom);
                        onClose();
                      }}
                      className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold font-sans flex items-center gap-1.5 transition shadow-md shadow-cyan-500/20 active:scale-95"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Join in ZEN.CHAT</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 1 & Step 2: MUN and Date Selection */}
              <form onSubmit={handleConnectOrSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* MUN Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      <span>1. Select MUN / Convening</span>
                    </label>
                    <select
                      value={selectedMunId}
                      onChange={(e) => {
                        setSelectedMunId(e.target.value);
                        const matched = accessibleMuns.find(m => m.id === e.target.value);
                        if (matched && matched.committees.length > 0) {
                          setSelectedCommitteeId(matched.committees[0].id);
                        }
                      }}
                      className="w-full bg-[#12161f] border border-white/15 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none cursor-pointer font-sans"
                    >
                      {accessibleMuns.length === 0 ? (
                        <option value="">No registered MUN conferences available</option>
                      ) : (
                        accessibleMuns.map((mun) => (
                          <option key={mun.id} value={mun.id}>
                            {mun.name} ({mun.shortName})
                          </option>
                        ))
                      )}
                    </select>
                    <p className="text-[10px] font-mono text-neutral-500">
                      Only authorized conferences are surfaced
                    </p>
                  </div>

                  {/* Date Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>2. Select Event Date</span>
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-[#12161f] border border-white/15 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none font-mono cursor-pointer"
                      required
                    />
                    <p className="text-[10px] font-mono text-neutral-500">
                      Separates sessions by day to prevent communication leakage
                    </p>
                  </div>
                </div>

                {/* Step 3: Committee Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>3. Choose Committee Chamber</span>
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {currentSelectedMun?.committees.length || 0} Available
                    </span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1 border border-white/10 rounded-2xl bg-black/40">
                    {currentSelectedMun?.committees.map((comm) => {
                      const isSelected = selectedCommitteeId === comm.id;
                      return (
                        <div
                          key={comm.id}
                          onClick={() => setSelectedCommitteeId(comm.id)}
                          className={`p-3 rounded-xl border transition cursor-pointer flex items-center gap-3 ${
                            isSelected
                              ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                              : 'bg-white/[0.03] border-white/5 text-neutral-300 hover:bg-white/[0.07]'
                          }`}
                        >
                          <CommitteeLogoBadge logoKey={comm.logoKey || comm.shortName} size={28} />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold truncate">
                              {comm.shortName || comm.name}
                            </p>
                            <p className="text-[10px] font-mono text-neutral-400 truncate">
                              {comm.type?.replace(/_/g, ' ') || 'Chamber'}
                            </p>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Step 4: Connection Mode Selection */}
                <div className="space-y-2.5 pt-2 border-t border-white/10">
                  <label className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider block">
                    4. Connection Authorization Mode
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Mode 1: Direct Connection */}
                    <div
                      onClick={() => setConnectionMode('DIRECT')}
                      className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                        connectionMode === 'DIRECT'
                          ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-md'
                          : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold font-sans text-cyan-300 flex items-center gap-1.5">
                          <Radio className="w-3.5 h-3.5" />
                          <span>Direct Connection</span>
                        </span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          connectionMode === 'DIRECT' ? 'border-cyan-400 bg-cyan-400' : 'border-neutral-500'
                        }`}>
                          {connectionMode === 'DIRECT' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                        </div>
                      </div>
                      <p className="text-[11px] font-mono text-neutral-300 leading-relaxed">
                        Instantly maps or activates the Matrix room. Best for finalized committees, confirmed dais chairs, and live active summmits.
                      </p>
                    </div>

                    {/* Mode 2: Secretariat Discretion */}
                    <div
                      onClick={() => setConnectionMode('SECRETARIAT_DISCRETION')}
                      className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                        connectionMode === 'SECRETARIAT_DISCRETION'
                          ? 'bg-amber-500/15 border-amber-400 text-white shadow-md'
                          : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold font-sans text-amber-300 flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5" />
                          <span>Secretariat Discretion</span>
                        </span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          connectionMode === 'SECRETARIAT_DISCRETION' ? 'border-amber-400 bg-amber-400' : 'border-neutral-500'
                        }`}>
                          {connectionMode === 'SECRETARIAT_DISCRETION' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                        </div>
                      </div>
                      <p className="text-[11px] font-mono text-neutral-300 leading-relaxed">
                        Hands configuration over to the Secretariat. Request remains in pending clearance until committee, room, or date is officially verified.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Secretariat Discretion Notes */}
                {connectionMode === 'SECRETARIAT_DISCRETION' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2"
                  >
                    <label className="text-xs font-mono font-bold text-amber-300 block">
                      Secretariat Instruction Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={discretionNotes}
                      onChange={(e) => setDiscretionNotes(e.target.value)}
                      placeholder="e.g. Schedule unconfirmed: please map room once Day 2 agenda is cleared by the Secretary-General."
                      className="w-full bg-black/60 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none resize-none font-mono"
                    />
                  </motion.div>
                )}

                {/* Feedback messages */}
                {submitError && (
                  <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs font-mono text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{submitError}</span>
                  </div>
                )}

                {submitSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>{submitSuccess}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10 font-mono text-xs">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-2.5 rounded-xl font-bold font-sans transition flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 disabled:opacity-50 ${
                      connectionMode === 'DIRECT'
                        ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/25'
                        : 'bg-amber-400 hover:bg-amber-300 text-black shadow-amber-500/25'
                    }`}
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Radio className="w-4 h-4" />
                    )}
                    <span>
                      {connectionMode === 'DIRECT' ? 'Connect Matrix Room' : 'Submit for Discretion Review'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: ACTIVE ROOMS LIST */}
          {activeTab === 'ROOMS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                  Mapped Committee Matrix Conversations
                </span>
                <button
                  type="button"
                  onClick={() => fetchRooms()}
                  className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh</span>
                </button>
              </div>

              {rooms.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-2">
                  <Layers className="w-8 h-8 text-neutral-500 mx-auto" />
                  <p className="text-sm font-bold text-white">No Matrix Rooms Connected</p>
                  <p className="text-xs font-mono text-neutral-400 max-w-sm mx-auto">
                    Use the "Connect Chamber" tab to initiate a Matrix room mapped to an MUN committee and date.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {rooms.map((room) => {
                    const isActive = room.status === 'ACTIVE';
                    const isPending = room.status === 'PENDING_APPROVAL';

                    return (
                      <div
                        key={room.id}
                        className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition flex flex-col justify-between space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <CommitteeLogoBadge logoKey={room.committeeShort} size={32} />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-white">
                                  {room.committeeShort}
                                </h4>
                                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                                  isActive
                                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                                    : isPending
                                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                                    : 'bg-red-500/15 border-red-500/30 text-red-400'
                                }`}>
                                  {room.status.replace(/_/g, ' ')}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-400 truncate max-w-[200px]">
                                {room.munName}
                              </p>
                            </div>
                          </div>

                          <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                            {room.eventDate}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-300">
                            <span className="text-neutral-500">Alias:</span>
                            <span className="truncate max-w-[200px] text-cyan-300 font-bold">{room.matrixRoomAlias}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-300">
                            <span className="text-neutral-500">Mode:</span>
                            <span>{room.connectionMode.replace(/_/g, ' ')}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                          <button
                            type="button"
                            onClick={() => handleCopyAlias(room.matrixRoomAlias)}
                            className="p-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-mono text-neutral-300 flex items-center gap-1 transition"
                          >
                            {copiedAlias === room.matrixRoomAlias ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>Copy Link</span>
                          </button>

                          {isActive && (
                            <button
                              type="button"
                              onClick={() => {
                                openInZenChat(room);
                                onClose();
                              }}
                              className="p-1.5 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Join Chat</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SECRETARIAT DISCRETION DESK */}
          {activeTab === 'SECRETARIAT' && isSecretariat && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
                <Shield className="w-6 h-6 text-amber-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-amber-300">
                    Secretariat Executive Clearance Panel
                  </h4>
                  <p className="text-xs font-mono text-neutral-300">
                    Review and finalize committee Matrix connections, inspect requested parameters, and grant approval.
                  </p>
                </div>
              </div>

              {pendingDiscretionRooms.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-sm font-bold text-white">All Requests Finalized</p>
                  <p className="text-xs font-mono text-neutral-400">
                    There are no pending Secretariat Discretion submissions awaiting decision.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingDiscretionRooms.map((room) => (
                    <div
                      key={room.id}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-amber-500/20 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <CommitteeLogoBadge logoKey={room.committeeShort} size={32} />
                          <div>
                            <h4 className="text-sm font-bold text-white">
                              {room.committeeName} ({room.committeeShort})
                            </h4>
                            <p className="text-xs font-mono text-neutral-400">
                              Requested by: {room.requestedBy.name} (@{room.requestedBy.username}) &bull; {room.requestedBy.role}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
                          Target Date: {room.eventDate}
                        </span>
                      </div>

                      {room.discretionNotes && (
                        <div className="p-3 rounded-xl bg-black/60 border border-white/5 text-xs font-mono text-neutral-300">
                          <span className="text-neutral-500 block mb-0.5">Requester Notes:</span>
                          "{room.discretionNotes}"
                        </div>
                      )}

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5 font-mono text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setReviewingRoom(room);
                            setRejectReason('');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 transition"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await approveRoom(room.id, 'Approved by Secretariat Clearance');
                          }}
                          className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-sans transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Activate Room</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: AUDIT TRAIL */}
          {activeTab === 'AUDIT' && (
            <div className="space-y-4">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">
                Immutable Governance & Clearance Audit Log
              </span>

              {rooms.every(r => r.auditLog.length === 0) ? (
                <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center text-xs font-mono text-neutral-400">
                  No governance audit records logged yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {rooms.flatMap(r => r.auditLog).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{entry.actorName}</span>
                          <span className="text-[10px] text-neutral-500">(@{entry.actorUsername})</span>
                          <span className="px-1.5 py-0.2 rounded bg-white/10 text-neutral-300 text-[10px]">
                            {entry.actorRole}
                          </span>
                        </div>
                        <p className="text-neutral-300 text-[11px]">{entry.details}</p>
                      </div>
                      <span className="text-[10px] text-neutral-500 shrink-0">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Rejection / Review Modal Dialog */}
        {reviewingRoom && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[#12161f] border border-red-500/30 rounded-2xl p-5 space-y-4 shadow-2xl">
              <h4 className="text-sm font-bold text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>Reject Secretariat Discretion Request</span>
              </h4>
              <p className="text-xs font-mono text-neutral-300">
                Provide rationale for denying the Matrix connection for {reviewingRoom.committeeName}:
              </p>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Committee roster is suspended pending dais revision."
                className="w-full bg-black/60 border border-white/15 focus:border-red-400 rounded-xl p-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none resize-none font-mono"
              />
              <div className="flex items-center justify-end gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setReviewingRoom(null)}
                  className="px-3 py-1.5 rounded-lg text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await rejectRoom(reviewingRoom.id, rejectReason);
                    setReviewingRoom(null);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 text-white font-bold"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
}
export default CommitteeMatrixChatModal;
