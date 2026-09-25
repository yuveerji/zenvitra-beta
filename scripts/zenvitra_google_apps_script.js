/**
 * ==============================================================================
 * ZENVITRA MASTER TELEMETRY & INGESTION ENGINE — GOOGLE APPS SCRIPT
 * ==============================================================================
 * Webhook URL:
 * https://script.google.com/macros/s/AKfycbxNKYri4iKy3VuWUn3B5x7cW40wDTS2x2Kt16u_qxfLGwACsS-Zs3-COu7EsguZdJDM/exec
 * 
 * Includes:
 * 1. ZEN DIPLOMACY MUN — Delegate Registrations & Portfolios
 * 2. SECRETARIAT APPLICATIONS — Executive Board & Department Leads
 * 3. CORE TEAM & CAREERS — Foundation Core Applications
 * 4. EVENT REGISTRATIONS — General Summit / Subscribed Events
 * 5. CONTACT, NEWSLETTER, COMMUNITY & FEEDBACK — Universal Intake
 * 6. DYNAMIC ZENFORMS — Fallback column generator for custom user forms
 * ==============================================================================
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet (e.g. your Master MUN or Zenvitra Sheet).
 * 2. In Google Sheets top menu, click Extensions > Apps Script.
 * 3. Delete all existing code in Code.gs, paste this entire file, and click Save.
 * 4. Click Deploy > New deployment (or Manage deployments > Edit > New version).
 * 5. Select type: "Web app".
 * 6. Set Description: "Zenvitra Sovereign Ingestion Engine v2"
 * 7. Set Execute as: "Me"
 * 8. Set Who has access: "Anyone" (CRITICAL: must be "Anyone", NOT "Only myself")
 * 9. Click Deploy, authorize access with your Google account.
 * 10. Copy the Web App URL and ensure it matches the URL in your application.
 * ==============================================================================
 */

