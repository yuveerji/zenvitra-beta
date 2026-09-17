import { ZenForm, ZenFormField, ZenFormSubmission, ZenFormTheme } from '@/types/forms';

const LS_FORMS_KEY = 'zenvitra_public_forms_v1';
const LS_SUBMISSIONS_KEY = 'zenvitra_form_submissions_v1';

export const DEFAULT_ZEN_FORMS: ZenForm[] = [
  {
    id: 'form_jharokha_delegate_2026',
    title: 'The Jharokha Forum MUN 2026 — Delegate Registration',
    slug: 'jharokha-delegate-2026',
    description: 'Official delegate registration portal for The Jharokha Forum Model United Nations 2026. Select your preferred committees and portfolios. Cryptographically signed on the Zenvitra ledger.',
    category: 'MUN_REGISTRATION',
    theme: 'amber',
    submitButtonText: 'Submit Delegate Registration',
    successMessage: 'Registration submitted successfully! Your allotment dossier will be ratified by the Secretariat.',
    ownerHandle: 'yuveer',
    submissionsCount: 0,
    isPublished: true,
    allowAnonymous: true,
    createdAt: '2026-09-15T10:00:00.000Z',
    updatedAt: '2026-09-17T12:00:00.000Z',
    fields: [
      {
        id: 'f_fullName',
        label: 'Full Legal / Delegate Name',
        type: 'text',
        placeholder: 'e.g. Aarav Sharma',
        required: true,
      },
      {
        id: 'f_email',
        label: 'Official Email Address',
        type: 'email',
        placeholder: 'aarav@example.com',
        required: true,
      },
      {
        id: 'f_phone',
        label: 'WhatsApp / Contact Number',
        type: 'tel',
        placeholder: '+91 98765 43210',
        required: true,
      },
      {
        id: 'f_institution',
        label: 'School / University / Delegation',
        type: 'text',
        placeholder: "e.g. St. Xavier's Collegiate / Independent",
        required: true,
      },
      {
        id: 'f_committeePref1',
        label: 'First Committee Preference',
        type: 'select',
        required: true,
        options: [
          'Lok Sabha — National Youth Sovereignty Bill',
          'UN Security Council (UNSC) — Autonomous Cyber-Warfare',
          'Constituent Assembly of India (SASSY 2026)',
          'UN Human Rights Council (UNHRC)',
          'International Press Corps (IP)'
        ],
      },
      {
        id: 'f_portfolioPref1',
        label: 'First Portfolio / Country Preference',
        type: 'text',
        placeholder: 'e.g. Narendra Modi / France / Dr. B.R. Ambedkar',
        required: true,
      },
      {
        id: 'f_committeePref2',
        label: 'Second Committee Preference',
        type: 'select',
        required: true,
        options: [
          'Lok Sabha — National Youth Sovereignty Bill',
          'UN Security Council (UNSC) — Autonomous Cyber-Warfare',
          'Constituent Assembly of India (SASSY 2026)',
          'UN Human Rights Council (UNHRC)',
          'International Press Corps (IP)'
        ],
      },
      {
        id: 'f_munExperience',
        label: 'Past MUN / Parliamentary Experience',
        type: 'textarea',
        placeholder: 'List past conferences, awards, gavels or committees attended (or mention First-Timer)...',
        required: false,
      }
    ]
  },
  {
    id: 'form_horizon_eb_2026',
    title: 'Horizon MUN 2026 — Executive Board (EB) Applications',
    slug: 'horizon-eb-2026',
    description: 'Call for Executive Board Chairs, Vice-Chairs, and Rapporteurs for Horizon Model United Nations 2026.',
    category: 'EXECUTIVE_BOARD',
    theme: 'midnight',
    submitButtonText: 'Submit Dais Application',
    successMessage: 'EB dossier received. Secretariat review interviews will be scheduled via Zenvitra.',
    ownerHandle: 'horizon',
    submissionsCount: 1,
    isPublished: true,
    allowAnonymous: false,
    createdAt: '2026-09-16T12:00:00.000Z',
    updatedAt: '2026-09-17T09:00:00.000Z',
    fields: [
      {
        id: 'eb_name',
        label: 'Full Name',
        type: 'text',
        placeholder: 'Applicant name',
        required: true,
      },
      {
        id: 'eb_email',
        label: 'Email',
        type: 'email',
        placeholder: 'email@domain.com',
        required: true,
      },
      {
        id: 'eb_role',
        label: 'Applying For Role',
        type: 'select',
        required: true,
        options: ['Chairperson', 'Vice-Chairperson', 'Director-General', 'Rapporteur'],
      },
      {
        id: 'eb_committee',
        label: 'Preferred Committee',
        type: 'select',
        required: true,
        options: ['UN Security Council', 'UN General Assembly Plenary', 'UNODC', 'Historical Crisis'],
      },
      {
        id: 'eb_dossier',
        label: 'Executive Board Resume & Dais Philosophy',
        type: 'textarea',
        placeholder: 'Outline your procedural mastery, past EB appointments, and vision for the committee agenda...',
        required: true,
      }
    ]
  }
];

