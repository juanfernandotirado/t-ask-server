const express = require("express");
const router = express.Router();

const path = require('path')

const pathArray =['database/', 'databaseUtils.js']

const {getLanguages} = require(path.join(__dirname, ...pathArray))

getLanguages()

router.get('/languages', (req,res)=>{

    res.send(
   
        {
            languages : [
    
                {
                    id_language: 1,
                    name: 'java',
                    total: 123456
                },
                {
                    id_language: 4,
                    name: 'Ruby',
                    total: 123456
                }	
            ]
        }

    )
})



module.exports.comparisonRouter = router;