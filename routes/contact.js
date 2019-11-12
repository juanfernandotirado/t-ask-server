const express = require("express");
const router = express.Router();


const { contactHandler } = require('../controllers/contactController.js')

router.post('/', contactHandler)


module.exports.contactRouter = router;