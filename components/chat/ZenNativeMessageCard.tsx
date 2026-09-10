'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Scale, 
  Compass, 
  Radio, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  Vote, 
  ExternalLink,
  Users,
  Clock,
  Sparkles
} from 'lucide-react';
import { ZenMessageObject } from '@/types/chat';

interface ZenNativeMessageCardProps {
  nativeObject: ZenMessageObject;
  messageId: string;
  isSelf: boolean;
  currentUserId: string;
  onVotePoll?: (messageId: string, optionId: string) => void;
}

export function ZenNativeMessageCard({
  nativeObject,
  messageId,
  isSelf,
  currentUserId,
  onVotePoll,
}: ZenNativeMessageCardProps) {
  const { type, title, subtitle, badge, actionLabel, actionUrl, metadata, pollData } = nativeObject;

  /* 1. POLL OBJECT */
  if (type === 'poll' && pollData) {
    const totalVotes = pollData.totalVotes || 0;
    return (
      <div className="w-full max-w-sm rounded-2xl bg-black/40 border border-white/15 p-4 space-y-3 font-sans shadow-lg">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
          <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[10px] uppercase font-bold tracking-wider">
            <Vote className="w-3.5 h-3.5" />
            <span>SOVEREIGN POLL</span>
          </div>
          <span className="text-[10px] font-mono text-neutral-400">
            {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
          </span>
        </div>

        <h4 className="font-display font-semibold text-xs sm:text-sm text-white leading-snug">
          {pollData.question}
        </h4>

        <div className="space-y-2">
          {pollData.options.map((opt) => {
            const votesCount = opt.votes.length;
            const pct = totalVotes > 0 ? Math.round((votesCount / totalVotes) * 100) : 0;
            const hasVoted = opt.votes.includes(currentUserId);

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onVotePoll?.(messageId, opt.id)}
                className={`relative w-full overflow-hidden text-left p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between group ${
                  hasVoted
                    ? 'border-cyan-400/50 bg-cyan-500/15 text-white ring-1 ring-cyan-400/30'
                    : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-neutral-300'
                }`}
              >
                {/* Progress bar background fill */}
                <div
                  className={`absolute left-0 top-0 bottom-0 transition-all duration-300 pointer-events-none ${
                    hasVoted ? 'bg-cyan-500/20' : 'bg-white/[0.05]'
                  }`}
                  style={{ width: `${pct}%` }}
                />

                <span className="relative z-10 text-xs font-sans font-medium flex items-center gap-2">
                  {hasVoted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0 group-hover:border-cyan-400/50" />
                  )}
                  <span className="truncate">{opt.text}</span>
                </span>

                <span className="relative z-10 font-mono text-xs font-bold text-neutral-400">
                  {pct}%
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* 2. DOCS OBJECT */
  if (type === 'doc') {
    return (
      <div className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-cyan-950/40 via-black/40 to-neutral-900/60 border border-cyan-500/30 p-4 space-y-3 font-sans shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-cyan-300 font-mono text-[10px] uppercase font-bold tracking-wider">
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>ZEN.DOCS</span>
          </div>
          {badge && (
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
              {badge}
            </span>
          )}
        </div>

        <div>
          <h4 className="font-display font-bold text-sm text-white tracking-tight leading-snug">
            {title}
          </h4>
          {subtitle && (
            <p className="font-mono text-[11px] text-neutral-400 mt-0.5 line-clamp-2">
              {subtitle}
            </p>
          )}
        </div>

        {metadata?.clausesCount && (
          <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400">
            <span>{metadata.clausesCount} Clauses</span>
            <span>•</span>
            <span>{metadata.docCode || 'UN-RES'}</span>
          </div>
        )}

        <Link
          href={actionUrl || '/docs'}
          className="w-full py-2 px-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold font-mono text-xs flex items-center justify-center gap-2 transition shadow-sm"
        >
          <span>{actionLabel || 'Open Document'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  /* 3. MUN COMMITTEE / SUMMIT OBJECT */
  if (type === 'mun') {
    return (
      <div className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-purple-950/40 via-black/40 to-neutral-900/60 border border-purple-500/30 p-4 space-y-3 font-sans shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-purple-300 font-mono text-[10px] uppercase font-bold tracking-wider">
            <Scale className="w-3.5 h-3.5 text-purple-400" />
            <span>ZEN.MUN</span>
          </div>
          {badge && (
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300">
              {badge}
            </span>
          )}
        </div>

        <div>
          <h4 className="font-display font-bold text-sm text-white tracking-tight leading-snug">
            {title}
          </h4>
          {subtitle && (
            <p className="font-mono text-[11px] text-neutral-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {metadata?.schedule && (
          <div className="flex items-center gap-2 text-[10px] font-mono text-purple-300">
            <Clock className="w-3 h-3" />
            <span>{metadata.schedule}</span>
          </div>
        )}

        <Link
          href={actionUrl || '/committee'}
          className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono text-xs flex items-center justify-center gap-2 transition shadow-sm"
        >
          <span>{actionLabel || 'Enter Committee'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  /* 4. CHAMBER DELIBERATION OBJECT */
  if (type === 'chamber') {
    return (
      <div className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-amber-950/40 via-black/40 to-neutral-900/60 border border-amber-500/30 p-4 space-y-3 font-sans shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-amber-300 font-mono text-[10px] uppercase font-bold tracking-wider">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>ZEN.CHAMBER</span>
          </div>
          {badge && (
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300">
              {badge}
            </span>
          )}
        </div>

        <div>
          <h4 className="font-display font-bold text-sm text-white tracking-tight leading-snug">
            {title}
          </h4>
          {subtitle && (
            <p className="font-mono text-[11px] text-neutral-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        <Link
          href={actionUrl || '/chamber'}
          className="w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold font-mono text-xs flex items-center justify-center gap-2 transition shadow-sm"
        >
          <span>{actionLabel || 'Join Deliberation'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  /* 5. PULSE POST OBJECT */
  if (type === 'pulse') {
    return (
      <div className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-emerald-950/40 via-black/40 to-neutral-900/60 border border-emerald-500/30 p-4 space-y-3 font-sans shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-emerald-300 font-mono text-[10px] uppercase font-bold tracking-wider">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>ZEN.PULSE POST</span>
          </div>
          {badge && (
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
              {badge}
            </span>
          )}
        </div>

        <div>
          <h4 className="font-display font-bold text-sm text-white tracking-tight leading-snug line-clamp-2">
            {title}
          </h4>
          {subtitle && (
            <p className="font-mono text-[11px] text-neutral-400 mt-0.5 line-clamp-2">
              {subtitle}
            </p>
          )}
        </div>

        <Link
          href={actionUrl || '/pulse'}
          className="w-full py-2 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-white font-mono text-xs flex items-center justify-center gap-2 transition"
        >
          <span>{actionLabel || 'View in Pulse'}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  /* 6. GENERIC EVENT / CALENDAR OBJECT */
  return (
    <div className="w-full max-w-sm rounded-2xl bg-white/[0.04] border border-white/15 p-4 space-y-3 font-sans shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-neutral-300 font-mono text-[10px] uppercase font-bold tracking-wider">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <span>DIPLOMATIC DISPATCH</span>
        </div>
        {badge && (
          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
            {badge}
          </span>
        )}
      </div>

      <div>
        <h4 className="font-display font-bold text-sm text-white tracking-tight leading-snug">
          {title}
        </h4>
        {subtitle && (
          <p className="font-mono text-[11px] text-neutral-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      <Link
        href={actionUrl || '#'}
        className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center justify-center gap-2 transition"
      >
        <span>{actionLabel || 'Open Link'}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
