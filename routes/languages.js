const express = require("express");
const router = express.Router();

const { languages, languagesTimeSpans} = require('../controllers/languagesController.js')

const {trends} = require('../controllers/trendController.js')

router.get('/', languages)

////////////////////////////////////////////////////////////////////

router.get('/timespans', languagesTimeSpans)

////////////////////////////////////////////////////////////////////

router.get('/trends', trends)

module.exports.languagesRouter = router;