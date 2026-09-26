/**
 * ==============================================================================
 * ZENVITRA MASTER TELEMETRY, FORMS & MATRIX ENGINE — GOOGLE APPS SCRIPT (v4)
 * ==============================================================================
 * Webhook URL:
 * https://script.google.com/macros/s/AKfycbwMJVccvxnhbk13ppFVu44gpA9cZ95nR1oojq-c4P1r6YWK45hKp0f3Tydk4RJO6v0Q/exec
 * 
 * Automatically handles:
 * 1. AUTOMATIC SPREADSHEET & TAB CREATION — Creates or attaches master Google Sheet
 * 2. LIVE MATRIX PORTFOLIO SYNC — Reads & writes portfolios in Google Sheet, syncs with /matrix
 * 3. DYNAMIC ZENFORMS SCHEMA SYNC — Adds & updates columns in real-time when forms change
 * 4. EVENT REGISTRATIONS — Connects events & pass bookings directly to Google Sheets
 * 5. ZEN DIPLOMACY MUN & SECRETARIAT — High-fidelity telemetry dispatches
 * ==============================================================================
 * ONE-CLICK SETUP:
 * 1. In Apps Script, click Run with function "initAllTabs".
 * 2. It will automatically create all tabs and populate the 36 Committee Portfolios!
 * 3. Deploy > New deployment > Web app > Execute as "Me", Access "Anyone".
 * ==============================================================================
 */

// ── 36 OFFICIAL COMMITTEE PORTFOLIOS FOR LIVE MATRIX ──
const INITIAL_MATRIX_PORTFOLIOS = [
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

  // 3. MATRIX PORTFOLIOS (AUTO-SYNCS LIVE TO /matrix)
  'MATRIX_PORTFOLIOS': {
    sheetName: 'Matrix Portfolios',
    headers: [
      'Portfolio ID',
      'Committee',
      'Portfolio Title',
      'Subtitle / Description',
      'Category',
      'Status',
      'Allocated To (Name)',
      'Allocated Email',
      'Difficulty'
    ]
  },

  // 4. EVENT REGISTRATIONS & TICKET BOOKINGS
  'EVENTS': {
    sheetName: 'Event Registrations',
    headers: [
      'Timestamp',
      'Event ID',
      'Event Name',
      'Participant Name',
      'Participant Email',
      'Contact Number',
      'Institution / College',
      'Ticket Pass Type',
      'Quantity',
      'Allocated Seat / Portfolio',
      'Total Price',
      'Payment Status'
    ]
  },

  // 5. CORE TEAM APPLICATIONS
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

  // 6. CONTACT INQUIRIES
  'CONTACT': {
    sheetName: 'Contact Inquiries',
    headers: [
      'Timestamp', 'Full Name', 'Email', 'Phone Number', 'Subject',
      'Query Type', 'Message', 'Source URL', 'IP Address'
    ]
  }
};

