// ─── ZEN.PAYMENTS TYPE SYSTEM ───
// Core payment orchestration, billing, checkout, receipts, invoices, payouts & balance

export type PaymentStatus = 
  | 'INITIATED' 
  | 'PENDING' 
  | 'PROCESSING' 
  | 'SUCCESS' 
  | 'SETTLED' 
  | 'FAILED' 
  | 'REFUNDED' 
  | 'PARTIALLY_REFUNDED' 
  | 'DISPUTED' 
  | 'ON_HOLD';

export type PaymentProduct = 
  | 'ZEN.MUN' 
  | 'ZEN.EVENTS' 
  | 'ZEN+' 
  | 'ZEN_PRO' 
  | 'ZEN_ELITE' 
  | 'PROFESSIONAL_ORG' 
  | 'DONATION' 
  | 'INVOICE' 
  | 'CUSTOM';

export type PaymentMethodType = 
  | 'UPI_QR' 
  | 'UPI_ID' 
  | 'CREDIT_CARD' 
  | 'DEBIT_CARD' 
  | 'NET_BANKING';

export interface TaxBreakdown {
  baseAmount: number;
  gatewayTax: number;      // 0.5% + ₹19 (or USD equivalent)
  gstAmount: number;       // 0% (≤18), 5% (19-21 or College), 12% (Adult non-student)
  gstRate: number;
  gstLabel: string;
  totalPayable: number;
}

export interface PaymentTransaction {
  id: string;               // e.g. "ZPAY-2026-00018472"
  receiptId?: string;       // e.g. "ZR-2026-001829"
  status: PaymentStatus;
  amount: number;
  currency: 'INR' | 'USD';
  purpose: string;          // e.g. "Delhi International MUN Registration", "ZEN PRO Subscription"
  product: PaymentProduct;
  eventOrItemName?: string;
  payerName: string;
  payerEmail: string;
  merchantName: string;     // e.g. "Delhi MUN Foundation", "ZENVITRA Operating Entity"
  paymentMethod: PaymentMethodType;
  paymentDetailsMasked?: string; // e.g. "UPI: user@okaxis" or "Card: •••• 4242"
  taxBreakdown: TaxBreakdown;
  createdAt: string;
  settledAt?: string;
  refundReason?: string;
  refundAmount?: number;
}

export interface PaymentReceipt {
  id: string;               // e.g. "ZR-2026-001829"
  transactionId: string;
  paidBy: string;
  payerEmail: string;
  paidTo: string;
  purpose: string;
  amount: number;
  currency: 'INR' | 'USD';
  status: 'PAID' | 'REFUNDED';
  date: string;
  taxSummary: TaxBreakdown;
  signatureHash: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface PaymentInvoice {
  id: string;               // e.g. "INV-2026-00481"
  billToName: string;
  billToEmail: string;
  billToOrg?: string;
  invoiceDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  paymentLinkUrl?: string;
  paidTransactionId?: string;
}

export interface PaymentSubscription {
  id: string;
  planName: string;
  amount: number;
  currency: 'INR' | 'USD';
  billingCycle: 'monthly' | 'annual';
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'TRIAL';
  nextBillingDate: string;
  paymentMethodMasked: string;
}

export interface PayoutRecord {
  id: string;               // e.g. "PO-2026-0089"
  amount: number;
  currency: 'INR' | 'USD';
  bankAccountMasked: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REVERSED';
  requestedAt: string;
  completedAt?: string;
}

export interface AccountBalance {
  available: number;
  pending: number;
  onHold: number;
  currency: 'INR' | 'USD';
  bankAccountMasked: string;
}
