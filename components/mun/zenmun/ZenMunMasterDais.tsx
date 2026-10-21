'use client';

import React, { useState } from 'react';
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
}

function DaisInner({ initialView = 'chair' }: ZenMunMasterDaisProps) {
  const [view, setView] = useState<'setup' | 'chair'>(initialView);

  return (
    <>
      {view === 'setup' ? (
        <PreSessionSetupView
          onStartSession={() => setView('chair')}
          onBack={() => setView('chair')}
        />
      ) : (
        <ZenMunChairConsole />
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

export function ZenMunMasterDais({ initialView = 'chair' }: ZenMunMasterDaisProps) {
  return (
    <ZenMunProvider>
      <DaisInner initialView={initialView} />
    </ZenMunProvider>
  );
}

export default ZenMunMasterDais;
