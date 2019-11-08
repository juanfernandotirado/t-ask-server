const express = require("express");
const router = express.Router();

const { createUser, loginUser } = require('../controllers/userController.js')
const { securityMiddleware } = require('../middlewares/security.js')


router.post('/signup', securityMiddleware, createUser)

router.post('/login', securityMiddleware, loginUser)

module.exports.userRouter = router;