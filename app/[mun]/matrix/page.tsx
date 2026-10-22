'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Building2,
  Clock,
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  Plus,
  Share2,
  Download,
  ShieldCheck,
  UserCheck,
  ChevronDown,
  Award,
  Globe2,
  Lock,
  ExternalLink,
  Users,
  Filter,
  CreditCard,
  Ticket,
  IndianRupee
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useMun } from '@/context/MunContext';
import { computeConferenceStatus } from '@/lib/conferenceStatusHelper';
import { 
  MatrixPortfolioItem, 
  generatePortfoliosForCommittee, 
  OFFICIAL_240_PORTFOLIOS 
} from '@/lib/matrixPortfoliosData';
import { MunCommittee } from '@/types/mun';
import { RegistrationPlan } from '@/types/events';
import { CreateMunConferenceModal } from '@/components/mun/CreateMunConferenceModal';
import { EventPlansPaymentLinksModal } from '@/components/payments/EventPlansPaymentLinksModal';
import { ZenPassBookingModal } from '@/components/events/ZenPassBookingModal';
import { useAuth } from '@/context/AuthContext';
import { isFounder, isAdmin } from '@/lib/founderControl';

export default function DynamicMunMatrixPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryEvent = searchParams?.get('event') || searchParams?.get('conf') || '';

  const rawMunSlug = Array.isArray(params?.mun) ? params.mun[0] : (params?.mun as string) || '';
  const rawCommitteeSlug = Array.isArray(params?.committee) ? params.committee[0] : (params?.committee as string) || '';
  const munSlug = decodeURIComponent(rawMunSlug).toLowerCase().trim();
  const committeeSlug = decodeURIComponent(rawCommitteeSlug).toLowerCase().trim();
  const effectiveSlug = (queryEvent || (munSlug !== 'matrix' ? munSlug : '')).toLowerCase().trim();

  const {
    conferences,
    activeConference,
    setActiveConferenceId,
    committees,
    activeCommitteeId,
    setActiveCommitteeId,
    updateConferenceMatrix,
    updateConference,
    addCustomCommittee
  } = useMun();

  const { user, profile } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [isCopied, setIsCopied] = useState(false);
  const [showAddCommInline, setShowAddCommInline] = useState(false);
  const [newCommitteeName, setNewCommitteeName] = useState('');

  // Modal to allocate or claim a seat
  const [selectedPortfolioForAction, setSelectedPortfolioForAction] = useState<MatrixPortfolioItem | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantInstitution, setApplicantInstitution] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Match conference by ID or slug
  const matchedConference = useMemo(() => {
    if (!effectiveSlug) return activeConference;
    return (
      conferences.find((c) => c.id.toLowerCase() === effectiveSlug || c.slug?.toLowerCase() === effectiveSlug) ||
      conferences.find((c) => c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') === effectiveSlug) ||
      activeConference
    );
  }, [effectiveSlug, conferences, activeConference]);

  // Sync active conference in context if needed
  useEffect(() => {
    if (matchedConference && matchedConference.id !== activeConference?.id) {
      setActiveConferenceId(matchedConference.id);
    }
  }, [matchedConference, activeConference?.id, setActiveConferenceId]);

  // Compute live conference status dynamically from dates
  const statusInfo = computeConferenceStatus(matchedConference);

  // Convert conference to event shape for ZenPassBookingModal
  const conferenceEventForBooking = useMemo(() => {
    if (!matchedConference) return null;
    return {
      id: matchedConference.id,
      slug: matchedConference.slug || matchedConference.id,
      title: matchedConference.name,
      description: matchedConference.tagline || 'Sovereign Youth Diplomacy & Committee Plenary',
      coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      type: 'hybrid' as const,
      category: 'MUN' as const,
      status: 'upcoming' as const,
      date: matchedConference.startDate,
      endDate: matchedConference.endDate,
      time: '09:00 - 18:00 IST',
      location: matchedConference.location || 'Live Matrix',
      city: 'New Delhi',
      organizerId: 'secretariat',
      organizerName: matchedConference.secretariatChair || 'Secretariat',
      organizerUsername: 'secretariat',
      createdAt: new Date().toISOString(),
      ticketPrice: matchedConference.ticketPrice || 0,
      plans: matchedConference.plans || [],
      attendees: [],
      tags: ['mun', 'diplomacy', 'matrix']
    };
  }, [matchedConference]);

  // Determine hosted committees for this conference
  const hostedCommittees = useMemo<MunCommittee[]>(() => {
    if (matchedConference?.committees && matchedConference.committees.length > 0) {
      return matchedConference.committees.map((comm) => {
        if (typeof comm === 'string') {
          return (
            committees.find((c) => c.id === comm || c.shortName === comm) || {
              id: comm,
              eventId: matchedConference.id,
              name: comm.toUpperCase(),
              shortName: comm.toUpperCase(),
              agenda: 'General Deliberations',
              type: 'UNSC' as const,
              totalDelegates: 15,
              presentCount: 0,
              presentAndVotingCount: 0,
              quorumNeeded: 9,
              dais: { chair: 'Presiding Officer', viceChair: 'Rapporteur' },
            }
          );
        }
        return comm as MunCommittee;
      });
    }
    return committees;
  }, [matchedConference, committees]);

  // Selected active committee on this matrix page
  const [selectedCommitteeCode, setSelectedCommitteeCode] = useState<string>(() => {
    if (committeeSlug) {
      const match = hostedCommittees.find(
        (c) =>
          c.shortName?.toLowerCase() === committeeSlug ||
          c.id?.toLowerCase() === committeeSlug ||
          c.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === committeeSlug
      );
      if (match) return match.id || match.shortName;
    }
    return hostedCommittees[0]?.id || hostedCommittees[0]?.shortName || 'UNSC';
  });

  useEffect(() => {
    if (committeeSlug && hostedCommittees.length > 0) {
      const match = hostedCommittees.find(
        (c) =>
          c.shortName?.toLowerCase() === committeeSlug ||
          c.id?.toLowerCase() === committeeSlug ||
          c.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === committeeSlug
      );
      if (match && match.id !== selectedCommitteeCode && match.shortName !== selectedCommitteeCode) {
        setSelectedCommitteeCode(match.id || match.shortName);
      }
    } else if (hostedCommittees.length > 0 && !hostedCommittees.some((c) => c.id === selectedCommitteeCode || c.shortName === selectedCommitteeCode)) {
      setSelectedCommitteeCode(hostedCommittees[0].id || hostedCommittees[0].shortName || 'UNSC');
    }
  }, [committeeSlug, hostedCommittees, selectedCommitteeCode]);

  // Route redirect for /matrix/matrix or /[mun]/matrix without committee
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/matrix/matrix') {
        router.replace('/mun/matrix');
        return;
      }
      if (!committeeSlug && effectiveSlug && effectiveSlug !== 'matrix' && hostedCommittees.length > 0) {
        const rawCode = hostedCommittees[0]?.shortName || hostedCommittees[0]?.id || 'unsc';
        const commCode = encodeURIComponent(rawCode.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'unsc');
        router.replace(`/${effectiveSlug}/${commCode}/matrix`);
      }
    }
  }, [router, effectiveSlug, hostedCommittees, committeeSlug]);

  const currentCommitteeObj = useMemo(() => {
    return (
      hostedCommittees.find((c) => c.id === selectedCommitteeCode || c.shortName === selectedCommitteeCode) ||
      hostedCommittees[0]
    );
  }, [hostedCommittees, selectedCommitteeCode]);

  // Portfolios for current committee
  const currentCommitteePortfolios = useMemo<MatrixPortfolioItem[]>(() => {
    if (!currentCommitteeObj && hostedCommittees.length === 0) {
      return [];
    }

    const confId = matchedConference?.id || munSlug || 'default';
    const commCode = currentCommitteeObj?.shortName || currentCommitteeObj?.id || selectedCommitteeCode;
    const commName = currentCommitteeObj?.name || selectedCommitteeCode;
    const commType = (currentCommitteeObj?.type as string) || 'UNSC';

    // 1. Check if conference already has saved customized matrix in context
    if (matchedConference?.portfolios && matchedConference.portfolios.length > 0) {
      const filtered = (matchedConference.portfolios as MatrixPortfolioItem[]).filter(
        (p: MatrixPortfolioItem) => p.committee.toLowerCase() === commCode.toLowerCase() || p.committee.toLowerCase() === commName.toLowerCase()
      );
      if (filtered.length > 0) return filtered;
    }

    // 2. Check canonical 240 dataset
    const canonicalMatch = OFFICIAL_240_PORTFOLIOS.filter(
      (p) => p.committee.toLowerCase() === commCode.toLowerCase() || p.committee.toLowerCase() === commName.toLowerCase()
    );
    if (canonicalMatch.length > 0) {
      return canonicalMatch.map((p) => ({ ...p, conferenceId: confId }));
    }

    // 3. Dynamically generate clean template portfolios based on committee type
    return generatePortfoliosForCommittee(commCode, commName, commType, confId);
  }, [matchedConference, munSlug, currentCommitteeObj, selectedCommitteeCode, hostedCommittees]);

  // Local state for interactive allocations on this page
  const [matrixList, setMatrixList] = useState<MatrixPortfolioItem[]>(currentCommitteePortfolios);

  useEffect(() => {
    setMatrixList(currentCommitteePortfolios);
  }, [currentCommitteePortfolios]);

  const handleAddInlineCommittee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommitteeName.trim()) return;

    const cleanTitle = newCommitteeName.trim();
    const shortCode = cleanTitle
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 8) || 'COMM';

    const newComm = addCustomCommittee({
      name: cleanTitle,
      shortName: shortCode,
      agenda: 'Floor Deliberations & Working Papers',
      type: 'UNSC',
    });

    if (matchedConference) {
      const existing = matchedConference.committees || [];
      updateConference(matchedConference.id, {
        committees: [...existing, newComm.id],
      });
    }

    setSelectedCommitteeCode(newComm.id);
    setNewCommitteeName('');
    setShowAddCommInline(false);
  };

  // Filtered portfolios based on search and status
  const filteredPortfolios = useMemo(() => {
    return matrixList.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.subTitle && item.subTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.allocatedTo && item.allocatedTo.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        selectedStatusFilter === 'ALL' ||
        (selectedStatusFilter === 'Vacant' && item.status === 'Vacant') ||
        (selectedStatusFilter === 'Allocated' && item.status === 'Allocated') ||
        (selectedStatusFilter === 'Reserved' && (item.status === 'Reserved' || item.status.includes('waiting')));

      const matchesCategory =
        selectedCategoryFilter === 'ALL' || item.category === selectedCategoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [matrixList, searchQuery, selectedStatusFilter, selectedCategoryFilter]);

  // Unique categories for filtering
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    matrixList.forEach((item) => {
      if (item.category) cats.add(item.category);
    });
    return Array.from(cats);
  }, [matrixList]);

  // Metrics
  const totalSeats = matrixList.length;
  const vacantSeats = matrixList.filter((p) => p.status === 'Vacant').length;
  const allocatedSeats = totalSeats - vacantSeats;
  const allocationRate = totalSeats > 0 ? Math.round((allocatedSeats / totalSeats) * 100) : 0;

  const isOrganizer = useMemo(() => {
    const cleanUsername = (profile?.username || user?.username || '').replace(/^@/, '').toLowerCase();
    const cleanEmail = (profile?.email || user?.email || '').toLowerCase();
    return (
      cleanUsername === 'yuveer' ||
      cleanEmail === 'founder@zenvitra.xyz' ||
      cleanEmail === 'founder@zenvitra.org' ||
      isFounder(user?.username || user?.email, user?.role) ||
      isAdmin(user?.username || user?.email, user?.role) ||
      (profile?.role as string) === 'organizer' ||
      profile?.role === 'admin' ||
      (profile?.role as string) === 'secretariat'
    );
  }, [profile, user]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleClaimPortfolioSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPortfolioForAction || !applicantName.trim()) return;

    const updatedList = matrixList.map((item) => {
      if (item.id === selectedPortfolioForAction.id) {
        return {
          ...item,
          status: 'Reserved',
          allocatedTo: applicantName.trim(),
          allocatedEmail: applicantEmail.trim() || undefined,
        };
      }
      return item;
    });

    setMatrixList(updatedList);
    if (matchedConference) {
      updateConferenceMatrix(matchedConference.id, updatedList);
    }

    setActionSuccessMessage(`Successfully reserved ${selectedPortfolioForAction.title} for ${applicantName.trim()}!`);
    setTimeout(() => {
      setActionSuccessMessage(null);
      setSelectedPortfolioForAction(null);
      setApplicantName('');
      setApplicantEmail('');
      setApplicantInstitution('');
    }, 2000);
  };

  const handleExportCSV = () => {
    const headers = ['Portfolio ID', 'Committee', 'Seat/Title', 'Role/Details', 'Category', 'Status', 'Allocated Delegate', 'Email'];
    const rows = matrixList.map((p) => [
      p.id,
      p.committee,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${(p.subTitle || '').replace(/"/g, '""')}"`,
      `"${p.category || ''}"`,
      p.status,
      `"${(p.allocatedTo || '').replace(/"/g, '""')}"`,
      `"${(p.allocatedEmail || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${munSlug || 'conference'}_${selectedCommitteeCode}_matrix.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-neutral-100 flex flex-col selection:bg-cyan-500 selection:text-black font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-24 space-y-8">
        
        {/* Navigation & Event Route Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition group p-2 rounded-xl bg-white/5 border border-white/10"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to MUN Summits</span>
            </Link>

            <span className="text-neutral-600 hidden sm:inline">&bull;</span>

            <Link
              href="/committee"
              onClick={() => {
                if (currentCommitteeObj) {
                  setActiveCommitteeId(currentCommitteeObj.id);
                }
              }}
              className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
            >
              <Award className="w-4 h-4" />
              <span>Enter Committee Chamber</span>
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-neutral-300 hover:text-white transition shadow-sm"
              title="Copy public matrix link"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isCopied ? 'Link Copied!' : 'Share Matrix'}</span>
            </button>

            {/* Plans & Cashfree Payment Links */}
            <button
              type="button"
              onClick={() => setIsPlansModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-cyan-500/20 hover:from-amber-500/30 hover:to-cyan-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs transition cursor-pointer shadow-sm"
            >
              <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
              <span>Plans &amp; Payment Links</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Host New MUN</span>
            </button>
          </div>
        </div>

        {/* Conference Header Card */}
        <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-[#0c1424] via-[#080d1a] to-[#0d1627] border border-cyan-500/30 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-4xl space-y-4">
            {/* Dynamic Status Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                statusInfo.status === 'NOT_STARTED'
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : statusInfo.status === 'CONCLUDED'
                  ? 'bg-neutral-500/20 text-neutral-300 border-neutral-500/30'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 animate-pulse'
              }`}>
                {statusInfo.status === 'NOT_STARTED' ? (
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                ) : statusInfo.status === 'CONCLUDED' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                )}
                <span>{statusInfo.displayText}</span>
              </span>

              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-400 font-mono text-xs">
                Hosted Event URL &bull; /{munSlug || matchedConference?.id}/matrix
              </span>
            </div>

            {/* Conference Title & Tagline */}
            <div className="space-y-1.5">
              <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
                {matchedConference?.name || 'Model United Nations Summit'}
              </h1>
              <p className="text-neutral-400 text-sm sm:text-base font-light">
                {matchedConference?.tagline || 'Live Public Country Matrix & Delegate Allotment Ledger'}
              </p>
            </div>

            {/* Event Metadata (Dates, Venue, Host) */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs font-mono text-neutral-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>{matchedConference?.startDate} &ndash; {matchedConference?.endDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>{matchedConference?.location || 'Digital Sovereignty Chamber'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Secretariat: {matchedConference?.secretariatChair || 'Executive Board'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Passes & Tiers Showcase */}
        {matchedConference?.plans && matchedConference.plans.length > 0 && (
          <div className="rounded-3xl p-6 bg-gradient-to-r from-purple-950/20 via-black to-[#0c1424] border border-purple-500/25 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold font-mono text-purple-300 uppercase tracking-wider">
                    {matchedConference.plans.length === 1
                      ? 'Conference Delegate Registration'
                      : `Delegate Registration Passes & Tiers (${matchedConference.plans.length} Tiers)`}
                  </h3>
                </div>
                <p className="text-xs text-neutral-400">
                  {matchedConference.plans.length === 1
                    ? 'Standard delegate admission with official committee floor debate credentials.'
                    : 'Choose your preferred delegate tier to lock committee floor credentials and admission.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-black font-bold text-xs transition shadow-lg shadow-cyan-500/20 active:scale-95 cursor-pointer"
                >
                  Register / Get Pass
                </button>
                <button
                  type="button"
                  onClick={() => setIsPlansModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white font-mono text-xs transition cursor-pointer"
                >
                  Configure Tiers
                </button>
              </div>
            </div>

            {/* Tiers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {matchedConference.plans.map((plan) => (
                <div
                  key={plan.id}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-purple-500/40 transition flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-sm text-white group-hover:text-purple-200 transition">
                        {plan.name}
                      </span>
                      {plan.badge && (
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-snug">
                      {plan.description}
                    </p>

                    {plan.perks && plan.perks.length > 0 && (
                      <div className="space-y-1 pt-1">
                        {plan.perks.slice(0, 3).map((perk, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] text-neutral-300">
                            <span className="text-emerald-400 text-xs">✓</span>
                            <span className="truncate">{perk}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-baseline gap-1 font-mono">
                      <span className="text-lg font-black text-amber-400">
                        {plan.price > 0 ? `₹${plan.price}` : 'FREE'}
                      </span>
                      {plan.price > 0 && <span className="text-[10px] text-neutral-400">INR</span>}
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsBookingModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 font-mono text-xs font-semibold transition cursor-pointer"
                    >
                      Select Tier &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Matrix Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 font-mono">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Total Committee Seats</div>
            <div className="text-2xl font-black text-white">{totalSeats}</div>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
            <div className="text-[10px] text-emerald-300 uppercase tracking-wider">Open / Vacant Seats</div>
            <div className="text-2xl font-black text-emerald-400">{vacantSeats}</div>
          </div>
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 space-y-1">
            <div className="text-[10px] text-cyan-300 uppercase tracking-wider">Allocated / Reserved</div>
            <div className="text-2xl font-black text-cyan-400">{allocatedSeats}</div>
          </div>
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/25 space-y-1">
            <div className="text-[10px] text-purple-300 uppercase tracking-wider">Allocation Rate</div>
            <div className="text-2xl font-black text-purple-400">{allocationRate}%</div>
          </div>
        </div>

        {/* Hosted Committees Navigation Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Hosted Committees ({hostedCommittees.length})</span>
            </div>
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-neutral-300 transition"
              title="Export this matrix to CSV"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
            {hostedCommittees.map((comm) => {
              const code = comm.shortName || comm.id;
              const isSelected = selectedCommitteeCode === comm.id || selectedCommitteeCode === comm.shortName;
              return (
                <button
                  key={comm.id}
                  type="button"
                  onClick={() => {
                    setSelectedCommitteeCode(comm.id);
                    const targetSlug = matchedConference?.slug || effectiveSlug || 'event';
                    const targetComm = (comm.shortName || comm.id).toLowerCase();
                    router.push(`/${targetSlug}/${targetComm}/matrix`);
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-bold transition flex items-center gap-2 shrink-0 cursor-pointer border ${
                    isSelected
                      ? 'bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/20'
                      : 'bg-white/5 hover:bg-white/10 text-neutral-300 border-white/10'
                  }`}
                >
                  <span>{code}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-black/20 text-black' : 'bg-white/10 text-neutral-400'
                  }`}>
                    {comm.type || 'UN'}
                  </span>
                </button>
              );
            })}

            {isOrganizer && !showAddCommInline && (
              <button
                type="button"
                onClick={() => setShowAddCommInline(true)}
                className="px-3 py-2 rounded-2xl bg-white/[0.04] hover:bg-white/10 text-neutral-400 hover:text-white border border-dashed border-white/20 text-xs font-mono font-semibold transition flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
                <span>+ Add Committee</span>
              </button>
            )}

            {isOrganizer && showAddCommInline && (
              <form onSubmit={handleAddInlineCommittee} className="flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  autoFocus
                  required
                  value={newCommitteeName}
                  onChange={(e) => setNewCommitteeName(e.target.value)}
                  placeholder="Committee name (e.g. UNSC, Lok Sabha)..."
                  className="px-3 py-2 rounded-xl bg-black/80 border border-cyan-500/50 text-white placeholder-neutral-500 text-xs font-mono focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold cursor-pointer"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddCommInline(false);
                    setNewCommitteeName('');
                  }}
                  className="px-2 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-400 text-xs font-mono cursor-pointer"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Empty Committees State */}
        {hostedCommittees.length === 0 && (
          <div className="p-8 sm:p-12 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
              <Layers className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-lg text-white">No Committees in this Space Yet</h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                Add your first committee to dynamically generate member state portfolios, dais voting, and floor agendas.
              </p>
            </div>
            {isOrganizer && !showAddCommInline && (
              <button
                type="button"
                onClick={() => setShowAddCommInline(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition cursor-pointer shadow-md shadow-cyan-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add First Committee</span>
              </button>
            )}
          </div>
        )}

        {/* Active Committee Details Banner */}
        {currentCommitteeObj && (
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{currentCommitteeObj.name}</span>
                <span className="text-xs font-mono text-cyan-400">({currentCommitteeObj.shortName || currentCommitteeObj.id})</span>
              </div>
              <p className="text-xs text-neutral-400 max-w-3xl leading-relaxed">
                {currentCommitteeObj.agenda || 'Official Parliamentary & Multilateral Deliberations'}
              </p>
            </div>

            <Link
              href="/committee"
              onClick={() => setActiveCommitteeId(currentCommitteeObj.id)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold transition shrink-0"
            >
              <span>Join Chamber</span>
              <Award className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#0a0d14] border border-white/10">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search country, minister, or portfolio..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-neutral-300 text-xs font-mono focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Vacant">Vacant Seats</option>
              <option value="Reserved">Reserved / In Review</option>
              <option value="Allocated">Allocated Seats</option>
            </select>

            {/* Category Filter */}
            {availableCategories.length > 0 && (
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-neutral-300 text-xs font-mono focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Portfolios Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredPortfolios.map((portfolio) => {
            const isVacant = portfolio.status === 'Vacant';
            return (
              <div
                key={portfolio.id}
                className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-all flex flex-col justify-between space-y-3 shadow-sm group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-400">
                      {portfolio.category || 'General Member'}
                    </span>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      isVacant
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                        : portfolio.status === 'Reserved'
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/25'
                        : 'bg-rose-500/10 text-rose-300 border-rose-500/25'
                    }`}>
                      {portfolio.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-cyan-300 transition-colors">
                      {portfolio.title}
                    </h3>
                    {portfolio.subTitle && (
                      <p className="text-xs text-neutral-400 font-light mt-0.5 line-clamp-2">
                        {portfolio.subTitle}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2 text-xs font-mono">
                  {portfolio.allocatedTo ? (
                    <div className="text-neutral-400 truncate flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{portfolio.allocatedTo}</span>
                    </div>
                  ) : (
                    <div className="text-neutral-500 text-[11px]">
                      Seat available for allocation
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedPortfolioForAction(portfolio)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      isVacant
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-md shadow-emerald-500/20 active:scale-95'
                        : 'bg-white/10 hover:bg-white/15 text-white active:scale-95'
                    }`}
                  >
                    <span>{isVacant ? 'Claim Seat' : 'Seat Info'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPortfolios.length === 0 && (
          <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/10 space-y-2">
            <Layers className="w-8 h-8 text-neutral-500 mx-auto" />
            <p className="text-neutral-400 text-sm">No portfolios found matching your search or filters.</p>
          </div>
        )}

      </main>

      {/* Claim / Reserve Seat Modal */}
      {selectedPortfolioForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#0f1420] border border-white/20 p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                  {selectedPortfolioForAction.committee} Portfolio Application
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {selectedPortfolioForAction.title}
                </h2>
                {selectedPortfolioForAction.subTitle && (
                  <p className="text-xs text-neutral-400 mt-1">
                    {selectedPortfolioForAction.subTitle}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedPortfolioForAction(null)}
                className="p-1 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            {actionSuccessMessage ? (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-center font-bold text-sm">
                {actionSuccessMessage}
              </div>
            ) : (
              <form onSubmit={handleClaimPortfolioSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400">Delegate Full Name *</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="e.g. Advait Sharma"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400">Email Address (for Confirmation)</label>
                  <input
                    type="email"
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    placeholder="delegate@institution.org"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400">School / College / Delegation</label>
                  <input
                    type="text"
                    value={applicantInstitution}
                    onChange={(e) => setApplicantInstitution(e.target.value)}
                    placeholder="Institution Name"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200">
                  Applications are reviewed and ratified by the Secretariat on a rolling basis.
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPortfolioForAction(null)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-lg shadow-cyan-500/20 cursor-pointer active:scale-95"
                  >
                    Submit Preference & Reserve
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Host New Event Modal */}
      <CreateMunConferenceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Registration Plans & Cashfree Payment Links Modal */}
      {matchedConference && (
        <EventPlansPaymentLinksModal
          isOpen={isPlansModalOpen}
          onClose={() => setIsPlansModalOpen(false)}
          eventId={matchedConference.id}
          eventTitle={matchedConference.name}
          initialPlans={matchedConference.plans}
          initialPaymentLinks={matchedConference.paymentLinks}
          onSavePlans={(plans) => {
            updateConference(matchedConference.id, { plans });
          }}
          onSavePaymentLink={(link) => {
            const existing = matchedConference.paymentLinks || [];
            updateConference(matchedConference.id, {
              paymentLinks: [link, ...existing.filter((l) => l.linkId !== link.linkId)],
            });
          }}
        />
      )}

      {/* Delegate Pass Booking Modal with Tiers */}
      {conferenceEventForBooking && (
        <ZenPassBookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          event={conferenceEventForBooking as any}
        />
      )}

      <Footer />
    </div>
  );
}
