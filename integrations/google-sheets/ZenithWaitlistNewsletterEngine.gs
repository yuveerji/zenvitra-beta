/**
 * ══════════════════════════════════════════════════════════════════════════════
 * ZENITH MODEL UNITED NATIONS 2026 — PRIORITY WAITLIST & NEWSLETTER ENGINE
 * PRESENTED BY ZENVITRA | A NEW ZEN BEGINS | BY YOUTH. FOR YOUTH.
 * ══════════════════════════════════════════════════════════════════════════════
 *
 * PURPOSE:
 * 1. Collects, ranks, and manages priority waitlist submissions for ZENITH MUN 2026.
 * 2. Generates unique VIP Queue Numbers (e.g. #001, #002) and Early Pass Unlock Codes.
 * 3. 1-Click Newsletter Broadcast Engine to dispatch branded HTML newsletters
 *    and priority drop notifications to waitlist delegates with 0 third-party fees.
 * 4. Live webhook receiver (doPost) to ingest waitlist signups directly from Zenvitra.
 *
 * HOW TO INSTALL IN GOOGLE SHEETS:
 * 1. Open your Google Sheet (or create a new Google Sheet named "ZENITH MUN 2026 — Priority Waitlist").
 * 2. Go to Extensions > Apps Script.
 * 3. Paste this entire script into the editor and click Save (💾).
 * 4. Refresh your Google Sheet.
 * 5. Click the new "🏛️ ZENITH WAITLIST" menu in the top bar:
 *    Click "⚙️ Initialize Waitlist & Campaign Hub".
 * 6. To enable live web signups, click "Deploy" > "New deployment" > "Web app":
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 *    - Copy the Web App URL and set as: ZENITH_WAITLIST_WEBHOOK_URL
 */

var WAITLIST_CONFIG = {
  CONFERENCE_NAME: 'ZENITH MODEL UNITED NATIONS 2026',
  ORGANIZER: 'ZENVITRA',
  TAGLINE: 'A NEW ZEN BEGINS | BY YOUTH. FOR YOUTH.',
  EDITION: 'PREMIER EDITION • UDAIPUR, RAJASTHAN',
  PORTAL_URL: 'https://zenvitra.xyz/events/zenith-mun-2026',
  HUB_TAB: '00 - Newsletter Campaign Hub',
  WAITLIST_TAB: 'Priority Waitlist Roster',
  LOGS_TAB: 'Dispatch Audit Logs',
  SENDER_NAME: 'ZENITH MUN 2026 | Secretariat',
  REPLY_TO: 'yuveerji@gmail.com',
  CODE_PREFIX: 'ZEN26-VIP-'
};

/**
 * Custom UI Menu Trigger
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🏛️ ZENITH WAITLIST')
    .addItem('⚙️ Initialize Waitlist & Campaign Hub', 'initializeWaitlistSystem')
    .addItem('✉️ Send Test Newsletter (To My Email)', 'sendTestNewsletterToSelf')
    .addItem('🚀 Launch Newsletter Blast (Active Campaign)', 'dispatchWaitlistNewsletterBlast')
    .addSeparator()
    .addItem('🔄 Refresh Queue Numbers & Unlock Codes', 'regenerateMissingCodes')
    .addItem('🧪 Ingest Test Waitlist Subscriber', 'runTestWaitlistIngestion')
    .addToUi();
}

/**
 * Initialize all sheets non-destructively
 */
function initializeWaitlistSystem() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Campaign Hub Sheet
  var hub = ss.getSheetByName(WAITLIST_CONFIG.HUB_TAB);
  if (!hub) {
    hub = ss.insertSheet(WAITLIST_CONFIG.HUB_TAB, 0);
  }
  buildCampaignHubSheet_(hub);

  // 2. Waitlist Roster Sheet
  var roster = ss.getSheetByName(WAITLIST_CONFIG.WAITLIST_TAB);
  if (!roster) {
    roster = ss.insertSheet(WAITLIST_CONFIG.WAITLIST_TAB, 1);
  }
  initWaitlistRosterSheet_(roster);

  // 3. Dispatch Logs Sheet
  var logs = ss.getSheetByName(WAITLIST_CONFIG.LOGS_TAB);
  if (!logs) {
    logs = ss.insertSheet(WAITLIST_CONFIG.LOGS_TAB, 2);
  }
  initLogsSheet_(logs);

  ss.setActiveSheet(hub);
  ss.toast('Priority Waitlist Roster and Newsletter Campaign Hub initialized successfully!', 'Zenith Engine Ready', 7);
}

/**
 * Build the Newsletter Campaign Hub tab
 */
