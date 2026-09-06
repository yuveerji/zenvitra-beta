'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Shield,
  Scale,
  Sparkles,
  Instagram,
  Edit3,
  Phone,
  GraduationCap,
} from 'lucide-react';
import type { ApiResponse, FormStatus } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

type ModalType = 'privacy' | 'terms' | null;

export function InterestForm() {
  const { t, locale } = useLanguage();

  const TRACKS = [
    {
      id: 'Model UN & Diplomacy',
      label: locale === 'hi' ? 'मॉडल संयुक्त राष्ट्र (MUN)' : 'Model UN (MUN)',
      desc: locale === 'hi' ? 'राजनय व वैश्विक नीतियां' : 'Diplomacy & Global Affairs',
    },
    {
      id: 'Youth Deliberation & Policy',
      label: locale === 'hi' ? 'युवा संसद व विमर्श' : 'Youth Parliament',
      desc: locale === 'hi' ? 'नीति निर्माण व परिचर्चा' : 'Policy & Governance',
    },
    {
      id: 'Debate & Oratory',
      label: locale === 'hi' ? 'वाद-विवाद व वक्तृत्व' : 'Debate & Oratory',
      desc: locale === 'hi' ? 'सार्वजनिक भाषण व तर्क' : 'Public Speaking & Rhetoric',
    },
    {
      id: 'Press & Media',
      label: locale === 'hi' ? 'प्रेस व पत्रकारिता' : 'Press & Media',
      desc: locale === 'hi' ? 'संपादकीय व दृश्य आख्यान' : 'Journalism & Media',
    },
    {
      id: 'Social Impact & Action',
      label: locale === 'hi' ? 'सामाजिक प्रभाव व पहल' : 'Social Impact',
      desc: locale === 'hi' ? 'धरातलीय सहभागिता व कार्य' : 'Grassroots Community Action',
    },
    {
      id: 'Tech & Policy Research',
      label: locale === 'hi' ? 'प्रौद्योगिकी व डिजिटल नीति' : 'Tech & AI Policy',
      desc: locale === 'hi' ? 'डिजिटल नैतिकता व शोध' : 'AI Ethics & Governance',
    },
    {
      id: 'Other',
      label: locale === 'hi' ? 'अन्य विशिष्ट विधा' : 'Other Specialization',
      desc: locale === 'hi' ? 'कस्टम रुचि क्षेत्र' : 'Custom Track Focus',
    },
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    institution: '',
    instagram: '',
    interest_type: 'Model UN & Diplomacy',
    vision: '',
  });

  const [customInterest, setCustomInterest] = useState<string>('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModal) {
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const resolvedInterest =
      formData.interest_type === 'Other'
        ? customInterest.trim()
          ? `Other: ${customInterest.trim()}`
          : 'Other'
        : formData.interest_type;

    const fullInterestPayload = formData.vision.trim()
      ? `${resolvedInterest} | Vision: ${formData.vision.trim()}`
      : resolvedInterest;

    try {
      const res = await fetch('/api/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          city: formData.city,
          institution: formData.institution,
          instagram: formData.instagram
            ? `${formData.instagram}${formData.phone ? ` | Phone: ${formData.phone}` : ''}`
            : formData.phone || 'N/A',
          interest_type: fullInterestPayload,
        }),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok || data.status === 'error') {
        throw new Error(
          data.message ||
            (locale === 'hi'
              ? 'त्रुटि हुई। कृपया पुनः प्रयास करें।'
              : 'Something went wrong. Please check your submission.')
        );
      }

      setStatus('success');
    } catch (err: unknown) {
      setStatus('error');
      setErrorMessage(
        err instanceof Error
          ? err.message
          : locale === 'hi'
          ? 'सर्वर से संपर्क स्थापित नहीं हो सका। कृपया नेटवर्क की जांच करें।'
          : 'Unable to submit interest. Please check your connection.'
      );
    }
  };

  const resolvedTrackDisplay =
    formData.interest_type === 'Other' && customInterest.trim()
      ? customInterest.trim()
      : formData.interest_type;

  return (
    <div className="w-full relative">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          /* SUCCESS SCREEN */
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4 }}
            className="glass-card rounded-3xl p-10 sm:p-14 text-center space-y-6 border-emerald-500/30 bg-emerald-950/10 shadow-2xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-emerald-400 font-semibold">
                {t.form.successBadge}
              </span>
              <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {t.form.successTitle}
              </h3>
            </div>

            <p className="text-sm text-neutral-300 max-w-md mx-auto font-light leading-relaxed">
              {t.form.successDesc1}{' '}
              <strong className="text-white font-semibold">{resolvedTrackDisplay}</strong>{' '}
              {t.form.successDesc2} <span className="text-white font-mono">{formData.email}</span>.
            </p>

            <div className="pt-4 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    city: '',
                    institution: '',
                    instagram: '',
                    interest_type: 'Model UN & Diplomacy',
                    vision: '',
                  });
                  setCustomInterest('');
                  setStatus('idle');
                }}
                className="px-6 py-2.5 rounded-full border border-white/15 bg-white/[0.03] text-xs font-mono tracking-wider text-neutral-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                {t.form.anotherBtn}
              </button>
            </div>
          </motion.div>
        ) : (
          /* REGISTRATION FORM */
          <motion.form
            key="interest-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 glass-card rounded-3xl p-8 sm:p-10 shadow-2xl text-left border-white/10 relative z-10"
          >
            {/* 1. Full Legal Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 font-medium">
                  {t.form.fullName} <span className="text-white">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.form.fullNamePlaceholder}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#0d0e14] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 font-medium">
                  {t.form.email} <span className="text-white">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder={t.form.emailPlaceholder}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#0d0e14] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition"
                />
              </div>
            </div>

            {/* 2. City & Contact Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 font-medium">
                  {t.form.city} <span className="text-white">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.form.cityPlaceholder}
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-[#0d0e14] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 font-medium flex items-center justify-between">
                  <span>{t.form.phone}</span>
                  <span className="text-neutral-500 font-normal lowercase">{t.form.optional}</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    placeholder={t.form.phonePlaceholder}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#0d0e14] border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition"
                  />
                </div>
              </div>
            </div>

            {/* 3. Institution & Instagram Handle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 font-medium flex items-center justify-between">
                  <span>{t.form.institution}</span>
                  <span className="text-neutral-500 font-normal lowercase">{t.form.optional}</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder={t.form.institutionPlaceholder}
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full bg-[#0d0e14] border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 font-medium flex items-center justify-between">
                  <span>{t.form.instagram}</span>
                  <span className="text-neutral-500 font-normal lowercase">{t.form.optional}</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder={t.form.instagramPlaceholder}
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="w-full bg-[#0d0e14] border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition"
                  />
                </div>
              </div>
            </div>

            {/* 4. Primary Track Selector */}
            <div className="space-y-2.5 pt-1">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-medium">
                {t.form.selectTrack} <span className="text-white">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {TRACKS.map((track) => {
                  const isSelected = formData.interest_type === track.id;
                  return (
                    <button
                      type="button"
                      key={track.id}
                      onClick={() => setFormData({ ...formData, interest_type: track.id })}
                      className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                          : 'border-white/10 bg-[#0d0e14]/70 hover:border-white/20 hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white tracking-tight">
                          {track.label}
                        </span>
                        {isSelected && <Sparkles className="w-3.5 h-3.5 text-white shrink-0" />}
                      </div>
                      <span className="text-[10px] text-neutral-400 font-light mt-1 leading-relaxed">
                        {track.desc}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Animated Other Field */}
              <AnimatePresence>
                {formData.interest_type === 'Other' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -6 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="pt-2 overflow-hidden"
                  >
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-2 font-medium flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-neutral-400" />
                      {t.form.otherLabel} <span className="text-white">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t.form.otherPlaceholder}
                      value={customInterest}
                      onChange={(e) => setCustomInterest(e.target.value)}
                      className="w-full bg-[#0d0e14] border border-white/20 rounded-xl px-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition"
                      autoFocus
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 5. Statement of Purpose / Vision */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 font-medium flex items-center justify-between">
                <span>{t.form.delegateVision}</span>
                <span className="text-neutral-500 font-normal lowercase">{t.form.optional}</span>
              </label>
              <textarea
                rows={3}
                placeholder={t.form.delegateVisionPlaceholder}
                value={formData.vision}
                onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                className="w-full bg-[#0d0e14] border border-white/10 rounded-xl p-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition resize-none"
              />
            </div>

            {/* In-Place Legal Consent Notice */}
            <div className="pt-2">
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                {t.form.termsNotice1}{' '}
                <button
                  type="button"
                  onClick={() => setActiveModal('terms')}
                  className="underline underline-offset-4 text-white hover:text-neutral-300 font-normal transition cursor-pointer"
                >
                  {t.footer.termsOfService}
                </button>{' '}
                {t.form.termsNotice2}{' '}
                <button
                  type="button"
                  onClick={() => setActiveModal('privacy')}
                  className="underline underline-offset-4 text-white hover:text-neutral-300 font-normal transition cursor-pointer"
                >
                  {t.footer.privacyPolicy}
                </button>
                .
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-4 rounded-xl bg-white text-black font-bold text-sm hover:bg-neutral-200 transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-4 cursor-pointer"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>{t.form.submittingBtn}</span>
                </>
              ) : (
                <>
                  <span>{t.form.submitBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Error Banner */}
            {status === 'error' && (
              <p className="text-rose-400 text-xs text-center mt-2 flex items-center justify-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>

      {/* FULL UNABRIDGED IN-PLACE LEGAL MODALS */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-3xl max-h-[85vh] rounded-3xl bg-[#090a0f] border border-white/15 p-6 sm:p-8 flex flex-col justify-between shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden text-left"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2.5">
                  {activeModal === 'privacy' ? (
                    <Shield className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Scale className="w-5 h-5 text-sky-400" />
                  )}
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {activeModal === 'privacy' ? t.privacyPage.title : t.termsPage.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveModal(null);
                  }}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto my-4 pr-3 space-y-6 text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                {activeModal === 'privacy' ? (
                  <div className="space-y-6">
                    <p className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                      {t.privacyPage.lastUpdated}
                    </p>

                    <section className="space-y-2">
                      <h4 className="text-base font-bold text-white tracking-tight">{t.privacyPage.sec1Title}</h4>
                      <p>{t.privacyPage.sec1P1}</p>
                      <p>{t.privacyPage.sec1P2}</p>
                    </section>

                    <section className="space-y-2">
                      <h4 className="text-base font-bold text-white tracking-tight">{t.privacyPage.sec2Title}</h4>
                      <p>{t.privacyPage.sec2Intro}</p>
                      <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
                        <li>
                          <strong className="text-white font-normal">{t.privacyPage.sec2B1Title}</strong>
                          {t.privacyPage.sec2B1Desc}
                        </li>
                        <li>
                          <strong className="text-white font-normal">{t.privacyPage.sec2B2Title}</strong>
                          {t.privacyPage.sec2B2Desc}
                        </li>
                        <li>
                          <strong className="text-white font-normal">{t.privacyPage.sec2B3Title}</strong>
                          {t.privacyPage.sec2B3Desc}
                        </li>
                      </ul>
                    </section>

                    <section className="space-y-2">
                      <h4 className="text-base font-bold text-white tracking-tight">{t.privacyPage.sec3Title}</h4>
                      <p>{t.privacyPage.sec3Intro}</p>
                      <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
                        <li>{t.privacyPage.sec3B1}</li>
                        <li>{t.privacyPage.sec3B2}</li>
                        <li>{t.privacyPage.sec3B3}</li>
                        <li>{t.privacyPage.sec3B4}</li>
                      </ul>
                    </section>

                    <section className="space-y-2">
                      <h4 className="text-base font-bold text-white tracking-tight">{t.privacyPage.sec4Title}</h4>
                      <p>{t.privacyPage.sec4P1}</p>
                      <p>{t.privacyPage.sec4P2}</p>
                    </section>

                    <section className="space-y-2">
                      <h4 className="text-base font-bold text-white tracking-tight">{t.privacyPage.sec5Title}</h4>
                      <p>{t.privacyPage.sec5P1}</p>
                      <p>{t.privacyPage.sec5P2}</p>
                    </section>

                    <section className="space-y-2">
                      <h4 className="text-base font-bold text-white tracking-tight">{t.privacyPage.sec6Title}</h4>
                      <p>{t.privacyPage.sec6P1}</p>
                      <p>{t.privacyPage.sec6P2}</p>
                    </section>

                    <section className="space-y-2">
                      <h4 className="text-base font-bold text-white tracking-tight">{t.privacyPage.sec7Title}</h4>
                      <p>{t.privacyPage.sec7Intro}</p>
                      <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
                        <li>{t.privacyPage.sec7B1}</li>
                        <li>{t.privacyPage.sec7B2}</li>
                        <li>{t.privacyPage.sec7B3}</li>
                      </ul>
                    </section>

                    <section className="space-y-2">
                      <h4 className="text-base font-bold text-white tracking-tight">{t.privacyPage.sec8Title}</h4>
                      <p>{t.privacyPage.sec8P1}</p>
                      <div className="p-4 rounded-xl bg-neutral-900/80 border border-white/10 font-mono text-xs text-neutral-300 space-y-1 mt-2 shadow-inner">
                        <p className="text-white font-semibold">{t.privacyPage.sec8BoxOrg}</p>
                        <p>{t.privacyPage.sec8BoxEmail}</p>
                        <p>{t.privacyPage.sec8BoxInsta}</p>
                        <p className="text-neutral-500">{t.privacyPage.sec8BoxLocation}</p>
                      </div>
                    </section>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <p className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                      {t.termsPage.lastUpdated}
                    </p>

                    <section className="space-y-2">
                      <h4 className="text-base font-bold text-white tracking-tight">{t.termsPage.sec1Title}</h4>
                      <p>{t.termsPage.sec1P1}</p>
                      <p>{t.termsPage.sec1P2}</p>
                    </section>

                    <section className="space-y-2">
                      <h4 className="text-base font-bold text-white tracking-tight">{t.termsPage.sec2Title}</h4>
                      <p>{t.termsPage.sec2P1}</p>
                      <p>{t.termsPage.sec2P2}</p>
                    </section>

                    <section className="space-y-2">
                      <h4 className="text-base font-bold text-white tracking-tight">{t.termsPage.sec3Title}</h4>
                      <p>{t.termsPage.sec3Intro}</p>
                      <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
                        <li>
                          <strong className="text-white font-normal">{t.termsPage.sec3B1Title}</strong>
                          {t.termsPage.sec3B1Desc}
                        </li>
                        <li>
                          <strong className="text-white font-normal">{t.termsPage.sec3B2Title}</strong>
                          {t.termsPage.sec3B2Desc}
                        </li>
                        <li>
                          <strong className="text-white font-normal">{t.termsPage.sec3B3Title}</strong>
                          {t.termsPage.sec3B3Desc}
                        </li>
                      </ul>
                    </section>

                    <section className="space-y-2">
                      <h4 className="text-base font-bold text-white tracking-tight">{t.termsPage.sec4Title}</h4>
                      <p>{t.termsPage.sec4P1}</p>
                      <p>{t.termsPage.sec4P2}</p>
                    </section>

                    <section className="space-y-2">
                      <h4 className="text-base font-bold text-white tracking-tight">{t.termsPage.sec5Title}</h4>
                      <p>{t.termsPage.sec5P1}</p>
                      <p>{t.termsPage.sec5P2}</p>
                    </section>

                    <section className="space-y-2">
                      <h4 className="text-base font-bold text-white tracking-tight">{t.termsPage.sec6Title}</h4>
                      <p>{t.termsPage.sec6P1}</p>
                    </section>

                    <section className="space-y-2">
                      <h4 className="text-base font-bold text-white tracking-tight">{t.termsPage.sec7Title}</h4>
                      <p>{t.termsPage.sec7P1}</p>
                      <p>{t.termsPage.sec7P2}</p>
                    </section>

                    <section className="space-y-2">
                      <h4 className="text-base font-bold text-white tracking-tight">{t.termsPage.sec8Title}</h4>
                      <p>{t.termsPage.sec8P1}</p>
                      <div className="p-4 rounded-xl bg-neutral-900/80 border border-white/10 font-mono text-xs text-neutral-300 space-y-1 mt-2 shadow-inner">
                        <p className="text-white font-semibold">{t.termsPage.sec8BoxOrg}</p>
                        <p>{t.termsPage.sec8BoxEmail}</p>
                        <p>{t.termsPage.sec8BoxLegal}</p>
                        <p className="text-neutral-500">{t.termsPage.sec8BoxLocation}</p>
                      </div>
                    </section>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-white/10 flex justify-end shrink-0 relative z-20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveModal(null);
                  }}
                  className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition cursor-pointer shadow-lg active:scale-95"
                >
                  {t.form.modalClose}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default InterestForm;