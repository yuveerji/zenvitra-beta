'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Filter, Hash } from 'lucide-react';

interface TopicNode {
  id: string;
  name: string;
  count: number;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface PulseMapProps {
  onSelectTopic?: (topic: string) => void;
}

export function PulseMap({ onSelectTopic }: PulseMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const initialTopics: TopicNode[] = [
    { id: '1', name: 'Education Reform', count: 482, color: '#00f2fe', x: 0.25, y: 0.35, vx: 0.0003, vy: -0.0002 },
    { id: '2', name: 'Climate & Water', count: 329, color: '#10b981', x: 0.72, y: 0.28, vx: -0.0002, vy: 0.0003 },
    { id: '3', name: 'Youth Elections', count: 614, color: '#f43f5e', x: 0.48, y: 0.62, vx: 0.0002, vy: 0.0002 },
    { id: '4', name: 'Digital Sovereignty', count: 215, color: '#a78bfa', x: 0.30, y: 0.75, vx: -0.0003, vy: -0.0001 },
    { id: '5', name: 'Mental Health Rights', count: 390, color: '#f59e0b', x: 0.80, y: 0.70, vx: 0.0001, vy: -0.0003 },
  ];

  const topicsRef = useRef<TopicNode[]>(initialTopics);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);
    let animId: number;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 600;
      height = canvas.height = canvas.parentElement?.clientHeight || 400;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const nodes = topicsRef.current;

      // Update positions with subtle floating motion
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0.15 || node.x > 0.85) node.vx *= -1;
        if (node.y < 0.20 || node.y > 0.80) node.vy *= -1;
      });

      // Draw interconnecting constellation filaments
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          ctx.beginPath();
          ctx.moveTo(n1.x * width, n1.y * height);
          ctx.lineTo(n2.x * width, n2.y * height);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Draw topic clusters
      nodes.forEach((node) => {
        const px = node.x * width;
        const py = node.y * height;
        const isSelected = selectedTopic === node.name;

        // Glow ring
        ctx.beginPath();
        ctx.arc(px, py, isSelected ? 24 : 14, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? `${node.color}33` : `${node.color}15`;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(px, py, isSelected ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Topic text
        ctx.font = '11px var(--font-outfit), sans-serif';
        ctx.fillStyle = isSelected ? '#ffffff' : '#d4d4d8';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, px, py - (isSelected ? 28 : 18));

        // Activity tag
        ctx.font = '9px var(--font-mono), monospace';
        ctx.fillStyle = '#71717a';
        ctx.fillText(`${node.count} signals`, px, py + (isSelected ? 36 : 26));
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

    // Find closest node within click threshold
    for (const node of topicsRef.current) {
      const dist = Math.hypot(node.x - clickX, node.y - clickY);
      if (dist < 0.08) {
        const next = selectedTopic === node.name ? null : node.name;
        setSelectedTopic(next);
        if (onSelectTopic && next) onSelectTopic(next);
        return;
      }
    }
  };

  return (
    <div className="relative rounded-3xl bg-[#07090e]/90 border border-white/[0.08] p-6 space-y-4 overflow-hidden backdrop-blur-xl shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-white">
            THE PULSE MAP // LIVING SIGNAL NETWORK
          </span>
        </div>
        {selectedTopic && (
          <button
            onClick={() => {
              setSelectedTopic(null);
              if (onSelectTopic) onSelectTopic('');
            }}
            className="text-[10px] font-mono text-rose-400 hover:text-rose-300 underline cursor-pointer"
          >
            Clear Filter [{selectedTopic}]
          </button>
        )}
      </div>

      {/* Interactive Constellation Plane */}
      <div className="relative h-64 sm:h-72 w-full cursor-pointer">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-full block"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.06] text-[10px] font-mono text-neutral-500">
        <span>CLICK ANY TOPIC CLUSTER TO FILTER LIVING STREAM</span>
        <span>5 ACTIVE DIALOGUE HUBS</span>
      </div>
    </div>
  );
}
