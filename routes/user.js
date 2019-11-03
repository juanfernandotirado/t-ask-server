const express = require("express");
const router = express.Router();


const { createUser } = require('../database/databaseUtils.js')
const { loginUser } = require('../database/databaseUtils.js')

router.post('/signup', createUser )

///////////////////////////////////////////////////////////////

router.post('/login', loginUser )

module.exports.userRouter = router;