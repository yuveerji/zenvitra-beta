'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ZenChatPlatformProvider } from '@/context/ZenChatPlatformContext';
import { MunProvider } from '@/context/MunContext';
import { MockModeBanner } from '@/components/ui/MockModeBanner';
import { MunInviteModal } from '@/components/mun/MunInviteModal';
import { PWAInstallPrompt } from '@/components/ui/PWAInstallPrompt';
import { ContentProtectionProvider } from '@/components/security/ContentProtectionProvider';
import { MaintenanceGate } from '@/components/maintenance/MaintenanceGate';

export function AppProviders({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event?.reason;
      // Suppress unhandled event rejections (e.g. from aborted fetches or event callbacks)
      if (
        reason instanceof Event ||
        (reason && typeof reason === 'object' && ('target' in reason || 'isTrusted' in reason || reason.constructor?.name === 'Event'))
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Automatic Supabase Activity Pulse:
    // Fires once on initial startup (localhost or zenvitra.xyz), and then every 30 minutes
    // ONLY while the website tab is open in the browser. Zero background CLI processes left running.
    const triggerSupabasePulse = () => {
      try {
        const currentHost = typeof window !== 'undefined' ? window.location.host : '';
        fetch('/api/supabase-pulse', { method: 'GET', cache: 'no-store' })
          .then((res) => res.json())
          .then((data) => {
            if (process.env.NODE_ENV === 'development') {
              console.log(`[SUPABASE-PULSE] [${currentHost}] Keepalive hit sent to Supabase:`, data?.status);
            }
          })
          .catch(() => {});
      } catch (_) {}
    };

    // 1. Hit on website start (1s after mount)
    const initTimer = setTimeout(triggerSupabasePulse, 1000);
    // 2. Hit every 30 minutes while localhost:3000 or zenvitra.xyz is open
    const intervalTimer = setInterval(triggerSupabasePulse, 30 * 60 * 1000);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      clearTimeout(initTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  return (
    <AuthProvider>
      <LanguageProvider>
        <ZenChatPlatformProvider>
          <MunProvider>
            <ContentProtectionProvider>
              <MaintenanceGate>
                {children}
                <MockModeBanner />
                <MunInviteModal />
                <PWAInstallPrompt />
              </MaintenanceGate>
            </ContentProtectionProvider>
          </MunProvider>
        </ZenChatPlatformProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default AppProviders;
