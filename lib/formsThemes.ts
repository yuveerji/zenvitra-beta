import { ZenFormCustomStyle, ZenFormFontFamily, ZenFormTheme } from '@/types/forms';

export interface FontOption {
  name: ZenFormFontFamily;
  category: 'Modern Sans' | 'Editorial Serif' | 'Futuristic / Tech' | 'Expressive / Headline';
  cssFamily: string;
  previewSample: string;
}

export const ZEN_FORM_FONTS: FontOption[] = [
  {
    name: 'Space Grotesk',
    category: 'Modern Sans',
    cssFamily: "var(--font-space), 'Space Grotesk', sans-serif",
    previewSample: 'Diplomacy & Modern Tech',
  },
  {
    name: 'Playfair Display',
    category: 'Editorial Serif',
    cssFamily: "var(--font-playfair), 'Playfair Display', serif",
    previewSample: 'Sovereign Treaty & Dialogue',
  },
  {
    name: 'Syne',
    category: 'Expressive / Headline',
    cssFamily: "'Syne', sans-serif",
    previewSample: 'Avant-Garde Architecture',
  },
  {
    name: 'Outfit',
    category: 'Modern Sans',
    cssFamily: "var(--font-outfit), 'Outfit', sans-serif",
    previewSample: 'Sleek Minimalist Form',
  },
  {
    name: 'Clash Display',
    category: 'Expressive / Headline',
    cssFamily: "'Clash Display', var(--font-space), -apple-system, sans-serif",
    previewSample: 'Bold Editorial Punch',
  },
  {
    name: 'JetBrains Mono',
    category: 'Futuristic / Tech',
    cssFamily: "var(--font-mono), 'JetBrains Mono', monospace",
    previewSample: 'const sovereignty = true;',
  },
  {
    name: 'Bebas Neue',
    category: 'Expressive / Headline',
    cssFamily: "'Bebas Neue', sans-serif",
    previewSample: 'GLOBAL SUMMIT 2026',
  },
  {
    name: 'Prata',
    category: 'Editorial Serif',
    cssFamily: "'Prata', Georgia, serif",
    previewSample: 'Classical Dignity & Grace',
  },
  {
    name: 'Orbitron',
    category: 'Futuristic / Tech',
    cssFamily: "'Orbitron', sans-serif",
    previewSample: 'CYBER WARFARE DAIS',
  },
  {
    name: 'Dancing Script',
    category: 'Expressive / Headline',
    cssFamily: "'Dancing Script', cursive",
    previewSample: 'Artisanal & Handwritten Signature',
  },
  {
    name: 'Inter',
    category: 'Modern Sans',
    cssFamily: "var(--font-inter), 'Inter', sans-serif",
    previewSample: 'Crisp Global Standard',
  },
];

export function getFontCssFamily(fontName?: ZenFormFontFamily): string {
  const found = ZEN_FORM_FONTS.find((f) => f.name === fontName);
  return found ? found.cssFamily : "var(--font-inter), 'Inter', sans-serif";
}

export interface GradientPreset {
  id: string;
  name: string;
  css: string;
  glow: string;
  defaultAccent: string;
}

export const GRADIENT_PRESETS: GradientPreset[] = [
  {
    id: 'amber_dawn',
    name: 'Diplomatic Gold',
    css: 'linear-gradient(180deg, #131722 0%, #0c0f17 50%, #05070a 100%)',
    glow: 'rgba(245, 158, 11, 0.15)',
    defaultAccent: '#f59e0b',
  },
  {
    id: 'midnight_cyan',
    name: 'Cyber Midnight',
    css: 'linear-gradient(180deg, #071326 0%, #040a14 50%, #02050a 100%)',
    glow: 'rgba(6, 182, 212, 0.15)',
    defaultAccent: '#06b6d4',
  },
  {
    id: 'obsidian_noir',
    name: 'Obsidian Stealth',
    css: 'linear-gradient(180deg, #141414 0%, #0a0a0a 50%, #020202 100%)',
    glow: 'rgba(255, 255, 255, 0.08)',
    defaultAccent: '#ffffff',
  },
  {
    id: 'emerald_matrix',
    name: 'Emerald Oasis',
    css: 'linear-gradient(180deg, #061c14 0%, #030e0a 50%, #010604 100%)',
    glow: 'rgba(16, 185, 129, 0.15)',
    defaultAccent: '#10b981',
  },
  {
    id: 'royal_purple',
    name: 'Royal Sovereign',
    css: 'linear-gradient(180deg, #1a0c2e 0%, #0f071b 50%, #05020a 100%)',
    glow: 'rgba(139, 92, 246, 0.15)',
    defaultAccent: '#8b5cf6',
  },
  {
    id: 'crimson_dusk',
    name: 'Crimson Velvet',
    css: 'linear-gradient(180deg, #240812 0%, #13040a 50%, #070104 100%)',
    glow: 'rgba(244, 63, 94, 0.15)',
    defaultAccent: '#f43f5e',
  },
  {
    id: 'deep_ocean',
    name: 'Deep Oceanic Abyss',
    css: 'linear-gradient(180deg, #091a2e 0%, #050d17 50%, #010408 100%)',
    glow: 'rgba(59, 130, 246, 0.15)',
    defaultAccent: '#3b82f6',
  },
  {
    id: 'sunset_horizon',
    name: 'Warm Sunset Glow',
    css: 'linear-gradient(180deg, #26141a 0%, #150a0e 50%, #080305 100%)',
    glow: 'rgba(251, 146, 60, 0.15)',
    defaultAccent: '#fb923c',
  },
];

export const ACCENT_COLOR_PALETTES = [
  { name: 'Amber Gold', hex: '#f59e0b', textHex: '#000000' },
  { name: 'Electric Cyan', hex: '#06b6d4', textHex: '#000000' },
  { name: 'Matrix Emerald', hex: '#10b981', textHex: '#000000' },
  { name: 'Sovereign Violet', hex: '#8b5cf6', textHex: '#ffffff' },
  { name: 'Neon Rose', hex: '#f43f5e', textHex: '#ffffff' },
  { name: 'Deep Azure', hex: '#3b82f6', textHex: '#ffffff' },
  { name: 'Sunset Orange', hex: '#fb923c', textHex: '#000000' },
  { name: 'Pure Pearl', hex: '#ffffff', textHex: '#000000' },
];

