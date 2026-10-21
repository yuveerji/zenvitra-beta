// ─── ZENVITRA LEGAL & DATA GOVERNANCE SYSTEM ───
// Built to comply with:
// - Digital Personal Data Protection Act, 2023 (DPDPA)
// - MeitY Digital Personal Data Protection Rules, 2025
// - Information Technology Rules, 2021 (as amended through February 2026)

export interface LegalSubsection {
  number: string;
  heading: string;
  paragraphs: string[];
}

export interface LegalClause {
  id: string;
  title: string;
  subsections: LegalSubsection[];
  badge?: string;
  tag?: string;
}

export interface LegalPart {
  partNumber: string;
  partTitle: string;
  clauses: LegalClause[];
}

export interface LegalSection {
  id: string;
  sectionNumber: string;
  title: string;
  subsections: LegalSubsection[];
}

// ─── DATA TRANSPARENCY EXPLAINER (WHY AM I SEEING THIS?) ───
export interface DataLifecycleExplainer {
  id: string;
  title: string;
  product: string;
  icon: string;
  purpose: string;
  permission: string;
  access: string;
  security: string;
  retention: string;
  deletion: string;
  legalBasis: string;
}

export const DATA_LIFECYCLE_EXPLAINERS: DataLifecycleExplainer[] = [
  {
    id: 'mun-attendance-scoring',
    title: 'ZEN.MUN Committee Records & Scoring',
    product: 'ZEN.MUN',
    icon: 'Gavel',
    purpose: 'Maintain procedural committee roll-calls, speeches, motions, and facilitate Executive Board delegate scoring and award decisions.',
    permission: 'Granted upon conference registration and committee check-in.',
    access: 'Assigned Committee Chair and authorized Conference Secretariat only. Other delegates do not see internal scores unless awards are published.',
    security: 'Encrypted storage with role-based access control (RBAC); Chair cannot access unrelated committees.',
    retention: 'Retained for academic verification, dispute resolution, and verifiable delegate certification.',
    deletion: 'Delegate profile participation link can be unlisted or pseudonymized upon verified account closure.',
    legalBasis: 'Performance of contract (Conference Participation) & legitimate event administration under DPDP Rules, 2025.'
  },
  {
    id: 'docs-collaborative-editing',
    title: 'ZEN.DOCS Real-Time Collaboration',
    product: 'ZEN.DOCS',
    icon: 'FileText',
    purpose: 'Store text, version history, suggestions, and synchronize multi-user editing in resolutions, working papers, and notes.',
    permission: 'Controlled directly by document owner (Viewer, Commenter, Editor, Co-Author).',
    access: 'Explicitly shared users and organization workspace administrators where applicable.',
    security: 'End-to-end TLS 1.3 transit encryption, AES-256 rest encryption, and cryptographic version hashing.',
    retention: 'Stored until deleted by document owner or purged under workspace retention schedules.',
    deletion: 'Deleting a document removes it from active drives; multi-author legislative bills retain collaborative contributions without personal identity linkage.',
    legalBasis: 'User consent and contract execution.'
  },
  {
    id: 'press-editorial-submissions',
    title: 'International Press Editorial Workflow',
    product: 'Press',
    icon: 'Newspaper',
    purpose: 'Facilitate author submission, peer review, editor fact-checking, and permanent public archiving of verified investigative dispatches.',
    permission: 'Submitted voluntarily through the Author Studio.',
    access: 'Editorial desk during review; published material becomes public and indexed globally.',
    security: 'Cryptographic author signature and timestamped immutable editorial logs.',
    retention: 'Archived permanently for historical, public record, and journalistic integrity.',
    deletion: 'Account closure can pseudonymize author attribution; published journalistic records remain archived under freedom of expression and archival legal standards.',
    legalBasis: 'Legitimate journalistic, educational, and public-interest publishing under IT Rules, 2021/2026.'
  },
  {
    id: 'payments-reconciliation',
    title: 'ZEN.PAYMENTS & Tax Invoices',
    product: 'ZEN.PAYMENTS',
    icon: 'CreditCard',
    purpose: 'Process membership subscriptions, conference passes, and calculate student tax exemption (flat ₹9 platform fee; ₹5 for Pulse Pass, ₹0 for Pulse Elite) or tiered GST (5% / 12%).',
    permission: 'Required to execute a paid transaction.',
    access: 'ZENVITRA Financial Ledger, verified payment gateway tokenization, and statutory tax auditing.',
    security: 'PCI-DSS certified gateway tokenization; complete card numbers are never stored on ZENVITRA servers.',
    retention: 'Retained for statutory fiscal periods (8 years as required by Indian taxation and accounting law).',
    deletion: 'Financial ledger records cannot be prematurely erased prior to statutory limitation periods.',
    legalBasis: 'Legal obligation (Tax Compliance) and Contractual Performance.'
  },
  {
    id: 'flux-video-transcoding',
    title: 'ZEN.FLUX Vertical Video Pipeline',
    product: 'ZEN.FLUX',
    icon: 'Film',
    purpose: 'Transcode, stream, and deliver 9:16 vertical video dispatches, captions, and creator reels.',
    permission: 'Granted upon creator upload and publication.',
    access: 'Public viewers, followers, or unlisted link recipients depending on video privacy settings.',
    security: 'HLS adaptive bitrate streaming, automated moderation scanning, and CDN edge encryption.',
    retention: 'Retained until deleted by the creator.',
    deletion: 'Deleting a reel purges source media from object storage and purges edge CDN caches.',
    legalBasis: 'Consent and Content License to operate the Service.'
  },
  {
    id: 'zen-ai-assistance',
    title: 'ZEN AI Context Boundaries & Queries',
    product: 'ZEN AI',
    icon: 'Bot',
    purpose: 'Provide contextual summarization, research assistance, and document drafting.',
    permission: 'Invoked intentionally by the user per prompt or workspace trigger.',
    access: 'Transient inference session only. Bounded strictly to the document or query you authorize.',
    security: 'Zero training on private user documents without explicit opt-in; strict role-based context barrier.',
    retention: 'Chat prompts stored in ephemeral user session; not used to train global public foundational weights.',
    deletion: 'AI query history can be purged at any time from Settings > Privacy & Security.',
    legalBasis: 'Consent and User-Initiated Service Execution.'
  },
  {
    id: 'zen-space-modular-hubs',
    title: 'ZEN.SPACE Sovereign Bio-Hubs & Form Ledgers',
    product: 'ZEN.SPACE',
    icon: 'Globe',
    purpose: 'Host decentralized, customizable sovereign link-in-bio portals, stream audio previews, showcase multimedia reels, and collect encrypted interactive form responses.',
    permission: 'Configured and published voluntarily by the Space owner.',
    access: 'Public visitors can view links and submit inquiry forms. Only the verified Space owner and designated webhook endpoints can access response records.',
    security: 'Encrypted webhook dispatch, SSL/TLS transport security, zero third-party cross-site advertising trackers.',
    retention: 'Maintained until edited or deleted by the Space owner in their dashboard.',
    deletion: 'Deleting blocks or resetting the Space immediately removes public records and stops webhook routing.',
    legalBasis: 'Performance of contract, user consent, and legitimate civic communication under DPDP Rules, 2025.'
  },
  {
    id: 'zen-call-encrypted-chambers',
    title: 'ZEN.CALL Real-Time Audiovisual Chambers',
    product: 'ZEN.CALL',
    icon: 'Video',
    purpose: 'Facilitate low-latency peer-to-peer audio, video, and screen-sharing sessions for diplomacy, MUN caucuses, and sovereign bilateral meetings.',
    permission: 'Initiated voluntarily upon joining an authorized chamber room.',
    access: 'Active chamber participants only. Zero eavesdropping or unlisted guest entry.',
    security: 'DTLS-SRTP end-to-end media encryption; ephemeral signaling nodes.',
    retention: 'Zero persistent storage of audio/video streams. In-meeting chat and signaling states evaporate upon room termination.',
    deletion: 'Instantaneous destruction upon last participant departure.',
    legalBasis: 'User consent and Contractual Service Execution.'
  },
  {
    id: 'zenmun-conference-os',
    title: 'ZEN.MUN Conference Command Centre & Secretariat OS',
    product: 'ZEN.MUN',
    icon: 'Gavel',
    purpose: 'Operate comprehensive Model UN conference management including multi-tier Secretariat RBAC (Secretary-General, DG, USG, Dais Chairs, Rapporteurs, Finance, Press, IT), real-time delegate check-in, dynamic roll call ledgers, digital chits with Dais moderation, speaker timing, parliamentary voting, and emergency protocol broadcasts.',
    permission: 'Granted by Secretariat appointment, event organization registration, or delegate credentialing.',
    access: 'Role-scoped access: Dais officers access assigned committee chambers; Secretariats access global operations; delegates access personal portfolio chits and public chamber screens.',
    security: 'Multi-tenant cryptographic access barriers, role-based access control (RBAC), immutable session logging, and zero unauthorized cross-committee leakage.',
    retention: 'Operational committee records, voting tallies, and passed resolutions retained for academic certification and historical auditability.',
    deletion: 'Private draft chits and temporary Dais queues are purged upon session conclusion; public resolutions remain in permanent civic archives.',
    legalBasis: 'Performance of contract (Conference Administration) and legitimate event governance.'
  },
  {
    id: 'zenpassport-founding-edition',
    title: 'ZEN.PASSPORT Founding Edition & Pre-Registration Credentials',
    product: 'ZEN.PASSPORT',
    icon: 'ShieldCheck',
    purpose: 'Issue unique Founding Member credentials, priority platform access keys, verified preregistration IDs, and holographic civic identity tokens to early community participants.',
    permission: 'Granted upon voluntary user preregistration prior to public launch.',
    access: 'The verified user and public verification scanners via cryptographic QR lookup.',
    security: 'HMAC-SHA256 signature verification, tamper-evident cryptographic badge identifiers, and zero third-party data broker sharing.',
    retention: 'Maintained as an immutable founding badge linked permanently to the sovereign profile.',
    deletion: 'Full profile erasure revokes the passport and cryptographic verification key upon account closure.',
    legalBasis: 'User consent and Contractual Service Execution.'
  },
  {
    id: 'cashfree-ticketing-escrow',
    title: 'ZEN.PAYMENTS & Cashfree Gateway Integration',
    product: 'ZEN.PAYMENTS',
    icon: 'CreditCard',
    purpose: 'Process conference registrations, delegate pass ticketing, and subscription plans via Cashfree Payment Gateway (PG API 2025-01-01), supporting UPI QR, credit/debit cards, and netbanking with automated webhook order reconciliation, tax invoicing, and dispute mitigation.',
    permission: 'Required upon initiating an event registration or subscription checkout.',
    access: 'Authorized ZENVITRA financial services ledger, Cashfree PCI-DSS certified gateway, and user invoice records.',
    security: 'End-to-end TLS 1.3 transit encryption, PCI-DSS Level 1 compliant gateway tokenization; complete card numbers and CVVs are NEVER stored on ZENVITRA servers; webhook signature verification with raw body payload validation.',
    retention: 'Retained for 8 statutory fiscal years in compliance with statutory taxation and accounting laws.',
    deletion: 'User-facing receipt history may be archived upon account closure, while core fiscal audit ledgers are retained in accordance with statutory accounting obligations.',
    legalBasis: 'Legal obligation (Tax Compliance) and Performance of Contract.'
  },
  {
    id: 'solutions-un-docs',
    title: 'ZEN.SOLUTIONS & Treaty/Resolution Drafting Engine',
    product: 'ZEN.SOLUTIONS',
    icon: 'FileText',
    purpose: 'Provide collaborative drafting for Model UN draft resolutions, Lok Sabha bills, working papers, and press releases with formal preambulatory/operative clauses, sponsor/signatory management, line-by-line redline diff tracking, and formatted export to official UN/parliamentary formats.',
    permission: 'Controlled by document author and committee Dais (Co-Author, Signatory, Reviewer).',
    access: 'Assigned committee co-sponsors, committee dais officers, and public viewing upon formal introduction to the floor.',
    security: 'Version-controlled redline diff audit trails, cryptographic commit hashing, and collaborative conflict resolution.',
    retention: 'Maintained indefinitely in the civic document repository once formally tabled or passed by a committee.',
    deletion: 'Unintroduced working drafts can be deleted by authors at any time; formally passed resolutions are archived as historical parliamentary records.',
    legalBasis: 'User consent, academic freedom, and legitimate legislative collaboration.'
  },
  {
    id: 'zero-seeded-data-integrity',
    title: 'Strict Data Integrity Law & Zero-Seeded Data Guarantee',
    product: 'PLATFORM CORE',
    icon: 'Lock',
    purpose: 'Guarantee that all user accounts, event metrics, conference statistics, pass pricing, attendee lists, follower graphs, and committee portfolios are 100% authentic, user-configured, and verified—strictly prohibiting synthetic, mock, or fake accounts/metrics.',
    permission: 'Core system invariant governing all platform microservices and state providers.',
    access: 'Universal standard enforced platform-wide across all users, organizers, and administrative consoles.',
    security: 'Continuous automated integrity assertions, zero hardcoded seed fixtures in production builds, and clean state provider defaults.',
    retention: 'Applied universally across all data models and database collections.',
    deletion: 'Any artificially generated or non-human mock entity detected is purged immediately by automated governance routines.',
    legalBasis: 'Constitutional Charter Invariant, consumer protection, and truth in platform advertising under IT Rules, 2021/2026.'
  },
  {
    id: 'solutions-drafting-studio-privacy',
    title: 'ZEN.SOLUTIONS Drafting Studio & Document Extraction',
    product: 'ZEN.SOLUTIONS',
    icon: 'Sparkles',
    purpose: 'Analyze, extract, and convert uploaded legislative blueprints, PDFs, DOCX, TXT, and Markdown files into structured chapters, clauses, tables, and graphs with leftover segment validation.',
    permission: 'Initiated voluntarily by the user during file upload or ZEN.DOCS document import.',
    access: 'Strictly restricted to the author until published or explicitly shared with committee co-sponsors.',
    security: 'Ephemeral server-side parsing with zero model training; memory extraction with immediate cleanup; optional original document download permissions governed exclusively by the author.',
    retention: 'Uploaded document metadata and original text are retained in association with the solution document only if the author chooses to publish or save the draft.',
    deletion: 'Drafts can be deleted from local storage or cloud workspace at any time; original attached files can be purged or replaced within the statutory 2-edit limit.',
    legalBasis: 'Performance of contract, user consent, and legitimate educational/legislative drafting under DPDP Rules, 2025.'
  },
  {
    id: 'test-node-session-sandboxing',
    title: 'Test Node Sandbox & Session Isolation',
    product: 'PLATFORM CORE',
    icon: 'Shield',
    purpose: 'Enable risk-free testing, UI auditing, and developer exploration without compromising, modifying, or thrashing authentic user accounts, avatars, or Sovereign Passports.',
    permission: 'Initiated when a user clicks Continue as Test User or navigates to /test-login.',
    access: 'Ephemeral isolated session sandbox; authentic user profile tokens are securely backed up in an isolated storage envelope and never exposed to the test environment.',
    security: 'Automatic session restoration upon leaving test mode or tab closure; zero test data leakage into global database collections.',
    retention: 'Transient browser session only (sessionStorage-backed); wiped cleanly upon session termination.',
    deletion: 'Instantaneous cleanup on tab unload or clicking "Leave Test Mode".',
    legalBasis: 'Legitimate platform testing and user privacy preservation.'
  }
];

