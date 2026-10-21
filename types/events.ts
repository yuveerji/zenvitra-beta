export type EventType = 'physical' | 'virtual' | 'hybrid';
export type EventCategory = 'SUMMIT' | 'WORKSHOP' | 'KEYNOTE' | 'MEETUP' | 'HACKATHON' | 'MUN' | 'DEBATE' | 'PARLIAMENT' | 'POLICY' | 'OTHER';
export type EventStatus = 'upcoming' | 'live' | 'past' | 'cancelled';
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
  status: 'active' | 'sold_out' | 'paused';
  paymentLinkId?: string;
  paymentLinkUrl?: string;
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
  cancellationReason?: string;
  cancelledAt?: string;
  refundStatus?: 'none' | 'processing' | 'completed';
  totalRefundedAmount?: number;
  verified?: boolean;
  verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

