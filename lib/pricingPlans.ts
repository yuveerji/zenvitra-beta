// lib/pricingPlans.ts
// Single source of truth for ZENVITRA Pricing Plans, Audiences, and Statutory Tax Calculations

export type AudienceType = 'people' | 'professional' | 'events' | 'organizer';
export type BillingCycle = 'monthly' | 'annual';
export type Currency = 'INR' | 'USD';

export interface Plan {
  id: string;
  name: string;
  tagline: string;
  philosophy: string;
  journeyStep: 'CREATE' | 'GROW' | 'PROFESSIONALIZE' | 'SCALE';
  priceINR: number;
  priceAnnualINR?: number;
  priceUSD: number;
  priceAnnualUSD?: number;
  isCustom?: boolean;
  isPerEvent?: boolean;
  isFlagship?: boolean;
  isLaunchPlan: boolean;
  badge?: string;
  accentColor: string;
  features: string[];
  spotlightNote?: string;
  ctaText: string;
  audience: AudienceType;
}

export const PEOPLE_PLANS: Plan[] = [
  {
    id: 'zen-free',
    name: 'ZEN FREE',
    tagline: 'Your permanent foundation in the ZENVITRA ecosystem.',
    philosophy: 'PARTICIPATE',
    journeyStep: 'CREATE',
    priceINR: 0,
    priceUSD: 0,
    isLaunchPlan: true,
    badge: 'Free Forever',
    accentColor: 'border-white/20 text-neutral-300',
    audience: 'people',
    features: [
      'ZENVITRA Identity: Profile, Bio, Links, Basic Achievements',
      'Custom Handle URL: zenvitra.xyz/@username',
      'ZEN.chat: 1-on-1, Group chats & Open Communities',
      'ZEN.PULSE: Create posts, opinions, media, comments & discussions',
      'ZEN.SPARK: Watch & upload short-form visual content',
      'International Press: YES — Everyone can write & publish articles!',
      'Author Identity & Articles connected directly to your profile',
      'ZEN.EVENTS: Discover summits, register & purchase delegate tickets',
      '🏛️ ZEN.MUN Core Chamber Access (100% Free Forever for all Delegates):',
      '• Full Delegate Participation in any Model UN & Parliamentary Simulation',
      '• Access assigned Country/Portfolio matrix (Allocated directly by the Conference Head)',
      '• Live General Speakers List (GSL) countdown clock, Points of Information (POIs) & Motions',
      '• Live Procedural Voting, Resolution Tabling & Electronic Chits'
    ],
    spotlightNote: 'Core delegate participation is 100% Free. Portfolio allocation is determined directly by the Conference Head.',
    ctaText: 'Start Free Forever'
  },
  {
    id: 'zen-plus',
    name: 'ZEN+',
    tagline: 'For people creating more actively and expanding output.',
    philosophy: 'CREATE MORE',
    journeyStep: 'CREATE',
    priceINR: 99,
    priceAnnualINR: 79,
    priceUSD: 1.49,
    priceAnnualUSD: 0.99,
    isLaunchPlan: false,
    badge: 'Phase 2 Expansion',
    accentColor: 'border-blue-500/40 text-blue-400',
    audience: 'people',
    features: [
      'Everything in ZEN FREE',
      'Enhanced Identity: Custom sections, more links & featured achievements',
      'Enhanced Writing: Higher publishing limits, rich formatting & tags',
      'Draft Management & Cover Images for articles',
      'ZEN.PULSE+: Increased content limits & post customization',
      'ZEN.SPARK+: Higher upload caps & enhanced creator controls',
      'Basic Insights: Profile growth, post performance & article views'
    ],
    ctaText: 'Get ZEN+'
  },
  {
    id: 'zen-pro',
    name: 'ZEN PRO',
    tagline: 'The flagship subscription for ambitious students, creators & thinkers.',
    philosophy: 'GROW',
    journeyStep: 'GROW',
    priceINR: 249,
    priceAnnualINR: 199,
    priceUSD: 3.49,
    priceAnnualUSD: 2.69,
    isFlagship: true,
    isLaunchPlan: true,
    badge: 'MOST POPULAR • FLAGSHIP',
    accentColor: 'border-purple-500 text-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.25)]',
    audience: 'people',
    features: [
      'Everything in ZEN+',
      '🎙️ ZEN.STAGE Live Podiums & Floor Broadcasting Access',
      '📹 ZEN.CALL & ZEN.MEET HD Multi-Party Video Conferencing & Chamber Audio',
      'ZENVITRA PRO Identity: Full Portfolio, Projects, Skills & Verified Scholar Badge',
      'Experience & Achievements verified timeline',
      'Pro Writing & Sovereign Press: High/unlimited publishing & draft studio',
      'Article Analytics & Reading Engagement telemetry',
      'ZEN Analytics Suite: Profile visits, audience trends & best-performing content',
      'ZEN AI Monthly Allowance: Polish writing, structure articles & generate captions',
      'Unlimited Category Subscriptions across Press, News & Pulse feeds',
      'Priority Event Access: Early registration windows (strictly zero unfair judging bias)',
      '🎖️ Verifiable Digital Certificates (ZEN.CERTIFY) & Plenary Archive Records',
      '📊 In-Depth Delegate Career Dossiers & Historical Committee Telemetry',
      '⚡ In MUNs Priority Matrix Allocation Notification Windows'
    ],
    spotlightNote: 'The subscription most serious youth, writers, debaters, and emerging professionals choose.',
    ctaText: 'Upgrade to ZEN PRO'
  },
  {
    id: 'zen-elite',
    name: 'ZEN ELITE',
    tagline: 'For people building serious public influence and elite presence.',
    philosophy: 'PROFESSIONALIZE',
    journeyStep: 'PROFESSIONALIZE',
    priceINR: 499,
    priceAnnualINR: 399,
    priceUSD: 6.99,
    priceAnnualUSD: 5.49,
    isLaunchPlan: false,
    badge: 'Phase 2 Expansion',
    accentColor: 'border-amber-500/50 text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.2)]',
    audience: 'people',
    features: [
      'Everything in ZEN PRO',
      'Elite Identity: Maximum profile customization & executive layouts',
      'Host Public Multi-Room Stages & Plenary Audio Relays',
      'HD Conference Recordings & Export Connectors in ZEN.MEET',
      'Advanced Portfolio Presentation & Enhanced Featured Sections',
      'Elite Creator & Writer: Maximum publishing tools & distribution power',
      'Advanced Content Management & Higher ZEN AI monthly allowance',
      'Elite SPARK: Advanced creator telemetry & highest bitrate streaming',
      'Zero Platform Surcharges on Summit Ticket Bookings',
      'VIP Early Access: Test beta products, new ZEN tools & experimental features'
    ],
    ctaText: 'Join ZEN ELITE'
  }
];

