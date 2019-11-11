//Run from project root folder (Either of them):
//node -r dotenv/config database/populateTables/setup.js
//node --require dotenv/config database/populateTables/setup.js

/**
 * Setup file to clear and populate the database.
 */


const { populateJobCategories } = require('./jobCategories.js');

const { populateJobsToFile, populateJobsLanguagesToFile } = require('./jobs/START_LAST_jobToFile.js');

const { populateLanguages, populateLanguagesDescriptions } = require('./languages.js');
const { populateTimeSpans } = require('./timeSpan.js');
const { populateLanguagesTimeSpan } = require('./languagesTimeSpan.js');


const clearTablesLanguages = () => {
    return new Promise((resolve, reject) => {

        const { connectionPool } = require('../connection.js');

        let sql =
            ` 
        DELETE FROM Quotes;    
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
            DELETE FROM JobsLanguages;
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




//** ********************************** */
//** LANGUAGES and TIMESPANS */
//** ********************************** */

//Each populate method sends many INSERTs to the database.

// clearTablesLanguages()
// .then(populateLanguages)
// populateLanguagesDescriptions()
    // .then(populateTimeSpans)
    // .then(populateLanguagesTimeSpan)
    // .then(r => {
    //     console.log('all done!!!');
    // })

//** ********************************** */
//** JOBS */
//** ********************************** */

//Run each line and do MANUAL work.

// 1. Clear tables:
// clearTablesJobs()

// 2. To extract Jobs into file:
//[WILL TAKE FOREVER]
// node -r dotenv/config database/populateTables/jobs/a1JobsCsvToJson.js
// node -r dotenv/config database/populateTables/jobs/a2JobsXmlToFile.js
// node -r dotenv/config database/populateTables/jobs/a3JobsToFinal.js
//.....

// 3. Add job categories to database (Automatic)
// populateJobCategories()

// 4. Create file with INSERT queries for all jobs
// populateJobsToFile()
//--->Then run the query in the website

// 5. Create file with INSERT queries for all jobsLanguages
// populateJobsLanguagesToFile()
//--->Then run the query in the website
//** ********************************** */

//...

//     .then(result => {
//         console.log(`ALL DONE`);
//         process.exit()
//     })