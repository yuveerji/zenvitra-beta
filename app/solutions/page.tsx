'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ScrollText, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Award, 
  Users, 
  FileCheck, 
  Search, 
  Plus, 
  ThumbsUp, 
  Radio, 
  BookOpen, 
  ArrowRight,
  Shield,
  Newspaper,
  FileText,
  Filter,
  Download
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SolutionDocument, DocumentType, SolutionCategory } from '@/types/solutions';
import { DocEnginePostingModal } from '@/components/solutions/DocEnginePostingModal';
import { DocumentReaderModal } from '@/components/solutions/DocumentReaderModal';
import { RegisterSuggestionLayover } from '@/components/solutions/RegisterSuggestionLayover';
import { useAuth } from '@/context/AuthContext';
import { broadcastActivitySync } from '@/lib/reactiveActivityHub';
import { parseDocument } from '@/lib/docEngine/parser';
import { SAMPLE_DRAFTS } from '@/lib/docEngine/sampleDrafts';

/* ─────────── INITIAL SAMPLE BILL (OFFICIAL STRUCTURED MODEL) ─────────── */

function getInitialSeededDocuments(): SolutionDocument[] {
  const sample = SAMPLE_DRAFTS[0]; // Private Coaching Institutes Bill
  if (!sample) return [];
  const parsed = parseDocument(sample.rawText, 'LEGISLATIVE_BILL');
  return [{
    id: 'doc_coaching_institutes_2026',
    documentCode: 'BILL-2026-COACH-REG',
    title: parsed.title,
    documentType: 'LEGISLATIVE_BILL',
    category: 'EDUCATION',
    committee: 'Parliament of India / Lok Sabha Standing Committee',
    status: 'PROPOSED',
    leadSponsors: ['Hon. Member of Parliament', 'Youth Education Caucus'],
    proposedByUsername: 'parliament_caucus',
    signatories: ['Aarav Mehta', 'Diya Sen', 'Vikramaditya Roy'],
    abstract: parsed.preamble || 'A Bill to provide for mandatory registration, academic regulation, mental health counselors, fee transparency, and holistic student welfare standards in private coaching institutes across India.',
    enactingFormula: parsed.enactingFormula,
    preamble: parsed.preamble,
    chapters: parsed.chapters,
    clauses: parsed.clauses.map(c => ({
      ...c,
      discussions: c.clauseNumber === '7' ? [
        { id: 'comm_1', author: 'Dr. Anita Rao', authorUsername: 'anita_rao', text: '5 hours max instructional load is critical. Coaching centers currently conduct 8-9 hours without breaks.', createdAt: new Date(Date.now() - 3600000).toISOString() }
      ] : [],
      amendments: c.clauseNumber === '6' ? [
        { id: 'amend_1', author: 'Devendra K.', authorUsername: 'devendra_k', proposedText: 'Every coaching institute enrolling more than thirty students (reduced from fifty) shall maintain a mental health counselor.', rationale: 'Smaller batches also face extreme suicide vulnerability.', votes: 12, createdAt: new Date(Date.now() - 7200000).toISOString() }
      ] : []
    })),
    votes: {
      inFavor: 48,
      against: 3,
      abstain: 4
    },
    votedUserIds: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    isOfficial: true
  }];
}

const INITIAL_DOCUMENTS: SolutionDocument[] = getInitialSeededDocuments();

const TYPE_FILTERS: { type: DocumentType | 'ALL'; label: string; icon: React.ElementType }[] = [
  { type: 'ALL', label: 'All Documents', icon: BookOpen },
  { type: 'DRAFT_RESOLUTION', label: 'Draft Resolutions (Draft Res)', icon: ScrollText },
  { type: 'LEGISLATIVE_BILL', label: 'Bills & Acts', icon: FileCheck },
  { type: 'PRESS_RELEASE', label: 'Press Releases', icon: Newspaper },
  { type: 'TREATY_CHARTER', label: 'Treaties & Charters', icon: Shield },
  { type: 'WORKING_PAPER', label: 'Working Papers', icon: FileText },
];

const LS_SOLUTIONS = 'zenvitra_solutions_v2_clean';

