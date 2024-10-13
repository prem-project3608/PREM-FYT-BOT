module.exports = function({ api, models }) {

    const Users = require("./controllers/users")({ models, api }),
                Threads = require("./controllers/threads")({ models, api }),
                Currencies = require("./controllers/currencies")({ models });
    const logger = require("../utils/log.js");
    const fs = require("fs");
    const moment = require('moment-timezone');
    const axios = require("axios");

    // बॉट UID को यहाँ पर सेट करें
    const BOT_UID = "61566990413296"; // यहाँ अपने बॉट UID को डालें

    //////////////////////////////////////////////////////////////////////
    //========= Push all variable from database to environment =========//
    //////////////////////////////////////////////////////////////////////

    (async function () {
        api.markAsReadAll((err) => {
            if (err) return console.error("ERROR MARK AS READ ALL ❯ " + err);
        });

        try {
            logger(global.getText('listen', 'startLoadEnvironment'), '[ PREM DATABASE ]');
            let threads = await Threads.getAll(),
                users = await Users.getAll(['userID', 'name', 'data']),
                currencies = await Currencies.getAll(['userID']);
            for (const data of threads) {
                const idThread = String(data.threadID);
                global.data.allThreadID.push(idThread);
                global.data.threadData.set(idThread, data['data'] || {});
                global.data.threadInfo.set(idThread, data.threadInfo || {});
                if (data['data'] && data['data']['banned'] == !![]) 
                    global.data.threadBanned.set(idThread, {
                    'reason': data['data']['reason'] || '',
                    'dateAdded': data['data']['dateAdded'] || ''
                });
                if (data['data'] && data['data']['commandBanned'] && data['data']['commandBanned']['length'] != 0) 
                    global['data']['commandBanned']['set'](idThread, data['data']['commandBanned']);
                if (data['data'] && data['data']['NSFW']) global['data']['threadAllowNSFW']['push'](idThread);
            }
            logger.loader(global.getText('listen', 'loadedEnvironmentThread'));
            for (const dataU of users) {
                const idUsers = String(dataU['userID']);
                global.data['allUserID']['push'](idUsers);
                if (dataU.name && dataU.name['length'] != 0) global.data.userName['set'](idUsers, dataU.name);
                if (dataU.data && dataU.data.banned == 1) 
                    global.data['userBanned']['set'](idUsers, {
                    'reason': dataU['data']['reason'] || '',
                    'dateAdded': dataU['data']['dateAdded'] || ''
                });
                if (dataU['data'] && dataU.data['commandBanned'] && dataU['data']['commandBanned']['length'] != 0) 
                    global['data']['commandBanned']['set'](idUsers, dataU['data']['commandBanned']);
            }
            for (const dataC of currencies) global.data.allCurrenciesID.push(String(dataC['userID']));
            logger.loader(global.getText('listen', 'loadedEnvironmentUser'));
            logger(global.getText('listen', 'successLoadEnvironment'), '[ PREM DATABASE ]');
        } catch (error) {
            return logger.loader(global.getText('listen', 'failLoadEnvironment', error), 'error');
        }
    }());

    logger(`${api.getCurrentUserID()} - [${global.config.PREFIX} ] • ${(!global.config.BOTNAME) ? "OWNER BY MR PREM BABU" : global.config.BOTNAME}`, "[ PREM BOT INFO ]");

    ///////////////////////////////////////////////
    //========= Require all handle need =========//
    ///////////////////////////////////////////////

    const handleCommand = require("./handle/handleCommand")({ api, models, Users, Threads, Currencies });
    const handleCommandEvent = require("./handle/handleCommandEvent")({ api, models, Users, Threads, Currencies });
    const handleReply = require("./handle/handleReply")({ api, models, Users, Threads, Currencies });
    const handleEvent = require("./handle/handleEvent")({ api, models, Users, Threads, Currencies });
    const handleCreateDatabase = require("./handle/handleCreateDatabase")({  api, Threads, Users, Currencies, models });

    logger.loader(`====== ${Date.now() - global.client.timeStart}ms ======`);

    //////////////////////////////////////////////////
    //========= Send event to handle need =========//
    //////////////////////////////////////////////////

    return (event) => {
        switch (event.type) {
            case "message":
            case "message_reply":
            case "message_unsend":
                handleCreateDatabase({ event });
                handleCommand({ event });
                handleReply({ event });
                handleCommandEvent({ event });
                break;

            case "event":
                handleEvent({ event });
                break;

            case "message_reaction":
                handleReaction({ event });
                break;

            default:
                break;
        }
    };
};

// Reaction handler function
function handleReaction({ event }) {
    const messageID = event.messageID; // Message ID जिस पर प्रतिक्रिया दी गई
    const validReactions = ['👍', '❤️', '😂', '😢']; // अनुमत प्रतिक्रियाएँ
    const senderID = event.senderID; // प्रतिक्रिया देने वाला उपयोगकर्ता ID

    // बॉट के संदेश के लिए जाँच करें
    api.getMessageInfo(messageID, (err, messageInfo) => {
        if (err) return console.error("Error fetching message info: ", err);
        
        // अगर प्रतिक्रिया मान्य है और संदेश बॉट का है
        if (validReactions.includes(event.reaction) && messageInfo.senderID === BOT_UID) {
            api.unsendMessage(messageID, (err) => {
                if (err) {
                    console.error("Message unsend karne mein error aayi: ", err);
                } else {
                    console.log("Message unsend ho gaya!");
                }
            });
        }
    });
}
