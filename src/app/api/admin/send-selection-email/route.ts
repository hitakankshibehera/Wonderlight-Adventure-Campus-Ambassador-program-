import { NextResponse } from 'next/server';
import { sendSelectionEmail } from '@/lib/services/emailService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, college, ambassadorId, batch } = body;

    if (!email || !name) {
      return NextResponse.json(
        { success: false, error: 'Student name and email are required.' },
        { status: 400 }
      );
    }

    const res = await sendSelectionEmail({ name, email, college: college || 'University', ambassadorId, batch });
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to send selection notification.' },
      { status: 500 }
    );
  }
}
