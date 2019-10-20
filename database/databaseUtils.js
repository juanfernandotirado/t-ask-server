const { connectionPool } = require('./connection.js');

const getLanguages = () => {

    return new Promise((resolve, reject) => {

        let sql = `SELECT * FROM Languages;`

        connectionPool.query(sql, (error, result) => {
            if (error) {
                reject(error)
            } else { resolve(result) }
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

const getTrendLanguages = () => {

    return new Promise((resolve, reject) => {

        const SQL_LATEST_TIMESPAN_ID = `SELECT id_timespan FROM TimeSpan WHERE start = (SELECT MAX(start) FROM TimeSpan)`

        let sql = `SELECT Languages.name
            FROM Languages
            INNER JOIN LanguagesTimeSpan
            ON Languages.id_language = LanguagesTimeSpan.id_language
            WHERE LanguagesTimeSpan.id_timespan = (${SQL_LATEST_TIMESPAN_ID})
            ORDER BY LanguagesTimeSpan.total DESC
            LIMIT 5;`

        connectionPool.query(sql, (error, result) => {
            if (error) {
                reject(error)
            } else {
                let top5Languages = result.map(item => {
                    return item.name
                })

                resolve(top5Languages)
            }
        })
    })
}

exports.getTrendLanguages = getTrendLanguages;

//////////////////////////////////////////////////////////////////////////

const getAllTimeSpanByLanguage = () => {

    return new Promise((resolve, reject) => {

        let sql = `SELECT * 
            FROM LanguagesTimeSpan;`

        connectionPool.query(sql, (error, result) => {
            if (error) {
                reject(error)
            } else {

                let idArrays = result.map(item => {
                    return item.id_language
                })

                let idsArrayUniques = []


                idArrays.forEach(item => {
                    if (!idsArrayUniques.includes(item))
                        idsArrayUniques.push(item)
                })

                let finalArray = idsArrayUniques.map(item => {
                    return getAllForLanguage(item, result)
                })

                resolve(finalArray)
            }
        })
    })
}

const getAllForLanguage = (id_language, array) => {
    let fullArray = array.filter(item => {
        return item.id_language == id_language
    })

    let timeSpansArray = fullArray.map(item => {

        return { id_timespan: item.id_timespan, total: item.total }
    })

    return {
        id_language: id_language,
        timeSpansArray: timeSpansArray
    }
}

exports.getAllTimeSpanByLanguage = getAllTimeSpanByLanguage;

//////////////////////////////////////////////////////////////////////////

