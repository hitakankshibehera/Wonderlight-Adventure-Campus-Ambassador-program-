'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mail, CheckCircle2, ShieldCheck, RefreshCw, AlertCircle, Lock, ArrowRight, Sparkles, Info } from 'lucide-react';
import { useAuth } from '@/lib/services/authContext';

interface EmailOtpVerificationProps {
  initialEmail?: string;
  onSuccess: (email: string) => void;
  titleOverride?: string;
  subtitleOverride?: string;
  showStepHeader?: boolean;
}

export const EmailOtpVerification: React.FC<EmailOtpVerificationProps> = ({
  initialEmail = '',
  onSuccess,
  titleOverride,
  subtitleOverride,
  showStepHeader = true,
}) => {
  const { verifyEmailOTP } = useAuth();
  const [step, setStep] = useState<'EMAIL' | 'OTP' | 'VERIFIED'>(initialEmail ? 'OTP' : 'EMAIL');
  const [email, setEmail] = useState(initialEmail);
  const [digits, setDigits] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devNotice, setDevNotice] = useState<{ isSimulated: boolean; devOtp?: string } | null>(null);

  // Timers: 5-minute expiration & 30-second resend cooldown
  const [expireSeconds, setExpireSeconds] = useState(300); // 5 mins
  const [resendCooldown, setResendCooldown] = useState(30); // 30s
  const [canResend, setCanResend] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Mask Email Function: e.g., "john.doe@gmail.com" -> "j****e@gmail.com"
  const getMaskedEmail = (rawEmail: string) => {
    if (!rawEmail || !rawEmail.includes('@')) return rawEmail;
    const [name, domain] = rawEmail.split('@');
    if (name.length <= 2) {
      return `${name[0]}*@${domain}`;
    }
    const firstChar = name[0];
    const lastChar = name[name.length - 1];
    return `${firstChar}****${lastChar}@${domain}`;
  };

  // Expiration & Cooldown Timers
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'OTP' && expireSeconds > 0) {
      timer = setInterval(() => {
        setExpireSeconds((prev) => {
          if (prev <= 1) {
            setIsExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, expireSeconds]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'OTP' && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendCooldown]);

  // Focus first digit when switching to OTP screen
  useEffect(() => {
    if (step === 'OTP') {
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 100);
    }
  }, [step]);

  // Format seconds to MM:SS
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@') || !trimmed.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to send verification code. Please try again.');
        setLoading(false);
        return;
      }

      // Success
      setStep('OTP');
      setDigits(['', '', '', '']);
      setExpireSeconds(300);
      setResendCooldown(30);
      setCanResend(false);
      setIsExpired(false);
      setDevNotice({
        isSimulated: Boolean(data.simulated),
        devOtp: data.devOtp,
      });
    } catch (err: any) {
      setError('Network connection error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const isVerifyingRef = useRef(false);

  // Handle Digit Change
  const handleDigitChange = (index: number, value: string) => {
    // Single character or paste support
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, 4);
      if (pasted) {
        const newDigits = ['', '', '', ''];
        for (let i = 0; i < pasted.length; i++) {
          newDigits[i] = pasted[i];
        }
        setDigits(newDigits);
        if (pasted.length === 4) {
          inputRefs[3].current?.focus();
          triggerVerify(newDigits.join(''));
        } else {
          inputRefs[Math.min(pasted.length, 3)].current?.focus();
        }
        return;
      }
    }

    // Only allow numeric
    if (value && !/^\d$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto trigger when 4th digit entered
    if (value && index === 3 && newDigits.every((d) => d !== '')) {
      triggerVerify(newDigits.join(''));
    }
  };

  // Handle Keydown (Backspace navigation)
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs[index - 1].current?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
      }
    }
  };

  // Trigger Verify Code API & Session Login
  const triggerVerify = async (codeToVerify?: string) => {
    if (isVerifyingRef.current || loading) return;

    setError(null);
    const code = (codeToVerify || digits.join('')).trim().replace(/\D/g, '');
    if (code.length !== 4) {
      setError('Please enter the full 4-digit code.');
      return;
    }

    isVerifyingRef.current = true;
    setLoading(true);

    try {
      const res = await verifyEmailOTP(email.trim().toLowerCase(), code);

      if (!res.success) {
        setError(res.error || 'Invalid or expired verification code.');
        setDigits(['', '', '', '']);
        setTimeout(() => inputRefs[0].current?.focus(), 100);
        return;
      }

      setStep('VERIFIED');
    } catch (err) {
      setError('Failed to reach server. Please try again.');
    } finally {
      setLoading(false);
      isVerifyingRef.current = false;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-500/5 text-white">
      {/* STEP 1: EMAIL INPUT SCREEN */}
      {step === 'EMAIL' && (
        <div>
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
              <Mail className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              {titleOverride || 'VERIFY YOUR EMAIL'}
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              {subtitleOverride || "Enter your email address. We'll send you a 4-digit verification code."}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>SENDING OTP...</span>
                </>
              ) : (
                <>
                  <span>SEND OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Never share your OTP with anyone.</span>
          </div>
        </div>
      )}

      {/* STEP 2: OTP CODE SCREEN */}
      {step === 'OTP' && (
        <div>
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-white">
              ENTER YOUR VERIFICATION CODE
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              We&apos;ve sent a 4-digit verification code to
            </p>
            <div className="inline-block mt-1 px-3 py-1 bg-slate-800/80 border border-slate-700/60 rounded-full font-mono text-emerald-300 font-semibold text-xs tracking-wide">
              {getMaskedEmail(email)}
            </div>
          </div>

          {/* SIMULATION / REAL DISPATCH STATUS BANNER */}
          {devNotice?.isSimulated && devNotice?.devOtp && (
            <div className="mb-5 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-200 text-xs space-y-1 text-center">
              <div className="font-bold text-amber-400 flex items-center justify-center gap-1.5">
                <Info className="w-4 h-4" />
                <span>DEV SIMULATION MODE ACTIVE</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Google App Password not configured in <code className="text-amber-300 font-mono bg-slate-950 px-1 py-0.5 rounded">.env.local</code>.
              </p>
              <div className="pt-1">
                <span className="text-[11px] text-slate-400 uppercase tracking-widest">Test 4-Digit Code: </span>
                <strong className="text-base font-mono text-emerald-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-emerald-500/40 ml-1">
                  {devNotice.devOtp}
                </strong>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* 4 DIGIT INPUT BOXES */}
          <div className="flex items-center justify-center gap-3 my-6">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                disabled={isExpired}
                className={`w-14 h-16 text-center text-2xl font-mono font-bold rounded-2xl bg-slate-950 border ${
                  digit
                    ? 'border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/20'
                    : 'border-slate-700 text-white focus:border-emerald-400'
                } focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all`}
              />
            ))}
          </div>

          {/* EXPIRATION & COOLDOWN STATUS */}
          <div className="text-center text-xs space-y-2 mb-6">
            {isExpired ? (
              <div className="text-rose-400 font-bold tracking-wide">
                ⚠️ OTP EXPIRED — PLEASE REQUEST A NEW CODE
              </div>
            ) : (
              <div className="text-slate-400 flex items-center justify-center gap-1.5">
                <span>Code expires in</span>
                <span className="font-mono text-emerald-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {formatTime(expireSeconds)}
                </span>
              </div>
            )}
          </div>

          {/* VERIFY BUTTON */}
          <button
            onClick={() => triggerVerify()}
            disabled={loading || digits.some((d) => d === '') || isExpired}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer mb-4"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>VERIFYING...</span>
              </>
            ) : (
              <span>VERIFY & CONTINUE</span>
            )}
          </button>

          {/* RESEND / EDIT EMAIL ACTIONS */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
            <button
              onClick={() => {
                setStep('EMAIL');
                setError(null);
              }}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              ← Edit Email
            </button>

            <button
              onClick={() => handleSendOtp()}
              disabled={!canResend && !isExpired}
              className={`font-semibold transition-colors cursor-pointer ${
                canResend || isExpired
                  ? 'text-emerald-400 hover:text-emerald-300 underline'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              {canResend || isExpired
                ? 'RESEND OTP'
                : `Resend code in ${resendCooldown}s`}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SUCCESS VERIFIED SCREEN */}
      {step === 'VERIFIED' && (
        <div className="text-center py-2">
          <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/20 border-2 border-emerald-400 rounded-full p-0.5 shadow-xl shadow-emerald-500/30 animate-bounce overflow-hidden">
            <img src="/wla-logo.png" alt="WLA Logo" className="w-full h-full object-cover rounded-full bg-black" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            EMAIL VERIFIED ✓
          </h2>
          <p className="text-sm text-slate-300 mt-2 mb-6">
            You can now continue your Wonderlight Campus Ambassador application.
          </p>

          <button
            onClick={() => onSuccess(email.trim().toLowerCase())}
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer text-base uppercase tracking-wider"
          >
            <span>CONTINUE APPLICATION</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
