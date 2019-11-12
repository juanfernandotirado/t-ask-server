const express = require('express')
const router = express.Router()

const {comparisonRouter} = require("./comparison.js")
const {trendsRouter} = require("./trends.js")
const {quotesRouter} = require("./quotes.js")
const {userRouter} = require("./user.js")
const {eventsRouter} = require("./events.js")

router.use('/comparison', comparisonRouter)
router.use('/comparison', trendsRouter)
router.use('/quotes', quotesRouter)
router.use('/user', userRouter)
router.use('/events', eventsRouter)

exports.routerIndex = router;