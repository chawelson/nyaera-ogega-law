import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { createSamplePreview, createPlaceholderPreview } from '@/lib/pdf-watermark';

/**
 * GET /api/preview/[slug]
 * Returns a sample preview PDF (first 2 pages with SAMPLE watermark).
 * Falls back to a placeholder PDF with 'SAMPLE — PREVIEW ONLY' watermark
 * if the document doesn't have a specific PDF file.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    console.log('🔍 [PREVIEW] Generating preview for slug:', slug);

    const db = getDb();
    const document = await db.document.findUnique({
      where: { slug },
    });

    if (!document) {
      console.log('❌ [PREVIEW] Document not found for slug:', slug);
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    console.log('✅ [PREVIEW] Document found:', {
      title: document.title,
      filePath: document.filePath,
    });

    let samplePdf: Uint8Array;

    try {
      // Try to create sample preview from the document's PDF file
      console.log('🔍 [PREVIEW] Calling createSamplePreview with path:', document.filePath);
      samplePdf = await createSamplePreview(document.filePath);
      console.log('✅ [PREVIEW] Sample PDF generated, size:', samplePdf.length, 'bytes');
    } catch (err) {
      // If the specific PDF doesn't exist, use the placeholder with watermark
      console.log('⚠️ [PREVIEW] Specific PDF not found, using placeholder:', err);
      samplePdf = await createPlaceholderPreview();
      console.log('✅ [PREVIEW] Placeholder preview generated, size:', samplePdf.length, 'bytes');
    }

    const fileName = document.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-sample.pdf';

    return new NextResponse(Buffer.from(samplePdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${fileName}"`,
        'Content-Length': samplePdf.length.toString(),
      },
    });
  } catch (error) {
    console.error('❌ [PREVIEW] Error generating preview:', error);
    // Return a simple error PDF instead of JSON so the iframe shows something
    const errorHtml = `<html><body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;background:#f8f9fa;color:#666;"><div style="text-align:center"><h2>Preview Unavailable</h2><p style="color:#999">${error instanceof Error ? error.message : 'Failed to generate preview'}</p></div></body></html>`;
    return new NextResponse(errorHtml, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
}
