
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
            .then(r => {
                next()  //Valid!
            })
            .catch(err => {
                next(401)
            })

    } catch (e) {

        console.log('No token provided!');
        console.log(e);

        next(401)
    }
}