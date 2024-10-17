const { spawn } = require("child_process");
const { readFileSync } = require("fs-extra");
const http = require("http");
const axios = require("axios");
const semver = require("semver");
const logger = require("./utils/log");

/////////////////////////////////////////////
//========= PREM VERSION NODE.JS ==========//
/////////////////////////////////////////////
///////////////////////////////////////////////////////////
//=========== THIS BOT IS MADE BY PREM BABU  ============//
///////////////////////////////////////////////////////////

const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// PREM BABU HTML
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'PREM-BABU.html'));
});

app.listen(port);

logger("Opened server site...", "[ PREM PROJECT STARTING ]");

/////////////////////////////////////////////////////////
//========= THIS BOT CREATER BY MR PREM BABU  =========//
/////////////////////////////////////////////////////////

function startBot(message) {
    (message) ? logger(message, "[ PREM PROJECT STARTING ]") : "";

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "PREM-BABU.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", (codeExit) => {
        if (codeExit != 0 || global.countRestart && global.countRestart < 5) {
            startBot("Restarting...");
            global.countRestart += 1;
            return;
        } else return;
    });

    child.on("error", function (error) {
        logger("An error occurred: " + JSON.stringify(error), "[ PREM PROJECT STARTING ]");
    });
};
////////////////////////////////////////////////
//========= PREM UPDATE FROM GITHUB  =========//
////////////////////////////////////////////////


axios.get("https://raw.githubusercontent.com/prem-project3608/prem-babu-fca/refs/heads/main/PREM-FCA/package.json").then((res) => {
    logger(res['data']['name'], "[ NAME ]");
    logger("Version: " + res['data']['version'], "[ PREM PROJECT STARTING ]");
    logger(res['data']['description'], "[ PREM PROJECT STARTING ]");
});
startBot();
