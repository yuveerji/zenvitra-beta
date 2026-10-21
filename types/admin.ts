export type AdminSectionId =
  | '01_dashboard'
  | '02_user_management'
  | '03_event_operations'
  | '04_zen_mun_desk'
  | '05_content_moderation'
  | '06_registrations'
  | '07_payments_desk'
  | '08_customer_support'
  | '09_announcements'
  | '10_reports_analytics'
  | '11_team_workspace'
  | '12_admin_settings';

export type StaffRole =
  | 'Super Admin'
  | 'Event Admin'
  | 'Community Admin'
  | 'Finance Admin'
  | 'Support Admin'
  | 'Content Reviewer';

export interface AdminSectionMeta {
  id: AdminSectionId;
  num: string;
  title: string;
  description: string;
  slug: string;
}

export interface AdminTaskItem {
  id: string;
  title: string;
  type: 'VERIFICATION' | 'TICKET' | 'REGISTRATION' | 'MODERATION' | 'REVIEW';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  assignedTo: string;
  dueDate: string;
}

export interface AdminApplicationItem {
  id: string;
  applicantName: string;
  applicantEmail: string;
  eventTitle: string;
  tier: string;
  institution: string;
  countryPreference: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITLISTED';
  submittedAt: string;
}

export interface AdminContentReportItem {
  id: string;
  contentTitle: string;
  author: string;
  contentType: 'POST' | 'ARTICLE' | 'COMMENT' | 'DOCUMENT';
  reason: string;
  status: 'OPEN' | 'RESOLVED' | 'DISMISSED';
  reportedAt: string;
}

export interface AdminSupportTicketItem {
  id: string;
  user: string;
  email: string;
  subject: string;
  category: 'PAYMENTS' | 'LOGIN' | 'MUN_DAIS' | 'CERTIFICATES' | 'GENERAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  assignedTo: string;
  updatedAt: string;
}

export interface AdminEscalationItem {
  id: string;
  title: string;
  description: string;
  department: string;
  severity: 'HIGH' | 'CRITICAL';
  escalatedBy: string;
  submittedAt: string;
  status: 'PENDING_FOUNDER_REVIEW' | 'ACKNOWLEDGED' | 'RESOLVED';
}

export interface AdminRecentAction {
  id: string;
  adminName: string;
  action: string;
  target: string;
  category: string;
  timestamp: string;
}

