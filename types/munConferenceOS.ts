// ZEN.MUN / CONFERENCE Universal Operational Specification Types & Data Models
// Compliant with ZENVITRA Product Specification V1.0

export type ConferenceLifecycleStage = 
  | 'DRAFT'
  | 'SETUP'
  | 'REGISTRATION'
  | 'ALLOCATION'
  | 'READY'
  | 'LIVE'
  | 'CLOSING'
  | 'ARCHIVED';

export type SecretariatRoleType = 
  | 'SECRETARY_GENERAL'
  | 'DIRECTOR_GENERAL'
  | 'USG'
  | 'COMMITTEE_DIRECTOR'
  | 'RAPPORTEUR'
  | 'IT_TECHNICAL'
  | 'FINANCE'
  | 'PRESS_MEDIA'
  | 'CUSTOM';

export type PermissionAction = 'VIEW' | 'CREATE' | 'EDIT' | 'APPROVE' | 'PUBLISH' | 'EXPORT' | 'DELETE' | 'FREEZE';
export type PermissionScope = 'CONFERENCE' | 'DEPARTMENT' | 'COMMITTEE' | 'ASSIGNED_RECORDS' | 'OWN_RECORDS';

export interface PermissionRule {
  resource: string;
  action: PermissionAction;
  scope: PermissionScope;
  requiresSecondApproval?: boolean;
}

export interface SecretariatMember {
  id: string;
  userId: string;
  name: string;
  handle: string;
  email: string;
  role: SecretariatRoleType;
  customTitle?: string;
  departmentId?: string;
  committeeId?: string;
  permissions: PermissionRule[];
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  assignedAt: string;
}

export interface OrgUnit {
  id: string;
  name: string;
  type: 'DEPARTMENT' | 'COMMITTEE' | 'WORKING_GROUP' | 'CUSTOM_UNIT';
  parentId?: string;
  leadMemberId?: string;
  memberIds: string[];
}

export interface WorkflowTransition {
  fromStatus: string;
  toStatus: string;
  allowedRoles: SecretariatRoleType[];
  requiresApproval: boolean;
  requiredFields?: string[];
}

export interface WorkflowDefinition {
  id: string;
  module: 'REGISTRATION' | 'ALLOCATION' | 'SESSION' | 'DOCUMENT' | 'AWARD' | 'REFUND';
  initialStatus: string;
  transitions: WorkflowTransition[];
}

