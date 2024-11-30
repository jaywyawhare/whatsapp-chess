const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');

const processImageAndSendImage = (base64Data, imageTitle) => {
    const cleanedBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(cleanedBase64, 'base64');
    const imagePath = path.join(__dirname, 'assets/images/', `${imageTitle}.jpg`);
    fs.writeFileSync(imagePath, imageBuffer);

    const media = MessageMedia.fromFilePath(imagePath);
    return media;
};

module.exports = processImageAndSendImage;
