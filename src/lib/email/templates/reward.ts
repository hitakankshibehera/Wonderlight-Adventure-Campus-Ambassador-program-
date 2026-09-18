export interface RewardData {
  ambassadorName: string;
  ambassadorEmail: string;
  rewardTitle: string;
  xp?: number | string;
  reason?: string;
  claimInstructions?: string;
}

export function generateRewardTemplate(data: RewardData): { subject: string; html: string } {
  const companyEmail = process.env.EMAIL_FROM || process.env.COMPANY_EMAIL || 'wonderlightadventure@gmail.com';
  const xpStr = data.xp ? ` (${data.xp} XP)` : '';
  const reasonStr = data.reason || 'Outstanding leadership and active participation in ambassador missions.';
  const claimStr = data.claimInstructions || 'Log in to your dashboard under Rewards to claim or verify your physical perk / voucher code.';

  const subject = `🎁 You Unlocked a Wonderlight Reward!`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050811; color: #f3f4f6; margin: 0; padding: 20px; }
        .container { max-width: 540px; margin: 0 auto; background: #0f172a; border-radius: 20px; border: 1px solid #f59e0b; padding: 36px; box-shadow: 0 20px 40px rgba(245, 158, 11, 0.25); }
        .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #1e293b; }
        .brand { font-size: 11px; font-weight: 800; color: #f59e0b; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
        .title { font-size: 22px; font-weight: 800; color: #ffffff; margin: 0; }
        .content { padding: 24px 0; }
        .lead { font-size: 18px; color: #fbbf24; font-weight: 800; text-align: center; margin-bottom: 20px; }
        .card { background: #070b14; border: 1px solid #f59e0b; padding: 20px; border-radius: 14px; margin: 20px 0; }
        .card-row { font-size: 14px; margin-bottom: 10px; display: flex; justify-content: space-between; }
        .label { color: #94a3b8; }
        .val { color: #f3f4f6; font-weight: 700; text-align: right; }
        .btn-container { text-align: center; margin: 28px 0 16px 0; }
        .btn { display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; font-weight: 800; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-size: 14px; letter-spacing: 0.5px; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.3); }
        .footer { text-align: center; border-top: 1px solid #1e293b; padding-top: 20px; font-size: 11px; color: #64748b; margin-top: 24px; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="brand">WONDERLIGHT ADVENTURE</div>
          <h2 class="title">REWARD UNLOCKED NOTICE</h2>
        </div>
        <div class="content">
          <div class="lead">🎉 CONGRATULATIONS, ${data.ambassadorName.toUpperCase()}!</div>
          <p style="font-size: 15px; color: #e2e8f0; line-height: 1.6; text-align: center;">
            You have unlocked a brand new reward reward on your Wonderlight Campus Ambassador account!
          </p>

          <div class="card">
            <div class="card-row"><span class="label">Unlocked Reward:</span> <span class="val" style="color: #fbbf24; font-size: 16px;">${data.rewardTitle}${xpStr}</span></div>
            <div class="card-row"><span class="label">Reason:</span> <span class="val" style="color: #cbd5e1; font-weight: 400; font-size: 13px;">${reasonStr}</span></div>
            <div class="card-row" style="margin-bottom: 0;"><span class="label">Claim Instructions:</span> <span class="val" style="color: #cbd5e1; font-weight: 400; font-size: 13px;">${claimStr}</span></div>
          </div>

          <div class="btn-container">
            <a href="https://wonderlightcampus.vercel.app/ambassador/rewards" class="btn">CLAIM REWARD ON DASHBOARD →</a>
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
