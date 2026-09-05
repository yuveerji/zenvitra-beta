'use client';

import React, { useState } from 'react';
import { 
  X, 
  GitMerge, 
  GitPullRequest, 
  Check, 
  ShieldAlert, 
  Tag, 
  FileCode2, 
  History, 
  Sparkles, 
  AlertCircle,
  Plus,
  Stamp,
  Award,
  Clock,
  ArrowRight,
  SplitSquareVertical
} from 'lucide-react';
import { PulsePost, LegislativeDiff, RationaleTag } from '@/types/pulse';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';

interface RedlineDiffStudioModalProps {
  post: PulsePost;
  isOpen: boolean;
  onClose: () => void;
}

const RATIONALE_OPTIONS: { tag: RationaleTag; label: string; desc: string }[] = [
  { tag: 'LEGAL_PRECEDENT', label: 'Legal Precedent', desc: 'Grounds modification on established international treaties or customary law.' },
  { tag: 'SECURITY_COUNCIL_MANDATE', label: 'Security Council Mandate', desc: 'Aligns clause with Chapter VII enforcement protocols.' },
  { tag: 'BUDGETARY_PRUDENCE', label: 'Budgetary Prudence', desc: 'Optimizes appropriations and multilateral fiscal sustainability.' },
  { tag: 'HUMAN_RIGHTS', label: 'Human Rights', desc: 'Strengthens universal protections and civilian safeguards.' },
  { tag: 'DIPLOMATIC_AMENDMENT', label: 'Diplomatic Amendment', desc: 'Broader consensus phraseology for caucus alignment.' },
  { tag: 'EDITORIAL', label: 'Editorial Precision', desc: 'Grammatical or semantic clarification without shifting legal intent.' },
];

