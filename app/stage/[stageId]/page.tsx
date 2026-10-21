'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Gavel, 
  Clock, 
  Mic, 
  MicOff, 
  Hand, 
  Play, 
  Pause, 
  RotateCcw, 
  Users, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  FileText, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  Radio, 
  MessageSquare,
  AlertCircle,
  Volume2
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { CallSpeakerQueueItem } from '@/types/call';
import { checkFeatureAccess } from '@/lib/subscriptionTiers';
import { isFounder, isAdmin } from '@/lib/founderControl';

export default function MunStagePage({
  params
}: {
  params: Promise<{ stageId: string }>;
}) {
  const resolvedParams = use(params);
  const stageId = decodeURIComponent(resolvedParams.stageId);
  const { user, profile } = useAuth();

  const isPrivileged = Boolean(
    isFounder(profile?.username || profile?.email || '', profile?.role) ||
    isAdmin(profile?.username || profile?.email || '', profile?.role)
  );

  const { hasAccess: canBroadcastStage, requiredTierLabel: stageRequiredTier } = checkFeatureAccess(
    'STAGE_BROADCASTING',
    profile || user,
    isPrivileged
  );

  const [queue, setQueue] = useState<CallSpeakerQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDaisChair, setIsDaisChair] = useState(false);
  const [isRoomLocked, setIsRoomLocked] = useState(false);

  // Active Speaker & Timer State
  const [activeSpeaker, setActiveSpeaker] = useState<CallSpeakerQueueItem | null>(null);
  const [speechSecondsLeft, setSpeechSecondsLeft] = useState<number>(90);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [handRaised, setHandRaised] = useState<boolean>(false);

  // Local user metadata
  const currentUserId = profile?.id || user?.id || 'delegate_local';
  const currentUserName = profile?.display_name || user?.name || 'Delegate';
  const delegateCountry = 'Republic of India';

  const fetchStageData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/calls/stage/${encodeURIComponent(stageId)}/queue`);
      const data = await res.json();
      if (data.success && Array.isArray(data.queue)) {
        setQueue(data.queue);
        const speaking = data.queue.find((q: CallSpeakerQueueItem) => q.status === 'SPEAKING');
        if (speaking) {
          setActiveSpeaker(speaking);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStageData();
  }, [stageId]);

  // Speech Countdown Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && speechSecondsLeft > 0) {
      interval = setInterval(() => {
        setSpeechSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, speechSecondsLeft]);

  // Dais Action: Enqueue Self
  const handleEnqueueSelf = async () => {
    try {
      const res = await fetch(`/api/calls/stage/${encodeURIComponent(stageId)}/queue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ENQUEUE',
          userId: currentUserId,
          userName: currentUserName,
          delegationCountry: delegateCountry,
          speakDurationSeconds: 90
        })
      });
      const data = await res.json();
      if (data.success) {
        await fetchStageData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Dais Action: Start Next Speaker
  const handleStartSpeaker = async (item: CallSpeakerQueueItem) => {
    try {
      setActiveSpeaker(item);
      setSpeechSecondsLeft(item.speakDurationSeconds || 90);
      setIsTimerRunning(true);

      await fetch(`/api/calls/stage/${encodeURIComponent(stageId)}/queue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'START_SPEECH',
          queueItemId: item.id
        })
      });
      await fetchStageData();
    } catch (e) {
      console.error(e);
    }
  };

  // Dais Action: Conclude Current Speech
  const handleConcludeSpeech = async () => {
    if (!activeSpeaker) return;
    try {
      setIsTimerRunning(false);
      await fetch(`/api/calls/stage/${encodeURIComponent(stageId)}/queue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CONCLUDE_SPEECH',
          queueItemId: activeSpeaker.id
        })
      });
      setActiveSpeaker(null);
      await fetchStageData();
    } catch (e) {
      console.error(e);
    }
  };

  // Dais Action: Yield Time
  const handleYieldTime = async () => {
    if (!activeSpeaker) return;
    try {
      setIsTimerRunning(false);
      await fetch(`/api/calls/stage/${encodeURIComponent(stageId)}/queue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'YIELD_TIME',
          queueItemId: activeSpeaker.id
        })
      });
      setActiveSpeaker(null);
      await fetchStageData();
    } catch (e) {
      console.error(e);
    }
  };

  // Download Speeches Log
  const handleDownloadLog = () => {
    const csvContent = "data:text/csv;charset=utf-8,Country,Delegate,Status,QueuedAt\n" +
      queue.map(q => `"${q.delegationCountry}","${q.userName}","${q.status}","${q.queuedAt}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `stage_${stageId}_attendance_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#030407] text-white flex flex-col font-sans selection:bg-cyan-500/30">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
          <Link href="/call" className="hover:text-cyan-400 transition flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Calling Mesh</span>
          </Link>
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span className="text-white font-bold">PLENARY STAGE LIVE</span>
          </div>
        </div>

        {/* Stage Header Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-neutral-900 to-indigo-950/40 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                ZEN.STAGE &bull; MODEL UN DAIS
              </span>
              <span className="text-xs font-mono text-neutral-400">CHAMBER ID: {stageId}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
              Plenary Assembly Stage &amp; Speaker Floor
            </h1>
            <p className="text-xs text-neutral-400 font-sans">
              Executive Board Dais controls, timed speeches list, floor microphone allocation, and formal caucus procedure.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {/* Chair Mode Toggle or Subscription Gate */}
            {canBroadcastStage ? (
              <button
                type="button"
                onClick={() => setIsDaisChair(!isDaisChair)}
                className={`px-3 py-1.5 rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
                  isDaisChair 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold' 
                    : 'bg-white/5 text-neutral-400 border-white/10'
                }`}
              >
                <Gavel className="w-3.5 h-3.5" />
                <span>{isDaisChair ? 'Dais Chair (Admin)' : 'Delegate View'}</span>
              </button>
            ) : (
              <Link
                href="/pricing"
                className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                title={`Stage Broadcasting requires ${stageRequiredTier}`}
              >
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                <span>Dais Chair (Locked • {stageRequiredTier})</span>
              </Link>
            )}

            {/* Room Lock */}
            {isDaisChair && (
              <button
                type="button"
                onClick={() => setIsRoomLocked(!isRoomLocked)}
                className={`px-3 py-1.5 rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
                  isRoomLocked
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-white/5 text-neutral-300 border-white/10'
                }`}
              >
                {isRoomLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>{isRoomLocked ? 'Chamber Locked' : 'Open Entry'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDownloadLog}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Log</span>
            </button>
          </div>
        </div>

        {/* Central Stage: Podium & Timer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Speaker Podium Stage (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Active Podium Box */}
            <div className="relative aspect-video rounded-3xl bg-black/80 border border-amber-500/40 overflow-hidden shadow-2xl flex flex-col justify-between p-6">
              
              {/* Podium Header */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-[11px] font-mono text-amber-300 font-bold uppercase tracking-wider">
                    SPEAKER ON THE FLOOR
                  </span>
                </div>
                <span className="text-xs font-mono text-neutral-400">
                  FORMAL PLENARY
                </span>
              </div>

              {/* Podium Center: Delegate Display */}
              <div className="text-center space-y-2 z-10 py-6">
                {activeSpeaker ? (
                  <>
                    <span className="text-xs font-mono text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 font-bold">
                      {activeSpeaker.delegationCountry}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
                      {activeSpeaker.userName}
                    </h2>
                    <span className="text-xs text-neutral-400 font-sans block">
                      Addressing the Plenary Chamber
                    </span>
                  </>
                ) : (
                  <div className="space-y-2 text-neutral-500">
                    <MicOff className="w-12 h-12 mx-auto text-neutral-600" />
                    <h3 className="text-sm font-bold font-mono text-neutral-400">Floor is Open</h3>
                    <p className="text-xs max-w-xs mx-auto font-sans">
                      Dais Chair may recognize the next delegate from the speaker queue below.
                    </p>
                  </div>
                )}
              </div>

              {/* Digital Countdown Timer & Progress Bar */}
              <div className="space-y-2 z-10">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-xs text-neutral-400">Allotted Floor Time</span>
                  <div className={`text-2xl font-black ${speechSecondsLeft < 15 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`}>
                    {Math.floor(speechSecondsLeft / 60)}:{(speechSecondsLeft % 60).toString().padStart(2, '0')}
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      speechSecondsLeft < 15 ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-400 to-cyan-400'
                    }`}
                    style={{ width: `${(speechSecondsLeft / 90) * 100}%` }}
                  />
                </div>
              </div>

            </div>

            {/* Dais Speech Action Controls */}
            {isDaisChair && activeSpeaker && (
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isTimerRunning ? 'Pause Time' : 'Resume Time'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSpeechSecondsLeft(90)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition cursor-pointer"
                    title="Reset to 90s"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleYieldTime}
                    className="px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition cursor-pointer"
                  >
                    Yield Remaining Time
                  </button>

                  <button
                    type="button"
                    onClick={handleConcludeSpeech}
                    className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold transition cursor-pointer"
                  >
                    Conclude Speech
                  </button>
                </div>
              </div>
            )}

            {/* Delegate Hand Raise Button */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between font-sans text-xs">
              <div>
                <strong className="text-white block font-mono text-xs">Point of Information / Caucus Motion</strong>
                <span className="text-neutral-400 text-[11px]">Signal the Executive Board Dais for procedural recognition.</span>
              </div>

              <button
                type="button"
                onClick={() => setHandRaised(!handRaised)}
                className={`px-4 py-2 rounded-xl border transition cursor-pointer font-mono text-xs font-bold flex items-center gap-1.5 ${
                  handRaised
                    ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Hand className="w-3.5 h-3.5" />
                <span>{handRaised ? 'Hand Raised ✋' : 'Raise Hand'}</span>
              </button>
            </div>

          </div>

          {/* Right Column: Speaker Queue & Roll Call (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="p-6 rounded-3xl bg-black/60 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-bold">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>PLENARY SPEAKER QUEUE ({queue.filter(q => q.status === 'QUEUED').length})</span>
                </div>

                <button
                  type="button"
                  onClick={handleEnqueueSelf}
                  className="px-3 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-mono font-bold transition cursor-pointer"
                >
                  + Add Self to Queue
                </button>
              </div>

              {/* Queue List */}
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                {queue.filter(q => q.status === 'QUEUED').length === 0 ? (
                  <div className="p-8 text-center text-neutral-500 text-xs font-mono">
                    No delegates currently queued on the speakers list.
                  </div>
                ) : (
                  queue
                    .filter(q => q.status === 'QUEUED')
                    .map((item, index) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <div>
                            <span className="font-bold text-white block">{item.delegationCountry}</span>
                            <span className="text-[10px] text-neutral-400 font-mono">{item.userName} &bull; {item.speakDurationSeconds}s</span>
                          </div>
                        </div>

                        {isDaisChair && (
                          <button
                            type="button"
                            onClick={() => handleStartSpeaker(item)}
                            className="px-3 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-mono text-[10px] font-bold transition cursor-pointer"
                          >
                            Recognize &rarr;
                          </button>
                        )}
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Committee Procedural Directives */}
            <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/10 space-y-2 text-xs font-sans text-neutral-400">
              <span className="font-mono text-cyan-400 font-bold text-[11px] uppercase block">
                Rule of Procedure &bull; Article 14
              </span>
              <p className="leading-relaxed">
                Delegates must not exceed allotted floor time without explicit leave of the Dais. 
                Yielding time to points of information or questions remains subject to Chair discretion.
              </p>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
