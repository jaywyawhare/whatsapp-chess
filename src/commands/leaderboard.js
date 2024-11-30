const { Client, MessageMedia } = require('whatsapp-web.js');
const sqlite3 = require('sqlite3').verbose();

// Open the SQLite database
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

                for (let index = 0; index < rows.length; index++) {
                    const row = rows[index];
                    try {
                        const contact = await message.client.getContactById(row.userId);
                        
                        leaderboardMessage += `${index + 1}. ${contact.pushname || contact.number} - Elixir: ${row.elixir}\n`;
                    } catch (err) {
                        console.error('Error fetching user details:', err.message);
                        leaderboardMessage += `${index + 1}. User ID: ${row.userId} - Elixir: ${row.elixir} (Could not fetch contact)\n`;
                    }
                }

                message.reply(leaderboardMessage);
            });
        } catch (err) {
            console.error('Error processing leaderboard command:', err.message);
            message.reply('There was an error while fetching the leaderboard.');
        }
    }
};
