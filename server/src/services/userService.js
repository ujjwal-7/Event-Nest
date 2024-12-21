const { logger } = require("../config");
const { userRepository } = require("../repositories/index");
const { ApiError, auth } = require("../utils/index");
const { StatusCodes } = require("http-status-codes");

const createUser = async (data) => {
   
    try {
        
        const existingEmail = await userRepository.findUser({email: data.email});
        
        if(existingEmail) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Something went wrong while registering user.", `User with email ${data.email} already exists.`);
        }

        const user = await userRepository.createUser(data);

        return { 
            id: user.id,
            email: user.email,
        };

    } catch (error) {
        if(error instanceof ApiError) {
            throw error;
        }
        
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong.", "Internal server error.");
    }
}

const loginUser = async (data) => {
    
    try {
        
        const user = await userRepository.findUser({email: data.email});

        if(!user) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Something went wrong while logging in user.", "Invalid email or password.");
        }

        const isPasswordValid = await auth.checkPassword(data.password, user.password);

        if(!isPasswordValid) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Something went wrong while logging in user.", "Invalid email or password.");
        }

        const token = auth.generateToken({ id: user.id, email: user.email, timestamp: Date.now() });

        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            token
        };

    } catch (error) {

        if(error instanceof ApiError) {
            throw error;
        }
        
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong.", "Internal server error.");
    }
}

const getProfileDetails = async (userId, authenticatedUserId) => {
   
    try {
        if(userId != authenticatedUserId) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access", "Cannot access someone else profile.")
        }

        const profileDetails = userRepository.getProfileDetails({id: userId});

        return profileDetails;

        
    } catch (error) {

        if(error instanceof ApiError) {
            throw error;
        }
        
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong.", "Internal server error.");
    }
}


const updateProfileDetails = async (userId, authenticatedUserId, data) => {
   
    try {
        if(userId != authenticatedUserId) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access", "Cannot modify someone else profile.")
        }

        const profileDetails = await userRepository.updateProfileDetails(userId, data);
        if(!profileDetails) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access", "Cannot modify someone else profile.");
        }

        const updatedProfileDetails = await userRepository.getProfileDetails({id:userId});
        return updatedProfileDetails;
        
    } catch (error) {

        logger.error(error);
        if(error instanceof ApiError) {
            throw error;
        }
        
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong.", "Internal server error.");
    }
}

module.exports = {
    createUser,
    loginUser,
    getProfileDetails,
    updateProfileDetails
}