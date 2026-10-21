'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  Building2,
  Upload,
  Link as LinkIcon,
  Copy,
  Check,
  FileText,
  AlertCircle,
  HelpCircle,
  Users,
  ExternalLink
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useZenEvents } from '@/context/ZenEventsPlatformContext';
import { useAuth } from '@/context/AuthContext';

export default function EventApplyPostPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const eventId = (params?.id as string) || '';
  const initialPostId = searchParams.get('postId') || '';

  const { getEventById, events } = useZenEvents();
  const { profile, user } = useAuth();

  const event = events.find((e) => e.id === eventId || e.slug === eventId) || getEventById(eventId);

  // Form progression
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string>(initialPostId);
  const [config, setConfig] = useState<any>(null);

  // Form fields
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [handle, setHandle] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [locationTimezone, setLocationTimezone] = useState<string>('Asia/Kolkata (IST)');
  const [motivation, setMotivation] = useState<string>('');
  const [experience, setExperience] = useState<string>('');
  const [portfolioUrl, setPortfolioUrl] = useState<string>('');
  const [resumeUrl, setResumeUrl] = useState<string>('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [declarationAgreed, setDeclarationAgreed] = useState<boolean>(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<{ applicationNumber: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Auto-populate from authenticated user profile
  useEffect(() => {
    if (profile || user) {
      if (profile?.display_name || user?.name) setFullName(profile?.display_name || user?.name || '');
      if (profile?.email || user?.email) setEmail(profile?.email || user?.email || '');
      if (profile?.username || (profile as any)?.handle) setHandle(profile?.username || (profile as any)?.handle || '');
    }
  }, [profile, user]);

  // Fetch open posts and recruitment config
  useEffect(() => {
    let isMounted = true;
    const fetchEventData = async () => {
      try {
        setLoadingPosts(true);
        const [postsRes, configRes] = await Promise.all([
          fetch(`/api/events/recruit/posts?eventId=${encodeURIComponent(eventId)}&status=OPEN`),
          fetch(`/api/events/recruit/config?eventId=${encodeURIComponent(eventId)}`)
        ]);

        const postsData = await postsRes.json();
        const configData = await configRes.json();

        if (isMounted) {
          if (postsData.success && Array.isArray(postsData.posts)) {
            setPosts(postsData.posts);
            if (!selectedPostId && postsData.posts.length > 0) {
              setSelectedPostId(postsData.posts[0].id);
            }
          }
          if (configData.success && configData.config) {
            setConfig(configData.config);
          }
        }
      } catch (err) {
        console.error('Failed to load posts', err);
      } finally {
        if (isMounted) setLoadingPosts(false);
      }
    };

    if (eventId) fetchEventData();
    return () => { isMounted = false; };
  }, [eventId]);

  const selectedPost = posts.find((p) => p.id === selectedPostId);

  // Custom questions parsed from config
  let customQuestions: any[] = [];
  try {
    if (config?.formSchemaJson) {
      customQuestions = typeof config.formSchemaJson === 'string'
        ? JSON.parse(config.formSchemaJson)
        : config.formSchemaJson;
    }
  } catch (_) {}

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPostId) {
      setSubmitError('Please select a position to apply for.');
      return;
    }

    if (!fullName.trim() || !email.trim()) {
      setSubmitError('Please provide your full name and email address.');
      return;
    }

    if (!declarationAgreed) {
      setSubmitError('Please accept the declaration before submitting your application.');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const payload = {
        eventId,
        postId: selectedPostId,
        applicantId: user?.id || profile?.id || null,
        applicantName: fullName.trim(),
        applicantEmail: email.trim().toLowerCase(),
        applicantHandle: handle ? handle.trim().replace(/^@/, '') : null,
        applicantPhone: phone ? phone.trim() : null,
        experience: experience.trim(),
        motivation: motivation.trim(),
        portfolioUrl: portfolioUrl.trim(),
        resumeUrl: resumeUrl.trim(),
        answers: {
          ...answers,
          locationTimezone
        }
      };

      const res = await fetch('/api/events/recruit/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success && data.applicationNumber) {
        setSubmissionResult({ applicationNumber: data.applicationNumber });
      } else {
        setSubmitError(data.error || 'Failed to submit application. Please try again.');
      }
    } catch (_) {
      setSubmitError('Network error while transmitting application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── STEP PROGRESSION VALIDATIONS ───
  const canGoToStep2 = Boolean(selectedPostId);
  const canGoToStep3 = Boolean(fullName.trim() && email.trim());
  const canGoToStep4 = Boolean(motivation.trim() || experience.trim());

  return (
    <div className="min-h-screen bg-[#06080e] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 pt-24 pb-20">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-6">
          <Link
            href={`/events/${eventId}/recruit`}
            className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Open Positions</span>
          </Link>

          <span className="text-[11px] font-mono text-neutral-500">
            Staff Recruitment Portal
          </span>
        </div>

        {/* ─── SUCCESS SCREEN ─── */}
        {submissionResult ? (
          <div className="p-8 sm:p-10 rounded-3xl bg-[#090a12] border border-white/10 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-white">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-2">
              <h2 className="font-sans font-bold text-2xl text-white">Application Successfully Submitted</h2>
              <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                Your application for <strong className="text-white">{selectedPost?.title}</strong> has been securely logged in the conference recruitment ledger.
              </p>
            </div>

            {/* Reference ID Card */}
            <div className="p-5 rounded-2xl bg-black/60 border border-white/10 max-w-sm mx-auto space-y-2">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block font-bold">
                APPLICATION REFERENCE CODE
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-xl font-bold text-white tracking-widest">
                  {submissionResult.applicationNumber}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(submissionResult.applicationNumber);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white transition cursor-pointer"
                  title="Copy Reference Code"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Next Steps Guide */}
            <div className="text-left p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 max-w-lg mx-auto text-xs">
              <span className="text-[11px] font-mono font-bold text-white uppercase block">What Happens Next?</span>
              <div className="space-y-2 text-neutral-400">
                <div className="flex items-start gap-2">
                  <span className="font-mono text-white">1.</span>
                  <span><strong>Secretariat Review:</strong> Assigned reviewers will evaluate your credentials and portfolio.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-white">2.</span>
                  <span><strong>Interview Call:</strong> If shortlisted, you will receive an interview schedule invitation.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono text-white">3.</span>
                  <span><strong>Appointment Offer:</strong> Final decisions and official appointment offers will appear on your tracking page.</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href={`/events/${eventId}/recruit`}
                className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition cursor-pointer shadow-sm"
              >
                Track on Event Recruitment Page
              </Link>

              <Link
                href={`/events/${eventId}`}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono transition"
              >
                Return to Event Overview
              </Link>
            </div>
          </div>
        ) : (
          /* ─── MULTI-STEP APPLICATION FORM ─── */
          <div className="space-y-6">
            
            {/* Form Header */}
            <div className="p-6 rounded-3xl bg-[#090a12] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-sans font-bold text-xl text-white">Event Staff Application</h1>
                  <p className="text-xs text-neutral-400">{event?.title || 'ZENVITRA Convening'}</p>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/10 text-white border border-white/10">
                  Step {currentStep} of 4
                </span>
              </div>

              {/* 4-Step Progress Ribbon */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                {[
                  { step: 1, label: 'Position' },
                  { step: 2, label: 'Profile' },
                  { step: 3, label: 'Experience' },
                  { step: 4, label: 'Submit' }
                ].map((item) => (
                  <div
                    key={item.step}
                    className={`h-1.5 rounded-full transition-all ${
                      currentStep >= item.step ? 'bg-white' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>

            {submitError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-mono text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitApplication} className="space-y-6">
              
              {/* ─── STEP 1: SELECT POSITION & REVIEW REQUIREMENTS ─── */}
              {currentStep === 1 && (
                <div className="p-6 sm:p-7 rounded-3xl bg-[#090a12] border border-white/10 space-y-6">
                  <div>
                    <h3 className="font-sans font-bold text-base text-white">1. Select Target Position</h3>
                    <p className="text-xs text-neutral-400">Choose the role or department you wish to serve in.</p>
                  </div>

                  {loadingPosts && (
                    <div className="py-8 text-center text-xs font-mono text-neutral-500">
                      Loading available positions...
                    </div>
                  )}

                  {!loadingPosts && posts.length === 0 && (
                    <div className="py-8 text-center text-xs font-mono text-neutral-400">
                      No open positions currently available for this event.
                    </div>
                  )}

                  {!loadingPosts && posts.length > 0 && (
                    <div className="space-y-3">
                      {posts.map((post) => {
                        const isSelected = selectedPostId === post.id;
                        const spotsRemaining = Math.max(0, (post.slots || 1) - (post.filledSlots || 0));

                        return (
                          <div
                            key={post.id}
                            onClick={() => setSelectedPostId(post.id)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-white/5 border-white shadow-sm'
                                : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                            }`}
                          >
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-white">
                                  {post.department}
                                </span>
                                <h4 className="font-bold text-sm text-white">{post.title}</h4>
                              </div>
                              <p className="text-xs text-neutral-400 line-clamp-1">{post.description}</p>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono text-neutral-400">
                                {spotsRemaining} spot{spotsRemaining === 1 ? '' : 's'}
                              </span>
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                isSelected ? 'bg-white border-white text-black' : 'border-white/20'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {selectedPost && (
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold text-white uppercase block">
                          Selected Role: {selectedPost.title}
                        </span>
                        {selectedPost.isCompensated ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {selectedPost.compensationDetails || 'Stipend / Compensated'}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-neutral-400">
                            Voluntary Post
                          </span>
                        )}
                      </div>
                      <p className="text-neutral-300 leading-relaxed">{selectedPost.description}</p>
                    </div>
                  )}

                  {selectedPost?.applicationMethod === 'GOOGLE_FORMS' && selectedPost?.externalFormUrl && (
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h4 className="font-sans font-bold text-sm text-white">Google Forms Application Intake</h4>
                          <p className="text-xs text-neutral-400">Complete the form below or open in a new tab.</p>
                        </div>
                        <a
                          href={selectedPost.externalFormUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-sans font-bold text-xs transition shrink-0"
                        >
                          <span>Open Form in New Tab</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <div className="w-full h-[650px] rounded-xl overflow-hidden border border-white/10 bg-white">
                        <iframe
                          src={selectedPost.externalFormUrl}
                          className="w-full h-full border-0"
                          title="Google Form"
                        />
                      </div>
                    </div>
                  )}

                  {selectedPost?.applicationMethod === 'EXTERNAL' && selectedPost?.externalFormUrl && (
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-white">
                        <ExternalLink className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-sans font-bold text-base text-white">External Application Portal</h4>
                        <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                          This role requires submitting via the host organization&apos;s external portal. Click below to continue.
                        </p>
                      </div>
                      <a
                        href={selectedPost.externalFormUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-sans font-bold text-xs transition shadow-sm"
                      >
                        <span>Go to Application Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/10 flex justify-end">
                    <button
                      type="button"
                      disabled={!canGoToStep2}
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition cursor-pointer flex items-center gap-2 disabled:opacity-50 shadow-sm"
                    >
                      <span>
                        {selectedPost?.applicationMethod === 'GOOGLE_FORMS' || selectedPost?.applicationMethod === 'EXTERNAL'
                          ? 'Continue with ZENVITRA Application'
                          : 'Proceed to Profile Details'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* ─── STEP 2: APPLICANT PROFILE DETAILS ─── */}
              {currentStep === 2 && (
                <div className="p-6 sm:p-7 rounded-3xl bg-[#090a12] border border-white/10 space-y-6">
                  <div>
                    <h3 className="font-sans font-bold text-base text-white">2. Candidate Information</h3>
                    <p className="text-xs text-neutral-400">Provide verified contact channels for interview scheduling.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="space-y-1.5">
                      <label className="text-neutral-300 font-semibold block">Full Legal / Display Name *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/40"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-neutral-300 font-semibold block">Official Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. john@university.edu"
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/40"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-neutral-300 font-semibold block">ZENVITRA / Telegram Handle</label>
                      <input
                        type="text"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        placeholder="@username"
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/40"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-neutral-300 font-semibold block">WhatsApp / Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/40"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-neutral-300 font-semibold block">Location &amp; Primary Timezone</label>
                      <input
                        type="text"
                        value={locationTimezone}
                        onChange={(e) => setLocationTimezone(e.target.value)}
                        placeholder="e.g. New Delhi, India (Asia/Kolkata)"
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/40"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-4 py-2.5 rounded-xl bg-white/5 text-neutral-400 hover:text-white text-xs font-mono transition"
                    >
                      Back to Position
                    </button>

                    <button
                      type="button"
                      disabled={!canGoToStep3}
                      onClick={() => setCurrentStep(3)}
                      className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition cursor-pointer flex items-center gap-2 disabled:opacity-50 shadow-sm"
                    >
                      <span>Proceed to Experience</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* ─── STEP 3: MOTIVATION & RELEVANT EXPERIENCE ─── */}
              {currentStep === 3 && (
                <div className="p-6 sm:p-7 rounded-3xl bg-[#090a12] border border-white/10 space-y-6">
                  <div>
                    <h3 className="font-sans font-bold text-base text-white">3. Motivation &amp; Credentials</h3>
                    <p className="text-xs text-neutral-400">Tell the organizers why you are the best fit for this role.</p>
                  </div>

                  <div className="space-y-4 text-xs font-mono">
                    <div className="space-y-1.5">
                      <label className="text-neutral-300 font-semibold block">
                        Statement of Motivation / Why this role? *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={motivation}
                        onChange={(e) => setMotivation(e.target.value)}
                        placeholder="Explain why you want to serve in this position, your vision for the committee or team, and what unique value you bring..."
                        className="w-full p-4 rounded-xl bg-black/60 border border-white/15 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/40 font-sans leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-neutral-300 font-semibold block">
                        Past Experience &amp; Relevant Event Roles *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="List relevant Model UN conferences, dais appointments, organizing roles, leadership responsibilities, or technical skills..."
                        className="w-full p-4 rounded-xl bg-black/60 border border-white/15 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/40 font-sans leading-relaxed"
                      />
                    </div>

                    {/* Custom Organizer Questions */}
                    {customQuestions.map((q) => (
                      <div key={q.id} className="space-y-1.5 pt-2">
                        <label className="text-neutral-300 font-semibold block">
                          {q.label} {q.required && '*'}
                        </label>
                        {q.type === 'long_answer' ? (
                          <textarea
                            rows={3}
                            required={q.required}
                            value={answers[q.id] || ''}
                            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                            className="w-full p-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/40 font-sans"
                          />
                        ) : (
                          <input
                            type="text"
                            required={q.required}
                            value={answers[q.id] || ''}
                            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/40 font-sans"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-4 py-2.5 rounded-xl bg-white/5 text-neutral-400 hover:text-white text-xs font-mono transition"
                    >
                      Back to Profile
                    </button>

                    <button
                      type="button"
                      disabled={!canGoToStep4}
                      onClick={() => setCurrentStep(4)}
                      className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition cursor-pointer flex items-center gap-2 disabled:opacity-50 shadow-sm"
                    >
                      <span>Proceed to Portfolio &amp; Review</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* ─── STEP 4: PORTFOLIO, DECLARATION & SUBMISSION ─── */}
              {currentStep === 4 && (
                <div className="p-6 sm:p-7 rounded-3xl bg-[#090a12] border border-white/10 space-y-6">
                  <div>
                    <h3 className="font-sans font-bold text-base text-white">4. Portfolio, Verification &amp; Declaration</h3>
                    <p className="text-xs text-neutral-400">Attach supporting proof and confirm your commitment.</p>
                  </div>

                  <div className="space-y-4 text-xs font-mono">
                    <div className="space-y-1.5">
                      <label className="text-neutral-300 font-semibold flex items-center gap-1.5">
                        <LinkIcon className="w-3.5 h-3.5 text-white" />
                        <span>Portfolio, Study Guide, or Work Sample URL</span>
                      </label>
                      <input
                        type="url"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        placeholder="https://drive.google.com/... or personal site"
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/40"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-neutral-300 font-semibold flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-white" />
                        <span>Curriculum Vitae / Resume URL (Optional)</span>
                      </label>
                      <input
                        type="url"
                        value={resumeUrl}
                        onChange={(e) => setResumeUrl(e.target.value)}
                        placeholder="https://drive.google.com/file/d/..."
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/40"
                      />
                    </div>

                    {/* Summary Box */}
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-neutral-300">
                      <span className="text-[10px] uppercase font-bold text-white block">Application Summary</span>
                      <div className="space-y-1">
                        <div><strong>Target Role:</strong> {selectedPost?.title} ({selectedPost?.department})</div>
                        <div><strong>Candidate:</strong> {fullName} ({email})</div>
                      </div>
                    </div>

                    {/* Declaration Checkbox */}
                    <label className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10 cursor-pointer text-neutral-300 select-none">
                      <input
                        type="checkbox"
                        checked={declarationAgreed}
                        onChange={(e) => setDeclarationAgreed(e.target.checked)}
                        className="mt-0.5 rounded border-white/20 text-white focus:ring-0 cursor-pointer"
                      />
                      <span className="text-[11px] leading-relaxed">
                        I hereby declare that all information provided in this application is accurate and verifiable. If appointed, I agree to uphold the code of conduct, confidentiality, and responsibilities associated with this convening.
                      </span>
                    </label>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="px-4 py-2.5 rounded-xl bg-white/5 text-neutral-400 hover:text-white text-xs font-mono transition"
                    >
                      Back to Experience
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting || !declarationAgreed}
                      className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition cursor-pointer flex items-center gap-2 disabled:opacity-50 shadow-sm"
                    >
                      {isSubmitting ? (
                        <span>Transmitting Application...</span>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 fill-black" />
                          <span>Submit Application</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </form>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
