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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-3xl bg-[#F5F3EB] rounded-3xl border border-[#D6D1C4] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#243928] text-white flex items-center justify-between border-b border-[#324f38]">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[#E4DB98]" />
            <h2 className="text-base font-black tracking-tight uppercase">Documents &amp; Resolutions</h2>
          </div>
          <button
            type="button"
            onClick={() => setShowDocumentsModal(false)}
            className="text-neutral-400 hover:text-white p-1 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Substantive Voting Screen Active Overlay */}
        {session.activeVoting && (
          <div className="p-6 bg-white border-b border-[#D6D1C4] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#39683C]">
                  ROLL-CALL SUBSTANTIVE VOTING &bull; ROUND {session.activeVoting.round}
                </div>
                <h3 className="text-lg font-black text-[#1A1D1A]">
                  {session.activeVoting.documentTitle}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xs font-mono font-bold bg-[#EFECE4] px-3 py-1.5 rounded-xl border border-[#D6D1C4]">
                  For: <span className="text-emerald-700">{session.activeVoting.passedCount}</span> &bull; 
                  Against: <span className="text-rose-700">{session.activeVoting.againstCount}</span> &bull; 
                  Abstain: <span>{session.activeVoting.abstainCount}</span>
                </div>
                <button
                  type="button"
                  onClick={finalizeSubstantiveVote}
                  className="px-4 py-2 rounded-xl bg-[#243928] hover:bg-[#324f38] text-[#E4DB98] font-bold text-xs cursor-pointer"
                >
                  Tally &amp; Conclude Vote
                </button>
              </div>
            </div>

            {session.activeVoting.status === 'passed' && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-extrabold text-sm">DRAFT RESOLUTION PASSED!</div>
                  <div className="text-xs opacity-90">+10 DR passed points awarded to all sponsors.</div>
                </div>
              </div>
            )}

            {session.activeVoting.status === 'failed' && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
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
                        className="p-2.5 rounded-xl bg-[#FAF9F5] border border-[#E0DCCE] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={`https://flagcdn.com/w40/${del.countryCode.toLowerCase()}.png`}
                            alt=""
                            className="w-4 h-4 rounded-full object-cover"
                          />
                          <span className="font-bold text-[#1A1D1A]">{del.name}</span>
                          {del.isP5 && (
                            <span className="text-[9px] font-mono bg-amber-100 text-amber-900 px-1 rounded border border-amber-300">
                              P5
                            </span>
                          )}
                          {isPV && (
                            <span className="text-[9px] font-mono text-[#7A7870]">
                              (P&amp;V &bull; Cannot Abstain)
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => castSubstantiveVote(del.id, 'for')}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
                              currentVote === 'for' ? 'bg-emerald-700 text-white' : 'bg-white border text-neutral-700'
                            }`}
                          >
                            For
                          </button>
                          <button
                            type="button"
                            onClick={() => castSubstantiveVote(del.id, 'against')}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
                              currentVote === 'against' ? 'bg-rose-700 text-white' : 'bg-white border text-neutral-700'
                            }`}
                          >
                            Against
                          </button>
                          <button
                            type="button"
                            disabled={isPV}
                            onClick={() => castSubstantiveVote(del.id, 'abstain')}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
                              isPV
                                ? 'opacity-30 cursor-not-allowed bg-neutral-200'
                                : currentVote === 'abstain'
                                ? 'bg-amber-600 text-white'
                                : 'bg-white border text-neutral-700'
                            }`}
                          >
                            Abstain
                          </button>
                          <button
                            type="button"
                            onClick={() => castSubstantiveVote(del.id, 'pass')}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
                              currentVote === 'pass' ? 'bg-neutral-800 text-white' : 'bg-white border text-neutral-700'
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
        <div className="p-4 bg-[#EFECE4] border-b border-[#D6D1C4] flex items-center justify-between">
          <div className="inline-flex rounded-xl bg-white p-1 border border-[#D6D1C4] shadow-2xs">
            <button
              type="button"
              onClick={() => {
                setActiveTab('working_paper');
                setShowSubmitForm(false);
              }}
              className={`px-4 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                activeTab === 'working_paper'
                  ? 'bg-[#243928] text-white shadow-xs'
                  : 'text-[#7A7870] hover:text-[#1A1D1A]'
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
                  ? 'bg-[#243928] text-white shadow-xs'
                  : 'text-[#7A7870] hover:text-[#1A1D1A]'
              }`}
            >
              Draft Resolutions
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSubmitForm(!showSubmitForm)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAF9F5] border border-[#D6D1C4] text-xs font-bold text-[#1A1D1A] flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit New {activeTab === 'working_paper' ? 'Working Paper' : 'Draft Resolution'}</span>
            </button>

            {activeTab === 'draft_resolution' && currentDocs.length > 0 && (
              <button
                type="button"
                onClick={() => openSubstantiveVoting(currentDocs[0].id)}
                className="px-4 py-2 rounded-xl bg-[#E4DB98] hover:bg-[#d8cf8a] text-[#1A1D1A] text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-sm"
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
            <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-white border border-[#D6D1C4] space-y-4">
              <div className="text-sm font-black text-[#243928] uppercase tracking-wide">
                Submit New {activeTab === 'working_paper' ? 'Working Paper' : 'Draft Resolution'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#7A7870] mb-1">Document Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={activeTab === 'working_paper' ? 'WP 1.1' : 'DR 1.1'}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#D6D1C4] text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#7A7870] mb-1">Title / Mandate</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Humanitarian Corridor Access Framework"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#D6D1C4] text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#7A7870] mb-1">Sponsors (Hold Ctrl/Cmd to select)</label>
                <select
                  multiple
                  value={sponsors}
                  onChange={(e) => setSponsors(Array.from(e.target.selectedOptions, (o) => o.value))}
                  className="w-full p-2 rounded-xl bg-[#FAF9F5] border border-[#D6D1C4] text-xs font-medium max-h-24"
                >
                  {session.roster.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-[#7A7870]">
                  Sponsors receive <strong>+{activeTab === 'working_paper' ? 10 : 20} points</strong> upon submission.
                </span>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#7A7870] mb-1">Clauses &amp; Operative Content</label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste draft clauses, preambles, and recommendations..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#D6D1C4] text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitForm(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#243928] hover:bg-[#324f38] text-[#E4DB98] text-xs font-bold cursor-pointer shadow-md"
                >
                  Submit Document
                </button>
              </div>
            </form>
          ) : currentDocs.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#EFECE4] mx-auto flex items-center justify-center text-2xl">
                📄
              </div>
              <div className="text-base font-extrabold text-[#1A1D1A]">
                No {activeTab === 'working_paper' ? 'Working Papers' : 'Draft Resolutions'} yet.
              </div>
              <p className="text-xs text-[#7A7870] max-w-sm mx-auto">
                Submit the first one below or via the button above to begin debate and presentation.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitForm(true)}
                  className="px-6 py-2.5 rounded-xl bg-white hover:bg-[#FAF9F5] border border-[#D6D1C4] text-xs font-bold text-[#1A1D1A] cursor-pointer shadow-sm"
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
                  className="p-5 rounded-2xl bg-white border border-[#D6D1C4] shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold bg-[#243928] text-white px-2 py-0.5 rounded">
                          {doc.code}
                        </span>
                        <span className="text-[10px] font-mono font-bold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                          Stage: {doc.stage}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-[#1A1D1A] pt-1">
                        {doc.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      {doc.stage === 'draft' && (
                        <button
                          type="button"
                          onClick={() => startDocumentIntroduce(doc.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#39683C] hover:bg-[#2e5531] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>Introduce (3-Stage)</span>
                        </button>
                      )}

                      {(doc.stage === 'reading' || doc.stage === 'presentation' || doc.stage === 'qa') && (
                        <button
                          type="button"
                          onClick={() => advanceDocumentStage(doc.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#243928] hover:bg-[#324f38] text-[#E4DB98] text-xs font-bold cursor-pointer"
                        >
                          Next Stage &rarr;
                        </button>
                      )}

                      {doc.type === 'draft_resolution' && (doc.stage === 'qa' || doc.stage === 'voting') && (
                        <button
                          type="button"
                          onClick={() => openSubstantiveVoting(doc.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#E4DB98] hover:bg-[#d8cf8a] text-[#1A1D1A] text-xs font-black flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <Vote className="w-3.5 h-3.5" />
                          <span>Roll-Call Vote</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {doc.content && (
                    <div className="text-xs font-mono bg-[#FAF9F5] p-3 rounded-xl border border-[#E0DCCE] max-h-32 overflow-y-auto whitespace-pre-wrap text-[#333]">
                      {doc.content}
                    </div>
                  )}

                  <div className="text-[10px] text-[#7A7870] flex items-center gap-3">
                    <span>
                      Sponsors: <strong>{doc.sponsors.map((id) => session.roster.find((d) => d.id === id)?.name || id).join(', ')}</strong>
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