// Tab Configuration & Headers Schemas
const TAB_SCHEMAS = {
  // 1. ZEN.DIPLOMACY 2026 — DELEGATE REGISTRATIONS
  'ZEN_DIPLOMACY_MUN': {
    sheetName: 'ZEN DIPLOMACY MUN',
    headers: [
      'Timestamp',
      'Full Name',
      'Email Address',
      'WhatsApp / Phone',
      'Institution / School / University',
      'City & State',
      'Participation Track',
      'Experience Level',
      'Primary Committee Choice',
      'Secondary Committee Choice',
      'Portfolio Preferences',
      'Prior Accolades & MUN Count',
      'Resolution Drafting Experience',
      'Research Dossier Link',
      'Placard Accreditation Name',
      'Motivation Statement',
      'Accommodation Assistance',
      'Emergency Contact',
      'Dietary Preference',
      'Participation Pass Tier',
      'Payment UTR / Ref Number',
      'Payment Screenshot Link',
      'Code of Conduct Accord',
      'Allocation Status',
      'Allocated Committee',
      'Allocated Portfolio',
      'Submitter Handle',
      'Form ID'
    ]
  },

  // 2. ZEN.DIPLOMACY 2026 — SECRETARIAT & EXECUTIVE BOARD APPLICATIONS
  'SECRETARIAT': {
    sheetName: 'Secretariat Applications',
    headers: [
      'Timestamp',
      'Ticket ID',
      'Full Name',
      'Email Address',
      'Phone Number',
      'Institution',
      'Grade / Academic Year',
      'City & Country',
      'Preferred Department',
      'Secondary Department',
      'Prior MUN Experience',
      'Number of MUNs Attended',
      'Prior Organizing Experience',
      'Weekly Bandwidth Commitment',
      'Available Oct 24-25, 2026',
      'Statement of Purpose (SOP)',
      'Department Practical Task Response',
      'Portfolio / Resume / Drive Link',
      'Discord Handle',
      'Sovereign Accord Accepted',
      'Review Status'
    ]
  },

  // 3. FOUNDATION CORE TEAM APPLICATIONS
  'CORE_TEAM': {
    sheetName: 'Core Team Applications',
    headers: [
      'Timestamp', 'Full Name', 'Handle', 'Email', 'Phone Number',
      'Contact Channel', 'City / Location', 'Department', 'Role Applied',
      'Portfolio URL', 'Uploaded Document', 'Past Experience',
      'Technical Dossier', 'Weekly Bandwidth', 'Motivation Statement',
      'Constitutional Accord', 'Application Status', 'IP Address'
    ]
  },

  // 4. NEWSLETTER SUBSCRIBERS
  'NEWSLETTER': {
    sheetName: 'Newsletter Subscribers',
    headers: [
      'Timestamp', 'Email Address', 'Subscription Source', 'Consent Given',
      'Status', 'Device Info', 'IP Address'
    ]
  },

  // 5. REGISTER CORE ACCOUNTS
  'REGISTER_CORE': {
    sheetName: 'Register Data Core',
    headers: [
      'Timestamp', 'User ID', 'Full Name', 'Email', 'Role Designation',
      'Access Level', 'Auth Provider', 'Account Status', 'IP Address'
    ]
  },

  // 6. LOGIN TELEMETRY
  'LOGIN_CORE': {
    sheetName: 'Login Data Core',
    headers: [
      'Timestamp', 'User ID', 'Full Name', 'Email', 'Auth Provider',
      'Login Status', 'Device Info', 'IP Address'
    ]
  },

  // 7. CONTACT INQUIRIES
  'CONTACT': {
    sheetName: 'Contact Inquiries',
    headers: [
      'Timestamp', 'Full Name', 'Email', 'Phone Number', 'Subject',
      'Query Type', 'Message', 'Source URL', 'IP Address'
    ]
  },

  // 8. COLLABORATIONS & PARTNERSHIPS
  'COLLAB': {
    sheetName: 'Collab & Partnerships',
    headers: [
      'Timestamp', 'Organization Name', 'Representative Name', 'Official Email',
      'Phone / WhatsApp', 'Collab Type', 'Proposal Summary', 'Budget Scope'
    ]
  },

  // 9. COMMUNITY MEMBERS
  'COMMUNITY': {
    sheetName: 'Community Members',
    headers: [
      'Timestamp', 'Full Name', 'Email', 'City / Region', 'Institution',
      'Primary Skills', 'Areas of Interest', 'Discord Handle', 'Status'
    ]
  },

  // 10. CAMPUS AMBASSADORS
  'CAMPUS_AMBASSADOR': {
    sheetName: 'Campus Ambassadors',
    headers: [
      'Timestamp', 'Full Name', 'College / University', 'City / State',
      'Degree / Year', 'Student ID Proof', 'Leadership Experience', 'Strategy'
    ]
  },

  // 11. GENERAL EVENT REGISTRATIONS
  'EVENTS': {
    sheetName: 'Event Registrations',
    headers: [
      'Timestamp', 'Event ID', 'Event Name', 'Participant Name', 'Participant Email',
      'Contact Number', 'Institution', 'Ticket Pass Type', 'Attendance Status'
    ]
  },

  // 12. DONATIONS & RELIEF
  'DONATIONS': {
    sheetName: 'Donations & Relief',
    headers: [
      'Timestamp', 'Donor Name', 'Donor Email', 'Amount (INR)', 'UTR / Transaction ID',
      'Target Project', 'Payment Mode', 'Notes', 'Anonymous'
    ]
  },

  // 13. FEEDBACK & GRIEVANCE
  'FEEDBACK': {
    sheetName: 'Feedback & Grievance',
    headers: [
      'Timestamp', 'Submitter Name', 'Email', 'Category', 'Severity',
      'Description', 'Page URL', 'Attachment Link'
    ]
  }
};

/**
 * Handle incoming POST requests from Zenvitra web client & API
 */
