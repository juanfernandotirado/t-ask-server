const {getQuotes} = require('../database/databaseUtils.js')

const quotes = (req, res, next) => {
    getQuotes()
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

exports.quotes = quotes;