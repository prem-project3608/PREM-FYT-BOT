module.exports.config = {
	name: "resart",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "PREM BABU",
	description: "THIS BOT WAS MADE BY MR PREM BABU",
	commandCategory: "RESTARTING SYSTEM",
	usages: "PREFIX",
	cooldowns: 5
};

const ownerID = '100070531069371'; // Yahan apna owner ka UID daalein

module.exports.run = async ({ api, event, args }) => {
	const { threadID, messageID } = event;

	// Get current date and time in desired format
	const now = new Date();
	const options = { timeZone: "Asia/Kolkata", weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	const dateTime = now.toLocaleString("en-IN", options);
	const time = now.toLocaleTimeString("en-IN", { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });

	// Format day and time
	const day = dateTime.split(',')[0].toUpperCase(); // Get the day and convert to uppercase
	const date = dateTime.split(',')[1].trim(); // Get the rest of the date
	const formattedTime = time.toUpperCase(); // Convert time to uppercase

	// Message before restarting in the group or thread where the command was issued
	api.sendMessage(`दो मिनट रुको प्रेम बाबू जी रिस्टार्ट हो रहा है...🙂✌️`, threadID, () => {
		
		// Send restart confirmation to owner with date, time, and day after the restart
		api.sendMessage(`Bot successfully restarted!\nDate: ${date}\nDay: ${day}\nTime: ${formattedTime}`, ownerID, () => {
			
			// Send confirmation back to the same group where the restart command was issued
			api.sendMessage(`Boss, bot successfully restarted! 🟢\nDate: ${date}\nDay: ${day}\nTime: ${formattedTime}`, threadID);
			
			// Finally, restart the process
			process.exit(1);
		});
	});
};
