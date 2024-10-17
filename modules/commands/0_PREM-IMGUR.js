module.exports.config = {
    name: "imgur",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "jordanofficial",
    description: "imgur upload",
    commandCategory: "link",
    usages: `Please reply to image\n\nHow to use?\n${global.config.PREFIX}imgur [reply] <img>\n\nExample:\n${global.config.PREFIX}imgur <img reply>\n`,
    cooldowns: 1,
    dependencies: {
        "axios": "",
    }
};

module.exports.run = async ({ api, event }) => {
    const axios = global.nodemodule['axios'];
    var ZiaRein = event.messageReply.attachments[0].url || args.join(" ");
    
    if (!ZiaRein) 
        return api.sendMessage(`Please reply to image\n\nHow to use?\n${global.config.PREFIX}imgur [reply] <img>\n\nExample:\n${global.config.PREFIX}imgur <img reply>\n\nCreated by: ZiaRein`, event.threadID, event.messageID);
    
    // Imgur API URL
    const imgurAPIUrl = "https://api.imgur.com/3/image";
    const apiKey = "1e9d0bad8e66dcb"; // यहां अपने API की डालें
    
    try {
        const res = await axios.post(imgurAPIUrl, {
            image: ZiaRein,
            type: "url"
        }, {
            headers: {
                Authorization: `Client-ID ${apiKey}`
            }
        });
        
        var ZiaReinn = res.data.data.link; // Uploaded image URL
        return api.sendMessage(ZiaReinn, event.threadID, event.messageID);
        
    } catch (error) {
        return api.sendMessage(`Error uploading image: ${error.response.data.message}`, event.threadID, event.messageID);
    }
}
