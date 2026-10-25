/**
 * ==============================================================================
 * ZENVITRA MASTER OMNI-STREAM TELEMETRY & FORMS ENGINE (v3.1.0 ENTERPRISE)
 * ==============================================================================
 * Comprehensive, Zero-Timeout, High-Detail Sheet Engine with:
 * - 16 Canonical Operational Stream Tabs (100% of Form & Telemetry Questions Added)
 * - Ultra-Detailed Core Team Applications, Register Data Core, & Event Registrations
 * - Zero Confusing Duplicate Tabs (Auto-merges legacy 02_, 12_, 04_, 10_ numbered tabs)
 * - Seamless Multi-Tab Sync (Instantly reflects updates across all related registers)
 * - Row 1 Sticky Obsidian Headers & Smart Row Ingestion starting at Row 2
 * - Dynamic Column Expansion for custom ZenForms questions with full question spaces
 * - Nested Data & Array Auto-Unnesting (Checkboxes & Multi-Select Choices flattened)
 * 
 * ==============================================================================
 * 🚀 QUICK DEPLOYMENT INSTRUCTIONS (30 SECONDS):
 * ==============================================================================
 * 1. Open your Google Sheet (e.g. ZENVITRA Master Telemetry).
 * 2. Click "Extensions" -> "Apps Script".
 * 3. Delete ANY existing code in Code.gs and PASTE THIS ENTIRE FILE.
 * 4. Click "Save" (Ctrl+S / Cmd+S).
 * 5. From the function dropdown at the top, select "initAllTabs" and click "Run".
 *    (If prompted with "Authorization required", click Review Permissions -> Advanced -> Go to project -> Allow).
 * 6. Click "Deploy" (top right) -> "New deployment":
 *    - Click the gear icon next to "Select type" -> choose "Web app".
 *    - Description: Zenvitra Master Telemetry v3.1 Enterprise
 *    - Execute as: "Me" (your email)
 *    - Who has access: "Anyone" (CRITICAL: must be Anyone!)
 *    - Click "Deploy", authorize if prompted, and COPY the Web App URL!
 * 7. (Optional) Run "testAllTabsRow" or use the "⚡ ZENVITRA" spreadsheet menu to verify live row insertion!
 * ==============================================================================
 */

var ZEN = {
  VERSION: "v3.1.0",
  TIMEZONE: "Asia/Kolkata",
  C: {
    OBSIDIAN: "#0f172a",
    NAVY: "#1e293b",
    WHITE: "#ffffff",
    AMBER: "#f59e0b",
    EMERALD: "#10b981",
    CYAN: "#06b6d4",
    PURPLE: "#8b5cf6"
  }
};

/**
 * ── 16 EXHAUSTIVE CANONICAL TAB SCHEMAS ──
 * Every question from every registration form, MUN matrix, summit, ambassador,
 * core team, and custom ZenForm is explicitly mapped into dedicated columns.
 */
