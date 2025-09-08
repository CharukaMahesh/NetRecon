const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

async function connectToWhatsApp() {
    const authDir = 'auth_info';
    const { state, saveCreds } = await useMultiFileAuthState(authDir);

    const sock = makeWASocket({
        auth: state,
        markOnlineOnConnect: true
    });

    // Connection updates
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'open') {
            console.log('✅ Queen-Ayodhya has been connected!');

            // Send welcome message to yourself (replace with your number)
            const ownerNumber = '94727270908@s.whatsapp.net';
            await sock.sendMessage(ownerNumber, { text: '✅ Queen-Ayodhya Bot is online!' });
        }

        if (connection === 'close') {
            const reason = lastDisconnect?.error?.output?.statusCode;
            console.log('❌ Connection closed. Reconnecting...');
            setTimeout(() => connectToWhatsApp(), 3000);
        }
    });

    // Save credentials
    sock.ev.on('creds.update', saveCreds);

    // Helper: get text from different message types
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

        // Ignore status or messages without content
        if (!message.message || message.key.remoteJid === 'status@broadcast') return;

        const from = message.key.remoteJid;
        const sender = message.pushName || 'Unknown';
        const text = getTextMessage(message);

        // Only respond to user messages (ignore bot's own messages)
        if (message.key.fromMe) return;

        console.log(`📨 Message from ${sender}: ${text}`);

        if (text.startsWith('.')) {
            const command = text.slice(1).trim().toLowerCase();

            switch (command) {
                case 'hello':
                    await sock.sendMessage(from, { text: `Hello ${sender}! 👋` });
                    break;

                case 'help':
                    await sock.sendMessage(from, {
                        text: '🤖 Commands:\n.hello\n.help\n.time\n.ping'
                    });
                    break;

                case 'time':
                    await sock.sendMessage(from, { text: `⏰ Current time: ${new Date().toLocaleString()}` });
                    break;

                case 'ping':
                    await sock.sendMessage(from, { text: '🏓 Pong! Bot is alive.' });
                    break;

                default:
                    await sock.sendMessage(from, { text: '❌ Unknown command. Type .help for commands.' });
            }
        }
    });
}

// Start the bot
connectToWhatsApp().catch(console.error);
