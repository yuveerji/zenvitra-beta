'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Share2,
  Download,
  Trash2,
  Eye,
  CheckCircle2,
  Copy,
  Sparkles,
  Shield,
  Layers,
  ArrowRight,
  X,
  ExternalLink,
  Table,
  Zap,
  Clock,
  Send,
  FileSpreadsheet,
  RefreshCw,
  Palette,
  Type,
  Image as ImageIcon,
  Sliders,
  Check,
  Code
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  getPublicForms,
  saveZenForm,
  deleteZenForm,
  getFormSubmissions,
  exportSubmissionsToCsv,
  syncFormSubmissionsToGoogleSheets,
  getZenFormsSheetsConfig
} from '@/lib/formsStorage';
import {
  ZenForm,
  ZenFormField,
  ZenFormFieldType,
  ZenFormTheme,
  ZenFormSubmission,
  ZenFormCustomStyle,
  ZenFormFontFamily
} from '@/types/forms';
import { ZenFormsSheetsPanel } from '@/components/forms/ZenFormsSheetsPanel';
import {
  ZEN_FORM_FONTS,
  GRADIENT_PRESETS,
  ACCENT_COLOR_PALETTES,
  CARD_BORDER_RADIUS_MAP,
  APPS_SCRIPT_TEMPLATE,
  getFontCssFamily
} from '@/lib/formsThemes';

