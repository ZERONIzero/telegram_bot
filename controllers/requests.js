import TelegramBot from 'node-telegram-bot-api';
import telegramCalendar from 'telegram-bot-calendar-lite';
import { get_doctor_type_list, get_schedule_time, add_new_user, make_zapis, get_patient_id, get_zapis_week } from '../db/work_db.js';

const calendar = new telegramCalendar();
const buttons = calendar.generateCalendar();

let base_menu = null;
let doctor_menu = null;
let calendar_select = null;
let doctor_type = null;
let doctors_list = null;
let selected_doctor = null;
let time_list = null;
let time_selected = null;
let record_list = null;

function getCurrentWeekDates() {
    let today = new Date();
    let startOfWeek = new Date(today);
    let endOfWeek = new Date(today);

    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));

    const weekDates = [];
    for (let date = startOfWeek; date <= endOfWeek; date.setDate(date.getDate() + 1)) {
        let year = date.getFullYear();
        let month = String(date.getMonth() + 1);
        let day = String(date.getDate()).padStart(2, '0');
        weekDates.push(`${year}-${month}-${day}`);
    }

    return weekDates;
}


function ways(bot){
    bot.onText(/\/start/, async msg => {
        try {
            if (base_menu) {
                await bot.deleteMessage(base_menu.chat.id, base_menu.message_id);
                base_menu = null;
            }
            await bot.sendMessage(msg.chat.id, `Вы запустили бота!`);
            await add_new_user(msg.from.id);
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
            if (base_menu) {
                await bot.deleteMessage(base_menu.chat.id, base_menu.message_id);
                base_menu = null;
            }
            let msgWait = await bot.sendMessage(msg.chat.id, `Бот генерирует ответ...`);
            setTimeout(async () => {
                const latitudeOfRedSquare = 55.753700;
                const longitudeOfReadSquare = 37.621250;

                await bot.editMessageText("г. Москва, ул. Красная площадь, тел: 8(800)-555-35-35", { chat_id: msgWait.chat.id, message_id: msgWait.message_id });
                await bot.sendLocation(msg.chat.id, latitudeOfRedSquare, longitudeOfReadSquare, {reply_to_message_id: msgWait.message_id})
                // await bot.sendMessage(msg.chat.id,"Авторы: Арсен Каракеян, Максим  Овчинников, Марина Королёва");
            },4000);
        } catch(error){
            console.log(error);
        } 
    })

    bot.onText(/\/show_price/, async msg => {
        if (base_menu) {
            await bot.deleteMessage(base_menu.chat.id, base_menu.message_id);
            base_menu = null;
        }
        setTimeout(async () => {
            base_menu = await bot.sendMessage(msg.chat.id, `Выберите нужную функцию`, {
                reply_markup: {
                    keyboard: [
                        ['👶 Цена за услуги детской стоматологии','🤵 Цены за услуги взрослой стоматологии']
                    ],
                    resize_keyboard : true
                }
            })
        },1000);
    });

    bot.onText(/\/my_records/, async msg => {
        if (base_menu) {
            await bot.deleteMessage(base_menu.chat.id, base_menu.message_id);
            base_menu = null;
        }
        let msgWait = await bot.sendMessage(msg.chat.id, `Бот генерирует ответ...`);
        let patient_id = await get_patient_id(msg.from.id);
        let time_mas = getCurrentWeekDates();
        await bot.deleteMessage(msgWait.chat.id, msgWait.message_id);
        for (let len_mas=0; len_mas < time_mas.length; len_mas++){
            let msg_day = await get_zapis_week(time_mas[len_mas],patient_id);
            if (msg_day){
                await bot.sendMessage(msg.chat.id, msg_day, {
                    parse_mode : 'HTML'
                });
            }
        }
    })

    bot.onText('👶 Цена за услуги детской стоматологии', async msg => {
        if (base_menu) {
            await bot.deleteMessage(base_menu.chat.id, base_menu.message_id);
            base_menu = null;
        }
        await bot.sendMessage(msg.chat.id, "<b><i>Детская стоматология</i></b>\n\n" +
            "<b><i>Анестезия</i></b>\n\n" +
            "Анестезия (инфильтрационная) - 350 ₽\n" +
            "Анестезия (апликационная) - 200 ₽\n" +
            "Анестезия (проводниковая) - 450 ₽\n\n" +
            "<b><i>Гигиена и профилактика</i></b>\n\n" +
            "Гигиена (до 14 лет) - 2000 ₽\n" +
            "Герметизация 1 зуба - 650 ₽\n" +
            "Фторирование 1 зуба - 150 ₽\n\n" +
            "<b><i>Дополнительные услуги</i></b>\n\n" +
            "Адаптационный приём - 1000 ₽\n\n"
            , {
            parse_mode : 'HTML'
        }) 
        await bot.sendMessage(msg.chat.id, "<b><i>Лечение зубов</i></b>\n\n" +
            "Лечение кариеса - 3000 ₽\n" +
            "Лечение пульпита - 4500 ₽\n\n" +
            "<b><i>Удаление зубов</i></b>\n\n" +
            "Удаление молочных зубов - 1200 ₽\n\n"+
            "<b><i>Хирургические процедуры</i></b>\n\n" +
            "Уздечка скальпель - 3500 ₽\n"
            ,{
                parse_mode: 'HTML'    
        });
    });

    bot.onText('🤵 Цены за услуги взрослой стоматологии', async msg => {
        if (base_menu) {
            await bot.deleteMessage(base_menu.chat.id, base_menu.message_id);
            base_menu = null;
        }
        await bot.sendMessage(msg.chat.id, "<b><i>Взрослая стоматология</i></b>\n\n" +
            "<b><i>Диагностика и консультация</i></b>\n\n" +
            "Консультация с составлением плана лечения - 900 ₽\n" +
            "Функционально эстетическая диагностика - 8000 ₽\n\n" +
            "<b><i>Лечение зубов</i></b>\n\n" +
            "Лечение кариеса - 4500 ₽\n" +
            "Лечение пульпита - 6500-12000 ₽\n" +
            "Лечение перидонтита - 7000-14000 ₽\n" +
            "Установка стекловолоконного штифта - 4500 ₽\n" +
            "Вкладка - 4500 ₽\n\n" +
            "<b><i>Удаление зубов</i></b>\n\n" +
            "Удаление зуба простое - 2000-3500 ₽\n" +
            "Удаление зуба мудрости (простое) - 3000 ₽\n" +
            "Удаление зуба мудрости (сложное) - 8000 ₽\n" +
            "Удаление зуба сегментированием - 4000-8000 ₽\n\n",{
                parse_mode : 'HTML'
            });

        await bot.sendMessage(msg.chat.id, "<b><i>Протезирование</i></b>\n\n"+
            "Коронка из диоксида циркония с опорой на свой зуб - 17000 ₽\n" +
            "Коронка из металлокерамики с опорой на свой зуб - 12000 ₽\n" +
            "Коронка из диоксида циркония с опорой на имплант премиального сегмента - 45000 ₽\n" +
            "Протез с акриловыми зубами с опорой на титановскую балку (съемный) - 120000 ₽\n" +
            "Протез с акриловыми зубами с опорой на импланты - 150000 ₽\n" +
            "Установка импланта бюджетного сегмента - 27000 ₽\n" +
            "Установка импланта премиального сегмента - 45000 ₽\n" +
            "Коронка из диоксида циркония с опорой на имплант бюджетного сегмента - 27000 ₽\n"+
            "Коронка из металлокермамики с опорой на имплант бюджетного сегмента - 20000 ₽\n"+
            "Временная коронка лабораторная - 5500 ₽\n" +
            "Временная коронка изготовленная прямым способом - 3000 ₽\n" +
            "Снятие коронки - 500 ₽\n\n", {
                parse_mode : 'HTML'
            });
    });

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
            if (base_menu) {
                await bot.deleteMessage(base_menu.chat.id, base_menu.message_id);
                base_menu = null;
            }
            if (doctor_menu) {
                await bot.deleteMessage(doctor_menu.chat.id, doctor_menu.message_id);
                doctor_menu = null;
            }
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

                time_list = await get_schedule_time(selected_doctor,date);

                if (time_list && time_list.length > 0){
                    let mas_time_btn = time_list.map(times => {
                        return [{
                            text: `    ⌛ ${times.start} - ${times.end} ⌛    `,
                            callback_data: `time-added_${times.start}_${times.end}_${selected_doctor}_${date}`
                        }];
                    })

                    time_selected = await bot.sendMessage(ctx.message.chat.id, `Выберите время`,{
                        reply_markup: {
                            resize_keyboard : true,
                            inline_keyboard: mas_time_btn,
                        }
                    });
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

            } else if (data.includes("time-added_")) {
                if (time_selected) {
                    await bot.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
                    time_selected = null;
                }
                let result_mas = String(data).split('_').slice(1);
                let patient_id = await get_patient_id(ctx.from.id);
                let make_zapis_value = await make_zapis(
                    result_mas[0],
                    result_mas[1],
                    result_mas[2],
                    patient_id,
                    result_mas[3]
                );
                
                await bot.sendMessage(ctx.message.chat.id, `Вы записались на время ${result_mas[0]}-${result_mas[1]}`);
            } else if (data.includes("Стоматолог-") || data.includes("Детский")){
                doctor_type = String(ctx.data);
                console.log(doctor_type);
                doctors_list = await get_doctor_type_list(doctor_type);

                if (doctors_list && doctors_list.length > 0) {
                    let mas_doctor_btn = doctors_list.map(doctor => {
                        let emoji = doctor.gender_of_the_person === "M" ? "👨‍⚕️" : "👩‍⚕️";
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