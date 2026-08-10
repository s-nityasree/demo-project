const reportService = require("../services/reportService");

// Event Summary
async function getEventSummary(req, res) {

    try {

        const report = await reportService.getEventSummary();

        res.status(200).json({
            success: true,
            data: report
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

// Students Registered For One Event
async function getStudentsByEvent(req, res) {

    try {

        const { id } = req.params;

        const report = await reportService.getStudentsByEvent(id);

        res.status(200).json({
            success: true,
            data: report
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

// Student Summary
async function getStudentSummary(req, res) {

    try {

        const report = await reportService.getStudentSummary();

        res.status(200).json({
            success: true,
            data: report
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

module.exports = {

    getEventSummary,
    getStudentsByEvent,
    getStudentSummary

};