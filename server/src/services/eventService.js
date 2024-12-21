const { logger } = require("../config");
const { serverConfig } = require("../config/index");
const db = require('../models');
const { v4: uuidv4 } = require('uuid');
const event = require("../models/event");
const { findEvent } = require("../repositories/eventRepository");
const { eventRepository, addressRepository, userRepository } = require("../repositories/index");
const { ApiError, uploadFileOnS3, updateEventImageUrls, invalidateCloudFrontDistribution, deleteFileFromS3 } = require("../utils/index");
const { StatusCodes } = require("http-status-codes");
const { where, Op } = require("sequelize");

const createEvent = async (data) => {

   const { title, description, hostId, categoryId, address, imagePath, price, seats, startDate, endDate, startTime, endTime } = data;

   try {
    const transaction = await db.sequelize.transaction();

    const user = await userRepository.findUser({id: hostId})
    if(!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Something went wrong.", "Host not found.");
    }


    const key = uuidv4();
    await uploadFileOnS3(imagePath, key);

    let addressId;
    const existingAddress = await addressRepository.findAddress(address.street, transaction);

    if(existingAddress) {
        addressId = existingAddress.id;
    } else {
        const newAddress = await addressRepository.createAddress(address, transaction);
        addressId = newAddress.id;
    }
    
    const event = await eventRepository.createEvent({ title, description, image: key, hostId, categoryId, addressId, price, seats, startDate, endDate, startTime, endTime }, transaction);

    await transaction.commit();

    return event;

   } catch (error) {
    await transaction.rollback();
    logger.error(error.sql);
    throw error;
   }
}


const getAllEvents = async (query, userId) => {

    try {

        const filter = {};
        const search = query.search;

        if (search) {
            filter[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { '$address.city$': { [Op.like]: `%${search}%`} },
                { '$address.state$': { [Op.like]: `%${search}%` } },
                { '$address.country$': { [Op.like]: `%${search}%` } },
                { '$category.name$': { [Op.like]: `%${search}%` } }
            ];
        }

        if (!isNaN(search)) {
            filter[Op.or].push({ hostId: parseInt(search) });
        }
        
        const categories = query.categories;
        if(categories) {
            const categoriesArray = categories.split(',').map(category => category.trim());
            filter[Op.and] = filter[Op.and] || [];
            filter[Op.and].push({
                '$category.name$': { [Op.in]: categoriesArray }
            });
        }
        
        const order = [];
        if(query.price) {
            order.push(["price", query.price == 'desc' ? 'DESC' : 'ASC']);
        }

        if(query.date) {
            order.push(["startDate", query.date == 'desc' ? 'DESC' : 'ASC']);
        }

        const page = parseInt(query.page || 1);
        const pageSize = parseInt(query.pageSize || 12);

        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        const events = await eventRepository.getAllEvents({filter, order, limit, offset, userId});

        const totalPages = Math.ceil(await eventRepository.countEvents({filter}) / pageSize);

        await updateEventImageUrls(events);

        return {events, totalPages};

    } catch (error) {
        logger.error(error);
        if(error instanceof ApiError) {
            throw error;
        }
        
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong.", "Internal server error.");
    }
}


const getEvent = async (eventId) => {

    try {
 
        const event = await eventRepository.getEventDetails(eventId);
        if(!event) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Something went wrong", "Event does not exist.");
        }
        
        event.image =  `${serverConfig.CLOUDFRONT_DISTRIBUTION}/${event.image}`;

        return event;

    } catch (error) {
        
        logger.error(error);

        if(error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong.", "Internal server error.");
    }
}

const updateEvent = async (eventId, hostId, data) => {

    const transaction = await db.sequelize.transaction();
  
    try {
      if (!eventId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Event ID is required.", "Please provide a valid event ID.");
      }
  
      const event = await eventRepository.findEvent(eventId, transaction);
  
      if (!event) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Event not found.", "No event found with the provided ID.");
      }
      
      if (event.hostId != hostId) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized request.", "You are not allowed to modify this event.");
      }
  
      let addressId = event.addressId;
  
      if (data.address) {
        const existingAddress = await addressRepository.findAddress(data.address.street, transaction);
  
        if (existingAddress) {
          addressId = existingAddress.id;
        } else {
          const newAddress = await addressRepository.createAddress(data.address, transaction);
          addressId = newAddress.id;
        }
      }
  
      const newEventData = {
        ...data,
        addressId
      };

        event.set({
        ...newEventData
      })

      await event.save({ transaction });

      await transaction.commit();
  
      const updatedEvent = await eventRepository.findEvent(eventId);
      
      return updatedEvent;
  
    } catch (error) {
      if (transaction) await transaction.rollback();
      logger.error(error);
  
      if (error instanceof ApiError) {
        throw error;
      }
  
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error.", "Something went wrong while updating the event.");
    }
  };
  

