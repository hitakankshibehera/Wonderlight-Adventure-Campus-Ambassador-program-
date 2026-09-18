'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Compass,
  User,
  GraduationCap,
  Share2,
  Award,
  HelpCircle,
  FileCheck,
  Search,
  ExternalLink,
  ShieldCheck,
  Lock,
  Clock,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { EmailOtpVerification } from '@/components/auth/EmailOtpVerification';
import { Applicant } from '@/types';

export default function ApplicationPage() {
  const [cmsConfig, setCmsConfig] = useState(dbService.getCMSConfig());
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    const refresh = () => setCmsConfig(dbService.getCMSConfig());
    refresh();
    return dbService.subscribe(refresh);
  }, []);
  const [submittedApplicationId, setSubmittedApplicationId] = useState<string | null>(null);
  const [emailVerified, setEmailVerified] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: OTP Email
    email: '',

    // Step 2: Personal
    fullName: '',
    phone: '',
    dob: '',
    gender: 'Prefer not to say',

    // Step 3: Education
    college: '',
    university: '',
    city: '',
    state: '',
    course: '',
    department: '',
    year: '2nd Year',
    graduationYear: '2027',

    // Step 4: Social Profile
    instagram: '',
    linkedin: '',
    otherProfile: '',

    // Step 5: Experience
    previousAmbassadorExp: '',
    eventExp: '',
    marketingExp: '',
    leadershipExp: '',

    // Step 6: Questions
    motivation: '',
    promotionStrategy: '',
    networkSize: '',

    // Step 7: Consent
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!emailVerified || !formData.email) {
        newErrors.email = 'Please verify your email address using the 4-digit code first.';
      }
    } else if (step === 2) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.phone.trim()) newErrors.phone = 'WhatsApp phone number is required';
    } else if (step === 3) {
      if (!formData.college.trim()) newErrors.college = 'College name is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.course.trim()) newErrors.course = 'Degree/Course is required';
    } else if (step === 4) {
      if (!formData.instagram.trim()) newErrors.instagram = 'Instagram handle is required for social missions';
    } else if (step === 5) {
      // Experience optional
    } else if (step === 6) {
      if (!formData.motivation.trim() || formData.motivation.length < 20) {
        newErrors.motivation = 'Please share your motivation (min 20 characters)';
      }
      if (!formData.promotionStrategy.trim()) {
        newErrors.promotionStrategy = 'Please outline your campus promotion idea';
      }
    } else if (step === 7) {
      if (!formData.termsAccepted) {
        newErrors.termsAccepted = 'You must accept the terms and privacy policy';
      }
      if (!emailVerified) {
        newErrors.email = 'Email verification is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(7, prev + 1));
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const [existingApp, setExistingApp] = useState<Applicant | null>(null);

  const handleOtpVerifiedSuccess = (verifiedEmail: string) => {
    setEmailVerified(true);
    setFormData((prev) => ({ ...prev, email: verifiedEmail }));

    // Requirement 13: Check for existing duplicate application
    const existing = dbService.getApplicantByEmail(verifiedEmail);
    if (existing) {
      setExistingApp(existing);
      return;
    }

    setCurrentStep(2); // Auto advance to Personal Information
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(7)) return;

    setIsSubmitting(true);
    try {
      const applicant = dbService.createApplicant({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        college: formData.college,
        university: formData.university || formData.college,
        city: formData.city,
        state: formData.state,
        course: formData.course,
        department: formData.department || formData.course,
        year: formData.year,
        graduationYear: formData.graduationYear,
        instagram: formData.instagram,
        linkedin: formData.linkedin,
        otherProfile: formData.otherProfile,
        previousAmbassadorExp: formData.previousAmbassadorExp || 'None',
        eventExp: formData.eventExp || 'None',
        marketingExp: formData.marketingExp || 'None',
        leadershipExp: formData.leadershipExp || 'None',
        motivation: formData.motivation,
        promotionStrategy: formData.promotionStrategy,
        networkSize: formData.networkSize || '100-500 students',
        termsAccepted: true,
      });

      if (!applicant || !applicant.applicationId) {
        throw new Error('Database record creation failed. Application was not saved.');
      }

      setSubmittedApplicationId(applicant.applicationId);

      // Dispatch Confirmation Email after Firestore write succeeds
      let emailFailed = false;
      try {
        const emailRes = await fetch('/api/auth/send-application-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: applicant.fullName,
            email: applicant.email,
            applicationId: applicant.applicationId,
            college: applicant.college,
            batch: '2026 Batch',
            date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            status: 'SUBMITTED',
          }),
        });
        const emailData = await emailRes.json();
        if (!emailRes.ok || !emailData.success) {
          emailFailed = true;
          console.warn('[EMAIL WARNING] Application submitted to database but email dispatch failed:', emailData.error);
        }
      } catch (emailErr) {
        emailFailed = true;
        console.warn('[EMAIL WARNING] Network error during application confirmation email dispatch:', emailErr);
      }

      // Redirect to Application Success Page (application remains SUBMITTED even if email failed)
      const successUrl = `/campus-ambassador/application-success?id=${applicant.applicationId}${emailFailed ? '&emailNotice=failed' : ''}`;
      window.location.href = successUrl;
    } catch (e: any) {
      alert(e?.message || 'Failed to submit application to database. Please check your data and try again.');
      setIsSubmitting(false);
    }
  };

  if (cmsConfig.applicationsOpen === false) {
    return (
      <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto font-sans flex items-center justify-center">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-rose-500/40 shadow-2xl space-y-8 text-center bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-900/95 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-rose-500/10 blur-3xl pointer-events-none" />

          <div className="w-20 h-20 mx-auto rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-glow-rose animate-bounce">
            <Lock className="w-10 h-10" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              <span>REGISTRATIONS TEMPORARILY CLOSED</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
              REGISTRATIONS CLOSED FOR COHORT {cmsConfig.programBatch || '2026–27'}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Thank you for your immense enthusiasm! Student applications for the current Campus Ambassador cohort are currently closed or under administrative review by Wonderlight Adventure.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="font-semibold text-white">Already applied for Cohort {cmsConfig.programBatch || '2026–27'}?</div>
            <p>You can check your application timeline, shortlisted state, or official selection results anytime using the buttons below.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Link
              href="/campus-ambassador/application-status"
              className="py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>TRACK MY APPLICATION STATUS</span>
            </Link>

            <Link
              href="/campus-ambassador/results"
              className="py-3.5 px-5 rounded-xl glass-input text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>VIEW SELECTION RESULTS</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-center gap-4">
            <span>Questions? Contact us at <strong className="text-emerald-400">{cmsConfig.contactEmail || 'wonderlightadventure@gmail.com'}</strong></span>
          </div>
        </div>
      </div>
    );
  }

  const stepsList = [
    { num: 1, label: 'Email OTP', icon: ShieldCheck },
    { num: 2, label: 'Personal', icon: User },
    { num: 3, label: 'Education', icon: GraduationCap },
    { num: 4, label: 'Social', icon: Share2 },
    { num: 5, label: 'Experience', icon: Award },
    { num: 6, label: 'Vision', icon: HelpCircle },
    { num: 7, label: 'Consent', icon: FileCheck },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto font-sans">
      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Official Application Portal • Cohort 2026–27</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight uppercase">
          APPLY FOR WONDERLIGHT CAP
        </h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Represent Wonderlight Adventure at your campus. Verify your email and complete this application to embark on your leadership journey.
        </p>
      </div>

      {submittedApplicationId ? (
        /* SUCCESS CONFIRMATION STATE */
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-emerald-500/40 text-center space-y-6 shadow-glow-emerald animate-in fade-in zoom-in-95 duration-300">
          <div className="w-20 h-20 mx-auto rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 border border-emerald-500/40 shadow-glow-emerald animate-bounce overflow-hidden">
            <img src="/wla-logo.png" alt="WLA Logo" className="w-full h-full object-cover rounded-full bg-black" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase">
              APPLICATION SUBMITTED SUCCESSFULLY!
            </h2>
            <p className="text-slate-300 text-sm max-w-md mx-auto">
              Thank you for applying, <strong>{formData.fullName}</strong>. Your candidate file has been registered with our Admissions Committee.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-card max-w-md mx-auto space-y-1 border-emerald-500/30">
            <div className="text-xs text-slate-400 uppercase tracking-widest">Your Unique Application ID</div>
            <div className="text-3xl font-display font-black text-emerald-400 tracking-wider">
              {submittedApplicationId}
            </div>
            <div className="text-[11px] text-slate-400 pt-1">
              Please save this ID. You will need it to track your selection status and access your results.
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/campus-ambassador/application-status"
              className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald hover:brightness-110 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Track Application Status</span>
            </Link>
            <Link
              href="/campus-ambassador"
              className="px-6 py-3 rounded-xl glass-input text-slate-300 text-xs font-semibold hover:text-white"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      ) : (
        /* MULTI-STEP FORM */
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 space-y-8 shadow-2xl">
          {/* Progress Tracker */}
          <div className="grid grid-cols-7 gap-1.5 border-b border-slate-800 pb-6">
            {stepsList.map((st) => {
              const isPast = st.num < currentStep;
              const isCurrent = st.num === currentStep;
              return (
                <div key={st.num} className="text-center space-y-1.5">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isPast || isCurrent
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : 'bg-slate-800'
                    }`}
                  />
                  <div className="hidden sm:flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-400">
                    <span className={isCurrent ? 'text-emerald-400 font-bold' : ''}>
                      {st.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-8">
            {/* STEP 1: EMAIL OTP VERIFICATION */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <EmailOtpVerification
                  onSuccess={handleOtpVerifiedSuccess}
                  titleOverride="STEP 1 — VERIFY YOUR EMAIL"
                  subtitleOverride="Enter your email address to receive a secure 4-digit verification code before filling out your candidate details."
                />
              </div>
            )}

            {/* STEP 2: PERSONAL INFORMATION */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-400" />
                    <span>Step 2 — Personal Information</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Tell us your legal name and primary contact coordinates.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Verified Email Address ✓
                    </label>
                    <div className="flex items-center gap-2 px-4 py-3 bg-slate-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-sm font-mono font-semibold">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>{formData.email}</span>
                      <span className="ml-auto text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">VERIFIED</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Aarav Sharma"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                    />
                    {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      WhatsApp Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                    />
                    {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Gender (Optional)
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass-input text-sm bg-wonder-dark-900"
                    >
                      <option value="Prefer not to say">Prefer not to say</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-Binary">Non-Binary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: EDUCATION & COLLEGE DETAILS */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-emerald-400" />
                    <span>Step 3 — Education & College Details</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Provide your current institution and academic standing.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      College / Institute Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. St. Xavier's College, Mumbai"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                    />
                    {errors.college && <p className="text-xs text-red-400 mt-1">{errors.college}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Affiliated University
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai University"
                      value={formData.university}
                      onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Campus City *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                    />
                    {errors.city && <p className="text-xs text-red-400 mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      State *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Maharashtra"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                    />
                    {errors.state && <p className="text-xs text-red-400 mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Degree Program / Course *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. B.Tech Computer Science / BBA"
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                    />
                    {errors.course && <p className="text-xs text-red-400 mt-1">{errors.course}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Current Year of Study
                    </label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass-input text-sm bg-wonder-dark-900"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: SOCIAL PROFILES */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-emerald-400" />
                    <span>Step 4 — Social Media Profiles</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Ambassadors amplify Wonderlight campaigns on digital channels.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Instagram Handle *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-slate-500 font-mono text-sm">@</span>
                      <input
                        type="text"
                        placeholder="aarav_adventures"
                        value={formData.instagram}
                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value.replace('@', '') })}
                        className="w-full pl-9 pr-4 py-3 rounded-xl glass-input text-sm"
                      />
                    </div>
                    {errors.instagram && <p className="text-xs text-red-400 mt-1">{errors.instagram}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      LinkedIn Profile URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.in/in/aaravsharma"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: LEADERSHIP EXPERIENCE */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-400" />
                    <span>Step 5 — Leadership & Campus Experience</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Help us understand your campus activities & previous roles.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Previous Ambassador / Campus Leader Roles
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Core Committee Member for TechFest 2025..."
                      value={formData.previousAmbassadorExp}
                      onChange={(e) => setFormData({ ...formData, previousAmbassadorExp: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: VISION & PROMOTION STRATEGY */}
            {currentStep === 6 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-emerald-400" />
                    <span>Step 6 — Vision & Promotion Strategy</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Tell us how you plan to represent Wonderlight on campus.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Why do you want to join the Wonderlight Campus Ambassador Program? *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share your passion for youth travel, building campus community, and career goals..."
                      value={formData.motivation}
                      onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                    />
                    {errors.motivation && <p className="text-xs text-red-400 mt-1">{errors.motivation}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      How would you promote Wonderlight on your campus? *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Travel quizzes, hostel roadshow, collaborating with photography clubs, Instagram reels..."
                      value={formData.promotionStrategy}
                      onChange={(e) => setFormData({ ...formData, promotionStrategy: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                    />
                    {errors.promotionStrategy && <p className="text-xs text-red-400 mt-1">{errors.promotionStrategy}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: CONSENT & SUBMISSION */}
            {currentStep === 7 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-emerald-400" />
                    <span>Step 7 — Review & Consent</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Review your verified credentials and accept program terms.</p>
                </div>

                {/* Summary Card */}
                <div className="p-5 rounded-2xl glass-card space-y-3 text-xs text-slate-300 border border-emerald-500/30">
                  <div className="grid grid-cols-2 gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-slate-400">Name:</span> <strong className="text-white">{formData.fullName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Verified Email:</span> <strong className="text-emerald-400 font-mono">{formData.email} ✓</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">College:</span> <strong className="text-white">{formData.college}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">City:</span> <strong className="text-white">{formData.city}, {formData.state}</strong>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Instagram:</span> @{formData.instagram}
                  </div>
                </div>

                {/* Consent checkbox */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                      className="w-4 h-4 mt-0.5 text-emerald-500 rounded bg-slate-800 border-slate-700 focus:ring-emerald-500"
                    />
                    <span className="text-xs text-slate-300 leading-relaxed">
                      I declare that all details provided are accurate. If selected, I agree to abide by the Wonderlight Adventure Campus Ambassador Code of Conduct, represent the brand with integrity, and maintain collegiate safety standards.
                    </span>
                  </label>
                  {errors.termsAccepted && <p className="text-xs text-red-400">{errors.termsAccepted}</p>}
                </div>
              </div>
            )}

            {/* Form Navigation Buttons */}
            {currentStep > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-5 py-2.5 rounded-xl glass-input text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentStep < 7 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald hover:brightness-110 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-display font-extrabold text-xs tracking-wider uppercase shadow-glow-emerald hover:brightness-110 flex items-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>REGISTERING APPLICATION...</span>
                    ) : (
                      <>
                        <span>SUBMIT APPLICATION</span>
                        <Sparkles className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
