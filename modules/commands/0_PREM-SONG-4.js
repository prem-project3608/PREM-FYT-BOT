const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const SPOTIFY_CLIENT_ID = "41dd52e608ee4c4ba8b196b943db9f73";
const SPOTIFY_CLIENT_SECRET = "5c7b438712b04d0a9fe2eaae6072fa16";

module.exports.config = {
  name: "music",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SHANKAR",
  description: "Search and download songs from Spotify",
  commandCategory: "Music",
  usages: "music <song name>",
  cooldowns: 5,
};

// Function to get Spotify access token
async function getSpotifyToken() {
  const tokenRes = await axios.post("https://accounts.spotify.com/api/token", new URLSearchParams({
    grant_type: "client_credentials"
  }).toString(), {
    headers: {
      "Authorization": `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
  return tokenRes.data.access_token;
}

// Function to search Spotify for a track
async function searchSpotifyTrack(trackName, token) {
  const searchRes = await axios.get(`https://api.spotify.com/v1/search`, {
    headers: {
      "Authorization": `Bearer ${token}`
    },
    params: {
      q: trackName,
      type: "track",
      limit: 1
    }
  });

  if (searchRes.data.tracks.items.length === 0) {
    throw new Error("No track found with the given name.");
  }

  return searchRes.data.tracks.items[0]; // Return the first track
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  try {
    const trackName = args.join(" ").trim();
    if (!trackName) {
      return api.sendMessage("गाना नाम तो लिख लो बाबू 😒.", threadID, messageID);
    }

    // Get Spotify Access Token
    const spotifyToken = await getSpotifyToken();

    // Search for the track on Spotify
    const track = await searchSpotifyTrack(trackName, spotifyToken);
    const trackUrl = track.external_urls.spotify;

    // Fetch song download details
    const res = await axios.get(`https://for-devs.onrender.com/api/spotify/download?url=${encodeURIComponent(trackUrl)}&apikey=r-e377e74a78b7363636jsj8ffb61ce`);
    const songData = res.data;

    if (!songData || !songData.downloadUrl) {
      return api.sendMessage(`Unable to download song for "${trackName}". Please try again.`, threadID, messageID);
    }

    const songPath = path.join(__dirname, 'cache', `${songData.id}.mp3`);

    // Download the song
    const songResponse = await axios.get(songData.downloadUrl, { responseType: 'arraybuffer' });
    await fs.outputFile(songPath, songResponse.data);

    // Send the song without cover
    await api.sendMessage({
      attachment: fs.createReadStream(songPath),
      body: `🎵 Title: ${songData.title}\n👤 Artists: ${songData.artists}`
    }, threadID, messageID);

    // Clean up cached files
    await fs.remove(songPath);
  } catch (error) {
    console.error("Error:", error);
    return api.sendMessage(`An error occurred: ${error.message}`, threadID, messageID);
  }
};
