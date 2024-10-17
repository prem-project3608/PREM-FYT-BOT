const API_KEY = "YOUR_API_KEY_HERE"; // यहाँ पर अपनी API कुंजी डालें

module.exports.config = {
    name: "imgur",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "PREM BABU",
    description: "THIS BOT WAS MADE BY MR PREM BABU",
    commandCategory: "REPLY IMAGE",
    usages: "PREFIX",
    cooldowns: 1,
    dependencies: {
        "axios": "",
    }
};

module.exports.run = async ({ api, event }) => {
    const axios = global.nodemodule['axios'];  
    var ZiaRein = event.messageReply.attachments[0].url || args.join(" ");
    
    if (!ZiaRein) return api.sendMessage(`अरे यार फोटो को रिप्लाई कर के कमांड लिखो 🙂✌️`, event.threadID, event.messageID);
    
    try {
        const res = await axios.post(`https://api.imgur.com/3/image`, {
            image: ZiaRein // Imgur API को इमेज भेजें
        }, {
            headers: {
                'Authorization': `Client-ID ${API_KEY}` // यहाँ API कुंजी का उपयोग करें
            }
        });

        var ZiaReinn = res.data.data.link; // डाटा को सही तरीके से एक्सेस करें
        return api.sendMessage(ZiaReinn, event.threadID, event.messageID);
    } catch (error) {
        console.error(error);
        return api.sendMessage(`कुछ गलती हो गई, कृपया फिर से प्रयास करें।`, event.threadID, event.messageID);
    }
}
