const { Address, Sequelize } = require("../models");
const { logger } = require("../config/index");
const { where, Op } = require("sequelize");


const createAddress = async (data, transaction = null) => {

    try {
        const address = await Address.create(data, { transaction: transaction });
        return address;
     } catch (error) {
         logger.error("error in create address in repo : ", error);
         throw error;
     }
}

const findAddress = async (data, transaction = null) => {

    try {
        const address = await Address.findOne({
            where: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('street')), {
              [Op.like]: data
            })
          });

        return address;
     } catch (error) {
        logger.error("error in find address in repo : ", error);
        throw error;
     }
}


module.exports = {
    createAddress,
    findAddress
}