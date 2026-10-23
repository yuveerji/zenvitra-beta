export type EventType = 'physical' | 'virtual' | 'hybrid';
export type EventCategory = 'SUMMIT' | 'WORKSHOP' | 'KEYNOTE' | 'MEETUP' | 'HACKATHON' | 'MUN' | 'DEBATE' | 'PARLIAMENT' | 'POLICY' | 'OTHER';
export type EventStatus = 'upcoming' | 'live' | 'past' | 'cancelled' | 'coming_soon';
export type RsvpStatus = 'going' | 'interested' | 'declined' | 'checked_in';
export type EventView = 'list' | 'detail' | 'create' | 'dashboard';
export type EventFilter = 'all' | 'upcoming' | 'past' | 'my-events' | 'nearby' | 'cancelled';

export type EventOrganizerRole = 'owner' | 'co_host' | 'secretariat' | 'gate_scanner' | 'auditor';

export interface EventTeamMember {
  userId: string;
  name: string;
  username: string;
  role: EventOrganizerRole;
  grantedAt: string;
  grantedBy: string;
}

export interface EventAttendee {
  userId: string;
  name: string;
  username: string;
  email?: string;
  phone?: string;
  status: RsvpStatus;
  rsvpAt: string;
  ticketId?: string;
  ticketType?: string;
  isStudent?: boolean;
  price?: number;
  checkedInAt?: string;

  // Delegate Intake Dossier Fields
  committeePreference?: string;
  portfolioPreference?: string;
  experienceLevel?: string;
  institution?: string;
  dietaryPreference?: string;
  emergencyContact?: string;
  idProofUrl?: string;
  customResponses?: Record<string, string>;
}

export interface RegistrationPlan {
  id: string;
  name: string;
  price: number; // in INR (0 = Free)
  currency?: string;
  description: string;
  perks: string[];
  capacity?: number;
  bookedCount?: number;
  badge?: string;
  isPopular?: boolean;
  status: 'active' | 'sold_out' | 'paused' | 'coming_soon';
  paymentLinkId?: string;
  paymentLinkUrl?: string;

  // Exclusive Bank & Card Offer / Phased Sales
  salePhase?: 'NOW' | 'SCHEDULED' | 'COMING_SOON';
  saleStartDate?: string; // ISO date string when general sale unlocks
  saleEndDate?: string;   // ISO date string when this tier closes
  releaseTrigger?: 'IMMEDIATE' | 'SCHEDULED_DATE' | 'AFTER_PREVIOUS_TIER' | 'COMING_SOON';
  previousTierId?: string;
  tierIndex?: number;
  exclusiveOffer?: {
    enabled: boolean;
    cardType?: 'RUPAY' | 'VISA' | 'MASTERCARD' | 'STUDENT' | 'EARLY_ACCESS';
    title: string; // e.g. "RUPAY SALE • ₹150 OFF"
    discountPercent?: number; // e.g. 20%
    discountFlat?: number; // e.g. 150
    badgeText?: string; // e.g. "RUPAY EXCLUSIVE"
  };
}

export interface CashfreePaymentLinkRecord {
  linkId: string;
  cfLinkId?: number | string;
  linkUrl: string;
  linkStatus: 'ACTIVE' | 'PAID' | 'PARTIALLY_PAID' | 'EXPIRED' | 'CANCELLED';
  amount: number;
  currency: string;
  planId?: string;
  planName: string;
  recipientName?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  createdAt: string;
  qrCode?: string;
}

export interface ZenEvent {
  id: string;
  slug?: string;
  title: string;
  description: string;
  coverImage?: string;
  type: EventType;
  location: string;
  city?: string;
  meetingUrl?: string;
  latitude?: number;
  longitude?: number;
  distanceKm?: number;
  date: string;       // ISO date string
  endDate?: string;
  time: string;
  capacity?: number;
  attendees: EventAttendee[];
  organizerId: string;
  organizerName: string;
  organizerUsername: string;
  teamMembers?: EventTeamMember[];
  category: EventCategory;
  status: EventStatus;
  ticketPrice?: number;
  plans?: RegistrationPlan[];
  paymentLinks?: CashfreePaymentLinkRecord[];
  tags: string[];
  createdAt: string;

  // Configurable Form Timing & Payments Timing
  formTiming?: 'CREATE_NOW' | 'CREATE_AFTER';
  formId?: string; // Linked custom form if created
  paymentTiming?: 'ACCEPT_NOW' | 'ACCEPT_AFTER';
  paymentGoLiveDate?: string; // ISO date when ticketing starts
  paymentCollectionMethod?: 'ONLINE_CASHFREE' | 'AT_VENUE' | 'APPROVAL_FIRST' | 'APPROVAL_THEN_PAY';
  
  // Coming Soon & Phased Sales
  isComingSoon?: boolean;
  comingSoonAnnouncement?: string;
  comingSoonReleaseDate?: string;
  tagline?: string;
  startTime?: string;
  endTime?: string;
  timezone?: string;
  isMultiDay?: boolean;
  intakeFields?: Array<{ id: string; label: string; type: string; required: boolean; enabled: boolean }>;
  schedule?: Array<{ id: string; time: string; title: string; day?: string; location?: string }>;
  itineraryTiming?: 'NOW' | 'AFTER';
  itineraryText?: string;
  secretariatContact?: { name?: string; email?: string; phone?: string; role?: string };
  dressCode?: string;
  perks?: string[];
  cancellationReason?: string;
  cancelledAt?: string;
  refundStatus?: 'none' | 'processing' | 'completed';
  totalRefundedAmount?: number;
  verified?: boolean;
  verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

