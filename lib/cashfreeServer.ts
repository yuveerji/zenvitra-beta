import crypto from 'crypto';

export interface CashfreeCustomerDetails {
  customer_id: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
}

export interface CashfreeOrderPayload {
  order_id: string;
  order_amount: number;
  order_currency: string;
  customer_details: CashfreeCustomerDetails;
  order_meta?: {
    return_url?: string;
    notify_url?: string;
    payment_methods?: string;
  };
  order_note?: string;
  order_tags?: Record<string, string>;
}

export interface CashfreeOrderResponse {
  cf_order_id: string;
  order_id: string;
  entity: string;
  order_currency: string;
  order_amount: number;
  order_status: 'ACTIVE' | 'PAID' | 'EXPIRED';
  payment_session_id: string;
  order_expiry_time?: string;
  order_note?: string;
  created_at: string;
  customer_details: CashfreeCustomerDetails;
  payments?: {
    url?: string;
  };
  settlements?: {
    url?: string;
  };
  refunds?: {
    url?: string;
  };
}

export function getCashfreeConfig() {
  const appId = process.env.CASHFREE_APP_ID || '';
  const secretKey = process.env.CASHFREE_SECRET_KEY || '';
  const env = (process.env.CASHFREE_ENVIRONMENT || 'sandbox').toLowerCase();
  
  if (!appId || !secretKey) {
    console.warn('Cashfree credentials (CASHFREE_APP_ID, CASHFREE_SECRET_KEY) are missing in environment variables');
  }
  
  const baseUrl = env === 'production' 
    ? 'https://api.cashfree.com/pg' 
    : 'https://sandbox.cashfree.com/pg';

  return {
    appId,
    secretKey,
    env,
    baseUrl,
    apiVersion: '2025-01-01',
  };
}

export function getCashfreeHeaders() {
  const config = getCashfreeConfig();
  return {
    'Content-Type': 'application/json',
    'x-api-version': config.apiVersion,
    'x-client-id': config.appId,
    'x-client-secret': config.secretKey,
  };
}

/**
 * Create a new payment order with Cashfree PG (2025-01-01 API)
 */
export async function createCashfreeOrder(payload: CashfreeOrderPayload): Promise<CashfreeOrderResponse> {
  const config = getCashfreeConfig();
  const url = `${config.baseUrl}/orders`;

  const response = await fetch(url, {
    method: 'POST',
    headers: getCashfreeHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `Cashfree Order API failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as CashfreeOrderResponse;
}

/**
 * Fetch authoritative order details and status from Cashfree
 */
export async function getCashfreeOrder(orderId: string): Promise<CashfreeOrderResponse> {
  const config = getCashfreeConfig();
  const url = `${config.baseUrl}/orders/${encodeURIComponent(orderId)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getCashfreeHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || `Failed to fetch Cashfree order: ${response.status}`);
  }

  return data as CashfreeOrderResponse;
}

/**
 * Fetch all payments/attempts for an order
 */
export async function getCashfreeOrderPayments(orderId: string): Promise<any[]> {
  const config = getCashfreeConfig();
  const url = `${config.baseUrl}/orders/${encodeURIComponent(orderId)}/payments`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getCashfreeHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || `Failed to fetch Cashfree order payments: ${response.status}`);
  }

  return Array.isArray(data) ? data : [];
}

/**
 * Verifies webhook signature using HMAC-SHA256
 * Algorithm: Base64(HMAC-SHA256(timestamp + rawBody, secretKey))
 */
export function verifyCashfreeWebhookSignature(
  rawBody: string,
  timestamp: string,
  signature: string
): boolean {
  try {
    const config = getCashfreeConfig();
    const signedPayload = timestamp + rawBody;
    const expectedSignature = crypto
      .createHmac('sha256', config.secretKey)
      .update(signedPayload)
      .digest('base64');

    return crypto.timingSafeEqual(
      Buffer.from(signature, 'utf8'),
      Buffer.from(expectedSignature, 'utf8')
    );
  } catch (err) {
    console.error('Cashfree Webhook Signature Verification Error:', err);
    return false;
  }
}
