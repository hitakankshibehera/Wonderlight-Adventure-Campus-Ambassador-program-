import { NextResponse } from 'next/server';
import { getEmailLogs } from '@/lib/services/emailLogsStore';

export async function GET() {
  const logs = getEmailLogs();
  return NextResponse.json({
    success: true,
    logs,
  });
}
