import { NextResponse } from 'next/server';
import { sendTestEmail } from '@/lib/services/emailService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { toEmail } = body;

    if (!toEmail || typeof toEmail !== 'string' || !toEmail.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid recipient email address is required.' },
        { status: 400 }
      );
    }

    const res = await sendTestEmail(toEmail.trim().toLowerCase());
    return NextResponse.json(res);
  } catch (err: any) {
    console.error('Error in send-test-email API:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to dispatch test email.' },
      { status: 500 }
    );
  }
}
