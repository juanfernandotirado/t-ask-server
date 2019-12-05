const express = require('express')
const router = express.Router()

const {quotesRouter} = require("./quotes.js")
const {userRouter} = require("./user.js")
const {eventsRouter} = require("./events.js")
const {articlesRouter} = require("./articles.js")
const {contactRouter} = require("./contact.js")
const {languagesRouter} = require("./languages.js")
const {jobsRouter} = require("./jobs.js")

router.use('/quotes', quotesRouter)
router.use('/user', userRouter)
router.use('/events', eventsRouter)
router.use('/articles', articlesRouter)
router.use('/contact', contactRouter)
router.use('/languages',languagesRouter)
router.use('/jobs',jobsRouter)


exports.routerIndex = router;