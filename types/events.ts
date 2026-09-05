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
  status: RsvpStatus;
  rsvpAt: string;
  ticketId?: string;
  checkedInAt?: string;
}

export interface ZenEvent {
  id: string;
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
  tags: string[];
  createdAt: string;
  cancellationReason?: string;
  cancelledAt?: string;
  refundStatus?: 'none' | 'processing' | 'completed';
  totalRefundedAmount?: number;
}

