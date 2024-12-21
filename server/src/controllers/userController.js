const { logger } = require("../config/index");
const { StatusCodes } = require("http-status-codes");
const { userService } = require("../services/index");
const { successResponse, errorResponse } = require("../utils/index");

const signUpUser = async (req, res) => {

    const { email, firstName, lastName, password, mobile } = req.body;
    
    try {
        const user = await userService.createUser({ email, firstName, lastName, password, mobile });
        res.status(StatusCodes.CREATED).json(successResponse(StatusCodes.CREATED, user, "User created successfully."));
    } catch (error) {
        logger.error(error);
        res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.loginUser({ email, password });
        res.status(StatusCodes.OK).json(successResponse(StatusCodes.OK, user, "User logged in successfully.")); 
    } catch (error) {
        logger.error(error);
        res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
    }
}

const getProfileDetails = async (req, res) => {

    const userId = req.params.userId;
    const authenticatedUserId = req.user.id;
    try {
        const profileDetails = await userService.getProfileDetails(userId, authenticatedUserId);
        res.status(StatusCodes.OK).json(successResponse(StatusCodes.OK, profileDetails, "User profile retrieved successfully."));
    } catch (error) {
        logger.error(error);
        res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
    }
}

const updatedProfileDetails = async (req, res) => {

    const userId = req.params.userId;
    const authenticatedUserId = req.user.id;
    const data = req.body;
    try {
        const profileDetails = await userService.updateProfileDetails(userId, authenticatedUserId, data);
        res.status(StatusCodes.OK).json(successResponse(StatusCodes.OK, profileDetails, "User profile updated successfully."));
    } catch (error) {
        logger.error(error);
        res.status(error.statusCode).json(errorResponse(error.statusCode, error.message, error.explaination));
    }

}


module.exports = {
    signUpUser,
    loginUser,
    getProfileDetails,
    updatedProfileDetails
}