// ─── PART II: ZENVITRA PRIVACY POLICY (73 CLAUSES ACROSS 22 PARTS) ───
export const privacyPolicyParts: LegalPart[] = [
  {
    partNumber: 'PART I',
    partTitle: 'GENERAL PROVISIONS',
    clauses: [
      {
        id: '1',
        title: '1. PURPOSE AND SCOPE',
        subsections: [
          {
            number: '1.1',
            heading: 'Purpose',
            paragraphs: [
              'This Privacy Policy explains how [LEGAL ENTITY NAME], operating under the brand ZENVITRA, collects, receives, generates, uses, stores, protects, discloses, transfers, and otherwise processes personal data in connection with ZENVITRA.',
              'The purpose of this Policy is to provide users with a clear understanding of: what information ZENVITRA processes; why that information is processed; how different ZENVITRA products use information; who may receive information; how long information may be retained; what choices and rights users may have; how ZENVITRA protects information; and how users can contact ZENVITRA regarding privacy matters.'
            ]
          },
          {
            number: '1.2',
            heading: 'Services Covered',
            paragraphs: [
              'This Policy applies, as applicable, to: ZENVITRA websites; ZENVITRA mobile applications; ZEN.CHAT; ZEN.PULSE; ZEN.FLUX; ZENVITRA International Press; ZEN.EVENTS; ZEN.MUN; ZEN.MUN Committee; ZEN.DOCS; ZEN.LEGISLATE; ZEN.PAYMENTS; ZEN.PROFILE; ZEN.CERTIFY; ZEN AI; professional accounts; organization workspaces; organizer dashboards; conference management systems; APIs and integrations; and other services subsequently introduced by ZENVITRA.'
            ]
          },
          {
            number: '1.3',
            heading: 'Product-Specific Processing',
            paragraphs: [
              'Not every category of information described in this Policy is collected from every user.',
              'The information ZENVITRA processes depends upon the products, features, permissions, events, organizations, conferences, subscriptions, and interactions that you choose to use.'
            ]
          }
        ]
      },
      {
        id: '2',
        title: '2. DATA CONTROLLER / DATA FIDUCIARY',
        subsections: [
          {
            number: '2.1',
            heading: 'Responsible Entity',
            paragraphs: [
              'The entity responsible for determining the purposes and means of processing personal data will be:\n[LEGAL ENTITY NAME]\nBrand: ZENVITRA\nRegistered Office: [ADDRESS]\nPrivacy Contact: privacy@zenvitra.xyz\nGrievance Contact: grievance@zenvitra.xyz',
              'The exact legal role of ZENVITRA in relation to particular data may differ depending upon the Service. For example, ZENVITRA may process information as the primary service provider for a user\'s account while an independent MUN organizer may independently determine how participant information is used for that organizer\'s event.'
            ]
          },
          {
            number: '2.2',
            heading: 'Event Organizers',
            paragraphs: [
              'Where an independent organizer uses ZENVITRA to operate an event, that organizer may determine certain purposes of processing participant information. In such circumstances, the organizer may be separately responsible for certain processing activities, while ZENVITRA may provide the technical infrastructure required to perform them.'
            ]
          }
        ]
      },
      {
        id: '3',
        title: '3. DEFINITIONS',
        subsections: [
          {
            number: '3.1',
            heading: 'Personal Data',
            paragraphs: ['“Personal Data” means information relating to an identified or identifiable individual, to the extent such information is treated as personal data under applicable law.']
          },
          {
            number: '3.2',
            heading: 'Processing',
            paragraphs: ['“Processing” includes collecting, recording, organizing, storing, modifying, retrieving, using, analyzing, transmitting, sharing, publishing, restricting, deleting, or otherwise handling personal data.']
          },
          {
            number: '3.3',
            heading: 'User',
            paragraphs: ['“User”, “you”, or “your” means an individual accessing or using ZENVITRA.']
          },
          {
            number: '3.4',
            heading: 'Services',
            paragraphs: ['“Services” means the products, applications, websites, tools, systems, APIs, infrastructure, and features provided by ZENVITRA.']
          }
        ]
      }
    ]
  },
  {
    partNumber: 'PART II',
    partTitle: 'INFORMATION ZENVITRA COLLECTS',
    clauses: [
      {
        id: '4',
        title: '4. INFORMATION YOU DIRECTLY PROVIDE',
        subsections: [
          {
            number: '4.1',
            heading: 'Account Registration',
            paragraphs: [
              'When you create a ZENVITRA account, we may collect information necessary to establish and maintain that account.',
              'Depending on the registration method and features used, this may include: full name; username; email address; telephone number; password or authentication information; date of birth or age information; profile photograph; language; country or region; account preferences; and other registration information.'
            ]
          },
          {
            number: '4.2',
            heading: 'Profile Information',
            paragraphs: [
              'You may voluntarily add information to your ZEN.PROFILE, including: biography; education; professional information; skills; interests; portfolio information; links; social accounts; achievements; MUN participation; event participation; publications; certificates; and other information you choose to display.',
              'You control certain visibility settings. Information deliberately marked public may be accessible to other users or the public.'
            ]
          }
        ]
      },
      {
        id: '5',
        title: '5. INFORMATION CREATED THROUGH YOUR USE OF ZENVITRA',
        subsections: [
          {
            number: '5.1',
            heading: 'Activity Information',
            paragraphs: [
              'When you use ZENVITRA, systems may generate records associated with your activity, including: login records; feature usage; interactions; preferences; content activity; account settings; security events; notifications; searches; participation records; document activity; event activity; and other operational information.'
            ]
          },
          {
            number: '5.2',
            heading: 'Why This Information Exists',
            paragraphs: [
              'Such information may be necessary to: provide functionality; maintain account state; improve performance; troubleshoot errors; protect accounts; prevent abuse; provide analytics; maintain records; and comply with legal obligations.'
            ]
          }
        ]
      },
      {
        id: '6',
        title: '6. DEVICE AND TECHNICAL INFORMATION',
        subsections: [
          {
            number: '6.1',
            heading: 'Automatically Collected Information',
            paragraphs: [
              'When you access ZENVITRA, we may automatically receive technical information such as: IP address; device type; operating system; browser; application version; device identifiers where appropriately used; language settings; time zone; network information; approximate location derived from technical information; access timestamps; referring pages; crash information; performance information; and security-related events.'
            ]
          },
          {
            number: '6.2',
            heading: 'Security Purpose',
            paragraphs: [
              'Technical information may be used to identify suspicious login attempts, automated abuse, unusual activity, compromised accounts, malicious traffic, and other security threats.'
            ]
          }
        ]
      },
      {
        id: '7',
        title: '7. LOCATION INFORMATION',
        subsections: [
          {
            number: '7.1',
            heading: 'Voluntary Location',
            paragraphs: ['ZENVITRA may allow users to voluntarily provide location information through their profile, event registration, event discovery, or other features.']
          },
          {
            number: '7.2',
            heading: 'Device Location',
            paragraphs: ['Where a feature requires device location and you provide the relevant permission, ZENVITRA may process location information necessary to provide that feature.']
          },
          {
            number: '7.3',
            heading: 'Location Controls',
            paragraphs: ['You may be able to disable device-location permissions through your device settings. Disabling location access may cause certain location-dependent features to stop working.']
          },
          {
            number: '7.4',
            heading: 'Approximate Location',
            paragraphs: ['ZENVITRA may sometimes infer an approximate geographic region from technical information such as an IP address for security, localization, analytics, or service functionality. This should not be treated as precise physical-location information.']
          }
        ]
      },
      {
        id: '8',
        title: '8. COOKIES AND SIMILAR TECHNOLOGIES',
        subsections: [
          {
            number: '8.1',
            heading: 'Use of Cookies',
            paragraphs: ['ZENVITRA may use cookies and similar technologies to maintain login sessions, remember preferences, secure accounts, maintain registration sessions, measure service performance, understand feature usage, prevent fraud, and improve the user experience.']
          },
          {
            number: '8.2',
            heading: 'Essential Technologies',
            paragraphs: ['Certain technologies may be necessary for the Service to function. Disabling essential technologies may prevent portions of ZENVITRA from operating correctly.']
          },
          {
            number: '8.3',
            heading: 'Analytics Technologies',
            paragraphs: ['Where used, analytics technologies may help ZENVITRA understand how users interact with features without necessarily requiring ZENVITRA to identify every individual interaction personally.']
          },
          {
            number: '8.4',
            heading: 'Cookie Choices',
            paragraphs: ['Where legally required, ZENVITRA will provide appropriate controls for non-essential cookies or similar technologies.']
          }
        ]
      }
    ]
  },
  {
    partNumber: 'PART III',
    partTitle: 'PRODUCT-SPECIFIC DATA',
    clauses: [
      {
        id: '9',
        title: '9. ZEN.CHAT',
        subsections: [
          { number: '9.1', heading: 'Messages', paragraphs: ['When you use ZEN.CHAT, ZENVITRA may process information necessary to transmit, store, synchronize, deliver, secure, and display your messages.'] },
          { number: '9.2', heading: 'Message Metadata', paragraphs: ['Metadata may include: sender; recipient; group; timestamps; delivery status; read status; attachments; message identifiers; and security or abuse signals.'] },
          { number: '9.3', heading: 'Private Communications', paragraphs: ['ZENVITRA does not treat ordinary private messages as publicly published Content. Communications may be processed by systems and authorized personnel where reasonably necessary for delivery, security, abuse prevention, fraud prevention, technical support, legal compliance, or enforcement of applicable policies.'] },
          { number: '9.4', heading: 'Reports', paragraphs: ['If a user reports a message or conversation, relevant information may be reviewed to investigate the report.'] }
        ]
      },
      {
        id: '10',
        title: '10. ZEN.PULSE',
        subsections: [
          { number: '10.1', heading: 'Posts', paragraphs: ['ZEN.PULSE may process posts, captions, images, videos, comments, reactions, shares, bookmarks, mentions, hashtags, publication information, and associated metadata.'] },
          { number: '10.2', heading: 'Visibility', paragraphs: ['Depending on settings, Content may be private, visible to approved followers, visible to an organization, visible to an event, unlisted, or public.'] },
          { number: '10.3', heading: 'Public Posts', paragraphs: ['Public posts may be accessible outside ZENVITRA and may be indexed by search engines or shared by other users. Treat deliberately public Content as information that may travel beyond the interface.'] },
          {
            number: '10.4',
            heading: 'Music & Third-Party Audio Credits',
            paragraphs: [
              'All musical recordings, audio streams, and artist metadata featured across Zenvitra Pulse, Stories, Notes, and Events are the intellectual property of their respective original artists, copyright holders, and record labels. Music indexing and playback functionality utilizes public APIs including ytmusic-api from GitHub for transformative preview and personal civic expression. Zenvitra does not claim ownership of proprietary musical compositions.',
              'Audio preview snippets are strictly constrained between 30 and 120 seconds. Zenvitra does not charge for, sell, or commercially distribute independent audio master files. Rights holders may file attribution inquiries or takedown requests to legal@zenvitra.xyz.'
            ]
          },
          {
            number: '10.5',
            heading: 'Custom Location Tagging & World Geocoding Privacy',
            paragraphs: [
              'When tagging custom places, cities, or diplomatic venues on Posts, Pulse dispatches, or Event notices, geocoding lookups query public OpenStreetMap / Nominatim servers through privacy-preserving client proxies.',
              'Zenvitra does not track, log, or broadcast granular real-time GPS coordinates. Only the coarse textual administrative label (e.g. city, landmark, or summit hall) voluntarily attached by the author is associated with the published post.'
            ]
          },
          {
            number: '10.6',
            heading: 'ZEN.SPACE Sovereign Link Hubs & Interactive Form Ledgers',
            paragraphs: [
              'ZEN.SPACE allows users and verified organizations to curate sovereign link hubs with customizable themes (including Linktree-style minimalist sand/cream themes and looping video backgrounds), audio previews, and interactive form blocks (expandable accordions, modals, or external redirects).',
              'Form submissions collected through a user’s space are securely routed to the space owner’s designated encrypted ledger or authorized webhook tab (e.g. Google Sheets integration). Zenvitra does not sell form submission entries, build advertising dossiers from visitor inquiries, or inject third-party surveillance pixels into sovereign spaces.'
            ]
          },
          {
            number: '10.7',
            heading: 'ZEN.CALL Real-Time Audiovisual Privacy',
            paragraphs: [
              'ZEN.CALL provides low-latency peer-to-peer audio, video, and screen-sharing communications for bilateral diplomatic dialogues, Model UN caucuses, and sovereign consultations.',
              'Media streams are transmitted via encrypted DTLS-SRTP protocols directly between session participants. Signaling server nodes are strictly ephemeral; meeting chat dispatches and active roster states are permanently erased when the room dissolves. Zenvitra enforces a strict zero-telemetry and zero-server-recording standard across private meeting rooms without verified participant opt-in.'
            ]
          }
        ]
      },
      {
        id: '11',
        title: '11. ZEN.FLUX',
        subsections: [
          { number: '11.1', heading: 'Video and Multimedia', paragraphs: ['ZEN.FLUX may process uploaded videos, audio, images, captions, comments, reactions, and associated technical metadata.'] },
          { number: '11.2', heading: 'Processing', paragraphs: ['Multimedia may be processed for storage, transcoding, delivery, search, moderation, accessibility, performance, recommendations, and security.'] },
          { number: '11.3', heading: 'Public Content', paragraphs: ['If you publish a Flux publicly, it may be viewed, shared, embedded, or otherwise accessed by other users depending on feature and visibility settings.'] }
        ]
      },
      {
        id: '12',
        title: '12. ZENVITRA INTERNATIONAL PRESS',
        subsections: [
          { number: '12.1', heading: 'Author Information', paragraphs: ['When you submit or publish journalism or editorial material, ZENVITRA may associate your submission with author name, profile, biography, publication history, photograph, publication date, and editorial status.'] },
          { number: '12.2', heading: 'Editorial Workflow', paragraphs: ['Articles pass through stages: Draft → Submission → Editorial Review → Revision → Approval → Publication. Editors and authorized personnel may access submissions during this process.'] },
          { number: '12.3', heading: 'Published Material', paragraphs: ['Once published, information associated with that publication may remain available for archival, historical, journalistic, legal, or editorial purposes even if the author account is subsequently closed, subject to applicable law.'] }
        ]
      },
      {
        id: '13',
        title: '13. ZEN.EVENTS',
        subsections: [
          { number: '13.1', heading: 'Event Registration', paragraphs: ['We collect information necessary to process registration: name; contact information; age eligibility; preferences; ticket category; event responses; participant category; organization; attendance information; and payment status.'] },
          { number: '13.2', heading: 'Organizer Access', paragraphs: ['Information required to operate an event is made available to the event organizer according to event configuration and applicable law.'] },
          { number: '13.3', heading: 'Event Communications', paragraphs: ['Organizers may send registration confirmations, schedule changes, venue information, committee information, event reminders, emergency announcements, and other communications.'] },
          { number: '13.4', heading: 'Attendance', paragraphs: ['ZEN.EVENTS may record check-in or attendance information through QR codes, digital passes, organizer confirmation, or registration records.'] }
        ]
      },
      {
        id: '14',
        title: '14. ZEN.MUN',
        subsections: [
          { number: '14.1', heading: 'Conference Registration', paragraphs: ['Processes participant name, contact info, institution, delegate category, committee preferences, portfolio preferences, delegation, application information, registration status, and payment status.'] },
          { number: '14.2', heading: 'Committee Allocation', paragraphs: ['Allocations consider stated preferences, organizer decisions, committee capacity, experience, delegation requirements, conflict rules, portfolio availability, and organizer criteria.'] },
          { number: '14.3', heading: 'Attendance Records', paragraphs: ['ZEN.MUN records Present, Present and Voting, Late, Absent, Excused, and organizer-defined attendance statuses.'] },
          { number: '14.4', heading: 'Participation Records', paragraphs: ['Records speeches, speaking time, General Speakers List participation, moderated caucus participation, unmoderated caucus participation, motions, points, POIs, votes, documents, amendments, directives, and committee actions.'] },
          { number: '14.5', heading: 'Purpose of Participation Records', paragraphs: ['Used to operate committees, maintain procedural records, calculate conference statistics, assist Executive Boards, support awards, generate reports, issue certificates, resolve procedural disputes, improve conference administration, and maintain legitimate event records.'] },
          { number: '14.6', heading: 'Organizer Visibility', paragraphs: ['Chairs receive information about their assigned committee without automatically receiving access to unrelated committees. Governed through role-based permissions.'] },
          { number: '14.7', heading: 'Conference Analytics', paragraphs: ['Organizers receive aggregated statistics: attendance, speeches, motions, POIs, caucuses, document submissions, votes, and committee activity.'] },
          { number: '14.8', heading: 'Individual Participation', paragraphs: ['Authorized personnel may view individual records where required for committee administration, scoring, awards, attendance, or dispute resolution.'] },
          { number: '14.9', heading: 'Scoring', paragraphs: ['Authorized Executive Board members may record scores relating to categories established by the conference.'] },
          { number: '14.10', heading: 'Awards', paragraphs: ['Award decisions are made by conference organizers or authorized Executive Board personnel. ZEN.MUN provides technical records to assist decisions but does not independently determine awards.'] },
          {
            number: '14.11',
            heading: 'Conference Secretariat Command Centre & Role-Based Access Control (RBAC)',
            paragraphs: [
              'ZEN.MUN Conference Control Centre provides a multi-role operational architecture (Secretary-General, Director-General, USG/Department Head, Committee Director/EB, Rapporteur, Finance, Press, and IT).',
              'Access to participant records, financial reconciliations, confidential diplomatic notes, and administrative controls is strictly partitioned according to assigned role scope. Technical teams and Rapporteurs have zero automatic access to confidential executive sessions or financial ledgers.'
            ]
          },
          {
            number: '14.12',
            heading: 'Digital Diplomatic Chits & Dais Oversight',
            paragraphs: [
              'During live committee sessions, delegates may exchange digital chits with fellow delegations or submit official procedural chits to the Dais.',
              'Chits are transmitted through secure internal channels and are logged in the committee session audit trail to allow the Dais to maintain parliamentary decorum and investigate harassment. Chits are never scanned for third-party commercial advertising or shared outside the conference ecosystem.'
            ]
          },
          {
            number: '14.13',
            heading: 'Emergency Protocol Broadcasts',
            paragraphs: [
              'Secretariats may issue prioritized emergency protocol broadcasts (Amber Operational Alerts or Red Emergency Broadcasts) to conference participants.',
              'When an emergency alert is triggered, notification delivery is logged with timestamp, issuing officer identity, priority tier, and delivery confirmation. Historical alerts are permanently archived in the conference incident log for safety audits and post-conference transparency.'
            ]
          },
          {
            number: '14.14',
            heading: 'Strict Data Integrity Law & Zero Seeded Accounts',
            paragraphs: [
              'In accordance with platform constitutional law, ZEN.MUN enforces a strict prohibition against seeded, synthetic, mock, or fake delegate accounts, committees, registrations, or financial totals.',
              'All conference statistics, attendee counts, portfolio matrix allocations, and revenue metrics originate exclusively from verified organizer configurations and authentic participant actions.'
            ]
          }
        ]
      },
      {
        id: '15',
        title: '15. ZEN.MUN — INDIAN PARLIAMENTARY DATA',
        subsections: [
          { number: '15.1', heading: 'Parliamentary Simulations', paragraphs: ['Where conferences operate Indian parliamentary simulations, ZEN.MUN processes member identity, political group, portfolio, speeches, motions, bills, amendments, voting, committee proceedings, and parliamentary documents.'] },
          { number: '15.2', heading: 'Legislative Records', paragraphs: ['Bills and amendments are associated with sponsors, co-sponsors, authors, committees, readings, votes, versions, and final outcomes.'] },
          { number: '15.3', heading: 'Simulation Status', paragraphs: ['Such records represent activity within a simulation unless expressly identified as an actual governmental or parliamentary proceeding.'] }
        ]
      },
      {
        id: '16',
        title: '16. ZEN.DOCS',
        subsections: [
          { number: '16.1', heading: 'Documents', paragraphs: ['Processes text, files, images, tables, comments, suggestions, document metadata, version history, collaborators, permissions, and publication status.'] },
          { number: '16.2', heading: 'Private Documents', paragraphs: ['Private documents are not publicly accessible. Technical systems and authorized personnel process information where reasonably necessary to provide storage, synchronization, security, abuse prevention, technical support, or law compliance.'] },
          { number: '16.3', heading: 'Shared Documents', paragraphs: ['When you share a document, collaborators can view, comment, edit, copy, download, or interact according to granted permissions.'] },
          { number: '16.4', heading: 'Organization Documents', paragraphs: ['Documents belonging to an organization workspace may be subject to organization-level administration and retention policies.'] }
        ]
      },
      {
        id: '17',
        title: '17. ZEN.LEGISLATE & ZEN.SOLUTIONS',
        subsections: [
          { number: '17.1', heading: 'Legislative & Resolution Documents', paragraphs: ['Processes draft resolutions, working papers, bills, preambulatory clauses, operative paragraphs, amendments, sponsors, co-sponsors, committee assignments, and parliamentary voting records.'] },
          { number: '17.2', heading: 'Version History & Redline Diffs', paragraphs: ['Retains granular line-by-line redline diff histories to enable co-sponsors and delegates to trace clause modifications and substantive amendments over time.'] },
          { number: '17.3', heading: 'Public Resolution Archives', paragraphs: ['Formally tabled and passed resolutions are archived in permanent civic registries and can be exported into standard United Nations or parliamentary formatting.'] }
        ]
      },
      {
        id: '18',
        title: '18. ZEN.PAYMENTS & CASHFREE GATEWAY',
        subsections: [
          { number: '18.1', heading: 'Payment Transactions', paragraphs: ['Processes transaction identifiers, payment status, amount, currency, payment method type, billing info, refund status, subscription info, and fraud-prevention records.'] },
          { number: '18.2', heading: 'Card & UPI Information', paragraphs: ['Payment processing is executed via Cashfree Payments (PG API 2025-01-01) under RBI tokenization regulations. ZENVITRA does not receive, process, or store raw card numbers, CVVs, or bank account credentials on its servers.'] },
          { number: '18.3', heading: 'Financial Records & Statutory Retention', paragraphs: ['Transaction records and tax invoices are retained for statutory accounting and audit periods (8 years as required by Indian taxation and accounting law).'] },
          { number: '18.4', heading: 'Fee Transparency & Zero Markup for Preregistration', paragraphs: ['ZENVITRA enforces zero platform markup fees for preregistrations and student initiatives. Standard payment gateway processing fees are itemized transparently prior to payment confirmation.'] }
        ]
      }
    ]
  },
  {
    partNumber: 'PART IV',
    partTitle: 'HOW ZENVITRA USES INFORMATION',
    clauses: [
      {
        id: '19',
        title: '19. PROVIDING SERVICES',
        subsections: [
          {
            number: '19.1',
            heading: 'Core Operations',
            paragraphs: [
              'We process information to: create accounts; authenticate users; operate profiles; send messages; host Content; operate events; administer MUN conferences; provide document collaboration; process payments; provide certificates; publish articles; operate professional tools; provide customer support; and perform other services requested by users.'
            ]
          }
        ]
      },
      {
        id: '20',
        title: '20. PERSONALIZATION',
        subsections: [
          { number: '20.1', heading: 'Personalized Experience', paragraphs: ['ZENVITRA may use permitted information to personalize recommended Content, event discovery, MUN discovery, relevant profiles, document suggestions, notifications, search results, and workspace organization.'] },
          { number: '20.2', heading: 'Controls', paragraphs: ['Where personalization controls are offered, users may adjust or disable certain forms of personalization.'] }
        ]
      },
      {
        id: '21',
        title: '21. SECURITY AND FRAUD PREVENTION',
        subsections: [
          { number: '21.1', heading: 'Security Monitoring', paragraphs: ['Processes data to detect unauthorized access, identify suspicious activity, prevent fraud, protect users, secure infrastructure, investigate account compromise, prevent spam, detect malware, enforce technical restrictions, and investigate security incidents.'] }
        ]
      },
      {
        id: '22',
        title: '22. PLATFORM INTEGRITY',
        subsections: [
          { number: '22.1', heading: 'Integrity Protection', paragraphs: ['Information is used to detect attempts to manipulate engagement, voting, awards, conference statistics, registrations, payments, rankings, certificate systems, recommendation systems, or platform functionality.'] }
        ]
      },
      {
        id: '23',
        title: '23. COMMUNICATIONS',
        subsections: [
          { number: '23.1', heading: 'Operational Notices', paragraphs: ['ZENVITRA sends service communications concerning account security, login activity, password changes, registration, events, MUN conferences, document collaboration, payments, subscriptions, certificates, policy changes, and support requests. Essential operational messages continue even if you opt out of marketing.'] }
        ]
      },
      {
        id: '24',
        title: '24. MARKETING',
        subsections: [
          { number: '24.1', heading: 'Promotional Communications', paragraphs: ['Where legally permitted and appropriately consented to, ZENVITRA may send information about new features, events, subscriptions, promotions, products, or partnerships.'] },
          { number: '24.2', heading: 'Opt-Out', paragraphs: ['You may unsubscribe from marketing communications using the link provided in the message or via account settings.'] }
        ]
      }
    ]
  },
  {
    partNumber: 'PART V',
    partTitle: 'ZEN AI',
    clauses: [
      {
        id: '25',
        title: '25. AI-POWERED FEATURES',
        subsections: [
          { number: '25.1', heading: 'AI Services', paragraphs: ['Provides writing assistance, summarization, document organization, research assistance, MUN preparation, conference administration, search, classification, recommendations, content assistance, and workflow automation.'] },
          { number: '25.2', heading: 'AI Inputs', paragraphs: ['AI systems process information you intentionally submit (e.g. asking AI to summarize a document processes that document content).'] },
          { number: '25.3', heading: 'Permission Boundaries', paragraphs: ['AI systems are strictly bounded by applicable account, document, workspace, organization, event, and role permissions. Information is never disclosed merely because it exists on ZENVITRA.'] },
          { number: '25.4', heading: 'AI Output Caution', paragraphs: ['AI output may be inaccurate, incomplete, outdated, biased, or inappropriate. Users should review important AI-generated information before relying upon it.'] },
          { number: '25.5', heading: 'Confidential Information', paragraphs: ['Users should consider the sensitivity of information before submitting it to AI features. Available controls are described in product settings.'] }
        ]
      },
      {
        id: '26',
        title: '26. AUTOMATED DECISION-MAKING',
        subsections: [
          { number: '26.1', heading: 'Automated Systems', paragraphs: ['Used for spam detection, fraud detection, security, content recommendations, abuse detection, document organization, moderation assistance, and event administration.'] },
          { number: '26.2', heading: 'Human Review', paragraphs: ['Where significant decisions are subject to legal requirements or ZENVITRA policy, human review mechanisms are provided.'] },
          { number: '26.3', heading: 'MUN Scores', paragraphs: ['Automated participation statistics are not a final judgment of participant merit. Authorized human organizers retain control over awards and conference decisions.'] }
        ]
      }
    ]
  },
  {
    partNumber: 'PART VI',
    partTitle: 'DATA SHARING',
    clauses: [
      {
        id: '27',
        title: '27. GENERAL SHARING PRINCIPLE',
        subsections: [{ number: '27.1', heading: 'No Sale of Data', paragraphs: ['ZENVITRA does not sell personal data merely because you use the platform. Information is disclosed only where reasonably necessary to provide Services, comply with law, protect users, operate events, process payments, or perform legitimate functions described in this Policy.'] }]
      },
      {
        id: '28',
        title: '28. SERVICE PROVIDERS',
        subsections: [
          { number: '28.1', heading: 'Vendors', paragraphs: ['Uses third-party providers for cloud hosting, databases, content delivery, authentication, email, SMS, payments, analytics, security, customer support, AI infrastructure, video processing, storage, and monitoring.'] },
          { number: '28.2', heading: 'Contractual Controls', paragraphs: ['Service providers are contractually required to process information only for authorized purposes and maintain appropriate security measures.'] }
        ]
      },
      {
        id: '29',
        title: '29. EVENT ORGANIZERS',
        subsections: [
          { number: '29.1', heading: 'Organizer Access', paragraphs: ['Organizers receive information necessary to administer event participation.'] },
          { number: '29.2', heading: 'Organizer Responsibilities', paragraphs: ['Organizers must use participant information solely for legitimate event purposes, protect it, limit access to authorized staff, and comply with applicable privacy laws.'] },
          { number: '29.3', heading: 'Independent Organizer Policies', paragraphs: ['Organizers may provide independent privacy notices describing additional processing performed outside ZENVITRA.'] }
        ]
      },
      {
        id: '30',
        title: '30. ORGANIZATION ADMINISTRATORS',
        subsections: [
          { number: '30.1', heading: 'Managed Workspaces', paragraphs: ['If you join an organization workspace, administrators have access to information required to manage that workspace (documents, members, roles, activity, shared Content).'] },
          { number: '30.2', heading: 'Personal Accounts Separation', paragraphs: ['An organization administrator does not automatically own or control your personal ZENVITRA account. Separation depends on account architecture and applicable agreements.'] }
        ]
      },
      {
        id: '31',
        title: '31. LEGAL REQUESTS',
        subsections: [{ number: '31.1', heading: 'Lawful Disclosures', paragraphs: ['Discloses information in response to valid legal processes, court orders, lawful government requests, regulatory requirements, investigations, or emergencies, seeking to limit disclosure to what is reasonably necessary.'] }]
      },
      {
        id: '32',
        title: '32. SAFETY AND EMERGENCIES',
        subsections: [{ number: '32.1', heading: 'Imminent Threats', paragraphs: ['Discloses information where reasonably necessary to address imminent threats to life, physical safety, platform security, users, the public, or critical infrastructure.'] }]
      },
      {
        id: '33',
        title: '33. CORPORATE TRANSACTIONS',
        subsections: [{ number: '33.1', heading: 'Business Reorganization', paragraphs: ['In the event of a merger, acquisition, restructuring, financing, sale of assets, or corporate transfer, personal data may be transferred where legally permitted with required notices.'] }]
      }
    ]
  },
  {
    partNumber: 'PART VII',
    partTitle: 'PUBLIC CONTENT',
    clauses: [
      {
        id: '34',
        title: '34. PUBLIC PROFILES',
        subsections: [{ number: '34.1', heading: 'Public Visibility', paragraphs: ['Public profiles are visible to ZENVITRA users, event participants, organizations, search engines, and the public, displaying username, photo, bio, publications, public posts, MUN portfolio, and verified credentials.'] }]
      },
      {
        id: '35',
        title: '35. PUBLIC POSTS AND MEDIA',
        subsections: [
          { number: '35.1', heading: 'Public Publication', paragraphs: ['Publicly published Content may be copied, downloaded, shared, quoted, cached, or indexed by third parties.'] },
          { number: '35.2', heading: 'External Copies', paragraphs: ['Removing public Content from ZENVITRA does not guarantee that third parties or search engines will immediately purge copies independently obtained.'] }
        ]
      },
      {
        id: '36',
        title: '36. PUBLIC MUN RECORDS',
        subsections: [{ number: '36.1', heading: 'Conference Records', paragraphs: ['Conferences may publish committee rosters, participant names, portfolio allocations, bills, resolutions, voting results, awards, certificates, and press releases according to stated event configuration.'] }]
      }
    ]
  },
  {
    partNumber: 'PART VIII',
    partTitle: 'CHILDREN AND YOUNG USERS (SUMMARY NOTICE)',
    clauses: [
      {
        id: '37',
        title: '37. CHILDREN\'S DATA & SEPARATE UNDER-18 POLICY',
        subsections: [
          {
            number: '37.1',
            heading: 'Applicable Framework & Dedicated Under-18 Policy',
            paragraphs: [
              'ZENVITRA is a youth-focused platform that strictly complies with India\'s Digital Personal Data Protection Act, 2023 (DPDP Act) and the DPDP Rules, 2025.',
              'For users under the age of 18 and their parents or lawful guardians, ZENVITRA maintains a separate, dedicated policy: Under-18 User Protection & Parental Consent Policy available at /privacy/minor.',
              'This main Privacy Policy governs adult users (18+) and institutional accounts.'
            ]
          },
          {
            number: '37.2',
            heading: 'Parental Consent & Zero Targeted Advertising Invariant',
            paragraphs: [
              'Where applicable law requires parental or lawful-guardian consent before processing personal data belonging to a child, verifiable consent must be completed prior to processing.',
              'In accordance with Section 9 of the DPDP Act, ZENVITRA maintains an absolute statutory prohibition on targeted advertising and behavioural tracking of minors.'
            ]
          }
        ]
      }
    ]
  },
  {
    partNumber: 'PART IX',
    partTitle: 'RETENTION AND DELETION',
    clauses: [
      {
        id: '38',
        title: '38. DATA RETENTION',
        subsections: [
          { number: '38.1', heading: 'Retention Principle', paragraphs: ['Retains personal data only as long as reasonably necessary for the original collection purpose or lawful compliance.'] },
          { number: '38.2', heading: 'Evaluation Factors', paragraphs: ['Retention periods depend on processing purpose, information type, account status, legal/financial obligations, security needs, dispute resolution, and archival requirements.'] },
          { number: '38.3', heading: 'Variable Periods', paragraphs: ['Financial and payment records require longer statutory retention than temporary session tokens or cached analytics.'] }
        ]
      },
      {
        id: '39',
        title: '39. ACCOUNT DELETION',
        subsections: [
          { number: '39.1', heading: 'Deletion Requests', paragraphs: ['Users can request account deletion via account settings or privacy contact channels.'] },
          { number: '39.2', heading: 'Deletion Process', paragraphs: ['Disables access, deletes or anonymizes eligible information, purges eligible public Content, terminates active sessions, and cycles out backups according to standard lifecycles.'] },
          { number: '39.3', heading: 'Legitimate Residual Records', paragraphs: ['Some records remain where strictly required for legal compliance, financial auditing, fraud prevention, dispute resolution, or journalistic preservation.'] }
        ]
      },
      {
        id: '40',
        title: '40. CONTENT CREATED WITH OTHER USERS',
        subsections: [
          { number: '40.1', heading: 'Collaborative Resources', paragraphs: ['Deleting an individual account does not delete multi-party collaborative documents, bills, resolutions, committee proceedings, or co-authored dispatches.'] },
          { number: '40.2', heading: 'Attribution', paragraphs: ['Collaborative records may retain pseudonymized attribution following account closure subject to applicable law.'] }
        ]
      }
    ]
  },
  {
    partNumber: 'PART X',
    partTitle: 'USER RIGHTS AND CHOICES',
    clauses: [
      {
        id: '41',
        title: '41. PRIVACY RIGHTS',
        subsections: [{ number: '41.1', heading: 'Statutory Rights', paragraphs: ['Under applicable laws (including DPDP 2023/2025), users have rights to: obtain processing summary; access personal data; correct inaccurate info; update information; request erasure; withdraw consent; object to processing; request data portability; submit grievances; and nominate representatives.'] }]
      },
      {
        id: '42',
        title: '42. CORRECTION',
        subsections: [
          { number: '42.1', heading: 'Self-Service Updates', paragraphs: ['Users can update account details directly through Settings.'] },
          { number: '42.2', heading: 'Correction Requests', paragraphs: ['Contact ZENVITRA for records not editable via direct settings.'] },
          { number: '42.3', heading: 'Verification', paragraphs: ['Reasonable identity verification steps are taken to prevent unauthorized data manipulation.'] }
        ]
      },
      {
        id: '43',
        title: '43. CONSENT WITHDRAWAL',
        subsections: [
          { number: '43.1', heading: 'Withdrawal Mechanism', paragraphs: ['Where processing is consent-based, you may withdraw consent via account controls.'] },
          { number: '43.2', heading: 'Consequences', paragraphs: ['Does not invalidate prior lawful processing; may prevent delivery of features strictly reliant on that consent.'] }
        ]
      },
      {
        id: '44',
        title: '44. ACCESS REQUESTS',
        subsections: [
          { number: '44.1', heading: 'Data Export', paragraphs: ['Users may request a copy of personal data processed by ZENVITRA.'] },
          { number: '44.2', heading: 'Verification & Exceptions', paragraphs: ['Requests are authenticated. Information adversely affecting other individuals\' rights or active investigations may be legally restricted.'] }
        ]
      },
      {
        id: '45',
        title: '45. GRIEVANCES',
        subsections: [
          { number: '45.1', heading: 'Grievance Officer Channel', paragraphs: ['Complaints regarding data processing may be filed directly with our designated Grievance Officer at grievance@zenvitra.xyz.'] },
          { number: '45.2', heading: 'Investigation & Statutory Timeline', paragraphs: ['Grievances are investigated through formal procedures and resolved within the statutory timeline mandated under applicable law (DPDP Rules 2025 and IT Rules).'] }
        ]
      }
    ]
  },
  {
    partNumber: 'PART XI',
    partTitle: 'SECURITY',
    clauses: [
      {
        id: '46',
        title: '46. INFORMATION SECURITY',
        subsections: [
          { number: '46.1', heading: 'Technical Safeguards', paragraphs: ['Implements encryption in transit (TLS 1.3), encryption at rest (AES-256), multi-factor authentication, role-based access control, access logging, rate limiting, and vulnerability testing.'] },
          { number: '46.2', heading: 'Administrative Safeguards', paragraphs: ['Enforces least-privilege employee permissions, security training, vendor audits, and data governance standards.'] },
          { number: '46.3', heading: 'No Absolute Guarantee', paragraphs: ['While reasonable commercial safeguards are maintained, no internet-connected platform can promise impenetrable security.'] }
        ]
      },
      {
        id: '47',
        title: '47. DATA BREACHES AND SECURITY INCIDENTS',
        subsections: [
          { number: '47.1', heading: 'Incident Response', paragraphs: ['Maintains automated intrusion monitoring, forensic isolation protocols, and incident management playbooks.'] },
          { number: '47.2', heading: 'Statutory Breach Notifications', paragraphs: ['Where required by applicable law (including MeitY / Data Protection Board guidelines), notifications are made to competent authorities and affected citizens within mandated timeframes.'] }
        ]
      }
    ]
  },
  {
    partNumber: 'PART XII',
    partTitle: 'INTERNATIONAL DATA PROCESSING',
    clauses: [
      {
        id: '48',
        title: '48. INTERNATIONAL TRANSFERS',
        subsections: [
          { number: '48.1', heading: 'Global Cloud Infrastructure', paragraphs: ['ZENVITRA utilizes distributed cloud nodes and database instances located in jurisdictions consistent with legal cross-border transfer frameworks.'] },
          { number: '48.2', heading: 'Transfer Safeguards', paragraphs: ['Transfers adhere to permissible country lists and standard contractual clauses mandated under applicable law.'] }
        ]
      }
    ]
  },
  {
    partNumber: 'PART XIII',
    partTitle: 'SPECIAL DATA CONTEXTS',
    clauses: [
      {
        id: '49',
        title: '49. PROFESSIONAL ACCOUNTS',
        subsections: [
          { number: '49.1', heading: 'Professional Data', paragraphs: ['Professional users voluntarily provide employment history, skills, portfolios, professional biographies, publications, and institutional affiliations.'] },
          { number: '49.2', heading: 'Public Professional Identity', paragraphs: ['Information placed on public professional profiles is accessible to institutions, delegates, and recruiters.'] }
        ]
      },
      {
        id: '50',
        title: '50. ORGANIZATIONS',
        subsections: [
          { number: '50.1', heading: 'Organization Workspaces', paragraphs: ['Institutions manage dedicated environments with administrator visibility over workspace documents and activity.'] },
          { number: '50.2', heading: 'Organization Responsibility', paragraphs: ['Organizations must ensure that their handling of member and student data complies with applicable data protection laws.'] }
        ]
      },
      {
        id: '51',
        title: '51. CERTIFICATES AND CREDENTIALS',
        subsections: [
          { number: '51.1', heading: 'ZEN.CERTIFY Records', paragraphs: ['Processes recipient name, event name, certificate type, issue timestamp, cryptographic hash, achievement, and issuer signatures.'] },
          { number: '51.2', heading: 'Public Verification', paragraphs: ['Digital certificates include public verification URLs and QR codes allowing third parties to confirm authenticity.'] }
        ]
      },
      {
        id: '52',
        title: '52. ANALYTICS',
        subsections: [
          { number: '52.1', heading: 'Platform Telemetry', paragraphs: ['Monitors system health, error rates, throughput, and feature usage through aggregated telemetry.'] },
          { number: '52.2', heading: 'Data Minimization', paragraphs: ['Telemetry avoids collecting unnecessary identifiable data.'] }
        ]
      }
    ]
  },
  {
    partNumber: 'PART XIV',
    partTitle: 'ADVERTISING',
    clauses: [
      {
        id: '53',
        title: '53. ADVERTISING DATA',
        subsections: [
          { number: '53.1', heading: 'Sponsorships & Ads', paragraphs: ['Where sponsored content appears, it is clearly distinguished from organic discourse.'] },
          { number: '53.2', heading: 'No Surveillance Profiling', paragraphs: ['ZENVITRA rejects third-party behavioral trackers and prohibits targeting based on sensitive characteristics.'] },
          { number: '53.3', heading: 'Children', paragraphs: ['Targeted advertising directed at children is strictly forbidden in compliance with DPDP 2025.'] }
        ]
      },
      {
        id: '54',
        title: '54. SPONSORED CONTENT',
        subsections: [{ number: '54.1', heading: 'Clear Disclosure', paragraphs: ['All promoted posts, sponsored publications, and institutional partnerships are labeled with prominent disclosure tags.'] }]
      }
    ]
  },
  {
    partNumber: 'PART XV',
    partTitle: 'THIRD-PARTY SERVICES',
    clauses: [
      { id: '55', title: '55. EXTERNAL LINKS', subsections: [{ number: '55.1', heading: 'External Sites', paragraphs: ['ZENVITRA is not responsible for the privacy practices of external third-party sites linked from our services.'] }] },
      { id: '56', title: '56. THIRD-PARTY LOGIN', subsections: [{ number: '56.1', heading: 'OAuth Providers', paragraphs: ['Authenticating via Google or GitHub provides only authorized claims necessary to establish your session.'] }] },
      { id: '57', title: '57. PAYMENT PROVIDERS', subsections: [{ number: '57.1', heading: 'Independent Payment Gateways', paragraphs: ['Payment gateways independently process card data under PCI-DSS compliance. ZENVITRA receives only reconciliation tokens.'] }] }
    ]
  },
  {
    partNumber: 'PART XVI',
    partTitle: 'DATA GOVERNANCE',
    clauses: [
      { id: '58', title: '58. DATA MINIMIZATION', subsections: [{ number: '58.1', heading: 'Principle', paragraphs: ['Collects and processes only data reasonably necessary for the stated purpose.'] }] },
      { id: '59', title: '59. PURPOSE LIMITATION', subsections: [{ number: '59.1', heading: 'Principle', paragraphs: ['Information collected for one purpose will not be repurposed for unrelated objectives without lawful basis or consent.'] }] },
      { id: '60', title: '60. DATA ACCURACY', subsections: [{ number: '60.1', heading: 'Principle', paragraphs: ['Provides mechanisms to keep information accurate and updated.'] }] },
      { id: '61', title: '61. ACCESS CONTROL', subsections: [{ number: '61.1', heading: 'Role-Based Hierarchy', paragraphs: ['USER (Personal Data) ↓ EVENT ORGANIZER (Event Participants) ↓ MUN CHAIR (Assigned Committee) ↓ USG (Authorized Committees) ↓ SECRETARIAT (Conference Operations) ↓ SYSTEM ADMIN (Technical Administration). Technical access does not confer right to reuse data for unrelated purposes.'] }] },
      { id: '62', title: '62. AUDIT LOGS', subsections: [{ number: '62.1', heading: 'Immutable Security Logs', paragraphs: ['Maintains audit logs of administrative actions, permission adjustments, scoring entries, award allocations, and security events.'] }] }
    ]
  },
  {
    partNumber: 'PART XVII',
    partTitle: 'PRIVACY BY PRODUCT DESIGN',
    clauses: [
      { id: '63', title: '63. ZENVITRA DATA ARCHITECTURE', subsections: [{ number: '63.1', heading: 'Interconnected Ecosystem with Strict Boundaries', paragraphs: ['Interconnection across ZEN.PROFILE, PULSE, CHAT, FLUX, PRESS, EVENTS, MUN, DOCS, and LEGISLATE does not mean unrestricted data cross-talk. Access is strictly compartmentalized by purpose, permissions, and roles.'] }] },
      { id: '64', title: '64. DATA SEGREGATION', subsections: [{ number: '64.1', heading: 'Logical Boundaries', paragraphs: ['Maintains strict barriers between personal data, private messages, private documents, organization data, event records, and public content.'] }] }
    ]
  },
  {
    partNumber: 'PART XVIII',
    partTitle: 'GOVERNMENT AND LAW ENFORCEMENT REQUESTS',
    clauses: [
      { id: '65', title: '65. LEGAL DISCLOSURES', subsections: [{ number: '65.1', heading: 'Due Process', paragraphs: ['Evaluates authenticity, legal jurisdiction, and statutory authority before responding to lawful orders, adhering strictly to data minimization and notifying users where legally permissible.'] }] }
    ]
  },
  {
    partNumber: 'PART XIX',
    partTitle: 'DATA FROM OTHER PEOPLE',
    clauses: [
      { id: '66', title: '66. USER-SUBMITTED INFORMATION ABOUT OTHERS', subsections: [{ number: '66.1', heading: 'Collaborative Responsibility', paragraphs: ['When inviting delegates, collaborating on documents, or submitting delegation rosters, you warrant that you have appropriate authorization.'] }] },
      { id: '67', title: '67. MENTIONS AND TAGS', subsections: [{ number: '67.1', heading: 'Tag Controls', paragraphs: ['Users have controls to manage who can mention or tag their profile across PULSE and dispatches.'] }] }
    ]
  },
  {
    partNumber: 'PART XX',
    partTitle: 'PRIVACY REQUEST PROCEDURE',
    clauses: [
      { id: '68', title: '68. SUBMITTING A REQUEST', subsections: [{ number: '68.1', heading: 'Channels', paragraphs: ['Submit requests via the in-app Privacy Center (/settings?tab=privacy), by emailing privacy@zenvitra.xyz, or through grievance@zenvitra.xyz.'] }] },
      { id: '69', title: '69. REQUEST RESPONSE', subsections: [{ number: '69.1', heading: 'Resolution Timeline', paragraphs: ['Responses are delivered within statutory timeframes mandated by the DPDP Rules, 2025.'] }] }
    ]
  },
  {
    partNumber: 'PART XXI',
    partTitle: 'POLICY CHANGES',
    clauses: [
      { id: '70', title: '70. CHANGES TO THIS PRIVACY POLICY', subsections: [{ number: '70.1', heading: 'Policy Revisions', paragraphs: ['Updated when new products launch or regulatory frameworks evolve. Material updates are broadcast with advance notice.'] }] }
    ]
  },
  {
    partNumber: 'PART XXII',
    partTitle: 'CONTACT AND ACCOUNTABILITY',
    clauses: [
      {
        id: '71',
        title: '71. PRIVACY CONTACT',
        subsections: [
          {
            number: '71.1',
            heading: 'Secretariat & Officers',
            paragraphs: [
              'ZENVITRA Operating Entity: [LEGAL ENTITY NAME]\nPrivacy Contact: privacy@zenvitra.xyz\nData Protection Officer: dpo@zenvitra.xyz\nGrievance Officer: grievance@zenvitra.xyz\nLegal Contact: legal@zenvitra.xyz\nSecurity & Vulnerability: security@zenvitra.xyz\nRegistered Office: [REGISTERED ADDRESS]'
            ]
          }
        ]
      },
      {
        id: '72',
        title: '72. GOVERNING FRAMEWORK',
        subsections: [
          {
            number: '72.1',
            heading: 'Statutory Compliance Matrix',
            paragraphs: [
              'ZENVITRA operates in accordance with applicable data protection and intermediary legislation. For operations in India, this includes the Digital Personal Data Protection Act, 2023, the Digital Personal Data Protection Rules, 2025, and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 as amended through February 2026.'
            ]
          }
        ]
      },
      {
        id: '73',
        title: '73. FINAL PRIVACY PRINCIPLE',
        subsections: [
          {
            number: '73.1',
            heading: 'The Sovereign Data Invariant',
            paragraphs: [
              'ZENVITRA\'s objective is built upon the fundamental principle that citizens should understand what information is being collected, why it is used, who can access it, and retain absolute cryptographic sovereignty over it.',
              'Across every ecosystem product, we apply: Purpose → Permission → Access → Security → Retention → Deletion.'
            ]
          }
        ]
      }
    ]
  },
  {
    partNumber: 'PART XXIII',
    partTitle: 'AI DRAFTING STUDIO, DOCUMENT INTELLIGENCE & LEGISLATIVE ARCHIVING',
    clauses: [
      {
        id: '74',
        title: '74. DOCUMENT EXTRACTION & INTELLIGENT DATA ANALYSIS',
        subsections: [
          {
            number: '74.1',
            heading: 'Zero AI Training on User Legislative Documents',
            paragraphs: [
              'When you upload files (including PDF, DOCX, TXT, and Markdown) into the ZEN.SOLUTIONS Drafting Studio or import drafts from ZEN.DOCS, our document intelligence engine extracts structural entities (chapters, clauses, subclauses, schedules, tables, and financial/data charts) strictly in memory.',
              'ZENVITRA enforces an immutable policy: your drafted bills, resolutions, working papers, research documents, and uploaded source files are NEVER used to train, fine-tune, or reinforce global foundational artificial intelligence models without your explicit, separate affirmative opt-in consent.',
              'Document parsing buffers and transient OCR tokens are flushed immediately following structural extraction.'
            ]
          },
          {
            number: '74.2',
            heading: 'Unparsed Segment Detection & Leftover Clause Review',
            paragraphs: [
              'To prevent unintentional data loss or accidental omissions during automated parsing, our system conducts client-side and server-side text diff audits.',
              'Any text blocks, preamble clauses, or statistical annexures not cleanly mapped to standard legislative schemas are surfaced directly to the author in an interactive Leftover Review modal before saving, ensuring complete citizen control over the final text representation.'
            ]
          }
        ]
      },
      {
        id: '75',
        title: '75. ORIGINAL DOCUMENT ATTACHMENTS & PUBLIC DOWNLOAD PERMISSIONS',
        subsections: [
          {
            number: '75.1',
            heading: 'Source Document Preservation (PIB Style)',
            paragraphs: [
              'Authors may attach and retain the authentic original document file (PDF, DOCX, MD, TXT) alongside the parsed sovereign legislative bill or resolution, enabling readers to verify the original formatted work.',
              'Original files are stored in cryptographically authenticated object vaults with SHA-256 integrity checksums to prevent unauthorized alteration.'
            ]
          },
          {
            number: '75.2',
            heading: 'Author-Controlled Download Privacy Gate',
            paragraphs: [
              'Every author maintains an explicit, granular permission toggle ("Allow original document download") governing public access to raw attached files.',
              'When disabled, community members may read the structured bill on-screen through the Gazette viewer but are restricted from exporting or downloading the raw source file, protecting the author\'s distribution and intellectual property preferences.'
            ]
          }
        ]
      },
      {
        id: '76',
        title: '76. THE TWO-REVISION STATUTORY LIMIT & DELIBERATIVE PRIVACY',
        subsections: [
          {
            number: '76.1',
            heading: 'Anti-Tampering Invariant on Published Legislation',
            paragraphs: [
              'To protect the democratic integrity of co-sponsorships, public votes, division counts, and civic debates, published bills on ZEN.SOLUTIONS may only be modified a maximum of two (2) times by the author.',
              'Each revision increment is permanently recorded on the sovereign ledger (e.g., Revision 1/2, Revision 2/2). Once two revisions are reached, the bill is permanently locked against further author modification.',
              'Further modifications can only occur through transparent, recorded floor amendments proposed and adopted by the community under the Amendments Protocol.'
            ]
          },
          {
            number: '76.2',
            heading: 'Integrity of Historical Legislative Deliberation',
            paragraphs: [
              'The statutory two-revision limit prevents deceptive bait-and-switch modifications wherein an author publishes a proposal, gathers co-signatories or citizen votes, and subsequently alters contentious legal provisions in secret.',
              'Author edit records and timestamped revision logs remain permanently accessible alongside the proposal.'
            ]
          }
        ]
      }
    ]
  },
  {
    partNumber: 'PART XXIV',
    partTitle: 'TEST NODE SANDBOXING & PROFILE INTEGRITY',
    clauses: [
      {
        id: '77',
        title: '77. TEST ENVIRONMENT ISOLATION & NON-DESTRUCTIVE EXPLORATION',
        subsections: [
          {
            number: '77.1',
            heading: 'Complete Account and Session Sandboxing',
            paragraphs: [
              'The ZENVITRA Test Node (/test-login) provides an ephemeral, simulated environment for developers, delegates, and guests to explore platform capabilities without authenticating or generating personal data.',
              'When an authenticated user activates Test Mode, their authentic session token, OAuth credentials, uploaded profile picture, and Holographic Sovereign Passport are automatically backed up to a secure local vault (zenvitra_real_user_session_backup) and strictly insulated from the test environment.',
              'The Test Node operates with an isolated identity token (zen_test_pilot_node) that is barred from modifying, overwriting, or thrashing real database records or user profiles.'
            ]
          },
          {
            number: '77.2',
            heading: 'Seamless Session Restoration & Zero Data Leakage',
            paragraphs: [
              'Upon exiting the Test Node via "Leave Test Mode" or closing the browser tab, the platform automatically destroys all ephemeral test state and seamlessly restores the authenticated user\'s authentic profile, avatar, and passport credentials.',
              'Global storage keys governing verification, student badges, and passport tiers are never contaminated by test actions.'
            ]
          }
        ]
      }
    ]
  }
];

