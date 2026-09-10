'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  alpha: number;
  cluster: number;
}

interface ConstellationCanvasProps {
  className?: string;
  enableMouseInteraction?: boolean;
}

export function ConstellationCanvas({
  className = '',
  enableMouseInteraction = true,
}: ConstellationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // Particle pool
    const count = Math.min(80, Math.floor((width * height) / 14000));
    let particles: Particle[] = [];

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < count; i++) {
        const radius = Math.random() * 1.5 + 0.8;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius,
          baseRadius: radius,
          alpha: Math.random() * 0.5 + 0.25,
          cluster: Math.floor(Math.random() * 3),
        });
      }
    };

    initParticles();

    // Mouse events
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    if (enableMouseInteraction) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
    }

    let clockPulse = 0;

    const render = () => {
      clockPulse += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Subtle background grid glow
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const isMouseActive = mouseRef.current.active && enableMouseInteraction;

      if (isMouseActive) {
        const radGlow = ctx.createRadialGradient(mx, my, 10, mx, my, 350);
        radGlow.addColorStop(0, 'rgba(212, 163, 89, 0.04)');
        radGlow.addColorStop(0.5, 'rgba(16, 185, 129, 0.015)');
        radGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = radGlow;
        ctx.fillRect(0, 0, width, height);
      }

      // Update and draw particles
      const maxDistance = 140;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse gravitational attraction/repulsion
        if (isMouseActive) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180 && dist > 0) {
            const force = (180 - dist) / 180;
            p.x += (dx / dist) * force * 0.8;
            p.y += (dy / dist) * force * 0.8;
          }
        }

        // Pulse size slightly
        const pulse = Math.sin(clockPulse + i) * 0.3;
        const currentRadius = Math.max(0.5, p.baseRadius + pulse);

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        // Color variation: amber / sovereign teal / ivory
        if (p.cluster === 0) {
          ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha * 0.85})`;
        } else if (p.cluster === 1) {
          ctx.fillStyle = `rgba(16, 185, 129, ${p.alpha * 0.7})`;
        } else {
          ctx.fillStyle = `rgba(226, 232, 240, ${p.alpha * 0.8})`;
        }
        ctx.fill();

        // Connect lines to close neighbors
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(217, 119, 6, ${lineAlpha})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }

        // Connect lines to mouse cursor
        if (isMouseActive) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const lineAlpha = (1 - dist / 150) * 0.35;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mx, my);
            ctx.strokeStyle = `rgba(251, 191, 36, ${lineAlpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (enableMouseInteraction) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [enableMouseInteraction]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-0 h-full w-full ${className}`}
    />
  );
}
