const { createUserDatabase, loginUserDatabase, saveUserToken } = require('../database/databaseUtils.js')
let jwt = require('jsonwebtoken');

const createUser = (req, res) => {

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
                res.send(err)
            } else {
                res.send('An error has occurred.')
            }
        })

}

exports.createUser = createUser;

//////////////////////////////////////////////////////////////////////

const loginUser = (req, res) => {

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
                res.send(err)
            } else {
                res.send('An error has occurred.')
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