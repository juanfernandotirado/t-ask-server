const { connectionPool } = require('../database/connection.js');

const mysql = require('mysql')


const createUser = (req, res) => {

    let newUserName = req.body.name
    let newUserEmail = req.body.email
    let newUserPassword = req.body.password
    let userLanguagesArray = req.body.languages

    const insertNewUser = () => {

        return new Promise((resolve, reject) => {

            let sql = `INSERT INTO Users (name, email, password) 
            VALUES (${mysql.escape(newUserName)}, ${mysql.escape(newUserEmail)}, ${mysql.escape(newUserPassword)})
            ;`

            if (newUserEmail == '' || newUserPassword == '') {

                res.status(400).send('Error: Please Provide an Email and a Password')

            } else {

                connectionPool.query(sql, (error, result) => {
                    if (error) {

                        res.send('Error:' + error)
                        
                        reject()

                    } else {

                        res.send('New User Name:' + newUserName + ', New User Email: ' + newUserEmail + ', New User Password: ' + newUserPassword + ', Favorite Languages: ' + userLanguagesArray)

                        resolve()
                    }

                })

            }

        })

    }

    let languagesArray = []
    let CreatedUserId

    const getAllLanguages = () => {

        return new Promise((resolve, reject) => {

            let sql = `SELECT * 
            FROM Languages
            ;`

            connectionPool.query(sql, (error, result) => {
                if (error) {
                    res.send(error)
                    reject()

                } else {

                    languagesArray = result
                    console.log('Languages Selected!!!');

                    resolve(result)

                    //console.log(languagesArray);

                }

            })

        })

    }

    const getCreatedUserId = () => {

        return new Promise((resolve, reject) => {

            let sql = `SELECT id_user 
            FROM Users
            WHERE email = ${mysql.escape(newUserEmail)}
            ;`

            connectionPool.query(sql, (error, result) => {
                if (error) {
                    res.send(error)
                    reject()

                } else {

                    CreatedUserId = result

                    console.log('CURRENT USER: ' + CreatedUserId[0].id_user);

                    resolve()
                }

            })

        })

    }

    const insertLanguagesUsersItems = () => {

        return new Promise((resolve, reject) => {

            //console.log(languagesArray);


            let combinedSql = ''

            userLanguagesArray.forEach(item => {
                console.log('FAVORITE LANGUAGES: ' + item);

                for (let i = 0; i < languagesArray.length; i++) {

                    if (item == languagesArray[i].name) {

                        combinedSql += `INSERT INTO LanguagesUsers (id_language, id_user) 
                        VALUES (${mysql.escape(languagesArray[i].id_language)}, ${CreatedUserId[0].id_user})
                        ;`

                        console.log('Favorite Language:' + item + ' ----> Language Id: ' + languagesArray[i].id_language);



                    } else {
                        console.log('NOT FOUND --> Favorite Language: ' + item + ' ----> Language Object: ' + languagesArray[i].name);


                    }
                }
            })


            connectionPool.query(combinedSql, (error, result) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('LanguagesUsers Item Inserted!');
                }

            })

        })
    }

    insertNewUser()
        .then(getAllLanguages)
        .then(getCreatedUserId)
        .then(insertLanguagesUsersItems)
        .catch(err => console.log(err))


}

exports.createUser = createUser;

//////////////////////////////////////////////////////////////////////

const loginUser = (req, res) => {

    let userEmail = req.body.email
    let userPassword = req.body.password

    let sql = `SELECT *
       
        FROM Users

        INNER JOIN LanguagesUsers

        ON Users.id_user = LanguagesUsers.id_user

        WHERE email = ${mysql.escape(userEmail)} AND password = ${mysql.escape(userPassword)}

        ;`

    connectionPool.query(sql, (error, result) => {
        if (error) {
            res.send('Error:' + error)

        } else if (result.length < 1) {
            res.send('Email or Password Incorrect!')
        } else {

            let favoriteLanguages = []

            result.map(item => {
                favoriteLanguages.push(item.id_language)
            })

            const currentUser = {
                "id_user": result[0].id_user,
                "name": result[0].name,
                "email": result[0].email,
                "favoriteLanguages": favoriteLanguages
            }

            res.send(currentUser)
        }

    })

}

exports.loginUser = loginUser;