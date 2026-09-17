'use client';

import React, { useState } from 'react';
import {
  Award,
  X,
  Printer,
  CheckCircle2,
  FileCheck2,
  Trophy,
  Scale,
  Sparkles,
  Users,
  Vote,
  ShieldCheck,
  Edit3,
  Save,
  Share2,
  Plus,
  Trash2,
  Medal
} from 'lucide-react';
import { useMun } from '@/context/MunContext';
import { MunCommittee } from '@/types/mun';

interface CommitteeSummaryPaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  committee?: MunCommittee;
}

export function CommitteeSummaryPaperModal({
  isOpen,
  onClose,
  committee,
}: CommitteeSummaryPaperModalProps) {
  const {
    sessionState,
    activeConference,
    setCommitteeWinners,
    activeCommitteeId
  } = useMun();

  const currentCommittee = committee;
  const isIndian = currentCommittee?.isIndianCommittee || currentCommittee?.type === 'LOK_SABHA' || currentCommittee?.type === 'AIPPM' || currentCommittee?.type === 'PARLIAMENTARY';

  // Existing or default winners
  const winners = sessionState.winnersSummary;

  const initialBestPort = typeof winners?.bestDelegate === 'string' ? winners.bestDelegate : winners?.bestDelegate?.portfolio || '';
  const initialBestName = typeof winners?.bestDelegate === 'object' ? winners.bestDelegate?.delegateName || '' : '';
  const initialHighPort = typeof winners?.highCommendation === 'string' ? winners.highCommendation : winners?.highCommendation?.portfolio || '';
  const initialHighName = typeof winners?.highCommendation === 'object' ? winners.highCommendation?.delegateName || '' : '';
  const initialSm1 = winners?.specialMentions?.[0]?.portfolio || (typeof winners?.specialMention === 'string' ? winners.specialMention : '');
  const initialSm2 = winners?.specialMentions?.[1]?.portfolio || '';

  const [isEditingWinners, setIsEditingWinners] = useState(false);
  const [bestDelPort, setBestDelPort] = useState(initialBestPort);
  const [bestDelName, setBestDelName] = useState(initialBestName);
  const [highCommPort, setHighCommPort] = useState(initialHighPort);
  const [highCommName, setHighCommName] = useState(initialHighName);
  const [specialMention1, setSpecialMention1] = useState(initialSm1);
  const [specialMention2, setSpecialMention2] = useState(initialSm2);
  const [verdictNotes, setVerdictNotes] = useState(winners?.verdictNotes || 'Chamber conducted sovereign deliberative proceedings with high parliamentary decorum.');

  // Custom Awards State
  const [customAwardsList, setCustomAwardsList] = useState<Array<{
    id: string;
    title: string;
    recipientPortfolio: string;
    delegateName: string;
    citation?: string;
  }>>(winners?.customAwards || []);
  const [showAddCustomForm, setShowAddCustomForm] = useState(false);
  const [newAwardTitle, setNewAwardTitle] = useState('');
  const [newAwardPort, setNewAwardPort] = useState('');
  const [newAwardName, setNewAwardName] = useState('');
  const [newAwardCitation, setNewAwardCitation] = useState('');

  const handleAddCustomAward = () => {
    if (!newAwardTitle.trim() || !newAwardPort.trim()) return;
    const newAward = {
      id: `award_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: newAwardTitle.trim(),
      recipientPortfolio: newAwardPort.trim(),
      delegateName: newAwardName.trim(),
      citation: newAwardCitation.trim()
    };
    setCustomAwardsList((prev) => [...prev, newAward]);
    setNewAwardTitle('');
    setNewAwardPort('');
    setNewAwardName('');
    setNewAwardCitation('');
    setShowAddCustomForm(false);
  };

  const handleRemoveCustomAward = (id: string) => {
    setCustomAwardsList((prev) => prev.filter(a => a.id !== id));
  };

  if (!isOpen) return null;

  const motionHistory = sessionState.motionHistory || [];
  const motionsPassed = motionHistory.filter((m) => String(m.verdict).toLowerCase() === 'passed').length;
  const motionsFailed = motionHistory.filter((m) => String(m.verdict).toLowerCase() === 'failed').length;
  const speakerHistory = sessionState.speakerHistory || [];
  const passedBills = sessionState.passedBills || [];

  const handleSaveWinners = () => {
    if (!currentCommittee?.id) return;
    setCommitteeWinners(currentCommittee.id, {
      bestDelegate: {
        portfolio: bestDelPort || 'Delegate of Excellence',
        delegateName: bestDelName || 'Honorable Delegate',
      },
      highCommendation: highCommPort ? { portfolio: highCommPort, delegateName: highCommName } : undefined,
      specialMentions: [
        specialMention1 ? { portfolio: specialMention1 } : null,
        specialMention2 ? { portfolio: specialMention2 } : null,
      ].filter(Boolean) as Array<{ portfolio: string }>,
      customAwards: customAwardsList,
      concludedAt: new Date().toISOString(),
      verdictNotes,
    });
    setIsEditingWinners(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in text-left">
      <div className="w-full max-w-4xl max-h-[92vh] bg-gradient-to-b from-[#10141e] via-[#0a0d14] to-[#040609] border border-amber-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_0_80px_rgba(245,158,11,0.2)] flex flex-col relative overflow-hidden space-y-6">
        
        {/* Top Sovereign Watermark / Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[110px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />

        {/* Modal Controls Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10 print:hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] uppercase font-bold tracking-wider">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>OFFICIAL VALEDICTORY SUMMARY PAPER &bull; EXECUTIVE REPORT</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-mono text-white transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print Paper</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Summary Paper Sheet */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1 relative z-10 font-sans">
          
          {/* Official Document Banner */}
          <div className="text-center space-y-2 border-b border-amber-500/20 pb-6">
            <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400/90 font-bold">
              {activeConference?.name || 'MODEL UNITED NATIONS 2026'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
              {currentCommittee?.name || 'Chamber Plenary Session'}
            </h1>
            <p className="text-xs text-neutral-300 max-w-xl mx-auto italic font-serif">
              &ldquo;{currentCommittee?.agenda || 'Sovereign Deliberations on Multilateral Governance & Global Youth Empowerment'}&rdquo;
            </p>
            <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-neutral-400 pt-2">
              <span>Dais Chair: <strong className="text-white">{currentCommittee?.dais?.chair || 'Honorable Speaker'}</strong></span>
              <span>&bull;</span>
              <span>Status: <strong className="text-emerald-400">VALEDICTORY ADOPTION</strong></span>
            </div>
          </div>

          {/* Section 1: Productivity & Chamber Statistics */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold flex items-center gap-2">
                <Vote className="w-4 h-4 text-amber-400" />
                <span>Chamber Deliberation & Productivity Index</span>
              </h3>
              <span className="text-[10px] font-mono text-neutral-400">Day 1 to Concluded</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-2xl font-black text-white">{motionHistory.length}</span>
                <div className="text-[10px] text-neutral-400 uppercase">Motions Raised</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <span className="text-2xl font-black text-emerald-300">{motionsPassed}</span>
                <div className="text-[10px] text-emerald-400 uppercase">Motions Passed</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-1">
                <span className="text-2xl font-black text-cyan-300">{speakerHistory.length}</span>
                <div className="text-[10px] text-cyan-400 uppercase">GSL Speeches</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <span className="text-2xl font-black text-amber-300">{passedBills.length}</span>
                <div className="text-[10px] text-amber-400 uppercase">{isIndian ? 'Bills Passed' : 'Resolutions Passed'}</div>
              </div>
            </div>
          </div>

          {/* Section 2: Passed Bills & Resolutions (Sovereign Solutions) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <span>Passed Legislation & Enacted Documents</span>
              </h3>
              <span className="text-[10px] font-mono text-neutral-400">Archived in /solutions</span>
            </div>

            {passedBills.length === 0 ? (
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-neutral-400 text-center italic">
                No formal bills or draft resolutions were enacted into law before chamber adjournment.
              </div>
            ) : (
              <div className="space-y-2.5">
                {passedBills.map((bill, idx) => (
                  <div
                    key={bill.id || idx}
                    className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                          {bill.code}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400">Day {bill.day || 1}</span>
                      </div>
                      <h4 className="font-bold text-sm text-white">{bill.title}</h4>
                      {bill.sponsors && (
                        <p className="text-[11px] text-neutral-400 font-mono">
                          Authored by: <span className="text-white">{bill.sponsors.join(', ')}</span>
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                      ENACTED &bull; RATIFIED
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Winner List & Awards (Zen Certify Record) */}
          <div className="space-y-3 p-5 rounded-2xl bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/30">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Official Committee Awards & Valedictory Gavel Roster</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingWinners(!isEditingWinners)}
                className="flex items-center gap-1 text-[11px] font-mono text-amber-400 hover:text-amber-300 cursor-pointer print:hidden"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isEditingWinners ? 'Cancel Edit' : 'Chair / Sec Edit'}</span>
              </button>
            </div>

            {isEditingWinners ? (
              /* Editing Form for Dais Chairs */
              <div className="space-y-3 pt-2 font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-amber-300 font-bold">Best Delegate (Gavel) Portfolio</label>
                    <input
                      type="text"
                      placeholder="e.g. Delegate of France / MP for Varanasi"
                      value={bestDelPort}
                      onChange={(e) => setBestDelPort(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-amber-500/30 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-neutral-300">Delegate Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Yuveer Chhatwani"
                      value={bestDelName}
                      onChange={(e) => setBestDelName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-cyan-300 font-bold">High Commendation Portfolio</label>
                    <input
                      type="text"
                      placeholder="e.g. Delegate of India"
                      value={highCommPort}
                      onChange={(e) => setHighCommPort(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-cyan-500/30 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-neutral-300">Delegate Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Hit Upadhyay"
                      value={highCommName}
                      onChange={(e) => setHighCommName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-neutral-400">Special Mention 1</label>
                    <input
                      type="text"
                      placeholder="e.g. Delegate of Brazil"
                      value={specialMention1}
                      onChange={(e) => setSpecialMention1(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-neutral-400">Special Mention 2</label>
                    <input
                      type="text"
                      placeholder="e.g. Delegate of Japan"
                      value={specialMention2}
                      onChange={(e) => setSpecialMention2(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Custom Awards Section in Edit Mode */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono uppercase text-amber-300 font-bold flex items-center gap-1.5">
                      <Medal className="w-3.5 h-3.5 text-amber-400" />
                      <span>Custom Awards ({customAwardsList.length})</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddCustomForm(!showAddCustomForm)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-mono text-[10px] font-bold transition cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Add Custom Award</span>
                    </button>
                  </div>

                  {customAwardsList.length > 0 && (
                    <div className="space-y-1.5">
                      {customAwardsList.map((award) => (
                        <div
                          key={award.id}
                          className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2"
                        >
                          <div className="text-xs">
                            <span className="font-bold text-amber-300 mr-2">{award.title}:</span>
                            <span className="text-white font-mono">{award.recipientPortfolio}</span>
                            {award.delegateName && (
                              <span className="text-neutral-400 ml-1.5">({award.delegateName})</span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomAward(award.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition cursor-pointer shrink-0"
                            title="Remove Award"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {showAddCustomForm && (
                    <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2.5">
                      <div className="text-[11px] font-mono uppercase text-amber-300 font-bold">
                        New Custom Award Details
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Award Title (e.g. Best Diplomat / Verbal Commendation)"
                          value={newAwardTitle}
                          onChange={(e) => setNewAwardTitle(e.target.value)}
                          className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-xs text-white"
                        />
                        <input
                          type="text"
                          placeholder="Recipient Portfolio (e.g. Delegate of UK)"
                          value={newAwardPort}
                          onChange={(e) => setNewAwardPort(e.target.value)}
                          className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-xs text-white"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Delegate Name (e.g. Aditi Rao)"
                          value={newAwardName}
                          onChange={(e) => setNewAwardName(e.target.value)}
                          className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-xs text-white"
                        />
                        <input
                          type="text"
                          placeholder="Citation / Rationale (optional)"
                          value={newAwardCitation}
                          onChange={(e) => setNewAwardCitation(e.target.value)}
                          className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-xs text-white"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowAddCustomForm(false)}
                          className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 text-xs font-mono cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleAddCustomAward}
                          disabled={!newAwardTitle.trim() || !newAwardPort.trim()}
                          className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs font-mono cursor-pointer disabled:opacity-50"
                        >
                          Add Award
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-neutral-400">Executive Chair Verdict Notes</label>
                  <textarea
                    rows={2}
                    value={verdictNotes}
                    onChange={(e) => setVerdictNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSaveWinners}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Publish Valedictory Verdict & Update Delegate Certificates</span>
                </button>
              </div>
            ) : (
              /* Display View of Winners */
              <div className="space-y-3 font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-sm shrink-0">
                      🏆
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase text-amber-300 font-bold">Best Delegate (Gavel)</div>
                      <div className="font-bold text-sm text-white">
                        {typeof winners?.bestDelegate === 'string' ? winners.bestDelegate : winners?.bestDelegate?.portfolio || 'TBA by Chair'}
                      </div>
                      {typeof winners?.bestDelegate === 'object' && winners.bestDelegate?.delegateName && (
                        <div className="text-xs text-neutral-300">{winners.bestDelegate.delegateName}</div>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-sm shrink-0">
                      🎖️
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase text-cyan-300 font-bold">High Commendation</div>
                      <div className="font-bold text-sm text-white">
                        {typeof winners?.highCommendation === 'string' ? winners.highCommendation : winners?.highCommendation?.portfolio || 'TBA by Chair'}
                      </div>
                      {typeof winners?.highCommendation === 'object' && winners.highCommendation?.delegateName && (
                        <div className="text-xs text-neutral-300">{winners.highCommendation.delegateName}</div>
                      )}
                    </div>
                  </div>
                </div>

                {(winners?.specialMentions || winners?.specialMention) && (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-neutral-300">
                    <strong className="text-white font-mono uppercase text-[10px] mr-2">Special Mentions:</strong>
                    {winners.specialMentions 
                      ? winners.specialMentions.map((sm: { portfolio: string }) => sm.portfolio).join(', ')
                      : winners.specialMention}
                  </div>
                )}

                {/* Custom Awards Display */}
                {((winners?.customAwards && winners.customAwards.length > 0) || customAwardsList.length > 0) && (
                  <div className="space-y-2 pt-1">
                    <div className="text-[10px] font-mono uppercase text-amber-300 font-bold flex items-center gap-1.5">
                      <Medal className="w-3.5 h-3.5 text-amber-400" />
                      <span>Custom Secretariat & Chair Recognitions</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {(winners?.customAwards || customAwardsList).map((award) => (
                        <div
                          key={award.id}
                          className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3"
                        >
                          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            🎖️
                          </div>
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <div className="text-[10px] font-mono uppercase text-amber-300 font-bold truncate">
                              {award.title}
                            </div>
                            <div className="font-bold text-xs text-white truncate">
                              {award.recipientPortfolio}
                            </div>
                            {award.delegateName && (
                              <div className="text-[11px] text-neutral-300 truncate">
                                {award.delegateName}
                              </div>
                            )}
                            {award.citation && (
                              <div className="text-[10px] text-neutral-400 italic">
                                &ldquo;{award.citation}&rdquo;
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {winners?.verdictNotes && (
                  <div className="text-xs text-neutral-400 italic bg-black/20 p-3 rounded-xl border border-white/5">
                    &ldquo;{winners.verdictNotes}&rdquo;
                  </div>
                )}

                {/* Notice on Zen Certify */}
                <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Award records in Zen Certify & Dossier activate upon conference conclusion and sync into delegate profile dashboards.</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400 font-mono print:hidden">
          <span>Official Sovereign Valedictory Record</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition cursor-pointer"
          >
            Close Paper
          </button>
        </div>

      </div>
    </div>
  );
}
