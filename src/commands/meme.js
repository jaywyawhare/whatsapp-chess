import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fetchData } from '../utils/fetchData';

const url = process.env.MEME_URL;

module.exports = {
    name: 'meme',
    description: 'Send a random meme',
    async execute(message, args) {
        const subreddits = [
            'dankmemes',        
            'techmemes',        
            'linuxmemes',       
            'cricketmemes',     
            'dankmeme',         
            'ProgrammerHumor',  
            'memes',            
            'me_irl',           
            'wholesomememes',   
            'techhumor',        
        ];

        const getMeme = async () => {
            const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)]; // Randomly select a subreddit
            const apiUrl = `${url}/${subreddit}`;

            try {
                const data = await fetchData(apiUrl);

                const post = data && data[0] && data[0].data.children[0].data;

                if (post && !post.nsfw) {
                    return {
                        title: post.title,
                        imageUrl: post.url,
                    };
                } else {
                    return null;
                }
            } catch (error) {
                console.error('Error fetching meme:', error);
                return null;
            }
        };

        let memeData = null;
        let retries = 5; 

        while (retries > 0) {
            memeData = await getMeme();

            if (memeData) {
                break; 
            }

            retries -= 1;
            console.log(`Retrying... ${retries} attempts left.`);
        }

        if (memeData) {
            try {
                const response = await axios({
                    url: memeData.imageUrl,
                    responseType: 'stream',
                });

                const filePath = path.join(__dirname, 'meme.jpg');
                const writer = fs.createWriteStream(filePath);
                response.data.pipe(writer);

                writer.on('finish', () => {
                    message.reply({
                        body: `Here’s a random meme for you!\n\n*Title:* ${memeData.title}`,
                        media: fs.createReadStream(filePath),
                    });
                });

                writer.on('error', (err) => {
                    console.error('Error saving the meme image:', err);
                    message.reply('Sorry, I couldn\'t fetch the meme image right now. Please try again later.');
                });
            } catch (error) {
                console.error('Error downloading the meme image:', error);
                message.reply('Sorry, I couldn\'t download the meme image. Please try again later.');
            }
        } else {
            message.reply('Sorry, I couldn\'t fetch a meme right now. Please try again later.');
        }
    }
};
