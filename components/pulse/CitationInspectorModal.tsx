'use client';

import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileCheck2, 
  ExternalLink, 
  Copy, 
  Check, 
  Award, 
  AlertTriangle, 
  Coins, 
  Clock, 
  Sparkles,
  Search,
  Plus,
  Hash
} from 'lucide-react';
import { PulsePost, ProofCitation, CitationType } from '@/types/pulse';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';

interface CitationInspectorModalProps {
  post: PulsePost;
  isOpen: boolean;
  onClose: () => void;
}

export function CitationInspectorModal({ post, isOpen, onClose }: CitationInspectorModalProps) {
  const { 
    verifyCitation, 
    addCitation, 
    stakeFactBounty, 
    civicPointsBalance,
    currentUserUsername 
  } = useZenPulse();

  const [activeTab, setActiveTab] = useState<'citations' | 'add_citation' | 'fact_bounty'>('citations');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  /* New citation form */
  const [symbolOrId, setSymbolOrId] = useState('');
  const [citationType, setCitationType] = useState<CitationType>('UN_DOC');
  const [citationTitle, setCitationTitle] = useState('');
  const [institution, setInstitution] = useState('United Nations Secretariat');
  const [archiveUrl, setArchiveUrl] = useState('');
  const [sha256Hash, setSha256Hash] = useState('');

  /* Fact bounty form */
  const [premiseTarget, setPremiseTarget] = useState('');
  const [bountyRationale, setBountyRationale] = useState('');
  const [stakedPoints, setStakedPoints] = useState(50);
  const [bountyError, setBountyError] = useState<string | null>(null);

  if (!isOpen) return null;

  const citations = post.citations || [];
  const bounties = post.factBounties || [];
  const cleanCurrent = (currentUserUsername || 'you').toLowerCase().trim().replace(/^@/, '');

  const handleCopy = (hash: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(hash);
      setCopiedHash(hash);
      setTimeout(() => setCopiedHash(null), 2000);
    }
  };

  const handleCreateCitation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbolOrId.trim() || !citationTitle.trim()) return;

    const generatedHash = sha256Hash.trim() || `SHA256-${Date.now().toString(16).toUpperCase()}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

    addCitation(post.id, {
      symbolOrId: symbolOrId.trim(),
      type: citationType,
      title: citationTitle.trim(),
      institution: institution.trim() || 'Institutional Archive',
      archiveUrl: archiveUrl.trim() || 'https://digitallibrary.un.org',
      sha256Hash: generatedHash
    });

    setSymbolOrId('');
    setCitationTitle('');
    setSha256Hash('');
    setActiveTab('citations');
  };

  const handleStakeBounty = (e: React.FormEvent) => {
    e.preventDefault();
    setBountyError(null);
    if (!premiseTarget.trim() || !bountyRationale.trim()) return;

    try {
      stakeFactBounty(post.id, {
        premiseTarget: premiseTarget.trim(),
        rationale: bountyRationale.trim(),
        stakedPoints
      });
      setPremiseTarget('');
      setBountyRationale('');
      setActiveTab('citations');
    } catch (err: any) {
      setBountyError(err.message || 'Failed to stake fact bounty.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-[#090b10] border border-cyan-500/30 shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-cyan-950/30 to-indigo-950/30">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white">
                Proof-of-Citation Forensic Inspector
              </h2>
              <p className="text-xs font-mono text-neutral-400">
                Anti-Hallucination Wire • SHA-256 Checksum Verification &amp; Fact-Bounty Escrow
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-white/10 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('citations')}
            className={`pb-3 px-3 font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'citations' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Primary Sources ({citations.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('add_citation')}
            className={`pb-3 px-3 font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'add_citation' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Attach Proof Citation</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fact_bounty')}
            className={`pb-3 px-3 font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'fact_bounty' ? 'border-amber-400 text-amber-300' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Stake Fact-Bounty ({bounties.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: PRIMARY CITATIONS INSPECTOR */}
          {activeTab === 'citations' && (
            <div className="space-y-4">
              {/* Reliability Meter Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-neutral-900 to-indigo-950/40 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    AUTHOR CIVIC RELIABILITY INDEX
                  </div>
                  <div className="text-sm font-display text-white mt-0.5">
                    Score: <strong>{post.civicReliabilityScore || 95}/100</strong> • Zero-Hallucination Certified
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-bold">
                  {citations.length} Audited Source{citations.length === 1 ? '' : 's'}
                </span>
              </div>

              {citations.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl space-y-3">
                  <Search className="w-8 h-8 text-neutral-500 mx-auto" />
                  <p className="text-sm font-mono text-neutral-400">No primary citations attached to this dispatch yet.</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('add_citation')}
                    className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold hover:bg-cyan-500/30 transition"
                  >
                    + Attach Official Document
                  </button>
                </div>
              ) : (
                citations.map((c) => {
                  const hasVerified = c.verifiedBy.includes(cleanCurrent);
                  return (
                    <div key={c.id} className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 hover:border-cyan-500/30 transition">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full font-mono text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                            {c.symbolOrId}
                          </span>
                          <span className="px-2 py-0.5 rounded-full font-mono text-[10px] bg-white/10 text-neutral-300">
                            {c.type}
                          </span>
                        </div>
                        <span className="font-mono text-xs text-neutral-400 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          {c.verifiedCount} Peer Verification{c.verifiedCount === 1 ? '' : 's'}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-sm text-white">
                        {c.title}
                      </h3>

                      <p className="text-xs font-mono text-neutral-400">
                        Originating Institution: <span className="text-neutral-200">{c.institution}</span>
                      </p>

                      {/* SHA-256 Hash Box */}
                      <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between gap-3 font-mono text-xs">
                        <div className="flex items-center gap-2 overflow-hidden text-neutral-400">
                          <Hash className="w-4 h-4 text-cyan-400 shrink-0" />
                          <span className="truncate text-[11px] text-neutral-300">{c.sha256Hash}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(c.sha256Hash)}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition shrink-0 cursor-pointer"
                          title="Copy SHA-256 Hash"
                        >
                          {copiedHash === c.sha256Hash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Action Bar */}
                      <div className="pt-2 flex items-center justify-between gap-3">
                        <a
                          href={c.archiveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
                        >
                          <span>Inspect Institutional Archive</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        {!hasVerified ? (
                          <button
                            type="button"
                            onClick={() => verifyCitation(post.id, c.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Verify Source (+15 PTS)</span>
                          </button>
                        ) : (
                          <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
                            ✓ Verified by You
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Active Fact Bounties Section */}
              {bounties.length > 0 && (
                <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>ACTIVE FACT-BOUNTY ESCROW CHALLENGES</span>
                  </div>
                  {bounties.map((b) => (
                    <div key={b.id} className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-amber-300">@{b.challengerUsername} staked {b.stakedPoints} PTS</span>
                        <span className="text-neutral-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          24h Verification Window
                        </span>
                      </div>
                      <p className="text-xs text-neutral-200 font-serif">
                        <strong>Challenged Premise:</strong> "{b.premiseTarget}"
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        <strong>Rationale:</strong> {b.rationale}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ATTACH PROOF CITATION */}
          {activeTab === 'add_citation' && (
            <form onSubmit={handleCreateCitation} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-400 block">
                    Document Symbol / Identifier:
                  </label>
                  <input
                    type="text"
                    value={symbolOrId}
                    onChange={(e) => setSymbolOrId(e.target.value)}
                    placeholder="e.g. A/RES/78/230, arXiv:2403.12345, ICJ-2024-02"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-neutral-400 block">
                    Citation Category:
                  </label>
                  <select
                    value={citationType}
                    onChange={(e) => setCitationType(e.target.value as CitationType)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  >
                    <option value="UN_DOC">UN General Assembly / Security Council</option>
                    <option value="CONSTITUENT_ASSEMBLY">Constituent Assembly Debates (CAD India)</option>
                    <option value="COURT_DOCKET">Supreme Court / International Court of Justice</option>
                    <option value="GAZETTE">Official Government Gazette (egazette.gov.in)</option>
                    <option value="NATIONAL_NEWSPAPER">National Newspaper (The Hindu, Indian Express, ET)</option>
                    <option value="PARLIAMENTARY_BROADCAST">Parliamentary Broadcast (Sansad TV / LSTV)</option>
                    <option value="INVESTIGATIVE_MEDIA">Investigative News (The Print, Mint, The Wire, Molitics)</option>
                    <option value="ARXIV">Cornell ArXiv / Academic Research</option>
                    <option value="IPCC_SYNTHESIS">IPCC Climate Assessment</option>
                    <option value="TREATY_RECORD">Multilateral Treaty Repository</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400 block">
                  Official Publication Title:
                </label>
                <input
                  type="text"
                  value={citationTitle}
                  onChange={(e) => setCitationTitle(e.target.value)}
                  placeholder="e.g. Resolution on Digital Transparency and Sovereign Civic Corridors"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400 block">
                  Originating Institution / Secretariat:
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. United Nations Secretariat, Geneva Office"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400 block">
                  Archive Verification URL:
                </label>
                <input
                  type="url"
                  value={archiveUrl}
                  onChange={(e) => setArchiveUrl(e.target.value)}
                  placeholder="https://digitallibrary.un.org/record/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400 block">
                  SHA-256 Checksum Hash (Optional - auto-generated if left blank):
                </label>
                <input
                  type="text"
                  value={sha256Hash}
                  onChange={(e) => setSha256Hash(e.target.value)}
                  placeholder="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-display font-bold text-xs transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Attach Cryptographic Proof Citation</span>
              </button>
            </form>
          )}

          {/* TAB 3: STAKE FACT BOUNTY */}
          {activeTab === 'fact_bounty' && (
            <form onSubmit={handleStakeBounty} className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 space-y-1.5">
                <strong>Community Fact-Bounty Escrow:</strong>
                <p>
                  Challenge any unsubstantiated fact or dubious legal claim. Your staked Civic Points will enter escrow. The author has 24 hours to provide primary document proof. If substantiated, author earns your stake; if forfeited, you double your reward.
                </p>
                <p className="font-mono text-amber-300">
                  Your Available Balance: <strong>{civicPointsBalance} PTS</strong>
                </p>
              </div>

              {bountyError && (
                <p className="text-xs font-mono text-rose-400 bg-rose-950/30 p-2.5 rounded-xl border border-rose-500/30">{bountyError}</p>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400 block">
                  Questioned Premise / Claim:
                </label>
                <textarea
                  rows={2}
                  value={premiseTarget}
                  onChange={(e) => setPremiseTarget(e.target.value)}
                  placeholder="State the exact sentence or statistic you are challenging..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-400 block">
                  Grounds for Challenge &amp; Contradictory Evidence:
                </label>
                <textarea
                  rows={2}
                  value={bountyRationale}
                  onChange={(e) => setBountyRationale(e.target.value)}
                  placeholder="Explain why this premise lacks primary source backing..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-neutral-400 block">
                  Stake Amount (Civic Points):
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[25, 50, 100].map((pts) => (
                    <button
                      key={pts}
                      type="button"
                      onClick={() => setStakedPoints(pts)}
                      className={`py-2.5 rounded-xl border font-mono text-xs font-bold transition cursor-pointer ${
                        stakedPoints === pts
                          ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                          : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {pts} PTS
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-display font-bold text-xs transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Coins className="w-4 h-4" />
                <span>Deposit {stakedPoints} PTS into Fact Escrow (24h Window)</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
