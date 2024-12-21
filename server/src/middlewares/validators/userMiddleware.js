const validator = require("validator");
const { ApiError, errorResponse } = require("../../utils/index");
const { StatusCodes } = require("http-status-codes");

const validateRegisterUserRequest = (req, res, next) => {
  const email = validator.trim(req.body.email);
  if (!validator.isEmail(email)) {
    const error = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      "Something went wrong while registering user",
      "Email is not valid"
    );
    return res
      .status(error.statusCode)
      .json(errorResponse(error.statusCode, error.message, error.explaination));
  }

  const firstName = validator.trim(req.body.firstName);
  if (!validator.isAlpha(firstName)) {
    const error = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      "Something went wrong while registering user",
      "First name is not valid"
    );
    return res
      .status(error.statusCode)
      .json(errorResponse(error.statusCode, error.message, error.explaination));
  }

  const lastName = validator.trim(req.body.lastName);
  if (!validator.isAlpha(lastName)) {
    const error = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      "Something went wrong while registering user",
      "Last name is not valid"
    );
    return res
      .status(error.statusCode)
      .json(errorResponse(error.statusCode, error.message, error.explaination));
  }

  const password = validator.trim(req.body.password);
  if (!validator.isStrongPassword(password)) {
    const error = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      "Something went wrong while registering user",
      "Password is not valid"
    );
    return res
      .status(error.statusCode)
      .json(errorResponse(error.statusCode, error.message, error.explaination));
  }

  const mobile = validator.trim(req.body.mobile);
  if (!validator.isMobilePhone(mobile)) {
    const error = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      "Something went wrong while registering user",
      "Mobile is not valid"
    );
    return res
      .status(error.statusCode)
      .json(errorResponse(error.statusCode, error.message, error.explaination));
  }

  req.body.email = email;
  req.body.firstName = firstName;
  req.body.lastName = lastName;
  req.body.password = password;
  req.body.mobile = mobile;

  next();
};

const validateUpdateUserDetailsRequest = (req, res, next) => {
  const email = validator.trim(req.body.email || "");
  if (!validator.isEmail(email)) {
    const error = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      "Something went wrong while updating user details",
      "Email is not valid"
    );
    return res
      .status(error.statusCode)
      .json(errorResponse(error.statusCode, error.message, error.explaination));
  }

  const firstName = validator.trim(req.body.firstName || "");
  if (!validator.isAlpha(firstName)) {
    const error = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      "Something went wrong while updating user details",
      "First name is not valid"
    );
    return res
      .status(error.statusCode)
      .json(errorResponse(error.statusCode, error.message, error.explaination));
  }

  const lastName = validator.trim(req.body.lastName || "");
  if (!validator.isAlpha(lastName)) {
    const error = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      "Something went wrong while updating user details",
      "Last name is not valid"
    );
    return res
      .status(error.statusCode)
      .json(errorResponse(error.statusCode, error.message, error.explaination));
  }

  req.body.email = email;
  req.body.firstName = firstName;
  req.body.lastName = lastName;

  next();
};

module.exports = {
  validateRegisterUserRequest,
  validateUpdateUserDetailsRequest,
};
