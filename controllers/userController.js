const { connectionPool } = require('../database/connection.js');

const { createUserDatabase, loginUserDatabase } = require('../database/databaseUtils.js')


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
        .then(user => {
            res.send(user)
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