const { Resend } = require('resend');


const getVerificationEmailHtml = (name, otp) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      color: #334155;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
    }
    .header {
      background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.025em;
    }
    .content {
      padding: 40px 30px;
      line-height: 1.6;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #0f172a;
    }
    .message {
      font-size: 16px;
      color: #475569;
      margin-bottom: 24px;
    }
    .otp-container {
      background-color: #f1f5f9;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin: 30px 0;
      border: 1px dashed #cbd5e1;
    }
    .otp-code {
      font-size: 36px;
      font-weight: 800;
      letter-spacing: 0.25em;
      color: #0d9488;
      margin: 0;
    }
    .expiry {
      font-size: 14px;
      color: #64748b;
      text-align: center;
      margin-top: 10px;
    }
    .warning {
      font-size: 14px;
      color: #94a3b8;
      margin-top: 30px;
      border-top: 1px solid #e2e8f0;
      padding-top: 20px;
    }
    .footer {
      background-color: #f8fafc;
      padding: 20px 30px;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
    }
    .footer a {
      color: #0d9488;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="color: #ffffff; margin: 0; font-family: 'Helvetica Neue', Arial, sans-serif;">ZEELIN OVERSEAS</h1>
    </div>
    <div class="content">
      <div class="greeting">Hello ${name},</div>
      <div class="message">
        Thank you for registering.
      </div>
      <div class="message" style="font-weight: 600; color: #0f172a;">
        Your verification code is
      </div>
      <div class="otp-container">
        <div class="otp-code">${otp}</div>
      </div>
      <div class="message">
        This code will expire in 10 minutes.
      </div>
      <div class="warning">
        If you didn't request this account, please ignore this email.
      </div>
    </div>
    <div class="footer">
      Regards,<br>
      <strong>Company Team</strong>
      <br><br>
      &copy; 2026 Zeelin Overseas. All rights reserved.
    </div>
  </div>
</body>
</html>`;
};

const sendEmail = async (options) => {
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
