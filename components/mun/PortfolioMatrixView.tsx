'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
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
import { 
  allocatePortfolioAndNotify, 
  getStoredRegistrations, 
  DelegateRegistration 
} from '@/lib/zenDiplomacyService';
import { subscribeToActivitySync } from '@/lib/reactiveActivityHub';

export type PortfolioStatus = 
  | 'Allocated'
  | 'Vacant'
  | `${number} people waiting`
  | `${number} person waiting`
  | string;

export interface MatrixPortfolioItem {
  id: string;
  committee: 'AIPPM' | 'EMI' | 'UNSC' | 'ECOSOC' | 'UNODC';
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
  { id: 'aippm_1', committee: 'AIPPM', title: 'Narendra Modi', subTitle: 'Prime Minister of India / Varanasi MP', category: 'Government & Cabinet', status: 'Vacant', difficulty: 'Advanced' },
  { id: 'aippm_2', committee: 'AIPPM', title: 'Amit Shah', subTitle: 'Minister of Home Affairs / Gandhinagar MP', category: 'Government & Cabinet', status: 'Allocated', difficulty: 'Advanced' },
  { id: 'aippm_3', committee: 'AIPPM', title: 'Rahul Gandhi', subTitle: 'Leader of Opposition (Lok Sabha)', category: 'Opposition Alliance', status: 'Vacant', difficulty: 'Advanced' },
  { id: 'aippm_4', committee: 'AIPPM', title: 'Rajnath Singh', subTitle: 'Minister of Defence', category: 'Government & Cabinet', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'aippm_5', committee: 'AIPPM', title: 'Nirmala Sitharaman', subTitle: 'Minister of Finance', category: 'Government & Cabinet', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'aippm_6', committee: 'AIPPM', title: 'Mallikarjun Kharge', subTitle: 'Leader of Opposition (Rajya Sabha)', category: 'Opposition Alliance', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'aippm_7', committee: 'AIPPM', title: 'Akhilesh Yadav', subTitle: 'Samajwadi Party Chief / Kannauj MP', category: 'Regional Opposition', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'aippm_8', committee: 'AIPPM', title: 'Mamata Banerjee', subTitle: 'All India Trinamool Congress (TMC)', category: 'Regional Alliance', status: 'Vacant', difficulty: 'Advanced' },
  { id: 'aippm_9', committee: 'AIPPM', title: 'Nitin Gadkari', subTitle: 'Minister of Road Transport & Highways', category: 'Government & Cabinet', status: 'Vacant', difficulty: 'Beginner' },
  { id: 'aippm_10', committee: 'AIPPM', title: 'Asaduddin Owaisi', subTitle: 'AIMIM Chief / Hyderabad MP', category: 'Independent MPs', status: 'Vacant', difficulty: 'Crisis' },

  /* ── EMI (Ministry of Education) ── */
  { id: 'emi_1', committee: 'EMI', title: 'Dharmendra Pradhan', subTitle: 'Union Minister of Education', category: 'Union Ministry', status: 'Allocated', difficulty: 'Advanced' },
  { id: 'emi_2', committee: 'EMI', title: 'Prof. M. Jagadesh Kumar', subTitle: 'Chairman, University Grants Commission (UGC)', category: 'Statutory Regulatory Authority', status: 'Vacant', difficulty: 'Advanced' },
  { id: 'emi_3', committee: 'EMI', title: 'Prof. T.G. Sitharam', subTitle: 'Chairman, AICTE', category: 'Technical Regulatory Authority', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'emi_4', committee: 'EMI', title: 'Director, NCERT', subTitle: 'Curriculum & Textbook Framework Directorate', category: 'Academic Directorate', status: 'Vacant', difficulty: 'Beginner' },
  { id: 'emi_5', committee: 'EMI', title: 'Director, IIT Delhi', subTitle: 'Institutes of National Importance (INIs)', category: 'Higher Education Leadership', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'emi_6', committee: 'EMI', title: 'Vice-Chancellor, Delhi University', subTitle: 'Central Universities Consortium', category: 'Higher Education Leadership', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'emi_7', committee: 'EMI', title: 'State Education Secretary (Tamil Nadu)', subTitle: 'State Language & Curriculum Autonomy Board', category: 'State Stakeholder', status: 'Vacant', difficulty: 'Crisis' },
  { id: 'emi_8', committee: 'EMI', title: 'National Student Union Representative', subTitle: 'Youth Democratic Student Body', category: 'Student Federation', status: 'Vacant', difficulty: 'Beginner' },

