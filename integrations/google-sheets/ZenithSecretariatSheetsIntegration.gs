/**
 * ══════════════════════════════════════════════════════════════════════════════
 * ZENITH MODEL UNITED NATIONS 2026 — ENTERPRISE MULTI-TAB WEBHOOK & SCORECARD
 * PRESENTED BY ZENVITRA | BY YOUTH. FOR YOUTH.
 * ══════════════════════════════════════════════════════════════════════════════
 *
 * ARCHITECTURE HIGHLIGHTS:
 * 1. LockService concurrency protection (prevents row collisions on simultaneous POSTs).
 * 2. Non-destructive tab initialization & styling (never wipes existing applicant rows).
 * 3. Executive Dashboard tab ("00 - Executive Dashboard") with live dynamic formulas.
 * 4. Master Tab + 7 Department-Specific Tabs with custom practical headers & color themes.
 * 5. Automatic Data Validation (strict max-point caps on each Merit Scorecard column).
 * 6. Status Dropdowns + Conditional Formatting + Two-Way onEdit() Sync across all tabs.
 * 7. LIVE SYNC TO ZENVITRA: onEdit() automatically pushes status/score updates to
 *    https://zenvitra.xyz/api/forms/status/update so candidates see their live status!
 * 8. LIVE STATUS LOOKUP: doGet(?query=...) allows Zenvitra to query Google Sheets directly.
 *
 * HOW TO INSTALL IN GOOGLE SHEETS:
 * 1. Open your Google Sheet for Zenith MUN 2026.
 * 2. In the top menu, click Extensions > Apps Script.
 * 3. Replace all code in the script editor with this entire file.
 * 4. Click Save (💾).
 * 5. Click "Deploy" > "New deployment" > Select type: "Web app".
 * 6. Set Description: "Zenith MUN Secretariat Webhook v2 - Live Status Sync".
 * 7. Set Execute as: "Me" (your Google account).
 * 8. Set Who has access: "Anyone".
 * 9. Click Deploy, copy the "Web app URL", and set it in your .env as:
 *    ZENITH_GOOGLE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/..."
 * 10. Refresh your Google Sheet and click the new "🏛️ ZENITH MUN" menu:
 *     Click "Initialize / Repair All Tabs" to build all tabs and formulas cleanly!
 */

var CONFIG = {
  CONFERENCE_NAME: 'ZENITH MODEL UNITED NATIONS 2026',
  ORGANIZER: 'ZENVITRA',
  TAGLINE: 'A NEW ZEN BEGINS | BY YOUTH. FOR YOUTH.',
  DASHBOARD_TAB_NAME: '00 - Executive Dashboard',
  MASTER_TAB_NAME: 'Master - All Responses',
  AUDIT_LOG_TAB_NAME: 'System - Webhook Logs',
  ZENVITRA_SYNC_URL: 'https://zenvitra.xyz/api/forms/status/update',
  ZENVITRA_SYNC_SECRET: 'zenith_secretariat_secure_sync_2026',
  SEND_CONFIRMATION_EMAIL: false, // Set to true if Google Apps Script should also send HTML confirmation emails
  REPLY_TO_EMAIL: 'yuveerji@gmail.com',
  TICKET_PREFIX: 'ZEN26-SEC-'
};

var EVALUATION_STATUSES = [
  'SUBMITTED',
  'UNDER REVIEW',
  'SHORTLISTED - INTERVIEW',
  'PRACTICAL ASSIGNED',
  'SELECTED',
  'WAITLISTED',
  'REJECTED',
  'BACKUP PREFERENCE'
];

// Scorecard column definitions (1-based column indices: AE = 31 to AJ = 36, AK = 37)
var SCORECARD_SCHEMA = [
  { col: 31, letter: 'AE', header: 'Score: Experience (15)', max: 15 },
  { col: 32, letter: 'AF', header: 'Score: Suitability (20)', max: 20 },
  { col: 33, letter: 'AG', header: 'Score: Motivation (15)', max: 15 },
  { col: 34, letter: 'AH', header: 'Score: Situational (20)', max: 20 },
  { col: 35, letter: 'AI', header: 'Score: Commitment (20)', max: 20 },
  { col: 36, letter: 'AJ', header: 'Score: Communication (10)', max: 10 }
];

// Column indices mapping (1-based)
var COL_INDEX = {
  SUBMITTED_AT: 1,    // A
  TICKET_ID: 2,       // B
  FULL_NAME: 3,       // C
  AGE: 4,             // D
  LOCATION: 5,        // E
  EMAIL: 6,           // F
  PHONE: 7,           // G
  INSTITUTION: 8,     // H
  PRIMARY_DEPT: 13,   // M
  SECONDARY_DEPT: 14, // N
  PRACTICAL_START: 17,// Q..T (4 columns)
  RESUME_LINK: 28,    // AB
  PORTFOLIO_LINK: 29, // AC
  SIGNATURE: 30,      // AD
  SCORE_START: 31,    // AE..AJ (6 columns)
  TOTAL_SCORE: 37,    // AK
  STATUS: 38,         // AL
  NOTES: 39           // AM
};

