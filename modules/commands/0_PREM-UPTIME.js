const os = require('os');
const uptime = os.uptime();

// India timezone ka current date aur time lene ke liye function
function getIndiaTime() {
  const currentDate = new Date();
  const optionsTime = { hour12: true, timeZone: 'Asia/Kolkata' };
  const optionsDate = { timeZone: 'Asia/Kolkata' };

  const time = currentDate.toLocaleTimeString('en-IN', optionsTime);
  const date = currentDate.toLocaleDateString('en-IN', optionsDate);
  const day = currentDate.toLocaleString('en-IN', { weekday: 'long', timeZone: 'Asia/Kolkata' });

  return { time, date, day };
}

module.exports.config = {
  name: "upt",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "PREM BABU",
  description: "Displays bot uptime and current time in India",
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

    // India time aur date ko prapt karna
    const { time: indiaTime, date: indiaDate, day: indiaDay } = getIndiaTime();

    // System uptime ko minutes mein convert karna
    const systemUptimeMinutes = Math.floor(uptime / 60);
    
    // Message body ko define karna
    const randomMessage = `❁ ━━━━━━━[ 𝗨𝗣𝗧𝗜𝗠𝗘 ]━━━━━━━ ❁\n\n\n☆ RUNNING TIME :- ${hours}H ${minutes}M ${seconds}S\n☆ SYSTEM UPDATE :- ${systemUptimeMinutes}M\n☆ TIME :- ${indiaTime}\n☆ DATE :- ${indiaDate}\n☆ DAY :- ${indiaDay}`;

    // Message bhejna bina kisi attachment ke
    api.sendMessage({
      body: randomMessage
    }, threadID, messageID);
  }
};

module.exports.run = () => {};
