const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

async function connectToWhatsApp() {
    const authDir = 'auth_info';

    // Create authentication state
    const { state, saveCreds } = await useMultiFileAuthState(authDir);

    const sock = makeWASocket({
        auth: state,
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        printQRInTerminal: false, // We'll handle QR display ourselves
    });

    // Function to generate a random session ID
    function generateSessionId() {
        const prefix = "Queen-Ayodhya";
        const randomChars = crypto.randomBytes(4).toString('hex').substring(0, 7);
        return `${prefix}_${randomChars}`;
    }

    // Handle connection updates
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('\n📌 Scan the QR code below to login:');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'open') {
            console.log('\n✅ Connected to WhatsApp successfully!');

            // Generate and send session ID
            try {
                const sessionId = generateSessionId();
                
                // Save session ID to a file for future reference
                fs.writeFileSync(
                    path.join(__dirname, 'session_id.txt'), 
                    `Session ID: ${sessionId}\nGenerated at: ${new Date().toLocaleString()}`
                );

                // Replace with your WhatsApp number (with country code + no spaces)
                const ownerNumber = '94727270908@s.whatsapp.net';

                await sock.sendMessage(ownerNumber, {
                    text: `✅ Queen-Ayodhya Connected Successfully!\n\nYour Session ID: ${sessionId}\n\nKeep this ID safe for future reference.`
                });

                console.log("📤 Session ID sent to your WhatsApp number!");
                console.log(`Your Session ID: ${sessionId}`);
            } catch (err) {
                console.error("❌ Failed to send session ID:", err);
            }
        }

        if (connection === 'close') {
            const reason = lastDisconnect?.error?.output?.statusCode;

            if (reason === DisconnectReason.loggedOut) {
                console.log('\n⚠️ Session expired. Generating a new QR code...');
                fs.rmSync(path.join(__dirname, authDir), { recursive: true, force: true });
                setTimeout(() => connectToWhatsApp(), 2000);
            } else {
                console.log('\n❌ Connection closed. Reconnecting...');
                setTimeout(() => connectToWhatsApp(), 3000);
            }
        }
    });

    // Save credentials
    sock.ev.on('creds.update', saveCreds);

    // Helper: Extract text from different message types
    function getTextMessage(msg) {
        if (!msg.message) return '';
        
        const messageTypes = [
            'conversation',
            'extendedTextMessage',
            'imageMessage',
            'videoMessage',
            'documentMessage'
        ];
        
        for (const type of messageTypes) {
            if (msg.message[type]) {
                if (type === 'extendedTextMessage') {
                    return msg.message[type].text || '';
                } else if (type === 'imageMessage' || type === 'videoMessage' || type === 'documentMessage') {
                    return msg.message[type].caption || '';
                } else {
                    return msg.message[type] || '';
                }
            }
        }
        
        return '';
    }

    // Handle incoming messages
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const message = messages[0];
        
        // Ignore if message is empty, from status broadcast, or sent by the bot itself
        if (!message.message || 
            message.key.remoteJid === 'status@broadcast' || 
            message.key.fromMe) {
            return;
        }

        const text = getTextMessage(message);
        const from = message.key.remoteJid;
        const sender = message.pushName || 'Unknown';

        console.log(`📨 Message from ${sender}: ${text}`);

        // Check if message is a command
        if (text && text.startsWith('.')) {
            const command = text.slice(1).trim().toLowerCase();
            
            try {
                switch (command) {
                    case 'hello':
                        await sock.sendMessage(from, { text: `Hello ${sender}! 👋 How can I help you?` });
                        break;
                    case 'help':
                        await sock.sendMessage(from, {
                            text: `🤖 Available commands:
• .hello - Greet the bot
• .help - Show this help message
• .time - Get current time
• .ping - Check if bot is alive
• .session - Get your session ID`
                        });
                        break;
                    case 'time':
                        await sock.sendMessage(from, { text: `⏰ Current time: ${new Date().toLocaleString()}` });
                        break;
                    case 'ping':
                        await sock.sendMessage(from, { text: '🏓 Pong! Bot is alive and working!' });
                        break;
                    case 'session':
                        // Read session ID from file or generate a new one
                        let sessionId;
                        try {
                            if (fs.existsSync(path.join(__dirname, 'session_id.txt'))) {
                                const sessionFile = fs.readFileSync(path.join(__dirname, 'session_id.txt'), 'utf-8');
                                const match = sessionFile.match(/Session ID: (.*)/);
                                sessionId = match ? match[1] : generateSessionId();
                            } else {
                                sessionId = generateSessionId();
                            }
                        } catch {
                            sessionId = generateSessionId();
                        }
                        await sock.sendMessage(from, { text: `🔑 Your Session ID: ${sessionId}` });
                        break;
                    default:
                        await sock.sendMessage(from, { text: '❌ Unknown command. Type .help for available commands.' });
                }
                console.log(`✅ Executed command: ${command} for ${sender}`);
            } catch (error) {
                console.error(`❌ Error executing command ${command}:`, error);
                await sock.sendMessage(from, { text: '❌ Sorry, there was an error processing your command.' });
            }
        }
    });
}

// Start the bot
connectToWhatsApp().catch(console.error);
