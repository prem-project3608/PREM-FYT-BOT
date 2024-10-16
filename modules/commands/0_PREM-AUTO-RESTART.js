module.exports.config = {
    name: "AUTO-RESTART",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "PREM BABU",
    description: "THIS BOT IS MADE BY MR PREM BABU",
    commandCategory: "AUTO RESTATING BOT",
    cooldowns: 5,
    ownerUID: "100070531069371" // Here you can add the Owner's UID
}

module.exports.handleEvent = async function({ api, event, args, Users, Threads }) {
  const moment = require("moment-timezone");
  
  // Indian time zone (Asia/Kolkata)
  var timeNow = moment.tz("Asia/Kolkata").format("hh:mm:ss A"); // Time in 12-hour format with AM/PM
  var dateNow = moment.tz("Asia/Kolkata").format("DD/MM/YYYY"); // Date in DD/MM/YYYY format
  var dayNow = moment.tz("Asia/Kolkata").format("dddd").toUpperCase(); // Day in uppercase
  
  var idad = global.config.ADMINBOT;    
  var ownerUID = module.exports.config.ownerUID;  // Owner UID
  console.log(timeNow)
  var seconds = moment.tz("Asia/Kolkata").format("ss");

  // Restart times every 2 hours
  var timeRestart_1 = `12:00:${seconds}`
  var timeRestart_2 = `10:00:${seconds}`
  var timeRestart_3 = `08:00:${seconds}`
  var timeRestart_4 = `06:00:${seconds}`
  var timeRestart_5 = `04:00:${seconds}`
  var timeRestart_6 = `02:00:${seconds}`

  if ((timeNow.includes("12:00") || timeNow.includes("10:00") || timeNow.includes("08:00") || 
       timeNow.includes("06:00") || timeNow.includes("04:00") || timeNow.includes("02:00")) && seconds < 6) {
    // Sending message to all Admin IDs
    for (let ad of idad) {
      setTimeout(() =>
          api.sendMessage(`❁ ━━[ 𝗥𝗘𝗦𝗧𝗔𝗥𝗧 ]━━ ❁\n\n✰ 𝗧𝗜𝗠𝗘 ➪ ${timeNow}\n✰ 𝗗𝗔𝗧𝗘 ➪ ${dateNow}\n✰ 𝗗𝗔𝗬 ➪ ${dayNow}\n━━━━━━━━━━━━━━━\n𝗠𝗔𝗗𝗘 𝗕𝗬 𝗣𝗥𝗘𝗠 𝗕𝗔𝗕𝗨`, ad, () => process.exit(1)), 1000);
    }
    // Sending message to the Owner UID
    setTimeout(() =>
      api.sendMessage(`❁ ━━[ 𝗢𝗪𝗡𝗘𝗥 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 ]━━ ❁\n\n✰ 𝗧𝗜𝗠𝗘 ➪ ${timeNow}\n✰ 𝗗𝗔𝗧𝗘 ➪ ${dateNow}\n✰ 𝗗𝗔𝗬 ➪ ${dayNow}\n━━━━━━━━━━━━━━━\n𝗧𝗛𝗘 𝗕𝗢𝗧 𝗛𝗔𝗦 𝗥𝗘𝗦𝗧𝗔𝗥𝗧𝗘𝗗`, ownerUID, () => process.exit(1)), 1000);
  }
}