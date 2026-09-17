'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  Share2,
  ArrowLeft,
  Sparkles,
  Shield,
  Send,
  Lock,
  Copy,
  Building2,
  AlertCircle
} from 'lucide-react';
import { getZenFormById, recordZenFormSubmission } from '@/lib/formsStorage';
import { ZenForm, ZenFormTheme, ZenFormField } from '@/types/forms';
import { useAuth } from '@/context/AuthContext';

export default function PublicFormFillingPage() {
  const params = useParams();
  const router = useRouter();
  const { profile, user, isAuthenticated } = useAuth();
  
  const idOrSlug = (params?.id as string) || '';
  const [form, setForm] = useState<ZenForm | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSubId, setSubmittedSubId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (idOrSlug) {
      const found = getZenFormById(idOrSlug);
      setForm(found);
    }
  }, [idOrSlug]);

  if (!form) {
    return (
      <div className="min-h-screen bg-[#06080e] text-white flex flex-col items-center justify-center p-4 space-y-4">
        <h1 className="text-2xl font-bold font-display">ZenForm Not Found</h1>
        <p className="text-sm text-neutral-400 max-w-md text-center">
          The requested form link does not exist or may have been removed from the public ledger.
        </p>
        <Link
          href="/forms"
          className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs font-mono"
        >
          View All ZenForms
        </Link>
      </div>
    );
  }

  const themeStyles: Record<ZenFormTheme, { bg: string; border: string; accent: string; text: string; glow: string }> = {
    amber: {
      bg: 'from-[#0e121a] via-[#090c12] to-[#040608]',
      border: 'border-amber-500/30',
      accent: 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20',
      text: 'text-amber-300',
      glow: 'bg-amber-500/10'
    },
    midnight: {
      bg: 'from-[#080f1e] via-[#050913] to-[#020408]',
      border: 'border-cyan-500/30',
      accent: 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/20',
      text: 'text-cyan-300',
      glow: 'bg-cyan-500/10'
    },
    obsidian: {
      bg: 'from-[#111111] via-[#090909] to-[#020202]',
      border: 'border-white/20',
      accent: 'bg-white hover:bg-neutral-200 text-black shadow-white/10',
      text: 'text-white',
      glow: 'bg-white/5'
    },
    emerald: {
      bg: 'from-[#071710] via-[#040f0a] to-[#020604]',
      border: 'border-emerald-500/30',
      accent: 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20',
      text: 'text-emerald-300',
      glow: 'bg-emerald-500/10'
    },
    paper: {
      bg: 'from-[#18191c] via-[#121316] to-[#0c0d0f]',
      border: 'border-neutral-300/30',
      accent: 'bg-neutral-100 hover:bg-white text-black shadow-neutral-500/10',
      text: 'text-neutral-200',
      glow: 'bg-neutral-200/5'
    },
    purple: {
      bg: 'from-[#150a21] via-[#0d0614] to-[#050209]',
      border: 'border-purple-500/30',
      accent: 'bg-purple-500 hover:bg-purple-400 text-white shadow-purple-500/20',
      text: 'text-purple-300',
      glow: 'bg-purple-500/10'
    }
  };

  const currentTheme = themeStyles[form.theme || 'amber'];

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    setValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check required fields
    for (const field of form.fields) {
      if (field.required && (!formData[field.id] || String(formData[field.id]).trim() === '')) {
        setValidationError(`Please complete the required question: "${field.label}"`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const submitter = profile?.username || user?.email?.split('@')[0] || 'anonymous';
      const submission = await recordZenFormSubmission(form.id, formData, submitter);
      setSubmittedSubId(submission.id);
    } catch {
      setValidationError('Failed to record submission. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${currentTheme.bg} text-neutral-200 font-sans p-4 sm:p-8 flex flex-col justify-between relative overflow-hidden selection:bg-white/20 text-left`}>
      
      {/* Background Glow */}
      <div className={`absolute top-0 right-1/4 w-[500px] h-[500px] ${currentTheme.glow} blur-[140px] pointer-events-none rounded-full`} />

      {/* Top Header Bar */}
      <div className="max-w-2xl mx-auto w-full flex items-center justify-between py-4 border-b border-white/10 relative z-10">
        <Link
          href="/forms"
          className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All ZenForms Hub</span>
        </Link>

        <button
          type="button"
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-neutral-300 transition cursor-pointer"
        >
          {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copiedLink ? 'Link Copied!' : 'Share Form'}</span>
        </button>
      </div>

      {/* Main Form Box */}
      <main className="max-w-2xl mx-auto w-full my-8 relative z-10 space-y-6">
        
        {/* If successfully submitted */}
        {submittedSubId ? (
          <div className={`p-8 sm:p-12 rounded-3xl bg-black/60 border ${currentTheme.border} shadow-2xl text-center space-y-6 animate-fade-in`}>
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                Submission Confirmed
              </h2>
              <p className="text-sm text-neutral-300 font-sans max-w-md mx-auto leading-relaxed">
                {form.successMessage || 'Your response has been cryptographically recorded on the Zenvitra ledger.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 max-w-md mx-auto text-left font-mono text-xs space-y-1">
              <div className="text-[10px] text-neutral-500 uppercase">Verification Reference ID</div>
              <div className="text-emerald-400 font-bold truncate">{submittedSubId}</div>
              <div className="text-[10px] text-neutral-500 pt-1">
                Recorded: {new Date().toLocaleString()} &bull; Zero Surveillance Guarantee
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSubmittedSubId(null);
                  setFormData({});
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition cursor-pointer"
              >
                Submit Another Response
              </button>
              <Link
                href="/forms"
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl ${currentTheme.accent} font-mono text-xs font-bold transition flex items-center justify-center gap-1.5`}
              >
                <span>Return to ZenForms Hub</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Form Entry Form */
          <div className={`p-6 sm:p-10 rounded-3xl bg-black/60 border ${currentTheme.border} shadow-2xl space-y-8 backdrop-blur-xl`}>
            
            {/* Form Title & Description Header */}
            <div className="space-y-3 border-b border-white/10 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase font-bold tracking-wider text-neutral-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{form.category.replace('_', ' ')}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
                {form.title}
              </h1>
              {form.description && (
                <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
                  {form.description}
                </p>
              )}
            </div>

            {/* Validation Notice */}
            {validationError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-mono animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Fields List */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {form.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5">
                    <span>{field.label}</span>
                    {field.required && <span className="text-rose-400 font-bold">*</span>}
                  </label>

                  {/* Field Input Elements */}
                  {field.type === 'text' && (
                    <input
                      type="text"
                      placeholder={field.placeholder || 'Your answer'}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/15 focus:border-white/40 text-white text-xs sm:text-sm focus:outline-none transition shadow-inner font-sans"
                    />
                  )}

                  {field.type === 'email' && (
                    <input
                      type="email"
                      placeholder={field.placeholder || 'email@example.com'}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/15 focus:border-white/40 text-white text-xs sm:text-sm focus:outline-none transition shadow-inner font-sans"
                    />
                  )}

                  {field.type === 'tel' && (
                    <input
                      type="tel"
                      placeholder={field.placeholder || '+91 98765 43210'}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/15 focus:border-white/40 text-white text-xs sm:text-sm focus:outline-none transition shadow-inner font-sans"
                    />
                  )}

                  {field.type === 'number' && (
                    <input
                      type="number"
                      placeholder={field.placeholder || '0'}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/15 focus:border-white/40 text-white text-xs sm:text-sm focus:outline-none transition shadow-inner font-sans"
                    />
                  )}

                  {field.type === 'textarea' && (
                    <textarea
                      rows={3}
                      placeholder={field.placeholder || 'Enter your detailed thoughts...'}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/15 focus:border-white/40 text-white text-xs sm:text-sm focus:outline-none transition shadow-inner font-sans leading-relaxed"
                    />
                  )}

                  {field.type === 'select' && (
                    <select
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[#0e111a] border border-white/15 focus:border-white/40 text-white text-xs sm:text-sm focus:outline-none transition cursor-pointer font-sans"
                    >
                      <option value="" disabled>Select an option...</option>
                      {(field.options || []).map((opt) => (
                        <option key={opt} value={opt} className="bg-[#0e111a] text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}

              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sovereign Intake &bull; Zero Tracking</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl ${currentTheme.accent} font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 disabled:opacity-50`}
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Recording...' : (form.submitButtonText || 'Submit Response')}</span>
                </button>
              </div>
            </form>

          </div>
        )}

      </main>

      {/* Sovereign Guarantee Footer */}
      <div className="max-w-2xl mx-auto w-full text-center py-6 text-[11px] font-mono text-neutral-500 border-t border-white/10">
        <span>Powered by <strong>ZenForms</strong> &bull; The Sovereign Multilateral Intake Engine</span>
      </div>

    </div>
  );
}
