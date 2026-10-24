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
 * ZENVITRA × GOOGLE SHEETS UNIFIED TWO-WAY INTEGRATION ENGINE
 * ==============================================================================
 * Target Spreadsheet: ${spreadsheetUrl}
 * Spreadsheet ID: ${spreadsheetId}
 * Convening / Context: ${eventName || eventId || 'ZENVITRA Core Ecosystem'}
 * Webhook Inbound: ${webhookEndpoint}
 * Generated: ${new Date().toISOString()}
 * ==============================================================================
 * 
 * SETUP INSTRUCTIONS (Takes ~45 seconds):
 * 1. In your Google Sheet, click "Extensions" > "Apps Script".
 * 2. Delete any existing code and PASTE this entire script.
 * 3. Click "Save" (Floppy disk icon or Ctrl+S / Cmd+S).
 * 4. Run "setupZenvitraTriggers" once from the toolbar to enable live 2-way sync!
 * 5. (Optional) Run "initAllTabs" to automatically create and format all Core Registers!
 * 6. Click "Deploy" > "New deployment" > "Web app"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 7. Copy the Web App URL and paste it in ZENVITRA.
 * ==============================================================================
 */

var ZENVITRA_CONFIG = {
  VERSION: "v2.6-OMNI",
  SPREADSHEET_ID: "${spreadsheetId}",
  WEBHOOK_INBOUND_URL: "${webhookEndpoint}",
  WEBHOOK_SECRET: "${webhookSecret}",
  EVENT_ID: "${eventId || 'ZEN_MASTER_GLOBAL'}",
  TIMEZONE: "Asia/Kolkata",
  HEADER_ROW: 1,
  DATA_START_ROW: 2,
};

/**
 * HTTP POST: Handles incoming records from ZENVITRA directly into Google Sheets tabs
 */
