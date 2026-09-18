import { NextResponse } from 'next/server';
import { getEmailLogs, getLogById, updateLogStatus } from '@/lib/services/emailLogsStore';
import { sendTestEmail, sendApplicationConfirmationEmail, sendSelectedEmail } from '@/lib/services/emailService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get('status');
  const typeFilter = searchParams.get('type');

  let logs = getEmailLogs();

  if (statusFilter && statusFilter !== 'ALL') {
    logs = logs.filter((l) => l.status === statusFilter);
  }

  if (typeFilter && typeFilter !== 'ALL') {
    logs = logs.filter((l) => l.emailType.toLowerCase().includes(typeFilter.toLowerCase()));
  }

  return NextResponse.json({
    success: true,
    logs,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, logId } = body;

    if (action === 'retry' && logId) {
      const log = getLogById(logId);
      if (!log) {
        return NextResponse.json({ success: false, error: 'Log entry not found.' }, { status: 404 });
      }

      if (log.emailType === 'OTP Verification') {
        return NextResponse.json(
          { success: false, error: 'OTP verification codes cannot be retried manually for security reasons.' },
          { status: 400 }
        );
      }

      updateLogStatus(logId, 'RETRYING');

      let result;
      if (log.emailType === 'Test Email') {
        result = await sendTestEmail(log.recipient);
      } else if (log.emailType === 'Application Received' && log.applicationId) {
        result = await sendApplicationConfirmationEmail({
          name: log.recipient.split('@')[0],
          email: log.recipient,
          applicationId: log.applicationId,
          college: 'University',
        });
      } else if (log.emailType === 'Selection Notification') {
        result = await sendSelectedEmail({
          name: log.recipient.split('@')[0],
          email: log.recipient,
          college: 'University',
          ambassadorId: log.applicationId || 'WLA-RETRIED',
        });
      } else {
        result = await sendTestEmail(log.recipient);
      }

      if (result.success) {
        updateLogStatus(logId, 'SENT', { messageId: result.messageId });
        return NextResponse.json({ success: true, message: `Retry dispatched successfully to ${log.recipient}.` });
      } else {
        updateLogStatus(logId, 'FAILED', { errorDetails: result.error });
        return NextResponse.json({ success: false, error: result.error || 'Retry dispatch failed.' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: false, error: 'Invalid action or parameters.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Failed to process log request.' }, { status: 500 });
  }
}
