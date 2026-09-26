/**
 * ==============================================================================
 * ZENVITRA MASTER OMNI-STREAM, FORMS & MATRIX ENGINE — GOOGLE APPS SCRIPT (v5.0)
 * ==============================================================================
 * Unified Enterprise Apps Script Engine combining:
 * 1.  ZEN DIPLOMACY MUN (Delegate Registrations, pass tiers, payments & preferences)
 * 2.  SECRETARIAT APPLICATIONS (10 Department & sector selection cards, SOP, tasks)
 * 3.  LIVE MATRIX PORTFOLIOS (36 official committee seats, 2-way real-time sync with /matrix)
 * 4.  EVENT REGISTRATIONS (Pass bookings, custom countries, tier allocations & prices)
 * 5.  DONATIONS & CHARITY RELIEF (Primary relief contributions & UTR tracking)
 * 6.  IMPACT LEDGER (Public transparency & voluntary relief ledger)
 * 7.  REGISTER DATA CORE (User registrations & digital identity ledger)
 * 8.  LOGIN DATA CORE (Authentication audit & security telemetry)
 * 9.  CAMPUS AMBASSADORS (Student chapter leader accreditation)
 * 10. CORE TEAM APPLICATIONS (Founding wing applications & bandwidth commitments)
 * 11. CONTACT INQUIRIES (Diplomatic contact & public support inquiries)
 * 12. NEWSLETTER SUBSCRIBERS (Email subscriptions & consent tracking)
 * 13. COLLAB & PARTNERSHIPS (Institutional alliances & conference partnerships)
 * 14. COMMUNITY MEMBERS (Grassroots youth network & skills directory)
 * 15. FEEDBACK & GRIEVANCE (Platform tickets, resolution audits & bug reports)
 * 16. DYNAMIC ZENFORMS SCHEMA SYNC (Auto-creates columns when questions are added/edited)
 * ==============================================================================
 * ONE-CLICK SETUP IN APPS SCRIPT:
 * 1. Select function "initAllTabs" in the toolbar dropdown and click "▷ Run".
 * 2. Review and Allow permissions.
 * 3. Deploy > New deployment > Web app > Execute as "Me", Access "Anyone".
 * 4. Copy the Web App URL!
 * ==============================================================================
 */

