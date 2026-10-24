'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode,
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Camera,
  ShieldCheck,
  Search,
  Users,
  Clock,
  Radio,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
  Power,
  RotateCw,
  ExternalLink,
  GraduationCap,
  Calendar,
  Layers,
  MapPin,
  Check,
  ChevronRight,
  Flame,
  UserCheck
} from 'lucide-react';
import { useZenPass } from '@/context/ZenPassContext';
import { ZenPassTicket } from '@/types/zenpass';

interface ZenPassScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId?: string;
  eventStartTime?: string; // ISO string or time string e.g. "2026-10-09T09:00:00"
  eventTitle?: string;
  venueName?: string;
  onTicketScanned?: (ticket: any) => void;
}

export function ZenPassScannerModal({ 
  isOpen, 
  onClose,
  eventId,
  eventStartTime = '2026-10-09T09:00:00',
  eventTitle = 'Active Conference Assembly',
  venueName = 'Main Assembly Hall, North Campus',
  onTicketScanned,
}: ZenPassScannerModalProps) {
  const { validateAndCheckInPass, userPasses } = useZenPass();
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Input & Scan State
  const [inputCode, setInputCode] = useState<string>('');
  const [scanResult, setScanResult] = useState<{
    status: 'idle' | 'success' | 'warning' | 'error';
    message: string;
    ticket?: ZenPassTicket | any;
    isStudent?: boolean;
    timestamp?: string;
  }>({
    status: 'idle',
    message: ''
  });

  // Sound Mute Toggle
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Camera Video Feed State
  const [isLiveCameraActive, setIsLiveCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Timing Intelligence & Automatic Arming
  // Default: Event starts at 09:00 AM. Scanner auto-arms when event start time arrives.
  const [targetEventTime, setTargetEventTime] = useState<Date>(() => {
    // If passed eventStartTime is in future, use it. Otherwise set to today at 09:00 AM or now + 2 hours for demonstration
    const d = new Date(eventStartTime);
    if (!isNaN(d.getTime())) return d;
    const now = new Date();
    now.setHours(9, 0, 0, 0);
    return now;
  });

  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [manualOverrideArmed, setManualOverrideArmed] = useState<boolean>(false);

  // Live Clock Tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Is event time reached?
  const isEventStarted = currentTime.getTime() >= targetEventTime.getTime();
  
  // Scanner is active IF event has started OR organizer activated manual choice override
  const isScannerActive = isEventStarted || manualOverrideArmed;

  // Countdown Calculation
  const timeDifferenceMs = targetEventTime.getTime() - currentTime.getTime();
  const countdownFormatted = useMemo(() => {
    if (timeDifferenceMs <= 0) return '00:00:00 (DOORS OPEN)';
    const totalSecs = Math.floor(timeDifferenceMs / 1000);
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;
    return `${hours.toString().padStart(2, '0')}h : ${minutes.toString().padStart(2, '0')}m : ${seconds.toString().padStart(2, '0')}s`;
  }, [timeDifferenceMs]);

  // Web Audio Synthesizer: Zero external asset dependencies
  const playSound = useCallback((type: 'success' | 'error') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'success') {
        // High dual-tone harmonic chord for authorized entry
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5
        osc1.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.12);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1320, ctx.currentTime); // E6
        osc2.frequency.exponentialRampToValueAtTime(2640, ctx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.28);
        osc2.stop(ctx.currentTime + 0.28);
      } else {
        // Deep square buzz for warning / invalid
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.setValueAtTime(95, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (_) {}
  }, [soundEnabled]);

  // Turn on / off real webcam
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsLiveCameraActive(true);
    } catch (err: any) {
      setCameraError('Camera access denied or unavailable. Using holographic laser optical scanner.');
      setIsLiveCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsLiveCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (!isOpen) return null;

  // Process ticket scan code with real server-side cryptographic database verification
  const processTicketVerification = async (code: string) => {
    const cleanCode = code.trim();
    if (!cleanCode) return;

    // Check if scanner is locked by schedule and manual choice is off
    if (!isScannerActive) {
      playSound('error');
      setScanResult({
        status: 'error',
        message: 'DOORS NOT OPEN YET: Scanner is locked until event commencement. Toggle "Manual Gate Override" if admitting attendees early.',
      });
      return;
    }

    setIsVerifying(true);

    try {
      // 1. Query server-side cryptographic verification API backed by Prisma database
      const response = await fetch('/api/events/verify-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenOrCode: cleanCode,
          eventId,
          operatorName: 'Gate Scanner Node #01',
          markCheckIn: true,
        }),
      });

      const data = await response.json();

      if (data.valid && data.success && data.ticket) {
        playSound('success');
        // Synchronize with local context passes
        validateAndCheckInPass(cleanCode);
        if (onTicketScanned) onTicketScanned(data.ticket);

        setScanResult({
          status: 'success',
          message: data.message || `ACCESS GRANTED! Verified Admission for ${data.ticket.attendeeName}`,
          ticket: data.ticket,
          isStudent: Boolean(data.ticket.isStudent),
          timestamp: new Date().toLocaleTimeString(),
        });
      } else {
        playSound('error');
        if (data.error === 'DUPLICATE_ENTRY') {
          setScanResult({
            status: 'warning',
            message: data.message || 'DUPLICATE ENTRY: This pass was already scanned and admitted earlier!',
            ticket: data.ticket,
            isStudent: Boolean(data.ticket?.isStudent),
            timestamp: new Date().toLocaleTimeString(),
          });
        } else if (data.error === 'CRYPTOGRAPHIC_SEAL_INVALID' || data.error === 'TOKEN_SIGNATURE_MISMATCH') {
          setScanResult({
            status: 'error',
            message: data.message || 'COUNTERFEIT FORGERY ALERT: Cryptographic HMAC seal mismatch! Ticket token was manipulated.',
            timestamp: new Date().toLocaleTimeString(),
          });
        } else {
          // Fake / Unregistered ticket
          // Fallback check against client state if ticket was created in current offline session
          const localRes = validateAndCheckInPass(cleanCode);
          if (localRes.success && localRes.ticket) {
            playSound('success');
            if (onTicketScanned) onTicketScanned(localRes.ticket);
            setScanResult({
              status: 'success',
              message: localRes.message,
              ticket: localRes.ticket,
              isStudent: Boolean(localRes.ticket.tierId?.includes('student')),
              timestamp: new Date().toLocaleTimeString(),
            });
          } else {
            setScanResult({
              status: 'error',
              message: data.message || 'FAKE TICKET REJECTED: Not found in ZENVITRA database records. Access strictly denied.',
              timestamp: new Date().toLocaleTimeString(),
            });
          }
        }
      }
    } catch (err: any) {
      console.warn('[SCANNER-VERIFY-ERROR]', err);
      // Fallback to local context pass validation
      const localRes = validateAndCheckInPass(cleanCode);
      if (localRes.success && localRes.ticket) {
        playSound('success');
        if (onTicketScanned) onTicketScanned(localRes.ticket);
        setScanResult({
          status: 'success',
          message: localRes.message,
          ticket: localRes.ticket,
          isStudent: Boolean(localRes.ticket.tierId?.includes('student')),
          timestamp: new Date().toLocaleTimeString(),
        });
      } else {
        playSound('error');
        setScanResult({
          status: 'error',
          message: localRes.message || 'Verification Error: Failed to contact validation vault.',
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processTicketVerification(inputCode);
    setInputCode('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-2 sm:p-6 overflow-y-auto select-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-2xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-2xl max-h-[94vh] bg-[#06080e] border border-emerald-500/40 rounded-2xl sm:rounded-3xl shadow-[0_25px_90px_rgba(0,0,0,0.95)] flex flex-col overflow-y-auto overflow-x-hidden z-10 text-white font-sans"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-cyan-950/40">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition ${
                isScannerActive 
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]' 
                  : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
              }`}>
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-bold text-lg text-white">
                    ZenPass Gate Admission Scanner
                  </h2>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-black tracking-wider ${
                    isScannerActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {isScannerActive ? 'DOORS OPEN' : 'STANDBY LOCK'}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-sans truncate">
                  {eventTitle} &bull; {venueName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSoundEnabled((prev) => !prev)}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition cursor-pointer"
                title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-7 space-y-6 overflow-y-auto max-h-[82vh] custom-scrollbar text-xs pb-24 sm:pb-8">
            
            {/* ── EVENT TIMING INTELLIGENCE & SCHEDULE BAR ── */}
            <div className={`p-4 rounded-2xl border transition space-y-3 font-mono ${
              isScannerActive 
                ? 'bg-emerald-950/20 border-emerald-500/40' 
                : 'bg-[#0a0c14] border-amber-500/30'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2 text-neutral-300 text-xs">
                  <Clock className={`w-4 h-4 ${isScannerActive ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`} />
                  <span className="font-bold">Schedule Countdown:</span>
                  <span className={`font-bold ${isScannerActive ? 'text-emerald-300' : 'text-amber-300'}`}>
                    {countdownFormatted}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-neutral-500">Scheduled Doors:</span>
                  <span className="text-white font-bold">{targetEventTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {/* OF COURSE THEY HAVE CHOICE - MANUAL OVERRIDE TOGGLE */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-0.5">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">Organizer Choice: Manual Gate Override</span>
                    {manualOverrideArmed && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-bold">
                        EARLY ADMISSION ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-neutral-400 font-sans">
                    Force arm scanner ahead of schedule for Dais early access, rehearsal delegates, or VIP arrival.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const next = !manualOverrideArmed;
                    setManualOverrideArmed(next);
                    playSound(next ? 'success' : 'error');
                  }}
                  className={`px-4 py-2 rounded-xl font-bold font-mono text-xs transition cursor-pointer flex items-center justify-center gap-2 shrink-0 border ${
                    manualOverrideArmed
                      ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                      : 'bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10 border-white/10'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{manualOverrideArmed ? 'Override Active (ARMED)' : 'Force Arm Early'}</span>
                </button>
              </div>
            </div>

            {/* ── OPTICAL VIEWFINDER & CAMERA FEED ── */}
            <div className="relative w-full h-56 rounded-3xl bg-black border border-emerald-500/30 flex flex-col items-center justify-center overflow-hidden shadow-inner">
              {/* If Live Device Camera is On */}
              {isLiveCameraActive ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Holographic targeting reticle */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-44 h-44 border-2 border-emerald-400/80 rounded-2xl relative shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-300" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-300" />
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-300" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-300" />
                      <motion.div
                        animate={{ y: [-70, 70, -70] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                        className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,1)]"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Holographic Laser Simulator Viewfinder */
                <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                  {/* Background grid */}
                  <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

                  {isScannerActive ? (
                    <div className="w-40 h-40 border-2 border-emerald-400/50 rounded-2xl relative flex items-center justify-center bg-emerald-950/10 shadow-[0_0_25px_rgba(16,185,129,0.15)]">
                      <QrCode className="w-20 h-20 text-emerald-400/40" />

                      {/* Moving laser sweep */}
                      <motion.div
                        animate={{ y: [-65, 65, -65] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                        className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,1)]"
                      />

                      <div className="absolute -bottom-6 font-mono text-[9px] text-emerald-400 uppercase tracking-widest font-bold">
                        OPTICAL SCANNER READY
                      </div>
                    </div>
                  ) : (
                    <div className="w-40 h-40 border-2 border-amber-500/40 border-dashed rounded-2xl relative flex flex-col items-center justify-center bg-black/60 text-center p-3">
                      <Lock className="w-8 h-8 text-amber-400/60 mb-2" />
                      <span className="font-mono text-[10px] text-amber-300 font-bold uppercase">
                        DOORS CLOSED
                      </span>
                      <span className="text-[9px] text-neutral-500 font-mono mt-1">
                        Locked by Schedule
                      </span>
                    </div>
                  )}

                  <div className="absolute top-3 left-4 flex items-center gap-2 font-mono text-[10px]">
                    <span className={`w-2 h-2 rounded-full ${isScannerActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                    <span className="text-neutral-400">TERMINAL: GATE-04A &bull; NORTH INGRESS</span>
                  </div>
                </div>
              )}

              {/* Camera Switcher Button in Viewfinder */}
              <div className="absolute bottom-3 right-4 z-10">
                <button
                  type="button"
                  onClick={isLiveCameraActive ? stopCamera : startCamera}
                  className="px-3 py-1.5 rounded-xl bg-black/80 hover:bg-black border border-white/20 text-neutral-300 hover:text-white font-mono text-[10px] font-bold transition flex items-center gap-1.5 cursor-pointer backdrop-blur"
                >
                  <Camera className="w-3 h-3 text-cyan-400" />
                  <span>{isLiveCameraActive ? 'Switch to Laser Reticle' : 'Enable Live Camera'}</span>
                </button>
              </div>
            </div>

            {cameraError && (
              <p className="text-[11px] text-amber-400 font-mono">{cameraError}</p>
            )}

            {/* ── MANUAL TICKET & QR CODE INPUT ── */}
            <form onSubmit={handleScanSubmit} className="space-y-2 font-mono">
              <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block">
                Enter Ticket Pass Token or Security Pulse Hash
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="e.g. ZEN-PASS-DPS-101 or TKT-DYS-9948"
                  className="flex-1 bg-black/70 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 uppercase focus:outline-none focus:border-emerald-400 tracking-wider"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Admission</span>
                </button>
              </div>
            </form>

            {/* ── DETAILED VERIFICATION PASS RESULT (REAL TYPE SHIT) ── */}
            {scanResult.status !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-3xl border space-y-3 font-mono ${
                  scanResult.status === 'success'
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                    : scanResult.status === 'warning'
                    ? 'bg-amber-950/30 border-amber-500/50 text-amber-200'
                    : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                }`}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {scanResult.status === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : scanResult.status === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                    <span>{scanResult.message}</span>
                  </div>
                  {scanResult.timestamp && (
                    <span className="text-[10px] text-neutral-400">{scanResult.timestamp}</span>
                  )}
                </div>

                {scanResult.ticket && (
                  <div className="space-y-3 pt-1">
                    {/* Attendee Details Grid */}
                    <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase block">Delegate Name</span>
                        <div className="text-white font-bold text-sm flex items-center gap-1.5 pt-0.5">
                          <span>{scanResult.ticket.attendeeName}</span>
                          <span className="text-[11px] text-neutral-400 font-normal">(@{scanResult.ticket.attendeeHandle})</span>
                        </div>
                        <span className="text-[11px] text-cyan-300 font-sans">{scanResult.ticket.collegeOrSchool}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase block">Tax &amp; Age Category</span>
                        <div className="pt-0.5">
                          {scanResult.isStudent ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                              <GraduationCap className="w-3.5 h-3.5" />
                              <span>STUDENT PASS (AGE &le; 18 &bull; 0% GST EXEMPT)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>GENERAL ATTENDEE (AGE &gt; 18 &bull; 6% GST)</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-2 pt-2 border-t border-white/5 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                        <div>
                          <span className="text-[10px] text-neutral-400 uppercase block">Committee</span>
                          <span className="text-white font-bold">{scanResult.ticket.committeeName || 'UN General Assembly'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-400 uppercase block">Allocated Seat / Role</span>
                          <span className="text-amber-300 font-bold">{scanResult.ticket.allocatedPortfolio || 'Delegate Seat #42'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-400 uppercase block">Security Hash</span>
                          <span className="text-neutral-400 font-mono text-[10px] truncate block">{scanResult.ticket.securityPulseHash || 'SHA256-VALID'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── QUICK DEMO TEST TICKETS (REALISTIC SAMPLES) ── */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5 font-mono text-xs">
              <span className="text-[11px] font-bold text-neutral-400 uppercase block">
                Quick One-Click Test Badges:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => processTicketVerification('ZEN-PASS-DPS-STUDENT-101')}
                  className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30 text-left transition cursor-pointer"
                >
                  <div className="text-white font-bold text-xs flex items-center justify-between">
                    <span>Aarav Sharma</span>
                    <span className="text-emerald-400 text-[10px]">0% GST</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 font-sans">Age: 16 &bull; DPS R.K. Puram &bull; UNGA France</div>
                </button>

                <button
                  type="button"
                  onClick={() => processTicketVerification('ZEN-PASS-XAVIERS-NORMAL-202')}
                  className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 text-left transition cursor-pointer"
                >
                  <div className="text-white font-bold text-xs flex items-center justify-between">
                    <span>Ananya Deshmukh</span>
                    <span className="text-amber-400 text-[10px]">6% GST</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 font-sans">Age: 21 &bull; St. Xavier\'s College &bull; Observer</div>
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
