const {getLanguagesLatestCount, getAllTimeSpanByLanguage} = require('../database/databaseUtils.js')

const languages = (req, res, next) => {

    getLanguagesLatestCount()
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

exports.languages = languages;

////////////////////////////////////////////////////////////

const languagesTimeSpans = (req, res, next) => {

    getAllTimeSpanByLanguage()
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

exports.languagesTimeSpans = languagesTimeSpans;