// ─── PART I: TERMS OF SERVICE (46 CLAUSES) ───
export const TERMS_OF_SERVICE_DATA: LegalSection[] = [
  {
    id: '1',
    sectionNumber: '1',
    title: '1. INTRODUCTION AND ACCEPTANCE',
    subsections: [
      {
        number: '1.1',
        heading: 'Agreement',
        paragraphs: [
          'These Terms of Service (“Terms”, “Terms of Service”, or “Agreement”) constitute a legally binding agreement between you and [LEGAL ENTITY NAME], the entity that owns, operates, or otherwise provides the ZENVITRA platform and its associated services (“ZENVITRA”, “we”, “us”, or “our”).',
          'These Terms govern your access to and use of ZENVITRA’s websites, mobile applications, software, products, services, application programming interfaces, event-management systems, communication tools, publishing systems, document systems, professional tools, and other services made available by ZENVITRA from time to time.',
          'By creating an account, accessing ZENVITRA, registering for an event through ZENVITRA, purchasing a subscription, uploading content, participating in a ZEN.MUN conference, publishing material, using ZEN.DOCS, using ZEN.CHAT, or otherwise using any ZENVITRA service, you acknowledge that you have read, understood, and agreed to be bound by these Terms and all policies incorporated into them.',
          'If you do not agree to these Terms, you must not create an account or use ZENVITRA.'
        ]
      },
      {
        number: '1.2',
        heading: 'Additional Terms',
        paragraphs: [
          'Certain ZENVITRA products may have additional rules, policies, contractual terms, or feature-specific requirements, including: Privacy Policy; Community Guidelines; Cookie Policy; Copyright Policy; AI Policy; ZEN.EVENTS Organizer Terms; ZEN.MUN Conference Rules; ZEN.PAYMENTS Terms; Subscription and Billing Terms; API Terms; Professional Account Terms; Organization Terms; and other policies expressly incorporated into these Terms.',
          'Where an additional agreement specifically governs a particular service, that agreement will apply to that service in addition to these Terms.'
        ]
      },
      {
        number: '1.3',
        heading: 'Changes to the Agreement',
        paragraphs: [
          'ZENVITRA may modify these Terms where reasonably necessary to reflect changes to its services, technology, legal obligations, security requirements, business operations, or user experience.',
          'Where a change is material, ZENVITRA will take reasonable steps to notify affected users before or around the time the revised Terms become effective, where required by applicable law. Your continued use of ZENVITRA following the effective date of revised Terms constitutes acceptance of those Terms to the extent permitted by law.'
        ]
      }
    ]
  },
  {
    id: '2',
    sectionNumber: '2',
    title: '2. DEFINITIONS',
    subsections: [
      {
        number: '2.1',
        heading: 'Key Terminology',
        paragraphs: [
          '“Account” means a registered ZENVITRA account associated with a person, organization, professional entity, event organizer, institution, or other authorized user.',
          '“Content” means information, text, photographs, videos, audio, documents, files, graphics, messages, comments, articles, posts, profiles, publications, bills, resolutions, press releases, presentations, data, metadata, or other material uploaded, submitted, generated, transmitted, displayed, or otherwise made available through ZENVITRA.',
          '“User Content” means Content created, uploaded, submitted, or otherwise provided to ZENVITRA by you.',
          '“Services” means all products, software, websites, applications, features, tools, infrastructure, and functionality provided by ZENVITRA.',
          '“Third Party” means any person or organization that is not ZENVITRA or the user directly using the relevant Service.'
        ]
      }
    ]
  },
  {
    id: '3',
    sectionNumber: '3',
    title: '3. ELIGIBILITY, ADULT CAPACITY & MINORS NOTICE',
    subsections: [
      {
        number: '3.1',
        heading: 'Adult Eligibility & Minimum Standards',
        paragraphs: [
          'These main Terms of Service apply to adult users (individuals who have completed 18 years of age) and authorized representatives of institutions or organizations.',
          'By accessing or using the Services as an adult, you represent and warrant that you possess full legal capacity to enter into binding legal agreements under applicable law.'
        ]
      },
      {
        number: '3.2',
        heading: 'Dedicated Terms for Users Under 18',
        paragraphs: [
          'Users under 18 years of age and their parents or lawful guardians are governed by our separate, specialized agreement: Minor Terms of Service & Parental Consent Accord available at /terms/minor.',
          'Where applicable law requires verifiable parental or lawful-guardian consent, access to relevant features is conditioned upon verification of such consent.'
        ]
      }
    ]
  },
  {
    id: '4',
    sectionNumber: '4',
    title: '4. CREATING A ZENVITRA ACCOUNT',
    subsections: [
      {
        number: '4.1',
        heading: 'Registration & Credential Security',
        paragraphs: [
          'When creating an account, you agree to submit accurate name, username, email, age, and authentication information and keep it updated. You are responsible for taking reasonable measures to protect your account credentials and must not share credentials unless an authorized delegation mechanism is provided.',
          'Users may maintain multiple accounts for legitimate separate roles (e.g. personal vs. school organization), but may not create accounts to evade enforcement, manipulate engagement, impersonate others, or artificially inflate metrics.'
        ]
      },
      {
        number: '4.2',
        heading: 'Unauthorized Access & Recovery',
        paragraphs: [
          'If you believe someone has obtained unauthorized access to your account, you should promptly secure the account and notify ZENVITRA through available security channels. ZENVITRA may require reasonable verification information before restoring access.'
        ]
      }
    ]
  },
  {
    id: '5',
    sectionNumber: '5',
    title: '5. ZENVITRA’S PRODUCT ECOSYSTEM',
    subsections: [
      {
        number: '5.1',
        heading: 'Interconnected Suite of Products',
        paragraphs: [
          'ZENVITRA operates an integrated ecosystem comprising: ZEN.CHAT (private and group messaging), ZEN.PULSE (social feed, dispatches, and audio streams), ZEN.FLUX (short-form vertical video), ZENVITRA International Press (editorial journalism and publications), ZEN.EVENTS (ticketing and registration), ZEN.MUN (Model UN, committee operations, and parliamentary simulations), ZEN.DOCS (collaborative documents), ZEN.LEGISLATE (bill drafting and amendments), ZEN.PAYMENTS (financial transactions), ZEN.PROFILE (unified sovereign identity), and ZEN.CERTIFY (verifiable credentials).',
          'Not every product is available to every tier, country, or account type. ZENVITRA reserves the right to modify, upgrade, or replace features subject to applicable law.'
        ]
      }
    ]
  },
  {
    id: '6',
    sectionNumber: '6',
    title: '6. YOUR RESPONSIBILITY AS A USER',
    subsections: [
      {
        number: '6.1',
        heading: 'Lawful & Respectful Conduct',
        paragraphs: [
          'You agree to use ZENVITRA only for lawful purposes. You must not intentionally harass, threaten, intimidate, stalk, exploit, deceive, or unlawfully target another person. Where a feature grants access to another user’s workspace, committee, or event, you must use that access solely for the authorized purpose.'
        ]
      }
    ]
  },
  {
    id: '7',
    sectionNumber: '7',
    title: '7. USER CONTENT & INTELLECTUAL PROPERTY',
    subsections: [
      {
        number: '7.1',
        heading: 'Ownership & License',
        paragraphs: [
          'You retain full ownership of the original User Content you create and submit to ZENVITRA. Using ZENVITRA does not transfer ownership of your intellectual property to ZENVITRA.',
          'By submitting User Content, you grant ZENVITRA a non-exclusive, worldwide, royalty-free license to host, store, reproduce, transmit, process, format, and display that Content strictly to the extent reasonably necessary to operate, maintain, secure, and improve the Service.',
          'For public Content, you authorize ZENVITRA to make that material available to the public. For private Content, ZENVITRA does not publish it and restricts access strictly to authorized systems and recipients.'
        ]
      },
      {
        number: '7.2',
        heading: 'Music & Third-Party Audio Credits',
        paragraphs: [
          'All musical recordings, audio streams, and artist metadata featured across Zenvitra Pulse, Stories, Notes, and Events are the intellectual property of their respective original artists, copyright holders, and record labels. Music indexing and playback functionality utilizes public APIs including ytmusic-api from GitHub for transformative preview and personal civic expression. Zenvitra does not claim ownership of proprietary musical compositions.',
          'Audio preview snippets are strictly constrained between 30 and 120 seconds. Zenvitra does not charge for, sell, or commercially distribute independent audio master files. Rights holders may file attribution inquiries or takedown requests to legal@zenvitra.xyz.'
        ]
      },
      {
        number: '7.3',
        heading: 'ZEN.SPACE Sovereign Link Hubs & Custom Handles',
        paragraphs: [
          'Users and verified organizations may claim custom sovereign handles (e.g. zenvitra.xyz/space/[handle]) to showcase bio portals, audio rotations, multimedia reels, and interactive forms (inline accordions, modals, or external redirects).',
          'Handle squatting, misleading impersonation of public officials, diplomatic missions, Model UN forums, or registered corporate trademarks is strictly prohibited. Zenvitra reserves the right to reclaim or reassign contested handles in cases of verified trademark infringement or fraudulent misrepresentation.'
        ]
      },
      {
        number: '7.4',
        heading: 'ZEN.CALL Chamber Guidelines & Media Etiquette',
        paragraphs: [
          'ZEN.CALL media chambers are designed for peer-to-peer diplomatic caucus negotiations, youth committee sessions, and secure bilateral discussions.',
          'Users agree to uphold respectful parliamentary decorum and must not initiate non-consensual audiovisual recording, interception, or re-broadcasting of participants without the unambiguous prior knowledge and consent of all active participants in the chamber.'
        ]
      },
      {
        number: '7.5',
        heading: 'World Map API & Custom Location Attribution',
        paragraphs: [
          'Users may enrich posts, dispatches, and event notices with custom geolocation tags queried through OpenStreetMap and Nominatim.',
          'Users warrant that location tags reflect genuine civic, educational, or diplomatic venues and will not be used to publish private home addresses without consent (doxxing), issue false emergency distress locations, or fabricate fraudulent event venues.'
        ]
      }
    ]
  },
  {
    id: '8',
    sectionNumber: '8',
    title: '8. CONTENT REMOVAL AND DELETION',
    subsections: [
      {
        number: '8.1',
        heading: 'Deletion Lifecycle',
        paragraphs: [
          'Where functionality permits, you may delete Content you have uploaded. Deletion may temporarily remain in backup or disaster-recovery systems for limited operational periods. ZENVITRA may retain certain records where strictly required by law for financial accounting, fraud prevention, or legal dispute defense.'
        ]
      }
    ]
  },
  {
    id: '9',
    sectionNumber: '9',
    title: '9. ZEN.CHAT',
    subsections: [
      {
        number: '9.1',
        heading: 'Messaging Integrity',
        paragraphs: [
          'ZEN.CHAT supports private, group, and event communications. Users are responsible for sent content. While private messages are not treated as public dispatches, systems may process metadata and content where necessary for transmission, abuse prevention, security, or legal compliance.'
        ]
      }
    ]
  },
  {
    id: '10',
    sectionNumber: '10',
    title: '10. ZEN.PULSE AND ZEN.FLUX',
    subsections: [
      {
        number: '10.1',
        heading: 'Social Publishing & Anti-Manipulation',
        paragraphs: [
          'Users may publish permitted posts, audio streams, and vertical video reels. Public posts may be indexed by search engines. Users are strictly prohibited from using bots, click-farms, fake accounts, or coordinated schemes to artificially inflate views, likes, or followers.'
        ]
      }
    ]
  },
  {
    id: '11',
    sectionNumber: '11',
    title: '11. ZENVITRA INTERNATIONAL PRESS',
    subsections: [
      {
        number: '11.1',
        heading: 'Journalistic Responsibility & Intermediary Rules',
        paragraphs: [
          'Authors are responsible for factual accuracy and verifiable citations in submitted journalism. Submission does not guarantee publication; articles are subject to editorial review. Operations conform to India’s IT Rules, 2021 (as amended through February 2026) concerning digital news publishing and intermediary standards.'
        ]
      }
    ]
  },
  {
    id: '12',
    sectionNumber: '12',
    title: '12. ZEN.EVENTS',
    subsections: [
      {
        number: '12.1',
        heading: 'Event Management & Organizer Independence',
        paragraphs: [
          'Unless ZENVITRA expressly identifies itself as the organizer, independent event hosts are solely responsible for event schedules, venues, safety, and delivery. Registration details are shared with organizers strictly to administer the event.'
        ]
      }
    ]
  },
  {
    id: '13',
    sectionNumber: '13',
    title: '13. ZEN.MUN & CONFERENCE CONTROL CENTRE',
    subsections: [
      {
        number: '13.1',
        heading: 'Model UN Simulations & Parliamentary Formats',
        paragraphs: [
          'ZEN.MUN provides technology for Model United Nations, Regional Summits, and Parliamentary simulations. The host Secretariat controls conference agendas, rules of procedure, delegate allocations, and voting mechanics. Indian parliamentary simulations support legislative bills, amendments, formal readings, and clause-by-clause votes.'
        ]
      },
      {
        number: '13.2',
        heading: 'Secretariat Roles & Governance Hierarchy',
        paragraphs: [
          'The Conference Operating System enforces role-based responsibilities: Secretary-General (Conference Owner & Supreme Policy), Director-General (Operations & Logistics), USG/Department Heads (Departmental Deliverables), Committee Directors/EB (Committee Floor, Roll Calls, Speakers & Decorum), Rapporteurs (Documentation & Minutes), Finance (Registration Reconciliation & Approved Refunds), Press (Media Dispatches), and IT (Technical Diagnostic Troubleshooting).',
          'Secretariat officers agree to maintain procedural neutrality, respect delegate privacy, and protect diplomatic integrity. Misuse of Secretariat administrative credentials to alter historical records or tamper with awards is grounds for immediate credential revocation.'
        ]
      },
      {
        number: '13.3',
        heading: 'Digital Diplomatic Chits & Decorum Protocol',
        paragraphs: [
          'Digital chits passed between delegations and the Dais represent official parliamentary communications. Chits must maintain diplomatic decorum and substantive committee focus.',
          'Harassing, abusive, defamatory, sexually suggestive, or commercially disruptive chits are strictly prohibited. The Dais reserves the right to intercept, quarantine, and refer abusive chits to the Secretariat Disciplinary Board for immediate delegate disqualification.'
        ]
      },
      {
        number: '13.4',
        heading: 'Emergency Protocol Broadcasts',
        paragraphs: [
          'Secretariats may dispatch high-priority Amber Operational Alerts or Red Emergency Broadcasts to all registered attendees and committee chambers.',
          'Broadcast privileges may only be exercised for genuine operational emergencies, critical schedule modifications, security notices, or crisis committee updates. Issuing misleading, fraudulent, or prank emergency broadcasts is a severe violation resulting in permanent account termination and potential legal liability.'
        ]
      }
    ]
  },
  {
    id: '14',
    sectionNumber: '14',
    title: '14. ZEN.MUN ATTENDANCE, PROCEDURES AND PARTICIPATION',
    subsections: [
      {
        number: '14.1',
        heading: 'Procedural Tracking & Dais Mechanics',
        paragraphs: [
          'ZEN.MUN records attendance (Present, Present & Voting, Absent), General Speakers List (GSL) queues, moderated/unmoderated caucuses, individual speech times, and parliamentary voting tallies.',
          'Dais officers must faithfully administer formal Yields (Yield to Chair, Yield to Delegate, Yield to Questions/POIs, and Yield to Comments) and parliamentary points (Point of Personal Privilege, Point of Order, Point of Parliamentary Inquiry, and Right of Reply) according to published conference rules.'
        ]
      },
      {
        number: '14.2',
        heading: 'Technical Ledger vs Qualitative Evaluation',
        paragraphs: [
          'Participation logs reflect technical clock and speech activity. They assist human Executive Boards but do not bind the Dais to automated quantitative award allocations.'
        ]
      }
    ]
  },
  {
    id: '15',
    sectionNumber: '15',
    title: '15. ZEN.MUN SCORES AND AWARDS',
    subsections: [
      {
        number: '15.1',
        heading: 'Human Executive Board Prerogative',
        paragraphs: [
          'Scoring rubrics assist Executive Boards, but final award determinations remain strictly under human organizer control. ZENVITRA does not guarantee specific awards or placements. Digital certificates include public cryptographic verification.'
        ]
      }
    ]
  },
  {
    id: '16',
    sectionNumber: '16',
    title: '16. ZEN.DOCS',
    subsections: [
      {
        number: '16.1',
        heading: 'Collaborative Document Controls',
        paragraphs: [
          'Document owners assign granular permissions (Viewer, Commenter, Editor). Collaborators can access shared material according to assigned roles. Version histories are preserved for collaboration and auditing.'
        ]
      }
    ]
  },
  {
    id: '17',
    sectionNumber: '17',
    title: '17. ZEN.LEGISLATE & ZEN.SOLUTIONS',
    subsections: [
      {
        number: '17.1',
        heading: 'Collaborative Resolution Drafting & Treaty Codification',
        paragraphs: [
          'ZEN.SOLUTIONS provides collaborative legislative drafting for Model UN draft resolutions, Lok Sabha bills, and working papers. Co-sponsors, signatories, and authors collaborate under version-controlled redline diff tracking.',
          'Draft resolutions represent educational simulation material and carry no official statutory authority outside the simulated conference chamber.'
        ]
      }
    ]
  },
  {
    id: '18',
    sectionNumber: '18',
    title: '18. ZEN.PAYMENTS & CASHFREE GATEWAY',
    subsections: [
      {
        number: '18.1',
        heading: 'Payment Gateway Processing',
        paragraphs: [
          'Payments for conference passes, delegate tickets, and subscriptions are processed securely through Cashfree Payments India Pvt. Ltd. (PG API 2025-01-01) in compliance with Reserve Bank of India (RBI) tokenization guidelines and PCI-DSS Level 1 standards.',
          'Users must provide accurate billing and contact details. Complete payment card numbers and CVVs are tokenized directly by Cashfree and are never stored on ZENVITRA servers.'
        ]
      },
      {
        number: '18.2',
        heading: 'Refunds, Cancellations & Organizer Responsibility',
        paragraphs: [
          'Unless an event is officially hosted directly by ZENVITRA, independent conference organizers establish their own refund and cancellation terms. If an independent organizer cancels, postpones, or fails to deliver an event, the organizer is legally responsible for attendee refunds in accordance with their declared terms.',
          'ZENVITRA acts as a technical infrastructure provider and facilitates automated refund routing where approved by the organizer or mandated by banking dispute adjudication.'
        ]
      },
      {
        number: '18.3',
        heading: 'Platform Fee Structure',
        paragraphs: [
          'ZENVITRA enforces zero platform markup fee for student preregistrations and youth initiatives. Applicable gateway processing fees, banking charges, and statutory Goods and Services Tax (GST) are transparently disclosed prior to payment confirmation.'
        ]
      }
    ]
  },
  {
    id: '19',
    sectionNumber: '19',
    title: '19. SUBSCRIPTIONS AND PAID SERVICES',
    subsections: [
      {
        number: '19.1',
        heading: 'Pricing, Taxes & Renewals',
        paragraphs: [
          'Subscription prices, inclusive of applicable GST (with student exemptions applied where eligible), are shown prior to purchase. Auto-renewals can be managed or canceled through account settings.'
        ]
      }
    ]
  },
  {
    id: '20',
    sectionNumber: '20',
    title: '20. PROFESSIONAL AND ORGANIZATION ACCOUNTS',
    subsections: [
      {
        number: '20.1',
        heading: 'Enterprise & Institutional Workspaces',
        paragraphs: [
          'Organizations may manage dedicated workspaces with administrative visibility over organizational documents and members. Organization administration does not give administrators ownership over personal user accounts.'
        ]
      }
    ]
  },
  {
    id: '21',
    sectionNumber: '21',
    title: '21. ADVERTISING & SPONSORSHIPS',
    subsections: [
      {
        number: '21.1',
        heading: 'Transparency & Children’s Protection',
        paragraphs: [
          'Commercial sponsorships are clearly demarcated from organic discussions. Under no circumstances does ZENVITRA conduct behavioral surveillance or targeted advertising directed toward children, strictly adhering to DPDP Rules, 2025.'
        ]
      }
    ]
  },
  {
    id: '22',
    sectionNumber: '22',
    title: '22. PROHIBITED CONDUCT',
    subsections: [
      {
        number: '22.1',
        heading: 'Zero-Tolerance Violations',
        paragraphs: [
          'Users must not: commit fraud or identity theft; impersonate individuals, organizations, or government bodies; bypass access restrictions; distribute malware or exploit tools; manipulate metrics or awards; engage in harassment or stalking; violate privacy rights; or distribute unauthorized private media.'
        ]
      }
    ]
  },
  {
    id: '23',
    sectionNumber: '23',
    title: '23. COPYRIGHT AND INTELLECTUAL PROPERTY',
    subsections: [
      {
        number: '23.1',
        heading: 'Notice and Takedown',
        paragraphs: [
          'ZENVITRA respects intellectual property rights and maintains a formal grievance/takedown process. Repeat infringers will face account suspension.'
        ]
      }
    ]
  },
  {
    id: '24',
    sectionNumber: '24',
    title: '24. AI FEATURES',
    subsections: [
      {
        number: '24.1',
        heading: 'AI Output Limitations & Human Review',
        paragraphs: [
          'ZEN AI outputs may occasionally contain inaccuracies, hallucinations, or biases. Users remain responsible for human verification before relying on AI-generated content for consequential academic, professional, legal, or policy purposes.'
        ]
      }
    ]
  },
  {
    id: '25',
    sectionNumber: '25',
    title: '25. MODERATION',
    subsections: [
      {
        number: '25.1',
        heading: 'Enforcement Standards',
        paragraphs: [
          'ZENVITRA utilizes automated filters and human moderators to enforce community safety, taking contextual nuances (such as satire, educational debate, and simulation roles) into account.'
        ]
      }
    ]
  },
  {
    id: '26',
    sectionNumber: '26',
    title: '26. REPORTS AND APPEALS',
    subsections: [
      {
        number: '26.1',
        heading: 'Fair Hearing',
        paragraphs: [
          'Users can report violations and appeal enforcement actions through our designated appeals workflow.'
        ]
      }
    ]
  },
  {
    id: '27',
    sectionNumber: '27',
    title: '27. ACCOUNT SUSPENSION AND TERMINATION',
    subsections: [
      {
        number: '27.1',
        heading: 'Remedies for Breach',
        paragraphs: [
          'ZENVITRA may suspend or terminate accounts that materially violate these Terms, create legal jeopardy, or threaten user safety. Users may close their account at any time.'
        ]
      }
    ]
  },
  {
    id: '28',
    sectionNumber: '28',
    title: '28. THIRD-PARTY SERVICES',
    subsections: [
      {
        number: '28.1',
        heading: 'Integrations',
        paragraphs: [
          'External integrations (payment providers, OAuth logins, map tiles) operate under their respective privacy policies.'
        ]
      }
    ]
  },
  {
    id: '29',
    sectionNumber: '29',
    title: '29. API AND DEVELOPER ACCESS',
    subsections: [
      {
        number: '29.1',
        heading: 'Rate Limits & Security',
        paragraphs: [
          'Developer access is subject to documentation rate limits, token authentication, and data protection rules.'
        ]
      }
    ]
  },
  {
    id: '30',
    sectionNumber: '30',
    title: '30. SECURITY',
    subsections: [
      {
        number: '30.1',
        heading: 'Platform Safeguards',
        paragraphs: [
          'ZENVITRA enforces technical safeguards including transit encryption and session monitoring. Responsible security disclosure may be reported to security@zenvitra.xyz.'
        ]
      }
    ]
  },
  {
    id: '31',
    sectionNumber: '31',
    title: '31. AVAILABILITY AND SERVICE CHANGES',
    subsections: [
      {
        number: '31.1',
        heading: 'Service Continuity',
        paragraphs: [
          'We endeavor to provide uninterrupted availability, but services may experience maintenance downtime or emergency patches.'
        ]
      }
    ]
  },
  {
    id: '32',
    sectionNumber: '32',
    title: '32. USER FEEDBACK',
    subsections: [
      {
        number: '32.1',
        heading: 'Ideas & Submissions',
        paragraphs: [
          'Voluntary suggestions or feedback may be utilized to improve the platform without compensation.'
        ]
      }
    ]
  },
  {
    id: '33',
    sectionNumber: '33',
    title: '33. DISCLAIMERS',
    subsections: [
      {
        number: '33.1',
        heading: 'As-Is Provision',
        paragraphs: [
          'To the maximum extent permitted by applicable law, Services are provided on an “as available” basis without express warranties.'
        ]
      }
    ]
  },
  {
    id: '34',
    sectionNumber: '34',
    title: '34. LIMITATION OF LIABILITY',
    subsections: [
      {
        number: '34.1',
        heading: 'Permitted Scope',
        paragraphs: [
          'To the extent permitted by law, ZENVITRA will not be liable for indirect, incidental, or consequential damages. Mandatory statutory consumer rights are preserved.'
        ]
      }
    ]
  },
  {
    id: '35',
    sectionNumber: '35',
    title: '35. INDEMNIFICATION',
    subsections: [
      {
        number: '35.1',
        heading: 'User Responsibility',
        paragraphs: [
          'You agree to indemnify ZENVITRA from claims resulting from your material breach of these Terms, unlawful conduct, or intellectual property infringement.'
        ]
      }
    ]
  },
  {
    id: '36',
    sectionNumber: '36',
    title: '36. DISPUTE RESOLUTION',
    subsections: [
      {
        number: '36.1',
        heading: 'Informal First Attempt',
        paragraphs: [
          'Parties agree to attempt informal resolution and good-faith mediation prior to formal legal proceedings.'
        ]
      }
    ]
  },
  {
    id: '37',
    sectionNumber: '37',
    title: '37. GOVERNING LAW AND JURISDICTION',
    subsections: [
      {
        number: '37.1',
        heading: 'Jurisdiction',
        paragraphs: [
          'These Terms are governed by the laws of India, subject to the jurisdiction of competent courts in the operating seat of the entity.'
        ]
      }
    ]
  },
  {
    id: '38',
    sectionNumber: '38',
    title: '38. PRIVACY',
    subsections: [
      {
        number: '38.1',
        heading: 'Incorporation of Privacy Policy',
        paragraphs: [
          'Your use of the Services is subject to the ZENVITRA Privacy Policy, which is incorporated into and forms an integral part of these Terms.'
        ]
      }
    ]
  },
  {
    id: '39',
    sectionNumber: '39',
    title: '39. GRIEVANCE REDRESSAL',
    subsections: [
      {
        number: '39.1',
        heading: 'Statutory Officer Contact',
        paragraphs: [
          'In compliance with Rule 3(2) of the Information Technology Rules, 2021 (amended 2026), grievances may be filed with our Grievance Officer at grievance@zenvitra.xyz.'
        ]
      }
    ]
  },
  {
    id: '40',
    sectionNumber: '40',
    title: '40. NOTICES',
    subsections: [
      {
        number: '40.1',
        heading: 'Digital Communications',
        paragraphs: [
          'Notices are delivered via in-app alerts or the email address registered on your account.'
        ]
      }
    ]
  },
  {
    id: '41',
    sectionNumber: '41',
    title: '41. ASSIGNMENT',
    subsections: [
      {
        number: '41.1',
        heading: 'Transferability',
        paragraphs: [
          'ZENVITRA may assign rights as part of corporate restructuring or merger. Users may not transfer accounts without authorization.'
        ]
      }
    ]
  },
  {
    id: '42',
    sectionNumber: '42',
    title: '42. SEVERABILITY',
    subsections: [
      {
        number: '42.1',
        heading: 'Enforceability',
        paragraphs: [
          'If any provision is found invalid, it will be severed or modified to the minimum extent necessary without affecting the remainder.'
        ]
      }
    ]
  },
  {
    id: '43',
    sectionNumber: '43',
    title: '43. NO WAIVER',
    subsections: [
      {
        number: '43.1',
        heading: 'Non-Waiver of Rights',
        paragraphs: [
          'Failure to enforce a provision immediately does not constitute a waiver of the right to enforce it subsequently.'
        ]
      }
    ]
  },
  {
    id: '44',
    sectionNumber: '44',
    title: '44. ENTIRE AGREEMENT',
    subsections: [
      {
        number: '44.1',
        heading: 'Sole Covenant',
        paragraphs: [
          'These Terms, together with the Privacy Policy and incorporated guidelines, constitute the entire agreement between you and ZENVITRA.'
        ]
      }
    ]
  },
  {
    id: '45',
    sectionNumber: '45',
    title: '45. CONTACT',
    subsections: [
      {
        number: '45.1',
        heading: 'Official Communications',
        paragraphs: [
          'General: support@zenvitra.xyz | Legal: legal@zenvitra.xyz | Privacy: privacy@zenvitra.xyz | Grievance: grievance@zenvitra.xyz | Security: security@zenvitra.xyz'
        ]
      }
    ]
  },
  {
    id: '46',
    sectionNumber: '46',
    title: '46. ACKNOWLEDGEMENT',
    subsections: [
      {
        number: '46.1',
        heading: 'Multifaceted Platform Understanding',
        paragraphs: [
          'By accessing ZENVITRA, you acknowledge the multifaceted nature of the platform spanning communication, publishing, event management, and Model UN civic simulations, and agree to the operational boundaries defined herein.'
        ]
      }
    ]
  },
  {
    id: '47',
    sectionNumber: '47',
    title: '47. ZEN.PASSPORT & FOUNDING MEMBER PREREGISTRATION PERKS',
    subsections: [
      {
        number: '47.1',
        heading: 'Founding Member Designation & Priority Access',
        paragraphs: [
          'Users who preregister for ZENVITRA prior to official platform launch are granted exclusive Founding Member status on their ZEN.PASSPORT.',
          'Founding Member benefits include: permanent Founding Member profile badge, unique immutable preregistration ID, digital membership credential, early platform access and prioritized beta feature rollouts, priority event registration windows, exclusive access to the ZEN.INNER CIRCLE early community, and a Founding Member digital certificate.',
          'Preregistration perks are linked to the verified user account, carry zero cash redeemability, and cannot be scalped, auctioned, or transferred.'
        ]
      }
    ]
  },
  {
    id: '48',
    sectionNumber: '48',
    title: '48. STRICT DATA INTEGRITY LAW & ZERO-SEEDED ACCOUNTS COVENANT',
    subsections: [
      {
        number: '48.1',
        heading: 'Absolute Prohibition of Synthetic, Seeded, or Mock Entities',
        paragraphs: [
          'ZENVITRA is governed by an immutable platform Data Integrity Law: NO SEEDED ACCOUNTS AND NO SEEDED DATA ARE PERMITTED ON THE PLATFORM.',
          'All user accounts, profiles, followers, post counts, conference tickets, attendee records, and committee matrix allocations must originate exclusively from verified human users and authentic event organizers. The platform strictly prohibits the injection of mock accounts, simulated social proof, or fake metrics.',
          'Users and conference organizers covenant that all submitted registrations, delegation rosters, and published conference details are authentic and unmanipulated. Any attempt to inject bot followers, synthetic delegate rosters, or fictitious attendance records will result in immediate disqualification and platform expulsion.'
        ]
      }
    ]
  },
  {
    id: '49',
    sectionNumber: '49',
    title: '49. ZEN.SOLUTIONS & COLLABORATIVE RESOLUTION DRAFTING',
    subsections: [
      {
        number: '49.1',
        heading: 'Intellectual Attribution & Legislative Format Rights',
        paragraphs: [
          'Delegates creating, co-sponsoring, or amending draft resolutions, working papers, or parliamentary bills through ZEN.SOLUTIONS retain moral attribution as contributors.',
          'By tabling a draft resolution or amendment before a committee, contributors grant the conference and ZENVITRA a non-exclusive license to display, archive, circulate, and export the document in official United Nations or Lok Sabha legislative formats for academic, educational, and conference purposes.'
        ]
      }
    ]
  },
  {
    id: '50',
    sectionNumber: '50',
    title: '50. EMERGENCY BROADCAST GOVERNANCE & PROTOCOL COMPLIANCE',
    subsections: [
      {
        number: '50.1',
        heading: 'Secretariat Strict Liability for Emergency Alerts',
        paragraphs: [
          'Emergency protocol broadcasts (Amber/Red alerts) issued through the ZEN.MUN Conference Command Centre bypass normal notification silences to reach all active delegates and Secretariat personnel.',
          'The issuing Secretariat assumes strict responsibility for the veracity and necessity of every alert. Using emergency broadcast channels for commercial promotion, jokes, prank announcements, or false alarms constitutes a material breach of these Terms, subjecting the issuing officer to immediate credential revocation, account termination, and accountability for any resulting disruption or damages.'
        ]
      }
    ]
  },
  {
    id: '51',
    sectionNumber: '51',
    title: '51. ZEN.SOLUTIONS DRAFTING STUDIO, DOCUMENT INTEROPERABILITY & PERMISSIONS',
    subsections: [
      {
        number: '51.1',
        heading: 'Multi-Format Ingestion & Intelligent Structural Extraction',
        paragraphs: [
          'The ZEN.SOLUTIONS Drafting Studio enables delegates and authors to upload or connect source files (including PDF, DOCX, TXT, Markdown, and ZEN.DOCS) and automatically convert them into formalized legislative bills, UN multilateral draft resolutions, treaties, or policy whitepapers.',
          'Authors represent and warrant that they possess all necessary rights and authorizations to the text and files uploaded into the Studio. The automated extraction tools and Leftover Review interfaces are provided as drafting aids; authors remain strictly responsible for reviewing and confirming the final statutory accuracy of all extracted chapters, clauses, subclauses, schedules, tables, and financial charts prior to publication.'
        ]
      },
      {
        number: '51.2',
        heading: 'Original Document Attachment & Download Rights',
        paragraphs: [
          'Authors may optionally bundle the original uploaded source file (PDF/Word/Markdown) with their published solution. Authors retain exclusive control over the "Allow Original Document Download" privacy toggle.',
          'When public download is enabled by the author, community members receive a non-exclusive license to download the authentic file for academic evaluation, research, and non-commercial debate. When disabled, the file may be viewed in the browser reader without a public download permit.'
        ]
      }
    ]
  },
  {
    id: '52',
    sectionNumber: '52',
    title: '52. STATUTORY TWO-REVISION MAXIMUM ON PUBLISHED LEGISLATIVE PROPOSALS',
    subsections: [
      {
        number: '52.1',
        heading: 'The Two-Revision Cap & Deliberative Finality',
        paragraphs: [
          'In order to safeguard the integrity of citizen voting, sponsor signatures, and floor debates, every sovereign bill or draft resolution published on ZEN.SOLUTIONS is subject to a strict statutory limit of at most two (2) author revisions post-publication.',
          'Upon publishing the second revision (Revision 2/2), the bill is irrevocably locked against further direct edits by the author. Any subsequent changes, modifications, or deletions must be proposed and passed on the floor as formal amendments under the Chamber Rules of Procedure.'
        ]
      },
      {
        number: '52.2',
        heading: 'Anti-Tampering & Co-Sponsor Safeguard',
        paragraphs: [
          'This revision limitation prevents dishonest practices such as retroactive alteration of text after securing co-signatories or citizen endorsements. Attempting to circumvent the two-revision limit via database exploits or automated scripts constitutes a material security breach.'
        ]
      }
    ]
  },
  {
    id: '53',
    sectionNumber: '53',
    title: '53. LEGISLATIVE AMENDMENT ARCHITECTURE, DIVISION VOTING & MERIT CREDITS',
    subsections: [
      {
        number: '53.1',
        heading: 'Unified Clause & Schedule Typesetting Standards',
        paragraphs: [
          'Amendments proposed under a bill must adhere to ZENVITRA\'s unified legislative formatting: each Clause must appear as one clearly defined block with all subclauses grouped together directly underneath the main heading.',
          'Full Schedule texts must likewise be grouped into unified legal blocks rather than fragmented UI cards, preserving original statutory language, cross-references, and legislative typography.'
        ]
      },
      {
        number: '53.2',
        heading: 'Amendment Consideration, Division Voting & Contributor Points',
        paragraphs: [
          'Proposed amendments are classified as Friendly (incorporated directly with author concurrence) or Unfriendly (subject to chamber debate and division voting with a timed voting countdown).',
          'Adopted amendments are permanently integrated into the bill\'s docket record, with non-monetary merit credits and co-sponsor contributor points awarded directly to the amending delegates upon formal adoption.'
        ]
      }
    ]
  },
  {
    id: '54',
    sectionNumber: '54',
    title: '54. SOVEREIGN HOLOGRAPHIC PASSPORT, TEST NODE & MERIT INTEGRITY',
    subsections: [
      {
        number: '54.1',
        heading: 'Personal & Non-Transferable Civic Credentials',
        paragraphs: [
          'The ZENVITRA Holographic Sovereign Passport constitutes an immutable, non-transferable record of an individual delegate\'s authenticated civic participation, passed solutions, chair appointments, and Model UN honors.',
          'Passports may not be transferred, sold, shared, or tokenized for commercial gain. Presenting fraudulent credentials, spoofing QR verification, or tampering with passport tiers results in permanent credential revocation.'
        ]
      },
      {
        number: '54.2',
        heading: 'Test Node Isolation & Abuse Prohibition',
        paragraphs: [
          'The Test Node is provided strictly for functional testing and platform exploration. Test sessions are sandboxed and must never be utilized to impersonate authentic users, bypass event pass requirements, submit bogus conference registrations, or manipulate voting tallies.'
        ]
      }
    ]
  }
];

