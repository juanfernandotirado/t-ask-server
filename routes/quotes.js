const xlsx = require('node-xlsx');

const express = require("express");
const router = express.Router();

const { connectionPool } = require('../database/connection.js');


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

                const workSheetsFromFile = xlsx.parse('quotes.xlsx');
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

const mysql = require('mysql');

// const cp = mysql.createPool({

// connectionLimit:1000,
// host : 'juantirado.wmdd.ca',
// user : 'JuanQuotes',
// password : 'Nazly9823*',
// database : 'Quotes-test', // this has to be the name of the database you just created.
// multipleStatements: true

// });



combineLanguagesIdsAndQuotes()
    .then(newQuotesArray=>{

        newQuotesArray.forEach(item => {
            const quote = item.quote
            const id_language = item.id_language

            let combinedSql = ''

            combinedSql+= `INSERT INTO Quotes (quote, id_language) VALUES ('${quote}', ${id_language});`

            connectionPool.query(combinedSql, (error, result) => {
                if (error) {
                    console.log(error);
                
                } else {
                    console.log('populateQuotes DONE');
                }
            })
            
        })

    })

router.get('/', (req, res) => {

    combineLanguagesIdsAndQuotes()
        .then(result => {
            res.send(result)

        })

})

module.exports.quotesRouter = router;


///////////////////////////////////////////////////////////////////////

