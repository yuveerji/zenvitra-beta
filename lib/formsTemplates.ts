import { ZenForm, ZenFormTemplate, ZenFormField } from '@/types/forms';
import { ZEN_DIPLOMACY_2026_FORM_TEMPLATE } from '@/lib/forms/ZenDiplomacyFormTemplate';
import { ZEN_SECRETARIAT_2026_FORM_TEMPLATE } from '@/lib/forms/ZenSecretariatFormTemplate';

const LS_COMMUNITY_TEMPLATES_KEY = 'zenvitra_community_templates_v1';

export const HACKATHON_SPRINT_TEMPLATE: ZenFormTemplate = {
  id: 'tmpl_hackathon_sprint',
  title: 'Zen Sprint & Hackathon 2026 — Team Registration',
  slug: 'hackathon-sprint-2026',
  description: 'Team intake for 48-hour builder hackathon. Register squad details, tech stacks, repository URLs, and project tracks.',
  category: 'GENERAL',
  theme: 'midnight',
  tags: ['Hackathon', 'Web3', 'AI', 'Teams'],
  author: 'Zenvitra Tech Directorate',
  authorHandle: 'tech_directorate',
  featured: true,
  accentColor: '#06b6d4',
  form: {
    id: 'tmpl_form_hackathon',
    title: 'Zen Sprint & Hackathon 2026 — Official Team Intake',
    slug: 'hackathon-sprint-2026',
    description: 'Register your team for the 48-hour sovereign architecture sprint. Teams of 2 to 4 members are eligible for bounty tracks.',
    category: 'GENERAL',
    theme: 'midnight',
    submitButtonText: 'Register Hackathon Team',
    successMessage: 'Team successfully registered on the sovereign dev ledger! Access keys and Discord dais coordinates will be dispatched within 4 hours.',
    ownerHandle: 'hackathon_lead',
    submissionsCount: 0,
    isPublished: true,
    allowAnonymous: false,
    acceptingResponses: true,
    stepHeadingsEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customStyle: {
      displayFont: 'Clash Display',
      bodyFont: 'JetBrains Mono',
      accentColor: '#06b6d4',
      cardStyle: 'cyber-neon',
      borderRadius: '2xl'
    },
    fields: [
      {
        id: 'team_name',
        label: 'Team / Squad Name *',
        type: 'short_answer',
        placeholder: 'e.g. Sovereign Synthetics',
        required: true,
        stepHeading: {
          enabled: true,
          stepBadge: 'STEP 1',
          stepNumber: '01 / Team Profile',
          headingTitle: 'Team Identity & Lead Credentials',
          description: 'Designate your squad name and primary point of contact.'
        }
      },
      {
        id: 'team_lead_name',
        label: 'Team Lead Full Name *',
        type: 'short_answer',
        placeholder: 'Lead Developer Name',
        required: true
      },
      {
        id: 'team_lead_email',
        label: 'Primary Contact Email *',
        type: 'email',
        placeholder: 'lead@devsquad.io',
        required: true
      },
      {
        id: 'team_lead_github',
        label: 'Lead GitHub or Portfolio Link *',
        type: 'url',
        placeholder: 'https://github.com/lead-handle',
        required: true
      },
      {
        id: 'team_size',
        label: 'Team Size (Including Lead) *',
        type: 'dropdown',
        options: ['Solo Hacker (1)', 'Duo (2)', 'Trio (3)', 'Quad (4 Members)'],
        required: true
      },
      {
        id: 'step_break_track',
        type: 'section_break',
        label: 'Sprint Track & Tech Stack',
        sectionTitle: 'Bounty Track & Technology Stack',
        stepHeading: {
          enabled: true,
          stepBadge: 'STEP 2',
          stepNumber: '02 / Track & Architecture',
          headingTitle: 'Select Your Challenge Track',
          description: 'Choose which prize category and tech ecosystem your project will target.'
        }
      },
      {
        id: 'hack_track',
        label: 'Primary Bounty Track *',
        type: 'multiple_choice',
        options: [
          'Autonomous Agent Infrastructure (AI/LLMs)',
          'Cryptographic Ledgers & Smart Contracts',
          'Sovereign Identity & Privacy-Preserving Tooling',
          'Open Innovation & High-Impact Social Goods'
        ],
        required: true
      },
      {
        id: 'tech_stack',
        label: 'Core Technologies / Frameworks Used *',
        type: 'paragraph',
        placeholder: 'e.g. Next.js, FastAPI, PostgreSQL, Supabase, TailwindCSS, PyTorch...',
        required: true
      },
      {
        id: 'past_project_url',
        label: 'Link to Past Notable Project or Demo (Optional)',
        type: 'url',
        placeholder: 'https://devpost.com/... or https://github.com/...',
        required: false
      }
    ]
  }
};

