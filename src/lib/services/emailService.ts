import nodemailer from 'nodemailer';
import { logEmailTransaction, hasEmailBeenSent } from './emailLogsStore';
import {
  generateApplicationConfirmationTemplate,
  generateShortlistedTemplate,
  generateInterviewTemplate,
  generateSelectedTemplate,
  generateWaitlistedTemplate,
  generateNotSelectedTemplate,
  generateEventRegistrationTemplate,
  generateEventReminderTemplate,
  generateMissionTemplate,
  generateRewardTemplate,
  generateCertificateTemplate,
  ApplicationConfirmationData,
  ShortlistedData,
  InterviewData,
  SelectedData,
  WaitlistedData,
  NotSelectedData,
  EventRegistrationData,
  EventReminderData,
  MissionData,
  RewardData,
  CertificateData,
} from '@/lib/email/templates';

export interface EmailResult {
  success: boolean;
  simulated?: boolean;
  message?: string;
  error?: string;
  messageId?: string;
}

function getTransporter() {
  const companyEmail = (process.env.EMAIL_FROM || process.env.COMPANY_EMAIL || 'wonderlightadventure@gmail.com').trim();
  const rawPassword = process.env.SMTP_PASSWORD || process.env.GMAIL_APP_PASSWORD || '';
  const smtpPassword = rawPassword.replace(/\s+/g, '').trim();
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);

  if (!smtpPassword || smtpPassword === 'demo_pass_placeholder') {
    return null;
  }

  // If connecting to Gmail
  if (smtpHost.includes('gmail')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: companyEmail,
        pass: smtpPassword,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: companyEmail,
      pass: smtpPassword,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

function getSenderInfo() {
  const companyEmail = (process.env.EMAIL_FROM || process.env.COMPANY_EMAIL || 'wonderlightadventure@gmail.com').trim();
  const companyName = process.env.EMAIL_FROM_NAME || 'Wonderlight Adventure';
  return { companyEmail, companyName, fromString: `"${companyName}" <${companyEmail}>` };
}

/**
 * 1. SEND OTP EMAIL
 */
export async function sendOtpEmail(email: string, otp: string): Promise<EmailResult> {
  const { companyEmail, fromString } = getSenderInfo();
  const subject = 'Your Wonderlight Adventure Verification Code';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050811; color: #f3f4f6; margin: 0; padding: 24px; }
        .container { max-width: 500px; margin: 0 auto; background: #0f172a; border-radius: 20px; border: 1px solid #1e293b; padding: 36px; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
        .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #1e293b; }
        .brand { font-size: 11px; font-weight: 800; color: #10b981; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
        .title { font-size: 20px; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: 0.5px; }
        .content { text-align: center; padding: 28px 0; }
        .salutation { font-size: 15px; color: #e2e8f0; margin-bottom: 12px; }
        .message { font-size: 14px; color: #94a3b8; line-height: 1.6; margin-bottom: 24px; }
        .otp-box { font-size: 38px; font-weight: 900; font-family: 'Courier New', Consolas, monospace; letter-spacing: 14px; color: #34d399; background: #070b14; border: 1px solid #10b981; padding: 18px 28px; border-radius: 16px; display: inline-block; margin: 8px 0 20px 0; box-shadow: inset 0 2px 10px rgba(16, 185, 129, 0.15); }
        .warning { font-size: 12px; color: #f59e0b; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); padding: 10px 16px; border-radius: 10px; margin-top: 16px; display: inline-block; }
        .footer { text-align: center; border-top: 1px solid #1e293b; padding-top: 20px; font-size: 11px; color: #64748b; margin-top: 20px; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="brand">WONDERLIGHT ADVENTURE</div>
          <h2 class="title">CAMPUS AMBASSADOR PROGRAM</h2>
        </div>
        <div class="content">
          <p class="salutation">Hello Student Leader,</p>
          <p class="message">Use the 4-digit verification code below to continue your Wonderlight Campus Ambassador application:</p>
          <div class="otp-box">${otp}</div>
          <br>
          <div class="warning">🔒 This code expires in 5 minutes. Never share this code with anyone.</div>
        </div>
        <div class="footer">
          <p>Sent from <strong>${companyEmail}</strong></p>
          <p>© 2026 Wonderlight Adventure India. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const transporter = getTransporter();

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: fromString,
        to: email,
        subject,
        html,
      });

      logEmailTransaction({
        recipient: email,
        emailType: 'OTP Verification',
        subject,
        status: 'SENT',
        sentTime: new Date().toISOString(),
        messageId: info.messageId,
      });

      return { success: true, messageId: info.messageId, message: `Email dispatched to ${email}` };
    } catch (err: any) {
      console.error('Failed sending real OTP email:', err);
      logEmailTransaction({
        recipient: email,
        emailType: 'OTP Verification',
        subject,
        status: 'FAILED',
        sentTime: new Date().toISOString(),
        errorDetails: err?.message || 'SMTP dispatch error',
      });
      return {
        success: true,
        simulated: true,
        message: `OTP generated for ${email}.`,
      };
    }
  }

  logEmailTransaction({
    recipient: email,
    emailType: 'OTP Verification',
    subject,
    status: 'SIMULATED',
    sentTime: new Date().toISOString(),
    messageId: `<simulated-otp-${Date.now()}@wonderlightadventure.com>`,
  });

  return {
    success: true,
    simulated: true,
    message: `Verification code generated for ${email}.`,
  };
}

export const sendOTPEmail = sendOtpEmail;

/**
 * 2. SEND APPLICATION CONFIRMATION EMAIL
 */
export async function sendApplicationConfirmationEmail(data: ApplicationConfirmationData): Promise<EmailResult> {
  const idempotencyKey = `${data.applicationId}_APPLICATION_CONFIRMATION`;
  if (hasEmailBeenSent(idempotencyKey)) {
    return { success: true, message: 'Application confirmation email already sent previously.' };
  }

  const { fromString } = getSenderInfo();
  const { subject, html } = generateApplicationConfirmationTemplate(data);
  const transporter = getTransporter();

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: fromString,
        to: data.email,
        subject,
        html,
      });

      logEmailTransaction({
        recipient: data.email,
        applicationId: data.applicationId,
        emailType: 'Application Received',
        subject,
        status: 'SENT',
        sentTime: new Date().toISOString(),
        messageId: info.messageId,
        idempotencyKey,
      });

      return { success: true, messageId: info.messageId, message: `Application confirmation sent to ${data.email}` };
    } catch (err: any) {
      logEmailTransaction({
        recipient: data.email,
        applicationId: data.applicationId,
        emailType: 'Application Received',
        subject,
        status: 'FAILED',
        sentTime: new Date().toISOString(),
        errorDetails: err?.message,
        idempotencyKey,
      });
      return { success: false, error: err?.message };
    }
  }

  logEmailTransaction({
    recipient: data.email,
    applicationId: data.applicationId,
    emailType: 'Application Received',
    subject,
    status: 'SIMULATED',
    sentTime: new Date().toISOString(),
    messageId: `<simulated-app-${Date.now()}@wonderlightadventure.com>`,
    idempotencyKey,
  });

  return { success: true, simulated: true };
}