// ── 36 OFFICIAL COMMITTEE PORTFOLIOS FOR LIVE MATRIX ──
var INITIAL_MATRIX_PORTFOLIOS = [
  // AIPPM (All India Political Parties Meet)
  { id: 'aippm_1', committee: 'AIPPM', title: 'Narendra Modi', subTitle: 'Prime Minister of India / Varanasi MP', category: 'Government & Cabinet', status: 'Vacant', difficulty: 'Advanced' },
  { id: 'aippm_2', committee: 'AIPPM', title: 'Amit Shah', subTitle: 'Minister of Home Affairs / Gandhinagar MP', category: 'Government & Cabinet', status: 'Allocated', difficulty: 'Advanced' },
  { id: 'aippm_3', committee: 'AIPPM', title: 'Rahul Gandhi', subTitle: 'Leader of Opposition (Lok Sabha)', category: 'Opposition Alliance', status: 'Vacant', difficulty: 'Advanced' },
  { id: 'aippm_4', committee: 'AIPPM', title: 'Rajnath Singh', subTitle: 'Minister of Defence', category: 'Government & Cabinet', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'aippm_5', committee: 'AIPPM', title: 'Nirmala Sitharaman', subTitle: 'Minister of Finance', category: 'Government & Cabinet', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'aippm_6', committee: 'AIPPM', title: 'Mallikarjun Kharge', subTitle: 'Leader of Opposition (Rajya Sabha)', category: 'Opposition Alliance', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'aippm_7', committee: 'AIPPM', title: 'Akhilesh Yadav', subTitle: 'Samajwadi Party Chief / Kannauj MP', category: 'Regional Opposition', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'aippm_8', committee: 'AIPPM', title: 'Mamata Banerjee', subTitle: 'All India Trinamool Congress (TMC)', category: 'Regional Alliance', status: 'Vacant', difficulty: 'Advanced' },
  { id: 'aippm_9', committee: 'AIPPM', title: 'Nitin Gadkari', subTitle: 'Minister of Road Transport & Highways', category: 'Government & Cabinet', status: 'Vacant', difficulty: 'Beginner' },
  { id: 'aippm_10', committee: 'AIPPM', title: 'Asaduddin Owaisi', subTitle: 'AIMIM Chief / Hyderabad MP', category: 'Independent MPs', status: 'Vacant', difficulty: 'Crisis' },

  // EMI (Education Ministry of India)
  { id: 'emi_1', committee: 'EMI', title: 'Dharmendra Pradhan', subTitle: 'Union Minister of Education', category: 'Union Ministry', status: 'Allocated', difficulty: 'Advanced' },
  { id: 'emi_2', committee: 'EMI', title: 'Prof. M. Jagadesh Kumar', subTitle: 'Chairman, University Grants Commission (UGC)', category: 'Statutory Regulatory Authority', status: 'Vacant', difficulty: 'Advanced' },
  { id: 'emi_3', committee: 'EMI', title: 'Prof. T.G. Sitharam', subTitle: 'Chairman, AICTE', category: 'Technical Regulatory Authority', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'emi_4', committee: 'EMI', title: 'Director, NCERT', subTitle: 'Curriculum & Textbook Framework Directorate', category: 'Academic Directorate', status: 'Vacant', difficulty: 'Beginner' },
  { id: 'emi_5', committee: 'EMI', title: 'Director, IIT Delhi', subTitle: 'Institutes of National Importance (INIs)', category: 'Higher Education Leadership', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'emi_6', committee: 'EMI', title: 'Vice-Chancellor, Delhi University', subTitle: 'Central Universities Consortium', category: 'Higher Education Leadership', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'emi_7', committee: 'EMI', title: 'State Education Secretary (Tamil Nadu)', subTitle: 'State Language & Curriculum Autonomy Board', category: 'State Stakeholder', status: 'Vacant', difficulty: 'Crisis' },
  { id: 'emi_8', committee: 'EMI', title: 'National Student Union Representative', subTitle: 'Youth Democratic Student Body', category: 'Student Federation', status: 'Vacant', difficulty: 'Beginner' },

  // UNSC (United Nations Security Council)
  { id: 'unsc_1', committee: 'UNSC', title: 'United States of America', subTitle: 'Permanent Member (P5) • Veto Power', category: 'Permanent Members (P5)', status: 'Allocated', difficulty: 'Crisis' },
  { id: 'unsc_2', committee: 'UNSC', title: 'United Kingdom', subTitle: 'Permanent Member (P5) • Veto Power', category: 'Permanent Members (P5)', status: 'Vacant', difficulty: 'Advanced' },
  { id: 'unsc_3', committee: 'UNSC', title: 'French Republic', subTitle: 'Permanent Member (P5) • Veto Power', category: 'Permanent Members (P5)', status: 'Vacant', difficulty: 'Advanced' },
  { id: 'unsc_4', committee: 'UNSC', title: 'Russian Federation', subTitle: 'Permanent Member (P5) • Veto Power', category: 'Permanent Members (P5)', status: 'Vacant', difficulty: 'Crisis' },
  { id: 'unsc_5', committee: 'UNSC', title: 'People’s Republic of China', subTitle: 'Permanent Member (P5) • Veto Power', category: 'Permanent Members (P5)', status: 'Vacant', difficulty: 'Crisis' },
  { id: 'unsc_6', committee: 'UNSC', title: 'Republic of India', subTitle: 'Special Invitee & G4 Candidate Member', category: 'Elected Members & Observers', status: 'Allocated', difficulty: 'Advanced' },
  { id: 'unsc_7', committee: 'UNSC', title: 'Japan', subTitle: 'Non-Permanent Member (Asia-Pacific)', category: 'Elected Members (E10)', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'unsc_8', committee: 'UNSC', title: 'Republic of Korea', subTitle: 'Non-Permanent Member (Asia-Pacific)', category: 'Elected Members (E10)', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'unsc_9', committee: 'UNSC', title: 'Swiss Confederation', subTitle: 'Non-Permanent Member (WEOG)', category: 'Elected Members (E10)', status: 'Vacant', difficulty: 'Beginner' },
  { id: 'unsc_10', committee: 'UNSC', title: 'Republic of Sierra Leone', subTitle: 'Non-Permanent Member (African Group)', category: 'Elected Members (E10)', status: 'Vacant', difficulty: 'Beginner' },

  // UNODC (United Nations Office on Drugs and Crime)
  { id: 'unodc_1', committee: 'UNODC', title: 'Republic of Colombia', subTitle: 'Andean Narcotics & Crop Substitution Board', category: 'Key Producer/Transit States', status: 'Vacant', difficulty: 'Crisis' },
  { id: 'unodc_2', committee: 'UNODC', title: 'United Mexican States', subTitle: 'Transnational Cartel Border & Maritime Taskforce', category: 'Key Producer/Transit States', status: 'Vacant', difficulty: 'Crisis' },
  { id: 'unodc_3', committee: 'UNODC', title: 'Kingdom of the Netherlands', subTitle: 'Port of Rotterdam Interception Directorate', category: 'European Gateway States', status: 'Vacant', difficulty: 'Intermediate' },
  { id: 'unodc_4', committee: 'UNODC', title: 'Republic of the Union of Myanmar', subTitle: 'Golden Triangle Synthetic Drug Precursor Taskforce', category: 'Southeast Asia Transit', status: 'Vacant', difficulty: 'Advanced' },
  { id: 'unodc_5', committee: 'UNODC', title: 'Federal Republic of Nigeria', subTitle: 'West African Transshipment Command', category: 'African Transit Hubs', status: 'Vacant', difficulty: 'Beginner' },
  { id: 'unodc_6', committee: 'UNODC', title: 'INTERPOL Secretariat', subTitle: 'Transnational Organized Crime Taskforce', category: 'International Observer Agencies', status: 'Allocated', difficulty: 'Advanced' },
  { id: 'unodc_7', committee: 'UNODC', title: 'Islamic Republic of Afghanistan', subTitle: 'Opiate Eradication Directorate', category: 'Central Asian Production Corridor', status: 'Vacant', difficulty: 'Crisis' },
  { id: 'unodc_8', committee: 'UNODC', title: 'Commonwealth of Australia', subTitle: 'Pacific Border & Darknet Interdiction Branch', category: 'Destination & Consumer States', status: 'Vacant', difficulty: 'Beginner' }
];

