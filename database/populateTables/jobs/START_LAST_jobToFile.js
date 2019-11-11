const { connectionPool } = require('../../connection.js');
const { getLanguages, getJobHashesPending } = require('../../databaseUtils.js');
const fs = require('fs');

const populateJobsToFile = () => {
    return new Promise((resolve, reject) => {

        console.log('populatingJobs...');

        //Gets all jobs with hashes from file:
        const jobs = require(__dirname + `/output/jobsFINAL${process.env._NUM}.json`);

        //Then save jobs on database:
        let textINSERT = ''

        jobs.forEach(item => {
            const { hash, country, created, soc, id_timespan } = item
            textINSERT +=
                `INSERT INTO Jobs (id_location, created, soc, id_timespan, hash) VALUES ('${country}', '${created}', '${soc}', '${id_timespan}', '${hash}' );`
        })

        console.log('populatingJobs... Creating file...');

        writeToFile(textINSERT, `/output/jobsINSERT${process.env._NUM}.txt`, () => {
            console.log('populatingJobs... DONE');
            resolve(jobs)
        })

    }) //End promise
}


exports.populateJobsToFile = populateJobsToFile

const populateJobsLanguagesToFile = () => {
    return new Promise((resolve, reject) => {

        //Gets all jobs with hashes from file:
        let jobs = require(__dirname + `/output/jobsFINAL${process.env._NUM}.json`);

        console.log('populateJobsLanguages...');

        //Get all languages:
        getLanguages()
            .then(languages => {

                //Get all jobs from DB (For the ID):
                getJobHashesPending()
                    .then(jobsHashes => {

                        //Adds ids to final jobs:
                        jobs = jobs.map(item => {

                            let j = jobsHashes.find(i => {
                                return i.hash === item.hash
                            })

                            item.id_job = j.id_job

                            return item
                        })
                        //------------------------------

                        let textINSERT = ''
                        //...And save all job-languages relation:
                        jobs.forEach((item, index) => {


                            console.log(item);
                            
                            // item.keys.
                            item.findings.forEach(languageTag => {

                                const id_job = item.id_job
                                let id_language = languages.find(l => {
                                    return l.name == languageTag
                                })

                                if (id_language) {
                                    id_language = id_language.id_language
                                    textINSERT +=
                                        `INSERT INTO JobsLanguages (id_job, id_language) VALUES ('${id_job}','${id_language}');`
                                }
                            })

                        })
                        //...

                        //CLEAR ALL HASHES:
                        textINSERT += `UPDATE Jobs SET hash = NULL;`

                        console.log('populateJobsLanguages... Creating file...');

                        writeToFile(textINSERT, `/output/jobsLanguagesINSERT${process.env._NUM}.txt`, () => {
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