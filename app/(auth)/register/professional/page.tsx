'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Building2,
  Calendar,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Lock,
  Mail,
  AtSign,
  Phone,
  Globe,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Zap,
  Layers,
  Eye,
  EyeOff,
  Briefcase
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/context/AuthContext';
import { UsernameAvailabilityButton } from '@/components/auth/UsernameAvailabilityButton';
import { PasswordStrengthIndicator, evaluatePasswordStrength } from '@/components/auth/PasswordStrengthIndicator';
import { setProfessionalAccountEnabled, setEventAccountEnabled } from '@/lib/accountCapabilities';
import { recordSuccessfulAuth } from '@/lib/securityShield';
import { sheetSync } from '@/lib/googleSheets';

const SECTORS = [
  'Model UN Circuit & Society',
  'Youth NGO & Non-Profit',
  'University / Student Council',
  'International Summit & Conference Host',
  'Academic Think Tank & Research Lab',
  'Youth Debate League',
  'Media / Press House',
  'Corporate Youth Partner & Sponsor',
  'Independent Youth Collective'
];

const ENTITY_TYPES = [
  'Student Society / University Club',
  'Registered Non-Profit / NGO / Trust',
  'Educational Institution / School Body',
  'Commercial Event Organizer / Agency',
  'Autonomous Youth Initiative'
];

