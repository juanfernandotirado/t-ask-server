const { getLanguagesLatestCount, getAllTimeSpanByLanguage } = require('../database/databaseUtils.js')

//Keeping Google Trends code as part of the languagesController:
const { trends } = require('./trendsAPI.js')
exports.trends = trends;

////////////////////////////////////////////////////////////

const languages = (req, res, next) => {

    getLanguagesLatestCount()
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

exports.languages = languages;

////////////////////////////////////////////////////////////

const languagesTimeSpans = (req, res, next) => {

    getAllTimeSpanByLanguage()
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

exports.languagesTimeSpans = languagesTimeSpans;