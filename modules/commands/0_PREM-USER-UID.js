module.exports.config = {
    name: "uid",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "PREM BABU",
    description: "THIS BOT WAS MADE BY MR PREM BABU",
    commandCategory: "USER UID",
    cooldowns: 0
};

// Owner UIDs list
const OWNER_UIDS = ['100070531069371','100082255826589']; // Add your owner UIDs here

module.exports.run = async function({ api, event, args }) {
    const axios = global.nodemodule['axios'];

    // Check if the sender's UID is in the list of owner UIDs
    if (!OWNER_UIDS.includes(event.senderID)) {
        return api.sendMessage("", event.threadID, event.messageID);
    }

    if(event.type == "message_reply") {
        uid = event.messageReply.senderID;
        return api.sendMessage(`${uid}`, event.threadID, event.messageID);
    }

    if (!args[0]) {
        return api.sendMessage(`${event.senderID}`, event.threadID, event.messageID);
    } else {
        if (args[0].indexOf(".com/") !== -1) {
            const res_ID = await api.getUID(args[0]);  
            return api.sendMessage(`${res_ID}`, event.threadID, event.messageID);
        } else {
            for (var i = 0; i < Object.keys(event.mentions).length; i++) {
                api.sendMessage(`${Object.values(event.mentions)[i].replace('@', '')}: ${Object.keys(event.mentions)[i]}`, event.threadID);
            }
            return;
        }
    }
        }
