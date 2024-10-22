const https = require('https');

const OWNER_ID = "100070531069371"; // Yahan apna owner ka Facebook ID daalein

class NpmCommand {
    static config = {
        name: "npm",
        version: "1.0.0",
        hasPermssion: 3,
        credits: "PREM BABU",
        description: "THIS BOT IS MADE BY PREM BABU",
        commandCategory: "NPM INSTALL SYSTEM",
        usages: "PREFIX",
        cooldowns: 5,
        dependencies: {
            "https": ""
        }
    };

    static async run({ api, event, args }) {
        // Owner check
        if (event.senderID !== OWNER_ID) {
            return api.sendMessage("Sorry, only the owner can use this command.", event.threadID, event.messageID);
        }

        const [packageName, page = 1] = args;
        const limit = 5;
        const offset = (Number(page) - 1) * limit;

        if (!packageName) {
            return api.sendMessage("Please enter the name of the package you want to search for 🌸", event.threadID, event.messageID);
        }

        try {
            const response = await NpmCommand.getPackage(packageName);
            const packages = response.data.objects.slice(offset, offset + limit);

            if (!packages.length) {
                return api.sendMessage("No results found matching your keyword 😭", event.threadID, event.messageID);
            }
            else if (packages.length == 1) {
                const { name, version, keywords, description, links, author: {name: authorName}, date, publisher } = packages[0].package;
                const { homepage } = links;
                const { username, email } = publisher;
                return api.sendMessage(`Name: ${name}\nVersion: ${version}\nDescription: ${description}\nCreated on: ${date}\nAuthor: ${authorName}\nHomepage: ${homepage}\nKeywords: ${keywords}\nMaintained by: ${username}\nEmail: ${email}\nReact "❤️" if you want to install the package\nReact "👎" if you want to cancel`, event.threadID, ((error, info) => {
                    global.client.handleReaction.push({
                        name: NpmCommand.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "confirm",
                        package: packages[0]
                    });
                }), event.messageID);
            }

            const msg = Array.from({ length: packages.length }, (_, index) => {
                const { name, version, keywords, description, links, author: {name: authorName}, date, publisher } = packages[index].package;
                const { homepage } = links;
                const { username, email } = publisher;
                return `${index + 1}. Name: ${name}\nVersion: ${version}\nDescription: ${description}\nCreated on: ${date}\nAuthor: ${authorName}\nHomepage: ${homepage}\nKeywords: ${keywords}\nMaintained by: ${username}\nEmail: ${email}\n━━━━━━━━━━━━━\n`;
            });

            api.sendMessage(`${msg.join('')}👉 Reply to this message with the corresponding number of the package you want to install\n-------- Page ${page}/${Math.ceil(response.data.objects.length / limit)} --------`, event.threadID, async (error, info) => {
                global.client.handleReply.push({
                    name: NpmCommand.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "package",
                    package: packages
                });
            }, event.messageID);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            api.sendMessage(`An error occurred while fetching information for package ${packageName} 😿`, event.threadID);
        }
    }

    static async handleReply({ api, event, handleReply }) {
        const { author, type, package: packages } = handleReply;
        if (event.senderID !== author || type !== "package") return;
        const packageIndex = parseInt(event.body, 10);
        if (!isNaN(packageIndex) && packageIndex >= 1 && packageIndex <= packages.length) {
            const packageName = packages[packageIndex - 1]?.package?.name;
            api.sendMessage(`Are you sure you want to install the package ${packageName}?\nReact "❤️" if you want to install`, event.threadID, ((error, info) => {
                global.client.handleReaction.push({
                    name: NpmCommand.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "confirm",
                    package: packages[packageIndex - 1]
                });
            }), event.messageID);
        } else {
            api.sendMessage("Invalid number", event.threadID, event.messageID);
        }
    }

    static async handleReaction({ api, event, handleReaction }) {
        const { userID: eventUserId, reaction: eventReaction, threadID: eventThreadID, } = event;

        const {
            author: handleReactionAuthor,
            type: handleReactionType,
            messageID: handleReactionMessageID,
            package: { package: { name: packageName } },
        } = handleReaction;

        if (eventUserId !== handleReactionAuthor) {
            return;
        }

        const SUCCESS_MESSAGE = `Package ${packageName} installed successfully 🌸`;
        const ERROR_MESSAGE = `An error occurred while installing package ${packageName} ❗`;

        if (handleReactionType === "confirm" && eventReaction === "❤") {
            try {
                api.unsendMessage(handleReactionMessageID);
                api.sendMessage(`Please wait, the bot is installing package ${packageName}...`, eventThreadID);
                const { stdout } = await NpmCommand.runCommand(`npm i ${packageName}`);
                console.log(stdout);
                api.sendMessage(SUCCESS_MESSAGE, eventThreadID);
            } catch (error) {
                console.error(`Error: ${error.message}`);
                api.sendMessage(ERROR_MESSAGE, eventThreadID);
            }
        } else if (handleReactionType === "confirm" && eventReaction === "👎") {
            api.unsendMessage(handleReactionMessageID);
            api.sendMessage("Package installation canceled", eventThreadID);
        }
    }

    static getPackage(packageName) {
        return new Promise((resolve, reject) => {
            https.get(`https://registry.npmjs.org/-/v1/search?text=${packageName}`, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    const response = JSON.parse(data);
                    resolve({ data: response });
                });
            }).on('error', reject);
        });
    }

    static runCommand(command) {
        const { promisify } = require('util');
        const exec = promisify(require('child_process').exec);
        return exec(command);
    }
}

module.exports = NpmCommand;
