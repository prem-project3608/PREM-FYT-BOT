module.exports.config = {
    name: 'imgur',
    version: '1.1.1',
    hasPermssion: 0,
    credits: 'PREM BABU',
    description: 'THIS BOT IS MADE BY PREM BABU',
    commandCategory: 'UPLOAD TO IMGUR',
    usages: 'REPLY IMAGE OR URL',
    cooldowns: 2,
    dependencies: {
        'axios': '',
        'form-data': '',
        'image-downloader': ''
    }
};

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs-extra');
const path = require('path');
const { image } = require('image-downloader');

module.exports.run = async function({ api, event, args }) {
    try {
        if (event.type !== "message_reply") 
            return api.sendMessage("अरे यार किसी एक इमेज को रिप्लाई देके कमांड दो 😏✋", event.threadID, event.messageID);

        api.sendMessage("एक मिनट रुको दोस्त 🙂🤞", event.threadID, event.messageID);
        
        if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) 
            return api.sendMessage("आपने कोई इमेज नहीं भेजी।", event.threadID, event.messageID);
        
        if (event.messageReply.attachments[0].type != "photo") 
            return api.sendMessage("सॉरी दोस्त, ये इमेज नहीं है। 😐🤞", event.threadID, event.messageID);

        const content = event.messageReply.attachments[0].url;
        const inputPath = path.resolve(__dirname, 'cache', `photo.png`);
        
        await image({ url: content, dest: inputPath });

        const formData = new FormData();
        formData.append('image', fs.createReadStream(inputPath));

        const response = await axios.post('https://api.imgur.com/3/image', formData, {
            headers: {
                ...formData.getHeaders(),
                'Authorization': '682fcb553792709'  // अपने Imgur Client ID यहाँ डालें
            }
        });

        if (response.status === 200) {
            const imgurLink = response.data.data.link;
            api.sendMessage(`यहाँ आपका इमेज लिंक है: ${imgurLink}`, event.threadID, () => fs.unlinkSync(inputPath));
        } else {
            api.sendMessage("इमेज अपलोड करने में कोई समस्या आई है।", event.threadID, event.messageID);
        }

    } catch (e) {
        console.log(e);
        return api.sendMessage(`बैकग्राउंड रिमूव करने में कोई ईशु आ गया है 😐🤞`, event.threadID, event.messageID);
    }
}
