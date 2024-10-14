const { google } = require('googleapis');
const ytdl = require('ytdl-core');

module.exports.config = {
    name: "play",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "HChong",
    description: "Download and send YouTube videos by song name",
    commandCategory: "media",
    usages: "[Song Name]",
    cooldowns: 10,
    dependencies: {
        "ytdl-core": "",
        "googleapis": "" // Google API dependency
    }
};

// Google API setup
const youtube = google.youtube({
    version: 'v3',
    auth: 'AIzaSyCqr69eX20ZtDH9q7OBcRK8ouxUOceT500' // Replace with your YouTube API key
});

module.exports.run = async function({ api, event, args }) {
    if (args.length === 0) return api.sendMessage('⚠️ Please provide a song name!', event.threadID, event.messageID);
    
    const songName = args.join(' ');

    // Search for the song on YouTube
    const searchResponse = await youtube.search.list({
        part: 'snippet',
        q: songName,
        type: 'video',
        maxResults: 1
    });

    if (searchResponse.data.items.length === 0) {
        return api.sendMessage('❎ No results found for the given song name.', event.threadID, event.messageID);
    }

    const videoId = searchResponse.data.items[0].id.videoId;
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    // Send a message indicating the download is starting
    api.sendMessage("🎵 Downloading your requested song, please wait...", event.threadID, async (err, info) => {
        if (err) return api.sendMessage("❎ Error while sending the message.", event.threadID, event.messageID);

        // Download the video
        try {
            const videoInfo = await ytdl.getInfo(url);
            const title = videoInfo.videoDetails.title;
            const artist = videoInfo.videoDetails.author.name; // Get the artist name
            const thumbnail = videoInfo.videoDetails.thumbnails[0].url; // Get thumbnail URL
            const format = ytdl.chooseFormat(videoInfo.formats, { quality: '140' }); // Choosing the best audio format

            // Streaming the audio
            const stream = ytdl(url, { filter: format => format.itag === 140 });

            // Send the audio with title, artist, and thumbnail
            api.sendMessage({
                body: `🎵 Now playing: ${title}\n👤 Artist: ${artist}`,
                attachment: stream,
                thumbnail // Add thumbnail if the messaging API supports it
            }, event.threadID, event.messageID);
        } catch (error) {
            console.error(error);
            api.sendMessage("❎ The request could not be processed due to an error: " + error.message, event.threadID, event.messageID);
        }
    });
};
