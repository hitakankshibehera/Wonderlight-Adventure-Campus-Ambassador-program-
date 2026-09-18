export interface ApplicationConfirmationData {
  name: string;
  email: string;
  applicationId: string;
  college: string;
  batch?: string;
  date?: string;
  status?: string;
}

export function generateApplicationConfirmationTemplate(data: ApplicationConfirmationData): { subject: string; html: string } {
  const companyEmail = process.env.EMAIL_FROM || process.env.COMPANY_EMAIL || 'wonderlightadventure@gmail.com';
  const batch = data.batch || '2026 Batch';
  const dateStr = data.date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const statusStr = data.status || 'SUBMITTED';

  const subject = `Application Received — Wonderlight Campus Ambassador (${data.applicationId})`;

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
        .salutation { font-size: 16px; color: #e2e8f0; margin-bottom: 12px; }
        .lead { font-size: 15px; color: #34d399; font-weight: 700; margin-bottom: 16px; }
        .card { background: #070b14; border: 1px solid #1e293b; padding: 20px; border-radius: 14px; margin: 20px 0; }
        .card-row { font-size: 14px; margin-bottom: 10px; display: flex; justify-content: space-between; }
        .label { color: #94a3b8; }
        .val { color: #f3f4f6; font-weight: 700; text-align: right; }
        .status-badge { color: #60a5fa; font-weight: 800; background: rgba(96, 165, 250, 0.1); border: 1px solid rgba(96, 165, 250, 0.3); padding: 4px 10px; border-radius: 8px; display: inline-block; }
        .btn-container { text-align: center; margin: 28px 0 16px 0; }
        .btn { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-weight: 800; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-size: 14px; letter-spacing: 0.5px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3); }
        .footer { text-align: center; border-top: 1px solid #1e293b; padding-top: 20px; font-size: 11px; color: #64748b; margin-top: 24px; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="brand">WONDERLIGHT ADVENTURE</div>
          <h2 class="title">CAMPUS AMBASSADOR PROGRAM</h2>
        </div>
        <div class="content">
          <p class="salutation">Hello <strong>${data.name}</strong>,</p>
          <p class="lead">Congratulations! Your Wonderlight Campus Ambassador application has been successfully submitted.</p>
          
          <div class="card">
            <div class="card-row"><span class="label">Application ID:</span> <span class="val" style="color: #34d399; font-family: monospace;">${data.applicationId}</span></div>
            <div class="card-row"><span class="label">Program:</span> <span class="val">Wonderlight Campus Ambassador</span></div>
            <div class="card-row"><span class="label">Batch:</span> <span class="val">${batch}</span></div>
            <div class="card-row"><span class="label">College:</span> <span class="val">${data.college}</span></div>
            <div class="card-row"><span class="label">Application Date:</span> <span class="val">${dateStr}</span></div>
            <div class="card-row"><span class="label">Current Status:</span> <span class="val"><span class="status-badge">${statusStr}</span></span></div>
          </div>

          <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">
            Our evaluation committee is currently reviewing candidate profiles. You can check your application status at any time on our website using your registered email address.
          </p>

          <div class="btn-container">
            <a href="https://wonderlightcampus.vercel.app/campus-ambassador/application-status" class="btn">CHECK APPLICATION STATUS →</a>
          </div>
        </div>

        <div class="footer">
          <p>Regards,<br><strong>Wonderlight Adventure</strong><br>Wonderlight Campus Ambassador Team<br><a href="mailto:${companyEmail}" style="color: #10b981; text-decoration: none;">${companyEmail}</a></p>
          <p>© 2026 Wonderlight Adventure India. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}
