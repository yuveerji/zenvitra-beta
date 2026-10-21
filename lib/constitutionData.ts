export interface ConstitutionalClause {
  sectionNumber: string;
  heading: string;
  operationalTag?: string;
  content: string[];
  callout?: string;
  howToUseProperly?: {
    title: string;
    steps: string[];
  };
}

export interface ArticleSection {
  id: string;
  articleNumber: string;
  title: string;
  badge: string;
  badgeColor: string;
  summary: string;
  sections: ConstitutionalClause[];
}

export const CONSTITUTION_ARTICLES: ArticleSection[] = [
  // ─── ARTICLE I ───
  {
    id: 'article-1',
    articleNumber: 'ARTICLE I',
    title: 'THE SOVEREIGN NODE & ZERO-SURVEILLANCE DATA INVARIANTS',
    badge: 'ZERO SURVEILLANCE',
    badgeColor: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30',
    summary: 'Guarantees sovereign individual rights, absolute immunity from commercial tracking pixels, zero behavioral advertising, and strict cryptographic privacy enclaves.',
    sections: [
      {
        sectionNumber: 'Section 1.01',
        heading: 'Inherent Sovereignty of Thought and Identity',
        operationalTag: 'FUNDAMENTAL RIGHT',
        content: [
          'Every human user, delegate, researcher, student, and creator entering Zenvitra is constitutionally recognized as a Sovereign Node. Human consciousness, private reflection, cognitive energy, and parliamentary debate shall never be treated as inventory or mined for behavioral engagement loops.',
          'Zenvitra guarantees a categorical, permanent prohibition against third-party ad networks, tracking pixels (Meta Pixel, Google Ads, TikTok Pixel, etc.), demographic data reselling, and algorithmic manipulation of discourse.',
          'No commercial entity, corporate sponsor, or government intelligence service shall ever purchase access to private user profiles, delegate reading habits, or caucus discussions.'
        ],
        callout: 'Immutable Invariant: Your intellect is not an inventory item; your time is not a commodity for auction.'
      },
      {
        sectionNumber: 'Section 1.02',
        heading: 'Enclave Access Isolation & Shielded Core Routes',
        operationalTag: 'SECURITY ARCHITECTURE',
        content: [
          'Administrative infrastructure and sovereign system enclaves operate under strict air-gapped cryptographic access controls.',
          'Any visitor or node lacking verified clearance shall be systematically presented with a standard unindexed 404 Not Found error response, ensuring absolute zero interface leakage, stealth isolation, and categorical prevention of privilege escalation.'
        ]
      },
      {
        sectionNumber: 'Section 1.03',
        heading: 'Cryptographic Identity & Zero-Knowledge Verification',
        operationalTag: 'PRIVACY INVARIANT',
        content: [
          'Verification of student status, conference credentials, or delegate passports shall prioritize Zero-Knowledge Proofs (ZKPs) and local browser encryption.',
          'Users are not required to provide government identity documents to read public archives or participate in plenary caucuses. Pseudonymous political commentary and whistleblowing are protected rights, subject always to the creator responsibility, anti-fraud, and anti-harassment standards codified in Article XI.'
        ]
      },
      {
        sectionNumber: 'Section 1.04',
        heading: 'Operational Protocol: How to Exercise Data Sovereignty Properly',
        operationalTag: 'OPERATOR MANUAL',
        content: [
          'Every node has the absolute right to export, purge, or mirror their data at will. Follow these operational standards to ensure sovereign usage:'
        ],
        howToUseProperly: {
          title: 'DELEGATE WORKFLOW FOR PRIVACY MANAGEMENT',
          steps: [
            'Inspect Session Status: Navigate to Settings > Security Vault to view active device fingerprints, local session keys, and persistent authentication tokens.',
            'Local Storage Mirroring: All your drafts, treaties, and private thought drops are mirrored locally. Clear your local storage cache at any time to instantly revoke device keys.',
            'Exporting Your Civic Archives: Use "Export Civic Dossier" to download a full JSON-formatted snapshot of your speeches, passed resolutions, and activity logs.',
            'Shielded Caucus Rooms: When discussing sensitive geopolitical treaties, initiate an Ephemeral Room in ZenChat with auto-destruct timers (1-view Instant or 24-hour TTL).'
          ]
        }
      }
    ]
  },

  // ─── ARTICLE II ───
  {
    id: 'article-2',
    articleNumber: 'ARTICLE II',
    title: 'THE 10% PROFIT CIVIC ENDOWMENT & RADICAL ACCOUNTABILITY PROTOCOL',
    badge: '10% PROFIT ENDOWMENT',
    badgeColor: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
    summary: 'Hardcodes an unalterable 10.0% profit covenant dedicated to student scholarships, educational kits, and rural school labs—executed on a strict 6-month distribution cadence with transparent receipts and offline distribution videos broadcast across ZEN.FLUX and social platforms.',
    sections: [
      {
        sectionNumber: 'Section 2.01',
        heading: 'The Mandatory 10.0% Net Profit Covenant',
        operationalTag: 'CONSTITUTIONAL COVENANT',
        content: [
          'A mandatory, non-negotiable ten percent (10.0%) of all net platform profits generated across the ZENVITRA ecosystem—inclusive of memberships, summit passes, organizer licenses, and merchandise—shall be irreversibly partitioned into the Zenvitra Civic Endowment Vault.',
          'This capital is held in trust exclusively for educational welfare, grassroots school delegate sponsorships, study kits, and school technology infrastructure. This covenant is structurally unalterable by any founder directive, board vote, or corporate restructuring.'
        ],
        callout: 'The 10% Profit Invariant: Exactly 10% of every rupee and dollar of profit earned by ZENVITRA is returned directly to youth education, delegate scholarships, and underprivileged students.'
      },
      {
        sectionNumber: 'Section 2.02',
        heading: 'Semiannual Cadence: Every 6 Months Distribution Mandate',
        operationalTag: 'SEMIANNUAL CYCLE',
        content: [
          'The accounting, procurement, and physical distribution of the 10% profit endowment shall execute without exception every six (6) months across two annual semesters:',
          '• Semester 1 (Jan – Jun): Mid-year profit computation, procurement of supplies, delegate scholarships, computer lab dispatches, and student kit distribution.',
          '• Semester 2 (Jul – Dec): Annual educational grant distribution, winter study materials, rural technology labs, and transparent end-of-year ledger reconciliation.',
          'No endowment funds may be rolled over or deferred beyond its designated 6-month distribution cycle.'
        ],
        callout: 'Strict 6-Month Clock: Every 180 days, 10% of profits must be fully converted into physical supplies, scholarships, or infrastructure and placed directly into students\' hands.'
      },
      {
        sectionNumber: 'Section 2.03',
        heading: 'Radical Accountability: Offline Videos, Public Receipts & ZEN.FLUX Broadcast',
        operationalTag: 'RADICAL TRANSPARENCY',
        content: [
          'To ensure absolute zero-corruption accountability, every 6-month distribution cycle must provide immutable, multi-channel public proof before the next cycle begins:',
          '1. Unedited Offline Distribution Videos: High-definition, on-the-ground video documentation capturing the actual physical distribution, giving away of textbooks, study kits, computer systems, and delegate passes directly to recipients in classrooms and youth centers.',
          '2. Itemized Financial Receipts: Every single vendor invoice, purchase receipt, hardware bill, transport waybill, and recipient school counter-signature is scanned and published publicly on the transparency dashboard.',
          '3. Multichannel Broadcast on ZEN.FLUX & Socials: Full video reports and documentation shall be broadcast prominently on ZEN.FLUX (our short-form video platform) and official social channels (@zenvitra on Instagram, YouTube, and X) ensuring every citizen can audit the delivery.'
        ]
      },
      {
        sectionNumber: 'Section 2.04',
        heading: 'Rural Smart Education Labs & Student Supply Specifications',
        operationalTag: 'INFRASTRUCTURE STANDARD',
        content: [
          'Endowment capital is restricted exclusively to direct student empowerment and verified school infrastructure:',
          '1. Direct Physical Student Supplies: High-grade notebooks, geometry boxes, STEM kits, textbooks, and school uniforms handed directly to students.',
          '2. Delegate & Scholar Grants: 100% covered registrations, accommodation, and travel for students representing underprivileged institutions in national Model UNs and Youth Summits.',
          '3. Solar Workstations & Labs: 3kW–5kW rooftop solar installations and Linux-powered workstations with offline open educational archives.',
          '4. Absolute Anti-Diversion Ban: Exactly zero percent of endowment funds may be diverted to corporate bonuses, administrative salaries, executive travel, or marketing campaigns.'
        ]
      },
      {
        sectionNumber: 'Section 2.05',
        heading: 'Operational Protocol: How Citizens Audit & Nominate Recipients',
        operationalTag: 'OPERATOR MANUAL',
        content: [
          'Any citizen, campus ambassador, or educator can inspect the live ledgers and participate in each 6-month distribution cycle:'
        ],
        howToUseProperly: {
          title: '6-MONTH DISTRIBUTION AUDIT PROTOCOL',
          steps: [
            'Nominate Beneficiaries: Submit rural schools, youth centers, or student delegates in need of kits or conference sponsorship via /impact.',
            'Field Verification: Local ambassadors verify infrastructural readiness and student rolls.',
            'Watch Offline Giveaway on ZEN.FLUX & Socials: Watch the live proof-of-work video dispatches showing the physical supplies being handed over every 6 months.',
            'Audit Ledger Receipts: Download itemized vendor invoices and ledger reconciliations directly from the public audit portal.'
          ]
        }
      }
    ]
  },

  // ─── ARTICLE III ───
  {
    id: 'article-3',
    articleNumber: 'ARTICLE III',
    title: 'EMPIRICAL RIGOR, PROOF-OF-CITATION & TRUTH MATRIX',
    badge: 'VERIFIED TRUTH',
    badgeColor: 'text-purple-300 bg-purple-500/10 border-purple-500/30',
    summary: 'Establishes the epistemic standard of Zenvitra: mandatory 3-tier citation hierarchy, peer fact-checking bounties, and a strict ban on deceptive headlines.',
    sections: [
      {
        sectionNumber: 'Section 3.01',
        heading: 'The Senses and Verifiable Sources Standard',
        operationalTag: 'EPISTEMIC STANDARD',
        content: [
          'All substantive arguments, policy papers, Model UN draft resolutions, and investigative press dispatches published on Zenvitra must be anchored in observable empirical reality, documented historical evidence, and verifiable citations.',
          'Sensationalist clickbait, emotional hysteria, and unverified conspiracy theories shall be subject to community peer-review challenges and cryptographic fact-checking bounties.'
        ],
        callout: 'Core Epistemic Maxim: Claims are evaluated on the weight of verifiable evidence, not the volume of the microphone.'
      },
      {
        sectionNumber: 'Section 3.02',
        heading: 'The 3-Tier Citation Hierarchy',
        operationalTag: 'RESEARCH STANDARD',
        content: [
          'All research presented across Zenvitra assemblies and Zen Press must satisfy the official three-tier evidentiary hierarchy:',
          '• Tier 1 (Primary Sources - Highest Authority): Official government dockets, multilateral treaties (UN Treaty Series), raw scientific experimental data, audited treasury ledgers, and unedited video/audio transcripts.',
          '• Tier 2 (Secondary Scholarly Sources): Peer-reviewed journal publications, academic university press books, and verified investigative reporting by accredited news wires with transparent methodology.',
          '• Tier 3 (Corroborated Commentary): Expert analysis, policy whitepapers, and think-tank briefs. Uncorroborated social media rumors, viral TikToks, and anonymous blogs are strictly barred from evidentiary citations.'
        ]
      },
      {
        sectionNumber: 'Section 3.03',
        heading: 'Fact-Bounties, Slashing & Retraction Standards',
        operationalTag: 'ENFORCEMENT SANCTIONS',
        content: [
          'Any citizen who identifies a fabricated statistic, altered quote, or fraudulent citation may stake a Civic Point Bounty against the claim.',
          'The author is given an immutable 24-hour response window to provide Tier-1 or Tier-2 citations. Failure to substantiate results in a mandatory public Retraction Banner, civic reputation score slashing (-50 to -200 PTS), and citation suspension.'
        ]
      },
      {
        sectionNumber: 'Section 3.04',
        heading: 'Operational Protocol: How to Format Citations & Stake Bounties',
        operationalTag: 'OPERATOR MANUAL',
        content: [
          'Follow these practical guidelines when drafting resolutions or challenging unsubstantiated claims on the platform:'
        ],
        howToUseProperly: {
          title: 'PROOF-OF-CITATION & FACT-BOUNTY WORKFLOW',
          steps: [
            'Embedding Citations: When writing a pulse dispatch or resolution clause, highlight the claim and click [Add Citation Hash]. Paste the permanent DOI, UN Document Symbol (e.g. A/RES/77/1), or verified URL.',
            'Verify Source Tier: The editor automatically tags your reference as Tier-1 (Green), Tier-2 (Blue), or Tier-3 (Yellow). Strive for at least two Tier-1 sources per resolution clause.',
            'Staking a Fact Bounty: If you detect false data, click [Stake Fact Bounty] on the dispatch. Stake 25 Civic Points and input your counter-citation proof.',
            'Adjudication: If community validators ratify your challenge, your staked points are returned with a +50 PTS reward, and the false post displays a permanent correction badge.'
          ]
        }
      }
    ]
  },

  // ─── ARTICLE IV ───
  {
    id: 'article-4',
    articleNumber: 'ARTICLE IV',
    title: 'THE ASSEMBLY OS (ZEN.EVENTS & ZEN.MUN) & RULES OF PROCEDURE',
    badge: 'PARLIAMENTARY RULES',
    badgeColor: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
    summary: 'Codifies the complete conference operating system, Secretariat command structure, parliamentary rules of procedure for Model UNs and parliamentary chambers, Dais mechanics, acoustic gavel standards, formal yields, diplomatic chits, and emergency protocol broadcasts.',
    sections: [
      {
        sectionNumber: 'Section 4.01',
        heading: 'Universal Floor Standing & Secretariat Command Hierarchy',
        operationalTag: 'CONFERENCE ARCHITECTURE',
        content: [
          'Every registered delegate, regardless of high school or university prestige, economic tier, or regional background, holds equal constitutional standing in the Zenvitra Assembly OS.',
          'Conference governance is operated through a transparent, role-partitioned Secretariat command hierarchy: Secretary-General (Conference Owner & Supreme Policy), Director-General (Operations & Logistics), USG/Department Heads (Departmental Deliverables), Committee Directors/EB (Committee Floor, Roll Calls, Speakers & Decorum), Rapporteurs (Documentation & Minutes), Finance (Registration Reconciliation & Approved Refunds), Press (Media Dispatches), and IT (Technical Diagnostic Troubleshooting).',
          'Gatekeeping by established delegations, favoritism by dais chairs, or backroom collusion to exclude smaller delegations is unparliamentary and subject to immediate review by the Secretariat.'
        ],
        callout: 'Sovereign Floor Equality: Every delegate is equal before the Dais; no prestige bias, no gatekeeping, no arbitrary silencing.'
      },
      {
        sectionNumber: 'Section 4.02',
        heading: 'Parliamentary Rules of Procedure (Assembly OS)',
        operationalTag: 'RULES OF PROCEDURE',
        content: [
          'All official Model UN simulations and youth assemblies governed by Zenvitra must operate under standardized Assembly OS rules:',
          '1. Roll-Call Attendance: Delegates must declare "Present" or "Present and Voting". Delegates who declare "Present and Voting" forfeit the right to abstain on substantive resolution votes.',
          '2. General Speaker\'s List (GSL): Governs formal general debate. Default speaking time is fixed by a majority procedural motion (typically 60 to 90 seconds).',
          '3. Moderated Caucus: Time-boxed debate on a specific sub-topic (e.g., "15 minutes, 45 seconds individual speaking time on Cross-Border Critical Mineral Supply Chains"). Dais maintains synchronized dual-timers tracking total caucus countdown and active speaker clock.',
          '4. Unmoderated Caucus: Informal lobbying session where delegates move freely to negotiate working papers and draft resolution blocs.',
          '5. Points & Motions Priority Hierarchy: Point of Order (procedural infraction) > Point of Personal Privilege (audibility/comfort) > Point of Parliamentary Inquiry (rules query) > Right of Reply (grave personal/national insult) > Procedural Motions to Caucus > Substantive Treaty Motions.'
        ]
      },
      {
        sectionNumber: 'Section 4.03',
        heading: 'Speech Timers, Acoustic Gavel Standards & Yield Protocols',
        operationalTag: 'SPEECH REGULATION',
        content: [
          'Floor microphones and speaking turns are strictly governed by the Assembly OS timer and acoustic gavel protocols. When a recognized speaker concludes with time remaining on the clock, the delegate must yield the floor under one of four constitutional modalities:',
          '1. Yield to the Chair: Returns the remaining time back to the Dais, concluding the speech immediately with a formal gavel wrap.',
          '2. Yield to Another Delegate: Concedes remaining seconds to a recognized allied delegation, who must speak without further yields.',
          '3. Yield to Questions (Points of Information): Yields the floor to questions from fellow delegates, with the Chair allocating 30-second response intervals.',
          '4. Yield to Comments: Allows the Chair to recognize two (2) delegates from the floor to deliver 30-second comments on the speech.',
          'At 00:00, the digital speech clock expires, triggering an authoritative double gavel wrap. Delegates exceeding allocated time after the gavel strike are ruled dilatory.'
        ],
        callout: 'The Guillotine Rule: Clear thinking requires disciplined brevity. Respect the gavel; when your time expires, yield with honor.'
      },
      {
        sectionNumber: 'Section 4.04',
        heading: 'Substantive Resolution Voting, Quorum & UNSC P5 Veto Invariants',
        operationalTag: 'VOTING MECHANICS',
        content: [
          'No substantive resolution or treaty draft may be voted upon without verified Quorum (minimum one-third of total accredited delegations present in the chamber).',
          'Procedural motions require a Simple Majority (>50%) of all present delegates, with no abstentions permitted.',
          'Substantive draft resolutions and formal amendments require a Two-Thirds (2/3) Supermajority (>66.7%) of present and voting delegates for adoption.',
          'In United Nations Security Council (UNSC) chambers, adoption of substantive draft resolutions requires nine (9) affirmative votes and the concurring votes of the Permanent Five (P5) members (China, France, Russian Federation, United Kingdom, United States). A negative vote ("No") cast by any P5 member on a substantive resolution constitutes a constitutional Veto, immediately defeating the draft.'
        ]
      },
      {
        sectionNumber: 'Section 4.05',
        heading: 'Digital Diplomatic Chits & Emergency Protocol Broadcasts',
        operationalTag: 'DIPLOMATIC COMMUNICATIONS',
        content: [
          'Chamber communication is facilitated through the Assembly OS Digital Chit Mesh, allowing delegations to pass confidential diplomatic dispatches to fellow states or send procedural notes to the Dais.',
          'All digital chits are cryptographically logged in the chamber audit ledger to enable the Dais to prevent harassment and unparliamentary conduct. Chits are never scanned for commercial data mining.',
          'The Secretariat retains the exclusive authority to trigger Emergency Protocol Broadcasts across all active committee rooms for genuine logistical, safety, or conference-wide schedule emergencies. Amber Operational Alerts notify participants of urgent operational updates; Red Emergency Broadcasts halt committee proceedings immediately for critical safety directives.'
        ]
      },
      {
        sectionNumber: 'Section 4.06',
        heading: 'Operational Protocol: How to Operate as an Effective Delegate & Dais',
        operationalTag: 'OPERATOR MANUAL',
        content: [
          'Step-by-step execution inside live conference chambers:'
        ],
        howToUseProperly: {
          title: 'DELEGATE & DAIS MASTER PLAYBOOK',
          steps: [
            'Roll Call Check-in: When your portfolio is called, state "Present" or "Present and Voting". Note that declaring "Present and Voting" binds you to vote on substantive treaties without abstaining.',
            'Setting the Agenda & Motions: Raise a procedural motion: "The Delegation of [State] moves for a Moderated Caucus of 12 minutes, with a 45-second individual speaking time on [Topic]."',
            'Delivering Speeches & Yielding: Deliver your policy arguments within the timer. If you finish early, clearly state your yield: "The Delegate yields remaining time to the Chair / to Questions."',
            'Diplomatic Chits: Send bilateral chits to build voting blocs and draft working papers collaboratively in ZEN.SOLUTIONS.',
            'Emergency Awareness: When an Amber or Red Emergency Broadcast appears on your screen, suspend unmoderated activities and heed Secretariat directives immediately.'
          ]
        }
      }
    ]
  },

  // ─── ARTICLE V ───
  {
    id: 'article-5',
    articleNumber: 'ARTICLE V',
    title: 'REDLINE LEGISLATIVE DIFFS & TREATY CODIFICATION (ZEN.SOLUTIONS)',
    badge: 'TREATY WORKBENCH',
    badgeColor: 'text-rose-300 bg-rose-500/10 border-rose-500/30',
    summary: 'Codifies the Git-like legislative diffing engine: clause-by-clause redlines, co-sponsorship thresholds, roll-call voting, and permanent codification of youth policy treaties.',
    sections: [
      {
        sectionNumber: 'Section 5.01',
        heading: 'Git-Style Version Control for Public Policy',
        operationalTag: 'LEGISLATIVE ARCHITECTURE',
        content: [
          'Public policy, Model UN resolutions, and civic declarations must be treated with the engineering rigor of open-source software.',
          'ZEN.SOLUTIONS deploys a clause-by-clause Redline Diff Engine. Every proposed amendment shows green additions, red strikethroughs, the proposing delegate signature, and the exact timestamp of submission.'
        ]
      },
      {
        sectionNumber: 'Section 5.02',
        heading: 'Sponsorship, Co-Signatories & Quorum Thresholds',
        operationalTag: 'SPONSORSHIP RULES',
        content: [
          'To introduce an operative clause or draft resolution to the floor, the document must meet strict sponsorship quotas:',
          '1. Primary Authors: Minimum 1 and maximum 3 primary sponsoring nodes.',
          '2. Signatories Quorum: Minimum 20% of active delegations in committee must sign the document to confirm it is suitable for formal debate.',
          '3. Amendment Types: Friendly Amendments (approved unanimously by all primary sponsors; incorporated without a vote) versus Unfriendly Amendments (disputed; requires a 50%+1 procedural roll-call vote).'
        ]
      },
      {
        sectionNumber: 'Section 5.03',
        heading: 'The Statutory Two-Revision Maximum (Anti-Tampering Invariant)',
        operationalTag: 'STATUTORY LIMIT',
        content: [
          'Every legislative bill, draft resolution, or sovereign charter published in ZEN.SOLUTIONS is constitutionally subject to a maximum of two (2) direct revisions by its author (Revision 1/2 and Revision 2/2).',
          'This invariant guarantees deliberative finality: once co-signatories endorse a bill or citizens cast affirmative votes, an author is structurally barred from covertly rewriting controversial clauses or altering legal liabilities in secret.',
          'Upon publishing the second revision, the document is permanently locked against author edits. Any further legislative modification must occur exclusively through formal, recorded chamber amendments.'
        ],
        callout: 'Anti-Tampering Invariant: Two revisions maximum per sovereign bill. Once locked, legislation can only be altered on the open chamber floor.'
      },
      {
        sectionNumber: 'Section 5.04',
        heading: 'The Drafting Studio, Intelligent Document Ingestion & Sovereign Permissions',
        operationalTag: 'DRAFTING OS',
        content: [
          'The ZEN.SOLUTIONS Drafting Studio provides sovereign parsing and bidirectional interoperability with ZEN.DOCS, PDF, DOCX, TXT, and Markdown files.',
          '1. Memory Extraction: Document text is parsed strictly in ephemeral memory into chapters, clauses, schedules, tables, and financial charts without training external foundational AI models.',
          '2. Leftover Clause Review: An automated diff auditor detects and surfaces any unparsed or leftover paragraphs to the author prior to publishing, ensuring zero legislative text is lost in translation.',
          '3. Original Document Permissions: Authors retain a sovereign permission toggle ("Allow original document download"). When disabled, readers may inspect the typeset bill on-screen while raw file downloads remain cryptographically restricted.'
        ]
      },
      {
        sectionNumber: 'Section 5.05',
        heading: 'Unified Legislative Block Architecture & Contributor Point Mechanics',
        operationalTag: 'LEGAL TYPESETTING',
        content: [
          'Amendments and schedules tabled under a bill must strictly adhere to unified legislative formatting:',
          '1. Clause Unity: Each Clause must appear as one clearly defined continuous block, with all subclauses grouped directly beneath the main heading. Fragmented cards or disconnected boxes are prohibited.',
          '2. Complete Schedule Grouping: Full Schedule texts must be presented as unified legal blocks with authentic statutory wording and internal numbering.',
          '3. Amendment Docket & Merit Points: Adopted amendments are permanently cataloged in the bill\'s right-hand docket, crediting amending delegates with non-monetary contributor points.'
        ]
      },
      {
        sectionNumber: 'Section 5.06',
        heading: 'Operational Protocol: How to Draft, Revise & Amend a Resolution',
        operationalTag: 'OPERATOR MANUAL',
        content: [
          'Step-by-step workflow for drafting, revising within the 2-edit limit, and ratifying youth treaties:'
        ],
        howToUseProperly: {
          title: 'RESOLUTION DRAFTING, REVISION & AMENDMENT PROCEDURE',
          steps: [
            'Draft in Studio: Navigate to /solutions > [Draft Policy Accord]. Import from ZEN.DOCS or upload a PDF/Word document. Complete the Leftover Review to verify all clauses.',
            'Publish & Circulate: Publish your draft bill to the Sovereign Solutions repository. Check your revision counter badge (0/2 edits used).',
            'Exercise Revisions Responsibly: You may submit up to 2 revisions (Revision 1/2, Revision 2/2) to fix typographical errors or polish language before final floor lock.',
            'Propose Floor Amendments: When amending peer legislation, select the target clause, choose Friendly or Unfriendly, and initiate a division vote.',
            'Earn Contributor Credits: When an amendment passes with chamber concurrence, the change is etched into the bill docket and merit points are credited to your Sovereign Passport.'
          ]
        }
      }
    ]
  },

  // ─── ARTICLE VI ───
  {
    id: 'article-6',
    articleNumber: 'ARTICLE VI',
    title: 'ZEN.PULSE CIVIC WIRE & ALGORITHMIC ARCHITECTURE',
    badge: 'SOCIAL MESH',
    badgeColor: 'text-blue-300 bg-blue-500/10 border-blue-500/30',
    summary: 'Codifies the Instagram-style chronological interleaving algorithm, Fresh Item discovery slots, anti-starvation rules, and publication ethics for the public civic wire.',
    sections: [
      {
        sectionNumber: 'Section 6.01',
        heading: 'The Instagram-Style Chronological Interleaving Engine',
        operationalTag: 'ALGORITHM CODE',
        content: [
          'ZEN.PULSE operates on a merit-based, human-centric ranking algorithm. It explicitly forbids rage-bait optimization, click-farming loops, and pay-to-win post boosting.',
          'The algorithm scores feeds on: Following Affinity (+120 PTS), Recency Tiering (massive boost for items <15m, <1h, <6h, and <24h), Discussion Depth (quality replies over passive views), and Proof-of-Citation Score.'
        ],
        callout: 'Anti-Starvation Mandate: New items are interleaved into upper discovery slots (Slots 1 and 4) so fresh dispatches from new delegates are never dumped at the bottom of the feed.'
      },
      {
        sectionNumber: 'Section 6.02',
        heading: 'Ephemeral Zen Notes & Multimedia Dispatches',
        operationalTag: 'FEATURE REGULATION',
        content: [
          'Delegates have access to specialized publishing modules on the wire:',
          '1. Zen Notes: 24-hour ephemeral Thought Bubbles (up to 80 characters) displayed at the top of the feed for live committee updates, caucus calls, and quick policy insights.',
          '2. FLUX Vertical Video Wire: High-fidelity 9:16 vertical video journalism delivering policy breakdowns and speech recordings with zero commercial ads.',
          '3. Floor Audio Drops: 60-second voice memos capturing impassioned floor debate with instant transcript verification.'
        ]
      },
      {
        sectionNumber: 'Section 6.03',
        heading: 'Code of Publishing & Anti-Spam Safeguards',
        operationalTag: 'PUBLISHING RULES',
        content: [
          'Publishers on ZEN.PULSE are bound by strict civic standards. Automated bot dispatches, duplicate cross-posting, uncredited meme reposts, and deceptive clickbait will trigger algorithmic de-ranking, feed shadow-quarantine, and civic point slashing.'
        ]
      },
      {
        sectionNumber: 'Section 6.04',
        heading: 'Operational Protocol: How to Dispatch Content Effectively',
        operationalTag: 'OPERATOR MANUAL',
        content: [
          'Maximize your reach and impact across the sovereign civic mesh:'
        ],
        howToUseProperly: {
          title: 'DISPATCH BEST PRACTICES & FEED CURATION',
          steps: [
            'Drafting a Dispatch: Open /pulse and tap [New Dispatch]. Keep your opening sentence concise and impactful.',
            'Adding Verification: Attach primary research links, verified statistics, or resolution clause numbers using the citation badge tool.',
            'Using Zen Notes: Tap the "+" on your avatar at the top of Pulse to share a quick 24-hour ephemeral Thought Bubble (e.g., "Drafting Climate Finance Treaty in Chamber 3 — Blocs welcome").',
            'Filtering Streams: Toggle between [For You (Smart Algorithm)], [Following], [Latest (Chronological)], [Trending], and [Media Wire] to customize your view.',
            'Tipping Merit: Applaud high-signal dispatches or tip +25 to +100 Civic Points to reward exceptional research.'
          ]
        }
      }
    ]
  },

  // ─── ARTICLE VII ───
  {
    id: 'article-7',
    articleNumber: 'ARTICLE VII',
    title: 'ZENCHAT SOVEREIGN MESH & ENCLAVE COMMUNICATIONS',
    badge: 'ENCRYPTED CHAT',
    badgeColor: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30',
    summary: 'Governs end-to-end encrypted delegate messaging, ephemeral caucus corridors, snap glimpses, moderator speaker queues, and private backchannel ethics.',
    sections: [
      {
        sectionNumber: 'Section 7.01',
        heading: 'End-to-End Encryption & Ephemeral Communications',
        operationalTag: 'COMMUNICATION SECURITY',
        content: [
          'All direct messages, delegation corridors, and bilateral negotiation chats inside ZenChat operate under end-to-end encryption. Zenvitra servers hold zero cryptographic keys to decrypt delegate conversations.',
          'Delegates may exchange 1-view Instants (Glimpse messages) for confidential negotiating briefs, ensuring sensitive caucus strategy cannot be screenshotted or leaked.'
        ]
      },
      {
        sectionNumber: 'Section 7.02',
        heading: 'Committee Caucus Audio/Video Corridors',
        operationalTag: 'CAUCUS CHANNELS',
        content: [
          'Each Model UN committee is provisioned with a secure audio/video caucus chamber. Speaker queues are maintained transparently on screen.',
          'Event Moderators have the constitutional authority to enforce speaking time, manage queue order, and mute disorderly microphones, but are strictly prohibited from manipulating the content of debate.'
        ]
      },
      {
        sectionNumber: 'Section 7.03',
        heading: 'Operational Protocol: How to Caucus in ZenChat Securely',
        operationalTag: 'OPERATOR MANUAL',
        content: [
          'Guidelines for bilateral and bloc negotiations:'
        ],
        howToUseProperly: {
          title: 'ZENCHAT CAUCUS PROTOCOL',
          steps: [
            'Initiating a Bloc Chat: Navigate to /chat > [Create Corridor]. Add participating delegate handles from your regional bloc.',
            'Setting Auto-Delete: For confidential strategy sessions, enable [Ephemeral Mode] (options: 1 Hour, 24 Hours, or 7 Days TTL).',
            'Sending 1-View Drafts: When sharing unreleased clause drafts, toggle [Instant View] before sending to prevent unauthorized forwarding.',
            'Entering Committee Audio: Tap [Join Caucus Audio] in your summit room. Tap [Raise Hand] to be queued on the Event Moderator\'s speaker list.'
          ]
        }
      }
    ]
  },

  // ─── ARTICLE VIII ───
  {
    id: 'article-8',
    articleNumber: 'ARTICLE VIII',
    title: 'CIVIC MERITOCRACY, STAKING & THE SOVEREIGN PASSPORT',
    badge: 'MERIT PROTOCOL',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    summary: 'Codifies the non-fiat merit economy, Civic Point generation, staking mechanics, slashing penalties, and the immutable Sovereign Delegate Passport.',
    sections: [
      {
        sectionNumber: 'Section 8.01',
        heading: 'The Non-Fiat Civic Reputation Standard',
        operationalTag: 'MERIT INVARIANT',
        content: [
          'Reputation on Zenvitra is earned exclusively through intellectual output, parliamentary leadership, empirical citations, and verified community contributions.',
          'Civic Points cannot be purchased with fiat money, converted to speculative crypto tokens, or transferred via secondary black markets. Merit cannot be bought.'
        ],
        callout: 'Anti-Plutocracy Rule: Money buys no influence on Zenvitra. A billionaire and a rural student start with identical civic standing.'
      },
      {
        sectionNumber: 'Section 8.02',
        heading: 'The Sovereign Civic Passport (Immutable Record)',
        operationalTag: 'CREDENTIAL SYSTEM',
        content: [
          'Every delegate possesses a Sovereign Civic Passport at /profile. The passport cryptographically logs:',
          '1. Conference Attendances: Verified via on-site NFC/QR check-in at official Zenvitra assemblies.',
          '2. Committee Accolades: Best Delegate, Outstanding Delegate, Honorable Mention, and Verbal Commendation awards verified by the Dais Secretariat.',
          '3. Treaties & Resolutions Co-Authored: Direct links to ratified documents in the Sovereign Codex.',
          '4. Epistemic Citation Score: Historical accuracy rating based on peer audits and fact bounties.'
        ]
      },
      {
        sectionNumber: 'Section 8.03',
        heading: 'Staking Mechanics & Point Slashing Penalties',
        operationalTag: 'ENFORCEMENT MECHANISM',
        content: [
          'Points can be staked to sponsor motions, initiate plenary referendums, or challenge factual inaccuracies.',
          'Slashing Penalties: Deliberate plagiarism (-100 PTS), unparliamentary abuse (-75 PTS), falsified citations (-150 PTS), and frivolous challenge brigading (-50 PTS). Slashed points are burned from the network.'
        ]
      },
      {
        sectionNumber: 'Section 8.04',
        heading: 'Operational Protocol: How to Build Your Sovereign Passport',
        operationalTag: 'OPERATOR MANUAL',
        content: [
          'Elevate your global delegate resume on the sovereign mesh:'
        ],
        howToUseProperly: {
          title: 'SOVEREIGN PASSPORT ACCREDITATION GUIDE',
          steps: [
            'Claim Your Handle: Complete /onboarding/identity with your academic institution or sovereign alias.',
            'Deliver Speeches: Participate in registered assemblies to accumulate verified floor minutes and caucus points.',
            'Publish Research: Submit peer-reviewed investigative analyses to Zen Press to earn +50 to +200 Civic Points per publication.',
            'Export Credential: Click [Export Student Profile / MUN CV] to generate a tamper-proof PDF CV complete with cryptographic verification QR code for university and scholarship applications.'
          ]
        }
      }
    ]
  },

  // ─── ARTICLE IX ───
  {
    id: 'article-9',
    articleNumber: 'ARTICLE IX',
    title: 'CIVIC INTEGRITY, SECULAR CODE & THE COMMUNITY JURY',
    badge: 'SECULAR & ETHICAL',
    badgeColor: 'text-rose-300 bg-rose-500/10 border-rose-500/30',
    summary: 'Enforces strict secular neutrality, zero tolerance for harassment or doxxing, due process rights, and the 5-delegate peer community jury.',
    sections: [
      {
        sectionNumber: 'Section 9.01',
        heading: 'Strict Secular Civic Demarcation',
        operationalTag: 'CIVIC NEUTRALITY',
        content: [
          'Zenvitra is an uncompromisingly secular civic sanctuary. Theological proselytization, sectarian intimidation, communal hate speech, and religious supremacism are categorically banned across all public chambers, feeds, and summit halls.',
          'Discourse must remain firmly rooted in universal human rights, scientific consensus, public health, constitutional governance, and environmental stewardship.'
        ]
      },
      {
        sectionNumber: 'Section 9.02',
        heading: 'Zero Tolerance for Doxxing, Harassment & Sabotage',
        operationalTag: 'COMMUNITY SAFETY',
        content: [
          'Doxxing (publishing private addresses, phone numbers, credentials, or private identities without consent), coordinated brigading, cyberbullying, sexual harassment, and deepfake impersonation trigger immediate content quarantine and progressive enforcement up to permanent network termination and legal referral in accordance with Article XI (Sections 11.07 & 11.09).'
        ]
      },
      {
        sectionNumber: 'Section 9.03',
        heading: 'The 5-Delegate Peer Community Jury & Due Process',
        operationalTag: 'JUDICIAL TRIBUNAL',
        content: [
          'No delegate may be permanently banned or stripped of credentials without due process. Disciplinary appeals are heard by a randomized Peer Community Jury comprising five (5) senior accredited delegates holding a minimum citation score of 95%.',
          'Jury deliberations are conducted publicly in the Appeals Enclave, and verdicts require a 4-out-of-5 supermajority.'
        ]
      },
      {
        sectionNumber: 'Section 9.04',
        heading: 'Operational Protocol: How to Report Violations & File Appeals',
        operationalTag: 'OPERATOR MANUAL',
        content: [
          'Step-by-step procedure for reporting unparliamentary conduct:'
        ],
        howToUseProperly: {
          title: 'INCIDENT REPORTING & JURY TRIBUNAL PROCEDURE',
          steps: [
            'File Notice of Violation: Click [...] on the offending message or dispatch and select [Report Civic Infraction]. Select the violation category (Doxxing, Hate Speech, Plagiarism, Harassment).',
            'Attach Evidence: Provide screenshots, message hashes, or committee audio timestamps.',
            'Secretariat Review: The High Secretariat issues an interim 24-hour quarantine if physical safety or doxxing is implicated.',
            'Jury Hearing: If the respondent appeals, a 5-Delegate Peer Jury is impaneled within 48 hours to examine logs and render a binding verdict.'
          ]
        }
      }
    ]
  },

  // ─── ARTICLE X ───
  {
    id: 'article-10',
    articleNumber: 'ARTICLE X',
    title: 'THE COCKROACH DOCTRINE, GENESIS LOCK & SUPREME AMENDMENT CODE',
    badge: 'SUPREME LAW',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    summary: 'Codifies the anti-fragility doctrine, permanent public memory, the unamendable Genesis Lock invariants, and the formal Article VII 75% supermajority amendment procedure.',
    sections: [
      {
        sectionNumber: 'Section 10.01',
        heading: 'The Cockroach Philosophy (Anti-Fragility Doctrine)',
        operationalTag: 'FOUNDATIONAL CREED',
        content: [
          'Zenvitra is architected to endure and thrive in hostile environments. When traditional media monopolies mock youth initiatives, when governments censor student assemblies, and when corporate platforms shadow-ban critical discourse—Zenvitra persists, adapts, and regenerates.',
          'The Cockroach Doctrine represents absolute, unyielding survival. We operate on minimal overhead, zero corporate debt, and sovereign community infrastructure that cannot be starved or shut down.'
        ],
        callout: 'The Cockroach Creed: You can censor words, buy off politicians, and flood feeds with bots—but you cannot exterminate an idea whose time has come.'
      },
      {
        sectionNumber: 'Section 10.02',
        heading: 'Permanent Public Memory & Distributed Archives',
        operationalTag: 'HISTORICAL IMMUTABILITY',
        content: [
          'All ratified treaties, Model UN resolutions, public audit ledgers, and constitutional amendments are etched into permanent digital archives. No future administration or external pressure group has the authority to erase historical deliberations or whitewash public records.'
        ]
      },
      {
        sectionNumber: 'Section 10.03',
        heading: 'The Genesis Lock (Immutable Core Invariants)',
        operationalTag: 'ETERNAL INVARIANTS',
        content: [
          'The following four foundational provisions constitute the Zenvitra Genesis Lock and are declared eternal, unalterable, and immune to repeal or dilution under any circumstances:',
          '1. The Zero-Surveillance and Anti-Behavioral Advertising Mandate (Article I, Section 1.01).',
          '2. The Mandatory 10.0% Net Profit Civic Endowment for Rural Public Schools & Scholarships (Article II, Section 2.01).',
          '3. The Strict Secular Demarcation and Non-Sectarian Civic Standard (Article IX, Section 9.01).',
          '4. The Strict Data Integrity Law and Zero-Seeded Accounts Mandate: Absolute permanent prohibition against seeded, synthetic, mock, or fake user accounts, simulated follower graphs, artificial pass metrics, or fabricated conference attendees (Strict Data Integrity Law).',
          'Any amendment, legislative motion, executive decree, or board vote attempting to dilute, lower, circumvent, or abolish any of these four pillars is constitutionally void ab initio.'
        ],
        callout: 'The Genesis Lock: These four cornerstones can NEVER be repealed, diluted, or circumvented, by anyone, at any time, for any reason.'
      },
      {
        sectionNumber: 'Section 10.04',
        heading: 'Comprehensive Multi-Tier Amendment Architecture & Ratification Lifecycle',
        operationalTag: 'FORMAL AMENDMENT CODE',
        content: [
          'Operational, procedural, and structural articles (Articles III through IX, Article XI, Article XII, and non-Genesis operational provisions) may only be amended through the strict six-stage constitutional ratification lifecycle:',
          'Stage 1 — Formal Filing & Co-Sponsorship Threshold: A proposed amendment must be submitted through the official Constitution Docket (#ZEN-AMD-YYYY-XXXX). The petition must contain a verbatim statutory redline diff (exact text to be deleted, amended, or inserted) and empirical justification with verifiable citations. The filing must be co-sponsored by at least fifty (50) accredited youth delegates across three distinct institutions OR five (5) active conference Secretariats.',
          'Stage 2 — 14-Day Public Notice & Redline Diff Exhibition: Upon docketing, the petition is displayed across the Constitution Portal, the Secretariat Command Centre, and the ZEN.PULSE Civic Wire for a mandatory fourteen (14) day open public review and commentary period.',
          'Stage 3 — Plenary Debate & Assembly Quorum: The docket must be formally deliberated, debated, and considered on the floor of a minimum of twenty-five (25) accredited youth assemblies, Model UN conferences, or parliamentary forums across the ecosystem.',
          'Stage 4 — Tiered Ratification Thresholds:',
          '• Category A (Operational & Administrative Amendments, e.g. default speech timers, caucus logistics, technical fee schedule formulas): Requires a 60.0% supermajority roll-call vote of all voting accredited delegates across the deliberating assemblies.',
          '• Category B (Structural & Governance Amendments, e.g. Jury Tribunals, Assembly OS protocols, Press criteria, Secretariat powers): Requires a 75.0% constitutional supermajority roll-call vote.',
          '• Category C (Genesis Lock Invariants): Non-amendable, non-derogable, and immune to repeal in perpetuity.',
          'Stage 5 — Executive Attestation & Cryptographic Promulgation: Following successful assembly ratification, the amendment receives formal attestation by the Founder Council (@yuveer, Presiding Secretariat, and Civic Escrow Auditors) and is cryptographically hashed with SHA-256 and etched into the permanent public archive.',
          'Stage 6 — Emergency Technical Amendments & 30-Day Sunset Protocol: In the critical event of zero-day security vulnerabilities, severe data breach hazards, or sudden statutory compliance emergencies, an Emergency Technical Amendment may be promulgated by unanimous approval of the Founder and Security Core. All Emergency Technical Amendments carry an automatic Thirty (30) Day Sunset Clause: they expire automatically after 30 days unless formally ratified through the complete Stage 1-5 assembly quorum lifecycle.'
        ]
      },
      {
        sectionNumber: 'Section 10.05',
        heading: 'Operational Protocol: How to Formally Petition & Ratify an Amendment',
        operationalTag: 'OPERATOR MANUAL',
        content: [
          'Follow the constitutional procedure to table, advocate, and ratify a redline petition:'
        ],
        howToUseProperly: {
          title: 'CONSTITUTIONAL AMENDMENT PETITION & RATIFICATION WORKFLOW',
          steps: [
            'Initiate Docket Petition: Click [Request Amendment] in the Constitution portal. Select the operational Article and Section (ensuring it does not conflict with the Genesis Lock).',
            'Draft Verbatim Redline Diff: Provide exact statutory modifications highlighting additions (+) and deletions (-). Attach empirical citations and rationale.',
            'Gather Sovereign Co-Sponsorship: Circulate your draft petition to secure endorsements from 50 accredited delegates or 5 active Secretariats to meet the Stage 1 threshold.',
            'Engage 14-Day Public Scrutiny: Monitor debate and feedback on ZEN.PULSE and participate in public town halls during the exhibition window.',
            'Assembly Quorum & Roll-Call Vote: Table the docket for formal voting across participating assemblies. Attain 60.0% (Category A) or 75.0% (Category B) supermajority.',
            'Promulgation: Upon Founder Council attestation, your ratified amendment is permanently codified with a unique cryptographic hash and etched into history.'
          ]
        }
      }
    ]
  },

  // ─── ARTICLE XI ───
  {
    id: 'article-11',
    articleNumber: 'ARTICLE XI',
    title: 'COMMUNITY GUIDELINES, CONTENT POLICY & CREATOR RESPONSIBILITY (THE GOLDEN RULE)',
    badge: 'CREATOR ACCOUNTABILITY',
    badgeColor: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
    summary: 'Codifies the foundational content principle, the "You Own Your Words" creator liability rule, ZENVITRA International Press standards, prohibited content safeguards, event organizer responsibility, and progressive enforcement due process.',
    sections: [
      {
        sectionNumber: 'Section 11.01',
        heading: 'Preamble & Ecosystem Scope',
        operationalTag: 'ECOSYSTEM JURISDICTION',
        content: [
          'ZENVITRA is architected as a global sovereign digital ecosystem where individuals, students, professionals, organizations, writers, journalists, delegates, creators, event organizers, and communities communicate, publish, collaborate, debate, organize, and build.',
          'The ecosystem spans: ZEN.PROFILE, ZEN.CHAT, ZEN.PULSE, ZEN.FLUX, ZENVITRA International Press, ZEN.EVENTS, ZEN.MUN, Chamber Dais, ZEN.DOCS, ZEN.LEGISLATE, ZEN.PAYMENTS, ZEN.CERTIFY, Professional Accounts, Organization Workspaces, Conference Management Systems, and AI-powered drafting tools.',
          'By using ZENVITRA, publishing Content, creating an account, participating in an event, operating an organization, or managing a conference, all participants agree to comply with these Guidelines in addition to the Terms of Service and Privacy Policy.'
        ],
        callout: 'The Foundational Balance: Meaningful expression, debate, journalism, creativity, and education require freedom. But freedom within a digital community demands uncompromised responsibility.'
      },
      {
        sectionNumber: 'Section 11.02',
        heading: 'The Content Principle: Lawful Freedom of Expression & Robust Debate',
        operationalTag: 'EXPRESSION STANDARDS',
        content: [
          'ZENVITRA supports lawful freedom of expression. Users may express opinions, political viewpoints, criticism, empirical analysis, satire, commentary, educational perspectives, creative ideas, journalistic reporting, and debate positions.',
          'Disagreement, criticism, debate, and unpopular opinions are not automatically violations of platform rules. ZENVITRA does not require users to agree with one another.',
          'A user may strongly disagree with another person\'s politics, ideas, arguments, articles, professional opinions, or public statements, provided conduct remains within applicable law and these Guidelines.'
        ]
      },
      {
        sectionNumber: 'Section 11.03',
        heading: 'The Golden Rule of ZENVITRA: "You Own Your Words" & Author Responsibility',
        operationalTag: 'CREATOR LIABILITY',
        content: [
          'Every user is strictly and primarily responsible for the Content that they create, upload, publish, submit, distribute, transmit, or otherwise make available through ZENVITRA. This applies across ZENVITRA International Press, personal blogs, professional accounts, ZEN.PULSE, ZEN.FLUX, ZEN.CHAT, documents, event pages, organization pages, and MUN legislative systems.',
          'Author Responsibility: The person who creates or publishes Content warrants that they are responsible for its substance, including any legal consequences arising from false statements, unlawful acts, infringement, privacy violations, fraudulent claims, threats, or prohibited harassment.',
          'Platform Role Demarcation: The fact that Content appears on ZENVITRA does NOT mean that ZENVITRA created, wrote, endorsed, verified, approved, or agrees with that Content. Unless expressly identified as official ZENVITRA Content, user-generated material represents the views and responsibility of its author, publisher, or account holder.'
        ],
        callout: 'The Golden Rule of ZENVITRA: YOU OWN YOUR WORDS. If you write it, publish it, upload it, or communicate it through your account, you remain responsible for your own content and conduct under applicable law.'
      },
      {
        sectionNumber: 'Section 11.04',
        heading: 'Writer, Author & Publisher Standards (Accuracy, Sources & Allegations)',
        operationalTag: 'JOURNALISTIC RIGOR',
        content: [
          'This standard applies to writers, journalists, bloggers, contributors, professional publishers, and organizations publishing through ZENVITRA International Press or other media features.',
          '1. Responsibility for Accuracy: Authors must make reasonable efforts to ensure factual claims presented as facts are accurate, and shall not knowingly publish information known to be materially false.',
          '2. Responsibility for Sources: Where an article relies upon external information, the author is responsible for the representation of sources, quotations, documents, interviews, research, statistics, and allegations.',
          '3. Responsibility for Allegations: Authors must exercise particular care when publishing allegations about identifiable individuals or organizations. Authors must clearly distinguish between verified facts, allegations, opinions, analysis, commentary, and satire.',
          '4. Personal Legal Responsibility: To the maximum extent permitted by applicable law, the author, publisher, contributor, or account holder remains responsible for their own Content and for their own unlawful acts or omissions.'
        ]
      },
      {
        sectionNumber: 'Section 11.05',
        heading: 'Platform Liability Limitation & Intermediary Demarcation',
        operationalTag: 'INTERMEDIARY SAFE HARBOR',
        content: [
          'Where legally applicable, ZENVITRA operates as a technology platform, hosting service, intermediary, publishing infrastructure provider, or conduit. The availability of publishing tools does not make ZENVITRA the author of every item published through those tools.',
          'No Automatic Transfer of Responsibility: A user cannot transfer responsibility for their own Content to ZENVITRA merely because ZENVITRA hosted the Content, provided tools, provided an account, displayed the Content on a domain, or technically transmitted/stored the data.',
          'Subject to Applicable Law: Nothing in these Guidelines is intended to eliminate, exclude, or override responsibilities that applicable law imposes upon ZENVITRA. Platform rights, obligations, and protections are determined under applicable law.'
        ]
      },
      {
        sectionNumber: 'Section 11.06',
        heading: 'ZENVITRA International Press (Editorial Status & Attribution)',
        operationalTag: 'PRESS PROTOCOL',
        content: [
          'Independent Contributors: An independent contributor is not an employee, agent, spokesperson, or official representative of ZENVITRA merely because they publish through ZENVITRA International Press. Their work represents their own reporting, opinions, and analysis.',
          'Authorship Identification: Published material displays clear author, contributor, publication account, organization, date, and editorial tier metadata.',
          'Editorial Status Tiers: (a) INDEPENDENT (individual contributor); (b) CONTRIBUTOR (approved contributor); (c) VERIFIED AUTHOR (credential-verified); (d) EDITORIAL (formally commissioned editorial team); (e) OFFICIAL ZENVITRA (officially issued platform releases).',
          'No Implied Endorsement: Publishing an article through ZENVITRA International Press does not constitute endorsement, factual warranty, or platform adoption of the author\'s claims.'
        ]
      },
      {
        sectionNumber: 'Section 11.07',
        heading: 'Prohibited Content, Harassment & Integrity Safeguards',
        operationalTag: 'PROHIBITED CONDUCT',
        content: [
          '1. Illegal Content: Users may not create, distribute, promote, facilitate, or organize Content that is unlawful under applicable law. ZENVITRA acts on valid legal orders, requests, or complaints.',
          '2. Fraud & Deception: Prohibits impersonation, unlawful financial scams, fraudulent events, nonexistent services, credential falsification, fake organizations, payment manipulation, and forged certificates.',
          '3. Impersonation: Falsely representing oneself as another individual, organization, government authority, ZENVITRA employee, or public figure is strictly banned. Parody or satire is evaluated based on clear non-deceptive representation.',
          '4. Harassment & Abuse: Repeated conduct intended to intimidate, stalk, or abuse individuals is prohibited. Evaluated on repetition, targeting, context, severity, and power imbalances. Disagreements and robust political debate do not constitute harassment.',
          '5. Threats: Unlawful or credible threats of serious harm are categorically barred and subject to immediate intervention.',
          '6. Privacy & Doxxing: Improper publication of another person\'s private contact information, financial details, passwords, private documents, or confidential communications is prohibited.',
          '7. Intellectual Property & Author Warranties: Users must respect copyright and warrant that they hold the necessary rights and authority to publish materials.'
        ]
      },
      {
        sectionNumber: 'Section 11.08',
        heading: 'Product-Specific Protocols: PULSE, CHAT, MUN Simulations & Event Organizers',
        operationalTag: 'PRODUCT CONTEXTS',
        content: [
          '1. ZEN.PULSE & ZEN.FLUX: Users are responsible for all micro-dispatches, videos, and comments. Community reporting triggers automated and human review.',
          '2. ZEN.CHAT: Private messaging is end-to-end encrypted, but does not provide immunity for fraud, serious threats, exploitation, or criminal abuse.',
          '3. Educational Simulation Context (ZEN.MUN): Debates involving historical conflicts, geopolitical crisis cabinets, and controversial policy are understood in their simulated educational context. A delegate representing a national portfolio is not expressing personal beliefs.',
          '4. Event Organizer Responsibility: Event organizers are strictly responsible for the events they create, rules they set, communications they issue, fees they collect, and participant management. ZENVITRA provides infrastructure without becoming the legal organizer of independent third-party conferences.'
        ]
      },
      {
        sectionNumber: 'Section 11.09',
        heading: 'Progressive Enforcement, Content Removal & Right to Appeal',
        operationalTag: 'ENFORCEMENT PROTOCOL',
        content: [
          'Enforcement Actions: Depending on context and severity, ZENVITRA may issue warnings, limit visibility, remove Content, require corrections, apply context labels, restrict features, suspend publishing, suspend accounts, terminate accounts, or preserve evidence where legally required.',
          'Removal Does Not Decide Legal Liability: Removing content indicates policy enforcement or safety compliance, but does not constitute a judicial ruling or admission of wrongdoing.',
          'User Indemnity: Users who violate applicable law, these Guidelines, or third-party rights remain legally responsible and may be required to indemnify ZENVITRA against resulting liabilities.',
          'Right to Appeal: Users may appeal moderation actions by providing context, corrections, or evidence of mistake through the due process tribunal.'
        ]
      },
      {
        sectionNumber: 'Section 11.10',
        heading: 'The ZENVITRA Responsibility Model: Summary Matrix',
        operationalTag: 'RESPONSIBILITY MATRIX',
        content: [
          '• A USER WRITES AN ARTICLE → Primary responsibility: THE AUTHOR',
          '• AN ORGANIZATION HOSTS AN EVENT → Primary responsibility: THE ORGANIZER',
          '• A DELEGATE DEBATES IN A SIMULATION → Responsibility evaluated within: THE EDUCATIONAL SIMULATION CONTEXT',
          '• ZENVITRA PROVIDES THE PLATFORM → Technical platform responsibility: DETERMINED UNDER APPLICABLE LAW',
          '• A COURT OR STATUTE ORDERS ACTION → COMPLIANCE WITH APPLICABLE LEGAL REQUIREMENTS',
          'Final Community Principle: Freedom of expression does not mean freedom from responsibility. ZENVITRA provides the platform. The creator owns their words. The author owns their work. The organizer owns their event. And every person must respect the law and the rights of others.'
        ],
        howToUseProperly: {
          title: 'CREATOR & ORGANIZER RESPONSIBILITY CHECKLIST',
          steps: [
            'Verify Before Publishing: Check factual claims, distinguish opinions from allegations, and verify external sources before publishing investigative articles.',
            'Disclose Simulation Persona: In Model UN or legislative debates, ensure delegate statements remain within parliamentary and educational simulation boundaries.',
            'Respect Privacy & Copyright: Never publish private contact details (doxxing) or third-party media without proper license or fair-use attribution.',
            'Organize Transparently: Event organizers must provide clear schedules, refund policies, and codes of conduct for all attendees.',
            'Appeal with Evidence: If your content is quarantined or flagged, submit a formal appeal detailing context, corroboration, or factual corrections.'
          ]
        }
      }
    ]
  },

  // ─── ARTICLE XII ───
  {
    id: 'article-12',
    articleNumber: 'ARTICLE XII',
    title: 'OPEN PUBLICATION, FREEDOM OF EXPRESSION & MEDIA TRANSPARENCY',
    badge: 'UNIVERSAL RIGHT TO PUBLISH',
    badgeColor: 'text-sky-300 bg-sky-500/10 border-sky-500/30',
    summary: 'Codifies the universal right to publish without institutional gatekeeping, free and accessible platform participation, uncompromised editorial independence, mandatory citation of authentic sources, distinction between opinion and fact, and radical equal opportunity advancing “By Youth, For Youth.”',
    sections: [
      {
        sectionNumber: 'Section 12.01',
        heading: 'Universal Right to Publish',
        operationalTag: 'FUNDAMENTAL LIBERTY',
        content: [
          'ZENVITRA shall remain an open platform where every individual has the opportunity to write, publish, share ideas, express opinions, and contribute articles, blogs, reports, and other forms of written content, subject to transparent and reasonable community guidelines.',
          'Publication shall not be restricted solely on the basis of an individual\'s institutional affiliation, professional status, experience, or ability to pay.'
        ],
        callout: 'Universal Invariant: Every individual has the unalienable opportunity to publish, share ideas, and contribute content evaluated strictly on merit.'
      },
      {
        sectionNumber: 'Section 12.02',
        heading: 'Free and Accessible Platform',
        operationalTag: 'ACCESSIBILITY INVARIANT',
        content: [
          'ZENVITRA shall strive to provide its core writing, reading, and community participation features free of charge.',
          'No mandatory payment shall be imposed merely to express an opinion, submit an article, or access publicly available written content.'
        ]
      },
      {
        sectionNumber: 'Section 12.03',
        heading: 'Editorial Independence',
        operationalTag: 'EDITORIAL INTEGRITY',
        content: [
          'Every contributor shall have the freedom to express lawful opinions and present arguments independently.',
          'ZENVITRA shall not permit political, commercial, institutional, or personal interests to dictate editorial conclusions.',
          'Reasonable moderation may be applied to content involving unlawful material, targeted harassment, plagiarism, fabricated evidence, or other clearly defined violations of published policies.'
        ]
      },
      {
        sectionNumber: 'Section 12.04',
        heading: 'Authentic Sources and Citation',
        operationalTag: 'EVIDENCE RIGOR',
        content: [
          'Contributors shall be encouraged, and where factual claims require substantiation, expected, to cite authentic and traceable sources.',
          'These may include government records, legislation, court judgments, official datasets, peer-reviewed research, original documents, credible news organisations, and verifiable statements.',
          'Sources must not be fabricated, misrepresented, or deliberately taken out of context.'
        ]
      },
      {
        sectionNumber: 'Section 12.05',
        heading: 'Transparency and Accountability',
        operationalTag: 'MEDIA TRANSPARENCY',
        content: [
          'Opinions shall be distinguishable from factual reporting.',
          'Unverified claims shall not be presented as established facts, and material inaccuracies shall be addressed through appropriate corrections.',
          'Contributors shall retain appropriate attribution for their original work, while plagiarism and deliberate misinformation may be subject to moderation under published rules.'
        ]
      },
      {
        sectionNumber: 'Section 12.06',
        heading: 'Equal Opportunity and Youth Empowerment',
        operationalTag: 'BY YOUTH, FOR YOUTH',
        content: [
          'ZENVITRA shall promote an environment in which voices are evaluated on the merit of their ideas and the integrity of their contributions—not their popularity, financial resources, qualifications, or social standing.',
          'Its purpose shall be to make publishing and public discourse accessible to everyone, advancing its founding principle: “By Youth, For Youth.”'
        ],
        callout: 'Founding Pillar: “By Youth, For Youth.” Every voice evaluated on intellectual merit and integrity, not popularity or financial resources.',
        howToUseProperly: {
          title: 'OPEN PUBLICATION & MEDIA TRANSPARENCY PROTOCOL',
          steps: [
            'Publish Freely: Access ZENVITRA International Press or ZEN.PULSE Dispatches without paywalls or institutional gatekeeping.',
            'Cite Verifiable Records: Hyperlink legislation, court transcripts, peer-reviewed datasets, and verifiable statements when advancing factual claims.',
            'Delineate Analysis vs. Fact: Clearly tag opinion columns, investigative reports, or editorial commentaries to preserve reader transparency.',
            'Zero Pay-to-Speak: Core reading and writing features remain universally accessible to all sovereign youth delegates.'
          ]
        }
      }
    ]
  }
];

