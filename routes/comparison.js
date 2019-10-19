const express = require("express");
const router = express.Router();

const { getLanguagesLatestCount } = require('../database/databaseUtils.js')



router.get('/languages', (req, res) => {

    getLanguagesLatestCount()
        .then(result => {
            res.send(result)
        })
})



module.exports.comparisonRouter = router;