jest.mock("../../config/db");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const db = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authService = require("../authService");

describe("authService.register", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("throws an error if the email already exists", async () => {

        db.query.mockResolvedValueOnce([[{ id: 1, email: "existing@test.com" }]]);

        await expect(
            authService.register({
                name: "Jane",
                email: "existing@test.com",
                password: "secret",
                role: "student"
            })
        ).rejects.toThrow("Email already exists");

        expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    test("hashes the password and inserts a new user", async () => {

        db.query
            .mockResolvedValueOnce([[]]) // no existing user
            .mockResolvedValueOnce([{ insertId: 42 }]); // insert result

        bcrypt.hash.mockResolvedValueOnce("hashed_password");

        const result = await authService.register({
            name: "Jane",
            email: "jane@test.com",
            password: "plainpassword",
            role: "student"
        });

        expect(bcrypt.hash).toHaveBeenCalledWith("plainpassword", 10);

        // Second db.query call is the INSERT - assert it used the hashed password
        expect(db.query).toHaveBeenNthCalledWith(
            2,
            expect.stringContaining("INSERT INTO users"),
            ["Jane", "jane@test.com", "hashed_password", "student"]
        );

        expect(result).toEqual({
            id: 42,
            name: "Jane",
            email: "jane@test.com",
            role: "student"
        });
    });

});

describe("authService.login", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.JWT_SECRET = "test_secret";
    });

    test("throws an error when the email is not found", async () => {

        db.query.mockResolvedValueOnce([[]]);

        await expect(
            authService.login({ email: "nobody@test.com", password: "x" })
        ).rejects.toThrow("Invalid Email or Password");
    });

    test("throws an error when the password does not match", async () => {

        db.query.mockResolvedValueOnce([[{
            id: 1,
            email: "jane@test.com",
            password: "hashed_password",
            role: "student"
        }]]);

        bcrypt.compare.mockResolvedValueOnce(false);

        await expect(
            authService.login({ email: "jane@test.com", password: "wrong" })
        ).rejects.toThrow("Invalid Email or Password");
    });

    test("returns a token and user data on successful login", async () => {

        db.query.mockResolvedValueOnce([[{
            id: 1,
            name: "Jane",
            email: "jane@test.com",
            password: "hashed_password",
            role: "student"
        }]]);

        bcrypt.compare.mockResolvedValueOnce(true);
        jwt.sign.mockReturnValueOnce("signed.jwt.token");

        const result = await authService.login({
            email: "jane@test.com",
            password: "correct"
        });

        expect(jwt.sign).toHaveBeenCalledWith(
            { id: 1, role: "student" },
            "test_secret",
            { expiresIn: "8d" }
        );

        expect(result).toEqual({
            token: "signed.jwt.token",
            user: {
                id: 1,
                name: "Jane",
                email: "jane@test.com",
                role: "student"
            }
        });
    });

});
