import { ZenForm, ZenFormField } from '@/types/forms';

export const ZEN_DIPLOMACY_2026_FORM_TEMPLATE: ZenForm = {
  id: 'zen-diplomacy-2026-registration',
  slug: 'zen-diplomacy-2026',
  title: 'ZEN.DIPLOMACY 2026 — Official Delegate Registration',
  description: 'National Youth Diplomatic & Multilateral Assembly. Register your committee preference, portfolio allocations, and ratified credentials.',
  category: 'MUN_REGISTRATION',
  theme: 'amber',
  submitButtonText: 'Submit Delegate Registration & Lock Portfolios',
  successMessage: 'Your delegate registration has been securely recorded on the sovereign ledger! The Secretariat will review your portfolio preferences and sync allocations to the live matrix.',
  ownerHandle: 'yuveer',
  submissionsCount: 42,
  isPublished: true,
  allowAnonymous: false,
  acceptingResponses: true,
  stepHeadingsEnabled: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  googleSheetsConfig: {
    isConnected: true,
    sheetTab: 'ZEN DIPLOMACY MUN',
    webhookUrl: 'https://script.google.com/macros/s/AKfycbxNKYri4iKy3VuWUn3B5x7cW40wDTS2x2Kt16u_qxfLGwACsS-Zs3-COu7EsguZdJDM/exec',
    autoSync: true,
    sheetUrl: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit'
  },
  customStyle: {
    displayFont: 'Clash Display',
    bodyFont: 'Space Grotesk',
    accentColor: '#f59e0b',
    cardStyle: 'glass-deep',
    borderRadius: '2xl'
  },
  fields: [
    /* ══════════════════════════════════════════════════════════════════
       STEP 1: PERSONAL CREDENTIALS & DELEGATE PROFILE
       ══════════════════════════════════════════════════════════════════ */
    {
      id: 'step1_fullname',
      label: 'Full Name of the Delegate',
      type: 'text',
      placeholder: 'e.g. Ananya Sharma',
      description: 'As it should appear on your official conference placard and verifiable ZEN.CERTIFY credentials.',
      required: true,
      stepHeading: {
        enabled: true,
        stepBadge: 'STEP 1',
        stepNumber: '01 / Personal Credentials',
        headingTitle: 'Delegate Identity & Profile',
        description: 'Provide your primary personal contact details for official conference communications and accreditation.'
      }
    },
    {
      id: 'step1_email',
      label: 'Primary Contact Email Address',
      type: 'email',
      placeholder: 'delegate@institution.edu',
      description: 'Allotment notifications and committee directives will be transmitted to this email.',
      required: true
    },
    {
      id: 'step1_phone',
      label: 'WhatsApp / Calling Number',
      type: 'phone',
      placeholder: '+91 98765 43210',
      description: 'Used for urgent dais updates and caucus coordinator communications.',
      required: true
    },
    {
      id: 'step1_institution',
      label: 'School / College / University or Independent',
      type: 'text',
      placeholder: 'e.g. St. Xavier’s College / Delhi University',
      required: true
    },
    {
      id: 'step1_city',
      label: 'Current City & State of Residence',
      type: 'text',
      placeholder: 'e.g. New Delhi, Delhi',
      required: true
    },

    /* ══════════════════════════════════════════════════════════════════
       STEP 2: SECTOR SELECTION & DELEGATION TRACK
       ══════════════════════════════════════════════════════════════════ */
    {
      id: 'step_break_2',
      type: 'section_break',
      label: 'Sector & Delegation Track',
      sectionTitle: 'Sector Selection & Participation Track',
      sectionDescription: 'Choose your participation category and indicate your parliamentary experience level.',
      stepHeading: {
        enabled: true,
        stepBadge: 'STEP 2',
        stepNumber: '02 / Sector Selection',
        headingTitle: 'Participation Track & Experience Tier',
        description: 'Select whether you are representing an academic delegation or registering as an independent diplomat.'
      }
    },
    {
      id: 'step2_track',
      label: 'Participation Track',
      type: 'radio',
      options: [
        'School Delegate (Grades 8–12)',
        'University / College Delegate',
        'Independent / Professional Delegate',
        'Head of Delegation / Faculty Advisor'
      ],
      required: true
    },
    {
      id: 'step2_experience_level',
      label: 'Model UN & Parliamentary Experience Tier',
      type: 'radio',
      options: [
        'Novice / First-Timer (0 MUNs)',
        'Developing Delegate (1–3 MUNs)',
        'Experienced Delegate (4–7 MUNs)',
        'Veteran / Circuit Leader (8+ MUNs)'
      ],
      required: true
    },

    /* ══════════════════════════════════════════════════════════════════
       STEP 3: PRIMARY COMMITTEE SELECTION
       ══════════════════════════════════════════════════════════════════ */
    {
      id: 'step_break_3',
      type: 'section_break',
      label: 'Primary Committee Selection',
      sectionTitle: 'Primary Chamber Focus',
      stepHeading: {
        enabled: true,
        stepBadge: 'STEP 3',
        stepNumber: '03 / Chamber Preference',
        headingTitle: 'Primary Committee Preference',
        description: 'Select your preferred committee chamber. Portfolios are allocated on FCFS and experience merit.'
      }
    },
    {
      id: 'step3_primary_committee',
      label: 'Select Your 1st Preference Committee Chamber',
      type: 'radio',
      options: [
        'All India Political Parties Meet (AIPPM) — National Security & Electoral Reforms',
        'Education Ministry of India (EMI) — NEP 2020 Reforms & Youth Skill Equitization',
        'UNESCO — Cultural Heritage Protection & Universal AI Ethics in Education',
        'United Nations Security Council (UNSC) — Middle East De-escalation & Sovereignty'
      ],
      required: true
    },

    /* ══════════════════════════════════════════════════════════════════
       STEP 4: SECONDARY COMMITTEE PREFERENCE
       ══════════════════════════════════════════════════════════════════ */
    {
      id: 'step_break_4',
      type: 'section_break',
      label: 'Secondary Committee Fallback',
      stepHeading: {
        enabled: true,
        stepBadge: 'STEP 4',
        stepNumber: '04 / Alternate Chamber',
        headingTitle: 'Secondary Committee Preference',
        description: 'If your 1st preference chamber is fully subscribed, the Secretariat will prioritize your 2nd choice.'
      }
    },
    {
      id: 'step4_secondary_committee',
      label: 'Select Your 2nd Preference Committee Chamber',
      type: 'radio',
      options: [
        'All India Political Parties Meet (AIPPM)',
        'Education Ministry of India (EMI)',
        'UNESCO',
        'United Nations Security Council (UNSC)'
      ],
      required: true
    },

    /* ══════════════════════════════════════════════════════════════════
       STEP 5: TOP 3 PORTFOLIO / COUNTRY PREFERENCES
       ══════════════════════════════════════════════════════════════════ */
    {
      id: 'step_break_5',
      type: 'section_break',
      label: 'Portfolio Preferences',
      stepHeading: {
        enabled: true,
        stepBadge: 'STEP 5',
        stepNumber: '05 / Portfolio Allotment',
        headingTitle: 'Top 3 Portfolio / Country Preferences',
        description: 'Inspect the live Sovereign Assembly Matrix at /matrix to ensure preferred countries or ministers are vacant.'
      }
    },
    {
      id: 'step5_portfolios',
      label: 'Enter Your Top 3 Preferred Portfolios',
      type: 'textarea',
      placeholder: '1. Amit Shah / France\n2. Rahul Gandhi / United Kingdom\n3. Nitin Gadkari / Japan',
      description: 'List your top 3 specific country or ministerial preferences in order of priority.',
      required: true
    },

    /* ══════════════════════════════════════════════════════════════════
       STEP 6: DIPLOMATIC PAST EXPERIENCE & ACCOLADES
       ══════════════════════════════════════════════════════════════════ */
    {
      id: 'step_break_6',
      type: 'section_break',
      label: 'Prior Track Record',
      stepHeading: {
        enabled: true,
        stepBadge: 'STEP 6',
        stepNumber: '06 / Track Record',
        headingTitle: 'Diplomatic Accolades & Prior MUNs',
        description: 'Detail your prior conferences, committees attended, and awards won to support your allotment.'
      }
    },
    {
      id: 'step6_prior_awards',
      label: 'List Notable MUN Conferences & Awards Won',
      type: 'textarea',
      placeholder: 'e.g. Best Delegate - HMUN 2025 (UNSC), High Commendation - ILSMUN 2024 (AIPPM)',
      required: false
    },

    /* ══════════════════════════════════════════════════════════════════
       STEP 7: AGENDA STATEMENT OF PURPOSE
       ══════════════════════════════════════════════════════════════════ */
    {
      id: 'step_break_7',
      type: 'section_break',
      label: 'Statement of Purpose',
      stepHeading: {
        enabled: true,
        stepBadge: 'STEP 7',
        stepNumber: '07 / Motivation',
        headingTitle: 'Statement of Purpose (SOP)',
        description: 'Explain your strategic interest in the simulated agenda and how you intend to contribute to draft resolutions.'
      }
    },
    {
      id: 'step7_sop',
      label: 'Statement of Purpose & Procedural Strategy',
      type: 'textarea',
      placeholder: 'Describe your foreign policy approach or legislative vision for this session (150–300 words)...',
      required: true
    },

    /* ══════════════════════════════════════════════════════════════════
       STEP 8: ACCOMMODATION & LOGISTICS
       ══════════════════════════════════════════════════════════════════ */
    {
      id: 'step_break_8',
      type: 'section_break',
      label: 'Accommodation & Logistics',
      stepHeading: {
        enabled: true,
        stepBadge: 'STEP 8',
        stepNumber: '08 / Logistics & Stay',
        headingTitle: 'Hospitality & Accommodation Needs',
        description: 'Indicate whether you require official conference hotel boarding and specify dietary choices.'
      }
    },
    {
      id: 'step8_accommodation',
      label: 'Do You Require Conference Hotel Accommodation?',
      type: 'radio',
      options: [
        'No, I am a local delegate / arranging private stay',
        'Yes, 3-Night Diplomatic Residency (Delegate Twin Sharing)',
        'Yes, Executive Board / Single Private Suite'
      ],
      required: true
    },
    {
      id: 'step8_diet',
      label: 'Dietary Preference for High Tea & Lunch',
      type: 'radio',
      options: ['Vegetarian', 'Jain', 'Non-Vegetarian', 'Vegan'],
      required: true
    },

    /* ══════════════════════════════════════════════════════════════════
       STEP 9: EMERGENCY CONTACT & GUARDIAN DETAILS
       ══════════════════════════════════════════════════════════════════ */
    {
      id: 'step_break_9',
      type: 'section_break',
      label: 'Emergency & Guardian Contact',
      stepHeading: {
        enabled: true,
        stepBadge: 'STEP 9',
        stepNumber: '09 / Emergency Contact',
        headingTitle: 'Emergency Contact & Guardian Information',
        description: 'Essential contact details for emergency protocols during the conference summit.'
      }
    },
    {
      id: 'step9_guardian_name',
      label: 'Parent / Guardian / Faculty Advisor Name',
      type: 'text',
      placeholder: 'e.g. Dr. Rajesh Sharma',
      required: true
    },
    {
      id: 'step9_guardian_phone',
      label: 'Guardian Emergency Contact Number',
      type: 'phone',
      placeholder: '+91 98111 22334',
      required: true
    },

    /* ══════════════════════════════════════════════════════════════════
       STEP 10: IDENTITY & INSTITUTIONAL VERIFICATION PROOF
       ══════════════════════════════════════════════════════════════════ */
    {
      id: 'step_break_10',
      type: 'section_break',
      label: 'Verification Proof',
      stepHeading: {
        enabled: true,
        stepBadge: 'STEP 10',
        stepNumber: '10 / Verification',
        headingTitle: 'Identity & Institutional Verification Proof',
        description: 'Provide proof of enrollment or identity to prevent fabricated diplomatic records.'
      }
    },
    {
      id: 'step10_id_proof',
      label: 'Institutional ID Card / Drive Link / Roll Number',
      type: 'text',
      placeholder: 'https://drive.google.com/... or Student ID #2024-EX-891',
      description: 'Provide an image link, drive folder, or institutional registration number.',
      required: true
    },

    /* ══════════════════════════════════════════════════════════════════
       STEP 11: CODE OF CONDUCT & ETHICS AGREEMENT
       ══════════════════════════════════════════════════════════════════ */
    {
      id: 'step_break_11',
      type: 'section_break',
      label: 'Code of Conduct & Ethics',
      stepHeading: {
        enabled: true,
        stepBadge: 'STEP 11',
        stepNumber: '11 / Ethics & Decorum',
        headingTitle: 'Diplomatic Code of Conduct Agreement',
        description: 'All delegates must adhere to non-harassment rules, zero plagiarism, and dais respect.'
      }
    },
    {
      id: 'step11_ethics',
      label: 'I pledge to uphold parliamentary decorum and procedural fairness',
      type: 'checkbox',
      options: [
        'I will maintain highest parliamentary dignity during moderated and unmoderated caucuses',
        'I understand that plagiarized working papers or AI-generated resolutions without citation are grounds for disqualification',
        'I accept the dais executive authority as final on procedural rulings'
      ],
      required: true
    },

    /* ══════════════════════════════════════════════════════════════════
       STEP 12: CRYPTOGRAPHIC VERIFICATION & SOVEREIGN HANDLE
       ══════════════════════════════════════════════════════════════════ */
    {
      id: 'step_break_12',
      type: 'section_break',
      label: 'Sovereign Handle & ZEN.CERTIFY',
      stepHeading: {
        enabled: true,
        stepBadge: 'STEP 12',
        stepNumber: '12 / Digital Identity',
        headingTitle: 'Sovereign Handle & Public Verification',
        description: 'Your verified credentials, awards, and participation proof will auto-sync to your Zenvitra profile.'
      }
    },
    {
      id: 'step12_zenvitra_handle',
      label: 'Zenvitra Sovereign Username (@handle)',
      type: 'text',
      placeholder: '@yuveer or your username',
      description: 'If you have an active Zenvitra profile, enter your handle to link certificates instantly.',
      required: false
    },

    /* ══════════════════════════════════════════════════════════════════
       STEP 13: CONFERENCE KIT & PLACARD ALLOCATION
       ══════════════════════════════════════════════════════════════════ */
    {
      id: 'step_break_13',
      type: 'section_break',
      label: 'Delegate Kit & Meridian Placard',
      stepHeading: {
        enabled: true,
        stepBadge: 'STEP 13',
        stepNumber: '13 / Delegate Kit',
        headingTitle: 'Meridian Placard & Delegate Kit Details',
        description: 'Customize your acrylic desk placard and delegate stationery package.'
      }
    },
    {
      id: 'step13_tshirt_size',
      label: 'Official Conference Polo T-Shirt Size',
      type: 'select',
      options: ['Small (S)', 'Medium (M)', 'Large (L)', 'Extra Large (XL)', 'XXL'],
      required: true
    },
    {
      id: 'step13_placard_name',
      label: 'Printed Placard Delegate Name',
      type: 'text',
      placeholder: 'e.g. Hon. Ananya Sharma',
      description: 'Exact designation to be engraved on your committee floor badge.',
      required: true
    },

    /* ══════════════════════════════════════════════════════════════════
       STEP 14: SOCIAL & INTERNATIONAL PRESS CONSENT
       ══════════════════════════════════════════════════════════════════ */
    {
      id: 'step_break_14',
      type: 'section_break',
      label: 'Press & Media Consent',
      stepHeading: {
        enabled: true,
        stepBadge: 'STEP 14',
        stepNumber: '14 / Media Release',
        headingTitle: 'International Press & Photography Consent',
        description: 'Consent for plenary floor broadcasts, press interviews, and valedictory photography.'
      }
    },
    {
      id: 'step14_media_consent',
      label: 'International Press Coverage Consent',
      type: 'radio',
      options: [
        'Granted — I agree to photography and live stream broadcast of committee debates',
        'Restricted — Internal committee records only'
      ],
      required: true
    },

    /* ══════════════════════════════════════════════════════════════════
       STEP 15: PARTICIPATION TIER & PASS PAYMENT (DELEGATES & PARTICIPANTS)
       ══════════════════════════════════════════════════════════════════ */
    {
      id: 'step_break_15',
      type: 'section_break',
      label: 'Accreditation Pass & Registration Fee',
      sectionTitle: 'Accreditation Tier & Fee Settlement',
      stepHeading: {
        enabled: true,
        stepBadge: 'STEP 15',
        stepNumber: '15 / Pass & Fee Settlement',
        headingTitle: 'Participation Pass & Registration Fee',
        description: 'Select your participation pass tier (Delegate vs Observer) and record your settlement reference.'
      }
    },
    {
      id: 'step15_participation_tier',
      label: 'Select Delegation Pass Tier',
      type: 'radio',
      options: [
        'Delegate Pass (₹499 / $6 USD) — Full Parliamentary Rights, Voting & Speaking Floor Access, Official Placard, Awards Contention & Sovereign Credentials',
        'Participant / Observer Pass (₹199 / $2.5 USD) — Plenary Floor Observer Access, Moderated Caucus Attendance, Observer Certificate & Masterclasses',
        'Executive Double Delegation Pass (₹899 / $11 USD) — Paired Delegate Seat for 2 Diplomats (UNSC/UNODC), Dual Placards & Co-Sponsorship'
      ],
      description: 'Choose whether you are participating as an accredited voting Delegate or an attending Observer.',
      required: true
    },
    {
      id: 'step15_payment_method',
      label: 'Preferred Payment Mode',
      type: 'radio',
      options: [
        'UPI / Instant QR Code Scan (Official ID: zenvitra@upi)',
        'Card / NetBanking / Razorpay Sovereign Gateway',
        'School / Institutional Delegation Sponsorship Waiver'
      ],
      description: 'Zero transaction surcharge on UPI transfers. Official foundation UPI: zenvitra@upi',
      required: true
    },
    {
      id: 'step15_payment_instruction',
      type: 'title_desc',
      label: 'UPI Payment Instructions & Gateway Verification',
      description: 'Transfer the corresponding registration fee (₹499 for Delegate, ₹199 for Participant/Observer) to UPI ID: zenvitra@upi (ZENVITRA FOUNDATION). After paying, enter your 12-digit UPI Reference / UTR Number below for immediate Secretariat verification.'
    },
    {
      id: 'step15_utr_reference',
      label: '12-Digit UPI Transaction ID / UTR Number *',
      type: 'text',
      placeholder: 'e.g. 427819203819 or TXN-89214710',
      description: 'Located in Google Pay, PhonePe, Paytm, or your banking app confirmation screen.',
      required: true
    },
    {
      id: 'step15_receipt_link',
      label: 'Payment Screenshot / Proof Link (Optional)',
      type: 'text',
      placeholder: 'https://drive.google.com/... or paste image URL',
      description: 'Optional confirmation receipt proof for institutional batch delegations.',
      required: false
    },

    /* ══════════════════════════════════════════════════════════════════
       STEP 16: FINAL RATIFICATION & DIGITAL SUBMISSION
       ══════════════════════════════════════════════════════════════════ */
    {
      id: 'step_break_16',
      type: 'section_break',
      label: 'Final Ratification',
      stepHeading: {
        enabled: true,
        stepBadge: 'STEP 16',
        stepNumber: '16 / Ratification',
        headingTitle: 'Final Ratification & Digital Submission',
        description: 'Confirm all details are true and authenticate your submission to the sovereign ledger.'
      }
    },
    {
      id: 'step16_signature',
      label: 'Digital Signature (Type Full Legal Name)',
      type: 'text',
      placeholder: 'e.g. Ananya Sharma',
      description: 'By typing your name, you legally ratify this conference registration and request portfolio lock.',
      required: true
    },
    {
      id: 'step16_submission_date',
      label: 'Date of Submission',
      type: 'date',
      required: true
    }
  ]
};
