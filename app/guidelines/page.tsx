'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Scale,
  FileText,
  Search,
  Printer,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Globe2,
  Lock,
  ExternalLink,
  Crown,
  Share2,
  Sparkles,
  Award
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useReaderTheme } from '@/hooks/useReaderTheme';
import { ReaderThemeToggle } from '@/components/ui/ReaderThemeToggle';

interface GuidelinePart {
  id: string;
  partNumber: string;
  title: string;
  sections: {
    number: string;
    heading: string;
    subsections?: { title: string; content: string[] }[];
    paragraphs: string[];
    callout?: string;
  }[];
}

const COMMUNITY_GUIDELINES: GuidelinePart[] = [
  {
    id: 'part-1',
    partNumber: 'PART I',
    title: 'THE ZENVITRA CONTENT PRINCIPLE',
    sections: [
      {
        number: '1',
        heading: 'FREEDOM OF EXPRESSION',
        paragraphs: [
          'ZENVITRA supports lawful freedom of expression. Users may express opinions, political viewpoints, criticism, analysis, satire, commentary, educational perspectives, creative ideas, journalistic work, professional opinions, debate positions, and other lawful forms of expression.',
          'ZENVITRA does not require all users to agree with one another. Disagreement, criticism, debate, and unpopular opinions are not automatically violations of these Guidelines.',
          'A user may strongly disagree with another person\'s politics, ideas, arguments, articles, professional opinions, social positions, or public statements, provided that the user\'s conduct remains within applicable law and these Guidelines.'
        ]
      },
      {
        number: '2',
        heading: 'RESPONSIBILITY FOR YOUR OWN CONTENT',
        paragraphs: [
          '2.1 The Fundamental Rule: Every user is responsible for the Content that they create, upload, publish, submit, distribute, transmit, or otherwise make available through ZENVITRA. This includes Content published through ZENVITRA International Press, personal blogs, professional accounts, ZEN.PULSE, ZEN.FLUX, ZEN.CHAT, comments, documents, publications, event pages, organization pages, MUN systems, legislative simulations, and any other publishing or communication feature.',
          '2.2 Author Responsibility: The person who creates or publishes Content represents that they are responsible for the substance of that Content. Where legally applicable, responsibility may include the consequences arising from false statements, unlawful statements, infringement, unauthorized publication, violations of privacy, intellectual-property violations, fraudulent representations, unlawful threats, prohibited harassment, or other unlawful conduct contained within the Content.',
          '2.3 ZENVITRA Is Not Automatically the Author: The fact that Content appears on ZENVITRA does not automatically mean that ZENVITRA created, wrote, endorsed, verified, approved, or agrees with that Content. Unless ZENVITRA expressly identifies Content as official ZENVITRA Content, user-generated Content represents the views and responsibility of its author, publisher, or responsible account holder.'
        ],
        callout: 'The Golden Rule of ZENVITRA: YOU OWN YOUR WORDS. If you write it, publish it, upload it, submit it, or communicate it through your account, you remain responsible for your own Content and conduct, subject to applicable law.'
      }
    ]
  },
  {
    id: 'part-2',
    partNumber: 'PART II',
    title: 'WRITER, AUTHOR & PUBLISHER LIABILITY',
    sections: [
      {
        number: '3',
        heading: 'AUTHOR RESPONSIBILITY FOR PUBLISHED MATERIAL',
        paragraphs: [
          'This section applies particularly to writers, journalists, bloggers, contributors, professional publishers, independent authors, organization publishers, and users publishing through ZENVITRA International Press or other publishing features.',
          '3.1 Responsibility for Accuracy: Authors are responsible for making reasonable efforts to ensure that factual claims presented as facts are accurate. An author should not knowingly publish information that they know to be materially false.',
          '3.2 Responsibility for Sources: Where an article relies upon external information, the author is responsible for the manner in which they represent sources, quotations, documents, interviews, research, statistics, allegations, and factual claims.',
          '3.3 Responsibility for Allegations: Authors must exercise particular care when publishing allegations about identifiable individuals or organizations. Publishing an allegation without adequate basis may create serious legal consequences. Where appropriate, authors should distinguish between verified facts, allegations, opinions, analysis, commentary, speculation, and satire.',
          '3.4 Personal Legal Responsibility: To the maximum extent permitted by applicable law, the author, publisher, contributor, or account holder responsible for publishing Content remains responsible for that Content and for their own unlawful acts or omissions. Where a claim, complaint, investigation, or legal proceeding arises directly from Content created or published by a user, the relevant author or publisher may be responsible for the consequences of their own Content in accordance with applicable law.'
        ]
      },
      {
        number: '4',
        heading: 'IMPORTANT PLATFORM LIABILITY LIMITATION',
        paragraphs: [
          '4.1 Platform Role: Where legally applicable, ZENVITRA may operate as a technology platform, hosting service, intermediary, publishing infrastructure provider, or service provider. The availability of a publishing tool does not automatically make ZENVITRA the author of every item published through that tool.',
          '4.2 No Automatic Transfer of Responsibility: A user cannot transfer responsibility for their own Content to ZENVITRA merely because ZENVITRA hosted the Content, provided publishing tools, provided an account, the Content appeared on a ZENVITRA domain, another user could access the Content through ZENVITRA, or ZENVITRA technically transmitted or stored the Content.',
          '4.3 Subject to Applicable Law: Nothing in these Guidelines is intended to eliminate, exclude, or override responsibilities that applicable law may impose upon ZENVITRA. ZENVITRA\'s legal rights, responsibilities, protections, and obligations will be determined according to applicable law and the specific circumstances involved.'
        ]
      }
    ]
  },
  {
    id: 'part-3',
    partNumber: 'PART III',
    title: 'ZENVITRA INTERNATIONAL PRESS',
    sections: [
      {
        number: '5',
        heading: 'INDEPENDENT WRITERS AND CONTRIBUTORS',
        paragraphs: [
          'ZENVITRA International Press may permit independent writers and contributors to publish material. Unless expressly stated otherwise: An independent contributor is not automatically an employee, agent, spokesperson, or official representative of ZENVITRA merely because they publish through ZENVITRA International Press.',
          'Their work may represent their own analysis, their own reporting, their own opinions, their own interpretation, or their own editorial position.'
        ]
      },
      {
        number: '6',
        heading: 'AUTHORSHIP IDENTIFICATION',
        paragraphs: [
          'Where technically possible, published material may display information identifying the author, contributor, publication account, organization, publication date, or editorial category. This helps readers understand the origin of published Content.'
        ]
      },
      {
        number: '7',
        heading: 'EDITORIAL STATUS',
        paragraphs: [
          'ZENVITRA may establish multiple publication categories:',
          '• INDEPENDENT: Content published by an individual contributor.',
          '• CONTRIBUTOR: Content submitted by an approved contributor.',
          '• VERIFIED AUTHOR: Content published by an author whose relevant identity or credentials have undergone a verification process.',
          '• EDITORIAL: Content produced or formally commissioned by an authorized editorial team.',
          '• OFFICIAL ZENVITRA: Content officially issued by ZENVITRA.',
          'The category of Content may affect how readers understand its source, but all categories remain subject to applicable laws and platform rules.'
        ]
      },
      {
        number: '8',
        heading: 'NO IMPLIED ENDORSEMENT',
        paragraphs: [
          'The publication of an article through ZENVITRA International Press does not automatically mean that ZENVITRA agrees with the article, endorses the author\'s opinions, guarantees every factual statement, independently verified every claim, or adopts the Content as an official position. Official ZENVITRA statements should be clearly identified.'
        ]
      }
    ]
  },
  {
    id: 'part-4',
    partNumber: 'PART IV',
    title: 'PROHIBITED CONTENT',
    sections: [
      {
        number: '9',
        heading: 'ILLEGAL CONTENT',
        paragraphs: [
          'Users may not use ZENVITRA to create, distribute, promote, facilitate, or organize Content that is unlawful under applicable law. Where ZENVITRA receives a legally valid complaint, order, request, or notice concerning unlawful Content, it may take action consistent with applicable law.'
        ]
      },
      {
        number: '10',
        heading: 'FRAUD AND DECEPTION',
        paragraphs: [
          'Users must not use ZENVITRA to impersonate another person, conduct fraud, deceive users for unlawful financial gain, create fraudulent events, sell nonexistent services, misrepresent credentials, create fake organizations, manipulate payment systems, forge certificates, or otherwise intentionally deceive others through prohibited means.'
        ]
      },
      {
        number: '11',
        heading: 'IMPERSONATION',
        paragraphs: [
          'A user may not falsely represent themselves as another individual, an organization, a government authority, ZENVITRA, a ZENVITRA employee, an event organizer, a journalist, a public figure, or another entity. Parody, satire, or clearly identifiable fictional representation may be evaluated differently where it is reasonably clear that the account is not genuinely impersonating the target.'
        ]
      }
    ]
  },
  {
    id: 'part-5',
    partNumber: 'PART V',
    title: 'HARASSMENT AND ABUSE',
    sections: [
      {
        number: '12',
        heading: 'HARASSMENT',
        paragraphs: [
          'Users may debate and criticize ideas. However, users may not engage in prohibited harassment directed at another person. Repeated conduct intended primarily to intimidate, seriously harass, or abuse another person may violate these Guidelines.',
          'Context matters: A single disagreement is not necessarily harassment. A strong political argument is not necessarily harassment. Criticism of public conduct is not automatically harassment.',
          'ZENVITRA may consider factors including: repetition, targeting, context, severity, intent, power imbalance, threats, and the likelihood of serious harm.'
        ]
      },
      {
        number: '13',
        heading: 'THREATS',
        paragraphs: [
          'Users may not use ZENVITRA to make unlawful or credible threats of serious harm against another person. Threats may be reviewed based upon specificity, context, credibility, target, surrounding conduct, and applicable law.'
        ]
      }
    ]
  },
  {
    id: 'part-6',
    partNumber: 'PART VI',
    title: 'PRIVACY',
    sections: [
      {
        number: '14',
        heading: 'UNAUTHORIZED DISCLOSURE OF PERSONAL INFORMATION',
        paragraphs: [
          'Users may not improperly publish another person\'s private or sensitive personal information without authorization where doing so violates applicable law or creates a serious privacy or safety risk. This may include private contact information, financial information, authentication credentials, private documents, confidential communications, or other protected personal information.'
        ]
      }
    ]
  },
  {
    id: 'part-7',
    partNumber: 'PART VII',
    title: 'INTELLECTUAL PROPERTY',
    sections: [
      {
        number: '15',
        heading: 'COPYRIGHT',
        paragraphs: [
          'Users must respect intellectual-property rights. You should not upload or publish Content that you do not have the legal right to use, including articles, photographs, videos, music, books, documents, software, graphics, and other protected works.'
        ]
      },
      {
        number: '16',
        heading: 'AUTHOR WARRANTIES',
        paragraphs: [
          'By publishing Content, you represent that: (1) you have the necessary rights to publish it; (2) your publication does not knowingly violate another person\'s rights; (3) you have authority to grant any permissions necessary for ZENVITRA to technically host and display the Content; and (4) your Content complies with applicable law and ZENVITRA policies.'
        ]
      }
    ]
  },
  {
    id: 'part-8',
    partNumber: 'PART VIII',
    title: 'DEFAMATION, FALSE STATEMENTS & ALLEGATIONS',
    sections: [
      {
        number: '17',
        heading: 'SERIOUS ALLEGATIONS',
        paragraphs: [
          'Users should not knowingly publish materially false statements presented as factual claims about identifiable individuals or organizations. Authors are encouraged to distinguish clearly between facts, allegations, opinions, analysis, commentary, and satire.'
        ]
      },
      {
        number: '18',
        heading: 'AUTHOR RESPONSIBILITY',
        paragraphs: [
          'Where an author independently creates and publishes Content containing allegedly unlawful statements, the author remains responsible for their own statements and conduct to the maximum extent permitted by applicable law.',
          'ZENVITRA does not become the author of a user\'s statement merely because the statement is hosted or technically displayed through the platform.'
        ]
      }
    ]
  },
  {
    id: 'part-9',
    partNumber: 'PART IX',
    title: 'ZEN.PULSE & ZEN.FLUX',
    sections: [
      {
        number: '19',
        heading: 'USER-GENERATED CONTENT',
        paragraphs: [
          'Users are responsible for Content they publish through ZEN.PULSE and ZEN.FLUX. ZENVITRA may provide the infrastructure for publication without becoming the creator or speaker of every piece of user-generated Content.'
        ]
      },
      {
        number: '20',
        heading: 'REPORTING',
        paragraphs: [
          'Users may report Content that they believe violates these Guidelines, applicable law, intellectual-property rights, privacy rights, or other applicable policies. Reports may be reviewed through automated systems, human review, or a combination of both.'
        ]
      }
    ]
  },
  {
    id: 'part-10',
    partNumber: 'PART X',
    title: 'ZEN.CHAT',
    sections: [
      {
        number: '21',
        heading: 'PRIVATE COMMUNICATIONS',
        paragraphs: [
          'ZEN.CHAT is designed for communication between users. Users remain responsible for their own messages and conduct. Private communication does not provide permission to use the Service for unlawful activity, fraud, serious threats, prohibited exploitation, malicious abuse, or other prohibited conduct.'
        ]
      }
    ]
  },
  {
    id: 'part-11',
    partNumber: 'PART XI',
    title: 'ZEN.MUN & EVENTS',
    sections: [
      {
        number: '22',
        heading: 'SIMULATION AND EDUCATIONAL CONTEXT',
        paragraphs: [
          'ZEN.MUN may contain debates involving governments, political parties, international conflicts, historical events, controversial policies, legislation, and other sensitive subjects.',
          'Statements made within a clearly identified educational simulation should be understood in their relevant simulation context. A delegate representing a portfolio in a Model United Nations conference is not automatically expressing their personal beliefs.'
        ]
      },
      {
        number: '23',
        heading: 'RESPONSIBILITY FOR ORGANIZERS',
        paragraphs: [
          'Event organizers are responsible for the events they create, information they publish, event rules, event communications, participant management, organizer decisions, and compliance with applicable legal obligations.',
          'ZENVITRA may provide technology and infrastructure without becoming the organizer of every independently created event.'
        ]
      }
    ]
  },
  {
    id: 'part-12',
    partNumber: 'PART XII',
    title: 'ENFORCEMENT',
    sections: [
      {
        number: '24',
        heading: 'ACTIONS ZENVITRA MAY TAKE',
        paragraphs: [
          'Depending on the circumstances, ZENVITRA may issue a warning, limit Content visibility, remove Content, require corrections, apply labels, restrict features, suspend publishing, suspend an account, terminate an account, restrict an organization, remove an event, preserve information where legally necessary, or take other reasonable actions consistent with applicable law.'
        ]
      },
      {
        number: '25',
        heading: 'SEVERITY AND CONTEXT',
        paragraphs: [
          'ZENVITRA does not necessarily apply identical consequences to every violation. Factors may include severity, repetition, intent, harm, context, previous violations, attempts to evade enforcement, and applicable law.'
        ]
      }
    ]
  },
  {
    id: 'part-13',
    partNumber: 'PART XIII',
    title: 'CONTENT REMOVAL',
    sections: [
      {
        number: '26',
        heading: 'REMOVAL DOES NOT AUTOMATICALLY DECIDE LEGAL LIABILITY',
        paragraphs: [
          'The removal of Content from ZENVITRA does not necessarily mean that a court has determined the Content to be unlawful, that ZENVITRA agrees with a complainant, that the author has admitted wrongdoing, or that every factual allegation concerning the Content has been legally established.',
          'Removal may occur because of policy violations, legal requirements, safety concerns, rights-holder complaints, or other legitimate reasons.'
        ]
      }
    ]
  },
  {
    id: 'part-14',
    partNumber: 'PART XIV',
    title: 'INDEMNITY AND USER RESPONSIBILITY',
    sections: [
      {
        number: '27',
        heading: 'USER RESPONSIBILITY FOR THEIR OWN VIOLATIONS',
        paragraphs: [
          'To the extent permitted by applicable law, a user who violates applicable law, these Guidelines, or another person\'s legally protected rights may be responsible for the consequences of their own conduct.',
          'Where permitted by applicable law and the applicable Terms of Service, a user may also be required to indemnify ZENVITRA against certain claims, losses, liabilities, or expenses arising directly from that user\'s unlawful Content or misuse of the Services. This provision is subject to applicable consumer-protection laws and other mandatory legal requirements.'
        ]
      }
    ]
  },
  {
    id: 'part-15',
    partNumber: 'PART XV',
    title: 'APPEALS',
    sections: [
      {
        number: '28',
        heading: 'RIGHT TO APPEAL',
        paragraphs: [
          'Where appropriate, users may appeal certain enforcement decisions. An appeal may explain why the decision was incorrect, relevant context, new information, mistaken identity, or other relevant circumstances. ZENVITRA may review appeals through appropriate internal processes.'
        ]
      }
    ]
  },
  {
    id: 'part-16',
    partNumber: 'PART XVI',
    title: 'THE ZENVITRA RESPONSIBILITY MODEL',
    sections: [
      {
        number: '29',
        heading: 'WHO IS RESPONSIBLE?',
        paragraphs: [
          '• A USER WRITES AN ARTICLE → Primary responsibility for the author\'s own words: THE AUTHOR',
          '• AN ORGANIZATION CREATES AN EVENT → Primary responsibility for operating that independent event: THE ORGANIZER',
          '• A DELEGATE MAKES A STATEMENT IN A SIMULATION → Responsibility is evaluated within the educational/simulation context: THE PARTICIPANT AND EVENT RULES',
          '• ZENVITRA PROVIDES THE TECHNOLOGY → Technical platform responsibility and applicable legal obligations: ZENVITRA, as determined by applicable law',
          '• A COURT OR LAW REQUIRES ACTION → ZENVITRA and relevant users must comply with applicable legal requirements'
        ]
      },
      {
        number: '30',
        heading: 'THE GOLDEN RULE OF ZENVITRA',
        paragraphs: [
          'YOU OWN YOUR WORDS. If you write it, publish it, upload it, submit it, or communicate it through your account: you remain responsible for your own Content and conduct, subject to applicable law.',
          'ZENVITRA provides people with the ability to communicate. ZENVITRA does not automatically become the author of every word written by millions of users. At the same time, ZENVITRA will fulfill the responsibilities and obligations that applicable law places upon the platform.'
        ],
        callout: 'FINAL COMMUNITY PRINCIPLE: Freedom of expression does not mean freedom from responsibility. You are free to think, write, debate, criticize, question, publish, create, organize, and express yourself lawfully. But when you use that freedom, you remain accountable for your own actions. ZENVITRA provides the platform. The creator owns their words. The author owns their work. The organizer owns their event. And every person must respect the law and the rights of others.'
      }
    ]
  }
];