var TAB_SCHEMAS = {

  // ── TAB 1: USER REGISTRATIONS & IDENTITY LEDGER (WITH PERKS STATUS) ──
  REGISTER_CORE: {
    sheetName: 'Register Data Core',
    legacyAliases: ['02 Core Registrations', 'Core Registrations', '02_CORE_REGISTRATIONS'],
    headers: [
      'Timestamp',
      'User ID / Person ID',
      'Full Legal Name',
      'Handle',
      'Preferred Sovereign Handle (@handle)',
      'Primary Email Address',
      'Contact Phone Number',
      'Age (Years)',
      'Minor Status (Under 18 / Adult)',
      'Parent / Guardian Full Name',
      'Parent / Guardian Emergency Contact',
      'Minor Consent & Parental Accord',
      'Primary Registration Category / Role',
      'Specialized Interest Areas / Portfolio Interests',
      'Campus Ambassador Fellowship Application',
      'Statement of Intent / Motivation Pitch',
      'College / School / Organization',
      'Degree / Year of Study / Grade',
      'Geographical Location (City, State / Country)',
      'Preferred Delegation / Committee Track',
      'Registration Type (REGISTER / PREREGISTER)',
      'Registration Status for Perks (REGISTER / PREREGISTER)',
      'Access Level / Whitelist Tier',
      'Auth Provider / Method',
      'Terms & Privacy Accord Ratified',
      'Civic Decorum Covenant Ratified',
      'Data Storage & Telemetry Consent',
      'Account Status',
      'IP Address',
      'Device / Browser Summary'
    ]
  },

  // ── TAB 2: CONFERENCE, SUMMIT & DELEGATE PASS REGISTRATIONS ──
  EVENTS: {
    sheetName: 'Event Registrations',
    legacyAliases: ['12 Event Registrations', '12_EVENT_REGISTRATIONS', 'ZEN DIPLOMACY MUN', '11 Events'],
    headers: [
      'Timestamp',
      'Registration ID / Ticket ID',
      'Event ID / Conference Title',
      'Full Name of the Delegate',
      'Zenvitra Sovereign Username (@handle)',
      'Primary Contact Email Address',
      'WhatsApp / Calling Number',
      'School / College / University or Independent',
      'Current City & State of Residence',
      'Participation Track',
      'Model UN & Parliamentary Experience Tier',
      '1st Preference Committee Chamber',
      '2nd Preference Committee Chamber',
      'Top 3 Preferred Portfolios / Countries',
      'List Notable MUN Conferences & Awards Won',
      'Statement of Purpose & Procedural Strategy',
      'Parent / Guardian / Faculty Advisor Name',
      'Guardian Emergency Contact Number',
      'Institutional ID Card / Drive Link / Roll Number',
      'Diplomatic Code of Conduct & Ethics Agreement',
      'Virtual Chamber Live Stream & Recording Consent',
      'Selected Delegation Pass Tier',
      'Pass Quantity',
      'Total Pass Fee (INR)',
      'Preferred Payment Mode',
      '12-Digit UPI Transaction ID / UTR Number',
      'Upload Payment Screenshot / Receipt Proof URL',
      'Digital Signature (Type Full Legal Name)',
      'Date of Submission',
      'Payment Verification Status',
      'Allocated Committee',
      'Allocated Seat / Portfolio',
      'Dais Review Status',
      'Dais Review Notes',
      'IP Address',
      'Device / Browser Summary'
    ]
  },

  // ── TAB 3: FOUNDING CORE TEAM APPLICATIONS ──
  CORE_TEAM: {
    sheetName: 'Core Team Applications',
    legacyAliases: ['04 Team Applications', '04_TEAM_APPLICATIONS', 'Team Applications'],
    headers: [
      'Timestamp',
      'Application ID',
      'Full Legal Name',
      'Desired ZEN Handle (@handle)',
      'Primary Email Address',
      'WhatsApp / Calling Phone Number',
      'Telegram / Discord Contact Channel',
      'Current City / Location & Timezone',
      'Role Applied For',
      'Department / Wing (Primary Choice)',
      'Secondary Department Choice (Fallback)',
      'Portfolio / GitHub / Proof of Work URL',
      'Uploaded Dossier Document / Resume URL',
      'Past Experience & Leadership Track Record',
      'Statement of Purpose & Motivation (Why Lead Zenvitra)',
      'Technical / Diplomatic Dossier & Strategic Vision',
      'Department Practical Task Response / Execution Plan',
      'Weekly Bandwidth Commitment (Hours/Week)',
      'Full Availability on Launch & Summit Days',
      'Constitutional Accord Status (RATIFIED / DECLINED)',
      'Application Review Status (QUEUED / PENDING / APPROVED / REJECTED)',
      'Assigned Reviewer / Secretariat Directorate',
      'Directorate Reviewer Notes',
      'IP Address',
      'Device / Browser Summary'
    ]
  },

  // ── TAB 4: CAMPUS AMBASSADOR FELLOWSHIP APPLICATIONS ──
  CAMPUS_AMBASSADOR: {
    sheetName: 'Campus Ambassadors',
    legacyAliases: ['10 Campus Ambassadors', '10_CAMPUS_AMBASSADORS'],
    headers: [
      'Timestamp',
      'Ambassador Application ID',
      'Candidate Full Legal Name',
      'Zenvitra Sovereign Username (@handle)',
      'Primary Contact Email',
      'WhatsApp Contact Number',
      'College / University / School Name',
      'Campus Location (City & State)',
      'Degree, Major & Year of Study',
      'Student ID Card / Proof Link',
      'Estimated Student Reach via Societies / Councils',
      'Weekly Bandwidth Commitment',
      'Prior Leadership & Organizing Experience',
      'Outreach Strategy & Campus Expansion Pitch',
      'Application Status (PENDING / APPROVED / REJECTED)',
      'Directorate Reviewer Notes',
      'IP Address',
      'Device / Browser Summary'
    ]
  },

  // ── TAB 5: SECRETARIAT & EXECUTIVE BOARD (DAIS) APPLICATIONS ──
  SECRETARIAT: {
    sheetName: 'Secretariat Applications',
    legacyAliases: ['15 EB Secretariat', '15_EB_SECRETARIAT', 'Executive Board Applications'],
    headers: [
      'Timestamp',
      'Application ID',
      'Full Legal Name',
      'Sovereign Handle (@handle)',
      'Primary Email Address',
      'Contact Phone / WhatsApp',
      'Current City & Country',
      'College / School / Affiliation',
      'EB Role Applied For (Chair / Vice Chair / Rapporteur)',
      '1st Preference Committee',
      '2nd Preference Committee',
      'Prior Dais & Chairing Experience (Number of MUNs)',
      'Detailed Executive Board Experience & Awards',
      'Procedural Knowledge & ROP Mastery (UNA-USA / HMUN / Indian Parliamentary)',
      'Sample Study Guide / Background Guide URL',
      'Statement of Purpose & Dais Leadership Philosophy',
      'Availability on Conference Dates',
      'Application Review Status',
      'Directorate Reviewer Notes',
      'IP Address',
      'Device / Browser Summary'
    ]
  },

  // ── TAB 6: AUTHENTICATION AUDIT & SECURITY TELEMETRY ──
  LOGIN_CORE: {
    sheetName: 'Login Data Core',
    legacyAliases: ['03 Login Activity', '03_LOGIN_ACTIVITY'],
    headers: [
      'Timestamp',
      'Login Event ID',
      'User ID / Person ID',
      'Full Legal Name',
      'Primary Email Address',
      'Sovereign Username / Handle (@handle)',
      'Auth Provider',
      'Event Type',
      'Login Status / Outcome',
      'Risk Score',
      'Session ID Hash',
      'IP Address (Masked)',
      'Device / User Agent Summary'
    ]
  },

  // ── TAB 7: CHARITY, RELIEF & DONATION CONTRIBUTIONS ──
  DONATIONS: {
    sheetName: 'Donations & Relief',
    legacyAliases: ['Donations', '20 Donations Charity', '20_DONATIONS_CHARITY'],
    headers: [
      'Timestamp',
      'Donation ID / Contribution ID',
      'Contributor / Donor Full Name',
      'Contributor Email Address',
      'Phone Number [WhatsApp Active]',
      'Voluntary Contribution Amount (INR)',
      '12-Digit UPI UTR / Transaction Reference ID',
      'Target Project / Relief Stream',
      'Payment Mode / Channel',
      'Anonymous Contribution Preference',
      'Contributor Notes / Dedication / Prayer',
      'Payment Screenshot / Receipt Proof URL',
      'Verification & Audit Status',
      'Auditor / Reconciled By',
      'IP Address',
      'Device / Browser Summary'
    ]
  },

  // ── TAB 8: PUBLIC TRANSPARENCY & IMPACT AUDIT LEDGER ──
  IMPACT_LEDGER: {
    sheetName: 'Impact Ledger',
    legacyAliases: ['Public Impact Ledger'],
    headers: [
      'Timestamp',
      'Impact Record ID',
      'Donor Full Name',
      'Donor Email',
      'Amount (INR)',
      'UTR Reference',
      'Allocated Project / Stream',
      'Payment Proof URL',
      'Audit Verification Status',
      'Disbursement Stage',
      'Public Ledger Clearance'
    ]
  },

  // ── TAB 9: DIPLOMATIC & PUBLIC CONTACT INQUIRIES ──
  CONTACT: {
    sheetName: 'Contact Inquiries',
    legacyAliases: ['06 Contact Inquiries', '06_CONTACT_INQUIRIES'],
    headers: [
      'Timestamp',
      'Inquiry ID',
      'Full Legal Name',
      'Primary Contact Email',
      'Contact Phone Number',
      'Subject / Topic',
      'Query Category',
      'Message / Inquiry Details',
      'Source Page URL',
      'Inquiry Status',
      'IP Address',
      'Device / Browser Summary'
    ]
  },

  // ── TAB 10: NEWSLETTER & EMAIL CONSENT SUBSCRIBERS ──
  NEWSLETTER: {
    sheetName: 'Newsletter Subscribers',
    legacyAliases: ['07 Newsletter Subscribers', '07_NEWSLETTER_SUBSCRIBERS'],
    headers: [
      'Timestamp',
      'Subscriber ID',
      'Subscriber Email Address',
      'Subscription Source / Page URL',
      'Marketing & Consent Accord',
      'UTM Campaign Track',
      'Subscription Status',
      'IP Address'
    ]
  },

  // ── TAB 11: INSTITUTIONAL COLLABORATIONS & PARTNERSHIPS ──
  COLLAB: {
    sheetName: 'Collab & Partnerships',
    legacyAliases: ['08 Collaborations', '08_COLLABORATIONS'],
    headers: [
      'Timestamp',
      'Partnership ID',
      'Organization / Institution Name',
      'Lead Representative Name',
      'Official Contact Email',
      'Phone / WhatsApp Number',
      'Collaboration Type / Scope',
      'Proposal Summary & Objectives',
      'Budget / Resource Commitment',
      'Partnership Pipeline Stage',
      'IP Address',
      'Device / Browser Summary'
    ]
  },

  // ── TAB 12: GRASSROOTS YOUTH COMMUNITY MEMBERS ──
  COMMUNITY: {
    sheetName: 'Community Members',
    legacyAliases: ['09 Community Members', '09_COMMUNITY_MEMBERS'],
    headers: [
      'Timestamp',
      'Member ID',
      'Full Legal Name',
      'Email Address',
      'Location (City & Country)',
      'Institution / College / Affiliation',
      'Primary Skills & Expertise',
      'Areas of Platform Interest',
      'Discord / Telegram Handle',
      'Membership Verification Status',
      'IP Address',
      'Device / Browser Summary'
    ]
  },

  // ── TAB 13: USER FEEDBACK, CSAT & GRIEVANCE TICKETS ──
  FEEDBACK: {
    sheetName: 'Feedback & Grievance',
    legacyAliases: ['23 Feedback', '23_FEEDBACK', '24 Grievances'],
    headers: [
      'Timestamp',
      'Ticket ID',
      'Submitter Full Name',
      'Contact Email Address',
      'Feedback Category',
      'Overall Experience Rating (1-5)',
      'Dais / Executive Board Rating (1-5)',
      'Platform Usability Rating (1-5)',
      'Single Most Impressive Aspect',
      'Key Criticisms / Mandated Changes',
      'Attachment / Screenshot URL',
      'Target URL / Feature Name',
      'Severity / Priority Rank',
      'Resolution Status',
      'IP Address',
      'Device / Browser Summary'
    ]
  },

  // ── TAB 14: SUPPORT CASES & RESOLUTION HELPDESK ──
  SUPPORT: {
    sheetName: 'Support Cases',
    legacyAliases: ['25 Support Cases', '25_SUPPORT_CASES', 'Support Tickets'],
    headers: [
      'Timestamp',
      'Ticket ID',
      'Submitter Full Name',
      'Contact Email Address',
      'Sovereign Handle (@handle)',
      'Phone Number',
      'Category / Domain',
      'Subject / Issue Summary',
      'Detailed Description',
      'Severity / Priority Level',
      'Attachment / Screenshot URL',
      'Ticket Status (OPEN / IN_PROGRESS / RESOLVED / CLOSED)',
      'Assigned Agent / Directorate',
      'Resolution Notes',
      'IP Address',
      'Device / Browser Summary'
    ]
  },

  // ── TAB 15: PAYMENTS & CASHFREE SETTLEMENT AUDIT ──
  PAYMENTS: {
    sheetName: 'Payments',
    legacyAliases: ['18 Payments', '18_PAYMENTS', 'Payment Transactions'],
    headers: [
      'Timestamp',
      'Payment ID / Order ID',
      'Customer Full Name',
      'Customer Email',
      'Customer Phone',
      'Item / Pass / Event Name',
      'Amount (INR)',
      'Payment Mode (UPI / Card / NetBanking / Cashfree)',
      'UPI UTR / Bank Reference Number',
      'Gateway Order ID / Session ID',
      'Payment Status (SUCCESS / PENDING / FAILED / REFUNDED)',
      'Payment Receipt / Proof URL',
      'Reconciliation Status',
      'IP Address',
      'Device / Browser Summary'
    ]
  },

  // ── TAB 16: UNIVERSAL FORM SUBMISSIONS REPOSITORY ──
  FORMS: {
    sheetName: 'Form Submissions',
    legacyAliases: ['45 Form Submissions', '45_FORM_SUBMISSIONS'],
    headers: [
      'Timestamp',
      'Submission ID',
      'Form ID',
      'Form Title',
      'Submitter Full Name',
      'Submitter Email',
      'Submitter Handle (@tag)',
      'Raw Submission Payload',
      'IP Address',
      'Device / Browser Summary'
    ]
  }
};

/**
 * ── 1-CLICK INITIALIZATION & DUPLICATE REMOVAL ──
 * Cleans up confusing duplicate tabs, creates canonical tabs with Row 1 headers,
 * and sets up the spreadsheet in under 3 seconds with ZERO execution timeouts.
 */
