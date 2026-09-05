'use client';

import React, { useEffect, use } from 'react';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { UserProfileView } from '@/components/pulse/UserProfileView';

interface ProfileProps {
  params: Promise<{ username: string }>;
}

export default function ProfilePage({ params }: ProfileProps) {
  const { username } = use(params);
  const { setSelectedProfileUsername, currentUserUsername } = useZenPulse();

  useEffect(() => {
    if (username) {
      if (username === 'you' || username === 'me') {
        setSelectedProfileUsername(currentUserUsername);
      } else {
        setSelectedProfileUsername(username);
      }
    }
  }, [username, currentUserUsername, setSelectedProfileUsername]);

  return (
    <div className="w-full min-h-screen bg-black text-white">
      <UserProfileView />
    </div>
  );
}