// ── CANONICAL SCHEMAS & COLUMN HEADERS FOR ALL 19 STREAMS ──
var TAB_SCHEMAS = {
  // ── COMMITTEE DELEGATE TABS (AIPPM, EMI, UNSC, UNODC) ──
  AIPPM: {
    sheetName: 'AIPPM',
    headers: [
      'Timestamp', 'Full Name', 'Email Address', 'WhatsApp / Phone',
      'Institution / School / University', 'City & State', 'Participation Track',
      'Experience Level', 'Primary Committee Choice', 'Secondary Committee Choice',
      'Portfolio Preferences', 'Prior Accolades & MUN Count', 'Resolution Drafting Experience',
      'Research Dossier Link', 'Placard Accreditation Name', 'Motivation Statement',
      'Accommodation Assistance', 'Emergency Contact', 'Dietary Preference',
      'Participation Pass Tier', 'Payment UTR / Ref Number', 'Payment Screenshot Link',
      'Code of Conduct Accord', 'Allocation Status', 'Allocated Committee',
      'Allocated Portfolio', 'Submitter Handle', 'Form ID'
    ]
  },

  EMI: {
    sheetName: 'EMI',
    headers: [
      'Timestamp', 'Full Name', 'Email Address', 'WhatsApp / Phone',
      'Institution / School / University', 'City & State', 'Participation Track',
      'Experience Level', 'Primary Committee Choice', 'Secondary Committee Choice',
      'Portfolio Preferences', 'Prior Accolades & MUN Count', 'Resolution Drafting Experience',
      'Research Dossier Link', 'Placard Accreditation Name', 'Motivation Statement',
      'Accommodation Assistance', 'Emergency Contact', 'Dietary Preference',
      'Participation Pass Tier', 'Payment UTR / Ref Number', 'Payment Screenshot Link',
      'Code of Conduct Accord', 'Allocation Status', 'Allocated Committee',
      'Allocated Portfolio', 'Submitter Handle', 'Form ID'
    ]
  },

  UNSC: {
    sheetName: 'UNSC',
    headers: [
      'Timestamp', 'Full Name', 'Email Address', 'WhatsApp / Phone',
      'Institution / School / University', 'City & State', 'Participation Track',
      'Experience Level', 'Primary Committee Choice', 'Secondary Committee Choice',
      'Portfolio Preferences', 'Prior Accolades & MUN Count', 'Resolution Drafting Experience',
      'Research Dossier Link', 'Placard Accreditation Name', 'Motivation Statement',
      'Accommodation Assistance', 'Emergency Contact', 'Dietary Preference',
      'Participation Pass Tier', 'Payment UTR / Ref Number', 'Payment Screenshot Link',
      'Code of Conduct Accord', 'Allocation Status', 'Allocated Committee',
      'Allocated Portfolio', 'Submitter Handle', 'Form ID'
    ]
  },

  UNODC: {
    sheetName: 'UNODC',
    headers: [
      'Timestamp', 'Full Name', 'Email Address', 'WhatsApp / Phone',
      'Institution / School / University', 'City & State', 'Participation Track',
      'Experience Level', 'Primary Committee Choice', 'Secondary Committee Choice',
      'Portfolio Preferences', 'Prior Accolades & MUN Count', 'Resolution Drafting Experience',
      'Research Dossier Link', 'Placard Accreditation Name', 'Motivation Statement',
      'Accommodation Assistance', 'Emergency Contact', 'Dietary Preference',
      'Participation Pass Tier', 'Payment UTR / Ref Number', 'Payment Screenshot Link',
      'Code of Conduct Accord', 'Allocation Status', 'Allocated Committee',
      'Allocated Portfolio', 'Submitter Handle', 'Form ID'
    ]
  },

  // 1. ZEN DIPLOMACY MUN (MASTER DELEGATE REGISTRATIONS)
  ZEN_DIPLOMACY_MUN: {
    sheetName: 'ZEN DIPLOMACY MUN',
    headers: [
      'Timestamp', 'Full Name', 'Email Address', 'WhatsApp / Phone',
      'Institution / School / University', 'City & State', 'Participation Track',
      'Experience Level', 'Primary Committee Choice', 'Secondary Committee Choice',
      'Portfolio Preferences', 'Prior Accolades & MUN Count', 'Resolution Drafting Experience',
      'Research Dossier Link', 'Placard Accreditation Name', 'Motivation Statement',
      'Accommodation Assistance', 'Emergency Contact', 'Dietary Preference',
      'Participation Pass Tier', 'Payment UTR / Ref Number', 'Payment Screenshot Link',
      'Code of Conduct Accord', 'Allocation Status', 'Allocated Committee',
      'Allocated Portfolio', 'Submitter Handle', 'Form ID'
    ]
  },

  // 2. SECRETARIAT & EXECUTIVE BOARD APPLICATIONS
  SECRETARIAT: {
    sheetName: 'Secretariat Applications',
    headers: [
      'Timestamp', 'Ticket ID', 'Full Name', 'Email Address', 'Phone Number',
      'Institution', 'Grade / Academic Year', 'City & Country', 'Preferred Department',
      'Secondary Department', 'Prior MUN Experience', 'Number of MUNs Attended',
      'Prior Organizing Experience', 'Weekly Bandwidth Commitment', 'Available Oct 24-25, 2026',
      'Statement of Purpose (SOP)', 'Department Practical Task Response',
      'Portfolio / Resume / Drive Link', 'Discord Handle', 'Sovereign Accord Accepted', 'Review Status'
    ]
  },

  // 3. MATRIX PORTFOLIOS (AUTO-SYNCS LIVE WITH /matrix)
  MATRIX_PORTFOLIOS: {
    sheetName: 'Matrix Portfolios',
    headers: [
      'Portfolio ID', 'Committee', 'Portfolio Title', 'Subtitle / Description',
      'Category', 'Status', 'Allocated To (Name)', 'Allocated Email', 'Difficulty'
    ]
  },

  // 4. EVENT REGISTRATIONS & TICKET BOOKINGS
  EVENTS: {
    sheetName: 'Event Registrations',
    headers: [
      'Timestamp', 'Event ID', 'Event Name', 'Participant Name', 'Participant Email',
      'Contact Number', 'Institution / College', 'Ticket Pass Type', 'Quantity',
      'Allocated Seat / Portfolio', 'Total Price', 'Payment Status'
    ]
  },

  // 5. DONATIONS & RELIEF CONTRIBUTIONS
  DONATIONS: {
    sheetName: 'Donations',
    headers: [
      'Timestamp', 'Donor Name', 'Donor Email', 'Phone', 'Amount (INR)',
      'UTR / Txn ID', 'Target Relief Stream', 'Payment Mode', 'Anonymous',
      'Notes / Prayer', 'Audit Status', 'Verification Details', 'IP Address', 'Device Info'
    ]
  },

  // 6. IMPACT LEDGER
  IMPACT_LEDGER: {
    sheetName: 'Impact Ledger',
    headers: [
      'Timestamp', 'Donor Name', 'Donor Email', 'Phone', 'Amount (INR)',
      'UTR / Txn ID', 'Target Relief Stream', 'Payment Mode', 'Anonymous',
      'Notes / Prayer', 'Audit Status', 'Verification Details', 'IP Address', 'Device Info'
    ]
  },

  // 7. USER REGISTRATIONS (PASSPORT CORE)
  REGISTER_CORE: {
    sheetName: 'Register Data Core',
    headers: [
      'Timestamp', 'User ID', 'Full Name', 'Email', 'Role Designation',
      'Access Level', 'Auth Provider', 'Account Status', 'IP Address', 'Device Info'
    ]
  },

  // 8. LOGIN AUDIT CORE
  LOGIN_CORE: {
    sheetName: 'Login Data Core',
    headers: [
      'Timestamp', 'User ID', 'Full Name', 'Email', 'Auth Provider',
      'Login Status', 'IP Address', 'Device Info'
    ]
  },

  // 9. CAMPUS AMBASSADORS
  CAMPUS_AMBASSADOR: {
    sheetName: 'Campus Ambassadors',
    headers: [
      'Timestamp', 'Full Name', 'College / University', 'City / State',
      'Degree & Year', 'Email', 'Phone / WhatsApp', 'Leadership Experience',
      'Proposed Strategy', 'Student ID Proof', 'Approval Status', 'IP Address'
    ]
  },

  // 10. CORE TEAM APPLICATIONS
  CORE_TEAM: {
    sheetName: 'Core Team Applications',
    headers: [
      'Timestamp', 'Full Name', 'Handle', 'Email', 'Phone Number',
      'Role Applied For', 'Department', 'Portfolio URL', 'Uploaded Document',
      'Leadership Accomplishments', 'Technical Dossier', 'Weekly Bandwidth',
      'Motivation Statement', 'Constitutional Accord', 'Application Status', 'IP Address'
    ]
  },

  // 11. CONTACT INQUIRIES
  CONTACT: {
    sheetName: 'Contact Inquiries',
    headers: [
      'Timestamp', 'Full Name', 'Email', 'Phone Number', 'Subject',
      'Query Type', 'Message', 'Source URL', 'Status', 'IP Address'
    ]
  },

  // 12. NEWSLETTER SUBSCRIBERS
  NEWSLETTER: {
    sheetName: 'Newsletter Subscribers',
    headers: [
      'Timestamp', 'Email Address', 'Source', 'Consent Given',
      'UTM Campaign', 'Status', 'IP Address'
    ]
  },

  // 13. COLLAB & PARTNERSHIPS
  COLLAB: {
    sheetName: 'Collab & Partnerships',
    headers: [
      'Timestamp', 'Organization Name', 'Representative Name', 'Official Email',
      'Phone / WhatsApp', 'Collab Type', 'Proposal Summary', 'Budget / Resources',
      'Stage', 'IP Address'
    ]
  },

  // 14. COMMUNITY MEMBERS
  COMMUNITY: {
    sheetName: 'Community Members',
    headers: [
      'Timestamp', 'Full Name', 'Email', 'City / Region', 'Institution / College',
      'Primary Skills', 'Areas of Interest', 'Discord Handle', 'Membership Status', 'IP Address'
    ]
  },

  // 15. FEEDBACK & GRIEVANCE
  FEEDBACK: {
    sheetName: 'Feedback & Grievance',
    headers: [
      'Timestamp', 'Submitter Name', 'Email', 'Category', 'Severity / Priority',
      'Page URL', 'Description', 'Attachment Link', 'Status', 'IP Address'
    ]
  }
};

