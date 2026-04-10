const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let client;
let isReady = false;

/**
 * Initialize WhatsApp Client
 */
const initializeWhatsApp = () => {
    console.log('\n[WhatsApp] Initializing client...');
    
    client = new Client({
        authStrategy: new LocalAuth({
            dataPath: './.wwebjs_auth'
        }),
        webVersionCache: {
            type: 'remote',
            remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.3000.1014766952-alpha.html',
        },
        puppeteer: {
            headless: true, // Use stable headless mode
            handleSIGINT: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu',
                '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            ],
        }
    });

    client.on('qr', (qr) => {
        console.log('\n' + '='.repeat(50));
        console.log('📱 SCAN THIS QR CODE WITH YOUR WHATSAPP');
        console.log('='.repeat(50));
        
        const qrLink = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}&size=300x300`;
        console.log(`\n🔗 Link to scan: \x1b[36m${qrLink}\x1b[0m\n`);

        qrcode.generate(qr, { small: true });
    });

    client.on('loading_screen', (percent, message) => {
        console.log(`[WhatsApp] Loading: ${percent}% - ${message}`);
    });

    client.on('ready', () => {
        console.log('\n' + '='.repeat(50));
        console.log('✅ [WhatsApp] Client is READY and CONNECTED!');
        console.log('='.repeat(50) + '\n');
        isReady = true;
    });

    client.on('authenticated', () => {
        console.log('✅ [WhatsApp] Authenticated successfully');
    });

    client.on('auth_failure', (msg) => {
        console.error('❌ [WhatsApp] Authentication failure:', msg);
        isReady = false;
    });

    client.on('disconnected', (reason) => {
        console.log('❌ [WhatsApp] Client disconnected:', reason);
        isReady = false;
        // Try to re-initialize after a delay
        setTimeout(initializeWhatsApp, 5000);
    });

    client.initialize().catch(err => {
        console.error('❌ [WhatsApp] Initialization error:', err.message);
        if (err.message.includes('Execution context was destroyed')) {
            console.log('[WhatsApp] Retrying initialization in 5 seconds...');
            setTimeout(initializeWhatsApp, 5000);
        }
    });
};

/**
 * Send WhatsApp Message
 * @param {string} mobile - 10 digit mobile number
 * @param {string} message - Message text
 */
const sendWhatsAppMessage = async (mobile, message) => {
    if (!isReady) {
        console.warn('⚠️ [WhatsApp] Client not ready. Message could not be sent.');
        return { success: false, error: 'WhatsApp not ready' };
    }

    try {
        // Clean mobile number - must be in format '91XXXXXXXXXX@c.us'
        const cleanNumber = mobile.replace(/\D/g, '');
        const chatId = cleanNumber.length === 10 ? `91${cleanNumber}@c.us` : `${cleanNumber}@c.us`;
        
        console.log(`[WhatsApp] Sending message to ${chatId}...`);
        await client.sendMessage(chatId, message);
        console.log(`✅ [WhatsApp] Message sent successfully to ${chatId}`);
        return { success: true };
    } catch (err) {
        console.error(`❌ [WhatsApp] Message FAILED to ${mobile}:`, err.message);
        return { success: false, error: err.message };
    }
};

module.exports = {
    initializeWhatsApp,
    sendWhatsAppMessage,
    getIsWhatsAppReady: () => isReady
};
