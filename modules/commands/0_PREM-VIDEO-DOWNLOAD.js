const axios = require('axios');
const fs = require('fs');
const getFBInfo = require("@xaviabot/fb-downloader");

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
    const tiktokLinkRegex = /https:\/\/(www\.|vt\.)?tiktok\.com\//;
    const facebookLinkRegex = /https:\/\/www\.facebook\.com\/\S+/;
    const capcutLinkRegex = /https:\/\/www\.capcut\.com\/t\/\S+/;
    const link = event.body;
    
    if (tiktokLinkRegex.test(link)) {
      api.setMessageReaction("❤️", event.messageID, () => { }, true);
      downloadAndSendTikTokContent(link, api, event);
    } else if (facebookLinkRegex.test(link)) {
      api.setMessageReaction("💙", event.messageID, () => { }, true);
      downloadAndSendFBContent(link, api, event);
    } else if (capcutLinkRegex.test(link)) {
      api.setMessageReaction("💛", event.messageID, () => { }, true);
      downloadAndSendCapcutContent(link, api, event);
    }
  }
};

const downloadAndSendTikTokContent = async (url, api, event) => {
  const regEx_tiktok = /https:\/\/(www\.|vt\.)?tiktok\.com\//;
  const response = await axios.post(`https://www.tikwm.com/api/`, {
    url: url
  });
  
  const data = response.data.data;
  const videoStream = await axios({
    method: 'get',
    url: data.play,
    responseType: 'stream'
  }).then(res => res.data);
  
  const fileName = `TikTok-${Date.now()}.mp4`;
  const filePath = `./${fileName}`;
  const videoFile = fs.createWriteStream(filePath);

  videoStream.pipe(videoFile);

  videoFile.on('finish', () => {
    videoFile.close(() => {
      console.log('DOWNLOAD TIKTOK VIDEO FILE');

      api.sendMessage({
        body: ``,
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => {
        fs.unlinkSync(filePath);  
      });
    });
  });
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

const downloadAndSendCapcutContent = async (url, api, event) => {
  try {
    const response = await axios.get(`https://jonellccapisprojectv2-a62001f39859.herokuapp.com/api/capcut?url=${url}`);
    const { result } = response.data;

    const capcutFileName = `Capcut-${Date.now()}.mp4`;
    const capcutFilePath = `./${capcutFileName}`;

    const videoResponse = await axios({
      method: 'get',
      url: result.video_ori,
      responseType: 'arraybuffer'
    });

    fs.writeFileSync(capcutFilePath, Buffer.from(videoResponse.data, 'binary'));

    api.sendMessage({
      body: ``,
      attachment: fs.createReadStream(capcutFilePath)
    }, event.threadID, () => {
      fs.unlinkSync(capcutFilePath);
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports.run = async function ({ api, event }) {
  api.sendMessage("🫤🫤🫤🫤🫤", event.threadID);
};