/**
 * Gets active spreadsheet or automatically creates a new master spreadsheet in Google Drive
 */
function getOrCreateSpreadsheet() {
  var ss = null;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {}

  if (!ss) {
    var props = PropertiesService.getScriptProperties();
    var storedId = props.getProperty('ZENVITRA_SPREADSHEET_ID');
    if (storedId) {
      try {
        ss = SpreadsheetApp.openById(storedId);
      } catch (e) {}
    }
    if (!ss) {
      ss = SpreadsheetApp.create('ZENVITRA — Master Telemetry & Portfolio Ledger');
      props.setProperty('ZENVITRA_SPREADSHEET_ID', ss.getId());
    }
  }
  return ss;
}

/**
 * Normalizes any incoming tab string from client payloads to match known schemas
 */
function resolveSchemaKey(raw) {
  if (!raw) return 'DONATIONS';
  var s = String(raw).toUpperCase().trim();

  if (s === 'AIPPM' || s.indexOf('AIPPM') !== -1) return 'AIPPM';
  if (s === 'EMI' || s.indexOf('EMI') !== -1) return 'EMI';
  if (s === 'UNSC' || s.indexOf('UNSC') !== -1) return 'UNSC';
  if (s === 'UNODC' || s.indexOf('UNODC') !== -1) return 'UNODC';
  if (s.indexOf('MATRIX') !== -1 || s.indexOf('PORTFOLIO') !== -1) return 'MATRIX_PORTFOLIOS';
  if (s.indexOf('SECRETARIAT') !== -1 || s.indexOf('SEC_APP') !== -1) return 'SECRETARIAT';
  if (s.indexOf('MUN') !== -1 || s.indexOf('DIPLOMACY') !== -1) return 'ZEN_DIPLOMACY_MUN';
  if (s.indexOf('EVENT') !== -1 || s.indexOf('PASS') !== -1 || s.indexOf('TICKET') !== -1) return 'EVENTS';
  if (s.indexOf('DONAT') !== -1) return 'DONATIONS';
  if (s.indexOf('IMPACT') !== -1 || s.indexOf('LEDGER') !== -1) return 'IMPACT_LEDGER';
  if (s.indexOf('REGISTER') !== -1) return 'REGISTER_CORE';
  if (s.indexOf('LOGIN') !== -1) return 'LOGIN_CORE';
  if (s.indexOf('AMBASSADOR') !== -1 || s.indexOf('CAMPUS') !== -1) return 'CAMPUS_AMBASSADOR';
  if (s.indexOf('CORE') !== -1 || s.indexOf('TEAM') !== -1 || s.indexOf('CAREER') !== -1) return 'CORE_TEAM';
  if (s.indexOf('CONTACT') !== -1) return 'CONTACT';
  if (s.indexOf('NEWSLETTER') !== -1) return 'NEWSLETTER';
  if (s.indexOf('COLLAB') !== -1 || s.indexOf('PARTNER') !== -1) return 'COLLAB';
  if (s.indexOf('COMMUNITY') !== -1) return 'COMMUNITY';
  if (s.indexOf('FEEDBACK') !== -1 || s.indexOf('GRIEVANCE') !== -1) return 'FEEDBACK';

  return null;
}

/**
 * Formats a sheet header row with dark obsidian background and frozen top row
 */
function formatHeaderRow(sheet, colCount) {
  var headerRange = sheet.getRange(1, 1, 1, colCount);
  headerRange.setBackground('#0f172a');
  headerRange.setFontColor('#f8fafc');
  headerRange.setFontWeight('bold');
  headerRange.setFontFamily('Roboto Mono');
  headerRange.setFontSize(10);
  sheet.setFrozenRows(1);
}

/**
 * Gets or creates sheet tab with styled header row
 */
