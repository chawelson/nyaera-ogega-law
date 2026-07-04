import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

/**
 * GET /api/purchases/[email]
 * Returns all purchases for a given email address.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const { email } = await params;
    const decodedEmail = decodeURIComponent(email);

    if (!decodedEmail) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const db = getDb();
    const purchases = await db.purchase.findMany({
      where: { userEmail: decodedEmail },
      include: {
        document: {
          select: {
            title: true,
            slug: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = purchases.map((p) => ({
      id: p.id,
      documentId: p.documentId,
      title: p.document.title,
      slug: p.document.slug,
      category: p.document.category,
      price: p.amount,
      date: p.createdAt.toISOString(),
      status: p.status === 'completed' ? 'Completed' : p.status === 'pending' ? 'Pending' : 'Failed',
      phone: p.userPhone,
      email: p.userEmail,
      transactionId: p.checkoutId,
      downloadToken: p.downloadToken,
      tokenExpiry: p.tokenExpiry?.toISOString() || null,
      tokenUsed: p.tokenUsed,
      licenseAccepted: p.licenseAccepted,
    }));

    return NextResponse.json({ purchases: formatted });
  } catch (error) {
    console.error('❌ Purchases fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch purchases' },
      { status: 500 }
    );
  }
}
