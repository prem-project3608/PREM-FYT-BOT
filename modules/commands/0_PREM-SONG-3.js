const axios = require('axios');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const ytdl = require('ytdl-core'); // YouTube से डाउनलोड करने के लिए

module.exports.config = {
  name: "test",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SHANKAR",
  description: "YouTube se MP3 song download karne ka system",
  commandCategory: "Music",
  usages: "#song <song name>",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  // User input se song ka naam lete hain
  const query = args.join(" ");
  if (!query) return api.sendMessage("Kripya song ka naam bhi likho!", threadID, messageID);

  try {
    // YouTube par song search karte hain
    const videoDetails = await searchYouTube(query);
    if (!videoDetails) return api.sendMessage("Koi video nahi mila.", threadID, messageID);

    // MP3 ko download karte hain
    const mp3FilePath = await downloadSong(videoDetails.url, query);

    // File ko send karte hain
    return api.sendMessage({
      body: `🎶 Yeh raha tumhara gana: ${videoDetails.title}`,
      attachment: fs.createReadStream(mp3FilePath)
    }, threadID, messageID);
    
  } catch (error) {
    console.error("Error:", error);
    return api.sendMessage("Kuch gadbad hui hai.", threadID, messageID);
  }
};

// YouTube par video search karne ka function
async function searchYouTube(query) {
  try {
    // YouTube API se video search (API_KEY ko apne API key se replace karein)
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        part: 'snippet',
        maxResults: 1,
        q: query,
        key: 'AIzaSyBK4g5TpZpBGunGYyi3ANMkFY-PkvJExOg' // Replace with your YouTube Data API key
      }
    });

    const video = response.data.items[0];
    if (!video) return null;

    return {
      title: video.snippet.title,
      url: `https://www.youtube.com/watch?v=${video.id.videoId}`
    };
  } catch (error) {
    console.error("YouTube API error:", error);
    return null;
  }
}

// MP3 song ko download karne ka function
async function downloadSong(videoUrl, songName) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, `${songName}.mp3`);

    // ytdl-core se MP3 download karna
    ytdl(videoUrl, { filter: 'audioonly' })
      .pipe(fs.createWriteStream(filePath))
      .on('finish', () => {
        resolve(filePath); // Return the path to the downloaded file
      })
      .on('error', (error) => {
        console.error("Download error:", error);
        reject("MP3 ko download karne mein gadbad hui.");
      });
  });
}
