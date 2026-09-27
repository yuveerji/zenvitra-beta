'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  Check,
  X,
  FileText,
  Scale,
  Layers,
  BookOpen,
  Send,
  Building2
} from 'lucide-react';
import { ZenDocument } from '@/types/docs';
import { DocumentType, SolutionCategory } from '@/types/solutions';

export interface UploadToSolutionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDoc: ZenDocument;
  rawText: string;
  wordCount: number;
  onToast?: (msg: string) => void;
}

export function UploadToSolutionsModal({
  isOpen,
  onClose,
  activeDoc,
  rawText,
  wordCount,
  onToast,
}: UploadToSolutionsModalProps) {
  const router = useRouter();

  // Map ZenDocType to Solution DocumentType
  const mapDocType = (): DocumentType => {
    switch (activeDoc.docType) {
      case 'INDIAN_BILL':
        return 'LEGISLATIVE_BILL';
      case 'UN_RESOLUTION':
      case 'DRAFT_RESOLUTION':
        return 'DRAFT_RESOLUTION';
      case 'POLICY_WORKING_PAPER':
        return 'POLICY_WHITEPAPER';
      case 'PRESS_ARTICLE':
      case 'PRESS_RELEASE':
        return 'PRESS_RELEASE';
      case 'RESEARCH_PAPER':
        return 'REPORT';
      default:
        return 'LEGISLATIVE_BILL';
    }
  };

  const [targetType, setTargetType] = useState<DocumentType>(mapDocType());
  const [targetCategory, setTargetCategory] = useState<SolutionCategory>('EDUCATION');
  const [targetCommittee, setTargetCommittee] = useState<string>(
    activeDoc.docType === 'INDIAN_BILL' ? 'Lok Sabha (Parliament of India)' : 'UN General Assembly / Plenary'
  );
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleConfirmUpload = () => {
    setIsExporting(true);

    // Extract cleanest text version of the draft
    const cleanDraftText = rawText || activeDoc.contentHtml?.replace(/<[^>]*>/g, '\n') || activeDoc.title;

    const payload = {
      rawText: cleanDraftText,
      title: activeDoc.title,
      type: targetType,
      category: targetCategory,
      committee: targetCommittee,
      importedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem('zenvitra_solutions_import', JSON.stringify(payload));
      if (onToast) onToast('Draft transferred to ZEN.SOLUTIONS engine!');
    } catch (e) {
      console.error('Failed to store draft for solutions:', e);
    }

    onClose();
    // Redirect to Solutions repository with trigger flag
    router.push('/solutions?importZenDoc=1');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in text-left">
      <div className="w-full max-w-2xl bg-gradient-to-b from-[#0e111d] via-[#090b14] to-[#040508] border border-cyan-500/40 rounded-3xl p-5 sm:p-8 shadow-[0_0_80px_rgba(6,182,212,0.25)] relative overflow-hidden space-y-6 text-white font-sans max-h-[92dvh] overflow-y-auto">
        
        {/* Glow ambient background accents */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 blur-[90px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-600/10 blur-[90px] pointer-events-none rounded-full" />

        {/* Modal Top Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4 relative z-10">
          <div className="space-y-1.5 min-w-0 pr-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] uppercase font-bold tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>ZEN.SOLUTIONS &bull; UNIVERSAL DOCUMENT ENGINE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              Draft Complete! Should I upload it on ZEN.SOLUTIONS?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
              ZENVITRA will automatically parse your draft into interactive clauses, scan for structural consistency, and publish it for community voting, debates, and redline amendments.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Draft Inspection Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                <FileText className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">Document Ready for Ingestion</span>
                <h3 className="font-bold text-sm sm:text-base text-white truncate max-w-md">{activeDoc.title}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-neutral-300">
                {wordCount} words
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold uppercase text-[10px]">
                {targetType.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Excerpt preview */}
          <div className="p-3 rounded-xl bg-black/50 border border-white/5 text-neutral-300 font-serif text-xs line-clamp-3 leading-relaxed">
            {rawText.slice(0, 320) || 'Official legislative or policy text drafted in ZenDocs sovereign editor...'}
          </div>
        </div>

        {/* Target Metadata Configuration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10 font-sans text-xs">
          <div>
            <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1 font-semibold">Document Format</label>
            <select
              value={targetType}
              onChange={(e) => setTargetType(e.target.value as DocumentType)}
              className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white font-mono text-xs focus:border-cyan-400 outline-none"
            >
              <option value="LEGISLATIVE_BILL">Legislative Bill (Statutory)</option>
              <option value="DRAFT_RESOLUTION">Draft Resolution (UN / MUN)</option>
              <option value="POLICY_WHITEPAPER">Policy Whitepaper</option>
              <option value="TREATY_CHARTER">Treaty &amp; Action Charter</option>
              <option value="WORKING_PAPER">Working Paper</option>
              <option value="PRESS_RELEASE">Official Press Release</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1 font-semibold">Policy Category</label>
            <select
              value={targetCategory}
              onChange={(e) => setTargetCategory(e.target.value as SolutionCategory)}
              className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white font-mono text-xs focus:border-cyan-400 outline-none"
            >
              <option value="EDUCATION">Education Reform &amp; Student Equity</option>
              <option value="GOVERNANCE">Civic Governance &amp; Youth Policy</option>
              <option value="CLIMATE_ENVIRONMENT">Climate, Energy &amp; Ecology</option>
              <option value="DIGITAL_CIVICS">AI Governance &amp; Sovereign Tech</option>
              <option value="JUSTICE_RIGHTS">Constitutional Liberties &amp; Justice</option>
              <option value="GLOBAL_DIPLOMACY">Peacekeeping &amp; Geopolitics</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1 font-semibold">Legislative Chamber</label>
            <input
              type="text"
              value={targetCommittee}
              onChange={(e) => setTargetCommittee(e.target.value)}
              placeholder="e.g. Lok Sabha / UNGA"
              className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white font-sans text-xs focus:border-cyan-400 outline-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 pt-3 border-t border-white/10 relative z-10 font-mono text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition cursor-pointer"
          >
            Keep Drafting in ZenDocs
          </button>

          <button
            type="button"
            onClick={handleConfirmUpload}
            disabled={isExporting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold tracking-wide transition hover:opacity-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(6,182,212,0.4)] ml-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isExporting ? 'Transferring...' : '✓ YES, UPLOAD TO ZEN.SOLUTIONS'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
