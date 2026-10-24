/**
 * ==============================================================================
 * ZENVITRA MASTER OMNI-STREAM TELEMETRY & FORMS ENGINE (v2.5)
 * ==============================================================================
 * 
 * 🚀 QUICK DEPLOYMENT INSTRUCTIONS (30 SECONDS):
 * 1. In your Google Sheet, click "Extensions" -> "Apps Script".
 * 2. Delete ALL existing code in Code.gs and PASTE THIS ENTIRE FILE.
 * 3. Click "Save" (Ctrl+S / Cmd+S).
 * 4. From the function dropdown at the top, select "initAllTabs" and click "Run".
 *    (If prompted with "Authorization required", click Review Permissions -> Advanced -> Go to project -> Allow).
 * 5. Click "Deploy" (top right) -> "New deployment":
 *    - Click the gear icon next to "Select type" -> choose "Web app".
 *    - Description: Zenvitra Master Telemetry
 *    - Execute as: "Me" (your email)
 *    - Who has access: "Anyone" (CRITICAL: must be Anyone so website webhooks can reach it!)
 *    - Click "Deploy", authorize if prompted, and COPY the Web App URL!
 * 6. (Optional) Select "testRow" from the function dropdown and click "Run" to test!
 * 
 * ==============================================================================
 */

var ZEN = {
  VERSION: "v2.5.0",
  TIMEZONE: "Asia/Kolkata",
  C: {
    OBSIDIAN: "#0f172a",
    NAVY: "#1e293b",
    WHITE: "#ffffff",
    AMBER: "#f59e0b",
    EMERALD: "#10b981",
    CYAN: "#06b6d4"
  }
};

/**
 * ── 12 CORE OPERATIONAL STREAM SCHEMAS ──
 * All tabs use clean Row 1 headers with zero duplicate blanks.
 */
