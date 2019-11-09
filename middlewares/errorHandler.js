module.exports.errorHandler = (err, req, res, next) => {

    res.status(500)
    let response = ['An error has occurred.']

    if (typeof (err) === 'string') {
        response = [err]
    }

    if (err.status) {
        res.status(err.status)
    }

    if (err.message) {

        if(typeof (err.message) == 'string'){
            response = [err.message]
        }else{
            response = err.message
        }

    }

    res.send({ messages: response })
}
