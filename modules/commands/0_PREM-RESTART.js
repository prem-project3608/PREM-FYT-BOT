module.exports.config = {
    name: "restart",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "PREM BABU",
    description: "THIS BOT WAS MADE BY MR PREM BABU",
    commandCategory: "RESTARTING SYSTEM",
    usages: "PREFIX",
    cooldowns: 5
};

const ownerID = '100070531069371'; // यहाँ अपना मालिक का UID डालें

module.exports.run = async ({ api, event, args }) => {
    const { threadID } = event;

    // वर्तमान दिनांक और समय प्राप्त करें
    const now = new Date();
    const options = { timeZone: "Asia/Kolkata", weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateTime = now.toLocaleString("en-IN", options);
    const time = now.toLocaleTimeString("en-IN", { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });

    // दिन और समय को फॉर्मेट करें
    const day = dateTime.split(',')[0].toUpperCase(); // दिन प्राप्त करें और अपरकेस में बदलें
    const date = dateTime.split(',')[1].trim(); // शेष दिनांक प्राप्त करें
    const formattedTime = time.toUpperCase(); // समय को अपरकेस में बदलें

    // समूह में "wait" संदेश भेजें
    api.sendMessage(`दो मिनट रुको प्रेम बाबू जी रिस्टार्ट हो रहा है...🙂✌️`, threadID, () => {
        
        // रिस्टार्ट की प्रक्रिया
        process.exit(1); // यहां प्रक्रिया को पुनरारंभ करने के लिए बाहर निकलें

        // रिस्टार्ट के बाद मालिक और समूह में सफलता का संदेश भेजें
        api.sendMessage(`✅ Bot सफलतापूर्वक पुनरारंभ किया गया!\nतिथि: ${date}\nदिन: ${day}\nसमय: ${formattedTime}`, ownerID);
        api.sendMessage(`👨‍💻 Boss, bot सफलतापूर्वक पुनरारंभ किया गया! 🟢\nतिथि: ${date}\nदिन: ${day}\nसमय: ${formattedTime}`, threadID);
    });
};
