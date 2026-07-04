/**
 * M-Pesa Daraja API Integration
 * 
 * Handles STK Push (Lipa Na M-Pesa Online) payment initiation
 * and callback processing.
 */

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!;
const PASSKEY = process.env.MPESA_PASSKEY!;
const SHORTCODE = process.env.MPESA_SHORTCODE!;
const ENVIRONMENT = process.env.MPESA_ENVIRONMENT || 'sandbox';

const BASE_URL =
  ENVIRONMENT === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';

// ── Get OAuth Token ─────────────────────────────────────────────────
async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

  const res = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`M-Pesa auth failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.access_token;
}

// ── Generate Timestamp ──────────────────────────────────────────────
function getTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

// ── Generate Password ───────────────────────────────────────────────
function getPassword(timestamp: string): string {
  const str = `${SHORTCODE}${PASSKEY}${timestamp}`;
  return Buffer.from(str).toString('base64');
}

// ── Initiate STK Push ───────────────────────────────────────────────
export interface StkPushParams {
  phoneNumber: string;       // 2547XXXXXXXX
  amount: number;
  accountReference: string;  // e.g., checkout ID
  transactionDesc: string;
  callbackUrl: string;       // publicly accessible URL
}

export interface StkPushResult {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export async function initiateStkPush(params: StkPushParams): Promise<StkPushResult> {
  const token = await getAccessToken();
  const timestamp = getTimestamp();
  const password = getPassword(timestamp);

  const payload = {
    BusinessShortCode: SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: Math.round(params.amount),
    PartyA: params.phoneNumber,
    PartyB: SHORTCODE,
    PhoneNumber: params.phoneNumber,
    CallBackURL: params.callbackUrl,
    AccountReference: params.accountReference.slice(0, 12),
    TransactionDesc: params.transactionDesc.slice(0, 13),
  };

  const res = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`STK Push failed: ${res.status} ${text}`);
  }

  const data = await res.json();

  if (data.ResponseCode !== '0') {
    throw new Error(`STK Push error: ${data.ResponseDescription || data.errorMessage || 'Unknown error'}`);
  }

  return {
    MerchantRequestID: data.MerchantRequestID,
    CheckoutRequestID: data.CheckoutRequestID,
    ResponseCode: data.ResponseCode,
    ResponseDescription: data.ResponseDescription,
    CustomerMessage: data.CustomerMessage,
  };
}

// ── Query STK Push Status ───────────────────────────────────────────
export interface StkQueryParams {
  checkoutRequestID: string;
}

export interface StkQueryResult {
  ResponseCode: string;
  ResponseDescription: string;
  ResultCode: string;
  ResultDesc: string;
  MerchantRequestID?: string;
  CheckoutRequestID?: string;
}

export async function queryStkPushStatus(params: StkQueryParams): Promise<StkQueryResult> {
  const token = await getAccessToken();
  const timestamp = getTimestamp();
  const password = getPassword(timestamp);

  const payload = {
    BusinessShortCode: SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    CheckoutRequestID: params.checkoutRequestID,
  };

  const res = await fetch(`${BASE_URL}/mpesa/stkpushquery/v1/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`STK Query failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return {
    ResponseCode: data.ResponseCode,
    ResponseDescription: data.ResponseDescription,
    ResultCode: data.ResultCode,
    ResultDesc: data.ResultDesc,
    MerchantRequestID: data.MerchantRequestID,
    CheckoutRequestID: data.CheckoutRequestID,
  };
}

// ── Get the callback URL from environment ───────────────────────────
export function getMpesaCallbackUrl(): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${appUrl}/api/payments/mpesa-webhook`;
}
