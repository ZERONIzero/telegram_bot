const TelegramBot = require('node-telegram-bot-api');
const API_KEY_BOT = require('./settings/token');
const commands = require('./settings/command');
const ways = require('./controllers/requests');

const bot = new TelegramBot(API_KEY_BOT, { polling: {interval: 300, autoStart: true}});

bot.setMyCommands(commands);

bot.on("polling_error", err => console.log(err.data.error.message));

ways(bot);

// bot.on('text', async msg => {

//     try{
//         // if (msg.text == '/start') {
//         //     await bot.sendMessage(msg.chat.id, `С первым запуском бота!`);
//         // } else {
//         //     let msgWait = await bot.sendMessage(msg.chat.id, `Бот генерирует ответ...`);
//         //     setTimeout(async () => {
//         //         // await bot.deleteMessage(msgWait.chat.id, msgWait.message_id);
//         //         await bot.editMessageText("😁", { chat_id: msgWait.chat.id, message_id: msgWait.message_id });
//         //         // await bot.sendMessage(msg.chat.id,"😁");
//         //     },4000);
//         // }
//     } catch (error) {
//         console.log(error);
//     }
// });
