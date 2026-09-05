'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Sparkles, Shield, Newspaper, Calendar, Heart } from 'lucide-react';
import Link from 'next/link';

export interface TermDefinition {
  id: string;
  term: string;
  tag: string;
  icon: React.ElementType;
  definition: string;
  platformRelation: string;
  protocolBadge: string;
  ctaText: string;
  ctaHref: string;
  accentColor: string;
  tagColor?: string;
  dotColor?: string;
}

export const GLOSSARY_TERMS: Record<string, TermDefinition> = {
  leaders: {
    id: 'leaders',
    term: 'Youth Leaders & Thinkers',
    tag: 'CIVIC & ASSEMBLY LEADERSHIP',
    icon: Calendar,
    definition: 'Youth thinkers, writers, organizers, and sovereign minds actively drafting solutions, convening assemblies, and shaping civic governance with senses and verifiable sources.',
    platformRelation: 'Powers ZEN.EVENTS & CHAMBERS — our dedicated assembly OS with real-time voting, live discussion sessions, and permanent civic participation records.',
    protocolBadge: 'ZEN.EVENTS // ASSEMBLY OS',
    ctaText: 'Explore Assemblies & Events',
    ctaHref: '/events',
    accentColor: 'from-amber-400/20 via-amber-500/10 to-transparent text-amber-300 border-amber-500/30',
    tagColor: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
    dotColor: 'bg-amber-400',
  },
  creators: {
    id: 'creators',
    term: 'Youth Creators & Writers',
    tag: 'SOVEREIGN MEDIA & OPEN JOURNALISM',
    icon: Newspaper,
    definition: 'Youth writers, researchers, journalists, visual artists, and digital creators challenging mainstream sensationalism and algorithmic outrage with verified sources.',
    platformRelation: 'Powers ZEN.PRESS & ZEN.FLUX — providing writers and creators with an open press wire and a chronological 9:16 vertical video stream free of commercial ad algorithms.',
    protocolBadge: 'ZEN.PRESS // MEDIA WIRE',
    ctaText: 'Read Public Archives',
    ctaHref: '/press',
    accentColor: 'from-cyan-400/20 via-cyan-500/10 to-transparent text-cyan-300 border-cyan-500/30',
    tagColor: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10',
    dotColor: 'bg-cyan-400',
  },
  innovators: {
    id: 'innovators',
    term: 'Youth Innovators & Builders',
    tag: 'CIVIC TECH & PUBLIC BUILDERS',
    icon: Heart,
    definition: 'Youth builders, researchers, programmers, and grassroots social entrepreneurs turning community debate into actionable civic projects and public digital goods.',
    platformRelation: 'Backed by ZEN.IMPACT — a constitutional endowment guaranteeing 25% of all net platform profits are distributed every 4 months to student scholarships and school supplies, verified with offline giveaway videos on ZEN.FLUX.',
    protocolBadge: 'ZEN.IMPACT // 25% PROFIT FUND',
    ctaText: 'View Civic Impact Fund',
    ctaHref: '/impact',
    accentColor: 'from-emerald-400/20 via-emerald-500/10 to-transparent text-emerald-300 border-emerald-500/30',
    tagColor: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10',
    dotColor: 'bg-emerald-400',
  },
  'meaningful-change': {
    id: 'meaningful-change',
    term: 'Meaningful Change',
    tag: 'FOUNDATIONAL PHILOSOPHY',
    icon: Sparkles,
    definition: 'Discourse that outlasts ephemeral 24-hour social media cycles, resulting in documented public records, verified policy drafts, and tangible community outcomes.',
    platformRelation: 'Every debate on Zenvitra leaves behind an immutable public record, transforming passive arguments into permanent civic archives.',
    protocolBadge: 'ZENVITRA MANIFESTO',
    ctaText: 'Read Our Manifesto',
    ctaHref: '/manifesto',
    accentColor: 'from-purple-400/20 via-purple-500/10 to-transparent text-purple-300 border-purple-500/30',
    tagColor: 'text-purple-300 border-purple-500/30 bg-purple-500/10',
    dotColor: 'bg-purple-400',
  },
  truth: {
    id: 'truth',
    term: 'Empirical Truth',
    tag: 'EPISTEMIC STANDARD',
    icon: Shield,
    definition: 'Uncompromising factual verifiability, peer-reviewed citations, and primary source grounding. Rejecting algorithmic sensationalism, deceptive headlines, and unverified rumors in favor of documented truth.',
    platformRelation: 'Enforced via Proof-of-Citation audits, peer challenge bounties, and transparent community fact-checking across all public articles and assembly resolutions.',
    protocolBadge: 'FACT AUDIT // EMPIRICAL TRUTH',
    ctaText: 'Explore Press Archives',
    ctaHref: '/press',
    accentColor: 'from-cyan-400/20 via-blue-500/10 to-transparent text-cyan-200 border-cyan-500/30',
    tagColor: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10',
    dotColor: 'bg-cyan-400',
  },
  youth: {
    id: 'youth',
    term: 'Sovereign Youth',
    tag: 'SOVEREIGN GENERATION',
    icon: Sparkles,
    definition: 'The ultimate architects of tomorrow. Driven by radical transparency, uncompromising execution, and collaboration over institutional gatekeeping. Built for youth and open to every mind with senses and sources.',
    platformRelation: 'Zenvitra is 100% designed, coded, and governed by youth, creating an open ecosystem built entirely on our generation’s terms.',
    protocolBadge: 'BY YOUTH // FOR YOUTH',
    ctaText: 'About Zenvitra',
    ctaHref: '/about',
    accentColor: 'from-amber-400/20 via-rose-500/10 to-transparent text-amber-200 border-amber-500/30',
    tagColor: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
    dotColor: 'bg-amber-400',
  },
  'truth-and-youth': {
    id: 'truth-and-youth',
    term: 'Truth & Youth',
    tag: 'CORE DOCTRINE',
    icon: Shield,
    definition: 'The dual pillar of the Zenvitra revolution: Unyielding commitment to verified empirical truth paired with the fearless energy, civic idealism, and technological fluency of the sovereign youth generation.',
    platformRelation: 'Unites empirical peer-reviewed facts with global youth assemblies, ensuring that young leaders shape international discourse with unshakeable credibility.',
    protocolBadge: 'PILLAR 01 // TRUTH & YOUTH',
    ctaText: 'Read Our Manifesto',
    ctaHref: '/manifesto',
    accentColor: 'from-amber-400/20 via-cyan-500/10 to-transparent text-amber-200 border-amber-500/30',
    tagColor: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
    dotColor: 'bg-amber-400',
  },
  sovereignty: {
    id: 'sovereignty',
    term: 'Sovereignty & Agency',
    tag: 'SYSTEMIC AUTONOMY',
    icon: Shield,
    definition: 'The inherent right of delegates and communities to own their data, govern their chambers, and deliberate freely without predatory ad surveillance or corporate censorship.',
    platformRelation: 'Enforced through client-side cryptographic hashes, zero tracking cookies, and open verification architectures across the entire stack.',
    protocolBadge: 'SOVEREIGN CORE // ZERO SURVEILLANCE',
    ctaText: 'Explore Platform Architecture',
    ctaHref: '/about',
    accentColor: 'from-purple-500/20 via-indigo-500/10 to-transparent text-purple-300 border-purple-500/30',
    tagColor: 'text-purple-300 border-purple-500/30 bg-purple-500/10',
    dotColor: 'bg-purple-400',
  },
  escrow: {
    id: 'escrow',
    term: 'Constitutional 25% Profit Endowment',
    tag: 'PUBLIC BENEFIT CHARTER',
    icon: Heart,
    definition: 'An immutable constitutional mandate: exactly 25% of all net platform profits are distributed every 4 months to student scholarships, classroom supplies, and school labs.',
    platformRelation: 'Audited every 4 months through public itemized receipts and unedited offline giveaway videos broadcast on ZEN.FLUX and social platforms.',
    protocolBadge: 'ZEN.IMPACT // 25% PROFIT MANDATE',
    ctaText: 'View Escrow Allocations',
    ctaHref: '/impact',
    accentColor: 'from-emerald-400/20 via-emerald-500/10 to-transparent text-emerald-300 border-emerald-500/30',
    tagColor: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10',
    dotColor: 'bg-emerald-400',
  },
  'take-rate': {
    id: 'take-rate',
    term: 'Ethical 0.5% + ₹19 Settlement',
    tag: 'TRANSPARENT COMMERCE',
    icon: Sparkles,
    definition: 'An ethical alternative to predatory 10%-15% ticketing platforms. Organizers keep maximum funds for delegate experience while funding civic education.',
    platformRelation: 'Powers ZEN.EVENTS ticketing and registrations with zero broker skimming and instant settlement.',
    protocolBadge: 'ZEN.SETTLE // FAIR COMMERCE',
    ctaText: 'View Organizer Economics',
    ctaHref: '/solutions',
    accentColor: 'from-amber-400/20 via-amber-500/10 to-transparent text-amber-300 border-amber-500/30',
    tagColor: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
    dotColor: 'bg-amber-400',
  },
  'proof-of-citation': {
    id: 'proof-of-citation',
    term: 'Proof-of-Citation Audit',
    tag: 'RESEARCH INTEGRITY',
    icon: Newspaper,
    definition: 'A cryptographic verification standard where every claim, treaty article, and statistic is tied to official digital library repositories or primary historical records.',
    platformRelation: 'Embedded in ZEN.PULSE treaties and ZEN.PRESS articles, allowing peer fact-checkers to stake bounties and verify sources.',
    protocolBadge: 'ZEN.AUDIT // CITATION MATRIX',
    ctaText: 'Explore Press Archives',
    ctaHref: '/press',
    accentColor: 'from-cyan-400/20 via-cyan-500/10 to-transparent text-cyan-300 border-cyan-500/30',
    tagColor: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10',
    dotColor: 'bg-cyan-400',
  },
  'assembly-os': {
    id: 'assembly-os',
    term: 'Assembly Operating System',
    tag: 'PARLIAMENTARY ENGINE',
    icon: Calendar,
    definition: 'An integrated operating system for Model UN conferences, youth parliaments, and crisis simulations featuring roll-calls, moderated caucuses, and resolution workbench.',
    platformRelation: 'Powers live committees on ZEN.EVENTS with real-time speaker queue management and resolution voting.',
    protocolBadge: 'ZEN.EVENTS // CAUCUS ENGINE',
    ctaText: 'Explore Assembly Grid',
    ctaHref: '/events',
    accentColor: 'from-amber-400/20 via-amber-500/10 to-transparent text-amber-300 border-amber-500/30',
    tagColor: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
    dotColor: 'bg-amber-400',
  },
  'zero-surveillance': {
    id: 'zero-surveillance',
    term: 'Zero Surveillance Advertising',
    tag: 'PRIVACY INVARIANT',
    icon: Shield,
    definition: 'The refusal to deploy behavioral tracking pixels, demographic profiling, or attention-harvesting algorithms that manipulate student discourse.',
    platformRelation: 'Ensures your thoughts, resolutions, and reading habits are never auctioned to advertisers or data brokers.',
    protocolBadge: 'ZENVITRA PRIVACY // NO ADS',
    ctaText: 'Read Privacy Protocol',
    ctaHref: '/privacy',
    accentColor: 'from-purple-400/20 via-purple-500/10 to-transparent text-purple-300 border-purple-500/30',
    tagColor: 'text-purple-300 border-purple-500/30 bg-purple-500/10',
    dotColor: 'bg-purple-400',
  },
  meritocracy: {
    id: 'meritocracy',
    term: 'Verified Civic Meritocracy',
    tag: 'MERIT PROTOCOL',
    icon: Sparkles,
    definition: 'A merit-driven clearance model where reputation, speaking priority, and credentials reflect the depth of your research and resolution contributions rather than social media clout.',
    platformRelation: 'Generates your official Sovereign Delegate Passport with verified attendance, speeches, and resolution co-authorship.',
    protocolBadge: 'CIVIC DOSSIER // MERIT MATRIX',
    ctaText: 'View Solutions Chamber',
    ctaHref: '/solutions',
    accentColor: 'from-amber-400/20 via-amber-500/10 to-transparent text-amber-300 border-amber-500/30',
    tagColor: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
    dotColor: 'bg-amber-400',
  },
  'sources-and-senses': {
    id: 'sources-and-senses',
    term: 'Senses & Verifiable Sources',
    tag: 'EPISTEMIC STANDARD',
    icon: Newspaper,
    definition: 'The foundational standard of Zenvitra discourse: combining rigorous critical thinking and emotional resonance with primary documents and empirical evidence.',
    platformRelation: 'Required across all ZEN.PRESS investigative publications and parliamentary resolutions tabled in Zenvitra chambers.',
    protocolBadge: 'FACT CHECK // SOURCE MATRIX',
    ctaText: 'Read Open Wire',
    ctaHref: '/press',
    accentColor: 'from-cyan-400/20 via-cyan-500/10 to-transparent text-cyan-300 border-cyan-500/30',
    tagColor: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10',
    dotColor: 'bg-cyan-400',
  },
  'pulse-protocol': {
    id: 'pulse-protocol',
    term: 'Zen Pulse Protocol',
    tag: 'CIVIC SOCIAL FEED',
    icon: Sparkles,
    definition: 'A clean chronological social mesh where dispatches, resolutions, and floor audio are surfaced purely on merit, timestamps, and verifiable citations without algorithmic manipulation.',
    platformRelation: 'Explore the live civic wire with redline diff audits, roll-call voting, and sovereign floor speeches.',
    protocolBadge: 'ZEN.PULSE // PROTOCOL v6',
    ctaText: 'Launch Zen Pulse',
    ctaHref: '/pulse',
    accentColor: 'from-purple-400/20 via-purple-500/10 to-transparent text-purple-300 border-purple-500/30',
    tagColor: 'text-purple-300 border-purple-500/30 bg-purple-500/10',
    dotColor: 'bg-purple-400',
  },
  'zen-chat': {
    id: 'zen-chat',
    term: 'ZenChat Sovereign Mesh',
    tag: 'ENCRYPTED COMMUNICATOR',
    icon: Shield,
    definition: 'A hyper-fast end-to-end encrypted messaging suite supporting ephemeral Thought Bubbles (Zen Notes), 1-view Instants, Glimpse snap scores, broadcast channels, and Discord-style civic chambers.',
    platformRelation: 'Empowers student organizers and parliamentary delegations to coordinate private discussions, committee caucuses, and real-time dispatches with zero data harvesting.',
    protocolBadge: 'ZEN.CHAT // ZERO KNOWLEDGE MESH',
    ctaText: 'Open ZenChat Mesh',
    ctaHref: '/chat',
    accentColor: 'from-cyan-400/20 via-blue-500/10 to-transparent text-cyan-300 border-cyan-500/30',
    tagColor: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10',
    dotColor: 'bg-cyan-400',
  },
  'redline-studio': {
    id: 'redline-studio',
    term: 'Redline Treaty & Policy Diff',
    tag: 'PARLIAMENTARY AMENDMENTS',
    icon: Newspaper,
    definition: 'A GitHub-style clause-by-clause version control system for parliamentary treaties and civic whitepapers, allowing delegates to propose, debate, and roll-call vote on line-item redlines.',
    platformRelation: 'Integrated into ZEN.PULSE and ZEN.SOLUTIONS for real-time legislative drafting and treaty ratification.',
    protocolBadge: 'ZEN.DIFF // REDLINE WORKBENCH',
    ctaText: 'Explore Solutions Policy Vault',
    ctaHref: '/solutions',
    accentColor: 'from-amber-400/20 via-rose-500/10 to-transparent text-amber-300 border-amber-500/30',
    tagColor: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
    dotColor: 'bg-amber-400',
  },
  'secular-policy': {
    id: 'secular-policy',
    term: 'Secular & Empirical Reason',
    tag: 'CONSTITUTIONAL NEUTRALITY',
    icon: Shield,
    definition: 'Policy deliberation rooted strictly in verified evidence, scientific consensus, constitutional human rights, and empirical inquiry — eliminating identity polarization.',
    platformRelation: 'Enforced across Zenvitra discussion trees and parliamentary chambers through proof-of-citation peer audits.',
    protocolBadge: 'NEUTRALITY PROTOCOL // SECULAR DISCOURSE',
    ctaText: 'Explore Discussion Trees',
    ctaHref: '/discussions',
    accentColor: 'from-purple-400/20 via-indigo-500/10 to-transparent text-purple-300 border-purple-500/30',
    tagColor: 'text-purple-300 border-purple-500/30 bg-purple-500/10',
    dotColor: 'bg-purple-400',
  },
  'guillotine-clock': {
    id: 'guillotine-clock',
    term: '60s Guillotine Parliamentary Relay',
    tag: 'SPEECH PROTOCOL',
    icon: Calendar,
    definition: 'A strict 60-second time-boxed floor speech standard that eliminates political grandstanding and filibusters, demanding concise argumentation and verified citations.',
    platformRelation: 'Powers live audio dispatches on ZEN.PULSE and moderated speaker lists in ZEN.EVENTS chambers.',
    protocolBadge: 'ZEN.RELAY // 60s GUILLOTINE',
    ctaText: 'Listen to Floor Speeches',
    ctaHref: '/pulse',
    accentColor: 'from-rose-400/20 via-amber-500/10 to-transparent text-rose-300 border-rose-500/30',
    tagColor: 'text-rose-300 border-rose-500/30 bg-rose-500/10',
    dotColor: 'bg-rose-400',
  },
  'civic-passport': {
    id: 'civic-passport',
    term: 'Sovereign Civic Passport',
    tag: 'VERIFIED CREDENTIALS',
    icon: Shield,
    definition: 'An unforgeable digital delegate record cryptographically tracking conference attendance, speeches delivered, treaties co-authored, and research verification scores.',
    platformRelation: 'Universally recognized by participating high school and collegiate Model UNs, academic institutions, and youth assemblies.',
    protocolBadge: 'CIVIC PASSPORT // IMMUTABLE RECORD',
    ctaText: 'View Delegate Passports',
    ctaHref: '/profile',
    accentColor: 'from-cyan-400/20 via-cyan-500/10 to-transparent text-cyan-300 border-cyan-500/30',
    tagColor: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10',
    dotColor: 'bg-cyan-400',
  },
  'flux-reels': {
    id: 'flux-reels',
    term: 'ZEN.FLUX Vertical Media Wire',
    tag: 'CHRONOLOGICAL VIDEO',
    icon: Newspaper,
    definition: 'A high-fidelity 9:16 vertical video wire delivering youth journalism, policy explainers, and speech highlights with zero commercial ad algorithms or attention harvesting.',
    platformRelation: 'Streamed inside ZEN.PULSE with double-tap voting, source verification badges, and creator tipping.',
    protocolBadge: 'ZEN.FLUX // MEDIA WIRE',
    ctaText: 'Watch FLUX Vertical Stream',
    ctaHref: '/pulse',
    accentColor: 'from-amber-400/20 via-orange-500/10 to-transparent text-amber-300 border-amber-500/30',
    tagColor: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
    dotColor: 'bg-amber-400',
  },
  'civic-points': {
    id: 'civic-points',
    term: 'Civic Points & Staking',
    tag: 'MERIT CURRENCY',
    icon: Sparkles,
    definition: 'A non-fiat reputation metric earned through empirical research, peer review, and passing parliamentary treaties. Used to tip creators and sponsor public motions.',
    platformRelation: 'Embedded across the platform to incentivize high-quality research over sensationalist rage-bait.',
    protocolBadge: 'CIVIC LEDGER // MERIT STAKING',
    ctaText: 'Explore Activity & Staking',
    ctaHref: '/your_activity',
    accentColor: 'from-emerald-400/20 via-teal-500/10 to-transparent text-emerald-300 border-emerald-500/30',
    tagColor: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10',
    dotColor: 'bg-emerald-400',
  },
  'open-civic-corridor': {
    id: 'open-civic-corridor',
    term: 'Open Civic Corridors',
    tag: 'GLOBAL DIPLOMACY',
    icon: Heart,
    definition: 'Direct, borderless collaboration channels connecting youth delegations, university researchers, and grassroots organizers across 40+ nations.',
    platformRelation: 'Enables international student delegations to co-author joint global youth treaties and cross-border initiatives.',
    protocolBadge: 'GLOBAL CORRIDOR // DIPLOMATIC MESH',
    ctaText: 'Explore Global Assemblies',
    ctaHref: '/events',
    accentColor: 'from-blue-400/20 via-indigo-500/10 to-transparent text-blue-300 border-blue-500/30',
    tagColor: 'text-blue-300 border-blue-500/30 bg-blue-500/10',
    dotColor: 'bg-blue-400',
  },
  'smart-labs': {
    id: 'smart-labs',
    term: 'Rural Smart Education Labs',
    tag: 'DIRECT IMPACT',
    icon: Heart,
    definition: 'Solar-powered computer laboratories, open-source STEM libraries, and high-speed satellite connectivity installed in underserved government schools.',
    platformRelation: 'Funded autonomously via our 25% constitutional escrow and tracked live on our public grant ledger.',
    protocolBadge: 'ZEN.IMPACT // SMART LAB ENDOWMENT',
    ctaText: 'View Smart Lab Deployments',
    ctaHref: '/donate/govt-schools',
    accentColor: 'from-emerald-400/20 via-emerald-500/10 to-transparent text-emerald-300 border-emerald-500/30',
    tagColor: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10',
    dotColor: 'bg-emerald-400',
  },
  'sovereign-youth-agency': {
    id: 'sovereign-youth-agency',
    term: 'Sovereign Youth Agency',
    tag: 'CONSTITUTIONAL RIGHT',
    icon: Sparkles,
    definition: 'The fundamental principle that young delegates and creators are active architects of the present, entitled to uncensored civic deliberation, treaty drafting, and floor leadership without waiting for institutional permission.',
    platformRelation: 'Enforced across all Zenvitra assembly chambers, open policy drafts, and the sovereign youth matrix.',
    protocolBadge: 'CONSTITUTION // ARTICLE I',
    ctaText: 'Read Constitution Article I',
    ctaHref: '/constitution#article-1',
    accentColor: 'from-amber-400/20 via-rose-500/10 to-transparent text-amber-300 border-amber-500/30',
    tagColor: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
    dotColor: 'bg-amber-400',
  },
  'empirical-truth': {
    id: 'empirical-truth',
    term: 'Empirical Truth & Rigor',
    tag: 'EPISTEMIC STANDARD',
    icon: Shield,
    definition: 'Uncompromising factual verifiability, peer-reviewed citations, and primary source grounding. Discourse evaluated strictly on observable facts and empirical evidence rather than emotional outrage.',
    platformRelation: 'Mandated across all Assembly treaties, press investigations, and fact-bounty challenges.',
    protocolBadge: 'CONSTITUTION // ARTICLE III',
    ctaText: 'Read Constitution Article III',
    ctaHref: '/constitution#article-3',
    accentColor: 'from-cyan-400/20 via-blue-500/10 to-transparent text-cyan-300 border-cyan-500/30',
    tagColor: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10',
    dotColor: 'bg-cyan-400',
  },
  'educational-endowment': {
    id: 'educational-endowment',
    term: '25% Profit Educational Endowment',
    tag: 'IMMUTABLE ESCROW',
    icon: Heart,
    definition: 'A hardcoded constitutional mandate dedicating 25% of net platform profits every 4 months to student study kits, Model UN scholarships, and solar school labs.',
    platformRelation: 'Audited every 4 months with offline handover videos on ZEN.FLUX and public ledger receipts; unalterable by any board decision.',
    protocolBadge: 'CONSTITUTION // ARTICLE II (25% PROFIT)',
    ctaText: 'Read Constitution Article II',
    ctaHref: '/constitution#article-2',
    accentColor: 'from-emerald-400/20 via-emerald-500/10 to-transparent text-emerald-300 border-emerald-500/30',
    tagColor: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10',
    dotColor: 'bg-emerald-400',
  },
  cockroach: {
    id: 'cockroach',
    term: 'The Cockroach Philosophy',
    tag: 'SURVIVAL & RESILIENCE',
    icon: Sparkles,
    definition: 'Tenacious resilience in hostile environments. Refusing to disappear when dismissed or mocked by traditional institutions. Adapting, persisting, and building sovereign infrastructure.',
    platformRelation: 'Enshrined in Article V of the Constitution of Zenvitra as our foundational anti-fragility doctrine.',
    protocolBadge: 'CONSTITUTION // ARTICLE V',
    ctaText: 'Read Constitution Article V',
    ctaHref: '/constitution#article-5',
    accentColor: 'from-orange-400/20 via-amber-500/10 to-transparent text-orange-300 border-orange-500/30',
    tagColor: 'text-orange-300 border-orange-500/30 bg-orange-500/10',
    dotColor: 'bg-orange-400',
  }
};

