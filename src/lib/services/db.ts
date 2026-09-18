import {
  Applicant,
  Ambassador,
  EventItem,
  EventRegistration,
  Mission,
  MissionSubmission,
  RewardItem,
  RewardClaim,
  ReferralRecord,
  CertificateRecord,
  AnnouncementRecord,
  SelectionBatchRecord,
  CMSConfig,
  AuditLogRecord,
  ApplicationStatus,
  AmbassadorLevel,
} from '@/types';
import {
  INITIAL_APPLICANTS,
  INITIAL_AMBASSADORS,
  INITIAL_EVENTS,
  INITIAL_MISSIONS,
  INITIAL_REWARDS,
  INITIAL_REFERRALS,
  INITIAL_CERTIFICATES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_SELECTION_BATCHES,
  INITIAL_CMS_CONFIG,
  INITIAL_AUDIT_LOGS,
} from './seedData';

type Listener = () => void;

class DatabaseService {
  private applicants: Applicant[] = [];
  private ambassadors: Ambassador[] = [];
  private events: EventItem[] = [];
  private registrations: EventRegistration[] = [];
  private missions: Mission[] = [];
  private missionSubmissions: MissionSubmission[] = [];
  private rewards: RewardItem[] = [];
  private rewardClaims: RewardClaim[] = [];
  private referrals: ReferralRecord[] = [];
  private certificates: CertificateRecord[] = [];
  private announcements: AnnouncementRecord[] = [];
  private selectionBatches: SelectionBatchRecord[] = [];
  private cmsConfig: CMSConfig = INITIAL_CMS_CONFIG;
  private auditLogs: AuditLogRecord[] = [];

