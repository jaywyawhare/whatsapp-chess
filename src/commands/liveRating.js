import { fetchData } from '../utils/fetchData';
import dotenv from 'dotenv';

dotenv.config();

const liveRating = {
    name: 'liveRating',
    description: 'Display the top 10 chess players',
    async execute(message, args) {
        const url = process.env.API_URL + '/live-rating';
        const data = await fetchData(url);

        if (data) {
            const topPlayers = data.players.slice(0, 10);
            const playerList = topPlayers.map((player, index) => {
                return `${index + 1}. ${player.name} (${player.rating})`;
            });
            const playerListString = playerList.join('\n');

            message.reply(`🏆 *Top 10 Chess Players*:\n\n${playerListString}`);
        }
    }
};

export { liveRating };
