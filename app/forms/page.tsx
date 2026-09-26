'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileSpreadsheet,
  Plus,
  Search,
  LayoutGrid,
  List,
  ArrowUpDown,
  MoreVertical,
  Share2,
  Download,
  Trash2,
  ExternalLink,
  Copy,
  Sparkles,
  CheckCircle2,
  Sliders,
  Calendar,
  Layers,
  Clock,
  Eye,
  Edit3,
  BarChart3,
  Building2,
  Users,
  Code,
  Check,
  X,
  Upload,
  UploadCloud,
  FileDown,
  RefreshCw
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
  getZenFormsSheetsConfig,
  resetZenFormToDefault
} from '@/lib/formsStorage';
import {
  ZenFormTemplate
} from '@/types/forms';
import {
  getOfficialTemplates,
  getCommunityTemplates,
  saveCommunityTemplate,
  getAllTemplates,
  generateShareableTemplateUrl,
  downloadTemplateJsonFile,
  exportTemplateAsJson,
  importTemplateFromJson,
  createFormFromTemplate,
  unpackTemplateFromData
} from '@/lib/formsTemplates';
import { ZenForm, ZenFormTheme } from '@/types/forms';
import { ZenFormsSheetsPanel } from '@/components/forms/ZenFormsSheetsPanel';

