'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Ticket, 
  ShieldCheck, 
  Share2, 
  Sparkles, 
  Check, 
  Radio, 
  Trash2, 
  QrCode,
  Flame,
  Award,
  Layers,
  Zap,
  Lock,
  Cpu,
  ArrowRight,
  AlertCircle,
  AlertTriangle,
  X,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { useZenEvents } from '@/context/ZenEventsPlatformContext';
import { useMun } from '@/context/MunContext';
import { useZenPass } from '@/context/ZenPassContext';
import { ZenPassBookingModal } from './ZenPassBookingModal';
import { ZenPassHolographicTicket } from './ZenPassHolographicTicket';

export function EventDetail() {
  const router = useRouter();
  const { 
    activeEventId, 
    getEventById, 
    setActiveView, 
    setActiveEventId, 
    rsvpEvent, 
    cancelRsvp, 
    getUserRsvpStatus,
    deleteEvent,
    cancelEvent,
    currentUserId,
    currentUserName,
    currentUserUsername
  } = useZenEvents();

  const { getInviteForEvent, registerForMun, setSelectedInviteModal } = useMun();
  const { getPassesForEvent, activePassForModal, setActivePassForModal } = useZenPass();

  const [copied, setCopied] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cancelReasonInput, setCancelReasonInput] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelResult, setCancelResult] = useState<{ refundedCount: number; totalRefundAmount: number } | null>(null);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const event = activeEventId ? getEventById(activeEventId) : undefined;

  // Live Countdown calculation
  useEffect(() => {
    if (!event) return;
    const targetDate = new Date(event.date).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [event]);

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center font-sans">
        <div className="w-16 h-16 rounded-3xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8 text-neutral-500" />
        </div>
        <h3 className="font-display font-bold text-lg text-white mb-2">Convening Not Found</h3>
        <p className="text-xs font-mono text-neutral-500 mb-6">This summit or convening might have been archived.</p>
        <button
          onClick={() => { setActiveEventId(null); setActiveView('list'); }}
          className="px-5 py-2.5 rounded-2xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition cursor-pointer"
        >
          Return to Events Directory
        </button>
      </div>
    );
  }

  const userStatus = getUserRsvpStatus(event.id);
  const isGoing = userStatus === 'going';
  const isInterested = userStatus === 'interested';
  const isOrganizer = event.organizerId === currentUserId;

  const eventInvite = getInviteForEvent(event.id);
  const isAccepted = eventInvite?.status === 'accepted';
  const isPending = eventInvite?.status === 'pending';

  const handleIssuePass = () => {
    rsvpEvent(event.id, 'going');
    if (!eventInvite) {
      registerForMun(
        event.id,
        event.title,
        'United Nations Security Council',
        ['Delegation of France', 'Delegation of United Kingdom', 'Delegation of Japan'],
        'advanced'
      );
    }
  };

  const eventDate = new Date(event.date);
  const fullDate = eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const goingAttendees = event.attendees.filter((a) => a.status === 'going');

  const handleShare = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const serialCode = `ZID-PASS-${event.id.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}-8821`;

  return (
    <div className="max-w-5xl mx-auto font-sans pb-20 space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <button
          onClick={() => { setActiveEventId(null); setActiveView('list'); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Summits Matrix</span>
        </button>

        <div className="flex items-center gap-2">
          {isOrganizer && event.status !== 'cancelled' && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs font-mono text-rose-300 hover:text-white hover:bg-rose-500/20 transition cursor-pointer"
              title="Cancel convening and refund delegates"
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Cancel Convening</span>
            </button>
          )}

          {isOrganizer && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 rounded-xl text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
              title="Delete event"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Pass Link Copied' : 'Share Pass'}</span>
          </button>
        </div>
      </div>

      {/* Convening Cancelled Notice Banner */}
      {event.status === 'cancelled' && (
        <div className="p-6 rounded-3xl bg-rose-950/40 border border-rose-500/50 backdrop-blur-xl space-y-3 shadow-[0_0_50px_rgba(244,63,94,0.15)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-rose-200 flex items-center gap-2">
                <span>CONVENING CANCELLED BY SECRETARIAT</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  100% REFUND AUTOMATED
                </span>
              </h3>
              <p className="text-xs text-rose-300/80 font-mono">
                Reason: {event.cancellationReason || 'Convening cancelled by host secretariat.'}
              </p>
            </div>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed border-t border-rose-500/20 pt-3">
            All registered delegates with paid ZenPass tiers have been automatically refunded 100% of their ticket amounts back to their original UPI / payment methods without deduction. Check your ZenPass Wallet for the refund receipt.
          </p>
        </div>
      )}

      {/* Hero Banner with Futuristic Cyber Overlay */}
      <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-neutral-950 shadow-[0_0_80px_rgba(0,0,0,0.9)]">
        <div className="h-72 sm:h-96 w-full relative overflow-hidden">
          {event.coverImage ? (
            <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-indigo-950 via-[#060810] to-black flex items-center justify-center">
              <Sparkles className="w-20 h-20 text-white/10" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070e] via-[#05070e]/60 to-black/40" />
        </div>

        {/* Hero Overlaid Info */}
        <div className="p-6 sm:p-10 -mt-36 relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white font-mono text-xs font-bold shadow-md">
              {event.category}
            </span>
            <span className="px-3.5 py-1 rounded-full bg-cyan-500/20 backdrop-blur-xl border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold uppercase shadow-[0_0_15px_rgba(0,242,254,0.3)]">
              {event.type} MATRIX
            </span>
            {event.status === 'live' && (
              <span className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/25 backdrop-blur-xl border border-rose-500 text-rose-300 font-mono text-xs font-bold animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.4)]">
                <Radio className="w-3.5 h-3.5" />
                CONVENING IN SESSION
              </span>
            )}
          </div>

          <h1 className="font-display font-bold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
            {event.title}
          </h1>

          {/* Live Segmented Countdown Clock */}
          <div className="p-4 sm:p-5 rounded-3xl bg-black/70 backdrop-blur-2xl border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest">
              <Clock className="w-4 h-4 animate-pulse" />
              <span>CONVENING COUNTDOWN</span>
            </div>

            <div className="flex items-center gap-3 font-mono text-center">
              <div className="px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 min-w-[56px]">
                <span className="block text-lg sm:text-2xl font-bold text-white leading-none">{timeLeft.days}</span>
                <span className="text-[9px] text-neutral-400 uppercase">Days</span>
              </div>
              <span className="text-cyan-400 font-bold text-lg">:</span>
              <div className="px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 min-w-[56px]">
                <span className="block text-lg sm:text-2xl font-bold text-white leading-none">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="text-[9px] text-neutral-400 uppercase">Hours</span>
              </div>
              <span className="text-cyan-400 font-bold text-lg">:</span>
              <div className="px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 min-w-[56px]">
                <span className="block text-lg sm:text-2xl font-bold text-white leading-none">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className="text-[9px] text-neutral-400 uppercase">Mins</span>
              </div>
              <span className="text-cyan-400 font-bold text-lg">:</span>
              <div className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 min-w-[56px]">
                <span className="block text-lg sm:text-2xl font-bold text-cyan-300 leading-none">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <span className="text-[9px] text-cyan-400 uppercase">Secs</span>
              </div>
            </div>
          </div>

          {/* Quick Details Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 font-mono text-xs">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.04] border border-white/10 shadow-sm">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shadow-inner">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] text-neutral-500">SCHEDULE</span>
                <span className="text-white font-semibold">{fullDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.04] border border-white/10 shadow-sm">
              <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 shadow-inner">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] text-neutral-500">TIME WINDOW</span>
                <span className="text-white font-semibold">{event.time}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.04] border border-white/10 shadow-sm">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shadow-inner">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] text-neutral-500">CONVENING HUB</span>
                <span className="text-white font-semibold truncate max-w-[150px]">{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Details & Right Holographic Pass */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Convening Mandate & Host */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Convening Card */}
          <div className="rounded-3xl p-6 sm:p-8 card-luxury border border-white/10 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-cyan-400" />
              Summit Mandate & Protocol
            </h2>
            <div className="text-neutral-200 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans">
              {event.description}
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/[0.06]">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-neutral-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Convening Convener Profile */}
          <div className="rounded-3xl p-6 card-luxury border border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-violet-500 to-rose-500 p-0.5 shadow-md">
                <div className="w-full h-full rounded-[14px] bg-[#06080c] flex items-center justify-center font-display font-bold text-lg text-white">
                  {event.organizerName?.[0]?.toUpperCase() || 'O'}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">CONVENER NODE</span>
                <span className="font-display font-bold text-base text-white">{event.organizerName}</span>
                <p className="font-mono text-xs text-neutral-400">@{event.organizerUsername}</p>
              </div>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Host</span>
            </div>
          </div>

          {/* Delegate Swarm */}
          <div className="rounded-3xl p-6 sm:p-8 card-luxury border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                Delegates & Participants ({goingAttendees.length})
              </h2>
              {event.capacity && (
                <span className="text-xs font-mono text-neutral-400">
                  {event.capacity - goingAttendees.length} spots remaining
                </span>
              )}
            </div>

            {goingAttendees.length === 0 ? (
              <p className="text-xs font-mono text-neutral-500 py-4">No registered attendees yet. Claim the first pass!</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {goingAttendees.map((att) => (
                  <div
                    key={att.userId}
                    className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-2.5"
                  >
                    <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center font-mono font-bold text-xs text-white shrink-0">
                      {att.name?.[0]?.toUpperCase() || 'D'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{att.name}</p>
                      <p className="text-[10px] font-mono text-neutral-500 truncate">@{att.username}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Holographic Laser Scanner Pass */}
        <div className="space-y-6">
          <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[#111728] via-[#090c14] to-[#04060a] border border-cyan-500/40 shadow-[0_0_50px_rgba(0,242,254,0.2)] space-y-6 relative overflow-hidden">
            {/* Holographic Laser Sweep Effect */}
            <div className="laser-scan-effect" />

            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <span className="font-mono text-xs font-bold text-white tracking-widest">CRYPTOGRAPHIC PASS</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                ON-CHAIN
              </span>
            </div>

            {/* Pass Identity Details */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                <span className="text-[10px] text-neutral-500 uppercase">DELEGATE HOLDER</span>
                <p className="text-sm font-bold text-white truncate">{currentUserName}</p>
                <p className="text-[11px] text-cyan-400 truncate">@{currentUserUsername}</p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase">HASH IDENTIFIER</span>
                  <p className="text-xs font-bold text-white">{serialCode}</p>
                </div>
                <QrCode className="w-10 h-10 text-cyan-300 p-1 bg-white/5 rounded-xl border border-white/10" />
              </div>
            </div>

            {/* ZenPass Booking & Gate Pass Trigger */}
            <div className="space-y-2 pt-2">
              {(() => {
                const eventPasses = getPassesForEvent(event.id);
                const myPass = eventPasses[0];

                if (event.status === 'cancelled') {
                  return (
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-2 font-mono text-xs text-white">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-rose-300 font-bold uppercase">CONVENING STATUS</span>
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/40">CANCELLED</span>
                        </div>
                        <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                          {myPass 
                            ? 'Your paid ZenPass has been refunded in full back to your account.' 
                            : 'This convening was cancelled by the host secretariat.'}
                        </p>
                      </div>

                      {myPass && (
                        <button
                          type="button"
                          onClick={() => setActivePassForModal(myPass)}
                          className="w-full py-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 font-display font-bold text-xs hover:bg-rose-500/30 transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                        >
                          <Ticket className="w-4 h-4 text-rose-400" />
                          <span>View Refunded ZenPass Ticket</span>
                        </button>
                      )}
                    </div>
                  );
                }

                if (myPass) {
                  return (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-purple-500/15 border border-amber-500/30 space-y-1.5 font-mono text-xs text-white shadow-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-amber-300 font-bold uppercase">ZENPASS RECORDED</span>
                          <span className="text-[10px] text-emerald-400 font-bold">#{myPass.ticketNumber}</span>
                        </div>
                        <p className="font-bold text-sm text-white">{myPass.tierName}</p>
                        {myPass.allocatedPortfolio && (
                          <p className="text-[11px] text-amber-200">Role: {myPass.allocatedPortfolio}</p>
                        )}
                      </div>

                      {/* Launch Holographic Ticket Modal */}
                      <button
                        type="button"
                        onClick={() => setActivePassForModal(myPass)}
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white font-display font-bold text-xs hover:scale-105 transition-all shadow-[0_0_25px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Ticket className="w-4 h-4 fill-current text-amber-200" />
                        <span>View Holographic ZenPass &amp; QR</span>
                      </button>

                      {/* Direct Chamber Entry */}
                      <button
                        type="button"
                        onClick={() => router.push(`/committee?room=${myPass.chamberRoomId || 'unsc-2026'}`)}
                        className="w-full py-3 rounded-2xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <Radio className="w-4 h-4 text-black animate-pulse" />
                        <span>Enter Committee Chamber</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="space-y-2.5">
                    {/* Primary ZenPass Booking CTA */}
                    <button
                      type="button"
                      onClick={() => setShowBookingModal(true)}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white font-display font-bold text-xs uppercase tracking-wider transition shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Ticket className="w-4 h-4 fill-current text-amber-200" />
                      <span>Book Official ZenPass (Tiers from ₹499)</span>
                    </button>

                    <button
                      onClick={() => (isGoing ? cancelRsvp(event.id) : rsvpEvent(event.id, 'going'))}
                      className={`w-full py-2.5 rounded-xl border font-mono text-xs transition cursor-pointer ${
                        isGoing
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'border-white/10 text-neutral-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {isGoing ? '✓ RSVP Active (Standard Entry)' : 'Quick Free RSVP'}
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* ── CANCEL CONVENING MODAL (ORGANIZER) ── */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-neutral-950 border border-rose-500/40 p-6 sm:p-8 space-y-6 shadow-[0_0_80px_rgba(244,63,94,0.3)] font-sans">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">Cancel Convening</h3>
                  <p className="text-xs font-mono text-neutral-400">Automated 100% Refund &amp; Delegate Broadcast</p>
                </div>
              </div>
              <button
                onClick={() => { setShowCancelModal(false); setCancelResult(null); }}
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {cancelResult ? (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>CONVENING CANCELLED SUCCESSFULLY</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                    All registered delegates have been notified. {cancelResult.refundedCount} paid ZenPass tickets were automatically refunded (Total refunded: ₹{cancelResult.totalRefundAmount.toLocaleString()}).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelResult(null);
                  }}
                  className="w-full py-3 rounded-xl bg-white text-black font-display font-bold text-xs hover:bg-neutral-200 transition cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/20 text-xs text-rose-200/90 leading-relaxed space-y-2 font-mono">
                  <p className="font-bold text-rose-300">⚠️ WHAT WILL HAPPEN AUTOMATICALLY:</p>
                  <ul className="list-disc pl-4 space-y-1 text-neutral-300 text-[11px]">
                    <li>Event status switches permanently to <strong>CANCELLED</strong>.</li>
                    <li>All paid delegates who booked ZenPass will receive a <strong>100% full refund</strong> immediately.</li>
                    <li>Chamber access and booking forms will be closed.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono text-neutral-300 font-bold uppercase">
                    Cancellation Reason for Delegates:
                  </label>
                  <textarea
                    rows={3}
                    value={cancelReasonInput}
                    onChange={(e) => setCancelReasonInput(e.target.value)}
                    placeholder="e.g. Schedule emergency, diplomatic quorum rescheduling, venue maintenance..."
                    className="w-full px-4 py-3 rounded-2xl bg-neutral-900 border border-white/10 text-white font-mono text-xs focus:border-rose-400 focus:outline-none placeholder:text-neutral-600 resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCancelModal(false)}
                    className="flex-1 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-300 hover:bg-white/10 transition cursor-pointer"
                  >
                    Keep Convening
                  </button>
                  <button
                    type="button"
                    disabled={isCancelling}
                    onClick={async () => {
                      setIsCancelling(true);
                      const res = cancelEvent(event.id, cancelReasonInput || 'Convening cancelled by host secretariat.');
                      setCancelResult({
                        refundedCount: res?.refundedCount || 0,
                        totalRefundAmount: res?.totalRefundAmount || 0
                      });
                      setIsCancelling(false);
                    }}
                    className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-display font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(244,63,94,0.4)] disabled:opacity-50"
                  >
                    {isCancelling ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4" />
                        <span>Cancel &amp; Issue Refunds</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── DELETE CONVENING MODAL ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-neutral-950 border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl font-sans">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">Delete Convening</h3>
                <p className="text-xs font-mono text-neutral-400">Permanent Record Purge</p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Are you sure you want to permanently delete <strong>{event.title}</strong>? Any active paid ZenPass tickets will automatically be credited with full refunds.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-300 hover:bg-white/10 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteEvent(event.id);
                  setShowDeleteModal(false);
                  setActiveEventId(null);
                  setActiveView('list');
                }}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-display font-bold text-xs transition cursor-pointer shadow-[0_0_20px_rgba(244,63,94,0.4)]"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ZENPASS MODALS ── */}
      {showBookingModal && (
        <ZenPassBookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          event={event}
        />
      )}

      {activePassForModal && (
        <ZenPassHolographicTicket
          ticket={activePassForModal}
          onClose={() => setActivePassForModal(null)}
        />
      )}
    </div>
  );
}
