const express = require("express");
const router = express.Router();


const { articlesSearch } = require('../controllers/articlesController.js')

router.post('/', articlesSearch)


module.exports.articlesRouter = router;