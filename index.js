const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');

    const sock = makeWASocket({
        auth: state,
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
    });

    // Handle connection updates
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('\n📌 Scan the QR code below to login:');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'open') {
            console.log('\n✅ Connected to WhatsApp successfully!');
        }

        if (connection === 'close') {
            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

            console.log(`\n❌ Connection closed. ${shouldReconnect ? 'Reconnecting...' : 'Logged out.'}`);

            if (shouldReconnect) {
                setTimeout(() => connectToWhatsApp(), 3000); // Reconnect after 3s
            }
        }
    });

    // Save credentials
    sock.ev.on('creds.update', saveCreds);

    // Helper: Extract text from different message types
    function getTextMessage(msg) {
        return (
            msg.message?.conversation ||
            msg.message?.extendedTextMessage?.text ||
            msg.message?.imageMessage?.caption ||
            msg.message?.videoMessage?.caption ||
            ''
        );
    }

    // Handle incoming messages
    sock.ev.on('messages.upsert', async (m) => {
        const message = m.messages[0];

        if (!message.message || message.key.remoteJid === 'status@broadcast') return;

        const text = getTextMessage(message);
        const from = message.key.remoteJid;
        const sender = message.pushName || 'Unknown';

        console.log(`📨 Message from ${sender}: ${text}`);

        if (text.startsWith('!')) {
            const command = text.slice(1).trim().toLowerCase();

            switch (command) {
                case 'hello':
                    await sock.sendMessage(from, { text: `Hello ${sender}! 👋 How can I help you?` });
                    break;

                case 'help':
                    await sock.sendMessage(from, {
                        text: `🤖 Available commands:
• !hello - Greet the bot
• !help - Show this help message
• !time - Get current time
• !ping - Check if bot is alive`,
                    });
                    break;

                case 'time':
                    await sock.sendMessage(from, {
                        text: `⏰ Current time: ${new Date().toLocaleString()}`,
                    });
                    break;

                case 'ping':
                    await sock.sendMessage(from, {
                        text: '🏓 Pong! Bot is alive and working!',
                    });
                    break;

                default:
                    await sock.sendMessage(from, {
                        text: '❌ Unknown command. Type !help for available commands.',
                    });
            }
        }
    });
}

// Start the bot
connectToWhatsApp().catch(console.error);
