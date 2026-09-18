export type Role =
  | 'SUPER_ADMIN'
  | 'PROGRAM_MANAGER'
  | 'EVENT_MANAGER'
  | 'MARKETING_MANAGER'
  | 'FINANCE_MANAGER'
  | 'MODERATOR'
  | 'AMBASSADOR'
  | 'APPLICANT';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  photoURL?: string;
  collegeId?: string;
  ambassadorId?: string;
  applicationId?: string;
  createdAt: string;
}

export type ApplicationStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'INTERVIEW'
  | 'SELECTED'
  | 'WAITLISTED'
  | 'NOT_SELECTED'
  | 'WITHDRAWN';

export interface ApplicantTimelineEntry {
  status: ApplicationStatus;
  timestamp: string;
  note: string;
  updatedBy: string;
}

export interface ApplicantEvaluation {
  leadershipScore: number;
  communicationScore: number;
  networkScore: number;
  overallScore: number;
  evaluatorName: string;
  evaluatorRole: string;
  recommendation: 'STRONG_HIRE' | 'HIRE' | 'NEUTRAL' | 'DO_NOT_HIRE';
  notes: string;
  evaluatedAt: string;
}

export interface Applicant {
  id: string;
  applicationId: string; // e.g. WLA-2026-1024
  ambassadorId?: string;
  fullName: string;
  email: string;
  phone: string;
  dob?: string;
  gender?: string;
  college: string;
  university: string;
  city: string;
  state: string;
  course: string;
  department: string;
  year: string; // e.g. 2nd Year
  graduationYear: string; // e.g. 2027
  instagram: string;
  linkedin: string;
  otherProfile?: string;
  previousAmbassadorExp: string;
  eventExp: string;
  marketingExp: string;
  leadershipExp: string;
  motivation: string;
  promotionStrategy: string;
  networkSize: string;
  termsAccepted: boolean;
  status: ApplicationStatus;
  timeline: ApplicantTimelineEntry[];
  internalNotes: string[];
  evaluation?: ApplicantEvaluation;
  selectionCelebrationShown?: boolean;
  dashboardWelcomeCelebrationShown?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AmbassadorLevel =
  | 'EXPLORER'
  | 'VOYAGER'
  | 'TRAILBLAZER'
  | 'WONDERLIGHT_CAMPUS_STAR';

export interface AmbassadorStats {
  clicks: number;
  leads: number;
  bookings: number;
  revenue: number;
  eventsAttended: number;
  missionsCompleted: number;
}

export interface Ambassador {
  id: string;
  userId: string;
  ambassadorId: string; // e.g. WLA-KIIT-024
  applicationId: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  campus: string;
  city: string;
  state: string;
  level: AmbassadorLevel;
  xp: number;
  rank: number;
  referralCode: string; // e.g. WLA-KIIT-024
  referralLink: string;
  stats: AmbassadorStats;
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  avatarUrl?: string;
  joinedAt: string;
  updatedAt: string;
}

export interface AmbassadorLevelConfig {
  level: AmbassadorLevel;
  name: string;
  minPoints: number;
  minBookings: number;
  badge: string;
  reward: string;
  color: string;
  benefits: string[];
}

export type EventCategory =
  | 'Travel Meetup'
  | 'Workshop'
  | 'Seminar'
  | 'Competition'
  | 'Photography Contest'
  | 'Reel Challenge'
  | 'Travel Quiz'
  | 'Campus Drive'
  | 'Ambassador Meet'
  | 'Group Trip'
  | 'Webinar'
  | 'Adventure Activity';

export interface EventScheduleItem {
  time: string;
  activity: string;
}

export interface EventItem {
  id: string;
  eventId: string; // e.g. EVT-2026-001
  title: string;
  category: EventCategory;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  venue: string;
  city: string;
  state: string;
  capacity: number;
  registeredCount: number;
  attendedCount: number;
  registrationStatus: 'OPEN' | 'CLOSING_SOON' | 'CLOSED' | 'COMPLETED';
  banner: string;
  gallery: string[];
  rules: string[];
  schedule: EventScheduleItem[];
  prizes: string[];
  organizer: string;
  sponsors?: string[];
  isFeatured?: boolean;
  createdAt: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  ambassadorId?: string;
  attendeeName: string;
  email: string;
  phone: string;
  college: string;
  qrCodeData: string;
  status: 'CONFIRMED' | 'ATTENDED' | 'CANCELLED' | 'WAITLISTED';
  registeredAt: string;
  checkedInAt?: string;
  checkedInBy?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  xp: number;
  category: 'CONTENT' | 'COMMUNITY' | 'REFERRAL' | 'EVENT' | 'BRAND';
  startDate: string;
  endDate: string;
  eligibilityLevel: 'ALL' | AmbassadorLevel;
  status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED';
  requirements: string[];
  submissionType: 'LINK' | 'IMAGE' | 'TEXT';
  maxSubmissions?: number;
}

export interface MissionSubmission {
  id: string;
  missionId: string;
  missionTitle: string;
  ambassadorId: string;
  ambassadorName: string;
  college: string;
  proofUrl?: string;
  proofNotes: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  xpAwarded: number;
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  submittedAt: string;
}

export type RewardCategory =
  | 'CERTIFICATE'
  | 'MERCHANDISE'
  | 'TRAVEL_VOUCHER'
  | 'EXPERIENCE'
  | 'GADGET';

export type RewardStatus =
  | 'AVAILABLE'
  | 'OUT_OF_STOCK'
  | 'ARCHIVED';

export interface RewardItem {
  id: string;
  title: string;
  category: RewardCategory;
  description: string;
  requiredPoints: number;
  requiredLevel: AmbassadorLevel;
  stock: number;
  claimedCount: number;
  status: RewardStatus;
  image: string;
  badge: string;
  valueDescription: string;
}

export interface RewardClaim {
  id: string;
  rewardId: string;
  rewardTitle: string;
  ambassadorId: string;
  ambassadorName: string;
  pointsDeducted: number;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  };
  status: 'PENDING' | 'APPROVED' | 'FULFILLED' | 'REJECTED';
  trackingNumber?: string;
  claimedAt: string;
  processedAt?: string;
  processedBy?: string;
}

