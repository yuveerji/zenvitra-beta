/**
 * ==============================================================================
 * ZENVITRA MASTER TELEMETRY & INGESTION ENGINE — GOOGLE APPS SCRIPT
 * ==============================================================================
 * 
 * Instructions for Setup:
 * 1. Open your Google Sheet (create a blank one at https://sheets.new).
 * 2. In the top menu, click Extensions > Apps Script.
 * 3. Delete any code in Code.gs, paste this entire file, and click Save (disk icon).
 * 4. In the top right, click Deploy > New deployment.
 * 5. Click the gear icon (Select type) > Web app.
 * 6. Set Description: "Zenvitra Telemetry Webhook"
 * 7. Set Execute as: "Me"
 * 8. Set Who has access: "Anyone" (CRITICAL: must be "Anyone", NOT "Only myself")
 * 9. Click Deploy, Authorize access with your Google account.
 * 10. Copy the Web App URL (starts with https://script.google.com/macros/s/...)
 * 11. Add it to your .env or VPS environment:
 *     GOOGLE_SHEETS_WEBHOOK_URL="your-deployed-url"
 * ==============================================================================
 */

// Tab Configuration & Headers
const TAB_SCHEMAS = {
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
  'NEWSLETTER': {
    sheetName: 'Newsletter Subscribers',
    headers: [
      'Timestamp', 'Email Address', 'Subscription Source', 'Consent Given',
      'Status', 'Device Info', 'IP Address'
    ]
  },
  'REGISTER_CORE': {
    sheetName: 'Register Data Core',
    headers: [
      'Timestamp', 'User ID', 'Full Name', 'Email', 'Role Designation',
      'Access Level', 'Auth Provider', 'Account Status', 'IP Address'
    ]
  },
  'LOGIN_CORE': {
    sheetName: 'Login Data Core',
    headers: [
      'Timestamp', 'User ID', 'Full Name', 'Email', 'Auth Provider',
      'Login Status', 'Device Info', 'IP Address'
    ]
  },
  'CONTACT': {
    sheetName: 'Contact Inquiries',
    headers: [
      'Timestamp', 'Full Name', 'Email', 'Phone Number', 'Subject',
      'Query Type', 'Message', 'Source URL', 'IP Address'
    ]
  },
  'COLLAB': {
    sheetName: 'Collab & Partnerships',
    headers: [
      'Timestamp', 'Organization Name', 'Representative Name', 'Official Email',
      'Phone / WhatsApp', 'Collab Type', 'Proposal Summary', 'Budget Scope'
    ]
  },
  'COMMUNITY': {
    sheetName: 'Community Members',
    headers: [
      'Timestamp', 'Full Name', 'Email', 'City / Region', 'Institution',
      'Primary Skills', 'Areas of Interest', 'Discord Handle', 'Status'
    ]
  },
  'CAMPUS_AMBASSADOR': {
    sheetName: 'Campus Ambassadors',
    headers: [
      'Timestamp', 'Full Name', 'College / University', 'City / State',
      'Degree / Year', 'Student ID Proof', 'Leadership Experience', 'Strategy'
    ]
  },
  'EVENTS': {
    sheetName: 'Event Registrations',
    headers: [
      'Timestamp', 'Event ID', 'Event Name', 'Participant Name', 'Participant Email',
      'Contact Number', 'Institution', 'Ticket Pass Type', 'Attendance Status'
    ]
  },
  'DONATIONS': {
    sheetName: 'Donations & Relief',
    headers: [
      'Timestamp', 'Donor Name', 'Donor Email', 'Amount (INR)', 'UTR / Transaction ID',
      'Target Project', 'Payment Mode', 'Notes', 'Anonymous'
    ]
  },
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

    var payload = JSON.parse(e.postData.contents);
    var rawTab = (payload.targetTab || payload.tab || 'REGISTER_CORE').toUpperCase();
    
    // Resolve target tab configuration
    var targetKey = 'REGISTER_CORE';
    if (rawTab.indexOf('CORE_TEAM') !== -1 || rawTab.indexOf('TEAM') !== -1 || rawTab.indexOf('CAREER') !== -1) {
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
    }

    var schema = TAB_SCHEMAS[targetKey] || TAB_SCHEMAS['REGISTER_CORE'];
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(schema.sheetName);

    // Create sheet if it does not exist yet
    if (!sheet) {
      sheet = ss.insertSheet(schema.sheetName);
      sheet.appendRow(schema.headers);
      var headerRange = sheet.getRange(1, 1, 1, schema.headers.length);
      headerRange.setBackground('#0f172a');
      headerRange.setFontColor('#f8fafc');
      headerRange.setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // Map payload attributes to row values based on target tab
    var row = [];
    var now = Utilities.formatDate(new Date(), "GMT+5:30", "yyyy-MM-dd HH:mm:ss");

    if (targetKey === 'CORE_TEAM') {
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
    } else if (targetKey === 'NEWSLETTER') {
      row = [
        now,
        payload.emailAddress || payload.email || '',
        payload.subscriptionSource || '',
        payload.consentGiven !== undefined ? payload.consentGiven : true,
        payload.status || 'SUBSCRIBED',
        payload.deviceInfo || payload.deviceBrowserInfo || '',
        payload.ipAddress || ''
      ];
    } else if (targetKey === 'LOGIN_CORE') {
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
    } else if (targetKey === 'REGISTER_CORE') {
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
    } else {
      // Generic row formatting
      row = [now];
      for (var i = 1; i < schema.headers.length; i++) {
        var key = schema.headers[i].toLowerCase().replace(/[^a-z0-9]/g, '');
        var val = '';
        for (var p in payload) {
          if (p.toLowerCase().replace(/[^a-z0-9]/g, '') === key) {
            val = payload[p];
            break;
          }
        }
        row.push(val);
      }
    }

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      targetTab: schema.sheetName,
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
 * Handle GET requests for connectivity test or data reading
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'online',
    system: 'Zenvitra Master Telemetry Webhook',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}
