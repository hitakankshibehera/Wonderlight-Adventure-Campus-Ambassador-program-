'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/services/authContext';
import { Role } from '@/types';
import { Compass, Mail, Lock, User as UserIcon, Sparkles, ArrowRight, AlertCircle, CheckCircle2, Loader2, KeyRound, RefreshCw, Send } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithFirebase, signUpWithFirebase, sendEmailOTP, verifyEmailOTP } = useAuth();
  const autoVerifyRef = useRef(false);

  const [mode, setMode] = useState<'otp' | 'login' | 'signup'>('otp');

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('APPLICANT');

  // OTP steps & 4 digits
  const [otpStep, setOtpStep] = useState<'EMAIL' | 'CODE'>('EMAIL');
  const [digit1, setDigit1] = useState('');
  const [digit2, setDigit2] = useState('');
  const [digit3, setDigit3] = useState('');
  const [digit4, setDigit4] = useState('');
  const [generatedOtpHint, setGeneratedOtpHint] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Send 4-Digit Code
  const handleSendOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid student email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendEmailOTP(email);
      if (res.success) {
        setOtpStep('CODE');
        if (res.otp) setGeneratedOtpHint(res.otp);
        setSuccessMsg(`📩 4-Digit Verification Code sent to ${email}`);
      } else {
        setErrorMsg(res.error || 'Failed to send verification code.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not send verification code.');
    } finally {
      setLoading(false);
    }
  };

  const isVerifyingRef = useRef(false);

  // Auto Verify & Login when 4 digits are filled
  useEffect(() => {
    const fullCode = `${digit1}${digit2}${digit3}${digit4}`.trim().replace(/\D/g, '');
    if (fullCode.length < 4) {
      autoVerifyRef.current = false;
    } else if (fullCode.length === 4 && mode === 'otp' && otpStep === 'CODE' && !autoVerifyRef.current && !loading && !isVerifyingRef.current) {
      autoVerifyRef.current = true;
      executeAutoLogin(fullCode);
    }
  }, [digit1, digit2, digit3, digit4, mode, otpStep, loading]);

  const executeAutoLogin = async (code: string) => {
    if (isVerifyingRef.current) return;
    isVerifyingRef.current = true;

    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const res = await verifyEmailOTP(email, code);
      if (res.success) {
        setSuccessMsg('✓ Code verified! Logging in automatically...');
        setTimeout(() => {
          router.push('/ambassador/dashboard');
        }, 500);
      } else {
        setErrorMsg(res.error || 'Invalid 4-digit code.');
        setDigit1('');
        setDigit2('');
        setDigit3('');
        setDigit4('');
        const firstEl = document.getElementById('page-otp-1');
        if (firstEl) firstEl.focus();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
      isVerifyingRef.current = false;
    }
  };

  // Verify 4-Digit Code & Login (Form Submit)
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || isVerifyingRef.current) return;
    const fullCode = `${digit1}${digit2}${digit3}${digit4}`.trim().replace(/\D/g, '');
    if (fullCode.length !== 4) {
      setErrorMsg('Please enter the complete 4-digit code sent to your email.');
      return;
    }
    executeAutoLogin(fullCode);
  };

  // Firebase password submit
  const handleFirebaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    if (mode === 'signup' && !fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await signInWithFirebase(email, password);
        if (res.success) {
          setSuccessMsg('Signed in successfully!');
          setTimeout(() => {
            if (email.includes('admin') || email.includes('wonderlight')) {
              router.push('/admin/dashboard');
            } else {
              router.push('/ambassador/dashboard');
            }
          }, 800);
        } else {
          setErrorMsg(res.error || 'Invalid login credentials.');
        }
      } else {
        const res = await signUpWithFirebase(email, password, fullName, selectedRole);
        if (res.success) {
          setSuccessMsg('Account created successfully!');
          setTimeout(() => {
            if (selectedRole === 'AMBASSADOR') {
              router.push('/ambassador/dashboard');
            } else if (selectedRole.includes('ADMIN') || selectedRole.includes('MANAGER')) {
              router.push('/admin/dashboard');
            } else {
              router.push('/campus-ambassador/apply');
            }
          }, 800);
        } else {
          setErrorMsg(res.error || 'Failed to create account.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDigitChange = (value: string, setter: (val: string) => void, nextInputId?: string) => {
    const digitsOnly = value.replace(/[^0-9]/g, '');
    if (digitsOnly.length >= 4) {
      const code = digitsOnly.slice(0, 4);
      setDigit1(code[0]);
      setDigit2(code[1]);
      setDigit3(code[2]);
      setDigit4(code[3]);
      const lastEl = document.getElementById('page-otp-4');
      if (lastEl) lastEl.focus();
      return;
    }
    const clean = digitsOnly.slice(-1);
    setter(clean);
    if (clean && nextInputId) {
      const nextEl = document.getElementById(nextInputId);
      if (nextEl) nextEl.focus();
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 max-w-md mx-auto font-sans">
      <div className="w-full space-y-6">
        {/* Brand logo header */}
        <div className="text-center space-y-3">
          <Link href="/campus-ambassador" className="inline-flex items-center gap-3 group">
            <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 shadow-glow-emerald group-hover:scale-105 transition-transform flex-shrink-0 overflow-hidden">
              <img
                src="/wla-logo.png"
                alt="WLA - Wonderlight Adventure Company Logo"
                className="w-full h-full object-cover rounded-full bg-black"
              />
            </div>
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
              STUDENT LOGIN PORTAL
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              Enter your email to receive an instant 4-digit verification code.
            </p>
          </div>
        </div>

        {/* Auth Box */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-5 relative">
          {/* Mode Switcher */}
          <div className="grid grid-cols-3 p-1 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('otp');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-xl transition-all ${
                mode === 'otp'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              4-DIGIT CODE
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              PASSWORD
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SIGN UP
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 4-DIGIT CODE MODE */}
          {mode === 'otp' && (
            <div className="space-y-4">
              {otpStep === 'EMAIL' ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">Enter Your Student Email ID</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. aarav.sharma@kiit.ac.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 pt-0.5">
                      We will automatically send a 4-digit code to this email ID.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-glow-emerald hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                        <span>SENDING CODE...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>SEND 4-DIGIT CODE TO MAIL</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4 animate-in fade-in">
                  {/* Official Mail Sent Notification */}
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-1.5 text-center">
                    <div className="font-bold text-[11px] text-emerald-400 flex items-center justify-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Official Email Sent Automatically</span>
                    </div>
                    <div className="text-[11px] text-slate-300 leading-normal">
                      A 4-digit verification code has been sent to <strong className="text-white">{email}</strong> from <strong className="text-amber-300">wonderlightadventure@gmail.com</strong>.
                    </div>
                    {generatedOtpHint && (
                      <div className="pt-1 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (generatedOtpHint && generatedOtpHint.length === 4) {
                              setDigit1(generatedOtpHint[0]);
                              setDigit2(generatedOtpHint[1]);
                              setDigit3(generatedOtpHint[2]);
                              setDigit4(generatedOtpHint[3]);
                            }
                          }}
                          className="text-[11px] text-amber-300 font-bold hover:text-amber-200 flex items-center gap-1.5 bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/40 shadow-glow-gold cursor-pointer animate-pulse"
                        >
                          <span>⚡ Instant Code: <strong>{generatedOtpHint}</strong> (Click to Auto-fill)</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-center">
                    <label className="text-xs font-semibold text-slate-200">Enter 4-Digit Verification Code</label>
                    <div className="flex items-center justify-center gap-2.5 pt-1">
                      <input
                        id="page-otp-1"
                        type="text"
                        maxLength={1}
                        value={digit1}
                        onChange={(e) => handleDigitChange(e.target.value, setDigit1, 'page-otp-2')}
                        className="w-12 h-12 text-center text-lg font-bold font-mono rounded-xl glass-input border-emerald-500/40 text-emerald-400 focus:ring-2 focus:ring-emerald-400"
                      />
                      <input
                        id="page-otp-2"
                        type="text"
                        maxLength={1}
                        value={digit2}
                        onChange={(e) => handleDigitChange(e.target.value, setDigit2, 'page-otp-3')}
                        className="w-12 h-12 text-center text-lg font-bold font-mono rounded-xl glass-input border-emerald-500/40 text-emerald-400 focus:ring-2 focus:ring-emerald-400"
                      />
                      <input
                        id="page-otp-3"
                        type="text"
                        maxLength={1}
                        value={digit3}
                        onChange={(e) => handleDigitChange(e.target.value, setDigit3, 'page-otp-4')}
                        className="w-12 h-12 text-center text-lg font-bold font-mono rounded-xl glass-input border-emerald-500/40 text-emerald-400 focus:ring-2 focus:ring-emerald-400"
                      />
                      <input
                        id="page-otp-4"
                        type="text"
                        maxLength={1}
                        value={digit4}
                        onChange={(e) => handleDigitChange(e.target.value, setDigit4)}
                        className="w-12 h-12 text-center text-lg font-bold font-mono rounded-xl glass-input border-emerald-500/40 text-emerald-400 focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-glow-emerald hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                        <span>VERIFYING CODE...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>VERIFY 4-DIGIT CODE &amp; LOGIN</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between pt-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setOtpStep('EMAIL')}
                      className="text-slate-400 hover:text-white"
                    >
                      ← Change Email
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendOTP()}
                      className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Resend Code</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* PASSWORD OR SIGNUP MODES */}
          {(mode === 'login' || mode === 'signup') && (
            <form onSubmit={handleFirebaseSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="name@college.edu.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Select Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as Role)}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-xs bg-wonder-dark-900 text-slate-200"
                  >
                    <option value="APPLICANT">Applicant (Student)</option>
                    <option value="AMBASSADOR">Campus Ambassador</option>
                    <option value="SUPER_ADMIN">Wonderlight Admin</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-glow-emerald hover:brightness-110 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>CONNECTING...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'SIGN IN WITH PASSWORD' : 'REGISTER ACCOUNT'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
            <span>Wonderlight Campus Ambassador Program</span>
          </div>
        </div>
      </div>
    </div>
  );
}
