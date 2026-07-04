import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { generateDownloadToken, getTokenExpiry, createDownloadUrl } from '@/lib/download-token';
import { sendPurchaseReceipt } from '@/lib/email';

/**
 * POST /api/checkout
 * Processes a checkout with guest info (email + phone), creates purchase record,
 * generates download token, and sends receipt email.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, email, phone, name } = body;

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

      // Generate checkout ID
      const checkoutId = `CHK-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

      // Generate download token with 48hr expiry
      const downloadToken = generateDownloadToken();
      const tokenExpiry = getTokenExpiry();

      // Create purchase record
      const purchase = await db.purchase.create({
        data: {
          documentId: document.id,
          userEmail: email,
          userPhone: phone,
          amount: document.price,
          checkoutId,
          status: 'completed',
          downloadToken,
          tokenExpiry,
          tokenUsed: false,
          licenseAccepted: false,
        },
        include: {
          document: true,
        },
      });

      // Create download URL
      const downloadUrl = createDownloadUrl(downloadToken);

      // Send receipt email
      await sendPurchaseReceipt({
        to: email,
        buyerName,
        documentTitle: document.title,
        amount: document.price,
        downloadUrl,
        transactionId: checkoutId,
      });

      results.push({
        purchaseId: purchase.id,
        checkoutId,
        documentTitle: document.title,
        downloadUrl,
        tokenExpiry: tokenExpiry.toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Purchase completed successfully',
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
