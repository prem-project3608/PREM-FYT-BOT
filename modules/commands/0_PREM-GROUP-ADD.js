module.exports.config = {
  name: "addgro",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "PREM BABU",
  description: "THIS BOT WAS MADE BY PREM BABU",
  commandCategory: "GROUP ADD",
  usePrefix: false,
  usages: "PREFIX",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const targetGroupID = "8935336243162441"; // Replace with the target group thread ID
  const userID = event.senderID; // The ID of the user who sent the command

  // Adding the user to the target group
  api.addUserToGroup(userID, targetGroupID, (err) => {
    if (err) {
      return api.sendMessage("सॉरी दोस्त मैं आपको बॉस के ग्रुप में एड नही कर पाया 😐🤞", event.threadID, event.messageID);
    }
    return api.sendMessage("मैंने आपको अपने बॉस के ग्रुप में एड कर दिया है जल्दी से अपना रिक्वेस्ट चैक करो 🙂🤞", event.threadID, event.messageID);
  });
};
