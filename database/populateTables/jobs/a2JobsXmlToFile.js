/**
 * Reads the job_descriptions file,
 * And creates an array of jobs,
 * With each having an array of languages. 
 * 
 * node -r dotenv/config database/populateTables/jobs/a2JobsXmlToFile.js
 * node --require dotenv/config database/populateTables/jobs/a2JobsXmlToFile.js 
 */

////////////////////////////////////////////////////////////

const FILE_JOB_DESCRIPTIONS_XML = __dirname + "/input/linkup_job_descriptions_2019-10-01_0.xml"

const FILE_JOB_CHECK = __dirname + "/output/jobs.json"

const FILE_JOB_FINAL = __dirname + '/output/jobsTechTags.json'
const SAVE_EVERY_X_TIMES = 20

////////////////////////////////////////////////////////////


const { getLanguagesObj } = require('../languages.js');

//----------------------------------------
//  *** 888 888 888 ***
//----------------------------------------

var fs = require('fs')
let Parser = require('node-xml-stream');
//..........--------------------

//Read from the file to keep going... (Contains final/partial result)
let json;

try {
    json = require(FILE_JOB_FINAL)
} catch (err) {
    console.log("Initial json not provided.");
}

//If no file provided, then creates one...
if (!json) {
    json = { "currentBytes": 0, total: 0, "data": [] }
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

// //...............................................................

// //Count function: Writes to file every X jobs...
const c = () => {
    count++

    if (count % SAVE_EVERY_X_TIMES == 0) {
        appendToJsonFile([...findings])
    }
}

// //Will only start checking jobs after this
let currentBytes = json.currentBytes
let initialBytes = currentBytes
let currentCount = 0

let parser = new Parser();
let currentTag;



let findings = []
let newFinding;
let count = 0

let indexToRemoveFromJobs = -1

let stream;
const runParser = (languages) => {

    //////
    // Pipe a stream to the parser
    stream = fs.createReadStream(FILE_JOB_DESCRIPTIONS_XML, { start: initialBytes });
    stream.pipe(parser);

    parser.on('closetag', (name, attrs) => {
        if (name == 'jobs') {
            //Finished!
            console.log('DONE!!!');

            appendToJsonFile([...findings])
        }
    });

    // <tag attr="hello">
    parser.on('opentag', (name, attrs) => {

        currentBytes = stream.bytesRead + initialBytes
        currentTag = name
    });

    // <tag>TEXT</tag>
    parser.on('text', text => {

        if (currentTag == 'hash') {

            currentCount++

            let isJobTechJob = jobs.find((item, index) => {

                let check = item && text == item.hash

                if (check) {
                    indexToRemoveFromJobs = index
                }

                return check
            })

            if (isJobTechJob) {

                newFinding = {
                    id: text,
                    keys: []
                }

                //Remove the techjob from the CHECK-list
                jobs.splice(indexToRemoveFromJobs, 1)

            } else {
                newFinding = undefined

                //If we iterated over 3k non-tech jobs,
                // then lets just update the index in the json file
                if (findings.length == 0 && currentCount % 3000 == 0) {
                    console.log('Updating count index in file...');

                    appendToJsonFile([...findings])
                }
            }

        }
    });

    parser.on('cdata', cdata => {

        //DESCRIPTION GOES HERE

        if (newFinding) {

            //........................
            // Now to check the tags:
            //........................
            languages.forEach(lang => {

                const containsAny = lang.tags.some(tag => {
                    return cdata.includes(tag)
                })

                if (containsAny) {
                    newFinding.keys.push(lang.name)
                }
            })

            if (newFinding.keys.length > 0) {
                findings.push(newFinding)

                console.log('Added! ' + newFinding.id);

                c()
            }

        }

        newFinding = undefined
    })
    //////

}

const appendToJsonFile = (obj) => {

    console.log("Saving...");

    json.currentBytes = currentBytes
    json.data.push(...obj)

    json.total = json.data.length

    fs.writeFile(FILE_JOB_FINAL, JSON.stringify(json), function (err) {

        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
        showPercentageLeft()
    });


    findings = []   //Clear findings to avoid duplication
}

const showPercentageLeft = () => {
    totalFileSize = 20700000000
    let percentage = currentBytes * 100 / totalFileSize
    console.log(`${percentage}% file read`);
}

runParser(getLanguagesObj())
