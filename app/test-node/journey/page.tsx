'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Compass,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Shield,
  Layers,
  RotateCcw,
  ExternalLink,
  Lock,
  UserCheck,
  AlertCircle,
  Play,
  FileText,
  CreditCard,
  Building,
  Radio,
  Flame,
  MessageSquare,
  Award,
  Globe2,
  Download,
  Share2,
  Heart,
  Vote,
  Mic,
  Video,
  Gavel,
  LogOut,
  ChevronRight,
  Copy,
  Check
} from 'lucide-react';
import { TestNodeProvider, useTestNode } from '@/context/TestNodeContext';
import { TestNodeShell } from '@/components/test-node/TestNodeShell';
import { useJourney } from '@/context/JourneyContext';
import {
  JOURNEY_STEPS,
  JourneyStepId,
  DemoRole,
  DEMO_PERSONAS,
  DemoPersonaProfile
} from '@/lib/test-node/journeyStateMachine';
import { daisAudio } from '@/lib/daisAudio';

function GuidedJourneyConsole() {
  const router = useRouter();
  const testNode = useTestNode();
  const {
    session,
    currentStep,
    nextStep,
    prevStep,
    progressPercentage,
    activeRole,
    activePersona,
    setRole,
    completeCurrentStep,
    skipCurrentStep,
    goBackStep,
    jumpToStep,
    recordInteraction,
    resetJourney,
    startGuidedDemo,
    setMode,
  } = useJourney();

  // Local state helpers for interactive steps
  const [selectedRole, setSelectedRole] = useState<DemoRole>(activeRole);
  const [commentText, setCommentText] = useState('');
  const [votedPollOption, setVotedPollOption] = useState<number | null>(null);
  const [regForm, setRegForm] = useState({
    committee: 'AIPPM',
    portfolio1: 'Ministry of Youth Affairs & Sports',
    portfolio2: 'Opposition Spokesperson',
    portfolio3: 'Independent MP',
    motivation: 'Committed to advancing bipartisan youth welfare and education frameworks in parliamentary debate.',
  });
  const [regSubmitted, setRegSubmitted] = useState(false);

  // Payment mock states
  const [paySimState, setPaySimState] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'REFUNDED'>('IDLE');
  const [payReceiptId, setPayReceiptId] = useState<string | null>(null);

  // Secretariat step states
  const [ebActionTaken, setEbActionTaken] = useState<'APPROVED' | 'REJECTED' | null>(null);
  const [secAnnouncement, setSecAnnouncement] = useState('Delegates: Committee background guides and rulebooks are now published in ZEN.DOCS.');
  const [secAnnounced, setSecAnnounced] = useState(false);

  // Committee step states
  const [motionRaised, setMotionRaised] = useState(false);
  const [speakerJoined, setSpeakerJoined] = useState(false);
  const [resolutionVote, setResolutionVote] = useState<'AYE' | 'NAY' | 'ABSTAIN' | null>(null);

  // Chat & Meet states
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; handle: string; text: string; time: string; isUser: boolean }>>([
    {
      sender: 'Rohan Mehra',
      handle: '@rohan.eb',
      text: 'Good morning delegates. All India Political Parties Meet (AIPPM) convenes in 15 minutes. Review your position papers.',
      time: '10:00 AM',
      isUser: false,
    },
  ]);
  const [meetAudioOn, setMeetAudioOn] = useState(false);
  const [meetVideoOn, setMeetVideoOn] = useState(false);

  // Policy draft states
  const [policyClause, setPolicyClause] = useState('Mandates the creation of a National Student Mental Health Ombudsman across higher education institutes with quarterly parliamentary auditing.');
  const [policyVoteCast, setPolicyVoteCast] = useState<'AYE' | 'NAY' | null>(null);
  const [docExported, setDocExported] = useState(false);

  // Copy helper
  const [copied, setCopied] = useState(false);

  /* ------------------------------------------------------------- */
  /* STEP 0: J00_DISCOVER                                          */
  /* ------------------------------------------------------------- */
  const renderStep0 = () => (
    <div className="space-y-6 text-center max-w-3xl mx-auto py-8">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
        <span>Step 1 of 12 • Test Node Emergence</span>
      </div>

      <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">
        Discover the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">ZENVITRA Test Node</span>
      </h1>

      <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl mx-auto">
        Experience a parallel digital universe populated with synthetic Model UN conferences, dais chambers, Cashfree mock checkouts, and democratic policy drafting studios.
      </p>

      {/* Isolation Guarantee Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-cyan-950/40 border border-cyan-500/30 text-left space-y-3 shadow-xl">
        <div className="flex items-center gap-2.5 text-cyan-300 font-bold text-xs uppercase tracking-wider font-mono">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>Strict Sandbox Isolation Architecture</span>
        </div>
        <p className="text-xs text-neutral-300 leading-relaxed">
          The Test Node operates strictly in isolated client storage. Zero mock accounts, zero mock conferences, and zero fake transactions ever touch the live ZENVITRA database.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px] font-mono">
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-neutral-300">
            <span className="text-cyan-400 font-bold block">100% Synthetic</span>
            Seeded conferences & delegates
          </div>
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-neutral-300">
            <span className="text-emerald-400 font-bold block">Zero Real Money</span>
            Simulated Cashfree PG flows
          </div>
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-neutral-300">
            <span className="text-indigo-400 font-bold block">Zero Prod Writes</span>
            Isolated localStorage state
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          type="button"
          onClick={() => {
            startGuidedDemo();
            recordInteraction({ hasLikedPost: false });
          }}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 text-black font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:scale-105 transition cursor-pointer"
        >
          <span>START GUIDED DEMO (12 Steps)</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setMode('FREE_EXPLORE')}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <span>EXPLORE FREELY</span>
        </button>
      </div>
    </div>
  );

  /* ------------------------------------------------------------- */
  /* STEP 1: J01_IDENTITY                                          */
  /* ------------------------------------------------------------- */
  const renderStep1 = () => (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-xs font-bold uppercase">
            Step 2 of 12 • Identity Selection
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-1">
            Enter as a Demo Diplomat
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Select your simulated persona to experience ZENVITRA from different role perspectives.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.keys(DEMO_PERSONAS) as DemoRole[]).map((r) => {
          const p = DEMO_PERSONAS[r];
          const isSelected = selectedRole === r;

          return (
            <div
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer text-left relative ${
                isSelected
                  ? 'bg-blue-500/10 border-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.25)] ring-1 ring-blue-400'
                  : 'bg-slate-900/40 border-white/10 hover:border-white/20'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-blue-500 text-white font-mono text-[10px] font-bold uppercase">
                  Active Choice
                </div>
              )}

              <div className="flex items-center gap-3.5">
                <img
                  src={p.avatar}
                  alt={p.name}
                  className="w-12 h-12 rounded-xl object-cover border border-white/20"
                />
                <div>
                  <h3 className="font-bold text-white text-base">{p.name}</h3>
                  <div className="text-cyan-400 font-mono text-xs">{p.handle}</div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300 font-mono text-[10px] uppercase font-semibold">
                    {p.roleTitle}
                  </span>
                </div>
              </div>

              <p className="text-xs text-neutral-400 mt-3 leading-relaxed">
                {p.bio}
              </p>

              <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-1.5">
                {p.credentials.map((c, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-mono text-[9px]">
                    ✓ {c}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-neutral-400 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            Selected: <strong className="text-white">{DEMO_PERSONAS[selectedRole].name}</strong> ({DEMO_PERSONAS[selectedRole].roleTitle})
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            setRole(selectedRole);
            completeCurrentStep();
          }}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-blue-500/25"
        >
          <span>Confirm Demo Persona & Continue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  /* ------------------------------------------------------------- */
  /* STEP 2: J02_PULSE                                             */
  /* ------------------------------------------------------------- */
  const renderStep2 = () => {
    const post = testNode.posts[0] || {
      id: 'post_1',
      authorName: 'Aanya Sharma',
      authorHandle: '@aanya.demo',
      authorRole: 'Chief Delegate',
      content: 'Drafting resolution clauses for AIPPM on National Youth Public Health. Key priority: Mandatory student mental health ombudsmen across all central educational universities.',
      likes: 24,
      commentsCount: 8,
      timestamp: '1 hour ago',
    };

    return (
      <div className="space-y-6 max-w-4xl mx-auto py-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold uppercase">
              Step 3 of 12 • ZEN.PULSE & ZEN.PASSPORT
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-1">
              Synthetic Civic Discussions & Digital Passports
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Engage with simulated public dispatches, vote in policy polls, and inspect your diplomatic credentials.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Post Interaction Card */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold">
                    AS
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{post.authorName}</h4>
                    <div className="text-cyan-400 font-mono text-xs">{post.authorHandle} • {post.timestamp}</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold uppercase">
                  Verified Dispatch
                </span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans">
                {post.content}
              </p>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    testNode.likePost(post.id);
                    recordInteraction({ hasLikedPost: true });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    session.interactions.hasLikedPost
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${session.interactions.hasLikedPost ? 'fill-rose-400' : ''}`} />
                  <span>{post.likes + (session.interactions.hasLikedPost ? 1 : 0)} Likes</span>
                </button>

                <div className="text-xs font-mono text-neutral-500">
                  {post.commentsCount} Comments
                </div>
              </div>

              {/* Comment Input */}
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add a simulated diplomatic comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (commentText.trim()) {
                      recordInteraction({ hasCommented: true });
                      setCommentText('');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase font-mono transition cursor-pointer"
                >
                  Post
                </button>
              </div>

              {session.interactions.hasCommented && (
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Comment recorded in sandbox session!</span>
                </div>
              )}
            </div>

            {/* Simulated Policy Poll */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3 text-left">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
                <Vote className="w-4 h-4" />
                <span>Youth Governance Live Poll</span>
              </div>
              <h4 className="text-sm font-bold text-white">
                Should simulated Model UN resolution clauses automatically sync into the national policy archive?
              </h4>

              <div className="space-y-2 pt-1">
                {[
                  { text: 'Yes, full democratic synthesis & archival', votes: 76 },
                  { text: 'Yes, subject to Executive Board verification', votes: 19 },
                  { text: 'No, keep simulation separate from real archives', votes: 5 },
                ].map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setVotedPollOption(idx);
                      recordInteraction({ hasVotedPoll: true });
                    }}
                    className={`w-full p-3 rounded-xl border text-xs text-left transition flex items-center justify-between cursor-pointer ${
                      votedPollOption === idx
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold'
                        : 'bg-black/30 border-white/5 hover:border-white/15 text-neutral-300'
                    }`}
                  >
                    <span>{opt.text}</span>
                    <span className="font-mono text-[11px] text-neutral-400">
                      {votedPollOption === idx ? `${opt.votes + 1}%` : `${opt.votes}%`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Passport Digital Credentials Preview */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c1427] to-[#060913] border border-cyan-500/30 text-left space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase">
                  ZEN.PASSPORT • ID #ZN-9941
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold">
                  VERIFIED ENVOY
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={activePersona.avatar}
                  alt={activePersona.name}
                  className="w-12 h-12 rounded-xl object-cover border border-cyan-400"
                />
                <div>
                  <h4 className="font-bold text-white text-sm">{activePersona.name}</h4>
                  <div className="text-cyan-400 font-mono text-xs">{activePersona.handle}</div>
                  <div className="text-neutral-400 font-mono text-[10px]">{activePersona.organization}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Trust Score:</span>
                  <span className="text-cyan-400 font-bold">98.4 / 100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Conferences Attended:</span>
                  <span className="text-white font-bold">8 Summits</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Resolutions Passed:</span>
                  <span className="text-emerald-400 font-bold">14 Adopted</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => recordInteraction({ hasViewedPassport: true })}
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-bold uppercase flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-cyan-400" />
                <span>Verify Credentials & Signatures</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={goBackStep}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-bold uppercase font-mono flex items-center gap-1.5 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={completeCurrentStep}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            <span>Proceed to Demo MUN Discovery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  /* ------------------------------------------------------------- */
  /* STEP 3: J03_EVENT                                             */
  /* ------------------------------------------------------------- */
  const renderStep3 = () => (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      <div>
        <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-mono text-xs font-bold uppercase">
          Step 4 of 12 • ZEN.MUN Discovery
        </span>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-1">
          Discover & Register for ZENVITRA DEMO MUN 2026
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Inspect conference agenda, select your committee, and submit a simulated delegate application.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-violet-950/30 border border-violet-500/30 space-y-4 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <span className="px-2.5 py-0.5 rounded bg-violet-500/20 text-violet-300 font-mono text-[10px] font-bold uppercase">
              Flagship Summit
            </span>
            <h3 className="font-display font-black text-xl sm:text-2xl text-white mt-1 uppercase">
              ZENVITRA DEMO MUN 2026
            </h3>
            <p className="text-xs text-neutral-300 font-mono mt-0.5">
              Venue: Vigyan Bhawan Convention Center • Hybrid Matrix
            </p>
          </div>
          <div className="text-right font-mono text-xs">
            <span className="text-neutral-400">Pass Fee: </span>
            <span className="text-violet-400 font-bold text-base">₹199</span>
            <div className="text-[10px] text-neutral-500">100% Mock Simulated Fee</div>
          </div>
        </div>

        {/* Committee Selection Tabs */}
        <div>
          <label className="text-xs font-mono text-neutral-400 block mb-2">
            Select Your Target Committee Chamber:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'AIPPM', name: 'All India Political Parties Meet (AIPPM)', agenda: 'Review of Electoral Reforms & National Youth Welfare Act 2026' },
              { id: 'UNSC', name: 'United Nations Security Council (UNSC)', agenda: 'Autonomous Weapons Systems & Cyber-Sovereignty Protocols' },
              { id: 'UNHRC', name: 'United Nations Human Rights Council', agenda: 'Digital Privacy in Mass Algorithmic Surveillance Regimes' },
              { id: 'CRISIS', name: 'Historic Crisis Cabinet (HCC)', agenda: 'De-escalation of the 1974 Non-Proliferation Diplomatic Standoff' },
            ].map((c) => (
              <div
                key={c.id}
                onClick={() => setRegForm({ ...regForm, committee: c.id })}
                className={`p-3.5 rounded-xl border transition cursor-pointer text-left ${
                  regForm.committee === c.id
                    ? 'bg-violet-500/20 border-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                    : 'bg-black/30 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="font-bold text-white text-xs">{c.name}</div>
                <div className="text-[11px] text-neutral-400 mt-1">{c.agenda}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Simulated Registration Form */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3 pt-4">
          <h4 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-violet-400" />
            <span>Simulated Delegate Application Form</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-mono text-neutral-400 block mb-1">Portfolio Preference 1</label>
              <input
                type="text"
                value={regForm.portfolio1}
                onChange={(e) => setRegForm({ ...regForm, portfolio1: e.target.value })}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-neutral-400 block mb-1">Portfolio Preference 2</label>
              <input
                type="text"
                value={regForm.portfolio2}
                onChange={(e) => setRegForm({ ...regForm, portfolio2: e.target.value })}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-neutral-400 block mb-1">Portfolio Preference 3</label>
              <input
                type="text"
                value={regForm.portfolio3}
                onChange={(e) => setRegForm({ ...regForm, portfolio3: e.target.value })}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono text-neutral-400 block mb-1">Delegate Statement of Intent</label>
            <textarea
              rows={2}
              value={regForm.motivation}
              onChange={(e) => setRegForm({ ...regForm, motivation: e.target.value })}
              className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white resize-none"
            />
          </div>

          {!regSubmitted ? (
            <button
              type="button"
              onClick={() => {
                setRegSubmitted(true);
                recordInteraction({
                  registeredCommitteeId: regForm.committee,
                  registrationName: activePersona.name,
                });
              }}
              className="w-full py-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-violet-500/25"
            >
              Submit Simulated Application
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-300 font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Application Approved: #APP-2026-AIPPM-088</span>
              </div>
              <span className="text-[10px] text-neutral-400">Sandbox Record Created</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={goBackStep}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-bold uppercase font-mono flex items-center gap-1.5 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <button
          type="button"
          onClick={completeCurrentStep}
          className="px-6 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-lg shadow-violet-500/20"
        >
          <span>Advance to Mock Payment Simulation</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  /* ------------------------------------------------------------- */
  /* STEP 4: J04_PAYMENT                                           */
  /* ------------------------------------------------------------- */
  const renderStep4 = () => (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      <div>
        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold uppercase">
          Step 5 of 12 • ZEN.PAY Mock Simulator
        </span>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-1">
          Simulate Cashfree Checkout & Receive Invoice
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Test ₹199 delegate pass payment across success, pending, failure, and refund scenarios with ZERO real money.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mock Payment Gateway Terminal */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-amber-500/30 text-left space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-amber-400 font-bold uppercase flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" />
              <span>Simulated Cashfree PG</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono text-[9px] font-bold uppercase">
              100% Mock Mode
            </span>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-neutral-400">Order ID:</span>
              <span className="text-white">CF_ORDER_DEMO_2026_991</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Delegate:</span>
              <span className="text-cyan-400">{activePersona.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Pass Type:</span>
              <span className="text-white">AIPPM Delegate Delegate Pass</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-white/10">
              <span className="text-neutral-300 font-bold">Total Due:</span>
              <span className="text-amber-400 font-black">₹199.00</span>
            </div>
          </div>

          {/* Simulation Trigger Buttons */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-neutral-400 block">Trigger Simulated PG State:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={async () => {
                  setPaySimState('PROCESSING');
                  const txn = await testNode.simulatePayment(199, activePersona.name, 'AIPPM', 'UPI_COLLECT');
                  setPayReceiptId(txn.id);
                  setPaySimState('SUCCESS');
                  recordInteraction({ paymentStatus: 'SUCCESS', paymentTxnId: txn.id });
                }}
                className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold transition cursor-pointer"
              >
                ✓ Simulate Success
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaySimState('FAILED');
                  recordInteraction({ paymentStatus: 'FAILED' });
                }}
                className="p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold transition cursor-pointer"
              >
                ✕ Simulate Failure
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaySimState('PROCESSING');
                  recordInteraction({ paymentStatus: 'PENDING' });
                }}
                className="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold transition cursor-pointer"
              >
                ⏳ Simulate Pending
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaySimState('REFUNDED');
                  recordInteraction({ paymentStatus: 'REFUNDED' });
                }}
                className="p-2.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-300 font-mono text-xs font-bold transition cursor-pointer"
              >
                ↺ Simulate Refund
              </button>
            </div>
          </div>
        </div>

        {/* Generated Watermarked Invoice & Pass Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c1427] to-[#070b14] border border-white/10 text-left space-y-4 shadow-xl relative overflow-hidden">
          {/* Prominent Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-5 rotate-[-25deg]">
            <span className="text-5xl font-black font-mono text-white tracking-widest uppercase">
              DEMO RECEIPT ONLY
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase">
                INVOICE • {payReceiptId || 'DEMO-INV-1001'}
              </span>
              <div className="text-white font-bold text-sm">ZENVITRA DEMO MUN 2026</div>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
              paySimState === 'SUCCESS'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : paySimState === 'FAILED'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : paySimState === 'REFUNDED'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {paySimState === 'IDLE' ? 'READY' : paySimState}
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono text-neutral-300">
            <div className="flex justify-between">
              <span className="text-neutral-500">Billed To:</span>
              <span className="text-white">{activePersona.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Method:</span>
              <span className="text-white">Cashfree UPI (Simulated)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Status:</span>
              <span className="text-emerald-400 font-bold">
                {paySimState === 'SUCCESS' ? 'PAID IN FULL (₹199)' : 'PENDING SIMULATION'}
              </span>
            </div>
          </div>

          {/* Access Pass QR preview */}
          <div className="p-3 rounded-xl bg-black/50 border border-white/5 flex items-center gap-3">
            <div className="w-14 h-14 bg-white p-1 rounded-lg flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-900 rounded grid grid-cols-3 gap-0.5 p-1">
                <div className="bg-white rounded-xs" />
                <div className="bg-transparent" />
                <div className="bg-white rounded-xs" />
                <div className="bg-white rounded-xs" />
                <div className="bg-white rounded-xs" />
                <div className="bg-transparent" />
                <div className="bg-white rounded-xs" />
                <div className="bg-transparent" />
                <div className="bg-white rounded-xs" />
              </div>
            </div>
            <div className="text-[11px] font-mono">
              <div className="text-white font-bold">DELEGATE ACCESS PASS</div>
              <div className="text-neutral-400">Pass Code: PASS-AIPPM-9941</div>
              <div className="text-cyan-400 text-[10px]">Tap at Dais Chamber Gate</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={goBackStep}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-bold uppercase font-mono flex items-center gap-1.5 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <button
          type="button"
          onClick={() => {
            // Auto switch role to SECRETARIAT as step 6 demands
            setRole('SECRETARIAT');
            completeCurrentStep();
          }}
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-lg shadow-amber-500/20"
        >
          <span>Switch to Secretariat Perspective</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  /* ------------------------------------------------------------- */
  /* STEP 5: J05_SECRETARIAT                                       */
  /* ------------------------------------------------------------- */
  const renderStep5 = () => {
    const app = testNode.ebApplications[0] || {
      id: 'eb_1',
      applicantName: 'Rohan Mehra',
      email: 'rohan.m@ststephens.edu',
      preferredCommittee: 'AIPPM (Chairperson)',
      priorExperience: 'Chaired 8 conferences including Harvard MUN simulation and Delhi University Model Parliament.',
      status: 'PENDING_REVIEW' as const,
      appliedDate: '2026-10-10',
    };

    return (
      <div className="space-y-6 max-w-4xl mx-auto py-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-xs font-bold uppercase">
            Step 6 of 12 • ZEN.SEC Management
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-1">
            Executive Recruitment & Dais Oversight
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Viewing as Secretary-General Kavita Nair (@kavita.sec). Review candidate dossiers and issue official directives.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* EB Application Review Card */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-rose-500/30 text-left space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-rose-400 font-bold uppercase flex items-center gap-1.5">
                <Building className="w-4 h-4" />
                <span>Executive Board Dossier Review</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 font-mono text-[9px] font-bold uppercase">
                Pending Decision
              </span>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2.5">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80"
                  alt="Candidate"
                  className="w-10 h-10 rounded-full object-cover border border-cyan-400"
                />
                <div>
                  <h4 className="font-bold text-white text-sm">{app.applicantName}</h4>
                  <div className="text-cyan-400 font-mono text-xs">{app.email} • {app.preferredCommittee}</div>
                </div>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                &ldquo;{app.priorExperience}&rdquo;
              </p>

              <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-neutral-400">
                <span>Applied: <strong className="text-white">{app.appliedDate}</strong></span>
                <span>•</span>
                <span>Status: <strong className="text-amber-400">{app.status}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  testNode.updateEbApplicationStatus(app.id, 'APPROVED');
                  setEbActionTaken('APPROVED');
                  recordInteraction({ hasReviewedEbApp: true, hasApprovedEbApp: true });
                }}
                className={`flex-1 py-2.5 rounded-xl font-bold font-mono text-xs uppercase transition cursor-pointer ${
                  ebActionTaken === 'APPROVED'
                    ? 'bg-emerald-500 text-black'
                    : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                ✓ Approve Appointment
              </button>

              <button
                type="button"
                onClick={() => {
                  testNode.updateEbApplicationStatus(app.id, 'REJECTED');
                  setEbActionTaken('REJECTED');
                  recordInteraction({ hasReviewedEbApp: true, hasApprovedEbApp: false });
                }}
                className={`flex-1 py-2.5 rounded-xl font-bold font-mono text-xs uppercase transition cursor-pointer ${
                  ebActionTaken === 'REJECTED'
                    ? 'bg-rose-500 text-white'
                    : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
                }`}
              >
                ✕ Reject Dossier
              </button>
            </div>

            {ebActionTaken && (
              <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
                Secretariat decree issued: Candidate marked {ebActionTaken}!
              </div>
            )}
          </div>

          {/* Global Broadcast Console */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 text-left space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-white font-bold uppercase flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-rose-400" />
                <span>Secretariat Broadcast Bulletin</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-white/5 text-neutral-400 font-mono text-[9px] font-bold">
                Global Push
              </span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Broadcast high-priority notices to all registered committee chambers, dais chairs, and delegate mobile nodes.
            </p>

            <textarea
              rows={3}
              value={secAnnouncement}
              onChange={(e) => setSecAnnouncement(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white resize-none font-sans"
            />

            <button
              type="button"
              onClick={() => {
                setSecAnnounced(true);
                recordInteraction({ hasPostedAnnouncement: true });
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-rose-500/20"
            >
              Broadcast Bulletin to All Chambers
            </button>

            {secAnnounced && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Broadcast pushed across all 4 chambers!</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={goBackStep}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-bold uppercase font-mono flex items-center gap-1.5 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={() => {
              // Return role to DELEGATE as step 7 requires
              setRole('DELEGATE');
              completeCurrentStep();
            }}
            className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-lg shadow-rose-500/20"
          >
            <span>Return to Delegate Role & Enter Chamber</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  /* ------------------------------------------------------------- */
  /* STEP 6: J06_COMMITTEE                                         */
  /* ------------------------------------------------------------- */
  const renderStep6 = () => (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      <div>
        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold uppercase">
          Step 7 of 12 • ZEN.MUN Chamber
        </span>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-1">
          Live Dais Parliamentary Floor Debate
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Chamber: All India Political Parties Meet (AIPPM). Raise motions, enter speaker lists, and vote on draft resolutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Action 1: Raise Motion */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3 text-left">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
            <Radio className="w-4 h-4" />
            <span>1. Raise Motion</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Move for a 15-minute Moderated Caucus on &ldquo;Youth Healthcare Infrastructure &amp; Mental Health Subsidies&rdquo;.
          </p>

          <button
            type="button"
            onClick={() => {
              testNode.raiseMotion('comm_aippm', 'Youth Healthcare Infrastructure & Mental Health Subsidies', 15, 60);
              setMotionRaised(true);
              recordInteraction({ hasRaisedMotion: true });
              try { daisAudio.playGavelStrike(); } catch (e) {}
            }}
            className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold uppercase transition cursor-pointer ${
              motionRaised
                ? 'bg-emerald-500 text-black'
                : 'bg-cyan-500 hover:bg-cyan-400 text-black'
            }`}
          >
            {motionRaised ? '✓ Motion Recognized' : 'Raise Formal Motion'}
          </button>
        </div>

        {/* Action 2: Join Speaker Queue */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3 text-left">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
            <Mic className="w-4 h-4" />
            <span>2. General Speakers List</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Add Delegate Aanya Sharma to the active podium queue. Speaking time: 90 seconds.
          </p>

          <button
            type="button"
            onClick={() => {
              setSpeakerJoined(true);
              recordInteraction({ hasJoinedSpeakersList: true });
            }}
            className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold uppercase transition cursor-pointer ${
              speakerJoined
                ? 'bg-emerald-500 text-black'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {speakerJoined ? '✓ In Queue (Position #3)' : 'Add Self to Speakers List'}
          </button>
        </div>

        {/* Action 3: Vote on Resolution */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3 text-left">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
            <Gavel className="w-4 h-4" />
            <span>3. Roll-Call Vote</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Draft Resolution AIPPM-RES-01 on National Youth Governance.
          </p>

          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {(['AYE', 'NAY', 'ABSTAIN'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => {
                  testNode.castVote('doc_res_1', v);
                  setResolutionVote(v);
                  recordInteraction({ hasVotedResolution: true });
                  try { daisAudio.playGavelStrike(); } catch (e) {}
                }}
                className={`py-2 rounded-lg font-mono text-xs font-bold transition cursor-pointer ${
                  resolutionVote === v
                    ? 'bg-cyan-400 text-black'
                    : 'bg-black/40 text-neutral-400 hover:text-white border border-white/5'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {resolutionVote && (
            <div className="text-[11px] font-mono text-emerald-400 pt-1">
              ✓ Vote Recorded: {resolutionVote}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={goBackStep}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-bold uppercase font-mono flex items-center gap-1.5 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <button
          type="button"
          onClick={completeCurrentStep}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          <span>Advance to Communications & Meet</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  /* ------------------------------------------------------------- */
  /* STEP 7: J07_COMMUNICATION                                     */
  /* ------------------------------------------------------------- */
  const renderStep7 = () => (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      <div>
        <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono text-xs font-bold uppercase">
          Step 8 of 12 • ZEN.CHAT & ZEN.MEET
        </span>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-1">
          Diplomatic Backchannels & Encrypted Audio-Visual Meet
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Dispatch unmoderated caucus notes in real-time chat and inspect the simulated dais video room.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Simulated Chat Window */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-teal-500/30 flex flex-col h-[340px] text-left">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <span className="font-mono text-xs text-teal-300 font-bold uppercase flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" />
              <span>#aippm-caucus-backchannel</span>
            </span>
            <span className="text-[10px] font-mono text-neutral-400">14 Members Online</span>
          </div>

          <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
            {chatMessages.map((m, i) => (
              <div key={i} className={`p-2.5 rounded-xl text-xs ${m.isUser ? 'bg-teal-500/15 border border-teal-500/30 ml-6' : 'bg-black/30 border border-white/5 mr-6'}`}>
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className={m.isUser ? 'text-teal-300 font-bold' : 'text-cyan-400 font-bold'}>{m.sender}</span>
                  <span className="text-neutral-500">{m.time}</span>
                </div>
                <p className="text-neutral-200 font-sans leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 flex gap-2">
            <input
              type="text"
              placeholder="Send note to AIPPM delegates..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && chatInput.trim()) {
                  const newMsg = {
                    sender: activePersona.name,
                    handle: activePersona.handle,
                    text: chatInput,
                    time: 'Just now',
                    isUser: true,
                  };
                  setChatMessages((prev) => [...prev, newMsg]);
                  setChatInput('');
                  recordInteraction({ hasSentChatMessage: true });

                  // Simulated auto-reply
                  setTimeout(() => {
                    setChatMessages((prev) => [
                      ...prev,
                      {
                        sender: 'Rohan Mehra',
                        handle: '@rohan.eb',
                        text: 'Note acknowledged by the Executive Board. We will open unmoderated caucus after the current speaker.',
                        time: 'Just now',
                        isUser: false,
                      },
                    ]);
                  }, 800);
                }
              }}
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-teal-400"
            />
            <button
              type="button"
              onClick={() => {
                if (chatInput.trim()) {
                  const newMsg = {
                    sender: activePersona.name,
                    handle: activePersona.handle,
                    text: chatInput,
                    time: 'Just now',
                    isUser: true,
                  };
                  setChatMessages((prev) => [...prev, newMsg]);
                  setChatInput('');
                  recordInteraction({ hasSentChatMessage: true });

                  setTimeout(() => {
                    setChatMessages((prev) => [
                      ...prev,
                      {
                        sender: 'Rohan Mehra',
                        handle: '@rohan.eb',
                        text: 'Note acknowledged by the Executive Board. We will open unmoderated caucus after the current speaker.',
                        time: 'Just now',
                        isUser: false,
                      },
                    ]);
                  }, 800);
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-mono text-xs font-bold uppercase transition cursor-pointer"
            >
              Send
            </button>
          </div>
        </div>

        {/* Simulated Meet Room */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0a1220] to-[#040810] border border-white/10 flex flex-col justify-between text-left space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="font-mono text-xs text-white font-bold uppercase flex items-center gap-1.5">
                <Video className="w-4 h-4 text-cyan-400" />
                <span>ZEN.MEET • Live Dais Chamber</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold">
                ENCRYPTED ROOM
              </span>
            </div>

            {/* Video Canvas Placeholder */}
            <div className="mt-3 aspect-video rounded-xl bg-black/70 border border-white/10 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 font-bold mb-2">
                Dais
              </div>
              <div className="text-white font-bold text-xs">AIPPM Executive Board Live Stream</div>
              <div className="text-neutral-500 font-mono text-[10px]">1080p 60fps • Ultra-low Latency</div>

              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-mono text-[9px] font-bold uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                LIVE
              </div>
            </div>
          </div>

          {/* Interactive Controls */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setMeetAudioOn(!meetAudioOn);
                recordInteraction({ hasTestedMeet: true });
              }}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
                meetAudioOn ? 'bg-cyan-500 text-black' : 'bg-white/10 text-neutral-300 hover:bg-white/20'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{meetAudioOn ? 'Mic Active' : 'Mute Mic'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMeetVideoOn(!meetVideoOn);
                recordInteraction({ hasTestedMeet: true });
              }}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
                meetVideoOn ? 'bg-indigo-500 text-white' : 'bg-white/10 text-neutral-300 hover:bg-white/20'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>{meetVideoOn ? 'Video Active' : 'Start Video'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                try { daisAudio.playGavelStrike(); } catch (e) {}
                recordInteraction({ hasTestedMeet: true });
              }}
              className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Gavel className="w-3.5 h-3.5" />
              <span>Chamber Gavel</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={goBackStep}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-bold uppercase font-mono flex items-center gap-1.5 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <button
          type="button"
          onClick={completeCurrentStep}
          className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-lg shadow-teal-500/20"
        >
          <span>Advance to Policy Solutions & Drafting</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  /* ------------------------------------------------------------- */
  /* STEP 8: J08_SOLUTIONS                                         */
  /* ------------------------------------------------------------- */
  const renderStep8 = () => (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      <div>
        <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold uppercase">
          Step 9 of 12 • ZEN.SOLUTIONS Policy Studio
        </span>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-1">
          From Youth Discussion to Enacted Policy
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Formulate operative clauses for youth healthcare, simulate assembly enactment, and export the official demo PDF.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Policy Clause Editor */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-indigo-500/30 text-left space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-indigo-300 font-bold uppercase flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>Operative Clause Builder</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono text-[9px] font-bold">
              Draft Policy
            </span>
          </div>

          <label className="text-[11px] font-mono text-neutral-400 block">
            Clause 3.2 • Proposed Operative Provision:
          </label>
          <textarea
            rows={4}
            value={policyClause}
            onChange={(e) => setPolicyClause(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white resize-none font-sans leading-relaxed"
          />

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                recordInteraction({ hasContributedPolicy: true });
              }}
              className="w-full py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-mono text-xs font-bold uppercase transition cursor-pointer"
            >
              Submit Clause to Drafting Committee
            </button>

            {/* Simulated Enactment Vote */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-400">Assembly Enactment Vote:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPolicyVoteCast('AYE');
                    recordInteraction({ hasVotedPolicy: true });
                    try { daisAudio.playGavelStrike(); } catch (e) {}
                  }}
                  className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition cursor-pointer ${
                    policyVoteCast === 'AYE' ? 'bg-emerald-500 text-black' : 'bg-white/5 text-neutral-300'
                  }`}
                >
                  AYE
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPolicyVoteCast('NAY');
                    recordInteraction({ hasVotedPolicy: true });
                  }}
                  className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition cursor-pointer ${
                    policyVoteCast === 'NAY' ? 'bg-rose-500 text-white' : 'bg-white/5 text-neutral-300'
                  }`}
                >
                  NAY
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ZEN.DOCS Watermarked Preview */}
        <div className="p-5 rounded-2xl bg-[#090d19] border border-white/10 text-left space-y-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div>
              <div className="font-mono text-[10px] text-cyan-400 font-bold uppercase">
                ZEN.DOCS • POL-2026-081
              </div>
              <div className="text-white font-bold text-xs">National Youth Healthcare Act (Draft)</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold">
              PASSED (88%)
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-black/50 border border-white/5 space-y-2 text-xs font-sans leading-relaxed text-neutral-300">
            <p className="text-[11px] text-neutral-400 font-mono uppercase tracking-wider">
              Enacted Operative Section:
            </p>
            <p className="italic">
              &ldquo;{policyClause}&rdquo;
            </p>
            <div className="pt-2 text-[10px] font-mono text-neutral-500 flex justify-between">
              <span>Signatory: {activePersona.name}</span>
              <span>Dais Sealed: Verified</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setDocExported(true);
              recordInteraction({ hasExportedPolicyDoc: true });
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-indigo-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{docExported ? '✓ Demo PDF Exported' : 'Export Watermarked Demo Document'}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={goBackStep}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-bold uppercase font-mono flex items-center gap-1.5 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <button
          type="button"
          onClick={completeCurrentStep}
          className="px-6 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-lg shadow-indigo-500/20"
        >
          <span>Advance to Ecosystem Map</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  /* ------------------------------------------------------------- */
  /* STEP 9: J09_ECOSYSTEM                                         */
  /* ------------------------------------------------------------- */
  const renderStep9 = () => {
    const appsList = [
      { id: 'mun', name: 'ZEN.MUN', status: 'INTERACTIVE SANDBOX', badgeColor: 'bg-cyan-500/20 text-cyan-300', desc: 'Parliamentary debate, caucus timers, roll-call voting, and awards.' },
      { id: 'sec', name: 'ZEN.SEC', status: 'INTERACTIVE SANDBOX', badgeColor: 'bg-purple-500/20 text-purple-300', desc: 'Secretariat event management, dais oversight, and staff recruitment.' },
      { id: 'pay', name: 'ZEN.PAY', status: 'INTERACTIVE SANDBOX', badgeColor: 'bg-amber-500/20 text-amber-300', desc: 'Mock Cashfree payment gateway, UPI/cards simulation, and ticketing.' },
      { id: 'solutions', name: 'ZEN.SOLUTIONS', status: 'INTERACTIVE SANDBOX', badgeColor: 'bg-indigo-500/20 text-indigo-300', desc: 'Youth policy drafting, consensus building, and democratic legislative synthesis.' },
      { id: 'chat', name: 'ZEN.CHAT', status: 'INTERACTIVE SANDBOX', badgeColor: 'bg-teal-500/20 text-teal-300', desc: 'Encrypted diplomatic backchannels and caucus note-passing.' },
      { id: 'pulse', name: 'ZEN.PULSE', status: 'INTERACTIVE SANDBOX', badgeColor: 'bg-emerald-500/20 text-emerald-300', desc: 'Civic pulse feed, public polls, and community governance.' },
      { id: 'press', name: 'ZEN.PRESS', status: 'LIVE PROTOTYPE', badgeColor: 'bg-sky-500/20 text-sky-300', desc: 'International press corps journalism and real-time committee bulletins.' },
      { id: 'maps', name: 'ZEN.MAPS', status: 'LIVE PROTOTYPE', badgeColor: 'bg-blue-500/20 text-blue-300', desc: 'Geospatial summit venue layouts, committee room locator, and transport.' },
      { id: 'legal', name: 'ZEN.LEGAL', status: 'ARCHITECTURE PLANNED', badgeColor: 'bg-neutral-800 text-neutral-400', desc: 'Parliamentary rules codification, constitution verification, and dispute resolution.' },
      { id: 'research', name: 'ZEN.RESEARCH', status: 'ARCHITECTURE PLANNED', badgeColor: 'bg-neutral-800 text-neutral-400', desc: 'Autonomous AI research dossiers, UN treaty cross-referencing, and statistics.' },
    ];

    return (
      <div className="space-y-6 max-w-4xl mx-auto py-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-bold uppercase">
            Step 10 of 12 • ZEN.APPS Matrix
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-1">
            Discover the Complete Ecosystem
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Explore all 14 interconnected ZENVITRA modules categorized by maturity and operational readiness.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {appsList.map((app) => (
            <div
              key={app.id}
              onClick={() => recordInteraction({ exploredAppsCount: (session.interactions.exploredAppsCount || 0) + 1 })}
              className="p-4 rounded-xl bg-slate-900/50 border border-white/10 hover:border-cyan-400/50 transition cursor-pointer text-left space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm group-hover:text-cyan-300 transition">
                  {app.name}
                </h4>
                <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase ${app.badgeColor}`}>
                  {app.status}
                </span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                {app.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={goBackStep}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-bold uppercase font-mono flex items-center gap-1.5 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={completeCurrentStep}
            className="px-6 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-lg shadow-purple-500/20"
          >
            <span>Proceed to Session Impact Summary</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  /* ------------------------------------------------------------- */
  /* STEP 10: J10_SUMMARY                                          */
  /* ------------------------------------------------------------- */
  const renderStep10 = () => {
    const metrics = [
      { label: 'Role Perspectives Explored', value: activeRole, color: 'text-cyan-400' },
      { label: 'Dispatches & Posts Reacted', value: session.interactions.hasLikedPost ? 'Liked & Commented' : 'Explored', color: 'text-emerald-400' },
      { label: 'MUN Applications Submitted', value: session.interactions.registeredCommitteeId ? 'AIPPM Approved' : 'Completed', color: 'text-violet-400' },
      { label: 'Mock Payments Simulated', value: session.interactions.paymentStatus === 'SUCCESS' ? '₹199 Paid (Mock)' : 'Simulated', color: 'text-amber-400' },
      { label: 'Executive Board Review', value: session.interactions.hasReviewedEbApp ? 'Dossier Decided' : 'Inspected', color: 'text-rose-400' },
      { label: 'Chamber Motions & Votes', value: session.interactions.hasVotedResolution ? 'Motion & Roll-Call' : 'Participated', color: 'text-teal-400' },
      { label: 'Policy Clauses Formulated', value: session.interactions.hasContributedPolicy ? 'Drafted & Exported' : 'Reviewed', color: 'text-indigo-400' },
    ];

    return (
      <div className="space-y-6 max-w-4xl mx-auto py-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono text-xs font-bold uppercase">
            Step 11 of 12 • Session Impact Audit
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-1">
            Personalized Demonstration Telemetry
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Audit record synthesized directly from the actions you executed inside the ZENVITRA Test Node.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-sky-950/30 border border-sky-500/30 space-y-4 text-left">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <img
                src={activePersona.avatar}
                alt={activePersona.name}
                className="w-12 h-12 rounded-xl object-cover border border-cyan-400"
              />
              <div>
                <h4 className="font-bold text-white text-base">{activePersona.name}</h4>
                <div className="text-cyan-400 font-mono text-xs">{activePersona.handle} • {activePersona.roleTitle}</div>
              </div>
            </div>

            <div className="text-right">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold uppercase">
                100% Verified Sandbox Audit
              </span>
              <div className="text-[10px] font-mono text-neutral-400 mt-1">Session ID: {session.sessionId.slice(0, 22)}...</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {metrics.map((m, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between font-mono text-xs">
                <span className="text-neutral-400">{m.label}:</span>
                <strong className={m.color}>{m.value}</strong>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-neutral-300 leading-relaxed font-sans">
            <strong className="text-white block mb-1">Telemetry Summary:</strong>
            You successfully navigated discovery, established fictional diplomatic credentials, simulated registration and Cashfree ₹199 mock checkouts, switched between Delegate and Secretariat perspectives, participated in parliamentary roll-call voting, and enacted a national youth policy.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={resetJourney}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
            <span>Replay Guided Journey</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('FREE_EXPLORE')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <span>Continue Free Exploration</span>
          </button>

          <button
            type="button"
            onClick={completeCurrentStep}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-600 hover:from-sky-300 hover:to-indigo-500 text-black font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-sky-500/25"
          >
            <span>Proceed to Clean Exit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  /* ------------------------------------------------------------- */
  /* STEP 11: J11_EXIT                                             */
  /* ------------------------------------------------------------- */
  const renderStep11 = () => (
    <div className="space-y-6 max-w-3xl mx-auto py-8 text-center">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>Step 12 of 12 • Safe Exit &amp; Data Isolation</span>
      </div>

      <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">
        Safe Return to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Live ZENVITRA</span>
      </h1>

      <p className="text-sm text-neutral-300 leading-relaxed max-w-2xl mx-auto">
        Your demonstration session was conducted entirely in isolation. The live production database remains 100% pristine with zero seeded accounts or mock records.
      </p>

      {/* Compliance Verification Seal */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-emerald-500/30 text-left space-y-3 shadow-xl">
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
          <Shield className="w-4 h-4" />
          <span>Zero Seeded Data Integrity Guarantee</span>
        </div>

        <ul className="space-y-2 text-xs font-mono text-neutral-300">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Zero mock profiles or passwords written to Postgres/Prisma</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Zero fake conferences or mock passes injected into live feeds</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>All demonstration tokens, motions, and invoices isolated in browser storage</span>
          </li>
        </ul>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/"
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:scale-105 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit to Live ZENVITRA Platform</span>
        </Link>

        <button
          type="button"
          onClick={() => jumpToStep('J00_DISCOVER')}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-neutral-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <span>Restart Demonstration</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* ── TOP STEPPER BREADCRUMB STRIP ── */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-1.5 min-w-max">
          {JOURNEY_STEPS.map((step) => {
            const status = session.stepStatuses[step.id];
            const isCurrent = session.currentStepId === step.id;
            const isCompleted = status === 'COMPLETED';
            const isLocked = status === 'LOCKED';

            return (
              <button
                key={step.id}
                type="button"
                disabled={isLocked}
                onClick={() => jumpToStep(step.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed ${
                  isCurrent
                    ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : isCompleted
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
                    : isLocked
                    ? 'bg-white/[0.02] text-neutral-600 border border-white/5'
                    : 'bg-white/5 text-neutral-400 hover:text-white border border-white/10'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <span>{step.displayStep}.</span>
                )}
                <span>{step.appName.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── ACTIVE STEP CONTENT CONTAINER ── */}
      <div className="min-h-[500px]">
        {session.currentStepId === 'J00_DISCOVER' && renderStep0()}
        {session.currentStepId === 'J01_IDENTITY' && renderStep1()}
        {session.currentStepId === 'J02_PULSE' && renderStep2()}
        {session.currentStepId === 'J03_EVENT' && renderStep3()}
        {session.currentStepId === 'J04_PAYMENT' && renderStep4()}
        {session.currentStepId === 'J05_SECRETARIAT' && renderStep5()}
        {session.currentStepId === 'J06_COMMITTEE' && renderStep6()}
        {session.currentStepId === 'J07_COMMUNICATION' && renderStep7()}
        {session.currentStepId === 'J08_SOLUTIONS' && renderStep8()}
        {session.currentStepId === 'J09_ECOSYSTEM' && renderStep9()}
        {session.currentStepId === 'J10_SUMMARY' && renderStep10()}
        {session.currentStepId === 'J11_EXIT' && renderStep11()}
      </div>
    </div>
  );
}

export default function TestNodeJourneyPage() {
  return (
    <TestNodeProvider>
      <TestNodeShell>
        <GuidedJourneyConsole />
      </TestNodeShell>
    </TestNodeProvider>
  );
}
