'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Gavel, 
  Vote, 
  Plus, 
  Download, 
  CheckCircle2, 
  Sparkles,
  Scale,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { TestNodeProvider, useTestNode } from '@/context/TestNodeContext';
import { TestNodeShell } from '@/components/test-node/TestNodeShell';

function TestSolutionsContent() {
  const { documents, castVote, submitDocument, activePersona } = useTestNode();
  const [selectedDocId, setSelectedDocId] = useState(documents[0].id);

  // New Document Modal Form
  const [showNewDocForm, setShowNewDocForm] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docCommittee, setDocCommittee] = useState('United Nations Security Council');
  const [preambleInput, setPreambleInput] = useState('Recognizing the sovereignty of multilateral pacts,');
  const [operativeInput, setOperativeInput] = useState('1. Urges all Member States to adopt transparent verification mechanisms;');

  const activeDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;
    submitDocument({
      title: docTitle.trim(),
      committee: docCommittee,
      category: docCommittee.includes('Lok') ? 'PARLIAMENTARY_BILL' : 'UN_RESOLUTION',
      preambles: [preambleInput.trim()],
      operatives: [operativeInput.trim()],
    });
    setDocTitle('');
    setShowNewDocForm(false);
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-950/40 via-[#0a0d18] to-black border border-teal-500/30 space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 font-mono text-[10px] uppercase font-bold tracking-wider">
            ZEN.SOLUTIONS // POLICY &amp; DRAFTING STUDIO
          </span>
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
            ILLUSTRATIVE PROPOSALS ONLY
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase font-display">
          Multilateral Draft Legislation &amp; UN Resolutions
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl font-sans">
          Experiment with structured clause-by-clause drafting, sponsor consensus, and real-time roll-call voting. Documents here are fictional pedagogical examples.
        </p>

        {/* Disclaimer Warning */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-[11px] font-mono text-neutral-400">
          ⚠️ DISCLAIMER: All bills, resolutions, and amendments presented in this test node are student simulation exercises and do not constitute official legislation or state policy.
        </div>
      </div>

      {/* Main Two-Column View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Document Selector & New Doc Form (4 Cols) */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-[#080d1c] border border-white/15 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-mono text-white font-bold uppercase">Working Papers ({documents.length})</span>
            <button
              type="button"
              onClick={() => setShowNewDocForm(!showNewDocForm)}
              className="px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>+ Draft Paper</span>
            </button>
          </div>

          {showNewDocForm && (
            <form onSubmit={handleCreateDocument} className="p-4 rounded-2xl bg-white/5 border border-teal-500/40 space-y-3 font-mono text-xs">
              <div>
                <label className="text-[10px] text-neutral-400 uppercase block mb-1">Document Title</label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. Protocol on Outer Space Debris Interception..."
                  className="w-full bg-[#111422] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-400"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 uppercase block mb-1">Target Chamber</label>
                <select
                  value={docCommittee}
                  onChange={(e) => setDocCommittee(e.target.value)}
                  className="w-full bg-[#111422] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  <option value="United Nations Security Council">UN Security Council</option>
                  <option value="Lok Sabha">Lok Sabha</option>
                  <option value="United Nations Human Rights Council">UNHRC</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setShowNewDocForm(false)} className="px-3 py-1 text-neutral-400">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-teal-400 text-black font-bold">Introduce</button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {documents.map((doc) => {
              const isSelected = doc.id === selectedDocId;
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'bg-teal-500/15 border-teal-500/50 shadow-[0_0_20px_rgba(20,184,166,0.15)] text-white'
                      : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/10 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="font-bold text-teal-300">{doc.code}</span>
                    <span className="px-1.5 py-0.2 rounded bg-white/10 text-neutral-400 uppercase font-bold text-[9px]">{doc.status}</span>
                  </div>
                  <div className="text-xs font-bold leading-snug line-clamp-2">{doc.title}</div>
                  <div className="text-[10px] font-mono text-neutral-500">{doc.committee}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Full Document Inspector & Roll-Call Floor Voting (8 Cols) */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#080d1c] border border-white/15 space-y-6">
          {/* Header */}
          <div className="space-y-2 border-b border-white/10 pb-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold">
                {activeDoc.code}
              </span>
              <span className="text-neutral-400">{activeDoc.committee}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white font-display leading-tight">
              {activeDoc.title}
            </h2>
            <div className="text-xs font-mono text-neutral-400">
              Lead Sponsors: <strong className="text-cyan-300">{activeDoc.sponsors.join(', ')}</strong> &bull; Signatories: {activeDoc.signatories.join(', ')}
            </div>
          </div>

          {/* Clauses Stream */}
          <div className="space-y-4 font-sans text-xs sm:text-sm leading-relaxed">
            {/* Preambles */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider font-bold">
                PREAMBULAR CLAUSES
              </div>
              {activeDoc.preambleClauses.map((clause, idx) => (
                <p key={idx} className="italic text-neutral-300 pl-4 border-l-2 border-teal-500/40">
                  {clause}
                </p>
              ))}
            </div>

            {/* Operatives */}
            <div className="space-y-2 pt-2">
              <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider font-bold">
                OPERATIVE CLAUSES
              </div>
              {activeDoc.operativeClauses.map((clause, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-neutral-200">
                  {clause}
                </div>
              ))}
            </div>
          </div>

          {/* Roll Call Floor Voting Block */}
          <div className="p-5 rounded-2xl bg-black/60 border border-teal-500/30 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white uppercase flex items-center gap-2">
                <Vote className="w-4 h-4 text-teal-400" />
                <span>Simulated Roll-Call Floor Voting</span>
              </span>
              <span className="text-[10px] text-neutral-400">
                Total Tallied: {activeDoc.ayeVotes + activeDoc.nayVotes + activeDoc.abstainVotes}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => castVote(activeDoc.id, 'AYE')}
                className="p-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-center transition cursor-pointer"
              >
                <div className="text-[10px] uppercase text-emerald-400 font-bold">Aye (In Favor)</div>
                <div className="text-xl font-black text-white mt-0.5">{activeDoc.ayeVotes}</div>
              </button>

              <button
                type="button"
                onClick={() => castVote(activeDoc.id, 'NAY')}
                className="p-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-center transition cursor-pointer"
              >
                <div className="text-[10px] uppercase text-rose-400 font-bold">Nay (Against)</div>
                <div className="text-xl font-black text-white mt-0.5">{activeDoc.nayVotes}</div>
              </button>

              <button
                type="button"
                onClick={() => castVote(activeDoc.id, 'ABSTAIN')}
                className="p-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-center transition cursor-pointer"
              >
                <div className="text-[10px] uppercase text-amber-400 font-bold">Abstain</div>
                <div className="text-xl font-black text-white mt-0.5">{activeDoc.abstainVotes}</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestSolutionsPage() {
  return (
    <TestNodeProvider>
      <TestNodeShell>
        <TestSolutionsContent />
      </TestNodeShell>
    </TestNodeProvider>
  );
}
