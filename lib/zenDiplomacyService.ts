/**
 * ZEN.DIPLOMACY MUN 2026 — Sovereign Delegate Registration & Portfolio Allocation Service
 * Manages zero-loss registration storage, Google Sheets matrix synchronization,
 * and reactive real-time delegate notifications upon portfolio assignment.
 */

import { pushLiveNotification } from './notificationStorage';
import { broadcastActivitySync } from './reactiveActivityHub';

export const LS_REGISTRATIONS_KEY = 'zenvitra_zendiplomacy_registrations_v1';
export const DEFAULT_MATRIX_URL = 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing';

export interface DelegateRegistration {
  id: string;
  name: string;
  email: string;
  phone: string;
  institution: string;
  experienceLevel?: string;
  firstCommitteeChoice: string;
  secondCommitteeChoice: string;
  portfolioPreferences: string;
  registeredAt: string;
  status: 'UNDER_REVIEW' | 'ALLOCATED' | 'WAITLISTED';
  allocatedCommittee?: string;
  allocatedPortfolio?: string;
  allocatedAt?: string;
  allottedBy?: string;
  notes?: string;
  syncedToGSheet?: boolean;
}

export interface AllocatePortfolioParams {
  registrationId?: string;
  email: string;
  name?: string;
  committee: string;
  portfolio: string;
  allottedBy?: string;
  notes?: string;
}

/**
 * Retrieve all registered delegates from localStorage
 */
export function getStoredRegistrations(): DelegateRegistration[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LS_REGISTRATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('[MUN-STORAGE-READ-WARN]', err);
    return [];
  }
}

/**
 * Persist registrations to localStorage and broadcast activity
 */
export function saveStoredRegistrations(items: DelegateRegistration[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LS_REGISTRATIONS_KEY, JSON.stringify(items));
    broadcastActivitySync({ source: 'event', action: 'rsvp', timestamp: Date.now() });
  } catch (err) {
    console.error('[MUN-STORAGE-WRITE-ERROR]', err);
  }
}

/**
 * Register a new delegate:
 * 1. Saves locally
 * 2. Syncs to Google Sheets via /api/sheets
 * 3. Dispatches initial confirmation notification
 */