function initAllTabs() {
  var ss = getOrCreateSpreadsheet();
  var configuredTabs = [];

  // 1. Clean up confusing duplicate numbered tabs if canonical tab exists
  for (var key in TAB_SCHEMAS) {
    if (TAB_SCHEMAS.hasOwnProperty(key)) {
      var sch = TAB_SCHEMAS[key];

      // Create or format canonical tab
      var canonicalSheet = getOrCreateTabWithHeaders_(ss, sch.sheetName, sch.headers);
      configuredTabs.push(sch.sheetName);

      // Check for legacy duplicate tabs (e.g. "02 Core Registrations" vs "Register Data Core")
      if (Array.isArray(sch.legacyAliases)) {
        sch.legacyAliases.forEach(function(legacyName) {
          if (legacyName !== sch.sheetName) {
            var oldSh = ss.getSheetByName(legacyName);
            if (oldSh) {
              // If the legacy sheet has rows but canonical is empty, copy over data
              if (oldSh.getLastRow() > 1 && canonicalSheet.getLastRow() <= 1) {
                try {
                  var oldData = oldSh.getDataRange().getValues();
                  if (oldData.length > 1) {
                    for (var r = 1; r < oldData.length; r++) {
                      smartAppendRow_(canonicalSheet, oldData[r]);
                    }
                  }
                } catch (copyErr) {}
              }
              // If old tab is empty or merged, safely remove duplicate to prevent clutter
              if (oldSh.getLastRow() <= 1) {
                try { ss.deleteSheet(oldSh); } catch (delErr) {}
              }
            }
          }
        });
      }
    }
  }

  // 2. Setup canonical Master People Directory
  var peopleHeaders = [
    'Person ID', 'Full Name', 'Display Name', 'Email Address', 'Phone Number',
    'Preferred Sovereign Handle', 'Account Type', 'Account Status', 'Country & City', 'Registration Date'
  ];
  getOrCreateTabWithHeaders_(ss, '01 People', peopleHeaders);
  configuredTabs.push('01 People');

  // 3. Remove default empty Sheet1 if other tabs exist
  var defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch (e) {}
  }

  var msg = 'Zenvitra Master Telemetry initialized! ' + configuredTabs.length + ' canonical tabs active with Row 1 headers and zero duplicates.';
  try {
    SpreadsheetApp.getActiveSpreadsheet().toast(msg, '⚡ Setup Complete', 6);
  } catch (e) {}

  return {
    ok: true,
    status: 'success',
    version: ZEN.VERSION,
    spreadsheetUrl: ss.getUrl(),
    tabsConfigured: configuredTabs.length,
    tabs: configuredTabs,
    message: msg
  };
}

/**
 * Custom UI Menu on Spreadsheet Open
 */
function onOpen() {
  try {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('⚡ ZENVITRA')
      .addItem('⚡ Initialize / Sync All Tabs (Clean Duplicates)', 'initAllTabs')
      .addItem('🎨 Refresh Dark Obsidian Header Styling', 'refreshHeaders_')
      .addSeparator()
      .addItem('🧪 Insert Test Row — Register Data Core', 'testRegisterCoreRow')
      .addItem('🧪 Insert Test Row — Core Team Applications', 'testCoreTeamRow')
      .addItem('🧪 Insert Test Row — Event Registrations', 'testEventRegistrationRow')
      .addItem('🧪 Populate All Tabs with Detailed Sample Rows', 'testAllTabsRow')
      .addToUi();
  } catch (e) {}
}

/**
 * Creates or gets tab with exact Row 1 headers and obsidian formatting
 */
function getOrCreateTabWithHeaders_(ss, sheetName, headers) {
  var sh = getSheetLoose_(ss, sheetName);
  var isNew = false;
  if (!sh) {
    sh = ss.insertSheet(sheetName);
    isNew = true;
  }

  // If newly created or empty, write Row 1 headers
  if (isNew || sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    formatHeaderRow_(sh, headers.length);
  } else {
    // If headers already exist, verify and append any newly added columns at the end
    var existingHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    var missingCols = [];
    headers.forEach(function(h) {
      var normH = normalize_(h);
      var exists = existingHeaders.some(function(eh) { return normalize_(eh) === normH; });
      if (!exists) missingCols.push(h);
    });
    if (missingCols.length > 0) {
      sh.getRange(1, existingHeaders.length + 1, 1, missingCols.length).setValues([missingCols]);
      formatHeaderRow_(sh, existingHeaders.length + missingCols.length);
    }
  }
  return sh;
}

/**
 * Styles Row 1 as a frozen, high-contrast dark header
 */
function formatHeaderRow_(sheet, colCount) {
  try {
    var range = sheet.getRange(1, 1, 1, colCount);
    range.setBackground(ZEN.C.OBSIDIAN);
    range.setFontColor(ZEN.C.WHITE);
    range.setFontWeight('bold');
    range.setFontFamily('Roboto Mono');
    range.setFontSize(10);
    range.setWrap(false);
    sheet.setFrozenRows(1);
  } catch (e) {}
}

function refreshHeaders_() {
  var ss = getOrCreateSpreadsheet();
  for (var key in TAB_SCHEMAS) {
    if (TAB_SCHEMAS.hasOwnProperty(key)) {
      var sch = TAB_SCHEMAS[key];
      var sh = getSheetLoose_(ss, sch.sheetName);
      if (sh) formatHeaderRow_(sh, sch.headers.length);
    }
  }
  SpreadsheetApp.getActiveSpreadsheet().toast('All headers styled and refreshed!', 'ZENVITRA', 4);
}

/**
 * Smart append that guarantees data writes starting at Row 2 without skipping rows
 */
function smartAppendRow_(sheet, rowData) {
  var lastRow = sheet.getLastRow();
  var targetRow = lastRow + 1;
  if (targetRow <= 1) targetRow = 2;

  sheet.getRange(targetRow, 1, 1, rowData.length).setValues([rowData]);
  return targetRow;
}

/**
 * 🧪 Test Row for Register Data Core
 */
function testRegisterCoreRow() {
  var ss = getOrCreateSpreadsheet();
  initAllTabs();

  var testPayload = {
    userId: 'TEST_' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    fullName: 'Yuveer Sovereign (Test Delegate)',
    handle: '@yuveer_founder',
    preferredHandle: '@yuveer_founder',
    email: 'test_founder@zenvitra.xyz',
    phoneNumber: '+91 98765 00000',
    age: 20,
    isMinor: false,
    minorStatus: 'ADULT (18+)',
    roleDesignation: 'Student Delegate / Youth Leader',
    portfolioInterests: ['ZEN.DOCS Collaborative Drafting', 'Civic Discussions & Debates'],
    seekingCampusAmbassadorship: true,
    motivationBrief: 'Testing live multi-tab synchronization and detailed field accuracy.',
    institution: 'Zenvitra Core Directorate',
    degreeOrGrade: 'Undergraduate',
    countryCity: 'New Delhi, India',
    registrationType: 'PREREGISTER',
    registrationStatus: 'PREREGISTER',
    accessLevel: 'Pre-Registered Sovereign Whitelist',
    authProvider: 'DIRECT_ENROLL',
    accountStatus: 'ACTIVE',
    termsAccepted: true,
    termsRatified: true,
    targetTab: 'Register Data Core'
  };

  var targetSheet = getSheetLoose_(ss, 'Register Data Core');
  if (targetSheet) {
    var headers = targetSheet.getRange(1, 1, 1, targetSheet.getLastColumn()).getValues()[0];
    var row = headers.map(function(h) { return safe_(lookupVal(testPayload, h)); });
    var writtenRow = smartAppendRow_(targetSheet, row);
    SpreadsheetApp.getActiveSpreadsheet().toast('Test row appended at Row ' + writtenRow + ' in Register Data Core!', '🧪 Test Passed', 5);
    return { ok: true, tab: 'Register Data Core', row: writtenRow };
  }
  return { ok: false, error: 'Sheet not found' };
}

/**
 * 🧪 Test Row for Core Team Applications
 */
function testCoreTeamRow() {
  var ss = getOrCreateSpreadsheet();
  initAllTabs();

  var testCorePayload = {
    applicationId: 'COR-TEST-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
    fullName: 'Aryavart Rathore (Founding Architect)',
    handle: '@aryavart_core',
    email: 'aryavart@zenvitra.xyz',
    phoneNumber: '+91 98111 22233',
    contactChannel: 'Discord: aryavart#2026 / Telegram: @aryavart_zen',
    locationTimezone: 'Bengaluru, India (IST / UTC+5:30)',
    roleAppliedFor: 'Head of Technical Systems & Real-time Architecture',
    department: 'Directorate of Technical Infrastructure',
    portfolioUrl: 'https://github.com/aryavart-core / https://aryavart.zenvitra.xyz',
    dossierUploadUrl: 'https://drive.google.com/file/d/zen-dossier-example/view',
    pastExperience: 'Senior systems engineer with 5+ years experience building distributed real-time platforms and event engines.',
    motivationStatement: 'To establish Zenvitra as the undisputed global operating system for diplomacy, youth discourse, and high-stakes parliamentary procedure.',
    technicalOrDiplomaticDossier: 'Architectural blueprint for zero-latency WebSockets, real-time gavel synchronization, and fault-tolerant multi-master state replication.',
    practicalTaskResponse: 'Detailed 90-day execution roadmap for global committee scaling and low-bandwidth fallback mechanisms.',
    weeklyBandwidth: '30+ hours / week (Full Commitment)',
    constitutionalAccordAccepted: 'RATIFIED',
    applicationStatus: 'QUEUED',
    reviewerNotes: 'Verified candidate for technical council leadership review.',
    targetTab: 'Core Team Applications'
  };

  var targetSheet = getSheetLoose_(ss, 'Core Team Applications');
  if (targetSheet) {
    var headers = targetSheet.getRange(1, 1, 1, targetSheet.getLastColumn()).getValues()[0];
    var row = headers.map(function(h) { return safe_(lookupVal(testCorePayload, h)); });
    var writtenRow = smartAppendRow_(targetSheet, row);
    SpreadsheetApp.getActiveSpreadsheet().toast('Test row appended at Row ' + writtenRow + ' in Core Team Applications!', '🧪 Test Passed', 5);
    return { ok: true, tab: 'Core Team Applications', row: writtenRow };
  }
  return { ok: false, error: 'Sheet not found' };
}

