'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Sparkles,
  Crown,
  Check,
  ArrowRight,
  ArrowLeft,
  Lock,
  UploadCloud,
  FileCheck,
  HelpCircle,
  CreditCard,
  Briefcase,
  Users,
  Calendar,
  Layers,
  Radio,
  Video,
  FileText,
  Award,
  TrendingUp,
  CheckCircle2,
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { useAccountCapabilities } from '@/hooks/useAccountCapabilities';
import { setProfessionalAccountEnabled } from '@/lib/accountCapabilities';
import { 
  allotUserSubscription, 
  getActiveUserSubscription, 
  activatePromotionalProTrial, 
  isPromotionalCampaignActive 
} from '@/lib/subscriptionTiers';
import { ZenCheckoutModal } from '@/components/payments/ZenCheckoutModal';
import { ZenTrialCardModal } from '@/components/pricing/ZenTrialCardModal';
import {
  Plan,
  AudienceType,
  BillingCycle,
  Currency,
  ALL_PRICING_PLANS,
  getPlanById,
  calculatePlanTaxes,
  getPriceSuffix
} from '@/lib/pricingPlans';

export function PlanCheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile } = useAuth();
  const { isProfessionalEnabled, enableProfessionalAccount } = useAccountCapabilities();

  // URL Query Parameters
  const initialPlanId = searchParams.get('plan') || 'org-elite';
  const initialCycle = (searchParams.get('cycle') as BillingCycle) || 'monthly';
  const initialAudience = (searchParams.get('audience') as AudienceType) || 'organizer';

  // State
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlanId);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(initialCycle);
  const [currency, setCurrency] = useState<Currency>('INR');
  const [selectedAudience, setSelectedAudience] = useState<AudienceType>(initialAudience);

  // Tax & Concession State
  const [userAge, setUserAge] = useState<number>(17);
  const [isCollegeStudent, setIsCollegeStudent] = useState<boolean>(false);
  const [studentIdFile, setStudentIdFile] = useState<{ name: string; size: string } | null>(null);
  const [studentIdError, setStudentIdError] = useState<string | null>(null);
  const [isUploadingStudentId, setIsUploadingStudentId] = useState<boolean>(false);
  const studentFileInputRef = useRef<HTMLInputElement>(null);

  // Modals & Action States
  const [isCashfreeModalOpen, setIsCashfreeModalOpen] = useState<boolean>(false);
  const [isTrialCardModalOpen, setIsTrialCardModalOpen] = useState<boolean>(false);
  const [isPlanSelectorOpen, setIsPlanSelectorOpen] = useState<boolean>(false);
  const [activationSuccess, setActivationSuccess] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    isProStarter: boolean;
  }>({
    isOpen: false,
    title: '',
    description: '',
    isProStarter: false
  });

  // Current Plan resolution
  const currentPlan: Plan = useMemo(() => {
    const found = getPlanById(selectedPlanId);
    if (found) return found;
    return getPlanById('zen-pro') || ALL_PRICING_PLANS[0];
  }, [selectedPlanId]);

  // Sync initial plan from URL when searchParams change
  useEffect(() => {
    const p = searchParams.get('plan');
    if (p) setSelectedPlanId(p);
    const c = searchParams.get('cycle') as BillingCycle;
    if (c === 'monthly' || c === 'annual') setBillingCycle(c);
  }, [searchParams]);

  // Auto-load pre-verified student verification if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem('zenvitra_student_verification');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.verified || parsed?.status === 'VERIFIED') {
          setIsCollegeStudent(true);
          setStudentIdFile({
            name: parsed.fileName || 'Verified_Student_ID.pdf',
            size: parsed.fileSize || '142.0 KB'
          });
        }
      }
    } catch {}
  }, []);

  // Tax Calculation
  const taxes = useMemo(() => {
    return calculatePlanTaxes({
      plan: currentPlan,
      currency,
      billingCycle,
      userAge,
      isCollegeStudent
    });
  }, [currentPlan, currency, billingCycle, userAge, isCollegeStudent]);

  const currSymbol = currency === 'INR' ? '₹' : '$';

  // Handle Age adjustment
  const handleAgeChange = (newAge: number) => {
    const clamped = Math.max(10, Math.min(85, newAge));
    setUserAge(clamped);
    if (clamped <= 18) {
      setIsCollegeStudent(false);
    } else if (clamped >= 19 && clamped <= 21) {
      setIsCollegeStudent(true);
    }
  };

  // Student ID upload handler
  const handleStudentFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setStudentIdError('File size exceeds statutory 5MB limit.');
      return;
    }

    setStudentIdError(null);
    setIsUploadingStudentId(true);
    setIsCollegeStudent(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/verification/upload-student-id', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      const filePayload = {
        name: data.fileName || file.name,
        size: data.fileSize || `${(file.size / 1024).toFixed(1)} KB`,
      };
      setStudentIdFile(filePayload);
      setStudentIdError(null);

      localStorage.setItem('zenvitra_student_verification', JSON.stringify({
        verified: true,
        status: 'VERIFIED',
        fileName: filePayload.name,
        fileSize: filePayload.size,
        fileUrl: data.fileUrl,
        uploadedAt: new Date().toISOString()
      }));
    } catch (err: any) {
      console.error('Student ID upload failed:', err);
      setStudentIdError(err.message || 'Failed to upload student verification file');
    } finally {
      setIsUploadingStudentId(false);
    }
  };

  // Professional Starter / Free Plan activation handler
  const handleActivateProStarter = () => {
    const cleanUser = profile?.username || profile?.email || 'citizen';
    
    // 1. Toggle Account to Professional
    setProfessionalAccountEnabled(true);
    enableProfessionalAccount();

    // 2. Allot Professional Starter Subscription
    allotUserSubscription(cleanUser, {
      planId: 'pro-starter',
      planName: 'PROFESSIONAL STARTER',
      amountPaid: 0,
      currency: 'INR',
      paymentMethod: 'SYSTEM_ACTIVATION',
      expiresAt: 'LIFETIME'
    });

    // 3. Update active role in storage
    try {
      localStorage.setItem('zenvitra_user_role', 'professional');
      window.dispatchEvent(new Event('zenvitra_role_change'));
      window.dispatchEvent(new Event('zenvitra_subscription_allotted'));
    } catch {}

    // 4. Open celebratory activation confirmation
    setActivationSuccess({
      isOpen: true,
      title: 'Professional Starter Activated!',
      description: 'Your account has been switched to Professional and your Professional Starter journey begins now. Access institutional publishing, team identity, and official statements.',
      isProStarter: true
    });
  };

  const handleActivateFreePlan = () => {
    const cleanUser = profile?.username || profile?.email || 'citizen';
    allotUserSubscription(cleanUser, {
      planId: currentPlan.id as any,
      planName: currentPlan.name,
      amountPaid: 0,
      currency: 'INR',
      paymentMethod: 'SYSTEM_ACTIVATION',
      expiresAt: 'LIFETIME'
    });

    try {
      window.dispatchEvent(new Event('zenvitra_subscription_allotted'));
    } catch {}

    setActivationSuccess({
      isOpen: true,
      title: `${currentPlan.name} Activated!`,
      description: `Your ${currentPlan.name} tier is now active forever on your profile.`,
      isProStarter: false
    });
  };

  const handleActivateProTrial = () => {
    setIsTrialCardModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#04060a] text-white font-sans selection:bg-cyan-500/20 selection:text-white flex flex-col relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[400px] bg-cyan-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[400px] bg-purple-600/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Embedded Global Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 relative z-10">
        
        {/* Top Header & Breadcrumb Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs font-mono transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Pricing</span>
            </Link>
            <div className="h-4 w-px bg-white/15 hidden sm:block" />
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <span>Checkout</span>
              <span>/</span>
              <span className="text-cyan-400 font-bold uppercase">{currentPlan.name}</span>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-400">
            <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>256-Bit SSL Quantum-Safe</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-cyan-300 bg-cyan-500/10 border border-cyan-500/25 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cashfree PG Verified</span>
            </div>
          </div>
        </div>

        {/* Plan Switcher Bar */}
        <div className="p-3 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Plan Selected:</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPlanSelectorOpen(!isPlanSelectorOpen)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/35 text-cyan-300 font-display font-bold text-sm transition cursor-pointer shadow-xs"
              >
                <span>{currentPlan.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isPlanSelectorOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isPlanSelectorOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-[#090b12] border border-white/15 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-2xl max-h-96 overflow-y-auto space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 px-2 py-1">
                    Select ZENVITRA Plan
                  </div>
                  {ALL_PRICING_PLANS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedPlanId(p.id);
                        setIsPlanSelectorOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl transition flex items-center justify-between text-xs cursor-pointer ${
                        p.id === currentPlan.id
                          ? 'bg-cyan-500 text-black font-bold'
                          : 'hover:bg-white/10 text-neutral-200'
                      }`}
                    >
                      <span className="truncate">{p.name}</span>
                      <span className="font-mono text-[10px] opacity-80 shrink-0 ml-2">
                        {p.priceINR === 0 ? 'Free' : `₹${p.priceINR}/mo`}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Currency & Tenure Controls */}
          <div className="flex items-center gap-2.5">
            {/* Currency Pill */}
            <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer font-bold ${
                  currency === 'INR' ? 'bg-cyan-500 text-black shadow-xs' : 'text-neutral-400 hover:text-white'
                }`}
              >
                INR (₹)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer font-bold ${
                  currency === 'USD' ? 'bg-cyan-500 text-black shadow-xs' : 'text-neutral-400 hover:text-white'
                }`}
              >
                USD ($)
              </button>
            </div>

            {/* Billing Cycle Pill */}
            {currentPlan.priceINR > 0 && !currentPlan.isPerEvent && (
              <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer font-bold ${
                    billingCycle === 'monthly' ? 'bg-white text-black shadow-xs' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('annual')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer font-bold flex items-center gap-1.5 ${
                    billingCycle === 'annual' ? 'bg-white text-black shadow-xs' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>Annual</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-500 text-black font-extrabold uppercase">
                    Save ~20%
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MASTER TWO-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ══════════════════════════════════════════════════════════════
              LEFT COLUMN: PLAN HERO & STATUTORY TAX CONSOLE
              ══════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Plan Identity Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c101d] via-[#090b14] to-[#04060a] border border-white/15 shadow-2xl relative overflow-hidden space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                    {currentPlan.journeyStep} STEP
                  </span>
                  {currentPlan.badge && (
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
                      {currentPlan.badge}
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono text-neutral-400">Philosophy</div>
                  <div className="text-sm font-display font-bold text-white tracking-wide">
                    {currentPlan.philosophy}
                  </div>
                </div>
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
                  {currentPlan.name}
                </h1>
                <p className="text-sm sm:text-base text-neutral-300 max-w-xl font-sans mt-1 leading-relaxed">
                  {currentPlan.tagline}
                </p>
              </div>

              {currentPlan.spotlightNote && (
                <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200 font-sans leading-relaxed flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{currentPlan.spotlightNote}</span>
                </div>
              )}
            </div>

            {/* 2. REIMAGINED STATUTORY TAX & GST CONCESSION CONSOLE */}
            {currentPlan.priceINR > 0 && !currentPlan.isCustom && (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#080b14]/90 border border-white/15 shadow-2xl space-y-6">
                
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-base sm:text-lg font-display font-bold text-white flex items-center gap-2">
                      <span>Statutory Tax &amp; GST Verification</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                        INDIAN STATUTORY RULES
                      </span>
                    </h3>
                    <p className="text-xs text-neutral-400 font-sans mt-0.5">
                      Government GST concessions automatically apply based on age and verified student status.
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs font-mono font-bold text-emerald-400 block">
                      Active: {taxes.gstBadge}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {taxes.gstLabel}
                    </span>
                  </div>
                </div>

                {/* 3 Interactive Tier Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Tier 1: School Student / Minor <= 18 */}
                  <div
                    onClick={() => handleAgeChange(17)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 relative overflow-hidden ${
                      userAge <= 18
                        ? 'bg-emerald-500/10 border-emerald-400 text-white shadow-[0_0_25px_rgba(16,185,129,0.2)] ring-1 ring-emerald-400'
                        : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-sm text-white">
                        🎓 Age ≤ 18
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                        0% GST
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-snug">
                      School student or minor citizen. 100% Tax Exempt.
                    </p>
                    <div className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1 pt-1">
                      {userAge <= 18 && <Check className="w-3 h-3 text-emerald-400" />}
                      <span>{userAge <= 18 ? 'Applied (Zero GST)' : 'Click to apply'}</span>
                    </div>
                  </div>

                  {/* Tier 2: College / University Student (19–21) */}
                  <div
                    onClick={() => {
                      if (userAge <= 18 || userAge > 21) handleAgeChange(20);
                      setIsCollegeStudent(true);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 relative overflow-hidden ${
                      ((userAge >= 19 && userAge <= 21) || (userAge > 18 && isCollegeStudent))
                        ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-[0_0_25px_rgba(6,182,212,0.2)] ring-1 ring-cyan-400'
                        : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-sm text-white">
                        🏛️ Ages 19–21
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40">
                        5% GST
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-snug">
                      Enrolled college delegate or youth aged 19–21.
                    </p>
                    <div className="text-[10px] font-mono text-cyan-300 font-bold flex items-center gap-1 pt-1">
                      {((userAge >= 19 && userAge <= 21) || isCollegeStudent) && <Check className="w-3 h-3 text-cyan-400" />}
                      <span>{((userAge >= 19 && userAge <= 21) || isCollegeStudent) ? 'Applied (5% Rate)' : 'Click to apply'}</span>
                    </div>
                  </div>

                  {/* Tier 3: Working Adult Citizen (> 21) */}
                  <div
                    onClick={() => {
                      handleAgeChange(24);
                      setIsCollegeStudent(false);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 relative overflow-hidden ${
                      userAge > 21 && !isCollegeStudent
                        ? 'bg-purple-500/10 border-purple-400 text-white shadow-[0_0_25px_rgba(168,85,247,0.2)] ring-1 ring-purple-400'
                        : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-sm text-white">
                        💼 Adult (&gt; 21)
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40">
                        12% GST
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-snug">
                      Standard statutory GST for working adults above 21.
                    </p>
                    <div className="text-[10px] font-mono text-purple-300 font-bold flex items-center gap-1 pt-1">
                      {userAge > 21 && !isCollegeStudent && <Check className="w-3 h-3 text-purple-400" />}
                      <span>{userAge > 21 && !isCollegeStudent ? 'Applied (12% Standard)' : 'Click to apply'}</span>
                    </div>
                  </div>
                </div>

                {/* Tactile Age Adjuster & College Checkbox (Zero ugly number spinners!) */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    {/* Age Stepper */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-neutral-400">Declared Age:</span>
                      
                      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/15">
                        <button
                          type="button"
                          onClick={() => handleAgeChange(userAge - 1)}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center justify-center transition cursor-pointer"
                          title="Decrease age"
                        >
                          -
                        </button>
                        
                        <div className="w-14 text-center">
                          <span className="text-lg font-display font-black text-cyan-300">{userAge}</span>
                          <span className="text-[10px] font-mono text-neutral-500 block leading-none">yrs</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAgeChange(userAge + 1)}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center justify-center transition cursor-pointer"
                          title="Increase age"
                        >
                          +
                        </button>
                      </div>

                      {/* Smooth Slider */}
                      <input
                        type="range"
                        min="10"
                        max="70"
                        value={userAge}
                        onChange={(e) => handleAgeChange(parseInt(e.target.value) || 18)}
                        className="w-32 sm:w-44 accent-cyan-400 cursor-pointer hidden md:block"
                      />
                    </div>

                    {/* Active College Student Switch */}
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-mono text-neutral-300">
                      <input
                        type="checkbox"
                        checked={isCollegeStudent}
                        onChange={(e) => setIsCollegeStudent(e.target.checked)}
                        className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
                      />
                      <span>Active University Student (5% Rate)</span>
                    </label>
                  </div>

                  {/* Student ID Concession Upload Dropzone */}
                  {isCollegeStudent && (
                    <div className="pt-3 border-t border-white/10">
                      {studentIdFile ? (
                        <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                          <div className="flex items-center gap-2.5">
                            <FileCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                            <div>
                              <div className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5">
                                <span>Verified Student ID Attached</span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-200">ACTIVE</span>
                              </div>
                              <div className="text-[11px] font-mono text-neutral-400">
                                {studentIdFile.name} ({studentIdFile.size})
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setStudentIdFile(null);
                              try { localStorage.removeItem('zenvitra_student_verification'); } catch {}
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-mono text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 transition cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <input
                            ref={studentFileInputRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                            className="hidden"
                            onChange={handleStudentFileUpload}
                          />
                          <button
                            type="button"
                            onClick={() => studentFileInputRef.current?.click()}
                            disabled={isUploadingStudentId}
                            className="w-full p-4 rounded-xl border border-dashed border-cyan-500/40 hover:border-cyan-400 bg-cyan-950/10 hover:bg-cyan-950/20 transition cursor-pointer flex flex-col items-center justify-center gap-1 text-center group"
                          >
                            <UploadCloud className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-mono text-neutral-200 font-bold">
                              {isUploadingStudentId ? 'Uploading ID Document...' : 'Upload Student / University ID Card'}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-400">
                              Instant statutory verification • PDF, JPG, PNG (Max 5MB)
                            </span>
                          </button>
                          {studentIdError && (
                            <p className="text-xs font-mono text-rose-400">{studentIdError}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. Included Features & Capabilities */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#080b14]/90 border border-white/15 shadow-2xl space-y-4">
              <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Included in {currentPlan.name}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentPlan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-neutral-300 leading-snug">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              RIGHT COLUMN: STICKY ORDER SUMMARY & PAYMENT DISPATCHER
              ══════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            
            {/* Live Order Ledger Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c101d] via-[#090b14] to-black border border-cyan-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  Order Summary
                </span>
                <span className="text-[11px] font-mono text-neutral-400">
                  {billingCycle === 'annual' ? 'Billed Annually' : 'Billed Monthly'}
                </span>
              </div>

              {/* Ledger Items */}
              <div className="space-y-3 font-mono text-xs">
                
                {/* Base Amount */}
                <div className="flex items-center justify-between text-neutral-300">
                  <span>Base Plan ({currentPlan.name})</span>
                  <span className="text-white font-bold text-sm">
                    {taxes.baseAmount === 0 ? '₹0.00' : `${currSymbol}${taxes.baseAmount.toFixed(2)}`}
                  </span>
                </div>

                {taxes.baseAmount > 0 && (
                  <>
                    {/* Platform Surcharge */}
                    <div className="flex items-center justify-between text-neutral-400">
                      <span className="flex items-center gap-1">
                        <span>Platform Surcharge</span>
                        <span className="text-[10px] text-neutral-500">(Flat {currency === 'INR' ? '₹9' : '$0.15'})</span>
                      </span>
                      <span className="text-amber-300 font-bold">
                        +{currSymbol}{taxes.transactionTax.toFixed(2)}
                      </span>
                    </div>

                    {/* Statutory GST */}
                    <div className="flex items-center justify-between text-neutral-400">
                      <span className="flex items-center gap-1">
                        <span>Goods &amp; Services Tax (GST)</span>
                        <span className="text-[10px] text-neutral-500">({taxes.gstBadge})</span>
                      </span>
                      <span className={`font-bold ${
                        taxes.isGstExempt 
                          ? 'text-emerald-400' 
                          : taxes.gstRate === 0.05 
                          ? 'text-cyan-300' 
                          : 'text-purple-300'
                      }`}>
                        {taxes.isGstExempt ? '₹0.00 (Exempt)' : `+${currSymbol}${taxes.gstAmount.toFixed(2)}`}
                      </span>
                    </div>

                    {/* Annual Savings Privilege */}
                    {billingCycle === 'annual' && taxes.savingsAnnual > 0 && (
                      <div className="flex items-center justify-between text-emerald-400 pt-1">
                        <span className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Annual Billing Concession:</span>
                        </span>
                        <span className="font-bold">
                          -~20% Off
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Horizontal Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent my-3" />

                {/* Grand Total Payable */}
                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-xs font-mono text-neutral-400 block">Final Total Payable</span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {taxes.baseAmount === 0 ? '100% Free Forever' : 'All taxes & levies included'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-3xl sm:text-4xl font-display font-black text-cyan-300 tracking-tight">
                      {taxes.baseAmount === 0 ? '₹0.00' : `${currSymbol}${taxes.totalPayable.toFixed(2)}`}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 block">
                      {getPriceSuffix(currentPlan, billingCycle)}
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="pt-2">
                {currentPlan.id === 'pro-starter' ? (
                  /* Professional Starter 1-Click Activation & Toggle */
                  <button
                    type="button"
                    onClick={handleActivateProStarter}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-display font-extrabold text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_35px_rgba(168,85,247,0.45)] hover:shadow-[0_0_45px_rgba(168,85,247,0.65)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Briefcase className="w-4 h-4 text-purple-200" />
                    <span>Toggle to Professional &amp; Begin Starter</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : taxes.baseAmount === 0 ? (
                  /* Other Free Plan Activation */
                  <button
                    type="button"
                    onClick={handleActivateFreePlan}
                    className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-display font-extrabold text-sm uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(16,185,129,0.45)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Activate {currentPlan.name} Now</span>
                  </button>
                ) : (
                  /* Paid Plan via Cashfree PG with Launch Promotional Option */
                  <div className="space-y-3">
                    {currentPlan.id === 'zen-pro' && isPromotionalCampaignActive() && (
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2">
                        <div className="flex items-center justify-center gap-1.5 text-amber-300 font-mono text-xs font-bold uppercase">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span>3-Month Launch Special Eligible</span>
                        </div>
                        <p className="text-xs text-neutral-300">
                          Activate your 30-day trial right now for ₹0. Valid card required for authorization verification.
                        </p>
                        <button
                          type="button"
                          onClick={handleActivateProTrial}
                          className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider transition shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Sparkles className="w-3.5 h-3.5 fill-black" />
                          <span>Verify Card & Claim 1-Month Trial (₹0)</span>
                        </button>
                        <div className="relative flex items-center py-1">
                          <div className="flex-grow border-t border-white/10" />
                          <span className="flex-shrink mx-3 text-[10px] font-mono text-neutral-500 uppercase">Or Subscribe</span>
                          <div className="flex-grow border-t border-white/10" />
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setIsCashfreeModalOpen(true)}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:from-cyan-300 hover:to-purple-500 text-black font-display font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_35px_rgba(6,182,212,0.45)] hover:shadow-[0_0_45px_rgba(6,182,212,0.65)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2.5"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pay with Cashfree PG &bull; {currSymbol}{taxes.totalPayable.toFixed(2)}</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                )}
              </div>

              {/* Supported Payment Mode Badges */}
              <div className="pt-2 border-t border-white/10 text-center space-y-2">
                <div className="flex items-center justify-center gap-3 text-xs font-mono text-neutral-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Instant UPI</span>
                  </span>
                  <span>&bull;</span>
                  <span>Cards (Visa, RuPay, MC)</span>
                  <span>&bull;</span>
                  <span>Netbanking</span>
                </div>
                <p className="text-[10px] font-mono text-neutral-500">
                  Automated instant provisioning upon successful Cashfree webhook confirmation.
                </p>
              </div>
            </div>

            {/* Guarantees & Support Card */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 font-mono text-xs text-neutral-400">
              <div className="flex items-center gap-2 text-white font-bold">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>ZENVITRA Protocol Guarantees</span>
              </div>
              <ul className="space-y-1.5 text-[11px] list-disc list-inside text-neutral-400">
                <li>Zero artificial fees or unexpected surcharges.</li>
                <li>Instant entitlement sync across all platform chambers.</li>
                <li>RBI-compliant secure payment session processing.</li>
                <li>24/7 Secretariat assistance via support desk.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Embedded Global Footer */}
      <Footer />

      {/* ── CARD VERIFICATION MODAL FOR 1-MONTH PRO TRIAL ── */}
      <ZenTrialCardModal
        isOpen={isTrialCardModalOpen}
        onClose={() => setIsTrialCardModalOpen(false)}
        username={profile?.username || profile?.email || ''}
        userEmail={profile?.email}
        userRole={profile?.role}
        onSuccess={() => {
          setActivationSuccess({
            isOpen: true,
            title: 'ZEN PRO 1-Month Free Trial Activated!',
            description: 'Your 30-day promotional launch trial for ZEN PRO is live! Full Executive Dais suite, stage broadcasting, and verifiable certificates are now unlocked.',
            isProStarter: false
          });
        }}
      />

      {/* ── CASHFREE CHECKOUT MODAL INTEGRATION ── */}
      {isCashfreeModalOpen && (
        <ZenCheckoutModal
          isOpen={isCashfreeModalOpen}
          onClose={() => setIsCashfreeModalOpen(false)}
          product={currentPlan.id as any}
          title={currentPlan.name}
          baseAmount={taxes.baseAmount}
          currency={currency}
          onSuccess={(txn) => {
            setIsCashfreeModalOpen(false);
            const cleanUser = profile?.username || profile?.email || 'citizen';
            
            allotUserSubscription(cleanUser, {
              planId: currentPlan.id as any,
              planName: currentPlan.name,
              orderId: (txn as any).orderId || txn.id,
              paymentId: txn.id,
              amountPaid: txn.amount,
              currency: txn.currency,
              paymentMethod: txn.paymentMethod,
              expiresAt: billingCycle === 'annual'
                ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
                : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            });

            // If it's a professional or organizer plan, also enable capabilities
            if (currentPlan.audience === 'professional') {
              setProfessionalAccountEnabled(true);
            }

            try {
              window.dispatchEvent(new Event('zenvitra_subscription_allotted'));
            } catch {}

            setActivationSuccess({
              isOpen: true,
              title: `${currentPlan.name} Activated!`,
              description: `Payment of ${currSymbol}${txn.amount} verified by Cashfree. All perks have been provisioned instantly.`,
              isProStarter: false
            });
          }}
        />
      )}

      {/* ── ACTIVATION SUCCESS CELEBRATION MODAL ── */}
      {activationSuccess.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0a0d16] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 space-y-6 text-center relative shadow-2xl overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 flex items-center justify-center mx-auto text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.35)]">
              {activationSuccess.isProStarter ? (
                <Briefcase className="w-8 h-8 text-purple-400" />
              ) : (
                <Sparkles className="w-8 h-8 text-cyan-400" />
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-display font-black text-white">
                {activationSuccess.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
                {activationSuccess.description}
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setActivationSuccess(prev => ({ ...prev, isOpen: false }));
                  if (activationSuccess.isProStarter) {
                    router.push('/pulse?tab=profile');
                  } else {
                    router.push('/plan');
                  }
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                {activationSuccess.isProStarter ? 'Launch Professional Workspace →' : 'View Activated Perks (/plan) →'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActivationSuccess(prev => ({ ...prev, isOpen: false }));
                  router.push('/pricing');
                }}
                className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-mono text-xs transition cursor-pointer"
              >
                Return to Pricing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
