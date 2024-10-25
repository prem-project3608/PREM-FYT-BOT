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

    // Check if the group is already in memory, if not add it
    if (!groupData[threadID]) {
      groupData[threadID] = {
        namebox: threadName,
        status: true  // Always true, active for all groups
      };
    }

    // Allow only the owner to change the name
    if (threadName != groupData[threadID].namebox && groupData[threadID].status) {
      if (senderID !== OWNER_UID) {  // Check if sender is not the owner
        return api.setTitle(groupData[threadID].namebox, threadID);
      }
    }
  }
};

module.exports.run = async function ({ api, event }) {
  const { threadID } = event;

  // Notify the user that the name lock system is active automatically, owner can override
  api.sendMessage("Group name lock is active for everyone except the owner.", threadID);
};
