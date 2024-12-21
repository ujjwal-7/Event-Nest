const validator = require("validator");
const { errorResponse, ApiError } = require("../../utils/index");
const { StatusCodes } = require("http-status-codes");

const isValidAddress = (address) => {
    const { street, city, state, postalCode, country } = address;
    return (
        validator.trim(street || "") &&
        validator.trim(city || "") &&
        validator.trim(state || "") &&
        validator.trim(postalCode || "") &&
        validator.trim(country || "")
    );
}

const validateCreateEventRequest = (req, res, next) => {
   
    const title = validator.trim(req.body.title || "");
    if(!validator.isAscii(title)) {
        const error = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Validation error", "Event title is not valid");
        return res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
    }
   
    const description = validator.trim(req.body.description  || "");
    if(!description || description.length < 1) {
        const error = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Validation error", "Event description is not valid");
        return res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
    }

    const categoryId = parseInt(req.body.categoryId);
    if(!categoryId || categoryId < 1) {
        const error = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Validation error", "Event category is not valid");
        return res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
    }

    const price = parseInt(req.body.price);
    if(isNaN(price) || price < 0) {
        const error = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Validation error", "Price is not valid");
        return res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
    }

    const seats = parseInt(req.body.seats);
    if(!seats || seats < 1) {
        const error = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Validation error", "Event seats are not valid");
        return res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
    }

    const startDate = req.body.startDate || "";
    if(!startDate || startDate.length === 0) {
        const error = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Validation error", "Start date is not valid.");
        return res.status(error.statusCode).json({statusCode: error.statusCode, message: error.message, explaination: error.explaination, success: error.success});
    }


    const endDate = req.body.endDate  || "";
    if(!endDate || endDate.length === 0) {
        const error = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Validation error", "End date is not valid");
        return res.status(error.statusCode).json({statusCode: error.statusCode, message: error.message, explaination: error.explaination, success: error.success});
    }

    const startTime = req.body.startTime || "";
    if(!startTime || startTime.length === 0) {
        const error = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Validation error", "Start Time is not valid.");
        return res.status(error.statusCode).json({statusCode: error.statusCode, message: error.message, explaination: error.explaination, success: error.success});
    }

    const endTime = req.body.endTime || "";
    if(!endTime || endTime.length === 0) {
        const error = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Validation error", "End Time is not valid.");
        return res.status(error.statusCode).json({statusCode: error.statusCode, message: error.message, explaination: error.explaination, success: error.success});
    }

    const address = JSON.parse(req.body.address);
    if(!address || !isValidAddress(address)) {
        const error = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Validation error", "Event address is not valid.");
        return res.status(error.statusCode).json({statusCode: error.statusCode, message: error.message, explaination: error.explaination, success: error.success});
    }
    
    req.body.title = title;
    req.body.description = description;
    req.body.startDate = startDate.slice(1, -1);
    req.body.endDate = endDate.slice(1, -1)
    req.body.startTime = startTime;
    req.body.endTime = endTime;
    req.body.address = address,

    next();

}

const validateUpdateEventRequest = (req, res, next) => {

    const title = validator.trim(req.body.title || "");
    if(!validator.isAscii(title)) {
        const error = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Validation error", "Event title is not valid");
        return res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
    }
   
    const description = validator.trim(req.body.description  || "");
    if(!description || description.length < 1) {
        const error = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Validation error", "Event description is not valid");
        return res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
    }

    const categoryId = parseInt(req.body.categoryId);
    if(!categoryId || categoryId < 1) {
        const error = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Validation error", "Event category is not valid");
        return res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
    }

    const price = parseInt(req.body.price);
    if(isNaN(price) || price < 0) {
        const error = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Validation error", "Price is not valid");
        return res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
    }

    const seats = parseInt(req.body.seats);
    if(!seats || seats < 1) {
        const error = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Validation error", "Event seats are not valid");
        return res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
    }

    const startDate = req.body.startDate || "";
    if(!startDate || startDate.length === 0) {
        const error = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Validation error", "Start date is not valid.");
        return res.status(error.statusCode).json({statusCode: error.statusCode, message: error.message, explaination: error.explaination, success: error.success});
    }


    const endDate = req.body.endDate  || "";
    if(!endDate || endDate.length === 0) {
        const error = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Validation error", "End date is not valid");
        return res.status(error.statusCode).json({statusCode: error.statusCode, message: error.message, explaination: error.explaination, success: error.success});
    }

    const startTime = req.body.startTime || "";
    if(!startTime || startTime.length === 0) {
        const error = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Validation error", "Start Time is not valid.");
        return res.status(error.statusCode).json({statusCode: error.statusCode, message: error.message, explaination: error.explaination, success: error.success});
    }

    const endTime = req.body.endTime || "";
    if(!endTime || endTime.length === 0) {
        const error = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Validation error", "End Time is not valid.");
        return res.status(error.statusCode).json({statusCode: error.statusCode, message: error.message, explaination: error.explaination, success: error.success});
    }


    const address = req.body.address;
    if(!address || !isValidAddress(address)) {
        const error = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Validation error", "Event address is not valid.");
        return res.status(error.statusCode).json({statusCode: error.statusCode, message: error.message, explaination: error.explaination, success: error.success});
    }
    
    req.body.title = title;
    req.body.description = description;
    req.body.startDate = startDate;
    req.body.endDate = endDate;
    req.body.startTime = startTime;
    req.body.endTime = endTime;
    req.body.address = address,

    next(); 

}

module.exports = {
   validateCreateEventRequest,
   validateUpdateEventRequest
}


