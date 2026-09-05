'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  ExternalLink, 
  X, 
  Newspaper, 
  Landmark, 
  Tv, 
  FileText, 
  Scale, 
  Check, 
  Copy,
  Globe2,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { OFFICIAL_SOURCES_DIRECTORY, SourceItem } from '@/lib/officialSourcesData';

interface OfficialSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectForSpeech?: (source: SourceItem) => void;
}

type FilterCategory = 'all' | 'national_newspaper' | 'parliamentary_broadcast' | 'investigative_media' | 'government' | 'academic' | 'international';

export function OfficialSourcesModal({
  isOpen,
  onClose,
  onSelectForSpeech
}: OfficialSourcesModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Sources', count: OFFICIAL_SOURCES_DIRECTORY.length, icon: Globe2 },
    { id: 'national_newspaper', label: 'National Dailies', icon: Newspaper },
    { id: 'parliamentary_broadcast', label: 'Parliament TV', icon: Tv },
    { id: 'investigative_media', label: 'Investigative & Digital', icon: FileText },
    { id: 'government', label: 'Government & Legal', icon: Landmark },
    { id: 'academic', label: 'Research & Policy', icon: Scale },
  ];

  const filteredSources = useMemo(() => {
    return OFFICIAL_SOURCES_DIRECTORY.filter((s) => {
      const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
      const matchesSearch = 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.url.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleCopyLink = (s: SourceItem) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(`${s.name} — ${s.url}`);
      setCopiedId(s.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0a0c14] border border-white/15 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 sm:p-7 border-b border-white/10 bg-gradient-to-r from-amber-500/10 via-purple-500/5 to-cyan-500/10 flex items-center justify-between shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                    SASSY Constituent Assembly 2026
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">Pages 29–31 Reference Guide</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white flex items-center gap-2.5">
                  <BookOpen className="w-6 h-6 text-amber-400" />
                  <span>Official Sources &amp; News Media Directory</span>
                </h2>
                <p className="text-xs text-neutral-300 font-sans max-w-2xl">
                  Accredited national newspapers, parliamentary broadcasts, government portals, and investigative media.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Category Filter Toolbar */}
            <div className="p-5 border-b border-white/10 space-y-3 bg-[#080910] shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by publication, court, broadcast or keyword (e.g. Hindu, Sansad, Supreme Court, Mint, CAD)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/60 border border-white/15 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 font-mono"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-mono">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id as FilterCategory)}
                      className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer text-xs ${
                        isActive
                          ? 'bg-amber-400 text-black border-amber-300 font-bold shadow-md'
                          : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sources List Grid */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3 custom-scrollbar">
              {filteredSources.length === 0 ? (
                <div className="p-12 text-center text-neutral-400 font-mono text-xs border border-dashed border-white/10 rounded-3xl space-y-2">
                  <p>No verified sources found matching &ldquo;{searchQuery}&rdquo;</p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                    className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white transition text-xs"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredSources.map((source) => (
                    <div
                      key={source.id}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition flex flex-col justify-between space-y-3 group"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold uppercase tracking-wider ${source.badgeColor}`}>
                            {source.badge}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-500 uppercase">
                            {source.category.replace('_', ' ')}
                          </span>
                        </div>

                        <h3 className="font-display font-bold text-sm text-white group-hover:text-amber-300 transition flex items-center gap-1.5">
                          <span>{source.name}</span>
                        </h3>

                        <p className="text-xs text-neutral-400 font-sans line-clamp-2 leading-relaxed">
                          {source.description}
                        </p>
                      </div>

                      {/* URL & Action Triggers */}
                      <div className="pt-2.5 border-t border-white/5 flex items-center justify-between gap-2 text-xs font-mono">
                        <span className="text-[11px] text-cyan-400 truncate max-w-[200px]">
                          {source.url.replace('https://', '')}
                        </span>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleCopyLink(source)}
                            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition cursor-pointer"
                            title="Copy Citation"
                          >
                            {copiedId === source.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-3 h-3 text-neutral-400" />
                          </a>

                          {onSelectForSpeech && (
                            <button
                              type="button"
                              onClick={() => {
                                onSelectForSpeech(source);
                                onClose();
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold font-display text-[11px] transition cursor-pointer"
                            >
                              Cite in Speech
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Advice */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-[#080910] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-neutral-400 shrink-0">
              <div className="flex items-center gap-2 text-amber-300/90">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Rule: Nothing mentioned in any background guide may be used as established fact without presentation of a credible source.</span>
              </div>
              <span className="text-neutral-500">22 Accredited Outlets</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
