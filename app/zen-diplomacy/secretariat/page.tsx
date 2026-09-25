'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Shield,
  Crown,
  Users,
  Building,
  GraduationCap,
  Wrench,
  Cpu,
  Palette,
  Megaphone,
  TrendingUp,
  FileText,
  Camera,
  Layers,
  Clock,
  Briefcase,
  UploadCloud,
  Link as LinkIcon,
  AlertCircle,
  Check,
  Compass,
  Star,
  BookOpen,
  Calendar,
  ExternalLink,
  ChevronDown,
  Terminal,
  HelpCircle
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { sheetSync } from '@/lib/googleSheets';

export interface SectorDefinition {
  id: string;
  index: string;
  name: string;
  focus: string;
  badgeColor: string;
  icon: React.ElementType;
  responsibilities: string[];
  preferredSkills: string[];
  practicalTask: string;
  portfolioRequired: boolean;
}

const SECRETARIAT_SECTORS: SectorDefinition[] = [
  {
    id: 'delegate-affairs',
    index: '01',
    name: 'Delegate Affairs',
    focus: 'Delegate experience, portfolio allocation & communications',
    badgeColor: 'border-cyan-500/30 text-cyan-300 bg-cyan-500/10',
    icon: Users,
    responsibilities: [
      'Delegate communication & helpline',
      'Registration support & verification',
      'Portfolio allocation & preference matching',
      'Master delegate database management',
      'Attendance coordination & roll-call monitoring',
      'Delegate onboarding & orientation webinars',
      'Queries and grievance escalation',
      'Coordination with school & institutional delegations'
    ],
    preferredSkills: ['Communication', 'Organisation', 'Patience', 'Problem-solving', 'Data management', 'MUN experience'],
    practicalTask: 'Simulated assessment: Outline how you would de-escalate and resolve a frustrated delegate complaint regarding a duplicate portfolio allotment 1 hour before committee begins.',
    portfolioRequired: false,
  },
  {
    id: 'academic-affairs',
    index: '02',
    name: 'Academic Affairs',
    focus: 'Academic excellence, background guides & committee quality',
    badgeColor: 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10',
    icon: GraduationCap,
    responsibilities: [
      'Committee agenda framing & crisis briefs',
      'Background guides & research dossiers curation',
      'Study material and matrix research kits',
      'Rules of Procedure (UN4MUN & Classical RoP) oversight',
      'Portfolio research & country policy dossiers',
      'Academic coordination with Executive Board (EB)',
      'Committee preparation & procedural dry-runs',
      'Academic quality control & resolution vetting'
    ],
    preferredSkills: ['Research', 'Writing', 'Critical thinking', 'MUN knowledge', 'Political/international affairs awareness', 'Attention to detail'],
    practicalTask: 'Simulated assessment: Review and propose 2 substantive improvements or crisis inflection points for an international territorial sovereignty committee agenda.',
    portfolioRequired: false,
  },
  {
    id: 'operations-logistics',
    index: '03',
    name: 'Operations & Logistics',
    focus: 'Flawless execution, room management & technical schedules',
    badgeColor: 'border-amber-500/30 text-amber-300 bg-amber-500/10',
    icon: Building,
    responsibilities: [
      'Digital assembly rooms allocation & access keys',
      'Virtual registration desk & verification flow',
      'Session timings, movement & caucus scheduling',
      'Digital conference materials & distribution',
      'Digital certificates & credential management',
      'Signage, breakout coordination & room moderators',
      'Emergency escalation & on-ground / virtual troubleshooting'
    ],
    preferredSkills: ['Organisation', 'Time management', 'Crisis management', 'Team coordination', 'Attention to detail', 'Pressure resilience'],
    practicalTask: 'Simulated assessment: Solve a scheduling overlap where an unmoderated caucus overruns by 25 minutes while a joint crisis communique is waiting for presidential broadcast.',
    portfolioRequired: false,
  },
  {
    id: 'tech-affairs',
    index: '04',
    name: 'Tech Affairs',
    focus: 'Technology systems, digital infrastructure & platform bots',
    badgeColor: 'border-sky-500/30 text-sky-300 bg-sky-500/10',
    icon: Cpu,
    responsibilities: [
      'ZEN.DIPLOMACY web portal maintenance',
      'Real-time registration & sovereign matrix synchronization',
      'Digital attendance & QR security verification',
      'Delegate and EB interactive dashboards',
      'Live conference telemetry displays & audio visualizers',
      'Technical support for delegate mic/camera/network dropouts',
      'ZENVITRA platform ecosystem integration'
    ],
    preferredSkills: ['Web development (Next.js/React)', 'UI/UX', 'Troubleshooting', 'Basic programming / APIs', 'Database knowledge', 'Digital platform triage'],
    practicalTask: 'Simulated assessment: Describe your protocol for diagnosing and resolving a sudden socket / audio lag disconnect affecting 15 delegates in an active council chamber.',
    portfolioRequired: true,
  },
  {
    id: 'design-creative',
    index: '05',
    name: 'Design & Creative',
    focus: 'Visual identity, cinematic art direction & branding',
    badgeColor: 'border-purple-500/30 text-purple-300 bg-purple-500/10',
    icon: Palette,
    responsibilities: [
      'Official social media creatives & motion graphics',
      'Official conference posters & delegate plaques',
      'Certificates of Merit & Delegation Accords',
      'Brochures, prospectus releases & editorial layout',
      'Delegate placards, visual aids & dossiers',
      'Virtual backdrops, staging assets & presentation templates',
      'ZENVITRA sovereign brand stewardship'
    ],
    preferredSkills: ['Figma', 'Photoshop', 'Illustrator', 'Canva', 'Typography', 'Visual hierarchy', 'Branding', 'Motion design'],
    practicalTask: 'Simulated assessment: Provide a link to your design portfolio / Behance / Drive, demonstrating typographic hierarchy and dark-mode brand consistency.',
    portfolioRequired: true,
  },
  {
    id: 'public-relations',
    index: '06',
    name: 'Public Relations (PR)',
    focus: 'External partnerships, institutional outreach & media relations',
    badgeColor: 'border-rose-500/30 text-rose-300 bg-rose-500/10',
    icon: Megaphone,
    responsibilities: [
      'School and university institutional outreach',
      'Faculty advisor & MUN circuit communication',
      'Media relations & press agency releases',
      'Official diplomatic announcements & communiqués',
      'Youth alliance & partner organization relations',
      'External institutional correspondence',
      'Press conference briefing coordination'
    ],
    preferredSkills: ['Communication', 'Public speaking', 'Networking', 'Professional writing', 'Negotiation', 'Relationship management', 'Crisis communication'],
    practicalTask: 'Simulated assessment: Draft a 3-paragraph executive outreach invitation to a premier school’s MUN Faculty Advisor pitching a 15-delegate school delegation.',
    portfolioRequired: false,
  },
  {
    id: 'marketing-growth',
    index: '07',
    name: 'Marketing & Growth',
    focus: 'Reach, delegate acquisition & community engagement',
    badgeColor: 'border-lime-500/30 text-lime-300 bg-lime-500/10',
    icon: TrendingUp,
    responsibilities: [
      'Multi-channel social media growth strategy',
      'Targeted delegate acquisition campaigns',
      'Editorial content calendars & announcement pacing',
      'Instagram, LinkedIn & youth forum audience growth',
      'Campus ambassador & referral network leadership',
      'Campaign analytics, conversion telemetry & reporting'
    ],
    preferredSkills: ['Digital marketing', 'Social media strategy', 'Content strategy', 'Audience growth', 'Analytics', 'Copywriting', 'Campaign planning'],
    practicalTask: 'Simulated assessment: Outline a 7-day countdown growth campaign plan designed to drive 50+ delegate registrations from October 1st onwards.',
    portfolioRequired: false,
  },
  {
    id: 'content-editorial',
    index: '08',
    name: 'Content & Editorial',
    focus: 'Written publications, conference gazette & journalism',
    badgeColor: 'border-yellow-500/30 text-yellow-300 bg-yellow-500/10',
    icon: FileText,
    responsibilities: [
      'Compelling social captions & long-form articles',
      'Official press releases & executive communiqués',
      'Daily conference reports & committee documentation',
      'Interviews with Chairs, Guest Speakers & Notable Delegates',
      'Post-conference summary journal & resolution compilations'
    ],
    preferredSkills: ['Writing', 'Editing', 'Storytelling', 'Research', 'Journalism', 'Copywriting', 'Grammar & Tone', 'Attention to detail'],
    practicalTask: 'Simulated assessment: Write a high-impact 120-word press announcement covering a dramatic deadlock break during UNSC midnight negotiations.',
    portfolioRequired: false,
  },
  {
    id: 'media-documentation',
    index: '09',
    name: 'Media & Documentation',
    focus: 'Capturing the event: reels, interviews & video archive',
    badgeColor: 'border-indigo-500/30 text-indigo-300 bg-indigo-500/10',
    icon: Camera,
    responsibilities: [
      'Video editing, reels & cinematic teasers',
      'Live photo capture, screenshot curation & audio logs',
      'Delegate and Executive Board spotlight interviews',
      'Behind-the-scenes Secretariat coverage',
      'Official post-conference recap documentary film',
      'Digital media archive categorization on ZENVITRA'
    ],
    preferredSkills: ['Premiere Pro / DaVinci / CapCut', 'Videography', 'Video editing', 'Composition', 'Visual storytelling', 'Rapid turnaround'],
    practicalTask: 'Simulated assessment: Provide a link to your video reel or showreel, showing rhythm, audio synchronization, and color grading.',
    portfolioRequired: true,
  },
  {
    id: 'secretariat-admin',
    index: '10',
    name: 'Secretariat & Administration',
    focus: 'Internal coordination, cross-department leadership & operations',
    badgeColor: 'border-white/30 text-white bg-white/10',
    icon: Crown,
    responsibilities: [
      'Cross-departmental project tracking & meeting agendas',
      'Secretariat task allocation & accountability oversight',
      'Internal documentation & master timetable enforcement',
      'Crisis escalation & inter-departmental conflict resolution',
      'Executive coordination with Founder and General Assembly'
    ],
    preferredSkills: ['Leadership', 'Organisation', 'Communication', 'Delegation', 'Decision-making', 'Accountability', 'Time management'],
    practicalTask: 'Simulated assessment: How would you maintain morale and performance across two Secretariat departments facing conflicting deadlines 48 hours before the conference?',
    portfolioRequired: false,
  }
];

