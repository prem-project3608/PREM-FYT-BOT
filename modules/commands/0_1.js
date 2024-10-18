const axios = require('axios');
const fs = require('fs');
const getIGInfo = require("prem-instagram"); // इंस्टाग्राम के लिए अलग लाइब्रेरी

module.exports.config = {
  name: "PREM-VIDEO-DOWNLOAD-2",
  version: "1.0",
  hasPermssion: 0,
  credits: "PREM BABU",
  description: "THIS BOT IS MADE BY MR PREM BABU",
  usePrefix: false,
  commandCategory: "INSTAGRAM VIDEO DOWNLOADER",
  usage: "AUTOMATIC",
  cooldowns: 3,
};

module.exports.handleEvent = async function ({ api, event }) {
  if (event.body !== null && event.isGroup) {
    const instagramLinkRegex = /https:\/\/www\.instagram\.com\/\S+/; // इंस्टाग्राम लिंक की पहचान
    const link = event.body;

    if (instagramLinkRegex.test(link)) {
      api.setMessageReaction("❤️", event.messageID, () => { }, true);
      downloadAndSendIGContent(link, api, event);
    }
  }
};

const downloadAndSendIGContent = async (url, api, event) => {
  const igVid = './video.mp4'; 
  try {
    const result = await getIGInfo(url); // इंस्टाग्राम से जानकारी प्राप्त करें
    let videoData = await axios.get(encodeURI(result.video_url), { responseType: 'arraybuffer' }); // वीडियो URL से डेटा प्राप्त करें
    fs.writeFileSync(igVid, Buffer.from(videoData.data, "utf-8"));
    
    api.sendMessage({
      body: "",
      attachment: fs.createReadStream(igVid)
    }, event.threadID, () => {
      fs.unlinkSync(igVid); 
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports.run = async function ({ api, event }) {
  api.sendMessage("🫤🫤🫤🫤🫤", event.threadID);
};