// ─── DEDICATED UNDER-18 USER PROTECTION & PARENTAL CONSENT POLICY ───
// Compliant with Digital Personal Data Protection Act, 2023 & DPDP Rules, 2025
export const MINOR_PRIVACY_POLICY_DATA: LegalPart[] = [
  {
    partNumber: 'PART I',
    partTitle: 'OUR COMMITMENT & STATUTORY FOUNDATION',
    clauses: [
      {
        id: 'm-1',
        title: '1. OUR COMMITMENT TO YOUNG USERS',
        subsections: [
          {
            number: '1.1',
            heading: 'Sovereign Youth Sanctuary',
            paragraphs: [
              'ZENVITRA is a youth-focused platform for discussion, writing, debate, Model United Nations, events, collaboration, and creative expression. We recognise that many members of our community are under the age of 18.',
              'We are committed to protecting the privacy, safety, dignity, and personal information of young users. Participation in ZENVITRA must not require a young person to surrender unnecessary personal information or compromise their safety.'
            ]
          },
          {
            number: '1.2',
            heading: 'Users Under 18 & DPDP Framework',
            paragraphs: [
              'Under India\'s Digital Personal Data Protection Act, 2023 (DPDP Act) and the DPDP Rules, 2025, a child is defined as an individual who has not completed eighteen years of age.',
              'For users under the age of 18, ZENVITRA applies the statutory parental-consent and child-data safeguards required by applicable law. Where verifiable parental or lawful guardian consent is required, the relevant personal data will not be processed until that consent has been obtained and verified, subject to any applicable legal exception.',
              'A user may be asked to provide their date of birth or age information to determine which safeguards apply.'
            ]
          }
        ]
      }
    ]
  },
  {
    partNumber: 'PART II',
    partTitle: 'VERIFIABLE PARENTAL OR GUARDIAN CONSENT',
    clauses: [
      {
        id: 'm-2',
        title: '2. PARENTAL OR GUARDIAN CONSENT WORKFLOW',
        subsections: [
          {
            number: '2.1',
            heading: 'Scope of Parental Consent',
            paragraphs: [
              'A parent or lawful guardian may be required to review and approve a minor\'s participation in relevant ZENVITRA services.',
              'Depending on applicable legal requirements and the feature involved, this may include consent for: creating and maintaining an account; registering for events, MUNs, debates, workshops, or competitions; submitting applications for the Core Team, event staff, or other organisational roles; processing personal information required for participation, certificates, and event administration; and using communication, profile, publication, or collaboration features that process personal information.'
            ]
          },
          {
            number: '2.2',
            heading: 'Verification Standards',
            paragraphs: [
              'ZENVITRA uses an appropriate verification process to establish that the consenting person is an adult and is authorised to act as the user\'s parent or lawful guardian.',
              'Simply ticking a box or entering a parent\'s name will not be treated as sufficient verification where the law requires verifiable consent.'
            ]
          }
        ]
      }
    ]
  },
  {
    partNumber: 'PART III',
    partTitle: 'DATA COLLECTION & MINIMISATION',
    clauses: [
      {
        id: 'm-3',
        title: '3. INFORMATION WE COLLECT FROM MINORS',
        subsections: [
          {
            number: '3.1',
            heading: 'Strictly Limited Ingestion',
            paragraphs: [
              'Depending on the services used, ZENVITRA collects limited information such as: name, age or date of birth, and contact details; parent or guardian contact and consent-verification information; event registrations, committee preferences, applications, and participation records; documents, submissions, articles, and other content voluntarily provided by the user; and account security information and necessary technical logs.'
            ]
          },
          {
            number: '3.2',
            heading: 'Prohibition of Default Sensitive Document Ingestion',
            paragraphs: [
              'We seek to collect only the information reasonably necessary for specified educational and civic purposes.',
              'Government identity documents (such as Aadhaar), school identification cards, or other sensitive supporting documents are NOT requested by default merely because a user is under 18.'
            ]
          }
        ]
      }
    ]
  },
  {
    partNumber: 'PART IV',
    partTitle: 'HOW WE USE INFORMATION & ADVERTISING BANS',
    clauses: [
      {
        id: 'm-4',
        title: '4. HOW WE USE PERSONAL INFORMATION',
        subsections: [
          {
            number: '4.1',
            heading: 'Civic & Operational Purposes',
            paragraphs: [
              'Personal information may be used to operate accounts, administer events, communicate essential updates, verify eligibility, issue certificates, maintain platform security, prevent fraud, and provide requested services.'
            ]
          },
          {
            number: '4.2',
            heading: 'Absolute Ban on Targeted Advertising & Behavioural Tracking',
            paragraphs: [
              'We will not knowingly use a child\'s personal data for targeted advertising or engage in tracking or behavioural monitoring of children where prohibited by applicable law (including Section 9 of the DPDP Act).',
              'We will never sell a child\'s personal information as a commercial product.'
            ]
          }
        ]
      }
    ]
  },
  {
    partNumber: 'PART V',
    partTitle: 'PUBLIC PROFILES & SAFETY RESTRICTIONS',
    clauses: [
      {
        id: 'm-5',
        title: '5. PUBLIC PROFILES AND PUBLISHED CONTENT',
        subsections: [
          {
            number: '5.1',
            heading: 'Separation of Private Administrative and Public Data',
            paragraphs: [
              'Certain information, such as a display name, role, committee delegation, or voluntarily submitted article, may be visible to other users or the public if the relevant feature allows it.',
              'ZENVITRA clearly distinguishes between information required for internal administration and information intended for public display.'
            ]
          },
          {
            number: '5.2',
            heading: 'Protected Coordinate Invariant',
            paragraphs: [
              'A minor\'s home address, personal telephone number, private email address, identity documents, or parental contact details must NOT be displayed publicly by default or indexed in public search engine scrapers.',
              'Where publication requires consent or authorisation under applicable law, the relevant consent must be obtained before publication.'
            ]
          }
        ]
      }
    ]
  },
  {
    partNumber: 'PART VI',
    partTitle: 'THIRD PARTIES, RIGHTS & GRIEVANCES',
    clauses: [
      {
        id: 'm-6',
        title: '6. THIRD PARTIES, PARENTAL RIGHTS & CONTACT',
        subsections: [
          {
            number: '6.1',
            heading: 'Third-Party Services & Operational Safeguards',
            paragraphs: [
              'ZENVITRA may use external service providers for hosting, authentication, forms, payments, email delivery, document storage, and event administration.',
              'Personal information may be shared with such providers only as reasonably necessary for the relevant service and subject to applicable legal requirements and appropriate safeguards.'
            ]
          },
          {
            number: '6.2',
            heading: 'Parental Requests & Withdrawal of Consent',
            paragraphs: [
              'Subject to applicable law, a parent or lawful guardian may contact ZENVITRA to request information about the child\'s data, withdraw consent, request correction or erasure, or raise a privacy concern.',
              'After receiving and reasonably verifying such a request, ZENVITRA will assess it and take the required action within statutory legal timelines. Withdrawal of consent may affect the user\'s ability to use features that require the relevant personal information.'
            ]
          },
          {
            number: '6.3',
            heading: 'Technical Security & Purpose-Bound Retention',
            paragraphs: [
              'ZENVITRA implements reasonable technical and organisational safeguards to protect personal information against unauthorised access, disclosure, alteration, loss, or misuse.',
              'Information will be retained only for as long as necessary for the disclosed purpose or as otherwise required by law. Where appropriate, information will be deleted or de-identified when it is no longer needed.'
            ]
          },
          {
            number: '6.4',
            heading: 'Designated Privacy Contact & Grievance Officer',
            paragraphs: [
              'For parental consent verification, children\'s privacy requests, or grievances regarding personal information, contact our designated privacy desk:',
              'Platform: ZENVITRA — https://zenvitra.xyz | Designated Privacy Desk: privacy@zenvitra.xyz / support@zenvitra.xyz',
              'This policy operates together with ZENVITRA\'s Minor Terms of Service (/terms/minor) and any additional event-specific registration notices.'
            ]
          }
        ]
      }
    ]
  }
];

