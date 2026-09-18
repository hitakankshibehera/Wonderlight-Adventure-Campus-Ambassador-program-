import { NextResponse } from 'next/server';
import { sendEventRegistrationEmail } from '@/lib/services/emailService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentName, studentEmail, eventName, date, time, venue, registrationId, college } = body;

    if (!studentName || !studentEmail || !eventName || !date) {
      return NextResponse.json(
        { success: false, error: 'Student name, email, eventName, and date are required.' },
        { status: 400 }
      );
    }

    const res = await sendEventRegistrationEmail({
      studentName,
      studentEmail,
      eventName,
      date,
      time,
      venue,
      registrationId,
      college,
    });

    return NextResponse.json(res);
  } catch (err: any) {
    console.error('Error sending event registration email:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to dispatch event registration email.' },
      { status: 500 }
    );
  }
}