export const PROFESSIONAL_PLANS: Plan[] = [
  {
    id: 'pro-starter',
    name: 'PROFESSIONAL STARTER',
    tagline: 'Establish your organization identity without upfront costs.',
    philosophy: 'START',
    journeyStep: 'CREATE',
    priceINR: 0,
    priceUSD: 0,
    isLaunchPlan: false,
    badge: 'Free For Orgs',
    accentColor: 'border-white/20 text-neutral-300',
    audience: 'professional',
    features: [
      'Professional Profile: Identity, Description, Category & Contact Info',
      'Official Website links & Basic Team Information',
      'ZEN.PULSE: Publish official statements & build institutional followers',
      'Write & Publish: Organization author profile with basic article publishing',
      'Articles linked directly to your organization dossier',
      'Basic Analytics: Followers, post engagement & article read counts'
    ],
    ctaText: 'Toggle to Professional & Begin Starter'
  },
  {
    id: 'pro-standard',
    name: 'PROFESSIONAL',
    tagline: 'For organizations building their voice and expanding public trust.',
    philosophy: 'CREATE & GROW',
    journeyStep: 'GROW',
    priceINR: 499,
    priceAnnualINR: 399,
    priceUSD: 6.99,
    priceAnnualUSD: 5.49,
    isFlagship: false,
    isLaunchPlan: true,
    badge: 'LAUNCH CORE',
    accentColor: 'border-cyan-500/50 text-cyan-400',
    audience: 'professional',
    features: [
      'Everything in Professional Starter',
      'Professional Publishing: Increased/unlimited publishing allowance',
      'Advanced Article Editor with draft branches, cover images, tags & categories',
      'Article Scheduling (publish on coordinated schedules)',
      'Enhanced Org Identity: Featured projects, achievements & whitepapers',
      'Professional Analytics: Audience demographics & engagement telemetry',
      'Team Management: Up to 3 team members (Owner, Admin, Editor, Content Mgr)'
    ],
    ctaText: 'Choose Professional'
  },
  {
    id: 'pro-plus',
    name: 'PROFESSIONAL PRO',
    tagline: 'For organizations transforming into trusted journalistic institutions.',
    philosophy: 'PROFESSIONALIZE',
    journeyStep: 'PROFESSIONALIZE',
    priceINR: 999,
    priceAnnualINR: 799,
    priceUSD: 12.99,
    priceAnnualUSD: 9.99,
    isFlagship: true,
    isLaunchPlan: false,
    badge: 'FLAGSHIP ORG PLAN',
    accentColor: 'border-purple-500 text-purple-400 shadow-[0_0_35px_rgba(168,85,247,0.3)]',
    audience: 'professional',
    features: [
      'Everything in Professional',
      '🏛️ THE ZENVITRA PUBLICATION SYSTEM (Run your own accredited publication)',
      'Multi-Tier Editorial Workflow: Writers draft → Editors review → Admins approve',
      'Publication Dashboard: Dedicated submission management workspace',
      'Advanced Team Roles: Writer, Editor, Publisher & Administrator permissions',
      'Multi-Author Collaboration: Multiple contributors under one branded masthead',
      'Publication Analytics: Read completion rates, shares & citation metrics'
    ],
    spotlightNote: 'Operate an authentic journal like "The Youth Journal by XYZ Organization" with built-in editorial checks.',
    ctaText: 'Upgrade to Pro Org'
  },
  {
    id: 'pro-enterprise',
    name: 'PROFESSIONAL ENTERPRISE',
    tagline: 'For universities, large media houses, major NGOs & national institutions.',
    philosophy: 'SCALE',
    journeyStep: 'SCALE',
    priceINR: 0,
    priceUSD: 0,
    isCustom: true,
    isLaunchPlan: false,
    badge: 'Custom Architecture',
    accentColor: 'border-amber-500 text-amber-400',
    audience: 'professional',
    features: [
      'For Universities, Media Houses, Global NGOs & Think Tanks',
      'Large team seat allowances & Multi-Publication Networks',
      'Custom Editorial Permissions, SSO & Domain Routing',
      'Dedicated Cloud Infrastructure & High-Availability SLAs',
      'Priority API Access & Data Export Connectors',
      'Dedicated Account Strategist & Bespoke Onboarding'
    ],
    ctaText: 'Contact Enterprise Sales'
  }
];

