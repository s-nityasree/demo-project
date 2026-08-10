jest.mock("../../config/db");

const db = require("../../config/db");
const registrationService = require("../registrationService");

describe("registrationService.registerEvent", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("throws an error when the event does not exist", async () => {

        db.query.mockResolvedValueOnce([[]]); // event lookup -> not found

        await expect(
            registrationService.registerEvent(1, 999)
        ).rejects.toThrow("Event Not Found");

        expect(db.query).toHaveBeenCalledTimes(1);
    });

    test("throws an error when the student is already registered", async () => {

        db.query
            .mockResolvedValueOnce([[{ id: 1, max_seats: 10 }]]) // event exists
            .mockResolvedValueOnce([[{ id: 55 }]]); // existing registration found

        await expect(
            registrationService.registerEvent(1, 1)
        ).rejects.toThrow("Student Already Registered");

        expect(db.query).toHaveBeenCalledTimes(2);
    });

    test("throws an error when there are no seats available", async () => {

        db.query
            .mockResolvedValueOnce([[{ id: 1, max_seats: 2 }]]) // event exists
            .mockResolvedValueOnce([[]]) // not already registered
            .mockResolvedValueOnce([[{ total: 2 }]]); // seats already full

        await expect(
            registrationService.registerEvent(1, 1)
        ).rejects.toThrow("No Seats Available");

        expect(db.query).toHaveBeenCalledTimes(3);
    });

    test("creates a registration when a seat is available", async () => {

        db.query
            .mockResolvedValueOnce([[{ id: 1, max_seats: 5 }]]) // event exists
            .mockResolvedValueOnce([[]]) // not already registered
            .mockResolvedValueOnce([[{ total: 1 }]]) // seats available
            .mockResolvedValueOnce([{ insertId: 77 }]); // insert result

        const result = await registrationService.registerEvent(10, 1);

        expect(db.query).toHaveBeenNthCalledWith(
            4,
            expect.stringContaining("INSERT INTO registrations"),
            [10, 1]
        );

        expect(result).toEqual({
            id: 77,
            student_id: 10,
            event_id: 1
        });
    });

});

describe("registrationService.getAllRegistrations", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns the joined registration rows", async () => {

        const rows = [{ id: 1, student_name: "Jane", event_title: "Tech Talk" }];
        db.query.mockResolvedValueOnce([rows]);

        const result = await registrationService.getAllRegistrations();

        expect(result).toEqual(rows);
    });

});

describe("registrationService.cancelRegistration", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns false when nothing was deleted", async () => {

        db.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

        const result = await registrationService.cancelRegistration(1);

        expect(result).toBe(false);
    });

    test("returns true when a registration was deleted", async () => {

        db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

        const result = await registrationService.cancelRegistration(1);

        expect(result).toBe(true);
    });

});
