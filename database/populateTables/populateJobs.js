const { connectionPool } = require('../connection.js');

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

const array = []

const populateJobs = () => {
    return new Promise((resolve, reject) => {

        console.log('populatingJobs...');


        let concatenatedSQL = ''

        array.forEach(item => {
            const { hash, country, created, soc } = item
            concatenatedSQL += `INSERT INTO Jobs (id_location, created, soc) VALUES ('${country}', '${created}', '${soc}' );`
        })

        connectionPool.query(concatenatedSQL, (error, result) => {
            if (error) {
                reject(error)
            } else {

                console.log('populatingJobs... DONE');
                resolve()
            }
        })


    }) //End promise
}


exports.populateJobs = populateJobs




///////////////////////////////////////////////////////////////////////////


const csv = require('csv-parser');
const fs = require('fs');

const writeToFile = (obj) => {

    fs.writeFile(__dirname + '/jobs.json', JSON.stringify(obj), function (err) {

        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
}

let lastSoc = socArray[0]
let lastSocCount = 0

const readJobsFromFile = () => {

    return new Promise((resolve, reject) => {

        fs.createReadStream(__dirname + '/filtered_jobs.csv')
            .pipe(csv())
            .on('data', (row) => {

                if ((row.country === 'USA' || row.country === 'CAN') && socArray.includes(row.onet_occupation_code)) {

                    if (row.onet_occupation_code === lastSoc) {
                        if (lastSocCount < 15) {

                            array.push({
                                hash: row.hash,
                                country: row.country === 'USA' ? 1 : 2,
                                created: row.created,
                                soc: row.onet_occupation_code.replace('-', '').replace('.', '')
                            })

                            lastSocCount++

                        } else {

                        }
                    } else {
                        lastSocCount = 1
                        lastSoc = row.onet_occupation_code

                        array.push({
                            hash: row.hash,
                            country: row.country === 'USA' ? 1 : 2,
                            created: row.created,
                            soc: row.onet_occupation_code.replace('-', '').replace('.', '')
                        })

                        console.log('Added jobs to array... code: ' + lastSoc + 'Total in array: ' + array.length);
                        lastSocCount++
                    }

                }

            })
            .on('end', () => {
                console.log('CSV file successfully processed');

                resolve()
                // writeToFile(array)
            });

    })  //end promise
}

exports.readJobsFromFile = readJobsFromFile