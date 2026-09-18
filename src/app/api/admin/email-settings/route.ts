import { NextResponse } from 'next/server';
import { sendTestEmail } from '@/lib/services/emailService';

export async function GET() {
  const companyEmail = process.env.EMAIL_FROM || process.env.COMPANY_EMAIL || 'wonderlightadventure@gmail.com';
  const hasPass = Boolean(process.env.SMTP_PASSWORD || process.env.GMAIL_APP_PASSWORD);

  return NextResponse.json({
    success: true,
    senderName: process.env.EMAIL_FROM_NAME || 'Wonderlight Adventure',
    senderEmail: companyEmail,
    provider: 'Gmail / Authenticated SMTP',
    status: hasPass ? 'CONNECTED' : 'SIMULATED (DEV MODE)',
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: process.env.SMTP_PORT || '587',
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { testEmail } = body;

    if (!testEmail || !testEmail.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid test recipient email is required.' },
        { status: 400 }
      );
    }

    const res = await sendTestEmail(testEmail);
    return NextResponse.json(res, { status: res.success ? 200 : 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to trigger test email.' },
      { status: 400 }
    );
  }
}