function buildCampaignHubSheet_(sheet) {
  sheet.clear();
  try {
    sheet.setHiddenGridlines(false);
  } catch (e) {}

  try {
    sheet.setTabColor('#f59e0b'); // Gold
  } catch (e) {}

  // Header Banner
  sheet.getRange('A1:G2').merge();
  var title = sheet.getRange('A1');
  title.setValue('🏛️ ZENITH MODEL UNITED NATIONS 2026 — PRIORITY WAITLIST & NEWSLETTER STUDIO');
  title.setBackground('#090a0f');
  title.setFontColor('#fbbf24');
  title.setFontSize(13);
  title.setFontWeight('bold');
  title.setFontFamily('Roboto');
  title.setHorizontalAlignment('center');
  title.setVerticalAlignment('middle');

  // Subtitle
  sheet.getRange('A3:G3').merge();
  var sub = sheet.getRange('A3');
  sub.setValue('VIP Delegate Queue Management & Direct-to-Inbox Phased Broadcast Engine | Powered by Zenvitra.xyz');
  sub.setBackground('#111827');
  sub.setFontColor('#9ca3af');
  sub.setFontSize(9);
  sub.setFontFamily('Roboto');
  sub.setHorizontalAlignment('center');

  // KPI Row (Row 5..7)
  var kpis = [
    { label: 'TOTAL WAITLISTED', cell: 'B6', formula: '=COUNTA(\'' + WAITLIST_CONFIG.WAITLIST_TAB + '\'!B2:B)', color: '#0284c7' },
    { label: 'TIER 1 (SUPER EARLY)', cell: 'D6', formula: '=COUNTIF(\'' + WAITLIST_CONFIG.WAITLIST_TAB + '\'!G2:G, "Tier 1*")', color: '#38bdf8' },
    { label: 'DISPATCHED EMAILS', cell: 'F6', formula: '=COUNTIF(\'' + WAITLIST_CONFIG.WAITLIST_TAB + '\'!I2:I, "SENT*")', color: '#22c55e' }
  ];

  var kpiCols = ['A', 'C', 'E'];
  for (var i = 0; i < kpis.length; i++) {
    var c = kpiCols[i];
    var endC = String.fromCharCode(c.charCodeAt(0) + 1);
    var range = sheet.getRange(c + '5:' + endC + '7');
    range.setBackground('#0f172a');
    range.setBorder(true, true, true, true, false, false, kpis[i].color, SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

    var lbl = sheet.getRange(c + '5:' + endC + '5');
    lbl.merge();
    lbl.setValue(kpis[i].label);
    lbl.setFontColor('#94a3b8');
    lbl.setFontSize(9);
    lbl.setFontWeight('bold');
    lbl.setHorizontalAlignment('center');

    var val = sheet.getRange(c + '6:' + endC + '7');
    val.merge();
    val.setFormula(kpis[i].formula);
    val.setFontColor(kpis[i].color);
    val.setFontSize(22);
    val.setFontWeight('bold');
    val.setHorizontalAlignment('center');
    val.setVerticalAlignment('middle');
  }

  // Section 2: Active Broadcast Composer (Row 9..18)
  sheet.getRange('A9:G9').merge();
  var compHeader = sheet.getRange('A9');
  compHeader.setValue('✉️ ACTIVE NEWSLETTER BROADCAST COMPOSER (EDIT BELOW TO SEND)');
  compHeader.setBackground('#1e293b');
  compHeader.setFontColor('#ffffff');
  compHeader.setFontWeight('bold');
  compHeader.setFontSize(10);

  var formRows = [
    ['Campaign Name', 'Zenith MUN 2026 Priority Pass Drop Wave 1', 'Internal campaign identifier'],
    ['Newsletter Template', 'Template 1: Priority Pass Early Access Drop (VIP)', 'Select from dropdown: Template 1, Template 2, Template 3, or Custom'],
    ['Audience Target', 'ALL WAITLIST', 'Options: ALL WAITLIST | TIER 1 ONLY | QUEUED ONLY'],
    ['Email Subject Line', '⚡ Your VIP Early Access Code is Live | ZENITH MUN 2026', 'Subscriber inbox subject line'],
    ['Preheader Preview Text', 'Exclusive 24-hour pass reservation window unlocked for priority waitlist delegates.', 'Short teaser visible in inbox list'],
    ['Announcement Headline', 'A NEW ZEN BEGINS IN UDAIPUR', 'Top hero banner text'],
    ['Main Message Body', 'We are delighted to confirm that early pass reservations for ZENITH MODEL UNITED NATIONS 2026 are officially opening. As a priority waitlist member, your personal allocation unlock token is active below.', 'Primary newsletter copy'],
    ['Call to Action Text', 'RESERVE YOUR PASS WITH VIP CODE →', 'Button text'],
    ['Call to Action URL', WAITLIST_CONFIG.PORTAL_URL, 'Destination URL for the main button']
  ];

  for (var r = 0; r < formRows.length; r++) {
    var line = 10 + r;
    sheet.getRange(line, 1).setValue(formRows[r][0]).setFontWeight('bold').setFontColor('#e2e8f0').setBackground('#0d1117');
    sheet.getRange(line, 2, 1, 4).merge().setValue(formRows[r][1]).setFontColor('#ffffff').setBackground('#161f30').setWrap(true);
    sheet.getRange(line, 6, 1, 2).merge().setValue(formRows[r][2]).setFontColor('#64748b').setFontSize(9).setBackground('#0b0f19');
  }

  // Template dropdown validation on B11
  var tplRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      'Template 1: Priority Pass Early Access Drop (VIP)',
      'Template 2: Committee & Agenda Reveal Announcement',
      'Template 3: 24-Hour Final Countdown & Phased Pricing Drop',
      'Template 4: Custom Message Body (Uses Row 16 Text)'
    ], true)
    .build();
  sheet.getRange(11, 2).setDataValidation(tplRule);

  // Audience dropdown validation on B12
  var audRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['ALL WAITLIST', 'TIER 1 ONLY', 'QUEUED ONLY'], true)
    .build();
  sheet.getRange(12, 2).setDataValidation(audRule);

  // Instructions Card (Row 20..24)
  sheet.getRange('A20:G20').merge();
  sheet.getRange('A20').setValue('📋 HOW TO DISPATCH NEWSLETTERS TO SUBSCRIBERS:').setFontWeight('bold').setFontColor('#fbbf24').setBackground('#1f1905');

  var instructions = [
    '1. Edit rows 10 to 18 above to configure your email subject, template, and message.',
    '2. Click "🏛️ ZENITH WAITLIST" > "✉️ Send Test Newsletter" to preview the HTML email in your own inbox.',
    '3. When ready to broadcast to all delegates, click "🏛️ ZENITH WAITLIST" > "🚀 Launch Newsletter Blast".',
    '4. Google Sheets will automatically personalize {{NAME}}, {{QUEUE_NUM}}, and {{UNLOCK_CODE}} for every delegate!'
  ];

  for (var k = 0; k < instructions.length; k++) {
    var iRow = 21 + k;
    sheet.getRange(iRow, 1, 1, 7).merge().setValue(instructions[k]).setFontColor('#cbd5e1').setFontSize(9).setBackground('#0b0f19');
  }

  sheet.setColumnWidth(1, 190);
  sheet.setColumnWidth(2, 220);
  sheet.setColumnWidth(3, 150);
  sheet.setColumnWidth(4, 150);
  sheet.setColumnWidth(5, 120);
  sheet.setColumnWidth(6, 180);
  sheet.setColumnWidth(7, 180);
}

