'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  Check, 
  Sparkles, 
  ShieldAlert, 
  Radio, 
  Calendar, 
  CreditCard, 
  Trash2, 
  ExternalLink,
  MessageSquare,
  Award,
  Filter,
  Crown,
  Megaphone,
  ArrowRight,
  ChevronUp
} from 'lucide-react';
import {
  NotificationItem,
  getStoredNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearAllStoredNotifications,
} from '@/lib/notificationStorage';
import { subscribeToActivitySync } from '@/lib/reactiveActivityHub';
import { getFounderDirective, type FounderDirective } from '@/lib/founderControl';

type FilterCategory = 'all' | 'directive' | 'event' | 'refund' | 'pulse' | 'mun' | 'security';

/** Convert active founder directives into notification items */
function getDirectiveNotifications(): NotificationItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const directive = getFounderDirective();
    if (!directive || !directive.isActive) return [];

    const directiveNotif: NotificationItem = {
      id: `directive_${directive.id}`,
      title: directive.title,
      message: directive.body,
      timestamp: directive.updatedAt ? new Date(directive.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Active',
      type: 'directive',
      priority: directive.priority,
      author: directive.author,
      read: false,
      createdAt: directive.updatedAt ? new Date(directive.updatedAt).getTime() : Date.now(),
    };

    // Check if user already read this directive
    try {
      const readDirectives = JSON.parse(localStorage.getItem('zenvitra_read_directives_v1') || '[]');
      if (readDirectives.includes(directiveNotif.id)) {
        directiveNotif.read = true;
      }
    } catch {}

    return [directiveNotif];
  } catch {
    return [];
  }
}

