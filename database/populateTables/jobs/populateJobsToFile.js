/**
 * Reads the main jobs file,
 * Then gets all jobs for US and CA,
 * That also are in one of the SOCs,
 * Then merges jobs with each list of programming language tags.
 * 
 * Finally writes the final file.
 */
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

///////////////////////////////////////////////////////////////////////////


const csv = require('csv-parser');
const fs = require('fs');

let count = 0

const writeJobsToFile = (findings) => {

    return new Promise((resolve, reject) => {

        console.log('readJobsFromFile Start... ' + findings.length);

        fs.createReadStream(__dirname + '/input/filtered_jobs.csv')
            .pipe(csv())
            .on('data', (row) => {

                if ((row.country === 'USA' || row.country === 'CAN') && socArray.includes(row.onet_occupation_code)) {

                    if (count >= 1000 && count % 1000 == 0) {
                        console.log('1000 jobs...');
                    }

                    count++

                    let i = -1
                    const f = findings.filter((item, index) => {

                        let check = item.id === row.hash

                        if (check) {
                            i = index
                        }

                        return check
                    })

                    if (i >= 0)
                        delete findings[i]


                    if (f.length > 0)
                        array.push({
                            hash: row.hash,
                            country: row.country === 'USA' ? 1 : 2,
                            created: row.created,
                            soc: row.onet_occupation_code.replace('-', '').replace('.', ''),

                            findings: f
                        })

                }

            })
            .on('end', () => {
                console.log('CSV file successfully processed');

                // resolve()
                writeToFile(array)
            });

    })  //end promise
}

exports.writeJobsToFile = writeJobsToFile


//////////////////////////////////////////////////////

const writeToFile = (obj) => {

    fs.writeFile(__dirname + '/output/jobs.json', JSON.stringify(obj), function (err) {

        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
}