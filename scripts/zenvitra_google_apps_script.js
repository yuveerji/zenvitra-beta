/**
 * ==============================================================================
 * ZENVITRA MASTER OMNI-STREAM, FORMS & MATRIX ENGINE — GOOGLE APPS SCRIPT (v5.0)
 * ==============================================================================
 * Unified Enterprise Apps Script Engine combining:
 * 1.  ZEN DIPLOMACY MUN (Delegate Registrations, pass tiers, payments & preferences)
 * 2.  SECRETARIAT APPLICATIONS (10 Department & sector selection cards, SOP, tasks)
 * 3.  LIVE MATRIX PORTFOLIOS (240 official committee seats across AIPPM, EMI, UNSC & ECOSOC, 2-way sync with /matrix)
 * 4.  EVENT REGISTRATIONS (Pass bookings, custom countries, tier allocations & prices)
 * 5.  DONATIONS & CHARITY RELIEF (Primary relief contributions & UTR tracking)
 * 6.  IMPACT LEDGER (Public transparency & voluntary relief ledger)
 * 7.  REGISTER DATA CORE (User registrations & digital identity ledger)
 * 8.  LOGIN DATA CORE (Authentication audit & security telemetry)
 * 9.  CAMPUS AMBASSADORS (Student chapter leader accreditation)
 * 10. CORE TEAM APPLICATIONS (Founding wing applications & bandwidth commitments)
 * 11. CONTACT INQUIRIES (Diplomatic contact & public support inquiries)
 * 12. NEWSLETTER SUBSCRIBERS (Email subscriptions & consent tracking)
 * 13. COLLAB & PARTNERSHIPS (Institutional alliances & conference partnerships)
 * 14. COMMUNITY MEMBERS (Grassroots youth network & skills directory)
 * 15. FEEDBACK & GRIEVANCE (Platform tickets, resolution audits & bug reports)
 * 16. DYNAMIC ZENFORMS SCHEMA SYNC (Auto-creates columns when questions are added/edited)
 * ==============================================================================
 * ONE-CLICK SETUP IN APPS SCRIPT:
 * 1. Select function "initAllTabs" in the toolbar dropdown and click "▷ Run".
 * 2. Review and Allow permissions.
 * 3. Deploy > New deployment > Web app > Execute as "Me", Access "Anyone".
 * 4. Copy the Web App URL!
 * ==============================================================================
 */