interface InteractiveWordModalProps {
  termKey: string | null;
  onClose: () => void;
}

export function InteractiveWordModal({ termKey, onClose }: InteractiveWordModalProps) {
  if (!termKey || !GLOSSARY_TERMS[termKey]) return null;

  const data = GLOSSARY_TERMS[termKey];
  const Icon = data.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg rounded-3xl bg-[#08090d]/95 border border-white/20 p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.95)] z-10 text-left space-y-6 overflow-hidden"
        >
          {/* Subtle Ambient Radial Top Glow */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />

          {/* Header Row */}
          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="space-y-1.5">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-widest border ${data.tagColor || 'text-neutral-300 bg-white/5 border-white/10'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${data.dotColor || 'bg-white'} animate-pulse`} />
                {data.tag}
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-2 pt-1">
                <span>{data.term}</span>
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Definition Box */}
          <div className="space-y-2 relative z-10 text-neutral-300 text-sm leading-relaxed font-light font-sans">
            <p className="font-medium text-white/90">
              {data.definition}
            </p>
          </div>

          {/* Platform Relation Highlight Box */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 relative z-10">
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <span className="flex items-center gap-1.5 text-neutral-200">
                <Icon className="w-3.5 h-3.5 text-amber-300" />
                <span>How this relates to Zenvitra</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-semibold">
                {data.protocolBadge}
              </span>
            </div>
            <p className="text-xs text-neutral-300 font-light leading-relaxed font-sans">
              {data.platformRelation}
            </p>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between gap-3 pt-2 relative z-10 font-mono text-xs">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition"
            >
              Close
            </button>

            <Link
              href={data.ctaHref}
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-white text-black font-bold hover:bg-neutral-200 transition flex items-center gap-2 shadow-sm"
            >
              <span>{data.ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
