'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Edit3,
  RotateCcw,
  Eye,
  Send,
  Layers,
  Shield,
  FileCheck,
  ScrollText,
  Check,
  Plus,
  Trash2,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  FileEdit,
  ExternalLink
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SolutionDocument, DocumentType, SolutionCategory, DocumentClause, ClauseSubItem, ValidationIssue } from '@/types/solutions';
import { parseDocument, detectDocumentType, DOCUMENT_TYPE_METADATA, ParsedDocResult } from '@/lib/docEngine/parser';
import { SAMPLE_DRAFTS } from '@/lib/docEngine/sampleDrafts';
import { useAuth } from '@/context/AuthContext';

export interface ImportedDraftPayload {
  rawText?: string;
  title?: string;
  type?: DocumentType;
  category?: SolutionCategory;
  committee?: string;
}

interface DocEnginePostingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentCreated: (doc: SolutionDocument) => void;
  initialDraft?: ImportedDraftPayload | null;
}

export function DocEnginePostingModal({ isOpen, onClose, onDocumentCreated, initialDraft }: DocEnginePostingModalProps) {
  const router = useRouter();
  const { profile, user } = useAuth();

  // Wizard Steps: 1: INPUT -> 2: STRUCTURE & VALIDATION -> 3: CLAUSE REVIEW -> 4: CONFIRMATION
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Input
  const [rawText, setRawText] = useState('');
  const [forcedType, setForcedType] = useState<DocumentType>('LEGISLATIVE_BILL');
  const [category, setCategory] = useState<SolutionCategory>('EDUCATION');
  const [committee, setCommittee] = useState('Parliament of India / Public Policy & Solutions Council');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Step 2 & 3: Structured Document State
  const [parsedResult, setParsedResult] = useState<ParsedDocResult | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedClauses, setEditedClauses] = useState<DocumentClause[]>([]);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [activeEditingClauseId, setActiveEditingClauseId] = useState<string | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});

  // Step 4: Confirmation Checkboxes
  const [checkboxReviewed, setCheckboxReviewed] = useState(false);
  const [checkboxConfirm, setCheckboxConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when modal opens or initialDraft arrives
  useEffect(() => {
    if (initialDraft) {
      if (initialDraft.rawText) setRawText(initialDraft.rawText);
      if (initialDraft.type) setForcedType(initialDraft.type);
      if (initialDraft.category) setCategory(initialDraft.category);
      if (initialDraft.committee) setCommittee(initialDraft.committee);
      if (initialDraft.title) setEditedTitle(initialDraft.title);
    } else if (isOpen && !rawText) {
      // Auto-load coaching institutes bill draft by default for instant delight
      const defaultSample = SAMPLE_DRAFTS[0];
      if (defaultSample) {
        setRawText(defaultSample.rawText);
      }
    }
  }, [isOpen, initialDraft]);

  // Handler: Open in ZenDocs for full rich-text drafting
  const handleOpenInZenDocs = () => {
    const textToTransfer = rawText.trim() || SAMPLE_DRAFTS[0]?.rawText || '';
    const firstLine = textToTransfer.split('\n')[0].replace(/^#+\s*/, '').trim();
    const title = firstLine || 'Legislative Draft Bill';

    const transferData = {
      title,
      rawText: textToTransfer,
      type: forcedType,
      category,
      committee,
      createdAt: new Date().toISOString()
    };

    try {
      localStorage.setItem('zenvitra_draft_transfer', JSON.stringify(transferData));
    } catch (e) {
      console.error('Failed to save draft transfer:', e);
    }

    onClose();
    router.push('/docs?draftSource=solutions');
  };

  if (!isOpen) return null;

  // Handler: Analyze / Parse Document
  const handleParseDocument = async () => {
    if (!rawText.trim()) return;
    setIsAnalyzing(true);

    try {
      // Client-side instant parse
      const res = parseDocument(rawText, forcedType);
      setParsedResult(res);
      setEditedTitle(res.title);
      setEditedClauses(res.clauses);
      setValidationIssues(res.validationIssues);

      // Expand all chapters by default
      const expMap: Record<string, boolean> = {};
      res.chapters.forEach(c => { expMap[c.id] = true; });
      setExpandedChapters(expMap);

      setCurrentStep(2);
    } catch (err) {
      console.error('Document parsing error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handler: Load sample draft
  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_DRAFTS.find(s => s.id === sampleId);
    if (sample) {
      setRawText(sample.rawText);
      const detection = detectDocumentType(sample.rawText);
      setForcedType(detection.type);
    }
  };

  // Handler: Simulated File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          setRawText(content);
          const detection = detectDocumentType(content);
          setForcedType(detection.type);
        }
      };
      reader.readAsText(file);
    }
  };

  // Handler: Update individual clause
  const handleUpdateClause = (clauseId: string, field: keyof DocumentClause, value: any) => {
    setEditedClauses(prev => prev.map(c => {
      if (c.id === clauseId) {
        return { ...c, [field]: value };
      }
      return c;
    }));
  };

  // Handler: Add sub-clause
  const handleAddSubClause = (clauseId: string) => {
    setEditedClauses(prev => prev.map(c => {
      if (c.id === clauseId) {
        const sub = c.subClauses || [];
        const nextNum = `${c.clauseNumber}.${sub.length + 1}`;
        return {
          ...c,
          subClauses: [
            ...sub,
            { number: nextNum, text: 'New sub-clause provision...' }
          ]
        };
      }
      return c;
    }));
  };

  // Handler: Remove sub-clause
  const handleRemoveSubClause = (clauseId: string, subIndex: number) => {
    setEditedClauses(prev => prev.map(c => {
      if (c.id === clauseId) {
        const sub = [...(c.subClauses || [])];
        sub.splice(subIndex, 1);
        return { ...c, subClauses: sub };
      }
      return c;
    }));
  };

  // Handler: Resolve Validation Issue
  const handleResolveIssue = (issueId: string) => {
    setValidationIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        return { ...issue, resolved: true };
      }
      return issue;
    }));
  };

  // Handler: Auto-Fix Issue with AI
  const handleAutoFixIssue = (issue: ValidationIssue) => {
    if (issue.type === 'missing_info' && issue.id === 'issue_missing_competent_auth') {
      // Add definition to definitions clause
      setEditedClauses(prev => prev.map(c => {
        if (c.title?.toLowerCase().includes('definition')) {
          const sub = c.subClauses || [];
          return {
            ...c,
            subClauses: [
              ...sub,
              { number: `(${String.fromCharCode(97 + sub.length)})`, text: "'competent authority' means the National Regulatory Authority designated by the Central Government under this Act;" }
            ]
          };
        }
        return c;
      }));
      handleResolveIssue(issue.id);
    } else if (issue.type === 'incomplete' && issue.clauseNumber) {
      setEditedClauses(prev => prev.map(c => {
        if (c.clauseNumber === issue.clauseNumber) {
          return { ...c, text: c.text.trim().replace(/[,;]$/, '') + '.' };
        }
        return c;
      }));
      handleResolveIssue(issue.id);
    } else {
      handleResolveIssue(issue.id);
    }
  };

  // Handler: Final Submission
  const handleFinalPublish = () => {
    if (!checkboxReviewed || !checkboxConfirm || !parsedResult) return;
    setIsSubmitting(true);

    const isTestAccount = Boolean(
      profile?.username === 'test' || 
      user?.email === 'test@zenvitra.org' ||
      (typeof window !== 'undefined' && (() => {
        try {
          const s = JSON.parse(localStorage.getItem('zenvitra_session_user') || '{}');
          return s?.username === 'test' || s?.id === 'zen_test_pilot_node';
        } catch (_) { return false; }
      })())
    );

    const docTypeMeta = DOCUMENT_TYPE_METADATA[parsedResult.detectedType];
    const authorName = isTestAccount
      ? 'Test Pilot Node'
      : (profile?.display_name || profile?.username || user?.email?.split('@')[0] || 'Anonymous Diplomat');
    const authorUsername = isTestAccount ? 'test' : (profile?.username || 'member');

    const newDoc: SolutionDocument & { isTest?: boolean } = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      documentCode: isTestAccount 
        ? `TEST-BILL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
        : `BILL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      title: editedTitle.trim() || parsedResult.title,
      documentType: parsedResult.detectedType,
      category,
      committee,
      status: 'PROPOSED',
      leadSponsors: [authorName],
      proposedByUsername: authorUsername,
      signatories: [],
      abstract: parsedResult.preamble || `Official legislative draft comprising ${editedClauses.length} structured clauses and provisions.`,
      enactingFormula: parsedResult.enactingFormula,
      preamble: parsedResult.preamble,
      chapters: parsedResult.chapters,
      clauses: editedClauses,
      validationIssues: validationIssues.filter(i => !i.resolved),
      votes: { inFavor: 1, against: 0, abstain: 0 },
      votedUserIds: [authorUsername],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      isOfficial: !isTestAccount,
      isTest: isTestAccount,
    };

    onDocumentCreated(newDoc as SolutionDocument);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-5xl rounded-3xl bg-[#090b12] border border-cyan-500/30 p-3.5 sm:p-6 md:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.95)] z-10 text-white font-sans max-h-[94dvh] flex flex-col justify-between overflow-hidden"
        >
          {/* ── TOP HEADER & PIPELINE PROGRESS BAR ── */}
          <div className="border-b border-white/10 pb-3 sm:pb-4 mb-3 sm:mb-4">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <div className="p-1.5 sm:p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shrink-0">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="font-mono text-[9px] sm:text-[10px] text-cyan-400 uppercase tracking-widest font-bold">ZEN.DOCENGINE</span>
                    <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 font-mono truncate">Universal Structuring</span>
                  </div>
                  <h2 className="text-base sm:text-xl font-bold font-display text-white truncate">
                    {currentStep === 1 && 'Create Structured Document'}
                    {currentStep === 2 && 'Structure & Validation'}
                    {currentStep === 3 && 'Clause Review & Editing'}
                    {currentStep === 4 && 'Ready to Post?'}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Wizard Indicator */}
            <div className="grid grid-cols-4 gap-2 mt-3 pt-1">
              {[
                { step: 1, label: '1. Paste' },
                { step: 2, label: '2. Structure' },
                { step: 3, label: '3. Clauses' },
                { step: 4, label: '4. Post' },
              ].map((s) => (
                <div key={s.step} className="space-y-1">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      currentStep >= s.step ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]' : 'bg-white/10'
                    }`}
                  />
                  <div className={`text-[9px] sm:text-[10px] font-mono text-center truncate ${currentStep === s.step ? 'text-cyan-300 font-bold' : 'text-neutral-500'}`}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── STEP 1: INPUT, PASTE, & DETECT ── */}
          {currentStep === 1 && (
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              {/* Quick Load Example Drafts */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block font-semibold">Quick-Load Official Sample Drafts:</span>
                <div className="flex flex-wrap items-center gap-2">
                  {SAMPLE_DRAFTS.map((draft) => (
                    <button
                      key={draft.id}
                      type="button"
                      onClick={() => handleLoadSample(draft.id)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-500/40 border border-white/10 text-neutral-200 hover:text-cyan-300 font-mono text-[11px] transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">{draft.badge}</span>
                      <span>{draft.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Textarea */}
              <div className="space-y-1.5">
                {initialDraft && (
                  <div className="p-3 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-between gap-2 text-cyan-300 font-mono text-[11px]">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Imported from ZenDocs drafting studio: <strong className="text-white">"{initialDraft.title || 'Draft'}"</strong></span>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-200 uppercase font-bold shrink-0">Ready to Parse</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <label className="font-mono text-neutral-300 uppercase tracking-wider font-semibold">Paste Document or Legislative Bill Text</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleOpenInZenDocs}
                      className="text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center gap-1 font-mono font-bold transition hover:underline"
                      title="Open full rich-text editor for drafting this bill"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                      <span>Draft in ZenDocs ↗</span>
                    </button>
                    <label className="text-neutral-400 hover:text-white cursor-pointer flex items-center gap-1 font-mono transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload File (.txt, .md, .doc)</span>
                      <input type="file" accept=".txt,.md,.doc,.docx" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste your Bill, Draft Resolution, Treaty, Policy, or Rulebook here...

e.g.
THE PRIVATE COACHING INSTITUTES (REGULATION AND STUDENT WELFARE) BILL, 2026

BE it enacted by Parliament...

1. Short Title and Commencement
...
2. Definitions
...
3. Registration of Coaching Institutes
..."
                  rows={7}
                  className="w-full p-3 sm:p-4 rounded-2xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:border-cyan-400 outline-none leading-relaxed transition resize-none placeholder-neutral-600 min-h-[160px] sm:min-h-[240px]"
                />
              </div>

              {/* Document Configuration Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Target Document Type</label>
                  <select
                    value={forcedType}
                    onChange={(e) => setForcedType(e.target.value as DocumentType)}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white font-mono text-xs focus:border-cyan-400 outline-none"
                  >
                    {Object.entries(DOCUMENT_TYPE_METADATA).map(([key, meta]) => (
                      <option key={key} value={key}>{meta.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Policy Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SolutionCategory)}
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
                  <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Legislative Committee / Dais</label>
                  <input
                    type="text"
                    value={committee}
                    onChange={(e) => setCommittee(e.target.value)}
                    placeholder="e.g. Lok Sabha / UN General Assembly"
                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white font-sans text-xs focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: STRUCTURE TREE & VALIDATION ISSUES ── */}
          {currentStep === 2 && parsedResult && (
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              {/* Document Summary Banner */}
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-400 text-black font-mono text-[10px] font-bold">
                      {DOCUMENT_TYPE_METADATA[parsedResult.detectedType]?.badge || 'LEGISLATION'}
                    </span>
                    <span className="text-neutral-400 font-mono text-[11px]">
                      {parsedResult.chapters.length} Chapters • {editedClauses.length} Clauses Detected
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-white font-display">{editedTitle}</h3>
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-neutral-300">
                    Confidence: <strong className="text-emerald-400">{parsedResult.confidence}%</strong>
                  </span>
                </div>
              </div>

              {/* Validation Issues Alert Box (if any) */}
              {validationIssues.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-300 font-bold font-mono text-xs">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>{validationIssues.filter(i => !i.resolved).length} Structural Issues Detected</span>
                    </div>
                    <span className="text-[10px] text-amber-400/80 font-mono">Review suggested fixes</span>
                  </div>

                  <div className="space-y-2">
                    {validationIssues.map((issue) => (
                      <div
                        key={issue.id}
                        className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                          issue.resolved 
                            ? 'bg-emerald-500/10 border-emerald-500/30 opacity-70' 
                            : 'bg-black/40 border-amber-500/20'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-[11px]">{issue.title}</span>
                            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-white/10 font-mono text-neutral-300">{issue.type}</span>
                          </div>
                          <p className="text-[11px] text-neutral-400">{issue.description}</p>
                          {issue.suggestedFix && (
                            <p className="text-[10px] text-cyan-300 font-mono">Suggested fix: {issue.suggestedFix}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0 font-mono text-[10px]">
                          {issue.resolved ? (
                            <span className="text-emerald-400 flex items-center gap-1 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                            </span>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleAutoFixIssue(issue)}
                                className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold transition cursor-pointer"
                              >
                                Fix with AI
                              </button>
                              <button
                                type="button"
                                onClick={() => handleResolveIssue(issue.id)}
                                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
                              >
                                Dismiss
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expandable Document Structure Tree */}
              <div className="space-y-2">
                <span className="font-mono text-neutral-400 uppercase text-[10px] tracking-wider block font-semibold">Document Structural Tree (Chapters &amp; Clauses):</span>
                
                {parsedResult.chapters.map((chapter) => {
                  const isExpanded = expandedChapters[chapter.id] !== false;
                  const chapClauses = editedClauses.filter(c => c.chapterNumber === chapter.number);

                  return (
                    <div key={chapter.id} className="rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setExpandedChapters(prev => ({ ...prev, [chapter.id]: !isExpanded }))}
                        className="w-full p-3.5 flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.05] transition cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <ChevronRight className={`w-4 h-4 text-cyan-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          <span className="font-mono text-cyan-400 font-bold text-xs">{chapter.number}</span>
                          <span className="text-neutral-400">—</span>
                          <span className="font-bold text-white text-xs">{chapter.title}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-white/10 font-mono text-[10px] text-neutral-300">
                          {chapClauses.length} provisions
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="p-3 border-t border-white/5 space-y-2 pl-8">
                          {chapClauses.map((clause) => (
                            <div
                              key={clause.id}
                              className="p-2.5 rounded-xl bg-black/40 border border-white/5 hover:border-white/20 transition flex items-start justify-between gap-3"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-cyan-300 font-bold text-[11px]">Clause {clause.clauseNumber}</span>
                                  <span className="text-neutral-500">•</span>
                                  <span className="font-semibold text-white text-[11px]">{clause.title}</span>
                                </div>
                                <p className="text-[11px] text-neutral-400 line-clamp-1">{clause.text}</p>
                                {clause.subClauses && clause.subClauses.length > 0 && (
                                  <div className="flex items-center gap-1.5 pt-0.5">
                                    <span className="text-[10px] text-neutral-500 font-mono">{clause.subClauses.length} sub-clauses:</span>
                                    {clause.subClauses.map((sub, idx) => (
                                      <span key={idx} className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 font-mono text-neutral-400">
                                        {sub.number}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <span className="text-emerald-400 font-mono text-xs">✓</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 3: CLAUSE REVIEW & INLINE EDITING ── */}
          {currentStep === 3 && (
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="font-mono text-neutral-400 text-[11px]">
                  Showing <strong className="text-white">{editedClauses.length}</strong> clauses for review. Click any clause to modify wording or add sub-clauses.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const newNum = String(editedClauses.length + 1);
                    setEditedClauses(prev => [
                      ...prev,
                      {
                        id: `clause_${newNum}_${Date.now()}`,
                        clauseNumber: newNum,
                        title: `New Clause ${newNum}`,
                        type: 'SECTION',
                        text: 'Enter clause text here...',
                        chapterNumber: 'Chapter I',
                        chapterTitle: 'General Provisions',
                        subClauses: []
                      }
                    ]);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-[11px] flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Add New Clause</span>
                </button>
              </div>

              {/* Clauses Table / Cards */}
              <div className="space-y-3">
                {editedClauses.map((clause) => {
                  const isEditing = activeEditingClauseId === clause.id;

                  return (
                    <div
                      key={clause.id}
                      className={`p-4 rounded-2xl border transition ${
                        isEditing 
                          ? 'bg-[#0f1422] border-cyan-400 shadow-lg' 
                          : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          {/* Clause Header / Title */}
                          {isEditing ? (
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                              <input
                                type="text"
                                value={clause.clauseNumber}
                                onChange={(e) => handleUpdateClause(clause.id!, 'clauseNumber', e.target.value)}
                                placeholder="Num"
                                className="px-3 py-1.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs"
                              />
                              <input
                                type="text"
                                value={clause.title || ''}
                                onChange={(e) => handleUpdateClause(clause.id!, 'title', e.target.value)}
                                placeholder="Clause Title"
                                className="sm:col-span-3 px-3 py-1.5 rounded-xl bg-black border border-white/20 text-white font-bold text-xs"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-cyan-400 font-bold text-xs">Clause {clause.clauseNumber}</span>
                              <span className="text-neutral-500">—</span>
                              <span className="font-bold text-white text-xs">{clause.title}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-neutral-400 font-mono">{clause.chapterNumber}</span>
                            </div>
                          )}

                          {/* Clause Body Text */}
                          {isEditing ? (
                            <textarea
                              value={clause.text}
                              onChange={(e) => handleUpdateClause(clause.id!, 'text', e.target.value)}
                              rows={3}
                              className="w-full p-3 rounded-xl bg-black/70 border border-white/20 text-white font-sans text-xs outline-none"
                            />
                          ) : (
                            <p className="text-[12px] text-neutral-300 leading-relaxed font-serif">{clause.text}</p>
                          )}

                          {/* Sub-clauses list */}
                          {clause.subClauses && clause.subClauses.length > 0 && (
                            <div className="space-y-1.5 pt-1 pl-4 border-l border-cyan-500/30">
                              {clause.subClauses.map((sub, sIdx) => (
                                <div key={sIdx} className="flex items-start gap-2">
                                  <span className="font-mono text-cyan-400 font-semibold text-[11px] shrink-0">{sub.number}</span>
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      value={sub.text}
                                      onChange={(e) => {
                                        const newSub = [...(clause.subClauses || [])];
                                        newSub[sIdx].text = e.target.value;
                                        handleUpdateClause(clause.id!, 'subClauses', newSub);
                                      }}
                                      className="flex-1 px-2.5 py-1 rounded-lg bg-black border border-white/15 text-white text-xs"
                                    />
                                  ) : (
                                    <span className="text-[11px] text-neutral-400">{sub.text}</span>
                                  )}
                                  {isEditing && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveSubClause(clause.id!, sIdx)}
                                      className="text-rose-400 hover:text-rose-300 p-1"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleAddSubClause(clause.id!)}
                                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-cyan-300 transition"
                              >
                                + Sub-clause
                              </button>
                              <button
                                type="button"
                                onClick={() => setActiveEditingClauseId(null)}
                                className="px-3 py-1 rounded-lg bg-cyan-400 text-black font-bold transition"
                              >
                                Done
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setActiveEditingClauseId(clause.id!)}
                              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 4: "READY TO POST?" CONFIRMATION MODAL ── */}
          {currentStep === 4 && (
            <div className="flex-1 flex flex-col justify-center items-center py-6 px-4 space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                <FileCheck className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-xl">
                <span className="font-mono text-cyan-400 text-xs uppercase tracking-widest font-bold">Document Fully Structured</span>
                <h3 className="text-2xl font-black font-display text-white">YOUR BILL IS READY</h3>
                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
                  We've successfully converted your draft into <strong className="text-white font-bold">{editedClauses.length} structured legislative clauses</strong> across <strong className="text-white font-bold">{parsedResult?.chapters.length || 1} chapters</strong>.
                </p>
                <p className="text-neutral-500 text-xs">
                  Before publishing to the sovereign ZEN.SOLUTIONS repository, review your provisions carefully. No automated edits will occur without your explicit confirmation.
                </p>
              </div>

              {/* Confirmation Checkboxes */}
              <div className="w-full max-w-md p-4 rounded-2xl bg-white/[0.03] border border-white/15 space-y-3 text-left">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={checkboxReviewed}
                    onChange={(e) => setCheckboxReviewed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-white/30 text-cyan-500 focus:ring-0 bg-black cursor-pointer"
                  />
                  <span className="text-xs text-neutral-300 group-hover:text-white transition">
                    I have reviewed all <strong>{editedClauses.length} clauses</strong>, titles, and sub-clauses.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={checkboxConfirm}
                    onChange={(e) => setCheckboxConfirm(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-white/30 text-cyan-500 focus:ring-0 bg-black cursor-pointer"
                  />
                  <span className="text-xs text-neutral-300 group-hover:text-white transition">
                    I confirm that this is the exact ratified version I want to publish under my sovereign profile.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* ── BOTTOM ACTION BAR & STEP NAVIGATION ── */}
          <div className="pt-3 sm:pt-4 border-t border-white/10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 font-mono text-xs">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1) as any)}
                  className="px-3.5 sm:px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 ml-auto">
              {currentStep === 1 && (
                <button
                  type="button"
                  onClick={handleParseDocument}
                  disabled={!rawText.trim() || isAnalyzing}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold tracking-wide transition hover:opacity-95 disabled:opacity-40 flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.4)] text-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isAnalyzing ? 'Analyzing...' : 'PARSE DOCUMENT'}</span>
                </button>
              )}

              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold transition flex items-center gap-2 cursor-pointer shadow-md text-xs"
                >
                  <span>Edit Clauses</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {currentStep === 3 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold transition flex items-center gap-2 cursor-pointer shadow-md text-xs"
                >
                  <span>Ready to Post &rarr;</span>
                </button>
              )}

              {currentStep === 4 && (
                <button
                  type="button"
                  onClick={handleFinalPublish}
                  disabled={!checkboxReviewed || !checkboxConfirm || isSubmitting}
                  className="px-4 sm:px-7 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-black tracking-wide transition hover:opacity-95 disabled:opacity-30 disabled:hover:opacity-30 flex items-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(52,211,153,0.5)] text-xs"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{isSubmitting ? 'Posting...' : '✓ YES, POST BILL'}</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
