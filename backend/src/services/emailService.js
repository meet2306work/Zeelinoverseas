const nodemailer = require('nodemailer');
const { Resend } = require('resend');


const getVerificationEmailHtml = (name, otp) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700;800&display=swap');
    
    body {
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #ECDFC4;
      color: #1B1B1B;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      background-color: #ECDFC4;
      padding: 40px 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #F5EEDD;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 12px 32px -18px rgba(92, 86, 64, 0.35);
      border: 1px solid #C9BC9A;
    }
    .header {
      background: #161616;
      padding: 35px 30px;
      text-align: center;
      border-bottom: 4px solid #C99A3E;
    }
    .header h1 {
      color: #ECDFC4;
      margin: 0;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 0.08em;
      font-family: 'Playfair Display', Georgia, serif;
    }
    .brand-gold {
      color: #C99A3E;
    }
    .content {
      padding: 45px 35px;
      line-height: 1.7;
    }
    .greeting {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 20px;
      color: #1B1B1B;
      font-family: 'Playfair Display', Georgia, serif;
    }
    .message {
      font-size: 15px;
      color: #5C5640;
      margin-bottom: 30px;
    }
    .otp-container {
      background-color: #161616;
      border-radius: 14px;
      padding: 30px;
      text-align: center;
      margin: 35px 0;
      box-shadow: 0 8px 24px rgba(22, 22, 22, 0.12);
      border: 1px solid #C99A3E;
    }
    .otp-title {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #C9BC9A;
      margin-bottom: 12px;
      font-weight: 700;
    }
    .otp-code {
      font-size: 44px;
      font-weight: 800;
      letter-spacing: 0.3em;
      color: #C99A3E;
      margin: 0;
      font-family: 'DM Sans', sans-serif;
      text-indent: 0.3em;
    }
    .expiry-note {
      font-size: 13px;
      font-weight: 600;
      color: #1B1B1B;
      text-align: center;
      margin-top: 15px;
    }
    .warning {
      font-size: 13px;
      color: #5C5640;
      margin-top: 35px;
      border-top: 1px solid #C9BC9A;
      padding-top: 25px;
    }
    .footer {
      background-color: #161616;
      padding: 30px;
      text-align: center;
      font-size: 12px;
      color: #C9BC9A;
      border-top: 1px solid #C9BC9A;
    }
    .footer strong {
      color: #ECDFC4;
    }
    .footer a {
      color: #C99A3E;
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>ZEELIN <span class="brand-gold">OVERSEAS</span></h1>
      </div>
      <div class="content">
        <div class="greeting">Hello ${name},</div>
        <div class="message">
          Thank you for joining <strong>Zeelin Overseas</strong>. To complete your signup and verify your email address, please use the following one-time verification passcode (OTP):
        </div>
        <div class="otp-container">
          <div class="otp-title">One-Time Verification Passcode</div>
          <div class="otp-code">${otp}</div>
        </div>
        <div class="expiry-note">
          This verification code is valid for 10 minutes.
        </div>
        <div class="warning">
          If you did not request this verification code or register for an account, please disregard this email safely.
        </div>
      </div>
      <div class="footer">
        Regards,<br>
        <strong>Zeelin Overseas Team</strong>
        <br><br>
        &copy; 2026 Zeelin Overseas. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>`;
};

const sendEmail = async (options) => {
  // 1. Try SMTP if configured in environment
  if (process.env.SMTP_HOST) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const emailHtml = options.html || (options.otp && options.name ? getVerificationEmailHtml(options.name, options.otp) : undefined);
      const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER;
      const fromName = process.env.FROM_NAME || 'Zeelin Overseas';

      const mailOptions = {
        from: `"${fromName}" <${fromEmail}>`,
        to: options.email,
        subject: options.subject,
        text: options.message || options.text || `Welcome to Zeelin Overseas! Your verification code is ${options.otp}`,
        html: emailHtml,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully via SMTP. Message ID:', info.messageId);
      return info;
    } catch (error) {
      console.error('SMTP sending failed, falling back to Resend. Error:', error.message || error);
    }
  }

  // 2. Fallback to Resend API
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not configured in environment variables.');
      return false;
    }

    const resend = new Resend(apiKey);
    const emailHtml = options.html || (options.otp && options.name ? getVerificationEmailHtml(options.name, options.otp) : undefined);
    const fromAddress = process.env.SMTP_FROM || 'onboarding@resend.dev';

    const { data, error } = await resend.emails.send({
      from: `${process.env.FROM_NAME || 'Zeelin Overseas'} <${fromAddress}>`,
      to: options.email,
      subject: options.subject,
      text: options.message || options.text || `Welcome to Zeelin Overseas! Your verification code is ${options.otp}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend API Error:', error.message || error);
      return false;
    }

    console.log('Email sent successfully via Resend. Message ID:', data.id);
    return data;
  } catch (error) {
    console.error('Email send failure via Resend:', error.message || error);
    return false;
  }
};

module.exports = sendEmail;