export default function ZenFormsHubPage() {
  const [forms, setForms] = useState<ZenForm[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewingSubmissionsForm, setViewingSubmissionsForm] = useState<ZenForm | null>(null);
  const [currentSubmissions, setCurrentSubmissions] = useState<ZenFormSubmission[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'fields' | 'design' | 'sheets'>('fields');
  const [editingFormId, setEditingFormId] = useState<string | null>(null);
  const [isSyncingFormId, setIsSyncingFormId] = useState<string | null>(null);
  const [syncToast, setSyncToast] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  // Form Builder Core State
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState<ZenForm['category']>('MUN_REGISTRATION');
  const [formTheme, setFormTheme] = useState<ZenFormTheme>('amber');
  const [formSubmitText, setFormSubmitText] = useState('Submit Response');
  const [formSuccessMsg, setFormSuccessMsg] = useState('Your response has been cryptographically recorded on the Zenvitra ledger.');
  const [formFields, setFormFields] = useState<ZenFormField[]>([]);

  // 100% Configurable Aesthetics State
  const [customStyle, setCustomStyle] = useState<ZenFormCustomStyle>({
    displayFont: 'Space Grotesk',
    bodyFont: 'Inter',
    bgType: 'gradient',
    bgGradient: GRADIENT_PRESETS[0].css,
    bgSolidColor: '#07090e',
    bgImageUrl: '',
    bgOverlayOpacity: 75,
    bgBlur: 0,
    coverImageUrl: '',
    logoUrl: '',
    cardStyle: 'glass-deep',
    borderRadius: 'xl',
    accentColor: '#f59e0b',
    accentTextColor: '#000000',
    ambientEffect: 'aurora',
  });

  // Google Sheets Direct Flow State
  const [sheetUrl, setSheetUrl] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [sheetTab, setSheetTab] = useState('');

  useEffect(() => {
    refreshForms();
  }, []);

  const refreshForms = () => {
    setForms(getPublicForms());
  };

  const handleCopyLink = (formIdOrSlug: string) => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const url = `${origin}/forms/${formIdOrSlug}`;
      navigator.clipboard.writeText(url);
      setCopiedId(formIdOrSlug);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleOpenSubmissions = (form: ZenForm) => {
    setViewingSubmissionsForm(form);
    setCurrentSubmissions(getFormSubmissions(form.id));
  };

  const handleExportCsv = (form: ZenForm) => {
    const subs = getFormSubmissions(form.id);
    const csvContent = exportSubmissionsToCsv(form, subs);
    if (!csvContent) {
      alert('No submissions recorded for this form yet.');
      return;
    }
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.slug || form.id}_submissions.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = (formId: string) => {
    if (confirm('Are you sure you want to delete this ZenForm?')) {
      deleteZenForm(formId);
      refreshForms();
    }
  };

  const handleSyncSingleFormToSheets = async (form: ZenForm) => {
    setIsSyncingFormId(form.id);
    const subs = getFormSubmissions(form.id);
    const res = await syncFormSubmissionsToGoogleSheets(form, subs);
    setIsSyncingFormId(null);
    if (res.success) {
      setSyncToast(`✓ Synced ${res.count || subs.length} responses for "${form.title}" to Google Sheets!`);
    } else {
      setSyncToast(`Sync notice: ${res.error || 'Failed to sync. Please ensure Google OAuth is connected.'}`);
    }
    setTimeout(() => setSyncToast(null), 4000);
  };

  const handleCopyAppsScript = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(APPS_SCRIPT_TEMPLATE);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 3000);
    }
  };

  // ── Open Modal for Create ──
  const handleOpenCreateModal = () => {
    setEditingFormId(null);
    setFormTitle('');
    setFormSlug('');
    setFormDescription('');
    setFormCategory('MUN_REGISTRATION');
    setFormTheme('amber');
    setFormSubmitText('Submit Response');
    setFormSuccessMsg('Your response has been cryptographically recorded on the Zenvitra ledger.');
    setFormFields([
      {
        id: 'f_name',
        label: 'Full Legal / Delegate Name',
        type: 'text',
        placeholder: 'Enter your name...',
        required: true,
      },
      {
        id: 'f_email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'you@example.com',
        required: true,
      },
      {
        id: 'f_preference',
        label: 'Portfolio / Country Preference',
        type: 'text',
        placeholder: 'Preferred assignment...',
        required: true,
      }
    ]);
    const sheetsAcc = getZenFormsSheetsConfig();
    setSheetUrl(sheetsAcc?.defaultSheetUrl || '');
    setWebhookUrl('');
    setSheetTab('');
    setCustomStyle({
      displayFont: 'Space Grotesk',
      bodyFont: 'Inter',
      bgType: 'gradient',
      bgGradient: GRADIENT_PRESETS[0].css,
      bgSolidColor: '#07090e',
      bgImageUrl: '',
      bgOverlayOpacity: 75,
      bgBlur: 0,
      coverImageUrl: '',
      logoUrl: '',
      cardStyle: 'glass-deep',
      borderRadius: 'xl',
      accentColor: '#f59e0b',
      accentTextColor: '#000000',
      ambientEffect: 'aurora',
    });
    setModalTab('fields');
    setIsModalOpen(true);
  };

  // ── Open Modal for Edit ──
  const handleOpenEditModal = (form: ZenForm) => {
    setEditingFormId(form.id);
    setFormTitle(form.title);
    setFormSlug(form.slug || '');
    setFormDescription(form.description || '');
    setFormCategory(form.category || 'MUN_REGISTRATION');
    setFormTheme(form.theme || 'amber');
    setFormSubmitText(form.submitButtonText || 'Submit Response');
    setFormSuccessMsg(form.successMessage || 'Your response has been cryptographically recorded on the Zenvitra ledger.');
    setFormFields(form.fields || []);
    
    // Custom styles
    const fallbackStyle: ZenFormCustomStyle = {
      displayFont: form.theme === 'amber' ? 'Playfair Display' : 'Space Grotesk',
      bodyFont: 'Inter',
      bgType: 'gradient',
      bgGradient: GRADIENT_PRESETS[0].css,
      bgSolidColor: '#07090e',
      bgImageUrl: '',
      bgOverlayOpacity: 75,
      bgBlur: 0,
      coverImageUrl: '',
      logoUrl: '',
      cardStyle: 'glass-deep',
      borderRadius: 'xl',
      accentColor: form.theme === 'midnight' ? '#06b6d4' : (form.theme === 'emerald' ? '#10b981' : (form.theme === 'purple' ? '#8b5cf6' : '#f59e0b')),
      accentTextColor: '#000000',
      ambientEffect: 'aurora',
    };
    setCustomStyle(form.customStyle ? { ...fallbackStyle, ...form.customStyle } : fallbackStyle);

    // Google Sheets Config
    setSheetUrl(form.googleSheetsConfig?.sheetUrl || '');
    setWebhookUrl(form.googleSheetsConfig?.webhookUrl || '');
    setSheetTab(form.googleSheetsConfig?.sheetTab || '');

    setModalTab('fields');
    setIsModalOpen(true);
  };

  // ── Field Editing Handlers ──
  const handleAddField = () => {
    const nextIdx = formFields.length + 1;
    setFormFields([
      ...formFields,
      {
        id: `field_${Date.now()}_${nextIdx}`,
        label: `Question #${nextIdx}`,
        type: 'text',
        placeholder: 'Enter answer...',
        required: false,
      }
    ]);
  };

  const handleRemoveField = (fieldId: string) => {
    setFormFields(formFields.filter((f) => f.id !== fieldId));
  };

  // ── Save Form (Create or Update) ──
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const generatedSlug = (formSlug.trim() || formTitle.trim())
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const currentForm = editingFormId ? forms.find((f) => f.id === editingFormId) : null;
    const sheetsAcc = getZenFormsSheetsConfig();

    const targetForm: ZenForm = {
      id: editingFormId || `form_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: formTitle.trim(),
      slug: generatedSlug,
      description: formDescription.trim() || 'Official public intake form powered by Zenvitra Sovereign Ledger.',
      category: formCategory,
      theme: formTheme,
      customStyle: customStyle,
      submitButtonText: formSubmitText.trim() || 'Submit Response',
      successMessage: formSuccessMsg.trim() || 'Your response has been cryptographically recorded on the Zenvitra ledger.',
      ownerHandle: currentForm?.ownerHandle || 'sovereign_host',
      submissionsCount: currentForm?.submissionsCount || 0,
      isPublished: true,
      allowAnonymous: true,
      createdAt: currentForm?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fields: formFields,
      googleSheetsConfig: {
        isConnected: Boolean(sheetUrl.trim() || webhookUrl.trim() || sheetsAcc?.isConnected),
        sheetUrl: sheetUrl.trim() || undefined,
        webhookUrl: webhookUrl.trim() || undefined,
        sheetTab: sheetTab.trim() || (generatedSlug ? `ZEN_${generatedSlug.toUpperCase().replace(/[^A-Z0-9_]/g, '_')}` : undefined),
        autoSync: true,
        lastSyncedAt: currentForm?.googleSheetsConfig?.lastSyncedAt,
      }
    };

    saveZenForm(targetForm);
    refreshForms();
    setIsModalOpen(false);
    setSyncToast(editingFormId ? `✓ ZenForm "${targetForm.title}" design and fields updated!` : `✓ New ZenForm "${targetForm.title}" published live!`);
    setTimeout(() => setSyncToast(null), 4000);
  };

  const totalEntries = forms.reduce((acc, curr) => acc + (curr.submissionsCount || 0), 0);

  return (
    <div className="min-h-screen bg-[#040609] text-neutral-200 font-sans selection:bg-amber-500/30 flex flex-col justify-between pt-20 sm:pt-24 text-left">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-10 flex-1">
        
        {/* Hero Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#121624] via-[#090d16] to-[#04060a] border border-amber-500/30 relative overflow-hidden shadow-2xl space-y-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[130px] pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 blur-[120px] pointer-events-none rounded-full" />

          <div className="space-y-3 relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] uppercase font-bold tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>PUBLIC LEDGER &bull; DISTRACTION-FREE FORM ENGINE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight leading-tight">
              ZEN.FORMS
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 font-sans leading-relaxed">
              Create high-speed, beautiful, distraction-free public forms for delegate registrations, executive board applications, and event signups. No Google sign-in walls, zero surveillance telemetry, instant CSV exports, and offline backup ledgers.
            </p>
          </div>

          {/* Quick Metrics & CTA */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 relative z-10 font-mono">
            <div className="flex items-center gap-6 text-xs">
              <div>
                <span className="text-neutral-500 uppercase block text-[10px]">Active Forms</span>
                <span className="text-xl font-bold text-white">{forms.length}</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <span className="text-neutral-500 uppercase block text-[10px]">Total Submissions</span>
                <span className="text-xl font-bold text-amber-300">{totalEntries}</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <span className="text-neutral-500 uppercase block text-[10px]">Data Ledger</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Permanent Sync</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create New ZenForm</span>
            </button>
          </div>
        </div>

        {/* Global Toast Alert */}
        {syncToast && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center gap-2.5 animate-fade-in">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncToast}</span>
          </div>
        )}

        {/* Google Sheets Account Connection Engine */}
        <ZenFormsSheetsPanel />

        {/* Live Public Forms Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold font-display text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <span>Public Forms Ledger</span>
            </h2>
            <span className="text-xs font-mono text-neutral-400">{forms.length} Forms Available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {forms.map((form) => (
              <div
                key={form.id}
                className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-5 group shadow-xl relative overflow-hidden"
              >
                {/* Visual Cover Accent if set */}
                {form.customStyle?.coverImageUrl && (
                  <div
                    className="h-12 -mx-6 -mt-6 bg-cover bg-center border-b border-white/10 relative"
                    style={{ backgroundImage: `url(${form.customStyle.coverImageUrl})` }}
                  >
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      {form.category.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-neutral-500" />
                      <span>{form.submissionsCount || 0} responses</span>
                    </span>
                  </div>

                  <h3
                    className="font-bold text-lg text-white group-hover:text-amber-300 transition"
                    style={{ fontFamily: getFontCssFamily(form.customStyle?.displayFont) }}
                  >
                    {form.title}
                  </h3>

                  <p className="text-xs text-neutral-400 font-sans leading-relaxed line-clamp-2">
                    {form.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-mono text-neutral-400">
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                      Font: {form.customStyle?.displayFont || 'Default'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 capitalize">
                      Style: {form.customStyle?.cardStyle || form.theme}
                    </span>
                    {form.googleSheetsConfig?.isConnected && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                        <FileSpreadsheet className="w-3 h-3" />
                        <span>Sheets Connected</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/forms/${form.slug || form.id}`}
                      className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Open Form</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(form)}
                      className="px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 transition flex items-center gap-1.5 cursor-pointer"
                      title="Customize UI, Fonts & Fields"
                    >
                      <Palette className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Design &amp; Edit</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(form.slug || form.id)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition cursor-pointer"
                      title="Copy Public Share Link"
                    >
                      {copiedId === (form.slug || form.id) ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenSubmissions(form)}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition flex items-center gap-1.5 cursor-pointer"
                      title="View Submissions Table"
                    >
                      <Table className="w-3.5 h-3.5" />
                      <span>Responses</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExportCsv(form)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition cursor-pointer"
                      title="Export Responses to CSV"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSyncSingleFormToSheets(form)}
                      disabled={isSyncingFormId === form.id}
                      className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 transition cursor-pointer disabled:opacity-50"
                      title="Stream responses to Google Sheets"
                    >
                      <FileSpreadsheet className={`w-4 h-4 ${isSyncingFormId === form.id ? 'animate-bounce' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(form.id)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition cursor-pointer"
                      title="Delete Form"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* ═══════════════════════════════════════════════════════════════
          ZENFORMS CREATOR & AESTHETICS STUDIO MODAL
          ═══════════════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fade-in text-left">
          <div className="w-full max-w-4xl max-h-[92vh] bg-gradient-to-b from-[#11141f] via-[#090c14] to-[#04060a] border border-amber-500/40 rounded-3xl p-5 sm:p-8 shadow-2xl flex flex-col relative overflow-hidden space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg sm:text-xl text-white font-display">
                    {editingFormId ? 'Edit ZenForm & Aesthetics Studio' : 'ZenForms Design & Intake Studio'}
                  </h3>
                  <p className="text-[11px] text-neutral-400 font-mono">
                    100% Configurable UI &bull; Custom Fonts &bull; Personal Google Sheets Flow
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => setModalTab('fields')}
                className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                  modalTab === 'fields'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>1. Fields &amp; Questions ({formFields.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('design')}
                className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                  modalTab === 'design'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>2. Design &amp; Aesthetics Studio</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('sheets')}
                className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                  modalTab === 'sheets'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>3. Google Sheets Link</span>
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveForm} className="flex-1 overflow-y-auto space-y-6 pr-2 font-sans text-xs">
              
              {/* ────────────────────────────────────────────────────────
                  TAB 1: FIELDS & INTAKE
                  ──────────────────────────────────────────────────────── */}
              {modalTab === 'fields' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[10px] font-mono uppercase text-neutral-300 font-bold">Form Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. World Youth Diplomatic Summit 2026"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-neutral-300 font-bold">Category</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none font-mono"
                      >
                        <option value="MUN_REGISTRATION">MUN Registration</option>
                        <option value="EXECUTIVE_BOARD">Executive Board (EB)</option>
                        <option value="PRESS_CORPS">Press Corps (IP)</option>
                        <option value="FEEDBACK">Feedback &amp; Reviews</option>
                        <option value="SURVEY">Survey &amp; Poll</option>
                        <option value="GENERAL">General Intake</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-neutral-300 font-bold">Custom URL Slug</label>
                      <input
                        type="text"
                        placeholder="e.g. youth-summit-2026"
                        value={formSlug}
                        onChange={(e) => setFormSlug(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-neutral-300 font-bold">Submit Button Text</label>
                      <input
                        type="text"
                        placeholder="e.g. Submit Registration"
                        value={formSubmitText}
                        onChange={(e) => setFormSubmitText(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-neutral-300 font-bold">Description / Guidelines</label>
                    <textarea
                      rows={2}
                      placeholder="Describe your committee, event rules, mandate, or instructions for delegates..."
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-neutral-300 font-bold">Post-Submission Success Message</label>
                    <input
                      type="text"
                      placeholder="e.g. Your response has been cryptographically recorded on the Zenvitra ledger."
                      value={formSuccessMsg}
                      onChange={(e) => setFormSuccessMsg(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  {/* Question Fields Builder */}
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase font-bold text-amber-300">
                        Form Questions ({formFields.length})
                      </span>
                      <button
                        type="button"
                        onClick={handleAddField}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[11px] font-mono transition flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Question</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {formFields.map((field, idx) => (
                        <div
                          key={field.id}
                          className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5 transition-all"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <input
                                type="text"
                                value={field.label}
                                onChange={(e) => {
                                  const updated = [...formFields];
                                  updated[idx].label = e.target.value;
                                  setFormFields(updated);
                                }}
                                placeholder="Question Title"
                                className="px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs"
                              />

                              <select
                                value={field.type}
                                onChange={(e) => {
                                  const updated = [...formFields];
                                  updated[idx].type = e.target.value as ZenFormFieldType;
                                  setFormFields(updated);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs font-mono"
                              >
                                <option value="text">Short Text</option>
                                <option value="email">Email</option>
                                <option value="tel">Phone / WhatsApp</option>
                                <option value="number">Number</option>
                                <option value="date">Date</option>
                                <option value="textarea">Paragraph / Essay</option>
                                <option value="select">Dropdown Select</option>
                                <option value="radio">Single Choice (Radio)</option>
                                <option value="checkbox">Multiple Choice (Checkbox)</option>
                              </select>

                              <div className="flex items-center gap-3">
                                <label className="flex items-center gap-1.5 text-[11px] text-neutral-300 cursor-pointer font-mono">
                                  <input
                                    type="checkbox"
                                    checked={field.required}
                                    onChange={(e) => {
                                      const updated = [...formFields];
                                      updated[idx].required = e.target.checked;
                                      setFormFields(updated);
                                    }}
                                  />
                                  <span>Required</span>
                                </label>

                                <input
                                  type="text"
                                  value={field.placeholder || ''}
                                  onChange={(e) => {
                                    const updated = [...formFields];
                                    updated[idx].placeholder = e.target.value;
                                    setFormFields(updated);
                                  }}
                                  placeholder="Placeholder hint"
                                  className="flex-1 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-neutral-400 text-xs"
                                />
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveField(field.id)}
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                              title="Remove question"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Options field for select, radio, checkbox */}
                          {['select', 'radio', 'checkbox'].includes(field.type) && (
                            <div className="space-y-1 pt-1 border-t border-white/5">
                              <span className="text-[10px] font-mono text-neutral-400 uppercase">
                                Options (comma-separated):
                              </span>
                              <input
                                type="text"
                                value={(field.options || []).join(', ')}
                                onChange={(e) => {
                                  const updated = [...formFields];
                                  updated[idx].options = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                                  setFormFields(updated);
                                }}
                                placeholder="e.g. Lok Sabha, UNSC, UNHRC, IP"
                                className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs font-mono"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ────────────────────────────────────────────────────────
                  TAB 2: DESIGN & AESTHETICS STUDIO (100% CONFIGURABLE)
                  ──────────────────────────────────────────────────────── */}
              {modalTab === 'design' && (
                <div className="space-y-6">
                  
                  {/* Live Interactive Preview Pill */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <div className="text-[10px] font-mono text-neutral-400 uppercase flex items-center justify-between">
                      <span>Live Design Preview</span>
                      <span className="text-cyan-400">Font: {customStyle.displayFont} &bull; Accent: {customStyle.accentColor}</span>
                    </div>
                    <div
                      className={`p-5 ${CARD_BORDER_RADIUS_MAP[customStyle.borderRadius || 'xl']} transition-all border`}
                      style={{
                        background: customStyle.bgType === 'gradient' ? customStyle.bgGradient : (customStyle.bgType === 'solid' ? customStyle.bgSolidColor : '#0a0d14'),
                        borderColor: customStyle.cardStyle === 'cyber-neon' ? customStyle.accentColor : 'rgba(255,255,255,0.2)',
                        boxShadow: customStyle.cardStyle === 'cyber-neon' ? `0 0 25px ${customStyle.accentColor}30` : undefined,
                      }}
                    >
                      <h4
                        className="text-xl font-bold text-white mb-1"
                        style={{ fontFamily: getFontCssFamily(customStyle.displayFont) }}
                      >
                        {formTitle || 'Sample Summit Title'}
                      </h4>
                      <p
                        className="text-xs text-neutral-300 mb-3"
                        style={{ fontFamily: getFontCssFamily(customStyle.bodyFont) }}
                      >
                        {formDescription || 'Preview how your bespoke typography and accents will appear to delegates.'}
                      </p>
                      <button
                        type="button"
                        className="px-5 py-2 rounded-xl text-xs font-bold transition shadow"
                        style={{
                          backgroundColor: customStyle.accentColor,
                          color: customStyle.accentTextColor || '#000000',
                          fontFamily: getFontCssFamily(customStyle.bodyFont),
                        }}
                      >
                        {formSubmitText || 'Submit Response'}
                      </button>
                    </div>
                  </div>

                  {/* 1. Typography Section */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono uppercase font-bold text-cyan-300 flex items-center gap-1.5">
                      <Type className="w-4 h-4" />
                      <span>Typography Studio</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-neutral-400 uppercase">Display / Header Font</label>
                        <select
                          value={customStyle.displayFont || 'Space Grotesk'}
                          onChange={(e) => setCustomStyle({ ...customStyle, displayFont: e.target.value as ZenFormFontFamily })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none font-mono"
                        >
                          {ZEN_FORM_FONTS.map((font) => (
                            <option key={font.name} value={font.name}>
                              {font.name} ({font.category})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-neutral-400 uppercase">Body &amp; Questions Font</label>
                        <select
                          value={customStyle.bodyFont || 'Inter'}
                          onChange={(e) => setCustomStyle({ ...customStyle, bodyFont: e.target.value as ZenFormFontFamily })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none font-mono"
                        >
                          <option value="Inter">Inter (Clean Standard)</option>
                          <option value="Space Grotesk">Space Grotesk (Tech Modern)</option>
                          <option value="Outfit">Outfit (Geometric Sans)</option>
                          <option value="Playfair Display">Playfair Display (Luxury Editorial)</option>
                          <option value="JetBrains Mono">JetBrains Mono (Monospace)</option>
                          <option value="Prata">Prata (Classical Serif)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 2. Background Customizer */}
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <h4 className="text-xs font-mono uppercase font-bold text-cyan-300 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4" />
                      <span>Background Studio</span>
                    </h4>

                    <div className="flex items-center gap-2 pb-1">
                      {(['gradient', 'image', 'solid'] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setCustomStyle({ ...customStyle, bgType: mode })}
                          className={`px-3 py-1.5 rounded-xl font-mono text-xs capitalize cursor-pointer transition ${
                            customStyle.bgType === mode
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                              : 'bg-white/5 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {mode} Background
                        </button>
                      ))}
                    </div>

                    {/* Mode: Gradient Presets */}
                    {customStyle.bgType === 'gradient' && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-neutral-400 uppercase">Gradient Atmosphere Presets:</span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {GRADIENT_PRESETS.map((preset) => (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => setCustomStyle({ ...customStyle, bgGradient: preset.css, accentColor: preset.defaultAccent })}
                              className={`p-3 rounded-xl border text-left transition relative overflow-hidden group cursor-pointer ${
                                customStyle.bgGradient === preset.css ? 'border-cyan-400 ring-2 ring-cyan-400/30' : 'border-white/10 hover:border-white/30'
                              }`}
                              style={{ background: preset.css }}
                            >
                              <span className="text-xs font-bold text-white block relative z-10">{preset.name}</span>
                              <span className="text-[10px] text-neutral-400 block relative z-10 font-mono">Preset</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mode: Custom Image URL */}
                    {customStyle.bgType === 'image' && (
                      <div className="space-y-3 p-3 rounded-2xl bg-white/[0.02] border border-white/10">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-neutral-400 uppercase">Custom Background Image URL</label>
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/... or direct image link"
                            value={customStyle.bgImageUrl || ''}
                            onChange={(e) => setCustomStyle({ ...customStyle, bgImageUrl: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase flex items-center justify-between">
                              <span>Dark Tint Overlay</span>
                              <span>{customStyle.bgOverlayOpacity ?? 75}%</span>
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="95"
                              value={customStyle.bgOverlayOpacity ?? 75}
                              onChange={(e) => setCustomStyle({ ...customStyle, bgOverlayOpacity: Number(e.target.value) })}
                              className="w-full accent-cyan-400 cursor-pointer"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase flex items-center justify-between">
                              <span>Background Blur</span>
                              <span>{customStyle.bgBlur || 0}px</span>
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="24"
                              value={customStyle.bgBlur || 0}
                              onChange={(e) => setCustomStyle({ ...customStyle, bgBlur: Number(e.target.value) })}
                              className="w-full accent-cyan-400 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Mode: Solid Color */}
                    {customStyle.bgType === 'solid' && (
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={customStyle.bgSolidColor || '#07090e'}
                          onChange={(e) => setCustomStyle({ ...customStyle, bgSolidColor: e.target.value })}
                          className="w-12 h-10 rounded-xl bg-transparent border border-white/20 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={customStyle.bgSolidColor || '#07090e'}
                          onChange={(e) => setCustomStyle({ ...customStyle, bgSolidColor: e.target.value })}
                          className="px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-xs focus:outline-none"
                          placeholder="#07090e"
                        />
                      </div>
                    )}
                  </div>

                  {/* 3. Branding, Banners & Logo */}
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <h4 className="text-xs font-mono uppercase font-bold text-cyan-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Branding &amp; Media</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-neutral-400 uppercase">Top Cover Banner Image URL</label>
                        <input
                          type="url"
                          placeholder="https://example.com/banner.jpg"
                          value={customStyle.coverImageUrl || ''}
                          onChange={(e) => setCustomStyle({ ...customStyle, coverImageUrl: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-neutral-400 uppercase">Logo / MUN Crest Avatar URL</label>
                        <input
                          type="url"
                          placeholder="https://example.com/crest.png"
                          value={customStyle.logoUrl || ''}
                          onChange={(e) => setCustomStyle({ ...customStyle, logoUrl: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Card Styling, Radius & Ambient FX */}
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <h4 className="text-xs font-mono uppercase font-bold text-cyan-300 flex items-center gap-1.5">
                      <Sliders className="w-4 h-4" />
                      <span>Card Glassmorphism &amp; Geometry</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-neutral-400 uppercase">Card Style</label>
                        <select
                          value={customStyle.cardStyle || 'glass-deep'}
                          onChange={(e) => setCustomStyle({ ...customStyle, cardStyle: e.target.value as any })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none font-mono"
                        >
                          <option value="glass-deep">Glass Deep Obsidian</option>
                          <option value="glass-frosted">Glass Ultra Frosted</option>
                          <option value="cyber-neon">Cyber Neon Glow</option>
                          <option value="solid-dark">Solid Dark Noir</option>
                          <option value="outline-minimal">Outline Minimal</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-neutral-400 uppercase">Corner Radius</label>
                        <select
                          value={customStyle.borderRadius || 'xl'}
                          onChange={(e) => setCustomStyle({ ...customStyle, borderRadius: e.target.value as any })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none font-mono"
                        >
                          <option value="none">Sharp (0px)</option>
                          <option value="sm">Subtle (8px)</option>
                          <option value="lg">Modern Rounded (16px)</option>
                          <option value="xl">Ultra Curved (24px)</option>
                          <option value="2xl">Executive Pill (32px)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-neutral-400 uppercase">Ambient FX Atmosphere</label>
                        <select
                          value={customStyle.ambientEffect || 'aurora'}
                          onChange={(e) => setCustomStyle({ ...customStyle, ambientEffect: e.target.value as any })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-cyan-400 focus:outline-none font-mono"
                        >
                          <option value="aurora">Ethereal Aurora Glow</option>
                          <option value="grid">Cyber Matrix Grid</option>
                          <option value="dots">Architectural Dot Matrix</option>
                          <option value="none">None / Clean</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 5. Accent Color Palette */}
                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block">
                      Brand Accent Color (Buttons &amp; Highlights)
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      {ACCENT_COLOR_PALETTES.map((palette) => (
                        <button
                          key={palette.hex}
                          type="button"
                          onClick={() => setCustomStyle({ ...customStyle, accentColor: palette.hex, accentTextColor: palette.textHex })}
                          className={`px-3 py-1.5 rounded-xl font-mono text-xs border flex items-center gap-1.5 cursor-pointer transition ${
                            customStyle.accentColor?.toLowerCase() === palette.hex.toLowerCase()
                              ? 'border-white ring-2 ring-white/30 text-white'
                              : 'border-white/10 text-neutral-400 hover:text-white'
                          }`}
                        >
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: palette.hex }} />
                          <span>{palette.name}</span>
                        </button>
                      ))}

                      <div className="flex items-center gap-1 ml-2">
                        <input
                          type="color"
                          value={customStyle.accentColor || '#f59e0b'}
                          onChange={(e) => setCustomStyle({ ...customStyle, accentColor: e.target.value })}
                          className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border border-white/20"
                        />
                        <input
                          type="text"
                          value={customStyle.accentColor || '#f59e0b'}
                          onChange={(e) => setCustomStyle({ ...customStyle, accentColor: e.target.value })}
                          className="w-24 px-2 py-1 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* ────────────────────────────────────────────────────────
                  TAB 3: GOOGLE SHEETS DIRECT FLOW
                  ──────────────────────────────────────────────────────── */}
              {modalTab === 'sheets' && (
                <div className="space-y-5">
                  
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-2 font-mono text-xs">
                    <div className="flex items-center gap-2 font-bold">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      <span>Direct Google Sheets Data Flow</span>
                    </div>
                    <p className="text-neutral-300 font-sans leading-relaxed text-xs">
                      All entries filled by delegates or participants will immediately flow into <strong>your personal Google Sheet</strong> so you can view, sort, format, and share responses directly in Google Drive!
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-neutral-300 font-bold">
                        Your Google Spreadsheet Link (Optional Reference)
                      </label>
                      <input
                        type="url"
                        placeholder="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit"
                        value={sheetUrl}
                        onChange={(e) => setSheetUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-emerald-400 focus:outline-none font-mono"
                      />
                      <span className="text-[10px] text-neutral-500 font-mono">
                        Paste the URL of your Google Sheet for quick 1-click access from your dashboard.
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-neutral-300 font-bold">
                        Target Sheet Tab / Worksheet Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Delegate_Registrations or ZEN_FORMS"
                        value={sheetTab}
                        onChange={(e) => setSheetTab(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-emerald-400 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-neutral-300 font-bold">
                        Personal Apps Script Webhook URL (For Live Auto-Appends)
                      </label>
                      <input
                        type="url"
                        placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-emerald-400 focus:outline-none font-mono"
                      />
                      <span className="text-[10px] text-neutral-500 font-mono">
                        If provided, submissions will trigger instant append row calls directly into your sheet!
                      </span>
                    </div>
                  </div>

                  {/* 10-Second Setup Helper */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold font-mono text-xs text-white flex items-center gap-1.5">
                        <Code className="w-4 h-4 text-emerald-400" />
                        <span>10-Second Google Apps Script Webhook (Free &amp; Direct)</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyAppsScript}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-mono text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        {copiedScript ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedScript ? 'Script Copied!' : 'Copy Apps Script'}</span>
                      </button>
                    </div>

                    <ol className="list-decimal list-inside space-y-1 text-[11px] text-neutral-400 font-sans leading-relaxed">
                      <li>In your Google Sheet, click <strong>Extensions &gt; Apps Script</strong>.</li>
                      <li>Delete any sample code and paste the copied script.</li>
                      <li>Click <strong>Deploy &gt; New deployment</strong>, select <strong>Web app</strong>.</li>
                      <li>Set <em>Execute as: Me</em> and <em>Who has access: Anyone</em>, then click <strong>Deploy</strong>.</li>
                      <li>Copy the generated Web App URL and paste it into the Webhook URL field above!</li>
                    </ol>
                  </div>

                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 font-mono text-xs">
                <div className="text-[11px] text-neutral-400">
                  Sovereign Cryptographic Ledger &bull; No Surveillance
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-neutral-300 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition flex items-center gap-1.5 shadow-lg shadow-amber-500/25 cursor-pointer active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{editingFormId ? 'Save ZenForm Changes' : 'Publish Live ZenForm'}</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ─── RESPONSES TABLE MODAL ─── */}
      {viewingSubmissionsForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-left">
          <div className="w-full max-w-4xl max-h-[90vh] bg-gradient-to-b from-[#10141e] via-[#0a0d14] to-[#04060a] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col relative overflow-hidden space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="font-bold text-lg text-white font-display">
                  Responses: {viewingSubmissionsForm.title}
                </h3>
                <p className="text-xs text-neutral-400 font-mono">
                  {currentSubmissions.length} Submissions recorded &bull; Permanent CSV backup ready
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSyncSingleFormToSheets(viewingSubmissionsForm)}
                  disabled={isSyncingFormId === viewingSubmissionsForm.id}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-mono transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Stream responses directly to Google Sheets"
                >
                  <FileSpreadsheet className={`w-3.5 h-3.5 text-emerald-400 ${isSyncingFormId === viewingSubmissionsForm.id ? 'animate-spin' : ''}`} />
                  <span>{isSyncingFormId === viewingSubmissionsForm.id ? 'Syncing...' : 'Sync to Google Sheets'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleExportCsv(viewingSubmissionsForm)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingSubmissionsForm(null)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto border border-white/10 rounded-2xl">
              {currentSubmissions.length === 0 ? (
                <div className="p-12 text-center text-neutral-500 font-mono text-xs">
                  No responses received yet for this ZenForm. Share the link to begin collecting data.
                </div>
              ) : (
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 text-neutral-400 font-mono text-[11px] uppercase">
                      <th className="p-3">#</th>
                      <th className="p-3">Time</th>
                      <th className="p-3">Submitter</th>
                      {viewingSubmissionsForm.fields.map((f) => (
                        <th key={f.id} className="p-3 whitespace-nowrap">{f.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-neutral-300">
                    {currentSubmissions.map((sub, idx) => (
                      <tr key={sub.id} className="hover:bg-white/[0.02]">
                        <td className="p-3 font-mono text-neutral-500">{idx + 1}</td>
                        <td className="p-3 font-mono text-[11px] text-neutral-400 whitespace-nowrap">
                          {new Date(sub.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 font-mono text-cyan-300">{sub.submitterHandle || 'Anonymous'}</td>
                        {viewingSubmissionsForm.fields.map((f) => {
                          const val = sub.data[f.id] ?? '-';
                          const display = Array.isArray(val) ? val.join(', ') : String(val);
                          return (
                            <td key={f.id} className="p-3 max-w-[200px] truncate" title={display}>
                              {display}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
