'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  IndianRupee,
  AlertCircle
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useMun } from '@/context/MunContext';
import { computeConferenceStatus } from '@/lib/conferenceStatusHelper';
import { 
  MatrixPortfolioItem, 
  generatePortfoliosForCommittee 
} from '@/lib/matrixPortfoliosData';
import { MunCommittee } from '@/types/mun';
import { CreateMunConferenceModal } from '@/components/mun/CreateMunConferenceModal';
import { EventPlansPaymentLinksModal } from '@/components/payments/EventPlansPaymentLinksModal';
import { ZenPassBookingModal } from '@/components/events/ZenPassBookingModal';
import { ZenEvent, EventStatus, EventType } from '@/types/events';
import { useAuth } from '@/context/AuthContext';
import { isFounder, isAdmin } from '@/lib/founderControl';

export default function CanonicalMunMatrixPage() {
  const router = useRouter();
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [isCopied, setIsCopied] = useState(false);
  const [showAddCommInline, setShowAddCommInline] = useState(false);
  const [newCommitteeName, setNewCommitteeName] = useState('');
  const [selectedCommitteeCode, setSelectedCommitteeCode] = useState<string>('UNSC');

  // Modal to allocate or claim a seat
  const [selectedPortfolioForAction, setSelectedPortfolioForAction] = useState<MatrixPortfolioItem | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantInstitution, setApplicantInstitution] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Filter out any hardcoded or seeded MUNs - only legitimate user/organizer conferences
  const isSeededMun = (c: any) => {
    if (!c || !c.id) return true;
    const id = String(c.id).toLowerCase();
    const name = String(c.name || '').toLowerCase();
    const slug = String(c.slug || '').toLowerCase();
    return (
      id === 'conf-zenmun-2026' ||
      id === 'mun-zen-2026' ||
      id.includes('evt_showcase') ||
      id.includes('zen-diplomacy') ||
      name.includes('zenmun') ||
      name.includes('global mun') ||
      name.includes('geneva world mun') ||
      name.includes('civic treaty') ||
      slug === 'zen-diplomacy' ||
      slug === 'zen-diplomacy-mun-2026'
    );
  };

  const validConferences = useMemo(() => {
    return conferences.filter((c) => !isSeededMun(c));
  }, [conferences]);

  // If valid conferences exist but none is active, set the first valid one as active
  useEffect(() => {
    if (validConferences.length > 0 && (!activeConference || isSeededMun(activeConference))) {
      setActiveConferenceId(validConferences[0].id);
    }
  }, [validConferences, activeConference, setActiveConferenceId]);

  const currentConference = useMemo(() => {
    if (activeConference && !isSeededMun(activeConference)) {
      return activeConference;
    }
    return validConferences.length > 0 ? validConferences[0] : undefined;
  }, [activeConference, validConferences]);

  // Compute live conference status dynamically from dates
  const statusInfo = computeConferenceStatus(currentConference);

  // Convert conference to event shape for ZenPassBookingModal (no seeded mock fallbacks)
  const conferenceEventForBooking = useMemo<ZenEvent | null>(() => {
    if (!currentConference) return null;
    const mappedEventStatus: EventStatus =
      statusInfo.status === 'NOT_STARTED'
        ? 'upcoming'
        : statusInfo.status === 'CONCLUDED'
        ? 'past'
        : 'live';

    return {
      id: currentConference.id,
      slug: currentConference.slug || currentConference.id,
      title: currentConference.name,
      description: currentConference.tagline || '',
      coverImage: (currentConference as any).coverImage || undefined,
      type: ((currentConference as any).format as EventType) || 'physical',
      category: 'MUN',
      status: mappedEventStatus,
      date: currentConference.startDate,
      endDate: currentConference.endDate,
      time: (currentConference as any).time || '',
      location: currentConference.location || '',
      city: (currentConference as any).city || undefined,
      organizerId: (currentConference as any).organizerId || 'organizer',
      organizerName: currentConference.secretariatChair || (currentConference as any).organizerName || 'Secretariat',
      organizerUsername: (currentConference as any).organizerUsername || 'secretariat',
      createdAt: (currentConference as any).createdAt || new Date().toISOString(),
      ticketPrice: currentConference.ticketPrice || 0,
      plans: currentConference.plans || [],
      attendees: [],
      tags: ['mun', 'matrix']
    };
  }, [currentConference, statusInfo.status]);

  // Determine hosted committees for this conference - clean state, no seeded default UNSC
  const hostedCommittees = useMemo<MunCommittee[]>(() => {
    if (!currentConference) return [];

    if (currentConference.committees && currentConference.committees.length > 0) {
      return currentConference.committees.map((comm) => {
        if (typeof comm === 'string') {
          return (
            committees.find((c) => c.id === comm || c.shortName === comm) || {
              id: comm,
              eventId: currentConference.id,
              name: comm,
              shortName: comm.slice(0, 8).toUpperCase(),
              agenda: '',
              type: 'UNSC' as const,
              totalDelegates: 0,
              presentCount: 0,
              presentAndVotingCount: 0,
              quorumNeeded: 0,
              dais: { chair: '', viceChair: '' }
            }
          );
        }
        return comm as MunCommittee;
      });
    }

    return [];
  }, [currentConference, committees]);

  // Sync selected committee code with hosted committees
  useEffect(() => {
    if (hostedCommittees.length > 0 && !hostedCommittees.some((c) => c.id === selectedCommitteeCode || c.shortName === selectedCommitteeCode)) {
      setSelectedCommitteeCode(hostedCommittees[0].id || hostedCommittees[0].shortName || '');
    }
  }, [hostedCommittees, selectedCommitteeCode]);

  const currentCommitteeObj = useMemo(() => {
    if (hostedCommittees.length === 0) return undefined;
    return (
      hostedCommittees.find((c) => c.id === selectedCommitteeCode || c.shortName === selectedCommitteeCode) ||
      hostedCommittees[0]
    );
  }, [hostedCommittees, selectedCommitteeCode]);

  // Portfolios for current committee
  const currentCommitteePortfolios = useMemo<MatrixPortfolioItem[]>(() => {
    if (!currentConference || !currentCommitteeObj) {
      return [];
    }

    const confId = currentConference.id;
    const commCode = currentCommitteeObj.shortName || currentCommitteeObj.id || selectedCommitteeCode;
    const commName = currentCommitteeObj.name || selectedCommitteeCode;
    const commType = (currentCommitteeObj.type as string) || 'UNSC';

    // 1. Check if conference already has saved customized matrix in context
    if (currentConference.portfolios && currentConference.portfolios.length > 0) {
      const filtered = (currentConference.portfolios as MatrixPortfolioItem[]).filter(
        (p: MatrixPortfolioItem) => p.committee.toLowerCase() === commCode.toLowerCase() || p.committee.toLowerCase() === commName.toLowerCase()
      );
      if (filtered.length > 0) return filtered;
    }

    // 2. Dynamically generate clean template portfolios based on committee type
    return generatePortfoliosForCommittee(commCode, commName, commType, confId);
  }, [currentConference, currentCommitteeObj, selectedCommitteeCode]);

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
      .slice(0, 8) || cleanTitle.slice(0, 6).toUpperCase();

    const newComm = addCustomCommittee({
      name: cleanTitle,
      shortName: shortCode,
      agenda: 'General Deliberations',
      type: 'UNSC',
    });

    if (currentConference) {
      const existing = currentConference.committees || [];
      updateConference(currentConference.id, {
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
    if (!isMounted) return false;
    const cleanUsername = (profile?.username || user?.username || '').replace(/^@/, '').toLowerCase();
    const cleanEmail = (profile?.email || user?.email || '').toLowerCase();
    return (
      cleanUsername === 'yuveer' ||
      cleanEmail === 'founder@zenvitra.xyz' ||
      cleanEmail === 'founder@zenvitra.org' ||
      isFounder(user) ||
      isAdmin(user) ||
      (profile?.role as string) === 'organizer' ||
      profile?.role === 'admin' ||
      (profile?.role as string) === 'secretariat'
    );
  }, [isMounted, profile, user]);

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
    if (currentConference) {
      updateConferenceMatrix(currentConference.id, updatedList);
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
    link.setAttribute('download', `${currentConference?.id || 'conference'}_${selectedCommitteeCode}_matrix.csv`);
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

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Conference Selector Switcher (if multiple valid conferences exist) */}
            {validConferences.length > 1 && (
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-mono">
                <span className="text-neutral-400">Conference:</span>
                <select
                  value={currentConference?.id}
                  onChange={(e) => setActiveConferenceId(e.target.value)}
                  className="bg-neutral-900 border border-white/10 rounded-lg px-2 py-1 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                >
                  {validConferences.map((c) => (
                    <option key={c.id} value={c.id} className="bg-neutral-900">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-neutral-300 hover:text-white transition shadow-sm cursor-pointer"
              title="Copy public matrix link"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isCopied ? 'Link Copied!' : 'Share Matrix'}</span>
            </button>

            {/* Plans & Cashfree Payment Links */}
            {currentConference && (
              <button
                type="button"
                onClick={() => setIsPlansModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-cyan-500/20 hover:from-amber-500/30 hover:to-cyan-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs transition cursor-pointer shadow-sm"
              >
                <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                <span>Plans &amp; Payment Links</span>
              </button>
            )}

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

        {/* --- SCENARIO 1: NO CONFERENCE SELECTED / FOUND --- */}
        {!currentConference ? (
          <div className="rounded-3xl p-8 sm:p-12 bg-neutral-950/80 border border-white/10 text-center space-y-6 max-w-2xl mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-[10px] uppercase font-bold tracking-wider">
                Conference Context Required
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                No Active MUN Conference Selected
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed">
                The Committee Portfolio Matrix maps ministerial portfolios, member states, and delegate allocations for a specific MUN conference. Host a new conference or select an active summit to view the live allocation ledger.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono transition shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Host / Initialize Conference</span>
              </button>

              <Link
                href="/events"
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs transition flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Browse Conferences &amp; Summits</span>
              </Link>
            </div>
          </div>
        ) : (
          /* --- SCENARIO 2: ACTIVE CONFERENCE LOADED --- */
          <>
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
                    Hosted Conference Ledger &bull; /mun/matrix
                  </span>
                </div>

                {/* Conference Title & Tagline */}
                <div className="space-y-1.5">
                  <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
                    {currentConference.name}
                  </h1>
                  <p className="text-neutral-400 text-sm sm:text-base font-light">
                    {currentConference.tagline || 'Live Public Country Matrix & Delegate Allotment Ledger'}
                  </p>
                </div>

                {/* Event Metadata (Dates, Venue, Host) */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs font-mono text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span>{currentConference.startDate} &ndash; {currentConference.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <span>{currentConference.location || 'Digital Sovereignty Chamber'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <span>Secretariat: {currentConference.secretariatChair || 'Executive Board'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Passes & Tiers Showcase */}
            {currentConference.plans && currentConference.plans.length > 0 && (
              <div className="rounded-3xl p-6 bg-gradient-to-r from-purple-950/20 via-black to-[#0c1424] border border-purple-500/25 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-purple-400" />
                      <h3 className="text-sm font-bold font-mono text-purple-300 uppercase tracking-wider">
                        {currentConference.plans.length === 1
                          ? 'Conference Delegate Registration'
                          : `Delegate Registration Passes & Tiers (${currentConference.plans.length} Tiers)`}
                      </h3>
                    </div>
                    <p className="text-xs text-neutral-400">
                      Choose your preferred delegate tier to lock committee floor credentials and admission.
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
                  {currentConference.plans.map((plan) => (
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-neutral-300 transition cursor-pointer"
                  title="Export this matrix to CSV"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {hostedCommittees.length === 0 && (
                  <div className="text-xs font-mono text-neutral-400 py-2">
                    No committees added to this conference yet.
                  </div>
                )}
                {hostedCommittees.map((comm) => {
                  const code = comm.shortName || comm.id;
                  const isSelected = selectedCommitteeCode === comm.id || selectedCommitteeCode === comm.shortName;
                  return (
                    <button
                      key={comm.id}
                      type="button"
                      onClick={() => setSelectedCommitteeCode(comm.id)}
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

            {/* Filter & Search Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10 font-mono text-xs">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                {/* Search */}
                <div className="flex items-center gap-2 bg-black/60 border border-white/10 rounded-xl px-3 py-2 w-full sm:w-72">
                  <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search country, portfolio, or delegate..."
                    className="bg-transparent text-white placeholder-neutral-500 focus:outline-none text-xs w-full"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-neutral-500 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-500 text-[11px]">Status:</span>
                  <select
                    value={selectedStatusFilter}
                    onChange={(e) => setSelectedStatusFilter(e.target.value)}
                    className="bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 text-xs"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="Vacant">Vacant Only</option>
                    <option value="Allocated">Allocated Only</option>
                    <option value="Reserved">Reserved Only</option>
                  </select>
                </div>

                {/* Category Filter */}
                {availableCategories.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-neutral-500 text-[11px]">Category:</span>
                    <select
                      value={selectedCategoryFilter}
                      onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                      className="bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 text-xs"
                    >
                      <option value="ALL">All Categories</option>
                      {availableCategories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="text-neutral-400 text-xs">
                Showing <span className="text-white font-bold">{filteredPortfolios.length}</span> of {totalSeats} seats
              </div>
            </div>

            {/* Portfolios Table / Cards View */}
            <div className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredPortfolios.map((item) => {
                  const isVacant = item.status === 'Vacant';
                  const isAllocated = item.status === 'Allocated';
                  const isReserved = item.status === 'Reserved' || item.status.includes('waiting');

                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-neutral-950/70 border border-white/10 hover:border-cyan-500/40 transition flex flex-col justify-between space-y-3 group shadow-md"
                    >
                      <div className="space-y-2">
                        {/* Status + Category Row */}
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              isVacant
                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                : isAllocated
                                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                                : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                            }`}
                          >
                            {item.status}
                          </span>

                          {item.category && (
                            <span className="text-[10px] text-neutral-400 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                              {item.category}
                            </span>
                          )}
                        </div>

                        {/* Title & Details */}
                        <div>
                          <div className="font-bold text-sm sm:text-base text-white group-hover:text-cyan-200 transition">
                            {item.title}
                          </div>
                          {item.subTitle && (
                            <div className="text-xs text-neutral-400 mt-0.5">
                              {item.subTitle}
                            </div>
                          )}
                        </div>

                        {/* Allocated Delegate info if available */}
                        {item.allocatedTo && (
                          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs font-mono space-y-0.5">
                            <div className="text-neutral-400 text-[10px] uppercase">Allotted Delegate:</div>
                            <div className="text-cyan-300 font-bold flex items-center gap-1.5">
                              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                              <span>{item.allocatedTo}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-neutral-500 uppercase">
                          {item.committee}
                        </span>

                        <button
                          type="button"
                          onClick={() => setSelectedPortfolioForAction(item)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition cursor-pointer border ${
                            isVacant
                              ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-white/5 hover:bg-white/10 text-neutral-300 border-white/10'
                          }`}
                        >
                          {isVacant ? 'Claim Seat' : 'Manage Allocation'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredPortfolios.length === 0 && (
                <div className="text-center py-16 rounded-3xl bg-white/[0.01] border border-dashed border-white/10 space-y-3 font-mono">
                  <Filter className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p className="text-xs text-neutral-400">
                    {hostedCommittees.length === 0 
                      ? 'No committees or portfolios configured yet. Add a committee above to begin allocating seats.' 
                      : 'No portfolios match your current search and filters.'}
                  </p>
                  {hostedCommittees.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedStatusFilter('ALL');
                        setSelectedCategoryFilter('ALL');
                      }}
                      className="text-xs text-cyan-400 hover:underline"
                    >
                      Reset all filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Claim / Allocate Seat Modal */}
      {selectedPortfolioForAction && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0d14] border border-cyan-500/30 rounded-3xl max-w-md w-full p-6 space-y-5 text-white shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                  Portfolio Assignment
                </span>
                <h3 className="text-lg font-bold font-display text-white mt-0.5">
                  {selectedPortfolioForAction.title}
                </h3>
                <span className="text-xs text-neutral-400 font-mono">
                  {selectedPortfolioForAction.committee} &bull; {selectedPortfolioForAction.category || 'Member State'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPortfolioForAction(null)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {actionSuccessMessage ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{actionSuccessMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleClaimPortfolioSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-300 font-semibold block">Delegate Name *</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-300 font-semibold block">Delegate Email</label>
                  <input
                    type="email"
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    placeholder="delegate@institution.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-300 font-semibold block">Institution / School (optional)</label>
                  <input
                    type="text"
                    value={applicantInstitution}
                    onChange={(e) => setApplicantInstitution(e.target.value)}
                    placeholder="e.g. DPS R.K. Puram or St. Stephen's"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setSelectedPortfolioForAction(null)}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-mono transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono transition shadow-lg shadow-cyan-500/20"
                  >
                    Lock Seat Allocation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Create MUN Conference Modal */}
      <CreateMunConferenceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onConferenceCreated={(confId) => {
          setActiveConferenceId(confId);
          setIsCreateModalOpen(false);
        }}
      />

      {/* Plans & Cashfree Links Modal */}
      {currentConference && (
        <EventPlansPaymentLinksModal
          isOpen={isPlansModalOpen}
          onClose={() => setIsPlansModalOpen(false)}
          eventId={currentConference.id}
          eventTitle={currentConference.name}
          initialPlans={currentConference.plans || []}
          onSavePlans={(updatedPlans) => {
            updateConference(currentConference.id, { plans: updatedPlans });
          }}
        />
      )}

      {/* ZenPass Booking Modal */}
      {conferenceEventForBooking && (
        <ZenPassBookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          event={conferenceEventForBooking}
        />
      )}

      <Footer />
    </div>
  );
}
