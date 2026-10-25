import React from 'react';
import { Metadata } from 'next';
import { WhatIsZenvitraClient } from '@/components/manifesto/WhatIsZenvitraClient';

export const metadata: Metadata = {
  title: 'WHAT IS ZENVITRA? — By Youth. For Youth.',
  description:
    'ZENVITRA is a youth-led digital platform and foundation built to bring young people together through technology, dialogue, diplomacy, creativity, collaboration, and real-world impact.',
  openGraph: {
    title: 'WHAT IS ZENVITRA? — By Youth. For Youth.',
    description:
      'Youth-led digital ecosystem and foundation connecting communication, debate, diplomacy, policy solutions, and social impact.',
    type: 'website',
    url: 'https://zenvitra.xyz/what-is-zenvitra',
  },
};

export default function WhatIsZenvitraPage() {
  return <WhatIsZenvitraClient />;
}
