import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ZEN.CHAT — The Next Chapter of Connection | ZENVITRA',
  description:
    'The upcoming communication ecosystem of ZENVITRA. Dedicated workspaces for MUN conferences, committee channels, official announcements, and sovereign youth networking.',
  openGraph: {
    title: 'ZEN.CHAT — Your People. Your Space. Your Conversations.',
    description:
      'The upcoming communication ecosystem of ZENVITRA. Connecting Model UN conferences, committee channels, and youth communities.',
    url: 'https://zenvitra.org/chat',
    siteName: 'ZENVITRA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZEN.CHAT — The Next Chapter of Connection',
    description: 'The upcoming communication ecosystem of ZENVITRA.',
    creator: '@zenvitra_',
  },
};

export default function ZenChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