/**
 * Gets active spreadsheet or automatically creates a new one in Google Drive
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
 * One-click initialization: Auto-creates all tabs, styles headers, and pre-seeds Matrix Portfolios
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

    // Ensure header row is populated
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(schema.headers);
      isNew = true;
    }

    // Format Header Row
    var headerRange = sheet.getRange(1, 1, 1, schema.headers.length);
    headerRange.setBackground('#0f172a');
    headerRange.setFontColor('#f8fafc');
    headerRange.setFontWeight('bold');
    sheet.setFrozenRows(1);

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
      var statusRule = SpreadsheetApp.newDataValidation()
        .requireValueInList(['Vacant', 'Allocated', '1 person waiting', '2 people waiting', '3+ people waiting'], true)
        .build();
      sheet.getRange(2, 6, 100, 1).setDataValidation(statusRule);
    }
  });

  return {
    status: 'success',
    spreadsheetUrl: ss.getUrl(),
    spreadsheetId: ss.getId(),
    createdTabs: created,
    message: 'Tabs initialized: ' + (created.length > 0 ? created.join(', ') : 'All tabs active and formatted')
  };
}

/**
 * Handle POST requests from website forms & matrix sync
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

    var ss = getOrCreateSpreadsheet();
    var action = (payload.action || '').toUpperCase();

    // ── ACTION 1: DYNAMIC ZENFORMS SCHEMA SYNC ──
    // When a form is created or updated in ZenForms, this automatically syncs columns to Google Sheets!
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

      // Default system leading columns
      var defaultHeaders = ['Timestamp', 'Submission ID', 'Submitter Handle'];
      defaultHeaders.forEach(function(h) {
        if (existingHeaders.indexOf(h) === -1) {
          existingHeaders.push(h);
        }
      });

      // Add columns for each question in the ZenForm
      if (Array.isArray(payload.fields)) {
        payload.fields.forEach(function(field) {
          var headerName = field.label || field.id;
          if (headerName && existingHeaders.indexOf(headerName) === -1) {
            existingHeaders.push(headerName);
          }
        });
      }

      // Write updated header row
      sheet.getRange(1, 1, 1, existingHeaders.length).setValues([existingHeaders]);
      var hr = sheet.getRange(1, 1, 1, existingHeaders.length);
      hr.setBackground('#0f172a');
      hr.setFontColor('#f8fafc');
      hr.setFontWeight('bold');
      sheet.setFrozenRows(1);

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
    // When secretariat or dais allocates a portfolio in the app, this syncs it to Google Sheets
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
      if (!matrixSheet2) {
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
    var rawTab = (payload.sheetTab || payload.targetTab || payload.tab || '').toUpperCase();
    var formId = (payload.formId || '').toLowerCase();
    var formTitle = (payload.formTitle || '').toLowerCase();

    var targetKey = 'ZEN_DIPLOMACY_MUN';

    if (
      rawTab.indexOf('SECRETARIAT') !== -1 ||
      rawTab.indexOf('SEC_APP') !== -1 ||
      formId.indexOf('secretariat') !== -1 ||
      formTitle.indexOf('secretariat') !== -1 ||
      payload.preferredSector ||
      payload.step1_primary_sector
    ) {
      targetKey = 'SECRETARIAT';
    } else if (
      rawTab.indexOf('ZEN DIPLOMACY') !== -1 ||
      rawTab.indexOf('DIPLOMACY') !== -1 ||
      rawTab.indexOf('MUN') !== -1 ||
      formId.indexOf('zen-diplomacy') !== -1 ||
      payload.step1_fullname ||
      payload.step3_primary_committee
    ) {
      targetKey = 'ZEN_DIPLOMACY_MUN';
    } else if (rawTab.indexOf('EVENT') !== -1) {
      targetKey = 'EVENTS';
    } else if (rawTab.indexOf('CORE') !== -1 || rawTab.indexOf('TEAM') !== -1) {
      targetKey = 'CORE_TEAM';
    } else if (rawTab.indexOf('CONTACT') !== -1) {
      targetKey = 'CONTACT';
    } else if (payload.targetTab || payload.sheetTab) {
      targetKey = 'CUSTOM_ZEN_FORM';
    }

    var sheetName = '';
    var schema = null;

    if (targetKey !== 'CUSTOM_ZEN_FORM' && TAB_SCHEMAS[targetKey]) {
      schema = TAB_SCHEMAS[targetKey];
      sheetName = schema.sheetName;
    } else {
      sheetName = payload.sheetTab || payload.targetTab || 'ZenForms Intake';
    }

    var sheet = ss.getSheetByName(sheetName);

    // Auto-create tab if missing
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
        payload.priorMunExperience || payload.step3_prior_muns_count || '',
        payload.numberOfMunsAttended || payload.step3_prior_muns_count || '',
        payload.priorOrganizingExperience || payload.step3_organizing_experience || '',
        payload.weeklyBandwidth || payload.step3_weekly_bandwidth || '',
        payload.availabilityOct2425 || payload.step4_availability_oct2425 || 'YES',
        payload.statementOfPurpose || payload.step3_sop || '',
        payload.practicalTaskResponse || payload.step3_practical_response || '',
        payload.portfolioUrl || payload.step3_portfolio_url || payload.linkedinOrResumeUrl || '',
        payload.discordHandle || payload.step4_discord_handle || '',
        payload.sovereignAccordAccepted || payload.step4_accord_agreement || 'ACCEPTED',
        payload.status || 'PENDING_REVIEW'
      ];
    }
    // ── EVENT REGISTRATION ROW ──
    else if (targetKey === 'EVENTS') {
      row = [
        now,
        payload.eventId || '',
        payload.eventName || payload.eventTitle || '',
        payload.participantName || payload.name || payload.fullName || '',
        payload.participantEmail || payload.email || '',
        payload.contactNumber || payload.phone || payload.phoneNumber || '',
        payload.institution || payload.college || payload.collegeOrSchool || '',
        payload.ticketPassType || payload.passType || payload.tierName || '',
        payload.quantity || 1,
        payload.allocatedSeat || payload.allocatedPortfolio || payload.portfolio || '',
        payload.totalPrice || payload.totalPayable || '',
        payload.paymentStatus || 'CONFIRMED'
      ];
    }
    // ── DYNAMIC FALLBACK FOR CUSTOM FORMS ──
    else {
      var lastCol = sheet.getLastColumn();
      var existingHeaders = [];
      if (lastCol > 0) {
        existingHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
      } else {
        existingHeaders = ['Timestamp', 'Submission ID', 'Submitter'];
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
        if (h === 'Submission ID') return payload.submissionId || payload.ticketId || ('SUB-' + Math.random().toString(36).substring(2, 8).toUpperCase());
        if (h === 'Submitter') return payload.submitterHandle || payload.submitter || 'anonymous';
        return payload[h] !== undefined ? payload[h] : '';
      });
    }

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      targetTab: sheetName,
      rowNumber: sheet.getLastRow(),
      spreadsheetUrl: ss.getUrl(),
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
 * Handle GET requests (One-click setup, Live Matrix Portfolios fetch, Health check)
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'PING';
  var ss = getOrCreateSpreadsheet();

  // 1. One-click setup URL: visiting URL?action=INIT auto-creates all tabs & matrix portfolios!
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

  // Auto-run init to ensure tabs exist
  try {
    initAllTabs();
  } catch (_) {}

  return ContentService.createTextOutput(JSON.stringify({
    status: 'online',
    system: 'Zenvitra Master Telemetry & Live Matrix Engine v4',
    spreadsheetUrl: ss.getUrl(),
    availableTabs: ['ZEN DIPLOMACY MUN', 'Secretariat Applications', 'Matrix Portfolios', 'Event Registrations', 'Core Team Applications', 'Contact Inquiries'],
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}
