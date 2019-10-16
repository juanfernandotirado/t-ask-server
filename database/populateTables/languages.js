// Run this once to populate languages table

const { connectionPool } = require('../connection.js');

let array =
    [
        `Python`,
        `Java`,
        `Javascript`,
        `C#`,
        `PHP`,
        `C++`,
        `R`,
        `Objective-C`,
        `Swift`,
        `Matlab`,
        `TypeScript`,
        `Kotlin`,
        `Ruby`,
        `visual-basic`,
        `Go`,
        `Rust`
    ]

let currentIndex = 0

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

        if (currentIndex < array.length) {

            addLanguage(array[currentIndex], '')
                .then(() => {

                    console.log('populateLanguages ', array[currentIndex], '');

                    currentIndex++
                    resolve(populateLanguages())
                })

        } else {
            resolve()
        }
    })
}


exports.populateLanguages = populateLanguages