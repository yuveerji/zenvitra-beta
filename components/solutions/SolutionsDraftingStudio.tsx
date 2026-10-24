'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Table as TableIcon,
  BarChart3,
  TrendingUp,
  PieChart as PieChartIcon,
  Layers,
  FileText,
  Save,
  Send,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Eye,
  Columns,
  Maximize2,
  Minimize2,
  FileCheck,
  BookOpen,
  ArrowRight,
  Shield,
  HelpCircle,
  Activity,
  Zap,
  Download,
  Copy,
  Check,
  Upload,
  Edit3,
  Lock,
  Bookmark,
  Clock
} from 'lucide-react';
import { 
  SolutionDocument, 
  DocumentType, 
  SolutionCategory, 
  DocumentClause, 
  DocumentChapter,
  ValidationIssue,
  OriginalSourceDocument
} from '@/types/solutions';
import { parseDocument, DOCUMENT_TYPE_METADATA, analyzeDocumentWithLeftovers, DocumentAnalysisReport } from '@/lib/docEngine/parser';
import { SAMPLE_DRAFTS } from '@/lib/docEngine/sampleDrafts';
import { SolutionRichContent, parseRichDocumentText } from '@/components/solutions/SolutionRichContent';
import { DocumentLeftoverReviewModal } from '@/components/solutions/DocumentLeftoverReviewModal';
import { ZenDocsConnectModal } from '@/components/solutions/ZenDocsConnectModal';
import { useAuth } from '@/context/AuthContext';

const DOCUMENT_CATEGORIES: { id: SolutionCategory; label: string }[] = [
  { id: 'EDUCATION', label: 'Education & Youth Welfare' },
  { id: 'GOVERNANCE', label: 'Governance & Institutional Reform' },
  { id: 'CLIMATE_ENVIRONMENT', label: 'Climate, Energy & Environment' },
  { id: 'JUSTICE_RIGHTS', label: 'Justice, Police & Human Rights' },
  { id: 'DIGITAL_CIVICS', label: 'Digital Civics & AI Sovereignty' },
  { id: 'YOUTH_EMPLOYMENT', label: 'Youth Employment & Enterprise' },
  { id: 'HEALTH_WELLBEING', label: 'Healthcare & Mental Wellbeing' },
  { id: 'GLOBAL_DIPLOMACY', label: 'Global Diplomacy & Treaties' },
];

const DEFAULT_COMMITTEE_BY_TYPE: Record<DocumentType, string> = {
  LEGISLATIVE_BILL: 'Parliament of India / Public Policy & Solutions Council',
  DRAFT_RESOLUTION: 'United Nations General Assembly / Global Diplomatic Council',
  POLICY_WHITEPAPER: 'National Policy Directorate / Executive Planning Board',
  TREATY_CHARTER: 'Plenipotentiary Conference of Contracting States / International Court',
  CONSTITUTION: 'Constituent Assembly / Supreme Sovereign Convention',
  RULEBOOK: 'Rules Committee & Parliamentary Procedure Directorate',
  REPORT: 'Official Inquiry Commission / Standing Committee on Oversight',
  PROPOSAL: 'Civic Innovation Taskforce / Public Sector Initiatives Council',
  AGREEMENT: 'Bilateral Diplomatic Enclave / Inter-State Council',
  AMENDMENT: 'Parliamentary Committee on Statutory Amendments & Revisions',
  DIRECTIVE: 'Executive Crisis Council / National Emergency Command',
  PRESS_RELEASE: 'Sovereign Press Bureau / Official Media Directorate',
  MANIFESTO: 'Civic Assembly & Citizens Rights Collective',
  PAPER: 'Academic Research Council / Institute for Advanced Policy Studies',
  WORKING_PAPER: 'Working Group on Multilateral Reform & Solutions'
};

const PREAMBULATORY_PHRASES = [
  'Guided by the principles of',
  'Deeply conscious of the pressing need to',
  'Recalling its relevant statutory declarations and',
  'Affirming that every citizen possesses the right to',
  'Emphasizing the sovereign obligation to ensure',
  'Alarmed by the empirical findings demonstrating',
  'Convinced that comprehensive institutional oversight will',
  'Acknowledging with appreciation the collaborative initiatives of'
];

