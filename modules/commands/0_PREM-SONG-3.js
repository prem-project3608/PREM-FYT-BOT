const axios = require('axios');

module.exports.config = {
  name: "play",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "PREM BABU",
  description: "SoundCloud se song search kar ke deta hai",
  commandCategory: "Music",
  usages: "music <song name>",
  cooldowns: 5,
};

// SoundCloud API Client ID यहाँ डालें
const CLIENT_ID = "YOUR_SOUNDCLOUD_CLIENT_ID"; // अपना Client ID यहाँ डालें

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  const query = args.join(" ");
  if (!query) {
    return api.sendMessage("Kripya song ka naam bhi likho!", threadID, messageID);
  }

  try {
    // SoundCloud API se song search karte hain
    const response = await axios.get('https://api.soundcloud.com/tracks', {
      params: {
        client_id: CLIENT_ID,
        q: query,
        limit: 1
      }
    });

    if (!response.data.length) {
      return api.sendMessage("Sorry, koi result nahi mila.", threadID, messageID);
    }

    const song = response.data[0];
    const songTitle = song.title;
    const songUrl = song.permalink_url;
    const userName = song.user.username;

    // Song details and link send karenge
    return api.sendMessage(`🎶 Tumhara gana mil gaya!\n\n🎵 Song: ${songTitle}\n👤 Artist: ${userName}\n🔗 Listen here: ${songUrl}`, threadID, messageID);

  } catch (error) {
    console.error("SoundCloud API error:", error.response ? error.response.data : error.message);
    return api.sendMessage('SoundCloud se song laane me gadbad hui: ' + (error.response ? error.response.data : error.message), threadID, messageID);
  }
};
