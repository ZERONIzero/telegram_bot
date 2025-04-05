import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// export async function get_doctor_type_list(doctor_type){
//     return new Promise((resolve, reject) => {
//         open({
//             filename: './db/bot.db',
//             driver: sqlite3.Database
//         }).then(async (db) => {
//             try {
//                 const doctors = await db.all(`
//                     SELECT id, FIO, gender_of_the_person FROM doctor WHERE specialty = ?
//                 `, [doctor_type]);
//                 resolve(doctors);
//             } catch (error) {
//                 reject(error);
//             }
//         }).catch((error) => {
//             reject(error);
//         });
//     });
// }

// export async function get_schedule_time(selected_doctor) {
//     return new Promise((resolve,reject) => {
//         open({
//             filename: './db/bot.db',
//             driver: sqlite3.Database
//         }).then(async (db) => {
//             // resolve();
//         }).catch((error) => {
//             reject(error);
//         })
//     })
    
// }

open({
    filename: './bot.db',
    driver: sqlite3.Database
}).then(async (db) => {
//     // await db.exec(`
//     //     CREATE TABLE IF NOT EXISTS doctor (
//     //     id INTEGER NOT NULL PRIMARY KEY,
//     //     FIO VARCHAR(250) NOT NULL,
//     //     specialty VARCHAR(250) NOT NULL,
//     //     gender_of_the_person VARCHAR(1),
//     //     telegram_id VARCHAR(50)
//     //     )
//     // `);

//     // await db.exec(`
//     //     CREATE TABLE IF NOT EXISTS human (
//     //     id INTEGER NOT NULL PRIMARY KEY,
//     //     id_telegram INTEGER NOT NULL
//     //     )
//     // `);

//     // await db.exec(`
//     //     CREATE TABLE IF NOT EXISTS time (
//     //     id INTEGER NOT NULL PRIMARY KEY,
//     //     start TIME,
//     //     end TIME
//     //     )
//     // `);
  
//     // const doctors = [
//     //     { id: 1, FIO: 'Крючкова Алиса Робертовна', specialty: 'Стоматолог-терапевт', gender_of_the_person: 'F', telegram_id: '9226569742' },
//     //     { id: 2, FIO: 'Дементьев Андрей Николаевич', specialty: 'Стоматолог-терапевт', gender_of_the_person: 'M', telegram_id: '8831008224' },
//     //     { id: 3, FIO: 'Соловьев Егор Матвеевич', specialty: 'Стоматолог-терапевт', gender_of_the_person: 'M', telegram_id: '3771134459' },
//     //     { id: 4, FIO: 'Румянцева София Артёмовна', specialty: 'Cтоматолог-хирург', gender_of_the_person: 'F', telegram_id: '3650374211' },
//     //     { id: 5, FIO: 'Ильинский Денис Глебович', specialty: 'Cтоматолог-хирург', gender_of_the_person: 'M', telegram_id: '6899859695' },
//     //     { id: 6, FIO: 'Ковалев Даниил Егорович', specialty: 'Cтоматолог-хирург', gender_of_the_person: 'M', telegram_id: '8135218647' },
//     //     { id: 7, FIO: 'Ларионов Михаил Тимофеевич', specialty: 'Стоматолог-ортопед', gender_of_the_person: 'M', telegram_id: '2600297345' },
//     //     { id: 8, FIO: 'Иванова Марта Максимовна', specialty: 'Стоматолог-ортопед', gender_of_the_person: 'F', telegram_id: '1329686409' },
//     //     { id: 9, FIO: 'Козлов Роман Иванович', specialty: 'Стоматолог-ортопед', gender_of_the_person: 'M', telegram_id: '7112585811' },
//     //     { id: 10, FIO: 'Гордеева Василиса Борисовна', specialty: 'Стоматолог-гигиенист', gender_of_the_person: 'F', telegram_id: '2719278999' },
//     //     { id: 11, FIO: 'Семенов Фёдор Андреевич', specialty: 'Стоматолог-гигиенист', gender_of_the_person: 'M', telegram_id: '7229804779' },
//     //     { id: 12, FIO: 'Осипов Евгений Платонович', specialty: 'Стоматолог-гигиенист', gender_of_the_person: 'M', telegram_id: '7459389998' },
//     //     { id: 13, FIO: 'Гончаров Фёдор Фёдорович', specialty: 'Стоматолог-пародонтолог', gender_of_the_person: 'M', telegram_id: '1028874115' },
//     //     { id: 14, FIO: 'Архипова Милана Максимовна', specialty: 'Стоматолог-пародонтолог', gender_of_the_person: 'F', telegram_id: '6930634697' },
//     //     { id: 15, FIO: 'Морозов Фёдор Александрович', specialty: 'Стоматолог-пародонтолог', gender_of_the_person: 'M', telegram_id: '5119011196' },
//     //     { id: 16, FIO: 'Баранов Тимофей Никитич', specialty: 'Стоматолог-имплантолог', gender_of_the_person: 'M', telegram_id: '1213653254' },
//     //     { id: 17, FIO: 'Михайлова Лилия Максимовна', specialty: 'Стоматолог-имплантолог', gender_of_the_person: 'F', telegram_id: '5787749882' },
//     //     { id: 18, FIO: 'Андреев Михаил Тимурович', specialty: 'Стоматолог-имплантолог', gender_of_the_person: 'M', telegram_id: '1666108222' },
//     //     { id: 19, FIO: 'Литвинова Марианна Дмитриевна', specialty: 'Стоматолог-ортодонт', gender_of_the_person: 'F', telegram_id: '7594568304' },
//     //     { id: 20, FIO: 'Коновалова Екатерина Андреевна', specialty: 'Стоматолог-ортодонт', gender_of_the_person: 'F', telegram_id: '6476280161' },
//     //     { id: 21, FIO: 'Сорокин Михаил Матвеевич', specialty: 'Стоматолог-ортодонт', gender_of_the_person: 'M', telegram_id: '1803050024' },
//     //     { id: 22, FIO: 'Мухин Константин Ильич', specialty: 'Детский стоматолог', gender_of_the_person: 'M', telegram_id: '2615012543' },
//     //     { id: 23, FIO: 'Шарова Кира Даниловна', specialty: 'Детский стоматолог', gender_of_the_person: 'F', telegram_id: '5359397484' },
//     //     { id: 24, FIO: 'Серов Артём Никитич', specialty: 'Детский стоматолог', gender_of_the_person: 'M', telegram_id: '5906800107' },
//     //     { id: 25, FIO: 'Панфилов Даниил Андреевич', specialty: 'Детский стоматолог', gender_of_the_person: 'M', telegram_id: '9197560021' },
//     //     { id: 26, FIO: 'Павлов Марк Кириллович', specialty: 'Стоматолог-терапевт', gender_of_the_person: 'M', telegram_id: '9527239821' },
//     //     { id: 27, FIO: 'Дмитриев Даниил Маркович', specialty: 'Стоматолог-терапевт', gender_of_the_person: 'M', telegram_id: '9239671901' },
//     //     { id: 28, FIO: 'Алексеев Семён Максимович', specialty: 'Cтоматолог-хирург', gender_of_the_person: 'M', telegram_id: '8061411995' },
//     //     { id: 29, FIO: 'Никулина Арина Лукинична', specialty: 'Cтоматолог-хирург', gender_of_the_person: 'F', telegram_id: '1347757838' },
//     //     { id: 30, FIO: 'Зайцев Михаил Алексеевич', specialty: 'Стоматолог-ортопед', gender_of_the_person: 'M', telegram_id: '1342744146' },
//     //     { id: 31, FIO: 'Петров Давид Кириллович', specialty: 'Стоматолог-гигиенист', gender_of_the_person: 'M', telegram_id: '7386316698' },
//     //     { id: 32, FIO: 'Никифоров Владислав Дмитриевич', specialty: 'Стоматолог-пародонтолог', gender_of_the_person: 'M', telegram_id: '5493800728' },
//     //     { id: 33, FIO: 'Гурова Ангелина Романовна', specialty: 'Стоматолог-имплантолог', gender_of_the_person: 'F', telegram_id: '3309390764' },
//     //     { id: 34, FIO: 'Калинина Диана Тимофеевна', specialty: 'Стоматолог-ортодонт', gender_of_the_person: 'M', telegram_id: '3366119729' },
//     //     { id: 35, FIO: 'Щербаков Максим Александрович', specialty: 'Cтоматолог-хирург', gender_of_the_person: 'M', telegram_id: '9388695707' },
//     //     { id: 36, FIO: 'Наумов Платон Глебович', specialty: 'Cтоматолог-хирург', gender_of_the_person: 'M', telegram_id: '2504980818' },
//     // ];

//     // for (const doctor of doctors) {
//     //     await db.run(`
//     //     INSERT INTO doctor (id, FIO, specialty, gender_of_the_person, telegram_id)
//     //     VALUES (?, ?, ?, ?, ?)
//     //     `, [doctor.id, doctor.FIO, doctor.specialty, doctor.gender_of_the_person, doctor.telegram_id]);
//     // }

        const time_schedule = [
            {id : 1, start : "10:00", end : "10:30"},
            {id : 2, start : "10:30", end : "11:00"},
            {id : 3, start : "11:00", end : "11:30"},
            {id : 4, start: "11:30", end: "12:00"},
            {id : 5, start : "12:00", end : "12:30"},
            {id : 6, start : "12:30", end : "13:00"},
            {id : 7, start : "13:00", end : "13:30"},
            {id : 8, start : "13:30", end : "14:00"},
            {id : 9, start : "14:00", end : "14:30"},
            {id : 10, start : "14:30", end : "15:00"},
        ];

        for (const times of time_schedule) {
            await db.run(`
                INSERT INTO time(id, start, end)
                VALUES (?, ?, ?)
            `, [times.id, times.start, times.end]);
        }

    // console.log("Данные успешно добавлены в таблицу 'doctor'");

    console.log("Таблица заполнена");

    // const hygienists = await db.all(`
    //     SELECT FIO, gender_of_the_person FROM doctor WHERE specialty = 'Стоматолог-гигиенист'
    // `);

    // console.log("Стоматологи-гигиенисты:", hygienists);


}).catch((error) => {
    console.error("Ошибка:", error);
});
