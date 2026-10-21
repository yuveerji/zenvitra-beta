'use client';

import React, { use, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ZenChatComingSoon } from '@/components/chat/coming-soon/ZenChatComingSoon';
import { ZenChatMesh } from '@/components/chat/ZenChatMesh';

function DirectConversationContent({ conversationId }: { conversationId: string }) {
  const searchParams = useSearchParams();
  const isDevPreview = searchParams.get('preview') === 'mesh' || searchParams.get('dev') === 'true';

  if (isDevPreview) {
    return <ZenChatMesh initialConversationId={conversationId} />;
  }

  return <ZenChatComingSoon />;
}

export default function ChatConversationDirectPage({
  params
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const resolvedParams = use(params);
  const conversationId = decodeURIComponent(resolvedParams.conversationId);

  return (
    <Suspense fallback={<ZenChatComingSoon />}>
      <DirectConversationContent conversationId={conversationId} />
    </Suspense>
  );
}
