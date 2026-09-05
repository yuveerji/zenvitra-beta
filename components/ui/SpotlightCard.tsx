'use client';

import React, { useRef, useState } from 'react';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowMode?: 'white' | 'blue-purple';
  glowColor?: string;
  paddingClassName?: string;
  radius?: number;
}

export function SpotlightCard({
  children,
  className = '',
  glowMode = 'white',
  glowColor,
  paddingClassName = 'p-8 sm:p-10',
  radius = 480,
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Determine spotlight background & border based on glowMode
  const isBluePurple = glowMode === 'blue-purple';

  const spotlightBackground = glowColor || (isBluePurple
    ? `radial-gradient(${radius}px circle at ${coords.x}px ${coords.y}px, rgba(168, 85, 247, 0.24) 0%, rgba(59, 130, 246, 0.18) 45%, rgba(99, 102, 241, 0.08) 65%, transparent 80%)`
    : `radial-gradient(${radius}px circle at ${coords.x}px ${coords.y}px, rgba(255, 255, 255, 0.12), transparent 75%)`);

  const borderFlareColor = isBluePurple ? 'rgba(168, 85, 247, 0.45)' : 'rgba(255, 255, 255, 0.35)';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-[2.5rem] bg-[#070709] border border-white/10 hover:border-white/20 transition-all duration-300 ${className}`}
      {...props}
    >
      {/* 1. Dynamic Cursor Spotlight Radial Glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          background: spotlightBackground,
        }}
      />

      {/* 2. Cursor Border Highlight Flare */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[2.5rem] transition-opacity duration-300 z-0"
        style={{
          opacity: isHovered ? 0.75 : 0,
          border: `1px solid ${borderFlareColor}`,
          maskImage: `radial-gradient(320px circle at ${coords.x}px ${coords.y}px, black 35%, transparent 80%)`,
          WebkitMaskImage: `radial-gradient(320px circle at ${coords.x}px ${coords.y}px, black 35%, transparent 80%)`,
        }}
      />

      {/* Content Layer */}
      <div className={`relative z-10 h-full flex flex-col justify-between ${paddingClassName}`}>
        {children}
      </div>
    </div>
  );
}

export default SpotlightCard;