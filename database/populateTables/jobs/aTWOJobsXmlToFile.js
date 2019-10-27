/**
 * Reads the job_descriptions file,
 * And creates an array of jobs,
 * With each having an array of languages. 
 * 
 * node -r dotenv/config database/populateTables/jobs/aTWOJobsXmlToFile.js 
 * node --require dotenv/config database/populateTables/jobs/aTWOJobsXmlToFile.js 
 */

////////////////////////////////////////////////////////////

const FILE_JOB_DESCRIPTIONS_XML = __dirname + "/input/job_descriptions_short.xml"

const FILE_JOB_CHECK = __dirname + "/output/jobs.json"

const FILE_JOB_FINAL = __dirname + '/output/jobsTechTags.json'
const SAVE_EVERY_X_TIMES = 2

////////////////////////////////////////////////////////////


const { getLanguagesObj } = require('../languages.js');

//----------------------------------------
//  *** 888 888 888 ***
//----------------------------------------

var fs = require('fs')
var XmlStream = require('xml-stream');

//Read from the file to keep going... (Contains final/partial result)
let json;

try {
    json = require(FILE_JOB_FINAL)
} catch (err) {
    console.log("Initial json not provided.");
}

//If no file provided, then creates one...
if (!json) {
    json = { "count": 0, "data": [], total: 0 }
}

//Array used to check if the job is tech job:
let jobs = require(FILE_JOB_CHECK)

//Remove already checked jobs:
jobs = jobs.filter(item => {

    let jobExists = json.data.find(existingJob => {
        return item.hash == existingJob.id
    })

    return !(jobExists)
})

console.log('Starts with ' + jobs.length + ' checkers');

//...............................................................

//Count function: Writes to file every X jobs...
const c = () => {
    count++

    if (count % SAVE_EVERY_X_TIMES == 0) {
        appendToJsonFile([...findings])
        findings = []
    }
}

//Will only start checking jobs after this
let startCount = json.count
let currentCount = 0

let findings = []
let newFinding;
let count = 0

let indexToRemoveFromJobs = -1

let xml;

const runParser = (languages) => {
    let stream = fs.createReadStream(FILE_JOB_DESCRIPTIONS_XML);
    xml = new XmlStream(stream);

    xml.preserve('job', true);
    // xml.preserve('description', true);
    xml.collect('subitem');

    xml.on('endElement: jobs', outer => {
        //Finished!
        console.log('DONE!!!');
        
        appendToJsonFile([...findings])
        findings = []
    })


    xml.on('endElement: job', function (itemJobXml) {

        currentCount++

        if (currentCount >= startCount) {

            let isJobTechJob = jobs.find((item, index) => {

                let check = item && itemJobXml.hash.$text == item.hash

                if (check) {
                    indexToRemoveFromJobs = index
                }

                return check
            })

            if (isJobTechJob) {

                if (count >= 100 && count % 100 == 0) {
                    console.log(count + ' Tech jobs... ' + findings.length + 'saved with tags');
                }

                newFinding = {
                    id: itemJobXml.hash.$text,
                    keys: []
                }

                //........................
                // Now to check the tags:
                //........................
                languages.forEach(lang => {

                    const containsAny = lang.tags.some(tag => {
                        return itemJobXml.description.$text.includes(tag)
                    })

                    if (containsAny) {
                        newFinding.keys.push(lang.name)
                    }
                })

                if (newFinding.keys.length > 0) {
                    findings.push(newFinding)

                    jobs.splice(indexToRemoveFromJobs, 1)
                    console.log('Tech job found!... Added!');
                    console.log('Removed from job check array... ' + jobs.length);

                    c()
                }

            } else {
                newFinding = undefined
            }
        }   //End startCount check

    }); //End xml.on
}

const appendToJsonFile = (obj) => {

    xml.pause()


    console.log("Saving...");

    json.count = (currentCount + 1)
    json.data.push(...obj)

    json.total = json.data.length

    fs.writeFile(FILE_JOB_FINAL, JSON.stringify(json), function (err) {

        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
        xml.resume()
    });
}

runParser(getLanguagesObj())