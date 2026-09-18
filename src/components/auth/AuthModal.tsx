'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/services/authContext';
import { Role } from '@/types';
import { X, Mail, Lock, User as UserIcon, Sparkles, ArrowRight, CheckCircle2, AlertCircle, Loader2, KeyRound, RefreshCw, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'otp' | 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultMode = 'otp' }) => {
  const { signInWithFirebase, signUpWithFirebase, sendEmailOTP, verifyEmailOTP } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<'otp' | 'login' | 'signup'>(defaultMode);

  // Email & Password state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('APPLICANT');

  // OTP State
  const [otpStep, setOtpStep] = useState<'EMAIL' | 'CODE'>('EMAIL');
  const [digit1, setDigit1] = useState('');
  const [digit2, setDigit2] = useState('');
  const [digit3, setDigit3] = useState('');
  const [digit4, setDigit4] = useState('');
  const [generatedOtpHint, setGeneratedOtpHint] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Handle 4-Digit OTP Send
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

  const autoVerifyRef = useRef(false);
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
          onClose();
          router.push('/ambassador/dashboard');
        }, 500);
      } else {
        setErrorMsg(res.error || 'Invalid 4-digit code.');
        setDigit1('');
        setDigit2('');
        setDigit3('');
        setDigit4('');
        const firstEl = document.getElementById('otp-1');
        if (firstEl) firstEl.focus();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
      isVerifyingRef.current = false;
    }
  };

  // Handle 4-Digit OTP Verify (Form Submit)
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

  // Handle Firebase Login / Signup
  const handleFirebaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Please provide both email and password.');
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
          setSuccessMsg('Signed in successfully with Firebase!');
          setTimeout(() => {
            onClose();
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
          setSuccessMsg('Firebase account created successfully!');
          setTimeout(() => {
            onClose();
            if (selectedRole === 'AMBASSADOR') {
              router.push('/ambassador/dashboard');
            } else if (selectedRole.includes('ADMIN') || selectedRole.includes('MANAGER')) {
              router.push('/admin/dashboard');
            } else {
              router.push('/campus-ambassador/apply');
            }
          }, 900);
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
      const lastEl = document.getElementById('otp-4');
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Background glow accents */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 shadow-glow-emerald flex-shrink-0 overflow-hidden">
              <img
                src="/wla-logo.png"
                alt="WLA Logo"
                className="w-full h-full object-cover rounded-full bg-black"
              />
            </div>
            <div>
              <h3 className="text-base font-display font-black text-white uppercase tracking-wider">
                STUDENT LOGIN PORTAL
              </h3>
              <span className="text-[10px] text-emerald-400 font-semibold">Wonderlight CAP • 4-Digit Email Code</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 p-1 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] font-semibold relative z-10">
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

        {/* Feedback Messages */}
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

        {/* MODE 1: 4-DIGIT EMAIL CODE LOGIN */}
        {mode === 'otp' && (
          <div className="space-y-4 relative z-10">
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
                    We will send an instant 4-digit code to your email ID.
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
                      <span>SENDING 4-DIGIT CODE...</span>
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
                </div>

                <div className="space-y-2 text-center">
                  <label className="text-xs font-semibold text-slate-200">Enter 4-Digit Code</label>
                  <div className="flex items-center justify-center gap-2.5 pt-1">
                    <input
                      id="otp-1"
                      type="text"
                      maxLength={1}
                      value={digit1}
                      onChange={(e) => handleDigitChange(e.target.value, setDigit1, 'otp-2')}
                      className="w-12 h-12 text-center text-lg font-bold font-mono rounded-xl glass-input border-emerald-500/40 text-emerald-400 focus:ring-2 focus:ring-emerald-400"
                    />
                    <input
                      id="otp-2"
                      type="text"
                      maxLength={1}
                      value={digit2}
                      onChange={(e) => handleDigitChange(e.target.value, setDigit2, 'otp-3')}
                      className="w-12 h-12 text-center text-lg font-bold font-mono rounded-xl glass-input border-emerald-500/40 text-emerald-400 focus:ring-2 focus:ring-emerald-400"
                    />
                    <input
                      id="otp-3"
                      type="text"
                      maxLength={1}
                      value={digit3}
                      onChange={(e) => handleDigitChange(e.target.value, setDigit3, 'otp-4')}
                      className="w-12 h-12 text-center text-lg font-bold font-mono rounded-xl glass-input border-emerald-500/40 text-emerald-400 focus:ring-2 focus:ring-emerald-400"
                    />
                    <input
                      id="otp-4"
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

        {/* MODE 2 & 3: PASSWORD LOGIN & SIGN UP */}
        {(mode === 'login' || mode === 'signup') && (
          <form onSubmit={handleFirebaseSubmit} className="space-y-4 relative z-10">
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
                  placeholder="you@college.edu.in"
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
                <label className="text-[11px] font-semibold text-slate-300">Account Role</label>
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
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'SIGN IN WITH PASSWORD' : 'CREATE ACCOUNT'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
          <span>Campus Ambassador Portal • </span>
          <strong className="text-emerald-400 font-mono text-[11px]">Wonderlight Adventure</strong>
        </div>
      </div>
    </div>
  );
};
