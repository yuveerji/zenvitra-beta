'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { SecurityShieldModal } from '@/components/security/SecurityShieldModal';

export default function SettingsRoutePage() {
  const router = useRouter();
  const [securityShieldOpen, setSecurityShieldOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#030405] text-white flex items-center justify-center p-4">
      <SettingsModal
        isOpen={true}
        onClose={() => router.push('/pulse')}
        onOpenSecurityShield={() => setSecurityShieldOpen(true)}
      />
      <SecurityShieldModal
        isOpen={securityShieldOpen}
        onClose={() => setSecurityShieldOpen(false)}
      />
    </div>
  );
}
