const fs = require('fs');
const ytdl = require('ytdl-core');
const { resolve } = require('path');

// Function to download music from YouTube
async function downloadMusicFromYoutube(link, path) {
    var timestart = Date.now();
    if (!link) return 'Missing link';
    
    var resolveFunc = function () { };
    var rejectFunc = function () { };
    var returnPromise = new Promise(function (resolve, reject) {
        resolveFunc = resolve;
        rejectFunc = reject;
    });
    
    ytdl(link, {
        filter: format =>
            format.quality == 'tiny' && format.audioBitrate == 48 && format.hasAudio == true
    }).pipe(fs.createWriteStream(path))
        .on("close", async () => {
            var data = await ytdl.getInfo(link);
            var result = {
                title: data.videoDetails.title,
                dur: Number(data.videoDetails.lengthSeconds),
                viewCount: data.videoDetails.viewCount,
                likes: data.videoDetails.likes,
                author: data.videoDetails.author.name,
                timestart: timestart
            };
            resolveFunc(result);
        });

    return returnPromise;
}

// Convert duration to H:M:S format
module.exports.convertHMS = function (value) {
    const sec = parseInt(value, 10); 
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60); 
    let seconds = sec - (hours * 3600) - (minutes * 60); 
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return (hours != '00' ? hours + ':' : '') + minutes + ':' + seconds;
};

// Main run function to handle the command
module.exports.run = async function ({ api, event, args }) {
    if (args.length == 0 || !args) return api.sendMessage('Gana ka naam to likho bhai! 🤐👈', event.threadID, event.messageID);
    
    const keywordSearch = args.join(" ");
    const path = `${__dirname}/cache/1.mp3`;
    
    if (fs.existsSync(path)) { 
        fs.unlinkSync(path);
    }
    
    const Youtube = require('youtube-search-api');

    try {
        // Get the first result from YouTube search
        var data = (await Youtube.GetListByKeyword(keywordSearch, false, 1)).items[0]; // Only get the first result
        var link = 'https://www.youtube.com/watch?v=' + data.id;
        
        var downloadData = await downloadMusicFromYoutube(link, path);
        
        if (fs.statSync(path).size > 26214400) return api.sendMessage('Unable to send files because the capacity is greater than 25MB.', event.threadID, () => fs.unlinkSync(path), event.messageID);
        
        return api.sendMessage({
            body: `🎵 Title: ${downloadData.title}\n🎶 Channel: ${downloadData.author}\n⏱️ Duration: ${this.convertHMS(downloadData.dur)}\n👀 Views: ${downloadData.viewCount}\n👍 Likes: ${downloadData.likes}\n⏱️ Processing time: ${Math.floor((Date.now() - downloadData.timestart) / 1000)} seconds`,
            attachment: fs.createReadStream(path)
        }, event.threadID, () => fs.unlinkSync(path), event.messageID);

    } catch (e) {
        return api.sendMessage('An error has occurred, please try again in a moment!!\n' + e, event.threadID, event.messageID);
    }
};

// Configuration for the command
module.exports.config = {
    name: "sing",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "PREM BABU",
    description: "Download music from YouTube based on search",
    commandCategory: "music",
    usages: "[searchMusic]",
    cooldowns: 0
};
