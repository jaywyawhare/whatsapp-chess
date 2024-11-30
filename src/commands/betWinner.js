const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const db = new sqlite3.Database('./user_data.db');
const allowedUserId = process.env.ALLOWED_USER_ID;

let activeBets = {}; 
let currentBetResult = null;
let bettingActive = false;

const odds = {
    gukesh: 2.5,
    ding: 3.5,  
    draw: 1.5   
};

const BETTING_CUTOFF_HOUR = 16; 
const BETTING_CUTOFF_MINUTE = 30;

module.exports = {
    name: 'betWinner',
    description: 'Handles declaring the result and processing PlayerBet payouts',

    /**
     * Executes the result declaration and payout logic for PlayerBets.
     * @param {object} message - The message object from whatsapp-web.js.
     * @param {Array<string>} args - Arguments passed along with the command.
     */
    execute(message, args) {
        const senderId = message.from;
        const content = message.body.trim().toLowerCase();

        if (!content.startsWith('=>')) {
            return;
        }

        const command = content.slice(2).trim();

        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();

        if (currentHour > BETTING_CUTOFF_HOUR || (currentHour === BETTING_CUTOFF_HOUR && currentMinute > BETTING_CUTOFF_MINUTE)) {
            return message.reply("Betting is closed for today. The cutoff time is 16:30.");
        }

        if (command === 'gamestart') {
            if (senderId !== allowedUserId) {
                return message.reply("You are not authorized to start the game.");
            }

            if (bettingActive) {
                return message.reply("Betting has already started.");
            }

            bettingActive = true;
            activeBets = {};  
            return message.reply("Betting has started! Place your bets.");
        }

        if (command.startsWith('gameend ')) {
            if (senderId !== allowedUserId) {
                return message.reply("You are not authorized to end the game.");
            }

            if (!bettingActive) {
                return message.reply("Betting is not currently active.");
            }

            const [finalResult] = command.split(' ').slice(1);

            if (!finalResult || !['ding', 'gukesh', 'draw'].includes(finalResult)) {
                return message.reply("Invalid final result. Please provide a valid result: 'ding', 'gukesh', or 'draw'.");
            }

            currentBetResult = finalResult;
            let globalSummaryMessage = "Betting Results Summary:\n\n";
            let finalMessages = [];

            Object.keys(activeBets).forEach(userId => {
                const userBets = activeBets[userId];
                let totalElixirChange = 0;
                let userSummaryMessage = `${userId}'s Bets:\n`;

                userBets.forEach(bet => {
                    const userElixirAmount = bet.amount;
                    const userBetOutcome = bet.outcome;
                    const userName = bet.userName;
                    const isWinner = userBetOutcome === currentBetResult;

                    db.get('SELECT * FROM users WHERE userID = ?', [userId], (err, row) => {
                        if (err) {
                            console.error('Error checking user balance:', err.message);
                            return;
                        }

                        let newElixirAmount = row.Elixir;

                        if (userElixirAmount > row.Elixir) {
                            message.reply(`${userName}, you do not have enough Elixir to place this bet.`);
                            return;
                        }

                        if (isWinner) {
                            const winAmount = userElixirAmount * odds[currentBetResult];
                            newElixirAmount += winAmount;
                            totalElixirChange += winAmount;
                            userSummaryMessage += `- You won the bet on ${currentBetResult} and earned ${winAmount} Elixir.\n`;
                        } else {
                            newElixirAmount -= userElixirAmount;
                            totalElixirChange -= userElixirAmount;
                            userSummaryMessage += `- You lost the bet on ${userBetOutcome}.\n`;
                        }

                        db.run('UPDATE users SET Elixir = ? WHERE userID = ?', [newElixirAmount, userId], (err) => {
                            if (err) {
                                console.error('Error updating user balance:', err.message);
                            }
                        });

                        finalMessages.push(userSummaryMessage);
                    });
                });

                globalSummaryMessage += `${userSummaryMessage}Total Elixir Change: ${totalElixirChange}\n\n`;
            });

            bettingActive = false;
            activeBets = {};

            finalMessages.forEach(userMessage => {
                message.reply(userMessage);
            });

            message.reply(globalSummaryMessage);
            message.reply(`Betting results are in! The final result was '${currentBetResult}'.`);

        } else if (command.startsWith('betwinner ')) {
            if (!bettingActive) {
                return message.reply("Betting is not currently active. Please wait until the game starts.");
            }

            const [betOutcome, betAmount] = command.split(' ').slice(1);

            if (!betOutcome || !['ding', 'gukesh', 'draw'].includes(betOutcome)) {
                return message.reply("Invalid bet outcome. Please choose from: 'ding', 'gukesh', or 'draw'.");
            }

            if (!betAmount || isNaN(betAmount) || parseInt(betAmount) <= 0) {
                return message.reply("Please provide a valid bet amount.");
            }

            const betAmountInt = parseInt(betAmount);
            const userId = senderId;

            db.get('SELECT * FROM users WHERE userID = ?', [userId], (err, row) => {
                if (err) {
                    console.error('Error checking user balance:', err.message);
                    return;
                }

                if (row.Elixir < betAmountInt) {
                    return message.reply("You do not have enough Elixir to place this bet.");
                }

                if (!activeBets[userId]) {
                    activeBets[userId] = [];
                }

                activeBets[userId].push({
                    outcome: betOutcome,
                    amount: betAmountInt,
                    userName: row.userWhatsAppName
                });

                message.reply(`Bet placed! You have bet ${betAmountInt} Elixir on ${betOutcome}.`);
            });

        } else {
            message.reply("Invalid command. Please use '=>betwinner {outcome} {amount}'.");
        }
    },

    /**
     * Set the active bets for PlayerBet.
     * @param {object} bets - The active bets placed during the PlayerBet window.
     */
    setActiveBets(bets) {
        activeBets = bets;
    }
};
