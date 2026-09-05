import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
}

export function BrandLogo({ 
  className = '', 
  showTagline = false, 
  size = 'md',
  href = '/' 
}: BrandLogoProps) {
  const iconSizeClasses = {
    sm: 'w-[26px] h-[26px] rounded-lg',
    md: 'w-[32px] h-[32px] rounded-xl',
    lg: 'w-[40px] h-[40px] rounded-2xl',
    xl: 'w-[52px] h-[52px] rounded-2xl',
  };

  const textSizes = {
    sm: 'text-sm tracking-[0.14em]',
    md: 'text-base tracking-[0.14em]',
    lg: 'text-xl tracking-[0.16em]',
    xl: 'text-2xl tracking-[0.18em]',
  };

  return (
    <Link 
      href={href} 
      className={`inline-flex items-center gap-2.5 sm:gap-3 select-none group shrink-0 ${className}`}
    >
      <div className={`relative ${iconSizeClasses[size]} flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shrink-0`}>
        <img
          src="/assets/logo.png"
          alt="Zenvitra Official Logo"
          className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.25)] transition-transform duration-300"
        />
      </div>

      <div className="flex flex-col">
        <span 
          className={`uppercase text-[#f5f1ea] font-bold group-hover:text-white transition-colors leading-none ${textSizes[size]}`}
          style={{
            fontFamily: 'Clash Display, var(--font-space), sans-serif',
            fontWeight: 700,
          }}
        >
          ZENVITRA
        </span>
        {showTagline && (
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mt-1">
            Sovereign Youth Platform
          </span>
        )}
      </div>
    </Link>
  );
}

export default BrandLogo;
