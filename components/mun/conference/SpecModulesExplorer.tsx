'use client';

import React, { useState } from 'react';
import { 
  ZEN_MUN_21_MODULES, 
  ModuleSpecDefinition 
} from '@/types/munConferenceOS';
import { 
  Sparkles, 
  Search, 
  Layers, 
  CheckCircle2, 
  ChevronRight, 
  ExternalLink,
  Shield,
  Filter,
  Sliders,
  Users,
  Grid,
  Calendar,
  Radio,
  CheckSquare,
  Gavel,
  FileText,
  Megaphone,
  CreditCard,
  Award,
  FileCheck2,
  Newspaper,
  LifeBuoy,
  BarChart3,
  Zap,
  ShieldAlert,
  Archive,
  LayoutDashboard,
  Briefcase
} from 'lucide-react';

interface SpecModulesExplorerProps {
  onSelectModule?: (moduleId: string) => void;
  activeModuleId?: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  Sliders,
  Grid,
  Users,
  Layers,
  Briefcase,
  Calendar,
  Radio,
  CheckSquare,
  Gavel,
  FileText,
  Megaphone,
  CreditCard,
  Award,
  FileCheck2,
  Newspaper,
  LifeBuoy,
  BarChart3,
  Zap,
  ShieldAlert,
  Archive
};

export function SpecModulesExplorer({ onSelectModule, activeModuleId }: SpecModulesExplorerProps) {
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'Core' | 'Connected'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const filteredModules = ZEN_MUN_21_MODULES.filter((m) => {
    if (filterCategory !== 'ALL' && m.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.code.toLowerCase().includes(q) ||
        m.number.includes(q) ||
        m.featureRequirements.some((r) => r.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-black/40 border border-white/10">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/10 w-full sm:w-auto">
          {(['ALL', 'Core', 'Connected'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                filterCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {cat === 'ALL' ? 'All (21)' : cat === 'Core' ? 'Core Modules (16)' : 'Connected Ecosystem (5)'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all 21 modules..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400/50 font-sans"
          />
        </div>
      </div>

      {/* Modules Count Indicator */}
      <div className="flex items-center justify-between text-xs font-mono text-neutral-400 px-1">
        <span>Showing {filteredModules.length} of 21 operational modules</span>
        <span className="text-cyan-400">V1.0 Secretariat Spec Ratified</span>
      </div>

      {/* 21 Modules Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModules.map((mod) => {
          const Icon = ICON_MAP[mod.iconName] || LayoutDashboard;
          const isExpanded = expandedModule === mod.id;

          return (
            <div
              key={mod.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 group ${
                isExpanded
                  ? 'bg-gradient-to-b from-[#0c1220] to-[#07090e] border-cyan-400/40 shadow-[0_0_30px_rgba(6,182,212,0.15)]'
                  : 'bg-[#07090e] hover:bg-[#0a0d16] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono text-xs font-bold">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-xs font-black text-neutral-400 tracking-wider">
                      {mod.number}
                    </span>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold border ${
                    mod.category === 'Core'
                      ? 'bg-amber-400/10 border-amber-400/30 text-amber-300'
                      : 'bg-cyan-400/10 border-cyan-400/30 text-cyan-300'
                  }`}>
                    {mod.category}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white font-display tracking-tight group-hover:text-cyan-300 transition">
                    {mod.title}
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans mt-1">
                    {mod.description}
                  </p>
                </div>

                {/* Feature Requirements List */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
                    Feature Requirements:
                  </span>
                  <ul className="space-y-1.5 text-[11px] text-neutral-300 font-sans">
                    {mod.featureRequirements.slice(0, isExpanded ? undefined : 3).map((req, i) => (
                      <li key={i} className="flex items-start gap-1.5 leading-snug">
                        <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>

                  {mod.featureRequirements.length > 3 && (
                    <button
                      type="button"
                      onClick={() => setExpandedModule(isExpanded ? null : mod.id)}
                      className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer mt-1"
                    >
                      {isExpanded ? 'Show less' : `+ ${mod.featureRequirements.length - 3} more requirements`}
                    </button>
                  )}
                </div>
              </div>

              {onSelectModule && (
                <button
                  type="button"
                  onClick={() => onSelectModule(mod.code)}
                  className="w-full py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 text-neutral-300 hover:text-white font-mono text-xs flex items-center justify-between cursor-pointer transition"
                >
                  <span>Open {mod.title} Desk</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
