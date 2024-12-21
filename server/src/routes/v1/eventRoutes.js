const express = require("express");
const { eventController } = require("../../controllers/index");
const { eventMiddleware, authenticationMiddleware, uploadFile } = require("../../middlewares/index");

const router = express.Router();

router.get('/', eventController.getAllEvents);

router.get('/bookmarks', authenticationMiddleware.checkAuthentication, eventController.getBookmarkedEvents);

router.get('/:eventId', eventController.getEvent);

router.post('/create', authenticationMiddleware.checkAuthentication, uploadFile, eventMiddleware.validateCreateEventRequest, eventController.createEvent);

router.put('/update/:eventId', authenticationMiddleware.checkAuthentication, eventMiddleware.validateUpdateEventRequest, eventController.updateEvent);

router.put('/event-image/:eventId', authenticationMiddleware.checkAuthentication, uploadFile, eventController.updateEventImage);

router.get('/hosts/:userId', authenticationMiddleware.checkAuthentication, eventController.getEventsByUser);

router.get('/related-events/:eventId', eventController.getRelatedEvents);

router.delete('/:eventId/delete', authenticationMiddleware.checkAuthentication, eventController.deleteEvent);

router.post('/:eventId/bookmark', authenticationMiddleware.checkAuthentication, eventController.bookmarkEvent);

router.delete('/:eventId/bookmark', authenticationMiddleware.checkAuthentication, eventController.removeBookmarkedEvent);


module.exports = router;