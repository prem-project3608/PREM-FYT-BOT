const axios = require("axios");

class RemoveBg {
  constructor() {
    this.apiKey = "E7Qbj7YsoyHmqwfNp9x74a96"; // यहाँ अपनी API की डालें
    this.client = axios.create({
      baseURL: "https://api.remove.bg/v1.0/",
      headers: {
        "X-Api-Key": this.apiKey,
        "Content-Type": "application/json"
      }
    });
  }

  async removeBackground(imageUrl) {
    const response = await this.client.post("removebg", {
      image_url: imageUrl,
      size: "auto"
    });
    return response.data.result_b64;
  }
}

class Modules extends RemoveBg {
  constructor() {
    super();
  }

  get config() {
    return {
      name: "removebg",
      description: "Remove background from an image",
      version: "1.0.0",
      credits: "SHANKAR SUMAN",
      cooldown: 5,
      usage: "removebg <url>",
      commandCategory: "Công cụ",
      hasPermssion: 0
    };
  }

  run = async ({ api, event }) => {
    if (event.type !== "message_reply" || event.messageReply.attachments.length < 1) {
      return api.sendMessage("[⚜️]➜ कृपया उस फोटो का जवाब दें, जिसका बैकग्राउंड हटाना है।", event.threadID, event.messageID);
    }

    for (let { url } of event.messageReply.attachments) {
      try {
        const result = await this.removeBackground(url);
        // सीधे बैकग्राउंड हटाई गई इमेज भेजें
        return api.sendMessage({
          body: "[⚜️]➜ बैकग्राउंड सफलतापूर्वक हटाया गया!",
          attachment: Buffer.from(result, "base64"),
          filename: "image.png"
        }, event.threadID, event.messageID);
      } catch (err) {
        console.log(err);
        return api.sendMessage("[⚜️]➜ बैकग्राउंड हटाने में एक त्रुटि हुई।", event.threadID, event.messageID);
      }
    }
  }
}

module.exports = new Modules();