export const sendApplicationReceivedEmail = sendApplicationConfirmationEmail;

/**
 * 3. SEND SHORTLISTED EMAIL
 */
export async function sendShortlistedEmail(data: ShortlistedData): Promise<EmailResult> {
  const idempotencyKey = `${data.applicationId}_SHORTLISTED`;
  if (hasEmailBeenSent(idempotencyKey)) {
    return { success: true, message: 'Shortlisted email already sent.' };
  }

  const { fromString } = getSenderInfo();
  const { subject, html } = generateShortlistedTemplate(data);
  const transporter = getTransporter();

  if (transporter) {
    try {
      const info = await transporter.sendMail({ from: fromString, to: data.email, subject, html });
      logEmailTransaction({
        recipient: data.email,
        applicationId: data.applicationId,
        emailType: 'Shortlisted Notification',
        subject,
        status: 'SENT',
        sentTime: new Date().toISOString(),
        messageId: info.messageId,
        idempotencyKey,
      });
      return { success: true, messageId: info.messageId, message: `Shortlisted email sent to ${data.email}` };
    } catch (err: any) {
      logEmailTransaction({
        recipient: data.email,
        applicationId: data.applicationId,
        emailType: 'Shortlisted Notification',
        subject,
        status: 'FAILED',
        sentTime: new Date().toISOString(),
        errorDetails: err?.message,
        idempotencyKey,
      });
      return { success: false, error: err?.message };
    }
  }

  logEmailTransaction({
    recipient: data.email,
    applicationId: data.applicationId,
    emailType: 'Shortlisted Notification',
    subject,
    status: 'SIMULATED',
    sentTime: new Date().toISOString(),
    idempotencyKey,
  });
  return { success: true, simulated: true };
}

