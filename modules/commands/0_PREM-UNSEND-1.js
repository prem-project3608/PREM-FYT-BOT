module.exports.config = {
	name: "unsendOnReact",
	version: "1.0.3",
	hasPermssion: 0,
	credits: "PREM BABU",
	description: "Bot apni message ko unsend karta hai jab koi specific emoji react ki jati hai",
	commandCategory: "BOT MESSAGE DELETE",
	usages: "Bot ki message par specific emoji react karke usko delete karo",
	cooldowns: 0
};

module.exports.languages = {
	"en": {
		"returnCant": "Main kisi aur ki message nahi delete kar sakta 😐✌️",
		"reactToDelete": "Meri message ko delete karne ke liye sahi emoji se react karo 😐✌️"
	}
};

module.exports.run = function({ api, event, getText }) {
	// Yahan par multiple emojis add kiye gaye hain jo unsend karne ke liye react kiye ja sakte hain
	const triggerEmojis = ["❤️", "👍", "😂", "😢"]; // Aap yahan aur emojis add kar sakte hain

	// Ensure karein ki yeh reaction event hai
	if (event.type === "message_reaction" && triggerEmojis.includes(event.reaction)) {
		// Check karein ki reaction bot ki apni message par hai
		if (event.messageID && event.userID !== api.getCurrentUserID()) {
			// Sahi reaction dalte hi message unsend karo
			return api.unsendMessage(event.messageID);
		}
	}

	// Agar sahi reaction nahi mila ya wo kisi aur ki message par hai
	api.sendMessage(getText("reactToDelete"), event.threadID);
};
