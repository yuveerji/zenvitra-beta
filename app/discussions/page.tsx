'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
  Flame,
  X,
  Hash,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { OpenDiscussion, DiscussionArgument, DiscussionCategory, ArgumentStance } from '@/types/discussions';
import { useAuth } from '@/context/AuthContext';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { CreateDiscussionModal } from '@/components/discussions/CreateDiscussionModal';
import { SignInPromptModal } from '@/components/auth/SignInPromptModal';
import { DiscussionDebateTree } from '@/components/discussions/DiscussionDebateTree';
import { broadcastActivitySync } from '@/lib/reactiveActivityHub';

/* ─────────── UNCENSORED CIVIC YOUTH DEBATES ─────────── */

const INITIAL_DISCUSSIONS: OpenDiscussion[] = [
  {
    id: 'disc-marvel-doctor-doom-geopolitics',
    slug: 'doctor-doom-latverian-sovereignty-multiverse-incursions',
    title: 'Doctor Doom, Latverian Sovereignty & Multiverse Incursions: Is authoritarian order justified when global systems fail?',
    question: 'Doctor Doom, Latverian Sovereignty & Multiverse Incursions: Is authoritarian order justified when global systems fail?',
    contextSummary: 'An exploration of geopolitical authority, national sovereignty, and moral absolutism through the lens of Marvel\'s Latverian model and real-world multilateral fragility. Does crisis demand unyielding centralized order, or does authoritarian control inevitably devour the civilization it claims to preserve?',
    category: 'MARVEL',
    tags: ['Marvel & Theory', 'Geopolitics', 'Sovereignty', 'Multiverse', 'Philosophy'],
    authorId: 'zen_founder_yuveer',
    authorName: 'Yuveer',
    authorUsername: 'yuveer',
    createdAt: '2026-10-10T12:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z',
    viewCount: 0,
    participantCount: 0,
    proCount: 0,
    conCount: 0,
    evidenceCount: 0,
    status: 'ACTIVE',
    isFeatured: true,
    arguments: []
  },
  {
    id: 'disc-standup-free-speech',
    slug: 'samay-raina-ranveer-ashish-solanki-comedy-podcasting-political-crime',
    title: 'Samay Raina, Ranveer & Ashish Solanki: Is comedy & podcasting becoming a political crime?',
    question: 'Samay Raina, Ranveer & Ashish Solanki: Is comedy & podcasting becoming a political crime?',
    contextSummary: 'Independent comedians and digital podcasters across India increasingly face legal notices, show cancellations, FIRs, and online censorship. Has satirical youth commentary crossed into prohibited territory, or is state sensitivity stifling constitutional freedom of expression and public dialogue?',
    category: 'JUSTICE',
    tags: ['Free Speech', 'Politics', 'Comedy', 'Digital Creators', 'Civil Liberties'],
    authorId: 'zen_founder_yuveer',
    authorName: 'Yuveer',
    authorUsername: 'yuveer',
    createdAt: '2026-10-10T12:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z',
    viewCount: 0,
    participantCount: 0,
    proCount: 0,
    conCount: 0,
    evidenceCount: 0,
    status: 'ACTIVE',
    isFeatured: true,
    arguments: []
  },
  {
    id: 'disc-neet-paper-leaks',
    slug: 'neet-ug-paper-leak-scandal-systemic-corruption',
    title: 'The NEET-UG Paper Leak Scandal: 2.4 Million students betrayed by systemic corruption.',
    question: 'The NEET-UG Paper Leak Scandal: 2.4 Million students betrayed by systemic corruption.',
    contextSummary: 'The massive irregularities and paper leak cartels surrounding national entrance examinations betrayed 2.4 million medical aspirants. How can centralized testing agencies be held accountable, and what structural audits must be codified to protect meritocracy and youth futures from systemic rot?',
    category: 'EDUCATION',
    tags: ['Paper Leak', 'Academic Justice', 'Education Reform', 'NEET', 'Integrity'],
    authorId: 'zen_founder_yuveer',
    authorName: 'Yuveer',
    authorUsername: 'yuveer',
    createdAt: '2026-10-10T12:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z',
    viewCount: 0,
    participantCount: 0,
    proCount: 0,
    conCount: 0,
    evidenceCount: 0,
    status: 'ACTIVE',
    isFeatured: true,
    arguments: []
  },
  {
    id: 'disc-godi-media-collapse',
    slug: 'godi-media-surrender-indian-television-truth-state-theatrics',
    title: 'The \'Godi Media\' Surrender: Has Indian prime-time television traded truth for state theatrics?',
    question: 'The \'Godi Media\' Surrender: Has Indian prime-time television traded truth for state theatrics?',
    contextSummary: 'Mainstream Indian prime-time television news has systematically shifted from investigative journalism and public questioning toward state theatrics and corporate sensationalism. Has the Fourth Pillar permanently collapsed into an arm of political entertainment, and can independent youth media fill the void?',
    category: 'GOVERNANCE',
    tags: ['Press Freedom', 'Fourth Pillar', 'Media Ethics', 'Democracy', 'Journalism'],
    authorId: 'zen_founder_yuveer',
    authorName: 'Yuveer',
    authorUsername: 'yuveer',
    createdAt: '2026-10-10T12:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z',
    viewCount: 0,
    participantCount: 0,
    proCount: 0,
    conCount: 0,
    evidenceCount: 0,
    status: 'ACTIVE',
    isFeatured: true,
    arguments: []
  },
  {
    id: 'disc-algorithmic-surveillance-dpdp',
    slug: 'algorithmic-surveillance-deepfakes-dpdp-digital-panopticon',
    title: 'Algorithmic Surveillance, Deepfakes & DPDP: Are youth sleepwalking into a digital panopticon?',
    question: 'Algorithmic Surveillance, Deepfakes & DPDP: Are youth sleepwalking into a digital panopticon?',
    contextSummary: 'With rapid proliferation of biometric cameras, generative AI deepfakes, and state exemptions under the DPDP Act, digital privacy is eroding at unprecedented speed. Are young citizens unknowingly ceding autonomy to ubiquitous corporate algorithms and state surveillance apparatuses?',
    category: 'TECHNOLOGY',
    tags: ['Digital Rights', 'Digital Privacy', 'AI Ethics', 'Surveillance', 'DPDP'],
    authorId: 'zen_founder_yuveer',
    authorName: 'Yuveer',
    authorUsername: 'yuveer',
    createdAt: '2026-10-10T12:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z',
    viewCount: 0,
    participantCount: 0,
    proCount: 0,
    conCount: 0,
    evidenceCount: 0,
    status: 'ACTIVE',
    isFeatured: true,
    arguments: []
  }
];

