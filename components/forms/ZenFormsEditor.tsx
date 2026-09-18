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
  Code
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
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [copiedLink, setCopiedLink] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<ZenFormSubmission | null>(null);

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
      } else {
        router.replace('/forms');
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
      label: type === 'title_desc' ? 'Title block' : type === 'image_block' ? 'Image showcase' : type === 'video_block' ? 'Video overview' : type === 'section_break' ? 'Section header' : 'Untitled Question',
      type,
      required: false,
      options: ['multiple_choice', 'checkboxes', 'dropdown', 'radio', 'checkbox', 'select'].includes(type) ? ['Option 1'] : undefined,
      hasOtherOption: false,
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
                              options: ['multiple_choice', 'checkboxes', 'dropdown', 'radio', 'checkbox', 'select'].includes(newType)
                                ? field.options || ['Option 1']
                                : undefined
                            });
                          }}
                          className="appearance-none bg-[#080a0f] border border-white/15 hover:border-white/30 text-xs sm:text-sm font-medium text-white px-3.5 py-2.5 pr-8 rounded-lg outline-none cursor-pointer transition font-mono"
                        >
                          <option value="multiple_choice">● Multiple choice</option>
                          <option value="checkboxes">■ Checkboxes</option>
                          <option value="dropdown">▼ Dropdown</option>
                          <option value="short_answer">─ Short answer</option>
                          <option value="paragraph">≡ Paragraph</option>
                          <option value="date">📅 Date</option>
                          <option value="number"># Number</option>
                          <option value="title_desc">TT Title & description</option>
                          <option value="image_block">🖼️ Image</option>
                          <option value="video_block">📹 Video</option>
                          <option value="section_break">🟰 Section break</option>
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

                    {/* Field Content / Option Controls depending on Type */}
                    <div className="pt-2">
                      {/* 1. Multiple Choice / Checkboxes / Dropdown */}
                      {['multiple_choice', 'checkboxes', 'dropdown', 'radio', 'checkbox', 'select'].includes(field.type) && (
                        <div className="space-y-2.5 pl-1">
                          {(field.options || ['Option 1']).map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-3 group">
                              {field.type === 'multiple_choice' || field.type === 'radio' ? (
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
                          ))}

                          {/* "Add Option" / "Add Other" Row */}
                          <div className="flex items-center gap-3 pt-2 text-xs font-medium">
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

                            {field.type !== 'dropdown' && !field.hasOtherOption && (
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
                          </div>
                        </div>
                      )}

                      {/* 2. Short Answer */}
                      {(field.type === 'short_answer' || field.type === 'text') && (
                        <div className="py-2 border-b border-dotted border-white/20 text-neutral-500 text-xs font-mono max-w-sm">
                          Short-answer text line
                        </div>
                      )}

                      {/* 3. Paragraph */}
                      {(field.type === 'paragraph' || field.type === 'textarea') && (
                        <div className="py-4 border-b border-dotted border-white/20 text-neutral-500 text-xs font-mono max-w-lg">
                          Long-answer multiline text area
                        </div>
                      )}

                      {/* 4. Date */}
                      {field.type === 'date' && (
                        <div className="flex items-center gap-3 py-2 border-b border-dotted border-white/20 text-neutral-500 text-xs font-mono max-w-xs">
                          <span>Month, day, year</span>
                          <Calendar className="w-4 h-4 ml-auto" />
                        </div>
                      )}

                      {/* 5. Number */}
                      {field.type === 'number' && (
                        <div className="py-2 border-b border-dotted border-white/20 text-neutral-500 text-xs font-mono max-w-xs">
                          Numeric input (1, 2, 3...)
                        </div>
                      )}

                      {/* 6. Image Block */}
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

                      {/* 7. Video Block */}
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

                      {/* 8. Section Break */}
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

      {/* ── TAB 2: RESPONSES LEDGER ── */}
      {activeTab === 'responses' && (
        <main className="max-w-4xl mx-auto px-4 py-8 w-full space-y-6">
          {/* Responses Header Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0e111a] border border-white/10 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-3xl sm:text-4xl font-black text-white font-display">
                  {submissions.length} responses
                </span>
                <p className="text-xs font-mono text-neutral-400 pt-1">
                  Cryptographically verified on the Zenvitra ledger
                </p>
              </div>

              {/* Actions: Google Sheets Link + Accepting Responses Toggle */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Link to Google Sheets Button */}
                <button
                  onClick={() => setIsSheetsModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition flex items-center gap-2 text-xs font-mono font-medium shadow-lg shadow-emerald-500/10"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Link to Google Sheets</span>
                </button>

                {/* CSV Download */}
                <button
                  onClick={() => {
                    const csv = exportSubmissionsToCsv(form, submissions);
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${form.slug || 'zenform'}-responses.csv`;
                    a.click();
                  }}
                  disabled={submissions.length === 0}
                  className="px-3.5 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-neutral-300 disabled:opacity-30 transition flex items-center gap-1.5 text-xs font-mono"
                  title="Download CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>

                {/* Accepting Responses Toggle */}
                <label className="flex items-center gap-2 cursor-pointer select-none pl-2 border-l border-white/10">
                  <span className="text-xs font-mono text-neutral-300">Accepting responses</span>
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
          </div>

          {/* Responses Data List */}
          {submissions.length === 0 ? (
            <div className="p-12 rounded-2xl bg-[#0e111a] border border-white/10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-neutral-500">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Waiting for responses</h3>
              <p className="text-sm text-neutral-400 max-w-md mx-auto">
                Share your public form link with participants. Every response will immediately stream into this ledger and your connected Google Sheet.
              </p>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="px-5 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition"
              >
                Copy Public Link
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Question Summary Breakdowns */}
              {form.fields
                .filter((f) => ['multiple_choice', 'checkboxes', 'dropdown', 'radio', 'checkbox', 'select'].includes(f.type))
                .map((field) => {
                  const options = field.options || [];
                  const counts: Record<string, number> = {};
                  options.forEach((opt) => (counts[opt] = 0));

                  submissions.forEach((sub) => {
                    const ans = sub.data[field.id];
                    if (Array.isArray(ans)) {
                      ans.forEach((val) => {
                        counts[val] = (counts[val] || 0) + 1;
                      });
                    } else if (ans) {
                      counts[ans] = (counts[ans] || 0) + 1;
                    }
                  });

                  return (
                    <div key={field.id} className="p-6 rounded-2xl bg-[#0e111a] border border-white/10 shadow-lg space-y-4">
                      <h4 className="text-base font-bold text-white">{field.label}</h4>
                      <p className="text-xs font-mono text-neutral-400">{submissions.length} responses</p>

                      <div className="space-y-2 pt-2">
                        {options.map((opt) => {
                          const count = counts[opt] || 0;
                          const pct = submissions.length > 0 ? Math.round((count / submissions.length) * 100) : 0;
                          return (
                            <div key={opt} className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-neutral-300">{opt}</span>
                                <span className="font-mono text-neutral-400">
                                  {count} ({pct}%)
                                </span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{ width: `${pct}%`, backgroundColor: accentHex }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
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
                              onClick={() => setSelectedResponse(sub)}
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
        </main>
      )}

      {/* ── TAB 3: SETTINGS ── */}
      {activeTab === 'settings' && (
        <main className="max-w-3xl mx-auto px-4 py-8 w-full space-y-6">
          {/* General Responses Settings */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0e111a] border border-white/10 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white font-display">Form Intake & Security</h3>

            <div className="space-y-4 divide-y divide-white/10">
              <div className="flex items-center justify-between pt-4">
                <div>
                  <span className="text-sm font-medium text-white block">Allow Anonymous Submissions</span>
                  <span className="text-xs text-neutral-400">Permits users to submit without signing into Zenvitra</span>
                </div>
                <input
                  type="checkbox"
                  checked={form.allowAnonymous}
                  onChange={(e) => updateFormState({ ...form, allowAnonymous: e.target.checked })}
                  className="w-4 h-4 accent-amber-500"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <span className="text-sm font-medium text-white block">Publicly Published</span>
                  <span className="text-xs text-neutral-400">Anyone with the link can view and submit</span>
                </div>
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => updateFormState({ ...form, isPublished: e.target.checked })}
                  className="w-4 h-4 accent-amber-500"
                />
              </div>

              <div className="pt-4 space-y-2">
                <span className="text-sm font-medium text-white block">Success Message</span>
                <input
                  type="text"
                  value={form.successMessage}
                  onChange={(e) => updateFormState({ ...form, successMessage: e.target.value })}
                  className="w-full bg-[#080a0f] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none"
                />
              </div>

              <div className="pt-4 space-y-2">
                <span className="text-sm font-medium text-white block">Submit Button Label</span>
                <input
                  type="text"
                  value={form.submitButtonText}
                  onChange={(e) => updateFormState({ ...form, submitButtonText: e.target.value })}
                  className="w-full bg-[#080a0f] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Google Sheets Configuration Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0e111a] border border-emerald-500/30 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Personal Google Sheets Sync</h3>
                  <p className="text-xs text-neutral-400">Stream incoming submissions directly into your Google Spreadsheet</p>
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
                  {form.googleSheetsConfig?.webhookUrl || 'Not configured (Click Configure to link)'}
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
