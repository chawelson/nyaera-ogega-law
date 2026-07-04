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

    const db = getDb();
    const document = await db.document.findUnique({
      where: { slug },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Create sample preview (first 2 pages with SAMPLE watermark)
    const samplePdf = await createSamplePreview(document.filePath);

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
    console.error('❌ Preview error:', error);
    return NextResponse.json(
      { error: 'Failed to generate preview' },
      { status: 500 }
    );
  }
}
