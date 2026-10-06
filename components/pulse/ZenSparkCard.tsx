'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Bookmark, 
  Heart, 
  Share2, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  FileText, 
  Check, 
  ArrowRight,
  Sparkles,
  Copy,
  ScrollText,
  Scale
} from 'lucide-react';
import { ZenSpark } from '@/types/sparks';

interface ZenSparkCardProps {
  spark: ZenSpark;
  onBookmark?: (id: string) => void;
  onOpenFlex?: (spark: ZenSpark) => void;
  isBookmarked?: boolean;
}

export function ZenSparkCard({ spark, onBookmark, onOpenFlex, isBookmarked = false }: ZenSparkCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [likesCount, setLikesCount] = useState(spark.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [saved, setSaved] = useState(isBookmarked);
  const [copied, setCopied] = useState(false);

  // Parse fullDossier into preamble and numbered clauses
  const parsedDossier = useMemo(() => {
    const raw = spark.fullDossier || '';
    if (!raw.trim()) return { preamble: '', clauses: [] };

    const parts = raw.split(/(?=\n\s*\d+\.\s+[A-Z\s&/—–-]+)/);
    const preamble = parts[0]?.trim() || '';
    const clauses = parts.slice(1).map((chunk) => {
      const trimmed = chunk.trim();
      const firstLineEnd = trimmed.indexOf('\n');
      const headerLine = firstLineEnd !== -1 ? trimmed.substring(0, firstLineEnd).trim() : trimmed;
      const body = firstLineEnd !== -1 ? trimmed.substring(firstLineEnd).trim() : '';

      const match = headerLine.match(/^(\d+)\.\s*(.*)$/);
      return {
        number: match ? match[1].padStart(2, '0') : '',
        title: match ? match[2] : headerLine,
        body: body,
      };
    }).filter((c) => c.title || c.body);

    return { preamble, clauses };
  }, [spark.fullDossier]);

  const handleLike = () => {
    if (hasLiked) {
      setLikesCount((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleToggleBookmark = () => {
    setSaved(!saved);
    if (onBookmark) onBookmark(spark.id);
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/pulse?spark=${spark.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="rounded-2xl sm:rounded-3xl bg-[#07080c] border border-white/10 hover:border-white/25 p-5 sm:p-6 text-left space-y-4 shadow-xl transition-all duration-300 relative overflow-hidden group">
      {/* Top clean subtle border highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Header Info */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {/* Reading Time Tag */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 font-sans text-[11px] font-bold tracking-wide">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>⚡ {spark.readingTimeMinutes} min read • {spark.category}</span>
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-zinc-400 font-sans font-medium">
          <span>{spark.createdAt}</span>
        </div>
      </div>

      {/* Title & Summary */}
      <div className="space-y-2">
        <h3 className="font-display font-extrabold text-base sm:text-lg text-white tracking-tight leading-snug group-hover:text-amber-200 transition-colors">
          {spark.title}
        </h3>
        <p className="text-xs sm:text-[13px] text-zinc-300 leading-relaxed font-sans font-normal">
          {spark.summary}
        </p>
      </div>

      {/* Key Takeaways Box */}
      <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800/80 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 uppercase tracking-wider font-sans">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Key Takeaways</span>
        </div>
        <ul className="space-y-1.5 text-xs text-zinc-300 font-sans">
          {spark.keyTakeaways.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Expandable Full Dossier Text */}
      {isExpanded && (
        <div className="pt-3 border-t border-amber-500/20 space-y-3.5 text-xs text-zinc-300 leading-relaxed font-sans animate-in fade-in duration-200">
          {/* Diplomatic Header Bar */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/[0.08] via-purple-500/[0.05] to-transparent border border-amber-500/20 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-pulse" />
              <span className="text-[11px] font-sans uppercase tracking-wider text-amber-300 font-bold">
                RATIFIED DIPLOMATIC DOSSIER
              </span>
            </div>

            {spark.treatyClauseReference && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-amber-500/30 text-xs font-sans text-amber-200 font-medium">
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>Treaty: <strong>{spark.treatyClauseReference}</strong></span>
              </div>
            )}
          </div>

          {/* Executive Preamble */}
          {parsedDossier.preamble && (
            <div className="p-3.5 rounded-xl bg-white/[0.02] border-l-2 border-l-amber-400 border-y border-r border-white/5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-sans text-zinc-400 uppercase tracking-wider font-bold">
                <ScrollText className="w-3.5 h-3.5 text-amber-400" />
                <span>Executive Preamble & Context</span>
              </div>
              <p className="text-zinc-200 text-xs sm:text-[13px] leading-relaxed font-normal italic">
                "{parsedDossier.preamble}"
              </p>
            </div>
          )}

          {/* Structured Clauses */}
          {parsedDossier.clauses.length > 0 ? (
            <div className="space-y-2.5">
              {parsedDossier.clauses.map((clause, cIdx) => (
                <div
                  key={cIdx}
                  className="p-3.5 rounded-2xl bg-[#0b0d14] border border-white/10 hover:border-cyan-500/30 transition-all space-y-2 group shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-sans text-[11px] font-bold tracking-wide">
                        CLAUSE {clause.number || `0${cIdx + 1}`}
                      </span>
                      <h4 className="font-bold text-xs sm:text-[13px] text-white tracking-wide group-hover:text-cyan-200 transition-colors font-sans">
                        {clause.title}
                      </h4>
                    </div>
                  </div>
                  <p className="text-zinc-300 text-xs leading-relaxed whitespace-pre-line pl-0.5 font-sans">
                    {clause.body}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-[#0b0d14] border border-white/10 whitespace-pre-line text-zinc-300 font-sans">
              {spark.fullDossier}
            </div>
          )}

          {/* Dossier Protocol Seal & Copy */}
          <div className="pt-2 flex items-center justify-between text-xs font-sans text-zinc-400 border-t border-white/5">
            <span className="flex items-center gap-1.5 text-emerald-400/90 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sovereign Constitutional Record</span>
            </span>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(spark.fullDossier);
                alert('Full dossier text copied to clipboard.');
              }}
              className="hover:text-white transition flex items-center gap-1.5 cursor-pointer font-semibold text-xs"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Text</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="pt-3 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        {/* Author Badge */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-full bg-zinc-800 overflow-hidden shrink-0">
            {spark.authorAvatar ? (
              <img src={spark.authorAvatar} alt={spark.authorName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-[10px] text-white uppercase">
                {spark.authorName?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <span className="font-semibold text-zinc-400 text-xs truncate">@{spark.authorUsername}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          {onOpenFlex && (
            <button
              onClick={() => onOpenFlex(spark)}
              className="px-2.5 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-semibold whitespace-nowrap transition flex items-center gap-1 cursor-pointer shadow-sm"
              title="Open full interactive SPARK dispatch"
            >
              <span>SPARK</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2.5 py-1 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white whitespace-nowrap transition flex items-center gap-1 cursor-pointer"
          >
            <span>{isExpanded ? 'Hide' : 'Dossier'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleLike}
            className={`p-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 text-xs shrink-0 ${
              hasLiked ? 'text-rose-500' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500' : ''}`} />
            <span>{likesCount}</span>
          </button>

          <button
            onClick={handleToggleBookmark}
            className={`p-1.5 rounded-lg transition cursor-pointer shrink-0 ${
              saved ? 'text-amber-400' : 'text-zinc-400 hover:text-white'
            }`}
            title="Save to Treaty Ledger"
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-400' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer shrink-0"
            title="Share Spark"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </article>
  );
}