  /* ── UNSC (UN Security Council) ── */
  { id: 'unsc_1', committee: 'UNSC', title: 'United States of America', subTitle: 'Permanent Member (P5) • Veto Power', category: 'Permanent Members (P5)', status: 'Allocated', difficulty: 'Crisis' },
  { id: 'unsc_2', committee: 'UNSC', title: 'United Kingdom', subTitle: 'Permanent Member (P5) • Veto Power', category: 'Permanent Members (P5)', status: 'Vacant', difficulty: 'Advanced' },
  { id: 'unsc_3', committee: 'UNSC', title: 'French Republic', subTitle: 'Permanent Member (P5) • Veto Power', category: 'Permanent Members (P5)', status: 'Vacant', difficulty: 'Advanced' },
  { id: 'unsc_4', committee: 'UNSC', title: 'Russian Federation', subTitle: 'Permanent Member (P5) • Veto Power', category: 'Permanent Members (P5)', status: 'Vacant', difficulty: 'Crisis' },
  { id: 'unsc_5', committee: 'UNSC', title: 'People’s Republic of China', subTitle: 'Permanent Member (P5) • Veto Power', category: 'Permanent Members (P5)', status: 'Vacant', difficulty: 'Crisis' },
  { id: 'unsc_6', committee: 'UNSC', title: 'Republic of India', subTitle: 'Special Invitee & G4 Candidate Member', category: 'Elected Members & Observers', status: 'Allocated', difficulty: 'Advanced' },
  { id: 'unsc_7', committee: 'UNSC', title: 'Japan', subTitle: 'Non-Permanent Member (Asia-Pacific)', category: 'Elected Members (E10)', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'unsc_8', committee: 'UNSC', title: 'Republic of Korea', subTitle: 'Non-Permanent Member (Asia-Pacific)', category: 'Elected Members (E10)', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'unsc_9', committee: 'UNSC', title: 'Swiss Confederation', subTitle: 'Non-Permanent Member (WEOG)', category: 'Elected Members (E10)', status: 'Vacant', difficulty: 'Beginner' },
  { id: 'unsc_10', committee: 'UNSC', title: 'Republic of Sierra Leone', subTitle: 'Non-Permanent Member (African Group)', category: 'Elected Members (E10)', status: 'Vacant', difficulty: 'Beginner' },

  /* ── ECOSOC ── */
  { id: 'ecosoc_1', committee: 'ECOSOC', title: 'Republic of India', subTitle: 'President of ECOSOC Bureau / Global South Anchor', category: 'Bureau & G20 Leadership', status: 'Allocated', difficulty: 'Advanced' },
  { id: 'ecosoc_2', committee: 'ECOSOC', title: 'United States of America', subTitle: 'Development Finance & Multilateral Aid Directorate', category: 'Major Donor Economies (OECD)', status: 'Vacant', difficulty: 'Advanced' },
  { id: 'ecosoc_3', committee: 'ECOSOC', title: 'Federal Republic of Germany', subTitle: 'Climate Adaptation & Green Transition Envoy', category: 'European Donor Economies', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'ecosoc_4', committee: 'ECOSOC', title: 'Federative Republic of Brazil', subTitle: 'Troika / Global Alliance Against Hunger & Poverty', category: 'Emerging Economies (G20/BRICS)', status: 'Vacant', difficulty: 'Advanced' },
  { id: 'ecosoc_5', committee: 'ECOSOC', title: 'Republic of South Africa', subTitle: 'African Union Debt Relief & Financing Caucus', category: 'African Group Leadership', status: 'Vacant', difficulty: 'Crisis' },
  { id: 'ecosoc_6', committee: 'ECOSOC', title: 'Barbados (Prime Minister Envoy)', subTitle: 'Bridgetown Initiative on Climate Finance Architecture', category: 'Small Island Developing States (SIDS)', status: 'Vacant', difficulty: 'Crisis' },
  { id: 'ecosoc_7', committee: 'ECOSOC', title: 'Republic of Kenya', subTitle: 'East African Energy Transition & Digital Development', category: 'Developing Economies', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'ecosoc_8', committee: 'ECOSOC', title: 'Japan', subTitle: 'SDGs Financing & International Development Agency (JICA)', category: 'Asia-Pacific Donor Economies', status: 'Vacant', difficulty: 'Beginner' },
];

