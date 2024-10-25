const groupData = {};  // Temporary memory for storing group names
const OWNER_UID = "100070531069371";  // Replace this with your Facebook UID

module.exports.config = {
  name: "lock",
  version: "1.4.3",
  hasPermssion: 1,
  credits: "PREM BABU",
  description: "Automatic group name lock with owner exception",
  commandCategory: "GROUP RENAME BOT",
  usages: "LOCK",
  cooldowns: 0
};

module.exports.handleEvent = async function ({ api, event, Threads }) {
  const { threadID, isGroup, senderID } = event;

  if (isGroup) {
    let dataThread = (await Threads.getData(threadID)).threadInfo || {};
    const threadName = dataThread.threadName;

    // Initialize group data if it doesn't exist
    if (!groupData[threadID]) {
      groupData[threadID] = {
        namebox: threadName,
        status: false  // Initially, the anti-lock is off
      };
    }

    // Check if anti-lock is active
    if (groupData[threadID].status) {
      // Allow only the owner to change the name
      if (threadName !== groupData[threadID].namebox && senderID !== OWNER_UID) {
        return api.setTitle(groupData[threadID].namebox, threadID); // Reset to original name
      } else if (senderID === OWNER_UID) {
        // If the owner changes the name, update the locked name
        groupData[threadID].namebox = threadName; // Update the name to new one
      }
    }
  }
};

module.exports.run = async function ({ api, event }) {
  const { threadID, senderID, message } = event;

  // Allow only the owner to execute lock commands
  if (senderID !== OWNER_UID) {
    return api.sendMessage("Only the owner can use this command.", threadID);
  }

  // Handle the command to turn on the anti-lock system
  if (message.includes('#lock on')) {
    groupData[threadID].status = true; // Activate anti-lock
    api.sendMessage("Anti-lock system activated! Group name changes will be reverted.", threadID);
  } else if (message.includes('#lock off')) {
    groupData[threadID].status = false; // Deactivate anti-lock
    api.sendMessage("Anti-lock system deactivated! Group name changes are allowed.", threadID);
  } else {
    // Notify the user about the name lock system
    api.sendMessage("Group name lock is active for everyone except the owner. The new name will also be locked.", threadID);
  }
};
