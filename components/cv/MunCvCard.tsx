'use client';

import React from 'react';
import { MunRecord } from '@/lib/passport';
import { Award, ShieldCheck, Calendar, ExternalLink, Edit3, Trash2, Globe, Flag, FileText, CheckCircle2, Sparkles } from 'lucide-react';

interface MunCvCardProps {
  record: MunRecord;
  isOwner?: boolean;
  onEdit?: (record: MunRecord) => void;
  onDelete?: (id: string) => void;
}

export default function MunCvCard({
  record,
  isOwner = false,
  onEdit,
  onDelete,
}: MunCvCardProps) {
  const isAward = Boolean(record.award);
  const isBestDelegate = record.award?.toLowerCase().includes('best delegate') || record.award?.toLowerCase().includes('gavel');
  const isDais = record.role === 'Executive Board' || record.role === 'Secretariat';

  return (
    <div 
      className="group relative rounded-3xl transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between overflow-hidden bg-[#08090f] hover:bg-[#0c0f1c] border border-white/10 hover:border-white/25 shadow-lg hover:shadow-2xl hover:-translate-y-1.5"
    >
      <div>
        {/* Top Header: Award Banner OR Verification Seal */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            {isAward ? (
              <div className="px-3.5 py-1 rounded-full text-xs font-sans font-bold flex items-center gap-1.5 shadow-md bg-white text-black border border-white">
                <Award className="w-3.5 h-3.5 text-black" />
                <span>{record.award}</span>
                {isBestDelegate && <Sparkles className="w-3 h-3 text-black" />}
              </div>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold bg-white/5 border border-white/10 text-neutral-300">
                Participation
              </span>
            )}

            {/* Role Badge */}
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold ${
              isDais
                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/35 shadow-[0_0_10px_rgba(168,85,247,0.15)]'
                : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
            }`}>
              {record.role}
            </span>
          </div>

          {/* Verification Badge */}
          {record.isOrganiserVerified ? (
            <div 
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)] shrink-0"
              title={`Verified by ${record.verifiedBy || 'Secretariat'}`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>VERIFIED</span>
            </div>
          ) : (
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest shrink-0 bg-white/[0.03] px-2 py-0.5 rounded-full border border-white/5">
              SELF-REPORTED
            </span>
          )}
        </div>

        {/* Conference Title */}
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight transition-colors duration-200">
          {record.conferenceName}
        </h3>

        {/* Committee & Portfolio Details */}
        <div className="space-y-2 mt-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-jakarta font-semibold text-neutral-200">
            <span className="text-base">🏛️</span>
            <span>{record.committee}</span>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm font-jakarta text-neutral-300">
            <span className="text-lg">{record.countryFlag || '🇺🇳'}</span>
            <span className="font-semibold text-cyan-300 tracking-wide">{record.portfolio}</span>
          </div>
        </div>

        {/* Key Speeches / Resolutions Notes */}
        {record.notes && (
          <div className="mt-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-xs font-jakarta text-neutral-300 flex items-start gap-2.5 backdrop-blur-sm">
            <FileText className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
            <p className="line-clamp-2 leading-relaxed">{record.notes}</p>
          </div>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3 text-xs text-neutral-400 font-sans">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-neutral-300 font-medium">
            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
            <span>{record.date}</span>
          </span>
          {record.format && (
            <>
              <span className="text-neutral-600">•</span>
              <span className="text-[11px] font-sans text-neutral-400 px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/5">
                {record.format === 'In-Person' ? '🏛️ In-Person' : record.format === 'Online' ? '🌐 Online' : '⚡ Hybrid'}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {record.certificateUrl && (
            <a
              href={record.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition cursor-pointer"
              title="View Certificate Proof"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {isOwner && (
            <div className="flex items-center gap-1.5">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(record)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition cursor-pointer"
                  title="Edit Record"
                >
                  <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(record.id)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition cursor-pointer"
                  title="Delete Record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
