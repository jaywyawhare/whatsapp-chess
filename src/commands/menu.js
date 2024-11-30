module.exports = {
    name: 'menu',
    description: 'Displays available commands',
    execute(message, args) {
        const helpMessage = `Available commands:
- *menu*: Displays available commands
- *help*: Displays detailed information about the available commands
- *stickers*: Convert images to stickers
- *ping*: Checks if the bot is responsive
- *livePosition*: Fetches and sends live chess positions
- *liveEval*: Fetches and sends live chess evaluations
- *claim*: Claim random drops elixir
- *refill*: Refill your elixir
- *leaderboard*: Display the group leaderboard
- *liveRating*: Display the top 10 chess players
- *guessTheEvalBet*: Guess the evaluation of the current chess position
- *resultBet*: Bet on the result of the current game
- *nextMoveBet*: Bet on the next move in the current game
- *evalBet*: Bet on the evaluation of the current game
- *challenge*: Challenge a player to a game
- *intro*: Few words about me
- *meme*: Send a random meme
- *unixporn*: Send a image of fully Riced Desktop`;
        message.reply(helpMessage);
    }
};


