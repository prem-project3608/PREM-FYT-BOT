const fs = require('fs');
const path = require('path');
const axios = require('axios');
const qs = require('querystring');

module.exports.config = {
    name: "imgur",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Deku (Modified by you)",
    description: "imgur upload using OAuth2",
    commandCategory: "imgur",
    usages: "[reply to image]",
    cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
    const client_id = 'b4808c95bb518c1'; // Your client ID
    const client_secret = '915e1e39335befeffa7a04e742eae6f452380f4c'; // Your client secret

    try {
        // Token generation request
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

        // Ensure image link exists
        const link = event.messageReply?.attachments?.[0]?.url;
        if (!link) {
            return api.sendMessage('Please reply to an image.', event.threadID, event.messageID);
        }

        // Log the image URL for debugging
        console.log('Image URL:', link);

        // Download the image to a local file inside 'cache' folder as 'photo.png'
        const imagePath = path.join(__dirname, 'cache', 'photo.png');
        const response = await axios({
            url: link,
            method: 'GET',
            responseType: 'stream'
        });

        // Pipe the image data to the file
        const writer = fs.createWriteStream(imagePath);
        response.data.pipe(writer);

        // Wait until the file has been written
        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // Log confirmation of image download
        console.log('Image downloaded successfully.');

        // Upload the image using the access token
        const base64Image = fs.readFileSync(imagePath).toString('base64');
        
        // Log base64 encoding details
        console.log('Base64 Image length:', base64Image.length);

        const imageUploadResponse = await axios.post('https://api.imgur.com/3/image', {
            image: base64Image // Read the image file and convert it to base64
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const result = imageUploadResponse.data.data.link;

        // Log the upload response from Imgur
        console.log('Imgur Upload Response:', imageUploadResponse.data);

        // Clean up the downloaded image file
        setTimeout(() => fs.unlinkSync(imagePath), 1000); // Delete the local file after upload

        return api.sendMessage(`Image uploaded successfully! Here is your link: ${result}`, event.threadID, event.messageID);

    } catch (error) {
        console.error('Error details:', error.response ? error.response.data : error.message);
        return api.sendMessage('There was an error uploading the image: ' + (error.response ? error.response.data.message : error.message), event.threadID, event.messageID);
    }
};
