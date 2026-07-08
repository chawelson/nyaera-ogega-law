import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { generateDownloadToken, getTokenExpiry, createDownloadUrl } from '@/lib/download-token';
import { sendPurchaseReceipt, sendAdminOrderNotification } from '@/lib/email';
import { initiateStkPush, getMpesaCallbackUrl } from '@/lib/mpesa';

/**
 * POST /api/checkout
 * Processes a checkout with guest info (email + phone), creates purchase record,
 * initiates M-Pesa STK Push, and returns the checkout request ID for polling.
 *
 * After successful payment, sends:
 *   1. Receipt email to the buyer with download link
 *   2. Order notification email to the firm's admin
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, email, phone, name, instructions } = body;

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

      // ── M-Pesa flow ───────────────────────────────────────────────
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
          clientInstructions: instructions || null,
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
