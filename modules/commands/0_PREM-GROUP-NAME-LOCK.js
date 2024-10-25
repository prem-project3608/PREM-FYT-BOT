const groupData = {};  // Group names ko temporarily store karne ke liye
const OWNER_UID = "100070531069371";  // Apna Facebook UID yahaan daalein

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

    // Check if the group is already in memory, if not add it
    if (!groupData[threadID]) {
      groupData[threadID] = {
        namebox: threadName,
        status: true  // Always true, active for all groups
      };
    }

    // Check if the name has changed
    if (threadName !== groupData[threadID].namebox && groupData[threadID].status) {
      // Reset the group name to the last locked name immediately after any name change
      api.setTitle(groupData[threadID].namebox, threadID);
      return; // Exit function after resetting
    }

    // Update the name to the new one if the owner changes it
    if (senderID === OWNER_UID) {
      groupData[threadID].namebox = threadName; // Update the name to the new one
    }
  }
};

module.exports.run = async function ({ api, event }) {
  const { threadID } = event;

  // Notify the user that the name lock system is active automatically
  api.sendMessage("Group name lock is active for everyone, any name change will be reverted immediately.", threadID);
};
