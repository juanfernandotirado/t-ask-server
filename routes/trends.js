const express = require("express");
const router = express.Router();

const googleTrends = require('google-trends-api');
const { getComparisonArrays, getValuesInProportion } = require('./trendsUtils.js')
const { getLanguages, getLanguagesLatestCount } = require('../database/databaseUtils.js')

//TODO - Redo searches for CA (atm just US is being checked)
//TODO - Cache trend search result for reuse.
//TODO - Refactor hardcoded date for trends

router.get('/trends', (req, res) => {

    let languageGlobal;

    getLanguagesLatestCount()
        // getLanguages()
        .then(langs => {
            languageGlobal = langs

            return start(languageGlobal)
        })
        .then(trends => {

            //CHECK HERE-----

            console.log(trends);
            if (trends[0].data[0].name === languageGlobal[0].name) {

                //Response #1
                res.send(trends)

            } else {

                //....................//....................//....................
                // If the base programming language languageGlobal[0] was NOT
                // The most popular, the update the order of the languages,
                // And search again.
                //....................//....................//....................

                let fakeFirstPlace = languageGlobal[0]

                let i = 0
                languageGlobal[0] = languageGlobal.find((item, index) => {
                    i = index
                    console.log(i);

                    return item.name === trends[0].data[0].name
                })

                languageGlobal[i] = fakeFirstPlace

                //Search again:
                start(languageGlobal)
                    .then(r => {

                        //Response #2
                        res.send(r)
                    })
            }
            //....................//....................//....................

        })
})

module.exports.trendsRouter = router;

const start = (languages) => {
    return new Promise((resolve, reject) => {

        languages.forEach(item => {
            delete item.total

            //todo - remove this
            // delete item.id_language
            // delete item.description
        })

        console.log(languages);

        /** Another promise chain - RESULT HERE */

        getComparisonArrays(languages)
            .then(arrayComparisons => {

                console.log(arrayComparisons);

                getAllTrends([...arrayComparisons])
                    .then(arrayOfTrends => {

                        const trends = getProportionObj([...arrayOfTrends], languages)

                        resolve(trends)
                    })
            }) /** End final inner chain */


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

                console.log('<---');
                console.log(r);

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
 * getTrendLanguages(['java', 'python', 'Go', 'Swift', 'Javascript'])
 */
const getTrendLanguages = (languagesArray) => {

    return new Promise((resolve, reject) => {

        googleTrends.interestByRegion(
            {
                keyword: languagesArray,
                startTime: new Date('2019-01-01'),
                endTime: new Date('2019-06-30'),
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
            .catch(err => {
                console.error('Oh no there was an error', err);
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