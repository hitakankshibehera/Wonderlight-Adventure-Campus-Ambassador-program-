import { NextResponse } from 'next/server';
import { sendEventReminderEmail } from '@/lib/services/emailService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentName, studentEmail, eventName, date, time, venue, registrationId, instructions } = body;

    if (!studentName || !studentEmail || !eventName || !date) {
      return NextResponse.json(
        { success: false, error: 'Student name, email, eventName, and date are required.' },
        { status: 400 }
      );
    }

    const res = await sendEventReminderEmail({
      studentName,
      studentEmail,
      eventName,
      date,
      time,
      venue,
      registrationId,
      instructions,
    });

    return NextResponse.json(res);
  } catch (err: any) {
    console.error('Error sending event reminder email:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to dispatch event reminder email.' },
      { status: 500 }
    );
  }
}