function getOrCreateSheet(schema) {
  var ss = getOrCreateSpreadsheet();
  var sheet = ss.getSheetByName(schema.sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(schema.sheetName);
    sheet.appendRow(schema.headers);
    formatHeaderRow(sheet, schema.headers.length);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(schema.headers);
    formatHeaderRow(sheet, schema.headers.length);
  }

  return sheet;
}

/**
 * One-Click Master Setup:
 * Auto-creates all 15 tabs, formats obsidian headers, and pre-seeds Matrix Portfolios!
 */
function initAllTabs() {
  var ss = getOrCreateSpreadsheet();
  var created = [];

  Object.keys(TAB_SCHEMAS).forEach(function(key) {
    var schema = TAB_SCHEMAS[key];
    var sheet = ss.getSheetByName(schema.sheetName);
    var isNew = false;

    if (!sheet) {
      sheet = ss.insertSheet(schema.sheetName);
      isNew = true;
      created.push(schema.sheetName);
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(schema.headers);
      isNew = true;
    }

    formatHeaderRow(sheet, schema.headers.length);

    // Pre-seed 36 Portfolios if Matrix Portfolios tab is newly created
    if (key === 'MATRIX_PORTFOLIOS' && sheet.getLastRow() <= 1) {
      var rows = INITIAL_MATRIX_PORTFOLIOS.map(function(item) {
        return [
          item.id,
          item.committee,
          item.title,
          item.subTitle || '',
          item.category,
          item.status || 'Vacant',
          item.status === 'Allocated' ? (item.committee === 'UNSC' ? 'Confirmed P5 Diplomat' : 'Assigned Delegate') : '',
          '',
          item.difficulty || 'Intermediate'
        ];
      });

      if (rows.length > 0) {
        sheet.getRange(2, 1, rows.length, schema.headers.length).setValues(rows);
      }

      // Add dropdown validation for Status column (Column F / 6)
      try {
        var statusRule = SpreadsheetApp.newDataValidation()
          .requireValueInList(['Vacant', 'Allocated', '1 person waiting', '2 people waiting', '3+ people waiting'], true)
          .build();
        sheet.getRange(2, 6, 100, 1).setDataValidation(statusRule);
      } catch (_) {}
    }
  });

  return {
    status: 'success',
    spreadsheetUrl: ss.getUrl(),
    spreadsheetId: ss.getId(),
    createdTabs: created,
    totalTabs: Object.keys(TAB_SCHEMAS).length,
    message: 'All 15 tabs initialized and formatted: ' + (created.length > 0 ? created.join(', ') : 'All tabs active')
  };
}

/**
 * Alias for backward compatibility
 */
function initializeAll12Tabs() {
  return initAllTabs();
}

/**
 * Maps incoming client payload to canonical row columns
 */