var TAB_SCHEMAS = {
  REGISTER_CORE: {
    sheetName: 'Register Data Core',
    companionName: '02 Core Registrations',
    headers: [
      'Timestamp',
      'User ID / Person ID',
      'Full Legal Name',
      'Display Name / Username',
      'Primary Email Address',
      'Phone Number [Optional]',
      'Age (Years)',
      'Minor Status (Under 18 / Adult)',
      'Parent / Guardian Full Name',
      'Parent / Guardian Emergency Contact',
      'Minor Consent & Parental Accord',
      'Role Designation',
      'Access Level',
      'Auth Provider',
      'Institution / School / University',
      'Country & City',
      'Registration Type',
      'Registration Status (REGISTER / PREREGISTER)',
      'Terms & Privacy Ratification',
      'Account Status',
      'IP Address',
      'Device / Browser'
    ]
  },

  LOGIN_CORE: {
    sheetName: 'Login Data Core',
    companionName: '03 Login Activity',
    headers: [
      'Timestamp',
      'Login Event ID',
      'User ID / Person ID',
      'Full Name',
      'Email Address',
      'Username / Handle',
      'Auth Provider',
      'Event Type',
      'Login Status / Outcome',
      'Risk Score',
      'Session Hash',
      'IP Address (Masked)',
      'Device / User Agent Summary'
    ]
  },

  EVENTS: {
    sheetName: 'Event Registrations',
    companionName: '12 Event Registrations',
    headers: [
      'Timestamp',
      'Registration ID / Ticket ID',
      'Full Name of the Delegate',
      'Primary Contact Email Address',
      'WhatsApp / Calling Number',
      'School / College / University or Independent',
      'Current City & State of Residence',
      'Participation Track',
      'Selected Delegation Pass Tier',
      'Total Pass Fee (INR)',
      'Preferred Payment Mode',
      '12-Digit UPI Transaction ID / UTR Number',
      'Upload Payment Screenshot / Receipt Proof URL',
      'Digital Signature (Full Legal Name)',
      'Date of Submission',
      'Payment Verification Status',
      'Allocated Committee',
      'Allocated Seat / Portfolio',
      'Dais Review Status',
      'Dais Review Notes',
      'IP Address',
      'Device / Browser'
    ]
  },

  CAMPUS_AMBASSADOR: {
    sheetName: 'Campus Ambassadors',
    companionName: '10 Campus Ambassadors',
    headers: [
      'Timestamp',
      'Ambassador Application ID',
      'Full Legal Name',
      'Primary Contact Email',
      'WhatsApp / Calling Phone Number',
      'College / University / School Name',
      'City & State of Residence',
      'Degree, Stream & Academic Year',
      'Leadership Experience',
      'Proposed Strategy & Outreach Plan',
      'Approval Status',
      'Reviewer Notes',
      'IP Address',
      'Device / Browser'
    ]
  },

  CORE_TEAM: {
    sheetName: 'Core Team Applications',
    companionName: '04 Team Applications',
    headers: [
      'Timestamp',
      'Application ID',
      'Full Legal Name',
      'Zenvitra Sovereign Username (@handle)',
      'Primary Email Address',
      'WhatsApp Phone Number',
      'Role Applied For',
      'Primary Department Choice',
      'Portfolio / Proof of Work URL',
      'Strategic Vision & Impact Statement',
      'Weekly Bandwidth Commitment',
      'Application Status',
      'Reviewer / Directorate Notes',
      'IP Address',
      'Device / Browser'
    ]
  },

  CONTACT: {
    sheetName: 'Contact Inquiries',
    companionName: '06 Contact Inquiries',
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
      'Device / Browser'
    ]
  },

  NEWSLETTER: {
    sheetName: 'Newsletter Subscribers',
    companionName: '07 Newsletter Subscribers',
    headers: [
      'Timestamp',
      'Subscriber ID',
      'Subscriber Email Address',
      'Subscription Source / Page',
      'Marketing & Consent Accord',
      'UTM Campaign Track',
      'Subscription Status',
      'IP Address'
    ]
  },

  DONATIONS: {
    sheetName: 'Donations',
    companionName: '20 Donations Charity',
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
      'IP Address',
      'Device / Browser'
    ]
  },

  IMPACT_LEDGER: {
    sheetName: 'Impact Ledger',
    companionName: 'Donations',
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

  COLLAB: {
    sheetName: 'Collab & Partnerships',
    companionName: '08 Collaborations',
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
      'Device / Browser'
    ]
  },

  COMMUNITY: {
    sheetName: 'Community Members',
    companionName: '09 Community Members',
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
      'Device / Browser'
    ]
  },

  FEEDBACK: {
    sheetName: 'Feedback & Grievance',
    companionName: '23 Feedback',
    headers: [
      'Timestamp',
      'Ticket ID',
      'Submitter Full Name',
      'Contact Email Address',
      'Feedback Category',
      'Severity / Priority Rank',
      'Target URL / Feature Name',
      'Feedback Description / Grievance Details',
      'Attachment / Screenshot URL',
      'Resolution Status',
      'IP Address',
      'Device / Browser'
    ]
  },

  FORMS: {
    sheetName: 'Form Submissions',
    companionName: '45 Form Submissions',
    headers: [
      'Timestamp',
      'Submission ID',
      'Form ID',
      'Form Title',
      'Submitter Name',
      'Submitter Email',
      'Submitter Handle (@tag)',
      'Raw Submission Payload',
      'IP Address',
      'Device / Browser'
    ]
  }
};

/**
 * ── FAST 1-CLICK SPREADSHEET INITIALIZATION ──
 * Creates all operational stream tabs and companion registers in < 3 seconds.
 */
