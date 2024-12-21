const { logger } = require("../config");
const { categoryRepository } = require("../repositories/index");
const { ApiError } = require("../utils/index");
const { StatusCodes } = require("http-status-codes");

const createCategory = async (data) => {

    try {
    
        const existingCategory = await categoryRepository.findCategory(data.name);

        if(existingCategory) {
            throw new ApiError(StatusCodes.CONFLICT, "Conflicting resource", "Category already exists");
        }

        const category = await categoryRepository.createCategory(data);
        return category;

    } catch (error) {
        if(error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong.", "Internal server error.");
    }
}

const getAllCategories = async () => {

    try {
        
        const categories = await categoryRepository.getAllCategories();
        return categories;

    } catch (error) {
        if(error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong.", "Internal server error.");
    }

}

module.exports = {
    createCategory,
    getAllCategories
}