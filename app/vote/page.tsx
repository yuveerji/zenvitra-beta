'use client';

import React, { useState, useEffect } from 'react';
import { 
  Vote, 
  Building2, 
  BarChart3, 
  ShieldCheck, 
  History, 
  Layers, 
  PlusCircle, 
  Search, 
  CheckCircle2, 
  Clock, 
  Lock, 
  Scale, 
  Globe2,
  Calendar,
  Sparkles,
  ChevronRight,
  Gavel
} from 'lucide-react';
import { MultiversalElection, UniverseGovernanceSpace, FactionOrCouncil, UserBallotReceipt, VoterRollEntry } from '@/types/voting';
import { INITIAL_ELECTIONS, INITIAL_UNIVERSES, INITIAL_FACTIONS_AND_COUNCILS } from '@/lib/voting/votingData';
import { BallotRoom } from '@/components/voting/BallotRoom';
import { UniverseChamberView } from '@/components/voting/UniverseChamberView';
import { ResultsObservatory } from '@/components/voting/ResultsObservatory';
import { CommissionerDais } from '@/components/voting/CommissionerDais';
import { useAuth } from '@/context/AuthContext';

export default function ZenVoteHub() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'ACTIVE_BALLOTS' | 'UNIVERSES' | 'OBSERVATORY' | 'CREATE_ELECTION' | 'COMMISSIONER_DAIS'>('ACTIVE_BALLOTS');
  const [elections, setElections] = useState<MultiversalElection[]>(INITIAL_ELECTIONS);
  const [selectedElection, setSelectedElection] = useState<MultiversalElection | null>(null);
  const [daisElection, setDaisElection] = useState<MultiversalElection | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModeFilter, setSelectedModeFilter] = useState<string>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for Create Election
  const [newTitle, setNewTitle] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newMode, setNewMode] = useState<string>('MODE_A_INDIVIDUAL');
  const [newUniverseId, setNewUniverseId] = useState<string>('');
  const [newOptionsText, setNewOptionsText] = useState('Yes\nNo\nAbstain');

  const currentUserHandle = user?.username || profile?.username || 'delegate.member';
  const isOfficer = profile?.role === 'admin' || profile?.role === 'core_team' || currentUserHandle === 'yuveer';

  useEffect(() => {
    async function loadElections() {
      try {
        const res = await fetch('/api/v1/vote/elections');
        const data = await res.json();
        if (data.elections) {
          setElections(data.elections);
        }
      } catch (e) {
        // Fallback to in-state registry
      }
    }
    loadElections();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleUpdateVoterRoll = async (electionId: string, updatedRoll: VoterRollEntry[], isFrozen: boolean) => {
    try {
      const res = await fetch('/api/v1/vote/elections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          electionId,
          voterRollSnapshot: updatedRoll,
          isVoterRollFrozen: isFrozen,
          commissionerHandle: currentUserHandle,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setElections(prev => prev.map(e => e.id === electionId ? data.election : e));
      if (selectedElection?.id === electionId) {
        setSelectedElection(data.election);
      }
      if (daisElection?.id === electionId) {
        setDaisElection(data.election);
      }
      showToast(isFrozen ? 'Voter roll locked & sealed under Article II!' : 'Voter roll updated successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to update voter roll');
    }
  };

  const filteredElections = elections.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      e.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.electionCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = selectedModeFilter === 'ALL' || e.mode === selectedModeFilter;
    return matchesSearch && matchesMode;
  });

  const handleCreateElection = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedOptions = newOptionsText.split('\n').map(t => t.trim()).filter(Boolean);

    if (parsedOptions.length < 2) {
      showToast('Please provide at least 2 distinct options on separate lines.');
      return;
    }

    try {
      const res = await fetch('/api/v1/vote/elections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          summary: newSummary,
          mode: newMode,
          universeId: newUniverseId || undefined,
          options: parsedOptions,
          eligibleVoterCount: 1500,
          quorumNeededPercent: 40,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create election');

      setElections([data.election, ...elections]);
      showToast(`Election Draft ${data.election.electionCode} initialized!`);
      setActiveTab('ACTIVE_BALLOTS');
      setNewTitle('');
      setNewSummary('');
    } catch (err: any) {
      showToast(err.message || 'Error creating election');
    }
  };

  const handleRunTally = async (electionId: string) => {
    try {
      const res = await fetch('/api/v1/vote/tally', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ electionId, officerHandle: currentUserHandle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setElections(prev => prev.map(e => e.id === electionId ? data.election : e));
      setSelectedElection(data.election);
      showToast('Tally computed and signed off by Returning Officer!');
    } catch (err: any) {
      showToast(err.message || 'Failed to run tally');
    }
  };

  return (
    <div className="min-h-screen bg-[#040711] text-neutral-200 flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 px-4 py-2.5 rounded-2xl bg-cyan-500 text-black font-mono text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce border border-white/20">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero / Header Nav */}
      <header className="border-b border-white/10 bg-black/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-black font-bold shadow-[0_0_25px_rgba(6,182,212,0.4)]">
              <Vote className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white font-display tracking-wide">
                  ZEN.VOTE
                </h1>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-bold">
                  MULTIVERSAL ENGINE V1.0
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono hidden sm:block">
                One platform. Multiple universes. Every vote has a defined mandate.
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-950 border border-white/10 text-xs font-mono">
            <button
              onClick={() => { setSelectedElection(null); setActiveTab('ACTIVE_BALLOTS'); }}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'ACTIVE_BALLOTS' && !selectedElection
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Vote className="w-3.5 h-3.5" />
              <span>Ballots &amp; Polls</span>
            </button>
            <button
              onClick={() => { setSelectedElection(null); setActiveTab('UNIVERSES'); }}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'UNIVERSES'
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Universes &amp; Councils</span>
            </button>
            <button
              onClick={() => { setSelectedElection(null); setActiveTab('OBSERVATORY'); }}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'OBSERVATORY'
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Observatory</span>
            </button>
            <button
              onClick={() => { 
                setSelectedElection(null); 
                if (!daisElection && elections.length > 0) setDaisElection(elections[0]);
                setActiveTab('COMMISSIONER_DAIS'); 
              }}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'COMMISSIONER_DAIS'
                  ? 'bg-amber-400 text-black font-bold shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Gavel className="w-3.5 h-3.5" />
              <span>Commissioner Dais</span>
            </button>
            {isOfficer && (
              <button
                onClick={() => { setSelectedElection(null); setActiveTab('CREATE_ELECTION'); }}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'CREATE_ELECTION'
                    ? 'bg-cyan-500 text-black font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create Ballot</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {/* If user clicked to vote in an active ballot room */}
        {selectedElection ? (
          <BallotRoom
            election={selectedElection}
            currentUserHandle={currentUserHandle}
            onBack={() => setSelectedElection(null)}
            onBallotSuccess={(receipt) => {
              showToast(`Ballot committed! Receipt #${receipt.receiptId}`);
            }}
          />
        ) : activeTab === 'UNIVERSES' ? (
          <UniverseChamberView
            universes={INITIAL_UNIVERSES}
            factions={INITIAL_FACTIONS_AND_COUNCILS}
            onSelectUniverse={(univId) => {
              setSearchQuery(univId);
              setActiveTab('ACTIVE_BALLOTS');
            }}
          />
        ) : activeTab === 'OBSERVATORY' ? (
          <div className="space-y-6">
            <div className="text-center space-y-1 mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                Certified Results &amp; Observational Observatory
              </h2>
              <p className="text-xs text-neutral-400 font-mono">
                Inspect voter turnout, quorum verifications, multi-chamber tallies, and cryptographic signoff hashes.
              </p>
            </div>
            {elections.length === 0 ? (
              <div className="p-12 rounded-3xl bg-neutral-950/60 border border-white/10 text-center space-y-3 font-mono">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white font-display">Observatory Ledger Clear</h3>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  No certified election outcomes recorded yet. Ballots will be displayed here once tallies are certified by Returning Officers.
                </p>
              </div>
            ) : (
              elections.map((elec) => (
                <ResultsObservatory
                  key={elec.id}
                  election={elec}
                  isOfficer={isOfficer}
                  onRunTally={() => handleRunTally(elec.id)}
                />
              ))
            )}
          </div>
        ) : activeTab === 'COMMISSIONER_DAIS' ? (
          <div className="space-y-6">
            {/* Election Selector Pill Bar for Dais */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-neutral-950/80 border border-white/10 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Gavel className="w-4 h-4 text-amber-400" />
                <span className="text-neutral-300 font-bold uppercase tracking-wider text-[11px]">
                  Select Jurisdiction / Ballot:
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {elections.length > 0 ? (
                  elections.map((elec) => (
                    <button
                      key={elec.id}
                      onClick={() => setDaisElection(elec)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition cursor-pointer flex items-center gap-1.5 ${
                        daisElection?.id === elec.id
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/60 font-bold shadow-sm'
                          : 'bg-black/60 text-neutral-400 border-white/10 hover:border-white/25'
                      }`}
                    >
                      <span>{elec.electionCode}</span>
                      <span className="text-[10px] text-neutral-500">
                        ({elec.voterRollSnapshot?.length || elec.eligibleVoterCount})
                      </span>
                    </button>
                  ))
                ) : (
                  <span className="text-xs text-neutral-500 italic">No elections available to administer</span>
                )}
              </div>
            </div>

            {daisElection ? (
              <CommissionerDais
                election={daisElection}
                commissionerHandle={currentUserHandle}
                onUpdateVoterRoll={handleUpdateVoterRoll}
                onCloseDais={() => setActiveTab('ACTIVE_BALLOTS')}
              />
            ) : (
              <div className="p-12 rounded-3xl bg-neutral-950/60 border border-white/10 text-center space-y-3 font-mono">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                  <Gavel className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white font-display">Commissioner Dais Inactive</h3>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  {elections.length === 0
                    ? 'No registered elections exist in the platform registry. Create an election to administer its voter roll and freeze snapshots.'
                    : 'Select a ballot from the jurisdiction selector above to administer its voter roll.'}
                </p>
                {isOfficer && elections.length === 0 && (
                  <button
                    onClick={() => setActiveTab('CREATE_ELECTION')}
                    className="mt-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs font-mono transition cursor-pointer shadow-md"
                  >
                    Create Election Ballot
                  </button>
                )}
              </div>
            )}
          </div>
        ) : activeTab === 'CREATE_ELECTION' ? (
          /* CREATE ELECTION DRAFT INTERFACE */
          <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#080d18] border border-cyan-500/30 space-y-6 font-mono">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white font-display">
                Create Multiversal Election or Consultative Ballot
              </h2>
              <p className="text-xs text-neutral-400">
                Configure voting mode, governance chamber, quorum threshold, and ballot options.
              </p>
            </div>

            <form onSubmit={handleCreateElection} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase text-neutral-400 block mb-1">Title / Motion</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. UNSC Resolution 2743 / Committee Motion"
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-neutral-400 block mb-1">Summary &amp; Context</label>
                <textarea
                  rows={3}
                  required
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Describe the proposal, operative clauses, or mandate..."
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase text-neutral-400 block mb-1">Voting Mode</label>
                  <select
                    value={newMode}
                    onChange={(e) => setNewMode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white"
                  >
                    <option value="MODE_A_INDIVIDUAL">Mode A: Individual (1 Person = 1 Ballot)</option>
                    <option value="MODE_B_UNIVERSE">Mode B: Universe Representation</option>
                    <option value="MODE_C_FACTION_COUNCIL">Mode C: Council / Faction Mandate</option>
                    <option value="MODE_D_RANKED_CHOICE">Mode D: Ranked Choice (Instant-Runoff)</option>
                    <option value="MODE_E_HYBRID_CHAMBER">Mode E: Hybrid Double-Majority</option>
                    <option value="MODE_F_CONFIGURABLE_POLL">Mode F: Configurable Poll</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase text-neutral-400 block mb-1">Associated Universe</label>
                  <select
                    value={newUniverseId}
                    onChange={(e) => setNewUniverseId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white"
                  >
                    <option value="">Cross-Multiverse (All Universes)</option>
                    {INITIAL_UNIVERSES.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase text-neutral-400 block mb-1">Ballot Options (One per line)</label>
                <textarea
                  rows={4}
                  required
                  value={newOptionsText}
                  onChange={(e) => setNewOptionsText(e.target.value)}
                  placeholder="In Favour&#10;Against&#10;Abstain"
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold uppercase tracking-wider transition cursor-pointer shadow-lg active:scale-95"
              >
                Initialize &amp; Freeze Election Draft
              </button>
            </form>
          </div>
        ) : (
          /* ACTIVE BALLOTS FEED */
          <div className="space-y-6">
            {/* Search & Mode Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[260px] max-w-md">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search motions, resolutions, or universes..."
                  className="w-full pl-9 pr-4 py-2 rounded-2xl bg-neutral-950 border border-white/10 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              {/* Mode Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                {['ALL', 'MODE_A_INDIVIDUAL', 'MODE_C_FACTION_COUNCIL', 'MODE_D_RANKED_CHOICE', 'MODE_E_HYBRID_CHAMBER'].map((modeKey) => (
                  <button
                    key={modeKey}
                    onClick={() => setSelectedModeFilter(modeKey)}
                    className={`px-2.5 py-1 rounded-xl border transition cursor-pointer ${
                      selectedModeFilter === modeKey
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                        : 'bg-black/50 text-neutral-400 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {modeKey === 'ALL' ? 'All Modes' : modeKey.replace('MODE_', '').replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Elections Grid or Clean Empty State */}
            {filteredElections.length === 0 ? (
              <div className="p-12 rounded-3xl bg-neutral-950/60 border border-white/10 text-center space-y-3 font-mono">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                  <Vote className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white font-display">No Active Ballots or Motions</h3>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  {searchQuery || selectedModeFilter !== 'ALL'
                    ? 'No elections match the selected filter criteria.'
                    : 'The plenary docket is clear. Zero mock or seeded elections exist on the platform.'}
                </p>
                {isOfficer && (
                  <button
                    onClick={() => setActiveTab('CREATE_ELECTION')}
                    className="mt-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono transition cursor-pointer shadow-md"
                  >
                    Create New Ballot
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredElections.map((elec) => (
                  <div
                    key={elec.id}
                    className="p-5 rounded-3xl bg-[#070b14] border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-bold">
                          {elec.electionCode}
                        </span>
                        <span className={`text-[10px] font-mono font-bold ${
                          elec.state === 'OPEN' ? 'text-emerald-400' : 'text-neutral-400'
                        }`}>
                          {elec.state}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white font-display group-hover:text-cyan-300 transition line-clamp-2">
                          {elec.title}
                        </h3>
                        <p className="text-xs text-neutral-400 mt-1 line-clamp-3 leading-relaxed">
                          {elec.summary}
                        </p>
                      </div>

                      {/* Voting Mode & Quorum Specs */}
                      <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1 font-mono text-[11px]">
                        <div className="flex justify-between text-neutral-400">
                          <span>Governance:</span>
                          <strong className="text-neutral-200">{elec.governanceLevel.replace('_', ' ')}</strong>
                        </div>
                        <div className="flex justify-between text-neutral-400">
                          <span>Mode:</span>
                          <strong className="text-cyan-300">{elec.mode.replace('MODE_', '').replace(/_/g, ' ')}</strong>
                        </div>
                        <div className="flex justify-between text-neutral-400">
                          <span>Turnout:</span>
                          <strong className={elec.isQuorumMet ? 'text-emerald-400' : 'text-amber-400'}>
                            {elec.votesCastCount} / {elec.eligibleVoterCount} ({elec.eligibleVoterCount > 0 ? Math.round((elec.votesCastCount / elec.eligibleVoterCount) * 100) : 0}%)
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 space-y-2">
                      {elec.state === 'OPEN' ? (
                        <button
                          onClick={() => setSelectedElection(elec)}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold text-xs font-mono uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                        >
                          <Vote className="w-3.5 h-3.5" />
                          <span>Enter Ballot Room</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => { setSelectedElection(null); setActiveTab('OBSERVATORY'); }}
                          className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 text-xs font-mono transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>View Certified Tally</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setDaisElection(elec);
                          setActiveTab('COMMISSIONER_DAIS');
                        }}
                        className="w-full py-2 rounded-xl bg-neutral-900/90 hover:bg-amber-500/10 text-neutral-300 hover:text-amber-300 border border-white/5 hover:border-amber-500/30 text-[11px] font-mono transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Gavel className="w-3 h-3 text-amber-400" />
                        <span>Commissioner Dais &bull; Voter Roll ({elec.voterRollSnapshot?.length || elec.eligibleVoterCount})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