// ── OFFICIAL 240 COMMITTEE PORTFOLIOS FOR LIVE MATRIX (AIPPM 60, EMI 60, UNSC 60, ECOSOC 60) ──
var INITIAL_MATRIX_PORTFOLIOS = [
  { id: "aippm_01", committee: "AIPPM", title: "Narendra Modi", subTitle: "Prime Minister of India / Varanasi MP", category: "BJP", status: 'Vacant', difficulty: "Advanced" },
  { id: "aippm_02", committee: "AIPPM", title: "Amit Shah", subTitle: "Minister of Home Affairs / Gandhinagar MP", category: "BJP", status: 'Vacant', difficulty: "Advanced" },
  { id: "aippm_03", committee: "AIPPM", title: "Rajnath Singh", subTitle: "Minister of Defence / Lucknow MP", category: "BJP", status: 'Vacant', difficulty: "Intermediate" },
  { id: "aippm_04", committee: "AIPPM", title: "Nirmala Sitharaman", subTitle: "Minister of Finance & Corporate Affairs", category: "BJP", status: 'Vacant', difficulty: "Intermediate" },
  { id: "aippm_05", committee: "AIPPM", title: "S. Jaishankar", subTitle: "Minister of External Affairs", category: "BJP", status: 'Vacant', difficulty: "Advanced" },
  { id: "aippm_06", committee: "AIPPM", title: "Nitin Gadkari", subTitle: "Minister of Road Transport & Highways / Nagpur MP", category: "BJP", status: 'Vacant', difficulty: "Beginner" },
  { id: "aippm_07", committee: "AIPPM", title: "J. P. Nadda", subTitle: "Union Health Minister & BJP National President", category: "BJP", status: 'Vacant', difficulty: "Intermediate" },
  { id: "aippm_08", committee: "AIPPM", title: "Shivraj Singh Chouhan", subTitle: "Minister of Agriculture & Rural Development", category: "BJP", status: 'Vacant', difficulty: "Intermediate" },
  { id: "aippm_09", committee: "AIPPM", title: "Dharmendra Pradhan", subTitle: "Minister of Education / Sambalpur MP", category: "BJP", status: 'Vacant', difficulty: "Advanced" },
  { id: "aippm_10", committee: "AIPPM", title: "Piyush Goyal", subTitle: "Minister of Commerce & Industry / Mumbai North MP", category: "BJP", status: 'Vacant', difficulty: "Intermediate" },
  { id: "aippm_11", committee: "AIPPM", title: "Ashwini Vaishnaw", subTitle: "Minister of Railways, I&B and Electronics & IT", category: "BJP", status: 'Vacant', difficulty: "Advanced" },
  { id: "aippm_12", committee: "AIPPM", title: "Manohar Lal", subTitle: "Minister of Housing & Urban Affairs and Power", category: "BJP", status: 'Vacant', difficulty: "Intermediate" },
  { id: "aippm_13", committee: "AIPPM", title: "Jyotiraditya Scindia", subTitle: "Minister of Communications and DoNER / Guna MP", category: "BJP", status: 'Vacant', difficulty: "Intermediate" },
  { id: "aippm_14", committee: "AIPPM", title: "Kiren Rijiju", subTitle: "Minister of Parliamentary Affairs & Minority Affairs", category: "BJP", status: 'Vacant', difficulty: "Crisis" },
  { id: "aippm_15", committee: "AIPPM", title: "Pralhad Joshi", subTitle: "Minister of Consumer Affairs, Food & Public Distribution", category: "BJP", status: 'Vacant', difficulty: "Intermediate" },
  { id: "aippm_16", committee: "AIPPM", title: "Bhupender Yadav", subTitle: "Minister of Environment, Forest & Climate Change", category: "BJP", status: 'Vacant', difficulty: "Intermediate" },
  { id: "aippm_17", committee: "AIPPM", title: "Gajendra Singh Shekhawat", subTitle: "Minister of Culture & Tourism / Jodhpur MP", category: "BJP", status: 'Vacant', difficulty: "Beginner" },
  { id: "aippm_18", committee: "AIPPM", title: "Mansukh Mandaviya", subTitle: "Minister of Labour, Employment, Youth Affairs & Sports", category: "BJP", status: 'Vacant', difficulty: "Beginner" },
  { id: "aippm_19", committee: "AIPPM", title: "Chirag Paswan", subTitle: "Minister of Food Processing Industries / Hajipur MP", category: "LJP (RV)", status: 'Vacant', difficulty: "Intermediate" },
  { id: "aippm_20", committee: "AIPPM", title: "Himanta Biswa Sarma", subTitle: "Chief Minister of Assam / NEDA Convener", category: "BJP", status: 'Vacant', difficulty: "Crisis" },
  { id: "aippm_21", committee: "AIPPM", title: "Yogi Adityanath", subTitle: "Chief Minister of Uttar Pradesh", category: "BJP", status: 'Vacant', difficulty: "Advanced" },
  { id: "aippm_22", committee: "AIPPM", title: "Devendra Fadnavis", subTitle: "Deputy Chief Minister of Maharashtra", category: "BJP", status: 'Vacant', difficulty: "Intermediate" },
  { id: "aippm_23", committee: "AIPPM", title: "Rahul Gandhi", subTitle: "Leader of Opposition (Lok Sabha) / Rae Bareli MP", category: "INC", status: 'Vacant', difficulty: "Advanced" },
  { id: "aippm_24", committee: "AIPPM", title: "Mallikarjun Kharge", subTitle: "Congress President & Leader of Opposition (Rajya Sabha)", category: "INC", status: 'Vacant', difficulty: "Advanced" },
  { id: "aippm_25", committee: "AIPPM", title: "Priyanka Gandhi Vadra", subTitle: "AICC General Secretary / Wayanad MP", category: "INC", status: 'Vacant', difficulty: "Intermediate" },
  { id: "aippm_26", committee: "AIPPM", title: "Shashi Tharoor", subTitle: "Thiruvananthapuram MP / Foreign Affairs Expert", category: "INC", status: 'Vacant', difficulty: "Advanced" },
  { id: "aippm_27", committee: "AIPPM", title: "Jairam Ramesh", subTitle: "AICC General Secretary (Communications) / Rajya Sabha MP", category: "INC", status: 'Vacant', difficulty: "Intermediate" },
  { id: "aippm_28", committee: "AIPPM", title: "P. Chidambaram", subTitle: "Former Union Finance & Home Minister / Rajya Sabha MP", category: "INC", status: 'Vacant', difficulty: "Advanced" },
  { id: "aippm_29", committee: "AIPPM", title: "K. C. Venugopal", subTitle: "AICC General Secretary (Organisation) / Alappuzha MP", category: "INC", status: 'Vacant', difficulty: "Intermediate" },
  { id: "aippm_30", committee: "AIPPM", title: "Gaurav Gogoi", subTitle: "Deputy Leader of Opposition (Lok Sabha) / Jorhat MP", category: "INC", status: 'Vacant', difficulty: "Intermediate" },
  { id: "aippm_31", committee: "AIPPM", title: "Kanhaiya Kumar", subTitle: "In-charge NSUI / Youth Leader", category: "INC", status: 'Vacant', difficulty: "Crisis" },
  { id: "aippm_32", committee: "AIPPM", title: "Sachin Pilot", subTitle: "AICC General Secretary / Tonk MLA", category: "INC", status: 'Vacant', difficulty: "Intermediate" },
  { id: "aippm_33", committee: "AIPPM", title: "Akhilesh Yadav", subTitle: "Samajwadi Party President / Kannauj MP", category: "SP", status: 'Vacant', difficulty: "Advanced" },
  { id: "aippm_34", committee: "AIPPM", title: "Dimple Yadav", subTitle: "Mainpuri MP / Samajwadi Party Leader", category: "SP", status: 'Vacant', difficulty: "Beginner" },
  { id: "aippm_35", committee: "AIPPM", title: "Mamata Banerjee", subTitle: "Chief Minister of West Bengal / TMC Chairperson", category: "TMC", status: 'Vacant', difficulty: "Advanced" },
  { id: "aippm_36", committee: "AIPPM", title: "Derek O'Brien", subTitle: "TMC Parliamentary Party Leader (Rajya Sabha)", category: "TMC", status: 'Vacant', difficulty: "Intermediate" },
  { id: "aippm_37", committee: "AIPPM", title: "Arvind Kejriwal", subTitle: "Aam Aadmi Party National Convener", category: "AAP", status: 'Vacant', difficulty: "Advanced" },
  { id: "aippm_38", committee: "AIPPM", title: "Bhagwant Mann", subTitle: "Chief Minister of Punjab", category: "AAP", status: 'Vacant', difficulty: "Intermediate" },
  { id: "aippm_39", committee: "AIPPM", title: "M. K. Stalin", subTitle: "Chief Minister of Tamil Nadu / DMK President", category: "DMK", status: 'Vacant', difficulty: "Advanced" },
  { id: "aippm_40", committee: "AIPPM", title: "Kanimozhi Karunanidhi", subTitle: "DMK Parliamentary Leader / Thoothukudi MP", category: "DMK", status: 'Vacant', difficulty: "Intermediate" },
  { id: "aippm_41", committee: "AIPPM", title: "Asaduddin Owaisi", subTitle: "AIMIM President / Hyderabad MP", category: "AIMIM", status: 'Vacant', difficulty: "Crisis" },
  { id: "aippm_42", committee: "AIPPM", title: "Sharad Pawar", subTitle: "Nationalist Congress Party (SP) President", category: "NCP", status: 'Vacant', difficulty: "Advanced" },
  { id: "aippm_43", committee: "AIPPM", title: "Uddhav Thackeray", subTitle: "Shiv Sena (UBT) Chief / Former CM Maharashtra", category: "Shiv Sena (UBT)", status: 'Vacant', difficulty: "Intermediate" },
  { id: "aippm_44", committee: "AIPPM", title: "Sanjay Raut", subTitle: "Rajya Sabha MP / Chief Spokesperson Shiv Sena (UBT)", category: "Shiv Sena (UBT)", status: 'Vacant', difficulty: "Crisis" },
  { id: "aippm_45", committee: "AIPPM", title: "K. T. Rama Rao", subTitle: "BRS Working President / Sircilla MLA", category: "BRS", status: 'Vacant', difficulty: "Intermediate" },
  { id: "aippm_46", committee: "AIPPM", title: "Naveen Patnaik", subTitle: "Former CM Odisha / Biju Janata Dal President", category: "BJD", status: 'Vacant', difficulty: "Intermediate" },
  { id: "aippm_47", committee: "AIPPM", title: "Mehbooba Mufti", subTitle: "Former CM J&K / PDP President", category: "PDP", status: 'Vacant', difficulty: "Crisis" },
  { id: "aippm_48", committee: "AIPPM", title: "Suvendu Adhikari", subTitle: "Leader of Opposition (West Bengal Assembly) / Nandigram MLA", category: "BJP", status: 'Vacant', difficulty: "Crisis" },
  { id: "aippm_49", committee: "AIPPM", title: "Ramdas Athawale", subTitle: "Minister of State for Social Justice / RPI(A) President", category: "RPI(A)", status: 'Vacant', difficulty: "Beginner" },
  { id: "aippm_50", committee: "AIPPM", title: "Jitan Ram Manjhi", subTitle: "Minister of MSME / Former CM Bihar / HAM(S)", category: "HAM(S)", status: 'Vacant', difficulty: "Beginner" },
  { id: "aippm_51", committee: "AIPPM", title: "Sonam Wangchuk", subTitle: "Innovator, Education Reformer & Climate Activist (Ladakh)", category: "Independent / Civil Society", status: 'Vacant', difficulty: "Crisis" },
  { id: "aippm_52", committee: "AIPPM", title: "Abhijeet Dipke", subTitle: "Political Analyst & Independent Commentator", category: "Independent / Other", status: 'Vacant', difficulty: "Intermediate" },
  { id: "aippm_53", committee: "AIPPM", title: "Saurav Das", subTitle: "Investigative Journalist & RTI Researcher", category: "Independent / Other", status: 'Vacant', difficulty: "Intermediate" },
  { id: "aippm_54", committee: "AIPPM", title: "Vaiko", subTitle: "General Secretary MDMK / Rajya Sabha MP", category: "MDMK", status: 'Vacant', difficulty: "Intermediate" },
  { id: "aippm_55", committee: "AIPPM", title: "Dayanidhi Maran", subTitle: "Former Union Minister / DMK Chennai Central MP", category: "DMK", status: 'Vacant', difficulty: "Intermediate" },
  { id: "aippm_56", committee: "AIPPM", title: "Omar Abdullah", subTitle: "Chief Minister of Jammu & Kashmir / JKNC Vice President", category: "JKNC", status: 'Vacant', difficulty: "Advanced" },
  { id: "aippm_57", committee: "AIPPM", title: "Supriya Sule", subTitle: "Baramati MP / Working President NCP (SP)", category: "NCP (SP)", status: 'Vacant', difficulty: "Intermediate" },
  { id: "aippm_58", committee: "AIPPM", title: "Mahua Moitra", subTitle: "Krishnanagar MP / TMC National Spokesperson", category: "TMC", status: 'Vacant', difficulty: "Crisis" },
  { id: "aippm_59", committee: "AIPPM", title: "Manish Sisodia", subTitle: "Former Deputy CM of Delhi / Education Architecture Lead", category: "AAP", status: 'Vacant', difficulty: "Advanced" },
  { id: "aippm_60", committee: "AIPPM", title: "Imtiaz Jaleel", subTitle: "Former Aurangabad MP / AIMIM State President", category: "AIMIM", status: 'Vacant', difficulty: "Intermediate" },
  { id: "emi_01", committee: "EMI", title: "Pralhad Joshi — Union Education Minister", subTitle: "Ministerial Executive Leadership", category: "Government", status: 'Vacant', difficulty: "Advanced" },
  { id: "emi_02", committee: "EMI", title: "Jayant Chaudhary — Minister of State for Education", subTitle: "Skill Development & Entrepreneurship Oversight", category: "Government", status: 'Vacant', difficulty: "Intermediate" },
  { id: "emi_03", committee: "EMI", title: "Secretary, Department of Higher Education", subTitle: "Central University Governance & Regulatory Direction", category: "Bureaucracy", status: 'Vacant', difficulty: "Advanced" },
  { id: "emi_04", committee: "EMI", title: "Secretary, Department of School Education & Literacy", subTitle: "K-12 Policy Implementation & Literacy Missions", category: "Bureaucracy", status: 'Vacant', difficulty: "Intermediate" },
  { id: "emi_05", committee: "EMI", title: "Chairperson, CBSE", subTitle: "Central Board of Secondary Education Governing Body", category: "Institution", status: 'Vacant', difficulty: "Intermediate" },
  { id: "emi_06", committee: "EMI", title: "Director, NCERT", subTitle: "National Council of Educational Research and Training", category: "Institution", status: 'Vacant', difficulty: "Intermediate" },
  { id: "emi_07", committee: "EMI", title: "Chairperson, UGC", subTitle: "University Grants Commission Regulatory Authority", category: "Institution", status: 'Vacant', difficulty: "Advanced" },
  { id: "emi_08", committee: "EMI", title: "Chairperson, NTA", subTitle: "National Testing Agency Entrance Examination Directorate", category: "Institution", status: 'Vacant', difficulty: "Crisis" },
  { id: "emi_09", committee: "EMI", title: "Chairperson, AICTE", subTitle: "All India Council for Technical Education Accreditation", category: "Institution", status: 'Vacant', difficulty: "Intermediate" },
  { id: "emi_10", committee: "EMI", title: "Chairperson, NCTE", subTitle: "National Council for Teacher Education Quality Assurance", category: "Institution", status: 'Vacant', difficulty: "Beginner" },
  { id: "emi_11", committee: "EMI", title: "Director, IIT Delhi", subTitle: "Institutes of National Importance Research Consortium", category: "Higher Education", status: 'Vacant', difficulty: "Intermediate" },
  { id: "emi_12", committee: "EMI", title: "Director, IIT Bombay", subTitle: "Technology Innovation & Advanced Engineering Directorate", category: "Higher Education", status: 'Vacant', difficulty: "Intermediate" },
  { id: "emi_13", committee: "EMI", title: "Director, IIT Madras", subTitle: "Applied Incubation & Higher Technical Education", category: "Higher Education", status: 'Vacant', difficulty: "Intermediate" },
  { id: "emi_14", committee: "EMI", title: "Director, IIT Kanpur", subTitle: "Cybersecurity, Aerospace & Technical Curriculum Lead", category: "Higher Education", status: 'Vacant', difficulty: "Intermediate" },
  { id: "emi_15", committee: "EMI", title: "Director, IIT Kharagpur", subTitle: "Heritage Technical Consortium & Multidisciplinary Studies", category: "Higher Education", status: 'Vacant', difficulty: "Intermediate" },
  { id: "emi_16", committee: "EMI", title: "Director, IIT Hyderabad", subTitle: "Artificial Intelligence & Semiconductor Pedagogical Lead", category: "Higher Education", status: 'Vacant', difficulty: "Intermediate" },
  { id: "emi_17", committee: "EMI", title: "Director, IIT Roorkee", subTitle: "Infrastructure, Water Resources & Civil Engineering Lead", category: "Higher Education", status: 'Vacant', difficulty: "Beginner" },
  { id: "emi_18", committee: "EMI", title: "Director, IIT Guwahati", subTitle: "North-East Regional Technical Integration & Research", category: "Higher Education", status: 'Vacant', difficulty: "Beginner" },
  { id: "emi_19", committee: "EMI", title: "Commissioner, Kendriya Vidyalaya Sangathan", subTitle: "Central Government Public School Network Governance", category: "School Education", status: 'Vacant', difficulty: "Beginner" },
  { id: "emi_20", committee: "EMI", title: "Commissioner, Navodaya Vidyalaya Samiti", subTitle: "Rural Gifted Student Education Network", category: "School Education", status: 'Vacant', difficulty: "Beginner" },
  { id: "emi_21", committee: "EMI", title: "Chairperson, NIOS", subTitle: "National Institute of Open Schooling Flexible Learning", category: "School Education", status: 'Vacant', difficulty: "Beginner" },
  { id: "emi_22", committee: "EMI", title: "Director, National Institute of Educational Planning & Administration", subTitle: "Strategic Pedagogical Policy Research Council", category: "Education Policy", status: 'Vacant', difficulty: "Intermediate" },
  { id: "emi_23", committee: "EMI", title: "Alakh Pandey — Physics Wallah", subTitle: "Democratized Affordable EdTech & Entrance Preparation", category: "EdTech", status: 'Vacant', difficulty: "Crisis" },
  { id: "emi_24", committee: "EMI", title: "Khan Sir — Khan GS Research Centre", subTitle: "Grassroots Mass Educational Outreach & Civic Pedagogy", category: "Educator", status: 'Vacant', difficulty: "Crisis" },
  { id: "emi_25", committee: "EMI", title: "BYJU'S Representative", subTitle: "Corporate EdTech Commercial Governance & Financial Audits", category: "EdTech", status: 'Vacant', difficulty: "Crisis" },
  { id: "emi_26", committee: "EMI", title: "Director / Academic Head, ALLEN Career Institute", subTitle: "Kota Entrance Coaching Ecosystem & Competitive Systems", category: "Coaching", status: 'Vacant', difficulty: "Intermediate" },
  { id: "emi_27", committee: "EMI", title: "Director, Aakash Institute", subTitle: "National Pre-Medical Entrance Preparation Consortium", category: "Coaching", status: 'Vacant', difficulty: "Intermediate" },
  { id: "emi_28", committee: "EMI", title: "Director, Vedantu", subTitle: "Interactive Live Learning & K-12 Digital Pedagogy", category: "EdTech", status: 'Vacant', difficulty: "Beginner" },
  { id: "emi_29", committee: "EMI", title: "Director, Unacademy", subTitle: "Civil Services & Competitive Exam Digital Distribution", category: "EdTech", status: 'Vacant', difficulty: "Intermediate" },
  { id: "emi_30", committee: "EMI", title: "Director, Resonance", subTitle: "Engineering & Science Competitive Olympiad Training", category: "Coaching", status: 'Vacant', difficulty: "Beginner" },
  { id: "emi_31", committee: "EMI", title: "Director, Motion Education", subTitle: "Kota Pedagogical Strategy & Student Academic Mentorship", category: "Coaching", status: 'Vacant', difficulty: "Beginner" },
  { id: "emi_32", committee: "EMI", title: "Director, Narayana Educational Institutions", subTitle: "Southern Regional Competitive Coaching Network", category: "Coaching", status: 'Vacant', difficulty: "Beginner" },
  { id: "emi_33", committee: "EMI", title: "Director, FIITJEE", subTitle: "Elite STEM & JEE Advanced Test Preparation Architecture", category: "Coaching", status: 'Vacant', difficulty: "Intermediate" },
  { id: "emi_34", committee: "EMI", title: "Director, Career Point", subTitle: "Blended Schooling & Entrance Test Methodologies", category: "Coaching", status: 'Vacant', difficulty: "Beginner" },
  { id: "emi_35", committee: "EMI", title: "National Examination Integrity Commissioner", subTitle: "High-Level Committee on Exam Security & Fair Logistics", category: "Policy", status: 'Vacant', difficulty: "Crisis" },
  { id: "emi_36", committee: "EMI", title: "Examination Security & Anti-Paper-Leak Commissioner", subTitle: "Statutory Anti-Cheating & Forensic Audit Oversight", category: "Policy", status: 'Vacant', difficulty: "Crisis" },
  { id: "emi_37", committee: "EMI", title: "JEE Reform Commissioner", subTitle: "Engineering Entrance Structural Rationalization Board", category: "Policy", status: 'Vacant', difficulty: "Advanced" },
  { id: "emi_38", committee: "EMI", title: "NEET Reform Commissioner", subTitle: "Medical Entrance Logistics, Normalization & Single-Window Evaluation", category: "Policy", status: 'Vacant', difficulty: "Crisis" },
  { id: "emi_39", committee: "EMI", title: "CUET Reform Commissioner", subTitle: "Common University Entrance Examination Scaling Directorate", category: "Policy", status: 'Vacant', difficulty: "Intermediate" },
  { id: "emi_40", committee: "EMI", title: "National Assessment & Curriculum Commissioner", subTitle: "PARAKH & Competency-Based Assessment Framework", category: "Policy", status: 'Vacant', difficulty: "Intermediate" },
  { id: "emi_41", committee: "EMI", title: "AI in Education Commissioner", subTitle: "Generative AI Tools & Classroom Curriculum Integration", category: "Technology", status: 'Vacant', difficulty: "Advanced" },
  { id: "emi_42", committee: "EMI", title: "Digital Education Commissioner", subTitle: "SWAYAM, DIKSHA & Remote School Connectivity Infrastructure", category: "Technology", status: 'Vacant', difficulty: "Intermediate" },
  { id: "emi_43", committee: "EMI", title: "Education Data & Privacy Commissioner", subTitle: "APAAR ID, DigiLocker & Sovereign Student Data Shield", category: "Technology", status: 'Vacant', difficulty: "Advanced" },
  { id: "emi_44", committee: "EMI", title: "Teacher Education & Training Commissioner", subTitle: "NISHTHA Teacher Upskilling & Professional Standards", category: "Policy", status: 'Vacant', difficulty: "Beginner" },
  { id: "emi_45", committee: "EMI", title: "Student Welfare Commissioner", subTitle: "Hostel Infrastructure, Anti-Ragging & Campus Safety", category: "Welfare", status: 'Vacant', difficulty: "Intermediate" },
  { id: "emi_46", committee: "EMI", title: "Mental Well-Being & Counselling Commissioner", subTitle: "Manodarpan Student Psychosocial Support & Stress Reduction", category: "Welfare", status: 'Vacant', difficulty: "Crisis" },
  { id: "emi_47", committee: "EMI", title: "Education Accessibility Commissioner", subTitle: "PwD Inclusivity, Assistive Tech & Universal Design", category: "Social Policy", status: 'Vacant', difficulty: "Intermediate" },
  { id: "emi_48", committee: "EMI", title: "Scholarship & Financial Aid Commissioner", subTitle: "National Means-cum-Merit & Direct Benefit Transfer Audits", category: "Finance", status: 'Vacant', difficulty: "Intermediate" },
  { id: "emi_49", committee: "EMI", title: "Coaching Regulation Commissioner", subTitle: "Guidelines for Regulation of Coaching Centers 2024–2026", category: "Regulation", status: 'Vacant', difficulty: "Crisis" },
  { id: "emi_50", committee: "EMI", title: "Private Education Regulation Commissioner", subTitle: "Fee Standardization & Transparency Regulatory Board", category: "Regulation", status: 'Vacant', difficulty: "Intermediate" },
  { id: "emi_51", committee: "EMI", title: "School Curriculum Reform Commissioner", subTitle: "National Curriculum Framework (NCF) School Level", category: "Curriculum", status: 'Vacant', difficulty: "Intermediate" },
  { id: "emi_52", committee: "EMI", title: "Higher Education Reform Commissioner", subTitle: "Four-Year Undergraduate Programme (FYUP) & Academic Bank of Credits", category: "Higher Education", status: 'Vacant', difficulty: "Intermediate" },
  { id: "emi_53", committee: "EMI", title: "Vocational & Skill Education Commissioner", subTitle: "NSQF Integration & Early Vocational Apprenticeships", category: "Skills", status: 'Vacant', difficulty: "Beginner" },
  { id: "emi_54", committee: "EMI", title: "Future of Work & Employability Commissioner", subTitle: "Industry-Academia Interfacing & Global Internship Placements", category: "Policy", status: 'Vacant', difficulty: "Intermediate" },
  { id: "emi_55", committee: "EMI", title: "NEP Implementation Commissioner", subTitle: "National Education Policy 2020 State Rollout Audits", category: "Policy", status: 'Vacant', difficulty: "Advanced" },
  { id: "emi_56", committee: "EMI", title: "NEP 2026 Drafting Commissioner", subTitle: "Proposed NEP 2026 Amendment & Constitutional Integration", category: "Policy", status: 'Vacant', difficulty: "Advanced" },
  { id: "emi_57", committee: "EMI", title: "Public School Education Commissioner", subTitle: "PM SHRI Schools & State Municipal School Infrastructure", category: "School Education", status: 'Vacant', difficulty: "Beginner" },
  { id: "emi_58", committee: "EMI", title: "Higher Education Finance Commissioner", subTitle: "HEFA Financing & University Research Grants Endowment", category: "Finance", status: 'Vacant', difficulty: "Intermediate" },
  { id: "emi_59", committee: "EMI", title: "Student Representative — School Education", subTitle: "Secondary & Senior Secondary Student Federation Delegate", category: "Student Voice", status: 'Vacant', difficulty: "Beginner" },
  { id: "emi_60", committee: "EMI", title: "Student Representative — Higher Education", subTitle: "University & Research Scholar Democratic Plenary Voice", category: "Student Voice", status: 'Vacant', difficulty: "Intermediate" },
  { id: "unsc_01", committee: "UNSC", title: "United States", subTitle: "Permanent Member (P5) • Veto Power", category: "P5", status: 'Vacant', difficulty: "Crisis" },
  { id: "unsc_02", committee: "UNSC", title: "Russian Federation", subTitle: "Permanent Member (P5) • Veto Power", category: "P5", status: 'Vacant', difficulty: "Crisis" },
  { id: "unsc_03", committee: "UNSC", title: "People's Republic of China", subTitle: "Permanent Member (P5) • Veto Power", category: "P5", status: 'Vacant', difficulty: "Crisis" },
  { id: "unsc_04", committee: "UNSC", title: "United Kingdom", subTitle: "Permanent Member (P5) • Veto Power", category: "P5", status: 'Vacant', difficulty: "Advanced" },
  { id: "unsc_05", committee: "UNSC", title: "France", subTitle: "Permanent Member (P5) • Veto Power", category: "P5", status: 'Vacant', difficulty: "Advanced" },
  { id: "unsc_06", committee: "UNSC", title: "Bahrain", subTitle: "Elected Member • Gulf & Maritime Security", category: "Elected Member", status: 'Vacant', difficulty: "Intermediate" },
  { id: "unsc_07", committee: "UNSC", title: "Colombia", subTitle: "Elected Member • Latin American Security", category: "Elected Member", status: 'Vacant', difficulty: "Intermediate" },
  { id: "unsc_08", committee: "UNSC", title: "Democratic Republic of the Congo", subTitle: "Elected Member • African Peacekeeping & Critical Minerals", category: "Elected Member", status: 'Vacant', difficulty: "Intermediate" },
  { id: "unsc_09", committee: "UNSC", title: "Denmark", subTitle: "Elected Member • Greenland & Arctic Gateway", category: "Elected Member", status: 'Vacant', difficulty: "Advanced" },
  { id: "unsc_10", committee: "UNSC", title: "Greece", subTitle: "Elected Member • Mediterranean & Maritime Shipping", category: "Elected Member", status: 'Vacant', difficulty: "Intermediate" },
  { id: "unsc_11", committee: "UNSC", title: "Latvia", subTitle: "Elected Member • Baltic Security & Eastern Flank", category: "Elected Member", status: 'Vacant', difficulty: "Intermediate" },
  { id: "unsc_12", committee: "UNSC", title: "Liberia", subTitle: "Elected Member • Maritime Registry & West African Security", category: "Elected Member", status: 'Vacant', difficulty: "Beginner" },
  { id: "unsc_13", committee: "UNSC", title: "Pakistan", subTitle: "Elected Member • South Asian Strategic Stability", category: "Elected Member", status: 'Vacant', difficulty: "Crisis" },
  { id: "unsc_14", committee: "UNSC", title: "Panama", subTitle: "Elected Member • Trans-Oceanic Canals & Global Chokepoints", category: "Elected Member", status: 'Vacant', difficulty: "Beginner" },
  { id: "unsc_15", committee: "UNSC", title: "Somalia", subTitle: "Elected Member • Horn of Africa & Red Sea Security", category: "Elected Member", status: 'Vacant', difficulty: "Crisis" },
  { id: "unsc_16", committee: "UNSC", title: "Canada", subTitle: "Northwest Passage & Arctic Sovereignty", category: "Arctic Actor", status: 'Vacant', difficulty: "Advanced" },
  { id: "unsc_17", committee: "UNSC", title: "Finland", subTitle: "Nordic Defence & Extended Arctic Border", category: "Arctic Actor", status: 'Vacant', difficulty: "Intermediate" },
  { id: "unsc_18", committee: "UNSC", title: "Iceland", subTitle: "GIUK Gap Maritime Surveillance & Arctic Council Founder", category: "Arctic Actor", status: 'Vacant', difficulty: "Beginner" },
  { id: "unsc_19", committee: "UNSC", title: "Norway", subTitle: "Svalbard Treaty & Barents Sea Energy Infrastructure", category: "Arctic Actor", status: 'Vacant', difficulty: "Advanced" },
  { id: "unsc_20", committee: "UNSC", title: "Sweden", subTitle: "Baltic-Arctic High North Defence Architecture", category: "Arctic Actor", status: 'Vacant', difficulty: "Intermediate" },
  { id: "unsc_21", committee: "UNSC", title: "India", subTitle: "Observer State in Arctic Council & Indo-Pacific Anchor", category: "Strategic Actor", status: 'Vacant', difficulty: "Advanced" },
  { id: "unsc_22", committee: "UNSC", title: "Japan", subTitle: "Northern Sea Route & East Asian Security Alliance", category: "Strategic Actor", status: 'Vacant', difficulty: "Intermediate" },
  { id: "unsc_23", committee: "UNSC", title: "South Korea", subTitle: "Icebreaker Shipbuilding & Polar Shipping Interests", category: "Strategic Actor", status: 'Vacant', difficulty: "Intermediate" },
  { id: "unsc_24", committee: "UNSC", title: "Germany", subTitle: "European Energy Security & Polar Research Expeditions", category: "Strategic Actor", status: 'Vacant', difficulty: "Intermediate" },
  { id: "unsc_25", committee: "UNSC", title: "Poland", subTitle: "NATO Eastern Flank Logistics & Baltic Security", category: "Strategic Actor", status: 'Vacant', difficulty: "Intermediate" },
  { id: "unsc_26", committee: "UNSC", title: "Netherlands", subTitle: "Subsea Cable Protection & European Port Logistics", category: "Strategic Actor", status: 'Vacant', difficulty: "Beginner" },
  { id: "unsc_27", committee: "UNSC", title: "NATO Representative", subTitle: "Allied Joint Force Command & High North Deterrence", category: "Strategic Actor", status: 'Vacant', difficulty: "Crisis" },
  { id: "unsc_28", committee: "UNSC", title: "European Union Representative", subTitle: "EU External Action Service & Critical Raw Materials Directive", category: "Strategic Actor", status: 'Vacant', difficulty: "Intermediate" },
  { id: "unsc_29", committee: "UNSC", title: "Arctic Council Representative", subTitle: "Circumpolar Environmental & Scientific Secretariat", category: "Arctic Actor", status: 'Vacant', difficulty: "Intermediate" },
  { id: "unsc_30", committee: "UNSC", title: "Inuit Circumpolar Council Representative", subTitle: "Indigenous Territorial Rights & Arctic Environmental Justice", category: "Arctic Actor", status: 'Vacant', difficulty: "Intermediate" },
  { id: "unsc_31", committee: "UNSC", title: "Ukraine", subTitle: "European Security Architecture & Black Sea Grain Corridors", category: "Extended Security", status: 'Vacant', difficulty: "Crisis" },
  { id: "unsc_32", committee: "UNSC", title: "Türkiye", subTitle: "Montreux Convention & Straits Maritime Control", category: "Extended Security", status: 'Vacant', difficulty: "Advanced" },
  { id: "unsc_33", committee: "UNSC", title: "Iran", subTitle: "Strait of Hormuz Security & Non-Proliferation Compliance", category: "Extended Security", status: 'Vacant', difficulty: "Crisis" },
  { id: "unsc_34", committee: "UNSC", title: "Israel", subTitle: "Middle Eastern Regional Deterrence & Technology Defence", category: "Extended Security", status: 'Vacant', difficulty: "Crisis" },
  { id: "unsc_35", committee: "UNSC", title: "Saudi Arabia", subTitle: "OPEC+ Crude Production & Red Sea Shipping Protection", category: "Extended Security", status: 'Vacant', difficulty: "Intermediate" },
  { id: "unsc_36", committee: "UNSC", title: "United Arab Emirates", subTitle: "Global Maritime Hub & Regional Mediation Diplomacy", category: "Extended Security", status: 'Vacant', difficulty: "Intermediate" },
  { id: "unsc_37", committee: "UNSC", title: "Qatar", subTitle: "LNG Export Security & International Diplomatic Backchannels", category: "Extended Security", status: 'Vacant', difficulty: "Intermediate" },
  { id: "unsc_38", committee: "UNSC", title: "Egypt", subTitle: "Suez Canal Strategic Corridor & African Security Envoy", category: "Extended Security", status: 'Vacant', difficulty: "Intermediate" },
  { id: "unsc_39", committee: "UNSC", title: "South Africa", subTitle: "Non-Aligned Plenary Voice & Cape Sea Route Monitor", category: "Extended Security", status: 'Vacant', difficulty: "Intermediate" },
  { id: "unsc_40", committee: "UNSC", title: "Brazil", subTitle: "South Atlantic Maritime Peace Zone & BRICS Diplomatic Voice", category: "Extended Security", status: 'Vacant', difficulty: "Intermediate" },
  { id: "unsc_41", committee: "UNSC", title: "Australia", subTitle: "AUKUS Maritime Alliance & Antarctic Treaty Oversight", category: "Extended Security", status: 'Vacant', difficulty: "Intermediate" },
  { id: "unsc_42", committee: "UNSC", title: "New Zealand", subTitle: "Pacific Ocean Governance & Nuclear-Free Treaty Champion", category: "Extended Security", status: 'Vacant', difficulty: "Beginner" },
  { id: "unsc_43", committee: "UNSC", title: "Singapore", subTitle: "Malacca Strait Security & Maritime Trade Law", category: "Extended Security", status: 'Vacant', difficulty: "Beginner" },
  { id: "unsc_44", committee: "UNSC", title: "Vietnam", subTitle: "South China Sea Maritime Boundaries & ASEAN Security", category: "Extended Security", status: 'Vacant', difficulty: "Intermediate" },
  { id: "unsc_45", committee: "UNSC", title: "Indonesia", subTitle: "Archipelagic Sea Lanes & ASEAN Regional Neutrality", category: "Extended Security", status: 'Vacant', difficulty: "Intermediate" },
  { id: "unsc_46", committee: "UNSC", title: "Philippines", subTitle: "Exclusive Economic Zone Defence & UNCLOS Enforcement", category: "Extended Security", status: 'Vacant', difficulty: "Crisis" },
  { id: "unsc_47", committee: "UNSC", title: "Nigeria", subTitle: "Gulf of Guinea Anti-Piracy & ECOWAS Stability Force", category: "Extended Security", status: 'Vacant', difficulty: "Beginner" },
  { id: "unsc_48", committee: "UNSC", title: "Ethiopia", subTitle: "Grand Ethiopian Renaissance Dam & Horn Diplomatic Envoy", category: "Extended Security", status: 'Vacant', difficulty: "Intermediate" },
  { id: "unsc_49", committee: "UNSC", title: "Mexico", subTitle: "Small Arms Interdiction & Multilateral Peacekeeping Reform", category: "Extended Security", status: 'Vacant', difficulty: "Beginner" },
  { id: "unsc_50", committee: "UNSC", title: "Argentina", subTitle: "South Atlantic & Antarctic Sovereignty Claims", category: "Extended Security", status: 'Vacant', difficulty: "Beginner" },
  { id: "unsc_51", committee: "UNSC", title: "UN Secretary-General's Special Envoy", subTitle: "Executive Mediation & Preventive Diplomacy Mission", category: "Crisis Actor", status: 'Vacant', difficulty: "Advanced" },
  { id: "unsc_52", committee: "UNSC", title: "UN High Representative for Disarmament Affairs", subTitle: "Non-Proliferation & Hypersonic Weapon Arms Control", category: "Crisis Actor", status: 'Vacant', difficulty: "Advanced" },
  { id: "unsc_53", committee: "UNSC", title: "International Atomic Energy Agency Representative", subTitle: "Nuclear Safeguards & Maritime Reactor Verifications", category: "Crisis Actor", status: 'Vacant', difficulty: "Crisis" },
  { id: "unsc_54", committee: "UNSC", title: "International Maritime Organization Representative", subTitle: "Polar Code & Freedom of Navigation International Directives", category: "Crisis Actor", status: 'Vacant', difficulty: "Intermediate" },
  { id: "unsc_55", committee: "UNSC", title: "UN Peacekeeping Representative", subTitle: "Department of Peace Operations Deployment Assessments", category: "Crisis Actor", status: 'Vacant', difficulty: "Intermediate" },
  { id: "unsc_56", committee: "UNSC", title: "UN Office for the Coordination of Humanitarian Affairs Representative", subTitle: "Emergency Civilian Relief & Humanitarian Corridors", category: "Crisis Actor", status: 'Vacant', difficulty: "Beginner" },
  { id: "unsc_57", committee: "UNSC", title: "International Committee of the Red Cross Representative", subTitle: "Geneva Conventions & Neutral War-Zone Protection", category: "Crisis Actor", status: 'Vacant', difficulty: "Intermediate" },
  { id: "unsc_58", committee: "UNSC", title: "Arctic Indigenous Peoples' Representative", subTitle: "Permanent Participants Secretariat of the Arctic Council", category: "Crisis Actor", status: 'Vacant', difficulty: "Intermediate" },
  { id: "unsc_59", committee: "UNSC", title: "International Security Expert", subTitle: "Geopolitical Risk Analyst & Arctic Intelligence Briefings", category: "Crisis Actor", status: 'Vacant', difficulty: "Advanced" },
  { id: "unsc_60", committee: "UNSC", title: "International Press Representative", subTitle: "UN Correspondents Association (UNCA) Investigative Press", category: "Crisis Actor", status: 'Vacant', difficulty: "Crisis" },
  { id: "ecosoc_01", committee: "ECOSOC", title: "India", subTitle: "Global South Anchor & Digital Public Infrastructure Architecture", category: "Core Member", status: 'Vacant', difficulty: "Advanced" },
  { id: "ecosoc_02", committee: "ECOSOC", title: "United States", subTitle: "Multilateral Aid Directorate & Development Finance Corporation", category: "Core Member", status: 'Vacant', difficulty: "Advanced" },
  { id: "ecosoc_03", committee: "ECOSOC", title: "China", subTitle: "Global Development Initiative & Belt and Road Green Transition", category: "Core Member", status: 'Vacant', difficulty: "Advanced" },
  { id: "ecosoc_04", committee: "ECOSOC", title: "United Kingdom", subTitle: "Foreign, Commonwealth & Development Office Sustainable Finance", category: "Core Member", status: 'Vacant', difficulty: "Intermediate" },
  { id: "ecosoc_05", committee: "ECOSOC", title: "France", subTitle: "Paris Pact for People and Planet & Global Sovereign Debt Relief", category: "Core Member", status: 'Vacant', difficulty: "Advanced" },
  { id: "ecosoc_06", committee: "ECOSOC", title: "Germany", subTitle: "Climate Adaptation & Just Energy Transition Partnerships", category: "Core Member", status: 'Vacant', difficulty: "Intermediate" },
  { id: "ecosoc_07", committee: "ECOSOC", title: "Japan", subTitle: "JICA Official Development Assistance & Disaster Risk Reduction", category: "Core Member", status: 'Vacant', difficulty: "Intermediate" },
  { id: "ecosoc_08", committee: "ECOSOC", title: "Brazil", subTitle: "Global Alliance Against Hunger and Poverty & G20 Troika", category: "Core Member", status: 'Vacant', difficulty: "Advanced" },
  { id: "ecosoc_09", committee: "ECOSOC", title: "South Africa", subTitle: "African Union Agenda 2063 & Sovereign Debt Restructuring", category: "Core Member", status: 'Vacant', difficulty: "Crisis" },
  { id: "ecosoc_10", committee: "ECOSOC", title: "Indonesia", subTitle: "Critical Minerals Value Addition & South-East Asian Transition", category: "Core Member", status: 'Vacant', difficulty: "Intermediate" },
  { id: "ecosoc_11", committee: "ECOSOC", title: "Nigeria", subTitle: "Sub-Saharan Demographic Dividend & Energy Access Transition", category: "Core Member", status: 'Vacant', difficulty: "Intermediate" },
  { id: "ecosoc_12", committee: "ECOSOC", title: "Mexico", subTitle: "Nearshoring Industrial Integration & Latin American Social Development", category: "Core Member", status: 'Vacant', difficulty: "Beginner" },
  { id: "ecosoc_13", committee: "ECOSOC", title: "Canada", subTitle: "Clean Energy Mining & Feminist International Assistance Policy", category: "Core Member", status: 'Vacant', difficulty: "Beginner" },
  { id: "ecosoc_14", committee: "ECOSOC", title: "Australia", subTitle: "Pacific Island Climate Resilience & Clean Energy Exports", category: "Core Member", status: 'Vacant', difficulty: "Beginner" },
  { id: "ecosoc_15", committee: "ECOSOC", title: "Saudi Arabia", subTitle: "Saudi Green Initiative & Development Funds for Developing Nations", category: "Core Member", status: 'Vacant', difficulty: "Intermediate" },
  { id: "ecosoc_16", committee: "ECOSOC", title: "United Arab Emirates", subTitle: "COP28 UAE Consensus & Global Climate Finance Vehicle (ALTÉRRA)", category: "Core Member", status: 'Vacant', difficulty: "Intermediate" },
  { id: "ecosoc_17", committee: "ECOSOC", title: "Bangladesh", subTitle: "LDC Graduation Strategy & Climate Adaptation Infrastructure", category: "Core Member", status: 'Vacant', difficulty: "Intermediate" },
  { id: "ecosoc_18", committee: "ECOSOC", title: "Pakistan", subTitle: "Loss and Damage Fund Implementation & Debt-for-Climate Swaps", category: "Core Member", status: 'Vacant', difficulty: "Crisis" },
  { id: "ecosoc_19", committee: "ECOSOC", title: "Nepal", subTitle: "Himalayan Glacial Protection & Mountain Economy Advocacy", category: "Core Member", status: 'Vacant', difficulty: "Beginner" },
  { id: "ecosoc_20", committee: "ECOSOC", title: "Sri Lanka", subTitle: "Economic Recovery Restructuring & Renewable Energy Transition", category: "Core Member", status: 'Vacant', difficulty: "Intermediate" },
  { id: "ecosoc_21", committee: "ECOSOC", title: "Kenya", subTitle: "Nairobi Declaration on Climate & African Carbon Markets", category: "Core Member", status: 'Vacant', difficulty: "Intermediate" },
  { id: "ecosoc_22", committee: "ECOSOC", title: "Ethiopia", subTitle: "Agricultural Modernization & Horn Food Resilience Strategy", category: "Core Member", status: 'Vacant', difficulty: "Intermediate" },
  { id: "ecosoc_23", committee: "ECOSOC", title: "Egypt", subTitle: "North African Water Security & Green Hydrogen Corridors", category: "Core Member", status: 'Vacant', difficulty: "Intermediate" },
  { id: "ecosoc_24", committee: "ECOSOC", title: "Türkiye", subTitle: "Transcontinental Logistics & Humanitarian Development Aid", category: "Core Member", status: 'Vacant', difficulty: "Intermediate" },
  { id: "ecosoc_25", committee: "ECOSOC", title: "Argentina", subTitle: "Lithium Triangle Industrialization & Agricultural Export Reforms", category: "Core Member", status: 'Vacant', difficulty: "Beginner" },
  { id: "ecosoc_26", committee: "ECOSOC", title: "Norway", subTitle: "Sovereign Wealth Fund Sustainability & Blue Economy Leadership", category: "Core Member", status: 'Vacant', difficulty: "Beginner" },
  { id: "ecosoc_27", committee: "ECOSOC", title: "Sweden", subTitle: "Circular Economy Innovation & International Development Cooperation", category: "Core Member", status: 'Vacant', difficulty: "Beginner" },
  { id: "ecosoc_28", committee: "ECOSOC", title: "Switzerland", subTitle: "Geneva Global Health Hub & Humanitarian Multilateral Finance", category: "Core Member", status: 'Vacant', difficulty: "Intermediate" },
  { id: "ecosoc_29", committee: "ECOSOC", title: "Vietnam", subTitle: "High-Tech Green Manufacturing & Mekong Delta Adaptation", category: "Core Member", status: 'Vacant', difficulty: "Beginner" },
  { id: "ecosoc_30", committee: "ECOSOC", title: "Philippines", subTitle: "Disaster Risk Resilience & Overseas Migrant Worker Protections", category: "Core Member", status: 'Vacant', difficulty: "Beginner" },
  { id: "ecosoc_31", committee: "ECOSOC", title: "World Bank Representative", subTitle: "International Bank for Reconstruction and Development (IBRD)", category: "Financial", status: 'Vacant', difficulty: "Advanced" },
  { id: "ecosoc_32", committee: "ECOSOC", title: "International Monetary Fund Representative", subTitle: "Special Drawing Rights (SDR) & Resilience and Sustainability Trust", category: "Financial", status: 'Vacant', difficulty: "Crisis" },
  { id: "ecosoc_33", committee: "ECOSOC", title: "World Trade Organization Representative", subTitle: "Rules-Based Multilateral Trading System & Dispute Settlement", category: "Financial", status: 'Vacant', difficulty: "Advanced" },
  { id: "ecosoc_34", committee: "ECOSOC", title: "UNDP Representative", subTitle: "United Nations Development Programme Human Development Index", category: "Financial", status: 'Vacant', difficulty: "Intermediate" },
  { id: "ecosoc_35", committee: "ECOSOC", title: "UNICEF Representative", subTitle: "Child Welfare, Nutrition & Global Education Equity Directorate", category: "Financial", status: 'Vacant', difficulty: "Beginner" },
  { id: "ecosoc_36", committee: "ECOSOC", title: "UN Women Representative", subTitle: "Gender Equality, Care Economy & Female Economic Empowerment", category: "Financial", status: 'Vacant', difficulty: "Intermediate" },
  { id: "ecosoc_37", committee: "ECOSOC", title: "WHO Representative", subTitle: "World Health Organization Pandemic Agreement & Health Systems", category: "Financial", status: 'Vacant', difficulty: "Advanced" },
  { id: "ecosoc_38", committee: "ECOSOC", title: "ILO Representative", subTitle: "International Labour Organization Decent Work Agenda & Labour Rights", category: "Financial", status: 'Vacant', difficulty: "Intermediate" },
  { id: "ecosoc_39", committee: "ECOSOC", title: "UNCTAD Representative", subTitle: "Trade, Debt Vulnerability & Sovereign Technology Transfer", category: "Financial", status: 'Vacant', difficulty: "Advanced" },
  { id: "ecosoc_40", committee: "ECOSOC", title: "UN Environment Programme Representative", subTitle: "Global Plastics Treaty & Biodiversity Finance Framework", category: "Financial", status: 'Vacant', difficulty: "Intermediate" },
  { id: "ecosoc_41", committee: "ECOSOC", title: "Global Development Finance Representative", subTitle: "Multilateral Development Bank Capital Adequacy & Blended Finance", category: "Future Economy", status: 'Vacant', difficulty: "Advanced" },
  { id: "ecosoc_42", committee: "ECOSOC", title: "Sustainable Infrastructure Representative", subTitle: "Global Resilient Infrastructure Consortium & Transport Networks", category: "Future Economy", status: 'Vacant', difficulty: "Intermediate" },
  { id: "ecosoc_43", committee: "ECOSOC", title: "Global Food Security Representative", subTitle: "Food and Agriculture Organization (FAO) Food Resilience Strategy", category: "Future Economy", status: 'Vacant', difficulty: "Crisis" },
  { id: "ecosoc_44", committee: "ECOSOC", title: "Global Energy Transition Representative", subTitle: "International Renewable Energy Agency (IRENA) Decarbonization Envoy", category: "Future Economy", status: 'Vacant', difficulty: "Intermediate" },
  { id: "ecosoc_45", committee: "ECOSOC", title: "Climate Finance Representative", subTitle: "New Collective Quantified Goal on Climate Finance (NCQG)", category: "Future Economy", status: 'Vacant', difficulty: "Crisis" },
  { id: "ecosoc_46", committee: "ECOSOC", title: "Digital Inclusion Representative", subTitle: "Global Digital Compact & Universal Broadband Connectivity", category: "Future Economy", status: 'Vacant', difficulty: "Intermediate" },
  { id: "ecosoc_47", committee: "ECOSOC", title: "Global Health Financing Representative", subTitle: "Gavi & The Global Fund Sustainable Health Architecture", category: "Future Economy", status: 'Vacant', difficulty: "Intermediate" },
  { id: "ecosoc_48", committee: "ECOSOC", title: "Education & Human Capital Representative", subTitle: "UNESCO Global Education Monitoring & Youth Upskilling Hub", category: "Future Economy", status: 'Vacant', difficulty: "Beginner" },
  { id: "ecosoc_49", committee: "ECOSOC", title: "Youth Entrepreneurship Representative", subTitle: "Youth SME Accelerator & Micro-Enterprise Seed Capital Envoy", category: "Future Economy", status: 'Vacant', difficulty: "Beginner" },
  { id: "ecosoc_50", committee: "ECOSOC", title: "Employment & Future of Work Representative", subTitle: "AI Workforce Transitions & Universal Social Protection Floor", category: "Future Economy", status: 'Vacant', difficulty: "Intermediate" },
  { id: "ecosoc_51", committee: "ECOSOC", title: "Youth Representative", subTitle: "UN Youth Office Global Plenary Delegation", category: "Civil Society", status: 'Vacant', difficulty: "Beginner" },
  { id: "ecosoc_52", committee: "ECOSOC", title: "Indigenous Peoples' Representative", subTitle: "UN Permanent Forum on Indigenous Issues (UNPFII)", category: "Civil Society", status: 'Vacant', difficulty: "Intermediate" },
  { id: "ecosoc_53", committee: "ECOSOC", title: "Civil Society Representative", subTitle: "Conference of Non-Governmental Organizations in Consultative Relationship (CoNGO)", category: "Civil Society", status: 'Vacant', difficulty: "Beginner" },
  { id: "ecosoc_54", committee: "ECOSOC", title: "Women's Economic Empowerment Representative", subTitle: "Commission on the Status of Women (CSW) Plenary Voice", category: "Civil Society", status: 'Vacant', difficulty: "Intermediate" },
  { id: "ecosoc_55", committee: "ECOSOC", title: "Least Developed Countries Representative", subTitle: "Doha Programme of Action for LDCs (UN-OHRLLS)", category: "Civil Society", status: 'Vacant', difficulty: "Intermediate" },
  { id: "ecosoc_56", committee: "ECOSOC", title: "Small Island Developing States Representative", subTitle: "Antigua and Barbuda Agenda for SIDS (ABAS) Voice", category: "Civil Society", status: 'Vacant', difficulty: "Crisis" },
  { id: "ecosoc_57", committee: "ECOSOC", title: "Landlocked Developing Countries Representative", subTitle: "Gaborone Programme of Action for LLDCs", category: "Civil Society", status: 'Vacant', difficulty: "Beginner" },
  { id: "ecosoc_58", committee: "ECOSOC", title: "Global Labour Representative", subTitle: "International Trade Union Confederation (ITUC)", category: "Civil Society", status: 'Vacant', difficulty: "Intermediate" },
  { id: "ecosoc_59", committee: "ECOSOC", title: "Private Sector Representative", subTitle: "UN Global Compact Sustainable Business Council", category: "Civil Society", status: 'Vacant', difficulty: "Beginner" },
  { id: "ecosoc_60", committee: "ECOSOC", title: "International Press Representative", subTitle: "International Federation of Journalists & Global Development Media", category: "Civil Society", status: 'Vacant', difficulty: "Intermediate" }
];

