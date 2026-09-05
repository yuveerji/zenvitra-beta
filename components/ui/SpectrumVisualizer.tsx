'use client';

import React, { useEffect, useRef } from 'react';

interface SpectrumVisualizerProps {
  isPlaying?: boolean;
  barCount?: number;
  className?: string;
}

export const SpectrumVisualizer: React.FC<SpectrumVisualizerProps> = ({
  isPlaying = false,
  barCount = 32,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const barWidth = (width / barCount) * 0.7;
      const gap = (width / barCount) * 0.3;

      for (let i = 0; i < barCount; i++) {
        let barHeight = height * 0.15;
        if (isPlaying) {
          const sinVal = Math.sin(phase + i * 0.25) * 0.5 + 0.5;
          const noise = Math.sin(phase * 1.5 + i * 0.4) * 0.3;
          barHeight = Math.max(height * 0.1, (sinVal + noise) * height * 0.85);
        }

        const x = i * (barWidth + gap);
        const y = height - barHeight;

        ctx.fillStyle = isPlaying ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.15)';
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }

      phase += 0.08;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, barCount]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={64}
      className={`w-full h-16 ${className}`}
    />
  );
};