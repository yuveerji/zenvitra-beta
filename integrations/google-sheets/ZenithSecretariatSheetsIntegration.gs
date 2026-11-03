/**
 * ══════════════════════════════════════════════════════════════════════════
 * ZENITH MODEL UNITED NATIONS 2026 — SECRETARIAT MULTI-TAB GOOGLE SHEETS SYSTEM
 * PRESENTED BY ZENVITRA | BY YOUTH. FOR YOUTH.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * FEATURES:
 * 1. Automatically routes submissions into dedicated department tabs:
 *    • 📋 Master - All Responses
 *    • 🌐 Dept - Delegate Affairs
 *    • 📣 Dept - PR & Marketing
 *    • 🎨 Dept - Design & Creative
 *    • 🎙️ Dept - Media & Comms
 *    • 💻 Dept - Technical & Website
 *    • 🏛️ Dept - Events & Ops
 *    • 📜 Dept - Research & Content
 * 2. Department-specific tabs feature the exact 4 practical questions as column headers!
 * 3. Pre-configured 100% Merit Selection Scorecard with automated =SUM(...) formulas.
 * 4. Adds a one-click "🏛️ ZENITH MUN" menu in Google Sheets to initialize/reformat all tabs.
 *
 * HOW TO INSTALL IN GOOGLE SHEETS:
 * 1. Open your Google Sheet for Zenith MUN 2026.
 * 2. In the top menu, click Extensions > Apps Script.
 * 3. Replace any code with this entire file and click Save (💾).
 * 4. Click "Deploy" > "New deployment" > Select type: "Web app".
 * 5. Set: Execute as "Me", Who has access: "Anyone".
 * 6. Click Deploy, copy the "Web app URL", and set it in your .env as:
 *    ZENITH_GOOGLE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/..."
 * 7. Refresh your Google Sheet and click the new "🏛️ ZENITH MUN" menu > "Initialize All Department Tabs".
 */

var MASTER_TAB_NAME = 'Master - All Responses';

// Department Definitions with specific practical questions
var DEPARTMENTS = {
  'Delegate Affairs & Outreach': {
    tabName: 'Dept - Delegate Affairs',
    color: '#0284c7', // Sky Blue
    practicalHeaders: [
      'P1. How would you attract and engage potential delegates?',
      'P2. Handling a delegate dissatisfied with registration or allocation',
      'P3. Outreach strategy beyond immediate MUN network',
      'P4. Delegate tracking and registration follow-up system'
    ],
    extractQs: function(d) {
      return [
        d.q_del_attract || '',
        d.q_del_dissatisfied || '',
        d.q_del_network || '',
        d.q_del_tracking || ''
      ];
    }
  },
  'Public Relations & Marketing': {
    tabName: 'Dept - PR & Marketing',
    color: '#e11d48', // Rose Red
    practicalHeaders: [
      'P1. Creating awareness among first-time MUN students',
      'P2. Creative campaign idea to increase registrations',
      'P3. Handling negative feedback or public criticism',
      'P4. What makes an MUN social media presence effective?'
    ],
    extractQs: function(d) {
      return [
        d.q_pr_awareness || '',
        d.q_pr_campaign || '',
        d.q_pr_feedback || '',
        d.q_pr_social_media || ''
      ];
    }
  },
  'Design & Creative': {
    tabName: 'Dept - Design & Creative',
    color: '#9333ea', // Royal Purple
    practicalHeaders: [
      'P1. Design tools used (Canva, Figma, Adobe, Illustrator)',
      'P2. Portfolio / 3 Work Sample Links',
      'P3. Strategy to maintain visual consistency across all creatives',
      'P4. Handling emergency / last-minute creative turnarounds'
    ],
    extractQs: function(d) {
      return [
        d.q_design_tools || '',
        d.q_design_samples || '',
        d.q_design_consistency || '',
        d.q_design_last_minute || ''
      ];
    }
  },
  'Media & Communications': {
    tabName: 'Dept - Media & Comms',
    color: '#ea580c', // Orange
    practicalHeaders: [
      'P1. Experience with formal writing, drafting and proofreading',
      'P2. Sample announcement introducing ZENITH MUN 2026',
      'P3. Ensuring official communication consistency across channels',
      'P4. Handling urgent corrections to published statements'
    ],
    extractQs: function(d) {
      return [
        d.q_media_writing || '',
        d.q_media_draft || '',
        d.q_media_consistency || '',
        d.q_media_correction || ''
      ];
    }
  },
  'Technical & Website': {
    tabName: 'Dept - Technical & Website',
    color: '#0d9488', // Teal
    practicalHeaders: [
      'P1. Programming languages, stacks, platforms and tools known',
      'P2. Links to past technical projects, repositories or websites',
      'P3. Troubleshooting live website disruptions during registrations',
      'P4. Method to ensure web data and allocations remain accurate'
    ],
    extractQs: function(d) {
      return [
        d.q_tech_stack || '',
        d.q_tech_projects || '',
        d.q_tech_troubleshoot || '',
        d.q_tech_accuracy || ''
      ];
    }
  },
  'Events & Conference Operations': {
    tabName: 'Dept - Events & Ops',
    color: '#b45309', // Amber / Bronze
    practicalHeaders: [
      'P1. Planning and coordinating large offline summits in Udaipur',
      'P2. Conference-day emergency contingency plan',
      'P3. Coordinating between EB, Secretariat, and delegates',
      'P4. Handling stage disruptions or technical audiovisual failures'
    ],
    extractQs: function(d) {
      return [
        d.q_events_coord || '',
        d.q_events_contingency || '',
        d.q_events_tripartite || '',
        d.q_events_disruption || ''
      ];
    }
  },
  'Research & Content': {
    tabName: 'Dept - Research & Content',
    color: '#4f46e5', // Indigo
    practicalHeaders: [
      'P1. Verification and vetting process before publishing research',
      'P2. Key attributes that make a comprehensive Background Guide',
      'P3. Ensuring matrix dossiers remain unbiased and factual',
      'P4. Writing / research sample link or dossier'
    ],
    extractQs: function(d) {
      return [
        d.q_research_verify || '',
        d.q_research_bg_guide || '',
        d.q_research_unbiased || '',
        d.q_research_sample || ''
      ];
    }
  }
};