// ─── DEDICATED MINOR TERMS OF SERVICE & PARENTAL CONSENT ACCORD ───
// Tailored for users under 18 years of age & their parents/guardians
export const MINOR_TERMS_OF_SERVICE_DATA: LegalSection[] = [
  {
    id: '1',
    sectionNumber: '1',
    title: '1. ELIGIBILITY AND AGE DECLARATION',
    subsections: [
      {
        number: '1.1',
        heading: 'Accurate Age Representation',
        paragraphs: [
          'By creating an account, submitting an application, registering for an event, or using a feature that requires registration, the user confirms that the age information supplied is accurate to the best of their knowledge.',
          'Users must not misrepresent their age or another person\'s identity to bypass applicable consent or safety requirements.'
        ]
      }
    ]
  },
  {
    id: '2',
    sectionNumber: '2',
    title: '2. MANDATORY PARENTAL CONSENT WHERE REQUIRED',
    subsections: [
      {
        number: '2.1',
        heading: 'Parental Consent as a Prerequisite',
        paragraphs: [
          'Users under 18 must obtain the consent of a parent or lawful guardian wherever required by applicable law (including India\'s DPDP Act, 2023 and DPDP Rules, 2025) or by a specific ZENVITRA service.',
          'Where verifiable parental consent is legally required, ZENVITRA may restrict account activation, personal-data processing, publication, event registration, or other relevant features until the required verification is complete.',
          'A user\'s own acceptance of these Terms does not replace legally required parental consent.'
        ]
      }
    ]
  },
  {
    id: '3',
    sectionNumber: '3',
    title: '3. PARENT OR GUARDIAN DECLARATION',
    subsections: [
      {
        number: '3.1',
        heading: 'Five Affirmative Guardian Confirmations',
        paragraphs: [
          'Where the consent workflow requests it, the parent or lawful guardian confirms that: (1) They are at least 18 years old and are the user\'s parent or lawful guardian; (2) They have reviewed the relevant privacy notice and understand the purposes for which the specified personal information will be processed; (3) They authorise the processing described in the consent request, to the extent permitted by applicable law; (4) They understand how to contact ZENVITRA to raise a concern or withdraw consent where permitted; (5) The information they provide for consent verification is accurate to the best of their knowledge.',
          'ZENVITRA may require additional verification appropriate to the applicable legal requirements. Consent must not be obtained through misleading, bundled, or coercive practices.'
        ]
      }
    ]
  },
  {
    id: '4',
    sectionNumber: '4',
    title: '4. PARTICIPATION IN EVENTS, MUNS & ACTIVITIES',
    subsections: [
      {
        number: '4.1',
        heading: 'Distinct Event Approvals & Clear Disclosures',
        paragraphs: [
          'Parental consent for platform data processing does not automatically constitute consent to every event, publication, recording, photograph, payment, travel arrangement, or other activity.',
          'Where a particular event or activity requires separate parental authorisation, ZENVITRA or the relevant organiser may request that authorisation independently.',
          'Event organisers must clearly disclose any material participation conditions, applicable fees, recording arrangements, and intended publication of participant information.'
        ]
      }
    ]
  },
  {
    id: '5',
    sectionNumber: '5',
    title: '5. USER CONDUCT, DECORUM AND SAFETY',
    subsections: [
      {
        number: '5.1',
        heading: 'Freedom of Expression with Mutual Respect',
        paragraphs: [
          'All users must respect other participants, follow applicable community rules, and refrain from harassment, impersonation, threats, unlawful disclosure of private information, and misuse of the platform.',
          'Being under 18 does not remove a user\'s right to express an opinion, debate, or question. However, users must comply with applicable law, constitutional principles, and reasonable safety measures.'
        ]
      }
    ]
  },
  {
    id: '6',
    sectionNumber: '6',
    title: '6. SUSPENSION, CONSENT WITHDRAWAL & DISPUTE RESOLUTION',
    subsections: [
      {
        number: '6.1',
        heading: 'Proportionate Resolution Framework',
        paragraphs: [
          'Where required consent is missing, invalid, withdrawn, or no longer applicable, ZENVITRA may suspend the affected feature, request renewed verification, or restrict the account as reasonably necessary to comply with applicable law.',
          'Any such action should be proportionate, explained where appropriate, and accompanied by a reasonable process for resolving errors or appealing decisions.'
        ]
      }
    ]
  },
  {
    id: '7',
    sectionNumber: '7',
    title: '7. NO WAIVER OF STATUTORY LEGAL RIGHTS',
    subsections: [
      {
        number: '7.1',
        heading: 'Mandatory Legal Supremacy',
        paragraphs: [
          'Nothing in these Terms removes any statutory right or protection available to a child, parent, or lawful guardian under applicable law.',
          'If a provision of these Terms conflicts with mandatory legal requirements (including India\'s DPDP framework), the applicable legal requirements will strictly prevail.'
        ]
      }
    ]
  },
  {
    id: '8',
    sectionNumber: '8',
    title: '8. ACCEPTANCE AND VERIFICATION GATE',
    subsections: [
      {
        number: '8.1',
        heading: 'Affirmative Consent Control',
        paragraphs: [
          'By selecting the relevant acceptance control, the user confirms that they have read and understood these Terms.',
          'Where the user is under 18 and verifiable parental consent is required, the platform must separately obtain and verify the parent\'s or lawful guardian\'s consent before processing the relevant personal data.'
        ]
      }
    ]
  }
];

