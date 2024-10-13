module.exports.config = {
    name: "imgbb",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "PREM BABU",
    description: "THIS BOT IS MADE BY MR PREM BABU",
    commandCategory: "IMAGE LINK GENERATION",
    usages: "REPLY TO IMAGE",
    cooldowns: 5,
    dependencies: {
  "axios": "",}
};
 
module.exports.run = async ({ api, event }) => {
const axios = global.nodemodule['axios'];  
var linkanh = event.messageReply.attachments[0].url || args.join(" ");
    if(!linkanh) return api.sendMessage('Please reply to image.', event.threadID, event.messageID)
const res = await axios.get(`http://zekais-api.herokuapp.com/imgbb?url=${encodeURIComponent(linkanh)}&apikey=N3MqSq2j`);    
var juswa = res.data.uploaded.image;
    return api.sendMessage(`${juswa}`, event.threadID, event.messageID);
 
}
