/**
 * Reads the main jobs file,
 * Then gets all jobs for US and CA,
 * That also are in one of the SOCs
 * 
 * Finally writes the final file.
 */

//node -r dotenv/config database/populateTables/jobs/a1JobsCsvToJson.js
//node --require dotenv/config database/populateTables/jobs/a1JobsCsvToJson.js

////////////////////////////////////////////////////////////

const FILE_JOB_CSV = __dirname + '/input/raw_job_archive_2019-09-30_1.csv'
const FILE_JOB_JSON = __dirname + '/output/jobs.json'

////////////////////////////////////////////////////////////

const socArray = [
    `11-3021.00`,
    `15-1111.00`,
    `15-1121.00`,
    `15-1122.00`,
    `15-1131.00`,
    `15-1132.00`,
    `15-1133.00`,
    `15-1134.00`,
    `15-1141.00`,
    `15-1142.00`,
    `15-1143.00`,
    `15-1151.00`,
    `15-1152.00`,
    `15-1199.00`,
    `15-1121.01`,
    `15-1199.01`,
    `15-1199.02`,
    `15-1199.03`,
    `15-1199.04`,
    `15-1199.05`,
    `15-1199.06`,
    `15-1199.07`,
    `15-1199.08`,
    `15-1199.09`,
    `15-1199.10`,
    `15-1199.11`,
    `15-1199.12`,
    `15-1143.01`
]

const csv = require('csv-parser');
const fs = require('fs');

const { getIdTimeSpan } = require('../timeSpan.js');

const array = []
let count = 0

const writeJobsToFile = () => {

    return new Promise((resolve, reject) => {

        console.log('readJobsFromFile Start... ');

        fs.createReadStream(FILE_JOB_CSV)
            .pipe(csv())
            .on('data', (row) => {

                if ((row.country === 'USA' || row.country === 'CAN') && socArray.includes(row.onet_occupation_code)) {

                    if (count >= 1000 && count % 1000 == 0) {
                        console.log(count + ' jobs...');
                    }

                    count++

                    //NOTE - We are ignoring ALL jobs before and after the timespans we determined
                    let timeSpanId = getIdTimeSpan(1, row.created)

                    if (timeSpanId >= 1) {
                        array.push({
                            hash: row.hash,
                            country: row.country === 'USA' ? 1 : 2,
                            created: row.created,
                            soc: row.onet_occupation_code.replace('-', '').replace('.', ''),
                            id_timespan: timeSpanId,
                        })
                    }

                }

            })
            .on('end', () => {
                console.log('CSV file successfully processed');

                console.log(count + ' jobs... Saved!');
                // resolve()
                writeToFile(array)
            });

    })  //end promise
}

exports.writeJobsToFile = writeJobsToFile


//////////////////////////////////////////////////////

const writeToFile = (obj) => {

    fs.writeFile(FILE_JOB_JSON, JSON.stringify(obj), function (err) {

        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
}

writeJobsToFile()
