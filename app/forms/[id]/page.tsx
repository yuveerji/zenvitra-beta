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
  Check,
  Star,
  Heart,
  ThumbsUp,
  Clock,
  Mail,
  Phone,
  Globe,
  UploadCloud,
  PenTool,
  Coins,
  Wrench,
  ChevronUp,
  ChevronDown,
  Award,
  RotateCcw,
  FileText,
  BarChart3,
  Layers,
  ChevronRight,
  QrCode,
  Ticket,
  ShieldCheck
} from 'lucide-react';
import { getZenFormById, recordZenFormSubmission } from '@/lib/formsStorage';
import { registerDelegate } from '@/lib/zenDiplomacyService';
import { ZenForm, ZenFormTheme, ZenFormField } from '@/types/forms';
import { useAuth } from '@/context/AuthContext';
import { getFontCssFamily, CARD_BORDER_RADIUS_MAP } from '@/lib/formsThemes';

export interface FormSection {
  index: number;
  title: string;
  description?: string;
  fields: ZenFormField[];
  stepHeading?: {
    enabled?: boolean;
    stepBadge?: string;
    stepNumber?: string;
    headingTitle?: string;
    description?: string;
  };
}

export default function ZenFormPublicPage() {
  const params = useParams();
  const router = useRouter();
  const { profile, user, isAuthenticated } = useAuth();
  
  const idOrSlug = (params?.id as string) || '';
  const [form, setForm] = useState<ZenForm | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSubId, setSubmittedSubId] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<{ total: number; earned: number; pct: number } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Group fields into pages by section_break
  const sections = React.useMemo<FormSection[]>(() => {
    if (!form) return [];
    const result: FormSection[] = [];
    let current: FormSection = {
      index: 0,
      title: form.title,
      description: form.description,
      fields: [],
      stepHeading: form.fields[0]?.stepHeading?.enabled ? form.fields[0].stepHeading : undefined,
    };

    for (const field of form.fields) {
      if (field.type === 'section_break') {
        result.push(current);
        current = {
          index: result.length,
          title: field.label || field.sectionTitle || `Section ${result.length + 1}`,
          description: field.description || field.sectionDescription || '',
          fields: [],
          stepHeading: field.stepHeading?.enabled ? field.stepHeading : undefined,
        };
      } else {
        current.fields.push(field);
        if (!current.stepHeading && field.stepHeading?.enabled) {
          current.stepHeading = field.stepHeading;
        }
      }
    }
    result.push(current);
    return result;
  }, [form]);

  useEffect(() => {
    if (idOrSlug) {
      const found = getZenFormById(idOrSlug);
      if (found) {
        setForm(found);
      } else {
        fetch(`/api/forms/${idOrSlug}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.form) setForm(data.form);
          })
          .catch(() => {});
      }
    }
  }, [idOrSlug]);

  if (!form) {
    return (
      <div className="min-h-screen bg-[#06080e] text-white flex flex-col items-center justify-center p-4 space-y-4">
        <h1 className="text-2xl font-bold font-display">ZenForm Not Found</h1>
        <p className="text-sm text-neutral-400 max-w-md text-center">
          The requested multilateral form ledger does not exist or has been archived.
        </p>
        <Link
          href="/forms"
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold transition shadow-lg"
        >
          Return to ZenForms Hub
        </Link>
      </div>
    );
  }

  // Theme preset mappings
  const themeStyles: Record<ZenFormTheme, {
    bg: string;
    border: string;
    accent: string;
    text: string;
    glow: string;
    accentHex: string;
    accentText: string;
  }> = {
    amber: {
      bg: 'from-[#131722] via-[#0c0f17] to-[#05070a]',
      border: 'border-amber-500/30',
      accent: 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20',
      text: 'text-amber-400',
      glow: 'bg-amber-500/10',
      accentHex: '#f59e0b',
      accentText: '#000000',
    },
    midnight: {
      bg: 'from-[#071326] via-[#040a14] to-[#02050a]',
      border: 'border-cyan-500/30',
      accent: 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/20',
      text: 'text-cyan-400',
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
    },
    custom: {
      bg: 'from-[#131722] via-[#0c0f17] to-[#05070a]',
      border: 'border-white/20',
      accent: 'bg-amber-500 hover:bg-amber-400 text-black',
      text: 'text-white',
      glow: 'bg-white/10',
      accentHex: '#f59e0b',
      accentText: '#000000',
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

  const handleNextPage = () => {
    const currentSec = sections[currentPageIndex];
    if (!currentSec) return;

    for (const field of currentSec.fields) {
      if (['title_desc', 'image_block', 'video_block', 'section_break'].includes(field.type)) continue;
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

    setValidationError(null);
    setCurrentPageIndex((prev) => Math.min(prev + 1, sections.length - 1));
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    setValidationError(null);
    setCurrentPageIndex((prev) => Math.max(prev - 1, 0));
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If multi-page and not on the last page, act as Next
    if (sections.length > 1 && currentPageIndex < sections.length - 1) {
      handleNextPage();
      return;
    }

    // Check all required fields across all sections
    for (const sec of sections) {
      for (const field of sec.fields) {
        if (['title_desc', 'image_block', 'video_block', 'section_break'].includes(field.type)) continue;
        const val = formData[field.id];
        if (field.required) {
          if (val === undefined || val === null || val === '') {
            setValidationError(`Please complete the required question: "${field.label}"`);
            if (sec.index !== currentPageIndex) {
              setCurrentPageIndex(sec.index);
            }
            return;
          }
          if (Array.isArray(val) && val.length === 0) {
            setValidationError(`Please select at least one option for: "${field.label}"`);
            if (sec.index !== currentPageIndex) {
              setCurrentPageIndex(sec.index);
            }
            return;
          }
        }
      }
    }

    setIsSubmitting(true);
    try {
      const submitter = profile?.username || user?.email?.split('@')[0] || 'anonymous';
      const submission = await recordZenFormSubmission(form.id, formData, submitter);
      setSubmittedSubId(submission.id);

      // If this is the ZEN.DIPLOMACY MUN delegate registration form, record in sovereign delegate ledger
      const isMunForm = 
        form.id === 'zen-diplomacy-2026-registration' ||
        form.id === 'zen-diplomacy-2026' ||
        form.slug === 'zen-diplomacy-2026' ||
        form.category === 'MUN_REGISTRATION' ||
        (form.title && form.title.toLowerCase().includes('diplomacy'));

      if (isMunForm) {
        try {
          await registerDelegate({
            name: formData['step1_fullname'] || submitter || 'Delegate',
            email: formData['step1_email'] || user?.email || '',
            phone: formData['step1_phone'] || '',
            institution: formData['step1_institution'] || '',
            experienceLevel: formData['step2_experience_level'] || '',
            firstCommitteeChoice: formData['step3_primary_committee'] || '',
            secondCommitteeChoice: formData['step4_secondary_committee'] || '',
            portfolioPreferences: formData['step5_portfolios'] || '',
          });
        } catch (munErr) {
          console.warn('[MUN-REGISTRATION-AUTO-SYNC-WARN]', munErr);
        }
      }

      // Calculate Quiz score if Quiz mode
      if (form.settings?.isQuiz) {
        let total = 0;
        let earned = 0;
        form.fields.forEach((f) => {
          if (f.points && f.points > 0) {
            total += f.points;
            const ans = formData[f.id];
            if (Array.isArray(f.correctAnswer)) {
              if (Array.isArray(ans) && ans.length === f.correctAnswer.length && ans.every((x) => f.correctAnswer!.includes(x))) {
                earned += f.points;
              }
            } else if (f.correctAnswer && ans === f.correctAnswer) {
              earned += f.points;
            }
          }
        });
        setQuizScore({ total, earned, pct: total > 0 ? Math.round((earned / total) * 100) : 0 });
      }

      // Background dispatch to Google Sheets webhook
      if (form.googleSheetsConfig?.webhookUrl && form.settings?.autoForwardSheets !== false) {
        try {
          fetch(form.googleSheetsConfig.webhookUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'add_row',
              formId: form.id,
              formTitle: form.title,
              timestamp: new Date().toISOString(),
              submitterHandle: submitter,
              sheetTab: form.googleSheetsConfig.sheetTab || 'ZenForms',
              ...formData,
            }),
          }).catch(() => {});
        } catch {}
      }
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
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            <Shield className="w-3 h-3 text-cyan-400" />
            <span>Sovereign Ledger Protected</span>
          </span>

          <Link
            href={`/forms/${form.slug || form.id}/responses`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-neutral-300 hover:text-white transition"
            title="View Responses on Website"
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Responses</span>
          </Link>

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
        
        {form.acceptingResponses === false ? (
          <div className={`p-8 sm:p-12 ${borderRadiusClass} ${getCardStyleClasses()} text-center space-y-4`}>
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white" style={{ fontFamily: displayFont }}>
              This form is no longer accepting responses
            </h2>
            <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
              Submissions have concluded for this form. If you believe this is an error, please reach out to the form administrator.
            </p>
            <div className="pt-2">
              <Link
                href="/forms"
                className="inline-block px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs transition"
              >
                Return to ZenForms Hub
              </Link>
            </div>
          </div>
        ) : submittedSubId ? (
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

            {/* Quiz Score Result (if Quiz mode enabled) */}
            {quizScore && (
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1.5 max-w-md mx-auto animate-fadeIn">
                <div className="flex items-center justify-center gap-1.5 text-xs font-mono uppercase text-amber-400 font-bold">
                  <Award className="w-4 h-4" />
                  <span>Assessment Score</span>
                </div>
                <div className="text-3xl font-black text-white font-mono">
                  {quizScore.earned} / {quizScore.total}{' '}
                  <span className="text-sm font-normal text-amber-300">({quizScore.pct}%)</span>
                </div>
              </div>
            )}

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/forms/${form.slug || form.id}/responses`}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition flex items-center justify-center gap-2 border border-white/10 shadow-sm"
              >
                <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                <span>See Previous Responses</span>
              </Link>

              {(form.settings?.showSubmitAnotherLink ?? true) && (
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedSubId(null);
                    setFormData({});
                    setQuizScore(null);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-mono text-xs transition cursor-pointer"
                >
                  Submit Another Response
                </button>
              )}
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

            {/* ── Progress Bar (if enabled in settings) ── */}
            {(() => {
              if (form.settings?.showProgressBar === false) return null;
              const nonContent = form.fields.filter(
                (f) => !['title_desc', 'image_block', 'video_block', 'section_break'].includes(f.type)
              );
              const done = nonContent.filter((f) => {
                const v = formData[f.id];
                if (v === undefined || v === null || v === '') return false;
                if (Array.isArray(v) && v.length === 0) return false;
                return true;
              }).length;
              const pct = nonContent.length > 0 ? Math.round((done / nonContent.length) * 100) : 0;
              return (
                <div className="border-b border-white/10 bg-white/[0.02]">
                  <div className="px-6 sm:px-10 py-2.5 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                    <div className="flex items-center gap-2">
                      <span>Intake Progress</span>
                      {sections.length > 1 && (
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-white font-bold text-[10px]">
                          Page {currentPageIndex + 1} of {sections.length}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span>{done} of {nonContent.length} answered</span>
                      <div className="w-20 sm:w-28 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct}%`, backgroundColor: accentColor }}
                        />
                      </div>
                      <span className="text-white font-bold">{pct}%</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="p-6 sm:p-10 space-y-8">
              {/* Form Title & Description Header (Page 1 vs Page 2+) */}
              {currentPageIndex === 0 ? (
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

                    {sections.length > 1 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-white text-[10px] font-mono font-bold">
                        Section 1 of {sections.length}
                      </span>
                    )}

                    <span className="inline-flex sm:hidden items-center gap-1 text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                      <Shield className="w-2.5 h-2.5 text-cyan-400" />
                      <span>Sovereign Ledger</span>
                    </span>
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

                  {/* Top Step Headings Ribbon for Step 1 */}
                  {sections[0]?.stepHeading?.enabled && (
                    <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/[0.08] via-white/[0.02] to-transparent border border-amber-500/30 space-y-2 relative overflow-hidden shadow-lg animate-fadeIn text-left">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span 
                          className="px-3 py-1 rounded-full text-black font-mono text-[10px] font-black uppercase tracking-wider shadow-sm"
                          style={{ backgroundColor: accentColor }}
                        >
                          {sections[0].stepHeading.stepBadge || 'STEP 1'}
                        </span>
                        {sections[0].stepHeading.stepNumber && (
                          <span className="text-amber-300 font-mono text-xs font-semibold uppercase tracking-wider">
                            {sections[0].stepHeading.stepNumber}
                          </span>
                        )}
                        <span className="text-neutral-500 text-xs font-mono ml-auto">
                          Page 1 of {sections.length}
                        </span>
                      </div>
                      {sections[0].stepHeading.headingTitle && (
                        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight" style={{ fontFamily: displayFont }}>
                          {sections[0].stepHeading.headingTitle}
                        </h2>
                      )}
                      {sections[0].stepHeading.description && (
                        <p className="text-xs text-neutral-300 leading-relaxed font-normal">
                          {sections[0].stepHeading.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* Page 2+ Section Header with Top Step Headings Ribbon */
                <div className="space-y-4 border-b border-white/10 pb-6 relative animate-fadeIn text-left">
                  {sections[currentPageIndex]?.stepHeading?.enabled ? (
                    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/[0.08] via-white/[0.02] to-transparent border border-amber-500/30 space-y-2.5 relative overflow-hidden shadow-lg">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span 
                          className="px-3 py-1 rounded-full text-black font-mono text-[10px] font-black uppercase tracking-wider shadow-sm"
                          style={{ backgroundColor: accentColor }}
                        >
                          {sections[currentPageIndex].stepHeading?.stepBadge || `STEP ${currentPageIndex + 1}`}
                        </span>
                        {sections[currentPageIndex].stepHeading?.stepNumber && (
                          <span className="text-amber-300 font-mono text-xs font-semibold uppercase tracking-wider">
                            {sections[currentPageIndex].stepHeading?.stepNumber}
                          </span>
                        )}
                        <span className="text-neutral-500 text-xs font-mono ml-auto">
                          Page {currentPageIndex + 1} of {sections.length}
                        </span>
                      </div>
                      <h2
                        className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight"
                        style={{ fontFamily: displayFont }}
                      >
                        {sections[currentPageIndex].stepHeading?.headingTitle || sections[currentPageIndex]?.title}
                      </h2>
                      {(sections[currentPageIndex].stepHeading?.description || sections[currentPageIndex]?.description) && (
                        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                          {sections[currentPageIndex].stepHeading?.description || sections[currentPageIndex]?.description}
                        </p>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-2">
                        <div
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider border"
                          style={{
                            backgroundColor: `${accentColor}15`,
                            borderColor: `${accentColor}40`,
                            color: accentColor,
                          }}
                        >
                          <Layers className="w-3 h-3" />
                          <span>Section {currentPageIndex + 1} of {sections.length}</span>
                        </div>
                        <span className="text-[11px] font-mono text-neutral-400 truncate max-w-[200px]">
                          {form.title}
                        </span>
                      </div>

                      <h2
                        className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight"
                        style={{ fontFamily: displayFont }}
                      >
                        {sections[currentPageIndex]?.title}
                      </h2>

                      {sections[currentPageIndex]?.description && (
                        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                          {sections[currentPageIndex]?.description}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Validation Notice */}
              {validationError && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-mono animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Fields List for Current Section / Page */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {(sections[currentPageIndex]?.fields || []).map((field) => {
                  // 1. Title & Description Block
                  if (field.type === 'title_desc') {
                    if (field.id === 'step15_payment_instruction' || field.label?.toLowerCase().includes('upi payment')) {
                      return (
                        <div key={field.id} className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-amber-500/[0.12] via-[#090d18] to-black border border-amber-500/30 space-y-5 shadow-2xl relative overflow-hidden text-left">
                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3.5">
                            <div className="flex items-center gap-2 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
                              <QrCode className="w-4 h-4 text-amber-400" />
                              <span>Official Foundation UPI Payment Gateway</span>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold">
                              Zero Surcharge &bull; Instant Verification
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
                            {/* Visual QR Card */}
                            <div className="p-3.5 rounded-2xl bg-white flex flex-col items-center justify-center text-center shadow-xl mx-auto sm:mx-0 w-36 h-36">
                              <QrCode className="w-24 h-24 text-black" />
                              <span className="font-mono text-[9px] font-black text-black uppercase tracking-wider mt-1">zenvitra@upi</span>
                            </div>

                            {/* Beneficiary Details & 1-Click Copy */}
                            <div className="sm:col-span-2 space-y-3 font-mono">
                              <div>
                                <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Beneficiary Entity:</span>
                                <p className="text-white font-bold text-sm sm:text-base font-display">ZENVITRA FOUNDATION</p>
                              </div>

                              <div className="space-y-1">
                                <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Official VPA / UPI ID:</span>
                                <div className="flex items-center gap-2">
                                  <div className="px-3.5 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-bold select-all flex-1 truncate font-mono">
                                    zenvitra@upi
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (typeof window !== 'undefined') {
                                        navigator.clipboard.writeText('zenvitra@upi');
                                        setCopiedUpi(true);
                                        setTimeout(() => setCopiedUpi(false), 2000);
                                      }
                                    }}
                                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-md"
                                  >
                                    {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    <span>{copiedUpi ? 'Copied!' : 'Copy UPI'}</span>
                                  </button>
                                </div>
                              </div>

                              <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                                Pay via Google Pay, PhonePe, Paytm, or BHIM. After payment, enter your <strong className="text-white font-mono">12-Digit UTR Number</strong> in the field below to verify and lock your seat.
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={field.id} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                        <h3 className="text-lg sm:text-xl font-bold text-white" style={{ fontFamily: displayFont }}>
                          {field.label}
                        </h3>
                        {field.description && (
                          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                            {field.description}
                          </p>
                        )}
                      </div>
                    );
                  }

                  // 2. Image Block
                  if (field.type === 'image_block') {
                    return (
                      <div key={field.id} className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden space-y-3 p-4">
                        {field.mediaUrl && (
                          <img src={field.mediaUrl} alt={field.label} className="w-full rounded-xl object-cover max-h-96" />
                        )}
                        {field.label && <h4 className="text-sm font-semibold text-white px-1">{field.label}</h4>}
                        {field.description && <p className="text-xs text-neutral-400 px-1">{field.description}</p>}
                      </div>
                    );
                  }

                  // 3. Video Block
                  if (field.type === 'video_block') {
                    let embedUrl = '';
                    if (field.videoUrl) {
                      const match = field.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
                      if (match && match[1]) embedUrl = `https://www.youtube-nocookie.com/embed/${match[1]}`;
                    }
                    return (
                      <div key={field.id} className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden space-y-3 p-4">
                        {embedUrl && (
                          <div className="aspect-video w-full rounded-xl overflow-hidden">
                            <iframe src={embedUrl} title={field.label} className="w-full h-full border-0" allowFullScreen />
                          </div>
                        )}
                        {field.label && <h4 className="text-sm font-semibold text-white px-1">{field.label}</h4>}
                      </div>
                    );
                  }

                  // 4. Section Break
                  if (field.type === 'section_break') {
                    return (
                      <div key={field.id} className="pt-6 border-t-2 border-dashed border-white/20 my-6">
                        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200">
                          <h4 className="text-base font-bold uppercase tracking-wider">{field.label}</h4>
                          {field.description && <p className="text-xs text-neutral-300 pt-1">{field.description}</p>}
                        </div>
                      </div>
                    );
                  }

                  // Standard & Advanced Question Cards
                  return (
                    <div key={field.id} className="space-y-2 p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <label className="text-xs sm:text-sm font-medium text-white flex items-center gap-1.5 flex-1">
                          <span>{field.label}</span>
                          {field.required && <span className="text-rose-400 font-bold">*</span>}
                        </label>

                        {form.settings?.isQuiz && field.points !== undefined && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold shrink-0">
                            {field.points} pts
                          </span>
                        )}
                      </div>

                      {field.description && (
                        <p className="text-[11px] text-neutral-400 font-normal leading-relaxed">
                          {field.description}
                        </p>
                      )}

                      {/* 1. Short Text */}
                      {(field.type === 'text' || field.type === 'short_answer') && (
                        <input
                          type="text"
                          placeholder={field.placeholder || 'Your answer'}
                          value={formData[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400/80 text-white text-xs sm:text-sm focus:outline-none transition shadow-inner font-sans"
                        />
                      )}

                      {/* 2. Email */}
                      {field.type === 'email' && (
                        <div className="relative">
                          <input
                            type="email"
                            placeholder={field.placeholder || 'email@example.com'}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400/80 text-white text-xs sm:text-sm focus:outline-none transition shadow-inner font-sans"
                          />
                          <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5 pointer-events-none" />
                        </div>
                      )}

                      {/* 3. Telephone / Phone */}
                      {(field.type === 'tel' || field.type === 'phone') && (
                        <div className="relative">
                          <input
                            type="tel"
                            placeholder={field.placeholder || '+1 (555) 000-0000'}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400/80 text-white text-xs sm:text-sm focus:outline-none transition shadow-inner font-mono"
                          />
                          <Phone className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5 pointer-events-none" />
                        </div>
                      )}

                      {/* 4. Website / URL */}
                      {field.type === 'url' && (
                        <div className="relative">
                          <input
                            type="url"
                            placeholder={field.placeholder || 'https://...'}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400/80 text-white text-xs sm:text-sm focus:outline-none transition shadow-inner font-sans"
                          />
                          <Globe className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5 pointer-events-none" />
                        </div>
                      )}

                      {/* 5. Number */}
                      {field.type === 'number' && (
                        <input
                          type="number"
                          placeholder={field.placeholder || '0'}
                          value={formData[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400/80 text-white text-xs sm:text-sm focus:outline-none transition shadow-inner font-mono"
                        />
                      )}

                      {/* 6. Date */}
                      {field.type === 'date' && (
                        <div className="relative">
                          <input
                            type="date"
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400/80 text-white text-xs sm:text-sm focus:outline-none transition shadow-inner font-mono cursor-pointer"
                          />
                        </div>
                      )}

                      {/* 7. Time */}
                      {field.type === 'time' && (
                        <div className="relative">
                          <input
                            type="time"
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400/80 text-white text-xs sm:text-sm focus:outline-none transition shadow-inner font-mono cursor-pointer"
                          />
                        </div>
                      )}

                      {/* 8. Paragraph / Textarea */}
                      {(field.type === 'textarea' || field.type === 'paragraph') && (
                        <textarea
                          rows={3}
                          placeholder={field.placeholder || 'Enter your detailed thoughts...'}
                          value={formData[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400/80 text-white text-xs sm:text-sm focus:outline-none transition shadow-inner leading-relaxed font-sans"
                        />
                      )}

                      {/* 9. Linear Scale (Likert) */}
                      {field.type === 'linear_scale' && (
                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between gap-1 sm:gap-2">
                            {Array.from({
                              length: (field.scaleMax ?? 5) - (field.scaleMin ?? 1) + 1,
                            }).map((_, i) => {
                              const val = (field.scaleMin ?? 1) + i;
                              const isSelected = formData[field.id] === val;
                              return (
                                <button
                                  type="button"
                                  key={val}
                                  onClick={() => handleInputChange(field.id, val)}
                                  className={`flex-1 py-3 sm:py-3.5 rounded-xl border font-mono text-xs sm:text-sm font-bold transition flex items-center justify-center cursor-pointer ${
                                    isSelected
                                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400/30 scale-105'
                                      : 'border-white/10 bg-black/40 text-neutral-300 hover:border-white/25 hover:bg-white/5'
                                  }`}
                                  style={isSelected ? { borderColor: accentColor, color: accentColor } : {}}
                                >
                                  {val}
                                </button>
                              );
                            })}
                          </div>
                          {(field.scaleMinLabel || field.scaleMaxLabel) && (
                            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 px-1">
                              <span>{field.scaleMinLabel || ''}</span>
                              <span>{field.scaleMaxLabel || ''}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 10. Rating (Stars / Hearts / Numbers) */}
                      {field.type === 'rating' && (
                        <div className="flex items-center gap-2 pt-2">
                          {Array.from({ length: field.ratingMax ?? 5 }).map((_, i) => {
                            const starVal = i + 1;
                            const isFilled = (formData[field.id] || 0) >= starVal;
                            return (
                              <button
                                type="button"
                                key={starVal}
                                onClick={() => handleInputChange(field.id, starVal)}
                                className="p-2 rounded-xl transition hover:scale-125 cursor-pointer"
                              >
                                {field.ratingIcon === 'heart' ? (
                                  <Heart
                                    className={`w-7 h-7 transition ${
                                      isFilled ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'
                                    }`}
                                    style={isFilled ? { fill: accentColor, color: accentColor } : {}}
                                  />
                                ) : field.ratingIcon === 'thumb' ? (
                                  <ThumbsUp
                                    className={`w-7 h-7 transition ${
                                      isFilled ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'
                                    }`}
                                    style={isFilled ? { fill: accentColor, color: accentColor } : {}}
                                  />
                                ) : field.ratingIcon === 'number' ? (
                                  <span
                                    className={`w-8 h-8 rounded-xl font-mono text-xs flex items-center justify-center font-bold border transition ${
                                      isFilled
                                        ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                                        : 'bg-black/40 text-neutral-400 border-white/10'
                                    }`}
                                  >
                                    {starVal}
                                  </span>
                                ) : (
                                  <Star
                                    className={`w-7 h-7 transition ${
                                      isFilled ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'
                                    }`}
                                    style={isFilled ? { fill: accentColor, color: accentColor } : {}}
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* 11. Ranking (Preference Order) */}
                      {field.type === 'ranking' && (
                        <div className="space-y-2 pt-1">
                          <p className="text-[11px] font-mono text-neutral-400">Use arrows to prioritize items from top to bottom:</p>
                          {(() => {
                            const currentOrder: string[] = formData[field.id] || field.options || ['Item 1', 'Item 2', 'Item 3'];
                            return currentOrder.map((item, itemIdx) => (
                              <div
                                key={item}
                                className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-sans text-white"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="w-5 h-5 rounded bg-amber-500/20 text-amber-300 font-mono text-[11px] font-bold flex items-center justify-center">
                                    #{itemIdx + 1}
                                  </span>
                                  <span>{item}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    disabled={itemIdx === 0}
                                    onClick={() => {
                                      const next = [...currentOrder];
                                      const tmp = next[itemIdx];
                                      next[itemIdx] = next[itemIdx - 1];
                                      next[itemIdx - 1] = tmp;
                                      handleInputChange(field.id, next);
                                    }}
                                    className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white disabled:opacity-20"
                                  >
                                    <ChevronUp className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={itemIdx === currentOrder.length - 1}
                                    onClick={() => {
                                      const next = [...currentOrder];
                                      const tmp = next[itemIdx];
                                      next[itemIdx] = next[itemIdx + 1];
                                      next[itemIdx + 1] = tmp;
                                      handleInputChange(field.id, next);
                                    }}
                                    className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white disabled:opacity-20"
                                  >
                                    <ChevronDown className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ));
                          })()}
                        </div>
                      )}

                      {/* 12. File Upload */}
                      {field.type === 'file_upload' && (
                        <div className="pt-2">
                          <label className="p-6 rounded-2xl border-2 border-dashed border-white/20 bg-white/[0.02] hover:bg-white/[0.04] transition flex flex-col items-center justify-center gap-2 cursor-pointer text-center">
                            <UploadCloud className="w-8 h-8 text-neutral-400" />
                            <span className="text-xs font-medium text-white">
                              {formData[field.id] ? `Selected: ${formData[field.id]}` : 'Click or drop files here to attach'}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-500">
                              Max file size: {field.maxFileSizeMb ?? 10} MB &bull; PDF, Images, Documents
                            </span>
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleInputChange(field.id, file.name);
                              }}
                            />
                          </label>
                        </div>
                      )}

                      {/* 13. Digital Signature */}
                      {field.type === 'signature' && (
                        <div className="space-y-2 pt-2">
                          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                            <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                              <span className="font-bold flex items-center gap-1.5">
                                <PenTool className="w-3.5 h-3.5" />
                                <span>Sign Legal Attestation</span>
                              </span>
                              {formData[field.id] && (
                                <button
                                  type="button"
                                  onClick={() => handleInputChange(field.id, '')}
                                  className="text-[10px] text-neutral-400 hover:text-white underline"
                                >
                                  Clear
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              placeholder="Type your full legal name or sovereign handle as signature"
                              value={formData[field.id] || ''}
                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                              className="w-full px-4 py-3 rounded-lg bg-black/60 border border-emerald-500/20 text-emerald-200 text-sm font-serif italic outline-none focus:border-emerald-400"
                            />
                            <p className="text-[10px] font-mono text-neutral-400">
                              By typing your name, you attest under sovereign ledger protocols that this response is authentic.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* 14. Web3 Wallet Address */}
                      {field.type === 'wallet_address' && (
                        <div className="relative pt-1">
                          <input
                            type="text"
                            placeholder="0x... or Solana / Ledger public address"
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-purple-500/30 focus:border-purple-400 text-purple-200 text-xs sm:text-sm font-mono focus:outline-none transition shadow-inner"
                          />
                          <Coins className="w-4 h-4 text-purple-400 absolute left-3.5 top-4 pointer-events-none" />
                        </div>
                      )}

                      {/* 15. Custom Configurable Field */}
                      {field.type === 'custom' && (
                        <div className="flex items-center rounded-xl bg-black/40 border border-white/15 focus-within:border-amber-400/80 overflow-hidden shadow-inner">
                          {field.customPrefix && (
                            <span className="px-3 text-xs font-mono text-amber-400 bg-white/5 border-r border-white/10 select-none">
                              {field.customPrefix}
                            </span>
                          )}
                          <input
                            type={field.customInputType || 'text'}
                            placeholder={field.customPlaceholder || 'Enter value...'}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="flex-1 px-4 py-3 bg-transparent text-white text-xs sm:text-sm focus:outline-none font-sans"
                          />
                        </div>
                      )}

                      {/* 16. Dropdown Select */}
                      {(field.type === 'select' || field.type === 'dropdown') && (
                        <select
                          value={formData[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400/80 text-white text-xs sm:text-sm focus:outline-none transition cursor-pointer font-sans"
                        >
                          <option value="" disabled>Select an option...</option>
                          {(field.options || []).map((opt) => (
                            <option key={opt} value={opt} className="bg-[#0e111a] text-white">
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}

                      {/* 17. Multiple Choice / Radio Options */}
                      {(field.type === 'radio' || field.type === 'multiple_choice') && (
                        field.id === 'step15_participation_tier' ? (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
                            {(field.options || []).map((opt) => {
                              const isSelected = formData[field.id] === opt;
                              const isDelegate = opt.includes('Delegate Pass') && !opt.includes('Double');
                              const isObserver = opt.includes('Observer') || opt.includes('Participant');
                              const isDouble = opt.includes('Double');

                              const tierTitle = isDelegate
                                ? 'Delegate Pass'
                                : isObserver
                                ? 'Participant / Observer Pass'
                                : 'Executive Double Pass';

                              const tierPrice = isDelegate ? '₹499' : isObserver ? '₹199' : '₹899';
                              const tierUsd = isDelegate ? '$6 USD' : isObserver ? '$2.5 USD' : '$11 USD';
                              const tierBadge = isDelegate
                                ? 'RECOMMENDED • OFFICIAL'
                                : isObserver
                                ? 'ENTRY LEVEL PASS'
                                : 'DUAL DIPLOMATS';

                              const tierPerks = isDelegate
                                ? [
                                    'Full Parliamentary & Voting Rights',
                                    'Speaking Floor & Unmoderated Caucus',
                                    'Official Placard & Dossier',
                                    'All Awards Contention (Best Del)',
                                    'Sovereign Blockchain Credential',
                                  ]
                                : isObserver
                                ? [
                                    'Plenary Observation Access',
                                    'Moderated Caucus Attendance',
                                    'Official Observer Certificate',
                                    'Diplomatic Masterclass Entry',
                                    'Delegate Networking Access',
                                  ]
                                : [
                                    'Paired Seat for 2 Diplomats',
                                    'Dual Placards & Official Dossiers',
                                    'Working Paper Co-Sponsorship',
                                    'Joint Best Delegation Contention',
                                    'Dual Verified Credentials',
                                  ];

                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => handleInputChange(field.id, opt)}
                                  className={`relative text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
                                    isSelected
                                      ? 'bg-gradient-to-b from-white/[0.12] to-white/[0.04] border-amber-400/80 shadow-[0_0_30px_rgba(251,191,36,0.18)] scale-[1.02]'
                                      : 'bg-[#090d16]/70 border-white/10 hover:border-white/25 hover:bg-white/[0.04]'
                                  }`}
                                >
                                  {/* Top badge */}
                                  <div className="flex items-center justify-between gap-2 mb-3">
                                    <span
                                      className={`text-[9px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full font-bold border ${
                                        isSelected
                                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                                          : isDelegate
                                          ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                                          : isObserver
                                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                          : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                                      }`}
                                    >
                                      {tierBadge}
                                    </span>
                                    <div
                                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition shrink-0 ${
                                        isSelected
                                          ? 'border-amber-400 bg-amber-400 text-black'
                                          : 'border-white/20 group-hover:border-white/40'
                                      }`}
                                    >
                                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                                    </div>
                                  </div>

                                  {/* Title & Price */}
                                  <div className="space-y-1 mb-4">
                                    <h4 className="font-display font-bold text-white text-base leading-tight">
                                      {tierTitle}
                                    </h4>
                                    <div className="flex items-baseline gap-1.5 pt-1">
                                      <span className="text-2xl font-black text-white font-mono tracking-tight">
                                        {tierPrice}
                                      </span>
                                      <span className="text-[11px] text-neutral-400 font-mono">
                                        / {tierUsd}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Perk list */}
                                  <ul className="space-y-1.5 pt-3 border-t border-white/10 text-xs font-sans text-neutral-300">
                                    {tierPerks.map((perk) => (
                                      <li key={perk} className="flex items-start gap-2 text-[11px] leading-snug">
                                        <span className="text-amber-400 font-bold shrink-0 mt-0.5">&bull;</span>
                                        <span>{perk}</span>
                                      </li>
                                    ))}
                                  </ul>

                                  {/* Selection indicator footer */}
                                  <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono flex items-center justify-between">
                                    <span className={isSelected ? 'text-amber-300 font-bold' : 'text-neutral-500'}>
                                      {isSelected ? '✓ Pass Selected' : 'Click to Select Pass'}
                                    </span>
                                    <Ticket className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-neutral-500'}`} />
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
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

                          {field.hasOtherOption && (
                            <div className="flex items-center gap-3 p-2">
                              <span className="text-xs text-neutral-400">Other:</span>
                              <input
                                type="text"
                                placeholder="Your answer"
                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white outline-none"
                              />
                            </div>
                          )}
                        </div>
                      ))}

                      {/* 18. Checkboxes / Multi-select Options */}
                      {(field.type === 'checkbox' || field.type === 'checkboxes') && (
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

                          {field.hasOtherOption && (
                            <div className="flex items-center gap-3 p-2">
                              <span className="text-xs text-neutral-400">Other:</span>
                              <input
                                type="text"
                                placeholder="Your answer"
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val) handleCheckboxToggle(field.id, `Other: ${val}`);
                                }}
                                className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white outline-none"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sovereign Ledger Intake &bull; Zero Tracking</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Back Button for Multi-page sections */}
                    {sections.length > 1 && currentPageIndex > 0 && (
                      <button
                        type="button"
                        onClick={handlePrevPage}
                        className="px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer border border-white/20 bg-white/5 hover:bg-white/10 text-white font-mono"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                    )}

                    {/* Next Button if more sections exist */}
                    {sections.length > 1 && currentPageIndex < sections.length - 1 ? (
                      <button
                        type="button"
                        onClick={handleNextPage}
                        className="flex-1 sm:flex-initial px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xl active:scale-95"
                        style={{
                          backgroundColor: accentColor,
                          color: accentTextColor,
                          boxShadow: `0 8px 25px ${accentColor}35`,
                        }}
                      >
                        <span>Continue to Page {currentPageIndex + 2}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      /* Final Submit Button */
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-initial px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xl active:scale-95 disabled:opacity-50"
                        style={{
                          backgroundColor: accentColor,
                          color: accentTextColor,
                          boxShadow: `0 8px 25px ${accentColor}35`,
                        }}
                      >
                        <Send className="w-4 h-4" />
                        <span>{isSubmitting ? 'Recording...' : (form.submitButtonText || 'Submit Response')}</span>
                      </button>
                    )}
                  </div>
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
