import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

/**
 * GET /api/admin/orders
 * Returns all purchases with their document info for the admin panel.
 * No auth for now — protected by the client-side password gate.
 */
export async function GET() {
  try {
    const db = getDb();

    const purchases = await db.purchase.findMany({
      include: {
        document: {
          select: {
            title: true,
            category: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ purchases });
  } catch (error) {
    console.error('❌ [Admin Orders] Failed to fetch:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