export default function ZenFormsHubPage() {
  const router = useRouter();
  const [forms, setForms] = useState<ZenForm[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeMenuFormId, setActiveMenuFormId] = useState<string | null>(null);
  const [syncToast, setSyncToast] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedTemplateForShare, setSelectedTemplateForShare] = useState<ZenForm | null>(null);
  const [isShareTemplateModalOpen, setIsShareTemplateModalOpen] = useState(false);
  const [isImportTemplateModalOpen, setIsImportTemplateModalOpen] = useState(false);
  const [importInput, setImportInput] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [copiedTemplateUrl, setCopiedTemplateUrl] = useState(false);
  const [copiedTemplateJson, setCopiedTemplateJson] = useState(false);
  const [communityTemplates, setCommunityTemplates] = useState<ZenFormTemplate[]>([]);
  const [templatesTab, setTemplatesTab] = useState<'official' | 'community'>('official');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tmplParam = params.get('template');
      const dataParam = params.get('templateData');
      if (tmplParam || dataParam) {
        router.push(`/forms/edit/new?${params.toString()}`);
        return;
      }
      setCommunityTemplates(getCommunityTemplates());
    }
    refreshForms();
  }, [router]);

  const refreshForms = () => {
    const localForms = getPublicForms();
    setForms(localForms);

    fetch('/api/forms')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.forms)) {
          const map = new Map<string, ZenForm>();
          data.forms.forEach((f: ZenForm) => map.set(f.id, f));
          localForms.forEach((f: ZenForm) => {
            if (!map.has(f.id)) map.set(f.id, f);
            else {
              const serverForm = map.get(f.id)!;
              map.set(f.id, {
                ...f,
                submissionsCount: Math.max(f.submissionsCount || 0, serverForm.submissionsCount || 0)
              });
            }
          });
          const userForms = Array.from(map.values()).filter(
            (f) =>
              f &&
              f.id !== 'form_jharokha_delegate_2026' &&
              f.id !== 'form_horizon_eb_2026' &&
              !f.slug?.includes('jharokha') &&
              !f.slug?.includes('horizon')
          );
          setForms(userForms);
        }
      })
      .catch(() => {});
  };

  const filteredForms = forms.filter((f) =>
    f &&
    (f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  interface TemplateDef {
    key: string;
    name: string;
    subtext: string;
    category: ZenForm['category'];
    coverImage: string;
    accentColor: string;
    theme: ZenFormTheme;
    title: string;
    description: string;
    mockFields: Array<{ label: string; kind: 'input' | 'radio' | 'select' | 'rating' }>;
    fields: ZenForm['fields'];
  }

  const FORM_TEMPLATES: TemplateDef[] = [
    {
      key: 'mun_reg',
      name: 'MUN Registration',
      subtext: 'Committees & Portfolios',
      category: 'MUN_REGISTRATION',
      coverImage: '/assets/forms/template-mun.svg',
      accentColor: '#f59e0b',
      theme: 'amber',
      title: 'Model United Nations — Delegate Registration',
      description: 'Official delegate intake portal. Submit your credentials, committee preferences, and country portfolio selections.',
      mockFields: [
        { label: 'Full Delegate Name', kind: 'input' },
        { label: 'Committee Choice', kind: 'select' },
      ],
      fields: [
        { id: 'mun_name', label: 'Full Delegate Legal Name', type: 'short_answer', required: true, placeholder: 'e.g. Hon. Alexander Vance' },
        { id: 'mun_email', label: 'Official Contact Email', type: 'email', required: true, placeholder: 'delegate@institution.edu' },
        { id: 'mun_phone', label: 'WhatsApp / Emergency Contact', type: 'phone', required: true, placeholder: '+1 (555) 000-0000' },
        { id: 'mun_comm', label: 'First Committee Preference', type: 'dropdown', required: true, options: ['UNSC (Security Council)', 'DISEC (Disarmament & Security)', 'UNHRC (Human Rights Council)', 'Historic Crisis Council'] },
        { id: 'mun_port', label: 'Target Country / Portfolio Preference', type: 'short_answer', required: true, placeholder: 'e.g. United States, France, or Japan' },
        { id: 'mun_exp', label: 'Past MUN / Parliamentary Experience', type: 'paragraph', required: false, placeholder: 'List any conferences attended, awards won, or relevant diplomatic experience.' }
      ]
    },
    {
      key: 'rsvp',
      name: 'Event RSVP',
      subtext: 'Summit Accreditation & Passes',
      category: 'GENERAL',
      coverImage: '/assets/forms/template-rsvp.svg',
      accentColor: '#06b6d4',
      theme: 'midnight',
      title: 'Global Summit & Plenary Session RSVP',
      description: 'Confirm your in-person accreditation and reserve priority badge access for the forthcoming multilateral assembly.',
      mockFields: [
        { label: 'Attending in Person?', kind: 'radio' },
        { label: 'VIP Pass Tier', kind: 'select' },
      ],
      fields: [
        { id: 'rsvp_status', label: 'Will you be attending the plenary assembly?', type: 'multiple_choice', required: true, options: ['Yes, attending in person', 'Virtual streaming participant', 'Regretfully unable to attend'] },
        { id: 'rsvp_name', label: 'Full Attendee Name', type: 'short_answer', required: true, placeholder: 'Your official credential name' },
        { id: 'rsvp_org', label: 'Organization / Sovereign Delegation', type: 'short_answer', required: true, placeholder: 'e.g. Ministry of Foreign Affairs / Company' },
        { id: 'rsvp_guests', label: 'Number of Accompanying Guests', type: 'number', required: false, placeholder: '0' },
        { id: 'rsvp_track', label: 'Preferred Session Track / Working Group', type: 'multiple_choice', required: false, options: ['Plenary Debate', 'Economic Policy', 'Technology Governance', 'Youth Leadership'] }
      ]
    },
    {
      key: 'contact',
      name: 'Contact Information',
      subtext: 'Executive Directory & Inquiry',
      category: 'GENERAL',
      coverImage: '/assets/forms/template-contact.svg',
      accentColor: '#10b981',
      theme: 'emerald',
      title: 'Executive Communiqué & Inquiry Form',
      description: 'Submit an official communiqué or dispatch to the sovereign executive team. Inquiries are audited and replied to within 24 hours.',
      mockFields: [
        { label: 'Primary Contact Name', kind: 'input' },
        { label: 'Official Communiqué Email', kind: 'input' },
      ],
      fields: [
        { id: 'cnt_name', label: 'Full Legal / Official Name', type: 'short_answer', required: true, placeholder: 'Your name' },
        { id: 'cnt_email', label: 'Official Communiqué Email', type: 'email', required: true, placeholder: 'you@domain.org' },
        { id: 'cnt_org', label: 'Organization / Firm Name', type: 'short_answer', required: false, placeholder: 'Entity or Institution' },
        { id: 'cnt_subject', label: 'Nature of Inquiry', type: 'dropdown', required: true, options: ['Strategic Partnership', 'Press & Media Dispatch', 'Protocol & Enclave Access', 'General Inquiry'] },
        { id: 'cnt_msg', label: 'Detailed Message / Dispatch', type: 'paragraph', required: true, placeholder: 'Outline your proposal, dispatch, or query...' }
      ]
    },
    {
      key: 'party',
      name: 'Summit & Gala Dinner',
      subtext: 'Diplomatic Banquet Invite',
      category: 'GENERAL',
      coverImage: '/assets/forms/template-gala.svg',
      accentColor: '#c084fc',
      theme: 'purple',
      title: 'Diplomatic Banquet & Gala Dinner RSVP',
      description: 'Formal invitation and protocol confirmation for the international banquet. Please indicate dietary restrictions and seating requests.',
      mockFields: [
        { label: 'Guest Protocol Status', kind: 'radio' },
        { label: 'Banquet Course Selection', kind: 'select' },
      ],
      fields: [
        { id: 'gala_guest', label: 'Distinguished Guest Full Name', type: 'short_answer', required: true, placeholder: 'Your full name' },
        { id: 'gala_partner', label: 'Attending with Spouse or Protocol Aide?', type: 'multiple_choice', required: true, options: ['Attending with Guest / Spouse', 'Attending Solo', 'Regrets only'] },
        { id: 'gala_meal', label: 'Banquet Course Preference', type: 'dropdown', required: true, options: ['Royal Wagyu & Truffle Course', 'Wild Atlantic Seafood Selection', 'Artisanal Plant-Based Tasting Menu'] },
        { id: 'gala_diet', label: 'Specific Allergies or Medical Restrictions', type: 'short_answer', required: false, placeholder: 'e.g. Shellfish, Peanuts, None' },
        { id: 'gala_notes', label: 'Seating Accommodations / Special Protocol Requests', type: 'paragraph', required: false, placeholder: 'VIP seating requests, accessibility needs, etc.' }
      ]
    },
    {
      key: 'feedback',
      name: 'CSAT & Evaluation',
      subtext: 'Conference Ratings & Reviews',
      category: 'FEEDBACK',
      coverImage: '/assets/forms/template-feedback.svg',
      accentColor: '#ec4899',
      theme: 'purple',
      title: 'Summit CSAT & Delegate Evaluation Survey',
      description: 'Help us improve future summits and diplomatic proceedings. All ratings are recorded anonymously on the sovereign ledger.',
      mockFields: [
        { label: 'Overall Experience Rating', kind: 'rating' },
        { label: 'Favorite Committee Debate', kind: 'select' },
      ],
      fields: [
        { id: 'csat_stars', label: 'Overall Summit Experience Rating', type: 'rating', ratingMax: 5, ratingIcon: 'star', required: true },
        { id: 'csat_moderation', label: 'Committee Moderation & Executive Board Quality', type: 'linear_scale', scaleMin: 1, scaleMax: 5, scaleMinLabel: 'Needs Improvement', scaleMaxLabel: 'Exceptional', required: true },
        { id: 'csat_favorite', label: 'Most Impactful Session or Keynote Debate', type: 'short_answer', required: false, placeholder: 'e.g. UNSC Crisis Resolution debate' },
        { id: 'csat_feedback', label: 'Suggestions & Constructive Feedback for Next Year', type: 'paragraph', required: false, placeholder: 'What can we do better next time?' }
      ]
    }
  ];

  const handleCreateTemplate = (templateKey: string) => {
    const tmpl = FORM_TEMPLATES.find((t) => t.key === templateKey);
    let title = tmpl?.title || 'Untitled form';
    let category: ZenForm['category'] = tmpl?.category || 'GENERAL';
    let description = tmpl?.description || 'Official intake form powered by Zenvitra Sovereign Ledger.';
    let fields: ZenForm['fields'] = tmpl?.fields || [{ id: 'q_1', label: 'Untitled Question', type: 'multiple_choice', options: ['Option 1'] }];
    let coverImageUrl = tmpl?.coverImage || '';
    let accentColor = tmpl?.accentColor || '#f59e0b';
    let theme = tmpl?.theme || 'amber';

    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'form';
    const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

    const newForm: ZenForm = {
      id: `form_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title,
      slug: uniqueSlug,
      description,
      category,
      theme,
      submitButtonText: 'Submit Response',
      successMessage: 'Your response has been cryptographically recorded on the Zenvitra ledger.',
      ownerHandle: 'sovereign_host',
      submissionsCount: 0,
      isPublished: true,
      allowAnonymous: true,
      acceptingResponses: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fields,
      customStyle: {
        displayFont: 'Space Grotesk',
        bodyFont: 'Inter',
        bgType: 'gradient',
        bgGradient: 'from-[#0b0f19] via-[#05070c] to-[#020306]',
        coverImageUrl,
        cardStyle: 'solid-dark',
        borderRadius: '2xl',
        accentColor,
        accentTextColor: '#000000',
        ambientEffect: 'aurora'
      }
    };

    saveZenForm(newForm);
    router.push(`/forms/edit/${newForm.id}`);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-neutral-100 font-sans selection:bg-amber-500/30 flex flex-col justify-between pt-20 sm:pt-24">
      <Navbar />

      {/* ── TOAST NOTIFICATION ── */}
      {syncToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-neutral-900 border border-emerald-500/40 text-emerald-300 font-mono text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* ── TOP SEARCH & BRAND BAR (Google Forms Hub Header) ── */}
      <div className="border-b border-white/10 bg-[#090c13]/80 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-2">
                <span>ZEN.FORMS</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono uppercase font-bold">
                  Sovereign Studio
                </span>
              </h1>
            </div>
          </div>

          {/* Share Your Template & Import Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (forms.length > 0) {
                  setSelectedTemplateForShare(forms[0]);
                  setIsShareTemplateModalOpen(true);
                } else {
                  router.push('/forms/edit/new');
                }
              }}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-amber-500/15 cursor-pointer shrink-0"
              title="Share any of your ZenForms as a reusable template"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Share Template</span>
            </button>

            <button
              onClick={() => {
                setImportInput('');
                setImportError(null);
                setIsImportTemplateModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 text-xs font-mono transition flex items-center gap-1.5 cursor-pointer shrink-0"
              title="Import a template from JSON or shared link"
            >
              <FileDown className="w-3.5 h-3.5 text-amber-400" />
              <span>Import</span>
            </button>
          </div>

          {/* Search Input (Google Forms Search Style) */}
          <div className="flex-1 max-w-xl mx-auto w-full">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search forms..."
                className="w-full bg-[#121622] hover:bg-[#161b2a] focus:bg-[#161b2a] border border-white/10 focus:border-amber-400/80 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-neutral-500 outline-none transition shadow-inner font-sans"
              />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-6 w-full space-y-10 flex-1">
        {/* Google Sheets Account Connection Panel */}
        <ZenFormsSheetsPanel onSyncComplete={refreshForms} />

        {/* ── SECTION 1: "START A NEW FORM" TEMPLATE GALLERY ── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-300 font-sans tracking-wide flex items-center gap-2">
              <span>Start a new form</span>
              <span className="text-[10px] font-mono font-normal text-neutral-500">(Google Forms style templates with cover art)</span>
            </h2>
            <span className="text-xs font-mono text-neutral-500 hover:text-neutral-300 cursor-pointer">
              Template gallery
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {/* 1. Blank Form (+ Google Style) */}
            <Link
              href="/forms/edit/new"
              className="group flex flex-col space-y-2 cursor-pointer"
            >
              <div className="aspect-[4/3] rounded-2xl bg-[#0e121c] border border-white/15 hover:border-amber-400/70 transition-all duration-200 flex flex-col items-center justify-center shadow-lg group-hover:shadow-amber-500/10 group-hover:scale-[1.02] relative overflow-hidden p-4">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 group-hover:bg-amber-400/10 group-hover:border-amber-400/40 flex items-center justify-center transition mb-2">
                  <Plus className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-[11px] font-mono text-neutral-400 group-hover:text-white">Start Blank</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-neutral-300 group-hover:text-white truncate">
                  Blank form
                </span>
                <span className="text-[10px] text-neutral-500 font-mono truncate">Start from scratch</span>
              </div>
            </Link>

            {/* 2 to 6: Authentic Themed Template Cards with Header Art and Form Sheet Mockup */}
            {FORM_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.key}
                onClick={() => handleCreateTemplate(tmpl.key)}
                className="group flex flex-col space-y-2 cursor-pointer"
              >
                <div className="aspect-[4/3] rounded-2xl bg-[#0e121c] border border-white/10 group-hover:border-white/30 transition-all duration-200 overflow-hidden shadow-lg group-hover:scale-[1.02] flex flex-col">
                  {/* Top Cover Banner Image */}
                  <div className="h-14 w-full relative overflow-hidden bg-neutral-900 border-b border-white/10 shrink-0">
                    <img
                      src={tmpl.coverImage}
                      alt={tmpl.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e121c] via-transparent to-transparent opacity-60" />
                  </div>

                  {/* Form Sheet Card Miniature Mockup */}
                  <div className="p-2.5 bg-[#121622] flex-1 flex flex-col justify-between relative text-left">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1 h-3 rounded-full shrink-0" style={{ backgroundColor: tmpl.accentColor }} />
                        <div className="text-[10px] font-bold text-white tracking-tight truncate leading-none">
                          {tmpl.name}
                        </div>
                      </div>

                      {/* Mockup realistic form fields */}
                      <div className="space-y-1 pt-0.5">
                        {tmpl.mockFields.map((f, i) => (
                          <div
                            key={i}
                            className="h-3 rounded bg-white/5 border border-white/10 px-1.5 flex items-center justify-between text-[7px] text-neutral-400 font-mono"
                          >
                            <span className="truncate">{f.label}</span>
                            {f.kind === 'select' && <span className="opacity-50 text-[6px]">▼</span>}
                            {f.kind === 'radio' && <span className="w-1.5 h-1.5 rounded-full border border-white/40 inline-block" />}
                            {f.kind === 'rating' && <span className="text-amber-400 text-[7px]">★★★★★</span>}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[8px] font-mono">
                      <span className="text-neutral-400 truncate max-w-[70px]">{tmpl.subtext}</span>
                      <span
                        className="px-1.5 py-0.5 rounded font-bold text-[7px] text-black shrink-0 shadow-xs"
                        style={{ backgroundColor: tmpl.accentColor }}
                      >
                        Use
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-neutral-200 group-hover:text-white truncate">
                    {tmpl.name}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono truncate">{tmpl.subtext}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 2: "RECENT FORMS" LEDGER ── */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
            <h2 className="text-sm font-semibold text-neutral-300 font-sans tracking-wide">
              Recent forms
            </h2>

            <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
              <span className="cursor-pointer hover:text-white">Owned by anyone</span>
              {filteredForms.length > 0 && (
                <>
                  <div className="h-4 w-px bg-white/10" />
                  <button
                    onClick={() => {
                      if (confirm('Clear all recent forms from this device?')) {
                        localStorage.removeItem('zenvitra_public_forms_v1');
                        setForms([]);
                      }
                    }}
                    className="text-[11px] text-neutral-500 hover:text-rose-400 transition cursor-pointer"
                    title="Clear recent forms ledger from browser"
                  >
                    Clear Ledger
                  </button>
                </>
              )}
              <div className="h-4 w-px bg-white/10" />
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-1 rounded hover:bg-white/5 hover:text-white transition"
                title={viewMode === 'grid' ? 'Switch to List' : 'Switch to Grid'}
              >
                {viewMode === 'grid' ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Forms Grid */}
          {filteredForms.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[#0e121c] border border-white/10 text-center space-y-3">
              <p className="text-sm text-neutral-400">No forms found matching your search.</p>
              <button
                onClick={() => router.push('/forms/edit/new')}
                className="px-4 py-2 rounded-xl bg-amber-500 text-black font-semibold text-xs hover:bg-amber-400 transition"
              >
                Create New Form
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredForms.map((form) => (
                <div
                  key={form.id}
                  className="rounded-2xl bg-[#0d1017] border border-white/10 hover:border-white/20 transition-all duration-200 overflow-hidden shadow-xl flex flex-col justify-between group relative"
                >
                  {/* Visual Mini-Preview Header (Click to Open Editor) */}
                  <div
                    onClick={() => router.push(`/forms/edit/${form.id}`)}
                    className="h-32 bg-[#090b10] border-b border-white/10 p-4 cursor-pointer relative overflow-hidden flex flex-col justify-between group-hover:brightness-110 transition"
                  >
                    {/* Top Accent Strip of the form */}
                    <div
                      className="h-1.5 w-full rounded-full"
                      style={{ backgroundColor: form.customStyle?.accentColor || '#f59e0b' }}
                    />

                    {/* Miniature Card Skeleton */}
                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1.5 opacity-70">
                      <div className="h-2 w-3/4 rounded bg-white/40" />
                      <div className="h-1.5 w-1/2 rounded bg-white/20" />
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                      <span>{form.fields.length} questions</span>
                      <span className="text-amber-400/80 font-bold">{form.submissionsCount || 0} entries</span>
                    </div>
                  </div>

                  {/* Card Bottom Meta */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        {(form.slug === 'zen-diplomacy-2026' || form.slug === 'zen-secretariat-2026') && (
                          <span className="inline-block px-2 py-0.5 rounded text-[8px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-1">
                            CONFIGURABLE TEMPLATE & LIVE FORM
                          </span>
                        )}
                        <h3
                          onClick={() => router.push(`/forms/edit/${form.id}`)}
                          className="text-sm font-bold text-white hover:text-amber-400 transition cursor-pointer truncate"
                          title={form.title}
                        >
                          {form.title}
                        </h3>
                      </div>

                      {/* 3-Dot Menu */}
                      <div className="relative flex-shrink-0">
                        <button
                          onClick={() => setActiveMenuFormId(activeMenuFormId === form.id ? null : form.id)}
                          className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/5 transition"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeMenuFormId === form.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 rounded-xl bg-[#141824] border border-white/15 p-1 shadow-2xl z-30 space-y-0.5 text-xs font-mono text-left">
                            <button
                              onClick={() => router.push(`/forms/edit/${form.id}`)}
                              className="w-full px-3 py-2 rounded-lg hover:bg-white/10 text-neutral-200 flex items-center gap-2"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                              <span>Open Editor</span>
                            </button>

                            <Link
                              href={`/forms/${form.slug || form.id}`}
                              target="_blank"
                              className="w-full px-3 py-2 rounded-lg hover:bg-white/10 text-neutral-200 flex items-center gap-2"
                            >
                              <Eye className="w-3.5 h-3.5 text-cyan-400" />
                              <span>View Public Form</span>
                            </Link>

                            <button
                              onClick={() => {
                                const url = `${window.location.origin}/forms/${form.slug || form.id}`;
                                navigator.clipboard.writeText(url);
                                setCopiedId(form.id);
                                setTimeout(() => setCopiedId(null), 2000);
                                setActiveMenuFormId(null);
                              }}
                              className="w-full px-3 py-2 rounded-lg hover:bg-white/10 text-neutral-200 flex items-center gap-2"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>{copiedId === form.id ? 'Copied Link!' : 'Copy Link'}</span>
                            </button>

                            {/* Share as Template */}
                            <button
                              onClick={() => {
                                setSelectedTemplateForShare(form);
                                setIsShareTemplateModalOpen(true);
                                setActiveMenuFormId(null);
                              }}
                              className="w-full px-3 py-2 rounded-lg hover:bg-amber-500/10 text-amber-300 flex items-center gap-2"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                              <span>Share as Template</span>
                            </button>

                            {/* Download Template JSON */}
                            <button
                              onClick={() => {
                                downloadTemplateJsonFile(form);
                                setActiveMenuFormId(null);
                              }}
                              className="w-full px-3 py-2 rounded-lg hover:bg-white/10 text-neutral-200 flex items-center gap-2"
                            >
                              <Download className="w-3.5 h-3.5 text-neutral-400" />
                              <span>Export Template (.json)</span>
                            </button>

                            {/* Reset option for Secretariat and Diplomacy */}
                            {(form.slug === 'zen-diplomacy-2026' || form.slug === 'zen-secretariat-2026') && (
                              <button
                                onClick={() => {
                                  if (confirm(`Reset "${form.title}" to default template?`)) {
                                    resetZenFormToDefault(form.slug || form.id);
                                    refreshForms();
                                    setActiveMenuFormId(null);
                                  }
                                }}
                                className="w-full px-3 py-2 rounded-lg hover:bg-rose-500/10 text-rose-300 flex items-center gap-2"
                              >
                                <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
                                <span>Reset to Default Template</span>
                              </button>
                            )}

                            <button
                              onClick={async () => {
                                setSyncToast('Syncing form submissions to Google Sheets...');
                                const res = await syncFormSubmissionsToGoogleSheets(form);
                                if (res.success) {
                                  setSyncToast(`✓ Synced ${res.count || 0} entries to Google Sheets!`);
                                } else {
                                  setSyncToast(`Note: ${res.error}`);
                                }
                                setTimeout(() => setSyncToast(null), 4000);
                                setActiveMenuFormId(null);
                              }}
                              className="w-full px-3 py-2 rounded-lg hover:bg-white/10 text-emerald-400 flex items-center gap-2"
                            >
                              <FileSpreadsheet className="w-3.5 h-3.5" />
                              <span>Sync Sheets</span>
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`Delete form "${form.title}"?`)) {
                                  deleteZenForm(form.id);
                                  refreshForms();
                                }
                                setActiveMenuFormId(null);
                              }}
                              className="w-full px-3 py-2 rounded-lg hover:bg-red-500/20 text-red-400 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Form</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center">
                          <FileSpreadsheet className="w-2.5 h-2.5" />
                        </div>
                        <span>{new Date(form.updatedAt).toLocaleDateString()}</span>
                      </div>

                      {form.googleSheetsConfig?.webhookUrl && (
                        <span className="text-[10px] text-emerald-400 font-bold">● Sheets Active</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="rounded-2xl bg-[#0d1017] border border-white/10 overflow-hidden divide-y divide-white/5 text-xs font-mono">
              {filteredForms.map((form) => (
                <div
                  key={form.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/forms/edit/${form.id}`}
                        className="font-bold text-white hover:text-amber-400 text-sm block truncate"
                      >
                        {form.title}
                      </Link>
                      <span className="text-[11px] text-neutral-400 block truncate">
                        {form.fields.length} questions &bull; {form.submissionsCount || 0} entries
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/forms/edit/${form.id}`}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition text-xs"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/forms/${form.slug || form.id}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── SECTION 3: COMMUNITY & OFFICIAL TEMPLATES SHOWCASE ── */}
        <section className="space-y-4 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Featured & Community Template Directory</span>
              </h2>
              <p className="text-xs text-neutral-400 font-sans">
                Browse official ratified templates or share your custom ZenForms templates with other organizers.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (forms.length > 0) {
                    setSelectedTemplateForShare(forms[0]);
                    setIsShareTemplateModalOpen(true);
                  }
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Share Your Template</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
            {getOfficialTemplates().map((tmpl) => (
              <div
                key={tmpl.id}
                className="p-5 rounded-2xl bg-[#0c0f17] border border-white/10 hover:border-amber-400/40 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xl group relative overflow-hidden"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border"
                      style={{
                        borderColor: `${tmpl.accentColor || '#f59e0b'}40`,
                        color: tmpl.accentColor || '#f59e0b',
                        backgroundColor: `${tmpl.accentColor || '#f59e0b'}15`
                      }}
                    >
                      {tmpl.category}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {tmpl.form.fields.length} questions
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-white text-base group-hover:text-amber-300 transition-colors line-clamp-1">
                    {tmpl.title}
                  </h3>

                  <p className="text-xs text-neutral-300 leading-relaxed font-sans line-clamp-2">
                    {tmpl.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(tmpl.tags || []).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-neutral-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const url = generateShareableTemplateUrl(tmpl.form);
                      navigator.clipboard.writeText(url);
                      setSyncToast(`✓ Copied shareable link for "${tmpl.title}"!`);
                      setTimeout(() => setSyncToast(null), 3000);
                    }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition cursor-pointer"
                    title="Copy Shareable Template Link"
                  >
                    <Share2 className="w-4 h-4 text-amber-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const spawned = createFormFromTemplate(tmpl);
                      saveZenForm(spawned);
                      router.push(`/forms/edit/${spawned.id}`);
                    }}
                    className="flex-1 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <span>Use Template</span>
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── SHARE TEMPLATE MODAL ── */}
      {isShareTemplateModalOpen && selectedTemplateForShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md text-left animate-fadeIn">
          <div className="w-full max-w-xl bg-[#0d1019] border border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <Sparkles className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Share Your ZenForms Template</h3>
                  <p className="text-xs text-neutral-400">Share this form so others can clone, customize, and deploy it.</p>
                </div>
              </div>
              <button onClick={() => setIsShareTemplateModalOpen(false)} className="p-1 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template Card Preview */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-white/[0.03] to-transparent border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-white text-base">{selectedTemplateForShare.title}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold uppercase border border-amber-500/40">
                  {selectedTemplateForShare.category}
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans line-clamp-2">
                {selectedTemplateForShare.description || 'Pre-configured form template.'}
              </p>
              <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-400 pt-1">
                <span>{selectedTemplateForShare.fields.length} questions configured</span>
                <span>&bull;</span>
                <span>Theme: {selectedTemplateForShare.theme}</span>
              </div>
            </div>

            {/* 1. Shareable Template URL */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-neutral-300 block font-bold">1. Shareable Template Link (Instant Clone)</label>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-black/60 border border-white/15 focus-within:border-amber-400">
                <input
                  type="text"
                  readOnly
                  value={generateShareableTemplateUrl(selectedTemplateForShare)}
                  className="flex-1 bg-transparent px-2 text-xs font-mono text-neutral-200 outline-none select-all truncate"
                />
                <button
                  type="button"
                  onClick={() => {
                    const url = generateShareableTemplateUrl(selectedTemplateForShare);
                    navigator.clipboard.writeText(url);
                    setCopiedTemplateUrl(true);
                    setSyncToast('✓ Template link copied to clipboard!');
                    setTimeout(() => setCopiedTemplateUrl(false), 2500);
                  }}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition shrink-0 flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  {copiedTemplateUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTemplateUrl ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
              <p className="text-[11px] text-neutral-400 font-sans">
                Anyone opening this link can immediately clone and customize this template into their own ZenForms builder.
              </p>
            </div>

            {/* 2. Download JSON or Copy Code */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-neutral-300 block font-bold">2. Export Template File & Code</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    downloadTemplateJsonFile(selectedTemplateForShare);
                    setSyncToast('✓ Downloaded template JSON file!');
                  }}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 text-neutral-200 transition flex items-center justify-center gap-2 text-xs font-mono font-medium cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Download .zenform.json</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const json = exportTemplateAsJson(selectedTemplateForShare);
                    navigator.clipboard.writeText(json);
                    setCopiedTemplateJson(true);
                    setSyncToast('✓ Template JSON copied to clipboard!');
                    setTimeout(() => setCopiedTemplateJson(false), 2500);
                  }}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 text-neutral-200 transition flex items-center justify-center gap-2 text-xs font-mono font-medium cursor-pointer"
                >
                  {copiedTemplateJson ? <Check className="w-4 h-4 text-emerald-400" /> : <Code className="w-4 h-4 text-amber-400" />}
                  <span>{copiedTemplateJson ? 'JSON Copied!' : 'Copy JSON Code'}</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsShareTemplateModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-medium transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── IMPORT TEMPLATE MODAL ── */}
      {isImportTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md text-left animate-fadeIn">
          <div className="w-full max-w-xl bg-[#0d1019] border border-white/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <FileDown className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white font-display">Import ZenForms Template</h3>
              </div>
              <button onClick={() => setIsImportTemplateModalOpen(false)} className="p-1 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-300 font-sans">
              Paste a shared template link or template JSON code, or upload a <code>.zenform.json</code> file to launch in the editor.
            </p>

            <div className="space-y-3">
              {/* File upload option */}
              <label className="p-4 rounded-2xl border border-dashed border-white/20 hover:border-amber-400/60 bg-white/[0.02] flex items-center justify-center gap-2 cursor-pointer text-xs font-mono text-neutral-300 hover:text-white transition">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Upload .zenform.json File</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (evt) => {
                        const content = evt.target?.result as string;
                        if (content) {
                          const parsed = importTemplateFromJson(content);
                          if (parsed) {
                            saveZenForm(parsed);
                            setIsImportTemplateModalOpen(false);
                            router.push(`/forms/edit/${parsed.id}`);
                          } else {
                            setImportError('Invalid template JSON format.');
                          }
                        }
                      };
                      reader.readAsText(file);
                    }
                  }}
                  className="hidden"
                />
              </label>

              {/* Paste Text / URL area */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400 block">Or Paste Template Link or JSON Code:</label>
                <textarea
                  rows={4}
                  value={importInput}
                  onChange={(e) => {
                    setImportInput(e.target.value);
                    setImportError(null);
                  }}
                  placeholder="Paste URL (e.g. https://.../forms?templateData=...) or JSON code here..."
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs outline-none focus:border-amber-400"
                />
              </div>

              {importError && (
                <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono">
                  {importError}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setIsImportTemplateModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-neutral-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const trimmed = importInput.trim();
                  if (!trimmed) {
                    setImportError('Please paste a template link or JSON code.');
                    return;
                  }

                  // 1. If it's a URL
                  if (trimmed.includes('templateData=')) {
                    try {
                      const urlObj = new URL(trimmed);
                      const param = urlObj.searchParams.get('templateData');
                      if (param) {
                        const parsed = unpackTemplateFromData(param);
                        if (parsed) {
                          saveZenForm(parsed);
                          setIsImportTemplateModalOpen(false);
                          router.push(`/forms/edit/${parsed.id}`);
                          return;
                        }
                      }
                    } catch {}
                  }

                  if (trimmed.includes('template=')) {
                    try {
                      const urlObj = new URL(trimmed);
                      const param = urlObj.searchParams.get('template');
                      if (param) {
                        const tmpl = getAllTemplates().find(t => t.id === param || t.slug === param);
                        if (tmpl) {
                          const spawned = createFormFromTemplate(tmpl);
                          saveZenForm(spawned);
                          setIsImportTemplateModalOpen(false);
                          router.push(`/forms/edit/${spawned.id}`);
                          return;
                        }
                      }
                    } catch {}
                  }

                  // 2. Try parsing as JSON
                  const parsed = importTemplateFromJson(trimmed);
                  if (parsed) {
                    saveZenForm(parsed);
                    setIsImportTemplateModalOpen(false);
                    router.push(`/forms/edit/${parsed.id}`);
                    return;
                  }

                  setImportError('Unable to parse template from the provided link or JSON.');
                }}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition cursor-pointer shadow-lg"
              >
                Load & Edit Template
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
