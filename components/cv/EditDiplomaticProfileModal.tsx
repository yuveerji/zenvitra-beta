'use client';

import React, { useState, useMemo } from 'react';
import { 
  X, 
  User, 
  Flag, 
  GraduationCap, 
  FileText, 
  Sparkles, 
  Globe, 
  Lock, 
  Search, 
  ShieldCheck,
  Share2,
  Download,
  Link2,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react';
import { 
  ZenPassport, 
  CvVisibilityMode, 
  CvSharingSettings, 
  getCvSharingSettings 
} from '@/lib/passport';
import { ALL_WORLD_COUNTRIES_AND_REGIONS, WorldCountryEntity } from '@/lib/worldCountriesData';

interface EditDiplomaticProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  passport: ZenPassport;
  onSave: (updated: Partial<ZenPassport>) => void;
}

export default function EditDiplomaticProfileModal({
  isOpen,
  onClose,
  passport,
  onSave,
}: EditDiplomaticProfileModalProps) {
  const [fullName, setFullName] = useState(passport.fullName || '');
  const [country, setCountry] = useState(passport.country || 'United States');
  const [countryFlag, setCountryFlag] = useState(passport.countryFlag || '🇺🇸');
  const [institution, setInstitution] = useState(passport.education?.institution || '');
  const [headline, setHeadline] = useState(passport.headline || '');
  const [bio, setBio] = useState(passport.bio || '');

  // Granular Sovereign Privacy & Sharing Governance
  const initialSharing = getCvSharingSettings(passport);
  const [cvVisibility, setCvVisibility] = useState<CvVisibilityMode>(initialSharing.visibility);
  const [allowPublicShare, setAllowPublicShare] = useState<boolean>(initialSharing.allowPublicShare);
  const [allowPublicExport, setAllowPublicExport] = useState<boolean>(initialSharing.allowPublicExport);
  const [allowIndexing, setAllowIndexing] = useState<boolean>(initialSharing.allowIndexing !== false);
  const [hideUnverifiedRecords, setHideUnverifiedRecords] = useState<boolean>(Boolean(initialSharing.hideUnverifiedRecords));

  // Search & Filter for All Countries (UN & Non-UN Sovereign / Territories)
  const [countrySearch, setCountrySearch] = useState('');
  const [countryCategoryFilter, setCountryCategoryFilter] = useState<'ALL' | 'UN_MEMBER' | 'NON_UN_OR_OBSERVER' | 'TERRITORIES'>('ALL');
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);

  const filteredCountries = useMemo(() => {
    return ALL_WORLD_COUNTRIES_AND_REGIONS.filter((c) => {
      // Category filter
      if (countryCategoryFilter === 'UN_MEMBER' && c.category !== 'UN_MEMBER') return false;
      if (countryCategoryFilter === 'NON_UN_OR_OBSERVER' && c.category !== 'UN_OBSERVER' && c.category !== 'DE_FACTO_NON_UN') return false;
      if (countryCategoryFilter === 'TERRITORIES' && c.category !== 'AUTONOMOUS_TERRITORY' && c.category !== 'CONSTITUENT_NATION' && c.category !== 'GLOBAL_MULTILATERAL') return false;

      // Search query
      if (countrySearch.trim()) {
        const q = countrySearch.toLowerCase().trim();
        return c.name.toLowerCase().includes(q) || (c.code && c.code.toLowerCase().includes(q)) || (c.region && c.region.toLowerCase().includes(q));
      }
      return true;
    });
  }, [countrySearch, countryCategoryFilter]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isPublic = cvVisibility !== 'PRIVATE';
    const sharingConfig: CvSharingSettings = {
      visibility: cvVisibility,
      allowPublicShare: cvVisibility === 'PRIVATE' ? false : allowPublicShare,
      allowPublicExport: cvVisibility === 'PRIVATE' ? false : allowPublicExport,
      allowIndexing: cvVisibility === 'PRIVATE' ? false : allowIndexing,
      hideUnverifiedRecords,
    };

    onSave({
      fullName: fullName.trim() || passport.fullName,
      country: country.trim() || undefined,
      countryFlag: countryFlag.trim() || undefined,
      headline: headline.trim() || undefined,
      bio: bio.trim() || undefined,
      isCvPublic: isPublic,
      cvSharing: sharingConfig,
      privacy: {
        ...passport.privacy,
        showPublicCv: isPublic,
      },
      education: institution.trim() ? {
        institution: institution.trim(),
        degreeOrGrade: passport.education?.degreeOrGrade || 'Scholar',
        isVerified: passport.education?.isVerified || false,
      } : passport.education,
    });
    onClose();
  };

  const handleSelectCountry = (c: WorldCountryEntity) => {
    setCountry(c.name);
    setCountryFlag(c.flag);
    setIsCountryPickerOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#080a13] border border-white/15 shadow-2xl p-5 sm:p-7 space-y-6 text-white custom-scrollbar selection:bg-amber-500/30 glass-specular"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30 glass-specular">
              SOVEREIGN DOSSIER
            </span>
            <h2 className="text-xl sm:text-2xl font-outfit font-black text-white mt-1.5">
              Edit Diplomatic Profile &amp; Privacy
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer glass-specular"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Sovereign CV Privacy & Sharing Governance */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold flex items-center gap-1.5">
                {cvVisibility === 'PUBLIC' && <Globe className="w-4 h-4 text-emerald-400" />}
                {cvVisibility === 'UNLISTED' && <Link2 className="w-4 h-4 text-cyan-400" />}
                {cvVisibility === 'PRIVATE' && <Lock className="w-4 h-4 text-amber-400" />}
                <span>CV Privacy &amp; Sovereign Sharing</span>
              </label>
              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider border ${
                cvVisibility === 'PUBLIC' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                  : cvVisibility === 'UNLISTED'
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/25'
              }`}>
                {cvVisibility === 'PUBLIC' ? 'PUBLIC DOSSIER' : cvVisibility === 'UNLISTED' ? 'UNLISTED DOSSIER' : 'CONFIDENTIAL DOSSIER'}
              </span>
            </div>

            {/* 3 Visibility Modes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Public */}
              <button
                type="button"
                onClick={() => setCvVisibility('PUBLIC')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col gap-1 ${
                  cvVisibility === 'PUBLIC'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'bg-white/[0.02] border-white/5 text-neutral-400 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Globe className={`w-3.5 h-3.5 ${cvVisibility === 'PUBLIC' ? 'text-emerald-400' : 'text-neutral-500'}`} />
                  <span>Public</span>
                </div>
                <p className="text-[10px] text-neutral-400 leading-relaxed">
                  Discoverable &amp; viewable by conference secretariats and delegates.
                </p>
              </button>

              {/* Unlisted */}
              <button
                type="button"
                onClick={() => setCvVisibility('UNLISTED')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col gap-1 ${
                  cvVisibility === 'UNLISTED'
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'bg-white/[0.02] border-white/5 text-neutral-400 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Link2 className={`w-3.5 h-3.5 ${cvVisibility === 'UNLISTED' ? 'text-cyan-400' : 'text-neutral-500'}`} />
                  <span>Unlisted</span>
                </div>
                <p className="text-[10px] text-neutral-400 leading-relaxed">
                  Only people with your direct URL link can view your dossier.
                </p>
              </button>

              {/* Private */}
              <button
                type="button"
                onClick={() => setCvVisibility('PRIVATE')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col gap-1 ${
                  cvVisibility === 'PRIVATE'
                    ? 'bg-amber-500/10 border-amber-500/40 text-white shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                    : 'bg-white/[0.02] border-white/5 text-neutral-400 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Lock className={`w-3.5 h-3.5 ${cvVisibility === 'PRIVATE' ? 'text-amber-400' : 'text-neutral-500'}`} />
                  <span>Private</span>
                </div>
                <p className="text-[10px] text-neutral-400 leading-relaxed">
                  Confidential. Shielded from all external visitors. Only you see it.
                </p>
              </button>
            </div>

            {/* Granular Rights & Sharing Restrictions (Available when Public or Unlisted) */}
            {cvVisibility !== 'PRIVATE' && (
              <div className="pt-2 border-t border-white/10 space-y-2.5">
                <span className="text-[11px] font-mono font-bold tracking-wider text-neutral-400 uppercase">
                  Visitor Permissions &amp; Data Protection
                </span>

                <div className="space-y-2">
                  {/* Allow Public Sharing */}
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Share2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-neutral-200">Allow visitors to share CV link</div>
                        <div className="text-[10px] text-neutral-400">When disabled, visitors cannot share your CV link</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={allowPublicShare}
                      onChange={(e) => setAllowPublicShare(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-black/40 text-cyan-500 focus:ring-0 cursor-pointer"
                    />
                  </label>

                  {/* Allow Public Export */}
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Download className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-neutral-200">Allow visitors to export &amp; download PDF</div>
                        <div className="text-[10px] text-neutral-400">When disabled, visitors can view on-screen but cannot export official documents</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={allowPublicExport}
                      onChange={(e) => setAllowPublicExport(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-black/40 text-amber-500 focus:ring-0 cursor-pointer"
                    />
                  </label>

                  {/* Hide Unverified Summits */}
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition cursor-pointer">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-neutral-200">Show only organizer-verified conferences to visitors</div>
                        <div className="text-[10px] text-neutral-400">Hides draft or unverified experiences from external visitors</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={hideUnverifiedRecords}
                      onChange={(e) => setHideUnverifiedRecords(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-black/40 text-emerald-500 focus:ring-0 cursor-pointer"
                    />
                  </label>

                  {/* Indexing */}
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Eye className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-neutral-200">Allow directory &amp; search indexing</div>
                        <div className="text-[10px] text-neutral-400">Allows ranking on the diplomatic roster and public search</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={allowIndexing}
                      onChange={(e) => setAllowIndexing(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-black/40 text-purple-500 focus:ring-0 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-sans font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-neutral-400" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-sm font-sans text-white focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          {/* Universal Country & Flag Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-sans font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-amber-400" />
                <span>Diplomatic Nationality &amp; Country</span>
              </label>
              <button
                type="button"
                onClick={() => setIsCountryPickerOpen(!isCountryPickerOpen)}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-mono underline cursor-pointer"
              >
                {isCountryPickerOpen ? 'Close Database' : 'Browse All 200+ UN & Sovereign Entities'}
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={countryFlag}
                onChange={(e) => setCountryFlag(e.target.value)}
                placeholder="🇺🇸"
                className="w-16 px-2 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-center text-xl font-sans text-white focus:outline-none focus:border-amber-400 transition"
              />
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Select or enter any sovereign nation or territory..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-sm font-sans text-white focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {[
                { flag: '🇮🇳', name: 'India' },
                { flag: '🇺🇸', name: 'United States' },
                { flag: '🇬🇧', name: 'United Kingdom' },
                { flag: '🇵🇸', name: 'State of Palestine' },
                { flag: '🇹🇼', name: 'Taiwan (ROC)' },
                { flag: '🇽🇰', name: 'Kosovo' },
                { flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', name: 'Scotland' },
                { flag: '🇺🇳', name: 'United Nations / Global Citizen' },
              ].map((c) => (
                <button
                  type="button"
                  key={c.name}
                  onClick={() => {
                    setCountry(c.name);
                    setCountryFlag(c.flag);
                  }}
                  className="text-[10px] px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/10 border border-white/5 text-neutral-300 hover:text-white transition cursor-pointer flex items-center gap-1"
                >
                  <span>{c.flag}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>

            {/* Expanded Universal Country Database Picker */}
            {isCountryPickerOpen && (
              <div className="p-3.5 rounded-2xl bg-black/90 border border-amber-500/30 space-y-3 animate-fade-in shadow-xl">
                <div className="flex items-center justify-between gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search country, UN member, observer, non-UN sovereign, territory..."
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  {countrySearch && (
                    <button
                      type="button"
                      onClick={() => setCountrySearch('')}
                      className="text-xs text-neutral-400 hover:text-white px-2 py-1 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono">
                  {(
                    [
                      { key: 'ALL', label: 'ALL ENTITIES' },
                      { key: 'UN_MEMBER', label: 'UN MEMBERS (193)' },
                      { key: 'NON_UN_OR_OBSERVER', label: 'OBSERVERS & NON-UN' },
                      { key: 'TERRITORIES', label: 'TERRITORIES & NATIONS' },
                    ] as const
                  ).map((cat) => (
                    <button
                      type="button"
                      key={cat.key}
                      onClick={() => setCountryCategoryFilter(cat.key)}
                      className={`px-2 py-1 rounded-md transition cursor-pointer ${
                        countryCategoryFilter === cat.key
                          ? 'bg-amber-500 text-black font-bold'
                          : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Country List (Virtual / Scrollable) */}
                <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {filteredCountries.length === 0 ? (
                    <div className="p-4 text-center text-xs text-neutral-400">
                      No matching sovereign entities found. You can manually enter any nation above.
                    </div>
                  ) : (
                    filteredCountries.map((c, idx) => (
                      <button
                        type="button"
                        key={`${c.name}-${idx}`}
                        onClick={() => handleSelectCountry(c)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition cursor-pointer text-xs ${
                          country === c.name
                            ? 'bg-amber-500/20 text-white border border-amber-500/40'
                            : 'hover:bg-white/5 text-neutral-300 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-base shrink-0">{c.flag}</span>
                          <span className="font-semibold truncate">{c.name}</span>
                          {c.code && (
                            <span className="text-[10px] font-mono text-neutral-500 uppercase">
                              {c.code}
                            </span>
                          )}
                        </div>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase shrink-0 ${
                          c.category === 'UN_MEMBER'
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                            : c.category === 'UN_OBSERVER'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : c.category === 'DE_FACTO_NON_UN'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}>
                          {c.category === 'UN_MEMBER'
                            ? 'UN Member'
                            : c.category === 'UN_OBSERVER'
                            ? 'UN Observer'
                            : c.category === 'DE_FACTO_NON_UN'
                            ? 'De Facto / Non-UN'
                            : c.category === 'CONSTITUENT_NATION'
                            ? 'Constituent'
                            : c.category === 'AUTONOMOUS_TERRITORY'
                            ? 'Territory'
                            : 'Global'}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Academic Institution */}
          <div className="space-y-1.5">
            <label className="block text-xs font-sans font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-neutral-400" />
              <span>School / University / Affiliation</span>
            </label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="e.g. Harvard University or Delhi Public School"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-sm font-sans text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          {/* Headline */}
          <div className="space-y-1.5">
            <label className="block text-xs font-sans font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
              <span>Diplomatic Track / Specialization</span>
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Multilateral Security & Disarmament Delegate"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-sm font-sans text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label className="block text-xs font-sans font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-neutral-400" />
              <span>Diplomatic Bio / Statement</span>
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A brief overview of your Model UN and multilateral experience..."
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-sans text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition resize-none"
            />
          </div>

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
              className="px-6 py-2.5 rounded-xl bg-white text-black font-sans font-bold text-xs uppercase tracking-wider hover:bg-neutral-100 transition shadow-lg shadow-white/10 cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
