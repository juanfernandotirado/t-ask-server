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

const populateLanguages = () => {
    return new Promise((resolve, reject) => {

        let concatenatedSQL = ''

        array.forEach(item => {
            const name = item
            const description = ''
            concatenatedSQL += `INSERT INTO Languages (name, description) VALUES ('${name}', '${description}');`
        })

        connectionPool.query(concatenatedSQL, (error, result) => {
            if (error) {
                reject(error)
            } else {

                console.log('populateLanguages DONE');
                resolve()
            }
        })

    })  //End promise
}


exports.populateLanguages = populateLanguages