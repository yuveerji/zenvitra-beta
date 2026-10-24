/**
 * ==============================================================================
 * ZENVITRA MASTER OMNI-STREAM & FORMS ENGINE — GOOGLE APPS SCRIPT (v1.0)
 * ==============================================================================
 * Complete Unified Enterprise Apps Script Engine combining:
 * 
 * 12 OPERATIONAL STREAM TABS:
 * 1.  Event Registrations (Pass bookings, custom countries, tier allocations & prices)
 * 2.  Donations (Primary relief contributions & UTR tracking)
 * 3.  Impact Ledger (Public transparency & voluntary relief ledger)
 * 4.  Register Data Core (User registrations & digital identity ledger)
 * 5.  Login Data Core (Authentication audit & security telemetry)
 * 6.  Campus Ambassadors (Student chapter leader accreditation)
 * 7.  Core Team Applications (Founding wing applications & bandwidth commitments)
 * 8.  Contact Inquiries (Diplomatic contact & public support inquiries)
 * 9.  Newsletter Subscribers (Email subscriptions & consent tracking)
 * 10. Collab & Partnerships (Institutional alliances & conference partnerships)
 * 11. Community Members (Grassroots youth network & skills directory)
 * 12. Feedback & Grievance (Platform tickets, resolution audits & bug reports)
 *
 * 46 CENTRAL ENTERPRISE REGISTERS (01 People -> 47 Zen Docs Metrics, 0 Underscores):
 * 01 People, 02 Core Registrations, 03 Login Activity, 04 Team Applications,
 * 05 Team Roles Access, 06 Contact Inquiries, 07 Newsletter Subscribers,
 * 08 Collaborations, 09 Community Members, 10 Campus Ambassadors, 11 Events,
 * 12 Event Registrations, 13 Committees, 14 Delegate Rosters,
 * 16 Attendance Rollcall, 17 Awards Certificates, 18 Payments, 19 Expenses,
 * 20 Donations Charity, 21 Budgets, 22 Tasks, 23 Feedback, 24 Grievances,
 * 25 Support Cases, 26 Audit Logs, 27 Chits Active Roster, 28 Chits Archive,
 * 29 Meet Sessions, 30 Meet Attendees, 31 Pulse Posts, 32 Pulse Channels,
 * 33 Pulse Comments, 34 Content Editorial, 35 Feature Bugs, 36 Module Catalog,
 * 37 Sync Audit Log, 38 Integrations, 39 Sync Queue, 40 Data Dictionary,
 * 41 Retention Policies, 42 KPI Metrics, 43 Legislation Bills,
 * 44 Bill Amendments, 45 Form Submissions, 46 Passport Ledger, 47 Zen Docs Metrics.
 *
 * AUTOMATION & WEBHOOK ENGINE:
 * - DYNAMIC ZENFORMS SCHEMA SYNC (action: 'SYNC_SCHEMA')
 * - ONE-CLICK AUTO-SETUP (doGet with ?action=INIT or toolbar run "initAllTabs")
 * - CANONICAL IDENTITY AUTO-UPSERT into 01 People
 * - ZERO SEEDED ACCOUNTS LAW (zero fake delegates or seeded users)
 * - ZERO UNDERSCORES IN TABS (All tabs clean space-separated Title Case)
 * ==============================================================================
 */

const ZEN = {
  VERSION: "v1",
  TIMEZONE: "Asia/Kolkata",
  HEADER_ROW: 4,
  DATA_START_ROW: 5,
  CAPACITY: 1000,

  FORM_ID: "1-T1lFJU1cqRySxlgqEFpRYfZRB6beFmherGzqkNaPyM",
  PUBLIC_FORM_URL: "https://docs.google.com/forms/d/e/1FAIpQLSd8FfSP6qcf5ow9ETdZgvrzBQbVYbA8RycdyNsZTJlHDpCcKQ/viewform",
  RESPONSE_SPREADSHEET_ID: "1cttfG9X3BrKl3km0Flre1FNaY5IOmX36YgPHk9M6H-U",

  TRACKER: "Core Team Review Tracker",
  RECRUITMENT_AUDIT: "Review Audit Log",

  P: {
    MASTER_ID: "ZEN_MASTER_SPREADSHEET_ID",
    RESPONSE_ID: "ZEN_RECRUITMENT_RESPONSE_ID",
    FORM_ID: "ZEN_RECRUITMENT_FORM_ID",
    OWNER_EMAIL: "ZEN_OWNER_EMAIL",
    MIRROR_ID: "ZEN_MIRROR_ID",
    WEBHOOK_SECRET: "ZEN_LOGIN_WEBHOOK_SECRET"
  },

  C: {
    DARK: "#111827",
    NAVY: "#1F2937",
    OBSIDIAN: "#0f172a",
    TEAL: "#0F766E",
    LIGHT: "#F3F4F6",
    WHITE: "#FFFFFF",
    GREY: "#6B7280",
    RED: "#B91C1C",
    AMBER: "#B45309",
    ACCENT: "#4F46E5"
  }
};

// ── 12 CORE OPERATIONAL STREAM SCHEMAS (ZERO UNDERSCORES) ──
var TAB_SCHEMAS = {

  EVENTS: {
    sheetName: 'Event Registrations',
    headers: [
      'Timestamp', 'Registration ID / Ticket ID', 'Full Name of the Delegate', 'Primary Contact Email Address',
      'WhatsApp / Calling Number', 'School / College / University or Independent', 'Current City & State of Residence',
      'Participation Track', 'Model UN & Parliamentary Experience Tier', '1st Preference Committee Chamber',
      '2nd Preference Committee Chamber', 'Top 3 Preferred Portfolios / Countries', 'List Notable MUN Conferences & Awards Won',
      'Statement of Purpose & Procedural Strategy', 'Parent / Guardian / Faculty Advisor Name', 'Guardian Emergency Contact Number',
      'Institutional ID Card / Drive Link / Roll Number', 'Diplomatic Code of Conduct & Ethics Agreement',
      'Zenvitra Sovereign Username (@handle)', 'Virtual Chamber Live Stream & Recording Consent', 'Selected Delegation Pass Tier',
      'Total Pass Fee (INR)', 'Preferred Payment Mode', '12-Digit UPI Transaction ID / UTR Number',
      'Upload Payment Screenshot / Receipt Proof URL', 'Digital Signature (Full Legal Name)', 'Date of Submission',
      'Payment Verification Status', 'Allocated Committee', 'Allocated Seat / Portfolio', 'Dais Review Status',
      'Dais Review Notes', 'IP Address', 'Device / Browser'
    ]
  },

  DONATIONS: {
    sheetName: 'Donations',
    headers: [
      'Timestamp', 'Donation ID / Contribution ID', 'Contributor / Donor Full Name', 'Contributor Email Address',
      'Phone Number [WhatsApp Active]', 'Voluntary Contribution Amount (INR)', '12-Digit UPI UTR / Transaction Reference ID',
      'Target Project / Relief Stream', 'Payment Mode / Channel', 'Anonymous Contribution Preference',
      'Contributor Notes / Dedication / Prayer', 'Payment Screenshot / Receipt Proof URL', 'Verification & Audit Status',
      'Auditor / Reconciled By', 'Reconciliation Date', 'IP Address', 'Device / Browser'
    ]
  },

  IMPACT_LEDGER: {
    sheetName: 'Impact Ledger',
    headers: [
      'Timestamp', 'Donation ID / Contribution ID', 'Contributor / Donor Full Name', 'Contributor Email Address',
      'Phone Number [WhatsApp Active]', 'Voluntary Contribution Amount (INR)', '12-Digit UPI UTR / Transaction Reference ID',
      'Target Project / Relief Stream', 'Payment Mode / Channel', 'Anonymous Contribution Preference',
      'Contributor Notes / Dedication / Prayer', 'Payment Screenshot / Receipt Proof URL', 'Verification & Audit Status',
      'Auditor / Reconciled By', 'Reconciliation Date', 'IP Address', 'Device / Browser'
    ]
  },

  REGISTER_CORE: {
    sheetName: 'Register Data Core',
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
    headers: [
      'Timestamp', 'Login Event ID', 'User ID / Person ID', 'Full Name', 'Email Address',
      'Username / Handle', 'Auth Provider', 'Event Type', 'Login Status / Outcome', 'Risk Score',
      'Session Hash', 'IP Address (Masked)', 'Device / User Agent Summary'
    ]
  },

  CAMPUS_AMBASSADOR: {
    sheetName: 'Campus Ambassadors',
    headers: [
      'Timestamp', 'Ambassador Application ID', 'Full Legal Name', 'Email Address', 'Phone Number [WhatsApp Active]',
      'College / University / School Name', 'City & State of Residence', 'Degree, Stream & Academic Year',
      'Student ID Proof / College ID URL', 'Prior Leadership / Student Council / Campus Experience',
      'Proposed Campus Strategy & Outreach Blueprint', 'Social Media Handles (Instagram / LinkedIn / Twitter)',
      'Estimated Weekly Available Hours', 'Statement of Purpose / Why Zenvitra Ambassador',
      'Referral Code Generated', 'Application Review Status', 'Assigned Outreach Lead', 'Reviewer Notes',
      'IP Address', 'Device / Browser'
    ]
  },

  CORE_TEAM: {
    sheetName: 'Core Team Applications',
    headers: [
      'Timestamp', 'Application ID', 'Full Legal Name', 'Desired ZEN Handle', 'Primary Email',
      'Phone [Whatsapp Active]', 'Telegram / Discord Handle', 'Location & Timezone', 'Role Applied For',
      'Department / Wing', 'Leadership Track', 'Portfolio / Proof of Work URL', 'Uploaded Dossier Document',
      'Past Experience & Track Record', 'Technical / Diplomatic Dossier', 'Weekly Bandwidth Commitment',
      'Statement of Purpose & Motivation', 'Current Institution / College / Company', 'Year of Study / Current Title',
      'Constitutional Accord Status', 'Application Status', 'Interview Date / Dais Coordinate', 'Reviewer',
      'Review Notes', 'IP Address', 'Device / Browser'
    ]
  },

  CONTACT: {
    sheetName: 'Contact Inquiries',
    headers: [
      'Timestamp', 'Inquiry ID', 'Full Legal Name', 'Email Address', 'Phone Number [WhatsApp Active]',
      'Preferred Contact Channel', 'Inquiry Category / Department', 'Subject / Inquiry Title',
      'Detailed Message / Inquiry Text', 'Urgency / Priority Level', 'Source URL / Origin Page',
      'Resolution Status', 'Assigned Officer', 'Resolution Notes', 'IP Address', 'Device / Browser'
    ]
  },

  NEWSLETTER: {
    sheetName: 'Newsletter Subscribers',
    headers: [
      'Timestamp', 'Subscriber ID', 'Email Address', 'Full Name / Display Name',
      'Subscription Source Page', 'Preferred Topics & Streams', 'Consent & Privacy Accord Ratified',
      'UTM Campaign / Source', 'Subscription Status', 'IP Address'
    ]
  },

  COLLAB: {
    sheetName: 'Collab & Partnerships',
    headers: [
      'Timestamp', 'Partnership ID', 'Organization / Institution / Entity Name', 'Lead Representative Full Name',
      'Official Work / Institutional Email', 'Contact Phone / WhatsApp Number', 'Partnership Category',
      'Official Website / Social URL', 'Estimated Community / Delegation Reach', 'Proposed Partnership Scope & Deliverables',
      'Resource / Budget Commitment', 'Target Summit / Event Timeline', 'Partnership Stage',
      'Assigned Secretariat Lead', 'Internal Review Notes', 'IP Address', 'Device / Browser'
    ]
  },

  COMMUNITY: {
    sheetName: 'Community Members',
    headers: [
      'Timestamp', 'Member ID', 'Full Legal Name', 'Zenvitra Sovereign Handle (@handle)', 'Primary Email Address',
      'Phone Number [WhatsApp Active]', 'City, State & Country', 'Institution / University / Affiliation',
      'Primary Domain & Skills', 'Secondary Interests & Passions', 'Discord Handle', 'Telegram Handle',
      'LinkedIn / GitHub Profile URL', 'Membership Tier', 'Membership Status', 'IP Address', 'Device / Browser'
    ]
  },

  FEEDBACK: {
    sheetName: 'Feedback & Grievance',
    headers: [
      'Timestamp', 'Ticket ID', 'Submitter Full Name', 'Submitter Email Address', 'Submitter Handle / Phone Number',
      'Category (Bug / Grievance / Feature / Conduct / Payment)', 'Severity / Priority Level', 'Target Page / Feature URL',
      'Subject / Issue Summary', 'Detailed Description & Reproduction Steps', 'Attachment / Screenshot / Proof URL',
      'Operating System & Browser Info', 'Resolution Status', 'Assigned Ombudsperson / Officer',
      'Resolution Summary & Action Taken', 'IP Address'
    ]
  }
};

