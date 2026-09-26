import { ZenForm } from '@/types/forms';

export const ZEN_SECRETARIAT_2026_FORM_TEMPLATE: ZenForm = {
  id: 'zen-secretariat-2026-application',
  slug: 'zen-secretariat-2026',
  title: 'ZEN.DIPLOMACY 2026 — Official Secretariat Application',
  description: 'Executive Board & Organizing Committee Accreditation. Apply across 10 specialized departments to lead committees, delegate affairs, tech systems, design, logistics, and diplomatic relations.',
  category: 'MUN_REGISTRATION',
  theme: 'purple',
  submitButtonText: 'Submit Secretariat Application',
  successMessage: 'Your Secretariat application has been securely recorded and dispatched to the Executive Board! The Secretary-General and Directorate will review your portfolio and reach out for simulated interviews.',
  ownerHandle: 'yuveer',
  submissionsCount: 18,
  isPublished: true,
  allowAnonymous: false,
  acceptingResponses: true,
  stepHeadingsEnabled: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  googleSheetsConfig: {
    isConnected: true,
    sheetTab: 'Secretariat Applications',
    webhookUrl: 'https://script.google.com/macros/s/AKfycbwMJVccvxnhbk13ppFVu44gpA9cZ95nR1oojq-c4P1r6YWK45hKp0f3Tydk4RJO6v0Q/exec',
    autoSync: true
  },
  customStyle: {
    displayFont: 'Clash Display',
    bodyFont: 'Space Grotesk',
    accentColor: '#a855f7',
    cardStyle: 'glass-deep',
    borderRadius: '2xl'
  },
  fields: [
    /* ══════════════════════════════════════════════════════════════════
       STEP 1: DEPARTMENT PREFERENCE
       ══════════════════════════════════════════════════════════════════ */
    {
      id: 'step_break_1',
      type: 'section_break',
      label: 'Department Allocation',
      sectionTitle: 'Secretariat Department Preference',
      stepHeading: {
        enabled: true,
        stepBadge: 'STEP 1',
        stepNumber: '01 / Department Preference',
        headingTitle: 'Choose Your Secretariat Department',
        description: 'Select your primary and secondary department choices across our 10 specialized leadership wings.'
      }
    },
    {
      id: 'step1_primary_sector',
      label: 'Primary Department Choice *',
      type: 'select',
      options: [
        'Delegate Affairs (Delegate relations, registrations & queries)',
        'Academic Affairs (Background guides, agendas & study materials)',
        'Crisis Operations (Simulated crisis plots & dynamic updates)',
        'Tech Affairs (Platform bots, portals & live telemetry)',
        'Design & Creative (Visual assets, brochures & branding)',
        'Outreach & PR (School partnerships & institutional delegations)',
        'Finance & Sponsorships (Budgeting & brand partnerships)',
        'Delegate Logistics (Virtual rooms, timing & scheduling)',
        'Media & Documentation (Press releases, photography & archives)',
        'Secretary-General Directorate (Master timetable & cross-team ops)'
      ],
      description: 'Your primary operational preference for the conference.',
      required: true
    },
    {
      id: 'step1_secondary_sector',
      label: 'Secondary Department Choice (Fallback)',
      type: 'select',
      options: [
        'Academic Affairs',
        'Crisis Operations',
        'Tech Affairs',
        'Design & Creative',
        'Outreach & PR',
        'Finance & Sponsorships',
        'Delegate Logistics',
        'Media & Documentation',
        'Delegate Affairs',
        'Secretary-General Directorate'
      ],
      description: 'Secondary preference if your first department is fully staffed.',
      required: false
    },

    /* ══════════════════════════════════════════════════════════════════
       STEP 2: PERSONAL IDENTITY & CONTACT CREDENTIALS
       ══════════════════════════════════════════════════════════════════ */
    {
      id: 'step_break_2',
      type: 'section_break',
      label: 'Personal Information',
      stepHeading: {
        enabled: true,
        stepBadge: 'STEP 2',
        stepNumber: '02 / Candidate Profile',
        headingTitle: 'Personal & Academic Identity',
        description: 'Provide verified contact information and institutional affiliation.'
      }
    },
    {
      id: 'step2_fullname',
      label: 'Full Legal Name *',
      type: 'text',
      placeholder: 'e.g. Advait Sharma',
      description: 'As it should appear on official Secretariat credentials and appointment letters.',
      required: true
    },
    {
      id: 'step2_email',
      label: 'Official Email Address *',
      type: 'email',
      placeholder: 'candidate@institution.edu',
      description: 'Primary email for interview invitations and Secretariat dispatches.',
      required: true
    },
    {
      id: 'step2_phone',
      label: 'WhatsApp Phone Number *',
      type: 'phone',
      placeholder: '+91 98765 43210',
      description: 'For inclusion in the official Secretariat coordination group.',
      required: true
    },
    {
      id: 'step2_institution',
      label: 'School / University / Affiliation *',
      type: 'text',
      placeholder: 'e.g. Delhi University / Modern School / Independent',
      required: true
    },
    {
      id: 'step2_grade',
      label: 'Current Academic Grade / Year',
      type: 'text',
      placeholder: 'e.g. 11th Grade / 2nd Year B.Tech / Postgraduate',
      required: false
    },
    {
      id: 'step2_city_country',
      label: 'Current City & Country *',
      type: 'text',
      placeholder: 'e.g. New Delhi, India',
      required: true
    },

    /* ══════════════════════════════════════════════════════════════════
       STEP 3: TRACK RECORD & PRACTICAL MOTIVATION
       ══════════════════════════════════════════════════════════════════ */
    {
      id: 'step_break_3',
      type: 'section_break',
      label: 'Experience & Competence',
      stepHeading: {
        enabled: true,
        stepBadge: 'STEP 3',
        stepNumber: '03 / Track Record & SOP',
        headingTitle: 'Diplomatic Experience & Motivation',
        description: 'Detail your prior conference experience and how you will execute your departmental responsibilities.'
      }
    },
    {
      id: 'step3_prior_muns_count',
      label: 'Total MUN Conferences Attended',
      type: 'radio',
      options: [
        'Novice (0–2 Conferences)',
        'Intermediate (3–5 Conferences)',
        'Veteran (6–10 Conferences)',
        'Executive / Secretariat Veteran (10+ Conferences)'
      ],
      required: true
    },
    {
      id: 'step3_organizing_experience',
      label: 'Prior Organizing / Secretariat Experience',
      type: 'textarea',
      placeholder: 'List any prior organizing committees, student council positions, or event execution roles...',
      required: false
    },
    {
      id: 'step3_weekly_bandwidth',
      label: 'Estimated Weekly Bandwidth Commitment *',
      type: 'radio',
      options: [
        '5–8 hours / week (Core tasks & weekly synces)',
        '10–15 hours / week (Active departmental operations)',
        '15–20+ hours / week (Department Lead / Intensive)'
      ],
      required: true
    },
    {
      id: 'step3_sop',
      label: 'Statement of Purpose (SOP) *',
      type: 'textarea',
      placeholder: 'Explain why you are applying for this specific department and what unique skills you bring to ZEN.DIPLOMACY (min 50 words)...',
      required: true
    },
    {
      id: 'step3_practical_response',
      label: 'Department Practical Response / Execution Plan *',
      type: 'textarea',
      placeholder: 'Describe a concrete protocol or plan you would deploy in high-pressure conference scenarios (e.g. delegate dropouts, dynamic crisis updates, tech hiccups)...',
      required: true
    },
    {
      id: 'step3_portfolio_url',
      label: 'Portfolio / LinkedIn / Work Samples URL',
      type: 'text',
      placeholder: 'https://drive.google.com/... or https://linkedin.com/in/... or GitHub',
      description: 'Recommended for Tech Affairs, Design, Academic Research, and Media roles.',
      required: false
    },

    /* ══════════════════════════════════════════════════════════════════
       STEP 4: SOVEREIGN ACCORD & RATIFICATION
       ══════════════════════════════════════════════════════════════════ */
    {
      id: 'step_break_4',
      type: 'section_break',
      label: 'Sovereign Accord',
      stepHeading: {
        enabled: true,
        stepBadge: 'STEP 4',
        stepNumber: '04 / Ratification',
        headingTitle: 'Secretariat Code of Conduct Accord',
        description: 'Ratify your commitment to conference integrity, responsiveness, and executive accountability.'
      }
    },
    {
      id: 'step4_discord_handle',
      label: 'Discord Username / Tag',
      type: 'text',
      placeholder: 'username#0000 or username',
      description: 'Used for internal team voice rooms and Secretariat war rooms.',
      required: false
    },
    {
      id: 'step4_availability_oct2425',
      label: 'Full Availability on October 24 & 25, 2026 (Conference Days) *',
      type: 'radio',
      options: [
        'Confirmed: I will be 100% available online across both conference days (09:00 - 19:00 IST)',
        'Tentative: I have academic commitments and will need partial scheduling accommodations'
      ],
      required: true
    },
    {
      id: 'step4_accord_agreement',
      label: 'Secretariat Code of Conduct Ratification *',
      type: 'radio',
      options: [
        'I officially ratify the ZENVITRA Secretariat Accord — committing to executive excellence, non-bias, and punctuality.'
      ],
      required: true
    }
  ]
};