export const CARD_BORDER_RADIUS_MAP = {
  none: 'rounded-none',
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
  '2xl': 'rounded-[2rem]',
  '3xl': 'rounded-[2.5rem]',
  full: 'rounded-[3rem]',
};

export const APPS_SCRIPT_TEMPLATE = `// ════════════════════════════════════════════════════════════════
// ZENVITRA MASTER OMNI-STREAM & ZENFORMS GOOGLE SHEETS CONNECTOR
// ════════════════════════════════════════════════════════════════
// 1. In your Google Sheet, click: Extensions > Apps Script
// 2. Delete all existing code, paste this entire script, and click Save (Disk icon)
// 3. Click "Deploy" > "New deployment"
// 4. Select type: "Web app"
// 5. Execute as: "Me" | Who has access: "Anyone"
// 6. Click Deploy, authorize Google permissions, and copy your Web App URL!
// ════════════════════════════════════════════════════════════════

var MASTER_TAB_DEFAULTS = {
  EVENTS: [
    "Timestamp", "Registration ID / Ticket ID", "Full Name of the Delegate", "Primary Contact Email Address",
    "WhatsApp / Calling Number", "School / College / University or Independent", "Current City & State of Residence",
    "Participation Track", "Model UN & Parliamentary Experience Tier", "1st Preference Committee Chamber",
    "2nd Preference Committee Chamber", "Top 3 Preferred Portfolios / Countries", "List Notable MUN Conferences & Awards Won",
    "Statement of Purpose & Procedural Strategy", "Parent / Guardian / Faculty Advisor Name", "Guardian Emergency Contact Number",
    "Institutional ID Card / Drive Link / Roll Number", "Diplomatic Code of Conduct & Ethics Agreement",
    "Zenvitra Sovereign Username (@handle)", "Virtual Chamber Live Stream & Recording Consent", "Selected Delegation Pass Tier",
    "Total Pass Fee (INR)", "Preferred Payment Mode", "12-Digit UPI Transaction ID / UTR Number",
    "Upload Payment Screenshot / Receipt Proof URL", "Digital Signature (Full Legal Name)", "Date of Submission",
    "Payment Verification Status", "Allocated Committee", "Allocated Seat / Portfolio", "Dais Review Status",
    "Dais Review Notes", "IP Address", "Device / Browser"
  ],
  CORE_TEAM: [
    "Timestamp", "Application ID", "Full Legal Name", "Desired ZEN Handle", "Primary Email",
    "Phone [Whatsapp Active]", "Telegram / Discord Handle", "Location & Timezone", "Role Applied For",
    "Department / Wing", "Leadership Track", "Portfolio / Proof of Work URL", "Uploaded Dossier Document",
    "Past Experience & Track Record", "Technical / Diplomatic Dossier", "Weekly Bandwidth Commitment",
    "Statement of Purpose & Motivation", "Current Institution / College / Company", "Year of Study / Current Title",
    "Constitutional Accord Status", "Application Status", "Interview Date / Dais Coordinate", "Reviewer",
    "Review Notes", "IP Address", "Device / Browser"
  ],
  CAMPUS_AMBASSADOR: [
    "Timestamp", "Ambassador Application ID", "Full Legal Name", "Email Address", "Phone Number [WhatsApp Active]",
    "College / University / School Name", "City & State of Residence", "Degree, Stream & Academic Year",
    "Student ID Proof / College ID URL", "Prior Leadership / Student Council / Campus Experience",
    "Proposed Campus Strategy & Outreach Blueprint", "Social Media Handles (Instagram / LinkedIn / Twitter)",
    "Estimated Weekly Available Hours", "Statement of Purpose / Why Zenvitra Ambassador",
    "Referral Code Generated", "Application Review Status", "Assigned Outreach Lead", "Reviewer Notes",
    "IP Address", "Device / Browser"
  ],
  CONTACT: [
    "Timestamp", "Inquiry ID", "Full Legal Name", "Email Address", "Phone Number [WhatsApp Active]",
    "Preferred Contact Channel", "Inquiry Category / Department", "Subject / Inquiry Title",
    "Detailed Message / Inquiry Text", "Urgency / Priority Level", "Source URL / Origin Page",
    "Resolution Status", "Assigned Officer", "Resolution Notes", "IP Address", "Device / Browser"
  ],
  COLLAB: [
    "Timestamp", "Partnership ID", "Organization / Institution / Entity Name", "Lead Representative Full Name",
    "Official Work / Institutional Email", "Contact Phone / WhatsApp Number", "Partnership Category",
    "Official Website / Social URL", "Estimated Community / Delegation Reach", "Proposed Partnership Scope & Deliverables",
    "Resource / Budget Commitment", "Target Summit / Event Timeline", "Partnership Stage",
    "Assigned Secretariat Lead", "Internal Review Notes", "IP Address", "Device / Browser"
  ],
  COMMUNITY: [
    "Timestamp", "Member ID", "Full Legal Name", "Zenvitra Sovereign Handle (@handle)", "Primary Email Address",
    "Phone Number [WhatsApp Active]", "City, State & Country", "Institution / University / Affiliation",
    "Primary Domain & Skills", "Secondary Interests & Passions", "Discord Handle", "Telegram Handle",
    "LinkedIn / GitHub Profile URL", "Membership Tier", "Membership Status", "IP Address", "Device / Browser"
  ],
  DONATIONS: [
    "Timestamp", "Donation ID / Contribution ID", "Contributor / Donor Full Name", "Contributor Email Address",
    "Phone Number [WhatsApp Active]", "Voluntary Contribution Amount (INR)", "12-Digit UPI UTR / Transaction Reference ID",
    "Target Project / Relief Stream", "Payment Mode / Channel", "Anonymous Contribution Preference",
    "Contributor Notes / Dedication / Prayer", "Payment Screenshot / Receipt Proof URL", "Verification & Audit Status",
    "Auditor / Reconciled By", "Reconciliation Date", "IP Address", "Device / Browser"
  ],
  FEEDBACK: [
    "Timestamp", "Ticket ID", "Submitter Full Name", "Submitter Email Address", "Submitter Handle / Phone Number",
    "Category (Bug / Grievance / Feature / Conduct / Payment)", "Severity / Priority Level", "Target Page / Feature URL",
    "Subject / Issue Summary", "Detailed Description & Reproduction Steps", "Attachment / Screenshot / Proof URL",
    "Operating System & Browser Info", "Resolution Status", "Assigned Ombudsperson / Officer",
    "Resolution Summary & Action Taken", "IP Address"
  ],
  FORM_SUBMISSIONS: [
    "Timestamp", "Submission ID", "Form ID", "Form Title", "Form Slug", "Submitter Full Name",
    "Submitter Email Address", "Submitter Phone Number", "Submitter Handle", "Questions & Answers Summary",
    "Full Form Responses (JSON)", "Target Sheet Tab", "IP Address", "Device / Browser"
  ]
};

function getOrCreateTab(ss, tabName) {
  var cleanName = (tabName || "Form Submissions").toString().replace(/_/g, " ").trim();
  var sheet = ss.getSheetByName(cleanName);
  if (sheet) return sheet;

  var lower = cleanName.toLowerCase();
  var allSheets = ss.getSheets();
  for (var i = 0; i < allSheets.length; i++) {
    var shName = allSheets[i].getName();
    var shLower = shName.toLowerCase();
    if (shLower === lower) return allSheets[i];

    // Core Team / Team Applications interchangeable lookup
    if ((lower.indexOf("core team") !== -1 || lower.indexOf("04 team") !== -1 || lower.indexOf("team app") !== -1) &&
        (shLower.indexOf("core team") !== -1 || shLower.indexOf("04 team") !== -1 || shLower.indexOf("team app") !== -1)) {
      return allSheets[i];
    }
    // Delegate & Event Registrations lookup
    if ((lower.indexOf("event reg") !== -1 || lower.indexOf("12 event") !== -1 || lower.indexOf("delegate") !== -1 || lower.indexOf("14 delegate") !== -1) &&
        (shLower.indexOf("event reg") !== -1 || shLower.indexOf("12 event") !== -1 || shLower.indexOf("delegate") !== -1 || shLower.indexOf("14 delegate") !== -1)) {
      return allSheets[i];
    }
    // Contact Inquiries lookup
    if (lower.indexOf("contact") !== -1 && shLower.indexOf("contact") !== -1) {
      return allSheets[i];
    }
    // Campus Ambassador lookup
    if (lower.indexOf("ambassador") !== -1 && shLower.indexOf("ambassador") !== -1) {
      return allSheets[i];
    }
    // Donations & Impact Ledger lookup
    if ((lower.indexOf("donat") !== -1 || lower.indexOf("impact") !== -1 || lower.indexOf("20 donat") !== -1) &&
        (shLower.indexOf("donat") !== -1 || shLower.indexOf("impact") !== -1 || shLower.indexOf("20 donat") !== -1)) {
      return allSheets[i];
    }
    // Collab & Partnerships lookup
    if ((lower.indexOf("collab") !== -1 || lower.indexOf("partner") !== -1 || lower.indexOf("08 collab") !== -1) &&
        (shLower.indexOf("collab") !== -1 || shLower.indexOf("partner") !== -1 || shLower.indexOf("08 collab") !== -1)) {
      return allSheets[i];
    }
    // Community lookup
    if ((lower.indexOf("community") !== -1 || lower.indexOf("09 community") !== -1) &&
        (shLower.indexOf("community") !== -1 || shLower.indexOf("09 community") !== -1)) {
      return allSheets[i];
    }
    // Feedback & Grievance lookup
    if ((lower.indexOf("feedback") !== -1 || lower.indexOf("grievance") !== -1 || lower.indexOf("23 feed") !== -1 || lower.indexOf("24 griev") !== -1) &&
        (shLower.indexOf("feedback") !== -1 || shLower.indexOf("grievance") !== -1 || shLower.indexOf("23 feed") !== -1 || shLower.indexOf("24 griev") !== -1)) {
      return allSheets[i];
    }
  }

  sheet = ss.insertSheet(cleanName);
  return sheet;
}

function styleHeaderRow(sheet, colCount) {
  if (colCount <= 0) return;
  var headerRange = sheet.getRange(1, 1, 1, colCount);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#0f172a"); // Dark Obsidian / Navy
  headerRange.setFontColor("#f8fafc"); // Crisp White
  headerRange.setFontFamily("Roboto Mono");
  headerRange.setFontSize(10);
  headerRange.setWrap(true);
  sheet.setFrozenRows(1);
}

/**
 * High-precision fuzzy value lookup for any header, question, ID, label, or placeholder
 */
function lookupVal(data, header) {
  if (!data || !header) return "";
  // 1. Direct exact match
  if (data[header] !== undefined && data[header] !== null && data[header] !== "") return data[header];

  // 2. Case-insensitive key match
  var hLower = String(header).toLowerCase();
  for (var k in data) {
    if (data.hasOwnProperty(k) && k.toLowerCase() === hLower) {
      if (data[k] !== undefined && data[k] !== null && data[k] !== "") return data[k];
    }
  }

  // 3. Alphanumeric normalized key match
  var hAlpha = hLower.replace(/[^a-z0-9]/g, "");
  for (var k2 in data) {
    if (data.hasOwnProperty(k2)) {
      var kAlpha = k2.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (kAlpha === hAlpha && data[k2] !== undefined && data[k2] !== null && data[k2] !== "") {
        return data[k2];
      }
    }
  }

  // 4. Semantic field aliases for all form questions, steps & placeholders

  // ── FULL NAME / APPLICANT NAME ──
  if (hAlpha.indexOf("name") !== -1 && hAlpha.indexOf("team") === -1 && hAlpha.indexOf("org") === -1 && hAlpha.indexOf("event") === -1 && hAlpha.indexOf("guardian") === -1) {
    return data["Full Legal Name"] || data["Full Name of the Delegate"] || data.fullName || data.name || data.legalName || data.participantName || data.step1_fullname || data.step2_fullname || data.applicantName || "";
  }

  // ── EMAIL ADDRESS ──
  if (hAlpha.indexOf("email") !== -1 && hAlpha.indexOf("reviewer") === -1 && hAlpha.indexOf("guardian") === -1) {
    return data["Primary Email"] || data["Primary Contact Email Address"] || data["Official Email Address"] || data["Email Address"] || data.email || data.primaryEmail || data.step1_email || data.step2_email || data.participantEmail || data.donorEmail || "";
  }

  // ── PHONE / WHATSAPP NUMBER ──
  if ((hAlpha.indexOf("phone") !== -1 || hAlpha.indexOf("whatsapp") !== -1 || hAlpha.indexOf("calling") !== -1) && hAlpha.indexOf("guardian") === -1 && hAlpha.indexOf("emergency") === -1) {
    return data["Phone [Whatsapp Active]"] || data["WhatsApp / Calling Number"] || data["WhatsApp Phone Number"] || data["Phone Number [WhatsApp Active]"] || data["Phone Number"] || data.phoneNumber || data.phone || data.contactPhone || data.phoneWhatsapp || data.step1_phone || data.step2_phone || data.contactNumber || "";
  }

  // ── ZEN USERNAME / HANDLE ──
  if (hAlpha.indexOf("handle") !== -1 && hAlpha.indexOf("discord") === -1 && hAlpha.indexOf("telegram") === -1) {
    return data["Desired ZEN Handle"] || data["Zenvitra Sovereign Username (@handle)"] || data.handle || data.username || data.step11_zenvitra_handle || data.submitterHandle || "";
  }

  // ── TELEGRAM / DISCORD HANDLE ──
  if (hAlpha.indexOf("discord") !== -1 || hAlpha.indexOf("telegram") !== -1 || hAlpha.indexOf("contactchannel") !== -1) {
    return data["Telegram / Discord Handle"] || data["Discord Username / Tag"] || data.contactChannel || data.discordHandle || data.telegramHandle || data.step4_discord_handle || "N/A";
  }

  // ── INSTITUTION / COLLEGE / AFFILIATION ──
  if (hAlpha.indexOf("institution") !== -1 || hAlpha.indexOf("college") !== -1 || hAlpha.indexOf("school") !== -1 || hAlpha.indexOf("affiliation") !== -1) {
    return data["School / College / University or Independent"] || data["School / University / Affiliation"] || data["College / University / School Name"] || data["Current Institution / College / Company"] || data.institution || data.college || data.affiliation || data.step1_institution || data.step2_institution || data.collegeUniversityName || data.institutionCollege || "";
  }

  // ── CITY / STATE / LOCATION / TIMEZONE ──
  if (hAlpha.indexOf("city") !== -1 || hAlpha.indexOf("location") !== -1 || hAlpha.indexOf("timezone") !== -1 || hAlpha.indexOf("state") !== -1) {
    return data["Current City & State of Residence"] || data["Current City & Country"] || data["Location & Timezone"] || data["City & State of Residence"] || data.locationTimezone || data.city || data.cityState || data.cityCountry || data.step1_city || data.step2_city || data.step2_city_country || data.location || "";
  }

  // ── ACADEMIC YEAR / GRADE ──
  if (hAlpha.indexOf("grade") !== -1 || hAlpha.indexOf("yearofstudy") !== -1 || hAlpha.indexOf("academicyear") !== -1 || hAlpha.indexOf("degree") !== -1) {
    return data["Current Academic Grade / Year"] || data["Degree, Stream & Academic Year"] || data["Year of Study / Current Title"] || data.gradeOrYear || data.academicYear || data.yearOfStudy || data.degreeYearOfStudy || data.step2_grade || "";
  }

  // ── PARTICIPATION TRACK ──
  if (hAlpha.indexOf("track") !== -1 && hAlpha.indexOf("leader") === -1 && hAlpha.indexOf("past") === -1) {
    return data["Participation Track"] || data.track || data.step2_track || "School / University Delegate";
  }

  // ── LEADERSHIP TRACK ──
  if (hAlpha.indexOf("leadershiptrack") !== -1 || (hAlpha.indexOf("track") !== -1 && hAlpha.indexOf("lead") !== -1)) {
    return data["Leadership Track"] || data.selectedTrack || data.track || "Executive Council";
  }

  // ── EXPERIENCE TIER / MUNS ATTENDED ──
  if (hAlpha.indexOf("experiencetier") !== -1 || hAlpha.indexOf("conferencesattended") !== -1 || hAlpha.indexOf("totalmuns") !== -1) {
    return data["Model UN & Parliamentary Experience Tier"] || data["Total MUN Conferences Attended"] || data.experienceLevel || data.experience || data.priorMunExperience || data.step2_experience_level || data.step3_prior_muns_count || data.numberOfMunsAttended || "Developing Delegate";
  }

  // ── 1ST COMMITTEE PREFERENCE ──
  if (hAlpha.indexOf("1st") !== -1 || hAlpha.indexOf("firstcommittee") !== -1 || hAlpha.indexOf("primarycommittee") !== -1) {
    return data["1st Preference Committee Chamber"] || data.step3_primary_committee || data.firstCommitteeChoice || data.committee1 || data.primaryCommittee || "";
  }

  // ── 2ND COMMITTEE PREFERENCE ──
  if (hAlpha.indexOf("2nd") !== -1 || hAlpha.indexOf("secondcommittee") !== -1 || hAlpha.indexOf("alternatechamber") !== -1) {
    return data["2nd Preference Committee Chamber"] || data.step4_secondary_committee || data.secondCommitteeChoice || data.committee2 || data.secondaryCommittee || "";
  }

  // ── TOP 3 PORTFOLIOS / COUNTRIES ──
  if (hAlpha.indexOf("portfolio") !== -1 && (hAlpha.indexOf("top") !== -1 || hAlpha.indexOf("prefer") !== -1 || hAlpha.indexOf("countr") !== -1)) {
    return data["Top 3 Preferred Portfolios / Countries"] || data["Enter Your Top 3 Preferred Portfolios"] || data.step5_portfolios || data.portfolioPreferences || data.portfolios || "";
  }

  // ── MUN AWARDS & PAST ACCOLADES ──
  if (hAlpha.indexOf("award") !== -1 || hAlpha.indexOf("accolade") !== -1) {
    return data["List Notable MUN Conferences & Awards Won"] || data.step6_prior_awards || data.step6_prior_accolades || data.priorAwards || data.awards || data.priorAccolades || "N/A";
  }

  // ── PAST EXPERIENCE & TRACK RECORD ──
  if (hAlpha.indexOf("pastexperience") !== -1 || hAlpha.indexOf("trackrecord") !== -1 || hAlpha.indexOf("priororganizing") !== -1) {
    return data["Past Experience & Track Record"] || data["Prior Organizing / Secretariat Experience"] || data.pastExperience || data.leadershipAccomplishments || data.priorOrganizingExperience || data.step3_organizing_experience || "N/A";
  }

  // ── STATEMENT OF PURPOSE / SOP / MOTIVATION ──
  if (hAlpha.indexOf("sop") !== -1 || hAlpha.indexOf("statementofpurpose") !== -1 || hAlpha.indexOf("motivation") !== -1 || hAlpha.indexOf("whylead") !== -1 || hAlpha.indexOf("intent") !== -1) {
    return data["Statement of Purpose & Procedural Strategy"] || data["Statement of Purpose (SOP)"] || data["Statement of Purpose & Motivation"] || data.statementOfPurpose || data.sop || data.motivationStatement || data.motivation || data.whyLead || data.step7_sop || data.step3_sop || data.vision || "";
  }

  // ── DEPARTMENT PRACTICAL RESPONSE ──
  if (hAlpha.indexOf("practical") !== -1 || hAlpha.indexOf("taskresponse") !== -1 || hAlpha.indexOf("executionplan") !== -1) {
    return data["Department Practical Response / Execution Plan"] || data.step3_practical_response || data.practicalTaskResponse || data.taskPlan || "";
  }

  // ── GUARDIAN / EMERGENCY CONTACT NAME ──
  if (hAlpha.indexOf("guardian") !== -1 && hAlpha.indexOf("phone") === -1) {
    return data["Parent / Guardian / Faculty Advisor Name"] || data.step8_guardian_name || data.guardianName || data.facultyAdvisor || "N/A";
  }

  // ── GUARDIAN / EMERGENCY CONTACT PHONE ──
  if (hAlpha.indexOf("guardian") !== -1 || hAlpha.indexOf("emergency") !== -1) {
    return data["Guardian Emergency Contact Number"] || data.step8_guardian_phone || data.emergencyContact || data.guardianPhone || "N/A";
  }

  // ── ID PROOF / ENROLLMENT VERIFICATION ──
  if (hAlpha.indexOf("idproof") !== -1 || hAlpha.indexOf("cardlink") !== -1 || hAlpha.indexOf("rollnumber") !== -1) {
    return data["Institutional ID Card / Drive Link / Roll Number"] || data["Student ID Proof / College ID URL"] || data.step9_id_proof || data.idProof || data.studentIdProof || data.rollNumber || "VERIFIED_ON_RECORD";
  }

  // ── CODE OF CONDUCT / ETHICS / ACCORD RATIFICATION ──
  if (hAlpha.indexOf("ethics") !== -1 || hAlpha.indexOf("decorum") !== -1 || hAlpha.indexOf("accord") !== -1 || hAlpha.indexOf("conduct") !== -1) {
    return data["Diplomatic Code of Conduct & Ethics Agreement"] || data["Secretariat Code of Conduct Ratification"] || data["Constitutional Accord Status"] || data.step10_ethics || data.step4_accord_agreement || data.codeOfConduct || data.ethicsAccepted || data.sovereignAccordAccepted || data.constitutionalAccordAccepted || "RATIFIED";
  }

  // ── MEDIA CONSENT ──
  if (hAlpha.indexOf("media") !== -1 || hAlpha.indexOf("recording") !== -1 || hAlpha.indexOf("livestream") !== -1) {
    return data["Virtual Chamber Live Stream & Recording Consent"] || data.step12_media_consent || data.mediaConsent || "Granted";
  }

  // ── PARTICIPATION PASS TIER ──
  if (hAlpha.indexOf("tier") !== -1 || hAlpha.indexOf("passtype") !== -1 || (hAlpha.indexOf("ticket") !== -1 && hAlpha.indexOf("id") === -1)) {
    return data["Selected Delegation Pass Tier"] || data["Ticket Pass Type"] || data.step13_participation_tier || data.participationTier || data.ticketPassType || data.passType || data.tierName || "Delegate Pass (₹499)";
  }

  // ── PASS FEE / VOLUNTARY AMOUNT (INR) ──
  if (hAlpha.indexOf("fee") !== -1 || hAlpha.indexOf("amount") !== -1 || hAlpha.indexOf("price") !== -1) {
    return data["Total Pass Fee (INR)"] || data["Voluntary Contribution Amount (INR)"] || data["Total Price"] || data.totalPrice || data.feeAmount || data.amount || data.amountInr || data.voluntaryAmountInr || "499";
  }

  // ── PAYMENT MODE / CHANNEL ──
  if (hAlpha.indexOf("paymentmode") !== -1 || hAlpha.indexOf("paymentmethod") !== -1 || hAlpha.indexOf("gateway") !== -1) {
    return data["Preferred Payment Mode"] || data["Payment Mode / Channel"] || data.step15_payment_method || data.paymentMode || data.paymentMethod || data.gateway || "UPI Instant QR";
  }

  // ── UPI UTR / TRANSACTION ID ──
  if (hAlpha.indexOf("utr") !== -1 || hAlpha.indexOf("transaction") !== -1 || hAlpha.indexOf("txnid") !== -1) {
    return data["12-Digit UPI Transaction ID / UTR Number"] || data["12-Digit UPI UTR / Transaction Reference ID"] || data["UTR / Txn ID"] || data.step15_utr_reference || data.step15_payment_reference || data.utr || data.utrTransactionId || data.transactionRef || data.txId || "";
  }

  // ── PAYMENT SCREENSHOT / RECEIPT PROOF URL ──
  if (hAlpha.indexOf("screenshot") !== -1 || hAlpha.indexOf("receipt") !== -1 || hAlpha.indexOf("proofurl") !== -1) {
    return data["Upload Payment Screenshot / Receipt Proof URL"] || data["Payment Screenshot / Receipt Proof URL"] || data.step15_receipt_link || data.step15_payment_screenshot || data.paymentScreenshot || data.receiptUrl || data.paymentScreenshotPreview || "N/A";
  }

  // ── DIGITAL SIGNATURE ──
  if (hAlpha.indexOf("signature") !== -1) {
    return data["Digital Signature (Full Legal Name)"] || data["Digital Signature (Type Full Legal Name)"] || data.step14_signature || data.signature || data.fullName || data.name || "";
  }

  // ── DATE OF SUBMISSION / TIMESTAMP ──
  if (hAlpha.indexOf("submissiondate") !== -1 || hAlpha.indexOf("dateofsubmission") !== -1 || hAlpha.indexOf("registeredat") !== -1 || hAlpha.indexOf("timestamp") !== -1) {
    return data["Date of Submission"] || data["Timestamp"] || data.step14_submission_date || data.submissionDate || data.timestamp || data.submittedAt || new Date().toISOString();
  }

  // ── ROLE APPLIED FOR / POSITION ──
  if (hAlpha.indexOf("role") !== -1 || hAlpha.indexOf("position") !== -1) {
    return data["Role Applied For"] || data.roleAppliedFor || data.roleApplied || data.role || data.department || "";
  }

  // ── DEPARTMENT / WING ──
  if (hAlpha.indexOf("department") !== -1 || hAlpha.indexOf("wing") !== -1 || hAlpha.indexOf("sector") !== -1) {
    if (hAlpha.indexOf("primary") !== -1) {
      return data["Primary Department Choice"] || data.step1_primary_sector || data.step1_preferred_department || data.preferredSector || data.department || "";
    }
    if (hAlpha.indexOf("secondary") !== -1 || hAlpha.indexOf("fallback") !== -1) {
      return data["Secondary Department Choice (Fallback)"] || data.step1_secondary_sector || data.step1_secondary_department || data.secondarySector || "None";
    }
    return data["Department / Wing"] || data["Primary Department Choice"] || data.department || data.wing || data.step1_primary_sector || "GENERAL";
  }

  // ── PORTFOLIO / PROOF OF WORK URL ──
  if (hAlpha.indexOf("portfolio") !== -1 || hAlpha.indexOf("proofofwork") !== -1 || hAlpha.indexOf("resume") !== -1) {
    return data["Portfolio / Proof of Work URL"] || data["Portfolio / LinkedIn / Work Samples URL"] || data.proofOfWorkUrl || data.portfolioUrl || data.portfolioLink || data.step3_portfolio_url || data.linkedinOrResumeUrl || "N/A";
  }

  // ── UPLOADED DOSSIER DOCUMENT ──
  if (hAlpha.indexOf("dossier") !== -1 && (hAlpha.indexOf("document") !== -1 || hAlpha.indexOf("upload") !== -1)) {
    return data["Uploaded Dossier Document"] || data.dossierUploadUrl || data.uploadedDocumentName || data.uploadedFileName || "N/A";
  }

  // ── TECHNICAL / DIPLOMATIC DOSSIER ──
  if (hAlpha.indexOf("technical") !== -1 || hAlpha.indexOf("strategicvision") !== -1) {
    return data["Technical / Diplomatic Dossier"] || data.technicalOrDiplomaticDossier || data.dossier || data.strategicVision || "N/A";
  }

  // ── WEEKLY BANDWIDTH COMMITMENT ──
  if (hAlpha.indexOf("bandwidth") !== -1 || hAlpha.indexOf("hoursperweek") !== -1 || hAlpha.indexOf("availablehours") !== -1) {
    return data["Weekly Bandwidth Commitment"] || data["Estimated Weekly Bandwidth Commitment"] || data["Estimated Weekly Available Hours"] || data.weeklyBandwidth || data.hoursPerWeek || data.step3_weekly_bandwidth || data.weeklyHours || data.commitment || "10–15 hours / week";
  }

  // ── AVAILABILITY ON CONFERENCE DATES ──
  if (hAlpha.indexOf("availability") !== -1 && (hAlpha.indexOf("oct") !== -1 || hAlpha.indexOf("date") !== -1 || hAlpha.indexOf("conference") !== -1)) {
    return data["Full Availability on October 24 & 25, 2026 (Conference Days)"] || data.step4_availability_oct2425 || data.availabilityOct2425 || "Confirmed";
  }

  // ── ALLOCATED SEAT / PORTFOLIO ──
  if (hAlpha.indexOf("allocated") !== -1 && (hAlpha.indexOf("seat") !== -1 || hAlpha.indexOf("portfolio") !== -1)) {
    return data["Allocated Seat / Portfolio"] || data.allocatedSeat || data.allocatedPortfolio || "Pending Allotment";
  }

  // ── ALLOCATED COMMITTEE ──
  if (hAlpha.indexOf("allocatedcommittee") !== -1) {
    return data["Allocated Committee"] || data.allocatedCommittee || data.firstCommitteeChoice || "AIPPM";
  }

  // ── REVIEW STATUS / APPLICATION STATUS ──
  if (hAlpha.indexOf("status") !== -1) {
    if (hAlpha.indexOf("payment") !== -1) {
      return data["Payment Verification Status"] || data.paymentStatus || "PENDING_VERIFICATION";
    }
    if (hAlpha.indexOf("review") !== -1 || hAlpha.indexOf("app") !== -1) {
      return data["Application Status"] || data["Review Status"] || data["Dais Review Status"] || data.applicationStatus || data.reviewStatus || data.status || "PENDING";
    }
    return data["Application Status"] || data["Review Status"] || data.status || "PENDING";
  }

  // ── REVIEWER / OMBUDSPERSON / AUDITOR ──
  if (hAlpha.indexOf("reviewer") !== -1 || hAlpha.indexOf("assignedofficer") !== -1 || hAlpha.indexOf("auditor") !== -1) {
    return data["Reviewer"] || data["Assigned Officer"] || data["Auditor / Reconciled By"] || data.reviewer || data.assignedOfficer || data.auditor || "Genesis Executive Council";
  }

  // ── REVIEW NOTES / RESOLUTION NOTES ──
  if (hAlpha.indexOf("note") !== -1 || hAlpha.indexOf("remarks") !== -1 || hAlpha.indexOf("resolution") !== -1) {
    return data["Review Notes"] || data["Dais Review Notes"] || data["Resolution Notes"] || data["Resolution Summary & Action Taken"] || data.reviewNotes || data.resolutionNotes || data.notes || "";
  }

  // ── ID FIELDS ──
  if (hAlpha.indexOf("id") !== -1) {
    return data["Registration ID / Ticket ID"] || data["Application ID"] || data["Ticket ID"] || data["Inquiry ID"] || data["Donation ID / Contribution ID"] || data["Ambassador Application ID"] || data["Partnership ID"] || data["Member ID"] || data["Submission ID"] || data.applicationId || data.ticketId || data.submissionId || data.registrationId || data.inquiryId || data.donationId || data.ambassadorId || data.id || "";
  }

  // ── IP ADDRESS ──
  if (hAlpha.indexOf("ip") !== -1) {
    return data["IP Address"] || data.ipAddress || data.ip || "127.0.0.1";
  }

  // ── DEVICE / BROWSER ──
  if (hAlpha.indexOf("device") !== -1 || hAlpha.indexOf("browser") !== -1) {
    return data["Device / Browser"] || data["Operating System & Browser Info"] || data.deviceBrowserInfo || data.deviceInfo || data.userAgent || "Web Browser";
  }

  return "";
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "No post data received" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var raw = e.postData.contents;
    var payload = JSON.parse(raw);
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    var targetTabName = payload.targetTab || payload.sheetTab || payload.tab || "Form Submissions";
    var sheet = getOrCreateTab(ss, targetTabName);

    // ── ACTION: INIT (Provision Tab & Formatting) ──
    if (payload.action === "INIT") {
      if (sheet.getLastRow() === 0 && payload.headers && payload.headers.length > 0) {
        sheet.appendRow(payload.headers);
        styleHeaderRow(sheet, payload.headers.length);
      }
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "INIT",
        targetTab: targetTabName,
        spreadsheetUrl: ss.getUrl()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ── ACTION: SYNC_SCHEMA (Update / Setup Column Headers) ──
    if (payload.action === "SYNC_SCHEMA") {
      var fieldHeaders = ["Submission ID", "Submitted At", "Submitter"];
      if (payload.fields && Array.isArray(payload.fields)) {
        for (var f = 0; f < payload.fields.length; f++) {
          fieldHeaders.push(payload.fields[f].label || payload.fields[f].id);
        }
      } else if (payload.headers && Array.isArray(payload.headers)) {
        fieldHeaders = payload.headers;
      }

      if (sheet.getLastRow() === 0) {
        sheet.appendRow(fieldHeaders);
      } else {
        sheet.getRange(1, 1, 1, fieldHeaders.length).setValues([fieldHeaders]);
      }
      styleHeaderRow(sheet, fieldHeaders.length);

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "SYNC_SCHEMA",
        targetTab: targetTabName,
        headersCount: fieldHeaders.length,
        spreadsheetUrl: ss.getUrl()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var rowCount = 0;

    // ── CASE 1: BATCH ROWS ARRAY ──
    if (payload.rows && Array.isArray(payload.rows) && payload.rows.length > 0) {
      if (sheet.getLastRow() === 0 && payload.headers && payload.headers.length > 0) {
        sheet.appendRow(payload.headers);
        styleHeaderRow(sheet, payload.headers.length);
      }
      for (var i = 0; i < payload.rows.length; i++) {
        sheet.appendRow(payload.rows[i]);
        rowCount++;
      }
    } 
    // ── CASE 2: SINGLE OBJECT / RECORD ──
    else {
      var recordData = payload.data || payload;
      var ignoredKeys = { targetTab: true, sheetTab: true, tab: true, action: true, webhookUrl: true, customSheetUrl: true };
      
      // Determine existing headers
      var lastCol = sheet.getLastColumn();
      var headers = [];
      if (lastCol > 0 && sheet.getLastRow() > 0) {
        headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
      }

      // If sheet is empty, provision detailed standard headers matching the tab stream
      if (headers.length === 0) {
        var lowerT = targetTabName.toLowerCase();
        if (lowerT.indexOf("event reg") !== -1 || lowerT.indexOf("12 event") !== -1 || lowerT.indexOf("delegate") !== -1 || lowerT.indexOf("14 delegate") !== -1) {
          headers = MASTER_TAB_DEFAULTS.EVENTS;
        } else if (lowerT.indexOf("core team") !== -1 || lowerT.indexOf("team app") !== -1 || lowerT.indexOf("04 team") !== -1) {
          headers = MASTER_TAB_DEFAULTS.CORE_TEAM;
        } else if (lowerT.indexOf("ambassador") !== -1 || lowerT.indexOf("10 campus") !== -1) {
          headers = MASTER_TAB_DEFAULTS.CAMPUS_AMBASSADOR;
        } else if (lowerT.indexOf("contact") !== -1 || lowerT.indexOf("06 contact") !== -1) {
          headers = MASTER_TAB_DEFAULTS.CONTACT;
        } else if (lowerT.indexOf("collab") !== -1 || lowerT.indexOf("partner") !== -1 || lowerT.indexOf("08 collab") !== -1) {
          headers = MASTER_TAB_DEFAULTS.COLLAB;
        } else if (lowerT.indexOf("community") !== -1 || lowerT.indexOf("09 community") !== -1) {
          headers = MASTER_TAB_DEFAULTS.COMMUNITY;
        } else if (lowerT.indexOf("donat") !== -1 || lowerT.indexOf("impact") !== -1 || lowerT.indexOf("20 donat") !== -1) {
          headers = MASTER_TAB_DEFAULTS.DONATIONS;
        } else if (lowerT.indexOf("feedback") !== -1 || lowerT.indexOf("grievance") !== -1 || lowerT.indexOf("23 feed") !== -1 || lowerT.indexOf("24 griev") !== -1) {
          headers = MASTER_TAB_DEFAULTS.FEEDBACK;
        } else {
          for (var k in recordData) {
            if (recordData.hasOwnProperty(k) && !ignoredKeys[k]) {
              headers.push(k);
            }
          }
        }

        if (headers.length > 0) {
          sheet.appendRow(headers);
          styleHeaderRow(sheet, headers.length);
        }
      }

      // ── DYNAMIC COLUMN EXPANSION ──
      // Check if incoming recordData contains custom questions not yet in headers
      var missingKeys = [];
      for (var rk in recordData) {
        if (recordData.hasOwnProperty(rk) && !ignoredKeys[rk]) {
          var found = false;
          var rkAlpha = rk.toLowerCase().replace(/[^a-z0-9]/g, "");
          for (var hIdx = 0; hIdx < headers.length; hIdx++) {
            var hAlpha = String(headers[hIdx]).toLowerCase().replace(/[^a-z0-9]/g, "");
            if (hAlpha === rkAlpha || lookupVal(recordData, headers[hIdx]) !== "") {
              found = true;
              break;
            }
          }
          if (!found && recordData[rk] !== "" && recordData[rk] !== null && recordData[rk] !== undefined) {
            missingKeys.push(rk);
          }
        }
      }

      if (missingKeys.length > 0) {
        var startNewCol = headers.length + 1;
        sheet.getRange(1, startNewCol, 1, missingKeys.length).setValues([missingKeys]);
        styleHeaderRow(sheet, headers.length + missingKeys.length);
        headers = headers.concat(missingKeys);
      }

      // Build row values matching header sequence with fuzzy key lookup
      var rowValues = [];
      for (var colIdx = 0; colIdx < headers.length; colIdx++) {
        var colName = headers[colIdx];
        var val = lookupVal(recordData, colName);
        if (typeof val === "object" && val !== null) {
          val = JSON.stringify(val);
        }
        rowValues.push(val);
      }

      sheet.appendRow(rowValues);
      rowCount = 1;

      // ── DUAL TAB RECORDING FOR COMPANION REGISTERS ──
      var lowerTarget = targetTabName.toLowerCase();
      var companionMap = {
        "core team applications": "04 Team Applications",
        "04 team applications": "Core Team Applications",
        "event registrations": "12 Event Registrations",
        "12 event registrations": "Event Registrations",
        "contact inquiries": "06 Contact Inquiries",
        "06 contact inquiries": "Contact Inquiries",
        "campus ambassadors": "10 Campus Ambassadors",
        "10 campus ambassadors": "Campus Ambassadors",
        "donations": "20 Donations Charity",
        "20 donations charity": "Donations",
        "collab & partnerships": "08 Collaborations",
        "08 collaborations": "Collab & Partnerships",
        "community members": "09 Community Members",
        "09 community members": "Community Members"
      };

      var companionName = companionMap[lowerTarget];
      if (companionName) {
        var companionSheet = ss.getSheetByName(companionName);
        if (companionSheet && companionSheet.getSheetId() !== sheet.getSheetId()) {
          var cLastCol = companionSheet.getLastColumn();
          if (cLastCol > 0 && companionSheet.getLastRow() > 0) {
            var cHeaders = companionSheet.getRange(1, 1, 1, cLastCol).getValues()[0];
            var cRowValues = [];
            for (var cIdx = 0; cIdx < cHeaders.length; cIdx++) {
              var cVal = lookupVal(recordData, cHeaders[cIdx]);
              if (typeof cVal === "object" && cVal !== null) cVal = JSON.stringify(cVal);
              cRowValues.push(cVal);
            }
            companionSheet.appendRow(cRowValues);
          } else {
            companionSheet.appendRow(rowValues);
          }
        }
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      targetTab: targetTabName,
      count: rowCount,
      spreadsheetUrl: ss.getUrl()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var params = (e && e.parameter) || {};
    var action = (params.action || "").toUpperCase();

    // Health ping
    if (action === "PING" || action === "HEALTH") {
      return ContentService.createTextOutput(JSON.stringify({
        status: "ONLINE",
        version: "v2.0-ULTRA",
        platform: "ZENVITRA MASTER OMNI-STREAM",
        spreadsheetUrl: ss.getUrl(),
        tabsCount: ss.getSheets().length
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var tabName = params.tab || "02 Core Registrations";
    var sheet = ss.getSheetByName(tabName) || ss.getActiveSheet();

    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();

    if (lastRow <= 1 || lastCol === 0) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "SUCCESS",
        tab: sheet.getName(),
        count: 0,
        rows: []
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var allData = sheet.getRange(1, 1, lastRow, lastCol).getValues();
    var headers = allData[0];
    var results = [];

    for (var r = 1; r < allData.length; r++) {
      var rowObj = {};
      for (var c = 0; c < headers.length; c++) {
        rowObj[headers[c]] = allData[r][c];
      }
      results.push(rowObj);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "SUCCESS",
      tab: sheet.getName(),
      count: results.length,
      rows: results
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "ERROR",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;