export interface IncidentRecord {
  id: string;
  title: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'REPORTED' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'MITIGATED' | 'RESOLVED' | 'CLOSED';
  department: string;
  committeeId?: string;
  reportedBy: string;
  assignedTo?: string;
  description: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface ConferenceTask {
  id: string;
  title: string;
  departmentId?: string;
  assignedToName?: string;
  assignedToHandle?: string;
  deadline: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'TO_DO' | 'IN_PROGRESS' | 'BLOCKED' | 'IN_REVIEW' | 'COMPLETED' | 'CANCELLED';
  isOverdue?: boolean;
}

export interface ConferenceScheduleItem {
  id: string;
  dayNumber: number;
  timeRange: string;
  title: string;
  venueOrRoom: string;
  committeeId?: string;
  category: 'PLENARY' | 'CAUCUS' | 'MEAL' | 'CRISIS' | 'CEREMONY';
  status: 'SCHEDULED' | 'READY' | 'LIVE' | 'PAUSED' | 'CONCLUDED' | 'CANCELLED';
}

export interface ConferenceAnnouncement {
  id: string;
  title: string;
  content: string;
  targetAudience: 'ALL' | 'SECRETARIAT_ONLY' | 'DELEGATES_ONLY' | 'EB_ONLY' | 'PRESS_ONLY';
  authorName: string;
  authorRole: string;
  publishedAt: string;
  pinned: boolean;
}

export interface AuditLogItem {
  id: string;
  actorName: string;
  actorHandle: string;
  actorRole: string;
  action: string;
  targetEntity: string;
  targetId: string;
  details: string;
  timestamp: string;
}

export interface ModuleSpecDefinition {
  id: string;
  code: string;
  number: string;
  title: string;
  category: 'Core' | 'Connected';
  description: string;
  iconName: string;
  featureRequirements: string[];
}

export const ZEN_MUN_21_MODULES: ModuleSpecDefinition[] = [
  {
    id: 'm01',
    code: 'HQ',
    number: '01',
    title: 'Conference HQ',
    category: 'Core',
    description: 'The central dashboard and live overview for Secretariat command.',
    iconName: 'LayoutDashboard',
    featureRequirements: [
      'Conference identity, edition, dates, venue and delivery mode',
      'Conference lifecycle: Draft → Setup → Registration → Allocation → Ready → Live → Closing → Archived',
      'Live counts for registrations, verified payments, delegates, committees and Secretariat members',
      'Readiness checklist with blockers, warnings and completion status',
      'Today’s schedule, upcoming sessions and overdue tasks',
      'Cross-department announcements and pending approvals',
      'Operational health: unresolved incidents, attendance gaps and overdue reports',
      'Quick actions to create a committee, assign a team member or publish an announcement'
    ]
  },
  {
    id: 'm02',
    code: 'SETUP',
    number: '02',
    title: 'Conference Setup Wizard',
    category: 'Core',
    description: 'A guided setup process that makes every conference configurable.',
    iconName: 'Sliders',
    featureRequirements: [
      'Configurable conference identity, logos, visual theme, and branding',
      'Dates, multi-day scheduling, and venue configuration',
      'Rules of Procedure setup (THIMUN, UNA-USA, Indian Parliamentary, Crisis)',
      'Registration fees, payment policies, and waiver criteria'
    ]
  },
  {
    id: 'm03',
    code: 'COMMITTEES',
    number: '03',
    title: 'Committee Control',
    category: 'Core',
    description: 'Manage every committee as a separate operational workspace.',
    iconName: 'Grid',
    featureRequirements: [
      'Committee directory with capacity, agenda topics, and study guides',
      'Executive Board (EB) assignments and presiding officer permissions',
      'Real-time quorum rules and special procedural thresholds',
      'Crisis injection controls and custom chamber parameters'
    ]
  },
  {
    id: 'm04',
    code: 'DELEGATES',
    number: '04',
    title: 'Delegate Registry',
    category: 'Core',
    description: 'A reliable source of truth for every participant with zero mock data.',
    iconName: 'Users',
    featureRequirements: [
      'Full participant directory with verification and payment state',
      'Application review (Submitted → Under Review → Approved → Waitlisted)',
      'Duplicate registration detection and student ID checking',
      'Emergency contact and medical/dietary accommodation records'
    ]
  },
  {
    id: 'm05',
    code: 'ALLOCATIONS',
    number: '05',
    title: 'Country & Portfolio Allocation',
    category: 'Core',
    description: 'The official country matrix allocation and reassignment engine.',
    iconName: 'Layers',
    featureRequirements: [
      'Committee portfolio matrix with live vacancy and claim status',
      'Delegate preference-based ranking and auto-allocation assistance',
      'Permission-controlled allotment publishing and email notification',
      'Allocation change history with prior state preservation'
    ]
  },
  {
    id: 'm06',
    code: 'SECRETARIAT',
    number: '06',
    title: 'Secretariat Directory & Tasks',
    category: 'Core',
    description: 'Internal team management, departmental hierarchy, and execution.',
    iconName: 'Briefcase',
    featureRequirements: [
      'Secretariat directory by department (USG, DG, SG, Operations)',
      'Task tracking with deadlines, owners, dependencies, and priorities',
      'Hierarchical permissions and custom role titles',
      'Executive appointments and instant credential revocation'
    ]
  },
  {
    id: 'm07',
    code: 'SCHEDULE',
    number: '07',
    title: 'Schedule & Run of Show',
    category: 'Core',
    description: 'The master timeline for the entire conference across all tracks.',
    iconName: 'Calendar',
    featureRequirements: [
      'Multi-day run of show with committee sessions, caucuses, and meals',
      'Live delay notifications and automated schedule broadcast',
      'Chamber room assignments and physical/virtual access links',
      'Speaker and ceremony timing tracking'
    ]
  },
  {
    id: 'm08',
    code: 'LIVE_OPS',
    number: '08',
    title: 'Live Conference Operations',
    category: 'Core',
    description: 'The operating screen used while committee sessions are running.',
    iconName: 'Radio',
    featureRequirements: [
      'Active session dashboard across all simultaneous committee rooms',
      'Real-time dais telemetry: speaker times, motions, points of order',
      'Emergency protocol broadcasts with siren and audio injection',
      'Dais override controls for the Secretary-General'
    ]
  },
  {
    id: 'm09',
    code: 'ATTENDANCE',
    number: '09',
    title: 'Attendance & Roll Call',
    category: 'Core',
    description: 'Accurate attendance records and quorum evaluation across all sessions.',
    iconName: 'CheckSquare',
    featureRequirements: [
      'Digital roll call: Present, Present and Voting, Late, Absent',
      'Automated 2/3 and simple majority calculation based on attendance',
      'Session-by-session historical attendance records',
      'Attendance drop detection and unexcused absence alerts'
    ]
  },
  {
    id: 'm10',
    code: 'PROCEDURE',
    number: '10',
    title: 'Committee Procedure & Chits',
    category: 'Core',
    description: 'Digital procedure tools for committee business and private chits.',
    iconName: 'Gavel',
    featureRequirements: [
      'General Speakers List (GSL) and Moderated Caucus timer engine',
      'Substantive and procedural voting tally with roll call vote mode',
      'Digital chit dispatch system between delegates and dais',
      'Westminster parliamentary motions and Zero Hour procedures'
    ]
  },
  {
    id: 'm11',
    code: 'DOCUMENTS',
    number: '11',
    title: 'Document & Resolution Desk',
    category: 'Core',
    description: 'The document lifecycle from draft working paper to published resolution.',
    iconName: 'FileText',
    featureRequirements: [
      'Working paper and Draft Resolution submission portal',
      'Sponsor and signatory verification against active delegates',
      'Secretariat Redline Diff Studio for live amendment checking',
      'Cryptographic SHA-256 sealing of ratified resolutions'
    ]
  },
  {
    id: 'm12',
    code: 'COMMS',
    number: '12',
    title: 'Communication & Announcements',
    category: 'Core',
    description: 'A controlled communications layer for all conference stakeholders.',
    iconName: 'Megaphone',
    featureRequirements: [
      'Targeted broadcast announcements (All, Secretariat, EB, Delegates)',
      'Emergency alerts with full-screen banner override',
      'Conference-wide direct updates and push notifications',
      'Archived announcement log with read receipts'
    ]
  },
  {
    id: 'm13',
    code: 'FINANCE',
    number: '13',
    title: 'Finance & Registration Reconciliation',
    category: 'Connected',
    description: 'Operational visibility connected directly to ZEN.PAYMENTS.',
    iconName: 'CreditCard',
    featureRequirements: [
      'Live gross revenue and delegate tier pass sales breakdown',
      'Payment verification status (Paid, Pending, Failed, Waived)',
      'Refund approval workflow requiring dual-officer authorization',
      'Creator-delegated revenue viewer permissions for the Finance team'
    ]
  },
  {
    id: 'm14',
    code: 'AWARDS',
    number: '14',
    title: 'Awards & Results',
    category: 'Core',
    description: 'A controlled and auditable process for final committee results.',
    iconName: 'Award',
    featureRequirements: [
      'EB scorecards and rubric grading per delegate speech and caucus',
      'Award nomination: Best Delegate, High Commendation, Special Mention',
      'Executive approval gate before awards can be announced or published',
      'Best Delegation school/university aggregate score calculator'
    ]
  },
  {
    id: 'm15',
    code: 'CERTIFICATES',
    number: '15',
    title: 'Certificates & Credentials',
    category: 'Connected',
    description: 'Accurate credential issuance linked to verified records in ZEN.DOCS.',
    iconName: 'FileCheck2',
    featureRequirements: [
      'One-click digital certificate generation for all attending delegates',
      'Unique QR-verifiable credential tokens linked to ZEN.PASSPORT',
      'Tamper-proof SHA-256 seal and secretariat signature stamps',
      'Revocation and replacement audit trail'
    ]
  },
  {
    id: 'm16',
    code: 'PRESS',
    number: '16',
    title: 'Press & Media Room',
    category: 'Connected',
    description: 'A dedicated workspace for official conference coverage on ZenPress.',
    iconName: 'Newspaper',
    featureRequirements: [
      'International Press Corps workspace and article submission queue',
      'Editor-in-Chief review and editorial clearance pipeline',
      'Instant publishing to ZENVITRA ZenPress news feed',
      'Official conference photo/media asset gallery'
    ]
  },
  {
    id: 'm17',
    code: 'HELPDESK',
    number: '17',
    title: 'Helpdesk & Incident Management',
    category: 'Core',
    description: 'Resolve operational and technical problems without losing context.',
    iconName: 'LifeBuoy',
    featureRequirements: [
      'Delegate and dais support ticket triage system',
      'Incident severity tagging (Low, Medium, High, Critical)',
      'Assignment to IT, Logistics, or Secretariat heads',
      'Resolution history and root cause post-mortem documentation'
    ]
  },
  {
    id: 'm18',
    code: 'ANALYTICS',
    number: '18',
    title: 'Analytics & Conference Reports',
    category: 'Core',
    description: 'Operational intelligence for evidence-based conference decisions.',
    iconName: 'BarChart3',
    featureRequirements: [
      'Real-time attendance attrition curves and chamber participation heatmaps',
      'Speaker time distribution across delegations and caucuses',
      'Committee efficiency metrics (bills passed, points handled)',
      'Post-conference executive summary PDF export'
    ]
  },
  {
    id: 'm19',
    code: 'INTEGRATIONS',
    number: '19',
    title: 'Integrations & Data Sync',
    category: 'Connected',
    description: 'Connect the operating system to ZENVITRA ecosystem & Google Sheets.',
    iconName: 'Zap',
    featureRequirements: [
      'Bi-directional Google Sheets sync with conflict resolution',
      'ZEN.PASSPORT single identity synchronization',
      'ZEN.CHAT dedicated caucus channel creation',
      'Automated CSV and JSON data export'
    ]
  },
  {
    id: 'm20',
    code: 'AUDIT',
    number: '20',
    title: 'Audit, Security & Compliance',
    category: 'Core',
    description: 'Trustworthy operations, immutable logs, and accountability.',
    iconName: 'ShieldAlert',
    featureRequirements: [
      'Immutable audit trail recording every allocation and permission change',
      'Role-based access control (RBAC) with least privilege principles',
      'Conference isolation guaranteeing zero cross-event leakage',
      'Session token validation and biometric/passcode re-verification'
    ]
  },
  {
    id: 'm21',
    code: 'ARCHIVE',
    number: '21',
    title: 'Conference Closure & Archive',
    category: 'Core',
    description: 'A formal closeout process, not just a switch to inactive.',
    iconName: 'Archive',
    featureRequirements: [
      'Adjournment sine die declaration by the Secretary-General',
      'Read-only locking of all committee dockets and speaker logs',
      'Financial settlement reconciliation and certificate archive generation',
      'Permanent historical dossier preservation for alumni and delegates'
    ]
  }
];
