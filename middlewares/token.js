
const jwt = require('jsonwebtoken');
const { checkTokenDatabase } = require('../database/databaseUtils.js')

/**
 * iat = issued at == Numeric Date
 * exp = expires at
 * nbf = NotBeforeError (Thrown if current time is before the nbf claim.)
 */
exports.checkToken = (req, res, next) => {

    const token = req.headers['x-access-token'];

    try {
        let verifiedObject = jwt.verify(token, process.env.JWT_SECRET)
        // if (Date.now() < verifiedObject.iat)

        //If reached here, then this is actually a token.
        //Now lets check if its created date in the database (Not with the JWT lib)
        checkTokenDatabase(token)
            .then(user_id => {                
                
                //Valid!
                //Then adds the user_id to the req body:
                req.body.user_id = user_id

                next()
            })
            .catch(err => {
                if (err) {
                    const e = new Error(err)
                    e.status = 401

                    next(e)
                } else {
                    next(err)
                }
            })

    } catch (exception) {

        if (exception) {
            const e = new Error('No token provided!')
            e.status = 401

            next(e)
        } else {
            next(exception)
        }
    }
}