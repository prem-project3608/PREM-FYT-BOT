const axios = require('axios');

module.exports.config = {
  name: "test",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SHANKAR",
  description: "JioSaavn se song search kar ke deta hai",
  commandCategory: "Music",
  usages: "music <song name>",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  
  // User input se song ka naam lete hain
  const query = args.join(" ");
  if (!query) return api.sendMessage("Kripya song ka naam bhi likho!", threadID, messageID);

  try {
    // JioSaavn API se song search karte hain
    const response = await axios.get(`https://jiosaavn-api-v2.vercel.app/search/songs?query=${encodeURIComponent(query)}`);
    
    if (!response.data.results || response.data.results.length === 0) {
      return api.sendMessage("Sorry, koi result nahi mila.", threadID, messageID);
    }

    // Pehle song ka details lete hain
    const song = response.data.results[0];
    const songTitle = song.title;
    const songUrl = song.media_url;  // Downloadable audio link

    // User ko song details aur link send karenge
    return api.sendMessage(`🎶 Yeh raha tumhara gana: ${songTitle}\n\n🔗 Direct Download Link: ${songUrl}`, threadID, messageID);
  } catch (error) {
    console.error("JioSaavn API error:", error);
    return api.sendMessage("JioSaavn se song laane me gadbad hui.", threadID, messageID);
  }
};
