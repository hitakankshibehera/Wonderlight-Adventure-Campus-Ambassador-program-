export interface WaitlistedData {
  name: string;
  email: string;
  applicationId: string;
  batch?: string;
  nextUpdateInfo?: string;
}

export function generateWaitlistedTemplate(data: WaitlistedData): { subject: string; html: string } {
  const companyEmail = process.env.EMAIL_FROM || process.env.COMPANY_EMAIL || 'wonderlightadventure@gmail.com';
  const batch = data.batch || '2026 Batch';
  const nextInfo = data.nextUpdateInfo || 'Should additional ambassador slots open up in your institution, our selection board will re-evaluate your application.';

  const subject = `Wonderlight Campus Ambassador — Application Update (${data.applicationId})`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050811; color: #f3f4f6; margin: 0; padding: 20px; }
        .container { max-width: 540px; margin: 0 auto; background: #0f172a; border-radius: 20px; border: 1px solid #f59e0b; padding: 36px; box-shadow: 0 20px 40px rgba(245, 158, 11, 0.15); }
        .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #1e293b; }
        .brand { font-size: 11px; font-weight: 800; color: #f59e0b; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
        .title { font-size: 22px; font-weight: 800; color: #ffffff; margin: 0; }
        .content { padding: 24px 0; }
        .lead { font-size: 16px; color: #fbbf24; font-weight: 700; margin-bottom: 16px; }
        .card { background: #070b14; border: 1px solid #1e293b; padding: 20px; border-radius: 14px; margin: 20px 0; }
        .card-row { font-size: 14px; margin-bottom: 10px; display: flex; justify-content: space-between; }
        .label { color: #94a3b8; }
        .val { color: #f3f4f6; font-weight: 700; text-align: right; }
        .badge { color: #fbbf24; font-weight: 800; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); padding: 4px 10px; border-radius: 8px; display: inline-block; }
        .btn-container { text-align: center; margin: 28px 0 16px 0; }
        .btn { display: inline-block; background: #1e293b; color: #ffffff; font-weight: 700; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-size: 14px; border: 1px solid #334155; }
        .footer { text-align: center; border-top: 1px solid #1e293b; padding-top: 20px; font-size: 11px; color: #64748b; margin-top: 24px; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="brand">WONDERLIGHT ADVENTURE</div>
          <h2 class="title">APPLICATION STATUS UPDATE</h2>
        </div>
        <div class="content">
          <p>Hello <strong>${data.name}</strong>,</p>
          <p class="lead">Thank you for your patience during our selection process. Your application for the Wonderlight Campus Ambassador Program has been placed on the official Waitlist.</p>

          <div class="card">
            <div class="card-row"><span class="label">Application ID:</span> <span class="val" style="color: #fbbf24; font-family: monospace;">${data.applicationId}</span></div>
            <div class="card-row"><span class="label">Batch:</span> <span class="val">${batch}</span></div>
            <div class="card-row"><span class="label">Current Status:</span> <span class="val"><span class="badge">WAITLISTED</span></span></div>
          </div>

          <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">
            ${nextInfo}
          </p>

          <div class="btn-container">
            <a href="https://wonderlightcampus.vercel.app/campus-ambassador/application-status" class="btn">CHECK STATUS PORTAL →</a>
          </div>
        </div>

        <div class="footer">
          <p>Regards,<br><strong>Wonderlight Adventure Selection Committee</strong><br><a href="mailto:${companyEmail}" style="color: #10b981; text-decoration: none;">${companyEmail}</a></p>
          <p>© 2026 Wonderlight Adventure India. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}
