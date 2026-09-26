'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  Share2,
  ArrowLeft,
  Sparkles,
  Shield,
  Send,
  Lock,
  Copy,
  Building2,
  AlertCircle,
  FileSpreadsheet,
  Calendar,
  Check,
  Star,
  Heart,
  ThumbsUp,
  Clock,
  Mail,
  Phone,
  Globe,
  UploadCloud,
  PenTool,
  Coins,
  Wrench,
  ChevronUp,
  ChevronDown,
  Award,
  RotateCcw,
  FileText,
  BarChart3,
  Layers,
  ChevronRight,
  QrCode,
  Ticket,
  ShieldCheck,
  Crown,
  Users,
  GraduationCap,
  Building,
  Cpu,
  Palette,
  Megaphone,
  TrendingUp,
  Briefcase,
  Camera,
  Compass,
  BookOpen,
  ExternalLink,
  Grid
} from 'lucide-react';
import { getZenFormById, recordZenFormSubmission } from '@/lib/formsStorage';
import { registerDelegate } from '@/lib/zenDiplomacyService';
import { ZenForm, ZenFormTheme, ZenFormField } from '@/types/forms';
import { useAuth } from '@/context/AuthContext';
import { getFontCssFamily, CARD_BORDER_RADIUS_MAP } from '@/lib/formsThemes';

export interface FormSection {
  index: number;
  title: string;
  description?: string;
  fields: ZenFormField[];
  stepHeading?: {
    enabled?: boolean;
    stepBadge?: string;
    stepNumber?: string;
    headingTitle?: string;
    description?: string;
  };
}

export interface SecretariatDept {
  id: string;
  index: string;
  name: string;
  label: string;
  badge: string;
  badgeColor: string;
  iconName: string;
  focus: string;
  responsibilities: string[];
  skills: string[];
  practicalTask: string;
}

export const SECRETARIAT_DEPARTMENTS: SecretariatDept[] = [
  {
    id: 'delegate-affairs',
    index: '01',
    name: 'Delegate Affairs',
    label: 'Delegate Affairs (Delegate relations, registrations & queries)',
    badge: 'DELEGATE RELATIONS',
    badgeColor: 'border-cyan-500/30 text-cyan-300 bg-cyan-500/10',
    iconName: 'Users',
    focus: 'Delegate experience, portfolio allocation & communications',
    responsibilities: [
      'Delegate communication & helpline',
      'Registration support & verification',
      'Portfolio allocation & preference matching'
    ],
    skills: ['Communication', 'Organisation', 'Patience', 'Problem-solving'],
    practicalTask: 'Simulated assessment: Outline how you would de-escalate and resolve a frustrated delegate complaint regarding a duplicate portfolio allotment 1 hour before committee begins.'
  },
  {
    id: 'academic-affairs',
    index: '02',
    name: 'Academic Affairs',
    label: 'Academic Affairs (Background guides, agendas & study materials)',
    badge: 'ACADEMIC EXCELLENCE',
    badgeColor: 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10',
    iconName: 'GraduationCap',
    focus: 'Academic excellence, background guides & committee quality',
    responsibilities: [
      'Committee agenda framing & crisis briefs',
      'Background guides & research dossiers curation',
      'Rules of Procedure (UN4MUN & Classical RoP) oversight'
    ],
    skills: ['Research', 'Writing', 'Critical thinking', 'MUN knowledge'],
    practicalTask: 'Simulated assessment: Review and propose 2 substantive improvements or crisis inflection points for an international territorial sovereignty committee agenda.'
  },
  {
    id: 'operations-logistics',
    index: '03',
    name: 'Operations & Logistics',
    label: 'Operations & Logistics (Flawless execution, room management & technical schedules)',
    badge: 'LOGISTICS & TIMETABLE',
    badgeColor: 'border-amber-500/30 text-amber-300 bg-amber-500/10',
    iconName: 'Building',
    focus: 'Flawless execution, room management & technical schedules',
    responsibilities: [
      'Digital assembly rooms allocation & access keys',
      'Virtual registration desk & verification flow',
      'Session timings, movement & caucus scheduling'
    ],
    skills: ['Organisation', 'Time management', 'Crisis management', 'Team coordination'],
    practicalTask: 'Simulated assessment: Solve a scheduling overlap where an unmoderated caucus overruns by 25 minutes while a joint crisis communique is waiting for presidential broadcast.'
  },
  {
    id: 'tech-affairs',
    index: '04',
    name: 'Tech Affairs',
    label: 'Tech Affairs (Platform bots, portals & live telemetry)',
    badge: 'PLATFORM INFRASTRUCTURE',
    badgeColor: 'border-sky-500/30 text-sky-300 bg-sky-500/10',
    iconName: 'Cpu',
    focus: 'Technology systems, digital infrastructure & platform bots',
    responsibilities: [
      'ZEN.DIPLOMACY web portal maintenance',
      'Real-time registration & sovereign matrix synchronization',
      'Digital attendance & QR security verification'
    ],
    skills: ['Next.js/React', 'UI/UX', 'Troubleshooting', 'APIs'],
    practicalTask: 'Simulated assessment: Describe your protocol for diagnosing and resolving a sudden socket / audio lag disconnect affecting 15 delegates in an active council chamber.'
  },
  {
    id: 'design-creative',
    index: '05',
    name: 'Design & Creative',
    label: 'Design & Creative (Visual assets, brochures & branding)',
    badge: 'CINEMATIC ART DIRECTION',
    badgeColor: 'border-purple-500/30 text-purple-300 bg-purple-500/10',
    iconName: 'Palette',
    focus: 'Visual identity, cinematic art direction & branding',
    responsibilities: [
      'Official social media creatives & motion graphics',
      'Official conference posters & delegate plaques',
      'Certificates of Merit & Delegation Accords'
    ],
    skills: ['Figma', 'Photoshop', 'Illustrator', 'Typography'],
    practicalTask: 'Simulated assessment: Provide a link to your design portfolio / Behance / Drive demonstrating typographic hierarchy and dark-mode brand consistency.'
  },
  {
    id: 'public-relations',
    index: '06',
    name: 'Public Relations (PR)',
    label: 'Public Relations (PR) (External partnerships & institutional outreach)',
    badge: 'DIPLOMATIC EXPANSION',
    badgeColor: 'border-rose-500/30 text-rose-300 bg-rose-500/10',
    iconName: 'Megaphone',
    focus: 'External partnerships, institutional outreach & media relations',
    responsibilities: [
      'School and university institutional outreach',
      'Faculty advisor & MUN circuit communication',
      'Media relations & press agency releases'
    ],
    skills: ['Communication', 'Public speaking', 'Networking', 'Negotiation'],
    practicalTask: 'Simulated assessment: Draft a 3-paragraph executive outreach invitation to a premier school’s MUN Faculty Advisor pitching a 15-delegate school delegation.'
  },
  {
    id: 'marketing-growth',
    index: '07',
    name: 'Marketing & Growth',
    label: 'Marketing & Growth (Reach, delegate acquisition & community engagement)',
    badge: 'GROWTH & REVENUE',
    badgeColor: 'border-lime-500/30 text-lime-300 bg-lime-500/10',
    iconName: 'TrendingUp',
    focus: 'Reach, delegate acquisition & community engagement',
    responsibilities: [
      'Multi-channel social media growth strategy',
      'Targeted delegate acquisition campaigns',
      'Editorial content calendars & announcement pacing'
    ],
    skills: ['Digital marketing', 'Social media strategy', 'Audience growth', 'Copywriting'],
    practicalTask: 'Simulated assessment: Outline a 7-day countdown growth campaign plan designed to drive 50+ delegate registrations from October 1st onwards.'
  },
  {
    id: 'content-editorial',
    index: '08',
    name: 'Content & Editorial',
    label: 'Content & Editorial (Written publications, conference gazette & journalism)',
    badge: 'PUBLICATIONS & GAZETTE',
    badgeColor: 'border-yellow-500/30 text-yellow-300 bg-yellow-500/10',
    iconName: 'FileText',
    focus: 'Written publications, conference gazette & journalism',
    responsibilities: [
      'Compelling social captions & long-form articles',
      'Official press releases & executive communiqués',
      'Daily conference reports & committee documentation'
    ],
    skills: ['Writing', 'Editing', 'Storytelling', 'Journalism'],
    practicalTask: 'Simulated assessment: Write a high-impact 120-word press announcement covering a dramatic deadlock break during UNSC midnight negotiations.'
  },
  {
    id: 'media-documentation',
    index: '09',
    name: 'Media & Documentation',
    label: 'Media & Documentation (Capturing the event: reels, interviews & video archive)',
    badge: 'PRESS & RECAPS',
    badgeColor: 'border-indigo-500/30 text-indigo-300 bg-indigo-500/10',
    iconName: 'Camera',
    focus: 'Capturing the event: reels, interviews & video archive',
    responsibilities: [
      'Video editing, reels & cinematic teasers',
      'Live photo capture, screenshot curation & audio logs',
      'Delegate and Executive Board spotlight interviews'
    ],
    skills: ['Premiere Pro / DaVinci / CapCut', 'Videography', 'Video editing', 'Composition'],
    practicalTask: 'Simulated assessment: Provide a link to your video reel or showreel, showing rhythm, audio synchronization, and color grading.'
  },
  {
    id: 'secretariat-admin',
    index: '10',
    name: 'Secretariat & Administration',
    label: 'Secretariat & Administration (Internal coordination & cross-department leadership)',
    badge: 'EXECUTIVE LEADERSHIP',
    badgeColor: 'border-white/30 text-white bg-white/10',
    iconName: 'Crown',
    focus: 'Internal coordination, cross-department leadership & operations',
    responsibilities: [
      'Cross-departmental project tracking & meeting agendas',
      'Secretariat task allocation & accountability oversight',
      'Internal documentation & master timetable enforcement'
    ],
    skills: ['Leadership', 'Organisation', 'Communication', 'Delegation'],
    practicalTask: 'Simulated assessment: How would you maintain morale and performance across two Secretariat departments facing conflicting deadlines 48 hours before the conference?'
  }
];

export interface CommitteeChamber {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  agenda: string;
  format: string;
  tags: string[];
}

