const TelegramBot = require('node-telegram-bot-api');
const telegramCalendar = require('telegram-bot-calendar-lite');
const mysql = require("mysql2");

const calendar = new telegramCalendar();
const buttons = calendar.generateCalendar();

let base_menu = null;
let doctor_menu = null;
let calendar_select = null;

function ways(bot){
    bot.onText(/\/start/, async msg => {
        try {
            await bot.sendMessage(msg.chat.id, `Вы запустили бота!`);

            setTimeout(async () => {
                base_menu = await bot.sendMessage(msg.chat.id, `Выберите нужную функцию`, {
                    reply_markup: {
                        keyboard: [
                            ['📝 Записаться на приём к врачу','❌ Отменить запись']
                        ],
                        resize_keyboard : true
                    }
                })
            },2000);
        } catch(error) {
            console.log(error);
        }
    })
    
    bot.onText(/\/menu/, async msg => {
        try {
            if (base_menu) {
                await bot.deleteMessage(base_menu.chat.id, base_menu.message_id);
                base_menu = null;
            }
            setTimeout(async () => {
                base_menu = await bot.sendMessage(msg.chat.id, `Выберите нужную функцию`, {
                    reply_markup: {
                        keyboard: [
                            ['📝 Записаться на приём к врачу','❌ Отменить запись']
                        ],
                        resize_keyboard : true
                    }
                })
            },1000);
        } catch(error) {
            console.log(error);
        }
    })

    bot.onText(/\/info/, async msg => {
        try{
            let msgWait = await bot.sendMessage(msg.chat.id, `Бот генерирует ответ...`);
            setTimeout(async () => {
                await bot.editMessageText("г. Москва, ул. Красная площадь, тел: 8(800)-555-35-35", { chat_id: msgWait.chat.id, message_id: msgWait.message_id });
                await bot.sendMessage(msg.chat.id,"Автор: Arsen_Karakeyan");
            },4000);
        } catch(error){
            console.log(error);
        } 
    })

    bot.onText('❌ Отменить запись', async msg => {
        try{
            if (base_menu) {
                await bot.deleteMessage(base_menu.chat.id, base_menu.message_id);
                base_menu = null;
            }
            await bot.sendPhoto(msg.chat.id, './assets/menu_img_2.jpg', {
                caption: '<b>Выберите специалиста</b>',
                parse_mode: 'HTML',
                reply_markup: {
                    resize_keyboard : true,
                    inline_keyboard: [
                        [{text: 'Стоматолог-терапевт', callback_data: 'terapeft'}],
                        [{text: 'Cтоматолог-хирург', callback_data: 'hirurg'}],
                        [{text: 'Стоматолог-ортопед', callback_data: 'ortoped'}],
                        [{text: 'Стоматолог-гигиенист', callback_data: 'gigienist'}],
                        [{text: 'Стоматолог-пародонтолог', callback_data: 'parodontolog'}],
                        [{text: 'Стоматолог-имплантолог', callback_data: 'implantolog'}],
                        [{text: 'Стоматолог-ортодонт', callback_data: 'ortodont'}],
                        [{text: 'Детский стоматолог', callback_data: 'kid'}],
                        [{text: '❌ Закрыть меню ❌', callback_data: 'closeMenu'}]
                    ],
                }
            });
        } catch (error){
            console.log(error);
        }
    })

    bot.onText('📝 Записаться на приём к врачу', async msg => {
        try{
            if (base_menu) {
                await bot.deleteMessage(base_menu.chat.id, base_menu.message_id);
                base_menu = null;
            }
            doctor_menu = await bot.sendPhoto(msg.chat.id, './assets/menu_img_1.jpg', {
                caption: '<b>Выберите специалиста</b>',
                parse_mode: 'HTML',
                reply_markup: {
                    resize_keyboard : true,
                    inline_keyboard: [
                        [{text: 'Стоматолог-терапевт', callback_data: 'terapeft'}],
                        [{text: 'Cтоматолог-хирург', callback_data: 'hirurg'}],
                        [{text: 'Стоматолог-ортопед', callback_data: 'ortoped'}],
                        [{text: 'Стоматолог-гигиенист', callback_data: 'gigienist'}],
                        [{text: 'Стоматолог-пародонтолог', callback_data: 'parodontolog'}],
                        [{text: 'Стоматолог-имплантолог', callback_data: 'implantolog'}],
                        [{text: 'Стоматолог-ортодонт', callback_data: 'ortodont'}],
                        [{text: 'Детский стоматолог', callback_data: 'kid'}],
                        [{text: '❌ Закрыть меню ❌', callback_data: 'closeMenu'}]
                    ],
                }
            });
        } catch(error){
            console.log(error);
        }
    });

    bot.on('callback_query', async (ctx,match) => {
        try {
            const data = ctx.data;

            if (data.includes("month_next")) {
                if (calendar_select) {
                    await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
                    calendar_select = null;
                }

                const newDate = new Date();

                newDate.setMonth(newDate.getMonth() + 1);
                calendar.setDate(newDate);

                let buttons = calendar.generateCalendar();

                calendar_select = await bot.sendMessage(ctx.message.chat.id, "Выберите дату", {
                    reply_markup: buttons,
                });
            } else if (data == "closeMenu"){
                if (doctor_menu) {
                    await bot.deleteMessage(ctx.message.chat.id, doctor_menu.message_id);
                    doctor_menu = null;
                }
                // await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
            } else if (data.includes(".day_calendar")) {
                const date = data.replace(/\..*$/, "");
                if (calendar_select) {
                    await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
                    calendar_select = null;
                }
                if (doctor_menu) {
                    await bot.deleteMessage(ctx.message.chat.id, doctor_menu.message_id);
                    doctor_menu = null;
                }
                console.log(date);
            } else {
                if (calendar_select) {
                    await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
                    calendar_select = null;
                }
                calendar_select = await bot.sendMessage(ctx.message.chat.id, "Выберите дату", {
                    reply_markup: buttons,
                });
            }
        }
        catch(error) {
    
            console.log(error);
    
        }
    });
}

module.exports = ways;