const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "test",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "PREM BABU",
    description: "Lock all group settings.",
    commandCategory: "Group",
    usages: "lockallsettings",
    cooldowns: 5,
  },

  onStart: async function ({ message, event, threadsData, getLang }) {
    const { threadID } = event;

    // Get current settings
    const dataLockSettings = await threadsData.get(threadID, "data.lockSettings", {});

    // Locking the settings
    dataLockSettings.name = true;       // Group name change lock
    dataLockSettings.nickname = true;   // Nickname change lock
    dataLockSettings.avatar = true;     // Avatar change lock
    dataLockSettings.emoji = true;      // Emoji change lock

    // Store original settings
    dataLockSettings.originalName = await api.getThreadInfo(threadID).name;
    dataLockSettings.originalNickname = {}; // Store nicknames of all members
    dataLockSettings.originalAvatar = await api.getThreadInfo(threadID).imageUrl;
    dataLockSettings.originalEmoji = await api.getThreadInfo(threadID).emoji;

    // Save locked settings
    await threadsData.set(threadID, dataLockSettings, "data.lockSettings");
    message.reply(getLang("allSettingsLocked"));
  },

  onEvent: async function ({ message, event, threadsData, api, role }) {
    const { threadID, logMessageType, logMessageData, author } = event;
    const dataLockSettings = await threadsData.get(threadID, "data.lockSettings", {});

    switch (logMessageType) {
      case "log:thread-name": {
        if (dataLockSettings.name && role < 2 && api.getCurrentUserID() !== author) {
          message.reply("Group name change is locked.");
          api.setTitle(dataLockSettings.originalName, threadID); // Reset to original name
        }
        break;
      }
      case "log:user-nickname": {
        if (dataLockSettings.nickname && role < 2 && api.getCurrentUserID() !== author) {
          message.reply("Nickname change is locked.");
          api.changeNickname(dataLockSettings.originalNickname[logMessageData.participant_id] || "", threadID, logMessageData.participant_id); // Reset to original nickname
        }
        break;
      }
      case "log:thread-image": {
        if (dataLockSettings.avatar && role < 2 && api.getCurrentUserID() !== author) {
          message.reply("Avatar change is locked.");
          api.changeGroupImage(await getStreamFromURL(dataLockSettings.originalAvatar), threadID); // Reset to original avatar
        }
        break;
      }
      case "log:thread-icon": {
        if (dataLockSettings.emoji && role < 2 && api.getCurrentUserID() !== author) {
          message.reply("Emoji change is locked.");
          api.changeThreadEmoji(dataLockSettings.originalEmoji, threadID); // Reset to original emoji
        }
        break;
      }
    }
  }
};
