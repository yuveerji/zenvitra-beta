'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  JourneySession,
  JourneyStepId,
  StepDefinition,
  DemoRole,
  DemoPersonaProfile,
  JOURNEY_STEPS,
  JOURNEY_STORAGE_KEY,
  createInitialJourneySession,
  calculateProgress,
  transitionJourney,
  DEMO_PERSONAS,
} from '@/lib/test-node/journeyStateMachine';
import { useTestNode } from '@/context/TestNodeContext';

interface JourneyContextType {
  session: JourneySession;
  currentStep: StepDefinition;
  nextStep: StepDefinition | null;
  prevStep: StepDefinition | null;
  progressPercentage: number;
  activeRole: DemoRole;
  activePersona: DemoPersonaProfile;
  isGuidedActive: boolean;

  // State transitions
  startGuidedDemo: () => void;
  setMode: (mode: 'GUIDED' | 'FREE_EXPLORE') => void;
  setRole: (role: DemoRole) => void;
  completeCurrentStep: () => void;
  skipCurrentStep: () => void;
  goBackStep: () => void;
  advanceStep: () => void;
  jumpToStep: (stepId: JourneyStepId) => void;
  recordInteraction: (interactions: Partial<JourneySession['interactions']>) => void;
  resetJourney: () => void;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<JourneySession>(createInitialJourneySession);
  const [isLoaded, setIsLoaded] = useState(false);
  const testNode = useTestNode();

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(JOURNEY_STORAGE_KEY);
      if (stored) {
        const parsed: JourneySession = JSON.parse(stored);
        if (parsed.sessionId && parsed.currentStepId) {
          setSession(parsed);
        }
      }
    } catch (e) {
      console.warn('[JOURNEY_STORAGE_LOAD_ERROR]', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.warn('[JOURNEY_STORAGE_SAVE_ERROR]', e);
    }
  }, [session, isLoaded]);

  const currentStep = JOURNEY_STEPS.find((s) => s.id === session.currentStepId) || JOURNEY_STEPS[0];
  const currentIndex = JOURNEY_STEPS.findIndex((s) => s.id === session.currentStepId);
  const nextStep = currentIndex < JOURNEY_STEPS.length - 1 ? JOURNEY_STEPS[currentIndex + 1] : null;
  const prevStep = currentIndex > 0 ? JOURNEY_STEPS[currentIndex - 1] : null;
  const progressPercentage = calculateProgress(session);

  const startGuidedDemo = useCallback(() => {
    setSession((prev) => transitionJourney(prev, { type: 'START_GUIDED_DEMO' }));
  }, []);

  const setMode = useCallback((mode: 'GUIDED' | 'FREE_EXPLORE') => {
    setSession((prev) => transitionJourney(prev, { type: 'SWITCH_MODE', payload: { mode } }));
  }, []);

  const setRole = useCallback((role: DemoRole) => {
    setSession((prev) => transitionJourney(prev, { type: 'SET_ROLE', payload: { role } }));
    const persona = DEMO_PERSONAS[role];
    if (persona?.id && testNode.switchPersona) {
      testNode.switchPersona(persona.id);
    }
  }, [testNode]);

  const completeCurrentStep = useCallback(() => {
    setSession((prev) => transitionJourney(prev, { type: 'COMPLETE_STEP' }));
  }, []);

  const skipCurrentStep = useCallback(() => {
    setSession((prev) => transitionJourney(prev, { type: 'SKIP_STEP' }));
  }, []);

  const goBackStep = useCallback(() => {
    setSession((prev) => transitionJourney(prev, { type: 'GO_BACK_STEP' }));
  }, []);

  const advanceStep = useCallback(() => {
    setSession((prev) => transitionJourney(prev, { type: 'ADVANCE_STEP' }));
  }, []);

  const jumpToStep = useCallback((stepId: JourneyStepId) => {
    setSession((prev) => transitionJourney(prev, { type: 'JUMP_TO_STEP', payload: { stepId } }));
  }, []);

  const recordInteraction = useCallback((interactions: Partial<JourneySession['interactions']>) => {
    setSession((prev) =>
      transitionJourney(prev, {
        type: 'RECORD_INTERACTION',
        payload: interactions,
      })
    );
  }, []);

  const resetJourney = useCallback(() => {
    const fresh = createInitialJourneySession();
    setSession(fresh);
    localStorage.removeItem(JOURNEY_STORAGE_KEY);
  }, []);

  return (
    <JourneyContext.Provider
      value={{
        session,
        currentStep,
        nextStep,
        prevStep,
        progressPercentage,
        activeRole: session.activeRole,
        activePersona: session.activePersona,
        isGuidedActive: session.mode === 'GUIDED',
        startGuidedDemo,
        setMode,
        setRole,
        completeCurrentStep,
        skipCurrentStep,
        goBackStep,
        advanceStep,
        jumpToStep,
        recordInteraction,
        resetJourney,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourney() {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
}
