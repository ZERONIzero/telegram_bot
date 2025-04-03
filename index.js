const TelegramBot = require('node-telegram-bot-api');
const API_KEY_BOT = require('./settings/key/token');
const commands = require('./settings/command');
const ways = require('./controllers/requests');

const bot = new TelegramBot(API_KEY_BOT, { polling: {interval: 300, autoStart: true}});

bot.setMyCommands(commands);

bot.on("polling_error", err => console.log(err.data.error.message));

ways(bot);

// const bot = new TelegramBot(API_KEY_BOT, {
//     polling: true,
//   });
//   const { telegramCalendar } = require('telegram-bot-calendar-lite');
  
//   const calendar = new telegramCalendar(new Date(2024, 7, 1), 1, '2', "X", "*", "→", "←");
//   const buttons = calendar.generateCalendar();
  
//   bot.sendMessage(chatId, "text", {
//       reply_markup: buttons,
//   });

// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;

//     bot.sendMessage(chatId, "Выберите дату:", {
//         reply_markup: buttons
//     });
// });

// Обработка ошибок
// bot.on("polling_error", err => console.log(err.data.error.message));
