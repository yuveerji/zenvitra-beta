'use client';

import React, { useState, useRef, useEffect, createContext, useContext, useId } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import { GLOSSARY_TERMS } from './InteractiveWordModal';
import { useProtocolControls } from '@/lib/founderControl';

interface InteractiveWordContextType {
  activeInstanceId: string | null;
  setActiveInstanceId: (id: string | null) => void;
}

const InteractiveWordContext = createContext<InteractiveWordContextType | null>(null);

export function InteractiveWordGroup({ children }: { children: React.ReactNode }) {
  const [activeInstanceId, setActiveInstanceId] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveInstanceId(null);
    };
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-interactive-word]') && !target.closest('[data-interactive-popover]')) {
        setActiveInstanceId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <InteractiveWordContext.Provider value={{ activeInstanceId, setActiveInstanceId }}>
      {children}
    </InteractiveWordContext.Provider>
  );
}

let globalActiveInstanceId: string | null = null;
const listeners = new Set<(id: string | null) => void>();

function setGlobalActiveInstanceId(id: string | null) {
  globalActiveInstanceId = id;
  listeners.forEach((listener) => listener(id));
}

// Attach document click handler once for standalone usages
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') setGlobalActiveInstanceId(null);
  });
  document.addEventListener('mousedown', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('[data-interactive-word]') && !target.closest('[data-interactive-popover]')) {
      setGlobalActiveInstanceId(null);
    }
  });
}

interface InteractiveWordHoverProps {
  termKey: string;
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  side?: 'top' | 'bottom' | 'auto';
}

