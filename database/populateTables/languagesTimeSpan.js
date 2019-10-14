const axios = require('axios')   //for http requests
const databaseUtils = require('../databaseUtils.js');
const { getFullDate } = require('./dateUtils.js');
const { connectionPool } = require('../connection.js');


const getDatabaseLanguages = () => {

    return new Promise((resolve, reject) => {
        databaseUtils.getLanguages()
            .then(result => {

                languages = result.map(item => {
                    return {
                        "id_language": item.id_language,
                        "name": item.name
                    }
                })

                resolve();
            })
    })  //end promise

}



//////////////////////////////////////////////////////



const getDatabaseTimeSpans = () => {

    return new Promise((resolve, reject) => {

        databaseUtils.getTimeSpans()
            .then(result => {

                timeSpans = result.map(item => {
                    return {
                        "id_timespan": item.id_timespan,
                        "start": getFullDate(item.start),
                        "end": getFullDate(item.end)
                    }
                })

                resolve();

            })
    })  //end promise

}


///////////////////////////////////////////////////////////

const getRepos = () => {
    return new Promise((resolve, reject) => {

        //Check this twice... In the begining and at the end
        if (languagesCount < languages.length) {

            //......
            if (timeSpansCount < timeSpans.length) {


                let currentLanguage = languages[languagesCount]
                let currentTimeSpan = timeSpans[timeSpansCount]

                let url = `https://api.github.com/search/repositories?q=language%3A${currentLanguage.name}+created%3A%3E${currentTimeSpan.start}+created%3A%3C${currentTimeSpan.end}`

                axios.get(url)
                    .then(res => {

                        finalRepos.push({
                            "id_language": currentLanguage.id_language,
                            "id_timespan": currentTimeSpan.id_timespan,
                            "total": res.data.total_count,
                            "name": currentLanguage.name,
                            "start": currentTimeSpan.start,
                            "end": currentTimeSpan.end

                        })

                        timeSpansCount++;
                        console.log('timeSpansCount++ -> ' + timeSpansCount);

                        resolve(getRepos());
                    })
                    .catch(error => {
                        console.log('Axios error: ' + error);

                    })

            } else {

                timeSpansCount = 0;

                languagesCount++;
                resolve(getRepos());
            }
            //......


        } else {

            console.log(finalRepos);
            resolve();
        }


    })//End of Promise
}

////////////////////////////////////////////////

const addLanguagesTimeSpansSingle = (id_language, id_timespan, total) => {

    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO LanguagesTimeSpan (id_language, id_timespan, total) VALUES ('${id_language}', '${id_timespan}', '${total}');`

        connectionPool.query(sql, (error, result) => {
            if (error) {
                console.log(error + 'ERROR');
                reject(error)
            } else {
                resolve()
            }

        })
    })
}

const populateLanguagesTimeSpans = () => {

    return new Promise((resolve, reject) => {
        if (finalReposCount < finalRepos.length) {

            let item = finalRepos[finalReposCount]

            addLanguagesTimeSpansSingle(item.id_language, item.id_timespan, item.total)
                .then(() => {
                    finalReposCount++
                    resolve(populateLanguagesTimeSpans())
                })

        } else {
            resolve()
        }
    })
}

//////////////////////////////////////////////////////////////

let languages = []
let timeSpans = []
let languagesCount = 0;
let timeSpansCount = 0;


let finalRepos = [];
let finalReposCount = 0;


const populateLanguagesTimeSpan = () => {

    return new Promise((resolve, reject) => {
        getDatabaseLanguages()
            .then(getDatabaseTimeSpans)
            .then(getRepos)
            .then(populateLanguagesTimeSpans)
            .then(result => {
                resolve()
            })
    })

}

exports.populateLanguagesTimeSpan = populateLanguagesTimeSpan