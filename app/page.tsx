import React from 'react';
import { auth } from '@/lib/auth';
import PostRegisterPersonaModal from '@/components/auth/PostRegisterPersonaModal';
import HomeClient from '@/components/home/HomeClient';

export default async function HomePage() {
  const session = await auth();

  return (
    <>
      <PostRegisterPersonaModal />
      <HomeClient session={session} />
    </>
  );
}