const isDuplicateTitle = (title?: string, clauseNumber?: string) => {
  if (!title) return true;
  const cleanT = title.trim().toLowerCase().replace(/^[#\s*—:-]+/, '').replace(/[.—–-]+$/, '').trim();
  const cleanNum = (clauseNumber || '').trim().toLowerCase();
  return (
    cleanT === `clause ${cleanNum}` ||
    cleanT === `section ${cleanNum}` ||
    cleanT === cleanNum ||
    cleanT === `${cleanNum}` ||
    cleanT === 'clause' ||
    cleanT === 'section'
  );
};

const cleanClauseTitle = (title: string) => {
  return title.replace(/^[#\s*—:;–.-]+/, '').replace(/[;.:—–-]+$/, '').trim();
};

const OPERATIVE_PHRASES = [
  'Resolves that immediate statutory standards be enforced to',
  'Mandates the establishment of an Independent Regulatory Authority to',
  'Urges all educational, corporate and public institutions to',
  'Calls Upon competent municipal and state directorates to guarantee',
  'Directs the immediate ring-fencing of escrow allocations for',
  'Authorizes periodic surprise inspections and third-party audits of',
  'Prohibits deceptive claims, predatory cancellation fees and',
  'Decides to remain actively seized of the matter until'
];

function reconstructRawTextFromDoc(doc: SolutionDocument): string {
  if (doc.fullText && doc.fullText.trim().length > 0) {
    return doc.fullText;
  }
  let out = '';
  if (doc.title) {
    out += `${doc.title}\n\n`;
  }
  if (doc.enactingFormula) {
    out += `${doc.enactingFormula}\n\n`;
  }
  if (doc.preamble) {
    out += `${doc.preamble}\n\n`;
  }
  
  if (doc.chapters && doc.chapters.length > 0) {
    for (const chap of doc.chapters) {
      out += `CHAPTER ${chap.number}: ${chap.title}\n\n`;
      const chapClauses = chap.clauses && chap.clauses.length > 0
        ? chap.clauses
        : (doc.clauses || []).filter(c => c.chapterNumber === chap.number || c.chapterTitle === chap.title);
      for (const clause of chapClauses) {
        out += `Clause ${clause.clauseNumber}. ${clause.title ? clause.title + ' — ' : ''}${clause.text}\n`;
        const subs = clause.subClauses || clause.subItems || [];
        for (const sub of subs) {
          out += `  (${sub.number}) ${sub.text}\n`;
        }
        out += '\n';
      }
    }
  } else if (doc.clauses && doc.clauses.length > 0) {
    for (const clause of doc.clauses) {
      out += `Clause ${clause.clauseNumber}. ${clause.title ? clause.title + ' — ' : ''}${clause.text}\n`;
      const subs = clause.subClauses || clause.subItems || [];
      for (const sub of subs) {
        out += `  (${sub.number}) ${sub.text}\n`;
      }
      out += '\n';
    }
  }
  return out.trim();
}

interface SolutionsDraftingStudioProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentCreated: (doc: SolutionDocument) => void;
  initialDraftData?: {
    id?: string;
    rawText?: string;
    title?: string;
    type?: DocumentType;
    category?: SolutionCategory;
    committee?: string;
    editCount?: number;
    maxEdits?: number;
    existingDoc?: SolutionDocument;
  } | null;
}

export function SolutionsDraftingStudio({
  isOpen,
  onClose,
  onDocumentCreated,
  initialDraftData
}: SolutionsDraftingStudioProps) {
  const { user, profile } = useAuth();
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Check if we are revising an existing document
  const isEditingExisting = Boolean(initialDraftData?.id || initialDraftData?.existingDoc?.id);
  const existingDoc = initialDraftData?.existingDoc;
  const currentEditCount = existingDoc?.editCount ?? initialDraftData?.editCount ?? 0;
  const maxAllowedEdits = existingDoc?.maxEdits ?? initialDraftData?.maxEdits ?? 2;
  const isEditLimitReached = isEditingExisting && currentEditCount >= maxAllowedEdits;

  // Studio Display Mode: 'split' | 'editor' | 'preview'
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');

  // Core Draft Metadata
  const [draftTitle, setDraftTitle] = useState('');
  const [docCode, setDocCode] = useState('');
  const [docType, setDocType] = useState<DocumentType>('LEGISLATIVE_BILL');
  const [category, setCategory] = useState<SolutionCategory>('EDUCATION');
  const [committee, setCommittee] = useState('Parliament of India / Public Policy & Solutions Council');
  const [leadSponsors, setLeadSponsors] = useState('Delegation of Youth Parliament, National Civic Council');
  const [rawContent, setRawContent] = useState('');

  // Auto-Save Status
  const [saveStatus, setSaveStatus] = useState<string>('Ready');
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Draft Restore / Save Prompt Modals
  const [showLoadDraftModal, setShowLoadDraftModal] = useState(false);
  const [savedDraftData, setSavedDraftData] = useState<{
    title?: string;
    docCode?: string;
    docType?: DocumentType;
    category?: SolutionCategory;
    committee?: string;
    leadSponsors?: string;
    rawContent?: string;
    updatedAt?: string;
  } | null>(null);
  const [showSavePromptModal, setShowSavePromptModal] = useState(false);

  // Modals inside Studio
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isDataChapterModalOpen, setIsDataChapterModalOpen] = useState(false);
  const [isSamplesModalOpen, setIsSamplesModalOpen] = useState(false);
  const [activePhraseDropdown, setActivePhraseDropdown] = useState<'preamble' | 'operative' | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>, type: 'preamble' | 'operative') => {
    e.stopPropagation();
    if (activePhraseDropdown === type) {
      setActivePhraseDropdown(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 6,
        left: Math.max(12, Math.min(rect.left, window.innerWidth - 340))
      });
      setActivePhraseDropdown(type);
    }
  };

  // File Upload & Data Analysis Review State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzingFile, setIsAnalyzingFile] = useState(false);
  const [isLeftoverReviewOpen, setIsLeftoverReviewOpen] = useState(false);
  const [analysisReport, setAnalysisReport] = useState<DocumentAnalysisReport | null>(null);
  const [analysisFileName, setAnalysisFileName] = useState('');

  // ZEN.DOCS Connect State
  const [isZenDocsModalOpen, setIsZenDocsModalOpen] = useState(false);
  const [zenDocsModalMode, setZenDocsModalMode] = useState<'IMPORT' | 'EXPORT'>('IMPORT');

  // Original Document Attachment & Download Permission State (PIB Style)
  const [allowDownload, setAllowDownload] = useState(true);
  const [originalDocData, setOriginalDocData] = useState<OriginalSourceDocument | null>(null);

  // Handle File Upload (PDF, DOCX, TXT, MD) with Intelligent Data Analysis
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzingFile(true);
    setAnalysisFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/solutions/extract-document', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to extract text from document.');
      }

      // Preserve original source document payload for PIB reader & download
      setOriginalDocData({
        name: data.fileName,
        type: data.fileType || 'pdf',
        size: data.fileSize,
        rawContent: data.text,
        dataUrl: data.dataUrl,
        allowDownload: true,
        uploadedAt: new Date().toISOString()
      });

      // Infer clean title from filename if currently default
      if (data.fileName && (!draftTitle || draftTitle.includes('Private Coaching'))) {
        const cleanName = data.fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setDraftTitle(cleanName);
      }

      // Run Intelligent Data Analysis & Unparsed Segment Detection
      const report = analyzeDocumentWithLeftovers(data.text);
      setAnalysisReport(report);
      setIsLeftoverReviewOpen(true);
    } catch (err: any) {
      console.error('File analysis error:', err);
      alert(`Error reading ${file.name}: ${err.message || 'Please check file format.'}`);
    } finally {
      setIsAnalyzingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleApplyReviewedDocument = (finalText: string) => {
    setRawContent(finalText);
    const parsed = parseDocument(finalText);
    if (parsed.title && (!draftTitle || draftTitle.includes('Private Coaching'))) {
      setDraftTitle(parsed.title);
    }
    if (parsed.detectedType) {
      setDocType(parsed.detectedType);
      generateCode(parsed.detectedType);
    }
    setSaveStatus('Loaded from Data Analysis');
  };

  const handleImportFromZenDocs = (docData: { title: string; rawText: string; type: DocumentType; category?: SolutionCategory }) => {
    if (docData.title) setDraftTitle(docData.title);
    if (docData.type) {
      setDocType(docData.type);
      generateCode(docData.type);
    }
    if (docData.category) setCategory(docData.category);

    // Also run data analysis on imported ZenDocs text so no paragraphs get left behind
    const report = analyzeDocumentWithLeftovers(docData.rawText);
    if (report.hasLeftoverContent) {
      setAnalysisReport(report);
      setAnalysisFileName(docData.title);
      setIsLeftoverReviewOpen(true);
    } else {
      setRawContent(docData.rawText);
      setSaveStatus('Imported from ZEN.DOCS');
    }
  };

  // Load Previous Draft Handlers
  const handleLoadPreviousDraft = () => {
    if (!savedDraftData) return;
    setDraftTitle(savedDraftData.title || 'Untitled Proposal');
    setDocCode(savedDraftData.docCode || 'BILL-2026-001');
    setDocType(savedDraftData.docType || 'LEGISLATIVE_BILL');
    setCategory(savedDraftData.category || 'EDUCATION');
    setCommittee(savedDraftData.committee || 'Parliament of India / Public Policy & Solutions Council');
    setLeadSponsors(savedDraftData.leadSponsors || 'Delegation of Youth Parliament, National Civic Council');
    setRawContent(savedDraftData.rawContent || '');
    setSaveStatus('Draft restored');
    setShowLoadDraftModal(false);
  };

  const handleStartFromScratch = () => {
    setDraftTitle('Untitled Legislative Proposal');
    setDocType('LEGISLATIVE_BILL');
    setCategory('EDUCATION');
    generateCode('LEGISLATIVE_BILL');
    setRawContent('');
    setSaveStatus('Clean Canvas');
    setShowLoadDraftModal(false);
  };

  // Close & Save Handlers
  const handleAttemptClose = () => {
    if (rawContent && rawContent.trim().length > 0) {
      setShowSavePromptModal(true);
    } else {
      onClose();
    }
  };

  const handleConfirmSaveAndExit = () => {
    try {
      localStorage.setItem('zenvitra_solutions_studio_draft', JSON.stringify({
        title: draftTitle,
        docCode,
        docType,
        category,
        committee,
        leadSponsors,
        rawContent,
        updatedAt: new Date().toISOString()
      }));
    } catch {}
    setShowSavePromptModal(false);
    onClose();
  };

  const handleDiscardAndExit = () => {
    try {
      localStorage.removeItem('zenvitra_solutions_studio_draft');
    } catch {}
    setRawContent('');
    setShowSavePromptModal(false);
    onClose();
  };

  // Initialize draft
  useEffect(() => {
    if (!isOpen) {
      setShowLoadDraftModal(false);
      setShowSavePromptModal(false);
      return;
    }

    if (initialDraftData) {
      if (initialDraftData.existingDoc) {
        const ed = initialDraftData.existingDoc;
        setDraftTitle(ed.title);
        setDocCode(ed.documentCode);
        setDocType(ed.documentType);
        setCategory(ed.category);
        if (ed.committee) setCommittee(ed.committee);
        if (ed.leadSponsors) setLeadSponsors(ed.leadSponsors.join(', '));
        const text = ed.fullText || initialDraftData.rawText || reconstructRawTextFromDoc(ed);
        setRawContent(text);
        if (ed.originalDocument) {
          setOriginalDocData(ed.originalDocument);
          setAllowDownload(ed.originalDocument.allowDownload ?? ed.allowOriginalDownload ?? true);
        }
        setSaveStatus(`Editing Existing Bill (${ed.documentCode}) - Revision ${currentEditCount + 1}/${maxAllowedEdits}`);
        return;
      }
      if (initialDraftData.title) setDraftTitle(initialDraftData.title);
      if (initialDraftData.type) setDocType(initialDraftData.type);
      if (initialDraftData.category) setCategory(initialDraftData.category);
      if (initialDraftData.committee) setCommittee(initialDraftData.committee);
      if (initialDraftData.rawText) setRawContent(initialDraftData.rawText);
      generateCode(initialDraftData.type || 'LEGISLATIVE_BILL');
      return;
    }

    // Default: Open empty studio canvas
    setDraftTitle('Untitled Legislative Proposal');
    setDocType('LEGISLATIVE_BILL');
    setCategory('EDUCATION');
    generateCode('LEGISLATIVE_BILL');
    setRawContent('');

    // Check if there is an existing saved draft in localStorage
    try {
      const saved = localStorage.getItem('zenvitra_solutions_studio_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.rawContent && parsed.rawContent.trim().length > 0) {
          setSavedDraftData(parsed);
          setShowLoadDraftModal(true);
        }
      }
    } catch {}
  }, [isOpen, initialDraftData]);

  // Keyboard listener (Escape triggers save prompt or modal dismiss)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isChartModalOpen || isTableModalOpen || isDataChapterModalOpen || isSamplesModalOpen || isLeftoverReviewOpen || isZenDocsModalOpen) {
          return;
        }
        if (showLoadDraftModal) {
          setShowLoadDraftModal(false);
          return;
        }
        if (showSavePromptModal) {
          setShowSavePromptModal(false);
          return;
        }
        handleAttemptClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, rawContent, isChartModalOpen, isTableModalOpen, isDataChapterModalOpen, isSamplesModalOpen, isLeftoverReviewOpen, isZenDocsModalOpen, showLoadDraftModal, showSavePromptModal]);

  // Generate Document Code based on type
  const generateCode = (type: DocumentType) => {
    const year = new Date().getFullYear();
    const rand = Math.floor(100 + Math.random() * 900);
    let prefix = 'BILL';
    if (type === 'DRAFT_RESOLUTION') prefix = 'UN-GA/RES';
    else if (type === 'POLICY_WHITEPAPER') prefix = 'POLICY';
    else if (type === 'TREATY_CHARTER') prefix = 'TREATY';
    else if (type === 'CONSTITUTION') prefix = 'CONST';
    else if (type === 'RULEBOOK') prefix = 'RULE';
    else if (type === 'REPORT') prefix = 'REPORT';
    else if (type === 'WORKING_PAPER') prefix = 'WP';
    else if (type === 'PRESS_RELEASE') prefix = 'PRESS';
    setDocCode(`${prefix}-${year}-${rand}`);
  };

  // Auto-Save Draft to LocalStorage every 10s or when content changes
  useEffect(() => {
    if (!rawContent || !isOpen) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('zenvitra_solutions_studio_draft', JSON.stringify({
          title: draftTitle,
          docCode,
          docType,
          category,
          committee,
          leadSponsors,
          rawContent,
          updatedAt: new Date().toISOString()
        }));
        setSaveStatus(`Saved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      } catch {}
    }, 1200);

    return () => clearTimeout(timer);
  }, [rawContent, draftTitle, docCode, docType, category, committee, leadSponsors, isOpen]);

  // Live Structured Parser Analysis
  const parsedResult = useMemo(() => {
    if (!rawContent) return null;
    return parseDocument(rawContent, docType);
  }, [rawContent, docType]);

  // Calculated Stats
  const wordCount = useMemo(() => rawContent.trim().split(/\s+/).filter(Boolean).length, [rawContent]);
  const tableCount = useMemo(() => (rawContent.match(/\|[\s-]+\|/g) || []).length, [rawContent]);
  const chartCount = useMemo(() => (rawContent.match(/```chart/gi) || []).length, [rawContent]);
  const metricCount = useMemo(() => (rawContent.match(/```kpi/gi) || []).length, [rawContent]);

  // Insert text at cursor position in textarea
  const insertAtCursor = (textToInsert: string) => {
    const textarea = editorRef.current;
    if (!textarea) {
      setRawContent(prev => prev + '\n\n' + textToInsert);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = textarea.value;

    const updated = current.substring(0, start) + '\n\n' + textToInsert + '\n\n' + current.substring(end);
    setRawContent(updated);

    // Restore cursor position after inserted content
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + textToInsert.length + 4;
    }, 50);
  };

  // ───────────────────────────────────────────────────────────────────────────
  // FORMATTING MECHANISM 1: TABLE BUILDER & CONVERTER
  // ───────────────────────────────────────────────────────────────────────────
  const [csvInput, setCsvInput] = useState('');
  const [tableTemplate, setTableTemplate] = useState<'schedule' | 'budget' | 'timeline' | 'custom'>('schedule');

  const handleInsertTable = () => {
    let generatedTable = '';

    if (csvInput.trim()) {
      // Convert CSV / TSV to Markdown Table
      const lines = csvInput.trim().split('\n');
      if (lines.length > 0) {
        const separator = lines[0].includes('\t') ? '\t' : lines[0].includes(';') ? ';' : ',';
        const headers = lines[0].split(separator).map(h => h.trim());
        const rows = lines.slice(1).map(l => l.split(separator).map(c => c.trim()));

        generatedTable = `| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n`;
        rows.forEach(r => {
          generatedTable += `| ${r.join(' | ')} |\n`;
        });
      }
    } else {
      // Use chosen template
      if (tableTemplate === 'schedule') {
        generatedTable = `| Statutory Tier | Batch Capacity | Maximum Daily Instruction | Mandatory Counselor Ratio | Penalty for Non-Compliance |
|---|---|---|---|---|
| Tier I (Mega Centres) | 500+ Students | 5 Hours | 1 per 100 students | ₹10,00,000 |
| Tier II (Regional Centres) | 100 to 500 Students | 5 Hours | 1 per 150 students | ₹5,00,000 |
| Tier III (Local Tutorial) | Under 100 Students | 4 Hours | 1 per 75 students | ₹2,00,000 |`;
      } else if (tableTemplate === 'budget') {
        generatedTable = `| Allocation Head | Fiscal Outlay (₹ Cr) | Disbursing Authority | Implementation SLA | Audit Standard |
|---|---|---|---|---|
| Mental Health Counselors | ₹1,800 Cr | Central Directorate | 60 Days | Clinical Registry |
| Infrastructure Illumination | ₹1,200 Cr | Municipal Local Bodies | 45 Days | Photometric Lux Audit |
| Emergency Telemetry Hotline | ₹850 Cr | State Dispatch Control | 30 Days | GPS Millisecond Telemetry |
| Public Citizen Redressal | ₹650 Cr | Ombudsman Commission | 14 Days | Open Public Liveboard |`;
      } else if (tableTemplate === 'timeline') {
        generatedTable = `| Milestone Phase | Implementation Window | Target Metric | Responsible Lead | Verification Proof |
|---|---|---|---|---|
| Phase 1: Registration | Days 1 to 60 | 100% Institutes Mapped | State Education Desk | Gazette Digital Stamp |
| Phase 2: Inspections | Days 61 to 120 | 85% Audits Completed | Municipal Inspectorate | On-site Video Log |
| Phase 3: SLA Enforcement | Days 121 to 180 | Zero Pending Grievances | Public Ombudsman | Transparent Public Ledger |`;
      } else {
        generatedTable = `| Column 1 | Column 2 | Column 3 | Column 4 |
|---|---|---|---|
| Value 1A | Value 2A | Value 3A | Value 4A |
| Value 1B | Value 2B | Value 3B | Value 4B |
| Value 1C | Value 2C | Value 3C | Value 4C |`;
      }
    }

    insertAtCursor(generatedTable);
    setIsTableModalOpen(false);
    setCsvInput('');
  };

  // ───────────────────────────────────────────────────────────────────────────
  // FORMATTING MECHANISM 2: GRAPH & CHART BUILDER
  // ───────────────────────────────────────────────────────────────────────────
  const [chartTypeChoice, setChartTypeChoice] = useState<'bar' | 'horizontal-bar' | 'line' | 'donut' | 'progress'>('bar');
  const [chartTitleInput, setChartTitleInput] = useState('Categorical Distribution Metrics');
  const [chartUnitInput, setChartUnitInput] = useState('%');
  const [chartItems, setChartItems] = useState([
    { label: 'Category Alpha', value: 42 },
    { label: 'Category Beta', value: 28 },
    { label: 'Category Gamma', value: 18 },
    { label: 'Category Delta', value: 12 },
  ]);

  const handleAddChartRow = () => {
    setChartItems(prev => [...prev, { label: `Item ${prev.length + 1}`, value: 10 }]);
  };

  const handleRemoveChartRow = (idx: number) => {
    setChartItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateChartRow = (idx: number, field: 'label' | 'value', val: any) => {
    setChartItems(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      return { ...item, [field]: field === 'value' ? parseFloat(val) || 0 : val };
    }));
  };

  const handleInsertChart = () => {
    let block = `\`\`\`chart:${chartTypeChoice}\ntitle: ${chartTitleInput.trim() || 'Analytical Metric Graph'}\n`;
    if (chartUnitInput.trim()) {
      block += `unit: ${chartUnitInput.trim()}\n`;
    }
    chartItems.forEach(item => {
      block += `${item.label.trim()}: ${item.value}\n`;
    });
    block += `\`\`\``;

    insertAtCursor(block);
    setIsChartModalOpen(false);
  };

  // ───────────────────────────────────────────────────────────────────────────
  // FORMATTING MECHANISM 3: DATA CHAPTER WITH KPI TILES
  // ───────────────────────────────────────────────────────────────────────────
  const [dataChapterTitle, setDataChapterTitle] = useState('CHAPTER IV — EMPIRICAL DATA, FISCAL SCHEDULES & COMPLIANCE METRICS');
  const [kpi1, setKpi1] = useState({ value: '₹4,500 Cr', label: 'Statutory Escrow Fund', subtext: 'Allocated under Central Grant Section 12' });
  const [kpi2, setKpi2] = useState({ value: '98.4%', label: 'Minimum Compliance SLA', subtext: 'Target across 12,000+ Enrolled Institutes' });
  const [kpi3, setKpi3] = useState({ value: '14 Days', label: 'Statutory Refund Window', subtext: 'Strict pro-rata student fee reimbursement' });
  const [kpi4, setKpi4] = useState({ value: '1 : 100', label: 'Counselor Ratio', subtext: 'Mandatory per registered student batch' });

  const handleInsertDataChapter = () => {
    const dataChapterBlock = `${dataChapterTitle.trim()}

8. Empirical Evidence & Key Performance Benchmarks. —
(1) The competent authority shall audit national student stress mitigation outcomes based on statutory benchmarks:

\`\`\`kpi
metric: ${kpi1.value} | ${kpi1.label} | ${kpi1.subtext}
metric: ${kpi2.value} | ${kpi2.label} | ${kpi2.subtext}
metric: ${kpi3.value} | ${kpi3.label} | ${kpi3.subtext}
metric: ${kpi4.value} | ${kpi4.label} | ${kpi4.subtext}
\`\`\`

(2) Empirical distribution of recorded compliance metrics across operational zones:

\`\`\`chart:bar
title: Audit Compliance Performance by Jurisdiction (%)
unit: %
Zone 1 (Metropolitan): 92
Zone 2 (Tier II Cities): 84
Zone 3 (Tier III Hubs): 76
Zone 4 (Rural Enclaves): 68
\`\`\`

9. Statutory Framework & Resource Schedule. —
(1) All registered entities shall maintain compliance according to the schedule specified below:

| Jurisdiction Tier | Target Population | Minimum Infrastructure Lux | Mandatory Counselor Ratio | First Offense Fine |
|---|---|---|---|---|
| Tier I (High Density) | 500+ Individuals | 150 Lux | 1 per 100 students | ₹10,00,000 |
| Tier II (Medium Density) | 100 to 500 Individuals | 100 Lux | 1 per 150 students | ₹5,00,000 |
| Tier III (Community Hub) | Under 100 Individuals | 75 Lux | 1 per 75 students | ₹2,00,000 |`;

    insertAtCursor(dataChapterBlock);
    setIsDataChapterModalOpen(false);
  };

  // ───────────────────────────────────────────────────────────────────────────
  // FORMATTING MECHANISM 4: TEXT, CLAUSES & CHAPTER STRUCTURES
  // ───────────────────────────────────────────────────────────────────────────
  const handleInsertChapter = () => {
    const nextChapterRoman = parsedResult?.chapters ? ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][parsedResult.chapters.length] || 'X' : 'II';
    insertAtCursor(`CHAPTER ${nextChapterRoman} — NEW SUBSTANTIVE PROVISIONS\n\n1. Provision Heading. —\n(1) Substantive legal directive text goes here.`);
  };

  const handleInsertClause = () => {
    const nextNum = parsedResult?.totalClauses ? parsedResult.totalClauses + 1 : 1;
    insertAtCursor(`${nextNum}. Clause Heading and Title. —\n(1) Substantive operative clause text.\n(2) Additional conditions or statutory mandate.`);
  };

  const handleInsertEnactingFormula = () => {
    insertAtCursor(`BE it enacted by Parliament in the Seventy-seventh Year of the Republic of India as follows:—`);
  };

  const handleInsertPreamble = (phrase: string) => {
    insertAtCursor(`${phrase} [specify statutory or multilateral intent],`);
  };

  const handleInsertOperative = (phrase: string) => {
    const nextNum = parsedResult?.totalClauses ? parsedResult.totalClauses + 1 : 1;
    insertAtCursor(`${nextNum}. ${phrase} [specify enforceable mandate];`);
  };

  // ───────────────────────────────────────────────────────────────────────────
  // FORMATTING MECHANISM 5: MAGIC ONE-CLICK AUTO-FORMATTER
  // ───────────────────────────────────────────────────────────────────────────
  const handleMagicAutoFormat = () => {
    if (!rawContent.trim()) return;

    let formatted = rawContent.replace(/\r\n/g, '\n');

    // 1. Strip markdown header hashes from Chapters / Parts
    formatted = formatted.replace(/^[#\s*]+(CHAPTER|PART)\s+([IVXLCDM\d]+)[\s—:-]*(.*)$/gim, (_, p1, p2, p3) => {
      const cleanTitle = p3 ? ` — ${p3.replace(/^[#\s*—:-]+/, '').trim()}` : '';
      return `\n${p1.toUpperCase()} ${p2.toUpperCase()}${cleanTitle}\n`;
    });

    // 2. Strip markdown hashes from Schedules
    formatted = formatted.replace(/^[#\s*]+(THE\s+[A-Z0-9IVXLCDM\w\s-]+SCHEDULE|SCHEDULE\s+[A-Z0-9IVXLCDM\w-]+)[\s—:-]*(.*)$/gim, (_, s1, s2) => {
      const cleanTitle = s2 ? ` — ${s2.replace(/^[#\s*—:-]+/, '').trim()}` : '';
      return `\n\n${s1.toUpperCase()}${cleanTitle}\n`;
    });

    // 3. Strip markdown hashes from Section / Clause numbers (e.g. "### 56. Public-service standards" -> "56. Public-service standards. —")
    formatted = formatted.replace(/^[#\s*]+(?:CLAUSE|SECTION|ARTICLE|RULE)?\s*(\d+)[\.\s—:-]+(.*)$/gim, (_, num, titleAndText) => {
      const cleanRest = titleAndText.replace(/^[#\s*—:-]+/, '').trim();
      return `\n${num}. ${cleanRest}`;
    });

    // 4. Normalize Clause Numbering format: "1) Title" or "1: Title" -> "1. Title"
    formatted = formatted.replace(/^(\d+)[\):]\s*(.*?)$/gim, (_, num, rest) => {
      return `${num}. ${rest.trim()}`;
    });

    // 5. Ensure standard em-dash after clean clause titles if title is concise and not already followed by em-dash
    formatted = formatted.replace(/^(\d+\.\s+[A-Za-z][A-Za-z0-9\s,]{2,55}\.)\s*(?!—)/gm, '$1 — ');

    // 6. Ensure Enacting formula exists if Legislative Bill
    if (docType === 'LEGISLATIVE_BILL' && !formatted.toLowerCase().includes('be it enacted')) {
      const lines = formatted.split('\n');
      const insertIdx = lines.findIndex(l => l.toUpperCase().includes('A BILL')) !== -1 
        ? lines.findIndex(l => l.toUpperCase().includes('A BILL')) + 2 
        : 2;
      lines.splice(insertIdx, 0, '\nBE it enacted by Parliament in the Seventy-seventh Year of the Republic of India as follows:—\n');
      formatted = lines.join('\n');
    }

    // 7. Clean up tables
    formatted = formatted.replace(/^\|(.*?)\|\s*$/gim, (line) => {
      return line.trim();
    });

    setRawContent(formatted.trim());
    setSaveStatus('✨ Magic Format applied: Standardized to Parliamentary Legislative Layout!');
  };

  // Load Sample Draft
  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_DRAFTS.find(s => s.id === sampleId);
    if (!sample) return;

    setDraftTitle(sample.name);
    setDocType((sample.badge === 'RESOLUTION' ? 'DRAFT_RESOLUTION' : sample.badge === 'POLICY' ? 'POLICY_WHITEPAPER' : 'LEGISLATIVE_BILL'));
    if (sample.category) setCategory(sample.category as SolutionCategory);
    generateCode(sample.badge === 'RESOLUTION' ? 'DRAFT_RESOLUTION' : sample.badge === 'POLICY' ? 'POLICY_WHITEPAPER' : 'LEGISLATIVE_BILL');
    setRawContent(sample.rawText);
    setIsSamplesModalOpen(false);
  };

  // ───────────────────────────────────────────────────────────────────────────
  // FINAL ACTION: PUBLISH TO SOLUTIONS REPOSITORY
  // ───────────────────────────────────────────────────────────────────────────
  const handlePublishDocument = () => {
    if (isEditLimitReached) {
      alert(`Revision limit reached (${currentEditCount}/${maxAllowedEdits}). Under statutory protocol, this bill can only be edited a maximum of 2 times and is now locked.`);
      return;
    }

    if (!parsedResult || parsedResult.clauses.length === 0) {
      alert('Please include at least one valid clause or section before publishing.');
      return;
    }

    const currentAuthor = profile?.display_name || user?.name || profile?.username || 'Legislative Delegate';
    const currentUsername = profile?.username || user?.username || 'delegate';

    const newDoc: SolutionDocument = {
      ...(existingDoc || {}),
      id: existingDoc?.id || initialDraftData?.id || `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      documentCode: docCode.trim() || existingDoc?.documentCode || `BILL-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: draftTitle.trim() || parsedResult.title || 'Untitled Sovereign Solution',
      documentType: docType,
      category,
      committee: committee.trim() || 'Parliamentary Secretariat & Civic Solutions Council',
      status: 'PUBLISHED',
      leadSponsors: leadSponsors.split(',').map(s => s.trim()).filter(Boolean),
      proposedByUsername: existingDoc?.proposedByUsername || currentUsername,
      signatories: existingDoc?.signatories || [currentAuthor, 'Zenvitra Sovereign Secretariat', 'National Youth Council'],
      abstract: parsedResult.preamble || 'Official legislative and policy action blueprint tabled for community deliberation.',
      enactingFormula: parsedResult.enactingFormula || 'BE it enacted by Parliament in the Seventy-seventh Year of the Republic of India as follows:—',
      preamble: parsedResult.preamble,
      chapters: parsedResult.chapters,
      clauses: parsedResult.clauses,
      validationIssues: parsedResult.validationIssues,
      fullText: rawContent,
      fileName: originalDocData?.name || existingDoc?.fileName || `${draftTitle || 'bill_draft'}.txt`,
      fileSize: originalDocData?.size ? `${Math.round(originalDocData.size / 1024)} KB` : existingDoc?.fileSize,
      originalDocument: originalDocData ? {
        ...originalDocData,
        allowDownload
      } : (existingDoc?.originalDocument || {
        name: `${draftTitle || 'legislative_draft'}.txt`,
        type: 'txt',
        rawContent: rawContent,
        allowDownload,
        uploadedAt: new Date().toISOString()
      }),
      allowOriginalDownload: allowDownload,
      votes: existingDoc?.votes || { inFavor: 1, against: 0, abstain: 0 },
      votedUserIds: existingDoc?.votedUserIds || [user?.id || 'citizen_user'],
      createdAt: existingDoc?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: existingDoc?.publishedAt || new Date().toISOString(),
      isOfficial: true,
      editCount: isEditingExisting ? currentEditCount + 1 : 0,
      maxEdits: 2
    };

    onDocumentCreated(newDoc);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-2xl flex flex-col text-white animate-fadeIn overflow-hidden">
      {/* ── TOP STUDIO NAVBAR ── */}
      <header className="px-4 sm:px-6 py-3 border-b border-white/10 bg-[#06080e] flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-300">
            <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-sm sm:text-base tracking-wide text-white flex items-center gap-2">
                <span>ZEN.SOLUTIONS DRAFTING STUDIO</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-[9px] uppercase font-bold">
                  PRO STUDIO
                </span>
              </h2>
            </div>
            <p className="text-[11px] font-mono text-neutral-400 flex items-center gap-2">
              <span>{saveStatus}</span>
              <span>•</span>
              <span className="text-cyan-400 font-bold">{docCode}</span>
              {isEditingExisting && (
                <>
                  <span>•</span>
                  <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                    isEditLimitReached
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {isEditLimitReached ? 'LOCKED (2/2 EDITS USED)' : `REVISION ${currentEditCount + 1}/${maxAllowedEdits} (${maxAllowedEdits - currentEditCount} LEFT)`}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* View Mode Selectors */}
        <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 text-xs font-mono">
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'split' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split Studio</span>
          </button>
          <button
            onClick={() => setViewMode('editor')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'editor' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Editor Focus</span>
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'preview' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Gazette Preview</span>
          </button>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSamplesModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-neutral-300 hover:text-white hover:bg-white/10 text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
            title="Load Pre-Built Blueprint with Tables & Graphs"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Sample Blueprints</span>
          </button>

          <button
            onClick={handleMagicAutoFormat}
            className="px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.2)]"
            title="Auto-format and structure entire draft"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Magic Format</span>
          </button>

          <button
            onClick={handlePublishDocument}
            disabled={isEditLimitReached}
            className={`px-4 py-1.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer ${
              isEditLimitReached
                ? 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed opacity-60'
                : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:opacity-95 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.4)]'
            }`}
          >
            {isEditLimitReached ? (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>2/2 Edits Used (Locked)</span>
              </>
            ) : isEditingExisting ? (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Save Revision ({currentEditCount + 1}/{maxAllowedEdits})</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Publish Bill</span>
              </>
            )}
          </button>

          <button
            onClick={handleAttemptClose}
            className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Close Drafting Studio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ── METADATA BAR ── */}
      <div className="px-4 sm:px-6 py-2.5 bg-[#090b12] border-b border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs shrink-0">
        <div>
          <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Bill / Solution Title</label>
          <input
            type="text"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            placeholder="e.g. The Private Coaching Institutes Bill, 2026"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400 font-sans font-semibold"
          />
        </div>

        <div>
          <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Document Classification</label>
          <select
            value={docType}
            onChange={(e) => {
              const next = e.target.value as DocumentType;
              setDocType(next);
              generateCode(next);
              // If committee is empty or is an existing auto-assigned default, update it to the matching jurisdiction
              const isDefaultOrEmpty = !committee || Object.values(DEFAULT_COMMITTEE_BY_TYPE).includes(committee);
              if (isDefaultOrEmpty && DEFAULT_COMMITTEE_BY_TYPE[next]) {
                setCommittee(DEFAULT_COMMITTEE_BY_TYPE[next]);
              }
            }}
            className="w-full bg-[#11131c] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
          >
            {Object.keys(DOCUMENT_TYPE_METADATA).map((k) => (
              <option key={k} value={k}>
                {DOCUMENT_TYPE_METADATA[k as DocumentType].label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Policy Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as SolutionCategory)}
            className="w-full bg-[#11131c] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
          >
            {DOCUMENT_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Committee / Jurisdiction</label>
          <input
            type="text"
            value={committee}
            onChange={(e) => setCommittee(e.target.value)}
            placeholder="e.g. Parliament of India / UN General Assembly"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
        </div>

        <div>
          <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">PIB Source Download</label>
          <button
            type="button"
            onClick={() => setAllowDownload(prev => !prev)}
            className={`w-full py-1.5 px-2.5 rounded-lg border text-[11px] font-mono font-bold transition flex items-center justify-between cursor-pointer ${
              allowDownload
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-white/5 border-white/10 text-neutral-400'
            }`}
            title="When ON, readers can download your authentic original source file (PDF/Docx/Text)"
          >
            <span>{allowDownload ? '✓ Public Download ON' : '🔒 Read-Only (No Download)'}</span>
            <span className={`text-[9px] uppercase px-1 rounded ${allowDownload ? 'bg-emerald-500/20 text-emerald-300' : 'bg-neutral-800 text-neutral-400'}`}>
              {allowDownload ? 'PIB' : 'LOCKED'}
            </span>
          </button>
        </div>
      </div>

      {/* ── STUDIO FORMATTING TOOLBAR (MECHANISMS) ── */}
      <div className="px-4 sm:px-6 py-2 bg-[#0c0e17] border-b border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 text-xs font-mono">
        <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold pr-1 shrink-0">
          STUDIO TOOLS:
        </span>

        {/* Mechanism 1: Table Formatter */}
        <button
          onClick={() => setIsTableModalOpen(true)}
          className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <TableIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span>Format Table</span>
        </button>

        {/* Mechanism 2: Graph / Chart Formatter */}
        <button
          onClick={() => setIsChartModalOpen(true)}
          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Format Graph</span>
        </button>

        {/* Mechanism 3: Data Chapter Formatter */}
        <button
          onClick={() => setIsDataChapterModalOpen(true)}
          className="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Activity className="w-3.5 h-3.5 text-purple-400" />
          <span>Data Chapter + KPIs</span>
        </button>

        <span className="text-white/20">|</span>

        {/* Upload PDF / DOCX with Data Analysis & Clause Converter */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf,.docx,.doc,.txt,.md"
          className="hidden"
          onChange={handleFileUpload}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isAnalyzingFile}
          className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
          title="Upload PDF or DOCX file to extract and verify clauses"
        >
          <Upload className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isAnalyzingFile ? 'Analyzing File...' : 'Upload PDF/Docx'}</span>
        </button>

        {/* ZEN.DOCS Connect Buttons */}
        <button
          onClick={() => {
            setZenDocsModalMode('IMPORT');
            setIsZenDocsModalOpen(true);
          }}
          className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer"
          title="Import document directly from ZEN.DOCS vault"
        >
          <FileText className="w-3.5 h-3.5 text-blue-400" />
          <span>Import ZEN.DOCS</span>
        </button>

        <button
          onClick={() => {
            setZenDocsModalMode('EXPORT');
            setIsZenDocsModalOpen(true);
          }}
          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-neutral-300 hover:text-white transition flex items-center gap-1.5 shrink-0 cursor-pointer"
          title="Save draft into ZEN.DOCS vault"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Save to ZEN.DOCS</span>
        </button>

        <span className="text-white/20">|</span>

        {/* Mechanism 4: Clauses & Chapters */}
        <button
          onClick={handleInsertChapter}
          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <Layers className="w-3 h-3 text-amber-400" />
          <span>+ Chapter</span>
        </button>

        <button
          onClick={handleInsertClause}
          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <Plus className="w-3 h-3 text-cyan-400" />
          <span>+ Clause</span>
        </button>

        <button
          onClick={handleInsertEnactingFormula}
          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <span>Enacting Formula</span>
        </button>

        {/* Preamble / Operative Dropdowns */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={(e) => toggleDropdown(e, 'preamble')}
            className={`px-2.5 py-1 rounded-lg border transition flex items-center gap-1 cursor-pointer ${
              activePhraseDropdown === 'preamble'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300 hover:text-white'
            }`}
          >
            <span>Preamble Phrases ▾</span>
          </button>
        </div>

        <div className="shrink-0">
          <button
            type="button"
            onClick={(e) => toggleDropdown(e, 'operative')}
            className={`px-2.5 py-1 rounded-lg border transition flex items-center gap-1 cursor-pointer ${
              activePhraseDropdown === 'operative'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300 hover:text-white'
            }`}
          >
            <span>Operative Phrases ▾</span>
          </button>
        </div>
      </div>

      {/* Floating Phrases Dropdown Portals (Fixed to viewport to avoid overflow-hidden clipping) */}
      {activePhraseDropdown && (
        <>
          <div 
            className="fixed inset-0 z-[9998]" 
            onClick={() => setActivePhraseDropdown(null)} 
          />
          <div 
            style={{ 
              top: `${dropdownPosition.top}px`, 
              left: `${dropdownPosition.left}px` 
            }}
            className="fixed z-[9999] w-72 sm:w-80 bg-[#0f111a] border border-white/20 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] p-2.5 max-h-80 overflow-y-auto space-y-1 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="px-2 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider border-b border-white/10 mb-1 flex items-center justify-between">
              <span className={activePhraseDropdown === 'preamble' ? 'text-cyan-400' : 'text-purple-400'}>
                {activePhraseDropdown === 'preamble' ? 'Insert Preamble Phrase' : 'Insert Operative Phrase'}
              </span>
              <span className="text-[9px] text-neutral-500">CLICK TO INSERT</span>
            </div>
            
            {(activePhraseDropdown === 'preamble' ? PREAMBULATORY_PHRASES : OPERATIVE_PHRASES).map((phrase, idx) => (
              <button
                key={`phrase-${idx}`}
                type="button"
                onClick={() => {
                  if (activePhraseDropdown === 'preamble') {
                    handleInsertPreamble(phrase);
                  } else {
                    handleInsertOperative(phrase);
                  }
                  setActivePhraseDropdown(null);
                }}
                className={`w-full text-left px-2.5 py-2 rounded-xl text-xs transition cursor-pointer flex items-center justify-between text-neutral-300 ${
                  activePhraseDropdown === 'preamble'
                    ? 'hover:text-cyan-300 hover:bg-cyan-500/10'
                    : 'hover:text-purple-300 hover:bg-purple-500/10'
                }`}
              >
                <span>{phrase}...</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── MAIN STUDIO VIEWPORT ── */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* LEFT COLUMN: DRAFTING STUDIO EDITOR */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div className={`${viewMode === 'split' ? 'w-full lg:w-1/2 border-r border-white/10' : 'w-full'} flex flex-col bg-[#05060b] min-h-0`}>
            {/* Editor Textarea */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
              <textarea
                ref={editorRef}
                value={rawContent}
                onChange={(e) => setRawContent(e.target.value)}
                placeholder="Draft your legislative bill, multilateral resolution, data chapters, tables, and graphs here..."
                className="w-full h-full min-h-[400px] bg-transparent text-neutral-200 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none resize-none selection:bg-cyan-500/30"
                spellCheck={false}
              />
            </div>

            {/* Bottom Stats & Telemetry */}
            <div className="px-4 py-2 border-t border-white/10 bg-[#07090e] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-neutral-400 shrink-0">
              <div className="flex items-center gap-3">
                <span>{wordCount} Words</span>
                <span>•</span>
                <span className="text-cyan-400 font-bold">{parsedResult?.totalClauses || 0} Clauses</span>
                <span>•</span>
                <span>{parsedResult?.chapters.length || 0} Chapters</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-emerald-400 font-bold">{tableCount} Tables</span>
                <span>•</span>
                <span className="text-purple-400 font-bold">{chartCount} Graphs</span>
                <span>•</span>
                <span className="text-amber-400 font-bold">{metricCount} KPI Cards</span>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: HIGH-FIDELITY GAZETTE PREVIEW */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className={`${viewMode === 'split' ? 'hidden lg:flex w-1/2' : 'w-full flex'} flex-col bg-[#020306] min-h-0 overflow-y-auto`}>
            <div className="p-6 sm:p-8 max-w-3xl w-full mx-auto space-y-6">
              {/* Gazette Legal Header */}
              <div className="text-center space-y-3 pb-6 border-b border-white/15">
                <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold uppercase tracking-widest">
                  <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-white bg-cyan-500/20 px-2 py-0.5 rounded-full text-[9px] border border-cyan-500/40">
                    {DOCUMENT_TYPE_METADATA[docType]?.badge || 'LEGISLATION'}
                  </span>
                  <span>•</span>
                  <span>{committee || 'PARLIAMENTARY SOVEREIGNTY REPOSITORY'}</span>
                </div>

                <h1 className="font-serif font-bold text-xl sm:text-2xl text-white tracking-tight uppercase leading-snug">
                  {draftTitle || parsedResult?.title || 'UNTITLED LEGISLATIVE PROPOSAL'}
                </h1>

                {parsedResult?.preamble && (
                  <p className="font-serif italic text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed">
                    {parsedResult.preamble}
                  </p>
                )}

                {parsedResult?.enactingFormula && (
                  <div className="font-serif font-bold text-xs uppercase tracking-wider text-amber-300 pt-2">
                    {parsedResult.enactingFormula}
                  </div>
                )}
              </div>

              {/* Formatted Content Stream (Clauses, Tables, Graphs, Data Chapters) */}
              <div className="space-y-6">
                {parsedResult?.chapters && parsedResult.chapters.length > 0 ? (
                  parsedResult.chapters.map((chap, cIdx) => {
                    const chapClauses = parsedResult.clauses.filter(
                      cl => cl.chapterNumber === chap.number || (!cl.chapterNumber && cIdx === 0)
                    );

                    return (
                      <div
                        key={`chap-prev-${chap.id || cIdx}`}
                        className="p-5 sm:p-6 rounded-3xl bg-[#07090f] border border-amber-500/25 space-y-4 shadow-xl"
                      >
                        {/* Chapter Banner */}
                        <div className="border-b border-amber-500/20 pb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
                              {chap.number}
                            </span>
                            <h3 className="font-serif font-black text-base sm:text-lg text-white uppercase tracking-wider">
                              {chap.title}
                            </h3>
                          </div>
                          {chap.isDataChapter && (
                            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-[9px] uppercase font-bold flex items-center gap-1">
                              <Activity className="w-3 h-3 text-purple-400" />
                              <span>DATA CHAPTER</span>
                            </span>
                          )}
                        </div>

                        {/* Clauses flowing naturally inside this chapter */}
                        <div className="space-y-4">
                          {chapClauses.length > 0 ? (
                            chapClauses.map((clause, clIdx) => {
                              const isTextDuplicateOfTitle = Boolean(
                                clause.text &&
                                clause.title &&
                                cleanClauseTitle(clause.title).toLowerCase() === cleanClauseTitle(clause.text).toLowerCase()
                              );
                              const hasTextToShow = Boolean(clause.text && clause.text.trim().length > 0 && !isTextDuplicateOfTitle);
                              const hasSubClauses = Boolean(clause.subClauses && clause.subClauses.length > 0);
                              const hasBodyContent = hasTextToShow || hasSubClauses;

                              return (
                                <div
                                  key={`cl-prev-${clause.id || clIdx}`}
                                  className="space-y-2 py-4 border-b border-white/[0.08] last:border-b-0"
                                >
                                  <h4 className="font-serif font-bold text-white text-sm sm:text-base tracking-tight leading-snug">
                                    <span className="font-mono text-cyan-400 font-bold mr-1.5">{clause.clauseNumber}.</span>
                                    {clause.title && !isDuplicateTitle(clause.title, clause.clauseNumber) && (
                                      <span>{cleanClauseTitle(clause.title)}{hasTextToShow ? ' \u2014 ' : ''}</span>
                                    )}
                                  </h4>

                                  {/* Substantive clause text and all subclauses grouped in ONE continuous unbroken block & pipe ONLY when body content exists */}
                                  {hasBodyContent && (
                                    <div className="pl-3 sm:pl-4 border-l-2 border-cyan-500/40 text-neutral-200 text-xs sm:text-sm font-serif leading-relaxed space-y-2.5">
                                      {hasTextToShow && (
                                        <div>
                                          <SolutionRichContent content={clause.text} />
                                        </div>
                                      )}

                                      {hasSubClauses && (
                                        <div className="space-y-2 pt-0.5">
                                          {clause.subClauses!.map((sub, sIdx) => (
                                            <div key={`sub-${sIdx}`} className="flex items-start gap-2.5 text-xs sm:text-[13px] font-serif text-neutral-300 leading-relaxed">
                                              <span className="font-mono text-cyan-400 font-bold shrink-0 mt-0.5 select-none">{sub.number}</span>
                                              <div className="text-neutral-200 flex-1">
                                                <SolutionRichContent content={sub.text} />
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-xs font-mono text-neutral-500 italic py-2">
                              No provisions cataloged under this chapter.
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  /* Fallback if no explicit chapters: clean continuous operative provisions */
                  <div className="space-y-4">
                    {parsedResult?.clauses && parsedResult.clauses.length > 0 ? (
                      parsedResult.clauses.map((clause, clIdx) => {
                        const isTextDuplicateOfTitle = Boolean(
                          clause.text &&
                          clause.title &&
                          cleanClauseTitle(clause.title).toLowerCase() === cleanClauseTitle(clause.text).toLowerCase()
                        );
                        const hasTextToShow = Boolean(clause.text && clause.text.trim().length > 0 && !isTextDuplicateOfTitle);
                        const hasSubClauses = Boolean(clause.subClauses && clause.subClauses.length > 0);
                        const hasBodyContent = hasTextToShow || hasSubClauses;

                        return (
                          <div key={`cl-prev-${clause.id || clIdx}`} className="space-y-2 py-4 border-b border-white/[0.08] last:border-b-0">
                            <h4 className="font-serif font-bold text-white text-sm sm:text-base tracking-tight leading-snug">
                              <span className="font-mono text-cyan-400 font-bold mr-1.5">{clause.clauseNumber}.</span>
                              {clause.title && !isDuplicateTitle(clause.title, clause.clauseNumber) && (
                                <span>{cleanClauseTitle(clause.title)}{hasTextToShow ? ' \u2014 ' : ''}</span>
                              )}
                            </h4>

                            {hasBodyContent && (
                              <div className="pl-3 sm:pl-4 border-l-2 border-cyan-500/40 text-neutral-200 text-xs sm:text-sm font-serif leading-relaxed space-y-2.5">
                                {hasTextToShow && (
                                  <div>
                                    <SolutionRichContent content={clause.text} />
                                  </div>
                                )}
                                {hasSubClauses && (
                                  <div className="space-y-2 pt-0.5">
                                    {clause.subClauses!.map((sub, sIdx) => (
                                      <div key={`sub-${sIdx}`} className="flex items-start gap-2.5 text-xs sm:text-[13px] font-serif text-neutral-300 leading-relaxed">
                                        <span className="font-mono text-cyan-400 font-bold shrink-0 mt-0.5 select-none">{sub.number}</span>
                                        <div className="text-neutral-200 flex-1">
                                          <SolutionRichContent content={sub.text} />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <SolutionRichContent content={rawContent} />
                    )}
                  </div>
                )}

                {/* Statutory Schedules Preview in Studio */}
                {parsedResult?.schedules && parsedResult.schedules.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="font-mono text-xs text-amber-400 font-bold uppercase tracking-wider flex items-center gap-2">
                      <TableIcon className="w-4 h-4 text-amber-400" />
                      <span>Statutory Schedules &amp; Annexures ({parsedResult.schedules.length})</span>
                    </div>
                    {parsedResult.schedules.map((schedule, sIdx) => (
                      <div key={`sched-${sIdx}`} className="py-4 border-b border-amber-500/20 last:border-b-0 space-y-2">
                        <div>
                          <span className="font-mono text-[10px] text-amber-400 uppercase tracking-widest block font-bold">
                            {schedule.number || `THE ${sIdx + 1} SCHEDULE`}
                          </span>
                          <h4 className="font-serif text-sm sm:text-base font-bold text-white tracking-wide">
                            {schedule.title}
                          </h4>
                        </div>
                        <div className="pl-3 border-l-2 border-amber-500/25 text-neutral-200 text-xs sm:text-sm font-serif leading-relaxed overflow-x-auto">
                          <SolutionRichContent content={schedule.content} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── MODAL 1: TABLE BUILDER & CONVERTER ── */}
      <AnimatePresence>
        {isTableModalOpen && (
          <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl bg-[#090b12] border border-white/15 rounded-3xl p-6 space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-cyan-300 font-display font-bold text-base">
                  <TableIcon className="w-5 h-5 text-cyan-400" />
                  <span>Insert Statutory Table or Convert CSV</span>
                </div>
                <button onClick={() => setIsTableModalOpen(false)} className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Template Picker */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-neutral-300 uppercase block">Choose Preset Template</label>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {[
                    { id: 'schedule', label: 'Compliance & Penalty Schedule' },
                    { id: 'budget', label: 'Fiscal Outlay & Budget Allocations' },
                    { id: 'timeline', label: 'Implementation Timeline & Milestones' },
                    { id: 'custom', label: 'Blank Custom Table' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTableTemplate(t.id as any);
                        setCsvInput('');
                      }}
                      className={`p-3 rounded-xl border text-left transition ${
                        tableTemplate === t.id && !csvInput
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-200'
                          : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Or Paste CSV / TSV */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-neutral-300 uppercase flex items-center justify-between">
                  <span>Or Paste Comma / Tab Separated Data</span>
                  <span className="text-[10px] text-neutral-500">Auto-converts to Markdown table</span>
                </label>
                <textarea
                  rows={4}
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  placeholder={`Header 1, Header 2, Header 3\nData A1, Data A2, Data A3\nData B1, Data B2, Data B3`}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-mono text-white placeholder:text-neutral-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsTableModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-neutral-300 text-xs font-mono hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInsertTable}
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-cyan-400 transition"
                >
                  Insert Table into Draft
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL 2: GRAPH / CHART BUILDER ── */}
      <AnimatePresence>
        {isChartModalOpen && (
          <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-[#090b12] border border-white/15 rounded-3xl p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-emerald-300 font-display font-bold text-base">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  <span>Insert Visual Graph &amp; Chart</span>
                </div>
                <button onClick={() => setIsChartModalOpen(false)} className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chart Type Selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-neutral-300 uppercase block">Chart Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  {[
                    { id: 'bar', label: 'Bar Chart' },
                    { id: 'horizontal-bar', label: 'Horizontal Bar' },
                    { id: 'line', label: 'Line / Trend' },
                    { id: 'donut', label: 'Donut / Pie' },
                  ].map((ct) => (
                    <button
                      key={ct.id}
                      onClick={() => setChartTypeChoice(ct.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition ${
                        chartTypeChoice === ct.id
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold'
                          : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {ct.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Title & Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-mono text-neutral-300 uppercase block mb-1">Chart Title</label>
                  <input
                    type="text"
                    value={chartTitleInput}
                    onChange={(e) => setChartTitleInput(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-neutral-300 uppercase block mb-1">Unit (e.g. %, ₹, Cr)</label>
                  <input
                    type="text"
                    value={chartUnitInput}
                    onChange={(e) => setChartUnitInput(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-neutral-300 uppercase">Data Points &amp; Metrics</label>
                  <button
                    onClick={handleAddChartRow}
                    className="text-xs text-emerald-400 font-mono flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {chartItems.map((item, idx) => (
                    <div key={`c-row-${idx}`} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => handleUpdateChartRow(idx, 'label', e.target.value)}
                        placeholder="Label"
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                      <input
                        type="number"
                        value={item.value}
                        onChange={(e) => handleUpdateChartRow(idx, 'value', e.target.value)}
                        placeholder="Value"
                        className="w-24 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-emerald-300 font-mono text-right"
                      />
                      <button
                        onClick={() => handleRemoveChartRow(idx)}
                        className="p-1.5 text-neutral-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsChartModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-neutral-300 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInsertChart}
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-emerald-400 transition"
                >
                  Insert Graph into Draft
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL 3: DATA CHAPTER & KPI BUILDER ── */}
      <AnimatePresence>
        {isDataChapterModalOpen && (
          <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-[#090b12] border border-white/15 rounded-3xl p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-purple-300 font-display font-bold text-base">
                  <Activity className="w-5 h-5 text-purple-400" />
                  <span>Insert Data Chapter &amp; KPI Metrics</span>
                </div>
                <button onClick={() => setIsDataChapterModalOpen(false)} className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="text-xs font-mono text-neutral-300 uppercase block mb-1">Data Chapter Title</label>
                <input
                  type="text"
                  value={dataChapterTitle}
                  onChange={(e) => setDataChapterTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              {/* 4 KPI Cards Customizer */}
              <div className="space-y-3">
                <label className="text-xs font-mono text-purple-300 uppercase block font-bold">4 Key Performance Metric Tiles</label>
                {[
                  { state: kpi1, set: setKpi1, title: 'KPI Card 1' },
                  { state: kpi2, set: setKpi2, title: 'KPI Card 2' },
                  { state: kpi3, set: setKpi3, title: 'KPI Card 3' },
                  { state: kpi4, set: setKpi4, title: 'KPI Card 4' },
                ].map((item, idx) => (
                  <div key={`kpi-row-${idx}`} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={item.state.value}
                      onChange={(e) => item.set({ ...item.state, value: e.target.value })}
                      placeholder="Big Stat (e.g. ₹4,500 Cr)"
                      className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white font-bold"
                    />
                    <input
                      type="text"
                      value={item.state.label}
                      onChange={(e) => item.set({ ...item.state, label: e.target.value })}
                      placeholder="Label (e.g. Escrow Fund)"
                      className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-neutral-200"
                    />
                    <input
                      type="text"
                      value={item.state.subtext}
                      onChange={(e) => item.set({ ...item.state, subtext: e.target.value })}
                      placeholder="Subtext Description"
                      className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-neutral-400"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsDataChapterModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-neutral-300 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInsertDataChapter}
                  className="px-5 py-2 rounded-xl bg-purple-500 text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-purple-400 transition"
                >
                  Insert Complete Data Chapter
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL 4: SAMPLES PICKER ── */}
      <AnimatePresence>
        {isSamplesModalOpen && (
          <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-[#090b12] border border-white/15 rounded-3xl p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-white font-display font-bold text-base">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  <span>Load Pre-Built Blueprint with Tables &amp; Graphs</span>
                </div>
                <button onClick={() => setIsSamplesModalOpen(false)} className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
                {SAMPLE_DRAFTS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleLoadSample(sample.id)}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/[0.04] text-left transition space-y-2 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                        {sample.badge}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h4 className="font-display font-bold text-sm text-white group-hover:text-cyan-200 transition-colors">
                      {sample.name}
                    </h4>
                    <p className="text-[11px] font-mono text-neutral-400 line-clamp-2">
                      Includes empirical KPI cards, statutory schedule table, and visual comparative chart.
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Data Analysis & Leftover Review Modal ("Is Something Left?") */}
      <DocumentLeftoverReviewModal
        isOpen={isLeftoverReviewOpen}
        onClose={() => setIsLeftoverReviewOpen(false)}
        report={analysisReport}
        fileName={analysisFileName}
        onApplyDocument={handleApplyReviewedDocument}
      />

      {/* ZEN.DOCS Sovereign Pipeline Modal (Import / Export) */}
      <ZenDocsConnectModal
        isOpen={isZenDocsModalOpen}
        onClose={() => setIsZenDocsModalOpen(false)}
        mode={zenDocsModalMode}
        onImportDocument={handleImportFromZenDocs}
        currentDraft={{
          title: draftTitle,
          rawText: rawContent,
          documentType: docType,
          category
        }}
      />

      {/* ── LOAD PREVIOUS DRAFT MODAL ── */}
      <AnimatePresence>
        {showLoadDraftModal && savedDraftData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              className="relative w-full max-w-lg rounded-3xl bg-[#090b14] border border-cyan-500/35 p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.95)] space-y-6 text-white text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                  <Clock className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                      Saved Draft Found
                    </span>
                    {savedDraftData.updatedAt && (
                      <span className="text-[11px] font-mono text-neutral-400">
                        {new Date(savedDraftData.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-white tracking-tight">
                    Load Previous Draft?
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    You have an auto-saved draft from your previous session. You can restore your work or start fresh.
                  </p>
                </div>
              </div>

              {/* Preview Card */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-serif font-bold text-sm text-cyan-300 truncate">
                    {savedDraftData.title || 'Untitled Proposal'}
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400 shrink-0">
                    {savedDraftData.docCode || 'DRAFT'}
                  </span>
                </div>
                {savedDraftData.rawContent && (
                  <p className="text-xs text-neutral-400 font-serif line-clamp-3 leading-relaxed italic">
                    &ldquo;{savedDraftData.rawContent.trim().slice(0, 220)}&hellip;&rdquo;
                  </p>
                )}
                <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-neutral-500">
                  <span>{savedDraftData.rawContent?.trim().split(/\s+/).filter(Boolean).length || 0} words</span>
                  <span>•</span>
                  <span className="capitalize">{savedDraftData.docType?.replace(/_/g, ' ').toLowerCase() || 'Bill'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleLoadPreviousDraft}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-95 text-black font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-[0_0_25px_rgba(6,182,212,0.35)] active:scale-98"
                >
                  <FileText className="w-4 h-4" />
                  <span>Load Previous Draft</span>
                </button>

                <button
                  type="button"
                  onClick={handleStartFromScratch}
                  className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/25 text-neutral-200 hover:text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer active:scale-98"
                >
                  <span>Start from Scratch &rarr;</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── SAVE DRAFT BEFORE EXIT MODAL ── */}
      <AnimatePresence>
        {showSavePromptModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              className="relative w-full max-w-md rounded-3xl bg-[#090b14] border border-amber-500/35 p-6 sm:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.95)] space-y-5 text-white text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                  <Bookmark className="w-6 h-6 text-amber-400" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-display font-bold text-white tracking-tight">
                    Save Draft Before Exiting?
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    You have active legislative content in the studio. Would you like to save this draft to resume editing later?
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <div className="text-xs font-serif font-bold text-neutral-200 truncate">
                  {draftTitle || 'Untitled Legislative Proposal'}
                </div>
                <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-2">
                  <span>{wordCount} words</span>
                  <span>•</span>
                  <span>{parsedResult?.clauses.length || 0} clauses parsed</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleConfirmSaveAndExit}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-95 text-black font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-98"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Draft &amp; Exit</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleDiscardAndExit}
                    className="w-full py-2.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 font-display font-bold text-[11px] uppercase tracking-wider transition cursor-pointer active:scale-98"
                  >
                    Discard Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSavePromptModal(false)}
                    className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-neutral-300 hover:text-white font-display font-bold text-[11px] uppercase tracking-wider transition cursor-pointer active:scale-98"
                  >
                    Keep Editing
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
