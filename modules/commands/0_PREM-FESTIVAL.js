module.exports.config = {
    name: 'FESTIVAL-WISH',
    version: '1.0',
    hasPermssion: 0,
    credits: 'YOUR NAME',
    description: 'Automatically sends festival wishes',
    commandCategory: 'AUTO SEND FESTIVALS',
    usages: '[AUTOMATIC]',
    cooldowns: 3
};

const festivals = [
    { date: '01-01', message: '🎉 Happy New Year! May this year bring you joy, health, and success!' },
    { date: '14-01', message: '🪁 Happy Makar Sankranti! May your life be filled with warmth and joy!' },
    { date: '26-01', message: '🇮🇳 Happy Republic Day! Let’s celebrate the spirit of freedom and unity!' },
    { date: '08-03', message: '🌷 Happy International Women\'s Day! Celebrating the strength and achievements of women!' },
    { date: '15-08', message: '🇮🇳 Happy Independence Day! Remembering the sacrifices of our freedom fighters!' },
    { date: '02-10', message: '🙏 Happy Gandhi Jayanti! Let’s honor the father of our nation!' },
    { date: '25-10', message: '🪔 Happy Diwali! May this festival of lights brighten your life!' },
    { date: '14-11', message: '🎉 Happy Children\'s Day! Let’s celebrate the joy of childhood!' },
    { date: '25-12', message: '🎄 Merry Christmas! Wishing you peace and joy this holiday season!' },
    // यहाँ और त्योहारों के लिए संदेश जोड़ें...
];

function sendFestivalWish(message) {
    // यहाँ पर मैसेज भेजने का लॉजिक डालें
    console.log(`Festival Wish: ${message}`);
}

function checkFestivals() {
    const now = new Date();
    const currentDate = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    festivals.forEach(festival => {
        if (festival.date === currentDate) {
            sendFestivalWish(festival.message);
        }
    });
}

// हर दिन 12:00 AM पर त्योहारों की जांच करने के लिए सेट करें
setInterval(checkFestivals, 24 * 60 * 60 * 1000); // हर 24 घंटे
checkFestivals(); // तुरंत जांच करें