export default function SecretariatPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedSectorId, setSelectedSectorId] = useState<string>('delegate-affairs');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    institution: '',
    gradeOrYear: '',
    cityCountry: '',
    preferredSector: 'delegate-affairs',
    secondarySector: 'academic-affairs',
    priorMunExperience: '',
    numberOfMunsAttended: '3–5 MUNs',
    priorOrganizingExperience: '',
    weeklyBandwidth: '10–15 hours / week',
    availabilityOct2425: true,
    statementOfPurpose: '',
    practicalTaskResponse: '',
    portfolioUrl: '',
    linkedinOrResumeUrl: '',
    discordHandle: '',
    sovereignAccordAccepted: false
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const selectedSector = useMemo(() => {
    return SECRETARIAT_SECTORS.find((s) => s.id === selectedSectorId) || SECRETARIAT_SECTORS[0];
  }, [selectedSectorId]);

  // Validation
  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  const validatePhone = (val: string) => {
    const clean = val.replace(/[\s\-\(\)\+]/g, '');
    return clean.length >= 8 && /^\d+$/.test(clean);
  };

  const isStep2Valid = useMemo(() => {
    return (
      formData.fullName.trim().length >= 3 &&
      validateEmail(formData.email) &&
      validatePhone(formData.phoneNumber) &&
      formData.institution.trim().length >= 3 &&
      formData.cityCountry.trim().length >= 2
    );
  }, [formData]);

  const isStep3Valid = useMemo(() => {
    return (
      formData.statementOfPurpose.trim().length >= 30 &&
      formData.practicalTaskResponse.trim().length >= 30 &&
      (!selectedSector.portfolioRequired || formData.portfolioUrl.trim().length >= 5)
    );
  }, [formData, selectedSector]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sovereignAccordAccepted) {
      setSubmitError('You must confirm the Secretariat Code of Conduct and Accountability Accord.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const submissionPayload = {
      ...formData,
      sectorName: selectedSector.name,
      submittedAt: new Date().toISOString(),
      ticketId: `SEC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    };

    try {
      // 1. Local backup
      if (typeof window !== 'undefined') {
        const existing = JSON.parse(localStorage.getItem('zen_secretariat_applications') || '[]');
        existing.push(submissionPayload);
        localStorage.setItem('zen_secretariat_applications', JSON.stringify(existing));
      }

      // 2. Google Sheets sync
      await sheetSync.coreTeam({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        roleAppliedFor: selectedSector.name,
        department: `Secretariat: ${selectedSector.name}`,
        portfolioUrl: formData.portfolioUrl || formData.linkedinOrResumeUrl,
        weeklyBandwidth: formData.weeklyBandwidth,
        motivationStatement: `[SOP]: ${formData.statementOfPurpose} \n[PRACTICAL]: ${formData.practicalTaskResponse} \n[INSTITUTION]: ${formData.institution}`,
        constitutionalAccord: formData.sovereignAccordAccepted ? 'ACCEPTED' : 'PENDING',
        handle: formData.discordHandle || formData.fullName.toLowerCase().replace(/\s+/g, '_'),
        applicationStatus: 'PENDING_REVIEW'
      });

      setIsSuccess(true);
    } catch (err: any) {
      console.warn('Sheets sync error, fallback to local confirmation:', err);
      // Still consider success if locally saved
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030407] text-neutral-100 font-sans selection:bg-[#e2f952]/30 flex flex-col justify-between pt-20 sm:pt-24">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
        {/* ── TOP HERO HEADER ── */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 p-8 sm:p-12 bg-gradient-to-b from-[#0a0f1d] via-[#05070e] to-black shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#e2f952]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-3">
                <Link
                  href="/zen-diplomacy"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-neutral-300 font-mono transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to MUN Portal</span>
                </Link>
                <span className="px-3 py-1 rounded-full bg-[#e2f952]/15 text-[#e2f952] border border-[#e2f952]/30 text-xs font-mono font-bold uppercase tracking-wider">
                  SECRETARIAT CORPS 2026
                </span>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src="/assets/logo.png"
                  alt="ZENVITRA Logo"
                  className="w-12 h-12 object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] shrink-0"
                />
                <div>
                  <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white uppercase leading-none">
                    JOIN THE <span className="text-[#e2f952]">SECRETARIAT</span>
                  </h1>
                  <p className="text-neutral-400 font-mono text-xs sm:text-sm mt-1 uppercase tracking-wider">
                    ZEN.DIPLOMACY MUN 2026 // 24–25 OCTOBER 2026
                  </p>
                </div>
              </div>

              <p className="text-neutral-300 font-light text-sm sm:text-base leading-relaxed">
                “Delegate is where you represent. Secretariat is where you create.” We are selecting dedicated young leaders across 10 core operational sectors to build, govern, and execute India’s sovereign online Model United Nations.
              </p>
            </div>

            {/* Official Seal Medallion */}
            <div className="flex flex-col items-center md:items-end justify-center shrink-0">
              <div className="relative p-2 rounded-full border border-white/15 bg-black/60 shadow-[0_0_30px_rgba(226,249,82,0.15)]">
                <img
                  src="/assets/brochure/zenvitra-seal.png"
                  alt="ZENVITRA Seal"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover"
                />
              </div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mt-2">
                OFFICIAL APPOINTMENT PORTAL
              </span>
            </div>
          </div>

          {/* Stepper Progress Navigation */}
          {!isSuccess && (
            <div className="mt-10 pt-6 border-t border-white/10 grid grid-cols-4 gap-2 sm:gap-4">
              {[
                { step: 1, label: '01 / Sector Selection' },
                { step: 2, label: '02 / Candidate Dossier' },
                { step: 3, label: '03 / Practical Assessment' },
                { step: 4, label: '04 / Sovereign Accord' },
              ].map((s) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => {
                    if (s.step === 1) setCurrentStep(1);
                    if (s.step === 2 && currentStep >= 1) setCurrentStep(2);
                    if (s.step === 3 && isStep2Valid) setCurrentStep(3);
                    if (s.step === 4 && isStep2Valid && isStep3Valid) setCurrentStep(4);
                  }}
                  className={`text-left p-2.5 sm:p-3 rounded-xl border transition-all ${
                    currentStep === s.step
                      ? 'bg-white/10 border-[#e2f952] text-white shadow-[0_0_15px_rgba(226,249,82,0.2)]'
                      : currentStep > s.step
                      ? 'bg-white/5 border-emerald-500/40 text-emerald-400'
                      : 'bg-black/30 border-white/5 text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase tracking-wider">Step {s.step}</div>
                  <div className="font-bold text-xs sm:text-sm truncate">{s.label}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── SUCCESS STATE SCREEN ── */}
        {isSuccess ? (
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/20 p-8 sm:p-14 text-center space-y-6 backdrop-blur-xl">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono uppercase tracking-widest font-bold">
                APPLICATION RECORDED // DOSSIER ACTIVE
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-display text-white">
                SECRETARIAT CANDIDACY SUBMITTED
              </h2>
              <p className="text-neutral-300 text-sm leading-relaxed">
                Thank you, <strong className="text-white">{formData.fullName}</strong>. Your application for{' '}
                <strong className="text-[#e2f952]">{selectedSector.name}</strong> has been indexed in the ZENVITRA Secretariat recruitment registry.
              </p>
            </div>

            <div className="bg-black/60 border border-white/10 rounded-2xl p-6 max-w-md mx-auto text-left font-mono text-xs space-y-2.5 text-neutral-300">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-neutral-500">Applicant:</span>
                <span className="text-white font-bold">{formData.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-neutral-500">Primary Sector:</span>
                <span className="text-[#e2f952]">{selectedSector.name}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-neutral-500">Bandwidth:</span>
                <span className="text-white">{formData.weeklyBandwidth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Next Stage:</span>
                <span className="text-cyan-400 font-bold">Review &amp; Executive Interview</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/zen-diplomacy"
                className="px-6 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-wider transition"
              >
                Return to MUN Assembly
              </Link>
              <Link
                href="/zen-diplomacy/brochure"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-bold text-xs uppercase tracking-wider transition"
              >
                View Master Brochure
              </Link>
            </div>
          </div>
        ) : (
          /* ── APPLICATION WIZARD ── */
          <div className="space-y-8">
            {/* ════ STEP 1: SECTOR SELECTION ════ */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs font-mono text-[#e2f952] uppercase tracking-wider font-bold">
                      STEP 01 OF 04 // APPOINTMENT PATHWAYS
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black font-display text-white uppercase mt-1">
                      Select Your Secretariat Sector
                    </h2>
                    <p className="text-neutral-400 text-sm mt-1">
                      Choose the department where your leadership, analytical skill, or creative energy will have the highest impact.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-neutral-400">
                    10 Dedicated Departments Available
                  </span>
                </div>

                {/* Sectors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SECRETARIAT_SECTORS.map((sector) => {
                    const Icon = sector.icon;
                    const isSelected = selectedSectorId === sector.id;

                    return (
                      <div
                        key={sector.id}
                        onClick={() => {
                          setSelectedSectorId(sector.id);
                          setFormData((prev) => ({ ...prev, preferredSector: sector.id }));
                        }}
                        className={`group relative p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0f172a] border-[#e2f952] shadow-[0_0_30px_rgba(226,249,82,0.15)] ring-1 ring-[#e2f952]'
                            : 'bg-[#060911]/80 hover:bg-[#0c1222] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${sector.badgeColor}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                                SECTOR {sector.index}
                              </span>
                              <h3 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-[#e2f952] transition-colors">
                                {sector.name}
                              </h3>
                            </div>
                          </div>
                          {isSelected && (
                            <span className="w-6 h-6 rounded-full bg-[#e2f952] text-black flex items-center justify-center font-bold text-xs shadow-md">
                              ✓
                            </span>
                          )}
                        </div>

                        <p className="text-neutral-300 text-xs mt-3 leading-relaxed">
                          {sector.focus}
                        </p>

                        <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                            Key Responsibilities:
                          </div>
                          <ul className="text-[11px] text-neutral-300 space-y-1 list-disc list-inside">
                            {sector.responsibilities.slice(0, 3).map((r, i) => (
                              <li key={i} className="truncate">{r}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {sector.preferredSkills.slice(0, 4).map((skill, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-400"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-8 py-3.5 rounded-xl bg-[#e2f952] hover:bg-white text-black font-display font-bold text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(226,249,82,0.4)] flex items-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Candidate Dossier</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ════ STEP 2: CANDIDATE DOSSIER ════ */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs font-mono text-[#e2f952] uppercase tracking-wider font-bold">
                      STEP 02 OF 04 // CANDIDATE DETAILS
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black font-display text-white uppercase mt-1">
                      Candidate Dossier &amp; Experience
                    </h2>
                    <p className="text-neutral-400 text-sm mt-1">
                      Applied Sector: <strong className="text-white">{selectedSector.name}</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1 transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Change Sector
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-[#0a0e1a]/80 p-6 sm:p-8 rounded-2xl border border-white/10">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                      Full Legal Name <span className="text-[#e2f952]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aryan Sharma"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 focus:border-[#e2f952] text-white text-sm outline-none transition"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                      Primary Email Address <span className="text-[#e2f952]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. aryan@school.edu.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 focus:border-[#e2f952] text-white text-sm outline-none transition"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                      WhatsApp Contact Number <span className="text-[#e2f952]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 focus:border-[#e2f952] text-white text-sm outline-none transition"
                    />
                  </div>

                  {/* Discord Handle */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                      Discord / Telegram Handle
                    </label>
                    <input
                      type="text"
                      placeholder="username#0000 or @handle"
                      value={formData.discordHandle}
                      onChange={(e) => setFormData({ ...formData, discordHandle: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 focus:border-[#e2f952] text-white text-sm outline-none transition"
                    />
                  </div>

                  {/* Institution */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                      School / College / University <span className="text-[#e2f952]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Modern School, Barakhamba / Delhi University"
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 focus:border-[#e2f952] text-white text-sm outline-none transition"
                    />
                  </div>

                  {/* City, State & Country */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                      City &amp; Country <span className="text-[#e2f952]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. New Delhi, India"
                      value={formData.cityCountry}
                      onChange={(e) => setFormData({ ...formData, cityCountry: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 focus:border-[#e2f952] text-white text-sm outline-none transition"
                    />
                  </div>

                  {/* Prior MUNs attended */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                      Prior MUNs Experience
                    </label>
                    <select
                      value={formData.numberOfMunsAttended}
                      onChange={(e) => setFormData({ ...formData, numberOfMunsAttended: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 focus:border-[#e2f952] text-white text-sm outline-none transition"
                    >
                      <option value="First-time applicant (0 MUNs)">First-time applicant (0 MUNs)</option>
                      <option value="1–2 MUNs (Beginner)">1–2 MUNs (Beginner)</option>
                      <option value="3–5 MUNs (Intermediate)">3–5 MUNs (Intermediate)</option>
                      <option value="6–10 MUNs (Experienced)">6–10 MUNs (Experienced)</option>
                      <option value="10+ MUNs (Veteran / Prior EB)">10+ MUNs (Veteran / Prior EB)</option>
                    </select>
                  </div>

                  {/* Weekly Bandwidth */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                      Weekly Time Commitment (Pre-Conference)
                    </label>
                    <select
                      value={formData.weeklyBandwidth}
                      onChange={(e) => setFormData({ ...formData, weeklyBandwidth: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 focus:border-[#e2f952] text-white text-sm outline-none transition"
                    >
                      <option value="5–10 hours / week">5–10 hours / week (Standard)</option>
                      <option value="10–15 hours / week">10–15 hours / week (Recommended)</option>
                      <option value="15–25 hours / week">15–25 hours / week (High Commitment)</option>
                      <option value="25+ hours / week (Leadership)">25+ hours / week (Leadership / USG Tier)</option>
                    </select>
                  </div>
                </div>

                {/* Prior Experience Text */}
                <div className="space-y-1.5 bg-[#0a0e1a]/80 p-6 rounded-2xl border border-white/10">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                    Brief Summary of Prior Organizing / Event / Leadership Track Record
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about conferences, school clubs, hackathons, or initiatives you have managed or helped organize..."
                    value={formData.priorOrganizingExperience}
                    onChange={(e) => setFormData({ ...formData, priorOrganizingExperience: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 focus:border-[#e2f952] text-white text-sm outline-none transition"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-mono text-xs uppercase tracking-wider transition"
                  >
                    ← Back to Sectors
                  </button>

                  <button
                    type="button"
                    disabled={!isStep2Valid}
                    onClick={() => setCurrentStep(3)}
                    className="px-8 py-3.5 rounded-xl bg-[#e2f952] hover:bg-white text-black font-display font-bold text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(226,249,82,0.4)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Practical Assessment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ════ STEP 3: PRACTICAL ASSESSMENT ════ */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs font-mono text-[#e2f952] uppercase tracking-wider font-bold">
                      STEP 03 OF 04 // SITUATIONAL EVALUATION
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black font-display text-white uppercase mt-1">
                      Department Assessment &amp; Intent
                    </h2>
                    <p className="text-neutral-400 text-sm mt-1">
                      Department: <strong className="text-[#e2f952]">{selectedSector.name}</strong>
                    </p>
                  </div>
                  <span className="text-xs font-mono text-neutral-400">
                    Quality of thought over length
                  </span>
                </div>

                {/* Practical Scenario Prompt Card */}
                <div className="p-6 rounded-2xl border border-white/15 bg-gradient-to-r from-black/80 to-[#0e1628] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#e2f952] uppercase font-bold tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    Department Practical Prompt:
                  </div>
                  <p className="text-white font-medium text-sm sm:text-base leading-relaxed">
                    {selectedSector.practicalTask}
                  </p>
                </div>

                {/* Practical Task Response */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                    Your Practical Resolution / Concept <span className="text-[#e2f952]">*</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Demonstrate ownership, structure, and practical execution..."
                    value={formData.practicalTaskResponse}
                    onChange={(e) => setFormData({ ...formData, practicalTaskResponse: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 focus:border-[#e2f952] text-white text-sm outline-none transition"
                  />
                  <div className="text-[11px] font-mono text-neutral-500">
                    Minimum 30 characters ({formData.practicalTaskResponse.length} characters entered).
                  </div>
                </div>

                {/* Statement of Purpose */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                    Why do you want to join the ZEN.DIPLOMACY Secretariat? <span className="text-[#e2f952]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="What drives you to contribute to this conference? What standard of accountability will you bring to the Secretariat table?"
                    value={formData.statementOfPurpose}
                    onChange={(e) => setFormData({ ...formData, statementOfPurpose: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 focus:border-[#e2f952] text-white text-sm outline-none transition"
                  />
                </div>

                {/* Portfolio / Link Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                      Portfolio / Work Samples / Google Drive Link {selectedSector.portfolioRequired && <span className="text-[#e2f952]">*</span>}
                    </label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/... or https://behance.net/..."
                      value={formData.portfolioUrl}
                      onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 focus:border-[#e2f952] text-white text-sm outline-none transition"
                    />
                    {selectedSector.portfolioRequired && (
                      <span className="text-[11px] font-mono text-[#e2f952]">
                        Mandatory for {selectedSector.name} candidates.
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                      LinkedIn / Resume URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={formData.linkedinOrResumeUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinOrResumeUrl: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 focus:border-[#e2f952] text-white text-sm outline-none transition"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-mono text-xs uppercase tracking-wider transition"
                  >
                    ← Back to Dossier
                  </button>

                  <button
                    type="button"
                    disabled={!isStep3Valid}
                    onClick={() => setCurrentStep(4)}
                    className="px-8 py-3.5 rounded-xl bg-[#e2f952] hover:bg-white text-black font-display font-bold text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(226,249,82,0.4)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Sovereign Accord</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ════ STEP 4: SOVEREIGN ACCORD & SUBMIT ════ */}
            {currentStep === 4 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs font-mono text-[#e2f952] uppercase tracking-wider font-bold">
                      STEP 04 OF 04 // FINAL VERIFICATION
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black font-display text-white uppercase mt-1">
                      Secretariat Charter &amp; Accord
                    </h2>
                    <p className="text-neutral-400 text-sm mt-1">
                      Read and ratify the standard of accountability before final submission.
                    </p>
                  </div>
                </div>

                {/* Charter Summary Accordion */}
                <div className="rounded-2xl border border-white/15 bg-black/80 p-6 sm:p-8 space-y-5 text-sm">
                  <h3 className="text-base font-bold font-display uppercase tracking-wider text-[#e2f952] flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#e2f952]" />
                    The Standard of ZEN.DIPLOMACY
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs text-neutral-300">
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                      <strong className="text-white block mb-1">OWNERSHIP &amp; RELIABILITY</strong>
                      You don’t wait to be told every single step. If you commit to a deadline, you deliver it.
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                      <strong className="text-white block mb-1">PROFESSIONALISM &amp; CONFIDENTIALITY</strong>
                      You represent ZEN.DIPLOMACY in every interaction. Secretariat proceedings remain strictly confidential.
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                      <strong className="text-white block mb-1">CROSS-DEPARTMENT SYNERGY</strong>
                      Departments work collaboratively. We solve problems rapidly without blame or bureaucratic delay.
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                      <strong className="text-white block mb-1">CONFERENCE AVAILABILITY</strong>
                      Commitment to be actively on-duty during pre-conference preparations and across both days: 24–25 October 2026.
                    </div>
                  </div>

                  <p className="italic text-neutral-400 text-xs border-t border-white/10 pt-4">
                    “If this responsibility is given to me, can the Secretariat trust me to get it done?”
                  </p>

                  <label className="flex items-start gap-3 pt-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      required
                      checked={formData.sovereignAccordAccepted}
                      onChange={(e) => setFormData({ ...formData, sovereignAccordAccepted: e.target.checked })}
                      className="mt-1 w-5 h-5 rounded border-white/20 bg-black text-[#e2f952] focus:ring-[#e2f952]"
                    />
                    <span className="text-xs text-neutral-200">
                      I solemnly affirm that all submitted information is accurate, and I commit to upholding the Secretariat Charter, accountability code, and conference schedule of ZEN.DIPLOMACY 2026.
                    </span>
                  </label>
                </div>

                {submitError && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-mono text-xs uppercase tracking-wider transition"
                  >
                    ← Back to Assessment
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.sovereignAccordAccepted}
                    className="px-10 py-4 rounded-2xl bg-[#e2f952] hover:bg-white text-black font-display font-black text-sm uppercase tracking-wider transition shadow-[0_0_35px_rgba(226,249,82,0.5)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Submitting Candidacy...</span>
                      </>
                    ) : (
                      <>
                        <Crown className="w-4 h-4" />
                        <span>Submit Secretariat Candidacy</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
