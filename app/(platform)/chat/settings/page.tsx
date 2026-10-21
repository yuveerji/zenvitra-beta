'use client';

import React, { Suspense } from 'react';
import { ZenChatComingSoon } from '@/components/chat/coming-soon/ZenChatComingSoon';

export default function ChatSettingsPage() {
  return (
    <Suspense fallback={<ZenChatComingSoon />}>
      <ZenChatComingSoon />
    </Suspense>
  );
}