/**
 * 4. SEND INTERVIEW EMAIL
 */
export async function sendInterviewEmail(data: InterviewData): Promise<EmailResult> {
  const idempotencyKey = `${data.applicationId}_INTERVIEW`;
  if (hasEmailBeenSent(idempotencyKey)) {
    return { success: true, message: 'Interview email already sent.' };
  }

  const { fromString } = getSenderInfo();
  const { subject, html } = generateInterviewTemplate(data);
  const transporter = getTransporter();

  if (transporter) {
    try {
      const info = await transporter.sendMail({ from: fromString, to: data.email, subject, html });
      logEmailTransaction({
        recipient: data.email,
        applicationId: data.applicationId,
        emailType: 'Interview Notification',
        subject,
        status: 'SENT',
        sentTime: new Date().toISOString(),
        messageId: info.messageId,
        idempotencyKey,
      });
      return { success: true, messageId: info.messageId, message: `Interview email sent to ${data.email}` };
    } catch (err: any) {
      logEmailTransaction({
        recipient: data.email,
        applicationId: data.applicationId,
        emailType: 'Interview Notification',
        subject,
        status: 'FAILED',
        sentTime: new Date().toISOString(),
        errorDetails: err?.message,
        idempotencyKey,
      });
      return { success: false, error: err?.message };
    }
  }

  logEmailTransaction({
    recipient: data.email,
    applicationId: data.applicationId,
    emailType: 'Interview Notification',
    subject,
    status: 'SIMULATED',
    sentTime: new Date().toISOString(),
    idempotencyKey,
  });
  return { success: true, simulated: true };
}

/**
 * 5. SEND SELECTED EMAIL
 */
export async function sendSelectedEmail(data: SelectedData): Promise<EmailResult> {
  const idempotencyKey = `${data.ambassadorId || data.email}_SELECTED`;
  if (hasEmailBeenSent(idempotencyKey)) {
    return { success: true, message: 'Selection email already sent.' };
  }

  const { fromString } = getSenderInfo();
  const { subject, html } = generateSelectedTemplate(data);
  const transporter = getTransporter();

  if (transporter) {
    try {
      const info = await transporter.sendMail({ from: fromString, to: data.email, subject, html });
      logEmailTransaction({
        recipient: data.email,
        applicationId: data.ambassadorId,
        emailType: 'Selection Notification',
        subject,
        status: 'SENT',
        sentTime: new Date().toISOString(),
        messageId: info.messageId,
        idempotencyKey,
      });
      return { success: true, messageId: info.messageId, message: `Selection email sent to ${data.email}` };
    } catch (err: any) {
      logEmailTransaction({
        recipient: data.email,
        applicationId: data.ambassadorId,
        emailType: 'Selection Notification',
        subject,
        status: 'FAILED',
        sentTime: new Date().toISOString(),
        errorDetails: err?.message,
        idempotencyKey,
      });
      return { success: false, error: err?.message };
    }
  }

  logEmailTransaction({
    recipient: data.email,
    applicationId: data.ambassadorId,
    emailType: 'Selection Notification',
    subject,
    status: 'SIMULATED',
    sentTime: new Date().toISOString(),
    idempotencyKey,
  });
  return { success: true, simulated: true };
}