// Department Definitions with specific practical questions & styling
var DEPARTMENTS = {
  'Delegate Affairs & Outreach': {
    tabName: 'Dept - Delegate Affairs',
    color: '#0284c7', // Sky Blue
    lightTint: '#e0f2fe',
    practicalHeaders: [
      'P1. How would you attract and engage potential delegates?',
      'P2. Handling a delegate dissatisfied with registration or allocation',
      'P3. Outreach strategy beyond immediate MUN network',
      'P4. Delegate tracking and registration follow-up system'
    ],
    fields: ['q_del_attract', 'q_del_dissatisfied', 'q_del_network', 'q_del_tracking']
  },
  'Public Relations & Marketing': {
    tabName: 'Dept - PR & Marketing',
    color: '#e11d48', // Rose Red
    lightTint: '#ffe4e6',
    practicalHeaders: [
      'P1. Creating awareness among first-time MUN students',
      'P2. Creative campaign idea to increase registrations',
      'P3. Handling negative feedback or public criticism',
      'P4. What makes an MUN social media presence effective?'
    ],
    fields: ['q_pr_awareness', 'q_pr_campaign', 'q_pr_feedback', 'q_pr_social_media']
  },
  'Design & Creative': {
    tabName: 'Dept - Design & Creative',
    color: '#9333ea', // Royal Purple
    lightTint: '#f3e8ff',
    practicalHeaders: [
      'P1. Design tools used (Canva, Figma, Adobe, Illustrator)',
      'P2. Portfolio / 3 Work Sample Links',
      'P3. Strategy to maintain visual consistency across all creatives',
      'P4. Handling emergency / last-minute creative turnarounds'
    ],
    fields: ['q_design_tools', 'q_design_samples', 'q_design_consistency', 'q_design_last_minute']
  },
  'Media & Communications': {
    tabName: 'Dept - Media & Comms',
    color: '#ea580c', // Orange
    lightTint: '#ffedd5',
    practicalHeaders: [
      'P1. Experience with formal writing, drafting and proofreading',
      'P2. Sample announcement introducing ZENITH MUN 2026',
      'P3. Ensuring official communication consistency across channels',
      'P4. Handling urgent corrections to published statements'
    ],
    fields: ['q_media_writing', 'q_media_draft', 'q_media_consistency', 'q_media_correction']
  },
  'Technical & Website': {
    tabName: 'Dept - Technical & Website',
    color: '#0d9488', // Teal
    lightTint: '#ccfbf1',
    practicalHeaders: [
      'P1. Programming languages, stacks, platforms and tools known',
      'P2. Links to past technical projects, repositories or websites',
      'P3. Troubleshooting live website disruptions during registrations',
      'P4. Method to ensure web data and allocations remain accurate'
    ],
    fields: ['q_tech_stack', 'q_tech_projects', 'q_tech_troubleshoot', 'q_tech_accuracy']
  },
  'Events & Conference Operations': {
    tabName: 'Dept - Events & Ops',
    color: '#b45309', // Amber / Bronze
    lightTint: '#fef3c7',
    practicalHeaders: [
      'P1. Planning and coordinating large offline summits in Udaipur',
      'P2. Conference-day emergency contingency plan',
      'P3. Coordinating between EB, Secretariat, and delegates',
      'P4. Handling stage disruptions or technical audiovisual failures'
    ],
    fields: ['q_events_coord', 'q_events_contingency', 'q_events_tripartite', 'q_events_disruption']
  },
  'Research & Content': {
    tabName: 'Dept - Research & Content',
    color: '#4f46e5', // Indigo
    lightTint: '#e0e7ff',
    practicalHeaders: [
      'P1. Verification and vetting process before publishing research',
      'P2. Key attributes that make a comprehensive Background Guide',
      'P3. Ensuring matrix dossiers remain unbiased and factual',
      'P4. Writing / research sample link or dossier'
    ],
    fields: ['q_research_verify', 'q_research_bg_guide', 'q_research_unbiased', 'q_research_sample']
  }
};

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
    .addItem('📊 Open / Build Executive Dashboard', 'buildExecutiveDashboard')
    .addItem('⚙️ Initialize / Repair All Tabs (Safe)', 'setupAllDepartmentTabs')
    .addItem('🎨 Reformat Tab Header Styles', 'formatAllTabStyles')
    .addItem('🔄 Resync All Department Tabs with Master', 'syncAllTabsWithMaster')
    .addSeparator()
    .addItem('🧪 Send Test Webhook Ping', 'runTestWebhookSubmission')
    .addToUi();
}

/**
 * Setup and initialize all department tabs non-destructively
 */
function setupAllDepartmentTabs() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Master Tab
  var masterSheet = ss.getSheetByName(CONFIG.MASTER_TAB_NAME);
  if (!masterSheet) {
    masterSheet = ss.insertSheet(CONFIG.MASTER_TAB_NAME, 1);
  }
  initOrRepairDataSheet_(masterSheet, null);

  // 2. Department Tabs
  var index = 2;
  for (var deptKey in DEPARTMENTS) {
    var dept = DEPARTMENTS[deptKey];
    var sheet = ss.getSheetByName(dept.tabName);
    if (!sheet) {
      sheet = ss.insertSheet(dept.tabName, index);
    }
    initOrRepairDataSheet_(sheet, dept);
    index++;
  }

  // 3. Audit Log Tab
  var auditSheet = ss.getSheetByName(CONFIG.AUDIT_LOG_TAB_NAME);
  if (!auditSheet) {
    auditSheet = ss.insertSheet(CONFIG.AUDIT_LOG_TAB_NAME, index);
    initAuditSheet_(auditSheet);
  }

  // 4. Executive Dashboard Tab (placed at index 0)
  buildExecutiveDashboard();

  ss.toast('Executive Dashboard, Master Tab, and all 7 Department Tabs initialized safely without data loss!', 'Zenith MUN Setup', 8);
}

/**
 * Reformat header styles safely without clearing data
 */
function formatAllTabStyles() {
  setupAllDepartmentTabs();
}

/**
 * Build or refresh the Executive Dashboard Tab ("00 - Executive Dashboard")
 */
function buildExecutiveDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dash = ss.getSheetByName(CONFIG.DASHBOARD_TAB_NAME);
  if (!dash) {
    dash = ss.insertSheet(CONFIG.DASHBOARD_TAB_NAME, 0);
  } else {
    // Bring to front
    ss.setActiveSheet(dash);
    ss.moveActiveSheet(1);
  }

  dash.clear();
  dash.setGridlines(true);

  try {
    dash.setTabColor('#f59e0b'); // Gold
  } catch (e) {}

  // Title Banner
  dash.getRange('A1:H2').merge();
  var title = dash.getRange('A1');
  title.setValue('🏛️ ZENITH MODEL UNITED NATIONS 2026 — SECRETARIAT ADMISSIONS DASHBOARD');
  title.setBackground('#090a0f');
  title.setFontColor('#fbbf24');
  title.setFontSize(14);
  title.setFontWeight('bold');
  title.setFontFamily('Roboto');
  title.setHorizontalAlignment('center');
  title.setVerticalAlignment('middle');

  // Subtitle
  dash.getRange('A3:H3').merge();
  var sub = dash.getRange('A3');
  sub.setValue('Live Admissions & Merit Scorecard Analytics | Powered by Zenvitra | Updated: ' + new Date().toLocaleString());
  sub.setBackground('#111827');
  sub.setFontColor('#9ca3af');
  sub.setFontSize(9);
  sub.setFontFamily('Roboto');
  sub.setHorizontalAlignment('center');

  // Summary KPI Cards (Row 5 to 7)
  var kpis = [
    { label: 'TOTAL SUBMISSIONS', cell: 'B6', formula: '=COUNTA(\'' + CONFIG.MASTER_TAB_NAME + '\'!B2:B)', color: '#0284c7' },
    { label: 'UNDER REVIEW', cell: 'D6', formula: '=COUNTIF(\'' + CONFIG.MASTER_TAB_NAME + '\'!AL2:AL, "UNDER REVIEW") + COUNTIF(\'' + CONFIG.MASTER_TAB_NAME + '\'!AL2:AL, "SUBMITTED")', color: '#f59e0b' },
    { label: 'SHORTLISTED', cell: 'F6', formula: '=COUNTIF(\'' + CONFIG.MASTER_TAB_NAME + '\'!AL2:AL, "SHORTLISTED*")', color: '#38bdf8' },
    { label: 'APPOINTED / SELECTED', cell: 'H6', formula: '=COUNTIF(\'' + CONFIG.MASTER_TAB_NAME + '\'!AL2:AL, "SELECTED*")', color: '#22c55e' }
  ];

  var kpiCols = ['A', 'C', 'E', 'G'];
  for (var i = 0; i < kpis.length; i++) {
    var cLetter = kpiCols[i];
    var endLetter = String.fromCharCode(cLetter.charCodeAt(0) + 1);
    var cardRange = dash.getRange(cLetter + '5:' + endLetter + '7');
    cardRange.setBackground('#0f172a');
    cardRange.setBorder(true, true, true, true, false, false, kpis[i].color, SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

    var lbl = dash.getRange(cLetter + '5:' + endLetter + '5');
    lbl.merge();
    lbl.setValue(kpis[i].label);
    lbl.setFontColor('#94a3b8');
    lbl.setFontSize(9);
    lbl.setFontWeight('bold');
    lbl.setHorizontalAlignment('center');

    var val = dash.getRange(cLetter + '6:' + endLetter + '7');
    val.merge();
    val.setFormula(kpis[i].formula);
    val.setFontColor(kpis[i].color);
    val.setFontSize(22);
    val.setFontWeight('bold');
    val.setHorizontalAlignment('center');
    val.setVerticalAlignment('middle');
  }

  // Department Breakdown Table Header (Row 9)
  dash.getRange('A9:H9').merge();
  var deptTableTitle = dash.getRange('A9');
  deptTableTitle.setValue('DEPARTMENT CANDIDACY & SCORECARD BREAKDOWN');
  deptTableTitle.setBackground('#1e293b');
  deptTableTitle.setFontColor('#ffffff');
  deptTableTitle.setFontWeight('bold');
  deptTableTitle.setFontSize(10);
  deptTableTitle.setHorizontalAlignment('left');

  var deptHeaders = ['Department Name', 'Tab Link', 'Total Candidates', 'Under Review', 'Shortlisted', 'Selected', 'Avg Score', 'Max Score'];
  for (var j = 0; j < deptHeaders.length; j++) {
    var hCell = dash.getRange(10, j + 1);
    hCell.setValue(deptHeaders[j]);
    hCell.setBackground('#0f172a');
    hCell.setFontColor('#e2e8f0');
    hCell.setFontWeight('bold');
    hCell.setFontSize(9);
    hCell.setHorizontalAlignment(j >= 2 ? 'center' : 'left');
  }

  var row = 11;
  for (var dKey in DEPARTMENTS) {
    var d = DEPARTMENTS[dKey];
    dash.getRange(row, 1).setValue(dKey).setFontWeight('bold').setFontColor('#ffffff');
    dash.getRange(row, 2).setValue(d.tabName).setFontColor(d.color);

    // Total Candidates (Col C)
    dash.getRange(row, 3).setFormula('=COUNTIF(\'' + CONFIG.MASTER_TAB_NAME + '\'!M2:M, "' + dKey + '")');
    // Under Review (Col D)
    dash.getRange(row, 4).setFormula('=COUNTIFS(\'' + CONFIG.MASTER_TAB_NAME + '\'!M2:M, "' + dKey + '", \'' + CONFIG.MASTER_TAB_NAME + '\'!AL2:AL, "UNDER REVIEW") + COUNTIFS(\'' + CONFIG.MASTER_TAB_NAME + '\'!M2:M, "' + dKey + '", \'' + CONFIG.MASTER_TAB_NAME + '\'!AL2:AL, "SUBMITTED")');
    // Shortlisted (Col E)
    dash.getRange(row, 5).setFormula('=COUNTIFS(\'' + CONFIG.MASTER_TAB_NAME + '\'!M2:M, "' + dKey + '", \'' + CONFIG.MASTER_TAB_NAME + '\'!AL2:AL, "SHORTLISTED*")');
    // Selected (Col F)
    dash.getRange(row, 6).setFormula('=COUNTIFS(\'' + CONFIG.MASTER_TAB_NAME + '\'!M2:M, "' + dKey + '", \'' + CONFIG.MASTER_TAB_NAME + '\'!AL2:AL, "SELECTED*")');
    // Avg Score (Col G)
    dash.getRange(row, 7).setFormula('=IFERROR(AVERAGEIF(\'' + CONFIG.MASTER_TAB_NAME + '\'!M2:M, "' + dKey + '", \'' + CONFIG.MASTER_TAB_NAME + '\'!AK2:AK), 0)');
    // Max Score (Col H)
    dash.getRange(row, 8).setFormula('=IFERROR(MAXIFS(\'' + CONFIG.MASTER_TAB_NAME + '\'!AK2:AK, \'' + CONFIG.MASTER_TAB_NAME + '\'!M2:M, "' + dKey + '"), 0)');

    dash.getRange(row, 1, 1, 8).setBackground(row % 2 === 0 ? '#0b0f19' : '#030712');
    dash.getRange(row, 3, 1, 6).setHorizontalAlignment('center');
    dash.getRange(row, 7).setNumberFormat('0.0');
    dash.getRange(row, 8).setNumberFormat('0');
    row++;
  }

  dash.setColumnWidth(1, 260);
  dash.setColumnWidth(2, 200);
  dash.setColumnWidth(3, 130);
  dash.setColumnWidth(4, 110);
  dash.setColumnWidth(5, 110);
  dash.setColumnWidth(6, 110);
  dash.setColumnWidth(7, 100);
  dash.setColumnWidth(8, 100);

  dash.setFrozenRows(3);
}

