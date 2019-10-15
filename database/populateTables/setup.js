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

const { populateLanguages } = require('./languages.js');
const { populateTimeSpans } = require('./timeSpan.js');
const { populateLanguagesTimeSpan } = require('./languagesTimeSpan.js');


const deleteLanguagesTimeSpans = () => {
    return new Promise((resolve, reject) => {

        const { connectionPool } = require('../connection.js');
        let sql = ` DELETE FROM LanguagesTimeSpan; DELETE FROM Languages; DELETE FROM TimeSpan;`
        connectionPool.query(sql, (error, result) => {
            if (error) {
                console.log('deleteLanguagesTimeSpans ' + error)
            } else {
                console.log('deleteLanguagesTimeSpans - Cleared tables')
            }

            resolve()
        })

    })//End promise
}



deleteLanguagesTimeSpans()
    .then(populateLanguages)
    .then(populateTimeSpans)
    .then(populateLanguagesTimeSpan)

    .then(result => {
        console.log(`ALL DONE`);
        process.exit()
    })