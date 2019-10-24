const { connectionPool } = require('./connection.js');

const getJobIds = () => {

    return new Promise((resolve, reject) => {

        let sql = `SELECT id_job FROM Jobs;`

        connectionPool.query(sql, (error, result) => {
            if (error) {
                reject(error)

            } else {

                resolve(result)
            }

        })
    })
}

exports.getJobIds = getJobIds;

const getLanguages = () => {

    return new Promise((resolve, reject) => {

        let sql = `SELECT * FROM Languages;`

        connectionPool.query(sql, (error, result) => {
            if (error) {
                reject(error)

            } else {

                const languages = result.map(item => {
                    return {
                        id_language: item.id_language,
                        name: item.name,
                        description: item.description
                    }
                })

                resolve(languages)
            }

        })
    })
}

exports.getLanguages = getLanguages;

///////////////////////////////////////////////////////////////

const getTimeSpans = () => {

    return new Promise((resolve, reject) => {

        let sql = `SELECT * FROM TimeSpan;`

        connectionPool.query(sql, (error, result) => {
            if (error) {
                reject(error)
            } else { resolve(result) }
        })
    })
}

exports.getTimeSpans = getTimeSpans;

//////////////////////////////////////////////////////////////////////

const getLanguagesLatestCount = () => {

    return new Promise((resolve, reject) => {

        const SQL_LATEST_TIMESPAN_ID = `SELECT id_timespan FROM TimeSpan WHERE start = (SELECT MAX(start) FROM TimeSpan)`

        let sql = `SELECT Languages.id_language, Languages.name, Languages.description, LanguagesTimeSpan.total
            FROM Languages
            INNER JOIN LanguagesTimeSpan
            ON Languages.id_language = LanguagesTimeSpan.id_language
            WHERE LanguagesTimeSpan.id_timespan = (${SQL_LATEST_TIMESPAN_ID})
            ORDER BY LanguagesTimeSpan.total DESC;`

        connectionPool.query(sql, (error, result) => {
            if (error) {
                reject(error)
            } else { resolve(result) }
        })
    })
}

exports.getLanguagesLatestCount = getLanguagesLatestCount;

//////////////////////////////////////////////////////////////////////////

// const getTrendLanguages = () =>{

//     return new Promise((resolve,reject)=>{

//         const SQL_LATEST_TIMESPAN_ID = `SELECT id_timespan FROM TimeSpan WHERE start = (SELECT MAX(start) FROM TimeSpan)`

//         let sql = `SELECT Languages.name
//             FROM Languages
//             INNER JOIN LanguagesTimeSpan
//             ON Languages.id_language = LanguagesTimeSpan.id_language
//             WHERE LanguagesTimeSpan.id_timespan = (${SQL_LATEST_TIMESPAN_ID})
//             ORDER BY LanguagesTimeSpan.total DESC
//             LIMIT 5;`

//         connectionPool.query(sql, (error,result)=>{
//             if(error){
//                 reject(error)
//             }else{
//                 let top5Languages = result.map(item => {
//                     return item.name
//                 })

//                 resolve(top5Languages)
//             }
//         })
//     })
// }

// exports.getTrendLanguages = getTrendLanguages;

//////////////////////////////////////////////////////////////////////////

const getAllTimeSpanByLanguage = () => {

    return new Promise((resolve, reject) => {

        let sql = `SELECT *
            FROM LanguagesTimeSpan
            
            INNER JOIN TimeSpan
            ON TimeSpan.id_timespan = LanguagesTimeSpan.id_timespan

            INNER JOIN Languages
            ON Languages.id_language = LanguagesTimeSpan.id_language
            ;`

        connectionPool.query(sql, (error, result) => {
            if (error) {
                reject(error)
            } else {

                console.log(result);

                let idArrays = result.map(item => {
                    return item.id_language
                })

                let idsArrayUniques = []

                idArrays.forEach(item => {
                    if (!idsArrayUniques.includes(item))
                        idsArrayUniques.push(item)
                })

                let finalArray = idsArrayUniques.map(item => {

                    const languageObjectFull = result.find(itemX => {
                        return itemX.id_language == item
                    })

                    const languageObj = {
                        id_language: languageObjectFull.id_language,
                        name: languageObjectFull.name,
                        description: languageObjectFull.description
                    }

                    return getAllForLanguage(languageObj, result)
                })

                resolve(finalArray)
            }
        })
    })
}

const getAllForLanguage = (languageObject, array) => {
    let fullArrayTimespans = array.filter(item => {
        return item.id_language == languageObject.id_language
    })

    let timeSpansArray = fullArrayTimespans.map(item => {


        //Deletes all fields from the language obj
        //that are inside the timespan obj.
        Object.keys(languageObject).forEach(key => {
            delete item[key]
        })


        return item
    })

    return {
        // language: languageObject.id_language,
        language: languageObject,
        timeSpansArray: timeSpansArray
    }
}

exports.getAllTimeSpanByLanguage = getAllTimeSpanByLanguage;

//////////////////////////////////////////////////////////////////////////

const getJobCategories = () => {

    return new Promise((resolve, reject) => {

        let sql = `SELECT Jobs.soc, JobCategories.name, COUNT(*) AS 'totalJobs'
        FROM Jobs
        INNER JOIN JobCategories
        ON JobCategories.soc = Jobs.soc
        WHERE Jobs.created > (SELECT MAX(start) FROM TimeSpan)
        GROUP BY JobCategories.soc
        ORDER BY totalJobs DESC
        ;`

        connectionPool.query(sql, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}

exports.getJobCategories = getJobCategories;

////////////////////////////////////////////////////////////////////

const getAllJobsForEachLanguages = () => {

    return new Promise((resolve, reject) => {

        let sql = `SELECT JobsLanguages.id_language, Jobs.id_timespan, TimeSpan.start, TimeSpan.end, Languages.name,COUNT (*) AS 'totalJobs'
            FROM Jobs

            INNER JOIN TimeSpan
            ON Jobs.id_timespan = TimeSpan.id_timespan
            
            INNER JOIN JobsLanguages
            ON Jobs.id_job = JobsLanguages.id_job

            INNER JOIN Languages
            ON JobsLanguages.id_Language = Languages.id_Language

            GROUP BY JobsLanguages.id_language
            
            ORDER BY TimeSpan.id_timespan DESC

            ;`

            // `SELECT LanguagesTimeSpan.id_language, TimeSpan.id_timespan, COUNT(*) AS 'totalJobs'
            // FROM Jobs
                
            // INNER JOIN JobsLanguages
            // ON Jobs.id_job = JobsLanguages.id_job
    
            // INNER JOIN LanguagesTimeSpan
            // ON JobsLanguages.id_language = LanguagesTimeSpan.id_language
    
            // INNER JOIN TimeSpan
            // ON LanguagesTimeSpan.id_timespan = TimeSpan.id_timespan

            // WHERE Jobs.created BETWEEN TimeSpan.start AND TimeSpan.end
    
            // GROUP BY LanguagesTimeSpan.id_language, TimeSpan.id_timespan
            // ORDER BY LanguagesTimeSpan.id_language DESC
    
            // ;`

        connectionPool.query(sql, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}

exports.getAllJobsForEachLanguages = getAllJobsForEachLanguages;