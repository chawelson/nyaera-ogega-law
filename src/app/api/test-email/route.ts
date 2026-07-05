import { NextRequest, NextResponse } from 'next/server';
import { sendPurchaseReceipt } from '@/lib/email';

/**
 * GET /api/test-email
 * Sends a test purchase receipt email to verify the Resend integration.
 * 
 * Usage:
 *   GET /api/test-email
 *   GET /api/test-email?email=you@example.com
 * 
 * The email will contain a fake download link and document info.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testEmail = searchParams.get('email') || 'info@nyaeraogegaadvocates.com';

    console.log(`📧 [TEST-EMAIL] Sending test receipt to: ${testEmail}`);

    const result = await sendPurchaseReceipt({
      to: testEmail,
      buyerName: 'Test User',
      documentTitle: 'Test Document — Sale Agreement',
      amount: 2500,
      downloadUrl: 'https://nyaeraogegaadvocates.com/api/download/test-token-123',
      transactionId: `TEST-${Date.now()}`,
    });

    if (result) {
      console.log(`✅ [TEST-EMAIL] Successfully sent to ${testEmail}`);
      return NextResponse.json({
        success: true,
        message: `Test receipt email sent to ${testEmail}`,
        details: {
          to: testEmail,
          documentTitle: 'Test Document — Sale Agreement',
          amount: 2500,
          transactionId: `TEST-${Date.now()}`,
        },
      });
    } else {
      console.error(`❌ [TEST-EMAIL] Failed to send to ${testEmail}`);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send test email. Check server logs for details.',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ [TEST-EMAIL] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
