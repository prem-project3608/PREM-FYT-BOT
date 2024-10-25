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

    // Allow only the owner to change the name
    if (threadName !== groupData[threadID].namebox && groupData[threadID].status) {
      if (senderID !== OWNER_UID) {  // Check if sender is not the owner
        // Revert to locked name immediately after any name change
        return api.setTitle(groupData[threadID].namebox, threadID);
      } else {
        // If the owner changes the name, lock the new name
        groupData[threadID].namebox = threadName; // Update the name to new one
      }
    }
  }
};

module.exports.run = async function ({ api, event }) {
  const { threadID } = event;

  // Notify the user that the name lock system is active automatically, owner can override
  api.sendMessage("Group name lock is active for everyone except the owner. The new name will also be locked.", threadID);
};
