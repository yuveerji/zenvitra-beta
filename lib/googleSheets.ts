/**
 * Zenvitra Universal 12-Tab Google Sheets Telemetry & Ingestion Engine
 * Handles real-time event routing to corresponding tabs in a single master Google Sheet.
 */

export type GoogleSheetTab =
  | '01 People'
  | '02 Core Registrations'
  | '03 Login Activity'
  | '04 Team Applications'
  | '05 Team Roles Access'
  | '06 Contact Inquiries'
  | '07 Newsletter Subscribers'
  | '08 Collaborations'
  | '09 Community Members'
  | '10 Campus Ambassadors'
  | '11 Events'
  | '12 Event Registrations'
  | '13 Committees'
  | '14 Delegate Rosters'
  | '15 EB Secretariat'
  | '16 Attendance Rollcall'
  | '17 Awards Certificates'
  | '18 Payments'
  | '19 Expenses'
  | '20 Donations Charity'
  | '21 Budgets'
  | '22 Tasks'
  | '23 Feedback'
  | '24 Grievances'
  | '25 Support Cases'
  | '26 Audit Logs'
  | '27 Chits Active Roster'
  | '28 Chits Archive'
  | '29 Meet Sessions'
  | '30 Meet Attendees'
  | '31 Pulse Posts'
  | '32 Pulse Channels'
  | '33 Pulse Comments'
  | '34 Content Editorial'
  | '35 Feature Bugs'
  | '36 Module Catalog'
  | '37 Sync Audit Log'
  | '38 Integrations'
  | '39 Sync Queue'
  | '40 Data Dictionary'
  | '41 Retention Policies'
  | '42 KPI Metrics'
  | '43 Legislation Bills'
  | '44 Bill Amendments'
  | '45 Form Submissions'
  | '46 Passport Ledger'
  | '47 Zen Docs Metrics'
  | '01_PEOPLE'
  | '02_CORE_REGISTRATIONS'
  | '03_LOGIN_ACTIVITY'
  | '04_TEAM_APPLICATIONS'
  | '05_TEAM_ROLES_ACCESS'
  | '06_CONTACT_INQUIRIES'
  | '07_NEWSLETTER_SUBSCRIBERS'
  | '08_COLLABORATIONS'
  | '09_COMMUNITY_MEMBERS'
  | '10_CAMPUS_AMBASSADORS'
  | '11_EVENTS'
  | '12_EVENT_REGISTRATIONS'
  | '13_COMMITTEES'
  | '14_DELEGATE_ROSTERS'
  | '15_EB_SECRETARIAT'
  | '16_ATTENDANCE_ROLLCALL'
  | '17_AWARDS_CERTIFICATES'
  | '18_PAYMENTS'
  | '19_EXPENSES'
  | '20_DONATIONS_CHARITY'
  | '21_BUDGETS'
  | '22_TASKS'
  | '23_FEEDBACK'
  | '24_GRIEVANCES'
  | '25_SUPPORT_CASES'
  | '26_AUDIT_LOGS'
  | '27_CHITS_ACTIVE_ROSTER'
  | '28_CHITS_ARCHIVE'
  | '29_MEET_SESSIONS'
  | '30_MEET_ATTENDEES'
  | '31_PULSE_POSTS'
  | '32_PULSE_CHANNELS'
  | '33_PULSE_COMMENTS'
  | '34_CONTENT_EDITORIAL'
  | '35_FEATURE_BUGS'
  | '36_MODULE_CATALOG'
  | '37_SYNC_AUDIT_LOG'
  | '38_INTEGRATIONS'
  | '39_SYNC_QUEUE'
  | '40_DATA_DICTIONARY'
  | '41_RETENTION_POLICIES'
  | '42_KPI_METRICS'
  | '43_LEGISLATION_BILLS'
  | '44_BILL_AMENDMENTS'
  | '45_FORM_SUBMISSIONS'
  | '46_PASSPORT_LEDGER'
  | '47_ZEN_DOCS_METRICS'
  | 'Login Data Core'
  | 'Register Data Core'
  | 'Contact Inquiries'
  | 'Newsletter Subscribers'
  | 'Collab & Partnerships'
  | 'Core Team Applications'
  | 'Community Members'
  | 'Campus Ambassadors'
  | 'Event Registrations'
  | 'Impact Ledger'
  | 'Donations'
  | 'Donations & Relief'
  | 'Feedback & Grievance'
  | (string & {});

