const express = require('express')
const router = express.Router()

const {comparisonRouter} = require("./comparison.js")
const {trendsRouter} = require("./trends.js")

router.use('/comparison', comparisonRouter)
router.use('/comparison', trendsRouter)

exports.routerIndex = router;