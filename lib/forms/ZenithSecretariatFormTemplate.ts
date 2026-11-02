import { ZenForm } from '@/types/forms';

export const ZENITH_SECRETARIAT_2026_FORM_TEMPLATE: ZenForm = {
  id: 'zenith-mun-2026-secretariat-application',
  slug: 'zenith-secretariat-2026',
  title: 'ZENITH MODEL UNITED NATIONS 2026 — SECRETARIAT APPLICATION FORM',
  description: 'A NEW ZEN BEGINS. PRESENTED BY ZENVITRA | BY YOUTH. FOR YOUTH. Thank you for your interest in joining the Secretariat of ZENITH MUN 2026. We are looking for committed, responsible and driven individuals who are ready to contribute to building a meaningful conference.',
  category: 'MUN_REGISTRATION',
  theme: 'amber',
  submitButtonText: 'Submit Secretariat Application',
  successMessage: 'Your application for the ZENITH MUN 2026 Secretariat has been securely submitted! The selection committee will review your responses and portfolio. Shortlisted applicants will be contacted for further interaction.',
  ownerHandle: 'zenith_secretariat',
  submissionsCount: 0,
  isPublished: true,
  allowAnonymous: false,
  acceptingResponses: true,
  stepHeadingsEnabled: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  customStyle: {
    displayFont: 'Clash Display',
    bodyFont: 'Space Grotesk',
    accentColor: '#f59e0b',
    cardStyle: 'glass-deep',
    borderRadius: '2xl'
  },
  fields: [
    /* ══════════════════════════════════════════════════════════════════
       SECTION 1 — PERSONAL INFORMATION
       ══════════════════════════════════════════════════════════════════ */
    {
      id: 'step_break_1',
      type: 'section_break',
      label: 'Personal Information',
      sectionTitle: 'Section 1 — Personal Information',
      stepHeading: {
        enabled: true,
        stepBadge: 'STEP 1',
        stepNumber: '01 / Personal Information',
        headingTitle: 'Section 1 — Personal Information',
        description: 'Please provide your accurate personal, academic and contact credentials.'
      }
    },
    {
      id: 'q1_full_name',
      label: '1. Full Name *',
      type: 'short_answer',
      placeholder: 'Enter your full legal name',
      required: true
    },
    {
      id: 'q2_age',
      label: '2. Age *',
      type: 'number',
      placeholder: 'e.g. 17',
      required: true
    },
    {
      id: 'q3_location',
      label: '3. City, State and Country *',
      type: 'short_answer',
      placeholder: 'e.g. Udaipur, Rajasthan, India',
      required: true
    },
    {
      id: 'q4_email',
      label: '4. Email Address *',
      type: 'email',
      placeholder: 'e.g. yourname@domain.com',
      required: true
    },
    {
      id: 'q5_phone',
      label: '5. WhatsApp / Contact Number *',
      type: 'phone',
      placeholder: 'e.g. +91 98765 43210',
      required: true
    },
    {
      id: 'q6_institution',
      label: '6. School / College / Institution and Current Academic Year *',
      type: 'short_answer',
      placeholder: 'e.g. St. Pauls School, Udaipur — Grade 12 / MLSU — 2nd Year',
      required: true
    },

    /* ══════════════════════════════════════════════════════════════════
       SECTION 2 — EXPERIENCE & BACKGROUND
       ══════════════════════════════════════════════════════════════════ */
    {
      id: 'step_break_2',
      type: 'section_break',
      label: 'Experience & Background',
      sectionTitle: 'Section 2 — Experience & Background',
      stepHeading: {
        enabled: true,
        stepBadge: 'STEP 2',
        stepNumber: '02 / Experience & Background',
        headingTitle: 'Section 2 — Experience & Background',
        description: 'Detail your prior conference background, secretarial designations, leadership roles, and core capabilities.'
      }
    },
    {
      id: 'q7_mun_participation',
      label: '7. Have you participated in any MUN conferences? If yes, mention the number of conferences and your notable experiences. *',
      type: 'paragraph',
      placeholder: 'Mention the count of MUNs attended, committees, portfolios represented, and notable experiences or accolades...',
      required: true
    },
    {
      id: 'q8_secretariat_experience',
      label: '8. Have you previously served in an MUN Secretariat, Executive Board or Organising Committee? Mention your roles and responsibilities. *',
      type: 'paragraph',
      placeholder: 'Elaborate on specific designations held (e.g., USG Delegate Affairs, Committee Director, Logistics Lead) and your responsibilities...',
      required: true
    },
    {
      id: 'q9_outside_leadership',
      label: '9. Have you held any leadership positions or been involved in organising events, projects or initiatives outside MUNs? Elaborate briefly. *',
      type: 'paragraph',
      placeholder: 'School prefect councils, cultural/sports fest coordination, community initiatives, clubs, or external youth organizations...',
      required: true
    },
    {
      id: 'q10_strongest_skills',
      label: '10. What are your strongest skills? Mention at least three relevant skills. *',
      type: 'paragraph',
      placeholder: 'e.g. Public speaking & diplomatic negotiation, graphic design (Figma/Photoshop), team logistics & crisis management...',
      required: true
    },

    /* ══════════════════════════════════════════════════════════════════
       SECTION 3 — DEPARTMENT PREFERENCES
       ══════════════════════════════════════════════════════════════════ */
    {
      id: 'step_break_3',
      type: 'section_break',
      label: 'Department Preferences',
      sectionTitle: 'Section 3 — Department Preferences',
      stepHeading: {
        enabled: true,
        stepBadge: 'STEP 3',
        stepNumber: '03 / Department Preferences',
        headingTitle: 'Section 3 — Department Preferences',
        description: 'Specify which operational departments you prefer to lead and detail your technical/creative readiness.'
      }
    },
    {
      id: 'q11_department_preferences',
      label: '11. Which department(s) would you prefer to work in? Mention your first and second preferences. *',
      type: 'paragraph',
      placeholder: 'e.g. First Preference: Delegate Affairs / Academic Affairs / Operations & Logistics / Tech & Dais / PR & Marketing / Design / Crisis\nSecond Preference: ...',
      required: true
    },
    {
      id: 'q12_department_suitability',
      label: '12. Why have you chosen these departments, and what makes you suitable for them? *',
      type: 'paragraph',
      placeholder: 'Explain what makes your profile and temperament suited for these specific departments...',
      required: true
    },
    {
      id: 'q13_tools_and_abilities',
      label: '13. What relevant tools, software, technical abilities or creative skills do you possess? *',
      type: 'paragraph',
      placeholder: 'e.g. Canva, Adobe Illustrator, Google Sheets / Excel, Notion, audio-video equipment, copywriting, crisis framing...',
      required: true
    },

    /* ══════════════════════════════════════════════════════════════════
       SECTION 4 — MOTIVATION & VISION
       ══════════════════════════════════════════════════════════════════ */
    {
      id: 'step_break_4',
      type: 'section_break',
      label: 'Motivation & Vision',
      sectionTitle: 'Section 4 — Motivation & Vision',
      stepHeading: {
        enabled: true,
        stepBadge: 'STEP 4',
        stepNumber: '04 / Motivation & Vision',
        headingTitle: 'Section 4 — Motivation & Vision',
        description: 'Your vision, values, and concrete ideas for Zenith MUN 2026.'
      }
    },
    {
      id: 'q14_why_zenith',
      label: '14. Why do you want to become a part of the ZENITH MUN 2026 Secretariat? *',
      type: 'paragraph',
      placeholder: 'What motivates you to dedicate your time and efforts to Zenith MUN 2026?',
      required: true
    },
    {
      id: 'q15_secretariat_meaning',
      label: '15. What does being a Secretariat member mean to you beyond holding a designation? *',
      type: 'paragraph',
      placeholder: 'Reflect on responsibility, peer leadership, conference culture, and teamwork...',
      required: true
    },
    {
      id: 'q16_specific_contribution',
      label: '16. What is one specific contribution or idea you would like to bring to ZENITH MUN 2026? *',
      type: 'paragraph',
      placeholder: 'A distinct committee topic, a delegate engagement initiative, or an operational upgrade you would like to implement...',
      required: true
    },

    /* ══════════════════════════════════════════════════════════════════
       SECTION 5 — SITUATIONAL JUDGEMENT & COMMITMENT
       ══════════════════════════════════════════════════════════════════ */
    {
      id: 'step_break_5',
      type: 'section_break',
      label: 'Situational Judgement & Commitment',
      sectionTitle: 'Section 5 — Situational Judgement & Commitment',
      stepHeading: {
        enabled: true,
        stepBadge: 'STEP 5',
        stepNumber: '05 / Situational Judgement',
        headingTitle: 'Section 5 — Situational Judgement & Commitment',
        description: 'Assess how you handle operational bottlenecks, deadlines, and team dynamics.'
      }
    },
    {
      id: 'q17_team_member_issue',
      label: '17. If a team member repeatedly fails to complete assigned responsibilities, how would you handle the situation? *',
      type: 'paragraph',
      placeholder: 'Describe your steps to address the issue while ensuring team morale and conference deliverables remain intact...',
      required: true
    },
    {
      id: 'q18_tight_deadline_difficulties',
      label: '18. If you are assigned an important task with a tight deadline and encounter unexpected difficulties, what would you do? *',
      type: 'paragraph',
      placeholder: 'Explain how you prioritize, troubleshoot, and escalate or pivot to meet the deadline...',
      required: true
    },
    {
      id: 'q19_time_dedication_and_balance',
      label: '19. How much time can you realistically dedicate to ZENITH MUN, and how will you balance your responsibilities with academics and other commitments? *',
      type: 'paragraph',
      placeholder: 'State estimated weekly hours you can commit and your practical strategy for balancing school/college work...',
      required: true
    },
    {
      id: 'q20_why_choose_you',
      label: '20. Why should the selection committee choose you over other applicants? *',
      type: 'paragraph',
      placeholder: 'Highlight your work ethic, integrity, uniqueness, or specific value you offer...',
      required: true
    },

    /* ══════════════════════════════════════════════════════════════════
       SECTION 6 — RESUME / CURRICULUM VITAE
       ══════════════════════════════════════════════════════════════════ */
    {
      id: 'step_break_6',
      type: 'section_break',
      label: 'Resume / Curriculum Vitae',
      sectionTitle: 'Section 6 — Resume / Curriculum Vitae',
      stepHeading: {
        enabled: true,
        stepBadge: 'STEP 6',
        stepNumber: '06 / Resume & Credentials',
        headingTitle: 'Section 6 — Resume / Curriculum Vitae',
        description: 'Upload your updated Resume / CV (PDF format). Portfolio and work sample links are optional.'
      }
    },
    {
      id: 'q21_resume_upload',
      label: 'Resume / CV Upload — Mandatory *',
      type: 'file_upload',
      description: 'Please upload your updated Resume / CV in PDF format. Your resume should ideally include: Academic background, MUN experience and designations, Leadership and organisational experience, Skills and technical proficiency, Relevant achievements and projects, Previous work samples or portfolio links, if applicable.',
      required: true
    },
    {
      id: 'q22_portfolio_link',
      label: 'Portfolio / LinkedIn / Work Samples (Optional link)',
      type: 'url',
      placeholder: 'https://linkedin.com/in/... or Google Drive / Behance link',
      required: false
    },

    /* ══════════════════════════════════════════════════════════════════
       FINAL DECLARATION
       ══════════════════════════════════════════════════════════════════ */
    {
      id: 'step_break_7',
      type: 'section_break',
      label: 'Final Declaration',
      sectionTitle: 'Final Declaration',
      stepHeading: {
        enabled: true,
        stepBadge: 'STEP 7',
        stepNumber: '07 / Final Declaration',
        headingTitle: 'Final Declaration & Confirmation',
        description: 'Please review and confirm the statement below to complete your Secretariat application.'
      }
    },
    {
      id: 'declaration_confirmation',
      label: 'Declaration Statement *',
      type: 'checkbox',
      description: 'I hereby confirm that the information provided in this application is accurate and complete. I understand that selection into the ZENITH MUN 2026 Secretariat involves responsibility, commitment, teamwork and professionalism.',
      options: [
        'I hereby confirm that the information provided in this application is accurate and complete.'
      ],
      required: true
    },
    {
      id: 'declaration_applicant_name',
      label: "Applicant's Name *",
      type: 'short_answer',
      placeholder: 'Type your full legal name',
      required: true
    },
    {
      id: 'declaration_date',
      label: 'Date *',
      type: 'date',
      required: true
    },
    {
      id: 'declaration_signature',
      label: 'Signature / Confirmation *',
      type: 'short_answer',
      placeholder: 'Type your full name as digital signature confirmation',
      required: true
    }
  ]
};
