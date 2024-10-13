module.exports.config = {
	name: "unsendReaction",
	version: "1.0.3",
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
		"reactionDelete": "Message deleted based on your reaction!"
	}
};

module.exports.handleReaction = function ({ api, event, getText }) {
	// Check if the reaction is on bot's own message
	if (event.userID != api.getCurrentUserID()) return; // Ensure the bot doesn't delete someone else's message

	if (event.reaction === "👍") { // Add your desired reaction emoji
		api.unsendMessage(event.messageID);
		api.sendMessage(getText("reactionDelete"), event.threadID);
	}
};

module.exports.run = function({ api, event }) {
	// Ensure the command only responds when necessary (not needed here)
	return;
};