export const CAMPUS_AMBASSADOR_TEMPLATE: ZenFormTemplate = {
  id: 'tmpl_campus_ambassador',
  title: 'Global Campus Ambassador & Youth Fellowship 2026',
  slug: 'campus-ambassador-2026',
  description: 'University and collegiate partnership application. Lead registrations, host satellite summits, and spearhead chapter expansion.',
  category: 'GENERAL',
  theme: 'emerald',
  tags: ['Ambassador', 'Fellowship', 'University', 'Leadership'],
  author: 'Zenvitra Outreach Bureau',
  authorHandle: 'outreach_head',
  featured: true,
  accentColor: '#10b981',
  form: {
    id: 'tmpl_form_ambassador',
    title: 'Zen Campus Ambassador Fellowship 2026',
    slug: 'campus-ambassador-2026',
    description: 'Represent Zenvitra at your institution. Receive certified diplomatic commendations, executive mentorship, and delegate grants.',
    category: 'GENERAL',
    theme: 'emerald',
    submitButtonText: 'Submit Fellowship Application',
    successMessage: 'Your Ambassador application is under evaluation! Our Regional Directorate will reach out via WhatsApp/Email for an introductory briefing.',
    ownerHandle: 'outreach_lead',
    submissionsCount: 0,
    isPublished: true,
    allowAnonymous: false,
    acceptingResponses: true,
    stepHeadingsEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customStyle: {
      displayFont: 'Outfit',
      bodyFont: 'Inter',
      accentColor: '#10b981',
      cardStyle: 'glass-frosted',
      borderRadius: '2xl'
    },
    fields: [
      {
        id: 'amb_fullname',
        label: 'Candidate Full Legal Name *',
        type: 'short_answer',
        placeholder: 'e.g. Rohan Mehra',
        required: true,
        stepHeading: {
          enabled: true,
          stepBadge: 'STEP 1',
          stepNumber: '01 / Academic Identity',
          headingTitle: 'Collegiate & Personal Credentials',
          description: 'Provide your institution and current year of study.'
        }
      },
      {
        id: 'amb_email',
        label: 'Collegiate / Personal Email *',
        type: 'email',
        placeholder: 'candidate@university.edu',
        required: true
      },
      {
        id: 'amb_phone',
        label: 'WhatsApp Contact Number *',
        type: 'phone',
        placeholder: '+91 98765 43210',
        required: true
      },
      {
        id: 'amb_college',
        label: 'Name of College / University & Campus Location *',
        type: 'short_answer',
        placeholder: 'e.g. IIT Bombay / St. Stephen’s College, Delhi',
        required: true
      },
      {
        id: 'amb_major',
        label: 'Degree & Year of Study *',
        type: 'short_answer',
        placeholder: 'e.g. B.Tech Computer Science (3rd Year)',
        required: true
      },
      {
        id: 'step_break_outreach',
        type: 'section_break',
        label: 'Outreach & Strategy',
        sectionTitle: 'Campus Reach & Execution Strategy',
        stepHeading: {
          enabled: true,
          stepBadge: 'STEP 2',
          stepNumber: '02 / Outreach Execution',
          headingTitle: 'Campus Mobilization Strategy',
          description: 'Outline your campus network and distribution vision.'
        }
      },
      {
        id: 'amb_network',
        label: 'Estimated Student Reach via Societies / Student Councils *',
        type: 'dropdown',
        options: ['50–150 students', '150–500 students', '500–1,500 students', '1,500+ students (Major Campus Hub)'],
        required: true
      },
      {
        id: 'amb_bandwidth',
        label: 'Weekly Commitment Bandwidth *',
        type: 'bandwidth_tier',
        required: true,
        bandwidthTiers: [
          {
            id: 'tier_lite',
            label: '3–5 hours / week (Social sharing & classroom buzz)',
            title: '3–5 Hours / Week',
            tier: 'COMMUNITY ADVOCATE',
            desc: 'Distribute conference posters, share group links, and answer fellow student queries.'
          },
          {
            id: 'tier_growth',
            label: '6–10 hours / week (Society partnerships & delegations)',
            title: '6–10 Hours / Week',
            tier: 'CAMPUS AMBASSADOR',
            desc: 'Organize formal delegation tie-ups with MUN societies, student councils, and department heads.'
          },
          {
            id: 'tier_lead',
            label: '10–15+ hours / week (Regional Chapter Director)',
            title: '10–15+ Hours / Week',
            tier: 'REGIONAL DIRECTOR',
            desc: 'Lead multi-college outreach across your city, host campus satellite sessions, and recruit ambassadors.'
          }
        ]
      },
      {
        id: 'amb_pitch',
        label: 'How will you inspire students at your institution to join Zen Diplomacy 2026? *',
        type: 'paragraph',
        placeholder: 'Outline your concrete marketing, campus buzz, or society partnership strategy...',
        required: true
      }
    ]
  }
};