export const sendSelectionEmail = sendSelectedEmail;

/**
 * 6. SEND WAITLISTED EMAIL
 */
export async function sendWaitlistedEmail(data: WaitlistedData): Promise<EmailResult> {
  const idempotencyKey = `${data.applicationId}_WAITLISTED`;
  if (hasEmailBeenSent(idempotencyKey)) {
    return { success: true, message: 'Waitlisted email already sent.' };
  }

  const { fromString } = getSenderInfo();
  const { subject, html } = generateWaitlistedTemplate(data);
  const transporter = getTransporter();

  if (transporter) {
    try {
      const info = await transporter.sendMail({ from: fromString, to: data.email, subject, html });
      logEmailTransaction({
        recipient: data.email,
        applicationId: data.applicationId,
        emailType: 'Waitlisted Notification',
        subject,
        status: 'SENT',
        sentTime: new Date().toISOString(),
        messageId: info.messageId,
        idempotencyKey,
      });
      return { success: true, messageId: info.messageId, message: `Waitlist email sent to ${data.email}` };
    } catch (err: any) {
      logEmailTransaction({
        recipient: data.email,
        applicationId: data.applicationId,
        emailType: 'Waitlisted Notification',
        subject,
        status: 'FAILED',
        sentTime: new Date().toISOString(),
        errorDetails: err?.message,
        idempotencyKey,
      });
      return { success: false, error: err?.message };
    }
  }

  logEmailTransaction({
    recipient: data.email,
    applicationId: data.applicationId,
    emailType: 'Waitlisted Notification',
    subject,
    status: 'SIMULATED',
    sentTime: new Date().toISOString(),
    idempotencyKey,
  });
  return { success: true, simulated: true };
}

/**
 * 7. SEND NOT SELECTED EMAIL
 */
export async function sendNotSelectedEmail(data: NotSelectedData): Promise<EmailResult> {
  const idempotencyKey = `${data.applicationId}_NOT_SELECTED`;
  if (hasEmailBeenSent(idempotencyKey)) {
    return { success: true, message: 'Not Selected email already sent.' };
  }

  const { fromString } = getSenderInfo();
  const { subject, html } = generateNotSelectedTemplate(data);
  const transporter = getTransporter();

  if (transporter) {
    try {
      const info = await transporter.sendMail({ from: fromString, to: data.email, subject, html });
      logEmailTransaction({
        recipient: data.email,
        applicationId: data.applicationId,
        emailType: 'Not Selected Notification',
        subject,
        status: 'SENT',
        sentTime: new Date().toISOString(),
        messageId: info.messageId,
        idempotencyKey,
      });
      return { success: true, messageId: info.messageId, message: `Not selected email sent to ${data.email}` };
    } catch (err: any) {
      logEmailTransaction({
        recipient: data.email,
        applicationId: data.applicationId,
        emailType: 'Not Selected Notification',
        subject,
        status: 'FAILED',
        sentTime: new Date().toISOString(),
        errorDetails: err?.message,
        idempotencyKey,
      });
      return { success: false, error: err?.message };
    }
  }

  logEmailTransaction({
    recipient: data.email,
    applicationId: data.applicationId,
    emailType: 'Not Selected Notification',
    subject,
    status: 'SIMULATED',
    sentTime: new Date().toISOString(),
    idempotencyKey,
  });
  return { success: true, simulated: true };
}

/**
 * 8. SEND STATUS EMAIL (DISPATCHER FOR ANY APPLICATION STATUS)
 */
