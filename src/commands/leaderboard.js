const { Client, MessageMedia } = require('whatsapp-web.js');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./user_data.db');

module.exports = {
    name: 'leaderboard',
    description: 'Show the top 5 users with the highest elixir balances',

    /**
     * Executes the leaderboard command to display the top 5 users with the highest elixir.
     * @param {object} message - The message object from WhatsApp.
     * @param {Array<string>} args - Arguments passed along with the command.
     */
    execute: async (message, args) => {
        try {
            db.all('SELECT userId, elixir FROM users ORDER BY elixir DESC LIMIT 5', [], async (err, rows) => {
                if (err) {
                    console.error('Error fetching leaderboard:', err.message);
                    return message.reply('There was an error retrieving the leaderboard. Please try again later.');
                }

                if (rows.length === 0) {
                    return message.reply('No users found in the leaderboard.');
                }

                let leaderboardMessage = '**Top 5 Users with the Highest Elixir**\n\n';
                
                const mentions = [];

                rows.forEach((row, index) => {
                    const userId = row.userId;
                    const elixir = row.elixir;

                    const userIdShort = userId.match(/\d{12}/);

                    if (userIdShort) {
                        const userIdWithTag = `${userIdShort[0]}@c.us`;  // Example: +123456789012@c.us

                        leaderboardMessage += `*${index + 1}.* @${userIdShort[0]} - ${elixir} Elixir\n`;

                        mentions.push(userIdWithTag);
                    }
                });

                message.reply(leaderboardMessage, null, { mentions });
            });
        } catch (err) {
            console.error('Error processing leaderboard command:', err.message);
            message.reply('There was an error while fetching the leaderboard.');
        }
    }
};