function mapPayloadToRow(schemaKey, data) {
  var now = Utilities.formatDate(new Date(), 'GMT+5:30', 'yyyy-MM-dd HH:mm:ss');
  var ip = data.ipAddress || data.ip || '127.0.0.1';
  var device = data.deviceInfo || data.deviceBrowserInfo || data.userAgent || 'Web Browser';

  switch (schemaKey) {
    case 'AIPPM':
    case 'EMI':
    case 'UNSC':
    case 'UNODC':
    case 'ZEN_DIPLOMACY_MUN':
      return [
        now,
        data.step1_fullname || data.fullName || data.name || '',
        data.step1_email || data.email || '',
        data.step1_phone || data.phone || data.phoneNumber || '',
        data.step1_institution || data.institution || '',
        data.step1_city || data.city || '',
        data.step2_track || data.track || '',
        data.step2_experience_level || data.experienceLevel || '',
        data.step3_primary_committee || data.firstCommitteeChoice || '',
        data.step4_secondary_committee || data.secondCommitteeChoice || '',
        data.step5_portfolios || data.portfolioPreferences || '',
        data.step6_prior_accolades || data.priorAccolades || '',
        data.step7_resolution_experience || data.resolutionExperience || '',
        data.step8_research_paper_link || data.researchLink || '',
        data.step9_accreditation_dossier || data.accreditationPlacard || '',
        data.step10_motivation_statement || data.motivation || '',
        data.step11_accommodation_assistance || data.accommodation || 'NO',
        data.step12_emergency_contact || data.emergencyContact || '',
        data.step13_dietary_pref || data.dietaryPreference || 'Vegetarian',
        data.step15_participation_tier || data.participationTier || data.passTier || 'Delegate Pass (₹499)',
        data.step15_payment_reference || data.utr || data.paymentReference || '',
        data.step15_receipt_link || data.step15_payment_screenshot || data.paymentScreenshot || '',
        data.step14_code_of_conduct ? 'CONFIRMED' : 'ACCEPTED',
        data.status || 'PENDING_ALLOCATION',
        data.allocatedCommittee || '',
        data.allocatedPortfolio || '',
        data.submitterHandle || 'public_delegate',
        data.formId || 'zen-diplomacy-2026-registration'
      ];

    case 'SECRETARIAT':
      return [
        now,
        data.ticketId || ('SEC-' + Math.random().toString(36).substring(2, 8).toUpperCase()),
        data.fullName || data.step2_fullname || data.name || '',
        data.email || data.step2_email || '',
        data.phoneNumber || data.phone || data.step2_phone || '',
        data.institution || data.step2_institution || '',
        data.gradeOrYear || data.academicYear || data.step2_grade || '',
        data.cityCountry || data.step2_city || data.step2_city_country || data.city || '',
        data.preferredSector || data.step1_primary_sector || data.step1_preferred_department || data.department || '',
        data.secondarySector || data.step1_secondary_sector || data.step1_secondary_department || '',
        data.priorMunExperience || data.step3_prior_muns_count || '',
        data.numberOfMunsAttended || data.step3_prior_muns_count || '',
        data.priorOrganizingExperience || data.step3_organizing_experience || '',
        data.weeklyBandwidth || data.step3_weekly_bandwidth || '',
        data.availabilityOct2425 || data.step4_availability_oct2425 || 'YES',
        data.statementOfPurpose || data.step3_sop || '',
        data.practicalTaskResponse || data.step3_practical_response || '',
        data.portfolioUrl || data.step3_portfolio_url || data.linkedinOrResumeUrl || '',
        data.discordHandle || data.step4_discord_handle || '',
        data.sovereignAccordAccepted || data.step4_accord_agreement || 'ACCEPTED',
        data.status || 'PENDING_REVIEW'
      ];

    case 'EVENTS':
      return [
        now,
        data.eventId || data.eventIdSlug || data.eventSlug || '',
        data.eventName || data.eventTitle || 'Zenvitra Event',
        data.participantName || data.name || data.fullName || '',
        data.participantEmail || data.email || '',
        data.contactNumber || data.phone || data.phoneNumber || '',
        data.institution || data.college || data.collegeOrSchool || '',
        data.ticketPassType || data.passType || data.tierName || 'STANDARD_PASS',
        data.quantity || 1,
        data.allocatedSeat || data.allocatedPortfolio || data.portfolio || '',
        data.totalPrice || data.totalPayable || '',
        data.paymentStatus || 'CONFIRMED'
      ];

    case 'DONATIONS':
    case 'IMPACT_LEDGER':
      return [
        now,
        data.donorName || data.fullName || data.name || 'Anonymous Citizen',
        data.donorEmail || data.email || '',
        data.donorPhone || data.phone || data.phoneNumber || '',
        data.voluntaryAmountInr || data.amountInr || data.amount || 0,
        data.utrTransactionId || data.utr || data.transactionRef || data.txId || '',
        data.targetProjectStream || data.stream || data.target || 'Satya Niketan Anath Ashram',
        data.paymentMode || 'UPI / Bank Transfer',
        data.wantsAnonymous === true || data.anonymous === true ? 'YES' : 'NO',
        data.notesOrPrayer || data.notes || data.message || '',
        data.auditStatus || 'VERIFIED_SUBMISSION',
        data.verificationDetails || data.paymentScreenshotPreview || 'Pending Audit Confirmation',
        ip,
        device
      ];

    case 'REGISTER_CORE':
      return [
        now,
        data.userId || data.id || data.username || '',
        data.fullName || data.name || '',
        data.email || '',
        data.roleDesignation || data.role || 'DELEGATE',
        data.accessLevel || 'MEMBER',
        data.authProvider || data.provider || 'CREDENTIALS',
        data.accountStatus || 'ACTIVE',
        ip,
        device
      ];

    case 'LOGIN_CORE':
      return [
        now,
        data.userId || data.id || '',
        data.fullName || data.name || '',
        data.email || '',
        data.authProvider || data.provider || 'CREDENTIALS',
        data.loginStatus || 'SUCCESS',
        ip,
        device
      ];

    case 'CAMPUS_AMBASSADOR':
      return [
        now,
        data.fullName || data.name || '',
        data.collegeUniversityName || data.college || '',
        data.cityState || data.city || '',
        data.degreeYearOfStudy || data.year || '',
        data.email || '',
        data.phoneWhatsapp || data.phone || '',
        data.leadershipExperience || data.experience || '',
        data.proposedStrategy || data.strategy || '',
        data.studentIdProof || '',
        data.approvalStatus || 'PENDING_REVIEW',
        ip
      ];

    case 'CORE_TEAM':
      return [
        now,
        data.fullName || data.name || '',
        data.handle || '',
        data.email || '',
        data.phoneNumber || data.phone || '',
        data.roleAppliedFor || data.role || '',
        data.department || data.wing || 'GENERAL',
        data.portfolioUrl || data.portfolio || '',
        data.dossierUploadUrl || data.dossier || '',
        data.leadershipAccomplishments || '',
        data.strategicVision || '',
        data.weeklyBandwidth || '10-15 hrs/wk',
        data.motivationStatement || data.message || '',
        data.constitutionalAccord || 'ACCEPTED',
        data.applicationStatus || 'SUBMITTED',
        ip
      ];

    case 'CONTACT':
      return [
        now,
        data.fullName || data.name || '',
        data.email || '',
        data.phoneNumber || data.phone || '',
        data.subject || 'General Inquiry',
        data.queryType || 'GENERAL',
        data.message || '',
        data.sourceUrl || '/',
        data.status || 'NEW',
        ip
      ];

    case 'NEWSLETTER':
      return [
        now,
        data.emailAddress || data.email || '',
        data.subscriptionSource || data.source || 'Website Footer',
        data.consentGiven === false ? 'NO' : 'YES',
        data.utmCampaign || '',
        data.status || 'SUBSCRIBED',
        ip
      ];

    case 'COLLAB':
      return [
        now,
        data.organizationName || data.org || '',
        data.representativeName || data.name || '',
        data.officialEmail || data.email || '',
        data.phoneWhatsapp || data.phone || '',
        data.collabType || 'INSTITUTIONAL',
        data.proposalSummary || data.proposal || '',
        data.budgetResourceScope || '',
        data.stage || 'INQUIRY',
        ip
      ];

    case 'COMMUNITY':
      return [
        now,
        data.fullName || data.name || '',
        data.email || '',
        data.cityRegion || data.city || '',
        data.institutionCollege || data.college || '',
        data.primarySkills || '',
        data.areasOfInterest || '',
        data.discordHandle || '',
        data.membershipStatus || 'ACTIVE',
        ip
      ];

    case 'FEEDBACK':
      return [
        now,
        data.submitterName || data.name || 'Anonymous',
        data.email || '',
        data.feedbackCategory || data.category || 'GENERAL',
        data.severityPriority || 'NORMAL',
        data.pageUrl || '/',
        data.description || data.message || '',
        data.attachmentLink || '',
        data.status || 'OPEN',
        ip
      ];

    default:
      return [now, JSON.stringify(data), ip, device];
  }
}