export default function ProfessionalEventRegisterPage() {
  const router = useRouter();
  const { signUpWithEmail } = useAuth();

  // Wizard Step (1: Entity Profile, 2: Administrative Liaison, 3: Operations & Scope, 4: Minting & Accord, 5: Complete)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State - Phase 1: Entity Profile
  const [orgName, setOrgName] = useState('');
  const [handle, setHandle] = useState('');
  const [sector, setSector] = useState(SECTORS[0]);
  const [entityType, setEntityType] = useState(ENTITY_TYPES[0]);
  const [website, setWebsite] = useState('');
  const [hqCity, setHqCity] = useState('');
  const [hqCountry, setHqCountry] = useState('India');

  // Form State - Phase 2: Administrative Liaison
  const [adminName, setAdminName] = useState('');
  const [adminRole, setAdminRole] = useState('Lead Organizer');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form State - Phase 3: Operations & Scale
  const [annualEvents, setAnnualEvents] = useState('3 - 5 Events / Year');
  const [avgAttendees, setAvgAttendees] = useState('100 - 500 Attendees');
  const [ticketingModel, setTicketingModel] = useState('Hybrid (Free Passes & Paid Escrow Tiers)');

  // Form State - Phase 4: Verification & Disclaimers
  const [confirmedNotSecNode, setConfirmedNotSecNode] = useState(false);
  const [agreedTransparency, setAgreedTransparency] = useState(false);
  const [sovereignKey, setSovereignKey] = useState('');
  const [hasCopiedKey, setHasCopiedKey] = useState(false);

  // UI Telemetry
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Generate 10-digit emergency cryptographic PIN
  useEffect(() => {
    const rawPin = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    setSovereignKey(rawPin);
  }, []);

  const copySovereignKey = () => {
    if (!sovereignKey) return;
    navigator.clipboard.writeText(sovereignKey);
    setHasCopiedKey(true);
    setTimeout(() => setHasCopiedKey(false), 2000);
  };

  // Step 1 Validation
  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim() || !handle.trim()) {
      setErrorMessage('Please enter your Organization Name and Namespace Handle.');
      return;
    }
    setErrorMessage(null);
    setStep(2);
  };

  // Step 2 Validation
  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName.trim() || !adminEmail.trim() || !password) {
      setErrorMessage('Please provide administrator credentials and master password.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Master password must be at least 8 characters long.');
      return;
    }
    const analysis = evaluatePasswordStrength(password);
    if (!analysis.isStrongEnough) {
      setErrorMessage('Password is too weak. Please include letters, numbers, and special characters.');
      return;
    }
    setErrorMessage(null);
    setStep(3);
  };

  // Step 3 Validation
  const handleNextStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStep(4);
  };

  // Final Registration Submission
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmedNotSecNode) {
      setErrorMessage('Please confirm acknowledgment that this is an Event/Institutional account, not a SEC Dais Node.');
      return;
    }
    if (!agreedTransparency) {
      setErrorMessage('Please accept the Sovereign Organizer Accord & Transparency Commitment.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const cleanHandle = handle.trim().replace(/^@/, '').toLowerCase();
      const cleanEmail = adminEmail.trim().toLowerCase();

      // 1. Sign up user as organizer
      const res = await signUpWithEmail(
        cleanEmail,
        password,
        orgName.trim(),
        cleanHandle,
        'organizer'
      );

      if (res?.error) {
        throw new Error(res.error.message || 'Failed to mint organization identity.');
      }

      // 2. Activate Professional & Event capabilities
      setProfessionalAccountEnabled(true);
      setEventAccountEnabled(true);

      // 3. Store Professional Pulse Profile details
      try {
        const professionalProfileData = {
          id: `profile_${cleanHandle}`,
          username: cleanHandle,
          name: orgName.trim(),
          bio: `${sector} • Based in ${hqCity || 'Global'}, ${hqCountry}. Official verified event organizer on Zenvitra.`,
          avatar: '',
          badge: 'ORGANIZATION' as const,
          accountType: 'professional' as const,
          category: sector,
          isSubscribedOrganizer: true,
          subscriptionPlan: 'ORGANIZER_PRO' as const,
          hostedEvents: [],
          website: website.trim() || undefined,
          location: `${hqCity ? hqCity + ', ' : ''}${hqCountry}`,
          isVerified: true,
          isPrivate: false,
          followers: [],
          following: [],
          pendingFollowRequests: [],
          joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          civicClearance: {
            level: 3,
            title: 'Verified Institutional Organizer',
            reliabilityScore: 96,
            verifiedCitationsCount: 5,
            ratifiedTreatiesCount: 0,
            endorsementsCount: 1,
            stakedBountiesWon: 0
          }
        };

        const profilesKey = 'zenvitra_pulse_profiles_v4';
        const rawExisting = localStorage.getItem(profilesKey);
        let existingProfiles = rawExisting ? JSON.parse(rawExisting) : [];
        if (!Array.isArray(existingProfiles)) existingProfiles = [];
        existingProfiles = existingProfiles.filter((p: any) => p.username?.toLowerCase() !== cleanHandle);
        existingProfiles.push(professionalProfileData);
        localStorage.setItem(profilesKey, JSON.stringify(existingProfiles));
      } catch (_) {}

      // 4. Sync registration metadata to Google Sheets Telemetry
      sheetSync.register({
        userId: cleanHandle,
        fullName: `${orgName.trim()} (Rep: ${adminName.trim()})`,
        email: cleanEmail,
        roleDesignation: `ORGANIZER [${sector}]`,
        accessLevel: 'SOVEREIGN_ORGANIZER_PRO',
        authProvider: 'email_password',
        accountStatus: 'ACTIVE',
      });

      recordSuccessfulAuth(cleanHandle);

      setStep(5);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration error. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030405] text-white font-sans selection:bg-cyan-500 selection:text-black relative overflow-x-hidden flex flex-col justify-between">
      {/* Ambient Grid Background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 0%, rgba(6, 182, 212, 0.15) 0%, transparent 60%),
            linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 48px 48px, 48px 48px',
        }}
      />
      <Navbar />

      <main className="relative z-10 max-w-5xl w-full mx-auto px-4 sm:px-8 py-12 pt-28 sm:pt-32 flex-1">
        {/* Header Badge & Title */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Building2 className="w-3.5 h-3.5" />
            <span className="font-bold uppercase tracking-wider">ZENVITRA // INSTITUTIONAL FORGE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Professional &amp; Event Registration
          </h1>
          <p className="max-w-2xl mx-auto text-sm text-neutral-400 font-sans leading-relaxed">
            Mint a verified institutional host namespace for organizing Model UN conferences, summits, youth initiatives, and ticketed gatherings.
          </p>
        </div>

        {/* ── CRITICAL CLARIFICATION BANNER: NOT A SEC NODE ── */}
        <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-blue-950/20 to-black border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 blur-3xl pointer-events-none" />
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5 shadow">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 text-xs text-neutral-300 leading-relaxed font-sans">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-black text-cyan-300 uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/30">
                  CRITICAL DISTINCTION
                </span>
                <span className="font-bold text-white text-sm">Professional Account is NOT a SEC (Secretariat) Node</span>
              </div>
              <p className="text-neutral-300">
                <strong className="text-white">SEC Nodes (Dais Command)</strong> are dedicated procedural committee rostra (Dais Chairs, Committee Directors, and Rapporteurs) who preside over parliamentary floor sessions and delegate voting.
              </p>
              <p className="text-neutral-400">
                <strong className="text-cyan-300">Professional &amp; Event Accounts</strong> are designed for <strong>Organizations, Youth NGOs, Universities, Event Organizers, Summit Hosts, Brands, and Studios</strong> to create and manage events, issue tickets, manage escrow payouts, publish official press communiqués, and access event analytics.
              </p>
            </div>
          </div>
        </div>

        {/* Step Indicator (Phases 1-4) */}
        {step < 5 && (
          <div className="mb-8 flex items-center justify-between max-w-md mx-auto font-mono text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition ${
                step >= 1 ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'border-white/10 text-neutral-500'
              }`}>
                1
              </span>
              <span className={step === 1 ? 'text-cyan-300 font-bold' : ''}>Entity</span>
            </div>
            <div className={`h-[1px] flex-1 mx-2 ${step >= 2 ? 'bg-cyan-500/50' : 'bg-white/10'}`} />
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition ${
                step >= 2 ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'border-white/10 text-neutral-500'
              }`}>
                2
              </span>
              <span className={step === 2 ? 'text-cyan-300 font-bold' : ''}>Admin</span>
            </div>
            <div className={`h-[1px] flex-1 mx-2 ${step >= 3 ? 'bg-cyan-500/50' : 'bg-white/10'}`} />
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition ${
                step >= 3 ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'border-white/10 text-neutral-500'
              }`}>
                3
              </span>
              <span className={step === 3 ? 'text-cyan-300 font-bold' : ''}>Operations</span>
            </div>
            <div className={`h-[1px] flex-1 mx-2 ${step >= 4 ? 'bg-cyan-500/50' : 'bg-white/10'}`} />
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition ${
                step >= 4 ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'border-white/10 text-neutral-500'
              }`}>
                4
              </span>
              <span className={step === 4 ? 'text-cyan-300 font-bold' : ''}>Accord</span>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ── STEP 1: ENTITY & BRAND BLUEPRINT ── */}
        {step === 1 && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleNextStep1}
            className="p-6 sm:p-10 rounded-3xl bg-[#080d1a] border border-white/10 space-y-6 font-mono text-xs shadow-2xl"
          >
            <div className="border-b border-white/10 pb-4">
              <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">PHASE 01 // ENTITY BLUEPRINT</span>
              <h2 className="text-xl font-bold text-white pt-1">Organization &amp; Event Host Profile</h2>
              <p className="text-neutral-400 font-sans text-xs pt-0.5">
                Define the public identity for your organization, conference circuit, or student body.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-neutral-300 font-bold uppercase text-[11px] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Organization / Host Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Oxford Diplomatic Society, Youth Global Summit"
                  className="w-full px-4 py-3.5 rounded-2xl bg-black border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 font-sans text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-300 font-bold uppercase text-[11px] flex items-center gap-1.5">
                  <AtSign className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Public Handle / Namespace *</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={handle}
                    onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="e.g. oxford_mun, global_summit"
                    className="w-full pl-8 pr-28 py-3.5 rounded-2xl bg-black border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 font-mono text-sm"
                  />
                  <span className="absolute left-3 top-3.5 text-neutral-500 font-mono">@</span>
                  <div className="absolute right-2 top-2">
                    <UsernameAvailabilityButton username={handle} />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-300 font-bold uppercase text-[11px] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Organization Sector *</span>
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-black border border-white/15 text-white focus:outline-none focus:border-cyan-400 font-sans text-sm"
                >
                  {SECTORS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-300 font-bold uppercase text-[11px] flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Entity Legal Structure *</span>
                </label>
                <select
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-black border border-white/15 text-white focus:outline-none focus:border-cyan-400 font-sans text-sm"
                >
                  {ENTITY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-300 font-bold uppercase text-[11px] flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Official Website / Portfolio</span>
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://oxfordmun.org"
                  className="w-full px-4 py-3.5 rounded-2xl bg-black border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 font-sans text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-neutral-300 font-bold uppercase text-[11px] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Headquarters City</span>
                  </label>
                  <input
                    type="text"
                    value={hqCity}
                    onChange={(e) => setHqCity(e.target.value)}
                    placeholder="e.g. New Delhi, London"
                    className="w-full px-4 py-3.5 rounded-2xl bg-black border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 font-sans text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-neutral-300 font-bold uppercase text-[11px]">Country</label>
                  <input
                    type="text"
                    value={hqCountry}
                    onChange={(e) => setHqCountry(e.target.value)}
                    placeholder="e.g. India, United Kingdom"
                    className="w-full px-4 py-3.5 rounded-2xl bg-black border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 font-sans text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-white/10">
              <Link
                href="/register"
                className="text-neutral-400 hover:text-white transition flex items-center gap-1 text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Individual Delegate Registration</span>
              </Link>
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                <span>Proceed to Administrative Liaison</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.form>
        )}

        {/* ── STEP 2: ADMINISTRATIVE LIAISON & SECURITY ── */}
        {step === 2 && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleNextStep2}
            className="p-6 sm:p-10 rounded-3xl bg-[#080d1a] border border-white/10 space-y-6 font-mono text-xs shadow-2xl"
          >
            <div className="border-b border-white/10 pb-4">
              <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">PHASE 02 // ADMINISTRATIVE LIAISON</span>
              <h2 className="text-xl font-bold text-white pt-1">Authorized Representative &amp; Access Keys</h2>
              <p className="text-neutral-400 font-sans text-xs pt-0.5">
                The primary signatory who oversees event publishing, financial escrow disbursements, and team clearance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-neutral-300 font-bold uppercase text-[11px]">Representative Full Name *</label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full px-4 py-3.5 rounded-2xl bg-black border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 font-sans text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-300 font-bold uppercase text-[11px]">Designation / Organizational Title *</label>
                <input
                  type="text"
                  required
                  value={adminRole}
                  onChange={(e) => setAdminRole(e.target.value)}
                  placeholder="e.g. President, Secretary-General, Event Director"
                  className="w-full px-4 py-3.5 rounded-2xl bg-black border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 font-sans text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-300 font-bold uppercase text-[11px] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Official Representative Email *</span>
                </label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="contact@oxfordmun.org"
                  className="w-full px-4 py-3.5 rounded-2xl bg-black border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 font-sans text-sm"
                />
                <span className="text-[10px] text-neutral-500 block">We recommend institutional or custom domain email for instant verified standing.</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-300 font-bold uppercase text-[11px] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Escalation Phone / WhatsApp</span>
                </label>
                <input
                  type="tel"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  placeholder="+91 98765 43210 (For attendee emergency escalations)"
                  className="w-full px-4 py-3.5 rounded-2xl bg-black border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 font-sans text-sm"
                />
              </div>

              <div className="sm:col-span-2 space-y-2">
                <label className="text-neutral-300 font-bold uppercase text-[11px] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Master Administrator Password *</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter strong cryptographic passphrase"
                    className="w-full px-4 py-3.5 pr-12 rounded-2xl bg-black border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 font-sans text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrengthIndicator password={password} onAutoGenerate={(pwd) => setPassword(pwd)} />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-neutral-400 hover:text-white transition flex items-center gap-1 text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Entity Blueprint</span>
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                <span>Proceed to Operations Scope</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.form>
        )}

        {/* ── STEP 3: OPERATIONS & EVENT SCOPE ── */}
        {step === 3 && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleNextStep3}
            className="p-6 sm:p-10 rounded-3xl bg-[#080d1a] border border-white/10 space-y-6 font-mono text-xs shadow-2xl"
          >
            <div className="border-b border-white/10 pb-4">
              <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">PHASE 03 // OPERATIONS SCOPE</span>
              <h2 className="text-xl font-bold text-white pt-1">Event Hosting Parameters &amp; Settlement Model</h2>
              <p className="text-neutral-400 font-sans text-xs pt-0.5">
                Configure your platform ticketing pipeline, expected crowd scale, and settlement protocols.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-neutral-300 font-bold uppercase text-[11px]">Expected Annual Frequency</label>
                {[
                  '1 - 2 Flagship Summits / Year',
                  '3 - 5 Continuous Conferences / Year',
                  '6+ High-Volume Circuit Conferences'
                ].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAnnualEvents(opt)}
                    className={`w-full p-3.5 rounded-2xl text-left font-sans text-xs border transition cursor-pointer flex items-center justify-between ${
                      annualEvents === opt
                        ? 'bg-cyan-500/20 border-cyan-500 text-white font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'bg-black/60 border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>{opt}</span>
                    {annualEvents === opt && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-neutral-300 font-bold uppercase text-[11px]">Average Delegate / Attendee Capacity</label>
                {[
                  'Under 100 Delegates (Boutique Summit)',
                  '100 - 500 Attendees (Medium Scale)',
                  '500 - 2,500 Attendees (Large Conference)',
                  '2,500+ Mega Multi-Venue Convention'
                ].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAvgAttendees(opt)}
                    className={`w-full p-3.5 rounded-2xl text-left font-sans text-xs border transition cursor-pointer flex items-center justify-between ${
                      avgAttendees === opt
                        ? 'bg-cyan-500/20 border-cyan-500 text-white font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'bg-black/60 border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>{opt}</span>
                    {avgAttendees === opt && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                  </button>
                ))}
              </div>

              <div className="sm:col-span-2 space-y-2">
                <label className="text-neutral-300 font-bold uppercase text-[11px]">Ticketing Settlement Model</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'free', label: 'Free Admission Only', desc: 'Zero ticketing charges, 100% free passes' },
                    { id: 'escrow', label: 'Paid Escrow Settlement', desc: '0.5% + ₹19 take-rate, automated escrow payouts' },
                    { id: 'hybrid', label: 'Hybrid & Sponsor Passes', desc: 'Free delegate admission + paid VIP tiers' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTicketingModel(t.label)}
                      className={`p-4 rounded-2xl text-left border transition cursor-pointer space-y-1 ${
                        ticketingModel.includes(t.label)
                          ? 'bg-cyan-500/20 border-cyan-500 text-white font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                          : 'bg-black/60 border-white/10 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <p className="text-xs font-bold text-white">{t.label}</p>
                      <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-neutral-400 hover:text-white transition flex items-center gap-1 text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Admin Liaison</span>
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                <span>Proceed to Sovereign Accord</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.form>
        )}

        {/* ── STEP 4: ACCORD & MINTING ── */}
        {step === 4 && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleFinalSubmit}
            className="p-6 sm:p-10 rounded-3xl bg-[#080d1a] border border-white/10 space-y-6 font-mono text-xs shadow-2xl"
          >
            <div className="border-b border-white/10 pb-4">
              <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">PHASE 04 // SOVEREIGN ORGANIZER ACCORD</span>
              <h2 className="text-xl font-bold text-white pt-1">Cryptographic Ledger Minting</h2>
              <p className="text-neutral-400 font-sans text-xs pt-0.5">
                Review your emergency recovery key and confirm operational covenants before identity generation.
              </p>
            </div>

            {/* 10-Digit Emergency Cryptographic Key */}
            <div className="p-5 rounded-2xl bg-black/80 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-300">
                  <Lock className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase">10-Digit Sovereign Emergency Recovery PIN</span>
                </div>
                <button
                  type="button"
                  onClick={copySovereignKey}
                  className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] flex items-center gap-1.5 transition cursor-pointer"
                >
                  {hasCopiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{hasCopiedKey ? 'Copied' : 'Copy Key'}</span>
                </button>
              </div>
              <div className="p-3 rounded-xl bg-black border border-white/10 text-center tracking-[0.3em] text-lg font-mono text-cyan-300 font-bold">
                {sovereignKey}
              </div>
              <p className="text-[11px] text-neutral-500 font-sans">
                Store this recovery PIN securely. If administrator email credentials are ever compromised, this PIN enables master sovereign key rotation.
              </p>
            </div>

            {/* MANDATORY CHECKBOXES */}
            <div className="space-y-4 pt-2">
              {/* NOT A SEC NODE CHECKBOX */}
              <label className="flex items-start gap-3 p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 cursor-pointer hover:bg-cyan-950/40 transition">
                <input
                  type="checkbox"
                  required
                  checked={confirmedNotSecNode}
                  onChange={(e) => setConfirmedNotSecNode(e.target.checked)}
                  className="w-4 h-4 rounded border-cyan-400 text-cyan-500 focus:ring-cyan-500 bg-black mt-0.5"
                />
                <div className="space-y-1">
                  <p className="font-bold text-white text-xs">
                    I confirm that this account is an Organization / Event Host profile and NOT a SEC (Secretariat) Dais Node.
                  </p>
                  <p className="text-[11px] text-neutral-400 font-sans">
                    I understand that committee dais rostrum command (country rosters, parliamentary voting rules of procedure) is strictly reserved for Dais/Secretariat nodes. This account represents the hosting entity, ticketing manager, and institutional publisher.
                  </p>
                </div>
              </label>

              {/* 25% AID & ZERO SURVEILLANCE COVENANT */}
              <label className="flex items-start gap-3 p-4 rounded-2xl bg-black/60 border border-white/10 cursor-pointer hover:bg-white/5 transition">
                <input
                  type="checkbox"
                  required
                  checked={agreedTransparency}
                  onChange={(e) => setAgreedTransparency(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 text-cyan-500 focus:ring-cyan-500 bg-black mt-0.5"
                />
                <div className="space-y-1">
                  <p className="font-bold text-white text-xs">
                    I accept the Sovereign Organizer Accord &amp; Transparency Covenant.
                  </p>
                  <p className="text-[11px] text-neutral-400 font-sans">
                    I agree to transparent ticketing escrow settlement, commit to the 25% platform support clause for underserved government schools if conducting philanthropic fundraising, and agree to zero surveillance of delegate personal data.
                  </p>
                </div>
              </label>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="text-neutral-400 hover:text-white transition flex items-center gap-1 text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Operations</span>
              </button>
              <button
                type="submit"
                disabled={loading || !confirmedNotSecNode || !agreedTransparency}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-40 text-black font-black text-xs flex items-center gap-2 transition cursor-pointer shadow-[0_0_30px_rgba(6,182,212,0.4)]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                    <span>Minting Organization Namespace...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Mint &amp; Deploy Professional Account</span>
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}

        {/* ── STEP 5: REGISTRATION COMPLETE ── */}
        {step === 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 sm:p-12 rounded-3xl bg-[#080d1a] border border-cyan-500/40 text-center space-y-6 shadow-[0_0_60px_rgba(6,182,212,0.2)] max-w-2xl mx-auto"
          >
            <div className="w-16 h-16 rounded-3xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 mx-auto shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-widest block">
                ORGANIZATION NAMESPACE DEPLOYED
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Welcome, {orgName}!
              </h2>
              <p className="text-sm text-neutral-300 font-sans max-w-md mx-auto leading-relaxed">
                Your verified Professional &amp; Event Host profile has been minted into the sovereign platform ledger under <strong className="text-cyan-300">@{handle}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-left font-mono text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between text-neutral-400">
                <span>Account Type:</span>
                <strong className="text-white">PROFESSIONAL (ORGANIZER)</strong>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Entity Sector:</span>
                <strong className="text-cyan-300">{sector}</strong>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Dais SEC Node:</span>
                <strong className="text-amber-400">FALSE (HOST ENTITY)</strong>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Verified Status:</span>
                <strong className="text-emerald-400">ACTIVE &bull; LEVEL 3 CLEARANCE</strong>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 font-mono text-xs">
              <button
                onClick={() => router.push('/events?view=dashboard')}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                <Calendar className="w-4 h-4" />
                <span>Open Event Dashboard</span>
              </button>
              <button
                onClick={() => router.push(`/profile/${handle}`)}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold transition cursor-pointer"
              >
                View Organization Profile
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
