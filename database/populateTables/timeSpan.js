// Run this once to populate Time Span table

const { connectionPool } = require('../connection.js');

let start = []
let end = []

if (process.env.NODE_ENV === 'development') {

    //Fill arrays with just 2 timespans...
    start = [`2012-01-01`, `2013-01-01`]
    end = [`2012-06-30`, `2013-06-30`]

} else {

    //Fills arrays with all timespans...
    let s = `-01-01`
    let e = `-12-31`

    for (let i = 2012; i < 2019; i++) {
        start.push(i + s)
        end.push(i + e)
    }
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
