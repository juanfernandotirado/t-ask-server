const xlsx = require('node-xlsx');
const { connectionPool } = require('../connection.js');

const workSheetsFromFile = xlsx.parse('../../quotes.xlsx');

// workSheetsFromFile.map(item=>{
//     console.log(item);
    
// })

let languages =[]

const getLanguages = () => {

    return new Promise((resolve, reject) => {

        let sql = `SELECT * FROM Languages;`

        connectionPool.query(sql, (error, result) => {
            if (error) {
                reject(error)

            } else {

               languages = result.map(item => {
                    return {
                        id_language: item.id_language,
                        name: item.name,
                        description: item.description
                    }
                })

                resolve(languages)
            }

        })
    })
}
getLanguages()
.then(result => {
    console.log(result);
    
})




///////////////////////////////////////////////////////////////////////

// const csv = require('csv-parser');
// const fs = require('fs');


// fs.createReadStream('../../quotes.csv')
// .pipe(csv())
// .on('data', (row) => {
//     console.log(row);
// })
// .on('end', () => {
//     console.log('CSV file successfully processed');
// });