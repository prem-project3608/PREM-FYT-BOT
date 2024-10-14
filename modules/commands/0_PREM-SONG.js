module.exports.config = {
    name: "play",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "HChong",
    description: "Download and send YouTube videos",
    commandCategory: "media",
    usages: "[YouTube URL]",
    cooldowns: 10,
    dependencies: {
        "ytdl-core": "" // ytdl-core dependency
    }
};

const ytdl = require('ytdl-core');

module.exports.run = async function({ api, event, args }) {
    if (args.length === 0) return api.sendMessage('⚠️ Please provide a YouTube URL!', event.threadID, event.messageID);
    
    const url = args[0];
    
    // Validate YouTube URL
    if (!ytdl.validateURL(url)) {
        return api.sendMessage('❎ Invalid YouTube URL.', event.threadID, event.messageID);
    }

    // Send a message indicating the download is starting
    api.sendMessage("🎵 Downloading your requested song, please wait...", event.threadID, async (err, info) => {
        if (err) return api.sendMessage("❎ Error while sending the message.", event.threadID, event.messageID);

        // Download the video
        try {
            const info = await ytdl.getInfo(url);
            const title = info.videoDetails.title;
            const artist = info.videoDetails.author.name; // Get the artist name
            const thumbnail = info.videoDetails.thumbnails[0].url; // Get thumbnail URL
            const format = ytdl.chooseFormat(info.formats, { quality: '140' }); // Choosing the best audio format

            // Streaming the audio
            const stream = ytdl(url, { filter: format => format.itag === 140 });

            // Send the audio with title, artist and thumbnail
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
