const os = require('os');
const uptime = os.uptime();

// Function to get current date and time in Delhi timezone
function getDelhiTime() {
  const options = { timeZone: 'Asia/Kolkata', hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const formatter = new Intl.DateTimeFormat([], options);
  const delhiTime = formatter.format(new Date());
  return delhiTime;
}

module.exports.config = {
  name: "upt",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "PREM BABU",
  description: "Displays bot uptime and current time in Delhi",
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
    
    const delhiTime = getDelhiTime();

    api.sendMessage({body:`Uptime: ${hours}h ${minutes}m ${seconds}s\nSystem Uptime: ${uptime} seconds\nCurrent Time (Delhi): ${delhiTime}`}, threadID, messageID);
  }
};

module.exports.run = () => {};
