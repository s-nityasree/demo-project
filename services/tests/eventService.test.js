jest.mock("../../config/db");

const db = require("../../config/db");
const eventService = require("../eventService");

describe("eventService", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("createEvent inserts an event and returns it with a new id", async () => {

        db.query.mockResolvedValueOnce([{ insertId: 7 }]);

        const eventData = {
            title: "Tech Talk",
            description: "A talk about tech",
            event_date: "2026-09-01",
            venue: "Auditorium",
            max_seats: 100
        };

        const result = await eventService.createEvent(eventData, 3);

        expect(db.query).toHaveBeenCalledWith(
            expect.stringContaining("INSERT INTO events"),
            ["Tech Talk", "A talk about tech", "2026-09-01", "Auditorium", 100, 3]
        );

        expect(result).toEqual({
            id: 7,
            title: "Tech Talk",
            description: "A talk about tech",
            event_date: "2026-09-01",
            venue: "Auditorium",
            max_seats: 100,
            created_by: 3
        });
    });

    test("getAllEvents returns all rows from the query", async () => {

        const rows = [{ id: 1, title: "Event A" }, { id: 2, title: "Event B" }];
        db.query.mockResolvedValueOnce([rows]);

        const result = await eventService.getAllEvents();

        expect(db.query).toHaveBeenCalledWith("SELECT * FROM events");
        expect(result).toEqual(rows);
    });

    test("getEventById returns the first matching row", async () => {

        const row = { id: 5, title: "Event C" };
        db.query.mockResolvedValueOnce([[row]]);

        const result = await eventService.getEventById(5);

        expect(db.query).toHaveBeenCalledWith(
            "SELECT * FROM events WHERE id=?",
            [5]
        );
        expect(result).toEqual(row);
    });

    test("getEventById returns undefined when no event matches", async () => {

        db.query.mockResolvedValueOnce([[]]);

        const result = await eventService.getEventById(999);

        expect(result).toBeUndefined();
    });

    test("updateEvent returns null when no rows were affected", async () => {

        db.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

        const result = await eventService.updateEvent(1, {
            title: "x",
            description: "y",
            event_date: "2026-01-01",
            venue: "z",
            max_seats: 10,
            created_by: 1
        });

        expect(result).toBeNull();
    });

    test("updateEvent returns the updated event when a row was affected", async () => {

        db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

        const eventData = {
            title: "Updated Title",
            description: "Updated Desc",
            event_date: "2026-02-02",
            venue: "New Venue",
            max_seats: 50,
            created_by: 2
        };

        const result = await eventService.updateEvent(9, eventData);

        expect(result).toEqual({ id: 9, ...eventData });
    });

    test("deleteEvent returns false when no rows were affected", async () => {

        db.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

        const result = await eventService.deleteEvent(123);

        expect(result).toBe(false);
    });

    test("deleteEvent returns true when a row was deleted", async () => {

        db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

        const result = await eventService.deleteEvent(123);

        expect(db.query).toHaveBeenCalledWith(
            "DELETE FROM events WHERE id=?",
            [123]
        );
        expect(result).toBe(true);
    });

});