export const CSAT_FEEDBACK_TEMPLATE: ZenFormTemplate = {
  id: 'tmpl_csat_feedback',
  title: 'Conference CSAT & Delegate Review Survey',
  slug: 'csat-evaluation-2026',
  description: 'Evaluate dais moderation, committee debate quality, digital logistics, and platform infrastructure.',
  category: 'FEEDBACK',
  theme: 'purple',
  tags: ['Feedback', 'CSAT', 'Evaluation', 'Review'],
  author: 'Executive Oversight Board',
  authorHandle: 'oversight_board',
  featured: true,
  accentColor: '#8b5cf6',
  form: {
    id: 'tmpl_form_csat',
    title: 'Summit CSAT & Delegate Review Survey',
    slug: 'csat-evaluation-2026',
    description: 'Help us refine future diplomatic summits. All responses are audited for conference accreditation metrics.',
    category: 'FEEDBACK',
    theme: 'purple',
    submitButtonText: 'Submit Conference Evaluation',
    successMessage: 'Thank you for your valuable evaluation! Your ratings contribute directly to our academic and operational audit report.',
    ownerHandle: 'quality_lead',
    submissionsCount: 0,
    isPublished: true,
    allowAnonymous: true,
    acceptingResponses: true,
    stepHeadingsEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customStyle: {
      displayFont: 'Syne',
      bodyFont: 'Space Grotesk',
      accentColor: '#8b5cf6',
      cardStyle: 'solid-dark',
      borderRadius: '2xl'
    },
    fields: [
      {
        id: 'csat_overall_rating',
        label: 'Overall Experience Rating *',
        type: 'rating',
        ratingMax: 5,
        ratingIcon: 'star',
        required: true,
        stepHeading: {
          enabled: true,
          stepBadge: 'STEP 1',
          stepNumber: '01 / Academic Review',
          headingTitle: 'Session & Dais Quality Ratings',
          description: 'Score the substantive depth and procedural flow of your committee.'
        }
      },
      {
        id: 'csat_dais_scale',
        label: 'Executive Board / Dais Fairness & Knowledge (1-5 Scale) *',
        type: 'linear_scale',
        scaleMin: 1,
        scaleMax: 5,
        scaleMinLabel: 'Sub-par',
        scaleMaxLabel: 'Masterful',
        required: true
      },
      {
        id: 'csat_platform_scale',
        label: 'Digital Matrix & Portal Usability (1-5 Scale) *',
        type: 'linear_scale',
        scaleMin: 1,
        scaleMax: 5,
        scaleMinLabel: 'Difficult',
        scaleMaxLabel: 'Seamless',
        required: true
      },
      {
        id: 'csat_best_aspect',
        label: 'What was the single most impressive aspect of the conference?',
        type: 'short_answer',
        placeholder: 'e.g. Midnight crisis update, background dossier, cross-caucus debate...',
        required: false
      },
      {
        id: 'csat_criticisms',
        label: 'What is one concrete change you would mandate for next year?',
        type: 'paragraph',
        placeholder: 'Specific suggestions for timing, moderation, or communication...',
        required: false
      }
    ]
  }
};

