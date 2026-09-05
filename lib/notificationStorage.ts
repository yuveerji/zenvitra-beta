/**
 * Zenvitra Persistent Reactive Notification Storage & Dispatcher
 * Persists read states, deleted states, and live alerts across page navigations and tabs.
 */

import { broadcastActivitySync, subscribeToActivitySync } from './reactiveActivityHub';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'security' | 'mun' | 'escrow' | 'pulse' | 'general' | 'event' | 'refund' | 'directive';
  priority?: 'NORMAL' | 'URGENT' | 'CONSTITUTIONAL';
  author?: string;
  link?: string;
  read: boolean;
  createdAt: number;
}

const LS_NOTIFICATIONS_KEY = 'zenvitra_notifications_store_v3';
const LS_READ_IDS_KEY = 'zenvitra_notifications_read_set_v3';

export const INITIAL_SEED_NOTIFICATIONS: NotificationItem[] = [];

export function getStoredNotifications(): NotificationItem[] {
  if (typeof window === 'undefined') return INITIAL_SEED_NOTIFICATIONS;

  try {
    const raw = localStorage.getItem(LS_NOTIFICATIONS_KEY);
    const readIdsRaw = localStorage.getItem(LS_READ_IDS_KEY);
    const readIds: Set<string> = new Set(readIdsRaw ? JSON.parse(readIdsRaw) : []);

    let items: NotificationItem[];
    if (!raw) {
      items = INITIAL_SEED_NOTIFICATIONS;
      localStorage.setItem(LS_NOTIFICATIONS_KEY, JSON.stringify(items));
    } else {
      items = JSON.parse(raw);
    }

    // Apply persistent read state
    return items.map((item) => ({
      ...item,
      read: item.read || readIds.has(item.id),
    }));
  } catch {
    return INITIAL_SEED_NOTIFICATIONS;
  }
}

export function saveStoredNotifications(items: NotificationItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LS_NOTIFICATIONS_KEY, JSON.stringify(items));
    
    // Also save read IDs set
    const readIds = items.filter((n) => n.read).map((n) => n.id);
    localStorage.setItem(LS_READ_IDS_KEY, JSON.stringify(readIds));

    broadcastActivitySync({
      source: 'profile',
      action: 'save',
      timestamp: Date.now(),
      metadata: { unreadCount: items.filter((n) => !n.read).length },
    });
  } catch (err) {
    console.error('Failed to save notifications:', err);
  }
}

export function markNotificationAsRead(id: string): NotificationItem[] {
  const current = getStoredNotifications();
  const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
  saveStoredNotifications(updated);
  return updated;
}

export function markAllNotificationsAsRead(): NotificationItem[] {
  const current = getStoredNotifications();
  const updated = current.map((n) => ({ ...n, read: true }));
  saveStoredNotifications(updated);
  return updated;
}

export function clearAllStoredNotifications(): NotificationItem[] {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LS_NOTIFICATIONS_KEY, JSON.stringify([]));
      broadcastActivitySync({
        source: 'profile',
        action: 'delete',
        timestamp: Date.now(),
      });
    } catch {}
  }
  return [];
}

export function pushLiveNotification(data: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>): NotificationItem {
  const newItem: NotificationItem = {
    ...data,
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: Date.now(),
    read: false,
  };

  const current = getStoredNotifications();
  const updated = [newItem, ...current.filter((n) => n.id !== newItem.id)];
  saveStoredNotifications(updated);
  return newItem;
}
