require('dotenv').config();

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { createTable, fillUsers } = require('./db/initDB');

const help = require('./commands/help');
const intro = require('./commands/intro');
const meme = require('./commands/meme');
const menu = require('./commands/menu');
const odds = require('./commands/odds');
const ping = require('./commands/ping');
const unixporn = require('./commands/unixporn');

const client = new Client({
    authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Scan the QR code to log in!');
});

client.on('ready', () => {
    console.log('Client is ready!');
    createTable();
});

client.on('message', async (message) => {
    if (message.body.startsWith('=>')) {
        const args = message.body.slice(2).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        const senderId = message.from;
        const allowedUserId = process.env.ALLOWED_USER_ID;

        try {
            switch (command) {
                case 'help':   
                    await help.execute(message, args);
                    break;
                case 'intro':
                    await intro.execute(message, args); 
                    break;
                case 'meme':
                    await meme.execute(message, args);
                    break;
                case 'menu':
                    await menu.execute(message, args);
                    break;
                case 'odds':
                    await odds.execute(message, args);
                    break;
                case 'ping':
                    await ping.execute(message, args);
                    break;
                case 'unixporn':
                    await unixporn.execute(message, args);
                    break;
                default:
                    await message.reply('Invalid command. Please use =>menu to see available commands.');
            }
        } catch (error) {
            console.error('Error handling command:', error);
            await message.reply('An error occurred while processing your request.');
        }
    }
});

client.initialize();
