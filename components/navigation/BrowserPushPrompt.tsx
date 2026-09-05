'use client';

import React, { useState, useEffect } from 'react';
import { BellRing, Check, Smartphone, Laptop, X } from 'lucide-react';
import { 
  isBrowserNotificationSupported, 
  getBrowserNotificationPermission, 
  requestBrowserNotificationPermission 
} from '@/lib/browserNotifications';

export function BrowserPushPrompt() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [dismissed, setDismissed] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    if (isBrowserNotificationSupported()) {
      setPermission(getBrowserNotificationPermission());
    }
  }, []);

  if (!isBrowserNotificationSupported() || permission === 'granted' || dismissed) {
    return null;
  }

  const handleEnable = async () => {
    setIsRequesting(true);
    const newPerm = await requestBrowserNotificationPermission();
    setPermission(newPerm);
    setIsRequesting(false);
  };

  return (
    <div className="mx-3 my-2 p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-zinc-900 to-amber-500/5 border border-amber-500/25 text-left flex items-start gap-3 relative overflow-hidden">
      <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
        <BellRing className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-xs text-white flex items-center gap-1.5">
            <span>Device Push Alerts</span>
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="text-zinc-500 hover:text-zinc-300 p-0.5 cursor-pointer"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-[11px] text-zinc-400 leading-snug">
          Get real-time diplomatic dispatches &amp; event updates on this phone/laptop even when not on the tab.
        </p>

        <div className="flex items-center gap-2 pt-0.5">
          <button
            onClick={handleEnable}
            disabled={isRequesting}
            className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-mono text-[10px] font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <Check className="w-3 h-3" />
            <span>{isRequesting ? 'Enabling...' : 'Enable Device Alerts'}</span>
          </button>

          <span className="text-[9.5px] font-mono text-zinc-500 flex items-center gap-1">
            <Smartphone className="w-3 h-3" />
            <Laptop className="w-3 h-3" />
            <span>All Devices</span>
          </span>
        </div>
      </div>
    </div>
  );
}