export const ADMIN_SECTIONS: Array<AdminSectionMeta & { controls: string[] }> = [
  {
    id: '01_dashboard',
    num: '01',
    title: 'DASHBOARD',
    description: 'Daily operational overview, pending queues, urgent alerts, and assigned workload.',
    slug: 'dashboard',
    controls: [
      'Daily Operational Overview & Workload',
      'Assigned Action Items & Priority Queue',
      'Urgent Alerts & Member Reports',
      'Operations Activity Stream',
    ],
  },
  {
    id: '02_user_management',
    num: '02',
    title: 'USER MANAGEMENT',
    description: 'Manage platform members, verify student passports, review appeals, and issue temporary flags.',
    slug: 'users',
    controls: [
      'Platform Member Directory & Search',
      'Student Passport & ID Card Verification',
      'Account Restriction & Suspension Desk',
      'Member Appeal Triage & Support History',
    ],
  },
  {
    id: '03_event_operations',
    num: '03',
    title: 'EVENT OPERATIONS',
    description: 'Supervise registered conferences, track real-time check-ins, validate tickets, and issue passes.',
    slug: 'events',
    controls: [
      'Active & Upcoming MUN Conferences',
      'On-Ground Check-in & NFC/QR Scanner',
      'Attendee Ticket Validation & Badging',
      'Conference Logistics & Venue Schedule',
    ],
  },
  {
    id: '04_zen_mun_desk',
    num: '04',
    title: 'ZEN.MUN DESK',
    description: 'Assembly administration, committee dais setup, country matrix allocations, and draft resolutions.',
    slug: 'mun-desk',
    controls: [
      'Conference Dais Roster & Executive Boards',
      'Committee Matrix Allocations ([event]/[committee]/matrix)',
      'Rules of Procedure & Caucusing Monitor',
      'Draft Resolution & Working Paper Filing',
    ],
  },
  {
    id: '05_content_moderation',
    num: '05',
    title: 'CONTENT MODERATION',
    description: 'Maintain community safety, review reported posts, verify citations, and enforce Article 12.',
    slug: 'moderation',
    controls: [
      'Reported Dispatches & Post Triage Queue',
      'Constitution Article 12 Citation Auditing',
      'Automated Spam & Abuse Filter Rules',
      'Temporary Mute & Warning Issuance',
    ],
  },
  {
    id: '06_registrations',
    num: '06',
    title: 'REGISTRATIONS',
    description: 'Process delegate applications, approve allotments, manage waitlists, and issue portfolio confirmations.',
    slug: 'registrations',
    controls: [
      'Inbound Delegate Applications Queue',
      'Country & Portfolio Allocation Engine',
      'Waitlist Management & Auto-Promotion',
      'Batch Approval & Acceptance Letters',
    ],
  },
  {
    id: '07_payments_desk',
    num: '07',
    title: 'PAYMENTS DESK',
    description: 'Operational transaction monitoring, Cashfree verification, student GST checks, and refund drafting.',
    slug: 'payments-desk',
    controls: [
      'Live Cashfree Transaction Stream',
      'Student Age & GST Verification (0% / 6%)',
      'Draft Refund Request (Requires Founder Approval)',
      'Transaction Receipt & Invoice Re-dispatch',
    ],
  },
  {
    id: '08_customer_support',
    num: '08',
    title: 'CUSTOMER SUPPORT',
    description: 'Resolve member inquiries, dais technical help, live support tickets, and founder escalations.',
    slug: 'support',
    controls: [
      'Active Support Tickets Queue',
      'Real-Time In-App Helpdesk Messenger',
      'Frequently Asked Resolutions & Macros',
      'Direct Escalation to Founder (Level 0)',
    ],
  },
  {
    id: '09_announcements',
    num: '09',
    title: 'ANNOUNCEMENTS',
    description: 'Draft operational notices, schedule delegate updates, and broadcast assembly room announcements.',
    slug: 'announcements',
    controls: [
      'Operational Notices & Session Updates',
      'Targeted Delegate Room Broadcasts',
      'Scheduled Conference Reminders',
      'Announcement Archive & Delivery Stats',
    ],
  },
  {
    id: '10_reports_analytics',
    num: '10',
    title: 'REPORTS & ANALYTICS',
    description: 'Operations team performance, attendance rates, committee turnout, and registration velocities.',
    slug: 'reports',
    controls: [
      'Daily Operational Performance Metrics',
      'Committee Attendance & Turnout Rates',
      'Registration Velocity & Bottlenecks',
      'Exportable Operations CSV / PDF Reports',
    ],
  },
  {
    id: '11_team_workspace',
    num: '11',
    title: 'TEAM WORKSPACE',
    description: 'Coordinate operations shifts, handovers, task assignments, and internal team notices.',
    slug: 'team',
    controls: [
      'Staff Roster & Shift Schedules',
      'Shift Handover Notes & Open Items',
      'Internal Operations Bulletins',
      'Staff Performance & Task Completion',
    ],
  },
  {
    id: '12_admin_settings',
    num: '12',
    title: 'ADMIN SETTINGS',
    description: 'Personal staff preferences, notification thresholds, quick templates, and credentials.',
    slug: 'admin-settings',
    controls: [
      'Personal Operations Profile & Notification Bell',
      'Workstation Theme & High-Density UI Mode',
      'Saved Ticket Macros & Quick Responses',
      'Staff Security & Session Credentials',
    ],
  },
];

export const STAFF_ROLES: StaffRole[] = [
  'Super Admin',
  'Event Admin',
  'Community Admin',
  'Finance Admin',
  'Support Admin',
  'Content Reviewer',
];
