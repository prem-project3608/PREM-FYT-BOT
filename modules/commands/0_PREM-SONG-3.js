const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

module.exports.config = {
  name: "test",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SHANKAR",
  description: "Pagalword se MP3 song download karne ka system",
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
    // Pagalword se MP3 download link prapt karte hain
    const downloadLink = await getPagalWordDownloadLink(query);

    if (!downloadLink) return api.sendMessage("Koi download link nahi mila.", threadID, messageID);

    // MP3 ko download karte hain
    const mp3FilePath = await downloadSong(downloadLink, query);

    // File ko send karte hain
    return api.sendMessage({
      body: `🎶 Yeh raha tumhara gana: ${query}`,
      attachment: fs.createReadStream(mp3FilePath)
    }, threadID, messageID);
    
  } catch (error) {
    console.error("Error:", error);
    return api.sendMessage("Kuch gadbad hui hai.", threadID, messageID);
  }
};

// Pagalword se MP3 download link nikalne ka function
async function getPagalWordDownloadLink(songTitle) {
  try {
    const response = await axios.get(`https://pagalword.com/search/${encodeURIComponent(songTitle)}`);
    const $ = cheerio.load(response.data);

    // Pagalword se pehla MP3 link nikaal rahe hain
    const firstResult = $('.song-list .song a').first(); // First song link
    const songLink = firstResult.attr('href'); // Song URL

    if (!songLink) {
      return null;
    }

    // MP3 page se actual download link nikal rahe hain
    const songPageResponse = await axios.get(songLink);
    const songPage = cheerio.load(songPageResponse.data);
    
    // Download link ko dhoondhna
    const downloadUrl = songPage('a[title="Download MP3"]').attr('href');

    return downloadUrl || null; // Return the download URL or null if not found
  } catch (error) {
    console.error("Pagalword API error:", error);
    return null;
  }
}

// MP3 song ko download karne ka function
async function downloadSong(downloadLink, songName) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, `${songName}.mp3`);

    exec(`curl -o "${filePath}" "${downloadLink}"`, (error) => {
      if (error) {
        console.error("Download error:", error);
        return reject("MP3 ko download karne mein gadbad hui.");
      }
      resolve(filePath); // Return the path to the downloaded file
    });
  });
}
