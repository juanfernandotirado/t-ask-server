// To populate Quotes table run one of the lines below in the root directory

//node -r dotenv/config database/populateTables/quotes.js
//node --require dotenv/config database/populateTables/quotes.js

const xlsx = require('node-xlsx');

const mysql = require('mysql')
const { connectionPool } = require('../connection.js');


const getLanguagesQuotes = () => {

    return new Promise((resolve, reject) => {

        let sql = `SELECT * FROM Languages;`

        connectionPool.query(sql, (error, result) => {
            if (error) {
                reject(error)

            } else {

                languages = result.map(item => {
                    return {
                        id_language: item.id_language,
                        name: item.name,
                        description: item.description
                    }
                })

                resolve(languages)
            }

        })
    })
}

const combineLanguagesIdsAndQuotes = () => {

    return new Promise((resolve, reject) => {

        getLanguagesQuotes()
            .then(result => {

                let languages = result

                const workSheetsFromFile = xlsx.parse(`${__dirname}/quotes.xlsx`);
                let quotesArray = workSheetsFromFile[0].data
                //console.log(quotesArray);

                let count = 0

                let newQuotesArray = []

                quotesArray.map(quote => {
                    count++

                    for (let i = 0; i < languages.length; i++) {
                        if (quote[0] == languages[i].name) {
                            newQuotesArray.push(
                                {
                                    id_language: parseInt(languages[i].id_language),
                                    quote: quote[1]
                                }
                            )
                        }

                    }

                })

                resolve(newQuotesArray)

            })

    })
}

combineLanguagesIdsAndQuotes()
    .then(newQuotesArray=>{

        let combinedSql = ''

        newQuotesArray.forEach(item => {
            const quote = item.quote
            const id_language = item.id_language

            combinedSql+= `INSERT INTO Quotes (quote, id_language) VALUES (${mysql.escape(quote)}, ${id_language});`
          
        })

        console.log(combinedSql);
        

        connectionPool.query(combinedSql, (error, result) => {
            if (error) {
                console.log(error);
                
            } else {
                console.log('populateQuotes DONE');
            }
        })

    })