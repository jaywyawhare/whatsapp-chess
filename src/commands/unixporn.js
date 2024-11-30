const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { MessageMedia } = require("whatsapp-web.js");

const url = process.env.UNIXPORN_URL;

module.exports = {
  name: "unixporn",
  description: "Send a random UnixPorn meme",

  async execute(message, args) {
    try {
      const response = await axios.get(url);
      const unixporn = response.data;

      if (!unixporn || !unixporn.url || !unixporn.title) {
        throw new Error("Failed to retrieve a valid UnixPorn meme");
      }

      const memeUrl = unixporn.url;
      const memeTitle = unixporn.title;

      const fileExtension = memeUrl.endsWith(".gif") ? "gif" : "png";
      const imagePath = path.join(
        __dirname,
        "../../assets/images",
        `unixporn.${fileExtension}`
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
        console.error("Error saving the UnixPorn image:", err);
        message.reply(
          "Sorry, I couldn't fetch the UnixPorn image right now. Please try again later."
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
      console.error("Error handling UnixPorn command:", error);
      message.reply(
        "Sorry, I couldn't fetch a UnixPorn image right now. Please try again later."
      );
    }
  },
};
