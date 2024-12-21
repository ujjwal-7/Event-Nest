const errorResponse = (statusCode, message, explaination) => {
    
    return {
        success: false,
        statusCode,
        message,
        explaination
    }
}

module.exports = errorResponse;