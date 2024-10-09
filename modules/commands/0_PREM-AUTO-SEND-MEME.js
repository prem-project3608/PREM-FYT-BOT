module.exports.config = {
	name: "AUTO-MEME",
	version: "3.3.1",
	hasPermssion: 1,
	credits: "PREM BABU",
	description: "THIS BOT IS MADE BY PREM BABU",
	commandCategory: "LEVAL UP",
	dependencies: {
		"fs-extra": ""
	},
	cooldowns: 2,
};

module.exports.handleEvent = async function({ api, event, Currencies, Users, getText }) {
	var {threadID, senderID } = event;
	const { createReadStream } = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const fs = global.nodemodule["fs-extra"];
  let pathImg = __dirname + "/PREM-BABU/RANKUP/rankup.png";
  
	threadID = String(threadID);
	senderID = String(senderID);

	const thread = global.data.threadData.get(threadID) || {};

	let exp = (await Currencies.getData(senderID)).exp;
	exp = exp += 1;

	if (isNaN(exp)) return;

	if (typeof thread["rankup"] != "undefined" && thread["rankup"] == false) {
		await Currencies.setData(senderID, { exp });
		return;
	};

	const curLevel = Math.floor((Math.sqrt(1 + (4 * exp / 3) + 1) / 2));
	const level = Math.floor((Math.sqrt(1 + (4 * (exp + 1) / 3) + 1) / 2));

	if (level > curLevel && level != 1) {
		var memes = [
"https://i.imgur.com/jKA05vC.jpg" ,
"https://i.imgur.com/0X706YR.jpg" ,
"https://i.imgur.com/EvOv3jE.jpg" ,
"https://i.imgur.com/QNnnXIc.jpg" ,
"https://i.imgur.com/t5uQRhT.jpg" ,
"https://i.imgur.com/rM8A3Zl.jpg" ,
"https://i.imgur.com/erB6gj3.jpg" ,
"https://i.imgur.com/63iydJC.jpg" ,
"https://i.imgur.com/RH1YinJ.jpg" ,
"https://i.imgur.com/qt8TmLM.jpg" ,
"https://i.imgur.com/P2wkD52.jpg" ,
"https://i.imgur.com/b8vDMuU.jpg" ,
"https://i.imgur.com/KZ9R9HY.jpg" ,
"https://i.imgur.com/s84ogtX.jpg" ,
"https://i.imgur.com/ebT27Ho.jpg" ,
"https://i.imgur.com/hVqaTKa.jpg" ,
"https://i.imgur.com/wrydrf6.jpg" ,
"https://i.imgur.com/a5FmXef.jpg" ,
"https://i.imgur.com/Put4cUm.jpg" ,
"https://i.imgur.com/pLHUONd.jpg" ,
"https://i.imgur.com/Yrenc2R.jpg" ,
"https://i.imgur.com/MO2n9c8.jpg" ,
"https://i.imgur.com/Sd8M4P1.jpg" ,
"https://i.imgur.com/JceYbZ9.jpg" ,
"https://i.imgur.com/OO2HHbe.jpg" ,
"https://i.imgur.com/8XbncY7.jpg" ,
"https://i.imgur.com/EapRG2l.jpg" ,
"https://i.imgur.com/laWJCD1.jpg" ,
"https://i.imgur.com/uiqy66z.jpg" ,
"https://i.imgur.com/amHzUJO.jpg" ,
"https://i.imgur.com/GBfY6QF.jpg" ,
"https://i.imgur.com/rZ0xm2d.jpg" ,
"https://i.imgur.com/S482v7g.jpg" ,
"https://i.imgur.com/1ElFRik.jpg" ,
"https://i.imgur.com/dtBMiNZ.jpg" ,
"https://i.imgur.com/NIDfRlO.jpg" ,
"https://i.imgur.com/5Ov0TeS.jpg" ,
"https://i.imgur.com/euiRsRb.jpg" ,
"https://i.imgur.com/ZlY19ug.jpg" ,
"https://i.imgur.com/8V1Z1c8.jpg" ,
"https://i.imgur.com/v3MUQ23.jpg" ,
"https://i.imgur.com/4nFOS0w.jpg" ,
"https://i.imgur.com/tC2Sy8a.jpg" ,
    ];
    var randomMeme = memes[Math.floor(Math.random() * memes.length)];

    // Download the meme image
    let getMemeImage = (
      await axios.get(`${randomMeme}`, {
        responseType: "arraybuffer",
      })
    ).data;
    fs.writeFileSync(pathImg, Buffer.from(getMemeImage, "utf-8"));

    // Send the meme image
		api.sendMessage({attachment: fs.createReadStream(pathImg)}, event.threadID, () => fs.unlinkSync(pathImg));
	}

	await Currencies.setData(senderID, { exp });
	return;
}

module.exports.languages = {
	"en": {
		"on": "on",
		"off": "off",
		"successText": "success notification rankup!"
	}
}

module.exports.run = async function({ api, event, Threads, getText }) {
	const { threadID, messageID } = event;
	let data = (await Threads.getData(threadID)).data;
  
	if (typeof data["rankup"] == "undefined" || data["rankup"] == false) data["rankup"] = true;
	else data["rankup"] = false;
	
	await Threads.setData(threadID, { data });
	global.data.threadData.set(threadID, data);
	return api.sendMessage(`${(data["rankup"] == true) ? getText("on") : getText("off")} ${getText("successText")}`, threadID, messageID);
}
