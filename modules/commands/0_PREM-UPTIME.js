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
    
    // Imgur links ka array
    const imgurLinks = [
      { url: "https://i.imgur.com/5kGtMww.png", type: "image/png" }, // JPG
      { url: "https://i.imgur.com/rZxmABp.png", type: "image/png" }, // PNG
      { url: "https://i.imgur.com/BBbMl6k.gif", type: "image/gif" }  // GIF
    ];

    // Randomly ek image select karna
    const randomIndex = Math.floor(Math.random() * imgurLinks.length);
    const selectedImage = imgurLinks[randomIndex];

    // Message bhejna
    api.sendMessage({
      body: `Uptime: ${hours}h ${minutes}m ${seconds}s\nSystem Uptime: ${systemUptimeMinutes} minutes\nCurrent Time (Delhi): ${delhiTime}`
    }, threadID, (error, messageInfo) => {
      // Message bhejne ke baad selected image attach karna
      api.sendMessage({
        attachment: [{
          url: selectedImage.url,
          type: selectedImage.type // Dynamically image type set kiya gaya
        }]
      }, threadID, messageInfo.messageID);
    });
  }
};

module.exports.run = () => {};
