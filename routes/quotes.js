
const express = require("express");
const router = express.Router();


const { getQuotes } = require('../database/databaseUtils.js')

router.get('/', (req, res) => {

    getQuotes()
        .then(result => {
            res.send(result)

        })

})

module.exports.quotesRouter = router;


///////////////////////////////////////////////////////////////////////