export const COMMITTEE_CHAMBERS: CommitteeChamber[] = [
  {
    id: 'aippm',
    code: 'AIPPM',
    title: 'All India Political Parties Meet (AIPPM)',
    subtitle: 'National Parliamentary Council',
    badge: 'HISTORIC & POLICY COUNCIL',
    badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    agenda: 'Deliberation upon Comprehensive Constitutional, Electoral, Governance and Socio-Economic Reforms in India, with Focus on Delimitation, Representation and Reservation Reforms including Creamy Layer and NCL, Citizenship, Federalism, Public-Fund Accountability including PM CARES Fund, FCRA and Political Funding, Women’s Safety, SC/ST Protection, Criminal Justice, Police and Judicial Reforms, National Security, Examination Integrity and the Roadmap towards Viksit Bharat.',
    format: 'Moderated Parliamentary Debate & Legislative Bill Tabling',
    tags: ['Lok Sabha ROP', 'Crisis Inflections', 'Domestic Policy']
  },
  {
    id: 'education-ministry',
    code: 'EMI',
    title: 'Education Ministry of India (EMI)',
    subtitle: 'Special Ministerial Assembly',
    badge: 'MINISTERIAL OVERSIGHT',
    badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    agenda: 'Deliberation upon the Renewal and Reform of the National Education Policy 2020 towards a proposed National Education Policy 2026, with Particular Focus on Examination Integrity, Entrance Examinations, Curriculum and Assessment Reform, Coaching Regulation, School and Higher Education, Teacher Accountability, Digital and AI-Based Education, Skill Development, Accessibility, Student Welfare and Equal Educational Opportunity.',
    format: 'Sovereign Ministerial Council & Direct Policy Blueprints',
    tags: ['NEP 2026 Roadmap', 'Examination Integrity', 'Priority Allotment']
  },
  {
    id: 'ecosoc',
    code: 'ECOSOC',
    title: 'United Nations Economic and Social Council (ECOSOC)',
    subtitle: 'Principal UN Organ for Sustainable Development & Economic Cooperation',
    badge: 'MULTILATERAL DEVELOPMENT PLENARY',
    badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    agenda: 'Deliberation upon Building an Equitable and Sustainable Global Development Framework with Particular Focus on Poverty and Inequality, Development Financing, Debt Sustainability, Employment, Food and Energy Security, Climate-Resilient Development, Technology Access, Global Economic Cooperation and the Financing of the Sustainable Development Goals.',
    format: 'UN Rules of Procedure (ROP) & Draft Resolution Tabling',
    tags: ['SDGs Financing', 'Global South Cooperation', 'Equitable Development']
  },
  {
    id: 'unsc',
    code: 'UNSC',
    title: 'United Nations Security Council (UNSC)',
    subtitle: 'Flagship Crisis & Security Body',
    badge: 'CRISIS & SECURITY COUNCIL',
    badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    agenda: 'Deliberation upon the Evolving Global Security Landscape with Particular Focus on the Risk of Nuclear Escalation, Militarisation and Strategic Competition in the Arctic, Emerging Shipping Routes, Territorial and Maritime Disputes, Military Alliances, Resource Competition and the Erosion of International Security Mechanisms.',
    format: 'Continuous Crisis Procedure (CCP) & Presidential Directives',
    tags: ['P5 Veto Dynamics', 'Binding Directives', 'High Experience Tier']
  }
];

export const BANDWIDTH_TIERS = [
  {
    id: 'standard',
    label: '5–8 hours / week (Core tasks & weekly synces)',
    title: '5–8 Hours / Week',
    tier: 'STANDARD TRACK',
    desc: 'Attend weekly syncs, deliver departmental sprint tasks, and assist on assembly days.'
  },
  {
    id: 'recommended',
    label: '10–15 hours / week (Active departmental operations)',
    title: '10–15 Hours / Week',
    tier: 'RECOMMENDED TRACK',
    desc: 'Drive daily team execution, formulate dossiers, coordinate delegate queries and logistics.'
  },
  {
    id: 'executive',
    label: '15–20+ hours / week (Department Lead / Intensive)',
    title: '15–20+ Hours / Week',
    tier: 'LEADERSHIP TRACK',
    desc: 'Direct high-impact leadership, cross-department coordination and executive board briefings.'
  }
];

export const getDeptIcon = (iconName: string) => {
  switch (iconName) {
    case 'Users': return <Users className="w-5 h-5" />;
    case 'GraduationCap': return <GraduationCap className="w-5 h-5" />;
    case 'Wrench': return <Wrench className="w-5 h-5" />;
    case 'Cpu': return <Cpu className="w-5 h-5" />;
    case 'Palette': return <Palette className="w-5 h-5" />;
    case 'Megaphone': return <Megaphone className="w-5 h-5" />;
    case 'TrendingUp': return <TrendingUp className="w-5 h-5" />;
    case 'Building': return <Building className="w-5 h-5" />;
    case 'Camera': return <Camera className="w-5 h-5" />;
    case 'Crown': return <Crown className="w-5 h-5" />;
    case 'FileText': return <FileText className="w-5 h-5" />;
    default: return <Briefcase className="w-5 h-5" />;
  }
};

export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed);
};

export const isValidPhone = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') return false;
  const trimmed = phone.trim();
  if (!/^[+]?[(]?[0-9\s\-().]{7,20}$/.test(trimmed)) {
    return false;
  }
  const digits = trimmed.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
};

