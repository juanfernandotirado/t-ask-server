const {getJobCategories, getAllJobsForEachLanguages, getAllJobsForEachLocation} = require('../database/databaseUtils.js')

const jobCategories = (req, res, next) => {

    getJobCategories()
    .then(result => {
        res.send(result)
    })
    .catch(err => {

        if (err) {
            const e = new Error(err)
            e.status = 500

            next(e)
        } else {
            next(err)
        }
    })


}

exports.jobCategories = jobCategories;

////////////////////////////////////////////////////////////

const jobsLanguages = (req, res, next) => {

    getAllJobsForEachLanguages()
    .then(result => {
        res.send(result)
    })
    .catch(err => {

        if (err) {
            const e = new Error(err)
            e.status = 500

            next(e)
        } else {
            next(err)
        }
    })


}

exports.jobsLanguages = jobsLanguages;

////////////////////////////////////////////////////////////

const jobsLocations = (req, res, next) => {

    getAllJobsForEachLocation()
    .then(result => {
        res.send(result)
    })
    .catch(err => {

        if (err) {
            const e = new Error(err)
            e.status = 500

            next(e)
        } else {
            next(err)
        }
    })


}

exports.jobsLocations = jobsLocations;