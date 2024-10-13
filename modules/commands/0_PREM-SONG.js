const { google } = require('googleapis');
const fs = require("fs-extra");
const axios = require("axios");
const yts = require("yt-search");

module.exports.config = {
  name: "song",
  version: "2.0.4",
  hasPermssion: 0,
  credits: "Grey",
  description: "Play a song",
  commandCategory: "utility",
  usages: "[title]",
  prefix: true,
  cooldowns: 20,
  dependencies: {
    "fs-extra": "",
    "request": "",
    "axios": "",
    "yt-search": ""
  }
};

module.exports.run = async ({ api, event }) => {
  const input = event.body;
  const data = input.split(" ");

  // Check if the song title is provided
  if (data.length < 2) {
    return api.sendMessage("कृपया एक गाना डालें।", event.threadID);
  }

  // Remove the command part and get the song title
  data.shift();
  const song = data.join(" ");

  try {
    api.sendMessage(`"${song}" ढूंढा जा रहा है। कृपया प्रतीक्षा करें...`, event.threadID);

    // Search for the song on YouTube
    const searchResults = await yts(song);
    if (!searchResults.videos.length) {
      return api.sendMessage("त्रुटि: मान्य अनुरोध नहीं है।", event.threadID, event.messageID);
    }

    const video = searchResults.videos[0];
    const videoId = video.videoId; // Get video ID

    // Set up YouTube API
    const youtube = google.youtube({
      version: 'v3',
      auth: 'AIzaSyBK4g5TpZpBGunGYyi3ANMkFY-PkvJExOg' // Replace with your YouTube API Key
    });

    // Get video details
    const videoDetails = await youtube.videos.list({
      part: 'snippet,contentDetails',
      id: videoId
    });

    const fileName = `${event.senderID}.mp3`;
    const filePath = __dirname + `/cache/${fileName}`;

    // Download the audio using the video URL directly
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const response = await axios({
      url: videoUrl,
      method: 'GET',
      responseType: 'stream'
    });

    // Pipe the stream to the file system
    const stream = response.data.pipe(fs.createWriteStream(filePath));

    stream.on('response', () => {
      console.info('[DOWNLOADER]', 'Download शुरू हो रहा है!');
    });

    stream.on('end', () => {
      console.info('[DOWNLOADER]', 'Download पूरा हो गया।');

      // Check if the file is larger than 25MB
      if (fs.statSync(filePath).size > 26214400) {
        fs.unlinkSync(filePath);
        return api.sendMessage('[त्रुटि] फ़ाइल 25MB से बड़ी है और नहीं भेजी जा सकती।', event.threadID);
      }

      const message = {
        body: `ये रहा आपका संगीत!🥰\n\nशीर्षक: ${video.title}\nकलाकार: ${videoDetails.data.items[0].snippet.channelTitle}`, // Updated to use channel title from videoDetails
        attachment: fs.createReadStream(filePath)
      };

      // Send the message with the music file
      api.sendMessage(message, event.threadID, () => {
        // Remove the file after sending
        fs.unlinkSync(filePath);
      });
    });
  } catch (error) {
    console.error('[ERROR]', error);
    api.sendMessage('कमांड को प्रोसेस करते समय एक त्रुटि हुई।', event.threadID);
  }
};