// ── CANONICAL SCHEMAS & COLUMN HEADERS FOR ALL 19 STREAMS ──
var TAB_SCHEMAS = {
  // ── COMMITTEE DELEGATE TABS (AIPPM, EMI, UNSC, ECOSOC) ──
  AIPPM: {
    sheetName: 'AIPPM',
    headers: [
      'Timestamp', 'Full Name', 'Email Address', 'WhatsApp / Phone',
      'Institution / School / University', 'City & State', 'Participation Track',
      'Experience Level', 'Primary Committee Choice', 'Secondary Committee Choice',
      'Portfolio Preferences', 'Prior Accolades & MUN Count', 'Resolution Drafting Experience',
      'Research Dossier Link', 'Motivation Statement', 'Emergency Contact',
      'Participation Pass Tier', 'Payment UTR / Ref Number', 'Payment Screenshot Link',
      'Code of Conduct Accord', 'Allocation Status', 'Allocated Committee',
      'Allocated Portfolio', 'Submitter Handle', 'Form ID'
    ]
  },

  EMI: {
    sheetName: 'EMI',
    headers: [
      'Timestamp', 'Full Name', 'Email Address', 'WhatsApp / Phone',
      'Institution / School / University', 'City & State', 'Participation Track',
      'Experience Level', 'Primary Committee Choice', 'Secondary Committee Choice',
      'Portfolio Preferences', 'Prior Accolades & MUN Count', 'Resolution Drafting Experience',
      'Research Dossier Link', 'Motivation Statement', 'Emergency Contact',
      'Participation Pass Tier', 'Payment UTR / Ref Number', 'Payment Screenshot Link',
      'Code of Conduct Accord', 'Allocation Status', 'Allocated Committee',
      'Allocated Portfolio', 'Submitter Handle', 'Form ID'
    ]
  },

  UNSC: {
    sheetName: 'UNSC',
    headers: [
      'Timestamp', 'Full Name', 'Email Address', 'WhatsApp / Phone',
      'Institution / School / University', 'City & State', 'Participation Track',
      'Experience Level', 'Primary Committee Choice', 'Secondary Committee Choice',
      'Portfolio Preferences', 'Prior Accolades & MUN Count', 'Resolution Drafting Experience',
      'Research Dossier Link', 'Motivation Statement', 'Emergency Contact',
      'Participation Pass Tier', 'Payment UTR / Ref Number', 'Payment Screenshot Link',
      'Code of Conduct Accord', 'Allocation Status', 'Allocated Committee',
      'Allocated Portfolio', 'Submitter Handle', 'Form ID'
    ]
  },

  ECOSOC: {
    sheetName: 'ECOSOC',
    headers: [
      'Timestamp', 'Full Name', 'Email Address', 'WhatsApp / Phone',
      'Institution / School / University', 'City & State', 'Participation Track',
      'Experience Level', 'Primary Committee Choice', 'Secondary Committee Choice',
      'Portfolio Preferences', 'Prior Accolades & MUN Count', 'Resolution Drafting Experience',
      'Research Dossier Link', 'Motivation Statement', 'Emergency Contact',
      'Participation Pass Tier', 'Payment UTR / Ref Number', 'Payment Screenshot Link',
      'Code of Conduct Accord', 'Allocation Status', 'Allocated Committee',
      'Allocated Portfolio', 'Submitter Handle', 'Form ID'
    ]
  },

  // 1. ZEN DIPLOMACY MUN (MASTER DELEGATE REGISTRATIONS)
  ZEN_DIPLOMACY_MUN: {
    sheetName: 'ZEN DIPLOMACY MUN',
    headers: [
      'Timestamp', 'Full Name', 'Email Address', 'WhatsApp / Phone',
      'Institution / School / University', 'City & State', 'Participation Track',
      'Experience Level', 'Primary Committee Choice', 'Secondary Committee Choice',
      'Portfolio Preferences', 'Prior Accolades & MUN Count', 'Resolution Drafting Experience',
      'Research Dossier Link', 'Motivation Statement', 'Emergency Contact',
      'Participation Pass Tier', 'Payment UTR / Ref Number', 'Payment Screenshot Link',
      'Code of Conduct Accord', 'Allocation Status', 'Allocated Committee',
      'Allocated Portfolio', 'Submitter Handle', 'Form ID'
    ]
  },

  // 2. SECRETARIAT & EXECUTIVE BOARD APPLICATIONS
  SECRETARIAT: {
    sheetName: 'Secretariat Applications',
    headers: [
      'Timestamp', 'Ticket ID', 'Full Name', 'Email Address', 'Phone Number',
      'Institution', 'Grade / Academic Year', 'City & Country', 'Preferred Department',
      'Secondary Department', 'Prior MUN Experience', 'Number of MUNs Attended',
      'Prior Organizing Experience', 'Weekly Bandwidth Commitment', 'Available Oct 24-25, 2026',
      'Statement of Purpose (SOP)', 'Department Practical Task Response',
      'Portfolio / Resume / Drive Link', 'Discord Handle', 'Sovereign Accord Accepted', 'Review Status'
    ]
  },

  // 3. MATRIX PORTFOLIOS (AUTO-SYNCS LIVE WITH /matrix)
  MATRIX_PORTFOLIOS: {
    sheetName: 'Matrix Portfolios',
    headers: [
      'Portfolio ID', 'Committee', 'Portfolio Title', 'Subtitle / Description',
      'Category', 'Status', 'Allocated To (Name)', 'Allocated Email', 'Difficulty'
    ]
  },

  // 4. EVENT REGISTRATIONS & TICKET BOOKINGS
  EVENTS: {
    sheetName: 'Event Registrations',
    headers: [
      'Timestamp', 'Event ID', 'Event Name', 'Participant Name', 'Participant Email',
      'Contact Number', 'Institution / College', 'Ticket Pass Type', 'Quantity',
      'Allocated Seat / Portfolio', 'Total Price', 'Payment Status'
    ]
  },

  // 5. DONATIONS & RELIEF CONTRIBUTIONS
  DONATIONS: {
    sheetName: 'Donations',
    headers: [
      'Timestamp', 'Donor Name', 'Donor Email', 'Phone', 'Amount (INR)',
      'UTR / Txn ID', 'Target Relief Stream', 'Payment Mode', 'Anonymous',
      'Notes / Prayer', 'Audit Status', 'Verification Details', 'IP Address', 'Device Info'
    ]
  },

  // 6. IMPACT LEDGER
  IMPACT_LEDGER: {
    sheetName: 'Impact Ledger',
    headers: [
      'Timestamp', 'Donor Name', 'Donor Email', 'Phone', 'Amount (INR)',
      'UTR / Txn ID', 'Target Relief Stream', 'Payment Mode', 'Anonymous',
      'Notes / Prayer', 'Audit Status', 'Verification Details', 'IP Address', 'Device Info'
    ]
  },

  // 7. USER REGISTRATIONS (PASSPORT CORE)
  REGISTER_CORE: {
    sheetName: 'Register Data Core',
    headers: [
      'Timestamp', 'User ID', 'Full Name', 'Email', 'Role Designation',
      'Access Level', 'Auth Provider', 'Account Status', 'IP Address', 'Device Info'
    ]
  },

  // 8. LOGIN AUDIT CORE
  LOGIN_CORE: {
    sheetName: 'Login Data Core',
    headers: [
      'Timestamp', 'User ID', 'Full Name', 'Email', 'Auth Provider',
      'Login Status', 'IP Address', 'Device Info'
    ]
  },

  // 9. CAMPUS AMBASSADORS
  CAMPUS_AMBASSADOR: {
    sheetName: 'Campus Ambassadors',
    headers: [
      'Timestamp', 'Full Name', 'College / University', 'City / State',
      'Degree & Year', 'Email', 'Phone / WhatsApp', 'Leadership Experience',
      'Proposed Strategy', 'Student ID Proof', 'Approval Status', 'IP Address'
    ]
  },

  // 10. CORE TEAM APPLICATIONS
  CORE_TEAM: {
    sheetName: 'Core Team Applications',
    headers: [
      'Timestamp', 'Full Name', 'Handle', 'Email', 'Phone Number',
      'Role Applied For', 'Department', 'Portfolio URL', 'Uploaded Document',
      'Leadership Accomplishments', 'Technical Dossier', 'Weekly Bandwidth',
      'Motivation Statement', 'Constitutional Accord', 'Application Status', 'IP Address'
    ]
  },

  // 11. CONTACT INQUIRIES
  CONTACT: {
    sheetName: 'Contact Inquiries',
    headers: [
      'Timestamp', 'Full Name', 'Email', 'Phone Number', 'Subject',
      'Query Type', 'Message', 'Source URL', 'Status', 'IP Address'
    ]
  },

  // 12. NEWSLETTER SUBSCRIBERS
  NEWSLETTER: {
    sheetName: 'Newsletter Subscribers',
    headers: [
      'Timestamp', 'Email Address', 'Source', 'Consent Given',
      'UTM Campaign', 'Status', 'IP Address'
    ]
  },

  // 13. COLLAB & PARTNERSHIPS
  COLLAB: {
    sheetName: 'Collab & Partnerships',
    headers: [
      'Timestamp', 'Organization Name', 'Representative Name', 'Official Email',
      'Phone / WhatsApp', 'Collab Type', 'Proposal Summary', 'Budget / Resources',
      'Stage', 'IP Address'
    ]
  },

  // 14. COMMUNITY MEMBERS
  COMMUNITY: {
    sheetName: 'Community Members',
    headers: [
      'Timestamp', 'Full Name', 'Email', 'City / Region', 'Institution / College',
      'Primary Skills', 'Areas of Interest', 'Discord Handle', 'Membership Status', 'IP Address'
    ]
  },

  // 15. FEEDBACK & GRIEVANCE
  FEEDBACK: {
    sheetName: 'Feedback & Grievance',
    headers: [
      'Timestamp', 'Submitter Name', 'Email', 'Category', 'Severity / Priority',
      'Page URL', 'Description', 'Attachment Link', 'Status', 'IP Address'
    ]
  }
};

