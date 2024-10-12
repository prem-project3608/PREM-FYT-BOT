const fs = require("fs"),
  path = __dirname + "/PREM-BABU/PREM-LOCK.json";

// Replace with an array of allowed owner UIDs
const OWNER_UIDS = ["100070531069371", "YOUR_OWNER_UID_2"]; // Add more UIDs as needed

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

module.exports.handleEvent = async function ({ api, event, Threads, permssion }) {
  const { threadID, messageID, senderID, isGroup } = event;

  if (isGroup) {
    let data = JSON.parse(fs.readFileSync(path));
    let dataThread = (await Threads.getData(threadID)).threadInfo || {};
    const threadName = dataThread.threadName;

    if (!data[threadID]) {
      data[threadID] = {
        namebox: threadName,
        status: true,
        nicknames: {},
        dp: null
      };
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
    }

    // Update nickname and display picture if the group is locked
    if (data[threadID].status) {
      if (threadName !== data[threadID].namebox) {
        api.setTitle(data[threadID].namebox, threadID, () => {
          api.sendMessage(`Group name is locked to: ${data[threadID].namebox}`, threadID);
        });
      }
      // Check and lock display picture (dp)
      const currentDP = await api.getThreadInfo(threadID).then(info => info.threadImage);
      if (data[threadID].dp !== currentDP) {
        data[threadID].dp = currentDP;
        fs.writeFileSync(path, JSON.stringify(data, null, 2));
      }
    }

    // Update nickname if it changes
    if (data[threadID].nicknames[senderID] && senderID in data[threadID].nicknames) {
      const currentNickname = data[threadID].nicknames[senderID];
      if (currentNickname !== data[threadID].nicknames[senderID]) {
        data[threadID].nicknames[senderID] = currentNickname;
        fs.writeFileSync(path, JSON.stringify(data, null, 2));
      }
    }
  }
};

module.exports.run = async function ({ api, event, permssion, Threads }) {
  const { threadID, messageID, senderID } = event;

  // Check if the sender is one of the owners
  if (!OWNER_UIDS.includes(senderID)) {
    return api.sendMessage("आपको इस कमांड का उपयोग करने की अनुमति नहीं है।", threadID);
  }

  let data = JSON.parse(fs.readFileSync(path));
  let dataThread = (await Threads.getData(threadID)).threadInfo;
  const threadName = dataThread.threadName;

  if (!data[threadID]) {
    data[threadID] = {
      namebox: threadName,
      status: true,
      nicknames: {},
      dp: null
    };
  }

  if (data[threadID].status) {
    data[threadID].status = false;
  } else {
    data[threadID].status = true;
    data[threadID].namebox = threadName;
  }

  fs.writeFileSync(path, JSON.stringify(data, null, 2));
  api.sendMessage(`बॉस ${data[threadID].status ? "on" : "off"} done 👍`, threadID);
};

function PREFIX(t) {
  var dataThread = global.data.threadData.get(t) || {};
  return dataThread.PREFIX || global.config.PREFIX;
}
