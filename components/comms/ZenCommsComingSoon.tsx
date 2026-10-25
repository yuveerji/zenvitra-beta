'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  Video, 
  PhoneCall, 
  Users, 
  Layers, 
  Radio, 
  Bell, 
  Compass, 
  ExternalLink,
  MessageSquare,
  Building2,
  Calendar,
  Gavel,
  Shield,
  Zap,
  Check
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export type CommsAppType = 'call' | 'meet' | 'chamber' | 'chits';

interface CommsAppConfig {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  icon: any;
  capabilities: { title: string; desc: string; icon: any }[];
  phases: { phase: string; title: string; status: 'completed' | 'active' | 'upcoming'; date: string }[];
}

const COMMS_CONFIGS: Record<CommsAppType, CommsAppConfig> = {
  call: {
    id: 'zen-call',
    name: 'ZEN.CALL',
    shortName: 'Diplomatic AV',
    tagline: 'High-Fidelity Plenary Audio, Dais Broadcasts & Virtual Chambers',
    description:
      'ZEN.CALL is ZENVITRA’s next-generation peer-to-peer encrypted AV engine. Designed specifically for parliamentary debate, multilateral caucuses, and high-fidelity plenary sessions with zero algorithmic degradation and zero telemetry harvesting.',
    icon: PhoneCall,
    capabilities: [
      {
        title: 'Executive Dais Floor Control',
        desc: 'Dynamic floor microphone privileges, formal speaking timers, and chair mute authority.',
        icon: Gavel,
      },
      {
        title: 'Spatial 48kHz Opus Audio',
        desc: 'Studio-grade acoustic encoding engineered for crystal-clear debate and speech clarity.',
        icon: Zap,
      },
      {
        title: 'Low-Latency 1080p Sharing',
        desc: 'Real-time clause and resolution projection with live interactive pointer telemetry.',
        icon: Video,
      },
      {
        title: 'Cryptographic Channel Security',
        desc: 'Direct WebRTC encrypted peer channels with cryptographic identity handshake.',
        icon: ShieldCheck,
      },
    ],
    phases: [
      { phase: 'Phase 01', title: 'Cryptographic AV Handshake & Mesh Spec', status: 'completed', date: 'Q3 2026' },
      { phase: 'Phase 02', title: 'Executive Dais Floor Privilege Engine', status: 'active', date: 'In Development' },
      { phase: 'Phase 03', title: 'Plenary Stress Testing & WebRTC Relays', status: 'upcoming', date: 'Q4 2026' },
      { phase: 'Phase 04', title: 'Global Public Deployment', status: 'upcoming', date: 'Q1 2027' },
    ],
  },
  meet: {
    id: 'zen-meet',
    name: 'ZEN.MEET',
    shortName: 'Meeting Architecture',
    tagline: 'Virtual Committee Meeting Architecture & Dais Waiting Rooms',
    description:
      'ZEN.MEET powers virtual committee assemblies, dais waiting room gatekeepers, agenda synchronizers, and decentralized unmoderated caucus breakout rooms across institutions worldwide.',
    icon: Video,
    capabilities: [
      {
        title: 'Instant Chamber Generation',
        desc: 'Ephemeral or persistent committee room links with passcode protection and attendee triage.',
        icon: Calendar,
      },
      {
        title: 'Dais Moderated Waiting Room',
        desc: 'Executive screening gatekeeper to admit delegates, advisers, and accredited observers.',
        icon: Lock,
      },
      {
        title: 'Parliamentary Agenda Sync',
        desc: 'Real-time synchronization of session order of the day and GSL speaker list timers.',
        icon: Clock,
      },
      {
        title: 'Decentralized Caucus Huddles',
        desc: 'Instant breakout rooms for multilateral resolution sponsors and bloc drafting.',
        icon: Users,
      },
    ],
    phases: [
      { phase: 'Phase 01', title: 'Room Architecture & Link Telemetry', status: 'completed', date: 'Q3 2026' },
      { phase: 'Phase 02', title: 'Waiting Room Gatekeeper & Agenda Sync', status: 'active', date: 'In Development' },
      { phase: 'Phase 03', title: 'Breakout Huddle Mesh & Dais Controls', status: 'upcoming', date: 'Q4 2026' },
      { phase: 'Phase 04', title: 'Full Production Deployment', status: 'upcoming', date: 'Q1 2027' },
    ],
  },
  chamber: {
    id: 'zen-chamber',
    name: 'ZEN.CHAMBER',
    shortName: 'Virtual Plenary Hall',
    tagline: 'Decentralized Parliamentary Chamber Simulations & Electronic Voting',
    description:
      'ZEN.CHAMBER bridges physical and virtual assemblies with electronic placard raising, formal roll-call voting ledger, and live speaker queue visualization for Model UN and youth parliaments.',
    icon: Building2,
    capabilities: [
      {
        title: 'Electronic Placard System',
        desc: 'Instant placard raising for procedural and substantive motions with quorum validation.',
        icon: Gavel,
      },
      {
        title: 'Roll-Call Voting Ledger',
        desc: 'Cryptographically recorded delegate votes with formal pass and abstain rules.',
        icon: ShieldCheck,
      },
      {
        title: 'General Speakers List (GSL)',
        desc: 'Automated speaker queue timers with yields to the Executive Board or another delegate.',
        icon: Clock,
      },
      {
        title: 'Chamber Floor Audio Relay',
        desc: 'Dedicated low-latency floor feed connecting dais officers directly with seated delegates.',
        icon: Radio,
      },
    ],
    phases: [
      { phase: 'Phase 01', title: 'Placard Mechanics & Quorum Math Engine', status: 'completed', date: 'Q3 2026' },
      { phase: 'Phase 02', title: 'Electronic Roll-Call & Dais Tally Console', status: 'active', date: 'In Development' },
      { phase: 'Phase 03', title: 'Multi-Chamber Assembly Integration', status: 'upcoming', date: 'Q4 2026' },
      { phase: 'Phase 04', title: 'Sovereign Chamber Release', status: 'upcoming', date: 'Q1 2027' },
    ],
  },
  chits: {
    id: 'zen-chits',
    name: 'ZEN.CHITS',
    shortName: 'Digital Session Notes',
    tagline: 'Confidential Dais Floor Notes & Bilateral Caucus Transmission',
    description:
      'ZEN.CHITS digitizes traditional diplomatic paper floor chits passed between delegations and the Executive Board during formal proceedings, complete with EB triage, confidential routing, and archival logs.',
    icon: MessageSquare,
    capabilities: [
      {
        title: 'Bilateral Delegation Passing',
        desc: 'Send private, discrete caucus messages between delegations without breaking assembly decorum.',
        icon: Users,
      },
      {
        title: 'Executive Board Inquiries',
        desc: 'Direct procedural points, points of inquiry, and personal privilege notes to the dais.',
        icon: Gavel,
      },
      {
        title: 'EB Moderation & Triage',
        desc: 'Executive Board console to review, approve, forward, or reply to floor chits instantly.',
        icon: Shield,
      },
      {
        title: 'Archival Session Log',
        desc: 'Encrypted audit trail of all formal communications for post-conference delegate evaluation.',
        icon: Lock,
      },
    ],
    phases: [
      { phase: 'Phase 01', title: 'Bilateral Routing & Chit Encryption', status: 'completed', date: 'Q3 2026' },
      { phase: 'Phase 02', title: 'Executive Board Triage Dashboard', status: 'active', date: 'In Development' },
      { phase: 'Phase 03', title: 'Committee Session Sync & Anti-Spam', status: 'upcoming', date: 'Q4 2026' },
      { phase: 'Phase 04', title: 'Live Conference Rollout', status: 'upcoming', date: 'Q1 2027' },
    ],
  },
};