export async function sendStatusEmail(params: {
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'INTERVIEW' | 'SELECTED' | 'WAITLISTED' | 'NOT_SELECTED';
  name: string;
  email: string;
  applicationId: string;
  college?: string;
  batch?: string;
  ambassadorId?: string;
  nextStep?: string;
  interviewDate?: string;
  interviewTime?: string;
  interviewMode?: string;
  interviewLink?: string;
  instructions?: string;
}): Promise<EmailResult> {
  switch (params.status) {
    case 'SHORTLISTED':
      return sendShortlistedEmail({
        name: params.name,
        email: params.email,
        applicationId: params.applicationId,
        nextStep: params.nextStep,
        college: params.college,
      });
    case 'INTERVIEW':
      return sendInterviewEmail({
        name: params.name,
        email: params.email,
        applicationId: params.applicationId,
        interviewDate: params.interviewDate,
        interviewTime: params.interviewTime,
        interviewMode: params.interviewMode,
        interviewLink: params.interviewLink,
        instructions: params.instructions,
      });
    case 'SELECTED':
      return sendSelectedEmail({
        name: params.name,
        email: params.email,
        college: params.college || 'University',
        ambassadorId: params.ambassadorId || params.applicationId,
        batch: params.batch,
      });
    case 'WAITLISTED':
      return sendWaitlistedEmail({
        name: params.name,
        email: params.email,
        applicationId: params.applicationId,
        batch: params.batch,
      });
    case 'NOT_SELECTED':
      return sendNotSelectedEmail({
        name: params.name,
        email: params.email,
        applicationId: params.applicationId,
        batch: params.batch,
      });
    case 'SUBMITTED':
      return sendApplicationConfirmationEmail({
        name: params.name,
        email: params.email,
        applicationId: params.applicationId,
        college: params.college || 'University',
        batch: params.batch,
      });
    default:
      return { success: true, message: `Status update recorded for ${params.status}. No explicit email template required.` };
  }
}

/**
 * 9. SEND EVENT REGISTRATION EMAIL
 */
export async function sendEventRegistrationEmail(data: EventRegistrationData): Promise<EmailResult> {
  const idempotencyKey = `EVENT_REG_${data.registrationId || data.studentEmail}_${data.eventName}`;
  if (hasEmailBeenSent(idempotencyKey)) {
    return { success: true, message: 'Event registration confirmation already sent.' };
  }

  const { fromString } = getSenderInfo();
  const { subject, html } = generateEventRegistrationTemplate(data);
  const transporter = getTransporter();

  if (transporter) {
    try {
      const info = await transporter.sendMail({ from: fromString, to: data.studentEmail, subject, html });
      logEmailTransaction({
        recipient: data.studentEmail,
        emailType: 'Event Registration',
        subject,
        status: 'SENT',
        sentTime: new Date().toISOString(),
        messageId: info.messageId,
        relatedEventId: data.eventName,
        idempotencyKey,
      });
      return { success: true, messageId: info.messageId, message: `Event registration email sent to ${data.studentEmail}` };
    } catch (err: any) {
      logEmailTransaction({
        recipient: data.studentEmail,
        emailType: 'Event Registration',
        subject,
        status: 'FAILED',
        sentTime: new Date().toISOString(),
        errorDetails: err?.message,
        idempotencyKey,
      });
      return { success: false, error: err?.message };
    }
  }

  logEmailTransaction({
    recipient: data.studentEmail,
    emailType: 'Event Registration',
    subject,
    status: 'SIMULATED',
    sentTime: new Date().toISOString(),
    idempotencyKey,
  });
  return { success: true, simulated: true };
}

/**
 * 10. SEND EVENT REMINDER EMAIL
 */
