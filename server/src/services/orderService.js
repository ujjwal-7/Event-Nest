const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require('uuid');
const { serverConfig, logger } = require("../config/index");
const { ApiError, enums, sendEmail } = require("../utils/index");
const { PENDING, COMPLETED, CANCELLED } = enums.orderStatus;
const { orderRepository, eventRepository, userRepository } = require("../repositories/index");
const db = require('../models');
 
const generateAccessToken = async () => {
    try {
      if (!serverConfig.PAYPAL_CLIENT_ID || !serverConfig.PAYPAL_SECRET) {
        throw new Error("MISSING_API_CREDENTIALS");
      }
      const auth = Buffer.from(
        serverConfig.PAYPAL_CLIENT_ID + ":" + serverConfig.PAYPAL_SECRET
      ).toString("base64");
      const response = await fetch(`${serverConfig.PAYPAL_BASE_URL}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
  
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      logger.error(error);
    }
  };


const createOrder = async (order, userId) => {

    const transaction = await db.sequelize.transaction();

    try {

      const event = await eventRepository.findEvent(order.eventId, transaction);

      if(!event) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Something went wrong.", "Event with this id does not exist.");
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
                "Cannot book tickets of an event that has already started or finished."
            );
         }

      if(order.quantity === 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Something went wrong.", "Number of seats cannot be zero.");
      }

      if(order.quantity > event.seats) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Something went wrong.", "Not enough seats available.");
      }

      if(order.price != event.price) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Something went wrong.", "Price does not match."); 
      }

      const totalCost = order.quantity * order.price;

      const orderDbData = {
        orderId: uuidv4(),
        eventId: order.eventId,
        userId,
        quantity: order.quantity,
        totalCost,
      }

      if(totalCost == 0) {
        orderDbData.status = COMPLETED;
        await orderRepository.createOrder(orderDbData, transaction);
        await eventRepository.updateSeats(order.eventId, order.quantity, true, transaction);
        await transaction.commit();

        const user = await userRepository.findUser({id: userId});
        const event = await eventRepository.findEvent(order.eventId);

        const mailDetails = {
          orderId: orderDbData.orderId,
          quantity: orderDbData.quantity,
          totalCost: orderDbData.totalCost,
          eventName: event.title,
        }
  
        sendEmail(user.email, mailDetails);
      
        return orderDbData;
      }

      const accessToken = await generateAccessToken();

      const payload = {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: totalCost,
            },
          },
        ],
      };

      const response = await fetch(`${serverConfig.PAYPAL_BASE_URL}/v2/checkout/orders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        method: "POST",
        body: JSON.stringify(payload),
      });

      const orderData = await response.json();

      if(!orderData.id) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong.", "Error in creating order.");
      }

      orderDbData.status = PENDING;
      orderDbData.paymentGatewayOrderId = orderData.id;
      
      await orderRepository.createOrder(orderDbData, transaction);
      await eventRepository.updateSeats(order.eventId, order.quantity, true, transaction);
      
      await transaction.commit();
      
      return orderDbData;

    } catch (error) {
      logger.error(error);
        await transaction.rollback();
        throw error;
    }    
}

const cancelOrder = async (orderId) => {
 
  const transaction = await db.sequelize.transaction();
  try {

    const order = await orderRepository.findOrder({ orderId }, transaction);
    if(order.status === CANCELLED) {
      await transaction.commit();
      return;
    }
    
    await orderRepository.updateOrder(orderId, { status: CANCELLED }, transaction);
    await eventRepository.updateSeats(order.eventId, order.quantity, false, transaction);

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

const executePayment = async (orderId) => {
  
  const transaction = await db.sequelize.transaction();

  try {
    const order = await orderRepository.findOrder({ paymentGatewayOrderId: orderId }, transaction);
    const createdAt = new Date(order.createdAt);
    const now = new Date();

    if(now - createdAt > (5 * 60 * 1000)) {
      await cancelOrder(orderId);
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Transaction failed: ", "Payment expired.");
    } 

    const accessToken = await generateAccessToken();
    const requestId = uuidv4();
    

    const result = await fetch(`${serverConfig.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': requestId
      }
    });

    const responseJson = await result.json();
    const errorDetail = responseJson?.details?.[0];

    if (errorDetail?.issue === "INSTRUMENT_DECLINED") {

      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "INSTRUMENT_DECLINED");
    } else if (errorDetail) {
      
      await cancelOrder(orderId);
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Transaction failed: ", errorDetail.message);
    }

    await orderRepository.updateOrder(order.orderId, { status: COMPLETED }, transaction);

    await transaction.commit();

    const user = await userRepository.findUser({id: order.userId});
    const event = await eventRepository.findEvent(order.eventId);

    const mailDetails = {
      orderId: order.orderId,
      quantity: order.quantity,
      totalCost: order.totalCost,
      eventName: event.title,
    }
  
    sendEmail(user.email, mailDetails);
    
    return responseJson;

  } catch (error) {

    await transaction.rollback();
    logger.error(error);
    throw error;
  }
};


const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const cancelStaleOrders = async () => {
  const transaction = await db.sequelize.transaction();

  try {
    
    const staleThreshold = new Date(Date.now() - 1000 * 60 * 5); 
    
    const staleOrders = await orderRepository.findStaleOrders(staleThreshold, transaction);

    if (!staleOrders || staleOrders.length === 0) {
      await transaction.commit();
      return;
    }

    const MAX_CONCURRENT_OPERATIONS = 10;
    
    const orderChunks = chunkArray(staleOrders, MAX_CONCURRENT_OPERATIONS);

    for (const orders of orderChunks) {
      await Promise.all(orders.map(async (order) => {
  
        const { eventId, orderId, quantity } = order;

        await orderRepository.updateOrder(orderId, { status: CANCELLED }, transaction);
        await eventRepository.updateSeats(eventId, quantity, false, transaction);
      }));
    }

    await transaction.commit();

  } catch (error) {
    await transaction.rollback();
    logger.error(error);
    throw error;
  }
};

const getOrdersByUser = async (userId, hostId, query) => {

  try {

    if (hostId != userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Unauthorized request.", "You cannot see others events.");
    }

    const page = parseInt(query.page || 1);
    const pageSize = parseInt(query.pageSize || 12);

    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const orders = await orderRepository.getAllOrders({filter: {userId, status: COMPLETED}, order: [['createdAt', 'DESC']], limit, offset});
    const totalPages = Math.ceil(await orderRepository.countOrders({userId, status: COMPLETED}) / pageSize);
    return {orders, totalPages};

  } catch (error) {

      if(error instanceof ApiError) {
          throw error;
      }
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong.", "Internal server error.");
  }
}


const getOrdersByEvent = async (userId, eventId, query) => {

  try {

    const event = await eventRepository.findEvent(eventId);

    if(!event || event.hostId != userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Unauthorized request.", "You cannot see others order details.");
    }
    

    const page = parseInt(query.page || 1);
    const pageSize = parseInt(query.pageSize || 12);

    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const orders = await orderRepository.getAllOrders({filter: {userId, eventId, status: COMPLETED}, order: [['createdAt', 'DESC']], limit, offset});
    const totalPages = Math.ceil(await orderRepository.countOrders({userId, eventId, status: COMPLETED}) / pageSize);
    return {orders, totalPages};

  } catch (error) {

      if(error instanceof ApiError) {
          throw error;
      }
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong.", "Internal server error.");
  }
}


module.exports = {
    createOrder,
    executePayment,
    cancelStaleOrders,
    getOrdersByUser,
    getOrdersByEvent
}