/**
 * Sanitizes values dispatched to Google Sheets to prevent formula injection or #ERROR!
 * (e.g. phone numbers starting with '+' or values starting with '=', '@', '-')
 */
export function sanitizeForGoogleSheets<T>(input: T): T {
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (trimmed.startsWith('+') || trimmed.startsWith('=') || trimmed.startsWith('@')) {
      return `'${trimmed.replace(/^'+/, '')}` as unknown as T;
    }
    if (trimmed.startsWith('-') && trimmed.length > 1 && !isNaN(Number(trimmed.slice(1)))) {
      return `'${trimmed.replace(/^'+/, '')}` as unknown as T;
    }
    return input;
  }
  if (Array.isArray(input)) {
    return input.map(sanitizeForGoogleSheets) as unknown as T;
  }
  if (input !== null && typeof input === 'object') {
    const res: Record<string, any> = {};
    for (const [key, value] of Object.entries(input)) {
      res[key] = sanitizeForGoogleSheets(value);
    }
    return res as unknown as T;
  }
  return input;
}

export interface SheetDispatchPayload {
  tab: GoogleSheetTab;
  data: Record<string, any>;
}

// ─── 12 TYPE-SAFE SCHEMAS ───

export interface LoginRecord {
  userId: string;
  fullName: string;
  email: string;
  authProvider: string;
  ipAddress?: string;
  deviceBrowserInfo?: string;
  loginStatus: 'SUCCESS' | 'FAILED' | '2FA_CHALLENGE';
}

export interface RegisterRecord {
  userId: string;
  fullName: string;
  email: string;
  username?: string;
  roleDesignation: string;
  accessLevel: string;
  authProvider: string;
  accountStatus: 'ACTIVE' | 'PENDING_VERIFICATION' | 'ARCHIVED';
  age?: number | string;
  isMinor?: boolean;
  minorStatus?: string;
  parentGuardianName?: string;
  parentGuardianContact?: string;
  parentName?: string;
  parentContact?: string;
  minorConsent?: boolean;
  institution?: string;
  institutionOrSchool?: string;
  phoneNumber?: string;
  countryCity?: string;
  registrationType?: 'PRE_REGISTER' | 'DIRECT_REGISTER' | 'STANDARD' | 'PREREGISTER' | 'REGISTER' | string;
  registrationStatus?: 'PREREGISTER' | 'REGISTER' | string;
  preferredTrack?: string;
  termsRatified?: boolean | string;
}

export interface ContactInquiryRecord {
  fullName: string;
  email: string;
  subject: string;
  queryType: string;
  message: string;
  phoneNumber?: string;
  sourceUrl?: string;
  status?: string;
}

export interface NewsletterRecord {
  emailAddress: string;
  subscriptionSource?: string;
  consentGiven: boolean;
  utmCampaign?: string;
  status?: string;
}

export interface CollabRecord {
  organizationName: string;
  representativeName: string;
  officialEmail: string;
  phoneWhatsapp?: string;
  collabType: string;
  proposalSummary: string;
  budgetResourceScope?: string;
  stage?: string;
}

