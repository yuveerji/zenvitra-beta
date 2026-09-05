'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  Globe2, 
  Send, 
  Sparkles, 
  Heart, 
  CheckCircle2, 
  ExternalLink,
  Instagram,
  Youtube,
  Twitter,
  Github,
  Mail,
  Building2,
  Users,
  Terminal,
  Newspaper,
  Crown,
  FileText,
  Radio,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { useLanguage } from '@/context/LanguageContext';

export function Footer() {
  const { locale } = useLanguage();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubscribed(true);
    setEmailInput('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="w-full border-t border-white/10 bg-[#040507] relative z-10 font-sans text-white selection:bg-cyan-500/30">
      
      {/* Top Ambient Glow Lines */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-500/[0.02] blur-[150px] rounded-full pointer-events-none" />

      {/* ─── 1. TOP NEWSLETTER / DISPATCH BRIEFING BAR ─── */}
      <div className="border-b border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Heading & Value Prop */}
            <div className="lg:col-span-6 space-y-2 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-mono tracking-wider uppercase">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Sovereign Intelligence Wire</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
                Subscribe to Diplomatic & Civic Dispatches
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-lg leading-relaxed">
                Receive uncompromised international summit bulletins, student research papers, and public treasury transparency audits directly in your inbox.
              </p>
            </div>

            {/* Right: Interactive Subscription Form */}
            <div className="lg:col-span-6 text-left">
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="relative w-full">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="diplomat@school.org or your email..."
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/60 transition shadow-inner"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.2)] shrink-0 active:scale-95"
                  >
                    <span>Join Wire</span>
                    <Send className="w-3.5 h-3.5 text-black" />
                  </button>
                </div>
                {subscribed ? (
                  <p className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Transmitted! You are now connected to the Zenvitra Sovereign Wire.</span>
                  </p>
                ) : (
                  <div className="flex items-center gap-4 text-[10px] font-mono text-neutral-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5 text-emerald-400" /> Zero spam
                    </span>
                    <span>•</span>
                    <span>256-Bit Encrypted Dispatches</span>
                    <span>•</span>
                    <span>Instant 1-Click Unsubscribe</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. MAIN DETAILED 5-COLUMN LINK DIRECTORY ─── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-12 pb-14 border-b border-white/10">
          
          {/* Column 1: Brand, Non-Profit Accord & Social Links (4 Columns) */}
          <div className="lg:col-span-4 space-y-5 text-left">
            <div className="inline-block">
              <BrandLogo />
            </div>

            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              {locale === 'hi'
                ? 'ज़ेनवित्रा एक युवा-संचालित गैर-लाभकारी पारितंत्र है जहाँ विचार संवाद में, संवाद सहयोग में और सहयोग वास्तविक विश्व प्रभाव में बदलते हैं।'
                : 'A decentralized sovereign youth ecosystem empowering future diplomats, investigative journalists, and civic architects through uncompromised debate, verified action, and real-world democratic impact.'}
            </p>

            {/* Non-Profit Headquarters Pill */}
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
                  HEADQUARTERS
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
              </div>
              <p className="text-white font-semibold">Udaipur, Rajasthan, India</p>
              <p className="text-[10px] text-neutral-400">Registered Section 8 Non-Profit Entity</p>
            </div>

            {/* Social Channels Row */}
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
                Official Channels
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="https://instagram.com/zenvitrafoundation"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-pink-500/40 text-neutral-300 hover:text-pink-400 transition cursor-pointer"
                  title="Instagram @zenvitrafoundation"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com/@zenvitrafoundation"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-red-500/40 text-neutral-300 hover:text-red-400 transition cursor-pointer"
                  title="YouTube @ZenvitraFoundation"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href="mailto:contact@zenvitra.xyz"
                  className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-cyan-500/40 text-neutral-300 hover:text-cyan-300 transition cursor-pointer"
                  title="Official Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-white/40 text-neutral-300 hover:text-white transition cursor-pointer"
                  title="GitHub Open Source"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Sovereign Ecosystem (2 Columns) */}
          <div className="lg:col-span-2 space-y-3.5 text-left">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 font-bold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ecosystem</span>
            </p>
            <ul className="space-y-2.5 text-xs font-mono text-neutral-400">
              <li>
                <Link href="/pulse" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-cyan-400 group-hover:scale-150 transition-transform" />
                  <span>ZEN.PULSE Feed</span>
                </Link>
              </li>
              <li>
                <Link href="/pulse?tab=flux" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-rose-400 group-hover:scale-150 transition-transform" />
                  <span>ZEN.SPARK Reels</span>
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-amber-400 group-hover:scale-150 transition-transform" />
                  <span>ZEN.EVENTS Dais</span>
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-violet-400 group-hover:scale-150 transition-transform" />
                  <span>ZEN.PRESS Wire</span>
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 group-hover:scale-150 transition-transform" />
                  <span>ZEN.CHAT Relay</span>
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-blue-400 group-hover:scale-150 transition-transform" />
                  <span>ZEN.SOLUTIONS</span>
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-cyan-400 group-hover:scale-150 transition-transform" />
                  <span>ZEN.DOCS Studio</span>
                </Link>
              </li>
              <li>
                <Link href="/payments" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 group-hover:scale-150 transition-transform" />
                  <span>ZEN.PAYMENTS Hub</span>
                </Link>
              </li>
              <li>
                <Link href="/mun/conference" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-purple-400 group-hover:scale-150 transition-transform" />
                  <span>Conference Command</span>
                </Link>
              </li>
              <li>
                <Link href="/discussions" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-indigo-400 group-hover:scale-150 transition-transform" />
                  <span>Civic Assemblies</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Diplomatic Dais & MUN (2 Columns) */}
          <div className="lg:col-span-2 space-y-3.5 text-left">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 font-bold flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Diplomacy</span>
            </p>
            <ul className="space-y-2.5 text-xs font-mono text-neutral-400">
              <li>
                <Link href="/mun" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5 font-bold text-amber-300">
                  <span>ZEN.MUN Operating System</span>
                </Link>
              </li>
              <li>
                <Link href="/committee" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5">
                  <span>Chamber Dais Liveboard</span>
                </Link>
              </li>
              <li>
                <Link href="/committee/unsc-2026" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5">
                  <span>UN Security Council</span>
                </Link>
              </li>
              <li>
                <Link href="/committee/unga-plenary" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5">
                  <span>UNGA Plenary Dais</span>
                </Link>
              </li>
              <li>
                <Link href="/committee/unhrc-2026" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5">
                  <span>Human Rights Council</span>
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5">
                  <span>International Press Bureau</span>
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5">
                  <span>Speaker Order Engine</span>
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5">
                  <span>Draft Resolutions</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Institutional & Relief (2 Columns) */}
          <div className="lg:col-span-2 space-y-3.5 text-left">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 font-bold flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Impact & Relief</span>
            </p>
            <ul className="space-y-2.5 text-xs font-mono text-neutral-400">
              <li>
                <Link href="/donate/nepal" className="text-red-400 hover:text-red-300 font-bold transition flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span>Nepal Relief (PMDRF)</span>
                </Link>
              </li>
              <li>
                <Link href="/impact" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5">
                  <span>25% Profit Endowment</span>
                </Link>
              </li>
              <li>
                <Link href="/impact" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5">
                  <span>Impact Transparency</span>
                </Link>
              </li>
              <li>
                <Link href="/join-core-team" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5 text-amber-300">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>Join Core Team</span>
                </Link>
              </li>
              <li>
                <Link href="/mission" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5">
                  <span>Mission & Vision</span>
                </Link>
              </li>
              <li>
                <a href="mailto:secretariat@zenvitra.xyz" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5">
                  <span>Contact Secretariat</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Security & Governance (2 Columns) */}
          <div className="lg:col-span-2 space-y-3.5 text-left">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Governance</span>
            </p>
            <ul className="space-y-2.5 text-xs font-mono text-neutral-400">
              <li>
                <Link href="/pricing" className="text-cyan-300 hover:text-cyan-200 font-bold hover:translate-x-0.5 transition-all flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Pricing &amp; Memberships</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5">
                  <span>Security Shield</span>
                </Link>
              </li>
              <li>
                <Link href="/constitution" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5">
                  <span>Constitutional Ledger</span>
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="text-amber-300 hover:text-amber-200 hover:translate-x-0.5 transition-all flex items-center gap-1.5 font-bold">
                  <span>Community &amp; Content Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5">
                  <span>Privacy Policy (DPDP)</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5">
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5">
                  <span>Zero-Bot Guarantee</span>
                </Link>
              </li>
              <li>
                <Link href="/manifesto" className="hover:text-white hover:translate-x-0.5 transition-all flex items-center gap-1.5">
                  <span>Youth Manifesto</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ─── 3. BOTTOM AUDIT & CRYPTOGRAPHIC LEDGER BAR ─── */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span>© 2026 ZENVITRA FOUNDATION</span>
            <span>•</span>
            <span className="text-neutral-400">NON-PROFIT CIVIC PROTOCOL</span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% VERIFIED LEDGER
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="uppercase tracking-[0.25em] text-neutral-400 font-bold">
              BY YOUTH. FOR YOUTH.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;