/**
 * Gets active spreadsheet or automatically creates a new master spreadsheet in Google Drive
 */
function getOrCreateSpreadsheet() {
  var ss = null;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {}

  if (!ss) {
    var props = PropertiesService.getScriptProperties();
    var storedId = props.getProperty('ZENVITRA_SPREADSHEET_ID');
    if (storedId) {
      try {
        ss = SpreadsheetApp.openById(storedId);
      } catch (e) {}
    }
    if (!ss) {
      ss = SpreadsheetApp.create('ZENVITRA — Master Telemetry & Portfolio Ledger');
      props.setProperty('ZENVITRA_SPREADSHEET_ID', ss.getId());
    }
  }
  return ss;
}

/**
 * Normalizes any incoming tab string from client payloads to match known schemas
 */
function resolveSchemaKey(raw) {
  if (!raw) return 'DONATIONS';
  var s = String(raw).toUpperCase().trim();

  if (s === 'AIPPM' || s.indexOf('AIPPM') !== -1) return 'AIPPM';
  if (s === 'EMI' || s.indexOf('EMI') !== -1) return 'EMI';
  if (s === 'UNSC' || s.indexOf('UNSC') !== -1) return 'UNSC';
  if (s === 'ECOSOC' || s.indexOf('ECOSOC') !== -1 || s === 'UNODC' || s.indexOf('UNODC') !== -1) return 'ECOSOC';
  if (s.indexOf('MATRIX') !== -1 || s.indexOf('PORTFOLIO') !== -1) return 'MATRIX_PORTFOLIOS';
  if (s.indexOf('SECRETARIAT') !== -1 || s.indexOf('SEC_APP') !== -1) return 'SECRETARIAT';
  if (s.indexOf('MUN') !== -1 || s.indexOf('DIPLOMACY') !== -1) return 'ZEN_DIPLOMACY_MUN';
  if (s.indexOf('EVENT') !== -1 || s.indexOf('PASS') !== -1 || s.indexOf('TICKET') !== -1) return 'EVENTS';
  if (s.indexOf('DONAT') !== -1) return 'DONATIONS';
  if (s.indexOf('IMPACT') !== -1 || s.indexOf('LEDGER') !== -1) return 'IMPACT_LEDGER';
  if (s.indexOf('REGISTER') !== -1) return 'REGISTER_CORE';
  if (s.indexOf('LOGIN') !== -1) return 'LOGIN_CORE';
  if (s.indexOf('AMBASSADOR') !== -1 || s.indexOf('CAMPUS') !== -1) return 'CAMPUS_AMBASSADOR';
  if (s.indexOf('CORE') !== -1 || s.indexOf('TEAM') !== -1 || s.indexOf('CAREER') !== -1) return 'CORE_TEAM';
  if (s.indexOf('CONTACT') !== -1) return 'CONTACT';
  if (s.indexOf('NEWSLETTER') !== -1) return 'NEWSLETTER';
  if (s.indexOf('COLLAB') !== -1 || s.indexOf('PARTNER') !== -1) return 'COLLAB';
  if (s.indexOf('COMMUNITY') !== -1) return 'COMMUNITY';
  if (s.indexOf('FEEDBACK') !== -1 || s.indexOf('GRIEVANCE') !== -1) return 'FEEDBACK';

  return null;
}