function initAllTabs() {
  var ss = getOrCreateSpreadsheet();
  var created = [];

  // 1. Initialize all primary operational tabs
  for (var key in TAB_SCHEMAS) {
    if (TAB_SCHEMAS.hasOwnProperty(key)) {
      var sch = TAB_SCHEMAS[key];
      var sh = getOrCreateTabWithHeaders_(ss, sch.sheetName, sch.headers);
      if (sh) created.push(sch.sheetName);

      // Also ensure companion tab is initialized with headers
      if (sch.companionName && sch.companionName !== sch.sheetName) {
        var compSh = getOrCreateTabWithHeaders_(ss, sch.companionName, sch.headers);
        if (compSh) created.push(sch.companionName);
      }
    }
  }

  // 2. Ensure canonical 01 People directory tab exists
  var peopleHeaders = [
    'Person ID', 'Full Name', 'Display Name', 'Email Address', 'Phone Number',
    'Username / Handle', 'Account Type', 'Account Status', 'Country & City', 'Created At'
  ];
  getOrCreateTabWithHeaders_(ss, '01 People', peopleHeaders);

  // 3. Remove initial empty default sheet if other tabs exist
  var defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch (e) {}
  }

  var msg = 'Zenvitra Master Telemetry initialized! ' + created.length + ' tabs active with Row 1 headers.';
  try {
    SpreadsheetApp.getActiveSpreadsheet().toast(msg, '⚡ Setup Complete', 6);
  } catch (e) {}

  return {
    ok: true,
    status: 'success',
    version: ZEN.VERSION,
    spreadsheetUrl: ss.getUrl(),
    tabsConfigured: created.length,
    message: msg
  };
}

/**
 * Alias for setup
 */
function setupZenvitraMaster() {
  return initAllTabs();
}

/**
 * Custom UI Menu on Spreadsheet Open
 */
