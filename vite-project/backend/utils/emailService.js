const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER.includes('your_email@gmail.com')) {
      console.log(`[MOCK EMAIL] To: ${options.email}\nSubject: ${options.subject}\nBody (HTML length): ${options.html?.length}`);
      return { success: true, messageId: `mock_email_${Date.now()}` };
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Define email options
    const mailOptions = {
      from: `"Abhivriddhi Organics" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Email could not be sent');
  }
};

const sendOTPByEmail = async (email, otp, purpose = 'verification') => {
  const subject = `Your OTP for ${purpose === 'registration' ? 'Registration' : purpose === 'login' ? 'Login' : 'Verification'} - Abhivriddhi Organics`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>OTP Verification</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1a3d0c, #2d5a1f); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: white; border: 2px solid #1a3d0c; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
        .otp-code { font-size: 32px; font-weight: bold; color: #1a3d0c; letter-spacing: 5px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .warning { color: #d9534f; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🫘 Abhivriddhi Organics</h1>
          <p>100% Organic • Gluten Free • Chemical Free</p>
        </div>
        <div class="content">
          <h2>OTP Verification</h2>
          <p>Hello,</p>
          <p>Your One-Time Password (OTP) for ${purpose === 'registration' ? 'account registration' : purpose === 'login' ? 'secure login' : 'account verification'} is:</p>

          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>

          <p><strong>This OTP will expire in ${process.env.OTP_EXPIRE_MINUTES || 10} minutes.</strong></p>
          <p>If you didn't request this OTP, please ignore this email.</p>

          <div class="footer">
            <p class="warning">⚠️ Do not share this OTP with anyone for security reasons.</p>
            <p>Thank you for choosing Abhivriddhi Organics!</p>
            <p>🌱 Pure • Natural • Traditional</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  console.log(`\n============================`);
  console.log(`[DEVELOPER OTP] For ${email}: ${otp}`);
  console.log(`============================\n`);

  return await sendEmail({
    email,
    subject,
    html
  });
};

module.exports = {
  sendEmail,
  sendOTPByEmail
};