export default function SolutionsPage() {
  const { isAuthenticated, isGuest, profile, user } = useAuth();

  const isTestUser = Boolean(
    profile?.username === 'test' || 
    user?.email === 'test@zenvitra.org' ||
    (typeof window !== 'undefined' && (() => {
      try {
        const s = JSON.parse(localStorage.getItem('zenvitra_session_user') || '{}');
        return s?.username === 'test' || s?.id === 'zen_test_pilot_node';
      } catch (_) { return false; }
    })())
  );

  const [documents, setDocuments] = useState<SolutionDocument[]>(() => {
    if (typeof window === 'undefined') return INITIAL_DOCUMENTS;
    try {
      const stored = localStorage.getItem(LS_SOLUTIONS);
      return stored ? JSON.parse(stored) : INITIAL_DOCUMENTS;
    } catch {
      return INITIAL_DOCUMENTS;
    }
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LS_SOLUTIONS, JSON.stringify(documents));
    } catch {}
  }, [documents]);

  const [selectedType, setSelectedType] = useState<DocumentType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isRegisterPromptOpen, setIsRegisterPromptOpen] = useState(false);
  const [activeReadingDoc, setActiveReadingDoc] = useState<SolutionDocument | null>(null);
  const [importedDraftData, setImportedDraftData] = useState<any>(null);

  // Check for incoming draft from ZenDocs editor
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('importZenDoc') === '1') {
      try {
        const importData = localStorage.getItem('zenvitra_solutions_import');
        if (importData) {
          const parsed = JSON.parse(importData);
          setImportedDraftData(parsed);
          setIsUploadModalOpen(true);
          localStorage.removeItem('zenvitra_solutions_import');
        }
      } catch (err) {
        console.error('Failed to import draft from ZenDocs:', err);
      }
    }
  }, []);

  const handleOpenUpload = () => {
    if (!isAuthenticated || isGuest) {
      setIsRegisterPromptOpen(true);
    } else {
      setIsUploadModalOpen(true);
    }
  };

  const handleDocumentCreated = (newDoc: SolutionDocument) => {
    if (isTestUser) {
      (newDoc as any).isTest = true;
      newDoc.proposedByUsername = 'test';
    }
    setDocuments([newDoc, ...documents]);
    setActiveReadingDoc(newDoc);
    broadcastActivitySync({ source: 'press', action: 'create', timestamp: Date.now() });
  };

  const handleUpdateDocument = (updatedDoc: SolutionDocument) => {
    setDocuments(prev => prev.map(d => d.id === updatedDoc.id ? updatedDoc : d));
    setActiveReadingDoc(updatedDoc);
  };

  const handleVote = (docId: string, voteType: 'IN_FAVOR' | 'AGAINST' | 'ABSTAIN') => {
    if (!isAuthenticated || isGuest) {
      setIsRegisterPromptOpen(true);
      return;
    }
    setDocuments(prev => prev.map(d => {
      if (d.id !== docId) return d;
      return {
        ...d,
        votes: {
          ...d.votes,
          inFavor: voteType === 'IN_FAVOR' ? d.votes.inFavor + 1 : d.votes.inFavor,
          against: voteType === 'AGAINST' ? d.votes.against + 1 : d.votes.against,
          abstain: voteType === 'ABSTAIN' ? d.votes.abstain + 1 : d.votes.abstain,
        }
      };
    }));
  };

  const filteredDocuments = documents.filter(doc => {
    const isDocTest = Boolean(
      (doc as any).isTest || 
      doc.proposedByUsername === 'test' || 
      doc.leadSponsors?.some(s => s.toLowerCase().includes('test'))
    );
    // If not test user, filter out test documents so main public platform remains clean
    if (!isTestUser && isDocTest) return false;

    const matchesType = selectedType === 'ALL' || doc.documentType === selectedType;
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.committee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.abstract.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#030407] text-white flex flex-col selection:bg-purple-500/30">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-20 space-y-10">
        {/* Sandbox Notice for Test Pilot User */}
        {isTestUser && (
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_0_30px_rgba(6,182,212,0.15)] animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <span className="px-2 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold tracking-wider uppercase text-[10px] shrink-0">
                🧪 TEST PILOT ENCLAVE
              </span>
              <span className="text-[11px] leading-relaxed text-neutral-200">
                Sandbox active: You can upload, test, edit, and vote on bills freely. All test drafts are isolated to your test enclave and will not appear on the main public platform.
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-[10px] uppercase shrink-0 self-start sm:self-auto">
              Main Platform Isolated
            </span>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>ZEN.SOLUTIONS • UNIVERSAL DOCUMENT ENGINE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight">
            Repository for Action Blueprints, Policy Bills &amp; Charters
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 font-sans leading-relaxed">
            Deposit, explore, and deliberate on community bills, student research drafts, policy frameworks, and collaborative action charters. Every document is automatically structured into interactive clauses for clause-level debate and redline amendments.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleOpenUpload}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-display font-bold text-xs uppercase tracking-wider hover:opacity-95 transition hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_25px_rgba(34,211,238,0.4)]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Post Bill &amp; Structured Document</span>
            </button>

            <Link
              href="/discussions"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/15 text-neutral-300 hover:text-white hover:bg-white/10 text-xs font-mono transition"
            >
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>Join Open Deliberations &rarr;</span>
            </Link>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="space-y-4">
          {/* Document Type Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {TYPE_FILTERS.map((f) => {
              const Icon = f.icon;
              const isSelected = selectedType === f.type;
              return (
                <button
                  key={f.type}
                  onClick={() => setSelectedType(f.type)}
                  className={`px-4 py-2 rounded-2xl border text-xs font-mono font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-white text-black border-white'
                      : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by document code, bill title, committee, or keywords (e.g., 'Coaching', 'Women Safety', 'UNGA')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400/50"
            />
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredDocuments.map((doc) => {
            const totalVotes = doc.votes.inFavor + doc.votes.against + doc.votes.abstain;
            const inFavorPercent = totalVotes > 0 ? Math.round((doc.votes.inFavor / totalVotes) * 100) : 100;
            const totalDebates = doc.clauses.reduce((acc, c) => acc + (c.discussions?.length || 0), 0);
            const totalAmendments = doc.clauses.reduce((acc, c) => acc + (c.amendments?.length || 0), 0);

            const badgeStyles: Record<string, string> = {
              DRAFT_RESOLUTION: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
              LEGISLATIVE_BILL: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
              PRESS_RELEASE: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
              TREATY_CHARTER: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300',
              WORKING_PAPER: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
            };

            return (
              <div
                key={doc.id}
                className="group relative rounded-3xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 p-6 space-y-4 transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col justify-between"
              >
                {/* Header */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-3 py-1 rounded-full border font-mono text-[10px] font-bold uppercase tracking-wider ${
                        badgeStyles[doc.documentType] || 'bg-white/10 border-white/20 text-white'
                      }`}>
                        {doc.documentType.replace('_', ' ')}
                      </span>
                      {Boolean((doc as any).isTest || doc.proposedByUsername === 'test') && (
                        <span className="px-2 py-0.5 rounded-full border border-cyan-400/40 bg-cyan-500/10 text-cyan-300 font-mono text-[9px] font-bold uppercase tracking-wider">
                          🧪 Test Draft
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-xs text-neutral-400 font-bold">
                      {doc.documentCode}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                    <span className="text-cyan-300 font-semibold">{doc.committee}</span>
                    <span>•</span>
                    <span>Proposed by <strong className="text-white">@{doc.proposedByUsername || doc.leadSponsors[0] || 'member'}</strong></span>
                  </div>

                  <h3 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-cyan-200 transition-colors leading-snug">
                    {doc.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-300 font-sans line-clamp-3 leading-relaxed font-light">
                    {doc.abstract}
                  </p>
                </div>

                {/* Meta & Actions */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex flex-wrap items-center justify-between text-xs font-mono text-neutral-400 gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-cyan-300 font-bold">{doc.clauses.length} Clauses</span>
                      {totalDebates > 0 && <span className="text-neutral-400">💬 {totalDebates} Debates</span>}
                      {totalAmendments > 0 && <span className="text-purple-300">⚖ {totalAmendments} Amendments</span>}
                    </div>

                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{inFavorPercent}% Aye ({totalVotes} votes)</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => setActiveReadingDoc(doc)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white text-neutral-200 hover:text-black font-mono text-xs font-bold transition flex items-center justify-center gap-2 border border-white/10 hover:border-white cursor-pointer shadow-sm"
                    >
                      <span>[→] Read Bill &amp; Clauses</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-16 space-y-3 rounded-3xl bg-white/[0.01] border border-white/10">
            <ScrollText className="w-10 h-10 text-neutral-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Policy or Solution Documents Found</h3>
            <p className="text-xs text-neutral-400">Be the first author, innovator, or researcher to structure and post a bill, draft resolution, or policy charter.</p>
            <button
              onClick={handleOpenUpload}
              className="mt-2 px-5 py-2.5 rounded-full bg-cyan-400 text-black font-mono text-xs font-bold hover:bg-cyan-300 transition cursor-pointer"
            >
              + Post Bill via ZEN.DOCENGINE
            </button>
          </div>
        )}
      </main>

      <Footer />

      {/* Suggestion Layover for Unregistered Guests */}
      <RegisterSuggestionLayover
        forceOpenModal={isRegisterPromptOpen}
        onCloseForceModal={() => setIsRegisterPromptOpen(false)}
      />

      {/* ZEN.DOCENGINE Universal Posting Modal */}
      <DocEnginePostingModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setImportedDraftData(null);
        }}
        onDocumentCreated={handleDocumentCreated}
        initialDraft={importedDraftData}
      />

      {/* Interactive Document Reader Modal */}
      <DocumentReaderModal
        isOpen={Boolean(activeReadingDoc)}
        onClose={() => setActiveReadingDoc(null)}
        document={activeReadingDoc}
        onVote={handleVote}
        onUpdateDocument={handleUpdateDocument}
      />
    </div>
  );
}

