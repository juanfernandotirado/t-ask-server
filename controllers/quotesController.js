const {getQuotes} = require('../database/databaseUtils.js')

const quotes = (req, res, next) => {
    getQuotes()
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

exports.quotes = quotes;