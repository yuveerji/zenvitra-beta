'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Send, 
  ShieldAlert, 
  Paperclip, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { TicketCategory, TicketPriority, CATEGORY_LABELS, PRIORITY_CONFIG } from '@/types/support';

const SUBCATEGORIES: Record<TicketCategory, string[]> = {
  ACCOUNT: ['Login / Password Recovery', 'Profile Verification', 'Account Suspension Appeal', '2FA / Device Access', 'Handle Change'],
  EVENTS: ['Registration Confirmation Missing', 'Attendee Name Correction', 'Gate Pass QR Not Generating', 'Event Cancellation / Schedule Change', 'Certificate of Participation'],
  MUN: ['Committee Allocation Query', 'Executive Board / Dais Access', 'Speaker Queue Error', 'Draft Resolution Upload Problem', 'Roll Call Discrepancy'],
  PAYMENTS: ['Duplicate Cashfree Deduction', 'Payment Settlement Delay', 'Refund Request', 'Student 0% GST Verification', 'Invoice / GST Receipt Request'],
  TECHNICAL: ['Page Crash / Unhandled Error', 'Real-time Chat Lag / Sync Bug', 'Mobile Browser Layout Issue', 'WebSocket / Presence Failure', 'API Timeout'],
  SAFETY: ['Harassment / Unwanted Contact', 'Impersonation Report', 'Privacy Violation / Data Removal', 'Code of Conduct Breach', 'Unsafe Conference Behavior'],
  GENERAL: ['Partnership / Sponsorship Inquiry', 'Campus Ambassador Program', 'Feature Suggestion', 'Press / Media Inquiry', 'Other General Question']
};

