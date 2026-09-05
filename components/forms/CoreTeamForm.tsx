'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Crown,
  Briefcase,
  Sparkles,
  Link2,
  Clock,
  FileText,
  Edit3,
} from 'lucide-react';
import type { ApiResponse, FormStatus } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export function CoreTeamForm() {
  const { t, locale } = useLanguage();

  const DEPARTMENTS = [
    {
      id: 'Secretariat & Summit Operations',
      label: locale === 'hi' ? 'सचिवालय एवं संचालन' : 'Secretariat & Operations',
      desc: locale === 'hi' ? 'सम्मेलन प्रबंधन, रसद व समन्वय' : 'Summit Management, Logistics & Execution',
    },
    {
      id: 'Policy & Academic Research',
      label: locale === 'hi' ? 'नीति एवं शोध प्रभाग' : 'Policy & Academic Research',
      desc: locale === 'hi' ? 'पृष्ठभूमि नियमावली, शोध व कार्यसूची' : 'Background Guides, Agendas & Briefs',
    },
    {
      id: 'Design & Creative Direction',
      label: locale === 'hi' ? 'डिज़ाइन व रचनात्मक प्रभाग' : 'Design & Creative Direction',
      desc: locale === 'hi' ? 'ब्रांड पहचान, UI/UX व दृश्य संचार' : 'Visual Identity, UI/UX & Art Direction',
    },
    {
      id: 'Technology & Web Ecosystem',
      label: locale === 'hi' ? 'तकनीकी एवं डिजिटल विकास' : 'Technology & Web Ecosystem',
      desc: locale === 'hi' ? 'सॉफ्टवेयर, पोर्टल विकास व ऑटोमेशन' : 'Fullstack Engineering, Architecture & Tools',
    },
    {
      id: 'Strategic Outreach & PR',
      label: locale === 'hi' ? 'रणनीतिक विस्तार व जनसंपर्क' : 'Strategic Outreach & PR',
      desc: locale === 'hi' ? 'संस्थागत साझेदारी, मीडिया व प्रतिनिधि संपर्क' : 'Institutional Partnerships & Delegate Relations',
    },
    {
      id: 'Finance & Sponsorships',
      label: locale === 'hi' ? 'वित्त एवं संसाधन प्रबंधन' : 'Finance & Sponsorships',
      desc: locale === 'hi' ? 'बजट प्रबंधन, अनुदान व कॉर्पोरेट प्रायोजन' : 'Budgeting, Grants & Corporate Alliances',
    },
    {
      id: 'Other',
      label: locale === 'hi' ? 'अन्य विशिष्ट प्रभाग' : 'Other Specialization',
      desc: locale === 'hi' ? 'कस्टम नेतृत्व भूमिका' : 'Custom Leadership Focus',
    },
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    institution: '',
    department: 'Secretariat & Summit Operations',
    priorExperience: '',
    portfolio: '',
    whyLead: '',
    commitment: '6-10 hours/week',
  });

  const [customDepartment, setCustomDepartment] = useState<string>('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const resolvedDepartment =
      formData.department === 'Other'
        ? customDepartment.trim()
          ? `Other: ${customDepartment.trim()}`
          : 'Other'
        : formData.department;

    try {
      const res = await fetch('/api/core-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          department: resolvedDepartment,
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
          ? 'सर्वर से संपर्क स्थापित नहीं हो सका।'
          : 'Unable to submit dossier. Please check your connection.'
      );
    }
  };

  const resolvedDepartmentDisplay =
    formData.department === 'Other' && customDepartment.trim()
      ? customDepartment.trim()
      : formData.department;

  return (
    <div className="w-full relative">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="core-success-card"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4 }}
            className="glass-card rounded-3xl p-10 sm:p-14 text-center space-y-6 border-amber-500/30 bg-amber-950/10 shadow-2xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8 text-amber-400" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-amber-400 font-semibold">
                {t.coreTeam.successBadge}
              </span>
              <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {t.coreTeam.successTitle}
              </h3>
            </div>

            <p className="text-sm text-neutral-300 max-w-md mx-auto font-light leading-relaxed">
              {t.coreTeam.successDesc1}{' '}
              <strong className="text-white font-semibold">{resolvedDepartmentDisplay}</strong>{' '}
              {t.coreTeam.successDesc2} <span className="text-white font-mono">{formData.email}</span>.
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
                    department: 'Secretariat & Summit Operations',
                    priorExperience: '',
                    portfolio: '',
                    whyLead: '',
                    commitment: '6-10 hours/week',
                  });
                  setCustomDepartment('');
                  setStatus('idle');
                }}
                className="px-6 py-2.5 rounded-full border border-white/15 bg-white/[0.03] text-xs font-mono tracking-wider text-neutral-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                {t.coreTeam.anotherBtn}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="core-team-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 glass-card rounded-3xl p-8 sm:p-10 shadow-2xl text-left border-white/10 relative z-10"
          >
            {/* Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 font-medium">
                  {t.coreTeam.fullName} <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.coreTeam.fullNamePlaceholder}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#0d0e14] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 font-medium">
                  {t.coreTeam.email} <span className="text-amber-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder={t.coreTeam.emailPlaceholder}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#0d0e14] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 transition"
                />
              </div>
            </div>

            {/* City & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 font-medium">
                  {t.coreTeam.city} <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.coreTeam.cityPlaceholder}
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-[#0d0e14] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 font-medium">
                  {t.coreTeam.phone} <span className="text-amber-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder={t.coreTeam.phonePlaceholder}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#0d0e14] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 transition"
                />
              </div>
            </div>

            {/* Institution & Portfolio Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 font-medium">
                  {t.coreTeam.institution} <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.coreTeam.institutionPlaceholder}
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full bg-[#0d0e14] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 font-medium flex items-center justify-between">
                  <span>{t.coreTeam.portfolio}</span>
                  <span className="text-neutral-500 font-normal lowercase">{t.form.optional}</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    placeholder={t.coreTeam.portfolioPlaceholder}
                    value={formData.portfolio}
                    onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                    className="w-full bg-[#0d0e14] border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 transition"
                  />
                </div>
              </div>
            </div>

            {/* Directorate Selection Grid */}
            <div className="space-y-2.5 pt-1">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-medium">
                {t.coreTeam.deptSelect} <span className="text-amber-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {DEPARTMENTS.map((dept) => {
                  const isSelected = formData.department === dept.id;
                  return (
                    <button
                      type="button"
                      key={dept.id}
                      onClick={() => setFormData({ ...formData, department: dept.id })}
                      className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-400/80 bg-amber-400/10 shadow-[0_0_15px_rgba(251,191,36,0.15)]'
                          : 'border-white/10 bg-[#0d0e14]/70 hover:border-white/20 hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white tracking-tight">
                          {dept.label}
                        </span>
                        {isSelected ? (
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        ) : (
                          <Briefcase className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-400 font-light mt-1.5 leading-relaxed">
                        {dept.desc}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Animated Other Specialization Field */}
              <AnimatePresence>
                {formData.department === 'Other' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -6 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="pt-2 overflow-hidden"
                  >
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-amber-300 mb-2 font-medium flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                      {locale === 'hi' ? 'अपनी विशिष्ट भूमिका / प्रभाग का उल्लेख करें' : 'Specify Your Custom Directorate / Role'}{' '}
                      <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={
                        locale === 'hi'
                          ? 'उदा. विधिक प्रभाग, सुरक्षा परिषद निदेशक, मीडिया प्रोडक्शन...'
                          : 'e.g. Legal Affairs, Security Council Directorship, Media Production...'
                      }
                      value={customDepartment}
                      onChange={(e) => setCustomDepartment(e.target.value)}
                      className="w-full bg-[#0d0e14] border border-amber-400/40 rounded-xl px-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                      autoFocus
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Prior Experience Track Record */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 font-medium flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-neutral-400" />
                {t.coreTeam.priorExp} <span className="text-amber-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder={t.coreTeam.priorExpPlaceholder}
                value={formData.priorExperience}
                onChange={(e) => setFormData({ ...formData, priorExperience: e.target.value })}
                className="w-full bg-[#0d0e14] border border-white/10 rounded-xl p-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 transition resize-none"
              />
            </div>

            {/* Statement of Purpose & Vision */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 font-medium">
                {t.coreTeam.whyLead} <span className="text-amber-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder={t.coreTeam.whyLeadPlaceholder}
                value={formData.whyLead}
                onChange={(e) => setFormData({ ...formData, whyLead: e.target.value })}
                className="w-full bg-[#0d0e14] border border-white/10 rounded-xl p-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 transition resize-none"
              />
            </div>

            {/* Weekly Commitment */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                {t.coreTeam.commitment} <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder={t.coreTeam.commitmentPlaceholder}
                value={formData.commitment}
                onChange={(e) => setFormData({ ...formData, commitment: e.target.value })}
                className="w-full bg-[#0d0e14] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-bold text-sm hover:opacity-90 transition flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(251,191,36,0.25)] disabled:opacity-50 mt-4 cursor-pointer"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>{t.coreTeam.submittingBtn}</span>
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 text-black" />
                  <span>{t.coreTeam.submitBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {status === 'error' && (
              <p className="text-rose-400 text-xs text-center mt-2 flex items-center justify-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CoreTeamForm;