export interface EventPostTemplate {
  title: string;
  department: string;
  slots: number;
  description: string;
  responsibilities: string[];
  requirements: string[];
}

export interface RecruitmentCategoryTemplate {
  category: string;
  name: string;
  tagline: string;
  posts: EventPostTemplate[];
}

export const RECRUITMENT_TEMPLATES: RecruitmentCategoryTemplate[] = [
  {
    category: 'MUN',
    name: 'Model United Nations & Diplomacy',
    tagline: 'Recruit Secretariat, Executive Board, Committee Dais, and Operations staff.',
    posts: [
      {
        title: 'Director-General / Deputy Secretary-General',
        department: 'Secretariat',
        slots: 2,
        description: 'Oversee substantive chamber agendas, dais appointments, and diplomatic protocol enforcement.',
        responsibilities: [
          'Coordinate committee study guides and dais briefings',
          'Supervise delegate affairs and resolution management',
          'Liaise with institution leadership and advisory board'
        ],
        requirements: [
          'Minimum 4+ previous Model UN experiences',
          'Demonstrated diplomatic leadership and crisis handling skills'
        ]
      },
      {
        title: 'Under-Secretary-General (Delegate Affairs)',
        department: 'Secretariat',
        slots: 2,
        description: 'Lead institutional outreach, delegate allocations, matrix assignments, and queries.',
        responsibilities: [
          'Manage country/portfolio matrix allocations',
          'Coordinate delegate onboarding and chamber credentials',
          'Handle pre-conference inquiries and registration desk'
        ],
        requirements: [
          'Strong organizational and communication capabilities',
          'Prior experience in delegate relations or customer liaison'
        ]
      },
      {
        title: 'Committee Chairperson / Dais Moderator',
        department: 'Executive Board',
        slots: 6,
        description: 'Preside over parliamentary debate, roll call, speakers queue, and resolution voting.',
        responsibilities: [
          'Author official committee background guide and crisis scenario',
          'Enforce rules of procedure and ensure rigorous diplomatic discourse',
          'Evaluate delegate performance and author award citations'
        ],
        requirements: [
          'Substantive expertise in international law or diplomacy',
          'Prior executive board or high-caliber delegate experience'
        ]
      },
      {
        title: 'International Press Editor & Media Lead',
        department: 'Press & Media',
        slots: 3,
        description: 'Lead conference newsroom, press conferences, photojournalism, and daily wire dispatches.',
        responsibilities: [
          'Direct international press reporters and camera crew',
          'Publish official conference communique and daily press wire',
          'Cover crisis updates and executive briefings'
        ],
        requirements: [
          'Experience in journalism, editorial writing, or digital media',
          'Familiarity with press framing and multimedia production'
        ]
      },
      {
        title: 'Head of Operations & Logistics',
        department: 'Organising Committee',
        slots: 4,
        description: 'Coordinate physical chamber arrangements, stage acoustics, tech setups, and catering.',
        responsibilities: [
          'Supervise venue layouts and dais hardware',
          'Manage check-in gates, attendee passes, and emergency protocols',
          'Coordinate volunteer deployment across committees'
        ],
        requirements: [
          'High adaptability, problem solving, and on-ground execution ability'
        ]
      }
    ]
  },
  {
    category: 'DEBATE',
    name: 'Debate Tournaments & Adjudication',
    tagline: 'Appoint Adjudication Core, Tabulation Directors, and Room Moderators.',
    posts: [
      {
        title: 'Chief Adjudicator / Adjudication Core',
        department: 'Adjudication Core',
        slots: 2,
        description: 'Set motion pool, briefing standards, and tournament adjudication rubrics.',
        responsibilities: [
          'Author balanced, multi-tier debate motions',
          'Conduct judge briefing and feedback calibration',
          'Handle tournament complaints and equity enforcement'
        ],
        requirements: [
          'Proven record in parliamentary debate adjudication and break rounds'
        ]
      },
      {
        title: 'Tournament Director & Tabulation Lead',
        department: 'Organising Committee',
        slots: 2,
        description: 'Manage tournament schedules, round pairings, speaker scores, and tab room software.',
        responsibilities: [
          'Run automated pairings and speaker point records',
          'Ensure strict punctuality across break rounds',
          'Verify official finals tabulation'
        ],
        requirements: [
          'Detail-oriented with experience in tournament tabulation'
        ]
      }
    ]
  },
  {
    category: 'SUMMIT',
    name: 'Conferences, Summits & Hackathons',
    tagline: 'Universal staffing for youth summits, tech conferences, and innovation sprints.',
    posts: [
      {
        title: 'Technical & Web Lead',
        department: 'Design & Tech',
        slots: 2,
        description: 'Manage digital registrations, projector livestreams, and technology command.',
        responsibilities: [
          'Ensure seamless WiFi, display screens, and presentation hardware',
          'Manage attendee pass scanners and check-in portals',
          'Support hybrid streaming rooms and digital submissions'
        ],
        requirements: [
          'Technical proficiency with web tools, AV hardware, and networking'
        ]
      },
      {
        title: 'Public Relations & Partnerships Executive',
        department: 'Public Relations',
        slots: 3,
        description: 'Drive institutional partnerships, sponsor liaison, and dignitary hospitality.',
        responsibilities: [
          'Communicate with invited guest speakers and sponsors',
          'Manage VIP welcome protocols and ceremony logistics',
          'Coordinate post-summit gratitude and feedback'
        ],
        requirements: [
          'Excellent written & verbal communication and professional etiquette'
        ]
      },
      {
        title: 'Event Volunteer & Liaison Officer',
        department: 'Volunteers',
        slots: 10,
        description: 'First line of on-ground guidance, ushering attendees, and session support.',
        responsibilities: [
          'Guide delegates and guests across conference halls',
          'Distribute kits, badges, and session schedules',
          'Assist committee chairs and speakers with microphones and chits'
        ],
        requirements: [
          'Enthusiasm, punctuality, and eagerness to learn event operations'
        ]
      }
    ]
  }
];

