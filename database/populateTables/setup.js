//Run from project root folder:
//node -r dotenv/config database/populateTables/setup.js
//node --require dotenv/config database/populateTables/setup.js
//
/**
 * 1. Deletes all rows from:
 * 
 * LanguagesTimeSpan
 * Languages
 * TimeSpan
 * 
 * 2. Then repopulate them.
 */


const { populateJobCategories } = require('./jobCategories.js');
const { populateLanguages } = require('./languages.js');
const { populateTimeSpans } = require('./timeSpan.js');
const { populateLanguagesTimeSpan } = require('./languagesTimeSpan.js');


const clearTables = () => {
    return new Promise((resolve, reject) => {

        const { connectionPool } = require('../connection.js');

        let sql =
            ` 
        DELETE FROM LanguagesTimeSpan;
        DELETE FROM Languages;
        DELETE FROM TimeSpan;
        DELETE FROM JobCategories;
        `

        connectionPool.query(sql, (error, result) => {
            if (error) {
                console.log('clearTables ' + error)
            } else {
                console.log('clearTables - Cleared tables')
            }

            resolve()
        })

    })//End promise
}



clearTables()
    .then(populateJobCategories)
    .then(populateLanguages)
    .then(populateTimeSpans)
    .then(populateLanguagesTimeSpan)

    .then(result => {
        console.log(`ALL DONE`);
        process.exit()
    })