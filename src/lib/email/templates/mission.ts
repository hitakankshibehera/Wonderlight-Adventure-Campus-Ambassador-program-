export interface MissionData {
  ambassadorName: string;
  ambassadorEmail: string;
  missionTitle: string;
  description: string;
  xp: number | string;
  deadline?: string;
  instructions?: string;
}

export function generateMissionTemplate(data: MissionData): { subject: string; html: string } {
  const companyEmail = process.env.EMAIL_FROM || process.env.COMPANY_EMAIL || 'wonderlightadventure@gmail.com';
  const deadlineStr = data.deadline || 'End of Batch Cycle';
  const instructionsStr = data.instructions || 'Submit proof of completion via your Ambassador Dashboard.';

  const subject = `🚀 New Mission Assigned: ${data.missionTitle}`;

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
        .card-row { font-size: 14px; margin-bottom: 10px; display: flex; justify-content: space-between; }
        .label { color: #94a3b8; }
        .val { color: #f3f4f6; font-weight: 700; text-align: right; }
        .xp-tag { color: #fbbf24; font-weight: 900; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); padding: 4px 10px; border-radius: 8px; display: inline-block; }
        .btn-container { text-align: center; margin: 28px 0 16px 0; }
        .btn { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; font-weight: 800; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-size: 14px; letter-spacing: 0.5px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3); }
        .footer { text-align: center; border-top: 1px solid #1e293b; padding-top: 20px; font-size: 11px; color: #64748b; margin-top: 24px; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="brand">WONDERLIGHT ADVENTURE</div>
          <h2 class="title">NEW AMBASSADOR MISSION</h2>
        </div>
        <div class="content">
          <p>Hello Ambassador <strong>${data.ambassadorName}</strong>,</p>
          <p class="lead">A new official mission is now available for completion on your dashboard!</p>

          <div class="card">
            <div class="card-row"><span class="label">Mission Title:</span> <span class="val" style="color: #34d399;">${data.missionTitle}</span></div>
            <div class="card-row"><span class="label">Reward:</span> <span class="val"><span class="xp-tag">+${data.xp} XP</span></span></div>
            <div class="card-row"><span class="label">Deadline:</span> <span class="val">${deadlineStr}</span></div>
            <div class="card-row"><span class="label">Description:</span> <span class="val" style="color: #cbd5e1; font-weight: 400; font-size: 13px;">${data.description}</span></div>
            <div class="card-row" style="margin-bottom: 0;"><span class="label">Instructions:</span> <span class="val" style="color: #cbd5e1; font-weight: 400; font-size: 13px;">${instructionsStr}</span></div>
          </div>

          <div class="btn-container">
            <a href="https://wonderlightcampus.vercel.app/ambassador/missions" class="btn">VIEW MISSION & SUBMIT →</a>
          </div>
        </div>

        <div class="footer">
          <p>Regards,<br><strong>Wonderlight Campus Ambassador Program</strong><br><a href="mailto:${companyEmail}" style="color: #10b981; text-decoration: none;">${companyEmail}</a></p>
          <p>© 2026 Wonderlight Adventure India. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}