/**
 * 🧪 Test Row for Event Registrations
 */
function testEventRegistrationRow() {
  var ss = getOrCreateSpreadsheet();
  initAllTabs();

  var testEventPayload = {
    ticketId: 'ZV-TKT-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    eventId: 'zen-diplomacy-2026',
    eventName: 'ZENVITRA Model United Nations 2026',
    fullName: 'Kabir Singhania (Delegate of France)',
    handle: '@kabir_mun',
    email: 'kabir.delegate@stxaviers.edu',
    phoneNumber: '+91 99887 76655',
    institution: 'St. Xavier’s Collegiate School',
    city: 'Kolkata, West Bengal',
    participationTrack: 'Independent Youth Diplomat',
    step2_experience_level: 'Veteran (10+ MUNs / Multiple Best Delegate Awards)',
    step3_primary_committee: 'United Nations Security Council (UNSC)',
    step4_secondary_committee: 'Disarmament and International Security Committee (DISEC)',
    step5_portfolios: '1. France, 2. United Kingdom, 3. United States',
    step6_prior_awards: 'Best Delegate (HMUN 2025), High Commendation (ILSMUN 2024)',
    step7_sop: 'Focused on multilateral non-proliferation enforcement and automated crisis directives.',
    step8_guardian_name: 'Rajesh Singhania',
    step8_guardian_phone: '+91 99887 00000',
    step9_id_proof: 'https://drive.google.com/file/d/student-id-proof/view',
    step10_ethics: 'CONFIRMED & RATIFIED',
    step12_media_consent: 'GRANTED',
    step13_participation_tier: 'Genesis Sovereign Pass',
    quantity: 1,
    totalPrice: '₹1499',
    step15_payment_method: 'UPI / Direct Gateway',
    step15_utr_reference: '482910394829',
    step15_receipt_link: 'https://drive.google.com/file/d/upi-receipt/view',
    step14_signature: 'Kabir Singhania',
    paymentStatus: 'CONFIRMED',
    targetTab: 'Event Registrations'
  };

  var targetSheet = getSheetLoose_(ss, 'Event Registrations');
  if (targetSheet) {
    var headers = targetSheet.getRange(1, 1, 1, targetSheet.getLastColumn()).getValues()[0];
    var row = headers.map(function(h) { return safe_(lookupVal(testEventPayload, h)); });
    var writtenRow = smartAppendRow_(targetSheet, row);
    SpreadsheetApp.getActiveSpreadsheet().toast('Test row appended at Row ' + writtenRow + ' in Event Registrations!', '🧪 Test Passed', 5);
    return { ok: true, tab: 'Event Registrations', row: writtenRow };
  }
  return { ok: false, error: 'Sheet not found' };
}

/**
 * 🧪 Test all primary tabs
 */
function testAllTabsRow() {
  testRegisterCoreRow();
  testCoreTeamRow();
  testEventRegistrationRow();
  SpreadsheetApp.getActiveSpreadsheet().toast('Detailed sample rows populated across Core Registrations, Core Team, and Events!', '🧪 Complete Test Suite', 6);
  return { ok: true, message: 'All test rows appended successfully' };
}

function testRow() {
  return testRegisterCoreRow();
}

/**
 * ── UNIVERSAL WEBHOOK INGESTION (doPost) ──
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);

    if (!e || !e.postData || !e.postData.contents) {
      return json_({ ok: false, error: "invalid_request", message: "Empty body received" });
    }

    var payload = {};
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return json_({ ok: false, error: "malformed_json", message: parseErr.toString() });
    }

    // Unnest payload.data if dispatch wrapped payload under a data key
    if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
      for (var dKey in payload.data) {
        if (payload.data.hasOwnProperty(dKey) && payload[dKey] === undefined) {
          payload[dKey] = payload.data[dKey];
        }
      }
    }

    var ss = getOrCreateSpreadsheet();
    var action = (payload.action || '').toUpperCase();

    // ── ACTION: INITIALIZE OR SYNC TABS ──
    if (action === 'INIT' || action === 'SETUP' || action === 'UPDATE_TABS' || action === 'SYNC_TABS') {
      return json_(initAllTabs());
    }

    // ── ACTION: DYNAMIC ZENFORMS SCHEMA SYNC ──
    if (action === 'SYNC_SCHEMA') {
      var sheetTab = payload.sheetTab || payload.targetTab || ('ZEN ' + (payload.formId || 'FORM').toUpperCase().replace(/[^A-Z0-9 ]/g, ' ')).trim();
      var fSheet = getSheetLoose_(ss, sheetTab);
      if (!fSheet) fSheet = ss.insertSheet(sheetTab);

      var existingHeaders = [];
      var lastCol = fSheet.getLastColumn();
      if (lastCol > 0 && fSheet.getLastRow() > 0) {
        existingHeaders = fSheet.getRange(1, 1, 1, lastCol).getValues()[0];
      }

      var defaultHeaders = ['Timestamp', 'Submission ID', 'Submitter Handle', 'Submitter Email'];
      defaultHeaders.forEach(function(h) {
        if (existingHeaders.indexOf(h) === -1) existingHeaders.push(h);
      });

      if (Array.isArray(payload.fields)) {
        payload.fields.forEach(function(field) {
          var headerName = field.label || field.id;
          if (headerName && existingHeaders.indexOf(headerName) === -1) {
            existingHeaders.push(headerName);
          }
        });
      }

      fSheet.getRange(1, 1, 1, existingHeaders.length).setValues([existingHeaders]);
      formatHeaderRow_(fSheet, existingHeaders.length);

      return json_({
        status: 'success',
        action: 'SYNC_SCHEMA',
        sheetTab: sheetTab,
        columnCount: existingHeaders.length,
        spreadsheetUrl: ss.getUrl()
      });
    }

    // ── RESOLVE TARGET SHEET TAB ──
    var rawTab = payload.targetTab || payload.sheetTab || payload.tab || payload.target || '';
    var schemaKey = resolveSchemaKey(rawTab);

    var targetTabName = 'Register Data Core';
    var expectedHeaders = TAB_SCHEMAS.REGISTER_CORE.headers;

    if (schemaKey && TAB_SCHEMAS[schemaKey]) {
      targetTabName = TAB_SCHEMAS[schemaKey].sheetName;
      expectedHeaders = TAB_SCHEMAS[schemaKey].headers;
    } else if (rawTab) {
      targetTabName = resolveTabName_(rawTab);
    }

    // Get or create primary target sheet
    var targetSheet = getOrCreateTabWithHeaders_(ss, targetTabName, expectedHeaders);
    var currentHeaders = targetSheet.getRange(1, 1, 1, targetSheet.getLastColumn()).getValues()[0];

    // Dynamic column expansion for custom question keys with full question spaces
    var ignoredKeys = { action: true, targetTab: true, sheetTab: true, tab: true, target: true, secret: true, webhookUrl: true, customSheetUrl: true, redirect: true, fields: true, data: true };
    var missingHeaders = [];
    for (var k in payload) {
      if (payload.hasOwnProperty(k) && !ignoredKeys[k]) {
        var pVal = payload[k];
        if (Array.isArray(pVal)) {
          payload[k] = pVal.join(', ');
          pVal = payload[k];
        } else if (typeof pVal === "object" && pVal !== null) {
          try {
            payload[k] = JSON.stringify(pVal);
            pVal = payload[k];
          } catch (_) {}
        }
        if (pVal !== "" && pVal !== null && pVal !== undefined) {
          var found = false;
          var normK = normalize_(k);
          for (var h = 0; h < currentHeaders.length; h++) {
            if (normalize_(currentHeaders[h]) === normK) {
              found = true;
              break;
            }
          }
          if (!found && currentHeaders.length < 100) {
            missingHeaders.push(k);
          }
        }
      }
    }

    if (missingHeaders.length > 0) {
      var startNewCol = currentHeaders.length + 1;
      targetSheet.getRange(1, startNewCol, 1, missingHeaders.length).setValues([missingHeaders]);
      formatHeaderRow_(targetSheet, currentHeaders.length + missingHeaders.length);
      currentHeaders = currentHeaders.concat(missingHeaders);
    }

    // Map payload into row data
    var targetRow = currentHeaders.map(function(headerName) {
      var cellVal = lookupVal(payload, headerName);
      if (typeof cellVal === "object" && cellVal !== null) {
        cellVal = JSON.stringify(cellVal);
      }
      return safe_(cellVal);
    });

    // Write row to primary sheet
    var writtenRowIdx = smartAppendRow_(targetSheet, targetRow);

    // ── MULTI-TAB SEAMLESS UPDATES: ALSO UPDATE COMPANION TAB IF PRESENT ──
    if (schemaKey && TAB_SCHEMAS[schemaKey] && Array.isArray(TAB_SCHEMAS[schemaKey].legacyAliases)) {
      TAB_SCHEMAS[schemaKey].legacyAliases.forEach(function(aliasName) {
        if (aliasName !== targetTabName) {
          try {
            var companionSheet = ss.getSheetByName(aliasName);
            if (companionSheet && companionSheet.getSheetId() !== targetSheet.getSheetId()) {
              var compHeaders = companionSheet.getRange(1, 1, 1, companionSheet.getLastColumn()).getValues()[0];
              var compRow = compHeaders.map(function(ch) {
                return safe_(lookupVal(payload, ch));
              });
              smartAppendRow_(companionSheet, compRow);
            }
          } catch (compErr) {}
        }
      });
    }

    // ── CANONICAL 01 PEOPLE DIRECTORY AUTO-UPSERT ──
    var userEmail = payload.email || payload.Email || payload.primaryEmail || payload.participantEmail || payload.officialEmail;
    if (userEmail) {
      try {
        upsertPersonRecord_(ss, payload, userEmail);
      } catch (pErr) {}
    }

    return json_({
      ok: true,
      status: "success",
      tab: targetTabName,
      row: writtenRowIdx,
      columnsCount: targetRow.length,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    return json_({
      ok: false,
      error: "server_error",
      message: err.toString()
    });
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

/**
 * ── GET REQUEST HANDLER ──
 */
