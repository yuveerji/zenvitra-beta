// ─── ZEN.PAYMENTS STATE & DATA ENGINE ───
import {
  PaymentTransaction,
  PaymentReceipt,
  PaymentInvoice,
  PaymentSubscription,
  PayoutRecord,
  AccountBalance,
  TaxBreakdown
} from '@/types/payments';

export const LS_ZEN_TXNS = 'zenvitra_payments_txns_v1';
export const LS_ZEN_INVOICES = 'zenvitra_payments_invoices_v1';
export const LS_ZEN_PAYOUTS = 'zenvitra_payments_payouts_v1';

export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'ZPAY-2026-00018472',
    receiptId: 'ZR-2026-001829',
    status: 'SUCCESS',
    amount: 299,
    currency: 'INR',
    purpose: 'MUN Delegate Registration',
    product: 'ZEN.MUN',
    eventOrItemName: 'ZENMUN 2026 — Sovereign Youth Diplomatic Assembly',
    payerName: 'Yuveer',
    payerEmail: 'yuveer@zenvitra.xyz',
    merchantName: 'ZENMUN Secretariat',
    paymentMethod: 'UPI_QR',
    paymentDetailsMasked: 'UPI: yuveer@okaxis',
    taxBreakdown: {
      baseAmount: 299,
      gatewayTax: 20.5,
      gstAmount: 0,
      gstRate: 0,
      gstLabel: '0% Student Exemption (Age ≤ 18)',
      totalPayable: 319.5
    },
    createdAt: '2026-09-02T11:42:00Z',
    settledAt: '2026-09-02T11:43:10Z'
  },
  {
    id: 'ZPAY-2026-00018471',
    receiptId: 'ZR-2026-001828',
    status: 'SUCCESS',
    amount: 249,
    currency: 'INR',
    purpose: 'ZEN PRO Monthly Membership',
    product: 'ZEN_PRO',
    eventOrItemName: 'ZEN PRO Tier',
    payerName: 'Yuveer',
    payerEmail: 'yuveer@zenvitra.xyz',
    merchantName: 'ZENVITRA Operating Entity',
    paymentMethod: 'CREDIT_CARD',
    paymentDetailsMasked: 'Mastercard: •••• 8821',
    taxBreakdown: {
      baseAmount: 249,
      gatewayTax: 20.25,
      gstAmount: 0,
      gstRate: 0,
      gstLabel: '0% Student Exemption (Age ≤ 18)',
      totalPayable: 269.25
    },
    createdAt: '2026-09-01T09:15:00Z',
    settledAt: '2026-09-01T09:16:00Z'
  },
  {
    id: 'ZPAY-2026-00018470',
    receiptId: 'ZR-2026-001827',
    status: 'REFUNDED',
    amount: 499,
    currency: 'INR',
    purpose: 'Youth Policy Summit Pass',
    product: 'ZEN.EVENTS',
    eventOrItemName: 'National Climate Summit',
    payerName: 'Yuveer',
    payerEmail: 'yuveer@zenvitra.xyz',
    merchantName: 'Youth Policy Foundation',
    paymentMethod: 'UPI_ID',
    paymentDetailsMasked: 'UPI: yuveer@icici',
    taxBreakdown: {
      baseAmount: 499,
      gatewayTax: 21.5,
      gstAmount: 0,
      gstRate: 0,
      gstLabel: '0% Student Exemption (Age ≤ 18)',
      totalPayable: 520.5
    },
    createdAt: '2026-08-28T14:30:00Z',
    settledAt: '2026-08-28T14:31:00Z',
    refundReason: 'Event date rescheduled by organizer (>14 days prior - 100% refund)',
    refundAmount: 499
  }
];

export const INITIAL_INVOICES: PaymentInvoice[] = [
  {
    id: 'INV-2026-00481',
    billToName: 'Ananya Deshmukh',
    billToEmail: 'contact@delhiyouthcouncil.org',
    billToOrg: 'Delhi Youth Council',
    invoiceDate: '2026-09-01',
    dueDate: '2026-09-15',
    items: [
      { id: '1', description: 'Model UN Secretariat Dais Consultation', quantity: 1, unitPrice: 5000, amount: 5000 },
      { id: '2', description: 'Rules of Procedure & Bill Drafting Workshop', quantity: 1, unitPrice: 3000, amount: 3000 }
    ],
    subtotal: 8000,
    taxAmount: 1440,
    totalAmount: 9440,
    status: 'SENT',
    paymentLinkUrl: '/payments?pay=INV-2026-00481'
  }
];

export const INITIAL_SUBSCRIPTIONS: PaymentSubscription[] = [
  {
    id: 'SUB-2026-089',
    planName: 'ZEN PRO Sovereign Tier',
    amount: 249,
    currency: 'INR',
    billingCycle: 'monthly',
    status: 'ACTIVE',
    nextBillingDate: '2026-10-01',
    paymentMethodMasked: 'Mastercard •••• 8821'
  }
];

export const INITIAL_BALANCE: AccountBalance = {
  available: 82490,
  pending: 21300,
  onHold: 5000,
  currency: 'INR',
  bankAccountMasked: 'State Bank of India •••• 4812'
};

export const INITIAL_PAYOUTS: PayoutRecord[] = [
  {
    id: 'PO-2026-0089',
    amount: 45000,
    currency: 'INR',
    bankAccountMasked: 'HDFC Bank •••• 1928',
    status: 'COMPLETED',
    requestedAt: '2026-08-25T10:00:00Z',
    completedAt: '2026-08-26T16:00:00Z'
  },
  {
    id: 'PO-2026-0090',
    amount: 25000,
    currency: 'INR',
    bankAccountMasked: 'State Bank of India •••• 4812',
    status: 'PROCESSING',
    requestedAt: '2026-09-02T14:30:00Z'
  }
];

// Helper: Calculate tax formula
export function computeTax(baseAmount: number, userAge: number = 17, isCollegeStudent: boolean = false, currency: 'INR' | 'USD' = 'INR'): TaxBreakdown {
  if (baseAmount <= 0) {
    return {
      baseAmount: 0,
      gatewayTax: 0,
      gstAmount: 0,
      gstRate: 0,
      gstLabel: '0% Exempt',
      totalPayable: 0
    };
  }

  // 0.5% + ₹19 (or $0.25 if USD)
  const gatewayTax = currency === 'INR'
    ? Math.round(((baseAmount * 0.005) + 19) * 100) / 100
    : Math.round(((baseAmount * 0.005) + 0.25) * 100) / 100;

  let gstRate = 0.12;
  let gstLabel = '12% Statutory GST';

  if (userAge <= 18) {
    gstRate = 0;
    gstLabel = '0% Student Exemption (Age ≤ 18)';
  } else if ((userAge >= 19 && userAge <= 21) || isCollegeStudent) {
    gstRate = 0.05;
    gstLabel = isCollegeStudent && userAge > 21
      ? '5% College Student Concession'
      : '5% Concessional GST (Ages 19-21 / College)';
  }

  const gstAmount = Math.round((baseAmount * gstRate) * 100) / 100;
  const totalPayable = Math.round((baseAmount + gatewayTax + gstAmount) * 100) / 100;

  return {
    baseAmount,
    gatewayTax,
    gstAmount,
    gstRate,
    gstLabel,
    totalPayable
  };
}
