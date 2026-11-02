/**
 * ══════════════════════════════════════════════════════════════════════════
 * ZENITH MODEL UNITED NATIONS 2026 — SECRETARIAT GOOGLE SHEETS INTEGRATION
 * PRESENTED BY ZENVITRA | BY YOUTH. FOR YOUTH.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * HOW TO INSTALL IN GOOGLE SHEETS:
 * 1. Open your Google Sheet for Zenith MUN 2026.
 * 2. In the top menu, click Extensions > Apps Script.
 * 3. Delete any code in the editor, paste this entire file, and click Save.
 * 4. Click "Deploy" > "New deployment".
 * 5. Select type: "Web app".
 * 6. Execute as: "Me", Who has access: "Anyone".
 * 7. Click Deploy, copy the "Web app URL", and set it in your .env as ZENITH_GOOGLE_SHEETS_WEBHOOK_URL.
 */

var SHEET_NAME = 'Secretariat Responses';

var HEADERS = [
  'Submission Timestamp',
  'Ticket / Application ID',
  'Full Name',
  'Age',
  'City, State & Country',
  'Email Address',
  'WhatsApp / Contact Number',
  'Institution & Academic Year',
  'Q7. MUN Participation & Experiences',
  'Q8. Prior Secretariat / EB Roles',
  'Q9. Leadership Outside MUNs',
  'Q10. Strongest Skills',
  'Q11. 1st Department Preference',
  'Q11b. 2nd Department Preference',
  'Q12. Department Suitability Rationale',
  'Q13. Tools & Technical Abilities',
  'Dept Practical: Question 1 Answer',
  'Dept Practical: Question 2 Answer',
  'Dept Practical: Question 3 Answer',
  'Dept Practical: Question 4 Answer',
  'Q14. Why Zenith MUN 2026',
  'Q15. Meaning of Secretariat',
  'Q16. Specific Contribution / Idea',
  'Q17. Teammate Inactivity Scenario',
  'Q18. Tight Deadline Dilemma',
  'Q19. Time Dedication & Academic Balance',
  'Q20. Why Choose You',
  'Resume / CV Upload URL',
  'Portfolio / LinkedIn Link',
  'Digital Signature Confirmation',
  // EVALUATION SCORECARD COLUMNS (100% MERIT)
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
 * Handle incoming POST submissions from Zenvitra / forms engine
 */
function doPost(e) {
  try {
    var raw = e.postData.contents;
    var payload = JSON.parse(raw);
    var data = payload.data || payload;

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      initSheet(sheet);
    } else if (sheet.getLastRow() === 0) {
      initSheet(sheet);
    }

    var timestamp = payload.submittedAt || new Date().toISOString();
    var ticketId = data.ticketId || payload.submissionId || ('SEC-' + Math.random().toString(36).substring(2, 8).toUpperCase());

    // Extract Practical Dept Qs (whichever department was chosen)
    var deptQ1 = data.q_del_attract || data.q_pr_awareness || data.q_design_tools || data.q_media_writing || data.q_tech_stack || data.q_events_coord || data.q_research_verify || '';
    var deptQ2 = data.q_del_dissatisfied || data.q_pr_campaign || data.q_design_samples || data.q_media_draft || data.q_tech_projects || data.q_events_contingency || data.q_research_bg_guide || '';
    var deptQ3 = data.q_del_network || data.q_pr_feedback || data.q_design_consistency || data.q_media_consistency || data.q_tech_troubleshoot || data.q_events_tripartite || data.q_research_unbiased || '';
    var deptQ4 = data.q_del_tracking || data.q_pr_social_media || data.q_design_last_minute || data.q_media_correction || data.q_tech_accuracy || data.q_events_disruption || data.q_research_sample || '';

    var rowNumber = sheet.getLastRow() + 1;
    // Formula for Total Score across columns AA-AF
    var totalFormula = '=SUM(AE' + rowNumber + ':AJ' + rowNumber + ')';

    var newRow = [
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
      data.q11_primary_dept || data.preferredSector || '',
      data.q11_secondary_dept || data.secondarySector || '',
      data.q12_department_suitability || '',
      data.q13_tools_and_abilities || '',
      deptQ1,
      deptQ2,
      deptQ3,
      deptQ4,
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
      // Blank scorecard scores for reviewers to input (0-15, 0-20, etc.)
      '', // Experience (15)
      '', // Suitability (20)
      '', // Motivation (15)
      '', // Situational (20)
      '', // Commitment (20)
      '', // Communication (10)
      totalFormula,
      'SUBMITTED', // Evaluation Status
      ''           // Reviewer Notes
    ];

    sheet.appendRow(newRow);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      ticketId: ticketId,
      row: sheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests for health check or testing
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ONLINE',
    conference: 'ZENITH MODEL UNITED NATIONS 2026',
    endpoint: 'Secretariat Response Ingestion Webhook',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Initialize and style the responses sheet
 */
function initSheet(sheet) {
  sheet.clear();
  sheet.appendRow(HEADERS);

  // Format header row
  var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setBackground('#0d1117');
  headerRange.setFontColor('#f59e0b');
  headerRange.setFontWeight('bold');
  headerRange.setFontFamily('Roboto');
  headerRange.setFontSize(10);
  headerRange.setWrap(true);
  sheet.setRowHeight(1, 45);

  // Freeze header row and ticket ID column
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(3);

  // Highlight scorecard columns (columns 31 to 37) in royal amber / gold
  var scorecardRange = sheet.getRange(1, 31, 1, 7);
  scorecardRange.setBackground('#2d1a04');
  scorecardRange.setFontColor('#fbbf24');
}