export async function registerDelegate(
  data: Omit<DelegateRegistration, 'id' | 'registeredAt' | 'status'>
): Promise<DelegateRegistration> {
  const newReg: DelegateRegistration = {
    ...data,
    id: `reg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    registeredAt: new Date().toISOString(),
    status: 'UNDER_REVIEW',
    syncedToGSheet: false
  };

  // 1. Save locally
  const current = getStoredRegistrations();
  const updated = [newReg, ...current.filter((r) => r.email.toLowerCase() !== newReg.email.toLowerCase())];
  saveStoredRegistrations(updated);

  // 2. Dispatch live in-app notification to user
  try {
    pushLiveNotification({
      title: '📜 Delegate Application Recorded',
      message: `Your application for ZEN.DIPLOMACY MUN 2026 has been submitted. Preferences: ${newReg.firstCommitteeChoice} & ${newReg.secondCommitteeChoice}. You will receive a notification here once your portfolio is officially allocated in the Sovereign Assembly Matrix.`,
      type: 'mun',
      priority: 'NORMAL',
      link: '/zen-diplomacy',
      author: 'Executive Secretariat (@yuveer)',
      timestamp: 'Just now'
    });
  } catch (notifErr) {
    console.warn('[MUN-NOTIF-DISPATCH-WARN]', notifErr);
  }

  // 3. Forward to Google Sheets Webhook asynchronously
  try {
    const sheetRes = await fetch('/api/sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetTab: 'ZEN DIPLOMACY MUN',
        data: {
          action: 'NEW_DELEGATE_REGISTRATION',
          registrationId: newReg.id,
          fullName: newReg.name,
          emailAddress: newReg.email,
          contactPhone: newReg.phone,
          institutionOrSchool: newReg.institution,
          firstCommittee: newReg.firstCommitteeChoice,
          secondCommittee: newReg.secondCommitteeChoice,
          preferredPortfolios: newReg.portfolioPreferences,
          experienceLevel: newReg.experienceLevel || 'STANDARD',
          allocationStatus: 'PENDING_ALLOCATION',
          registeredTimestamp: newReg.registeredAt,
          conferenceDates: 'October 24-25, 2026',
          hostPlatform: 'ZEN.CALL'
        }
      })
    });

    if (sheetRes.ok) {
      newReg.syncedToGSheet = true;
      const refreshed = getStoredRegistrations().map(r => r.id === newReg.id ? { ...r, syncedToGSheet: true } : r);
      saveStoredRegistrations(refreshed);
    }
  } catch (sheetErr) {
    console.warn('[MUN-SHEETS-SYNC-WARN]', sheetErr);
  }

  return newReg;
}

/**
 * Allocate portfolio to a delegate:
 * 1. Updates delegate record locally to ALLOCATED
 * 2. Syncs allocation update to Google Sheets (/api/sheets)
 * 3. Immediately triggers high-priority notification to user
 */
export async function allocatePortfolioAndNotify(
  params: AllocatePortfolioParams
): Promise<DelegateRegistration> {
  const { registrationId, email, name, committee, portfolio, allottedBy, notes } = params;
  const current = getStoredRegistrations();

  const cleanEmail = email.trim().toLowerCase();
  let targetIndex = current.findIndex(
    (r) => (registrationId && r.id === registrationId) || r.email.toLowerCase() === cleanEmail
  );

  const timestamp = new Date().toISOString();
  let updatedRecord: DelegateRegistration;

  if (targetIndex >= 0) {
    updatedRecord = {
      ...current[targetIndex],
      status: 'ALLOCATED',
      allocatedCommittee: committee,
      allocatedPortfolio: portfolio,
      allocatedAt: timestamp,
      allottedBy: allottedBy || 'Secretariat (@yuveer)',
      notes: notes || current[targetIndex].notes,
      syncedToGSheet: true
    };
    current[targetIndex] = updatedRecord;
  } else {
    // Create new allocated record if not existing
    updatedRecord = {
      id: registrationId || `reg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name || 'Delegate',
      email: cleanEmail,
      phone: '',
      institution: '',
      firstCommitteeChoice: committee,
      secondCommitteeChoice: committee,
      portfolioPreferences: portfolio,
      registeredAt: timestamp,
      status: 'ALLOCATED',
      allocatedCommittee: committee,
      allocatedPortfolio: portfolio,
      allocatedAt: timestamp,
      allottedBy: allottedBy || 'Secretariat (@yuveer)',
      notes,
      syncedToGSheet: true
    };
    current.unshift(updatedRecord);
  }

  saveStoredRegistrations(current);

  // 2. Dispatch high-priority notification to user
  const delegateDisplayName = updatedRecord.name || name || 'Delegate';
  try {
    pushLiveNotification({
      title: '🏛️ ZEN.DIPLOMACY: Portfolio Officially Allocated!',
      message: `Congratulations ${delegateDisplayName}! You have been officially allocated "${portfolio}" in ${committee}. Directives and the live Portfolio Matrix have been ratified on the sovereign ledger.`,
      type: 'mun',
      priority: 'URGENT',
      link: '/matrix',
      author: allottedBy || 'Executive Secretariat (@yuveer)',
      timestamp: 'Just now'
    });

    // Native browser push notification if permitted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('ZEN.DIPLOMACY: Portfolio Allocated!', {
        body: `${delegateDisplayName}, your portfolio "${portfolio}" in ${committee} is live in the Assembly Matrix!`,
        icon: '/assets/logo.png'
      });
    }
  } catch (notifErr) {
    console.warn('[ALLOCATION-NOTIF-WARN]', notifErr);
  }

  // 3. Dispatch update to Google Sheets Webhook
  try {
    await fetch('/api/sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetTab: 'ZEN DIPLOMACY MUN',
        data: {
          action: 'ALLOCATE_PORTFOLIO',
          registrationId: updatedRecord.id,
          fullName: updatedRecord.name,
          emailAddress: updatedRecord.email,
          allocatedCommittee: committee,
          allocatedPortfolio: portfolio,
          allocationStatus: 'OFFICIALLY_ALLOCATED',
          allocatedTimestamp: timestamp,
          allottedBy: allottedBy || 'yuveer',
          googleSheetMatrixUrl: DEFAULT_MATRIX_URL,
          notes: notes || 'Allocated by Executive Secretariat'
        }
      })
    });
  } catch (sheetErr) {
    console.warn('[SHEETS-ALLOCATION-DISPATCH-WARN]', sheetErr);
  }

  return updatedRecord;
}

/**
 * Check if a delegate by email has been allocated a portfolio
 */
export function checkDelegateAllocation(email: string): DelegateRegistration | null {
  if (!email || typeof window === 'undefined') return null;
  const cleanEmail = email.trim().toLowerCase();
  const all = getStoredRegistrations();
  return all.find((r) => r.email.toLowerCase() === cleanEmail && r.status === 'ALLOCATED') || null;
}
