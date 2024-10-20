const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs-extra');
const path = require('path');
const { image } = require('image-downloader');

module.exports.config = {
  name: 'test',
  version: '1.1.1',
  hasPermssion: 0,
  credits: 'PREM BABU',
  description: 'THIS BOT IS MADE BY MR PREM BABU',
  commandCategory: 'REMOVE BACKGROUND IMAGES',
  usages: 'Reply images or url images',
  cooldowns: 2,
  dependencies: {
    'form-data': '',
    'image-downloader': ''
  }
};

module.exports.run = async function ({ api, event, args }) {
  if (this.config.credits !== 'PREM BABU') {
    return console.log('Change credits to your own');
  }
  
  try {
    if (event.type !== "message_reply") {
      return api.sendMessage("You must reply to a photo", event.threadID, event.messageID);
    }

    if (!event.messageReply.attachments || event.messageReply.attachments.length === 0) {
      return api.sendMessage("No image found", event.threadID, event.messageID);
    }

    if (event.messageReply.attachments[0].type !== "photo") {
      return api.sendMessage("This is not a valid image", event.threadID, event.messageID);
    }

    const content = event.messageReply.attachments[0].url;
    const apiKeys = ['y5K9ssQnhr8sB9Tp4hrMsLtU', 's6d6EanXm7pEsck9zKjgnJ5u', 'GJkFyR3WdGAwn8xW5MDYAVWf', 'ymutgb6hEYEDR6xUbfQUiPri', 'm6AhtWhWJBAPqZzy5BrvMmUp'];
    const url = 'https://api.remove.bg/v1/removebg';
    const inputPath = path.resolve(__dirname, 'cache', 'photo.png');

    await image({ url: content, dest: inputPath });

    const formData = new FormData();
    formData.append('size', 'auto');
    formData.append('image_file', fs.createReadStream(inputPath), path.basename(inputPath));

    const response = await axios.post(url, formData, {
      responseType: 'arraybuffer',
      headers: {
        ...formData.getHeaders(),
        'X-Api-Key': apiKeys[Math.floor(Math.random() * apiKeys.length)],
      },
      encoding: null
    });

    if (response.status !== 200) {
      return console.error('Error:', response.status, response.statusText);
    }

    fs.writeFileSync(inputPath, response.data);
    return api.sendMessage({ attachment: fs.createReadStream(inputPath) }, event.threadID, () => fs.unlinkSync(inputPath));
    
  } catch (error) {
    console.error('Failed to remove background:', error);
    return api.sendMessage("Error in removing background", event.threadID, event.messageID);
  }
};
