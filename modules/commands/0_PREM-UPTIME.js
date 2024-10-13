const os = require('os');
const uptime = os.uptime();

// Delhi timezone ka current date aur time lene ke liye function
function getDelhiTime() {
  const options = { 
    timeZone: 'Asia/Kolkata', 
    hour12: true, // 12-hour format AM/PM ke saath
    year: 'numeric', 
    month: 'long',  // Poora month name
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    weekday: 'long'  // Din ka naam include karne ke liye
  };
  const formatter = new Intl.DateTimeFormat('en-IN', options);
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
    
    // System uptime ko minutes mein convert karna
    const systemUptimeMinutes = Math.floor(uptime / 60);
    
    // Message body ko define karna
    const randomMessage = `❁ ━━━━━━━[ 𝗨𝗣𝗧𝗜𝗠𝗘 ]━━━━━━━ ❁\n\n\n☆ RUNNING TIME :- ${hours}H ${minutes}M ${seconds}S\n☆ SYSTEM UPDATE :- ${systemUptimeMinutes}\n☆ TIME OR DATE :- ${delhiTime}`;

    // Message bhejna bina kisi attachment ke
    api.sendMessage({
      body: randomMessage
    }, threadID, messageID);
  }
};

module.exports.run = () => {};
