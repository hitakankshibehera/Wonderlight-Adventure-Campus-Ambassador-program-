import {
  Applicant,
  Ambassador,
  EventItem,
  Mission,
  RewardItem,
  ReferralRecord,
  CertificateRecord,
  AnnouncementRecord,
  SelectionBatchRecord,
  CMSConfig,
  AuditLogRecord,
  AmbassadorLevelConfig,
} from '@/types';

export const LEVEL_CONFIGS: Record<string, AmbassadorLevelConfig> = {
  EXPLORER: {
    level: 'EXPLORER',
    name: 'Explorer',
    minPoints: 0,
    minBookings: 0,
    badge: '🧭',
    reward: 'Explorer Starter Kit & Digital Certificate',
    color: 'from-emerald-500 to-teal-700',
    benefits: [
      'Official Ambassador Welcome Kit',
      'Personalized Referral Code & QR',
      'Access to Campus Mission Portal',
      'Earn 8% Commission on Bookings',
      'Exclusive Campus Travel Merch',
    ],
  },
  VOYAGER: {
    level: 'VOYAGER',
    name: 'Voyager',
    minPoints: 1000,
    minBookings: 3,
    badge: '⚡',
    reward: 'Voyager Travel Duffel & ₹2,000 Travel Credits',
    color: 'from-cyan-500 to-blue-700',
    benefits: [
      'Everything in Explorer',
      '10% Commission on Travel Bookings',
      'Free Access to Regional Travel Meets',
      'Feature on Wonderlight Socials',
      'Quarterly Networking with Travel Founders',
    ],
  },
  TRAILBLAZER: {
    level: 'TRAILBLAZER',
    name: 'Trailblazer',
    minPoints: 2500,
    minBookings: 8,
    badge: '🔥',
    reward: 'Sponsored Weekend Trip & 4K Action Cam',
    color: 'from-amber-500 to-orange-700',
    benefits: [
      'Everything in Voyager',
      '12% Commission on Bookings',
      'Official Executive LOR from Leadership',
      'Host Paid Workshops on Campus',
      'Priority Lead Routing for Your City',
    ],
  },
  WONDERLIGHT_CAMPUS_STAR: {
    level: 'WONDERLIGHT_CAMPUS_STAR',
    name: 'Wonderlight Campus Star',
    minPoints: 5000,
    minBookings: 15,
    badge: '👑',
    reward: 'Fully Sponsored Himalayan Expedition & Trophy',
    color: 'from-yellow-400 to-amber-600',
    benefits: [
      'All Previous Tier Perks',
      '15% Top Tier Booking Royalty',
      'Pre-Placement Interview (PPI) with Wonderlight',
      'Annual National Conclave VIP Pass',
      'Lead Regional College Delegations',
    ],
  },
};

// Start 100% Fresh with Empty Data Arrays
export const INITIAL_APPLICANTS: Applicant[] = [];
export const INITIAL_AMBASSADORS: Ambassador[] = [];
export const INITIAL_EVENTS: EventItem[] = [];
export const INITIAL_MISSIONS: Mission[] = [];
export const INITIAL_REWARDS: RewardItem[] = [];
export const INITIAL_REFERRALS: ReferralRecord[] = [];
export const INITIAL_CERTIFICATES: CertificateRecord[] = [];
export const INITIAL_ANNOUNCEMENTS: AnnouncementRecord[] = [];
export const INITIAL_SELECTION_BATCHES: SelectionBatchRecord[] = [];
export const INITIAL_AUDIT_LOGS: AuditLogRecord[] = [];

export const INITIAL_CMS_CONFIG: CMSConfig = {
  applicationsOpen: true,
  heroHeadline: 'WONDERLIGHT CAMPUS AMBASSADOR PROGRAM',
  heroSubheadline: 'Travel. Lead. Explore. Earn.',
  primaryTagline: 'Become the official student representative of Wonderlight Adventure at your campus.',
  secondaryTagline: 'Gain leadership experience, earn travel credits, and unlock sponsored expeditions.',
  programBatch: '2026–27',
  applicationDeadline: '2026-10-31',
  contactEmail: 'wonderlightadventure@gmail.com',
  contactPhone: '+91 98765 43210',
  faqItems: [],
  sections: {
    hero: true,
    about: true,
    whatTheyDo: true,
    benefits: true,
    howItWorks: true,
    levels: true,
    missions: true,
    events: true,
    leaderboard: true,
    gallery: true,
    faq: true,
    cta: true,
  },
};