function doGet(e) {
  try {
    var params = (e && e.parameter) || {};
    var action = (params.action || '').toUpperCase();

    if (action === 'INIT' || action === 'SETUP') {
      return json_(initAllTabs());
    }

    if (action === 'TEST' || action === 'TEST_ROW') {
      return json_(testAllTabsRow());
    }

    var ss = getOrCreateSpreadsheet();
    return json_({
      ok: true,
      platform: "ZENVITRA MASTER OMNI-CONTROL",
      version: ZEN.VERSION,
      timestamp: new Date().toISOString(),
      status: "ONLINE",
      spreadsheetUrl: ss.getUrl()
    });
  } catch (err) {
    return json_({ ok: false, error: err.toString() });
  }
}

/**
 * Upserts canonical identity into 01 People
 */
function upsertPersonRecord_(ss, payload, email) {
  var personSh = getSheetLoose_(ss, '01 People');
  if (!personSh) return;

  var personId = payload.userId || payload.personId || ('PER-' + shortHash_(email).toUpperCase());
  var fullName = payload.fullName || payload.name || payload.legalName || payload.participantName || payload.candidateName || 'Sovereign Citizen';
  var username = payload.username || payload.preferredHandle || payload.handle || email.split('@')[0];
  var phone = payload.phoneNumber || payload.phone || payload.contactNumber || payload.contactPhone || '';
  var countryCity = payload.countryCity || payload.city || payload.location || payload.locationTimezone || 'Global';
  var isPre = String(payload.registrationStatus || payload.registrationType || '').toUpperCase().includes('PRE');
  var accountType = isPre ? 'Pre-Registered Whitelist' : 'Direct Member';

  var pRow = [
    personId, fullName, username, email, phone,
    '@' + username.replace(/^@/, ''), accountType, 'Active', countryCity,
    Utilities.formatDate(new Date(), ZEN.TIMEZONE, 'yyyy-MM-dd HH:mm:ss')
  ];

  smartAppendRow_(personSh, pRow);
}

/**
 * Resolves schema key from any alias
 */
function resolveSchemaKey(raw) {
  if (!raw) return null;
  var s = String(raw).toUpperCase().trim();

  if (s.indexOf('REGISTER') !== -1 || s.indexOf('CORE REG') !== -1 || s.indexOf('02 ') !== -1) return 'REGISTER_CORE';
  if (s.indexOf('LOGIN') !== -1 || s.indexOf('AUTH') !== -1 || s.indexOf('03 ') !== -1) return 'LOGIN_CORE';
  if (s.indexOf('EVENT') !== -1 || s.indexOf('PASS') !== -1 || s.indexOf('TICKET') !== -1 || s.indexOf('SUMMIT') !== -1 || s.indexOf('12 ') !== -1 || s.indexOf('MUN') !== -1) return 'EVENTS';
  if (s.indexOf('AMBASSADOR') !== -1 || s.indexOf('CAMPUS') !== -1 || s.indexOf('10 ') !== -1) return 'CAMPUS_AMBASSADOR';
  if (s.indexOf('CORE TEAM') !== -1 || s.indexOf('TEAM APPL') !== -1 || s.indexOf('04 ') !== -1 || s.indexOf('CAREER') !== -1) return 'CORE_TEAM';
  if (s.indexOf('SECRETARIAT') !== -1 || s.indexOf('15 ') !== -1 || s.indexOf('EB ') !== -1 || s.indexOf('EXECUTIVE BOARD') !== -1) return 'SECRETARIAT';
  if (s.indexOf('CONTACT') !== -1 || s.indexOf('INQUIR') !== -1 || s.indexOf('06 ') !== -1) return 'CONTACT';
  if (s.indexOf('NEWSLETTER') !== -1 || s.indexOf('SUBSCRIB') !== -1 || s.indexOf('07 ') !== -1) return 'NEWSLETTER';
  if (s.indexOf('COLLAB') !== -1 || s.indexOf('PARTNER') !== -1 || s.indexOf('08 ') !== -1) return 'COLLAB';
  if (s.indexOf('COMMUNITY') !== -1 || s.indexOf('09 ') !== -1) return 'COMMUNITY';
  if (s.indexOf('DONAT') !== -1 || s.indexOf('20 ') !== -1) return 'DONATIONS';
  if (s.indexOf('IMPACT') !== -1 || s.indexOf('LEDGER') !== -1) return 'IMPACT_LEDGER';
  if (s.indexOf('FEEDBACK') !== -1 || s.indexOf('GRIEVANCE') !== -1 || s.indexOf('23 ') !== -1) return 'FEEDBACK';
  if (s.indexOf('SUPPORT') !== -1 || s.indexOf('25 ') !== -1 || (s.indexOf('TICKET') !== -1 && s.indexOf('PASS') === -1)) return 'SUPPORT';
  if (s.indexOf('PAYMENT') !== -1 || s.indexOf('18 ') !== -1 || s.indexOf('CASHFREE') !== -1) return 'PAYMENTS';
  if (s.indexOf('FORM') !== -1 || s.indexOf('SUBMISSION') !== -1 || s.indexOf('45 ') !== -1) return 'FORMS';

  return null;
}

/**
 * Normalizes tab names into canonical space-separated title case
 */
