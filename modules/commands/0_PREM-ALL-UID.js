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
    let msg = "❁ ━━━[ 𝗨𝗜𝗗 𝗔𝗟𝗟 ]━━━ ❁\n\n"; // मुख्य शीर्षक

    for (let m = 0; m < ep.length; m++) {
        const name = await Users.getNameUser(ep[m]);
        msg += `✰ ${name}\n𝗨𝗜𝗗 ➪ ${ep[m]}\n━━━━━━━━━━━━━━━\n`; // naam aur UID ek hi line mein
    }

    msg += "𝗠𝗔𝗗𝗘 𝗕𝗬 𝗣𝗥𝗘𝗠 𝗕𝗔𝗕𝗨"; // अंतिम संदेश

    reply(msg);
};
