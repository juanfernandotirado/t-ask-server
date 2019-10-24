const { connectionPool } = require('../../connection.js');
const { getLanguages, getJobIds } = require('../../databaseUtils.js');
const fs = require('fs');

const populateJobsToFile = () => {
    return new Promise((resolve, reject) => {

        console.log('populatingJobs...');

        //Gets all jobs with hashes from file:
        const fileContent = fs.readFileSync(__dirname + "/output/jobs.json");
        const jobs = JSON.parse(fileContent)

        //Then save jobs on database:
        let textCSV = ''

        jobs.forEach(item => {
            const { hash, country, created, soc, id_timespan } = item
            textCSV +=
                `INSERT INTO Jobs (id_location, created, soc, id_timespan) VALUES ('${country}', '${created}', '${soc}', '${id_timespan}' );`
        })

        console.log('populatingJobs... Creating file...');

        writeToFile(textCSV, '/output/jobsINSERT.txt', () => {
            console.log('populatingJobs... DONE');
            resolve(jobs)
        })

    }) //End promise
}


exports.populateJobsToFile = populateJobsToFile

const populateJobsLanguagesToFile = (jobs) => {
    return new Promise((resolve, reject) => {

        //Gets all jobs with hashes from file:
        const fileContent = fs.readFileSync(__dirname + "/output/jobs.json");
        const jobs = JSON.parse(fileContent)

        console.log('populateJobsLanguages...');

        //Get all languages:
        getLanguages()
            .then(languages => {

                //Get all jobs from DB (For the ID):
                getJobIds()
                    .then(jobIds => {

                        let textCSV = ''
                        //...And save all job-languages relation:
                        jobs.forEach((item, index) => {

                            // item.keys.
                            item.findings[0].keys.forEach(languageTag => {

                                const id_job = jobIds[index].id_job
                                const id_language = languages.find(l => {
                                    return l.name == languageTag
                                }).id_language

                                textCSV +=
                                    `INSERT INTO JobsLanguages (id_job, id_language) VALUES ('${id_job}','${id_language}');`
                            })

                        })
                        //...

                        console.log('populateJobsLanguages... Creating file...');

                        writeToFile(textCSV, '/output/jobsLanguagesINSERT.txt', () => {
                            console.log('populateJobsLanguages... DONE');
                            resolve()
                        })

                        ///;;;;;;;

                    })
            })

    }) //End promise
}

exports.populateJobsLanguagesToFile = populateJobsLanguagesToFile


//......

const writeToFile = (obj, filename, callback) => {

    fs.writeFile(__dirname + filename, JSON.stringify(obj), function (err) {

        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");

        callback()
    });
}