'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  Users, 
  Clock, 
  ArrowRight, 
  ExternalLink, 
  Calendar, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  Coins
} from 'lucide-react';

interface EventPostItem {
  id: string;
  title: string;
  department: string;
  description: string;
  responsibilities?: string | null;
  requirements?: string | null;
  slots: number;
  filledSlots: number;
  status: string;
  deadline?: string | null;
  isCompensated?: boolean;
  compensationDetails?: string | null;
  applicationMethod?: string;
  externalFormUrl?: string | null;
  _count?: { applications: number };
}

interface EventRecruitmentShowcaseProps {
  eventId: string;
  eventTitle?: string;
  headline?: string;
  description?: string;
}

export function EventRecruitmentShowcase({
  eventId,
  eventTitle,
  headline = 'Join the Organizing & Executive Team',
  description = 'Recruiting Secretariat, Executive Board, Committee Leads, and Event Staff for this convening.'
}: EventRecruitmentShowcaseProps) {
  const [config, setConfig] = useState<any>(null);
  const [posts, setPosts] = useState<EventPostItem[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDept, setSelectedDept] = useState('All');
  const [loading, setLoading] = useState(true);

  // Status check input
  const [appNumberInput, setAppNumberInput] = useState('');
  const [checkingApp, setCheckingApp] = useState(false);
  const [trackedApp, setTrackedApp] = useState<any>(null);
  const [trackError, setTrackError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [configRes, postsRes] = await Promise.all([
          fetch(`/api/events/recruit/config?eventId=${encodeURIComponent(eventId)}`),
          fetch(`/api/events/recruit/posts?eventId=${encodeURIComponent(eventId)}&status=OPEN`)
        ]);

        const configData = await configRes.json();
        const postsData = await postsRes.json();

        if (isMounted) {
          if (configData.success && configData.config) {
            setConfig(configData.config);
          }
          if (postsData.success && postsData.posts) {
            setPosts(postsData.posts);
            setDepartments(postsData.departments || []);
          }
        }
      } catch (err) {
        console.error('Failed to load recruitment data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const handleTrackApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appNumberInput.trim()) return;

    setCheckingApp(true);
    setTrackError(null);
    setTrackedApp(null);

    try {
      const res = await fetch(`/api/events/recruit/applications?applicationNumber=${encodeURIComponent(appNumberInput.trim().toUpperCase())}`);
      const data = await res.json();
      if (data.success && data.application) {
        setTrackedApp(data.application);
      } else {
        setTrackError(data.error || 'No application matches that reference number.');
      }
    } catch (err: any) {
      setTrackError('Could not verify application status. Please check your network.');
    } finally {
      setCheckingApp(false);
    }
  };

  const filteredPosts = selectedDept === 'All'
    ? posts
    : posts.filter((p) => p.department === selectedDept);

  const isGoogleEmbed = config?.method === 'GOOGLE_FORMS_EMBED' && config?.googleFormsUrl;
  const isGoogleLink = (config?.method === 'GOOGLE_FORMS_LINK' || config?.method === 'EXTERNAL_URL') && config?.googleFormsUrl;

  return (
    <div className="space-y-8 text-left">
      {/* Recruitment Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#090c16] border border-white/10 space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-white font-mono text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-3 h-3 text-white" />
            <span>Staff Recruitment Open</span>
          </span>
          <span className="text-[11px] font-mono text-neutral-400">
            {posts.length} Active Vacancies
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
          {config?.headline || headline}
        </h2>
        <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl font-light leading-relaxed">
          {config?.description || description}
        </p>

        {/* Action Link to Full Dedicated Portal */}
        <div className="pt-2">
          <Link
            href={`/events/${eventId}/recruit`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition shadow-sm"
          >
            <span>Open Dedicated Recruitment Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Embedded Google Form Option */}
      {isGoogleEmbed && (
        <div className="p-6 rounded-3xl bg-[#090c16] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-base font-bold text-white font-sans">
                Official Event Application Form
              </h3>
            </div>
            <a
              href={config.googleFormsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 font-mono transition"
            >
              <span>Open in New Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="w-full bg-white rounded-2xl overflow-hidden min-h-[700px] border border-white/10">
            <iframe
              src={config.googleFormsUrl}
              className="w-full h-[750px] border-0"
              title="Event Application Form"
            >
              Loading application form...
            </iframe>
          </div>
        </div>
      )}

      {/* External Form Link Option */}
      {isGoogleLink && !isGoogleEmbed && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#090c16] border border-white/10 space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white font-sans">
              External Application Portal
            </h3>
            <p className="text-xs text-neutral-400 max-w-xl">
              This event uses an external form system for candidate evaluation. Clicking below will open the organizer's application form in a new tab.
            </p>
          </div>
          <div className="pt-2">
            <a
              href={config.googleFormsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold transition shadow-sm"
            >
              <span>Apply via Official External Form</span>
              <ExternalLink className="w-3.5 h-3.5 text-black" />
            </a>
          </div>
        </div>
      )}

      {/* Native Positions Directory */}
      <div className="space-y-4">
        {/* Department Filters */}
        {departments.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setSelectedDept('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer shrink-0 ${
                selectedDept === 'All'
                  ? 'bg-white text-black font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/5'
              }`}
            >
              All Roles ({posts.length})
            </button>
            {departments.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer shrink-0 ${
                  selectedDept === dept
                    ? 'bg-white text-black font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/5'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="p-5 rounded-2xl bg-[#090a12] border border-white/5 animate-pulse space-y-3">
                <div className="h-4 bg-white/10 rounded w-1/3" />
                <div className="h-6 bg-white/10 rounded w-2/3" />
                <div className="h-16 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPosts.length === 0 && !isGoogleEmbed && !isGoogleLink && (
          <div className="py-14 text-center space-y-3 rounded-3xl bg-[#090c16] border border-white/10 p-8 max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-white">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-bold text-base text-white">No Positions In This Category</h3>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto">
              All slots in this track may be filled or recruitment is paused.
            </p>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && filteredPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPosts.map((post) => {
              const remaining = Math.max(0, post.slots - post.filledSlots);
              const customApplyUrl = post.applicationMethod === 'EXTERNAL_URL' && post.externalFormUrl
                ? post.externalFormUrl
                : `/events/${eventId}/apply?post=${post.id}`;
              const isExternal = post.applicationMethod === 'EXTERNAL_URL' && Boolean(post.externalFormUrl);

              return (
                <div
                  key={post.id}
                  className="p-5 rounded-2xl bg-[#090a12] border border-white/10 hover:border-white/20 transition flex flex-col justify-between space-y-4 shadow-lg text-left"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-white/10 text-white border border-white/10 truncate">
                        {post.department}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {remaining} {remaining === 1 ? 'Seat Open' : 'Seats Open'}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white font-sans leading-snug">
                      {post.title}
                    </h4>

                    <p className="text-xs text-neutral-300 font-sans leading-relaxed line-clamp-3">
                      {post.description}
                    </p>

                    {/* Compensation & Deadline Row */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {post.isCompensated ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                          <Coins className="w-3 h-3 text-emerald-400" />
                          <span>{post.compensationDetails || 'Compensated Position'}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-neutral-400 border border-white/10">
                          Voluntary / Diplomatic Honors
                        </span>
                      )}

                      {post.deadline && (
                        <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-neutral-500" />
                          <span>Deadline: {new Date(post.deadline).toLocaleDateString()}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Apply Action */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-3">
                    <span className="text-[11px] font-mono text-neutral-500">
                      Standard Evaluation
                    </span>
                    {isExternal ? (
                      <a
                        href={customApplyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold font-sans transition flex items-center gap-1.5 shadow-sm"
                      >
                        <span>Apply Externally</span>
                        <ExternalLink className="w-3.5 h-3.5 text-black" />
                      </a>
                    ) : (
                      <Link
                        href={customApplyUrl}
                        className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold font-sans transition flex items-center gap-1.5 shadow-sm"
                      >
                        <span>Apply for Post</span>
                        <ArrowRight className="w-3.5 h-3.5 text-black" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Application Status Tracker */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#090c16] border border-white/10 space-y-4">
        <div className="space-y-1">
          <h3 className="font-bold text-base text-white font-sans flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Track Submitted Application</span>
          </h3>
          <p className="text-xs text-neutral-400 max-w-lg leading-relaxed">
            Already applied for a post? Enter your cryptographic reference code (e.g., <code className="text-neutral-200">APP-2026-X892</code>) to check your selection status or interview details.
          </p>
        </div>

        <form onSubmit={handleTrackApplication} className="flex flex-col sm:flex-row gap-2.5 max-w-md">
          <input
            type="text"
            placeholder="APP-2026-XXXX"
            value={appNumberInput}
            onChange={(e) => setAppNumberInput(e.target.value.toUpperCase())}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#0c0f1b] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-white/30"
          />
          <button
            type="submit"
            disabled={checkingApp || !appNumberInput.trim()}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold font-mono text-xs transition cursor-pointer disabled:opacity-50 shadow-sm shrink-0"
          >
            {checkingApp ? 'Checking...' : 'Check Status'}
          </button>
        </form>

        {trackError && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{trackError}</span>
          </div>
        )}

        {trackedApp && (
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/15 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">{trackedApp.applicationNumber}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white font-bold text-[10px] border border-white/10">
                {trackedApp.status}
              </span>
            </div>
            <div className="text-neutral-300 space-y-1 font-sans text-xs">
              <p>Post: <strong className="text-white">{trackedApp.post?.title || 'Event Post'}</strong></p>
              <p>Applicant: <strong className="text-white">{trackedApp.applicantName}</strong></p>
              <p className="text-neutral-400 text-[11px] font-mono">
                Submitted on {new Date(trackedApp.submittedAt).toLocaleDateString()}
              </p>
            </div>
            {trackedApp.status === 'OFFER_SENT' && (
              <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-white text-xs">
                🎉 Formal Appointment Offer Extended: <strong>{trackedApp.offerRole || trackedApp.post?.title}</strong>. Check your profile under Tickets &amp; Applications to accept!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
