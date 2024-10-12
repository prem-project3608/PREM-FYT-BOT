const fs = require("fs"),
  path = __dirname + "/PREM-BABU/PREM-LOCK.json";

// अनुमत UID का एरे
const allowedUIDs = ["100070531069371", "UID2", "UID3"]; // यहां अपने UID डालें

module.exports.config = {
  name: "lock",
  version: "1.4.3",
  hasPermssion: 1,
  credits: "PREM BABU",
  description: "THIS BOT IS MADE BY PREM BABU",
  commandCategory: "GROUP RENAME BOT",
  usages: "LOCK ON/OFF <GROUP NAME>",
  cooldowns: 0
};

module.exports.languages = {
  "en": {}
};

module.exports.onLoad = () => {
  if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));
};

module.exports.handleEvent = async function ({ api, event, Threads }) {
  const { threadID, senderID, isGroup } = event;

  if (isGroup) {
    let data = JSON.parse(fs.readFileSync(path));
    let dataThread = (await Threads.getData(threadID)).threadInfo || {};
    const threadName = dataThread.threadName;

    if (!data[threadID]) {
      data[threadID] = {
        namebox: threadName,
        status: true
      };
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
    }

    // Reset the group name if it has been changed or deleted
    if (data[threadID].status === true && threadName !== data[threadID].namebox) {
      api.setTitle(data[threadID].namebox, threadID);
    }
  }
};

module.exports.run = async function ({ api, event, permssion, Threads }) {
  const { threadID, messageID, body, senderID } = event;

  // केवल अनुमत UID के लिए अनुमति दें
  if (!allowedUIDs.includes(senderID)) {
    return api.sendMessage("आपको इस कमांड का उपयोग करने की अनुमति नहीं है।", threadID);
  }

  let data = JSON.parse(fs.readFileSync(path));
  let dataThread = (await Threads.getData(threadID)).threadInfo;
  const threadName = dataThread.threadName;

  const args = body.split(" ");
  const command = args[0]; // '#lock'
  const action = args[1]; // 'on' or 'off'
  const groupName = args.slice(2).join(" "); // 'MASTI GROUP'

  if (action === 'on' && groupName) {
    data[threadID] = {
      namebox: groupName,
      status: true
    };
    api.setTitle(groupName, threadID);
    api.sendMessage(`Group locked with name: ${groupName}`, threadID);
  } else if (action === 'off') {
    data[threadID].status = false;
    api.sendMessage(`Group lock turned off.`, threadID);
  } else {
    api.sendMessage("Invalid command. Use #lock on <GROUP NAME> or #lock off.", threadID);
  }

  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

function PREFIX(t) {
  var dataThread = global.data.threadData.get(t) || {};
  return dataThread.PREFIX || global.config.PREFIX;
}
