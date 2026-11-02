import { ZenForm } from '@/types/forms';

export const ZENITH_DEPARTMENTS = [
  'Delegate Affairs & Outreach',
  'Public Relations & Marketing',
  'Design & Creative',
  'Media & Communications',
  'Technical & Website',
  'Events & Conference Operations',
  'Research & Content'
];

export const ZENITH_SECRETARIAT_2026_FORM_TEMPLATE: ZenForm = {
  id: 'zenith-mun-2026-secretariat-application',
  slug: 'zenith-secretariat-2026',
  title: 'ZENITH MODEL UNITED NATIONS 2026 — SECRETARIAT APPLICATION FORM',
  description: 'A NEW ZEN BEGINS. PRESENTED BY ZENVITRA | BY YOUTH. FOR YOUTH. Thank you for your interest in joining the Secretariat of ZENITH MUN 2026. We are looking for committed, responsible and driven individuals who are ready to contribute to building a meaningful conference.',
  category: 'MUN_REGISTRATION',
  theme: 'amber',
  submitButtonText: 'Submit Secretariat Application',
  successMessage: 'Your application for the ZENITH MUN 2026 Secretariat has been securely submitted! The selection committee will evaluate your answers against the official 100% Scorecard. Shortlisted applicants will be contacted for an interview or practical assessment.',
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
       EVALUATION RUBRIC & SELECTION SCORECARD NOTICE
       ══════════════════════════════════════════════════════════════════ */
    {
      id: 'scorecard_notice',
      type: 'title_desc',
      label: '🏛️ ZENITH SELECTION SCORECARD & EVALUATION FRAMEWORK',
      description: 'Don\'t select people purely on the basis of MUN count or impressive answers. ZENITH evaluates every applicant using a consistent 100% scorecard:\n\n' +
        '• Relevant Experience: 15%\n' +
        '• Skills & Department Suitability: 20%\n' +
        '• Motivation & Vision: 15%\n' +
        '• Situational Judgement: 20%\n' +
        '• Commitment & Reliability: 20%\n' +
        '• Communication: 10%\n\n' +
        'THREE RECRUITMENT PILLARS:\n' +
        '1. Department-specific practical questions are mandatory for every applicant.\n' +
        '2. Actual work samples and portfolios are evaluated wherever relevant.\n' +
        '3. Shortlisted candidates are invited for a short interview or practical assignment.\n\n' +
        'CORE PRINCIPLE: ZENITH selects people who can get work done, not simply people who have held impressive titles before.'
    },

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
      id: 'q11_primary_dept',
      label: '11. Which department would you prefer to work in? (First Preference) *',
      type: 'select',
      description: 'Select your primary operational department. Department-specific questions will appear based on this choice.',
      options: ZENITH_DEPARTMENTS,
      required: true
    },
    {
      id: 'q11_secondary_dept',
      label: '11b. Second Department Preference *',
      type: 'select',
      description: 'Select your second operational preference in case of allocation balancing.',
      options: ZENITH_DEPARTMENTS,
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
       SECTION 3B — DEPARTMENT-SPECIFIC QUESTIONS (CONDITIONAL)
       ══════════════════════════════════════════════════════════════════ */
    {
      id: 'step_break_3b',
      type: 'section_break',
      label: 'Department Practical Assessment',
      sectionTitle: 'Section 3B — Department-Specific Practical Questions',
      stepHeading: {
        enabled: true,
        stepBadge: 'STEP 3B',
        stepNumber: '03B / Department Practical',
        headingTitle: 'Department Practical Assessment',
        description: 'Mandatory practical evaluation appearing conditionally for your chosen department(s).'
      }
    },

    // ──────────────────────────────────────────────────────────────
    // 1. Delegate Affairs & Outreach Questions
    // ──────────────────────────────────────────────────────────────
    {
      id: 'q_del_attract',
      label: 'Delegate Affairs & Outreach: How would you attract and engage potential delegates? *',
      type: 'paragraph',
      placeholder: 'Detail your strategy to attract delegations, schools, and independent delegates to ZENITH MUN...',
      required: true,
      conditional: {
        fieldIds: ['q11_primary_dept', 'q11_secondary_dept'],
        value: ['Delegate Affairs & Outreach', 'Delegate Affairs', 'Outreach'],
        operator: 'includes'
      }
    },
    {
      id: 'q_del_dissatisfied',
      label: 'Delegate Affairs & Outreach: How would you handle a delegate who is dissatisfied with the registration process? *',
      type: 'paragraph',
      placeholder: 'Explain your escalation handling, empathy, and diplomatic problem resolution approach...',
      required: true,
      conditional: {
        fieldIds: ['q11_primary_dept', 'q11_secondary_dept'],
        value: ['Delegate Affairs & Outreach', 'Delegate Affairs', 'Outreach'],
        operator: 'includes'
      }
    },
    {
      id: 'q_del_network',
      label: 'Delegate Affairs & Outreach: How would you build outreach beyond your immediate MUN network? *',
      type: 'paragraph',
      placeholder: 'Describe grassroots outreach methods across new cities, regional institutions, and first-time MUN circuits...',
      required: true,
      conditional: {
        fieldIds: ['q11_primary_dept', 'q11_secondary_dept'],
        value: ['Delegate Affairs & Outreach', 'Delegate Affairs', 'Outreach'],
        operator: 'includes'
      }
    },
    {
      id: 'q_del_tracking',
      label: 'Delegate Affairs & Outreach: How would you track and follow up on registrations? *',
      type: 'paragraph',
      placeholder: 'Tools, spreadsheets, CRM routines, and cadence for converting inquiries to confirmed attendees...',
      required: true,
      conditional: {
        fieldIds: ['q11_primary_dept', 'q11_secondary_dept'],
        value: ['Delegate Affairs & Outreach', 'Delegate Affairs', 'Outreach'],
        operator: 'includes'
      }
    },

    // ──────────────────────────────────────────────────────────────
    // 2. Public Relations & Marketing Questions
    // ──────────────────────────────────────────────────────────────
    {
      id: 'q_pr_awareness',
      label: 'PR & Marketing: How would you create awareness about ZENITH among students who have never attended an MUN? *',
      type: 'paragraph',
      placeholder: 'How do you demystify diplomacy and make the conference exciting and accessible for first-timers?',
      required: true,
      conditional: {
        fieldIds: ['q11_primary_dept', 'q11_secondary_dept'],
        value: ['Public Relations & Marketing', 'PR & Marketing', 'Marketing', 'PR'],
        operator: 'includes'
      }
    },
    {
      id: 'q_pr_campaign',
      label: 'PR & Marketing: Suggest a campaign idea to increase registrations. *',
      type: 'paragraph',
      placeholder: 'Pitch a campaign theme, hook, visual format, or social challenge that would drive viral interest...',
      required: true,
      conditional: {
        fieldIds: ['q11_primary_dept', 'q11_secondary_dept'],
        value: ['Public Relations & Marketing', 'PR & Marketing', 'Marketing', 'PR'],
        operator: 'includes'
      }
    },
    {
      id: 'q_pr_feedback',
      label: 'PR & Marketing: How would you handle negative feedback or public criticism? *',
      type: 'paragraph',
      placeholder: 'Handling social media comments, public queries, or miscommunications with brand composure...',
      required: true,
      conditional: {
        fieldIds: ['q11_primary_dept', 'q11_secondary_dept'],
        value: ['Public Relations & Marketing', 'PR & Marketing', 'Marketing', 'PR'],
        operator: 'includes'
      }
    },
    {
      id: 'q_pr_social_media',
      label: 'PR & Marketing: What makes an MUN\'s social media presence effective? *',
      type: 'paragraph',
      placeholder: 'Aesthetics, storytelling, content cadence, reels, delegate highlights, and procedural carousels...',
      required: true,
      conditional: {
        fieldIds: ['q11_primary_dept', 'q11_secondary_dept'],
        value: ['Public Relations & Marketing', 'PR & Marketing', 'Marketing', 'PR'],
        operator: 'includes'
      }
    },

    // ──────────────────────────────────────────────────────────────
    // 3. Design & Creative Questions
    // ──────────────────────────────────────────────────────────────
    {
      id: 'q_design_tools',
      label: 'Design & Creative: Which design tools do you use? *',
      type: 'short_answer',
      placeholder: 'e.g. Figma, Adobe Photoshop, Illustrator, Premiere Pro, After Effects, Canva',
      required: true,
      conditional: {
        fieldIds: ['q11_primary_dept', 'q11_secondary_dept'],
        value: ['Design & Creative', 'Design', 'Creative'],
        operator: 'includes'
      }
    },
    {
      id: 'q_design_samples',
      label: 'Design & Creative: Share links to three relevant samples of your work. *',
      type: 'paragraph',
      placeholder: 'Paste Google Drive, Behance, Figma, or portfolio links to 3 posters/graphics/branding samples...',
      required: true,
      conditional: {
        fieldIds: ['q11_primary_dept', 'q11_secondary_dept'],
        value: ['Design & Creative', 'Design', 'Creative'],
        operator: 'includes'
      }
    },
    {
      id: 'q_design_consistency',
      label: 'Design & Creative: How would you maintain visual consistency across all conference creatives? *',
      type: 'paragraph',
      placeholder: 'Color palettes, typography hierarchies, design systems, and brand guidelines across Instagram, banners, placards...',
      required: true,
      conditional: {
        fieldIds: ['q11_primary_dept', 'q11_secondary_dept'],
        value: ['Design & Creative', 'Design', 'Creative'],
        operator: 'includes'
      }
    },
    {
      id: 'q_design_last_minute',
      label: 'Design & Creative: How would you approach a last-minute creative requirement? *',
      type: 'paragraph',
      placeholder: 'How do you handle urgent requests (e.g., emergency press release poster or schedule change graphic) under pressure?',
      required: true,
      conditional: {
        fieldIds: ['q11_primary_dept', 'q11_secondary_dept'],
        value: ['Design & Creative', 'Design', 'Creative'],
        operator: 'includes'
      }
    },

    // ──────────────────────────────────────────────────────────────
    // 4. Media & Communications Questions
    // ──────────────────────────────────────────────────────────────
    {
      id: 'q_media_writing',
      label: 'Media & Communications: How comfortable are you with formal writing and proofreading? *',
      type: 'paragraph',
      placeholder: 'Elaborate on your experience drafting official statements, newsletters, diplomatic press notes, and editorial reviews...',
      required: true,
      conditional: {
        fieldIds: ['q11_primary_dept', 'q11_secondary_dept'],
        value: ['Media & Communications', 'Media', 'Communications'],
        operator: 'includes'
      }
    },
    {
      id: 'q_media_draft',
      label: 'Media & Communications: Draft a short announcement introducing ZENITH MUN 2026. *',
      type: 'paragraph',
      placeholder: 'Write an inspiring 100-150 word announcement capturing "A NEW ZEN BEGINS." and our mission in Udaipur...',
      required: true,
      conditional: {
        fieldIds: ['q11_primary_dept', 'q11_secondary_dept'],
        value: ['Media & Communications', 'Media', 'Communications'],
        operator: 'includes'
      }
    },
    {
      id: 'q_media_consistency',
      label: 'Media & Communications: How would you ensure official communications remain consistent and accurate? *',
      type: 'paragraph',
      placeholder: 'Approval workflows, fact-checking committee details, cross-checking with Secretariat leadership before publishing...',
      required: true,
      conditional: {
        fieldIds: ['q11_primary_dept', 'q11_secondary_dept'],
        value: ['Media & Communications', 'Media', 'Communications'],
        operator: 'includes'
      }
    },
    {
      id: 'q_media_correction',
      label: 'Media & Communications: How would you handle an urgent correction to a published announcement? *',
      type: 'paragraph',
      placeholder: 'Protocol for issuing immediate errata, updating captions/links, and maintaining public confidence...',
      required: true,
      conditional: {
        fieldIds: ['q11_primary_dept', 'q11_secondary_dept'],
        value: ['Media & Communications', 'Media', 'Communications'],
        operator: 'includes'
      }
    },

    // ──────────────────────────────────────────────────────────────
    // 5. Technical & Website Questions
    // ──────────────────────────────────────────────────────────────
    {
      id: 'q_tech_stack',
      label: 'Technical & Website: Mention the programming languages, platforms and tools you know. *',
      type: 'paragraph',
      placeholder: 'e.g. Next.js, React, TypeScript, Node.js, Tailwind CSS, Python, SQLite/PostgreSQL, Git/GitHub, Vercel/VPS...',
      required: true,
      conditional: {
        fieldIds: ['q11_primary_dept', 'q11_secondary_dept'],
        value: ['Technical & Website', 'Technical', 'Website', 'Tech'],
        operator: 'includes'
      }
    },
    {
      id: 'q_tech_projects',
      label: 'Technical & Website: Share links to projects or websites you have worked on. *',
      type: 'paragraph',
      placeholder: 'Paste GitHub repositories, live website URLs, or technical portfolio links...',
      required: true,
      conditional: {
        fieldIds: ['q11_primary_dept', 'q11_secondary_dept'],
        value: ['Technical & Website', 'Technical', 'Website', 'Tech'],
        operator: 'includes'
      }
    },
    {
      id: 'q_tech_troubleshoot',
      label: 'Technical & Website: How would you approach troubleshooting a website issue during registration? *',
      type: 'paragraph',
      placeholder: 'Debug flow: inspecting browser logs, API error codes, database locks, rollback protocols, and delegate status communication...',
      required: true,
      conditional: {
        fieldIds: ['q11_primary_dept', 'q11_secondary_dept'],
        value: ['Technical & Website', 'Technical', 'Website', 'Tech'],
        operator: 'includes'
      }
    },
    {
      id: 'q_tech_accuracy',
      label: 'Technical & Website: How would you ensure information displayed on the website remains accurate? *',
      type: 'paragraph',
      placeholder: 'Content sync pipelines, schema validations, markdown audits, and staging verification before production deployment...',
      required: true,
      conditional: {
        fieldIds: ['q11_primary_dept', 'q11_secondary_dept'],
        value: ['Technical & Website', 'Technical', 'Website', 'Tech'],
        operator: 'includes'
      }
    },

    // ──────────────────────────────────────────────────────────────
    // 6. Events & Conference Operations Questions
    // ──────────────────────────────────────────────────────────────
    {
      id: 'q_events_coord',
      label: 'Events & Conference Operations: How would you plan and coordinate a large offline conference in Udaipur? *',
      type: 'paragraph',
      placeholder: 'Chamber setup, delegate check-in, audiovisual sync, catering transitions, and stage protocols...',
      required: true,
      conditional: {
        fieldIds: ['q11_primary_dept', 'q11_secondary_dept'],
        value: ['Events & Conference Operations', 'Events', 'Operations'],
        operator: 'includes'
      }
    },
    {
      id: 'q_events_contingency',
      label: 'Events & Conference Operations: What would you include in a conference-day contingency plan? *',
      type: 'paragraph',
      placeholder: 'Backup microphones/screens, medical aid, extra stationery/placards, power outage backup, and runner communication...',
      required: true,
      conditional: {
        fieldIds: ['q11_primary_dept', 'q11_secondary_dept'],
        value: ['Events & Conference Operations', 'Events', 'Operations'],
        operator: 'includes'
      }
    },
    {
      id: 'q_events_tripartite',
      label: 'Events & Conference Operations: How would you coordinate between the Executive Board, delegates and Secretariat? *',
      type: 'paragraph',
      placeholder: 'Ensuring seamless procedural requests, chits flow, council room temperature/water, and schedule adherence...',
      required: true,
      conditional: {
        fieldIds: ['q11_primary_dept', 'q11_secondary_dept'],
        value: ['Events & Conference Operations', 'Events', 'Operations'],
        operator: 'includes'
      }
    },
    {
      id: 'q_events_disruption',
      label: 'Events & Conference Operations: How would you handle an unexpected technical or logistical disruption? *',
      type: 'paragraph',
      placeholder: 'Action plan for PA system failure, projector disconnection, or speaker delays while keeping delegates composed...',
      required: true,
      conditional: {
        fieldIds: ['q11_primary_dept', 'q11_secondary_dept'],
        value: ['Events & Conference Operations', 'Events', 'Operations'],
        operator: 'includes'
      }
    },

    // ──────────────────────────────────────────────────────────────
    // 7. Research & Content Questions
    // ──────────────────────────────────────────────────────────────
    {
      id: 'q_research_verify',
      label: 'Research & Content: How would you research and verify information before publication? *',
      type: 'paragraph',
      placeholder: 'Primary sources, UN official treaty databases, peer-reviewed journals, and citation verification...',
      required: true,
      conditional: {
        fieldIds: ['q11_primary_dept', 'q11_secondary_dept'],
        value: ['Research & Content', 'Research', 'Content'],
        operator: 'includes'
      }
    },
    {
      id: 'q_research_bg_guide',
      label: 'Research & Content: What makes a good committee background guide? *',
      type: 'paragraph',
      placeholder: 'Historical context, committee jurisdiction, key UN resolutions, blocs overview, and actionable questions to consider...',
      required: true,
      conditional: {
        fieldIds: ['q11_primary_dept', 'q11_secondary_dept'],
        value: ['Research & Content', 'Research', 'Content'],
        operator: 'includes'
      }
    },
    {
      id: 'q_research_unbiased',
      label: 'Research & Content: How would you ensure research material is unbiased and comprehensive? *',
      type: 'paragraph',
      placeholder: 'Presenting multi-perspective geopolitical realities without editorial favoritism or regional slant...',
      required: true,
      conditional: {
        fieldIds: ['q11_primary_dept', 'q11_secondary_dept'],
        value: ['Research & Content', 'Research', 'Content'],
        operator: 'includes'
      }
    },
    {
      id: 'q_research_sample',
      label: 'Research & Content: Share a short writing or research sample. *',
      type: 'paragraph',
      placeholder: 'Paste a link to a published article, committee guide excerpt, research essay, or draft a 100-word analysis here...',
      required: true,
      conditional: {
        fieldIds: ['q11_primary_dept', 'q11_secondary_dept'],
        value: ['Research & Content', 'Research', 'Content'],
        operator: 'includes'
      }
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
      label: 'Resume & Portfolio',
      sectionTitle: 'Section 6 — Resume / Curriculum Vitae',
      stepHeading: {
        enabled: true,
        stepBadge: 'STEP 6',
        stepNumber: '06 / Resume & Portfolio',
        headingTitle: 'Section 6 — Resume / Curriculum Vitae',
        description: 'Please upload your updated resume in PDF format and optional portfolio links.'
      }
    },
    {
      id: 'q21_resume_guidelines',
      type: 'title_desc',
      label: 'Resume Upload — Mandatory',
      description: 'Please upload your updated Resume / CV in PDF format. Your resume should ideally include:\n• Academic background\n• MUN experience and designations\n• Leadership and organisational experience\n• Skills and technical proficiency\n• Relevant achievements and projects\n• Previous work samples or portfolio links, if applicable'
    },
    {
      id: 'q22_resume_upload',
      label: 'Resume / CV Upload (PDF) *',
      type: 'file_upload',
      description: 'Attach your PDF document (Maximum file size: 10MB)',
      required: true,
      fileTypes: ['.pdf', 'application/pdf'],
      maxFileSizeMb: 10
    },
    {
      id: 'q23_portfolio_links',
      label: 'Portfolio / LinkedIn / Work Samples (Optional link)',
      type: 'url',
      placeholder: 'https://linkedin.com/in/... or Google Drive folder link',
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
        headingTitle: 'Final Declaration & Digital Confirmation',
        description: 'Formal confirmation of accuracy, commitment, and diplomatic integrity.'
      }
    },
    {
      id: 'declaration_statement',
      type: 'title_desc',
      label: 'Declaration of Commitment & Integrity',
      description: 'I hereby confirm that the information provided in this application is accurate and complete. I understand that selection into the ZENITH MUN 2026 Secretariat involves responsibility, commitment, teamwork and professionalism.\n\nZENITH MUN 2026\nA NEW ZEN BEGINS.'
    },
    {
      id: 'decl_applicant_name',
      label: "Applicant's Name *",
      type: 'short_answer',
      placeholder: 'Type your full legal name as written confirmation',
      required: true
    },
    {
      id: 'decl_date',
      label: 'Date *',
      type: 'date',
      defaultValue: new Date().toISOString().split('T')[0],
      required: true
    },
    {
      id: 'decl_signature_confirmation',
      label: 'Signature / Confirmation (Type your full name to formally seal this application) *',
      type: 'short_answer',
      placeholder: 'Type your legal signature / confirmation',
      required: true
    }
  ]
};