export const EVENT_PLANS: Plan[] = [
  {
    id: 'event-starter',
    name: 'EVENT STARTER',
    tagline: 'For small community meetups, webinars & grassroots gatherings.',
    philosophy: 'HOST',
    journeyStep: 'CREATE',
    priceINR: 0,
    priceUSD: 0,
    isPerEvent: true,
    isLaunchPlan: false,
    badge: 'Free To Host',
    accentColor: 'border-white/20 text-neutral-300',
    audience: 'events',
    features: [
      'Event Profile: Description, Date, Time & Venue/Online Links',
      'Public Event Registration Page',
      'Basic Attendee Database & Check-in List',
      '🏛️ Full Conference Head Allocation Console & Unlimited Council Country/Portfolio Matrix Auto-Sync (100% Free Forever)',
      '📱 Real-Time Delegate Attendance QR Scanner & Reception Desk Terminal Desk (100% Free Forever for all events)',
      'Participant Updates & Basic Communication Tools'
    ],
    ctaText: 'Host Free Event'
  },
  {
    id: 'event-basic',
    name: 'EVENT BASIC',
    tagline: 'Everything needed to organize a structured conference or workshop.',
    philosophy: 'ORGANIZE',
    journeyStep: 'GROW',
    priceINR: 999,
    priceUSD: 13.99,
    isPerEvent: true,
    isLaunchPlan: false,
    badge: 'Phase 2 Expansion',
    accentColor: 'border-blue-500/40 text-blue-400',
    audience: 'events',
    features: [
      'Everything in Event Starter',
      'Custom Registration Forms with custom questions',
      'Participant Management Database & Automated Confirmation System',
      'Event Schedule, Multi-Session Agendas & Speaker Profiles',
      'Live Participant Announcements & Broadcast Alerts',
      'Registration Statistics & Conversion Telemetry'
    ],
    ctaText: 'Select Event Basic'
  },
  {
    id: 'event-pro',
    name: 'EVENT PRO // MUN PRO',
    tagline: 'The flagship operating suite for Model UN Secretariats & Conference Heads.',
    philosophy: 'MANAGE & ACCREDIT',
    journeyStep: 'PROFESSIONALIZE',
    priceINR: 2499,
    priceUSD: 32.99,
    isPerEvent: true,
    isFlagship: true,
    isLaunchPlan: true,
    badge: '⭐ THE MUN OPERATING SYSTEM',
    accentColor: 'border-purple-500 text-purple-400 shadow-[0_0_35px_rgba(168,85,247,0.3)]',
    audience: 'events',
    features: [
      'Everything in Event Basic (including 100% Free Allocation Console, Matrix Auto-Sync & QR Scanner)',
      'Complete Advanced Participants Dashboard & Multi-Admin Permissions',
      '🎖️ Cryptographically Verifiable Digital Certificates (ZEN.CERTIFY) with public QR validation',
      '🏆 Advanced Automated Award Scoring Matrix & Multi-Council Executive Board Sync',
      '🎙️ Multi-Room High-Def Audio Transceiver & Live Broadcast Dais',
      '📊 In-Depth Performance Dossiers & Historical Delegate Career Telemetry',
      '⚡ Priority Portfolio/Country Allocation Notification Windows for Delegates',
      'Multi-Session Attendance Tracking & Live Plenary Feeds'
    ],
    spotlightNote: 'Conference Head portfolio allocation, council matrix auto-sync, and QR attendance reception scanners are 100% Free for everyone. Event Pro powers your Executive Board consoles, automated award scoring, and verifiable certificates.',
    ctaText: 'Deploy Event Pro / MUN Pro'
  },
  {
    id: 'event-elite',
    name: 'EVENT ELITE',
    tagline: 'For national summits, multi-hall conferences & flagship assemblies.',
    philosophy: 'SCALE',
    journeyStep: 'SCALE',
    priceINR: 4999,
    priceUSD: 64.99,
    isPerEvent: true,
    isLaunchPlan: false,
    badge: 'National Summits',
    accentColor: 'border-amber-500 text-amber-400',
    audience: 'events',
    features: [
      'Everything in Event Pro',
      'Maximum Event Customization & Bespoke Sponsor Branding',
      'Large Organizing Secretariat Seats & Granular Permissions',
      'Cryptographically Verifiable Digital Delegate Certificates',
      'Deep ZENVITRA Ecosystem Integration (Featured on Pulse & Press Wire)',
      'Premium Telemetry: Delegate engagement rates & sponsor analytics'
    ],
    ctaText: 'Select Event Elite'
  }
];

