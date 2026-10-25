'use client';

import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ZenMunProvider, useZenMun } from '@/context/ZenMunContext';
import { PreSessionSetupView } from './PreSessionSetupView';
import { ZenMunChairConsole } from './ZenMunChairConsole';
import { RollCallModal } from './RollCallModal';
import { RaiseMotionModal } from './RaiseMotionModal';
import { DocumentsModal } from './DocumentsModal';
import { ScoreboardModal } from './ScoreboardModal';
import { SettingsModal } from './SettingsModal';
import { ChatDrawer } from './ChatDrawer';
import { QrCodeOverlay } from './QrCodeOverlay';
import { TutorialEngine } from './TutorialEngine';

interface ZenMunMasterDaisProps {
  initialView?: 'setup' | 'chair';
  onExit?: () => void;
}

function DaisInner({ initialView = 'setup', onExit }: ZenMunMasterDaisProps) {
  const router = useRouter();
  const { session } = useZenMun();

  // If initialView is requested as 'chair' but committee has no roster, start with 'setup' first
  const [view, setView] = useState<'setup' | 'chair'>(() => {
    if (initialView === 'chair') {
      if (session && session.roster && session.roster.length > 0) {
        return 'chair';
      }
      return 'setup';
    }
    return 'setup';
  });

  const handleBackToHub = () => {
    if (onExit) {
      onExit();
    } else {
      router.push('/dias');
    }
  };

  return (
    <>
      {view === 'setup' ? (
        <PreSessionSetupView
          onStartSession={() => setView('chair')}
          onBack={handleBackToHub}
        />
      ) : (
        <ZenMunChairConsole onExit={handleBackToHub} />
      )}

      {/* Global Dais Modals & Overlays */}
      <RollCallModal />
      <RaiseMotionModal />
      <DocumentsModal />
      <ScoreboardModal />
      <SettingsModal />
      <ChatDrawer />
      <QrCodeOverlay />
      <TutorialEngine />
    </>
  );
}

export function ZenMunMasterDais({ initialView = 'setup', onExit }: ZenMunMasterDaisProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#08090C] flex items-center justify-center font-serif text-white">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C5A46D] to-[#9E7D47] text-[#08090C] font-black flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(197,164,109,0.3)]">
              🏛️
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C5A46D]">
              Connecting to Zenvitra Dais...
            </span>
          </div>
        </div>
      }
    >
      <ZenMunProvider>
        <DaisInner initialView={initialView} onExit={onExit} />
      </ZenMunProvider>
    </Suspense>
  );
}

export default ZenMunMasterDais;
