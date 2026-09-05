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
    title: 'THE 25% PROFIT CIVIC ENDOWMENT & RADICAL ACCOUNTABILITY PROTOCOL',
    badge: '25% PROFIT ENDOWMENT',
    badgeColor: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
    summary: 'Hardcodes an unalterable 25.0% profit covenant dedicated to student scholarships, educational kits, and rural school labs—executed on a strict 4-month distribution cadence with transparent receipts and offline distribution videos broadcast across ZEN.FLUX and social platforms.',
    sections: [
      {
        sectionNumber: 'Section 2.01',
        heading: 'The Mandatory 25.0% Net Profit Covenant',
        operationalTag: 'CONSTITUTIONAL COVENANT',
        content: [
          'A mandatory, non-negotiable twenty-five percent (25.0%) of all net platform profits generated across the ZENVITRA ecosystem—inclusive of memberships, summit passes, organizer licenses, and merchandise—shall be irreversibly partitioned into the Zenvitra Civic Endowment Vault.',
          'This capital is held in trust exclusively for educational welfare, grassroots school delegate sponsorships, study kits, and school technology infrastructure. This covenant is structurally unalterable by any founder directive, board vote, or corporate restructuring.'
        ],
        callout: 'The 25% Profit Invariant: Exactly 25% of every rupee and dollar of profit earned by ZENVITRA is returned directly to youth education, delegate scholarships, and underprivileged students.'
      },
      {
        sectionNumber: 'Section 2.02',
        heading: 'Triannual Cadence: Every 4 Months Distribution Mandate',
        operationalTag: 'TRIANNUAL CYCLE',
        content: [
          'The accounting, procurement, and physical distribution of the 25% profit endowment shall execute without exception every four (4) months across three annual trimesters:',
          '• Trimester 1 (Jan – Apr): Profit computation, procurement of supplies, and field giveaway distribution.',
          '• Trimester 2 (May – Aug): Mid-year youth summit delegate scholarships, computer lab dispatches, and student kit distribution.',
          '• Trimester 3 (Sep – Dec): Annual educational grant distribution, winter study materials, and annual transparent reconciliation.',
          'No endowment funds may be rolled over or deferred beyond its designated 4-month distribution cycle.'
        ],
        callout: 'Strict 4-Month Clock: Every 120 days, 25% of profits must be fully converted into physical supplies, scholarships, or infrastructure and placed directly into students\' hands.'
      },
      {
        sectionNumber: 'Section 2.03',
        heading: 'Radical Accountability: Offline Videos, Public Receipts & ZEN.FLUX Broadcast',
        operationalTag: 'RADICAL TRANSPARENCY',
        content: [
          'To ensure absolute zero-corruption accountability, every 4-month distribution cycle must provide immutable, multi-channel public proof before the next cycle begins:',
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
          'Any citizen, campus ambassador, or educator can inspect the live ledgers and participate in each 4-month distribution cycle:'
        ],
        howToUseProperly: {
          title: '4-MONTH DISTRIBUTION AUDIT PROTOCOL',
          steps: [
            'Nominate Beneficiaries: Submit rural schools, youth centers, or student delegates in need of kits or conference sponsorship via /donate/govt-schools.',
            'Field Verification: Local ambassadors verify infrastructural readiness and student rolls.',
            'Watch Offline Giveaway on ZEN.FLUX & Socials: Watch the live proof-of-work video dispatches showing the physical supplies being handed over every 4 months.',
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
    title: 'THE ASSEMBLY OS (ZEN.EVENTS) & RULES OF PROCEDURE',
    badge: 'PARLIAMENTARY RULES',
    badgeColor: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
    summary: 'Codifies the parliamentary rules of procedure for Model UNs, youth summits, roll-call voting, caucus debate, points of order, and the 60-second guillotine relay.',
    sections: [
      {
        sectionNumber: 'Section 4.01',
        heading: 'Universal Floor Standing & Democratic Access',
        operationalTag: 'DEMOCRATIC RIGHT',
        content: [
          'Every registered delegate, regardless of high school or university prestige, economic tier, or regional background, holds equal constitutional standing in the Zenvitra Assembly OS.',
          'Gatekeeping by established delegations, favoritism by dais chairs, or backroom collusion to exclude smaller delegations is unparliamentary and subject to immediate review by the Secretariat.'
        ]
      },
      {
        sectionNumber: 'Section 4.02',
        heading: 'Parliamentary Rules of Procedure (Assembly OS)',
        operationalTag: 'RULES OF PROCEDURE',
        content: [
          'All official Model UN simulations and youth assemblies governed by Zenvitra must operate under the standardized Assembly OS rules:',
          '1. Roll-Call Attendance: Delegates must declare "Present" or "Present and Voting". Delegates who declare "Present and Voting" forfeit the right to abstain on substantive resolution votes.',
          '2. General Speaker\'s List (GSL): Governs formal debate. Speaking time is fixed by a majority procedural motion (typically 60 to 90 seconds).',
          '3. Moderated Caucus: Time-boxed debate on a specific sub-topic (e.g., "15 minutes, 45 seconds individual speaking time on Renewable Technology Transfer").',
          '4. Unmoderated Caucus: Informal lobbying session where delegates move freely to negotiate working papers and draft resolution blocs.',
          '5. Points & Motions Priority Hierarchy: Point of Order (procedural infraction) > Point of Personal Privilege (audibility/comfort) > Point of Parliamentary Inquiry (rules query) > Motions to Caucus.'
        ]
      },
      {
        sectionNumber: 'Section 4.03',
        heading: 'The 60-Second Guillotine Speech Relay & Speaker Queue',
        operationalTag: 'SPEECH REGULATION',
        content: [
          'To eliminate grandstanding, repetitive filibusters, and elitist domination, plenary floor relays operate under the 60-Second Guillotine Standard.',
          'Floor microphones are strictly regulated by the Assembly OS timer. At 00:00, the audio feed automatically cuts off with zero administrative override. Delegates must yield their remaining time: (a) to the Chair, (b) to Points of Information, or (c) to another accredited delegate.'
        ],
        callout: 'The Guillotine Rule: 60 seconds forces clarity of intellect. If you cannot articulate your policy thesis in one minute, you do not understand it.'
      },
      {
        sectionNumber: 'Section 4.04',
        heading: 'Operational Protocol: How to Operate as an Effective Delegate',
        operationalTag: 'OPERATOR MANUAL',
        content: [
          'Step-by-step delegate execution inside live committee sessions:'
        ],
        howToUseProperly: {
          title: 'DELEGATE OPERATIONAL PLAYBOOK',
          steps: [
            'Joining the Floor: Access /events and enter your designated Committee Chamber. Verify your assigned country/portfolio credential on the screen.',
            'Setting the Agenda: Move a procedural motion: "The Delegation of [Nation] moves to set the agenda to Topic A, with a 60-second speaking time."',
            'Requesting the Floor: Tap [Request to Speak]. The Assembly OS queues your delegate avatar in real-time. When recognized, deliver your speech before the 60s timer expires.',
            'Raising a Point of Order: If the dais skips procedural voting, click [Raise Point of Order] to alert the Event Moderator immediately.',
            'Substantive Voting: When the Chair calls for final resolution voting, cast your vote (Yes / No / Abstain). A 2/3 supermajority is required for treaty adoption.'
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
        heading: 'Operational Protocol: How to Draft & Table a Resolution',
        operationalTag: 'OPERATOR MANUAL',
        content: [
          'Step-by-step workflow for drafting, redlining, and ratifying youth treaties:'
        ],
        howToUseProperly: {
          title: 'RESOLUTION DRAFTING & REDLINING PROCEDURE',
          steps: [
            'Create Working Paper: Navigate to /solutions > [Draft Policy Accord]. Select your committee and declare your preambular clauses.',
            'Draft Operative Clauses: Use active diplomatic verbs (Calls upon, Mandates, Establishes, Recommends). Embed Tier-1 citations for all funding or legal mechanisms.',
            'Gather Signatories: Share the Live Diff Link with peer delegations in ZenChat. Once the 20% signatory threshold is met, submit to the Dais for review.',
            'Debate Redlines: When an unfriendly amendment is proposed, examine the diff view in the caucus chamber and cast your roll-call vote on the specific line-item.',
            'Ratification & Archival: Upon achieving a 2/3 supermajority, the resolution is permanently archived into the Zenvitra Sovereign Codex with cryptographic hash verification.'
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
            'Export Credential: Click [Export Sovereign Dossier] to generate a tamper-proof PDF CV complete with cryptographic verification QR code for university and scholarship applications.'
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
          'The following three foundational provisions constitute the Zenvitra Genesis Lock and are declared eternal, unalterable, and immune to repeal under any circumstances:',
          '1. The Zero-Surveillance and Anti-Behavioral Advertising Mandate (Article I, Section 1.01).',
          '2. The Mandatory 25.0% Net Profit Civic Endowment for Rural Public Schools & Scholarships (Article II, Section 2.01).',
          '3. The Strict Secular Demarcation and Non-Sectarian Civic Standard (Article IX, Section 9.01).',
          'Any amendment, legislative motion, or board vote attempting to dilute, lower, or abolish these three pillars is constitutionally void ab initio.'
        ],
        callout: 'The Genesis Lock: These three cornerstones can NEVER be repealed or reduced, by anyone, at any time, for any reason.'
      },
      {
        sectionNumber: 'Section 10.04',
        heading: 'Amendment Procedure for Operational Articles',
        operationalTag: 'FORMAL AMENDMENT PROCEDURE',
        content: [
          'Operational articles (Articles III through VIII, Article XI, and non-Genesis provisions) may only be amended through the formal Article VII petition mechanism:',
          '1. Petition Initiation: A formal amendment petition must be tabled via the [Request Amendment] docket with a specific redline text and empirical justification.',
          '2. Plenary Quorum: The petition must be formally debated across at least twenty-five (25) accredited youth assemblies or summits.',
          '3. Supermajority Threshold: Requires a 75.0% supermajority roll-call vote of all active accredited delegates.',
          '4. Executive Attestation: Ratification by the Founder Council (@yuveer, Secretariat, and Civic Escrow Auditors).'
        ]
      },
      {
        sectionNumber: 'Section 10.05',
        heading: 'Operational Protocol: How to Formally Petition an Amendment',
        operationalTag: 'OPERATOR MANUAL',
        content: [
          'Follow the constitutional procedure to table a redline petition:'
        ],
        howToUseProperly: {
          title: 'CONSTITUTIONAL AMENDMENT PETITION WORKFLOW',
          steps: [
            'Click Request Amendment: Click the [Request Amendment] button in the Constitution sidebar or mobile toolbar.',
            'Select Operational Article: Choose the target Article and Section (ensure it does not violate the Genesis Lock).',
            'Draft Precise Redline: Write the exact statutory text modification, addition, or clarification.',
            'Attach Empirical Citations: Cite at least one primary source or precedent justifying the operational necessity.',
            'Submit to Plenary Docket: Once submitted, your petition receives a formal Docket ID (e.g. #ZEN-AMD-2026-XXXX) and is dispatched to all assemblies for caucus debate.'
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
  }
];
