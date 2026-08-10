const userService = require("../services/userService");

async function getAllUsers(req, res) {

    try {

        const users = await userService.getAllUsers();

        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

async function createUser(req, res) {

    try {

        const user = await userService.createUser(req.body);

        res.status(201).json({
            success: true,
            message: "User Created Successfully",
            data: user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

async function getUserById(req, res) {

    try {

        const { id } = req.params;

        const user = await userService.getUserById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

async function updateUser(req, res) {

    try {

        const { id } = req.params;

        const updatedUser = await userService.updateUser(id, req.body);

        if (!updatedUser) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

async function deleteUser(req, res) {

    try {

        const { id } = req.params;

        const deleted = await userService.deleteUser(id);

        if (!deleted) {

            return res.status(404).json({
                success:false,
                message:"User not found"
            });

        }

        res.status(200).json({
            success:true,
            message:"User deleted successfully"
        });

    } catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

}

module.exports = {
    getAllUsers,
    createUser,getUserById,
    updateUser,
    deleteUser
};