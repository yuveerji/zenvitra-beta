/**
 * ══════════════════════════════════════════════════════════════════════════
 * ZENITH MODEL UNITED NATIONS 2026 — 1-CLICK BACKUP GOOGLE FORM GENERATOR
 * In case the Zenvitra VPS is ever temporarily unreachable or for fallback.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * HOW TO RUN:
 * 1. Open Google Drive (drive.google.com).
 * 2. Click "+ New" > "More" > "Google Apps Script" (or go to script.google.com).
 * 3. Paste this entire script into the editor.
 * 4. Click the "Run" button (function: createZenithSecretariatGoogleForm).
 * 5. Review the execution log: it will print the live Google Form edit URL, 
 *    published response URL, and the connected Google Sheet URL!
 */

function createZenithSecretariatGoogleForm() {
  Logger.log("Initializing ZENITH MUN 2026 Google Form generation...");

  var formTitle = "ZENITH MODEL UNITED NATIONS 2026 — SECRETARIAT APPLICATION FORM";
  var form = FormApp.create(formTitle);

  form.setTitle(formTitle);
  form.setDescription(
    "A NEW ZEN BEGINS.\n" +
    "PRESENTED BY ZENVITRA | BY YOUTH. FOR YOUTH.\n\n" +
    "Thank you for your interest in joining the Secretariat of ZENITH MUN 2026.\n" +
    "We are looking for committed, responsible and driven individuals who are ready to contribute to building a meaningful conference. Please complete this application with accurate information.\n\n" +
    "──────────────────────────────────────────────────\n" +
    "🏛️ OFFICIAL SELECTION SCORECARD (100% MERIT EVALUATION)\n" +
    "• Relevant Experience: 15%\n" +
    "• Skills and Department Suitability: 20%\n" +
    "• Motivation and Vision: 15%\n" +
    "• Situational Judgement: 20%\n" +
    "• Commitment and Reliability: 20%\n" +
    "• Communication: 10%\n\n" +
    "THREE RECRUITMENT PILLARS:\n" +
    "1. Department-specific questions are mandatory for every applicant.\n" +
    "2. Actual work samples / portfolios are required wherever relevant.\n" +
    "3. Shortlisted candidates are invited for a short interview or practical assignment.\n\n" +
    "PRINCIPLE: ZENITH selects people who can get work done, not simply people who have held impressive titles before."
  );

  form.setCollectEmail(true);
  form.setProgressBar(true);
  form.setAllowResponseEdits(false);

  // ════════════════════════════════════════════════════════════════
  // SECTION 1 — PERSONAL INFORMATION
  // ════════════════════════════════════════════════════════════════
  form.addSectionHeaderItem()
    .setTitle("SECTION 1 — PERSONAL INFORMATION")
    .setHelpText("Please provide accurate personal, academic, and contact details.");

  form.addTextItem().setTitle("1. Full Name").setRequired(true);
  form.addTextItem().setTitle("2. Age").setRequired(true);
  form.addTextItem().setTitle("3. City, State and Country").setRequired(true);
  form.addTextItem().setTitle("4. Email Address").setRequired(true);
  form.addTextItem().setTitle("5. WhatsApp / Contact Number").setRequired(true);
  form.addTextItem().setTitle("6. School / College / Institution and Current Academic Year").setRequired(true);

  // ════════════════════════════════════════════════════════════════
  // SECTION 2 — EXPERIENCE & BACKGROUND
  // ════════════════════════════════════════════════════════════════
  form.addPageBreakItem().setTitle("SECTION 2 — EXPERIENCE & BACKGROUND");

  form.addParagraphTextItem()
    .setTitle("7. Have you participated in any MUN conferences? If yes, mention the number of conferences and your notable experiences.")
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle("8. Have you previously served in an MUN Secretariat, Executive Board or Organising Committee? Mention your roles and responsibilities.")
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle("9. Have you held any leadership positions or been involved in organising events, projects or initiatives outside MUNs? Elaborate briefly.")
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle("10. What are your strongest skills? Mention at least three relevant skills.")
    .setRequired(true);

  // ════════════════════════════════════════════════════════════════
  // SECTION 3 — DEPARTMENT PREFERENCES
  // ════════════════════════════════════════════════════════════════
  var sec3Break = form.addPageBreakItem().setTitle("SECTION 3 — DEPARTMENT PREFERENCES");

  // Department Questions (We create the page break items first so we can bind navigation)
  var pDelegate = form.addPageBreakItem().setTitle("Track: Delegate Affairs & Outreach Practical Assessment");
  var pPR = form.addPageBreakItem().setTitle("Track: Public Relations & Marketing Practical Assessment");
  var pDesign = form.addPageBreakItem().setTitle("Track: Design & Creative Practical Assessment");
  var pMedia = form.addPageBreakItem().setTitle("Track: Media & Communications Practical Assessment");
  var pTech = form.addPageBreakItem().setTitle("Track: Technical & Website Practical Assessment");
  var pEvents = form.addPageBreakItem().setTitle("Track: Events & Conference Operations Practical Assessment");
  var pResearch = form.addPageBreakItem().setTitle("Track: Research & Content Practical Assessment");
  
  var pMotivation = form.addPageBreakItem().setTitle("SECTION 4 — MOTIVATION & VISION");

  var ALL_DEPARTMENTS = [
    "Delegate Affairs & Outreach",
    "Public Relations & Marketing",
    "Design & Creative",
    "Media & Communications",
    "Technical & Website",
    "Events & Conference Operations",
    "Research & Content"
  ];

  function getSecondaryDeptChoices_(primaryDept) {
    return ALL_DEPARTMENTS.filter(function(d) {
      return d !== primaryDept;
    });
  }

  // Now create the Department Choice Item on Section 3 with conditional routing!
  var deptChoiceItem = form.addListItem();
  deptChoiceItem.setTitle("11. Which department would you prefer to work in? (First Preference)")
    .setHelpText("Select your primary department. The form will dynamically direct you to that department's practical questions. Your first and second preferences must be different.")
    .setRequired(true);

  deptChoiceItem.setChoices([
    deptChoiceItem.createChoice("Delegate Affairs & Outreach", pDelegate),
    deptChoiceItem.createChoice("Public Relations & Marketing", pPR),
    deptChoiceItem.createChoice("Design & Creative", pDesign),
    deptChoiceItem.createChoice("Media & Communications", pMedia),
    deptChoiceItem.createChoice("Technical & Website", pTech),
    deptChoiceItem.createChoice("Events & Conference Operations", pEvents),
    deptChoiceItem.createChoice("Research & Content", pResearch)
  ]);

  form.addParagraphTextItem()
    .setTitle("12. Why have you chosen these departments, and what makes you suitable for them?")
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle("13. What relevant tools, software, technical abilities or creative skills do you possess?")
    .setRequired(true);

  // ──────────────────────────────────────────────────────────────
  // 1. Delegate Affairs & Outreach Track
  // ──────────────────────────────────────────────────────────────
  pDelegate.setGoToPage(pMotivation);
  form.addListItem()
    .setTitle("11b. Second Department Preference")
    .setHelpText("Select your fallback department. Excludes your First Preference (Delegate Affairs & Outreach).")
    .setChoiceValues(getSecondaryDeptChoices_("Delegate Affairs & Outreach"))
    .setRequired(true);
  form.addParagraphTextItem().setTitle("Delegate Affairs: How would you attract and engage potential delegates?").setRequired(true);
  form.addParagraphTextItem().setTitle("Delegate Affairs: How would you handle a delegate who is dissatisfied with the registration process?").setRequired(true);
  form.addParagraphTextItem().setTitle("Delegate Affairs: How would you build outreach beyond your immediate MUN network?").setRequired(true);
  form.addParagraphTextItem().setTitle("Delegate Affairs: How would you track and follow up on registrations?").setRequired(true);

  // ──────────────────────────────────────────────────────────────
  // 2. PR & Marketing Track
  // ──────────────────────────────────────────────────────────────
  pPR.setGoToPage(pMotivation);
  form.addListItem()
    .setTitle("11b. Second Department Preference")
    .setHelpText("Select your fallback department. Excludes your First Preference (Public Relations & Marketing).")
    .setChoiceValues(getSecondaryDeptChoices_("Public Relations & Marketing"))
    .setRequired(true);
  form.addParagraphTextItem().setTitle("PR & Marketing: How would you create awareness about ZENITH among students who have never attended an MUN?").setRequired(true);
  form.addParagraphTextItem().setTitle("PR & Marketing: Suggest a campaign idea to increase registrations.").setRequired(true);
  form.addParagraphTextItem().setTitle("PR & Marketing: How would you handle negative feedback or public criticism?").setRequired(true);
  form.addParagraphTextItem().setTitle("PR & Marketing: What makes an MUN's social media presence effective?").setRequired(true);

  // ──────────────────────────────────────────────────────────────
  // 3. Design & Creative Track
  // ──────────────────────────────────────────────────────────────
  pDesign.setGoToPage(pMotivation);
  form.addListItem()
    .setTitle("11b. Second Department Preference")
    .setHelpText("Select your fallback department. Excludes your First Preference (Design & Creative).")
    .setChoiceValues(getSecondaryDeptChoices_("Design & Creative"))
    .setRequired(true);
  form.addTextItem().setTitle("Design & Creative: Which design tools do you use? (e.g. Figma, Photoshop, Illustrator, Premiere)").setRequired(true);
  form.addParagraphTextItem().setTitle("Design & Creative: Share links to three relevant samples of your work (Drive, Behance, Figma portfolio).").setRequired(true);
  form.addParagraphTextItem().setTitle("Design & Creative: How would you maintain visual consistency across all conference creatives?").setRequired(true);
  form.addParagraphTextItem().setTitle("Design & Creative: How would you approach a last-minute creative requirement?").setRequired(true);

  // ──────────────────────────────────────────────────────────────
  // 4. Media & Communications Track
  // ──────────────────────────────────────────────────────────────
  pMedia.setGoToPage(pMotivation);
  form.addListItem()
    .setTitle("11b. Second Department Preference")
    .setHelpText("Select your fallback department. Excludes your First Preference (Media & Communications).")
    .setChoiceValues(getSecondaryDeptChoices_("Media & Communications"))
    .setRequired(true);
  form.addParagraphTextItem().setTitle("Media & Comms: How comfortable are you with formal writing and proofreading?").setRequired(true);
  form.addParagraphTextItem().setTitle("Media & Comms: Draft a short announcement introducing ZENITH MUN 2026 (100-150 words).").setRequired(true);
  form.addParagraphTextItem().setTitle("Media & Comms: How would you ensure official communications remain consistent and accurate?").setRequired(true);
  form.addParagraphTextItem().setTitle("Media & Comms: How would you handle an urgent correction to a published announcement?").setRequired(true);

  // ──────────────────────────────────────────────────────────────
  // 5. Technical & Website Track
  // ──────────────────────────────────────────────────────────────
  pTech.setGoToPage(pMotivation);
  form.addListItem()
    .setTitle("11b. Second Department Preference")
    .setHelpText("Select your fallback department. Excludes your First Preference (Technical & Website).")
    .setChoiceValues(getSecondaryDeptChoices_("Technical & Website"))
    .setRequired(true);
  form.addParagraphTextItem().setTitle("Technical: Mention the programming languages, platforms and tools you know (Next.js, TS, Tailwind, Python, etc.)").setRequired(true);
  form.addParagraphTextItem().setTitle("Technical: Share links to projects, GitHub repos, or websites you have worked on.").setRequired(true);
  form.addParagraphTextItem().setTitle("Technical: How would you approach troubleshooting a website issue during live registration?").setRequired(true);
  form.addParagraphTextItem().setTitle("Technical: How would you ensure information displayed on the website remains accurate?").setRequired(true);

  // ──────────────────────────────────────────────────────────────
  // 6. Events & Conference Operations Track
  // ──────────────────────────────────────────────────────────────
  pEvents.setGoToPage(pMotivation);
  form.addListItem()
    .setTitle("11b. Second Department Preference")
    .setHelpText("Select your fallback department. Excludes your First Preference (Events & Conference Operations).")
    .setChoiceValues(getSecondaryDeptChoices_("Events & Conference Operations"))
    .setRequired(true);
  form.addParagraphTextItem().setTitle("Events Operations: How would you plan and coordinate a large offline conference in Udaipur?").setRequired(true);
  form.addParagraphTextItem().setTitle("Events Operations: What would you include in a conference-day contingency plan?").setRequired(true);
  form.addParagraphTextItem().setTitle("Events Operations: How would you coordinate between the Executive Board, delegates and Secretariat?").setRequired(true);
  form.addParagraphTextItem().setTitle("Events Operations: How would you handle an unexpected technical or stage disruption?").setRequired(true);

  // ──────────────────────────────────────────────────────────────
  // 7. Research & Content Track
  // ──────────────────────────────────────────────────────────────
  pResearch.setGoToPage(pMotivation);
  form.addListItem()
    .setTitle("11b. Second Department Preference")
    .setHelpText("Select your fallback department. Excludes your First Preference (Research & Content).")
    .setChoiceValues(getSecondaryDeptChoices_("Research & Content"))
    .setRequired(true);
  form.addParagraphTextItem().setTitle("Research & Content: How would you research and verify information before publication?").setRequired(true);
  form.addParagraphTextItem().setTitle("Research & Content: What makes a good committee background guide?").setRequired(true);
  form.addParagraphTextItem().setTitle("Research & Content: How would you ensure research material is unbiased and comprehensive?").setRequired(true);
  form.addParagraphTextItem().setTitle("Research & Content: Share a short writing or research sample (Google Doc link or text excerpt).").setRequired(true);

  // ════════════════════════════════════════════════════════════════
  // SECTION 4 — MOTIVATION & VISION
  // ════════════════════════════════════════════════════════════════
  form.addParagraphTextItem().setTitle("14. Why do you want to become a part of the ZENITH MUN 2026 Secretariat?").setRequired(true);
  form.addParagraphTextItem().setTitle("15. What does being a Secretariat member mean to you beyond holding a designation?").setRequired(true);
  form.addParagraphTextItem().setTitle("16. What is one specific contribution or idea you would like to bring to ZENITH MUN 2026?").setRequired(true);

  // ════════════════════════════════════════════════════════════════
  // SECTION 5 — SITUATIONAL JUDGEMENT & COMMITMENT
  // ════════════════════════════════════════════════════════════════
  form.addPageBreakItem().setTitle("SECTION 5 — SITUATIONAL JUDGEMENT & COMMITMENT");
  form.addParagraphTextItem().setTitle("17. If a team member repeatedly fails to complete assigned responsibilities, how would you handle the situation?").setRequired(true);
  form.addParagraphTextItem().setTitle("18. If you are assigned an important task with a tight deadline and encounter unexpected difficulties, what would you do?").setRequired(true);
  form.addParagraphTextItem().setTitle("19. How much time can you realistically dedicate to ZENITH MUN, and how will you balance your responsibilities with academics and other commitments?").setRequired(true);
  form.addParagraphTextItem().setTitle("20. Why should the selection committee choose you over other applicants?").setRequired(true);

  // ════════════════════════════════════════════════════════════════
  // SECTION 6 — RESUME / CURRICULUM VITAE
  // ════════════════════════════════════════════════════════════════
  form.addPageBreakItem().setTitle("SECTION 6 — RESUME / CURRICULUM VITAE");
  
  form.addParagraphTextItem()
    .setTitle("Resume / CV Drive Link (Mandatory)")
    .setHelpText("Please paste a viewable Google Drive link to your updated Resume/CV in PDF format (ensure permissions are set to 'Anyone with link can view'). Your resume should highlight academic background, MUN designations, leadership, and achievements.")
    .setRequired(true);

  form.addTextItem()
    .setTitle("Portfolio / LinkedIn / Work Samples (Optional link)")
    .setHelpText("Optional URL to LinkedIn, portfolio site, or work folder.")
    .setRequired(false);

  // ════════════════════════════════════════════════════════════════
  // FINAL DECLARATION
  // ════════════════════════════════════════════════════════════════
  form.addPageBreakItem().setTitle("FINAL DECLARATION");
  
  form.addCheckboxItem()
    .setTitle("I hereby confirm that the information provided in this application is accurate and complete. I understand that selection into the ZENITH MUN 2026 Secretariat involves responsibility, commitment, teamwork and professionalism.")
    .setChoiceValues(["I Confirm and Agree"])
    .setRequired(true);

  form.addTextItem().setTitle("Applicant's Full Name").setRequired(true);
  form.addTextItem().setTitle("Date of Application").setRequired(true);
  form.addTextItem().setTitle("Digital Signature / Confirmation").setRequired(true);

  // Create and link spreadsheet
  var ss = SpreadsheetApp.create("ZENITH MUN 2026 — Secretariat Master Responses (Backup)");
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  Logger.log("\n══════════════════════════════════════════════════════════════");
  Logger.log("✅ ZENITH MUN 2026 BACKUP GOOGLE FORM CREATED SUCCESSFULLY!");
  Logger.log("• Edit URL: " + form.getEditUrl());
  Logger.log("• Published Public Form URL: " + form.getPublishedUrl());
  Logger.log("• Destination Spreadsheet URL: " + ss.getUrl());
  Logger.log("══════════════════════════════════════════════════════════════\n");
}
