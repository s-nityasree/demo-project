const express = require("express");

const router = express.Router();

const registrationController = require("../controllers/registrationController");

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post(
    "/",
    verifyToken,
    authorizeRoles("STUDENT"),
    registrationController.registerEvent
);

router.get(
    "/",
    verifyToken,
    registrationController.getAllRegistrations
);

router.get(
    "/:id",
    verifyToken,
    registrationController.getRegistrationById
);

router.delete(
    "/:id",
    verifyToken,
    authorizeRoles("STUDENT"),
    registrationController.cancelRegistration
);

module.exports = router;