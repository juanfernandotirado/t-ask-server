// Run this once to populate languages table

const { connectionPool } = require('../connection.js');

let array =
    [
        [`Python`, `Used from videogame development to robotics and artificial intelligence.`, `/assets/language-icon/python.svg`],
        [`Java`, `Used for web applications, desktop and mobile applications for the Android ecosystem.`, `/assets/language-icon/java.svg`],
        [`Javascript`, `Development language used for front-end web development.`, `/assets/language-icon/javascript.svg`],
        [`C#`, `C based language used for the creation of .NET applications; such as Windows services.`, `/assets/language-icon/csharp.png`],
        [`PHP`, `Used for server-side scripting, command line scripting, and writing desktop applications.`, `/assets/language-icon/php.svg`],
        [`C++`, `C based language used for the developing game engines, and desktop apps.`, `/assets/language-icon/cplusplus.svg`],
        [`R`, `Used in the statics industry for the creation of graphs and programs.`, `/assets/language-icon/r-lang.svg`],
        [`Objective-C`, `Created by Apple as the foundation of OSX and IOS. Currently Apple is transitioning to Swift.`, `/assets/language-icon/objc.png`],
        [`Swift`, `Created by Apple for apple products and mobile applications.`, `/assets/language-icon/swift.svg`],
        [`Matlab`, `Used in technical computing for testing mathematical operations displayed in a matrix.`, `/assets/language-icon/mathworks.png`],
        [`TypeScript`, `Typed superset of Javascript which compiles the code into clean and simple JS code.`, `/assets/language-icon/typescript.svg`],
        [`Kotlin`, `Used in mobile development for Android. Speeds up development, and compiles Java code.`, `/assets/language-icon/kotlin.svg`],
        [`Ruby`, `Mainly used for web applications as a framework.`, `/assets/language-icon/ruby.svg`],
        [`visual-basic`, "Created by Microsoft. It's current edition (Visual Basic .NET) is used for Microsoft platforms.", `/assets/language-icon/visual-basic.svg`],
        [`Go`, `Created at Google. Mainly used to build network servers.`, `/assets/language-icon/go.svg`],
        [`Rust`, "Used to build web's software, embedded computers, and distributed services.", `/assets/language-icon/rust.svg`]
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
        { name: `Swift`, tags: getVariations('Swift') },
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


//////////////////////////////////////////////////////////////////

const populateLanguages = () => {
    return new Promise((resolve, reject) => {

        let concatenatedSQL = ''

        array.forEach(item => {
            const name = item[0]
            const description = item[1]
            const logoUrl = item[2]
            concatenatedSQL += `INSERT INTO Languages (name, description, logoUrl) VALUES ('${name}', '${description}', '${logoUrl}');`
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


const populateLanguagesDescriptions = () => {
    return new Promise((resolve, reject) => {

        let concatenatedSQL = ''

        array.forEach(item => {
            const name = item[0]
            const description = item[1]
            const logoUrl = item[2]

            concatenatedSQL += `UPDATE Languages
            SET description = '${description}', logoUrl ='${logoUrl}'
            WHERE name = '${name}';`
        })

        connectionPool.query(concatenatedSQL, (error, result) => {
            if (error) {
                reject(error)
            } else {

                console.log('populateLanguagesDescriptions DONE');
                resolve()
            }
        })

    })  //End promise
}


exports.populateLanguagesDescriptions = populateLanguagesDescriptions

////////////////////////////////////////////////////////////////