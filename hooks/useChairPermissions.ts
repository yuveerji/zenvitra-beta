'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';

export interface ChairAuthStatus {
  canAccessChairConsole: boolean;
  assignedRole: string;
  permissions: string[];
  isLoading: boolean;
  isRevoked: boolean;
  reason?: string;
  recheck: () => Promise<void>;
}

export function useChairPermissions(sessionCode?: string): ChairAuthStatus {
  const { profile, isAuthenticated } = useAuth();
  const [canAccess, setCanAccess] = useState(false);
  const [assignedRole, setAssignedRole] = useState('NONE');
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRevoked, setIsRevoked] = useState(false);
  const [reason, setReason] = useState<string | undefined>();

  const verify = useCallback(async () => {
    if (!sessionCode) {
      setCanAccess(false);
      setIsLoading(false);
      return;
    }

    // Fast-path client check for sovereign Founder or Global Admin
    const roleUpper = (profile?.role || '').toUpperCase();
    if (roleUpper === 'FOUNDER' || roleUpper === 'CO_FOUNDER' || roleUpper === 'SUPER_ADMIN' || roleUpper === 'ADMIN') {
      setCanAccess(true);
      setAssignedRole(roleUpper);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`/api/mun/sessions/${sessionCode}/permissions`, {
        headers: {
          'x-zenvitra-user-id': profile?.id || '',
          'x-zenvitra-email': profile?.email || '',
        },
      });

      if (!res.ok) {
        setCanAccess(false);
        setAssignedRole('NONE');
        setPermissions([]);
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      setCanAccess(Boolean(data.canAccessChairConsole));
      setAssignedRole(data.assignedRole || 'DELEGATE');
      setPermissions(Array.isArray(data.permissions) ? data.permissions : []);
      setIsRevoked(Boolean(data.isRevoked));
      setReason(data.reason);
    } catch (err) {
      console.warn('Failed to verify chair permissions:', err);
      setCanAccess(false);
    } finally {
      setIsLoading(false);
    }
  }, [sessionCode, profile?.id, profile?.email, profile?.role]);

  useEffect(() => {
    verify();
  }, [verify]);

  return {
    canAccessChairConsole: canAccess,
    assignedRole,
    permissions,
    isLoading,
    isRevoked,
    reason,
    recheck: verify,
  };
}
