'use client';

import React, { useState } from 'react';
import { MunRecord } from '@/lib/passport';
import { X, Globe, Award, ShieldCheck, Calendar, MapPin, ExternalLink, Sparkles, Building, Flag, FileText } from 'lucide-react';

interface AddMunExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: MunRecord) => void;
  initialRecord?: MunRecord | null;
}

const COMMON_CONFERENCES = [
  'ZEN.DIPLOMACY 2026',
  'Harvard National MUN (HNMUN)',
  'Harvard WorldMUN',
  'The Hague International MUN (THIMUN)',
  'Yale Model UN (YMUN)',
  'ILMUNC (UPenn)',
  'Oxford Climate & Diplomacy Summit',
  'All India Political Parties Meet (AIPPM)',
  'National Model United Nations (NMUN NY)',
  'Singapore Model UN (SMUN)',
  'Georgetown NAIMUN',
  'Columbia Model UN (CMUNNY)',
];

const COMMON_COMMITTEES = [
  'United Nations Security Council (UNSC)',
  'UN Human Rights Council (UNHRC)',
  'General Assembly First Committee (DISEC)',
  'General Assembly Third Committee (SOCHUM)',
  'Historic Crisis Committee (HCC)',
  'All India Political Parties Meet (AIPPM)',
  'Lok Sabha / Youth Parliament',
  'Economic and Social Council (ECOSOC)',
  'International Court of Justice (ICJ)',
  'UN Environment Programme (UNEP)',
  'World Health Assembly (WHA)',
  'Continuous Crisis Committee (CCC)',
];

const COMMON_AWARDS = [
  { label: 'No Award (Active Diplomatic Participation)', value: '' },
  { label: '🏆 Best Delegate (Chairman\'s Gavel)', value: 'Best Delegate' },
  { label: '🥈 High Commendation', value: 'High Commendation' },
  { label: '🥉 Special Mention', value: 'Special Mention' },
  { label: '⭐ Honorable Mention', value: 'Honorable Mention' },
  { label: '🗣️ Verbal Mention', value: 'Verbal Mention' },
  { label: '📜 Best Position Paper', value: 'Best Position Paper' },
  { label: '🌐 Best Delegation', value: 'Best Delegation' },
  { label: '🎖️ Outstanding Diplomat', value: 'Outstanding Diplomat' },
];

const POPULAR_FLAGS = [
  { flag: '🇺🇳', label: 'UN' },
  { flag: '🇺🇸', label: 'US' },
  { flag: '🇮🇳', label: 'IN' },
  { flag: '🇬🇧', label: 'UK' },
  { flag: '🇫🇷', label: 'FR' },
  { flag: '🇨🇳', label: 'CN' },
  { flag: '🇷🇺', label: 'RU' },
  { flag: '🇩🇪', label: 'DE' },
  { flag: '🇯🇵', label: 'JP' },
  { flag: '🇧🇷', label: 'BR' },
  { flag: '🇿🇦', label: 'ZA' },
  { flag: '🇨🇦', label: 'CA' },
  { flag: '🇦🇺', label: 'AU' },
  { flag: '🇸🇦', label: 'SA' },
];