/**
 * Formats a sheet header row with dark obsidian background and frozen top row
 */
function formatHeaderRow(sheet, colCount) {
  var headerRange = sheet.getRange(1, 1, 1, colCount);
  headerRange.setBackground('#0f172a');
  headerRange.setFontColor('#f8fafc');
  headerRange.setFontWeight('bold');
  headerRange.setFontFamily('Roboto Mono');
  headerRange.setFontSize(10);
  sheet.setFrozenRows(1);
}

/**
 * Gets or creates sheet tab with styled header row
 */
function getOrCreateSheet(schema) {
  var ss = getOrCreateSpreadsheet();
  var sheet = ss.getSheetByName(schema.sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(schema.sheetName);
    sheet.appendRow(schema.headers);
    formatHeaderRow(sheet, schema.headers.length);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(schema.headers);
    formatHeaderRow(sheet, schema.headers.length);
  }

  return sheet;
}

/**
 * One-Click Master Setup:
 * Auto-creates all 15 tabs, formats obsidian headers, and pre-seeds Matrix Portfolios!
 */
function initAllTabs() {
  var ss = getOrCreateSpreadsheet();
  var created = [];

  Object.keys(TAB_SCHEMAS).forEach(function(key) {
    var schema = TAB_SCHEMAS[key];
    var sheet = ss.getSheetByName(schema.sheetName);
    var isNew = false;

    if (!sheet) {
      sheet = ss.insertSheet(schema.sheetName);
      isNew = true;
      created.push(schema.sheetName);
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(schema.headers);
      isNew = true;
    }

    formatHeaderRow(sheet, schema.headers.length);

    // Pre-seed 36 Portfolios if Matrix Portfolios tab is newly created
    if (key === 'MATRIX_PORTFOLIOS' && sheet.getLastRow() <= 1) {
      var rows = INITIAL_MATRIX_PORTFOLIOS.map(function(item) {
        return [
          item.id,
          item.committee,
          item.title,
          item.subTitle || '',
          item.category,
          item.status || 'Vacant',
          item.status === 'Allocated' ? (item.committee === 'UNSC' ? 'Confirmed P5 Diplomat' : 'Assigned Delegate') : '',
          '',
          item.difficulty || 'Intermediate'
        ];
      });

      if (rows.length > 0) {
        sheet.getRange(2, 1, rows.length, schema.headers.length).setValues(rows);
      }

      // Add dropdown validation for Status column (Column F / 6)
      try {
        var statusRule = SpreadsheetApp.newDataValidation()
          .requireValueInList(['Vacant', 'Allocated', 'Reserved', 'Confirmed', 'Pending Payment', 'Pending Approval', 'Double Delegation', 'Freeze', 'Revoked', 'Locked', '1 person waiting', '2 people waiting', '3+ people waiting'], true)
          .build();
        sheet.getRange(2, 6, Math.max(rows.length, 250), 1).setDataValidation(statusRule);
      } catch (_) {}
    }
  });

  return {
    status: 'success',
    spreadsheetUrl: ss.getUrl(),
    spreadsheetId: ss.getId(),
    createdTabs: created,
    totalTabs: Object.keys(TAB_SCHEMAS).length,
    message: 'All 15 tabs initialized and formatted: ' + (created.length > 0 ? created.join(', ') : 'All tabs active')
  };
}

