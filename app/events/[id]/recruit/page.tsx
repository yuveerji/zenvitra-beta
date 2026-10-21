'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Users,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Search,
  Filter,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  Building2,
  Sparkles,
  RefreshCw,
  XCircle,
  Send
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useZenEvents } from '@/context/ZenEventsPlatformContext';
import { useAuth } from '@/context/AuthContext';

export default function EventRecruitmentPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = (params?.id as string) || '';

  const { getEventById, events, currentUserId, currentUserUsername } = useZenEvents();
  const { profile, user } = useAuth();

  const event = events.find((e) => e.id === eventId || e.slug === eventId) || getEventById(eventId);

  const [config, setConfig] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'positions' | 'track'>('positions');

  // Application Tracking State
  const [trackingNumberInput, setTrackingNumberInput] = useState<string>('');
  const [trackedApplication, setTrackedApplication] = useState<any>(null);
  const [trackingLoading, setTrackingLoading] = useState<boolean>(false);
  const [trackingError, setTrackingError] = useState<string | null>(null);
  const [respondingToOffer, setRespondingToOffer] = useState<boolean>(false);
  const [offerSuccessMessage, setOfferSuccessMessage] = useState<string | null>(null);

  const isOrganizer = Boolean(
    event &&
    (event.organizerId === currentUserId ||
      event.organizerUsername === currentUserUsername ||
      profile?.role === 'admin' ||
      profile?.email?.toLowerCase() === 'founder@zenvitra.xyz')
  );

  useEffect(() => {
    let isMounted = true;
    const fetchRecruitment = async () => {
      try {
        setLoading(true);
        const [configRes, postsRes] = await Promise.all([
          fetch(`/api/events/recruit/config?eventId=${encodeURIComponent(eventId)}`),
          fetch(`/api/events/recruit/posts?eventId=${encodeURIComponent(eventId)}`)
        ]);

        const configData = await configRes.json();
        const postsData = await postsRes.json();

        if (isMounted) {
          if (configData.success && configData.config) {
            setConfig(configData.config);
          }
          if (postsData.success && Array.isArray(postsData.posts)) {
            setPosts(postsData.posts);
            setDepartments(['All', ...(postsData.departments || [])]);
          }
        }
      } catch (err) {
        console.error('Failed to load recruitment data', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (eventId) {
      fetchRecruitment();
    }

    return () => { isMounted = false; };
  }, [eventId]);

  const handleTrackSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackingNumberInput.trim().toUpperCase();
    if (!query) return;

    try {
      setTrackingLoading(true);
      setTrackingError(null);
      setOfferSuccessMessage(null);

      const res = await fetch(`/api/events/recruit/applications?applicationNumber=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data.success && data.application) {
        setTrackedApplication(data.application);
      } else {
        setTrackedApplication(null);
        setTrackingError(data.error || 'No application found with this reference code.');
      }
    } catch (_) {
      setTrackingError('Unable to connect to recruitment ledger.');
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleOfferResponse = async (status: 'ACCEPTED' | 'DECLINED') => {
    if (!trackedApplication) return;
    try {
      setRespondingToOffer(true);
      const res = await fetch('/api/events/recruit/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationNumber: trackedApplication.applicationNumber,
          status
        })
      });
      const data = await res.json();
      if (data.success && data.application) {
        setTrackedApplication(data.application);
        setOfferSuccessMessage(
          status === 'ACCEPTED'
            ? '🎉 Offer accepted! The conference executive board has been notified of your appointment.'
            : 'Offer declined. Your decision has been recorded.'
        );
      }
    } catch (_) {
    } finally {
      setRespondingToOffer(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesDept = selectedDept === 'All' || post.department.toLowerCase() === selectedDept.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#06080e] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-24 pb-20">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-6">
          <Link
            href={`/events/${eventId}`}
            className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Event Overview</span>
          </Link>

          {isOrganizer && (
            <Link
              href={`/events/${eventId}/manage?tab=recruitment`}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition cursor-pointer"
            >
              Organizer Command Center
            </Link>
          )}
        </div>

        {/* Hero Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#090a12] border border-white/10 shadow-2xl relative overflow-hidden mb-8">
          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white border border-white/10 text-[10px] font-mono font-bold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{config?.enabled ? 'Recruitment Active' : 'Recruitment Closed'}</span>
              </span>
              {event?.title && (
                <span className="text-xs font-mono text-neutral-400 truncate max-w-xs">
                  {event.title}
                </span>
              )}
            </div>

            <h1 className="font-sans font-bold text-2xl sm:text-4xl text-white tracking-tight">
              {config?.headline || 'Apply for Event Secretariat & Leadership Posts'}
            </h1>

            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
              {config?.description || 'Recruiting Organising Committee, Executive Board, Committee Chairs, and Event Staff directly through ZENVITRA.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-neutral-400">
              {event?.date && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-white" />
                  <span>{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </span>
              )}
              {event?.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-white" />
                  <span className="truncate max-w-xs">{event.location}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('positions')}
            className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'positions'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Open Positions ({posts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('track')}
            className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'track'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Track Application Status</span>
          </button>
        </div>

        {/* ─── TAB 1: OPEN POSITIONS ─── */}
        {activeTab === 'positions' && (
          <div className="space-y-6">
            
            {/* If Google Forms is the active method */}
            {config?.method === 'GOOGLE_FORMS_EMBED' && config.googleFormsUrl && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-neutral-300">
                    <ExternalLink className="w-4 h-4 text-white" />
                    <span>This event uses an embedded Google Application Form. Responses submit directly to the organizing secretariat.</span>
                  </div>
                  <a
                    href={config.googleFormsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-white text-black font-semibold text-xs transition shrink-0"
                  >
                    Open Fullscreen Form ↗
                  </a>
                </div>

                <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-white min-h-[700px]">
                  <iframe
                    src={config.googleFormsUrl}
                    width="100%"
                    height="800"
                    frameBorder="0"
                    marginHeight={0}
                    marginWidth={0}
                    title="Google Forms Recruitment Application"
                  >
                    Loading Form...
                  </iframe>
                </div>
              </div>
            )}

            {config?.method === 'GOOGLE_FORMS_LINK' && config.googleFormsUrl && (
              <div className="p-8 rounded-3xl bg-[#080911] border border-white/10 text-center space-y-4 max-w-xl mx-auto my-8">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-white">
                  <ExternalLink className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-white">External Google Form Application</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    The organizers of this event are accepting applications via their official Google Form. Click below to view requirements and submit your candidacy.
                  </p>
                </div>
                <a
                  href={config.googleFormsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition cursor-pointer shadow-sm"
                >
                  <span>Open Application Form on Google Forms</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Native ZEN.FORMS Posts Listing */}
            {(!config?.method || config?.method === 'ZEN_FORMS') && (
              <>
                {/* Search & Department Filters */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search roles, departments, or keywords..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090a12] border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/30 font-sans"
                    />
                  </div>

                  {departments.length > 1 && (
                    <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                      {departments.map((dept) => (
                        <button
                          key={dept}
                          type="button"
                          onClick={() => setSelectedDept(dept)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer ${
                            selectedDept === dept
                              ? 'bg-white text-black font-bold'
                              : 'bg-white/5 text-neutral-400 hover:text-white border border-white/5'
                          }`}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Posts Cards Grid */}
                {loading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="p-6 rounded-2xl bg-[#090a12] border border-white/5 animate-pulse space-y-3">
                        <div className="h-4 bg-white/10 rounded w-1/4" />
                        <div className="h-6 bg-white/10 rounded w-3/4" />
                        <div className="h-16 bg-white/5 rounded" />
                      </div>
                    ))}
                  </div>
                )}

                {!loading && filteredPosts.length === 0 && (
                  <div className="py-16 text-center space-y-3 rounded-3xl bg-[#090a12] border border-white/10 p-8 max-w-xl mx-auto">
                    <Briefcase className="w-10 h-10 text-neutral-600 mx-auto" />
                    <h3 className="font-bold text-base text-white">No Open Positions Match Your Filter</h3>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                      Try selecting another department or clearing your search keywords.
                    </p>
                  </div>
                )}

                {!loading && filteredPosts.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredPosts.map((post) => {
                      let responsibilitiesArr: string[] = [];
                      let requirementsArr: string[] = [];

                      try {
                        if (post.responsibilities) {
                          responsibilitiesArr = typeof post.responsibilities === 'string'
                            ? JSON.parse(post.responsibilities)
                            : post.responsibilities;
                        }
                      } catch (_) {
                        responsibilitiesArr = [post.responsibilities];
                      }

                      try {
                        if (post.requirements) {
                          requirementsArr = typeof post.requirements === 'string'
                            ? JSON.parse(post.requirements)
                            : post.requirements;
                        }
                      } catch (_) {
                        requirementsArr = [post.requirements];
                      }

                      const spotsRemaining = Math.max(0, (post.slots || 1) - (post.filledSlots || 0));

                      return (
                        <div
                          key={post.id}
                          className="p-6 rounded-2xl bg-[#090a12] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-5 shadow-lg group"
                        >
                          <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-lg bg-white/10 text-white border border-white/10 text-[10px] font-mono font-bold uppercase tracking-wider">
                                {post.department}
                              </span>
                              {post.isCompensated ? (
                                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-semibold">
                                  {post.compensationDetails || 'Stipend / Compensated'}
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-md bg-white/5 text-neutral-400 border border-white/5 text-[10px] font-mono">
                                  Voluntary Post
                                </span>
                              )}
                              <span className="text-[11px] font-mono text-neutral-400 ml-auto">
                                {spotsRemaining} Spot{spotsRemaining === 1 ? '' : 's'} Remaining
                              </span>
                            </div>

                            <div>
                              <h3 className="font-sans font-bold text-lg text-white group-hover:text-neutral-200 transition">
                                {post.title}
                              </h3>
                              <p className="text-xs text-neutral-400 leading-relaxed font-sans pt-1">
                                {post.description}
                              </p>
                            </div>

                            {responsibilitiesArr.length > 0 && (
                              <div className="space-y-1 pt-1">
                                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block font-bold">
                                  Key Responsibilities
                                </span>
                                <ul className="text-xs text-neutral-300 space-y-1 list-disc pl-4">
                                  {responsibilitiesArr.slice(0, 3).map((resp, idx) => (
                                    <li key={idx} className="line-clamp-2">{resp}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {requirementsArr.length > 0 && (
                              <div className="space-y-1 pt-1">
                                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block font-bold">
                                  Eligibility &amp; Criteria
                                </span>
                                <ul className="text-xs text-neutral-400 space-y-1 list-disc pl-4">
                                  {requirementsArr.slice(0, 2).map((req, idx) => (
                                    <li key={idx} className="line-clamp-2">{req}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                            <span className="text-[10px] font-mono text-neutral-500">
                              {post._count?.applications || 0} Applied
                            </span>

                            {post.applicationMethod === 'GOOGLE_FORMS' && post.externalFormUrl ? (
                              <a
                                href={post.externalFormUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-sans font-bold transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                              >
                                <span>Apply via Google Forms</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            ) : post.applicationMethod === 'EXTERNAL' && post.externalFormUrl ? (
                              <a
                                href={post.externalFormUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-sans font-bold transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                              >
                                <span>External Application</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            ) : (
                              <Link
                                href={`/events/${eventId}/apply?postId=${post.id}`}
                                className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-sans font-bold transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                              >
                                <span>Apply for Post</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ─── TAB 2: TRACK APPLICATION STATUS ─── */}
        {activeTab === 'track' && (
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Search Input Box */}
            <form onSubmit={handleTrackSearch} className="p-5 sm:p-6 rounded-2xl bg-[#090a12] border border-white/10 space-y-3">
              <label className="block text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider">
                Enter Your Application Reference Code
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={trackingNumberInput}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  placeholder="e.g. APP-2026-F91A"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/40 uppercase"
                />
                <button
                  type="submit"
                  disabled={trackingLoading}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {trackingLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                  <span>Check Status</span>
                </button>
              </div>
              <p className="text-[11px] font-mono text-neutral-500">
                You received this reference code on your screen and email confirmation when submitting your application.
              </p>
            </form>

            {trackingError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-mono text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{trackingError}</span>
              </div>
            )}

            {offerSuccessMessage && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{offerSuccessMessage}</span>
              </div>
            )}

            {/* Tracked Application Card */}
            {trackedApplication && (
              <div className="p-6 rounded-3xl bg-[#090a12] border border-white/15 space-y-6 shadow-2xl">
                
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">
                      REFERENCE
                    </span>
                    <strong className="text-base font-mono text-white tracking-wide">
                      {trackedApplication.applicationNumber}
                    </strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                      trackedApplication.status === 'ACCEPTED'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : trackedApplication.status === 'OFFER_SENT'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : trackedApplication.status === 'INTERVIEW'
                        ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                        : trackedApplication.status === 'SHORTLISTED'
                        ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                        : trackedApplication.status === 'REJECTED'
                        ? 'bg-neutral-800 text-neutral-400 border-white/10'
                        : 'bg-white/10 text-white border-white/15'
                    }`}>
                      {trackedApplication.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Role Details */}
                <div className="space-y-1">
                  <span className="text-xs font-mono text-neutral-400 uppercase">Applied Position</span>
                  <h3 className="font-sans font-bold text-xl text-white">
                    {trackedApplication.post?.title || 'Event Staff Role'}
                  </h3>
                  <p className="text-xs font-mono text-neutral-400">
                    Department: {trackedApplication.post?.department || 'Organising Committee'} &bull; Candidate: {trackedApplication.applicantName}
                  </p>
                </div>

                {/* Offer Action Banner if OFFER_SENT */}
                {trackedApplication.status === 'OFFER_SENT' && (
                  <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                        <Sparkles className="w-4 h-4" />
                        <span>Appointment Offer Received!</span>
                      </div>
                      <p className="text-xs text-amber-200/80 leading-relaxed">
                        Congratulations! The secretariat has offered you the role of <strong className="text-white">{trackedApplication.offerRole || trackedApplication.post?.title}</strong>. Please confirm your acceptance before the response deadline.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        disabled={respondingToOffer}
                        onClick={() => handleOfferResponse('ACCEPTED')}
                        className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Offer</span>
                      </button>

                      <button
                        type="button"
                        disabled={respondingToOffer}
                        onClick={() => handleOfferResponse('DECLINED')}
                        className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-neutral-300 text-xs font-mono transition cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                )}

                {/* Interview Notice if INTERVIEW */}
                {trackedApplication.status === 'INTERVIEW' && (
                  <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-blue-300 font-bold">
                      <Calendar className="w-4 h-4" />
                      <span>Interview Round Scheduled</span>
                    </div>
                    {trackedApplication.interviewDate && (
                      <p className="text-neutral-300 font-mono">
                        Date &amp; Time: {new Date(trackedApplication.interviewDate).toLocaleString()}
                      </p>
                    )}
                    {trackedApplication.interviewMeetingUrl && (
                      <div className="pt-1">
                        <a
                          href={trackedApplication.interviewMeetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-200 border border-blue-500/30 hover:underline"
                        >
                          <span>Join Meeting Room</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Submission Details */}
                <div className="space-y-3 pt-2 border-t border-white/10 text-xs font-mono text-neutral-400">
                  <div className="flex justify-between">
                    <span>Submitted On:</span>
                    <span className="text-white">{new Date(trackedApplication.submittedAt).toLocaleDateString()}</span>
                  </div>
                  {trackedApplication.applicantEmail && (
                    <div className="flex justify-between">
                      <span>Applicant Email:</span>
                      <span className="text-white">{trackedApplication.applicantEmail}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
