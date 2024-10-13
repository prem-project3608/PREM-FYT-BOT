const os = require('os');
const uptime = os.uptime();

module.exports.config = {
  name: "upt",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "PREM BABU",
  description: "Displays bot uptime",
  commandCategory: "BOT RUNNING UPTIME",
  usages: "NO PREFIX",
  cooldowns: 5
};

module.exports.handleEvent = async ({ api, event }) => {
  if (!event.body) return;
  var { threadID, messageID } = event;
  if (event.body.toLowerCase().indexOf("upt") == 0) {
    const time = process.uptime(),
          hours = Math.floor(time / (60 * 60)),
          minutes = Math.floor((time % (60 * 60)) / 60),
          seconds = Math.floor(time % 60);

    api.sendMessage({body:`Uptime: ${hours}h ${minutes}m ${seconds}s\nSystem Uptime: ${uptime} seconds`}, threadID, messageID);
  }
};

module.exports.run = () => {};
