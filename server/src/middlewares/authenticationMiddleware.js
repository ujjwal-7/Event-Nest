const { auth, ApiError, errorResponse } = require("../utils/index");
const { StatusCodes } = require("http-status-codes");

const checkAuthentication = (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      const error = new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Unauthorized request",
        "Missing token"
      );
      return res
        .status(error.statusCode)
        .json(
          errorResponse(error.statusCode, error.message, error.explaination)
        );
    }

    const user = auth.verifyToken(token);
    req.user = user;

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      const error = new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Unauthorized request",
        "Invalid token"
      );
      return res
        .status(error.statusCode)
        .json(
          errorResponse(error.statusCode, error.message, error.explaination)
        );
    } else {
      const error = new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Something went wrong",
        "Internal server error"
      );
      return res
        .status(error.statusCode)
        .json(
          errorResponse(error.statusCode, error.message, error.explaination)
        );
    }
  }
};

module.exports = {
  checkAuthentication,
};
