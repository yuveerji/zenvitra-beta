import { Metadata } from 'next';
import { ZenSpaceView } from '@/components/space/ZenSpaceView';
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
    title: `${profile.displayName} (@${profile.username}) | ZEN.SPACE`,
    description: profile.bio,
    openGraph: {
      title: `${profile.displayName} (@${profile.username}) • ZEN.SPACE`,
      description: profile.bio,
      images: [profile.avatar],
    },
  };
}

export default async function SpaceUserPage({ params }: Props) {
  const { username } = await params;
  const cleanUser = (username || '').toLowerCase().replace('@', '').trim();
  return <ZenSpaceView username={cleanUser} />;
}