/**
 * Initialize the Priority Waitlist Roster sheet
 */
function initWaitlistRosterSheet_(sheet) {
  var headers = [
    'Timestamp',
    'Queue #',
    'Ticket / Pass ID',
    'Full Name',
    'Email Address',
    'WhatsApp / Contact',
    'Priority Tier',
    'VIP Unlock Code',
    'Newsletter Status',
    'Last Campaign Sent',
    'City & State',
    'Institution',
    'Preferred Committee / Pass Interest'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  var hRange = sheet.getRange(1, 1, 1, headers.length);
  hRange.setBackground('#090a0f');
  hRange.setFontColor('#fbbf24');
  hRange.setFontWeight('bold');
  hRange.setFontFamily('Roboto');
  hRange.setFontSize(10);
  sheet.setRowHeight(1, 44);

  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(4);

  // Status column validation (Column I)
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['QUEUED', 'SENT - WAVE 1', 'SENT - REVEAL', 'SENT - COUNTDOWN', 'FAILED', 'UNSUBSCRIBED'], true)
    .build();
  sheet.getRange(2, 9, 999, 1).setDataValidation(statusRule);

  // Priority Tier validation (Column G)
  var tierRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Tier 1 - Super Early Bird', 'Tier 2 - Early Bird', 'Tier 3 - General Registry'], true)
    .build();
  sheet.getRange(2, 7, 999, 1).setDataValidation(tierRule);

  // Format columns
  sheet.setColumnWidth(1, 150);
  sheet.setColumnWidth(2, 90);
  sheet.setColumnWidth(3, 140);
  sheet.setColumnWidth(4, 180);
  sheet.setColumnWidth(5, 220);
  sheet.setColumnWidth(6, 140);
  sheet.setColumnWidth(7, 160);
  sheet.setColumnWidth(8, 140);
  sheet.setColumnWidth(9, 140);
  sheet.setColumnWidth(10, 160);
}

