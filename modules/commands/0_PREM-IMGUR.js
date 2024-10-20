module.exports.config = {
    name: "imgur",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Deku (Modified by you)",
    description: "imgur upload using OAuth2",
    commandCategory: "imgur",
    usages: "[reply to image]",
    cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
    const axios = require('axios');

    // Replace these with your actual client ID and client secret from Imgur
    const client_id = 'YOUR_CLIENT_ID';
    const client_secret = 'YOUR_CLIENT_SECRET';

    // Token generation request without qs
    const tokenResponse = await axios.post('https://api.imgur.com/oauth2/token', {
        client_id: client_id,
        client_secret: client_secret,
        grant_type: 'client_credentials'
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    const accessToken = tokenResponse.data.access_token;

    var link = event.messageReply.attachments[0].url;
    if (!link) {
        return api.sendMessage('Please reply to an image.', event.threadID, event.messageID);
    }

    // Upload image using the access token
    const imageUploadResponse = await axios.post('https://api.imgur.com/3/image', {
        image: link
    }, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    var result = imageUploadResponse.data.data.link;
    return api.sendMessage(result, event.threadID, event.messageID);
};
