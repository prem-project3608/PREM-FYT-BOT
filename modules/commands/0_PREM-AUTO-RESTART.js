module.exports.config = {
    name: "AUTO-RESTART",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "PREM BABU",
    description: "THIS BOT IS MADE BY MR PREM BABU",
    commandCategory: "AUTO RESTATING BOT",
    cooldowns: 5
}

module.exports.handleEvent = async function({ api, event, args, Users, Threads }) {
  const moment = require("moment-timezone");
  
  // Indian time zone (Asia/Kolkata)
  var timeNow = moment.tz("Asia/Kolkata").format("hh:mm:ss A"); // Time in 12-hour format with AM/PM
  var dateNow = moment.tz("Asia/Kolkata").format("DD/MM/YYYY"); // Date in DD/MM/YYYY format
  var dayNow = moment.tz("Asia/Kolkata").format("dddd").toUpperCase(); // Day in uppercase
  
  var idad = global.config.ADMINBOT;    
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
    for (let ad of idad) {
      setTimeout(() =>
          api.sendMessage(`⚡️Now it's: ${timeNow}\nDate: ${dateNow}\nDay: ${dayNow}\nBaby will restart!!!`, ad, () => process.exit(1)), 1000);
    }
  }
}

// Removed the run function to prevent duplicate messages
