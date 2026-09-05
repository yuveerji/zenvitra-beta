'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  Users, 
  ArrowLeft,
  Scale,
  Award,
  BookOpen,
  Globe,
  Radio,
  Landmark,
  Compass,
  Cpu,
  Fingerprint,
  FileCheck2,
  Terminal,
  Zap,
  Info,
  ChevronDown,
  Lock,
  Calendar,
  Layers,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { sheetSync } from '@/lib/googleSheets';
import { StatusNotificationModal } from '@/components/navigation/StatusNotificationModal';

interface CommitteeTrack {
  id: string;
  name: string;
  abbreviation: string;
  category: 'MULTILATERAL' | 'PARLIAMENTARY' | 'CRISIS' | 'ACADEMIC';
  badgeColor: string;
  description: string;
  agendaTopic: string;
  delegateCapacity: string;
  suitability: string;
}

const COMMITTEE_TRACKS: CommitteeTrack[] = [
  {
    id: 'unsc',
    name: 'United Nations Security Council',
    abbreviation: 'UNSC',
    category: 'MULTILATERAL',
    badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    description: 'High-stakes permanent and non-permanent diplomacy regarding immediate global sovereignty threats and non-proliferation treaties.',
    agendaTopic: 'Regulating Sovereign Autonomous Warfare Protocols & Autonomous Kinetic Defense',
    delegateCapacity: '15 Member Delegations',
    suitability: 'Advanced Delegates & Veteran Negotiators'
  },
  {
    id: 'loksabha',
    name: 'All India Political Parties Meet (AIPPM) / Lok Sabha',
    abbreviation: 'LOK SABHA',
    category: 'PARLIAMENTARY',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    description: 'Bicameral domestic parliamentary procedure debating constitutional amendments, fiscal federalism, and socio-economic legislation.',
    agendaTopic: 'National AI Sovereignty & Data Localization Regulatory Bill 2026',
    delegateCapacity: '45 Parliamentarians',
    suitability: 'Orators, Policy Analysts & Constitutional Experts'
  },
  {
    id: 'unhrc',
    name: 'United Nations Human Rights Council',
    abbreviation: 'UNHRC',
    category: 'MULTILATERAL',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    description: 'Deliberation on humanitarian accords, civil liberties in conflict corridors, and digital sanctuary rights.',
    agendaTopic: 'Protection of Displaced Civilians & Digital Privacy in Armed Conflict Corridors',
    delegateCapacity: '38 Delegations',
    suitability: 'Human Rights Advocates & Research Scholars'
  },
  {
    id: 'hcc',
    name: 'Historical Crisis Committee (HCC)',
    abbreviation: 'HCC 1962',
    category: 'CRISIS',
    badgeColor: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
    description: 'Continuous crisis simulation with dynamic backroom directives, espionage communiqués, and presidential executive orders.',
    agendaTopic: 'The 1962 Geopolitical Brink: Cold War Nuclear Escalation Protocol',
    delegateCapacity: '20 Cabinet Ministers',
    suitability: 'Crisis Strategists & Rapid Directive Drafters'
  },
  {
    id: 'ipc',
    name: 'International Press Corps',
    abbreviation: 'IPC BUREAU',
    category: 'ACADEMIC',
    badgeColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
    description: 'Independent investigative journalists reporting on live committee debate, publishing daily dispatches, and questioning lead sponsors.',
    agendaTopic: 'Journalistic Independence & Real-time Fact-Checking of Multilateral Drafts',
    delegateCapacity: '18 Foreign Correspondents',
    suitability: 'Investigative Writers, Editors & Photojournalists'
  },
  {
    id: 'g20',
    name: 'G20 Sovereign Sherpa Summit',
    abbreviation: 'G20',
    category: 'PARLIAMENTARY',
    badgeColor: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
    description: 'Macro-economic cooperation, multilateral sovereign debt restructuring, and sustainable transition financing.',
    agendaTopic: 'Cross-Border Central Bank Digital Currencies (CBDC) Interoperability Accord',
    delegateCapacity: '20 Heads of State / Finance Ministers',
    suitability: 'Economists & Bilateral Trade Negotiators'
  }
];

const EXPERIENCE_TIERS = [
  { id: 'NOVICE', label: 'First-time Delegate / 0–2 Conferences', desc: 'Seeking foundational diplomacy, parliamentary mentorship, and guided drafting.' },
  { id: 'INTERMEDIATE', label: 'Intermediate Diplomat / 3–6 Conferences', desc: 'Familiar with Rules of Procedure, preambular clauses, and resolution negotiation.' },
  { id: 'VETERAN', label: 'Veteran / 7–15+ Conferences', desc: 'Proven track record in draft resolution sponsorship, caucusing, and committee direction.' },
  { id: 'DAIS_MEMBER', label: 'Secretariat / Executive Dais Aspirant', desc: 'Experienced Executive Board chair, director, or procedural rapporteur.' }
];

