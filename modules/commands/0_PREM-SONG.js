const axios = require('axios');
const ytdl = require('ytdl-core');
const fs = require('fs');

module.exports.config = {
  name: "song",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "PREM BABU",
  description: "YouTube se song search kar ke deta hai",
  commandCategory: "Music",
  usages: "music <song name>",
  cooldowns: 5,
};

// YouTube API Credentials
const YOUTUBE_API_KEY = "AIzaSyBK4g5TpZpBGunGYyi3ANMkFY-PkvJExOg"; // Replace with your actual YouTube API key

// Function to search song on YouTube
async function searchYouTube(query) {
  const url = 'https://www.googleapis.com/youtube/v3/search';
  
  try {
    const response = await axios.get(url, {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        key: YOUTUBE_API_KEY,
        maxResults: 1,
      }
    });
    
    return response.data.items[0];
  } catch (error) {
    console.error('Error fetching YouTube data:', error.response ? error.response.data : error.message);
    return null;
  }
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  const query = args.join(" ");
  if (!query) {
    return api.sendMessage("Kripya song ka naam bhi likho!", threadID, messageID);
  }

  try {
    // YouTube API se song search karte hain
    const song = await searchYouTube(query);
    if (!song) {
      return api.sendMessage("Sorry, koi result nahi mila.", threadID, messageID);
    }

    const songUrl = `https://www.youtube.com/watch?v=${song.id.videoId}`;

    // Audio stream
    const audioStream = ytdl(songUrl, { filter: 'audioonly' });
    const audioFile = `./temp/${song.snippet.title.replace(/[^a-zA-Z0-9]/g, "_")}.mp3`; // Temporary file path with safe filename

    // Create temp directory if not exists
    if (!fs.existsSync('./temp')) {
      fs.mkdirSync('./temp');
    }

    const writeStream = fs.createWriteStream(audioFile);
    
    audioStream.pipe(writeStream);

    writeStream.on('finish', () => {
      api.sendMessage({
        body: `🎶 Tumhara gana mil gaya: ${song.snippet.title}`,
        attachment: fs.createReadStream(audioFile)
      }, threadID, () => {
        fs.unlinkSync(audioFile); // Clean up file after sending
      }, messageID);
    });

    writeStream.on('error', (err) => {
      console.error("Error writing file:", err);
      return api.sendMessage("File likhne mein gadbad hui.", threadID, messageID);
    });

  } catch (error) {
    console.error("YouTube API error:", error.response ? error.response.data : error.message);
    return api.sendMessage('YouTube se song laane me gadbad hui: ' + (error.response ? error.response.data : error.message), threadID, messageID);
  }
};
