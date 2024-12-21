const express = require("express");
const { orderController } = require("../../controllers/index");
const { authenticationMiddleware } = require("../../middlewares/index");

const router = express.Router();

router.post('/create-payment', authenticationMiddleware.checkAuthentication, orderController.createOrder);

router.post('/:orderId/capture', authenticationMiddleware.checkAuthentication, orderController.executePayment);

router.get('/users/:userId', authenticationMiddleware.checkAuthentication, orderController.getOrdersByUser);

router.get('/events/:eventId', authenticationMiddleware.checkAuthentication, orderController.getOrdersByEvent);

module.exports = router;