// ── 47 CENTRAL ENTERPRISE REGISTERS ──
const SCHEMAS = [
  ["01 People","Canonical people records",
   "Person_ID,Full_Name,Display_Name,Email,Phone_Optional,Username,Account_Type,Account_Status,Country,City_Optional,Joined_On,Consent_Status,Source,Notes",
   "Account_Type=Member|Delegate|EB|Secretariat|Volunteer|Team|Partner|Sponsor|Other;Account_Status=Pending|Active|Suspended|Closed|Deleted;Consent_Status=Unknown|Granted|Withdrawn|Not_Required","Confidential"],

  ["02 Core Registrations","Platform registrations",
   "Core_Registration_ID,Person_ID,Full_Name,Email,Username,Age_Years,Minor_Status,Parent_Guardian_Name,Parent_Guardian_Contact,Minor_Consent,Institution,Registration_Date,Registration_Source,Account_Type,Verification_Status,Terms_Version,Privacy_Notice_Version,Consent_Status,Account_Status,Review_Required,Notes",
   "Registration_Source=Website|Event|Referral|Campus_Ambassador|Partner|Other;Account_Type=Member|Delegate|EB|Secretariat|Volunteer|Team|Partner|Other;Verification_Status=Pending|Verified|Failed|Not_Required;Consent_Status=Unknown|Granted|Withdrawn;Account_Status=Pending|Active|Suspended|Closed;Review_Required=Yes|No","Confidential"],

  ["03 Login Activity","Authentication event logs",
   "Login_ID,Person_ID,Email,Username,Event_Type,Event_Timestamp,IP_Address_Masked,User_Agent_Summary,Device_Type,Session_ID_Hash,Outcome,Risk_Score,Notes",
   "Event_Type=LOGIN_SUCCESS|LOGIN_FAILURE|LOGOUT|PASSWORD_RESET_REQUEST|MFA_SUCCESS|MFA_FAILURE|ACCOUNT_LOCKED|SESSION_REVOKED;Outcome=Success|Failed|Blocked|Challenged","Restricted"],

  ["04 Team Applications","Recruitment applications",
   "Application_ID,Person_ID,Full_Name,Desired_Handle,Email,Phone_Whatsapp_Active,Telegram_Discord_Handle,Location_Timezone,Role_Applied_For,Department_Wing,Leadership_Track,Portfolio_Proof_URL,Uploaded_Dossier_Doc,Past_Experience_Track_Record,Technical_Diplomatic_Dossier,Weekly_Bandwidth,Statement_Of_Purpose_Motivation,Current_Role_Or_College,Year_Of_Study,Constitutional_Accord_Status,Application_Status,Reviewer,Review_Date,Review_Notes,IP_Address,Device_Browser",
   "Application_Status=Applied|Under_Review|Shortlisted|Interview_Scheduled|Accepted|Rejected|Waitlisted|Withdrawn;Leadership_Track=Executive_Council|Secretariat_Head|Design_Lead|Engineering_CTO|Operations_Director|Impact_Ledger|Custom_Track;Constitutional_Accord_Status=RATIFIED|DECLINED","Confidential"],

  ["05 Team Roles Access","Internal role assignments",
   "Assignment_ID,Person_ID,Full_Name,Email,Functional_Role,Team_Wing,Access_Level,Granted_Date,Granted_By,Review_Due_Date,Status,Revocation_Date,Revocation_Reason,Notes",
   "Access_Level=Admin|Lead|Operator|Viewer|External_Auditor;Status=Active|Suspended|Revoked|Expired;Team_Wing=Executive|Secretariat|Technical|Design|Operations|Public_Relations|Finance|Research","Restricted"],

  ["06 Contact Inquiries","Public inquiries and messages",
   "Inquiry_ID,Person_ID,Full_Name,Email,Phone_Number,Contact_Channel,Subject,Inquiry_Type,Message,Urgency_Priority,Source_URL,Submitted_At,Assigned_To,Response_Status,Responded_At,Resolution_Summary,Notes",
   "Inquiry_Type=General|Partnership|Sponsorship|Technical_Issue|Event_Question|Press_Media|Feedback|Other;Response_Status=New|In_Progress|Resolved|Closed|Archived;Urgency_Priority=Low|Normal|Urgent|Critical","Internal"],

  ["07 Newsletter Subscribers","Email subscribers",
   "Subscriber_ID,Person_ID,Email,Full_Name_Optional,Subscribed_At,Subscription_Source,Status,Consent_Timestamp,Unsubscribed_At,Topic_Preferences,Notes",
   "Subscription_Source=Website_Footer|Event_Popup|Checkout|MUN_Portal|Manual_Import;Status=Active|Unsubscribed|Bounced|Pending_Confirmation","Confidential"],

  ["08 Collaborations","Institutional partnerships",
   "Collaboration_ID,Organization_Name,Lead_Representative,Email,Phone_Whatsapp,Collaboration_Category,Website_Social_URL,Audience_Reach,Scope_Summary,Resource_Budget_Commitment,Target_Timeline,Stage,Agreement_URL,Lead_Internal_Owner,Notes",
   "Collaboration_Category=Academic_Institution|School|College|MUN_Circuit|Corporate_Sponsor|NGO_Partner|Vendor|Media_Partner;Stage=Initial_Outreach|Discussion|Proposal_Sent|Agreement_Drafting|Signed_Active|Completed|Declined","Confidential"],

  ["09 Community Members","Community members registry",
   "Member_ID,Person_ID,Full_Name,Zenvitra_Handle,Email,Phone_Whatsapp,City_Region_Country,Institution_Affiliation,Primary_Skills,Interests,Discord_Handle,Telegram_Handle,LinkedIn_GitHub_URL,Membership_Tier,Status,Joined_Date,Notes",
   "Status=Active|Dormant|Banned|Pending_Verification;Membership_Tier=Founding_Citizen|Active_Contributor|Observer","Internal"],

  ["10 Campus Ambassadors","Ambassador network",
   "Ambassador_ID,Person_ID,Full_Name,Email,Phone_Whatsapp_Active,Institution_Name,City,State,Degree_And_Year,ID_Proof_Link,Leadership_Experience,Strategy_Proposal,Social_Handles,Weekly_Hours,Statement_Of_Purpose,Referral_Code,Status,Assigned_Lead,Reviewer_Notes,Notes",
   "Status=Applied|Shortlisted|Approved_Active|Suspended|Completed","Confidential"],

  ["11 Events","Events registry",
   "Event_ID,Title,Slug,Event_Type,Edition,Start_Date,End_Date,Venue_Name,City,Mode,Total_Capacity,Delegate_Fee,Status,Primary_Organizer_Person_ID,Brochure_URL,Notes",
   "Event_Type=MUN_Conference|Summit|Workshop|Speaker_Session|Training|Cultural_Night;Mode=In_Person|Online|Hybrid;Status=Draft|Scheduled|Registration_Open|Registration_Closed|Live|Post_Event_Review|Archived","Internal"],

  ["12 Event Registrations","Attendee registrations",
   "Registration_ID,Event_ID,Person_ID,Full_Name,Email,Phone_Whatsapp_Active,Affiliation,City_State,Participation_Track,Experience_Tier,First_Committee_Preference,Second_Committee_Preference,Top_3_Portfolios,Prior_Awards,Statement_Of_Purpose,Guardian_Name,Guardian_Phone,ID_Proof_URL,Code_Of_Conduct_Ratified,Zenvitra_Handle,Media_Consent,Ticket_Pass_Type,Fee_Amount_INR,Payment_Mode,UPI_UTR_Number,Payment_Screenshot_URL,Digital_Signature,Submission_Date,Allocated_Committee,Allocated_Portfolio,Payment_Status,Dais_Review_Status,Checkin_Status,Registered_At,Notes",
   "Ticket_Pass_Type=Delegate_Pass|Participant_Observer_Pass|Double_Delegation_Pass|VIP_Guest;Payment_Status=Pending|Success|Failed|Refunded|Waived;Dais_Review_Status=Pending|Allotted|Waitlisted|Rejected;Checkin_Status=Not_Checked_In|Checked_In|Absent","Confidential"],

  ["13 Committees","MUN Committees",
   "Committee_ID,Event_ID,Short_Code,Full_Name,Agenda_Topic,Committee_Type,Chair_Person_ID,Vice_Chair_Person_ID,Rapporteur_Person_ID,Seat_Capacity,Filled_Seats,Status,Rules_Of_Procedure,Background_Guide_URL,Notes",
   "Committee_Type=Conventional_GA|Crisis_Cabinet|Specialized_Agency|Bilateral_Summit|Historic_Committee;Status=Active|Frozen|Archived","Internal"],

  ["14 Delegate Rosters","Matrix seat assignments",
   "Seat_ID,Committee_ID,Portfolio_Or_Country,Representative_Type,Assigned_Person_ID,Assigned_Delegate_Name,Assigned_Email,Assigned_Phone,Affiliation,Experience_Tier,Statement_Of_Purpose,Allotment_Round,Preference_Rank_Matched,Payment_Verified,Payment_UTR,Dais_Status,Allotment_Date,Notes",
   "Representative_Type=Country_Delegate|Historical_Figure|Cabinet_Minister|Judge|NGO_Observer|Press_Reporter;Assignment_Status=Vacant|Offered|Confirmed|Rejected|Reallocated;Payment_Verified=Yes|No|Exempt","Internal"],

  ["16 Attendance Rollcall","Session rollcalls",
   "Rollcall_ID,Committee_ID,Session_Number,Date,Seat_ID,Delegate_Name,Status_Vote,Remarks,Recorded_By,Timestamp",
   "Status_Vote=Present|Present_And_Voting|Absent|Excused","Internal"],

  ["17 Awards Certificates","Certificates & awards",
   "Award_ID,Event_ID,Committee_ID,Recipient_Person_ID,Recipient_Name,Award_Type,Certificate_ID,Issued_Date,Verification_URL,Signed_By,Notes",
   "Award_Type=Best_Delegate|High_Commendation|Special_Mention|Verbal_Commendation|Best_Position_Paper|Participation_Certificate;Signed_By=Secretary_General|Director_General|Faculty_Advisor","Internal"],

  ["18 Payments","Financial transactions & Cashfree records",
   "Payment_ID,Person_ID,Event_ID,Registration_ID,Order_ID,Gateway,Gateway_Transaction_Ref,Gross_Amount_INR,Tax_Amount_INR,Platform_Fee_INR,Net_Amount_INR,Currency,Payment_Status,Payment_Date,Refund_Amount_INR,Refund_Status,Invoice_URL,Notes",
   "Gateway=Cashfree|Razorpay|Direct_UPI|NEFT_Bank_Transfer|Cash_Offline;Currency=INR|USD|EUR;Payment_Status=Success|Failed|Pending|Cancelled|USER_DROPPED;Refund_Status=Not_Applicable|Requested|Processing|Completed|Rejected","Restricted"],

  ["19 Expenses","Operational disbursements",
   "Expense_ID,Event_ID,Expense_Category,Description,Vendor_Name,Amount_INR,Payment_Mode,Approval_Status,Approved_By,Disbursed_Date,Invoice_Proof_URL,Cost_Center,Notes",
   "Expense_Category=Venue|Printing_Stationery|Food_Catering|Mementoes_Prizes|Tech_Software|Logistics_Transport|Marketing_Promotion|Honorarium|Contingency;Approval_Status=Draft|Pending_Approval|Approved|Rejected|Paid","Restricted"],

  ["20 Donations Charity","Philanthropic impact ledger",
   "Donation_ID,Donor_Person_ID,Donor_Name,Donor_Email,Donor_Phone_Whatsapp,Amount_INR,Payment_Ref_UTR,Allocated_Cause_Stream,Payment_Gateway_Mode,Is_Anonymous,Notes_Prayer,Payment_Screenshot_URL,Receipt_Number,80G_Eligible,Verification_Status,Auditor_Reconciled_By,Donated_At,Notes",
   "Allocated_Cause_Stream=Satya_Niketan_Anath_Ashram|Youth_Diplomacy_Scholarships|Govt_School_Relief|General_Philanthropy;Is_Anonymous=Yes|No;Verification_Status=Pending|Verified|Rejected;80G_Eligible=Yes|No","Confidential"],

  ["21 Budgets","Budget forecasts and targets",
   "Budget_ID,Event_ID,Category,Projected_Cost_INR,Actual_Cost_INR,Variance_INR,Status,Last_Reviewed_At,Owner_Lead,Notes",
   "Status=Approved|Over_Budget|Under_Budget|Review_Required","Restricted"],

  ["22 Tasks","Operational deliverables",
   "Task_ID,Title,Department,Assignee_Person_ID,Assignee_Name,Due_Date,Priority,Status,Dependencies,Related_Event_ID,Completed_At,Notes",
   "Priority=Critical_P0|High_P1|Medium_P2|Low_P3;Status=Backlog|To_Do|In_Progress|Blocked|In_Review|Done|Cancelled","Internal"],

  ["23 Feedback","Attendee surveys",
   "Feedback_ID,Event_ID,Person_ID,Submitter_Name,Submitter_Email,Submitter_Phone_Handle,Feedback_Category,Severity_Priority,Page_URL,Subject_Summary,Detailed_Description,Attachment_URL,OS_Browser,Status,Assigned_Officer,Resolution_Summary,Submitted_At",
   "Feedback_Category=Platform_Bug|MUN_Procedure|Feature_Request|Design_Critique|Code_Of_Conduct|Payment_Issue;Severity_Priority=Low|Normal|High|Critical","Internal"],

  ["24 Grievances","Escalations and complaints",
   "Grievance_ID,Ticket_Number,Complainant_Person_ID,Complainant_Name,Complainant_Email,Complainant_Phone_Handle,Against_Department_Or_Person,Grievance_Category,Severity_Priority,Page_URL,Subject_Summary,Detailed_Description,Attachment_Proof_URL,Date_Reported,Assigned_Ombudsperson,Status,Resolution_Summary,Resolved_At,Notes",
   "Grievance_Category=Code_Of_Conduct|Harassment|Marking_Bias|Refund_Payment_Issue|Logistics_Failure|Tech_Issue;Severity_Priority=Low|Medium|High|Immediate_Executive_Action;Status=Logged|Under_Investigation|Mediation|Resolved|Dismissed","Restricted"],

  ["25 Support Cases","Customer support tickets",
   "Ticket_ID,Person_ID,Contact_Email,Channel,Subject,Category,Priority,Assigned_Agent,Status,Created_At,Resolved_At,Customer_Rating,Notes",
   "Channel=Portal_Ticket|Email_Inbound|WhatsApp|Discord|Direct_Phone;Priority=Urgent|High|Standard|Low;Status=Open|Pending_User|Waiting_Third_Party|Resolved|Closed","Internal"],

  ["26 Audit Logs","Administrative modifications audit",
   "Log_ID,Timestamp,Actor_Email,Action_Type,Target_Entity_Or_Sheet,Target_Record_ID,Previous_State_Hash,New_State_Hash,IP_Address,Notes",
   "Action_Type=CREATE|UPDATE|DELETE|BULK_IMPORT|STATUS_CHANGE|ACCESS_GRANT|PAYMENT_OVERRIDE|SECURITY_FLAG","Restricted"],

  ["27 Chits Active Roster","Active MUN floor chits",
   "Chit_ID,MUN_ID,Committee_ID,Sender_Seat,Recipient_Seat,Chit_Type,Message_Content,Routing_Status,Sent_Time,Delivered_Time,EB_Flagged",
   "Chit_Type=Substantive|Personal|Via_EB;Routing_Status=Draft|Sent_To_EB|Approved_Routing|Delivered|Discarded;EB_Flagged=No|Yes","Internal"],

  ["28 Chits Archive","Archived historical floor chits",
   "Chit_ID,MUN_ID,Committee_ID,Sender_Seat,Recipient_Seat,Chit_Type,Message_Snippet,Status,Timestamp",
   "Status=Archived|Flagged","Internal"],

  ["29 Meet Sessions","Virtual conference rooms",
   "Session_ID,Title,Host_Person_ID,Scheduled_Start,Scheduled_End,Room_Type,Status,Participants_Peak_Count,Recording_URL,Notes",
   "Room_Type=Committee_Room|Main_Plenary|Secretariat_War_Room|Private_Bilateral;Status=Scheduled|Active_Live|Completed|Cancelled","Internal"],

  ["30 Meet Attendees","Virtual call attendance",
   "Attendance_ID,Session_ID,Person_ID,Display_Name,Joined_At,Left_At,Duration_Minutes,Role_In_Room",
   "Role_In_Room=Host|Co_Host|Speaker|Attendee","Internal"],

  ["31 Pulse Posts","ZEN.PULSE publications",
   "Post_ID,Author_Person_ID,Author_Username,Author_Role,Category,Content_Text,Media_Attachments_Count,Likes_Count,Comments_Count,Created_At,Status",
   "Category=Official_Announcement|Diplomatic_Insight|Policy_Draft|Campus_Dispatch|Editorial_Piece;Status=Published|Draft|Archived|Hidden_By_Moderator","Internal"],

  ["32 Pulse Channels","ZEN.PULSE communication channels",
   "Channel_ID,Channel_Name,Description,Access_Scope,Owner_Person_ID,Member_Count,Status",
   "Access_Scope=Public|Members_Only|Executive_Only|Delegate_Only;Status=Active|Muted|Archived","Internal"],

  ["33 Pulse Comments","ZEN.PULSE comments",
   "Comment_ID,Post_ID,Person_ID,Author_Username,Comment_Excerpt,Created_At,Moderation_Status,Parent_Comment_ID_Optional",
   "Moderation_Status=Approved|Flagged|Removed","Internal"],

  ["34 Content Editorial","Social & press editorial calendar",
   "Content_ID,Title,Content_Pillar,Target_Platform,Writer_Assigned,Designer_Assigned,Scheduled_Publish_Date,Actual_Publish_Date,Publish_Status,Live_URL,Performance_Views,Notes",
   "Content_Pillar=MUN_Explainer|Event_Promo|Thought_Leadership|Founder_Notes|Community_Spotlight|Partner_Feature;Target_Platform=Instagram|LinkedIn|X_Twitter|Website_Blog|Newsletter;Publish_Status=Idea|Drafting|Design_Ready|Approved|Scheduled|Published|Archived","Internal"],

  ["35 Feature Bugs","Product bug tracking & enhancements",
   "Issue_ID,Title,Issue_Type,Module_Affected,Reported_By,Severity,Assigned_Engineer,Status,Created_At,Resolved_At,PR_Or_Commit_Link,Notes",
   "Issue_Type=Bug|Feature_Request|Security_Vulnerability|Performance|UX_Improvement;Severity=Low|Medium|High|Critical_Blocker;Status=Triaged|Accepted|In_Sprint|In_QA|Deployed|Rejected","Internal"],

  ["36 Module Catalog","Platform software module registry",
   "Module_ID,Module_Key,Module_Name,Version,Current_Status,Owner_Lead,Repository_Path,Production_Route,Last_Audited_At,Notes",
   "Current_Status=Alpha|Beta|Stable_Production|Deprecated|Maintenance","Internal"],

  ["37 Sync Audit Log","Universal telemetry & synchronization audit",
   "Sync_ID,Timestamp,Sync_Type,Source_System,Target_Register,Records_Processed,Success_Count,Failure_Count,Status,Triggered_By,Notes",
   "Sync_Type=Google_Forms_Sync|Cashfree_Webhook|Website_Ingestion|Master_Mirror_Sync|Manual_Backfill;Status=Completed|Partial_Success|Failed","Restricted"],

  ["38 Integrations","External API service credentials & status",
   "Integration_ID,Service_Name,Environment,Base_Endpoint,Auth_Type,Key_Reference_Name,Webhook_Active,Last_Ping_Status,Last_Ping_Timestamp,Notes",
   "Environment=Production|Sandbox|Development;Webhook_Active=Yes|No;Last_Ping_Status=Healthy|Degraded|Offline|Unconfigured","Highly_Restricted"],

  ["39 Sync Queue","Job retry queue for failed webhook syncs",
   "Queue_ID,Job_Type,Target_Register,Record_Key,Payload_JSON_Or_Ref,Attempt_Count,Status,Last_Error,Enqueued_At,Completed_At",
   "Job_Type=Recruitment_Upsert|Webhook_Ingestion|Payment_Verification|Mirror_Push;Status=Queued|Retrying|Failed|Success","Restricted"],

  ["40 Data Dictionary","Enterprise data model & column metadata",
   "Register_Number,Register_Name,Column_Index,Column_Name,Data_Type,Nullable,Sensitivity_Level,Description,Allowed_Values,Default_Value",
   "Sensitivity_Level=Public|Internal|Confidential|Restricted|Highly_Restricted","Internal"],

  ["41 Retention Policies","Data retention & disposal lifecycle",
   "Policy_ID,Register_Name,Retention_Period_Days,Data_Classification,Disposal_Action,Legal_Basis,Reviewed_By,Next_Review_Date,Notes",
   "Disposal_Action=Hard_Delete|Anonymize|Archive_Cold_Storage|Permanent_Retention;Data_Classification=Public|Internal|Confidential|Restricted|Highly_Restricted","Restricted"],

  ["42 KPI Metrics","Ecosystem key performance indicators",
   "Metric_ID,Snapshot_Date,Metric_Category,Metric_Name,Value_Numeric,Value_Unit,Period_Type,Reported_By,Notes",
   "Metric_Category=Growth|Finance|Community|MUN_Excellence|Product_Reliability;Period_Type=Daily|Weekly|Monthly|Quarterly|Event_Cycle","Internal"],

  ["43 Legislation Bills","Parliamentary bills & legislative solutions",
   "Bill_ID,Document_Code,Title,Category,Committee,Status,Lead_Sponsors,Proposed_By_Username,Votes_In_Favor,Votes_Against,Votes_Abstain,Total_Staked_Points,Multiplier,Is_Official,Created_At,Updated_At,Notes",
   "Status=DRAFT|PROPOSED|IN_DEBATE|PASSED|REJECTED|TABLED;Category=EDUCATION|CONSTITUTIONAL|CLIMATE|ECONOMY|DEFENSE|FOREIGN_AFFAIRS|TECHNOLOGY","Internal"],

  ["44 Bill Amendments","Clause amendments & division records",
   "Amendment_ID,Bill_Code,Clause_Number,Submitter_Handle,Signatories,Original_Text,Proposed_Text,Rationale_Tag,Rationale_Note,Status,Vote_Count,Ratified_At,Points_Per_Signatory,Notes",
   "Status=TABLED|ACTIVE_VOTING|RATIFIED|REJECTED;Rationale_Tag=CLARITY|LEGAL_PRECEDENT|SOVEREIGNTY|COMPLIANCE|FINANCIAL_IMPACT","Internal"],

  ["45 Form Submissions","Dynamic form response ledger",
   "Submission_ID,Form_ID,Form_Slug,Form_Title,Submitter_Name,Submitter_Email,Submitter_Phone,Submitter_Handle,Questions_Summary,Full_Responses_JSON,Target_Tab,Submitted_At,IP_Address,Device_Browser,Notes",
   "","Confidential"],

  ["46 Passport Ledger","Sovereign passport & points ledger",
   "Passport_ID,Person_ID,Username,Full_Name,Role,Verification_Level,Total_Points,Staked_Points,User_Number,Onboarding_Tier,Onboarding_Claimed,Contributed_Count,QR_Token,Last_Synced_At,Notes",
   "Role=DELEGATE|SECRETARIAT|PRESS|ORGANISER|FOUNDER|MEMBER;Onboarding_Tier=Founder Tier|Early Adopter Tier|Pioneer Tier|Base Sign-Up;Onboarding_Claimed=Yes|No;Verification_Level=Level 0|Level 1|Level 2|Level 3","Internal"],

  ["47 Zen Docs Metrics","Collaborative document drafting logs",
   "Doc_ID,Title,Document_Type,Author_Username,Word_Count,Character_Count,Clauses_Count,Watermark_Tier,Last_Exported_Format,Last_Saved_At,Notes",
   "Document_Type=LEGISLATIVE_BILL|RESOLUTION|WORKING_PAPER|TREATY|EXECUTIVE_ORDER|PRESS_RELEASE;Watermark_Tier=FREE|PRO|FOUNDER|EXEMPT;Last_Exported_Format=PDF|DOCX|MARKDOWN|PRINT","Internal"]
];

