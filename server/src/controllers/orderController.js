const { StatusCodes } = require("http-status-codes");
const { orderService } = require("../services/index");
const { successResponse, errorResponse } = require("../utils/index");
const { logger } = require("../config");

const createOrder = async (req, res) => {
  try {
    
    const { order } = req.body;
    const userId = req.user.id;
    const data = await orderService.createOrder(order, userId);
    res.status(StatusCodes.CREATED).json(successResponse(StatusCodes.OK, data, "Order created successfully."));
  
  } catch (error) {
    logger.error(error);
    res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
  }
}


const executePayment = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const result = await orderService.executePayment(orderId);
   
    res.status(StatusCodes.CREATED).json(successResponse(StatusCodes.OK, result, "Transaction successfull."));
   
  } catch (error) {
    logger.error(error);
    res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
  }
}


const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const hostId = req.user.id;

    const orders = await orderService.getOrdersByUser(userId, hostId, req.query);
   
    res.status(StatusCodes.CREATED).json(successResponse(StatusCodes.OK, orders, "Orders retieved."));
   
  } catch (error) {
    logger.error(error);
    res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
  }
}

const getOrdersByEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user.id;

    const orders = await orderService.getOrdersByEvent(userId, eventId, req.query);
   
    res.status(StatusCodes.CREATED).json(successResponse(StatusCodes.OK, orders, "Orders retieved."));
   
  } catch (error) {
    logger.error(error);
    res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
  }
}


module.exports = {
  createOrder,
  executePayment,
  getOrdersByUser,
  getOrdersByEvent
};
