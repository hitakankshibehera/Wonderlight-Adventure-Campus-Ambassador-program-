import { NextResponse } from 'next/server';
import { sendRewardEmail } from '@/lib/services/emailService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ambassadorName, ambassadorEmail, rewardTitle, xp, reason, claimInstructions } = body;

    if (!ambassadorName || !ambassadorEmail || !rewardTitle) {
      return NextResponse.json(
        { success: false, error: 'Ambassador name, email, and rewardTitle are required.' },
        { status: 400 }
      );
    }

    const res = await sendRewardEmail({
      ambassadorName,
      ambassadorEmail,
      rewardTitle,
      xp,
      reason,
      claimInstructions,
    });

    return NextResponse.json(res);
  } catch (err: any) {
    console.error('Error sending reward email:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to dispatch reward email.' },
      { status: 500 }
    );
  }
}
