const nodemailer = require('nodemailer');
const dns = require('dns').promises;
const net = require('net');

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
    const originalHost = process.env.SMTP_HOST;
    let resolvedHost = originalHost;

    // Resolve host to IPv4 if it's a hostname to bypass Render's IPv6 networking bugs
    if (originalHost && !net.isIP(originalHost)) {
      try {
        const lookup = await dns.lookup(originalHost, { family: 4 });
        resolvedHost = lookup.address;
        console.log(`DNS Lookup: Resolved ${originalHost} to IPv4 ${resolvedHost}`);
      } catch (dnsError) {
        console.warn(`DNS Lookup failed for ${originalHost}, falling back to original hostname:`, dnsError.message);
      }
    }

    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: resolvedHost,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        // Ensure servername is set to original hostname for valid TLS certificate validation
        servername: originalHost,
        rejectUnauthorized: true,
      },
    });


    const emailHtml = options.html || (options.otp && options.name ? getVerificationEmailHtml(options.name, options.otp) : undefined);

    // Define email options
    const message = {
      from: `${process.env.FROM_NAME || 'Zeelin Overseas'} <${process.env.SMTP_FROM || process.env.FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message || options.text || `Welcome to Zeelin Overseas! Your verification code is ${options.otp}`,
      html: emailHtml,
    };

    // Send email
    const info = await transporter.sendMail(message);
    console.log('Email sent successfully: %s', info.messageId);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('✉️ Email Preview URL (Open in browser): %s', previewUrl);
    }
    return info;
  } catch (error) {
    console.error('Email send failure:', error.message || error);
    // Do not crash the server, return false
    return false;
  }
};

module.exports = sendEmail;
