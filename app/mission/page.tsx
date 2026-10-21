'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Shield,
  ShieldCheck,
  CheckCircle2,
  Globe2,
  Radio,
  Scale,
  FileText,
  BookOpen,
  Users,
  Award,
  Layers,
  Heart,
  Target,
  Compass,
  Cpu,
  Orbit,
  Lock,
  ChevronDown,
  Gavel,
  Zap,
  Building,
  GraduationCap,
  Search
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function MissionPage() {
  // Voice-to-Impact Pathway state
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  // Policy-to-Impact Framework state
  const [activePolicyStep, setActivePolicyStep] = useState(0);

  const pathwayStages = [
    {
      stage: 'VOICE',
      label: '01. Voice',
      tagline: 'Expression Without Boundaries',
      desc: 'Create space for young people to express themselves, question what they are told, share lived experiences, and raise the issues that matter most.',
      accent: '#3b82f6',
      badge: 'EXPRESSION',
      tools: ['ZEN.POST Publishing', 'ZEN.PULSE Feed', 'ZEN.SPACE Workstation'],
      link: '/pulse',
    },
    {
      stage: 'DEBATE',
      label: '02. Debate',
      tagline: 'Constructive Dialectic & Inquiry',
      desc: 'Bring different perspectives into constructive discussion through youth forums, parliamentary simulations, Model UNs, and collaborative dialogue.',
      accent: '#10b981',
      badge: 'DELIBERATION',
      tools: ['ZEN.MUN Chambers', 'ZEN.CALL Encrypted AV', 'ZEN.DISCUSSIONS'],
      link: '/events',
    },
    {
      stage: 'JOURNALISM',
      label: '03. Journalism',
      tagline: 'Responsible Reporting & Verified Truth',
      desc: 'Encourage independent investigation, thoughtful analysis, transparent fact-checking, and engagement with credible primary sources.',
      accent: '#14b8a6',
      badge: 'VERIFIED PRESS',
      tools: ['ZEN.PRESS Wire', 'Investigative Desks', 'Citation Matrix'],
      link: '/press',
    },
    {
      stage: 'IDEAS',
      label: '04. Ideas',
      tagline: 'From Critiques to Solutions',
      desc: 'Develop concrete proposals, draft resolutions, policy papers, creative projects, and initiatives that respond directly to real challenges.',
      accent: '#f59e0b',
      badge: 'SOLUTIONS LAB',
      tools: ['ZEN.DOCS Drafting', 'ZEN.SOLUTIONS Bills', 'Legislative Frameworks'],
      link: '/solutions',
    },
    {
      stage: 'ACTION',
      label: '05. Action',
      tagline: 'Practical Execution & Initiative',
      desc: 'Give young people opportunities to organize, collaborate, experiment, recruit peers, run summits, and put ideas into measurable practice.',
      accent: '#f97316',
      badge: 'ORGANIZING',
      tools: ['ZEN.FORMS Studio', 'ZEN.ADMIN Ops', 'Secretariat OS'],
      link: '/forms',
    },
    {
      stage: 'IDENTITY',
      label: '06. Identity',
      tagline: 'Accredited Merits & Leadership',
      desc: 'Help individuals discover their capabilities, build permanent verifiable dossiers, develop diplomatic leadership, and earn recognized accolades.',
      accent: '#8b5cf6',
      badge: 'VERIFIED MERIT',
      tools: ['ZEN.PASSPORT QR', 'Diplomatic MUN CV', 'ZEN.LEADERBOARD'],
      link: '/passport',
    },
    {
      stage: 'IMPACT',
      label: '07. Impact',
      tagline: 'Real-World Systemic Reform',
      desc: 'Work towards outcomes that extend far beyond individual achievement—channeling resources and research into public institutions and community endowments.',
      accent: '#ec4899',
      badge: 'CIVIC ENDOWMENT',
      tools: ['50% Principle', 'Policy Outreach', 'UN & Parliament Envoys'],
      link: '/impact',
    },
  ];

  const policySteps = [
    {
      num: '01',
      title: 'LISTEN',
      subtitle: 'Understand the Issue',
      desc: 'Create opportunities for young people to share their experiences, identify challenges and raise concerns affecting their communities. Gather perspectives through discussions, surveys, youth forums and consultations, with appropriate consent and privacy protections.',
      icon: Users,
    },
    {
      num: '02',
      title: 'RESEARCH',
      subtitle: 'Establish the Evidence',
      desc: 'Examine the issue using credible research, official statistics, legislation, government reports, judicial decisions and other reliable sources. Distinguish verified facts from opinions, disputed claims and unanswered questions.',
      icon: Search,
    },
    {
      num: '03',
      title: 'DOCUMENT',
      subtitle: 'Turn Concerns into Solutions',
      desc: 'Develop structured documentation: Youth Policy Papers, Research Reports, Draft Bills, Legislative Proposals, Constitutional Reform Submissions, Budget Proposals, and Monitoring Frameworks. Clearly articulate the evidence, people affected, and practical execution path.',
      icon: FileText,
    },
    {
      num: '04',
      title: 'DELIBERATE',
      subtitle: 'Test the Proposals',
      desc: 'Use debates, Model United Nations simulations, expert consultations, interdisciplinary research and youth assemblies to challenge assumptions and improve proposals. A strong proposal must withstand scrutiny, not simply reflect the popularity of an opinion.',
      icon: Gavel,
    },
    {
      num: '05',
      title: 'REPRESENT',
      subtitle: 'Take Youth Recommendations to Institutions',
      desc: "Present well-researched youth recommendations to public institutions, elected representatives, parliamentary stakeholders, and United Nations-related forums. At the national level in India and internationally, build the credibility needed for serious consideration.",
      icon: Building,
    },
    {
      num: '06',
      title: 'FOLLOW THROUGH',
      subtitle: 'Measure What Happens Next',
      desc: 'Publishing a proposal is not the end. We track submissions, institutional acknowledgements, adoption for committee consideration, and implementation milestones. Distinguishing between published, submitted, considered, and adopted.',
      icon: CheckCircle2,
    },
  ];

  const coreBeliefs = [
    {
      num: '01',
      title: 'Every voice deserves the opportunity to be heard.',
      desc: 'Background, popularity, influence or social standing should not determine whether an idea deserves consideration. We create opportunities for young people to express themselves and share authentic perspectives.',
      color: 'border-blue-500/30 bg-blue-500/5 text-blue-300',
    },
    {
      num: '02',
      title: 'Freedom comes with responsibility.',
      desc: 'We defend the freedom to question, disagree, criticize and challenge ideas. That freedom must coexist with accountability, dignity, privacy and respect. Disagreement should strengthen discussion, not strip people of their humanity.',
      color: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300',
    },
    {
      num: '03',
      title: 'Opinions matter. Evidence matters, too.',
      desc: 'Claims should be examined, sources questioned and evidence considered. Meaningful discussion does not require everyone to agree—it requires everyone to take the truth seriously.',
      color: 'border-amber-500/30 bg-amber-500/5 text-amber-300',
    },
    {
      num: '04',
      title: 'Young people should build, not just participate.',
      desc: 'A platform is only the beginning. Young people should organize events, develop projects, produce media, research problems, and take ownership of meaningful responsibilities.',
      color: 'border-purple-500/30 bg-purple-500/5 text-purple-300',
    },
    {
      num: '05',
      title: 'Impact must extend beyond the screen.',
      desc: 'Awareness is valuable, but it is not the finish line. We connect ideas with initiatives, discussions with practical recommendations, and communities with real-world civic impact.',
      color: 'border-rose-500/30 bg-rose-500/5 text-rose-300',
    },
  ];

  const whatWeAreBuilding = [
    {
      title: 'A space for expression.',
      desc: 'A place to publish ideas, raise critical questions, write long-form analyses, and share authentic perspectives without algorithmic outrage distortion.',
      apps: 'ZEN.POST / ZEN.FLUX / ZEN.SPACE',
      icon: Radio,
      accent: '#3b82f6',
    },
    {
      title: 'A space for dialogue.',
      desc: 'Chambers, moderated debates, youth forums, and Model United Nations simulations that train young citizens in informed parliamentary deliberation.',
      apps: 'ZEN.MUN / ZEN.CHAT / ZEN.CALL',
      icon: Gavel,
      accent: '#10b981',
    },
    {
      title: 'A space for creation.',
      desc: 'Collaborative workspaces for drafting legislative bills, draft resolutions, investigative journalism wire reports, and policy briefs.',
      apps: 'ZEN.DOCS / ZEN.SOLUTIONS / ZEN.PRESS',
      icon: BookOpen,
      accent: '#14b8a6',
    },
    {
      title: 'A space for leadership.',
      desc: 'Cryptographic passports, verifiable dais accreditations, committee achievements, and transparent seasonal merit leaderboards.',
      apps: 'ZEN.PASSPORT / ZEN.LEADERBOARD',
      icon: Award,
      accent: '#f59e0b',
    },
    {
      title: 'A space for impact.',
      desc: 'Youth-led community initiatives, institutional policy outreach, and the Fifty Percent Principle social endowment.',
      apps: 'ZEN.PAYMENTS / Civic Escrow',
      icon: Heart,
      accent: '#ec4899',
    },
  ];

  return (
    <div className="min-h-screen bg-[#04060a] text-white flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 font-sans">
      <Navbar />

      <main className="flex-1 w-full flex flex-col items-center">
        {/* ─── 01. THE MANIFESTO (HERO) ─── */}
        <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center text-center px-6 sm:px-12 pt-28 pb-20 overflow-hidden">
          {/* Ambient Lighting & Concentric Circular Geometry */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[700px] sm:h-[900px] bg-gradient-to-tr from-cyan-500/10 via-purple-500/5 to-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

          {/* Concentric Decorative Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] border border-white/5 rounded-full pointer-events-none animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[480px] h-[350px] sm:h-[480px] border border-cyan-500/10 rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto space-y-6 sm:space-y-8">
            {/* Top Brand Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>INTRODUCING ZENVITRA &bull; OUR MISSION</span>
            </div>

            <div className="space-y-3">
              <div
                className="text-4xl sm:text-7xl font-extrabold uppercase tracking-tight text-white leading-[1.05]"
                style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
              >
                BY YOUTH.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 font-serif italic normal-case">
                  For Youth.
                </span>
              </div>
              <p className="text-xl sm:text-3xl font-serif italic font-normal text-neutral-100 tracking-tight max-w-3xl mx-auto leading-snug">
                &ldquo;A generation that deserves to be heard should have the power to do more than speak.&rdquo;
              </p>
            </div>

            <p className="text-sm sm:text-base text-neutral-300 font-sans font-light leading-relaxed max-w-2xl mx-auto">
              The world is shaped by decisions, debates, ideas and institutions. Yet too often, young people are expected
              to wait for their turn — to watch, to listen, and to accept a future they had little opportunity to shape.
              <br />
              <strong className="text-white font-semibold block mt-3">
                We believe that turn should begin now.
              </strong>
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/apps"
                className="px-6 py-3.5 rounded-2xl bg-white text-black font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-neutral-200 transition-all hover:scale-105 shadow-xl"
              >
                <Orbit className="w-4 h-4 text-black" />
                <span>Explore Ecosystem (ZEN.APPS)</span>
              </Link>
              <Link
                href="/register"
                className="px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all hover:border-white/30"
              >
                <span>Join The Movement</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Scroll Indicator */}
            <div className="pt-10 flex flex-col items-center gap-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
              <span>EXPLORE THE MANIFESTO</span>
              <ChevronDown className="w-4 h-4 animate-bounce text-cyan-400" />
            </div>
          </div>
        </section>

        {/* ─── 02. WHY WE EXIST & 5 CORE BELIEFS ─── */}
        <section className="w-full max-w-6xl mx-auto px-6 sm:px-12 py-20 space-y-16 border-t border-white/10">
          <div className="space-y-4 max-w-3xl text-left">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              SECTION 01 &bull; WHY WE EXIST
            </span>
            <h2
              className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight uppercase font-display"
              style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
            >
              Because a voice deserves <span className="font-serif italic font-normal text-cyan-300 text-3xl sm:text-5xl tracking-normal">More Than An Audience.</span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 font-sans leading-relaxed">
              An opinion can start a conversation. A conversation can challenge an assumption. An idea can inspire a
              solution. But for meaningful change to happen, voices need opportunities, communities need collaboration,
              and ideas need a path towards action.
            </p>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Too many conversations remain confined to small circles. Too many important issues are discussed without
              sufficient evidence. Too many young people have the willingness to contribute but lack the space, resources
              or connections to begin. ZENVITRA aims to bridge that gap.
            </p>
          </div>

          {/* 5 Core Beliefs Grid */}
          <div className="space-y-4 text-left">
            <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
              THE 5 PILLARS OF OUR FAITH:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coreBeliefs.map((b) => (
                <div
                  key={b.num}
                  className={`p-6 rounded-3xl border transition-all duration-200 flex flex-col justify-between space-y-3 shadow-lg ${b.color}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-white/70">
                      PILLAR {b.num}
                    </span>
                    <Sparkles className="w-4 h-4 opacity-75" />
                  </div>
                  <h3 className="font-serif font-bold text-xl text-white leading-snug">
                    {b.title}
                  </h3>
                  <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 03. THE VOICE-TO-IMPACT JOURNEY (INTERACTIVE PATHWAY) ─── */}
        <section className="w-full max-w-6xl mx-auto px-6 sm:px-12 py-20 space-y-12 border-t border-white/10">
          <div className="space-y-3 text-left">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              SECTION 02 &bull; OUR APPROACH
            </span>
            <h2
              className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight uppercase font-display"
              style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
            >
              FROM VOICE <span className="font-serif italic font-light text-emerald-300 text-3xl sm:text-5xl tracking-normal">To Impact.</span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
              We envision a connected journey through which young people turn raw curiosity into lasting contribution.
              Click each stage to inspect its ecosystem engine:
            </p>
          </div>

          {/* Interactive Pathway Progress Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {pathwayStages.map((st, idx) => {
              const isSelected = activeStageIndex === idx;
              return (
                <button
                  key={st.stage}
                  type="button"
                  onClick={() => setActiveStageIndex(idx)}
                  className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-white/15 border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-[1.02]'
                      : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                  style={{
                    borderColor: isSelected ? st.accent : undefined,
                  }}
                >
                  <span className="text-[10px] font-mono text-neutral-500 font-bold">
                    0{idx + 1}
                  </span>
                  <span className="font-display font-extrabold text-sm sm:text-base text-white uppercase mt-1">
                    {st.stage}
                  </span>
                  <div
                    className="w-full h-1 rounded-full mt-2 transition-all"
                    style={{
                      backgroundColor: isSelected ? st.accent : 'rgba(255,255,255,0.08)',
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* Active Stage Detailed Card */}
          <div
            className="p-6 sm:p-10 rounded-3xl bg-[#080b12] border transition-all relative overflow-hidden text-left shadow-2xl"
            style={{ borderColor: `${pathwayStages[activeStageIndex].accent}40` }}
          >
            <div
              className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-[120px] pointer-events-none"
              style={{ backgroundColor: `${pathwayStages[activeStageIndex].accent}15` }}
            />

            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border"
                    style={{
                      backgroundColor: `${pathwayStages[activeStageIndex].accent}15`,
                      borderColor: `${pathwayStages[activeStageIndex].accent}40`,
                      color: pathwayStages[activeStageIndex].accent,
                    }}
                  >
                    <span>STAGE {activeStageIndex + 1} OF 7 &bull; {pathwayStages[activeStageIndex].badge}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                    {pathwayStages[activeStageIndex].label} — {pathwayStages[activeStageIndex].tagline}
                  </h3>
                </div>

                <Link
                  href={pathwayStages[activeStageIndex].link}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono font-bold flex items-center gap-1.5 text-white transition cursor-pointer"
                >
                  <span>Launch Engine</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="text-sm sm:text-base text-neutral-200 font-sans leading-relaxed max-w-4xl">
                {pathwayStages[activeStageIndex].desc}
              </p>

              <div className="pt-2 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                  CONNECTED PLATFORM CAPABILITIES:
                </span>
                <div className="flex flex-wrap gap-2">
                  {pathwayStages[activeStageIndex].tools.map((tool, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-200 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                      <span>{tool}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 04. WHAT WE ARE BUILDING ─── */}
        <section className="w-full max-w-6xl mx-auto px-6 sm:px-12 py-20 space-y-12 border-t border-white/10">
          <div className="space-y-3 text-left">
            <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              SECTION 03 &bull; WHAT WE ARE BUILDING
            </span>
            <h2
              className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight uppercase font-display"
              style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
            >
              One Connected <span className="font-serif italic font-normal text-purple-300">Ecosystem.</span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 max-w-3xl leading-relaxed">
              ZENVITRA brings together different ways for young people to engage with the world—replacing fragmented,
              isolated experiences with one sovereign digital architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            {whatWeAreBuilding.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-[#080b12]/90 border border-white/10 hover:border-white/25 transition-all space-y-4 shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center border"
                      style={{
                        backgroundColor: `${item.accent}15`,
                        borderColor: `${item.accent}30`,
                        color: item.accent,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-extrabold text-xl text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-white/10 text-[10px] font-mono text-cyan-300 font-bold">
                    {item.apps}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── 05. POLICY CHANGE & YOUTH COMES FIRST ─── */}
        <section className="w-full max-w-6xl mx-auto px-6 sm:px-12 py-20 space-y-16 border-t border-white/10">
          <div className="space-y-4 max-w-3xl text-left">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-400" />
              SECTION 04 &bull; FROM YOUTH VOICES TO POLICY CHANGE
            </span>
            <div
              className="text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-white leading-none font-display"
              style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
            >
              YOUTH COMES{' '}
              <span className="font-serif italic font-light text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300 text-4xl sm:text-6xl tracking-normal">
                First.
              </span>
            </div>
            <p className="text-base sm:text-xl text-neutral-200 font-serif italic leading-relaxed">
              &ldquo;We do not want young people to simply discuss the problems of today. We want to help develop the solutions that shape tomorrow.&rdquo;
            </p>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
              Every generation inherits challenges it did not create—education, employment, mental well-being, digital
              safety, climate change, and civic access. ZENVITRA aims to turn youth concerns into researched, documented
              solutions presented to institutions like the Parliament of India and United Nations forums.
            </p>
          </div>

          {/* 6-Stage Policy-to-Impact Framework */}
          <div className="space-y-4 text-left">
            <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
              THE 6-STAGE POLICY-TO-IMPACT FRAMEWORK:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {policySteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.num}
                    className="p-6 rounded-3xl bg-[#080b12]/90 border border-white/10 hover:border-cyan-500/35 transition-all space-y-3 shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        STEP {step.num}
                      </span>
                      <Icon className="w-4 h-4 text-neutral-400" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-white">
                        {step.title}
                      </h3>
                      <p className="text-[11px] font-mono text-neutral-400 font-semibold">
                        {step.subtitle}
                      </p>
                    </div>
                    <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── 06. LONG TERM AMBITION: YOUTH POLICY & SOLUTIONS MOVEMENT ─── */}
        <section className="w-full max-w-6xl mx-auto px-6 sm:px-12 py-20 space-y-12 border-t border-white/10">
          <div className="space-y-3 text-left">
            <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              SECTION 05 &bull; OUR LONG-TERM AMBITION
            </span>
            <h2
              className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight uppercase font-display"
              style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
            >
              A Youth Policy &amp; <span className="font-serif italic font-normal text-amber-300 text-3xl sm:text-5xl tracking-normal">Solutions Movement.</span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 max-w-3xl leading-relaxed">
              We envision ZENVITRA growing into a dedicated body of research, legal drafting, and institutional outreach
              advancing youth perspectives grounded in evidence and public interest:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            {[
              {
                title: 'The Youth Policy Repository',
                desc: 'A structured, accessible archive of published youth policy briefs, research papers, and socioeconomic evaluations.',
              },
              {
                title: 'The Legislative Solutions Lab',
                desc: 'A collaborative legal space developing and evaluating draft parliamentary bills, amendments, and statute reforms.',
              },
              {
                title: 'The Youth Priorities Report',
                desc: 'A recurring national and international publication documenting issues identified as urgent through transparent research.',
              },
              {
                title: 'Public Institutions Outreach',
                desc: 'Long-term submission of documented recommendations to parliamentary stakeholders, ministers, and civil society.',
              },
              {
                title: 'The Policy Progress Tracker',
                desc: 'A transparent public record distinguishing between published, submitted, considered, and adopted policy stages.',
              },
              {
                title: 'International Youth Dialogue',
                desc: 'Connecting youth research and simulation resolutions directly into applicable United Nations consultative forums.',
              },
            ].map((amb, i) => (
              <div
                key={i}
                className="p-5 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-amber-500/30 transition-all space-y-2 shadow-lg"
              >
                <div className="text-[10px] font-mono text-amber-400 font-bold">
                  INITIATIVE 0{i + 1}
                </div>
                <h3 className="font-display font-bold text-base text-white">
                  {amb.title}
                </h3>
                <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                  {amb.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 07. FIFTY PERCENT PRINCIPLE & STANDARDS ─── */}
        <section className="w-full max-w-6xl mx-auto px-6 sm:px-12 py-20 space-y-12 border-t border-white/10">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-emerald-950/20 via-[#07090f] to-cyan-950/20 border border-emerald-500/30 text-left space-y-6 shadow-2xl relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 text-emerald-400" />
              <span>THE FIFTY PERCENT PRINCIPLE</span>
            </div>

            <div className="space-y-2 max-w-3xl">
              <h3
                className="text-2xl sm:text-4xl font-extrabold text-white uppercase font-display"
                style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
              >
                SUCCESS MEANS <span className="font-serif italic font-normal text-emerald-300 text-2xl sm:text-4xl tracking-normal">More Than Growth.</span>
              </h3>
              <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-sans">
                Through our social-impact mandate, we commit to directing <strong>50% of eligible event proceeds</strong> towards
                verified charitable student scholarships, educational kits, and grassroots school initiatives—subject to
                clearly defined eligibility, transparent costs, and public accounting.
              </p>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Impact is not a slogan. It is a responsibility pursued through unedited handover videos on ZEN.FLUX and public receipts.
              </p>
            </div>

            {/* The 7 Standards We Hold Ourselves To */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                THE 7 STANDARDS WE HOLD OURSELVES TO:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs font-mono text-center">
                {[
                  'Integrity',
                  'Independence',
                  'Accountability',
                  'Dignity',
                  'Safety & Privacy',
                  'Transparency',
                  'Action',
                ].map((std, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-emerald-200 font-bold"
                  >
                    {std}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── 08. WHO WE ARE HERE FOR ─── */}
        <section className="w-full max-w-5xl mx-auto px-6 sm:px-12 py-16 text-left space-y-6 border-t border-white/10">
          <div className="space-y-2">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
              WHO WE ARE HERE FOR
            </span>
            <h2
              className="text-2xl sm:text-4xl font-extrabold text-white uppercase font-display"
              style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
            >
              For Those Who Want to <span className="font-serif italic font-normal text-cyan-200 text-2xl sm:text-4xl tracking-normal">Do More With Their Curiosity.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-neutral-300">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>For the student who questions an accepted answer.</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>For the delegate who wants debate to lead somewhere.</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>For the writer who believes a story deserves responsible reporting.</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>For the creator who wants to build something original.</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>For the organizer who wants to bring people together.</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>For the researcher who wants evidence to matter.</span>
            </div>
          </div>

          <p className="text-sm text-neutral-300 font-sans leading-relaxed pt-2">
            You do not need to have everything figured out. You do not need to be the loudest person in the room. You do
            not need to agree with everyone around you. You need the willingness to participate, the courage to question,
            and the responsibility to contribute constructively.
          </p>
        </section>

        {/* ─── 09. VISION & FINAL CALL TO ACTION ─── */}
        <section className="w-full max-w-6xl mx-auto px-6 sm:px-12 py-24 border-t border-white/10 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="text-xs font-mono text-cyan-400 uppercase font-bold tracking-widest">
              OUR DEFINITIVE VISION
            </span>
            <h2
              className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight font-display"
              style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
            >
              The future is not something we wait for. <span className="font-serif italic font-normal text-cyan-200 tracking-normal">It Is Something We Participate In Building.</span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 font-sans leading-relaxed max-w-2xl mx-auto">
              ZENVITRA is an invitation to question more deeply, listen more carefully, create more boldly and contribute
              more meaningfully. Not simply to be heard. But to learn, to build, to take responsibility and to make our
              participation count.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/apps"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400 hover:opacity-95 text-black font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_30px_rgba(6,182,212,0.4)] transition hover:scale-105"
              >
                <Orbit className="w-4 h-4 text-black" />
                <span>Explore ZEN.APPS Ecosystem</span>
              </Link>
              <Link
                href="/events"
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition"
              >
                <span>Explore Summits &amp; MUN</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/constitution"
                className="px-6 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-300 font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition"
              >
                <Scale className="w-4 h-4 text-neutral-400" />
                <span>Constitutional Ledger</span>
              </Link>
            </div>

            <div className="pt-10 text-[11px] font-mono text-neutral-500 space-y-1">
              <div>ZENVITRA &bull; BY YOUTH. FOR YOUTH. &bull; YOUTH COMES FIRST.</div>
              <div>Voices matter. Sources matter. Conversations lead to action.</div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}