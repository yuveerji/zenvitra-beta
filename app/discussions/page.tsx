'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  Sparkles, 
  ArrowUpRight, 
  ThumbsUp, 
  ThumbsDown, 
  Link as LinkIcon, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  Layers, 
  CheckCircle2, 
  Radio, 
  Share2, 
  Send,
  Lightbulb,
  ExternalLink,
  Flame
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { OpenDiscussion, DiscussionArgument, DiscussionCategory, ArgumentStance } from '@/types/discussions';
import { useAuth } from '@/context/AuthContext';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { CreateDiscussionModal } from '@/components/discussions/CreateDiscussionModal';
import { DiscussionDebateTree } from '@/components/discussions/DiscussionDebateTree';
import { broadcastActivitySync } from '@/lib/reactiveActivityHub';

/* ─────────── UNCENSORED CIVIC YOUTH DEBATES ─────────── */

const INITIAL_DISCUSSIONS: OpenDiscussion[] = [
  {
    id: 'disc-standup-free-speech',
    title: 'Samay Raina, Ranveer & Ashish Solanki: Is comedy & podcasting becoming a political crime?',
    slug: 'samay-ranveer-ashish-comedy-crackdown',
    question: 'Where does constitutional freedom of satirical expression end, and where does state-backed outrage and criminal intimidation begin?',
    contextSummary: 'In the wake of criminal FIRs, takedown demands, police complaints, and organized algorithmic boycotts targeting Indian comedians and podcasters (including Samay Raina, Ranveer Allahbadia / TRS episodes, and Ashish Solanki’s Pretty Good Roast episodes being forced offline), India’s youth face unprecedented cultural censorship. Does comedy require legal guardrails, or is weaponized outrage suffocating genuine civic dissent?',
    category: 'JUSTICE',
    tags: ['FreeSpeech', 'StandUpComedy', 'SamayRaina', 'RanveerAllahbadia', 'AshishSolanki', 'Censorship', 'Article19'],
    authorId: 'auth-citizen-yuveer',
    authorName: 'Yuveer Chhatwani',
    authorUsername: 'yuveer',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 1420,
    participantCount: 148,
    proCount: 84,
    conCount: 52,
    evidenceCount: 12,
    isFeatured: true,
    status: 'ACTIVE',
    arguments: [
      {
        id: 'arg-su-1',
        discussionId: 'disc-standup-free-speech',
        authorId: 'auth-user-101',
        authorName: 'Kabir Verma',
        authorUsername: 'kabirv',
        authorRole: 'Legal Jurisprudence Scholar',
        stance: 'PRO',
        title: 'Article 19(1)(a) protects uncomfortable satire; FIRs are state intimidation',
        content: 'Satirical comedy has historically functioned as the final democratic safety valve against authoritarian conformity. Weaponizing Section 295A and IPC/BNS provisions over comedic exaggerations on YouTube shows like Pretty Good Roast or podcast banter creates an unbearable chilling effect where creators self-censor.',
        evidenceLinks: [
          { title: 'Supreme Court on Free Speech & Artistic Liberty (S. Rangarajan Case)', url: 'https://indiankanoon.org', sourceName: 'Supreme Court of India' }
        ],
        upvotes: 48,
        downvotes: 3,
        upvotedBy: [],
        createdAt: new Date().toISOString(),
        replies: []
      },
      {
        id: 'arg-su-2',
        discussionId: 'disc-standup-free-speech',
        authorId: 'auth-user-102',
        authorName: 'Aarav Singhania',
        authorUsername: 'aarav_civic',
        authorRole: 'Media Ethics Researcher',
        stance: 'CON',
        title: 'Monetized shock-jock culture crosses into targeted public defamation',
        content: 'While broad state censorship is dangerous, digital platforms have incentivized toxic punchlines aimed at individual dignity without accountability. Creators monetize millions of views through boundary-pushing roasts and cannot claim total immunity when public sentiment reacts.',
        evidenceLinks: [],
        upvotes: 21,
        downvotes: 14,
        upvotedBy: [],
        createdAt: new Date().toISOString(),
        replies: []
      }
    ]
  },
  {
    id: 'disc-neet-paper-leaks',
    title: 'The NEET-UG Paper Leak Scandal: Systemic corruption and compromised meritocracy',
    slug: 'neet-paper-leak-nta-collapse',
    question: 'How do 2.4 million Indian medical aspirants dismantle the coaching mafia and bureaucratic impunity of the National Testing Agency?',
    contextSummary: 'The 2024–2025 NEET-UG crisis exposed burnt question papers in Patna, solver gangs operating across Godhra and Bihar, 67 students scoring impossible 720/720 perfection, and arbitrary grace marks awarded behind closed doors. Indian youth sacrifice years of mental and financial stability for high-stakes exams that are traded to the highest bidder.',
    category: 'EDUCATION',
    tags: ['NEETUG', 'PaperLeak', 'NTACorruption', 'StudentRights', 'EducationReform', 'MeritCrisis'],
    authorId: 'auth-citizen-yuveer',
    authorName: 'Yuveer Chhatwani',
    authorUsername: 'yuveer',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 3180,
    participantCount: 234,
    proCount: 168,
    conCount: 42,
    evidenceCount: 24,
    isFeatured: true,
    status: 'ACTIVE',
    arguments: [
      {
        id: 'arg-neet-1',
        discussionId: 'disc-neet-paper-leaks',
        authorId: 'auth-user-201',
        authorName: 'Dr. Priya Nair',
        authorUsername: 'priya_med',
        authorRole: 'Resident Physician & Education Reformer',
        stance: 'EVIDENCE',
        title: 'CBI Evidence & Burnt Question Papers confirm systemic institutional breach',
        content: 'The CBI arrests in Patna and Hazaribagh confirmed that master question booklets were leaked hours before the examination. The normalization of coaching syndicates collaborating with NTA insiders strips meritocracy of all legitimacy.',
        evidenceLinks: [
          { title: 'CBI Chargesheet & Evidence Record in NEET-UG Paper Leak', url: 'https://cbi.gov.in', sourceName: 'Central Bureau of Investigation' }
        ],
        upvotes: 92,
        downvotes: 2,
        upvotedBy: [],
        createdAt: new Date().toISOString(),
        replies: []
      },
      {
        id: 'arg-neet-2',
        discussionId: 'disc-neet-paper-leaks',
        authorId: 'auth-user-202',
        authorName: 'Rohan Deshmukh',
        authorUsername: 'rohand_aspirant',
        authorRole: 'NEET Aspirant & Youth Delegate',
        stance: 'PRO',
        title: 'Single-Window centralized testing creates an existential single point of failure',
        content: 'Forcing 24 lakh students through a single centralized exam overseen by a non-autonomous body like NTA guarantees catastrophic incentives for black-market syndicates. We need decentralized multi-stage testing and total biometric blockchain chain-of-custody.',
        evidenceLinks: [],
        upvotes: 67,
        downvotes: 5,
        upvotedBy: [],
        createdAt: new Date().toISOString(),
        replies: []
      }
    ]
  },
  {
    id: 'disc-godi-media-collapse',
    title: 'The "Godi Media" Surrender: Has Indian television traded truth for state theatrics?',
    slug: 'godi-media-propaganda-crisis',
    question: 'Has prime-time television debased the Fourth Pillar into an instrument of division, and how can decentralized youth journalism replace it?',
    contextSummary: 'Coined by independent journalists to describe corporate news channels acting as lapdogs to political power rather than watchdogs of the public, the "Godi Media" phenomenon has replaced ground reporting on youth unemployment, healthcare, and educational collapse with manufactured 9 PM communal shouting matches and state-sanctioned distraction.',
    category: 'GOVERNANCE',
    tags: ['GodiMedia', 'FourthPillar', 'JournalismCrisis', 'IndependentMedia', 'PressFreedom', 'YouthAccountability'],
    authorId: 'auth-citizen-yuveer',
    authorName: 'Yuveer Chhatwani',
    authorUsername: 'yuveer',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 2240,
    participantCount: 189,
    proCount: 142,
    conCount: 31,
    evidenceCount: 16,
    isFeatured: true,
    status: 'ACTIVE',
    arguments: [
      {
        id: 'arg-media-1',
        discussionId: 'disc-godi-media-collapse',
        authorId: 'auth-user-301',
        authorName: 'Tanvi Sen',
        authorUsername: 'tanvisen_press',
        authorRole: 'Independent Investigative Journalist',
        stance: 'PRO',
        title: 'Corporate ad-dependency and regulatory capture made critical journalism impossible',
        content: 'When 80% of prime-time news channel revenues come from government tenders and state-aligned conglomerate sponsors, journalism ceases to be a public utility. The resulting studio circus manufactures consent while real structural collapse is blacked out.',
        evidenceLinks: [
          { title: 'World Press Freedom Index: India Country Report', url: 'https://rsf.org', sourceName: 'Reporters Without Borders' }
        ],
        upvotes: 79,
        downvotes: 4,
        upvotedBy: [],
        createdAt: new Date().toISOString(),
        replies: []
      },
      {
        id: 'arg-media-2',
        discussionId: 'disc-godi-media-collapse',
        authorId: 'auth-user-302',
        authorName: 'Vikramaditya Roy',
        authorUsername: 'vikram_roy',
        authorRole: 'Digital Media Analyst',
        stance: 'EVIDENCE',
        title: 'Youth viewership has migrated completely to independent creators & decentralized wires',
        content: 'Television TRP ratings among under-30 demographics have fallen by over 60% in the last 4 years. Indian youth obtain ground reporting from grassroots YouTube channels, digital newsletters, and civic platforms like Zenvitra because prime-time news has forfeited all credibility.',
        evidenceLinks: [],
        upvotes: 56,
        downvotes: 6,
        upvotedBy: [],
        createdAt: new Date().toISOString(),
        replies: []
      }
    ]
  }
];

