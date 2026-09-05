'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Check, 
  Sparkles, 
  Crown, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Radio, 
  FileText, 
  Video, 
  MessageSquare, 
  Calendar, 
  Users, 
  Building, 
  Globe, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  TrendingUp, 
  Flame, 
  Award, 
  Laptop, 
  CheckCircle2, 
  Layers, 
  Share2, 
  Cpu, 
  CreditCard, 
  X,
  Compass,
  Briefcase,
  PenTool,
  Bookmark,
  Shield,
  Eye,
  Rocket
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/context/AuthContext';
import { isFounder, isAdmin } from '@/lib/founderControl';
import { useAccountCapabilities } from '@/hooks/useAccountCapabilities';
import { Footer } from '@/components/layout/Footer';

type AudienceType = 'people' | 'professional' | 'events' | 'organizer';
type BillingCycle = 'monthly' | 'annual';
type Currency = 'INR' | 'USD';

interface Plan {
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
}

export function PricingClient() {
  const [audience, setAudience] = useState<AudienceType>('people');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [viewMode, setViewMode] = useState<'launch' | 'all'>('launch');
  const [currency, setCurrency] = useState<Currency>('INR');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<Plan | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { 
    isProfessionalEnabled, 
    isEventEnabled, 
    enableProfessionalAccount, 
    disableProfessionalAccount, 
    enableEventAccount, 
    disableEventAccount 
  } = useAccountCapabilities();

  const { profile } = useAuth();
  const isPrivilegedTester = useMemo(() => {
    const userIdentifier = profile?.username || profile?.email || '';
    return isFounder(userIdentifier, profile?.role) || isAdmin(userIdentifier, profile?.role);
  }, [profile]);

  /* ── TAXATION & AGE / STUDENT VERIFICATION STATE ── */
  const [userAge, setUserAge] = useState<number>(17);
  const [isCollegeStudent, setIsCollegeStudent] = useState<boolean>(false);

  /* ── 1. PLANS DATA (Direct from the Bible) ── */
  const peoplePlans: Plan[] = [
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
      features: [
        'Everything in ZEN+',
        'ZENVITRA PRO Identity: Full Portfolio, Projects, Skills & Certificates',
        'Verified Pro Identity Badge & Custom Portfolio Showcase',
        'Experience & Achievements verified timeline',
        'Pro Writing & Press: High/unlimited publishing & advanced draft system',
        'Article Analytics & Reading Engagement telemetry',
        'ZEN Analytics Suite: Profile visits, audience trends & best-performing content',
        'ZEN AI Monthly Allowance: Polish writing, structure articles & generate captions',
        'Priority Event Access: Early registration windows (strictly zero unfair judging bias)',
        '🎖️ Verifiable Digital Certificates (ZEN.CERTIFY) & Plenary Archive Records',
        '📊 In-Depth Delegate Career Dossiers & Historical Committee Telemetry',
        '⚡ Priority Delegate Matrix Allocation Notification Windows'
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
      features: [
        'Everything in ZEN PRO',
        'Elite Identity: Maximum profile customization & executive layouts',
        'Advanced Portfolio Presentation & Enhanced Featured Sections',
        'Elite Creator & Writer: Maximum publishing tools & distribution power',
        'Advanced Content Management & Higher ZEN AI monthly allowance',
        'Elite SPARK: Advanced creator telemetry & highest bitrate streaming',
        'VIP Early Access: Test beta products, new ZEN tools & experimental features'
      ],
      ctaText: 'Join ZEN ELITE'
    }
  ];

  const professionalPlans: Plan[] = [
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
      features: [
        'Professional Profile: Identity, Description, Category & Contact Info',
        'Official Website links & Basic Team Information',
        'ZEN.PULSE: Publish official statements & build institutional followers',
        'Write & Publish: Organization author profile with basic article publishing',
        'Articles linked directly to your organization dossier',
        'Basic Analytics: Followers, post engagement & article read counts'
      ],
      ctaText: 'Create Starter Org'
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

  const eventPlans: Plan[] = [
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

  const organizerPlans: Plan[] = [
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
      features: [
        'Host Multiple Active Simultaneous Events without per-event fees',
        'Unified Centralized Organizer Dashboard & Recurring Attendee CRM',
        'Full Event Management Tools & Team Access',
        'Cross-Event Attendee Analytics & Re-engagement Campaigns'
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
      isLaunchPlan: false,
      badge: 'RECOMMENDED FOR CIRCUITS',
      accentColor: 'border-purple-500 text-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.25)]',
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
      features: [
        'Operate an entire national or international event ecosystem',
        'Custom Circuit Ranking Tables & Inter-Summit League Matrix',
        'Bespoke Integrations, White-Label Domain Routing & Dedicated Engineering',
        'Custom Commercial Agreements & Multi-Tier Payment Routing'
      ],
      ctaText: 'Contact Circuit Team'
    }
  ];

  /* ── 2. FILTERED PLANS BASED ON VIEW MODE ── */
  const activePlans = useMemo(() => {
    let source: Plan[] = [];
    if (audience === 'people') source = peoplePlans;
    else if (audience === 'professional') source = professionalPlans;
    else if (audience === 'events') source = eventPlans;
    else if (audience === 'organizer') source = organizerPlans;

    if (viewMode === 'launch') {
      // In launch view, show launch core plus flagship plans
      const launch = source.filter(p => p.isLaunchPlan);
      return launch.length > 0 ? launch : source;
    }
    return source;
  }, [audience, viewMode]);

  const formatPrice = (plan: Plan) => {
    if (plan.isCustom) return 'Custom';
    if (currency === 'INR') {
      if (plan.priceINR === 0) return '₹0';
      if (plan.isPerEvent) return `₹${plan.priceINR.toLocaleString('en-IN')}`;
      if (billingCycle === 'annual' && plan.priceAnnualINR) {
        return `₹${plan.priceAnnualINR.toLocaleString('en-IN')}`;
      }
      return `₹${plan.priceINR.toLocaleString('en-IN')}`;
    } else {
      if (plan.priceUSD === 0) return '$0';
      if (plan.isPerEvent) return `$${plan.priceUSD}`;
      if (billingCycle === 'annual' && plan.priceAnnualUSD) {
        return `$${plan.priceAnnualUSD}`;
      }
      return `$${plan.priceUSD}`;
    }
  };

  /* ── TAX CALCULATION FORMULA (0.5% + ₹19 Tax; 0% GST for students/<=18, 12% GST for >18) ── */
  const calculatePlanTaxes = (plan: Plan) => {
    let baseAmount = 0;
    if (!plan.isCustom && plan.priceINR > 0) {
      if (currency === 'INR') {
        baseAmount = (billingCycle === 'annual' && plan.priceAnnualINR) ? plan.priceAnnualINR : plan.priceINR;
      } else {
        baseAmount = (billingCycle === 'annual' && plan.priceAnnualUSD) ? plan.priceAnnualUSD : plan.priceUSD;
      }
    }

    if (baseAmount === 0) {
      return { baseAmount: 0, transactionTax: 0, gstAmount: 0, totalPayable: 0, isGstExempt: true };
    }

    // 0.5% + ₹19 (or $0.25 if USD)
    const transactionTax = currency === 'INR'
      ? Math.round(((baseAmount * 0.005) + 19) * 100) / 100
      : Math.round(((baseAmount * 0.005) + 0.25) * 100) / 100;

    // GST Rule:
    // - Age <= 18 (School / Minor): 0% GST (Exempt)
    // - Age 19 to 21 OR College Student > 18: 5% GST (Concessional)
    // - Age > 21 (Non-College Adult): 12% GST (Statutory)
    let gstRate = 0.12;
    let gstLabel = '12% Statutory GST';
    let gstBadge = '12% GST';
    let isGstExempt = false;

    if (userAge <= 18) {
      gstRate = 0;
      gstLabel = '0% Student Exemption (Age ≤ 18)';
      gstBadge = '0% GST (FREE)';
      isGstExempt = true;
    } else if ((userAge >= 19 && userAge <= 21) || isCollegeStudent) {
      gstRate = 0.05;
      gstLabel = isCollegeStudent && userAge > 21 
        ? '5% College Student Concession' 
        : '5% Concessional GST (Ages 19-21 / College)';
      gstBadge = '5% GST';
    }

    const gstAmount = Math.round((baseAmount * gstRate) * 100) / 100;
    const totalPayable = Math.round((baseAmount + transactionTax + gstAmount) * 100) / 100;

    return { baseAmount, transactionTax, gstAmount, totalPayable, isGstExempt, gstRate, gstLabel, gstBadge };
  };

  const getPriceSuffix = (plan: Plan) => {
    if (plan.isCustom) return 'for organizations';
    if (plan.priceINR === 0) return 'forever';
    if (plan.isPerEvent) return '/ event';
    if (billingCycle === 'annual') return '/ mo (billed annually)';
    return '/ month';
  };

  /* ── 3. FAQ DATA ── */
  const faqs = [
    {
      q: 'Why is publishing articles free for everyone in ZENVITRA?',
      a: 'Freedom of expression should never be a premium privilege. In ZENVITRA, every human being has an inherent right to have an author identity, write blogs, publish investigative reporting, and share civic solutions. Premium tiers improve creator tools, draft systems, analytics, and publication workflows — they never gate your right to speak.'
    },
    {
      q: 'Do subscriptions give delegates an unfair advantage in MUN awards or event judging?',
      a: 'Absolutely not. Event Pro and ZEN PRO provide procedural superpowers like early registration windows and priority opportunities, but our constitutional code strictly forbids any algorithmic bias, scoring manipulation, or award advantages. Merit, diplomatic intellect, and resolution drafting decide awards — not money.'
    },
    {
      q: 'How does the ZENVITRA Publication System work for organizations?',
      a: 'Professional Pro enables organizations to operate an authentic, multi-tier newsroom. Rather than one person posting everything, you assign roles: Writers draft articles, Editors review and suggest line edits, and Publishers or Administrators conduct final legal checks before pushing the story to the global Zenvitra Press wire.'
    },
    {
      q: 'Which parts of ZEN.MUN are Free vs. Subscription-Based?',
      a: 'Core delegate participation is 100% FREE in ZEN FREE — any delegate can access their assigned committee, speak on the GSL clock, raise Points of Information (POIs), table working papers, and vote on resolutions. Furthermore, the Full Conference Head Allocation Console, Unlimited Country/Portfolio Matrix Auto-Sync, and the Real-Time Delegate Attendance QR Scanner & Reception Desk Terminal are 100% FREE FOREVER for all organizers in EVENT STARTER — Secretariats can manually assign portfolios and scan delegate QR passes without paying a single rupee. Advanced conference host tools — such as cryptographically verifiable digital certificates (ZEN.CERTIFY) with public QR validation, automated award scoring matrices, multi-room audio transceivers, and deep delegate performance dossiers — are available through the Event Pro / MUN Pro conference subscription.'
    },
    {
      q: 'What is the platform fee for paid event tickets?',
      a: 'For paid registrations, ZENVITRA charges a transparent 2.5% to 5% platform fee to maintain high-availability infrastructure and identity verification. All payment gateway processing charges and taxes are shown transparently with zero hidden markups.'
    },
    {
      q: 'Can I switch between monthly and annual plans at any time?',
      a: 'Yes! You can upgrade, downgrade, or switch billing cycles anytime from your Unified ZENVITRA Dashboard. If you switch to an annual plan, you immediately lock in approximately 20% savings (equivalent to 2 months free).'
    }
  ];

  return (
    <div className="min-h-screen bg-[#030407] text-white flex flex-col font-sans selection:bg-cyan-500/30">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-20">
        
        {/* ── SECTION 1: HERO & THE GOLDEN PRINCIPLE ── */}
        <div className="text-center space-y-6 pt-6 sm:pt-12 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />

          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wider uppercase shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>THE ZENVITRA PRICING &amp; MONETIZATION BIBLE</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            One Membership. Increasing Power.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Zero Feature Walls.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-neutral-400 max-w-2xl mx-auto font-sans leading-relaxed">
            ZENVITRA does not sell separate subscriptions for chat, social, video, press, or identity. 
            One unified membership unlocks increasing capability across the entire ecosystem as your ambitions grow.
          </p>

          {/* The Golden Journey Pipeline */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-mono">
            <span className="px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-neutral-300 flex items-center gap-1.5">
              <span className="text-cyan-400">✍️</span> 1. CREATE
            </span>
            <span className="text-neutral-600">→</span>
            <span className="px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-neutral-300 flex items-center gap-1.5">
              <span className="text-indigo-400">📈</span> 2. GROW
            </span>
            <span className="text-neutral-600">→</span>
            <span className="px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold flex items-center gap-1.5">
              <span className="text-purple-400">💼</span> 3. PROFESSIONALIZE
            </span>
            <span className="text-neutral-600">→</span>
            <span className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold flex items-center gap-1.5">
              <span className="text-amber-400">🌍</span> 4. SCALE
            </span>
          </div>

          {/* Dual Constitutional Pillars: Golden Principle + 25% Escrow Mandate */}
          <div className="mt-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 text-left relative z-10">
            {/* Pillar 1: The Golden Principle */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-cyan-950/20 via-black to-[#080910] border border-cyan-500/20 flex items-start gap-3.5 shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                  The Golden Principle
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  <span className="text-white font-semibold">&ldquo;Free to participate. Paid to unlock greater capability.&rdquo;</span>{' '}
                  Freedom of expression is never a paid feature. Everyone can write articles, chat, and participate. Upgrades exist as your tools and reach grow.
                </p>
              </div>
            </div>

            {/* Pillar 2: 25% Constitutional Escrow Mandate */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-950/20 via-black to-[#080910] border border-amber-500/25 flex items-start gap-3.5 shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                    25% Profit Endowment
                  </h4>
                  <Link href="/constitution" className="text-[10px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-0.5">
                    <span>Charter</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </Link>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  An immutable <strong className="text-white font-semibold">25% of all profits</strong> is distributed <strong className="text-amber-300">every 4 months</strong> to student scholarships and school supplies—verified with public receipts and offline giveaway videos broadcast on <strong className="text-cyan-300">ZEN.FLUX</strong> &amp; socials.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: INTERACTIVE CONTROLS BAR ── */}
        <div className="space-y-4">
          {/* Universal Founder Subscription Banner */}
          {isPrivilegedTester && (
            <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-amber-500/15 border border-amber-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono shadow-[0_0_30px_rgba(251,191,36,0.15)]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30">
                  <Crown className="w-5 h-5 text-amber-400" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
                    <span>👑 UNIVERSAL FOUNDER SUBSCRIPTION ACTIVE</span>
                  </span>
                  <p className="text-[11px] text-neutral-400 font-sans">
                    You have sovereign universal clearance to every single tool, chamber, OS feature, and VIP pass across Zenvitra.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-400 text-black text-[10px] font-mono font-black uppercase tracking-wider shrink-0 shadow-sm">
                100% UNLOCKED
              </span>
            </div>
          )}

          {/* Account Status / Capability Header Banner (FOUNDER & ADMIN TESTING ONLY) */}
          {isPrivilegedTester && (
            <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="text-amber-400 text-[11px] uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Sandbox Test Bar:</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px]">
                  👤 Citizen Active
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] border flex items-center gap-1 ${
                  isProfessionalEnabled 
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
                    : 'bg-white/5 text-neutral-500 border-white/10'
                }`}>
                  <span>💼 Org:</span>
                  <span>{isProfessionalEnabled ? 'Enabled' : 'Locked'}</span>
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] border flex items-center gap-1 ${
                  isEventEnabled 
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                    : 'bg-white/5 text-neutral-500 border-white/10'
                }`}>
                  <span>🎟️ Event OS:</span>
                  <span>{isEventEnabled ? 'Enabled' : 'Locked'}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {!isProfessionalEnabled ? (
                  <button
                    type="button"
                    onClick={enableProfessionalAccount}
                    className="text-[10px] font-bold text-purple-400 hover:text-purple-300 underline cursor-pointer"
                  >
                    + Enable Org Acc (Test)
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={disableProfessionalAccount}
                    className="text-[10px] text-neutral-400 hover:text-neutral-300 cursor-pointer"
                  >
                    Disable Org (Test Locked View)
                  </button>
                )}
                <span className="text-neutral-600">•</span>
                {!isEventEnabled ? (
                  <button
                    type="button"
                    onClick={enableEventAccount}
                    className="text-[10px] font-bold text-rose-400 hover:text-rose-300 underline cursor-pointer"
                  >
                    + Enable Event Acc (Test)
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={disableEventAccount}
                    className="text-[10px] text-neutral-400 hover:text-neutral-300 cursor-pointer"
                  >
                    Disable Event (Test Locked View)
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Audience Category Selector */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 p-1.5 bg-[#080911]/90 backdrop-blur-2xl rounded-2xl border border-white/10 max-w-4xl mx-auto shadow-2xl">
            <button
              type="button"
              onClick={() => setAudience('people')}
              className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer w-full text-center ${
                audience === 'people'
                  ? 'bg-cyan-500 text-black shadow-[0_0_25px_rgba(6,182,212,0.45)]'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span className="truncate">People (Individuals)</span>
            </button>

            <button
              type="button"
              onClick={() => setAudience('professional')}
              className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer w-full text-center ${
                audience === 'professional'
                  ? 'bg-purple-500 text-white shadow-[0_0_25px_rgba(168,85,247,0.45)]'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Briefcase className="w-4 h-4 shrink-0" />
              <span className="truncate">Professional (Orgs)</span>
              {!isProfessionalEnabled && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white/10 text-neutral-400 border border-white/10 shrink-0">
                  🔒 Gated
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setAudience('events')}
              className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer w-full text-center ${
                audience === 'events'
                  ? 'bg-rose-500 text-white shadow-[0_0_25px_rgba(244,63,94,0.45)]'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span className="truncate">ZEN.EVENTS</span>
              {!isEventEnabled && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white/10 text-neutral-400 border border-white/10 shrink-0">
                  🔒 Gated
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setAudience('organizer')}
              className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer w-full text-center ${
                audience === 'organizer'
                  ? 'bg-amber-500 text-black shadow-[0_0_25px_rgba(245,158,11,0.45)]'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Crown className="w-4 h-4 shrink-0" />
              <span className="truncate">Organizers</span>
              {!isEventEnabled && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white/10 text-neutral-400 border border-white/10 shrink-0">
                  🔒 Gated
                </span>
              )}
            </button>
          </div>

          {/* Sub-bar: Billing Toggle + Launch View Mode + Currency */}
          <div className="flex flex-wrap items-center justify-between gap-4 max-w-5xl mx-auto px-2 pt-2">
            
            {/* View Mode: Launch Core 4 vs All Spectrum */}
            <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] border border-white/10 rounded-xl text-xs font-mono">
              <span className="text-neutral-500 pl-2 text-[11px] hidden sm:inline">Strategy View:</span>
              <button
                type="button"
                onClick={() => setViewMode('launch')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'launch'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>Launch Core (Flagships)</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'all'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Full Ecosystem Roadmap</span>
              </button>
            </div>

            {/* Currency & Billing Cycle (if recurring) */}
            <div className="flex items-center gap-3">
              {audience !== 'events' && (
                <div className="flex items-center gap-2 p-1 bg-white/[0.04] border border-white/10 rounded-xl text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                      billingCycle === 'monthly' ? 'bg-white/10 text-white font-bold' : 'text-neutral-400'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('annual')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                      billingCycle === 'annual' ? 'bg-cyan-500 text-black font-bold' : 'text-neutral-400'
                    }`}
                  >
                    <span>Annual</span>
                    <span className="text-[10px] px-1 rounded bg-black/40 text-cyan-200">Save 20%</span>
                  </button>
                </div>
              )}

              {/* Currency Toggle */}
              <div className="flex items-center p-1 bg-white/[0.04] border border-white/10 rounded-xl text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setCurrency('INR')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    currency === 'INR' ? 'bg-white/10 text-cyan-300 font-bold' : 'text-neutral-500'
                  }`}
                >
                  ₹ INR
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    currency === 'USD' ? 'bg-white/10 text-cyan-300 font-bold' : 'text-neutral-500'
                  }`}
                >
                  $ USD
                </button>
              </div>
            </div>
          </div>

          {/* Launch Phase Banner Notification */}
          {viewMode === 'launch' && (
            <div className="max-w-5xl mx-auto px-4 py-2 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-[11px] font-mono text-cyan-300 flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <Rocket className="w-3.5 h-3.5" />
                <span><strong>Launch Phase Focus:</strong> Highlighting our 4 primary commercial flagship products to prevent tier confusion.</span>
              </span>
              <button 
                type="button" 
                onClick={() => setViewMode('all')}
                className="underline hover:text-white cursor-pointer"
              >
                Expand all tiers →
              </button>
            </div>
          )}
        </div>

        {/* ── SECTION 3: CONDITIONAL GATED OR PLAN CARDS GRID ── */}
        {audience === 'professional' && !isProfessionalEnabled ? (
          /* Gated Card for Professional Pricing */
          <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-[#080910] border border-purple-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300 mx-auto">
              <Briefcase className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono">
                <span>🔒 PROFESSIONAL ACCREDITATION REQUIRED</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-white">
                Professional Organization Pricing Restricted
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                Institutional memberships and the multi-role <span className="text-white font-semibold">ZENVITRA Publication System</span> are reserved for verified organizations, startups, NGOs, and educational institutions.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              {isPrivilegedTester ? (
                <button
                  type="button"
                  onClick={enableProfessionalAccount}
                  className="px-6 py-3 rounded-2xl bg-purple-500 hover:bg-purple-400 text-white font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(168,85,247,0.4)]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>⚡ Founder/Admin Override: Unlock Org View</span>
                </button>
              ) : (
                <a
                  href="mailto:secretariat@zenvitra.xyz?subject=Professional%20Accreditation%20Application"
                  className="px-6 py-3 rounded-2xl bg-purple-500 hover:bg-purple-400 text-white font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(168,85,247,0.4)]"
                >
                  <span>✉️ Apply for Organization Accreditation</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => setAudience('people')}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs transition cursor-pointer"
              >
                Return to Individual Plans
              </button>
            </div>
          </div>
        ) : (audience === 'events' || audience === 'organizer') && !isEventEnabled ? (
          /* Gated Card for Event Pricing */
          <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-[#080910] border border-rose-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-rose-500/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-300 mx-auto">
              <Calendar className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                <span>🔒 EVENT ORGANIZER ACCREDITATION REQUIRED</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-white">
                ZEN.EVENTS &amp; Organizer Pricing Restricted
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                The <span className="text-white font-semibold">ZEN.MUN Operating System</span>, digital chit consoles, and circuit organizer plans are exclusively available to accredited summit directors and event secretariats.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              {isPrivilegedTester ? (
                <button
                  type="button"
                  onClick={enableEventAccount}
                  className="px-6 py-3 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(244,63,94,0.4)]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>⚡ Founder/Admin Override: Unlock Event View</span>
                </button>
              ) : (
                <a
                  href="mailto:secretariat@zenvitra.xyz?subject=Event%20Organizer%20Accreditation%20Application"
                  className="px-6 py-3 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(244,63,94,0.4)]"
                >
                  <span>✉️ Apply for Event Host Accreditation</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => setAudience('people')}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs transition cursor-pointer"
              >
                Return to Individual Plans
              </button>
            </div>
          </div>
        ) : (
        <div className={`grid gap-6 ${
          activePlans.length === 1 
            ? 'max-w-md mx-auto grid-cols-1' 
            : activePlans.length === 2 
            ? 'max-w-3xl mx-auto grid-cols-1 sm:grid-cols-2' 
            : activePlans.length === 3 
            ? 'max-w-5xl mx-auto grid-cols-1 md:grid-cols-3' 
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        }`}>
          {activePlans.map((plan) => {
            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl bg-[#08090e] border p-6 flex flex-col justify-between transition-all duration-300 hover:translate-y-[-4px] backdrop-blur-xl ${
                  plan.isFlagship 
                    ? 'border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.2)] bg-gradient-to-b from-purple-950/20 to-[#08090e]' 
                    : 'border-white/10 hover:border-white/25'
                }`}
              >
                {/* Flagship / Badge Tag */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap pointer-events-none flex items-center justify-center">
                    <span className={`px-3.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shadow-lg whitespace-nowrap inline-flex items-center gap-1.5 leading-none ${
                      plan.isFlagship
                        ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 text-white shadow-[0_4px_20px_rgba(168,85,247,0.4)] border border-purple-300/30'
                        : 'bg-[#12141f] border border-white/20 text-neutral-200 shadow-md'
                    }`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Card Top */}
                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-cyan-400 font-bold tracking-widest uppercase">
                        {plan.journeyStep}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {plan.philosophy}
                      </span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-white">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed min-h-[36px]">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="pt-2 border-t border-white/10">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-display font-black text-white">
                        {formatPrice(plan)}
                      </span>
                      <span className="text-xs font-mono text-neutral-400">
                        {getPriceSuffix(plan)}
                      </span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-2.5 pt-4 border-t border-white/10">
                    <span className="text-[11px] font-mono font-semibold text-neutral-400 uppercase tracking-wider block">
                      What unlocks:
                    </span>
                    <ul className="space-y-2 text-xs text-neutral-300">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Spotlight Note */}
                  {plan.spotlightNote && (
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-[11px] font-mono text-neutral-400 leading-relaxed italic">
                      &ldquo;{plan.spotlightNote}&rdquo;
                    </div>
                  )}
                </div>

                {/* Card Bottom CTA */}
                <div className="pt-6 mt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setSelectedPlanForModal(plan)}
                    className={`w-full py-3 rounded-2xl font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      plan.isFlagship
                        ? 'bg-purple-500 hover:bg-purple-400 text-white shadow-[0_0_25px_rgba(168,85,247,0.4)]'
                        : plan.priceINR === 0
                        ? 'bg-white hover:bg-zinc-200 text-black shadow'
                        : 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-[10px] font-mono text-neutral-500 text-center mt-2">
                    {plan.priceINR === 0 ? 'No credit card needed' : 'Instant activation • Cancel anytime'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* ── SECTION 4: THE 3 FLAGSHIP ARCHITECTURES DEEP-DIVE ── */}
        <div className="space-y-8 pt-8 border-t border-white/10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Ecosystem Superpowers
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
              Groundbreaking Software Inside ZENVITRA
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
              ZENVITRA doesn&apos;t just host pages — we build high-precision operating systems for real-world civic, editorial, and diplomatic action.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Feature 1: The ZEN.MUN Operating System */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-purple-950/20 to-[#07080d] border border-purple-500/30 space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <Crown className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                  INSIDE EVENT PRO
                </span>
                <h3 className="text-lg font-display font-bold text-white">
                  🏛️ ZEN.MUN Operating System
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  The complete end-to-end digital suite for Model United Nations:
                </p>
              </div>
              <ul className="space-y-2 text-xs text-neutral-400 font-mono">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>Delegate Matrix:</strong> Dynamic country &amp; portfolio allocation database.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>Executive Board Console:</strong> Live attendance, GSL timer, POIs &amp; motions queue.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>Digital Chits:</strong> Instant, paperless communication between delegates and chairs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>Scoring &amp; Rankings:</strong> Automated scoring formulas for bias-free awards.</span>
                </li>
              </ul>
            </div>

            {/* Feature 2: The Publication System */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-cyan-950/20 to-[#07080d] border border-cyan-500/30 space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                  INSIDE PROFESSIONAL PRO
                </span>
                <h3 className="text-lg font-display font-bold text-white">
                  📰 ZENVITRA Publication System
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Empowers organizations to operate a full decentralized newsroom:
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-cyan-300">
                  <span>✍️</span> <strong>Writers:</strong> Draft articles &amp; cite sources
                </div>
                <div className="text-neutral-600 pl-4">↓</div>
                <div className="flex items-center gap-2 text-indigo-300">
                  <span>📝</span> <strong>Editors:</strong> Review, fact-check &amp; refine
                </div>
                <div className="text-neutral-600 pl-4">↓</div>
                <div className="flex items-center gap-2 text-emerald-300">
                  <span>✅</span> <strong>Administrators:</strong> Approve &amp; broadcast
                </div>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Run accredited journals like <em>The Youth Journal</em> under your brand with complete editorial accountability.
              </p>
            </div>

            {/* Feature 3: One Unified ZENVITRA Dashboard */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-amber-950/20 to-[#07080d] border border-amber-500/30 space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                <Laptop className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  ECOSYSTEM ARCHITECTURE
                </span>
                <h3 className="text-lg font-display font-bold text-white">
                  💻 One Unified Dashboard
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  ZENVITRA is not six disconnected apps — it is one unified digital identity:
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 rounded-lg bg-black/50 border border-white/10 text-neutral-300">
                  👤 Digital Identity
                </div>
                <div className="p-2 rounded-lg bg-black/50 border border-white/10 text-neutral-300">
                  💬 ZEN.chat
                </div>
                <div className="p-2 rounded-lg bg-black/50 border border-white/10 text-neutral-300">
                  📡 ZEN.PULSE
                </div>
                <div className="p-2 rounded-lg bg-black/50 border border-white/10 text-neutral-300">
                  🎬 ZEN.FLUX
                </div>
                <div className="p-2 rounded-lg bg-black/50 border border-white/10 text-neutral-300">
                  ✍️ Press &amp; Journalism
                </div>
                <div className="p-2 rounded-lg bg-black/50 border border-white/10 text-neutral-300">
                  🎟️ ZEN.EVENTS
                </div>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Manage your conversations, publications, professional accounts, and event delegations seamlessly.
              </p>
            </div>
          </div>
        </div>

        {/* ── SECTION 5: TRANSPARENT REVENUE ENGINES ── */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-black via-[#080a10] to-black border border-white/10 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Financial Integrity &amp; Transparency
            </span>
            <h2 className="text-2xl font-display font-bold text-white">
              The 5 Engines of ZENVITRA Revenue
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              We never monetize user surveillance or sell private data. Our commercial model is built on mutual value and software excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <span className="text-xl">1️⃣</span>
              <h4 className="text-xs font-mono font-bold text-white">Subscriptions</h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                People, Professional organizations, and frequent event organizers unlocking greater tools.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <span className="text-xl">2️⃣</span>
              <h4 className="text-xs font-mono font-bold text-white">Event Transactions</h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                A transparent <strong>2.5%–5% platform fee</strong> on paid registrations with zero hidden charges.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <span className="text-xl">3️⃣</span>
              <h4 className="text-xs font-mono font-bold text-white">Modular Add-ons</h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Extra team seats and certificate packs without forcing smaller organizers into giant tiers.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <span className="text-xl">4️⃣</span>
              <h4 className="text-xs font-mono font-bold text-white">Ethical Ads (Later)</h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Separated from organic journalism, clearly labeled, non-intrusive, and strictly privacy-first.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <span className="text-xl">5️⃣</span>
              <h4 className="text-xs font-mono font-bold text-white">Future ZEN AI</h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Subscriptions include generous monthly allowances with optional transparent usage packs.
              </p>
            </div>
          </div>
        </div>

        {/* ── SECTION 6: FAQ ACCORDION ── */}
        <div className="space-y-6 pt-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Answers &amp; Clarity
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-neutral-300 leading-relaxed border-t border-white/5">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SECTION 7: BOTTOM CTA ── */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-black border border-cyan-500/30 text-center space-y-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[90px] pointer-events-none" />
          <h2 className="text-2xl sm:text-4xl font-display font-black text-white">
            Ready to Begin Your ZENVITRA Journey?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed">
            Create your digital identity today for ₹0, write your first article, and join the global youth chamber.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/signup"
              className="px-8 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center gap-2"
            >
              <span>Join ZENVITRA Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/manifesto"
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-semibold transition border border-white/15"
            >
              Read Our Manifesto
            </Link>
          </div>
        </div>
      </main>

      {/* ── CHECKOUT / SUBSCRIPTION SIMULATOR MODAL ── */}
      {selectedPlanForModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPlanForModal(null)}
        >
          <div 
            className="w-full max-w-lg bg-[#090b12] border border-white/20 rounded-3xl p-6 space-y-6 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                  CONFIRM SELECTION
                </span>
                <h3 className="text-lg font-display font-bold text-white">
                  {selectedPlanForModal.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlanForModal(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* AGE & STUDENT VERIFICATION SELECTOR */}
            {selectedPlanForModal.priceINR > 0 && !selectedPlanForModal.isCustom && (
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    Tax &amp; GST Verification Status
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    Indian Statutory GST Rules
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                  {/* Tier 1: School Student / Age <= 18 (0% GST) */}
                  <div
                    onClick={() => {
                      setUserAge(17);
                      setIsCollegeStudent(false);
                    }}
                    className={`p-2.5 rounded-xl border cursor-pointer transition flex flex-col justify-between space-y-1.5 ${
                      userAge <= 18
                        ? 'bg-emerald-500/10 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                        : 'bg-black/40 border-white/10 text-neutral-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1">
                        <span>🎓 Age ≤ 18</span>
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        0% GST
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-400 leading-snug">
                      School student / minor: 100% GST Exempt.
                    </p>
                  </div>

                  {/* Tier 2: Age 19 to 21 or College Student (5% GST) */}
                  <div
                    onClick={() => {
                      if (userAge <= 18 || userAge > 21) setUserAge(20);
                      setIsCollegeStudent(true);
                    }}
                    className={`p-2.5 rounded-xl border cursor-pointer transition flex flex-col justify-between space-y-1.5 ${
                      ((userAge >= 19 && userAge <= 21) || (userAge > 18 && isCollegeStudent))
                        ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                        : 'bg-black/40 border-white/10 text-neutral-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1">
                        <span>🏛️ Ages 19–21 / College</span>
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                        5% GST
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-400 leading-snug">
                      Aged 19–21 or enrolled college student above 18.
                    </p>
                  </div>

                  {/* Tier 3: Adult Citizen > 21 Non-Student (12% GST) */}
                  <div
                    onClick={() => {
                      if (userAge <= 21) setUserAge(24);
                      setIsCollegeStudent(false);
                    }}
                    className={`p-2.5 rounded-xl border cursor-pointer transition flex flex-col justify-between space-y-1.5 ${
                      userAge > 21 && !isCollegeStudent
                        ? 'bg-purple-500/10 border-purple-400 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                        : 'bg-black/40 border-white/10 text-neutral-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1">
                        <span>💼 Adult (&gt; 21)</span>
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                        12% GST
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-400 leading-snug">
                      Standard statutory GST for working adults above 21.
                    </p>
                  </div>
                </div>

                {/* Age Stepper & College Student Checkbox */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] font-mono text-neutral-400 border-t border-white/5">
                  <label htmlFor="age-input" className="flex items-center gap-1.5">
                    <span>Declared Age:</span>
                    <input
                      id="age-input"
                      type="number"
                      min={10}
                      max={99}
                      value={userAge}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 18;
                        setUserAge(val);
                      }}
                      className="w-12 px-2 py-0.5 rounded bg-black border border-white/20 text-white font-mono text-center focus:outline-none focus:border-cyan-400"
                    />
                    <span>years old</span>
                  </label>

                  <label className="flex items-center gap-1.5 text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCollegeStudent}
                      onChange={(e) => setIsCollegeStudent(e.target.checked)}
                      className="accent-cyan-500 cursor-pointer"
                    />
                    <span className="text-[10px]">Active College / University Student (Unlocks 5% GST)</span>
                  </label>
                </div>
              </div>
            )}

            {/* TOTAL ITEMIZED BREAKDOWN */}
            {(() => {
              const { baseAmount, transactionTax, gstAmount, totalPayable, isGstExempt, gstRate, gstLabel } = calculatePlanTaxes(selectedPlanForModal);
              const currSymbol = currency === 'INR' ? '₹' : '$';

              return (
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3 font-mono">
                  <div className="space-y-1.5 text-xs text-neutral-400 pb-2 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <span>Base Plan ({selectedPlanForModal.name})</span>
                      <span className="text-white font-semibold">
                        {baseAmount === 0 ? '₹0.00' : `${currSymbol}${baseAmount.toFixed(2)}`}
                      </span>
                    </div>

                    {baseAmount > 0 && (
                      <>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-neutral-400 flex items-center gap-1">
                            <span>Transaction &amp; Gateway Protocol Tax:</span>
                            <span className="text-neutral-500 text-[10px]">(0.5% + {currency === 'INR' ? '₹19' : '$0.25'})</span>
                          </span>
                          <span className="text-amber-300 font-semibold">
                            +{currSymbol}{transactionTax.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-neutral-400 flex items-center gap-1">
                            <span>Goods &amp; Services Tax (GST):</span>
                            <span className="text-[10px] text-neutral-500">
                              ({gstLabel})
                            </span>
                          </span>
                          <span className={`font-semibold ${
                            isGstExempt 
                              ? 'text-emerald-400' 
                              : gstRate === 0.05 
                              ? 'text-cyan-300' 
                              : 'text-purple-300'
                          }`}>
                            {isGstExempt ? '₹0.00 (Exempt)' : `+${currSymbol}${gstAmount.toFixed(2)}`}
                          </span>
                        </div>
                      </>
                    )}

                    {billingCycle === 'annual' && selectedPlanForModal.priceAnnualINR && (
                      <div className="text-[11px] text-emerald-400 flex items-center justify-between pt-1">
                        <span className="flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Annual Billing Privilege:</span>
                        </span>
                        <span>Saved ~20%</span>
                      </div>
                    )}
                  </div>

                  {/* Final Payable Total */}
                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-xs text-neutral-400 block">Final Total Payable</span>
                      <span className="text-[10px] text-neutral-500">
                        {baseAmount === 0 ? '100% Free Forever' : `All taxes & protocol levies included`}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-display font-black text-cyan-300">
                        {baseAmount === 0 ? '₹0.00' : `${currSymbol}${totalPayable.toFixed(2)}`}
                      </span>
                      <span className="text-[10px] text-neutral-500 block">
                        {getPriceSuffix(selectedPlanForModal)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="space-y-2">
              <span className="text-[11px] font-mono text-neutral-400 uppercase">Included in this plan:</span>
              <ul className="space-y-1.5 text-xs text-neutral-300">
                {selectedPlanForModal.features.slice(0, 4).map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedPlanForModal(null)}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-xs font-mono transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedPlanForModal(null);
                  setIsSuccessModalOpen(true);
                }}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm &amp; Activate Plan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CONFIRMATION SUCCESS MODAL ── */}
      {isSuccessModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsSuccessModalOpen(false)}
        >
          <div 
            className="w-full max-w-md bg-[#090b12] border border-cyan-500/40 rounded-3xl p-6 space-y-4 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 mx-auto">
              <Sparkles className="w-7 h-7 animate-pulse" />
            </div>
            <h3 className="text-xl font-display font-bold text-white">
              Ecosystem Plan Registered!
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              Your tier preference has been recorded. In the active beta preview, all ecosystem features across identity, writing, chat, and summits are fully accessible.
            </p>
            <button
              type="button"
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              Continue Exploring ZENVITRA
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
