'use client';

import React from 'react';
import { ZenPulsePlatformProvider } from '@/context/ZenPulsePlatformContext';
import { ZenChatPlatformProvider } from '@/context/ZenChatPlatformContext';
import { ZenEventsPlatformProvider } from '@/context/ZenEventsPlatformContext';
import { ZenPressPlatformProvider } from '@/context/ZenPressPlatformContext';
import { MunProvider } from '@/context/MunContext';

export function PlatformProviders({ session, children }: { session?: any; children: React.ReactNode }) {
  return (
    <ZenPulsePlatformProvider initialSession={session}>
      <ZenChatPlatformProvider>
        <ZenEventsPlatformProvider>
          <ZenPressPlatformProvider>
            <MunProvider>
              {children}
            </MunProvider>
          </ZenPressPlatformProvider>
        </ZenEventsPlatformProvider>
      </ZenChatPlatformProvider>
    </ZenPulsePlatformProvider>
  );
}

export default PlatformProviders;
