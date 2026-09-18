import { NextResponse } from 'next/server';
import { verifyOtpCode, normalizeEmail } from '@/lib/services/otpStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp || typeof otp !== 'string') {
      return NextResponse.json(
        { success: false, verified: false, message: 'Email and 4-digit verification code are required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = normalizeEmail(email);
    const cleanOtp = otp.trim();

    if (cleanOtp.length !== 4 || !/^\d{4}$/.test(cleanOtp)) {
      return NextResponse.json(
        { success: false, verified: false, message: 'Invalid verification code format. Code must be 4 digits.' },
        { status: 400 }
      );
    }

    const verifyResult = verifyOtpCode(normalizedEmail, cleanOtp);

    if (!verifyResult.success) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          message: verifyResult.message || 'Invalid or expired verification code',
          remainingAttempts: verifyResult.remainingAttempts,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      message: 'Email successfully verified.',
    });
  } catch (error: any) {
    console.error('Error in verify-otp API:', error);
    return NextResponse.json(
      { success: false, verified: false, message: 'Server error verifying OTP code.' },
      { status: 500 }
    );
  }
}
