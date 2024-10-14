const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "gana",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "PREM BABU",
  description: "THIS BOT IS MADE BY MR PREM BABU",
  commandCategory: "YOUTUBE DOWNLOAD MUSIC",
  usages: "PREFIX",
  cooldowns: 5,
};

// Function to search and download track from YouTube using Y2Mate
async function downloadFromYouTube(trackName) {
  const searchRes = await axios.get(`https://y2mate.guru/api/ajaxSearch?query=${encodeURIComponent(trackName)}`);
  
  if (searchRes.data.result.length === 0) {
    throw new Error("ये गाना मुझे नहीं मिल रहा 😕🤞");
  }

  const videoId = searchRes.data.result[0].id;
  const downloadRes = await axios.get(`https://y2mate.guru/api/ajaxConvert?vid=${videoId}&type=mp3`);

  if (!downloadRes.data || !downloadRes.data.result || downloadRes.data.result.length === 0) {
    throw new Error(`Unable to download song for "${trackName}". Please try again.`);
  }

  return downloadRes.data.result[0]; // Return the first download link
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  try {
    const trackName = args.join(" ").trim();
    if (!trackName) {
      return api.sendMessage("मेरी जान गाने का नाम तो लिखो 🤐🤞", threadID, messageID);
    }

    // Send a message to indicate the song is being downloaded
    api.sendMessage("इंतजार करो आपका गाना डॉउनलोड हो रहा है 🙂🤞", threadID);

    // Search for the track on YouTube and get download link
    const songData = await downloadFromYouTube(trackName);
    const songUrl = songData.downloadUrl;
    const songPath = path.join(__dirname, 'cache', `${songData.id}.mp3`);

    // Download the song
    const songResponse = await axios.get(songUrl, { responseType: 'arraybuffer' });
    await fs.outputFile(songPath, songResponse.data);

    // Send the song with a message indicating that it's the requested song
    await api.sendMessage({
      attachment: fs.createReadStream(songPath),
      body: `MR PREM PROJECT`
    }, threadID, messageID);

    // Send an additional message to encourage listening
    await api.sendMessage("ये लो मजे से सुनो गाना 🎧", threadID, messageID);

    // Clean up cached files
    await fs.remove(songPath);
  } catch (error) {
    console.error("Error:", error);
    return api.sendMessage(`An error occurred: ${error.message}`, threadID, messageID);
  }
};
