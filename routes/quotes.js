
const express = require("express");
const router = express.Router();


const { quotes } = require('../controllers/quotesController.js')

router.get('/', quotes)

module.exports.quotesRouter = router;


///////////////////////////////////////////////////////////////////////

