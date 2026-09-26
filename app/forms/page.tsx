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
  BarChart3
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

  useEffect(() => {
    refreshForms();
  }, []);

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
              f.id !== 'zen-diplomacy-2026-registration' &&
              f.slug !== 'zen-diplomacy-2026' &&
              f.id !== 'zen-secretariat-2026-application' &&
              f.slug !== 'zen-secretariat-2026' &&
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
    f.id !== 'zen-diplomacy-2026-registration' &&
    f.slug !== 'zen-diplomacy-2026' &&
    f.id !== 'zen-secretariat-2026-application' &&
    f.slug !== 'zen-secretariat-2026' &&
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
        { id: 'rsvp_diet', label: 'Hospitality & Dietary Preferences', type: 'checkboxes', required: false, options: ['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free', 'None'] }
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
                      <h3
                        onClick={() => router.push(`/forms/edit/${form.id}`)}
                        className="text-sm font-bold text-white hover:text-amber-400 transition cursor-pointer truncate flex-1"
                        title={form.title}
                      >
                        {form.title}
                      </h3>

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
      </main>

      <Footer />
    </div>
  );
}
