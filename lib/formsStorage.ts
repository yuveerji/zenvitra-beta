import { 
  ZenForm, 
  ZenFormField, 
  ZenFormSubmission, 
  ZenFormTheme, 
  ZenFormsAccountSheetsConfig, 
  ZenFormGoogleSheetsConfig 
} from '@/types/forms';

const LS_FORMS_KEY = 'zenvitra_public_forms_v1';
const LS_SUBMISSIONS_KEY = 'zenvitra_form_submissions_v1';
const LS_ZENFORMS_SHEETS_KEY = 'zenvitra_forms_sheets_config_v1';

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

  // Sync to server background registry
  if (typeof window !== 'undefined') {
    fetch('/api/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ form }),
    }).catch(() => {});
  }

  return form;
}

export function deleteZenForm(formId: string): boolean {
  const forms = getPublicForms();
  const filtered = forms.filter((f) => f.id !== formId);
  try {
    localStorage.setItem(LS_FORMS_KEY, JSON.stringify(filtered));
  } catch {}

  if (typeof window !== 'undefined') {
    fetch(`/api/forms/${formId}`, { method: 'DELETE' }).catch(() => {});
  }
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

export async function fetchFormSubmissions(formId: string): Promise<ZenFormSubmission[]> {
  const localSubs = getFormSubmissions(formId);
  if (typeof window === 'undefined') return localSubs;

  try {
    const res = await fetch(`/api/forms/${formId}/submissions`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.submissions)) {
        // Merge server and local without duplicates (keyed by ID)
        const subMap = new Map<string, ZenFormSubmission>();
        data.submissions.forEach((s: ZenFormSubmission) => subMap.set(s.id, s));
        localSubs.forEach((s: ZenFormSubmission) => {
          if (!subMap.has(s.id)) subMap.set(s.id, s);
        });

        const merged = Array.from(subMap.values()).sort(
          (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );

        localStorage.setItem(`${LS_SUBMISSIONS_KEY}_${formId}`, JSON.stringify(merged));

        // Update count on form
        const forms = getPublicForms();
        const updatedForms = forms.map((f) => 
          f.id === formId ? { ...f, submissionsCount: merged.length } : f
        );
        localStorage.setItem(LS_FORMS_KEY, JSON.stringify(updatedForms));

        return merged;
      }
    }
  } catch (err) {
    console.warn('[FETCH-FORM-SUBMISSIONS-WARN]', err);
  }

  return localSubs;
}

export async function deleteFormSubmission(formId: string, submissionId: string): Promise<boolean> {
  if (typeof window !== 'undefined') {
    try {
      const subs = getFormSubmissions(formId).filter((s) => s.id !== submissionId);
      localStorage.setItem(`${LS_SUBMISSIONS_KEY}_${formId}`, JSON.stringify(subs));
      const forms = getPublicForms();
      const updatedForms = forms.map((f) => 
        f.id === formId ? { ...f, submissionsCount: subs.length } : f
      );
      localStorage.setItem(LS_FORMS_KEY, JSON.stringify(updatedForms));

      fetch(`/api/forms/${formId}/submissions?submissionId=${submissionId}`, {
        method: 'DELETE'
      }).catch(() => {});
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export function clearFormSubmissions(formId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.removeItem(`${LS_SUBMISSIONS_KEY}_${formId}`);
    const forms = getPublicForms();
    const updatedForms = forms.map((f) => 
      f.id === formId ? { ...f, submissionsCount: 0 } : f
    );
    localStorage.setItem(LS_FORMS_KEY, JSON.stringify(updatedForms));

    fetch(`/api/forms/${formId}/submissions`, { method: 'DELETE' }).catch(() => {});
    return true;
  } catch {
    return false;
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

  // 2. Dispatch to server ledger API (and forward to Google Sheets if connected)
  try {
    const sheetsConfig = getZenFormsSheetsConfig();
    const currentForm = getZenFormById(formId);
    const formWebhook = currentForm?.googleSheetsConfig?.webhookUrl;
    const customSheetUrl = currentForm?.googleSheetsConfig?.sheetUrl || sheetsConfig?.defaultSheetUrl;

    fetch('/api/forms/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formId,
        submissionId: newSub.id,
        submittedAt: newSub.submittedAt,
        data,
        submitterHandle,
        googleSheetsConnected: Boolean(sheetsConfig?.isConnected || formWebhook),
        googleUserEmail: sheetsConfig?.userEmail,
        customSheetUrl,
        webhookUrl: formWebhook,
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

/* ── Google Sheets Integration Helpers ── */

export function getZenFormsSheetsConfig(): ZenFormsAccountSheetsConfig | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LS_ZENFORMS_SHEETS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveZenFormsSheetsConfig(config: ZenFormsAccountSheetsConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LS_ZENFORMS_SHEETS_KEY, JSON.stringify(config));
  } catch {}
}

export function disconnectZenFormsSheets(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(LS_ZENFORMS_SHEETS_KEY);
  } catch {}
}

export async function syncFormSubmissionsToGoogleSheets(
  form: ZenForm, 
  submissions?: ZenFormSubmission[],
  userEmail?: string,
  customSheetUrl?: string
): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    const subs = submissions || getFormSubmissions(form.id);
    if (!subs || subs.length === 0) {
      return { success: false, error: 'No submissions found to sync.' };
    }

    const config = getZenFormsSheetsConfig();
    const finalEmail = userEmail || config?.userEmail || 'authenticated_user';
    const finalSheetUrl = customSheetUrl || form.googleSheetsConfig?.sheetUrl || config?.defaultSheetUrl;
    const finalWebhookUrl = form.googleSheetsConfig?.webhookUrl;

    const res = await fetch('/api/forms/sheets/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formId: form.id,
        formTitle: form.title,
        formSlug: form.slug,
        submissions: subs,
        userEmail: finalEmail,
        customSheetUrl: finalSheetUrl,
        webhookUrl: finalWebhookUrl,
        targetTab: form.googleSheetsConfig?.sheetTab || (form.slug ? `ZEN_${form.slug.toUpperCase().replace(/[^A-Z0-9_]/g, '_')}` : 'ZEN_FORMS')
      })
    });

    const data = await res.json();
    return { success: Boolean(data.success), count: data.count, error: data.error };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Sync failed' };
  }
}
