const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "ytmusic",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "SHANKAR",
  description: "YouTube se song ka naam search karke MP3 download kar ke deta hai",
  commandCategory: "Music",
  usages: "ytmusic <song name>",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const query = args.join(" ");

  if (!query) {
    return api.sendMessage("Kripya song ka naam provide karein!", threadID, messageID);
  }

  try {
    // Step 1: YouTube search to get video link
    const searchRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        key: 'AIzaSyCyAsir55O2W_UU7o2fLeCF3Yuinp0i02I', // YouTube API key yaha add karein
        maxResults: 1
      }
    });

    const videoId = searchRes.data.items[0]?.id?.videoId;
    if (!videoId) {
      return api.sendMessage("Sorry, koi result nahi mila.", threadID, messageID);
    }

    const videoLink = `https://www.youtube.com/watch?v=${videoId}`;

    // Step 2: Download MP3 using YouTube MP3 downloader API
    const response = await axios.get('https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp3/long_video.php', {
      params: { video: videoLink },
      headers: {
        'x-rapidapi-host': 'youtube-mp3-downloader2.p.rapidapi.com',
        'x-rapidapi-key': '6734af4409msh8d5419367b0d679p14dcb3jsn113f61b581db'
      }
    });

    const downloadUrl = response.data.downloadUrl;

    if (!downloadUrl) {
      return api.sendMessage("Sorry, music download karne mein gadbad ho gayi.", threadID, messageID);
    }

    const filePath = path.join(__dirname, 'cache', `${Date.now()}.mp3`);

    // MP3 ko download karna
    const musicRes = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
    await fs.outputFile(filePath, musicRes.data);

    // MP3 file ko send karna
    await api.sendMessage({
      attachment: fs.createReadStream(filePath),
    }, threadID, messageID);

    // Cache clean up
    await fs.remove(filePath);

  } catch (error) {
    console.error(error);
    return api.sendMessage('Music download karne mein gadbad ho gayi: ' + error.message, threadID, messageID);
  }
};
