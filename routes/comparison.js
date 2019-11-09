const express = require("express");
const router = express.Router();

const { languages, languagesTimeSpans} = require('../controllers/languagesController.js')

const { jobCategories, jobsLanguages, jobsLocations } = require('../controllers/jobsController.js')


router.get('/languages', languages)

////////////////////////////////////////////////////////////////////

router.get('/languages/timespans', languagesTimeSpans)

////////////////////////////////////////////////////////////////////

router.get('/jobs/jobcategories', jobCategories)

////////////////////////////////////////////////////////////////////

router.get('/jobs/languages', jobsLanguages)

////////////////////////////////////////////////////////////////////

router.get('/jobs/locations', jobsLocations)



module.exports.comparisonRouter = router;