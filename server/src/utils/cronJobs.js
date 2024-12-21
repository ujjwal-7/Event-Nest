const cron = require('node-cron');
const { orderService } = require("../services/index");
const { logger } = require("../config/index");


const scheduleCancelStaleOrders = () => {
    cron.schedule('*/5 * * * *', async () => {
        try {
            logger.info("Cron job started");
            await orderService.cancelStaleOrders();
            logger.info("Cron job finished");
        } catch (error) {
            logger.error("Cron job error", { error });
        }
    });
};

module.exports = {
    scheduleCancelStaleOrders
}
