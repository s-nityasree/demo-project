const db = require("../config/db");

// Report 1 - Event Summary
async function getEventSummary() {

    const [rows] = await db.query(`
        SELECT
            e.id,
            e.title,
            e.event_date,
            e.venue,
            COUNT(r.id) AS total_registrations
        FROM events e
        LEFT JOIN registrations r
            ON e.id = r.event_id
        GROUP BY
            e.id,
            e.title,
            e.event_date,
            e.venue
    `);

    return rows;

}

// Report 2 - Students Registered for an Event
async function getStudentsByEvent(eventId) {

    const [rows] = await db.query(`
        SELECT
            u.id,
            u.name,
            u.email,
            r.registration_date
        FROM registrations r
        JOIN users u
            ON r.student_id = u.id
        WHERE r.event_id = ?
    `, [eventId]);

    return rows;

}

// Report 3 - Student Summary
async function getStudentSummary() {

    const [rows] = await db.query(`
        SELECT
            u.id,
            u.name,
            u.email,
            e.title,
            e.event_date,
            r.registration_date
        FROM registrations r
        JOIN users u
            ON r.student_id = u.id
        JOIN events e
            ON r.event_id = e.id
        ORDER BY u.name
    `);

    return rows;

}

module.exports = {

    getEventSummary,
    getStudentsByEvent,
    getStudentSummary

};