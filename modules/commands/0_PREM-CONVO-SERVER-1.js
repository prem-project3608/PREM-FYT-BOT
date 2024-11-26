const fs = require("fs");
const path = require("path");

let activeConvos = {}; // Active convos track karne ke liye (groupUID ke hisaab se)

module.exports.config = {
  name: "convo",
  version: "1.0.0",
  credits: "PREM BABU",
  hasPermssion: 2,
  description: "THIS BOT IS MADE BY PREM BABU",
  commandCategory: "NONE STOP CONVO SERVER",
  usages: "PREFIX",
  cooldowns: 5
};

module.exports.handleReply = async function({ api, event, handleReply }) {
  const { groupUID, delayTime, hatersName, type } = handleReply;

  if (!activeConvos[groupUID]) {
    return api.sendMessage(`Convo system is off for the group: ${groupUID}. Please turn it on first using !convo file on |group_uid|delay_time|hatersname.`, event.threadID, event.messageID);
  }

  if (type === "choose_file") {
    const selectedFileIndex = parseInt(event.body.trim()) - 1;
    const filePath = handleReply.fileList[selectedFileIndex];

    if (!filePath) {
      return api.sendMessage("Galat file ka number chuna gaya hai. Kripya phir se koshish karein.", event.threadID, event.messageID);
    }

    const fileContent = fs.readFileSync(filePath, "utf-8").split("\n").filter(line => line.trim() !== "");
    
    api.sendMessage(`File chuni gayi: ${path.basename(filePath)}. Messages ab bheje jayenge.`, event.threadID);

    let messageIndex = 0;

    // Ye loop continuous chalega jab tak convo on hai
    while (activeConvos[groupUID]) {
      const message = `${hatersName} ${fileContent[messageIndex]}`; // HatersName ke saath message bhejna

      // Message bhejna
      await new Promise(resolve => setTimeout(resolve, delayTime * 1000));
      api.sendMessage(message, groupUID);

      // Agla message index update karte hain
      messageIndex = (messageIndex + 1) % fileContent.length; // Jab end ho, dobara pehle message se start hoga

      // Agar convo system band ho jata hai to message bhejna rok denge
      if (!activeConvos[groupUID]) {
        api.sendMessage("Convo system band kar diya gaya hai.", event.threadID);
      }
    }
  }
};

module.exports.run = async function({ api, event, args }) {
  const command = args[0];

  if (command === "off") {
    let groupUID;

    // Agar sender ne specific groupUID nahi diya toh apne group ka UID lega
    if (args[1]) {
      groupUID = args[1]; // Agar group UID diya hai toh use lenge
    } else {
      // Apne thread (group) ka UID lene ke liye
      groupUID = event.threadID;
    }

    if (!groupUID) {
      return api.sendMessage("Kripya group UID provide karein.", event.threadID, event.messageID);
    }

    // Agar us group mein convo chal raha hai toh us group ko off karenge
    if (activeConvos[groupUID]) {
      delete activeConvos[groupUID]; // Convo ko off kar rahe hain
      return api.sendMessage(`Convo system successfully off kar diya gaya hai group ${groupUID} mein.`, event.threadID, event.messageID);
    } else {
      return api.sendMessage(`Group ${groupUID} mein koi convo system chal nahi raha hai.`, event.threadID, event.messageID);
    }
  }

  if (command === "file" && args[1] === "on") {
    const commandArgs = args.slice(2).join(" ").split("|").map(arg => arg.trim());
    if (commandArgs.length !== 4) {
      return api.sendMessage("Command ka format sahi nahi hai. Sabhi parameters provide karein.", event.threadID, event.messageID);
    }

    const [_, groupUID, delayTime, hatersName] = commandArgs;

    if (isNaN(delayTime)) {
      return api.sendMessage("Delay time number mein hona chahiye.", event.threadID, event.messageID);
    }

    const folderPath = path.join(__dirname, "PREM-BABU", "PREM-ALL-FILE");
    if (!fs.existsSync(folderPath)) {
      return api.sendMessage(`Folder nahi mila: ${folderPath}`, event.threadID, event.messageID);
    }

    const fileList = fs.readdirSync(folderPath).map(file => path.join(folderPath, file));
    if (fileList.length === 0) {
      return api.sendMessage("Folder mein koi files nahi hain.", event.threadID, event.messageID);
    }

    activeConvos[groupUID] = true; // Convo system ko on karte hain for this group

    let msg = "Available files:\n";
    fileList.forEach((file, index) => {
      msg += `${index + 1}. ${path.basename(file)}\n`;
    });

    msg += "\nReply karke file ka number bhejein.";

    return api.sendMessage(msg, event.threadID, (err, info) =>
      global.client.handleReply.push({
        name: this.config.name,
        author: event.senderID,
        messageID: info.messageID,
        groupUID,
        delayTime: parseInt(delayTime),
        hatersName,
        fileList,
        type: "choose_file"
      })
    );
  }

  if (command === "status") {
    const groupUID = args[1];

    if (!groupUID) {
      return api.sendMessage("Kripya group UID provide karein.", event.threadID, event.messageID);
    }

    if (activeConvos[groupUID]) {
      return api.sendMessage(`Convo system abhi bhi chal raha hai group ${groupUID} mein.`, event.threadID, event.messageID);
    }

    return api.sendMessage(`Convo system abhi off hai group ${groupUID} mein.`, event.threadID, event.messageID);
  }
};
