import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { isTokenExpired } from '@/lib/download-token';
import { addWatermarkToPdf } from '@/lib/pdf-watermark';

/**
 * GET /api/download/[token]
 * Validates the download token, checks expiry and one-time use,
 * watermarks the PDF, logs the download, and returns the file.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json(
        { error: 'Download token is required' },
        { status: 400 }
      );
    }

    const db = getDb();

    // ── Find purchase by token ──────────────────────────────────────
    const purchase = await db.purchase.findUnique({
      where: { downloadToken: token },
      include: { document: true },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: 'Invalid download token' },
        { status: 404 }
      );
    }

    // ── Check if token has been used (one-time use) ─────────────────
    if (purchase.tokenUsed) {
      return NextResponse.json(
        { error: 'This download link has already been used. Each link can only be used once.' },
        { status: 410 }
      );
    }

    // ── Check if token has expired (48 hours) ───────────────────────
    if (purchase.tokenExpiry && isTokenExpired(purchase.tokenExpiry)) {
      return NextResponse.json(
        { error: 'This download link has expired. Links are valid for 48 hours only.' },
        { status: 410 }
      );
    }

    // ── Check if license has been accepted ──────────────────────────
    if (!purchase.licenseAccepted) {
      // Redirect to license acceptance page
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      return NextResponse.redirect(
        new URL(`/license?token=${token}`, baseUrl)
      );
    }

    // ── Get IP and user agent for logging ───────────────────────────
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // ── Add watermark to PDF ────────────────────────────────────────
    const watermarkInfo = {
      buyerName: purchase.userEmail?.split('@')[0] || 'Valued Client',
      buyerEmail: purchase.userEmail || 'N/A',
      date: new Date().toLocaleDateString('en-KE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      transactionId: purchase.checkoutId,
    };

    const watermarkedPdf = await addWatermarkToPdf(
      purchase.document.filePath,
      watermarkInfo
    );

    // ── Mark token as used ──────────────────────────────────────────
    await db.purchase.update({
      where: { id: purchase.id },
      data: { tokenUsed: true },
    });

    // ── Log the download ────────────────────────────────────────────
    await db.downloadLog.create({
      data: {
        purchaseId: purchase.id,
        ipAddress,
        userAgent,
        userEmail: purchase.userEmail,
      },
    });

    console.log('✅ Download logged:', {
      purchaseId: purchase.id,
      document: purchase.document.title,
      email: purchase.userEmail,
      ip: ipAddress,
    });

    // ── Return the watermarked PDF ──────────────────────────────────
    const fileName = purchase.document.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '.pdf';

    return new NextResponse(Buffer.from(watermarkedPdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': watermarkedPdf.length.toString(),
      },
    });
  } catch (error) {
    console.error('❌ Download error:', error);
    return NextResponse.json(
      { error: 'Download failed. Please try again.' },
      { status: 500 }
    );
  }
}
