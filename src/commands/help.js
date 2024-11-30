module.exports = {
    name: 'help',
    description: 'Displays detailed information about specific commands',

    /**
     * Executes the help logic for a specific command.
     * @param {object} message - The message object from whatsapp-web.js.
     * @param {Array<string>} args - Arguments passed along with the command.
     */
    execute(message, args) {
        const commandName = args[0]?.toLowerCase();

        if (!commandName) {
            return message.reply(`
            To get detailed information about a specific command, use the following format:
            =>help <commandName>

            Available commands:
            - **menu**: Displays a list of all available commands
            - **help**: Provides detailed information about specific commands
            - **stickers**: Convert images or videos to stickers
            - **ping**: Check if the bot is responsive
            - **livePosition**: Fetch and send the current chess position from Ding Liren vs D. Gukesh WCC 2024
            - **liveEval**: Fetch and send the evaluation of the current chess position, including 5 principal variations and depths
            - **claim**: Claim random elixir drops
            - **refill**: Refill your elixir [ADMIN ONLY]
            - **leaderboard**: Display the group leaderboard
            - **liveRating**: Show the top 10 chess players' ratings
            - **betWinner**: Bet on the result of the current game
            - **guessTheEval**: Bet on the evaluation of a random chess position
            - **nextMoveBet**: Bet on the next move of the current game
            - **evalBet**: Bet on the evaluation of the current game
            - **challenge**: Challenge another player to a game
            - **intro**: Get a brief introduction about the bot
            - **meme**: Send a random meme
            - **unixporn**: Send a random image of a fully Riced Desktop
            `);
        }

        const commandHelp = {
            menu: `
            **menu**: Displays a list of all available commands.
            Usage: =>menu
            This command shows you all the commands you can use in the bot.
            `,
            help: `
            **help**: Provides detailed information about specific commands.
            Usage: =>help <commandName>
            Use this command to get detailed help for a specific command.
            Example: =>help menu
            `,
            stickers: `
            **stickers**: Convert images or videos to stickers.
            Usage: =>stickers
            This command allows you to turn images or videos into stickers that can be shared in chats.
            `,
            ping: `
            **ping**: Check if the bot is responsive.
            Usage: =>ping
            This command checks if the bot is online and responsive.
            `,
            livePosition: `
            **livePosition**: Fetch and send the current chess position.
            Usage: =>livePosition
            This command fetches the current position from the Ding Liren vs D. Gukesh WCC 2024 game and sends it to the chat.
            `,
            liveEval: `
            **liveEval**: Fetch and send the evaluation of the current chess position.
            Usage: =>liveEval
            This command sends the evaluation of the current position along with 5 principal variations (PVs) and depths.
            `,
            claim: `
            **claim**: Claim random elixir drops.
            Usage: =>claim
            Use this command to claim random elixir drops. Misuse of this feature will result in a ban.
            `,
            refill: `
            **refill**: Refill your elixir.
            Usage: =>refill
            Request an admin to refill your elixir balance. [ADMIN ONLY]
            `,
            leaderboard: `
            **leaderboard**: Display the group leaderboard.
            Usage: =>leaderboard
            This command displays the leaderboard of players in the group, showing their rankings based on elixir balance.
            `,
            liveRating: `
            **liveRating**: Show the top 10 chess players' ratings.
            Usage: =>liveRating
            Use this command to get the current ratings of the top 10 chess players in the world.
            `,
            guessTheEval: `
            **guessTheEval**: Bet on the evaluation of a random chess position.
            Usage: =>guessTheEval
            This command gives a random chess position, and you have to bet on its evaluation by tagging the evaluation with the bet amount in a subsequent bot message.
            `,
            betWinner: `
            **betWinner**: Bet on the result of the current game.
            Usage: =>betWinner <winner> <amount>
            Bet on who will win the current game (e.g., "ding", "gukesh", or "draw") and specify the amount you're betting.
            Example: =>betWinner gukesh 100
            `,
            nextMoveBet: `
            **nextMoveBet**: Bet on the next move of the current game.
            Usage: =>nextMoveBet <move> <amount>
            Bet on what the next move will be. Only Algebraic Notation is accepted. Invalid moves will result in forfeiting the bet.
            Example: =>nextMoveBet e4 50
            `,
            evalBet: `
            **evalBet**: Bet on the evaluation of the current game.
            Usage: =>evalBet <eval> <amount>
            Bet on the evaluation of the current game and specify the amount. The evaluation can be entered up to one decimal point.
            Example: =>evalBet +0.3 100
            `,
            challenge: `
            **challenge**: Challenge another player to a game.
            Usage: =>challenge <playerName>
            Challenge another player to a game of chess by tagging their name.
            Example: =>challenge playerName
            `,
            intro: `
            **intro**: Get a brief introduction about the bot.
            Usage: =>intro
            The bot will introduce itself and explain its functionality.
            `,
            meme: `
            **meme**: Send a random meme.
            Usage: =>meme 
            This command sends a random meme to the chat.
            `,
            unixporn: `
            **unixporn**: Send a random image of a fully Riced Desktop.
            Usage: =>unixporn
            This command sends a random image of a fully Riced Desktop to the chat.
            `,

        };

        if (commandHelp[commandName]) {
            return message.reply(commandHelp[commandName]);
        }

            return message.reply(`Sorry, no detailed help found for command: ${commandName}`);
    },
};
