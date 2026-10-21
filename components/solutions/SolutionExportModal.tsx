'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Printer, 
  FileText, 
  FileCode, 
  ShieldCheck, 
  Check, 
  Award, 
  Sparkles, 
  Lock, 
  ExternalLink,
  Sliders,
  Info,
  Loader2,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { SolutionDocument } from '@/types/solutions';
import { useAuth } from '@/context/AuthContext';
import { useAccountCapabilities } from '@/hooks/useAccountCapabilities';
import { 
  getDocumentExportAttribution, 
  printSolutionDocument, 
  exportSolutionDocumentAsDocx, 
  exportSolutionDocumentAsMarkdown 
} from '@/lib/export/solutionDocumentExporter';
import { sheetSync } from '@/lib/googleSheets';

interface SolutionExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: SolutionDocument;
}

export function SolutionExportModal({ isOpen, onClose, document: doc }: SolutionExportModalProps) {
  const { user, profile } = useAuth();
  const { isProfessionalEnabled, isEventEnabled, isUniversalFounder } = useAccountCapabilities();
  
  // Compute live attribution and tier privileges from current session
  const attribution = useMemo(() => {
    return getDocumentExportAttribution(doc, {
      username: user?.username || profile?.username,
      name: user?.name || profile?.display_name,
      email: user?.email,
      role: profile?.role,
    });
  }, [doc, user, profile]);

  const canRemoveWatermark = 
    attribution.tierFamily !== 'FREE' || 
    attribution.isWatermarkRemoved || 
    isUniversalFounder || 
    isProfessionalEnabled || 
    isEventEnabled;

  // Custom export options: voting record is disabled by default on official bills
  const [includeVotes, setIncludeVotes] = useState(false);
  const [removeWatermark, setRemoveWatermark] = useState(canRemoveWatermark);
  const [customLetterhead, setCustomLetterhead] = useState('');

  // Synchronize watermark privilege when tier hydrates
  useEffect(() => {
    setRemoveWatermark(canRemoveWatermark);
  }, [canRemoveWatermark]);

  // Loading Screen & Pipeline Progression State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [processingFormat, setProcessingFormat] = useState<string>('');
  const [exportComplete, setExportComplete] = useState<boolean>(false);

  if (!isOpen || !doc) return null;

  const runExportWithLoading = async (format: 'print' | 'docx' | 'md') => {
    setIsProcessing(true);
    setProcessingFormat(format);
    setExportComplete(false);

    const effectiveRemoveWatermark = canRemoveWatermark ? removeWatermark : false;

    try {
      // Step 1: Formatting clauses & chapters
      setProcessingStage(`Structuring ${doc.clauses.length} clauses into legal hierarchy...`);
      await new Promise((r) => setTimeout(r, 650));

      // Step 2: Applying subscription watermark & trademark
      setProcessingStage(
        effectiveRemoveWatermark
          ? `Applying registered trademark: "${attribution.uploaderName}" (Watermark Removed)...`
          : `Affixing verified watermark: "${attribution.watermarkText}"...`
      );
      await new Promise((r) => setTimeout(r, 700));

      // Step 3: Generating cryptographic signature and compiling document
      setProcessingStage(`Minting security hash [${attribution.verificationHash}] & compiling document...`);
      await new Promise((r) => setTimeout(r, 550));

      // Step 4: Dispatch export
      const exportOptions = {
        includeVotes,
        customLetterhead: customLetterhead.trim() || undefined,
        removeWatermark: effectiveRemoveWatermark,
      };

      if (format === 'print') {
        printSolutionDocument(doc, attribution, exportOptions);
      } else if (format === 'docx') {
        exportSolutionDocumentAsDocx(doc, attribution, exportOptions);
      } else if (format === 'md') {
        exportSolutionDocumentAsMarkdown(doc, attribution, exportOptions);
      }

      // Asynchronously log to Register 47_ZEN_DOCS_METRICS
      sheetSync.dispatchRaw({
        tab: '47_ZEN_DOCS_METRICS',
        data: {
          Doc_ID: doc.id,
          Title: doc.title,
          Document_Type: doc.documentType || 'LEGISLATIVE_BILL',
          Author_Username: user?.username || profile?.username || doc.proposedByUsername || 'author',
          Word_Count: (doc.clauses || []).reduce((acc, c) => acc + (c.text?.split(/\s+/).length || 0), 0),
          Character_Count: (doc.clauses || []).reduce((acc, c) => acc + (c.text?.length || 0), 0),
          Clauses_Count: (doc.clauses || []).length,
          Watermark_Tier: attribution.tierFamily,
          Last_Exported_Format: format.toUpperCase(),
          Last_Saved_At: new Date().toISOString(),
          Notes: `Watermark Removed: ${effectiveRemoveWatermark ? 'Yes' : 'No'}`
        }
      }).catch(() => {});

      setExportComplete(true);
      setProcessingStage('Document generated and prepared for official use!');
      await new Promise((r) => setTimeout(r, 900));
    } finally {
      setIsProcessing(false);
      setExportComplete(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        key="solution-export-backdrop"
        className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md"
      >
        <motion.div
          key="solution-export-card"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl rounded-3xl bg-[#090b14] border border-cyan-500/30 p-5 sm:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.9)] text-white font-sans space-y-6 max-h-[92vh] overflow-y-auto"
        >
          {/* Active Compilation & Loading Screen Overlay */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 rounded-3xl bg-neutral-950/95 backdrop-blur-lg flex flex-col items-center justify-center p-6 text-center space-y-5"
              >
                <div className="relative flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
                  <div className="absolute p-3 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                    {exportComplete ? (
                      <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                    ) : (
                      <Sparkles className="w-7 h-7 text-cyan-400 animate-pulse" />
                    )}
                  </div>
                </div>

                <div className="space-y-2 max-w-md">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                    {attribution.planDisplayName} • Sovereign Compiler
                  </span>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {exportComplete ? 'Document Ready for Use' : 'Formatting Clauses & Watermarks'}
                  </h3>
                  <p className="text-xs font-mono text-cyan-400/90 animate-pulse">
                    {processingStage}
                  </p>
                </div>

                <div className="w-full max-w-xs h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-cyan-400"
                    initial={{ width: '15%' }}
                    animate={{ width: exportComplete ? '100%' : '85%' }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                  />
                </div>

                <div className="text-[10px] font-mono text-neutral-500">
                  {attribution.isWatermarkRemoved 
                    ? 'Pro Entitlement: Clean background output without watermark'
                    : 'Free Tier Entitlement: Platform watermark affixed'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold font-display text-white tracking-tight">
                  Export Official Document
                </h2>
                <p className="text-xs text-neutral-400 font-mono">
                  Ref: <span className="text-cyan-300 font-bold">{doc.documentCode}</span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="p-2 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition cursor-pointer disabled:opacity-30"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Attribution & Trademark Preview Card */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Trademark & Attribution Engine
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                canRemoveWatermark 
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-300'
              }`}>
                {attribution.planDisplayName}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Document Author</div>
                <div className="text-white font-bold truncate">{attribution.uploaderName}</div>
                <div className="text-[10px] text-neutral-500">@{attribution.uploaderUsername}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Watermark Status</div>
                <div className={`font-bold flex items-center gap-1.5 ${
                  (canRemoveWatermark && removeWatermark) ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {(canRemoveWatermark && removeWatermark) ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Clean Background (Removed)
                    </>
                  ) : (
                    <>
                      <Info className="w-3.5 h-3.5" />
                      Platform Civic Watermark
                    </>
                  )}
                </div>
                <div className="text-[10px] text-neutral-500 truncate">
                  {(canRemoveWatermark && removeWatermark) ? 'Pro White-label active' : attribution.watermarkText}
                </div>
              </div>
            </div>

            {/* Trademark Banner Preview */}
            <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-[11px] font-mono text-cyan-200">
              <div className="font-bold text-cyan-300 text-[10px] tracking-wider uppercase mb-0.5">
                Embossed Trademark Registry:
              </div>
              <div className="truncate">{attribution.trademarkBadge}</div>
              <div className="text-[9px] text-cyan-400/70 mt-1">
                Hash: {attribution.verificationHash} • QR Link Verification Active
              </div>
            </div>
          </div>

          {/* Export Customization Options */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-300 flex items-center gap-1.5 font-bold">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              Document Formatter Options
            </h3>

            <div className="space-y-2.5">
              {/* 1. Watermark Control (Governed by Subscription Tier) */}
              {canRemoveWatermark ? (
                <label className="flex items-center gap-2.5 text-xs text-neutral-300 cursor-pointer p-2.5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/30 transition">
                  <input
                    type="checkbox"
                    checked={removeWatermark}
                    onChange={(e) => setRemoveWatermark(e.target.checked)}
                    className="rounded border-neutral-700 bg-neutral-900 text-emerald-400 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="font-sans font-medium text-white">Remove Platform Watermark</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold uppercase">
                      Pro Entitlement
                    </span>
                  </div>
                </label>
              ) : (
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Platform Watermark included on Free Tier.</span>
                  </div>
                  <a href="/pricing" className="text-cyan-400 hover:underline flex items-center gap-1 font-bold text-[10px]">
                    Upgrade to Remove <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              )}

              {/* 2. Plenary Voting Record Option (Excluded by default on official legal bills) */}
              <label className="flex items-center gap-2.5 text-xs text-neutral-300 cursor-pointer p-2 rounded-xl hover:bg-white/[0.02] transition">
                <input
                  type="checkbox"
                  checked={includeVotes}
                  onChange={(e) => setIncludeVotes(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-900 text-cyan-500 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span className="text-neutral-400">Include Plenary Voting Bar in Document <span className="text-[10px] opacity-70">(Excluded by default on official legal bills)</span></span>
              </label>

              {/* 3. Custom Letterhead */}
              {attribution.tierFamily !== 'FREE' ? (
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    Custom Committee Letterhead (Pro & Elite Only):
                  </label>
                  <input
                    type="text"
                    value={customLetterhead}
                    onChange={(e) => setCustomLetterhead(e.target.value)}
                    placeholder={doc.committee || 'e.g. SPECIAL DIPLOMATIC ENVOY'}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] font-mono text-neutral-400 flex items-center justify-between">
                  <span>Custom Letterhead is locked to Pro subscribers.</span>
                  <a href="/pricing" className="text-cyan-400 hover:underline flex items-center gap-1">
                    Upgrade <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Export Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {/* Print / PDF Button */}
            <button
              type="button"
              onClick={() => runExportWithLoading('print')}
              disabled={isProcessing}
              className="p-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold transition flex flex-col items-center justify-center gap-1.5 text-xs shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
            >
              <Printer className="w-5 h-5" />
              <span>Print / Save as PDF</span>
              <span className="text-[9px] font-normal opacity-80">Vector A4 Sheet</span>
            </button>

            {/* Word / DOCX Button */}
            <button
              type="button"
              onClick={() => runExportWithLoading('docx')}
              disabled={isProcessing}
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition flex flex-col items-center justify-center gap-1.5 text-xs cursor-pointer disabled:opacity-50"
            >
              <FileText className="w-5 h-5 text-blue-400" />
              <span>Word (.doc)</span>
              <span className="text-[9px] font-normal text-neutral-400">Editable Document</span>
            </button>

            {/* Markdown Button */}
            <button
              type="button"
              onClick={() => runExportWithLoading('md')}
              disabled={isProcessing}
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition flex flex-col items-center justify-center gap-1.5 text-xs cursor-pointer disabled:opacity-50"
            >
              <FileCode className="w-5 h-5 text-emerald-400" />
              <span>Markdown (.md)</span>
              <span className="text-[9px] font-normal text-neutral-400">Portable Raw Text</span>
            </button>
          </div>

          {/* Footer Legal Note */}
          <div className="text-[10px] font-mono text-neutral-500 text-center border-t border-white/5 pt-3">
            Protected under ZENVITRA Sovereign Publishing Protocol. Attribution is permanently affixed.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
