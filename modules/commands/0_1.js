module.exports.config = {
    name: "uidall",
    version: "1.0.5",
    hasPermssion: 0,
    credits: "PREM BABU",
    description: "THIS BOT WAS MADE BY PREM BABU",
    commandCategory: "ALL UID",
    cooldowns: 2,
};

module.exports.run = async function ({ api, event, args, Users }) {
  
    function reply(d) {
        api.sendMessage(d, event.threadID, event.messageID);
    }
  
    var ep = event.participantIDs;
    let msg = "List of all members' UID in this group:\n\n"; // मुख्य शीर्षक

    for (let m = 0; m < ep.length; m++) {
        const name = await Users.getNameUser(ep[m]);
        msg += `${m + 1}. ${name} [ ${ep[m]} ]\n____________________________\n`; // नया फॉर्मेट
    }

    reply(msg);
};
