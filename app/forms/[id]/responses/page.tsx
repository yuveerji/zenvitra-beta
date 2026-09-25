'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Share2,
  RefreshCw,
  BarChart3,
  CheckCircle2,
  FileSpreadsheet,
  Award,
  Search,
  ExternalLink,
  Copy,
  Clock,
  User,
  Star,
  Heart,
  ThumbsUp,
  ListOrdered,
  PenTool,
  Coins,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { ZenForm, ZenFormField, ZenFormSubmission } from '@/types/forms';
import { getZenFormById, fetchFormSubmissions } from '@/lib/formsStorage';
import { getFontCssFamily } from '@/lib/formsThemes';

export default function ZenFormsPublicResponsesPage() {
  const params = useParams();
  const router = useRouter();
  const idOrSlug = (params?.id as string) || '';

  const [form, setForm] = useState<ZenForm | null>(null);
  const [submissions, setSubmissions] = useState<ZenFormSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [textSearchQuery, setTextSearchQuery] = useState<Record<string, string>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  // Load Form & Live Submissions
  const loadData = async () => {
    setIsRefreshing(true);
    try {
      // 1. Resolve form
      let currentForm = getZenFormById(idOrSlug);
      if (!currentForm) {
        try {
          const res = await fetch(`/api/forms/${idOrSlug}`);
          if (res.ok) {
            const data = await res.json();
            if (data.form) currentForm = data.form;
          }
        } catch (_) {}
      }

      if (currentForm) {
        setForm(currentForm);
        // 2. Fetch live submissions from server & local storage
        const liveSubs = await fetchFormSubmissions(currentForm.id);
        setSubmissions(liveSubs);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (idOrSlug) {
      loadData();
    }
  }, [idOrSlug]);

  // Accent & Font styles
  const defaultAccents: Record<string, string> = {
    amber: '#f59e0b',
    midnight: '#06b6d4',
    obsidian: '#ffffff',
    emerald: '#10b981',
    paper: '#e5e5e5',
    purple: '#8b5cf6',
  };
  const custom = form?.customStyle || {};
  const accentColor = custom.accentColor || defaultAccents[form?.theme || 'amber'] || '#f59e0b';
  const accentTextColor = custom.accentTextColor || '#000000';
  const displayFont = getFontCssFamily(custom.displayFont || 'Clash Display');
  const bodyFont = getFontCssFamily(custom.bodyFont || 'Inter');

  // Calculate Quiz Statistics if applicable
  const quizStats = useMemo(() => {
    if (!form?.settings?.isQuiz || submissions.length === 0) return null;
    let totalPossible = 0;
    form.fields.forEach((f) => {
      if (f.correctAnswer) totalPossible += f.points || form.settings?.defaultPointsPerQuestion || 5;
    });
    if (totalPossible === 0) return null;

    let totalEarned = 0;
    submissions.forEach((sub) => {
      form.fields.forEach((f) => {
        if (f.correctAnswer && sub.data[f.id]) {
          const userAns = sub.data[f.id];
          const isCorrect = Array.isArray(userAns)
            ? JSON.stringify(userAns.sort()) === JSON.stringify((f.correctAnswer as any).sort())
            : String(userAns).trim().toLowerCase() === String(f.correctAnswer).trim().toLowerCase();
          if (isCorrect) {
            totalEarned += f.points || form.settings?.defaultPointsPerQuestion || 5;
          }
        }
      });
    });

    const avgEarned = Math.round(totalEarned / submissions.length);
    const avgPct = Math.round((avgEarned / totalPossible) * 100);

    return { totalPossible, avgEarned, avgPct };
  }, [form, submissions]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
        <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
          Loading Live Responses...
        </p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center p-4 space-y-4 text-center">
        <h2 className="text-2xl font-bold font-display">Form Not Found</h2>
        <p className="text-sm text-neutral-400 max-w-sm">
          The requested form does not exist or has been removed from the ledger.
        </p>
        <Link
          href="/forms"
          className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition"
        >
          Return to ZenForms Hub
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-neutral-200 p-4 sm:p-8 flex flex-col justify-between relative overflow-x-hidden selection:bg-white/20 text-left transition-colors duration-500"
      style={{
        fontFamily: bodyFont,
        backgroundColor: custom.bgType === 'solid' ? (custom.bgSolidColor || '#07090e') : '#07090e',
        background: custom.bgType === 'gradient' && custom.bgGradient ? custom.bgGradient : undefined,
      }}
    >
      {/* Background Ambience */}
      <div
        className="fixed top-0 right-1/4 w-[550px] h-[550px] blur-[160px] pointer-events-none rounded-full z-0 opacity-40 animate-pulse"
        style={{ backgroundColor: `${accentColor}20` }}
      />
      <div
        className="fixed bottom-10 left-10 w-[450px] h-[450px] blur-[150px] pointer-events-none rounded-full z-0 opacity-30"
        style={{ backgroundColor: `${accentColor}10` }}
      />

      {/* Top Header Navigation Bar */}
      <header className="max-w-4xl lg:max-w-5xl mx-auto w-full z-10 flex items-center justify-between pb-6 sm:pb-8 border-b border-white/10 px-2 sm:px-0">
        <div className="flex items-center gap-3">
          <Link
            href={`/forms/${form.slug || form.id}`}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-300 hover:text-white transition flex items-center gap-1.5 text-xs font-mono"
            title="Back to form"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Fill Form</span>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono uppercase tracking-wider font-bold">
                Live Responses
              </span>
              {form.acceptingResponses === false && (
                <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-mono">
                  Closed
                </span>
              )}
            </div>
            <h1
              className="text-lg sm:text-xl font-bold text-white tracking-tight pt-1 truncate max-w-md"
              style={{ fontFamily: displayFont }}
            >
              {form.title}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            disabled={isRefreshing}
            className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-300 hover:text-white transition flex items-center gap-1.5 text-xs font-mono disabled:opacity-50"
            title="Refresh responses"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopiedLink(true);
              setTimeout(() => setCopiedLink(false), 2000);
            }}
            className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-300 hover:text-white transition flex items-center gap-1.5 text-xs font-mono"
            title="Copy share link"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
          </button>

          {/* Direct Link to Form Editor for Owner */}
          <Link
            href={`/forms/edit/${form.id}`}
            className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-lg"
            style={{
              backgroundColor: accentColor,
              color: accentTextColor,
            }}
          >
            <span>Form Studio</span>
          </Link>
        </div>
      </header>

      {/* Main Analytics Content */}
      <main className="max-w-4xl lg:max-w-5xl mx-auto w-full z-10 py-8 space-y-6">
        {/* Overview Stats Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0e111a]/90 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Accent border strip */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{ backgroundColor: accentColor }}
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                {submissions.length}
              </span>
              <span className="text-xs font-mono text-neutral-400 block uppercase tracking-wider">
                Total Submissions Recorded
              </span>
              <p className="text-xs text-neutral-400 pt-1">
                Real-time ledger entries synced across website & Google Sheets
              </p>
            </div>

            {/* Quiz Average Score Banner if applicable */}
            {quizStats && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400 font-bold uppercase">
                  <Award className="w-3.5 h-3.5" />
                  <span>Average Assessment Score</span>
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {quizStats.avgEarned} / {quizStats.totalPossible}{' '}
                  <span className="text-xs font-normal text-amber-300">({quizStats.avgPct}%)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {submissions.length === 0 ? (
          <div className="p-12 sm:p-16 rounded-3xl bg-[#0e111a]/80 backdrop-blur-xl border border-white/10 text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-neutral-400">
              <BarChart3 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white font-display">No Responses Yet</h3>
            <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
              This form is actively waiting for its first submission. Fill out the form or share the public link with participants to see real-time charts and responses populate here.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Link
                href={`/forms/${form.slug || form.id}`}
                className="px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition shadow-lg"
                style={{
                  backgroundColor: accentColor,
                  color: accentTextColor,
                }}
              >
                Be the First to Respond
              </Link>
            </div>
          </div>
        ) : (
          /* Question By Question Analytics Breakdown */
          <div className="space-y-6">
            {form.fields
              .filter((field) => !['title_desc', 'image_block', 'video_block', 'section_break'].includes(field.type))
              .map((field, qIdx) => {
                // Determine field question answers
                const allAnswers = submissions
                  .map((s) => ({
                    subId: s.id,
                    submittedAt: s.submittedAt,
                    submitter: s.submitterHandle || 'Anonymous',
                    value: s.data[field.id],
                  }))
                  .filter((item) => item.value !== undefined && item.value !== null && item.value !== '');

                const answerCount = allAnswers.length;

                return (
                  <div
                    key={field.id}
                    className="p-6 sm:p-8 rounded-3xl bg-[#0e111a]/90 backdrop-blur-xl border border-white/10 shadow-xl space-y-6"
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">
                            Question {qIdx + 1} &bull; {field.type.replace('_', ' ')}
                          </span>
                          {field.points && field.points > 0 && (
                            <span className="px-2 py-0.2 text-[10px] rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-bold">
                              {field.points} pts
                            </span>
                          )}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                          {field.label}
                        </h3>
                      </div>
                      <span className="text-xs font-mono text-neutral-400 shrink-0 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                        {answerCount} {answerCount === 1 ? 'response' : 'responses'}
                      </span>
                    </div>

                    {/* RENDER ANALYTICS BASED ON QUESTION TYPE */}

                    {/* 1. Choice Questions (Multiple Choice, Checkboxes, Dropdown, Radio, Select) */}
                    {['multiple_choice', 'checkboxes', 'dropdown', 'radio', 'checkbox', 'select'].includes(field.type) && (
                      <div className="space-y-3 pt-1">
                        {(() => {
                          const options = field.options || [];
                          const counts: Record<string, number> = {};
                          options.forEach((opt) => (counts[opt] = 0));
                          let otherCount = 0;

                          allAnswers.forEach((ans) => {
                            if (Array.isArray(ans.value)) {
                              ans.value.forEach((v) => {
                                if (counts[v] !== undefined) counts[v] += 1;
                                else otherCount += 1;
                              });
                            } else if (ans.value) {
                              if (counts[ans.value] !== undefined) counts[ans.value] += 1;
                              else otherCount += 1;
                            }
                          });

                          return (
                            <div className="space-y-3">
                              {options.map((opt) => {
                                const count = counts[opt] || 0;
                                const pct = answerCount > 0 ? Math.round((count / answerCount) * 100) : 0;
                                const isCorrect = field.correctAnswer === opt;

                                return (
                                  <div key={opt} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-neutral-200 font-medium">{opt}</span>
                                        {isCorrect && (
                                          <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[9px] font-mono font-bold">
                                            ✓ Correct
                                          </span>
                                        )}
                                      </div>
                                      <span className="font-mono text-neutral-400 font-bold">
                                        {count} ({pct}%)
                                      </span>
                                    </div>
                                    <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden relative">
                                      <div
                                        className="h-full rounded-full transition-all duration-700"
                                        style={{
                                          width: `${pct}%`,
                                          backgroundColor: isCorrect ? '#10b981' : accentColor,
                                        }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}

                              {otherCount > 0 && (
                                <div className="space-y-1.5 pt-1">
                                  <div className="flex items-center justify-between text-xs text-neutral-400">
                                    <span>Other write-in responses</span>
                                    <span className="font-mono">
                                      {otherCount} ({Math.round((otherCount / answerCount) * 100)}%)
                                    </span>
                                  </div>
                                  <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                                    <div
                                      className="h-full rounded-full bg-neutral-400 transition-all duration-700"
                                      style={{ width: `${Math.round((otherCount / answerCount) * 100)}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* 2. Linear Scale & Rating Questions */}
                    {['linear_scale', 'rating'].includes(field.type) && (
                      <div className="space-y-4 pt-1">
                        {(() => {
                          const maxVal = field.type === 'linear_scale' ? (field.scaleMax || 5) : (field.ratingMax || 5);
                          const minVal = field.type === 'linear_scale' ? (field.scaleMin || 1) : 1;
                          const counts: Record<number, number> = {};
                          for (let i = minVal; i <= maxVal; i++) counts[i] = 0;

                          let sum = 0;
                          allAnswers.forEach((ans) => {
                            const num = Number(ans.value);
                            if (!isNaN(num) && num >= minVal && num <= maxVal) {
                              counts[num] = (counts[num] || 0) + 1;
                              sum += num;
                            }
                          });

                          const avg = answerCount > 0 ? (sum / answerCount).toFixed(1) : '0.0';

                          return (
                            <div className="space-y-4">
                              {/* Average Badge */}
                              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 w-fit">
                                <div className="text-2xl font-black text-white font-mono">{avg}</div>
                                <div className="text-[11px] font-mono text-neutral-400">
                                  <span>Average Score out of {maxVal}</span>
                                  {field.type === 'rating' && (
                                    <div className="flex items-center gap-0.5 text-amber-400 pt-0.5">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Scale Distribution */}
                              <div className="space-y-2 pt-2">
                                {Object.keys(counts).map((key) => {
                                  const ratingNum = Number(key);
                                  const count = counts[ratingNum] || 0;
                                  const pct = answerCount > 0 ? Math.round((count / answerCount) * 100) : 0;

                                  return (
                                    <div key={ratingNum} className="flex items-center gap-3 text-xs font-mono">
                                      <span className="w-6 text-neutral-300 font-bold">{ratingNum}</span>
                                      <div className="flex-1 h-2.5 rounded-full bg-white/10 overflow-hidden">
                                        <div
                                          className="h-full rounded-full transition-all duration-700"
                                          style={{
                                            width: `${pct}%`,
                                            backgroundColor: accentColor,
                                          }}
                                        />
                                      </div>
                                      <span className="w-16 text-right text-neutral-400">
                                        {count} ({pct}%)
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>

                              {field.scaleMinLabel && field.scaleMaxLabel && (
                                <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono pt-1">
                                  <span>{minVal} = {field.scaleMinLabel}</span>
                                  <span>{maxVal} = {field.scaleMaxLabel}</span>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* 3. Ranking Questions */}
                    {field.type === 'ranking' && (
                      <div className="space-y-3 pt-1">
                        <p className="text-xs text-neutral-400">
                          Order of preference ranked across respondents:
                        </p>
                        <div className="space-y-2">
                          {(field.options || []).map((opt, i) => (
                            <div
                              key={opt}
                              className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="w-5 h-5 rounded-md bg-white/10 text-white font-mono font-bold flex items-center justify-center text-[10px]">
                                  {i + 1}
                                </span>
                                <span className="text-neutral-200">{opt}</span>
                              </div>
                              <span className="text-[11px] font-mono text-neutral-400">
                                Option {i + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 4. Text & Contact Questions (Short Answer, Paragraph, Email, Phone, URL, Custom) */}
                    {[
                      'short_answer',
                      'paragraph',
                      'text',
                      'textarea',
                      'email',
                      'phone',
                      'tel',
                      'url',
                      'number',
                      'date',
                      'time',
                      'custom',
                      'wallet_address',
                      'signature'
                    ].includes(field.type) && (
                      <div className="space-y-3 pt-1">
                        {/* Search in text responses if > 4 */}
                        {allAnswers.length > 4 && (
                          <div className="relative">
                            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="Search within answers..."
                              value={textSearchQuery[field.id] || ''}
                              onChange={(e) =>
                                setTextSearchQuery({ ...textSearchQuery, [field.id]: e.target.value })
                              }
                              className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 outline-none font-mono"
                            />
                          </div>
                        )}

                        <div className="max-h-64 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                          {allAnswers
                            .filter((item) => {
                              const q = (textSearchQuery[field.id] || '').toLowerCase();
                              if (!q) return true;
                              return String(item.value).toLowerCase().includes(q);
                            })
                            .map((item, idx) => (
                              <div
                                key={item.subId + idx}
                                className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition space-y-1"
                              >
                                <div className="text-xs text-neutral-200 whitespace-pre-wrap font-sans leading-relaxed">
                                  {field.type === 'signature' ? (
                                    <span className="italic font-serif text-amber-300 text-sm">
                                      ✍️ {String(item.value)}
                                    </span>
                                  ) : field.type === 'wallet_address' ? (
                                    <span className="font-mono text-emerald-400 text-xs break-all">
                                      {String(item.value)}
                                    </span>
                                  ) : (
                                    String(item.value)
                                  )}
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-0.5">
                                  <span>{item.submitter}</span>
                                  <span>{new Date(item.submittedAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="max-w-4xl mx-auto w-full z-10 pt-8 border-t border-white/10 text-center text-xs font-mono text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <span>Zenvitra Sovereign Forms</span> &bull; <span>Live Response Ledger</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/forms/${form.slug || form.id}`} className="hover:text-white transition">
            Fill Form
          </Link>
          <Link href="/forms" className="hover:text-white transition">
            ZenForms Hub
          </Link>
        </div>
      </footer>
    </div>
  );
}