// ─── CONSTITUTIONAL HELP & FAQS ───

export interface ConstitutionalFAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  articleRef?: string;
}

export const CONSTITUTION_FAQS: ConstitutionalFAQ[] = [
  {
    id: 'const-faq-1',
    category: 'Treaty & Solutions OS',
    articleRef: 'ARTICLE V',
    question: 'What is the constitutional purpose of ZEN.SOLUTIONS and the Drafting Studio?',
    answer: 'Under Article V, ZEN.SOLUTIONS treats public policy, Model UN resolutions, and civic accords with the engineering rigor of open-source software. The Drafting Studio provides multi-format parsing (PDF, DOCX, Markdown, ZEN.DOCS), leftover text auditing, and line-by-line redline diff tracking to guarantee transparent legislative codification.'
  },
  {
    id: 'const-faq-2',
    category: 'Legislative Integrity',
    articleRef: 'ARTICLE V (SECTION 5.03)',
    question: 'Why is the 2-revision limit on bills codified as a constitutional invariant?',
    answer: 'Allowing unlimited post-publication edits introduces a fatal deliberative flaw where an author could table a consensus proposal, collect citizen votes or co-sponsor signatures, and subsequently rewrite contentious clauses in secret. The 2-revision cap establishes deliberative finality; once locked, changes must occur as transparent chamber floor amendments.'
  },
  {
    id: 'const-faq-3',
    category: 'Legal Typesetting',
    articleRef: 'ARTICLE V (SECTION 5.05)',
    question: 'How does the unified legislative block layout protect statutory integrity?',
    answer: 'Splitting subclauses or schedules into disconnected UI cards dilutes legislative coherence. Under Section 5.05, each Clause and its subclauses must appear as one unified continuous block, preserving exact statutory numbering, em-dash title separators, cross-references, and schedule text without algorithmic truncation.'
  },
  {
    id: 'const-faq-4',
    category: 'Genesis Lock Invariants',
    articleRef: 'ARTICLE X (SECTION 10.03)',
    question: 'What are the Four Immutable Genesis Lock Pillars that can never be amended or repealed?',
    answer: 'The Genesis Lock defines four perpetual, non-derogable pillars: (1) Zero-Surveillance and Anti-Behavioral Advertising Mandate (Article I); (2) Mandatory 10.0% Net Profit Civic Endowment for Rural Schools & Scholarships (Article II); (3) Strict Secular Demarcation and Non-Sectarian Standard (Article IX); and (4) Strict Data Integrity Law: Absolute permanent ban on seeded, synthetic, mock, or fake accounts/metrics.'
  },
  {
    id: 'const-faq-5',
    category: '10% Civic Endowment',
    articleRef: 'ARTICLE II',
    question: 'How does the 10% Profit Civic Endowment work, and how can students audit it?',
    answer: 'Exactly 10.0% of all net platform profits are irreversibly partitioned into the Zenvitra Civic Endowment Vault for rural school labs and delegate scholarships. Funds are audited and distributed every 6 months, accompanied by publicly broadcast offline distribution video logs on ZEN.FLUX and independent student auditor verifications.'
  },
  {
    id: 'const-faq-6',
    category: 'Strict Data Integrity Law',
    articleRef: 'ARTICLE X & ARTICLE XI',
    question: 'What is the Strict Data Integrity Law and why does Zenvitra ban seeded accounts?',
    answer: 'Vanity metrics and bot armies distort democratic discourse. The Strict Data Integrity Law mandates that all accounts, conference passes, attendees, and follower graphs must originate from authentic human users and verified organizers. Seeded mock profiles and fake numbers are strictly prohibited.'
  },
  {
    id: 'const-faq-7',
    category: 'Test Node Security',
    articleRef: 'ARTICLE I & ARTICLE VIII',
    question: 'How does the Test Node sandbox protect authentic user identities and passports?',
    answer: 'Test Mode runs in an ephemeral sandbox under zen_test_pilot_node. When activated, the authentic user session, OAuth avatar, and Holographic Passport are encrypted in a secure local backup vault. Exiting via "Leave Test Mode" or closing the tab cleanly restores genuine credentials with zero profile thrashing.'
  },
  {
    id: 'const-faq-8',
    category: 'Amendment Lifecycle',
    articleRef: 'ARTICLE X (SECTION 10.04)',
    question: 'How can an accredited youth delegate formally petition for a constitutional amendment?',
    answer: 'A delegate must submit a verbatim redline diff via the Constitution Docket (#ZEN-AMD-YYYY-XXXX), gather co-sponsorship from 50 delegates or 5 Secretariats, complete 14 days of open public review on ZEN.PULSE, debate across 25 assemblies, and achieve a 60% (Category A) or 75% (Category B) supermajority roll-call vote.'
  }
];

