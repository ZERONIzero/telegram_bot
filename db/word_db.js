import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function add_new_user(id) {
    return new Promise((resolve, reject) => {
        open({
            filename: './db/bot.db',
            driver: sqlite3.Database
        }).then(async (db) => {
            try {

                const check_user = await db.all(`
                    SELECT id FROM human WHERE (id_telegram = ?)
                    `,[id]);

                if (check_user && check_user.length>0){
                    resolve("");
                } else {
                    const new_user = await db.all(`
                        INSERT INTO human(id_telegram) VALUES(?)
                    `, [id]);
                    resolve(new_user);
                }
            } catch (error) {
                reject(error);
            }
        }).catch((error) => {
            reject(error);
        });
    });
}


export async function get_doctor_type_list(doctor_type){
    return new Promise((resolve, reject) => {
        open({
            filename: './db/bot.db',
            driver: sqlite3.Database
        }).then(async (db) => {
            try {
                const doctors = await db.all(`
                    SELECT id, FIO, gender_of_the_person FROM doctor WHERE specialty = ?
                `, [doctor_type]);
                resolve(doctors);
            } catch (error) {
                reject(error);
            }
        }).catch((error) => {
            reject(error);
        });
    });
}

export async function get_schedule_time(selected_doctor,date) {
    return new Promise((resolve,reject) => {
        open({
            filename: './db/bot.db',
            driver: sqlite3.Database
        }).then(async (db) => {
            try {
                let schedule_day = await db.all(`
                    SELECT start, end FROM time
                `);

                const busy_time = await db.all(`
                    SELECT start, end FROM zapis 
                    WHERE doctor_id = ? AND date_write = ?
                `, [selected_doctor, date]);

                if (busy_time && busy_time.length > 0) {
                    const available_slots = schedule_day.filter(slot => 
                        !busy_time.some(busy => 
                            busy.start === slot.start && busy.end === slot.end
                        )
                    );
                    resolve(available_slots);
                } else {
                    resolve(schedule_day);
                }
            } catch (error) {
                reject(error);
            }
        }).catch((error) => {
            reject(error);
        });
    });
}

export async function make_zapis (start_time,end_time,doctor_select_id,patient_select_id,date_zapis) {
    return new Promise((resolve, reject) => {
        open({
            filename: './db/bot.db',
            driver: sqlite3.Database
        }).then(async (db) => {
            try {

                const check_zapis_bd = await db.all(`
                    SELECT id FROM zapis WHERE doctor_id = ? AND patient_id = ? AND start = ? AND end = ? AND date_write = ?
                    `,(doctor_select_id,patient_select_id,start_time,end_time,date_zapis));

                if (check_zapis_bd && check_zapis_bd.length >0){
                    reject("");
                } else {
                    const new_zapis = await db.all(`
                        INSERT INTO zapis(doctor_id,patient_id,start,end,date_write) VALUES(?,?,?,?,?)
                    `, [doctor_select_id,patient_select_id,start_time,end_time,date_zapis]);
                    resolve(new_zapis);
                }
            } catch (error) {
                reject(error);
            }
        }).catch((error) => {
            reject(error);
        });
    });
}

export async function get_patient_id(telegram_id) {
    return new Promise((resolve, reject) => {
        open({
            filename: './db/bot.db',
            driver: sqlite3.Database
        }).then(async (db) => {
            try {
                const patient = await db.get(`
                    SELECT id FROM human WHERE id_telegram = ?
                `, [telegram_id]);
                
                if (patient) {
                    resolve(patient.id);
                } else {
                    reject(new Error("Пользователь не найден"));
                }
            } catch (error) {
                reject(error);
            }
        }).catch((error) => {
            reject(error);
        });
    });
}

export async function get_zapis_week(date_day,human_id) {
    return new Promise((resolve, reject) => {
        open({
            filename: './db/bot.db',
            driver: sqlite3.Database
        }).then(async (db) => {
            try {
                const schedule = await db.all(`
                    SELECT start, end, doctor.FIO, doctor.specialty FROM zapis JOIN doctor ON doctor.id=zapis.doctor_id WHERE patient_id = ? AND date_write = ?
                `, [human_id, date_day]);
                
                if (schedule.length > 0) {
                    const results = schedule.map(record => 
                        `<code>Запись 📅 ${date_day} в ⌚ ${record.start} - ${record.end} \n🦷 ${record.specialty} - ${record.FIO}</code>`
                    );
                    resolve(results.join('\n\n'));
                } else {
                    resolve(`Вы не записовались к врачу ⌚ ${date_day}`);
                }
            } catch (error) {
                reject(error);
            }
        }).catch((error) => {
            reject(error);
        });
    });
}