const CATEGORIES: DiscussionCategory[] = [
  'MARVEL',
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

const LS_DISCUSSIONS = 'zenvitra_discussions_v5_authentic';

// Helper to sanitize discussions and ensure no legacy fake mock arguments remain
function sanitizeDiscussions(discs: OpenDiscussion[]): OpenDiscussion[] {
  return discs.map(d => {
    // Filter out fake seeded arguments if any lingered from previous versions
    const cleanArgs = (d.arguments || []).filter(arg => {
      const isFakeAuthor = ['priya_med', 'rohand_aspirant', 'kavita_krishnan'].includes(arg.authorUsername);
      const isFakeId = arg.id.startsWith('arg-neet-') || arg.id.startsWith('arg-standup-') || arg.id.startsWith('arg-godi-');
      return !isFakeAuthor && !isFakeId;
    });

    const pro = cleanArgs.filter(a => a.stance === 'PRO').length;
    const con = cleanArgs.filter(a => a.stance === 'CON').length;
    const evi = cleanArgs.filter(a => a.stance === 'EVIDENCE').length;
    const debatersCount = new Set(cleanArgs.map(a => a.authorUsername || a.authorName)).size;

    return {
      ...d,
      arguments: cleanArgs,
      proCount: pro,
      conCount: con,
      evidenceCount: evi,
      participantCount: debatersCount
    };
  });
}

function OpenDiscussionsContent() {
  const { profile, isAuthenticated, isMockMode } = useAuth();
  const searchParams = useSearchParams();
  const [showSignInModal, setShowSignInModal] = useState(false);

  useEffect(() => {
    const hasLoggedIn = isAuthenticated || isMockMode || Boolean(profile?.id);
    if (!hasLoggedIn) {
      try {
        const dismissed = sessionStorage.getItem('zenvitra_signin_prompt_dismissed_discussions');
        if (!dismissed) {
          const timer = setTimeout(() => {
            setShowSignInModal(true);
          }, 600);
          return () => clearTimeout(timer);
        }
      } catch {
        setShowSignInModal(true);
      }
    }
  }, [isAuthenticated, isMockMode, profile]);

  const handleCloseSignInModal = () => {
    setShowSignInModal(false);
    try {
      sessionStorage.setItem('zenvitra_signin_prompt_dismissed_discussions', 'true');
    } catch {}
  };

  const [discussions, setDiscussions] = useState<OpenDiscussion[]>(() => {
    if (typeof window === 'undefined') return INITIAL_DISCUSSIONS;
    try {
      // Clear legacy storage keys containing fake arguments
      ['zenvitra_discussions_v1', 'zenvitra_discussions_v2_clean', 'zenvitra_discussions_v3_zero', 'zenvitra_discussions_v4_clean'].forEach(k => {
        try { localStorage.removeItem(k); } catch {}
      });

      const stored = localStorage.getItem(LS_DISCUSSIONS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = sanitizeDiscussions(parsed);
          // Ensure all initial discussions exist and are credited to @yuveer
          const map = new Map<string, OpenDiscussion>();
          INITIAL_DISCUSSIONS.forEach(d => map.set(d.id, d));
          sanitized.forEach((d: OpenDiscussion) => {
            if (map.has(d.id)) {
              map.set(d.id, {
                ...map.get(d.id)!,
                ...d,
                authorUsername: 'yuveer',
                authorName: 'Yuveer',
                authorId: 'zen_founder_yuveer'
              });
            } else {
              map.set(d.id, d);
            }
          });
          const merged = Array.from(map.values());
          localStorage.setItem(LS_DISCUSSIONS, JSON.stringify(merged));
          return merged;
        }
      }
      return INITIAL_DISCUSSIONS;
    } catch {
      return INITIAL_DISCUSSIONS;
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all unique hashtags dynamically from discussions
  const allHashtags = React.useMemo(() => {
    const map = new Map<string, number>();
    discussions.forEach((d) => {
      d.tags?.forEach((t) => {
        const clean = t.replace(/^#/, '').trim();
        if (clean) {
          map.set(clean, (map.get(clean) || 0) + 1);
        }
      });
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  }, [discussions]);
  const [activeDiscussionId, setActiveDiscussionId] = useState<string>(() => {
    return INITIAL_DISCUSSIONS[0].id;
  });

  // Sync active discussion with search parameter if provided (?id=...)
  useEffect(() => {
    const idFromUrl = searchParams?.get('id');
    if (idFromUrl && discussions.some(d => d.id === idFromUrl)) {
      setActiveDiscussionId(idFromUrl);
    }
  }, [searchParams, discussions]);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LS_DISCUSSIONS, JSON.stringify(discussions));
    } catch {}
  }, [discussions]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleDiscussionCreated = (newDisc: OpenDiscussion) => {
    setDiscussions([newDisc, ...discussions]);
    setActiveDiscussionId(newDisc.id);
    broadcastActivitySync({ source: 'post', action: 'create', timestamp: Date.now() });
  };

  const filteredDiscussions = React.useMemo(() => {
    return discussions.filter((d) => {
      // 1. Category match
      const matchesCat = selectedCategory === 'ALL' || d.category === selectedCategory;

      // 2. Hashtag pill filter
      const matchesHashtag = !selectedHashtag || d.tags.some(t =>
        t.toLowerCase().replace(/^#/, '') === selectedHashtag.toLowerCase().replace(/^#/, '')
      );

      // 3. Search query match
      if (!searchQuery.trim()) {
        return matchesCat && matchesHashtag;
      }

      const q = searchQuery.toLowerCase().trim();
      const isExplicitHashtag = q.startsWith('#');
      const cleanQ = isExplicitHashtag ? q.slice(1).trim() : q;

      if (isExplicitHashtag && cleanQ) {
        const tagMatch = d.tags.some(t => t.toLowerCase().replace(/^#/, '').includes(cleanQ));
        return matchesCat && matchesHashtag && tagMatch;
      }

      // Keyword match across titles, questions, context summaries, author, tags & arguments
      const titleMatch = d.title.toLowerCase().includes(q);
      const questionMatch = d.question.toLowerCase().includes(q);
      const contextMatch = (d.contextSummary || '').toLowerCase().includes(q);
      const tagMatch = d.tags.some(t => t.toLowerCase().includes(q) || t.toLowerCase().replace(/^#/, '').includes(q));
      const authorMatch = (d.authorName || '').toLowerCase().includes(q) || (d.authorUsername || '').toLowerCase().includes(q);
      const argumentMatch = d.arguments?.some(a =>
        a.content.toLowerCase().includes(q) || (a.evidenceLinks || []).some((e) => e.title?.toLowerCase().includes(q) || e.sourceName?.toLowerCase().includes(q))
      );

      return matchesCat && matchesHashtag && (titleMatch || questionMatch || contextMatch || tagMatch || authorMatch || argumentMatch);
    });
  }, [discussions, selectedCategory, selectedHashtag, searchQuery]);

  const activeDiscussion = discussions.find((d) => d.id === activeDiscussionId) || filteredDiscussions[0] || discussions[0];

  const handleVoteArgument = (argId: string, delta: number) => {
    const hasLoggedIn = isAuthenticated || isMockMode || Boolean(profile?.id);
    if (!hasLoggedIn) {
      setShowSignInModal(true);
      return;
    }
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
    const hasLoggedIn = isAuthenticated || isMockMode || Boolean(profile?.id);
    if (!hasLoggedIn) {
      setShowSignInModal(true);
      return;
    }
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
                onClick={() => {
                  const hasLoggedIn = isAuthenticated || isMockMode || Boolean(profile?.id);
                  if (!hasLoggedIn) {
                    setShowSignInModal(true);
                  } else {
                    setIsCreateModalOpen(true);
                  }
                }}
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

        {/* DISCOVERY CONTROLS: CATEGORIES, KEYWORD & HASHTAG DISCOVERY */}
        <div className="space-y-3 bg-white/[0.02] border border-white/10 rounded-2xl p-4 sm:p-5">
          {/* Top Row: Categories + Keyword/Hashtag Search */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3.5 py-1.5 rounded-full font-mono text-xs transition cursor-pointer shrink-0 border ${
                  selectedCategory === 'ALL'
                    ? 'bg-white text-black border-white font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                    : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
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
                      : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Keyword & Hashtag Search Bar */}
            <div className="relative w-full lg:w-80 shrink-0">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search keywords or #hashtags..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-400 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-neutral-400 hover:text-white"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Bottom Row: Trending Hashtags */}
          <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono text-[11px] text-purple-400/90 font-bold flex items-center gap-1 shrink-0">
              <Hash className="w-3.5 h-3.5 text-purple-400" />
              <span>Trending Hashtags:</span>
            </span>

            <div className="flex flex-wrap items-center gap-1.5">
              {allHashtags.map((tag) => {
                const isActive = selectedHashtag?.toLowerCase() === tag.toLowerCase();
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (isActive) {
                        setSelectedHashtag(null);
                      } else {
                        setSelectedHashtag(tag);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition flex items-center gap-1 cursor-pointer border ${
                      isActive
                        ? 'bg-purple-500/25 text-purple-200 border-purple-400 font-bold shadow-[0_0_12px_rgba(168,85,247,0.35)]'
                        : 'bg-white/[0.03] text-neutral-400 border-white/10 hover:text-purple-300 hover:border-purple-500/30 hover:bg-white/[0.06]'
                    }`}
                  >
                    <span className="text-purple-400 font-semibold">#</span>
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filter Ribbon */}
          {(selectedHashtag || searchQuery.trim() || selectedCategory !== 'ALL') && (
            <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono text-neutral-400">Active filters:</span>
                {selectedCategory !== 'ALL' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[11px] font-mono">
                    Topic: {selectedCategory}
                    <button type="button" onClick={() => setSelectedCategory('ALL')} className="hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedHashtag && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono font-bold">
                    #{selectedHashtag}
                    <button type="button" onClick={() => setSelectedHashtag(null)} className="hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchQuery.trim() && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-neutral-200 text-[11px] font-mono">
                    Keyword: &quot;{searchQuery}&quot;
                    <button type="button" onClick={() => setSearchQuery('')} className="hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <span className="text-[11px] font-mono text-neutral-400">
                  ({filteredDiscussions.length} debate{filteredDiscussions.length === 1 ? '' : 's'} found)
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedHashtag(null);
                  setSearchQuery('');
                }}
                className="text-[11px] font-mono text-neutral-400 hover:text-white transition underline underline-offset-2 cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
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
            
            {/* LEFT LIST: ACTIVE QUESTIONS (4 COLS) - Hidden on Mobile, Visible on Desktop */}
            <div className="hidden lg:block lg:col-span-4 space-y-3.5">
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
                        <span className="font-mono text-[10px] text-purple-400 font-semibold flex items-center gap-1">
                          <span className="text-neutral-500 font-normal">By</span>
                          <span className="underline decoration-purple-500/40">@{disc.authorUsername}</span>
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-sm sm:text-base text-white leading-snug mb-2">
                        {disc.title}
                      </h3>

                      <p className="font-sans text-xs text-neutral-400 line-clamp-2 mb-2.5">
                        {disc.question}
                      </p>

                      {/* Hashtag Pills */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                        {disc.tags.slice(0, 3).map((t) => {
                          const cleanTag = t.replace(/^#/, '');
                          const isTagActive = selectedHashtag?.toLowerCase() === cleanTag.toLowerCase();
                          return (
                            <span
                              key={t}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedHashtag(isTagActive ? null : cleanTag);
                              }}
                              className={`px-2 py-0.5 rounded-md text-[9px] font-mono border transition ${
                                isTagActive 
                                  ? 'bg-purple-500/25 border-purple-400 text-purple-200 font-bold'
                                  : 'bg-white/5 border-white/10 text-neutral-400 hover:text-purple-300 hover:border-purple-500/30'
                              }`}
                              title={`Filter by #${cleanTag}`}
                            >
                              #{cleanTag}
                            </span>
                          );
                        })}
                        {disc.tags.length > 3 && (
                          <span className="text-[9px] font-mono text-neutral-500">
                            +{disc.tags.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 border-t border-white/5 pt-2.5">
                        {disc.arguments.length > 0 ? (
                          <div className="flex items-center gap-3">
                            <span className="text-emerald-400">PRO: {disc.proCount}</span>
                            <span className="text-rose-400">CON: {disc.conCount}</span>
                            <span className="text-cyan-400">EVI: {disc.evidenceCount}</span>
                          </div>
                        ) : (
                          <span className="text-neutral-500 italic">Be the first to deliberate</span>
                        )}
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-purple-400 translate-x-1' : 'text-neutral-600'}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT VIEW: SELECTED DISCUSSION BRANCHED ARGUMENT TREE (8 COLS) */}
            <div className="lg:col-span-8 space-y-6">

              {/* MOBILE ONLY: QUICK TOPIC SWITCHER & DRAWER TRIGGER */}
              <div className="block lg:hidden space-y-3">
                <div className="p-4 rounded-2xl bg-[#0d091a] border border-purple-500/30 shadow-lg flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[9px] font-bold uppercase shrink-0">
                        {activeDiscussion.category}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        LIVE DEBATE
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-neutral-400">Active Topic:</div>
                    <div className="font-display font-bold text-sm text-white truncate">
                      {activeDiscussion.title}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMobileDrawerOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.4)] cursor-pointer active:scale-95"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Topics ({filteredDiscussions.length})</span>
                  </button>
                </div>

                {/* Horizontal Quick Scroller for One-Tap Switching on Mobile */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
                  {filteredDiscussions.map((disc, idx) => {
                    const isSel = disc.id === activeDiscussion.id;
                    return (
                      <button
                        key={disc.id}
                        type="button"
                        onClick={() => {
                          setActiveDiscussionId(disc.id);
                        }}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-mono whitespace-nowrap shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                          isSel
                            ? 'bg-purple-500/25 border-purple-400 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                            : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <span className="text-[10px] text-purple-400 font-bold">#{idx + 1}</span>
                        <span className="max-w-[150px] truncate">{disc.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              
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
                    {activeDiscussion.tags.map(t => {
                      const cleanT = t.replace(/^#/, '');
                      const isTagActive = selectedHashtag?.toLowerCase() === cleanT.toLowerCase();
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedHashtag(isTagActive ? null : cleanT)}
                          className={`px-2 py-0.5 rounded-md border text-[10px] transition cursor-pointer flex items-center gap-0.5 ${
                            isTagActive
                              ? 'bg-purple-500/30 border-purple-400 text-purple-200 font-bold'
                              : 'bg-white/5 border-white/10 text-neutral-300 hover:border-purple-400/50 hover:text-purple-300'
                          }`}
                          title={`Filter discussions by #${cleanT}`}
                        >
                          <span className="text-purple-400">#</span>
                          <span>{cleanT}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-neutral-500">Initiated by</span>
                    <span className="text-purple-300 font-bold underline decoration-purple-500/40">@{activeDiscussion.authorUsername}</span>
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

      {/* MOBILE SLIDE-OUT TOPICS DRAWER */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-[150] lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="absolute inset-y-0 left-0 w-full max-w-[340px] sm:max-w-md bg-[#090a12] border-r border-white/15 shadow-2xl flex flex-col z-10"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm sm:text-base text-white">All Discussion Topics</h3>
                    <p className="font-mono text-[10px] text-neutral-400">{filteredDiscussions.length} Debates Available</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Search & Category Filter */}
              <div className="p-4 border-b border-white/10 space-y-3">
                <div className="relative w-full">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search topics or tags..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-400 transition font-sans"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('ALL')}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[10px] transition shrink-0 border ${
                      selectedCategory === 'ALL'
                        ? 'bg-white text-black border-white font-bold'
                        : 'bg-white/5 border-white/10 text-neutral-400'
                    }`}
                  >
                    ALL
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg font-mono text-[10px] transition shrink-0 border ${
                        selectedCategory === cat
                          ? 'bg-purple-500/20 text-purple-300 border-purple-400 font-bold'
                          : 'bg-white/5 border-white/10 text-neutral-400'
                      }`}
                    >
                      {cat.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drawer Topics List (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar">
                {filteredDiscussions.map((disc) => {
                  const isSelected = disc.id === activeDiscussion.id;
                  return (
                    <div
                      key={disc.id}
                      onClick={() => {
                        setActiveDiscussionId(disc.id);
                        setMobileDrawerOpen(false);
                      }}
                      className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-gradient-to-b from-[#1c1635] to-[#100c1e] border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                          : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono text-[9px] font-bold">
                          {disc.category}
                        </span>
                        <span className="font-mono text-[10px] text-purple-400 font-semibold">
                          @{disc.authorUsername}
                        </span>
                      </div>

                      <h4 className="font-display font-bold text-xs sm:text-sm text-white leading-snug">
                        {disc.title}
                      </h4>

                      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-1">
                        <span>PRO: {disc.proCount} • CON: {disc.conCount}</span>
                        <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-purple-400' : 'text-neutral-600'}`} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-white/10 bg-[#06070a]">
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setIsCreateModalOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Start Topic Discussion</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Start Topic Discussion Modal */}
      <CreateDiscussionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onDiscussionCreated={handleDiscussionCreated}
      />

      {/* Sovereign Sign-In Prompt Modal */}
      <SignInPromptModal
        isOpen={showSignInModal}
        onClose={handleCloseSignInModal}
        feature="discussions"
      />
    </div>
  );
}

export default function OpenDiscussionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030405] text-white flex items-center justify-center font-mono text-xs">Loading Sovereign Discussions...</div>}>
      <OpenDiscussionsContent />
    </Suspense>
  );
}
