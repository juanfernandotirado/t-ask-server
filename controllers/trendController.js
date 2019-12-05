const googleTrends = require('google-trends-api');
const { getComparisonArrays, getValuesInProportion } = require('./trendsUtils.js')
const { getLanguagesLatestCount, getLatestTimeSpan } = require('../database/databaseUtils.js')



//We are stored the latest google trends result for reuse.
//Resets daily or upon server restart.
let cachedTrends;
let lastRequestTimePlusOneDay;

/**
 * As soon as this script runs, we will get the latest timespan,
 * To be used by google trends request. (As a global variable)
 */
let latestTimeSpan;

getLatestTimeSpan()
    .then(t => {
        latestTimeSpan = t[0]
    })


const trends = (req, res, next) => {

    //Uses cached response if it was last requested within a day at most.
    if (lastRequestTimePlusOneDay && lastRequestTimePlusOneDay > new Date()) {
        sendServerResponse(res, cachedTrends)
    } else {

        //If there is no cached trend response, then start Trend requests:

        let languageGlobal;

        //1. Get the list of languages and their popularity based on Github Repos.
        getLanguagesLatestCount()
            .then(langs => {
                languageGlobal = langs

                //2. Uses the most popular language we have from Github, as a base for doing the requests on Trends API...
                return startRequestingTrends(languageGlobal)
            })
            .then(trends => {

                //CHECK HERE-----

                //3. If the most popular language from Trends API results is the SAME as the one we used as a base, then use this response.
                if (trends[0].data[0].name === languageGlobal[0].name) {

                    //Response #1
                    sendServerResponse(res, trends)

                    //Register last requested date:
                    lastRequestTimePlusOneDay = new Date()
                    lastRequestTimePlusOneDay = lastRequestTimePlusOneDay.setDate(lastRequestTimePlusOneDay.getDate() + 1)

                } else {

                    //4. ***
                    //....................//....................//....................
                    // If the base programming language languageGlobal[0] was NOT
                    // The most popular, the update the order of the languages,
                    // And search again.
                    //....................//....................//....................

                    let fakeFirstPlace = languageGlobal[0]

                    let i = 0
                    languageGlobal[0] = languageGlobal.find((item, index) => {
                        i = index

                        return item.name === trends[0].data[0].name
                    })

                    languageGlobal[i] = fakeFirstPlace

                    //Search again:
                    startRequestingTrends(languageGlobal)
                        .then(r => {

                            //Response #2                            
                            sendServerResponse(res, r)

                            //Register last requested date:
                            lastRequestTimePlusOneDay = new Date()
                            lastRequestTimePlusOneDay = lastRequestTimePlusOneDay.setDate(lastRequestTimePlusOneDay.getDate() + 1)
                        })
                }
                //....................//....................//....................

            })
            .catch(err => {

                if (err) {
                    const e = new Error(err)
                    e.status = 500

                    next(e)
                } else {
                    next(err)
                }

            })
    }
}

module.exports.trends = trends;

const sendServerResponse = (res, trends) => {

    //Cache last response locally:
    cachedTrends = trends

    res.send(trends)
}

const startRequestingTrends = (languages) => {
    return new Promise((resolve, reject) => {

        languages.forEach(item => {
            delete item.total

            //todo - remove this
            // delete item.id_language
            // delete item.description
        })

        /** Another promise chain - RESULT HERE */

        getComparisonArrays(languages)
            .then(arrayComparisons => {

                getAllTrends([...arrayComparisons])
                    .then(arrayOfTrends => {

                        const trends = getProportionObj([...arrayOfTrends], languages)

                        resolve(trends)
                    })
                    .catch(err => {
                        reject(err)
                    })

            }) /** End final inner chain */
            .catch(err => {
                reject(err)
            })


    })//end promise
}

/////////////////////////////////////////////////////////////////////////////
// Google Trends API requests:
/////////////////////////////////////////////////////////////////////////////

const getAllTrends = (array, resultArray = []) => {

    const f = array[0]

    if (array.length > 0) {

        const firstItem = array.shift() //Removes first item of the array            

        const languagesArray = firstItem.map(item => {
            return item.name
        }) //close map

        return getTrendLanguages(languagesArray)
            .then(r => {

                resultArray.push(r)

                return getAllTrends(array, resultArray)
            })

    } else {
        return new Promise((resolve, reject) => {

            resolve(resultArray)
        })
    }
}

/**
 * Retrieves for a single set of languages (5 at a time)
 * 
 * getTrendLanguages(['java', 'python', 'Go', 'Swift', 'Javascript'])
 */
const getTrendLanguages = (languagesArray) => {

    return new Promise((resolve, reject) => {

        if (!latestTimeSpan) {
            reject('Not possible to get latest timespan!')
            return
        }

        googleTrends.interestByRegion(
            {
                keyword: languagesArray,
                startTime: latestTimeSpan.start,
                endTime: latestTimeSpan.end,
                category: 31
            })
            .then(results => {

                let totalArray = JSON.parse(results).default.geoMapData

                let popularityByLocation = totalArray.filter(item => {

                    return item.geoCode == 'US' || item.geoCode == 'CA'
                })

                let popularityValues = popularityByLocation.map(item => {

                    return item.value
                })

                resolve(popularityValues);
            })

    })
}

///////////////////////////////////////////////////////////////////////////////
// Utils:
///////////////////////////////////////////////////////////////////////////////

const getProportionObj = (arrayOfTrends, languages) => {

    //Split into countries:
    let usa = []
    let can = []

    arrayOfTrends.forEach(item => {
        usa.push(item[0])
        can.push(item[1])
    })

    //Get proportion values:
    usa = getValuesInProportion(usa)
    can = getValuesInProportion(can)

    //Now merge each array:
    usa = mergeTrends(usa)
    can = mergeTrends(can)

    //Now map languages back to trends:
    const m = (item, index) => {
        return {
            ...languages[index],
            trend: item
        }
    }

    usa = usa.map(m)
    can = can.map(m)

    //Sort both arrays:
    const s = (a, b) => {
        return b.trend - a.trend
    }

    usa = usa.sort(s)
    can = can.sort(s)


    const mapRanking = (item, index) => {
        item.trend = index + 1
        return item
    }

    // return {
    //     usa: usa.map(mapRanking),
    //     can: can.map(mapRanking)
    // }

    return [
        {
            country: 'US',
            data: usa
        },
        {
            country: 'CA',
            data: can
        }
    ]

    // return {
    //     usa: usa,
    //     can: can
    // }
}

const mergeTrends = (trends) => {
    let merged = [trends[0][0]] //Starts with the value of the first

    //Fills the rest ignoring first item:
    trends.forEach(item => {
        for (let index = 1; index < item.length; index++) {
            merged.push(item[index]);
        }
    })

    return merged
}
