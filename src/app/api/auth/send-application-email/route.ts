import { NextResponse } from 'next/server';
import { sendApplicationConfirmationEmail } from '@/lib/services/emailService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, applicationId, college, batch, date, status } = body;

    if (!name || !email || !applicationId) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and applicationId are required.' },
        { status: 400 }
      );
    }

    const res = await sendApplicationConfirmationEmail({
      name,
      email,
      applicationId,
      college: college || 'University',
      batch,
      date,
      status,
    });

    return NextResponse.json(res);
  } catch (error: any) {
    console.error('Error sending application confirmation email:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to send application confirmation email.' },
      { status: 500 }
    );
  }
}
