const express = require("express");
const router = express.Router();

const { createUser, loginUser, getUser } = require('../controllers/userController.js')
const { securityMiddleware } = require('../middlewares/security.js')
const { createUserValidators, loginValidators } = require('../middlewares/validators/userValidators.js')

const { checkToken } = require('../middlewares/token.js')

router.post('/signup', /* securityMiddleware, */ createUserValidators, createUser)

router.post('/login', /* securityMiddleware, */ loginValidators, loginUser)

//Receives a token in the header, and returns user data.
router.get('/', checkToken, getUser)

module.exports.userRouter = router;