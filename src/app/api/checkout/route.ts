import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { generateDownloadToken, getTokenExpiry, createDownloadUrl } from '@/lib/download-token';
import { sendPurchaseReceipt } from '@/lib/email';
import { initiateStkPush, getMpesaCallbackUrl } from '@/lib/mpesa';

/**
 * POST /api/checkout
 * Processes a checkout with guest info (email + phone), creates purchase record,
 * initiates M-Pesa STK Push, and returns the checkout request ID for polling.
 *
 * Test mode:
 *   - Auto-enabled when NODE_ENV === 'development'
 *   - Can be forced with ?test=true query parameter
 *   - Can be forced with NEXT_PUBLIC_MPESA_TEST_MODE=true env var
 *   - Uses MPESA_TEST_AMOUNT env var (defaults to 1) for the charge amount
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, email, phone, name } = body;

    // ── Test mode detection ──────────────────────────────────────────
    const { searchParams } = new URL(request.url);
    const isTestMode =
      process.env.NODE_ENV === 'development' ||
      searchParams.get('test') === 'true' ||
      process.env.NEXT_PUBLIC_MPESA_TEST_MODE === 'true';

    // Determine test amount from env var, default to 1
    const testAmount = parseInt(process.env.MPESA_TEST_AMOUNT || '1', 10);

    if (isTestMode) {
      console.log(`🧪 TEST MODE: Using KES ${testAmount} for all items (from MPESA_TEST_AMOUNT env var)`);
    }

    // ── Validation ──────────────────────────────────────────────────
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    if (!phone || !/^2547\d{8}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Valid Kenyan phone number required (2547XXXXXXXX)' },
        { status: 400 }
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Valid email address required' },
        { status: 400 }
      );
    }

    const buyerName = name || email.split('@')[0];

    // ── Process each item ───────────────────────────────────────────
    const db = getDb();
    const results = [];

    for (const item of items) {
      // Verify document exists
      const document = await db.document.findUnique({
        where: { id: item.id },
      });

      if (!document) {
        return NextResponse.json(
          { error: `Document with id ${item.id} not found` },
          { status: 404 }
        );
      }

      // Generate checkout ID (used as AccountReference for M-Pesa)
      const checkoutId = `CHK-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

      // Generate download token with 48hr expiry
      const downloadToken = generateDownloadToken();
      const tokenExpiry = getTokenExpiry();

      // Determine the amount to charge (test amount in test mode, actual price otherwise)
      const chargeAmount = isTestMode ? testAmount : document.price;

      // Create purchase record (pending until M-Pesa confirms)
      const purchase = await db.purchase.create({
        data: {
          documentId: document.id,
          userEmail: email,
          userPhone: phone,
          amount: chargeAmount,
          checkoutId,
          status: 'pending',
          downloadToken,
          tokenExpiry,
          tokenUsed: false,
          licenseAccepted: false,
        },
        include: {
          document: true,
        },
      });

      // ── Initiate M-Pesa STK Push ──────────────────────────────────
      const callbackUrl = getMpesaCallbackUrl();

      try {
        const stkResult = await initiateStkPush({
          phoneNumber: phone,
          amount: chargeAmount,
          accountReference: checkoutId,
          transactionDesc: isTestMode ? 'TEST PURCHASE' : document.title,
          callbackUrl,
        });

        console.log(`📱 STK Push initiated:`, {
          checkoutId,
          CheckoutRequestID: stkResult.CheckoutRequestID,
          MerchantRequestID: stkResult.MerchantRequestID,
        });

        // Update purchase with the M-Pesa CheckoutRequestID for webhook matching
        await db.purchase.update({
          where: { id: purchase.id },
          data: {
            // Store the CheckoutRequestID so the webhook can find this purchase
            checkoutId: stkResult.CheckoutRequestID,
          },
        });

        results.push({
          purchaseId: purchase.id,
          checkoutId: stkResult.CheckoutRequestID,
          merchantRequestId: stkResult.MerchantRequestID,
          documentTitle: document.title,
          amount: chargeAmount,
          status: 'pending',
          message: 'M-Pesa STK Push sent. Check your phone to complete payment.',
          isTestMode,
        });
      } catch (stkError) {
        console.error(`❌ STK Push failed for ${checkoutId}:`, stkError);

        // Mark purchase as failed
        await db.purchase.update({
          where: { id: purchase.id },
          data: { status: 'failed' },
        });

        results.push({
          purchaseId: purchase.id,
          checkoutId,
          documentTitle: document.title,
          amount: chargeAmount,
          status: 'failed',
          error: stkError instanceof Error ? stkError.message : 'M-Pesa payment initiation failed',
          isTestMode,
        });
      }
    }

    // Check if all items failed
    const allFailed = results.every((r) => r.status === 'failed');
    const anySuccess = results.some((r) => r.status === 'pending');

    if (allFailed) {
      return NextResponse.json({
        success: false,
        error: 'M-Pesa payment could not be initiated. Please try again.',
        purchases: results,
      }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      message: 'M-Pesa STK Push sent. Please check your phone and enter your PIN to complete payment.',
      purchases: results,
    });
  } catch (error) {
    console.error('❌ Checkout error:', error);
    return NextResponse.json(
      { error: 'Checkout failed. Please try again.' },
      { status: 500 }
    );
  }
}