function doPost(e) {
  try {
    var raw = e && e.postData && e.postData.contents ? e.postData.contents : "{}";
    var payload = JSON.parse(raw);
    var ss = SpreadsheetApp.openById(ZENVITRA_CONFIG.SPREADSHEET_ID);
    
    // Handshake ping check
    if (payload.action === "PING" || payload.target === "HEALTH_CHECK") {
      return ContentService.createTextOutput(JSON.stringify({
        status: "SUCCESS",
        message: "ZENVITRA Integration Active & Healthy",
        spreadsheetId: ZENVITRA_CONFIG.SPREADSHEET_ID,
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Auto-initialize tabs command
    if (payload.action === "INIT_TABS") {
      var tabCount = initAllTabs();
      return ContentService.createTextOutput(JSON.stringify({
        status: "SUCCESS",
        message: "Initialized " + tabCount + " tabs in Google Sheet.",
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Resolve target tab name (clean title case, zero numbers, zero underscores)
    var tabName = (payload.targetTab || payload.tab || "Core Registrations").toString().replace(/^\d+[\s_-]*/, "").replace(/_/g, " ").trim();
    var sheet = ss.getSheetByName(tabName);
    
    // Auto-create tab if missing
    if (!sheet) {
      sheet = ss.insertSheet(tabName);
      sheet.setTabColor("#0F766E");
    }

    // Extract headers from Row 1
    var lastCol = Math.max(sheet.getLastColumn(), 1);
    var headers = [];
    if (sheet.getLastRow() >= 1) {
      headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    }

    // If tab is empty, seed headers dynamically from payload keys
    var dataObj = payload.data || payload;
    var keys = Object.keys(dataObj).filter(function(k) { return k !== "targetTab" && k !== "tab" && k !== "action"; });

    if (headers.length === 0 || !headers[0]) {
      headers = ["Timestamp", "Record ID"].concat(keys);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#0f172a").setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }

    // Build row values matching headers
    var rowValues = [];
    for (var i = 0; i < headers.length; i++) {
      var headerName = headers[i].toString().toLowerCase().trim();
      var val = "";

      if (headerName === "timestamp" || headerName === "date") {
        val = payload.timestamp || dataObj.timestamp || new Date().toISOString();
      } else if (headerName === "record id" || headerName === "id") {
        val = dataObj.id || dataObj.recordId || dataObj.registrationId || "REC-" + Utilities.getUuid().substring(0, 8).toUpperCase();
      } else {
        // Find matching key case-insensitively
        for (var k in dataObj) {
          if (k.toLowerCase().trim() === headerName || headerName.indexOf(k.toLowerCase()) !== -1) {
            val = dataObj[k];
            break;
          }
        }
      }

      if (typeof val === "object" && val !== null) {
        val = JSON.stringify(val);
      }
      rowValues.push(val !== undefined && val !== null ? val : "");
    }

    // Append row
    sheet.appendRow(rowValues);

    return ContentService.createTextOutput(JSON.stringify({
      status: "SUCCESS",
      tab: tabName,
      row: sheet.getLastRow(),
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "ERROR",
      error: err.message,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * HTTP GET: Returns query status or attendee rosters
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "PING";
  
  if (action === "INIT") {
    var tabsCreated = initAllTabs();
    return ContentService.createTextOutput(JSON.stringify({
      status: "SUCCESS",
      message: "Initialized " + tabsCreated + " tabs.",
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: "CONNECTED",
    engine: "ZENVITRA_APPS_SCRIPT_TWO_WAY_V2",
    spreadsheetId: ZENVITRA_CONFIG.SPREADSHEET_ID,
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Trigger: On-Edit event streaming from Google Sheet to ZENVITRA
 */
function handleZenvitraSheetEdit(e) {
  if (!e || !e.range) return;

  var sheet = e.range.getSheet();
  var sheetName = sheet.getName();
  var row = e.range.getRow();
  var col = e.range.getColumn();

  if (row <= 1) return; // Header row
  if (sheetName.indexOf("Audit") !== -1) return;

  var header = sheet.getRange(1, col).getValue();
  var recordId = sheet.getRange(row, 1).getValue();
  var oldValue = e.oldValue !== undefined ? e.oldValue : null;
  var newValue = e.value !== undefined ? e.value : e.range.getValue();
  var userEmail = Session.getActiveUser().getEmail() || "authorized_collaborator";

  var payload = {
    editUuid: "EDIT-" + Utilities.getUuid().substring(0, 8).toUpperCase(),
    eventId: ZENVITRA_CONFIG.EVENT_ID,
    spreadsheetId: ZENVITRA_CONFIG.SPREADSHEET_ID,
    webhookSecret: ZENVITRA_CONFIG.WEBHOOK_SECRET,
    tabName: sheetName,
    row: row,
    column: col,
    columnHeader: String(header),
    recordId: String(recordId),
    oldValue: oldValue,
    newValue: newValue,
    userEmail: userEmail,
    timestamp: new Date().toISOString()
  };

  try {
    var options = {
      method: "post",
      contentType: "application/json",
      headers: {
        "x-zenvitra-secret": ZENVITRA_CONFIG.WEBHOOK_SECRET
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    var response = UrlFetchApp.fetch(ZENVITRA_CONFIG.WEBHOOK_INBOUND_URL, options);
    var code = response.getResponseCode();
    if (code >= 200 && code < 300) {
      sheet.toast("Change synced to ZENVITRA", "Sync Active", 2);
    }
  } catch (err) {
    Logger.log("Outbound sync warn: " + err.message);
  }
}

/**
 * Installs the onEdit trigger for near real-time streaming
 */
function setupZenvitraTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }

  ScriptApp.newTrigger("handleZenvitraSheetEdit")
    .forSpreadsheet(SpreadsheetApp.openById(ZENVITRA_CONFIG.SPREADSHEET_ID))
    .onEdit()
    .create();

  SpreadsheetApp.openById(ZENVITRA_CONFIG.SPREADSHEET_ID).toast(
    "ZENVITRA Live Two-Way Sync Trigger Installed Successfully!",
    "Integration Active",
    6
  );
}

/**
 * Initializes Core Operational Tabs in the target Google Sheet
 */
function initAllTabs() {
  var ss = SpreadsheetApp.openById(ZENVITRA_CONFIG.SPREADSHEET_ID);
  var coreTabs = [
    "People",
    "Core Registrations",
    "Contact Inquiries",
    "Events",
    "Event Registrations",
    "Delegate Rosters",
    "EB Secretariat",
    "Attendance Rollcall",
    "Payments",
    "Support Cases",
    "Audit Logs",
    "Pulse Posts",
    "Form Submissions"
  ];

  for (var i = 0; i < coreTabs.length; i++) {
    var name = coreTabs[i];
    if (!ss.getSheetByName(name)) {
      var s = ss.insertSheet(name);
      var colHeaders = ["Timestamp", "Record ID", "Name", "Email", "Details", "Status"];
      if (name === "Core Registrations" || name === "Register Data Core") {
        colHeaders = [
          "Timestamp", "Record ID", "Full Legal Name", "Display Name / Username", "Primary Email Address",
          "Phone Number [Optional]", "Age (Years)", "Minor Status (Under 18 / Adult)", "Parent / Guardian Full Name",
          "Parent / Guardian Emergency Contact", "Minor Consent & Parental Accord", "Role Designation", "Access Level",
          "Auth Provider", "Institution / School / University", "Country & City", "Registration Type",
          "Terms & Privacy Ratification", "Account Status"
        ];
      } else if (name === "People" || name === "01 People") {
        colHeaders = [
          "Person_ID", "Full_Name", "Display_Name", "Email", "Phone_Optional", "Username",
          "Age", "Minor_Status", "Parent_Contact", "Institution", "Account_Type", "Account_Status",
          "Country", "City_Optional", "Joined_On", "Consent_Status", "Source", "Notes"
        ];
      }
      s.getRange(1, 1, 1, colHeaders.length).setValues([colHeaders]);
      s.getRange(1, 1, 1, colHeaders.length).setFontWeight("bold").setBackground("#0f172a").setFontColor("#FFFFFF");
      s.setFrozenRows(1);
    }
  }
  return coreTabs.length;
}
`;
}

/**
 * 5. Saves and activates a new Sheets + Apps Script integration
 */
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
