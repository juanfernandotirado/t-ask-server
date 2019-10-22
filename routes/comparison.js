const express = require("express");
const router = express.Router();

const { getLanguagesLatestCount } = require('../database/databaseUtils.js')
const { getAllTimeSpanByLanguage } = require('../database/databaseUtils.js')

const { getJobCategories } = require('../database/databaseUtils.js')



router.get('/languages', (req, res) => {

    getLanguagesLatestCount()
        .then(result => {
            res.send(result)
        })
})

////////////////////////////////////////////////////////////////////

router.get('/languages/timespans', (req, res) => {

    getAllTimeSpanByLanguage()
        .then(result => {
            res.send(result)
        })
})

////////////////////////////////////////////////////////////////////

router.get('/jobs/jobcategories', (req, res) => {

    getJobCategories()
        .then(result => {
            res.send(result)
        })
})



module.exports.comparisonRouter = router;