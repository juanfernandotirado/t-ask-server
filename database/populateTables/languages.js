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


const getLanguagesObj = () => {

    return [
        { name: `Python`, tags: [`Python`] },
        { name: `Java`, tags: getVariations('Java') },
        { name: `Javascript`, tags: [`Javascript`] },
        { name: `C#`, tags: [`C#`] },
        { name: `PHP`, tags: [`PHP`] },
        { name: `C++`, tags: [`C++`] },
        { name: `R`, tags: getVariations('R'), case: true },
        { name: `Objective-C`, tags: [`Objective-C`] },
        { name: `Swift`, tags: getVariations('Swift')},
        { name: `Matlab`, tags: [`Matlab`] },
        { name: `TypeScript`, tags: [`TypeScript`] },
        { name: `Kotlin`, tags: [`Kotlin`] },
        { name: `Ruby`, tags: [`Ruby`] },
        { name: `visual-basic`, tags: [`visual-basic`] },
        { name: `Go`, tags: getVariations('Go'), case: true },
        { name: `Rust`, tags: [`Rust`] }
    ]
}

module.exports.getLanguagesObj = getLanguagesObj


const getVariations = (item) => {
    return [
        ` ${item} `,
        ` ${item}.`,
        ` ${item},`,
        ` ${item}:`,
        ` ${item}/`,
        ` ${item}-`,
        ` ${item};`,
        `(${item})`,
        ` ${item})`,
        `(${item},`
    ]
}

module.exports.getLanguagesObj = getLanguagesObj

//////////////////////////////////////////////////////////////////

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