const { connectionPool } = require('../../connection.js');
const { getLanguages, getJobIds } = require('../../databaseUtils.js');
const fs = require('fs');

const populateJobsToFile = () => {
    return new Promise((resolve, reject) => {

        console.log('populatingJobs...');

        //Gets all jobs with hashes from file:
        const jobs = require(__dirname + "/output/jobsFINAL.json");

        //Then save jobs on database:
        let textINSERT = ''

        jobs.forEach(item => {
            const { hash, country, created, soc, id_timespan } = item
            textINSERT +=
                `INSERT INTO Jobs (id_location, created, soc, id_timespan) VALUES ('${country}', '${created}', '${soc}', '${id_timespan}' );`
        })

        console.log('populatingJobs... Creating file...');

        writeToFile(textINSERT, '/output/jobsINSERT.txt', () => {
            console.log('populatingJobs... DONE');
            resolve(jobs)
        })

    }) //End promise
}


exports.populateJobsToFile = populateJobsToFile

const populateJobsLanguagesToFile = (jobs) => {
    return new Promise((resolve, reject) => {

        //Gets all jobs with hashes from file:
        const jobs = require(__dirname + "/output/jobsFINAL.json");

        console.log('populateJobsLanguages...');

        //Get all languages:
        getLanguages()
            .then(languages => {

                //Get all jobs from DB (For the ID):
                getJobIds()
                    .then(jobIds => {

                        let textINSERT = ''
                        //...And save all job-languages relation:
                        jobs.forEach((item, index) => {

                            // item.keys.
                            item.findings.forEach(languageTag => {

                                const id_job = jobIds[index].id_job
                                const id_language = languages.find(l => {
                                    return l.name == languageTag
                                }).id_language

                                textINSERT +=
                                    `INSERT INTO JobsLanguages (id_job, id_language) VALUES ('${id_job}','${id_language}');`
                            })

                        })
                        //...

                        console.log('populateJobsLanguages... Creating file...');

                        writeToFile(textINSERT, '/output/jobsLanguagesINSERT.txt', () => {
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