import fs from 'fs';
import path from 'path';

export interface SheetsIntegrationRecord {
  id: string;
  name: string;
  scope: 'GLOBAL' | 'EVENT' | 'FORM';
  eventId?: string;
  formId?: string;
  
  // Google Sheets Links & Identifiers
  sheetUrl: string;
  spreadsheetId: string;
  spreadsheetName?: string;
  gid?: string;
  
  // Apps Script Links & Identifiers
  scriptUrl: string;
  scriptId?: string;
  deploymentId?: string;
  webhookExecUrl: string;
  
  // ZENVITRA Endpoints
  inboundWebhookUrl: string;
  webhookSecret: string;
  
  // Integration Status
  status: 'CONNECTED' | 'PARTIAL' | 'DISCONNECTED' | 'ERROR';
  syncMode: 'BI_DIRECTIONAL' | 'OUTBOUND_ONLY' | 'INBOUND_ONLY';
  lastPingAt?: string;
  lastPingStatus?: 'SUCCESS' | 'FAILED';
  lastPingLatencyMs?: number;
  lastSyncedAt?: string;
  syncedRecordsCount: number;
  
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const INTEGRATIONS_FILE = path.join(DATA_DIR, 'sheets_integrations.json');

// In-memory cache for fast lookups
let inMemoryIntegrations: SheetsIntegrationRecord[] = [];
let isLoaded = false;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadIntegrations(): SheetsIntegrationRecord[] {
  if (isLoaded && inMemoryIntegrations.length > 0) {
    return inMemoryIntegrations;
  }
  ensureDataDir();
  if (fs.existsSync(INTEGRATIONS_FILE)) {
    try {
      const content = fs.readFileSync(INTEGRATIONS_FILE, 'utf-8');
      inMemoryIntegrations = JSON.parse(content);
      isLoaded = true;
      return inMemoryIntegrations;
    } catch (err) {
      console.warn('[SHEETS-INTEGRATIONS-LOAD-WARN]', err);
    }
  }
  inMemoryIntegrations = [];
  isLoaded = true;
  return inMemoryIntegrations;
}

function persistIntegrations(list: SheetsIntegrationRecord[]) {
  ensureDataDir();
  inMemoryIntegrations = list;
  isLoaded = true;
  try {
    fs.writeFileSync(INTEGRATIONS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('[SHEETS-INTEGRATIONS-SAVE-ERROR]', err);
  }
}

/**
 * 1. Robust Google Sheets URL Parser
 * Supports:
 * - https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0
 * - https://docs.google.com/spreadsheets/d/e/2PACX-1v.../pubhtml
 * - Bare 44-character spreadsheet ID
 */
export function parseGoogleSheetsUrl(rawUrl: string): {
  isValid: boolean;
  spreadsheetId: string;
  canonicalUrl: string;
  editUrl: string;
  exportCsvUrl: string;
  gid: string;
  error?: string;
} {
  const clean = (rawUrl || '').trim();
  if (!clean) {
    return {
      isValid: false,
      spreadsheetId: '',
      canonicalUrl: '',
      editUrl: '',
      exportCsvUrl: '',
      gid: '0',
      error: 'Google Sheets URL or Spreadsheet ID is required.',
    };
  }

  // Check if it's already a bare spreadsheet ID (alphanumeric, dashes, underscores, typically 40-50 chars)
  if (/^[a-zA-Z0-9-_]{20,60}$/.test(clean) && !clean.includes('/')) {
    const id = clean;
    return {
      isValid: true,
      spreadsheetId: id,
      canonicalUrl: `https://docs.google.com/spreadsheets/d/${id}`,
      editUrl: `https://docs.google.com/spreadsheets/d/${id}/edit`,
      exportCsvUrl: `https://docs.google.com/spreadsheets/d/${id}/export?format=csv`,
      gid: '0',
    };
  }

  // Regex match for /spreadsheets/d/{ID}
  const idMatch = clean.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/i);
  if (!idMatch || !idMatch[1]) {
    return {
      isValid: false,
      spreadsheetId: '',
      canonicalUrl: '',
      editUrl: '',
      exportCsvUrl: '',
      gid: '0',
      error: 'Invalid Google Sheets URL format. Expected: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/...',
    };
  }

  const spreadsheetId = idMatch[1];
  
  // Extract GID if present (#gid=12345 or ?gid=12345)
  const gidMatch = clean.match(/[#&?]gid=([0-9]+)/i);
  const gid = gidMatch && gidMatch[1] ? gidMatch[1] : '0';

  return {
    isValid: true,
    spreadsheetId,
    canonicalUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
    editUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=${gid}`,
    exportCsvUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`,
    gid,
  };
}

/**
 * 2. Robust Google Apps Script URL Parser
 * Supports:
 * - https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec
 * - https://script.google.com/home/projects/{PROJECT_ID}/edit
 * - https://script.google.com/d/{SCRIPT_ID}/edit
 * - Bare Deployment / Script ID
 */
export function parseAppsScriptUrl(rawUrl: string): {
  isValid: boolean;
  deploymentId: string;
  scriptId: string;
  webhookExecUrl: string;
  projectUrl: string;
  isExecUrl: boolean;
  error?: string;
} {
  const clean = (rawUrl || '').trim();
  if (!clean) {
    return {
      isValid: false,
      deploymentId: '',
      scriptId: '',
      webhookExecUrl: '',
      projectUrl: '',
      isExecUrl: false,
      error: 'Google Apps Script URL or Webhook Exec link is required.',
    };
  }

  // Match /macros/s/{DEPLOYMENT_ID}/exec
  const execMatch = clean.match(/\/macros\/s\/([a-zA-Z0-9-_]+)\/exec/i);
  if (execMatch && execMatch[1]) {
    const deploymentId = execMatch[1];
    return {
      isValid: true,
      deploymentId,
      scriptId: deploymentId,
      webhookExecUrl: `https://script.google.com/macros/s/${deploymentId}/exec`,
      projectUrl: `https://script.google.com/home/projects/${deploymentId}/edit`,
      isExecUrl: true,
    };
  }

  // Match /home/projects/{ID}/edit or /d/{ID}/edit
  const projectMatch = clean.match(/\/(?:home\/projects|d)\/([a-zA-Z0-9-_]+)/i);
  if (projectMatch && projectMatch[1]) {
    const scriptId = projectMatch[1];
    return {
      isValid: true,
      deploymentId: scriptId,
      scriptId,
      webhookExecUrl: `https://script.google.com/macros/s/${scriptId}/exec`,
      projectUrl: `https://script.google.com/home/projects/${scriptId}/edit`,
      isExecUrl: false, // User provided project link, not yet web app /exec
    };
  }

  // Bare alphanumeric ID
  if (/^[a-zA-Z0-9-_]{20,80}$/.test(clean) && !clean.includes('/')) {
    return {
      isValid: true,
      deploymentId: clean,
      scriptId: clean,
      webhookExecUrl: `https://script.google.com/macros/s/${clean}/exec`,
      projectUrl: `https://script.google.com/home/projects/${clean}/edit`,
      isExecUrl: true,
    };
  }

  return {
    isValid: false,
    deploymentId: '',
    scriptId: '',
    webhookExecUrl: '',
    projectUrl: '',
    isExecUrl: false,
    error: 'Invalid Google Apps Script URL format. Expected: https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec or project edit link.',
  };
}

/**
 * 3. Live Handshake Probe: Tests bidirectional connectivity to the Apps Script
 */
export async function testAppsScriptHandshake(
  webhookExecUrl: string,
  spreadsheetId?: string
): Promise<{
  reachable: boolean;
  statusCode?: number;
  latencyMs: number;
  responsePreview?: string;
  isZenvitraEngine: boolean;
  error?: string;
}> {
  const startTime = Date.now();
  try {
    const probePayload = {
      action: 'PING',
      target: 'HEALTH_CHECK',
      source: 'ZENVITRA_SYSTEM_API',
      spreadsheetId: spreadsheetId || undefined,
      timestamp: new Date().toISOString(),
    };

    const res = await fetch(webhookExecUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(probePayload),
      redirect: 'follow',
      cache: 'no-store',
    });

    const latencyMs = Date.now() - startTime;
    const text = await res.text();
    const isZenvitra = text.toLowerCase().includes('zenvitra') || text.includes('SUCCESS') || text.includes('pong') || res.status === 200 || res.status === 302;

    return {
      reachable: res.status < 500,
      statusCode: res.status,
      latencyMs,
      responsePreview: text.slice(0, 200),
      isZenvitraEngine: isZenvitra,
    };
  } catch (err: any) {
    return {
      reachable: false,
      latencyMs: Date.now() - startTime,
      error: err?.message || 'Failed to reach Apps Script deployment',
      isZenvitraEngine: false,
    };
  }
}

/**
 * 4. Generates the Complete, Seamless Integrated Google Apps Script Code
 */
export function generateIntegratedAppsScriptCode(params: {
  spreadsheetId: string;
  spreadsheetUrl: string;
  webhookEndpoint: string;
  webhookSecret: string;
  eventName?: string;
  eventId?: string;
}): string {
  const { spreadsheetId, spreadsheetUrl, webhookEndpoint, webhookSecret, eventName, eventId } = params;

  return `/**
 * ==============================================================================
 * ZENVITRA MASTER OMNI-STREAM TELEMETRY & TWO-WAY ENGINE (v2.5)
 * ==============================================================================
 * Target Spreadsheet: ${spreadsheetUrl}
 * Spreadsheet ID: ${spreadsheetId}
 * Convening / Context: ${eventName || eventId || 'ZENVITRA Core Ecosystem'}
 * Inbound Webhook: ${webhookEndpoint}
 * Generated: ${new Date().toISOString()}
 * ==============================================================================
 * 
 * 🚀 QUICK SETUP INSTRUCTIONS:
 * 1. In your Google Sheet, click "Extensions" -> "Apps Script".
 * 2. Delete ALL existing code and PASTE this entire script.
 * 3. Click "Save" (Ctrl+S / Cmd+S).
 * 4. Select function "initAllTabs" from the top dropdown and click "Run".
 *    (Accept permissions: Advanced -> Go to project -> Allow).
 * 5. Run "setupZenvitraTriggers" once from toolbar to enable live 2-way sync!
 * 6. Click "Deploy" (top right) -> "New deployment" -> "Web app":
 *    - Description: Zenvitra Integration
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (CRITICAL: must be Anyone!)
 * 7. Copy the Web App URL and paste it into ZENVITRA.
 * ==============================================================================
 */

var ZENVITRA_CONFIG = {
  VERSION: "v2.5.0",
  SPREADSHEET_ID: "${spreadsheetId}",
  WEBHOOK_INBOUND_URL: "${webhookEndpoint}",
  WEBHOOK_SECRET: "${webhookSecret}",
  EVENT_ID: "${eventId || 'ZEN_MASTER_GLOBAL'}",
  TIMEZONE: "Asia/Kolkata",
  C: {
    OBSIDIAN: "#0f172a",
    WHITE: "#ffffff"
  }
};

var TAB_SCHEMAS = {
  REGISTER_CORE: {
    sheetName: 'Register Data Core',
    companionName: '02 Core Registrations',
    headers: [
      'Timestamp', 'User ID / Person ID', 'Full Legal Name', 'Display Name / Username', 'Primary Email Address',
      'Phone Number [Optional]', 'Age (Years)', 'Minor Status (Under 18 / Adult)', 'Parent / Guardian Full Name',
      'Parent / Guardian Emergency Contact', 'Minor Consent & Parental Accord', 'Role Designation', 'Access Level',
      'Auth Provider', 'Institution / School / University', 'Country & City', 'Registration Type',
      'Registration Status (REGISTER / PREREGISTER)', 'Terms & Privacy Ratification', 'Account Status', 'IP Address', 'Device / Browser'
    ]
  },
  LOGIN_CORE: {
    sheetName: 'Login Data Core',
    companionName: '03 Login Activity',
    headers: [
      'Timestamp', 'Login Event ID', 'User ID / Person ID', 'Full Name', 'Email Address', 'Username / Handle',
      'Auth Provider', 'Event Type', 'Login Status / Outcome', 'Risk Score', 'Session Hash', 'IP Address (Masked)', 'Device / User Agent Summary'
    ]
  },
  EVENTS: {
    sheetName: 'Event Registrations',
    companionName: '12 Event Registrations',
    headers: [
      'Timestamp', 'Registration ID / Ticket ID', 'Full Name of the Delegate', 'Primary Contact Email Address',
      'WhatsApp / Calling Number', 'School / College / University or Independent', 'Current City & State of Residence',
      'Participation Track', 'Selected Delegation Pass Tier', 'Total Pass Fee (INR)', 'Preferred Payment Mode',
      '12-Digit UPI Transaction ID / UTR Number', 'Upload Payment Screenshot / Receipt Proof URL', 'Digital Signature (Full Legal Name)',
      'Date of Submission', 'Payment Verification Status', 'Allocated Committee', 'Allocated Seat / Portfolio',
      'Dais Review Status', 'Dais Review Notes', 'IP Address', 'Device / Browser'
    ]
  },
  CAMPUS_AMBASSADOR: {
    sheetName: 'Campus Ambassadors',
    companionName: '10 Campus Ambassadors',
    headers: [
      'Timestamp', 'Ambassador Application ID', 'Full Legal Name', 'Primary Contact Email', 'WhatsApp / Calling Phone Number',
      'College / University / School Name', 'City & State of Residence', 'Degree, Stream & Academic Year',
      'Leadership Experience', 'Proposed Strategy & Outreach Plan', 'Approval Status', 'Reviewer Notes', 'IP Address', 'Device / Browser'
    ]
  },
  CORE_TEAM: {
    sheetName: 'Core Team Applications',
    companionName: '04 Team Applications',
    headers: [
      'Timestamp', 'Application ID', 'Full Legal Name', 'Zenvitra Sovereign Username (@handle)', 'Primary Email Address',
      'WhatsApp Phone Number', 'Role Applied For', 'Primary Department Choice', 'Portfolio / Proof of Work URL',
      'Strategic Vision & Impact Statement', 'Weekly Bandwidth Commitment', 'Application Status', 'Reviewer / Directorate Notes', 'IP Address', 'Device / Browser'
    ]
  },
  CONTACT: {
    sheetName: 'Contact Inquiries',
    companionName: '06 Contact Inquiries',
    headers: [
      'Timestamp', 'Inquiry ID', 'Full Legal Name', 'Primary Contact Email', 'Contact Phone Number',
      'Subject / Topic', 'Query Category', 'Message / Inquiry Details', 'Source Page URL', 'Inquiry Status', 'IP Address', 'Device / Browser'
    ]
  },
  NEWSLETTER: {
    sheetName: 'Newsletter Subscribers',
    companionName: '07 Newsletter Subscribers',
    headers: ['Timestamp', 'Subscriber ID', 'Subscriber Email Address', 'Subscription Source / Page', 'Marketing & Consent Accord', 'UTM Campaign Track', 'Subscription Status', 'IP Address']
  },
  DONATIONS: {
    sheetName: 'Donations',
    companionName: '20 Donations Charity',
    headers: [
      'Timestamp', 'Donation ID / Contribution ID', 'Contributor / Donor Full Name', 'Contributor Email Address',
      'Phone Number [WhatsApp Active]', 'Voluntary Contribution Amount (INR)', '12-Digit UPI UTR / Transaction Reference ID',
      'Target Project / Relief Stream', 'Payment Mode / Channel', 'Anonymous Contribution Preference',
      'Contributor Notes / Dedication / Prayer', 'Payment Screenshot / Receipt Proof URL', 'Verification & Audit Status', 'IP Address', 'Device / Browser'
    ]
  },
  COLLAB: {
    sheetName: 'Collab & Partnerships',
    companionName: '08 Collaborations',
    headers: [
      'Timestamp', 'Partnership ID', 'Organization / Institution Name', 'Lead Representative Name', 'Official Contact Email',
      'Phone / WhatsApp Number', 'Collaboration Type / Scope', 'Proposal Summary & Objectives', 'Budget / Resource Commitment', 'Partnership Pipeline Stage', 'IP Address', 'Device / Browser'
    ]
  },
  COMMUNITY: {
    sheetName: 'Community Members',
    companionName: '09 Community Members',
    headers: [
      'Timestamp', 'Member ID', 'Full Legal Name', 'Email Address', 'Location (City & Country)', 'Institution / College / Affiliation',
      'Primary Skills & Expertise', 'Areas of Platform Interest', 'Discord / Telegram Handle', 'Membership Verification Status', 'IP Address', 'Device / Browser'
    ]
  },
  FEEDBACK: {
    sheetName: 'Feedback & Grievance',
    companionName: '23 Feedback',
    headers: [
      'Timestamp', 'Ticket ID', 'Submitter Full Name', 'Contact Email Address', 'Feedback Category',
      'Severity / Priority Rank', 'Target URL / Feature Name', 'Feedback Description / Grievance Details', 'Attachment / Screenshot URL', 'Resolution Status', 'IP Address', 'Device / Browser'
    ]
  },
  FORMS: {
    sheetName: 'Form Submissions',
    companionName: '45 Form Submissions',
    headers: [
      'Timestamp', 'Submission ID', 'Form ID', 'Form Title', 'Submitter Name', 'Submitter Email', 'Submitter Handle (@tag)', 'Raw Submission Payload', 'IP Address', 'Device / Browser'
    ]
  }
};

function initAllTabs() {
  var ss = getOrCreateSpreadsheet_();
  var created = [];

  for (var key in TAB_SCHEMAS) {
    if (TAB_SCHEMAS.hasOwnProperty(key)) {
      var sch = TAB_SCHEMAS[key];
      var sh = getOrCreateTabWithHeaders_(ss, sch.sheetName, sch.headers);
      if (sh) created.push(sch.sheetName);

      if (sch.companionName && sch.companionName !== sch.sheetName) {
        var compSh = getOrCreateTabWithHeaders_(ss, sch.companionName, sch.headers);
        if (compSh) created.push(sch.companionName);
      }
    }
  }

  var peopleHeaders = ['Person ID', 'Full Name', 'Display Name', 'Email Address', 'Phone Number', 'Username / Handle', 'Account Type', 'Account Status', 'Country & City', 'Created At'];
  getOrCreateTabWithHeaders_(ss, '01 People', peopleHeaders);

  var defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch (e) {}
  }

  try { SpreadsheetApp.getActiveSpreadsheet().toast('Zenvitra tabs initialized! ' + created.length + ' tabs ready with Row 1 headers.', '⚡ Setup Complete', 6); } catch (e) {}

  return { ok: true, tabsConfigured: created.length };
}

function getOrCreateTabWithHeaders_(ss, sheetName, headers) {
  var sh = getSheetLoose_(ss, sheetName);
  var isNew = false;
  if (!sh) {
    sh = ss.insertSheet(sheetName);
    isNew = true;
  }
  if (isNew || sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    formatHeaderRow_(sh, headers.length);
  }
  return sh;
}

function formatHeaderRow_(sheet, colCount) {
  try {
    var range = sheet.getRange(1, 1, 1, colCount);
    range.setBackground(ZENVITRA_CONFIG.C.OBSIDIAN);
    range.setFontColor(ZENVITRA_CONFIG.C.WHITE);
    range.setFontWeight('bold');
    range.setFontFamily('Roboto Mono');
    range.setFontSize(10);
    sheet.setFrozenRows(1);
  } catch (e) {}
}

function smartAppendRow_(sheet, rowData) {
  var lastRow = sheet.getLastRow();
  var targetRow = lastRow + 1;
  if (targetRow <= 1) targetRow = 2;
  sheet.getRange(targetRow, 1, 1, rowData.length).setValues([rowData]);
  return targetRow;
}

function setupZenvitraTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  ScriptApp.newTrigger("handleZenvitraSheetEdit")
    .forSpreadsheet(getOrCreateSpreadsheet_())
    .onEdit()
    .create();

  try {
    SpreadsheetApp.getActiveSpreadsheet().toast("ZENVITRA Sync Trigger installed successfully!", "Integration Active", 5);
  } catch (e) {}
}

function handleZenvitraSheetEdit(e) {
  if (!e || !e.range) return;
  var sheet = e.range.getSheet();
  var sheetName = sheet.getName();
  var row = e.range.getRow();
  var col = e.range.getColumn();
  if (row <= 1) return;

  var header = sheet.getRange(1, col).getValue();
  var recordId = sheet.getRange(row, 1).getValue();
  var oldValue = e.oldValue !== undefined ? e.oldValue : null;
  var newValue = e.value !== undefined ? e.value : e.range.getValue();

  var payload = {
    eventId: ZENVITRA_CONFIG.EVENT_ID,
    webhookSecret: ZENVITRA_CONFIG.WEBHOOK_SECRET,
    tabName: sheetName,
    row: row,
    columnHeader: String(header),
    recordId: String(recordId),
    oldValue: oldValue,
    newValue: newValue,
    timestamp: new Date().toISOString()
  };

  try {
    UrlFetchApp.fetch(ZENVITRA_CONFIG.WEBHOOK_INBOUND_URL, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
  } catch (err) {}
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: "Empty body" })).setMimeType(ContentService.MimeType.JSON);
    }
    var payload = JSON.parse(e.postData.contents);
    var ss = getOrCreateSpreadsheet_();

    if (payload.action === "PING") {
      return ContentService.createTextOutput(JSON.stringify({ status: "SUCCESS", message: "ZENVITRA Online" })).setMimeType(ContentService.MimeType.JSON);
    }
    if (payload.action === "INIT" || payload.action === "INIT_TABS") {
      return ContentService.createTextOutput(JSON.stringify(initAllTabs())).setMimeType(ContentService.MimeType.JSON);
    }

    var rawTab = payload.targetTab || payload.sheetTab || payload.tab || 'Register Data Core';
    var schemaKey = resolveSchemaKey_(rawTab);
    var targetTabName = 'Register Data Core';
    var companionTabName = '02 Core Registrations';
    var expectedHeaders = TAB_SCHEMAS.REGISTER_CORE.headers;

    if (schemaKey && TAB_SCHEMAS[schemaKey]) {
      targetTabName = TAB_SCHEMAS[schemaKey].sheetName;
      companionTabName = TAB_SCHEMAS[schemaKey].companionName;
      expectedHeaders = TAB_SCHEMAS[schemaKey].headers;
    }

    var targetSheet = getOrCreateTabWithHeaders_(ss, targetTabName, expectedHeaders);
    var currentHeaders = targetSheet.getRange(1, 1, 1, targetSheet.getLastColumn()).getValues()[0];

    // Dynamic column expansion for custom question keys
    var ignored = { action: true, targetTab: true, sheetTab: true, tab: true, secret: true };
    var missingHeaders = [];
    for (var k in payload) {
      if (payload.hasOwnProperty(k) && !ignored[k]) {
        var pVal = payload[k];
        if (pVal !== "" && pVal !== null && pVal !== undefined && typeof pVal !== "object") {
          var normK = k.toLowerCase().replace(/[^a-z0-9]/g, "");
          var found = currentHeaders.some(function(ch) { return ch.toLowerCase().replace(/[^a-z0-9]/g, "") === normK; });
          if (!found && currentHeaders.length < 50) missingHeaders.push(k);
        }
      }
    }
    if (missingHeaders.length > 0) {
      targetSheet.getRange(1, currentHeaders.length + 1, 1, missingHeaders.length).setValues([missingHeaders]);
      formatHeaderRow_(targetSheet, currentHeaders.length + missingHeaders.length);
      currentHeaders = currentHeaders.concat(missingHeaders);
    }

    var targetRow = currentHeaders.map(function(h) { return safe_(lookupVal_(payload, h)); });
    var writtenRow = smartAppendRow_(targetSheet, targetRow);

    if (companionTabName && companionTabName !== targetTabName) {
      try {
        var compSheet = getOrCreateTabWithHeaders_(ss, companionTabName, expectedHeaders);
        if (compSheet && compSheet.getSheetId() !== targetSheet.getSheetId()) {
          var cHeaders = compSheet.getRange(1, 1, 1, compSheet.getLastColumn()).getValues()[0];
          var cRow = cHeaders.map(function(ch) { return safe_(lookupVal_(payload, ch)); });
          smartAppendRow_(compSheet, cRow);
        }
      } catch (ce) {}
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true, status: "success", tab: targetTabName, row: writtenRow })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

function doGet(e) {
  var ss = getOrCreateSpreadsheet_();
  return ContentService.createTextOutput(JSON.stringify({ ok: true, status: "ONLINE", url: ss.getUrl() })).setMimeType(ContentService.MimeType.JSON);
}

function resolveSchemaKey_(raw) {
  if (!raw) return null;
  var s = String(raw).toUpperCase().trim();
  if (s.indexOf('REGISTER') !== -1 || s.indexOf('CORE REG') !== -1) return 'REGISTER_CORE';
  if (s.indexOf('LOGIN') !== -1 || s.indexOf('AUTH') !== -1) return 'LOGIN_CORE';
  if (s.indexOf('EVENT') !== -1 || s.indexOf('PASS') !== -1 || s.indexOf('TICKET') !== -1) return 'EVENTS';
  if (s.indexOf('AMBASSADOR') !== -1 || s.indexOf('CAMPUS') !== -1) return 'CAMPUS_AMBASSADOR';
  if (s.indexOf('CORE TEAM') !== -1 || s.indexOf('TEAM APPL') !== -1) return 'CORE_TEAM';
  if (s.indexOf('CONTACT') !== -1 || s.indexOf('INQUIR') !== -1) return 'CONTACT';
  if (s.indexOf('NEWSLETTER') !== -1 || s.indexOf('SUBSCRIB') !== -1) return 'NEWSLETTER';
  if (s.indexOf('COLLAB') !== -1 || s.indexOf('PARTNER') !== -1) return 'COLLAB';
  if (s.indexOf('COMMUNITY') !== -1) return 'COMMUNITY';
  if (s.indexOf('DONAT') !== -1) return 'DONATIONS';
  if (s.indexOf('FEEDBACK') !== -1 || s.indexOf('GRIEVANCE') !== -1) return 'FEEDBACK';
  if (s.indexOf('FORM') !== -1 || s.indexOf('SUBMISSION') !== -1) return 'FORMS';
  return null;
}

function lookupVal_(data, header) {
  if (!data || !header) return "";
  if (data[header] !== undefined && data[header] !== null && data[header] !== "") return data[header];

  var hLower = String(header).toLowerCase();
  for (var k in data) {
    if (data.hasOwnProperty(k) && k.toLowerCase() === hLower) {
      if (data[k] !== undefined && data[k] !== null && data[k] !== "") return data[k];
    }
  }

  var hAlpha = hLower.replace(/[^a-z0-9]/g, "");
  for (var k2 in data) {
    if (data.hasOwnProperty(k2)) {
      if (k2.toLowerCase().replace(/[^a-z0-9]/g, "") === hAlpha && data[k2] !== undefined && data[k2] !== null && data[k2] !== "") {
        return data[k2];
      }
    }
  }

  if (hAlpha.indexOf("timestamp") !== -1 || hAlpha.indexOf("date") !== -1) {
    return data.timestamp || data.submissionDate || Utilities.formatDate(new Date(), ZENVITRA_CONFIG.TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
  }
  if (hAlpha.indexOf("username") !== -1 || hAlpha.indexOf("handle") !== -1 || hAlpha.indexOf("displayname") !== -1) {
    var rawHandle = data.username || data.preferredHandle || data.handle || data.displayName || data.submitterHandle || "";
    if (rawHandle) return (String(rawHandle).startsWith('@') ? '' : '@') + String(rawHandle).replace(/[^a-zA-Z0-9_]/g, '');
    return data.email ? '@' + String(data.email).split('@')[0] : '';
  }
  if (hAlpha.indexOf("userid") !== -1 || hAlpha.indexOf("personid") !== -1) {
    return data.userId || data.personId || data.id || ('ZV-USR-' + Math.random().toString(36).substring(2, 8).toUpperCase());
  }
  if (hAlpha.indexOf("name") !== -1 && hAlpha.indexOf("parent") === -1 && hAlpha.indexOf("guardian") === -1) {
    return data.fullName || data.legalName || data.name || data.participantName || "Sovereign Citizen";
  }
  if (hAlpha.indexOf("email") !== -1 && hAlpha.indexOf("guardian") === -1) {
    return data.email || data.primaryEmail || data.participantEmail || "";
  }
  if (hAlpha.indexOf("phone") !== -1 || hAlpha.indexOf("whatsapp") !== -1 || hAlpha.indexOf("calling") !== -1 || hAlpha.indexOf("contactnumber") !== -1) {
    return data.phoneNumber || data.phone || data.contactNumber || "N/A";
  }
  if (hAlpha.indexOf("age") !== -1 && hAlpha.indexOf("minor") === -1) {
    return data.age !== undefined && data.age !== null ? String(data.age) : "";
  }
  if (hAlpha.indexOf("minorstatus") !== -1 || (hAlpha.indexOf("minor") !== -1 && hAlpha.indexOf("status") !== -1)) {
    if (data.minorStatus) return data.minorStatus;
    return Number(data.age) < 18 ? "MINOR (<18)" : "ADULT (18+)";
  }
  if (hAlpha.indexOf("parent") !== -1 || hAlpha.indexOf("guardian") !== -1) {
    if (hAlpha.indexOf("contact") !== -1 || hAlpha.indexOf("phone") !== -1 || hAlpha.indexOf("emergency") !== -1) {
      return data.parentContact || data.parentGuardianContact || (Number(data.age) < 18 ? "PENDING_CONTACT" : "N/A (ADULT 18+)");
    }
    return data.parentName || data.parentGuardianName || (Number(data.age) < 18 ? "PENDING_GUARDIAN" : "N/A (ADULT 18+)");
  }
  if (hAlpha.indexOf("roledesignation") !== -1 || hAlpha.indexOf("role") !== -1 || hAlpha.indexOf("track") !== -1) {
    return data.roleDesignation || data.roleInterest || data.preferredTrack || data.initialRole || data.roleAppliedFor || data.ticketPassType || "Student Delegate";
  }
  if (hAlpha.indexOf("accesslevel") !== -1) {
    return data.accessLevel || (String(data.registrationStatus || data.registrationType || '').toUpperCase().includes('PRE') ? 'Pre-Registered Sovereign Whitelist' : 'Direct Member');
  }
  if (hAlpha.indexOf("authprovider") !== -1 || hAlpha.indexOf("provider") !== -1) {
    return data.authProvider || data.provider || "DIRECT_ENROLL";
  }
  if (hAlpha.indexOf("institution") !== -1 || hAlpha.indexOf("school") !== -1 || hAlpha.indexOf("college") !== -1) {
    return data.institution || data.institutionOrSchool || data.collegeUniversityName || "Independent";
  }
  if (hAlpha.indexOf("city") !== -1 || hAlpha.indexOf("country") !== -1 || hAlpha.indexOf("location") !== -1) {
    return data.countryCity || data.cityState || data.city || "Pan-India / Global";
  }
  if (hAlpha.indexOf("registrationstatus") !== -1 || hAlpha.indexOf("registrationtype") !== -1 || hAlpha.indexOf("preregister") !== -1) {
    var rawReg = String(data.registrationStatus || data.registrationType || data.accessLevel || "").toUpperCase();
    return rawReg.indexOf("PRE") !== -1 ? "PREREGISTER" : "REGISTER";
  }
  if (hAlpha.indexOf("terms") !== -1 || hAlpha.indexOf("ratification") !== -1) {
    return (data.termsRatified || data.termsAccepted) ? "RATIFIED" : "PENDING";
  }
  if (hAlpha.indexOf("status") !== -1) {
    return data.accountStatus || data.approvalStatus || data.paymentStatus || "ACTIVE";
  }
  if (hAlpha.indexOf("ticketid") !== -1 || hAlpha.indexOf("registrationid") !== -1 || hAlpha.indexOf("applicationid") !== -1 || hAlpha.indexOf("id") !== -1) {
    return data.ticketId || data.registrationId || data.applicationId || ('ZV-' + Math.random().toString(36).substring(2, 8).toUpperCase());
  }
  if (hAlpha.indexOf("fee") !== -1 || hAlpha.indexOf("amount") !== -1 || hAlpha.indexOf("price") !== -1) {
    return data.totalPrice !== undefined ? String(data.totalPrice) : (data.amountInr !== undefined ? String(data.amountInr) : "0");
  }
  if (hAlpha.indexOf("ip") !== -1) return data.ipAddress || data.ip || "127.0.0.1";
  if (hAlpha.indexOf("device") !== -1 || hAlpha.indexOf("browser") !== -1) return data.deviceInfo || data.deviceBrowserInfo || data.userAgent || "Web Browser";

  return "";
}

function getSheetLoose_(ss, name) {
  if (!ss || !name) return null;
  var target = String(name).trim();
  var sh = ss.getSheetByName(target);
  if (sh) return sh;

  var spaceName = target.replace(/_/g, " ").replace(/\s+/g, " ").trim();
  sh = ss.getSheetByName(spaceName);
  if (sh) return sh;

  var sheets = ss.getSheets();
  var normTarget = target.toLowerCase().replace(/[^a-z0-9]/g, "");
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getName().toLowerCase().replace(/[^a-z0-9]/g, "") === normTarget) return sheets[i];
  }
  var stripped = target.replace(/^\d+[\s_-]*/, "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  if (stripped) {
    for (var j = 0; j < sheets.length; j++) {
      if (sheets[j].getName().replace(/^\d+[\s_-]*/, "").trim().toLowerCase().replace(/[^a-z0-9]/g, "") === stripped) return sheets[j];
    }
  }
  return null;
}

function getOrCreateSpreadsheet_() {
  var ss = null;
  try { ss = SpreadsheetApp.getActiveSpreadsheet(); } catch (e) {}
  if (!ss && ZENVITRA_CONFIG.SPREADSHEET_ID) {
    try { ss = SpreadsheetApp.openById(ZENVITRA_CONFIG.SPREADSHEET_ID); } catch (e) {}
  }
  return ss || SpreadsheetApp.getActiveSpreadsheet();
}

function safe_(val) {
  if (val === null || val === undefined) return "";
  return val;
}
`;
}

export async function saveSheetsIntegration(params: {
  sheetUrl: string;
  scriptUrl: string;
  name?: string;
  scope?: 'GLOBAL' | 'EVENT' | 'FORM';
  eventId?: string;
  formId?: string;
  syncMode?: 'BI_DIRECTIONAL' | 'OUTBOUND_ONLY' | 'INBOUND_ONLY';
  hostUrl?: string;
}): Promise<{
  success: boolean;
  integration: SheetsIntegrationRecord;
  integratedCode: string;
  handshake: any;
}> {
  const { sheetUrl, scriptUrl, name, scope = 'GLOBAL', eventId, formId, syncMode = 'BI_DIRECTIONAL', hostUrl } = params;

  // 1. Parse Google Sheet Link
  const parsedSheet = parseGoogleSheetsUrl(sheetUrl);
  if (!parsedSheet.isValid) {
    throw new Error(parsedSheet.error || 'Invalid Google Sheets Link.');
  }

  // 2. Parse Apps Script Link
  const parsedScript = parseAppsScriptUrl(scriptUrl);
  if (!parsedScript.isValid) {
    throw new Error(parsedScript.error || 'Invalid Google Apps Script Link.');
  }

  // 3. Resolve host and endpoints
  const cleanHost = hostUrl || process.env.NEXTAUTH_URL || 'https://zenvitra.org';
  const inboundWebhookUrl = `${cleanHost}/api/sheets/inbound`;
  const webhookSecret = `zs_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;

  // 4. Test live handshake to Apps Script
  const handshake = await testAppsScriptHandshake(parsedScript.webhookExecUrl, parsedSheet.spreadsheetId);

  // 5. Generate integrated code
  const integratedCode = generateIntegratedAppsScriptCode({
    spreadsheetId: parsedSheet.spreadsheetId,
    spreadsheetUrl: parsedSheet.canonicalUrl,
    webhookEndpoint: inboundWebhookUrl,
    webhookSecret,
    eventName: name || (eventId ? `Event: ${eventId}` : 'ZENVITRA Master Ecosystem'),
    eventId: eventId || 'ZEN_MASTER',
  });

  const now = new Date().toISOString();
  const id = `int_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const record: SheetsIntegrationRecord = {
    id,
    name: name || `Integration for ${parsedSheet.spreadsheetId.slice(0, 8)}...`,
    scope,
    eventId,
    formId,
    sheetUrl: parsedSheet.editUrl,
    spreadsheetId: parsedSheet.spreadsheetId,
    gid: parsedSheet.gid,
    scriptUrl: parsedScript.webhookExecUrl,
    scriptId: parsedScript.scriptId,
    deploymentId: parsedScript.deploymentId,
    webhookExecUrl: parsedScript.webhookExecUrl,
    inboundWebhookUrl,
    webhookSecret,
    status: handshake.reachable ? 'CONNECTED' : 'PARTIAL',
    syncMode,
    lastPingAt: now,
    lastPingStatus: handshake.reachable ? 'SUCCESS' : 'FAILED',
    lastPingLatencyMs: handshake.latencyMs,
    syncedRecordsCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  // 6. Persist to integrations file
  const existing = loadIntegrations();
  const filtered = existing.filter((item) => {
    if (scope === 'GLOBAL' && item.scope === 'GLOBAL') return false;
    if (eventId && item.eventId === eventId) return false;
    if (formId && item.formId === formId) return false;
    return true;
  });

  filtered.unshift(record);
  persistIntegrations(filtered);

  return {
    success: true,
    integration: record,
    integratedCode,
    handshake,
  };
}

/**
 * 6. Get currently active integration for a given scope or event
 */
export function getActiveIntegration(scopeOrEventId?: string): SheetsIntegrationRecord | null {
  const list = loadIntegrations();
  if (list.length === 0) return null;

  if (scopeOrEventId) {
    const match = list.find(
      (item) => item.eventId === scopeOrEventId || item.formId === scopeOrEventId || item.id === scopeOrEventId
    );
    if (match) return match;
  }

  // Fallback to global integration or latest configured
  const globalInt = list.find((item) => item.scope === 'GLOBAL');
  return globalInt || list[0] || null;
}

/**
 * 7. List all integrations
 */
export function listAllIntegrations(): SheetsIntegrationRecord[] {
  return loadIntegrations();
}

/**
 * 8. Remove an integration
 */
export function deleteIntegration(id: string): boolean {
  const list = loadIntegrations();
  const next = list.filter((item) => item.id !== id && item.spreadsheetId !== id);
  persistIntegrations(next);
  return next.length < list.length;
}
