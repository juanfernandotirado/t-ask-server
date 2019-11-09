const express = require("express");
const router = express.Router();

const { createUser, loginUser } = require('../controllers/userController.js')
const { securityMiddleware } = require('../middlewares/security.js')
const { createUserValidators, loginValidators } = require('../middlewares/validators/userValidators.js')


router.post('/signup', /* securityMiddleware, */createUserValidators, createUser)

router.post('/login', /* securityMiddleware, */ loginValidators, loginUser)

module.exports.userRouter = router;