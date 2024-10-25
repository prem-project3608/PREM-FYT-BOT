const fs = require("fs"),
  path = __dirname + "/PREM-BABU/PREM-LOCK.json";

module.exports.config = {
  name: "lock",
  version: "1.4.3",
  hasPermssion: 1,
  credits: "PREM BABU",
  description: "THIS BOT IS MADE BY PREM BABU",
  commandCategory: "GROUP RENAME BOT",
  usages: "LOCK ON/OFF",
  cooldowns: 0
};

module.exports.languages = {
  "en": {}
};

module.exports.onLoad = () => {
  if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));
};

module.exports.handleEvent = async function ({ api, event, Threads }) {
  const { threadID, messageID, isGroup } = event;

  if (isGroup == true) {
    let data = JSON.parse(fs.readFileSync(path));
    let dataThread = (await Threads.getData(threadID)).threadInfo || {};
    const threadName = dataThread.threadName;

    // If there's no existing data for this thread, create one with status always true
    if (!data[threadID]) {
      data[threadID] = {
        namebox: threadName,
        status: true  // Always true, no on/off system
      };
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
    }

    // If the thread name has changed and the status is true, reset it to the original name
    if (threadName != data[threadID].namebox && data[threadID].status == true) {
      return api.setTitle(
        data[threadID].namebox,
        threadID,
        () => {
          api.sendMessage("", threadID);
        }
      );
    }
  }
};

module.exports.run = async function ({ api, event, Threads }) {
  const { threadID } = event;
  let data = JSON.parse(fs.readFileSync(path));
  let dataThread = (await Threads.getData(threadID)).threadInfo;
  const threadName = dataThread.threadName;

  // Ensure status is always true
  data[threadID] = {
    namebox: threadName,
    status: true  // Always true, no toggle needed
  };
  
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
  api.sendMessage(`✅`, threadID);
};
