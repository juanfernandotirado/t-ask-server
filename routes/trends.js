const express = require("express");
const router = express.Router();

const {trends} = require('../controllers/trendController.js')


router.get('/trends', trends)

module.exports.trendsRouter = router;