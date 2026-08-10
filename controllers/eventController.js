const eventService = require("../services/eventService");

// Create Event
async function createEvent(req, res) {

    try {

        const event = await eventService.createEvent(req.body,req.user.id);

        res.status(201).json({
            success: true,
            message: "Event Created Successfully",
            data: event
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

// Get All Events
async function getAllEvents(req, res) {

    try {

        const events = await eventService.getAllEvents();

        res.status(200).json({
            success: true,
            data: events
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

// Get Event By Id
async function getEventById(req, res) {

    try {

        const { id } = req.params;

        const event = await eventService.getEventById(id);

        if (!event) {

            return res.status(404).json({
                success: false,
                message: "Event Not Found"
            });

        }

        res.status(200).json({
            success: true,
            data: event
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

// Update Event
async function updateEvent(req, res) {

    try {

        const { id } = req.params;

        const updatedEvent = await eventService.updateEvent(id, req.body);

        if (!updatedEvent) {

            return res.status(404).json({
                success: false,
                message: "Event Not Found"
            });

        }

        res.status(200).json({
            success: true,
            message: "Event Updated Successfully",
            data: updatedEvent
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

// Delete Event
async function deleteEvent(req, res) {

    try {

        const { id } = req.params;

        const deleted = await eventService.deleteEvent(id);

        if (!deleted) {

            return res.status(404).json({
                success: false,
                message: "Event Not Found"
            });

        }

        res.status(200).json({
            success: true,
            message: "Event Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
};