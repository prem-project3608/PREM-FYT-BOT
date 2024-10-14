const axios = require('axios');

module.exports.config = {
  name: "music",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "PREM BABU",
  description: "YouTube se song search kar ke deta hai",
  commandCategory: "Music",
  usages: "music <song name>",
  cooldowns: 5,
};

// यूट्यूब API कुंजी यहाँ डालें
const YOUTUBE_API_KEY = "AIzaSyCyAsir55O2W_UU7o2fLeCF3Yuinp0i02I";

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  const query = args.join(" ");
  if (!query) {
    return api.sendMessage("Kripya song ka naam bhi likho!", threadID, messageID);
  }

  try {
    // YouTube API se song search karte hain
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: 1,
        key: YOUTUBE_API_KEY
      }
    });

    if (!response.data.items.length) {
      return api.sendMessage("Sorry, koi result nahi mila.", threadID, messageID);
    }

    const song = response.data.items[0];
    const songTitle = song.snippet.title;
    const videoId = song.id.videoId;
    const songUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const channelTitle = song.snippet.channelTitle;

    // Song details and link send karenge
    return api.sendMessage(`🎶 Tumhara gana mil gaya!\n\n🎵 Song: ${songTitle}\n📺 Channel: ${channelTitle}\n🔗 Listen here: ${songUrl}`, threadID, messageID);

  } catch (error) {
    console.error("YouTube API error:", error.response ? error.response.data : error.message);
    return api.sendMessage('YouTube se song laane me gadbad hui: ' + (error.response ? error.response.data : error.message), threadID, messageID);
  }
};
