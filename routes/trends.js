const express = require("express");
const router = express.Router();

const googleTrends = require('google-trends-api');

//const { getTrendLanguages } = require('../database/databaseUtils.js')

router.get('/trends', (req, res) => {

    getTrendLanguages(['java','python', 'Go', 'Swift','Javascript'])
    .then(result=>console.log(result))

})

module.exports.trendsRouter = router;


/////////////////////////////////////////////////////////////////////////////////

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