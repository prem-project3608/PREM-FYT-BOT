const axios = require('axios');
const ytdl = require('ytdl-core'); // YouTube video download ke liye
const fs = require('fs'); // File system access

module.exports.config = {
  name: "music",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SHANKAR",
  description: "YouTube se music download karke send karta hai",
  commandCategory: "Entertainment",
  usages: "music [song name]",
  cooldowns: 5,
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, body } = event;
  
  if (body.toLowerCase().startsWith("music ")) {
    const songName = body.slice(6).trim(); // Command se song ka naam lena

    // YouTube API se song search karo
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: 'AIzaSyBK4g5TpZpBGunGYyi3ANMkFY-PkvJExOg', // Apni YouTube API key yaha daalein
          q: songName,
          part: 'snippet',
          type: 'video',
          maxResults: 1
        }
      });

      const video = response.data.items[0];
      const videoId = video.id.videoId;
      const videoLink = `https://www.youtube.com/watch?v=${videoId}`;

      // YouTube se audio stream download karo
      const stream = ytdl(videoLink, { filter: 'audioonly' });

      // Downloaded audio ko local file me save karo
      const filePath = `./${songName}.mp3`;
      const writeStream = fs.createWriteStream(filePath);

      stream.pipe(writeStream);

      writeStream.on('finish', () => {
        // Jab audio file download ho jaye, to bot se file send karo
        api.sendMessage({
          body: `🎶 Aapka song: ${songName}`,
          attachment: fs.createReadStream(filePath)
        }, threadID, () => {
          // Send hone ke baad temporary file ko delete karte hain
          fs.unlinkSync(filePath);
        });
      });

      writeStream.on('error', (err) => {
        console.error("File likhne me error aayi:", err);
        return api.sendMessage('Kuchh gadbad hui, song download nahi ho paya.', threadID);
      });

    } catch (error) {
      console.error("Music download karne me error aayi:", error);
      return api.sendMessage('Kuchh gadbad hui, song link nahi la paaye. Kripya baad me try karein.', threadID);
    }
  }
};

module.exports.run = function () {};
