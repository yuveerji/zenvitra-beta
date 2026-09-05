/**
 * Zenvitra Universal 11-Tab Google Sheets Telemetry & Ingestion Engine
 * Handles real-time event routing to corresponding tabs in a single master Google Sheet.
 */

export type GoogleSheetTab =
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
  | 'Feedback & Grievance';

export interface SheetDispatchPayload {
  tab: GoogleSheetTab;
  data: Record<string, any>;
}

// ─── 11 TYPE-SAFE SCHEMAS ───

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
  roleDesignation: string;
  accessLevel: string;
  authProvider: string;
  accountStatus: 'ACTIVE' | 'PENDING_VERIFICATION' | 'ARCHIVED';
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
  email: string;
  phoneNumber: string;
  roleAppliedFor: string;
  department: string;
  linkedinProfile?: string;
  portfolioUrl?: string;
  cvResumeLink?: string;
  coverNote?: string;
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
}

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
  const enrichedData = {
    timestamp,
    ...payload.data,
  };

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
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.info(`[GOOGLE-SHEETS-SIMULATION] [Tab: ${payload.tab}] Payload recorded locally:`, enrichedData);
    return true;
  }

  // Normalize tab string to match Apps Script expected targetTab
  const rawTab = (payload.tab || '').toUpperCase();
  let targetTab = 'CORE_TEAM';
  if (rawTab.includes('LOGIN')) targetTab = 'LOGIN_CORE';
  else if (rawTab.includes('REGISTER')) targetTab = 'REGISTER_CORE';
  else if (rawTab.includes('CONTACT')) targetTab = 'CONTACT';
  else if (rawTab.includes('NEWSLETTER')) targetTab = 'NEWSLETTER';
  else if (rawTab.includes('COLLAB') || rawTab.includes('PARTNER')) targetTab = 'COLLAB';
  else if (rawTab.includes('CORE') || rawTab.includes('TEAM') || rawTab.includes('CAREER')) targetTab = 'CORE_TEAM';
  else if (rawTab.includes('COMMUNITY')) targetTab = 'COMMUNITY';
  else if (rawTab.includes('AMBASSADOR') || rawTab.includes('CAMPUS')) targetTab = 'CAMPUS_AMBASSADOR';
  else if (rawTab.includes('EVENT')) targetTab = 'EVENTS';
  else if (rawTab.includes('IMPACT') || rawTab.includes('DONAT') || rawTab.includes('LEDGER')) targetTab = 'IMPACT_LEDGER';
  else if (rawTab.includes('FEEDBACK') || rawTab.includes('GRIEVANCE')) targetTab = 'FEEDBACK';
  else if (rawTab.includes('PULSE') || rawTab.includes('POST')) targetTab = 'PULSE_POSTS';

  const outgoingPayload = {
    targetTab,
    ...enrichedData,
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(outgoingPayload),
    });
    return response.ok;
  } catch (error) {
    console.error('[GOOGLE-SHEETS-SERVER-ERROR]', error);
    return false;
  }
}

// ─── CONVENIENCE DISPATCHERS FOR EACH DOMAIN ───

export const sheetSync = {
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

  feedback: (record: FeedbackGrievanceRecord) =>
    dispatchToGoogleSheets({ tab: 'Feedback & Grievance', data: record }),
};

// Backward-compatible alias
export async function syncToGoogleSheet(payload: any) {
  if (payload.event === 'REGISTRATION') {
    return sheetSync.register({
      userId: payload.userId || payload.username || 'unknown',
      fullName: payload.name || payload.username || 'User',
      email: payload.email,
      roleDesignation: payload.role || 'USER',
      accessLevel: 'Member',
      authProvider: payload.provider || 'CREDENTIALS',
      accountStatus: 'ACTIVE',
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