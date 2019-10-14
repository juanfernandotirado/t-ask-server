// Run this once to populate languages table

const { connectionPool } = require('../connection.js');

let array =
    (process.env.NODE_ENV === 'development') ? [`Python`, `Java`] :
        [
            `Python`,
            `Java`,
            `Javascript`,
            `C#`,
            `PHP`,
            `C/C++`,
            `R`,
            `Objective-C`,
            `Swift`,
            `Matlab`,
            `TypeScript`,
            `Kotlin`,
            `Ruby`,
            `VBA`,
            `Go`
        ]

let yyy = 0

const addLanguage = (name, description) => {

    return new Promise((resolve, reject) => {

        let sql = `INSERT INTO Languages (name, description) VALUES ('${name}', '${description}');`

        connectionPool.query(sql, (error, result) => {
            if (error) {
                reject(error)
            } else { resolve(result) }
        })
    })
}

const populateLanguages = () => {

    return new Promise((resolve, reject) => {

        console.log('populateLanguages');

        if (yyy < array.length) {

            addLanguage(array[yyy], '')
                .then(() => {
                    yyy++
                    resolve(populateLanguages())
                })

        } else {
            resolve()
        }
    })
}


exports.populateLanguages = populateLanguages