const nodemailer = require('nodemailer');

// ── Create transporter (lazy singleton) ──────────────────────
let _transporter = null;

const getTransporter = () => {
  if (_transporter) return _transporter;

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || user.includes('your_email') || !pass || pass.includes('your_app_password')) {
    return null; // not configured
  }

  _transporter = nodemailer.createTransport({
    host:   process.env.EMAIL_HOST   || 'smtp.gmail.com',
    port:   parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: { user, pass }
  });
  return _transporter;
};

// ── Core send ─────────────────────────────────────────────────
const sendEmail = async ({ email, subject, html, attachments = [] }) => {
  const transporter = getTransporter();

  if (!transporter) {
    console.log(`\n[MOCK EMAIL] To: ${email} | Subject: ${subject}`);
    return { success: true, messageId: `mock_${Date.now()}` };
  }

  const info = await transporter.sendMail({
    from: `"Abhivriddhi Organics 🌱" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html,
    attachments
  });

  console.log(`✅ Email sent to ${email} | messageId: ${info.messageId}`);
  return { success: true, messageId: info.messageId };
};

// ── OTP Email ─────────────────────────────────────────────────
const sendOTPByEmail = async (email, otp, purpose = 'verification') => {
  const label = purpose === 'registration' ? 'Registration'
    : purpose === 'login' ? 'Login' : 'Verification';
  const subject = `${otp} — Your OTP for ${label} | Abhivriddhi Organics`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f1f5f9; margin: 0; padding: 20px; }
    .card { max-width: 500px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,.08); }
    .header { background: linear-gradient(135deg,#1a3d0c,#4a7c23); color: #fff; padding: 32px 28px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; }
    .header p { margin: 6px 0 0; opacity: .8; font-size: 13px; }
    .body { padding: 32px 28px; }
    .otp-box { background: #f0fdf4; border: 2px dashed #4a7c23; border-radius: 12px; text-align: center; padding: 24px; margin: 20px 0; }
    .otp-code { font-size: 40px; font-weight: 900; letter-spacing: 10px; color: #1a3d0c; }
    .expire { font-size: 13px; color: #64748b; margin-top: 8px; }
    .warning { background: #fff7ed; border-left: 4px solid #f97316; padding: 12px 16px; border-radius: 0 8px 8px 0; font-size: 13px; color: #9a3412; margin-top: 20px; }
    .footer { background: #f8fafc; text-align: center; padding: 18px; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>🫘 Abhivriddhi Organics</h1>
      <p>Your ${label} OTP</p>
    </div>
    <div class="body">
      <p style="color:#374151">Hello! Your One-Time Password for <strong>${label}</strong> is:</p>
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
        <div class="expire">⏱ Valid for ${process.env.OTP_EXPIRE_MINUTES || 10} minutes</div>
      </div>
      <div class="warning">⚠️ <strong>Never share this OTP</strong> with anyone. Abhivriddhi Organics will never ask for your OTP.</div>
    </div>
    <div class="footer">🌱 Pure • Natural • Traditional | Abhivriddhi Organics</div>
  </div>
</body>
</html>`;

  console.log(`\n============================`);
  console.log(`[EMAIL OTP] To: ${email} | Code: ${otp} | Purpose: ${label}`);
  console.log(`============================\n`);

  return await sendEmail({ email, subject, html });
};

// ── Invoice Email ─────────────────────────────────────────────
const sendInvoiceEmail = async (email, order, invoiceHtml) => {
  const orderId = String(order._id).slice(-8).toUpperCase();
  const subject = `✅ Order Confirmed — INV-${orderId} | Abhivriddhi Organics`;
  return await sendEmail({ email, subject, html: invoiceHtml });
};

module.exports = { sendEmail, sendOTPByEmail, sendInvoiceEmail };