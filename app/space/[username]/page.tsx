import { Metadata } from 'next';
import { ZenSpacePaused } from '@/components/space/ZenSpacePaused';
import { getZenSpaceProfile } from '@/lib/spaceStorage';

interface Props {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const cleanUser = (username || '').toLowerCase().replace('@', '').trim();
  const profile = getZenSpaceProfile(cleanUser);

  return {
    title: `ZEN.SPACE Paused — Coming Nov 25 | ${profile.displayName || 'ZENVITRA'}`,
    description: 'ZEN.SPACE is temporarily paused until November 25, 2026. Something special is coming soon.',
    openGraph: {
      title: `ZEN.SPACE Paused — Resuming Nov 25, 2026`,
      description: 'Something special coming soon to ZEN.SPACE.',
      images: profile.avatar ? [profile.avatar] : ['/brand/logo.png'],
    },
  };
}

export default async function SpaceUserPage({ params }: Props) {
  const { username } = await params;
  const cleanUser = (username || '').toLowerCase().replace('@', '').trim();
  return <ZenSpacePaused username={cleanUser} />;
}
