const multer = require("multer");
const { errorResponse, ApiError } = require("../utils/index");
const { StatusCodes } = require("http-status-codes");
const fs = require("fs");
const path = require("path");
const { logger } = require("../config");

const uploadDir = path.join(__dirname, "..", "..", "public", "temp");

if (!fs.existsSync(uploadDir)) {
  
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch (err) {
    logger.error(err);
    throw err;
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype !== "image/jpeg" &&
      file.mimetype !== "image/png" &&
      file.mimetype !== "image/jpg"
    ) {
      return cb(new Error("Only JPEG, JPG and PNG files are allowed"));
    }
    cb(null, true);
  },
}).single("event-image");

const uploadFile = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError || err instanceof Error) {
      const error = new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "validation error",
        err.message
      );
      return res
        .status(error.statusCode)
        .json(
          errorResponse(error.statusCode, error.message, error.explaination)
        );
    } else if (err) {
      const error = new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Something went wrong.",
        "Internal server error."
      );
      return res
        .status(error.statusCode)
        .json(
          errorResponse(error.statusCode, error.message, error.explaination)
        );
    }

    next();
  });
};

module.exports = uploadFile;
