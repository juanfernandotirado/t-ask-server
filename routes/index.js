const express = require('express')
const router = express.Router()

const {comparisonRouter} = require("./comparison.js")
const {trendsRouter} = require("./trends.js")
const {quotesRouter} = require("./quotes.js")

router.use('/comparison', comparisonRouter)
router.use('/comparison', trendsRouter)
router.use('/quotes', quotesRouter)

exports.routerIndex = router;