/**
 * Initializes or repairs headers, validation, formulas, and formatting for a sheet
 */
function initOrRepairDataSheet_(sheet, dept) {
  var isMaster = !dept;
  var genericPractical = [
    'Dept Practical Q1 (Department Specific)',
    'Dept Practical Q2 (Department Specific)',
    'Dept Practical Q3 (Department Specific)',
    'Dept Practical Q4 (Department Specific)'
  ];

  var practicalHeaders = isMaster ? genericPractical : dept.practicalHeaders;
  var headers = BASE_CANDIDATE_HEADERS.concat(practicalHeaders).concat(AFTER_PRACTICAL_HEADERS);

  // Write headers to row 1
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Main Header Styling
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground(isMaster ? '#090a0f' : '#0d1117');
  headerRange.setFontColor(isMaster ? '#fbbf24' : '#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setFontFamily('Roboto');
  headerRange.setFontSize(10);
  headerRange.setWrap(true);
  sheet.setRowHeight(1, 52);

  // Department Practical Questions highlight
  if (!isMaster) {
    var pRange = sheet.getRange(1, COL_INDEX.PRACTICAL_START, 1, 4);
    pRange.setBackground(dept.color);
    pRange.setFontColor('#ffffff');
    try {
      sheet.setTabColor(dept.color);
    } catch (e) {}
  }

  // Scorecard Header highlight (AE..AK, cols 31..37)
  var scRange = sheet.getRange(1, COL_INDEX.SCORE_START, 1, 7);
  scRange.setBackground('#2d1a04');
  scRange.setFontColor('#fbbf24');

  // Status & Notes Header highlight (AL..AM, cols 38..39)
  var statRange = sheet.getRange(1, COL_INDEX.STATUS, 1, 2);
  statRange.setBackground('#1e293b');
  statRange.setFontColor('#38bdf8');

  // Freeze top row and first 3 columns
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(3);

  // Apply Status Dropdown Validation on Column AL (rows 2..1000)
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(EVALUATION_STATUSES, true)
    .setAllowInvalid(false)
    .setHelpText('Please select a valid Zenith MUN Evaluation Status')
    .build();
  sheet.getRange(2, COL_INDEX.STATUS, 999, 1).setDataValidation(statusRule);

  // Apply Numeric Caps Validation on Scorecard Columns AE..AJ
  for (var k = 0; k < SCORECARD_SCHEMA.length; k++) {
    var sc = SCORECARD_SCHEMA[k];
    var numRule = SpreadsheetApp.newDataValidation()
      .requireNumberBetween(0, sc.max)
      .setAllowInvalid(false)
      .setHelpText('Score must be a number between 0 and ' + sc.max)
      .build();
    sheet.getRange(2, sc.col, 999, 1).setDataValidation(numRule);
  }

  // Apply Conditional Formatting for Statuses
  applyStatusConditionalFormatting_(sheet);
}

/**
 * Conditional formatting rules for status column
 */
function applyStatusConditionalFormatting_(sheet) {
  var range = sheet.getRange(2, COL_INDEX.STATUS, 999, 1);
  var rules = sheet.getConditionalFormatRules() || [];

  // Filter out any existing rules on this range to prevent duplicates
  var newRules = [];
  var configs = [
    { text: 'SELECTED', bg: '#dcfce7', fg: '#15803d' },
    { text: 'SHORTLISTED - INTERVIEW', bg: '#e0f2fe', fg: '#0369a1' },
    { text: 'PRACTICAL ASSIGNED', bg: '#f3e8ff', fg: '#7e22ce' },
    { text: 'UNDER REVIEW', bg: '#fef3c7', fg: '#b45309' },
    { text: 'WAITLISTED', bg: '#ffedd5', fg: '#c2410c' },
    { text: 'REJECTED', bg: '#fee2e2', fg: '#b91c1c' },
    { text: 'BACKUP PREFERENCE', bg: '#f1f5f9', fg: '#475569' }
  ];

  for (var i = 0; i < configs.length; i++) {
    var c = configs[i];
    var rule = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(c.text)
      .setBackground(c.bg)
      .setFontColor(c.fg)
      .setBold(true)
      .setRanges([range])
      .build();
    newRules.push(rule);
  }

  sheet.setConditionalFormatRules(newRules);
}

/**
 * Handle incoming POST submissions with LockService and idempotency
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Wait up to 25 seconds for concurrent executions to finish writing
    lock.waitLock(25000);

    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse_({ success: false, error: 'Empty POST body received' }, 400);
    }

    var payload = JSON.parse(e.postData.contents);
    var data = payload.data || payload;

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var masterSheet = ss.getSheetByName(CONFIG.MASTER_TAB_NAME);
    if (!masterSheet) {
      masterSheet = ss.insertSheet(CONFIG.MASTER_TAB_NAME, 1);
      initOrRepairDataSheet_(masterSheet, null);
    }

    var timestamp = payload.submittedAt || new Date().toISOString();
    var ticketId = data.ticketId || payload.submissionId || (CONFIG.TICKET_PREFIX + Math.random().toString(36).substring(2, 8).toUpperCase());

    // Idempotency / Duplicate Check on Master Sheet
    var duplicateRow = findRowByTicketOrEmail_(masterSheet, ticketId, null);
    if (duplicateRow > 0) {
      return createJsonResponse_({
        success: true,
        isDuplicate: true,
        message: 'Submission already recorded',
        ticketId: ticketId,
        row: duplicateRow
      });
    }

    var primaryDeptRaw = data.q11_primary_dept || data.preferredSector || data.primaryDepartment || '';
    var secondaryDeptRaw = data.q11_secondary_dept || data.secondarySector || data.secondaryDepartment || '';

    var matchedDeptKey = resolveDepartmentKey(primaryDeptRaw);
    var secondaryMatchedKey = resolveDepartmentKey(secondaryDeptRaw);

    // Extract practical answers for Primary Department
    var primaryPracticalAnswers = extractPracticalAnswersForDept_(data, matchedDeptKey);

    var candidateFullName = firstNonEmpty_([data.q1_full_name, data.fullName, data.name, '']);
    var candidateEmail = firstNonEmpty_([data.q4_email, data.email, '']);
    var candidatePhone = sanitizePhone_(firstNonEmpty_([data.q5_phone, data.phoneNumber, data.phone, '']));

    var baseRowData = [
      timestamp,
      ticketId,
      candidateFullName,
      firstNonEmpty_([data.q2_age, data.age, '']),
      firstNonEmpty_([data.q3_location, data.city, '']),
      candidateEmail,
      candidatePhone,
      firstNonEmpty_([data.q6_institution, data.institution, '']),
      firstNonEmpty_([data.q7_mun_participation, data.experience, '']),
      firstNonEmpty_([data.q8_secretariat_experience, '']),
      firstNonEmpty_([data.q9_outside_leadership, '']),
      firstNonEmpty_([data.q10_strongest_skills, '']),
      matchedDeptKey || primaryDeptRaw,
      secondaryMatchedKey || secondaryDeptRaw,
      firstNonEmpty_([data.q12_department_suitability, '']),
      firstNonEmpty_([data.q13_tools_and_abilities, ''])
    ];

    var postRowData = [
      firstNonEmpty_([data.q14_why_zenith, data.motivation, '']),
      firstNonEmpty_([data.q15_secretariat_meaning, '']),
      firstNonEmpty_([data.q16_specific_contribution, '']),
      firstNonEmpty_([data.q17_team_member_issue, '']),
      firstNonEmpty_([data.q18_tight_deadline_difficulties, '']),
      firstNonEmpty_([data.q19_time_dedication_and_balance, '']),
      firstNonEmpty_([data.q20_why_choose_you, '']),
      firstNonEmpty_([data.q22_resume_upload, data.resumeUrl, '']),
      firstNonEmpty_([data.q23_portfolio_links, data.portfolioUrl, '']),
      firstNonEmpty_([data.decl_signature_confirmation, data.signature, 'CONFIRMED']),
      '', // AE: Experience (15)
      '', // AF: Suitability (20)
      '', // AG: Motivation (15)
      '', // AH: Situational (20)
      '', // AI: Commitment (20)
      '', // AJ: Communication (10)
      '', // AK: Total Score formula
      'SUBMITTED', // AL: Evaluation Status
      ''  // AM: Reviewer Notes
    ];

    // 1. Append to Master Tab
    var masterRowIndex = masterSheet.getLastRow() + 1;
    var masterRow = baseRowData.concat(primaryPracticalAnswers).concat(postRowData);
    masterRow[COL_INDEX.TOTAL_SCORE - 1] = buildScoreSumFormula_(masterRowIndex);
    masterSheet.appendRow(masterRow);

    // 2. Route to Primary Department Tab
    var routedTabName = '';
    if (matchedDeptKey && DEPARTMENTS[matchedDeptKey]) {
      var deptConfig = DEPARTMENTS[matchedDeptKey];
      var deptSheet = ss.getSheetByName(deptConfig.tabName);
      if (!deptSheet) {
        deptSheet = ss.insertSheet(deptConfig.tabName);
        initOrRepairDataSheet_(deptSheet, deptConfig);
      }
      var deptRowIndex = deptSheet.getLastRow() + 1;
      var deptRow = baseRowData.concat(primaryPracticalAnswers).concat(postRowData);
      deptRow[COL_INDEX.TOTAL_SCORE - 1] = buildScoreSumFormula_(deptRowIndex);
      deptSheet.appendRow(deptRow);
      routedTabName = deptConfig.tabName;
    }

    // 3. Route to Secondary Department Tab (if chosen and distinct from Primary)
    var secondaryRoutedTabName = '';
    if (secondaryMatchedKey && secondaryMatchedKey !== matchedDeptKey && DEPARTMENTS[secondaryMatchedKey]) {
      var secConfig = DEPARTMENTS[secondaryMatchedKey];
      var secSheet = ss.getSheetByName(secConfig.tabName);
      if (!secSheet) {
        secSheet = ss.insertSheet(secConfig.tabName);
        initOrRepairDataSheet_(secSheet, secConfig);
      }
      var secPracticalAnswers = extractSecondaryPracticalAnswers_(data, secondaryMatchedKey);
      var secRowIndex = secSheet.getLastRow() + 1;
      var secRow = baseRowData.concat(secPracticalAnswers).concat(postRowData);
      secRow[COL_INDEX.TOTAL_SCORE - 1] = buildScoreSumFormula_(secRowIndex);
      secRow[COL_INDEX.STATUS - 1] = 'BACKUP PREFERENCE';
      secSheet.appendRow(secRow);
      secondaryRoutedTabName = secConfig.tabName;
    }

    // 4. Optional Applicant Confirmation Email
    if (CONFIG.SEND_CONFIRMATION_EMAIL && candidateEmail && candidateEmail.indexOf('@') !== -1) {
      sendApplicantConfirmationEmail_(candidateEmail, candidateFullName, ticketId, matchedDeptKey || primaryDeptRaw);
    }

    // 5. Log Webhook Audit Event
    logWebhookEvent_(ss, 'SUCCESS', ticketId, matchedDeptKey || primaryDeptRaw, 'Master Row ' + masterRowIndex);

    return createJsonResponse_({
      success: true,
      ticketId: ticketId,
      masterRow: masterRowIndex,
      primaryTab: routedTabName,
      secondaryTab: secondaryRoutedTabName,
      candidate: candidateFullName
    });

  } catch (err) {
    return createJsonResponse_({ success: false, error: err.toString() }, 500);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Handle GET requests:
 * 1. Ping / Health check
 * 2. Live Candidate Status Lookup (?query=... or ?ticketId=...)
 */
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // If a query parameter is passed, perform live candidate lookup
  if (e && e.parameter && (e.parameter.query || e.parameter.ticketId)) {
    var query = (e.parameter.query || e.parameter.ticketId).toString().trim();
    var masterSheet = ss.getSheetByName(CONFIG.MASTER_TAB_NAME);

    if (masterSheet && query) {
      var row = findRowByTicketOrEmail_(masterSheet, query, query);
      if (row > 0) {
        var rowValues = masterSheet.getRange(row, 1, 1, COL_INDEX.NOTES).getValues()[0];
        return createJsonResponse_({
          success: true,
          found: true,
          ticketId: rowValues[COL_INDEX.TICKET_ID - 1],
          fullName: rowValues[COL_INDEX.FULL_NAME - 1],
          email: rowValues[COL_INDEX.EMAIL - 1],
          primaryDept: rowValues[COL_INDEX.PRIMARY_DEPT - 1],
          totalScore: rowValues[COL_INDEX.TOTAL_SCORE - 1] || 0,
          status: rowValues[COL_INDEX.STATUS - 1] || 'SUBMITTED',
          reviewerNotes: rowValues[COL_INDEX.NOTES - 1] || '',
          submittedAt: rowValues[COL_INDEX.SUBMITTED_AT - 1]
        });
      } else {
        return createJsonResponse_({
          success: true,
          found: false,
          query: query,
          message: 'Candidate application not found in Secretariat ledger'
        });
      }
    }
  }

  // Default Health Check response
  return createJsonResponse_({
    status: 'ONLINE',
    conference: CONFIG.CONFERENCE_NAME,
    organizer: CONFIG.ORGANIZER,
    masterTab: CONFIG.MASTER_TAB_NAME,
    departmentsCount: Object.keys(DEPARTMENTS).length,
    timestamp: new Date().toISOString()
  });
}

