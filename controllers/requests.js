import TelegramBot from 'node-telegram-bot-api';
import telegramCalendar from 'telegram-bot-calendar-lite';
import { get_doctor_type_list, get_schedule_time } from '../db/work_db.js';

const calendar = new telegramCalendar();
const buttons = calendar.generateCalendar();

let base_menu = null;
let doctor_menu = null;
let calendar_select = null;
let doctor_type = null;
let doctors_list = null;
// let doctor_btn = null;
let selected_doctor = null;
let time_list = null;

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
            doctor_menu = await bot.sendPhoto(msg.chat.id, './assets/menu_img_2.jpg', {
                caption: '<b>Выберите специалиста</b>',
                parse_mode: 'HTML',
                reply_markup: {
                    resize_keyboard : true,
                    inline_keyboard: [
                        [{text: 'Стоматолог-терапевт', callback_data: 'Стоматолог-терапевт'}],
                        [{text: 'Cтоматолог-хирург', callback_data: 'Cтоматолог-хирург'}],
                        [{text: 'Стоматолог-ортопед', callback_data: 'Стоматолог-ортопед'}],
                        [{text: 'Стоматолог-гигиенист', callback_data: 'Стоматолог-гигиенист'}],
                        [{text: 'Стоматолог-пародонтолог', callback_data: 'Стоматолог-пародонтолог'}],
                        [{text: 'Стоматолог-имплантолог', callback_data: 'Стоматолог-имплантолог'}],
                        [{text: 'Стоматолог-ортодонт', callback_data: 'Стоматолог-ортодонт'}],
                        [{text: 'Детский стоматолог', callback_data: 'Детский стоматолог'}],
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
                        [{text: 'Стоматолог-терапевт', callback_data: 'Стоматолог-терапевт'}],
                        [{text: 'Cтоматолог-хирург', callback_data: 'Cтоматолог-хирург'}],
                        [{text: 'Стоматолог-ортопед', callback_data: 'Стоматолог-ортопед'}],
                        [{text: 'Стоматолог-гигиенист', callback_data: 'Стоматолог-гигиенист'}],
                        [{text: 'Стоматолог-пародонтолог', callback_data: 'Стоматолог-пародонтолог'}],
                        [{text: 'Стоматолог-имплантолог', callback_data: 'Стоматолог-имплантолог'}],
                        [{text: 'Стоматолог-ортодонт', callback_data: 'Стоматолог-ортодонт'}],
                        [{text: 'Детский стоматолог', callback_data: 'Детский стоматолог'}],
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
                console.log(selected_doctor);

                time_list = await get_schedule_time(selected_doctor);

                if (time_list && time_list.length >0){
                    let mas_time_btn = time_list.map(times => {
                        return [{
                            text: ``,
                            callback_data: ``
                        }];
                    })
                }

            } else if (data.includes("doctor_")) {
                if (selected_doctor) {
                    await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
                    selected_doctor = null;
                }
                selected_doctor = data.replace("doctor_", "");
                if (calendar_select) {
                    await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
                    calendar_select = null;
                }

                calendar_select = await bot.sendMessage(ctx.message.chat.id, `Выберите дату:`, {
                    reply_markup: buttons,
                });

            } else {
                doctor_type = String(ctx.data);
                console.log(doctor_type);
                doctors_list = await get_doctor_type_list(doctor_type);

                
                if (doctors_list && doctors_list.length > 0) {
                    let mas_doctor_btn = doctors_list.map(doctor => {
                        const emoji = doctor.gender_of_the_person === "M" ? "👨‍⚕️" : "👩‍⚕️";
                        return [{
                            text: `${emoji} ${doctor.FIO}`,
                            callback_data: `doctor_${doctor.id}`
                        }];
                    });

                    if (doctor_menu) {
                        await bot.deleteMessage(ctx.message.chat.id, doctor_menu.message_id);
                        doctor_menu = null;
                    }

                    selected_doctor = await bot.sendMessage(ctx.message.chat.id, `${doctor_type}:`,{
                        reply_markup: {
                            resize_keyboard : true,
                            inline_keyboard: mas_doctor_btn,
                        }
                    });
                }

            }
        }
        catch(error) {
            console.log(error);
        }
    });
}

export default ways;