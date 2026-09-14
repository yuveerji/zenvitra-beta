'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Radio, Activity, Compass } from 'lucide-react';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';

interface TopicNode {
  id: string;
  name: string;
  count: number;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  pulsePhase: number;
}

interface PulseMapProps {
  onSelectTopic?: (topic: string) => void;
}

const PALETTE = [
  '#00f2fe', // Cyan
  '#10b981', // Emerald
  '#f43f5e', // Rose
  '#a855f7', // Purple
  '#f59e0b', // Amber
  '#38bdf8', // Sky
  '#ec4899', // Pink
  '#8b5cf6', // Violet
];

export function PulseMap({ onSelectTopic }: PulseMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const { feedPosts } = useZenPulse();

  // Persistent map of nodes to maintain coordinates across renders and avoid flashing/jumping
  const nodesMapRef = useRef<Map<string, TopicNode>>(new Map());

  // Dynamically derive topics from feedPosts + fallback baseline topics
  useEffect(() => {
    const topicCounts = new Map<string, number>();

    // 1. Ingest categories and tags from all active feed dispatches
    if (feedPosts && feedPosts.length > 0) {
      feedPosts.forEach((post) => {
        if (post.location && post.location.trim() && post.location !== 'Universal Mesh') {
          const loc = post.location.trim();
          topicCounts.set(loc, (topicCounts.get(loc) || 0) + 1);
        }
        if (post.tags && post.tags.length > 0) {
          post.tags.forEach((rawTag) => {
            const tag = rawTag.replace(/^#/, '').trim();
            if (tag.length > 1) {
              const formatted = tag.charAt(0).toUpperCase() + tag.slice(1);
              topicCounts.set(formatted, (topicCounts.get(formatted) || 0) + 1);
            }
          });
        }
      });
    }

    // 2. Foundation civic channels if feed has not received dispatches yet (strictly 0 signals / standby)
    const foundationChannels = [
      'Diplomacy',
      'Governance',
      'Digital Sovereignty',
      'Civil Rights',
      'Education',
      'Environment',
    ];

    foundationChannels.forEach((name) => {
      if (!topicCounts.has(name)) {
        topicCounts.set(name, 0);
      }
    });

    // Top dynamic topics sorted by signal frequency (capped to 8 for crystal clarity)
    const sortedTopics = Array.from(topicCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    const currentMap = nodesMapRef.current;
    const nextMap = new Map<string, TopicNode>();

    sortedTopics.forEach(([name, count], index) => {
      if (currentMap.has(name)) {
        // Retain existing coordinates and velocity so nodes smoothly stay in place without flashing!
        const existing = currentMap.get(name)!;
        existing.count = count;
        nextMap.set(name, existing);
      } else {
        // Spawn smoothly at balanced circular anchor offset + tiny velocity
        const angle = (index / sortedTopics.length) * Math.PI * 2;
        const radius = 0.28 + (index % 2) * 0.08;
        const initialX = Math.max(0.18, Math.min(0.82, 0.5 + Math.cos(angle) * radius));
        const initialY = Math.max(0.22, Math.min(0.78, 0.5 + Math.sin(angle) * (radius * 0.75)));
        const color = PALETTE[index % PALETTE.length];

        nextMap.set(name, {
          id: `topic-${name}-${index}`,
          name,
          count,
          color,
          x: initialX,
          y: initialY,
          vx: (Math.random() - 0.5) * 0.0003,
          vy: (Math.random() - 0.5) * 0.0003,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    });

    nodesMapRef.current = nextMap;
  }, [feedPosts]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 360);
    let animId: number;
    let sweepAngle = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 600;
      height = canvas.height = canvas.parentElement?.clientHeight || 360;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const nodes = Array.from(nodesMapRef.current.values());

      // 1. Radar Circular Grid Background
      const cx = width / 2;
      const cy = height / 2;
      const maxRadius = Math.min(width, height) * 0.44;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;

      // Concentric radar rings
      [0.25, 0.5, 0.75, 1].forEach((fraction) => {
        ctx.beginPath();
        ctx.arc(cx, cy, maxRadius * fraction, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - maxRadius, cy);
      ctx.lineTo(cx + maxRadius, cy);
      ctx.moveTo(cx, cy - maxRadius);
      ctx.lineTo(cx, cy + maxRadius);
      ctx.stroke();

      // Sweeping radar scan line
      sweepAngle += 0.015;
      const sweepX = cx + Math.cos(sweepAngle) * maxRadius;
      const sweepY = cy + Math.sin(sweepAngle) * maxRadius;
      const sweepGrad = ctx.createLinearGradient(cx, cy, sweepX, sweepY);
      sweepGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
      sweepGrad.addColorStop(1, 'rgba(6, 182, 212, 0.15)');
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxRadius, sweepAngle - 0.25, sweepAngle);
      ctx.fillStyle = sweepGrad;
      ctx.fill();

      // 2. Physics-safe gentle drift (without jumping or leaving safe zone)
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        node.pulsePhase += 0.04;

        if (node.x < 0.14) {
          node.x = 0.14;
          node.vx = Math.abs(node.vx);
        } else if (node.x > 0.86) {
          node.x = 0.86;
          node.vx = -Math.abs(node.vx);
        }

        if (node.y < 0.18) {
          node.y = 0.18;
          node.vy = Math.abs(node.vy);
        } else if (node.y > 0.82) {
          node.y = 0.82;
          node.vy = -Math.abs(node.vy);
        }
      });

      // 3. Interconnecting constellation filaments
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dist = Math.hypot((n1.x - n2.x) * width, (n1.y - n2.y) * height);

          // Connect nodes within proximity
          if (dist < 260) {
            const alpha = Math.max(0.01, (1 - dist / 260) * 0.12);
            ctx.beginPath();
            ctx.moveTo(n1.x * width, n1.y * height);
            ctx.lineTo(n2.x * width, n2.y * height);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // 4. Topic nodes / beacons
      nodes.forEach((node) => {
        const px = node.x * width;
        const py = node.y * height;
        const isSelected = selectedTopic === node.name;
        const pulse = Math.sin(node.pulsePhase) * 3;

        // Outer glow halo
        ctx.beginPath();
        ctx.arc(px, py, (isSelected ? 26 : 15) + pulse, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? `${node.color}35` : `${node.color}14`;
        ctx.fill();

        // Inner glowing border ring
        ctx.beginPath();
        ctx.arc(px, py, isSelected ? 12 : 7, 0, Math.PI * 2);
        ctx.strokeStyle = node.color;
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.stroke();

        // Core bright beacon
        ctx.beginPath();
        ctx.arc(px, py, isSelected ? 5 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? '#ffffff' : node.color;
        ctx.fill();

        // Topic Title Badge
        ctx.font = isSelected ? 'bold 11px system-ui, sans-serif' : '500 11px system-ui, sans-serif';
        ctx.fillStyle = isSelected ? '#ffffff' : '#e4e4e7';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        ctx.fillText(node.name, px, py - (isSelected ? 24 : 16));

        // Signal count pill
        ctx.font = 'bold 9px ui-monospace, monospace';
        ctx.fillStyle = isSelected ? node.color : '#a1a1aa';
        const countText = node.count > 0 ? `${node.count} ${node.count === 1 ? 'signal' : 'signals'}` : 'Standby';
        ctx.fillText(countText, px, py + (isSelected ? 30 : 22));
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [selectedTopic]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / rect.width;
    const clickY = (e.clientY - rect.top) / rect.height;

    // Find closest node within generous click radius
    for (const node of nodesMapRef.current.values()) {
      const dist = Math.hypot(node.x - clickX, node.y - clickY);
      if (dist < 0.10) {
        const next = selectedTopic === node.name ? null : node.name;
        setSelectedTopic(next);
        if (onSelectTopic) onSelectTopic(next || '');
        return;
      }
    }
  };

  const activeCount = nodesMapRef.current.size;
  const totalSignals = Array.from(nodesMapRef.current.values()).reduce((sum, n) => sum + n.count, 0);

  return (
    <div className="relative rounded-3xl bg-[#07090e]/95 border border-white/[0.08] p-5 sm:p-6 space-y-4 overflow-hidden backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
      {/* Dynamic Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping absolute opacity-75" />
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
          </div>
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-white flex items-center gap-1.5">
              THE PULSE MAP <span className="text-neutral-500">//</span> LIVING SIGNAL NETWORK
            </span>
          </div>
        </div>

        {selectedTopic ? (
          <button
            onClick={() => {
              setSelectedTopic(null);
              if (onSelectTopic) onSelectTopic('');
            }}
            className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 transition cursor-pointer flex items-center gap-1"
          >
            <span>Clear Filter [{selectedTopic}]</span>
            <span>✕</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-neutral-400">
            <Compass className="w-3 h-3 text-cyan-400 animate-spin-slow" />
            <span>RADAR ACTIVE</span>
          </div>
        )}
      </div>

      {/* Interactive Constellation Plane */}
      <div className="relative h-60 sm:h-72 w-full cursor-pointer rounded-2xl overflow-hidden bg-gradient-to-b from-[#05070a] to-[#0a0d14] border border-white/[0.04]">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-full block"
        />
      </div>

      {/* Footer Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/[0.06] text-[10px] font-mono text-neutral-400">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-cyan-400" />
          <span>CLICK ANY TOPIC BEACON TO FILTER DISPATCH WIRE</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${totalSignals > 0 ? 'bg-emerald-400' : 'bg-cyan-400 animate-pulse'}`} />
          <span className="text-neutral-300 font-semibold">
            {totalSignals > 0 ? `${totalSignals} SIGNALS ACTIVE` : `${activeCount} CHANNELS ONLINE // STANDBY`}
          </span>
        </div>
      </div>
    </div>
  );
}

