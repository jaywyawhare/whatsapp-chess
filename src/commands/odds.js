module.exports = {
    name: 'odds',
    description: 'Show the odds for betting on who will win the game and allow multiple bets.',

    /**
     * Executes the command to display the betting odds, the possibility to place multiple bets, and betting rules.
     * @param {object} message - The message object from whatsapp-web.js.
     * @param {Array<string>} args - Arguments passed along with the command.
     */
    async execute(message, args) {
        message.reply(`
*Betting Odds*:
- *Gukesh*: 2.5X return on your bet if Gukesh wins.
- *Ding*: 3.5X return on your bet if Ding wins.
- *Draw*: 1.5X return on your bet if the game ends in a draw.

_This odds are calculated based on current Elo ratings._

*Betting Rules*:
- You can place multiple bets on any of the three outcomes: Gukesh, Ding, or Draw.

*For example*:
  =>betWinner Gukesh 10
  =>betWinner Ding 5
  =>betWinner Draw 2

The minimum bet is 1 Elixir.

If the declared result matches your bet, you will earn the corresponding payout based on the odds:

  2.5X for Gukesh
  3.5X for Ding
  1.5X for Draw

Good luck! 💰
        `);
    }
};
