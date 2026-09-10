'use client';

import React, { useRef, useState } from 'react';

interface ZenSpatialCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glowColor?: string;
}

export function ZenSpatialCard({
  children,
  className = '',
  maxTilt = 6,
  glowColor = 'rgba(255, 255, 255, 0.08)',
}: ZenSpatialCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50, opacity: 0 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransform({
      rotateX,
      rotateY,
      glowX: (x / rect.width) * 100,
      glowY: (y / rect.height) * 100,
      opacity: 1,
    });
  };

  const handlePointerLeave = () => {
    setTransform((prev) => ({ ...prev, rotateX: 0, rotateY: 0, opacity: 0 }));
  };

  return (
    <div
      style={{ perspective: 1000 }}
      className={`relative select-none ${className}`}
    >
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
          transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="relative w-full h-full rounded-2xl bg-[#08090c]/90 border border-white/[0.08] backdrop-blur-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
      >
        {/* Dynamic Light Sheen */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-10"
          style={{
            opacity: transform.opacity,
            background: `radial-gradient(350px circle at ${transform.glowX}% ${transform.glowY}%, ${glowColor}, transparent 70%)`,
          }}
        />
        {children}
      </div>
    </div>
  );
}
