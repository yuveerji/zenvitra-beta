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
  Edit3
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
import { ZenForm } from '@/types/forms';
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
    setForms(getPublicForms());
  };

  const filteredForms = forms.filter((f) =>
    f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateTemplate = (templateKey: string) => {
    let title = 'Untitled form';
    let category: ZenForm['category'] = 'GENERAL';
    let description = 'Official intake form powered by Zenvitra Sovereign Ledger.';
    let fields: ZenForm['fields'] = [];

    if (templateKey === 'contact') {
      title = 'Contact Information';
      description = 'Please fill in your details and how our team can contact you.';
      fields = [
        { id: 'f_name', label: 'Name', type: 'short_answer', required: true },
        { id: 'f_email', label: 'Email', type: 'short_answer', required: true },
        { id: 'f_address', label: 'Address', type: 'paragraph', required: false },
        { id: 'f_phone', label: 'Phone number', type: 'short_answer', required: false },
        { id: 'f_comments', label: 'Comments', type: 'paragraph', required: false }
      ];
    } else if (templateKey === 'rsvp') {
      title = 'Event RSVP & Accreditation';
      description = 'Let us know if you will be joining our upcoming conference or summit session.';
      fields = [
        { id: 'r_attend', label: 'Can you attend?', type: 'multiple_choice', required: true, options: ['Yes, I will be there', 'Sorry, can\'t make it'] },
        { id: 'r_names', label: 'What are the names of people attending?', type: 'paragraph', required: false },
        { id: 'r_diet', label: 'Dietary restrictions', type: 'checkboxes', required: false, options: ['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-free'] }
      ];
    } else if (templateKey === 'party') {
      title = 'Summit & Gala Dinner Invite';
      description = 'Confirm your attendance and preferences for the diplomatic banquet.';
      fields = [
        { id: 'p_name', label: 'What is your name?', type: 'short_answer', required: true },
        { id: 'p_bring', label: 'What will you be bringing?', type: 'checkboxes', required: false, options: ['Appetizers', 'Salad', 'Main Dish', 'Dessert', 'Drinks'] },
        { id: 'p_allergies', label: 'Do you have any allergies?', type: 'short_answer', required: false }
      ];
    } else if (templateKey === 'mun_reg') {
      title = 'The Jharokha Forum MUN 2026 — Delegate Registration';
      description = 'Official delegate registration portal for The Jharokha Forum Model United Nations 2026. Select your preferred committees and portfolios.';
      category = 'MUN_REGISTRATION';
      fields = [
        { id: 'f_name', label: 'Full Delegate Name', type: 'short_answer', required: true },
        { id: 'f_email', label: 'Official Email Address', type: 'short_answer', required: true },
        { id: 'f_phone', label: 'WhatsApp / Contact Number', type: 'short_answer', required: true },
        { id: 'f_comm', label: 'First Committee Preference', type: 'dropdown', required: true, options: ['UNSC', 'DISEC', 'UNHRC', 'Historic Crisis'] },
        { id: 'f_port', label: 'Country / Portfolio Choice', type: 'short_answer', required: true }
      ];
    }

    const newForm: ZenForm = {
      id: `form_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      description,
      category,
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
      fields: fields.length > 0 ? fields : [{ id: 'q_1', label: 'Untitled Question', type: 'multiple_choice', options: ['Option 1'] }],
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
    router.push(`/forms/edit/${newForm.id}`);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-neutral-100 font-sans selection:bg-amber-500/30 flex flex-col justify-between pt-16 sm:pt-20">
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
            <h2 className="text-sm font-semibold text-neutral-300 font-sans tracking-wide">
              Start a new form
            </h2>
            <span className="text-xs font-mono text-neutral-500 hover:text-neutral-300 cursor-pointer">
              Template gallery
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {/* 1. Blank Form (+ Google Style) */}
            <Link
              href="/forms/edit/new"
              className="group flex flex-col space-y-2 cursor-pointer"
            >
              <div className="aspect-[4/3] rounded-2xl bg-[#0e121c] border border-white/15 hover:border-amber-400/70 transition-all duration-200 flex items-center justify-center shadow-lg group-hover:shadow-amber-500/10 group-hover:scale-[1.02] relative overflow-hidden">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 group-hover:bg-amber-400/10 group-hover:border-amber-400/40 flex items-center justify-center transition">
                  <Plus className="w-7 h-7 text-amber-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <span className="text-xs font-medium text-neutral-300 group-hover:text-white truncate">
                Blank form
              </span>
            </Link>

            {/* 2. Contact Information Template */}
            <div
              onClick={() => handleCreateTemplate('contact')}
              className="group flex flex-col space-y-2 cursor-pointer"
            >
              <div className="aspect-[4/3] rounded-2xl bg-[#0e121c] border border-white/10 hover:border-emerald-400/60 transition-all duration-200 p-3 shadow-lg group-hover:scale-[1.02] flex flex-col justify-between">
                <div className="h-2 w-full rounded bg-emerald-500/60" />
                <div className="space-y-1.5 opacity-60">
                  <div className="h-2 w-3/4 rounded bg-white/30" />
                  <div className="h-1.5 w-1/2 rounded bg-white/20" />
                  <div className="h-3 w-full rounded bg-white/10 mt-2" />
                </div>
                <div className="h-1 w-1/4 rounded bg-emerald-400/50" />
              </div>
              <span className="text-xs font-medium text-neutral-300 group-hover:text-white truncate">
                Contact Information
              </span>
            </div>

            {/* 3. Event RSVP Template */}
            <div
              onClick={() => handleCreateTemplate('rsvp')}
              className="group flex flex-col space-y-2 cursor-pointer"
            >
              <div className="aspect-[4/3] rounded-2xl bg-[#0e121c] border border-white/10 hover:border-cyan-400/60 transition-all duration-200 p-3 shadow-lg group-hover:scale-[1.02] flex flex-col justify-between">
                <div className="h-2 w-full rounded bg-cyan-500/60" />
                <div className="space-y-1.5 opacity-60">
                  <div className="h-2 w-2/3 rounded bg-white/30" />
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-cyan-400/40" />
                    <div className="h-2 w-1/2 rounded bg-white/20" />
                  </div>
                </div>
                <div className="h-1 w-1/3 rounded bg-cyan-400/50" />
              </div>
              <span className="text-xs font-medium text-neutral-300 group-hover:text-white truncate">
                Event RSVP
              </span>
            </div>

            {/* 4. Summit & Gala Dinner */}
            <div
              onClick={() => handleCreateTemplate('party')}
              className="group flex flex-col space-y-2 cursor-pointer"
            >
              <div className="aspect-[4/3] rounded-2xl bg-[#0e121c] border border-white/10 hover:border-purple-400/60 transition-all duration-200 p-3 shadow-lg group-hover:scale-[1.02] flex flex-col justify-between">
                <div className="h-2 w-full rounded bg-purple-500/60" />
                <div className="space-y-1.5 opacity-60">
                  <div className="h-2 w-4/5 rounded bg-white/30" />
                  <div className="h-1.5 w-3/5 rounded bg-white/20" />
                </div>
                <div className="h-1 w-1/4 rounded bg-purple-400/50" />
              </div>
              <span className="text-xs font-medium text-neutral-300 group-hover:text-white truncate">
                Summit & Gala Dinner
              </span>
            </div>

            {/* 5. MUN Delegate Registration */}
            <div
              onClick={() => handleCreateTemplate('mun_reg')}
              className="group flex flex-col space-y-2 cursor-pointer"
            >
              <div className="aspect-[4/3] rounded-2xl bg-[#0e121c] border border-white/10 hover:border-amber-400/60 transition-all duration-200 p-3 shadow-lg group-hover:scale-[1.02] flex flex-col justify-between">
                <div className="h-2 w-full rounded bg-amber-500/60" />
                <div className="space-y-1.5 opacity-60">
                  <div className="h-2 w-3/4 rounded bg-white/30" />
                  <div className="h-2 w-1/2 rounded bg-white/20" />
                  <div className="h-2 w-2/3 rounded bg-amber-400/30 mt-2" />
                </div>
                <div className="h-1 w-1/3 rounded bg-amber-400/50" />
              </div>
              <span className="text-xs font-medium text-neutral-300 group-hover:text-white truncate">
                MUN Registration
              </span>
            </div>
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