  private listeners: Set<Listener> = new Set();
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') {
      this.loadDefaults();
      return;
    }

    try {
      // Clear legacy storage key if present
      localStorage.removeItem('wla_db_v1');

      const stored = localStorage.getItem('wla_db_v2');
      if (stored) {
        const data = JSON.parse(stored);
        this.applicants = data.applicants || [];
        this.ambassadors = data.ambassadors || [];
        this.events = data.events || [];
        this.registrations = data.registrations || [];
        this.missions = data.missions || [];
        this.missionSubmissions = data.missionSubmissions || [];
        this.rewards = data.rewards || [];
        this.rewardClaims = data.rewardClaims || [];
        this.referrals = data.referrals || [];
        this.certificates = data.certificates || [];
        this.announcements = data.announcements || [];
        this.selectionBatches = data.selectionBatches || [];
        this.cmsConfig = data.cmsConfig || INITIAL_CMS_CONFIG;
        this.auditLogs = data.auditLogs || [];
        this.isInitialized = true;
        return;
      }
    } catch (e) {
      console.warn('Failed to load DB from localStorage, using defaults', e);
    }

    this.loadDefaults();
    this.persist();
  }

  private loadDefaults() {
    this.applicants = [];
    this.ambassadors = [];
    this.events = [];
    this.registrations = [];
    this.missions = [];
    this.missionSubmissions = [];
    this.rewards = [];
    this.rewardClaims = [];
    this.referrals = [];
    this.certificates = [];
    this.announcements = [];
    this.selectionBatches = [];
    this.cmsConfig = JSON.parse(JSON.stringify(INITIAL_CMS_CONFIG));
    this.auditLogs = [];
    this.isInitialized = true;
  }

  private persist() {
    if (typeof window === 'undefined') return;
    try {
      const payload = {
        applicants: this.applicants,
        ambassadors: this.ambassadors,
        events: this.events,
        registrations: this.registrations,
        missions: this.missions,
        missionSubmissions: this.missionSubmissions,
        rewards: this.rewards,
        rewardClaims: this.rewardClaims,
        referrals: this.referrals,
        certificates: this.certificates,
        announcements: this.announcements,
        selectionBatches: this.selectionBatches,
        cmsConfig: this.cmsConfig,
        auditLogs: this.auditLogs,
      };
      localStorage.setItem('wla_db_v2', JSON.stringify(payload));
    } catch (e) {
      console.error('Persistence error:', e);
    }
    this.notify();
  }

  public subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.error(err);
      }
    });
  }

  public clearAllData() {
    this.loadDefaults();
    this.persist();
  }

  public resetToDefaultSeed() {
    this.clearAllData();
  }

  // --- APPLICANTS ---
  public getApplicants(): Applicant[] {
    return [...this.applicants];
  }

  public getApplicantById(id: string): Applicant | undefined {
    return this.applicants.find((a) => a.id === id || a.applicationId === id);
  }

  public getApplicantByEmail(email: string): Applicant | undefined {
    const cleanEmail = email.trim().toLowerCase();
    return this.applicants.find((a) => a.email.trim().toLowerCase() === cleanEmail);
  }

  public createApplicant(data: Omit<Applicant, 'id' | 'applicationId' | 'status' | 'timeline' | 'internalNotes' | 'createdAt' | 'updatedAt'>): Applicant {
    // Check if applicant with same email already exists
    const existing = this.getApplicantByEmail(data.email);
    if (existing) {
      return existing;
    }

    const nextSeq = (this.applicants.length + 1).toString().padStart(5, '0');
    const applicationId = `WLA-2026-${nextSeq}`;
    const now = new Date().toISOString();

    const newApplicant: Applicant = {
      ...data,
      id: `app-${Date.now()}`,
      applicationId,
      status: 'SUBMITTED',
      timeline: [
        {
          status: 'SUBMITTED',
          timestamp: now,
          note: 'Application successfully received by Wonderlight Portal',
          updatedBy: 'System',
        },
      ],
      internalNotes: [],
      createdAt: now,
      updatedAt: now,
    };

    this.applicants.unshift(newApplicant);
    this.addAuditLog('SUBMIT_APPLICATION', 'Applicant', applicationId, 'None', 'SUBMITTED');
    this.persist();
    return newApplicant;
  }

  public updateApplicantStatus(
    applicationId: string,
    newStatus: ApplicationStatus,
    note: string,
    updatedBy: string
  ): Applicant | undefined {
    const applicant = this.applicants.find((a) => a.applicationId === applicationId || a.id === applicationId);
    if (!applicant) return undefined;

    const oldStatus = applicant.status;
    applicant.status = newStatus;
    applicant.updatedAt = new Date().toISOString();
    applicant.timeline.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${newStatus}`,
      updatedBy: updatedBy || 'Administrator',
    });

    // If moved to SELECTED, automatically generate or activate Ambassador profile
    if (newStatus === 'SELECTED') {
      this.provisionAmbassadorFromApplicant(applicant);
    }

    this.addAuditLog('UPDATE_APPLICATION_STATUS', 'Applicant', applicant.applicationId, oldStatus, newStatus);
    this.persist();
    return applicant;
  }

  public evaluateApplicant(applicationId: string, evaluation: Applicant['evaluation']): Applicant | undefined {
    const applicant = this.applicants.find((a) => a.applicationId === applicationId || a.id === applicationId);
    if (!applicant) return undefined;

    applicant.evaluation = evaluation;
    applicant.updatedAt = new Date().toISOString();
    this.addAuditLog('EVALUATE_APPLICANT', 'Applicant', applicant.applicationId, 'Pending', `Score: ${evaluation?.overallScore}/10`);
    this.persist();
    return applicant;
  }

  public addApplicantInternalNote(applicationId: string, note: string): boolean {
    const applicant = this.applicants.find((a) => a.applicationId === applicationId || a.id === applicationId);
    if (!applicant) return false;
    applicant.internalNotes.push(note);
    applicant.updatedAt = new Date().toISOString();
    this.persist();
    return true;
  }

  public markSelectionCelebrationShown(applicantId: string): boolean {
    const applicant = this.applicants.find((a) => a.id === applicantId || a.applicationId === applicantId);
    if (!applicant) return false;
    applicant.selectionCelebrationShown = true;
    this.persist();
    return true;
  }

  public resetSelectionCelebrationShown(applicantId: string): boolean {
    const applicant = this.applicants.find((a) => a.id === applicantId || a.applicationId === applicantId);
    if (!applicant) return false;
    applicant.selectionCelebrationShown = false;
    this.persist();
    return true;
  }

  public markDashboardWelcomeCelebrationShown(ambassadorId: string): boolean {
    const amb = this.ambassadors.find((a) => a.ambassadorId === ambassadorId || a.id === ambassadorId);
    if (amb) {
      const app = this.applicants.find((a) => a.ambassadorId === ambassadorId || a.applicationId === amb.applicationId);
      if (app) app.dashboardWelcomeCelebrationShown = true;
    }
    this.persist();
    return true;
  }

  private provisionAmbassadorFromApplicant(applicant: Applicant) {
    const existing = this.ambassadors.find((amb) => amb.applicationId === applicant.applicationId || amb.email === applicant.email);
    if (existing) {
      applicant.ambassadorId = existing.ambassadorId;
      return;
    }

    const initials = applicant.college
      .split(' ')
      .map((w) => w[0])
      .join('')
      .substring(0, 4)
      .toUpperCase();
    const ambSeq = (this.ambassadors.length + 1).toString().padStart(3, '0');
    const ambassadorId = `WLA-${initials || 'IND'}-${ambSeq}`;
    const now = new Date().toISOString();

    applicant.ambassadorId = ambassadorId;

    const newAmbassador: Ambassador = {
      id: `amb-${Date.now()}`,
      userId: `user-${Date.now()}`,
      ambassadorId,
      applicationId: applicant.applicationId,
      name: applicant.fullName,
      email: applicant.email,
      phone: applicant.phone,
      college: applicant.college,
      campus: `${applicant.city} Campus`,
      city: applicant.city,
      state: applicant.state,
      level: 'EXPLORER',
      xp: 100,
      rank: this.ambassadors.length + 1,
      referralCode: ambassadorId,
      referralLink: `https://wonderlight.adventure/r/${ambassadorId}`,
      stats: {
        clicks: 0,
        leads: 0,
        bookings: 0,
        revenue: 0,
        eventsAttended: 0,
        missionsCompleted: 0,
      },
      status: 'ACTIVE',
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(applicant.fullName)}`,
      joinedAt: now,
      updatedAt: now,
    };

    this.ambassadors.push(newAmbassador);
    this.recalculateRanks();

    // Auto issue Appointment Certificate
    this.generateCertificate({
      recipientName: applicant.fullName,
      ambassadorId,
      college: applicant.college,
      programName: 'Wonderlight Campus Ambassador Program',
      batch: '2026–27',
      certificateType: 'APPOINTMENT',
      signatureName: 'Vikramaditya Sengupta',
      signatureRole: 'Director of Youth Programs & Expeditions',
    });
  }

  // --- AMBASSADORS ---
  public getAmbassadors(): Ambassador[] {
    return [...this.ambassadors].sort((a, b) => b.xp - a.xp);
  }

  public getAmbassadorById(id: string): Ambassador | undefined {
    return this.ambassadors.find((amb) => amb.id === id || amb.ambassadorId === id || amb.email === id || amb.referralCode === id);
  }

  public adjustAmbassadorXP(ambassadorId: string, amount: number, reason: string): Ambassador | undefined {
    const amb = this.ambassadors.find((a) => a.ambassadorId === ambassadorId || a.id === ambassadorId);
    if (!amb) return undefined;

    const oldXP = amb.xp;
    amb.xp = Math.max(0, amb.xp + amount);
    amb.updatedAt = new Date().toISOString();

    // Check automatic level progression
    if (amb.xp >= 5000 && amb.stats.bookings >= 15) {
      amb.level = 'WONDERLIGHT_CAMPUS_STAR';
    } else if (amb.xp >= 2500 && amb.stats.bookings >= 8) {
      amb.level = 'TRAILBLAZER';
    } else if (amb.xp >= 1000 && amb.stats.bookings >= 3) {
      amb.level = 'VOYAGER';
    }

    this.recalculateRanks();
    this.addAuditLog('ADJUST_AMBASSADOR_XP', 'Ambassador', amb.ambassadorId, `${oldXP} XP`, `${amb.xp} XP (${reason})`);
    this.persist();
    return amb;
  }

  public updateAmbassadorLevel(ambassadorId: string, newLevel: AmbassadorLevel): Ambassador | undefined {
    const amb = this.ambassadors.find((a) => a.ambassadorId === ambassadorId || a.id === ambassadorId);
    if (!amb) return undefined;
    const oldLevel = amb.level;
    amb.level = newLevel;
    amb.updatedAt = new Date().toISOString();
    this.addAuditLog('UPDATE_AMBASSADOR_LEVEL', 'Ambassador', amb.ambassadorId, oldLevel, newLevel);
    this.persist();
    return amb;
  }

  public updateAmbassadorStatus(ambassadorId: string, status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE'): Ambassador | undefined {
    const amb = this.ambassadors.find((a) => a.ambassadorId === ambassadorId || a.id === ambassadorId);
    if (!amb) return undefined;
    const oldStatus = amb.status;
    amb.status = status;
    amb.updatedAt = new Date().toISOString();
    this.addAuditLog('UPDATE_AMBASSADOR_STATUS', 'Ambassador', amb.ambassadorId, oldStatus, status);
    this.persist();
    return amb;
  }

  private recalculateRanks() {
    this.ambassadors.sort((a, b) => b.xp - a.xp);
    this.ambassadors.forEach((amb, index) => {
      amb.rank = index + 1;
    });
  }

  // --- EVENTS ---
  public getEvents(): EventItem[] {
    return [...this.events];
  }

  public getEventById(id: string): EventItem | undefined {
    return this.events.find((e) => e.id === id || e.eventId === id);
  }

  public createEvent(data: Omit<EventItem, 'id' | 'eventId' | 'registeredCount' | 'attendedCount' | 'createdAt'>): EventItem {
    const count = this.events.length + 1;
    const eventId = `EVT-2026-${count.toString().padStart(3, '0')}`;
    const newEvent: EventItem = {
      ...data,
      id: `evt-${Date.now()}`,
      eventId,
      registeredCount: 0,
      attendedCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.events.unshift(newEvent);
    this.addAuditLog('CREATE_EVENT', 'Event', eventId, 'None', data.title);
    this.persist();
    return newEvent;
  }

  public updateEvent(eventId: string, data: Partial<EventItem>): EventItem | undefined {
    const ev = this.events.find((e) => e.eventId === eventId || e.id === eventId);
    if (!ev) return undefined;
    Object.assign(ev, data);
    this.persist();
    return ev;
  }

  public deleteEvent(eventId: string): boolean {
    const idx = this.events.findIndex((e) => e.eventId === eventId || e.id === eventId);
    if (idx === -1) return false;
    const deleted = this.events.splice(idx, 1)[0];
    this.addAuditLog('DELETE_EVENT', 'Event', deleted.eventId, deleted.title, 'Deleted');
    this.persist();
    return true;
  }

  // --- EVENT REGISTRATIONS & ATTENDANCE ---
  public getEventRegistrations(eventId?: string): EventRegistration[] {
    if (eventId) {
      return this.registrations.filter((r) => r.eventId === eventId);
    }
    return [...this.registrations];
  }

  public registerForEvent(
    eventId: string,
    attendee: {
      userId: string;
      ambassadorId?: string;
      attendeeName: string;
      email: string;
      phone: string;
      college: string;
    }
  ): { registration: EventRegistration; isNew: boolean } {
    const ev = this.events.find((e) => e.eventId === eventId || e.id === eventId);
    if (!ev) throw new Error('Event not found');

    const existing = this.registrations.find(
      (r) => (r.eventId === eventId || r.eventId === ev.eventId) && (r.email === attendee.email || (attendee.ambassadorId && r.ambassadorId === attendee.ambassadorId))
    );
    if (existing) {
      return { registration: existing, isNew: false };
    }

    const regId = `reg-${Date.now()}`;
    const qrData = `WLA-PASS:${ev.eventId}:${attendee.email}:${Date.now()}`;

    const reg: EventRegistration = {
      id: regId,
      eventId: ev.eventId,
      userId: attendee.userId,
      ambassadorId: attendee.ambassadorId,
      attendeeName: attendee.attendeeName,
      email: attendee.email,
      phone: attendee.phone,
      college: attendee.college,
      qrCodeData: qrData,
      status: 'CONFIRMED',
      registeredAt: new Date().toISOString(),
    };

    this.registrations.unshift(reg);
    ev.registeredCount += 1;

    // Attribute to ambassador stats if ambassador registered
    if (attendee.ambassadorId) {
      const amb = this.ambassadors.find((a) => a.ambassadorId === attendee.ambassadorId);
      if (amb) {
        amb.stats.eventsAttended += 1;
      }
    }

    this.persist();
    return { registration: reg, isNew: true };
  }

  public checkInAttendee(qrOrId: string, checkedInBy: string = 'Event Staff'): { success: boolean; message: string; registration?: EventRegistration } {
    const trimmed = qrOrId.trim();
    const reg = this.registrations.find(
      (r) => r.qrCodeData === trimmed || r.id === trimmed || r.email.toLowerCase() === trimmed.toLowerCase() || (r.ambassadorId && r.ambassadorId.toLowerCase() === trimmed.toLowerCase())
    );

    if (!reg) {
      return { success: false, message: 'Invalid QR Code or registration pass. Record not found.' };
    }

    if (reg.status === 'ATTENDED') {
      return {
        success: false,
        message: `Already checked in at ${new Date(reg.checkedInAt || '').toLocaleTimeString()} by ${reg.checkedInBy || 'Staff'}. Duplicate entry prevented.`,
        registration: reg,
      };
    }

    reg.status = 'ATTENDED';
    reg.checkedInAt = new Date().toISOString();
    reg.checkedInBy = checkedInBy;

    // Update event attended count
    const ev = this.events.find((e) => e.eventId === reg.eventId || e.id === reg.eventId);
    if (ev) {
      ev.attendedCount += 1;
    }

    // Award attendance XP if ambassador
    if (reg.ambassadorId) {
      this.adjustAmbassadorXP(reg.ambassadorId, 150, `Event Attendance: ${ev?.title || reg.eventId}`);
    }

    this.addAuditLog('CHECK_IN_ATTENDEE', 'Registration', reg.id, 'CONFIRMED', `ATTENDED (${reg.attendeeName})`);
    this.persist();
    return { success: true, message: `Check-in successful! Welcome, ${reg.attendeeName}.`, registration: reg };
  }

  // --- MISSIONS & SUBMISSIONS ---
  public getMissions(): Mission[] {
    return [...this.missions];
  }

  public getMissionById(id: string): Mission | undefined {
    return this.missions.find((m) => m.id === id);
  }

  public createMission(data: Omit<Mission, 'id'>): Mission {
    const newMission: Mission = {
      ...data,
      id: `mis-${Date.now()}`,
    };
    this.missions.push(newMission);
    this.addAuditLog('CREATE_MISSION', 'Mission', newMission.id, 'None', data.title);
    this.persist();
    return newMission;
  }

  public getMissionSubmissions(ambassadorId?: string): MissionSubmission[] {
    if (ambassadorId) {
      return this.missionSubmissions.filter((s) => s.ambassadorId === ambassadorId);
    }
    return [...this.missionSubmissions];
  }

  public submitMissionProof(data: {
    missionId: string;
    ambassadorId: string;
    proofUrl?: string;
    proofNotes: string;
  }): MissionSubmission {
    const mission = this.missions.find((m) => m.id === data.missionId);
    if (!mission) throw new Error('Mission not found');

    const amb = this.ambassadors.find((a) => a.ambassadorId === data.ambassadorId);
    const subId = `sub-${Date.now()}`;

    const submission: MissionSubmission = {
      id: subId,
      missionId: mission.id,
      missionTitle: mission.title,
      ambassadorId: data.ambassadorId,
      ambassadorName: amb?.name || 'Ambassador',
      college: amb?.college || '',
      proofUrl: data.proofUrl,
      proofNotes: data.proofNotes,
      status: 'PENDING',
      xpAwarded: 0,
      submittedAt: new Date().toISOString(),
    };

    this.missionSubmissions.unshift(submission);
    this.persist();
    return submission;
  }

  public reviewMissionSubmission(
    submissionId: string,
    status: 'APPROVED' | 'REJECTED',
    notes: string,
    reviewedBy: string
  ): MissionSubmission | undefined {
    const sub = this.missionSubmissions.find((s) => s.id === submissionId);
    if (!sub) return undefined;

    const mission = this.missions.find((m) => m.id === sub.missionId);
    sub.status = status;
    sub.reviewNotes = notes;
    sub.reviewedBy = reviewedBy;
    sub.reviewedAt = new Date().toISOString();

    if (status === 'APPROVED' && mission) {
      sub.xpAwarded = mission.xp;
      this.adjustAmbassadorXP(sub.ambassadorId, mission.xp, `Mission Approved: ${mission.title}`);
      const amb = this.ambassadors.find((a) => a.ambassadorId === sub.ambassadorId);
      if (amb) {
        amb.stats.missionsCompleted += 1;
      }
    }

    this.addAuditLog('REVIEW_MISSION_PROOF', 'MissionSubmission', sub.id, 'PENDING', `${status} by ${reviewedBy}`);
    this.persist();
    return sub;
  }

  // --- REWARDS & CLAIMS ---
  public getRewards(): RewardItem[] {
    return [...this.rewards];
  }

  public createReward(data: Omit<RewardItem, 'id' | 'claimedCount'>): RewardItem {
    const newReward: RewardItem = {
      ...data,
      id: `rew-${Date.now()}`,
      claimedCount: 0,
    };
    this.rewards.push(newReward);
    this.addAuditLog('CREATE_REWARD', 'Reward', newReward.id, 'None', data.title);
    this.persist();
    return newReward;
  }

  public getRewardClaims(ambassadorId?: string): RewardClaim[] {
    if (ambassadorId) {
      return this.rewardClaims.filter((c) => c.ambassadorId === ambassadorId);
    }
    return [...this.rewardClaims];
  }

  public claimReward(
    rewardId: string,
    ambassadorId: string,
    shippingAddress: RewardClaim['shippingAddress']
  ): { success: boolean; message: string; claim?: RewardClaim } {
    const reward = this.rewards.find((r) => r.id === rewardId);
    if (!reward) return { success: false, message: 'Reward not found' };

    const amb = this.ambassadors.find((a) => a.ambassadorId === ambassadorId);
    if (!amb) return { success: false, message: 'Ambassador not found' };

    if (amb.xp < reward.requiredPoints) {
      return { success: false, message: `Insufficient XP. You need ${reward.requiredPoints} XP, but currently have ${amb.xp} XP.` };
    }

    if (reward.stock <= 0) {
      return { success: false, message: 'This reward is currently out of stock.' };
    }

    const claim: RewardClaim = {
      id: `claim-${Date.now()}`,
      rewardId: reward.id,
      rewardTitle: reward.title,
      ambassadorId: amb.ambassadorId,
      ambassadorName: amb.name,
      pointsDeducted: reward.requiredPoints,
      shippingAddress,
      status: 'PENDING',
      claimedAt: new Date().toISOString(),
    };

    reward.stock -= 1;
    reward.claimedCount += 1;
    this.rewardClaims.unshift(claim);

    this.addAuditLog('CLAIM_REWARD', 'RewardClaim', claim.id, 'Available', `Claimed by ${amb.name} (${reward.title})`);
    this.persist();
    return { success: true, message: 'Reward claim submitted successfully! Admin will verify and dispatch.', claim };
  }

  public updateClaimStatus(claimId: string, status: RewardClaim['status'], trackingNumber?: string, processedBy: string = 'Admin'): boolean {
    const claim = this.rewardClaims.find((c) => c.id === claimId);
    if (!claim) return false;

    claim.status = status;
    if (trackingNumber) claim.trackingNumber = trackingNumber;
    claim.processedBy = processedBy;
    claim.processedAt = new Date().toISOString();

    this.addAuditLog('UPDATE_REWARD_CLAIM', 'RewardClaim', claim.id, 'PENDING', `${status} (Tracking: ${trackingNumber || 'N/A'})`);
    this.persist();
    return true;
  }

  // --- REFERRALS & ATTRIBUTION ---
  public getReferrals(ambassadorId?: string): ReferralRecord[] {
    if (ambassadorId) {
      return this.referrals.filter((r) => r.ambassadorId === ambassadorId);
    }
    return [...this.referrals];
  }

  public recordReferralClick(referralCode: string, ip: string = '127.0.0.1', device: string = 'Web Browser'): boolean {
    const amb = this.ambassadors.find((a) => a.referralCode === referralCode || a.ambassadorId === referralCode);
    if (!amb) return false;

    amb.stats.clicks += 1;
    this.referrals.unshift({
      id: `ref-${Date.now()}`,
      ambassadorId: amb.ambassadorId,
      referralCode: amb.referralCode,
      visitorIp: ip,
      visitorDevice: device,
      status: 'CLICK',
      timestamp: new Date().toISOString(),
    });

    this.persist();
    return true;
  }

  public recordReferralLead(data: {
    referralCode: string;
    leadName: string;
    leadEmail: string;
    leadPhone: string;
    tripInterest: string;
  }): boolean {
    const amb = this.ambassadors.find((a) => a.referralCode === data.referralCode || a.ambassadorId === data.referralCode);
    if (!amb) return false;

    amb.stats.leads += 1;
    this.referrals.unshift({
      id: `ref-${Date.now()}`,
      ambassadorId: amb.ambassadorId,
      referralCode: amb.referralCode,
      leadName: data.leadName,
      leadEmail: data.leadEmail,
      leadPhone: data.leadPhone,
      tripInterest: data.tripInterest,
      status: 'LEAD',
      timestamp: new Date().toISOString(),
    });

    // Award lead points
    this.adjustAmbassadorXP(amb.ambassadorId, 25, `Verified Student Lead: ${data.leadName}`);
    this.persist();
    return true;
  }

  public recordReferralBooking(data: {
    referralCode: string;
    leadName: string;
    leadEmail: string;
    leadPhone: string;
    tripInterest: string;
    bookingAmount: number;
  }): boolean {
    const amb = this.ambassadors.find((a) => a.referralCode === data.referralCode || a.ambassadorId === data.referralCode);
    if (!amb) return false;

    // Calculate commission based on level
    let commissionPct = 0.08;
    if (amb.level === 'VOYAGER') commissionPct = 0.10;
    if (amb.level === 'TRAILBLAZER') commissionPct = 0.12;
    if (amb.level === 'WONDERLIGHT_CAMPUS_STAR') commissionPct = 0.15;

    const commissionAmount = Math.round(data.bookingAmount * commissionPct);

    amb.stats.bookings += 1;
    amb.stats.revenue += data.bookingAmount;

    this.referrals.unshift({
      id: `ref-${Date.now()}`,
      ambassadorId: amb.ambassadorId,
      referralCode: amb.referralCode,
      leadName: data.leadName,
      leadEmail: data.leadEmail,
      leadPhone: data.leadPhone,
      tripInterest: data.tripInterest,
      bookingAmount: data.bookingAmount,
      commissionAmount,
      status: 'BOOKED',
      timestamp: new Date().toISOString(),
    });

    // Award booking XP (100 XP per 10,000 booking amount + 200 flat)
    const bonusXP = 200 + Math.round((data.bookingAmount / 10000) * 100);
    this.adjustAmbassadorXP(amb.ambassadorId, bonusXP, `Attributed Booking: ₹${data.bookingAmount} by ${data.leadName}`);

    this.persist();
    return true;
  }

  // --- CERTIFICATES ---
  public getCertificates(ambassadorId?: string): CertificateRecord[] {
    if (ambassadorId) {
      return this.certificates.filter((c) => c.ambassadorId === ambassadorId);
    }
    return [...this.certificates];
  }

  public getCertificateById(certId: string): CertificateRecord | undefined {
    return this.certificates.find((c) => c.certificateId === certId || c.id === certId);
  }

  public generateCertificate(data: {
    recipientName: string;
    ambassadorId: string;
    college: string;
    programName: string;
    batch: string;
    certificateType: CertificateRecord['certificateType'];
    signatureName: string;
    signatureRole: string;
  }): CertificateRecord {
    const randomHex = Math.random().toString(16).substring(2, 10);
    const count = this.certificates.length + 1;
    const certificateId = `WLA-CERT-2026-${count.toString().padStart(2, '0')}`;
    const hash = `hash_${certificateId}_${randomHex}`;
    const qrVerificationUrl = `https://wonderlight.adventure/campus-ambassador/certificate/${certificateId}`;

    const newCert: CertificateRecord = {
      id: `cert-${Date.now()}`,
      certificateId,
      recipientName: data.recipientName,
      ambassadorId: data.ambassadorId,
      college: data.college,
      programName: data.programName,
      batch: data.batch,
      issueDate: new Date().toISOString().split('T')[0],
      certificateType: data.certificateType,
      signatureName: data.signatureName,
      signatureRole: data.signatureRole,
      verificationHash: hash,
      qrVerificationUrl,
      isRevoked: false,
    };

    this.certificates.unshift(newCert);
    this.addAuditLog('ISSUE_CERTIFICATE', 'Certificate', certificateId, 'None', `${data.certificateType} issued to ${data.recipientName}`);
    this.persist();
    return newCert;
  }

  public revokeCertificate(certId: string): boolean {
    const cert = this.certificates.find((c) => c.certificateId === certId || c.id === certId);
    if (!cert) return false;
    cert.isRevoked = true;
    this.addAuditLog('REVOKE_CERTIFICATE', 'Certificate', cert.certificateId, 'Valid', 'Revoked');
    this.persist();
    return true;
  }

  // --- ANNOUNCEMENTS ---
  public getAnnouncements(): AnnouncementRecord[] {
    return [...this.announcements];
  }

  public createAnnouncement(data: Omit<AnnouncementRecord, 'id' | 'createdAt'>): AnnouncementRecord {
    const newAnn: AnnouncementRecord = {
      ...data,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.announcements.unshift(newAnn);
    this.addAuditLog('PUBLISH_ANNOUNCEMENT', 'Announcement', newAnn.id, 'None', data.title);
    this.persist();
    return newAnn;
  }

  // --- SELECTION BATCHES ---
  public getSelectionBatches(): SelectionBatchRecord[] {
    return [...this.selectionBatches];
  }

  public createSelectionBatch(data: Omit<SelectionBatchRecord, 'id'>): SelectionBatchRecord {
    const newBatch: SelectionBatchRecord = {
      ...data,
      id: `batch-${Date.now()}`,
    };
    this.selectionBatches.unshift(newBatch);
    this.addAuditLog('CREATE_SELECTION_BATCH', 'SelectionBatch', newBatch.id, 'None', data.title);
    this.persist();
    return newBatch;
  }

  public updateBatchPDF(batchId: string, pdfUrl?: string, pdfFileName?: string): boolean {
    const b = this.selectionBatches.find((item) => item.id === batchId);
    if (!b) return false;
    b.pdfUrl = pdfUrl;
    b.pdfFileName = pdfFileName;
    this.addAuditLog('UPDATE_BATCH_PDF', 'SelectionBatch', b.id, 'PDF Updated', pdfFileName || 'Removed');
    this.persist();
    return true;
  }

  public publishBatch(batchId: string, isPublished: boolean): boolean {
    const b = this.selectionBatches.find((item) => item.id === batchId);
    if (!b) return false;
    b.isPublished = isPublished;
    this.addAuditLog('TOGGLE_BATCH_PUBLISHED', 'SelectionBatch', b.id, (!isPublished).toString(), isPublished.toString());
    this.persist();
    return true;
  }

  public deleteSelectionBatch(batchId: string): boolean {
    const index = this.selectionBatches.findIndex((item) => item.id === batchId);
    if (index === -1) return false;
    const removed = this.selectionBatches.splice(index, 1)[0];
    this.addAuditLog('DELETE_SELECTION_BATCH', 'SelectionBatch', batchId, removed.title, 'Deleted');
    this.persist();
    return true;
  }

  // --- CMS ---
  public getCMSConfig(): CMSConfig {
    return {
      ...this.cmsConfig,
      applicationsOpen: this.cmsConfig.applicationsOpen !== undefined ? this.cmsConfig.applicationsOpen : true,
    };
  }

  public updateCMSConfig(config: Partial<CMSConfig>): CMSConfig {
    this.cmsConfig = { ...this.cmsConfig, ...config };
    this.addAuditLog('UPDATE_CMS_CONFIG', 'CMS', 'global', 'Updated', 'Saved');
    this.persist();
    return this.cmsConfig;
  }

  // --- AUDIT LOGS ---
  public getAuditLogs(): AuditLogRecord[] {
    return [...this.auditLogs];
  }

  public addAuditLog(action: string, entityType: string, entityId: string, oldValue?: string, newValue?: string) {
    this.auditLogs.unshift({
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actorId: 'admin-current',
      actorEmail: 'admin@wonderlight.adventure',
      action,
      entityType,
      entityId,
      oldValue,
      newValue,
      ip: '103.44.11.2',
    });
  }
}

export const dbService = new DatabaseService();
