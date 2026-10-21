export type TicketCategory =
  | 'ACCOUNT'
  | 'EVENTS'
  | 'MUN'
  | 'PAYMENTS'
  | 'TECHNICAL'
  | 'SAFETY'
  | 'GENERAL';

export type TicketPriority =
  | 'P1_CRITICAL'
  | 'P2_HIGH'
  | 'P3_NORMAL'
  | 'P4_LOW';

export type TicketStatus =
  | 'NEW'
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING_USER'
  | 'WAITING_INTERNAL'
  | 'ESCALATED'
  | 'RESOLVED'
  | 'CLOSED';

export interface SupportTicketItem {
  id: string;
  ticketNumber: string;
  subject: string;
  category: TicketCategory;
  subcategory?: string | null;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  userId?: string | null;
  userEmail: string;
  userName: string;
  userHandle?: string | null;
  assignedToId?: string | null;
  assignedToName?: string | null;
  assignedTeam?: string | null;
  escalatedTo?: string | null;
  escalationReason?: string | null;
  relatedEventId?: string | null;
  relatedTxnId?: string | null;
  attachmentUrls?: string | null;
  resolutionSummary?: string | null;
  resolutionCode?: string | null;
  rating?: number | null;
  feedbackComment?: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
  closedAt?: string | null;
  messages?: SupportMessageItem[];
  internalNotes?: SupportInternalNoteItem[];
  auditLogs?: SupportAuditLogItem[];
  _count?: {
    messages: number;
    internalNotes: number;
  };
}

export interface SupportMessageItem {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderRole: 'USER' | 'STAFF' | 'ADMIN' | 'FOUNDER' | 'SYSTEM' | 'HOST' | 'ORGANIZER';
  content: string;
  attachments?: string | null;
  isOfficial: boolean;
  createdAt: string;
}

export interface SupportInternalNoteItem {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  authorRole: 'STAFF' | 'ADMIN' | 'FOUNDER';
  note: string;
  createdAt: string;
}

export interface SupportAuditLogItem {
  id: string;
  ticketId: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  details?: string | null;
  createdAt: string;
}

export interface SupportPolicyData {
  id: string;
  p1SlaHours: number;
  p2SlaHours: number;
  p3SlaHours: number;
  p4SlaHours: number;
  autoCloseDays: number;
  maintenanceNotice?: string | null;
  activeIncidents?: string | null;
  updatedAt: string;
}

export const CATEGORY_LABELS: Record<TicketCategory, { label: string; icon: string; team: string }> = {
  ACCOUNT: { label: 'Account & Access', icon: 'Shield', team: 'Account Operations' },
  EVENTS: { label: 'Events & Registrations', icon: 'Calendar', team: 'Event Operations' },
  MUN: { label: 'MUN Support', icon: 'Globe', team: 'MUN Dais Support' },
  PAYMENTS: { label: 'Payments & Refunds', icon: 'CreditCard', team: 'Finance Support' },
  TECHNICAL: { label: 'Technical Issues', icon: 'Cpu', team: 'Technical Systems' },
  SAFETY: { label: 'Safety & Complaints', icon: 'AlertTriangle', team: 'Safeguarding Desk' },
  GENERAL: { label: 'General & Inquiries', icon: 'HelpCircle', team: 'General Helpdesk' },
};

export const PRIORITY_CONFIG: Record<TicketPriority, { label: string; color: string; badge: string; sla: string }> = {
  P1_CRITICAL: { label: 'P1 — Critical (Outage / Serious Safety)', color: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30', sla: '2 hrs SLA' },
  P2_HIGH: { label: 'P2 — High (Major Event / Payment Failure)', color: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30', sla: '8 hrs SLA' },
  P3_NORMAL: { label: 'P3 — Normal (Standard Inquiry / Issue)', color: 'text-cyan-400', badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30', sla: '24 hrs SLA' },
  P4_LOW: { label: 'P4 — Low (Feedback / Minor Query)', color: 'text-neutral-400', badge: 'bg-white/10 text-neutral-300 border-white/10', sla: '72 hrs SLA' },
};

export const STATUS_CONFIG: Record<TicketStatus, { label: string; badge: string }> = {
  NEW: { label: 'New / Queued', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
  OPEN: { label: 'Open', badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
  IN_PROGRESS: { label: 'In Progress', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  WAITING_USER: { label: 'Waiting for You', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
  WAITING_INTERNAL: { label: 'Internal Review', badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' },
  ESCALATED: { label: 'Escalated', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
  RESOLVED: { label: 'Resolved', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  CLOSED: { label: 'Closed', badge: 'bg-neutral-800 text-neutral-400 border-neutral-700' },
};