// ─── FAQ & HELP KNOWLEDGEBASE ───

export interface LegalFAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const PRIVACY_POLICY_FAQS: LegalFAQ[] = [
  {
    id: 'priv-faq-1',
    category: 'Drafting Studio & AI',
    question: 'Does Zenvitra sell, share, or train AI models on my drafted bills or uploaded documents?',
    answer: 'No. Under our Zero-Surveillance Invariant and Part XXIII of this Privacy Policy, all files uploaded to the ZEN.SOLUTIONS Drafting Studio (PDF, DOCX, TXT, Markdown) and drafts imported from ZEN.DOCS are processed strictly in ephemeral memory for structural entity extraction (chapters, clauses, schedules, tables, graphs). Your research, legislative drafts, and uploaded source documents are NEVER used to train, fine-tune, or reinforce foundational commercial AI models.'
  },
  {
    id: 'priv-faq-2',
    category: 'Document Permissions',
    question: 'How does the Original Document Read & Download privacy toggle work in ZEN.SOLUTIONS?',
    answer: 'When you upload an original source file (PDF, Word, or Markdown), Zenvitra attaches it alongside your structured legislative bill. You maintain complete control via the "Allow original document download" toggle. When disabled, community members can read the bill through the on-screen Gazette viewer, but cannot download the raw uploaded source file, protecting your copyright and dissemination preferences.'
  },
  {
    id: 'priv-faq-3',
    category: 'Legislative Integrity',
    question: 'Why is there a statutory 2-revision limit on published bills, and how does it protect civic debate?',
    answer: 'Once published, an author may only submit up to two (2) direct revisions to their bill (Revision 1/2 and Revision 2/2). This anti-tampering invariant prevents covert retroactive alterations after co-sponsors have signed or citizens have voted. All revision counts and timestamps are transparently displayed on the sovereign ledger. Any subsequent modifications must be formally tabled as floor amendments.'
  },
  {
    id: 'priv-faq-4',
    category: 'Session Security',
    question: 'Does using the Test Node compromise, overwrite, or leak my real user profile, avatar, or passport?',
    answer: 'No. When you activate Test Mode (/test-login or Continue as Test User), your authentic authenticated session, OAuth tokens, profile avatar, and Holographic Passport are encrypted into a secure local backup vault (zenvitra_real_user_session_backup). The test environment operates inside an ephemeral sandbox under zen_test_pilot_node. Upon exiting via "Leave Test Mode" or closing the tab, your authentic account is cleanly restored with zero profile thrashing.'
  },
  {
    id: 'priv-faq-5',
    category: 'Data Integrity',
    question: 'How does Zenvitra enforce the Strict Zero-Seeded Data Law across the platform?',
    answer: 'Under our Constitutional Genesis Lock, Zenvitra categorically prohibits seeded accounts, fake attendees, artificial follower counts, and mock event tickets. State stores initialize strictly empty ([]), and all records must originate from verified human actions and authentic database collections.'
  },
  {
    id: 'priv-faq-6',
    category: 'Payments & Banking',
    question: 'How are payments, card credentials, and UPI transactions processed securely?',
    answer: 'All payments are processed through Cashfree Payment Gateway (PG API 2025-01-01) under PCI-DSS Level 1 compliance. Complete credit/debit card numbers, CVVs, and banking passwords are never stored on Zenvitra servers. The platform supports UPI QR, UPI Collect, Netbanking, and Cards, with automated statutory GST tax invoicing and encrypted webhook verification.'
  },
  {
    id: 'priv-faq-7',
    category: 'Minors & Students',
    question: 'What privacy safeguards protect students and delegates under 18 years of age?',
    answer: 'In compliance with India\'s Digital Personal Data Protection Act, 2023 and DPDP Rules, 2025, Zenvitra strictly bans behavioral tracking pixels, commercial profiling, and targeted advertising directed at children. Where legally required, verifiable parental consent workflows are executed prior to personal data processing.'
  },
  {
    id: 'priv-faq-8',
    category: 'Data Rights',
    question: 'How do I download my complete civic data or permanently delete my account?',
    answer: 'You retain full cryptographic data sovereignty. You can export a complete JSON snapshot of your civic dossier from Settings > Security Vault, or request permanent account deletion via /settings?tab=privacy or by emailing privacy@zenvitra.xyz. Upon identity verification, all non-statutory records are irrevocably purged.'
  }
];

