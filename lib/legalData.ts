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
    purpose: 'Process membership subscriptions, conference passes, and calculate student tax exemption (0.5% + ₹19) or tiered GST (5% / 12%).',
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
          { number: '10.3', heading: 'Public Posts', paragraphs: ['Public posts may be accessible outside ZENVITRA and may be indexed by search engines or shared by other users. Treat deliberately public Content as information that may travel beyond the interface.'] }
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
          { number: '14.10', heading: 'Awards', paragraphs: ['Award decisions are made by conference organizers or authorized Executive Board personnel. ZEN.MUN provides technical records to assist decisions but does not independently determine awards.'] }
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
        title: '17. ZEN.LEGISLATE',
        subsections: [
          { number: '17.1', heading: 'Legislative Documents', paragraphs: ['Processes bills, clauses, amendments, sponsors, co-sponsors, legislative history, committee assignments, readings, votes, reports, constitutional articles, and related metadata.'] },
          { number: '17.2', heading: 'Version History', paragraphs: ['Retains previous versions of legislative proposals to allow participants to trace changes over time.'] },
          { number: '17.3', heading: 'Public Legislative Records', paragraphs: ['If a legislative simulation makes its records public, relevant bills, amendments, and voting results become publicly accessible.'] }
        ]
      },
      {
        id: '18',
        title: '18. ZEN.PAYMENTS',
        subsections: [
          { number: '18.1', heading: 'Payment Transactions', paragraphs: ['Processes transaction identifiers, payment status, amount, currency, payment method type, billing info, refund status, subscription info, and fraud-prevention records.'] },
          { number: '18.2', heading: 'Card Information', paragraphs: ['Where a third-party payment processor handles payment cards, ZENVITRA does not receive or store complete payment-card numbers.'] },
          { number: '18.3', heading: 'Financial Records', paragraphs: ['Transaction records are retained for accounting, tax, legal, dispute-resolution, fraud-prevention, and regulatory compliance.'] }
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
    partTitle: 'CHILDREN AND YOUNG USERS',
    clauses: [
      {
        id: '37',
        title: '37. CHILDREN\'S DATA',
        subsections: [
          { number: '37.1', heading: 'Applicable Law & DPDP 2025 Framework', paragraphs: ['ZENVITRA applies age-related privacy and consent requirements. India\'s Digital Personal Data Protection framework (DPDP Rules, 2025) imposes strict requirements concerning verifiable parental or lawful-guardian consent, with absolute bans on behavioural monitoring, tracking, and targeted advertising directed at children.'] },
          { number: '37.2', heading: 'Age Information', paragraphs: ['May request age or date-of-birth information to determine eligibility and apply age-appropriate protections.'] },
          { number: '37.3', heading: 'Parental or Guardian Consent', paragraphs: ['Where required, verifiable parental consent is collected prior to processing children\'s personal data.'] },
          { number: '37.4', heading: 'Children\'s Advertising', paragraphs: ['Zero targeted advertising or commercial profiling is directed toward verified child accounts.'] },
          { number: '37.5', heading: 'Youth Events', paragraphs: ['Organizers of youth events and school MUNs are independently responsible for complying with legal child data protection obligations.'] }
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
    title: '3. ELIGIBILITY AND AGE REQUIREMENTS',
    subsections: [
      {
        number: '3.1',
        heading: 'Minimum Eligibility & Age Standards',
        paragraphs: [
          'You may use ZENVITRA only if you satisfy the age and eligibility requirements applicable to the Service and jurisdiction in which you access it. Different ZENVITRA services may have different age requirements where required by law, safety considerations, contractual requirements, or the nature of the service.',
          'You must provide truthful age-related information when requested. You may not deliberately misrepresent your age in order to access a Service for which you are not eligible.'
        ]
      },
      {
        number: '3.2',
        heading: 'Parental or Guardian Consent',
        paragraphs: [
          'Where applicable law (including India’s DPDP Rules, 2025) requires parental or lawful-guardian consent before ZENVITRA may process information belonging to a child or allow access to a particular service, ZENVITRA may require an appropriate verifiable consent mechanism. ZENVITRA may restrict functionality until such consent has been obtained or verified.'
        ]
      },
      {
        number: '3.3',
        heading: 'Youth and Educational Services',
        paragraphs: [
          'Certain ZENVITRA services may be specifically designed for students, youth organizations, educational programs, MUN conferences, debate programs, or similar communities. Participation in such services does not eliminate applicable privacy, safety, consent, or age requirements. If ZENVITRA reasonably determines that an account contains materially false age or eligibility information, ZENVITRA may restrict or suspend the relevant account.'
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
    title: '13. ZEN.MUN',
    subsections: [
      {
        number: '13.1',
        heading: 'Model UN Simulations & Parliamentary Formats',
        paragraphs: [
          'ZEN.MUN provides technology for Model United Nations and Indian Parliamentary simulations. The host secretariat controls committee agendas, rules of procedure, delegate allocations, and voting. Indian parliamentary simulations support bills, amendments, readings, and clause-by-clause votes.'
        ]
      }
    ]
  },
  {
    id: '14',
    sectionNumber: '14',
    title: '14. ZEN.MUN ATTENDANCE AND PARTICIPATION',
    subsections: [
      {
        number: '14.1',
        heading: 'Procedural Tracking',
        paragraphs: [
          'ZEN.MUN records attendance (Present, Present & Voting, Absent) and committee actions (speeches, motions, points, POIs). Participation statistics represent technical activity and do not automatically constitute a final qualitative judgment of delegate merit.'
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
    title: '17. ZEN.LEGISLATE',
    subsections: [
      {
        number: '17.1',
        heading: 'Simulated Legislative Material',
        paragraphs: [
          'Draft bills, clauses, and amendments created in ZEN.LEGISLATE represent educational or simulation exercises and carry no actual governmental authority or official statutory force.'
        ]
      }
    ]
  },
  {
    id: '18',
    sectionNumber: '18',
    title: '18. ZEN.PAYMENTS',
    subsections: [
      {
        number: '18.1',
        heading: 'Transaction Accuracy & Refunds',
        paragraphs: [
          'Users must provide truthful billing information. Payment card processing is handled by PCI-compliant third-party providers. Refund eligibility is determined by the specific subscription terms, event organizer policy, and applicable law.'
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
  }
];
