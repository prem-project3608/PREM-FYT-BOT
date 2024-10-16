const { Client } = require('PREM-FCA-BOT'); // Install fb-chat-api using npm

// User credentials
const email = '9501113608'; // Aapka email ya mobile number
const password = 'taklu9876'; // Aapka password

// Initialize client
const client = new Client();

// Login to Facebook
client.login({ email: email, password: password }, (err) => {
    if (err) {
        console.error('Login failed:', err);
    } else {
        console.log('Logged in successfully!');

        // Here you can add your bot functionality
    }
});
