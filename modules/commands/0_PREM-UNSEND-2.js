const fs = require('fs');
module.exports.config = {
	name: "uns",
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
	  return api.sendMessage(`बॉस ऑन या ऑफ करना है 🤔🤞`, event.threadID, event.messageID)} 
    if(args[0] == "on") { 
        data[threadID].data = true; 
        api.sendMessage("ऑन हो गया बॉस 🙂🤞", threadID); 
    } else if(args[0] == "off") { 
        data[threadID].data = false; 
        api.sendMessage("ऑफ हो गया बॉस 🙂🤞", threadID);
    }
    fs.writeFileSync(path, JSON.stringify(data, null, 4));
}
