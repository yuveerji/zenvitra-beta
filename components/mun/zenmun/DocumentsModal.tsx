'use client';

import React, { useState } from 'react';
import { X, FileText, Vote, Plus, Play, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useZenMun } from '@/context/ZenMunContext';
import { ZenDocument } from '@/types/zenMun';

export function DocumentsModal() {
  const {
    session,
    showDocumentsModal,
    setShowDocumentsModal,
    submitDocument,
    startDocumentIntroduce,
    advanceDocumentStage,
    openSubstantiveVoting,
    castSubstantiveVote,
    finalizeSubstantiveVote,
    quorum,
  } = useZenMun();

  const [activeTab, setActiveTab] = useState<'working_paper' | 'draft_resolution'>('working_paper');
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  // Form fields
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [sponsors, setSponsors] = useState<string[]>([]);
  const [signatories, setSignatories] = useState<string[]>([]);
  const [content, setContent] = useState('');

  if (!showDocumentsModal) return null;

  const currentDocs = session.documents.filter((d) => d.type === activeTab);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    submitDocument({
      type: activeTab,
      code: code.trim(),
      title: title.trim(),
      sponsors: sponsors.length > 0 ? sponsors : [session.roster[0]?.id || ''],
      signatories,
      content: content.trim(),
      readingSeconds: 60,
      presentationSeconds: 120,
      qaSeconds: 180,
    });

    setCode('');
    setTitle('');
    setSponsors([]);
    setSignatories([]);
    setContent('');
    setShowSubmitForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-3xl bg-[#090d16] rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0c1220] text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-black tracking-tight uppercase text-white">Documents &amp; Resolutions</h2>
          </div>
          <button
            type="button"
            onClick={() => setShowDocumentsModal(false)}
            className="text-neutral-400 hover:text-white p-1 rounded-full cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Substantive Voting Screen Active Overlay */}
        {session.activeVoting && (
          <div className="p-6 bg-[#0d1424] border-b border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  ROLL-CALL SUBSTANTIVE VOTING • ROUND {session.activeVoting.round}
                </div>
                <h3 className="text-lg font-black text-white">
                  {session.activeVoting.documentTitle}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xs font-mono font-bold bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 text-white">
                  For: <span className="text-emerald-400">{session.activeVoting.passedCount}</span> • 
                  Against: <span className="text-rose-400">{session.activeVoting.againstCount}</span> • 
                  Abstain: <span className="text-amber-400">{session.activeVoting.abstainCount}</span>
                </div>
                <button
                  type="button"
                  onClick={finalizeSubstantiveVote}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs cursor-pointer shadow-md transition"
                >
                  Tally &amp; Conclude Vote
                </button>
              </div>
            </div>

            {session.activeVoting.status === 'passed' && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-extrabold text-sm">DRAFT RESOLUTION PASSED!</div>
                  <div className="text-xs opacity-90">+10 DR passed points awarded to all sponsors.</div>
                </div>
              </div>
            )}

            {session.activeVoting.status === 'failed' && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
                <div>
                  <div className="font-extrabold text-sm">
                    DRAFT RESOLUTION FAILED
                    {session.activeVoting.vetoedBy && session.activeVoting.vetoedBy.length > 0 && ` (P5 Vetoed by ${session.activeVoting.vetoedBy.join(', ')})`}
                  </div>
                  <div className="text-xs opacity-90">Required majority was not achieved.</div>
                </div>
              </div>
            )}

            {/* Voting List */}
            {session.activeVoting.status === 'voting' && (
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {session.roster
                  .filter((d) => d.attendance !== 'absent')
                  .map((del) => {
                    const currentVote = session.activeVoting?.votes[del.id];
                    const isPV = del.attendance === 'present_voting';
                    return (
                      <div
                        key={del.id}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={`https://flagcdn.com/w40/${del.countryCode.toLowerCase()}.png`}
                            alt=""
                            className="w-4 h-4 rounded-full object-cover border border-white/10"
                          />
                          <span className="font-bold text-white">{del.name}</span>
                          {del.isP5 && (
                            <span className="text-[9px] font-mono bg-amber-500/20 text-amber-300 px-1 rounded border border-amber-500/30">
                              P5
                            </span>
                          )}
                          {isPV && (
                            <span className="text-[9px] font-mono text-neutral-400">
                              (P&amp;V • Cannot Abstain)
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => castSubstantiveVote(del.id, 'for')}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer transition ${
                              currentVote === 'for' ? 'bg-emerald-500 text-black font-black' : 'bg-white/5 text-neutral-300 hover:text-white border border-white/10'
                            }`}
                          >
                            For
                          </button>
                          <button
                            type="button"
                            onClick={() => castSubstantiveVote(del.id, 'against')}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer transition ${
                              currentVote === 'against' ? 'bg-rose-500 text-white' : 'bg-white/5 text-neutral-300 hover:text-white border border-white/10'
                            }`}
                          >
                            Against
                          </button>
                          <button
                            type="button"
                            disabled={isPV}
                            onClick={() => castSubstantiveVote(del.id, 'abstain')}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer transition ${
                              isPV
                                ? 'opacity-30 cursor-not-allowed bg-white/5'
                                : currentVote === 'abstain'
                                ? 'bg-amber-500 text-black font-black'
                                : 'bg-white/5 text-neutral-300 hover:text-white border border-white/10'
                            }`}
                          >
                            Abstain
                          </button>
                          <button
                            type="button"
                            onClick={() => castSubstantiveVote(del.id, 'pass')}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer transition ${
                              currentVote === 'pass' ? 'bg-neutral-700 text-white' : 'bg-white/5 text-neutral-300 hover:text-white border border-white/10'
                            }`}
                          >
                            Pass
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* Segmented Toggle Bar */}
        <div className="p-4 bg-[#0a0f1d] border-b border-white/10 flex items-center justify-between">
          <div className="inline-flex rounded-xl bg-black/40 p-1 border border-white/10 shadow-xs">
            <button
              type="button"
              onClick={() => {
                setActiveTab('working_paper');
                setShowSubmitForm(false);
              }}
              className={`px-4 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                activeTab === 'working_paper'
                  ? 'bg-cyan-500 text-black font-black shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Working Papers
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('draft_resolution');
                setShowSubmitForm(false);
              }}
              className={`px-4 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                activeTab === 'draft_resolution'
                  ? 'bg-cyan-500 text-black font-black shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Draft Resolutions
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSubmitForm(!showSubmitForm)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>Submit New {activeTab === 'working_paper' ? 'Working Paper' : 'Draft Resolution'}</span>
            </button>

            {activeTab === 'draft_resolution' && currentDocs.length > 0 && (
              <button
                type="button"
                onClick={() => openSubstantiveVoting(currentDocs[0].id)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md transition"
              >
                <Vote className="w-3.5 h-3.5" />
                <span>Vote</span>
              </button>
            )}
          </div>
        </div>

        {/* Body Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {showSubmitForm ? (
            <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="text-sm font-black text-cyan-400 uppercase tracking-wide">
                Submit New {activeTab === 'working_paper' ? 'Working Paper' : 'Draft Resolution'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Document Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={activeTab === 'working_paper' ? 'WP 1.1' : 'DR 1.1'}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Title / Mandate</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Humanitarian Corridor Access Framework"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Sponsors (Hold Ctrl/Cmd to select)</label>
                <select
                  multiple
                  value={sponsors}
                  onChange={(e) => setSponsors(Array.from(e.target.selectedOptions, (o) => o.value))}
                  className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-xs font-medium text-white max-h-24 focus:outline-none focus:border-cyan-400"
                >
                  {session.roster.map((d) => (
                    <option key={d.id} value={d.id} className="bg-[#0a0f1d] text-white">
                      {d.name}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-neutral-400">
                  Sponsors receive <strong className="text-cyan-400">+{activeTab === 'working_paper' ? 10 : 20} points</strong> upon submission.
                </span>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Clauses &amp; Operative Content</label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste draft clauses, preambles, and recommendations..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitForm(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-bold cursor-pointer transition border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs cursor-pointer shadow-md transition"
                >
                  Submit Document
                </button>
              </div>
            </form>
          ) : currentDocs.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-2xl">
                📄
              </div>
              <div className="text-base font-extrabold text-white">
                No {activeTab === 'working_paper' ? 'Working Papers' : 'Draft Resolutions'} yet.
              </div>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Submit the first one below or via the button above to begin debate and presentation.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitForm(true)}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs cursor-pointer shadow-md transition"
                >
                  + Submit New {activeTab === 'working_paper' ? 'Working Paper' : 'Draft Resolution'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {currentDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold bg-cyan-500 text-black px-2 py-0.5 rounded">
                          {doc.code}
                        </span>
                        <span className="text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                          Stage: {doc.stage}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-white pt-1">
                        {doc.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      {doc.stage === 'draft' && (
                        <button
                          type="button"
                          onClick={() => startDocumentIntroduce(doc.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-sm transition"
                        >
                          <Play className="w-3.5 h-3.5 fill-black" />
                          <span>Introduce (3-Stage)</span>
                        </button>
                      )}

                      {(doc.stage === 'reading' || doc.stage === 'presentation' || doc.stage === 'qa') && (
                        <button
                          type="button"
                          onClick={() => advanceDocumentStage(doc.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs cursor-pointer shadow-sm transition"
                        >
                          Next Stage &rarr;
                        </button>
                      )}

                      {doc.type === 'draft_resolution' && (doc.stage === 'qa' || doc.stage === 'voting') && (
                        <button
                          type="button"
                          onClick={() => openSubstantiveVoting(doc.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black flex items-center gap-1 cursor-pointer shadow-sm transition"
                        >
                          <Vote className="w-3.5 h-3.5" />
                          <span>Roll-Call Vote</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {doc.content && (
                    <div className="text-xs font-mono bg-black/40 p-3 rounded-xl border border-white/10 max-h-32 overflow-y-auto whitespace-pre-wrap text-neutral-300">
                      {doc.content}
                    </div>
                  )}

                  <div className="text-[10px] text-neutral-400 flex items-center gap-3">
                    <span>
                      Sponsors: <strong className="text-white">{doc.sponsors.map((id) => session.roster.find((d) => d.id === id)?.name || id).join(', ')}</strong>
                    </span>
                    <span>&bull;</span>
                    <span>Submitted: {new Date(doc.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