/**
 * Alias for backward compatibility
 */
function initializeAll12Tabs() {
  return initAllTabs();
}

/**
 * Maps incoming client payload to canonical row columns
 */
function mapPayloadToRow(schemaKey, data) {
  var now = Utilities.formatDate(new Date(), 'GMT+5:30', 'yyyy-MM-dd HH:mm:ss');
  var ip = data.ipAddress || data.ip || '127.0.0.1';
  var device = data.deviceInfo || data.deviceBrowserInfo || data.userAgent || 'Web Browser';

  switch (schemaKey) {
    case 'AIPPM':
    case 'EMI':
    case 'UNSC':
    case 'ECOSOC':
    case 'UNODC':
    case 'ZEN_DIPLOMACY_MUN':
      return [
        now,
        data.step1_fullname || data.fullName || data.name || '',
        data.step1_email || data.email || '',
        data.step1_phone || data.phone || data.phoneNumber || '',
        data.step1_institution || data.institution || '',
        data.step1_city || data.city || '',
        data.step2_track || data.track || '',
        data.step2_experience_level || data.experienceLevel || '',
        data.step3_primary_committee || data.firstCommitteeChoice || '',
        data.step4_secondary_committee || data.secondCommitteeChoice || '',
        data.step5_portfolios || data.portfolioPreferences || '',
        data.step6_prior_accolades || data.priorAccolades || '',
        data.step7_resolution_experience || data.resolutionExperience || '',
        data.step8_research_paper_link || data.researchLink || '',
        data.step10_motivation_statement || data.motivation || '',
        data.step12_emergency_contact || data.emergencyContact || '',
        data.step15_participation_tier || data.step13_participation_tier || data.participationTier || data.passTier || 'Delegate Pass (₹499)',
        data.step15_payment_reference || data.utr || data.paymentReference || '',
        data.step15_receipt_link || data.step15_payment_screenshot || data.paymentScreenshot || '',
        data.step14_code_of_conduct ? 'CONFIRMED' : 'ACCEPTED',
        data.status || 'PENDING_ALLOCATION',
        data.allocatedCommittee || '',
        data.allocatedPortfolio || '',
        data.submitterHandle || 'public_delegate',
        data.formId || 'zen-diplomacy-2026-registration'
      ];

    case 'SECRETARIAT':
      return [
        now,
        data.ticketId || ('SEC-' + Math.random().toString(36).substring(2, 8).toUpperCase()),
        data.fullName || data.step2_fullname || data.name || '',
        data.email || data.step2_email || '',
        data.phoneNumber || data.phone || data.step2_phone || '',
        data.institution || data.step2_institution || '',
        data.gradeOrYear || data.academicYear || data.step2_grade || '',
        data.cityCountry || data.step2_city || data.step2_city_country || data.city || '',
        data.preferredSector || data.step1_primary_sector || data.step1_preferred_department || data.department || '',
        data.secondarySector || data.step1_secondary_sector || data.step1_secondary_department || '',
        data.priorMunExperience || data.step3_prior_muns_count || '',
        data.numberOfMunsAttended || data.step3_prior_muns_count || '',
        data.priorOrganizingExperience || data.step3_organizing_experience || '',
        data.weeklyBandwidth || data.step3_weekly_bandwidth || '',
        data.availabilityOct2425 || data.step4_availability_oct2425 || 'YES',
        data.statementOfPurpose || data.step3_sop || '',
        data.practicalTaskResponse || data.step3_practical_response || '',
        data.portfolioUrl || data.step3_portfolio_url || data.linkedinOrResumeUrl || '',
        data.discordHandle || data.step4_discord_handle || '',
        data.sovereignAccordAccepted || data.step4_accord_agreement || 'ACCEPTED',
        data.status || 'PENDING_REVIEW'
      ];

    case 'EVENTS':
      return [
        now,
        data.eventId || data.eventIdSlug || data.eventSlug || '',
        data.eventName || data.eventTitle || 'Zenvitra Event',
        data.participantName || data.name || data.fullName || '',
        data.participantEmail || data.email || '',
        data.contactNumber || data.phone || data.phoneNumber || '',
        data.institution || data.college || data.collegeOrSchool || '',
        data.ticketPassType || data.passType || data.tierName || 'STANDARD_PASS',
        data.quantity || 1,
        data.allocatedSeat || data.allocatedPortfolio || data.portfolio || '',
        data.totalPrice || data.totalPayable || '',
        data.paymentStatus || 'CONFIRMED'
      ];

    case 'DONATIONS':
    case 'IMPACT_LEDGER':
      return [
        now,
        data.donorName || data.fullName || data.name || 'Anonymous Citizen',
        data.donorEmail || data.email || '',
        data.donorPhone || data.phone || data.phoneNumber || '',
        data.voluntaryAmountInr || data.amountInr || data.amount || 0,
        data.utrTransactionId || data.utr || data.transactionRef || data.txId || '',
        data.targetProjectStream || data.stream || data.target || 'Satya Niketan Anath Ashram',
        data.paymentMode || 'UPI / Bank Transfer',
        data.wantsAnonymous === true || data.anonymous === true ? 'YES' : 'NO',
        data.notesOrPrayer || data.notes || data.message || '',
        data.auditStatus || 'VERIFIED_SUBMISSION',
        data.verificationDetails || data.paymentScreenshotPreview || 'Pending Audit Confirmation',
        ip,
        device
      ];

    case 'REGISTER_CORE':
      return [
        now,
        data.userId || data.id || data.username || '',
        data.fullName || data.name || '',
        data.email || '',
        data.roleDesignation || data.role || 'DELEGATE',
        data.accessLevel || 'MEMBER',
        data.authProvider || data.provider || 'CREDENTIALS',
        data.accountStatus || 'ACTIVE',
        ip,
        device
      ];

    case 'LOGIN_CORE':
      return [
        now,
        data.userId || data.id || '',
        data.fullName || data.name || '',
        data.email || '',
        data.authProvider || data.provider || 'CREDENTIALS',
        data.loginStatus || 'SUCCESS',
        ip,
        device
      ];

    case 'CAMPUS_AMBASSADOR':
      return [
        now,
        data.fullName || data.name || '',
        data.collegeUniversityName || data.college || '',
        data.cityState || data.city || '',
        data.degreeYearOfStudy || data.year || '',
        data.email || '',
        data.phoneWhatsapp || data.phone || '',
        data.leadershipExperience || data.experience || '',
        data.proposedStrategy || data.strategy || '',
        data.studentIdProof || '',
        data.approvalStatus || 'PENDING_REVIEW',
        ip
      ];

    case 'CORE_TEAM':
      return [
        now,
        data.fullName || data.name || '',
        data.handle || '',
        data.email || '',
        data.phoneNumber || data.phone || '',
        data.roleAppliedFor || data.role || '',
        data.department || data.wing || 'GENERAL',
        data.portfolioUrl || data.portfolio || '',
        data.dossierUploadUrl || data.dossier || '',
        data.leadershipAccomplishments || '',
        data.strategicVision || '',
        data.weeklyBandwidth || '10-15 hrs/wk',
        data.motivationStatement || data.message || '',
        data.constitutionalAccord || 'ACCEPTED',
        data.applicationStatus || 'SUBMITTED',
        ip
      ];

    case 'CONTACT':
      return [
        now,
        data.fullName || data.name || '',
        data.email || '',
        data.phoneNumber || data.phone || '',
        data.subject || 'General Inquiry',
        data.queryType || 'GENERAL',
        data.message || '',
        data.sourceUrl || '/',
        data.status || 'NEW',
        ip
      ];

    case 'NEWSLETTER':
      return [
        now,
        data.emailAddress || data.email || '',
        data.subscriptionSource || data.source || 'Website Footer',
        data.consentGiven === false ? 'NO' : 'YES',
        data.utmCampaign || '',
        data.status || 'SUBSCRIBED',
        ip
      ];

    case 'COLLAB':
      return [
        now,
        data.organizationName || data.org || '',
        data.representativeName || data.name || '',
        data.officialEmail || data.email || '',
        data.phoneWhatsapp || data.phone || '',
        data.collabType || 'INSTITUTIONAL',
        data.proposalSummary || data.proposal || '',
        data.budgetResourceScope || '',
        data.stage || 'INQUIRY',
        ip
      ];

    case 'COMMUNITY':
      return [
        now,
        data.fullName || data.name || '',
        data.email || '',
        data.cityRegion || data.city || '',
        data.institutionCollege || data.college || '',
        data.primarySkills || '',
        data.areasOfInterest || '',
        data.discordHandle || '',
        data.membershipStatus || 'ACTIVE',
        ip
      ];

    case 'FEEDBACK':
      return [
        now,
        data.submitterName || data.name || 'Anonymous',
        data.email || '',
        data.feedbackCategory || data.category || 'GENERAL',
        data.severityPriority || 'NORMAL',
        data.pageUrl || '/',
        data.description || data.message || '',
        data.attachmentLink || '',
        data.status || 'OPEN',
        ip
      ];

    default:
      return [now, JSON.stringify(data), ip, device];
  }
}

