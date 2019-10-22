const xml2js = require('xml2js');
const fs = require('fs');
const parser = new xml2js.Parser({ attrkey: "ATTR" });

const { getLanguagesObj } = require('../languages.js');


let xml_string = fs.readFileSync("./job_descriptions_short.xml", "utf8");

const { readJobsFromFile } = require('./populateJobs.js')

let findings = []

let count = 0

const writeToFile = (obj) => {

    fs.writeFile("./resultFromXML.txt", JSON.stringify(obj), function (err) {

        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
}

// { name: `Python`, tags: [`Python`] },
const runParser = (languages) => {
    parser.parseString(xml_string, function (error, result) {
        if (error === null) {

            // console.log(JSON.stringify(result));



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


            readJobsFromFile(findings)
            // writeToFile(findings);

        }
        else {
            console.log(error);
        }
    });
}


runParser(getLanguagesObj())


// Read Synchrously
// console.log("\n *START* \n");
// var content = fs.readFileSync("./resultFromXML.txt");
// console.log("Output Content : \n"+ content);
// console.log("\n *EXIT* \n");