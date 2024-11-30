# Whatsapp-chess

A WhatsApp bot designed to keep friends updated on the ongoing **WCC 2024** between **Ding Liren** and **D. Gukesh**. The bot offers a variety of features like live game updates, betting on chess positions, and some fun extras such as memes and Unix desktop images.

**Please note**: This bot is **not ready for production** yet. I have not even run the code for testing. This is essentially a "work-in-progress" that has been dumped here as I type. So it may not function as expected in its current state.

## Features

- **Live Chess Updates**: Get real-time information about the WCC 2024 game between Ding Liren and D. Gukesh, including game position and evaluation.
- **Betting**: Bet on the game result, next moves, or evaluation of the game.
- **Leaderboard**: Track and display the top players in the group based on the amount of "elixir" they have.
- **Fun Commands**: Send random memes or Unix desktop images, and convert images to stickers.

## Available Commands

This bot offers several commands to interact with, including live game updates, betting, and fun features like memes. Some of the key commands include:

- **menu**: Lists all available commands.
- **help <commandName>**: Provides detailed help for a specific command.
- **livePosition**: Get the current chess position from the game.
- **liveEval**: Get the evaluation of the current position.
- **betWinner**: Bet on who will win the current game.
- **evalBet**: Bet on the evaluation of the current game.
- **meme**: Get a random meme.
- **unixporn**: Get a random image of a riced desktop.

For more details on individual commands, use the `help` command (e.g., `=>help livePosition`).

## Installation

### Prerequisites
Before running the bot, make sure you have:
- **Node.js** 
- **pnpm** 

### Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/jaywyawhare/whatsapp-chess.git
   cd whatsapp-chess
   ```

2. **Install Dependencies:**

   Install the necessary dependencies:

   ```bash
   pnpm install
   ```

3. **Environment Variables:**

   Create a `.env` file and add the following:

   ```bash
   MEME_URL=your_meme_api_url_here
   API_URL=your_api_url_here
   ```

## Disclaimer

- This bot is **not yet production-ready**.
- I have **not tested** the bot or the code thoroughly. It is in an unfinished state and might not work as expected.
- This is a **work-in-progress**, and I am simply dumping the code as I type, so please do not use it in any live environment yet.

## Contributing

Feel free to fork the repository and contribute. To contribute:
1. Fork the repo.
2. Clone your fork.
3. Create a new branch for your feature: `git checkout -b feature-branch`.
4. Commit your changes: `git commit -m "Add feature"`.
5. Push your changes: `git push origin feature-branch`.
6. Open a pull request.

## License

This project is licensed under the DBaJ-NC-CFL License - see the [LICENSE](./LICENCE.md) file for details.

---

Please note that the project is still in development, and functionality may change. Check back later for updates.