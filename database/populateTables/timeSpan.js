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

let currentIndex = 0

const addTimeSpan = (start, end) => {

    return new Promise((resolve, reject) => {

        let sql = `INSERT INTO TimeSpan (start, end) VALUES ('${start}', '${end}');`

        connectionPool.query(sql, (error, result) => {
            if (error) {
                reject(error)
            } else { resolve(result) }
        })
    })
}

const populateTimeSpans = () => {

    return new Promise((resolve, reject) => {

        if (currentIndex < start.length) {

            addTimeSpan(start[currentIndex], end[currentIndex])
                .then(() => {

                    console.log('populateTimeSpans ', start[currentIndex], end[currentIndex]);

                    currentIndex++
                    resolve(populateTimeSpans())
                })

        } else {
            resolve()
        }
    })
}


exports.populateTimeSpans = populateTimeSpans
