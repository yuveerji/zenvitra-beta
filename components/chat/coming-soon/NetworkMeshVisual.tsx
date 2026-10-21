'use client';

import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  highlighted: boolean;
  type: 'hub' | 'committee' | 'delegate';
}

export function NetworkMeshVisual() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = mediaQuery.matches;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 600;
      initNodes();
    };

    window.addEventListener('resize', handleResize);

    const mouse = { x: -1000, y: -1000, active: false };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    let nodes: Node[] = [];

    const initNodes = () => {
      const count = Math.min(Math.floor((width * height) / 12000), 55);
      nodes = [];
      for (let i = 0; i < count; i++) {
        const type: 'hub' | 'committee' | 'delegate' =
          i % 9 === 0 ? 'hub' : i % 3 === 0 ? 'committee' : 'delegate';
        const baseRadius = type === 'hub' ? 3.5 : type === 'committee' ? 2.5 : 1.8;
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.45,
          vy: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.45,
          radius: baseRadius,
          baseRadius,
          highlighted: false,
          type,
        });
      }
    };

    initNodes();

    let packetProgress = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Packet step
      packetProgress = (packetProgress + 0.008) % 1;

      // Update positions
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (!prefersReducedMotion) {
          node.x += node.vx;
          node.y += node.vy;

          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;
        }

        // Distance to mouse
        if (mouse.active) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            node.highlighted = true;
            node.radius = node.baseRadius * 1.5;
          } else {
            node.highlighted = false;
            node.radius = node.baseRadius;
          }
        } else {
          node.highlighted = false;
          node.radius = node.baseRadius;
        }
      }

      // Draw connections
      const maxDistance = 140;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (n1.highlighted || n2.highlighted ? 0.45 : 0.16);
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = n1.highlighted || n2.highlighted
              ? `rgba(96, 165, 250, ${alpha})`
              : `rgba(148, 163, 184, ${alpha})`;
            ctx.lineWidth = n1.highlighted || n2.highlighted ? 1.2 : 0.8;
            ctx.stroke();

            // Occasional simulated data packet along hub lines
            if (!prefersReducedMotion && (n1.type === 'hub' || n2.type === 'hub') && dist < 110) {
              const px = n1.x + dx * packetProgress;
              const py = n1.y + dy * packetProgress;
              ctx.beginPath();
              ctx.arc(px, py, 1.2, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(147, 197, 253, 0.7)';
              ctx.fill();
            }
          }
        }
      }

      // Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

        if (node.type === 'hub') {
          ctx.fillStyle = node.highlighted ? '#93c5fd' : '#60a5fa';
          ctx.shadowColor = 'rgba(59, 130, 246, 0.8)';
          ctx.shadowBlur = 8;
        } else if (node.type === 'committee') {
          ctx.fillStyle = node.highlighted ? '#ffffff' : '#cbd5e1';
          ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
          ctx.shadowBlur = 4;
        } else {
          ctx.fillStyle = node.highlighted ? '#94a3b8' : '#64748b';
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-auto overflow-hidden opacity-75">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        aria-hidden="true"
      />
    </div>
  );
}