export function RedlineDiffStudioModal({ post, isOpen, onClose }: RedlineDiffStudioModalProps) {
  const { 
    submitRedlineDiff, 
    ratifyRedlineDiff, 
    rejectRedlineDiff,
    currentUserId,
    currentUserUsername,
    myProfile
  } = useZenPulse();

  const [activeTab, setActiveTab] = useState<'diffs' | 'new_diff' | 'revisions'>('diffs');
  
  /* New diff form */
  const [originalSnippet, setOriginalSnippet] = useState('');
  const [modifiedSnippet, setModifiedSnippet] = useState('');
  const [rationaleTag, setRationaleTag] = useState<RationaleTag>('LEGAL_PRECEDENT');
  const [rationaleNote, setRationaleNote] = useState('');
  const [selectedTextStatus, setSelectedTextStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const isAuthor = post.authorId === currentUserId || post.authorUsername === currentUserUsername;
  const diffs = post.redlineDiffs || [];
  const revisions = post.revisions || [];

  const handleCreateDiff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalSnippet.trim() || !modifiedSnippet.trim()) return;

    submitRedlineDiff(post.id, {
      originalSnippet: originalSnippet.trim(),
      modifiedSnippet: modifiedSnippet.trim(),
      rationaleTag,
      rationaleNote: rationaleNote.trim() || 'Proposed inline refinement for multilateral consensus.'
    });

    setOriginalSnippet('');
    setModifiedSnippet('');
    setRationaleNote('');
    setActiveTab('diffs');
  };

  const handleSelectClause = (snippet: string) => {
    setOriginalSnippet(snippet);
    setModifiedSnippet(snippet);
    setActiveTab('new_diff');
    setSelectedTextStatus(`Selected snippet: "${snippet.slice(0, 35)}..."`);
    setTimeout(() => setSelectedTextStatus(null), 3000);
  };

  return (
    <div 
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-[#090b10] border border-white/15 shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-emerald-500/20 border border-white/15 flex items-center justify-center text-cyan-400">
              <SplitSquareVertical className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-lg text-white">
                  Legislative Redline Diff Studio
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {post.treatyVersion || 'v1.0'}
                </span>
              </div>
              <p className="text-xs font-mono text-neutral-400">
                Resolution: {post.treatyTitle || 'Sovereign Dispatch'} • {isAuthor ? 'Author Ratification Gateway' : 'Peer Delegate Amendment Hub'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-white/10 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('diffs')}
            className={`pb-3 px-3 font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'diffs' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <GitPullRequest className="w-4 h-4" />
            <span>Active Redline Diffs ({diffs.filter(d => d.status === 'pending').length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('new_diff')}
            className={`pb-3 px-3 font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'new_diff' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Propose Amendment</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('revisions')}
            className={`pb-3 px-3 font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'revisions' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Revision Changelog ({revisions.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Current Live Text Preview with Clause Clickability */}
          <div className="p-4 sm:p-5 rounded-2xl bg-black/50 border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <FileCode2 className="w-3.5 h-3.5" />
                Live Enacted Text ({post.treatyVersion || 'v1.0'})
              </span>
              <span className="text-[11px] text-neutral-500">
                Tip: Click any phrase or clause to load it into the amendment editor
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-sm text-neutral-200 leading-relaxed font-serif whitespace-pre-wrap select-text">
              {post.content}
            </div>

            {selectedTextStatus && (
              <p className="text-xs font-mono text-emerald-400 animate-pulse">{selectedTextStatus}</p>
            )}
          </div>

          {/* TAB 1: ACTIVE DIFFS & AUTHOR RATIFICATION GATEWAY */}
          {activeTab === 'diffs' && (
            <div className="space-y-4">
              {isAuthor && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
                  <Stamp className="w-5 h-5 text-amber-400 shrink-0" />
                  <div className="text-xs text-amber-200">
                    <strong>Author Ratification Gateway Active:</strong> You hold plenary authorship authority. Reviewing and accepting diffs will update the live text and increment the treaty version.
                  </div>
                </div>
              )}

              {diffs.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl space-y-3">
                  <GitMerge className="w-8 h-8 text-neutral-500 mx-auto" />
                  <p className="text-sm font-mono text-neutral-400">No active redline diffs proposed yet.</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('new_diff')}
                    className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold hover:bg-cyan-500/30 transition"
                  >
                    + Submit First Amendment
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {diffs.map((diff) => (
                    <div 
                      key={diff.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        diff.status === 'ratified'
                          ? 'bg-emerald-950/20 border-emerald-500/30'
                          : diff.status === 'rejected'
                          ? 'bg-rose-950/20 border-rose-500/30 opacity-60'
                          : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                      }`}
                    >
                      {/* Diff Metadata Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-xs text-white">
                            {diff.authorName}
                          </span>
                          <span className="font-mono text-[11px] text-neutral-400">
                            @{diff.authorUsername}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            Clearance L{diff.challengerClearanceLevel}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                            {diff.rationaleTag}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                          diff.status === 'ratified'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : diff.status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {diff.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Character Diff Comparison View */}
                      <div className="mt-3.5 space-y-2 font-mono text-xs">
                        {/* Original Snippet (Strikethrough in Rose) */}
                        <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/25 text-rose-300 flex items-start gap-2">
                          <span className="text-rose-400 font-bold shrink-0">- STRIKE:</span>
                          <span className="line-through decoration-rose-400 selection:bg-rose-500/30">
                            {diff.originalSnippet}
                          </span>
                        </div>

                        {/* Modified Snippet (Inserted in Emerald) */}
                        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/25 text-emerald-300 flex items-start gap-2">
                          <span className="text-emerald-400 font-bold shrink-0">+ INSERT:</span>
                          <span className="font-semibold selection:bg-emerald-500/30">
                            {diff.modifiedSnippet}
                          </span>
                        </div>
                      </div>

                      {/* Diplomatic Rationale Note */}
                      <div className="mt-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-neutral-300 font-sans">
                        <strong className="text-cyan-400 font-mono">Diplomatic Rationale:</strong> {diff.rationaleNote}
                      </div>

                      {/* Author Action Gateway Controls */}
                      {isAuthor && diff.status === 'pending' && (
                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => rejectRedlineDiff(post.id, diff.id, 'Did not align with plenary mandate')}
                            className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-mono text-xs font-bold transition cursor-pointer"
                          >
                            Reject Diff
                          </button>
                          <button
                            type="button"
                            onClick={() => ratifyRedlineDiff(post.id, diff.id)}
                            className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-emerald-950/40"
                          >
                            <Check className="w-4 h-4" />
                            <span>Accept &amp; Ratify Diff</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROPOSE NEW AMENDMENT FORM */}
          {activeTab === 'new_diff' && (
            <form onSubmit={handleCreateDiff} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400 block">
                  Original Clause or Phrase to Replace (Strike):
                </label>
                <textarea
                  rows={2}
                  value={originalSnippet}
                  onChange={(e) => setOriginalSnippet(e.target.value)}
                  placeholder="Paste or type the exact phrase from the treaty text..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-xs text-white focus:outline-none focus:border-rose-400 font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400 block">
                  Proposed Amendment Replacement (Insert):
                </label>
                <textarea
                  rows={2}
                  value={modifiedSnippet}
                  onChange={(e) => setModifiedSnippet(e.target.value)}
                  placeholder="Enter your proposed text amendment..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                  required
                />
              </div>

              {/* Rationale Tag Selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-neutral-400 block">
                  Required Diplomatic Rationale Tag:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {RATIONALE_OPTIONS.map((opt) => (
                    <div
                      key={opt.tag}
                      onClick={() => setRationaleTag(opt.tag)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        rationaleTag === opt.tag
                          ? 'bg-cyan-500/20 border-cyan-400 text-white'
                          : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-cyan-300">{opt.tag}</span>
                        {rationaleTag === opt.tag && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1 font-sans">{opt.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400 block">
                  Justification Memo &amp; Legal Context:
                </label>
                <textarea
                  rows={2}
                  value={rationaleNote}
                  onChange={(e) => setRationaleNote(e.target.value)}
                  placeholder="Explain why this modification improves treaty efficacy or resolves member state concerns..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-display font-bold text-xs transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <GitPullRequest className="w-4 h-4" />
                <span>Submit Redline Amendment to Plenary</span>
              </button>
            </form>
          )}

          {/* TAB 3: REVISION CHANGELOG TREE */}
          {activeTab === 'revisions' && (
            <div className="space-y-4">
              {revisions.length === 0 ? (
                <div className="text-center py-12 text-neutral-500 font-mono text-xs">
                  Initial version v1.0 currently active. No ratified changelogs recorded yet.
                </div>
              ) : (
                revisions.map((rev, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-cyan-400">{rev.version}</span>
                      <span className="text-neutral-500">{new Date(rev.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-neutral-300">
                      <strong>Summary:</strong> {rev.diffSummary}
                    </p>
                    <p className="text-[11px] font-mono text-neutral-400">
                      Ratified by: {rev.ratifiedByName}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
