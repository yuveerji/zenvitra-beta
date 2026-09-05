'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  HeartHandshake, 
  Radio, 
  X, 
  ExternalLink,
  Trash2,
  Check,
  Flame,
  Volume2,
  VolumeX,
  Clock,
  Crown,
  ArrowRight,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { 
  getStoredNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  clearAllStoredNotifications,
  NotificationItem 
} from '@/lib/notificationStorage';
import { subscribeToActivitySync } from '@/lib/reactiveActivityHub';
import { BrowserPushPrompt } from './BrowserPushPrompt';
import { getFounderDirective } from '@/lib/founderControl';

export function NotificationBell() {
  const { isAuthenticated, profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [expandedDirectiveId, setExpandedDirectiveId] = useState<string | null>(null);

  const bellRef = useRef<HTMLDivElement>(null);

  // Sync notifications from persistent storage on mount & on broadcast events
  const refreshNotifications = useCallback(() => {
    const items = getStoredNotifications();

    // Inject active founder directives as notifications
    const directiveNotifs: NotificationItem[] = [];
    try {
      const directive = getFounderDirective();
      if (directive && directive.isActive) {
        const readDirectives: string[] = JSON.parse(localStorage.getItem('zenvitra_read_directives_v1') || '[]');
        directiveNotifs.push({
          id: `directive_${directive.id}`,
          title: directive.title,
          message: directive.body,
          timestamp: directive.updatedAt ? new Date(directive.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Active',
          type: 'directive',
          priority: directive.priority,
          author: directive.author,
          read: readDirectives.includes(`directive_${directive.id}`),
          createdAt: directive.updatedAt ? new Date(directive.updatedAt).getTime() : Date.now(),
        });
      }
    } catch {}

    const directiveIds = new Set(directiveNotifs.map(d => d.id));
    setNotifications([...directiveNotifs, ...items.filter(n => !directiveIds.has(n.id))]);
  }, []);

  useEffect(() => {
    refreshNotifications();
    const unsubscribe = subscribeToActivitySync(() => {
      refreshNotifications();
    });
    return () => unsubscribe();
  }, [refreshNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayedNotifications = filterMode === 'unread' 
    ? notifications.filter((n) => !n.read) 
    : notifications;

  // Close dropdown on outside click or ESC
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMarkAllRead = () => {
    const updated = markAllNotificationsAsRead();
    setNotifications(updated);
  };

  const handleMarkSingleRead = (id: string) => {
    const updated = markNotificationAsRead(id);
    setNotifications(updated);
  };

  const handleClearAll = () => {
    const updated = clearAllStoredNotifications();
    setNotifications(updated);
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'directive':
        return <Crown className="w-4 h-4 text-rose-400" />;
      case 'security':
        return <ShieldCheck className="w-4 h-4 text-zinc-300" />;
      case 'mun':
        return <Award className="w-4 h-4 text-zinc-300" />;
      case 'escrow':
        return <HeartHandshake className="w-4 h-4 text-zinc-300" />;
      case 'pulse':
        return <Radio className="w-4 h-4 text-zinc-300" />;
      default:
        return <Sparkles className="w-4 h-4 text-zinc-300" />;
    }
  };

  return (
    <div className="relative" ref={bellRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-white/15 hover:border-white/30 text-zinc-300 hover:text-white transition flex items-center justify-center cursor-pointer group"
        title="Notifications & Alerts"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
        
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400 shadow-[0_0_10px_#f59e0b,0_0_18px_#fbbf24]" />
          </span>
        )}
      </button>

      {/* Notifications Dropdown Drawer (Pure B&W Monochrome with Glowing Yellow Unread Light) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay for mobile & clean click outside handling */}
            <div 
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-[2px] sm:bg-transparent sm:backdrop-blur-none"
            />

            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="absolute right-0 top-12 w-80 sm:w-96 rounded-3xl border border-white/15 bg-[#08080a] backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.98)] z-50 text-left font-sans text-white overflow-hidden"
            >
              {/* Clean Monochrome Header */}
              <div className="flex items-center justify-between p-4 bg-zinc-950 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-xl bg-white/10 border border-white/15 text-white">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs uppercase tracking-wider text-white flex items-center gap-2">
                      <span>Notifications &amp; Feeds</span>
                    </span>
                    <p className="text-[10px] font-mono text-zinc-400">Persistent real-time telemetry</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 ? (
                    <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-mono font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                      {unreadCount} unread
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-zinc-900 border border-white/10 text-zinc-400 text-[10px] font-mono">
                      All caught up
                    </span>
                  )}
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[10px] font-mono text-zinc-400 hover:text-white transition cursor-pointer px-2 py-0.5 rounded-md hover:bg-white/10 flex items-center gap-1"
                      title="Mark all as read"
                    >
                      <Check className="w-3 h-3" />
                      <span>Read all</span>
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="p-1.5 text-zinc-500 hover:text-white transition cursor-pointer rounded-lg hover:bg-white/10"
                      title="Clear All Notifications"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Cross-Browser Device Push Notification Permission Banner */}
              <BrowserPushPrompt />

              {/* Filter Tabs Bar (All vs Unread) */}
              <div className="flex items-center justify-between px-3 py-2 bg-zinc-950/80 border-b border-white/5 text-[11px] font-mono">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setFilterMode('all')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                      filterMode === 'all'
                        ? 'bg-white text-black font-bold'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    onClick={() => setFilterMode('unread')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                      filterMode === 'unread'
                        ? 'bg-white text-black font-bold'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {unreadCount > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
                    )}
                    <span>Unread ({unreadCount})</span>
                  </button>
                </div>

                <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Real-time Sync</span>
                </span>
              </div>

              {/* List */}
              <div className="p-3 space-y-2 max-h-80 overflow-y-auto bg-[#07080a]">
                {displayedNotifications.length > 0 ? (
                  displayedNotifications.map((notif) => {
                    // ─── DIRECTIVE: RED BANNER CARD ───
                    if (notif.type === 'directive') {
                      const isExpanded = expandedDirectiveId === notif.id;

                      const directiveContent = (
                        <div
                          onClick={() => {
                            setExpandedDirectiveId(isExpanded ? null : notif.id);
                            try {
                              const raw = localStorage.getItem('zenvitra_read_directives_v1');
                              const readDirectives: string[] = raw ? JSON.parse(raw) : [];
                              if (!readDirectives.includes(notif.id)) {
                                readDirectives.push(notif.id);
                                localStorage.setItem('zenvitra_read_directives_v1', JSON.stringify(readDirectives));
                              }
                            } catch {}
                            refreshNotifications();
                          }}
                          className={`p-4 rounded-2xl transition-all duration-200 cursor-pointer relative overflow-hidden space-y-2.5 ${
                            notif.read
                              ? 'bg-rose-950/20 border border-rose-500/15 hover:border-rose-500/30 text-zinc-400'
                              : 'bg-gradient-to-br from-rose-950/80 via-rose-950/40 to-[#0a0608] border border-rose-500/40 hover:border-rose-400/60 shadow-[0_0_25px_rgba(244,63,94,0.15)] text-white'
                          }`}
                        >
                          {/* Red accent bar */}
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-rose-500 via-red-400 to-rose-600" />

                          {!notif.read && (
                            <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-rose-400 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                          )}

                          {/* Tag */}
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 shadow-[0_0_6px_rgba(244,63,94,0.5)]" />
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-[8px] font-mono font-bold tracking-wider text-rose-300 uppercase">
                              EXECUTIVE DIRECTIVE • {notif.priority || 'CONSTITUTIONAL'}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className={`font-display font-black text-[13px] leading-snug tracking-tight ${!notif.read ? 'text-white' : 'text-neutral-300'}`}>
                            {notif.title}
                          </h4>

                          {/* Body - Full detailed message when expanded */}
                          <p className={`text-[11px] leading-relaxed font-sans text-neutral-300/90 font-light ${isExpanded ? 'whitespace-pre-wrap' : 'line-clamp-3'}`}>
                            {notif.message}
                          </p>

                          {/* Signature & Status / Read Button */}
                          <div className="flex items-center justify-between pt-2 border-t border-rose-500/20 text-[10px] font-mono">
                            <span className="text-neutral-400">
                              SIGNATURE: <span className="text-rose-300 font-bold">{notif.author || '@yuveer (Founder & CEO)'}</span>
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 font-bold tracking-wider text-rose-400 group-hover:text-rose-300 transition">
                                <span>{isExpanded ? 'COLLAPSE' : 'READ'}</span>
                                {isExpanded ? (
                                  <ChevronUp className="w-3 h-3 text-rose-400" />
                                ) : (
                                  <ArrowRight className="w-3 h-3 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      );

                      return <div key={notif.id}>{directiveContent}</div>;
                    }

                    // ─── STANDARD NOTIFICATION CARD ───
                    const content = (
                      <div
                        onClick={() => handleMarkSingleRead(notif.id)}
                        className={`p-3.5 rounded-2xl transition-all duration-200 flex items-start gap-3.5 cursor-pointer relative overflow-hidden ${
                          notif.read
                            ? 'bg-zinc-950/70 hover:bg-zinc-900/80 border border-white/5 text-zinc-400 hover:text-zinc-200'
                            : 'bg-zinc-900 border border-white/20 hover:border-white/40 shadow-lg text-white'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${
                          notif.read 
                            ? 'bg-zinc-950 border-white/5 text-zinc-400' 
                            : 'bg-zinc-800 border-white/15 text-white'
                        }`}>
                          {getIcon(notif.type)}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <p className={`text-xs font-bold truncate ${notif.read ? 'text-zinc-400' : 'text-white'}`}>
                              {notif.title}
                            </p>
                            <span className="text-[9px] font-mono text-zinc-500 shrink-0">
                              {notif.timestamp}
                            </span>
                          </div>
                          <p className={`text-[11px] leading-relaxed line-clamp-2 ${notif.read ? 'text-zinc-500' : 'text-zinc-300'}`}>
                            {notif.message}
                          </p>
                        </div>

                        {/* Glowing Yellow Light for Unread Notifications Only */}
                        {!notif.read && (
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 mt-2 shadow-[0_0_10px_#f59e0b,0_0_18px_#fbbf24] animate-pulse" />
                        )}
                      </div>
                    );

                    return notif.link ? (
                      <Link
                        key={notif.id}
                        href={notif.link}
                        onClick={() => {
                          handleMarkSingleRead(notif.id);
                          setIsOpen(false);
                        }}
                        className="block"
                      >
                        {content}
                      </Link>
                    ) : (
                      <div key={notif.id}>{content}</div>
                    );
                  })
                ) : (
                  <div className="py-10 text-center space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-white/10 mx-auto flex items-center justify-center text-zinc-500">
                      <CheckCircle2 className="w-5 h-5 text-zinc-400" />
                    </div>
                    <p className="text-xs font-bold text-white">All Caught Up</p>
                    <p className="text-[11px] text-zinc-500 max-w-xs mx-auto font-mono">
                      {filterMode === 'unread' ? 'No pending unread alerts' : 'Notification history cleared'}
                    </p>
                  </div>
                )}
              </div>

              {/* Monochrome Footer */}
              <div className="p-3 bg-zinc-950 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Sovereign Telemetry Active
                </span>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-300 hover:text-white hover:underline flex items-center gap-1 font-semibold transition"
                >
                  <span>Matrix Hub</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
