export type ZenFormFieldType = 
  | 'text'
  | 'email'
  | 'tel'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date';

export interface ZenFormField {
  id: string;
  label: string;
  type: ZenFormFieldType;
  placeholder?: string;
  description?: string;
  required?: boolean;
  options?: string[];
  defaultValue?: string;
}

export type ZenFormTheme = 
  | 'obsidian'
  | 'midnight'
  | 'emerald'
  | 'amber'
  | 'paper'
  | 'purple';

export interface ZenFormSubmission {
  id: string;
  formId: string;
  submittedAt: string;
  data: Record<string, any>;
  submitterHandle?: string;
}

export interface ZenForm {
  id: string;
  title: string;
  slug?: string;
  description: string;
  category: 'MUN_REGISTRATION' | 'EXECUTIVE_BOARD' | 'PRESS_CORPS' | 'FEEDBACK' | 'SURVEY' | 'GENERAL';
  theme: ZenFormTheme;
  fields: ZenFormField[];
  submitButtonText: string;
  successMessage: string;
  ownerHandle: string;
  submissionsCount: number;
  isPublished: boolean;
  allowAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}
