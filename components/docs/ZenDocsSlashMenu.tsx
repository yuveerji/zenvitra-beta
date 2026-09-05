'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ListOrdered,
  Building2,
  ShieldCheck,
  Type,
  Minus,
  Quote,
  ChevronLeft
} from 'lucide-react';
import {
  UN_PREAMBLE_PREFIXES,
  UN_OPERATIVE_PREFIXES,
  INDIAN_BILL_SECTIONS
} from '@/lib/docsData';

export interface ZenDocsSlashMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  searchQuery: string;
  onClose: () => void;
  onInsertPreamble: (prefix: string) => void;
  onInsertOperative: (prefix: string) => void;
  onInsertBillSection: (sec: { prefix: string; placeholder: string }) => void;
  onInsertSeal: () => void;
  onInsertDivider: () => void;
  onInsertHeading: (level: 1 | 2 | 3) => void;
  onInsertBlockquote: () => void;
  onOpenAI: () => void;
}

type CommandCategory = 'Diplomatic' | 'Content' | 'AI';
type SubListMode = 'none' | 'preamble' | 'operative' | 'section' | 'heading';

interface SlashCommandItem {
  id: string;
  name: string;
  description: string;
  category: CommandCategory;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  trigger: string;
  onSelect: () => void;
}

interface SubMenuItem {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  onSelect: () => void;
}

