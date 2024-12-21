
const successResponse = (statusCode, data, message) => {
    
    return {
        success: true,
        statusCode,
        message,
        data
    }
}

module.exports = successResponse;