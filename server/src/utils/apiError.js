class ApiError extends Error {
    constructor(statusCode, message = "Something went wrong", explaination) {
        super(message); 
        this.statusCode = statusCode;
        this.explaination = explaination;
      }
}

module.exports = ApiError;
