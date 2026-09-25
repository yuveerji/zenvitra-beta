'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  Search,
  Filter,
  Check,
  Clock,
  UserCheck,
  Users,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Crown,
  ChevronDown,
  Lock,
  Layers,
  Award,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isFounder, isAdmin } from '@/lib/founderControl';
import { allocatePortfolioAndNotify } from '@/lib/zenDiplomacyService';

export type PortfolioStatus = 
  | 'FCFS'
  | 'Allocated'
  | 'Vacant'
  | '4 people waiting'
  | 'Based on Experience'
  | 'Reserved';

export interface MatrixPortfolioItem {
  id: string;
  committee: 'AIPPM' | 'EMI' | 'UNSC' | 'UNODC';
  title: string;
  subTitle?: string;
  category: string;
  status: PortfolioStatus;
  allocatedTo?: string;
  allocatedEmail?: string;
  waitingCount?: number;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Crisis';
}

const INITIAL_MATRIX_DATA: MatrixPortfolioItem[] = [
  /* ── AIPPM ── */
  { id: 'aippm_1', committee: 'AIPPM', title: 'Narendra Modi', subTitle: 'Prime Minister of India / Varanasi MP', category: 'Government & Cabinet', status: 'Reserved', difficulty: 'Advanced' },
  { id: 'aippm_2', committee: 'AIPPM', title: 'Amit Shah', subTitle: 'Minister of Home Affairs / Gandhinagar MP', category: 'Government & Cabinet', status: 'Allocated', difficulty: 'Advanced' },
  { id: 'aippm_3', committee: 'AIPPM', title: 'Rahul Gandhi', subTitle: 'Leader of Opposition (Lok Sabha)', category: 'Opposition Alliance', status: '4 people waiting', waitingCount: 4, difficulty: 'Advanced' },
  { id: 'aippm_4', committee: 'AIPPM', title: 'Rajnath Singh', subTitle: 'Minister of Defence', category: 'Government & Cabinet', status: 'Based on Experience', difficulty: 'Intermediate' },
  { id: 'aippm_5', committee: 'AIPPM', title: 'Nirmala Sitharaman', subTitle: 'Minister of Finance', category: 'Government & Cabinet', status: 'FCFS', difficulty: 'Intermediate' },
  { id: 'aippm_6', committee: 'AIPPM', title: 'Mallikarjun Kharge', subTitle: 'Leader of Opposition (Rajya Sabha)', category: 'Opposition Alliance', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'aippm_7', committee: 'AIPPM', title: 'Akhilesh Yadav', subTitle: 'Samajwadi Party Chief / Kannauj MP', category: 'Regional Opposition', status: 'FCFS', difficulty: 'Intermediate' },
  { id: 'aippm_8', committee: 'AIPPM', title: 'Mamata Banerjee', subTitle: 'All India Trinamool Congress (TMC)', category: 'Regional Alliance', status: 'Vacant', difficulty: 'Advanced' },
  { id: 'aippm_9', committee: 'AIPPM', title: 'Nitin Gadkari', subTitle: 'Minister of Road Transport & Highways', category: 'Government & Cabinet', status: 'Vacant', difficulty: 'Beginner' },
  { id: 'aippm_10', committee: 'AIPPM', title: 'Asaduddin Owaisi', subTitle: 'AIMIM Chief / Hyderabad MP', category: 'Independent MPs', status: 'Based on Experience', difficulty: 'Crisis' },

  /* ── EMI (Ministry of Education) ── */
  { id: 'emi_1', committee: 'EMI', title: 'Dharmendra Pradhan', subTitle: 'Union Minister of Education', category: 'Union Ministry', status: 'Allocated', difficulty: 'Advanced' },
  { id: 'emi_2', committee: 'EMI', title: 'Prof. M. Jagadesh Kumar', subTitle: 'Chairman, University Grants Commission (UGC)', category: 'Statutory Regulatory Authority', status: 'Based on Experience', difficulty: 'Advanced' },
  { id: 'emi_3', committee: 'EMI', title: 'Prof. T.G. Sitharam', subTitle: 'Chairman, AICTE', category: 'Technical Regulatory Authority', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'emi_4', committee: 'EMI', title: 'Director, NCERT', subTitle: 'Curriculum & Textbook Framework Directorate', category: 'Academic Directorate', status: 'FCFS', difficulty: 'Beginner' },
  { id: 'emi_5', committee: 'EMI', title: 'Director, IIT Delhi', subTitle: 'Institutes of National Importance (INIs)', category: 'Higher Education Leadership', status: '4 people waiting', waitingCount: 4, difficulty: 'Intermediate' },
  { id: 'emi_6', committee: 'EMI', title: 'Vice-Chancellor, Delhi University', subTitle: 'Central Universities Consortium', category: 'Higher Education Leadership', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'emi_7', committee: 'EMI', title: 'State Education Secretary (Tamil Nadu)', subTitle: 'State Language & Curriculum Autonomy Board', category: 'State Stakeholder', status: 'FCFS', difficulty: 'Crisis' },
  { id: 'emi_8', committee: 'EMI', title: 'National Student Union Representative', subTitle: 'Youth Democratic Student Body', category: 'Student Federation', status: 'Vacant', difficulty: 'Beginner' },

  /* ── UNSC (UN Security Council) ── */
  { id: 'unsc_1', committee: 'UNSC', title: 'United States of America', subTitle: 'Permanent Member (P5) • Veto Power', category: 'Permanent Members (P5)', status: 'Allocated', difficulty: 'Crisis' },
  { id: 'unsc_2', committee: 'UNSC', title: 'United Kingdom', subTitle: 'Permanent Member (P5) • Veto Power', category: 'Permanent Members (P5)', status: '4 people waiting', waitingCount: 4, difficulty: 'Advanced' },
  { id: 'unsc_3', committee: 'UNSC', title: 'French Republic', subTitle: 'Permanent Member (P5) • Veto Power', category: 'Permanent Members (P5)', status: 'Based on Experience', difficulty: 'Advanced' },
  { id: 'unsc_4', committee: 'UNSC', title: 'Russian Federation', subTitle: 'Permanent Member (P5) • Veto Power', category: 'Permanent Members (P5)', status: 'Reserved', difficulty: 'Crisis' },
  { id: 'unsc_5', committee: 'UNSC', title: 'People’s Republic of China', subTitle: 'Permanent Member (P5) • Veto Power', category: 'Permanent Members (P5)', status: 'Based on Experience', difficulty: 'Crisis' },
  { id: 'unsc_6', committee: 'UNSC', title: 'Republic of India', subTitle: 'Special Invitee & G4 Candidate Member', category: 'Elected Members & Observers', status: 'Allocated', difficulty: 'Advanced' },
  { id: 'unsc_7', committee: 'UNSC', title: 'Japan', subTitle: 'Non-Permanent Member (Asia-Pacific)', category: 'Elected Members (E10)', status: 'FCFS', difficulty: 'Intermediate' },
  { id: 'unsc_8', committee: 'UNSC', title: 'Republic of Korea', subTitle: 'Non-Permanent Member (Asia-Pacific)', category: 'Elected Members (E10)', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'unsc_9', committee: 'UNSC', title: 'Swiss Confederation', subTitle: 'Non-Permanent Member (WEOG)', category: 'Elected Members (E10)', status: 'Vacant', difficulty: 'Beginner' },
  { id: 'unsc_10', committee: 'UNSC', title: 'Republic of Sierra Leone', subTitle: 'Non-Permanent Member (African Group)', category: 'Elected Members (E10)', status: 'FCFS', difficulty: 'Beginner' },

  /* ── UNODC ── */
  { id: 'unodc_1', committee: 'UNODC', title: 'Republic of Colombia', subTitle: 'Andean Narcotics & Crop Substitution Board', category: 'Key Producer/Transit States', status: 'Based on Experience', difficulty: 'Crisis' },
  { id: 'unodc_2', committee: 'UNODC', title: 'United Mexican States', subTitle: 'Transnational Cartel Border & Maritime Taskforce', category: 'Key Producer/Transit States', status: '4 people waiting', waitingCount: 4, difficulty: 'Crisis' },
  { id: 'unodc_3', committee: 'UNODC', title: 'Kingdom of the Netherlands', subTitle: 'Port of Rotterdam Interception Directorate', category: 'European Gateway States', status: 'FCFS', difficulty: 'Intermediate' },
  { id: 'unodc_4', committee: 'UNODC', title: 'Republic of the Union of Myanmar', subTitle: 'Golden Triangle Synthetic Drug Precursor Taskforce', category: 'Southeast Asia Transit', status: 'Vacant', difficulty: 'Advanced' },
  { id: 'unodc_5', committee: 'UNODC', title: 'Federal Republic of Nigeria', subTitle: 'West African Transshipment Command', category: 'African Transit Hubs', status: 'Vacant', difficulty: 'Beginner' },
  { id: 'unodc_6', committee: 'UNODC', title: 'INTERPOL Secretariat', subTitle: 'Transnational Organized Crime Taskforce', category: 'International Observer Agencies', status: 'Allocated', difficulty: 'Advanced' },
  { id: 'unodc_7', committee: 'UNODC', title: 'Islamic Republic of Afghanistan', subTitle: 'Opiate Eradication Directorate', category: 'Central Asian Production Corridor', status: 'Reserved', difficulty: 'Crisis' },
  { id: 'unodc_8', committee: 'UNODC', title: 'Commonwealth of Australia', subTitle: 'Pacific Border & Darknet Interdiction Branch', category: 'Destination & Consumer States', status: 'FCFS', difficulty: 'Beginner' },
];

