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
  Send
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  getPublicForms,
  saveZenForm,
  deleteZenForm,
  getFormSubmissions,
  exportSubmissionsToCsv
} from '@/lib/formsStorage';
import { ZenForm, ZenFormField, ZenFormFieldType, ZenFormTheme, ZenFormSubmission } from '@/types/forms';

export default function ZenFormsHubPage() {
  const [forms, setForms] = useState<ZenForm[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewingSubmissionsForm, setViewingSubmissionsForm] = useState<ZenForm | null>(null);
  const [currentSubmissions, setCurrentSubmissions] = useState<ZenFormSubmission[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Form Builder State
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<ZenForm['category']>('MUN_REGISTRATION');
  const [newTheme, setNewTheme] = useState<ZenFormTheme>('amber');
  const [newFields, setNewFields] = useState<ZenFormField[]>([
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

  useEffect(() => {
    setForms(getPublicForms());
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

  // Field Editor in Modal
  const handleAddField = () => {
    const nextIdx = newFields.length + 1;
    setNewFields([
      ...newFields,
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
    setNewFields(newFields.filter((f) => f.id !== fieldId));
  };

  const handleCreateForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const generatedSlug = (newSlug.trim() || newTitle.trim())
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const newForm: ZenForm = {
      id: `form_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: newTitle.trim(),
      slug: generatedSlug,
      description: newDescription.trim() || 'Official public intake form powered by Zenvitra Sovereign Ledger.',
      category: newCategory,
      theme: newTheme,
      submitButtonText: 'Submit Response',
      successMessage: 'Your response has been cryptographically recorded on the Zenvitra ledger.',
      ownerHandle: 'sovereign_host',
      submissionsCount: 0,
      isPublished: true,
      allowAnonymous: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fields: newFields,
    };

    saveZenForm(newForm);
    refreshForms();
    setIsCreateModalOpen(false);

    // Reset Form
    setNewTitle('');
    setNewSlug('');
    setNewDescription('');
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
              Google Forms &lt;&lt;&lt;&lt;&lt; ZenForms
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
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create New ZenForm</span>
            </button>
          </div>
        </div>

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
                className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-5 group shadow-xl"
              >
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

                  <h3 className="font-bold text-lg text-white group-hover:text-amber-300 transition">
                    {form.title}
                  </h3>

                  <p className="text-xs text-neutral-400 font-sans leading-relaxed line-clamp-2">
                    {form.description}
                  </p>

                  <div className="text-[11px] font-mono text-neutral-500">
                    Fields: {form.fields.length} &bull; Theme: <span className="capitalize text-neutral-300">{form.theme}</span>
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
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenSubmissions(form)}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition flex items-center gap-1.5 cursor-pointer"
                      title="View Received Submissions Table"
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

      {/* ─── CREATE FORM MODAL ─── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-left">
          <div className="w-full max-w-2xl max-h-[90vh] bg-gradient-to-b from-[#11141e] via-[#0a0d14] to-[#04060a] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col relative overflow-hidden space-y-5">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-lg text-white font-display">Create Public ZenForm</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateForm} className="flex-1 overflow-y-auto space-y-4 pr-1 font-sans text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-neutral-300 font-bold">Form Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Jharokha Forum MUN — Delegate Registration"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-neutral-300 font-bold">Custom URL Slug</label>
                  <input
                    type="text"
                    placeholder="e.g. jharokha-delegate-2026"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-neutral-300 font-bold">Theme Style</label>
                  <select
                    value={newTheme}
                    onChange={(e) => setNewTheme(e.target.value as ZenFormTheme)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none font-mono capitalize"
                  >
                    <option value="amber">Amber (Diplomatic Gold)</option>
                    <option value="midnight">Midnight (Deep Blue)</option>
                    <option value="obsidian">Obsidian (Minimalist Dark)</option>
                    <option value="emerald">Emerald (Sovereign Green)</option>
                    <option value="paper">Paper (Crisp Off-White)</option>
                    <option value="purple">Purple (Executive Sovereign)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-neutral-300 font-bold">Description / Guidelines</label>
                <textarea
                  rows={2}
                  placeholder="Describe your event, intake mandate, or rules..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Form Fields Builder */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase font-bold text-amber-300">
                    Form Questions &amp; Intake Fields ({newFields.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddField}
                    className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono transition flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Question</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {newFields.map((field, idx) => (
                    <div
                      key={field.id}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => {
                            const updated = [...newFields];
                            updated[idx].label = e.target.value;
                            setNewFields(updated);
                          }}
                          placeholder="Question title"
                          className="px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs"
                        />

                        <select
                          value={field.type}
                          onChange={(e) => {
                            const updated = [...newFields];
                            updated[idx].type = e.target.value as ZenFormFieldType;
                            setNewFields(updated);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs font-mono"
                        >
                          <option value="text">Short Text</option>
                          <option value="email">Email</option>
                          <option value="tel">Phone / WhatsApp</option>
                          <option value="textarea">Paragraph / Essay</option>
                          <option value="select">Dropdown Menu</option>
                          <option value="number">Number</option>
                        </select>

                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1 text-[11px] text-neutral-400">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => {
                                const updated = [...newFields];
                                updated[idx].required = e.target.checked;
                                setNewFields(updated);
                              }}
                            />
                            <span>Required</span>
                          </label>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveField(field.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-neutral-300 text-xs font-mono transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs font-mono transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Live ZenForm</span>
                </button>
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
                  onClick={() => handleExportCsv(viewingSubmissionsForm)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition flex items-center gap-1"
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
