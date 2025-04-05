// const TelegramBot = require('node-telegram-bot-api');
// const API_KEY_BOT = require('./settings/key/token');
// const commands = require('./settings/command');
// const ways = require('./controllers/requests');

import TelegramBot from 'node-telegram-bot-api';
import API_KEY_BOT from './settings/key/token.js';
import commands from './settings/command.js';
import ways from './controllers/requests.js'; 

const bot = new TelegramBot(API_KEY_BOT, { polling: {interval: 300, autoStart: true}});

bot.setMyCommands(commands);

bot.on("polling_error", err => console.log(err.data.error.message));

ways(bot);