export default function AddMunExperienceModal({
  isOpen,
  onClose,
  onSave,
  initialRecord,
}: AddMunExperienceModalProps) {
  const [conferenceName, setConferenceName] = useState(initialRecord?.conferenceName || '');
  const [committee, setCommittee] = useState(initialRecord?.committee || '');
  const [portfolio, setPortfolio] = useState(initialRecord?.portfolio || '');
  const [countryFlag, setCountryFlag] = useState(initialRecord?.countryFlag || '🇺🇳');
  const [role, setRole] = useState<MunRecord['role']>(initialRecord?.role || 'Delegate');
  const [award, setAward] = useState(initialRecord?.award || '');
  const [date, setDate] = useState(initialRecord?.date || new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [format, setFormat] = useState<'In-Person' | 'Online' | 'Hybrid'>(initialRecord?.format || 'In-Person');
  const [certificateUrl, setCertificateUrl] = useState(initialRecord?.certificateUrl || '');
  const [notes, setNotes] = useState(initialRecord?.notes || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conferenceName.trim() || !committee.trim() || !portfolio.trim()) return;

    const record: MunRecord = {
      id: initialRecord?.id || `mun-${Date.now()}`,
      conferenceName: conferenceName.trim(),
      committee: committee.trim(),
      portfolio: portfolio.trim(),
      countryFlag: countryFlag.trim() || '🇺🇳',
      role,
      award: award.trim() || undefined,
      date: date.trim() || '2026',
      format,
      certificateUrl: certificateUrl.trim() || undefined,
      notes: notes.trim() || undefined,
      isOrganiserVerified: initialRecord?.isOrganiserVerified || false,
      verifiedBy: initialRecord?.verifiedBy,
    };

    onSave(record);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#080a13] border border-white/15 shadow-2xl p-6 sm:p-8 space-y-6 text-white custom-scrollbar selection:bg-amber-500/30 glass-specular"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient */}
        <div className="absolute top-0 right-1/4 w-72 h-32 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-72 h-32 bg-cyan-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30 glass-specular">
                DIPLOMATIC CV RECORD
              </span>
              <span className="text-xs text-neutral-400 font-mono">V1 LEDGER</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-outfit font-black text-white tracking-tight">
              {initialRecord ? 'Edit MUN Conference Record' : 'Add Model UN Conference to CV'}
            </h2>
            <p className="text-xs text-neutral-400 font-jakarta">
              Record verified delegate or dais experience on your sovereign multilateral dossier.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer glass-specular"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {/* Conference Name */}
          <div className="space-y-2">
            <label className="block text-xs font-sans font-bold text-neutral-300 uppercase tracking-wider">
              Conference Name *
            </label>
            <input
              type="text"
              required
              value={conferenceName}
              onChange={(e) => setConferenceName(e.target.value)}
              placeholder="e.g. ZEN.DIPLOMACY 2026 or Harvard WorldMUN"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-sm font-sans text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
            />
            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-neutral-500 font-mono">Suggested:</span>
              {COMMON_CONFERENCES.slice(0, 4).map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setConferenceName(c)}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.03] hover:bg-white/10 border border-white/5 text-neutral-300 hover:text-white transition cursor-pointer"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Role & Format in 2 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-sans font-bold text-neutral-300 uppercase tracking-wider">
                Diplomatic Role *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as MunRecord['role'])}
                className="w-full px-4 py-3 rounded-xl bg-[#0e111a] border border-white/10 text-sm font-sans text-white focus:outline-none focus:border-cyan-400 transition"
              >
                <option value="Delegate">Delegate</option>
                <option value="Head Delegate">Head Delegate</option>
                <option value="Executive Board">Executive Board / Chair / Dais</option>
                <option value="Secretariat">Secretariat</option>
                <option value="International Press">International Press</option>
                <option value="Observer">Observer</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-sans font-bold text-neutral-300 uppercase tracking-wider">
                Conference Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as 'In-Person' | 'Online' | 'Hybrid')}
                className="w-full px-4 py-3 rounded-xl bg-[#0e111a] border border-white/10 text-sm font-sans text-white focus:outline-none focus:border-cyan-400 transition"
              >
                <option value="In-Person">In-Person Conference</option>
                <option value="Online">Online Simulation</option>
                <option value="Hybrid">Hybrid Format</option>
              </select>
            </div>
          </div>

          {/* Committee */}
          <div className="space-y-2">
            <label className="block text-xs font-sans font-bold text-neutral-300 uppercase tracking-wider">
              Committee / Chamber *
            </label>
            <input
              type="text"
              required
              value={committee}
              onChange={(e) => setCommittee(e.target.value)}
              placeholder="e.g. United Nations Security Council (UNSC) or AIPPM"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-sm font-sans text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
            />
            {/* Committee Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-neutral-500 font-mono">Suggested:</span>
              {COMMON_COMMITTEES.slice(0, 4).map((cm) => (
                <button
                  type="button"
                  key={cm}
                  onClick={() => setCommittee(cm)}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.03] hover:bg-white/10 border border-white/5 text-neutral-300 hover:text-white transition cursor-pointer"
                >
                  {cm.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Portfolio & Country Flag */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-3 space-y-2">
              <label className="block text-xs font-sans font-bold text-neutral-300 uppercase tracking-wider">
                Portfolio / Allocation *
              </label>
              <input
                type="text"
                required
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="e.g. Delegate of France or Chairperson"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-sm font-sans text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-sans font-bold text-neutral-300 uppercase tracking-wider">
                Flag
              </label>
              <input
                type="text"
                value={countryFlag}
                onChange={(e) => setCountryFlag(e.target.value)}
                placeholder="🇺🇳"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-center text-lg font-sans text-white focus:outline-none focus:border-cyan-400 transition"
              />
            </div>
          </div>

          {/* Flag presets */}
          <div className="flex flex-wrap items-center gap-1.5 -mt-2">
            <span className="text-[10px] text-neutral-500 font-mono">Flag quick picks:</span>
            {POPULAR_FLAGS.map((f) => (
              <button
                type="button"
                key={f.label}
                onClick={() => setCountryFlag(f.flag)}
                className={`px-1.5 py-0.5 rounded text-sm hover:scale-125 transition ${countryFlag === f.flag ? 'bg-cyan-500/20 ring-1 ring-cyan-400' : 'bg-white/5'}`}
                title={f.label}
              >
                {f.flag}
              </button>
            ))}
          </div>

          {/* Award Won */}
          <div className="space-y-2 p-4 rounded-2xl bg-amber-500/[0.04] border border-amber-500/20">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-sans font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Accolade / Award Won</span>
              </label>
              <span className="text-[10px] text-neutral-400 font-sans">Boosts Win Rate &amp; Rank</span>
            </div>
            <select
              value={award}
              onChange={(e) => setAward(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0e111a] border border-amber-500/30 text-sm font-sans text-amber-200 focus:outline-none focus:border-amber-400 transition"
            >
              {COMMON_AWARDS.map((aw) => (
                <option key={aw.value} value={aw.value}>
                  {aw.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Proof URL in 2 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-sans font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                <span>Month &amp; Year / Date *</span>
              </label>
              <input
                type="text"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. October 2026 or 2025"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-sm font-sans text-white focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-sans font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                <span>Certificate / Drive URL (Optional)</span>
              </label>
              <input
                type="url"
                value={certificateUrl}
                onChange={(e) => setCertificateUrl(e.target.value)}
                placeholder="https://drive.google.com/... or cert link"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-sm font-sans text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>
          </div>

          {/* Notes / Resolutions */}
          <div className="space-y-2">
            <label className="block text-xs font-sans font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-neutral-400" />
              <span>Key Speeches / Resolutions Sponsored (Optional)</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Authored Draft Resolution 2.1 on Nuclear Non-Proliferation, passed with 18 sponsors."
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-sans text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-sans font-semibold text-neutral-400 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-sans font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95"
            >
              {initialRecord ? 'Save Record' : 'Add to MUN CV →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
