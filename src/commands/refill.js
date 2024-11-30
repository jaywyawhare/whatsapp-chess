const sqlite3 = require('sqlite3').verbose();
require('dotenv').config(); 

const db = new sqlite3.Database('./user_data.db');

const warning = require('./warning');

module.exports = {
    name: 'refill',
    description: 'Refill the elixir balance of a tagged user, only if sent by the specific user.',

    /**
     * Executes the refill command to add a specified amount of elixir to a tagged user.
     * @param {object} message - The message object from whatsapp-web.js.
     * @param {Array<string>} args - Arguments passed along with the command (tagged user and amount).
     */
    execute(message, args) {
        const senderId = message.from;
        const taggedUser = args[0]; 
        const refillAmount = parseInt(args[1]);

        const allowedUserId = process.env.ALLOWED_USER_ID;

        if (senderId === allowedUserId) {
            if (!taggedUser || isNaN(refillAmount)) {
                return message.reply('Please tag a valid user and specify a valid amount.');
            }

            db.get('SELECT * FROM users WHERE userId = ?', [taggedUser], (err, row) => {
                if (err) {
                    console.error('Error checking user in database:', err.message);
                    return message.reply('There was an error while processing the refill. Please try again later.');
                }

                if (row) {
                    db.run('UPDATE users SET elixir = elixir + ? WHERE userId = ?', [refillAmount, taggedUser], (err) => {
                        if (err) {
                            console.error('Error updating user balance:', err.message);
                            return message.reply('There was an error updating the balance. Please try again later.');
                        }

                        message.reply(`You have successfully refilled ${taggedUser}'s elixir with ${refillAmount} elixir! 🎉`);
                    });
                } else {
                    db.run('INSERT INTO users (userId, elixir) VALUES (?, ?)', [taggedUser, 0], (err) => {
                        if (err) {
                            console.error('Error inserting new user into database:', err.message);
                            return message.reply('There was an error adding the user to the system. Please try again later.');
                        }

                        db.run('UPDATE users SET elixir = elixir + ? WHERE userId = ?', [refillAmount, taggedUser], (err) => {
                            if (err) {
                                console.error('Error updating user balance after refill:', err.message);
                                return message.reply('There was an error updating the balance. Please try again later.');
                            }

                            message.reply(`You have successfully refilled ${taggedUser}'s elixir with ${refillAmount} elixir! 🎉`);
                        });
                    });
                }
            });
        } else {
            warning.execute(message, []);
        }
    }
};
