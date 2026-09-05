'use client';

import React, { useState } from 'react';
import { 
  X, 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  Copy, 
  Check
} from 'lucide-react';
import { CONSTITUTION_ARTICLES } from '@/lib/constitutionData';
import { motion, AnimatePresence } from 'framer-motion';

interface AmendmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ARTICLES_LIST = CONSTITUTION_ARTICLES.map((a) => ({
  id: a.id,
  name: `${a.articleNumber} — ${a.title} ${a.id === 'article-1' || a.id === 'article-2' || a.id === 'article-9' || a.id === 'article-10' ? '(Genesis Lock)' : ''}`.trim(),
}));

export function AmendmentModal({ isOpen, onClose }: AmendmentModalProps) {
  const [targetArticle, setTargetArticle] = useState(ARTICLES_LIST[2].name);
  const [targetClause, setTargetClause] = useState('Section 3.01 (Proof-of-Citation Audit)');
  const [amendmentType, setAmendmentType] = useState<'modify' | 'add' | 'strengthen' | 'clarify'>('modify');
  const [proposerHandle, setProposerHandle] = useState('');
  const [redlineContent, setRedlineContent] = useState('');
  const [empiricalRationale, setEmpiricalRationale] = useState('');
  const [citations, setCitations] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [docketId, setDocketId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isGenesisLocked = targetArticle.includes('Genesis Lock');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!redlineContent.trim()) {
      setErrorMsg('Please specify the exact proposed text change or redline modification.');
      return;
    }
    if (!empiricalRationale.trim()) {
      setErrorMsg('Under Article III & VII, every amendment requires an empirical rationale or justification.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newDocketId = `ZEN-AMD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const petition = {
        id: newDocketId,
        targetArticle,
        targetClause,
        amendmentType,
        proposer: proposerHandle.trim() || '@sovereign_delegate',
        redlineContent: redlineContent.trim(),
        empiricalRationale: empiricalRationale.trim(),
        citations: citations.trim() || 'Internal Civic Deliberation',
        status: 'PENDING_PLENARY_SUPERMAJORITY',
        timestamp: new Date().toISOString(),
      };

      // Persist to local constitutional amendments docket
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('zenvitra_constitutional_amendments_v1');
        const list = raw ? JSON.parse(raw) : [];
        list.unshift(petition);
        localStorage.setItem('zenvitra_constitutional_amendments_v1', JSON.stringify(list));

        // Create an active notification for the user
        const rawNotifs = localStorage.getItem('zenvitra_stored_notifications_v1');
        const notifs = rawNotifs ? JSON.parse(rawNotifs) : [];
        notifs.unshift({
          id: `amd_${newDocketId}`,
          title: `Amendment Petition Docketed (${newDocketId})`,
          message: `Petition to amend ${targetClause} submitted for plenary caucus review and roll-call supermajority.`,
          timestamp: 'Just now',
          type: 'directive',
          read: false,
          author: '@secretariat (Civic Assembly)',
          priority: 'CONSTITUTIONAL',
        });
        localStorage.setItem('zenvitra_stored_notifications_v1', JSON.stringify(notifs));
        window.dispatchEvent(new Event('zenvitra_activity_sync'));
      }

      setDocketId(newDocketId);
    } catch {
      setErrorMsg('Failed to docket petition. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopySummary = () => {
    if (!docketId) return;
    const summary = `[ZENVITRA CONSTITUTIONAL AMENDMENT PETITION]
Docket: ${docketId}
Article: ${targetArticle}
Clause: ${targetClause}
Type: ${amendmentType.toUpperCase()}
Proposer: ${proposerHandle || '@sovereign_delegate'}
Proposed Redline:
${redlineContent}
Empirical Rationale:
${empiricalRationale}
Citations: ${citations || 'N/A'}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetAndClose = () => {
    setDocketId(null);
    setRedlineContent('');
    setEmpiricalRationale('');
    setCitations('');
    setErrorMsg('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3.5 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleResetAndClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#08090e] border border-amber-500/30 p-6 sm:p-8 shadow-[0_25px_90px_rgba(0,0,0,0.95)] z-10 text-left space-y-6"
        >
          {/* Top glowing accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-500" />

          {/* Header Row */}
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[9px] font-mono font-bold tracking-widest text-amber-300 uppercase">
                  <Scale className="w-3 h-3 text-amber-400" />
                  ARTICLE VII PROTOCOL
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  FORMAL AMENDMENT PETITION
                </span>
              </div>
              <h3 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight pt-1">
                Request Constitutional Amendment
              </h3>
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="p-2 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {docketId ? (
            /* ─── SUCCESS VIEW ─── */
            <div className="space-y-6 py-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="font-mono text-[11px] uppercase tracking-widest text-emerald-400 font-bold">
                  PETITION FORMALLY DOCKETED
                </span>
                <h4 className="font-display font-black text-2xl text-white">
                  Docket #{docketId}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-300 font-light max-w-md mx-auto leading-relaxed">
                  Your amendment petition has been entered into the Article VII deliberation register and dispatched to the Plenary Youth Assembly docket.
                </p>
              </div>

              {/* Status Box */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2 text-left font-mono text-xs text-neutral-300">
                <div className="flex justify-between items-center text-[10px] text-neutral-500 pb-2 border-b border-white/5">
                  <span>TARGET:</span>
                  <span className="text-white font-bold">{targetClause}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-neutral-500 pb-2 border-b border-white/5">
                  <span>PROPOSER:</span>
                  <span className="text-amber-300 font-bold">{proposerHandle || '@sovereign_delegate'}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-neutral-500">
                  <span>RATIFICATION THRESHOLD:</span>
                  <span className="text-emerald-400 font-bold">75% Supermajority Deliberation</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-mono text-xs flex items-center gap-2 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Summary!' : 'Copy Docket Summary'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* ─── FORM VIEW ─── */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Genesis Lock Warning if Selected */}
              {isGenesisLocked && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-amber-300">GENESIS LOCK INVARIANT (Section 7.01)</p>
                    <p className="text-[11px] leading-relaxed text-amber-200/90 font-light font-sans">
                      This article is permanently protected against dilution or repeal. Petitions may only propose enhanced cryptographic enforcement or stronger transparency. Any proposal reducing zero-surveillance, 25% escrow, or secular neutrality will be void.
                    </p>
                  </div>
                </div>
              )}

              {/* Target Article Select */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                  Target Constitutional Article
                </label>
                <select
                  value={targetArticle}
                  onChange={(e) => setTargetArticle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-amber-400/50 transition cursor-pointer"
                >
                  {ARTICLES_LIST.map((art) => (
                    <option key={art.id} value={art.name} className="bg-neutral-900 text-white">
                      {art.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clause and Type Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                    Target Clause / Section
                  </label>
                  <input
                    type="text"
                    value={targetClause}
                    onChange={(e) => setTargetClause(e.target.value)}
                    placeholder="e.g. Section 4.02 — 60s Guillotine Relay"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-400/50 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                    Amendment Motion Type
                  </label>
                  <select
                    value={amendmentType}
                    onChange={(e) => setAmendmentType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-amber-400/50 transition cursor-pointer"
                  >
                    <option value="modify" className="bg-neutral-900 text-white">Line-Item Redline Modification</option>
                    <option value="add" className="bg-neutral-900 text-white">Add New Clause / Provision</option>
                    <option value="strengthen" className="bg-neutral-900 text-white">Strengthen Enforcement Protocol</option>
                    <option value="clarify" className="bg-neutral-900 text-white">Constitutional Clarification</option>
                  </select>
                </div>
              </div>

              {/* Proposed Redline Content */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                    Proposed Redline Text *
                  </label>
                  <span className="text-[10px] font-mono text-neutral-500">Clause-by-Clause Syntax</span>
                </div>
                <textarea
                  rows={3}
                  value={redlineContent}
                  onChange={(e) => setRedlineContent(e.target.value)}
                  placeholder="Paste or write the exact text modification you are petitioning to be codified..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-400/50 transition resize-none leading-relaxed"
                />
              </div>

              {/* Empirical Rationale */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                    Empirical Rationale & Necessity (Article III Standard) *
                  </label>
                  <span className="text-[10px] font-mono text-cyan-400/80">Proof-of-Citation</span>
                </div>
                <textarea
                  rows={2}
                  value={empiricalRationale}
                  onChange={(e) => setEmpiricalRationale(e.target.value)}
                  placeholder="Explain why this change benefits the youth sovereign assembly, citing concrete evidence or parliamentary precedents..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-sans font-light text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-400/50 transition resize-none leading-relaxed"
                />
              </div>

              {/* Citations & Proposer Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                    Primary Citation / Reference Link
                  </label>
                  <input
                    type="text"
                    value={citations}
                    onChange={(e) => setCitations(e.target.value)}
                    placeholder="https://... or archive document"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-400/50 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                    Proposing Delegate Handle
                  </label>
                  <input
                    type="text"
                    value={proposerHandle}
                    onChange={(e) => setProposerHandle(e.target.value)}
                    placeholder="e.g. @del_yuveer or @assembly_node"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-400/50 transition"
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl">
                  {errorMsg}
                </p>
              )}

              {/* Actions */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white font-mono text-xs transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-black font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-lg disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Docketing Petition...' : 'Submit Redline Petition'}</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
