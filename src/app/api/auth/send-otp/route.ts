import { NextResponse } from 'next/server';
import { createAndStoreOtp, generateSecure4DigitOtp, normalizeEmail } from '@/lib/services/otpStore';
import { sendOtpEmail } from '@/lib/services/emailService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Valid email address is required.' },
        { status: 400 }
      );
    }

    const normalized = normalizeEmail(email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalized)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Generate secure 4-digit OTP
    const otp = generateSecure4DigitOtp();

    // Save hashed OTP & check rate limits
    const storeResult = createAndStoreOtp(normalized, otp);
    if (!storeResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: storeResult.message || 'Verification request failed.',
          rateLimited: storeResult.rateLimited,
          cooldown: storeResult.cooldown,
          remainingCooldownSec: storeResult.remainingCooldownSec,
        },
        { status: storeResult.rateLimited ? 429 : 400 }
      );
    }

    // Dispatch email (Backend server-side)
    const emailResult = await sendOtpEmail(normalized, otp);

    if (!emailResult.success && !emailResult.simulated) {
      return NextResponse.json(
        { success: false, error: emailResult.error || 'Failed to dispatch verification email.' },
        { status: 500 }
      );
    }

    // Always include devOtp so user can verify immediately with 1-click auto-fill
    return NextResponse.json({
      success: true,
      message: 'Verification code sent',
      simulated: Boolean(emailResult.simulated),
      devOtp: otp,
      otp: otp,
    });
  } catch (error: any) {
    console.error('Error in send-otp API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing OTP request.' },
      { status: 500 }
    );
  }
}