/**
 * Standard candidate headers common across all sheets
 */
var BASE_CANDIDATE_HEADERS = [
  'Submission Timestamp',
  'Ticket / Application ID',
  'Full Name',
  'Age',
  'City, State & Country',
  'Email Address',
  'WhatsApp / Contact Number',
  'Institution & Academic Year',
  'Q7. MUN Experience & Count',
  'Q8. Prior Secretariat / EB Designations',
  'Q9. Outside Leadership & Projects',
  'Q10. Strongest Skills (3)',
  'Q11. Primary Department',
  'Q11b. Secondary Department',
  'Q12. Department Suitability Rationale',
  'Q13. Tools & Technical Abilities'
];

var AFTER_PRACTICAL_HEADERS = [
  'Q14. Why Zenith MUN 2026',
  'Q15. Meaning of Secretariat',
  'Q16. Specific Contribution / Idea',
  'Q17. Teammate Inactivity Scenario',
  'Q18. Tight Deadline Dilemma',
  'Q19. Time Dedication & Academic Balance',
  'Q20. Why Choose You',
  'Resume / CV Link',
  'Portfolio / LinkedIn Link',
  'Digital Signature',
  // 100% MERIT EVALUATION SCORECARD COLUMNS
  'Score: Experience (15)',
  'Score: Suitability (20)',
  'Score: Motivation (15)',
  'Score: Situational (20)',
  'Score: Commitment (20)',
  'Score: Communication (10)',
  'Total Score (100)',
  'Evaluation Status',
  'Reviewer Notes'
];

/**
 * Google Sheets UI Menu Trigger
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🏛️ ZENITH MUN')
    .addItem('Initialize All Department Tabs', 'setupAllDepartmentTabs')
    .addItem('Format Header Styles', 'formatAllTabStyles')
    .addToUi();
}

/**
 * Setup and initialize all department tabs in one click
 */
function setupAllDepartmentTabs() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Initialize Master Tab
  var masterSheet = ss.getSheetByName(MASTER_TAB_NAME);
  if (!masterSheet) {
    masterSheet = ss.insertSheet(MASTER_TAB_NAME, 0);
  }
  initMasterSheet(masterSheet);

  // 2. Initialize each Department Tab
  var index = 1;
  for (var deptKey in DEPARTMENTS) {
    var dept = DEPARTMENTS[deptKey];
    var sheet = ss.getSheetByName(dept.tabName);
    if (!sheet) {
      sheet = ss.insertSheet(dept.tabName, index);
    }
    initDepartmentSheet(sheet, dept);
    index++;
  }

  SpreadsheetApp.getActiveSpreadsheet().toast('All 8 department tabs initialized with custom question headers and scorecard formulas!', 'Zenith Setup Complete', 6);
}

/**
 * Handle incoming POST submissions from Zenvitra / forms engine
 */
