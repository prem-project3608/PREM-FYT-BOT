const fs = require("fs-extra");
const axios = require("axios");

const API_KEY = "आपकी_Pinterest_API_की"; // यहाँ अपनी API की डालें

module.exports.config = {
    name: "pic",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    description: "Image search from Pinterest",
    commandCategory: "Search",
    usePrefix: false,
    usages: "[Text]",
    cooldowns: 0,
};

let lastImageIndex = {}; // प्रत्येक उपयोगकर्ता के लिए चित्र का इंडेक्स ट्रैक करने के लिए

module.exports.run = async function({ api, event, args }) {
    const keySearch = args.join(" ");
    if (!keySearch) {
        return api.sendMessage('Please provide a search keyword.', event.threadID, event.messageID);
    }

    // Pinterest API से चित्रों की खोज करें
    const res = await axios.get(`https://api.pinterest.com/v1/search/pins/?query=${encodeURIComponent(keySearch)}&access_token=${API_KEY}`);
    
    if (res.data.data.length === 0) {
        return api.sendMessage('No images found for the given keyword.', event.threadID, event.messageID);
    }

    // उपयोगकर्ता का UID प्राप्त करें
    const userID = event.senderID;
    
    // पिछले चित्र के इंडेक्स को अपडेट करें
    if (!lastImageIndex[userID]) {
        lastImageIndex[userID] = 0; // प्रारंभिक इंडेक्स 0 पर सेट करें
    } else {
        lastImageIndex[userID] = (lastImageIndex[userID] + 1) % res.data.data.length; // अगले चित्र के लिए इंडेक्स बढ़ाएँ
    }

    const imageUrl = res.data.data[lastImageIndex[userID]].image.original.url; // चित्र का URL
    let path = __dirname + `/cache/${userID}.jpg`;
    const getDown = (await axios.get(imageUrl, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(path, Buffer.from(getDown, 'utf-8'));

    api.sendMessage({
        attachment: fs.createReadStream(path),
        body: 'Here is your image for: ' + keySearch
    }, event.threadID, event.messageID);

    // डाउनलोड की गई फ़ाइल को हटा दें
    fs.unlinkSync(path);
};