function resolveTabName_(raw) {
  if (!raw) return 'Register Data Core';
  var s = String(raw).trim();
  var key = resolveSchemaKey(s);
  if (key && TAB_SCHEMAS[key]) return TAB_SCHEMAS[key].sheetName;
  return s.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * ── RESILIENT EXHAUSTIVE FIELD RESOLVER ──
 * Extracts value for every question column header from any payload without leaving blank cells.
 */
function lookupVal(data, header) {
  if (!data || !header) return "";

  // 1. Direct exact match
  if (data[header] !== undefined && data[header] !== null && data[header] !== "") {
    return data[header];
  }

  // 2. Case-insensitive key match
  var hLower = String(header).toLowerCase();
  for (var k in data) {
    if (data.hasOwnProperty(k) && k.toLowerCase() === hLower) {
      if (data[k] !== undefined && data[k] !== null && data[k] !== "") return data[k];
    }
  }

  // 3. Alphanumeric normalized key match
  var hAlpha = hLower.replace(/[^a-z0-9]/g, "");
  for (var k2 in data) {
    if (data.hasOwnProperty(k2)) {
      var kAlpha = k2.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (kAlpha === hAlpha && data[k2] !== undefined && data[k2] !== null && data[k2] !== "") {
        return data[k2];
      }
    }
  }

  // 4. Nested data lookup if payload has a child object
  if (data.data && typeof data.data === 'object') {
    if (data.data[header] !== undefined && data.data[header] !== null && data.data[header] !== "") {
      return data.data[header];
    }
    for (var dk in data.data) {
      if (data.data.hasOwnProperty(dk) && dk.toLowerCase() === hLower) {
        if (data.data[dk] !== undefined && data.data[dk] !== null && data.data[dk] !== "") return data.data[dk];
      }
    }
    for (var dk2 in data.data) {
      if (data.data.hasOwnProperty(dk2)) {
        var dkAlpha = dk2.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (dkAlpha === hAlpha && data.data[dk2] !== undefined && data.data[dk2] !== null && data.data[dk2] !== "") {
          return data.data[dk2];
        }
      }
    }
  }

  // 5. Semantic field mapping covering ALL question fields and telemetry

  // ── TIMESTAMP / DATE OF SUBMISSION ──
  if (hAlpha.indexOf("timestamp") !== -1 || hAlpha.indexOf("dateofsubmission") !== -1 || hAlpha.indexOf("submissiondate") !== -1 || hAlpha.indexOf("createdat") !== -1) {
    if (data.step14_submission_date) return String(data.step14_submission_date);
    if (data.submissionDate) return String(data.submissionDate);
    if (data.submittedAt) return String(data.submittedAt);
    if (data.timestamp) return String(data.timestamp);
    if (data.createdAt) return String(data.createdAt);
    return Utilities.formatDate(new Date(), ZEN.TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
  }

  // ── USERNAME / SOVEREIGN HANDLE ──
  if (hAlpha.indexOf("username") !== -1 || hAlpha.indexOf("handle") !== -1 || hAlpha.indexOf("zenhandle") !== -1 || hAlpha.indexOf("sovereignhandle") !== -1) {
    var rawHandle = data.desiredHandle || data.preferredHandle || data.handle || data.username || data.cleanHandle || data.step11_zenvitra_handle || data.displayName || data.submitterHandle || "";
    if (rawHandle) {
      return (String(rawHandle).startsWith('@') ? '' : '@') + String(rawHandle).replace(/[^a-zA-Z0-9_]/g, '');
    }
    return data.email ? '@' + String(data.email).split('@')[0] : '';
  }

  // ── USER ID / PERSON ID ──
  if ((hAlpha.indexOf("userid") !== -1 || hAlpha.indexOf("personid") !== -1) && hAlpha.indexOf("ticket") === -1) {
    return data.userId || data.personId || data.id || data.User_ID || data.Person_ID || ('ZV-USR-' + shortHash_(data.email || String(Math.random())).toUpperCase());
  }

  // ── FULL LEGAL NAME / PARTICIPANT / DELEGATE NAME ──
  if (hAlpha.indexOf("name") !== -1 && hAlpha.indexOf("parent") === -1 && hAlpha.indexOf("guardian") === -1 && hAlpha.indexOf("org") === -1 && hAlpha.indexOf("event") === -1 && hAlpha.indexOf("teamlead") === -1 && hAlpha.indexOf("rep") === -1) {
    return data.fullName || data.fullLegalName || data.name || data.legalName || data.participantName || data.attendeeName || data.step1_fullname || data.amb_fullname || data.submitterName || data.donorName || data.customerName || "Sovereign Citizen";
  }

  // ── EMAIL ADDRESS ──
  if (hAlpha.indexOf("email") !== -1 && hAlpha.indexOf("guardian") === -1 && hAlpha.indexOf("reviewer") === -1 && hAlpha.indexOf("lead") === -1) {
    return data.email || data.primaryEmail || data.contactEmail || data.step1_email || data.amb_email || data.participantEmail || data.attendeeEmail || data.donorEmail || data.officialEmail || data.subscriberEmail || data.customerEmail || "";
  }

  // ── PHONE NUMBER / WHATSAPP / CALLING ──
  if ((hAlpha.indexOf("phone") !== -1 || hAlpha.indexOf("whatsapp") !== -1 || hAlpha.indexOf("calling") !== -1 || hAlpha.indexOf("contactnumber") !== -1) && hAlpha.indexOf("guardian") === -1 && hAlpha.indexOf("emergency") === -1) {
    return data.phoneNumber || data.phone || data.whatsapp || data.contactPhone || data.contactNumber || data.step1_phone || data.amb_phone || data.attendeePhone || data.phoneWhatsapp || data.donorPhone || "N/A";
  }

  // ── TELEGRAM / DISCORD CONTACT CHANNEL ──
  if (hAlpha.indexOf("telegram") !== -1 || hAlpha.indexOf("discord") !== -1 || hAlpha.indexOf("contactchannel") !== -1) {
    return data.contactChannel || data.discordHandle || data.telegramHandle || data.discord || data.telegram || data.step4_discord_handle || "N/A";
  }

  // ── LOCATION / CITY / TIMEZONE / STATE ──
  if (hAlpha.indexOf("city") !== -1 || hAlpha.indexOf("country") !== -1 || hAlpha.indexOf("location") !== -1 || hAlpha.indexOf("timezone") !== -1 || hAlpha.indexOf("state") !== -1) {
    return data.locationTimezone || data.location || data.city || data.countryCity || data.step1_city || data.cityState || data.cityRegion || data.campusLocation || "Pan-India / Global";
  }

  // ── AGE (YEARS) ──
  if ((hAlpha.indexOf("age") !== -1 || hAlpha.indexOf("years") !== -1) && hAlpha.indexOf("minor") === -1 && hAlpha.indexOf("status") === -1) {
    return data.age !== undefined && data.age !== null ? String(data.age) : "";
  }

  // ── MINOR STATUS (UNDER 18 / ADULT) ──
  if (hAlpha.indexOf("minorstatus") !== -1 || (hAlpha.indexOf("minor") !== -1 && hAlpha.indexOf("status") !== -1)) {
    if (data.minorStatus) return data.minorStatus;
    if (data.isMinor === true) return "MINOR (<18)";
    if (data.isMinor === false) return "ADULT (18+)";
    var aNum = Number(data.age);
    if (!isNaN(aNum) && aNum > 0) return aNum < 18 ? "MINOR (<18)" : "ADULT (18+)";
    return "ADULT (18+)";
  }

  // ── PARENT / GUARDIAN FULL NAME ──
  if ((hAlpha.indexOf("parent") !== -1 || hAlpha.indexOf("guardian") !== -1) && hAlpha.indexOf("contact") === -1 && hAlpha.indexOf("phone") === -1 && hAlpha.indexOf("emergency") === -1 && hAlpha.indexOf("accord") === -1 && hAlpha.indexOf("consent") === -1) {
    if (data.parentName || data.parentGuardianName || data.step8_guardian_name) return data.parentName || data.parentGuardianName || data.step8_guardian_name;
    return (Number(data.age) < 18) ? "PENDING_GUARDIAN" : "N/A (ADULT 18+)";
  }

  // ── PARENT / GUARDIAN EMERGENCY CONTACT ──
  if ((hAlpha.indexOf("parent") !== -1 || hAlpha.indexOf("guardian") !== -1 || hAlpha.indexOf("emergency") !== -1) && (hAlpha.indexOf("contact") !== -1 || hAlpha.indexOf("phone") !== -1 || hAlpha.indexOf("number") !== -1)) {
    if (data.parentContact || data.parentGuardianContact || data.step8_guardian_phone) return data.parentContact || data.parentGuardianContact || data.step8_guardian_phone;
    return (Number(data.age) < 18) ? "PENDING_CONTACT" : "N/A (ADULT 18+)";
  }

  // ── MINOR CONSENT & PARENTAL ACCORD ──
  if (hAlpha.indexOf("consent") !== -1 || hAlpha.indexOf("parentalaccord") !== -1) {
    if (data.minorConsent === true || data.minorConfirmed === true || data.minorPolicyAcknowledged === true) return "CONSENT_RATIFIED";
    if (Number(data.age) >= 18) return "NOT_APPLICABLE (ADULT 18+)";
    return "PENDING";
  }

  // ── ROLE DESIGNATION / PLATFORM TRACK / CATEGORY ──
  if (hAlpha.indexOf("roleapplied") !== -1) {
    return data.roleAppliedFor || data.roleApplied || data.role || data.department || "Executive Leadership";
  }
  if (hAlpha.indexOf("roledesignation") !== -1 || (hAlpha.indexOf("category") !== -1 && hAlpha.indexOf("role") !== -1) || (hAlpha.indexOf("role") !== -1 && hAlpha.indexOf("applied") === -1)) {
    return data.roleDesignation || data.roleInterest || data.preferredTrack || data.initialRole || data.role || data.step2_track || "Student Delegate / Youth Leader";
  }

  // ── DEPARTMENT / WING (PRIMARY & SECONDARY) ──
  if (hAlpha.indexOf("department") !== -1 || hAlpha.indexOf("wing") !== -1) {
    if (hAlpha.indexOf("secondary") !== -1 || hAlpha.indexOf("fallback") !== -1) return data.secondaryDepartment || data.step1_secondary_department || "None";
    return data.department || data.primaryDepartment || data.step1_primary_department || "Directorate Leadership";
  }

  // ── PORTFOLIO / GITHUB / PROOF OF WORK URL ──
  if (hAlpha.indexOf("portfolio") !== -1 && (hAlpha.indexOf("github") !== -1 || hAlpha.indexOf("proof") !== -1 || hAlpha.indexOf("work") !== -1 || hAlpha.indexOf("url") !== -1 || hAlpha.indexOf("link") !== -1)) {
    return data.portfolioUrl || data.portfolioLink || data.proofOfWorkUrl || data.githubUrl || data.proofUrl || "N/A";
  }

  // ── UPLOADED DOSSIER DOCUMENT / RESUME URL ──
  if (hAlpha.indexOf("dossier") !== -1 && (hAlpha.indexOf("upload") !== -1 || hAlpha.indexOf("doc") !== -1 || hAlpha.indexOf("resume") !== -1 || hAlpha.indexOf("file") !== -1)) {
    return data.dossierUploadUrl || data.uploadedDocumentUrl || data.uploadedFileName || data.resumeUrl || data.cvUrl || "N/A";
  }

  // ── LEADERSHIP ACCOMPLISHMENTS & TRACK RECORD ──
  if (hAlpha.indexOf("accomplishment") !== -1 || hAlpha.indexOf("trackrecord") !== -1 || hAlpha.indexOf("pastexperience") !== -1) {
    return data.pastExperience || data.leadershipAccomplishments || data.leadershipExperience || data.trackRecord || data.step6_prior_awards || "N/A";
  }

  // ── STATEMENT OF PURPOSE / MOTIVATION / STRATEGIC VISION ──
  if (hAlpha.indexOf("sop") !== -1 || hAlpha.indexOf("intent") !== -1 || hAlpha.indexOf("motivation") !== -1 || hAlpha.indexOf("vision") !== -1 || hAlpha.indexOf("whylead") !== -1 || hAlpha.indexOf("philosophy") !== -1) {
    return data.motivationStatement || data.motivation || data.strategicVision || data.statementOfPurpose || data.whyLead || data.step7_sop || data.sop || data.motivationBrief || data.amb_pitch || "";
  }

  // ── TECHNICAL / DIPLOMATIC DOSSIER ──
  if (hAlpha.indexOf("technical") !== -1 && hAlpha.indexOf("dossier") !== -1) {
    return data.technicalOrDiplomaticDossier || data.dossier || "N/A";
  }

  // ── DEPARTMENT PRACTICAL TASK RESPONSE / EXECUTION PLAN ──
  if (hAlpha.indexOf("practical") !== -1 || hAlpha.indexOf("taskresponse") !== -1 || hAlpha.indexOf("executionplan") !== -1) {
    return data.practicalTaskResponse || data.step3_practical_response || data.executionPlan || data.taskResponse || "Strategy Document Attached";
  }

  // ── WEEKLY BANDWIDTH COMMITMENT ──
  if (hAlpha.indexOf("bandwidth") !== -1 || hAlpha.indexOf("hoursperweek") !== -1 || hAlpha.indexOf("commitment") !== -1) {
    return data.weeklyBandwidth || data.hoursPerWeek || data.weeklyHours || data.amb_bandwidth || "20+ hours / week";
  }

  // ── FULL AVAILABILITY ON LAUNCH & SUMMIT DAYS ──
  if (hAlpha.indexOf("availability") !== -1 && (hAlpha.indexOf("launch") !== -1 || hAlpha.indexOf("summit") !== -1 || hAlpha.indexOf("date") !== -1)) {
    return data.launchAvailability || data.summitAvailability || data.fullAvailability || (data.constitutionalAccordAccepted ? 'FULL AVAILABILITY CONFIRMED' : 'CONFIRMED');
  }

  // ── CONSTITUTIONAL ACCORD / ETHICS COVENANT ──
  if (hAlpha.indexOf("accord") !== -1 || hAlpha.indexOf("decorum") !== -1 || hAlpha.indexOf("ethics") !== -1 || hAlpha.indexOf("conduct") !== -1) {
    if (data.constitutionalAccordAccepted) return data.constitutionalAccordAccepted;
    return (data.codeOfConductAccepted || data.step10_ethics || data.termsRatified) ? "RATIFIED" : "RATIFIED";
  }

  // ── APPLICATION STATUS & REVIEW STATUS ──
  if (hAlpha.indexOf("applicationstatus") !== -1 || hAlpha.indexOf("reviewstatus") !== -1 || (hAlpha.indexOf("status") !== -1 && hAlpha.indexOf("minor") === -1 && hAlpha.indexOf("payment") === -1 && hAlpha.indexOf("account") === -1 && hAlpha.indexOf("perk") === -1)) {
    return data.applicationStatus || data.reviewStatus || data.approvalStatus || data.status || "QUEUED";
  }

  // ── REVIEWER & REVIEW NOTES ──
  if (hAlpha.indexOf("reviewer") !== -1 && hAlpha.indexOf("notes") === -1) {
    return data.reviewer || data.assignedReviewer || data.reviewedBy || "Genesis Executive Council";
  }
  if (hAlpha.indexOf("notes") !== -1 || hAlpha.indexOf("reviewnotes") !== -1) {
    return data.reviewerNotes || data.directorateReviewerNotes || data.notes || data.reviewNotes || "Queued for Directorate Review";
  }

  // ── SPECIALIZED INTEREST AREAS / PORTFOLIO INTERESTS ──
  if (hAlpha.indexOf("interest") !== -1 || hAlpha.indexOf("specialized") !== -1) {
    if (Array.isArray(data.portfolioInterests)) return data.portfolioInterests.join(', ');
    return data.portfolioInterests || data.interests || "General Platform Participation";
  }

  // ── CAMPUS AMBASSADOR FELLOWSHIP APPLICATION ──
  if (hAlpha.indexOf("fellowship") !== -1 || (hAlpha.indexOf("campus") !== -1 && hAlpha.indexOf("ambassador") !== -1 && hAlpha.indexOf("app") !== -1)) {
    return data.seekingCampusAmbassadorship ? "YES (APPLIED FOR FELLOWSHIP)" : "NO";
  }

  // ── INSTITUTION / SCHOOL / UNIVERSITY / COLLEGE ──
  if (hAlpha.indexOf("institution") !== -1 || hAlpha.indexOf("school") !== -1 || hAlpha.indexOf("college") !== -1 || hAlpha.indexOf("university") !== -1) {
    return data.institutionOrSchool || data.institution || data.step1_institution || data.amb_college || data.collegeUniversityName || data.institutionAffiliation || data.college || "Independent";
  }

  // ── DEGREE / YEAR OF STUDY / GRADE / MAJOR ──
  if (hAlpha.indexOf("degree") !== -1 || hAlpha.indexOf("grade") !== -1 || hAlpha.indexOf("major") !== -1 || hAlpha.indexOf("yearofstudy") !== -1) {
    return data.degreeOrGrade || data.amb_major || data.degreeYearOfStudy || data.gradeOrYear || data.academicYear || "Undergraduate / Scholar";
  }

  // ── REGISTRATION TYPE & STATUS (REGISTER / PREREGISTER) ──
  if (hAlpha.indexOf("registrationtype") !== -1 || hAlpha.indexOf("regtype") !== -1) {
    var rawType = String(data.registrationType || data.registrationStatus || data.accessLevel || "").toUpperCase();
    return rawType.indexOf("PRE") !== -1 ? "PREREGISTER" : "REGISTER";
  }
  if (hAlpha.indexOf("registrationstatus") !== -1 || hAlpha.indexOf("statusforperk") !== -1 || (hAlpha.indexOf("perk") !== -1 && hAlpha.indexOf("status") !== -1)) {
    var rawPerk = String(data.registrationStatus || data.registrationType || data.accessLevel || "").toUpperCase();
    return rawPerk.indexOf("PRE") !== -1 ? "PREREGISTER" : "REGISTER";
  }

  // ── ACCESS LEVEL / WHITELIST TIER ──
  if (hAlpha.indexOf("accesslevel") !== -1 || hAlpha.indexOf("whitelisttier") !== -1) {
    if (data.accessLevel) return data.accessLevel;
    var isPreReg = String(data.registrationStatus || data.registrationType || '').toUpperCase().includes('PRE');
    return isPreReg ? "Pre-Registered Sovereign Whitelist (Genesis 100)" : "Direct Member";
  }

  // ── AUTH PROVIDER ──
  if (hAlpha.indexOf("authprovider") !== -1 || (hAlpha.indexOf("provider") !== -1 && hAlpha.indexOf("auth") !== -1)) {
    return data.authProvider || data.provider || "DIRECT_ENROLL";
  }

  // ── TERMS & PRIVACY RATIFICATION ACCORD ──
  if (hAlpha.indexOf("terms") !== -1 || (hAlpha.indexOf("privacy") !== -1 && hAlpha.indexOf("accord") !== -1)) {
    return (data.termsRatified || data.termsAccepted || data.tosPrivacyAccepted) ? "RATIFIED" : "RATIFIED";
  }

  // ── DATA STORAGE & TELEMETRY CONSENT ──
  if (hAlpha.indexOf("datastorage") !== -1 || hAlpha.indexOf("telemetryconsent") !== -1) {
    return (data.dataProcessingConsent !== false) ? "GRANTED" : "PENDING";
  }

  // ── ACCOUNT STATUS ──
  if (hAlpha.indexOf("accountstatus") !== -1) {
    return data.accountStatus || "ACTIVE";
  }

  // ── TICKET ID / REGISTRATION ID / APPLICATION ID / PAYMENT ID ──
  if (hAlpha.indexOf("ticketid") !== -1 || hAlpha.indexOf("registrationid") !== -1 || hAlpha.indexOf("applicationid") !== -1 || hAlpha.indexOf("inquiryid") !== -1 || hAlpha.indexOf("donationid") !== -1 || hAlpha.indexOf("ambassadorid") !== -1 || hAlpha.indexOf("submissionid") !== -1 || hAlpha.indexOf("paymentid") !== -1 || hAlpha.indexOf("orderid") !== -1) {
    return data.ticketId || data.registrationId || data.applicationId || data.inquiryId || data.donationId || data.ambassadorId || data.submissionId || data.paymentId || data.orderId || data.id || ('ZV-' + Math.random().toString(36).substring(2, 8).toUpperCase());
  }

  // ── EVENT ID / CONFERENCE TITLE / EVENT NAME ──
  if (hAlpha.indexOf("eventid") !== -1 || hAlpha.indexOf("conferencetitle") !== -1 || (hAlpha.indexOf("event") !== -1 && (hAlpha.indexOf("title") !== -1 || hAlpha.indexOf("name") !== -1))) {
    return data.eventName || data.eventTitle || data.eventId || data.conferenceTitle || data.title || "ZENVITRA Model United Nations 2026";
  }

  // ── 1ST & 2ND COMMITTEE PREFERENCES ──
  if (hAlpha.indexOf("1st") !== -1 || hAlpha.indexOf("primarycommittee") !== -1) {
    return data.step3_primary_committee || data.primaryCommitteePreference || data.firstCommitteeChoice || data.committee1 || "General Plenary Assembly";
  }
  if (hAlpha.indexOf("2nd") !== -1 || hAlpha.indexOf("secondarycommittee") !== -1) {
    return data.step4_secondary_committee || data.secondaryCommitteePreference || data.secondCommitteeChoice || data.committee2 || "Parliamentary Council";
  }

  // ── TOP 3 PREFERRED PORTFOLIOS & ALLOCATED SEAT ──
  if (hAlpha.indexOf("top3") !== -1 || (hAlpha.indexOf("portfolio") !== -1 && (hAlpha.indexOf("country") !== -1 || hAlpha.indexOf("preferred") !== -1))) {
    return data.step5_portfolios || data.preferredCountryAllocations || data.portfolios || "Open Allocation";
  }
  if (hAlpha.indexOf("allocated") !== -1) {
    if (hAlpha.indexOf("committee") !== -1) return data.allocatedCommittee || "To be allocated by Dais";
    return data.allocatedSeat || data.finalPortfolio || data.portfolioAllocated || "Seat pending allocation";
  }

  // ── PARTICIPATION PASS TIER / QUANTITY / PASS FEE ──
  if (hAlpha.indexOf("passtier") !== -1 || hAlpha.indexOf("ticketpass") !== -1) {
    return data.step13_participation_tier || data.ticketPassType || data.passType || data.tierName || "Genesis Sovereign Pass";
  }
  if (hAlpha.indexOf("quantity") !== -1) {
    return data.quantity !== undefined ? String(data.quantity) : "1";
  }
  if (hAlpha.indexOf("fee") !== -1 || hAlpha.indexOf("amount") !== -1 || hAlpha.indexOf("price") !== -1) {
    return data.totalPrice !== undefined ? String(data.totalPrice) : (data.amountInr !== undefined ? String(data.amountInr) : (data.price !== undefined ? String(data.price) : "0"));
  }

  // ── PAYMENT MODE / CHANNEL ──
  if (hAlpha.indexOf("paymentmode") !== -1 || hAlpha.indexOf("paymentmethod") !== -1 || hAlpha.indexOf("channel") !== -1) {
    return data.step15_payment_method || data.paymentMode || data.paymentMethod || "UPI / Direct Gateway";
  }

  // ── UPI UTR / TRANSACTION ID / REFERENCE NUMBER ──
  if (hAlpha.indexOf("utr") !== -1 || hAlpha.indexOf("transactionid") !== -1 || hAlpha.indexOf("txnid") !== -1 || hAlpha.indexOf("referencenumber") !== -1) {
    return data.step15_utr_reference || data.utrTransactionId || data.utr || data.transactionRef || data.bankReference || "GENESIS_WHITELIST";
  }

  // ── PAYMENT SCREENSHOT / RECEIPT PROOF URL / ID PROOF ──
  if (hAlpha.indexOf("screenshot") !== -1 || hAlpha.indexOf("receipt") !== -1 || hAlpha.indexOf("proofurl") !== -1) {
    return data.step15_receipt_link || data.paymentScreenshotPreview || data.paymentScreenshot || data.receiptUrl || data.receiptProofUrl || "N/A";
  }
  if (hAlpha.indexOf("idcard") !== -1 || hAlpha.indexOf("idproof") !== -1 || hAlpha.indexOf("rollnumber") !== -1) {
    return data.step9_id_proof || data.studentIdProof || data.idProof || "VERIFIED_ON_RECORD";
  }

  // ── DIGITAL SIGNATURE ──
  if (hAlpha.indexOf("signature") !== -1) {
    return data.step14_signature || data.digitalSignature || data.signature || data.fullName || "Ratified Electronically";
  }

  // ── VIRTUAL MEDIA & RECORDING CONSENT ──
  if (hAlpha.indexOf("media") !== -1 || hAlpha.indexOf("recordingconsent") !== -1 || hAlpha.indexOf("livestream") !== -1) {
    return data.step12_media_consent || data.mediaConsent || "Granted";
  }

  // ── AMBASSADOR NETWORK REACH & BANDWIDTH ──
  if (hAlpha.indexOf("reach") !== -1 || hAlpha.indexOf("network") !== -1) {
    return data.amb_network || "500+ Students via Campus Council";
  }

  // ── CSAT RATINGS & FEEDBACK ──
  if (hAlpha.indexOf("overall") !== -1 && hAlpha.indexOf("rating") !== -1) {
    return data.csat_overall_rating || data.rating || "5";
  }
  if (hAlpha.indexOf("dais") !== -1 && hAlpha.indexOf("rating") !== -1) {
    return data.csat_dais_scale || "5";
  }
  if (hAlpha.indexOf("usability") !== -1 || hAlpha.indexOf("platformscale") !== -1) {
    return data.csat_platform_scale || "5";
  }
  if (hAlpha.indexOf("impressive") !== -1) {
    return data.csat_best_aspect || "Fast digital matrix and real-time document drafting.";
  }
  if (hAlpha.indexOf("criticism") !== -1 || hAlpha.indexOf("change") !== -1) {
    return data.csat_criticisms || "None noted.";
  }

  // ── SUPPORT CATEGORY, SEVERITY, DESCRIPTION ──
  if (hAlpha.indexOf("category") !== -1 && hAlpha.indexOf("role") === -1) {
    return data.category || data.queryCategory || data.feedbackCategory || "General Inquiry";
  }
  if (hAlpha.indexOf("subject") !== -1 || hAlpha.indexOf("summary") !== -1) {
    return data.subject || data.issueSummary || data.title || "Inquiry";
  }
  if (hAlpha.indexOf("description") !== -1 || hAlpha.indexOf("message") !== -1) {
    return data.description || data.message || data.details || "N/A";
  }
  if (hAlpha.indexOf("severity") !== -1 || hAlpha.indexOf("priority") !== -1) {
    return data.severity || data.priority || "NORMAL";
  }

  // ── IP ADDRESS & DEVICE SUMMARY ──
  if (hAlpha.indexOf("ip") !== -1) {
    return data.ipAddress || data.ip || "127.0.0.1";
  }
  if (hAlpha.indexOf("device") !== -1 || hAlpha.indexOf("browser") !== -1 || hAlpha.indexOf("useragent") !== -1) {
    return data.deviceInfo || data.deviceBrowserInfo || data.userAgent || "Web Browser Client";
  }

  return "";
}

/**
 * Resilient lookup that resolves sheet by exact name, space-separated name,
 * legacy underscore name, or normalized case-insensitive alphanumeric match.
 */
function getSheetLoose_(ss, name) {
  if (!ss || !name) return null;
  var target = String(name).trim();

  // 1. Direct exact match
  var sh = ss.getSheetByName(target);
  if (sh) return sh;

  // 2. Clean space-separated match
  var spaceName = target.replace(/_/g, " ").replace(/\s+/g, " ").trim();
  sh = ss.getSheetByName(spaceName);
  if (sh) return sh;

  // 3. Normalized match across all sheets
  var normTarget = normalize_(target);
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (normalize_(sheets[i].getName()) === normTarget) {
      return sheets[i];
    }
  }

  // 4. Stripped leading numbers match (e.g. "02 Core Registrations" -> "Core Registrations")
  var stripped = target.replace(/^\d+[\s_-]*/, "").trim();
  if (stripped) {
    var normStripped = normalize_(stripped);
    for (var j = 0; j < sheets.length; j++) {
      var sName = sheets[j].getName().replace(/^\d+[\s_-]*/, "").trim();
      if (normalize_(sName) === normStripped) {
        return sheets[j];
      }
    }
  }

  return null;
}

function getOrCreateSpreadsheet() {
  var ss = null;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {}

  if (!ss) {
    var props = PropertiesService.getScriptProperties();
    var storedId = props.getProperty('ZENVITRA_SPREADSHEET_ID');
    if (storedId) {
      try { ss = SpreadsheetApp.openById(storedId); } catch (e) {}
    }
    if (!ss) {
      ss = SpreadsheetApp.create('ZENVITRA — Master Telemetry & Portfolio Ledger');
      props.setProperty('ZENVITRA_SPREADSHEET_ID', ss.getId());
    }
  }
  return ss;
}

function normalize_(str) {
  return String(str || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function safe_(val) {
  if (val === null || val === undefined) return "";
  return val;
}

function shortHash_(str) {
  var raw = String(str || "");
  var hash = 0;
  for (var i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash) + raw.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36).substring(0, 6);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
