'use client';

import React, { useState } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Send, 
  Sparkles, 
  User, 
  Ghost, 
  Link as LinkIcon, 
  ExternalLink, 
  CornerDownRight, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  ShieldAlert,
  HelpCircle,
  Share2,
  Plus
} from 'lucide-react';
import { DiscussionArgument, ArgumentStance } from '@/types/discussions';
import { useAuth } from '@/context/AuthContext';

interface DiscussionDebateTreeProps {
  discussionId: string;
  argumentsList: DiscussionArgument[];
  onAddArgument: (arg: Omit<DiscussionArgument, 'id' | 'createdAt' | 'upvotes' | 'downvotes' | 'upvotedBy'>) => void;
  onVoteArgument: (argId: string, delta: number) => void;
}

function formatTimeSafe(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Recently';
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch {
    return 'Recently';
  }
}

export function DiscussionDebateTree({
  discussionId,
  argumentsList,
  onAddArgument,
  onVoteArgument,
}: DiscussionDebateTreeProps) {
  const { profile } = useAuth();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Root Form State
  const [rootTitle, setRootTitle] = useState('');
  const [rootContent, setRootContent] = useState('');
  const [rootStance, setRootStance] = useState<ArgumentStance>('PRO');
  const [rootIsAnonymous, setRootIsAnonymous] = useState(false);
  const [rootEvidenceTitle, setRootEvidenceTitle] = useState('');
  const [rootEvidenceUrl, setRootEvidenceUrl] = useState('');
  const [isComposerExpanded, setIsComposerExpanded] = useState(false);

  // Reply Form State (keyed by parent argument ID)
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyTitle, setReplyTitle] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyStance, setReplyStance] = useState<ArgumentStance>('CON');
  const [replyIsAnonymous, setReplyIsAnonymous] = useState(false);
  const [replyEvidenceTitle, setReplyEvidenceTitle] = useState('');
  const [replyEvidenceUrl, setReplyEvidenceUrl] = useState('');

  const [showEvidenceInputs, setShowEvidenceInputs] = useState(false);

  const STANCE_BADGES: Record<ArgumentStance, { label: string; icon: string; activeStyle: string; badgeStyle: string; style: string }> = {
    PRO: { 
      label: 'Support / Pro', 
      icon: '🟢',
      activeStyle: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/10',
      badgeStyle: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      style: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
    },
    CON: { 
      label: 'Rebuttal / Con', 
      icon: '🔴',
      activeStyle: 'bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/10',
      badgeStyle: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      style: 'bg-rose-500/10 text-rose-300 border-rose-500/30'
    },
    EVIDENCE: { 
      label: 'Evidence / Data', 
      icon: '🔵',
      activeStyle: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/10',
      badgeStyle: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      style: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
    },
    NEUTRAL: { 
      label: 'Nuance / Inquiry', 
      icon: '🟣',
      activeStyle: 'bg-purple-500/15 text-purple-300 border-purple-500/40 shadow-sm shadow-purple-500/10',
      badgeStyle: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      style: 'bg-purple-500/10 text-purple-300 border-purple-500/30'
    },
  };

  const handleRootSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rootContent.trim()) return;

    onAddArgument({
      discussionId,
      authorId: rootIsAnonymous ? 'anon-user' : profile?.id || 'guest_user',
      authorName: rootIsAnonymous ? 'Anonymous Contributor' : profile?.display_name || 'Youth Contributor',
      authorUsername: rootIsAnonymous ? 'anonymous' : profile?.username || 'member',
      authorRole: rootIsAnonymous ? 'ANONYMOUS' : profile?.role?.toUpperCase() || 'MEMBER',
      isAnonymous: rootIsAnonymous,
      stance: rootStance,
      title: rootTitle.trim() || `${rootStance === 'PRO' ? 'Affirmative Case' : rootStance === 'CON' ? 'Counter Stance' : 'Evidence Note'} on Topic`,
      content: rootContent.trim(),
      evidenceLinks: rootEvidenceTitle.trim() ? [{
        title: rootEvidenceTitle.trim(),
        url: rootEvidenceUrl.trim() || 'https://zenvitra.xyz',
        sourceName: 'Contributor Citation'
      }] : [],
    });

    setRootTitle('');
    setRootContent('');
    setRootEvidenceTitle('');
    setRootEvidenceUrl('');
    setShowEvidenceInputs(false);
    setIsComposerExpanded(false);
  };

  const handleReplySubmit = (parentId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    onAddArgument({
      discussionId,
      parentId,
      authorId: replyIsAnonymous ? 'anon-user' : profile?.id || 'guest_user',
      authorName: replyIsAnonymous ? 'Anonymous Contributor' : profile?.display_name || 'Youth Contributor',
      authorUsername: replyIsAnonymous ? 'anonymous' : profile?.username || 'member',
      authorRole: replyIsAnonymous ? 'ANONYMOUS' : profile?.role?.toUpperCase() || 'MEMBER',
      isAnonymous: replyIsAnonymous,
      stance: replyStance,
      title: replyTitle.trim() || `Rebuttal / Response to Node`,
      content: replyContent.trim(),
      evidenceLinks: replyEvidenceTitle.trim() ? [{
        title: replyEvidenceTitle.trim(),
        url: replyEvidenceUrl.trim() || 'https://zenvitra.xyz',
        sourceName: 'Contributor Citation'
      }] : [],
    });

    setReplyingToId(null);
    setReplyTitle('');
    setReplyContent('');
    setReplyEvidenceTitle('');
    setReplyEvidenceUrl('');
  };

  return (
    <div className="space-y-6">
      {/* ── 1. MODERN SLEEK DEBATE COMPOSER ── */}
      <div className="rounded-3xl bg-gradient-to-b from-[#0e121d]/90 via-[#0a0d16]/95 to-[#05070c] border border-white/10 hover:border-cyan-500/25 transition-all shadow-xl shadow-black/50 overflow-hidden backdrop-blur-xl">
        
        {!isComposerExpanded ? (
          /* Collapsed Quick Trigger Bar */
          <div 
            onClick={() => setIsComposerExpanded(true)}
            className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition group"
          >
            <div className="flex items-center gap-3.5 flex-1">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-mono text-sm font-bold shadow-inner">
                {profile?.display_name ? profile.display_name[0] : 'Y'}
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-neutral-300 group-hover:text-white transition font-sans">
                  Take the floor &bull; <span className="text-neutral-500">Share your stance, evidence, or rebuttal...</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5">
                {(['PRO', 'CON', 'EVIDENCE', 'NEUTRAL'] as ArgumentStance[]).map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] font-mono text-neutral-400 group-hover:text-neutral-200 transition"
                  >
                    {STANCE_BADGES[s].icon} {STANCE_BADGES[s].label.split('/')[0]}
                  </span>
                ))}
              </div>
              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-neutral-950 font-bold font-mono text-xs shadow-lg shadow-cyan-500/20 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-neutral-950" />
                <span>Add Argument</span>
              </button>
            </div>
          </div>
        ) : (
          /* Expanded Full Modern Editor */
          <form onSubmit={handleRootSubmit} className="p-5 sm:p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Top Toolbar: Stance Selector + Identity & Minimize */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              
              {/* Stance Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {(['PRO', 'CON', 'EVIDENCE', 'NEUTRAL'] as ArgumentStance[]).map((stance) => {
                  const info = STANCE_BADGES[stance];
                  const isSelected = rootStance === stance;
                  return (
                    <button
                      key={stance}
                      type="button"
                      onClick={() => setRootStance(stance)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? info.activeStyle
                          : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <span>{info.icon}</span>
                      <span>{info.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Author Mode & Minimize */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setRootIsAnonymous(!rootIsAnonymous)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition flex items-center gap-1.5 cursor-pointer ${
                    rootIsAnonymous
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 font-bold'
                      : 'bg-white/5 border-white/10 text-neutral-400 hover:text-neutral-200'
                  }`}
                  title="Toggle Anonymous Privacy Mode"
                >
                  {rootIsAnonymous ? <Ghost className="w-3.5 h-3.5 text-purple-400" /> : <User className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>{rootIsAnonymous ? 'Anonymous' : `@${profile?.username || 'you'}`}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsComposerExpanded(false)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
                  title="Collapse Composer"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Core Inputs: Headline + Body */}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Argument Headline / Main Claim (Optional)"
                value={rootTitle}
                onChange={(e) => setRootTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-black/40 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 font-sans transition"
              />

              <div className="relative">
                <textarea
                  rows={4}
                  required
                  placeholder="Articulate your structured argument, evidence-based reasoning, or counter-point..."
                  value={rootContent}
                  onChange={(e) => setRootContent(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 resize-none font-sans leading-relaxed transition"
                />
                <span className="absolute bottom-3 right-3 text-[10px] font-mono text-neutral-500">
                  {rootContent.length} chars
                </span>
              </div>
            </div>

            {/* Optional Citation Drawer */}
            {showEvidenceInputs ? (
              <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-2.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
                  <span className="flex items-center gap-1.5 font-bold">
                    <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Attach Evidence or Verified Source</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEvidenceInputs(false);
                      setRootEvidenceTitle('');
                      setRootEvidenceUrl('');
                    }}
                    className="text-neutral-400 hover:text-white transition"
                  >
                    &times; Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Citation Title (e.g. UN Policy Report 2026)"
                    value={rootEvidenceTitle}
                    onChange={(e) => setRootEvidenceTitle(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400/50 font-sans"
                  />
                  <input
                    type="url"
                    placeholder="Evidence URL (https://...)"
                    value={rootEvidenceUrl}
                    onChange={(e) => setRootEvidenceUrl(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400/50 font-mono"
                  />
                </div>
              </div>
            ) : null}

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between pt-1">
              {!showEvidenceInputs ? (
                <button
                  type="button"
                  onClick={() => setShowEvidenceInputs(true)}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-cyan-300 transition flex items-center gap-1.5 cursor-pointer border border-white/5"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>+ Attach Evidence Link</span>
                </button>
              ) : <div />}

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsComposerExpanded(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-neutral-400 hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!rootContent.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-neutral-950 font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Argument</span>
                </button>
              </div>
            </div>

          </form>
        )}

      </div>

      {/* ── 2. NESTED DEBATE THREADS ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest font-bold">
            COMMUNITY DEBATE &amp; DELIBERATION TREE ({argumentsList.length} Nodes)
          </span>
        </div>

        {argumentsList.length === 0 ? (
          <div className="p-8 sm:p-10 rounded-3xl bg-[#07080d]/60 border border-dashed border-white/15 text-center space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-sm sm:text-base text-white">
              No Debate Nodes Published Yet
            </h4>
            <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed font-sans">
              Be the first delegate to take the floor. Click &quot;Take Floor / Submit Argument&quot; above to submit an Affirmative Proposal, Rebuttal, or Empirical Evidence citation.
            </p>
          </div>
        ) : (
          argumentsList.map((arg) => (
            <div
              key={arg.id}
              className="p-5 sm:p-6 rounded-3xl bg-[#07080d] border border-white/10 hover:border-white/20 transition-all space-y-4 shadow-sm"
            >
            {/* Comment Header */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Author Avatar / Ghost Badge */}
                {arg.isAnonymous ? (
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-300">
                    <Ghost className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 font-mono text-xs font-bold">
                    {arg.authorName[0]}
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-xs sm:text-sm text-white">
                      {arg.authorName}
                    </span>
                    {arg.isAnonymous ? (
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[9px] font-mono font-bold">
                        ANONYMOUS
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-neutral-400">
                        @{arg.authorUsername}
                      </span>
                    )}
                  </div>
                  <span suppressHydrationWarning className="text-[10px] font-mono text-neutral-500">
                    {mounted ? formatTimeSafe(arg.createdAt) : 'Recently'} &bull; {arg.authorRole}
                  </span>
                </div>
              </div>

              {/* Stance Pill & Voting */}
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold border ${STANCE_BADGES[arg.stance]?.style || 'bg-white/10 text-white'}`}>
                  {STANCE_BADGES[arg.stance]?.label || arg.stance}
                </span>

                <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-1 rounded-full text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => onVoteArgument(arg.id, 1)}
                    className="text-neutral-400 hover:text-emerald-400 transition cursor-pointer p-0.5"
                    title="Agree / Upvote"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-white px-1 text-[11px]">{arg.upvotes}</span>
                  <button
                    type="button"
                    onClick={() => onVoteArgument(arg.id, -1)}
                    className="text-neutral-400 hover:text-rose-400 transition cursor-pointer p-0.5"
                    title="Disagree / Downvote"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Comment Body */}
            <div className="space-y-1.5 pl-11">
              {arg.title && (
                <h4 className="font-display font-bold text-sm sm:text-base text-white">
                  {arg.title}
                </h4>
              )}
              <p className="font-sans text-xs sm:text-sm text-neutral-200 font-light leading-relaxed">
                {arg.content}
              </p>

              {/* Citations */}
              {arg.evidenceLinks && arg.evidenceLinks.length > 0 && (
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  {arg.evidenceLinks.map((evi, idx) => (
                    <a
                      key={idx}
                      href={evi.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono hover:underline"
                    >
                      <LinkIcon className="w-2.5 h-2.5" />
                      <span>{evi.title}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Action Bar (Reply button) */}
            <div className="pl-11 pt-1 flex items-center justify-between border-t border-white/5">
              <button
                type="button"
                onClick={() => setReplyingToId(replyingToId === arg.id ? null : arg.id)}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition cursor-pointer py-1"
              >
                <CornerDownRight className="w-3.5 h-3.5 text-cyan-400" />
                <span>{replyingToId === arg.id ? 'Cancel Reply' : 'Reply / Counter-Debate'}</span>
              </button>
            </div>

            {/* ── INLINE NESTED REPLY COMPOSER ── */}
            {replyingToId === arg.id && (
              <form
                onSubmit={(e) => handleReplySubmit(arg.id, e)}
                className="ml-4 sm:ml-11 p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#0c0e18] to-[#07090e] border border-cyan-500/25 space-y-3.5 shadow-xl animate-in fade-in duration-150"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-cyan-300 font-bold">
                      Replying to @{arg.authorUsername}
                    </span>
                  </div>
                  
                  {/* Stance Pill for Reply */}
                  <div className="flex items-center gap-1.5">
                    {(['CON', 'PRO', 'EVIDENCE'] as ArgumentStance[]).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setReplyStance(st)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold transition flex items-center gap-1 border cursor-pointer ${
                          replyStance === st 
                            ? STANCE_BADGES[st].activeStyle 
                            : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <span>{STANCE_BADGES[st].icon}</span>
                        <span>{st === 'CON' ? 'Rebuttal' : st === 'PRO' ? 'Support' : 'Evidence'}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    rows={3}
                    required
                    placeholder="Draft your rebuttal, support rationale, or empirical verification..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 resize-none font-sans leading-relaxed transition"
                  />
                  <span className="absolute bottom-2.5 right-3 text-[10px] font-mono text-neutral-500">
                    {replyContent.length} chars
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setReplyIsAnonymous(!replyIsAnonymous)}
                    className={`px-2.5 py-1 rounded-xl border text-[10px] font-mono transition flex items-center gap-1 cursor-pointer ${
                      replyIsAnonymous 
                        ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 font-bold' 
                        : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {replyIsAnonymous ? <Ghost className="w-3 h-3 text-purple-400" /> : <User className="w-3 h-3 text-cyan-400" />}
                    <span>{replyIsAnonymous ? 'Anonymous ON' : `@${profile?.username || 'you'}`}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setReplyingToId(null)}
                      className="px-3 py-1.5 rounded-xl text-xs font-mono text-neutral-400 hover:text-white transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!replyContent.trim()}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-neutral-950 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20 disabled:opacity-40"
                    >
                      <Send className="w-3 h-3" />
                      <span>Post Reply</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* ── NESTED REPLIES TREE ── */}
            {arg.replies && arg.replies.length > 0 && (
              <div className="ml-6 sm:ml-11 space-y-3 pl-3 sm:pl-4 border-l-2 border-white/10 pt-2">
                {arg.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {reply.isAnonymous ? (
                          <div className="w-5 h-5 rounded-full bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-300">
                            <Ghost className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 font-mono text-[9px] font-bold">
                            {reply.authorName[0]}
                          </div>
                        )}
                        <span className="font-mono text-[11px] font-bold text-white">
                          {reply.authorName}
                        </span>
                        {reply.isAnonymous ? (
                          <span className="text-[9px] font-mono text-purple-300">Ghost</span>
                        ) : (
                          <span className="text-[10px] font-mono text-neutral-500">@{reply.authorUsername}</span>
                        )}
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${STANCE_BADGES[reply.stance]?.style || 'bg-white/10 text-white'}`}>
                        {reply.stance}
                      </span>
                    </div>

                    <p className="font-sans text-xs text-neutral-200 font-light leading-relaxed pl-7">
                      {reply.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )))}
      </div>
    </div>
  );
}
