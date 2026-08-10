jest.mock("../../config/db");

const db = require("../../config/db");
const reportService = require("../reportService");

describe("reportService", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("getEventSummary returns the aggregated rows", async () => {

        const rows = [
            { id: 1, title: "Event A", total_registrations: 3 },
            { id: 2, title: "Event B", total_registrations: 0 }
        ];
        db.query.mockResolvedValueOnce([rows]);

        const result = await reportService.getEventSummary();

        expect(db.query).toHaveBeenCalledWith(expect.stringContaining("LEFT JOIN registrations"));
        expect(result).toEqual(rows);
    });

    test("getStudentsByEvent queries with the given event id and returns rows", async () => {

        const rows = [{ id: 1, name: "Jane", email: "jane@test.com" }];
        db.query.mockResolvedValueOnce([rows]);

        const result = await reportService.getStudentsByEvent(5);

        expect(db.query).toHaveBeenCalledWith(
            expect.stringContaining("WHERE r.event_id = ?"),
            [5]
        );
        expect(result).toEqual(rows);
    });

    test("getStudentSummary returns the joined summary rows", async () => {

        const rows = [{ id: 1, name: "Jane", title: "Event A" }];
        db.query.mockResolvedValueOnce([rows]);

        const result = await reportService.getStudentSummary();

        expect(result).toEqual(rows);
    });

});
