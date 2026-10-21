'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, 
  Sparkles, 
  Video, 
  Mic, 
  ShieldCheck, 
  Lock, 
  Users, 
  Clock, 
  Calendar, 
  Share2, 
  Copy, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sliders, 
  Globe, 
  Tv, 
  Gavel, 
  Volume2, 
  Layers, 
  CheckCircle2,
  FileText,
  Radio,
  Eye,
  MessageSquare,
  Smile,
  Subtitles,
  ExternalLink
} from 'lucide-react';
import { ZenMeetRoom, ZenRoomType, ZenRoomPersistence, ZenRoomAccess } from '@/types/meet';
import { generateMeetingCode, saveStoredRoom } from '@/lib/meetStorage';
import { useAuth } from '@/context/AuthContext';

interface CreateRoomWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (room: ZenMeetRoom) => void;
  defaultType?: ZenRoomType;
}

export function CreateRoomWizardModal({
  isOpen,
  onClose,
  onCreated,
  defaultType = 'standard'
}: CreateRoomWizardModalProps) {
  const router = useRouter();
  const { user, profile } = useAuth();
  const hostId = profile?.id || user?.id || 'host-user';
  const hostName = profile?.display_name || user?.name || 'Session Host';

  const [roomType, setRoomType] = useState<ZenRoomType>(defaultType);

  // --- STANDARD WIZARD STATE (Steps 1 to 6) ---
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'personal' | 'team' | 'event' | 'community'>('team');
  const [coHostsInput, setCoHostsInput] = useState('');
  
  // Step 2: Persistence
  const [persistence, setPersistence] = useState<ZenRoomPersistence>('persistent');
  const [scheduledDate, setScheduledDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [scheduledTime, setScheduledTime] = useState('16:00');

  // Step 3: Access & Security
  const [access, setAccess] = useState<ZenRoomAccess>('link');
  const [waitingRoom, setWaitingRoom] = useState(true);
  const [hasPasscode, setHasPasscode] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [lockOnStart, setLockOnStart] = useState(false);

  // Step 4: Meeting Features
  const [camOnDefault, setCamOnDefault] = useState(true);
  const [micOnDefault, setMicOnDefault] = useState(true);
  const [allowShare, setAllowShare] = useState(true);
  const [allowChat, setAllowChat] = useState(true);
  const [allowReactions, setAllowReactions] = useState(true);
  const [allowCaptions, setAllowCaptions] = useState(true);
  const [capacity, setCapacity] = useState<number>(25);
  const [durationMinutes, setDurationMinutes] = useState<number>(60);

  // Step 5: Integrations
  const [linkedEvent, setLinkedEvent] = useState('');
  const [agendaNotes, setAgendaNotes] = useState('');

  // --- MUN SPECIFIC STATE ---
  const [munCommitteeName, setMunCommitteeName] = useState('');
  const [munAgendaTopic, setMunAgendaTopic] = useState('');
  const [munEbRole, setMunEbRole] = useState('Executive Board · Chairperson');
  const [munSpeakingTime, setMunSpeakingTime] = useState(90);
  const [munChitsEnabled, setMunChitsEnabled] = useState(true);

  // --- QUICK VOICE STATE ---
  const [voiceAccess, setVoiceAccess] = useState<'link' | 'restricted'>('link');
  const [voicePersistent, setVoicePersistent] = useState(true);

  // Generation status
  const [createdRoom, setCreatedRoom] = useState<ZenMeetRoom | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleCreateRoom = async () => {
    setSubmitting(true);
    const roomCode = generateMeetingCode(roomType === 'mun' ? 'MUN' : 'ZEN');
    const roomId = `room-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

    let finalName = name.trim();
    if (!finalName) {
      if (roomType === 'mun') finalName = munCommitteeName.trim() || 'MUN Committee Room';
      else if (roomType === 'voice') finalName = 'Open Voice Channel';
      else finalName = 'ZEN Conference Room';
    }

    const coHosts = coHostsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const newRoom: ZenMeetRoom = {
      id: roomId,
      roomCode,
      name: finalName,
      description: description.trim() || undefined,
      roomType,
      persistence: roomType === 'voice' ? (voicePersistent ? 'persistent' : 'onetime') : persistence,
      access: roomType === 'voice' ? (voiceAccess === 'link' ? 'link' : 'members') : access,
      hostId,
      hostName,
      coHosts: coHosts.length > 0 ? coHosts : undefined,
      passcode: hasPasscode && passcode.trim() ? passcode.trim() : undefined,
      waitingRoom,
      lockRoom: lockOnStart,
      capacity,
      durationMinutes,
      defaults: {
        camOn: camOnDefault,
        micOn: micOnDefault,
        allowShare,
        allowChat,
        allowReactions,
        allowCaptions
      },
      munConfig: roomType === 'mun' ? {
        committeeName: munCommitteeName,
        agendaTopic: munAgendaTopic,
        ebRole: munEbRole,
        speakingTimeSecs: munSpeakingTime,
        chitsEnabled: munChitsEnabled
      } : undefined,
      createdAt: new Date().toISOString(),
      scheduledStart: persistence === 'scheduled' ? `${scheduledDate}T${scheduledTime}:00` : undefined,
      status: 'IDLE',
      participantCount: 0
    };

    // Save to local storage
    saveStoredRoom(newRoom);

    // Also sync with backend API asynchronously
    try {
      await fetch('/api/calls/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newRoom.name,
          description: newRoom.description,
          scheduledStart: newRoom.scheduledStart || new Date().toISOString(),
          scheduledEnd: new Date(Date.now() + newRoom.durationMinutes * 60000).toISOString(),
          hostId: newRoom.hostId,
          hostName: newRoom.hostName,
          passcode: newRoom.passcode,
          waitingRoom: newRoom.waitingRoom,
          type: roomType === 'mun' ? 'MUN_COMMITTEE' : (roomType === 'voice' ? 'COMMUNITY' : 'GROUP')
        })
      });
    } catch (e) {
      console.warn('API meeting creation sync warning:', e);
    }

    setCreatedRoom(newRoom);
    setSubmitting(false);
    if (onCreated) onCreated(newRoom);
  };

  const handleCopyLink = () => {
    if (!createdRoom) return;
    const inviteUrl = `${window.location.origin}/meet/${createdRoom.roomCode}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleEnterChamber = () => {
    if (!createdRoom) return;
    onClose();
    router.push(`/meet/${createdRoom.roomCode}`);
  };

  // If already created, render Success / Launch view
  if (createdRoom) {
    const inviteUrl = typeof window !== 'undefined' ? `${window.location.origin}/meet/${createdRoom.roomCode}` : `/meet/${createdRoom.roomCode}`;

    return (
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4">
        <div className="bg-[#07090e] border border-cyan-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 text-white shadow-[0_25px_90px_rgba(0,0,0,0.95)] relative animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
          
          <div className="text-center space-y-2 relative">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(6,182,212,0.25)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold font-display text-white">Chamber Provisioned</h2>
            <p className="text-xs text-neutral-400">
              <strong className="text-white">{createdRoom.name}</strong> is live and initialized on the secure network.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 relative">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-500 uppercase tracking-wider">Room Token</span>
              <span className="text-cyan-300 font-bold px-2.5 py-1 rounded-lg bg-cyan-950/70 border border-cyan-500/40 tracking-wider">
                {createdRoom.roomCode}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-500">Chamber Type</span>
              <span className="text-white capitalize">{createdRoom.roomType} &bull; {createdRoom.persistence}</span>
            </div>
            {createdRoom.passcode && (
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-500">Security Passcode</span>
                <span className="text-amber-300 font-bold px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/30">
                  {createdRoom.passcode}
                </span>
              </div>
            )}
            <div className="pt-2 border-t border-white/10 flex items-center gap-2">
              <input
                readOnly
                value={inviteUrl}
                className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono text-neutral-300 truncate focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition flex items-center gap-1.5 cursor-pointer shrink-0 font-semibold"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 relative">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-300 text-xs font-mono transition cursor-pointer"
            >
              Done &bull; Return
            </button>
            <button
              type="button"
              onClick={handleEnterChamber}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-neutral-950 font-bold text-xs font-mono shadow-[0_0_25px_rgba(6,182,212,0.3)] transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Enter Chamber Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active theme accent color classes
  const isCyan = roomType === 'standard';
  const isAmber = roomType === 'mun';
  const isPurple = roomType === 'voice';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#07090e] border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 text-white shadow-[0_30px_100px_rgba(0,0,0,0.95)] relative my-auto animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Ambient Top Glow Line */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${
          isCyan ? 'from-transparent via-cyan-500 to-transparent' :
          isAmber ? 'from-transparent via-amber-500 to-transparent' :
          'from-transparent via-purple-500 to-transparent'
        }`} />

        {/* Ambient Background Auras */}
        {isCyan && (
          <div className="pointer-events-none absolute -top-32 -left-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px]" />
        )}
        {isAmber && (
          <div className="pointer-events-none absolute -top-32 -left-32 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px]" />
        )}
        {isPurple && (
          <div className="pointer-events-none absolute -top-32 -left-32 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]" />
        )}

        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4 relative">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`w-2 h-2 rounded-full animate-pulse ${
                isCyan ? 'bg-cyan-400' : isAmber ? 'bg-amber-400' : 'bg-purple-400'
              }`} />
              <span className={`text-[10px] font-mono tracking-widest uppercase font-bold ${
                isCyan ? 'text-cyan-400' : isAmber ? 'text-amber-400' : 'text-purple-400'
              }`}>
                ZEN.MEET PROTOCOL &bull; CHAMBER PROVISIONING
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              Provision Virtual Chamber
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Deploy sovereign audio-visual architecture, dais controls, and participant access.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-neutral-400 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Room Type Selector Tabs */}
        <div className="grid grid-cols-3 gap-2.5 p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 relative">
          <button
            type="button"
            onClick={() => { setRoomType('standard'); setStep(1); }}
            className={`py-2.5 px-3 rounded-xl text-xs font-mono font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-2 cursor-pointer ${
              roomType === 'standard' 
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-neutral-950 font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Video className="w-4 h-4 shrink-0" />
            <div className="text-left">
              <span className="block leading-none">Standard Room</span>
              <span className={`text-[9px] hidden sm:block ${roomType === 'standard' ? 'text-neutral-900/80 font-normal' : 'text-neutral-500 font-normal'}`}>
                Full A/V Suite
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRoomType('mun')}
            className={`py-2.5 px-3 rounded-xl text-xs font-mono font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-2 cursor-pointer ${
              roomType === 'mun' 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-neutral-950 font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)]' 
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Gavel className="w-4 h-4 shrink-0" />
            <div className="text-left">
              <span className="block leading-none">MUN Committee</span>
              <span className={`text-[9px] hidden sm:block ${roomType === 'mun' ? 'text-neutral-900/80 font-normal' : 'text-neutral-500 font-normal'}`}>
                Dais &amp; Chits
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRoomType('voice')}
            className={`py-2.5 px-3 rounded-xl text-xs font-mono font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-2 cursor-pointer ${
              roomType === 'voice' 
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Volume2 className="w-4 h-4 shrink-0" />
            <div className="text-left">
              <span className="block leading-none">Voice Room</span>
              <span className={`text-[9px] hidden sm:block ${roomType === 'voice' ? 'text-purple-200/80 font-normal' : 'text-neutral-500 font-normal'}`}>
                Audio Channel
              </span>
            </div>
          </button>
        </div>

        {/* --- FLOW 1: STANDARD MEETING (6-STEP WIZARD) --- */}
        {roomType === 'standard' && (
          <div className="space-y-6">
            {/* Step Progress Bar & Indicator */}
            <div className="space-y-2 border-b border-white/5 pb-3">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5, 6].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStep(s)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all cursor-pointer ${
                        step === s
                          ? 'bg-cyan-500 text-neutral-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                          : step > s
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'bg-white/[0.04] text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <span className="text-neutral-300 font-mono text-[11px]">
                  <span className="text-cyan-400 font-bold">Step {step}/6</span> &bull; {
                    step === 1 ? 'Chamber Identity' :
                    step === 2 ? 'Cadence & Persistence' :
                    step === 3 ? 'Security & Access' :
                    step === 4 ? 'Hardware & Limits' :
                    step === 5 ? 'Agenda & Links' : 'Review & Finalize'
                  }
                </span>
              </div>
              <div className="w-full bg-white/[0.05] h-1 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-300"
                  style={{ width: `${(step / 6) * 100}%` }}
                />
              </div>
            </div>

            {/* STEP 1: IDENTITY */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-300 font-semibold block">
                    Room / Chamber Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Core Engineering Sync or Horizon Strategy Room"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400 focus:bg-white/[0.07] focus:ring-1 focus:ring-cyan-400/30 transition-all font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-300 font-semibold block">
                    Description (optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    placeholder="State the purpose, scope, or briefing requirements of this chamber..."
                    className="w-full px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400 focus:bg-white/[0.07] focus:ring-1 focus:ring-cyan-400/30 transition-all font-sans resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-300 font-semibold block">Category</label>
                    <select
                      value={category}
                      onChange={(e: any) => setCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 font-sans cursor-pointer"
                    >
                      <option value="team" className="bg-neutral-900">Team Collaboration</option>
                      <option value="personal" className="bg-neutral-900">Personal Space</option>
                      <option value="event" className="bg-neutral-900">Conference Event</option>
                      <option value="community" className="bg-neutral-900">Community Gathering</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-300 font-semibold block">Co-Hosts (Handles or Emails)</label>
                    <input
                      type="text"
                      value={coHostsInput}
                      onChange={(e) => setCoHostsInput(e.target.value)}
                      placeholder="e.g. @alex, @elena"
                      className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400 focus:bg-white/[0.07] font-sans"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: PERSISTENCE */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPersistence('persistent')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                      persistence === 'persistent' 
                        ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.15)]' 
                        : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white font-mono">Persistent Room</span>
                      {persistence === 'persistent' && <Check className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                      Standing room token that never expires. Ideal for continuous team workspaces and recurring debriefs.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPersistence('scheduled')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                      persistence === 'scheduled' 
                        ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.15)]' 
                        : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white font-mono">Scheduled Room</span>
                      {persistence === 'scheduled' && <Check className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                      Scheduled for a specific calendar slot with automated invitations and countdown reminders.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPersistence('onetime')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                      persistence === 'onetime' 
                        ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.15)]' 
                        : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white font-mono">One-Time Meeting</span>
                      {persistence === 'onetime' && <Check className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                      Single-use disposable chamber that automatically archives once the host vacates the session.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPersistence('recurring')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                      persistence === 'recurring' 
                        ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.15)]' 
                        : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white font-mono">Recurring Chamber</span>
                      {persistence === 'recurring' && <Check className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                      Reuses the same meeting token and settings across recurring standups, study circles, and reviews.
                    </p>
                  </button>
                </div>

                {persistence === 'scheduled' && (
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 grid grid-cols-2 gap-3 mt-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-neutral-400">Date</label>
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-neutral-400">Time</label>
                      <input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: ACCESS & SECURITY */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-neutral-300 font-semibold block">Entry Permission</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setAccess('link')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer text-xs font-mono ${
                        access === 'link' 
                          ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                          : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:text-white'
                      }`}
                    >
                      Anyone with Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccess('members')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer text-xs font-mono ${
                        access === 'members' 
                          ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                          : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:text-white'
                      }`}
                    >
                      Verified Citizens
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccess('invite')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer text-xs font-mono ${
                        access === 'invite' 
                          ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                          : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:text-white'
                      }`}
                    >
                      Invitees Only
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono text-white font-bold block">Waiting Room Queue</span>
                      <span className="text-[11px] text-neutral-400 font-sans">
                        Host must explicitly admit participants before they can view or speak in the chamber.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={waitingRoom}
                      onChange={(e) => setWaitingRoom(e.target.checked)}
                      className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                    />
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono text-white font-bold block">Lock Chamber on Session Start</span>
                      <span className="text-[11px] text-neutral-400 font-sans">
                        Prevent any late entrants once the host commences formal deliberation.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={lockOnStart}
                      onChange={(e) => setLockOnStart(e.target.checked)}
                      className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                    />
                  </div>

                  <div className="pt-3 border-t border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-white font-bold">Chamber Passcode</span>
                      <input
                        type="checkbox"
                        checked={hasPasscode}
                        onChange={(e) => setHasPasscode(e.target.checked)}
                        className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                      />
                    </div>
                    {hasPasscode && (
                      <input
                        type="text"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        placeholder="e.g. ZEN2026"
                        className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: MEETING FEATURES & HARDWARE */}
            {step === 4 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-300 font-semibold block">Maximum Capacity</label>
                    <select
                      value={capacity}
                      onChange={(e) => setCapacity(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono cursor-pointer"
                    >
                      <option value={10} className="bg-neutral-900">Up to 10 Delegates (Mesh)</option>
                      <option value={25} className="bg-neutral-900">Up to 25 Delegates (Standard)</option>
                      <option value={50} className="bg-neutral-900">Up to 50 Delegates (Executive)</option>
                      <option value={100} className="bg-neutral-900">Up to 100 Delegates (Assembly)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-300 font-semibold block">Planned Duration</label>
                    <select
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono cursor-pointer"
                    >
                      <option value={30} className="bg-neutral-900">30 Minutes</option>
                      <option value={60} className="bg-neutral-900">1 Hour (Standard)</option>
                      <option value={120} className="bg-neutral-900">2 Hours</option>
                      <option value={0} className="bg-neutral-900">No Planned Limit</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <span className="text-xs font-mono text-cyan-400 font-bold block uppercase tracking-wider">
                    Participant Controls
                  </span>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition">
                      <input
                        type="checkbox"
                        checked={camOnDefault}
                        onChange={(e) => setCamOnDefault(e.target.checked)}
                        className="accent-cyan-400"
                      />
                      <span>Camera on entry</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition">
                      <input
                        type="checkbox"
                        checked={micOnDefault}
                        onChange={(e) => setMicOnDefault(e.target.checked)}
                        className="accent-cyan-400"
                      />
                      <span>Microphone on entry</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition">
                      <input
                        type="checkbox"
                        checked={allowShare}
                        onChange={(e) => setAllowShare(e.target.checked)}
                        className="accent-cyan-400"
                      />
                      <span>Screen share (ZEN.SHARE)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition">
                      <input
                        type="checkbox"
                        checked={allowChat}
                        onChange={(e) => setAllowChat(e.target.checked)}
                        className="accent-cyan-400"
                      />
                      <span>Live in-meeting chat</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition">
                      <input
                        type="checkbox"
                        checked={allowReactions}
                        onChange={(e) => setAllowReactions(e.target.checked)}
                        className="accent-cyan-400"
                      />
                      <span>Emoji reactions &amp; hand raise</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition">
                      <input
                        type="checkbox"
                        checked={allowCaptions}
                        onChange={(e) => setAllowCaptions(e.target.checked)}
                        className="accent-cyan-400"
                      />
                      <span>Live speech captions</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: INTEGRATIONS */}
            {step === 5 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-300 font-semibold block">
                    Link with ZENVITRA Event / Conference
                  </label>
                  <input
                    type="text"
                    value={linkedEvent}
                    onChange={(e) => setLinkedEvent(e.target.value)}
                    placeholder="Enter conference or event title..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400 font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-300 font-semibold block">
                    Session Agenda &amp; Presentation Notes
                  </label>
                  <textarea
                    value={agendaNotes}
                    onChange={(e) => setAgendaNotes(e.target.value)}
                    rows={4}
                    placeholder="Provide meeting agenda items, reference resolution links, or briefing points for attendees..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400 font-sans resize-none"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-cyan-950/25 border border-cyan-500/20 text-[11px] text-cyan-200 flex items-center gap-2.5 font-mono">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Agenda notes are pinned in the in-meeting drawer for all admitted participants.</span>
                </div>
              </div>
            )}

            {/* STEP 6: REVIEW & LAUNCH */}
            {step === 6 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    Chamber Configuration Manifest
                  </h4>
                  <div className="grid grid-cols-2 gap-y-2 text-xs font-mono">
                    <span className="text-neutral-500">Name:</span>
                    <span className="text-white font-bold">{name || 'ZEN Conference Room'}</span>

                    <span className="text-neutral-500">Cadence:</span>
                    <span className="text-white capitalize">{persistence}</span>

                    <span className="text-neutral-500">Access Mode:</span>
                    <span className="text-white capitalize">{access}</span>

                    <span className="text-neutral-500">Waiting Room:</span>
                    <span className={waitingRoom ? 'text-emerald-400' : 'text-neutral-400'}>
                      {waitingRoom ? 'Enabled (Host admits)' : 'Direct Entry'}
                    </span>

                    <span className="text-neutral-500">Capacity:</span>
                    <span className="text-white">{capacity} Delegates</span>

                    <span className="text-neutral-500">Passcode:</span>
                    <span className="text-amber-300">{hasPasscode && passcode ? passcode : 'None'}</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                  Clicking <strong>Generate Chamber</strong> will register your sovereign room token, initialize encrypted peer channels, and generate an instant access link.
                </p>
              </div>
            )}

            {/* Bottom Step Navigation Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-neutral-300 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : <div />}

              {step < 6 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs font-mono flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.3)] ml-auto"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCreateRoom}
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-neutral-950 font-bold text-xs font-mono flex items-center gap-2 transition cursor-pointer shadow-[0_0_25px_rgba(6,182,212,0.35)] disabled:opacity-50 ml-auto"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{submitting ? 'Generating...' : 'Generate Chamber'}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* --- FLOW 2: MUN COMMITTEE ROOM (STREAMLINED FAST-TRACK) --- */}
        {roomType === 'mun' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-3 font-mono">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-300">
                <Gavel className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white tracking-wide">MUN Dais Integration</p>
                <p className="text-[11px] text-amber-200/80 leading-relaxed font-sans">
                  Direct Model UN Chamber &bull; Inherits Executive Board dais controls, speaker queue, and in-chamber ZEN.CHITS.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-300 font-semibold block">Committee Name *</label>
              <input
                type="text"
                value={munCommitteeName}
                onChange={(e) => setMunCommitteeName(e.target.value)}
                placeholder="e.g. UN Security Council or General Assembly First Committee..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-300 font-semibold block">Agenda Topic</label>
              <input
                type="text"
                value={munAgendaTopic}
                onChange={(e) => setMunAgendaTopic(e.target.value)}
                placeholder="e.g. Deliberation on Global Energy Transition & Critical Mineral Security"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-300 font-semibold block">Your Role on Dais</label>
                <select
                  value={munEbRole}
                  onChange={(e) => setMunEbRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-sans cursor-pointer"
                >
                  <option value="Executive Board · Chairperson" className="bg-neutral-900">Chairperson</option>
                  <option value="Executive Board · Vice Chair" className="bg-neutral-900">Vice Chairperson</option>
                  <option value="Executive Board · Moderator" className="bg-neutral-900">Moderator / Director</option>
                  <option value="Rapporteur" className="bg-neutral-900">Rapporteur</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-300 font-semibold block">GSL Speaking Time</label>
                <select
                  value={munSpeakingTime}
                  onChange={(e) => setMunSpeakingTime(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-mono cursor-pointer"
                >
                  <option value={60} className="bg-neutral-900">60 Seconds</option>
                  <option value={90} className="bg-neutral-900">90 Seconds (Standard)</option>
                  <option value={120} className="bg-neutral-900">120 Seconds (2 mins)</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5 text-xs font-mono">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={munChitsEnabled}
                  onChange={(e) => setMunChitsEnabled(e.target.checked)}
                  className="accent-amber-400 w-4 h-4 rounded"
                />
                <span>Enable In-Chamber <strong>ZEN.CHITS</strong> (Direct, Substantive, EB Reports)</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={waitingRoom}
                  onChange={(e) => setWaitingRoom(e.target.checked)}
                  className="accent-amber-400 w-4 h-4 rounded"
                />
                <span>Waiting Room active (EB admits verified delegates)</span>
              </label>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={handleCreateRoom}
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-neutral-950 font-bold text-xs font-mono flex items-center gap-2 transition cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.3)] disabled:opacity-50"
              >
                <Gavel className="w-4 h-4" />
                <span>{submitting ? 'Initializing...' : 'Create Committee Room'}</span>
              </button>
            </div>
          </div>
        )}

        {/* --- FLOW 3: VOICE ROOM (FAST-TRACK AUDIO CHANNEL) --- */}
        {roomType === 'voice' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Pure Sovereign Audio Channel Description - NO third-party platform references */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-transparent border border-purple-500/25 text-xs text-purple-200 flex items-start gap-3 font-mono">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0 text-purple-300 shadow-sm">
                <Volume2 className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-white tracking-wide">Audio-First Sovereign Channel</p>
                <p className="text-[11px] text-purple-300/80 leading-relaxed font-sans">
                  High-fidelity low-latency audio channel for instantaneous chamber debriefs, team floor strategy, and open speaker lounges.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-300 font-semibold block">Channel Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Design Sync Voice or Strategy Lounge"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30 font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-300 font-semibold block">Access Rule</label>
                <select
                  value={voiceAccess}
                  onChange={(e: any) => setVoiceAccess(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400 font-sans cursor-pointer"
                >
                  <option value="link" className="bg-neutral-900">Anyone with Room Link</option>
                  <option value="restricted" className="bg-neutral-900">Restricted / Team Members</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-300 font-semibold block">Persistence</label>
                <select
                  value={voicePersistent ? 'persistent' : 'temporary'}
                  onChange={(e) => setVoicePersistent(e.target.value === 'persistent')}
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400 font-sans cursor-pointer"
                >
                  <option value="persistent" className="bg-neutral-900">Persistent Channel</option>
                  <option value="temporary" className="bg-neutral-900">Temporary (Auto-deletes)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={handleCreateRoom}
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-xs font-mono flex items-center gap-2 transition cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50"
              >
                <Volume2 className="w-4 h-4" />
                <span>{submitting ? 'Setting up...' : 'Create Voice Room'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
