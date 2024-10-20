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
    const qs = require('querystring');

    // Replace these with your actual client ID and client secret from Imgur
    const client_id = 'b4808c95bb518c1'; // Your client ID
    const client_secret = '915e1e39335befeffa7a04e742eae6f452380f4c'; // Your client secret

    try {
        // Token generation request with correct format
        const tokenResponse = await axios.post('https://api.imgur.com/oauth2/token', qs.stringify({
            client_id: client_id,
            client_secret: client_secret,
            grant_type: 'client_credentials'
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const accessToken = tokenResponse.data.access_token;

        const link = event.messageReply.attachments[0]?.url; // Ensure link exists
        if (!link) {
            return api.sendMessage('Please reply to an image.', event.threadID, event.messageID);
        }

        // Upload image using the access token with correct URL
        const imageUploadResponse = await axios.post('https://api.imgur.com/3/image', {
            image: link
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const result = imageUploadResponse.data.data.link;
        return api.sendMessage(`Image uploaded successfully! Here is your link: ${result}`, event.threadID, event.messageID);

    } catch (error) {
        console.error(error);
        return api.sendMessage('There was an error uploading the image: ' + error.message, event.threadID, event.messageID);
    }
};
