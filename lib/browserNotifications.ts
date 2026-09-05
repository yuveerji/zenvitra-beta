/**
 * Zenvitra Cross-Device Browser Push Notifications Engine
 * Uses the Web Notifications API and Service Workers for cross-device alerts.
 */

export function isBrowserNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getBrowserNotificationPermission(): NotificationPermission {
  if (!isBrowserNotificationSupported()) return 'denied';
  return Notification.permission;
}

export async function requestBrowserNotificationPermission(): Promise<NotificationPermission> {
  if (!isBrowserNotificationSupported()) {
    console.warn('[NOTIFICATIONS] Browser does not support Web Notifications API');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      sendNativeBrowserNotification('Zenvitra Sovereign Matrix', {
        body: 'Real-time diplomatic telemetry and alerts are now active on this device.',
        icon: '/icons/icon-192.png',
        tag: 'zenvitra-welcome-notification',
      });
    }
    return permission;
  } catch (err) {
    console.error('[NOTIFICATIONS] Permission request failed:', err);
    return 'denied';
  }
}

export function sendNativeBrowserNotification(
  title: string,
  options?: {
    body?: string;
    icon?: string;
    badge?: string;
    tag?: string;
    link?: string;
  }
): boolean {
  if (!isBrowserNotificationSupported()) return false;
  if (Notification.permission !== 'granted') return false;

  try {
    const notif = new Notification(title, {
      body: options?.body || 'New live update on Zenvitra network',
      icon: options?.icon || '/icons/icon-192.png',
      badge: options?.badge || '/icons/icon-192.png',
      tag: options?.tag || `zenvitra_${Date.now()}`,
    });

    if (options?.link) {
      notif.onclick = () => {
        window.focus();
        window.location.href = options.link!;
      };
    }

    return true;
  } catch (err) {
    console.warn('[NOTIFICATIONS] Native dispatch skipped or blocked:', err);
    return false;
  }
}
