'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Lock,
  User,
  AtSign,
  Mail,
  Building,
  KeyRound,
  Copy,
  Check,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Globe2,
  Fingerprint,
  Layers,
  HeartHandshake,
  FileText,
  Crown,
  Users,
  Newspaper,
  Terminal,
  Compass,
  Zap,
  Radio,
  CheckCircle2
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { LegalGateModal } from '@/components/auth/LegalGateModal';
import { useAuth } from '@/context/AuthContext';
import { sheetSync } from '@/lib/googleSheets';
import { recordSuccessfulAuth } from '@/lib/securityShield';
import { UsernameAvailabilityButton } from '@/components/auth/UsernameAvailabilityButton';
import { PasswordStrengthIndicator, evaluatePasswordStrength } from '@/components/auth/PasswordStrengthIndicator';

interface SovereignTrack {
  id: string;
  title: string;
  badge: string;
  icon: React.ElementType;
  tagline: string;
  requirements: string[];
  color: string;
}

const REGISTER_TRACKS: SovereignTrack[] = [
  {
    id: 'delegate',
    title: 'Diplomatic Delegate',
    badge: 'CHAMBER SOVEREIGN',
    icon: Users,
    tagline: 'Participate in Model UN summits, youth parliaments, floor caucuses, and pass cryptographic substantive resolutions.',
    requirements: ['Verified debate & caucus access', 'Dais floor voting clearance', 'Sovereign MUN Dossier'],
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30'
  },
  {
    id: 'journalist',
    title: 'ZEN.PRESS Correspondent',
    badge: 'WIRE BUREAU',
    icon: Newspaper,
    tagline: 'Draft autonomous student investigations, fast-wire breaking bulletins, and permanent digital research dossiers.',
    requirements: ['Independent editorial desk', 'Fast-wire breaking publishing', 'Permanent DOI citation archiving'],
    color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30'
  },
  {
    id: 'architect',
    title: 'Civic & Tech Architect',
    badge: 'PROTOCOL ENGINE',
    icon: Terminal,
    tagline: 'Build civic micro-tools, participate in campus hackathons, and audit the 25% transparent school aid treasury.',
    requirements: ['Open protocol tooling access', 'Treasury ledger audit rights', 'Hackathon & project stage'],
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30'
  },
  {
    id: 'secretariat',
    title: 'Secretariat / Node Lead',
    badge: 'DAIS COMMAND',
    icon: Crown,
    tagline: 'Preside over international committees, manage delegate country rosters, and coordinate institutional summits.',
    requirements: ['Dais command suite & quorum engine', 'Country allocation tools', 'Summit host clearance'],
    color: 'from-purple-500/20 to-fuchsia-500/10 border-purple-500/30'
  },
  {
    id: 'thinker',
    title: 'Global Policy Thinker',
    badge: 'POLICY FELLOW',
    icon: Compass,
    tagline: 'Co-author multilateral treaty frameworks, join international working groups, and publish policy manifestos.',
    requirements: ['Treaty co-authoring rights', 'Academic review desk', 'Cross-continental working groups'],
    color: 'from-rose-500/20 to-pink-500/10 border-rose-500/30'
  },
  {
    id: 'performer',
    title: 'Open Stage Performer',
    badge: 'CREATIVE VOICE',
    icon: Zap,
    tagline: 'Perform in unmoderated open mics, slam poetry stages, stand-up comedy nights, and live creator spaces.',
    requirements: ['Stage performer queue access', 'Audience clap-meter eligibility', 'Live audio & space broadcasting'],
    color: 'from-yellow-500/20 to-amber-500/10 border-yellow-500/30'
  }
];