interface ZenCommsComingSoonProps {
  appType: CommsAppType;
}

export function ZenCommsComingSoon({ appType }: ZenCommsComingSoonProps) {
  const config = COMMS_CONFIGS[appType] || COMMS_CONFIGS.call;
  const IconComponent = config.icon;

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`zen_comms_sub_${config.id}`);
      if (saved) setSubscribed(true);
    } catch {}
  }, [config.id]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      localStorage.setItem(`zen_comms_sub_${config.id}`, email.trim());
    } catch {}
    setSubscribed(true);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-[#030611] text-white selection:bg-blue-600/30 selection:text-white flex flex-col relative overflow-hidden font-sans">
      {/* Background Cyber Radial Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[850px] h-[500px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-20 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_0.75px,transparent_0.75px)] [background-size:32px_32px] opacity-25 pointer-events-none" />

      {/* Main Standard Header / Navbar */}
      <Navbar />

      {/* HERO & COMING SOON REVEAL */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10 w-full flex flex-col items-center text-center">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <Link
            href="/apps"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-blue-400" />
            <span>Circular Ecosystem Map</span>
          </Link>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Comms Cluster &bull; In Active Development
          </span>
        </div>

        {/* Large App Branding */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-blue-500/15 border border-blue-500/40 text-blue-400 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(59,130,246,0.3)]">
          <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-blue-300" />
        </div>

        <h1 
          className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white mb-4 uppercase"
          style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
        >
          {config.name}
        </h1>

        <p 
          className="font-serif italic text-lg sm:text-2xl text-blue-200/90 max-w-3xl mb-6 leading-relaxed font-normal"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {config.tagline}
        </p>

        <p className="text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed mb-10 font-sans">
          {config.description}
        </p>

        {/* Priority Access / Notification Waitlist Box */}
        <div className="w-full max-w-md p-6 rounded-3xl bg-[#080d1e]/90 border border-blue-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(59,130,246,0.15)] backdrop-blur-2xl mb-16 text-left">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-4 h-4 text-blue-400 shrink-0" />
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Get Early Dispatch Notification
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mb-4">
            Be the first to test {config.name} when public sandbox trials open. Zero spam, pure diplomatic engineering updates.
          </p>

          {subscribed ? (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-emerald-300 text-xs font-mono">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>You are registered for {config.name} early access updates!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your diplomatic email..."
                  required
                  className="flex-1 bg-white/[0.04] border border-white/15 focus:border-blue-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-black font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-md shrink-0"
                >
                  <span>Notify Me</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[10px] text-neutral-500 font-mono block">
                Saved privately to your sovereign local ledger. No external marketing tracking.
              </span>
            </form>
          )}
        </div>

        {/* 4 Architectural Capabilities */}
        <div className="w-full mb-16">
          <div className="flex items-center justify-between gap-4 mb-6 text-left">
            <div>
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">
                SYSTEM ARCHITECTURE &bull; LEVEL 2
              </span>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
                Engineered for High-Stakes Assemblies
              </h2>
            </div>
            <span className="text-xs font-mono text-neutral-500 hidden sm:inline">
              4 Core Protocols
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {config.capabilities.map((cap, i) => {
              const CapIcon = cap.icon;
              return (
                <div
                  key={i}
                  className="p-5 sm:p-6 rounded-3xl bg-[#080d1e]/60 border border-white/10 hover:border-blue-500/40 transition duration-300 group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <CapIcon className="w-5 h-5 text-blue-300" />
                  </div>
                  <h4 className="font-display font-bold text-base text-white mb-1.5">
                    {cap.title}
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    {cap.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Development Timeline Roadmap */}
        <div className="w-full mb-16 text-left">
          <div className="mb-6">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">
              DEVELOPMENT ROADMAP
            </span>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
              Phased Rollout Milestones
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {config.phases.map((ph, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition ${
                  ph.status === 'active'
                    ? 'bg-blue-500/10 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                    : ph.status === 'completed'
                    ? 'bg-white/[0.02] border-white/10'
                    : 'bg-white/[0.01] border-white/5 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">
                    {ph.phase}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                      ph.status === 'active'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-bold'
                        : ph.status === 'completed'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-white/5 text-neutral-400 border-white/10'
                    }`}
                  >
                    {ph.status === 'active' ? 'IN PROGRESS' : ph.status === 'completed' ? 'DONE' : 'PLANNED'}
                  </span>
                </div>
                <h5 className="font-display font-bold text-xs text-white mb-1">
                  {ph.title}
                </h5>
                <span className="text-[10px] font-mono text-neutral-500">
                  {ph.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Ecosystem Cross-Links (Highlighting Notifications is Live) */}
        <div className="w-full p-6 sm:p-8 rounded-3xl bg-[#060a17]/95 border border-white/10 text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ACTIVE PLATFORM EXPERIENCES
              </span>
              <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                Explore Available ZENVITRA Applications
              </h3>
            </div>
            <Link
              href="/apps"
              className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View All 50+ Apps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. ZEN.NOTIFICATIONS (COMMUNICATION CLUSTER - LIVE) */}
            <Link
              href="/your_activity"
              className="p-4 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 transition group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    LIVE NOW
                  </span>
                </div>
                <h4 className="font-display font-bold text-sm text-white group-hover:text-blue-300 transition">
                  ZEN.NOTIFICATIONS
                </h4>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Real-time dispatch engine, alerts & category updates.
                </p>
              </div>
              <div className="mt-3 flex items-center text-xs font-mono font-bold text-blue-400 gap-1">
                <span>Open Alerts</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 2. ZEN.PULSE (SOCIAL & COMMUNITY - LIVE) */}
            <Link
              href="/pulse"
              className="p-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                    <Radio className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    LIVE NOW
                  </span>
                </div>
                <h4 className="font-display font-bold text-sm text-white group-hover:text-emerald-300 transition">
                  ZEN.PULSE
                </h4>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Youth diplomatic commons, threaded debate & story composer.
                </p>
              </div>
              <div className="mt-3 flex items-center text-xs font-mono font-bold text-emerald-400 gap-1">
                <span>Enter Commons</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 3. ZEN.PASSPORT (IDENTITY - LIVE) */}
            <Link
              href="/passport"
              className="p-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    LIVE NOW
                  </span>
                </div>
                <h4 className="font-display font-bold text-sm text-white group-hover:text-amber-300 transition">
                  ZEN.PASSPORT
                </h4>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Permanent sovereign delegate credential & tier verification.
                </p>
              </div>
              <div className="mt-3 flex items-center text-xs font-mono font-bold text-amber-400 gap-1">
                <span>View Passport</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 4. ZEN.MUN (MUN & EVENTS - LIVE) */}
            <Link
              href="/mun"
              className="p-4 rounded-2xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 transition group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    LIVE NOW
                  </span>
                </div>
                <h4 className="font-display font-bold text-sm text-white group-hover:text-pink-300 transition">
                  ZEN.MUN
                </h4>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Parliamentary committee console, matrix & dais timers.
                </p>
              </div>
              <div className="mt-3 flex items-center text-xs font-mono font-bold text-pink-400 gap-1">
                <span>Open MUN Console</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* Main Standard Footer */}
      <Footer />
    </div>
  );
}