export default function NotificationBell() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('all');
  const [expandedDirectiveId, setExpandedDirectiveId] = useState<string | null>(null);

  const refreshNotifications = useCallback(() => {
    const stored = getStoredNotifications();
    const directives = getDirectiveNotifications();
    // Merge directives at the top, avoiding duplicates
    const directiveIds = new Set(directives.map(d => d.id));
    const mergedNotifs = [...directives, ...stored.filter(n => !directiveIds.has(n.id))];
    setNotifications(mergedNotifs);
  }, []);

  useEffect(() => {
    refreshNotifications();

    const unsubscribe = subscribeToActivitySync(() => {
      refreshNotifications();
    });

    const handleStorage = (e: StorageEvent) => {
      if (e.key?.includes('notification') || e.key?.includes('zenvitra')) {
        refreshNotifications();
      }
    };

    // Also listen for directive changes
    const handleDirectiveChange = () => refreshNotifications();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('zenvitra_directive_update', handleDirectiveChange);
    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('zenvitra_directive_update', handleDirectiveChange);
    };
  }, [refreshNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = () => {
    const updated = markAllNotificationsAsRead();
    // Also mark directives as read
    const directiveIds = notifications.filter(n => n.type === 'directive').map(n => n.id);
    try {
      const existingRead = JSON.parse(localStorage.getItem('zenvitra_read_directives_v1') || '[]');
      const merged = [...new Set([...existingRead, ...directiveIds])];
      localStorage.setItem('zenvitra_read_directives_v1', JSON.stringify(merged));
    } catch {}
    refreshNotifications();
  };

  const handleClearAll = () => {
    const cleared = clearAllStoredNotifications();
    // Also mark directives read
    const directiveIds = notifications.filter(n => n.type === 'directive').map(n => n.id);
    try {
      const existingRead = JSON.parse(localStorage.getItem('zenvitra_read_directives_v1') || '[]');
      const merged = [...new Set([...existingRead, ...directiveIds])];
      localStorage.setItem('zenvitra_read_directives_v1', JSON.stringify(merged));
    } catch {}
    refreshNotifications();
  };

  const handleNotificationClick = (item: NotificationItem) => {
    if (!item.read) {
      if (item.type === 'directive') {
        // Persist directive read state
        try {
          const existingRead = JSON.parse(localStorage.getItem('zenvitra_read_directives_v1') || '[]');
          if (!existingRead.includes(item.id)) {
            existingRead.push(item.id);
            localStorage.setItem('zenvitra_read_directives_v1', JSON.stringify(existingRead));
          }
        } catch {}
        refreshNotifications();
      } else {
        const updated = markNotificationAsRead(item.id);
        setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));
      }
    }
    if (item.link) {
      setIsOpen(false);
      router.push(item.link);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'directive') return n.type === 'directive';
    if (selectedFilter === 'event') return n.type === 'event' || n.type === 'refund';
    if (selectedFilter === 'refund') return n.type === 'refund';
    if (selectedFilter === 'pulse') return n.type === 'pulse';
    if (selectedFilter === 'mun') return n.type === 'mun';
    if (selectedFilter === 'security') return n.type === 'security' || n.type === 'escrow';
    return true;
  });

  const getIconForType = (type: NotificationItem['type']) => {
    switch (type) {
      case 'directive':
        return <Crown className="w-3.5 h-3.5 text-rose-400" />;
      case 'refund':
        return <CreditCard className="w-3.5 h-3.5 text-emerald-400" />;
      case 'event':
        return <Calendar className="w-3.5 h-3.5 text-amber-400" />;
      case 'pulse':
        return <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />;
      case 'mun':
        return <Award className="w-3.5 h-3.5 text-indigo-400" />;
      case 'security':
      case 'escrow':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-neutral-400" />;
    }
  };

  return (
    <div className="relative inline-block">
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-full border border-white/10 bg-white/[0.03] text-neutral-300 hover:text-white hover:border-white/30 transition flex items-center justify-center cursor-pointer"
        aria-label="Toggle notifications drawer"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-400 text-black font-mono text-[9px] font-bold flex items-center justify-center shadow-[0_0_12px_rgba(251,191,36,0.6)] animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Drawer */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 top-full mt-3 w-80 sm:w-[26rem] rounded-3xl bg-[#07080d]/95 border border-white/15 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-50 p-5 sm:p-6 space-y-4 font-sans animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm text-white">System Feed &amp; Alerts</span>
                {unreadCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-[9px] font-mono font-bold text-amber-300">
                    {unreadCount} NEW
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-mono text-neutral-400">
                    ALL READ
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                    className="font-mono text-[10px] text-neutral-400 hover:text-white transition flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    <span>Read all</span>
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="p-1 text-neutral-500 hover:text-rose-400 transition rounded-lg hover:bg-rose-500/10 cursor-pointer"
                    title="Clear all alerts"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px] font-mono">
              {[
                { id: 'all', label: 'All' },
                { id: 'directive', label: '👑 Directives' },
                { id: 'event', label: 'Convenings & Refunds' },
                { id: 'pulse', label: 'Pulse' },
                { id: 'mun', label: 'Chambers' },
                { id: 'security', label: 'Security' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id as FilterCategory)}
                  className={`px-2.5 py-1 rounded-full border whitespace-nowrap transition cursor-pointer ${
                    selectedFilter === f.id
                      ? 'bg-white text-black font-bold border-white'
                      : 'bg-white/[0.04] text-neutral-400 border-white/5 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Notification List */}
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 select-none">
              {filteredNotifications.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-white/5 mx-auto flex items-center justify-center text-neutral-500">
                    <Bell className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-neutral-400 font-mono">No active alerts in this stream.</p>
                </div>
              ) : (
                filteredNotifications.map((n) => {
                  // ─── DIRECTIVE: RED BANNER CARD ───
                  if (n.type === 'directive') {
                    const isExpanded = expandedDirectiveId === n.id;

                    return (
                      <div
                        key={n.id}
                        onClick={() => {
                          setExpandedDirectiveId(isExpanded ? null : n.id);
                          handleNotificationClick(n);
                        }}
                        className={`p-4 rounded-2xl border transition-all space-y-3 cursor-pointer relative overflow-hidden group ${
                          !n.read
                            ? 'bg-gradient-to-br from-rose-950/80 via-rose-950/40 to-[#0a0608] border-rose-500/40 hover:border-rose-400/60 shadow-[0_0_25px_rgba(244,63,94,0.15)]'
                            : 'bg-rose-950/20 border-rose-500/15 hover:border-rose-500/30'
                        }`}
                      >
                        {/* Red top accent bar */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-rose-500 via-red-400 to-rose-600" />

                        {!n.read && (
                          <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-rose-400 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                        )}

                        {/* Tag row */}
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 shadow-[0_0_6px_rgba(244,63,94,0.5)]" />
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-[8px] font-mono font-bold tracking-wider text-rose-300 uppercase">
                            EXECUTIVE DIRECTIVE • {n.priority || 'CONSTITUTIONAL'}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className={`font-display font-black text-[13px] leading-snug tracking-tight ${!n.read ? 'text-white' : 'text-neutral-300'}`}>
                          {n.title}
                        </h4>

                        {/* Body - Full detailed message when expanded */}
                        <p className={`text-[11px] leading-relaxed font-sans text-neutral-300/90 font-light ${isExpanded ? 'whitespace-pre-wrap' : 'line-clamp-3'}`}>
                          {n.message}
                        </p>

                        {/* Signature & Status / Read Button */}
                        <div className="flex items-center justify-between pt-2 border-t border-rose-500/20 text-[10px] font-mono">
                          <span className="text-neutral-400">
                            SIGNATURE: <span className="text-rose-300 font-bold">{n.author || '@yuveer (Founder & CEO)'}</span>
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
                  }

                  // ─── STANDARD NOTIFICATION CARD ───
                  return (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-3.5 rounded-2xl border transition-all space-y-1.5 cursor-pointer relative overflow-hidden group ${
                        !n.read
                          ? 'bg-gradient-to-r from-amber-500/10 via-neutral-900 to-neutral-900 border-amber-500/30 hover:border-amber-400/50 shadow-md'
                          : 'bg-neutral-950/60 border-white/5 hover:border-white/15 text-neutral-400'
                      }`}
                    >
                      {!n.read && (
                        <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-amber-400" />
                      )}

                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded-md bg-white/5 border border-white/10 shrink-0">
                          {getIconForType(n.type)}
                        </div>
                        <span className={`font-display font-bold text-xs truncate ${!n.read ? 'text-white' : 'text-neutral-300'}`}>
                          {n.title}
                        </span>
                      </div>

                      <p className="text-[11px] leading-relaxed font-sans text-neutral-300 font-light pl-6">
                        {n.message}
                      </p>

                      <div className="flex items-center justify-between pt-1 pl-6 text-[10px] font-mono text-neutral-500">
                        <span>{n.timestamp || 'Just now'}</span>
                        {n.link && (
                          <span className="flex items-center gap-1 text-cyan-400 group-hover:underline">
                            <span>View Details</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}