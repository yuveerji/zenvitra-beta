export type ZenPassTierType =
  | 'early_bird'
  | 'general_delegate'
  | 'vip_all_access'
  | 'student_discount'
  | 'group_delegation'
  | 'custom_tier';

export interface ZenPassTier {
  id: string;
  name: string;
  type: ZenPassTierType;
  price: number;
  currency: 'INR' | 'USD';
  description: string;
  perks: string[];
  availableCount: number;
  maxCapacity: number;
  badgeText?: string;
  isPopular?: boolean;
}

export interface ZenPassTicket {
  id: string;
  ticketNumber: string;
  eventId: string;
  eventTitle: string;
  eventCategory: string;
  eventBannerUrl?: string;
  venue: string;
  venueCity: string;
  eventDate: string;
  eventTime: string;
  tierId: string;
  tierName: string;
  tierPrice: number;
  currency: 'INR' | 'USD';
  quantity: number;
  totalAmount: number;
  allocatedPortfolio?: string;
  committeeName?: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeeHandle: string;
  attendeePhone?: string;
  collegeOrSchool?: string;
  qrCodeValue: string;
  securityPulseHash: string;
  status: 'valid' | 'checked_in' | 'transferred' | 'cancelled' | 'refunded';
  chamberRoomId?: string;
  issuedAt: string;
  checkedInAt?: string;
  checkedInBy?: string;
  refundAmount?: number;
  refundedAt?: string;
  refundReason?: string;
  refundTransactionId?: string;
}

export interface ZenPassEventMetrics {
  eventId: string;
  totalPassesSold: number;
  grossRevenue: number;
  totalCapacity: number;
  checkedInCount: number;
  remainingPasses: number;
}
