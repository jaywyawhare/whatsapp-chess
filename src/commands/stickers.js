const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');

/**
 * Module to convert images or videos into stickers.
 * @module stickers
 */
module.exports = {
    /**
     * Command name for the sticker conversion functionality.
     * @type {string}
     */
    name: 'stickers',

    /**
     * Description of the sticker conversion functionality.
     * @type {string}
     */
    description: 'Convert images or videos to stickers',

    /**
     * Executes the sticker conversion process when a message is received.
     * @param {import('whatsapp-web.js').Message} message - The incoming message containing media.
     * @param {Array<string>} args - Additional arguments passed with the command.
     * @returns {Promise<void>} A promise that resolves when the sticker conversion process is complete.
     */
    async execute(message, args) {
        if (message.hasMedia) {
            try {
                const media = await message.downloadMedia();

                if (!media) {
                    await message.reply('Error downloading media, please try again.');
                    return;
                }

                if (!media.mimetype.startsWith('image/') && !media.mimetype.startsWith('video/')) {
                    await message.reply('Invalid media type, please send an image or video.');
                    return;
                }

                const filePath = './tmp/convert_to_sticker.' + media.mimetype.split('/')[1];

                fs.writeFileSync(filePath, media.data, 'base64');

                const stickerPath = './tmp/sticker.webp';

                if (media.mimetype.startsWith('image/')) {
                    await convertImageToSticker(filePath, stickerPath);
                } else if (media.mimetype.startsWith('video/')) {
                    await convertVideoToSticker(filePath, stickerPath);
                }

                const sticker = MessageMedia.fromFilePath(stickerPath);
                await message.reply(sticker);

                fs.unlinkSync(filePath);
                fs.unlinkSync(stickerPath);

            } catch (error) {
                console.error(error);
                await message.reply('An error occurred while processing your media, please try again later.');
            }
        } else {
            await message.reply('Please send an image or video to convert to a sticker.');
        }
    }
};

/**
 * Converts an image file to a sticker (webp format).
 * @param {string} imagePath - The path of the image file to be converted.
 * @param {string} outputPath - The path where the converted sticker will be saved.
 * @returns {Promise<void>} A promise that resolves when the conversion is complete.
 */
async function convertImageToSticker(imagePath, outputPath) {
    const ffmpeg = require('fluent-ffmpeg');
    return new Promise((resolve, reject) => {
        ffmpeg(imagePath)
            .outputOptions(['-y', '-vcodec libwebp'])
            .videoFilters(
                'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000'
            )
            .save(outputPath)
            .on('end', () => resolve())
            .on('error', (err) => reject(err));
    });
}

/**
 * Converts a video file to a sticker (webp format) with a short duration.
 * @param {string} videoPath - The path of the video file to be converted.
 * @param {string} outputPath - The path where the converted sticker will be saved.
 * @returns {Promise<void>} A promise that resolves when the conversion is complete.
 */
async function convertVideoToSticker(videoPath, outputPath) {
    const ffmpeg = require('fluent-ffmpeg');
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .duration(10)
            .outputOptions([
                '-y',
                '-vcodec libwebp',
                '-lossless 1',
                '-qscale 1',
                '-preset default',
                '-loop 0',
                '-an',
                '-vsync 0',
                '-s 512x512',
            ])
            .videoFilters(
                'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000'
            )
            .save(outputPath)
            .on('end', () => resolve())
            .on('error', (err) => reject(err));
    });
}
