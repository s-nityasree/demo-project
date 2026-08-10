const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(userData) {

    const { name, email, password, role } = userData;

    // Check whether email already exists
    const [existingUser] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    if (existingUser.length > 0) {
        throw new Error("Email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
        INSERT INTO users(name,email,password,role)
        VALUES(?,?,?,?)
    `;

    const [result] = await db.query(query, [
        name,
        email,
        hashedPassword,
        role
    ]);

    return {
        id: result.insertId,
        name,
        email,
        role
    };

}

async function login(loginData) {

    const { email, password } = loginData;

    const [rows] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    if (rows.length === 0) {
        throw new Error("Invalid Email or Password");
    }

    const user = rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid Email or Password");
    }

    // Generate JWT
    const token = jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "8d"
        }
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };

}

module.exports = {
    register,
    login
}