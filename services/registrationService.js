const db = require("../config/db");

// Register Event
async function registerEvent(studentId, eventId) {

    // 1. Check Event Exists
    const [events] = await db.query(
        "SELECT * FROM events WHERE id = ?",
        [eventId]
    );

    if (events.length === 0) {
        throw new Error("Event Not Found");
    }

    // 2. Check Already Registered
    const [existing] = await db.query(
        `SELECT * FROM registrations
         WHERE student_id = ? AND event_id = ?`,
        [studentId, eventId]
    );

    if (existing.length > 0) {
        throw new Error("Student Already Registered");
    }

    // 3. Check Seats Available
    const [count] = await db.query(
        `SELECT COUNT(*) AS total
         FROM registrations
         WHERE event_id = ?`,
        [eventId]
    );

    if (count[0].total >= events[0].max_seats) {
        throw new Error("No Seats Available");
    }

    // 4. Insert Registration
    const [result] = await db.query(
        `INSERT INTO registrations(student_id,event_id)
         VALUES(?,?)`,
        [studentId, eventId]
    );

    return {

        id: result.insertId,
        student_id: studentId,
        event_id: eventId

    };

}

// Get All Registrations
async function getAllRegistrations() {

    const [rows] = await db.query(`
        SELECT
            r.id,
            u.name AS student_name,
            e.title AS event_title,
            r.registration_date
        FROM registrations r
        JOIN users u
            ON r.student_id = u.id
        JOIN events e
            ON r.event_id = e.id
    `);

    return rows;

}

// Get Registration By Id
async function getRegistrationById(id) {

    const [rows] = await db.query(
        `
        SELECT
            r.id,
            u.name AS student_name,
            e.title AS event_title,
            r.registration_date
        FROM registrations r
        JOIN users u
            ON r.student_id = u.id
        JOIN events e
            ON r.event_id = e.id
        WHERE r.id = ?
        `,
        [id]
    );

    return rows[0];

}

// Cancel Registration
async function cancelRegistration(id) {

    const [result] = await db.query(
        "DELETE FROM registrations WHERE id = ?",
        [id]
    );

    return result.affectedRows > 0;

}

module.exports = {

    registerEvent,
    getAllRegistrations,
    getRegistrationById,
    cancelRegistration

};