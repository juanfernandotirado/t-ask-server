const express = require('express')
const router = express.Router()

const {comparisonRouter} = require("./comparison.js")

router.use('/comparison', comparisonRouter)

exports.routerIndex = router;