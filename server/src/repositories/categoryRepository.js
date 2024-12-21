const { Category, Sequelize } = require("../models");
const { logger } = require("../config/index");
const { where, Op } = require("sequelize");


const createCategory = async (data) => {

    try {

        const category = await Category.create(data);
        return category;
 
     } catch (error) {
         logger.error("error in creating category : ", error);
         throw error;
     }
}


const findCategory = async (data) => {

    try {

        const category = await Category.findOne({
            where: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), {
              [Op.like]: data
            })
          });

        return category;
 
     } catch (error) {
         logger.error("error in creating category : ", error);
         throw error;
     }
}

const getAllCategories = async () => {

    try {

        const categories = await Category.findAll();
        return categories;
 
     } catch (error) {
         logger.error("error in get all categor : ", error);
         throw error;
     }
}

module.exports = {
    createCategory,
    getAllCategories,
    findCategory
}