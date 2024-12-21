const { logger } = require("../config/index");
const { StatusCodes } = require("http-status-codes");
const { eventService } = require("../services/index");
const { successResponse, errorResponse } = require("../utils/index");
const { auth } = require("../utils/index");

const createEvent = async (req, res) => {

    const { title, description, categoryId, address, price, seats, startDate, endDate, startTime, endTime } = req.body;
    const hostId = req.user.id;
    const imagePath = req.file.path;
    
    try {

        const event = await eventService.createEvent({ title, description, hostId, categoryId, address, imagePath, price, seats, startDate, endDate, startTime, endTime });
        res.status(StatusCodes.CREATED).json(successResponse(StatusCodes.CREATED, event, "Event created successfully."));

    } catch (error) {
        res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
    }
}

const getAllEvents = async (req, res) => {

    try {
        
        const token = req.headers["authorization"]?.split(" ")[1];

        let userId = null;

        if(token) {
            const user = auth.verifyToken(token);
            userId = user.id;
        }
        

        const events = await eventService.getAllEvents(req.query, userId);
        res.status(StatusCodes.OK).json(successResponse(StatusCodes.OK, events, "Events retrieved successfully."));

    } catch (error) {
        logger.info(error);
        res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
    }
}

const getEvent = async (req, res) => {

    const eventId = req.params.eventId;

    try {
        const event = await eventService.getEvent(eventId);
        res.status(StatusCodes.OK).json(successResponse(StatusCodes.OK, event, "Event retrieved successfully."));
    } catch (error) {
        logger.info(error);
        res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
    }
}

const updateEvent = async (req, res) => {

    const hostId = req.user.id;
    const eventId = req.params.eventId;

    try {
        const updatedEvent = await eventService.updateEvent(eventId, hostId, req.body);
        res.status(StatusCodes.OK).json(successResponse(StatusCodes.OK, updatedEvent, "Event updated successfully."));
    } catch (error) {
        logger.info(error);
        res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
    }
}

const updateEventImage = async (req, res) => {
    const imagePath = req.file.path;
    const eventId = req.params.eventId;
    const hostId = req.user.id;

    try {

        const event = await eventService.updateEventImage({ imagePath, eventId, hostId });
        res.status(StatusCodes.CREATED).json(successResponse(StatusCodes.CREATED, event, "Event image updated successfully."));

    } catch (error) {
        logger.info(error);
        res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
    }
}

const getEventsByUser = async (req, res) => {

    const userId = req.params.userId;
    const hostId = req.user.id;
    
    try {
        const events = await eventService.getEventsByUser(userId, hostId, req.query);
        res.status(StatusCodes.OK).json(successResponse(StatusCodes.OK, events, "Event retrieved successfully."));
    } catch (error) {
        logger.info(error);
        res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
    }
}

const getRelatedEvents = async (req, res) => {

    const eventId = req.params.eventId;
    try {
        const events = await eventService.getRelatedEvents(eventId);
        
        res.status(StatusCodes.OK).json(successResponse(StatusCodes.OK, events, "Events retrieved successfully."));
    } catch (error) {
        logger.info(error);
        res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
    }
}

const deleteEvent = async (req, res) => {

    const eventId = req.params.eventId;
    const userId = req.user.id;

    try {
        const deletedEvent = await eventService.deleteEvent(eventId, userId);
        res.status(StatusCodes.OK).json(successResponse(StatusCodes.OK, deletedEvent, "Event deleted successfully."));

    } catch (error) {
        logger.info(error);
        res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
    }
}

const bookmarkEvent = async (req, res) => {

    const eventId = req.params.eventId;
    const userId = req.user.id;

    try {
        const savedEvent = await eventService.bookmarkEvent(userId, eventId);
        res.status(StatusCodes.OK).json(successResponse(StatusCodes.OK, savedEvent, "Event bookmarked successfully."));

    } catch (error) {
        logger.info(error);
        res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
    }
}

const removeBookmarkedEvent = async (req, res) => {

    const eventId = req.params.eventId;
    const userId = req.user.id;

    try {
        const event = await eventService.removeBookmarkedEvent(userId, eventId);
        res.status(StatusCodes.OK).json(successResponse(StatusCodes.OK, event, "Event removed from bookmark successfully."));

    } catch (error) {
        logger.info(error);
        res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
    }
}

const getBookmarkedEvents = async (req, res) => {

    const userId = req.user.id;

    try {
        const events = await eventService.getBookmarkedEvents(userId);
        res.status(StatusCodes.OK).json(successResponse(StatusCodes.OK, events, "Bookmarked events retrieved successfully."));

    } catch (error) {
        logger.info(error);
        res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
    }
}



module.exports = {
  createEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  updateEventImage,
  getEventsByUser,
  getRelatedEvents,
  deleteEvent,
  bookmarkEvent,
  removeBookmarkedEvent,
  getBookmarkedEvents
}