/**
 * Two-way Live Sync Trigger (onEdit)
 * 1. Synchronizes scorecard grades, total scores, Evaluation Status, and Reviewer Notes
 *    between Master Tab and Department Tabs in real time using the Candidate's Ticket ID.
 * 2. AUTOMATICALLY PUSHES TO ZENVITRA: Calls https://zenvitra.xyz/api/forms/status/update
 *    so the candidate's live status tracker on the website is updated instantly!
 */
function onEdit(e) {
  if (!e || !e.range) return;

  var sheet = e.range.getSheet();
  var sheetName = sheet.getName();
  var row = e.range.getRow();
  var col = e.range.getColumn();

  // Ignore edits on Dashboard, Audit Log, or Header Row
  if (sheetName === CONFIG.DASHBOARD_TAB_NAME || sheetName === CONFIG.AUDIT_LOG_TAB_NAME || row <= 1) {
    return;
  }

  // Only sync edits made to Scorecard (31..36), Status (38), or Notes (39)
  var isScoreEdit = (col >= COL_INDEX.SCORE_START && col <= COL_INDEX.SCORE_START + 5);
  var isStatusEdit = (col === COL_INDEX.STATUS);
  var isNotesEdit = (col === COL_INDEX.NOTES);

  if (!isScoreEdit && !isStatusEdit && !isNotesEdit) {
    return;
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ticketId = sheet.getRange(row, COL_INDEX.TICKET_ID).getValue();
  if (!ticketId) return;

  // Read candidate info
  var candidateEmail = sheet.getRange(row, COL_INDEX.EMAIL).getValue();
  var primaryDept = sheet.getRange(row, COL_INDEX.PRIMARY_DEPT).getValue();

  // Read the full evaluation block (AE..AM, 9 columns) from the edited row
  var evalValues = sheet.getRange(row, COL_INDEX.SCORE_START, 1, 9).getValues()[0];
  var totalScoreVal = sheet.getRange(row, COL_INDEX.TOTAL_SCORE).getValue();
  var statusVal = sheet.getRange(row, COL_INDEX.STATUS).getValue();
  var notesVal = sheet.getRange(row, COL_INDEX.NOTES).getValue();

  // 1. If edit happened on Master Tab -> sync to Department Tab
  if (sheetName === CONFIG.MASTER_TAB_NAME) {
    var matchedDeptKey = resolveDepartmentKey(primaryDept);
    if (matchedDeptKey && DEPARTMENTS[matchedDeptKey]) {
      var deptSheet = ss.getSheetByName(DEPARTMENTS[matchedDeptKey].tabName);
      if (deptSheet) {
        updateEvaluationBlockByTicket_(deptSheet, ticketId, evalValues);
      }
    }
  } 
  // 2. If edit happened on Department Tab -> sync to Master Tab
  else {
    var masterSheet = ss.getSheetByName(CONFIG.MASTER_TAB_NAME);
    if (masterSheet) {
      updateEvaluationBlockByTicket_(masterSheet, ticketId, evalValues);
    }
  }

  // 3. PUSH STATUS UPDATE DIRECTLY TO ZENVITRA
  syncStatusToZenvitra_(ticketId, statusVal, totalScoreVal, notesVal, primaryDept, candidateEmail);
}

/**
 * Helper to push status updates directly to Zenvitra's live status server
 */
function syncStatusToZenvitra_(ticketId, status, totalScore, notes, primaryDept, candidateEmail) {
  try {
    var payload = {
      ticketId: ticketId,
      status: status || 'UNDER REVIEW',
      totalScore: totalScore || '',
      notes: notes || '',
      department: primaryDept || '',
      email: candidateEmail || '',
      source: 'GoogleSheets-onEdit',
      secret: CONFIG.ZENVITRA_SYNC_SECRET
    };

    var options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    UrlFetchApp.fetch(CONFIG.ZENVITRA_SYNC_URL, options);
  } catch (err) {
    Logger.log('Could not push to Zenvitra: ' + err.toString());
  }
}

/**
 * Updates Scorecard AE..AJ, Formula AK, Status AL, Notes AM on a target sheet matching ticketId
 */
function updateEvaluationBlockByTicket_(targetSheet, ticketId, evalValues) {
  var targetRow = findRowByTicketOrEmail_(targetSheet, ticketId, null);
  if (targetRow <= 1) return;

  // Copy Scores AE..AJ (cols 31..36)
  targetSheet.getRange(targetRow, COL_INDEX.SCORE_START, 1, 6).setValues([evalValues.slice(0, 6)]);

  // Ensure Total Formula in AK (col 37) stays intact
  targetSheet.getRange(targetRow, COL_INDEX.TOTAL_SCORE).setFormula(buildScoreSumFormula_(targetRow));

  // Copy Status (AL, col 38) and Notes (AM, col 39)
  targetSheet.getRange(targetRow, COL_INDEX.STATUS, 1, 2).setValues([[evalValues[7], evalValues[8]]]);
}

/**
 * Full bulk resync across all tabs
 */
function syncAllTabsWithMaster() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var masterSheet = ss.getSheetByName(CONFIG.MASTER_TAB_NAME);
  if (!masterSheet) {
    ss.toast('Master tab not found.', 'Error', 5);
    return;
  }

  var masterLastRow = masterSheet.getLastRow();
  if (masterLastRow <= 1) {
    ss.toast('No applicant rows to sync.', 'Zenith MUN', 5);
    return;
  }

  var tickets = masterSheet.getRange(2, COL_INDEX.TICKET_ID, masterLastRow - 1, 1).getValues();
  var primaryDepts = masterSheet.getRange(2, COL_INDEX.PRIMARY_DEPT, masterLastRow - 1, 1).getValues();
  var evalBlocks = masterSheet.getRange(2, COL_INDEX.SCORE_START, masterLastRow - 1, 9).getValues();

  var updatedCount = 0;
  for (var r = 0; r < tickets.length; r++) {
    var ticketId = tickets[r][0];
    if (!ticketId) continue;

    var deptKey = resolveDepartmentKey(primaryDepts[r][0]);
    if (deptKey && DEPARTMENTS[deptKey]) {
      var deptSheet = ss.getSheetByName(DEPARTMENTS[deptKey].tabName);
      if (deptSheet) {
        updateEvaluationBlockByTicket_(deptSheet, ticketId, evalBlocks[r]);
        updatedCount++;
      }
    }
  }

  ss.toast('Successfully synchronized ' + updatedCount + ' applicant scorecard records across all tabs!', 'Resync Complete', 6);
}

