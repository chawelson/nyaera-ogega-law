import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      // NOTE: Replace with your verified domain in Resend dashboard.
      // During testing you can use: onboarding@resend.dev
      from: 'Nyaera Ogega & Co. <noreply@nyaeraogegaadvocates.com>',
      to: ['info@nyaeraogegaadvocates.com'],
      replyTo: data.email,
      subject: `New Inquiry: ${data.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8" /></head>
          <body style="font-family: Arial, sans-serif; color: #111827; max-width: 600px; margin: 0 auto; padding: 24px;">
            <div style="background: #2e3192; padding: 24px; border-radius: 8px 8px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 20px;">New Contact Form Inquiry</h1>
              <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 14px;">Nyaera Ogega & Co. Advocates</p>
            </div>
            <div style="background: #f6f7ff; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; width: 130px;">Full Name</td>
                  <td style="padding: 10px 0; color: #111827; font-size: 15px; font-weight: 600;">${data.name}</td>
                </tr>
                <tr style="border-top: 1px solid #e2e8f0;">
                  <td style="padding: 10px 0; color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">Email</td>
                  <td style="padding: 10px 0; color: #2e3192; font-size: 15px;"><a href="mailto:${data.email}" style="color: #2e3192;">${data.email}</a></td>
                </tr>
                <tr style="border-top: 1px solid #e2e8f0;">
                  <td style="padding: 10px 0; color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">Phone</td>
                  <td style="padding: 10px 0; color: #111827; font-size: 15px;">${data.phone || 'Not provided'}</td>
                </tr>
                <tr style="border-top: 1px solid #e2e8f0;">
                  <td style="padding: 10px 0; color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">Subject</td>
                  <td style="padding: 10px 0;">
                    <span style="background: #2e3192; color: white; font-size: 12px; font-weight: bold; padding: 4px 12px; border-radius: 999px;">${data.subject}</span>
                  </td>
                </tr>
              </table>
              <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
                <p style="color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 12px;">Message</p>
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; color: #374151; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${data.message}</div>
              </div>
              <div style="margin-top: 24px; padding: 16px; background: #ab812b20; border-left: 4px solid #ab812b; border-radius: 4px;">
                <p style="margin: 0; color: #92620f; font-size: 13px;">Reply directly to this email to respond to <strong>${data.name}</strong>.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: err.issues },
        { status: 400 }
      );
    }
    console.error('Contact route error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
