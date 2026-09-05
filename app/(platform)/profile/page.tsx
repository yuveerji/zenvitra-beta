'use client';

import React from 'react';
import { UserProfileView } from '@/components/pulse/UserProfileView';

export default function RootProfilePage() {
  return (
    <div className="w-full min-h-screen bg-black text-white">
      <UserProfileView />
    </div>
  );
}
