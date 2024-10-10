module.exports.config = {
	name: "unsendOnReact",
	version: "1.0.2",
	hasPermssion: 0,
	credits: "PREM BABU",
	description: "Bot unsends its message when someone reacts to it",
	commandCategory: "BOT MESSAGE DELETE",
	usages: "React to the bot's message to unsend",
	cooldowns: 0
};

module.exports.languages = {
	"en": {
		"returnCant": "I cannot delete someone else's message 😐✌️",
		"reactToDelete": "React to my message to delete it 😐✌️"
	}
}

module.exports.run = function({ api, event, getText }) {
	// Ensure this is a reaction event
	if (event.type === "message_reaction") {
		// Check if the reaction is on the bot's message
		if (event.messageID && event.userID !== api.getCurrentUserID()) {
			// Unsend the message the reaction was added to
			return api.unsendMessage(event.messageID);
		}
	}

	// Default case when there's no reaction or it's on someone else's message
	api.sendMessage(getText("reactToDelete"), event.threadID);
};
