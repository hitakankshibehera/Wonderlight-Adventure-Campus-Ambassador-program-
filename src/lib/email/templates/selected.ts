export interface SelectedData {
  name: string;
  email: string;
  college: string;
  ambassadorId?: string;
  batch?: string;
  selectionDate?: string;
}

export function generateSelectedTemplate(data: SelectedData): { subject: string; html: string } {
  const companyEmail = process.env.EMAIL_FROM || process.env.COMPANY_EMAIL || 'wonderlightadventure@gmail.com';
  const ambId = data.ambassadorId || `WLA-CA-${Math.floor(10000 + Math.random() * 90000)}`;
  const batch = data.batch || '2026 Batch';
  const dateStr = data.selectionDate || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const subject = `Congratulations! You Have Been Selected as a Wonderlight Campus Ambassador 🎉`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050811; color: #f3f4f6; margin: 0; padding: 20px; }
        .container { max-width: 560px; margin: 0 auto; background: #0f172a; border-radius: 20px; border: 1px solid #10b981; padding: 36px; box-shadow: 0 20px 50px rgba(16, 185, 129, 0.25); }
        .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #1e293b; }
        .brand { font-size: 11px; font-weight: 800; color: #10b981; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
        .title { font-size: 24px; font-weight: 900; color: #ffffff; margin: 0; }
        .content { padding: 24px 0; }
        .lead { font-size: 18px; color: #34d399; font-weight: 800; text-align: center; margin-bottom: 20px; letter-spacing: 0.5px; }
        .card { background: #070b14; border: 1px solid #10b981; padding: 24px; border-radius: 16px; margin: 20px 0; box-shadow: inset 0 2px 10px rgba(16, 185, 129, 0.1); }
        .card-row { font-size: 14px; margin-bottom: 12px; display: flex; justify-content: space-between; }
        .card-row:last-child { margin-bottom: 0; }
        .label { color: #94a3b8; }
        .val { color: #ffffff; font-weight: 700; text-align: right; }
        .btn-container { text-align: center; margin: 32px 0 16px 0; }
        .btn { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-weight: 900; padding: 16px 32px; border-radius: 14px; text-decoration: none; font-size: 15px; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4); }
        .footer { text-align: center; border-top: 1px solid #1e293b; padding-top: 20px; font-size: 11px; color: #64748b; margin-top: 24px; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="brand">WONDERLIGHT ADVENTURE</div>
          <h2 class="title">OFFICIAL SELECTION NOTICE</h2>
        </div>
        <div class="content">
          <div class="lead">🎉 CONGRATULATIONS, ${data.name.toUpperCase()}!</div>
          <p style="font-size: 15px; color: #e2e8f0; line-height: 1.6;">
            We are thrilled to announce that after a competitive review process, you have been selected as an official <strong>Wonderlight Campus Ambassador</strong> representing <strong>${data.college}</strong>!
          </p>

          <div class="card">
            <div class="card-row"><span class="label">Ambassador ID:</span> <span class="val" style="color: #34d399; font-family: monospace; font-size: 16px;">${ambId}</span></div>
            <div class="card-row"><span class="label">College:</span> <span class="val">${data.college}</span></div>
            <div class="card-row"><span class="label">Program:</span> <span class="val">Wonderlight Campus Ambassador</span></div>
            <div class="card-row"><span class="label">Batch:</span> <span class="val">${batch}</span></div>
            <div class="card-row"><span class="label">Selection Date:</span> <span class="val">${dateStr}</span></div>
          </div>

          <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">
            Welcome to the Wonderlight community! As a Campus Ambassador, you will lead student initiatives, gain leadership experience, and unlock exclusive rewards.
          </p>

          <div class="btn-container">
            <a href="https://wonderlightcampus.vercel.app/campus-ambassador/login" class="btn">START YOUR AMBASSADOR JOURNEY →</a>
          </div>
        </div>

        <div class="footer">
          <p>Regards,<br><strong>Wonderlight Adventure Leadership Team</strong><br><a href="mailto:${companyEmail}" style="color: #10b981; text-decoration: none;">${companyEmail}</a></p>
          <p>© 2026 Wonderlight Adventure India. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}
