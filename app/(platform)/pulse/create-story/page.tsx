'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateStoryPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/pulse');
  }, [router]);

  return null;
}
