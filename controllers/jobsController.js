const {getJobCategories, getAllJobsForEachLanguages, getAllJobsForEachLocation} = require('../database/databaseUtils.js')

const jobCategories = (req, res, next) => {

    getJobCategories()
    .then(result => {
        res.send(result)
    })
    .catch(err => {

        if (err) {
            //res.send(err)
            next(err)
        } else {
            res.send('An error has occurred.')
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
            //res.send(err)
            next(err)
        } else {
            res.send('An error has occurred.')
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
            //res.send(err)
            next(err)
        } else {
            res.send('An error has occurred.')
        }
    })


}

exports.jobsLocations = jobsLocations;