/**
 * Log webhook execution in audit sheet
 */
function logWebhookEvent_(ss, status, ticketId, dept, notes) {
  try {
    var auditSheet = ss.getSheetByName(CONFIG.AUDIT_LOG_TAB_NAME);
    if (!auditSheet) {
      auditSheet = ss.insertSheet(CONFIG.AUDIT_LOG_TAB_NAME);
      initAuditSheet_(auditSheet);
    }
    auditSheet.appendRow([new Date().toISOString(), status, ticketId, dept, notes]);
  } catch (e) {}
}

/**
 * Initialize audit sheet
 */
function initAuditSheet_(sheet) {
  sheet.clear();
  var headers = ['Timestamp', 'Status', 'Ticket ID', 'Department', 'Execution Notes'];
  sheet.appendRow(headers);
  var r = sheet.getRange(1, 1, 1, headers.length);
  r.setBackground('#0f172a');
  r.setFontColor('#94a3b8');
  r.setFontWeight('bold');
  sheet.setFrozenRows(1);
}

/**
 * Helper to build standard =SUM(AE{row}:AJ{row}) formula
 */
function buildScoreSumFormula_(rowNum) {
  return '=SUM(AE' + rowNum + ':AJ' + rowNum + ')';
}

/**
 * Helper to extract practical answers for a department
 */
