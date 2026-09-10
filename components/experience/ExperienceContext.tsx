'use client';

import React, { createContext, useContext, useState } from 'react';

export type UniverseAtmosphere = 'PORTAL' | 'PULSE' | 'CHAMBER' | 'MUN';

export type ParticleMorphState = 'VOID' | 'NOISE' | 'NETWORK' | 'LOGO' | 'CONSTELLATION' | 'CHAMBER_NODES';

interface ExperienceContextType {
  atmosphere: UniverseAtmosphere;
  setAtmosphere: (atm: UniverseAtmosphere) => void;
  particleState: ParticleMorphState;
  setParticleState: (state: ParticleMorphState) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  scrollProgress: number;
  setScrollProgress: (p: number) => void;
  currentAct: number;
  setCurrentAct: (act: number) => void;
}

const ExperienceContext = createContext<ExperienceContextType>({
  atmosphere: 'PORTAL',
  setAtmosphere: () => {},
  particleState: 'VOID',
  setParticleState: () => {},
  soundEnabled: false,
  setSoundEnabled: () => {},
  scrollProgress: 0,
  setScrollProgress: () => {},
  currentAct: 0,
  setCurrentAct: () => {},
});

export function ExperienceEngineProvider({ children }: { children: React.ReactNode }) {
  const [atmosphere, setAtmosphere] = useState<UniverseAtmosphere>('PORTAL');
  const [particleState, setParticleState] = useState<ParticleMorphState>('VOID');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [currentAct, setCurrentAct] = useState<number>(0);

  return (
    <ExperienceContext.Provider
      value={{
        atmosphere,
        setAtmosphere,
        particleState,
        setParticleState,
        soundEnabled,
        setSoundEnabled,
        scrollProgress,
        setScrollProgress,
        currentAct,
        setCurrentAct,
      }}
    >
      {children}
    </ExperienceContext.Provider>
  );
}

export const useExperienceEngine = () => useContext(ExperienceContext);
