const express = require("express");
const router = express.Router();

const googleTrends = require('google-trends-api');

const { getComparisonArrays, getValuesInProportion } = require('./trendsUtils.js')

const { getLanguages } = require('../database/databaseUtils.js')

router.get('/trends', (req, res) => {


    getLanguages()
        .then(r => {
            console.log(r);
            return getComparisonArrays(r)
        })

        .then(r => {
            console.log(r);

            return getAllTrends(r)
        })

        .then(arrayOfTrends => {

            console.log('done..a!!');
            console.log(arrayOfTrends);
            
        })




})

module.exports.trendsRouter = router;


/////////////////////////////////////////////////////////////////////////////////

let resultArray = []

const getAllTrends = (array) => {

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

                return getAllTrends(array)
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