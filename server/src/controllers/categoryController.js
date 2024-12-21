const { logger } = require("../config/index");
const { StatusCodes } = require("http-status-codes");
const { categoryService } = require("../services/index");
const { errorResponse, successResponse } = require("../utils/index");

const createCategory = async (req, res) => {

    const { name, description } = req.body;

    try {
        const category = await categoryService.createCategory({ name, description });
        res.status(StatusCodes.CREATED).json(successResponse(StatusCodes.CREATED, category, "Category created successfully."));

    } catch (error) {
        logger.error(error);
        res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
    }
}

const getAllCategories = async (req, res) => {

    try {
    
        const categories = await categoryService.getAllCategories();
        res.status(StatusCodes.OK).json(successResponse(StatusCodes.OK, categories, "Category created successfully."));

    } catch (error) {
        logger.error(error);
        res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
    }

}

module.exports = {
    createCategory,
    getAllCategories
}