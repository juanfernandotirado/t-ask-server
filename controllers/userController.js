const { validationResult } = require('express-validator');
const { createUserDatabase, loginUserDatabase, saveUserToken, getUserDatabase } = require('../database/databaseUtils.js')

let jwt = require('jsonwebtoken');

const getUser = (req, res, next) => {
    const user_id = req.body.user_id;

    if (user_id) {

        getUserDatabase(user_id)
            .then(r => {
                res.send(r)
            })
            .catch(err => {
                const e = new Error(err)
                e.status = 401
                next(e)
            })

    } else {
        const e = new Error('User not found.')
        e.status = 401
        next(e)
    }
}

module.exports.getUser = getUser

const createUser = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        let error = new Error();

        error.status = 422;

        let newdata = errors.array().map(item => {
            return item.msg
        });

        error.message = newdata;

        next(error);
    }

    let newUserName = req.body.name
    let newUserEmail = req.body.email
    let newUserPassword = req.body.password
    let userLanguagesArray = req.body.languages

    createUserDatabase(
        newUserName,
        newUserEmail,
        newUserPassword,
        userLanguagesArray,
    )
        .then(createToken)

        .then(r => {
            res.send(r)
        })
        .catch(err => {

            if (err) {
                const e = new Error(err)
                e.status = 422

                next(e)
            } else {
                next(err)
            }
        })

}

exports.createUser = createUser;

//////////////////////////////////////////////////////////////////////

const loginUser = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        let error = new Error();

        error.status = 422;

        let newdata = errors.array().map(item => {
            return item.msg
        });

        error.message = newdata;

        next(error);
    }


    let userEmail = req.body.email
    let userPassword = req.body.password

    loginUserDatabase(userEmail, userPassword)
        .then(createToken)
        .then(saveUserToken)
        .then(userWithToken => {

            res.send(userWithToken)
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
}

exports.loginUser = loginUser;

//////////////////////////////////////////
// Utils:
//////////////////////////////////////////

const createToken = (user) => {
    return new Promise((resolve, reject) => {

        //As of now, we are managing token validation on the database.

        // let obj = {
        //     exp: Math.floor(Date.now() / 1000) + (60 * 60), //Expires in 1h:
        //     data: user
        // }

        let token = jwt.sign(user, process.env.JWT_SECRET);
        user.token = token

        resolve(user)
    })
}