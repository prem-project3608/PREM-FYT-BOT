const os = require('os');
const sharp = require('sharp'); // sharp पैकेज इंपोर्ट करें
const fs = require('fs'); // फाइल सिस्टम के लिए
const axios = require('axios'); // HTTP अनुरोधों के लिए

const uptime = os.uptime();

// India timezone ka current date aur time lene ke liye function
function getIndiaTime() {
  const currentDate = new Date();
  const optionsTime = { hour12: true, timeZone: 'Asia/Kolkata' };
  const optionsDate = { timeZone: 'Asia/Kolkata' };

  let time = currentDate.toLocaleTimeString('en-IN', optionsTime);
  const date = currentDate.toLocaleDateString('en-IN', optionsDate);
  const day = currentDate.toLocaleString('en-IN', { weekday: 'long', timeZone: 'Asia/Kolkata' }).toUpperCase(); // Capital letters mein convert kiya

  // AM/PM ko capital letters mein convert karna
  time = time.replace('am', 'AM').replace('pm', 'PM');

  return { time, date, day };
}

module.exports.config = {
  name: "BOT-UPTIME", 
  version: "1.0.1",
  hasPermssion: 0,
  credits: "PREM BABU",
  description: "THIS BOT IS MADE BY MR PREM BABU",
  commandCategory: "BOT RUNNING UPTIME",
  usages: "NO PREFIX",
  cooldowns: 5
};

module.exports.handleEvent = async ({ api, event }) => {
  if (!event.body) return;
  var { threadID, messageID } = event;

  if (event.body.toLowerCase().indexOf("time") == 0) {
    const time = process.uptime(),
          hours = Math.floor(time / (60 * 60)),
          minutes = Math.floor((time % (60 * 60)) / 60),
          seconds = Math.floor(time % 60);

    // India time aur date ko prapt karna
    const { time: indiaTime, date: indiaDate, day: indiaDay } = getIndiaTime();

    // System uptime ko minutes mein convert karna
    const systemUptimeMinutes = Math.floor(uptime / 60);
    
    // Message body ko define karna
    const randomMessage = `❁ ━━━[ 𝗨𝗣𝗧𝗜𝗠𝗘 ]━━━ ❁\n\n\n✰ 𝗥𝗨𝗡 ➪ ${hours}ʜ ${minutes}ᴍ ${seconds}ꜱ\n✰ 𝗧𝗜𝗠𝗘 ➪ ${indiaTime}\n✰ 𝗗𝗔𝗧𝗘 ➪ ${indiaDate}\n✰ 𝗗𝗔𝗬 ➪ ${indiaDay}\n━━━━━━━━━━━━━━━\n𝗠𝗔𝗗𝗘 𝗕𝗬 𝗣𝗥𝗘𝗠 𝗕𝗔𝗕𝗨`;

    // Imgur image URL
    const imageUrl = "https://i.imgur.com/NyM1MnV.gif"; // यहाँ अपनी Imgur इमेज का URL डालें
    const outputImagePath = 'output_image.gif'; // रिसाइज़ की गई इमेज का पथ

    // इमेज को डाउनलोड करना
    const response = await axios({
      url: imageUrl,
      responseType: 'arraybuffer',
    });

    // इमेज को रिसाइज़ करना और फाइल में सेव करना
    const { width, height } = await sharp(Buffer.from(response.data)).metadata();

    // Message की लंबाई के आधार पर इमेज का नया साइज सेट करें
    const messageWidth = Math.min(800, width); // अधिकतम 800 पिक्सल की चौड़ाई
    const messageHeight = Math.round((height * messageWidth) / width); // अनुपात बनाए रखने के लिए ऊँचाई

    await sharp(Buffer.from(response.data))
      .resize(messageWidth, messageHeight, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .toFile(outputImagePath);

    // Message bhejna bina kisi attachment ke
    api.sendMessage({
      body: randomMessage,
      attachment: fs.createReadStream(outputImagePath) // रिसाइज़ की गई इमेज को अटैच करें
    }, threadID, messageID, () => {
      // इमेज फाइल भेजने के बाद उसे डिलीट करना (क्लीनअप)
      fs.unlinkSync(outputImagePath); // फाइल को डिलीट करें
    });
  }
};

module.exports.run = () => {};
