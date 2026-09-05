'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Award, 
  ShieldCheck, 
  ShieldAlert, 
  Plus, 
  Building2, 
  Users, 
  Crown, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Trash2, 
  Lock, 
  Sparkles,
  Search,
  Filter,
  FileText,
  FileCheck
} from 'lucide-react';
import { useMun } from '@/context/MunContext';
import { useAuth } from '@/context/AuthContext';
import { MunExperienceRecord } from '@/types/mun';
import { AddMunExperienceModal } from '@/components/mun/AddMunExperienceModal';

interface DelegateDossierViewProps {
  userHandle?: string;
  isOwner?: boolean;
}

export function DelegateDossierView({ userHandle, isOwner = true }: DelegateDossierViewProps) {
  const { getUserExperiences, verifyExperience, deleteExperience } = useMun();
  const { profile } = useAuth();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ATTENDED' | 'HOSTED' | 'VERIFIED' | 'AWARDS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [quickVerifyModalDoc, setQuickVerifyModalDoc] = useState<MunExperienceRecord | null>(null);
  const [verifyUrlInput, setVerifyUrlInput] = useState('');
  const [verifyIdInput, setVerifyIdInput] = useState('');

  const targetHandle = userHandle || profile?.username || 'delegate';
  const allExperiences = getUserExperiences(targetHandle);

  const filteredExperiences = allExperiences.filter((exp) => {
    // Tab filter
    if (activeFilter === 'ATTENDED' && exp.isHostedByMe) return false;
    if (activeFilter === 'HOSTED' && !exp.isHostedByMe) return false;
    if (activeFilter === 'VERIFIED' && !exp.verificationStatus.startsWith('VERIFIED')) return false;
    if (activeFilter === 'AWARDS' && (!exp.award || exp.award === 'PARTICIPATION')) return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        exp.munName.toLowerCase().includes(q) ||
        exp.committee.toLowerCase().includes(q) ||
        exp.portfolioOrTitle.toLowerCase().includes(q) ||
        (exp.agendaOrTopic && exp.agendaOrTopic.toLowerCase().includes(q))
      );
    }

    return true;
  });

  // Calculate high-level stats
  const totalCount = allExperiences.length;
  const attendedCount = allExperiences.filter((e) => !e.isHostedByMe).length;
  const hostedCount = allExperiences.filter((e) => e.isHostedByMe).length;
  const verifiedCount = allExperiences.filter((e) => e.verificationStatus.startsWith('VERIFIED')).length;
  const awardsCount = allExperiences.filter((e) => e.award && e.award !== 'PARTICIPATION').length;
  const verificationRate = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 100;

  const handleQuickVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickVerifyModalDoc) {
      verifyExperience(quickVerifyModalDoc.id, verifyUrlInput, verifyIdInput);
      setQuickVerifyModalDoc(null);
      setVerifyUrlInput('');
      setVerifyIdInput('');
    }
  };

  const getAwardBadge = (award?: string) => {
    switch (award) {
      case 'BEST_DELEGATE':
        return { label: 'Best Delegate (Gavel)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', icon: '🏆' };
      case 'HIGH_COMMENDATION':
        return { label: 'High Commendation', color: 'bg-slate-300/20 text-slate-200 border-slate-400/40', icon: '🥈' };
      case 'SPECIAL_MENTION':
        return { label: 'Special Mention', color: 'bg-amber-700/20 text-amber-400 border-amber-700/40', icon: '🥉' };
      case 'HONORABLE_MENTION':
        return { label: 'Honorable Mention', color: 'bg-zinc-700/20 text-zinc-300 border-zinc-600/40', icon: '🎖️' };
      case 'BEST_POSITION_PAPER':
        return { label: 'Best Position Paper', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', icon: '📜' };
      case 'BEST_CHAIR':
        return { label: 'Best Executive Board', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40', icon: '👑' };
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 text-left font-sans text-white">
      
      {/* ─── METRIC CARDS OVERVIEW ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Conferences */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#07080b] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="font-mono text-[10px] uppercase tracking-wider">Conferences</span>
            <Building2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-extrabold text-2xl sm:text-3xl text-white">{totalCount}</span>
            <span className="text-[11px] text-zinc-400">logged</span>
          </div>
          <p className="text-[10px] text-zinc-400">
            {attendedCount} attended • {hostedCount} hosted
          </p>
        </div>

        {/* Accolades & Gavels */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#07080b] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="font-mono text-[10px] uppercase tracking-wider">Accolades &amp; Awards</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-extrabold text-2xl sm:text-3xl text-white">{awardsCount}</span>
            <span className="text-[11px] text-zinc-400">honors</span>
          </div>
          <p className="text-[10px] text-amber-300 font-medium">
            {awardsCount > 0 ? 'Verified committee citations' : 'No awards logged yet'}
          </p>
        </div>

        {/* Hosted Assemblies */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#07080b] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="font-mono text-[10px] uppercase tracking-wider">Hosted Summits</span>
            <Crown className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-extrabold text-2xl sm:text-3xl text-white">{hostedCount}</span>
            <span className="text-[11px] text-zinc-400">as Secretariat</span>
          </div>
          <p className="text-[10px] text-purple-300 font-medium">
            {hostedCount > 0 ? 'Founder / Secretariat convener' : '0 assemblies organized'}
          </p>
        </div>

        {/* Verification Status */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#07080b] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="font-mono text-[10px] uppercase tracking-wider">Proof Ratification</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-extrabold text-2xl sm:text-3xl text-emerald-400">{verificationRate}%</span>
            <span className="text-[11px] text-zinc-400">verified</span>
          </div>
          <p className="text-[10px] text-zinc-400">
            {verifiedCount} of {totalCount} ratified
          </p>
        </div>
      </div>

      {/* ─── ACTION & FILTER BAR ─── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 rounded-2xl bg-zinc-950 border border-zinc-800">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search MUNs, committees, or portfolios..."
            className="w-full pl-9 pr-4 py-2 bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 text-xs">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer shrink-0 ${
              activeFilter === 'ALL' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            All ({allExperiences.length})
          </button>
          <button
            onClick={() => setActiveFilter('ATTENDED')}
            className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer shrink-0 ${
              activeFilter === 'ATTENDED' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Attended ({attendedCount})
          </button>
          <button
            onClick={() => setActiveFilter('HOSTED')}
            className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer shrink-0 ${
              activeFilter === 'HOSTED' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Hosted ({hostedCount})
          </button>
          <button
            onClick={() => setActiveFilter('AWARDS')}
            className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer shrink-0 ${
              activeFilter === 'AWARDS' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Awards ({awardsCount})
          </button>
          <button
            onClick={() => setActiveFilter('VERIFIED')}
            className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer shrink-0 ${
              activeFilter === 'VERIFIED' ? 'bg-emerald-500 text-black font-semibold' : 'text-zinc-400 hover:text-emerald-400'
            }`}
          >
            Verified ({verifiedCount})
          </button>
        </div>

        {/* Add MUN button */}
        {isOwner && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add MUN Experience</span>
          </button>
        )}
      </div>

      {/* ─── EXPERIENCES LIST ─── */}
      {filteredExperiences.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredExperiences.map((exp) => {
            const awardBadge = getAwardBadge(exp.award);
            const isVerified = exp.verificationStatus.startsWith('VERIFIED');

            return (
              <div 
                key={exp.id} 
                className="p-5 sm:p-6 rounded-3xl bg-[#07080b] border border-white/10 space-y-4 hover:border-white/20 transition relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-3">
                  
                  {/* Top Bar: Role badge + Verification Badge */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    
                    {/* Role Tag */}
                    <div className="flex items-center gap-1.5">
                      {exp.isHostedByMe ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-[10px] font-bold flex items-center gap-1">
                          <Crown className="w-3 h-3 text-purple-400" />
                          HOSTED ASSEMBLY
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold flex items-center gap-1">
                          <Users className="w-3 h-3 text-amber-400" />
                          {exp.role.replace(/_/g, ' ')}
                        </span>
                      )}
                      <span className="text-[11px] text-zinc-500 font-mono">{exp.editionYear}</span>
                    </div>

                    {/* Verification Status */}
                    {isVerified ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        RATIFIED PROOF
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        PENDING PROOF
                      </span>
                    )}
                  </div>

                  {/* Conference & Allocation */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-white tracking-tight">
                      {exp.munName}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-300 font-medium">
                      <span className="text-zinc-400 font-mono">{exp.committee}</span>
                      <span>•</span>
                      <span className="text-white font-semibold">{exp.portfolioOrTitle}</span>
                    </div>
                  </div>

                  {/* Award Badge (if any) */}
                  {awardBadge && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold font-mono shadow-sm bg-gradient-to-r from-amber-500/10 to-transparent border-amber-500/30 text-amber-300">
                      <span>{awardBadge.icon}</span>
                      <span>{awardBadge.label}</span>
                    </div>
                  )}

                  {/* Agenda / Topic */}
                  {exp.agendaOrTopic && (
                    <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/80">
                      <span className="font-mono text-[10px] text-zinc-500 block uppercase mb-0.5">Simulated Agenda</span>
                      {exp.agendaOrTopic}
                    </p>
                  )}
                </div>

                {/* Bottom Footer: Proof link / Actions */}
                <div className="pt-3 border-t border-zinc-900 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-zinc-500 font-mono text-[11px]">
                    {exp.certificateId && (
                      <span className="text-zinc-400 flex items-center gap-1" title="Certificate ID">
                        <Lock className="w-3 h-3 text-zinc-500" />
                        {exp.certificateId}
                      </span>
                    )}
                    {exp.verificationProofUrl && (
                      <a 
                        href={exp.verificationProofUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View Certificate</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!isVerified && isOwner && (
                      <button
                        onClick={() => {
                          setQuickVerifyModalDoc(exp);
                          setVerifyUrlInput(exp.verificationProofUrl || '');
                          setVerifyIdInput(exp.certificateId || '');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-[11px] font-semibold transition cursor-pointer"
                      >
                        Add Proof
                      </button>
                    )}

                    {isOwner && (
                      <button
                        onClick={() => deleteExperience(exp.id)}
                        className="p-1.5 rounded-lg text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                        title="Remove record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-10 sm:p-14 rounded-3xl bg-[#07080b] border border-white/10 text-center space-y-4">
          <Building2 className="w-10 h-10 text-zinc-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-bold text-base text-white">No Diplomatic Records Logged Yet</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Build your verifiable Model UN track record. Add conferences you&apos;ve participated in as a delegate, chaired, or hosted as Secretariat.
            </p>
          </div>
          {isOwner && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition inline-flex items-center gap-1.5 shadow-lg shadow-white/5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Your First MUN Conference</span>
            </button>
          )}
        </div>
      )}

      {/* ─── ADD MUN MODAL ─── */}
      <AddMunExperienceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* ─── QUICK PROOF ATTACH MODAL ─── */}
      {quickVerifyModalDoc && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm p-3 sm:p-6 flex flex-col justify-start sm:justify-center items-center">
          <div className="w-full max-w-md bg-[#090a0f] border border-white/15 rounded-3xl p-6 space-y-5 text-white font-sans text-left my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="space-y-0.5">
                <h3 className="font-bold text-base text-white">Verify MUN Participation</h3>
                <p className="text-xs text-zinc-400">{quickVerifyModalDoc.munName}</p>
              </div>
              <button 
                onClick={() => setQuickVerifyModalDoc(null)} 
                className="p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickVerifySubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold block">
                  Certificate Scan / Drive URL
                </label>
                <input
                  type="url"
                  value={verifyUrlInput}
                  onChange={(e) => setVerifyUrlInput(e.target.value)}
                  placeholder="https://drive.google.com/file/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/30"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold block">
                  Certificate Serial / Reference Code (Optional)
                </label>
                <input
                  type="text"
                  value={verifyIdInput}
                  onChange={(e) => setVerifyIdInput(e.target.value)}
                  placeholder="e.g. CERT-2026-UNSC-092"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuickVerifyModalDoc(null)}
                  className="px-4 py-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-400 text-black font-bold text-xs hover:bg-emerald-300 transition"
                >
                  Ratify Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
