/**
 * Zenvitra Persistent Reactive Notification Storage & Dispatcher
 * Strictly Zero Seeded Notifications.
 * Persists read states, deleted states, and live alerts across page navigations, code changes, and tabs.
 */

import { broadcastActivitySync } from './reactiveActivityHub';

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
  category?: string;
  platform?: 'press' | 'news' | 'pulse' | 'system';
}

const LS_NOTIFICATIONS_KEY = 'zenvitra_notifications_store_v3';
const LS_READ_IDS_KEY = 'zenvitra_notifications_read_set_v3';
const LS_DELETED_IDS_KEY = 'zenvitra_notifications_deleted_set_v3';

// STRICT ZERO SEEDED NOTIFICATIONS LAW
export const INITIAL_SEED_NOTIFICATIONS: NotificationItem[] = [];

function getReadIdsSet(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(LS_READ_IDS_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function getDeletedIdsSet(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(LS_DELETED_IDS_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export function getStoredNotifications(): NotificationItem[] {
  if (typeof window === 'undefined') return INITIAL_SEED_NOTIFICATIONS;

  try {
    const raw = localStorage.getItem(LS_NOTIFICATIONS_KEY);
    const readIds = getReadIdsSet();
    const deletedIds = getDeletedIdsSet();

    let items: NotificationItem[];
    if (!raw) {
      items = INITIAL_SEED_NOTIFICATIONS;
      localStorage.setItem(LS_NOTIFICATIONS_KEY, JSON.stringify(items));
    } else {
      items = JSON.parse(raw);
    }

    if (!Array.isArray(items)) {
      items = [];
    }

    // 1. Strictly filter out any items the user has explicitly deleted
    const nonDeleted = items.filter((item) => item && item.id && !deletedIds.has(item.id));

    // 2. Apply persistent read state (a read notification STAYS read and is NOT removed until deleted)
    return nonDeleted.map((item) => ({
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
    const deletedIds = getDeletedIdsSet();
    const cleanItems = items.filter((n) => n && n.id && !deletedIds.has(n.id));

    localStorage.setItem(LS_NOTIFICATIONS_KEY, JSON.stringify(cleanItems));
    
    // Persist read IDs set so read states are NEVER lost across code changes or reloads
    const readIds = getReadIdsSet();
    cleanItems.filter((n) => n.read).forEach((n) => readIds.add(n.id));
    localStorage.setItem(LS_READ_IDS_KEY, JSON.stringify(Array.from(readIds)));

    broadcastActivitySync({
      source: 'profile',
      action: 'save',
      timestamp: Date.now(),
      metadata: { unreadCount: cleanItems.filter((n) => !n.read).length },
    });
  } catch (err) {
    console.error('Failed to save notifications:', err);
  }
}

/**
 * Marks a notification as read.
 * The notification STAYS in the notification bar, marked read, until the user clicks Delete.
 */
export function markNotificationAsRead(id: string): NotificationItem[] {
  if (typeof window === 'undefined') return [];
  const readIds = getReadIdsSet();
  readIds.add(id);
  localStorage.setItem(LS_READ_IDS_KEY, JSON.stringify(Array.from(readIds)));

  // If it's a directive, also update directive read store
  if (id.startsWith('directive_')) {
    try {
      const raw = localStorage.getItem('zenvitra_read_directives_v1');
      const readDirectives: string[] = raw ? JSON.parse(raw) : [];
      if (!readDirectives.includes(id)) {
        readDirectives.push(id);
        localStorage.setItem('zenvitra_read_directives_v1', JSON.stringify(readDirectives));
      }
    } catch {}
  }

  const current = getStoredNotifications();
  const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
  saveStoredNotifications(updated);
  return updated;
}

/**
 * Marks all notifications as read.
 * All notifications STAY in the notification bar, but their unread status is cleared.
 */
export function markAllNotificationsAsRead(): NotificationItem[] {
  if (typeof window === 'undefined') return [];
  const current = getStoredNotifications();
  const readIds = getReadIdsSet();
  current.forEach((n) => readIds.add(n.id));
  localStorage.setItem(LS_READ_IDS_KEY, JSON.stringify(Array.from(readIds)));

  // Also mark any directive read
  try {
    const raw = localStorage.getItem('zenvitra_read_directives_v1');
    const readDirectives: string[] = raw ? JSON.parse(raw) : [];
    current.filter(n => n.id.startsWith('directive_')).forEach(n => {
      if (!readDirectives.includes(n.id)) readDirectives.push(n.id);
    });
    localStorage.setItem('zenvitra_read_directives_v1', JSON.stringify(readDirectives));
  } catch {}

  const updated = current.map((n) => ({ ...n, read: true }));
  saveStoredNotifications(updated);
  return updated;
}

/**
 * Explicitly deletes a notification.
 * This is the ONLY action that permanently removes the notification from the bar.
 */
export function deleteStoredNotification(id: string): NotificationItem[] {
  if (typeof window === 'undefined') return [];

  // Add to deleted set so it can NEVER be re-seeded or resurrected
  const deletedIds = getDeletedIdsSet();
  deletedIds.add(id);
  localStorage.setItem(LS_DELETED_IDS_KEY, JSON.stringify(Array.from(deletedIds)));

  // If directive, dismiss it permanently
  if (id.startsWith('directive_')) {
    try {
      const raw = localStorage.getItem('zenvitra_dismissed_directives_v1');
      const dismissed: string[] = raw ? JSON.parse(raw) : [];
      if (!dismissed.includes(id)) {
        dismissed.push(id);
        localStorage.setItem('zenvitra_dismissed_directives_v1', JSON.stringify(dismissed));
      }
    } catch {}
  }

  const current = getStoredNotifications();
  const updated = current.filter((n) => n.id !== id);
  saveStoredNotifications(updated);
  return updated;
}

/**
 * Clears and deletes all notifications currently in the bar.
 */
export function clearAllStoredNotifications(): NotificationItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getStoredNotifications();
    const deletedIds = getDeletedIdsSet();
    current.forEach((n) => deletedIds.add(n.id));
    localStorage.setItem(LS_DELETED_IDS_KEY, JSON.stringify(Array.from(deletedIds)));
    localStorage.setItem(LS_NOTIFICATIONS_KEY, JSON.stringify([]));

    // Also dismiss all active directives
    const dismissed: string[] = Array.from(deletedIds).filter(id => id.startsWith('directive_'));
    localStorage.setItem('zenvitra_dismissed_directives_v1', JSON.stringify(dismissed));

    broadcastActivitySync({
      source: 'profile',
      action: 'delete',
      timestamp: Date.now(),
      metadata: { unreadCount: 0 },
    });
  } catch {}
  return [];
}

/**
 * Pushes a new live notification into storage.
 * Automatically checks whether this alert was previously deleted to prevent re-populating.
 */
export function pushLiveNotification(data: Omit<NotificationItem, 'id' | 'createdAt' | 'read'> & { id?: string }): NotificationItem | null {
  if (typeof window === 'undefined') return null;

  const notifId = data.id || `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  
  // Guard against re-pushing deleted alerts
  const deletedIds = getDeletedIdsSet();
  if (deletedIds.has(notifId)) {
    return null;
  }

  const newItem: NotificationItem = {
    ...data,
    id: notifId,
    createdAt: Date.now(),
    read: false,
  };

  const current = getStoredNotifications();
  // Avoid duplicate notifications with identical title & message within recent buffer
  const isDuplicate = current.some(
    (n) => n.title === newItem.title && n.message === newItem.message && Date.now() - n.createdAt < 30000
  );
  if (isDuplicate) {
    return null;
  }

  const updated = [newItem, ...current.filter((n) => n.id !== newItem.id)];
  saveStoredNotifications(updated);

  window.dispatchEvent(new CustomEvent('zenvitra_notification_dispatched', { detail: newItem }));
  return newItem;
}