/**
 * ==============================================================================
 * POST Webhook Handler (Zenvitra API & Forms -> Apps Script)
 * ==============================================================================
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'No payload received'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var payload = {};
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Malformed JSON payload: ' + parseErr.toString()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var ss = getOrCreateSpreadsheet();
    var action = (payload.action || '').toUpperCase();

    // ── ACTION 1: DYNAMIC ZENFORMS SCHEMA SYNC ──
    // Automatically creates/appends columns when questions are added or renamed
    if (action === 'SYNC_SCHEMA') {
      var sheetTab = payload.sheetTab || payload.targetTab || ('ZEN_' + (payload.formId || 'FORM').toUpperCase().replace(/[^A-Z0-9_]/g, '_'));
      var sheet = ss.getSheetByName(sheetTab);
      if (!sheet) {
        sheet = ss.insertSheet(sheetTab);
      }

      var existingHeaders = [];
      var lastCol = sheet.getLastColumn();
      if (lastCol > 0 && sheet.getLastRow() > 0) {
        existingHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
      }

      var defaultHeaders = ['Timestamp', 'Submission ID', 'Submitter Handle'];
      defaultHeaders.forEach(function(h) {
        if (existingHeaders.indexOf(h) === -1) {
          existingHeaders.push(h);
        }
      });

      if (Array.isArray(payload.fields)) {
        payload.fields.forEach(function(field) {
          var headerName = field.label || field.id;
          if (headerName && existingHeaders.indexOf(headerName) === -1) {
            existingHeaders.push(headerName);
          }
        });
      }

      sheet.getRange(1, 1, 1, existingHeaders.length).setValues([existingHeaders]);
      formatHeaderRow(sheet, existingHeaders.length);

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        action: 'SYNC_SCHEMA',
        sheetTab: sheetTab,
        columnCount: existingHeaders.length,
        spreadsheetUrl: ss.getUrl(),
        message: 'Sheet tab "' + sheetTab + '" successfully created and synced with ' + existingHeaders.length + ' columns!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ── ACTION 1B: SYNC ALL 240 MATRIX PORTFOLIOS (OVERWRITE / SEED ALL TO VACANT) ──
    if (action === 'SYNC_ALL_PORTFOLIOS' || action === 'RESET_ALL_VACANT' || action === 'SEED_OFFICIAL_MATRIX') {
      var matrixSheetAll = ss.getSheetByName('Matrix Portfolios');
      if (!matrixSheetAll) {
        initAllTabs();
        matrixSheetAll = ss.getSheetByName('Matrix Portfolios');
      }

      var incomingPortfolios = (payload && Array.isArray(payload.portfolios) && payload.portfolios.length > 0)
        ? payload.portfolios
        : INITIAL_MATRIX_PORTFOLIOS;

      var currentLastRow = matrixSheetAll.getLastRow();
      if (currentLastRow > 1) {
        matrixSheetAll.getRange(2, 1, currentLastRow - 1, 9).clearContent();
      }

      var outRows = incomingPortfolios.map(function(item) {
        return [
          item.id,
          item.committee,
          item.title,
          item.subTitle || item.subtitle || '',
          item.category || '',
          item.status || 'Vacant',
          item.allocatedTo || '',
          item.allocatedEmail || '',
          item.difficulty || 'Intermediate'
        ];
      });

      if (outRows.length > 0) {
        matrixSheetAll.getRange(2, 1, outRows.length, 9).setValues(outRows);

        try {
          var statusRuleAll = SpreadsheetApp.newDataValidation()
            .requireValueInList(['Vacant', 'Allocated', 'Reserved', 'Confirmed', 'Pending Payment', 'Pending Approval', 'Double Delegation', 'Freeze', 'Revoked', 'Locked', '1 person waiting', '2 people waiting', '3+ people waiting'], true)
            .build();
          matrixSheetAll.getRange(2, 6, Math.max(outRows.length, 250), 1).setDataValidation(statusRuleAll);
        } catch (_) {}
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        count: outRows.length,
        spreadsheetUrl: ss.getUrl(),
        message: 'Successfully synchronized ' + outRows.length + ' portfolios to Google Sheet Matrix tab!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ── ACTION 2: UPDATE MATRIX PORTFOLIO STATUS ──
    // Synchronizes secretariat / dais allocations directly into the Matrix Portfolios tab
    if (action === 'UPDATE_MATRIX_PORTFOLIO') {
      var matrixSheet = ss.getSheetByName('Matrix Portfolios');
      if (!matrixSheet) {
        initAllTabs();
        matrixSheet = ss.getSheetByName('Matrix Portfolios');
      }

      var lastRow = matrixSheet.getLastRow();
      var updated = false;

      if (lastRow > 1) {
        var data = matrixSheet.getRange(2, 1, lastRow - 1, 9).getValues();
        var targetId = (payload.portfolioId || '').toLowerCase();
        var targetTitle = (payload.portfolioTitle || payload.title || '').toLowerCase();

        for (var i = 0; i < data.length; i++) {
          var rowId = String(data[i][0]).toLowerCase();
          var rowTitle = String(data[i][2]).toLowerCase();

          if (rowId === targetId || rowTitle === targetTitle) {
            var rowIndex = i + 2;
            if (payload.status) matrixSheet.getRange(rowIndex, 6).setValue(payload.status);
            if (payload.allocatedTo !== undefined) matrixSheet.getRange(rowIndex, 7).setValue(payload.allocatedTo);
            if (payload.allocatedEmail !== undefined) matrixSheet.getRange(rowIndex, 8).setValue(payload.allocatedEmail);
            updated = true;
            break;
          }
        }
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        updated: updated,
        portfolioTitle: payload.portfolioTitle || payload.title,
        message: updated ? 'Portfolio status updated in Google Sheet' : 'Portfolio row not found in sheet'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ── ACTION 3: FETCH LIVE MATRIX PORTFOLIOS ──
    if (action === 'GET_MATRIX_PORTFOLIOS') {
      var matrixSheet2 = ss.getSheetByName('Matrix Portfolios');
      if (!matrixSheet2 || matrixSheet2.getLastRow() <= 1) {
        initAllTabs();
        matrixSheet2 = ss.getSheetByName('Matrix Portfolios');
      }

      var lastR = matrixSheet2.getLastRow();
      var portfolios = [];

      if (lastR > 1) {
        var rows2 = matrixSheet2.getRange(2, 1, lastR - 1, 9).getValues();
        portfolios = rows2.map(function(r) {
          return {
            id: String(r[0]),
            committee: String(r[1]),
            title: String(r[2]),
            subTitle: String(r[3]),
            category: String(r[4]),
            status: String(r[5] || 'Vacant'),
            allocatedTo: String(r[6] || ''),
            allocatedEmail: String(r[7] || ''),
            difficulty: String(r[8] || 'Intermediate')
          };
        });
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        count: portfolios.length,
        portfolios: portfolios,
        spreadsheetUrl: ss.getUrl()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ── ACTION 4: RECORD GENERAL INGESTION ROWS ──
    var rawTab = payload.sheetTab || payload.targetTab || payload.tab || payload.target || '';
    var schemaKey = resolveSchemaKey(rawTab);

    // Contextual inference for MUN & Secretariat forms
    if (!schemaKey) {
      var formId = (payload.formId || '').toLowerCase();
      var formTitle = (payload.formTitle || '').toLowerCase();
      if (
        formId.indexOf('secretariat') !== -1 ||
        formTitle.indexOf('secretariat') !== -1 ||
        payload.preferredSector ||
        payload.step1_primary_sector
      ) {
        schemaKey = 'SECRETARIAT';
      } else if (
        formId.indexOf('zen-diplomacy') !== -1 ||
        payload.step1_fullname ||
        payload.step3_primary_committee ||
        payload.firstCommitteeChoice
      ) {
        var commChoice = String(payload.step3_primary_committee || payload.firstCommitteeChoice || rawTab).toUpperCase();
        if (commChoice.indexOf('AIPPM') !== -1) schemaKey = 'AIPPM';
        else if (commChoice.indexOf('EMI') !== -1) schemaKey = 'EMI';
        else if (commChoice.indexOf('UNSC') !== -1) schemaKey = 'UNSC';
        else if (commChoice.indexOf('ECOSOC') !== -1 || commChoice.indexOf('UNODC') !== -1) schemaKey = 'ECOSOC';
        else schemaKey = 'ZEN_DIPLOMACY_MUN';
      }
    }

    var sheet = null;
    var row = [];

    if (schemaKey && TAB_SCHEMAS[schemaKey]) {
      var schema = TAB_SCHEMAS[schemaKey];
      sheet = getOrCreateSheet(schema);
      row = mapPayloadToRow(schemaKey, payload);
    } else {
      // Dynamic fallback for custom ZenForms
      var customSheetName = payload.sheetTab || payload.targetTab || 'ZenForms Intake';
      sheet = ss.getSheetByName(customSheetName);
      if (!sheet) {
        sheet = ss.insertSheet(customSheetName);
      }

      var lastCol = sheet.getLastColumn();
      var existingHeaders = [];
      if (lastCol > 0 && sheet.getLastRow() > 0) {
        existingHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
      } else {
        existingHeaders = ['Timestamp', 'Submission ID', 'Submitter'];
        sheet.appendRow(existingHeaders);
        formatHeaderRow(sheet, existingHeaders.length);
      }

      var payloadKeys = Object.keys(payload).filter(function(k) {
        return k !== 'action' && k !== 'targetTab' && k !== 'sheetTab';
      });

      payloadKeys.forEach(function(k) {
        if (existingHeaders.indexOf(k) === -1) {
          existingHeaders.push(k);
          sheet.getRange(1, existingHeaders.length).setValue(k);
        }
      });

      var now = Utilities.formatDate(new Date(), 'GMT+5:30', 'yyyy-MM-dd HH:mm:ss');
      row = existingHeaders.map(function(h) {
        if (h === 'Timestamp') return now;
        if (h === 'Submission ID') return payload.submissionId || payload.ticketId || ('SUB-' + Math.random().toString(36).substring(2, 8).toUpperCase());
        if (h === 'Submitter') return payload.submitterHandle || payload.submitter || 'anonymous';
        return payload[h] !== undefined ? payload[h] : '';
      });
    }

    // ── DE-DUPLICATION CHECK ──
    // Check if row with identical ticketId or submissionId was recently appended
    var uniqueId = String(payload.ticketId || payload.submissionId || '').trim();
    if (uniqueId && sheet.getLastRow() > 1) {
      var checkLimit = Math.min(25, sheet.getLastRow() - 1);
      var startRow = sheet.getLastRow() - checkLimit + 1;
      var recentData = sheet.getRange(startRow, 1, checkLimit, Math.min(sheet.getLastColumn(), 6)).getValues();
      for (var r = 0; r < recentData.length; r++) {
        var rowText = recentData[r].join(' ');
        if (rowText.indexOf(uniqueId) !== -1) {
          return ContentService.createTextOutput(JSON.stringify({
            status: 'SUCCESS',
            message: 'Duplicate submission prevented for ID: ' + uniqueId,
            duplicateSkipped: true,
            tabName: sheet.getName(),
            row: startRow + r
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    // ── FORMULA INJECTION & #ERROR! PREVENTION SANITIZATION ──
    for (var colIdx = 0; colIdx < row.length; colIdx++) {
      var cellVal = row[colIdx];
      if (typeof cellVal === 'string') {
        var str = cellVal.trim();
        // If string starts with +, =, @, or negative number, prefix with single quote to store as plain text
        if (str.charAt(0) === '+' || str.charAt(0) === '=' || str.charAt(0) === '@') {
          row[colIdx] = "'" + str.replace(/^'+/, '');
        } else if (str.charAt(0) === '-' && str.length > 1 && !isNaN(Number(str.slice(1)))) {
          row[colIdx] = "'" + str.replace(/^'+/, '');
        }
      }
    }

    sheet.appendRow(row);

    // Dual-log: If delegate registered into specific committee tab (AIPPM/EMI/UNSC/UNODC), also record in master ZEN DIPLOMACY MUN
    if (schemaKey === 'AIPPM' || schemaKey === 'EMI' || schemaKey === 'UNSC' || schemaKey === 'ECOSOC' || schemaKey === 'UNODC') {
      try {
        var masterSheet = getOrCreateSheet(TAB_SCHEMAS.ZEN_DIPLOMACY_MUN);
        masterSheet.appendRow(row);
      } catch (_) {}
    } else if (schemaKey === 'ZEN_DIPLOMACY_MUN') {
      // If submitted directly with target ZEN_DIPLOMACY_MUN, also mirror into the specific committee tab
      var commChoice2 = String(payload.step3_primary_committee || payload.firstCommitteeChoice || '').toUpperCase();
      var cKey = null;
      if (commChoice2.indexOf('AIPPM') !== -1) cKey = 'AIPPM';
      else if (commChoice2.indexOf('EMI') !== -1) cKey = 'EMI';
      else if (commChoice2.indexOf('UNSC') !== -1) cKey = 'UNSC';
      else if (commChoice2.indexOf('ECOSOC') !== -1 || commChoice2.indexOf('UNODC') !== -1) cKey = 'ECOSOC';
      if (cKey && TAB_SCHEMAS[cKey]) {
        try {
          var cSheet = getOrCreateSheet(TAB_SCHEMAS[cKey]);
          cSheet.appendRow(row);
        } catch (_) {}
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'SUCCESS',
      schemaKey: schemaKey || 'CUSTOM_FORM',
      tabName: sheet.getName(),
      rowAppended: sheet.getLastRow(),
      spreadsheetUrl: ss.getUrl(),
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'ERROR',
      message: err.toString(),
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * ==============================================================================
 * GET Request Handler (One-Click Setup, Live Matrix Sync & Founder Vault Search)
 * ==============================================================================
 */
