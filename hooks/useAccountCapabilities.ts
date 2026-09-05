'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  checkIsProfessionalAccountEnabled, 
  checkIsEventAccountEnabled, 
  setProfessionalAccountEnabled, 
  setEventAccountEnabled 
} from '@/lib/accountCapabilities';
import { isFounder } from '@/lib/founderControl';

export function useAccountCapabilities() {
  const { profile, isAuthenticated } = useAuth();
  const isFounderUser = isFounder(profile?.username || profile?.email, profile?.role);

  const [isProEnabled, setIsProEnabled] = useState<boolean>(() => isFounderUser || checkIsProfessionalAccountEnabled(profile));
  const [isEventEnabled, setIsEventEnabled] = useState<boolean>(() => isFounderUser || checkIsEventAccountEnabled(profile));

  const syncCapabilities = useCallback(() => {
    const isF = isFounder(profile?.username || profile?.email, profile?.role);
    setIsProEnabled(isF || checkIsProfessionalAccountEnabled(profile));
    setIsEventEnabled(isF || checkIsEventAccountEnabled(profile));
  }, [profile]);

  useEffect(() => {
    syncCapabilities();

    const handleCustomChange = () => {
      syncCapabilities();
    };

    window.addEventListener('zenvitra_account_capabilities_changed', handleCustomChange);
    window.addEventListener('storage', handleCustomChange);

    return () => {
      window.removeEventListener('zenvitra_account_capabilities_changed', handleCustomChange);
      window.removeEventListener('storage', handleCustomChange);
    };
  }, [syncCapabilities]);

  const enablePro = useCallback(() => {
    setProfessionalAccountEnabled(true);
    setIsProEnabled(true);
  }, []);

  const disablePro = useCallback(() => {
    setProfessionalAccountEnabled(false);
    setIsProEnabled(false);
  }, []);

  const enableEvent = useCallback(() => {
    setEventAccountEnabled(true);
    setIsEventEnabled(true);
  }, []);

  const disableEvent = useCallback(() => {
    setEventAccountEnabled(false);
    setIsEventEnabled(false);
  }, []);

  return {
    isProfessionalEnabled: isProEnabled,
    isEventEnabled: isEventEnabled,
    isUniversalFounder: isFounderUser,
    hasUnlimitedAccess: isFounderUser,
    enableProfessionalAccount: enablePro,
    disableProfessionalAccount: disablePro,
    enableEventAccount: enableEvent,
    disableEventAccount: disableEvent,
  };
}