export function ZenDocsSlashMenu({
  isOpen,
  position,
  searchQuery,
  onClose,
  onInsertPreamble,
  onInsertOperative,
  onInsertBillSection,
  onInsertSeal,
  onInsertDivider,
  onInsertHeading,
  onInsertBlockquote,
  onOpenAI
}: ZenDocsSlashMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [subMode, setSubMode] = useState<SubListMode>('none');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [coords, setCoords] = useState<{ x: number; y: number }>(position);

  // Position clamping
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;

    const menuWidth = 288;
    const menuHeight = 320;
    const padding = 12;

    let x = position.x;
    let y = position.y + 6;

    if (x + menuWidth > window.innerWidth - padding) {
      x = window.innerWidth - menuWidth - padding;
    }
    if (x < padding) {
      x = padding;
    }

    if (y + menuHeight > window.innerHeight - padding) {
      const flipped = position.y - menuHeight - 6;
      y = flipped > padding ? flipped : Math.max(padding, window.innerHeight - menuHeight - padding);
    }

    setCoords({ x, y });
  }, [position, isOpen]);

  // Reset state on close or search change
  useEffect(() => {
    if (!isOpen) {
      setSubMode('none');
      setActiveIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim().length > 0 && subMode !== 'none') {
      setSubMode('none');
    }
    setActiveIndex(0);
  }, [searchQuery, subMode]);

  // Main command definitions
  const mainCommands = useMemo<SlashCommandItem[]>(
    () => [
      {
        id: 'preamble',
        name: 'UN Preamble Clause',
        description: 'Insert preambular gerund clause',
        category: 'Diplomatic',
        trigger: 'preamble',
        icon: Sparkles,
        iconColor: 'text-purple-400',
        iconBg: 'bg-purple-500/10 border-purple-500/20',
        onSelect: () => setSubMode('preamble')
      },
      {
        id: 'operative',
        name: 'UN Operative Clause',
        description: 'Insert numbered operative clause',
        category: 'Diplomatic',
        trigger: 'operative',
        icon: ListOrdered,
        iconColor: 'text-purple-400',
        iconBg: 'bg-purple-500/10 border-purple-500/20',
        onSelect: () => setSubMode('operative')
      },
      {
        id: 'section',
        name: 'Parliamentary Section',
        description: 'Insert Indian Bill section',
        category: 'Diplomatic',
        trigger: 'section',
        icon: Building2,
        iconColor: 'text-amber-400',
        iconBg: 'bg-amber-500/10 border-amber-500/20',
        onSelect: () => setSubMode('section')
      },
      {
        id: 'seal',
        name: 'Sovereign Seal',
        description: 'Stamp cryptographic hash',
        category: 'Diplomatic',
        trigger: 'seal',
        icon: ShieldCheck,
        iconColor: 'text-emerald-400',
        iconBg: 'bg-emerald-500/10 border-emerald-500/20',
        onSelect: () => {
          onInsertSeal();
          onClose();
        }
      },
      {
        id: 'heading',
        name: 'Heading',
        description: 'Insert heading (H1/H2/H3)',
        category: 'Content',
        trigger: 'heading',
        icon: Type,
        iconColor: 'text-cyan-400',
        iconBg: 'bg-cyan-500/10 border-cyan-500/20',
        onSelect: () => setSubMode('heading')
      },
      {
        id: 'divider',
        name: 'Divider',
        description: 'Insert horizontal line',
        category: 'Content',
        trigger: 'divider',
        icon: Minus,
        iconColor: 'text-neutral-300',
        iconBg: 'bg-white/10 border-white/15',
        onSelect: () => {
          onInsertDivider();
          onClose();
        }
      },
      {
        id: 'quote',
        name: 'Blockquote',
        description: 'Insert quoted text',
        category: 'Content',
        trigger: 'quote',
        icon: Quote,
        iconColor: 'text-cyan-400',
        iconBg: 'bg-cyan-500/10 border-cyan-500/20',
        onSelect: () => {
          onInsertBlockquote();
          onClose();
        }
      },
      {
        id: 'ai',
        name: 'AI Copilot',
        description: 'Generate diplomatic clauses',
        category: 'AI',
        trigger: 'ai',
        icon: Sparkles,
        iconColor: 'text-amber-400',
        iconBg: 'bg-amber-500/10 border-amber-500/20',
        onSelect: () => {
          onOpenAI();
          onClose();
        }
      }
    ],
    [onInsertSeal, onInsertDivider, onInsertBlockquote, onOpenAI, onClose]
  );

  // Filtered main commands based on search
  const filteredCommands = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return mainCommands;
    return mainCommands.filter(
      (cmd) =>
        cmd.name.toLowerCase().includes(q) ||
        cmd.trigger.toLowerCase().includes(q) ||
        cmd.description.toLowerCase().includes(q)
    );
  }, [mainCommands, searchQuery]);

  // Sub-items based on active subMode
  const subItems = useMemo<SubMenuItem[]>(() => {
    if (subMode === 'preamble') {
      return UN_PREAMBLE_PREFIXES.slice(0, 8).map((prefix) => ({
        id: `preamble-${prefix}`,
        name: prefix,
        description: 'Preambular gerund clause',
        icon: Sparkles,
        iconColor: 'text-purple-400',
        onSelect: () => {
          onInsertPreamble(prefix);
          onClose();
        }
      }));
    }

    if (subMode === 'operative') {
      return UN_OPERATIVE_PREFIXES.slice(0, 8).map((prefix) => ({
        id: `operative-${prefix}`,
        name: prefix,
        description: 'Numbered operative clause',
        icon: ListOrdered,
        iconColor: 'text-purple-400',
        onSelect: () => {
          onInsertOperative(prefix);
          onClose();
        }
      }));
    }

    if (subMode === 'section') {
      return INDIAN_BILL_SECTIONS.map((sec, idx) => ({
        id: `section-${idx}`,
        name: sec.prefix,
        description: sec.placeholder.split('\n')[0] || 'Statutory clause',
        icon: Building2,
        iconColor: 'text-amber-400',
        onSelect: () => {
          onInsertBillSection(sec);
          onClose();
        }
      }));
    }

    if (subMode === 'heading') {
      const headingLevels: (1 | 2 | 3)[] = [1, 2, 3];
      return headingLevels.map((lvl) => ({
        id: `heading-${lvl}`,
        name: `Heading ${lvl}`,
        description: lvl === 1 ? 'Primary title (H1)' : lvl === 2 ? 'Section header (H2)' : 'Clause title (H3)',
        icon: Type,
        iconColor: 'text-cyan-400',
        onSelect: () => {
          onInsertHeading(lvl);
          onClose();
        }
      }));
    }

    return [];
  }, [subMode, onInsertPreamble, onInsertOperative, onInsertBillSection, onInsertHeading, onClose]);

  const currentCount = subMode === 'none' ? filteredCommands.length : subItems.length;

  // Scroll active item into view
  useEffect(() => {
    if (itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);

  // Click outside listener
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        if (subMode !== 'none') {
          setSubMode('none');
          setActiveIndex(0);
        } else {
          onClose();
        }
        return;
      }

      if (currentCount === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % currentCount);
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + currentCount) % currentCount);
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (subMode === 'none') {
          filteredCommands[activeIndex]?.onSelect();
        } else {
          subItems[activeIndex]?.onSelect();
        }
      }
    },
    [isOpen, subMode, currentCount, activeIndex, filteredCommands, subItems, onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const categories: CommandCategory[] = ['Diplomatic', 'Content', 'AI'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          role="menu"
          aria-label="Slash commands"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.15 }}
          style={{
            left: `${coords.x}px`,
            top: `${coords.y}px`
          }}
          className="fixed z-50 w-72 max-h-80 overflow-y-auto rounded-xl bg-[#0e121e]/98 backdrop-blur-2xl border border-white/15 shadow-2xl p-1.5 select-none pointer-events-auto"
        >
          {subMode !== 'none' ? (
            <div>
              <button
                type="button"
                onClick={() => {
                  setSubMode('none');
                  setActiveIndex(0);
                }}
                className="flex items-center gap-1.5 w-full px-2.5 py-1.5 mb-1 rounded-lg text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition cursor-pointer border-b border-white/10 pb-1.5"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back to commands</span>
              </button>

              <div className="text-[10px] font-mono text-neutral-500 uppercase px-2 pt-1 pb-1">
                {subMode === 'preamble' && 'UN Preamble Clauses'}
                {subMode === 'operative' && 'UN Operative Clauses'}
                {subMode === 'section' && 'Indian Bill Sections'}
                {subMode === 'heading' && 'Heading Levels'}
              </div>

              {subItems.map((item, idx) => {
                const Icon = item.icon;
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    ref={(el) => {
                      itemRefs.current[idx] = el;
                    }}
                    onClick={item.onSelect}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`flex items-center gap-2.5 w-full text-left px-2.5 py-2 rounded-lg transition cursor-pointer text-xs ${
                      isActive ? 'bg-white/10 text-white' : 'text-neutral-300 hover:bg-white/5'
                    }`}
                  >
                    <div className="w-5 h-5 rounded flex items-center justify-center bg-white/5 border border-white/10 flex-shrink-0">
                      <Icon className={`w-3.5 h-3.5 ${item.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate leading-snug">{item.name}</p>
                      <p className="text-[11px] text-neutral-400 truncate leading-tight">{item.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : filteredCommands.length === 0 ? (
            <div className="py-6 px-3 text-center text-xs text-neutral-400">
              No matching commands for &ldquo;{searchQuery}&rdquo;
            </div>
          ) : (
            <div>
              {categories.map((cat) => {
                const catCommands = filteredCommands.filter((c) => c.category === cat);
                if (catCommands.length === 0) return null;

                return (
                  <div key={cat} className="mb-1 last:mb-0">
                    <div className="text-[10px] font-mono text-neutral-500 uppercase px-2 pt-2 pb-1">
                      {cat}
                    </div>
                    {catCommands.map((cmd) => {
                      const Icon = cmd.icon;
                      const globalIdx = filteredCommands.indexOf(cmd);
                      const isActive = activeIndex === globalIdx;

                      return (
                        <button
                          key={cmd.id}
                          type="button"
                          ref={(el) => {
                            itemRefs.current[globalIdx] = el;
                          }}
                          onClick={cmd.onSelect}
                          onMouseEnter={() => setActiveIndex(globalIdx)}
                          className={`flex items-center gap-2.5 w-full text-left px-2.5 py-2 rounded-lg transition cursor-pointer text-xs ${
                            isActive ? 'bg-white/10 text-white' : 'text-neutral-300 hover:bg-white/5'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-md flex items-center justify-center border flex-shrink-0 ${cmd.iconBg}`}
                          >
                            <Icon className={`w-3.5 h-3.5 ${cmd.iconColor}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className="font-semibold text-white truncate leading-snug">{cmd.name}</p>
                              <span className="text-[10px] font-mono text-neutral-500">/{cmd.trigger}</span>
                            </div>
                            <p className="text-[11px] text-neutral-400 truncate leading-tight">
                              {cmd.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
