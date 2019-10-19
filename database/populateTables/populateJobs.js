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


let currentIndex = 0

const addJob = (hash, country, created, soc) => {

    return new Promise((resolve, reject) => {

        let sql = `INSERT INTO Jobs (id_location, created, soc) VALUES ('${country}', '${created}', '${soc}' );`

        connectionPool.query(sql, (error, result) => {
            if (error) {
                reject(error)
            } else { resolve(result) }
        })
    })
}

const populateJobs = () => {

    return new Promise((resolve, reject) => {

        if (currentIndex < array.length) {

            const { hash, country, created, soc } = array[currentIndex]

            addJob(hash, country, created, soc)
                .then(() => {

                    console.log('populateJobs ', hash, country, created, soc);

                    currentIndex++
                    resolve(populateJobs())
                })

        } else {
            resolve()
        }
    })
}


exports.populateJobs = populateJobs




///////////////////////////////////////////////////////////////////////////


const csv = require('csv-parser');
const fs = require('fs');

const writeToFile = (obj) => {

    fs.writeFile("./output/result.json", JSON.stringify(obj), function (err) {

        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
}

const readJobsFromFile = () => {

    return new Promise((resolve, reject) => {

        fs.createReadStream(__dirname + '/output/filtered_jobs.csv')
            .pipe(csv())
            .on('data', (row) => {

                if ((row.country === 'USA' || row.country === 'CAN') && socArray.includes(row.onet_occupation_code)) {

                    array.push({
                        hash: row.hash,
                        country: row.country === 'USA' ? 1 : 2,
                        created: row.created,
                        soc: row.onet_occupation_code.replace('-', '').replace('.', '')
                    })

                    console.log('Addedto array... ' + array.length);
                }

            })
            .on('end', () => {
                console.log('CSV file successfully processed');

                resolve()
                // writeToFile(filteredArray)
            });

    })  //end promise
}

exports.readJobsFromFile = readJobsFromFile