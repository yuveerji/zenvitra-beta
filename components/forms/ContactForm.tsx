'use client';

import React, { useState } from 'react';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useChat } from '@/context/ChatContext';

const DEPARTMENTS = [
  { id: 'GENERAL_SECRETARIAT', label: 'Executive Secretariat (General & Strategic)' },
  { id: 'POLICY_LABS', label: 'Policy & Global Governance Commission' },
  { id: 'TECH_VENTURES', label: 'Technology & Frontier Innovation Labs' },
  { id: 'CHAPTER_EXPANSION', label: 'Institutional Chapters & University Network' },
  { id: 'PRESS_GUILD', label: 'Media, Press & Publications Guild' },
];

export function ContactForm() {
  const { locale } = useLanguage();
  const { startOrOpenThread } = useChat();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: DEPARTMENTS[0].id,
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    setIsSubmitting(true);

    // Automatically transition to Zen.chat active conversation
    startOrOpenThread({
      name: formData.name.trim(),
      email: formData.email.trim(),
      category: formData.department,
      initialMessage: `[Subject: ${formData.subject.trim() || 'General Inquiry'}]\n\n${formData.message.trim()}`,
    });

    setIsSubmitting(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 sm:p-10 rounded-3xl bg-[#08090d]/80 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6 text-left"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            {locale === 'hi' ? 'पूर्ण नाम' : 'Full Legal Name'} <span className="text-amber-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Yuveer Chhatwani"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-[#0d0e14] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400/50 transition"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            {locale === 'hi' ? 'ईमेल पता' : 'Official Email'} <span className="text-amber-400">*</span>
          </label>
          <input
            type="email"
            required
            placeholder="innovator@domain.xyz"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-[#0d0e14] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400/50 transition"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400">
          {locale === 'hi' ? 'लक्षित विभाग' : 'Target Directorate'} <span className="text-amber-400">*</span>
        </label>
        <select
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          className="w-full bg-[#0d0e14] border border-white/10 rounded-xl px-4 py-3 text-xs text-neutral-200 focus:outline-none focus:border-amber-400/50 transition"
        >
          {DEPARTMENTS.map((dept) => (
            <option key={dept.id} value={dept.id} className="bg-[#090a0f] text-white">
              {dept.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400">
          {locale === 'hi' ? 'विषय' : 'Subject'} <span className="text-amber-400">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Chapter Partnership / Research Commission Inquiry"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full bg-[#0d0e14] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400/50 transition"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400">
          {locale === 'hi' ? 'विस्तृत संदेश' : 'Detailed Inquiries / Proposition'} <span className="text-amber-400">*</span>
        </label>
        <textarea
          required
          rows={4}
          placeholder="Provide context regarding your inquiry..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full bg-[#0d0e14] border border-white/10 rounded-xl p-4 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400/50 resize-none transition"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
      >
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        <span>Transmit to Zen.chat Live Desk</span>
      </button>
    </form>
  );
}

export default ContactForm;