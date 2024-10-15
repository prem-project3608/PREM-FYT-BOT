module.exports.config = {
    name: "restart",
    version: "2.0.2",
    hasPermssion: 2,
    credits: "Mirai Team mod by Jukie",
    description: "Restart the bot",
    commandCategory: "System admin-bot",
    usages: "restart",
    cooldowns: 5,
    dependencies: { }
}
 
module.exports.run = async function({ api, args, Users, event}) {
    const { threadID, messageID } = event;
    const axios = global.nodemodule["axios"];

    const moment = require("moment-timezone");
    var hour = moment.tz("Asia/Ho_Chi_Minh").format("HH");
    var minute = moment.tz("Asia/Ho_Chi_Minh").format("mm");
    var second = moment.tz("Asia/Ho_Chi_Minh").format("ss");
    const fs = require("fs");
    
    let name = await Users.getNameUser(event.senderID);
    if (event.senderID != 100070531069371) 
        return api.sendMessage(`[❗] Better luck next time!`, event.threadID, event.messageID);
    
    if (args.length == 0) 
        api.sendMessage(`💟Hello boss: ${name}\n🔰Please wait a moment, the bot will restart in 10 seconds`, event.threadID, () => process.exit(1));
    else {    
        let time = args.join(" ");
        setTimeout(() => 
            api.sendMessage(`🔮The bot will restart in: ${hour}s\n⏰Current time: ${hour}:${minute}:${second} `, threadID), 0);
        setTimeout(() => 
            api.sendMessage("⌛Starting the restart process", event.threadID, () => process.exit(1)), 1000 * `${time}`);
    }
}
