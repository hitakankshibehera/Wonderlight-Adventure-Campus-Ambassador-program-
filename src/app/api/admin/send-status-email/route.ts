import { NextResponse } from 'next/server';
import { sendStatusEmail } from '@/lib/services/emailService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      status,
      name,
      email,
      applicationId,
      college,
      batch,
      ambassadorId,
      nextStep,
      interviewDate,
      interviewTime,
      interviewMode,
      interviewLink,
      instructions,
    } = body;

    if (!email || !name || !applicationId || !status) {
      return NextResponse.json(
        { success: false, error: 'Status, name, email, and applicationId are required.' },
        { status: 400 }
      );
    }

    const res = await sendStatusEmail({
      status,
      name,
      email,
      applicationId,
      college,
      batch,
      ambassadorId,
      nextStep,
      interviewDate,
      interviewTime,
      interviewMode,
      interviewLink,
      instructions,
    });

    return NextResponse.json(res);
  } catch (err: any) {
    console.error('Error in send-status-email route:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to dispatch status update email.' },
      { status: 500 }
    );
  }
}
