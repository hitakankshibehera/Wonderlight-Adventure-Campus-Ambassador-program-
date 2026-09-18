import { NextResponse } from 'next/server';
import { sendApplicationReceivedEmail } from '@/lib/services/emailService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, applicationId } = body;

    if (!name || !email || !applicationId) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and applicationId are required.' },
        { status: 400 }
      );
    }

    const res = await sendApplicationReceivedEmail({ name, email, applicationId });

    return NextResponse.json({
      success: true,
      simulated: Boolean(res.simulated),
      message: 'Application received email dispatched successfully.',
    });
  } catch (error: any) {
    console.error('Error sending application email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send application email.' },
      { status: 500 }
    );
  }
}