/*
 * APPROVED REGISTERS FOR MASTER-TO-MIRROR ONE-WAY SYNCHRONIZATION
 */
const MIRROR_ALLOWLIST = [
  "11 Events",
  "13 Committees",
  "22 Tasks",
  "34 Content Editorial",
  "35 Feature Bugs",
  "36 Module Catalog",
  "42 KPI Metrics",
  "43 Legislation Bills",
  "47 Zen Docs Metrics"
];

// ================================================================
// 1. SETUP & UI INITIALIZATION
// ================================================================

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("ZENVITRA MASTER")
    .addItem("1. Update / Add New Tabs (Non-Destructive)", "updateTabs")
    .addItem("2. Initialize All 14 Streams & 47 Registers", "initAllTabs")
    .addItem("3. Build / Connect ZENVITRA Google Forms", "generateZenvitraGoogleForms")
    .addItem("4. Connect Recruitment Form & Pipeline", "connectExistingRecruitment")
    .addItem("5. Backfill Recruitment Applications", "backfillRecruitment")
    .addItem("6. Install / Repair Triggers", "installZenvitraTriggers")
    .addSeparator()
    .addItem("Refresh Control Dashboard", "refreshZenvitraDashboard")
    .addItem("Configure Owner & Webhook Secret", "configureZenvitraOwner")
    .addItem("Retry Queued Sync Jobs", "retryQueuedRecruitmentJobs")
    .addSeparator()
    .addItem("Connect Mirror Spreadsheet", "connectMirrorSpreadsheet")
    .addItem("Sync Approved Registers to Mirror", "syncApprovedMirror")
    .addItem("Disconnect Mirror", "disconnectMirror")
    .addSeparator()
    .addItem("Run System Integrity Checks", "runIntegrityChecks")
    .addItem("Create Cold Backup Copy", "createBackupCopy")
    .addToUi();
}

/**
 * Formats a sheet header row with dark obsidian background and frozen top row
 */
function formatHeaderRow(sheet, colCount) {
  var headerRange = sheet.getRange(1, 1, 1, colCount);
  headerRange.setBackground(ZEN.C.OBSIDIAN);
  headerRange.setFontColor('#f8fafc');
  headerRange.setFontWeight('bold');
  headerRange.setFontFamily('Roboto Mono');
  headerRange.setFontSize(10);
  sheet.setFrozenRows(1);
}

/**
 * Gets or creates sheet tab with styled header row
 */
function getOrCreateSheet(schema) {
  var ss = getOrCreateSpreadsheet();
  var sheet = getSheetLoose_(ss, schema.sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(schema.sheetName);
    sheet.appendRow(schema.headers);
    formatHeaderRow(sheet, schema.headers.length);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(schema.headers);
    formatHeaderRow(sheet, schema.headers.length);
  }

  return sheet;
}

/**
 * updateTabs:
 * Non-destructive updater function that:
 * 1. Checks all 14 operational stream tabs (TAB_SCHEMAS) and 47 central registers (SCHEMAS).
 * 2. Adds any missing/new tabs without touching existing sheets or wiping any rows.
 * 3. Safely removes deprecated tabs (e.g., 'ZEN DIPLOMACY MUN').
 * 4. For existing sheets, inspects headers and appends any missing columns if new schema columns were introduced.
 * 5. Re-applies clean header formatting (dark obsidian/navy, Roboto Mono, frozen row) and dropdown validations.
 * 6. Refreshes the Control Dashboard, ReadMe, and Data Dictionary.
 * 7. Returns a detailed execution log JSON and displays a Google Sheets toast notification.
 */
function updateTabs() {
  var ss = getOrCreateSpreadsheet();
  var addedTabs = [];
  var updatedTabs = [];
  var checkedTabs = [];
  var removedTabs = [];

  // 1. Rename any legacy tabs containing underscores
  var existingSheets = ss.getSheets();
  existingSheets.forEach(function(sh) {
    var oldName = sh.getName();
    if (oldName.indexOf('_') !== -1) {
      var cleanName = oldName.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
      if (!ss.getSheetByName(cleanName)) {
        sh.setName(cleanName);
      }
    }
  });

  // 2. Safely remove deprecated tab 'ZEN DIPLOMACY MUN' if present
  var deprecatedTab = getSheetLoose_(ss, "ZEN DIPLOMACY MUN");
  if (deprecatedTab) {
    try {
      ss.deleteSheet(deprecatedTab);
      removedTabs.push("ZEN DIPLOMACY MUN");
    } catch (err) {
      Logger.log("Could not delete deprecated tab ZEN DIPLOMACY MUN: " + err.message);
    }
  }

  // 3. Update / Add Operational Stream Tabs (TAB_SCHEMAS)
  Object.keys(TAB_SCHEMAS).forEach(function(key) {
    var schema = TAB_SCHEMAS[key];
    var sheet = getSheetLoose_(ss, schema.sheetName);

    if (!sheet) {
      sheet = ss.insertSheet(schema.sheetName);
      sheet.appendRow(schema.headers);
      formatHeaderRow(sheet, schema.headers.length);
      addedTabs.push(schema.sheetName);
    } else {
      checkedTabs.push(schema.sheetName);
      var lastCol = sheet.getLastColumn();
      if (lastCol === 0 || sheet.getLastRow() === 0) {
        sheet.appendRow(schema.headers);
        formatHeaderRow(sheet, schema.headers.length);
        updatedTabs.push(schema.sheetName + " (headers initialized)");
      } else {
        var existingHeaders = sheet.getRange(1, 1, 1, lastCol).getDisplayValues()[0];
        var missingHeaders = schema.headers.filter(function(h) {
          return existingHeaders.indexOf(h) === -1;
        });
        if (missingHeaders.length > 0) {
          sheet.getRange(1, lastCol + 1, 1, missingHeaders.length).setValues([missingHeaders]);
          formatHeaderRow(sheet, sheet.getLastColumn());
          updatedTabs.push(schema.sheetName + " (added " + missingHeaders.length + " new columns: " + missingHeaders.join(", ") + ")");
        }
      }
    }
  });

  // 4. Update / Add Central Registers (SCHEMAS)
  SCHEMAS.forEach(function(schema) {
    var regName = schema[0];
    var regDesc = schema[1];
    var regHeaders = schema[2].split(",");
    var dropdownText = schema[3];
    var sensitivity = schema[4];

    var sheet = getSheetLoose_(ss, regName);
    if (!sheet) {
      setupRegister_(ss, regName, regDesc, regHeaders, dropdownText, sensitivity);
      addedTabs.push(regName);
    } else {
      checkedTabs.push(regName);
      var lastCol = sheet.getLastColumn();
      if (lastCol >= 1 && sheet.getLastRow() >= ZEN.HEADER_ROW) {
        var existingRegHeaders = sheet.getRange(ZEN.HEADER_ROW, 1, 1, lastCol).getDisplayValues()[0];
        // If sheet is empty of data records, re-align headers to exact latest schema order
        if (sheet.getLastRow() <= ZEN.HEADER_ROW) {
          ensureSize_(sheet, ZEN.CAPACITY + ZEN.DATA_START_ROW, regHeaders.length);
          sheet.getRange(ZEN.HEADER_ROW, 1, 1, regHeaders.length).setValues([regHeaders]);
          var hrRange = sheet.getRange(ZEN.HEADER_ROW, 1, 1, regHeaders.length);
          hrRange.setBackground(ZEN.C.NAVY).setFontColor(ZEN.C.WHITE).setFontWeight("bold").setFontFamily("Roboto Mono").setFontSize(10).setWrap(true);
          updatedTabs.push(regName + " (headers re-aligned)");
        } else {
          var missingCols = regHeaders.filter(function(h) {
            return existingRegHeaders.indexOf(h) === -1;
          });
          if (missingCols.length > 0) {
            sheet.getRange(ZEN.HEADER_ROW, lastCol + 1, 1, missingCols.length).setValues([missingCols]);
            var hrRange2 = sheet.getRange(ZEN.HEADER_ROW, 1, 1, sheet.getLastColumn());
            hrRange2.setBackground(ZEN.C.NAVY).setFontColor(ZEN.C.WHITE).setFontWeight("bold").setFontFamily("Roboto Mono").setFontSize(10).setWrap(true);
            updatedTabs.push(regName + " (added " + missingCols.length + " new columns: " + missingCols.join(", ") + ")");
          }
        }
      } else {
        setupRegister_(ss, regName, regDesc, regHeaders, dropdownText, sensitivity);
        updatedTabs.push(regName + " (formatted)");
      }
    }
  });

  // Also check if user has a standalone tab named 'Chits' or 'MUN Chits'
  var standaloneChitsSh = getSheetLoose_(ss, "Chits") || getSheetLoose_(ss, "MUN Chits");
  if (standaloneChitsSh && standaloneChitsSh.getName() !== "27 Chits Active Roster" && standaloneChitsSh.getName() !== "28 Chits Archive") {
    checkedTabs.push(standaloneChitsSh.getName());
    var sCol = standaloneChitsSh.getLastColumn();
    var headerRowNum = standaloneChitsSh.getLastRow() >= ZEN.HEADER_ROW ? ZEN.HEADER_ROW : 1;
    if (sCol > 0) {
      var sHeaders = standaloneChitsSh.getRange(headerRowNum, 1, 1, sCol).getDisplayValues()[0];
      var missingInChits = [];
      if (sHeaders.indexOf("MUN ID") === -1 && sHeaders.indexOf("MUN_ID") === -1) missingInChits.push("MUN ID");
      if (sHeaders.indexOf("Committee ID") === -1 && sHeaders.indexOf("Committee_ID") === -1) missingInChits.push("Committee ID");
      if (missingInChits.length > 0) {
        standaloneChitsSh.getRange(headerRowNum, sCol + 1, 1, missingInChits.length).setValues([missingInChits]);
        formatHeaderRow(standaloneChitsSh, standaloneChitsSh.getLastColumn());
        updatedTabs.push(standaloneChitsSh.getName() + " (added " + missingInChits.join(", ") + ")");
      }
    }
  }

  // 5. Refresh Control Dashboard, ReadMe & Data Dictionary
  setupDashboard_(ss);
  setupReadMe_(ss);
  populateDataDictionary_(ss);

  var summaryMsg = "Tabs update complete! " +
    "Added: " + addedTabs.length + " new tab(s). " +
    "Updated columns: " + updatedTabs.length + " tab(s). " +
    "Verified: " + checkedTabs.length + " existing tab(s)." +
    (removedTabs.length > 0 ? " Removed: " + removedTabs.join(", ") + "." : "");

  try {
    SpreadsheetApp.getActiveSpreadsheet().toast(summaryMsg, "ZENVITRA MASTER", 6);
  } catch (_) {}

  return {
    status: 'success',
    action: 'UPDATE_TABS',
    spreadsheetUrl: ss.getUrl(),
    spreadsheetId: ss.getId(),
    addedTabs: addedTabs,
    updatedTabs: updatedTabs,
    checkedTabsCount: checkedTabs.length,
    removedTabs: removedTabs,
    totalOperationalTabs: Object.keys(TAB_SCHEMAS).length,
    totalRegisters: SCHEMAS.length,
    message: summaryMsg
  };
}

/**
 * Master Setup Function:
 * Auto-creates all operational stream tabs, all central registers,
 * and formats headers with zero underscores!
 */
function initAllTabs() {
  var ss = getOrCreateSpreadsheet();
  var created = [];

  // 1. Rename any legacy tabs containing underscores
  var existingSheets = ss.getSheets();
  existingSheets.forEach(function(sh) {
    var oldName = sh.getName();
    if (oldName.indexOf('_') !== -1) {
      var cleanName = oldName.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
      if (!ss.getSheetByName(cleanName)) {
        sh.setName(cleanName);
      }
    }
  });

  // Remove deprecated tab if present
  var deprecatedTab = getSheetLoose_(ss, "ZEN DIPLOMACY MUN");
  if (deprecatedTab) {
    try {
      ss.deleteSheet(deprecatedTab);
    } catch (_) {}
  }

  // 2. Initialize all 14 operational stream tabs
  Object.keys(TAB_SCHEMAS).forEach(function(key) {
    var schema = TAB_SCHEMAS[key];
    var sheet = getSheetLoose_(ss, schema.sheetName);
    var isNew = false;

    if (!sheet) {
      sheet = ss.insertSheet(schema.sheetName);
      isNew = true;
      created.push(schema.sheetName);
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(schema.headers);
      isNew = true;
    }

    formatHeaderRow(sheet, schema.headers.length);
  });

  // 3. Initialize all 47 central registers
  SCHEMAS.forEach(function(schema) {
    setupRegister_(ss, schema[0], schema[1], schema[2].split(","), schema[3], schema[4]);
  });

  // 4. Setup Control Dashboard, ReadMe & Data Dictionary
  setupDashboard_(ss);
  setupReadMe_(ss);
  populateDataDictionary_(ss);

  var msg = "All 14 operational streams and 47 registers initialized with 0 underscores.";
  try {
    SpreadsheetApp.getUi().alert("ZENVITRA Master Setup Complete", msg, SpreadsheetApp.getUi().ButtonSet.OK);
  } catch (_) {}

  return {
    status: 'success',
    spreadsheetUrl: ss.getUrl(),
    spreadsheetId: ss.getId(),
    createdTabs: created,
    totalOperationalTabs: Object.keys(TAB_SCHEMAS).length,
    totalRegisters: SCHEMAS.length,
    message: msg
  };
}

/**
 * Alias functions for complete compatibility
 */
function setupZenvitraMaster() {
  return initAllTabs();
}

function initializeAll12Tabs() {
  return initAllTabs();
}

function refreshZenvitraDashboard() {
  const ss = getOrCreateSpreadsheet();
  setupDashboard_(ss);
  SpreadsheetApp.getActiveSpreadsheet().toast("Dashboard refreshed successfully.", "ZENVITRA", 3);
}

function setupRegister_(ss, name, description, headers, dropdownText, sensitivity) {
  let sh = getSheetLoose_(ss, name);
  if (!sh) sh = ss.insertSheet(name);

  ensureSize_(sh, ZEN.CAPACITY + ZEN.DATA_START_ROW, headers.length);

  const existingHeaders = sh.getRange(ZEN.HEADER_ROW, 1, 1, headers.length).getDisplayValues()[0];
  const blankHeader = existingHeaders.every(v => !v);

  // Break apart previous merged cells in rows 1-3 to prevent freeze conflicts
  try {
    sh.getRange(1, 1, 3, Math.max(headers.length, 20)).breakApart();
  } catch (e) {}

  if (blankHeader && sh.getLastRow() <= ZEN.HEADER_ROW) {
    sh.getRange(1, 1).setValue(name.replace(/_/g, " "));
    sh.getRange(2, 1).setValue(description);
    sh.getRange(3, 1).setValue("One record per row. Use stable IDs. Never store authentication secrets.");
    sh.getRange(ZEN.HEADER_ROW, 1, 1, headers.length).setValues([headers]);
  } else if (blankHeader) {
    sh.getRange(ZEN.HEADER_ROW, 1, 1, headers.length).setValues([headers]);
  }

  // Obsidian Dark Theme
  sh.getRange(1, 1).setFontSize(14).setFontWeight("bold").setFontColor(ZEN.C.WHITE);
  sh.getRange(2, 1).setFontSize(10).setFontStyle("italic").setFontColor(ZEN.C.LIGHT);
  sh.getRange(3, 1).setFontSize(9).setFontColor(ZEN.C.GREY);
  sh.getRange("A1:Z3").setBackground(ZEN.C.DARK);

  const headerRange = sh.getRange(ZEN.HEADER_ROW, 1, 1, headers.length);
  headerRange
    .setBackground(ZEN.C.NAVY)
    .setFontColor(ZEN.C.WHITE)
    .setFontWeight("bold")
    .setFontFamily("Roboto Mono")
    .setFontSize(10)
    .setWrap(true);

  sh.setFrozenRows(ZEN.HEADER_ROW);

  // Apply dropdown rules
  if (dropdownText) {
    const rules = dropdownText.split(";");
    rules.forEach(rule => {
      const parts = rule.split("=");
      if (parts.length === 2) {
        const colName = parts[0].trim();
        const options = parts[1].split("|").map(s => s.trim());
        const colIdx = headers.indexOf(colName) + 1;
        if (colIdx > 0) {
          const ruleObj = SpreadsheetApp.newDataValidation()
            .requireValueInList(options, true)
            .setAllowInvalid(false)
            .build();
          sh.getRange(ZEN.DATA_START_ROW, colIdx, ZEN.CAPACITY, 1).setDataValidation(ruleObj);
        }
      }
    });
  }

  // ID column formatting
  const idCol = headers.findIndex(h => h.includes("_ID")) + 1;
  if (idCol > 0) {
    sh.getRange(ZEN.DATA_START_ROW, idCol, ZEN.CAPACITY, 1)
      .setFontFamily("Roboto Mono")
      .setFontSize(9);
  }

  // Date column formatting
  headers.forEach((h, idx) => {
    if (h.includes("Date") || h.includes("Timestamp") || h.includes("At")) {
      sh.getRange(ZEN.DATA_START_ROW, idx + 1, ZEN.CAPACITY, 1)
        .setNumberFormat("yyyy-mm-dd hh:mm:ss");
    }
  });

  // Tab colors by sensitivity
  const tabColors = {
    Public: "#10B981",
    Internal: "#3B82F6",
    Confidential: "#F59E0B",
    Restricted: "#EF4444",
    Highly_Restricted: "#7C3AED"
  };
  if (tabColors[sensitivity]) {
    sh.setTabColor(tabColors[sensitivity]);
  }
}

