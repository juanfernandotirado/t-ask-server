const express = require("express");
const router = express.Router();

const { trends, languages, languagesTimeSpans} = require('../controllers/languagesController.js')

router.get('/', languages)

////////////////////////////////////////////////////////////////////

router.get('/timespans', languagesTimeSpans)

////////////////////////////////////////////////////////////////////

router.get('/trends', trends)

module.exports.languagesRouter = router;