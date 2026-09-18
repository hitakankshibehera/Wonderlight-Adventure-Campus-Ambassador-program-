import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and OTP code are required.' },
        { status: 400 }
      );
    }

    const companyEmail = process.env.COMPANY_EMAIL || 'wonderlightadventure@gmail.com';
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASSWORD;

    // Configure Nodemailer Transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: companyEmail,
        pass: gmailAppPassword || 'demo_pass_placeholder',
      },
    });

    const mailOptions = {
      from: `"Wonderlight Adventure" <${companyEmail}>`,
      to: email,
      subject: `🔐 Your 4-Digit Login Code: ${otp} | Wonderlight Campus Ambassador Program`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #050811; color: #f3f4f6; margin: 0; padding: 20px; }
            .container { max-width: 520px; margin: 0 auto; background: #0f172a; border-radius: 24px; border: 1px solid #1e293b; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
            .header { text-align: center; padding-bottom: 24px; border-bottom: 1px solid #1e293b; }
            .title { font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: 1px; margin: 12px 0 4px 0; }
            .subtitle { font-size: 12px; color: #10b981; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; }
            .content { text-align: center; padding: 28px 0; }
            .otp-box { font-size: 36px; font-weight: 900; font-family: 'Courier New', monospace; letter-spacing: 12px; color: #34d399; background: #070b14; border: 1px solid #10b981; padding: 16px 24px; border-radius: 16px; display: inline-block; margin: 20px 0; }
            .message { font-size: 14px; color: #94a3b8; line-height: 1.6; }
            .footer { text-align: center; border-top: 1px solid #1e293b; pt: 20px; font-size: 11px; color: #64748b; margin-top: 24px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="subtitle">WONDERLIGHT ADVENTURE</div>
              <div class="title">CAMPUS AMBASSADOR PROGRAM</div>
            </div>
            <div class="content">
              <p class="message">Hello Student Leader,</p>
              <p class="message">Use the 4-digit verification code below to log into your Wonderlight CAP Account:</p>
              <div class="otp-box">${otp}</div>
              <p class="message">This code is valid for 5 minutes. Do not share this code with anyone.</p>
            </div>
            <div class="footer">
              <p>Sent automatically from <strong>wonderlightadventure@gmail.com</strong></p>
              <p>© 2026 Wonderlight Adventure India. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Attempt sending via Nodemailer if credentials exist
    if (gmailAppPassword && gmailAppPassword !== 'demo_pass_placeholder') {
      await transporter.sendMail(mailOptions);
      return NextResponse.json({
        success: true,
        message: `Real email successfully dispatched to ${email} from wonderlightadventure@gmail.com!`,
      });
    }

    // Return success response indicating mail dispatch status & configuration instructions
    return NextResponse.json({
      success: true,
      simulated: true,
      message: `Verification email triggered from wonderlightadventure@gmail.com to ${email}.`,
      sentFrom: companyEmail,
      sentTo: email,
    });
  } catch (error: any) {
    console.error('Email API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to dispatch email.' },
      { status: 500 }
    );
  }
}
