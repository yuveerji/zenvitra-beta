// Secretariat Universal Configuration & Permission Engine for ZEN.MUN / CONFERENCE
import { 
  SecretariatMember, 
  SecretariatRoleType, 
  PermissionAction, 
  PermissionRule,
  ConferenceLifecycleStage,
  IncidentRecord,
  ConferenceTask,
  ConferenceScheduleItem,
  ConferenceAnnouncement,
  AuditLogItem
} from '@/types/munConferenceOS';

export type { SecretariatMember } from '@/types/munConferenceOS';

export const DEFAULT_SECRETARIAT_ROLES: Array<{
  role: SecretariatRoleType;
  title: string;
  scope: string;
  description: string;
  defaultPermissions: PermissionRule[];
}> = [
  {
    role: 'SECRETARY_GENERAL',
    title: 'Secretary-General',
    scope: 'Conference Owner',
    description: 'Full conference control, appointments, approvals, policy settings, publishing and closure.',
    defaultPermissions: [
      { resource: '*', action: 'VIEW', scope: 'CONFERENCE' },
      { resource: '*', action: 'CREATE', scope: 'CONFERENCE' },
      { resource: '*', action: 'EDIT', scope: 'CONFERENCE' },
      { resource: '*', action: 'APPROVE', scope: 'CONFERENCE' },
      { resource: '*', action: 'PUBLISH', scope: 'CONFERENCE' },
      { resource: '*', action: 'EXPORT', scope: 'CONFERENCE' },
      { resource: '*', action: 'FREEZE', scope: 'CONFERENCE' }
    ]
  },
  {
    role: 'DIRECTOR_GENERAL',
    title: 'Director-General',
    scope: 'Operations Lead',
    description: 'Cross-committee operations, schedules, staffing, reports and escalation management.',
    defaultPermissions: [
      { resource: 'delegates', action: 'VIEW', scope: 'CONFERENCE' },
      { resource: 'delegates', action: 'EDIT', scope: 'CONFERENCE' },
      { resource: 'allocations', action: 'VIEW', scope: 'CONFERENCE' },
      { resource: 'allocations', action: 'EDIT', scope: 'CONFERENCE' },
      { resource: 'schedule', action: 'EDIT', scope: 'CONFERENCE' },
      { resource: 'sessions', action: 'EDIT', scope: 'CONFERENCE' },
      { resource: 'incidents', action: 'EDIT', scope: 'CONFERENCE' }
    ]
  },
  {
    role: 'USG',
    title: 'USG / Department Head',
    scope: 'Department Scope',
    description: 'Manage assigned department, team members, tasks, records and deliverables.',
    defaultPermissions: [
      { resource: 'department_tasks', action: 'CREATE', scope: 'DEPARTMENT' },
      { resource: 'department_tasks', action: 'EDIT', scope: 'DEPARTMENT' },
      { resource: 'department_tasks', action: 'APPROVE', scope: 'DEPARTMENT' }
    ]
  },
  {
    role: 'COMMITTEE_DIRECTOR',
    title: 'Committee Director / EB',
    scope: 'Committee Scope',
    description: 'Committee agenda, attendance, roll calls, speakers, voting, documents and committee reports.',
    defaultPermissions: [
      { resource: 'attendance', action: 'CREATE', scope: 'COMMITTEE' },
      { resource: 'attendance', action: 'EDIT', scope: 'COMMITTEE' },
      { resource: 'procedure', action: 'EDIT', scope: 'COMMITTEE' },
      { resource: 'documents', action: 'APPROVE', scope: 'COMMITTEE' },
      { resource: 'awards', action: 'CREATE', scope: 'COMMITTEE' }
    ]
  },
  {
    role: 'RAPPORTEUR',
    title: 'Rapporteur',
    scope: 'Assigned Records',
    description: 'Attendance records, minutes, committee documentation, speaker records and assigned reports.',
    defaultPermissions: [
      { resource: 'attendance', action: 'CREATE', scope: 'ASSIGNED_RECORDS' },
      { resource: 'minutes', action: 'CREATE', scope: 'ASSIGNED_RECORDS' },
      { resource: 'speaker_list', action: 'EDIT', scope: 'ASSIGNED_RECORDS' }
    ]
  },
  {
    role: 'IT_TECHNICAL',
    title: 'IT / Technical Team',
    scope: 'Technical Scope',
    description: 'Meeting links, technical incidents, access troubleshooting and system diagnostics; no access to confidential records.',
    defaultPermissions: [
      { resource: 'technical_links', action: 'EDIT', scope: 'CONFERENCE' },
      { resource: 'incidents', action: 'EDIT', scope: 'CONFERENCE' },
      { resource: 'system_diagnostics', action: 'VIEW', scope: 'CONFERENCE' }
    ]
  },
  {
    role: 'FINANCE',
    title: 'Finance Team',
    scope: 'Finance Scope',
    description: 'Registration reconciliation, approved refunds, expenses and financial reports.',
    defaultPermissions: [
      { resource: 'finance', action: 'VIEW', scope: 'CONFERENCE' },
      { resource: 'reconciliation', action: 'EDIT', scope: 'CONFERENCE' },
      { resource: 'refunds', action: 'APPROVE', scope: 'CONFERENCE' }
    ]
  },
  {
    role: 'PRESS_MEDIA',
    title: 'Press / Media Team',
    scope: 'Publishing Scope',
    description: 'Approved press releases, coverage, media assets and public announcements.',
    defaultPermissions: [
      { resource: 'press', action: 'CREATE', scope: 'CONFERENCE' },
      { resource: 'press', action: 'EDIT', scope: 'CONFERENCE' },
      { resource: 'announcements', action: 'CREATE', scope: 'CONFERENCE' }
    ]
  }
];

