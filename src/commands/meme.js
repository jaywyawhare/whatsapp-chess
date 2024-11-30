const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { MessageMedia } = require("whatsapp-web.js");

const url = process.env.MEME_URL;

module.exports = {
  name: "meme",
  description: "Send a random meme",

  async execute(message, args) {
    try {
      const response = await axios.get(url);
      const meme = response.data;

      if (!meme || !meme.url || !meme.title) {
        throw new Error("Failed to retrieve a valid meme");
      }

      const memeUrl = meme.url;
      const memeTitle = meme.title;

      const fileExtension = memeUrl.endsWith(".gif") ? "gif" : "png";
      const imagePath = path.join(
        __dirname,
        "../../assets/images",
        `meme.${fileExtension}`
      );
      const writer = fs.createWriteStream(imagePath);

      const imageResponse = await axios.get(memeUrl, {
        responseType: "stream",
      });
      imageResponse.data.pipe(writer);

      writer.on("finish", () => {
        const media =
          fileExtension === "gif"
            ? MessageMedia.fromFilePath(imagePath, "image/gif")
            : MessageMedia.fromFilePath(imagePath, "image/png");

        const memeMessage = `${memeTitle}`;

        message.reply(media, null, { caption: memeMessage });
      });

      writer.on("error", (err) => {
        console.error("Error saving the meme image:", err);
        message.reply(
          "Sorry, I couldn't fetch a meme right now. Please try again later."
        );
      });

      writer.on("finish", () => {
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Error removing the meme image:", err);
          }
          console.log("Meme image removed successfully.");
        });
      });
    } catch (error) {
      console.error("Error handling meme command:", error);
      message.reply(
        "Sorry, I couldn't fetch a meme right now. Please try again later."
      );
    }
  },
};