/**
 * ==============================================================================
 * POST Webhook Handler (Zenvitra API & Forms -> Apps Script)
 * ==============================================================================
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'No payload received'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var payload = {};
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Malformed JSON payload: ' + parseErr.toString()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var ss = getOrCreateSpreadsheet();
    var action = (payload.action || '').toUpperCase();

    // ── ACTION 1: DYNAMIC ZENFORMS SCHEMA SYNC ──
    // Automatically creates/appends columns when questions are added or renamed
    if (action === 'SYNC_SCHEMA') {
      var sheetTab = payload.sheetTab || payload.targetTab || ('ZEN_' + (payload.formId || 'FORM').toUpperCase().replace(/[^A-Z0-9_]/g, '_'));
      var sheet = ss.getSheetByName(sheetTab);
      if (!sheet) {
        sheet = ss.insertSheet(sheetTab);
      }

      var existingHeaders = [];
      var lastCol = sheet.getLastColumn();
      if (lastCol > 0 && sheet.getLastRow() > 0) {
        existingHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
      }

      var defaultHeaders = ['Timestamp', 'Submission ID', 'Submitter Handle'];
      defaultHeaders.forEach(function(h) {
        if (existingHeaders.indexOf(h) === -1) {
          existingHeaders.push(h);
        }
      });

      if (Array.isArray(payload.fields)) {
        payload.fields.forEach(function(field) {
          var headerName = field.label || field.id;
          if (headerName && existingHeaders.indexOf(headerName) === -1) {
            existingHeaders.push(headerName);
          }
        });
      }

      sheet.getRange(1, 1, 1, existingHeaders.length).setValues([existingHeaders]);
      formatHeaderRow(sheet, existingHeaders.length);

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        action: 'SYNC_SCHEMA',
        sheetTab: sheetTab,
        columnCount: existingHeaders.length,
        spreadsheetUrl: ss.getUrl(),
        message: 'Sheet tab "' + sheetTab + '" successfully created and synced with ' + existingHeaders.length + ' columns!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ── ACTION 2: UPDATE MATRIX PORTFOLIO STATUS ──
    // Synchronizes secretariat / dais allocations directly into the Matrix Portfolios tab
    if (action === 'UPDATE_MATRIX_PORTFOLIO') {
      var matrixSheet = ss.getSheetByName('Matrix Portfolios');
      if (!matrixSheet) {
        initAllTabs();
        matrixSheet = ss.getSheetByName('Matrix Portfolios');
      }

      var lastRow = matrixSheet.getLastRow();
      var updated = false;

      if (lastRow > 1) {
        var data = matrixSheet.getRange(2, 1, lastRow - 1, 9).getValues();
        var targetId = (payload.portfolioId || '').toLowerCase();
        var targetTitle = (payload.portfolioTitle || payload.title || '').toLowerCase();

        for (var i = 0; i < data.length; i++) {
          var rowId = String(data[i][0]).toLowerCase();
          var rowTitle = String(data[i][2]).toLowerCase();

          if (rowId === targetId || rowTitle === targetTitle) {
            var rowIndex = i + 2;
            if (payload.status) matrixSheet.getRange(rowIndex, 6).setValue(payload.status);
            if (payload.allocatedTo !== undefined) matrixSheet.getRange(rowIndex, 7).setValue(payload.allocatedTo);
            if (payload.allocatedEmail !== undefined) matrixSheet.getRange(rowIndex, 8).setValue(payload.allocatedEmail);
            updated = true;
            break;
          }
        }
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        updated: updated,
        portfolioTitle: payload.portfolioTitle || payload.title,
        message: updated ? 'Portfolio status updated in Google Sheet' : 'Portfolio row not found in sheet'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ── ACTION 3: FETCH LIVE MATRIX PORTFOLIOS ──
    if (action === 'GET_MATRIX_PORTFOLIOS') {
      var matrixSheet2 = ss.getSheetByName('Matrix Portfolios');
      if (!matrixSheet2 || matrixSheet2.getLastRow() <= 1) {
        initAllTabs();
        matrixSheet2 = ss.getSheetByName('Matrix Portfolios');
      }

      var lastR = matrixSheet2.getLastRow();
      var portfolios = [];

      if (lastR > 1) {
        var rows2 = matrixSheet2.getRange(2, 1, lastR - 1, 9).getValues();
        portfolios = rows2.map(function(r) {
          return {
            id: String(r[0]),
            committee: String(r[1]),
            title: String(r[2]),
            subTitle: String(r[3]),
            category: String(r[4]),
            status: String(r[5] || 'Vacant'),
            allocatedTo: String(r[6] || ''),
            allocatedEmail: String(r[7] || ''),
            difficulty: String(r[8] || 'Intermediate')
          };
        });
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        count: portfolios.length,
        portfolios: portfolios,
        spreadsheetUrl: ss.getUrl()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ── ACTION 4: RECORD GENERAL INGESTION ROWS ──
    var rawTab = payload.sheetTab || payload.targetTab || payload.tab || payload.target || '';
    var schemaKey = resolveSchemaKey(rawTab);

    // Contextual inference for MUN & Secretariat forms
    if (!schemaKey) {
      var formId = (payload.formId || '').toLowerCase();
      var formTitle = (payload.formTitle || '').toLowerCase();
      if (
        formId.indexOf('secretariat') !== -1 ||
        formTitle.indexOf('secretariat') !== -1 ||
        payload.preferredSector ||
        payload.step1_primary_sector
      ) {
        schemaKey = 'SECRETARIAT';
      } else if (
        formId.indexOf('zen-diplomacy') !== -1 ||
        payload.step1_fullname ||
        payload.step3_primary_committee ||
        payload.firstCommitteeChoice
      ) {
        var commChoice = String(payload.step3_primary_committee || payload.firstCommitteeChoice || rawTab).toUpperCase();
        if (commChoice.indexOf('AIPPM') !== -1) schemaKey = 'AIPPM';
        else if (commChoice.indexOf('EMI') !== -1) schemaKey = 'EMI';
        else if (commChoice.indexOf('UNSC') !== -1) schemaKey = 'UNSC';
        else if (commChoice.indexOf('UNODC') !== -1) schemaKey = 'UNODC';
        else schemaKey = 'ZEN_DIPLOMACY_MUN';
      }
    }

    var sheet = null;
    var row = [];

    if (schemaKey && TAB_SCHEMAS[schemaKey]) {
      var schema = TAB_SCHEMAS[schemaKey];
      sheet = getOrCreateSheet(schema);
      row = mapPayloadToRow(schemaKey, payload);
    } else {
      // Dynamic fallback for custom ZenForms
      var customSheetName = payload.sheetTab || payload.targetTab || 'ZenForms Intake';
      sheet = ss.getSheetByName(customSheetName);
      if (!sheet) {
        sheet = ss.insertSheet(customSheetName);
      }

      var lastCol = sheet.getLastColumn();
      var existingHeaders = [];
      if (lastCol > 0 && sheet.getLastRow() > 0) {
        existingHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
      } else {
        existingHeaders = ['Timestamp', 'Submission ID', 'Submitter'];
        sheet.appendRow(existingHeaders);
        formatHeaderRow(sheet, existingHeaders.length);
      }

      var payloadKeys = Object.keys(payload).filter(function(k) {
        return k !== 'action' && k !== 'targetTab' && k !== 'sheetTab';
      });

      payloadKeys.forEach(function(k) {
        if (existingHeaders.indexOf(k) === -1) {
          existingHeaders.push(k);
          sheet.getRange(1, existingHeaders.length).setValue(k);
        }
      });

      var now = Utilities.formatDate(new Date(), 'GMT+5:30', 'yyyy-MM-dd HH:mm:ss');
      row = existingHeaders.map(function(h) {
        if (h === 'Timestamp') return now;
        if (h === 'Submission ID') return payload.submissionId || payload.ticketId || ('SUB-' + Math.random().toString(36).substring(2, 8).toUpperCase());
        if (h === 'Submitter') return payload.submitterHandle || payload.submitter || 'anonymous';
        return payload[h] !== undefined ? payload[h] : '';
      });
    }

    sheet.appendRow(row);

    // Dual-log: If delegate registered into specific committee tab (AIPPM/EMI/UNSC/UNODC), also record in master ZEN DIPLOMACY MUN
    if (schemaKey === 'AIPPM' || schemaKey === 'EMI' || schemaKey === 'UNSC' || schemaKey === 'UNODC') {
      try {
        var masterSheet = getOrCreateSheet(TAB_SCHEMAS.ZEN_DIPLOMACY_MUN);
        masterSheet.appendRow(row);
      } catch (_) {}
    } else if (schemaKey === 'ZEN_DIPLOMACY_MUN') {
      // If submitted directly with target ZEN_DIPLOMACY_MUN, also mirror into the specific committee tab
      var commChoice2 = String(payload.step3_primary_committee || payload.firstCommitteeChoice || '').toUpperCase();
      var cKey = null;
      if (commChoice2.indexOf('AIPPM') !== -1) cKey = 'AIPPM';
      else if (commChoice2.indexOf('EMI') !== -1) cKey = 'EMI';
      else if (commChoice2.indexOf('UNSC') !== -1) cKey = 'UNSC';
      else if (commChoice2.indexOf('UNODC') !== -1) cKey = 'UNODC';
      if (cKey && TAB_SCHEMAS[cKey]) {
        try {
          var cSheet = getOrCreateSheet(TAB_SCHEMAS[cKey]);
          cSheet.appendRow(row);
        } catch (_) {}
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'SUCCESS',
      schemaKey: schemaKey || 'CUSTOM_FORM',
      tabName: sheet.getName(),
      rowAppended: sheet.getLastRow(),
      spreadsheetUrl: ss.getUrl(),
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'ERROR',
      message: err.toString(),
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * ==============================================================================
 * GET Request Handler (One-Click Setup, Live Matrix Sync & Founder Vault Search)
 * ==============================================================================
 */
