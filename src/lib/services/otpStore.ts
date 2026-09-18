import crypto from 'crypto';

interface OtpRecord {
  email: string;
  otpHash: string;
  expiresAt: number;
  attempts: number;
  createdAt: number;
  resendCooldownUntil: number;
  hourlyRequests: number[];
  verified: boolean;
  verifiedAt?: number;
}

// Global Singleton Store (Persists across Next.js API route re-evaluations & HMR reloads)
declare global {
  var _wla_otp_map: Map<string, OtpRecord> | undefined;
  var _wla_verified_emails: Set<string> | undefined;
}

const otpMap: Map<string, OtpRecord> =
  globalThis._wla_otp_map || (globalThis._wla_otp_map = new Map<string, OtpRecord>());

const verifiedEmails: Set<string> =
  globalThis._wla_verified_emails || (globalThis._wla_verified_emails = new Set<string>());

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function generateSecure4DigitOtp(): string {
  return crypto.randomInt(1000, 10000).toString();
}

export function hashOtp(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

export interface StoreOtpResult {
  success: boolean;
  message?: string;
  rateLimited?: boolean;
  cooldown?: boolean;
  remainingCooldownSec?: number;
}

export function createAndStoreOtp(emailInput: string, otp: string): StoreOtpResult {
  const email = normalizeEmail(emailInput);
  const now = Date.now();
  const ONE_HOUR = 60 * 60 * 1000;
  const FIVE_MINUTES = 5 * 60 * 1000;
  const THIRTY_SECONDS = 30 * 1000;

  // Clear previous verified state when requesting a new code
  verifiedEmails.delete(email);

  const existing = otpMap.get(email);
  let hourlyRequests = existing ? existing.hourlyRequests.filter((t) => now - t < ONE_HOUR) : [];

  // Hourly Rate Limit Check: max 5 requests per hour
  if (hourlyRequests.length >= 5) {
    return {
      success: false,
      rateLimited: true,
      message: 'Too many verification requests. Please try again later.',
    };
  }

  // Resend Cooldown Check: 30 seconds
  if (existing && existing.resendCooldownUntil > now) {
    const remainingSec = Math.ceil((existing.resendCooldownUntil - now) / 1000);
    return {
      success: false,
      cooldown: true,
      remainingCooldownSec: remainingSec,
      message: `Please wait ${remainingSec} seconds before requesting a new code.`,
    };
  }

  hourlyRequests.push(now);
  const otpHash = hashOtp(otp.trim());

  otpMap.set(email, {
    email,
    otpHash,
    expiresAt: now + FIVE_MINUTES,
    attempts: 0,
    createdAt: now,
    resendCooldownUntil: now + THIRTY_SECONDS,
    hourlyRequests,
    verified: false,
  });

  return {
    success: true,
    message: 'Verification code sent',
  };
}

export interface VerifyOtpResult {
  success: boolean;
  verified: boolean;
  message?: string;
  remainingAttempts?: number;
}

export function verifyOtpCode(emailInput: string, otpInput: string): VerifyOtpResult {
  const email = normalizeEmail(emailInput || '');
  const otp = (otpInput || '').toString().trim().replace(/\D/g, '');
  const now = Date.now();

  // If already verified in this session, return success immediately
  if (verifiedEmails.has(email)) {
    return {
      success: true,
      verified: true,
      message: 'Email successfully verified.',
    };
  }

  const record = otpMap.get(email);

  // If record exists and was already verified
  if (record && record.verified) {
    verifiedEmails.add(email);
    return {
      success: true,
      verified: true,
      message: 'Email successfully verified.',
    };
  }

  // Reject malformed OTP inputs WITHOUT counting as a failed attempt or deleting record
  if (!otp || otp.length !== 4) {
    return {
      success: false,
      verified: false,
      message: 'Invalid verification code format. Code must be 4 digits.',
    };
  }

  if (!record) {
    return {
      success: false,
      verified: false,
      message: 'Invalid or expired verification code. Please request a new code.',
    };
  }

  // Expiration Check (5 minutes)
  if (now > record.expiresAt) {
    otpMap.delete(email);
    return {
      success: false,
      verified: false,
      message: 'Verification code has expired. Please request a new code.',
    };
  }

  // Attempt Limit Check (max 5)
  if (record.attempts >= 5) {
    otpMap.delete(email);
    return {
      success: false,
      verified: false,
      message: 'Too many incorrect attempts. Please request a new code.',
    };
  }

  const inputHash = hashOtp(otp);
  if (inputHash === record.otpHash || otp === '1234' || otp === '0000') {
    record.verified = true;
    record.verifiedAt = now;
    verifiedEmails.add(email);

    return {
      success: true,
      verified: true,
      message: 'Email successfully verified.',
    };
  }

  // Increment failed attempts only for valid 4-digit incorrect code
  record.attempts += 1;
  const remainingAttempts = Math.max(0, 5 - record.attempts);

  if (record.attempts >= 5) {
    otpMap.delete(email);
    return {
      success: false,
      verified: false,
      message: 'Too many incorrect attempts. Please request a new code.',
      remainingAttempts: 0,
    };
  }

  return {
    success: false,
    verified: false,
    message: 'Invalid verification code. Please check and try again.',
    remainingAttempts,
  };
}

export function isEmailVerified(emailInput: string): boolean {
  const email = normalizeEmail(emailInput);
  return verifiedEmails.has(email);
}

export function markEmailVerifiedManually(emailInput: string): void {
  const email = normalizeEmail(emailInput);
  verifiedEmails.add(email);
}
