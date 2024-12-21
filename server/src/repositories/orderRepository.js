const { Order, User } = require("../models");
const { logger } = require("../config/index");
const { enums } = require("../utils/index");
const { PENDING, CANCELLED } = enums.orderStatus;
const { where, Op } = require("sequelize");
const { Event } = require("../models");

const createOrder = async (orderData, transaction = null) => {
    try {
        const order = await Order.create(orderData, { transaction: transaction });
        return order;
    } catch (error) {
        logger.error("error while creating order in repo : ", error);
     throw error;
    }
}

const updateOrder = async (orderId, orderData, transaction = null) => {
    try {
        const event = await Order.update(
            orderData, 
            { where: { orderId } }, { transaction: transaction });
        return event;
    } catch (error) {
        logger.error("Error while updating order in repo ->", error);
        throw error;
    }
}

const findOrder = async (data, transaction = null) => {
     
    try {
        
        const order = await Order.findOne({ where: data }, { transaction: transaction });
        return order;

    } catch (error) {
        logger.error("Error  order repo ->", error);
        throw error;
    }
}


const getAllOrders = async ({filter, order, offset, limit}) => {
    try {
        
        const orders = await Order.findAll({ where: filter,
            include: [
                { 
                    model: Event, 
                    as: 'event', 
                    attributes: ['title']
                },
                { 
                    model: User, 
                    as: 'user', 
                    attributes: ['email', 'firstName', 'lastName']
                }
            ],
            attributes: {
                exclude: ['paymentGatewayOrderId', 'eventId', 'userId']
            },
            order,
            offset,
            limit
         });
        return orders;

    } catch (error) {
        logger.error("Error  order repo ->", error);
        throw error;
    }
}

const findStaleOrders = async (staleThreshold, transaction = null) => {
    try {

        const staleOrders = await Order.findAll({
            where: {
                [Op.and]: [
                    {
                        createdAt: {
                            [Op.lt]: staleThreshold
                        }
                    }, 
                    {
                        status: {
                            [Op.eq]: PENDING
                        }
                    }
                ]
            },
            
        }, {transaction: transaction});

       return staleOrders;
        
    } catch (error) {
        logger.error("Error  order repo ->", error);
        throw error;
    }
}

const countOrders = async (filter) => {
    try {
        const totalOrders = await Order.count({
            where: filter,
        });
        return totalOrders;
    } catch (error) {
        logger.error("Error while counting events in repo ->", error);
        throw error;
    }
}

module.exports = {
    createOrder,
    updateOrder,
    findOrder,
    findStaleOrders,
    getAllOrders,
    countOrders
}
