const registrationService = require("../services/registrationService");

// Register for an Event
async function registerEvent(req, res) {

    try {

        const studentId = req.user.id;
        const { event_id } = req.body;

        const registration = await registrationService.registerEvent(
            studentId,
            event_id
        );

        res.status(201).json({
            success: true,
            message: "Registration Successful",
            data: registration
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

}

// Get All Registrations
async function getAllRegistrations(req, res) {

    try {

        const registrations = await registrationService.getAllRegistrations();

        res.status(200).json({
            success: true,
            data: registrations
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

// Get Registration By Id
async function getRegistrationById(req, res) {

    try {

        const { id } = req.params;

        const registration = await registrationService.getRegistrationById(id);

        if (!registration) {

            return res.status(404).json({
                success: false,
                message: "Registration Not Found"
            });

        }

        res.status(200).json({
            success: true,
            data: registration
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

// Cancel Registration
async function cancelRegistration(req, res) {

    try {

        const { id } = req.params;

        const deleted = await registrationService.cancelRegistration(id);

        if (!deleted) {

            return res.status(404).json({
                success: false,
                message: "Registration Not Found"
            });

        }

        res.status(200).json({
            success: true,
            message: "Registration Cancelled Successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

module.exports = {

    registerEvent,
    getAllRegistrations,
    getRegistrationById,
    cancelRegistration

};