const validator = require("validator");
const { errorResponse, ApiError } = require("../../utils/index");
const { StatusCodes } = require("http-status-codes");

const validateCreateCategoryRequest = (req, res, next) => {

    const categoryName = validator.trim(req.body.name);
    if(categoryName === "") {
        const error = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Something went wrong while creating category.", "Category name is not valid");
        return res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
    }

    const categoryDescription = validator.trim(req.body.description || "");
    if(categoryDescription === "") {
        const error = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Something went wrong while creating category.", "Category description is required.");
        return res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
    }
    
    req.body.description = categoryDescription;

    next();

}

module.exports = {
    validateCreateCategoryRequest
}