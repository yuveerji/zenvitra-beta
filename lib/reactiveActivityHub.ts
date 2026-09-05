/**
 * Zenvitra Global Reactive Activity Hub
 * Broadcasts and listens for immediate, real-time platform state mutations
 * across components, contexts, and browser tabs.
 */

export const ZENVITRA_SYNC_EVENT = 'zenvitra_activity_sync';

export interface ActivitySyncPayload {
  source: 'post' | 'flux' | 'mun_reg' | 'event' | 'bookmark' | 'profile' | 'press' | 'escrow' | 'chamber_invite';
  action: 'create' | 'update' | 'delete' | 'register' | 'rsvp' | 'save' | 'send_invites';
  timestamp: number;
  metadata?: Record<string, any>;
}

export function broadcastActivitySync(payload: ActivitySyncPayload) {
  if (typeof window === 'undefined') return;

  try {
    const event = new CustomEvent<ActivitySyncPayload>(ZENVITRA_SYNC_EVENT, {
      detail: payload,
    });
    window.dispatchEvent(event);

    // Also trigger cross-tab storage ping
    localStorage.setItem('zenvitra_last_activity_ping', JSON.stringify(payload));
  } catch (err) {
    console.error('Failed to broadcast activity sync:', err);
  }
}

export function subscribeToActivitySync(callback: (payload?: ActivitySyncPayload) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = (e: Event) => {
    const custom = e as CustomEvent<ActivitySyncPayload>;
    callback(custom.detail);
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === 'zenvitra_last_activity_ping' || e.key?.startsWith('zenvitra_') || e.key?.startsWith('zenpulse_') || e.key?.startsWith('mun_')) {
      try {
        const payload = e.newValue ? JSON.parse(e.newValue) : undefined;
        callback(payload);
      } catch {
        callback();
      }
    }
  };

  const handleWindowFocus = () => {
    callback();
  };

  window.addEventListener(ZENVITRA_SYNC_EVENT, handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);
  window.addEventListener('focus', handleWindowFocus);

  return () => {
    window.removeEventListener(ZENVITRA_SYNC_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
    window.removeEventListener('focus', handleWindowFocus);
  };
}
