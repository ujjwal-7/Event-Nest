const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { serverConfig } = require("../config/index");

const checkPassword = async (plainPassword, hashedPassword) => {

    try {
        return await bcrypt.compare(plainPassword, hashedPassword);

    } catch (error) {
        throw error;
    }
}

const generateToken = (data) => {

   try {
    const token = jwt.sign(data, serverConfig.JWT_SECRET_KEY);
    return token;
   } catch (error) {
    throw error;
   }
}

const verifyToken = (token) => {

    try {
        const data = jwt.verify(token, serverConfig.JWT_SECRET_KEY);
        return data;
    } catch (error) {
        throw error;
    }

}




module.exports = {
    checkPassword,
    generateToken,
    verifyToken
}