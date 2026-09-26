/**
 * ==============================================================================
 * ZENVITRA MASTER TELEMETRY & INGESTION ENGINE — GOOGLE APPS SCRIPT (v3)
 * ==============================================================================
 * Webhook URL:
 * https://script.google.com/macros/s/AKfycbwMJVccvxnhbk13ppFVu44gpA9cZ95nR1oojq-c4P1r6YWK45hKp0f3Tydk4RJO6v0Q/exec
 * 
 * Automatically handles:
 * 1. ZEN DIPLOMACY MUN — Delegate Registrations & Portfolios (tab: 'ZEN DIPLOMACY MUN')
 * 2. SECRETARIAT APPLICATIONS — Executive Board & Departments (tab: 'Secretariat Applications')
 * 3. CORE TEAM & CAREERS — Foundation Core Applications (tab: 'Core Team Applications')
 * 4. EVENT REGISTRATIONS — General Summit / Subscribed Events (tab: 'Event Registrations')
 * 5. CONTACT INQUIRIES — Universal Intake (tab: 'Contact Inquiries')
 * 6. Dynamic ZenForms — Auto-generates columns for custom user-created forms
 * ==============================================================================
 * INSTRUCTIONS:
 * 1. Open your Google Sheet.
 * 2. Click Extensions > Apps Script.
 * 3. Replace all existing code in Code.gs with this script.
 * 4. Click Save (floppy disk icon).
 * 5. Select "initAllTabs" in the function dropdown at the top and click "Run".
 *    (This will create all 5 tabs with formatted dark headers immediately!)
 * 6. Click Deploy > Manage deployments > Click the pencil icon on your deployment.
 * 7. Set Version: "New version".
 * 8. Set Execute as: "Me" | Who has access: "Anyone".
 * 9. Click Deploy.
 * ==============================================================================
 */

const TAB_SCHEMAS = {
  // 1. DELEGATE REGISTRATIONS
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

  // 2. SECRETARIAT & EXECUTIVE BOARD APPLICATIONS
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

  // 3. CORE TEAM & GENERAL INTAKE
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
  'EVENTS': {
    sheetName: 'Event Registrations',
    headers: [
      'Timestamp', 'Event ID', 'Event Name', 'Participant Name', 'Participant Email',
      'Contact Number', 'Institution', 'Ticket Pass Type', 'Attendance Status'
    ]
  },
  'CONTACT': {
    sheetName: 'Contact Inquiries',
    headers: [
      'Timestamp', 'Full Name', 'Email', 'Phone Number', 'Subject',
      'Query Type', 'Message', 'Source URL', 'IP Address'
    ]
  }
};

/**
 * Run this function in Apps Script to instantly create and style all sheet tabs!
 */
function initAllTabs() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var created = [];

  Object.keys(TAB_SCHEMAS).forEach(function(key) {
    var schema = TAB_SCHEMAS[key];
    var sheet = ss.getSheetByName(schema.sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(schema.sheetName);
      sheet.appendRow(schema.headers);
      var headerRange = sheet.getRange(1, 1, 1, schema.headers.length);
      headerRange.setBackground('#0f172a');
      headerRange.setFontColor('#f8fafc');
      headerRange.setFontWeight('bold');
      sheet.setFrozenRows(1);
      created.push(schema.sheetName);
    }
  });

  return 'Tabs initialized: ' + (created.length > 0 ? created.join(', ') : 'All tabs already exist');
}