const CATEGORIES: DiscussionCategory[] = [
  'EDUCATION',
  'AI',
  'JUSTICE',
  'GOVERNANCE',
  'TECHNOLOGY',
  'ENVIRONMENT',
  'YOUTH',
  'GLOBAL_AFFAIRS',
  'SOCIETY',
  'HUMAN_RIGHTS'
];

const LS_DISCUSSIONS = 'zenvitra_discussions_v2_clean';

export default function OpenDiscussionsPage() {
  const { profile } = useAuth();
  const [discussions, setDiscussions] = useState<OpenDiscussion[]>(() => {
    if (typeof window === 'undefined') return INITIAL_DISCUSSIONS;
    try {
      const stored = localStorage.getItem(LS_DISCUSSIONS);
      return stored ? JSON.parse(stored) : INITIAL_DISCUSSIONS;
    } catch {
      return INITIAL_DISCUSSIONS;
    }
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDiscussionId, setActiveDiscussionId] = useState<string>('');

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LS_DISCUSSIONS, JSON.stringify(discussions));
    } catch {}
  }, [discussions]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleDiscussionCreated = (newDisc: OpenDiscussion) => {
    setDiscussions([newDisc, ...discussions]);
    setActiveDiscussionId(newDisc.id);
    broadcastActivitySync({ source: 'post', action: 'create', timestamp: Date.now() });
  };

  const filteredDiscussions = discussions.filter((d) => {
    const matchesCat = selectedCategory === 'ALL' || d.category === selectedCategory;
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const activeDiscussion = discussions.find((d) => d.id === activeDiscussionId) || filteredDiscussions[0] || discussions[0];

  const handleVoteArgument = (argId: string, delta: number) => {
    setDiscussions(prev => prev.map(disc => {
      if (disc.id !== activeDiscussion.id) return disc;
      return {
        ...disc,
        arguments: disc.arguments.map(arg => {
          if (arg.id === argId) {
            return { ...arg, upvotes: Math.max(0, arg.upvotes + delta) };
          }
          if (arg.replies) {
            return {
              ...arg,
              replies: arg.replies.map(rep => rep.id === argId ? { ...rep, upvotes: Math.max(0, rep.upvotes + delta) } : rep)
            };
          }
          return arg;
        })
      };
    }));
  };

  const handleAddArgumentNode = (argData: Omit<DiscussionArgument, 'id' | 'createdAt' | 'upvotes' | 'downvotes' | 'upvotedBy'>) => {
    const newArg: DiscussionArgument = {
      ...argData,
      id: `arg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      upvotes: 1,
      downvotes: 0,
      upvotedBy: [],
      createdAt: new Date().toISOString(),
      replies: []
    };

    setDiscussions(prev => prev.map(disc => {
      if (disc.id !== activeDiscussion.id) return disc;
      
      const proInc = argData.stance === 'PRO' ? 1 : 0;
      const conInc = argData.stance === 'CON' ? 1 : 0;
      const eviInc = argData.stance === 'EVIDENCE' ? 1 : 0;

      if (argData.parentId) {
        const updatedArgs = disc.arguments.map(a => {
          if (a.id === argData.parentId) {
            return {
              ...a,
              replies: [...(a.replies || []), newArg]
            };
          }
          return a;
        });

        return {
          ...disc,
          participantCount: disc.participantCount + 1,
          proCount: disc.proCount + proInc,
          conCount: disc.conCount + conInc,
          evidenceCount: disc.evidenceCount + eviInc,
          arguments: updatedArgs
        };
      }

      return {
        ...disc,
        participantCount: disc.participantCount + 1,
        proCount: disc.proCount + proInc,
        conCount: disc.conCount + conInc,
        evidenceCount: disc.evidenceCount + eviInc,
        arguments: [newArg, ...disc.arguments],
      };
    }));
  };

  return (
    <div className="min-h-screen bg-[#030405] text-white flex flex-col font-sans selection:bg-purple-500/30">
      <Navbar />

      <main className="flex-1 pt-28 sm:pt-36 pb-20 max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 w-full space-y-8">
        
        {/* HERO SECTION */}
        <div className="space-y-4 text-left border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-xs uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 animate-pulse text-purple-400" />
            <span>Structured Public Discourse</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white">
                Open Topic Discussions
              </h1>
              <p className="font-sans text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
                Structured debate trees, empirical citations, and counter-arguments. Move from chaotic social comments to policy consensus that bridges directly into real-world <Link href="/solutions" className="text-white hover:text-cyan-300 font-semibold transition-colors underline underline-offset-4 decoration-white/25 hover:decoration-cyan-400">ZEN.SOLUTIONS</Link>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="px-6 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs uppercase tracking-wider transition shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Start Topic Discussion</span>
              </button>

              <Link
                href="/solutions"
                className="px-5 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/15 hover:border-white/30 text-neutral-200 hover:text-white font-mono text-xs font-semibold transition flex items-center gap-2 shadow-sm"
              >
                <Lightbulb className="w-4 h-4 text-cyan-400" />
                <span>Explore Solutions &amp; Drafts &rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        {/* CATEGORY SELECTOR & SEARCH */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3.5 py-1.5 rounded-full font-mono text-xs transition cursor-pointer shrink-0 border ${
                selectedCategory === 'ALL'
                  ? 'bg-white text-black border-white font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                  : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
              }`}
            >
              ALL TOPICS
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full font-mono text-xs transition cursor-pointer shrink-0 border ${
                  selectedCategory === cat
                    ? 'bg-purple-500/20 text-purple-300 border-purple-400 font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                    : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions or tags..."
              className="w-full pl-9 pr-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-400 transition"
            />
          </div>
        </div>

        {/* MAIN 2-COLUMN DISCOURSE WORKSPACE */}
        {filteredDiscussions.length === 0 || !activeDiscussion ? (
          <div className="p-12 sm:p-16 rounded-3xl border border-white/10 bg-white/[0.02] text-center space-y-5 max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
              <MessageSquare className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-bold text-xl text-white">No Public Debates Active Yet</h3>
              <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-md mx-auto leading-relaxed font-sans">
                Real, unscripted discourse only. Be the first sovereign delegate to initiate a structured debate tree with empirical citations.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 rounded-full bg-white text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer"
            >
              Start First Topic Discussion
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            
            {/* LEFT LIST: ACTIVE QUESTIONS (4 COLS) */}
            <div className="lg:col-span-4 space-y-3.5">
              <div className="flex items-center justify-between px-1">
                <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest font-bold">
                  ACTIVE DEBATES ({filteredDiscussions.length})
                </span>
              </div>

              <div className="space-y-3">
                {filteredDiscussions.map((disc) => {
                  const isSelected = disc.id === activeDiscussion.id;
                  return (
                    <div
                      key={disc.id}
                      onClick={() => setActiveDiscussionId(disc.id)}
                      className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-b from-[#18132e] to-[#0d091a] border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.2)]'
                          : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono text-[9px] font-bold">
                          {disc.category}
                        </span>
                        <span className="font-mono text-[10px] text-neutral-400">
                          {disc.participantCount} debaters
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-sm sm:text-base text-white leading-snug mb-2">
                        {disc.title}
                      </h3>

                      <p className="font-sans text-xs text-neutral-400 line-clamp-2 mb-3">
                        {disc.question}
                      </p>

                      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 border-t border-white/5 pt-2.5">
                        <div className="flex items-center gap-3">
                          <span className="text-emerald-400">PRO: {disc.proCount}</span>
                          <span className="text-rose-400">CON: {disc.conCount}</span>
                          <span className="text-cyan-400">EVI: {disc.evidenceCount}</span>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-purple-400 translate-x-1' : 'text-neutral-600'}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT VIEW: SELECTED DISCUSSION BRANCHED ARGUMENT TREE (8 COLS) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* DISCUSSION HEADER CARD */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#141026] via-[#0b0816] to-[#05040a] border border-purple-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono text-xs font-bold">
                      {activeDiscussion.category}
                    </span>
                    <span className="font-mono text-xs text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      LIVE CIVIC DEBATE
                    </span>
                  </div>

                  {/* BRIDGE TO ACTION: CONVERT TO SOLUTION BUTTON */}
                  <Link
                    href={`/solutions?origin=${activeDiscussion.id}`}
                    className="px-4 py-1.5 rounded-full bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Draft Policy Solution ↗</span>
                  </Link>
                </div>

                <h2 className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-white tracking-tight leading-tight">
                  {activeDiscussion.question}
                </h2>

                <p className="font-sans text-sm text-neutral-300 font-light leading-relaxed">
                  {activeDiscussion.contextSummary}
                </p>

                {/* Tags & Debater metadata */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs font-mono text-neutral-400">
                  <div className="flex flex-wrap items-center gap-2">
                    {activeDiscussion.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300 text-[10px]">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <div>
                    Initiated by <span className="text-white font-bold">@{activeDiscussion.authorUsername}</span>
                  </div>
                </div>
              </div>

              {/* INTERACTIVE PARLIAMENTARY DEBATE & COMMENT TREE */}
              <DiscussionDebateTree
                discussionId={activeDiscussion.id}
                argumentsList={activeDiscussion.arguments}
                onAddArgument={handleAddArgumentNode}
                onVoteArgument={handleVoteArgument}
              />
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Start Topic Discussion Modal */}
      <CreateDiscussionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onDiscussionCreated={handleDiscussionCreated}
      />
    </div>
  );
}
