const TelegramBot = require('node-telegram-bot-api');

function ways(bot){
    bot.onText(/\/start/, async msg => {
        try {
            await bot.sendMessage(msg.chat.id, `Вы запустили бота!`);
            if(msg.text.length > 6) {
                const refID = msg.text.slice(7);
                await bot.sendMessage(msg.chat.id, `Вы зашли по ссылке пользователя с ID ${refID}`);
            }
        } catch(error) {
            console.log(error);
        }
    })
    
    bot.onText(/\/ref/, async msg => {
        await bot.sendMessage(msg.chat.id, `t.me/FastApi_and_JavaScript_tutorBOT?start=${msg.from.id}`);
    })


    bot.onText(/\/about/, async msg => {
        try{
            let msgWait = await bot.sendMessage(msg.chat.id, `Бот генерирует ответ...`);
            setTimeout(async () => {
                    // await bot.deleteMessage(msgWait.chat.id, msgWait.message_id);
                await bot.editMessageText("😁", { chat_id: msgWait.chat.id, message_id: msgWait.message_id });
                    await bot.sendMessage(msg.chat.id,"Автор: Arsen_Karakeyan");
            },4000);
        } catch(error){
            console.log(error);
        } 
    })
}

module.exports = ways;