export interface CoreTeamApplicationRecord {
  fullName: string;
  handle?: string;
  email: string;
  phoneNumber?: string;
  contactChannel?: string;
  locationTimezone?: string;
  roleAppliedFor: string;
  department: string;
  portfolioUrl?: string;
  dossierUploadUrl?: string;
  leadershipAccomplishments?: string;
  strategicVision?: string;
  weeklyBandwidth?: string;
  motivationStatement?: string;
  constitutionalAccord?: string;
  applicationStatus?: string;
  reviewerInfo?: string;
}

export interface CommunityMemberRecord {
  fullName: string;
  email: string;
  cityRegion?: string;
  institutionCollege?: string;
  primarySkills?: string;
  areasOfInterest?: string;
  discordHandle?: string;
  membershipStatus?: string;
}

export interface CampusAmbassadorRecord {
  fullName: string;
  collegeUniversityName: string;
  cityState: string;
  degreeYearOfStudy: string;
  studentIdProof?: string;
  leadershipExperience?: string;
  proposedStrategy?: string;
  approvalStatus?: string;
}

export interface EventRegistrationRecord {
  eventIdSlug: string;
  eventName: string;
  participantName: string;
  participantEmail: string;
  contactNumber?: string;
  institutionAffiliation?: string;
  ticketPassType: string;
  attendanceMarked?: string;
}

export interface ImpactLedgerRecord {
  donorName: string;
  donorEmail: string;
  voluntaryAmountInr: number | string;
  utrTransactionId: string;
  targetProjectStream: string;
  paymentScreenshotPreview?: string;
  auditStatus?: string;
  verificationDetails?: string;
  donorPhone?: string;
  paymentMode?: string;
  notesOrPrayer?: string;
  wantsAnonymous?: boolean;
}

export type DonationRecord = ImpactLedgerRecord;

export interface FeedbackGrievanceRecord {
  submitterName: string;
  email: string;
  feedbackCategory: string;
  pageUrl?: string;
  severityPriority?: string;
  description: string;
  attachmentLink?: string;
  status?: string;
}

/**
 * Universal Client/Server Dispatcher for 11 Google Sheets Tabs
 */