export const ORGANIZER_PLANS: Plan[] = [
  {
    id: 'org-pro',
    name: 'ORGANIZER PRO',
    tagline: 'For active institutions hosting events and conferences regularly.',
    philosophy: 'HOST REGULARLY',
    journeyStep: 'GROW',
    priceINR: 1499,
    priceAnnualINR: 1199,
    priceUSD: 19.99,
    priceAnnualUSD: 15.99,
    isLaunchPlan: false,
    badge: 'Monthly Pass',
    accentColor: 'border-blue-500/50 text-blue-400',
    audience: 'organizer',
    features: [
      'Host Multiple Active Simultaneous Events without per-event fees',
      '🏛️ Profile Showcase Tab: Featured Summits & Hackathons on your public profile',
      '🔗 Direct Embedded Registration Redirects & Custom Ticket checkout links',
      'Unified Centralized Organizer Dashboard & Recurring Attendee CRM',
      'Full Event Management Tools & Team Access',
      'Cross-Event Attendee Analytics & Re-engagement Campaigns',
      'Direct Cashfree Gateway Integration for Attendee Ticket Processing'
    ],
    ctaText: 'Get Organizer Pro'
  },
  {
    id: 'org-elite',
    name: 'ORGANIZER ELITE',
    tagline: 'For conference circuits, MUN federations & high-frequency conveners.',
    philosophy: 'SCALE CIRCUITS',
    journeyStep: 'SCALE',
    priceINR: 3999,
    priceAnnualINR: 3199,
    priceUSD: 49.99,
    priceAnnualUSD: 39.99,
    isFlagship: true,
    isLaunchPlan: true,
    badge: 'FLAGSHIP ORGANIZER PASS',
    accentColor: 'border-purple-500 text-purple-400 shadow-[0_0_35px_rgba(168,85,247,0.3)]',
    audience: 'organizer',
    features: [
      'High Attendee Capacity & Unlimited Simultaneous Events',
      'Advanced ZEN.MUN Suite deployed across every committee',
      'Larger Secretariat Teams & Granular Staff Access Controls',
      'Custom Branded Delegate Portals & Automated Bulk Certificates',
      'Priority Infrastructure & Dedicated Technical Chamber Support'
    ],
    ctaText: 'Get Organizer Elite'
  },
  {
    id: 'org-enterprise',
    name: 'ORGANIZER ENTERPRISE',
    tagline: 'For nationwide student leagues, collegiate circuits & global forums.',
    philosophy: 'NATIONAL ECOSYSTEM',
    journeyStep: 'SCALE',
    priceINR: 0,
    priceUSD: 0,
    isCustom: true,
    isLaunchPlan: false,
    badge: 'Custom Circuit OS',
    accentColor: 'border-amber-500 text-amber-400',
    audience: 'organizer',
    features: [
      'Operate an entire national or international event ecosystem',
      'Custom Circuit Ranking Tables & Inter-Summit League Matrix',
      'Bespoke Integrations, White-Label Domain Routing & Dedicated Engineering',
      'Custom Commercial Agreements & Multi-Tier Payment Routing'
    ],
    ctaText: 'Contact Circuit Team'
  }
];

