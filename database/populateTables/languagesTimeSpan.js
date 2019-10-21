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

        let data = require('./languagesData.js')

        //.....

        if (languagesCount < languages.length) {

            //......
            if (timeSpansCount < timeSpans.length) {

                let currentLanguage = languages[languagesCount]
                let currentTimeSpan = timeSpans[timeSpansCount]


                let currLangFromData = data.find(item => {
                    return item.languageName.toLowerCase() === currentLanguage.name.toLowerCase()
                })

                let total = currLangFromData.data.find(item => {

                    // console.log(`Try this... ${item.startDate} === ${currentTimeSpan.start}`);

                    return item.startDate === currentTimeSpan.start && item.endDate === currentTimeSpan.end
                }).repoCount

                finalRepos.push({
                    "id_language": currentLanguage.id_language,
                    "id_timespan": currentTimeSpan.id_timespan,
                    "total": total,

                    //Fields below will not be stored in DB:
                    "name": currentLanguage.name,
                    "start": currentTimeSpan.start,
                    "end": currentTimeSpan.end
                })

                console.log(`getRepos -> Language: ${languagesCount + 1}/${languages.length} --- TimeSpan: ${timeSpansCount + 1}/${timeSpans.length}`);

                timeSpansCount++;

                resolve(getRepos());

            } else {

                timeSpansCount = 0;

                languagesCount++;
                resolve(getRepos());
            }
            //......


        } else {

            console.log(`DONE getRepos -> LanguageTimeSpans objects found: ${finalRepos.length}`);
            resolve();
        }

    })//End of Promise
}


////////////////////////////////////////////////

const populateLanguagesTimeSpans = () => {
    return new Promise((resolve, reject) => {

        let concatenatedSQL = ''

        finalRepos.forEach(item => {
            const { id_language, id_timespan, total } = item

            concatenatedSQL += `INSERT INTO LanguagesTimeSpan (id_language, id_timespan, total) VALUES ('${id_language}', '${id_timespan}', '${total}');`
        })

        connectionPool.query(concatenatedSQL, (error, result) => {
            if (error) {
                reject(error)
            } else {

                console.log('populateLanguagesTimeSpans DONE');
                resolve()
            }
        })



    })//End promise
}

//////////////////////////////////////////////////////////////

let languages = []
let timeSpans = []
let languagesCount = 0;
let timeSpansCount = 0;

let finalRepos = [];

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