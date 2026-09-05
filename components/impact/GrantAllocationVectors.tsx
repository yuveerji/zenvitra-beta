'use client';

import React from 'react';
import { Sun, BookOpen, Users, HeartHandshake, ShieldCheck, Activity } from 'lucide-react';

interface AllocationVector {
  id: string;
  title: string;
  region: string;
  allocationPercent: number;
  icon: React.ComponentType<{ className?: string }>;
  mandate: string;
  auditedMetric: {
    count: number | null; // null = unaudited / standby
    unit: string;
    isAudited: boolean;
  };
}

export function GrantAllocationVectors() {
  // Real audited data switches here dynamically once ratified
  const vectors: AllocationVector[] = [
    {
      id: 'solar_grids',
      title: 'Rural School Solar Grids',
      region: 'Rajasthan & Odisha',
      allocationPercent: 25,
      icon: Sun,
      mandate: 'DIRECT YOUTH',
      auditedMetric: {
        count: null, // Set to number (e.g. 6) when audited
        unit: 'Schools Powered',
        isAudited: false
      }
    },
    {
      id: 'media_fellowships',
      title: 'Youth Media Fellowships',
      region: 'Pan-India & Global',
      allocationPercent: 25,
      icon: BookOpen,
      mandate: 'DIRECT YOUTH',
      auditedMetric: {
        count: null,
        unit: 'Student Reporters',
        isAudited: false
      }
    },
    {
      id: 'summit_passes',
      title: 'Model UN & Summit Passes',
      region: 'Global Delegations',
      allocationPercent: 25,
      icon: Users,
      mandate: 'DIRECT YOUTH',
      auditedMetric: {
        count: null,
        unit: 'Passes Sponsored',
        isAudited: false
      }
    },
    {
      id: 'civic_grants',
      title: 'Civic Innovation Grants',
      region: 'Grassroots Labs',
      allocationPercent: 25,
      icon: HeartHandshake,
      mandate: 'DIRECT YOUTH',
      auditedMetric: {
        count: null,
        unit: 'Youth Projects',
        isAudited: false
      }
    }
  ];

  return (
    <section className="w-full py-12 text-white font-sans">
      <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-display text-white">
            Grant Allocation Vectors
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase">
            Constitutional Vectors
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vectors.map((vec) => {
          const Icon = vec.icon;
          const { count, unit, isAudited } = vec.auditedMetric;

          return (
            <div
              key={vec.id}
              className="p-6 rounded-3xl bg-[#06080d] border border-white/10 relative overflow-hidden flex flex-col justify-between gap-6 shadow-xl hover:border-white/20 transition duration-300"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-emerald-400">
                  <Icon className="w-5 h-5 stroke-[1.5]" />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-bold tracking-wider">
                  {vec.allocationPercent}% ALLOCATION
                </span>
              </div>

              {/* Title & Region */}
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {vec.title}
                </h3>
                <p className="text-xs font-mono text-cyan-400/90 tracking-wide">
                  {vec.region}
                </p>
              </div>

              {/* Footer Mandate & Real Audit Dynamic Status */}
              <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs font-mono">
                <div className="flex items-center gap-2 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-bold tracking-wider">
                    MANDATE: {vec.mandate}
                  </span>
                </div>

                {/* Audit Metric State */}
                <div>
                  {isAudited && count !== null ? (
                    <span className="text-white font-bold text-xs tracking-tight animate-in fade-in duration-500">
                      {count} {unit}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[10px] tracking-wider font-bold animate-pulse">
                      <Activity className="w-3 h-3 text-amber-400" />
                      AUDIT STANDBY
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}