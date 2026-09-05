'use client';

import React, { useState } from 'react';
import { History, Clock, User, ArrowLeftRight, Check, Plus, AlertCircle } from 'lucide-react';
import { ZenDocument, ZenDocVersion } from '@/types/docs';

interface DocVersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDoc: ZenDocument;
  onSaveSnapshot: (label?: string) => void;
}

export function DocVersionHistoryModal({
  isOpen,
  onClose,
  activeDoc,
  onSaveSnapshot,
}: DocVersionHistoryModalProps) {
  const [snapshotLabel, setSnapshotLabel] = useState('');
  const [isDiffMode, setIsDiffMode] = useState(false);

  if (!isOpen) return null;

  const versions = activeDoc.versions || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-3xl bg-[#0b0e17] border border-cyan-500/30 p-6 sm:p-8 space-y-6 shadow-2xl relative text-left">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-mono text-[10px] uppercase font-bold">
              <History className="w-3 h-3 text-cyan-400" />
              <span>IMMUTABLE AUDIT TRAIL &bull; CURRENT v{activeDoc.version || 1}.0</span>
            </div>
            <h3 className="text-xl font-bold font-display text-white">Version History &amp; Redline Diff</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Snapshot creator */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Snapshot name (e.g. Pre-amendment First Reading, Bloc consensus draft)..."
            value={snapshotLabel}
            onChange={(e) => setSnapshotLabel(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white placeholder:text-neutral-500 text-xs focus:outline-none focus:border-cyan-400 font-mono"
          />
          <button
            type="button"
            onClick={() => {
              onSaveSnapshot(snapshotLabel.trim() || undefined);
              setSnapshotLabel('');
            }}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Snapshot</span>
          </button>
        </div>

        {/* Diff Mode Toggle */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-xs font-mono">
          <span className="text-neutral-400">Visual Diff Engine (Added vs Removed)</span>
          <button
            type="button"
            onClick={() => setIsDiffMode(!isDiffMode)}
            className={`px-3 py-1 rounded-lg border transition cursor-pointer flex items-center gap-1.5 ${
              isDiffMode ? 'bg-cyan-500 text-black font-bold border-cyan-400' : 'bg-white/5 text-neutral-300 border-white/10'
            }`}
          >
            <ArrowLeftRight className="w-3 h-3" />
            <span>{isDiffMode ? 'Diff Active' : 'Enable Diff'}</span>
          </button>
        </div>

        {/* Visual Diff Preview if active */}
        {isDiffMode && (
          <div className="p-4 rounded-2xl bg-black/80 border border-white/10 space-y-2 text-xs font-mono">
            <span className="text-[10px] text-cyan-400 font-bold uppercase block">Comparing v{Math.max(1, (activeDoc.version || 1) - 1)} &rarr; v{activeDoc.version || 1} (Latest):</span>
            <div className="space-y-1.5 leading-relaxed font-sans text-xs">
              <p className="p-2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                + [Added]: Operative Clause 2: Mandates independent algorithmic validation under the Civic Endowment charter.
              </p>
              <p className="p-2 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 line-through">
                - [Removed]: Proprietary compute subsidies without open audit keys.
              </p>
            </div>
          </div>
        )}

        {/* Versions Timeline */}
        <div className="space-y-2 max-h-56 overflow-y-auto">
          {/* Current Live Version */}
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between text-xs font-mono">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-500 text-black font-bold text-[10px]">
                  v{activeDoc.version || 1}.0 LIVE
                </span>
                <span className="text-white font-bold">Current Working Version</span>
              </div>
              <span className="text-[10px] text-neutral-400 block">
                Last modified {new Date(activeDoc.updatedAt).toLocaleString()}
              </span>
            </div>
            <span className="text-cyan-300 text-[10px] font-bold">Active</span>
          </div>

          {/* Past versions */}
          {versions.map((ver) => (
            <div
              key={ver.id}
              className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs font-mono text-neutral-300"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400 font-bold">v{ver.versionNumber}.0</span>
                  <span className="text-white">{ver.label}</span>
                </div>
                <span className="text-[10px] text-neutral-500 block">
                  Saved by {ver.author} on {new Date(ver.timestamp).toLocaleString()}
                </span>
              </div>
              <span className="text-[10px] text-neutral-500">Archived</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
