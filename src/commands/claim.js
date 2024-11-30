const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./user_data.db');

module.exports = {
    name: 'claim',
    description: 'Claim random drops elixir with a 69-second cooldown and random chance',

    /**
     * Executes the claim command to add a random amount of elixir to a user.
     * @param {object} message - The message object from whatsapp-web.js.
     * @param {Array<string>} args - Arguments passed along with the command.
     */
    execute(message, args) {
        const userId = message.from;

        const elixirAmount = Math.floor(Math.random() * 41) + 10;

        const randomDropChance = Math.random();

        if (randomDropChance < 0.3) {
            return message.reply('You did not receive an elixir drop this time. Try again later!');
        }

        const currentTime = Math.floor(Date.now() / 1000); 

        db.get('SELECT * FROM users WHERE userId = ?', [userId], (err, row) => {
            if (err) {
                console.error('Error checking user in database:', err.message);
                return message.reply('There was an error while processing your claim. Please try again later.');
            }

            if (row) {
                const timeDifference = currentTime - row.lastClaimTime;

                if (timeDifference < 69) {
                    const remainingTime = 69 - timeDifference;
                    return message.reply(`You can only claim once every 69 seconds. Please wait ${remainingTime} more second(s) to claim again.`);
                }
                
                db.run('UPDATE users SET elixir = elixir + ?, lastClaimTime = ? WHERE userId = ?', [elixirAmount, currentTime, userId], (err) => {
                    if (err) {
                        console.error('Error updating user balance:', err.message);
                        return message.reply('There was an error updating your balance. Please try again later.');
                    }

                    message.reply(`You have successfully claimed ${elixirAmount} elixir! 🎉 Your new balance is ${row.elixir + elixirAmount} elixir.`);
                });
            } else {
                db.run('INSERT INTO users (userId, elixir, lastClaimTime) VALUES (?, ?, ?)', [userId, elixirAmount, currentTime], (err) => {
                    if (err) {
                        console.error('Error inserting user into database:', err.message);
                        return message.reply('There was an error while processing your claim. Please try again later.');
                    }

                    message.reply(`You have successfully claimed ${elixirAmount} elixir! 🎉 Your new balance is ${elixirAmount} elixir.`);
                });
            }
        });
    }
};
