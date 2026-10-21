'use client';

import React from 'react';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  FileText, 
  Scale, 
  ChevronRight, 
  Globe2, 
  ExternalLink 
} from 'lucide-react';
import { UniverseGovernanceSpace, FactionOrCouncil } from '@/types/voting';

export interface UniverseChamberViewProps {
  universes: UniverseGovernanceSpace[];
  factions: FactionOrCouncil[];
  onSelectUniverse?: (universeId: string) => void;
}

export function UniverseChamberView({
  universes,
  factions,
  onSelectUniverse,
}: UniverseChamberViewProps) {
  return (
    <div className="space-y-8 font-sans">
      {/* Intro Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-cyan-950/20 to-black border border-cyan-500/30 font-mono">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Building2 className="w-4 h-4" />
          <span>Multiversal Governance Architecture</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
          Active Universes &amp; Representative Councils
        </h2>
        <p className="text-xs text-neutral-400 mt-1 max-w-2xl font-sans leading-relaxed">
          Each recognized universe operates as an autonomous constitutional space with an immutable charter version, elected councils, and sovereign voting weights.
        </p>
      </div>

      {/* Universes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {universes.map((univ) => {
          const univFactions = factions.filter(f => f.universeId === univ.id);

          return (
            <div
              key={univ.id}
              className="p-5 rounded-2xl bg-[#080c14] border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${univ.badgeColor}`}>
                    {univ.charterVersion}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    Weight: {univ.universeWeight.toFixed(1)}x
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white font-display group-hover:text-cyan-300 transition">
                    {univ.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {univ.description}
                  </p>
                </div>

                {/* Charter Preamble Callout */}
                <div className="p-3 rounded-xl bg-black/50 border border-white/5 font-mono text-[10px] text-neutral-400 italic">
                  &ldquo;{univ.charterPreamble}&rdquo;
                </div>
              </div>

              {/* Stats & Factions count */}
              <div className="pt-3 border-t border-white/10 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{univ.totalVoters.toLocaleString()} Voters</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-amber-400" />
                    <span>{univ.councilCount} Councils</span>
                  </span>
                </div>

                {/* Associated Councils / Factions Preview */}
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block">
                    Recognized Councils &amp; Factions
                  </span>
                  {univFactions.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {univFactions.map(f => (
                        <span
                          key={f.id}
                          className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-neutral-300 border border-white/10"
                        >
                          {f.name} ({f.seats} seats)
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-neutral-500 italic">
                      No representative councils ratified yet.
                    </p>
                  )}
                </div>

                {onSelectUniverse && (
                  <button
                    onClick={() => onSelectUniverse(univ.id)}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>View Universe Ballots</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