function doGet(e) {
  try {
    var params = (e && e.parameter) || {};
    var action = (params.action || '').toUpperCase();
    var ss = getOrCreateSpreadsheet();

    // 1. One-click setup URL: visiting URL?action=INIT auto-creates all tabs!
    if (action === 'INIT' || action === 'SETUP' || action === 'CREATE_SHEET') {
      var initRes = initAllTabs();
      return ContentService.createTextOutput(JSON.stringify(initRes)).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Fetch Live Committee Portfolios for /matrix
    if (action === 'GET_MATRIX_PORTFOLIOS' || action === 'PORTFOLIOS') {
      var matrixSheet = ss.getSheetByName('Matrix Portfolios');
      if (!matrixSheet || matrixSheet.getLastRow() <= 1) {
        initAllTabs();
        matrixSheet = ss.getSheetByName('Matrix Portfolios');
      }

      var lastR = matrixSheet.getLastRow();
      var portfolios = [];

      if (lastR > 1) {
        var rows = matrixSheet.getRange(2, 1, lastR - 1, 9).getValues();
        portfolios = rows.map(function(r) {
          return {
            id: String(r[0]),
            committee: String(r[1]),
            title: String(r[2]),
            subTitle: String(r[3]),
            category: String(r[4]),
            status: String(r[5] || 'Vacant'),
            allocatedTo: String(r[6] || ''),
            allocatedEmail: String(r[7] || ''),
            difficulty: String(r[8] || 'Intermediate')
          };
        });
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        count: portfolios.length,
        portfolios: portfolios,
        spreadsheetUrl: ss.getUrl()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. Bi-directional search and counts for Founder Vault
    var rawTab = params.tab || 'Donations';
    var schemaKey = resolveSchemaKey(rawTab);
    var targetSheetName = (schemaKey && TAB_SCHEMAS[schemaKey]) ? TAB_SCHEMAS[schemaKey].sheetName : rawTab;
    var sheet = ss.getSheetByName(targetSheetName);

    if (sheet) {
      var data = sheet.getDataRange().getValues();
      if (data.length > 1) {
        var headers = data[0];
        var rows = [];
        var query = (params.q || '').toLowerCase().trim();

        for (var r = 1; r < data.length; r++) {
          var row = data[r];
          var rowObj = {};
          var match = !query;

          for (var c = 0; c < headers.length; c++) {
            var val = row[c];
            rowObj[headers[c]] = val;
            if (query && String(val).toLowerCase().indexOf(query) !== -1) {
              match = true;
            }
          }

          if (match) {
            rows.push(rowObj);
          }
        }

        return ContentService.createTextOutput(JSON.stringify({
          status: 'SUCCESS',
          tab: targetSheetName,
          count: rows.length,
          rows: rows.slice(-100),
          spreadsheetUrl: ss.getUrl(),
          connected: true
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    // Default health ping
    return ContentService.createTextOutput(JSON.stringify({
      status: 'online',
      system: 'Zenvitra Master Omni-Stream & Matrix Engine v5.0',
      spreadsheetUrl: ss.getUrl(),
      totalSchemas: Object.keys(TAB_SCHEMAS).length,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'ERROR',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
