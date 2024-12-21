const userMiddleware = require("./validators/userMiddleware");
const categoryMiddleware = require("./validators/categoryMiddleware");
const eventMiddleware = require("./validators/eventMiddleware");
const authenticationMiddleware = require("./authenticationMiddleware");
const uploadFile = require("./multerMiddleware");

module.exports = {
  userMiddleware,
  categoryMiddleware,
  eventMiddleware,
  authenticationMiddleware,
  uploadFile,
};
