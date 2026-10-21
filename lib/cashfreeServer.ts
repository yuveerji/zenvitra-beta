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

export interface CashfreePaymentLinkPayload {
  link_id?: string;
  link_amount: number;
  link_currency?: string;
  link_purpose: string;
  customer_details: {
    customer_phone: string;
    customer_email?: string;
    customer_name?: string;
  };
  link_expiry_time?: string;
  link_auto_reminders?: boolean;
  link_notify?: {
    send_sms?: boolean;
    send_email?: boolean;
  };
  link_meta?: {
    return_url?: string;
    notify_url?: string;
    upi_intent?: string;
    payment_methods?: string;
  };
  link_notes?: Record<string, string>;
  link_partial_payments?: boolean;
  link_minimum_partial_amount?: number;
}

export interface CashfreePaymentLinkResponse {
  cf_link_id?: number | string;
  link_id: string;
  link_url: string;
  link_qrcode?: string;
  link_status: 'ACTIVE' | 'PAID' | 'PARTIALLY_PAID' | 'EXPIRED' | 'CANCELLED';
  link_amount: number;
  link_amount_paid?: number;
  link_currency: string;
  link_purpose: string;
  link_expiry_time?: string;
  link_created_at?: string;
  customer_details?: {
    customer_phone?: string;
    customer_email?: string;
    customer_name?: string;
  };
  link_meta?: any;
  link_notes?: Record<string, string>;
  isGatewayOrderFallback?: boolean;
  orderId?: string;
  paymentSessionId?: string;
}

/**
 * Create a Payment Link via Cashfree PG 2025-01-01 API
 * Automatically falls back to creating a PG Order if link_creation_api is pending approval in merchant dashboard.
 */
export async function createCashfreePaymentLink(
  payload: CashfreePaymentLinkPayload,
  originUrl?: string
): Promise<CashfreePaymentLinkResponse> {
  const config = getCashfreeConfig();
  const url = `${config.baseUrl}/links`;

  const linkId = payload.link_id || `link_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const cleanPhone = (payload.customer_details?.customer_phone || '').replace(/[^0-9]/g, '').slice(-10) || '9999999999';

  const cleanPayload = {
    ...payload,
    link_id: linkId,
    link_amount: Math.round(Number(payload.link_amount) * 100) / 100,
    link_currency: (payload.link_currency || 'INR').toUpperCase(),
    customer_details: {
      ...payload.customer_details,
      customer_phone: cleanPhone,
    },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getCashfreeHeaders(),
      body: JSON.stringify(cleanPayload),
    });

    const data = await response.json();

    if (response.ok && data?.link_url) {
      return data as CashfreePaymentLinkResponse;
    }

    // If native links endpoint is not yet approved on merchant account, seamlessly create Cashfree PG Order
    if (!response.ok) {
      console.warn(`[Cashfree Links API Notice]: ${data?.message || 'Failed'}, initiating high-availability PG checkout fallback.`);
      
      const orderId = `ord_${linkId.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 45)}`;
      const customerId = payload.customer_details.customer_email
        ? `cust_${payload.customer_details.customer_email.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40)}`
        : `cust_${cleanPhone}`;

      const host = originUrl || 'https://zenvitra.xyz';
      const orderPayload: CashfreeOrderPayload = {
        order_id: orderId,
        order_amount: cleanPayload.link_amount,
        order_currency: cleanPayload.link_currency,
        customer_details: {
          customer_id: customerId,
          customer_name: payload.customer_details.customer_name || 'Event Delegate',
          customer_email: payload.customer_details.customer_email || 'delegate@zenvitra.xyz',
          customer_phone: cleanPhone,
        },
        order_meta: {
          return_url: `${host}/pay/${encodeURIComponent(linkId)}?status=verified&order_id={order_id}`,
          notify_url: `${host}/api/payments/cashfree/webhook`,
        },
        order_note: cleanPayload.link_purpose.substring(0, 200),
        order_tags: {
          linkId,
          purpose: cleanPayload.link_purpose.substring(0, 40),
          ...(cleanPayload.link_notes || {})
        }
      };

      const orderRes = await createCashfreeOrder(orderPayload);
      const fallbackUrl = `${host}/pay/${encodeURIComponent(linkId)}`;

      return {
        cf_link_id: orderRes.cf_order_id,
        link_id: linkId,
        link_url: fallbackUrl,
        link_status: 'ACTIVE',
        link_amount: cleanPayload.link_amount,
        link_amount_paid: 0,
        link_currency: cleanPayload.link_currency,
        link_purpose: cleanPayload.link_purpose,
        link_created_at: orderRes.created_at || new Date().toISOString(),
        customer_details: cleanPayload.customer_details,
        link_notes: cleanPayload.link_notes,
        isGatewayOrderFallback: true,
        orderId: orderRes.order_id,
        paymentSessionId: orderRes.payment_session_id,
      };
    }

    throw new Error(data?.message || 'Failed to create payment link');
  } catch (error: any) {
    console.error('createCashfreePaymentLink error:', error);
    throw error;
  }
}

/**
 * Fetch authoritative Payment Link details from Cashfree
 */
export async function getCashfreePaymentLink(linkId: string): Promise<CashfreePaymentLinkResponse> {
  const config = getCashfreeConfig();
  const url = `${config.baseUrl}/links/${encodeURIComponent(linkId)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getCashfreeHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    // If not found in native links, check if associated order exists
    const orderId = `ord_${linkId.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 45)}`;
    try {
      const order = await getCashfreeOrder(orderId);
      return {
        cf_link_id: order.cf_order_id,
        link_id: linkId,
        link_url: `https://zenvitra.xyz/pay/${encodeURIComponent(linkId)}`,
        link_status: order.order_status === 'PAID' ? 'PAID' : 'ACTIVE',
        link_amount: order.order_amount,
        link_amount_paid: order.order_status === 'PAID' ? order.order_amount : 0,
        link_currency: order.order_currency,
        link_purpose: order.order_note || 'Event Registration',
        link_created_at: order.created_at,
        customer_details: {
          customer_phone: order.customer_details.customer_phone,
          customer_email: order.customer_details.customer_email,
          customer_name: order.customer_details.customer_name,
        },
        isGatewayOrderFallback: true,
        orderId: order.order_id,
        paymentSessionId: order.payment_session_id,
      };
    } catch {
      throw new Error(data?.message || `Failed to fetch payment link: ${response.status}`);
    }
  }

  return data as CashfreePaymentLinkResponse;
}

/**
 * Cancel a Payment Link
 */
export async function cancelCashfreePaymentLink(linkId: string): Promise<any> {
  const config = getCashfreeConfig();
  const url = `${config.baseUrl}/links/${encodeURIComponent(linkId)}/cancel`;

  const response = await fetch(url, {
    method: 'POST',
    headers: getCashfreeHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || `Failed to cancel payment link: ${response.status}`);
  }

  return data;
}

/**
 * List orders under a payment link
 */
export async function getCashfreePaymentLinkOrders(linkId: string): Promise<any[]> {
  const config = getCashfreeConfig();
  const url = `${config.baseUrl}/links/${encodeURIComponent(linkId)}/orders?status=ALL`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getCashfreeHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    return [];
  }

  return Array.isArray(data) ? data : [];
}