export async function dispatchToGoogleSheets(payload: SheetDispatchPayload): Promise<boolean> {
  const timestamp = new Date().toISOString();
  const rawEnriched = {
    timestamp,
    ...payload.data,
  };
  const enrichedData = sanitizeForGoogleSheets(rawEnriched);

  // 1. Client-Side API Route Call (prevents exposing secret webhook URL)
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tab: payload.tab,
          data: enrichedData,
        }),
      });
      return res.ok;
    } catch (err) {
      console.warn('[GOOGLE-SHEETS-CLIENT-DISPATCH]', err);
      return false;
    }
  }

  // 2. Server-Side Direct Webhook Dispatch
  const SECRETARIAT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxRZ_ZUCZmxgTiZ2zHc9GaPWvioPyST9iLUBLdeqI7UM--3MWSiXyUcnh1vFW1d6exH/exec';
  const DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxRZ_ZUCZmxgTiZ2zHc9GaPWvioPyST9iLUBLdeqI7UM--3MWSiXyUcnh1vFW1d6exH/exec';
  
  // Normalize tab string to match Apps Script expected register without underscores
  let targetTab: string = (payload.tab || '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
  if (!/^\d{2}\s/.test(targetTab)) {
    const rawTab = targetTab.toUpperCase();
    if (rawTab.includes('REGISTER') || rawTab.includes('CORE REG')) targetTab = 'Register Data Core';
    else if (rawTab.includes('CORE TEAM') || rawTab.includes('TEAM APPL')) targetTab = 'Core Team Applications';
    else if (rawTab.includes('EVENT REG') || rawTab.includes('PASS') || rawTab.includes('TICKET') || rawTab.includes('MUN') || rawTab.includes('DIPLOMACY') || rawTab === 'EVENTS') targetTab = 'Event Registrations';
    else if (rawTab.includes('AMBASSADOR') || rawTab.includes('CAMPUS')) targetTab = 'Campus Ambassadors';
    else if (rawTab.includes('SECRETARIAT') || rawTab.includes('SEC APP') || rawTab.includes('EB ')) targetTab = 'Secretariat Applications';
    else if (rawTab.includes('LOGIN') || rawTab.includes('AUTH')) targetTab = 'Login Data Core';
    else if (rawTab.includes('PEOPLE') || rawTab.includes('USER')) targetTab = '01 People';
    else if (rawTab.includes('CONTACT') || rawTab.includes('INQUIR')) targetTab = 'Contact Inquiries';
    else if (rawTab.includes('NEWSLETTER') || rawTab.includes('SUBSCRIB')) targetTab = 'Newsletter Subscribers';
    else if (rawTab.includes('COLLAB') || rawTab.includes('PARTNER')) targetTab = 'Collab & Partnerships';
    else if (rawTab.includes('COMMUNITY')) targetTab = 'Community Members';
    else if (rawTab.includes('DONAT') || rawTab.includes('RELIEF')) targetTab = 'Donations & Relief';
    else if (rawTab.includes('IMPACT')) targetTab = 'Impact Ledger';
    else if (rawTab.includes('FEEDBACK') || rawTab.includes('GRIEVANCE')) targetTab = 'Feedback & Grievance';
    else if (rawTab.includes('SUPPORT') || rawTab.includes('CASE')) targetTab = 'Support Cases';
    else if (rawTab.includes('PAYMENT') || rawTab.includes('CASHFREE')) targetTab = 'Payments';
    else if (rawTab.includes('FORM') || rawTab.includes('SUBMISSION')) targetTab = 'Form Submissions';
  }

  // Ensure 100% absence of underscores
  targetTab = targetTab.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();

  const webhookUrl = targetTab === 'SECRETARIAT' 
    ? SECRETARIAT_WEBHOOK_URL 
    : (process.env.GOOGLE_SHEETS_WEBHOOK_URL || DEFAULT_WEBHOOK_URL);

  const outgoingPayload = {
    targetTab,
    sheetTab: payload.tab,
    ...enrichedData,
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(outgoingPayload),
      redirect: 'follow',
    });
    return response.ok;
  } catch (error) {
    console.error('[GOOGLE-SHEETS-SERVER-ERROR]', error);
    return false;
  }
}

// ─── CONVENIENCE DISPATCHERS FOR EACH DOMAIN ───

