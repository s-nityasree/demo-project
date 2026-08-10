jest.mock("../../config/db");

const db = require("../../config/db");
const userService = require("../userService");

describe("userService", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("getAllUsers returns all rows", async () => {

        const rows = [{ id: 1, name: "Jane" }, { id: 2, name: "John" }];
        db.query.mockResolvedValueOnce([rows]);

        const result = await userService.getAllUsers();

        expect(db.query).toHaveBeenCalledWith("SELECT * FROM users");
        expect(result).toEqual(rows);
    });

    test("createUser inserts a user and returns it with a new id", async () => {

        db.query.mockResolvedValueOnce([{ insertId: 10 }]);

        const result = await userService.createUser({
            name: "Jane",
            email: "jane@test.com",
            password: "hashed",
            role: "student"
        });

        expect(db.query).toHaveBeenCalledWith(
            expect.stringContaining("INSERT INTO users"),
            ["Jane", "jane@test.com", "hashed", "student"]
        );

        expect(result).toEqual({
            id: 10,
            name: "Jane",
            email: "jane@test.com",
            role: "student"
        });
    });

    test("getUserById returns the matching row without the password field query", async () => {

        const row = { id: 3, name: "Jane", email: "jane@test.com", role: "student" };
        db.query.mockResolvedValueOnce([[row]]);

        const result = await userService.getUserById(3);

        expect(db.query).toHaveBeenCalledWith(
            expect.stringContaining("SELECT id, name, email, role"),
            [3]
        );
        expect(result).toEqual(row);
    });

    test("getUserById returns undefined when the user does not exist", async () => {

        db.query.mockResolvedValueOnce([[]]);

        const result = await userService.getUserById(999);

        expect(result).toBeUndefined();
    });

    test("updateUser returns null when no rows were affected", async () => {

        db.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

        const result = await userService.updateUser(1, {
            name: "x", email: "y", password: "z", role: "student"
        });

        expect(result).toBeNull();
    });

    test("updateUser returns the updated user when a row was affected", async () => {

        db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

        const result = await userService.updateUser(4, {
            name: "Jane Updated",
            email: "jane2@test.com",
            password: "newhash",
            role: "faculty"
        });

        expect(result).toEqual({
            id: 4,
            name: "Jane Updated",
            email: "jane2@test.com",
            role: "faculty"
        });
    });

    test("deleteUser returns false when no rows were affected", async () => {

        db.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

        const result = await userService.deleteUser(1);

        expect(result).toBe(false);
    });

    test("deleteUser returns true when a row was deleted", async () => {

        db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

        const result = await userService.deleteUser(1);

        expect(result).toBe(true);
    });

});
