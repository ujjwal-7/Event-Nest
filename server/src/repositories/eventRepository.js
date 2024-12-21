const { Event, User, Category, Address, Sequelize, Bookmark, Order } = require("../models");
const { logger } = require("../config/index");
const { ApiError } = require("../utils/index");
const db = require('../models');
const { where } = require("sequelize");


const createEvent = async (data, transaction = null) => {

    try {
        const event = await Event.create(data, { transaction: transaction });
        return event;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

const getAllEvents = async ({filter, order, limit, offset, userId}) => {

    const attributes = [
        'id',
        'title',
        'image',
        'hostId',
        'price',
        'startDate',
        'startTime',
        'endDate',
        'endTime',
        [Sequelize.literal('(SELECT COUNT(*) FROM Orders WHERE Orders.eventId = Event.id AND Orders.status = "completed")'), 'orderCount']
      ];
  
      if (userId) {
        attributes.push(
          [Sequelize.literal(`EXISTS(SELECT 1 FROM Bookmarks WHERE Bookmarks.eventId = Event.id AND Bookmarks.userId = ${userId})`), 'isBookmarked']
        );
      } else {
        attributes.push([Sequelize.literal('false'), 'isBookmarked']);
      }

    try {
        const events = await Event.findAll({
            where: {
                ...filter,
                isDeleted: false
            },
            attributes,
            include: [
                { 
                    model: User, 
                    as: 'host', 
                    attributes: ["firstName", "lastName"]
                },
                { 
                    model: Category,
                    as: 'category',
                    attributes: ["name"]
                },
                { 
                    model: Address,
                    as: 'address',
                    attributes: []
                }
            ],
            order,
            offset,
            limit
        });

        return events;

    } catch (error) {
        logger.error(error);
        throw error;
    }
}


const findEvent = async (id, transaction = null) => {
    try {
        const event = await Event.findOne({
            where: {
                id,
                isDeleted: false
            },
            transaction: transaction
        });
        return event;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const getEventDetails = async (eventId) => {
    try {
        const event = await Event.findOne({
            where: {
                id: eventId,
                isDeleted: false
            },
            include: [
                { 
                    model: User, 
                    as: 'host', 
                    attributes: {
                        exclude: ["password", "createdAt", "updatedAt"]
                    } 
                },
                { 
                    model: Category,
                    as: 'category',
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                },
                { 
                    model: Address,
                    as: 'address', 
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                }
            ]
          });
        return event;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

const updateEvent = async (data, eventId, transaction = null) => {
    try {
        const event = await Event.update(
            data, 
            { where: { id:eventId , isDeleted: false} }, {transaction: transaction});
        return event;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

const updateSeats = async (eventId, seats, dec = true, transaction = null) => {
    
    try {
        const event = await Event.findOne({
            where: { id:eventId , isDeleted: false},
            transaction,
            lock: transaction.LOCK.UPDATE,
        });
        if (!event) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Event not found.");
        }
        if(dec) {
            await event.decrement('seats', {by: seats, transaction});
        } else {
            await event.increment('seats', {by: seats, transaction});
        }
       
        return event;

    } catch (error) {
        logger.error(error);
        throw error;
    }
}

const countEvents = async ({filter}) => {
    try {
        const totalEvents = await Event.count({
            where: {
                ...filter,
                isDeleted: false
            },
            include: [
                {
                    model: Category,
                    as: 'category'
                },
                {
                    model: Address,
                    as: 'address'
                }
            ]
        });
        return totalEvents;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}


const getEventAttendees = async (eventId) => {

    try {
        const attendees = await Order.findAll({
          where: { 
            eventId,  
            status: COMPLETED 
          },
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'email']
            }
          ],
          attributes: []
        });
        return attendees;
        
      } catch (error) {
        logger.error(error);
        throw error;
      }
}

const bookmarkEvent = async (userId, eventId) => {

    try {

        const [savedEvent, created] = await Bookmark.findOrCreate({
            where: { userId, eventId }
          });
        return savedEvent;
        
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

const removeBookmarkedEvent = async (filter, transaction = null) => {

    try {

        const result = await Bookmark.destroy({
            where: filter,
            transaction: transaction
        });

        return result;
        
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

const getBookmarkedEvents = async (filter) => {

    try {

        const events = await Bookmark.findAll({
            where: {
                ...filter,
            },
            include: [
                { 
                    model: Event, 
                    as: 'event',
                    attributes: ['id', 'title', 'image', 'hostId', 'price', 'startDate', 'startTime', 'endDate', 'endTime', [Sequelize.literal('(SELECT COUNT(*) FROM Orders WHERE Orders.eventId = Bookmark.eventId AND Orders.status = "completed")'), 'orderCount'], [Sequelize.literal(`EXISTS(SELECT 1 FROM Bookmarks WHERE Bookmarks.userId = ${filter.userId})`), 'isBookmarked']],
                    where: {
                        isDeleted: false 
                    },
                    include: [{ 
                        model: User, 
                        as: 'host', 
                        attributes: ["firstName", "lastName"]
                    }]
                }
            ]
        });

        return events;
        
        
    } catch (error) {
        logger.error(error);
        throw error;
    }

}


module.exports = {
    createEvent,
    getAllEvents,
    getEventDetails,
    findEvent,
    updateEvent,
    updateSeats,
    countEvents,
    getEventAttendees,
    bookmarkEvent,
    removeBookmarkedEvent,
    getBookmarkedEvents
   
}
