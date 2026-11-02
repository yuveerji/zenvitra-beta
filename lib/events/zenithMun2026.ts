import { ZenEvent } from '@/types/events';

export const ZENITH_MUN_2026_EVENT: ZenEvent = {
  id: 'zenith-mun-2026',
  slug: 'zenith-mun-2026',
  title: 'ZENITH MODEL UNITED NATIONS 2026',
  description: 'A NEW ZEN BEGINS. PRESENTED BY ZENVITRA | BY YOUTH. FOR YOUTH. Zenith Model United Nations 2026 convenes in the historic royal city of Udaipur, Rajasthan for an uncompromised offline multilateral summit. Featuring synchronous debate chambers, crisis war rooms, acoustic procedural gavels, and nationwide youth delegates.',
  type: 'physical',
  category: 'MUN',
  date: 'Summer 2027',
  endDate: 'Summer 2027',
  time: 'Timings & Itinerary Coming Soon',
  location: 'Heritage Convention Centre, City Palace Enclave',
  city: 'Udaipur',
  coverImage: '/images/events/zenith-mun-2026-poster.png',
  ticketPrice: 0,
  isComingSoon: true,
  isDateComingSoon: true,
  dateTbaText: 'Summer 2027 (Dates Coming Soon)',
  isItineraryComingSoon: true,
  itineraryTiming: 'AFTER',
  itineraryTbaText: 'Detailed Conference Itinerary & Session Flow Coming Soon',
  comingSoonAnnouncement: 'A NEW ZEN BEGINS. Offline Summit in Udaipur, Rajasthan • Summer 2027. Secretariat Applications Now Open!',
  comingSoonReleaseDate: '2027-05-01',
  status: 'coming_soon',
  verified: true,
  verificationStatus: 'VERIFIED',
  organizerId: 'zenith_secretariat',
  organizerName: 'ZENITH MUN 2026 Secretariat',
  organizerUsername: 'zenith_secretariat',
  tags: ['mun', 'zenith', 'udaipur', 'offline', 'rajasthan', 'conference', 'youth'],
  formId: 'zenith-secretariat-2026',
  formTiming: 'CREATE_NOW',
  paymentTiming: 'ACCEPT_AFTER',
  paymentCollectionMethod: 'APPROVAL_FIRST',
  startTime: '09:00',
  endTime: '18:00',
  timezone: 'IST (UTC+5:30)',
  isMultiDay: true,
  attendees: [],
  createdAt: new Date().toISOString(),
  plans: [
    {
      id: 'zenith_sec_app',
      name: 'Secretariat & Executive Board Application',
      price: 0,
      description: 'Official application for leadership departments in the Zenith MUN 2026 Secretariat.',
      perks: [
        'Executive Board Clearance',
        'Official Accreditation & Lanyard',
        'Direct Committee Leadership',
        'Secretariat Gala & Dinner Access',
        'Verified Diplomatic Dossier & Certificate'
      ],
      status: 'active'
    },
    {
      id: 'zenith_delegate_pass',
      name: 'Delegate Pass (Offline Attendance — Udaipur)',
      price: 0,
      description: 'In-person delegate admission to Zenith MUN 2026 committee chambers in Udaipur. Early bird drop announcing soon.',
      perks: [
        '2-Day Committee Chamber Access',
        'Acoustic Dais Gavel Synthesis',
        'Official Delegate Kit & Placard',
        'Working Lunch & High Tea',
        'Permanent ZENVITRA Diplomatic Passport Record'
      ],
      status: 'coming_soon'
    }
  ],
  secretariatContact: {
    name: 'Zenith Executive Directorate',
    email: 'secretariat@zenvitra.xyz',
    role: 'Secretary-General & Convenor'
  }
};
