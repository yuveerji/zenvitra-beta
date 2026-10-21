'use client';

import React from 'react';
import { Users, Wifi, WifiOff, Globe2, ShieldCheck } from 'lucide-react';
import { CollaboratorPresence } from '@/lib/collab/ZenCollabSession';

export interface CollaborativePresenceBarProps {
  collaborators: CollaboratorPresence[];
  connectionStatus: 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'OFFLINE_BUFFERING';
  currentUserRole?: string;
  currentUsername?: string;
}

export function CollaborativePresenceBar({
  collaborators,
  connectionStatus,
  currentUserRole = 'Delegate',
  currentUsername = 'you',
}: CollaborativePresenceBarProps) {
  const isLive = connectionStatus === 'CONNECTED';
  const totalEditors = collaborators.length + 1; // Peers + Self

  return (
    <div className="flex items-center gap-2 sm:gap-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono">
      {/* Live Sync Status Indicator */}
      <div className="flex items-center gap-1.5 pr-2 border-r border-white/10">
        <span
          className={`w-2 h-2 rounded-full ${
            isLive
              ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]'
              : connectionStatus === 'CONNECTING'
              ? 'bg-amber-400 animate-ping'
              : 'bg-rose-400'
          }`}
        />
        <span className="text-[10px] text-neutral-300 font-bold uppercase tracking-wider hidden sm:inline">
          {isLive ? 'Yjs CRDT Active' : connectionStatus}
        </span>
      </div>

      {/* Connected Peers Avatars */}
      <div className="flex items-center -space-x-1.5 overflow-hidden">
        {/* Current User Pill */}
        <div
          className="w-5 h-5 rounded-full border border-white/30 bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[9px] font-bold ring-2 ring-black"
          title={`You (@${currentUsername}) • ${currentUserRole}`}
        >
          {currentUsername.charAt(0).toUpperCase()}
        </div>

        {/* Remote Collaborators */}
        {collaborators.map((peer) => (
          <div
            key={peer.userId}
            className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-[9px] font-bold ring-2 ring-black transition-transform hover:scale-125 hover:z-20 cursor-pointer"
            style={{
              backgroundColor: `${peer.color}25`,
              color: peer.color,
              borderColor: peer.color,
            }}
            title={`@${peer.username} (${peer.role}) • ${peer.committee}`}
          >
            {peer.username.charAt(0).toUpperCase()}
          </div>
        ))}
      </div>

      {/* Editor Count Badge */}
      <div className="text-[10px] text-neutral-400 flex items-center gap-1">
        <Users className="w-3 h-3 text-cyan-400" />
        <span className="text-white font-bold">{totalEditors}</span>
        <span className="hidden md:inline text-neutral-500">editing live</span>
      </div>
    </div>
  );
}
