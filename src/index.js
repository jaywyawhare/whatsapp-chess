const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const dotenv = require('dotenv');
const { createTable, fillUsers } = require('./db/initDB');

const { betWinner } = require('./commands/betWinner');
const { claim } = require('./commands/claim');
const { help } = require('./commands/help');
const { intro } = require('./commands/intro');
const { leaderboard } = require('./commands/leaderboard');
const { liveRating } = require('./commands/liveRating');
const { meme } = require('./commands/meme');
const { menu } = require('./commands/menu');
const { odds } = require('./commands/odds');
const { ping } = require('./commands/ping');
const { refill } = require('./commands/refill');
const { stickers } = require('./commands/stickers');
const { unixporn } = require('./commands/unixporn');

dotenv.config();

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

        if (senderId === allowedUserId) {
            try {
                switch (command) {
                    case 'betwinner':
                        await betWinner(message, args);
                        break;
                    case 'claim':
                        await claim(message, args);
                        break;
                    case 'help':   
                        await help(message, args);
                        break;
                    case 'intro':
                        await intro(message, args);
                        break;
                    case 'leaderboard':
                        await leaderboard(message, args);
                        break;
                    case 'liverating':
                        await liveRating(message, args);
                        break;
                    case 'meme':
                        await meme(message, args);
                        break;
                    case 'menu':
                        await menu(message, args);
                        break;
                    case 'odds':
                        await odds(message, args);
                        break;
                    case 'ping':
                        await ping(message, args);
                        break;
                    case 'refill':
                        await refill(message, args);
                        break;
                    case 'stickers':
                        await stickers(message, args);
                        break;
                    case 'unixporn':
                        await unixporn(message, args);
                        break;
                    case 'betachat': 
                        if (senderId === allowedUserId) {
                            const chat = await message.getChat();
                            const participants = chat.participants;
                            fillUsers(participants); 
                            message.reply('All group members have been added to the database!');
                        }
                        else {
                            message.reply('You do not have permission to use this command.');
                        }
                        break;
                    default:
                        await message.reply('Invalid command. Please use =>menu to see available commands.');
                }
            } catch (error) {
                console.error('Error handling command:', error);
                await message.reply('An error occurred while processing your request.');
            }
        } else {
            message.reply(`You do not have permission to use this command. Only the authorized user can execute this.`);
        }
    }
});

client.initialize();