function doPost(e) {
  try {
    var raw = e.postData.contents;
    var payload = JSON.parse(raw);
    var data = payload.data || payload;

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var masterSheet = ss.getSheetByName(MASTER_TAB_NAME);
    if (!masterSheet) {
      masterSheet = ss.insertSheet(MASTER_TAB_NAME, 0);
      initMasterSheet(masterSheet);
    }

    var timestamp = payload.submittedAt || new Date().toISOString();
    var ticketId = data.ticketId || payload.submissionId || ('SEC-' + Math.random().toString(36).substring(2, 8).toUpperCase());

    var primaryDept = data.q11_primary_dept || data.preferredSector || '';
    var secondaryDept = data.q11_secondary_dept || data.secondarySector || '';

    // Match department key
    var matchedDeptKey = resolveDepartmentKey(primaryDept);

    // Extract practical answers
    var practicalAnswers = ['', '', '', ''];
    if (matchedDeptKey && DEPARTMENTS[matchedDeptKey]) {
      practicalAnswers = DEPARTMENTS[matchedDeptKey].extractQs(data);
    } else {
      // Fallback extraction
      practicalAnswers = [
        data.q_del_attract || data.q_pr_awareness || data.q_design_tools || data.q_media_writing || data.q_tech_stack || data.q_events_coord || data.q_research_verify || '',
        data.q_del_dissatisfied || data.q_pr_campaign || data.q_design_samples || data.q_media_draft || data.q_tech_projects || data.q_events_contingency || data.q_research_bg_guide || '',
        data.q_del_network || data.q_pr_feedback || data.q_design_consistency || data.q_media_consistency || data.q_tech_troubleshoot || data.q_events_tripartite || data.q_research_unbiased || '',
        data.q_del_tracking || data.q_pr_social_media || data.q_design_last_minute || data.q_media_correction || data.q_tech_accuracy || data.q_events_disruption || data.q_research_sample || ''
      ];
    }

    var baseRowData = [
      timestamp,
      ticketId,
      data.q1_full_name || data.fullName || '',
      data.q2_age || data.age || '',
      data.q3_location || data.city || '',
      data.q4_email || data.email || '',
      data.q5_phone || data.phoneNumber || '',
      data.q6_institution || data.institution || '',
      data.q7_mun_participation || '',
      data.q8_secretariat_experience || '',
      data.q9_outside_leadership || '',
      data.q10_strongest_skills || '',
      primaryDept,
      secondaryDept,
      data.q12_department_suitability || '',
      data.q13_tools_and_abilities || ''
    ];

    var postRowData = [
      data.q14_why_zenith || '',
      data.q15_secretariat_meaning || '',
      data.q16_specific_contribution || '',
      data.q17_team_member_issue || '',
      data.q18_tight_deadline_difficulties || '',
      data.q19_time_dedication_and_balance || '',
      data.q20_why_choose_you || '',
      data.q22_resume_upload || data.resumeUrl || '',
      data.q23_portfolio_links || data.portfolioUrl || '',
      data.decl_signature_confirmation || data.signature || 'CONFIRMED',
      '', // Experience (15)
      '', // Suitability (20)
      '', // Motivation (15)
      '', // Situational (20)
      '', // Commitment (20)
      '', // Communication (10)
      // Total formula computed dynamically
      '', 
      'SUBMITTED',
      ''
    ];

    // ── 1. Append to Master Tab ──
    var masterRowIndex = masterSheet.getLastRow() + 1;
    var masterTotalFormula = '=SUM(AE' + masterRowIndex + ':AJ' + masterRowIndex + ')';
    var fullMasterRow = baseRowData.concat(practicalAnswers).concat(postRowData);
    fullMasterRow[fullMasterRow.length - 3] = masterTotalFormula; // Set formula
    masterSheet.appendRow(fullMasterRow);

    // ── 2. Route to Primary Department Tab ──
    var routedTabName = '';
    if (matchedDeptKey && DEPARTMENTS[matchedDeptKey]) {
      var deptConfig = DEPARTMENTS[matchedDeptKey];
      var deptSheet = ss.getSheetByName(deptConfig.tabName);
      if (!deptSheet) {
        deptSheet = ss.insertSheet(deptConfig.tabName);
        initDepartmentSheet(deptSheet, deptConfig);
      }
      var deptRowIndex = deptSheet.getLastRow() + 1;
      var deptTotalFormula = '=SUM(AE' + deptRowIndex + ':AJ' + deptRowIndex + ')';
      var deptRow = baseRowData.concat(practicalAnswers).concat(postRowData);
      deptRow[deptRow.length - 3] = deptTotalFormula;
      deptSheet.appendRow(deptRow);
      routedTabName = deptConfig.tabName;
    }

    // ── 3. Also route to Secondary Department Tab if applicable ──
    var secondaryMatchedKey = resolveDepartmentKey(secondaryDept);
    if (secondaryMatchedKey && secondaryMatchedKey !== matchedDeptKey && DEPARTMENTS[secondaryMatchedKey]) {
      var secConfig = DEPARTMENTS[secondaryMatchedKey];
      var secSheet = ss.getSheetByName(secConfig.tabName);
      if (!secSheet) {
        secSheet = ss.insertSheet(secConfig.tabName);
        initDepartmentSheet(secSheet, secConfig);
      }
      var secRowIndex = secSheet.getLastRow() + 1;
      var secTotalFormula = '=SUM(AE' + secRowIndex + ':AJ' + secRowIndex + ')';
      var secRow = baseRowData.concat(practicalAnswers).concat(postRowData);
      secRow[secRow.length - 3] = secTotalFormula;
      secRow[secRow.length - 2] = 'BACKUP PREFERENCE'; // Evaluation status
      secSheet.appendRow(secRow);
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      ticketId: ticketId,
      masterRow: masterSheet.getLastRow(),
      departmentTab: routedTabName
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests for verification & ping
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ONLINE',
    conference: 'ZENITH MODEL UNITED NATIONS 2026',
    system: 'Secretariat Multi-Tab Department Routing Webhook',
    departmentsCount: Object.keys(DEPARTMENTS).length,
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Match department name flexibly
 */
function resolveDepartmentKey(input) {
  if (!input) return null;
  var str = input.toLowerCase();
  for (var key in DEPARTMENTS) {
    var kLower = key.toLowerCase();
    if (str === kLower) return key;
    if (str.indexOf('delegate') !== -1 || str.indexOf('outreach') !== -1) return 'Delegate Affairs & Outreach';
    if (str.indexOf('marketing') !== -1 || str.indexOf('relations') !== -1 || str.indexOf('pr') !== -1) return 'Public Relations & Marketing';
    if (str.indexOf('design') !== -1 || str.indexOf('creative') !== -1) return 'Design & Creative';
    if (str.indexOf('media') !== -1 || str.indexOf('comm') !== -1) return 'Media & Communications';
    if (str.indexOf('tech') !== -1 || str.indexOf('website') !== -1) return 'Technical & Website';
    if (str.indexOf('events') !== -1 || str.indexOf('ops') !== -1 || str.indexOf('operations') !== -1) return 'Events & Conference Operations';
    if (str.indexOf('research') !== -1 || str.indexOf('content') !== -1) return 'Research & Content';
  }
  return null;
}

/**
 * Initialize Master Sheet
 */
function initMasterSheet(sheet) {
  sheet.clear();
  var genericPractical = [
    'Dept Practical Q1 (Department Specific)',
    'Dept Practical Q2 (Department Specific)',
    'Dept Practical Q3 (Department Specific)',
    'Dept Practical Q4 (Department Specific)'
  ];
  var headers = BASE_CANDIDATE_HEADERS.concat(genericPractical).concat(AFTER_PRACTICAL_HEADERS);
  sheet.appendRow(headers);

  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#090a0f');
  headerRange.setFontColor('#f59e0b');
  headerRange.setFontWeight('bold');
  headerRange.setFontFamily('Roboto');
  headerRange.setFontSize(10);
  headerRange.setWrap(true);
  sheet.setRowHeight(1, 46);

  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(3);

  // Scorecard styling in gold
  var scorecardRange = sheet.getRange(1, 31, 1, 7);
  scorecardRange.setBackground('#2d1a04');
  scorecardRange.setFontColor('#fbbf24');
}

/**
 * Initialize Department Sheet with specific practical question headers
 */
function initDepartmentSheet(sheet, dept) {
  sheet.clear();
  var headers = BASE_CANDIDATE_HEADERS.concat(dept.practicalHeaders).concat(AFTER_PRACTICAL_HEADERS);
  sheet.appendRow(headers);

  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#0d1117');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setFontFamily('Roboto');
  headerRange.setFontSize(10);
  headerRange.setWrap(true);
  sheet.setRowHeight(1, 50);

  // Highlight practical questions in department color
  var practicalRange = sheet.getRange(1, 17, 1, 4);
  practicalRange.setBackground(dept.color);
  practicalRange.setFontColor('#ffffff');

  // Highlight Scorecard columns
  var scorecardRange = sheet.getRange(1, 31, 1, 7);
  scorecardRange.setBackground('#2d1a04');
  scorecardRange.setFontColor('#fbbf24');

  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(3);

  // Format tab color if supported
  try {
    sheet.setTabColor(dept.color);
  } catch (e) {}
}

/**
 * Helper to reformat all tab headers
 */
function formatAllTabStyles() {
  setupAllDepartmentTabs();
}
