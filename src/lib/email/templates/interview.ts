export interface InterviewData {
  name: string;
  email: string;
  applicationId: string;
  interviewDate?: string;
  interviewTime?: string;
  interviewMode?: string;
  interviewLink?: string;
  instructions?: string;
}

export function generateInterviewTemplate(data: InterviewData): { subject: string; html: string } {
  const companyEmail = process.env.EMAIL_FROM || process.env.COMPANY_EMAIL || 'wonderlightadventure@gmail.com';
  const dateStr = data.interviewDate || 'To be communicated';
  const timeStr = data.interviewTime || 'To be scheduled';
  const modeStr = data.interviewMode || 'Online Video Interview (Google Meet / Zoom)';
  const linkStr = data.interviewLink || 'Link will be sent 15 minutes before the session';
  const instructionsStr = data.instructions || 'Please keep a digital copy of your student ID card ready.';

  const subject = `Wonderlight Campus Ambassador — Interview Update (${data.applicationId})`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050811; color: #f3f4f6; margin: 0; padding: 20px; }
        .container { max-width: 540px; margin: 0 auto; background: #0f172a; border-radius: 20px; border: 1px solid #10b981; padding: 36px; box-shadow: 0 20px 40px rgba(16, 185, 129, 0.2); }
        .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #1e293b; }
        .brand { font-size: 11px; font-weight: 800; color: #10b981; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
        .title { font-size: 22px; font-weight: 800; color: #ffffff; margin: 0; }
        .content { padding: 24px 0; }
        .lead { font-size: 16px; color: #60a5fa; font-weight: 700; margin-bottom: 16px; }
        .card { background: #070b14; border: 1px solid #1e293b; padding: 20px; border-radius: 14px; margin: 20px 0; }
        .card-row { font-size: 14px; margin-bottom: 10px; }
        .label { color: #94a3b8; display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .val { color: #f3f4f6; font-weight: 700; }
        .btn-container { text-align: center; margin: 28px 0 16px 0; }
        .btn { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; font-weight: 800; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-size: 14px; letter-spacing: 0.5px; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3); }
        .footer { text-align: center; border-top: 1px solid #1e293b; padding-top: 20px; font-size: 11px; color: #64748b; margin-top: 24px; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="brand">WONDERLIGHT ADVENTURE</div>
          <h2 class="title">INTERVIEW SCHEDULE NOTICE</h2>
        </div>
        <div class="content">
          <p>Hello <strong>${data.name}</strong>,</p>
          <p class="lead">Your interview for the Wonderlight Campus Ambassador Program has been scheduled!</p>

          <div class="card">
            <div class="card-row">
              <span class="label">Application ID</span>
              <span class="val" style="color: #60a5fa; font-family: monospace;">${data.applicationId}</span>
            </div>
            <div class="card-row">
              <span class="label">Interview Date</span>
              <span class="val">${dateStr}</span>
            </div>
            <div class="card-row">
              <span class="label">Interview Time</span>
              <span class="val">${timeStr}</span>
            </div>
            <div class="card-row">
              <span class="label">Mode</span>
              <span class="val">${modeStr}</span>
            </div>
            <div class="card-row">
              <span class="label">Interview Link / Venue</span>
              <span class="val" style="color: #38bdf8;">${linkStr}</span>
            </div>
            <div class="card-row" style="margin-bottom: 0;">
              <span class="label">Instructions</span>
              <span class="val" style="color: #cbd5e1; font-weight: 400; font-size: 13px;">${instructionsStr}</span>
            </div>
          </div>

          <div class="btn-container">
            <a href="https://wonderlightcampus.vercel.app/campus-ambassador/application-status" class="btn">CHECK APPLICATION STATUS →</a>
          </div>
        </div>

        <div class="footer">
          <p>Regards,<br><strong>Wonderlight Adventure Selection Board</strong><br><a href="mailto:${companyEmail}" style="color: #10b981; text-decoration: none;">${companyEmail}</a></p>
          <p>© 2026 Wonderlight Adventure India. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}
