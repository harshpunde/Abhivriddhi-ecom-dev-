const twilio = require('twilio');

let client = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
} else {
  console.warn('Twilio credentials not found or invalid. SMS will not be sent, only logged.');
}

const sendSMS = async (to, message) => {
  try {
    if (!client) {
      console.log(`[MOCK SMS] To: ${to}\nMessage: ${message}`);
      return { success: true, messageId: `mock_${Date.now()}` };
    }

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });

    console.log('SMS sent successfully:', result.sid);
    return {
      success: true,
      messageId: result.sid
    };
  } catch (error) {
    console.error('SMS sending failed:', error);
    throw new Error('SMS could not be sent');
  }
};

const sendOTPBySMS = async (mobile, otp, purpose = 'verification') => {
  const message = `🫘 Abhivriddhi Organics\n\nYour OTP for ${purpose === 'registration' ? 'Registration' : purpose === 'login' ? 'Login' : 'Verification'} is: ${otp}\n\nThis OTP will expire in ${process.env.OTP_EXPIRE_MINUTES || 10} minutes.\n\nDo not share this OTP with anyone.\n\n🌱 Pure • Natural • Traditional`;

  console.log(`\n============================`);
  console.log(`[DEVELOPER OTP] For ${mobile}: ${otp}`);
  console.log(`============================\n`);

  return await sendSMS(mobile, message);
};

module.exports = {
  sendSMS,
  sendOTPBySMS
};