function extractPracticalAnswersForDept_(data, deptKey) {
  if (deptKey && DEPARTMENTS[deptKey]) {
    var fields = DEPARTMENTS[deptKey].fields;
    var out = [];
    for (var i = 0; i < fields.length; i++) {
      out.push(data[fields[i]] || '');
    }
    return out;
  }
  return ['', '', '', ''];
}

/**
 * Helper to extract secondary department practical answers
 */
function extractSecondaryPracticalAnswers_(data, secondaryDeptKey) {
  return extractPracticalAnswersForDept_(data, secondaryDeptKey);
}

/**
 * Helper to match department keys accurately
 */
function resolveDepartmentKey(input) {
  if (!input) return null;
  var str = input.toString().trim().toLowerCase();

  // 1. Exact match first
  for (var key in DEPARTMENTS) {
    if (str === key.toLowerCase()) return key;
  }

  // 2. Specific keyword matches
  if (str.indexOf('delegate') !== -1 || str.indexOf('outreach') !== -1) return 'Delegate Affairs & Outreach';
  if (str.indexOf('marketing') !== -1 || str.indexOf('public relations') !== -1 || str.indexOf('pr') !== -1) return 'Public Relations & Marketing';
  if (str.indexOf('design') !== -1 || str.indexOf('creative') !== -1) return 'Design & Creative';
  if (str.indexOf('media') !== -1 || str.indexOf('comms') !== -1 || str.indexOf('communication') !== -1) return 'Media & Communications';
  if (str.indexOf('tech') !== -1 || str.indexOf('website') !== -1 || str.indexOf('software') !== -1) return 'Technical & Website';
  if (str.indexOf('event') !== -1 || str.indexOf('ops') !== -1 || str.indexOf('operation') !== -1) return 'Events & Conference Operations';
  if (str.indexOf('research') !== -1 || str.indexOf('content') !== -1) return 'Research & Content';

  return null;
}

/**
 * Helper to find row by Ticket ID or Email
 */