export default function StatusRegisterPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  
  // Registration Form State
  const [formData, setFormData] = useState({
    // Step 1: Core Identity
    fullName: '',
    email: '',
    phoneNumber: '',
    preferredHandle: '',
    countryCity: '',
    institutionOrSchool: '',
    degreeOrGrade: '',

    // Step 2: Diplomatic Profile & Tracks
    primaryCommitteePreference: 'unsc',
    secondaryCommitteePreference: 'loksabha',
    experienceTier: 'INTERMEDIATE',
    totalConferencesAttended: '3-5',
    preferredCountryAllocations: '',
    previousAwardsOrAccolades: '',

    // Step 3: Sovereign Platform Ambitions
    roleInterest: 'Student Delegate / Youth Leader',
    portfolioInterests: [] as string[],
    motivationBrief: '',
    seekingCampusAmbassadorship: false,
    hardwareEquipment: 'Laptop (Chrome / Edge / Safari / Brave)',

    // Step 4: Verification & Accord
    termsAccepted: true,
    codeOfConductAccepted: true,
    dataProcessingConsent: true,
  });

  // Auto-generate candidate ID
  const candidateRefId = useMemo(() => {
    return `ZV-${Math.floor(1000 + Math.random() * 9000)}-${(formData.primaryCommitteePreference || 'GEN').toUpperCase()}`;
  }, [formData.primaryCommitteePreference]);

  // Validation functions
  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const isStep1Valid = useMemo(() => {
    return (
      formData.fullName.trim().length >= 3 &&
      validateEmail(formData.email) &&
      formData.institutionOrSchool.trim().length >= 2
    );
  }, [formData.fullName, formData.email, formData.institutionOrSchool]);

  const isStep2Valid = useMemo(() => {
    return (
      Boolean(formData.primaryCommitteePreference) &&
      Boolean(formData.experienceTier)
    );
  }, [formData.primaryCommitteePreference, formData.experienceTier]);

  const isStep3Valid = useMemo(() => {
    return Boolean(formData.roleInterest);
  }, [formData.roleInterest]);

  const isStep4Valid = useMemo(() => {
    return formData.termsAccepted && formData.codeOfConductAccepted && formData.dataProcessingConsent;
  }, [formData.termsAccepted, formData.codeOfConductAccepted, formData.dataProcessingConsent]);

  const handleTogglePortfolio = (tag: string) => {
    setFormData((prev) => {
      const exists = prev.portfolioInterests.includes(tag);
      return {
        ...prev,
        portfolioInterests: exists
          ? prev.portfolioInterests.filter((t) => t !== tag)
          : [...prev.portfolioInterests, tag]
      };
    });
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep1Valid || !isStep2Valid || !isStep3Valid || !isStep4Valid) {
      setErrorMessage('Please complete all required fields and accept the civic covenants before submitting.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const generatedUserId = `pre_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

    try {
      // 1. Ingest into Google Sheet Register Data Core with full metadata
      const primaryTrackObj = COMMITTEE_TRACKS.find(c => c.id === formData.primaryCommitteePreference);

      await sheetSync.register({
        userId: generatedUserId,
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        roleDesignation: `${formData.roleInterest} | ${primaryTrackObj?.abbreviation || 'GEN'} Track`,
        accessLevel: 'Pre-Registered Sovereign Whitelist',
        authProvider: 'DIRECT_ENROLL',
        accountStatus: 'PENDING_VERIFICATION',
      });

      // 2. Also register in Events Tab for seamless dais allocation
      try {
        await sheetSync.eventRegistration({
          eventIdSlug: 'zenvitra-inaugural-summit-2026',
          eventName: 'Zenvitra Sovereign Launch Summit 2026',
          participantName: formData.fullName.trim(),
          participantEmail: formData.email.trim().toLowerCase(),
          contactNumber: formData.phoneNumber || 'N/A',
          institutionAffiliation: formData.institutionOrSchool || 'Independent Scholar',
          ticketPassType: `${formData.experienceTier} (${primaryTrackObj?.abbreviation || 'DELEGATE'})`,
          attendanceMarked: 'PRE_REGISTERED'
        });
      } catch (evtErr) {
        console.warn('[EVENT-SYNC-SKIPPED]', evtErr);
      }

      // 3. If applicant opted into Campus Ambassadorship, register in Campus Ambassador Tab
      if (formData.seekingCampusAmbassadorship) {
        try {
          await sheetSync.campusAmbassador({
            fullName: formData.fullName.trim(),
            collegeUniversityName: formData.institutionOrSchool,
            cityState: formData.countryCity || 'Pan-India',
            degreeYearOfStudy: formData.degreeOrGrade || 'Undergraduate',
            leadershipExperience: `Prior conferences: ${formData.totalConferencesAttended}. Accolades: ${formData.previousAwardsOrAccolades || 'None listed'}`,
            proposedStrategy: formData.motivationBrief || 'Passionate about democratizing youth diplomatic access.',
            approvalStatus: 'PENDING_REVIEW'
          });
        } catch (ambErr) {
          console.warn('[AMBASSADOR-SYNC-SKIPPED]', ambErr);
        }
      }

      // 4. Cache email and identifier in localStorage for immediate verification
      if (typeof window !== 'undefined') {
        localStorage.setItem('zenvitra_applicant_email', formData.email.trim().toLowerCase());
        localStorage.setItem('zenvitra_applicant_name', formData.fullName.trim());
        localStorage.setItem('zenvitra_candidate_ref', candidateRefId);
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected telemetry error occurred. Please verify your connection and retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPrimaryTrack = useMemo(() => {
    return COMMITTEE_TRACKS.find(c => c.id === formData.primaryCommitteePreference) || COMMITTEE_TRACKS[0];
  }, [formData.primaryCommitteePreference]);

  return (
    <div className="min-h-screen bg-[#020305] text-white flex flex-col justify-between selection:bg-amber-400 selection:text-black font-sans relative overflow-x-hidden">
      {/* Background Radiance & Micro-Grid */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:28px_28px] opacity-60 z-0" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[450px] bg-gradient-to-b from-amber-500/[0.08] via-rose-500/[0.03] to-transparent blur-[160px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[500px] bg-amber-500/[0.03] blur-[140px] pointer-events-none z-0" />

      {/* Top Header */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/[0.07]">
        <Link href="/countdown" className="flex items-center gap-3 group">
          <div className="relative h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
            <img
              src="/assets/logo.png"
              alt="Zenvitra Logo"
              className="h-full w-full object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]"
            />
          </div>
          <div>
            <div 
              className="tracking-[0.14em] text-sm sm:text-base font-bold text-[#f5f1ea] uppercase leading-none"
              style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
            >
              ZENVITRA
            </div>
            <div className="font-mono text-[9px] tracking-widest text-amber-400/90 uppercase mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SOVEREIGN ENROLLMENT DESK 2026
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {/* Status Check Quick Access */}
          <button
            onClick={() => setIsStatusModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-amber-500/[0.08] hover:bg-amber-500/[0.16] border border-amber-500/30 text-xs font-mono text-amber-300 transition cursor-pointer"
            title="Check Existing Clearance Status"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Check Clearance</span>
          </button>

          <Link
            href="/statussignin"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-neutral-300 transition"
          >
            <span>Sign In</span>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
          </Link>
        </div>
      </header>

      {/* Real-time Status Modal */}
      <StatusNotificationModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
      />

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-14 flex-1">
        {isSuccess ? (
          /* =========================================================
             SUCCESS DOSSIER: IMMUTABLE CLEARANCE CONFIRMATION
             ========================================================= */
          <div className="max-w-3xl mx-auto rounded-[2.5rem] bg-[#07090e] border border-emerald-500/30 p-8 sm:p-12 space-y-8 shadow-[0_30px_90px_rgba(0,0,0,0.95)] animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-emerald-400/10 border border-emerald-400/40 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.25)]">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-[10px] font-mono tracking-widest text-emerald-300 uppercase">
                  SOVEREIGN REGISTRATION AFFIRMED
                </div>
                <h1 
                  className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
                  style={{ fontFamily: 'Clash Display, sans-serif' }}
                >
                  Candidate Record Synchronized
                </h1>
                <p className="text-sm text-neutral-400 leading-relaxed max-w-lg mx-auto">
                  Your diplomatic dossier and launch whitelist slot have been committed to the Zenvitra Sovereign Database & Google Sheets Master Ledger.
                </p>
              </div>
            </div>

            {/* Credential Pass Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0c101c] to-[#06080e] border border-white/15 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">CANDIDATE DOSSIER</div>
                  <div className="text-xl font-bold text-white tracking-wide">{formData.fullName}</div>
                  <div className="text-xs font-mono text-neutral-400">{formData.email}</div>
                </div>
                <div className="sm:text-right font-mono">
                  <div className="text-[10px] tracking-widest text-neutral-500 uppercase">LEDGER REFERENCE ID</div>
                  <div className="text-sm font-bold text-amber-300 tracking-wider">{candidateRefId}</div>
                  <div className="text-[10px] text-emerald-400 flex sm:justify-end items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    QUEUED FOR LAUNCH
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 font-mono text-xs">
                <div>
                  <div className="text-neutral-500 text-[10px] uppercase">PRIMARY TRACK</div>
                  <div className="text-white font-semibold mt-1">{selectedPrimaryTrack.abbreviation}</div>
                  <div className="text-[10px] text-neutral-400 truncate">{selectedPrimaryTrack.name}</div>
                </div>
                <div>
                  <div className="text-neutral-500 text-[10px] uppercase">EXPERIENCE TIER</div>
                  <div className="text-amber-300 font-semibold mt-1">{formData.experienceTier}</div>
                  <div className="text-[10px] text-neutral-400">{formData.totalConferencesAttended} summits</div>
                </div>
                <div>
                  <div className="text-neutral-500 text-[10px] uppercase">INSTITUTION</div>
                  <div className="text-white font-semibold mt-1 truncate">{formData.institutionOrSchool || 'Independent'}</div>
                  <div className="text-[10px] text-neutral-400">{formData.countryCity || 'Global'}</div>
                </div>
                <div>
                  <div className="text-neutral-500 text-[10px] uppercase">ALLOCATION DESK</div>
                  <div className="text-emerald-400 font-semibold mt-1">PRIORITY 1</div>
                  <div className="text-[10px] text-neutral-400">Sept 18 Launch</div>
                </div>
              </div>

              {formData.seekingCampusAmbassadorship && (
                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center gap-2 text-xs font-mono text-amber-300">
                  <Award className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Campus Ambassador Fellowship Application attached & forwarded to Secretariat</span>
                </div>
              )}
            </div>

            {/* Next Steps Advisory */}
            <div className="p-5 rounded-2xl bg-black/50 border border-white/[0.08] text-xs font-mono text-neutral-300 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold uppercase tracking-wider">
                <Info className="w-4 h-4" />
                What Happens Next?
              </div>
              <p className="text-neutral-400 leading-relaxed">
                1. Our Dais Allocation Board reviews committee balance and draft allocations based on your conference tier.
                <br />
                2. On <span className="text-white font-semibold">September 18 at 5:00 PM IST</span>, when the countdown lock disengages, you can navigate directly to <span className="text-amber-300">/statussignin</span> to authenticate and access your chamber study guides and resolution workspaces.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Link
                href="/countdown"
                className="w-full py-4 rounded-2xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition shadow-[0_0_25px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 text-center"
              >
                <span>Return to Countdown Clock</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </Link>

              <button
                onClick={() => setIsStatusModalOpen(true)}
                className="w-full py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 text-center cursor-pointer"
              >
                <Fingerprint className="w-4 h-4 text-amber-400" />
                <span>Verify Real-Time Telemetry</span>
              </button>
            </div>
          </div>
        ) : (
          /* =========================================================
             MULTI-STAGE SOVEREIGN PRE-REGISTRATION EXPERIENCE
             ========================================================= */
          <div className="space-y-10">
            {/* Title & Introduction Banner */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/[0.08] border border-amber-400/30 text-xs font-mono tracking-widest text-amber-300 uppercase shadow-[0_0_20px_rgba(251,191,36,0.15)]">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>OFFICIAL LAUNCH SUMMIT 2026 DELEGATE WHITELIST</span>
              </div>

              <h1 
                className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight"
                style={{ fontFamily: 'Clash Display, sans-serif' }}
              >
                Claim Your Seat at the Sovereign Dais
              </h1>

              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-2xl mx-auto">
                Secure early entry credentials, lodge your multilateral committee preferences, and gain priority country matrix allocation prior to public platform ignition on September 18.
              </p>

              {/* Live Step Progress Indicator */}
              <div className="pt-6 max-w-xl mx-auto">
                <div className="grid grid-cols-4 gap-2 text-left">
                  {[
                    { step: 1, title: 'Identity', subtitle: 'Personal Data' },
                    { step: 2, title: 'Chamber', subtitle: 'Committee Pick' },
                    { step: 3, title: 'Portfolio', subtitle: 'Track & Role' },
                    { step: 4, title: 'Accord', subtitle: 'Affirmation' },
                  ].map((s) => {
                    const isActive = currentStep === s.step;
                    const isCompleted = currentStep > s.step;
                    return (
                      <button
                        key={s.step}
                        type="button"
                        onClick={() => {
                          if (isCompleted || s.step < currentStep) {
                            setCurrentStep(s.step as 1 | 2 | 3 | 4);
                          }
                        }}
                        className={`text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-amber-500/[0.12] border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.1)]'
                            : isCompleted
                            ? 'bg-emerald-500/[0.06] border-emerald-500/30 text-neutral-300'
                            : 'bg-white/[0.02] border-white/[0.07] text-neutral-500 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-mono text-[10px] font-bold ${isActive ? 'text-amber-400' : isCompleted ? 'text-emerald-400' : 'text-neutral-500'}`}>
                            STAGE 0{s.step}
                          </span>
                          {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        </div>
                        <div className="text-xs font-bold text-white tracking-tight">{s.title}</div>
                        <div className="text-[10px] font-mono text-neutral-400 hidden sm:block">{s.subtitle}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Error Display */}
            {errorMessage && (
              <div className="max-w-4xl mx-auto p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form Enclave */}
            <form onSubmit={handleFinalSubmit} className="max-w-4xl mx-auto">
              <div className="rounded-[2.5rem] bg-[#07090e] border border-white/15 p-6 sm:p-12 space-y-8 shadow-[0_30px_90px_rgba(0,0,0,0.95)] relative overflow-hidden">
                <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/[0.04] rounded-full blur-3xl pointer-events-none" />

                {/* =========================================================
                   STEP 1: SOVEREIGN IDENTITY & SCHOLASTIC CREDENTIALS
                   ========================================================= */}
                {currentStep === 1 && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="border-b border-white/[0.08] pb-5">
                      <div className="flex items-center gap-2.5 text-amber-400 font-mono text-xs uppercase tracking-widest mb-1">
                        <Fingerprint className="w-4 h-4" />
                        <span>STAGE 01 — DELEGATE IDENTITY RECORD</span>
                      </div>
                      <h2 
                        className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
                        style={{ fontFamily: 'Clash Display, sans-serif' }}
                      >
                        Scholastic & Personal Foundations
                      </h2>
                      <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                        Please provide your institutional affiliation for committee matrix distribution.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div className="space-y-2">
                        <label className="font-mono text-xs tracking-wider text-neutral-300 uppercase block font-semibold">
                          Full Legal Name <span className="text-amber-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Aditya Vardhan Sharma"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full px-5 py-4 rounded-2xl bg-black/80 border border-white/15 text-white placeholder-neutral-600 text-sm font-mono focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40 transition shadow-inner"
                        />
                        <span className="text-[10px] font-mono text-neutral-500">Will be printed on permanent certificate & country credentials.</span>
                      </div>

                      {/* Primary Email */}
                      <div className="space-y-2">
                        <label className="font-mono text-xs tracking-wider text-neutral-300 uppercase block font-semibold">
                          Official Email Address <span className="text-amber-400">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="aditya@university.edu or email@domain.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-5 py-4 rounded-2xl bg-black/80 border border-white/15 text-white placeholder-neutral-600 text-sm font-mono focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40 transition shadow-inner"
                        />
                        <span className="text-[10px] font-mono text-neutral-500">Used for clearance verification & chamber access keys.</span>
                      </div>

                      {/* Contact Phone */}
                      <div className="space-y-2">
                        <label className="font-mono text-xs tracking-wider text-neutral-300 uppercase block font-semibold">
                          WhatsApp / Contact Phone <span className="text-neutral-500">(Recommended)</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                          className="w-full px-5 py-4 rounded-2xl bg-black/80 border border-white/15 text-white placeholder-neutral-600 text-sm font-mono focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40 transition shadow-inner"
                        />
                        <span className="text-[10px] font-mono text-neutral-500">For urgent crisis telegrams & secretariat announcements.</span>
                      </div>

                      {/* Preferred Sovereign Handle */}
                      <div className="space-y-2">
                        <label className="font-mono text-xs tracking-wider text-neutral-300 uppercase block font-semibold">
                          Preferred Sovereign Handle <span className="text-neutral-500">(Unique @tag)</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-mono text-sm">@</span>
                          <input
                            type="text"
                            placeholder="aditya_diplomat"
                            value={formData.preferredHandle}
                            onChange={(e) => setFormData({ ...formData, preferredHandle: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                            className="w-full pl-9 pr-5 py-4 rounded-2xl bg-black/80 border border-white/15 text-white placeholder-neutral-600 text-sm font-mono focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40 transition shadow-inner"
                          />
                        </div>
                        <span className="text-[10px] font-mono text-neutral-500">Your handle inside ZEN.DOCS and bilateral chamber chats.</span>
                      </div>

                      {/* Institution / College */}
                      <div className="space-y-2">
                        <label className="font-mono text-xs tracking-wider text-neutral-300 uppercase block font-semibold">
                          College / School / Organization <span className="text-amber-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. St. Stephen's College / IIT Delhi / Heritage School"
                          value={formData.institutionOrSchool}
                          onChange={(e) => setFormData({ ...formData, institutionOrSchool: e.target.value })}
                          className="w-full px-5 py-4 rounded-2xl bg-black/80 border border-white/15 text-white placeholder-neutral-600 text-sm font-mono focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40 transition shadow-inner"
                        />
                      </div>

                      {/* Degree / Year or Grade */}
                      <div className="space-y-2">
                        <label className="font-mono text-xs tracking-wider text-neutral-300 uppercase block font-semibold">
                          Degree / Year of Study / Grade
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. B.A. Political Science (Year 2) or Grade 11"
                          value={formData.degreeOrGrade}
                          onChange={(e) => setFormData({ ...formData, degreeOrGrade: e.target.value })}
                          className="w-full px-5 py-4 rounded-2xl bg-black/80 border border-white/15 text-white placeholder-neutral-600 text-sm font-mono focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40 transition shadow-inner"
                        />
                      </div>

                      {/* Location: City & State / Country */}
                      <div className="space-y-2 sm:col-span-2">
                        <label className="font-mono text-xs tracking-wider text-neutral-300 uppercase block font-semibold">
                          Geographical Location (City, State / Country)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. New Delhi, India / London, UK / Singapore"
                          value={formData.countryCity}
                          onChange={(e) => setFormData({ ...formData, countryCity: e.target.value })}
                          className="w-full px-5 py-4 rounded-2xl bg-black/80 border border-white/15 text-white placeholder-neutral-600 text-sm font-mono focus:outline-none focus:border-amber-400/60 transition shadow-inner"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="button"
                        disabled={!isStep1Valid}
                        onClick={() => setCurrentStep(2)}
                        className="px-8 py-4 rounded-2xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.2)] cursor-pointer"
                      >
                        <span>Proceed to Chamber Selection</span>
                        <ArrowRight className="w-4 h-4 text-black" />
                      </button>
                    </div>
                  </div>
                )}

                {/* =========================================================
                   STEP 2: COMMITTEE CHAMBER PREFERENCE & DIPLOMATIC MATRIX
                   ========================================================= */}
                {currentStep === 2 && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="border-b border-white/[0.08] pb-5">
                      <div className="flex items-center gap-2.5 text-amber-400 font-mono text-xs uppercase tracking-widest mb-1">
                        <Scale className="w-4 h-4" />
                        <span>STAGE 02 — COMMITTEE PREFERENCE & DIPLOMATIC RANK</span>
                      </div>
                      <h2 
                        className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
                        style={{ fontFamily: 'Clash Display, sans-serif' }}
                      >
                        Select Your Diplomatic Chambers
                      </h2>
                      <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                        Pick your primary and secondary chamber preferences. All chambers feature live AI-augmented ROP telemetry and cryptographic resolution sealing.
                      </p>
                    </div>

                    {/* Primary Committee Selection Cards */}
                    <div className="space-y-3">
                      <label className="font-mono text-xs tracking-wider text-neutral-300 uppercase block font-semibold flex items-center justify-between">
                        <span>1. Primary Chamber Preference <span className="text-amber-400">*</span></span>
                        <span className="text-[10px] text-amber-300 font-normal">Rank 1 Allocation Weight</span>
                      </label>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {COMMITTEE_TRACKS.map((track) => {
                          const isSelected = formData.primaryCommitteePreference === track.id;
                          return (
                            <div
                              key={track.id}
                              onClick={() => setFormData({ ...formData, primaryCommitteePreference: track.id })}
                              className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                                isSelected
                                  ? 'bg-amber-500/[0.1] border-amber-400/60 shadow-[0_0_30px_rgba(251,191,36,0.15)] ring-1 ring-amber-400/40'
                                  : 'bg-black/60 border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between gap-2 mb-2">
                                  <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-mono uppercase tracking-wider font-bold ${track.badgeColor}`}>
                                    {track.abbreviation}
                                  </span>
                                  <span className="text-[10px] font-mono text-neutral-500">{track.delegateCapacity}</span>
                                </div>
                                <h3 className="text-base font-bold text-white mb-1">{track.name}</h3>
                                <p className="text-xs text-neutral-400 leading-relaxed mb-3">{track.description}</p>
                              </div>

                              <div className="pt-3 border-t border-white/[0.08] space-y-1 text-[11px] font-mono">
                                <div className="text-neutral-500">AGENDA TOPIC:</div>
                                <div className="text-amber-200/90 font-medium leading-snug">{track.agendaTopic}</div>
                                <div className="text-[10px] text-neutral-400 pt-1">Best suited for: {track.suitability}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Secondary Preference & Experience Tier */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                      {/* Secondary Preference */}
                      <div className="space-y-2">
                        <label className="font-mono text-xs tracking-wider text-neutral-300 uppercase block font-semibold">
                          2. Secondary Chamber Preference <span className="text-neutral-500">(Alternate)</span>
                        </label>
                        <select
                          value={formData.secondaryCommitteePreference}
                          onChange={(e) => setFormData({ ...formData, secondaryCommitteePreference: e.target.value })}
                          className="w-full px-5 py-4 rounded-2xl bg-black/80 border border-white/15 text-white text-sm font-mono focus:outline-none focus:border-amber-400/60 transition shadow-inner"
                        >
                          {COMMITTEE_TRACKS.map((t) => (
                            <option key={t.id} value={t.id} disabled={t.id === formData.primaryCommitteePreference}>
                              {t.name} ({t.abbreviation})
                            </option>
                          ))}
                        </select>
                        <span className="text-[10px] font-mono text-neutral-500">Fallback if primary chamber reaches max capacity.</span>
                      </div>

                      {/* Total Conferences */}
                      <div className="space-y-2">
                        <label className="font-mono text-xs tracking-wider text-neutral-300 uppercase block font-semibold">
                          Total Model UN / Parliamentary Conferences
                        </label>
                        <select
                          value={formData.totalConferencesAttended}
                          onChange={(e) => setFormData({ ...formData, totalConferencesAttended: e.target.value })}
                          className="w-full px-5 py-4 rounded-2xl bg-black/80 border border-white/15 text-white text-sm font-mono focus:outline-none focus:border-amber-400/60 transition shadow-inner"
                        >
                          <option value="0 (First Time Delegate)">0 Conferences (First-Time Delegate)</option>
                          <option value="1-2 Conferences">1–2 Conferences (Developing)</option>
                          <option value="3-5 Conferences">3–5 Conferences (Proficient)</option>
                          <option value="6-10 Conferences">6–10 Conferences (Seasoned)</option>
                          <option value="11+ Conferences">11+ Conferences (Veteran)</option>
                        </select>
                      </div>

                      {/* Experience Tier Selector */}
                      <div className="sm:col-span-2 space-y-3">
                        <label className="font-mono text-xs tracking-wider text-neutral-300 uppercase block font-semibold">
                          Self-Assessed Diplomatic Proficiency Tier <span className="text-amber-400">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {EXPERIENCE_TIERS.map((tier) => {
                            const isSelected = formData.experienceTier === tier.id;
                            return (
                              <div
                                key={tier.id}
                                onClick={() => setFormData({ ...formData, experienceTier: tier.id })}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                                  isSelected
                                    ? 'bg-amber-400/[0.08] border-amber-400/50 ring-1 ring-amber-400/30'
                                    : 'bg-black/50 border-white/10 hover:border-white/20'
                                }`}
                              >
                                <div className="text-xs font-bold text-white mb-1 flex items-center justify-between">
                                  <span>{tier.label}</span>
                                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                                </div>
                                <p className="text-[11px] font-mono text-neutral-400 leading-snug">{tier.desc}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Preferred Country Allocations */}
                      <div className="sm:col-span-2 space-y-2">
                        <label className="font-mono text-xs tracking-wider text-neutral-300 uppercase block font-semibold">
                          Country / Portfolio Preferences (Up to 3, comma-separated)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. United States, France, Republic of Korea (or Minister of Home Affairs in Lok Sabha)"
                          value={formData.preferredCountryAllocations}
                          onChange={(e) => setFormData({ ...formData, preferredCountryAllocations: e.target.value })}
                          className="w-full px-5 py-4 rounded-2xl bg-black/80 border border-white/15 text-white placeholder-neutral-600 text-sm font-mono focus:outline-none focus:border-amber-400/60 transition shadow-inner"
                        />
                      </div>

                      {/* Past Awards */}
                      <div className="sm:col-span-2 space-y-2">
                        <label className="font-mono text-xs tracking-wider text-neutral-300 uppercase block font-semibold">
                          Notable Past Accolades or Executive Board Appointments <span className="text-neutral-500">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Best Delegate (HMUN 2025), High Commendation (IITSMUN), Vice Chairperson"
                          value={formData.previousAwardsOrAccolades}
                          onChange={(e) => setFormData({ ...formData, previousAwardsOrAccolades: e.target.value })}
                          className="w-full px-5 py-4 rounded-2xl bg-black/80 border border-white/15 text-white placeholder-neutral-600 text-sm font-mono focus:outline-none focus:border-amber-400/60 transition shadow-inner"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="px-6 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-neutral-300 font-mono text-xs font-semibold transition cursor-pointer flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>

                      <button
                        type="button"
                        disabled={!isStep2Valid}
                        onClick={() => setCurrentStep(3)}
                        className="px-8 py-4 rounded-2xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.2)] cursor-pointer"
                      >
                        <span>Proceed to Platform Ambitions</span>
                        <ArrowRight className="w-4 h-4 text-black" />
                      </button>
                    </div>
                  </div>
                )}

                {/* =========================================================
                   STEP 3: PLATFORM AMBITIONS & PORTFOLIO TRACKS
                   ========================================================= */}
                {currentStep === 3 && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="border-b border-white/[0.08] pb-5">
                      <div className="flex items-center gap-2.5 text-amber-400 font-mono text-xs uppercase tracking-widest mb-1">
                        <Zap className="w-4 h-4" />
                        <span>STAGE 03 — PLATFORM TRACKS & CIVIC AMBITIONS</span>
                      </div>
                      <h2 
                        className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
                        style={{ fontFamily: 'Clash Display, sans-serif' }}
                      >
                        Tailor Your Sovereign Experience
                      </h2>
                      <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                        Select your platform engagement track, hardware setup, and whether you wish to be evaluated for our Campus Ambassador Fellowship.
                      </p>
                    </div>

                    {/* Role Designation Selector */}
                    <div className="space-y-2">
                      <label className="font-mono text-xs tracking-wider text-neutral-300 uppercase block font-semibold">
                        Primary Registration Category <span className="text-amber-400">*</span>
                      </label>
                      <select
                        value={formData.roleInterest}
                        onChange={(e) => setFormData({ ...formData, roleInterest: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-black/80 border border-white/15 text-white text-sm font-mono focus:outline-none focus:border-amber-400/60 transition shadow-inner"
                      >
                        <option value="Student Delegate / Youth Leader">Student Delegate / Youth Leader</option>
                        <option value="MUN Secretariat / Dais Member">MUN Secretariat / Dais Executive</option>
                        <option value="Press Corps / Diplomatic Journalist">International Press Corps / Investigative Journalist</option>
                        <option value="Campus Ambassador Candidate">Campus Ambassador Candidate</option>
                        <option value="Faculty Advisor / Institutional Coordinator">Faculty Advisor / Institutional Head</option>
                        <option value="Software Engineer / Open Source Contributor">Software Engineer / Protocol Contributor</option>
                      </select>
                    </div>

                    {/* Portfolio Interest Tags */}
                    <div className="space-y-3">
                      <label className="font-mono text-xs tracking-wider text-neutral-300 uppercase block font-semibold">
                        Specialized Interest Areas <span className="text-neutral-500">(Select all that apply)</span>
                      </label>
                      <div className="flex flex-wrap gap-2.5">
                        {[
                          'ZEN.DOCS Resolution Drafting',
                          'Real-Time Dais Telemetry',
                          'Diplomatic Crisis Simulation',
                          'International Law & Treaties',
                          'Youth Civic Action Grants',
                          'Campus Ambassador Fellowship',
                          'Constitutional Debating',
                          'Press Dispatches & Publications',
                          'AI-Assisted Policy Analysis'
                        ].map((tag) => {
                          const isChecked = formData.portfolioInterests.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleTogglePortfolio(tag)}
                              className={`px-3.5 py-2 rounded-xl border text-xs font-mono transition cursor-pointer flex items-center gap-1.5 ${
                                isChecked
                                  ? 'bg-amber-400/20 border-amber-400/60 text-amber-200'
                                  : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:border-white/20 hover:text-white'
                              }`}
                            >
                              <span>{isChecked ? '✓' : '+'}</span>
                              <span>{tag}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Campus Ambassador Checkbox Enclave */}
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/[0.08] via-transparent to-purple-500/[0.05] border border-amber-400/30 space-y-3">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="ambassadorCheck"
                          checked={formData.seekingCampusAmbassadorship}
                          onChange={(e) => setFormData({ ...formData, seekingCampusAmbassadorship: e.target.checked })}
                          className="mt-1 w-4 h-4 rounded border-white/20 bg-black/80 text-amber-400 focus:ring-amber-400 cursor-pointer"
                        />
                        <label htmlFor="ambassadorCheck" className="text-xs text-neutral-300 leading-relaxed cursor-pointer select-none">
                          <span className="font-bold text-amber-300 uppercase font-mono block text-[11px]">
                            Apply for the Zenvitra Campus Ambassador Fellowship
                          </span>
                          Represent Zenvitra at your school or university, curate student delegations, gain direct Secretariat liaison credentials, and receive verified leadership accolades.
                        </label>
                      </div>
                    </div>

                    {/* Brief Statement / Motivation */}
                    <div className="space-y-2">
                      <label className="font-mono text-xs tracking-wider text-neutral-300 uppercase block font-semibold">
                        Statement of Diplomatic Intent / Vision <span className="text-neutral-500">(1-2 Sentences)</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="What policy issue or sovereign ambition drives your participation in the 2026 Summit?"
                        value={formData.motivationBrief}
                        onChange={(e) => setFormData({ ...formData, motivationBrief: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-black/80 border border-white/15 text-white placeholder-neutral-600 text-sm font-mono focus:outline-none focus:border-amber-400/60 transition shadow-inner"
                      />
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="px-6 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-neutral-300 font-mono text-xs font-semibold transition cursor-pointer flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>

                      <button
                        type="button"
                        disabled={!isStep3Valid}
                        onClick={() => setCurrentStep(4)}
                        className="px-8 py-4 rounded-2xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.2)] cursor-pointer"
                      >
                        <span>Review & Sign Sovereign Accord</span>
                        <ArrowRight className="w-4 h-4 text-black" />
                      </button>
                    </div>
                  </div>
                )}

                {/* =========================================================
                   STEP 4: SOVEREIGN ACCORD, CIVIC AFFIRMATION & COMMITMENT
                   ========================================================= */}
                {currentStep === 4 && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="border-b border-white/[0.08] pb-5">
                      <div className="flex items-center gap-2.5 text-amber-400 font-mono text-xs uppercase tracking-widest mb-1">
                        <FileCheck2 className="w-4 h-4" />
                        <span>STAGE 04 — CIVIC ACCORD & REGISTRATION TRANSMISSION</span>
                      </div>
                      <h2 
                        className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
                        style={{ fontFamily: 'Clash Display, sans-serif' }}
                      >
                        Confirm Your Dossier
                      </h2>
                      <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                        Review your pre-registration credentials before cryptographic transmission to the Sovereign Ledger.
                      </p>
                    </div>

                    {/* Live Dossier Summary Box */}
                    <div className="p-6 rounded-2xl bg-black/70 border border-white/10 font-mono text-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                        <span className="text-neutral-500 uppercase">APPLICANT IDENTIFIER:</span>
                        <span className="text-amber-300 font-bold">{formData.fullName} ({candidateRefId})</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <span className="text-neutral-500">PRIMARY COMMITTEE:</span>
                          <div className="text-white font-semibold mt-0.5">{selectedPrimaryTrack.name} ({selectedPrimaryTrack.abbreviation})</div>
                        </div>
                        <div>
                          <span className="text-neutral-500">SECONDARY COMMITTEE:</span>
                          <div className="text-neutral-300 mt-0.5">
                            {COMMITTEE_TRACKS.find(c => c.id === formData.secondaryCommitteePreference)?.name}
                          </div>
                        </div>
                        <div>
                          <span className="text-neutral-500">EXPERIENCE RANK:</span>
                          <div className="text-emerald-400 font-semibold mt-0.5">{formData.experienceTier}</div>
                        </div>
                        <div>
                          <span className="text-neutral-500">CONTACT ROUTING:</span>
                          <div className="text-neutral-300 mt-0.5">{formData.email}</div>
                        </div>
                      </div>
                    </div>

                    {/* Covenants & Accords */}
                    <div className="space-y-4 pt-2">
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="termsCheck"
                          required
                          checked={formData.termsAccepted}
                          onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                          className="mt-1 w-4 h-4 rounded border-white/20 bg-black text-amber-400 focus:ring-amber-400 cursor-pointer"
                        />
                        <label htmlFor="termsCheck" className="text-xs text-neutral-300 leading-relaxed cursor-pointer select-none">
                          <span className="font-bold text-white">Adherence to Diplomatic Decorum & ROP: </span>
                          I affirm that my debate, resolution drafting, and chamber interventions will adhere to the highest standards of international diplomatic decorum and mutual respect.
                        </label>
                      </div>

                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="conductCheck"
                          required
                          checked={formData.codeOfConductAccepted}
                          onChange={(e) => setFormData({ ...formData, codeOfConductAccepted: e.target.checked })}
                          className="mt-1 w-4 h-4 rounded border-white/20 bg-black text-amber-400 focus:ring-amber-400 cursor-pointer"
                        />
                        <label htmlFor="conductCheck" className="text-xs text-neutral-300 leading-relaxed cursor-pointer select-none">
                          <span className="font-bold text-white">Research Originality & Plagiarism Covenant: </span>
                          I agree that all working papers, position papers, and resolutions introduced inside ZEN.DOCS shall be original scholarship free from unauthorized automated spamming.
                        </label>
                      </div>

                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="consentCheck"
                          required
                          checked={formData.dataProcessingConsent}
                          onChange={(e) => setFormData({ ...formData, dataProcessingConsent: e.target.checked })}
                          className="mt-1 w-4 h-4 rounded border-white/20 bg-black text-amber-400 focus:ring-amber-400 cursor-pointer"
                        />
                        <label htmlFor="consentCheck" className="text-xs text-neutral-300 leading-relaxed cursor-pointer select-none">
                          <span className="font-bold text-white">Sovereign Data Storage & Telemetry Consent: </span>
                          I consent to the ingestion of my registration metadata into the Zenvitra Sovereign Database and Google Sheets Master Ledger for the exclusive purposes of summit operations.
                        </label>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="px-6 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-neutral-300 font-mono text-xs font-semibold transition cursor-pointer flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isLoading || !isStep4Valid}
                        className="px-10 py-4 rounded-2xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.3)] cursor-pointer"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-black" />
                            <span>Synchronizing Sovereign Registry...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4 text-black" />
                            <span>Confirm & Transmit Whitelist Dossier</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </form>

            {/* Bottom Platform Credo & Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto pt-6">
              <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.08] font-mono text-xs text-neutral-400 space-y-1">
                <div className="text-white font-bold flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-amber-400" />
                  Bicameral & Multilateral
                </div>
                <p className="text-[11px] leading-relaxed text-neutral-500">
                  Simulating both global UN assemblies and sovereign national parliaments with high-fidelity procedures.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.08] font-mono text-xs text-neutral-400 space-y-1">
                <div className="text-white font-bold flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  ZEN.DOCS Drafting
                </div>
                <p className="text-[11px] leading-relaxed text-neutral-500">
                  Real-time collaborative diplomatic resolution engine with preambular clause auto-completion.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.08] font-mono text-xs text-neutral-400 space-y-1">
                <div className="text-white font-bold flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-amber-400" />
                  Permanent Verification
                </div>
                <p className="text-[11px] leading-relaxed text-neutral-500">
                  All awards, draft resolutions, and delegate credentials sealed with immutable SHA-256 signatures.
                </p>
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="pt-6 border-t border-white/[0.08] max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400">
              <div className="flex items-center gap-2">
                <span>Already registered?</span>
                <Link href="/statussignin" className="text-amber-400 hover:underline">
                  Authenticate Clearance →
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <Link href="/join-core-team" className="text-neutral-400 hover:text-white transition">
                  Apply for Core Team Leadership
                </Link>
                <span>•</span>
                <Link href="/countdown" className="text-neutral-400 hover:text-white transition">
                  Return to Launch Clock
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>ZENVITRA PRE-LAUNCH WHITELIST PORTAL &copy; 2026</span>
        </div>
        <div className="flex items-center gap-4">
          <span>PUBLIC IGNITION: SEPT 18, 5:00 PM IST</span>
          <span>•</span>
          <Link href="/countdown" className="hover:text-white transition flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to Launch Countdown
          </Link>
        </div>
      </footer>
    </div>
  );
}
