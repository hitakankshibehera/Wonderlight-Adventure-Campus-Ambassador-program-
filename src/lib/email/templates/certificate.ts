export interface CertificateData {
  name: string;
  email: string;
  certificateType: string;
  certificateId: string;
  issueDate?: string;
  verificationUrl?: string;
}

export function generateCertificateTemplate(data: CertificateData): { subject: string; html: string } {
  const companyEmail = process.env.EMAIL_FROM || process.env.COMPANY_EMAIL || 'wonderlightadventure@gmail.com';
  const issueDateStr = data.issueDate || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const verifyUrl = data.verificationUrl || `https://wonderlightcampus.vercel.app/campus-ambassador/certificate/${data.certificateId}`;

  const subject = `Your Wonderlight Certificate Is Ready 🎓 (${data.certificateId})`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050811; color: #f3f4f6; margin: 0; padding: 20px; }
        .container { max-width: 540px; margin: 0 auto; background: #0f172a; border-radius: 20px; border: 1px solid #10b981; padding: 36px; box-shadow: 0 20px 40px rgba(16, 185, 129, 0.25); }
        .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #1e293b; }
        .brand { font-size: 11px; font-weight: 800; color: #10b981; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
        .title { font-size: 22px; font-weight: 800; color: #ffffff; margin: 0; }
        .content { padding: 24px 0; }
        .lead { font-size: 16px; color: #34d399; font-weight: 700; margin-bottom: 16px; text-align: center; }
        .card { background: #070b14; border: 1px solid #10b981; padding: 20px; border-radius: 14px; margin: 20px 0; }
        .card-row { font-size: 14px; margin-bottom: 10px; display: flex; justify-content: space-between; }
        .label { color: #94a3b8; }
        .val { color: #f3f4f6; font-weight: 700; text-align: right; }
        .btn-container { text-align: center; margin: 28px 0 16px 0; }
        .btn { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-weight: 800; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-size: 14px; letter-spacing: 0.5px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3); }
        .footer { text-align: center; border-top: 1px solid #1e293b; padding-top: 20px; font-size: 11px; color: #64748b; margin-top: 24px; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="brand">WONDERLIGHT ADVENTURE</div>
          <h2 class="title">OFFICIAL CERTIFICATE ISSUED</h2>
        </div>
        <div class="content">
          <p>Hello <strong>${data.name}</strong>,</p>
          <div class="lead">🎓 Congratulations! Your official Wonderlight certificate has been issued and digitally signed!</div>

          <div class="card">
            <div class="card-row"><span class="label">Certificate ID:</span> <span class="val" style="color: #34d399; font-family: monospace;">${data.certificateId}</span></div>
            <div class="card-row"><span class="label">Type / Honor:</span> <span class="val">${data.certificateType}</span></div>
            <div class="card-row"><span class="label">Issue Date:</span> <span class="val">${issueDateStr}</span></div>
            <div class="card-row" style="margin-bottom: 0;"><span class="label">Verification Link:</span> <span class="val" style="color: #60a5fa; font-size: 12px; word-break: break-all;">${verifyUrl}</span></div>
          </div>

          <div class="btn-container">
            <a href="${verifyUrl}" class="btn">VIEW & DOWNLOAD CERTIFICATE →</a>
          </div>
        </div>

        <div class="footer">
          <p>Regards,<br><strong>Wonderlight Adventure Certification Board</strong><br><a href="mailto:${companyEmail}" style="color: #10b981; text-decoration: none;">${companyEmail}</a></p>
          <p>© 2026 Wonderlight Adventure India. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}
