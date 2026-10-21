'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  X, 
  Calendar, 
  MapPin, 
  Sparkles, 
  Layers, 
  Plus, 
  Trash2, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  ShieldCheck, 
  Building, 
  Mail, 
  Phone, 
  User, 
  FileText, 
  Check, 
  Globe2,
  Clock,
  Ticket,
  Copy,
  Camera,
  Crop,
  Sliders,
  RotateCcw,
  UploadCloud,
  FileSpreadsheet,
  ExternalLink,
  BookOpen,
  Grid,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { KNOWN_CITIES } from '@/context/ZenEventsPlatformContext';
import { RegistrationPlan } from '@/types/events';
import { saveZenForm, generateUniqueSlug } from '@/lib/formsStorage';
import { ZenForm, ZenFormField } from '@/types/forms';

interface ListConferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (listing: any) => void;
}

const PRESET_COVERS = [
  { label: 'Diplomatic Plenary', url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Summit Chamber Floor', url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Youth Parliament Hall', url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Global Innovation Arena', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80' },
];

export function ListConferenceModal({
  isOpen,
  onClose,
  onSuccess
}: ListConferenceModalProps) {
  const { user, profile } = useAuth();

  // Wizard Step State (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Assembly Dossier
  const [title, setTitle] = useState('');
  const [shortName, setShortName] = useState('');
  const [category, setCategory] = useState<'MUN' | 'SUMMIT' | 'HACKATHON' | 'PARLIAMENT' | 'POLICY' | 'WORKSHOP'>('MUN');
  const [format, setFormat] = useState<'physical' | 'virtual' | 'hybrid'>('physical');
  const [description, setDescription] = useState('');

  // Step 2: Temporal & Regional Node
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [venue, setVenue] = useState('');

  // Step 3: Visual Framing & Cover Visual (with Photo Adjuster)
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0].url);
  const [coverAdjustment, setCoverAdjustment] = useState({
    scale: 1,
    positionX: 50,
    positionY: 50,
    aspectRatio: '16:9' as '16:9' | '21:9' | '4:3' | '1:1',
    fit: 'cover' as 'cover' | 'contain',
  });
  const [showRuleOfThirds, setShowRuleOfThirds] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 4: Pass Tiers & Ticketing
  type PricingMode = 'FREE' | 'NORMAL' | 'TIERED';
  const [pricingMode, setPricingMode] = useState<PricingMode>('FREE');
  const [normalPrice, setNormalPrice] = useState<number>(0);

  interface CustomTierItem {
    id: string;
    name: string;
    price: number;
    description: string;
    perks: string;
    capacity: number;
    badge?: string;
  }

  const [tiers, setTiers] = useState<CustomTierItem[]>([]);

  // Step 5: Secretariat & Companion ZenForm Studio
  const [organizerName, setOrganizerName] = useState(profile?.display_name || user?.name || '');
  const [organizerEmail, setOrganizerEmail] = useState(user?.email || '');
  const [organizerPhone, setOrganizerPhone] = useState('');
  const [institution, setInstitution] = useState('');
  const [initialCommittee, setInitialCommittee] = useState('');
  
  // Google Sheets Sync Config
  const [enableSheetsSync, setEnableSheetsSync] = useState(false);
  const [sheetsWebhookUrl, setSheetsWebhookUrl] = useState('');
  const [sheetsUrl, setSheetsUrl] = useState('');

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submittedListing, setSubmittedListing] = useState<any | null>(null);
  const [companionZenForm, setCompanionZenForm] = useState<ZenForm | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Image Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCoverImage(reader.result);
          setCoverAdjustment({ scale: 1, positionX: 50, positionY: 50, aspectRatio: '16:9', fit: 'cover' });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTier = () => {
    const newTier: CustomTierItem = {
      id: `tier_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: '',
      price: 0,
      description: '',
      perks: '',
      capacity: 50,
      badge: ''
    };
    setTiers(prev => [...prev, newTier]);
  };

  const handleRemoveTier = (id: string) => {
    setTiers(prev => prev.filter(t => t.id !== id));
  };

  const handleUpdateTier = (id: string, field: keyof CustomTierItem, value: any) => {
    setTiers(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Validation per step
  const validateCurrentStep = () => {
    if (currentStep === 1) {
      if (!title.trim()) {
        showToast('Please enter a conference title.');
        return false;
      }
    }
    if (currentStep === 2) {
      if (!startDate || !endDate) {
        showToast('Please select both start and end dates.');
        return false;
      }
    }
    if (currentStep === 4) {
      if (pricingMode === 'TIERED' && tiers.length === 0) {
        showToast('Please add at least one ticket tier or switch to Free / Standard Pass.');
        return false;
      }
    }
    if (currentStep === 5) {
      if (!organizerName.trim() || !organizerEmail.trim()) {
        showToast('Organizer name and email are mandatory for credential verification.');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Final Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    try {
      setSubmitting(true);

      // Compute pricing plans
      let finalPlans: RegistrationPlan[] = [];
      let effectivePrice = 0;

      if (pricingMode === 'FREE') {
        finalPlans = [{
          id: `plan_free_${Date.now()}`,
          name: 'Complimentary Delegate Pass',
          price: 0,
          currency: 'INR',
          description: 'Free delegate admission.',
          perks: ['Open Floor Participation', 'Digital Pass', 'Plenary Credentials'],
          status: 'active'
        }];
        effectivePrice = 0;
      } else if (pricingMode === 'NORMAL') {
        finalPlans = [{
          id: `plan_std_${Date.now()}`,
          name: 'Standard Delegate Pass',
          price: Math.max(0, Number(normalPrice)),
          currency: 'INR',
          description: 'Standard conference admission.',
          perks: ['Committee Floor Entry', 'Official Delegate Kit', 'Verified Digital Certificate'],
          status: 'active',
          badge: 'POPULAR'
        }];
        effectivePrice = Math.max(0, Number(normalPrice));
      } else {
        finalPlans = tiers.map((t, idx) => ({
          id: t.id || `tier_${idx}_${Date.now()}`,
          name: t.name.trim() || `Delegate Pass Tier ${idx + 1}`,
          price: Math.max(0, Number(t.price) || 0),
          currency: 'INR',
          description: t.description.trim() || 'Delegate admission pass',
          perks: t.perks.split(',').map(p => p.trim()).filter(Boolean),
          capacity: Math.max(1, Number(t.capacity) || 50),
          bookedCount: 0,
          badge: t.badge?.trim() || undefined,
          status: 'active'
        }));
        effectivePrice = tiers[0] ? Math.max(0, Number(tiers[0].price) || 0) : 0;
      }

      const committees = initialCommittee.trim() ? [{
        name: initialCommittee.trim(),
        shortName: initialCommittee.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 8) || 'UNSC',
        type: 'UNSC' as const,
        agenda: 'Floor Deliberations & Working Papers',
        totalDelegates: 30
      }] : [];

      // 1. Submit conference listing to backend API
      const res = await fetch('/api/events/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          shortName: (shortName || title.slice(0, 10)).trim().toUpperCase(),
          category,
          format,
          venue: venue.trim() || 'Central Assembly Venue',
          city,
          startDate,
          endDate,
          organizerName: organizerName.trim(),
          organizerEmail: organizerEmail.trim(),
          organizerPhone: organizerPhone.trim() || null,
          institution: institution.trim() || null,
          description: description.trim() || `${title} — Official Sovereign Assembly & Model UN Convening`,
          coverImage,
          ticketPrice: effectivePrice,
          tierPlans: finalPlans,
          committees,
          userId: profile?.id || user?.id || null
        })
      });

      const data = await res.json();

      if (data.success && data.listing) {
        setSubmittedListing(data.listing);

        // 2. Automatically Author & Publish Companion ZenForm!
        const baseSlug = `reg-${data.listing.slug}`;
        const uniqueFormSlug = generateUniqueSlug(baseSlug);

        const companionFormFields: ZenFormField[] = [
          {
            id: 'fld_full_name',
            label: 'Full Legal Name',
            type: 'short_answer',
            placeholder: 'e.g. John Doe',
            required: true,
            stepHeading: {
              enabled: true,
              stepBadge: 'STEP 1',
              stepNumber: '01 / Delegate Dossier',
              headingTitle: 'Primary Delegate Credentials',
              description: 'Official credentials for roll-call and diplomatic registry.'
            }
          },
          {
            id: 'fld_email',
            label: 'Delegate Email Address',
            type: 'email',
            placeholder: 'delegate@domain.com',
            required: true,
          },
          {
            id: 'fld_phone',
            label: 'Contact Phone / WhatsApp Number',
            type: 'phone',
            placeholder: '+91 98765 43210',
            required: true,
          },
          {
            id: 'fld_institution',
            label: 'Institutional Affiliation / University / School',
            type: 'short_answer',
            placeholder: institution || 'e.g. University of Delhi',
            required: true,
          },
          {
            id: 'fld_committee',
            label: 'Primary Simulated Committee Chamber',
            type: 'committee_selector',
            required: true,
            chambers: committees.map((c, i) => ({
              id: `chamb_${i}`,
              code: c.shortName,
              title: c.name,
              subtitle: 'Official Dais Allocation',
              agenda: c.agenda,
              format: 'UNA-USA / Sovereign Rules of Procedure',
              badge: 'PLENARY',
              badgeColor: 'border-amber-400 text-amber-300 bg-amber-500/10'
            })),
            stepHeading: {
              enabled: true,
              stepBadge: 'STEP 2',
              stepNumber: '02 / Chamber Selection',
              headingTitle: 'Committee Chamber & Matrix Allocation',
              description: 'Choose your desired multilateral chamber and debate track.'
            }
          },
          {
            id: 'fld_delegate_photo',
            label: 'Official Delegate Identity Photo & Visual Framing',
            type: 'photo_adjuster',
            description: 'Upload your portrait photo for committee security badge credentials.',
            required: false,
            photoAdjusterConfig: {
              defaultAspectRatio: '1:1',
              allowCustomUpload: true,
              allowUrl: true,
              helperText: 'Crop and frame your portrait with the interactive viewfinder.'
            }
          },
          {
            id: 'fld_research_sources',
            label: 'Position Paper Research Citations & Sources',
            type: 'source_citation',
            description: 'Link your policy citations, UN treaties, or verified news articles.',
            required: false,
            sourceCitationConfig: {
              maxSources: 5,
              requireAtLeastOne: false,
              autoFetchHeading: true,
              helperText: 'Paste URLs to auto-extract publication titles and headlines.'
            }
          },
          {
            id: 'fld_signature',
            label: 'Diplomatic Decorum Attestation & Digital Signature',
            type: 'signature',
            required: true,
            description: 'I certify that all representations submitted are authentic and bound by diplomatic decorum.'
          }
        ];

        const companionForm: ZenForm = {
          id: `zenform_${data.listing.id || Date.now()}`,
          title: `${title.trim()} — Official Delegate Registration`,
          slug: uniqueFormSlug,
          description: description.trim() || `Official registration and delegation intake for ${title.trim()}.`,
          category: 'MUN_REGISTRATION',
          theme: 'obsidian',
          customStyle: {
            coverImageUrl: coverImage,
            coverAdjustment: coverAdjustment,
            displayFont: 'Space Grotesk',
            bodyFont: 'Inter',
            cardStyle: 'glass-deep',
            accentColor: '#06b6d4',
            accentTextColor: '#000000',
            ambientEffect: 'aurora'
          },
          fields: companionFormFields,
          submitButtonText: 'Transmit Delegate Registration',
          successMessage: 'Your delegate credentials have been secured and recorded on the sovereign ledger.',
          ownerHandle: profile?.username || 'secretariat',
          submissionsCount: 0,
          isPublished: true,
          allowAnonymous: false,
          acceptingResponses: true,
          stepHeadingsEnabled: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          googleSheetsConfig: enableSheetsSync ? {
            isConnected: true,
            webhookUrl: sheetsWebhookUrl.trim() || undefined,
            sheetUrl: sheetsUrl.trim() || undefined,
            connectedAt: new Date().toISOString(),
            sheetTab: 'Registrations',
            autoSync: true,
          } : undefined
        };

        saveZenForm(companionForm);
        setCompanionZenForm(companionForm);

        if (onSuccess) onSuccess(data.listing);
      } else {
        showToast(data.error || 'Failed to submit conference listing');
      }
    } catch (err: any) {
      showToast(err.message || 'Error submitting conference');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl p-3 sm:p-6 flex flex-col justify-start sm:justify-center items-center font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-3xl my-auto max-h-[92vh] overflow-y-auto rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-[#0e1322] via-[#080b14] to-[#04060a] p-6 sm:p-8 shadow-[0_0_90px_rgba(6,182,212,0.18)] space-y-6"
        >
          {/* Top Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* ── ON-SCREEN NOTIFICATION POPUP ── */}
          <AnimatePresence>
            {toastMessage && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  className="w-full max-w-sm rounded-2xl border border-cyan-500/30 bg-[#0d121f] p-6 shadow-[0_0_50px_rgba(6,182,212,0.25)] text-center space-y-4"
                >
                  <div className="mx-auto w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-bold text-white tracking-wide font-mono uppercase">
                      Action Required
                    </h4>
                    <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                      {toastMessage}
                    </p>
                  </div>
                  <button
                    type="button"
                    autoFocus
                    onClick={() => setToastMessage(null)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-black font-mono text-xs font-bold transition shadow-lg cursor-pointer"
                  >
                    Got it
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* ── SUCCESS STATE ── */}
          {submittedListing ? (
            <div className="py-8 text-center space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_40px_rgba(16,185,129,0.3)] animate-pulse">
                <ShieldCheck className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
                  CONFERENCE REGISTERED &bull; AWAITING SECRETARIAT VERIFICATION
                </span>
                <h3 
                  className="text-2xl sm:text-3xl font-black text-white tracking-tight"
                  style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
                >
                  {submittedListing.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto font-sans leading-relaxed">
                  Your convening is registered! Our verification team reviews conferences for authentic delegate safety. Your companion <strong>ZenForm</strong> registration portal is live and ready to intake delegate registrations.
                </p>
              </div>

              {/* Companion ZenForm Registration Card */}
              {companionZenForm && (
                <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 max-w-lg mx-auto text-left space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span className="font-mono text-xs font-bold text-cyan-300 uppercase">
                        Companion ZenForm Registration Portal
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                      ACTIVE &bull; READY
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-neutral-300 flex items-center justify-between">
                    <span className="truncate pr-2 text-cyan-200">
                      /forms/{companionZenForm.slug}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/forms/${companionZenForm.slug}`);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] transition flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Link
                      href={`/forms/${companionZenForm.slug}`}
                      target="_blank"
                      className="flex-1 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <span>Open Live ZenForm</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/forms/edit/${companionZenForm.id}`}
                      target="_blank"
                      className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-neutral-200 font-mono text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <span>Edit in Studio</span>
                      <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    </Link>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold transition cursor-pointer"
                >
                  Return to ZENVITRA
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* ── ZENFORMS MULTI-STEP MODAL HEADER ── */}
              <div className="space-y-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 p-0.5 shadow-md flex items-center justify-center">
                    <div className="w-full h-full rounded-[14px] bg-[#06080e] flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 
                        className="text-lg sm:text-xl font-bold text-white tracking-tight"
                        style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
                      >
                        List Your Conference or Event
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/5 text-neutral-300 border border-white/10">
                        ZENFORMS SUITE
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">
                      Open to all organizers. Builds your event listing and companion delegate registration form.
                    </p>
                  </div>
                </div>

                {/* 5-Step Ribbon Progress */}
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {[
                    { step: 1, label: '01 Dossier' },
                    { step: 2, label: '02 Dates' },
                    { step: 3, label: '03 Framing' },
                    { step: 4, label: '04 Passes' },
                    { step: 5, label: '05 Secretariat' },
                  ].map((s) => (
                    <div
                      key={s.step}
                      onClick={() => {
                        if (s.step < currentStep || validateCurrentStep()) {
                          setCurrentStep(s.step);
                        }
                      }}
                      className={`py-1.5 px-1 rounded-lg text-center font-mono text-[10px] transition cursor-pointer border ${
                        currentStep === s.step
                          ? 'bg-white text-black font-bold border-white shadow-sm'
                          : currentStep > s.step
                          ? 'bg-white/10 border-white/20 text-white'
                          : 'bg-white/[0.02] border-white/5 text-neutral-500'
                      }`}
                    >
                      {s.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* ── STEP 1: ASSEMBLY DOSSIER ── */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-xs font-mono text-neutral-200 uppercase tracking-wider font-bold">
                      Step 01 &bull; Assembly Overview &amp; Category
                    </span>
                    <span className="text-[11px] font-mono text-neutral-500">1 of 5</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-300 block">
                      Conference / Convening Title <span className="text-white">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ZDMUN 2026 — Sovereign Diplomatic Assembly"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (!shortName) {
                          setShortName(e.target.value.split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 10));
                        }
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white text-sm font-sans focus:border-white/50 focus:ring-1 focus:ring-white/20 outline-none transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-neutral-300 block">
                        Short Acronym / Code
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ZDMUN 26"
                        value={shortName}
                        onChange={(e) => setShortName(e.target.value.toUpperCase())}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-mono focus:border-white/50 focus:ring-1 focus:ring-white/20 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-neutral-300 block">
                        Event Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono focus:border-white/50 focus:ring-1 focus:ring-white/20 outline-none cursor-pointer"
                      >
                        <option value="MUN">Model United Nations (MUN)</option>
                        <option value="SUMMIT">Diplomatic / Youth Summit</option>
                        <option value="HACKATHON">Civic / Tech Hackathon</option>
                        <option value="PARLIAMENT">Youth Parliament (AIPPM)</option>
                        <option value="POLICY">Policy & Governance Forum</option>
                        <option value="WORKSHOP">Masterclass & Training Workshop</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-300 block">
                      Convening Format
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'physical', label: 'Physical', desc: 'In-person plenary' },
                        { id: 'virtual', label: 'Virtual', desc: 'Remote chambers' },
                        { id: 'hybrid', label: 'Hybrid', desc: 'Dual presence' },
                      ].map((fmt) => (
                        <button
                          key={fmt.id}
                          type="button"
                          onClick={() => setFormat(fmt.id as any)}
                          className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                            format === fmt.id
                              ? 'bg-white text-black border-white shadow-md'
                              : 'bg-white/[0.02] border-white/10 hover:bg-white/5 text-neutral-400'
                          }`}
                        >
                          <div className={`text-xs font-bold font-mono ${format === fmt.id ? 'text-black' : 'text-white'}`}>{fmt.label}</div>
                          <div className={`text-[10px] ${format === fmt.id ? 'text-neutral-700 font-medium' : 'text-neutral-400'}`}>{fmt.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-300 block">
                      Assembly Overview &amp; Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Detail the agenda, committee chambers, historical significance, and delegate scope..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-sans focus:border-white/50 focus:ring-1 focus:ring-white/20 outline-none transition"
                    />
                  </div>
                </div>
              )}

              {/* ── STEP 2: TEMPORAL & REGIONAL NODE ── */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
                      Step 02 &bull; Temporal Horizon & Geographic Venue
                    </span>
                    <span className="text-[11px] font-mono text-neutral-500">2 of 5</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-neutral-300 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Start Date</span> <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-mono focus:border-cyan-400 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-neutral-300 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <span>End Date</span> <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-mono focus:border-cyan-400 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-neutral-300 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Geographic Hub / City</span>
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono focus:border-cyan-400 outline-none cursor-pointer"
                      >
                        {KNOWN_CITIES.map((c) => (
                          <option key={c.value} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-neutral-300 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Venue / Campus Address</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. India Habitat Centre, Lodhi Road"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-sans focus:border-cyan-400 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 3: COVER VISUAL & VISUAL FRAMING (PHOTO ADJUSTER) ── */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-amber-400" />
                      Step 03 &bull; Cover Visual Framing & Photo Adjuster
                    </span>
                    <span className="text-[11px] font-mono text-neutral-500">3 of 5</span>
                  </div>

                  {/* Preset Gallery & Upload Button */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <label className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md">
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Upload Custom Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono">
                      <span className="text-neutral-500 text-[10px]">PRESETS:</span>
                      {PRESET_COVERS.map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => {
                            setCoverImage(preset.url);
                            setCoverAdjustment({ scale: 1, positionX: 50, positionY: 50, aspectRatio: '16:9', fit: 'cover' });
                          }}
                          className={`px-2 py-1 rounded-lg text-[10px] transition cursor-pointer ${
                            coverImage === preset.url
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                              : 'bg-white/5 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Integrated Photo Adjuster Viewfinder */}
                  <div className="p-4 rounded-2xl bg-black/60 border border-white/15 space-y-3">
                    <div 
                      className="w-full rounded-xl overflow-hidden relative border border-white/20 bg-black/90 shadow-2xl flex items-center justify-center select-none"
                      style={{
                        aspectRatio: coverAdjustment.aspectRatio === '21:9' ? '21/9' :
                                     coverAdjustment.aspectRatio === '16:9' ? '16/9' :
                                     coverAdjustment.aspectRatio === '4:3' ? '4/3' : '1/1',
                        maxHeight: '16rem'
                      }}
                    >
                      <img
                        src={coverImage}
                        alt="Conference Cover"
                        className="w-full h-full transition-transform duration-100"
                        style={{
                          transform: `scale(${coverAdjustment.scale})`,
                          objectPosition: `${coverAdjustment.positionX}% ${coverAdjustment.positionY}%`,
                          objectFit: coverAdjustment.fit,
                        }}
                      />

                      {/* Rule of Thirds Overlay */}
                      {showRuleOfThirds && (
                        <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 z-10">
                          <div className="border-r border-b border-amber-400/40" />
                          <div className="border-r border-b border-amber-400/40" />
                          <div className="border-b border-amber-400/40" />
                          <div className="border-r border-b border-amber-400/40" />
                          <div className="border-r border-b border-amber-400/40" />
                          <div className="border-b border-amber-400/40" />
                          <div className="border-r border-b border-amber-400/40" />
                          <div className="border-r border-b border-amber-400/40" />
                          <div />
                        </div>
                      )}

                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-amber-300 pointer-events-none">
                        {coverAdjustment.aspectRatio} &bull; {Math.round(coverAdjustment.scale * 100)}% ZOOM
                      </div>
                    </div>

                    {/* Photo Adjuster Controls */}
                    <div className="space-y-3 pt-1 text-xs font-mono">
                      {/* Aspect Ratio & Framing Presets */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] uppercase text-neutral-400">Aspect Ratio:</span>
                          {(['16:9', '21:9', '4:3', '1:1'] as const).map((r) => (
                            <button
                              key={r}
                              type="button"
                              onClick={() => setCoverAdjustment(prev => ({ ...prev, aspectRatio: r }))}
                              className={`px-2.5 py-1 rounded-lg text-[10px] transition cursor-pointer ${
                                coverAdjustment.aspectRatio === r
                                  ? 'bg-amber-500 text-black font-bold'
                                  : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                              }`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setShowRuleOfThirds(!showRuleOfThirds)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] transition flex items-center gap-1 cursor-pointer ${
                              showRuleOfThirds
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-white/5 text-neutral-400 hover:text-white'
                            }`}
                          >
                            <Grid className="w-3 h-3" />
                            <span>3x3 Grid</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setCoverAdjustment(prev => ({ ...prev, fit: prev.fit === 'cover' ? 'contain' : 'cover' }))}
                            className="px-2.5 py-1 rounded-lg text-[10px] bg-white/5 hover:bg-white/10 text-neutral-300 transition cursor-pointer"
                          >
                            Fit: {coverAdjustment.fit}
                          </button>
                        </div>
                      </div>

                      {/* Zoom Scale */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-neutral-400">
                          <span className="flex items-center gap-1">
                            <Crop className="w-3.5 h-3.5 text-amber-400" />
                            Zoom / Scale
                          </span>
                          <span className="text-white font-bold">{Math.round(coverAdjustment.scale * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={2.5}
                          step={0.05}
                          value={coverAdjustment.scale}
                          onChange={(e) => setCoverAdjustment(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                          className="w-full accent-amber-400 cursor-pointer"
                        />
                      </div>

                      {/* Pan X and Pan Y */}
                      <div className="grid grid-cols-2 gap-3 text-[11px] text-neutral-400">
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Pan X</span>
                            <span className="text-white font-bold">{coverAdjustment.positionX}%</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={coverAdjustment.positionX}
                            onChange={(e) => setCoverAdjustment(prev => ({ ...prev, positionX: parseInt(e.target.value) }))}
                            className="w-full accent-amber-400 cursor-pointer"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Pan Y</span>
                            <span className="text-white font-bold">{coverAdjustment.positionY}%</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={coverAdjustment.positionY}
                            onChange={(e) => setCoverAdjustment(prev => ({ ...prev, positionY: parseInt(e.target.value) }))}
                            className="w-full accent-amber-400 cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setCoverAdjustment({ scale: 1, positionX: 50, positionY: 50, aspectRatio: '16:9', fit: 'cover' })}
                          className="text-neutral-400 hover:text-white flex items-center gap-1 transition cursor-pointer text-[10px]"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset Framing</span>
                        </button>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          Saved to both Conference Banner & ZenForm Hero
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 4: PASS TIERS & TICKETING ── */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
                      Step 04 &bull; Pass Tiers & Ticketing Structure
                    </span>
                    <span className="text-[11px] font-mono text-neutral-500">4 of 5</span>
                  </div>

                  {/* Pricing Mode Selector */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'FREE', label: 'Open / Free Pass', desc: 'Zero registration fee' },
                      { id: 'NORMAL', label: 'Single Pass', desc: 'Flat ticket price' },
                      { id: 'TIERED', label: 'Multi-Tiered Passes', desc: 'Custom categories & perks' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setPricingMode(mode.id as any)}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          pricingMode === mode.id
                            ? 'bg-cyan-500/20 border-cyan-400 text-white ring-1 ring-cyan-400/30'
                            : 'bg-white/[0.02] border-white/10 hover:bg-white/5 text-neutral-400'
                        }`}
                      >
                        <div className="text-xs font-bold font-mono">{mode.label}</div>
                        <div className="text-[10px] text-neutral-400">{mode.desc}</div>
                      </button>
                    ))}
                  </div>

                  {pricingMode === 'NORMAL' && (
                    <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                      <label className="text-xs font-mono text-neutral-300 block">
                        Standard Pass Price (₹ INR)
                      </label>
                      <input
                        type="number"
                        min={0}
                        placeholder="e.g. 1500"
                        value={normalPrice || ''}
                        onChange={(e) => setNormalPrice(Math.max(0, Number(e.target.value)))}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-sm focus:border-cyan-400 outline-none"
                      />
                      <p className="text-[11px] font-mono text-neutral-400">
                        Includes committee floor entry, delegate kit, and digital credentials.
                      </p>
                    </div>
                  )}

                  {pricingMode === 'TIERED' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-neutral-300">Configured Pass Tiers:</span>
                        <button
                          type="button"
                          onClick={handleAddTier}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Ticket Tier</span>
                        </button>
                      </div>

                      {tiers.length === 0 ? (
                        <div className="p-6 rounded-xl border border-dashed border-white/15 text-center text-xs font-mono text-neutral-500">
                          No tiers added yet. Click &quot;Add Ticket Tier&quot; to configure early bird, school, or college passes.
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                          {tiers.map((tier, idx) => (
                            <div key={tier.id} className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-mono text-cyan-400 font-bold">Tier #{idx + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTier(tier.id)}
                                  className="text-neutral-500 hover:text-rose-400 p-1 transition cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <input
                                  type="text"
                                  placeholder="Tier Name (e.g. School Delegate)"
                                  value={tier.name}
                                  onChange={(e) => handleUpdateTier(tier.id, 'name', e.target.value)}
                                  className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/15 text-white text-xs outline-none focus:border-cyan-400"
                                />
                                <input
                                  type="number"
                                  min={0}
                                  placeholder="Price (₹ INR)"
                                  value={tier.price || ''}
                                  onChange={(e) => handleUpdateTier(tier.id, 'price', Number(e.target.value))}
                                  className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/15 text-white text-xs font-mono outline-none focus:border-cyan-400"
                                />
                                <input
                                  type="number"
                                  min={1}
                                  placeholder="Capacity (e.g. 50)"
                                  value={tier.capacity || ''}
                                  onChange={(e) => handleUpdateTier(tier.id, 'capacity', Number(e.target.value))}
                                  className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/15 text-white text-xs font-mono outline-none focus:border-cyan-400"
                                />
                              </div>

                              <input
                                type="text"
                                placeholder="Included Perks (comma separated: Working Paper Access, Lunch, Kit)"
                                value={tier.perks}
                                onChange={(e) => handleUpdateTier(tier.id, 'perks', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs outline-none focus:border-cyan-400"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── STEP 5: SECRETARIAT DOSSIER & COMPANION ZENFORM ── */}
              {currentStep === 5 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
                      Step 05 &bull; Secretariat Credentials & Companion ZenForm
                    </span>
                    <span className="text-[11px] font-mono text-neutral-500">5 of 5</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-neutral-300 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Lead Organizer / Secretary-General</span> <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={organizerName}
                        onChange={(e) => setOrganizerName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-sans focus:border-cyan-400 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-neutral-300 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Official Secretariat Email</span> <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="secretariat@domain.com"
                        value={organizerEmail}
                        onChange={(e) => setOrganizerEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-mono focus:border-cyan-400 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-neutral-300 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Secretariat Phone / WhatsApp</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={organizerPhone}
                        onChange={(e) => setOrganizerPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-mono focus:border-cyan-400 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-neutral-300 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Host Educational Institution</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. St. Stephen's College / DPS R.K. Puram"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-sans focus:border-cyan-400 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-neutral-300 block">
                      Featured Simulated Committee Chamber
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. UNSC — United Nations Security Council (Agenda on Arctic Sovereignty)"
                      value={initialCommittee}
                      onChange={(e) => setInitialCommittee(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-sans focus:border-cyan-400 outline-none"
                    />
                  </div>

                  {/* Real-time Google Sheets Live Sync Integration Toggle */}
                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-mono font-bold text-emerald-300 uppercase">
                          Google Sheets Real-Time Sync (Optional)
                        </span>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={enableSheetsSync}
                          onChange={(e) => setEnableSheetsSync(e.target.checked)}
                          className="sr-only"
                        />
                        <div
                          className={`w-9 h-5 rounded-full transition-colors relative ${
                            enableSheetsSync ? 'bg-emerald-500' : 'bg-white/20'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 left-0.5 ${
                              enableSheetsSync ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </label>
                    </div>

                    <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                      Delegate submissions through your companion ZenForm will instantly pipe as new rows into your Google Sheet.
                    </p>

                    {enableSheetsSync && (
                      <div className="space-y-2 pt-1 animate-fadeIn">
                        <input
                          type="url"
                          placeholder="Google Apps Script Webhook URL (https://script.google.com/...)"
                          value={sheetsWebhookUrl}
                          onChange={(e) => setSheetsWebhookUrl(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs font-mono text-emerald-200 outline-none focus:border-emerald-400"
                        />
                        <input
                          type="url"
                          placeholder="Google Sheet Link (https://docs.google.com/spreadsheets/d/...)"
                          value={sheetsUrl}
                          onChange={(e) => setSheetsUrl(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs font-mono text-neutral-300 outline-none focus:border-emerald-400"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── STEP NAVIGATION CONTROLS ── */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-mono text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous Step</span>
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-mono text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer active:scale-95"
                  >
                    <span>Continue to Step 0{currentStep + 1}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-black" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleSubmit}
                    className="px-7 py-3 rounded-2xl bg-white hover:bg-neutral-200 text-black font-mono text-xs font-bold transition flex items-center gap-2 shadow-md disabled:opacity-50 cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>{submitting ? 'Deploying ZenForm...' : 'Publish Conference & Deploy ZenForm'}</span>
                  </button>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