export interface TeamRoleTemplate {
  teamName: string;
  role: string;
  description: string;
}

export interface TeamStructureTemplate {
  category: string;
  name: string;
  tagline: string;
  roles: TeamRoleTemplate[];
}

export const TEAM_STRUCTURE_TEMPLATES: TeamStructureTemplate[] = [
  {
    category: 'MUN',
    name: 'Model United Nations & Diplomacy',
    tagline: 'Standard dais and secretariat leadership hierarchy.',
    roles: [
      { teamName: 'Secretariat', role: 'Secretary-General', description: 'Overall conference executive and diplomatic lead.' },
      { teamName: 'Secretariat', role: 'Director-General', description: 'Head of substantive affairs and committee operations.' },
      { teamName: 'Secretariat', role: 'Under-Secretary-General (Delegate Affairs)', description: 'Manages matrix assignments and delegate communications.' },
      { teamName: 'Executive Board', role: 'UNHRC Chairperson', description: 'Presides over Human Rights Council debates and resolution draftings.' },
      { teamName: 'Executive Board', role: 'UNSC President', description: 'Presides over Security Council crisis and resolution sessions.' },
      { teamName: 'Organising Committee', role: 'Head of Operations', description: 'Oversees venue management, check-in desks, and logistics.' },
      { teamName: 'Media & Press', role: 'Editor-in-Chief', description: 'Leads the international press corps and official conference dispatches.' }
    ]
  },
  {
    category: 'DEBATE',
    name: 'Debate Tournaments & Adjudication',
    tagline: 'Adjudication core and tournament directors.',
    roles: [
      { teamName: 'Adjudication Core', role: 'Chief Adjudicator', description: 'Sets motions and presides over judge briefings and scores.' },
      { teamName: 'Adjudication Core', role: 'Deputy Chief Adjudicator', description: 'Oversees equity guidelines and room allocations.' },
      { teamName: 'Tabulation', role: 'Tabulation Director', description: 'Runs pairing algorithms and speaker standings.' },
      { teamName: 'Moderators', role: 'House Speaker / Room Moderator', description: 'Times speeches and enforces parliamentary rules of order.' }
    ]
  },
  {
    category: 'HACKATHON',
    name: 'Hackathons & Tech Summits',
    tagline: 'Mentors, judges, and technical leads.',
    roles: [
      { teamName: 'Mentors', role: 'Lead Technical Mentor', description: 'Guides participant teams on software architecture and APIs.' },
      { teamName: 'Judges', role: 'Grand Jury Member', description: 'Evaluates product prototypes and technical rigor.' },
      { teamName: 'Technical Crew', role: 'Infrastructure Lead', description: 'Maintains cloud environments, Wi-Fi, and presentation hardware.' }
    ]
  },
  {
    category: 'FESTIVAL',
    name: 'Festivals & Youth Showcases',
    tagline: 'Hosts, backstage managers, and hospitality leads.',
    roles: [
      { teamName: 'Hosts & MCs', role: 'Master of Ceremonies', description: 'Presides over opening plenaries and awards ceremonies.' },
      { teamName: 'Production', role: 'Stage Manager', description: 'Coordinates stage lighting, live acoustics, and artist line-ups.' },
      { teamName: 'Guest Relations', role: 'Dignitary Protocol Lead', description: 'Handles VIP guest reception and institutional hospitality.' }
    ]
  }
];