export async function sendEventReminderEmail(data: EventReminderData): Promise<EmailResult> {
  const idempotencyKey = `EVENT_REMINDER_${data.studentEmail}_${data.eventName}_${data.date}`;
  if (hasEmailBeenSent(idempotencyKey)) {
    return { success: true, message: 'Event reminder already sent.' };
  }

  const { fromString } = getSenderInfo();
  const { subject, html } = generateEventReminderTemplate(data);
  const transporter = getTransporter();

  if (transporter) {
    try {
      const info = await transporter.sendMail({ from: fromString, to: data.studentEmail, subject, html });
      logEmailTransaction({
        recipient: data.studentEmail,
        emailType: 'Event Reminder',
        subject,
        status: 'SENT',
        sentTime: new Date().toISOString(),
        messageId: info.messageId,
        relatedEventId: data.eventName,
        idempotencyKey,
      });
      return { success: true, messageId: info.messageId, message: `Event reminder sent to ${data.studentEmail}` };
    } catch (err: any) {
      logEmailTransaction({
        recipient: data.studentEmail,
        emailType: 'Event Reminder',
        subject,
        status: 'FAILED',
        sentTime: new Date().toISOString(),
        errorDetails: err?.message,
        idempotencyKey,
      });
      return { success: false, error: err?.message };
    }
  }

  logEmailTransaction({
    recipient: data.studentEmail,
    emailType: 'Event Reminder',
    subject,
    status: 'SIMULATED',
    sentTime: new Date().toISOString(),
    idempotencyKey,
  });
  return { success: true, simulated: true };
}

/**
 * 11. SEND MISSION EMAIL
 */
export async function sendMissionEmail(data: MissionData): Promise<EmailResult> {
  const idempotencyKey = `MISSION_${data.ambassadorEmail}_${data.missionTitle}`;
  if (hasEmailBeenSent(idempotencyKey)) {
    return { success: true, message: 'Mission notification already sent.' };
  }

  const { fromString } = getSenderInfo();
  const { subject, html } = generateMissionTemplate(data);
  const transporter = getTransporter();

  if (transporter) {
    try {
      const info = await transporter.sendMail({ from: fromString, to: data.ambassadorEmail, subject, html });
      logEmailTransaction({
        recipient: data.ambassadorEmail,
        emailType: 'Mission Notification',
        subject,
        status: 'SENT',
        sentTime: new Date().toISOString(),
        messageId: info.messageId,
        relatedMissionId: data.missionTitle,
        idempotencyKey,
      });
      return { success: true, messageId: info.messageId, message: `Mission notification sent to ${data.ambassadorEmail}` };
    } catch (err: any) {
      logEmailTransaction({
        recipient: data.ambassadorEmail,
        emailType: 'Mission Notification',
        subject,
        status: 'FAILED',
        sentTime: new Date().toISOString(),
        errorDetails: err?.message,
        idempotencyKey,
      });
      return { success: false, error: err?.message };
    }
  }

  logEmailTransaction({
    recipient: data.ambassadorEmail,
    emailType: 'Mission Notification',
    subject,
    status: 'SIMULATED',
    sentTime: new Date().toISOString(),
    idempotencyKey,
  });
  return { success: true, simulated: true };
}

/**
 * 12. SEND REWARD EMAIL
 */
export async function sendRewardEmail(data: RewardData): Promise<EmailResult> {
  const idempotencyKey = `REWARD_${data.ambassadorEmail}_${data.rewardTitle}`;
  if (hasEmailBeenSent(idempotencyKey)) {
    return { success: true, message: 'Reward email already sent.' };
  }

  const { fromString } = getSenderInfo();
  const { subject, html } = generateRewardTemplate(data);
  const transporter = getTransporter();

  if (transporter) {
    try {
      const info = await transporter.sendMail({ from: fromString, to: data.ambassadorEmail, subject, html });
      logEmailTransaction({
        recipient: data.ambassadorEmail,
        emailType: 'Reward Unlocked',
        subject,
        status: 'SENT',
        sentTime: new Date().toISOString(),
        messageId: info.messageId,
        relatedRewardId: data.rewardTitle,
        idempotencyKey,
      });
      return { success: true, messageId: info.messageId, message: `Reward email sent to ${data.ambassadorEmail}` };
    } catch (err: any) {
      logEmailTransaction({
        recipient: data.ambassadorEmail,
        emailType: 'Reward Unlocked',
        subject,
        status: 'FAILED',
        sentTime: new Date().toISOString(),
        errorDetails: err?.message,
        idempotencyKey,
      });
      return { success: false, error: err?.message };
    }
  }

  logEmailTransaction({
    recipient: data.ambassadorEmail,
    emailType: 'Reward Unlocked',
    subject,
    status: 'SIMULATED',
    sentTime: new Date().toISOString(),
    idempotencyKey,
  });
  return { success: true, simulated: true };
}

