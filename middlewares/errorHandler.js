module.exports.errorHandler = (err, req, res, next) => {

    res.status(500)
    let response = 'An error has occurred.'

    if (typeof (err) === 'string') {
        response = err
    }

    if (err.status) {
        res.status(err.status)
    }

    if (err.message) {
        response = err.message
    }

    res.send({ message: response })
}
