const axios = require('axios');
const fs = require('fs');
const getIGInfo = require("prem-instagram"); // एक इंस्टाग्राम डाउनलोडर लाइब्रेरी का उपयोग करें

module.exports.config = {
  name: "PREM-REELS-DOWNLOAD",
  version: "1.0",
  hasPermssion: 0,
  credits: "PREM BABU",
  description: "THIS BOT IS MADE BY MR PREM BABU FOR INSTAGRAM REELS",
  usePrefix: false,
  commandCategory: "INSTAGRAM REELS DOWNLOADER",
  usage: "AUTOMATIC",
  cooldowns: 3,
};

module.exports.handleEvent = async function ({ api, event }) {
  if (event.body !== null && event.isGroup) {
    const instagramLinkRegex = /https:\/\/www\.instagram\.com\/\S+/; // Instagram URL के लिए regex
    const link = event.body;

    if (instagramLinkRegex.test(link)) {
      api.setMessageReaction("💛", event.messageID, () => { }, true);
      downloadAndSendIGContent(link, api, event);
    }
  }
};

const downloadAndSendIGContent = async (url, api, event) => {
  const igReelsPath = './reels.mp4'; 
  try {
    const result = await getIGInfo(url); // Instagram से वीडियो जानकारी प्राप्त करें
    let videoData = await axios.get(encodeURI(result.reels), { responseType: 'arraybuffer' }); // रील्स वीडियो लिंक
    fs.writeFileSync(igReelsPath, Buffer.from(videoData.data, "utf-8"));
    
    api.sendMessage({
      body: "",
      attachment: fs.createReadStream(igReelsPath)
    }, event.threadID, () => {
      fs.unlinkSync(igReelsPath); 
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports.run = async function ({ api, event }) {
  api.sendMessage("🫤🫤🫤🫤🫤", event.threadID);
};
