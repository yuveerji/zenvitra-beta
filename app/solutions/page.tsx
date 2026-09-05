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
import { UploadDocumentModal } from '@/components/solutions/UploadDocumentModal';
import { DocumentReaderModal } from '@/components/solutions/DocumentReaderModal';
import { RegisterSuggestionLayover } from '@/components/solutions/RegisterSuggestionLayover';
import { useAuth } from '@/context/AuthContext';
import { broadcastActivitySync } from '@/lib/reactiveActivityHub';

/* ─────────── ZERO SEEDED DATA (CLEAN LIVE PLATFORM) ─────────── */

const INITIAL_DOCUMENTS: SolutionDocument[] = [];

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
  const { isAuthenticated, isGuest } = useAuth();
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

  const handleOpenUpload = () => {
    if (!isAuthenticated || isGuest) {
      setIsRegisterPromptOpen(true);
    } else {
      setIsUploadModalOpen(true);
    }
  };

  const handleDocumentCreated = (newDoc: SolutionDocument) => {
    setDocuments([newDoc, ...documents]);
    setActiveReadingDoc(newDoc);
    broadcastActivitySync({ source: 'press', action: 'create', timestamp: Date.now() });
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
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold uppercase tracking-widest">
            <ScrollText className="w-4 h-4 text-cyan-400" />
            <span>SOVEREIGN POLICY &amp; SOLUTION REPOSITORY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight">
            Repository for Action Blueprints, Policy Bills &amp; Charters
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 font-sans leading-relaxed">
            Deposit, explore, and deliberate on community bills, student research drafts, policy frameworks, and collaborative action charters authored by young thinkers, activists, and innovators worldwide.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleOpenUpload}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload &amp; Submit Document</span>
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
              placeholder="Search by document code, resolution title, committee, or keywords (e.g., 'UNGA', 'AI-GOV', 'Microgrid')..."
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
                className="group relative rounded-3xl bg-white/[0.02] border border-white/10 hover:border-white/25 p-6 space-y-4 transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col justify-between"
              >
                {/* Header */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-3 py-1 rounded-full border font-mono text-[10px] font-bold uppercase tracking-wider ${
                      badgeStyles[doc.documentType] || 'bg-white/10 border-white/20 text-white'
                    }`}>
                      {doc.documentType.replace('_', ' ')}
                    </span>
                    <span className="font-mono text-xs text-neutral-400 font-bold">
                      {doc.documentCode}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono uppercase text-cyan-300 font-semibold block">
                    {doc.committee}
                  </span>

                  <h3 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-cyan-200 transition-colors leading-snug">
                    {doc.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-300 font-sans line-clamp-3 leading-relaxed font-light">
                    {doc.abstract}
                  </p>
                </div>

                {/* Meta & Actions */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{doc.signatories.length} Signatories</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{inFavorPercent}% In Favor ({totalVotes} votes)</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => setActiveReadingDoc(doc)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white text-neutral-200 hover:text-black font-mono text-xs font-bold transition flex items-center justify-center gap-2 border border-white/10 hover:border-white cursor-pointer shadow-sm"
                    >
                      <span>[→] Read Full Document &amp; Clauses</span>
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
            <p className="text-xs text-neutral-400">Be the first author, innovator, or researcher to upload a draft resolution, policy paper, or bill.</p>
            <button
              onClick={handleOpenUpload}
              className="mt-2 px-5 py-2 rounded-full bg-white text-black font-mono text-xs font-bold"
            >
              + Upload Document
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

      {/* Upload Document Modal */}
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onDocumentCreated={handleDocumentCreated}
      />

      {/* Document Reader Modal */}
      <DocumentReaderModal
        isOpen={Boolean(activeReadingDoc)}
        onClose={() => setActiveReadingDoc(null)}
        document={activeReadingDoc}
        onVote={handleVote}
      />
    </div>
  );
}
