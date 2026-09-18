export interface EmailLogEntry {
  id: string;
  recipient: string;
  emailType:
    | 'OTP Verification'
    | 'Selection Notification'
    | 'Application Received'
    | 'Test Email'
    | 'Application Status'
    | 'Event Registration'
    | 'Certificate Issued'
    | 'General Announcement';
  subject: string;
  status: 'SENT' | 'FAILED' | 'SIMULATED' | 'QUEUED';
  sentTime: string;
  messageId?: string;
  errorDetails?: string;
}

// In-memory array of logs (seeded with sample initial logs)
const emailLogs: EmailLogEntry[] = [
  {
    id: 'log-1001',
    recipient: 'student.leader@example.com',
    emailType: 'OTP Verification',
    subject: 'Your Wonderlight Adventure Verification Code',
    status: 'SENT',
    sentTime: new Date(Date.now() - 3600000).toISOString(),
    messageId: '<wla-otp-1001@wonderlightadventure.com>',
  },
  {
    id: 'log-1002',
    recipient: 'ambassador.alex@university.edu',
    emailType: 'Selection Notification',
    subject: 'Congratulations! You Have Been Selected as a Wonderlight Campus Ambassador',
    status: 'SENT',
    sentTime: new Date(Date.now() - 7200000).toISOString(),
    messageId: '<wla-select-1002@wonderlightadventure.com>',
  },
];

export function logEmailTransaction(entry: Omit<EmailLogEntry, 'id'>): EmailLogEntry {
  const newLog: EmailLogEntry = {
    ...entry,
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  };
  emailLogs.unshift(newLog);
  // Keep last 200 logs
  if (emailLogs.length > 200) {
    emailLogs.pop();
  }
  return newLog;
}

export function getEmailLogs(): EmailLogEntry[] {
  return [...emailLogs];
}