export default function CommunityGuidelinesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activePartId, setActivePartId] = useState<string>('part-1');
  const { isLight, toggleTheme } = useReaderTheme();

  const filteredParts = useMemo(() => {
    if (!searchQuery.trim()) return COMMUNITY_GUIDELINES;
    const q = searchQuery.toLowerCase();

    return COMMUNITY_GUIDELINES.map((part) => {
      const matchPartTitle = part.title.toLowerCase().includes(q);
      const matchingSections = part.sections.filter(
        (sec) =>
          sec.heading.toLowerCase().includes(q) ||
          sec.paragraphs.some((p) => p.toLowerCase().includes(q)) ||
          (sec.callout && sec.callout.toLowerCase().includes(q))
      );

      if (matchPartTitle || matchingSections.length > 0) {
        return {
          ...part,
          sections: matchingSections.length > 0 ? matchingSections : part.sections,
        };
      }
      return null;
    }).filter(Boolean) as GuidelinePart[];
  }, [searchQuery]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between font-sans transition-colors duration-200 pt-20 sm:pt-24 ${
      isLight 
        ? 'bg-[#fcfaf7] text-stone-900 selection:bg-amber-200 selection:text-amber-950' 
        : 'bg-[#030405] text-neutral-300 selection:bg-amber-400 selection:text-black'
    }`}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-12 text-left">
        {/* Top Header Banner */}
        <div className={`space-y-4 border-b pb-8 ${isLight ? 'border-stone-200' : 'border-white/10'}`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold inline-flex items-center gap-1.5 uppercase tracking-wider ${
                  isLight
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  FOUNDATIONAL COMMUNITY COVENANT
                </span>
                <span className={`text-xs font-mono ${isLight ? 'text-stone-500' : 'text-neutral-400'}`}>Effective Genesis 2026</span>
              </div>
              <h1 className={`text-3xl sm:text-5xl font-black font-display tracking-tight ${isLight ? 'text-stone-950' : 'text-white'}`}>
                COMMUNITY GUIDELINES &amp; CREATOR RESPONSIBILITY POLICY
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <ReaderThemeToggle isLight={isLight} onToggle={toggleTheme} />

              <button
                type="button"
                onClick={handlePrint}
                className={`px-4 py-2 rounded-xl border font-mono text-xs font-semibold transition flex items-center gap-2 cursor-pointer print:hidden ${
                  isLight
                    ? 'bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-700'
                    : 'bg-white/5 hover:bg-white/10 border-white/15 text-neutral-300 hover:text-white'
                }`}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              <Link
                href="/constitution#article-11"
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-amber-400/20"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Article XI in Constitution</span>
              </Link>
            </div>
          </div>

          <p className={`text-sm max-w-4xl leading-relaxed font-sans ${isLight ? 'text-stone-600' : 'text-neutral-400'}`}>
            Welcome to ZENVITRA. Meaningful expression, debate, journalism, creativity, education, and collaboration require freedom.
            However, freedom within a digital community also requires responsibility. These Guidelines establish the standards governing
            Content and conduct across all ZENVITRA services.
          </p>

          {/* Quick Search & Key Banner */}
          <div className="pt-2 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? 'text-stone-400' : 'text-neutral-500'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clauses (e.g. defamation, simulation, press)..."
                className={`w-full rounded-xl pl-10 pr-4 py-2 text-xs font-mono focus:outline-none transition ${
                  isLight
                    ? 'bg-white border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:border-amber-600'
                    : 'bg-black/60 border border-white/15 text-white placeholder:text-neutral-500 focus:border-amber-400'
                }`}
              />
            </div>

            <div className={`text-xs font-mono flex items-center gap-2 ${isLight ? 'text-stone-600' : 'text-neutral-400'}`}>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>The Golden Rule: <strong className={isLight ? 'text-stone-900' : 'text-white'}>YOU OWN YOUR WORDS.</strong></span>
            </div>
          </div>
        </div>

        {/* Content Body: Sidebar Navigation + Main Document */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Table of Contents (Sticky) */}
          <aside className={`hidden lg:block lg:col-span-4 sticky top-28 space-y-2 border p-4 rounded-3xl max-h-[calc(100vh-9rem)] overflow-y-auto print:hidden ${
            isLight
              ? 'bg-white border-stone-200 shadow-sm'
              : 'bg-[#090b10] border-white/10'
          }`}>
            <div className={`px-3 py-2 border-b text-[10px] font-mono uppercase tracking-widest font-bold ${
              isLight ? 'border-stone-100 text-stone-500' : 'border-white/5 text-neutral-400'
            }`}>
              Table of Contents
            </div>
            <div className="space-y-1 text-xs font-mono">
              {COMMUNITY_GUIDELINES.map((part) => (
                <a
                  key={part.id}
                  href={`#${part.id}`}
                  onClick={() => setActivePartId(part.id)}
                  className={`block px-3 py-2 rounded-xl transition ${
                    activePartId === part.id
                      ? isLight
                        ? 'bg-amber-100/70 text-amber-950 font-bold border border-amber-300'
                        : 'bg-amber-400/15 text-amber-300 font-bold border border-amber-400/30'
                      : isLight
                        ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className={`text-[10px] uppercase ${isLight ? 'text-stone-400' : 'text-neutral-500'}`}>{part.partNumber}</div>
                  <div className="truncate">{part.title}</div>
                </a>
              ))}
            </div>
          </aside>

          {/* Main Document Text */}
          <div className="lg:col-span-8 space-y-10">
            {filteredParts.length === 0 ? (
              <div className={`p-12 text-center rounded-3xl border space-y-3 font-mono ${
                isLight ? 'bg-white border-stone-200 text-stone-600' : 'bg-white/[0.02] border-white/10 text-neutral-400'
              }`}>
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                <h3 className={`font-bold ${isLight ? 'text-stone-900' : 'text-white'}`}>No matching clauses found</h3>
                <p className="text-xs">Try searching for &quot;accuracy&quot;, &quot;harassment&quot;, &quot;simulation&quot;, or &quot;sources&quot;.</p>
              </div>
            ) : (
              filteredParts.map((part) => (
                <section
                  key={part.id}
                  id={part.id}
                  className={`p-6 sm:p-8 rounded-3xl border space-y-6 scroll-mt-28 ${
                    isLight 
                      ? 'bg-white border-stone-200 shadow-sm' 
                      : 'bg-[#08090d] border-white/10'
                  }`}
                >
                  {/* Part Header */}
                  <div className={`border-b pb-4 space-y-1 ${isLight ? 'border-stone-100' : 'border-white/10'}`}>
                    <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">
                      {part.partNumber}
                    </span>
                    <h2 className={`text-xl sm:text-2xl font-bold font-display tracking-tight ${
                      isLight ? 'text-stone-950' : 'text-white'
                    }`}>
                      {part.title}
                    </h2>
                  </div>

                  {/* Sections */}
                  <div className="space-y-6">
                    {part.sections.map((sec) => (
                      <div key={sec.number} className="space-y-3">
                        <h3 className={`text-sm sm:text-base font-bold font-mono flex items-baseline gap-2 ${
                          isLight ? 'text-stone-900' : 'text-white'
                        }`}>
                          <span className="text-amber-500">§ {sec.number}.</span>
                          <span>{sec.heading}</span>
                        </h3>

                        <div className={`space-y-2 text-xs sm:text-sm leading-relaxed font-sans ${
                          isLight ? 'text-stone-700' : 'text-neutral-300'
                        }`}>
                          {sec.paragraphs.map((p, idx) => (
                            <p key={idx}>{p}</p>
                          ))}
                        </div>

                        {sec.callout && (
                          <div className={`p-4 rounded-2xl border text-xs sm:text-sm font-mono leading-relaxed space-y-1 ${
                            isLight
                              ? 'bg-amber-50/90 border-amber-200 text-amber-950 shadow-xs'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                          }`}>
                            <span className="text-[10px] uppercase font-bold text-amber-600 tracking-wider block">
                              Fundamental Covenant
                            </span>
                            <p>{sec.callout}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))
            )}

            {/* Bottom Constitutional Reference Card */}
            <div className={`p-6 sm:p-8 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-6 ${
              isLight
                ? 'bg-amber-50 border-amber-200'
                : 'bg-gradient-to-r from-amber-500/10 via-black to-black border-amber-500/30'
            }`}>
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-mono text-amber-600 font-bold uppercase tracking-wider">
                  CONSTITUTIONAL CODIFICATION
                </span>
                <h4 className={`text-lg font-bold font-display ${isLight ? 'text-stone-950' : 'text-white'}`}>
                  Ratified as Article XI of the Zenvitra Constitution
                </h4>
                <p className={`text-xs max-w-xl ${isLight ? 'text-stone-600' : 'text-neutral-400'}`}>
                  These community standards, content principles, and author responsibility covenants are permanently embedded into the sovereign constitutional charter.
                </p>
              </div>

              <Link
                href="/constitution#article-11"
                className={`px-5 py-3 rounded-2xl font-display font-bold text-xs uppercase tracking-wider transition shrink-0 flex items-center gap-2 ${
                  isLight
                    ? 'bg-stone-900 text-white hover:bg-stone-800'
                    : 'bg-white text-black hover:bg-neutral-200'
                }`}
              >
                <span>Read Article XI</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
