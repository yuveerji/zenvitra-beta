'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  MessageSquare, 
  Users, 
  FileText, 
  Scale, 
  Compass, 
  Radio, 
  Vote, 
  Phone, 
  Calendar, 
  Sparkles, 
  Hash, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useZenChat } from '@/context/ZenChatPlatformContext';

interface ZenChatCommandBarProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerSlashAction?: (action: string) => void;
}

interface CommandItem {
  id: string;
  category: 'Commands' | 'People' | 'Communities' | 'Ecosystem';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  action: () => void;
  badge?: string;
}

export function ZenChatCommandBar({
  isOpen,
  onClose,
  onTriggerSlashAction,
}: ZenChatCommandBarProps) {
  const router = useRouter();
  const { 
    conversations, 
    setActiveConversationId,
    createDirectChat,
    sendNativeObjectMessage
  } = useZenChat();

  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global Keydown listener for ⌘K and Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Command items builder
  const allCommands = useMemo<CommandItem[]>(() => {
    const list: CommandItem[] = [
      // 1. Slash Commands & Fast Triggers
      {
        id: 'cmd-poll',
        category: 'Commands',
        title: '/poll — Create Sovereign Vote',
        subtitle: 'Dispatch an interactive vote card to this conversation',
        icon: <Vote className="w-4 h-4 text-cyan-400" />,
        badge: '/poll',
        action: () => {
          onTriggerSlashAction?.('poll');
          onClose();
        },
      },
      {
        id: 'cmd-doc',
        category: 'Commands',
        title: '/doc — Share Document Workspace',
        subtitle: 'Embed a collaborative UN resolution or working paper from ZEN.DOCS',
        icon: <FileText className="w-4 h-4 text-emerald-400" />,
        badge: '/doc',
        action: () => {
          onTriggerSlashAction?.('doc');
          onClose();
        },
      },
      {
        id: 'cmd-mun',
        category: 'Commands',
        title: '/mun — Summon Committee Chamber',
        subtitle: 'Transmit dais call card with schedule and committee link',
        icon: <Scale className="w-4 h-4 text-purple-400" />,
        badge: '/mun',
        action: () => {
          onTriggerSlashAction?.('mun');
          onClose();
        },
      },
      {
        id: 'cmd-chamber',
        category: 'Commands',
        title: '/chamber — Deliberation Room Invite',
        subtitle: 'Share structured consensus session card',
        icon: <Compass className="w-4 h-4 text-amber-400" />,
        badge: '/chamber',
        action: () => {
          onTriggerSlashAction?.('chamber');
          onClose();
        },
      },
      {
        id: 'cmd-pulse',
        category: 'Commands',
        title: '/pulse — Civic Signal Broadcast',
        subtitle: 'Reference live pulse post in chat',
        icon: <Radio className="w-4 h-4 text-pink-400" />,
        badge: '/pulse',
        action: () => {
          onTriggerSlashAction?.('pulse');
          onClose();
        },
      },
    ];

    // 2. Add Existing Conversations
    conversations.forEach((c) => {
      list.push({
        id: `conv-${c.id}`,
        category: c.type === 'dm' ? 'People' : 'Communities',
        title: c.name,
        subtitle: c.type === 'dm' ? `@${c.handle || c.name}` : `${c.type.toUpperCase()} • ${c.lastMessage?.text || 'Active Channel'}`,
        icon: c.type === 'dm' ? <Users className="w-4 h-4 text-neutral-300" /> : <Hash className="w-4 h-4 text-purple-400" />,
        action: () => {
          setActiveConversationId(c.id);
          onClose();
        },
      });
    });

    // 3. Ecosystem Destinations
    list.push(
      {
        id: 'nav-docs',
        category: 'Ecosystem',
        title: 'ZEN.DOCS Studio',
        subtitle: 'Draft multilateral treaties, resolutions, and sovereign bills',
        icon: <FileText className="w-4 h-4 text-cyan-400" />,
        action: () => {
          router.push('/docs');
          onClose();
        },
      },
      {
        id: 'nav-pulse',
        category: 'Ecosystem',
        title: 'ZEN.PULSE Feed',
        subtitle: 'Civic signals, verified policy debate, and global pulse map',
        icon: <Radio className="w-4 h-4 text-emerald-400" />,
        action: () => {
          router.push('/pulse');
          onClose();
        },
      },
      {
        id: 'nav-chamber',
        category: 'Ecosystem',
        title: 'ZEN.CHAMBER Council',
        subtitle: 'Collaborative rooms, policy deliberation & consensus voting',
        icon: <Compass className="w-4 h-4 text-amber-400" />,
        action: () => {
          router.push('/chamber');
          onClose();
        },
      },
      {
        id: 'nav-mun',
        category: 'Ecosystem',
        title: 'ZEN.MUN Assembly',
        subtitle: 'Flagship Model UN platform with live floor command center',
        icon: <Scale className="w-4 h-4 text-purple-400" />,
        action: () => {
          router.push('/committee');
          onClose();
        },
      }
    );

    return list;
  }, [conversations, onTriggerSlashAction, onClose, router, setActiveConversationId]);

  // Filter commands by query
  const filtered = useMemo(() => {
    if (!search.trim()) return allCommands;
    const q = search.toLowerCase().trim();
    return allCommands.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        (c.badge && c.badge.toLowerCase().includes(q))
    );
  }, [allCommands, search]);

  // Keyboard navigation within filtered list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/80 backdrop-blur-md">
          {/* Backdrop click */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative w-full max-w-xl rounded-3xl bg-[#090a10] border border-white/15 shadow-2xl overflow-hidden font-sans z-10 flex flex-col max-h-[75vh]"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
              <Search className="w-5 h-5 text-neutral-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search delegates, chats, or type /poll, /doc, /mun..."
                className="w-full bg-transparent text-sm text-white placeholder:text-neutral-500 focus:outline-none font-sans"
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-block font-mono text-[10px] text-neutral-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                  ESC
                </kbd>
              )}
            </div>

            {/* Results Stream */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-white/[0.03]">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-neutral-500 font-mono text-xs">
                  No matching results for &ldquo;{search}&rdquo;
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition select-none ${
                        isSelected
                          ? 'bg-white/10 text-white shadow-sm'
                          : 'text-neutral-300 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? 'bg-white/15 border-white/30 text-white'
                              : 'bg-white/[0.03] border-white/10 text-neutral-400'
                          }`}
                        >
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs sm:text-sm text-white truncate">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <ArrowRight
                        className={`w-4 h-4 shrink-0 transition ${
                          isSelected ? 'opacity-100 translate-x-0.5 text-white' : 'opacity-0'
                        }`}
                      />
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Hints */}
            <div className="px-4 py-2.5 border-t border-white/[0.06] bg-white/[0.01] flex items-center justify-between text-[10px] font-mono text-neutral-500">
              <div className="flex items-center gap-3">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span>esc close</span>
              </div>
              <span className="text-neutral-400">ZENVITRA REAL-TIME LAYER</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
