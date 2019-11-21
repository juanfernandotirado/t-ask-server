// Run this once on setup.js file to populate Location table

const populateLocations = () => {
    return new Promise((resolve, reject) => {

        let sql = `INSERT INTO Location (id_location, name) VALUES (1, 'US'), (2, 'CA');`

        connectionPool.query(sql, (error, result) => {
            if (error) {
                reject(error)
            } else {

                console.log('populateLocations DONE');
                resolve()
            }
        })

    })  //End promise
}


exports.populateLocations = populateLocations