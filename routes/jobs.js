const express = require("express");
const router = express.Router();

const { jobCategories, jobsLanguages, jobsLocations } = require('../controllers/jobsController.js')

router.get('/categories', jobCategories)

////////////////////////////////////////////////////////////////////

router.get('/languages', jobsLanguages)

////////////////////////////////////////////////////////////////////

router.get('/locations', jobsLocations)

module.exports.jobsRouter = router;