export const ALL_PRICING_PLANS: Plan[] = [
  ...PEOPLE_PLANS,
  ...PROFESSIONAL_PLANS,
  ...EVENT_PLANS,
  ...ORGANIZER_PLANS
];

export function getPlanById(planId?: string | null): Plan | undefined {
  if (!planId) return undefined;
  const cleanId = planId.toLowerCase().trim();
  return ALL_PRICING_PLANS.find(p => p.id.toLowerCase() === cleanId);
}

export interface TaxCalculationParams {
  plan: Plan;
  currency: Currency;
  billingCycle: BillingCycle;
  userAge: number;
  isCollegeStudent: boolean;
}

export interface TaxCalculationResult {
  baseAmount: number;
  transactionTax: number;
  gstAmount: number;
  totalPayable: number;
  isGstExempt: boolean;
  gstRate: number;
  gstLabel: string;
  gstBadge: string;
  savingsAnnual: number;
}

export function calculatePlanTaxes({
  plan,
  currency,
  billingCycle,
  userAge,
  isCollegeStudent
}: TaxCalculationParams): TaxCalculationResult {
  let baseAmount = 0;
  let savingsAnnual = 0;

  if (!plan.isCustom && plan.priceINR > 0) {
    if (currency === 'INR') {
      if (billingCycle === 'annual' && plan.priceAnnualINR) {
        baseAmount = plan.priceAnnualINR;
        savingsAnnual = Math.max(0, plan.priceINR - plan.priceAnnualINR);
      } else {
        baseAmount = plan.priceINR;
      }
    } else {
      if (billingCycle === 'annual' && plan.priceAnnualUSD) {
        baseAmount = plan.priceAnnualUSD;
        savingsAnnual = Math.max(0, plan.priceUSD - plan.priceAnnualUSD);
      } else {
        baseAmount = plan.priceUSD;
      }
    }
  }

  if (baseAmount === 0) {
    return {
      baseAmount: 0,
      transactionTax: 0,
      gstAmount: 0,
      totalPayable: 0,
      isGstExempt: true,
      gstRate: 0,
      gstLabel: '100% Free Forever',
      gstBadge: '0% GST',
      savingsAnnual: 0
    };
  }

  // Flat Platform Surcharge: ₹9 (or $0.15 if USD)
  // For Elite plans: ₹0 surcharge
  const isElitePlan = plan.id.includes('elite') || plan.id.includes('enterprise');
  const transactionTax = isElitePlan ? 0 : (currency === 'INR' ? 9 : 0.15);

  // GST Statutory Rules:
  // - Age <= 18: 0% GST (Student / Minor Exemption)
  // - Age 19 to 21 OR College Student > 18: 5% Concessional GST
  // - Age > 21 Non-Student: 12% Standard Statutory GST
  let gstRate = 0.12;
  let gstLabel = '12% Statutory GST (Adult Citizen)';
  let gstBadge = '12% GST';
  let isGstExempt = false;

  if (userAge <= 18) {
    gstRate = 0;
    gstLabel = '0% Student Exemption (Age ≤ 18)';
    gstBadge = '0% GST (Exempt)';
    isGstExempt = true;
  } else if ((userAge >= 19 && userAge <= 21) || isCollegeStudent) {
    gstRate = 0.05;
    gstLabel = isCollegeStudent && userAge > 21
      ? '5% College Student Concession'
      : '5% Concessional GST (Ages 19-21 / College)';
    gstBadge = '5% GST (Concession)';
  }

  const gstAmount = Math.round((baseAmount * gstRate) * 100) / 100;
  const totalPayable = Math.round((baseAmount + transactionTax + gstAmount) * 100) / 100;

  return {
    baseAmount,
    transactionTax,
    gstAmount,
    totalPayable,
    isGstExempt,
    gstRate,
    gstLabel,
    gstBadge,
    savingsAnnual
  };
}

export function getPriceSuffix(plan: Plan, billingCycle: BillingCycle = 'monthly'): string {
  if (plan.isCustom) return 'for organizations';
  if (plan.priceINR === 0) return 'forever';
  if (plan.isPerEvent) return '/ event';
  if (billingCycle === 'annual') return '/ mo (billed annually)';
  return '/ month';
}