export const OFFICIAL_TEMPLATES: ZenFormTemplate[] = [
  {
    id: 'tmpl_zen_diplomacy_2026',
    title: 'ZEN.DIPLOMACY 2026 — Official Delegate Registration',
    slug: 'zen-diplomacy-2026',
    description: 'National Youth Diplomatic & Multilateral Assembly. Configurable 4-chamber selector (AIPPM, EMI, ECOSOC, UNSC), live matrix peeker, portfolio ranking, and experience counters.',
    category: 'MUN_REGISTRATION',
    theme: 'amber',
    tags: ['Official', 'MUN', 'Diplomacy', 'Chambers', 'Matrix'],
    author: 'Zenvitra Secretariat',
    authorHandle: 'yuveer',
    featured: true,
    accentColor: '#f59e0b',
    previewImage: '/assets/forms/template-mun.svg',
    form: ZEN_DIPLOMACY_2026_FORM_TEMPLATE
  },
  {
    id: 'tmpl_zen_secretariat_2026',
    title: 'ZEN.DIPLOMACY 2026 — Official Secretariat Application',
    slug: 'zen-secretariat-2026',
    description: 'Executive Board & Organizing Committee Intake. Configurable across 10 specialized departments with dynamic simulation scenario challenges and bandwidth tier commitments.',
    category: 'EXECUTIVE_BOARD',
    theme: 'purple',
    tags: ['Official', 'Secretariat', 'Hiring', 'Departments', 'Simulation'],
    author: 'Executive Directorate',
    authorHandle: 'yuveer',
    featured: true,
    accentColor: '#a855f7',
    previewImage: '/assets/forms/template-gala.svg',
    form: ZEN_SECRETARIAT_2026_FORM_TEMPLATE
  },
  HACKATHON_SPRINT_TEMPLATE,
  CAMPUS_AMBASSADOR_TEMPLATE,
  CSAT_FEEDBACK_TEMPLATE
];

export function getOfficialTemplates(): ZenFormTemplate[] {
  return OFFICIAL_TEMPLATES;
}

export function getCommunityTemplates(): ZenFormTemplate[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LS_COMMUNITY_TEMPLATES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCommunityTemplate(template: ZenFormTemplate): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getCommunityTemplates();
    const filtered = existing.filter((t) => t.id !== template.id && t.slug !== template.slug);
    const updated = [template, ...filtered];
    localStorage.setItem(LS_COMMUNITY_TEMPLATES_KEY, JSON.stringify(updated));

    // Also sync to server background API
    fetch('/api/forms/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template })
    }).catch(() => {});
  } catch (e) {
    console.warn('[SAVE-COMMUNITY-TEMPLATE-ERR]', e);
  }
}

export function deleteCommunityTemplate(templateId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getCommunityTemplates();
    const updated = existing.filter((t) => t.id !== templateId);
    localStorage.setItem(LS_COMMUNITY_TEMPLATES_KEY, JSON.stringify(updated));
  } catch {}
}

export function getAllTemplates(): ZenFormTemplate[] {
  const official = getOfficialTemplates();
  const community = getCommunityTemplates();
  // Filter duplicates
  const map = new Map<string, ZenFormTemplate>();
  official.forEach((t) => map.set(t.id, t));
  community.forEach((t) => {
    if (!map.has(t.id)) map.set(t.id, t);
  });
  return Array.from(map.values());
}

export function getTemplateById(idOrSlug: string): ZenFormTemplate | null {
  const all = getAllTemplates();
  const clean = idOrSlug.trim().toLowerCase();
  return all.find((t) => t.id.toLowerCase() === clean || t.slug?.toLowerCase() === clean) || null;
}

/**
 * Clean a form for template sharing (strips submission statistics, sets generic creation metadata)
 */