export const sheetSync = {
  secretariat: (record: Record<string, any>) =>
    dispatchToGoogleSheets({ tab: 'Secretariat Applications' as any, data: record }),

  login: (record: LoginRecord) =>
    dispatchToGoogleSheets({ tab: 'Login Data Core', data: record }),

  register: (record: RegisterRecord) =>
    dispatchToGoogleSheets({ tab: 'Register Data Core', data: record }),

  contact: (record: ContactInquiryRecord) =>
    dispatchToGoogleSheets({ tab: 'Contact Inquiries', data: record }),

  newsletter: (record: NewsletterRecord) =>
    dispatchToGoogleSheets({ tab: 'Newsletter Subscribers', data: record }),

  collab: (record: CollabRecord) =>
    dispatchToGoogleSheets({ tab: 'Collab & Partnerships', data: record }),

  coreTeam: (record: CoreTeamApplicationRecord) =>
    dispatchToGoogleSheets({ tab: 'Core Team Applications', data: record }),

  community: (record: CommunityMemberRecord) =>
    dispatchToGoogleSheets({ tab: 'Community Members', data: record }),

  campusAmbassador: (record: CampusAmbassadorRecord) =>
    dispatchToGoogleSheets({ tab: 'Campus Ambassadors', data: record }),

  eventRegistration: (record: EventRegistrationRecord) =>
    dispatchToGoogleSheets({ tab: 'Event Registrations', data: record }),

  impactLedger: (record: ImpactLedgerRecord) =>
    dispatchToGoogleSheets({ tab: 'Impact Ledger', data: record }),

  donation: (_record: any) => Promise.resolve(true),

  donations: (_record: any) => Promise.resolve(true),

  feedback: (record: FeedbackGrievanceRecord) =>
    dispatchToGoogleSheets({ tab: 'Feedback & Grievance', data: record }),

  pulsePost: (record: Record<string, any>) =>
    dispatchToGoogleSheets({ tab: 'Pulse Posts', data: record }),

  event: (record: Record<string, any>) =>
    dispatchToGoogleSheets({ tab: 'Events', data: record }),

  payment: (record: Record<string, any>) =>
    dispatchToGoogleSheets({ tab: 'Payments', data: record }),

  bill: (record: Record<string, any>) =>
    dispatchToGoogleSheets({ tab: 'Legislation Bills', data: record }),

  amendment: (record: Record<string, any>) =>
    dispatchToGoogleSheets({ tab: 'Bill Amendments', data: record }),

  formSubmission: (record: Record<string, any>) =>
    dispatchToGoogleSheets({ tab: 'Form Submissions', data: record }),

  passport: (_record: Record<string, any>) => Promise.resolve(true),

  chit: (record: Record<string, any>) =>
    dispatchToGoogleSheets({ tab: 'Chits Active Roster', data: record }),

  supportTicket: (record: Record<string, any>) =>
    dispatchToGoogleSheets({ tab: 'Support Cases', data: record }),

  dispatchRaw: (payload: { tab: string; data: Record<string, any> }) =>
    dispatchToGoogleSheets({ tab: payload.tab as any, data: payload.data }),
};

// Backward-compatible alias
export async function syncToGoogleSheet(payload: any) {
  if (payload.event === 'REGISTRATION') {
    const isMinorCalc = payload.isMinor !== undefined 
      ? payload.isMinor 
      : (payload.age ? Number(payload.age) < 18 : undefined);
    const minorStatusCalc = payload.minorStatus || (payload.age ? (Number(payload.age) < 18 ? 'MINOR (<18)' : 'ADULT (18+)') : undefined);

    return sheetSync.register({
      userId: payload.userId || payload.username || 'unknown',
      fullName: payload.name || payload.username || 'User',
      email: payload.email,
      username: payload.username,
      roleDesignation: payload.role || payload.initialRole || 'USER',
      accessLevel: payload.accessLevel || 'Member',
      authProvider: payload.provider || 'CREDENTIALS',
      accountStatus: payload.accountStatus || 'ACTIVE',
      age: payload.age,
      isMinor: isMinorCalc,
      minorStatus: minorStatusCalc,
      parentGuardianName: payload.parentGuardianName || payload.parentName,
      parentGuardianContact: payload.parentGuardianContact || payload.parentContact,
      parentName: payload.parentName || payload.parentGuardianName,
      parentContact: payload.parentContact || payload.parentGuardianContact,
      minorConsent: payload.minorConsent !== undefined ? payload.minorConsent : payload.minorConfirmed,
      institution: payload.institution || payload.institutionOrSchool,
      phoneNumber: payload.phoneNumber || payload.phone,
      countryCity: payload.countryCity || payload.city,
      registrationType: (payload.registrationType && String(payload.registrationType).toUpperCase().indexOf('PRE') !== -1) ? 'PREREGISTER' : (payload.registrationType || 'REGISTER'),
      registrationStatus: (payload.registrationType && String(payload.registrationType).toUpperCase().indexOf('PRE') !== -1) ? 'PREREGISTER' : 'REGISTER',
      preferredTrack: payload.preferredTrack || payload.initialRole,
      termsRatified: true,
    });
  }
  return sheetSync.login({
    userId: payload.userId || payload.username || 'unknown',
    fullName: payload.name || payload.username || 'User',
    email: payload.email,
    authProvider: payload.provider || 'CREDENTIALS',
    loginStatus: 'SUCCESS',
  });
}