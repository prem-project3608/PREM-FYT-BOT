module.exports.config = {
	name: "unsendReaction",
	version: "1.0.2",
	hasPermssion: 0,
	credits: "PREM BABU",
	description: "Delete bot message when a specific reaction is added.",
	commandCategory: "Reaction Based",
	usages: "",
	cooldowns: 0
};

module.exports.languages = {
	"en": {
		"returnCant": "I can't delete someone else's message 😐✌️",
		"missingReply": "Reply to the bot message you want to delete 😐✌️",
		"reactionDelete": "Message deleted based on your reaction!"
	}
};

module.exports.run = function({ api, event, getText }) {
	// Only unsend bot's own messages
	if (event.messageReply.senderID != api.getCurrentUserID()) return api.sendMessage(getText("returnCant"), event.threadID, event.messageID);
	if (event.type != "message_reply") return api.sendMessage(getText("missingReply"), event.threadID, event.messageID);

	// Reaction event handling
	api.listenMqtt((error, message) => {
		if (message.type === "message_reaction") {
			if (message.reaction === "👍") { // Add your desired reaction emoji
				api.unsendMessage(event.messageReply.messageID);
				api.sendMessage(getText("reactionDelete"), event.threadID);
			}
		}
	});
};
