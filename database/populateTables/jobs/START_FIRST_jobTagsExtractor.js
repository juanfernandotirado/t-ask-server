/**
 * Reads the job_descriptions file,
 * And creates an array of jobs,
 * With each having an array of languages.
 * 
 * Then passes it to "populateJobsToFile.js"
 * 
 * node database/populateTables/jobs/START_FIRST_jobTagsExtractor.js 
 */

const { getLanguagesObj } = require('../languages.js');
const { writeJobsToFile } = require('./populateJobsToFile.js')

const xml2js = require('xml2js');
const fs = require('fs');
const parser = new xml2js.Parser({ attrkey: "ATTR" });

let xml_string = fs.readFileSync(__dirname + "/input/job_descriptions.xml", "utf8");

let findings = []

let count = 0

// { name: `Python`, tags: [`Python`] },
const runParser = (languages) => {
    parser.parseString(xml_string, function (error, result) {
        if (error === null) {

            result.jobs.job.forEach(job => {

                count++

                if (count >= 1000 && count % 1000 == 0)
                    console.log('1000 jobs...');

                let newFinding = {
                    id: job.hash[0],
                    keys: []
                }

                languages.forEach(lang => {

                    const containsAny = lang.tags.some(tag => {
                        return job.description[0].includes(tag)
                    })

                    if (containsAny) {
                        newFinding.keys.push(lang.name)
                    }
                })

                if (newFinding.keys.length > 0) {
                    findings.push(newFinding)
                }

            })


            writeJobsToFile(findings)
            // writeToFile(findings);

        }
        else {
            console.log(error);
        }
    });
}

//////////////////////////////////////////////////////////

const writeToFile = (obj) => {

    fs.writeFile(__dirname + "/output/resultFromXML.txt", JSON.stringify(obj), function (err) {

        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
}

//////////////////////////////////////////////////////////


runParser(getLanguagesObj())