'use client';

import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import { GLOSSARY_TERMS } from './InteractiveWordModal';

interface InteractiveWordContextType {
  activeKey: string | null;
  setActiveKey: (key: string | null) => void;
}

const InteractiveWordContext = createContext<InteractiveWordContextType | null>(null);

export function InteractiveWordGroup({ children }: { children: React.ReactNode }) {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveKey(null);
    };
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-interactive-word]')) {
        setActiveKey(null);
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
    <InteractiveWordContext.Provider value={{ activeKey, setActiveKey }}>
      {children}
    </InteractiveWordContext.Provider>
  );
}

let globalActiveKey: string | null = null;
const listeners = new Set<(key: string | null) => void>();

function setGlobalActiveKey(key: string | null) {
  globalActiveKey = key;
  listeners.forEach((listener) => listener(key));
}

// Attach document click handler once for standalone usages
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') setGlobalActiveKey(null);
  });
  document.addEventListener('mousedown', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('[data-interactive-word]')) {
      setGlobalActiveKey(null);
    }
  });
}

interface InteractiveWordHoverProps {
  termKey: string;
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  side?: 'top' | 'bottom';
}

export function InteractiveWordHover({
  termKey,
  children,
  className = '',
  align = 'center',
  side = 'top',
}: InteractiveWordHoverProps) {
  const context = useContext(InteractiveWordContext);
  const [fallbackActiveKey, setFallbackActiveKey] = useState<string | null>(globalActiveKey);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!context) {
      const handler = (key: string | null) => setFallbackActiveKey(key);
      listeners.add(handler);
      return () => {
        listeners.delete(handler);
      };
    }
  }, [context]);

  const activeKey = context ? context.activeKey : fallbackActiveKey;
  const setActiveKey = context ? context.setActiveKey : setGlobalActiveKey;

  const isOpen = activeKey === termKey;
  const data = GLOSSARY_TERMS[termKey];

  const handleMouseEnter = () => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    setActiveKey(termKey);
  };

  const handleMouseLeave = () => {
    leaveTimerRef.current = setTimeout(() => {
      if (activeKey === termKey) {
        setActiveKey(null);
      }
    }, 280);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOpen) {
      setActiveKey(null);
    } else {
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
      setActiveKey(termKey);
    }
  };

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  if (!data) {
    return <span className={className}>{children}</span>;
  }

  const getAlignmentClasses = () => {
    switch (align) {
      case 'left':
        return 'left-0';
      case 'right':
        return 'right-0';
      case 'center':
      default:
        return 'left-1/2 -translate-x-1/2';
    }
  };

  const getArrowClasses = () => {
    switch (align) {
      case 'left':
        return 'left-8';
      case 'right':
        return 'right-8';
      case 'center':
      default:
        return 'left-1/2 -translate-x-1/2';
    }
  };

  const isBottom = side === 'bottom';

  return (
    <span
      data-interactive-word={termKey}
      className="relative inline-block z-30"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* The Underlined Trigger Element */}
      <span className={`inline-block cursor-pointer select-none transition-all duration-200 ${className}`}>
        {children}
      </span>

      {/* Responsive Popover: Mobile Bottom Sheet + Desktop Floating Popover */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Mobile Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveKey(null);
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] sm:hidden pointer-events-auto"
            />

            <motion.div
              key={`popover-${termKey}`}
              initial={{
                opacity: 0,
                y: isBottom ? -12 : 12,
                scale: 0.94,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: isBottom ? -8 : 8,
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
              className={`fixed inset-x-3 bottom-6 sm:bottom-auto sm:inset-x-auto z-[9999] sm:absolute w-auto sm:w-[420px] max-w-[96vw] text-left pointer-events-auto select-none ${
                isBottom ? 'sm:top-full sm:mt-3' : 'sm:bottom-full sm:mb-3'
              } ${getAlignmentClasses()}`}
            >
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
                {/* Solid Pointing Arrow (Desktop Only) */}
                <div
                  className={`hidden sm:block absolute w-3.5 h-3.5 rotate-45 z-20 ${
                    isBottom
                      ? '-top-2 border-l border-t border-white/20'
                      : '-bottom-2 border-r border-b border-white/20'
                  } ${getArrowClasses()}`}
                  style={{ backgroundColor: '#07080a' }}
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
                          setActiveKey(null);
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
                  {data.definition}
                </p>

                {/* Context Breakdown */}
                <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1 relative z-10">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 font-bold block">
                    Sovereign Blueprint
                  </span>
                  <p className="text-xs text-neutral-200 font-light leading-snug font-sans">
                    {data.platformRelation}
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
      </AnimatePresence>
    </span>
  );
}

export default InteractiveWordHover;
