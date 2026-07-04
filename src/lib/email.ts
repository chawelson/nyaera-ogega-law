import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface PurchaseReceiptParams {
  to: string;
  buyerName: string;
  documentTitle: string;
  amount: number;
  downloadUrl: string;
  transactionId: string;
}

/**
 * Sends a purchase confirmation email with download link using Resend API.
 */
export async function sendPurchaseReceipt(params: PurchaseReceiptParams): Promise<boolean> {
  const { to, buyerName, documentTitle, amount, downloadUrl, transactionId } = params;

  try {
    await resend.emails.send({
      from: 'Nyaera Ogega & Co. Advocates <orders@nyaeraogegaadvocates.com>',
      to,
      subject: `Your Purchase Receipt — ${documentTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background: #f6f7ff; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .card { background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #2e3192; }
            .gold { color: #ab812b; }
            .check { display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; background: #d1fae5; border-radius: 50%; margin-bottom: 16px; }
            h1 { font-size: 22px; color: #090d3f; margin: 0 0 8px; }
            .subtitle { color: #6b7280; font-size: 14px; margin: 0 0 24px; }
            .details { background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
            .detail-row:last-child { border-bottom: none; }
            .detail-label { color: #6b7280; }
            .detail-value { color: #090d3f; font-weight: 600; }
            .download-btn { display: block; background: #2e3192; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: bold; text-align: center; margin: 24px 0; }
            .download-btn:hover { background: #ab812b; }
            .note { font-size: 12px; color: #9ca3af; text-align: center; margin-top: 16px; }
            .footer { text-align: center; margin-top: 24px; font-size: 12px; color: #9ca3af; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="header">
                <div class="check">&#10003;</div>
                <h1>Payment Confirmed!</h1>
                <p class="subtitle">Thank you for your purchase, ${buyerName}.</p>
              </div>

              <div class="details">
                <div class="detail-row">
                  <span class="detail-label">Document</span>
                  <span class="detail-value">${documentTitle}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Amount Paid</span>
                  <span class="detail-value">KES ${amount.toLocaleString('en-KE')}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Transaction ID</span>
                  <span class="detail-value">${transactionId}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date</span>
                  <span class="detail-value">${new Date().toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              <a href="${downloadUrl}" class="download-btn">Download Your Document</a>

              <p class="note">
                This download link will expire in 48 hours and can only be used once.
                Please download your document promptly.
              </p>

              <div class="footer">
                <p>Nyaera Ogega & Co. Advocates</p>
                <p>Shelter Afrique Building, Mamlaka Road, 3rd Floor, Room 4, Nairobi</p>
                <p>info@nyaeraogegaadvocates.com | +254 791 646 341</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log('✅ Purchase receipt email sent to:', to);
    return true;
  } catch (error) {
    console.error('❌ Failed to send purchase receipt email:', error);
    return false;
  }
}
