// Run this once to populate languages table

const { connectionPool } = require('../connection.js');

let array =
    [
        [`Python`, `General purpose programming language used in several industries. From videogame development to robotics and artificial inteligence.`, `/assets/language-icon/python.svg`],
        [`Java`, `Development language used for web applications, desktop applications, and mobile applications for the Android ecosystem.`, `/assets/language-icon/java.svg`],
        [`Javascript`, `Development language used for front-end web development.`, `/assets/language-icon/javascript.svg`],
        [`C#`, `C based language used for the creation of .NET applications; such as Windows services, games, console applications, etc.`, `/assets/language-icon/csharp.png`],
        [`PHP`, `Popular language used for server-side scripting, command line scripting, and writing desktop applications. Also used on WordPress for the coding of themes.`, `/assets/language-icon/php.svg`],
        [`C++`, `C based language used for the developing game engines, and desktop apps.`, `/assets/language-icon/cplusplus.svg`],
        [`R`, `Programming language used in the statics industry for the creationg of graphs and programs.`, `/assets/language-icon/r-lang.svg`],
        [`Objective-C`, `Programming language created by Apple as the foundation of OSX and IOS. Currently Apple is transitioning to Swift as their core language.`, `/assets/language-icon/objc.png`],
        [`Swift`, `Development language created by Apple for apple products and mobile applications.`, `/assets/language-icon/swift.svg`],
        [`Matlab`, `Development language used in technical computing for testing mathematical operations displayed in a matrix.`, `/assets/language-icon/mathworks.png`],
        [`TypeScript`, `Development language known as a typed superset of Javascript which compiles the code into clean and simple JS code.`, `/assets/language-icon/typescript.svg`],
        [`Kotlin`, `Programming language used in mobile development of Android. It improves code readability, speeds up development, and compiles Java code.`, `/assets/language-icon/kotlin.svg`],
        [`Ruby`, `Development language mainly used for web applications as a framework. It can be also found in the Test Automation indusrty, Server Programming, and bio-medicine.`, `/assets/language-icon/ruby.svg`],
        [`visual-basic`, "Development language created by Microsoft. Its current edition (Visual Basic .NET) is used for Microsoft platforms and desktop programs.", `/assets/language-icon/visual-basic.svg`],
        [`Go`, `Programming language created at Google mainly used to build network servers, web services and clients connecting to multiple servers.`, `/assets/language-icon/go.svg`],
        [`Rust`, "Programming language used to build webs software, embedded computers, distributed services and for command-line code.", `/assets/language-icon/rust.svg`]
    ]

let descriptionsArray = [
    `General purpose programming language used in several industries. From videogame development to robotics and artificial inteligence.`,
    `Development language used for web applications, desktop applications, and mobile applications for the Android ecosystem.`,
    `Development language used for front-end web development.`,
    `C based language used for the creation of .NET applications; such as Windows services, games, console applications, etc.`,
    `Popular language used for server-side scripting, command line scripting, and writing desktop applications. Also used on WordPress for the coding of themes.`,
    `C based language used for the developing game engines, and desktop apps.`,
    `Programming language used in the statics industry for the creationg of graphs and programs.`,
    `Programming language created by Apple as the foundation of OSX and IOS. Currently Apple is transitioning to Swift as their core language.`,
    `Development language created by Apple for apple products and mobile applications.`,
    `Development language used in technical computing for testing mathematical operations displayed in a matrix.`,
    `Development language known as a typed superset of Javascript which compiles the code into clean and simple JS code.`,
    `Programming language used in mobile development of Android. It improves code readability, speeds up development, and compiles Java code.`,
    `Development language mainly used for web applications as a framework. It can be also found in the Test Automation indusrty, Server Programming, and bio-medicine.`,
    `Development language created by Microsoft. It's current edition (Visual Basic .NET) is used for Microsoft platforms and desktop programs.`,
    `Programming language created at Google mainly used to build network servers, web services and clients connecting to multiple servers.`,
    `Programming language used to build web's software, embedded computers, distributed services and for command-line code.`
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