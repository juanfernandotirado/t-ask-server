const express = require("express");
const router = express.Router();


const { eventsSearch } = require('../controllers/eventsController.js')

router.post('/', eventsSearch)


module.exports.eventsRouter = router;