const axios = require('axios'); // HTTP अनुरोधों के लिए

module.exports.config = {
  name: "FUNNY-JOKE", 
  version: "1.0.0",
  hasPermssion: 0,
  credits: "PREM BABU",
  description: "यह बॉट मजेदार चुटकुले भेजता है",
  commandCategory: "FUN",
  usages: "NO PREFIX",
  cooldowns: 5
};

module.exports.handleEvent = async ({ api, event }) => {
  if (!event.body) return;
  var { threadID, messageID } = event;

  if (event.body.toLowerCase().indexOf("joke") == 0) {
    try {
      // हिंदी चुटकुलों के लिए API
      const response = await axios.get('https://hindi-jokes-api.onrender.com/jokes?api_key=078a738bcb9bf36766b7b1f24088');
      const joke = response.data.joke; // जोक प्राप्त करें

      // जोक को संदेश के रूप में तैयार करना
      const randomMessage = `😂 यहाँ एक मजेदार चुटकुला है:\n\n${joke}`;

      // Message bhejna
      api.sendMessage({
        body: randomMessage
      }, threadID, messageID);
    } catch (error) {
      console.error("Error fetching joke:", error);
      api.sendMessage({
        body: "क्षमा करें, अभी मैं एक चुटकुला नहीं ले सका!"
      }, threadID, messageID);
    }
  }
};

module.exports.run = () => {};