export interface ReferralRecord {
  id: string;
  ambassadorId: string;
  referralCode: string;
  visitorIp?: string;
  visitorDevice?: string;
  leadName?: string;
  leadEmail?: string;
  leadPhone?: string;
  tripInterest?: string;
  bookingAmount?: number;
  commissionAmount?: number;
  status: 'CLICK' | 'LEAD' | 'BOOKED' | 'CANCELLED';
  timestamp: string;
}

export interface CertificateRecord {
  id: string;
  certificateId: string; // e.g. WLA-CERT-2026-4401
  recipientName: string;
  ambassadorId: string;
  college: string;
  programName: string;
  batch: string;
  issueDate: string;
  certificateType: 'APPOINTMENT' | 'EXCELLENCE' | 'COMPLETION' | 'STAR_PERFORMER';
  signatureName: string;
  signatureRole: string;
  verificationHash: string;
  qrVerificationUrl: string;
  isRevoked: boolean;
}

export interface AnnouncementRecord {
  id: string;
  title: string;
  content: string;
  category: 'PROGRAM' | 'EVENT' | 'MISSION' | 'REWARD' | 'URGENT';
  targetAudience: 'ALL' | 'LEVEL' | 'COLLEGE' | 'EVENT';
  targetFilter?: string;
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  isPublished: boolean;
  createdAt: string;
  authorName: string;
}

export interface SelectionBatchRecord {
  id: string;
  title: string;
  batch: string; // e.g. "2026-27"
  resultDate: string;
  description: string;
  selectedCount: number;
  isPublished: boolean;
  bannerUrl?: string;
  pdfUrl?: string;
  pdfFileName?: string;
  selectedAmbassadorIds: string[];
}

export interface CMSSectionToggles {
  hero: boolean;
  about: boolean;
  whatTheyDo: boolean;
  benefits: boolean;
  howItWorks: boolean;
  levels: boolean;
  missions: boolean;
  events: boolean;
  leaderboard: boolean;
  gallery: boolean;
  faq: boolean;
  cta: boolean;
}

export interface CMSConfig {
  applicationsOpen: boolean;
  sections: CMSSectionToggles;
  heroHeadline: string;
  heroSubheadline: string;
  primaryTagline: string;
  secondaryTagline: string;
  programBatch: string;
  applicationDeadline: string;
  contactEmail: string;
  contactPhone: string;
  faqItems: Array<{ id: string; question: string; answer: string; category: string }>;
  celebrationConfig?: {
    enabled: boolean;
    durationSeconds: number;
    particleDensity: 'LOW' | 'MEDIUM' | 'HIGH';
    celebrationMessage: string;
    batch: string;
  };
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  actorId: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValue?: string;
  newValue?: string;
  ip?: string;
}
