'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Eye,
  Palette,
  Share2,
  Undo2,
  Redo2,
  Plus,
  FileDown,
  Type as TypeIcon,
  Image as ImageIcon,
  Youtube,
  Equal,
  Copy,
  Trash2,
  MoreVertical,
  GripVertical,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  Sparkles,
  X,
  ExternalLink,
  ChevronDown,
  AlignLeft,
  Menu,
  CircleDot,
  CheckSquare,
  Calendar,
  Hash,
  Sliders,
  Check,
  Send,
  Cloud,
  Layers,
  Code,
  Star,
  Heart,
  ThumbsUp,
  ListOrdered,
  Clock,
  Mail,
  Phone,
  Globe,
  UploadCloud,
  PenTool,
  Coins,
  Wrench,
  HelpCircle,
  ShieldCheck,
  Award,
  SlidersHorizontal,
  User,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  RefreshCw,
  FileText
} from 'lucide-react';
import {
  ZenForm,
  ZenFormField,
  ZenFormFieldType,
  ZenFormTheme,
  ZenFormSubmission,
  ZenFormCustomStyle,
  ZenFormFontFamily
} from '@/types/forms';
import {
  getZenFormById,
  saveZenForm,
  getFormSubmissions,
  fetchFormSubmissions,
  deleteFormSubmission,
  clearFormSubmissions,
  exportSubmissionsToCsv,
  syncFormSubmissionsToGoogleSheets,
  getZenFormsSheetsConfig
} from '@/lib/formsStorage';
import {
  ZEN_FORM_FONTS,
  GRADIENT_PRESETS,
  ACCENT_COLOR_PALETTES,
  CARD_BORDER_RADIUS_MAP,
  APPS_SCRIPT_TEMPLATE,
  getFontCssFamily
} from '@/lib/formsThemes';

interface ZenFormsEditorProps {
  formId: string;
}

