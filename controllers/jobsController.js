const { getJobCategories, getAllJobsForEachLanguages, getAllJobsForEachLocation } = require('../database/databaseUtils.js')

//...
//We are storing the latest results for reuse.
//Resets daily or upon server restart.
let cachedJobCategories;
let lastRequestTimePlusOneDay_jobCategories;

let cachedJobLanguages;
let lastRequestTimePlusOneDay_jobsLanguages;

let cachedJobLocations;
let lastRequestTimePlusOneDay_jobsLocations;

//...

const jobCategories = (req, res, next) => {

    //Get latest checked date:
    lastRequestTimePlusOneDay_jobCategories = getUpdatedLastCheckedDate(lastRequestTimePlusOneDay_jobCategories)

    if (lastRequestTimePlusOneDay_jobCategories) {

        //Just send the cached result:
        res.send(cachedJobCategories)

    } else {

        getJobCategories()
            .then(result => {

                //Cache result and save latest date:
                cachedJobCategories = result
                lastRequestTimePlusOneDay_jobCategories = getCurrentDatePlusOneDay()

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

}

exports.jobCategories = jobCategories;

////////////////////////////////////////////////////////////

const jobsLanguages = (req, res, next) => {

    //Get latest checked date:
    lastRequestTimePlusOneDay_jobsLanguages = getUpdatedLastCheckedDate(lastRequestTimePlusOneDay_jobsLanguages)

    if (lastRequestTimePlusOneDay_jobsLanguages) {

        //Just send the cached result:
        res.send(cachedJobLanguages)

    } else {

        getAllJobsForEachLanguages()
            .then(result => {

                //Cache result and save latest date:
                cachedJobLanguages = result
                lastRequestTimePlusOneDay_jobsLanguages = getCurrentDatePlusOneDay()
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

}

exports.jobsLanguages = jobsLanguages;

////////////////////////////////////////////////////////////

const jobsLocations = (req, res, next) => {

    //Get latest checked date:
    lastRequestTimePlusOneDay_jobsLocations = getUpdatedLastCheckedDate(lastRequestTimePlusOneDay_jobsLocations)

    if (lastRequestTimePlusOneDay_jobsLocations) {

        //Just send the cached result:
        res.send(cachedJobLocations)

    } else {
        getAllJobsForEachLocation()
            .then(result => {

                //Cache result and save latest date:
                cachedJobLocations = result
                lastRequestTimePlusOneDay_jobsLocations = getCurrentDatePlusOneDay()

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

}

exports.jobsLocations = jobsLocations;

////////////////////////////////////////////////////////////
// Utils:
////////////////////////////////////////////////////////////

/**
 * Returns a date object plus one day, or the same date parameter,
 * if the date parameter is higher than the current date.
 */
const getUpdatedLastCheckedDate = (lastRequestTimePlusOneDay) => {

    if (lastRequestTimePlusOneDay && lastRequestTimePlusOneDay > new Date()) {
        return getCurrentDatePlusOneDay()
    } else {
        return lastRequestTimePlusOneDay
    }
}

const getCurrentDatePlusOneDay = () => {
    var newDate = new Date()
    newDate = newDate.setDate(newDate.getDate() + 1)

    return newDate;
}