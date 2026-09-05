import React from 'react';
import { Metadata } from 'next';
import { ZenDocsClient } from '@/components/docs/ZenDocsClient';

export const metadata: Metadata = {
  title: 'ZEN.DOCS — Sovereign Legislative & Resolution Studio | ZENVITRA',
  description: 'Co-author UN Draft Resolutions, draft Indian Parliamentary Bills, and publish diplomatic communiqués with cryptographic integrity.'
};

export default function DocsPage() {
  return <ZenDocsClient />;
}
