'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Copy,
  Check,
  Zap,
  Globe2,
  Info,
  Radio,
  Cpu,
  Database,
  ArrowUpRight
} from 'lucide-react';
import {
  ZenAppItem,
  SharedPlatformService,
  ZenAppModule,
  UniverseIntegration,
  ECOSYSTEM_CLUSTERS,
  ZEN_APPS_REGISTRY,
  getModulesForApp,
  getAppForModule
} from '@/lib/zenAppsRegistry';
import { DynamicZenIcon } from './DynamicZenIcon';

interface ApplicationDetailsPanelProps {
  selectedApp: ZenAppItem | null;
  selectedService: SharedPlatformService | null;
  selectedModule?: ZenAppModule | null;
  selectedIntegration?: UniverseIntegration | null;
  onClose: () => void;
  onSelectApp: (app: ZenAppItem) => void;
  onSelectModule?: (mod: ZenAppModule) => void;
  onSelectIntegration?: (integration: UniverseIntegration) => void;
  onHighlightConnections?: (appId: string) => void;
}

export function ApplicationDetailsPanel({
  selectedApp,
  selectedService,
  selectedModule,
  selectedIntegration,
  onClose,
  onSelectApp,
  onSelectModule,
  onSelectIntegration,
  onHighlightConnections,
}: ApplicationDetailsPanelProps) {
  const [copied, setCopied] = React.useState(false);

  if (!selectedApp && !selectedService && !selectedModule && !selectedIntegration) return null;

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. RENDER PLATFORM INFRASTRUCTURE SERVICE (LEVEL 3)
  if (selectedService) {
    const dependentApps = ZEN_APPS_REGISTRY.filter((a) =>
      selectedService.dependentAppIds.includes(a.id)
    );

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-h-[calc(82vh-1rem)] lg:max-h-[720px] rounded-3xl bg-[#090d16]/98 border border-cyan-500/35 shadow-[0_20px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl flex flex-col text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Fixed Header */}
          <div className="shrink-0 p-5 sm:p-6 pb-3 border-b border-white/10 relative z-10 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 flex items-center justify-center shrink-0 shadow-lg">
                <Database className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[9px] font-mono text-cyan-300 font-bold uppercase tracking-wider mb-1">
                  <span>LEVEL 3 &bull; SHARED INFRASTRUCTURE</span>
                </div>
                <h3 className="font-display font-extrabold text-lg text-white">
                  {selectedService.name}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer shrink-0"
              title="Close Panel (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4 relative z-10 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <p className="text-xs text-neutral-300 font-sans leading-relaxed">
              {selectedService.description}
            </p>

            {/* Core Capabilities */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                KEY INFRASTRUCTURE CAPABILITIES:
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {selectedService.features.map((feat, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] font-mono text-cyan-200 flex items-center gap-2"
                  >
                    <Zap className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dependent Applications */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                DEPENDENT ECOSYSTEM APPLICATIONS ({dependentApps.length}):
              </span>
              <div className="grid grid-cols-2 gap-2">
                {dependentApps.map((depApp) => {
                  const cluster = ECOSYSTEM_CLUSTERS[depApp.clusterId];
                  return (
                    <button
                      key={depApp.id}
                      type="button"
                      onClick={() => onSelectApp(depApp)}
                      className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 text-left transition flex items-center gap-2 cursor-pointer group"
                    >
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: `${cluster.accentColor}15`,
                          borderColor: `${cluster.accentColor}30`,
                          color: cluster.accentColor,
                        }}
                      >
                        <DynamicZenIcon name={depApp.iconName} className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-mono font-semibold text-neutral-300 group-hover:text-white truncate">
                        {depApp.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Fixed Action Footer */}
          <div className="shrink-0 p-5 sm:p-6 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-neutral-400 bg-black/40 backdrop-blur-md relative z-10">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Infrastructure Verified
            </span>
            <button
              type="button"
              onClick={() => handleCopyId(selectedService.id)}
              className="text-xs text-cyan-400 hover:text-cyan-300 transition cursor-pointer flex items-center gap-1"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied ID' : 'Copy Service ID'}</span>
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // 2. RENDER INTERNAL APPLICATION MODULE (LEVEL 2)
  if (selectedModule) {
    const parentApp = getAppForModule(selectedModule.id);
    const cluster = ECOSYSTEM_CLUSTERS[selectedModule.clusterId];

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-h-[calc(84vh-1rem)] lg:max-h-[720px] rounded-3xl bg-[#080b12]/98 border shadow-[0_20px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl flex flex-col text-left relative overflow-hidden"
          style={{ borderColor: `${cluster.accentColor}40` }}
        >
          <div
            className="absolute top-0 right-0 w-44 h-44 rounded-full blur-3xl pointer-events-none"
            style={{ backgroundColor: `${cluster.accentColor}12` }}
          />

          {/* Fixed Header */}
          <div className="shrink-0 p-5 sm:p-6 pb-3.5 border-b border-white/10 relative z-10 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border shadow-lg"
                style={{
                  backgroundColor: `${cluster.accentColor}20`,
                  borderColor: `${cluster.accentColor}50`,
                  color: cluster.accentColor,
                }}
              >
                <DynamicZenIcon name={selectedModule.iconName} className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className={`text-[8.5px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${cluster.badgeClass}`}
                  >
                    LEVEL 2 &bull; {cluster.name} MODULE
                  </span>
                  <span className="text-[8.5px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    {selectedModule.status}
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-xl text-white">
                  {selectedModule.name}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
              title="Close Panel (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4 relative z-10 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {/* Parent Application Link */}
            {parentApp && (
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-neutral-400">
                  PARENT APPLICATION:
                </span>
                <button
                  type="button"
                  onClick={() => onSelectApp(parentApp)}
                  className="text-xs font-mono font-bold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <span>{parentApp.name}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            )}

            <p className="text-xs text-neutral-300 font-sans leading-relaxed">
              {selectedModule.description}
            </p>

            {/* Capabilities */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                MODULE CAPABILITIES:
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {selectedModule.capabilities.map((cap, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] font-mono text-neutral-200 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fixed Action Footer */}
          <div className="shrink-0 p-5 sm:p-6 pt-3.5 border-t border-white/10 space-y-2.5 bg-black/40 backdrop-blur-md relative z-10">
            {selectedModule.route ? (
              <Link
                href={selectedModule.route}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400 hover:opacity-95 text-black font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition cursor-pointer"
              >
                <span>Launch {selectedModule.name}</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </Link>
            ) : (
              <div className="w-full py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-neutral-400 font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Internal Module &bull; Route Syncing</span>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 px-1">
              <button
                type="button"
                onClick={() => handleCopyId(selectedModule.id)}
                className="hover:text-white transition flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied ID' : 'Copy Module ID'}</span>
              </button>
              <span className="text-[10px] text-neutral-500">
                MODULE ORBIT &bull; LEVEL 2
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // 3. RENDER UNIVERSE GATEWAY / EXTERNAL INTEGRATION (LEVEL 4)
  if (selectedIntegration) {
    const connectedApps = ZEN_APPS_REGISTRY.filter((a) =>
      selectedIntegration.connectedAppIds.includes(a.id)
    );

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-h-[calc(84vh-1rem)] lg:max-h-[720px] rounded-3xl bg-[#090b14]/98 border border-purple-500/35 shadow-[0_20px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl flex flex-col text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-44 h-44 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Fixed Header */}
          <div className="shrink-0 p-5 sm:p-6 pb-3.5 border-b border-white/10 relative z-10 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0 shadow-lg">
                <DynamicZenIcon name={selectedIntegration.iconName} className="w-5 h-5 text-purple-300" />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-[9px] font-mono text-purple-300 font-bold uppercase tracking-wider mb-1">
                  <span>LEVEL 4 &bull; {selectedIntegration.category}</span>
                </div>
                <h3 className="font-display font-extrabold text-xl text-white">
                  {selectedIntegration.name}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
              title="Close Panel (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4 relative z-10 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <p className="text-xs text-neutral-300 font-sans leading-relaxed">
              {selectedIntegration.description}
            </p>

            {/* Capabilities */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                GATEWAY INTEGRATION PROTOCOLS:
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {selectedIntegration.capabilities.map((cap, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] font-mono text-purple-200 flex items-center gap-2"
                  >
                    <Zap className="w-3 h-3 text-purple-400 shrink-0" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Connected Apps */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                CONNECTED INTERNAL PLATFORM APPS ({connectedApps.length}):
              </span>
              <div className="grid grid-cols-2 gap-2">
                {connectedApps.map((conn) => {
                  const connCluster = ECOSYSTEM_CLUSTERS[conn.clusterId];
                  return (
                    <button
                      key={conn.id}
                      type="button"
                      onClick={() => onSelectApp(conn)}
                      className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 text-left transition flex items-center gap-2 cursor-pointer group"
                    >
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: `${connCluster.accentColor}15`,
                          borderColor: `${connCluster.accentColor}30`,
                          color: connCluster.accentColor,
                        }}
                      >
                        <DynamicZenIcon name={conn.iconName} className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-mono font-semibold text-neutral-300 group-hover:text-white truncate">
                        {conn.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Fixed Action Footer */}
          <div className="shrink-0 p-5 sm:p-6 pt-3.5 border-t border-white/10 space-y-2.5 bg-black/40 backdrop-blur-md relative z-10">
            {selectedIntegration.externalUrl ? (
              <a
                href={selectedIntegration.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-purple-500/25 hover:bg-purple-500/35 border border-purple-500/40 text-purple-200 font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.2)] transition cursor-pointer"
              >
                <span>Open {selectedIntegration.name}</span>
                <ExternalLink className="w-4 h-4 text-purple-300" />
              </a>
            ) : (
              <Link
                href="/payments"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>Inspect Verified Gateway</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 px-1">
              <button
                type="button"
                onClick={() => handleCopyId(selectedIntegration.id)}
                className="hover:text-white transition flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied ID' : 'Copy Gateway ID'}</span>
              </button>
              <span className="text-[10px] text-neutral-500">
                COSMIC UNIVERSE &bull; LEVEL 4
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // 4. RENDER PRIMARY APPLICATION (LEVEL 1)
  const cluster = ECOSYSTEM_CLUSTERS[selectedApp!.clusterId];
  const connectedApps = ZEN_APPS_REGISTRY.filter((a) =>
    selectedApp!.connections.includes(a.id)
  );
  const childModules = getModulesForApp(selectedApp!.id);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.2 }}
        className="w-full max-h-[calc(84vh-1rem)] lg:max-h-[720px] rounded-3xl bg-[#080b12]/98 border shadow-[0_20px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl flex flex-col text-left relative overflow-hidden"
        style={{ borderColor: `${cluster.accentColor}40` }}
      >
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: `${cluster.accentColor}15` }}
        />

        {/* Fixed Header */}
        <div className="shrink-0 p-5 sm:p-6 pb-3.5 border-b border-white/10 relative z-10 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border shadow-lg"
              style={{
                backgroundColor: `${cluster.accentColor}20`,
                borderColor: `${cluster.accentColor}50`,
                color: cluster.accentColor,
              }}
            >
              <DynamicZenIcon name={selectedApp!.iconName} className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className={`text-[8.5px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${cluster.badgeClass}`}
                >
                  {cluster.name}
                </span>
                <span className="text-[8.5px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  {selectedApp!.status}
                </span>
              </div>
              <h3 className="font-display font-extrabold text-xl text-white">
                {selectedApp!.name}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
            title="Close Panel (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4 relative z-10 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          <p className="text-xs text-neutral-300 font-sans leading-relaxed">
            {selectedApp!.description}
          </p>

          {/* Child Modules (Level 2 Links) */}
          {childModules.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                INTERNAL MODULES ({childModules.length}):
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {childModules.map((mod) => (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => onSelectModule && onSelectModule(mod)}
                    className="p-1.5 rounded-xl bg-white/[0.03] hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/30 text-left transition flex items-center gap-1.5 cursor-pointer group"
                    title={`Inspect ${mod.name}`}
                  >
                    <DynamicZenIcon name={mod.iconName} className="w-3 h-3 text-cyan-300 shrink-0" />
                    <span className="text-[11px] font-mono text-neutral-300 group-hover:text-white truncate">
                      {mod.shortName}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Core Capabilities */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
              CAPABILITIES:
            </span>
            <div className="grid grid-cols-1 gap-1">
              {selectedApp!.capabilities.map((cap, i) => (
                <div
                  key={i}
                  className="p-1.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] font-mono text-neutral-200 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>{cap}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Applications */}
          {connectedApps.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                  CONNECTED APPS ({connectedApps.length}):
                </span>
                {onHighlightConnections && (
                  <button
                    type="button"
                    onClick={() => onHighlightConnections(selectedApp!.id)}
                    className="text-[9.5px] font-mono text-cyan-400 hover:underline cursor-pointer"
                  >
                    Highlight Paths
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {connectedApps.map((conn) => {
                  const connCluster = ECOSYSTEM_CLUSTERS[conn.clusterId];
                  return (
                    <button
                      key={conn.id}
                      type="button"
                      onClick={() => onSelectApp(conn)}
                      className="p-1.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 text-left transition flex items-center gap-2 cursor-pointer group"
                    >
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: `${connCluster.accentColor}15`,
                          borderColor: `${connCluster.accentColor}30`,
                          color: connCluster.accentColor,
                        }}
                      >
                        <DynamicZenIcon name={conn.iconName} className="w-2.5 h-2.5" />
                      </div>
                      <span className="text-[11px] font-mono font-semibold text-neutral-300 group-hover:text-white truncate">
                        {conn.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Fixed Action Footer */}
        <div className="shrink-0 p-5 sm:p-6 pt-3.5 border-t border-white/10 space-y-2.5 bg-black/40 backdrop-blur-md relative z-10">
          {selectedApp!.route ? (
            <Link
              href={selectedApp!.route}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400 hover:opacity-95 text-black font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition cursor-pointer active:scale-95"
            >
              <span>{selectedApp!.primaryActionLabel || `Launch ${selectedApp!.name}`}</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </Link>
          ) : (
            <div className="w-full py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-neutral-400 font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>In Active Development &bull; Route Coming Soon</span>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 px-1">
            <button
              type="button"
              onClick={() => handleCopyId(selectedApp!.id)}
              className="hover:text-white transition flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied ID' : 'Copy App ID'}</span>
            </button>

            <span className="text-[10px] text-neutral-500">
              ZENVITRA PROTOCOL &bull; V1
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
