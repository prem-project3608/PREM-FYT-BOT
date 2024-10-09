//@Prem-babu3608
////////////////////////////////////////////////////////
/////// WARNING => JO CREDIT NAME CHANGE KREGA USKA ID BAN KAR DIYA JAYEGA + THIS BOT IS MADE BT PREM BABU
const fs = global.nodemodule["fs-extra"];
module.exports.config = {
  name: "PREM-BOT-1",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "PREM BABU",
  description: "THIS BOT WAS MADE BY MR PREM BABU",
  commandCategory: "NO PREFIX",
  usages: "BOT-OR-TAKLU",
  cooldowns: 5,
}

module.exports.handleEvent = async function({ api, event, args, Threads, Users }) {
  var { threadID, messageID } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Kolkata").format("HH:MM:ss");
  var idgr = `${event.threadID}`;
  var id = event.senderID;
  var name = await Users.getNameUser(event.senderID);

  var tl = ["हाय मैं सदके जावा तेरी इस मासूम सकल पे बेबी 💋🙈 " , "बोट ना बोल ओय प्रेम जानू बोल मुझे 😌🙈😘 " , "बार बार परेशान ना कर अपने बाबू के साथ बीजी हूं। 😒🤟"];
  
  // Owner के लिए सेट किए गए संदेश
  var ownerIt = ["जी प्रेम बाबू बोलिए","जी बॉस बोलिए किया हुआ","आ गया मैं बॉस बताए किया हुआ है","जी बॉस 🙂","हुकम कीजिए बॉस 😐"];
  
  // Female यूजर के लिए सेट किए गए संदेश
  var femaleIt = ["जी मैम, कैसे हैं आप? 😊","आपकी याद आ रही थी! 😌","बोट को कोई बात है, बताएं! 😇"];

  var rand = tl[Math.floor(Math.random() * tl.length)];

  // अगर कोई खाली संदेश भेजता है
  if (event.body.toLowerCase() === "🙈") {
    return api.sendMessage("🫣🫣🫣🫣🫣", threadID);
  }

  // Owner के Facebook UID की सूची
  var ownerUIDs = ["100070531069371", "YOUR_OWNER_UID_2", "YOUR_OWNER_UID_3"]; // यहाँ अपने मालिक के UID डालें

  // Female यूजर के Facebook UID की सूची
  var femaleUIDs = ["YOUR_FEMALE_UID_1", "YOUR_FEMALE_UID_2"]; // यहाँ female UID डालें

  // सभी उपयोगकर्ताओं के लिए सामान्य उत्तर
  if (event.body.includes("Bot") || event.body.includes("BOT") || event.body.includes("bot") || event.body.includes("taklu") || event.body.includes("takl") || event.body.includes("Takl") || event.body.includes("TAKLU") || event.body.includes("Taklu")) {
    if (ownerUIDs.includes(event.senderID)) {
      // Owner के लिए विशेष संदेश भेजें
      var msg = {
        body: `${ownerIt[Math.floor(Math.random() * ownerIt.length)]}`
      }
      return api.sendMessage(msg, threadID, messageID);
    } else if (femaleUIDs.includes(event.senderID)) {
      // Female यूजर के लिए विशेष संदेश भेजें
      var msg = {
        body: `${femaleIt[Math.floor(Math.random() * femaleIt.length)]}`
      }
      return api.sendMessage(msg, threadID, messageID);
    } else {
      // अन्य उपयोगकर्ताओं के लिए सामान्य उत्तर
      var msg = {
        body: `${rand}`
      }
      return api.sendMessage(msg, threadID, messageID);
    }
  }
}

module.exports.run = function({ api, event, client, __GLOBAL }) { }
