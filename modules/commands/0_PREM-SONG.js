const fs = require("fs-extra");
const axios = require("axios");
const yts = require("yt-search");
const { google } = require("googleapis");

// YouTube API key
const youtubeApiKey = 'AIzaSyBK4g5TpZpBGunGYyi3ANMkFY-PkvJExOg'; // यहां अपनी YouTube API की कुंजी डालें

module.exports.config = {
  name: "song",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Your Name",
  description: "Send a song directly",
  commandCategory: "utility",
  usages: "[song title]",
  prefix: true,
  cooldowns: 10,
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
      return api.sendMessage("त्रुटि: मान्य अनुरोध नहीं है।", event.threadID);
    }

    const video = searchResults.videos[0];
    const videoId = video.videoId; // Get video ID

    // Set up YouTube API
    const youtube = google.youtube({
      version: 'v3',
      auth: youtubeApiKey // Use the API key defined above
    });

    // Get video details
    const videoDetails = await youtube.videos.list({
      part: 'snippet,contentDetails',
      id: videoId
    });

    const message = {
      body: `ये रहा आपका संगीत!🥰\n\nशीर्षक: ${video.title}\nकलाकार: ${videoDetails.data.items[0].snippet.channelTitle}\n लिंक: https://www.youtube.com/watch?v=${videoId}`, // Send the song title and link
    };

    // Send the message with the music details
    api.sendMessage(message, event.threadID);
  } catch (error) {
    console.error('[ERROR]', error);
    api.sendMessage('कमांड को प्रोसेस करते समय एक त्रुटि हुई।', event.threadID);
  }
};