export function getPublicForms(): ZenForm[] {
  if (typeof window === 'undefined') return DEFAULT_ZEN_FORMS;
  try {
    const raw = localStorage.getItem(LS_FORMS_KEY);
    if (!raw) {
      localStorage.setItem(LS_FORMS_KEY, JSON.stringify(DEFAULT_ZEN_FORMS));
      return DEFAULT_ZEN_FORMS;
    }
    const parsed: ZenForm[] = JSON.parse(raw);
    return parsed.length > 0 ? parsed : DEFAULT_ZEN_FORMS;
  } catch {
    return DEFAULT_ZEN_FORMS;
  }
}

export function getZenFormById(idOrSlug: string): ZenForm | null {
  const forms = getPublicForms();
  return forms.find((f) => f.id === idOrSlug || f.slug === idOrSlug) || null;
}

export function saveZenForm(form: ZenForm): ZenForm {
  const forms = getPublicForms();
  const existingIdx = forms.findIndex((f) => f.id === form.id);
  let updated: ZenForm[];
  if (existingIdx >= 0) {
    updated = forms.map((f, i) => (i === existingIdx ? { ...form, updatedAt: new Date().toISOString() } : f));
  } else {
    updated = [{ ...form, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...forms];
  }
  try {
    localStorage.setItem(LS_FORMS_KEY, JSON.stringify(updated));
  } catch {}
  return form;
}

export function deleteZenForm(formId: string): boolean {
  const forms = getPublicForms();
  const filtered = forms.filter((f) => f.id !== formId);
  try {
    localStorage.setItem(LS_FORMS_KEY, JSON.stringify(filtered));
  } catch {}
  return true;
}

export function getFormSubmissions(formId: string): ZenFormSubmission[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${LS_SUBMISSIONS_KEY}_${formId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function recordZenFormSubmission(
  formId: string, 
  data: Record<string, any>, 
  submitterHandle?: string
): Promise<ZenFormSubmission> {
  const newSub: ZenFormSubmission = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    formId,
    submittedAt: new Date().toISOString(),
    data,
    submitterHandle: submitterHandle || 'anonymous',
  };

  // 1. Save in local storage
  if (typeof window !== 'undefined') {
    try {
      const subs = getFormSubmissions(formId);
      localStorage.setItem(`${LS_SUBMISSIONS_KEY}_${formId}`, JSON.stringify([newSub, ...subs]));
      
      // Update count on form
      const forms = getPublicForms();
      const updatedForms = forms.map((f) => 
        f.id === formId ? { ...f, submissionsCount: (f.submissionsCount || 0) + 1 } : f
      );
      localStorage.setItem(LS_FORMS_KEY, JSON.stringify(updatedForms));
    } catch (e) {
      console.warn('LocalStorage form sub save error:', e);
    }
  }

  // 2. Dispatch to server ledger API
  try {
    fetch('/api/forms/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formId,
        submissionId: newSub.id,
        submittedAt: newSub.submittedAt,
        data,
        submitterHandle,
      }),
    }).catch(() => {});
  } catch {}

  return newSub;
}

export function exportSubmissionsToCsv(form: ZenForm, submissions: ZenFormSubmission[]): string {
  if (submissions.length === 0) return '';
  const headers = ['Submission ID', 'Submitted At', 'Submitter', ...form.fields.map((f) => `"${f.label.replace(/"/g, '""')}"`)];
  const rows = submissions.map((sub) => {
    return [
      `"${sub.id}"`,
      `"${new Date(sub.submittedAt).toLocaleString()}"`,
      `"${(sub.submitterHandle || 'Anonymous').replace(/"/g, '""')}"`,
      ...form.fields.map((f) => {
        const val = sub.data[f.id] ?? '';
        const stringVal = Array.isArray(val) ? val.join('; ') : String(val);
        return `"${stringVal.replace(/"/g, '""')}"`;
      }),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}
