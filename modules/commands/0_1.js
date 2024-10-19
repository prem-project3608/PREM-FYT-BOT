const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs-extra');
const path = require('path');
const { image } = require('image-downloader');

module.exports.config = {
    name: 'Remove Background from photo',
    version: '1.1.1',
    hasPermssion: 0,
    credits: 'Prem babu',
    description: 'Remove Background from any photo you reply to',
    commandCategory: 'Tool',
    usages: 'Reply with a photo to use this command',
    cooldowns: 2,
    dependencies: { 'form-data': '', 'image-downloader': '' }
};

module.exports.run = async function ({ api, event, args }) {
    const threadID = event.threadID;
    const messageID = event.messageID;
    
    if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
        return api.sendMessage("You must reply to a photo.", threadID, messageID);
    }

    if (event.messageReply.attachments[0].type !== 'photo') {
        return api.sendMessage("This is not an image.", threadID, messageID);
    }

    const imageUrl = event.messageReply.attachments[0].url;
    const savePath = path.resolve(__dirname, 'photo.png');
    
    try {
        // Download image
        await image({ url: imageUrl, dest: savePath });

        const form = new FormData();
        form.append('size', 'auto');
        form.append('image_file', fs.createReadStream(savePath));

        const apiKey = 'your-remove-bg-api-key'; // Add your Remove BG API key here
        const response = await axios.post('https://api.remove.bg/v1.0/removebg', form, {
            headers: { ...form.getHeaders(), 'X-Api-Key': apiKey },
            responseType: 'arraybuffer'
        });

        if (response.status !== 200) throw new Error(`Request failed: ${response.statusText}`);

        fs.writeFileSync(savePath, response.data);
        api.sendMessage({ attachment: fs.createReadStream(savePath) }, threadID, () => {
            fs.unlinkSync(savePath);
        });
    } catch (error) {
        console.log("Error:", error);
        api.sendMessage("Error removing background from image.", threadID, messageID);
    }
};
