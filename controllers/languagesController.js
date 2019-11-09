const {getLanguagesLatestCount, getAllTimeSpanByLanguage} = require('../database/databaseUtils.js')

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