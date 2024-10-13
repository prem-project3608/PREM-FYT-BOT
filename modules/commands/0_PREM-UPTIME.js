module.exports.config = {
  name: "uptime",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "PREM BABU",
  description: "THIS BOT WAS MADE BY MR PREM BABU",
  commandCategory: "RUNNING BOT UPTIME",
  usages: "NO PREFIX",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args, utils }) => {
const axios = require("axios");
  if(0==!args.join(" ").indexOf("https://")) 
     api.sendMessage("Vui lòng nhập link trang wed muốn hoạt động 24/24", event.threadID, event.messageID);
  else {
var url = (await axios.get(`https://Uptime.abcdz1238.repl.co/?add=${args.join(' ')}`)).data;
  if (url.error) {api.sendMessage(`━━━━━━━━[ 𝗨𝗣𝗧𝗜𝗠𝗘 ]━━━━━━━━\n\n❌ Server Uptime gặp sự cố, không thể kết nối uptime cho bạn!`, event.threadID, event.messageID)}
    else { 
      return api.sendMessage(`━━━━━━━━[ 𝗨𝗣𝗧𝗜𝗠𝗘 ]━━━━━━━━\n\n📡 𝗕𝗼𝘁 𝘃𝘂̛̀𝗮 𝘁𝗿𝗲𝗼 𝗹𝗶𝗻𝗸 𝗰𝘂̉𝗮 𝗯𝗮̣𝗻 𝘃𝗮̀𝗼 𝗦𝗲𝘃𝗲𝗿 𝗨𝗽𝘁𝗶𝗺𝗲 ✓\n📎 𝗟𝗶𝗻𝗸 𝘃𝘂̛̀𝗮 𝘁𝗵𝗲̂𝗺:\n${args.join(' ')}`, event.threadID, event.messageID);
     	}
   }
}
