const { User } = require("../models");
const { logger } = require("../config/index");

const createUser = async (data) => {

    try {

       const user = await User.create(data);
       return user;

    } catch (error) {
        logger.error(error);
        throw error;
    }
}

const findUser = async (data) => {

    try {

       const user = await User.findOne({
        where: data });
       
       return user;

    } catch (error) {
        logger.error(error);
        throw error;
        
    }
}


const getProfileDetails = async (data) => {

    try {

       const profileDetails = await User.findOne({
        where: data,
        attributes: ["email", "firstName", "lastName"]
    });
       
       return profileDetails;

    } catch (error) {
        logger.error(error);
        throw error;
        
    }
}


const updateProfileDetails = async (userId, data) => {

    try {
        const user = await User.update(
            data, 
            { where: { id:userId } });
        return user;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

module.exports = {
    createUser,
    findUser,
    getProfileDetails,
    updateProfileDetails
}