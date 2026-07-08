import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { isTokenExpired } from '@/lib/download-token';
import { addWatermarkToPdf } from '@/lib/pdf-watermark';
import { downloadFromSupabase } from '@/lib/supabase';
import path from 'path';
import fs from 'fs/promises';

/**
 * GET /api/download/[token]
 * Validates the download token, checks expiry and one-time use,
 * watermarks the PDF, logs the download, and returns the file.
 *
 * Supports two sources for the PDF:
 *   1. Supabase Storage — if purchase.uploadedFilePath is set
 *   2. Local filesystem  — falls back to purchase.document.filePath
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    console.log('🔍 [DOWNLOAD] Token received:', token);

    if (!token) {
      console.log('❌ [DOWNLOAD] No token provided');
      return NextResponse.json(
        { error: 'Download token is required' },
        { status: 400 }
      );
    }

    const db = getDb();

    // ── Find purchase by token ──────────────────────────────────────
    console.log('🔍 [DOWNLOAD] Looking up purchase for token:', token);
    const purchase = await db.purchase.findUnique({
      where: { downloadToken: token },
      include: { document: true },
    });

    if (!purchase) {
      console.log('❌ [DOWNLOAD] No purchase found for token:', token);
      // Try to list all tokens to debug
      const allTokens = await db.purchase.findMany({
        where: { downloadToken: { not: null } },
        select: { id: true, downloadToken: true, status: true },
        take: 10,
      });
      console.log('🔍 [DOWNLOAD] Available tokens in DB:', JSON.stringify(allTokens));
      return NextResponse.json(
        { error: 'Invalid download token' },
        { status: 404 }
      );
    }

    console.log('✅ [DOWNLOAD] Purchase found:', {
      id: purchase.id,
      documentTitle: purchase.document.title,
      filePath: purchase.document.filePath,
      uploadedFilePath: purchase.uploadedFilePath,
      status: purchase.status,
      tokenUsed: purchase.tokenUsed,
      tokenExpiry: purchase.tokenExpiry?.toISOString(),
      licenseAccepted: purchase.licenseAccepted,
    });

    // ── Check download count limit (max 3 downloads) ────────────────
    const maxDownloads = purchase.maxDownloads || 3;
    if (purchase.downloadCount >= maxDownloads) {
      return NextResponse.json(
        { error: 'Download limit reached. Please contact support.' },
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

    // ── Determine PDF source ────────────────────────────────────────
    // Priority: 1) Supabase (uploadedFilePath), 2) Local filesystem (filePath)
    let pdfBuffer: Buffer | undefined;

    if (purchase.uploadedFilePath) {
      // ── Fetch from Supabase Storage ───────────────────────────────
      console.log('☁️ [DOWNLOAD] Fetching from Supabase:', purchase.uploadedFilePath);
      const blob = await downloadFromSupabase(purchase.uploadedFilePath);

      if (!blob) {
        console.error('❌ [DOWNLOAD] Failed to fetch from Supabase, falling back to local');
        // Fall through to local filesystem
      } else {
        const arrayBuffer = await blob.arrayBuffer();
        pdfBuffer = Buffer.from(arrayBuffer);
        console.log('✅ [DOWNLOAD] Fetched from Supabase, size:', pdfBuffer.length, 'bytes');
      }
    }

    // ── Fallback: read from local filesystem ────────────────────────
    if (!pdfBuffer) {
      const fullPath = path.join(process.cwd(), 'public', purchase.document.filePath);
      console.log('📁 [DOWNLOAD] Reading from local filesystem:', fullPath);
      pdfBuffer = await fs.readFile(fullPath);
      console.log('✅ [DOWNLOAD] Read from local filesystem, size:', pdfBuffer.length, 'bytes');
    }

    // ── Add watermark to PDF ────────────────────────────────────────
    const watermarkInfo = {
      buyerName: purchase.buyerName || purchase.userEmail?.split('@')[0] || 'Valued Client',
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

    const watermarkedPdf = await addWatermarkToPdfBuffer(
      pdfBuffer,
      watermarkInfo
    );

    // ── Increment download count ────────────────────────────────────
    await db.purchase.update({
      where: { id: purchase.id },
      data: {
        downloadCount: { increment: 1 },
        tokenUsed: true,
      },
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

/**
 * Adds a watermark to a PDF buffer (instead of reading from a file path).
 * This is used when the PDF comes from Supabase Storage.
 */
async function addWatermarkToPdfBuffer(
  pdfBuffer: Buffer,
  watermark: { buyerName: string; buyerEmail: string; date: string; transactionId: string }
): Promise<Uint8Array> {
  const { PDFDocument, rgb, StandardFonts, degrees } = await import('pdf-lib');

  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pages = pdfDoc.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();

    // ── Diagonal watermark text ──
    const watermarkText = `PURCHASED BY: ${watermark.buyerName} | ${watermark.buyerEmail} | ${watermark.date}`;
    const fontSize = 10;
    const spacing = 120;
    const angle = Math.atan2(height, width);

    for (let i = -5; i < 10; i++) {
      const offset = i * spacing;
      const x = offset * Math.cos(angle);
      const y = offset * Math.sin(angle);

      page.drawText(watermarkText, {
        x: x + 50,
        y: y + 50,
        size: fontSize,
        font,
        color: rgb(0.5, 0.5, 0.5),
        opacity: 0.3,
        rotate: degrees(25),
      });
    }

    // ── Header watermark ──
    page.drawText('PURCHASED DOCUMENT', {
      x: 50,
      y: height - 40,
      size: 12,
      font: fontBold,
      color: rgb(0.7, 0.2, 0.2),
      opacity: 0.6,
    });

    // ── Footer with buyer info ──
    const footerY = 30;
    page.drawText(`Purchased by: ${watermark.buyerName}`, {
      x: 50,
      y: footerY,
      size: 8,
      font,
      color: rgb(0.3, 0.3, 0.3),
      opacity: 0.7,
    });
    page.drawText(`Email: ${watermark.buyerEmail}`, {
      x: 50,
      y: footerY - 12,
      size: 8,
      font,
      color: rgb(0.3, 0.3, 0.3),
      opacity: 0.7,
    });
    page.drawText(`Date: ${watermark.date}`, {
      x: 50,
      y: footerY - 24,
      size: 8,
      font,
      color: rgb(0.3, 0.3, 0.3),
      opacity: 0.7,
    });

    // Transaction ID on the right side of footer
    const txnText = `TXN: ${watermark.transactionId}`;
    const txnWidth = font.widthOfTextAtSize(txnText, 8);
    page.drawText(txnText, {
      x: width - txnWidth - 50,
      y: footerY,
      size: 8,
      font,
      color: rgb(0.3, 0.3, 0.3),
      opacity: 0.7,
    });
  }

  return await pdfDoc.save();
}
