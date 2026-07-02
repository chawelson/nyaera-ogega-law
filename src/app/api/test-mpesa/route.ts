import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    consumerKey: process.env.MPESA_CONSUMER_KEY ? 'set' : 'missing',
    consumerSecret: process.env.MPESA_CONSUMER_SECRET ? 'set' : 'missing',
    passkey: process.env.MPESA_PASSKEY ? 'set' : 'missing',
    shortCode: process.env.MPESA_SHORTCODE ? 'set' : 'missing',
    environment: process.env.MPESA_ENVIRONMENT ?? 'not set',
  });
}