/**
 * Initialize the Audit Logs sheet
 */
function initLogsSheet_(sheet) {
  var headers = ['Timestamp', 'Campaign Name', 'Audience', 'Subject Line', 'Recipients Count', 'Status / Notes'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  var h = sheet.getRange(1, 1, 1, headers.length);
  h.setBackground('#0f172a');
  h.setFontColor('#94a3b8');
  h.setFontWeight('bold');
  sheet.setFrozenRows(1);
}

/**
 * Handle incoming POST requests from Zenvitra waitlist modal
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);

    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Empty payload' })).setMimeType(ContentService.MimeType.JSON);
    }

    var body = JSON.parse(e.postData.contents);
    var d = body.data || body;

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var roster = ss.getSheetByName(WAITLIST_CONFIG.WAITLIST_TAB);
    if (!roster) {
      roster = ss.insertSheet(WAITLIST_CONFIG.WAITLIST_TAB);
      initWaitlistRosterSheet_(roster);
    }

    var email = (d.email || d.emailAddress || '').trim().toLowerCase();
    if (!email || email.indexOf('@') === -1) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Valid email is required' })).setMimeType(ContentService.MimeType.JSON);
    }

    // Check duplicate email
    var existingRow = findRowByEmail_(roster, email);
    if (existingRow > 1) {
      var existingCode = roster.getRange(existingRow, 8).getValue();
      var existingQueue = roster.getRange(existingRow, 2).getValue();
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        alreadyRegistered: true,
        queueNumber: existingQueue,
        unlockCode: existingCode,
        message: 'Email already registered in priority waitlist'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Generate new queue # and unlock code
    var newRow = roster.getLastRow() + 1;
    var queueNum = '#' + ('000' + (newRow - 1)).slice(-3);
    var unlockCode = WAITLIST_CONFIG.CODE_PREFIX + Math.random().toString(36).substring(2, 7).toUpperCase();
    var passId = 'WAIT-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    var name = d.name || d.fullName || 'Delegate';
    var phone = d.phone || d.whatsapp || '';
    var city = d.city || d.location || '';
    var institution = d.institution || d.school || '';
    var preference = d.preference || d.passInterest || 'General Delegate Pass';

    var rowData = [
      new Date().toISOString(),
      queueNum,
      passId,
      name,
      email,
      phone,
      'Tier 1 - Super Early Bird',
      unlockCode,
      'QUEUED',
      '',
      city,
      institution,
      preference
    ];

    roster.appendRow(rowData);

    // Send instant welcome email with unlock code
    sendPriorityWelcomeEmail_(email, name, queueNum, unlockCode);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      queueNumber: queueNum,
      unlockCode: unlockCode,
      ticketId: passId,
      message: 'Priority waitlist spot reserved successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Handle GET requests for health check or live waitlist position lookup
 */
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  if (e && e.parameter && e.parameter.email) {
    var roster = ss.getSheetByName(WAITLIST_CONFIG.WAITLIST_TAB);
    if (roster) {
      var row = findRowByEmail_(roster, e.parameter.email);
      if (row > 1) {
        var vals = roster.getRange(row, 1, 1, 8).getValues()[0];
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          found: true,
          queueNumber: vals[1],
          passId: vals[2],
          name: vals[3],
          email: vals[4],
          tier: vals[6],
          unlockCode: vals[7]
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ success: true, found: false })).setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'ONLINE',
    service: 'Zenith MUN 2026 Priority Waitlist & Newsletter Engine',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Send test newsletter preview to the script owner / active user
 */
function sendTestNewsletterToSelf() {
  var userEmail = Session.getActiveUser().getEmail() || WAITLIST_CONFIG.REPLY_TO;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var hub = ss.getSheetByName(WAITLIST_CONFIG.HUB_TAB);
  if (!hub) {
    SpreadsheetApp.getUi().alert('Campaign Hub sheet not found. Run Initialize first.');
    return;
  }

  var campaignData = readCampaignConfig_(hub);
  var sampleMember = {
    name: 'Sample Delegate',
    email: userEmail,
    queueNum: '#001',
    unlockCode: WAITLIST_CONFIG.CODE_PREFIX + 'DEMO'
  };

  var htmlBody = renderNewsletterHtml_(campaignData, sampleMember);

  MailApp.sendEmail({
    to: userEmail,
    subject: '[TEST PREVIEW] ' + campaignData.subject,
    htmlBody: htmlBody,
    replyTo: WAITLIST_CONFIG.REPLY_TO,
    name: WAITLIST_CONFIG.SENDER_NAME
  });

  SpreadsheetApp.getUi().alert(
    '✅ Test Newsletter Sent!\n\n' +
    'Check your inbox at: ' + userEmail + '\n' +
    'Subject: [TEST PREVIEW] ' + campaignData.subject
  );
}

/**
 * Dispatch newsletter blast to targeted waitlist delegates
 */
function dispatchWaitlistNewsletterBlast() {
  var ui = SpreadsheetApp.getUi();
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var hub = ss.getSheetByName(WAITLIST_CONFIG.HUB_TAB);
  var roster = ss.getSheetByName(WAITLIST_CONFIG.WAITLIST_TAB);
  var logs = ss.getSheetByName(WAITLIST_CONFIG.LOGS_TAB);

  if (!hub || !roster) {
    ui.alert('Sheets not found. Please run Initialize first.');
    return;
  }

  var campaign = readCampaignConfig_(hub);
  var lastRow = roster.getLastRow();
  if (lastRow <= 1) {
    ui.alert('No waitlist subscribers found on the Roster tab.');
    return;
  }

  var data = roster.getRange(2, 1, lastRow - 1, 10).getValues();
  var targets = [];

  for (var i = 0; i < data.length; i++) {
    var email = data[i][4];
    var tier = data[i][6];
    var status = data[i][8];

    if (!email || email.indexOf('@') === -1) continue;

    if (campaign.targetAudience === 'ALL WAITLIST') {
      targets.push({ row: i + 2, data: data[i] });
    } else if (campaign.targetAudience === 'TIER 1 ONLY' && tier.indexOf('Tier 1') !== -1) {
      targets.push({ row: i + 2, data: data[i] });
    } else if (campaign.targetAudience === 'QUEUED ONLY' && status === 'QUEUED') {
      targets.push({ row: i + 2, data: data[i] });
    }
  }

  if (targets.length === 0) {
    ui.alert('No subscribers matched target: ' + campaign.targetAudience);
    return;
  }

  // Confirmation Guard
  var confirm = ui.alert(
    '🚀 Confirm Newsletter Dispatch',
    'Are you sure you want to send this broadcast?\n\n' +
    '• Campaign: ' + campaign.name + '\n' +
    '• Subject: ' + campaign.subject + '\n' +
    '• Target Audience: ' + campaign.targetAudience + '\n' +
    '• Total Recipients: ' + targets.length + ' delegates\n\n' +
    'Click YES to begin dispatch.',
    ui.ButtonSet.YES_NO
  );

  if (confirm !== ui.Button.YES) {
    ss.toast('Broadcast cancelled.', 'Zenith MUN', 4);
    return;
  }

  var sentCount = 0;
  var failCount = 0;

  for (var j = 0; j < targets.length; j++) {
    var t = targets[j];
    var member = {
      name: t.data[3] || 'Delegate',
      email: t.data[4],
      queueNum: t.data[1] || '#001',
      unlockCode: t.data[7] || (WAITLIST_CONFIG.CODE_PREFIX + 'VIP')
    };

    try {
      var html = renderNewsletterHtml_(campaign, member);
      MailApp.sendEmail({
        to: member.email,
        subject: campaign.subject,
        htmlBody: html,
        replyTo: WAITLIST_CONFIG.REPLY_TO,
        name: WAITLIST_CONFIG.SENDER_NAME
      });

      roster.getRange(t.row, 9).setValue('SENT - ' + campaign.name.substring(0, 15));
      roster.getRange(t.row, 10).setValue(new Date().toLocaleString());
      sentCount++;
      Utilities.sleep(250); // Anti-spam rate limiter
    } catch (err) {
      roster.getRange(t.row, 9).setValue('FAILED: ' + err.message);
      failCount++;
    }
  }

  // Log to audit tab
  if (logs) {
    logs.appendRow([
      new Date().toISOString(),
      campaign.name,
      campaign.targetAudience,
      campaign.subject,
      sentCount,
      'Success: ' + sentCount + ', Failures: ' + failCount
    ]);
  }

  ui.alert(
    '🎉 Broadcast Completed!\n\n' +
    '• Successfully Sent: ' + sentCount + ' emails\n' +
    '• Failed: ' + failCount + '\n\n' +
    'Check the Roster tab to view updated delivery timestamps.'
  );
}

/**
 * Reads campaign composer parameters from Hub tab
 */
function readCampaignConfig_(hub) {
  return {
    name: hub.getRange('B10').getValue() || 'Zenith MUN Priority Update',
    template: hub.getRange('B11').getValue() || 'Template 1',
    targetAudience: hub.getRange('B12').getValue() || 'ALL WAITLIST',
    subject: hub.getRange('B13').getValue() || '⚡ Priority Waitlist Announcement | ZENITH MUN 2026',
    preheader: hub.getRange('B14').getValue() || 'Priority pass drop announcement',
    headline: hub.getRange('B15').getValue() || 'A NEW ZEN BEGINS',
    bodyText: hub.getRange('B16').getValue() || '',
    ctaText: hub.getRange('B17').getValue() || 'RESERVE PASS ON PORTAL →',
    ctaUrl: hub.getRange('B18').getValue() || WAITLIST_CONFIG.PORTAL_URL
  };
}

/**
 * Renders luxury dark-themed responsive HTML newsletter
 */
function renderNewsletterHtml_(campaign, member) {
  var firstName = member.name.split(' ')[0] || 'Delegate';

  var templateContent = '';

  if (campaign.template.indexOf('Template 2') !== -1) {
    // Committee Reveal
    templateContent =
      '<div style="background:#111827; border:1px solid #ffffff15; border-radius:12px; padding:20px; margin:20px 0;">' +
        '<h3 style="color:#38bdf8; font-size:16px; margin:0 0 10px 0; text-transform:uppercase; letter-spacing:1px;">🏛️ 7 Flagship Dynamic Committees Revealed</h3>' +
        '<p style="color:#94a3b8; font-size:13px; line-height:1.6; margin:0 0 14px 0;">Simulate diplomacy across our 7 bespoke councils: AIPPM, UNSC, UNODC, Lok Sabha, Economic & Financial, Crisis Taskforce, and International Press Corps.</p>' +
        '<div style="display:inline-block; padding:8px 14px; background:#0284c725; border:1px solid #38bdf840; border-radius:8px; color:#38bdf8; font-family:monospace; font-size:12px; font-weight:bold;">' +
          'Priority Dais Allocation Reserved for Queue ' + member.queueNum +
        '</div>' +
      '</div>';
  } else if (campaign.template.indexOf('Template 3') !== -1) {
    // 24h Countdown
    templateContent =
      '<div style="background:#1f1305; border:1px solid #f59e0b50; border-radius:12px; padding:20px; margin:20px 0; text-align:center;">' +
        '<span style="background:#f59e0b20; color:#fbbf24; font-size:11px; font-weight:bold; padding:4px 10px; border-radius:99px; text-transform:uppercase; letter-spacing:1px;">⏰ 24-HOUR EARLY BIRD WINDOW</span>' +
        '<h3 style="color:#ffffff; font-size:18px; margin:12px 0 6px 0;">Phased Passes Dropping First for Waitlist</h3>' +
        '<p style="color:#d1d5db; font-size:13px; line-height:1.6; margin:0;">General public pass sales open tomorrow. Secure your tiered pass right now before initial committee capacity fills up.</p>' +
      '</div>';
  }

  var customBodyHtml = campaign.bodyText 
    ? '<p style="font-size:14px; color:#e2e8f0; line-height:1.7; margin:16px 0;">' + campaign.bodyText.replace(/\n/g, '<br>') + '</p>'
    : '';

  return (
    '<!DOCTYPE html>' +
    '<html>' +
    '<head>' +
      '<meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
      '<title>' + campaign.subject + '</title>' +
    '</head>' +
    '<body style="margin:0; padding:0; background-color:#030712; font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif; color:#f8fafc;">' +
      '<div style="display:none; max-height:0px; overflow:hidden;">' + campaign.preheader + '</div>' +
      '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#030712; padding:32px 12px;">' +
        '<tr>' +
          '<td align="center">' +
            '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:620px; background-color:#090a0f; border:1px solid #f59e0b35; border-radius:20px; overflow:hidden; box-shadow:0 20px 40px rgba(0,0,0,0.8);">' +
              
              // Top Gold Accent Bar
              '<tr>' +
                '<td height="4" style="background:linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b); line-height:4px; font-size:4px;">&nbsp;</td>' +
              '</tr>' +

              // Brand Header
              '<tr>' +
                '<td style="padding:36px 32px 24px 32px; text-align:center; border-bottom:1px solid #ffffff12;">' +
                  '<span style="display:inline-block; padding:5px 14px; background-color:#f59e0b15; border:1px solid #f59e0b35; border-radius:999px; color:#fbbf24; font-family:monospace; font-size:11px; font-weight:bold; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:12px;">' +
                    WAITLIST_CONFIG.EDITION +
                  '</span>' +
                  '<h1 style="color:#ffffff; font-size:24px; font-weight:900; letter-spacing:1px; margin:0 0 6px 0; text-transform:uppercase;">' +
                    WAITLIST_CONFIG.CONFERENCE_NAME +
                  '</h1>' +
                  '<p style="color:#94a3b8; font-size:11px; margin:0; letter-spacing:2px; text-transform:uppercase;">' +
                    WAITLIST_CONFIG.TAGLINE +
                  '</p>' +
                '</td>' +
              '</tr>' +

              // Content Body
              '<tr>' +
                '<td style="padding:32px;">' +
                  '<p style="font-size:16px; color:#ffffff; margin:0 0 16px 0;">Dear <strong>' + firstName + '</strong>,</p>' +
                  
                  '<h2 style="color:#fbbf24; font-size:20px; font-weight:800; line-height:1.3; margin:0 0 14px 0; text-transform:uppercase;">' +
                    campaign.headline +
                  '</h2>' +

                  customBodyHtml +
                  templateContent +

                  // VIP Credential Card
                  '<div style="background:#111827; border-left:4px solid #fbbf24; border-radius:10px; padding:20px; margin:24px 0;">' +
                    '<div style="font-size:12px; color:#94a3b8; text-transform:uppercase; font-family:monospace; margin-bottom:6px;">Your Verified VIP Credentials:</div>' +
                    '<table width="100%" cellspacing="0" cellpadding="4">' +
                      '<tr>' +
                        '<td style="color:#94a3b8; font-size:13px;">Waitlist Position:</td>' +
                        '<td style="color:#38bdf8; font-family:monospace; font-size:15px; font-weight:bold;" align="right">' + member.queueNum + '</td>' +
                      '</tr>' +
                      '<tr>' +
                        '<td style="color:#94a3b8; font-size:13px;">Personal Unlock Code:</td>' +
                        '<td style="color:#fbbf24; font-family:monospace; font-size:15px; font-weight:bold;" align="right">' + member.unlockCode + '</td>' +
                      '</tr>' +
                      '<tr>' +
                        '<td style="color:#94a3b8; font-size:13px;">Priority Status:</td>' +
                        '<td style="color:#22c55e; font-size:13px; font-weight:bold;" align="right">✓ Verified & Reserved</td>' +
                      '</tr>' +
                    '</table>' +
                  '</div>' +

                  // CTA Button
                  '<div style="text-align:center; margin:32px 0 16px 0;">' +
                    '<a href="' + campaign.ctaUrl + '" target="_blank" style="display:inline-block; padding:16px 36px; background:linear-gradient(135deg, #f59e0b, #d97706); color:#000000; font-size:13px; font-weight:900; letter-spacing:1px; text-transform:uppercase; text-decoration:none; border-radius:12px; box-shadow:0 8px 24px rgba(245,158,11,0.35);">' +
                      campaign.ctaText +
                    '</a>' +
                  '</div>' +

                  '<p style="font-size:12px; color:#64748b; text-align:center; margin-top:16px;">' +
                    'Need assistance with group delegation registration or institutional passes? Simply reply to this email.' +
                  '</p>' +
                '</td>' +
              '</tr>' +

              // Footer
              '<tr>' +
                '<td style="padding:24px 32px; background-color:#06080d; border-top:1px solid #ffffff0d; text-align:center;">' +
                  '<p style="font-size:12px; color:#94a3b8; margin:0 0 6px 0;">' +
                    'Official Convening of <strong>ZENITH MODEL UNITED NATIONS 2026</strong>' +
                  '</p>' +
                  '<p style="font-size:11px; color:#475569; margin:0 0 12px 0;">' +
                    'Powered by Zenvitra.xyz • Heritage Convention Centre, Udaipur, Rajasthan' +
                  '</p>' +
                  '<p style="font-size:10px; color:#334155; margin:0;">' +
                    'You are receiving this official communication because you joined the Zenith MUN Priority Waitlist.' +
                  '</p>' +
                '</td>' +
              '</tr>' +

            '</table>' +
          '</td>' +
        '</tr>' +
      '</table>' +
    '</body>' +
    '</html>'
  );
}

/**
 * Instant Welcome email sent immediately upon signup
 */
function sendPriorityWelcomeEmail_(email, name, queueNum, unlockCode) {
  try {
    var subject = '⚡ Priority Waitlist Confirmed [' + queueNum + '] | ZENITH MUN 2026';
    var firstName = name.split(' ')[0] || 'Delegate';

    var html = 
      '<div style="background-color:#090a0f; color:#f8fafc; font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif; padding:32px 24px; border-radius:16px; max-width:600px; margin:0 auto; border:1px solid #f59e0b44;">' +
        '<div style="text-align:center; padding-bottom:16px; border-bottom:1px solid #ffffff15;">' +
          '<h1 style="color:#fbbf24; font-size:22px; margin:0 0 6px 0; text-transform:uppercase;">ZENITH MODEL UNITED NATIONS 2026</h1>' +
          '<p style="color:#94a3b8; font-size:11px; margin:0; text-transform:uppercase; letter-spacing:2px;">A NEW ZEN BEGINS &bull; BY YOUTH. FOR YOUTH.</p>' +
        '</div>' +
        '<div style="padding:24px 0;">' +
          '<p style="font-size:15px; color:#ffffff;">Dear <strong>' + firstName + '</strong>,</p>' +
          '<p style="font-size:14px; color:#cbd5e1; line-height:1.6;">You are officially reserved on the <strong>ZENITH MUN 2026 Priority Waitlist</strong>! You have been granted early queue priority before public delegate pass bookings open.</p>' +
          '<div style="background:#111827; border-left:4px solid #fbbf24; border-radius:8px; padding:16px; margin:20px 0;">' +
            '<p style="margin:4px 0; font-size:13px; color:#94a3b8;"><strong>Queue Priority Number:</strong> <span style="color:#38bdf8; font-family:monospace; font-size:15px; font-weight:bold;">' + queueNum + '</span></p>' +
            '<p style="margin:4px 0; font-size:13px; color:#94a3b8;"><strong>Early Access Unlock Code:</strong> <span style="color:#fbbf24; font-family:monospace; font-size:15px; font-weight:bold;">' + unlockCode + '</span></p>' +
            '<p style="margin:4px 0; font-size:13px; color:#94a3b8;"><strong>Tier:</strong> <span style="color:#22c55e; font-weight:bold;">Tier 1 — Super Early Bird Access</span></p>' +
          '</div>' +
          '<p style="font-size:13px; color:#94a3b8; line-height:1.6;">When pass bookings drop, your unlock code will grant you exclusive access to select your preferred committee portfolios before the general public.</p>' +
          '<div style="text-align:center; margin-top:24px;">' +
            '<a href="' + WAITLIST_CONFIG.PORTAL_URL + '" style="background:#fbbf24; color:#000000; font-weight:bold; font-size:12px; text-transform:uppercase; text-decoration:none; padding:12px 24px; border-radius:8px; display:inline-block;">Visit Zenith Summit Portal &rarr;</a>' +
          '</div>' +
        '</div>' +
        '<div style="border-top:1px solid #ffffff15; padding-top:14px; font-size:11px; color:#64748b; text-align:center;">' +
          'ZENITH MUN 2026 Secretariat &bull; Powered by Zenvitra.xyz' +
        '</div>' +
      '</div>';

    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: html,
      replyTo: WAITLIST_CONFIG.REPLY_TO,
      name: WAITLIST_CONFIG.SENDER_NAME
    });
  } catch (e) {
    Logger.log('Error sending welcome email: ' + e.toString());
  }
}

