export interface ShortlistedData {
  name: string;
  email: string;
  applicationId: string;
  nextStep?: string;
  details?: string;
  college?: string;
}

export function generateShortlistedTemplate(data: ShortlistedData): { subject: string; html: string } {
  const companyEmail = process.env.EMAIL_FROM || process.env.COMPANY_EMAIL || 'wonderlightadventure@gmail.com';
  const nextStep = data.nextStep || 'Personal Interview & Background Verification';
  const details = data.details || 'Our team will reach out with your scheduled interview slot and preparation guide.';

  const subject = `Congratulations! You Have Been Shortlisted — Wonderlight Campus Ambassador`;

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
        .lead { font-size: 16px; color: #34d399; font-weight: 700; margin-bottom: 16px; }
        .card { background: #070b14; border: 1px solid #1e293b; padding: 20px; border-radius: 14px; margin: 20px 0; }
        .card-row { font-size: 14px; margin-bottom: 10px; }
        .label { color: #94a3b8; display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .val { color: #f3f4f6; font-weight: 700; }
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
          <p>Hello <strong>${data.name}</strong>,</p>
          <p class="lead">We are pleased to inform you that your application has been shortlisted for the Wonderlight Campus Ambassador Program.</p>

          <div class="card">
            <div class="card-row">
              <span class="label">Application ID</span>
              <span class="val" style="color: #34d399; font-family: monospace;">${data.applicationId}</span>
            </div>
            <div class="card-row">
              <span class="label">Next Step</span>
              <span class="val">${nextStep}</span>
            </div>
            <div class="card-row" style="margin-bottom: 0;">
              <span class="label">Selection Details</span>
              <span class="val" style="color: #cbd5e1; font-weight: 400; font-size: 13px;">${details}</span>
            </div>
          </div>

          <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">
            Please log in to your Wonderlight Campus account for the latest information and updates.
          </p>

          <div class="btn-container">
            <a href="https://wonderlightcampus.vercel.app/campus-ambassador/application-status" class="btn">VIEW APPLICATION STATUS →</a>
          </div>
        </div>

        <div class="footer">
          <p>Regards,<br><strong>Wonderlight Adventure</strong><br><a href="mailto:${companyEmail}" style="color: #10b981; text-decoration: none;">${companyEmail}</a></p>
          <p>© 2026 Wonderlight Adventure India. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}