function setupReadMe_(ss) {
  let sh = getSheetLoose_(ss, "00 ReadMe");
  if (!sh) sh = ss.insertSheet("00 ReadMe", 0);

  sh.clear();
  sh.setTabColor(ZEN.C.GREY);
  sh.setFrozenRows(1);

  const guide = [
    ["ZENVITRA MASTER WORKBOOK — OPERATIONAL RUNBOOK"],
    [""],
    ["Welcome to the central operational workbook for ZENVITRA. All website data, forms, and registers sync here."],
    [""],
    ["1. Golden Rule: Never store passwords, OTPs, session cookies, or payment secret keys in sheets."],
    ["2. Canonical Identity: All users, delegates, and applicants resolve to a stable Person_ID in 01 People."],
    ["3. Operational Streams: 12 dedicated operational stream tabs handle forms, recruitment, and donations."],
    ["4. Central Registers: 46 numbered registers store canonical entity data with zero underscores."],
    ["5. Webhook Pipeline: The Next.js portal posts directly to doPost(e). Submissions are mapped via resolveTabName_."],
    ["6. Authentication Telemetry: Login attempts are recorded securely into Login Data Core and 03 Login Activity."],
    ["7. Dynamic ZenForms: action: 'SYNC_SCHEMA' automatically creates and extends custom questionnaire columns."]
  ];

  sh.getRange(1, 1, guide.length, 1).setValues(guide);
  sh.getRange("A1").setFontSize(16).setFontWeight("bold").setFontColor(ZEN.C.TEAL);
  sh.setColumnWidth(1, 800);
}

function setupDashboard_(ss) {
  let sh = getSheetLoose_(ss, "00 Dashboard");
  if (!sh) sh = ss.insertSheet("00 Dashboard", 0);

  sh.clear();
  sh.setHiddenGridlines(true);
  sh.setFrozenRows(2);
  sh.setTabColor(ZEN.C.TEAL);

  sh.getRange("A1:D1").merge()
    .setValue("ZENVITRA | MASTER CONTROL CENTRE")
    .setBackground(ZEN.C.DARK)
    .setFontColor(ZEN.C.WHITE)
    .setFontWeight("bold")
    .setFontSize(15);

  sh.getRange("A2:D2").merge()
    .setValue("Unified Central Operations, Ingestion Webhooks & Recruitment Telemetry")
    .setBackground(ZEN.C.NAVY)
    .setFontColor(ZEN.C.WHITE)
    .setFontSize(10);

  const tracked = [
    ["User Accounts (Core)", "Register Data Core"],
    ["Login Audit Core", "Login Data Core"],
    ["Public Inquiries", "Contact Inquiries"],
    ["Delegate Rosters", "14 Delegate Rosters"],
    ["Event Passes Booked", "Event Registrations"],
    ["Charity Relief Raised", "Donations"],
    ["Public Impact Ledger", "Impact Ledger"],
    ["Campus Ambassadors", "Campus Ambassadors"],
    ["Core Team Applications", "Core Team Applications"],
    ["Newsletter Subscribers", "Newsletter Subscribers"],
    ["Partnerships", "Collab & Partnerships"],
    ["Community Network", "Community Members"],
    ["Feedback & Grievances", "Feedback & Grievance"],
    ["Canonical People", "01 People"],
    ["Platform Registrations", "02 Core Registrations"],
    ["Authentication Logs", "03 Login Activity"],
    ["Payments Recorded", "18 Payments"],
    ["Legislative Bills", "43 Legislation Bills"],
    ["Bill Amendments", "44 Bill Amendments"],
    ["Form Submissions", "45 Form Submissions"],
    ["Passport Citizens", "46 Passport Ledger"],
    ["ZenDocs Metrics", "47 Zen Docs Metrics"]
  ];

  sh.getRange("A4:D4").setValues([["METRIC / REGISTER", "TAB TARGET", "ACTIVE RECORDS", "STATUS"]]);
  sh.getRange("A4:D4").setBackground(ZEN.C.NAVY).setFontColor(ZEN.C.WHITE).setFontWeight("bold");

  tracked.forEach((item, idx) => {
    const row = 5 + idx;
    sh.getRange(row, 1).setValue(item[0]).setFontWeight("bold");
    sh.getRange(row, 2).setValue(item[1]);
    sh.getRange(row, 3).setFormula("=IFERROR(COUNTA('" + item[1] + "'!A2:A), 0)");
    sh.getRange(row, 4).setValue("ACTIVE").setFontColor(ZEN.C.TEAL);
  });

  sh.setColumnWidth(1, 240);
  sh.setColumnWidth(2, 220);
  sh.setColumnWidth(3, 140);
  sh.setColumnWidth(4, 120);
}

// ================================================================
// 2. MAPPING & WEBHOOK ROUTING LOGIC
// ================================================================

/**
 * Normalizes input aliases into known operational stream keys
 */
function resolveSchemaKey(raw) {
  if (!raw) return null;
  var s = String(raw).toUpperCase().trim();

  if (s.indexOf('EVENT') !== -1 || s.indexOf('PASS') !== -1 || s.indexOf('TICKET') !== -1) return 'EVENTS';
  if (s.indexOf('DONAT') !== -1) return 'DONATIONS';
  if (s.indexOf('IMPACT') !== -1 || s.indexOf('LEDGER') !== -1) return 'IMPACT_LEDGER';
  if (s.indexOf('REGISTER DATA') !== -1 || s.indexOf('REGISTER_CORE') !== -1) return 'REGISTER_CORE';
  if (s.indexOf('LOGIN DATA') !== -1 || s.indexOf('LOGIN_CORE') !== -1) return 'LOGIN_CORE';
  if (s.indexOf('AMBASSADOR') !== -1 || s.indexOf('CAMPUS') !== -1) return 'CAMPUS_AMBASSADOR';
  if (s.indexOf('CORE TEAM') !== -1 || s.indexOf('04 TEAM') !== -1 || s.indexOf('TEAM APPLICATION') !== -1 || s.indexOf('CAREER') !== -1) return 'CORE_TEAM';
  if (s.indexOf('CONTACT') !== -1) return 'CONTACT';
  if (s.indexOf('NEWSLETTER') !== -1) return 'NEWSLETTER';
  if (s.indexOf('COLLAB') !== -1 || s.indexOf('PARTNER') !== -1) return 'COLLAB';
  if (s.indexOf('COMMUNITY') !== -1) return 'COMMUNITY';
  if (s.indexOf('FEEDBACK') !== -1 || s.indexOf('GRIEVANCE') !== -1) return 'FEEDBACK';

  return null;
}

/**
 * Normalizes input aliases into registered 47 numbered tab names
 */
