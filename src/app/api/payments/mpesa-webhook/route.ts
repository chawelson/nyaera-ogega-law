/**
 * M-Pesa STK Push Callback Webhook
 * 
 * Receives payment confirmation from Safaricom after user enters M-Pesa PIN.
 * Updates purchase status and sends receipt email with download link.
 * 
 * This endpoint must be publicly accessible. Use ngrok for local testing.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { sendPurchaseReceipt } from '@/lib/email';
import { createDownloadUrl } from '@/lib/download-token';

// ── M-Pesa Callback Body Types ──────────────────────────────────────
interface MpesaCallbackItem {
  Name: string;
  Value?: string | number;
}

interface MpesaCallbackMetadata {
  Item: MpesaCallbackItem[];
}

interface MpesaStkCallback {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode: number;
  ResultDesc: string;
  CallbackMetadata?: MpesaCallbackMetadata;
}

interface MpesaCallbackBody {
  stkCallback: MpesaStkCallback;
}

/**
 * POST /api/payments/mpesa-webhook
 * Receives M-Pesa STK Push callback and processes the payment result.
 */
export async function POST(request: NextRequest) {
  try {
    // Safaricom sends the callback wrapped in a `Body` object
    const rawBody = await request.json();
    const body: MpesaCallbackBody = rawBody.Body;

    const { stkCallback } = body;
    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

    console.log(`📞 M-Pesa callback received:`, {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
    });

    // ── Find the purchase by CheckoutRequestID ─────────────────────
    const db = getDb();
    const purchase = await db.purchase.findFirst({
      where: { checkoutId: CheckoutRequestID },
      include: { document: true },
    });

    if (!purchase) {
      console.error(`❌ Purchase not found for CheckoutRequestID: ${CheckoutRequestID}`);
      // Still return success to Safaricom (they expect 200)
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    // ── Handle failed/cancelled payment ────────────────────────────
    if (ResultCode !== 0) {
      console.log(`❌ Payment failed for ${CheckoutRequestID}: ${ResultDesc}`);
      await db.purchase.update({
        where: { id: purchase.id },
        data: { status: 'failed' },
      });
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    // ── Extract payment details from callback metadata ─────────────
    const metadata = CallbackMetadata?.Item || [];
    const getValue = (name: string): string | undefined => {
      const item = metadata.find((m) => m.Name === name);
      return item?.Value?.toString();
    };

    const mpesaReceiptNumber = getValue('MpesaReceiptNumber');
    const transactionDate = getValue('TransactionDate');
    const phoneNumber = getValue('PhoneNumber');
    const amount = getValue('Amount');

    console.log(`✅ Payment successful:`, {
      mpesaReceiptNumber,
      transactionDate,
      phoneNumber,
      amount,
    });

    // ── Update purchase as completed ───────────────────────────────
    await db.purchase.update({
      where: { id: purchase.id },
      data: {
        status: 'completed',
        // Store M-Pesa receipt in checkoutId for reference (keep original as fallback)
        // We keep the original checkoutId but log the M-Pesa receipt
      },
    });

    // ── Log the successful payment ─────────────────────────────────
    console.log(`💰 Payment completed: ${purchase.document.title} - KES ${amount || purchase.amount}`);

    // ── Send receipt email with download link ──────────────────────
    if (purchase.userEmail) {
      const downloadUrl = createDownloadUrl(purchase.downloadToken!);
      const buyerName = purchase.userEmail.split('@')[0];

      try {
        await sendPurchaseReceipt({
          to: purchase.userEmail,
          buyerName,
          documentTitle: purchase.document.title,
          amount: purchase.amount,
          downloadUrl,
          transactionId: purchase.checkoutId,
        });
        console.log(`📧 Receipt sent to ${purchase.userEmail}`);
      } catch (emailErr) {
        console.error(`❌ Failed to send receipt email:`, emailErr);
        // Don't fail the webhook for email failure
      }
    }

    // ── Always return 200 to Safaricom ─────────────────────────────
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (error) {
    console.error('❌ M-Pesa webhook error:', error);
    // Safaricom expects 200 even on errors
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }
}
