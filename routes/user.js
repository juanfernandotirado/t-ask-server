const express = require("express");
const router = express.Router();

const { createUser, loginUser, getUser } = require('../controllers/userController.js')
const { securityMiddleware } = require('../middlewares/security.js')
const { checkToken } = require('../middlewares/token.js')


router.post('/signup', securityMiddleware, createUser)
router.post('/login', securityMiddleware, loginUser)

//Receives a token in the header, and returns user data.
router.get('/', checkToken, getUser)

module.exports.userRouter = router;