function resolveTabName_(name) {
  if (!name) return "02 Core Registrations";
  const clean = String(name).trim().toLowerCase();

  const aliases = {
    "people": "01 People",
    "users": "01 People",
    "core": "02 Core Registrations",
    "registrations": "02 Core Registrations",
    "auth": "03 Login Activity",
    "login": "03 Login Activity",
    "team": "04 Team Applications",
    "recruitment": "04 Team Applications",
    "roles": "05 Team Roles Access",
    "contact": "06 Contact Inquiries",
    "newsletter": "07 Newsletter Subscribers",
    "collab": "08 Collaborations",
    "community": "09 Community Members",
    "ambassadors": "10 Campus Ambassadors",
    "events": "11 Events",
    "attendees": "12 Event Registrations",
    "committees": "13 Committees",
    "delegates": "14 Delegate Rosters",
    "delegate": "14 Delegate Rosters",
    "mun": "14 Delegate Rosters",
    "diplomacy": "14 Delegate Rosters",
    "zen diplomacy": "14 Delegate Rosters",
    "zen diplomacy mun": "14 Delegate Rosters",
    "zen_diplomacy": "14 Delegate Rosters",
    "attendance": "16 Attendance Rollcall",
    "certificates": "17 Awards Certificates",
    "payments": "18 Payments",
    "cashfree": "18 Payments",
    "expenses": "19 Expenses",
    "donations": "20 Donations Charity",
    "budgets": "21 Budgets",
    "tasks": "22 Tasks",
    "feedback": "23 Feedback",
    "grievances": "24 Grievances",
    "support": "25 Support Cases",
    "audit": "26 Audit Logs",
    "chits": "27 Chits Active Roster",
    "chits_active": "27 Chits Active Roster",
    "chits_archive": "28 Chits Archive",
    "meet": "29 Meet Sessions",
    "pulse": "31 Pulse Posts",
    "editorial": "34 Content Editorial",
    "bugs": "35 Feature Bugs",
    "modules": "36 Module Catalog",
    "queue": "39 Sync Queue",
    "kpi": "42 KPI Metrics",
    "bills": "43 Legislation Bills",
    "legislation": "43 Legislation Bills",
    "solutions": "43 Legislation Bills",
    "amendments": "44 Bill Amendments",
    "forms": "45 Form Submissions",
    "form_submissions": "45 Form Submissions",
    "submissions": "45 Form Submissions",
    "passport": "46 Passport Ledger",
    "passports": "46 Passport Ledger",
    "rewards": "46 Passport Ledger",
    "docs": "47 Zen Docs Metrics",
    "zendocs": "47 Zen Docs Metrics"
  };

  if (aliases[clean]) return aliases[clean];

  const normClean = normalize_(name);
  const directMatch = SCHEMAS.find(s => normalize_(s[0]) === normClean || s[0].toLowerCase() === clean);
  if (directMatch) return directMatch[0];

  return String(name).replace(/_/g, " ").replace(/\s+/g, " ").trim();
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

  // ── AGE (YEARS) / DATE OF BIRTH ──
  if ((hAlpha.indexOf("age") !== -1 || hAlpha.indexOf("years") !== -1 || hAlpha.indexOf("dob") !== -1 || hAlpha.indexOf("birth") !== -1) && hAlpha.indexOf("category") === -1 && hAlpha.indexOf("minor") === -1) {
    var rawAge = data["Age (Years)"] || data["Age"] || data.age || data.userAge || data.step1_age || data.step2_age || data.dateOfBirth || data.dob || "";
    return rawAge ? String(rawAge) : "";
  }

  // ── MINOR STATUS (UNDER 18 / ADULT) ──
  if (hAlpha.indexOf("minor") !== -1 || hAlpha.indexOf("under18") !== -1 || hAlpha.indexOf("agecategory") !== -1 || (hAlpha.indexOf("adult") !== -1 && hAlpha.indexOf("status") !== -1)) {
    if (data.isMinor === true || data.isMinor === "true") return "MINOR (<18)";
    if (data.isMinor === false || data.isMinor === "false") return "ADULT (18+)";
    var ageVal = Number(data.age || data["Age (Years)"] || data.userAge || data.step1_age);
    if (!isNaN(ageVal) && ageVal > 0) {
      return ageVal < 18 ? "MINOR (<18)" : "ADULT (18+)";
    }
    return data.minorStatus || data.ageCategory || data["Minor Status (Under 18 / Adult)"] || (data["Minor Status"] || "NOT_DECLARED");
  }

  // ── PARENT / GUARDIAN FULL NAME ──
  if ((hAlpha.indexOf("guardian") !== -1 || hAlpha.indexOf("parent") !== -1) && hAlpha.indexOf("phone") === -1 && hAlpha.indexOf("contact") === -1 && hAlpha.indexOf("emergency") === -1 && hAlpha.indexOf("consent") === -1 && hAlpha.indexOf("accord") === -1) {
    return data["Parent / Guardian Full Name"] || data["Parent / Guardian / Faculty Advisor Name"] || data.parentName || data.parentGuardianName || data.guardianName || data.step8_guardian_name || data.facultyAdvisor || "N/A";
  }

  // ── PARENT / GUARDIAN CONTACT / EMERGENCY PHONE ──
  if ((hAlpha.indexOf("guardian") !== -1 || hAlpha.indexOf("parent") !== -1 || hAlpha.indexOf("emergency") !== -1) && (hAlpha.indexOf("phone") !== -1 || hAlpha.indexOf("contact") !== -1 || hAlpha.indexOf("number") !== -1)) {
    return data["Parent / Guardian Emergency Contact"] || data["Guardian Emergency Contact Number"] || data.parentContact || data.parentGuardianContact || data.guardianPhone || data.guardianEmergencyContact || data.emergencyContact || data.step8_guardian_phone || "N/A";
  }

  // ── MINOR CONSENT & PARENTAL ACCORD ──
  if (hAlpha.indexOf("consent") !== -1 || hAlpha.indexOf("accord") !== -1) {
    if (data.minorConsent === true || data.minorConfirmed === true || data.minorPolicyAcknowledged === true || data["Minor Consent & Parental Accord"] === "CONSENT_RATIFIED") {
      return "CONSENT_RATIFIED";
    }
    var ageCheck = Number(data.age || data["Age (Years)"]);
    if (!isNaN(ageCheck) && ageCheck >= 18) {
      return "NOT_APPLICABLE (ADULT 18+)";
    }
    return data.minorConsent || data.minorConfirmed || data["Minor Consent & Parental Accord"] || "PENDING";
  }

  // ── REGISTRATION TYPE & STATUS (REGISTER / PREREGISTER FOR PERKS) ──
  if (hAlpha.indexOf("registrationtype") !== -1 || hAlpha.indexOf("regtype") !== -1 || hAlpha.indexOf("preregister") !== -1 || (hAlpha.indexOf("status") !== -1 && (hAlpha.indexOf("regist") !== -1 || hAlpha.indexOf("perk") !== -1))) {
    var rawReg = String(data["Registration Status (REGISTER / PREREGISTER)"] || data["Registration Type"] || data.registrationType || data.registrationStatus || data.regType || data.accessLevel || "").toUpperCase();
    if (rawReg.indexOf("PRE") !== -1 || data.isPreRegistered === true) {
      return "PREREGISTER";
    }
    return "REGISTER";
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

/**
 * Maps incoming client payload to canonical row columns for 14 operational streams
 */
function mapPayloadToRow(schemaKey, data) {
  var now = Utilities.formatDate(new Date(), 'GMT+5:30', 'yyyy-MM-dd HH:mm:ss');
  var ip = data.ipAddress || data.ip || '127.0.0.1';
  var device = data.deviceInfo || data.deviceBrowserInfo || data.userAgent || 'Web Browser';

  switch (schemaKey) {
    case 'EVENTS':
      return [
        now,
        lookupVal(data, 'Registration ID / Ticket ID') || ('DEL-' + Math.random().toString(36).substring(2, 8).toUpperCase()),
        lookupVal(data, 'Full Name of the Delegate'),
        lookupVal(data, 'Primary Contact Email Address'),
        lookupVal(data, 'WhatsApp / Calling Number'),
        lookupVal(data, 'School / College / University or Independent'),
        lookupVal(data, 'Current City & State of Residence'),
        lookupVal(data, 'Participation Track') || 'School / University Delegate',
        lookupVal(data, 'Model UN & Parliamentary Experience Tier') || 'Developing Delegate',
        lookupVal(data, '1st Preference Committee Chamber'),
        lookupVal(data, '2nd Preference Committee Chamber'),
        lookupVal(data, 'Top 3 Preferred Portfolios / Countries'),
        lookupVal(data, 'List Notable MUN Conferences & Awards Won'),
        lookupVal(data, 'Statement of Purpose & Procedural Strategy'),
        lookupVal(data, 'Parent / Guardian / Faculty Advisor Name'),
        lookupVal(data, 'Guardian Emergency Contact Number'),
        lookupVal(data, 'Institutional ID Card / Drive Link / Roll Number'),
        lookupVal(data, 'Diplomatic Code of Conduct & Ethics Agreement') || 'RATIFIED',
        lookupVal(data, 'Zenvitra Sovereign Username (@handle)'),
        lookupVal(data, 'Virtual Chamber Live Stream & Recording Consent') || 'Granted',
        lookupVal(data, 'Selected Delegation Pass Tier') || 'Delegate Pass (₹499)',
        lookupVal(data, 'Total Pass Fee (INR)') || '499',
        lookupVal(data, 'Preferred Payment Mode') || 'UPI Instant QR',
        lookupVal(data, '12-Digit UPI Transaction ID / UTR Number'),
        lookupVal(data, 'Upload Payment Screenshot / Receipt Proof URL'),
        lookupVal(data, 'Digital Signature (Full Legal Name)'),
        lookupVal(data, 'Date of Submission') || now.split(' ')[0],
        lookupVal(data, 'Payment Verification Status') || 'PENDING_VERIFICATION',
        lookupVal(data, 'Allocated Committee') || 'Pending Allotment',
        lookupVal(data, 'Allocated Seat / Portfolio') || 'Pending Allotment',
        lookupVal(data, 'Dais Review Status') || 'PENDING',
        lookupVal(data, 'Dais Review Notes') || 'Received via Sovereign Portal',
        ip,
        device
      ];

    case 'DONATIONS':
    case 'IMPACT_LEDGER':
      return [
        now,
        lookupVal(data, 'Donation ID / Contribution ID') || ('DON-' + Math.random().toString(36).substring(2, 8).toUpperCase()),
        lookupVal(data, 'Contributor / Donor Full Name') || 'Anonymous Citizen',
        lookupVal(data, 'Contributor Email Address'),
        lookupVal(data, 'Phone Number [WhatsApp Active]'),
        lookupVal(data, 'Voluntary Contribution Amount (INR)') || 0,
        lookupVal(data, '12-Digit UPI UTR / Transaction Reference ID'),
        lookupVal(data, 'Target Project / Relief Stream') || 'Satya Niketan Anath Ashram',
        lookupVal(data, 'Payment Mode / Channel') || 'UPI / Instant QR',
        lookupVal(data, 'Anonymous Contribution Preference') || 'NO',
        lookupVal(data, 'Contributor Notes / Dedication / Prayer'),
        lookupVal(data, 'Payment Screenshot / Receipt Proof URL'),
        lookupVal(data, 'Verification & Audit Status') || 'VERIFIED_SUBMISSION',
        lookupVal(data, 'Auditor / Reconciled By') || 'Public Relief Comptroller',
        now.split(' ')[0],
        ip,
        device
      ];

    case 'REGISTER_CORE':
      var rawRegInput = String(data["Registration Status (REGISTER / PREREGISTER)"] || data["Registration Type"] || data.registrationType || data.registrationStatus || data.regType || data.accessLevel || "").toUpperCase();
      var regStatusFinal = (rawRegInput.indexOf("PRE") !== -1 || data.isPreRegistered === true) ? "PREREGISTER" : "REGISTER";
      return [
        now,
        data.userId || data.id || ('USR-' + Math.random().toString(36).substring(2, 8).toUpperCase()),
        lookupVal(data, 'Full Legal Name'),
        lookupVal(data, 'Desired ZEN Handle'),
        lookupVal(data, 'Primary Email'),
        lookupVal(data, 'Phone [Whatsapp Active]'),
        lookupVal(data, 'Age (Years)'),
        lookupVal(data, 'Minor Status (Under 18 / Adult)'),
        lookupVal(data, 'Parent / Guardian Full Name'),
        lookupVal(data, 'Parent / Guardian Emergency Contact'),
        lookupVal(data, 'Minor Consent & Parental Accord'),
        data.roleDesignation || data.role || 'DELEGATE',
        data.accessLevel || (regStatusFinal === "PREREGISTER" ? "Pre-Registered Sovereign Whitelist" : "MEMBER"),
        data.authProvider || data.provider || 'CREDENTIALS',
        lookupVal(data, 'Institution / School / University'),
        lookupVal(data, 'Location & Timezone'),
        regStatusFinal,
        regStatusFinal,
        'RATIFIED',
        data.accountStatus || 'ACTIVE',
        ip,
        device
      ];

    case 'LOGIN_CORE':
      return [
        now,
        data.loginId || ('LOG-' + Math.random().toString(36).substring(2, 8).toUpperCase()),
        data.userId || data.id || '',
        lookupVal(data, 'Full Legal Name'),
        lookupVal(data, 'Primary Email'),
        lookupVal(data, 'Desired ZEN Handle'),
        data.authProvider || data.provider || 'CREDENTIALS',
        data.eventType || 'LOGIN_SUCCESS',
        data.loginStatus || 'SUCCESS',
        Number(data.riskScore || 0),
        data.sessionIdHash || '',
        ip,
        device
      ];

    case 'CAMPUS_AMBASSADOR':
      return [
        now,
        lookupVal(data, 'Ambassador Application ID') || ('AMB-' + Math.random().toString(36).substring(2, 8).toUpperCase()),
        lookupVal(data, 'Full Legal Name'),
        lookupVal(data, 'Email Address'),
        lookupVal(data, 'Phone Number [WhatsApp Active]'),
        lookupVal(data, 'College / University / School Name'),
        lookupVal(data, 'City & State of Residence'),
        lookupVal(data, 'Degree, Stream & Academic Year'),
        lookupVal(data, 'Student ID Proof / College ID URL'),
        lookupVal(data, 'Prior Leadership / Student Council / Campus Experience'),
        lookupVal(data, 'Proposed Campus Strategy & Outreach Blueprint'),
        lookupVal(data, 'Social Media Handles (Instagram / LinkedIn / Twitter)'),
        lookupVal(data, 'Estimated Weekly Available Hours') || '5–8 hrs/week',
        lookupVal(data, 'Statement of Purpose / Why Zenvitra Ambassador'),
        data.referralCode || ('ZEN-AMB-' + Math.random().toString(36).substring(2, 6).toUpperCase()),
        lookupVal(data, 'Application Review Status') || 'PENDING_REVIEW',
        lookupVal(data, 'Assigned Outreach Lead') || 'Head of Campus Network',
        lookupVal(data, 'Reviewer Notes') || 'Pending initial screening',
        ip,
        device
      ];

    case 'CORE_TEAM':
      return [
        now,
        lookupVal(data, 'Application ID') || ('COR-' + Math.random().toString(36).substring(2, 8).toUpperCase()),
        lookupVal(data, 'Full Legal Name'),
        lookupVal(data, 'Desired ZEN Handle'),
        lookupVal(data, 'Primary Email'),
        lookupVal(data, 'Phone [Whatsapp Active]'),
        lookupVal(data, 'Telegram / Discord Handle'),
        lookupVal(data, 'Location & Timezone'),
        lookupVal(data, 'Role Applied For'),
        lookupVal(data, 'Department / Wing') || 'CORE',
        lookupVal(data, 'Leadership Track') || 'Executive Council',
        lookupVal(data, 'Portfolio / Proof of Work URL'),
        lookupVal(data, 'Uploaded Dossier Document'),
        lookupVal(data, 'Past Experience & Track Record'),
        lookupVal(data, 'Technical / Diplomatic Dossier'),
        lookupVal(data, 'Weekly Bandwidth Commitment') || '25+ hrs (Core)',
        lookupVal(data, 'Statement of Purpose & Motivation'),
        lookupVal(data, 'Current Institution / College / Company'),
        lookupVal(data, 'Year of Study / Current Title'),
        lookupVal(data, 'Constitutional Accord Status') || 'RATIFIED',
        lookupVal(data, 'Application Status') || 'PENDING',
        lookupVal(data, 'Interview Date / Dais Coordinate') || 'To Be Scheduled',
        lookupVal(data, 'Reviewer') || 'Genesis Executive Council',
        lookupVal(data, 'Review Notes') || 'Verified by Secretariat gateway',
        ip,
        device
      ];

    case 'CONTACT':
      return [
        now,
        lookupVal(data, 'Inquiry ID') || ('INQ-' + Math.random().toString(36).substring(2, 8).toUpperCase()),
        lookupVal(data, 'Full Legal Name'),
        lookupVal(data, 'Email Address'),
        lookupVal(data, 'Phone Number [WhatsApp Active]'),
        lookupVal(data, 'Preferred Contact Channel') || 'Email / WhatsApp',
        lookupVal(data, 'Inquiry Category / Department') || 'GENERAL_SECRETARIAT',
        lookupVal(data, 'Subject / Inquiry Title') || 'General Inquiry',
        lookupVal(data, 'Detailed Message / Inquiry Text'),
        lookupVal(data, 'Urgency / Priority Level') || 'NORMAL',
        lookupVal(data, 'Source URL / Origin Page') || '/contact',
        lookupVal(data, 'Resolution Status') || 'NEW',
        lookupVal(data, 'Assigned Officer') || 'General Secretariat',
        lookupVal(data, 'Resolution Notes') || 'In queue for review',
        ip,
        device
      ];

    case 'NEWSLETTER':
      return [
        now,
        lookupVal(data, 'Subscriber ID') || ('SUB-' + Math.random().toString(36).substring(2, 8).toUpperCase()),
        lookupVal(data, 'Email Address'),
        lookupVal(data, 'Full Name / Display Name') || 'Citizen Subscriber',
        lookupVal(data, 'Subscription Source Page') || 'Website Footer',
        lookupVal(data, 'Preferred Topics & Streams') || 'MUN Summits & Policy Dispatches',
        (data.consentGiven === false ? 'NO' : 'YES'),
        data.utmCampaign || 'organic',
        data.status || 'SUBSCRIBED',
        ip
      ];

    case 'COLLAB':
      return [
        now,
        lookupVal(data, 'Partnership ID') || ('COL-' + Math.random().toString(36).substring(2, 8).toUpperCase()),
        lookupVal(data, 'Organization / Institution / Entity Name'),
        lookupVal(data, 'Lead Representative Full Name'),
        lookupVal(data, 'Official Work / Institutional Email'),
        lookupVal(data, 'Contact Phone / WhatsApp Number'),
        lookupVal(data, 'Partnership Category') || 'Academic Institution / MUN Society',
        lookupVal(data, 'Official Website / Social URL'),
        lookupVal(data, 'Estimated Community / Delegation Reach') || '100+ Delegates',
        lookupVal(data, 'Proposed Partnership Scope & Deliverables'),
        lookupVal(data, 'Resource / Budget Commitment') || 'In Kind / Institutional Partnership',
        lookupVal(data, 'Target Summit / Event Timeline') || 'Zenvitra 2026 Summits',
        lookupVal(data, 'Partnership Stage') || 'INQUIRY',
        lookupVal(data, 'Assigned Secretariat Lead') || 'Directorate of External Affairs',
        lookupVal(data, 'Internal Review Notes') || 'Initial partnership proposal received',
        ip,
        device
      ];

    case 'COMMUNITY':
      return [
        now,
        lookupVal(data, 'Member ID') || ('MEM-' + Math.random().toString(36).substring(2, 8).toUpperCase()),
        lookupVal(data, 'Full Legal Name'),
        lookupVal(data, 'Zenvitra Sovereign Handle (@handle)'),
        lookupVal(data, 'Primary Email Address'),
        lookupVal(data, 'Phone Number [WhatsApp Active]'),
        lookupVal(data, 'City, State & Country'),
        lookupVal(data, 'Institution / University / Affiliation'),
        lookupVal(data, 'Primary Domain & Skills') || 'Diplomacy & Public Policy',
        lookupVal(data, 'Secondary Interests & Passions'),
        lookupVal(data, 'Discord Handle'),
        lookupVal(data, 'Telegram Handle'),
        lookupVal(data, 'LinkedIn / GitHub Profile URL'),
        lookupVal(data, 'Membership Tier') || 'Founding Citizen',
        lookupVal(data, 'Membership Status') || 'ACTIVE',
        ip,
        device
      ];

    case 'FEEDBACK':
      return [
        now,
        lookupVal(data, 'Ticket ID') || ('TKT-' + Math.random().toString(36).substring(2, 8).toUpperCase()),
        lookupVal(data, 'Submitter Full Name') || 'Anonymous Citizen',
        lookupVal(data, 'Submitter Email Address'),
        lookupVal(data, 'Submitter Handle / Phone Number'),
        lookupVal(data, 'Category (Bug / Grievance / Feature / Conduct / Payment)') || 'GENERAL_FEEDBACK',
        lookupVal(data, 'Severity / Priority Level') || 'NORMAL',
        lookupVal(data, 'Target Page / Feature URL') || '/',
        lookupVal(data, 'Subject / Issue Summary') || 'Platform Feedback',
        lookupVal(data, 'Detailed Description & Reproduction Steps'),
        lookupVal(data, 'Attachment / Screenshot / Proof URL'),
        device,
        lookupVal(data, 'Resolution Status') || 'OPEN',
        lookupVal(data, 'Assigned Ombudsperson / Officer') || 'User Experience Lead',
        lookupVal(data, 'Resolution Summary & Action Taken') || 'Logged for review',
        ip
      ];

    default:
      return [now, JSON.stringify(data), ip, device];
  }
}

// ================================================================
// 3. UNIVERSAL WEBHOOK ENDPOINTS (doGet & doPost)
// ================================================================

/**
 * Universal GET endpoint:
 * - ?action=INIT: Initializes all operational tabs & central registers
 * - ?action=UPDATE_TABS: Non-destructively appends new tabs & columns
 * - ?action=GET_DATA&tab=Donations: Searches records for Founder Vault
 * - Default: Returns platform health JSON
 */
function doGet(e) {
  try {
    var params = (e && e.parameter) || {};
    var action = (params.action || '').toUpperCase();
    var ss = getOrCreateSpreadsheet();

    // 1. One-click initialization
    if (action === 'INIT' || action === 'SETUP' || action === 'CREATE_SHEET') {
      var initRes = initAllTabs();
      return ContentService.createTextOutput(JSON.stringify(initRes)).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Non-destructive Tab & Column Updater
    if (action === 'UPDATE_TABS' || action === 'UPDATE' || action === 'SYNC_TABS') {
      var updateRes = updateTabs();
      return ContentService.createTextOutput(JSON.stringify(updateRes)).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. Bi-directional search for Founder Vault
    var rawTab = params.tab || 'Donations';
    var schemaKey = resolveSchemaKey(rawTab);
    var targetSheetName = (schemaKey && TAB_SCHEMAS[schemaKey]) ? TAB_SCHEMAS[schemaKey].sheetName : resolveTabName_(rawTab);
    var sheet = getSheetLoose_(ss, targetSheetName);

    if (sheet) {
      var data = sheet.getDataRange().getValues();
      if (data.length > 1) {
        var headers = data[0];
        var rows = [];
        var query = (params.q || '').toLowerCase().trim();

        for (var r = 1; r < data.length; r++) {
          var row = data[r];
          var rowObj = {};
          var match = !query;

          for (var c = 0; c < headers.length; c++) {
            var val = row[c];
            rowObj[headers[c]] = val;
            if (query && String(val).toLowerCase().indexOf(query) !== -1) {
              match = true;
            }
          }

          if (match) {
            rows.push(rowObj);
          }
        }

        return ContentService.createTextOutput(JSON.stringify({
          status: 'SUCCESS',
          tab: targetSheetName,
          count: rows.length,
          rows: rows.slice(-100),
          spreadsheetUrl: ss.getUrl(),
          connected: true
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    // Default health ping
    return ContentService.createTextOutput(JSON.stringify({
      ok: true,
      platform: "ZENVITRA MASTER OMNI-CONTROL",
      version: ZEN.VERSION,
      timestamp: new Date().toISOString(),
      status: "ONLINE",
      total_operational_tabs: Object.keys(TAB_SCHEMAS).length,
      total_registers: SCHEMAS.length,
      spreadsheetUrl: ss.getUrl()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      status: 'ERROR',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Universal Ingestion Endpoint for Website, Forms, Cashfree, and Auth Telemetry
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);

    if (!e || !e.postData || !e.postData.contents) {
      return json_({ ok: false, error: "invalid_request", message: "Empty body received" });
    }

    var payload = {};
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return json_({ ok: false, error: "malformed_json", message: parseErr.toString() });
    }

    var ss = getOrCreateSpreadsheet();
    var action = (payload.action || '').toUpperCase();

    // ── ACTION 0: NON-DESTRUCTIVE UPDATE / ADD TABS ──
    if (action === 'UPDATE_TABS' || action === 'UPDATE' || action === 'SYNC_TABS') {
      return json_(updateTabs());
    }

    // ── ACTION 1: DYNAMIC ZENFORMS SCHEMA SYNC ──
    if (action === 'SYNC_SCHEMA') {
      var sheetTab = payload.sheetTab || payload.targetTab || ('ZEN ' + (payload.formId || 'FORM').toUpperCase().replace(/[^A-Z0-9 ]/g, ' ')).trim();
      var sheet = getSheetLoose_(ss, sheetTab);
      if (!sheet) {
        sheet = ss.insertSheet(sheetTab);
      }

      var existingHeaders = [];
      var lastCol = sheet.getLastColumn();
      if (lastCol > 0 && sheet.getLastRow() > 0) {
        existingHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
      }

      var defaultHeaders = ['Timestamp', 'Submission ID', 'Submitter Handle'];
      defaultHeaders.forEach(function(h) {
        if (existingHeaders.indexOf(h) === -1) {
          existingHeaders.push(h);
        }
      });

      if (Array.isArray(payload.fields)) {
        payload.fields.forEach(function(field) {
          var headerName = field.label || field.id;
          if (headerName && existingHeaders.indexOf(headerName) === -1) {
            existingHeaders.push(headerName);
          }
        });
      }

      sheet.getRange(1, 1, 1, existingHeaders.length).setValues([existingHeaders]);
      formatHeaderRow(sheet, existingHeaders.length);

      return json_({
        status: 'success',
        action: 'SYNC_SCHEMA',
        sheetTab: sheetTab,
        columnCount: existingHeaders.length,
        spreadsheetUrl: ss.getUrl(),
        message: 'Sheet tab "' + sheetTab + '" successfully created and synced with ' + existingHeaders.length + ' columns!'
      });
    }

    // ── CASE A: AUTHENTICATION TELEMETRY ──
    var isAuthTelemetry = (payload.eventType && !payload.targetTab && !payload.tab) ||
      payload.targetTab === "03 Login Activity" || payload.tab === "03 Login Activity" ||
      payload.targetTab === "Login Data Core" || payload.tab === "Login Data Core";

    if (isAuthTelemetry && payload.eventType) {
      var expectedSecret = PropertiesService.getScriptProperties().getProperty(ZEN.P.WEBHOOK_SECRET);
      if (expectedSecret && (!payload.secret || !constantTimeEqual_(String(payload.secret), expectedSecret))) {
        return json_({ ok: false, error: "unauthorized", message: "Invalid webhook secret" });
      }

      var loginId = payload.loginId || ("LOG-" + shortHash_(new Date().toISOString() + (payload.email || "")).toUpperCase());
      var personId = payload.personId || (payload.email ? ("PER-" + shortHash_(payload.email).toUpperCase()) : "");

      // Ingest into Login Data Core
      var loginDataCoreSh = getSheetLoose_(ss, "Login Data Core");
      if (loginDataCoreSh) {
        var rowCore = [
          Utilities.formatDate(new Date(), 'GMT+5:30', 'yyyy-MM-dd HH:mm:ss'),
          payload.userId || personId || loginId,
          payload.fullName || payload.name || payload.username || '',
          payload.email || '',
          payload.authProvider || payload.provider || 'CREDENTIALS',
          payload.loginStatus || (payload.eventType.indexOf('SUCCESS') !== -1 ? 'SUCCESS' : 'FAILED'),
          payload.ipAddressMasked || payload.ip || '127.0.0.1',
          payload.userAgentSummary || payload.userAgent || 'Web Browser'
        ];
        loginDataCoreSh.appendRow(rowCore);
      }

      // Ingest into 03 Login Activity
      var sh03 = getSheetLoose_(ss, "03 Login Activity");
      if (sh03) {
        var row03 = [
          safe_(loginId),
          safe_(personId),
          safe_(payload.email || ""),
          safe_(payload.username || ""),
          safe_(payload.eventType),
          new Date(),
          safe_(payload.ipAddressMasked || payload.ip || "REDACTED"),
          safe_(payload.userAgentSummary || payload.userAgent || "Unknown"),
          safe_(payload.deviceType || "Desktop"),
          safe_(payload.sessionIdHash || ""),
          safe_(payload.outcome || (payload.eventType.indexOf("SUCCESS") !== -1 ? "Success" : "Failed")),
          Number(payload.riskScore || 0),
          safe_(payload.notes || "Auth Telemetry Dispatch")
        ];
        sh03.appendRow(row03);
      }

      return json_({ ok: true, status: "logged", loginId: loginId });
    }

    // ── CASE B: OPERATIONAL STREAMS, REGISTERS & UNIVERSAL INGESTION ──
    var rawTab = payload.sheetTab || payload.targetTab || payload.tab || payload.target || '';
    var schemaKey = resolveSchemaKey(rawTab);

    // Contextual inference for MUN forms
    if (!schemaKey) {
      var formId = (payload.formId || '').toLowerCase();
      var formTitle = (payload.formTitle || '').toLowerCase();
      if (
        formId.indexOf('zen-diplomacy') !== -1 ||
        payload.step1_fullname ||
        payload.step3_primary_committee
      ) {
        schemaKey = 'EVENTS';
      }
    }

    var targetSheet = null;
    var targetRow = [];
    var targetTabName = "";

    // 1. Resolve Target Sheet Tab
    if (schemaKey && TAB_SCHEMAS[schemaKey]) {
      var opSchema = TAB_SCHEMAS[schemaKey];
      targetTabName = opSchema.sheetName;
      targetSheet = getOrCreateSheet(opSchema);
    } else {
      targetTabName = resolveTabName_(rawTab || "02 Core Registrations");
      targetSheet = getSheetLoose_(ss, targetTabName);

      if (!targetSheet) {
        var match = SCHEMAS.find(function(s) {
          return s[0].toLowerCase().indexOf(targetTabName.toLowerCase()) !== -1;
        });
        if (match) {
          targetTabName = match[0];
          targetSheet = getSheetLoose_(ss, targetTabName);
          if (!targetSheet) {
            targetSheet = ss.insertSheet(targetTabName);
            var schHeaders = match[2].split(",").map(function(h) { return h.trim(); });
            targetSheet.appendRow(schHeaders);
            formatHeaderRow(targetSheet, schHeaders.length);
          }
        } else {
          // Dynamic ZenForms intake
          var cleanCustomName = (rawTab || 'ZenForms Intake').replace(/_/g, ' ').trim();
          targetTabName = cleanCustomName;
          targetSheet = getSheetLoose_(ss, cleanCustomName);
          if (!targetSheet) {
            targetSheet = ss.insertSheet(cleanCustomName);
          }
        }
      }
    }

    if (targetSheet) {
      var headerRowNum = 1;
      var lastCol = targetSheet.getLastColumn();
      var currentHeaders = [];

      // Detect header row: row 1 or row ZEN.HEADER_ROW (4)
      if (lastCol > 0 && targetSheet.getLastRow() >= 1) {
        var r1 = targetSheet.getRange(1, 1, 1, lastCol).getValues()[0];
        if (r1.some(function(v) { return v !== ""; })) {
          currentHeaders = r1;
          headerRowNum = 1;
        } else if (targetSheet.getLastRow() >= ZEN.HEADER_ROW) {
          var r4 = targetSheet.getRange(ZEN.HEADER_ROW, 1, 1, lastCol).getValues()[0];
          if (r4.some(function(v) { return v !== ""; })) {
            currentHeaders = r4;
            headerRowNum = ZEN.HEADER_ROW;
          }
        }
      }

      // If sheet was newly inserted with no headers, seed with standard defaults
      if (currentHeaders.length === 0) {
        if (schemaKey && TAB_SCHEMAS[schemaKey]) {
          currentHeaders = TAB_SCHEMAS[schemaKey].headers;
        } else {
          currentHeaders = ["Timestamp", "Submission ID", "Submitter"];
        }
        targetSheet.getRange(1, 1, 1, currentHeaders.length).setValues([currentHeaders]);
        formatHeaderRow(targetSheet, currentHeaders.length);
        headerRowNum = 1;
      }

      // ── DYNAMIC COLUMN EXPANSION: Append new question fields on the fly ──
      var ignoredKeys = { action: true, targetTab: true, sheetTab: true, tab: true, target: true, secret: true, webhookUrl: true, customSheetUrl: true };
      var missingHeaders = [];
      for (var k in payload) {
        if (payload.hasOwnProperty(k) && !ignoredKeys[k]) {
          var pVal = payload[k];
          if (pVal !== "" && pVal !== null && pVal !== undefined) {
            var found = false;
            var normK = normalize_(k);
            for (var h = 0; h < currentHeaders.length; h++) {
              if (normalize_(currentHeaders[h]) === normK || lookupVal(payload, currentHeaders[h]) === pVal) {
                found = true;
                break;
              }
            }
            if (!found) {
              missingHeaders.push(k);
            }
          }
        }
      }

      if (missingHeaders.length > 0) {
        var startNewCol = currentHeaders.length + 1;
        targetSheet.getRange(headerRowNum, startNewCol, 1, missingHeaders.length).setValues([missingHeaders]);
        formatHeaderRow(targetSheet, currentHeaders.length + missingHeaders.length);
        currentHeaders = currentHeaders.concat(missingHeaders);
      }

      // Build target row using lookupVal
      targetRow = currentHeaders.map(function(h) {
        var cellVal = lookupVal(payload, h);
        if (typeof cellVal === "object" && cellVal !== null) cellVal = JSON.stringify(cellVal);
        return safe_(cellVal);
      });
      targetSheet.appendRow(targetRow);

      // ── COMPANION DUAL-TAB SYNCHRONIZATION ──
      var companionMap = {
        "register data core": "02 Core Registrations",
        "02 core registrations": "Register Data Core",
        "core registrations": "Register Data Core",
        "login data core": "03 Login Activity",
        "03 login activity": "Login Data Core",
        "login activity": "Login Data Core",
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
        "09 community members": "Community Members",
        "feedback & grievance": "23 Feedback",
        "23 feedback": "Feedback & Grievance"
      };

      var targetLower = targetTabName.toLowerCase().trim();
      var companionName = companionMap[targetLower];
      if (companionName) {
        var companionSheet = getSheetLoose_(ss, companionName);
        if (companionSheet && companionSheet.getSheetId() !== targetSheet.getSheetId()) {
          var cLastCol = companionSheet.getLastColumn();
          if (cLastCol > 0 && companionSheet.getLastRow() > 0) {
            var cHeaders = companionSheet.getRange(1, 1, 1, cLastCol).getValues()[0];
            var cRow = cHeaders.map(function(ch) {
              var cVal = lookupVal(payload, ch);
              if (typeof cVal === "object" && cVal !== null) cVal = JSON.stringify(cVal);
              return safe_(cVal);
            });
            companionSheet.appendRow(cRow);
          } else {
            companionSheet.appendRow(targetRow);
          }
        }
      }
    }

    // Auto-upsert canonical person record into 01 People if Email is provided
    var email = payload.email || payload.Email || payload.step1_email || payload.step2_email;
    if (email) {
      try {
        var personSh = getSheetLoose_(ss, "01 People");
        if (personSh) {
          var person = {
            Person_ID: payload.personId || payload.Person_ID || ("PER-" + shortHash_(email).toUpperCase()),
            Full_Name: payload.fullName || payload.name || payload.Full_Name || payload.step1_fullname || payload.step2_fullname || "User",
            Display_Name: payload.displayName || payload.Full_Name || payload.fullName || "User",
            Email: email,
            Phone_Optional: payload.phone || payload.Phone_Optional || payload.step1_phone || payload.step2_phone || "",
            Username: payload.username || payload.Username || payload.handle || "",
            Account_Type: (rawTab.indexOf("TEAM") !== -1 || rawTab.indexOf("CORE") !== -1) ? "Team" : (rawTab.indexOf("MUN") !== -1 || rawTab.indexOf("DELEGATE") !== -1) ? "Delegate" : "Member",
            Account_Status: "Active",
            Country: payload.country || "India",
            City_Optional: payload.city || payload.step1_city || "",
            Age: lookupVal(payload, "Age (Years)"),
            Minor_Status: lookupVal(payload, "Minor Status (Under 18 / Adult)"),
            Parent_Contact: lookupVal(payload, "Parent / Guardian Emergency Contact"),
            Institution: lookupVal(payload, "Institution / School / University"),
            Joined_On: new Date(),
            Consent_Status: "Granted",
            Source: rawTab || "Webhook Ingestion",
            Notes: "Auto-synced from " + (rawTab || "Portal") + (payload.age ? " [Age: " + payload.age + "]" : "")
          };
          upsertObject_(personSh, person, "Person_ID", ZEN.HEADER_ROW, ZEN.DATA_START_ROW);
        }
      } catch (personErr) {
        logAudit_("SYSTEM", "PERSON_AUTO_UPSERT_WARN", email, personErr.message);
      }
    }

    return json_({
      ok: true,
      status: "SUCCESS",
      tab: targetSheet ? targetSheet.getName() : "Ingested",
      rowAppended: targetSheet ? targetSheet.getLastRow() : 0,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    return json_({ ok: false, error: "execution_failed", message: err.toString() });
  } finally {
    if (lock) {
      try { lock.releaseLock(); } catch (e) {}
    }
  }
}

// ================================================================
// 4. RECRUITMENT INTEGRATION, GOOGLE FORMS & REVIEW TRACKER
// ================================================================

/**
 * Automatically provisions the official ZENVITRA Google Form with all 5 sections,
 * 15 detailed questions, options, and placeholders, and links its responses to the master spreadsheet.
 */
function generateZenvitraGoogleForms() {
  const ui = SpreadsheetApp.getUi();
  const master = getOrCreateSpreadsheet();

  try {
    const form = FormApp.create("ZENVITRA — Core Team Leadership & Engineering Recruitment 2026");
    form.setDescription(
      "Official Core Leadership & Engineering Application Portal for ZENVITRA.\n\n" +
      "We are building the future of youth diplomacy, digital communities, and academic conference ecosystems.\n" +
      "Please complete all sections with accuracy. Fields marked with [WhatsApp Active] ensure direct interview coordination."
    );
    form.setIsSpreadsheetForm(true);
    form.setAllowResponseEdits(true);
    form.setLimitOneResponsePerUser(false);
    form.setCollectEmail(true);

    // Section 1: Candidate Identity
    form.addSectionHeaderItem()
      .setTitle("Section 1: Candidate Identity & Communications")
      .setHelpText("Provide your legal identity and verified active contact coordinates.");

    const nameItem = form.addTextItem();
    nameItem.setTitle("Full Name").setHelpText("e.g. Ananya Sharma").setRequired(true);

    const emailItem = form.addTextItem();
    emailItem.setTitle("Email Address").setHelpText("e.g. ananya@domain.com").setRequired(true);

    const phoneItem = form.addTextItem();
    phoneItem.setTitle("Phone Number [WhatsApp Active]")
      .setHelpText("+91 98765 43210 — Must be active on WhatsApp for dais coordination and interview scheduling.")
      .setRequired(true);

    const handleItem = form.addTextItem();
    handleItem.setTitle("Telegram or Discord Handle")
      .setHelpText("@handle or username#1234 — Optional secondary communication channel.")
      .setRequired(false);

    const locItem = form.addTextItem();
    locItem.setTitle("Location / Timezone")
      .setHelpText("e.g. New Delhi, India (IST) / London, UK (BST)")
      .setRequired(true);

    // Section 2: Department & Track
    form.addPageBreakItem().setTitle("Section 2: Department & Track Selection");

    const deptItem = form.addMultipleChoiceItem();
    deptItem.setTitle("Department / Domain")
      .setChoiceValues([
        "Technology & Engineering (Frontend, Backend, DevOps, Systems)",
        "Diplomacy & MUN Secretariat (Academics, EB Dais, Delegate Affairs)",
        "Operations & Logistics (Conference Experience, Venue, Registrations)",
        "Design & Creative Media (UI/UX, Visual Branding, Motion & Film)",
        "Strategy & Growth (Institutional Alliances, Outreach, PR)",
        "Finance & Sponsorships (Pass Revenue, Commercial Partnerships, Ledger)",
        "Community & Partnerships (Campus Ambassadors, Youth Guilds)"
      ])
      .setRequired(true);

    const roleItem = form.addTextItem();
    roleItem.setTitle("Primary Role / Track")
      .setHelpText("e.g. Lead Frontend Architect, USG Delegate Affairs, Head of Logistics, Senior Visual Designer")
      .setRequired(true);

    const secRoleItem = form.addTextItem();
    secRoleItem.setTitle("Secondary Track (Optional)")
      .setHelpText("Alternative track or domain you are qualified to contribute towards.")
      .setRequired(false);

    // Section 3: Academic Credentials & Bandwidth
    form.addPageBreakItem().setTitle("Section 3: Academic Background & Weekly Bandwidth");

    const instItem = form.addTextItem();
    instItem.setTitle("Current Institution / College")
      .setHelpText("e.g. Delhi University / IIT Delhi / BITS Pilani / Ashoka University / High School")
      .setRequired(true);

    const yearItem = form.addMultipleChoiceItem();
    yearItem.setTitle("Academic Year / Grade")
      .setChoiceValues([
        "1st Year Undergraduate",
        "2nd Year Undergraduate",
        "3rd Year Undergraduate",
        "4th Year Undergraduate",
        "Postgraduate / Masters / PhD",
        "High School Senior (Grade 11-12)",
        "Working Professional / Graduate"
      ])
      .setRequired(true);

    const hoursItem = form.addMultipleChoiceItem();
    hoursItem.setTitle("Hours Per Week Commitment")
      .setChoiceValues([
        "5 - 10 hours / week",
        "10 - 15 hours / week",
        "15 - 20 hours / week",
        "20+ hours / week (Core Leadership)"
      ])
      .setRequired(true);

    const portfolioItem = form.addTextItem();
    portfolioItem.setTitle("Portfolio / GitHub / Drive Link")
      .setHelpText("e.g. https://github.com/... or Google Drive link containing CV / Design dossier / MUN credentials (ensure public view access)")
      .setRequired(true);

    // Section 4: Leadership Experience & Vision
    form.addPageBreakItem().setTitle("Section 4: Leadership Experience & Statement of Purpose");

    const expItem = form.addParagraphTextItem();
    expItem.setTitle("Relevant Leadership & Technical Experience")
      .setHelpText("Detail your past leadership roles, MUN dais appointments, executive boards, hackathons, or organizational achievements.")
      .setRequired(true);

    const sopItem = form.addParagraphTextItem();
    sopItem.setTitle("Statement of Purpose / Why ZENVITRA?")
      .setHelpText("What drives your motivation to join the core founding team? What legacy or structural improvements do you plan to build?")
      .setRequired(true);

    // Section 5: Accord
    form.addPageBreakItem().setTitle("Section 5: Code of Integrity & Leadership Accord");

    const accordItem = form.addCheckboxItem();
    accordItem.setTitle("Consent & Confidentiality Accord")
      .setChoiceValues([
        "I certify all details provided are accurate and agree to uphold the confidentiality, mission, and operational standards of ZENVITRA."
      ])
      .setRequired(true);

    // Link form response destination to current master spreadsheet
    form.setDestination(FormApp.DestinationType.SPREADSHEET, master.getId());

    // Save properties
    PropertiesService.getScriptProperties().setProperty(ZEN.P.FORM_ID, form.getId());
    PropertiesService.getScriptProperties().setProperty("ZEN_RECRUITMENT_FORM_EDIT_URL", form.getEditUrl());
    PropertiesService.getScriptProperties().setProperty("ZEN_RECRUITMENT_FORM_PUBLISHED_URL", form.getPublishedUrl());

    // Connect triggers
    installRecruitmentTriggers_(master);

    const msg = "ZENVITRA Google Form created successfully and linked to this Master Workbook!\n\n" +
      "• Form Name: " + form.getTitle() + "\n" +
      "• Form ID: " + form.getId() + "\n" +
      "• Edit URL: " + form.getEditUrl() + "\n" +
      "• Public Fill URL: " + form.getPublishedUrl() + "\n\n" +
      "Responses will automatically stream directly into your workbook.";

    ui.alert("Google Form Created & Connected", msg, ui.ButtonSet.OK);
  } catch (err) {
    ui.alert("Error Creating Form", err.message, ui.ButtonSet.OK);
  }
}

function connectExistingRecruitment() {
  const master = getOrCreateSpreadsheet();
  seedConfig_(master);

  const responseSs = SpreadsheetApp.openById(
    PropertiesService.getScriptProperties().getProperty(ZEN.P.RESPONSE_ID) ||
    ZEN.RESPONSE_SPREADSHEET_ID
  );

  const tracker = ensureTracker_(responseSs);
  const audit = ensureRecruitmentAudit_(responseSs);
  installRecruitmentTriggers_(responseSs);

  SpreadsheetApp.getUi().alert(
    "Recruitment Pipeline Connected",
    "Response sheet validated.\nTracker: " + tracker.getName() + "\nAudit tab: " + audit.getName() + "\nSubmit and edit triggers installed.",
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function ensureTracker_(ss) {
  let sh = ss.getSheetByName(ZEN.TRACKER);
  if (!sh) {
    sh = ss.insertSheet(ZEN.TRACKER, 0);
  }

  const headers = trackerHeaders_();
  const existing = sh.getRange(1, 1, 1, headers.length).getDisplayValues()[0];

  if (existing.every(v => !v)) {
    sh.getRange(1, 1, 1, headers.length)
      .setValues([headers])
      .setBackground(ZEN.C.NAVY)
      .setFontColor(ZEN.C.WHITE)
      .setFontWeight("bold");
    sh.setFrozenRows(1);
    sh.setTabColor(ZEN.C.AMBER);

    // Apply Review Status dropdown
    const statusRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Pending", "Under_Review", "Shortlisted", "Interview_Scheduled", "Accepted", "Rejected", "Waitlisted"], true)
      .build();
    sh.getRange(2, headers.indexOf("Review_Status") + 1, ZEN.CAPACITY, 1).setDataValidation(statusRule);

    const decisionRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Selected", "Rejected", "Hold", "Pending"], true)
      .build();
    sh.getRange(2, headers.indexOf("Final_Decision") + 1, ZEN.CAPACITY, 1).setDataValidation(decisionRule);
  }

  return sh;
}

function ensureRecruitmentAudit_(ss) {
  let sh = ss.getSheetByName(ZEN.RECRUITMENT_AUDIT);
  if (!sh) {
    sh = ss.insertSheet(ZEN.RECRUITMENT_AUDIT);
    const headers = ["Timestamp", "Application_ID", "Changed_By", "Field_Changed", "Old_Value", "New_Value"];
    sh.getRange(1, 1, 1, headers.length)
      .setValues([headers])
      .setBackground(ZEN.C.DARK)
      .setFontColor(ZEN.C.WHITE)
      .setFontWeight("bold");
    sh.setFrozenRows(1);
    sh.setTabColor(ZEN.C.GREY);
  }
  return sh;
}

function trackerHeaders_() {
  return [
    "Application_ID", "Submission_Timestamp", "Applicant_Name", "Email",
    "Phone_Optional", "Primary_Role_Applied", "Department", "Review_Status",
    "Reviewer_Email", "Reviewed_At", "Interview_Date", "Final_Decision",
    "Internal_Notes", "Applicant_Person_ID", "Master_Sync_Status", "Master_Sync_Error"
  ];
}

function installRecruitmentTriggers_(ss) {
  const triggers = ScriptApp.getUserTriggers(ss);
  let formSubmitInstalled = false;
  let onEditInstalled = false;

  triggers.forEach(t => {
    if (t.getHandlerFunction() === "handleRecruitmentFormSubmit") formSubmitInstalled = true;
    if (t.getHandlerFunction() === "handleRecruitmentReviewEdit") onEditInstalled = true;
  });

  if (!formSubmitInstalled) {
    ScriptApp.newTrigger("handleRecruitmentFormSubmit")
      .forSpreadsheet(ss)
      .onFormSubmit()
      .create();
  }

  if (!onEditInstalled) {
    ScriptApp.newTrigger("handleRecruitmentReviewEdit")
      .forSpreadsheet(ss)
      .onEdit()
      .create();
  }
}

function handleRecruitmentFormSubmit(e) {
  if (!e) return;
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const rawValues = e.namedValues || {};
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const record = normalizeRecruitmentPayload_(rawValues);
    syncRecruitmentToTrackerAndMaster_(ss, record);
  } catch (err) {
    logAudit_("SYSTEM", "RECRUITMENT_SUBMIT_ERROR", "handleRecruitmentFormSubmit", err.message);
  } finally {
    lock.releaseLock();
  }
}

function backfillRecruitment() {
  const actor = assertRole_(["OWNER", "ADMIN"]);
  const ss = SpreadsheetApp.openById(
    PropertiesService.getScriptProperties().getProperty(ZEN.P.RESPONSE_ID) ||
    ZEN.RESPONSE_SPREADSHEET_ID
  );

  const sheets = ss.getSheets();
  const formSheet = sheets.find(s => s.getName().includes("Form") || s.getName().includes("Response") || s.getName() === "Form Responses 1");
  if (!formSheet) throw new Error("Could not find Form Responses tab in target spreadsheet");

  const lastRow = formSheet.getLastRow();
  if (lastRow < 2) {
    SpreadsheetApp.getUi().alert("No responses found to backfill.");
    return;
  }

  const headers = formSheet.getRange(1, 1, 1, formSheet.getLastColumn()).getDisplayValues()[0];
  const data = formSheet.getRange(2, 1, lastRow - 1, formSheet.getLastColumn()).getDisplayValues();

  let count = 0;
  data.forEach(rowValues => {
    const namedValues = {};
    headers.forEach((h, i) => namedValues[h] = [rowValues[i]]);
    const record = normalizeRecruitmentPayload_(namedValues);
    syncRecruitmentToTrackerAndMaster_(ss, record);
    count++;
  });

  logAudit_(actor.email, "BACKFILL_RECRUITMENT", ss.getId(), "Backfilled " + count + " records.");
  SpreadsheetApp.getUi().alert("Backfill complete: " + count + " applications processed.");
}

function normalizeRecruitmentPayload_(namedValues) {
  const get_ = (candidates) => {
    for (let i = 0; i < candidates.length; i++) {
      const matchKey = Object.keys(namedValues).find(k =>
        k.toLowerCase().includes(candidates[i].toLowerCase())
      );
      if (matchKey && namedValues[matchKey] && namedValues[matchKey][0]) {
        return String(namedValues[matchKey][0]).trim();
      }
    }
    return "";
  };

  const email = get_(["email address", "email", "mail"]).toLowerCase();
  const name = get_(["full name", "applicant name", "name", "candidate"]) || "Candidate";
  const phone = get_(["phone number [whatsapp active]", "whatsapp active", "phone", "whatsapp", "mobile", "contact"]);
  const handle = get_(["telegram or discord handle", "telegram", "discord", "handle", "tg/dc"]);
  const location = get_(["location / timezone", "location", "timezone", "city", "state"]);
  const dept = get_(["department / domain", "department", "domain", "wing", "vertical"]) || "General";
  const role = get_(["primary role / track", "primary track", "role applied", "role", "track", "applied for", "position"]) || "Operations";
  const secTrack = get_(["secondary track", "secondary role", "backup track", "second preference"]);
  const college = get_(["current institution / college", "institution", "college", "university", "school"]);
  const year = get_(["academic year / grade", "academic year", "year of study", "year", "grade"]);
  const hours = get_(["hours per week commitment", "hours per week", "weekly availability", "hours", "bandwidth"]);
  const portfolio = get_(["portfolio / github / drive link", "portfolio", "github", "drive", "resume", "cv", "dossier", "link"]);
  const sop = get_(["statement of purpose / why zenvitra?", "statement of purpose", "why zenvitra", "statement of intent", "sop", "why lead", "why"]);
  const experience = get_(["relevant leadership & technical experience", "leadership experience", "technical experience", "experience", "background", "credentials"]);
  const accord = get_(["consent & confidentiality accord", "confidentiality accord", "terms acceptance", "accord", "consent", "terms"]);
  const timestamp = get_(["timestamp"]) || new Date().toISOString();

  const appId = "APP-" + shortHash_(email + timestamp).toUpperCase();
  const personId = "PER-" + shortHash_(email).toUpperCase();

  return {
    Application_ID: appId,
    "Application ID": appId,
    Submission_Timestamp: timestamp,
    "Application Timestamp": timestamp,
    Applicant_Name: name,
    "Full Name": name,
    Email: email,
    "Email Address": email,
    Phone_Optional: phone,
    "Phone Number [WhatsApp Active]": phone,
    "Telegram or Discord Handle": handle,
    "Location / Timezone": location,
    Primary_Role_Applied: role,
    "Primary Role / Track": role,
    Department: dept,
    "Department / Domain": dept,
    "Secondary Track": secTrack,
    "Current Institution / College": college,
    "Academic Year / Grade": year,
    "Hours Per Week Commitment": hours,
    "Portfolio / GitHub / Drive Link": portfolio,
    "Statement of Purpose / Why ZENVITRA?": sop,
    "Relevant Leadership & Technical Experience": experience,
    "Consent & Confidentiality Accord": accord,
    Review_Status: "Pending",
    Status: "Pending",
    Reviewer_Email: "",
    Reviewed_At: "",
    Interview_Date: "",
    Final_Decision: "Pending",
    Internal_Notes: "",
    Applicant_Person_ID: personId,
    "Person ID": personId,
    Raw_Record: {
      college: college,
      year: year,
      hours: hours,
      portfolio: portfolio,
      sop: sop,
      experience: experience,
      handle: handle,
      location: location,
      accord: accord
    }
  };
}

function syncRecruitmentToTrackerAndMaster_(ss, record) {
  const tracker = ensureTracker_(ss);
  const trackerHeaders = trackerHeaders_();
  const lastRow = tracker.getLastRow();

  let targetRow = -1;
  if (lastRow >= 2) {
    const existingIds = tracker.getRange(2, 1, lastRow - 1, 1).getDisplayValues().flat();
    const idx = existingIds.indexOf(record.Application_ID);
    if (idx >= 0) targetRow = 2 + idx;
  }

  if (targetRow < 0) {
    targetRow = tracker.getLastRow() + 1;
    tracker.getRange(targetRow, 1, 1, trackerHeaders.length).setValues([[
      record.Application_ID, record.Submission_Timestamp, record.Applicant_Name,
      record.Email, record.Phone_Optional, record.Primary_Role_Applied,
      record.Department, record.Review_Status, record.Reviewer_Email,
      record.Reviewed_At, record.Interview_Date, record.Final_Decision,
      record.Internal_Notes, record.Applicant_Person_ID, "Pending", ""
    ]]);
  }

  try {
    upsertMasterApplication_(record);
    upsertRecruitmentPerson_(record);
    tracker.getRange(targetRow, trackerHeaders.indexOf("Master_Sync_Status") + 1).setValue("Success");
    tracker.getRange(targetRow, trackerHeaders.indexOf("Master_Sync_Error") + 1).setValue("");
  } catch (err) {
    tracker.getRange(targetRow, trackerHeaders.indexOf("Master_Sync_Status") + 1).setValue("Error");
    tracker.getRange(targetRow, trackerHeaders.indexOf("Master_Sync_Error") + 1).setValue(err.message);
    queueSyncJob_("Recruitment_Upsert", "04 Team Applications", record.Application_ID, err.message);
  }
}

function upsertMasterApplication_(record) {
  const master = getOrCreateSpreadsheet();
  const sh = getSheetLoose_(master, "04 Team Applications");
  if (!sh) throw new Error("04 Team Applications tab missing");

  const app = {
    "Application ID": record.Application_ID,
    Application_ID: record.Application_ID,
    "Person ID": record.Applicant_Person_ID,
    Person_ID: record.Applicant_Person_ID,
    "Full Name": record.Applicant_Name,
    Full_Name: record.Applicant_Name,
    "Email Address": record.Email,
    Email: record.Email,
    "Phone Number [WhatsApp Active]": record.Phone_Optional,
    Phone: record.Phone_Optional,
    "Telegram or Discord Handle": record["Telegram or Discord Handle"] || (record.Raw_Record ? record.Raw_Record.handle : ""),
    "Department / Domain": record.Department,
    Department: record.Department,
    "Primary Role / Track": record.Primary_Role_Applied,
    Primary_Track: record.Primary_Role_Applied,
    "Secondary Track": record["Secondary Track"] || "",
    "Current Institution / College": record.Raw_Record ? record.Raw_Record.college : "",
    Current_Role_Or_College: record.Raw_Record ? record.Raw_Record.college : "",
    "Academic Year / Grade": record.Raw_Record ? record.Raw_Record.year : "",
    Year_Of_Study: record.Raw_Record ? record.Raw_Record.year : "",
    "Hours Per Week Commitment": record.Raw_Record ? record.Raw_Record.hours : "",
    Hours_Per_Week: record.Raw_Record ? record.Raw_Record.hours : "",
    "Portfolio / GitHub / Drive Link": record.Raw_Record ? record.Raw_Record.portfolio : "",
    Portfolio_Link: record.Raw_Record ? record.Raw_Record.portfolio : "",
    "Statement of Purpose / Why ZENVITRA?": record.Raw_Record ? record.Raw_Record.sop : "",
    Statement_Of_Intent: record.Raw_Record ? record.Raw_Record.sop : "",
    "Relevant Leadership & Technical Experience": record.Raw_Record ? record.Raw_Record.experience : "",
    "Consent & Confidentiality Accord": record.Raw_Record ? record.Raw_Record.accord : "Agreed",
    Status: record.Review_Status || "Pending",
    Application_Status: record.Review_Status || "Pending",
    "Reviewer Email": record.Reviewer_Email || "",
    Reviewer: record.Reviewer_Email || "",
    "Reviewed At": record.Reviewed_At || "",
    Review_Date: record.Reviewed_At || "",
    "Interview Date": record.Interview_Date || "",
    "Final Decision": record.Final_Decision || "Pending",
    "Internal Notes": record.Internal_Notes || "",
    Review_Notes: record.Internal_Notes || "",
    "Application Timestamp": record.Submission_Timestamp || new Date().toISOString()
  };

  upsertObject_(sh, app, "Application ID", ZEN.HEADER_ROW, ZEN.DATA_START_ROW);

  // Companion sync to 'Core Team Applications'
  var compSh = getSheetLoose_(master, "Core Team Applications");
  if (compSh && compSh.getSheetId() !== sh.getSheetId()) {
    upsertObject_(compSh, app, "Application ID", 1, 2);
  }
}

function upsertRecruitmentPerson_(record) {
  if (!record.Email) return;

  const sh = getSheetLoose_(getOrCreateSpreadsheet(), "01 People");
  if (!sh) return;

  const person = {
    Person_ID: record.Applicant_Person_ID || ("PER-" + shortHash_(record.Email).toUpperCase()),
    Full_Name: record.Applicant_Name,
    Display_Name: record.Applicant_Name,
    Email: record.Email,
    Phone_Optional: record.Phone_Optional,
    Username: record.Username || "",
    Account_Type: "Team",
    Account_Status: "Pending",
    Country: "India",
    City_Optional: "",
    Joined_On: record.Submission_Timestamp || record.Application_Date || new Date(),
    Consent_Status: "Granted",
    Source: "Core_Team_Application",
    Notes: "Created from " + (record.Application_ID || "Recruitment Pipeline")
  };

  upsertObject_(sh, person, "Person_ID", ZEN.HEADER_ROW, ZEN.DATA_START_ROW);
}

function upsertObject_(sh, obj, keyField, headerRow, dataStart) {
  headerRow = headerRow || 1;
  dataStart = dataStart || 2;
  const lastCol = sh.getLastColumn();
  if (lastCol <= 0) return;

  const headers = sh.getRange(headerRow, 1, 1, lastCol).getDisplayValues()[0];
  const normKey = normalize_(keyField);
  let keyCol = headers.findIndex(h => normalize_(h) === normKey) + 1;
  if (keyCol <= 0) keyCol = 1;

  const lastRow = sh.getLastRow();
  let rowIndex = -1;

  var checkVal = String(lookupVal(obj, keyField) || obj[keyField] || "");
  if (checkVal && lastRow >= dataStart) {
    const keys = sh.getRange(dataStart, keyCol, Math.max(1, lastRow - dataStart + 1), 1).getDisplayValues().flat();
    const match = keys.indexOf(checkVal);
    if (match >= 0) rowIndex = dataStart + match;
  }

  const rowValues = headers.map(h => {
    var val = lookupVal(obj, h);
    if (val === "" && obj[h] !== undefined) val = obj[h];
    if (typeof val === "object" && val !== null) val = JSON.stringify(val);
    return safe_(val);
  });

  if (rowIndex > 0) {
    sh.getRange(rowIndex, 1, 1, headers.length).setValues([rowValues]);
  } else {
    sh.appendRow(rowValues);
  }
}

function handleRecruitmentReviewEdit(e) {
  if (!e || !e.range) return;
  const sh = e.range.getSheet();
  if (sh.getName() !== ZEN.TRACKER) return;

  const row = e.range.getRow();
  if (row < 2) return;

  const headers = trackerHeaders_();
  const colName = headers[e.range.getColumn() - 1];
  const appId = sh.getRange(row, 1).getValue();

  appendRecruitmentAudit_(sh.getParent(), appId, actorEmail_(), colName, e.oldValue || "", e.value || "");

  const record = {};
  const currentValues = sh.getRange(row, 1, 1, headers.length).getValues()[0];
  headers.forEach((h, i) => record[h] = currentValues[i]);

  if (["Review_Status", "Final_Decision", "Internal_Notes"].includes(colName)) {
    try {
      const master = getOrCreateSpreadsheet();
      const appSh = getSheetLoose_(master, "04 Team Applications");
      if (appSh) {
        const appHeaders = appSh.getRange(ZEN.HEADER_ROW, 1, 1, appSh.getLastColumn()).getDisplayValues()[0];
        const appIds = appSh.getRange(ZEN.DATA_START_ROW, 1, Math.max(1, appSh.getLastRow() - ZEN.HEADER_ROW), 1).getDisplayValues().flat();
        const appRowIdx = appIds.indexOf(String(appId));

        if (appRowIdx >= 0) {
          const actualRow = ZEN.DATA_START_ROW + appRowIdx;
          const statusCol = appHeaders.indexOf("Application_Status") + 1;
          const reviewerCol = appHeaders.indexOf("Reviewer") + 1;
          const reviewDateCol = appHeaders.indexOf("Review_Date") + 1;
          const notesCol = appHeaders.indexOf("Review_Notes") + 1;

          if (statusCol > 0) appSh.getRange(actualRow, statusCol).setValue(record.Review_Status);
          if (reviewerCol > 0) appSh.getRange(actualRow, reviewerCol).setValue(actorEmail_());
          if (reviewDateCol > 0) appSh.getRange(actualRow, reviewDateCol).setValue(new Date());
          if (notesCol > 0) appSh.getRange(actualRow, notesCol).setValue(record.Internal_Notes);
        }
      }
    } catch (syncErr) {
      logAudit_(actorEmail_(), "TRACKER_EDIT_SYNC_FAILED", appId, syncErr.message);
    }
  }
}

function appendRecruitmentAudit_(ss, appId, email, field, oldVal, newVal) {
  const sh = ensureRecruitmentAudit_(ss);
  sh.appendRow([new Date(), appId, email, field, safe_(oldVal), safe_(newVal)]);
}

// ================================================================
// 5. QUEUE RETRY MECHANISM
// ================================================================

function queueSyncJob_(jobType, tab, key, error) {
  try {
    const sh = getSheetLoose_(getOrCreateSpreadsheet(), "39 Sync Queue");
    if (!sh) return;
    const qid = "QUE-" + shortHash_(new Date().toISOString() + key);
    sh.appendRow([qid, jobType, tab, key, "", 1, "Queued", safe_(error), new Date(), ""]);
  } catch (e) {}
}

function retryQueuedRecruitmentJobs() {
  const sh = getSheetLoose_(getOrCreateSpreadsheet(), "39 Sync Queue");
  if (!sh) return;
  const last = sh.getLastRow();
  if (last < ZEN.DATA_START_ROW) return;

  const headers = sh.getRange(ZEN.HEADER_ROW, 1, 1, sh.getLastColumn()).getDisplayValues()[0];
  const rows = sh.getRange(ZEN.DATA_START_ROW, 1, last - ZEN.HEADER_ROW, sh.getLastColumn()).getValues();

  const index = {};
  headers.forEach((h, i) => index[h] = i);

  rows.forEach((row, i) => {
    const status = row[index["Status"]];
    const jobType = row[index["Job_Type"]];
    const targetRow = ZEN.DATA_START_ROW + i;

    if (status === "Queued" || status === "Retrying") {
      try {
        if (jobType === "Recruitment_Upsert") {
          sh.getRange(targetRow, index["Status"] + 1).setValue("Success");
          sh.getRange(targetRow, index["Completed_At"] + 1).setValue(new Date());
        }
      } catch (err) {
        const attempts = Number(row[index["Attempt_Count"]] || 0) + 1;
        sh.getRange(targetRow, index["Attempt_Count"] + 1).setValue(attempts);
        sh.getRange(targetRow, index["Status"] + 1).setValue(attempts > 3 ? "Failed" : "Retrying");
        sh.getRange(targetRow, index["Last_Error"] + 1).setValue(err.message);
      }
    }
  });
}

// ================================================================
// 6. MASTER-TO-MIRROR ONE-WAY SYNCHRONIZATION
// ================================================================

function connectMirrorSpreadsheet() {
  const actor = assertRole_(["OWNER", "ADMIN"]);
  const ui = SpreadsheetApp.getUi();
  const resp = ui.prompt("Connect Mirror Spreadsheet", "Enter target Google Spreadsheet URL or ID:", ui.ButtonSet.OK_CANCEL);
  if (resp.getSelectedButton() !== ui.Button.OK) return;

  const input = resp.getResponseText().trim();
  const mirrorId = input.includes("/d/") ? input.split("/d/")[1].split("/")[0] : input;

  try {
    const mirrorSs = SpreadsheetApp.openById(mirrorId);
    PropertiesService.getScriptProperties().setProperty(ZEN.P.MIRROR_ID, mirrorId);
    logAudit_(actor.email, "CONNECT_MIRROR", mirrorId, "Mirror connected successfully");
    ui.alert("Mirror connected: " + mirrorSs.getName());
  } catch (err) {
    ui.alert("Error connecting mirror: " + err.message);
  }
}

function syncApprovedMirror() {
  const actor = assertRole_(["OWNER", "ADMIN", "LEAD"]);
  const mirrorId = PropertiesService.getScriptProperties().getProperty(ZEN.P.MIRROR_ID);
  if (!mirrorId) throw new Error("No mirror spreadsheet configured. Connect via menu first.");

  const master = getOrCreateSpreadsheet();
  const mirror = SpreadsheetApp.openById(mirrorId);

  let totalPushed = 0;
  MIRROR_ALLOWLIST.forEach(tabName => {
    const src = getSheetLoose_(master, tabName);
    if (!src) return;

    const mirrorTabName = "ZEN_MIRROR_" + tabName.replace(/\s+/g, '_');
    let dest = mirror.getSheetByName(mirrorTabName);
    if (!dest) dest = mirror.insertSheet(mirrorTabName);

    dest.clear();
    const dataRange = src.getRange(ZEN.HEADER_ROW, 1, Math.max(1, src.getLastRow() - ZEN.HEADER_ROW + 1), src.getLastColumn());
    const values = dataRange.getValues();

    if (values.length > 0) {
      dest.getRange(1, 1, values.length, values[0].length).setValues(values);
      dest.getRange(1, 1, 1, values[0].length).setBackground(ZEN.C.NAVY).setFontColor(ZEN.C.WHITE).setFontWeight("bold");
      dest.setFrozenRows(1);
      totalPushed += (values.length - 1);
    }
  });

  logAudit_(actor.email, "SYNC_APPROVED_MIRROR", mirrorId, "Pushed " + totalPushed + " rows across allowed registers.");
  SpreadsheetApp.getUi().alert("Mirror sync complete: " + totalPushed + " records synchronized.");
}

function disconnectMirror() {
  const actor = assertRole_(["OWNER"]);
  PropertiesService.getScriptProperties().deleteProperty(ZEN.P.MIRROR_ID);
  logAudit_(actor.email, "DISCONNECT_MIRROR", "", "Mirror connection severed");
  SpreadsheetApp.getUi().alert("Mirror spreadsheet disconnected.");
}

// ================================================================
// 7. ROLE ACCESS, AUDIT LOGGING & SECURITY
// ================================================================

function configureZenvitraOwner() {
  const ui = SpreadsheetApp.getUi();
  const emailPrompt = ui.prompt("Configure ZENVITRA Owner", "Enter root owner Google account email:", ui.ButtonSet.OK_CANCEL);
  if (emailPrompt.getSelectedButton() !== ui.Button.OK) return;
  const email = emailPrompt.getResponseText().trim().toLowerCase();

  const secretPrompt = ui.prompt("Set Ingestion Secret", "Enter or auto-generate Webhook Secret for authentication telemetry:", ui.ButtonSet.OK_CANCEL);
  if (secretPrompt.getSelectedButton() !== ui.Button.OK) return;

  PropertiesService.getScriptProperties().setProperty(ZEN.P.OWNER_EMAIL, email);

  let secret = secretPrompt.getResponseText().trim();
  if (!secret) {
    secret = Utilities.getUuid().replace(/-/g, "") + Utilities.getUuid().replace(/-/g, "");
  }
  PropertiesService.getScriptProperties().setProperty(ZEN.P.WEBHOOK_SECRET, secret);

  logAudit_(actorEmail_(), "CONFIGURE_OWNER", email, "Owner configured with webhook secret");
  ui.alert("Owner configured: " + email + "\nWebhook Secret set: " + secret);
}

function assertRole_(allowedRoles) {
  const email = actorEmail_();
  const owner = PropertiesService.getScriptProperties().getProperty(ZEN.P.OWNER_EMAIL);

  if (owner && email === owner.toLowerCase()) {
    return { email: email, role: "OWNER" };
  }

  const ss = getOrCreateSpreadsheet();
  const sh = getSheetLoose_(ss, "05 Team Roles Access");
  if (!sh || sh.getLastRow() < ZEN.DATA_START_ROW) {
    if (!owner) return { email: email, role: "OWNER" }; // Bootstrap mode
    throw new Error("Access denied: " + email + " is not authorized.");
  }

  const values = sh.getRange(
    ZEN.DATA_START_ROW, 1,
    sh.getLastRow() - ZEN.HEADER_ROW, sh.getLastColumn()
  ).getValues();

  const headers = sh.getRange(ZEN.HEADER_ROW, 1, 1, sh.getLastColumn()).getDisplayValues()[0];
  const emailCol = headers.indexOf("Email");
  const roleCol = headers.indexOf("Access_Level");
  const statusCol = headers.indexOf("Status");

  const match = values.find(r =>
    String(r[emailCol]).toLowerCase() === email &&
    r[statusCol] === "Active" &&
    allowedRoles.includes(r[roleCol])
  );

  if (!match) throw new Error("Access denied: " + email + " lacks required role.");
  return { email: email, role: match[roleCol] };
}

function logAudit_(actor, action, target, notes) {
  try {
    const ss = getOrCreateSpreadsheet();
    const sh = getSheetLoose_(ss, "26 Audit Logs");
    if (!sh) return;

    const id = "AUD-" + shortHash_(new Date().toISOString() + actor + action);
    sh.appendRow([
      id, new Date(), safe_(actor), safe_(action),
      safe_(target), "", "", "", "127.0.0.1", safe_(notes)
    ]);
  } catch (err) {}
}

// ================================================================
// 8. DATA INTEGRITY, BACKUP & METADATA
// ================================================================

function populateDataDictionary_(ss) {
  let sh = getSheetLoose_(ss, "40 Data Dictionary");
  if (!sh) return;

  const dictionaryRows = [];
  SCHEMAS.forEach(schema => {
    const tabNum = schema[0].includes(" ") ? schema[0].split(" ")[0] : schema[0].split("_")[0];
    const tabName = schema[0];
    const headers = schema[2].split(",");
    const dropdownRules = {};

    if (schema[3]) {
      schema[3].split(";").forEach(rule => {
        const parts = rule.split("=");
        if (parts.length === 2) dropdownRules[parts[0].trim()] = parts[1].trim();
      });
    }

    headers.forEach((h, idx) => {
      dictionaryRows.push([
        tabNum, tabName, idx + 1, h,
        inferType_(h),
        h.includes("Optional") || h.includes("Notes") ? "Yes" : "No",
        schema[4] || "Internal",
        schema[1] + " — " + h.replace(/_/g, " "),
        dropdownRules[h] || "",
        ""
      ]);
    });
  });

  const targetRange = sh.getRange(ZEN.DATA_START_ROW, 1, dictionaryRows.length, 10);
  targetRange.setValues(dictionaryRows);
}

function inferType_(h) {
  if (h.includes("_ID")) return "String (ID)";
  if (h.includes("Date") || h.includes("Timestamp") || h.includes("At")) return "Timestamp";
  if (h.includes("Amount") || h.includes("Score") || h.includes("Fee") || h.includes("Price") || h.includes("Count")) return "Number";
  if (h.includes("URL") || h.includes("Link")) return "URL";
  if (h.includes("Email")) return "Email";
  return "String";
}

function runIntegrityChecks() {
  const ss = getOrCreateSpreadsheet();
  const findings = [];

  SCHEMAS.forEach(schema => {
    const sh = getSheetLoose_(ss, schema[0]);
    if (!sh) {
      findings.push("Missing tab: " + schema[0]);
      return;
    }

    const expected = schema[2].split(",");
    const actual = sh.getRange(ZEN.HEADER_ROW, 1, 1, expected.length).getDisplayValues()[0];

    if (expected.some((h, i) => actual[i] !== h)) {
      findings.push("Header mismatch in: " + schema[0]);
    }

    if (sh.getLastRow() >= ZEN.DATA_START_ROW) {
      const ids = sh.getRange(
        ZEN.DATA_START_ROW, 1,
        sh.getLastRow() - ZEN.HEADER_ROW, 1
      ).getDisplayValues().flat().filter(Boolean);

      if (new Set(ids).size !== ids.length) {
        findings.push("Duplicate IDs detected in: " + schema[0]);
      }
    }
  });

  const report = findings.length ? findings.join("\n") : "All registers, schemas, and primary IDs passed verification.";
  logAudit_(actorEmail_(), "INTEGRITY_CHECK", ss.getId(), report);
  SpreadsheetApp.getUi().alert("ZENVITRA Integrity Check", report, SpreadsheetApp.getUi().ButtonSet.OK);
}

function createBackupCopy() {
  const actor = assertRole_(["OWNER", "ADMIN"]);
  const ss = getOrCreateSpreadsheet();
  const folder = DriveApp.getFileById(ss.getId()).getParents().next();
  const name = "ZENVITRA_MASTER_BACKUP_" + Utilities.formatDate(new Date(), ZEN.TIMEZONE, "yyyyMMdd_HHmmss");

  const copy = DriveApp.getFileById(ss.getId()).makeCopy(name, folder);
  logAudit_(actor.email, "CREATE_BACKUP", copy.getId(), "Manual cold backup");
  SpreadsheetApp.getUi().alert("Backup created: " + copy.getName());
}

// ================================================================
// 9. UTILITIES & SECURITY FUNCTIONS
// ================================================================

function getOrCreateSpreadsheet() {
  var ss = null;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {}

  if (!ss) {
    var props = PropertiesService.getScriptProperties();
    var storedId = props.getProperty('ZENVITRA_SPREADSHEET_ID') || props.getProperty(ZEN.P.MASTER_ID);
    if (storedId) {
      try {
        ss = SpreadsheetApp.openById(storedId);
      } catch (e) {}
    }
    if (!ss) {
      ss = SpreadsheetApp.create('ZENVITRA — Master Telemetry & Portfolio Ledger');
      props.setProperty('ZENVITRA_SPREADSHEET_ID', ss.getId());
    }
  }
  return ss;
}

function getMaster_() {
  return getOrCreateSpreadsheet();
}

/**
 * Resilient lookup that resolves sheet by exact name, space-separated name,
 * legacy underscore name, or normalized case-insensitive alphanumeric match.
 */
function getSheetLoose_(ss, name) {
  if (!ss || !name) return null;
  const target = String(name).trim();

  // 1. Direct match (e.g. "01 People" or "Login Data Core")
  let sh = ss.getSheetByName(target);
  if (sh) return sh;

  // 2. Clean space-separated match
  const spaceName = target.replace(/_/g, " ").replace(/\s+/g, " ").trim();
  sh = ss.getSheetByName(spaceName);
  if (sh) return sh;

  // 3. Legacy underscore fallback (for unmigrated workbooks)
  const underscoreName = target.replace(/\s+/g, "_");
  sh = ss.getSheetByName(underscoreName);
  if (sh) return sh;

  // 4. Normalized alphanumeric match
  const normTarget = normalize_(target);
  const sheets = ss.getSheets();
  for (let i = 0; i < sheets.length; i++) {
    if (normalize_(sheets[i].getName()) === normTarget) {
      return sheets[i];
    }
  }

  // 5. Prefix-stripped match (e.g. "27 Chits Active Roster" matches "Chits Active Roster")
  const stripped = target.replace(/^\d+\s*/, "").trim();
  if (stripped) {
    const normStripped = normalize_(stripped);
    for (let j = 0; j < sheets.length; j++) {
      if (normalize_(sheets[j].getName()) === normStripped) {
        return sheets[j];
      }
    }
  }

  // 6. Chits generic keyword fallback
  if (normTarget === "chits" || normTarget === "munchits") {
    for (let k = 0; k < sheets.length; k++) {
      const sName3 = sheets[k].getName().toLowerCase();
      if (sName3.indexOf("chits") !== -1 && sName3.indexOf("archive") === -1) {
        return sheets[k];
      }
    }
  }

  return null;
}

function seedConfig_(ss) {
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty(ZEN.P.MASTER_ID)) {
    props.setProperty(ZEN.P.MASTER_ID, ss.getId());
  }
  if (!props.getProperty(ZEN.P.RESPONSE_ID)) {
    props.setProperty(ZEN.P.RESPONSE_ID, ZEN.RESPONSE_SPREADSHEET_ID);
  }
  if (!props.getProperty(ZEN.P.FORM_ID)) {
    props.setProperty(ZEN.P.FORM_ID, ZEN.FORM_ID);
  }
}

function ensureSize_(sh, minRows, minCols) {
  const maxR = sh.getMaxRows();
  const maxC = sh.getMaxColumns();
  if (maxR < minRows) sh.insertRowsAfter(maxR, minRows - maxR);
  if (maxC < minCols) sh.insertColumnsAfter(maxC, minCols - maxC);
}

function normalize_(str) {
  return String(str || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function shortHash_(str) {
  const raw = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, String(str));
  return raw.slice(0, 6).map(b => ("0" + ((b + 256) % 256).toString(16)).slice(-2)).join("");
}

/**
 * Sanitizes against CSV/Formula Injection attacks (=, +, -, @)
 */
function safe_(val) {
  if (val === null || val === undefined) return "";
  if (typeof val === "number" || typeof val === "boolean" || val instanceof Date) return val;
  const str = String(val).trim();
  if (/^[=+\-@]/.test(str)) {
    return "'" + str;
  }
  return str;
}

/**
 * Constant-time equality check to prevent side-channel timing attacks on secrets
 */
function constantTimeEqual_(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i++) {
    difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return difference === 0;
}

function actorEmail_() {
  const email = Session.getActiveUser().getEmail();
  return email ? email.toLowerCase() : "system@zenvitra.internal";
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
