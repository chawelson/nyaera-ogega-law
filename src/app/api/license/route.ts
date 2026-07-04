import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

/**
 * GET /api/license
 * Returns the current active license agreement.
 */
export async function GET() {
  try {
    const db = getDb();
    const license = await db.licenseAgreement.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!license) {
      // Return default license if none in DB
      return NextResponse.json({
        id: 0,
        version: '1.0',
        title: 'End User License Agreement',
        content: getDefaultLicenseContent(),
        isActive: true,
      });
    }

    return NextResponse.json(license);
  } catch (error) {
    console.error('❌ License fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch license agreement' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/license/accept
 * Accepts the license agreement for a given download token.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Download token is required' },
        { status: 400 }
      );
    }

    const db = getDb();

    // Find purchase by token
    const purchase = await db.purchase.findUnique({
      where: { downloadToken: token },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: 'Invalid download token' },
        { status: 404 }
      );
    }

    // Mark license as accepted
    await db.purchase.update({
      where: { id: purchase.id },
      data: { licenseAccepted: true },
    });

    // Return the download URL so the user can proceed
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const downloadUrl = `${baseUrl}/api/download/${token}`;

    return NextResponse.json({
      success: true,
      message: 'License accepted',
      downloadUrl,
    });
  } catch (error) {
    console.error('❌ License accept error:', error);
    return NextResponse.json(
      { error: 'Failed to accept license agreement' },
      { status: 500 }
    );
  }
}

function getDefaultLicenseContent(): string {
  return `NYAERA OGEGA & CO. ADVOCATES — END USER LICENSE AGREEMENT

Last Updated: July 2026

PLEASE READ THIS END USER LICENSE AGREEMENT ("AGREEMENT") CAREFULLY BEFORE DOWNLOADING OR USING ANY LEGAL DOCUMENT TEMPLATE PROVIDED BY NYAERA OGEGA & CO. ADVOCATES.

1. GRANT OF LICENSE
Subject to your compliance with this Agreement, Nyaera Ogega & Co. Advocates grants you a non-exclusive, non-transferable, limited license to download and use the legal document template for your personal or internal business purposes.

2. RESTRICTIONS
You may NOT:
(a) Resell, redistribute, or sublicense the document template;
(b) Modify the document and claim it as your own original work;
(c) Remove or alter any copyright notices or watermarks;
(d) Use the document for any unlawful purpose;
(e) Share the download link with third parties.

3. NO LEGAL ADVICE
The document templates provided are for informational and educational purposes only. They do not constitute legal advice. You should consult with a qualified attorney regarding your specific legal situation. Nyaera Ogega & Co. Advocates is not acting as your legal representative unless a separate engagement agreement has been signed.

4. DISCLAIMER OF WARRANTIES
THE DOCUMENT TEMPLATES ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.

5. LIMITATION OF LIABILITY
IN NO EVENT SHALL NYAERA OGEGA & CO. ADVOCATES BE LIABLE FOR ANY DAMAGES ARISING OUT OF OR IN CONNECTION WITH THE USE OR INABILITY TO USE THE DOCUMENT TEMPLATES, INCLUDING BUT NOT LIMITED TO DIRECT, INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES.

6. INTELLECTUAL PROPERTY
All document templates remain the intellectual property of Nyaera Ogega & Co. Advocates. This Agreement does not transfer any ownership rights to you.

7. TERMINATION
This license terminates automatically if you violate any of its terms. Upon termination, you must delete all copies of the document.

8. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of the Republic of Kenya.

By clicking "Accept" or downloading the document, you acknowledge that you have read, understood, and agree to be bound by this Agreement.`;
}
