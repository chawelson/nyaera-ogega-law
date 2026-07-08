import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { uploadDraftDocumentBuffer } from '@/lib/supabase';

/**
 * POST /api/admin/upload-document
 * Uploads a draft document PDF to Supabase Storage and updates the purchase record.
 *
 * Expects multipart/form-data with:
 *   - file: the PDF file
 *   - purchaseId: the purchase ID
 *   - checkoutId: the checkout/order ID
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const purchaseId = formData.get('purchaseId') as string | null;
    const checkoutId = formData.get('checkoutId') as string | null;

    if (!file || !purchaseId || !checkoutId) {
      return NextResponse.json(
        { error: 'Missing required fields: file, purchaseId, checkoutId' },
        { status: 400 }
      );
    }

    if (!file.name.endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 50MB limit' },
        { status: 400 }
      );
    }

    console.log('☁️ [Admin Upload] Uploading to Supabase:', {
      purchaseId,
      checkoutId,
      fileName: file.name,
      fileSize: file.size,
    });

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const supabasePath = `${checkoutId}/${file.name}`;
    const { data, error } = await uploadDraftDocumentBuffer(
      checkoutId,
      file.name,
      buffer,
      'application/pdf'
    );

    if (error) {
      console.error('❌ [Admin Upload] Supabase upload failed:', error);
      return NextResponse.json(
        { error: `Supabase upload failed: ${error.message}` },
        { status: 500 }
      );
    }

    console.log('✅ [Admin Upload] Uploaded to Supabase:', supabasePath);

    // ── Update ONLY the specific purchase record ────────────────────
    // Verify the checkoutId matches to ensure we're updating the right order
    const db = getDb();
    const purchase = await db.purchase.findUnique({
      where: { id: parseInt(purchaseId, 10) },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: 'Purchase record not found' },
        { status: 404 }
      );
    }

    if (purchase.checkoutId !== checkoutId) {
      console.error('❌ [Admin Upload] Checkout ID mismatch:', {
        expected: purchase.checkoutId,
        received: checkoutId,
      });
      return NextResponse.json(
        { error: 'Checkout ID mismatch. Cannot update this order.' },
        { status: 400 }
      );
    }

    // Only update this specific purchase — no other orders are affected
    await db.purchase.update({
      where: { id: parseInt(purchaseId, 10) },
      data: {
        uploadedFilePath: supabasePath,
        documentStatus: 'completed',
      },
    });

    console.log('✅ [Admin Upload] Purchase updated:', purchaseId);

    return NextResponse.json({
      success: true,
      path: supabasePath,
      message: 'Document uploaded successfully',
    });
  } catch (error) {
    console.error('❌ [Admin Upload] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