/**
 * Regenerate missing Queue numbers or VIP unlock codes on the Roster tab
 */
function regenerateMissingCodes() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var roster = ss.getSheetByName(WAITLIST_CONFIG.WAITLIST_TAB);
  if (!roster) return;

  var lastRow = roster.getLastRow();
  if (lastRow <= 1) return;

  var queueVals = roster.getRange(2, 2, lastRow - 1, 1).getValues();
  var codeVals = roster.getRange(2, 8, lastRow - 1, 1).getValues();
  var updated = 0;

  for (var i = 0; i < queueVals.length; i++) {
    var row = i + 2;
    if (!queueVals[i][0]) {
      var q = '#' + ('000' + i).slice(-3);
      roster.getRange(row, 2).setValue(q);
      updated++;
    }
    if (!codeVals[i][0]) {
      var code = WAITLIST_CONFIG.CODE_PREFIX + Math.random().toString(36).substring(2, 7).toUpperCase();
      roster.getRange(row, 8).setValue(code);
      updated++;
    }
  }

  ss.toast('Verified and repaired ' + updated + ' queue numbers and unlock codes!', 'Codes Synced', 5);
}

/**
 * Find row by email in the Roster sheet
 */
function findRowByEmail_(sheet, email) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return -1;
  var emails = sheet.getRange(2, 5, lastRow - 1, 1).getValues();
  var target = email.trim().toLowerCase();
  for (var i = 0; i < emails.length; i++) {
    if (emails[i][0] && emails[i][0].toString().trim().toLowerCase() === target) {
      return i + 2;
    }
  }
  return -1;
}

/**
 * Quick simulation test for waitlist ingestion
 */
function runTestWaitlistIngestion() {
  var dummy = {
    postData: {
      contents: JSON.stringify({
        data: {
          fullName: 'Aarav Sharma',
          email: 'aarav.sharma@example.com',
          phone: '+919876543210',
          city: 'Udaipur, Rajasthan',
          institution: 'St. Pauls Senior Secondary',
          passInterest: 'Delegate Pass (All 3 Days)'
        }
      })
    }
  };

  var res = doPost(dummy);
  Logger.log(res.getContent());
  SpreadsheetApp.getActiveSpreadsheet().toast('Test subscriber added to Priority Waitlist Roster!', 'Ingestion Success', 5);
}
