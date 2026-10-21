'use client';

/**
 * ZENVITRA ELECTION COMMISSIONER DAIS
 * Dedicated authority console for Election Commissioners to:
 * 1. View and manage the eligible voter roll for any election.
 * 2. Add individual delegates, council representatives, or bulk paste voter handles.
 * 3. Assign mandate weights and universe affiliations.
 * 4. Freeze the Voter Roll Snapshot before moving election from SCHEDULED to OPEN.
 * 5. Issue emergency suspensions or audit logs.
 */

import React, { useState } from 'react';
import { 
  Gavel, 
  Users, 
  UserPlus, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  AlertTriangle, 
  FileSpreadsheet, 
  Search, 
  Trash2, 
  CheckCircle2, 
  Sparkles,
  Download,
  Upload
} from 'lucide-react';
import { MultiversalElection } from '@/types/voting';
import { VoterRollEntry } from '@/types/votingExtended';

export interface CommissionerDaisProps {
  election: MultiversalElection;
  commissionerHandle?: string;
  onUpdateVoterRoll?: (electionId: string, updatedRoll: VoterRollEntry[], isFrozen: boolean) => void;
  onCloseDais?: () => void;
}

export function CommissionerDais({
  election,
  commissionerHandle = 'commissioner.general',
  onUpdateVoterRoll,
  onCloseDais,
}: CommissionerDaisProps) {
  // Clean initialization: zero seeded voters
  const [voterRoll, setVoterRoll] = useState<VoterRollEntry[]>(
    election.voterRollSnapshot || []
  );

  const [isFrozen, setIsFrozen] = useState<boolean>(election.isVoterRollFrozen || false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'MANAGE' | 'BULK_IMPORT' | 'AUDIT'>('MANAGE');

  // Single Add Form
  const [newHandle, setNewHandle] = useState('');
  const [newName, setNewName] = useState('');
  const [newUniverse, setNewUniverse] = useState(election.universeName || '');
  const [newRoleScope, setNewRoleScope] = useState<VoterRollEntry['roleScope']>('INDIVIDUAL_VOTER');
  const [newWeight, setNewWeight] = useState(1.0);

  // Bulk Add Form
  const [bulkText, setBulkText] = useState('');
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  const handleAddSingleVoter = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFrozen) {
      showNotice('Cannot add voters: The voter roll has been frozen by the Election Commissioner.');
      return;
    }

    if (!newHandle.trim()) return;

    const cleanHandle = newHandle.trim().replace(/^@/, '');
    if (voterRoll.some(v => v.voterHandle.toLowerCase() === cleanHandle.toLowerCase())) {
      showNotice(`Delegate @${cleanHandle} is already registered on this voter roll.`);
      return;
    }

    const newEntry: VoterRollEntry = {
      id: `voter-${Date.now()}`,
      voterHandle: cleanHandle,
      fullName: newName.trim() || `@${cleanHandle}`,
      universeAffiliation: newUniverse,
      roleScope: newRoleScope,
      mandateWeight: Number(newWeight) || 1.0,
      isEntitled: true,
      hasVoted: false,
      enrolledAt: new Date().toISOString(),
    };

    const updated = [newEntry, ...voterRoll];
    setVoterRoll(updated);
    onUpdateVoterRoll?.(election.id, updated, isFrozen);
    showNotice(`Added @${cleanHandle} to the official voter list.`);
    setNewHandle('');
    setNewName('');
  };

  const handleBulkImport = () => {
    if (isFrozen) {
      showNotice('Cannot import: Voter roll is officially frozen.');
      return;
    }

    const lines = bulkText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    const existingHandles = new Set(voterRoll.map(v => v.voterHandle.toLowerCase()));
    const newEntries: VoterRollEntry[] = [];

    lines.forEach((line, idx) => {
      // Supports formats: "@handle", "handle", "handle, Full Name", "handle, Full Name, Universe"
      const parts = line.split(',').map(p => p.trim());
      const handle = parts[0].replace(/^@/, '');

      if (handle && !existingHandles.has(handle.toLowerCase())) {
        existingHandles.add(handle.toLowerCase());
        newEntries.push({
          id: `bulk-${Date.now()}-${idx}`,
          voterHandle: handle,
          fullName: parts[1] || `@${handle}`,
          universeAffiliation: parts[2] || election.universeName || 'General Assembly',
          roleScope: 'INDIVIDUAL_VOTER',
          mandateWeight: 1.0,
          isEntitled: true,
          hasVoted: false,
          enrolledAt: new Date().toISOString(),
        });
      }
    });

    const updated = [...newEntries, ...voterRoll];
    setVoterRoll(updated);
    onUpdateVoterRoll?.(election.id, updated, isFrozen);
    showNotice(`Successfully imported ${newEntries.length} verified delegates into voter roll.`);
    setBulkText('');
    setActiveTab('MANAGE');
  };

  const handleRemoveVoter = (id: string, handle: string) => {
    if (isFrozen) {
      showNotice('Action rejected: Cannot modify frozen voter roll.');
      return;
    }

    const updated = voterRoll.filter(v => v.id !== id);
    setVoterRoll(updated);
    onUpdateVoterRoll?.(election.id, updated, isFrozen);
    showNotice(`Removed @${handle} from voter roll.`);
  };

  const handleToggleFreezeSnapshot = () => {
    const nextState = !isFrozen;
    setIsFrozen(nextState);
    onUpdateVoterRoll?.(election.id, voterRoll, nextState);
    showNotice(
      nextState 
        ? '🔒 VOTER ROLL FROZEN: Snapshot sealed under Article II. No further alterations allowed.' 
        : '🔓 VOTER ROLL UNLOCKED: Roll reopened for commissioner revisions.'
    );
  };

  const filteredRoll = voterRoll.filter(v => 
    v.voterHandle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.universeAffiliation || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#060a14] border border-cyan-500/40 shadow-[0_0_80px_rgba(6,182,212,0.18)] space-y-6 font-mono text-neutral-200 max-w-5xl mx-auto w-full">
      {/* Dais Gavel Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold shadow-[0_0_30px_rgba(245,158,11,0.35)]">
            <Gavel className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                ELECTION COMMISSIONER DAIS &bull; ARTICLE II JURISDICTION
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                isFrozen ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              }`}>
                {isFrozen ? 'SNAPSHOT FROZEN' : 'ROLL OPEN'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white font-display">
              Voter Roll Administration: {election.electionCode}
            </h2>
          </div>
        </div>

        {/* Commissioner Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleFreezeSnapshot}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md ${
              isFrozen
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
            }`}
          >
            {isFrozen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{isFrozen ? 'Unlock Voter Roll' : 'Freeze Voter Roll Snapshot'}</span>
          </button>

          {onCloseDais && (
            <button
              onClick={onCloseDais}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition cursor-pointer"
            >
              Exit Dais
            </button>
          )}
        </div>
      </div>

      {/* Feedback Alert Notice */}
      {feedbackNotice && (
        <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 shrink-0 text-cyan-400" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-black/50 border border-white/10">
          <span className="text-[10px] text-neutral-400 block uppercase">Total Enrolled</span>
          <strong className="text-lg text-white font-display">{voterRoll.length}</strong>
        </div>
        <div className="p-3 rounded-2xl bg-black/50 border border-white/10">
          <span className="text-[10px] text-neutral-400 block uppercase">Council Delegates</span>
          <strong className="text-lg text-cyan-300 font-display">
            {voterRoll.filter(v => v.roleScope === 'COUNCIL_DELEGATE').length}
          </strong>
        </div>
        <div className="p-3 rounded-2xl bg-black/50 border border-white/10">
          <span className="text-[10px] text-neutral-400 block uppercase">Governors</span>
          <strong className="text-lg text-amber-300 font-display">
            {voterRoll.filter(v => v.roleScope === 'UNIVERSE_GOVERNOR').length}
          </strong>
        </div>
        <div className="p-3 rounded-2xl bg-black/50 border border-white/10">
          <span className="text-[10px] text-neutral-400 block uppercase">Ballots Cast</span>
          <strong className="text-lg text-emerald-400 font-display">
            {voterRoll.filter(v => v.hasVoted).length}
          </strong>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('MANAGE')}
          className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'MANAGE' ? 'bg-cyan-500 text-black font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Voter Roll Directory ({voterRoll.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('BULK_IMPORT')}
          className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'BULK_IMPORT' ? 'bg-cyan-500 text-black font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Bulk CSV / Handle Import</span>
        </button>
      </div>

      {/* TAB CONTENT: BULK IMPORT */}
      {activeTab === 'BULK_IMPORT' && (
        <div className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Bulk Delegate &amp; Voter Ingestion</h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              Paste delegate usernames or CSV rows (one per line). Format: <code>@handle, Full Name, Universe Affiliation</code>.
            </p>
          </div>

          <textarea
            rows={6}
            disabled={isFrozen}
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder="@delegate.uk, Alistair Vance, Geneva Diplomatic Universe&#10;@delegate.brazil, Carlos Silva, Climatica Earth Assembly&#10;@delegate.japan, Kenji Sato, Synthetica AI Council"
            className="w-full p-3 rounded-2xl bg-neutral-950 border border-white/15 text-xs font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-cyan-500/40 disabled:opacity-50"
          />

          <div className="flex justify-end">
            <button
              type="button"
              disabled={isFrozen || !bulkText.trim()}
              onClick={handleBulkImport}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold text-xs transition cursor-pointer shadow-md active:scale-95 disabled:opacity-50"
            >
              Parse &amp; Enroll Voters into Roll
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MANAGE & ADD */}
      {activeTab === 'MANAGE' && (
        <div className="space-y-6">
          {/* Add Single Voter Form (if not frozen) */}
          {!isFrozen && (
            <form onSubmit={handleAddSingleVoter} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-bold uppercase">
                <UserPlus className="w-3.5 h-3.5" />
                <span>Enroll Single Delegate or Council Representative</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="text-[10px] uppercase text-neutral-400 block mb-1">Handle</label>
                  <input
                    type="text"
                    required
                    placeholder="@delegate_name"
                    value={newHandle}
                    onChange={(e) => setNewHandle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-white/15 text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase text-neutral-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Representative Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-white/15 text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase text-neutral-400 block mb-1">Role Scope</label>
                  <select
                    value={newRoleScope}
                    onChange={(e) => setNewRoleScope(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-white/15 text-white"
                  >
                    <option value="INDIVIDUAL_VOTER">Individual Voter (1.0x)</option>
                    <option value="COUNCIL_DELEGATE">Council Delegate</option>
                    <option value="UNIVERSE_GOVERNOR">Universe Governor</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition cursor-pointer shadow-md active:scale-95"
                  >
                    Add to Roll
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Search Roll */}
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search registered voters..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-neutral-950 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <span className="text-xs text-neutral-400">
              Showing {filteredRoll.length} of {voterRoll.length} voters
            </span>
          </div>

          {/* Voter Roll Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/60">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-white/5 text-[10px] uppercase text-neutral-400">
                <tr>
                  <th className="py-2.5 px-3">Delegate / Voter</th>
                  <th className="py-2.5 px-3">Universe Affiliation</th>
                  <th className="py-2.5 px-3">Mandate Scope</th>
                  <th className="py-2.5 px-3">Weight</th>
                  <th className="py-2.5 px-3">Status</th>
                  {!isFrozen && <th className="py-2.5 px-3 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {filteredRoll.length === 0 ? (
                  <tr>
                    <td colSpan={isFrozen ? 5 : 6} className="py-10 px-4 text-center">
                      <div className="flex flex-col items-center justify-center gap-1.5 text-neutral-400">
                        <Users className="w-6 h-6 text-neutral-600 mb-1" />
                        <span className="font-bold text-white text-xs">Voter Roll is Clean &amp; Empty</span>
                        <span className="text-[10px] text-neutral-500 max-w-sm">
                          No seeded voters allowed. Add delegates using the Single Entry form or paste voter handles in Bulk Import.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRoll.map((voter) => (
                    <tr key={voter.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-2.5 px-3">
                        <div>
                          <span className="font-bold text-white block font-sans">{voter.fullName}</span>
                          <span className="text-[10px] text-cyan-400">@{voter.voterHandle}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-neutral-300">
                        {voter.universeAffiliation || 'General Plenary'}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                          {voter.roleScope.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-amber-300 font-bold">
                        {voter.mandateWeight}x
                      </td>
                      <td className="py-2.5 px-3">
                        {voter.hasVoted ? (
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Ballot Cast
                          </span>
                        ) : (
                          <span className="text-[10px] text-neutral-500">
                            Eligible
                          </span>
                        )}
                      </td>
                      {!isFrozen && (
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveVoter(voter.id, voter.voterHandle)}
                            className="p-1 rounded text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                            title="Remove voter from roll"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
