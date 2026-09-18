import { NextResponse } from 'next/server';
import { sendMissionEmail } from '@/lib/services/emailService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ambassadorName, ambassadorEmail, missionTitle, description, xp, deadline, instructions } = body;

    if (!ambassadorName || !ambassadorEmail || !missionTitle || !description || xp === undefined) {
      return NextResponse.json(
        { success: false, error: 'Ambassador name, email, missionTitle, description, and xp are required.' },
        { status: 400 }
      );
    }

    const res = await sendMissionEmail({
      ambassadorName,
      ambassadorEmail,
      missionTitle,
      description,
      xp,
      deadline,
      instructions,
    });

    return NextResponse.json(res);
  } catch (err: any) {
    console.error('Error sending mission email:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to dispatch mission email.' },
      { status: 500 }
    );
  }
}
