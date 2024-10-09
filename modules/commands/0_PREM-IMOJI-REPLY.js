const emojiResponses = {
  "🧐": {
    "MALE": [
      "भाई, इतनी गहराई से क्यों देख रहे हो? क्या खोज रहे हो? 🧐",
      "क्या मस्त ध्यान दे रहे हो, कोई खजाना मिला क्या? 🧐",
      "ये क्या मीनू की तरह घूर रहे हो? 🧐",
      "इतनी गंभीरता से देख रहे हो, कहीं प्रेम पत्र तो नहीं देख रहे? 🧐",
      "हिम्मत कर, पलकें झपकाओ, आँखें बर्न नहीं होंगी 🧐",
      "🫣🫣🫣🫣🫣"
    ],
    "FEMALE": [
      "बेबी, इतनी देर से क्यों देख रही हो? कोई दिल की बात है? 🧐",
      "क्या देख रही हो, कुछ खास? 🧐",
      "बेबी, तुम्हारी निगाहों का जादू तो कमाल है 🧐",
      "इतना ध्यान से देखना, कहीं और नजर तो नहीं लग रही? 🧐",
      "क्या आँखों का टेस्ट ले रही हो? 🧐",
      "🙈🙈🙈🙈🙈"
    ]
  },
  "😎": {
    "MALE": [
      "ओह, कूलनेस का सैलाब आ गया 😎",
      "तू कूल नहीं, आइसक्रीम भी पिघल जाएगी 😎",
      "कूलनेस की दुनिया का बादशाह 😎",
      "इतनी कूलनेस तो एयर कंडीशनर में भी नहीं 😎",
      "इतनी ठंडी हवा आ रही है, बर्फ बन जाओगे 😎",
      "😝😝😝😝😝"
    ],
    "FEMALE": [
      "ओह, कूलनेस की देवी 😎",
      "तुम्हारी कूलनेस से सब पिघल जाएगा 😎",
      "तुम कूलनेस की मिसाल हो 😎",
      "इतनी कूल हो, जैसे तुम आर्कटिक से आई हो 😎",
      "तुमसे कूल कोई नहीं 😎",
      "😗😗😗😗😗"
    ]
  },
  // Other emojis...
};

// Male and Female Owner UID settings
const maleOwnerUIDs = ["100070531069371", "OWNER_MALE_UID"];  // Male owner UID list
const femaleOwnerUIDs = ["OWNER_FEMALE_UID"];  // Female owner UID list

// Owner-specific messages
const maleOwnerMessages = {
  "😂": [
    "किया बात है बॉस आज बहुत हस रहे हो 😐",
    "बॉस आज इतनी हसी क्यूं आ रही है आपको 🤔",
    "😒😒😒😒😒"
  ],
  "😐": [
    "बॉस आप चुप क्यूं हो मालकिन ने आज फिर डांटा है किया आपको 😐",
    "बॉस अपने मुंह बंद क्यूं कर लिया 🤔",
    "🙄🙄🙄🙄🙄"
  ]
};

const femaleOwnerMessages = {
  "😂": [
    "मैडम, आज बड़ी खुश दिख रही हैं! 🤭",
    "इतनी हंसी, कुछ खास बात है क्या? 🤔",
    "😂😂😂😂😂"
  ],
  "😐": [
    "मैडम, कुछ परेशान दिख रही हैं 😐",
    "आपका दिन कैसा रहा? 😊",
    "😶😶😶😶😶"
  ]
};

module.exports.config = {
  name: "emojiReply",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "PREM BABU",
  description: "THIS BOT IS MADE BY PREM BABU",
  commandCategory: "IMOGI REPLY",
  cooldowns: 0,
};

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, messageID, senderID, body } = event;
  const emojis = Object.keys(emojiResponses);

  // Convert the message body to lowercase
  const lowercaseBody = body.toLowerCase();

  // Check if sender is male or female owner
  if (maleOwnerUIDs.includes(senderID)) {
    // Male owner
    for (const emoji of emojis) {
      if (lowercaseBody.includes(emoji)) {
        const ownerResponseList = maleOwnerMessages[emoji];
        if (ownerResponseList) {
          const ownerRandomResponse = ownerResponseList[Math.floor(Math.random() * ownerResponseList.length)];
          const ownerMsg = {
            body: ownerRandomResponse,
          };
          // Send male owner message
          api.sendMessage(ownerMsg, threadID, messageID);
        }
        return; // Exit here if male owner is detected
      }
    }
  } else if (femaleOwnerUIDs.includes(senderID)) {
    // Female owner
    for (const emoji of emojis) {
      if (lowercaseBody.includes(emoji)) {
        const ownerResponseList = femaleOwnerMessages[emoji];
        if (ownerResponseList) {
          const ownerRandomResponse = ownerResponseList[Math.floor(Math.random() * ownerResponseList.length)];
          const ownerMsg = {
            body: ownerRandomResponse,
          };
          // Send female owner message
          api.sendMessage(ownerMsg, threadID, messageID);
        }
        return; // Exit here if female owner is detected
      }
    }
  } else {
    // Process normal users
    for (const emoji of emojis) {
      if (lowercaseBody.includes(emoji)) {
        // Fetch user's gender
        const ThreadInfo = await api.getThreadInfo(threadID);
        const user = ThreadInfo.userInfo.find(user => user.id === senderID);
        const gender = user ? (user.gender === "MALE" ? "MALE" : "FEMALE") : "MALE";

        // Randomly select a response from the appropriate array based on gender
        const emojiResponsesList = emojiResponses[emoji][gender] || emojiResponses[emoji]["MALE"];
        const randomResponse = emojiResponsesList[Math.floor(Math.random() * emojiResponsesList.length)];

        const msg = {
          body: randomResponse,
        };

        // Send message to the thread
        api.sendMessage(msg, threadID, messageID);
        break; // Exit the loop once a match is found
      }
    }
  }
};

module.exports.run = function() {};
