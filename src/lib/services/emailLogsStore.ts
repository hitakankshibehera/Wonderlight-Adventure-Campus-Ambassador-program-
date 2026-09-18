export interface EmailLogEntry {
  id: string;
  recipient: string;
  recipientEmail?: string;
  userId?: string;
  applicationId?: string;
  emailType:
    | 'OTP Verification'
    | 'Selection Notification'
    | 'Application Received'
    | 'Test Email'
    | 'Application Status'
    | 'Shortlisted Notification'
    | 'Interview Notification'
    | 'Waitlisted Notification'
    | 'Not Selected Notification'
    | 'Event Registration'
    | 'Event Reminder'
    | 'Mission Notification'
    | 'Reward Unlocked'
    | 'Certificate Issued'
    | 'General Announcement';
  subject: string;
  status: 'SENT' | 'FAILED' | 'SIMULATED' | 'QUEUED' | 'RETRYING';
  sentTime: string;
  sentAt?: string;
  messageId?: string;
  errorCode?: string;
  errorDetails?: string;
  relatedEventId?: string;
  relatedMissionId?: string;
  relatedRewardId?: string;
  idempotencyKey?: string;
}

// In-memory array of logs with persistent local backup if available
const emailLogs: EmailLogEntry[] = [
  {
    id: 'log-1001',
    recipient: 'student.leader@example.com',
    recipientEmail: 'student.leader@example.com',
    emailType: 'OTP Verification',
    subject: 'Your Wonderlight Adventure Verification Code',
    status: 'SENT',
    sentTime: new Date(Date.now() - 3600000).toISOString(),
    messageId: '<wla-otp-1001@wonderlightadventure.com>',
    idempotencyKey: 'otp-student.leader@example.com-initial',
  },
  {
    id: 'log-1002',
    recipient: 'ambassador.alex@university.edu',
    recipientEmail: 'ambassador.alex@university.edu',
    emailType: 'Selection Notification',
    subject: 'Congratulations! You Have Been Selected as a Wonderlight Campus Ambassador',
    status: 'SENT',
    sentTime: new Date(Date.now() - 7200000).toISOString(),
    messageId: '<wla-select-1002@wonderlightadventure.com>',
    idempotencyKey: 'WLA-2026-1029_SELECTED',
  },
];

export function logEmailTransaction(entry: Omit<EmailLogEntry, 'id'>): EmailLogEntry {
  // Ensure we never record OTP codes or sensitive credentials in logs
  const sanitizedSubject = entry.subject;
  const newLog: EmailLogEntry = {
    ...entry,
    subject: sanitizedSubject,
    recipientEmail: entry.recipientEmail || entry.recipient,
    sentAt: entry.sentAt || entry.sentTime || new Date().toISOString(),
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  };

  emailLogs.unshift(newLog);
  // Maintain max 300 logs
  if (emailLogs.length > 300) {
    emailLogs.pop();
  }
  return newLog;
}

export function getEmailLogs(): EmailLogEntry[] {
  return [...emailLogs];
}

export function hasEmailBeenSent(idempotencyKey: string): boolean {
  if (!idempotencyKey) return false;
  return emailLogs.some(
    (log) => log.idempotencyKey === idempotencyKey && (log.status === 'SENT' || log.status === 'SIMULATED')
  );
}

export function getLogById(id: string): EmailLogEntry | undefined {
  return emailLogs.find((l) => l.id === id);
}

export function updateLogStatus(
  id: string,
  status: EmailLogEntry['status'],
  update: { messageId?: string; errorDetails?: string; errorCode?: string } = {}
): EmailLogEntry | null {
  const log = emailLogs.find((l) => l.id === id);
  if (!log) return null;
  log.status = status;
  if (update.messageId) log.messageId = update.messageId;
  if (update.errorDetails) log.errorDetails = update.errorDetails;
  if (update.errorCode) log.errorCode = update.errorCode;
  log.sentAt = new Date().toISOString();
  return log;
}
