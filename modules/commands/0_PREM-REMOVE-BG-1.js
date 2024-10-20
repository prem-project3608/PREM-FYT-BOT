module.exports.config = {
  name: 'png',
  version: '1.1.1',
  hasPermssion: 0,
  credits: 'PREM BABU',
  description: 'THIS BOT IS MADE BY PREM BABU',
  commandCategory: 'REMOVE BACKGROUND IMAGES',
  usages: 'REPLY IMAGE OR URL',
  cooldowns: 2,
  dependencies: {
       'form-data': '',
       'image-downloader': ''
    }
};

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs-extra');
const path = require('path');
const {image} = require('image-downloader');
module.exports.run = async function({
    api, event, args
}){
    try {
        if (event.type !== "message_reply") return api.sendMessage("अरे यार किसी एक इमेज को रिप्लाई देके कमांड दो 😏✋", event.threadID, event.messageID); api.sendMessage("एक मिनट रुको दोस्त 🙂🤞", event.threadID, event.messageID);
        if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage("ये लो दोस्त बैकग्राउंड को रिमूव कर दिया 🙂🤞", event.threadID, event.messageID);
        if (event.messageReply.attachments[0].type != "photo") return api.sendMessage("सॉरी दोस्त ये इमेज का बैकग्राउंड रिमूव नही हो सकता 😐🤞", event.threadID, event.messageID);

        const content = (event.type == "message_reply") ? event.messageReply.attachments[0].url : args.join(" ");
        const prApi = ["8968b441784234f1f0ebf1ef5ff8f0bb73d9215f"]
        const inputPath = path.resolve(__dirname, 'cache', `photo.png`);
         await image({
        url: content, dest: inputPath
    });
        const formData = new FormData();
        formData.append('size', 'auto');
        formData.append('image_file', fs.createReadStream(inputPath), path.basename(inputPath));
        axios({
            method: 'post',
            url: 'https://sdk.photoroom.com/v1/segment',
            data: formData,
            responseType: 'arraybuffer',
            headers: {
                ...formData.getHeaders(),
                'X-Api-Key': prApi[Math.floor(Math.random() * prApi.length)],
            },
            encoding: null
        })
            .then((response) => {
                if (response.status != 200) return console.error('Error:', response.status, response.statusText);
                fs.writeFileSync(inputPath, response.data);
                return api.sendMessage({ attachment: fs.createReadStream(inputPath) }, event.threadID, () => fs.unlinkSync(inputPath));
            })
            .catch((error) => {
                return console.error('रिमूव बैकग्राउंड का ए_पी_आई फेल हो गया 😐🤞', error);
            });
     } catch (e) {
        console.log(e)
        return api.sendMessage(`बैकग्राउंड रिमूव करने में कोई ईशु आ गया है 😐🤞`, event.threadID, event.messageID);
  }
         }