const updateEventImage = async (data) => {

    const { imagePath, eventId, hostId } = data;
    const transaction = await db.sequelize.transaction();

    try {
     
 
     const event = await eventRepository.findEvent(eventId, transaction);
     if(!event) {
         throw new ApiError(StatusCodes.NOT_FOUND, "Something went wrong.", "Event not found.");
     }

     if(hostId != event.hostId) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized request.", "You cannot modify others events.");
     }
     
     await deleteFileFromS3(event.image);
     await invalidateCloudFrontDistribution(event.image);

     const newKey = uuidv4();
     await uploadFileOnS3(imagePath, newKey);

     event.set({
        image: newKey
     });

     await event.save();

     await transaction.commit();
     return event;
 
    } catch (error) {
     await transaction.rollback();
     logger.error(error.sql);
     throw error;
    }
}

const getEventsByUser = async (userId, hostId, query) => {

    try {

        if (hostId != userId) {
            throw new ApiError(StatusCodes.FORBIDDEN, "Unauthorized request.", "You cannot see others events.");
        }

        const page = parseInt(query.page || 1);
        const pageSize = parseInt(query.pageSize || 12);

        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        const events = await eventRepository.getAllEvents({filter: { hostId: userId},
            order: [['startDate', 'DESC']], limit, offset});
        
        const totalPages = Math.ceil(await eventRepository.countEvents({filter: {hostId: userId}}) / pageSize);

        await updateEventImageUrls(events);

        return {events, totalPages};

    } catch (error) {
        logger.error(error);

        if(error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong.", "Internal server error.");
    }

}

const getRelatedEvents = async (eventId) => {

    try {
        
        const event = await eventRepository.getEventDetails(eventId);
        if(!event) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Something went wrong", "Event does not exists");
        }

        const relatedEvents = await eventRepository.getAllEvents({filter: { categoryId: event.categoryId, id: {[Op.ne]: eventId} },
            order: [['startDate', 'DESC']],
            limit: 4,
            offset: 0});
        
        return relatedEvents;

    } catch (error) {
        logger.error(error);

        if(error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong.", "Internal server error.");
    }
}

const deleteEvent = async (eventId, userId) => {

    try {

        if (!eventId) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Event ID is required.", "Please provide a valid event ID.");
          }
      
          const event = await eventRepository.findEvent(eventId);
      
          if (!event) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Event not found.", "No event found with the provided ID.");
          }
        
          if (event.hostId != userId) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized request.", "Cannot delete this event.");
          }

          const startDate = event.startDate;
          const startTime = event.startTime;

          const currentDateTime = new Date();
          const [hours, minutes, seconds] = startTime.split(':').map(Number);

         startDate.setUTCHours(hours, minutes, seconds);

          if (currentDateTime > startDate) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                "Event has already started or finished.",
                "You cannot delete an event that has already started or finished."
            );
         }
          
          event.set({
            isDeleted: true
         });


         await event.save();
         await eventRepository.removeBookmarkedEvent({userId, eventId});

         return {eventId};
    
    } catch (error) {
        
        logger.error(error);

        if(error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong.", "Internal server error.");
    }
}

const bookmarkEvent = async(userId, eventId) => {
    
    try {

        if (!eventId) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Event ID is required.", "Please provide a valid event ID.");
          }

          const event = await eventRepository.findEvent(eventId);
      
          if (!event) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Event not found.", "No event found with the provided ID.");
          }

          const savedEvent = await eventRepository.bookmarkEvent(userId, eventId);
          return savedEvent;
        
    } catch (error) {
        
        logger.error(error);

        if(error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong.", "Internal server error.");
    }
}


const removeBookmarkedEvent = async(userId, eventId) => {
    
    try {

        if (!eventId) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Event ID is required.", "Please provide a valid event ID.");
          }

          const event = await eventRepository.findEvent(eventId);
      
          if (!event) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Event not found.", "No event found with the provided ID.");
          }

          const result = await eventRepository.removeBookmarkedEvent({userId, eventId});
          return {eventId};
        
    } catch (error) {
        
        logger.error(error);

        if(error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong.", "Internal server error.");
    }
}


const getBookmarkedEvents = async (userId) => {

    try {

        if(!userId) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "User id is required.", "Please provide a valid user id.");
        }

        const events = await eventRepository.getBookmarkedEvents({userId});
        const bookmarkedEvents = events.map((event) => {
            return event.event;
        })

        await updateEventImageUrls(bookmarkedEvents);

        return bookmarkedEvents;
        
    } catch (error) {
        
        logger.error(error);

        if(error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong.", "Internal server error.");
    }
}


module.exports = {
    createEvent,
    getAllEvents,
    getEvent,
    updateEvent,
    getEventsByUser,
    getRelatedEvents,
    updateEventImage,
    deleteEvent,
    bookmarkEvent,
    removeBookmarkedEvent,
    getBookmarkedEvents
}
