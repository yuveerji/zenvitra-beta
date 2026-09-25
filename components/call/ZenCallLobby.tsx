'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneCall, 
  Users, 
  Radio, 
  Gavel, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Copy, 
  Check, 
  Volume2, 
  Sliders, 
  Tv, 
  Layers,
  Compass,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Settings,
  Bell,
  X,
  Plus,
  Lock,
  Keyboard,
  Share2,
  ExternalLink,
  Clock,
  Trash2
} from 'lucide-react';
import { CallMode } from '@/types/call';

// Google Meet Colorful Camera Icon
const GoogleMeetCameraIcon = ({ className = "w-7 h-7" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

// Minimalist Desk & Coffee Illustration from Google Meet screenshot
const GoogleMeetIllustration = () => (
  <div className="relative w-64 h-48 mx-auto flex items-center justify-center">
    <svg viewBox="0 0 300 200" className="w-full h-full" fill="none">
      {/* Yellow Sun */}
      <circle cx="210" cy="45" r="14" fill="#FDE293" stroke="#F9AB00" strokeWidth="1.5" />

      {/* Desk Base Line */}
      <line x1="20" y1="150" x2="280" y2="150" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />

      {/* Coffee Mug */}
      <path 
        d="M135 110 h32 c1 0 1.5 8 1 18 -1 12 -5 18 -16 18 h-2 c-11 0-15-6-16-18 -.5-10 0-18 1-18 z" 
        fill="url(#coffeeGradient)" 
        stroke="#1F2937" 
        strokeWidth="2" 
      />
      {/* Mug Handle */}
      <path d="M168 116 c8 0 12 5 12 11 0 7-5 12-12 12" stroke="#1F2937" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Steam line */}
      <path d="M148 102 c-10-8 5-16 -5-24" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Pencil */}
      <path 
        d="M175 148 L160 90 L166 88 L181 148 Z" 
        fill="#FDE293" 
        stroke="#1F2937" 
        strokeWidth="1.5" 
      />
      <polygon points="160,90 166,88 163,80" fill="#1F2937" />

      {/* Tablet Screen */}
      <rect x="185" y="95" width="46" height="52" rx="6" fill="#F9FAFB" stroke="#1F2937" strokeWidth="2" />
      {/* Camera icon inside tablet */}
      <rect x="195" y="112" width="16" height="12" rx="2" fill="#E5E7EB" stroke="#1F2937" strokeWidth="1.5" />
      <polygon points="211,114 220,110 220,126 211,122" fill="#E5E7EB" stroke="#1F2937" strokeWidth="1.5" />

      {/* Soft rounded decor shape (left) */}
      <path 
        d="M95 115 c0-15 12-25 24-25 v50 c-12 0-24-10-24-25 z" 
        fill="url(#pinkGradient)" 
        stroke="#1F2937" 
        strokeWidth="1.5" 
      />

      <defs>
        <linearGradient id="coffeeGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FEEFC3" />
          <stop offset="100%" stopColor="#FCD34D" />
        </linearGradient>
        <linearGradient id="pinkGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FCE7F3" />
          <stop offset="100%" stopColor="#F472B6" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

interface ScheduledMeeting {
  id: string;
  title: string;
  time: string;
  dateKey: string; // e.g. "2026-09-17"
  mode: CallMode;
  code: string;
}

export function ZenCallLobby() {
  const router = useRouter();

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'meetings' | 'calls' | 'greenroom'>('meetings');

  // Top bar join input & new meeting dropdown
  const [joinCode, setJoinCode] = useState('');
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCreatedModal, setShowCreatedModal] = useState(false);
  const [createdRoomCode, setCreatedRoomCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Notification Banner
  const [showNotificationToast, setShowNotificationToast] = useState(true);

  // Date Navigation State
  const [selectedDayOffset, setSelectedDayOffset] = useState(3); // 3 = Thu in 7-day strip (Mon 14 .. Sun 20)

  // Green Room preview state
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [micLevel, setMicLevel] = useState(30);
  const [selectedBg, setSelectedBg] = useState<'none' | 'blur' | 'geneva' | 'stage'>('none');
  const [customBgImage, setCustomBgImage] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<CallMode>('GROUP');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Scheduled meetings
  const [scheduledMeetings, setScheduledMeetings] = useState<ScheduledMeeting[]>([]);
  const [newMeetingTitle, setNewMeetingTitle] = useState('');
  const [newMeetingTime, setNewMeetingTime] = useState('14:00');
  const [newMeetingMode, setNewMeetingMode] = useState<CallMode>('GROUP');

  // Days list matching Google Meet screenshot: Mon 14, Tue 15, Wed 16, Thu 17, Fri 18, Sat 19, Sun 20
  const daysList = [
    { day: 'MON', num: 14, full: 'Mon 14 Sept' },
    { day: 'TUE', num: 15, full: 'Tue 15 Sept' },
    { day: 'WED', num: 16, full: 'Wed 16 Sept' },
    { day: 'THU', num: 17, full: 'Thu 17 Sept' },
    { day: 'FRI', num: 18, full: 'Fri 18 Sept' },
    { day: 'SAT', num: 19, full: 'Sat 19 Sept' },
    { day: 'SUN', num: 20, full: 'Sun 20 Sept' },
  ];

  const currentSelectedDay = daysList[selectedDayOffset] || daysList[3];

  // Camera preview in Green Room
  useEffect(() => {
    let stream: MediaStream | null = null;
    const startPreview = async () => {
      try {
        if (navigator?.mediaDevices?.getUserMedia && isCamOn) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          mediaStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.warn('Camera/Mic preview unavailable:', err);
      }
    };

    if (activeTab === 'greenroom' && isCamOn) {
      startPreview();
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getVideoTracks().forEach((track) => track.stop());
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [activeTab, isCamOn]);

  // Mic level simulator
  useEffect(() => {
    if (!isMicOn) {
      setMicLevel(0);
      return;
    }
    const interval = setInterval(() => {
      setMicLevel(Math.floor(20 + Math.random() * 60));
    }, 200);
    return () => clearInterval(interval);
  }, [isMicOn]);

  // Handle Instant Meeting
  const handleStartInstantMeeting = () => {
    const randomCode = `zen-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`;
    router.push(`/call/${randomCode}?mode=${selectedMode}&mic=${isMicOn}&cam=${isCamOn}&bg=${selectedBg}`);
  };

  // Handle Create Meeting for Later
  const handleCreateMeetingForLater = () => {
    const randomCode = `zen-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`;
    setCreatedRoomCode(randomCode);
    setIsNewMenuOpen(false);
    setShowCreatedModal(true);
  };

  // Handle Join with code or full link
  const handleJoinCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    const cleanCode = joinCode.trim().replace(/^https?:\/\/[^\/]+\/call\//, '');
    router.push(`/call/${cleanCode}?mode=${selectedMode}&mic=${isMicOn}&cam=${isCamOn}&bg=${selectedBg}`);
  };

  // Handle Schedule Meeting
  const handleSaveScheduledMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeetingTitle.trim()) return;

    const randomCode = `zen-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`;
    const newMeeting: ScheduledMeeting = {
      id: `mtg-${Date.now()}`,
      title: newMeetingTitle.trim(),
      time: newMeetingTime,
      dateKey: currentSelectedDay.full,
      mode: newMeetingMode,
      code: randomCode,
    };

    setScheduledMeetings((prev) => [...prev, newMeeting]);
    setNewMeetingTitle('');
    setShowScheduleModal(false);
  };

  const currentMeetingsForDay = scheduledMeetings.filter(
    (m) => m.dateKey === currentSelectedDay.full
  );

  const handleCopyCreatedLink = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/call/${createdRoomCode}` : `https://zenvitra.xyz/call/${createdRoomCode}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Request Notification permission
  const handleRequestNotification = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        await Notification.requestPermission();
      } catch (err) {
        console.warn('Notification permission error:', err);
      }
    }
    setShowNotificationToast(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafd] dark:bg-[#07090e] text-slate-900 dark:text-white font-sans flex flex-col selection:bg-blue-500/20 transition-colors duration-200">
      
      {/* ── TOP HEADER (Google Meet Parity) ── */}
      <header className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-slate-200 dark:border-white/10 bg-white dark:bg-black/60 backdrop-blur-xl sticky top-0 z-30">
        
        {/* Left: Official ZEN.CALL Brand */}
        <div className="flex items-center gap-3">
          <Link href="/pulse" className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 transition">
              <img src="/assets/logo.png" alt="Zenvitra" className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white font-display">
                ZEN<span className="text-cyan-400">.CALL</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                ENCRYPTED
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Action Pill (Enter code or link + Join + + New) */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Join Code Input Pill */}
          <form onSubmit={handleJoinCall} className="flex items-center bg-[#edf2fa] dark:bg-white/5 hover:bg-[#e4ebf7] dark:hover:bg-white/10 border border-transparent focus-within:border-blue-500 rounded-full px-3.5 py-1.5 transition-all shadow-xs">
            <Keyboard className="w-4 h-4 text-slate-500 dark:text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Enter a code or link"
              className="bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 outline-none w-44 lg:w-56 font-sans"
            />
            <button
              type="submit"
              disabled={!joinCode.trim()}
              className={`text-xs font-semibold px-3 py-1 rounded-full transition-all cursor-pointer ${
                joinCode.trim() 
                  ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700' 
                  : 'text-slate-400 dark:text-slate-600 pointer-events-none'
              }`}
            >
              Join
            </button>
          </form>

          {/* "+ New" Meeting Button with Dropdown (Pastel Emerald Pill from Screenshot) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#c4eed0] hover:bg-[#b2e5c1] text-[#072711] font-medium text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
              title="Start or schedule a new meeting"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <Video className="w-4 h-4" />
              <span>New</span>
            </button>

            {/* New Meeting Dropdown */}
            {isNewMenuOpen && (
              <div className="absolute right-0 top-12 w-64 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/15 rounded-2xl p-1.5 shadow-2xl z-50 animate-fade-in space-y-1">
                <button
                  type="button"
                  onClick={handleStartInstantMeeting}
                  className="w-full p-2.5 rounded-xl flex items-center gap-3 text-left hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 text-xs transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Start an instant meeting</div>
                    <div className="text-[11px] text-slate-500">Jump straight into a live room</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleCreateMeetingForLater}
                  className="w-full p-2.5 rounded-xl flex items-center gap-3 text-left hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 text-xs transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Create a meeting for later</div>
                    <div className="text-[11px] text-slate-500">Get an invite link you can share</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsNewMenuOpen(false);
                    setShowScheduleModal(true);
                  }}
                  className="w-full p-2.5 rounded-xl flex items-center gap-3 text-left hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 text-xs transition-colors cursor-pointer"
                >
                  <CalendarIcon className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Schedule in calendar</div>
                    <div className="text-[11px] text-slate-500">Add to your meeting schedule</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Help, Settings, Upgrade, App Launcher, Profile Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Help Button */}
          <button
            type="button"
            onClick={() => setShowHelpModal(true)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Help & Shortcuts"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Settings Button */}
          <button
            type="button"
            onClick={() => setShowSettingsModal(true)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Settings & Audio/Video Check"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Upgrade Pill Button (Styled from Screenshot) */}
          <button
            type="button"
            onClick={() => router.push('/pricing')}
            className="hidden sm:flex items-center px-4 py-1.5 rounded-full bg-[#d3e3fd] hover:bg-[#c2d7fc] text-[#041e49] font-medium text-xs transition-colors cursor-pointer"
          >
            Upgrade
          </button>

          {/* 3x3 Apps Grid */}
          <button
            type="button"
            onClick={() => router.push('/platform')}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Zenvitra Apps"
          >
            <div className="w-4 h-4 grid grid-cols-3 gap-0.5">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-xs bg-slate-600 dark:bg-slate-300" />
              ))}
            </div>
          </button>

          {/* Profile Circle with 'Y' (Deep Wine/Purple Circle from Screenshot) */}
          <div 
            onClick={() => router.push('/profile')}
            className="w-8 h-8 rounded-full bg-[#702459] text-white font-medium text-xs flex items-center justify-center cursor-pointer shadow-sm hover:ring-2 hover:ring-offset-2 hover:ring-purple-400 transition-all"
            title="Yuveer (Founder)"
          >
            Y
          </div>
        </div>
      </header>

      {/* ── BODY CONTAINER: Left Rail + Main Canvas ── */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ── LEFT NAVIGATION RAIL (Google Meet Screenshot Parity) ── */}
        <aside className="w-20 sm:w-24 border-r border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 flex flex-col items-center py-6 gap-6 shrink-0">
          {/* Meetings Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('meetings')}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className={`p-2.5 rounded-full transition-all ${
              activeTab === 'meetings' 
                ? 'bg-[#c2e7ff] dark:bg-blue-900/60 text-[#001d35] dark:text-blue-200 shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 group-hover:bg-slate-100 dark:group-hover:bg-white/10'
            }`}>
              <CalendarIcon className="w-5 h-5" />
            </div>
            <span className={`text-[11px] font-medium ${
              activeTab === 'meetings' 
                ? 'text-[#001d35] dark:text-blue-200 font-semibold' 
                : 'text-slate-600 dark:text-slate-400'
            }`}>
              Meetings
            </span>
          </button>

          {/* Calls Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('calls')}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className={`p-2.5 rounded-full transition-all ${
              activeTab === 'calls' 
                ? 'bg-[#c2e7ff] dark:bg-blue-900/60 text-[#001d35] dark:text-blue-200 shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 group-hover:bg-slate-100 dark:group-hover:bg-white/10'
            }`}>
              <PhoneCall className="w-5 h-5" />
            </div>
            <span className={`text-[11px] font-medium ${
              activeTab === 'calls' 
                ? 'text-[#001d35] dark:text-blue-200 font-semibold' 
                : 'text-slate-600 dark:text-slate-400'
            }`}>
              Calls
            </span>
          </button>

          {/* Green Room / Camera Check Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('greenroom')}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className={`p-2.5 rounded-full transition-all ${
              activeTab === 'greenroom' 
                ? 'bg-[#c2e7ff] dark:bg-blue-900/60 text-[#001d35] dark:text-blue-200 shadow-xs' 
                : 'text-slate-600 dark:text-slate-400 group-hover:bg-slate-100 dark:group-hover:bg-white/10'
            }`}>
              <Sliders className="w-5 h-5" />
            </div>
            <span className={`text-[11px] font-medium ${
              activeTab === 'greenroom' 
                ? 'text-[#001d35] dark:text-blue-200 font-semibold' 
                : 'text-slate-600 dark:text-slate-400'
            }`}>
              Check
            </span>
          </button>
        </aside>

        {/* ── MAIN CONTENT AREA ── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col max-w-5xl mx-auto w-full relative">
          
          {/* TAB 1: MEETINGS VIEW (Exact Match to Screenshot) */}
          {activeTab === 'meetings' && (
            <div className="space-y-6 flex-1 flex flex-col">
              
              {/* Mobile Code / + New bar for small screens */}
              <div className="md:hidden flex flex-col gap-2.5 pb-2">
                <form onSubmit={handleJoinCall} className="flex gap-2">
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="Enter code or link"
                    className="flex-1 px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={!joinCode.trim()}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs disabled:opacity-30"
                  >
                    Join
                  </button>
                </form>
                <button
                  type="button"
                  onClick={handleStartInstantMeeting}
                  className="w-full py-2.5 rounded-xl bg-[#c4eed0] text-[#072711] font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Meeting</span>
                </button>
              </div>

              {/* 1. Date Navigation Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
                {/* Current Selected Date Label */}
                <div className="flex items-center gap-2 text-xl sm:text-2xl font-normal text-slate-800 dark:text-white">
                  <span>{currentSelectedDay.full}</span>
                  <CalendarIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </div>

                {/* 7 Days Strip */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDayOffset((prev) => Math.max(0, prev - 1))}
                    disabled={selectedDayOffset === 0}
                    className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-1 sm:gap-2">
                    {daysList.map((d, idx) => {
                      const isSelected = selectedDayOffset === idx;
                      return (
                        <button
                          key={d.day}
                          type="button"
                          onClick={() => setSelectedDayOffset(idx)}
                          className={`flex flex-col items-center justify-center w-10 h-14 sm:w-11 sm:h-16 rounded-full transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#c2e7ff] text-[#001d35] font-bold shadow-xs dark:bg-blue-600 dark:text-white'
                              : 'hover:bg-slate-200/60 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <span className="text-[10px] font-medium uppercase tracking-wider">{d.day}</span>
                          <span className={`text-sm sm:text-base ${isSelected ? 'font-bold' : 'font-normal'}`}>
                            {d.num}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedDayOffset((prev) => Math.min(daysList.length - 1, prev + 1))}
                    disabled={selectedDayOffset === daysList.length - 1}
                    className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 2. Security Notice Banner (Exact text and icon from screenshot) */}
              <div className="p-4 rounded-2xl bg-[#edf2fa] dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#d3e3fd] dark:bg-blue-900/60 flex items-center justify-center text-blue-700 dark:text-blue-300 shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                      Your meeting is safe
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      No one can join a meeting unless invited or admitted by the host
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSecurityModal(true)}
                  className="hidden sm:inline-flex px-4 py-1.5 rounded-full border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-white/60 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                >
                  Learn more
                </button>
              </div>

              {/* 3. Center Stage: Scheduled Meetings or Empty State (Exact Illustration & Text) */}
              <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
                {currentMeetingsForDay.length === 0 ? (
                  <div className="space-y-4 max-w-md mx-auto">
                    {/* Minimalist Illustration from Google Meet */}
                    <GoogleMeetIllustration />

                    <div className="space-y-1">
                      <h2 className="text-xl sm:text-2xl font-normal text-slate-900 dark:text-white">
                        No meetings scheduled for today
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
                        Schedule a meeting or enjoy the free time
                      </p>
                    </div>

                    {/* Green + New Pill Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setShowScheduleModal(true)}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#c4eed0] hover:bg-[#b2e5c1] text-[#072711] font-medium text-sm transition-all shadow-xs cursor-pointer"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        <span>New</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full max-w-xl space-y-3 text-left">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider font-mono">
                      Scheduled for {currentSelectedDay.full}
                    </h3>
                    {currentMeetingsForDay.map((mtg) => (
                      <div
                        key={mtg.id}
                        className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-xs hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{mtg.title}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {mtg.time} &bull; Room {mtg.code} &bull; {mtg.mode}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => router.push(`/call/${mtg.code}`)}
                            className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
                          >
                            Join
                          </button>
                          <button
                            type="button"
                            onClick={() => setScheduledMeetings(scheduledMeetings.filter((m) => m.id !== mtg.id))}
                            className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                            title="Delete meeting"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DIRECT CALLS & SPEED DIAL CHAMBERS */}
          {activeTab === 'calls' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Direct Calls &amp; Sovereign Chambers</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Speed-dial diplomacy rooms, bilateral lounges, and instant 1-click WhatsApp calls.
                </p>
              </div>

              {/* Custom Instant Chamber Launcher & Room Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                      <Video className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white font-display">Create Instant Chamber</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Start an encrypted bilateral or multilateral meeting instantly with room key generation.
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">SOVEREIGN CALL</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newRoomId = `zen-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`;
                        router.push(`/call/${newRoomId}?mode=CALL&mic=${isMicOn}&cam=${isCamOn}&bg=${selectedBg}`);
                      }}
                      className="px-5 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold font-mono transition-all shadow-md cursor-pointer"
                    >
                      Launch Room Now &rarr;
                    </button>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                      <Keyboard className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white font-display">Join Existing Chamber</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Enter a diplomatic room code or invitation URL to enter an ongoing session.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleJoinCall} className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. zen-482-911"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/10 text-xs font-mono text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="submit"
                      disabled={!joinCode.trim()}
                      className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold font-mono transition cursor-pointer"
                    >
                      Join
                    </button>
                  </form>
                </div>
              </div>

              {/* WhatsApp 1-Click Generator */}
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                    <WhatsAppIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Instant WhatsApp Meeting Link</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Share a direct encrypted call link to any WhatsApp chat</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const randomCode = `zen-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`;
                    const inviteUrl = typeof window !== 'undefined' ? `${window.location.origin}/call/${randomCode}` : `https://zenvitra.xyz/call/${randomCode}`;
                    const text = encodeURIComponent(`Join my live encrypted room on ZEN.CALL:\n${inviteUrl}`);
                    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                  }}
                  className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow-sm"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Share via WhatsApp</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: GREEN ROOM & DEVICE CHECK */}
          {activeTab === 'greenroom' && (
            <div className="space-y-6 max-w-2xl mx-auto w-full">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Camera &amp; Audio Check</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Preview your video stream, test smart background blur (preserves your face), or pick Geneva Palais des Nations.
                </p>
              </div>

              {/* Video Preview Box with Smart Face Preservation */}
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-white/15 shadow-xl flex items-center justify-center">
                {isCamOn ? (
                  selectedBg === 'blur' ? (
                    /* SMART BACKGROUND BLUR: Face remains crisp in center, surrounding environment is heavily blurred */
                    <div className="relative w-full h-full overflow-hidden bg-slate-950">
                      {/* Background Layer: heavily blurred surroundings */}
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 w-full h-full object-cover -scale-x-100 filter blur-2xl scale-110 opacity-80"
                      />
                      {/* Foreground Layer: crisp face and torso with feathered oval portrait aperture */}
                      <video
                        autoPlay
                        playsInline
                        muted
                        ref={(el) => {
                          if (el && videoRef.current && el.srcObject !== videoRef.current.srcObject) {
                            el.srcObject = videoRef.current.srcObject;
                          }
                        }}
                        className="absolute inset-0 w-full h-full object-cover -scale-x-100 z-10"
                        style={{
                          WebkitMaskImage: 'radial-gradient(ellipse 52% 72% at 50% 48%, black 60%, transparent 95%)',
                          maskImage: 'radial-gradient(ellipse 52% 72% at 50% 48%, black 60%, transparent 95%)',
                        }}
                      />
                    </div>
                  ) : selectedBg === 'geneva' || customBgImage ? (
                    /* GENEVA / CUSTOM VIRTUAL BACKGROUND: Photo in the background, face ahead in foreground */
                    <div className="relative w-full h-full overflow-hidden bg-black">
                      {/* Rear Layer: Geneva UN Assembly or custom uploaded photo */}
                      <img
                        src={customBgImage || '/assets/call/geneva-un.jpg'}
                        alt="Geneva Virtual Background"
                        className="absolute inset-0 w-full h-full object-cover filter brightness-95"
                      />
                      {/* Foreground Layer: User stream masked with soft portrait aperture ahead of the backdrop */}
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 w-full h-full object-cover -scale-x-100 z-10"
                        style={{
                          WebkitMaskImage: 'radial-gradient(ellipse 48% 68% at 50% 48%, black 65%, transparent 92%)',
                          maskImage: 'radial-gradient(ellipse 48% 68% at 50% 48%, black 65%, transparent 92%)',
                        }}
                      />
                    </div>
                  ) : (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover -scale-x-100"
                    />
                  )
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-500">
                    <VideoOff className="w-12 h-12" />
                    <span className="text-xs font-mono">Camera is turned off</span>
                  </div>
                )}

                {/* Bottom Video Controls */}
                <div className="absolute bottom-4 inset-x-4 flex items-center justify-between bg-black/70 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 z-20">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsMicOn(!isMicOn)}
                      className={`p-2.5 rounded-xl transition ${
                        isMicOn ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-rose-600 text-white'
                      }`}
                      title={isMicOn ? 'Mute' : 'Unmute'}
                    >
                      {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsCamOn(!isCamOn)}
                      className={`p-2.5 rounded-xl transition ${
                        isCamOn ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-rose-600 text-white'
                      }`}
                      title={isCamOn ? 'Turn Camera Off' : 'Turn Camera On'}
                    >
                      {isCamOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Mic VU meter */}
                  <div className="flex items-center gap-2 px-2">
                    <Volume2 className="w-4 h-4 text-slate-400" />
                    <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 transition-all duration-100"
                        style={{ width: `${isMicOn ? micLevel : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Shader Pills with Geneva and Custom Upload */}
              <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-mono text-slate-600 dark:text-slate-300">Virtual Background:</span>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  {(['none', 'blur', 'geneva', 'stage'] as const).map((bg) => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => {
                        setSelectedBg(bg);
                        if (bg !== 'geneva') setCustomBgImage(null);
                      }}
                      className={`px-3 py-1.5 rounded-xl capitalize transition cursor-pointer border ${
                        selectedBg === bg && !customBgImage
                          ? 'bg-blue-600 text-white border-blue-500 font-semibold shadow-sm'
                          : 'border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-white'
                      }`}
                    >
                      {bg === 'blur' ? 'Smart Blur (Face Safe)' : bg === 'geneva' ? 'Geneva Palais' : bg}
                    </button>
                  ))}

                  {/* Custom Background Upload */}
                  <label className="px-3 py-1.5 rounded-xl border border-dashed border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 cursor-pointer flex items-center gap-1.5">
                    <span>+ Custom Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (loadEvt) => {
                            if (loadEvt.target?.result) {
                              setCustomBgImage(loadEvt.target.result as string);
                              setSelectedBg('geneva');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartInstantMeeting}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch Meeting with These Devices</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ── DESKTOP NOTIFICATIONS PROMPT TOAST (Bottom Right from Screenshot) ── */}
      {showNotificationToast && (
        <div className="fixed bottom-6 right-6 z-40 max-w-sm rounded-3xl bg-[#edf2fa] dark:bg-slate-900 border border-blue-200/80 dark:border-blue-900/60 p-5 shadow-2xl backdrop-blur-xl animate-fade-in">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#d3e3fd] dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                Receive desktop notifications from ZEN.CALL
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                Allowing notifications lets ZEN.CALL alert you about incoming calls and diplomatic chamber updates that occur while you&apos;re in another tab
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setShowNotificationToast(false)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              Not now
            </button>
            <button
              type="button"
              onClick={handleRequestNotification}
              className="px-4 py-1.5 rounded-full bg-[#0b57d0] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Allow notifications
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL: CREATE MEETING FOR LATER ── */}
      {showCreatedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/15 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Here&apos;s the link to your meeting</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreatedModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Copy this link and send it to people you want to meet with. Be sure to save it so you can use it later, too.
            </p>

            <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <span className="flex-1 px-2 text-xs font-mono text-blue-600 dark:text-cyan-300 truncate">
                {typeof window !== 'undefined' ? `${window.location.origin}/call/${createdRoomCode}` : `https://zenvitra.xyz/call/${createdRoomCode}`}
              </span>
              <button
                type="button"
                onClick={handleCopyCreatedLink}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const inviteUrl = typeof window !== 'undefined' ? `${window.location.origin}/call/${createdRoomCode}` : `https://zenvitra.xyz/call/${createdRoomCode}`;
                  const text = encodeURIComponent(`Here is the link to our meeting on Zenvitra Meet:
${inviteUrl}`);
                  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>WhatsApp Invite</span>
              </button>

              <button
                type="button"
                onClick={() => router.push(`/call/${createdRoomCode}`)}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Join Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: SCHEDULE IN CALENDAR ── */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form onSubmit={handleSaveScheduledMeeting} className="w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/15 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Schedule Meeting</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Meeting Title</label>
                <input
                  type="text"
                  value={newMeetingTitle}
                  onChange={(e) => setNewMeetingTitle(e.target.value)}
                  placeholder="e.g. UNSC Working Session, Project Sprint"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Time</label>
                  <input
                    type="time"
                    value={newMeetingTime}
                    onChange={(e) => setNewMeetingTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Mode</label>
                  <select
                    value={newMeetingMode}
                    onChange={(e) => setNewMeetingMode(e.target.value as CallMode)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  >
                    <option value="GROUP">Group Meeting</option>
                    <option value="CALL">1:1 Call</option>
                    <option value="COMMITTEE">MUN Committee</option>
                    <option value="ROOM">Persistent Room</option>
                    <option value="EVENT">Keynote / Stage</option>
                  </select>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Meeting will be added to: <span className="font-semibold text-slate-700 dark:text-slate-300">{currentSelectedDay.full}</span>
              </p>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
              >
                Save Meeting
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── MODAL: SECURITY EXPLAINER ── */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/15 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Security &amp; Encryption</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSecurityModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white">Host Admission &amp; Knocking:</strong> Anyone who is not on the original invite list must knock to enter. The host has full veto and admission control.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white">End-to-End Encryption:</strong> Audio, video, and screen sharing streams are cryptographically locked using WebRTC DTLS-SRTP 256-bit encryption.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white">Zero Telemetry Profiling:</strong> No audio or video streams are stored or analyzed for advertising or surveillance.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSecurityModal(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL: HELP & SHORTCUTS ── */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/15 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Keyboard Shortcuts &amp; Help</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-white/5">
                <span className="text-slate-600 dark:text-slate-400">Toggle Mute / Unmute</span>
                <kbd className="px-2 py-0.5 rounded bg-white dark:bg-white/10 font-mono font-bold text-slate-800 dark:text-white border border-slate-300 dark:border-white/20">Ctrl + D</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-white/5">
                <span className="text-slate-600 dark:text-slate-400">Toggle Camera On / Off</span>
                <kbd className="px-2 py-0.5 rounded bg-white dark:bg-white/10 font-mono font-bold text-slate-800 dark:text-white border border-slate-300 dark:border-white/20">Ctrl + E</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-white/5">
                <span className="text-slate-600 dark:text-slate-400">Raise / Lower Hand</span>
                <kbd className="px-2 py-0.5 rounded bg-white dark:bg-white/10 font-mono font-bold text-slate-800 dark:text-white border border-slate-300 dark:border-white/20">Ctrl + H</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-white/5">
                <span className="text-slate-600 dark:text-slate-400">Share Screen</span>
                <kbd className="px-2 py-0.5 rounded bg-white dark:bg-white/10 font-mono font-bold text-slate-800 dark:text-white border border-slate-300 dark:border-white/20">Ctrl + S</kbd>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL: SETTINGS ── */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/15 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Call Settings</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Microphone</label>
                <select className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white outline-none">
                  <option>Default - System Internal Microphone</option>
                  <option>Communications - High Definition Audio</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Speakers / Audio Output</label>
                <select className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white outline-none">
                  <option>Default - System Internal Speakers</option>
                  <option>Headphones - High Definition Audio</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Camera</label>
                <select className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white outline-none">
                  <option>Integrated Webcam (720p HD)</option>
                  <option>External USB Camera (1080p Full HD)</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
