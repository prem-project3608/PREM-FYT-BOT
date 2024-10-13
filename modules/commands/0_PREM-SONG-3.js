const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio'); // cheerio को इंस्टॉल करें

module.exports.config = {
  name: "song",
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
    // YouTube par video search karte hain
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
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        part: 'snippet',
        maxResults: 1,
        q: query,
        key: 'YOUR_YOUTUBE_API_KEY' // Replace with your YouTube Data API key
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

// MP3 song ko download karne ka function (y2mate ka istemal karte hue)
async function downloadSong(videoUrl, songName) {
  return new Promise(async (resolve, reject) => {
    try {
      const videoId = videoUrl.split('v=')[1];
      const searchUrl = `https://y2mate.com/youtube/${videoId}`;
      const response = await axios.get(searchUrl);
      const $ = cheerio.load(response.data);

      // y2mate se download link nikaalna
      const downloadLink = $('a[title="Download MP3"]').attr('href');
      if (!downloadLink) return reject("Download link nahi mila.");

      const filePath = path.join(__dirname, `${songName}.mp3`);

      // File ko download karne ke liye exec ka istemal karen
      const downloadResponse = await axios.get(downloadLink, { responseType: 'stream' });
      const writer = fs.createWriteStream(filePath);
      
      downloadResponse.data.pipe(writer);
      
      writer.on('finish', () => {
        resolve(filePath);
      });

      writer.on('error', (error) => {
        console.error("Download error:", error);
        reject("MP3 ko download karne mein gadbad hui.");
      });
      
    } catch (error) {
      console.error("Error in downloading song:", error);
      reject("MP3 ko download karne mein gadbad hui.");
    }
  });
}