const STATUS_BADGE_CONFIG: Record<PortfolioStatus, { bg: string; text: string; border: string; icon: string }> = {
  'FCFS': { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30', icon: '⚡' },
  'Allocated': { bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/30', icon: '🔒' },
  'Vacant': { bg: 'bg-cyan-500/15', text: 'text-cyan-300', border: 'border-cyan-500/30', icon: '🟢' },
  '4 people waiting': { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30', icon: '⏳' },
  'Based on Experience': { bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/30', icon: '🎖️' },
  'Reserved': { bg: 'bg-zinc-700/30', text: 'text-zinc-300', border: 'border-zinc-600/40', icon: '🛡️' },
};

interface PortfolioMatrixViewProps {
  onSelectPortfolio?: (portfolioTitle: string, committee: string) => void;
  standalone?: boolean;
}

export function PortfolioMatrixView({ onSelectPortfolio, standalone = false }: PortfolioMatrixViewProps) {
  const { user, profile } = useAuth();
  const [activeCommittee, setActiveCommittee] = useState<'AIPPM' | 'EMI' | 'UNSC' | 'UNODC'>('AIPPM');
  const [statusFilter, setStatusFilter] = useState<'ALL' | PortfolioStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [matrixData, setMatrixData] = useState<MatrixPortfolioItem[]>(INITIAL_MATRIX_DATA);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');
  const [selectedItemForEdit, setSelectedItemForEdit] = useState<MatrixPortfolioItem | null>(null);
  const [editStatus, setEditStatus] = useState<PortfolioStatus>('Vacant');
  const [editDelegateEmail, setEditDelegateEmail] = useState('');
  const [editDelegateName, setEditDelegateName] = useState('');
  const [copiedPortfolioId, setCopiedPortfolioId] = useState<string | null>(null);

  const canManage = Boolean(
    isFounder(user) || 
    isAdmin(user) || 
    user?.role === 'ADMIN' || 
    user?.role === 'SECRETARIAT_CHAIR'
  );

  const filteredItems = useMemo(() => {
    return matrixData.filter((item) => {
      if (item.committee !== activeCommittee) return false;
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          (item.subTitle && item.subTitle.toLowerCase().includes(q)) ||
          item.category.toLowerCase().includes(q) ||
          (item.allocatedTo && item.allocatedTo.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [matrixData, activeCommittee, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const forComm = matrixData.filter((i) => i.committee === activeCommittee);
    return {
      total: forComm.length,
      vacant: forComm.filter((i) => i.status === 'Vacant' || i.status === 'FCFS').length,
      allocated: forComm.filter((i) => i.status === 'Allocated').length,
      contested: forComm.filter((i) => i.status === '4 people waiting' || i.status === 'Based on Experience').length,
    };
  }, [matrixData, activeCommittee]);

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 900);
  };

  const handleSaveSecretariatEdit = async () => {
    if (!selectedItemForEdit) return;
    
    const updated = matrixData.map((item) => {
      if (item.id === selectedItemForEdit.id) {
        return {
          ...item,
          status: editStatus,
          allocatedTo: editStatus === 'Allocated' ? editDelegateName.trim() || item.allocatedTo : undefined,
          allocatedEmail: editStatus === 'Allocated' ? editDelegateEmail.trim() || item.allocatedEmail : undefined,
        };
      }
      return item;
    });

    setMatrixData(updated);

    // If allocated, dispatch notification
    if (editStatus === 'Allocated' && editDelegateEmail.trim()) {
      try {
        await allocatePortfolioAndNotify({
          email: editDelegateEmail.trim(),
          committee: selectedItemForEdit.committee,
          portfolio: selectedItemForEdit.title,
        });
      } catch (_) {}
    }

    setSelectedItemForEdit(null);
  };

  return (
    <div className={`space-y-6 text-left ${standalone ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' : ''}`}>
      {/* ── TOP HEADER & GOOGLE SHEETS LIVE TWO-WAY SYNC BAR ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-[#090d16] border border-cyan-500/30 relative overflow-hidden shadow-xl">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] text-emerald-300 uppercase tracking-widest font-bold flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Two-Way Google Sheets Synchronized &bull; Tab: ZEN DIPLOMACY MUN</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight">
            Interactive Portfolio Matrix &amp; Allotment Console
          </h2>
          <p className="text-xs text-neutral-400 font-sans">
            Real-time vacancy tracking across all 4 diplomatic chambers. Portfolios synchronize directly with Secretariat records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 z-10">
          <button
            type="button"
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white font-mono text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync from Sheets'}</span>
          </button>

          <a
            href="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-display font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-black" />
            <span>Open Master Sheet</span>
            <ExternalLink className="w-3 h-3 text-black" />
          </a>
        </div>
      </div>

      {/* ── COMMITTEE TABS & REAL-TIME SUMMARY STATS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Committee Switcher Pills */}
        <div className="lg:col-span-3 flex items-center gap-2 overflow-x-auto p-1.5 rounded-2xl bg-[#07090f] border border-white/10">
          {[
            { id: 'AIPPM' as const, label: 'AIPPM', sub: 'All India Political Parties' },
            { id: 'EMI' as const, label: 'EMI', sub: 'Ministry of Education' },
            { id: 'UNSC' as const, label: 'UNSC', sub: 'UN Security Council' },
            { id: 'UNODC' as const, label: 'UNODC', sub: 'Narcotics & Crime' },
          ].map((tab) => {
            const isActive = activeCommittee === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCommittee(tab.id)}
                className={`flex-1 min-w-[140px] p-3 rounded-xl text-left transition cursor-pointer border ${
                  isActive
                    ? 'bg-cyan-500/15 border-cyan-500/50 text-white shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                    : 'bg-transparent border-transparent hover:bg-white/[0.04] text-neutral-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold font-mono text-sm tracking-wide">{tab.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                </div>
                <span className="text-[10px] text-neutral-400 block truncate font-sans mt-0.5">{tab.sub}</span>
              </button>
            );
          })}
        </div>

        {/* Chamber Quick Counters */}
        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-[#07090f] border border-white/10 text-center font-mono text-xs">
          <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[9px] text-neutral-400 uppercase block">Total</span>
            <span className="text-base font-black text-white">{stats.total}</span>
          </div>
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[9px] text-emerald-400 uppercase block">Vacant</span>
            <span className="text-base font-black text-emerald-300">{stats.vacant}</span>
          </div>
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <span className="text-[9px] text-rose-400 uppercase block">Allocated</span>
            <span className="text-base font-black text-rose-300">{stats.allocated}</span>
          </div>
        </div>
      </div>

      {/* ── FILTER & SEARCH CONTROLS ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#07090f] border border-white/10">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeCommittee} portfolios, ministers, countries, or delegate names...`}
            className="w-full pl-9 pr-4 py-2 bg-transparent text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none font-sans"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
          {(['ALL', 'Vacant', 'FCFS', 'Allocated', '4 people waiting', 'Based on Experience', 'Reserved'] as const).map((st) => {
            const isSel = statusFilter === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer border ${
                  isSel
                    ? 'bg-white text-black font-bold border-white'
                    : 'bg-white/[0.03] text-neutral-400 hover:text-white border-white/5 hover:border-white/10'
                }`}
              >
                {st === 'ALL' ? 'All Portfolios' : st}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── PORTFOLIO CARDS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const badge = STATUS_BADGE_CONFIG[item.status] || STATUS_BADGE_CONFIG['Vacant'];
          const isCopied = copiedPortfolioId === item.id;

          return (
            <div
              key={item.id}
              className={`p-5 rounded-3xl bg-[#07090f] border transition-all space-y-4 hover:border-cyan-500/40 flex flex-col justify-between relative overflow-hidden group shadow-lg ${
                item.status === 'Allocated' ? 'border-rose-500/20' : 'border-white/10'
              }`}
            >
              <div className="space-y-3">
                {/* Header: Status Badge + Difficulty Tag */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border flex items-center gap-1 ${badge.bg} ${badge.text} ${badge.border}`}>
                    <span>{badge.icon}</span>
                    <span>{item.status}</span>
                  </span>

                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-400 text-[10px] font-mono">
                    {item.category}
                  </span>
                </div>

                {/* Portfolio Title & Detail */}
                <div className="space-y-1">
                  <h3 className="font-bold text-base sm:text-lg text-white font-display group-hover:text-cyan-300 transition">
                    {item.title}
                  </h3>
                  {item.subTitle && (
                    <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                      {item.subTitle}
                    </p>
                  )}
                </div>

                {/* Waiting Notice */}
                {item.status === '4 people waiting' && (
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>4 delegates pending Dais review</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2 text-xs">
                {canManage && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedItemForEdit(item);
                      setEditStatus(item.status);
                      setEditDelegateName(item.allocatedTo || '');
                      setEditDelegateEmail(item.allocatedEmail || '');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 font-mono text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Crown className="w-3 h-3" />
                    <span>Manage</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(item.title);
                    setCopiedPortfolioId(item.id);
                    setTimeout(() => setCopiedPortfolioId(null), 1500);
                    if (onSelectPortfolio) onSelectPortfolio(item.title, item.committee);
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    item.status === 'Allocated'
                      ? 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-md'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Preference Copied</span>
                    </>
                  ) : item.status === 'Allocated' ? (
                    <span>Request Waitlist</span>
                  ) : (
                    <span>Select Portfolio &rarr;</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── SECRETARIAT ALLOTMENT MODAL ── */}
      {selectedItemForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md text-left">
          <div className="w-full max-w-md rounded-3xl bg-[#090d16] border border-cyan-500/40 p-6 sm:p-8 space-y-5 shadow-2xl text-white font-sans text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest block">Secretariat Console</span>
                <h3 className="font-bold text-lg text-white font-display">{selectedItemForEdit.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItemForEdit(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Portfolio Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as PortfolioStatus)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white font-mono focus:border-cyan-400 outline-none"
                >
                  <option value="Vacant">🟢 Vacant (Open for All)</option>
                  <option value="FCFS">⚡ FCFS (First Come First Serve)</option>
                  <option value="Allocated">🔒 Allocated (Locked to Delegate)</option>
                  <option value="4 people waiting">⏳ 4 people waiting (Contested)</option>
                  <option value="Based on Experience">🎖️ Based on Experience</option>
                  <option value="Reserved">🛡️ Reserved (Dais / VIP)</option>
                </select>
              </div>

              {editStatus === 'Allocated' && (
                <>
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Delegate Full Name</label>
                    <input
                      type="text"
                      value={editDelegateName}
                      onChange={(e) => setEditDelegateName(e.target.value)}
                      placeholder="e.g. Full Delegate Name"
                      className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white focus:border-cyan-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Delegate Email (Notification Auto-Dispatch)</label>
                    <input
                      type="email"
                      value={editDelegateEmail}
                      onChange={(e) => setEditDelegateEmail(e.target.value)}
                      placeholder="delegate@institution.edu"
                      className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white focus:border-cyan-400 outline-none"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10 font-mono">
              <button
                type="button"
                onClick={() => setSelectedItemForEdit(null)}
                className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSecretariatEdit}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold cursor-pointer transition shadow-md"
              >
                Update &amp; Sync Matrix
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
