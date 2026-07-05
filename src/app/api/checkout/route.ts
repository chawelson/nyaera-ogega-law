import crypto from 'crypto';
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
 * Test mode (?test=true):
 *   - Completely bypasses M-Pesa — no STK Push, no webhook
 *   - Creates purchase records directly as 'completed'
 *   - Sends receipt email immediately with download link
 *   - Uses MPESA_TEST_AMOUNT env var (defaults to 1) for the amount
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

    const rawTestAmount = process.env.MPESA_TEST_AMOUNT;
    const testAmount = parseInt(rawTestAmount || '1', 10);

    if (isTestMode) {
      console.log(`🧪 TEST MODE: Bypassing M-Pesa entirely`);
      console.log(`🧪 TEST MODE: MPESA_TEST_AMOUNT env var = "${rawTestAmount}" (raw), parsed = ${testAmount}`);
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

      // ── TEST MODE: Bypass M-Pesa entirely ────────────────────────────
      if (isTestMode) {
        const testCheckoutId = `TEST-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        const testDownloadToken = crypto.randomBytes(32).toString('hex');
        const testTokenExpiry = new Date(Date.now() + 48 * 60 * 60 * 1000);

        // Create purchase directly as 'completed'
        const purchase = await db.purchase.create({
          data: {
            documentId: document.id,
            userEmail: email,
            userPhone: phone,
            amount: testAmount,
            checkoutId: testCheckoutId,
            status: 'completed',
            downloadToken: testDownloadToken,
            tokenExpiry: testTokenExpiry,
            tokenUsed: false,
            licenseAccepted: false,
          },
          include: {
            document: true,
          },
        });

        console.log(`🧪 TEST MODE: Purchase ${purchase.id} created as 'completed'`);

        // Send receipt email immediately
        const downloadUrl = createDownloadUrl(testDownloadToken);
        try {
          const emailSent = await sendPurchaseReceipt({
            to: email,
            buyerName,
            documentTitle: document.title,
            amount: testAmount,
            downloadUrl,
            transactionId: testCheckoutId,
          });
          console.log(`📧 Test receipt email ${emailSent ? 'sent' : 'FAILED'} to ${email} for ${document.title}`);
        } catch (emailErr) {
          console.error(`❌ Failed to send test receipt email for ${document.title}:`, emailErr);
        }

        results.push({
          purchaseId: purchase.id,
          checkoutId: testCheckoutId,
          documentTitle: document.title,
          amount: testAmount,
          status: 'completed',
          message: 'Test purchase completed! Your receipt and download link have been sent.',
          isTestMode: true,
        });

        continue; // Skip M-Pesa flow for this item
      }

      // ── NORMAL MODE: M-Pesa flow ────────────────────────────────────
      const checkoutId = `CHK-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      const downloadToken = generateDownloadToken();
      const tokenExpiry = getTokenExpiry();
      const chargeAmount = document.price;

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

      console.log(`📱 Sending STK Push:`, {
        phone: phone.slice(0, 6) + '*****',
        amount: chargeAmount,
        accountRef: checkoutId,
        documentTitle: document.title,
      });

      try {
        const stkResult = await initiateStkPush({
          phoneNumber: phone,
          amount: chargeAmount,
          accountReference: checkoutId,
          transactionDesc: document.title,
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
          isTestMode: false,
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
          isTestMode: false,
        });
      }
    }

    // Check if all items failed
    const allFailed = results.every((r) => r.status === 'failed');
    const anySuccess = results.some((r) => r.status === 'pending' || r.status === 'completed');

    if (allFailed) {
      return NextResponse.json({
        success: false,
        error: 'Payment could not be processed. Please try again.',
        purchases: results,
      }, { status: 502 });
    }

    const successMessage = isTestMode
      ? 'Test purchase completed! Your receipt and download link have been sent to your email.'
      : 'M-Pesa STK Push sent. Please check your phone and enter your PIN to complete payment.';

    return NextResponse.json({
      success: true,
      message: successMessage,
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
