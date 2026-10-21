'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  X,
  Search,
  Filter,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
  Lock,
  Plus,
  Share2,
  Sparkles,
  UserCheck,
  Check
} from 'lucide-react';
import { MunCommittee } from '@/types/mun';
import { useMun } from '@/context/MunContext';
import { OFFICIAL_240_PORTFOLIOS, MatrixPortfolioItem, generatePortfoliosForCommittee } from '@/lib/matrixPortfoliosData';

interface ChamberMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  committee: MunCommittee;
  conferenceId?: string;
  conferenceName?: string;
}

export function ChamberMatrixModal({
  isOpen,
  onClose,
  committee,
  conferenceId,
  conferenceName,
}: ChamberMatrixModalProps) {
  const { conferences, activeConference, updateConferenceMatrix } = useMun();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'VACANT' | 'ALLOCATED' | 'P5'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isCopied, setIsCopied] = useState(false);

  // Allocation State
  const [allocatingSeatId, setAllocatingSeatId] = useState<string | null>(null);
  const [assignDelegateName, setAssignDelegateName] = useState('');
  const [assignDelegateEmail, setAssignDelegateEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Determine Portfolios for this committee
  const [portfolios, setPortfolios] = useState<MatrixPortfolioItem[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    // 1. Try local stored rollcall for this specific committee
    let localPortfolios: MatrixPortfolioItem[] = [];
    try {
      const raw = localStorage.getItem(`zenvitra_rollcall_${committee.id}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localPortfolios = parsed.map((item: any, idx: number) => ({
            id: `seat_${committee.id}_${idx}`,
            committee: committee.shortName || committee.name,
            title: item.country || item.title || `Seat ${idx + 1}`,
            subTitle: item.subTitle || (item.isP5 ? 'Permanent Member (P5) • Veto Power' : 'Official Committee Seat'),
            category: item.isP5 ? 'P5' : (item.category || 'General'),
            status: item.status && item.status !== 'absent' ? 'Allocated' : 'Vacant',
            allocatedTo: item.delegate || item.allocatedTo || (item.status && item.status !== 'absent' ? 'Assigned' : ''),
            difficulty: item.isP5 ? 'Advanced' : 'Intermediate',
          }));
        }
      }
    } catch {}

    if (localPortfolios.length > 0) {
      setPortfolios(localPortfolios);
      return;
    }

    // 2. Check official 240 portfolios by committee code
    const commCode = (committee.shortName || committee.type || '').toUpperCase();
    const matchedOfficial = OFFICIAL_240_PORTFOLIOS.filter(
      (p) => p.committee.toUpperCase() === commCode || p.committee.toUpperCase().includes(commCode)
    );

    if (matchedOfficial.length > 0) {
      setPortfolios(matchedOfficial);
      return;
    }

    // 3. Fallback to generating standard portfolios for this committee type
    const generated = generatePortfoliosForCommittee(
      committee.shortName || committee.name,
      committee.name,
      committee.type,
      conferenceId || activeConference?.id
    );
    setPortfolios(generated);
  }, [isOpen, committee, conferenceId, activeConference]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    portfolios.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [portfolios]);

  // Filtered Portfolios
  const filteredPortfolios = useMemo(() => {
    return portfolios.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.subTitle && p.subTitle.toLowerCase().includes(q)) ||
        (p.allocatedTo && p.allocatedTo.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q));

      const matchesStatus =
        selectedFilter === 'ALL' ||
        (selectedFilter === 'VACANT' && p.status === 'Vacant') ||
        (selectedFilter === 'ALLOCATED' && p.status !== 'Vacant') ||
        (selectedFilter === 'P5' && (p.category === 'P5' || (p.subTitle && p.subTitle.includes('P5'))));

      const matchesCategory =
        selectedCategory === 'ALL' || p.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [portfolios, searchQuery, selectedFilter, selectedCategory]);

  const totalCount = portfolios.length;
  const vacantCount = portfolios.filter((p) => p.status === 'Vacant').length;
  const allocatedCount = totalCount - vacantCount;

  // Allocate seat
  const handleAssignSeat = (seatId: string) => {
    if (!assignDelegateName.trim()) return;

    const updated = portfolios.map((p) => {
      if (p.id === seatId) {
        return {
          ...p,
          status: 'Allocated' as const,
          allocatedTo: assignDelegateName.trim(),
          allocatedEmail: assignDelegateEmail.trim() || undefined,
        };
      }
      return p;
    });

    setPortfolios(updated);

    // Save to rollcall in localStorage
    try {
      const rollcallData = updated.map((p) => ({
        country: p.title,
        flag: '🏛️',
        subTitle: p.subTitle,
        isP5: p.category === 'P5' || (p.subTitle && p.subTitle.includes('P5')),
        status: 'present',
        delegate: p.allocatedTo,
      }));
      localStorage.setItem(`zenvitra_rollcall_${committee.id}`, JSON.stringify(rollcallData));
    } catch {}

    if (conferenceId) {
      updateConferenceMatrix(conferenceId, updated);
    }

    setStatusMessage(`Assigned ${assignDelegateName.trim()} to seat!`);
    setTimeout(() => {
      setStatusMessage(null);
      setAllocatingSeatId(null);
      setAssignDelegateName('');
      setAssignDelegateEmail('');
    }, 1500);
  };

  // Mark vacant
  const handleMarkVacant = (seatId: string) => {
    const updated = portfolios.map((p) => {
      if (p.id === seatId) {
        return {
          ...p,
          status: 'Vacant' as const,
          allocatedTo: '',
          allocatedEmail: undefined,
        };
      }
      return p;
    });

    setPortfolios(updated);
    try {
      const rollcallData = updated.map((p) => ({
        country: p.title,
        flag: '🏛️',
        subTitle: p.subTitle,
        isP5: p.category === 'P5' || (p.subTitle && p.subTitle.includes('P5')),
        status: 'absent',
      }));
      localStorage.setItem(`zenvitra_rollcall_${committee.id}`, JSON.stringify(rollcallData));
    } catch {}

    if (conferenceId) {
      updateConferenceMatrix(conferenceId, updated);
    }
  };

  const fullMatrixUrl = conferenceId ? `/${conferenceId}/matrix` : '/mun/matrix';

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}${fullMatrixUrl}`;
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-5xl rounded-3xl bg-[#090d16] border border-cyan-500/30 shadow-[0_0_60px_rgba(6,182,212,0.15)] flex flex-col max-h-[90vh] overflow-hidden z-10"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-cyan-950/40 via-neutral-900/60 to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                <Layers className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white font-display">
                    Country &amp; Portfolio Matrix
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {committee.shortName || committee.name}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-sans mt-0.5 truncate max-w-md sm:max-w-xl">
                  {committee.agenda || 'Live committee seats, country allocations, and delegate rosters'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                title="Copy Matrix Link"
              >
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">{isCopied ? 'Copied!' : 'Share'}</span>
              </button>

              <Link
                href={fullMatrixUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 px-3.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold font-sans transition flex items-center gap-1.5 cursor-pointer shadow-sm group"
                title="Open Complete Public Matrix Page in New Tab"
              >
                <span>Full Matrix Page</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
                title="Close Matrix"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Metrics & Filters Strip */}
          <div className="px-5 sm:px-6 py-3.5 bg-neutral-950/70 border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
            {/* Stats Badges */}
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-neutral-400">
                Total: <strong className="text-white">{totalCount}</strong>
              </span>
              <span className="text-neutral-600">&bull;</span>
              <span className="text-emerald-400">
                Vacant: <strong>{vacantCount}</strong>
              </span>
              <span className="text-neutral-600">&bull;</span>
              <span className="text-cyan-400">
                Allocated: <strong>{allocatedCount}</strong>
              </span>
              {conferenceName && (
                <>
                  <span className="text-neutral-600 hidden sm:inline">&bull;</span>
                  <span className="text-neutral-400 hidden sm:inline truncate max-w-[200px]">
                    {conferenceName}
                  </span>
                </>
              )}
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1.5">
              {(['ALL', 'VACANT', 'ALLOCATED', 'P5'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setSelectedFilter(f)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition cursor-pointer ${
                    selectedFilter === f
                      ? 'bg-cyan-500 text-black font-bold shadow-sm shadow-cyan-500/20'
                      : 'bg-white/5 text-neutral-400 hover:text-white border border-white/10'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="p-4 sm:p-5 border-b border-white/5 bg-[#0a0f1c]/50 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search country, portfolio, delegate or category..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-xs font-sans focus:outline-none focus:border-cyan-400 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {categories.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 rounded-xl bg-[#0e1424] border border-white/10 text-xs text-neutral-300 font-mono focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="ALL">All Categories ({categories.length})</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}
          </div>

          {/* Status Message Notification */}
          {statusMessage && (
            <div className="mx-5 sm:mx-6 mt-3 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Portfolios Grid */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-2.5">
            {filteredPortfolios.length === 0 ? (
              <div className="py-16 text-center space-y-3 font-sans">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-neutral-400">
                  <Layers className="w-6 h-6 text-neutral-500" />
                </div>
                <h4 className="text-sm font-bold text-white">No Matching Portfolios Found</h4>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Try clearing your search query or switching filters to view all committee seats.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedFilter('ALL');
                    setSelectedCategory('ALL');
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-cyan-300 font-mono"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredPortfolios.map((p) => {
                  const isAllocated = p.status !== 'Vacant';
                  const isP5 = p.category === 'P5' || (p.subTitle && p.subTitle.includes('P5'));
                  const isAllocatingThis = allocatingSeatId === p.id;

                  return (
                    <div
                      key={p.id}
                      className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between space-y-3 ${
                        isAllocated
                          ? 'bg-[#0c1424]/60 border-cyan-500/20 hover:border-cyan-500/40'
                          : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-bold text-white font-sans flex items-center gap-1.5 leading-snug">
                            <span>{p.title}</span>
                            {isP5 && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono font-bold shrink-0">
                                VETO
                              </span>
                            )}
                          </h4>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border shrink-0 ${
                              isAllocated
                                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            }`}
                          >
                            {isAllocated ? 'Allocated' : 'Vacant'}
                          </span>
                        </div>

                        {p.subTitle && (
                          <p className="text-[11px] text-neutral-400 font-sans line-clamp-2">
                            {p.subTitle}
                          </p>
                        )}

                        {isAllocated && p.allocatedTo && (
                          <div className="pt-1 flex items-center gap-1.5 text-xs text-neutral-200 font-mono">
                            <UserCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span className="truncate">{p.allocatedTo}</span>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 border-t border-white/5">
                        {isAllocatingThis ? (
                          <div className="space-y-2 animate-fade-in">
                            <input
                              type="text"
                              value={assignDelegateName}
                              onChange={(e) => setAssignDelegateName(e.target.value)}
                              placeholder="Delegate Name..."
                              className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-cyan-500/40 text-xs text-white placeholder-neutral-500 focus:outline-none"
                              autoFocus
                            />
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleAssignSeat(p.id)}
                                className="flex-1 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setAllocatingSeatId(null);
                                  setAssignDelegateName('');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : isAllocated ? (
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-mono text-cyan-400/80">Active Delegate</span>
                            <button
                              type="button"
                              onClick={() => handleMarkVacant(p.id)}
                              className="text-[10px] font-mono text-neutral-400 hover:text-rose-400 transition"
                            >
                              Make Vacant
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setAllocatingSeatId(p.id);
                              setAssignDelegateName('');
                            }}
                            className="w-full py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 text-neutral-300 hover:text-cyan-300 text-xs font-mono font-medium transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <Plus className="w-3 h-3 text-cyan-400" />
                            <span>Allocate Seat</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-4 sm:p-5 border-t border-white/10 bg-neutral-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <span className="text-neutral-400 text-center sm:text-left">
              Changes update your committee dais rollcall and live session records instantly.
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link
                href={fullMatrixUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-bold flex items-center justify-center gap-1.5 transition"
              >
                <span>Open Full Page Matrix</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium transition"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
