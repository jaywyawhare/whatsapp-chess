module.exports = {
    name: 'intro',
    description: 'Sends an introductory message',
    execute(message, args) {
        const imagePath = path.join(__dirname, '../assets/images/chillguy.webp');
        const media = MessageMedia.fromFilePath(imagePath);
        const introMessage = 'Hello! I am a chill guy who likes to do cool stuff. Feel free to contact me at install.py@gmail.com 😊';
        message.reply(media, null, { caption: introMessage });
    }
};