export function sanitizeFormForTemplate(form: ZenForm): ZenForm {
  const clean: ZenForm = {
    ...form,
    id: `tmpl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    submissionsCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  return clean;
}

/**
 * Export a ZenForm schema as clean JSON string
 */
export function exportTemplateAsJson(form: ZenForm): string {
  const clean = sanitizeFormForTemplate(form);
  return JSON.stringify(clean, null, 2);
}

/**
 * Download template as a `.zenform.json` file in browser
 */
export function downloadTemplateJsonFile(form: ZenForm): void {
  if (typeof window === 'undefined') return;
  const json = exportTemplateAsJson(form);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeTitle = (form.title || 'zenform').toLowerCase().replace(/[^a-z0-9_-]/g, '-').slice(0, 30);
  a.href = url;
  a.download = `${safeTitle}-template.zenform.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generate a shareable URL that embeds the template data or links to template slug
 */
export function generateShareableTemplateUrl(form: ZenForm): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://zenvitra.org';
  
  // If it matches an official or registered template, link directly by slug
  if (form.slug === 'zen-diplomacy-2026' || form.id === 'zen-diplomacy-2026-registration') {
    return `${baseUrl}/forms?template=zen-diplomacy-2026`;
  }
  if (form.slug === 'zen-secretariat-2026' || form.id === 'zen-secretariat-2026-application') {
    return `${baseUrl}/forms?template=zen-secretariat-2026`;
  }

  // Encode lightweight form payload into URL-safe base64
  try {
    const minified = {
      title: form.title,
      description: form.description,
      category: form.category,
      theme: form.theme,
      customStyle: form.customStyle,
      fields: form.fields,
      submitButtonText: form.submitButtonText,
      successMessage: form.successMessage,
      stepHeadingsEnabled: form.stepHeadingsEnabled
    };
    const jsonStr = JSON.stringify(minified);
    const base64 = btoa(encodeURIComponent(jsonStr));
    return `${baseUrl}/forms?templateData=${encodeURIComponent(base64)}`;
  } catch (err) {
    return `${baseUrl}/forms?template=${form.slug || form.id}`;
  }
}

/**
 * Decode and reconstruct a ZenForm from URL parameter
 */
export function unpackTemplateFromData(encodedParam: string): ZenForm | null {
  try {
    const raw = decodeURIComponent(encodedParam);
    const decodedJson = decodeURIComponent(atob(raw));
    const parsed = JSON.parse(decodedJson);
    if (!parsed || !parsed.title || !Array.isArray(parsed.fields)) return null;

    const baseSlug = (parsed.title || 'imported-template').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const newForm: ZenForm = {
      id: `form_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: parsed.title,
      slug: `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`,
      description: parsed.description || '',
      category: parsed.category || 'GENERAL',
      theme: parsed.theme || 'amber',
      customStyle: parsed.customStyle,
      fields: parsed.fields,
      submitButtonText: parsed.submitButtonText || 'Submit Response',
      successMessage: parsed.successMessage || 'Your response has been cryptographically recorded.',
      ownerHandle: 'sovereign_host',
      submissionsCount: 0,
      isPublished: true,
      allowAnonymous: true,
      acceptingResponses: true,
      stepHeadingsEnabled: parsed.stepHeadingsEnabled ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return newForm;
  } catch {
    return null;
  }
}

/**
 * Parse uploaded or pasted JSON into a valid ZenForm
 */
export function importTemplateFromJson(jsonString: string): ZenForm | null {
  try {
    const parsed = JSON.parse(jsonString);
    const target = parsed.form || parsed;
    if (!target || !target.title || !Array.isArray(target.fields)) return null;

    const baseSlug = (target.title || 'imported-template').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const newForm: ZenForm = {
      ...target,
      id: `form_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      slug: `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`,
      submissionsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return newForm;
  } catch {
    return null;
  }
}

/**
 * Instantiates a new fresh form ready for editing from any template
 */
export function createFormFromTemplate(template: ZenFormTemplate | ZenForm, customTitle?: string): ZenForm {
  const base = 'form' in template ? template.form : template;
  const title = customTitle || base.title;
  const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'form';

  const newForm: ZenForm = {
    ...base,
    id: `form_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    slug: `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`,
    title,
    submissionsCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  return newForm;
}
