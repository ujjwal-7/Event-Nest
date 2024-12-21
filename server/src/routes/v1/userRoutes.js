const express = require("express");
const { userController } = require("../../controllers/index");
const { userMiddleware, authenticationMiddleware } = require("../../middlewares/index");


const router = express.Router();

router.post('/register', userMiddleware.validateRegisterUserRequest, userController.signUpUser);

router.post('/login', userController.loginUser);

router.get('/:userId/profile', authenticationMiddleware.checkAuthentication, userController.getProfileDetails);

router.put('/:userId/profile', authenticationMiddleware.checkAuthentication, userMiddleware.validateUpdateUserDetailsRequest, userController.updatedProfileDetails);

module.exports = router;

