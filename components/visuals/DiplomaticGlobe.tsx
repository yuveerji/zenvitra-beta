'use client';

import React, { useState } from 'react';
import { Globe, Radio } from 'lucide-react';
import { WorldMapPaths } from '@/components/visuals/WorldMapPaths';

export interface DiplomaticNode {
  name: string;
  code: string;
  lat: number;
  lng: number;
  mapX: number;
  mapY: number;
  status: 'PRIMARY' | 'ACTIVE' | 'SYNCHRONIZED' | 'COLD STANDBY';
  ping: string;
  region: string;
  role: string;
}

const NODES: DiplomaticNode[] = [
  {
    name: 'UDAIPUR [HQ]',
    code: 'IN-UDR',
    lat: 24.5854,
    lng: 73.7125,
    mapX: 582,
    mapY: 458,
    status: 'PRIMARY',
    ping: '4ms',
    region: 'Rajasthan, India',
    role: 'Root Sovereign Anchor & Genesis Core'
  },
  {
    name: 'GENEVA',
    code: 'CH-GVA',
    lat: 46.2044,
    lng: 6.1432,
    mapX: 423,
    mapY: 405,
    status: 'SYNCHRONIZED',
    ping: '28ms',
    region: 'Switzerland, Europe',
    role: 'UN Diplomatic Consensus Dais'
  },
  {
    name: 'LONDON',
    code: 'GB-LON',
    lat: 51.5074,
    lng: -0.1278,
    mapX: 405,
    mapY: 388,
    status: 'ACTIVE',
    ping: '34ms',
    region: 'United Kingdom, Europe',
    role: 'Westminster Procedure Invariant'
  },
  {
    name: 'SINGAPORE',
    code: 'SG-SIN',
    lat: 1.3521,
    lng: 103.8198,
    mapX: 659,
    mapY: 527,
    status: 'ACTIVE',
    ping: '18ms',
    region: 'Southeast Asia Hub',
    role: 'Pan-Pacific High-Speed Gateway'
  },
  {
    name: 'NEW YORK',
    code: 'US-NYC',
    lat: 40.7128,
    lng: -74.0060,
    mapX: 248,
    mapY: 398,
    status: 'COLD STANDBY',
    ping: '45ms',
    region: 'North America Wire',
    role: 'Assembly Redundancy Mirror'
  },
  {
    name: 'TOKYO',
    code: 'JP-TYO',
    lat: 35.6762,
    lng: 139.6503,
    mapX: 722,
    mapY: 416,
    status: 'ACTIVE',
    ping: '32ms',
    region: 'East Asia Nexus',
    role: 'Cryptographic Ledger Quorum'
  }
];