function onOpen() {
  try {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('⚡ ZENVITRA MASTER')
      .addItem('🚀 1-Click Setup & Initialize Tabs', 'initAllTabs')
      .addItem('🧪 Insert Test Registration Row', 'testRow')
      .addItem('🔄 Refresh & Format Headers', 'refreshHeaders_')
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
      if (sch.companionName) {
        var compSh = getSheetLoose_(ss, sch.companionName);
        if (compSh) formatHeaderRow_(compSh, sch.headers.length);
      }
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

  // Protect against edge-cases where blank rows exist
  sheet.getRange(targetRow, 1, 1, rowData.length).setValues([rowData]);
  return targetRow;
}

/**
 * 🧪 Test function to immediately verify row writing
 */
function testRow() {
  var ss = getOrCreateSpreadsheet();
  initAllTabs();

  var testPayload = {
    userId: 'TEST_' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    fullName: 'Yuveer Sovereign (Test)',
    username: 'yuveer_test',
    email: 'test@zenvitra.xyz',
    roleDesignation: 'Platform Director / Founder',
    accessLevel: 'Pre-Registered Sovereign Whitelist',
    authProvider: 'DIRECT_ENROLL',
    accountStatus: 'ACTIVE',
    age: 20,
    isMinor: false,
    minorStatus: 'ADULT (18+)',
    institution: 'Zenvitra Core Directorate',
    phoneNumber: '+91 98765 00000',
    countryCity: 'New Delhi, India',
    registrationType: 'PREREGISTER',
    registrationStatus: 'PREREGISTER',
    preferredTrack: 'Platform Leadership',
    termsRatified: true,
    targetTab: 'Register Data Core'
  };

  var targetSheet = getSheetLoose_(ss, 'Register Data Core');
  if (targetSheet) {
    var headers = targetSheet.getRange(1, 1, 1, targetSheet.getLastColumn()).getValues()[0];
    var row = headers.map(function(h) { return safe_(lookupVal(testPayload, h)); });
    var writtenRow = smartAppendRow_(targetSheet, row);
    SpreadsheetApp.getActiveSpreadsheet().toast('Successfully appended test row at Row ' + writtenRow + ' in Register Data Core!', '🧪 Test Passed', 5);
    return { ok: true, row: writtenRow };
  }
  return { ok: false, error: 'Sheet not found' };
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
    var companionTabName = '02 Core Registrations';
    var expectedHeaders = TAB_SCHEMAS.REGISTER_CORE.headers;

    if (schemaKey && TAB_SCHEMAS[schemaKey]) {
      targetTabName = TAB_SCHEMAS[schemaKey].sheetName;
      companionTabName = TAB_SCHEMAS[schemaKey].companionName;
      expectedHeaders = TAB_SCHEMAS[schemaKey].headers;
    } else if (rawTab) {
      targetTabName = resolveTabName_(rawTab);
    }

    // Get or create primary target sheet
    var targetSheet = getOrCreateTabWithHeaders_(ss, targetTabName, expectedHeaders);
    var currentHeaders = targetSheet.getRange(1, 1, 1, targetSheet.getLastColumn()).getValues()[0];

    // Dynamic column expansion for custom forms: Add question fields on the fly if missing
    var ignoredKeys = { action: true, targetTab: true, sheetTab: true, tab: true, target: true, secret: true, webhookUrl: true, customSheetUrl: true, redirect: true };
    var missingHeaders = [];
    for (var k in payload) {
      if (payload.hasOwnProperty(k) && !ignoredKeys[k]) {
        var pVal = payload[k];
        if (pVal !== "" && pVal !== null && pVal !== undefined && typeof pVal !== "object") {
          var found = false;
          var normK = normalize_(k);
          for (var h = 0; h < currentHeaders.length; h++) {
            if (normalize_(currentHeaders[h]) === normK) {
              found = true;
              break;
            }
          }
          if (!found && currentHeaders.length < 50) {
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

    // ── COMPANION DUAL-TAB SYNC ──
    if (companionTabName && companionTabName !== targetTabName) {
      try {
        var companionSheet = getOrCreateTabWithHeaders_(ss, companionTabName, expectedHeaders);
        if (companionSheet && companionSheet.getSheetId() !== targetSheet.getSheetId()) {
          var compHeaders = companionSheet.getRange(1, 1, 1, companionSheet.getLastColumn()).getValues()[0];
          var compRow = compHeaders.map(function(ch) {
            return safe_(lookupVal(payload, ch));
          });
          smartAppendRow_(companionSheet, compRow);
        }
      } catch (compErr) {
        // Safe continuation
      }
    }

    // ── CANONICAL 01 PEOPLE DIRECTORY AUTO-UPSERT ──
    var userEmail = payload.email || payload.Email || payload.primaryEmail || payload.participantEmail;
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

    if (action === 'TEST') {
      return json_(testRow());
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
  var fullName = payload.fullName || payload.name || payload.legalName || 'Sovereign Citizen';
  var username = payload.username || payload.preferredHandle || payload.handle || email.split('@')[0];
  var phone = payload.phoneNumber || payload.phone || '';
  var countryCity = payload.countryCity || payload.city || 'Global';
  var accountType = String(payload.registrationStatus || payload.registrationType || '').includes('PRE') ? 'Pre-Registered' : 'Member';

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

  if (s.indexOf('REGISTER') !== -1 || s.indexOf('CORE REG') !== -1) return 'REGISTER_CORE';
  if (s.indexOf('LOGIN') !== -1 || s.indexOf('AUTH') !== -1) return 'LOGIN_CORE';
  if (s.indexOf('EVENT') !== -1 || s.indexOf('PASS') !== -1 || s.indexOf('TICKET') !== -1 || s.indexOf('SUMMIT') !== -1) return 'EVENTS';
  if (s.indexOf('AMBASSADOR') !== -1 || s.indexOf('CAMPUS') !== -1) return 'CAMPUS_AMBASSADOR';
  if (s.indexOf('CORE TEAM') !== -1 || s.indexOf('TEAM APPL') !== -1 || s.indexOf('CAREER') !== -1) return 'CORE_TEAM';
  if (s.indexOf('CONTACT') !== -1 || s.indexOf('INQUIR') !== -1) return 'CONTACT';
  if (s.indexOf('NEWSLETTER') !== -1 || s.indexOf('SUBSCRIB') !== -1) return 'NEWSLETTER';
  if (s.indexOf('COLLAB') !== -1 || s.indexOf('PARTNER') !== -1) return 'COLLAB';
  if (s.indexOf('COMMUNITY') !== -1) return 'COMMUNITY';
  if (s.indexOf('DONAT') !== -1) return 'DONATIONS';
  if (s.indexOf('IMPACT') !== -1 || s.indexOf('LEDGER') !== -1) return 'IMPACT_LEDGER';
  if (s.indexOf('FEEDBACK') !== -1 || s.indexOf('GRIEVANCE') !== -1) return 'FEEDBACK';
  if (s.indexOf('FORM') !== -1 || s.indexOf('SUBMISSION') !== -1) return 'FORMS';

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
 * ── RESILIENT COMPREHENSIVE FIELD RESOLVER ──
 * Extracts value for every column header from payload without leaving blank cells.
 */
function lookupVal(data, header) {
  if (!data || !header) return "";

  // 1. Exact match
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

  // 4. Semantic field mapping for all domain schemas

  // ── TIMESTAMP / DATE ──
  if (hAlpha.indexOf("timestamp") !== -1 || hAlpha.indexOf("dateofsubmission") !== -1 || hAlpha.indexOf("submissiondate") !== -1 || hAlpha.indexOf("createdat") !== -1) {
    if (data.timestamp) return String(data.timestamp);
    if (data.submissionDate) return String(data.submissionDate);
    return Utilities.formatDate(new Date(), ZEN.TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
  }

  // ── USERNAME / HANDLE / DISPLAY NAME (MUST BE CHECKED BEFORE FULL NAME) ──
  if (hAlpha.indexOf("username") !== -1 || hAlpha.indexOf("handle") !== -1 || hAlpha.indexOf("displayname") !== -1) {
    var rawHandle = data.username || data.preferredHandle || data.handle || data.displayName || data.submitterHandle || data.cleanHandle || "";
    if (rawHandle) {
      return (String(rawHandle).startsWith('@') ? '' : '@') + String(rawHandle).replace(/[^a-zA-Z0-9_]/g, '');
    }
    return data.email ? '@' + String(data.email).split('@')[0] : '';
  }

  // ── USER ID / PERSON ID ──
  if ((hAlpha.indexOf("userid") !== -1 || hAlpha.indexOf("personid") !== -1) && hAlpha.indexOf("ticket") === -1) {
    return data.userId || data.personId || data.id || data.User_ID || data.Person_ID || ('ZV-USR-' + shortHash_(data.email || String(Math.random())).toUpperCase());
  }

  // ── FULL LEGAL NAME / PARTICIPANT NAME ──
  if (hAlpha.indexOf("name") !== -1 && hAlpha.indexOf("parent") === -1 && hAlpha.indexOf("guardian") === -1 && hAlpha.indexOf("org") === -1) {
    return data.fullName || data.legalName || data.name || data.participantName || data.fullLegalName || data.submitterName || data.donorName || "Sovereign Citizen";
  }

  // ── EMAIL ADDRESS ──
  if (hAlpha.indexOf("email") !== -1 && hAlpha.indexOf("guardian") === -1 && hAlpha.indexOf("reviewer") === -1) {
    return data.email || data.primaryEmail || data.participantEmail || data.donorEmail || data.officialEmail || "";
  }

  // ── PHONE NUMBER / WHATSAPP ──
  if ((hAlpha.indexOf("phone") !== -1 || hAlpha.indexOf("whatsapp") !== -1 || hAlpha.indexOf("calling") !== -1 || hAlpha.indexOf("contactnumber") !== -1) && hAlpha.indexOf("guardian") === -1 && hAlpha.indexOf("emergency") === -1) {
    return data.phoneNumber || data.phone || data.contactNumber || data.contactPhone || data.phoneWhatsapp || "N/A";
  }

  // ── AGE (YEARS) ──
  if ((hAlpha.indexOf("age") !== -1 || hAlpha.indexOf("years") !== -1) && hAlpha.indexOf("minor") === -1) {
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
    if (data.parentName || data.parentGuardianName) return data.parentName || data.parentGuardianName;
    return (Number(data.age) < 18) ? "PENDING_GUARDIAN" : "N/A (ADULT 18+)";
  }

  // ── PARENT / GUARDIAN EMERGENCY CONTACT ──
  if ((hAlpha.indexOf("parent") !== -1 || hAlpha.indexOf("guardian") !== -1 || hAlpha.indexOf("emergency") !== -1) && (hAlpha.indexOf("contact") !== -1 || hAlpha.indexOf("phone") !== -1 || hAlpha.indexOf("number") !== -1)) {
    if (data.parentContact || data.parentGuardianContact) return data.parentContact || data.parentGuardianContact;
    return (Number(data.age) < 18) ? "PENDING_CONTACT" : "N/A (ADULT 18+)";
  }

  // ── MINOR CONSENT & PARENTAL ACCORD ──
  if (hAlpha.indexOf("consent") !== -1 || hAlpha.indexOf("parentalaccord") !== -1) {
    if (data.minorConsent === true || data.minorConfirmed === true) return "CONSENT_RATIFIED";
    if (Number(data.age) >= 18) return "NOT_APPLICABLE (ADULT 18+)";
    return "PENDING";
  }

  // ── ROLE DESIGNATION / PLATFORM TRACK ──
  if (hAlpha.indexOf("roledesignation") !== -1 || hAlpha.indexOf("role") !== -1 || hAlpha.indexOf("track") !== -1) {
    return data.roleDesignation || data.roleInterest || data.preferredTrack || data.initialRole || data.roleAppliedFor || data.role || data.ticketPassType || "Student Delegate";
  }

  // ── ACCESS LEVEL ──
  if (hAlpha.indexOf("accesslevel") !== -1 || hAlpha.indexOf("access") !== -1) {
    if (data.accessLevel) return data.accessLevel;
    var isPre = String(data.registrationStatus || data.registrationType || '').toUpperCase().includes('PRE');
    return isPre ? "Pre-Registered Sovereign Whitelist" : "Direct Registered Member";
  }

  // ── AUTH PROVIDER ──
  if (hAlpha.indexOf("authprovider") !== -1 || hAlpha.indexOf("provider") !== -1) {
    return data.authProvider || data.provider || "DIRECT_ENROLL";
  }

  // ── INSTITUTION / SCHOOL / UNIVERSITY ──
  if (hAlpha.indexOf("institution") !== -1 || hAlpha.indexOf("school") !== -1 || hAlpha.indexOf("college") !== -1 || hAlpha.indexOf("university") !== -1) {
    return data.institution || data.institutionOrSchool || data.collegeUniversityName || data.institutionAffiliation || data.college || "Independent";
  }

  // ── COUNTRY & CITY / LOCATION ──
  if (hAlpha.indexOf("city") !== -1 || hAlpha.indexOf("country") !== -1 || hAlpha.indexOf("location") !== -1 || hAlpha.indexOf("state") !== -1) {
    return data.countryCity || data.cityState || data.city || data.location || "Pan-India / Global";
  }

  // ── REGISTRATION TYPE & REGISTRATION STATUS (REGISTER / PREREGISTER FOR PERKS) ──
  if (hAlpha.indexOf("registrationstatus") !== -1 || hAlpha.indexOf("registrationtype") !== -1 || hAlpha.indexOf("preregister") !== -1) {
    var rawReg = String(data.registrationStatus || data.registrationType || data.accessLevel || "").toUpperCase();
    if (rawReg.indexOf("PRE") !== -1 || data.isPreRegistered === true) {
      return "PREREGISTER";
    }
    return "REGISTER";
  }

  // ── TERMS & PRIVACY RATIFICATION ──
  if (hAlpha.indexOf("terms") !== -1 || hAlpha.indexOf("ratification") !== -1 || hAlpha.indexOf("accord") !== -1) {
    return (data.termsRatified || data.termsAccepted) ? "RATIFIED" : "PENDING";
  }

  // ── ACCOUNT STATUS / VERIFICATION STATUS ──
  if (hAlpha.indexOf("accountstatus") !== -1 || hAlpha.indexOf("approvalstatus") !== -1 || hAlpha.indexOf("reviewstatus") !== -1) {
    return data.accountStatus || data.approvalStatus || data.reviewStatus || "ACTIVE";
  }

  // ── TICKET ID / REGISTRATION ID / APPLICATION ID ──
  if (hAlpha.indexOf("ticketid") !== -1 || hAlpha.indexOf("registrationid") !== -1 || hAlpha.indexOf("applicationid") !== -1 || hAlpha.indexOf("inquiryid") !== -1 || hAlpha.indexOf("donationid") !== -1 || hAlpha.indexOf("ambassadorid") !== -1 || hAlpha.indexOf("submissionid") !== -1) {
    return data.ticketId || data.registrationId || data.applicationId || data.inquiryId || data.donationId || data.ambassadorId || data.submissionId || data.id || ('ZV-' + Math.random().toString(36).substring(2, 8).toUpperCase());
  }

  // ── PASS TIER / PASS FEE / AMOUNT ──
  if (hAlpha.indexOf("passtier") !== -1 || hAlpha.indexOf("ticketpass") !== -1) {
    return data.ticketPassType || data.passType || data.selectedPassTier || "Genesis Founding Pass";
  }
  if (hAlpha.indexOf("fee") !== -1 || hAlpha.indexOf("amount") !== -1 || hAlpha.indexOf("price") !== -1) {
    return data.totalPrice !== undefined ? String(data.totalPrice) : (data.amountInr !== undefined ? String(data.amountInr) : (data.voluntaryAmountInr !== undefined ? String(data.voluntaryAmountInr) : "0"));
  }

  // ── PAYMENT MODE / UTR NUMBER ──
  if (hAlpha.indexOf("paymentmode") !== -1 || hAlpha.indexOf("gateway") !== -1) {
    return data.paymentMode || data.paymentMethod || "Genesis Whitelist Waiver / UPI";
  }
  if (hAlpha.indexOf("utr") !== -1 || hAlpha.indexOf("transactionid") !== -1) {
    return data.utrTransactionId || data.utr || data.transactionRef || "GENESIS_WHITELIST";
  }
  if (hAlpha.indexOf("screenshot") !== -1 || hAlpha.indexOf("proof") !== -1) {
    return data.paymentScreenshotPreview || data.paymentScreenshot || data.receiptUrl || data.dossierUploadUrl || "N/A";
  }

  // ── DIGITAL SIGNATURE ──
  if (hAlpha.indexOf("signature") !== -1) {
    return data.signature || data.fullName || data.name || "Ratified Electronically";
  }

  // ── IP ADDRESS & DEVICE ──
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

  // 1. Direct match
  var sh = ss.getSheetByName(target);
  if (sh) return sh;

  // 2. Clean space-separated match
  var spaceName = target.replace(/_/g, " ").replace(/\s+/g, " ").trim();
  sh = ss.getSheetByName(spaceName);
  if (sh) return sh;

  // 3. Legacy underscore match
  var underscoreName = target.replace(/\s+/g, "_");
  sh = ss.getSheetByName(underscoreName);
  if (sh) return sh;

  // 4. Normalized match across all sheets
  var normTarget = normalize_(target);
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (normalize_(sheets[i].getName()) === normTarget) {
      return sheets[i];
    }
  }

  // 5. Stripped leading numbers match (e.g. "02 Core Registrations" -> "Core Registrations")
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