export default function ZenFormPublicPage() {
  const params = useParams();
  const router = useRouter();
  const { profile, user, isAuthenticated } = useAuth();
  
  const idOrSlug = (params?.id as string) || '';
  const [form, setForm] = useState<ZenForm | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSubId, setSubmittedSubId] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<{ total: number; earned: number; pct: number } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Group fields into pages by section_break
  const sections = React.useMemo<FormSection[]>(() => {
    if (!form) return [];
    const result: FormSection[] = [];
    let current: FormSection = {
      index: 0,
      title: form.title,
      description: form.description,
      fields: [],
      stepHeading: form.fields[0]?.stepHeading?.enabled ? form.fields[0].stepHeading : undefined,
    };

    for (const field of form.fields) {
      if (field.type === 'section_break') {
        if (current.fields.length > 0) {
          result.push(current);
          current = {
            index: result.length,
            title: field.label || field.sectionTitle || `Section ${result.length + 1}`,
            description: field.description || field.sectionDescription || '',
            fields: [],
            stepHeading: field.stepHeading?.enabled ? field.stepHeading : undefined,
          };
        } else {
          // If leading section_break before any inputs, inherit title/stepHeading to current section 0
          current.title = field.label || field.sectionTitle || current.title;
          current.description = field.description || field.sectionDescription || current.description;
          if (field.stepHeading?.enabled) {
            current.stepHeading = field.stepHeading;
          }
        }
      } else {
        current.fields.push(field);
        if (!current.stepHeading && field.stepHeading?.enabled) {
          current.stepHeading = field.stepHeading;
        }
      }
    }
    result.push(current);
    return result;
  }, [form]);

  useEffect(() => {
    if (idOrSlug) {
      const found = getZenFormById(idOrSlug);
      if (found) {
        setForm(found);
      } else {
        fetch(`/api/forms/${idOrSlug}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.form) setForm(data.form);
          })
          .catch(() => {});
      }
    }
  }, [idOrSlug]);

  if (!form) {
    return (
      <div className="min-h-screen bg-[#06080e] text-white flex flex-col items-center justify-center p-4 space-y-4">
        <h1 className="text-2xl font-bold font-display">ZenForm Not Found</h1>
        <p className="text-sm text-neutral-400 max-w-md text-center">
          The requested multilateral form ledger does not exist or has been archived.
        </p>
        <Link
          href="/forms"
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold transition shadow-lg"
        >
          Return to ZenForms Hub
        </Link>
      </div>
    );
  }

  // Theme preset mappings
  const themeStyles: Record<ZenFormTheme, {
    bg: string;
    border: string;
    accent: string;
    text: string;
    glow: string;
    accentHex: string;
    accentText: string;
  }> = {
    amber: {
      bg: 'from-[#131722] via-[#0c0f17] to-[#05070a]',
      border: 'border-amber-500/30',
      accent: 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20',
      text: 'text-amber-400',
      glow: 'bg-amber-500/10',
      accentHex: '#f59e0b',
      accentText: '#000000',
    },
    midnight: {
      bg: 'from-[#071326] via-[#040a14] to-[#02050a]',
      border: 'border-cyan-500/30',
      accent: 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/20',
      text: 'text-cyan-400',
      glow: 'bg-cyan-500/10',
      accentHex: '#06b6d4',
      accentText: '#000000',
    },
    obsidian: {
      bg: 'from-[#111111] via-[#090909] to-[#020202]',
      border: 'border-white/20',
      accent: 'bg-white hover:bg-neutral-200 text-black shadow-white/10',
      text: 'text-white',
      glow: 'bg-white/5',
      accentHex: '#ffffff',
      accentText: '#000000',
    },
    emerald: {
      bg: 'from-[#071710] via-[#040f0a] to-[#020604]',
      border: 'border-emerald-500/30',
      accent: 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20',
      text: 'text-emerald-300',
      glow: 'bg-emerald-500/10',
      accentHex: '#10b981',
      accentText: '#000000',
    },
    paper: {
      bg: 'from-[#18191c] via-[#121316] to-[#0c0d0f]',
      border: 'border-neutral-300/30',
      accent: 'bg-neutral-100 hover:bg-white text-black shadow-neutral-500/10',
      text: 'text-neutral-200',
      glow: 'bg-neutral-200/5',
      accentHex: '#e5e5e5',
      accentText: '#000000',
    },
    purple: {
      bg: 'from-[#150a21] via-[#0d0614] to-[#050209]',
      border: 'border-purple-500/30',
      accent: 'bg-purple-500 hover:bg-purple-400 text-white shadow-purple-500/20',
      text: 'text-purple-300',
      glow: 'bg-purple-500/10',
      accentHex: '#8b5cf6',
      accentText: '#ffffff',
    },
    custom: {
      bg: 'from-[#131722] via-[#0c0f17] to-[#05070a]',
      border: 'border-white/20',
      accent: 'bg-amber-500 hover:bg-amber-400 text-black',
      text: 'text-white',
      glow: 'bg-white/10',
      accentHex: '#f59e0b',
      accentText: '#000000',
    }
  };

  const currentTheme = themeStyles[form.theme] || themeStyles.amber;

  // Custom typography and styling
  const custom = form.customStyle || {};
  const displayFont = getFontCssFamily(custom.displayFont || 'Clash Display');
  const bodyFont = getFontCssFamily(custom.bodyFont || 'Inter');
  const accentColor = custom.accentColor || currentTheme.accentHex;
  const accentTextColor = custom.accentTextColor || currentTheme.accentText;
  const borderRadiusClass = CARD_BORDER_RADIUS_MAP[custom.borderRadius || 'xl'] || 'rounded-3xl';
  const ambientEffect = custom.ambientEffect || 'aurora';

  // Card glass style classes
  const getCardStyleClasses = () => {
    switch (custom.cardStyle) {
      case 'glass-frosted':
        return 'bg-white/[0.05] backdrop-blur-2xl border border-white/20 shadow-2xl';
      case 'cyber-neon':
        return 'bg-black/80 backdrop-blur-xl border shadow-2xl';
      case 'solid-dark':
        return 'bg-[#0a0c10] border border-white/10 shadow-2xl';
      case 'outline-minimal':
        return 'bg-black/30 backdrop-blur-md border-2 border-white/20 shadow-none';
      case 'glass-deep':
      default:
        return 'bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl';
    }
  };

  const validateSingleField = (field: ZenFormField, val: any): string | null => {
    if (['title_desc', 'image_block', 'video_block', 'section_break'].includes(field.type)) return null;

    const isEmail = field.type === 'email' || 
      field.id.toLowerCase().includes('email') || 
      field.label.toLowerCase().includes('email') || 
      field.label.toLowerCase().includes('gmail');

    const isPhone = field.type === 'phone' || 
      field.type === 'tel' || 
      field.id.toLowerCase().includes('phone') || 
      field.id.toLowerCase().includes('mobile') || 
      field.id.toLowerCase().includes('whatsapp') || 
      field.label.toLowerCase().includes('phone') || 
      field.label.toLowerCase().includes('mobile') || 
      field.label.toLowerCase().includes('whatsapp');

    // Required check
    if (field.required) {
      if (val === undefined || val === null || val === '') {
        return `Please complete the required question: "${field.label}"`;
      }
      if (Array.isArray(val) && val.length === 0) {
        return `Please select at least one option for: "${field.label}"`;
      }
    }

    // Strict format check for non-empty text
    if (val && typeof val === 'string' && val.trim() !== '') {
      if (isEmail && !isValidEmail(val)) {
        return `Please enter a valid email address (e.g. name@gmail.com) for: "${field.label}"`;
      }
      if (isPhone && !isValidPhone(val)) {
        return `Please enter a valid 10-digit mobile number (e.g. +91 98765 43210) for: "${field.label}"`;
      }
    }

    return null;
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    setValidationError(null);

    const targetField = form?.fields.find((f) => f.id === fieldId);
    if (targetField) {
      const err = validateSingleField(targetField, value);
      setFieldErrors((prev) => {
        const next = { ...prev };
        if (err) next[fieldId] = err;
        else delete next[fieldId];
        return next;
      });
    }
  };

  const handleFieldBlur = (fieldId: string) => {
    setTouchedFields((prev) => ({ ...prev, [fieldId]: true }));
    const targetField = form?.fields.find((f) => f.id === fieldId);
    if (targetField) {
      const err = validateSingleField(targetField, formData[fieldId]);
      setFieldErrors((prev) => {
        const next = { ...prev };
        if (err) next[fieldId] = err;
        else delete next[fieldId];
        return next;
      });
    }
  };

  const handleCheckboxToggle = (fieldId: string, option: string) => {
    const currentList: string[] = Array.isArray(formData[fieldId]) ? formData[fieldId] : [];
    const nextList = currentList.includes(option)
      ? currentList.filter((item) => item !== option)
      : [...currentList, option];
    handleInputChange(fieldId, nextList);
  };

  const handleNextPage = () => {
    const currentSec = sections[currentPageIndex];
    if (!currentSec) return;

    for (const field of currentSec.fields) {
      const val = formData[field.id];
      const err = validateSingleField(field, val);
      if (err) {
        setFieldErrors((prev) => ({ ...prev, [field.id]: err }));
        setValidationError(err);
        return;
      }
    }

    setValidationError(null);
    setCurrentPageIndex((prev) => Math.min(prev + 1, sections.length - 1));
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    setValidationError(null);
    setCurrentPageIndex((prev) => Math.max(prev - 1, 0));
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If multi-page and not on the last page, act as Next
    if (sections.length > 1 && currentPageIndex < sections.length - 1) {
      handleNextPage();
      return;
    }

    // Check all required fields across all sections with strict format validation
    for (const sec of sections) {
      for (const field of sec.fields) {
        const val = formData[field.id];
        const err = validateSingleField(field, val);
        if (err) {
          setFieldErrors((prev) => ({ ...prev, [field.id]: err }));
          setValidationError(err);
          if (sec.index !== currentPageIndex) {
            setCurrentPageIndex(sec.index);
          }
          return;
        }
      }
    }

    setIsSubmitting(true);
    try {
      const submitter = profile?.username || user?.email?.split('@')[0] || 'anonymous';
      const submission = await recordZenFormSubmission(form.id, formData, submitter);
      setSubmittedSubId(submission.id);

      // If this is the ZEN.DIPLOMACY MUN delegate registration form, record in sovereign delegate ledger
      const isMunForm = 
        form.id === 'zen-diplomacy-2026-registration' ||
        form.id === 'zen-diplomacy-2026' ||
        form.slug === 'zen-diplomacy-2026' ||
        form.category === 'MUN_REGISTRATION' ||
        (form.title && form.title.toLowerCase().includes('diplomacy'));

      if (isMunForm) {
        try {
          await registerDelegate({
            name: formData['step1_fullname'] || submitter || 'Delegate',
            email: formData['step1_email'] || user?.email || '',
            phone: formData['step1_phone'] || '',
            institution: formData['step1_institution'] || '',
            experienceLevel: formData['step2_experience_level'] || '',
            firstCommitteeChoice: formData['step3_primary_committee'] || '',
            secondCommitteeChoice: formData['step4_secondary_committee'] || '',
            portfolioPreferences: formData['step5_portfolios'] || '',
          });
        } catch (munErr) {
          console.warn('[MUN-REGISTRATION-AUTO-SYNC-WARN]', munErr);
        }
      }

      // Calculate Quiz score if Quiz mode
      if (form.settings?.isQuiz) {
        let total = 0;
        let earned = 0;
        form.fields.forEach((f) => {
          if (f.points && f.points > 0) {
            total += f.points;
            const ans = formData[f.id];
            if (Array.isArray(f.correctAnswer)) {
              if (Array.isArray(ans) && ans.length === f.correctAnswer.length && ans.every((x) => f.correctAnswer!.includes(x))) {
                earned += f.points;
              }
            } else if (f.correctAnswer && ans === f.correctAnswer) {
              earned += f.points;
            }
          }
        });
        setQuizScore({ total, earned, pct: total > 0 ? Math.round((earned / total) * 100) : 0 });
      }

      // Server-side robust dispatch to Google Sheets webhook
      const webhookUrl = form.googleSheetsConfig?.webhookUrl || 'https://script.google.com/macros/s/AKfycbwMJVccvxnhbk13ppFVu44gpA9cZ95nR1oojq-c4P1r6YWK45hKp0f3Tydk4RJO6v0Q/exec';
      const isSecForm = form.id.includes('secretariat') || form.slug?.includes('secretariat');
      
      let committeeTab = '';
      if (!isSecForm && isMunForm) {
        const commChoice = String(formData['step3_primary_committee'] || '').toUpperCase();
        if (commChoice.includes('AIPPM')) committeeTab = 'AIPPM';
        else if (commChoice.includes('EMI') || commChoice.includes('EDUCATION')) committeeTab = 'EMI';
        else if (commChoice.includes('UNSC')) committeeTab = 'UNSC';
        else if (commChoice.includes('ECOSOC') || commChoice.includes('UNODC') || commChoice.includes('UNESCO')) committeeTab = 'ECOSOC';
      }

      const targetSheetTab = form.googleSheetsConfig?.sheetTab || (isSecForm ? 'Secretariat Applications' : (committeeTab || 'ZEN DIPLOMACY MUN'));

      try {
        await fetch('/api/forms/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            formId: form.id,
            formSlug: form.slug,
            formTitle: form.title,
            submissionId: submission.id,
            submittedAt: submission.submittedAt,
            data: formData,
            submitterHandle: submitter,
            sheetTab: targetSheetTab,
            targetTab: targetSheetTab,
            webhookUrl: webhookUrl,
          }),
        });
      } catch (submitErr) {
        console.warn('[SERVER-DISPATCH-WARN]', submitErr);
      }

      // Fallback direct browser dispatch to Google Apps Script
      if (webhookUrl && form.settings?.autoForwardSheets !== false) {
        try {
          fetch(webhookUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'add_row',
              formId: form.id,
              formTitle: form.title,
              timestamp: new Date().toISOString(),
              submitterHandle: submitter,
              sheetTab: targetSheetTab,
              targetTab: targetSheetTab,
              ...formData,
            }),
          }).catch(() => {});
        } catch {}
      }
    } catch {
      setValidationError('Failed to record submission. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div
      className="min-h-screen text-neutral-200 p-4 sm:p-8 flex flex-col justify-between relative overflow-x-hidden selection:bg-white/20 text-left transition-colors duration-500"
      style={{
        fontFamily: bodyFont,
        backgroundColor: custom.bgType === 'solid' ? (custom.bgSolidColor || '#06080e') : undefined,
        background: custom.bgType === 'gradient' && custom.bgGradient ? custom.bgGradient : undefined,
      }}
    >
      {/* ── Gradient Background fallback ── */}
      {(!custom.bgType || custom.bgType === 'gradient') && !custom.bgGradient && (
        <div className={`fixed inset-0 pointer-events-none z-0 bg-gradient-to-b ${currentTheme.bg}`} />
      )}

      {/* ── Background Image Layer (if configured) ── */}
      {custom.bgType === 'image' && custom.bgImageUrl && (
        <div
          className="fixed inset-0 pointer-events-none bg-cover bg-center z-0 transition-opacity"
          style={{
            backgroundImage: `url(${custom.bgImageUrl})`,
            filter: `blur(${custom.bgBlur || 0}px)`,
            transform: custom.bgBlur ? 'scale(1.05)' : undefined,
          }}
        />
      )}

      {/* ── Background Overlay Tint ── */}
      {custom.bgType === 'image' && (
        <div
          className="fixed inset-0 pointer-events-none z-0 bg-black"
          style={{ opacity: (custom.bgOverlayOpacity ?? 75) / 100 }}
        />
      )}

      {/* ── Ambient Effects ── */}
      {ambientEffect === 'aurora' && (
        <>
          <div
            className="fixed top-0 right-1/4 w-[550px] h-[550px] blur-[150px] pointer-events-none rounded-full z-0 opacity-70 animate-pulse"
            style={{ backgroundColor: `${accentColor}25` }}
          />
          <div
            className="fixed bottom-10 left-10 w-[450px] h-[450px] blur-[140px] pointer-events-none rounded-full z-0 opacity-50"
            style={{ backgroundColor: `${accentColor}15` }}
          />
        </>
      )}

      {ambientEffect === 'grid' && (
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-15"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      )}

      {ambientEffect === 'dots' && (
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      )}

      {/* ── Top Header Bar ── */}
      <div className="max-w-4xl lg:max-w-5xl mx-auto w-full flex items-center justify-between py-4 border-b border-white/10 relative z-10 px-2 sm:px-0">
        <Link
          href="/forms"
          className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All ZenForms Hub</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            <Shield className="w-3 h-3 text-cyan-400" />
            <span>Sovereign Ledger Protected</span>
          </span>

          <Link
            href="/matrix"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:text-white transition"
            title="Open Live Matrix Ledger"
          >
            <Grid className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Live Dais Matrix</span>
          </Link>

          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-neutral-300 transition cursor-pointer"
          >
            {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* ── Main Form Box ── */}
      <main className="max-w-4xl lg:max-w-5xl mx-auto w-full my-6 sm:my-8 relative z-10 space-y-6">
        
        {form.acceptingResponses === false ? (
          <div className={`p-8 sm:p-12 ${borderRadiusClass} ${getCardStyleClasses()} text-center space-y-4`}>
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight" style={{ fontFamily: displayFont }}>
              This form is no longer accepting responses
            </h2>
            <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
              Submissions have concluded for this form. If you believe this is an error, please reach out to the form administrator.
            </p>
            <div className="pt-2">
              <Link
                href="/forms"
                className="inline-block px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs transition"
              >
                Return to ZenForms Hub
              </Link>
            </div>
          </div>
        ) : submittedSubId ? (
          <div className={`p-8 sm:p-12 ${borderRadiusClass} ${getCardStyleClasses()} text-center space-y-6 animate-fade-in`}>
            <div
              className="w-16 h-16 rounded-full mx-auto flex items-center justify-center border"
              style={{
                backgroundColor: `${accentColor}20`,
                borderColor: `${accentColor}50`,
                color: accentColor,
              }}
            >
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight"
                style={{ fontFamily: displayFont }}
              >
                Submission Confirmed
              </h2>
              <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                {form.successMessage || 'Your response has been cryptographically recorded on the Zenvitra ledger.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 max-w-md mx-auto text-left font-mono text-xs space-y-1">
              <div className="text-[10px] text-neutral-500 uppercase">Verification Reference ID</div>
              <div className="font-bold truncate" style={{ color: accentColor }}>{submittedSubId}</div>
              <div className="text-[10px] text-neutral-500 pt-1">
                Recorded: {new Date().toLocaleString()} &bull; Sovereign Ledger
              </div>
            </div>

            {/* Quiz Score Result (if Quiz mode enabled) */}
            {quizScore && (
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1.5 max-w-md mx-auto animate-fadeIn">
                <div className="flex items-center justify-center gap-1.5 text-xs font-mono uppercase text-amber-400 font-bold">
                  <Award className="w-4 h-4" />
                  <span>Assessment Score</span>
                </div>
                <div className="text-3xl font-black text-white font-mono">
                  {quizScore.earned} / {quizScore.total}{' '}
                  <span className="text-sm font-normal text-amber-300">({quizScore.pct}%)</span>
                </div>
              </div>
            )}

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/matrix"
                target="_blank"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 font-mono text-xs transition flex items-center justify-center gap-2 border border-cyan-500/30 shadow-sm"
              >
                <Grid className="w-3.5 h-3.5 text-cyan-400" />
                <span>View Live Dais Matrix</span>
              </Link>

              {(form.settings?.showSubmitAnotherLink ?? true) && (
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedSubId(null);
                    setFormData({});
                    setQuizScore(null);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-mono text-xs transition cursor-pointer"
                >
                  Submit Another Response
                </button>
              )}
              <Link
                href="/forms"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md"
                style={{
                  backgroundColor: accentColor,
                  color: accentTextColor,
                }}
              >
                <span>Return to ZenForms Hub</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Form Entry Card */
          <div
            className={`overflow-hidden ${borderRadiusClass} ${getCardStyleClasses()} transition-all`}
            style={{
              borderColor: custom.cardStyle === 'cyber-neon' ? `${accentColor}60` : undefined,
              boxShadow: custom.cardStyle === 'cyber-neon' ? `0 0 35px ${accentColor}25` : undefined,
            }}
          >
            {/* ── Optional Cover Image ── */}
            {custom.coverImageUrl && (
              <div className="w-full h-44 sm:h-56 overflow-hidden relative border-b border-white/10">
                <img
                  src={custom.coverImageUrl}
                  alt={form.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
            )}

            {/* ── Progress Bar (if enabled in settings) ── */}
            {(() => {
              if (form.settings?.showProgressBar === false) return null;
              const nonContent = form.fields.filter(
                (f) => !['title_desc', 'image_block', 'video_block', 'section_break'].includes(f.type)
              );
              const done = nonContent.filter((f) => {
                const v = formData[f.id];
                if (v === undefined || v === null || v === '') return false;
                if (Array.isArray(v) && v.length === 0) return false;
                return true;
              }).length;
              const pct = nonContent.length > 0 ? Math.round((done / nonContent.length) * 100) : 0;
              return (
                <div className="border-b border-white/10 bg-white/[0.02]">
                  <div className="px-6 sm:px-10 py-2.5 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                    <div className="flex items-center gap-2">
                      <span>Intake Progress</span>
                      {sections.length > 1 && (
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-white font-bold text-[10px]">
                          Page {currentPageIndex + 1} of {sections.length}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span>{done} of {nonContent.length} answered</span>
                      <div className="w-20 sm:w-28 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct}%`, backgroundColor: accentColor }}
                        />
                      </div>
                      <span className="text-white font-bold">{pct}%</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="p-6 sm:p-10 space-y-8">
              {/* Form Title & Description Header (Page 1 vs Page 2+) */}
              {currentPageIndex === 0 ? (
                <div className="space-y-4 border-b border-white/10 pb-6 relative">
                  {/* Optional Logo / Crest */}
                  {custom.logoUrl && (
                    <div className="w-16 h-16 rounded-2xl p-1 bg-black/60 border border-white/20 shadow-xl overflow-hidden mb-2">
                      <img
                        src={custom.logoUrl}
                        alt="Form Crest"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2">
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider border"
                      style={{
                        backgroundColor: `${accentColor}15`,
                        borderColor: `${accentColor}40`,
                        color: accentColor,
                      }}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{form.category.replace('_', ' ')}</span>
                    </div>

                    {sections.length > 1 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-white text-[10px] font-mono font-bold">
                        Section 1 of {sections.length}
                      </span>
                    )}

                    <span className="inline-flex sm:hidden items-center gap-1 text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                      <Shield className="w-2.5 h-2.5 text-cyan-400" />
                      <span>Sovereign Ledger</span>
                    </span>
                  </div>

                  <h1
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15]"
                    style={{ fontFamily: displayFont }}
                  >
                    {form.title}
                  </h1>

                  {form.description && (
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                      {form.description}
                    </p>
                  )}

                  {/* Cross-Link Ribbon between Delegate and Secretariat forms */}
                  {form.slug === 'zen-diplomacy-2026' && (
                    <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-purple-500/10 border border-purple-500/25 text-xs text-purple-200">
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-purple-400 shrink-0" />
                        <span>Applying for the <strong>Secretariat or Executive Board</strong> instead?</span>
                      </div>
                      <Link
                        href="/forms/zen-secretariat-2026"
                        className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-mono text-[11px] font-bold border border-purple-500/40 transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open Secretariat Form</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}

                  {form.slug === 'zen-secretariat-2026' && (
                    <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Looking for <strong>Delegate Committee Registration</strong> instead?</span>
                      </div>
                      <Link
                        href="/forms/zen-diplomacy-2026"
                        className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono text-[11px] font-bold border border-amber-500/40 transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open Delegate Form</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}

                  {/* Top Step Headings Ribbon for Step 1 */}
                  {sections[0]?.stepHeading?.enabled && (
                    <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/[0.08] via-white/[0.02] to-transparent border border-amber-500/30 space-y-2 relative overflow-hidden shadow-lg animate-fadeIn text-left">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span 
                          className="px-3 py-1 rounded-full text-black font-mono text-[10px] font-black uppercase tracking-wider shadow-sm"
                          style={{ backgroundColor: accentColor }}
                        >
                          {sections[0].stepHeading.stepBadge || 'STEP 1'}
                        </span>
                        {sections[0].stepHeading.stepNumber && (
                          <span className="text-amber-300 font-mono text-xs font-semibold uppercase tracking-wider">
                            {sections[0].stepHeading.stepNumber}
                          </span>
                        )}
                        <span className="text-neutral-500 text-xs font-mono ml-auto">
                          Page 1 of {sections.length}
                        </span>
                      </div>
                      {sections[0].stepHeading.headingTitle && (
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug" style={{ fontFamily: displayFont }}>
                          {sections[0].stepHeading.headingTitle}
                        </h2>
                      )}
                      {sections[0].stepHeading.description && (
                        <p className="text-xs text-neutral-300 leading-relaxed font-normal">
                          {sections[0].stepHeading.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* Page 2+ Section Header with Top Step Headings Ribbon */
                <div className="space-y-4 border-b border-white/10 pb-6 relative animate-fadeIn text-left">
                  {sections[currentPageIndex]?.stepHeading?.enabled ? (
                    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/[0.08] via-white/[0.02] to-transparent border border-amber-500/30 space-y-2.5 relative overflow-hidden shadow-lg">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span 
                          className="px-3 py-1 rounded-full text-black font-mono text-[10px] font-black uppercase tracking-wider shadow-sm"
                          style={{ backgroundColor: accentColor }}
                        >
                          {sections[currentPageIndex].stepHeading?.stepBadge || `STEP ${currentPageIndex + 1}`}
                        </span>
                        {sections[currentPageIndex].stepHeading?.stepNumber && (
                          <span className="text-amber-300 font-mono text-xs font-semibold uppercase tracking-wider">
                            {sections[currentPageIndex].stepHeading?.stepNumber}
                          </span>
                        )}
                        <span className="text-neutral-500 text-xs font-mono ml-auto">
                          Page {currentPageIndex + 1} of {sections.length}
                        </span>
                      </div>
                      <h2
                        className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-snug"
                        style={{ fontFamily: displayFont }}
                      >
                        {sections[currentPageIndex].stepHeading?.headingTitle || sections[currentPageIndex]?.title}
                      </h2>
                      {(sections[currentPageIndex].stepHeading?.description || sections[currentPageIndex]?.description) && (
                        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                          {sections[currentPageIndex].stepHeading?.description || sections[currentPageIndex]?.description}
                        </p>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-2">
                        <div
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider border"
                          style={{
                            backgroundColor: `${accentColor}15`,
                            borderColor: `${accentColor}40`,
                            color: accentColor,
                          }}
                        >
                          <Layers className="w-3 h-3" />
                          <span>Section {currentPageIndex + 1} of {sections.length}</span>
                        </div>
                        <span className="text-[11px] font-mono text-neutral-400 truncate max-w-[200px]">
                          {form.title}
                        </span>
                      </div>

                      <h2
                        className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-snug"
                        style={{ fontFamily: displayFont }}
                      >
                        {sections[currentPageIndex]?.title}
                      </h2>

                      {sections[currentPageIndex]?.description && (
                        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                          {sections[currentPageIndex]?.description}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Validation Notice */}
              {validationError && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-mono animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Fields List for Current Section / Page */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {(sections[currentPageIndex]?.fields || []).map((field) => {
                  // 1. Title & Description Block
                  if (field.type === 'title_desc') {
                    if (field.id === 'step15_payment_instruction' || field.label?.toLowerCase().includes('upi payment')) {
                      return (
                        <div key={field.id} className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-amber-500/[0.12] via-[#090d18] to-black border border-amber-500/30 space-y-5 shadow-2xl relative overflow-hidden text-left">
                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3.5">
                            <div className="flex items-center gap-2 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
                              <QrCode className="w-4 h-4 text-amber-400" />
                              <span>Official Foundation UPI Payment Gateway</span>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold">
                              Zero Surcharge &bull; Instant Verification
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
                            {/* Visual QR Card */}
                            <div className="p-3.5 rounded-2xl bg-white flex flex-col items-center justify-center text-center shadow-xl mx-auto sm:mx-0 w-36 h-36">
                              <QrCode className="w-24 h-24 text-black" />
                              <span className="font-mono text-[9px] font-black text-black uppercase tracking-wider mt-1">zenvitra@upi</span>
                            </div>

                            {/* Beneficiary Details & 1-Click Copy */}
                            <div className="sm:col-span-2 space-y-3 font-mono">
                              <div>
                                <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Beneficiary Entity:</span>
                                <p className="text-white font-bold text-sm sm:text-base font-display">ZENVITRA FOUNDATION</p>
                              </div>

                              <div className="space-y-1">
                                <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Official VPA / UPI ID:</span>
                                <div className="flex items-center gap-2">
                                  <div className="px-3.5 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-bold select-all flex-1 truncate font-mono">
                                    zenvitra@upi
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (typeof window !== 'undefined') {
                                        navigator.clipboard.writeText('zenvitra@upi');
                                        setCopiedUpi(true);
                                        setTimeout(() => setCopiedUpi(false), 2000);
                                      }
                                    }}
                                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-md"
                                  >
                                    {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    <span>{copiedUpi ? 'Copied!' : 'Copy UPI'}</span>
                                  </button>
                                </div>
                              </div>

                              <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                                Pay via Google Pay, PhonePe, Paytm, or BHIM. After payment, enter your <strong className="text-white font-mono">12-Digit UTR Number</strong> in the field below to verify and lock your seat.
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={field.id} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                        <h3 className="text-lg sm:text-xl font-bold text-white" style={{ fontFamily: displayFont }}>
                          {field.label}
                        </h3>
                        {field.description && (
                          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                            {field.description}
                          </p>
                        )}
                      </div>
                    );
                  }

                  // 2. Image Block
                  if (field.type === 'image_block') {
                    return (
                      <div key={field.id} className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden space-y-3 p-4">
                        {field.mediaUrl && (
                          <img src={field.mediaUrl} alt={field.label} className="w-full rounded-xl object-cover max-h-96" />
                        )}
                        {field.label && <h4 className="text-sm font-semibold text-white px-1">{field.label}</h4>}
                        {field.description && <p className="text-xs text-neutral-400 px-1">{field.description}</p>}
                      </div>
                    );
                  }

                  // 3. Video Block
                  if (field.type === 'video_block') {
                    let embedUrl = '';
                    if (field.videoUrl) {
                      const match = field.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
                      if (match && match[1]) embedUrl = `https://www.youtube-nocookie.com/embed/${match[1]}`;
                    }
                    return (
                      <div key={field.id} className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden space-y-3 p-4">
                        {embedUrl && (
                          <div className="aspect-video w-full rounded-xl overflow-hidden">
                            <iframe src={embedUrl} title={field.label} className="w-full h-full border-0" allowFullScreen />
                          </div>
                        )}
                        {field.label && <h4 className="text-sm font-semibold text-white px-1">{field.label}</h4>}
                      </div>
                    );
                  }

                  // 4. Section Break
                  if (field.type === 'section_break') {
                    return (
                      <div key={field.id} className="pt-6 border-t-2 border-dashed border-white/20 my-6">
                        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200">
                          <h4 className="text-base font-bold uppercase tracking-wider">{field.label}</h4>
                          {field.description && <p className="text-xs text-neutral-300 pt-1">{field.description}</p>}
                        </div>
                      </div>
                    );
                  }

                  // Standard & Advanced Question Cards
                  return (
                    <div key={field.id} className="space-y-2 p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <label className="text-xs sm:text-sm font-medium text-white flex items-center gap-1.5 flex-1">
                          <span>{field.label}</span>
                          {field.required && <span className="text-rose-400 font-bold">*</span>}
                        </label>

                        {form.settings?.isQuiz && field.points !== undefined && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold shrink-0">
                            {field.points} pts
                          </span>
                        )}
                      </div>

                      {field.description && (
                        <p className="text-[11px] text-neutral-400 font-normal leading-relaxed">
                          {field.description}
                        </p>
                      )}

                      {/* 1. Short Text */}
                      {(field.type === 'text' || field.type === 'short_answer') && (
                        <div>
                          <input
                            type="text"
                            placeholder={field.placeholder || 'Your answer'}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            onBlur={() => handleFieldBlur(field.id)}
                            className={`w-full px-4 py-3 rounded-xl bg-black/40 border ${
                              fieldErrors[field.id]
                                ? 'border-rose-500 bg-rose-500/[0.04] focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                                : 'border-white/15 focus:border-amber-400/80'
                            } text-white text-xs sm:text-sm focus:outline-none transition shadow-inner font-sans`}
                          />
                          {fieldErrors[field.id] && (
                            <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 rounded-lg">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                              <span>{fieldErrors[field.id]}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 2. Email */}
                      {field.type === 'email' && (
                        <div>
                          <div className="relative">
                            <input
                              type="email"
                              placeholder={field.placeholder || 'name@gmail.com'}
                              value={formData[field.id] || ''}
                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                              onBlur={() => handleFieldBlur(field.id)}
                              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border ${
                                fieldErrors[field.id]
                                  ? 'border-rose-500 bg-rose-500/[0.04] focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                                  : 'border-white/15 focus:border-amber-400/80'
                              } text-white text-xs sm:text-sm focus:outline-none transition shadow-inner font-sans`}
                            />
                            <Mail className={`w-4 h-4 absolute left-3.5 top-3.5 pointer-events-none ${fieldErrors[field.id] ? 'text-rose-400' : 'text-neutral-500'}`} />
                          </div>
                          {fieldErrors[field.id] && (
                            <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 rounded-lg">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                              <span>{fieldErrors[field.id]}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 3. Telephone / Phone */}
                      {(field.type === 'tel' || field.type === 'phone') && (
                        <div>
                          <div className="relative">
                            <input
                              type="tel"
                              placeholder={field.placeholder || '+91 98765 43210'}
                              value={formData[field.id] || ''}
                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                              onBlur={() => handleFieldBlur(field.id)}
                              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border ${
                                fieldErrors[field.id]
                                  ? 'border-rose-500 bg-rose-500/[0.04] focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                                  : 'border-white/15 focus:border-amber-400/80'
                              } text-white text-xs sm:text-sm focus:outline-none transition shadow-inner font-mono`}
                            />
                            <Phone className={`w-4 h-4 absolute left-3.5 top-3.5 pointer-events-none ${fieldErrors[field.id] ? 'text-rose-400' : 'text-neutral-500'}`} />
                          </div>
                          {fieldErrors[field.id] && (
                            <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 rounded-lg">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                              <span>{fieldErrors[field.id]}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 4. Website / URL */}
                      {field.type === 'url' && (
                        <div>
                          <div className="relative">
                            <input
                              type="url"
                              placeholder={field.placeholder || 'https://...'}
                              value={formData[field.id] || ''}
                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                              onBlur={() => handleFieldBlur(field.id)}
                              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border ${
                                fieldErrors[field.id]
                                  ? 'border-rose-500 bg-rose-500/[0.04] focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                                  : 'border-white/15 focus:border-amber-400/80'
                              } text-white text-xs sm:text-sm focus:outline-none transition shadow-inner font-sans`}
                            />
                            <Globe className={`w-4 h-4 absolute left-3.5 top-3.5 pointer-events-none ${fieldErrors[field.id] ? 'text-rose-400' : 'text-neutral-500'}`} />
                          </div>
                          {fieldErrors[field.id] && (
                            <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 rounded-lg">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                              <span>{fieldErrors[field.id]}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 5. Number */}
                      {field.type === 'number' && (
                        <div>
                          <input
                            type="number"
                            placeholder={field.placeholder || '0'}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            onBlur={() => handleFieldBlur(field.id)}
                            className={`w-full px-4 py-3 rounded-xl bg-black/40 border ${
                              fieldErrors[field.id]
                                ? 'border-rose-500 bg-rose-500/[0.04] focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                                : 'border-white/15 focus:border-amber-400/80'
                            } text-white text-xs sm:text-sm focus:outline-none transition shadow-inner font-mono`}
                          />
                          {fieldErrors[field.id] && (
                            <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 rounded-lg">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                              <span>{fieldErrors[field.id]}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 6. Date */}
                      {field.type === 'date' && (
                        <div className="relative">
                          <input
                            type="date"
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400/80 text-white text-xs sm:text-sm focus:outline-none transition shadow-inner font-mono cursor-pointer"
                          />
                        </div>
                      )}

                      {/* 7. Time */}
                      {field.type === 'time' && (
                        <div className="relative">
                          <input
                            type="time"
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400/80 text-white text-xs sm:text-sm focus:outline-none transition shadow-inner font-mono cursor-pointer"
                          />
                        </div>
                      )}

                      {/* 8. Paragraph / Textarea */}
                      {(field.type === 'textarea' || field.type === 'paragraph') && (
                        <div className="space-y-3">
                          {/* Live Dais Matrix Peeker HUD for Delegate Portfolios */}
                          {field.id === 'step5_portfolios' && (
                            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-cyan-500/10 border border-amber-500/30 space-y-3 shadow-lg">
                              <div className="flex flex-wrap items-center justify-between gap-2.5">
                                <div className="flex items-center gap-2">
                                  <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                  </span>
                                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-300">
                                    Live Dais Matrix HUD &bull; Vacancy Peeker
                                  </span>
                                </div>
                                <Link
                                  href="/matrix"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-[10px] font-bold transition shadow-sm cursor-pointer"
                                >
                                  <Grid className="w-3.5 h-3.5" />
                                  <span>Open Live Matrix in New Tab</span>
                                  <ExternalLink className="w-3 h-3 ml-0.5" />
                                </Link>
                              </div>
                              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                                Inspect live occupancy across <strong>AIPPM, EMI, ECOSOC & UNSC</strong> on the sovereign ledger before entering your preferences. Cross-reference vacant countries, portfolios, or ministerial seats to guarantee allotment priority.
                              </p>
                              <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-neutral-400">
                                <span className="px-2.5 py-1 rounded bg-black/40 border border-white/10 text-neutral-300">
                                  Recommended format: 1. Country / Seat, 2. Country / Seat, 3. Country / Seat
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Dynamic Secretariat Practical Simulation Challenge HUD */}
                          {field.id === 'step3_practical_response' && (() => {
                            const chosenDeptStr = formData['step1_primary_sector'] || '';
                            const matchedDept = SECRETARIAT_DEPARTMENTS.find(d => 
                              chosenDeptStr.toLowerCase().includes(d.name.toLowerCase()) || 
                              d.label.toLowerCase() === chosenDeptStr.toLowerCase()
                            );
                            return (
                              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-500/15 via-purple-500/5 to-cyan-500/10 border border-purple-500/30 space-y-2.5 shadow-lg">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                                    <span>Department Simulation Brief &bull; {matchedDept ? matchedDept.name : 'Selected Department'}</span>
                                  </span>
                                  {matchedDept && (
                                    <span className={`text-[9px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${matchedDept.badgeColor}`}>
                                      {matchedDept.badge}
                                    </span>
                                  )}
                                </div>
                                <div className="p-3 rounded-xl bg-black/40 border border-purple-500/20 text-xs text-purple-100 font-sans leading-relaxed">
                                  {matchedDept ? matchedDept.practicalTask : 'Simulated assessment: Formulate a concrete strategy and actionable execution protocol for high-pressure conference scenarios in your chosen department.'}
                                </div>
                                <div className="text-[10px] font-mono text-neutral-400">
                                  Deliver your concrete operational strategy, rapid-response protocol, or execution blueprint below.
                                </div>
                              </div>
                            );
                          })()}

                          <textarea
                            rows={4}
                            placeholder={field.placeholder || 'Enter your detailed thoughts...'}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            onBlur={() => handleFieldBlur(field.id)}
                            className={`w-full min-h-[110px] p-4 rounded-xl bg-black/40 border ${
                              fieldErrors[field.id]
                                ? 'border-rose-500 bg-rose-500/[0.04] focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                                : 'border-white/15 focus:border-amber-400/80'
                            } text-white text-xs sm:text-sm focus:outline-none transition shadow-inner leading-relaxed font-sans`}
                          />
                          {fieldErrors[field.id] && (
                            <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 rounded-lg">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                              <span>{fieldErrors[field.id]}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 9. Linear Scale (Likert) */}
                      {field.type === 'linear_scale' && (
                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between gap-1 sm:gap-2">
                            {Array.from({
                              length: (field.scaleMax ?? 5) - (field.scaleMin ?? 1) + 1,
                            }).map((_, i) => {
                              const val = (field.scaleMin ?? 1) + i;
                              const isSelected = formData[field.id] === val;
                              return (
                                <button
                                  type="button"
                                  key={val}
                                  onClick={() => handleInputChange(field.id, val)}
                                  className={`flex-1 py-3 sm:py-3.5 rounded-xl border font-mono text-xs sm:text-sm font-bold transition flex items-center justify-center cursor-pointer ${
                                    isSelected
                                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400/30 scale-105'
                                      : 'border-white/10 bg-black/40 text-neutral-300 hover:border-white/25 hover:bg-white/5'
                                  }`}
                                  style={isSelected ? { borderColor: accentColor, color: accentColor } : {}}
                                >
                                  {val}
                                </button>
                              );
                            })}
                          </div>
                          {(field.scaleMinLabel || field.scaleMaxLabel) && (
                            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 px-1">
                              <span>{field.scaleMinLabel || ''}</span>
                              <span>{field.scaleMaxLabel || ''}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 10. Rating (Stars / Hearts / Numbers) */}
                      {field.type === 'rating' && (
                        <div className="flex items-center gap-2 pt-2">
                          {Array.from({ length: field.ratingMax ?? 5 }).map((_, i) => {
                            const starVal = i + 1;
                            const isFilled = (formData[field.id] || 0) >= starVal;
                            return (
                              <button
                                type="button"
                                key={starVal}
                                onClick={() => handleInputChange(field.id, starVal)}
                                className="p-2 rounded-xl transition hover:scale-125 cursor-pointer"
                              >
                                {field.ratingIcon === 'heart' ? (
                                  <Heart
                                    className={`w-7 h-7 transition ${
                                      isFilled ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'
                                    }`}
                                    style={isFilled ? { fill: accentColor, color: accentColor } : {}}
                                  />
                                ) : field.ratingIcon === 'thumb' ? (
                                  <ThumbsUp
                                    className={`w-7 h-7 transition ${
                                      isFilled ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'
                                    }`}
                                    style={isFilled ? { fill: accentColor, color: accentColor } : {}}
                                  />
                                ) : field.ratingIcon === 'number' ? (
                                  <span
                                    className={`w-8 h-8 rounded-xl font-mono text-xs flex items-center justify-center font-bold border transition ${
                                      isFilled
                                        ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                                        : 'bg-black/40 text-neutral-400 border-white/10'
                                    }`}
                                  >
                                    {starVal}
                                  </span>
                                ) : (
                                  <Star
                                    className={`w-7 h-7 transition ${
                                      isFilled ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'
                                    }`}
                                    style={isFilled ? { fill: accentColor, color: accentColor } : {}}
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* 11. Ranking (Preference Order) */}
                      {field.type === 'ranking' && (
                        <div className="space-y-2 pt-1">
                          <p className="text-[11px] font-mono text-neutral-400">Use arrows to prioritize items from top to bottom:</p>
                          {(() => {
                            const currentOrder: string[] = formData[field.id] || field.options || ['Item 1', 'Item 2', 'Item 3'];
                            return currentOrder.map((item, itemIdx) => (
                              <div
                                key={item}
                                className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-sans text-white"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="w-5 h-5 rounded bg-amber-500/20 text-amber-300 font-mono text-[11px] font-bold flex items-center justify-center">
                                    #{itemIdx + 1}
                                  </span>
                                  <span>{item}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    disabled={itemIdx === 0}
                                    onClick={() => {
                                      const next = [...currentOrder];
                                      const tmp = next[itemIdx];
                                      next[itemIdx] = next[itemIdx - 1];
                                      next[itemIdx - 1] = tmp;
                                      handleInputChange(field.id, next);
                                    }}
                                    className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white disabled:opacity-20"
                                  >
                                    <ChevronUp className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={itemIdx === currentOrder.length - 1}
                                    onClick={() => {
                                      const next = [...currentOrder];
                                      const tmp = next[itemIdx];
                                      next[itemIdx] = next[itemIdx + 1];
                                      next[itemIdx + 1] = tmp;
                                      handleInputChange(field.id, next);
                                    }}
                                    className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white disabled:opacity-20"
                                  >
                                    <ChevronDown className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ));
                          })()}
                        </div>
                      )}

                      {/* 12. File Upload / Image Upload */}
                      {field.type === 'file_upload' && (
                        <div className="pt-2 space-y-3">
                          {formData[field.id] ? (
                            <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-emerald-500/40 space-y-3 shadow-lg">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                  <span>Payment Proof / Receipt Attached</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleInputChange(field.id, '');
                                    handleInputChange(`${field.id}_name`, '');
                                  }}
                                  className="text-[11px] font-mono text-rose-400 hover:text-rose-300 underline cursor-pointer"
                                >
                                  Remove
                                </button>
                              </div>

                              {/* Live Image Preview if image or data URL */}
                              {typeof formData[field.id] === 'string' && (formData[field.id].startsWith('data:image') || formData[field.id].startsWith('http') || formData[field.id].startsWith('blob:')) && (
                                <div className="max-h-64 w-full rounded-xl overflow-hidden border border-white/10 bg-black/80 flex items-center justify-center p-2">
                                  <img
                                    src={formData[field.id]}
                                    alt="Payment Screenshot Preview"
                                    className="max-h-60 w-auto object-contain rounded-lg shadow-md"
                                  />
                                </div>
                              )}

                              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 px-1">
                                <span className="truncate max-w-xs">{formData[`${field.id}_name`] || 'Screenshot Attached'}</span>
                                <label className="text-amber-400 hover:text-amber-300 underline cursor-pointer">
                                  Change Screenshot
                                  <input
                                    type="file"
                                    accept="image/*,application/pdf"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (re) => {
                                          handleInputChange(field.id, re.target?.result as string);
                                          handleInputChange(`${field.id}_name`, file.name);
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                          ) : (
                            <label className="p-6 sm:p-8 rounded-2xl border-2 border-dashed border-amber-500/40 bg-gradient-to-b from-amber-500/[0.04] to-black/40 hover:bg-amber-500/[0.08] transition flex flex-col items-center justify-center gap-2.5 cursor-pointer text-center group">
                              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
                                <UploadCloud className="w-6 h-6" />
                              </div>
                              <span className="text-sm font-semibold text-white group-hover:text-amber-300 transition">
                                Click or drag & drop payment screenshot here
                              </span>
                              <span className="text-[11px] font-mono text-neutral-400 max-w-sm leading-relaxed">
                                Upload JPG, PNG, or WEBP screenshot of your completed transaction receipt (Max {field.maxFileSizeMb ?? 10} MB)
                              </span>
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (re) => {
                                      handleInputChange(field.id, re.target?.result as string);
                                      handleInputChange(`${field.id}_name`, file.name);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                          )}
                        </div>
                      )}

                      {/* 13. Digital Signature */}
                      {field.type === 'signature' && (
                        <div className="space-y-2 pt-2">
                          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                            <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                              <span className="font-bold flex items-center gap-1.5">
                                <PenTool className="w-3.5 h-3.5" />
                                <span>Sign Legal Attestation</span>
                              </span>
                              {formData[field.id] && (
                                <button
                                  type="button"
                                  onClick={() => handleInputChange(field.id, '')}
                                  className="text-[10px] text-neutral-400 hover:text-white underline"
                                >
                                  Clear
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              placeholder="Type your full legal name or sovereign handle as signature"
                              value={formData[field.id] || ''}
                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                              className="w-full px-4 py-3 rounded-lg bg-black/60 border border-emerald-500/20 text-emerald-200 text-sm font-serif italic outline-none focus:border-emerald-400"
                            />
                            <p className="text-[10px] font-mono text-neutral-400">
                              By typing your name, you attest under sovereign ledger protocols that this response is authentic.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* 14. Web3 Wallet Address */}
                      {field.type === 'wallet_address' && (
                        <div className="relative pt-1">
                          <input
                            type="text"
                            placeholder="0x... or Solana / Ledger public address"
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-purple-500/30 focus:border-purple-400 text-purple-200 text-xs sm:text-sm font-mono focus:outline-none transition shadow-inner"
                          />
                          <Coins className="w-4 h-4 text-purple-400 absolute left-3.5 top-4 pointer-events-none" />
                        </div>
                      )}

                      {/* 15. Custom Configurable Field */}
                      {field.type === 'custom' && (
                        <div className="flex items-center rounded-xl bg-black/40 border border-white/15 focus-within:border-amber-400/80 overflow-hidden shadow-inner">
                          {field.customPrefix && (
                            <span className="px-3 text-xs font-mono text-amber-400 bg-white/5 border-r border-white/10 select-none">
                              {field.customPrefix}
                            </span>
                          )}
                          <input
                            type={field.customInputType || 'text'}
                            placeholder={field.customPlaceholder || 'Enter value...'}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="flex-1 px-4 py-3 bg-transparent text-white text-xs sm:text-sm focus:outline-none font-sans"
                          />
                        </div>
                      )}

                      {/* 16. Dropdown Select / Secretariat Sector Selector */}
                      {(field.type === 'select' || field.type === 'dropdown' || field.type === 'radio') && (
                        (field.id === 'step1_primary_sector' || field.id === 'step1_preferred_department') ? (
                          <div className="space-y-4 pt-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
                              <span className="text-xs font-mono text-[#e2f952] uppercase tracking-wider font-bold">
                                10 Dedicated Departments Available
                              </span>
                              <span className="text-[11px] font-mono text-neutral-400">
                                Click a sector card to select your primary appointment
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {SECRETARIAT_DEPARTMENTS.map((dept) => {
                                const isSelected = 
                                  formData[field.id] === dept.name || 
                                  formData[field.id] === dept.label || 
                                  formData[field.id] === dept.id || 
                                  (typeof formData[field.id] === 'string' && formData[field.id].toLowerCase().includes(dept.name.toLowerCase()));

                                return (
                                  <div
                                    key={dept.id}
                                    onClick={() => handleInputChange(field.id, dept.name)}
                                    className={`group relative p-5 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                                      isSelected
                                        ? 'bg-[#0f172a] border-[#e2f952] shadow-[0_0_30px_rgba(226,249,82,0.15)] ring-1 ring-[#e2f952]'
                                        : 'bg-[#060911]/80 hover:bg-[#0c1222] border-white/10 hover:border-white/20'
                                    }`}
                                  >
                                    <div>
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${dept.badgeColor}`}>
                                            {getDeptIcon(dept.iconName)}
                                          </div>
                                          <div>
                                            <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                                              SECTOR {dept.index}
                                            </span>
                                            <h3 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-[#e2f952] transition-colors">
                                              {dept.name}
                                            </h3>
                                          </div>
                                        </div>
                                        {isSelected && (
                                          <span className="w-6 h-6 rounded-full bg-[#e2f952] text-black flex items-center justify-center font-bold text-xs shadow-md shrink-0">
                                            ✓
                                          </span>
                                        )}
                                      </div>

                                      <p className="text-neutral-300 text-xs mt-3 leading-relaxed">
                                        {dept.focus}
                                      </p>

                                      <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                                        <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                                          Key Responsibilities:
                                        </div>
                                        <ul className="text-[11px] text-neutral-300 space-y-1 list-disc list-inside">
                                          {dept.responsibilities.slice(0, 3).map((r, i) => (
                                            <li key={i} className="truncate">{r}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                                      <div className="flex flex-wrap gap-1.5">
                                        {dept.skills.slice(0, 4).map((skill, i) => (
                                          <span
                                            key={i}
                                            className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-400"
                                          >
                                            {skill}
                                          </span>
                                        ))}
                                      </div>
                                      <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-[#e2f952]' : 'text-neutral-500'}`}>
                                        {isSelected ? '✓ Sector Selected' : 'Click to Select'}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (field.id === 'step1_secondary_sector' || field.id === 'step1_secondary_department') ? (
                          <div className="space-y-3 pt-1">
                            <p className="text-[11px] text-neutral-400 font-sans">
                              Select a fallback department if your primary choice is already fully staffed:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {SECRETARIAT_DEPARTMENTS.map((dept) => {
                                const isSelected = 
                                  formData[field.id] === dept.name || 
                                  formData[field.id] === dept.label || 
                                  formData[field.id] === dept.id;
                                const isPrimary = 
                                  formData['step1_primary_sector'] === dept.name || 
                                  formData['step1_primary_sector'] === dept.label || 
                                  formData['step1_primary_sector'] === dept.id ||
                                  (typeof formData['step1_primary_sector'] === 'string' && formData['step1_primary_sector'].toLowerCase().includes(dept.name.toLowerCase()));

                                return (
                                  <button
                                    key={dept.id}
                                    type="button"
                                    disabled={isPrimary}
                                    onClick={() => handleInputChange(field.id, dept.name)}
                                    className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                                      isSelected
                                        ? 'bg-[#e2f952]/15 border-[#e2f952] text-white ring-1 ring-[#e2f952]/50 shadow-[0_0_15px_rgba(226,249,82,0.2)]'
                                        : isPrimary
                                        ? 'bg-white/[0.01] border-white/5 opacity-40 cursor-not-allowed'
                                        : 'bg-[#090d16]/60 border-white/10 hover:border-white/25 text-neutral-300 hover:text-white'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 truncate">
                                      <div className={`p-1.5 rounded-lg border shrink-0 ${dept.badgeColor}`}>
                                        {getDeptIcon(dept.iconName)}
                                      </div>
                                      <div className="truncate">
                                        <div className="text-xs font-semibold truncate text-white">{dept.name}</div>
                                        <div className="text-[10px] font-mono text-neutral-400 truncate">
                                          {isPrimary ? 'Primary Sector Choice' : `Sector ${dept.index}`}
                                        </div>
                                      </div>
                                    </div>
                                    <div
                                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                                        isSelected ? 'border-[#e2f952] bg-[#e2f952] text-black font-bold text-xs' : 'border-white/20'
                                      }`}
                                    >
                                      {isSelected && '✓'}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <select
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            onBlur={() => handleFieldBlur(field.id)}
                            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400/80 text-white text-xs sm:text-sm focus:outline-none transition cursor-pointer font-sans"
                          >
                            <option value="" disabled>Select an option...</option>
                            {(field.options || []).map((opt) => (
                              <option key={opt} value={opt} className="bg-[#0e111a] text-white">
                                {opt}
                              </option>
                            ))}
                          </select>
                        )
                      )}

                      {/* 17. Multiple Choice / Radio Options */}
                      {(field.type === 'radio' || field.type === 'multiple_choice') && (
                        field.id === 'step15_participation_tier' ? (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
                            {(field.options || []).map((opt) => {
                              const isSelected = formData[field.id] === opt;
                              const isDelegate = opt.includes('Delegate Pass') && !opt.includes('Double');
                              const isObserver = opt.includes('Observer') || opt.includes('Participant');
                              const isDouble = opt.includes('Double');

                              const tierTitle = isDelegate
                                ? 'Delegate Pass'
                                : isObserver
                                ? 'Participant / Observer Pass'
                                : 'Executive Double Pass';

                              const tierPrice = isDelegate ? '₹499' : isObserver ? '₹199' : '₹899';
                              const tierUsd = isDelegate ? '$6 USD' : isObserver ? '$2.5 USD' : '$11 USD';
                              const tierBadge = isDelegate
                                ? 'RECOMMENDED • OFFICIAL'
                                : isObserver
                                ? 'ENTRY LEVEL PASS'
                                : 'DUAL DIPLOMATS';

                              const tierPerks = isDelegate
                                ? [
                                    'Full Parliamentary & Voting Rights',
                                    'Speaking Floor & Unmoderated Caucus',
                                    'Official Placard & Dossier',
                                    'All Awards Contention (Best Del)',
                                    'Sovereign Blockchain Credential',
                                  ]
                                : isObserver
                                ? [
                                    'Plenary Observation Access',
                                    'Moderated Caucus Attendance',
                                    'Official Observer Certificate',
                                    'Diplomatic Masterclass Entry',
                                    'Delegate Networking Access',
                                  ]
                                : [
                                    'Paired Seat for 2 Diplomats',
                                    'Dual Placards & Official Dossiers',
                                    'Working Paper Co-Sponsorship',
                                    'Joint Best Delegation Contention',
                                    'Dual Verified Credentials',
                                  ];

                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => handleInputChange(field.id, opt)}
                                  className={`relative text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
                                    isSelected
                                      ? 'bg-gradient-to-b from-white/[0.12] to-white/[0.04] border-amber-400/80 shadow-[0_0_30px_rgba(251,191,36,0.18)] scale-[1.02]'
                                      : 'bg-[#090d16]/70 border-white/10 hover:border-white/25 hover:bg-white/[0.04]'
                                  }`}
                                >
                                  {/* Top badge */}
                                  <div className="flex items-center justify-between gap-2 mb-3">
                                    <span
                                      className={`text-[9px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full font-bold border ${
                                        isSelected
                                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                                          : isDelegate
                                          ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                                          : isObserver
                                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                          : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                                      }`}
                                    >
                                      {tierBadge}
                                    </span>
                                    <div
                                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition shrink-0 ${
                                        isSelected
                                          ? 'border-amber-400 bg-amber-400 text-black'
                                          : 'border-white/20 group-hover:border-white/40'
                                      }`}
                                    >
                                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                                    </div>
                                  </div>

                                  {/* Title & Price */}
                                  <div className="space-y-1 mb-4">
                                    <h4 className="font-display font-bold text-white text-base leading-tight">
                                      {tierTitle}
                                    </h4>
                                    <div className="flex items-baseline gap-1.5 pt-1">
                                      <span className="text-2xl font-black text-white font-mono tracking-tight">
                                        {tierPrice}
                                      </span>
                                      <span className="text-[11px] text-neutral-400 font-mono">
                                        / {tierUsd}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Perk list */}
                                  <ul className="space-y-1.5 pt-3 border-t border-white/10 text-xs font-sans text-neutral-300">
                                    {tierPerks.map((perk) => (
                                      <li key={perk} className="flex items-start gap-2 text-[11px] leading-snug">
                                        <span className="text-amber-400 font-bold shrink-0 mt-0.5">&bull;</span>
                                        <span>{perk}</span>
                                      </li>
                                    ))}
                                  </ul>

                                  {/* Selection indicator footer */}
                                  <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono flex items-center justify-between">
                                    <span className={isSelected ? 'text-amber-300 font-bold' : 'text-neutral-500'}>
                                      {isSelected ? '✓ Pass Selected' : 'Click to Select Pass'}
                                    </span>
                                    <Ticket className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-neutral-500'}`} />
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        ) : field.id === 'step3_primary_committee' ? (
                          <div className="space-y-3.5 pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {COMMITTEE_CHAMBERS.map((chamber) => {
                                const matchingOpt = (field.options || []).find((o) =>
                                  o.toLowerCase().includes(chamber.code.toLowerCase()) ||
                                  o.toLowerCase().includes(chamber.id.toLowerCase())
                                ) || chamber.title;
                                const isSelected = formData[field.id] === matchingOpt || formData[field.id]?.toLowerCase().includes(chamber.code.toLowerCase());

                                return (
                                  <button
                                    key={chamber.id}
                                    type="button"
                                    onClick={() => handleInputChange(field.id, matchingOpt)}
                                    className={`relative text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer group overflow-hidden ${
                                      isSelected
                                        ? 'bg-gradient-to-b from-amber-500/20 via-white/[0.08] to-amber-950/30 border-amber-400 ring-2 ring-amber-400/40 shadow-[0_0_30px_rgba(245,158,11,0.22)] scale-[1.01]'
                                        : 'bg-[#090d16]/80 border-white/10 hover:border-amber-400/40 hover:bg-white/[0.04]'
                                    }`}
                                  >
                                    <div>
                                      {/* Top Badges & Radio Indicator */}
                                      <div className="flex items-center justify-between gap-2 mb-3">
                                        <div className="flex items-center gap-2">
                                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                                            {chamber.code}
                                          </span>
                                          <span className={`text-[9px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full font-bold border ${chamber.badgeColor}`}>
                                            {chamber.badge}
                                          </span>
                                        </div>
                                        <div
                                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition shrink-0 ${
                                            isSelected
                                              ? 'border-amber-400 bg-amber-400 text-black'
                                              : 'border-white/20 group-hover:border-amber-400/50'
                                          }`}
                                        >
                                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                        </div>
                                      </div>

                                      {/* Title & Subtitle */}
                                      <h4 className="font-display font-bold text-white text-base leading-snug group-hover:text-amber-200 transition">
                                        {chamber.title}
                                      </h4>
                                      <p className="text-xs text-neutral-400 font-mono mb-3">
                                        {chamber.subtitle}
                                      </p>

                                      {/* Agenda Box */}
                                      <div className="p-3 rounded-xl bg-black/50 border border-white/10 mb-3 space-y-1">
                                        <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                                          Official Simulated Agenda:
                                        </div>
                                        <div className="text-xs text-neutral-200 font-sans leading-relaxed">
                                          {chamber.agenda}
                                        </div>
                                      </div>

                                      {/* Format ROP */}
                                      <div className="text-[11px] font-mono text-neutral-400 mb-3">
                                        <span className="text-neutral-500">Rules of Procedure:</span> {chamber.format}
                                      </div>
                                    </div>

                                    {/* Footer with Tags and Matrix Link */}
                                    <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 mt-auto">
                                      <div className="flex flex-wrap gap-1.5">
                                        {chamber.tags.map((tag) => (
                                          <span key={tag} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-300">
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Link
                                          href="/matrix"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={(e) => e.stopPropagation()}
                                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-amber-300 font-mono text-[10px] border border-white/10 transition"
                                        >
                                          <Grid className="w-3 h-3" />
                                          <span>Matrix</span>
                                          <ExternalLink className="w-2.5 h-2.5" />
                                        </Link>
                                        <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-amber-300' : 'text-neutral-500'}`}>
                                          {isSelected ? '✓ Chamber Selected' : 'Click to Select'}
                                        </span>
                                      </div>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ) : field.id === 'step4_secondary_committee' ? (
                          <div className="space-y-2 pt-1">
                            <p className="text-[11px] text-neutral-400 font-sans">
                              Select a fallback committee chamber if your primary choice is fully subscribed:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {COMMITTEE_CHAMBERS.map((chamber) => {
                                const matchingOpt = (field.options || []).find((o) =>
                                  o.toLowerCase().includes(chamber.code.toLowerCase()) ||
                                  o.toLowerCase().includes(chamber.id.toLowerCase())
                                ) || chamber.title;
                                const isSelected = formData[field.id] === matchingOpt || formData[field.id]?.toLowerCase().includes(chamber.code.toLowerCase());
                                const isPrimary = formData['step3_primary_committee']?.toLowerCase().includes(chamber.code.toLowerCase());

                                return (
                                  <button
                                    key={chamber.id}
                                    type="button"
                                    disabled={isPrimary}
                                    onClick={() => handleInputChange(field.id, matchingOpt)}
                                    className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                                      isSelected
                                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                                        : isPrimary
                                        ? 'bg-white/[0.01] border-white/5 opacity-40 cursor-not-allowed'
                                        : 'bg-[#090d16]/60 border-white/10 hover:border-white/25 text-neutral-300 hover:text-white'
                                    }`}
                                  >
                                    <div className="truncate">
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs font-bold text-amber-400">{chamber.code}</span>
                                        <span className="text-xs font-semibold text-white truncate">{chamber.title}</span>
                                      </div>
                                      <div className="text-[10px] font-mono text-neutral-400 truncate mt-0.5">
                                        {isPrimary ? 'Selected as 1st Preference' : chamber.badge}
                                      </div>
                                    </div>
                                    <div
                                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                                        isSelected ? 'border-amber-400 bg-amber-400 text-black' : 'border-white/20'
                                      }`}
                                    >
                                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ) : field.id === 'step3_weekly_bandwidth' ? (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
                            {BANDWIDTH_TIERS.map((tier) => {
                              const matchingOpt = (field.options || []).find((o) =>
                                o.toLowerCase().includes(tier.id.toLowerCase()) ||
                                o.toLowerCase().includes(tier.title.toLowerCase())
                              ) || tier.label;
                              const isSelected = formData[field.id] === matchingOpt || formData[field.id] === tier.label;

                              return (
                                <button
                                  key={tier.id}
                                  type="button"
                                  onClick={() => handleInputChange(field.id, matchingOpt)}
                                  className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
                                    isSelected
                                      ? 'bg-gradient-to-b from-purple-500/25 via-white/[0.08] to-purple-950/30 border-purple-400 ring-2 ring-purple-400/40 shadow-[0_0_25px_rgba(168,85,247,0.25)] scale-[1.01]'
                                      : 'bg-[#090d16]/70 border-white/10 hover:border-purple-400/40 hover:bg-white/[0.04]'
                                  }`}
                                >
                                  <div>
                                    <div className="flex items-center justify-between gap-2 mb-2.5">
                                      <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border border-purple-500/30 text-purple-300 bg-purple-500/10 font-bold">
                                        {tier.tier}
                                      </span>
                                      <div
                                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition shrink-0 ${
                                          isSelected ? 'border-purple-400 bg-purple-400 text-black' : 'border-white/20'
                                        }`}
                                      >
                                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                      </div>
                                    </div>
                                    <h4 className="font-display font-bold text-white text-base mb-1.5">
                                      {tier.title}
                                    </h4>
                                    <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                                      {tier.desc}
                                    </p>
                                  </div>
                                  <div className="pt-3 border-t border-white/10 mt-4 text-[10px] font-mono flex items-center justify-between">
                                    <span className={isSelected ? 'text-purple-300 font-bold' : 'text-neutral-500'}>
                                      {isSelected ? '✓ Track Committed' : 'Click to Commit'}
                                    </span>
                                    <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-purple-300' : 'text-neutral-500'}`} />
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        ) : field.id === 'step4_accord_agreement' ? (
                          <div className="space-y-4 pt-2">
                            {/* Sovereign Accord Constitutional Pillars HUD */}
                            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-500/15 via-black/60 to-purple-950/20 border border-purple-500/30 space-y-4 shadow-xl">
                              <div className="flex items-center justify-between gap-2 border-b border-purple-500/20 pb-3">
                                <div className="flex items-center gap-2">
                                  <ShieldCheck className="w-5 h-5 text-purple-400" />
                                  <span className="font-display font-bold text-white text-sm uppercase tracking-wider">
                                    The ZENVITRA Sovereign Secretariat Accord
                                  </span>
                                </div>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                                  CONSTITUTIONAL PILLARS
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                                  <div className="font-bold text-purple-300 font-mono text-[11px]">I. Sovereign Neutrality</div>
                                  <p className="text-neutral-300 text-[11px] leading-relaxed">
                                    Absolute impartiality across all committee allocations, dispute arbitrations, and award adjudications with zero institutional bias.
                                  </p>
                                </div>
                                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                                  <div className="font-bold text-purple-300 font-mono text-[11px]">II. Executive Responsiveness</div>
                                  <p className="text-neutral-300 text-[11px] leading-relaxed">
                                    Strict &lt; 2-hour response latency during conference sprint cycles, active attendance in Secretariat syncs and war rooms.
                                  </p>
                                </div>
                                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                                  <div className="font-bold text-purple-300 font-mono text-[11px]">III. Data Sanctity & Nondisclosure</div>
                                  <p className="text-neutral-300 text-[11px] leading-relaxed">
                                    Delegate PII, private crisis storylines, and dais deliberation notes remain confidential and cryptographically safeguarded.
                                  </p>
                                </div>
                                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                                  <div className="font-bold text-purple-300 font-mono text-[11px]">IV. Diplomatic Decorum</div>
                                  <p className="text-neutral-300 text-[11px] leading-relaxed">
                                    Upholding exemplary diplomatic etiquette, intellectual rigor, and fraternal leadership across all multilateral sessions.
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Ratification Option */}
                            {(field.options || []).map((opt) => {
                              const isSelected = formData[field.id] === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => handleInputChange(field.id, opt)}
                                  className={`w-full p-4 rounded-xl border text-left transition flex items-start gap-3 cursor-pointer ${
                                    isSelected
                                      ? 'bg-purple-500/20 border-purple-400 text-purple-200 ring-2 ring-purple-400/30 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                                      : 'bg-white/[0.02] border-white/15 hover:bg-white/[0.05] text-neutral-300'
                                  }`}
                                >
                                  <div
                                    className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                                      isSelected ? 'border-purple-400 bg-purple-400 text-black' : 'border-white/30'
                                    }`}
                                  >
                                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                  </div>
                                  <span className="text-xs sm:text-sm font-medium leading-relaxed">
                                    {opt}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="space-y-2 pt-1">
                            {(field.options && field.options.length > 0 ? field.options : ['Option 1', 'Option 2']).map((opt) => (
                              <label
                                key={opt}
                                className={`flex items-center gap-3 p-3 rounded-xl border transition cursor-pointer ${
                                  formData[field.id] === opt
                                    ? 'bg-white/10 border-white/40'
                                    : 'bg-white/[0.02] border-white/10 hover:bg-white/5'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={field.id}
                                  value={opt}
                                  checked={formData[field.id] === opt}
                                  onChange={() => handleInputChange(field.id, opt)}
                                  className="hidden"
                                />
                                <div
                                  className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0"
                                  style={{
                                    borderColor: formData[field.id] === opt ? accentColor : 'rgba(255,255,255,0.3)',
                                    backgroundColor: formData[field.id] === opt ? accentColor : 'transparent',
                                  }}
                                >
                                  {formData[field.id] === opt && (
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentTextColor }} />
                                  )}
                                </div>
                                <span className="text-xs sm:text-sm text-neutral-200">{opt}</span>
                              </label>
                            ))}

                          {field.hasOtherOption && (
                            <div className="flex items-center gap-3 p-2">
                              <span className="text-xs text-neutral-400">Other:</span>
                              <input
                                type="text"
                                placeholder="Your answer"
                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white outline-none"
                              />
                            </div>
                          )}
                        </div>
                      )
                    )}

                      {/* 18. Checkboxes / Multi-select Options */}
                      {(field.type === 'checkbox' || field.type === 'checkboxes') && (
                        <div className="space-y-2 pt-1">
                          {(field.options && field.options.length > 0 ? field.options : ['Option 1', 'Option 2']).map((opt) => {
                            const isChecked = Array.isArray(formData[field.id]) && formData[field.id].includes(opt);
                            return (
                              <label
                                key={opt}
                                onClick={() => handleCheckboxToggle(field.id, opt)}
                                className={`flex items-center gap-3 p-3 rounded-xl border transition cursor-pointer ${
                                  isChecked
                                    ? 'bg-white/10 border-white/40'
                                    : 'bg-white/[0.02] border-white/10 hover:bg-white/5'
                                }`}
                              >
                                <div
                                  className="w-4 h-4 rounded-md border flex items-center justify-center shrink-0"
                                  style={{
                                    borderColor: isChecked ? accentColor : 'rgba(255,255,255,0.3)',
                                    backgroundColor: isChecked ? accentColor : 'transparent',
                                  }}
                                >
                                  {isChecked && (
                                    <Check className="w-3 h-3" style={{ color: accentTextColor }} />
                                  )}
                                </div>
                                <span className="text-xs sm:text-sm text-neutral-200">{opt}</span>
                              </label>
                            );
                          })}

                          {field.hasOtherOption && (
                            <div className="flex items-center gap-3 p-2">
                              <span className="text-xs text-neutral-400">Other:</span>
                              <input
                                type="text"
                                placeholder="Your answer"
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val) handleCheckboxToggle(field.id, `Other: ${val}`);
                                }}
                                className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white outline-none"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sovereign Ledger Intake &bull; Zero Tracking</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Back Button for Multi-page sections */}
                    {sections.length > 1 && currentPageIndex > 0 && (
                      <button
                        type="button"
                        onClick={handlePrevPage}
                        className="px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer border border-white/20 bg-white/5 hover:bg-white/10 text-white font-mono"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                    )}

                    {/* Next Button if more sections exist */}
                    {sections.length > 1 && currentPageIndex < sections.length - 1 ? (
                      <button
                        type="button"
                        onClick={handleNextPage}
                        className="flex-1 sm:flex-initial px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xl active:scale-95"
                        style={{
                          backgroundColor: accentColor,
                          color: accentTextColor,
                          boxShadow: `0 8px 25px ${accentColor}35`,
                        }}
                      >
                        <span>Continue to Page {currentPageIndex + 2}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      /* Final Submit Button */
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-initial px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xl active:scale-95 disabled:opacity-50"
                        style={{
                          backgroundColor: accentColor,
                          color: accentTextColor,
                          boxShadow: `0 8px 25px ${accentColor}35`,
                        }}
                      >
                        <Send className="w-4 h-4" />
                        <span>{isSubmitting ? 'Recording...' : (form.submitButtonText || 'Submit Response')}</span>
                      </button>
                    )}
                  </div>
                </div>
              </form>

            </div>
          </div>
        )}

      </main>

      {/* ── Sovereign Guarantee Footer ── */}
      <div className="max-w-4xl lg:max-w-5xl mx-auto w-full text-center py-6 text-[11px] font-mono text-neutral-500 border-t border-white/10 relative z-10 px-2 sm:px-0">
        <span>Powered by <strong className="text-neutral-300">ZenForms</strong> &bull; The Sovereign Multilateral Intake Engine</span>
      </div>

    </div>
  );
}
