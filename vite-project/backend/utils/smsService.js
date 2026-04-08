const https = require('https');

/**
 * SMS OTP Service — supports Twilio (primary) and 2Factor (fallback)
 *
 * Twilio bypasses Indian DND completely (international number)
 * → Get credentials: https://console.twilio.com
 *   Account SID starts with "AC..." (NOT "SK...")
 *   Auth Token is below Account SID on the main dashboard
 *   Phone Number: buy a trial number (free with $15 trial credit)
 */

// ─── Twilio ───────────────────────────────────────────────────
const sendViaTwilio = (mobile, otp, purposeLabel) => {
  return new Promise((resolve, reject) => {
    const sid   = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from  = process.env.TWILIO_PHONE_NUMBER;

    if (!sid || !sid.startsWith('AC')) {
      return resolve({ provider: 'twilio', success: false, error: 'Invalid/missing Twilio Account SID (must start with AC)' });
    }

    const phone = mobile.startsWith('+') ? mobile : `+91${mobile.replace(/\D/g, '').slice(-10)}`;
    const body  = `${otp} is your OTP for ${purposeLabel} at Abhivriddhi Organics. Valid for ${process.env.OTP_EXPIRE_MINUTES || 10} minutes. Do not share.`;

    const postData = new URLSearchParams({ To: phone, From: from, Body: body }).toString();

    const options = {
      hostname: 'api.twilio.com',
      path: `/2010-04-01/Accounts/${sid}/Messages.json`,
      method: 'POST',
      auth: `${sid}:${token}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.sid) {
            console.log(`✅ [Twilio] SMS sent to ${phone} | SID: ${parsed.sid}`);
            resolve({ provider: 'twilio', success: true, messageId: parsed.sid });
          } else {
            console.error('❌ [Twilio] Error:', parsed.message || parsed);
            resolve({ provider: 'twilio', success: false, error: parsed.message });
          }
        } catch {
          reject(new Error('Invalid response from Twilio'));
        }
      });
    });

    req.on('error', (e) => {
      console.error('[Twilio] Network error:', e.message);
      resolve({ provider: 'twilio', success: false, error: e.message });
    });

    req.write(postData);
    req.end();
  });
};

// ─── 2Factor ──────────────────────────────────────────────────
const sendVia2Factor = (mobile, otp) => {
  return new Promise((resolve) => {
    const apiKey = process.env.TWOFACTOR_API_KEY;
    if (!apiKey || apiKey === 'your_2factor_api_key_here') {
      return resolve({ provider: '2factor', success: false });
    }
    const phone = mobile.replace(/^\+91/, '').replace(/\D/g, '').slice(-10);
    const path  = `/API/V1/${apiKey}/SMS/${phone}/${otp}/AUTOGEN`;

    const req = https.request({ hostname: '2factor.in', path, method: 'GET' }, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.Status === 'Success') {
            console.log(`✅ [2Factor] SMS sent to +91${phone}`);
            resolve({ provider: '2factor', success: true });
          } else {
            console.warn('⚠️  [2Factor]', parsed.Details || parsed.message);
            resolve({ provider: '2factor', success: false, error: parsed.Details });
          }
        } catch {
          resolve({ provider: '2factor', success: false });
        }
      });
    });
    req.on('error', () => resolve({ provider: '2factor', success: false }));
    req.end();
  });
};

// ─── Main ─────────────────────────────────────────────────────
const sendOTPBySMS = async (mobile, otp, purpose = 'verification') => {
  const purposeLabel = purpose === 'registration' ? 'Registration'
    : purpose === 'login' ? 'Login' : 'Verification';

  console.log(`\n${'='.repeat(50)}`);
  console.log(`📱 OTP | ${purposeLabel} | Mobile: ${mobile} | Code: ${otp}`);
  console.log(`${'='.repeat(50)}\n`);

  // 1️⃣ Try Twilio first (bypasses DND, international number)
  const twilioSid = process.env.TWILIO_ACCOUNT_SID || '';
  if (twilioSid.startsWith('AC')) {
    const result = await sendViaTwilio(mobile, otp, purposeLabel);
    if (result.success) return result;
    console.warn('⚠️  Twilio failed, trying 2Factor...');
  }

  // 2️⃣ Try 2Factor
  const result2f = await sendVia2Factor(mobile, otp);
  if (result2f.success) return result2f;

  // 3️⃣ Console fallback — OTP is in DB, login still works
  console.warn('⚠️  All SMS providers failed. OTP printed to console above.');
  console.warn('   Your number may be DND. Dial 1909 to remove DND, or use email OTP.\n');
  return { provider: 'console', success: false };
};

// ─── Custom SMS (Twilio Only) ──────────────────────────────────
const sendCustomSMS = (mobile, message) => {
  return new Promise((resolve) => {
    const sid   = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from  = process.env.TWILIO_PHONE_NUMBER;

    if (!sid || !sid.startsWith('AC')) {
      console.log(`\n[MOCK SMS] To: ${mobile} | Message: ${message}\n`);
      return resolve({ success: true, provider: 'mock' });
    }

    const phone = mobile.startsWith('+') ? mobile : `+91${mobile.replace(/\D/g, '').slice(-10)}`;
    const postData = new URLSearchParams({ To: phone, From: from, Body: message }).toString();

    const options = {
      hostname: 'api.twilio.com',
      path: `/2010-04-01/Accounts/${sid}/Messages.json`,
      method: 'POST',
      auth: `${sid}:${token}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = ''; res.on('data', (c) => { data += c; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.sid) {
            console.log(`✅ [Twilio] Order SMS sent to ${phone}`);
            resolve({ success: true });
          } else resolve({ success: false });
        } catch { resolve({ success: false }); }
      });
    });
    req.on('error', () => resolve({ success: false }));
    req.write(postData);
    req.end();
  });
};

const sendOrderConfirmationSMS = async (mobile, orderId) => {
  const shortId = String(orderId).slice(-8).toUpperCase();
  const message = `Thanks for shopping at Abhivriddhi Organics! Your order INV-${shortId} is confirmed and will be shipped soon. Pure. Natural. Traditional.`;
  return await sendCustomSMS(mobile, message);
};

const sendSMS = sendOTPBySMS;
module.exports = { sendSMS, sendOTPBySMS, sendOrderConfirmationSMS };