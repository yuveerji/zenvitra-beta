import { Metadata } from 'next';
import { ZenSpacePaused } from '@/components/space/ZenSpacePaused';

export const metadata: Metadata = {
  title: 'ZEN.SPACE Paused — Resuming Nov 25, 2026 | ZENVITRA',
  description: 'ZEN.SPACE is temporarily paused until November 25, 2026. Something special is coming soon.',
  openGraph: {
    title: 'ZEN.SPACE Paused — Resuming Nov 25, 2026',
    description: 'Something special coming soon to ZEN.SPACE.',
    images: ['/brand/logo.png'],
  },
};

export default function SpaceIndexPage() {
  return <ZenSpacePaused username="yuveer" />;
}
