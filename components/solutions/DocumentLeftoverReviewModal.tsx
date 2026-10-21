'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Plus,
  ArrowRight,
  FileText,
  X,
  FileCheck,
  Edit3,
  Layers,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { DocumentAnalysisReport, UnparsedSegment } from '@/lib/docEngine/parser';

export interface DocumentLeftoverReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: DocumentAnalysisReport | null;
  fileName?: string;
  onApplyDocument: (finalStructuredText: string) => void;
}

interface EditableSegment {
  id: string;
  text: string;
  suggestedType: UnparsedSegment['suggestedType'];
  detectionReason: string;
  status: 'PENDING' | 'ADDED_AS_CLAUSE' | 'MERGED_PREV' | 'ADDED_PREAMBLE' | 'DISCARDED';
}

export function DocumentLeftoverReviewModal({
  isOpen,
  onClose,
  report,
  fileName,
  onApplyDocument
}: DocumentLeftoverReviewModalProps) {
  const [segments, setSegments] = useState<EditableSegment[]>([]);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (report?.unparsedSegments) {
      setSegments(
        report.unparsedSegments.map(s => ({
          id: s.id,
          text: s.text,
          suggestedType: s.suggestedType,
          detectionReason: s.detectionReason,
          status: 'PENDING'
        }))
      );
    } else {
      setSegments([]);
    }
  }, [report]);

  if (!isOpen || !report) return null;

  const pendingSegments = segments.filter(s => s.status === 'PENDING');
  const addedAsClauses = segments.filter(s => s.status === 'ADDED_AS_CLAUSE');
  const mergedPrev = segments.filter(s => s.status === 'MERGED_PREV');
  const addedPreamble = segments.filter(s => s.status === 'ADDED_PREAMBLE');
  const discarded = segments.filter(s => s.status === 'DISCARDED');

  const updateSegmentStatus = (id: string, status: EditableSegment['status']) => {
    setSegments(prev => prev.map(s => (s.id === id ? { ...s, status } : s)));
  };

  const updateSegmentText = (id: string, newText: string) => {
    setSegments(prev => prev.map(s => (s.id === id ? { ...s, text: newText } : s)));
  };

  const handleConvertAllToClauses = () => {
    setSegments(prev =>
      prev.map(s => (s.status === 'PENDING' ? { ...s, status: 'ADDED_AS_CLAUSE' } : s))
    );
  };

  const handleDiscardAllRemaining = () => {
    setSegments(prev =>
      prev.map(s => (s.status === 'PENDING' ? { ...s, status: 'DISCARDED' } : s))
    );
  };

  const handleFinalizeAndLoad = () => {
    const { parsedDoc } = report;
    let finalOutput = '';

    // 1. Title
    if (parsedDoc.title) {
      finalOutput += `${parsedDoc.title}\n\n`;
    }

    // 2. Preamble & Enacting Formula
    let fullPreamble = parsedDoc.preamble || '';
    if (addedPreamble.length > 0) {
      const extraPreamble = addedPreamble.map(s => s.text).join('\n\n');
      fullPreamble = fullPreamble ? `${fullPreamble}\n\n${extraPreamble}` : extraPreamble;
    }
    if (fullPreamble) {
      finalOutput += `${fullPreamble}\n\n`;
    }

    if (parsedDoc.enactingFormula) {
      finalOutput += `${parsedDoc.enactingFormula}\n\n`;
    }

    // 3. Chapters & Clauses
    let currentClauseCounter = 1;
    let currentChapter = '';

    parsedDoc.clauses.forEach(cl => {
      if (cl.chapterNumber && cl.chapterNumber !== currentChapter) {
        currentChapter = cl.chapterNumber;
        finalOutput += `${cl.chapterNumber}. ${(cl.chapterTitle || 'PROVISIONS').toUpperCase()}\n\n`;
      }

      finalOutput += `Clause ${currentClauseCounter}: ${cl.title || 'Provisions'}\n`;
      finalOutput += `${cl.text}\n`;

      const subList = cl.subClauses || cl.subItems;
      if (subList && subList.length > 0) {
        subList.forEach(sub => {
          const numPrefix = sub.number.startsWith('(') ? sub.number : `(${sub.number})`;
          finalOutput += `  ${numPrefix} ${sub.text}\n`;
        });
      }
      finalOutput += '\n';
      currentClauseCounter++;
    });

    // 4. Append Merged items to the last clause if needed
    if (mergedPrev.length > 0) {
      const mergedText = mergedPrev.map(s => s.text).join('\n\n');
      finalOutput += `${mergedText}\n\n`;
    }

    // 5. Append user-selected "Added as New Clause" segments
    if (addedAsClauses.length > 0) {
      finalOutput += `### ADDITIONAL AD-HOC PROVISIONS\n\n`;
      addedAsClauses.forEach(seg => {
        finalOutput += `Clause ${currentClauseCounter}: Additional Provision\n`;
        finalOutput += `${seg.text}\n\n`;
        currentClauseCounter++;
      });
    }

    onApplyDocument(finalOutput.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl animate-fade-in text-left">
      <div className="w-full max-w-4xl bg-gradient-to-b from-[#0e111d] via-[#090b14] to-[#040508] border border-cyan-500/40 rounded-3xl p-5 sm:p-8 shadow-[0_0_90px_rgba(6,182,212,0.3)] relative overflow-hidden space-y-6 text-white font-sans max-h-[92dvh] flex flex-col">
        
        {/* Glow ambient background accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 blur-[100px] pointer-events-none rounded-full" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5 relative z-10 shrink-0">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DATA ANALYSIS &amp; CLAUSE CONVERTER</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-white">
              Data Analysis Complete: Is Something Left?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              {fileName ? (
                <span>Converted file: <strong className="text-cyan-300 font-mono">{fileName}</strong></span>
              ) : (
                'Review structured clauses and verify whether unnumbered paragraphs should be included.'
              )}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telemetry Quad Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10 shrink-0">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-cyan-500/30 text-left">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">Structured Clauses</span>
            <div className="text-xl sm:text-2xl font-black font-display text-cyan-400 mt-0.5">
              {report.parsedDoc.totalClauses}
            </div>
            <span className="text-[10px] font-mono text-neutral-500">Ready for deliberation</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-purple-500/30 text-left">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">Chapters Detected</span>
            <div className="text-xl sm:text-2xl font-black font-display text-purple-400 mt-0.5">
              {report.parsedDoc.chapters.length}
            </div>
            <span className="text-[10px] font-mono text-neutral-500">Legal structure</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-emerald-500/30 text-left">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">Empirical Coverage</span>
            <div className="text-xl sm:text-2xl font-black font-display text-emerald-400 mt-0.5">
              {report.coveragePercent}%
            </div>
            <span className="text-[10px] font-mono text-neutral-500">{report.totalInputWords} total words</span>
          </div>

          <div className={`p-3.5 rounded-2xl border text-left ${
            pendingSegments.length > 0 
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' 
              : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
          }`}>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">Unparsed Paragraphs</span>
            <div className="text-xl sm:text-2xl font-black font-display mt-0.5">
              {pendingSegments.length}
            </div>
            <span className="text-[10px] font-mono text-neutral-400">
              {pendingSegments.length > 0 ? 'Action required below' : 'Zero items left'}
            </span>
          </div>
        </div>

        {/* Scrollable Body: Unparsed items or Success State */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 relative z-10">
          {pendingSegments.length === 0 && segments.length === 0 && (
            <div className="py-12 px-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white font-display">100% Complete Clause Extraction</h3>
              <p className="text-xs text-neutral-300 max-w-lg mx-auto">
                Every paragraph in your document successfully aligned with sovereign clauses and legal chapters. No unparsed text or orphan provisions were detected.
              </p>
            </div>
          )}

          {pendingSegments.length > 0 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-amber-200">
                      ⚠️ Something is left: {pendingSegments.length} Unnumbered Paragraphs Detected
                    </h4>
                    <p className="text-[11px] text-neutral-300 leading-relaxed font-sans">
                      These sections didn't have numbers like "Clause 1." or "Section 2.". Review each block below to add them as new clauses, merge with existing clauses, or discard.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleConvertAllToClauses}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold uppercase transition cursor-pointer"
                  >
                    + Add All as Clauses
                  </button>
                  <button
                    onClick={handleDiscardAllRemaining}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white font-mono text-[10px] uppercase transition cursor-pointer"
                  >
                    Discard All
                  </button>
                </div>
              </div>

              {/* List of unparsed segments */}
              <div className="space-y-3">
                {segments.map((seg, idx) => {
                  if (seg.status !== 'PENDING') {
                    return (
                      <div
                        key={seg.id}
                        className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs font-mono opacity-60"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-[10px] text-neutral-500 font-bold">#{idx + 1}</span>
                          <span className="truncate max-w-md text-neutral-300">{seg.text}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-cyan-400">
                            {seg.status.replace(/_/g, ' ')}
                          </span>
                          <button
                            onClick={() => updateSegmentStatus(seg.id, 'PENDING')}
                            className="text-[10px] text-neutral-400 hover:text-white underline cursor-pointer"
                          >
                            Undo
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={seg.id}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 transition-all space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[10px] font-bold">
                            #{idx + 1}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold uppercase">
                            {seg.detectionReason}
                          </span>
                        </div>

                        <span className="text-[10px] font-mono text-neutral-500">
                          {seg.text.split(/\s+/).filter(Boolean).length} words
                        </span>
                      </div>

                      {/* Editable text area */}
                      <textarea
                        value={seg.text}
                        onChange={(e) => updateSegmentText(seg.id, e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-neutral-200 focus:outline-none focus:border-cyan-400 resize-y leading-relaxed"
                        placeholder="Edit clause text here..."
                      />

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
                        <button
                          onClick={() => updateSegmentStatus(seg.id, 'ADDED_AS_CLAUSE')}
                          className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-bold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add as New Clause</span>
                        </button>

                        <button
                          onClick={() => updateSegmentStatus(seg.id, 'MERGED_PREV')}
                          className="px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 font-bold transition flex items-center gap-1.5 cursor-pointer"
                          title="Append to the preceding clause"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>Merge with Previous</span>
                        </button>

                        <button
                          onClick={() => updateSegmentStatus(seg.id, 'ADDED_PREAMBLE')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>🏷️ Add to Preamble</span>
                        </button>

                        <button
                          onClick={() => updateSegmentStatus(seg.id, 'DISCARDED')}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 transition flex items-center gap-1.5 cursor-pointer ml-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Discard</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 relative z-10 shrink-0 font-mono text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleFinalizeAndLoad}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-purple-500 to-blue-500 text-black font-black uppercase tracking-wider transition hover:opacity-95 shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center gap-2 cursor-pointer ml-auto"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>✓ Load All Clauses into Drafting Studio ⚡</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>

      </div>
    </div>
  );
}
