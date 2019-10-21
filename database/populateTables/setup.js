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
const { readJobsFromFile } = require('./populateJobs.js');
const { populateJobs } = require('./populateJobs.js');
const { populateLanguages } = require('./languages.js');
const { populateTimeSpans } = require('./timeSpan.js');
const { populateLanguagesTimeSpan } = require('./languagesTimeSpan.js');


const clearTablesLanguages = () => {
    return new Promise((resolve, reject) => {

        const { connectionPool } = require('../connection.js');

        let sql =
            ` 
        DELETE FROM LanguagesTimeSpan;
        DELETE FROM Languages;
        DELETE FROM TimeSpan;
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

const clearTablesJobs = () => {
    return new Promise((resolve, reject) => {

        const { connectionPool } = require('../connection.js');

        let sql =
            ` 
        DELETE FROM Jobs;
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



clearTablesJobs()
    .then(populateJobCategories)
    .then(readJobsFromFile)
    .then(populateJobs)

    .then(clearTablesLanguages)
    .then(populateLanguages)
    .then(populateTimeSpans)
    .then(populateLanguagesTimeSpan)

    .then(result => {
        console.log(`ALL DONE`);
        process.exit()
    })