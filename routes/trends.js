const express = require("express");
const router = express.Router();

const googleTrends = require('google-trends-api');

const { getTrendLanguages } = require('../database/databaseUtils.js')

router.get('/trends', (req, res) => {

    getTrendLanguages()
        .then(top5Languages => {

            console.log(top5Languages);

            googleTrends.interestByRegion({ keyword: top5Languages, startTime: new Date('2019-01-01'), endTime: new Date('2019-06-30'), category: 31 })
                .then(results => {

                    //console.log({...results});


                    let totalArray = JSON.parse(results).default.geoMapData

                    let popularityByLocation = totalArray.filter(item => {
                        
                            return item.geoCode == 'US' || item.geoCode == 'CA'
                    })

                    let popularityValues = popularityByLocation.map(item=>{
                        return item.value
                    })

                    res.send(popularityValues);
                })
                .catch(err => {
                    console.error('Oh no there was an error', err);
                })
        })

})

module.exports.trendsRouter = router;