export const LIFECYCLE_STAGES: Array<{
  stage: ConferenceLifecycleStage;
  label: string;
  number: string;
  description: string;
}> = [
  {
    stage: 'DRAFT',
    number: '01',
    label: 'Draft',
    description: 'Create the conference and define its identity, ownership and initial settings.'
  },
  {
    stage: 'SETUP',
    number: '02',
    label: 'Setup',
    description: 'Configure committees, Secretariat, fees, policies, schedules and registration forms.'
  },
  {
    stage: 'REGISTRATION',
    number: '03',
    label: 'Registration Open',
    description: 'Accept applications, verify payments and process eligibility checks.'
  },
  {
    stage: 'ALLOCATION',
    number: '04',
    label: 'Allocation',
    description: 'Review applicants, assign committees and portfolios, resolve exceptions.'
  },
  {
    stage: 'READY',
    number: '05',
    label: 'Ready to Operate',
    description: 'Freeze the required configuration, verify meeting links and approve the run of show.'
  },
  {
    stage: 'LIVE',
    number: '06',
    label: 'Live',
    description: 'Run committee sessions, attendance, procedure, announcements and incident handling.'
  },
  {
    stage: 'CLOSING',
    number: '07',
    label: 'Closing',
    description: 'Finalise awards, reports, outstanding financial items and certificates.'
  },
  {
    stage: 'ARCHIVED',
    number: '08',
    label: 'Archived',
    description: 'Preserve the approved records and restrict changes to authorised archival actions.'
  }
];

// LocalStorage Persistence Keys
export const LS_SECRETARIAT_MEMBERS = 'zenvitra_sec_members_v1';
export const LS_LIFECYCLE_STAGE = 'zenvitra_sec_lifecycle_v1';
export const LS_CONF_INCIDENTS = 'zenvitra_sec_incidents_v1';
export const LS_CONF_TASKS = 'zenvitra_sec_tasks_v1';
export const LS_CONF_SCHEDULE = 'zenvitra_sec_schedule_v1';
export const LS_CONF_ANNOUNCEMENTS = 'zenvitra_sec_announcements_v1';
export const LS_CONF_AUDIT_LOGS = 'zenvitra_sec_audit_v1';

export function getStoredSecretariatMembers(confId: string): SecretariatMember[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${LS_SECRETARIAT_MEMBERS}_${confId}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function saveSecretariatMembers(confId: string, members: SecretariatMember[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${LS_SECRETARIAT_MEMBERS}_${confId}`, JSON.stringify(members));
  } catch {}
}

export function getStoredLifecycleStage(confId: string, fallback: ConferenceLifecycleStage = 'SETUP'): ConferenceLifecycleStage {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(`${LS_LIFECYCLE_STAGE}_${confId}`) as ConferenceLifecycleStage;
    if (raw) return raw;
  } catch {}
  return fallback;
}

export function saveLifecycleStage(confId: string, stage: ConferenceLifecycleStage): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${LS_LIFECYCLE_STAGE}_${confId}`, stage);
  } catch {}
}

export function recordAuditEvent(confId: string, event: Omit<AuditLogItem, 'id' | 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  try {
    const key = `${LS_CONF_AUDIT_LOGS}_${confId}`;
    const raw = localStorage.getItem(key);
    const existing: AuditLogItem[] = raw ? JSON.parse(raw) : [];
    const item: AuditLogItem = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...event
    };
    localStorage.setItem(key, JSON.stringify([item, ...existing.slice(0, 99)]));
  } catch {}
}

export function getStoredAuditEvents(confId: string): AuditLogItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${LS_CONF_AUDIT_LOGS}_${confId}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function getStoredIncidents(confId: string): IncidentRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${LS_CONF_INCIDENTS}_${confId}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function saveIncidents(confId: string, incidents: IncidentRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${LS_CONF_INCIDENTS}_${confId}`, JSON.stringify(incidents));
  } catch {}
}

export function getStoredSchedule(confId: string): ConferenceScheduleItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${LS_CONF_SCHEDULE}_${confId}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function saveSchedule(confId: string, items: ConferenceScheduleItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${LS_CONF_SCHEDULE}_${confId}`, JSON.stringify(items));
  } catch {}
}

export function getStoredAnnouncements(confId: string): ConferenceAnnouncement[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${LS_CONF_ANNOUNCEMENTS}_${confId}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function saveAnnouncements(confId: string, announcements: ConferenceAnnouncement[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${LS_CONF_ANNOUNCEMENTS}_${confId}`, JSON.stringify(announcements));
  } catch {}
}

