module.exports.config = {
    name: "music",
    version: "2.0.4",
    hasPermssion: 0,
    credits: "KSHITIZ/kira", // converted to mirai by kira
    description: "Play a song with lyrics",
    usePrefix: false,
    commandCategory: "utility",
    usages: "[title]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "request": "",
        "axios": "",
        "yt-search": ""
    }
};

module.exports.run = async ({ onRender, event }) => {
    const axios = require("axios");
    const fs = require("fs-extra");
    const yts = require("yt-search");

    const input = event.body;
    const data = input.split(" ");

    if (data.length < 2) {
        return onRender.sendMessage("Please write music name", event.threadID);
    }

    data.shift();
    const song = data.join(" ");

    try {
        onRender.sendMessage(`🔍 | 𝙎𝙚𝙖𝙧𝙘𝙝𝙞𝙣𝙜 𝙥𝙡𝙚𝙖𝙨𝙚 𝙬𝙖𝙞𝙩...`, event.threadID);

        const res = await axios.get(`https://api.popcat.xyz/lyrics?song=${encodeURIComponent(song)}`);
        const lyrics = res.data.lyrics || "Not found!";
        const title = res.data.title || "Not found!";
        const artist = res.data.artist || "Not found!";

        const searchResults = await yts(song);
        if (!searchResults.videos.length) {
            return onRender.sendMessage("Error: Invalid request.", event.threadID, event.messageID);
        }

        const video = searchResults.videos[0];
        const videoUrl = video.url;

        // अब हम बिना ytdl-core के, केवल एक लिंक भेजेंगे
        const message = {
            body: `❏ 𝙩𝙞𝙩𝙡𝙚: ${title}\n❏ 𝙖𝙧𝙩𝙞𝙨𝙩: ${artist}\n\n❏ 𝙡𝙮𝙧𝙞𝙘𝙨: ${lyrics}\n\n🔗 | [Listen here](${videoUrl})`
        };

        onRender.sendMessage(message, event.threadID);
    } catch (error) {
        console.error('[ERROR]', error);
        onRender.sendMessage('Try again later > error.', event.threadID);
    }
};
