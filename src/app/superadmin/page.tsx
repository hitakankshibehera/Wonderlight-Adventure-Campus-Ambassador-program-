'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/services/authContext';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, Loader2, Sparkles, KeyRound, ShieldAlert } from 'lucide-react';

export default function SuperAdminPage() {
  const router = useRouter();
  const { user, role, signInWithFirebase, loginWithEmail, logout } = useAuth();

  const [email, setEmail] = useState('wonderlightadventure@gmail.com');
  const [password, setPassword] = useState('Wonderlight@123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isAdmin = user && ['SUPER_ADMIN', 'PROGRAM_MANAGER', 'EVENT_MANAGER', 'MARKETING_MANAGER', 'FINANCE_MANAGER', 'MODERATOR'].includes(user.role);

  const handleSuperAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both Super Admin email and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await signInWithFirebase(email.trim(), password);
      if (res.success) {
        setSuccessMsg('✓ Super Admin Authenticated! Granting full access...');
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 600);
      } else {
        const altRes = await loginWithEmail(email.trim(), password);
        if (altRes) {
          setSuccessMsg('✓ Super Admin Authenticated! Granting full access...');
          setTimeout(() => {
            router.push('/admin/dashboard');
          }, 600);
        } else {
          setErrorMsg('Invalid Super Admin credentials. Please verify your email & password.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-wonder-dark-950 font-sans relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-hero-pattern opacity-40 pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand header */}
        <div className="text-center space-y-3">
          <Link href="/campus-ambassador" className="inline-flex items-center gap-3 group">
            <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-emerald-400 to-teal-400 shadow-glow-gold group-hover:scale-105 transition-transform flex-shrink-0 overflow-hidden">
              <img
                src="/wla-logo.png"
                alt="Wonderlight Adventure Logo"
                className="w-full h-full object-cover rounded-full bg-black"
              />
            </div>
          </Link>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold tracking-widest uppercase shadow-glow-gold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>RESTRICTED ACCESS • SUPER ADMIN CONTROL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
              SUPER ADMIN PORTAL
            </h1>
            <p className="text-slate-400 text-xs">
              Wonderlight Adventure Technologies • Administrative Gateway
            </p>
          </div>
        </div>

        {/* Authenticated State vs Login Form */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/40 shadow-2xl space-y-6 relative bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-slate-900/90">
          {isAdmin ? (
            <div className="space-y-5 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-glow-emerald animate-pulse">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-display font-bold text-white uppercase">
                  AUTHENTICATED AS {user.role.replace(/_/g, ' ')}
                </h3>
                <p className="text-xs text-slate-300">
                  Logged in: <strong className="text-emerald-400">{user.email}</strong>
                </p>
              </div>

              <div className="pt-2 space-y-3">
                <button
                  onClick={() => router.push('/admin/dashboard')}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-glow-gold hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>ENTER ADMIN CONTROL CENTER →</span>
                </button>

                <button
                  onClick={() => logout()}
                  className="w-full py-2.5 rounded-xl glass-input text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border-rose-500/30 transition-colors"
                >
                  Sign Out / Switch Credentials
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSuperAdminLogin} className="space-y-4">
              <div className="text-xs text-slate-400 text-center pb-1">
                Enter your administrative credentials to access full system controls.
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Super Admin Email ID</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-amber-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="wonderlightadventure@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs border-amber-500/40 text-amber-300 focus:ring-2 focus:ring-amber-400 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Super Admin Security Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-amber-400 pointer-events-none" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs border-amber-500/40 text-amber-300 focus:ring-2 focus:ring-amber-400 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-glow-gold hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>AUTHENTICATING SUPER ADMIN...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-slate-950" />
                    <span>AUTHENTICATE &amp; ENTER PORTAL</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </>
                )}
              </button>

              <div className="pt-3 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
                Authorized access only • All sessions logged &amp; monitored
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
