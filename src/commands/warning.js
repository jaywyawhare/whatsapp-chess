const { MessageMedia } = require('whatsapp-web.js');
const path = require('path');

module.exports = {
    name: 'warning',
    async execute(message, args) {
        const imagePath = path.join(__dirname, '../../assets/images/goli.jpg');
        const media = MessageMedia.fromFilePath(imagePath);
        const introMessage = 'Goli beta masti nahi!';
        
        await message.reply(media, null, { caption: introMessage });
    }
};