export function InteractiveWordHover({
  termKey,
  children,
  className = '',
  align = 'center',
  side = 'bottom',
}: InteractiveWordHoverProps) {
  const rawId = useId();
  const cleanId = rawId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const instanceId = `word_${termKey}_${cleanId}`;

  const context = useContext(InteractiveWordContext);
  const [fallbackActiveInstanceId, setFallbackActiveInstanceId] = useState<string | null>(globalActiveInstanceId);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);

  const [coords, setCoords] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    arrowLeft: number;
    isBottom: boolean;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!context) {
      const handler = (id: string | null) => setFallbackActiveInstanceId(id);
      listeners.add(handler);
      return () => {
        listeners.delete(handler);
      };
    }
  }, [context]);

  const activeInstanceId = context ? context.activeInstanceId : fallbackActiveInstanceId;
  const setActiveInstanceId = context ? context.setActiveInstanceId : setGlobalActiveInstanceId;

  const controls = useProtocolControls();

  const isOpen = activeInstanceId === instanceId;
  const data = GLOSSARY_TERMS[termKey];

  // Dynamic collision detection & viewport positioning
  const updatePosition = () => {
    if (!triggerRef.current || typeof window !== 'undefined' && !document) return;
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();

    // Check if the trigger is enclosed within a card container
    const cardEl = triggerRef.current.closest<HTMLElement>(
      '[data-spotlight-card], [data-card-container]'
    );
    const cardRect = cardEl ? cardEl.getBoundingClientRect() : null;

    // When inside a card, we position outside the entire card boundaries
    const refRect = cardRect || rect;

    const spaceAbove = refRect.top;
    const spaceBelow = window.innerHeight - refRect.bottom;
    const popoverEstimatedHeight = 360;
    const neededHeight = popoverEstimatedHeight + 20;

    let placeBottom = side === 'bottom';
    if (side === 'top') {
      placeBottom = spaceAbove < neededHeight && spaceBelow > spaceAbove;
    } else if (side === 'bottom') {
      placeBottom = !(spaceBelow < neededHeight && spaceAbove > spaceBelow);
    } else {
      // Auto: prefer side with more breathing room
      placeBottom = spaceBelow >= neededHeight || spaceBelow > spaceAbove;
    }

    const popoverWidth = Math.min(420, window.innerWidth - 32);
    let left: number;
    if (align === 'left') {
      left = Math.max(16, Math.min(window.innerWidth - popoverWidth - 16, rect.left));
    } else if (align === 'right') {
      left = Math.max(16, Math.min(window.innerWidth - popoverWidth - 16, rect.right - popoverWidth));
    } else {
      const triggerCenter = rect.left + rect.width / 2;
      left = Math.max(16, Math.min(window.innerWidth - popoverWidth - 16, triggerCenter - popoverWidth / 2));
    }

    const triggerCenter = rect.left + rect.width / 2;
    const arrowLeft = Math.max(24, Math.min(popoverWidth - 24, triggerCenter - left));

    if (placeBottom) {
      setCoords({
        top: Math.max(16, refRect.bottom + 12),
        left,
        arrowLeft,
        isBottom: true,
      });
    } else {
      setCoords({
        bottom: Math.max(16, window.innerHeight - refRect.top + 12),
        left,
        arrowLeft,
        isBottom: false,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      const onScroll = () => updatePosition();
      const onResize = () => updatePosition();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize);
      return () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
      };
    }
  }, [isOpen, side, align]);

  const handleMouseEnter = () => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    updatePosition();
    setActiveInstanceId(instanceId);
  };

  const handleMouseLeave = () => {
    leaveTimerRef.current = setTimeout(() => {
      if (activeInstanceId === instanceId) {
        setActiveInstanceId(null);
      }
    }, 280);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOpen) {
      setActiveInstanceId(null);
    } else {
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
      updatePosition();
      setActiveInstanceId(instanceId);
    }
  };

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  if (!controls.escrowMandateActive && (termKey === 'escrow' || termKey === 'educational-endowment')) {
    return <span className={className}>{children}</span>;
  }

  if (!data) {
    return <span className={className}>{children}</span>;
  }

  return (
    <>
      {/* The Underlined Trigger Element inside original layout */}
      <span
        ref={triggerRef}
        data-interactive-word={instanceId}
        className="relative inline-block z-30"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <span className={`inline-block cursor-pointer select-none transition-all duration-200 ${className}`}>
          {children}
        </span>
      </span>

      {/* Render Popover into document.body (OUTSIDE any card / parent container) */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <AnimatePresence mode="wait">
          {isOpen && coords && (
            <>
              {/* Mobile Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveInstanceId(null);
                }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99998] sm:hidden pointer-events-auto"
              />

              {/* Popover Floating Free of Parent Container */}
              <motion.div
                key={`popover-${instanceId}`}
                data-interactive-popover={instanceId}
                initial={{
                  opacity: 0,
                  y: coords?.isBottom ? -12 : 12,
                  scale: 0.94,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: coords?.isBottom ? -8 : 8,
                  scale: 0.94,
                  transition: { duration: 0.15 },
                }}
                transition={{
                  type: 'spring',
                  stiffness: 420,
                  damping: 26,
                  mass: 0.75,
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => e.stopPropagation()}
                style={
                  coords
                    ? {
                        top: coords.isBottom ? coords.top : undefined,
                        bottom: !coords.isBottom ? coords.bottom : undefined,
                        left: coords.left,
                      }
                    : undefined
                }
                className="fixed inset-x-3 bottom-6 sm:bottom-auto sm:inset-x-auto z-[99999] w-auto sm:w-[420px] max-w-[96vw] text-left pointer-events-auto select-none"
              >
                {/* Invisible hover bridge to maintain hover continuity across gaps */}
                <div
                  className={`hidden sm:block absolute inset-x-0 ${
                    coords.isBottom ? '-top-4 h-4' : '-bottom-4 h-4'
                  } pointer-events-auto`}
                />

                {/* 100% Solid Opaque Pure Obsidian Popover Card */}
                <div
                  className="relative rounded-2xl p-5 sm:p-6 space-y-3.5 overflow-hidden shadow-2xl"
                  style={{
                    backgroundColor: '#07080a',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    boxShadow:
                      '0 30px 100px rgba(0, 0, 0, 1), 0 0 45px rgba(255, 255, 255, 0.12)',
                  }}
                >
                  {/* Pointing Arrow (Desktop Only) */}
                  <div
                    className={`hidden sm:block absolute w-3.5 h-3.5 rotate-45 z-20 ${
                      coords?.isBottom
                        ? '-top-2 border-l border-t border-white/20'
                        : '-bottom-2 border-r border-b border-white/20'
                    }`}
                    style={{
                      backgroundColor: '#07080a',
                      left: coords?.arrowLeft ? `${coords.arrowLeft}px` : '50%',
                      transform: 'translateX(-50%) rotate(45deg)',
                    }}
                  />

                  {/* Header Row */}
                  <div className="space-y-1 relative z-10">
                    <div className="flex items-start justify-between gap-3 pb-0.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                          data.tagColor || 'bg-white/10 border-white/20 text-white'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            data.dotColor || 'bg-white'
                          } animate-pulse`}
                        />
                        {data.tag}
                      </span>
                      <div className="flex items-center gap-2 shrink-0 pt-0.5">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                          {data.protocolBadge}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveInstanceId(null);
                          }}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                          title="Close"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-display font-medium text-xl text-white tracking-tight pt-1">
                      {data.term}
                    </h4>
                  </div>

                  {/* Definition */}
                  <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed relative z-10 font-sans">
                    {!controls.escrowMandateActive
                      ? data.definition
                          .replace(/exactly 10% of all net platform profits are distributed every 6 months to student scholarships, classroom supplies, and school labs\./gi, 'student scholarships, classroom supplies, and school labs.')
                          .replace(/10% of net platform profits every 6 months to student study kits/gi, 'student study kits')
                      : data.definition}
                  </p>

                  {/* Context Breakdown */}
                  <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1 relative z-10">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 font-bold block">
                      Sovereign Blueprint
                    </span>
                    <p className="text-xs text-neutral-200 font-light leading-snug font-sans">
                      {!controls.escrowMandateActive
                        ? data.platformRelation
                            .replace(/guaranteeing 10% of all net platform profits are distributed every 6 months to student scholarships and school supplies, verified with offline giveaway videos on ZEN\.FLUX\./gi, 'focused on student scholarships and grassroots civic education.')
                            .replace(/via our 10% constitutional escrow/gi, 'via our civic grant fund')
                        : data.platformRelation}
                    </p>
                  </div>

                  {/* Action Link Button */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3 relative z-10">
                    <Link
                      href={data.ctaHref}
                      className="w-full inline-flex items-center justify-between px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-mono font-bold transition shadow-sm"
                    >
                      <span>{data.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

export default InteractiveWordHover;
