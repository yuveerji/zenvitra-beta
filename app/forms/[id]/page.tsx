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
  AlertCircle,
  FileSpreadsheet,
  Calendar,
  Check
} from 'lucide-react';
import { getZenFormById, recordZenFormSubmission } from '@/lib/formsStorage';
import { ZenForm, ZenFormTheme, ZenFormField } from '@/types/forms';
import { useAuth } from '@/context/AuthContext';
import { getFontCssFamily, CARD_BORDER_RADIUS_MAP } from '@/lib/formsThemes';

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

  const themeStyles: Record<string, { bg: string; border: string; accent: string; text: string; glow: string; accentHex: string; accentText: string }> = {
    amber: {
      bg: 'from-[#0e121a] via-[#090c12] to-[#040608]',
      border: 'border-amber-500/30',
      accent: 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20',
      text: 'text-amber-300',
      glow: 'bg-amber-500/10',
      accentHex: '#f59e0b',
      accentText: '#000000',
    },
    midnight: {
      bg: 'from-[#080f1e] via-[#050913] to-[#020408]',
      border: 'border-cyan-500/30',
      accent: 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/20',
      text: 'text-cyan-300',
      glow: 'bg-cyan-500/10',
      accentHex: '#06b6d4',
      accentText: '#000000',
    },
    obsidian: {
      bg: 'from-[#111111] via-[#090909] to-[#020202]',
      border: 'border-white/20',
      accent: 'bg-white hover:bg-neutral-200 text-black shadow-white/10',
      text: 'text-white',
      glow: 'bg-white/5',
      accentHex: '#ffffff',
      accentText: '#000000',
    },
    emerald: {
      bg: 'from-[#071710] via-[#040f0a] to-[#020604]',
      border: 'border-emerald-500/30',
      accent: 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20',
      text: 'text-emerald-300',
      glow: 'bg-emerald-500/10',
      accentHex: '#10b981',
      accentText: '#000000',
    },
    paper: {
      bg: 'from-[#18191c] via-[#121316] to-[#0c0d0f]',
      border: 'border-neutral-300/30',
      accent: 'bg-neutral-100 hover:bg-white text-black shadow-neutral-500/10',
      text: 'text-neutral-200',
      glow: 'bg-neutral-200/5',
      accentHex: '#e5e5e5',
      accentText: '#000000',
    },
    purple: {
      bg: 'from-[#150a21] via-[#0d0614] to-[#050209]',
      border: 'border-purple-500/30',
      accent: 'bg-purple-500 hover:bg-purple-400 text-white shadow-purple-500/20',
      text: 'text-purple-300',
      glow: 'bg-purple-500/10',
      accentHex: '#8b5cf6',
      accentText: '#ffffff',
    }
  };

  const currentTheme = themeStyles[form.theme] || themeStyles.amber;

  // Custom typography and styling
  const custom = form.customStyle || {};
  const displayFont = getFontCssFamily(custom.displayFont || 'Space Grotesk');
  const bodyFont = getFontCssFamily(custom.bodyFont || 'Inter');
  const accentColor = custom.accentColor || currentTheme.accentHex;
  const accentTextColor = custom.accentTextColor || currentTheme.accentText;
  const borderRadiusClass = CARD_BORDER_RADIUS_MAP[custom.borderRadius || 'xl'] || 'rounded-3xl';
  const ambientEffect = custom.ambientEffect || 'aurora';

  // Card glass style classes
  const getCardStyleClasses = () => {
    switch (custom.cardStyle) {
      case 'glass-frosted':
        return 'bg-white/[0.05] backdrop-blur-2xl border border-white/20 shadow-2xl';
      case 'cyber-neon':
        return 'bg-black/80 backdrop-blur-xl border shadow-2xl';
      case 'solid-dark':
        return 'bg-[#0a0c10] border border-white/10 shadow-2xl';
      case 'outline-minimal':
        return 'bg-black/30 backdrop-blur-md border-2 border-white/20 shadow-none';
      case 'glass-deep':
      default:
        return 'bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl';
    }
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    setValidationError(null);
  };

  const handleCheckboxToggle = (fieldId: string, option: string) => {
    const currentList: string[] = Array.isArray(formData[fieldId]) ? formData[fieldId] : [];
    const nextList = currentList.includes(option)
      ? currentList.filter((item) => item !== option)
      : [...currentList, option];
    handleInputChange(fieldId, nextList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check required fields
    for (const field of form.fields) {
      const val = formData[field.id];
      if (field.required) {
        if (val === undefined || val === null || val === '') {
          setValidationError(`Please complete the required question: "${field.label}"`);
          return;
        }
        if (Array.isArray(val) && val.length === 0) {
          setValidationError(`Please select at least one option for: "${field.label}"`);
          return;
        }
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
    <div
      className="min-h-screen text-neutral-200 p-4 sm:p-8 flex flex-col justify-between relative overflow-x-hidden selection:bg-white/20 text-left transition-colors duration-500"
      style={{
        fontFamily: bodyFont,
        backgroundColor: custom.bgType === 'solid' ? (custom.bgSolidColor || '#06080e') : undefined,
        background: custom.bgType === 'gradient' && custom.bgGradient ? custom.bgGradient : undefined,
      }}
    >
      {/* ── Gradient Background fallback ── */}
      {(!custom.bgType || custom.bgType === 'gradient') && !custom.bgGradient && (
        <div className={`fixed inset-0 pointer-events-none z-0 bg-gradient-to-b ${currentTheme.bg}`} />
      )}

      {/* ── Background Image Layer (if configured) ── */}
      {custom.bgType === 'image' && custom.bgImageUrl && (
        <div
          className="fixed inset-0 pointer-events-none bg-cover bg-center z-0 transition-opacity"
          style={{
            backgroundImage: `url(${custom.bgImageUrl})`,
            filter: `blur(${custom.bgBlur || 0}px)`,
            transform: custom.bgBlur ? 'scale(1.05)' : undefined,
          }}
        />
      )}

      {/* ── Background Overlay Tint ── */}
      {custom.bgType === 'image' && (
        <div
          className="fixed inset-0 pointer-events-none z-0 bg-black"
          style={{ opacity: (custom.bgOverlayOpacity ?? 75) / 100 }}
        />
      )}

      {/* ── Ambient Effects ── */}
      {ambientEffect === 'aurora' && (
        <>
          <div
            className="fixed top-0 right-1/4 w-[550px] h-[550px] blur-[150px] pointer-events-none rounded-full z-0 opacity-70 animate-pulse"
            style={{ backgroundColor: `${accentColor}25` }}
          />
          <div
            className="fixed bottom-10 left-10 w-[450px] h-[450px] blur-[140px] pointer-events-none rounded-full z-0 opacity-50"
            style={{ backgroundColor: `${accentColor}15` }}
          />
        </>
      )}

      {ambientEffect === 'grid' && (
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-15"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      )}

      {ambientEffect === 'dots' && (
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      )}

      {/* ── Top Header Bar ── */}
      <div className="max-w-2xl mx-auto w-full flex items-center justify-between py-4 border-b border-white/10 relative z-10">
        <Link
          href="/forms"
          className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All ZenForms Hub</span>
        </Link>

        <div className="flex items-center gap-2">
          {form.googleSheetsConfig?.isConnected && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <FileSpreadsheet className="w-3 h-3" />
              <span>Google Sheets Linked</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-neutral-300 transition cursor-pointer"
          >
            {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* ── Main Form Box ── */}
      <main className="max-w-2xl mx-auto w-full my-8 relative z-10 space-y-6">
        
        {/* If successfully submitted */}
        {submittedSubId ? (
          <div className={`p-8 sm:p-12 ${borderRadiusClass} ${getCardStyleClasses()} text-center space-y-6 animate-fade-in`}>
            <div
              className="w-16 h-16 rounded-full mx-auto flex items-center justify-center border"
              style={{
                backgroundColor: `${accentColor}20`,
                borderColor: `${accentColor}50`,
                color: accentColor,
              }}
            >
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2
                className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
                style={{ fontFamily: displayFont }}
              >
                Submission Confirmed
              </h2>
              <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                {form.successMessage || 'Your response has been cryptographically recorded on the Zenvitra ledger.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 max-w-md mx-auto text-left font-mono text-xs space-y-1">
              <div className="text-[10px] text-neutral-500 uppercase">Verification Reference ID</div>
              <div className="font-bold truncate" style={{ color: accentColor }}>{submittedSubId}</div>
              <div className="text-[10px] text-neutral-500 pt-1">
                Recorded: {new Date().toLocaleString()} &bull; Sovereign Ledger
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
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md"
                style={{
                  backgroundColor: accentColor,
                  color: accentTextColor,
                }}
              >
                <span>Return to ZenForms Hub</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Form Entry Card */
          <div
            className={`overflow-hidden ${borderRadiusClass} ${getCardStyleClasses()} transition-all`}
            style={{
              borderColor: custom.cardStyle === 'cyber-neon' ? `${accentColor}60` : undefined,
              boxShadow: custom.cardStyle === 'cyber-neon' ? `0 0 35px ${accentColor}25` : undefined,
            }}
          >
            {/* ── Optional Cover Image ── */}
            {custom.coverImageUrl && (
              <div className="w-full h-44 sm:h-56 overflow-hidden relative border-b border-white/10">
                <img
                  src={custom.coverImageUrl}
                  alt={form.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
            )}

            <div className="p-6 sm:p-10 space-y-8">
              {/* Form Title & Description Header */}
              <div className="space-y-4 border-b border-white/10 pb-6 relative">
                {/* Optional Logo / Crest */}
                {custom.logoUrl && (
                  <div className="w-16 h-16 rounded-2xl p-1 bg-black/60 border border-white/20 shadow-xl overflow-hidden mb-2">
                    <img
                      src={custom.logoUrl}
                      alt="Form Crest"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider border"
                    style={{
                      backgroundColor: `${accentColor}15`,
                      borderColor: `${accentColor}40`,
                      color: accentColor,
                    }}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{form.category.replace('_', ' ')}</span>
                  </div>

                  {form.googleSheetsConfig?.isConnected && (
                    <span className="inline-flex sm:hidden items-center gap-1 text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <FileSpreadsheet className="w-2.5 h-2.5" />
                      <span>Sheets Connected</span>
                    </span>
                  )}
                </div>

                <h1
                  className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight"
                  style={{ fontFamily: displayFont }}
                >
                  {form.title}
                </h1>

                {form.description && (
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
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
                    <label className="text-xs sm:text-sm font-medium text-white flex items-center gap-1.5">
                      <span>{field.label}</span>
                      {field.required && <span className="text-rose-400 font-bold">*</span>}
                    </label>

                    {field.description && (
                      <p className="text-[11px] text-neutral-400 font-normal">
                        {field.description}
                      </p>
                    )}

                    {/* Short Text */}
                    {field.type === 'text' && (
                      <input
                        type="text"
                        placeholder={field.placeholder || 'Your answer'}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/15 focus:border-white/40 text-white text-xs sm:text-sm focus:outline-none transition shadow-inner"
                      />
                    )}

                    {/* Email */}
                    {field.type === 'email' && (
                      <input
                        type="email"
                        placeholder={field.placeholder || 'email@example.com'}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/15 focus:border-white/40 text-white text-xs sm:text-sm focus:outline-none transition shadow-inner"
                      />
                    )}

                    {/* Telephone */}
                    {field.type === 'tel' && (
                      <input
                        type="tel"
                        placeholder={field.placeholder || '+91 98765 43210'}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/15 focus:border-white/40 text-white text-xs sm:text-sm focus:outline-none transition shadow-inner"
                      />
                    )}

                    {/* Number */}
                    {field.type === 'number' && (
                      <input
                        type="number"
                        placeholder={field.placeholder || '0'}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/15 focus:border-white/40 text-white text-xs sm:text-sm focus:outline-none transition shadow-inner"
                      />
                    )}

                    {/* Date */}
                    {field.type === 'date' && (
                      <div className="relative">
                        <input
                          type="date"
                          value={formData[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl bg-[#0e111a] border border-white/15 focus:border-white/40 text-white text-xs sm:text-sm focus:outline-none transition shadow-inner font-mono"
                        />
                      </div>
                    )}

                    {/* Paragraph / Textarea */}
                    {field.type === 'textarea' && (
                      <textarea
                        rows={3}
                        placeholder={field.placeholder || 'Enter your detailed thoughts...'}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/15 focus:border-white/40 text-white text-xs sm:text-sm focus:outline-none transition shadow-inner leading-relaxed"
                      />
                    )}

                    {/* Dropdown Select */}
                    {field.type === 'select' && (
                      <select
                        value={formData[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-[#0e111a] border border-white/15 focus:border-white/40 text-white text-xs sm:text-sm focus:outline-none transition cursor-pointer"
                      >
                        <option value="" disabled>Select an option...</option>
                        {(field.options || []).map((opt) => (
                          <option key={opt} value={opt} className="bg-[#0e111a] text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* Radio Options */}
                    {field.type === 'radio' && (
                      <div className="space-y-2 pt-1">
                        {(field.options && field.options.length > 0 ? field.options : ['Option 1', 'Option 2']).map((opt) => (
                          <label
                            key={opt}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition cursor-pointer ${
                              formData[field.id] === opt
                                ? 'bg-white/10 border-white/40'
                                : 'bg-white/[0.02] border-white/10 hover:bg-white/5'
                            }`}
                          >
                            <input
                              type="radio"
                              name={field.id}
                              value={opt}
                              checked={formData[field.id] === opt}
                              onChange={() => handleInputChange(field.id, opt)}
                              className="hidden"
                            />
                            <div
                              className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0"
                              style={{
                                borderColor: formData[field.id] === opt ? accentColor : 'rgba(255,255,255,0.3)',
                                backgroundColor: formData[field.id] === opt ? accentColor : 'transparent',
                              }}
                            >
                              {formData[field.id] === opt && (
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentTextColor }} />
                              )}
                            </div>
                            <span className="text-xs sm:text-sm text-neutral-200">{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Checkbox Options */}
                    {field.type === 'checkbox' && (
                      <div className="space-y-2 pt-1">
                        {(field.options && field.options.length > 0 ? field.options : ['Option 1', 'Option 2']).map((opt) => {
                          const isChecked = Array.isArray(formData[field.id]) && formData[field.id].includes(opt);
                          return (
                            <label
                              key={opt}
                              onClick={() => handleCheckboxToggle(field.id, opt)}
                              className={`flex items-center gap-3 p-3 rounded-xl border transition cursor-pointer ${
                                isChecked
                                  ? 'bg-white/10 border-white/40'
                                  : 'bg-white/[0.02] border-white/10 hover:bg-white/5'
                              }`}
                            >
                              <div
                                className="w-4 h-4 rounded-md border flex items-center justify-center shrink-0"
                                style={{
                                  borderColor: isChecked ? accentColor : 'rgba(255,255,255,0.3)',
                                  backgroundColor: isChecked ? accentColor : 'transparent',
                                }}
                              >
                                {isChecked && (
                                  <Check className="w-3 h-3" style={{ color: accentTextColor }} />
                                )}
                              </div>
                              <span className="text-xs sm:text-sm text-neutral-200">{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}

                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sovereign Ledger Intake &bull; Zero Tracking</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xl active:scale-95 disabled:opacity-50"
                    style={{
                      backgroundColor: accentColor,
                      color: accentTextColor,
                      boxShadow: `0 8px 25px ${accentColor}35`,
                    }}
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Recording...' : (form.submitButtonText || 'Submit Response')}</span>
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </main>

      {/* ── Sovereign Guarantee Footer ── */}
      <div className="max-w-2xl mx-auto w-full text-center py-6 text-[11px] font-mono text-neutral-500 border-t border-white/10 relative z-10">
        <span>Powered by <strong className="text-neutral-300">ZenForms</strong> &bull; The Sovereign Multilateral Intake Engine</span>
      </div>

    </div>
  );
}
