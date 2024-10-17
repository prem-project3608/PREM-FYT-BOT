const axios = require('axios');
const fs = require('fs');
const getFBInfo = require("prem-facebook");

module.exports.config = {
  name: "PREM-VIDEO-DOWNLOAD",
  version: "1.0",
  hasPermssion: 0,
  credits: "PREM BABU",
  description: "THIS BOT IS MADE BY MR PREM BABU",
  usePrefix: false,
  commandCategory: "FACEBOOK VIDEO DOWNLOADER",
  usage: "AUTOMATIC",
  cooldowns: 3,
};

module.exports.handleEvent = async function ({ api, event }) {
  if (event.body !== null && event.isGroup) {
    const facebookLinkRegex = /https:\/\/www\.facebook\.com\/\S+/;
    const link = event.body;

    if (facebookLinkRegex.test(link)) {
      api.setMessageReaction("💙", event.messageID, () => { }, true);
      downloadAndSendFBContent(link, api, event);
    }
  }
};

const downloadAndSendFBContent = async (url, api, event) => {
  const fbvid = './video.mp4'; 
  try {
    const result = await getFBInfo(url);
    let videoData = await axios.get(encodeURI(result.sd), { responseType: 'arraybuffer' });
    fs.writeFileSync(fbvid, Buffer.from(videoData.data, "utf-8"));
    
    api.sendMessage({
      body: "",
      attachment: fs.createReadStream(fbvid)
    }, event.threadID, () => {
      fs.unlinkSync(fbvid); 
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports.run = async function ({ api, event }) {
  api.sendMessage("🫤🫤🫤🫤🫤", event.threadID);
};
