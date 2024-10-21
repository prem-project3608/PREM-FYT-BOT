module.exports.config = {
    name: "add",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "PREM BABU",
    description: "THIS BOT IS MADE BY PREM BABU",
    commandCategory: "ADD USER FROM GROUP",
    usages: "LINK OR UID",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args, Threads, Users }) {
    async function getUserByLink(data) {
        if (!data) return;
        var id = "";
        const paragraph = data;
        const regex = /(?:(?:http|https):\/\/)?(?:www.|m.)?facebook.com\/(?!home.php)(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\.-]+)/;
        const result = paragraph.match(regex);
        var vanity = result[1];
        var scan = isNaN(vanity);
        if (scan == true) {
            var value = await api.getUserID(vanity);
            value.forEach((i) => {
                id = i.userID;
            });
        } else id = vanity;
        return id;
    };

    const { threadID, messageID } = event;
    const axios = require('axios');
    const link = args.join(" ");
    if (!args[0]) return api.sendMessage('अरे यार जिसको ग्रुप में एड करना है उसके आईडी का लिंक या यू.आई.डी डालो साथ में 😐🤞', threadID, messageID);
    var { participantIDs, approvalMode, adminIDs } = await api.getThreadInfo(threadID);
    
    if (link.indexOf(".com/") !== -1) {
        const res = await getUserByLink(args[0] || event.messageReply.body);
        var uidUser = res;
        api.addUserToGroup(uidUser, threadID, (err) => {
            if (participantIDs.includes(uidUser)) return api.sendMessage(`ये यूजर पहले से एड है ग्रुप में 😐🤞`, threadID, messageID);
            if (err) return api.sendMessage(`सॉरी इसको ग्रुप में नही एड कर पा रहा हूं 😐🤞`, threadID, messageID);
            else if (approvalMode && !adminIDs.some(item => item.id == api.getCurrentUserID())) return api.sendMessage(`यूजर को एड कर दिया है उसको अप्रूवल दे दो 😐🤞`, threadID, messageID);
            else return api.sendMessage(`कर दिया एड यूजर को 😐🤞`, threadID, messageID);
        });
    } else {
        var uidUser = args[0];
        api.addUserToGroup(uidUser, threadID, (err) => {
            if (participantIDs.includes(uidUser)) return api.sendMessage(`ये यूजर पहले से एड है ग्रुप में 😐🤞`, threadID, messageID);
            if (err) return api.sendMessage(`सॉरी इसको ग्रुप में नही एड कर पा रहा हूं 😐🤞`, threadID, messageID);
            else if (approvalMode && !adminIDs.some(item => item.id == api.getCurrentUserID())) return api.sendMessage(`यूजर को एड कर दिया है उसको अप्रूवल दे दो 😐🤞`, threadID, messageID);
            else return api.sendMessage(`कर दिया एड यूजर को 😐🤞`, threadID, messageID);
        });
    }
}
