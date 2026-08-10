const express = require("express");

const router = express.Router();

const reportController = require("../controllers/reportController");

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Report 1 - Event Summary
router.get(
    "/event-summary",
    verifyToken,
    authorizeRoles("FACULTY"),
    reportController.getEventSummary
);

// Report 2 - Students Registered for One Event
router.get(
    "/event/:id",
    verifyToken,
    authorizeRoles("FACULTY"),
    reportController.getStudentsByEvent
);

// Report 3 - Student Summary
router.get(
    "/student-summary",
    verifyToken,
    authorizeRoles("FACULTY"),
    reportController.getStudentSummary
);

module.exports = router;