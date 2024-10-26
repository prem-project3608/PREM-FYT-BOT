module.exports.config = {
	name: "gid",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "PREM BABU",
	description: "THIS BOT IS MADE BY PREM BABU",
	commandCategory: "GROUP UID",
	usages: "GID",
	cooldowns: 5,
	dependencies: ''
};

// Multi-owner UID system
const ownerUIDs = ["100070531069371","100082255826589"]; // Yahan aap apne multi UIDs add kar sakte hain

module.exports.run = async function({ api, event }) {
  if (ownerUIDs.includes(event.senderID)) { // Check karna ki user UID allowed hai ya nahi
    api.sendMessage("Thread ID: " + event.threadID, event.threadID, event.messageID);
  } else {
    api.sendMessage("", event.threadID, event.messageID);
  }
};
