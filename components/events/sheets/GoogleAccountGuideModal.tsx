'use client';

import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Check, 
  HelpCircle,
  Building,
  School,
  ArrowRight
} from 'lucide-react';

interface GoogleAccountGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GoogleAccountGuideModal({ isOpen, onClose }: GoogleAccountGuideModalProps) {
  const [activeOption, setActiveOption] = useState<'existing' | 'new'>('existing');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://accounts.google.com/signup');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl rounded-3xl bg-[#090b14] border border-white/15 p-6 sm:p-8 space-y-6 text-left shadow-2xl max-h-[90vh] overflow-y-auto selection:bg-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                Account Provisioning Guide
              </span>
              <span className="text-[11px] font-mono text-neutral-400">Google Workspace &amp; Sheets</span>
            </div>
            <h2 className="font-sans font-bold text-xl sm:text-2xl text-white">
              Don&apos;t Have a Google / Gmail Account?
            </h2>
            <p className="text-xs text-neutral-400">
              Follow these simple steps to access your event&apos;s live operational spreadsheet.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection: Use Existing Email vs New Gmail */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setActiveOption('existing')}
            className={`p-4 rounded-2xl border text-left transition cursor-pointer space-y-1.5 ${
              activeOption === 'existing'
                ? 'bg-white/10 border-white text-white shadow-sm'
                : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-neutral-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-sans font-bold text-sm text-white flex items-center gap-2">
                <School className="w-4 h-4 text-emerald-400" />
                <span>Use Current Email</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold">
                Recommended
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Use your existing school, university, or work email (e.g. @university.edu or @company.com) without creating a new email.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setActiveOption('new')}
            className={`p-4 rounded-2xl border text-left transition cursor-pointer space-y-1.5 ${
              activeOption === 'new'
                ? 'bg-white/10 border-white text-white shadow-sm'
                : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-neutral-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-sans font-bold text-sm text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-neutral-300" />
                <span>Create New @gmail.com</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Create a fresh, standalone @gmail.com address dedicated to managing your event operations.
            </p>
          </button>
        </div>

        {/* Option 1: Use Existing Email */}
        {activeOption === 'existing' && (
          <div className="space-y-4 p-5 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-neutral-300">
            <h3 className="font-bold font-sans text-sm text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>How to use your existing email as a Google Account</span>
            </h3>

            <ol className="space-y-3 list-decimal pl-4 leading-relaxed font-sans">
              <li>
                <strong className="text-white">Open the Google Account creation portal:</strong> Navigate to{' '}
                <a 
                  href="https://accounts.google.com/signup/v2/createaccount" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white underline hover:text-neutral-200"
                >
                  accounts.google.com/signup
                </a>.
              </li>
              <li>
                <strong className="text-white">Enter your Name:</strong> Fill in your First Name and Last Name.
              </li>
              <li>
                <strong className="text-white">Click &quot;Use my current email address instead&quot;:</strong> Instead of creating a new Gmail username, look directly below the username box for the option{' '}
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono font-bold">Use my current email address instead</span>.
              </li>
              <li>
                <strong className="text-white">Enter your school/work email:</strong> Type your existing email (e.g.{' '}
                <code className="text-white">sarah@university.edu</code>).
              </li>
              <li>
                <strong className="text-white">Verify via verification code:</strong> Google will send a 6-digit verification code to your current email inbox. Enter the code to confirm ownership.
              </li>
              <li>
                <strong className="text-white">Set a secure password:</strong> Create a strong password for your new Google Account services.
              </li>
            </ol>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                Done! You can now sign in to Google Sheets and Drive with your existing email, zero new inboxes to check!
              </span>
            </div>
          </div>
        )}

        {/* Option 2: Create Brand New @gmail.com */}
        {activeOption === 'new' && (
          <div className="space-y-4 p-5 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-neutral-300">
            <h3 className="font-bold font-sans text-sm text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-white" />
              <span>How to create a brand new @gmail.com account</span>
            </h3>

            <ol className="space-y-3 list-decimal pl-4 leading-relaxed font-sans">
              <li>
                <strong className="text-white">Visit Google Sign-Up:</strong> Go to{' '}
                <a 
                  href="https://accounts.google.com/signup" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white underline hover:text-neutral-200"
                >
                  accounts.google.com/signup
                </a>.
              </li>
              <li>
                <strong className="text-white">Choose a username:</strong> Select an available address (e.g.{' '}
                <code className="text-white">horizonmun.ops@gmail.com</code>).
              </li>
              <li>
                <strong className="text-white">Set a strong password:</strong> Include a mix of letters, numbers, and symbols.
              </li>
              <li>
                <strong className="text-white">Add recovery info:</strong> Provide a mobile number or recovery email to protect your account.
              </li>
              <li>
                <strong className="text-white">Accept Terms:</strong> Complete the setup and your new Google Workspace is instantly active.
              </li>
            </ol>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono transition flex items-center justify-center gap-2"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied' : 'Copy Sign-Up Link'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono transition"
            >
              Close
            </button>

            <a
              href="https://accounts.google.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-sans font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Open Google Sign-Up</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
