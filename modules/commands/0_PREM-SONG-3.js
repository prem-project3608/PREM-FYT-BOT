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

// यूट्यूब API क्लाइंट ID और सीक्रेट यहाँ डालें
const CLIENT_ID = "YOUR_CLIENT_ID"; // अपना क्लाइंट ID यहाँ डालें
const CLIENT_SECRET = "YOUR_CLIENT_SECRET"; // अपना सीक्रेट यहाँ डालें

async function getAccessToken() {
  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', null, {
      params: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'client_credentials',
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error("Access token error:", error.response ? error.response.data : error.message);
    throw new Error('Unable to get access token');
  }
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  const query = args.join(" ");
  if (!query) {
    return api.sendMessage("Kripya song ka naam bhi likho!", threadID, messageID);
  }

  try {
    // Access token prapt karna
    const accessToken = await getAccessToken();

    // YouTube API se song search karte hain
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: 1,
        key: accessToken // Access token ka istemal karte hain
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