/**
 * 13. SEND CERTIFICATE EMAIL
 */
export async function sendCertificateEmail(data: CertificateData): Promise<EmailResult> {
  const idempotencyKey = `CERT_${data.certificateId}`;
  if (hasEmailBeenSent(idempotencyKey)) {
    return { success: true, message: 'Certificate email already sent.' };
  }

  const { fromString } = getSenderInfo();
  const { subject, html } = generateCertificateTemplate(data);
  const transporter = getTransporter();

  if (transporter) {
    try {
      const info = await transporter.sendMail({ from: fromString, to: data.email, subject, html });
      logEmailTransaction({
        recipient: data.email,
        emailType: 'Certificate Issued',
        subject,
        status: 'SENT',
        sentTime: new Date().toISOString(),
        messageId: info.messageId,
        idempotencyKey,
      });
      return { success: true, messageId: info.messageId, message: `Certificate email sent to ${data.email}` };
    } catch (err: any) {
      logEmailTransaction({
        recipient: data.email,
        emailType: 'Certificate Issued',
        subject,
        status: 'FAILED',
        sentTime: new Date().toISOString(),
        errorDetails: err?.message,
        idempotencyKey,
      });
      return { success: false, error: err?.message };
    }
  }

  logEmailTransaction({
    recipient: data.email,
    emailType: 'Certificate Issued',
    subject,
    status: 'SIMULATED',
    sentTime: new Date().toISOString(),
    idempotencyKey,
  });
  return { success: true, simulated: true };
}

/**
 * 14. SEND TEST EMAIL (FOR ADMIN SETTINGS)
 */
export async function sendTestEmail(toEmail: string): Promise<EmailResult> {
  const { companyEmail, fromString } = getSenderInfo();
  const subject = '⚡ Wonderlight Adventure Email Dispatcher Test';
  const html = `
    <div style="font-family: sans-serif; background: #0f172a; color: #fff; padding: 24px; border-radius: 12px; border: 1px solid #10b981;">
      <h3 style="color: #10b981;">Wonderlight Adventure SMTP Connection Successful</h3>
      <p>This test email confirms that <strong>${companyEmail}</strong> is correctly configured with Nodemailer/Gmail App Password and sending transactional emails!</p>
      <p style="font-size: 12px; color: #94a3b8;">Timestamp: ${new Date().toLocaleString()}</p>
    </div>
  `;

  const transporter = getTransporter();

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: fromString,
        to: toEmail,
        subject,
        html,
      });

      logEmailTransaction({
        recipient: toEmail,
        emailType: 'Test Email',
        subject,
        status: 'SENT',
        sentTime: new Date().toISOString(),
        messageId: info.messageId,
      });

      return { success: true, messageId: info.messageId, message: `Real test email dispatched to ${toEmail}` };
    } catch (err: any) {
      console.error('Test Email error:', err);
      logEmailTransaction({
        recipient: toEmail,
        emailType: 'Test Email',
        subject,
        status: 'FAILED',
        sentTime: new Date().toISOString(),
        errorDetails: err?.message,
      });
      return { success: false, error: err?.message || 'SMTP Dispatch failed' };
    }
  }

  logEmailTransaction({
    recipient: toEmail,
    emailType: 'Test Email',
    subject,
    status: 'SIMULATED',
    sentTime: new Date().toISOString(),
    messageId: `<simulated-test-${Date.now()}@wonderlightadventure.com>`,
  });

  return {
    success: true,
    simulated: true,
    message: `Test email triggered from ${companyEmail} to ${toEmail}.`,
  };
}