export default function NewSupportTicketPage() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const [category, setCategory] = useState<TicketCategory>('ACCOUNT');
  const [subcategory, setSubcategory] = useState<string>('Login / Password Recovery');
  const [priority, setPriority] = useState<TicketPriority>('P3_NORMAL');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [relatedEventId, setRelatedEventId] = useState('');
  const [relatedTxnId, setRelatedTxnId] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [newAttachmentUrl, setNewAttachmentUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const userEmail = profile?.email || user?.email || '';
  const userName = profile?.display_name || user?.name || '';
  const userHandle = profile?.username || '';
  const userId = profile?.id || user?.id || '';

  const handleCategoryChange = (newCat: TicketCategory) => {
    setCategory(newCat);
    const subcats = SUBCATEGORIES[newCat] || [];
    setSubcategory(subcats[0] || '');
  };

  const handleAddAttachment = () => {
    if (!newAttachmentUrl.trim()) return;
    setAttachments([...attachments, newAttachmentUrl.trim()]);
    setNewAttachmentUrl('');
  };

  const handleRemoveAttachment = (idx: number) => {
    setAttachments(attachments.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setErrorMsg('Please provide a subject and detailed description.');
      return;
    }
    if (!userEmail) {
      setErrorMsg('A verified contact email is required to submit a ticket.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);

      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.trim(),
          category,
          subcategory,
          description: description.trim(),
          priority,
          userId,
          userEmail,
          userName: userName || userEmail.split('@')[0],
          userHandle,
          relatedEventId: relatedEventId.trim() || null,
          relatedTxnId: relatedTxnId.trim() || null,
          attachmentUrls: attachments
        })
      });

      const data = await res.json();
      if (data.success && data.ticket) {
        router.push(`/support/${data.ticket.ticketNumber || data.ticket.id}`);
      } else {
        setErrorMsg(data.error || 'Failed to submit support ticket.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error while submitting ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030407] text-white flex flex-col font-sans selection:bg-cyan-500/30">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <Link href="/support" className="hover:text-cyan-400 transition flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Support Helpdesk</span>
          </Link>
          <span>/</span>
          <span className="text-white">Create New Case</span>
        </div>

        {/* Header */}
        <div className="border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
              OFFICIAL INQUIRY INTAKE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white mt-2">
            Submit a Support Request
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 font-sans">
            Our specialized support team investigates cases with auditable status tracking and dedicated department routing.
          </p>
        </div>

        {/* Security / Privacy Warning Banner */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 font-sans">
            <strong className="text-white font-mono font-bold block">Privacy &amp; Security Mandate:</strong>
            <p className="text-neutral-300">
              Never include your password, two-factor authentication codes, or full debit/credit card CVV details. 
              Our team will never request credentials to resolve any ticket.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-black/60 border border-white/10 space-y-6">
          
          {/* Category Selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold block">
              1. Issue Category <span className="text-cyan-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(CATEGORY_LABELS) as TicketCategory[]).map((cat) => {
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryChange(cat)}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500/60 text-white shadow-md shadow-cyan-500/10'
                        : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span className="text-xs font-bold block">{CATEGORY_LABELS[cat].label}</span>
                    <span className="text-[10px] font-mono text-cyan-400/80 mt-2 block">
                      &rarr; {CATEGORY_LABELS[cat].team}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subcategory */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold block">
              2. Specific Subcategory <span className="text-cyan-400">*</span>
            </label>
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
            >
              {(SUBCATEGORIES[category] || []).map((sub) => (
                <option key={sub} value={sub} className="bg-neutral-900 text-white">
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold block">
              3. Subject Summary <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Missing confirmation email for Delhi Youth Conclave 2026"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 font-sans"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold block">
              4. Detailed Explanation <span className="text-cyan-400">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide full details of what happened, steps to reproduce, or any relevant order numbers..."
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 font-sans leading-relaxed"
            />
          </div>

          {/* Optional Context Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-neutral-400 block">
                Related Event ID / Title (Optional)
              </label>
              <input
                type="text"
                value={relatedEventId}
                onChange={(e) => setRelatedEventId(e.target.value)}
                placeholder="e.g. DYC-2026 or conference name"
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-neutral-400 block">
                Related Cashfree / UTR Transaction ID (Optional)
              </label>
              <input
                type="text"
                value={relatedTxnId}
                onChange={(e) => setRelatedTxnId(e.target.value)}
                placeholder="e.g. order_123 or UTR reference"
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          {/* Priority Assessment */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold block">
              5. Urgency / Suggested Priority
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {(Object.keys(PRIORITY_CONFIG) as TicketPriority[]).map((p) => {
                const isSelected = priority === p;
                const pMeta = PRIORITY_CONFIG[p];
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer font-mono text-xs ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-500 text-white'
                        : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold">{pMeta.label.split('—')[0]}</div>
                    <div className="text-[10px] text-cyan-400 mt-1">{pMeta.sla}</div>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-neutral-500 font-sans">
              *Note: Priority is assessed by our triage desk to ensure critical platform or safety incidents receive immediate response.
            </p>
          </div>

          {/* Attachments */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold block">
              6. Evidence / Attachment Links (Screenshots, PDFs)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={newAttachmentUrl}
                onChange={(e) => setNewAttachmentUrl(e.target.value)}
                placeholder="https://example.com/screenshot.png"
                className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <button
                type="button"
                onClick={handleAddAttachment}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs cursor-pointer"
              >
                Attach
              </button>
            </div>

            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {attachments.map((url, i) => (
                  <div key={i} className="px-3 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-2">
                    <span className="truncate max-w-xs">{url}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(i)}
                      className="text-neutral-400 hover:text-rose-400"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-neutral-400 font-mono">
              Intake Contact: <strong className="text-white">{userEmail || 'You'}</strong>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                href="/support"
                className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-300 font-mono text-xs transition text-center w-full sm:w-auto"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-neutral-950 font-bold font-mono text-xs shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 w-full sm:w-auto"
              >
                <Send className="w-4 h-4 text-neutral-950" />
                <span>{submitting ? 'Submitting Case...' : 'Submit Request'}</span>
              </button>
            </div>
          </div>

        </form>

      </main>

      <Footer />
    </div>
  );
}