export default function ZenFormsEditor({ formId }: ZenFormsEditorProps) {
  const router = useRouter();

  // Active Tab: 'questions' | 'responses' | 'settings'
  const [activeTab, setActiveTab] = useState<'questions' | 'responses' | 'settings'>('questions');

  // Form State
  const [form, setForm] = useState<ZenForm | null>(null);
  const [activeCardId, setActiveCardId] = useState<string>('header');
  const [isThemeDrawerOpen, setIsThemeDrawerOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [submissions, setSubmissions] = useState<ZenFormSubmission[]>([]);
  const [responsesSubTab, setResponsesSubTab] = useState<'summary' | 'question' | 'individual'>('summary');
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedSubmissionIndex, setSelectedSubmissionIndex] = useState(0);
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [isResponsesMenuOpen, setIsResponsesMenuOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [copiedLink, setCopiedLink] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<ZenFormSubmission | null>(null);

  const [batchPasteFieldId, setBatchPasteFieldId] = useState<string | null>(null);
  const [batchPasteText, setBatchPasteText] = useState('');

  // Undo / Redo History Stack
  const [history, setHistory] = useState<ZenForm[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Load Form on mount
  useEffect(() => {
    if (formId === 'new') {
      const newForm: ZenForm = {
        id: `form_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: 'Untitled form',
        slug: 'untitled-form',
        description: 'Form description',
        category: 'GENERAL',
        theme: 'amber',
        submitButtonText: 'Submit Response',
        successMessage: 'Your response has been cryptographically recorded on the Zenvitra ledger.',
        ownerHandle: 'sovereign_host',
        submissionsCount: 0,
        isPublished: true,
        allowAnonymous: true,
        acceptingResponses: true,
        settings: {
          isQuiz: false,
          defaultPointsPerQuestion: 5,
          showResultsImmediately: true,
          collectEmail: 'none',
          sendResponseCopy: 'off',
          allowResponseEditing: false,
          limitOneResponse: false,
          autoForwardSheets: true,
          showProgressBar: true,
          shuffleQuestions: false,
          showSubmitAnotherLink: true,
          viewResultsSummary: false,
          disableAutosave: false,
          defaultQuestionsRequired: false,
          defaultCollectEmail: false,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fields: [
          {
            id: `q_${Date.now()}_1`,
            label: 'Untitled Question',
            type: 'multiple_choice',
            required: false,
            options: ['Option 1'],
            hasOtherOption: false,
          }
        ],
        customStyle: {
          displayFont: 'Space Grotesk',
          bodyFont: 'Inter',
          bgType: 'gradient',
          bgGradient: 'from-[#0b0f19] via-[#05070c] to-[#020306]',
          cardStyle: 'solid-dark',
          borderRadius: '2xl',
          accentColor: '#f59e0b',
          accentTextColor: '#000000',
          ambientEffect: 'aurora'
        }
      };
      saveZenForm(newForm);
      setForm(newForm);
      setHistory([newForm]);
      setHistoryIndex(0);
      setActiveCardId(newForm.fields[0].id);
      router.replace(`/forms/edit/${newForm.id}`);
    } else {
      const existing = getZenFormById(formId);
      if (existing) {
        setForm(existing);
        setHistory([existing]);
        setHistoryIndex(0);
        if (existing.fields.length > 0) {
          setActiveCardId(existing.fields[0].id);
        }
        setSubmissions(getFormSubmissions(existing.id));
        fetchFormSubmissions(existing.id).then((live) => {
          if (live && live.length > 0) setSubmissions(live);
        });
      } else {
        // Fetch from server registry fallback
        fetch(`/api/forms/${formId}`)
          .then((r) => r.json())
          .then((d) => {
            if (d.form) {
              setForm(d.form);
              setHistory([d.form]);
              setHistoryIndex(0);
              if (d.form.fields?.length > 0) setActiveCardId(d.form.fields[0].id);
              fetchFormSubmissions(d.form.id).then((live) => {
                if (live && live.length > 0) setSubmissions(live);
              });
            } else {
              router.replace('/forms');
            }
          })
          .catch(() => router.replace('/forms'));
      }
    }
  }, [formId, router]);

  // Auto-save helper with history tracking
  const updateFormState = (updated: ZenForm, pushToHistory = true) => {
    setSaveStatus('saving');
    setForm(updated);
    saveZenForm(updated);
    if (pushToHistory) {
      const nextHistory = history.slice(0, historyIndex + 1);
      setHistory([...nextHistory, updated]);
      setHistoryIndex(nextHistory.length);
    }
    setTimeout(() => setSaveStatus('saved'), 400);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setForm(prev);
      saveZenForm(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setForm(next);
      saveZenForm(next);
    }
  };

  // Field manipulation helpers
  const handleAddQuestion = (type: ZenFormFieldType = 'multiple_choice') => {
    if (!form) return;
    const newField: ZenFormField = {
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      label:
        type === 'title_desc' ? 'Title block' :
        type === 'image_block' ? 'Image showcase' :
        type === 'video_block' ? 'Video overview' :
        type === 'section_break' ? 'Section header' :
        type === 'rating' ? 'Rate your experience' :
        type === 'linear_scale' ? 'How would you rate this?' :
        type === 'ranking' ? 'Rank the following items' :
        type === 'file_upload' ? 'Upload Document or Portfolio' :
        type === 'signature' ? 'Digital Signature / Legal Attestation' :
        type === 'wallet_address' ? 'Web3 / Sovereign Ledger Address' :
        type === 'custom' ? 'Custom Input Field' :
        type === 'email' ? 'Email Address' :
        type === 'phone' ? 'Phone / WhatsApp Number' :
        type === 'time' ? 'Time Selection' :
        type === 'url' ? 'Website / Portfolio URL' :
        'Untitled Question',
      type,
      required: form.settings?.defaultQuestionsRequired ?? false,
      options: ['multiple_choice', 'checkboxes', 'dropdown', 'radio', 'checkbox', 'select', 'ranking'].includes(type)
        ? ['Option 1', 'Option 2', 'Option 3']
        : undefined,
      hasOtherOption: false,
      scaleMin: 1,
      scaleMax: 5,
      scaleMinLabel: 'Poor',
      scaleMaxLabel: 'Excellent',
      ratingMax: 5,
      ratingIcon: 'star',
      customInputType: 'text',
      customPlaceholder: 'Enter custom value...',
      customPrefix: '',
      points: form.settings?.isQuiz ? (form.settings.defaultPointsPerQuestion || 5) : undefined,
      fileTypes: ['PDF', 'Image', 'Document'],
      maxFileSizeMb: 10,
      mediaUrl: type === 'image_block' ? 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80' : undefined,
      videoUrl: type === 'video_block' ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : undefined,
    };

    // Insert directly below active card, or append at end
    const activeIdx = form.fields.findIndex((f) => f.id === activeCardId);
    let newFields = [...form.fields];
    if (activeIdx >= 0) {
      newFields.splice(activeIdx + 1, 0, newField);
    } else {
      newFields.push(newField);
    }

    const updated = { ...form, fields: newFields };
    updateFormState(updated);
    setActiveCardId(newField.id);
  };

  const handleDuplicateField = (fieldId: string) => {
    if (!form) return;
    const targetIdx = form.fields.findIndex((f) => f.id === fieldId);
    if (targetIdx === -1) return;
    const target = form.fields[targetIdx];
    const cloned: ZenFormField = {
      ...target,
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      label: `${target.label} (Copy)`,
      options: target.options ? [...target.options] : undefined,
    };
    const newFields = [...form.fields];
    newFields.splice(targetIdx + 1, 0, cloned);
    const updated = { ...form, fields: newFields };
    updateFormState(updated);
    setActiveCardId(cloned.id);
  };

  const handleDeleteField = (fieldId: string) => {
    if (!form) return;
    const remaining = form.fields.filter((f) => f.id !== fieldId);
    const updated = { ...form, fields: remaining };
    updateFormState(updated);
    if (activeCardId === fieldId) {
      setActiveCardId(remaining[0]?.id || 'header');
    }
  };

  const handleMoveField = (fieldId: string, direction: 'up' | 'down') => {
    if (!form) return;
    const idx = form.fields.findIndex((f) => f.id === fieldId);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === form.fields.length - 1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const newFields = [...form.fields];
    const temp = newFields[idx];
    newFields[idx] = newFields[targetIdx];
    newFields[targetIdx] = temp;
    updateFormState({ ...form, fields: newFields });
  };

  const handleUpdateField = (fieldId: string, patch: Partial<ZenFormField>) => {
    if (!form) return;
    const updatedFields = form.fields.map((f) => (f.id === fieldId ? { ...f, ...patch } : f));
    updateFormState({ ...form, fields: updatedFields });
  };

  // Option management for choice questions
  const handleAddOption = (fieldId: string) => {
    if (!form) return;
    const field = form.fields.find((f) => f.id === fieldId);
    if (!field) return;
    const currentOptions = field.options || ['Option 1'];
    const nextNum = currentOptions.length + 1;
    handleUpdateField(fieldId, { options: [...currentOptions, `Option ${nextNum}`] });
  };

  const handleUpdateOption = (fieldId: string, optIdx: number, val: string) => {
    if (!form) return;
    const field = form.fields.find((f) => f.id === fieldId);
    if (!field || !field.options) return;
    const newOpts = [...field.options];
    newOpts[optIdx] = val;
    handleUpdateField(fieldId, { options: newOpts });
  };

  const handleDeleteOption = (fieldId: string, optIdx: number) => {
    if (!form) return;
    const field = form.fields.find((f) => f.id === fieldId);
    if (!field || !field.options || field.options.length <= 1) return;
    const newOpts = field.options.filter((_, i) => i !== optIdx);
    handleUpdateField(fieldId, { options: newOpts });
  };

  // Pre-made Question Template Importer
  const handleImportTemplate = (templateName: string) => {
    if (!form) return;
    let importedQuestions: ZenFormField[] = [];
    if (templateName === 'mun_delegate') {
      importedQuestions = [
        { id: `q_${Date.now()}_1`, label: 'Delegate Full Legal Name', type: 'short_answer', required: true },
        { id: `q_${Date.now()}_2`, label: 'Institutional Email Address', type: 'short_answer', required: true },
        { id: `q_${Date.now()}_3`, label: 'WhatsApp / Calling Contact', type: 'short_answer', required: true },
        { id: `q_${Date.now()}_4`, label: 'Primary Committee Preference', type: 'dropdown', required: true, options: ['UN Security Council', 'UN General Assembly Plenary', 'UN Human Rights Council', 'Historic Crisis'] },
        { id: `q_${Date.now()}_5`, label: 'First Portfolio Choice', type: 'short_answer', required: true },
        { id: `q_${Date.now()}_6`, label: 'Past MUN / Debate Experience & Accolades', type: 'paragraph', required: true },
        { id: `q_${Date.now()}_7`, label: 'Dietary Preferences for Gala Dinner', type: 'multiple_choice', required: false, options: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain Meal'] }
      ];
    } else if (templateName === 'executive_board') {
      importedQuestions = [
        { id: `q_${Date.now()}_1`, label: 'Candidate Full Name', type: 'short_answer', required: true },
        { id: `q_${Date.now()}_2`, label: 'Applying For Executive Board Role', type: 'multiple_choice', required: true, options: ['Chairperson', 'Vice-Chairperson', 'Director-General', 'Rapporteur'] },
        { id: `q_${Date.now()}_3`, label: 'Council of Expertise', type: 'dropdown', required: true, options: ['UNSC', 'DISEC', 'UNHRC', 'Lok Sabha', 'International Press'] },
        { id: `q_${Date.now()}_4`, label: 'Executive Board Dais Philosophy & Background', type: 'paragraph', required: true },
        { id: `q_${Date.now()}_5`, label: 'Attach Resume / Dossier Link', type: 'short_answer', required: true }
      ];
    } else {
      importedQuestions = [
        { id: `q_${Date.now()}_1`, label: 'Full Name', type: 'short_answer', required: true },
        { id: `q_${Date.now()}_2`, label: 'Email Address', type: 'short_answer', required: true },
        { id: `q_${Date.now()}_3`, label: 'Will you be attending in-person or virtually?', type: 'multiple_choice', required: true, options: ['In-Person (Summit Hall)', 'Virtual (Live Broadcast)', 'Tentative'] },
        { id: `q_${Date.now()}_4`, label: 'Additional Comments or Questions', type: 'paragraph', required: false }
      ];
    }

    updateFormState({ ...form, fields: [...form.fields, ...importedQuestions] });
    setIsImportModalOpen(false);
  };

  if (!form) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center text-neutral-400 font-mono text-sm">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span>Opening ZenForms Canvas...</span>
        </div>
      </div>
    );
  }

  const accentHex = form.customStyle?.accentColor || '#f59e0b';
  const displayFontFamily = getFontCssFamily(form.customStyle?.displayFont || 'Space Grotesk');
  const bodyFontFamily = getFontCssFamily(form.customStyle?.bodyFont || 'Inter');

  return (
    <div className="min-h-screen bg-[#090b10] text-neutral-100 font-sans selection:bg-amber-500/30 flex flex-col justify-between">
      {/* ── TOP HEADER BAR (Google Forms Style) ── */}
      <header className="sticky top-0 z-40 bg-[#0c0f17]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Brand + Inline Title + Auto-Save Status */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/forms"
            className="p-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition"
            title="Back to ZenForms Hub"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20 flex-shrink-0">
            <FileSpreadsheet className="w-4 h-4 text-white" />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={form.title}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  const newSlug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                  updateFormState({ ...form, title: newTitle, slug: newSlug });
                }}
                className="bg-transparent text-sm sm:text-base font-medium text-white hover:border-b border-white/30 focus:border-b-2 focus:border-amber-400 outline-none px-1 py-0.5 max-w-[200px] sm:max-w-[340px] truncate"
                placeholder="Untitled form"
              />
              <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 flex-shrink-0">
                <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">{saveStatus === 'saving' ? 'Saving...' : 'All changes saved to ledger'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Navigation Tabs (Questions | Responses | Settings) */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-3 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-medium transition relative ${
              activeTab === 'questions' ? 'text-white font-semibold' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Questions
            {activeTab === 'questions' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('responses');
              setSubmissions(getFormSubmissions(form.id));
            }}
            className={`px-3 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-medium transition relative flex items-center gap-1.5 ${
              activeTab === 'responses' ? 'text-white font-semibold' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Responses
            <span className="px-1.5 py-0.5 text-[10px] font-mono rounded-full bg-white/10 text-neutral-300">
              {form.submissionsCount || submissions.length}
            </span>
            {activeTab === 'responses' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-medium transition relative ${
              activeTab === 'settings' ? 'text-white font-semibold' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Settings
            {activeTab === 'settings' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>
        </nav>

        {/* Right: Actions (Theme, Preview, Undo, Redo, Sheets, Share) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Undo / Redo */}
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          {/* Theme Customize (Palette) */}
          <button
            onClick={() => setIsThemeDrawerOpen(true)}
            className={`p-2 rounded-lg transition ${
              isThemeDrawerOpen ? 'bg-amber-500/20 text-amber-300' : 'text-neutral-300 hover:text-white hover:bg-white/5'
            }`}
            title="Customize Theme & Fonts"
          >
            <Palette className="w-4 h-4" />
          </button>

          {/* Preview (Eye) */}
          <Link
            href={`/forms/${form.slug || form.id}`}
            target="_blank"
            className="p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/5 transition"
            title="Preview Public Form"
          >
            <Eye className="w-4 h-4" />
          </Link>

          {/* Google Sheets Icon Button */}
          <button
            onClick={() => setIsSheetsModalOpen(true)}
            className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition flex items-center gap-1"
            title="Google Sheets Sync"
          >
            <FileSpreadsheet className="w-4 h-4" />
          </button>

          {/* Send / Share Link */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition flex items-center gap-1.5 shadow-md shadow-white/10"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </header>

      {/* ── TOAST NOTIFICATION ── */}
      {syncToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-neutral-900 border border-emerald-500/40 text-emerald-300 font-mono text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* ── TAB 1: QUESTIONS CANVAS ── */}
      {activeTab === 'questions' && (
        <main className="max-w-3xl mx-auto px-4 py-8 w-full space-y-4 relative">
          {/* Header Cover Banner (if configured) */}
          {form.customStyle?.coverImageUrl && (
            <div className="w-full h-36 sm:h-48 rounded-2xl overflow-hidden border border-white/10 relative shadow-xl">
              <img
                src={form.customStyle.coverImageUrl}
                alt="Form Cover"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Top Form Header Card */}
          <div
            onClick={() => setActiveCardId('header')}
            className={`rounded-2xl bg-[#0e111a] border transition-all duration-200 shadow-xl overflow-hidden relative ${
              activeCardId === 'header'
                ? 'border-l-[6px] border-l-amber-500 border-white/20 shadow-amber-500/5 ring-1 ring-amber-500/30'
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            {/* Top Accent Strip */}
            <div
              className="h-2.5 w-full"
              style={{ backgroundColor: accentHex }}
            />

            <div className="p-6 sm:p-8 space-y-4">
              {/* Form Title Input */}
              <input
                type="text"
                value={form.title}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  const newSlug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                  updateFormState({ ...form, title: newTitle, slug: newSlug });
                }}
                placeholder="Form Title"
                style={{ fontFamily: displayFontFamily }}
                className="w-full bg-transparent text-2xl sm:text-4xl font-bold text-white placeholder-neutral-500 outline-none border-b border-transparent focus:border-white/30 pb-2 transition"
              />

              {/* Form Description Textarea */}
              <textarea
                value={form.description}
                onChange={(e) => updateFormState({ ...form, description: e.target.value })}
                placeholder="Form description"
                rows={2}
                style={{ fontFamily: bodyFontFamily }}
                className="w-full bg-transparent text-sm sm:text-base text-neutral-300 placeholder-neutral-500 outline-none border-b border-transparent focus:border-white/20 resize-none transition"
              />
            </div>
          </div>

          {/* Questions & Content Blocks List */}
          <div className="space-y-4">
            {form.fields.map((field, idx) => {
              const isActive = activeCardId === field.id;

              return (
                <div
                  key={field.id}
                  onClick={() => setActiveCardId(field.id)}
                  className={`rounded-2xl bg-[#0e111a] border transition-all duration-200 shadow-xl relative ${
                    isActive
                      ? 'border-l-[6px] border-l-amber-500 border-white/20 ring-1 ring-amber-500/20'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Card Drag Handle & Order Controls */}
                  <div className="pt-2.5 pb-1 flex items-center justify-center gap-2 cursor-grab text-neutral-500 hover:text-neutral-300">
                    <GripVertical className="w-4 h-4 rotate-90" />
                  </div>

                  <div className="px-6 pb-6 space-y-4">
                    {/* Top Row: Question Title & Type Dropdown */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      {/* Question Label Input */}
                      <div className="flex-1">
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                          placeholder="Question"
                          style={{ fontFamily: displayFontFamily }}
                          className="w-full bg-[#080a0f] border border-white/10 focus:border-amber-400/80 rounded-lg px-4 py-3 text-sm sm:text-base font-medium text-white placeholder-neutral-500 outline-none transition"
                        />
                      </div>

                      {/* Question Type Dropdown */}
                      <div className="relative flex-shrink-0">
                        <select
                          value={field.type}
                          onChange={(e) => {
                            const newType = e.target.value as ZenFormFieldType;
                            handleUpdateField(field.id, {
                              type: newType,
                              options: ['multiple_choice', 'checkboxes', 'dropdown', 'radio', 'checkbox', 'select', 'ranking'].includes(newType)
                                ? field.options || ['Option 1', 'Option 2', 'Option 3']
                                : undefined,
                              scaleMin: newType === 'linear_scale' ? (field.scaleMin ?? 1) : field.scaleMin,
                              scaleMax: newType === 'linear_scale' ? (field.scaleMax ?? 5) : field.scaleMax,
                              scaleMinLabel: newType === 'linear_scale' ? (field.scaleMinLabel || 'Poor') : field.scaleMinLabel,
                              scaleMaxLabel: newType === 'linear_scale' ? (field.scaleMaxLabel || 'Excellent') : field.scaleMaxLabel,
                              ratingMax: newType === 'rating' ? (field.ratingMax ?? 5) : field.ratingMax,
                              ratingIcon: newType === 'rating' ? (field.ratingIcon || 'star') : field.ratingIcon,
                              customInputType: newType === 'custom' ? (field.customInputType || 'text') : field.customInputType,
                              customPlaceholder: newType === 'custom' ? (field.customPlaceholder || 'Enter custom value...') : field.customPlaceholder,
                            });
                          }}
                          className="appearance-none bg-[#080a0f] border border-white/15 hover:border-white/30 text-xs sm:text-sm font-medium text-white px-3.5 py-2.5 pr-8 rounded-lg outline-none cursor-pointer transition font-mono"
                        >
                          <optgroup label="Standard Inputs">
                            <option value="short_answer">─ Short answer</option>
                            <option value="paragraph">≡ Paragraph</option>
                            <option value="multiple_choice">● Multiple choice</option>
                            <option value="checkboxes">■ Checkboxes</option>
                            <option value="dropdown">▼ Dropdown</option>
                          </optgroup>
                          <optgroup label="Ratings & Scales">
                            <option value="rating">★ Star / Heart Rating</option>
                            <option value="linear_scale">↔ Linear Scale (Likert)</option>
                            <option value="ranking">↕ Ranking (Preference)</option>
                          </optgroup>
                          <optgroup label="Data & Contact">
                            <option value="email">✉ Email Address</option>
                            <option value="phone">📞 Phone / WhatsApp</option>
                            <option value="number"># Number</option>
                            <option value="date">📅 Date</option>
                            <option value="time">⏰ Time</option>
                            <option value="url">🔗 Website / Link</option>
                          </optgroup>
                          <optgroup label="Advanced & Sovereign">
                            <option value="file_upload">☁ File Upload</option>
                            <option value="signature">✍ Digital Signature</option>
                            <option value="wallet_address">⟠ Web3 / Crypto Wallet</option>
                          </optgroup>
                          <optgroup label="Custom & Developer">
                            <option value="custom">⚡ Custom Input Field</option>
                          </optgroup>
                          <optgroup label="Content Blocks">
                            <option value="title_desc">TT Title & description</option>
                            <option value="image_block">🖼️ Image showcase</option>
                            <option value="video_block">📹 Video embed</option>
                            <option value="section_break">🟰 Section break</option>
                          </optgroup>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-3.5 pointer-events-none" />
                      </div>
                    </div>

                    {/* Question Description / Subtitle (if added) */}
                    {field.description !== undefined && (
                      <input
                        type="text"
                        value={field.description}
                        onChange={(e) => handleUpdateField(field.id, { description: e.target.value })}
                        placeholder="Description (optional)"
                        className="w-full bg-transparent text-xs text-neutral-400 placeholder-neutral-600 outline-none border-b border-white/10 pb-1"
                      />
                    )}

                    {/* Quiz Points Row (if Quiz Mode Active) */}
                    {form.settings?.isQuiz && !['title_desc', 'image_block', 'video_block', 'section_break'].includes(field.type) && (
                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono">
                        <Award className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="text-amber-300 font-medium">Quiz Scoring:</span>
                        <div className="flex items-center gap-1.5 ml-auto">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={field.points ?? form.settings?.defaultPointsPerQuestion ?? 5}
                            onChange={(e) => handleUpdateField(field.id, { points: Number(e.target.value) })}
                            className="w-14 bg-black/40 border border-white/15 rounded px-2 py-1 text-right text-amber-300 font-bold outline-none"
                          />
                          <span className="text-neutral-400">pts</span>
                        </div>
                      </div>
                    )}

                    {/* Field Content / Option Controls depending on Type */}
                    <div className="pt-2">
                      {/* 1. Multiple Choice / Checkboxes / Dropdown / Ranking */}
                      {['multiple_choice', 'checkboxes', 'dropdown', 'radio', 'checkbox', 'select', 'ranking'].includes(field.type) && (
                        <div className="space-y-2.5 pl-1">
                          {(field.options || ['Option 1', 'Option 2', 'Option 3']).map((opt, optIdx) => {
                            const isCorrect = Array.isArray(field.correctAnswer)
                              ? field.correctAnswer.includes(opt)
                              : field.correctAnswer === opt;

                            return (
                              <div key={optIdx} className="flex items-center gap-3 group">
                                {field.type === 'ranking' ? (
                                  <span className="w-5 h-5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono flex items-center justify-center font-bold">
                                    {optIdx + 1}
                                  </span>
                                ) : field.type === 'multiple_choice' || field.type === 'radio' ? (
                                  <div className="w-4 h-4 rounded-full border-2 border-neutral-500 flex-shrink-0" />
                                ) : field.type === 'checkboxes' || field.type === 'checkbox' ? (
                                  <div className="w-4 h-4 rounded-md border-2 border-neutral-500 flex-shrink-0" />
                                ) : (
                                  <span className="text-xs font-mono text-neutral-500 w-4">{optIdx + 1}.</span>
                                )}

                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => handleUpdateOption(field.id, optIdx, e.target.value)}
                                  className="flex-1 bg-transparent text-sm text-neutral-200 border-b border-transparent hover:border-white/20 focus:border-amber-400 outline-none py-1 transition"
                                />

                                {/* Answer Key Checkmark in Quiz Mode */}
                                {form.settings?.isQuiz && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (field.type === 'checkboxes') {
                                        const cur = Array.isArray(field.correctAnswer) ? [...field.correctAnswer] : [];
                                        const next = cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt];
                                        handleUpdateField(field.id, { correctAnswer: next });
                                      } else {
                                        handleUpdateField(field.id, { correctAnswer: opt });
                                      }
                                    }}
                                    className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 transition ${
                                      isCorrect
                                        ? 'bg-emerald-500 text-black font-bold'
                                        : 'bg-white/5 text-neutral-500 hover:text-white'
                                    }`}
                                    title="Mark as correct answer key"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>{isCorrect ? 'Correct' : 'Set Key'}</span>
                                  </button>
                                )}

                                {(field.options || []).length > 1 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteOption(field.id, optIdx);
                                    }}
                                    className="p-1 rounded text-neutral-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                                    title="Remove option"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            );
                          })}

                          {/* "Add Option" / "Add Other" / "Batch Paste" Row */}
                          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddOption(field.id);
                              }}
                              className="text-amber-400 hover:text-amber-300 transition flex items-center gap-1.5"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add option</span>
                            </button>

                            {field.type !== 'dropdown' && field.type !== 'ranking' && !field.hasOtherOption && (
                              <>
                                <span className="text-neutral-500">or</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateField(field.id, { hasOtherOption: true });
                                  }}
                                  className="text-cyan-400 hover:text-cyan-300 transition"
                                >
                                  Add &quot;Other&quot;
                                </button>
                              </>
                            )}

                            {field.hasOtherOption && (
                              <div className="flex items-center gap-2 text-neutral-400">
                                <span>Other...</span>
                                <button
                                  onClick={() => handleUpdateField(field.id, { hasOtherOption: false })}
                                  className="text-neutral-500 hover:text-red-400"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            )}

                            <span className="text-neutral-600">&bull;</span>

                            {/* Batch Paste Options Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setBatchPasteFieldId(batchPasteFieldId === field.id ? null : field.id);
                              }}
                              className="text-neutral-400 hover:text-white transition flex items-center gap-1 font-mono text-[11px]"
                            >
                              <Sparkles className="w-3 h-3 text-amber-400" />
                              <span>Paste list</span>
                            </button>
                          </div>

                          {/* Batch Paste Drawer Box */}
                          {batchPasteFieldId === field.id && (
                            <div className="mt-3 p-3.5 rounded-xl bg-[#080a0f] border border-amber-500/30 space-y-2.5 animate-fadeIn">
                              <div className="flex items-center justify-between text-xs font-mono text-amber-300">
                                <span>Paste multiple options (one per line):</span>
                                <button
                                  onClick={() => setBatchPasteFieldId(null)}
                                  className="text-neutral-500 hover:text-white"
                                >
                                  ✕
                                </button>
                              </div>
                              <textarea
                                rows={3}
                                value={batchPasteText}
                                onChange={(e) => setBatchPasteText(e.target.value)}
                                placeholder={"Security Council\nGeneral Assembly\nCrisis Committee"}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs font-mono text-white outline-none focus:border-amber-400"
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => {
                                    const lines = batchPasteText
                                      .split('\n')
                                      .map((l) => l.trim())
                                      .filter(Boolean);
                                    if (lines.length > 0) {
                                      handleUpdateField(field.id, {
                                        options: [...(field.options || []), ...lines],
                                      });
                                    }
                                    setBatchPasteText('');
                                    setBatchPasteFieldId(null);
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold font-mono transition"
                                >
                                  Add Options
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 2. Linear Scale (Likert 1-5 or 1-10) */}
                      {field.type === 'linear_scale' && (
                        <div className="space-y-4 pt-1">
                          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-300">
                            <span>Scale range:</span>
                            <select
                              value={field.scaleMin ?? 1}
                              onChange={(e) => handleUpdateField(field.id, { scaleMin: Number(e.target.value) })}
                              className="bg-[#080a0f] border border-white/15 rounded px-2 py-1 text-white outline-none"
                            >
                              <option value={0}>0</option>
                              <option value={1}>1</option>
                            </select>
                            <span>to</span>
                            <select
                              value={field.scaleMax ?? 5}
                              onChange={(e) => handleUpdateField(field.id, { scaleMax: Number(e.target.value) })}
                              className="bg-[#080a0f] border border-white/15 rounded px-2 py-1 text-white outline-none"
                            >
                              <option value={3}>3</option>
                              <option value={4}>4</option>
                              <option value={5}>5</option>
                              <option value={7}>7</option>
                              <option value={10}>10</option>
                            </select>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="space-y-1">
                              <span className="text-neutral-400 font-mono text-[11px]">Lowest Label (Optional):</span>
                              <input
                                type="text"
                                value={field.scaleMinLabel || ''}
                                onChange={(e) => handleUpdateField(field.id, { scaleMinLabel: e.target.value })}
                                placeholder="e.g. Strongly Disagree / Poor"
                                className="w-full bg-[#080a0f] border border-white/10 rounded-lg px-3 py-2 text-white outline-none text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-neutral-400 font-mono text-[11px]">Highest Label (Optional):</span>
                              <input
                                type="text"
                                value={field.scaleMaxLabel || ''}
                                onChange={(e) => handleUpdateField(field.id, { scaleMaxLabel: e.target.value })}
                                placeholder="e.g. Strongly Agree / Excellent"
                                className="w-full bg-[#080a0f] border border-white/10 rounded-lg px-3 py-2 text-white outline-none text-xs"
                              />
                            </div>
                          </div>

                          {/* Preview of Buttons */}
                          <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1">
                            {Array.from({ length: (field.scaleMax ?? 5) - (field.scaleMin ?? 1) + 1 }).map((_, i) => {
                              const num = (field.scaleMin ?? 1) + i;
                              return (
                                <div
                                  key={num}
                                  className="w-8 h-8 rounded-lg border border-white/15 bg-white/5 text-neutral-300 font-mono text-xs flex items-center justify-center font-bold"
                                >
                                  {num}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 3. Rating (Stars / Hearts) */}
                      {field.type === 'rating' && (
                        <div className="space-y-3 pt-1">
                          <div className="flex items-center gap-4 text-xs font-mono text-neutral-300">
                            <span>Max Rating:</span>
                            <div className="flex items-center gap-1.5">
                              {[5, 10].map((count) => (
                                <button
                                  key={count}
                                  onClick={() => handleUpdateField(field.id, { ratingMax: count })}
                                  className={`px-2.5 py-1 rounded border text-xs ${
                                    (field.ratingMax ?? 5) === count
                                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold'
                                      : 'border-white/10 bg-[#080a0f] text-neutral-400'
                                  }`}
                                >
                                  {count}
                                </button>
                              ))}
                            </div>

                            <span className="ml-2">Icon:</span>
                            <div className="flex items-center gap-1.5">
                              {(['star', 'heart', 'thumb', 'number'] as const).map((ic) => (
                                <button
                                  key={ic}
                                  onClick={() => handleUpdateField(field.id, { ratingIcon: ic })}
                                  className={`px-2 py-1 rounded border text-xs capitalize ${
                                    (field.ratingIcon || 'star') === ic
                                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold'
                                      : 'border-white/10 bg-[#080a0f] text-neutral-400'
                                  }`}
                                >
                                  {ic}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Visual Preview */}
                          <div className="flex items-center gap-1.5 pt-1 text-amber-400">
                            {Array.from({ length: field.ratingMax ?? 5 }).map((_, i) => (
                              <div key={i} className="p-1 rounded hover:scale-110 transition">
                                {field.ratingIcon === 'heart' ? (
                                  <Heart className="w-5 h-5 fill-amber-400 text-amber-400" />
                                ) : field.ratingIcon === 'thumb' ? (
                                  <ThumbsUp className="w-5 h-5 fill-amber-400 text-amber-400" />
                                ) : field.ratingIcon === 'number' ? (
                                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs flex items-center justify-center font-bold">
                                    {i + 1}
                                  </span>
                                ) : (
                                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 4. Short Answer */}
                      {(field.type === 'short_answer' || field.type === 'text') && (
                        <div className="py-2 border-b border-dotted border-white/20 text-neutral-500 text-xs font-mono max-w-sm">
                          Short-answer text line
                        </div>
                      )}

                      {/* 5. Paragraph */}
                      {(field.type === 'paragraph' || field.type === 'textarea') && (
                        <div className="py-4 border-b border-dotted border-white/20 text-neutral-500 text-xs font-mono max-w-lg">
                          Long-answer multiline text area
                        </div>
                      )}

                      {/* 6. Email */}
                      {field.type === 'email' && (
                        <div className="flex items-center gap-3 py-2 border-b border-dotted border-white/20 text-neutral-500 text-xs font-mono max-w-xs">
                          <Mail className="w-4 h-4 text-cyan-400" />
                          <span>user@example.com (Valid email address)</span>
                        </div>
                      )}

                      {/* 7. Phone */}
                      {(field.type === 'phone' || field.type === 'tel') && (
                        <div className="flex items-center gap-3 py-2 border-b border-dotted border-white/20 text-neutral-500 text-xs font-mono max-w-xs">
                          <Phone className="w-4 h-4 text-emerald-400" />
                          <span>+1 (555) 000-0000 / WhatsApp Number</span>
                        </div>
                      )}

                      {/* 8. Date */}
                      {field.type === 'date' && (
                        <div className="flex items-center gap-3 py-2 border-b border-dotted border-white/20 text-neutral-500 text-xs font-mono max-w-xs">
                          <span>Month, day, year</span>
                          <Calendar className="w-4 h-4 ml-auto text-amber-400" />
                        </div>
                      )}

                      {/* 9. Time */}
                      {field.type === 'time' && (
                        <div className="flex items-center gap-3 py-2 border-b border-dotted border-white/20 text-neutral-500 text-xs font-mono max-w-xs">
                          <span>00:00 AM / PM</span>
                          <Clock className="w-4 h-4 ml-auto text-cyan-400" />
                        </div>
                      )}

                      {/* 10. Number */}
                      {field.type === 'number' && (
                        <div className="flex items-center gap-3 py-2 border-b border-dotted border-white/20 text-neutral-500 text-xs font-mono max-w-xs">
                          <Hash className="w-4 h-4 text-amber-400" />
                          <span>Numeric intake (1, 2, 3...)</span>
                        </div>
                      )}

                      {/* 11. Website / URL */}
                      {field.type === 'url' && (
                        <div className="flex items-center gap-3 py-2 border-b border-dotted border-white/20 text-neutral-500 text-xs font-mono max-w-xs">
                          <Globe className="w-4 h-4 text-blue-400" />
                          <span>https://portfolio.com or github.com/...</span>
                        </div>
                      )}

                      {/* 12. File Upload */}
                      {field.type === 'file_upload' && (
                        <div className="space-y-3 pt-1">
                          <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
                            <span>Max file size:</span>
                            <select
                              value={field.maxFileSizeMb ?? 10}
                              onChange={(e) => handleUpdateField(field.id, { maxFileSizeMb: Number(e.target.value) })}
                              className="bg-[#080a0f] border border-white/15 rounded px-2 py-1 text-white outline-none"
                            >
                              <option value={5}>5 MB</option>
                              <option value={10}>10 MB</option>
                              <option value={25}>25 MB</option>
                              <option value={50}>50 MB</option>
                            </select>
                          </div>
                          <div className="p-4 rounded-xl border border-dashed border-white/20 bg-white/[0.02] flex items-center justify-center gap-3 text-xs font-mono text-neutral-400">
                            <UploadCloud className="w-5 h-5 text-cyan-400" />
                            <span>Respondents will upload files up to {field.maxFileSizeMb ?? 10} MB</span>
                          </div>
                        </div>
                      )}

                      {/* 13. Digital Signature */}
                      {field.type === 'signature' && (
                        <div className="p-4 rounded-xl border border-dashed border-emerald-500/30 bg-emerald-500/5 space-y-2">
                          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                            <PenTool className="w-4 h-4" />
                            <span className="font-bold">Cryptographic Signature & Legal Attestation</span>
                          </div>
                          <div className="h-16 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-xs font-mono text-neutral-500">
                            Touch / stylus canvas or typed sovereign signature
                          </div>
                        </div>
                      )}

                      {/* 14. Web3 Wallet Address */}
                      {field.type === 'wallet_address' && (
                        <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-3 text-xs font-mono text-purple-300">
                          <Coins className="w-4 h-4" />
                          <span>0x... or sol... (Ethereum, Solana, Sovereign Zenvitra Ledger)</span>
                        </div>
                      )}

                      {/* 15. Custom Configurable Field */}
                      {field.type === 'custom' && (
                        <div className="space-y-3 p-4 rounded-xl bg-[#080a0f] border border-amber-500/30">
                          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold">
                            <Wrench className="w-4 h-4" />
                            <span>Configurable Field Settings</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                            <div className="space-y-1">
                              <span className="text-neutral-400 font-mono text-[10px]">Input Type:</span>
                              <select
                                value={field.customInputType || 'text'}
                                onChange={(e) => handleUpdateField(field.id, { customInputType: e.target.value as any })}
                                className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-white outline-none"
                              >
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="password">Password / Protected</option>
                                <option value="color">Color Picker</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <span className="text-neutral-400 font-mono text-[10px]">Prefix (Optional):</span>
                              <input
                                type="text"
                                value={field.customPrefix || ''}
                                onChange={(e) => handleUpdateField(field.id, { customPrefix: e.target.value })}
                                placeholder="e.g. $, @, ID-"
                                className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-white outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-neutral-400 font-mono text-[10px]">Placeholder:</span>
                              <input
                                type="text"
                                value={field.customPlaceholder || ''}
                                onChange={(e) => handleUpdateField(field.id, { customPlaceholder: e.target.value })}
                                placeholder="Custom cue..."
                                className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-white outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 16. Image Block */}
                      {field.type === 'image_block' && (
                        <div className="space-y-3 pt-2">
                          <input
                            type="text"
                            value={field.mediaUrl || ''}
                            onChange={(e) => handleUpdateField(field.id, { mediaUrl: e.target.value })}
                            placeholder="Image URL (https://...)"
                            className="w-full bg-[#080a0f] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white outline-none"
                          />
                          {field.mediaUrl && (
                            <div className="rounded-xl overflow-hidden border border-white/10 max-h-72">
                              <img src={field.mediaUrl} alt="Block media" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      )}

                      {/* 17. Video Block */}
                      {field.type === 'video_block' && (
                        <div className="space-y-3 pt-2">
                          <input
                            type="text"
                            value={field.videoUrl || ''}
                            onChange={(e) => handleUpdateField(field.id, { videoUrl: e.target.value })}
                            placeholder="YouTube Video URL (https://www.youtube.com/watch?v=...)"
                            className="w-full bg-[#080a0f] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white outline-none"
                          />
                          {field.videoUrl && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300 font-mono flex items-center gap-2">
                              <Youtube className="w-4 h-4" />
                              <span>YouTube Player Embed Active</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 18. Section Break */}
                      {field.type === 'section_break' && (
                        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono space-y-1">
                          <span className="font-bold uppercase tracking-wider block">Section Break</span>
                          <p className="text-neutral-300">Respondents will navigate through pages split at this block.</p>
                        </div>
                      )}
                    </div>

                    {/* Card Bottom Controls (Duplicate, Delete, Required Switch, Reorder) */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-neutral-400">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveField(field.id, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 rounded hover:bg-white/5 hover:text-white disabled:opacity-20 transition text-xs font-mono"
                          title="Move Up"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => handleMoveField(field.id, 'down')}
                          disabled={idx === form.fields.length - 1}
                          className="p-1.5 rounded hover:bg-white/5 hover:text-white disabled:opacity-20 transition text-xs font-mono"
                          title="Move Down"
                        >
                          ▼
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateField(field.id);
                          }}
                          className="p-1.5 rounded hover:bg-white/5 hover:text-white transition"
                          title="Duplicate question"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteField(field.id);
                          }}
                          className="p-1.5 rounded hover:bg-white/5 hover:text-red-400 transition"
                          title="Delete question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="h-5 w-px bg-white/10" />

                        {/* Required Toggle Switch */}
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <span className="text-xs font-mono text-neutral-300">Required</span>
                          <input
                            type="checkbox"
                            checked={Boolean(field.required)}
                            onChange={(e) => handleUpdateField(field.id, { required: e.target.checked })}
                            className="sr-only"
                          />
                          <div
                            className={`w-9 h-5 rounded-full transition-colors relative ${
                              field.required ? 'bg-amber-500' : 'bg-white/20'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 left-0.5 ${
                                field.required ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── ICONIC FLOATING VERTICAL ACTION TOOLBAR (Google Forms Style) ── */}
          <div className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-1.5 p-1.5 rounded-2xl bg-white shadow-2xl border border-neutral-200 text-neutral-700">
            {/* 1. Add question */}
            <button
              onClick={() => handleAddQuestion('multiple_choice')}
              className="p-2.5 rounded-xl hover:bg-neutral-100 hover:text-black transition group relative"
              title="Add question"
            >
              <Plus className="w-5 h-5 text-neutral-800 group-hover:scale-110 transition-transform" />
              <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded bg-neutral-800 text-white font-sans text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition shadow-lg">
                Add question
              </span>
            </button>

            {/* 2. Import questions */}
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="p-2.5 rounded-xl hover:bg-neutral-100 hover:text-black transition group relative"
              title="Import questions"
            >
              <FileDown className="w-5 h-5 text-neutral-800 group-hover:scale-110 transition-transform" />
              <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded bg-neutral-800 text-white font-sans text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition shadow-lg">
                Import questions
              </span>
            </button>

            {/* 3. Add title and description */}
            <button
              onClick={() => handleAddQuestion('title_desc')}
              className="p-2.5 rounded-xl hover:bg-neutral-100 hover:text-black transition group relative"
              title="Add title and description"
            >
              <TypeIcon className="w-5 h-5 text-neutral-800 group-hover:scale-110 transition-transform" />
              <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded bg-neutral-800 text-white font-sans text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition shadow-lg">
                Add title and description
              </span>
            </button>

            {/* 4. Add image */}
            <button
              onClick={() => handleAddQuestion('image_block')}
              className="p-2.5 rounded-xl hover:bg-neutral-100 hover:text-black transition group relative"
              title="Add image"
            >
              <ImageIcon className="w-5 h-5 text-neutral-800 group-hover:scale-110 transition-transform" />
              <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded bg-neutral-800 text-white font-sans text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition shadow-lg">
                Add image
              </span>
            </button>

            {/* 5. Add video */}
            <button
              onClick={() => handleAddQuestion('video_block')}
              className="p-2.5 rounded-xl hover:bg-neutral-100 hover:text-black transition group relative"
              title="Add video"
            >
              <Youtube className="w-5 h-5 text-neutral-800 group-hover:scale-110 transition-transform" />
              <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded bg-neutral-800 text-white font-sans text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition shadow-lg">
                Add video
              </span>
            </button>

            {/* 6. Add section */}
            <button
              onClick={() => handleAddQuestion('section_break')}
              className="p-2.5 rounded-xl hover:bg-neutral-100 hover:text-black transition group relative"
              title="Add section"
            >
              <Equal className="w-5 h-5 text-neutral-800 group-hover:scale-110 transition-transform" />
              <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded bg-neutral-800 text-white font-sans text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition shadow-lg">
                Add section
              </span>
            </button>
          </div>
        </main>
      )}

      {/* ── TAB 2: RESPONSES STUDIO (Google Forms Superior Experience) ── */}
      {activeTab === 'responses' && (
        <main className="max-w-4xl mx-auto px-4 py-8 w-full space-y-6">
          {/* 1. Header Card (Matching & Surpassing Google Forms Reference) */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0e111a] border border-white/10 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl font-bold text-white font-display">
                  {submissions.length} responses
                </span>
                <button
                  onClick={async () => {
                    setSyncToast('Refreshing responses from ledger...');
                    const live = await fetchFormSubmissions(form.id);
                    setSubmissions(live);
                    setTimeout(() => setSyncToast(null), 1500);
                  }}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition"
                  title="Refresh responses from server"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Action Buttons: Sheets Link, Sync Now, More Menu, Accepting Toggle */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Green Google Sheets Button (from Reference Screenshot) */}
                {form.googleSheetsConfig?.sheetUrl ? (
                  <a
                    href={form.googleSheetsConfig.sheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 hover:bg-emerald-500/25 transition flex items-center gap-2 text-xs font-mono font-medium shadow-lg shadow-emerald-500/10"
                    title="Open live Google Sheet in new tab"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span>View in Sheets</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                ) : (
                  <button
                    onClick={() => setIsSheetsModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 hover:bg-emerald-500/25 transition flex items-center gap-2 text-xs font-mono font-medium shadow-lg shadow-emerald-500/10"
                    title="Connect Google Sheet in 10s"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span>Link to Sheets</span>
                  </button>
                )}

                {/* Instant Sync to Sheets Button */}
                <button
                  onClick={async () => {
                    setIsSyncingSheets(true);
                    setSyncToast('Streaming responses into Google Sheets...');
                    const res = await syncFormSubmissionsToGoogleSheets(form, submissions);
                    setIsSyncingSheets(false);
                    if (res.success) {
                      setSyncToast(`Successfully synced ${res.count || submissions.length} responses to Google Sheets!`);
                    } else {
                      setSyncToast(res.error || 'Sheets sync pending. Check webhook.');
                    }
                    setTimeout(() => setSyncToast(null), 3000);
                  }}
                  disabled={isSyncingSheets || submissions.length === 0}
                  className="px-3.5 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-neutral-200 disabled:opacity-40 transition flex items-center gap-1.5 text-xs font-mono"
                  title="Push all responses to Google Sheets"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSheets ? 'animate-spin text-emerald-400' : ''}`} />
                  <span>Sync Now</span>
                </button>

                {/* View on Public Website Button */}
                <Link
                  href={`/forms/${form.slug || form.id}/responses`}
                  target="_blank"
                  className="px-3.5 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-neutral-200 transition flex items-center gap-1.5 text-xs font-mono"
                  title="View how respondents and website visitors see responses"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Web Analytics</span>
                </Link>

                {/* 3-Dot More Actions Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsResponsesMenuOpen(!isResponsesMenuOpen)}
                    className="p-2 rounded-xl border border-white/10 hover:bg-white/5 text-neutral-300 hover:text-white transition"
                    title="More actions"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {isResponsesMenuOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-56 rounded-xl bg-[#141824] border border-white/15 p-1.5 shadow-2xl z-30 space-y-1 text-xs font-mono text-left animate-fadeIn">
                      <button
                        onClick={() => {
                          const csv = exportSubmissionsToCsv(form, submissions);
                          const blob = new Blob([csv], { type: 'text/csv' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${form.slug || 'zenform'}-responses.csv`;
                          a.click();
                          setIsResponsesMenuOpen(false);
                        }}
                        disabled={submissions.length === 0}
                        className="w-full px-3 py-2 rounded-lg hover:bg-white/10 text-neutral-200 flex items-center gap-2 disabled:opacity-40"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-400" />
                        <span>Download CSV (.csv)</span>
                      </button>

                      <Link
                        href={`/forms/${form.slug || form.id}/responses`}
                        target="_blank"
                        onClick={() => setIsResponsesMenuOpen(false)}
                        className="w-full px-3 py-2 rounded-lg hover:bg-white/10 text-neutral-200 flex items-center gap-2"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Public Web View</span>
                      </Link>

                      <button
                        onClick={() => {
                          setIsSheetsModalOpen(true);
                          setIsResponsesMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 rounded-lg hover:bg-white/10 text-neutral-200 flex items-center gap-2"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Sheets Integration Hub</span>
                      </button>

                      <button
                        onClick={() => {
                          window.print();
                          setIsResponsesMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 rounded-lg hover:bg-white/10 text-neutral-200 flex items-center gap-2"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Print Responses</span>
                      </button>

                      <div className="border-t border-white/10 my-1" />

                      <button
                        onClick={() => {
                          setIsResponsesMenuOpen(false);
                          if (confirm('Are you sure you want to delete all responses? This cannot be undone.')) {
                            clearFormSubmissions(form.id);
                            setSubmissions([]);
                            setForm({ ...form, submissionsCount: 0 });
                          }
                        }}
                        className="w-full px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 flex items-center gap-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete All Responses</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Accepting Responses Toggle */}
                <label className="flex items-center gap-2 cursor-pointer select-none pl-2 sm:border-l border-white/10">
                  <span className="text-xs font-mono text-neutral-300 hidden sm:inline">
                    {form.acceptingResponses !== false ? 'Accepting' : 'Closed'}
                  </span>
                  <input
                    type="checkbox"
                    checked={form.acceptingResponses !== false}
                    onChange={(e) => updateFormState({ ...form, acceptingResponses: e.target.checked })}
                    className="sr-only"
                  />
                  <div
                    className={`w-9 h-5 rounded-full transition-colors relative ${
                      form.acceptingResponses !== false ? 'bg-emerald-500' : 'bg-red-500/40'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 left-0.5 ${
                        form.acceptingResponses !== false ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </label>
              </div>
            </div>

            {/* Sub-Navigation Tabs: Summary | Question | Individual */}
            {submissions.length > 0 && (
              <div className="pt-3 border-t border-white/10 flex items-center gap-2 font-mono text-xs">
                <button
                  onClick={() => setResponsesSubTab('summary')}
                  className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 font-medium ${
                    responsesSubTab === 'summary'
                      ? 'bg-white text-black font-bold shadow-md'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Summary</span>
                </button>

                <button
                  onClick={() => setResponsesSubTab('question')}
                  className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 font-medium ${
                    responsesSubTab === 'question'
                      ? 'bg-white text-black font-bold shadow-md'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Question</span>
                </button>

                <button
                  onClick={() => setResponsesSubTab('individual')}
                  className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 font-medium ${
                    responsesSubTab === 'individual'
                      ? 'bg-white text-black font-bold shadow-md'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Individual</span>
                </button>
              </div>
            )}
          </div>

          {/* 2. Empty State (Matching Google Forms) */}
          {submissions.length === 0 ? (
            <div className="p-12 sm:p-16 rounded-2xl bg-[#0e111a] border border-white/10 text-center space-y-4 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-neutral-400">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">No responses yet</h3>
              <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                Waiting for responses. Publish or share your form to start accepting responses across the web and automatically stream into Google Sheets.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition shadow-lg"
                >
                  Copy Form Link
                </button>
                <Link
                  href={`/forms/${form.slug || form.id}`}
                  target="_blank"
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-200 hover:bg-white/10 text-xs font-mono transition"
                >
                  Submit Sample Response
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* ── SUB-TAB 1: SUMMARY ── */}
              {responsesSubTab === 'summary' && (
                <div className="space-y-6">
                  {/* Question Summary Breakdowns for all fields */}
                  {form.fields
                    .filter((f) => !['title_desc', 'image_block', 'video_block', 'section_break'].includes(f.type))
                    .map((field, qIdx) => {
                      const allAnswers = submissions
                        .map((s) => ({
                          id: s.id,
                          submittedAt: s.submittedAt,
                          submitter: s.submitterHandle || 'Anonymous',
                          value: s.data[field.id],
                        }))
                        .filter((a) => a.value !== undefined && a.value !== null && a.value !== '');

                      return (
                        <div
                          key={field.id}
                          className="p-6 sm:p-7 rounded-2xl bg-[#0e111a] border border-white/10 shadow-lg space-y-5"
                        >
                          <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">
                                  Q{qIdx + 1} &bull; {field.type.replace('_', ' ')}
                                </span>
                                {field.points && (
                                  <span className="px-2 py-0.2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono">
                                    {field.points} pts
                                  </span>
                                )}
                              </div>
                              <h4 className="text-base font-bold text-white pt-0.5">{field.label}</h4>
                            </div>
                            <span className="text-xs font-mono text-neutral-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                              {allAnswers.length} responses
                            </span>
                          </div>

                          {/* 1. Choice Options Breakdown */}
                          {['multiple_choice', 'checkboxes', 'dropdown', 'radio', 'checkbox', 'select'].includes(field.type) && (
                            <div className="space-y-2.5">
                              {(() => {
                                const options = field.options || [];
                                const counts: Record<string, number> = {};
                                options.forEach((opt) => (counts[opt] = 0));

                                allAnswers.forEach((ans) => {
                                  if (Array.isArray(ans.value)) {
                                    ans.value.forEach((v) => {
                                      counts[v] = (counts[v] || 0) + 1;
                                    });
                                  } else if (ans.value) {
                                    counts[ans.value] = (counts[ans.value] || 0) + 1;
                                  }
                                });

                                return options.map((opt) => {
                                  const count = counts[opt] || 0;
                                  const pct = allAnswers.length > 0 ? Math.round((count / allAnswers.length) * 100) : 0;
                                  const isCorrect = field.correctAnswer === opt;
                                  return (
                                    <div key={opt} className="space-y-1">
                                      <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-neutral-300">{opt}</span>
                                          {isCorrect && (
                                            <span className="text-emerald-400 font-bold font-mono text-[10px]">
                                              ✓ Key
                                            </span>
                                          )}
                                        </div>
                                        <span className="font-mono text-neutral-400 font-bold">
                                          {count} ({pct}%)
                                        </span>
                                      </div>
                                      <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                                        <div
                                          className="h-full rounded-full transition-all duration-500"
                                          style={{
                                            width: `${pct}%`,
                                            backgroundColor: isCorrect ? '#10b981' : accentHex,
                                          }}
                                        />
                                      </div>
                                    </div>
                                  );
                                });
                              })()}
                            </div>
                          )}

                          {/* 2. Linear Scale & Rating Breakdown */}
                          {['linear_scale', 'rating'].includes(field.type) && (
                            <div className="space-y-3">
                              {(() => {
                                const maxVal = field.type === 'linear_scale' ? (field.scaleMax || 5) : (field.ratingMax || 5);
                                const minVal = field.type === 'linear_scale' ? (field.scaleMin || 1) : 1;
                                const counts: Record<number, number> = {};
                                for (let i = minVal; i <= maxVal; i++) counts[i] = 0;
                                let sum = 0;
                                allAnswers.forEach((ans) => {
                                  const n = Number(ans.value);
                                  if (!isNaN(n) && n >= minVal && n <= maxVal) {
                                    counts[n] = (counts[n] || 0) + 1;
                                    sum += n;
                                  }
                                });
                                const avg = allAnswers.length > 0 ? (sum / allAnswers.length).toFixed(1) : '0.0';

                                return (
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 w-fit">
                                      <span className="text-2xl font-black text-white font-mono">{avg}</span>
                                      <span className="text-xs font-mono text-neutral-400">
                                        Average Score out of {maxVal}
                                      </span>
                                    </div>
                                    <div className="space-y-1.5 pt-1">
                                      {Object.keys(counts).map((k) => {
                                        const num = Number(k);
                                        const count = counts[num] || 0;
                                        const pct = allAnswers.length > 0 ? Math.round((count / allAnswers.length) * 100) : 0;
                                        return (
                                          <div key={num} className="flex items-center gap-3 text-xs font-mono">
                                            <span className="w-5 text-neutral-300 font-bold">{num}</span>
                                            <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                                              <div
                                                className="h-full rounded-full"
                                                style={{ width: `${pct}%`, backgroundColor: accentHex }}
                                              />
                                            </div>
                                            <span className="w-16 text-right text-neutral-400">
                                              {count} ({pct}%)
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          )}

                          {/* 3. Text Answers Preview */}
                          {![
                            'multiple_choice',
                            'checkboxes',
                            'dropdown',
                            'radio',
                            'checkbox',
                            'select',
                            'linear_scale',
                            'rating',
                            'ranking'
                          ].includes(field.type) && (
                            <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                              {allAnswers.slice(0, 10).map((a, i) => (
                                <div
                                  key={a.id + i}
                                  className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs"
                                >
                                  <span className="text-neutral-200 font-sans truncate pr-2">
                                    {String(a.value)}
                                  </span>
                                  <span className="text-[10px] font-mono text-neutral-500 shrink-0">
                                    {a.submitter}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}

                  {/* Submissions Ledger Table */}
                  <div className="p-6 rounded-2xl bg-[#0e111a] border border-white/10 shadow-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-white">Individual Response Log</h4>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to clear all responses? This cannot be undone.')) {
                            clearFormSubmissions(form.id);
                            setSubmissions([]);
                            setForm({ ...form, submissionsCount: 0 });
                          }
                        }}
                        className="text-xs font-mono text-red-400 hover:text-red-300 transition"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono">
                        <thead>
                          <tr className="border-b border-white/10 text-neutral-400">
                            <th className="py-2.5 pr-4">#</th>
                            <th className="py-2.5 pr-4">Submitted At</th>
                            <th className="py-2.5 pr-4">Submitter</th>
                            <th className="py-2.5 pr-4">Preview</th>
                            <th className="py-2.5 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-neutral-200">
                          {submissions.map((sub, i) => (
                            <tr key={sub.id} className="hover:bg-white/[0.02] transition">
                              <td className="py-3 pr-4 text-neutral-500">{i + 1}</td>
                              <td className="py-3 pr-4 text-neutral-300">
                                {new Date(sub.submittedAt).toLocaleString()}
                              </td>
                              <td className="py-3 pr-4 text-neutral-400">
                                {sub.submitterHandle || 'Anonymous'}
                              </td>
                              <td className="py-3 pr-4 max-w-xs truncate text-neutral-400">
                                {Object.values(sub.data)[0] || 'No content'}
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => {
                                    setSelectedSubmissionIndex(i);
                                    setResponsesSubTab('individual');
                                  }}
                                  className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white transition text-[11px]"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ── SUB-TAB 2: QUESTION ── */}
              {responsesSubTab === 'question' && (
                <div className="space-y-6">
                  {/* Question Navigator */}
                  {(() => {
                    const validFields = form.fields.filter(
                      (f) => !['title_desc', 'image_block', 'video_block', 'section_break'].includes(f.type)
                    );
                    const currentField = validFields[selectedQuestionIndex] || validFields[0];
                    if (!currentField) return null;

                    const allAnswers = submissions
                      .map((s) => ({
                        subId: s.id,
                        submittedAt: s.submittedAt,
                        submitter: s.submitterHandle || 'Anonymous',
                        value: s.data[currentField.id],
                      }))
                      .filter((a) => a.value !== undefined && a.value !== null && a.value !== '');

                    return (
                      <div className="space-y-6">
                        {/* Selector Controls */}
                        <div className="p-5 rounded-2xl bg-[#0e111a] border border-white/10 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            <select
                              value={selectedQuestionIndex}
                              onChange={(e) => setSelectedQuestionIndex(Number(e.target.value))}
                              className="bg-[#080a0f] border border-white/15 rounded-xl px-4 py-2 text-xs font-mono text-white outline-none w-full max-w-md truncate"
                            >
                              {validFields.map((f, idx) => (
                                <option key={f.id} value={idx}>
                                  Q{idx + 1}: {f.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => setSelectedQuestionIndex(Math.max(0, selectedQuestionIndex - 1))}
                              disabled={selectedQuestionIndex === 0}
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 transition"
                              title="Previous question"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-xs font-mono text-neutral-400 px-2">
                              {selectedQuestionIndex + 1} of {validFields.length}
                            </span>
                            <button
                              onClick={() =>
                                setSelectedQuestionIndex(Math.min(validFields.length - 1, selectedQuestionIndex + 1))
                              }
                              disabled={selectedQuestionIndex === validFields.length - 1}
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 transition"
                              title="Next question"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Question Detail Card */}
                        <div className="p-6 sm:p-7 rounded-2xl bg-[#0e111a] border border-white/10 shadow-xl space-y-4">
                          <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                            <div>
                              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold block">
                                Question {selectedQuestionIndex + 1} &bull; {currentField.type}
                              </span>
                              <h3 className="text-lg font-bold text-white pt-1">{currentField.label}</h3>
                            </div>
                            <span className="text-xs font-mono text-neutral-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                              {allAnswers.length} responses
                            </span>
                          </div>

                          <div className="space-y-2.5 pt-2">
                            {allAnswers.map((ans, idx) => (
                              <div
                                key={ans.subId + idx}
                                className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition flex items-center justify-between gap-4"
                              >
                                <div className="space-y-1 flex-1">
                                  <div className="text-sm text-white font-sans font-medium">
                                    {Array.isArray(ans.value) ? ans.value.join(', ') : String(ans.value)}
                                  </div>
                                  <div className="text-[10px] font-mono text-neutral-500 flex items-center gap-2">
                                    <span>{ans.submitter}</span>
                                    <span>&bull;</span>
                                    <span>{new Date(ans.submittedAt).toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* ── SUB-TAB 3: INDIVIDUAL ── */}
              {responsesSubTab === 'individual' && (
                <div className="space-y-6">
                  {(() => {
                    const currentSub = submissions[selectedSubmissionIndex] || submissions[0];
                    if (!currentSub) return null;

                    return (
                      <div className="space-y-6">
                        {/* Individual Carousel Header */}
                        <div className="p-5 rounded-2xl bg-[#0e111a] border border-white/10 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedSubmissionIndex(Math.max(0, selectedSubmissionIndex - 1))}
                              disabled={selectedSubmissionIndex === 0}
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 transition"
                              title="Previous submission"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-mono text-white font-bold px-2">
                              {selectedSubmissionIndex + 1} of {submissions.length}
                            </span>
                            <button
                              onClick={() =>
                                setSelectedSubmissionIndex(
                                  Math.min(submissions.length - 1, selectedSubmissionIndex + 1)
                                )
                              }
                              disabled={selectedSubmissionIndex === submissions.length - 1}
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 transition"
                              title="Next submission"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right text-xs font-mono hidden sm:block">
                              <span className="text-neutral-400 block">{currentSub.submitterHandle || 'Anonymous'}</span>
                              <span className="text-neutral-500 text-[10px]">
                                {new Date(currentSub.submittedAt).toLocaleString()}
                              </span>
                            </div>

                            <button
                              onClick={async () => {
                                if (confirm('Delete this individual submission?')) {
                                  await deleteFormSubmission(form.id, currentSub.id);
                                  const updated = submissions.filter((s) => s.id !== currentSub.id);
                                  setSubmissions(updated);
                                  setSelectedSubmissionIndex(Math.max(0, selectedSubmissionIndex - 1));
                                }
                              }}
                              className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition"
                              title="Delete this submission"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Individual Filled Form Answers */}
                        <div className="space-y-4">
                          {form.fields
                            .filter(
                              (f) => !['title_desc', 'image_block', 'video_block', 'section_break'].includes(f.type)
                            )
                            .map((field) => {
                              const ans = currentSub.data[field.id];
                              const isCorrect =
                                field.correctAnswer &&
                                ans &&
                                (Array.isArray(ans)
                                  ? JSON.stringify(ans.sort()) === JSON.stringify((field.correctAnswer as any).sort())
                                  : String(ans).trim().toLowerCase() === String(field.correctAnswer).trim().toLowerCase());

                              return (
                                <div
                                  key={field.id}
                                  className="p-6 rounded-2xl bg-[#0e111a] border border-white/10 shadow-lg space-y-3"
                                >
                                  <div className="flex items-center justify-between text-xs">
                                    <h4 className="font-bold text-white">{field.label}</h4>
                                    {field.points && (
                                      <span
                                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                          isCorrect
                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                        }`}
                                      >
                                        {isCorrect ? `${field.points} / ${field.points} pts` : `0 / ${field.points} pts`}
                                      </span>
                                    )}
                                  </div>

                                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-sm text-neutral-200 font-sans">
                                    {ans !== undefined && ans !== null && ans !== '' ? (
                                      Array.isArray(ans) ? (
                                        ans.join(', ')
                                      ) : field.type === 'signature' ? (
                                        <span className="italic font-serif text-amber-300">✍️ {String(ans)}</span>
                                      ) : field.type === 'wallet_address' ? (
                                        <span className="font-mono text-emerald-400 text-xs">{String(ans)}</span>
                                      ) : (
                                        String(ans)
                                      )
                                    ) : (
                                      <span className="italic text-neutral-500 text-xs">No response provided</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </>
          )}
        </main>
      )}

      {/* ── TAB 3: SETTINGS (Google Forms Superior Experience) ── */}
      {activeTab === 'settings' && (
        <main className="max-w-3xl mx-auto px-4 py-8 w-full space-y-6">
          {/* Header Title */}
          <div className="flex items-center justify-between pb-2">
            <div>
              <h2 className="text-2xl font-bold text-white font-display">Settings</h2>
              <p className="text-xs font-mono text-neutral-400">Configure quiz parameters, response intake, presentation, and ledger sync</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
              Auto-saved to ledger
            </span>
          </div>

          {/* 1. Make this a quiz Card */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#0e111a] border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1 pr-4">
                <span className="text-base font-bold text-white block">Make this a quiz</span>
                <span className="text-xs text-neutral-400 block leading-relaxed">
                  Assign point values, set answers, and automatically provide feedback to respondents
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={Boolean(form.settings?.isQuiz)}
                  onChange={(e) =>
                    updateFormState({
                      ...form,
                      settings: { ...form.settings, isQuiz: e.target.checked }
                    })
                  }
                  className="sr-only"
                />
                <div
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    form.settings?.isQuiz ? 'bg-amber-500' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 left-0.5 ${
                      form.settings?.isQuiz ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </label>
            </div>

            {form.settings?.isQuiz && (
              <div className="pt-4 border-t border-white/10 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-white block">Default point value per question</span>
                    <span className="text-[11px] text-neutral-400">Assigned automatically when new questions are added</span>
                  </div>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={form.settings?.defaultPointsPerQuestion ?? 5}
                    onChange={(e) =>
                      updateFormState({
                        ...form,
                        settings: { ...form.settings, defaultPointsPerQuestion: Number(e.target.value) }
                      })
                    }
                    className="w-16 bg-[#080a0f] border border-white/15 rounded-lg px-2.5 py-1 text-right text-xs font-mono text-amber-300 font-bold outline-none"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-white block">Release score immediately after submission</span>
                    <span className="text-[11px] text-neutral-400">Respondents can view their total score and answers</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.settings?.showResultsImmediately ?? true}
                    onChange={(e) =>
                      updateFormState({
                        ...form,
                        settings: { ...form.settings, showResultsImmediately: e.target.checked }
                      })
                    }
                    className="w-4 h-4 accent-amber-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2. Responses Card */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#0e111a] border border-white/10 shadow-xl space-y-6">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">Responses</h3>
              <p className="text-xs text-neutral-400">Manage how responses are collected, verified, and protected</p>
            </div>

            <div className="space-y-5 divide-y divide-white/10">
              {/* Collect Email Addresses */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                <div>
                  <span className="text-xs font-medium text-white block">Collect email addresses</span>
                  <span className="text-[11px] text-neutral-400">Determine how emails are acquired from respondents</span>
                </div>
                <select
                  value={form.settings?.collectEmail || 'none'}
                  onChange={(e) =>
                    updateFormState({
                      ...form,
                      settings: { ...form.settings, collectEmail: e.target.value as any }
                    })
                  }
                  className="bg-[#080a0f] border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white outline-none font-mono"
                >
                  <option value="none">Do not collect</option>
                  <option value="verified">Verified (Google / Zenvitra Account)</option>
                  <option value="responder">Responder input</option>
                </select>
              </div>

              {/* Send Copy of Response */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4">
                <div>
                  <span className="text-xs font-medium text-white block">Send responders a copy of their response</span>
                  <span className="text-[11px] text-neutral-400">Dispatch automated receipt to respondent's email</span>
                </div>
                <select
                  value={form.settings?.sendResponseCopy || 'off'}
                  onChange={(e) =>
                    updateFormState({
                      ...form,
                      settings: { ...form.settings, sendResponseCopy: e.target.value as any }
                    })
                  }
                  className="bg-[#080a0f] border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white outline-none font-mono"
                >
                  <option value="off">Off</option>
                  <option value="requested">When requested</option>
                  <option value="always">Always</option>
                </select>
              </div>

              {/* Allow Response Editing */}
              <div className="flex items-center justify-between pt-4">
                <div>
                  <span className="text-xs font-medium text-white block">Allow response editing</span>
                  <span className="text-[11px] text-neutral-400">Responses can be changed after being submitted</span>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(form.settings?.allowResponseEditing)}
                  onChange={(e) =>
                    updateFormState({
                      ...form,
                      settings: { ...form.settings, allowResponseEditing: e.target.checked }
                    })
                  }
                  className="w-4 h-4 accent-amber-500"
                />
              </div>

              {/* Limit to 1 Response */}
              <div className="flex items-center justify-between pt-4">
                <div>
                  <span className="text-xs font-medium text-white block">Limit to 1 response</span>
                  <span className="text-[11px] text-neutral-400">Requires Google or Zenvitra account sign-in</span>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(form.settings?.limitOneResponse)}
                  onChange={(e) =>
                    updateFormState({
                      ...form,
                      settings: { ...form.settings, limitOneResponse: e.target.checked }
                    })
                  }
                  className="w-4 h-4 accent-amber-500"
                />
              </div>

              {/* Real-time Google Sheets Auto-Forward */}
              <div className="flex items-center justify-between pt-4">
                <div>
                  <span className="text-xs font-medium text-emerald-400 block font-bold">Auto-forward to Google Sheets</span>
                  <span className="text-[11px] text-neutral-400">Stream every incoming submission directly into linked sheet</span>
                </div>
                <input
                  type="checkbox"
                  checked={form.settings?.autoForwardSheets ?? true}
                  onChange={(e) =>
                    updateFormState({
                      ...form,
                      settings: { ...form.settings, autoForwardSheets: e.target.checked }
                    })
                  }
                  className="w-4 h-4 accent-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* 3. Presentation Card */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#0e111a] border border-white/10 shadow-xl space-y-6">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">Presentation</h3>
              <p className="text-xs text-neutral-400">Manage how the form questions and responses are displayed</p>
            </div>

            <div className="space-y-4">
              <span className="text-xs font-mono uppercase text-amber-400 font-bold block">Form presentation</span>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-white block">Show progress bar</span>
                  <span className="text-[11px] text-neutral-400">Display dynamic completion bar as respondent fills fields</span>
                </div>
                <input
                  type="checkbox"
                  checked={form.settings?.showProgressBar ?? true}
                  onChange={(e) =>
                    updateFormState({
                      ...form,
                      settings: { ...form.settings, showProgressBar: e.target.checked }
                    })
                  }
                  className="w-4 h-4 accent-amber-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-white block">Shuffle question order</span>
                  <span className="text-[11px] text-neutral-400">Randomize question sequence for each respondent</span>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(form.settings?.shuffleQuestions)}
                  onChange={(e) =>
                    updateFormState({
                      ...form,
                      settings: { ...form.settings, shuffleQuestions: e.target.checked }
                    })
                  }
                  className="w-4 h-4 accent-amber-500"
                />
              </div>

              <span className="text-xs font-mono uppercase text-amber-400 font-bold block pt-4 border-t border-white/10">
                After submission
              </span>

              <div className="space-y-2">
                <span className="text-xs font-medium text-white block">Confirmation message:</span>
                <textarea
                  rows={2}
                  value={form.successMessage}
                  onChange={(e) => updateFormState({ ...form, successMessage: e.target.value })}
                  className="w-full bg-[#080a0f] border border-white/10 rounded-lg p-3 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-xs font-medium text-white block">Show link to submit another response</span>
                  <span className="text-[11px] text-neutral-400">Allows respondents to easily record another intake</span>
                </div>
                <input
                  type="checkbox"
                  checked={form.settings?.showSubmitAnotherLink ?? true}
                  onChange={(e) =>
                    updateFormState({
                      ...form,
                      settings: { ...form.settings, showSubmitAnotherLink: e.target.checked }
                    })
                  }
                  className="w-4 h-4 accent-amber-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-xs font-medium text-white block">View results summary</span>
                  <span className="text-[11px] text-neutral-400">Share aggregated chart summaries with respondents</span>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(form.settings?.viewResultsSummary)}
                  onChange={(e) =>
                    updateFormState({
                      ...form,
                      settings: { ...form.settings, viewResultsSummary: e.target.checked }
                    })
                  }
                  className="w-4 h-4 accent-amber-500"
                />
              </div>

              <span className="text-xs font-mono uppercase text-amber-400 font-bold block pt-4 border-t border-white/10">
                Restrictions
              </span>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-white block">Disable autosave for all respondents</span>
                  <span className="text-[11px] text-neutral-400">Prevent respondents from recovering drafts from browser cache</span>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(form.settings?.disableAutosave)}
                  onChange={(e) =>
                    updateFormState({
                      ...form,
                      settings: { ...form.settings, disableAutosave: e.target.checked }
                    })
                  }
                  className="w-4 h-4 accent-amber-500"
                />
              </div>
            </div>
          </div>

          {/* 4. Defaults Card */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#0e111a] border border-white/10 shadow-xl space-y-5">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">Defaults</h3>
              <p className="text-xs text-neutral-400">Settings applied automatically across this form and new questions</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-white block">Collect email addresses by default</span>
                <span className="text-[11px] text-neutral-400">Enforces email requirement on new forms</span>
              </div>
              <input
                type="checkbox"
                checked={Boolean(form.settings?.defaultCollectEmail)}
                onChange={(e) =>
                  updateFormState({
                    ...form,
                    settings: { ...form.settings, defaultCollectEmail: e.target.checked }
                  })
                }
                className="w-4 h-4 accent-amber-500"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div>
                <span className="text-xs font-medium text-white block">Make questions required by default</span>
                <span className="text-[11px] text-neutral-400">All newly added questions start with Required enabled</span>
              </div>
              <input
                type="checkbox"
                checked={Boolean(form.settings?.defaultQuestionsRequired)}
                onChange={(e) =>
                  updateFormState({
                    ...form,
                    settings: { ...form.settings, defaultQuestionsRequired: e.target.checked }
                  })
                }
                className="w-4 h-4 accent-amber-500"
              />
            </div>
          </div>

          {/* 5. Google Sheets Integration Hub */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#0e111a] border border-emerald-500/30 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Google Sheets Real-time Hub</h3>
                  <p className="text-xs text-neutral-400">Live bidirectional sync between ZenForms and your spreadsheet</p>
                </div>
              </div>
              <button
                onClick={() => setIsSheetsModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-medium hover:bg-emerald-500/30 transition"
              >
                Configure
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs text-neutral-300">
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                <span className="text-neutral-500 block text-[10px]">WEBHOOK URL</span>
                <span className="truncate block text-emerald-300">
                  {form.googleSheetsConfig?.webhookUrl || 'Not configured (Click Configure to link in 10s)'}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                <span className="text-neutral-500 block text-[10px]">SPREADSHEET URL</span>
                <span className="truncate block text-neutral-300">
                  {form.googleSheetsConfig?.sheetUrl || 'Optional external spreadsheet link'}
                </span>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ── THEME & AESTHETICS DRAWER (🎨 Slide-Out) ── */}
      {isThemeDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div
            onClick={() => setIsThemeDrawerOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          <div className="relative w-full max-w-md bg-[#0c0f17] border-l border-white/10 h-full p-6 sm:p-8 overflow-y-auto space-y-8 shadow-2xl z-10 text-left">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white font-display">Theme & Typography</h3>
              </div>
              <button
                onClick={() => setIsThemeDrawerOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Typography Section */}
            <div className="space-y-4">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block font-bold">
                1. Typography Studio
              </span>

              <div className="space-y-2">
                <label className="text-xs text-neutral-300 block">Header / Display Font</label>
                <select
                  value={form.customStyle?.displayFont || 'Space Grotesk'}
                  onChange={(e) => {
                    const newFont = e.target.value as ZenFormFontFamily;
                    updateFormState({
                      ...form,
                      customStyle: { ...form.customStyle, displayFont: newFont }
                    });
                  }}
                  className="w-full bg-[#080a0f] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                >
                  {ZEN_FORM_FONTS.map((font) => (
                    <option key={font.name} value={font.name}>
                      {font.name} — {font.category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-neutral-300 block">Question / Body Font</label>
                <select
                  value={form.customStyle?.bodyFont || 'Inter'}
                  onChange={(e) => {
                    const newFont = e.target.value as ZenFormFontFamily;
                    updateFormState({
                      ...form,
                      customStyle: { ...form.customStyle, bodyFont: newFont }
                    });
                  }}
                  className="w-full bg-[#080a0f] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                >
                  {ZEN_FORM_FONTS.slice(0, 5).map((font) => (
                    <option key={font.name} value={font.name}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Accent Color Palette */}
            <div className="space-y-4">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block font-bold">
                2. Accent Color
              </span>

              <div className="grid grid-cols-4 gap-2.5">
                {ACCENT_COLOR_PALETTES.map((pal) => (
                  <button
                    key={pal.name}
                    onClick={() => {
                      updateFormState({
                        ...form,
                        customStyle: {
                          ...form.customStyle,
                          accentColor: pal.hex,
                          accentTextColor: pal.textHex
                        }
                      });
                    }}
                    className={`h-9 rounded-xl border flex items-center justify-center transition ${
                      form.customStyle?.accentColor === pal.hex
                        ? 'border-white ring-2 ring-white/30 scale-105'
                        : 'border-white/10 hover:scale-102'
                    }`}
                    style={{ backgroundColor: pal.hex }}
                    title={pal.name}
                  >
                    {form.customStyle?.accentColor === pal.hex && (
                      <Check className="w-4 h-4 text-black font-black" />
                    )}
                  </button>
                ))}
              </div>

              {/* Custom Hex Color Picker */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="color"
                  value={form.customStyle?.accentColor || '#f59e0b'}
                  onChange={(e) => {
                    updateFormState({
                      ...form,
                      customStyle: {
                        ...form.customStyle,
                        accentColor: e.target.value,
                        accentTextColor: '#000000'
                      }
                    });
                  }}
                  className="w-9 h-9 rounded-lg bg-transparent border border-white/20 cursor-pointer"
                />
                <input
                  type="text"
                  value={form.customStyle?.accentColor || '#f59e0b'}
                  onChange={(e) => {
                    updateFormState({
                      ...form,
                      customStyle: {
                        ...form.customStyle,
                        accentColor: e.target.value
                      }
                    });
                  }}
                  className="flex-1 bg-[#080a0f] border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-white outline-none"
                />
              </div>
            </div>

            {/* Atmosphere Presets */}
            <div className="space-y-4">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block font-bold">
                3. Canvas Background Preset
              </span>

              <div className="grid grid-cols-2 gap-2">
                {GRADIENT_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      updateFormState({
                        ...form,
                        customStyle: {
                          ...form.customStyle,
                          bgType: 'gradient',
                          bgGradient: preset.css
                        }
                      });
                    }}
                    className={`p-3 rounded-xl border text-left text-xs transition ${
                      form.customStyle?.bgGradient === preset.css
                        ? 'border-amber-400 bg-amber-500/10 text-white'
                        : 'border-white/10 bg-[#080a0f] text-neutral-300 hover:border-white/20'
                    }`}
                  >
                    <span className="font-semibold block">{preset.name}</span>
                    <span className="text-[10px] text-neutral-500 block truncate font-mono">{preset.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Header Banner Cover */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block font-bold">
                4. Cover Banner Image
              </span>
              <input
                type="text"
                value={form.customStyle?.coverImageUrl || ''}
                onChange={(e) => {
                  updateFormState({
                    ...form,
                    customStyle: { ...form.customStyle, coverImageUrl: e.target.value }
                  });
                }}
                placeholder="Image URL (https://...)"
                className="w-full bg-[#080a0f] border border-white/15 rounded-xl px-4 py-2.5 text-xs font-mono text-white outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── IMPORT QUESTIONS TEMPLATE MODAL ── */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm text-left">
          <div className="w-full max-w-lg bg-[#0e111a] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileDown className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white font-display">Import Questions Template</h3>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} className="p-1 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-300">
              Quickly inject standard pre-configured questions into your form:
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleImportTemplate('mun_delegate')}
                className="w-full p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left hover:bg-amber-500/20 transition space-y-1"
              >
                <span className="font-bold text-sm text-amber-300 block">MUN Delegate Registration (7 Questions)</span>
                <span className="text-xs text-neutral-300 block">Name, Email, WhatsApp, Committee Preference, Portfolio, Experience, Gala Dietary.</span>
              </button>

              <button
                onClick={() => handleImportTemplate('executive_board')}
                className="w-full p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-left hover:bg-purple-500/20 transition space-y-1"
              >
                <span className="font-bold text-sm text-purple-300 block">Executive Board Applications (5 Questions)</span>
                <span className="text-xs text-neutral-300 block">Candidate Name, Role Preference, Council, Dais Philosophy, Resume Dossier.</span>
              </button>

              <button
                onClick={() => handleImportTemplate('event_rsvp')}
                className="w-full p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-left hover:bg-cyan-500/20 transition space-y-1"
              >
                <span className="font-bold text-sm text-cyan-300 block">Event & Summit RSVP (4 Questions)</span>
                <span className="text-xs text-neutral-300 block">Name, Email, Attendance Mode (In-Person/Virtual), Additional Inquiries.</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── GOOGLE SHEETS CONNECTOR MODAL ── */}
      {isSheetsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm text-left">
          <div className="w-full max-w-xl bg-[#0e111a] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Google Sheets Real-Time Stream</h3>
                  <p className="text-xs text-neutral-400">Stream every entry directly into your Google Sheet</p>
                </div>
              </div>
              <button onClick={() => setIsSheetsModalOpen(false)} className="p-1 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-neutral-300 block">Google Apps Script Webhook URL (Direct Stream)</label>
                <input
                  type="text"
                  value={form.googleSheetsConfig?.webhookUrl || ''}
                  onChange={(e) => {
                    updateFormState({
                      ...form,
                      googleSheetsConfig: {
                        ...form.googleSheetsConfig,
                        isConnected: true,
                        autoSync: true,
                        webhookUrl: e.target.value
                      }
                    });
                  }}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full bg-[#080a0f] border border-white/15 rounded-xl px-3.5 py-2.5 text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-300 block">Target Sheet Tab Name</label>
                <input
                  type="text"
                  value={form.googleSheetsConfig?.sheetTab || ''}
                  onChange={(e) => {
                    updateFormState({
                      ...form,
                      googleSheetsConfig: {
                        ...form.googleSheetsConfig,
                        isConnected: true,
                        autoSync: true,
                        sheetTab: e.target.value
                      }
                    });
                  }}
                  placeholder={`ZEN_${(form.slug || 'RESPONSES').toUpperCase().replace(/[^A-Z0-9_]/g, '_')}`}
                  className="w-full bg-[#080a0f] border border-white/15 rounded-xl px-3.5 py-2.5 text-white outline-none"
                />
              </div>

              {/* 1-Click Apps Script Code Template */}
              <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-400">10-Second Google Apps Script Template</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(APPS_SCRIPT_TEMPLATE);
                      setSyncToast('✓ Google Apps Script code copied to clipboard!');
                      setTimeout(() => setSyncToast(null), 3000);
                    }}
                    className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono hover:bg-amber-500/30 transition flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Code</span>
                  </button>
                </div>
                <p className="text-[11px] text-neutral-400 font-sans">
                  Paste into Extensions &rarr; Apps Script inside your Google Sheet, click Deploy as Web App (Anyone), and paste the URL above!
                </p>
              </div>

              {/* Sync All Now Action */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  onClick={async () => {
                    setSyncToast('Syncing all entries to Google Sheet...');
                    const res = await syncFormSubmissionsToGoogleSheets(form);
                    if (res.success) {
                      setSyncToast(`✓ Successfully synced ${res.count || submissions.length} responses to Google Sheets!`);
                    } else {
                      setSyncToast(`Sync note: ${res.error || 'Check webhook URL'}`);
                    }
                    setTimeout(() => setSyncToast(null), 4000);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-semibold text-xs hover:bg-emerald-400 transition"
                >
                  Sync Responses Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SHARE / SEND LINK MODAL ── */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm text-left">
          <div className="w-full max-w-md bg-[#0e111a] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Share2 className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white font-display">Share Public Form</h3>
              </div>
              <button onClick={() => setIsShareModalOpen(false)} className="p-1 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="text-xs font-mono text-neutral-400 block">Shareable URL</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/forms/${form.slug || form.id}`}
                    className="flex-1 bg-[#080a0f] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white outline-none"
                  />
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/forms/${form.slug || form.id}`;
                      navigator.clipboard.writeText(url);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition"
                  >
                    {copiedLink ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <Link
                  href={`/forms/${form.slug || form.id}`}
                  target="_blank"
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono"
                >
                  <span>Open in new tab</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── INDIVIDUAL RESPONSE DETAIL MODAL ── */}
      {selectedResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm text-left">
          <div className="w-full max-w-xl bg-[#0e111a] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white font-display">Submission Record</h3>
                <span className="text-xs font-mono text-neutral-400">
                  {new Date(selectedResponse.submittedAt).toLocaleString()} &bull; {selectedResponse.submitterHandle || 'Anonymous'}
                </span>
              </div>
              <button onClick={() => setSelectedResponse(null)} className="p-1 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {form.fields.map((f) => {
                const answer = selectedResponse.data[f.id];
                return (
                  <div key={f.id} className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-xs font-medium text-neutral-400 block">{f.label}</span>
                    <span className="text-sm text-white font-mono block">
                      {Array.isArray(answer) ? answer.join(', ') : answer || '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
