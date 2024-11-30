const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database('./user_data.db');

const createTable = () => {
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, userId TEXT UNIQUE, elixir INTEGER DEFAULT 0, lastClaimTime INTEGER DEFAULT 0)', (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Table created or already exists.');
        }
    });
};

const fillUsers = (participants) => {
    participants.forEach((participant) => {
        db.get('SELECT userId FROM users WHERE userId = ?', [participant.id.user], (err, row) => {
            if (err) {
                console.error('Error checking user existence:', err.message);
                return;
            }

            if (!row) {
                const currentTime = Math.floor(Date.now() / 1000); 
                db.run('INSERT INTO users (userId, elixir, lastClaimTime) VALUES (?, ?, ?)', [participant.id.user, 0, currentTime], (err) => {
                    if (err) {
                        console.error('Error inserting user:', err.message);
                    } else {
                        console.log(`User ${participant.id.user} added with 0 elixir and current timestamp.`);
                    }
                });
            } else {
                console.log(`User ${participant.id.user} already exists.`);
            }
        });
    });
};



module.exports = {
    createTable,
    fillUsers,
};
