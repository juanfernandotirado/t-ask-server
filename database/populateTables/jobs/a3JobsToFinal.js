//node -r dotenv/config database/populateTables/jobs/a3JobsToFinal.js
//node --require dotenv/config database/populateTables/jobs/a3JobsToFinal.js 

const { getIdTimeSpan } = require('../timeSpan.js');
const fs = require('fs');

const { getFirstTimeSpanId } = require('../../databaseUtils.js');

//
//
////////////////////////////////////////////////

const FILE_FINAL = __dirname + `/output/jobsFINAL${process.env._NUM}.json`

let jobs = require(__dirname + `/output/jobs${process.env._NUM}.json`)

// jobs = jobs.filter((item, index) => {
//     return index < 100
// })

let jobsTechTags = require(__dirname + `/output/jobsTechTags${process.env._NUM}.json`)

////////////////////////////////////////////////
//
//

const array = []

const writeToFile = (obj) => {

    fs.writeFile(FILE_FINAL, JSON.stringify(obj), function (err) {

        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
}

const mergeJobsFinal = () => {

    getFirstTimeSpanId()
        .then(ID_TIMESPAN => {

            console.log(ID_TIMESPAN);

            jobs.forEach(itemJob => {
                let indexToRemoveFromJobs = -1
                const f = jobsTechTags.data.filter((item, index) => {

                    let check = item.id === itemJob.hash

                    if (check) {
                        indexToRemoveFromJobs = index
                    }

                    return check
                })

                if (indexToRemoveFromJobs >= 0)
                    jobsTechTags.data.splice(indexToRemoveFromJobs, 1)            
                
                if (f.length > 0) {                

                    //NOTE - We are ignoring ALL jobs before and after the timespans we determined
                    let timeSpanId = getIdTimeSpan(ID_TIMESPAN, itemJob.created)                                        

                    if (timeSpanId >= ID_TIMESPAN) {                                             
                        
                        array.push({
                            hash: itemJob.hash,
                            country: itemJob.country,
                            created: itemJob.created,
                            soc: itemJob.soc,
                            id_timespan: timeSpanId,

                            findings: f[0].keys
                        })
                    }

                } //End if length
            }) //End foreach jobs

            writeToFile(array)

        })  //END first id timespan
}

mergeJobsFinal()
