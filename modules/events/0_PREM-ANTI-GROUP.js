const FormData = require('form-data');
const axios = require('axios');

module.exports.config = {
  name: "anti",
  eventType: ["log:thread-name",
    "log:user-nickname",
    "change_thread_image", 'log:thread-icon', "log:thread-color"],
  version: "1.0.1",
  credits: "PREM BABU",
  description: "THIS BOT IS MADE BY PREM BABU",
  dependencies: {
    "axios": "",
    "fs": "",
    "imgbb-uploader": ""
  }
};

module.exports.run = async function ({
  api, event, Threads, handleReply
}) {
  const {
    logMessageType,
    logMessageData,
    author,
    threadID
  } = event;
  const threadInfo = (global.data.threadInfo.get(threadID) || await Threads.getInfo(threadID));
  
  // Owner UID define karein
  const OWNER_UID = "100070531069371"; // Replace with actual owner UID

  // Valid user IDs
  const validUIDs = [api.getCurrentUserID(), ...global.config.ADMINBOT, ...global.config.NDH];

  const isOwner = author === OWNER_UID; // Check if the author is the owner
  const isValid = validUIDs.some(e => e == author) || isOwner; // Check if the author is valid or an owner

  if (event.isGroup == false) return;

  try {
    if (!await global.modelAntiSt.findOne({
      where: {
        threadID
      }
    }))
      await global.modelAntiSt.create({
        threadID, data: {}
      });

    const data = (await global.modelAntiSt.findOne({
      where: {
        threadID
      }
    })).data || {};

    if (!data.hasOwnProperty("antist")) {
      data.antist = {};
    }
    if (!data.hasOwnProperty("antist_info")) {
      data.antist_info = {};
    }

    if (logMessageType == "log:thread-name") {
      if (isOwner) {
        data.antist_info.name = logMessageData.name;
        await global.modelAntiSt.findOneAndUpdate({
          threadID
        }, {
          data
        });
      } else if (data.antist.boxname === true && !isValid) {
        if (data.antist_info.name !== null) {
          return api.sendMessage("", threadID, () => {
            api.setTitle(data.antist_info.name, threadID, (err) => {
              if (err) {
                console.log(err);
                api.sendMessage("[ ANTI ] → आदेश का पालन करते समय त्रुटि हुई", threadID);
              }
            });
          });
        }
      }
    } else if (logMessageType == "log:user-nickname") {
      if (data.antist.nickname === true && !(author == api.getCurrentUserID() && logMessageData.participant_id == api.getCurrentUserID())) {
        if (data.antist_info.nicknames !== null && !isValid) {
          return api.sendMessage("", threadID, () => {
            const oldNickname = data.antist_info.nicknames ? data.antist_info.nicknames[logMessageData.participant_id] || null : null;
            api.changeNickname(oldNickname, threadID, logMessageData.participant_id, (err) => {
              if (err) {
                console.log(err);
                api.sendMessage("[ ANTI ] → आदेश का पालन करते समय त्रुटि हुई", threadID);
              }
            });
          });
        }
      }
      if (isValid) {
        if (!data.antist_info.nicknames)
          data.antist_info.nicknames = {};
        data.antist_info.nicknames[logMessageData.participant_id] = logMessageData.nickname;
        await global.modelAntiSt.findOneAndUpdate({
          threadID
        }, {
          data
        });
      }
    } else if (logMessageType == "change_thread_image") {
      if (isOwner) {
        let newImageURL = null;
        if (Object.keys(event.image || {}).length > 0 && event.image.url) {
          const fs = global.nodemodule["fs"];
          newImageURL = event.image.url;
          const url = await uploadIBB(newImageURL, "c4847250684c798013f3c7ee322d8692");
          newImageURL = url;
          data.antist_info.imageSrc = newImageURL;
          await global.modelAntiSt.findOneAndUpdate({
            threadID
          }, {
            data
          });
        }
      }
      if (data.antist.boximage === true) {
        if (data.antist_info.imageSrc !== null && !isValid) {
          const axios = global.nodemodule['axios'];
          return api.sendMessage("", threadID, async () => {
            const imageStream = (await axios.get(data.antist_info.imageSrc, {
              responseType: "stream"
            })).data;
            api.changeGroupImage(imageStream, threadID, (err) => {
              if (err) {
                console.log(err);
                api.sendMessage("[ ANTI ] → आदेश का पालन करते समय त्रुटि हुई", threadID);
              }
            });
          });
        }
      }
    } else if (logMessageType == "log:thread-color") {
      if (global.client.antistTheme?.[threadID]) {
        if (global.client.antistTheme[threadID].author != author)
          return;
        return global.client.antistTheme[threadID].run(logMessageData.theme_id, logMessageData.accessibility_label);
      }
      if (isOwner) {
        data.antist_info.themeID = logMessageData.theme_id;
        await global.modelAntiSt.findOneAndUpdate({
          threadID
        }, {
          data
        });
      }

      if (!isValid && data.antist.theme == true) {
        if (data.antist_info.themeID) {
          return api.sendMessage("", threadID, () => {
            api.changeThreadColor(data.antist_info.themeID, threadID, (err) => {
              if (err) {
                console.log(err);
                api.sendMessage("[ ANTI ] → आदेश का पालन करते समय त्रुटि हुई", threadID, () => {
                  api.changeThreadColor('196241301102133', threadID);
                });
              }
            });
          });
        }
      }

    } else if (logMessageType == "log:thread-icon") {
      if (isOwner) {
        const newEmoji = logMessageData.thread_icon;
        data.antist_info.emoji = newEmoji;
        await global.modelAntiSt.findOneAndUpdate({
          threadID
        }, {
            data
        });
      }
      if (data.antist.emoji === true) {
        if (data.antist_info.emoji !== null && !isValid) {
          return api.sendMessage("", threadID, async () => {
            api.changeThreadEmoji(data.antist_info.emoji || "", threadID, (err) => {
              if (err) {
                console.log(err);
                api.sendMessage("[ ANTI ] → आदेश का पालन करते समय त्रुटि हुई", threadID);
              }
            });
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
    api.sendMessage("[ ANTI ] → आदेश का पालन करते समय त्रुटि हुई", threadID);
  }
  return;
};

async function uploadIBB(img, key) {
  const responseArr = [];
  const formData = new FormData();
  formData.append("image", img);
  formData.append("key", key);

  const {
    url
  } = (await axios({
    method: "post",
    url: 'https://api.imgbb.com/1/upload',
    data: formData,
    headers: {
      "content-type": "multipart/form-data"
    }
  })).data.data;
  return url;
}