function getStatusBadgeConfig(status: string): { bg: string; text: string; border: string; icon: string } {
  if (status === 'Allocated') {
    return { bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/30', icon: '🔒' };
  }
  if (status.includes('waiting')) {
    return { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30', icon: '⏳' };
  }
  return { bg: 'bg-cyan-500/15', text: 'text-cyan-300', border: 'border-cyan-500/30', icon: '🟢' };
}

interface PortfolioMatrixViewProps {
  onSelectPortfolio?: (portfolioTitle: string, committee: string) => void;
  standalone?: boolean;
}

export function PortfolioMatrixView({ onSelectPortfolio, standalone = false }: PortfolioMatrixViewProps) {
  const { user, profile } = useAuth();
  const [activeCommittee, setActiveCommittee] = useState<'AIPPM' | 'EMI' | 'UNSC' | 'ECOSOC'>('AIPPM');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Vacant' | 'Waiting' | 'Allocated'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [matrixData, setMatrixData] = useState<MatrixPortfolioItem[]>(INITIAL_MATRIX_DATA);
  const [registrations, setRegistrations] = useState<DelegateRegistration[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');
  const [isSheetsConnected, setIsSheetsConnected] = useState<boolean>(true);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string>('');
  const [selectedItemForEdit, setSelectedItemForEdit] = useState<MatrixPortfolioItem | null>(null);
  const [editStatus, setEditStatus] = useState<PortfolioStatus>('Vacant');
  const [editDelegateEmail, setEditDelegateEmail] = useState('');
  const [editDelegateName, setEditDelegateName] = useState('');
  const [copiedPortfolioId, setCopiedPortfolioId] = useState<string | null>(null);

  // Fetch live matrix portfolios from /api/matrix/sync (syncs with Google Sheets)
  const fetchLiveMatrixPortfolios = async () => {
    try {
      const res = await fetch('/api/matrix/sync', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.portfolios) && data.portfolios.length > 0) {
          setMatrixData(data.portfolios);
          if (data.spreadsheetUrl) setSpreadsheetUrl(data.spreadsheetUrl);
          if (data.syncedWithGoogleSheets !== undefined) {
            setIsSheetsConnected(Boolean(data.syncedWithGoogleSheets));
          }
        }
      }
    } catch (err) {
      console.warn('[MATRIX-FETCH-WARN]', err);
    }
  };

  // Subscribe to live delegate registrations and periodic Google Sheets sync
  useEffect(() => {
    fetchLiveMatrixPortfolios();
    const interval = setInterval(fetchLiveMatrixPortfolios, 25000);

    const loadRegistrations = () => {
      setRegistrations(getStoredRegistrations());
    };
    loadRegistrations();
    const unsub = subscribeToActivitySync(() => {
      loadRegistrations();
    });
    return () => {
      clearInterval(interval);
      unsub();
    };
  }, []);

  const canManage = Boolean(
    isFounder(user) || 
    isAdmin(user) || 
    user?.role === 'ADMIN' || 
    user?.role === 'SECRETARIAT_CHAIR'
  );

  // Dynamically compute real-time waiting count based on stored live registrations
  const liveMatrixData = useMemo(() => {
    return matrixData.map((item) => {
      // If already allocated (e.g. officially assigned), keep Allocated
      if (item.status === 'Allocated') {
        return item;
      }

      // Calculate real waiting delegates who applied for this chamber & portfolio
      const comm = item.committee.toUpperCase();
      const waitingCount = registrations.filter((reg) => {
        // Delegate must not already be allocated
        if (reg.status === 'ALLOCATED') return false;

        // Check committee choice
        const first = (reg.firstCommitteeChoice || '').toUpperCase();
        const second = (reg.secondCommitteeChoice || '').toUpperCase();
        const matchesCommittee = first.includes(comm) || second.includes(comm);
        if (!matchesCommittee) return false;

        // Check if preferences mention this portfolio title or common aliases
        const prefs = (reg.portfolioPreferences || '').toLowerCase();
        const title = item.title.toLowerCase();
        if (prefs.includes(title)) return true;

        // Common diplomatic aliases
        const aliases: Record<string, string[]> = {
          'rahul gandhi': ['rahul', 'rg'],
          'narendra modi': ['modi', 'namo', 'prime minister'],
          'amit shah': ['amit shah', 'shah'],
          'rajnath singh': ['rajnath'],
          'nirmala sitharaman': ['nirmala', 'sitharaman'],
          'mallikarjun kharge': ['kharge'],
          'akhilesh yadav': ['akhilesh', 'samajwadi'],
          'mamata banerjee': ['mamata', 'tmc', 'banerjee'],
          'nitin gadkari': ['gadkari'],
          'asaduddin owaisi': ['owaisi', 'aimim'],
          'french republic': ['france', 'french'],
          'united kingdom': ['uk', 'britain', 'england'],
          'russian federation': ['russia', 'russian'],
          'people’s republic of china': ['china', 'prc', 'chinese'],
          'united states of america': ['usa', 'us', 'america'],
          'republic of india': ['india', 'indian'],
          'republic of colombia': ['colombia'],
          'united mexican states': ['mexico', 'mexican'],
          'kingdom of the netherlands': ['netherlands', 'holland', 'dutch'],
          'republic of the union of myanmar': ['myanmar', 'burma'],
          'federal republic of nigeria': ['nigeria'],
          'islamic republic of afghanistan': ['afghanistan'],
          'commonwealth of australia': ['australia'],
        };

        const extraKeywords = aliases[title] || [];
        return extraKeywords.some((kw) => prefs.includes(kw));
      }).length;

      const dynamicStatus = waitingCount > 0
        ? `${waitingCount} ${waitingCount === 1 ? 'person waiting' : 'people waiting'}`
        : 'Vacant';

      return {
        ...item,
        status: dynamicStatus,
        waitingCount,
      };
    });
  }, [matrixData, registrations]);

  const filteredItems = useMemo(() => {
    return liveMatrixData.filter((item) => {
      const matchCommittee = activeCommittee === 'ECOSOC' 
        ? (item.committee === 'ECOSOC' || (item.committee as string) === 'UNODC')
        : item.committee === activeCommittee;
      if (!matchCommittee) return false;
      if (statusFilter === 'Vacant' && item.status !== 'Vacant') return false;
      if (statusFilter === 'Allocated' && item.status !== 'Allocated') return false;
      if (statusFilter === 'Waiting' && !item.status.includes('waiting')) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          (item.subTitle && item.subTitle.toLowerCase().includes(q)) ||
          item.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [liveMatrixData, activeCommittee, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const forComm = liveMatrixData.filter((i) => 
      activeCommittee === 'ECOSOC'
        ? (i.committee === 'ECOSOC' || (i.committee as string) === 'UNODC')
        : i.committee === activeCommittee
    );
    return {
      total: forComm.length,
      vacant: forComm.filter((i) => i.status === 'Vacant').length,
      waiting: forComm.filter((i) => i.status.includes('waiting')).length,
      allocated: forComm.filter((i) => i.status === 'Allocated').length,
    };
  }, [liveMatrixData, activeCommittee]);

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    setRegistrations(getStoredRegistrations());
    await fetchLiveMatrixPortfolios();
    setIsSyncing(false);
    setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
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

    // 1. Dispatch update to /api/matrix/sync to persist locally & push to Google Sheets
    try {
      await fetch('/api/matrix/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portfolioId: selectedItemForEdit.id,
          portfolioTitle: selectedItemForEdit.title,
          title: selectedItemForEdit.title,
          status: editStatus,
          allocatedTo: editStatus === 'Allocated' ? editDelegateName.trim() : '',
          allocatedEmail: editStatus === 'Allocated' ? editDelegateEmail.trim() : '',
          committee: selectedItemForEdit.committee
        })
      });
    } catch (syncErr) {
      console.warn('[MATRIX-POST-SYNC-WARN]', syncErr);
    }

    // 2. If allocated, dispatch notification & sheets sync
    if (editStatus === 'Allocated' && editDelegateEmail.trim()) {
      try {
        await allocatePortfolioAndNotify({
          email: editDelegateEmail.trim(),
          name: editDelegateName.trim() || undefined,
          committee: selectedItemForEdit.committee,
          portfolio: selectedItemForEdit.title,
        });
      } catch (_) {}
    }

    setSelectedItemForEdit(null);
  };

  return (
    <div className={`space-y-6 text-left ${standalone ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' : ''}`}>
      {/* ── TOP HEADER & SOVEREIGN CHAMBERS LIVE MATRIX BAR ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-[#090d16] border border-cyan-500/30 relative overflow-hidden shadow-xl">
        <div className="space-y-1 z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-[10px] text-cyan-300 uppercase tracking-widest font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sovereign Dais Matrix &bull; Live Real-Time Synchronized</span>
            </span>
            {spreadsheetUrl && (
              <a
                href={spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:underline"
              >
                <ExternalLink className="w-2.5 h-2.5" />
                <span>Open GSheet</span>
              </a>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight">
            Interactive Portfolio Matrix &amp; Allotment Console
          </h2>
          <p className="text-xs text-neutral-400 font-sans">
            Real-time live vacancy and waiting list tracking across all 4 diplomatic chambers. Portfolios update dynamically as delegate forms are recorded and sync with Google Sheets.
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
            <span>{isSyncing ? 'Refreshing...' : 'Refresh Matrix'}</span>
          </button>

          <Link
            href="/forms/zen-diplomacy-2026"
            className="px-4 py-2 rounded-xl bg-[#e2f952] hover:bg-[#d6f03d] text-black font-display font-black text-xs uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>Register Delegate Seat</span>
          </Link>
        </div>
      </div>

      {/* ── COMMITTEE TABS & REAL-TIME SUMMARY STATS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Committee Switcher Pills */}
        <div className="lg:col-span-3 flex items-center gap-2 overflow-x-auto p-1.5 rounded-2xl bg-[#07090f] border border-white/10">
          {[
            { id: 'AIPPM' as const, label: 'AIPPM', sub: 'All India Political Parties' },
            { id: 'EMI' as const, label: 'EMI', sub: 'Education Ministry (EMI)' },
            { id: 'UNSC' as const, label: 'UNSC', sub: 'UN Security Council' },
            { id: 'ECOSOC' as const, label: 'ECOSOC', sub: 'Economic & Social Council' },
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

        {/* Chamber Quick Counters (4 Real-Time Metrics) */}
        <div className="grid grid-cols-4 gap-1.5 p-2 rounded-2xl bg-[#07090f] border border-white/10 text-center font-mono text-xs">
          <div className="p-1.5 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[9px] text-neutral-400 uppercase block">Total</span>
            <span className="text-sm sm:text-base font-black text-white">{stats.total}</span>
          </div>
          <div className="p-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <span className="text-[9px] text-cyan-400 uppercase block">Vacant</span>
            <span className="text-sm sm:text-base font-black text-cyan-300">{stats.vacant}</span>
          </div>
          <div className="p-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <span className="text-[9px] text-amber-400 uppercase block">Waiting</span>
            <span className="text-sm sm:text-base font-black text-amber-300">{stats.waiting}</span>
          </div>
          <div className="p-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <span className="text-[9px] text-rose-400 uppercase block">Allocated</span>
            <span className="text-sm sm:text-base font-black text-rose-300">{stats.allocated}</span>
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
            placeholder={`Search ${activeCommittee} portfolios, ministers, or countries...`}
            className="w-full pl-9 pr-4 py-2 bg-transparent text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none font-sans"
          />
        </div>

        {/* Real Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
          {(['ALL', 'Vacant', 'Waiting', 'Allocated'] as const).map((st) => {
            const isSel = statusFilter === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer border ${
                  isSel
                    ? 'bg-white text-black font-bold border-white'
                    : 'bg-white/[0.03] text-neutral-400 hover:text-white border-white/5 hover:border-white/10'
                }`}
              >
                {st === 'ALL' ? 'All Portfolios' : st === 'Waiting' ? 'In Demand (Waiting)' : st}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── PORTFOLIO CARDS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const badge = getStatusBadgeConfig(item.status);
          const isCopied = copiedPortfolioId === item.id;

          return (
            <div
              key={item.id}
              className={`p-5 rounded-3xl bg-[#07090f] border transition-all space-y-4 hover:border-cyan-500/40 flex flex-col justify-between relative overflow-hidden group shadow-lg ${
                item.status === 'Allocated' ? 'border-rose-500/20' : 'border-white/10'
              }`}
            >
              <div className="space-y-3">
                {/* Header: Status Badge + Category Tag */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border flex items-center gap-1.5 ${badge.bg} ${badge.text} ${badge.border}`}>
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

                {/* Dynamic Real Waiting Notice */}
                {item.status.includes('waiting') && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-300 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{item.status} under Secretariat review</span>
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
                      setEditStatus(item.status === 'Allocated' ? 'Allocated' : 'Vacant');
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
                      : item.status.includes('waiting')
                      ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-md'
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
                  ) : item.status.includes('waiting') ? (
                    <span>Join Waitlist &rarr;</span>
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
                  value={editStatus === 'Allocated' ? 'Allocated' : 'Vacant'}
                  onChange={(e) => setEditStatus(e.target.value as PortfolioStatus)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white font-mono focus:border-cyan-400 outline-none"
                >
                  <option value="Vacant">🟢 Vacant (Open for All / Live Counter)</option>
                  <option value="Allocated">🔒 Allocated (Officially Assigned)</option>
                </select>
              </div>

              {editStatus === 'Allocated' && (
                <>
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Delegate Full Name (Internal Record)</label>
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