function doPost(e) {
  try {
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

    // Determine target tab from payload
    var rawTab = (payload.sheetTab || payload.targetTab || payload.tab || '').toUpperCase();
    var formId = (payload.formId || '').toLowerCase();
    var formTitle = (payload.formTitle || '').toLowerCase();

    var targetKey = 'REGISTER_CORE';

    // 1. Check for Secretariat Application
    if (
      rawTab.indexOf('SECRETARIAT') !== -1 ||
      rawTab.indexOf('SEC_APP') !== -1 ||
      formId.indexOf('secretariat') !== -1 ||
      formTitle.indexOf('secretariat') !== -1
    ) {
      targetKey = 'SECRETARIAT';
    }
    // 2. Check for Zen Diplomacy MUN / Delegate Registration
    else if (
      rawTab.indexOf('ZEN DIPLOMACY') !== -1 ||
      rawTab.indexOf('DIPLOMACY') !== -1 ||
      rawTab.indexOf('MUN') !== -1 ||
      formId.indexOf('zen-diplomacy') !== -1 ||
      formTitle.indexOf('delegate registration') !== -1 ||
      payload.step1_fullname ||
      payload.step3_primary_committee
    ) {
      targetKey = 'ZEN_DIPLOMACY_MUN';
    }
    // 3. Other Core Tabs
    else if (rawTab.indexOf('CORE_TEAM') !== -1 || rawTab.indexOf('TEAM') !== -1 || rawTab.indexOf('CAREER') !== -1) {
      targetKey = 'CORE_TEAM';
    } else if (rawTab.indexOf('NEWSLETTER') !== -1) {
      targetKey = 'NEWSLETTER';
    } else if (rawTab.indexOf('LOGIN') !== -1) {
      targetKey = 'LOGIN_CORE';
    } else if (rawTab.indexOf('CONTACT') !== -1) {
      targetKey = 'CONTACT';
    } else if (rawTab.indexOf('COLLAB') !== -1) {
      targetKey = 'COLLAB';
    } else if (rawTab.indexOf('COMMUNITY') !== -1) {
      targetKey = 'COMMUNITY';
    } else if (rawTab.indexOf('AMBASSADOR') !== -1 || rawTab.indexOf('CAMPUS') !== -1) {
      targetKey = 'CAMPUS_AMBASSADOR';
    } else if (rawTab.indexOf('EVENT') !== -1) {
      targetKey = 'EVENTS';
    } else if (rawTab.indexOf('DONAT') !== -1) {
      targetKey = 'DONATIONS';
    } else if (rawTab.indexOf('FEEDBACK') !== -1) {
      targetKey = 'FEEDBACK';
    } else if (payload.targetTab || payload.sheetTab) {
      // Dynamic sheet name from custom ZenForm
      targetKey = 'CUSTOM_ZEN_FORM';
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = '';
    var schema = null;

    if (targetKey !== 'CUSTOM_ZEN_FORM' && TAB_SCHEMAS[targetKey]) {
      schema = TAB_SCHEMAS[targetKey];
      sheetName = schema.sheetName;
    } else {
      sheetName = payload.sheetTab || payload.targetTab || 'ZenForms Intake';
    }

    var sheet = ss.getSheetByName(sheetName);

    // If sheet doesn't exist, create it with schema headers
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      if (schema && schema.headers) {
        sheet.appendRow(schema.headers);
        var headerRange = sheet.getRange(1, 1, 1, schema.headers.length);
        headerRange.setBackground('#0f172a');
        headerRange.setFontColor('#f8fafc');
        headerRange.setFontWeight('bold');
        sheet.setFrozenRows(1);
      }
    }

    var now = Utilities.formatDate(new Date(), "GMT+5:30", "yyyy-MM-dd HH:mm:ss");
    var row = [];

    // ── CASE 1: ZEN DIPLOMACY MUN (DELEGATE REGISTRATIONS) ──
    if (targetKey === 'ZEN_DIPLOMACY_MUN') {
      row = [
        now,
        payload.step1_fullname || payload.fullName || payload.name || '',
        payload.step1_email || payload.email || '',
        payload.step1_phone || payload.phone || payload.phoneNumber || '',
        payload.step1_institution || payload.institution || '',
        payload.step1_city || payload.city || '',
        payload.step2_track || payload.track || '',
        payload.step2_experience_level || payload.experienceLevel || '',
        payload.step3_primary_committee || payload.firstCommitteeChoice || '',
        payload.step4_secondary_committee || payload.secondCommitteeChoice || '',
        payload.step5_portfolios || payload.portfolioPreferences || '',
        payload.step6_prior_accolades || payload.priorAccolades || '',
        payload.step7_resolution_experience || payload.resolutionExperience || '',
        payload.step8_research_paper_link || payload.researchLink || '',
        payload.step9_accreditation_dossier || payload.accreditationPlacard || '',
        payload.step10_motivation_statement || payload.motivation || '',
        payload.step11_accommodation_assistance || payload.accommodation || 'NO',
        payload.step12_emergency_contact || payload.emergencyContact || '',
        payload.step13_dietary_pref || payload.dietaryPreference || 'Vegetarian',
        payload.step15_participation_tier || payload.participationTier || payload.passTier || 'Delegate Pass (₹499)',
        payload.step15_payment_reference || payload.utr || payload.paymentReference || '',
        payload.step15_payment_screenshot || payload.paymentScreenshot || '',
        payload.step14_code_of_conduct ? 'CONFIRMED' : 'ACCEPTED',
        payload.status || 'PENDING_ALLOCATION',
        payload.allocatedCommittee || '',
        payload.allocatedPortfolio || '',
        payload.submitterHandle || 'public_delegate',
        payload.formId || 'zen-diplomacy-2026-registration'
      ];
    }
    // ── CASE 2: SECRETARIAT APPLICATIONS ──
    else if (targetKey === 'SECRETARIAT') {
      row = [
        now,
        payload.ticketId || `SEC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        payload.fullName || payload.step2_fullname || payload.name || '',
        payload.email || payload.step2_email || '',
        payload.phoneNumber || payload.phone || payload.step2_phone || '',
        payload.institution || payload.step2_institution || '',
        payload.gradeOrYear || payload.academicYear || '',
        payload.cityCountry || payload.step2_city || payload.city || '',
        payload.preferredSector || payload.step1_preferred_department || payload.department || '',
        payload.secondarySector || payload.step1_secondary_department || '',
        payload.priorMunExperience || (payload.step3_mun_count ? String(payload.step3_mun_count) : ''),
        payload.numberOfMunsAttended || payload.step3_mun_count || '',
        payload.priorOrganizingExperience || payload.step3_prior_organizing || '',
        payload.weeklyBandwidth || payload.step3_bandwidth || '',
        payload.availabilityOct2425 || payload.step3_availability || 'YES',
        payload.statementOfPurpose || payload.step4_sop || payload.sop || '',
        payload.practicalTaskResponse || payload.step4_task_response || payload.taskResolution || '',
        payload.portfolioUrl || payload.step4_portfolio_url || payload.linkedinOrResumeUrl || '',
        payload.discordHandle || payload.step2_discord || '',
        payload.sovereignAccordAccepted || (payload.step4_accord ? 'ACCEPTED' : 'CONFIRMED'),
        payload.status || 'PENDING_REVIEW'
      ];
    }
    // ── CASE 3: FOUNDATION CORE TEAM ──
    else if (targetKey === 'CORE_TEAM') {
      row = [
        now,
        payload.fullName || '',
        payload.handle || '',
        payload.email || '',
        payload.phoneNumber || payload.phone || '',
        payload.contactChannel || '',
        payload.locationTimezone || payload.city || '',
        payload.department || '',
        payload.roleAppliedFor || payload.roleApplied || '',
        payload.portfolioUrl || payload.proofOfWorkUrl || '',
        payload.dossierUploadUrl || payload.uploadedDocumentName || '',
        payload.pastExperience || '',
        payload.technicalOrDiplomaticDossier || payload.dossier || '',
        payload.weeklyBandwidth || payload.hoursPerWeek || '',
        payload.motivationStatement || payload.motivation || '',
        payload.constitutionalAccord || payload.constitutionalAccordAccepted || 'RATIFIED',
        payload.applicationStatus || 'PENDING',
        payload.ipAddress || ''
      ];
    }
    // ── CASE 4: NEWSLETTER ──
    else if (targetKey === 'NEWSLETTER') {
      row = [
        now,
        payload.emailAddress || payload.email || '',
        payload.subscriptionSource || '',
        payload.consentGiven !== undefined ? payload.consentGiven : true,
        payload.status || 'SUBSCRIBED',
        payload.deviceInfo || payload.deviceBrowserInfo || '',
        payload.ipAddress || ''
      ];
    }
    // ── CASE 5: LOGIN CORE ──
    else if (targetKey === 'LOGIN_CORE') {
      row = [
        now,
        payload.userId || '',
        payload.fullName || '',
        payload.email || '',
        payload.authProvider || '',
        payload.loginStatus || 'SUCCESS',
        payload.deviceInfo || payload.deviceBrowserInfo || '',
        payload.ipAddress || ''
      ];
    }
    // ── CASE 6: REGISTER CORE ──
    else if (targetKey === 'REGISTER_CORE') {
      row = [
        now,
        payload.userId || '',
        payload.fullName || '',
        payload.email || '',
        payload.roleDesignation || 'USER',
        payload.accessLevel || 'STANDARD',
        payload.authProvider || 'CREDENTIALS',
        payload.accountStatus || 'ACTIVE',
        payload.ipAddress || ''
      ];
    }
    // ── CASE 7: SCHEMA-BASED GENERIC OR CUSTOM ZENFORM ──
    else if (schema && schema.headers) {
      row = [now];
      for (var i = 1; i < schema.headers.length; i++) {
        var hKey = schema.headers[i].toLowerCase().replace(/[^a-z0-9]/g, '');
        var val = '';
        for (var p in payload) {
          if (p.toLowerCase().replace(/[^a-z0-9]/g, '') === hKey) {
            val = payload[p];
            break;
          }
        }
        row.push(val);
      }
    }
    // ── CASE 8: DYNAMIC FALLBACK FOR CUSTOM ZENFORMS ──
    else {
      // Read existing headers from row 1
      var lastCol = sheet.getLastColumn();
      var existingHeaders = [];
      if (lastCol > 0) {
        existingHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
      } else {
        existingHeaders = ['Timestamp'];
        sheet.appendRow(existingHeaders);
      }

      // Add any new fields from payload as new columns
      var payloadKeys = Object.keys(payload).filter(function(k) {
        return k !== 'action' && k !== 'targetTab' && k !== 'sheetTab';
      });

      payloadKeys.forEach(function(k) {
        if (existingHeaders.indexOf(k) === -1) {
          existingHeaders.push(k);
          sheet.getRange(1, existingHeaders.length).setValue(k);
        }
      });

      // Construct row according to headers
      row = existingHeaders.map(function(h) {
        if (h === 'Timestamp') return now;
        return payload[h] !== undefined ? payload[h] : '';
      });
    }

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      targetTab: sheetName,
      rowNumber: sheet.getLastRow(),
      timestamp: now
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests for connectivity test or live count queries
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'PING';
  var tabName = (e && e.parameter && e.parameter.tab) || 'ZEN DIPLOMACY MUN';
  
  if (action === 'GET_DATA' || action === 'COUNT') {
    try {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var sheet = ss.getSheetByName(tabName);
      if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({
          status: 'error',
          message: 'Sheet not found: ' + tabName,
          count: 0
        })).setMimeType(ContentService.MimeType.JSON);
      }
      var count = Math.max(0, sheet.getLastRow() - 1);
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        sheet: tabName,
        count: count,
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: err.toString()
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'online',
    system: 'Zenvitra Master Sovereign Telemetry Webhook v2',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}
