'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Download, 
  Share2, 
  Check, 
  ThumbsUp, 
  ThumbsDown, 
  MinusCircle, 
  ScrollText, 
  Shield, 
  Users, 
  Calendar, 
  Sparkles,
  FileCheck,
  Newspaper,
  FileText,
  MessageSquare,
  Scale,
  Quote,
  Send,
  Plus,
  ChevronDown,
  ChevronRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { SolutionDocument, DocumentClause, ClauseAmendment, ClauseDiscussion } from '@/types/solutions';
import { useAuth } from '@/context/AuthContext';

interface DocumentReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: SolutionDocument | null;
  onVote?: (docId: string, voteType: 'IN_FAVOR' | 'AGAINST' | 'ABSTAIN') => void;
  onUpdateDocument?: (doc: SolutionDocument) => void;
}

export function DocumentReaderModal({ isOpen, onClose, document: initialDoc, onVote, onUpdateDocument }: DocumentReaderModalProps) {
  const { profile, user } = useAuth();
  const [doc, setDoc] = useState<SolutionDocument | null>(initialDoc);
  const [copied, setCopied] = useState(false);
  const [citedClauseNumber, setCitedClauseNumber] = useState<string | null>(null);
  const [userVote, setUserVote] = useState<'IN_FAVOR' | 'AGAINST' | 'ABSTAIN' | null>(null);
  const [isSigned, setIsSigned] = useState(false);

  // Active Interactive Drawer for Clause (either 'discuss' or 'amend')
  const [activeClauseInteraction, setActiveClauseInteraction] = useState<{
    clauseId: string;
    type: 'discuss' | 'amend';
  } | null>(null);

  // Discussion Form State
  const [newCommentText, setNewCommentText] = useState('');

  // Amendment Form State
  const [amendmentText, setAmendmentText] = useState('');
  const [amendmentRationale, setAmendmentRationale] = useState('');

  // Chapter Filter
  const [selectedChapter, setSelectedChapter] = useState<string>('ALL');

  React.useEffect(() => {
    setDoc(initialDoc);
  }, [initialDoc]);

  if (!isOpen || !doc) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCiteClause = (clause: DocumentClause) => {
    const citation = `[Clause ${clause.clauseNumber}: ${clause.title || ''}, ${doc.title}] (${window.location.origin}/solutions?doc=${doc.id}&clause=${clause.clauseNumber})`;
    navigator.clipboard?.writeText(citation);
    setCitedClauseNumber(clause.clauseNumber);
    setTimeout(() => setCitedClauseNumber(null), 2500);
  };

  const handleCastVote = (type: 'IN_FAVOR' | 'AGAINST' | 'ABSTAIN') => {
    setUserVote(type);
    if (onVote) onVote(doc.id, type);
  };

  // Add Comment on Clause
  const handleAddComment = (clauseId: string) => {
    if (!newCommentText.trim()) return;

    const authorName = profile?.display_name || profile?.username || user?.email?.split('@')[0] || 'Diplomat';
    const authorUsername = profile?.username || 'member';

    const newComment: ClauseDiscussion = {
      id: `comm_${Date.now()}`,
      author: authorName,
      authorUsername,
      text: newCommentText.trim(),
      createdAt: new Date().toISOString()
    };

    const updatedClauses = doc.clauses.map(c => {
      if (c.id === clauseId) {
        return {
          ...c,
          discussions: [...(c.discussions || []), newComment]
        };
      }
      return c;
    });

    const updatedDoc = { ...doc, clauses: updatedClauses };
    setDoc(updatedDoc);
    if (onUpdateDocument) onUpdateDocument(updatedDoc);
    setNewCommentText('');
  };

  // Propose Amendment on Clause
  const handleProposeAmendment = (clauseId: string) => {
    if (!amendmentText.trim()) return;

    const authorName = profile?.display_name || profile?.username || user?.email?.split('@')[0] || 'Diplomat';
    const authorUsername = profile?.username || 'member';

    const newAmendment: ClauseAmendment = {
      id: `amend_${Date.now()}`,
      author: authorName,
      authorUsername,
      proposedText: amendmentText.trim(),
      rationale: amendmentRationale.trim(),
      votes: 1,
      votedUserIds: [authorUsername],
      createdAt: new Date().toISOString()
    };

    const updatedClauses = doc.clauses.map(c => {
      if (c.id === clauseId) {
        return {
          ...c,
          amendments: [...(c.amendments || []), newAmendment]
        };
      }
      return c;
    });

    const updatedDoc = { ...doc, clauses: updatedClauses };
    setDoc(updatedDoc);
    if (onUpdateDocument) onUpdateDocument(updatedDoc);
    setAmendmentText('');
    setAmendmentRationale('');
    setActiveClauseInteraction(null);
  };

  // Upvote Amendment
  const handleUpvoteAmendment = (clauseId: string, amendmentId: string) => {
    const updatedClauses = doc.clauses.map(c => {
      if (c.id === clauseId && c.amendments) {
        const nextAmendments = c.amendments.map(a => {
          if (a.id === amendmentId) {
            return { ...a, votes: a.votes + 1 };
          }
          return a;
        });
        return { ...c, amendments: nextAmendments };
      }
      return c;
    });

    const updatedDoc = { ...doc, clauses: updatedClauses };
    setDoc(updatedDoc);
    if (onUpdateDocument) onUpdateDocument(updatedDoc);
  };

  const totalVotes = doc.votes.inFavor + doc.votes.against + doc.votes.abstain;
  const inFavorPercent = totalVotes > 0 ? Math.round((doc.votes.inFavor / totalVotes) * 100) : 100;
  const againstPercent = totalVotes > 0 ? Math.round((doc.votes.against / totalVotes) * 100) : 0;
  const abstainPercent = totalVotes > 0 ? Math.round((doc.votes.abstain / totalVotes) * 100) : 0;

  // Filter clauses by selected chapter
  const displayedClauses = selectedChapter === 'ALL'
    ? doc.clauses
    : doc.clauses.filter(c => c.chapterNumber === selectedChapter);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-5xl rounded-3xl bg-[#090a12] border border-cyan-500/25 p-5 sm:p-8 md:p-9 shadow-[0_30px_100px_rgba(0,0,0,0.95)] z-10 text-left space-y-6 my-auto max-h-[92vh] overflow-y-auto text-white font-sans"
        >
          {/* Top Bar Controls */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
                {doc.documentType.replace('_', ' ')}
              </span>
              <span className="font-mono text-xs text-neutral-400">
                Ref: <strong className="text-white">{doc.documentCode}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:text-cyan-300 transition cursor-pointer text-xs font-mono flex items-center gap-1.5"
                title="Share reference link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:text-white transition cursor-pointer text-xs font-mono flex items-center gap-1.5"
                title="Print or Export Bill"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Official Document Header */}
          <div className="text-center space-y-3 py-3 border-b border-white/10">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-cyan-400 font-bold block">
              {doc.committee}
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">
              {doc.title}
            </h1>

            {/* Author & Metrics */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-neutral-400 pt-1">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Proposed by: <strong className="text-white">@{doc.proposedByUsername || doc.leadSponsors[0] || 'member'}</strong></span>
              </span>
              <span>•</span>
              <span className="text-neutral-300">
                <strong>{doc.clauses.length} Clauses</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
              </span>
            </div>
          </div>

          {/* Enacting Formula / Preamble (if present) */}
          {(doc.enactingFormula || doc.preamble || doc.abstract) && (
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                PURPOSE &amp; ENACTING STATEMENT
              </span>
              <p className="text-neutral-300 italic font-serif leading-relaxed text-sm">
                {doc.enactingFormula || doc.preamble || doc.abstract}
              </p>
            </div>
          )}

          {/* Voting & Sentiment Bar */}
          <div className="p-4 rounded-2xl bg-[#0e121e] border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-neutral-400 font-bold">PARLIAMENTARY ROLL-CALL SENTIMENT</span>
              <span className="font-mono text-neutral-400">{totalVotes} Total Votes Recorded</span>
            </div>

            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex">
              <div style={{ width: `${inFavorPercent}%` }} className="bg-emerald-400 transition-all duration-500" title={`In Favor: ${inFavorPercent}%`} />
              <div style={{ width: `${againstPercent}%` }} className="bg-rose-400 transition-all duration-500" title={`Against: ${againstPercent}%`} />
              <div style={{ width: `${abstainPercent}%` }} className="bg-neutral-500 transition-all duration-500" title={`Abstain: ${abstainPercent}%`} />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-emerald-400">In Favor: <strong>{doc.votes.inFavor}</strong> ({inFavorPercent}%)</span>
                <span className="text-rose-400">Against: <strong>{doc.votes.against}</strong> ({againstPercent}%)</span>
                <span className="text-neutral-400">Abstain: <strong>{doc.votes.abstain}</strong> ({abstainPercent}%)</span>
              </div>

              {/* Vote Buttons */}
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => handleCastVote('IN_FAVOR')}
                  className={`px-3 py-1.5 rounded-xl border font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    userVote === 'IN_FAVOR'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-white/5 border-white/10 text-neutral-300 hover:text-emerald-300'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Aye</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCastVote('AGAINST')}
                  className={`px-3 py-1.5 rounded-xl border font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    userVote === 'AGAINST'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-white/5 border-white/10 text-neutral-300 hover:text-rose-300'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>No</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCastVote('ABSTAIN')}
                  className={`px-3 py-1.5 rounded-xl border font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    userVote === 'ABSTAIN'
                      ? 'bg-neutral-500/20 border-neutral-400 text-white'
                      : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  <MinusCircle className="w-3.5 h-3.5" />
                  <span>Abstain</span>
                </button>
              </div>
            </div>
          </div>

          {/* Chapter Filter Bar (if multiple chapters exist) */}
          {doc.chapters && doc.chapters.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
              <span className="text-neutral-500 text-[11px] pr-1">Filter Chapter:</span>
              <button
                type="button"
                onClick={() => setSelectedChapter('ALL')}
                className={`px-3 py-1 rounded-xl transition border cursor-pointer whitespace-nowrap ${
                  selectedChapter === 'ALL'
                    ? 'bg-white text-black font-bold border-white'
                    : 'bg-white/5 text-neutral-400 border-white/10 hover:text-white'
                }`}
              >
                All Chapters ({doc.clauses.length})
              </button>
              {doc.chapters.map((chap) => (
                <button
                  key={chap.id}
                  type="button"
                  onClick={() => setSelectedChapter(chap.number)}
                  className={`px-3 py-1 rounded-xl transition border cursor-pointer whitespace-nowrap ${
                    selectedChapter === chap.number
                      ? 'bg-cyan-400 text-black font-bold border-cyan-400'
                      : 'bg-white/5 text-neutral-400 border-white/10 hover:text-white'
                  }`}
                >
                  {chap.number} — {chap.title}
                </button>
              ))}
            </div>
          )}

          {/* ── KEY FEATURE: CLAUSE-BY-CLAUSE INTERACTIVE CARDS ── */}
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold">
                STRUCTURED LEGISLATIVE PROVISIONS ({displayedClauses.length})
              </span>
              <span className="text-[11px] font-mono text-neutral-500">
                Click Discuss or Propose Amendment on any clause
              </span>
            </div>

            <div className="space-y-4">
              {displayedClauses.map((clause) => {
                const isInteracting = activeClauseInteraction?.clauseId === clause.id;
                const interactionType = activeClauseInteraction?.type;
                const hasAmendments = (clause.amendments?.length || 0) > 0;
                const hasDiscussions = (clause.discussions?.length || 0) > 0;
                const isCited = citedClauseNumber === clause.clauseNumber;

                return (
                  <div
                    key={clause.id || clause.clauseNumber}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 transition-all space-y-3 relative group"
                  >
                    {/* Clause Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 font-mono text-xs font-bold text-cyan-300">
                          Clause {clause.clauseNumber}
                        </span>
                        {clause.title && (
                          <h4 className="font-bold text-white text-sm sm:text-base font-sans">
                            {clause.title}
                          </h4>
                        )}
                      </div>

                      {clause.chapterNumber && (
                        <span className="text-[10px] font-mono text-neutral-500 px-2 py-0.5 rounded bg-white/5">
                          {clause.chapterNumber}
                        </span>
                      )}
                    </div>

                    {/* Clause Substantive Text */}
                    <div className="text-neutral-200 font-serif leading-relaxed text-sm sm:text-[15px] pl-2 border-l-2 border-white/15">
                      {clause.text}
                    </div>

                    {/* Sub-Clauses (e.g. 7.1, 7.2 or (a), (b)) */}
                    {clause.subClauses && clause.subClauses.length > 0 && (
                      <div className="space-y-2 pt-1 pl-4 sm:pl-6">
                        {clause.subClauses.map((sub, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300 font-serif leading-relaxed">
                            <span className="font-mono text-cyan-400 font-bold shrink-0 mt-0.5">{sub.number}</span>
                            <span className="text-neutral-300">{sub.text}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Proposed Amendments Badge / Highlights */}
                    {hasAmendments && (
                      <div className="pt-2">
                        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-2 text-xs">
                          <span className="font-mono text-[10px] text-purple-300 uppercase tracking-widest font-bold block">
                            PROPOSED AMENDMENTS ({clause.amendments!.length})
                          </span>
                          {clause.amendments!.map((amend) => (
                            <div key={amend.id} className="p-2.5 rounded-lg bg-black/40 border border-purple-500/20 space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-bold text-white">Proposed by @{amend.authorUsername || amend.author}</span>
                                <button
                                  type="button"
                                  onClick={() => handleUpvoteAmendment(clause.id!, amend.id)}
                                  className="px-2 py-0.5 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-mono transition cursor-pointer flex items-center gap-1"
                                >
                                  ▲ {amend.votes} Support
                                </button>
                              </div>
                              <p className="text-neutral-200 font-serif italic text-xs">"{amend.proposedText}"</p>
                              {amend.rationale && (
                                <p className="text-neutral-400 text-[10px]">Rationale: {amend.rationale}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Clause Interaction Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/5 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        {/* 💬 Debate / Discuss */}
                        <button
                          type="button"
                          onClick={() => {
                            if (isInteracting && interactionType === 'discuss') {
                              setActiveClauseInteraction(null);
                            } else {
                              setActiveClauseInteraction({ clauseId: clause.id!, type: 'discuss' });
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 cursor-pointer ${
                            isInteracting && interactionType === 'discuss'
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                              : 'bg-white/5 border-white/10 text-neutral-300 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Debate</span>
                          {hasDiscussions && (
                            <span className="px-1.5 py-0.2 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px]">
                              {clause.discussions!.length}
                            </span>
                          )}
                        </button>

                        {/* ⚖ Propose Amendment */}
                        <button
                          type="button"
                          onClick={() => {
                            if (isInteracting && interactionType === 'amend') {
                              setActiveClauseInteraction(null);
                            } else {
                              setActiveClauseInteraction({ clauseId: clause.id!, type: 'amend' });
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 cursor-pointer ${
                            isInteracting && interactionType === 'amend'
                              ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                              : 'bg-white/5 border-white/10 text-neutral-300 hover:text-purple-300 hover:bg-purple-500/10'
                          }`}
                        >
                          <Scale className="w-3.5 h-3.5 text-purple-400" />
                          <span>Propose Amendment</span>
                          {hasAmendments && (
                            <span className="px-1.5 py-0.2 rounded-full bg-purple-400/20 text-purple-300 text-[10px]">
                              {clause.amendments!.length}
                            </span>
                          )}
                        </button>
                      </div>

                      {/* ↗ Cite / Share */}
                      <button
                        type="button"
                        onClick={() => handleCiteClause(clause)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                        title="Copy statutory citation link"
                      >
                        {isCited ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Cited to Clipboard</span>
                          </>
                        ) : (
                          <>
                            <Quote className="w-3.5 h-3.5" />
                            <span>Cite Clause</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Interactive Drawer for Clause (Debate / Discussions) */}
                    {isInteracting && interactionType === 'discuss' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-3 border-t border-cyan-500/20 space-y-3"
                      >
                        <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest font-bold block">
                          CLAUSE {clause.clauseNumber} LEGISLATIVE DEBATE
                        </span>

                        {/* Existing Comments */}
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {(clause.discussions || []).length === 0 ? (
                            <p className="text-[11px] text-neutral-500 italic">No debate remarks yet on this clause. Be the first to table an argument.</p>
                          ) : (
                            clause.discussions!.map((d) => (
                              <div key={d.id} className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-1 text-xs">
                                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                                  <strong className="text-white">@{d.authorUsername || d.author}</strong>
                                  <span>{new Date(d.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-neutral-300 font-sans leading-relaxed">{d.text}</p>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Comment Input */}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            placeholder="Add your parliamentary argument or interpretation on this clause..."
                            className="flex-1 px-3 py-2 rounded-xl bg-black border border-white/15 text-white text-xs outline-none focus:border-cyan-400 font-sans"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddComment(clause.id!);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleAddComment(clause.id!)}
                            className="px-4 py-2 rounded-xl bg-cyan-400 text-black font-bold font-mono text-xs hover:bg-cyan-300 transition cursor-pointer flex items-center gap-1"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Post</span>
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Interactive Drawer for Clause (Propose Amendment) */}
                    {isInteracting && interactionType === 'amend' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-3 border-t border-purple-500/20 space-y-3"
                      >
                        <span className="font-mono text-[10px] text-purple-400 uppercase tracking-widest font-bold block">
                          TABLE AMENDMENT TO CLAUSE {clause.clauseNumber}
                        </span>

                        <div className="space-y-2">
                          <div>
                            <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Proposed Redline / Modified Text</label>
                            <textarea
                              value={amendmentText}
                              onChange={(e) => setAmendmentText(e.target.value)}
                              placeholder="Enter the proposed amended wording for Clause..."
                              rows={2}
                              className="w-full p-2.5 rounded-xl bg-black border border-white/15 text-white font-serif text-xs outline-none focus:border-purple-400 leading-relaxed"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Rationale / Legislative Justification</label>
                            <input
                              type="text"
                              value={amendmentRationale}
                              onChange={(e) => setAmendmentRationale(e.target.value)}
                              placeholder="Why should this clause be modified? (e.g. clarify penalties, extend timeline)"
                              className="w-full px-3 py-1.5 rounded-xl bg-black border border-white/15 text-white text-xs outline-none focus:border-purple-400"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1 font-mono text-xs">
                          <button
                            type="button"
                            onClick={() => setActiveClauseInteraction(null)}
                            className="px-3 py-1.5 rounded-xl text-neutral-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleProposeAmendment(clause.id!)}
                            disabled={!amendmentText.trim()}
                            className="px-4 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold transition cursor-pointer disabled:opacity-40"
                          >
                            Table Amendment
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ratifying Signatories Section */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
                CO-SPONSORS &amp; RATIFIERS ({(doc.signatories?.length || 0) + (isSigned ? 1 : 0)})
              </span>
              <button
                type="button"
                onClick={() => setIsSigned(!isSigned)}
                className={`px-3 py-1 rounded-full border text-xs font-mono font-bold transition cursor-pointer ${
                  isSigned
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                    : 'bg-white/5 border-white/10 text-neutral-300 hover:text-white'
                }`}
              >
                {isSigned ? '✓ Co-Sponsorship Attached' : '+ Add Co-Sponsorship'}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {doc.signatories?.map((sig, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-300"
                >
                  {sig}
                </span>
              ))}
              {isSigned && (
                <span className="px-3 py-1 rounded-xl bg-purple-500/20 border border-purple-400 text-xs font-mono text-purple-300 font-bold">
                  @{profile?.username || 'Your Delegation'}
                </span>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Immutable Sovereign Legislative Post</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-full bg-white text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition cursor-pointer"
            >
              Close Document
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
