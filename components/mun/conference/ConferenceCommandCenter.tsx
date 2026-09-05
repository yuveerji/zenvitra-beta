'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Radio,
  Users,
  Grid,
  Calendar,
  Building,
  CreditCard,
  MessageSquare,
  FileText,
  Scale,
  Newspaper,
  Award,
  Sparkles,
  Settings,
  Archive,
  ChevronDown,
  AlertTriangle,
  Send,
  QrCode,
  Layers,
  Search,
  CheckCircle2,
  Lock,
  ExternalLink,
  Crown,
  ArrowRight
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ConferenceLiveboard } from './ConferenceLiveboard';
import { 
  ZENMUN_2026_MASTER, 
  checkRevenueAccess, 
  LS_REVENUE_PERMISSIONS 
} from '@/lib/conferenceData';
import { useAuth } from '@/context/AuthContext';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';

type NavTab = 
  | 'OVERVIEW' 
  | 'COMMAND_CENTER' 
  | 'MATRIX' 
  | 'COMMITTEES' 
  | 'REGISTRATIONS' 
  | 'DOCUMENTS' 
  | 'PAYMENTS' 
  | 'AWARDS';

export function ConferenceCommandCenter() {
  const { user, profile, isAuthenticated, isLoading, continueAsGuest } = useAuth();
  const { currentUserUsername } = useZenPulse();

  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [localHasSession, setLocalHasSession] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('zenvitra_session_user') || 
                     localStorage.getItem('zenvitra_user_session') || 
                     localStorage.getItem('zenvitra_session');
      setLocalHasSession(Boolean(stored));
    } catch (_) {}
    setHasCheckedAuth(true);
  }, []);

  const hasSession = Boolean(isAuthenticated || user || profile || localHasSession);

  const [activeTab, setActiveTab] = useState<NavTab>('COMMAND_CENTER');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [emergencyMessage, setEmergencyMessage] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Revenue Viewer Access (Creator + Payments Team + Chosen by Creator)
  const [delegatedViewers, setDelegatedViewers] = useState<string[]>(() => {
    if (typeof window === 'undefined') return ZENMUN_2026_MASTER.authorizedRevenueViewers || [];
    try {
      const stored = localStorage.getItem(`${LS_REVENUE_PERMISSIONS}_${ZENMUN_2026_MASTER.id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return ZENMUN_2026_MASTER.authorizedRevenueViewers || [];
  });

  const [newViewerInput, setNewViewerInput] = useState('');

  const activeUser = {
    username: currentUserUsername || profile?.username || user?.user_metadata?.username,
    email: user?.email || profile?.email,
    role: profile?.role,
  };

  const revenueAccess = checkRevenueAccess(activeUser, {
    ...ZENMUN_2026_MASTER,
    authorizedRevenueViewers: delegatedViewers,
  });

  const handleGrantAccess = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newViewerInput.trim().replace(/^@/, '');
    if (!clean) return;
    if (delegatedViewers.some((v) => v.toLowerCase() === clean.toLowerCase())) {
      showToast(`@${clean} already has revenue access`);
      return;
    }
    const next = [...delegatedViewers, clean];
    setDelegatedViewers(next);
    try {
      localStorage.setItem(`${LS_REVENUE_PERMISSIONS}_${ZENMUN_2026_MASTER.id}`, JSON.stringify(next));
    } catch (_) {}
    setNewViewerInput('');
    showToast(`Granted revenue access to @${clean}`);
  };

  const handleRevokeAccess = (usernameToRevoke: string) => {
    const next = delegatedViewers.filter((v) => v.toLowerCase() !== usernameToRevoke.toLowerCase());
    setDelegatedViewers(next);
    try {
      localStorage.setItem(`${LS_REVENUE_PERMISSIONS}_${ZENMUN_2026_MASTER.id}`, JSON.stringify(next));
    } catch (_) {}
    showToast(`Revoked revenue access for @${usernameToRevoke}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendEmergency = () => {
    if (!emergencyMessage.trim()) return;
    setIsEmergencyModalOpen(false);
    setEmergencyMessage('');
    showToast('🚨 Emergency announcement broadcast to all 486 delegates & EB staff');
  };

  // Secretariat Security Wall: /mun/conference strictly requires an active login session
  if (!isLoading && hasCheckedAuth && !hasSession) {
    return (
      <div className="min-h-screen bg-[#030407] text-white flex flex-col justify-between selection:bg-amber-500/30">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4 sm:p-8 pt-28 sm:pt-32 relative overflow-hidden">
          {/* Ambient Lighting */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/[0.04] blur-[140px] rounded-full pointer-events-none" />

          <div className="w-full max-w-lg rounded-3xl bg-[#090a10] border border-amber-500/30 p-8 sm:p-10 shadow-[0_25px_80px_rgba(245,158,11,0.12)] text-center space-y-6 relative z-10">
            {/* Top Shield Icon */}
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.2)]">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>

            {/* Badge & Title */}
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold tracking-widest uppercase inline-block">
                Secretariat Clearance Required
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
                Conference OS Access
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm mx-auto">
                The <strong>Secretariat Command Center &amp; Liveboard</strong> requires an authenticated session for delegate rolls, committee telemetry, and revenue auditing.
              </p>
            </div>

            {/* Info Notice: /mun is open */}
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 text-left flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-neutral-300 leading-relaxed font-sans">
                <span className="font-bold text-white">Looking for conferences?</span>
                <p className="text-neutral-400 text-[11px] mt-0.5">
                  The public Model UN portal at <Link href="/mun" className="text-cyan-400 hover:underline font-mono">/mun</Link> does <strong>not</strong> require login.
                </p>
              </div>
            </div>

            {/* Actions Stack */}
            <div className="space-y-3 pt-2">
              <Link
                href="/login?redirect=/mun/conference"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-display font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.3)] cursor-pointer"
              >
                <Lock className="w-4 h-4 text-black" />
                <span>Sign In to Secretariat</span>
              </Link>

              <button
                type="button"
                onClick={async () => {
                  await continueAsGuest('secretariat_guest', 'Secretariat Lead');
                  setLocalHasSession(true);
                }}
                className="w-full py-3 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>One-Click Guest Secretariat Pass</span>
              </button>

              <Link
                href="/mun"
                className="text-xs font-mono text-neutral-400 hover:text-white transition flex items-center justify-center gap-1.5 pt-2"
              >
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                <span>Return to Public ZEN.MUN Discovery</span>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030407] text-neutral-300 flex flex-col justify-between font-sans selection:bg-cyan-500/30 pt-20 sm:pt-24">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6 text-left">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-24 right-6 z-50 px-4 py-2 rounded-2xl bg-cyan-500 text-black font-mono text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Conference Command Header */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0d101a] via-black to-black border border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                CONFERENCE LIVE IN PROGRESS
              </span>
              <span className="text-xs text-neutral-400 font-mono">Jaipur International Centre</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
              ZENMUN 2026 &bull; SECRETARIAT COMMAND SUITE
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEmergencyModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>🚨 Broadcast Alert</span>
            </button>

            {revenueAccess.allowed ? (
              <Link
                href="/payments"
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-mono text-xs font-bold transition flex items-center gap-2"
                title={`Confidential Revenue (${revenueAccess.description})`}
              >
                <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                <span>₹2.43L Revenue</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-normal">
                  {revenueAccess.role === 'CREATOR' ? 'Creator' : revenueAccess.role === 'PAYMENTS_TEAM' ? 'Finance' : 'Authorized'}
                </span>
              </Link>
            ) : (
              <div
                className="px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-neutral-500 font-mono text-xs flex items-center gap-1.5 select-none"
                title="Revenue telemetry is restricted to MUN Creator, Payments Team & delegates chosen by Creator"
              >
                <Lock className="w-3.5 h-3.5 text-neutral-500" />
                <span>Revenue Confidential</span>
              </div>
            )}
          </div>
        </div>

        {/* Master Navigation & Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Navigation Sidebar */}
          <div className="lg:col-span-3 p-4 rounded-3xl bg-black/50 border border-white/10 space-y-4 font-mono text-xs">
            <div className="space-y-1">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-bold px-3">
                LIVE OPERATIONS
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('COMMAND_CENTER')}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-between ${
                  activeTab === 'COMMAND_CENTER'
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>⚡ Live Intelligence Board</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('OVERVIEW')}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition cursor-pointer ${
                  activeTab === 'OVERVIEW'
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                🏠 Conference Overview
              </button>
            </div>

            <div className="space-y-1 pt-2 border-t border-white/5">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-bold px-3">
                SECRETARIAT TOOLS
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('MATRIX')}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition cursor-pointer ${
                  activeTab === 'MATRIX'
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                🧮 Delegate Matrix
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('COMMITTEES')}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition cursor-pointer ${
                  activeTab === 'COMMITTEES'
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                🏛️ All 5 Committee Rooms
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('REGISTRATIONS')}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition cursor-pointer ${
                  activeTab === 'REGISTRATIONS'
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                👥 Registrations (842)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('DOCUMENTS')}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition cursor-pointer ${
                  activeTab === 'DOCUMENTS'
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                📑 Resolutions &amp; Bills
              </button>
            </div>

            <div className="space-y-1 pt-2 border-t border-white/5">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-bold px-3">
                FINANCE &amp; OUTCOMES
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('PAYMENTS')}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-between ${
                  activeTab === 'PAYMENTS'
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>💳 Ticket Revenue</span>
                {!revenueAccess.allowed && <Lock className="w-3 h-3 text-neutral-500 shrink-0" />}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('AWARDS')}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition cursor-pointer ${
                  activeTab === 'AWARDS'
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                🏆 Awards &amp; Certificates
              </button>
            </div>
          </div>

          {/* Main Display Area */}
          <div className="lg:col-span-9">
            {activeTab === 'COMMAND_CENTER' && <ConferenceLiveboard />}

            {activeTab === 'OVERVIEW' && (
              <div className="p-8 rounded-3xl bg-black/50 border border-white/10 space-y-6">
                <h3 className="text-xl font-bold font-display text-white">Conference Health: 92% Readiness</h3>
                <p className="text-xs text-neutral-400 font-mono leading-relaxed">
                  All 5 committees are currently in active session across Plenary Hall A through D. 817 paid registrations verified, with automated QR code scanning operational at venue reception desks.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="text-neutral-500 text-[10px] block">COMMITTEES</span>
                    <strong className="text-white text-base">5 Chambers</strong>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="text-neutral-500 text-[10px] block">TOTAL DELEGATES</span>
                    <strong className="text-white text-base">486 Allotted</strong>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="text-neutral-500 text-[10px] block flex items-center gap-1">
                      <span>GROSS REVENUE</span>
                      {!revenueAccess.allowed && <Lock className="w-2.5 h-2.5 text-neutral-500" />}
                    </span>
                    <strong className={revenueAccess.allowed ? 'text-cyan-300 text-base' : 'text-neutral-500 text-base font-sans'}>
                      {revenueAccess.allowed ? '₹2,43,283' : '🔒 Confidential'}
                    </strong>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="text-neutral-500 text-[10px] block">CURRENT STATUS</span>
                    <strong className="text-emerald-400 text-base">Day 1 Ongoing</strong>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'MATRIX' && (
              <div className="p-8 rounded-3xl bg-black/50 border border-white/10 space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                    SOVEREIGN ALLOCATION PRINCIPLE
                  </span>
                  <h3 className="text-xl font-bold font-display text-white">Conference Head Matrix Allocation</h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    Country and portfolio assignments are determined <strong>strictly and manually by the Conference Head and Secretariat</strong>, never automated or overridden by ZENVITRA.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-500/[0.05] border border-purple-500/25 space-y-3 font-mono text-xs">
                  <span className="font-bold text-purple-300">Secretariat Matrix Controls:</span>
                  <ul className="list-disc pl-5 space-y-1 text-neutral-300 text-[11px]">
                    <li>UNSC: 15 / 15 Countries Allotted by Secretary-General</li>
                    <li>UNHRC: 28 / 30 Delegations Allotted by USG Academics</li>
                    <li>WHO: 24 / 28 Health Ministries Allotted</li>
                    <li>Lok Sabha: 38 / 40 Parliamentary Constituencies Assigned</li>
                  </ul>
                  <button
                    type="button"
                    onClick={() => showToast('Country Matrix locked & notified to delegates')}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition cursor-pointer"
                  >
                    Lock &amp; Notify Matrix
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'COMMITTEES' && (
              <div className="p-8 rounded-3xl bg-black/50 border border-white/10 space-y-6">
                <h3 className="text-xl font-bold font-display text-white">Active Committee Dais Links</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  {ZENMUN_2026_MASTER.committees.map((c) => (
                    <div key={c.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{c.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400">
                          {c.status}
                        </span>
                      </div>
                      <p className="text-neutral-400 text-xs font-mono">{c.room} &bull; {c.chairName}</p>
                      <Link
                        href={`/committee?chamber=${c.id}`}
                        className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-mono underline pt-1"
                      >
                        <span>Open Live Chamber Console</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'REGISTRATIONS' && (
              <div className="p-8 rounded-3xl bg-black/50 border border-white/10 space-y-4 font-mono text-xs">
                <h3 className="text-xl font-bold font-display text-white font-sans">Delegate Registrations (842 Total)</h3>
                <div className="p-4 rounded-2xl bg-black border border-white/10 space-y-2">
                  <div className="flex justify-between text-neutral-400">
                    <span>Approved &amp; Paid Passes:</span>
                    <strong className="text-white">817</strong>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Pending Payment Verification:</span>
                    <strong className="text-amber-400">25</strong>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Venue Check-Ins via QR:</span>
                    <strong className="text-emerald-400">451 / 486 (92.8%)</strong>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'DOCUMENTS' && (
              <div className="p-8 rounded-3xl bg-black/50 border border-white/10 space-y-4 font-sans">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-display text-white">Resolutions &amp; Legislative Bills</h3>
                  <Link
                    href="/docs"
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-mono text-xs font-bold hover:bg-cyan-400 transition"
                  >
                    Open Sovereign Document Studio
                  </Link>
                </div>
                <p className="text-xs text-neutral-400 font-mono">
                  52 total documents currently tabled across chambers, powered directly by <strong>ZEN.DOCS</strong>.
                </p>
              </div>
            )}

            {activeTab === 'PAYMENTS' && (
              <div className="p-8 rounded-3xl bg-black/50 border border-white/10 space-y-6 font-mono text-xs">
                {!revenueAccess.allowed ? (
                  <div className="py-12 px-6 text-center space-y-4 max-w-lg mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 mx-auto flex items-center justify-center text-neutral-400 shadow-inner">
                      <Lock className="w-8 h-8 text-neutral-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold font-display text-white font-sans">Confidential Financial Telemetry</h3>
                      <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                        Under ZENVITRA Sovereign Governance, MUN ticket sales and revenue ledgers can only be seen by the <strong>MUN Creator</strong>, the <strong>ZENVITRA Payments &amp; Finance Team</strong>, and <strong>individuals explicitly chosen by the Creator</strong>.
                      </p>
                    </div>
                    <div className="pt-2 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px]">
                      <span>Logged in as @{activeUser.username || 'guest'}</span>
                      <span className="text-rose-400 font-bold">• Access Denied</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold font-display text-white font-sans">Event Financial Telemetry</h3>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                            {revenueAccess.role === 'CREATOR' ? '👑 Creator Authority' : revenueAccess.role === 'PAYMENTS_TEAM' ? '💳 Payments Team' : '✅ Authorized by Creator'}
                          </span>
                        </div>
                        <p className="text-neutral-400 text-xs font-sans mt-0.5">
                          Confidential ticket sales, refunds &amp; settlement ledger for ZENMUN 2026.
                        </p>
                      </div>
                      <Link
                        href="/payments"
                        className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/15 transition text-xs flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open ZEN.PAYMENTS Hub</span>
                      </Link>
                    </div>

                    {/* Financial Metrics */}
                    <div className="p-5 rounded-2xl bg-black border border-white/10 space-y-3">
                      <div className="flex justify-between"><span>Gross Ticket Sales:</span><strong className="text-white">₹2,43,283</strong></div>
                      <div className="flex justify-between"><span>Refunds Processed:</span><strong className="text-amber-400">₹7,980</strong></div>
                      <div className="flex justify-between"><span>Platform Surcharge (0.5% + ₹19):</span><strong className="text-neutral-400">₹6,082</strong></div>
                      <div className="flex justify-between pt-2 border-t border-white/10 font-bold text-sm"><span>Net Payable to Organizer:</span><strong className="text-cyan-300">₹2,29,221</strong></div>
                    </div>

                    {/* Creator RBAC Access Manager (Visible to Creator & Payments Team) */}
                    {(revenueAccess.role === 'CREATOR' || revenueAccess.role === 'PAYMENTS_TEAM') && (
                      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4 font-sans">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <h4 className="font-bold text-sm text-white flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-cyan-400" />
                              <span>Revenue Viewer Access Control</span>
                            </h4>
                            <p className="text-xs text-neutral-400">
                              As the MUN Creator, you control exactly who can inspect your conference revenue.
                            </p>
                          </div>
                          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-bold">
                            {delegatedViewers.length} Delegated Viewers
                          </span>
                        </div>

                        {/* Grant Access Form */}
                        <form onSubmit={handleGrantAccess} className="flex gap-2">
                          <input
                            type="text"
                            value={newViewerInput}
                            onChange={(e) => setNewViewerInput(e.target.value)}
                            placeholder="Enter username or email (e.g. @usg_finance)"
                            className="flex-1 px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition cursor-pointer shrink-0"
                          >
                            + Grant Access
                          </button>
                        </form>

                        {/* Allowed Entities List */}
                        <div className="space-y-2 pt-2 border-t border-white/5 font-mono text-xs">
                          <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5">
                            <div className="flex items-center gap-2">
                              <span className="text-amber-400">👑</span>
                              <span className="text-white font-bold">@{ZENMUN_2026_MASTER.creatorUsername}</span>
                              <span className="text-[10px] text-neutral-500 font-sans">(Creator of MUN)</span>
                            </div>
                            <span className="text-[10px] text-emerald-400 font-bold">Permanent Owner</span>
                          </div>

                          <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5">
                            <div className="flex items-center gap-2">
                              <span className="text-cyan-400">💳</span>
                              <span className="text-white font-bold">ZENVITRA Payments Team</span>
                              <span className="text-[10px] text-neutral-500 font-sans">(payments@zenvitra.org)</span>
                            </div>
                            <span className="text-[10px] text-cyan-300 font-bold">Platform Escrow</span>
                          </div>

                          {delegatedViewers.map((viewer) => (
                            <div key={viewer} className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5">
                              <div className="flex items-center gap-2">
                                <span className="text-purple-400">👤</span>
                                <span className="text-white">@{viewer}</span>
                                <span className="text-[10px] text-neutral-500 font-sans">(Chosen by Creator)</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRevokeAccess(viewer)}
                                className="text-[11px] text-rose-400 hover:text-rose-300 font-mono underline cursor-pointer"
                              >
                                Revoke Access
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'AWARDS' && (
              <div className="p-8 rounded-3xl bg-black/50 border border-white/10 space-y-4 font-sans text-xs">
                <h3 className="text-xl font-bold font-display text-white">Awards &amp; Verifiable Certificates</h3>
                <p className="text-neutral-400 font-mono">
                  Certificates generated here carry a tamper-proof cryptographic SHA-256 seal and public QR verification linking directly to the delegate&apos;s public sovereign profile on ZENVITRA.
                </p>
                <button
                  type="button"
                  onClick={() => showToast('486 Verified Digital Certificates generated')}
                  className="px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition cursor-pointer"
                >
                  Generate 486 Verifiable Certificates (ZEN.CERTIFY)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Emergency Broadcast Modal */}
        {isEmergencyModalOpen && (
          <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-md rounded-3xl bg-[#090b10] border border-rose-500/40 p-6 text-white space-y-4 font-sans text-xs text-left shadow-2xl">
              <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-xs uppercase">
                <AlertTriangle className="w-4 h-4" />
                <span>EMERGENCY PROTOCOL BROADCAST</span>
              </div>
              <p className="text-neutral-300 text-xs">
                This broadcast will immediately interrupt all 5 committee rooms with high-priority audio chime and visual banner for all 486 delegates and chairs.
              </p>
              <textarea
                rows={3}
                placeholder="Enter urgent instructions or emergency room changes..."
                value={emergencyMessage}
                onChange={(e) => setEmergencyMessage(e.target.value)}
                className="w-full p-3 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-rose-400"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEmergencyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white font-mono cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendEmergency}
                  className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-mono font-bold cursor-pointer"
                >
                  Transmit Broadcast
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
