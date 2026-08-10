const express = require("express");

const router = express.Router();

const eventController = require("../controllers/eventController");
const verifyToken = require('../middleware/authMiddleware')
const authorizeRoles = require('../middleware/roleMiddleware')


// Create Event
router.post("/",  verifyToken,
    authorizeRoles("ADMIN"),eventController.createEvent);

// Get All Events
router.get("/",  verifyToken,eventController.getAllEvents);

// Get Event By Id
router.get("/:id",  verifyToken,eventController.getEventById);

// Update Event
router.put("/:id",  verifyToken,
    authorizeRoles("ADMIN"),eventController.updateEvent);

// Delete Event
router.delete("/:id",  verifyToken,
    authorizeRoles("ADMIN"),eventController.deleteEvent);

module.exports = router;