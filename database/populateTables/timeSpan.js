// Run this once to populate Time Span table

const { connectionPool } = require('../connection.js');

let start = []
let end = []

//Fills arrays with all timespans...
let s1 = `-01-01`
let s2 = `-06-30`

let e1 = `-07-01`
let e2 = `-12-31`

for (let i = 2015; i < 2020; i++) {
    start.push(i + s1)
    end.push(i + s2)
}

for (let i = 2015; i < 2019; i++) {
    start.push(i + e1)
    end.push(i + e2)
}

//....

const populateTimeSpans = () => {
    return new Promise((resolve, reject) => {

        let concatenatedSQL = ''

        for (let index = 0; index < start.length; index++) {
            concatenatedSQL += `INSERT INTO TimeSpan (start, end) VALUES ('${start[index]}', '${end[index]}');`
        }

        connectionPool.query(concatenatedSQL, (error, result) => {
            if (error) {
                reject(error)
            } else {
                
                console.log('populateTimeSpans DONE');
                
                resolve()
            }
        })

    })  //End promise
}


exports.populateTimeSpans = populateTimeSpans
