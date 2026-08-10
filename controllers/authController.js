const authService = require("../services/authService");

async function register(req, res) {

    try {

        const user = await authService.register(req.body);

        res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            data: user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

async function login(req, res) {

    try {

        const user = await authService.login(req.body);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        res.status(200).json({
            success: true,
            message: "Login Successful",
            data: user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

module.exports = {
    register,
    login
};