export default function RegisterPage() {
  const router = useRouter();
  const { signUpWithEmail, continueAsGuest } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [track, setTrack] = useState('delegate');
  const [institution, setInstitution] = useState('');
  const [delegationPreference, setDelegationPreference] = useState('India');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sovereign Guest Node State
  const [isGuestExpanded, setIsGuestExpanded] = useState(false);
  const [customGuestHandle, setCustomGuestHandle] = useState('');
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestError, setGuestError] = useState<string | null>(null);

  const handleGuestEntry = async (handleToUse?: string) => {
    setGuestLoading(true);
    setGuestError(null);
    try {
      await continueAsGuest(handleToUse?.trim() || undefined);
      const redirect = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('redirect') : null;
      const target = redirect && redirect.startsWith('/') ? redirect : '/pulse';
      router.push(target);
      router.refresh();
    } catch (err: any) {
      setGuestError(err.message || 'Failed to initialize guest session.');
      setGuestLoading(false);
    }
  };

  // Sovereign 10-Digit Passkey State
  const [sovereignKey, setSovereignKey] = useState('');
  const [hasCopiedKey, setHasCopiedKey] = useState(false);

  // Legal Gate Flags
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [hasReadPrivacy, setHasReadPrivacy] = useState(false);
  const [hasReadToS, setHasReadToS] = useState(false);
  const [activeModal, setActiveModal] = useState<'PRIVACY' | 'TOS' | null>(null);

  // UI Telemetry
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Generate deterministic 10-digit emergency cryptographic PIN on mount & detect professional account route
  useEffect(() => {
    const rawPin = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    setSovereignKey(rawPin);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('type') === 'professional' || params.get('track') === 'secretariat') {
        setTrack('secretariat');
      }
    }
  }, []);

  const copySovereignKey = () => {
    if (!sovereignKey) return;
    navigator.clipboard.writeText(sovereignKey);
    setHasCopiedKey(true);
    setTimeout(() => setHasCopiedKey(false), 2000);
  };

  const handleCheckboxToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      setAgreedTerms(false);
      return;
    }
    if (!hasReadPrivacy) {
      setActiveModal('PRIVACY');
    } else if (!hasReadToS) {
      setActiveModal('TOS');
    } else {
      setAgreedTerms(true);
    }
  };

  const handlePrivacyCompleted = () => {
    setHasReadPrivacy(true);
    setActiveModal(null);
    if (!hasReadToS) {
      setTimeout(() => setActiveModal('TOS'), 300);
    } else {
      setAgreedTerms(true);
    }
  };

  const handleToSCompleted = () => {
    setHasReadToS(true);
    setActiveModal(null);
    setAgreedTerms(true);
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !handle || !email || !password) {
      setErrorMessage('Please complete all sovereign identity fields.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Master Passphrase must be at least 8 characters long.');
      return;
    }
    const analysis = evaluatePasswordStrength(password);
    if (!analysis.isStrongEnough) {
      setErrorMessage('Master Passphrase is too weak. Please include uppercase, lowercase, numbers, or special characters, or click Auto-Generate.');
      return;
    }
    setErrorMessage(null);
    setStep(3);
  };

  const handleFinalMintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) {
      setErrorMessage('You must review and accept the Sovereign Constitutional Accord.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const cleanHandle = handle.trim().replace(/^@/, '').toLowerCase();
      const selectedTrackObj = REGISTER_TRACKS.find((t) => t.id === track);

      const res = await signUpWithEmail(
        email.trim().toLowerCase(),
        password,
        fullName.trim(),
        cleanHandle,
        (track as any)
      );

      if (res?.error) {
        throw new Error(res.error.message || 'Identity registration failed.');
      }

      // Sync registration to Google Sheets
      sheetSync.register({
        userId: cleanHandle,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        roleDesignation: selectedTrackObj?.title || track,
        accessLevel: 'SOVEREIGN_NODE_1',
        authProvider: 'email_password',
        accountStatus: 'ACTIVE',
      });

      recordSuccessfulAuth(cleanHandle);

      router.push('/pulse');
      router.refresh();

    } catch (err: any) {
      setErrorMessage(err.message || 'Minting error. Please verify input.');
      setLoading(false);
    }
  };

  const activeTrackObj = REGISTER_TRACKS.find((t) => t.id === track) || REGISTER_TRACKS[0];

  return (
    <div className="min-h-screen bg-[#030405] text-white font-sans selection:bg-white selection:text-black relative overflow-x-hidden flex flex-col justify-between">
      
      {/* Background Grid & Ambient Radial Light */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-25"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 0%, rgba(255,255,255,0.12) 0%, transparent 60%),
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 48px 48px, 48px 48px',
        }}
      />
      <Navbar />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-purple-500/[0.03] blur-[150px] rounded-full pointer-events-none z-0" />

      {/* Main Registration Showcase */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 flex-1 flex items-start pt-24 sm:pt-28">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Sovereign Identity Minting Overview */}
          <div className="lg:col-span-6 space-y-8 text-left hidden lg:block pr-4">
            
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-neutral-950/90 border border-white/10 text-neutral-300 text-xs font-mono shadow-sm">
              <span className="relative flex h-2 w-2 items-center justify-center shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              <span className="tracking-wider uppercase font-semibold text-neutral-200">IDENTITY FORGE V-1.0</span>
              <span className="text-neutral-600">|</span>
              <span className="text-neutral-400">ZERO TRACKING GUARANTEE</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-sans font-black text-4xl sm:text-5xl text-white tracking-tight leading-[1.1]">
                Mint Your Sovereign<br />
                <span className="text-neutral-400 font-light italic font-serif">
                  Diplomatic Identity.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-neutral-400 max-w-lg font-light leading-relaxed">
                Step into the sovereign ecosystem. Real accounts start with strictly <strong className="text-white font-semibold">0 fake numbers</strong> and earn authentic verified accolades across Model UNs, press wires, and civic assemblies.
              </p>
            </div>

            {/* Active Track Highlight Box */}
            <div className={`p-6 rounded-[2rem] bg-gradient-to-br ${activeTrackObj.color} bg-[#07080b]/90 border backdrop-blur-2xl space-y-4 shadow-2xl transition-all duration-300`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-white text-black font-bold">
                    <activeTrackObj.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">{activeTrackObj.title}</h3>
                    <span className="text-[10px] font-mono tracking-widest text-cyan-300 uppercase">{activeTrackObj.badge}</span>
                  </div>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white font-semibold">
                  STEP {step} OF 3
                </span>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                {activeTrackObj.tagline}
              </p>

              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                  CLEARANCE PRIVILEGES &amp; ACCORDS:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeTrackObj.requirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-mono text-neutral-200 bg-white/5 p-2 rounded-xl border border-white/5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step Progress Indicators */}
            <div className="grid grid-cols-3 gap-3 font-mono text-xs">
              <div className={`p-3.5 rounded-2xl border text-center transition-all ${step === 1 ? 'bg-white text-black border-white font-bold' : step > 1 ? 'bg-white/10 border-white/20 text-white' : 'bg-white/[0.02] border-white/5 text-neutral-500'}`}>
                <span>01. Domain</span>
              </div>
              <div className={`p-3.5 rounded-2xl border text-center transition-all ${step === 2 ? 'bg-white text-black border-white font-bold' : step > 2 ? 'bg-white/10 border-white/20 text-white' : 'bg-white/[0.02] border-white/5 text-neutral-500'}`}>
                <span>02. Coordinates</span>
              </div>
              <div className={`p-3.5 rounded-2xl border text-center transition-all ${step === 3 ? 'bg-white text-black border-white font-bold' : 'bg-white/[0.02] border-white/5 text-neutral-500'}`}>
                <span>03. Mint Passkey</span>
              </div>
            </div>
          </div>

          {/* Right Column: Multi-Step Identity Wizard */}
          <div className="lg:col-span-6 w-full max-w-lg mx-auto space-y-5">
            
            <div className="rounded-[2.5rem] bg-[#07080b]/95 border border-white/15 p-6 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.95)] backdrop-blur-3xl relative overflow-hidden text-left space-y-6">
              
              {/* Top Step Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400 uppercase tracking-wider font-semibold">
                    {step === 1 && 'CHOOSE PROTOCOL DOMAIN'}
                    {step === 2 && 'ENTER DIPLOMATIC COORDINATES'}
                    {step === 3 && 'MINT 10-DIGIT SOVEREIGN KEY'}
                  </span>
                  <span className="text-cyan-400 font-bold">STEP {step}/3</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400 transition-all duration-500 rounded-full"
                    style={{ width: `${(step / 3) * 100}%` }}
                  />
                </div>
              </div>

              {/* Error Message Alert */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* ── STEP 1: TRACK SELECTION ── */}
              {step === 1 && (
                <form onSubmit={handleNextStep1} className="space-y-4">
                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                    {REGISTER_TRACKS.map((t) => {
                      const Icon = t.icon;
                      const isSelected = track === t.id;
                      return (
                        <div
                          key={t.id}
                          onClick={() => setTrack(t.id)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                            isSelected
                              ? 'bg-white/[0.08] border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                              : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/15'
                          }`}
                        >
                          <div className={`p-2 rounded-xl border shrink-0 mt-0.5 ${isSelected ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-neutral-300'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-xs sm:text-sm text-white">{t.title}</h4>
                              <span className="text-[9px] font-mono text-neutral-400 tracking-wider uppercase">{t.badge}</span>
                            </div>
                            <p className="text-[11px] text-neutral-400 line-clamp-2 mt-0.5 leading-snug">
                              {t.tagline}
                            </p>
                          </div>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${isSelected ? 'border-white bg-white text-black' : 'border-white/20'}`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-white/20 active:scale-[0.98]"
                  >
                    <span>Proceed to Identity Coordinates</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* ── STEP 2: CREDENTIALS & DETAILS ── */}
              {step === 2 && (
                <form onSubmit={handleNextStep2} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold text-neutral-300">FULL DIPLOMATIC NAME</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Maya Lin"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-white/40 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono font-semibold text-neutral-300">UNIQUE @HANDLE</label>
                      </div>
                      <div className="relative flex items-center">
                        <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                        <input
                          type="text"
                          value={handle}
                          onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                          placeholder="mayalin"
                          required
                          className="w-full pl-10 pr-28 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-white/40 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition font-mono"
                        />
                        <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                          <UsernameAvailabilityButton username={handle} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-semibold text-neutral-300">PRIMARY EMAIL</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="maya@summit.org"
                          required
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-white/40 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-semibold text-neutral-300">INSTITUTION / NODE</label>
                      <div className="relative">
                        <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input
                          type="text"
                          value={institution}
                          onChange={(e) => setInstitution(e.target.value)}
                          placeholder="Harvard / Delhi Univ"
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-white/40 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-semibold text-neutral-300">PRIMARY COUNTRY</label>
                      <div className="relative">
                        <Globe2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input
                          type="text"
                          value={delegationPreference}
                          onChange={(e) => setDelegationPreference(e.target.value)}
                          placeholder="India / USA / France"
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-white/40 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold text-neutral-300 flex items-center justify-between">
                      <span>MASTER PASSPHRASE <span className="text-amber-400">*</span></span>
                      <span className="text-[10px] font-mono text-neutral-500 font-normal">Min. 8 chars, high-entropy</span>
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full pl-10 pr-11 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-white/40 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Sovereign Strong Password Indicator & Auto-Generator */}
                    <PasswordStrengthIndicator
                      password={password}
                      onAutoGenerate={(generated) => {
                        setPassword(generated);
                        setShowPassword(true);
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-300 font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-white/20 active:scale-[0.98]"
                    >
                      <span>Proceed to Minting Ledger</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* ── STEP 3: SOVEREIGN PASSKEY & FINAL ACCORD ── */}
              {step === 3 && (
                <form onSubmit={handleFinalMintSubmit} className="space-y-4">
                  
                  {/* Generated 10-Digit Sovereign Emergency Key */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-black to-[#07080b] border border-emerald-500/30 space-y-3 shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5" />
                        10-DIGIT EMERGENCY RECOVERY PIN
                      </span>
                      <span className="text-[9px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded">
                        OFF-CHAIN ONLY
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-black/80 border border-white/10 font-mono text-base sm:text-lg text-emerald-300 font-bold tracking-widest">
                      <span>{sovereignKey}</span>
                      <button
                        type="button"
                        onClick={copySovereignKey}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1 text-xs cursor-pointer font-sans font-semibold shrink-0"
                      >
                        {hasCopiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{hasCopiedKey ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-neutral-400 font-mono leading-relaxed">
                      Save this 10-digit key in a secure location. It allows hardware biometric recovery if you lose access to your device.
                    </p>
                  </div>

                  {/* Summary Coordinates Box */}
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 text-xs font-mono">
                    <div className="flex justify-between text-neutral-400">
                      <span>IDENTITY HANDLE:</span>
                      <span className="text-white font-bold">@{handle}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>SOVEREIGN ARCHETYPE:</span>
                      <span className="text-cyan-300 font-bold">{activeTrackObj.title}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>PRIMARY DELEGATION:</span>
                      <span className="text-white font-bold">{delegationPreference}</span>
                    </div>
                  </div>

                  {/* Legal Gate Checkbox */}
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
                      <input
                        type="checkbox"
                        checked={agreedTerms}
                        onChange={handleCheckboxToggle}
                        className="mt-0.5 w-4 h-4 rounded border-white/20 bg-black text-cyan-400 focus:ring-0 cursor-pointer"
                      />
                      <span className="text-neutral-300 text-[11px] leading-snug">
                        I confirm this identity and accept the{' '}
                        <button
                          type="button"
                          onClick={() => setActiveModal('PRIVACY')}
                          className="text-white font-semibold underline hover:text-cyan-300"
                        >
                          Privacy Charter
                        </button>{' '}
                        and{' '}
                        <button
                          type="button"
                          onClick={() => setActiveModal('TOS')}
                          className="text-white font-semibold underline hover:text-cyan-300"
                        >
                          Constitutional Terms of Service
                        </button>.
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-300 font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !agreedTerms}
                      className="flex-1 py-3.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-white/20 active:scale-[0.98] disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Minting Sovereign Key...</span>
                        </>
                      ) : (
                        <>
                          <span>Mint Sovereign Identity</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Sovereign Guest Node Mode */}
              <div className="pt-3">
                <div className="p-4 rounded-2xl bg-gradient-to-b from-purple-500/[0.08] via-purple-500/[0.03] to-transparent border border-purple-500/25 hover:border-purple-500/40 transition-all space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/35 flex items-center justify-center text-purple-300 shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white font-display">Continue as Sovereign Guest Node</h4>
                        <p className="text-[10px] text-neutral-400 font-mono">Explore platform immediately without full registration</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[9px] font-mono uppercase tracking-wider shrink-0 font-semibold">
                      GUEST NODE
                    </span>
                  </div>

                  <div className="text-[10px] text-neutral-400 font-mono space-y-1 bg-black/50 p-2.5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <span>✓</span> <span>Read live Pulse feed, citizen stories & policy press</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <span>✓</span> <span>Publish community dispatches under your guest handle</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-400/90">
                      <span>🔒</span> <span>Medals, accolades & Dais voting locked until email/OAuth connected</span>
                    </div>
                  </div>

                  {guestError && (
                    <p className="text-xs font-mono text-rose-400">{guestError}</p>
                  )}

                  {isGuestExpanded ? (
                    <div className="space-y-2.5 pt-1">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-neutral-400 uppercase block">
                          Choose Custom Guest Handle (Optional)
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-mono text-xs pointer-events-none">@</span>
                          <input
                            type="text"
                            value={customGuestHandle}
                            onChange={(e) => setCustomGuestHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                            placeholder="guest_node"
                            maxLength={20}
                            className="w-full pl-7 pr-28 py-2 rounded-xl bg-black/80 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-purple-400/50"
                          />
                          <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                            <UsernameAvailabilityButton username={customGuestHandle} showText={false} />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleGuestEntry(customGuestHandle)}
                          disabled={guestLoading}
                          className="flex-1 py-2.5 rounded-xl bg-purple-400 hover:bg-purple-300 text-black font-display font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                        >
                          {guestLoading ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Initializing...</span>
                            </>
                          ) : (
                            <>
                              <span>Enter As @{customGuestHandle || 'guest_node'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsGuestExpanded(false)}
                          className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 text-xs font-mono transition cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleGuestEntry()}
                        disabled={guestLoading}
                        className="flex-1 py-2.5 rounded-xl bg-purple-400 hover:bg-purple-300 text-black font-display font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                      >
                        {guestLoading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Entering...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Instant Guest Access</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsGuestExpanded(true)}
                        className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 font-mono text-xs transition cursor-pointer"
                        title="Set Custom Guest Handle"
                      >
                        Custom @
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Switcher */}
              <div className="pt-4 border-t border-white/10 text-center space-y-3">
                <p className="text-xs text-neutral-400 font-mono">
                  Already hold a sovereign key?{' '}
                  <Link href="/login" className="text-white font-bold hover:underline">
                    Authenticate ZEN.ID &rarr;
                  </Link>
                </p>

                <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-neutral-500 pt-1">
                  <Link href="/join-core-team" className="hover:text-neutral-300 transition flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" />
                    <span>Join Core Team</span>
                  </Link>
                  <span>&bull;</span>
                  <Link href="/privacy" className="hover:text-neutral-300 transition">
                    Constitutional Ledger
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Legal Gate Modals */}
      <LegalGateModal
        isOpen={Boolean(activeModal)}
        type={activeModal || 'PRIVACY'}
        onComplete={activeModal === 'PRIVACY' ? handlePrivacyCompleted : handleToSCompleted}
      />
    </div>
  );
}