export const TERMS_OF_SERVICE_FAQS: LegalFAQ[] = [
  {
    id: 'tos-faq-1',
    category: 'Bills & Legislation',
    question: 'What is the 2-edit limit on bills in ZEN.SOLUTIONS, and how does it work?',
    answer: 'Every sovereign bill or multilateral resolution published in ZEN.SOLUTIONS carries a statutory cap of at most two (2) author revisions post-publication. Once 2/2 edits are used, the bill is permanently locked against direct editing to protect voter and co-sponsor integrity. Any subsequent modifications must be proposed on the floor as chamber amendments.'
  },
  {
    id: 'tos-faq-2',
    category: 'Copyright & Ownership',
    question: 'Who owns the copyright to solutions, bills, and resolutions drafted in the Studio?',
    answer: 'You retain moral attribution and full ownership of your intellectual creations, original legislative solutions, and research papers. By tabling a document on Zenvitra, you grant the platform a non-exclusive license to display, archive, and format it in official parliamentary and UN layouts for educational and civic deliberation.'
  },
  {
    id: 'tos-faq-3',
    category: 'Original Document Downloads',
    question: 'Can other delegates download my raw uploaded PDF or Word document without permission?',
    answer: 'Not if you disable public downloads. In the Drafting Studio, you can toggle off "Allow original document download". When disabled, other users can only read the parsed text in the Gazette viewer, and cannot download your source file.'
  },
  {
    id: 'tos-faq-4',
    category: 'Amendments & Floor Debate',
    question: 'How do amendments proposed by other delegates work under a published bill?',
    answer: 'Delegates can propose amendments to specific clauses. Friendly amendments can be adopted directly with the author\'s concurrence. Unfriendly amendments are put to a chamber division vote with a timed voting countdown. Adopted amendments are formatted in continuous legislative blocks and recorded in the right-hand docket, awarding contributor merit points.'
  },
  {
    id: 'tos-faq-5',
    category: 'Platform Rules',
    question: 'What happens if someone violates the Strict Zero-Seeded Data Law by creating fake accounts or metrics?',
    answer: 'Zenvitra enforces a zero-tolerance policy against synthetic accounts, bot followers, fake conference tickets, and fictitious attendee rosters. Any user or organizer found injecting artificial data faces immediate credential revocation, conference cancellation, and permanent expulsion.'
  },
  {
    id: 'tos-faq-6',
    category: 'Test Node Usage',
    question: 'Can I use the Test Node to bypass event ticketing or register for real conferences?',
    answer: 'No. The Test Node is strictly for functional evaluation and software testing. Using test sessions to fraudulently access paid summits, bypass gate scanners, or submit bogus registrations violates our Terms and constitutes unauthorized system access.'
  },
  {
    id: 'tos-faq-7',
    category: 'Ticketing & Refunds',
    question: 'What is Zenvitra\'s refund and pass cancellation policy?',
    answer: 'Conference pass ticket prices and refund conditions are determined directly by the verified conference organizers and displayed at checkout. Flat platform fees (₹9 standard, ₹5 for Pulse Pass, ₹0 for Pulse Elite) support secure banking gateway infrastructure and are non-refundable except upon event cancellation.'
  },
  {
    id: 'tos-faq-8',
    category: 'Disputes & Conduct',
    question: 'How does Zenvitra resolve disputes between delegates, authors, or organizers?',
    answer: 'Disputes are resolved through our progressive due-process framework and Community Jury tribunals governed by Constitution Articles IX and XI. Concerns can be formally lodged with the Grievance Officer at grievance@zenvitra.xyz.'
  }
];