function doGet(e) {
  try {
    var params = (e && e.parameter) || {};
    var action = (params.action || '').toUpperCase();
    var ss = getOrCreateSpreadsheet();

    // 1. One-click setup URL: visiting URL?action=INIT auto-creates all tabs!
    if (action === 'INIT' || action === 'SETUP' || action === 'CREATE_SHEET') {
      var initRes = initAllTabs();
      return ContentService.createTextOutput(JSON.stringify(initRes)).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Fetch Live Committee Portfolios for /matrix
    if (action === 'GET_MATRIX_PORTFOLIOS' || action === 'PORTFOLIOS') {
      var matrixSheet = ss.getSheetByName('Matrix Portfolios');
      if (!matrixSheet || matrixSheet.getLastRow() <= 1) {
        initAllTabs();
        matrixSheet = ss.getSheetByName('Matrix Portfolios');
      }

      var lastR = matrixSheet.getLastRow();
      var portfolios = [];

      if (lastR > 1) {
        var rows = matrixSheet.getRange(2, 1, lastR - 1, 9).getValues();
        portfolios = rows.map(function(r) {
          return {
            id: String(r[0]),
            committee: String(r[1]),
            title: String(r[2]),
            subTitle: String(r[3]),
            category: String(r[4]),
            status: String(r[5] || 'Vacant'),
            allocatedTo: String(r[6] || ''),
            allocatedEmail: String(r[7] || ''),
            difficulty: String(r[8] || 'Intermediate')
          };
        });
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        count: portfolios.length,
        portfolios: portfolios,
        spreadsheetUrl: ss.getUrl()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. Bi-directional search and counts for Founder Vault
    var rawTab = params.tab || 'Donations';
    var schemaKey = resolveSchemaKey(rawTab);
    var targetSheetName = (schemaKey && TAB_SCHEMAS[schemaKey]) ? TAB_SCHEMAS[schemaKey].sheetName : rawTab;
    var sheet = ss.getSheetByName(targetSheetName);

    if (sheet) {
      var data = sheet.getDataRange().getValues();
      if (data.length > 1) {
        var headers = data[0];
        var rows = [];
        var query = (params.q || '').toLowerCase().trim();

        for (var r = 1; r < data.length; r++) {
          var row = data[r];
          var rowObj = {};
          var match = !query;

          for (var c = 0; c < headers.length; c++) {
            var val = row[c];
            rowObj[headers[c]] = val;
            if (query && String(val).toLowerCase().indexOf(query) !== -1) {
              match = true;
            }
          }

          if (match) {
            rows.push(rowObj);
          }
        }

        return ContentService.createTextOutput(JSON.stringify({
          status: 'SUCCESS',
          tab: targetSheetName,
          count: rows.length,
          rows: rows.slice(-100),
          spreadsheetUrl: ss.getUrl(),
          connected: true
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    // Default health ping
    return ContentService.createTextOutput(JSON.stringify({
      status: 'online',
      system: 'Zenvitra Master Omni-Stream & Matrix Engine v5.0',
      spreadsheetUrl: ss.getUrl(),
      totalSchemas: Object.keys(TAB_SCHEMAS).length,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'ERROR',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
