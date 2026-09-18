export type ZenFormFieldType = 
  | 'text'
  | 'short_answer'
  | 'email'
  | 'tel'
  | 'number'
  | 'textarea'
  | 'paragraph'
  | 'select'
  | 'dropdown'
  | 'radio'
  | 'multiple_choice'
  | 'checkbox'
  | 'checkboxes'
  | 'date'
  | 'title_desc'
  | 'image_block'
  | 'video_block'
  | 'section_break';

export interface ZenFormField {
  id: string;
  label: string;
  type: ZenFormFieldType;
  placeholder?: string;
  description?: string;
  required?: boolean;
  options?: string[];
  defaultValue?: string;
  hasOtherOption?: boolean;
  mediaUrl?: string;
  mediaCaption?: string;
  videoUrl?: string;
  sectionTitle?: string;
  sectionDescription?: string;
  alignment?: 'left' | 'center' | 'right';
}

export type ZenFormTheme = 
  | 'obsidian'
  | 'midnight'
  | 'emerald'
  | 'amber'
  | 'paper'
  | 'purple'
  | 'custom';

export type ZenFormFontFamily =
  | 'Space Grotesk'
  | 'Playfair Display'
  | 'Syne'
  | 'Outfit'
  | 'Clash Display'
  | 'JetBrains Mono'
  | 'Bebas Neue'
  | 'Prata'
  | 'Orbitron'
  | 'Dancing Script'
  | 'Inter';

export interface ZenFormCustomStyle {
  // Typography
  displayFont?: ZenFormFontFamily;
  bodyFont?: ZenFormFontFamily;
  
  // Background
  bgType?: 'gradient' | 'image' | 'solid';
  bgGradient?: string;
  bgSolidColor?: string;
  bgImageUrl?: string;
  bgOverlayOpacity?: number; // 0 to 100
  bgBlur?: number; // 0 to 30

  // Branding & Media
  coverImageUrl?: string;
  logoUrl?: string;
  
  // Card & Container
  cardStyle?: 'glass-deep' | 'glass-frosted' | 'solid-dark' | 'outline-minimal' | 'cyber-neon';
  cardBlur?: number;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  
  // Accent & Buttons
  accentColor?: string; // hex
  accentTextColor?: string;
  
  // Ambient FX
  ambientEffect?: 'none' | 'aurora' | 'grid' | 'dots' | 'stardust';
}

export interface ZenFormSubmission {
  id: string;
  formId: string;
  submittedAt: string;
  data: Record<string, any>;
  submitterHandle?: string;
}

export interface ZenFormGoogleSheetsConfig {
  isConnected: boolean;
  connectedEmail?: string;
  connectedAt?: string;
  provider?: 'google' | 'github' | 'oauth';
  sheetId?: string;
  sheetUrl?: string;
  sheetTab?: string;
  webhookUrl?: string; // Direct Google Apps Script Webhook URL
  autoSync: boolean;
  lastSyncedAt?: string;
}

export interface ZenFormsAccountSheetsConfig {
  isConnected: boolean;
  userEmail: string;
  userId?: string;
  provider: 'google' | 'github';
  connectedAt: string;
  defaultSheetUrl?: string;
  defaultSheetId?: string;
  autoSyncAllForms: boolean;
}

export interface ZenForm {
  id: string;
  title: string;
  slug?: string;
  description: string;
  category: 'MUN_REGISTRATION' | 'EXECUTIVE_BOARD' | 'PRESS_CORPS' | 'FEEDBACK' | 'SURVEY' | 'GENERAL';
  theme: ZenFormTheme;
  customStyle?: ZenFormCustomStyle;
  fields: ZenFormField[];
  submitButtonText: string;
  successMessage: string;
  ownerHandle: string;
  submissionsCount: number;
  isPublished: boolean;
  allowAnonymous: boolean;
  acceptingResponses?: boolean;
  createdAt: string;
  updatedAt: string;
  googleSheetsConfig?: ZenFormGoogleSheetsConfig;
}
