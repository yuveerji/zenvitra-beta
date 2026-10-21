'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ExternalLink, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import {
  ZenAppItem,
  ECOSYSTEM_CLUSTERS,
  EcosystemClusterId
} from '@/lib/zenAppsRegistry';
import { DynamicZenIcon } from './DynamicZenIcon';

interface ApplicationListViewProps {
  apps: ZenAppItem[];
  selectedApp: ZenAppItem | null;
  onSelectApp: (app: ZenAppItem) => void;
  selectedClusterId: EcosystemClusterId | 'ALL';
}

export function ApplicationListView({
  apps,
  selectedApp,
  onSelectApp,
  selectedClusterId,
}: ApplicationListViewProps) {
  // Group apps by cluster
  const clusters = Object.values(ECOSYSTEM_CLUSTERS);

  const filteredClusters = selectedClusterId === 'ALL'
    ? clusters
    : clusters.filter((c) => c.id === selectedClusterId);

  return (
    <div className="w-full space-y-8 py-4 text-left select-none">
      {filteredClusters.map((cluster) => {
        const clusterApps = apps.filter((a) => a.clusterId === cluster.id);
        if (clusterApps.length === 0) return null;

        return (
          <div key={cluster.id} className="space-y-3.5">
            {/* Cluster Section Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span
                  className="w-3 h-3 rounded-full shrink-0 shadow-lg"
                  style={{
                    backgroundColor: cluster.accentColor,
                    boxShadow: `0 0 10px ${cluster.accentColor}`,
                  }}
                />
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    {cluster.name}
                  </h3>
                  <p className="text-xs font-mono text-neutral-400">
                    {cluster.tagline}
                  </p>
                </div>
              </div>

              <span
                className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border"
                style={{
                  backgroundColor: `${cluster.accentColor}15`,
                  borderColor: `${cluster.accentColor}30`,
                  color: cluster.accentColor,
                }}
              >
                {clusterApps.length} Apps
              </span>
            </div>

            {/* Grid of App Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {clusterApps.map((app) => {
                const isSelected = selectedApp?.id === app.id;

                return (
                  <div
                    key={app.id}
                    onClick={() => onSelectApp(app)}
                    className={`p-4 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 text-left group ${
                      isSelected
                        ? 'bg-white/[0.08] shadow-[0_0_30px_rgba(255,255,255,0.1)] scale-[1.01]'
                        : 'bg-[#090b10]/90 border-white/10 hover:border-white/25 hover:bg-white/[0.04]'
                    }`}
                    style={{
                      borderColor: isSelected ? cluster.accentColor : undefined,
                    }}
                  >
                    <div>
                      {/* Top Bar: Icon + Status */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div
                          className="w-9 h-9 rounded-2xl border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
                          style={{
                            backgroundColor: `${cluster.accentColor}15`,
                            borderColor: `${cluster.accentColor}30`,
                            color: cluster.accentColor,
                          }}
                        >
                          <DynamicZenIcon name={app.iconName} className="w-4 h-4" />
                        </div>

                        <span
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                            app.status === 'Live'
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                              : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>

                      <h4 className="font-display font-bold text-sm text-white group-hover:text-cyan-200 transition-colors">
                        {app.name}
                      </h4>
                      <p className="text-xs text-neutral-400 font-sans leading-snug mt-1 line-clamp-2">
                        {app.description}
                      </p>
                    </div>

                    {/* Capabilities & Route Action */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                      <span className="text-[10px] text-neutral-500">
                        {app.capabilities.length} Capabilities
                      </span>

                      {app.route ? (
                        <span className="text-cyan-400 group-hover:text-cyan-300 font-bold flex items-center gap-1 text-[11px]">
                          <span>Explore App</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      ) : (
                        <span className="text-neutral-500 text-[10px]">
                          Spec Node
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
