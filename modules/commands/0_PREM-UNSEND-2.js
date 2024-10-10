const fs = require('fs');
module.exports.config = {
	name: "unsendReaction",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "PREM BABU",
	description: "THIS BOT WAS MADE BY MR PREM BABU",
	commandCategory: "REACTION UNSEND",
	usages: "[on/off]",
	cooldowns: 5, //
};

module.exports.run = async({ api, event, args }) => {
    const { threadID, messageID } = event;
    let path = __dirname + "/PREM-BABU/PREM-UNSEND.json";
    if(!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));
    let data = JSON.parse(fs.readFileSync(path));
    if(!data[threadID]) data[threadID] = { data: false };
   if (args.join() == "") { 
	  return api.sendMessage(`» Vui lòng chọn [ on / off ].`, event.threadID, event.messageID)} 
    if(args[0] == "on") { 
        data[threadID].data = true; 
        api.sendMessage("» Đã bật chế độ unsendReaction.", threadID); 
    } else if(args[0] == "off") { 
        data[threadID].data = false; 
        api.sendMessage("» Đã tắt chế độ unsendReaction.", threadID);
    }
    fs.writeFileSync(path, JSON.stringify(data, null, 4));
}
