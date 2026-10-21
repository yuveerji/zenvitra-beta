/**
 * Google Apps Script Edit Handler Generator
 * Creates a ready-to-deploy Apps Script to capture spreadsheet edits in near-real-time
 * and dispatch them securely to ZENVITRA's inbound webhook.
 */

export function generateAppsScriptCode(params: {
  eventId: string;
  webhookEndpoint: string;
  webhookSecret: string;
}): string {
  const { eventId, webhookEndpoint, webhookSecret } = params;

  return `/**
 * ============================================================================
 * ZENVITRA CORE × GOOGLE SHEETS LIVE TWO-WAY SYNC HANDLER
 * Event ID: ${eventId}
 * Generated: ${new Date().toISOString()}
 * ============================================================================
 * 
 * INSTRUCTIONS:
 * 1. Open your Google Sheet.
 * 2. Click "Extensions" -> "Apps Script".
 * 3. Delete any existing sample code and paste this entire file.
 * 4. Click "Save" (Disk icon).
 * 5. Run the function "setupZenvitraTriggers" once and accept Google authorization.
 * 6. You are done! Edits will stream to ZENVITRA in near-real-time.
 */

var ZENVITRA_CONFIG = {
  EVENT_ID: "${eventId}",
  WEBHOOK_URL: "${webhookEndpoint}",
  WEBHOOK_SECRET: "${webhookSecret}"
};

/**
 * Run this function once to install the persistent On-Edit trigger
 */
function setupZenvitraTriggers() {
  // Clear any old triggers to prevent duplicate events
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }

  // Create an installable onEdit trigger which has network permissions
  ScriptApp.newTrigger("handleZenvitraSheetEdit")
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onEdit()
    .create();

  SpreadsheetApp.getActiveSpreadsheet().toast(
    "ZENVITRA Sync Trigger installed successfully!",
    "Integration Active",
    5
  );
}

/**
 * Triggered on any cell edit in the workbook
 */
function handleZenvitraSheetEdit(e) {
  if (!e || !e.range) return;

  var sheet = e.range.getSheet();
  var sheetName = sheet.getName();
  var row = e.range.getRow();
  var col = e.range.getColumn();

  // Ignore header rows (Row 1)
  if (row <= 1) return;

  // Ignore audit log tab edits to prevent feedback loops
  if (sheetName.indexOf("Audit") !== -1) return;

  var colLetter = getColumnLetter(col);
  var header = sheet.getRange(1, col).getValue();
  var recordId = sheet.getRange(row, 1).getValue(); // Column A is always stable Record ID

  var oldValue = e.oldValue !== undefined ? e.oldValue : null;
  var newValue = e.value !== undefined ? e.value : e.range.getValue();
  var userEmail = Session.getActiveUser().getEmail() || "authorized_editor";

  var editUuid = "EDIT-" + Utilities.getUuid().substring(0, 8).toUpperCase();

  var payload = {
    editUuid: editUuid,
    eventId: ZENVITRA_CONFIG.EVENT_ID,
    webhookSecret: ZENVITRA_CONFIG.WEBHOOK_SECRET,
    tabName: sheetName,
    row: row,
    column: colLetter,
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

    var response = UrlFetchApp.fetch(ZENVITRA_CONFIG.WEBHOOK_URL, options);
    var resCode = response.getResponseCode();
    var resText = response.getContentText();

    if (resCode >= 200 && resCode < 300) {
      sheet.toast("Syncing change with ZENVITRA...", "ZENVITRA Core", 2);
    } else {
      Logger.log("Zenvitra Sync Error: " + resCode + " " + resText);
      sheet.toast("ZENVITRA sync flagged: " + resText, "Notice", 4);
    }
  } catch (err) {
    Logger.log("Network error contacting ZENVITRA: " + err.message);
  }
}

/**
 * Helper to convert 1-based column number to letter (A, B, C...)
 */
function getColumnLetter(columnNumber) {
  var dividend = columnNumber;
  var columnName = "";
  var modulo;

  while (dividend > 0) {
    modulo = (dividend - 1) % 26;
    columnName = String.fromCharCode(65 + modulo) + columnName;
    dividend = Math.floor((dividend - modulo) / 26);
  }

  return columnName;
}
`;
}
