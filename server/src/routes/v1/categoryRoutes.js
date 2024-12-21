const express = require("express");
const { categoryController } = require("../../controllers/index");
const { categoryMiddleware } = require("../../middlewares/index");

const router = express.Router();


router.post('/create', categoryMiddleware.validateCreateCategoryRequest, categoryController.createCategory);

router.get('/', categoryController.getAllCategories);

module.exports = router;