export function DiplomaticGlobe() {
  const [selectedNode, setSelectedNode] = useState<DiplomaticNode>(NODES[0]);
  const hq = NODES[0];

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl bg-gradient-to-b from-[#080b13] via-[#04060a] to-[#020306] border border-amber-500/25 p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Globe className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-lg font-bold text-white tracking-wide font-display">
              Global Sovereign Relay Network
            </h3>
            <p className="text-xs text-neutral-400 font-mono tracking-wider">
              REAL-TIME CRYPTOGRAPHIC NODE TELEMETRY &bull; EXACT GEOGRAPHIC LOCATIONS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>6 / 6 NODES ONLINE</span>
          </span>
        </div>
      </div>

      {/* Main Interactive Stage: Real World Map + Node Selector Cards */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-6">
        
        {/* Left: Genuine Real World Map Vector */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="relative rounded-2xl bg-[#05070d]/90 border border-white/[0.08] p-3 sm:p-4 shadow-inner overflow-hidden">
            {/* Coordinate Grid / Graticule Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="world-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#world-grid)" />
              </svg>
            </div>

            {/* The SVG Real World Map */}
            <svg
              viewBox="30.767 241.591 784.077 458.627"
              className="w-full h-auto select-none relative z-10"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Actual Continents & Country Outlines */}
              <WorldMapPaths selectedId={selectedNode.name} />

              {/* Equator & Meridians */}
              <line x1="30" y1="470" x2="814" y2="470" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3 4" strokeWidth="0.75" />
              <line x1="422" y1="241" x2="422" y2="700" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3 4" strokeWidth="0.75" />

              {/* Cryptographic Bezier Transmission Arcs from UDAIPUR [HQ] */}
              <g className="transmission-arcs">
                {NODES.filter((n) => n.name !== hq.name).map((node) => {
                  const isSelected = selectedNode.name === node.name;
                  const dx = node.mapX - hq.mapX;
                  const midX = (hq.mapX + node.mapX) / 2;
                  // Dynamic arc curvature based on distance
                  const lift = Math.min(60, Math.max(25, Math.abs(dx) * 0.15));
                  const midY = (hq.mapY + node.mapY) / 2 - lift;
                  const pathD = `M ${hq.mapX} ${hq.mapY} Q ${midX} ${midY} ${node.mapX} ${node.mapY}`;

                  return (
                    <g key={node.name}>
                      {/* Outer Glow Arc */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke={isSelected ? 'rgba(245, 158, 11, 0.4)' : 'rgba(251, 191, 36, 0.15)'}
                        strokeWidth={isSelected ? 2.5 : 1.2}
                      />
                      {/* Animated Dashed Fiber Line */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke={isSelected ? '#fbbf24' : 'rgba(52, 211, 153, 0.35)'}
                        strokeWidth={isSelected ? 1.2 : 0.8}
                        strokeDasharray="4 6"
                        className="animate-pulse"
                      />
                      {/* Traveling Data Packet Photon */}
                      <circle r={isSelected ? 2.5 : 1.8} fill={isSelected ? '#fbbf24' : '#34d399'}>
                        <animateMotion
                          dur={node.name === 'NEW YORK' ? '3s' : '2s'}
                          repeatCount="indefinite"
                          path={pathD}
                        />
                      </circle>
                    </g>
                  );
                })}
              </g>

              {/* Geographic Nodes */}
              {NODES.map((node) => {
                const isHQ = node.status === 'PRIMARY';
                const isSelected = selectedNode.name === node.name;

                return (
                  <g
                    key={node.name}
                    className="cursor-pointer group"
                    onClick={() => setSelectedNode(node)}
                  >
                    {/* Expanding Radar Ripple for HQ or Selected */}
                    {(isHQ || isSelected) && (
                      <>
                        <circle
                          cx={node.mapX}
                          cy={node.mapY}
                          r="14"
                          fill="none"
                          stroke={isHQ ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}
                          strokeWidth="1"
                          className="animate-ping"
                          style={{ transformOrigin: `${node.mapX}px ${node.mapY}px` }}
                        />
                        <circle
                          cx={node.mapX}
                          cy={node.mapY}
                          r="22"
                          fill="none"
                          stroke={isHQ ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)'}
                          strokeWidth="0.75"
                        />
                      </>
                    )}

                    {/* Outer Node Halo */}
                    <circle
                      cx={node.mapX}
                      cy={node.mapY}
                      r={isHQ ? 6.5 : isSelected ? 5.5 : 4}
                      fill={isHQ ? 'rgba(245, 158, 11, 0.4)' : isSelected ? 'rgba(16, 185, 129, 0.4)' : 'rgba(16, 185, 129, 0.2)'}
                    />

                    {/* Center Core Dot */}
                    <circle
                      cx={node.mapX}
                      cy={node.mapY}
                      r={isHQ ? 3.5 : isSelected ? 3 : 2}
                      fill={isHQ ? '#fbbf24' : node.status === 'COLD STANDBY' ? '#38bdf8' : '#10b981'}
                      stroke="#06080e"
                      strokeWidth="0.75"
                    />

                    {/* On-Map City Label */}
                    <g transform={`translate(${node.mapX + (node.name === 'TOKYO' ? -42 : node.name === 'SINGAPORE' ? 8 : 8)}, ${node.mapY + (node.name === 'SINGAPORE' ? 12 : node.name === 'LONDON' ? -8 : -5)})`}>
                      <rect
                        x="-3"
                        y="-8"
                        width={node.name.length * 5.6 + 6}
                        height="12"
                        rx="3"
                        fill="rgba(5, 8, 15, 0.85)"
                        stroke={isSelected ? (isHQ ? 'rgba(245, 158, 11, 0.5)' : 'rgba(16, 185, 129, 0.5)') : 'rgba(255, 255, 255, 0.1)'}
                        strokeWidth="0.5"
                      />
                      <text
                        x="0"
                        y="1"
                        fontSize="7.5"
                        fontFamily="var(--font-mono), monospace"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        fill={isHQ ? '#fef3c7' : isSelected ? '#ffffff' : '#cbd5e1'}
                        letterSpacing="0.05em"
                      >
                        {node.name.split(' ')[0]}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* Bottom Map Status Bar */}
            <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">&bull; FOCUSED:</span>
                <span className="text-white font-semibold">{selectedNode.name}</span>
                <span className="text-neutral-500">[{selectedNode.region}]</span>
              </div>
              <div className="text-neutral-400">
                <span>COORD: {selectedNode.lat.toFixed(2)}°N, {selectedNode.lng.toFixed(2)}°E</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-2 text-[10px] font-mono text-neutral-500">
            <span>&bull; PROJECTION: EQUIRECTANGULAR VERIFIED</span>
            <span>DATA CHANNELS: 100% HARDWARE ENCRYPTED</span>
          </div>
        </div>

        {/* Right: Node Telemetry Grid */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400/90 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Radio className="h-3.5 w-3.5" />
              <span>ACTIVE SOVEREIGN RELAYS</span>
            </span>
            <span className="text-[10px] text-neutral-500">CLICK TO LOCATE</span>
          </div>

          {NODES.map((n) => {
            const isSelected = selectedNode.name === n.name;
            const isHQ = n.status === 'PRIMARY';

            return (
              <button
                key={n.name}
                type="button"
                onClick={() => setSelectedNode(n)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? isHQ
                      ? 'bg-amber-500/10 border-amber-500/60 shadow-[0_0_25px_rgba(217,119,6,0.18)] scale-[1.01]'
                      : 'bg-emerald-500/10 border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.18)] scale-[1.01]'
                    : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isHQ
                          ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'
                          : n.status === 'COLD STANDBY'
                          ? 'bg-sky-400'
                          : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                      }`}
                    />
                    <span
                      className={`font-mono text-xs font-bold tracking-wide ${
                        isSelected ? (isHQ ? 'text-amber-300' : 'text-emerald-300') : 'text-neutral-200'
                      }`}
                    >
                      {n.name}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                      isHQ
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : n.status === 'COLD STANDBY'
                        ? 'bg-sky-500/10 text-sky-300 border border-sky-500/30'
                        : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {n.status}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-neutral-400">
                  <span className="text-neutral-500">{n.region}</span>
                  <span className={isHQ ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                    {n.ping}
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-between text-[9px] font-mono text-neutral-500 border-t border-white/[0.04] pt-1.5">
                  <span>LAT: {n.lat}° | LNG: {n.lng}°</span>
                  <span className="text-neutral-400 italic truncate max-w-[170px]">{n.role}</span>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
