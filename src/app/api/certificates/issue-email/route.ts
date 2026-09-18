import { NextResponse } from 'next/server';
import { sendCertificateEmail } from '@/lib/services/emailService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, certificateType, certificateId, issueDate, verificationUrl } = body;

    if (!name || !email || !certificateType || !certificateId) {
      return NextResponse.json(
        { success: false, error: 'Name, email, certificateType, and certificateId are required.' },
        { status: 400 }
      );
    }

    const res = await sendCertificateEmail({
      name,
      email,
      certificateType,
      certificateId,
      issueDate,
      verificationUrl,
    });

    return NextResponse.json(res);
  } catch (err: any) {
    console.error('Error sending certificate email:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to dispatch certificate email.' },
      { status: 500 }
    );
  }
}
