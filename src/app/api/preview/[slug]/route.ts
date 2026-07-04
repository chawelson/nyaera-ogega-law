import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { createSamplePreview } from '@/lib/pdf-watermark';

/**
 * GET /api/preview/[slug]
 * Returns a sample preview PDF (first 2 pages with SAMPLE watermark).
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

    // Create sample preview (first 2 pages with SAMPLE watermark)
    console.log('🔍 [PREVIEW] Calling createSamplePreview with path:', document.filePath);
    const samplePdf = await createSamplePreview(document.filePath);
    console.log('✅ [PREVIEW] Sample PDF generated, size:', samplePdf.length, 'bytes');

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
