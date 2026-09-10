'use client';

import React, { useRef, useEffect } from 'react';
import { ParticleMorphState } from './ExperienceContext';

interface ZenParticle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
  clusterIndex: number;
}

interface ZenParticleFieldProps {
  state?: ParticleMorphState;
  className?: string;
  interactive?: boolean;
}

export function ZenParticleField({
  state = 'VOID',
  className = '',
  interactive = true,
}: ZenParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -2000,
    y: -2000,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationFrameId: number;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      recalculateTargets();
    };

    window.addEventListener('resize', handleResize);

    const count = Math.min(120, Math.floor((width * height) / 12000));
    const particles: ZenParticle[] = [];

    // Initialize particles
    for (let i = 0; i < count; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x,
        y,
        originX: x,
        originY: y,
        targetX: x,
        targetY: y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.5 + 0.2,
        color: 'rgba(255, 255, 255,',
        clusterIndex: i % 4,
      });
    }

    const recalculateTargets = () => {
      const cx = width / 2;
      const cy = height / 2;

      particles.forEach((p, i) => {
        if (state === 'VOID') {
          p.targetX = p.originX;
          p.targetY = p.originY;
          p.radius = 1.0;
        } else if (state === 'NOISE') {
          // Turbulent agitation
          p.targetX = p.originX + (Math.random() - 0.5) * 120;
          p.targetY = p.originY + (Math.random() - 0.5) * 120;
          p.radius = Math.random() * 2 + 1;
        } else if (state === 'NETWORK') {
          // Grid constellation
          const cols = Math.ceil(Math.sqrt(count));
          const col = i % cols;
          const row = Math.floor(i / cols);
          const cellW = width / cols;
          const cellH = height / cols;
          p.targetX = col * cellW + cellW / 2 + (Math.random() - 0.5) * 30;
          p.targetY = row * cellH + cellH / 2 + (Math.random() - 0.5) * 30;
        } else if (state === 'LOGO') {
          // Converge towards central sovereign ring
          const angle = (i / count) * Math.PI * 2;
          const r = Math.min(width, height) * 0.22;
          p.targetX = cx + Math.cos(angle) * r;
          p.targetY = cy + Math.sin(angle) * r;
        } else if (state === 'CONSTELLATION') {
          // Group into 4 thematic topic hubs
          const clusters = [
            { x: cx - width * 0.2, y: cy - height * 0.15, col: 'rgba(0, 242, 254,' },
            { x: cx + width * 0.22, y: cy - height * 0.12, col: 'rgba(244, 63, 94,' },
            { x: cx - width * 0.12, y: cy + height * 0.2, col: 'rgba(16, 185, 129,' },
            { x: cx + width * 0.15, y: cy + height * 0.18, col: 'rgba(245, 158, 11,' },
          ];
          const cluster = clusters[p.clusterIndex];
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * 110;
          p.targetX = cluster.x + Math.cos(angle) * dist;
          p.targetY = cluster.y + Math.sin(angle) * dist;
          p.color = cluster.col;
        } else if (state === 'CHAMBER_NODES') {
          // Circular chamber concentric layout
          const ring = i % 2 === 0 ? 0.15 : 0.32;
          const angle = (i / count) * Math.PI * 4;
          p.targetX = cx + Math.cos(angle) * (Math.min(width, height) * ring);
          p.targetY = cy + Math.sin(angle) * (Math.min(width, height) * ring);
          p.color = 'rgba(167, 139, 250,';
        }
      });
    };

    recalculateTargets();

    const handlePointerMove = (e: PointerEvent) => {
      if (!interactive) return;
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handlePointerLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const speed = state === 'NOISE' ? 0.08 : 0.04;

      // Update positions
      particles.forEach((p) => {
        // Move towards target
        p.x += (p.targetX - p.x) * speed;
        p.y += (p.targetY - p.y) * speed;

        // Subtle ambient drift
        p.x += p.vx;
        p.y += p.vy;

        // Mouse gravity / repulsion
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 140 && dist > 0) {
            const force = (140 - dist) / 140;
            p.x -= (dx / dist) * force * 3;
            p.y -= (dy / dist) * force * 3;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${p.alpha})`;
        ctx.fill();
      });

      // Draw connection vectors
      const maxDistance = state === 'NETWORK' ? 120 : state === 'CONSTELLATION' ? 85 : 70;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [state, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ opacity: 0.85 }}
    />
  );
}
