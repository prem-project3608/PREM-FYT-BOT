const fetch = require('node-fetch');
const os = require('os');
const maxCpu = os.cpus().length;
const maxRam = os.totalmem();
const maxRamInGB = (maxRam / 1024 / 1024 / 1024 / 30).toFixed(2);
const fs = require('fs');
const language = process.env.REPL_LANGUAGE;
const platform = os.platform();
const architecture = os.arch();
const cpuModel = os.cpus()[0].model;
const uptime = os.uptime();
const nodejs = process.version;
global.client.timeStart = new Date().getTime(),

module.exports.config = {
  name: "upt",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "R1zaX",
  description: "no prefix",
  commandCategory: "Không cần dấu lệnh",
  usages: "xem thời gian bot onl",
    cooldowns: 5
};

function byte2mb(bytes) {
	const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	let l = 0, n = parseInt(bytes, 10) || 0;
	while (n >= 1024 && ++l) n = n / 1024;
	return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
}

module.exports.handleEvent = async ({ api, event, Threads }) => {
const xuly = Math.floor((Date.now() - global.client.timeStart)/4444)
var trinhtrang = xuly < 10 ? " 𝗧𝗼̂́𝘁 ✔️":
  xuly > 10 && xuly < 100 ? "Ổn Định" : "Chậm";
const pidusage = await global.nodemodule["pidusage"](process.pid);
  if (!event.body) return;
  var { threadID, messageID } = event;
  const threadname = global.data.threadInfo.get(event.threadID).threadName || ((await Threads.getData(event.threadID)).threadInfo).threadName;
  if (event.body.toLowerCase().indexOf("upt") == 0) {
    const dateNow = Date.now();
   const time = process.uptime(),
	      gio = Math.floor(time / (60 * 60)),
	      phut = Math.floor((time % (60 * 60)) / 60),
	    	giay = Math.floor(time % 60);
  const { commands } = global.client;
  const { exec } = require('child_process');
exec('du -sh', (error, stdout, stderr) => {
  if (error) {
    api.sendMessage(`Đã xảy ra lỗi: ${error.message}`, event.threadID, event.messageID);
    return;
  }
  if (stderr) {
    api.sendMessage(`Lỗi STDERR: ${stderr}`, event.threadID, event.messageID);
    return;
  }
  
  const storageUsed = stdout.trim();
  const [size, path] = storageUsed.split('\t');

    api.sendMessage({body:`━━━━[ 𝗨𝗣𝗧𝗜𝗠𝗘 ]━━━━\n\n            ${gio} : ${phut} : ${giay}\n\n 𝗡𝗴𝗼̂𝗻 𝗻𝗴𝘂̛̃: ${language}\n 𝗛𝗲̣̂ 𝗱𝗶𝗲̂̀𝘂 𝗵𝗮̀𝗻𝗵: ${platform} ${architecture}\n 𝗩-𝗡𝗼𝗱𝗲𝗝𝘀: ${nodejs}\n 𝗠𝗼𝗱𝗲𝗹 𝗖𝗣𝗨: ${cpuModel}\n 𝗠𝗲𝗺𝗼𝗿𝘆: ${size}B\n 𝗖𝗣𝗨: ${pidusage.cpu.toFixed(1)} % / ${maxCpu} 𝗖𝗣𝗨s\n 𝗥𝗔𝗠: ${byte2mb(pidusage.memory)} / ${maxRamInGB} GB\n 𝗣𝗶𝗻𝗴: ${Date.now() - dateNow} ms\n 𝗧𝗶̀𝗻𝗵 𝗧𝗿𝗮̣𝗻𝗴: ${trinhtrang}\n 𝗨𝗽𝘁𝗶𝗺𝗲 𝘀𝘆𝘀𝘁𝗲𝗺: ${uptime} giây`},event.threadID, event.messageID);
      });
   }
};

module.exports.run = () => {};
