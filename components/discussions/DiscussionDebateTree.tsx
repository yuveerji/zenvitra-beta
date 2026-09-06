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
  Share2
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

  const STANCE_BADGES: Record<ArgumentStance, { label: string; style: string }> = {
    PRO: { label: 'AFFIRMATIVE PROPOSAL', style: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
    CON: { label: 'COUNTER-REBUTTAL', style: 'bg-rose-500/10 text-rose-300 border-rose-500/30' },
    EVIDENCE: { label: 'EMPIRICAL EVIDENCE', style: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' },
    NEUTRAL: { label: 'NUANCED INQUIRY', style: 'bg-purple-500/10 text-purple-300 border-purple-500/30' },
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
      {/* ── 1. ROOT DEBATE / COMMENT COMPOSER ── */}
      <div className="rounded-3xl bg-white/[0.02] border border-white/10 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-xs text-white font-bold uppercase tracking-wider">
              Participate in Structured Debate
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsComposerExpanded(!isComposerExpanded)}
            className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-mono transition cursor-pointer"
          >
            {isComposerExpanded ? 'Minimize Form' : '+ Add Argument / Comment'}
          </button>
        </div>

        {isComposerExpanded && (
          <form onSubmit={handleRootSubmit} className="space-y-4 pt-3 border-t border-white/10 animate-in fade-in duration-200">
            {/* Stance Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                Select Your Stance / Perspective
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {(['PRO', 'CON', 'EVIDENCE', 'NEUTRAL'] as ArgumentStance[]).map((stance) => (
                  <button
                    key={stance}
                    type="button"
                    onClick={() => setRootStance(stance)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition cursor-pointer ${
                      rootStance === stance
                        ? STANCE_BADGES[stance].style + ' shadow-sm'
                        : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {STANCE_BADGES[stance].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Liberty Switch: Post as Self vs Anonymous */}
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {rootIsAnonymous ? (
                  <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300">
                    <Ghost className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <span className="text-xs font-mono font-bold text-white block">
                    {rootIsAnonymous ? 'Posting as Anonymous (Privacy Mode)' : `Posting as Yourself (@${profile?.username || 'you'})`}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {rootIsAnonymous ? 'Your identity is stripped; speech is protected for candid open debate.' : 'Linked to your public profile and verified contribution score.'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setRootIsAnonymous(!rootIsAnonymous)}
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition cursor-pointer shrink-0 ${
                  rootIsAnonymous
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                    : 'bg-white/5 border-white/15 text-neutral-300 hover:text-white'
                }`}
              >
                {rootIsAnonymous ? '✓ Anonymous ON' : 'Make Anonymous'}
              </button>
            </div>

            {/* Title & Body */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Argument Headline / Summary (Optional)"
                value={rootTitle}
                onChange={(e) => setRootTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400/50"
              />
              <textarea
                rows={3}
                required
                placeholder="Articulate your structured argument, empirical rationale, or civic observation..."
                value={rootContent}
                onChange={(e) => setRootContent(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400/50 resize-none font-sans"
              />
            </div>

            {/* Optional Citations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                placeholder="Evidence Citation Title (Optional)"
                value={rootEvidenceTitle}
                onChange={(e) => setRootEvidenceTitle(e.target.value)}
                className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400/50 font-mono"
              />
              <input
                type="url"
                placeholder="Evidence URL (https://...)"
                value={rootEvidenceUrl}
                onChange={(e) => setRootEvidenceUrl(e.target.value)}
                className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400/50 font-mono"
              />
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-white text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Argument Node</span>
              </button>
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
                className="ml-6 sm:ml-11 p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3 animate-in fade-in duration-150"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-cyan-300 font-bold uppercase">
                    Replying to @{arg.authorUsername}
                  </span>
                  
                  {/* Stance Pill for Reply */}
                  <div className="flex items-center gap-1.5">
                    {(['CON', 'PRO', 'EVIDENCE'] as ArgumentStance[]).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setReplyStance(st)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition border ${
                          replyStance === st ? STANCE_BADGES[st].style : 'bg-white/5 border-white/10 text-neutral-400'
                        }`}
                      >
                        {st === 'CON' ? 'Counter' : st === 'PRO' ? 'Support' : 'Evidence'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Anonymous Toggle for Reply */}
                <div className="flex items-center justify-between py-1">
                  <span className="text-[10px] font-mono text-neutral-400">
                    {replyIsAnonymous ? '👻 Reply will be posted anonymously' : `👤 Replying as @${profile?.username || 'you'}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => setReplyIsAnonymous(!replyIsAnonymous)}
                    className={`px-2.5 py-0.5 rounded-md border text-[10px] font-mono transition cursor-pointer ${
                      replyIsAnonymous ? 'bg-purple-500/20 border-purple-400 text-purple-300' : 'bg-white/5 border-white/10 text-neutral-400'
                    }`}
                  >
                    {replyIsAnonymous ? 'Anonymous: ON' : 'Reply Anonymously'}
                  </button>
                </div>

                <textarea
                  rows={2}
                  required
                  placeholder="Draft your direct response, counter-argument, or verification..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400/50 resize-none font-sans"
                />

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReplyingToId(null)}
                    className="px-3 py-1 rounded-full text-xs font-mono text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-full bg-white text-black font-mono text-xs font-bold uppercase hover:bg-neutral-200 transition cursor-pointer"
                  >
                    Post Reply Node
                  </button>
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
