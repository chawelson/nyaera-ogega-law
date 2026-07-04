/**
 * M-Pesa Connection Test Endpoint
 *
 * Tests the connection to Safaricom's Daraja API by:
 * 1. Getting an OAuth access token
 * 2. Logging the full response
 * 3. Returning success/failure details
 *
 * GET /api/test-mpesa-connection
 */

import { NextResponse } from 'next/server';

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!;
const ENVIRONMENT = process.env.MPESA_ENVIRONMENT || 'sandbox';

const BASE_URL =
  ENVIRONMENT === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';

interface TestStep {
  step: string;
  status: string;
  [key: string]: unknown;
}

interface TestResult {
  environment: string;
  baseUrl: string;
  consumerKeyPrefix: string;
  consumerKeyLength: number;
  consumerSecretPrefix: string;
  consumerSecretLength: number;
  steps: TestStep[];
  success: boolean;
  token?: string | null;
  expiresIn?: unknown;
}

export async function GET() {
  const results: TestResult = {
    environment: ENVIRONMENT,
    baseUrl: BASE_URL,
    consumerKeyPrefix: CONSUMER_KEY?.slice(0, 8) + '...',
    consumerKeyLength: CONSUMER_KEY?.length || 0,
    consumerSecretPrefix: CONSUMER_SECRET?.slice(0, 8) + '...',
    consumerSecretLength: CONSUMER_SECRET?.length || 0,
    steps: [],
    success: false,
  };

  // ── Step 1: Validate credentials exist ────────────────────────────
  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    results.steps.push({
      step: 'validate-credentials',
      status: 'failed',
      error: 'Missing MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET environment variables',
    });
    return NextResponse.json(results, { status: 500 });
  }

  // ── Step 2: Generate auth header ──────────────────────────────────
  let authHeader: string;
  try {
    const credentials = `${CONSUMER_KEY}:${CONSUMER_SECRET}`;
    authHeader = Buffer.from(credentials).toString('base64');
    results.steps.push({
      step: 'generate-auth-header',
      status: 'success',
      authHeaderPrefix: authHeader.slice(0, 16) + '...',
    });
  } catch (err) {
    results.steps.push({
      step: 'generate-auth-header',
      status: 'failed',
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(results, { status: 500 });
  }

  // ── Step 3: Request access token ──────────────────────────────────
  const tokenUrl = `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`;

  try {
    console.log(`🔑 Requesting M-Pesa access token from: ${tokenUrl}`);

    const res = await fetch(tokenUrl, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${authHeader}`,
      },
    });

    const statusCode = res.status;
    const statusText = res.statusText;
    let responseBody: unknown;

    try {
      responseBody = await res.json();
    } catch {
      responseBody = await res.text();
    }

    console.log(`📡 M-Pesa token response [${statusCode}]:`, JSON.stringify(responseBody, null, 2));

    results.steps.push({
      step: 'request-access-token',
      status: res.ok ? 'success' : 'failed',
      httpStatus: statusCode,
      httpStatusText: statusText,
      response: responseBody,
    });

    if (res.ok) {
      const body = responseBody as Record<string, unknown>;
      results.success = true;
      results.token = body.access_token
        ? (body.access_token as string).slice(0, 32) + '...'
        : null;
      results.expiresIn = body.expires_in;
    }
  } catch (err) {
    const errorDetails = {
      name: err instanceof Error ? err.name : 'Unknown',
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    };

    console.error(`❌ M-Pesa token request failed:`, errorDetails);

    results.steps.push({
      step: 'request-access-token',
      status: 'error',
      error: errorDetails,
    });
  }

  // ── Return full results ───────────────────────────────────────────
  const httpStatus = results.success ? 200 : 500;
  return NextResponse.json(results, { status: httpStatus });
}
