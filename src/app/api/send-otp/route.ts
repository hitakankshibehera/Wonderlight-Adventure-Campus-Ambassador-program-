import { NextResponse } from 'next/server';
import { createAndStoreOtp, generateSecure4DigitOtp, normalizeEmail } from '@/lib/services/otpStore';
import { sendOtpEmail } from '@/lib/services/emailService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp: providedOtp } = body;

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

    // Generate or use provided OTP code
    const otp = providedOtp || generateSecure4DigitOtp();

    // Store OTP securely
    const storeResult = createAndStoreOtp(normalized, otp);
    if (!storeResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: storeResult.message || 'Verification request failed.',
          rateLimited: storeResult.rateLimited,
          cooldown: storeResult.cooldown,
        },
        { status: storeResult.rateLimited ? 429 : 400 }
      );
    }

    // Dispatch real email via Nodemailer
    const emailResult = await sendOtpEmail(normalized, otp);

    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, error: emailResult.error || 'Failed to dispatch verification email to candidate.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Verification code successfully sent to ${normalized}.`,
      messageId: emailResult.messageId,
    });
  } catch (error: any) {
    console.error('Error in send-otp API:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error processing OTP request.' },
      { status: 500 }
    );
  }
}