/**
 * Handle POST requests from website forms
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

    var rawTab = (payload.sheetTab || payload.targetTab || payload.tab || '').toUpperCase();
    var formId = (payload.formId || '').toLowerCase();
    var formTitle = (payload.formTitle || '').toLowerCase();

    var targetKey = 'ZEN_DIPLOMACY_MUN';

    // 1. Identify Secretariat Applications
    if (
      rawTab.indexOf('SECRETARIAT') !== -1 ||
      rawTab.indexOf('SEC_APP') !== -1 ||
      formId.indexOf('secretariat') !== -1 ||
      formTitle.indexOf('secretariat') !== -1 ||
      payload.preferredSector ||
      payload.step1_primary_sector ||
      payload.step1_preferred_department
    ) {
      targetKey = 'SECRETARIAT';
    }
    // 2. Identify Zen Diplomacy MUN (Delegate Registration)
    else if (
      rawTab.indexOf('ZEN DIPLOMACY') !== -1 ||
      rawTab.indexOf('DIPLOMACY') !== -1 ||
      rawTab.indexOf('MUN') !== -1 ||
      formId.indexOf('zen-diplomacy') !== -1 ||
      payload.step1_fullname ||
      payload.step3_primary_committee
    ) {
      targetKey = 'ZEN_DIPLOMACY_MUN';
    }
    // 3. Foundation Core & General
    else if (rawTab.indexOf('CORE') !== -1 || rawTab.indexOf('TEAM') !== -1) {
      targetKey = 'CORE_TEAM';
    } else if (rawTab.indexOf('EVENT') !== -1) {
      targetKey = 'EVENTS';
    } else if (rawTab.indexOf('CONTACT') !== -1) {
      targetKey = 'CONTACT';
    } else if (payload.targetTab || payload.sheetTab) {
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

    // Auto-create tab if not present
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

    // ── DELEGATE REGISTRATION ROW ──
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
        payload.step15_receipt_link || payload.step15_payment_screenshot || payload.paymentScreenshot || '',
        payload.step14_code_of_conduct ? 'CONFIRMED' : 'ACCEPTED',
        payload.status || 'PENDING_ALLOCATION',
        payload.allocatedCommittee || '',
        payload.allocatedPortfolio || '',
        payload.submitterHandle || 'public_delegate',
        payload.formId || 'zen-diplomacy-2026-registration'
      ];
    }
    // ── SECRETARIAT APPLICATION ROW ──
    else if (targetKey === 'SECRETARIAT') {
      row = [
        now,
        payload.ticketId || ('SEC-' + Math.random().toString(36).substring(2, 8).toUpperCase()),
        payload.fullName || payload.step2_fullname || payload.name || '',
        payload.email || payload.step2_email || '',
        payload.phoneNumber || payload.phone || payload.step2_phone || '',
        payload.institution || payload.step2_institution || '',
        payload.gradeOrYear || payload.academicYear || payload.step2_grade || '',
        payload.cityCountry || payload.step2_city || payload.step2_city_country || payload.city || '',
        payload.preferredSector || payload.step1_primary_sector || payload.step1_preferred_department || payload.department || '',
        payload.secondarySector || payload.step1_secondary_sector || payload.step1_secondary_department || '',
        payload.priorMunExperience || payload.step3_prior_muns_count || (payload.step3_mun_count ? String(payload.step3_mun_count) : ''),
        payload.numberOfMunsAttended || payload.step3_prior_muns_count || payload.step3_mun_count || '',
        payload.priorOrganizingExperience || payload.step3_organizing_experience || payload.step3_prior_organizing || '',
        payload.weeklyBandwidth || payload.step3_weekly_bandwidth || payload.step3_bandwidth || '',
        payload.availabilityOct2425 || payload.step4_availability_oct2425 || payload.step3_availability || 'YES',
        payload.statementOfPurpose || payload.step3_sop || payload.step4_sop || payload.sop || '',
        payload.practicalTaskResponse || payload.step3_practical_response || payload.step4_task_response || payload.taskResolution || '',
        payload.portfolioUrl || payload.step3_portfolio_url || payload.step4_portfolio_url || payload.linkedinOrResumeUrl || '',
        payload.discordHandle || payload.step4_discord_handle || payload.step2_discord || '',
        payload.sovereignAccordAccepted || payload.step4_accord_agreement || (payload.step4_accord ? 'ACCEPTED' : 'CONFIRMED'),
        payload.status || 'PENDING_REVIEW'
      ];
    }
    // ── DYNAMIC FALLBACK FOR CUSTOM FORMS ──
    else {
      var lastCol = sheet.getLastColumn();
      var existingHeaders = [];
      if (lastCol > 0) {
        existingHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
      } else {
        existingHeaders = ['Timestamp'];
        sheet.appendRow(existingHeaders);
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
 * Handle GET requests
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'PING';
  var tabName = (e && e.parameter && e.parameter.tab) || 'ZEN DIPLOMACY MUN';
  
  // 1. One-click setup URL: visiting URL?action=INIT auto-creates all 5 tabs!
  if (action === 'INIT' || action === 'SETUP') {
    var resultMsg = initAllTabs();
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: resultMsg,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // 2. Query tab row count or verify status
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

  // Auto-run init if Sheet1 is lonely
  try {
    initAllTabs();
  } catch (_) {}

  return ContentService.createTextOutput(JSON.stringify({
    status: 'online',
    system: 'Zenvitra Master Sovereign Telemetry Webhook v3',
    availableTabs: ['ZEN DIPLOMACY MUN', 'Secretariat Applications', 'Core Team Applications', 'Event Registrations', 'Contact Inquiries'],
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}
