import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fetchData } from '../utils/fetchData';

const url = process.env.MEME_URL;

module.exports = {
    name: 'unixporn',
    description: 'Send a random image of a fully riced desktop from the unixporn subreddit',
    async execute(message, args) {
        const subreddit = 'unixporn';

        const getUnixPornImage = async () => {
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
                console.error('Error fetching unixporn image:', error);
                return null;
            }
        };

        let unixPornData = null;
        let retries = 5;

        while (retries > 0) {
            unixPornData = await getUnixPornImage();

            if (unixPornData) {
                break; 
            }

            retries -= 1;
            console.log(`Retrying... ${retries} attempts left.`);
        }

        if (unixPornData) {
            try {
                const response = await axios({
                    url: unixPornData.imageUrl,
                    responseType: 'stream',
                });

                const filePath = path.join(__dirname, 'unixporn.jpg');
                const writer = fs.createWriteStream(filePath);
                response.data.pipe(writer);

                writer.on('finish', () => {
                    message.reply({
                        body: `Here’s a random *riced* desktop from the Unixporn subreddit!\n\n*Title:* ${unixPornData.title}`,
                        media: fs.createReadStream(filePath),
                    });
                });

                writer.on('error', (err) => {
                    console.error('Error saving the unixporn image:', err);
                    message.reply('Sorry, I couldn\'t fetch the image right now. Please try again later.');
                });
            } catch (error) {
                console.error('Error downloading the unixporn image:', error);
                message.reply('Sorry, I couldn\'t download the image. Please try again later.');
            }
        } else {
            message.reply('Sorry, I couldn\'t fetch a riced desktop image right now. Please try again later.');
        }
    }
};
