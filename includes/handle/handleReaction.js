module.exports = function ({ api, models, Users, Threads, Currencies }) {
    return function ({ event }) {
        const { handleReaction, commands } = global.client;
        const { messageID, threadID, senderID, reaction, type } = event;

        // Check if the reaction is an "unsend" action
        if (type === 'unsend') {
            const indexOfHandle = handleReaction.findIndex(e => e.messageID == messageID);
            if (indexOfHandle >= 0) {
                // Remove the reaction from the handleReaction list
                handleReaction.splice(indexOfHandle, 1);
                return api.sendMessage(`Reaction from message ID ${messageID} has been unsent by ${senderID}.`, threadID);
            }
        }

        // Handle normal reactions
        if (handleReaction.length !== 0) {
            const indexOfHandle = handleReaction.findIndex(e => e.messageID == messageID);
            if (indexOfHandle < 0) return;

            const indexOfMessage = handleReaction[indexOfHandle];
            const handleNeedExec = commands.get(indexOfMessage.name);

            if (!handleNeedExec) return api.sendMessage(global.getText('handleReaction', 'missingValue'), threadID, messageID);
            try {
                var getText2;
                if (handleNeedExec.languages && typeof handleNeedExec.languages == 'object') 
                    getText2 = (...value) => {
                    const react = handleNeedExec.languages || {};
                    if (!react.hasOwnProperty(global.config.language)) 
                        return api.sendMessage(global.getText('handleCommand', 'notFoundLanguage', handleNeedExec.config.name), threadID, messageID);
                    var lang = handleNeedExec.languages[global.config.language][value[0]] || '';
                    for (var i = value.length; i > 0x2 * -0xb7d + 0x2111 * 0x1 + -0xa17; i--) {
                        const expReg = RegExp('%' + i, 'g');
                        lang = lang.replace(expReg, value[i]);
                    }
                    return lang;
                };
                else getText2 = () => {};

                const Obj = {
                    api: api,
                    event: event,
                    models: models,
                    Users: Users,
                    Threads: Threads,
                    Currencies: Currencies,
                    handleReaction: indexOfMessage,
                    getText: getText2
                };

                // Here is where the bot reacts to the message
                const botMessageID = '61566990413296'; // Replace with the actual message ID of the bot's message

                // Send a reaction (e.g., a thumbs up) to the bot's message
                api.setMessageReaction('👍', botMessageID, (err) => {
                    if (err) return api.sendMessage("Failed to react: " + err, threadID);

                    // After reacting, delete the bot's message
                    api.deleteMessage(botMessageID, (err) => {
                        if (err) return api.sendMessage("Failed to delete message: " + err, threadID);
                        return api.sendMessage(`Reaction sent and message deleted by the bot.`, threadID);
                    });
                });

                handleNeedExec.handleReaction(Obj);
                return;
            } catch (error) {
                return api.sendMessage(global.getText('handleReaction', 'executeError', error), threadID, messageID);
            }
        }
    };
};