function findRowByTicketOrEmail_(sheet, ticketId, email) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return -1;

  var ticketValues = sheet.getRange(2, COL_INDEX.TICKET_ID, lastRow - 1, 1).getValues();
  var emailValues = email ? sheet.getRange(2, COL_INDEX.EMAIL, lastRow - 1, 1).getValues() : null;

  var cleanTicket = ticketId ? ticketId.toString().trim().toUpperCase() : null;
  var cleanEmail = email ? email.toString().trim().toLowerCase() : null;

  for (var i = 0; i < ticketValues.length; i++) {
    if (cleanTicket && ticketValues[i][0] && ticketValues[i][0].toString().trim().toUpperCase() === cleanTicket) {
      return i + 2;
    }
    if (cleanEmail && emailValues && emailValues[i][0] && emailValues[i][0].toString().trim().toLowerCase() === cleanEmail) {
      return i + 2;
    }
  }
  return -1;
}

/**
 * First non-empty helper
 */
function firstNonEmpty_(arr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] !== undefined && arr[i] !== null && String(arr[i]).trim() !== '') {
      return arr[i];
    }
  }
  return '';
}

/**
 * Phone number sanitizer
 */
function sanitizePhone_(phone) {
  if (!phone) return '';
  return phone.toString().replace(/[^0-9+]/g, '');
}

/**
 * Helper to create JSON output response
 */
function createJsonResponse_(obj, statusCode) {
  var output = ContentService.createTextOutput(JSON.stringify(obj));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * Send applicant confirmation email
 */
function sendApplicantConfirmationEmail_(email, name, ticketId, dept) {
  try {
    var subject = 'ZENITH MUN 2026 — Secretariat Application Received [' + ticketId + ']';
    var htmlBody = 
      '<div style="background-color:#090a0f; color:#f8fafc; font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif; padding:32px 24px; border-radius:16px; max-width:600px; margin:0 auto; border:1px solid #f59e0b44;">' +
        '<div style="text-align:center; padding-bottom:20px; border-bottom:1px solid #ffffff15;">' +
          '<h1 style="color:#fbbf24; font-size:22px; margin:0 0 6px 0; letter-spacing:1px;">ZENITH MODEL UNITED NATIONS 2026</h1>' +
          '<p style="color:#94a3b8; font-size:12px; margin:0; text-transform:uppercase; letter-spacing:2px;">A NEW ZEN BEGINS &bull; BY YOUTH. FOR YOUTH.</p>' +
        '</div>' +
        '<div style="padding:24px 0;">' +
          '<p style="font-size:15px; color:#e2e8f0; margin-top:0;">Dear <strong>' + (name || 'Applicant') + '</strong>,</p>' +
          '<p style="font-size:14px; color:#94a3b8; line-height:1.6;">Thank you for applying to join the Secretariat of ZENITH MODEL UNITED NATIONS 2026. Your submission has been securely recorded in our Admissions Ledger.</p>' +
          '<div style="background-color:#111827; border-left:4px solid #fbbf24; padding:16px; border-radius:8px; margin:20px 0;">' +
            '<p style="margin:4px 0; font-size:13px; color:#94a3b8;"><strong>Application Ticket ID:</strong> <span style="color:#fbbf24; font-family:monospace; font-size:14px;">' + ticketId + '</span></p>' +
            '<p style="margin:4px 0; font-size:13px; color:#94a3b8;"><strong>Primary Department:</strong> <span style="color:#ffffff;">' + dept + '</span></p>' +
            '<p style="margin:4px 0; font-size:13px; color:#94a3b8;"><strong>Status:</strong> <span style="color:#38bdf8;">UNDER EVALUATION (100% MERIT)</span></p>' +
          '</div>' +
          '<p style="font-size:13px; color:#94a3b8; line-height:1.6;">You can track your live application evaluation status anytime by visiting our portal: <a href="https://zenvitra.xyz/events/zenith-mun-2026" style="color:#fbbf24; text-decoration:none;">zenvitra.xyz/events/zenith-mun-2026</a>.</p>' +
        '</div>' +
        '<div style="border-top:1px solid #ffffff15; padding-top:16px; font-size:11px; color:#64748b; text-align:center;">' +
          'ZENITH MUN 2026 Secretariat Selection Committee &bull; Powered by Zenvitra.xyz' +
        '</div>' +
      '</div>';

    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: htmlBody,
      replyTo: CONFIG.REPLY_TO_EMAIL,
      name: 'ZENITH MUN 2026 Secretariat'
    });
  } catch (e) {
    Logger.log('Could not send confirmation email: ' + e.toString());
  }
}

/**
 * Quick Test Function to simulate an incoming webhook
 */
function runTestWebhookSubmission() {
  var dummyEvent = {
    postData: {
      contents: JSON.stringify({
        submittedAt: new Date().toISOString(),
        submissionId: 'ZEN26-SEC-TEST-' + Math.floor(Math.random() * 1000),
        data: {
          q1_full_name: 'Test Candidate',
          q2_age: '19',
          q3_location: 'Udaipur, Rajasthan, India',
          q4_email: 'test.candidate@example.com',
          q5_phone: '+919876543210',
          q6_institution: 'Delhi Public School',
          q11_primary_dept: 'Delegate Affairs & Outreach',
          q11_secondary_dept: 'Public Relations & Marketing',
          q_del_attract: 'Institutional school delegations and campus ambassador networks.',
          q_del_dissatisfied: 'Direct personal outreach, resolving slot allocations within 2 hours.',
          q_del_network: 'National youth conferences, MUN societies and inter-school debate clubs.',
          q_del_tracking: 'Live Google Sheets pipeline with color-coded verification stages.',
          q14_why_zenith: 'To build Rajasthan\'s premier student-led diplomacy summit.',
          q22_resume_upload: 'https://drive.google.com/test-resume'
        }
      })
    }
  };

  var res = doPost(dummyEvent);
  Logger.log(res.getContent());
  SpreadsheetApp.getActiveSpreadsheet().toast('Test webhook executed! Check Master tab and Dept - Delegate Affairs tab.', 'Ping Success', 6);
}
