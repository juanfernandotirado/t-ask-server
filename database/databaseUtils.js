const { connectionPool } = require('./connection.js');

const mysql = require('mysql')

const getJobIds = () => {

    return new Promise((resolve, reject) => {

        let sql = `SELECT id_job FROM Jobs;`

        connectionPool.query(sql, (error, result) => {
            if (error) {
                reject(error)

            } else {

                resolve(result)
            }

        })
    })
}

exports.getJobIds = getJobIds;

const getLanguages = () => {

    return new Promise((resolve, reject) => {

        let sql = `SELECT * FROM Languages;`

        connectionPool.query(sql, (error, result) => {
            if (error) {
                reject(error)

            } else {

                const languages = result.map(item => {
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

exports.getLanguages = getLanguages;

///////////////////////////////////////////////////////////////

const getTimeSpans = () => {

    return new Promise((resolve, reject) => {

        let sql = `SELECT * FROM TimeSpan;`

        connectionPool.query(sql, (error, result) => {
            if (error) {
                reject(error)
            } else { resolve(result) }
        })
    })
}

exports.getTimeSpans = getTimeSpans;

//////////////////////////////////////////////////////////////////////

const getLanguagesLatestCount = () => {

    return new Promise((resolve, reject) => {

        const SQL_LATEST_TIMESPAN_ID = `SELECT id_timespan FROM TimeSpan WHERE start = (SELECT MAX(start) FROM TimeSpan)`

        let sql = `SELECT Languages.id_language, Languages.name, Languages.logoUrl, Languages.description, LanguagesTimeSpan.total
            FROM Languages
            INNER JOIN LanguagesTimeSpan
            ON Languages.id_language = LanguagesTimeSpan.id_language
            WHERE LanguagesTimeSpan.id_timespan = (${SQL_LATEST_TIMESPAN_ID})
            ORDER BY LanguagesTimeSpan.total DESC;`

        connectionPool.query(sql, (error, result) => {
            if (error) {
                reject(error)
            } else { resolve(result) }
        })
    })
}

exports.getLanguagesLatestCount = getLanguagesLatestCount;

//////////////////////////////////////////////////////////////////////////

// const getTrendLanguages = () =>{

//     return new Promise((resolve,reject)=>{

//         const SQL_LATEST_TIMESPAN_ID = `SELECT id_timespan FROM TimeSpan WHERE start = (SELECT MAX(start) FROM TimeSpan)`

//         let sql = `SELECT Languages.name
//             FROM Languages
//             INNER JOIN LanguagesTimeSpan
//             ON Languages.id_language = LanguagesTimeSpan.id_language
//             WHERE LanguagesTimeSpan.id_timespan = (${SQL_LATEST_TIMESPAN_ID})
//             ORDER BY LanguagesTimeSpan.total DESC
//             LIMIT 5;`

//         connectionPool.query(sql, (error,result)=>{
//             if(error){
//                 reject(error)
//             }else{
//                 let top5Languages = result.map(item => {
//                     return item.name
//                 })

//                 resolve(top5Languages)
//             }
//         })
//     })
// }

// exports.getTrendLanguages = getTrendLanguages;

//////////////////////////////////////////////////////////////////////////

const getAllTimeSpanByLanguage = () => {

    return new Promise((resolve, reject) => {

        let sql = `SELECT *
            FROM LanguagesTimeSpan
            
            INNER JOIN TimeSpan
            ON TimeSpan.id_timespan = LanguagesTimeSpan.id_timespan

            INNER JOIN Languages
            ON Languages.id_language = LanguagesTimeSpan.id_language
            ;`

        connectionPool.query(sql, (error, result) => {
            if (error) {
                reject(error)
            } else {

                console.log(result);

                let idArrays = result.map(item => {
                    return item.id_language
                })

                let idsArrayUniques = []

                idArrays.forEach(item => {
                    if (!idsArrayUniques.includes(item))
                        idsArrayUniques.push(item)
                })

                let finalArray = idsArrayUniques.map(item => {

                    const languageObjectFull = result.find(itemX => {
                        return itemX.id_language == item
                    })

                    const languageObj = {
                        id_language: languageObjectFull.id_language,
                        name: languageObjectFull.name,
                        description: languageObjectFull.description,
                        logoUrl: languageObjectFull.logoUrl
                    }

                    return getAllForLanguage(languageObj, result)
                })

                resolve(finalArray)
            }
        })
    })
}

const getAllForLanguage = (languageObject, array) => {
    let fullArrayTimespans = array.filter(item => {
        return item.id_language == languageObject.id_language
    })

    let timeSpansArray = fullArrayTimespans.map(item => {


        //Deletes all fields from the language obj
        //that are inside the timespan obj.
        Object.keys(languageObject).forEach(key => {
            delete item[key]
        })


        return item
    })

    return {
        // language: languageObject.id_language,
        language: languageObject,
        timeSpansArray: timeSpansArray
    }
}

exports.getAllTimeSpanByLanguage = getAllTimeSpanByLanguage;

//////////////////////////////////////////////////////////////////////////

const getJobCategories = () => {

    return new Promise((resolve, reject) => {

        let sql = `SELECT Jobs.soc, JobCategories.name, Jobs.id_location, count(case when Jobs.id_location = 1 then 1 else null end) as US, count(case when Jobs.id_location = 2 then 1 else null end) as CA
        FROM Jobs

        INNER JOIN JobCategories
        ON JobCategories.soc = Jobs.soc

        WHERE Jobs.created > (SELECT MAX(start) FROM TimeSpan)

        GROUP BY Jobs.id_location,JobCategories.soc

        ;`

        connectionPool.query(sql, (error, result) => {
            if (error) {
                reject(error)
            } else {
                const getFinalResponse = (result) => {

                    let finalArrayCountries = []

                    let objUS = {
                        country: "US",
                        data: []
                    }

                    let objCA = {
                        country: "CA",
                        data: []
                    }
                    //...
                    result.forEach(item => {

                        if (item.id_location == 1) {
                            objUS.data.push({
                                soc: item.soc,
                                name: item.name,
                                totalJobs: item['US'],
                            })
                        }

                        if (item.id_location == 2) {
                            objCA.data.push({
                                soc: item.soc,
                                name: item.name,
                                totalJobs: item['CA'],
                            })
                        }

                    })

                    finalArrayCountries.push(objUS)
                    finalArrayCountries.push(objCA)

                    return finalArrayCountries

                }
                resolve(getFinalResponse(result))
            }
        })
    })
}

exports.getJobCategories = getJobCategories;

////////////////////////////////////////////////////////////////////

const getAllJobsForEachLanguages = () => {

    return new Promise((resolve, reject) => {

        let sql = `SELECT JobsLanguages.id_language, Jobs.id_timespan, TimeSpan.start, TimeSpan.end, Languages.name,COUNT (*) AS 'totalJobs'
            FROM Jobs

            INNER JOIN TimeSpan
            ON Jobs.id_timespan = TimeSpan.id_timespan
            
            INNER JOIN JobsLanguages
            ON Jobs.id_job = JobsLanguages.id_job

            INNER JOIN Languages
            ON JobsLanguages.id_Language = Languages.id_Language

            GROUP BY JobsLanguages.id_language, TimeSpan.id_timespan
            
            ORDER BY Languages.id_Language ASC, TimeSpan.start ASC

            ;`

        connectionPool.query(sql, (error, result) => {
            if (error) {
                reject(error)
            } else {

                let idArrays = result.map(item => {
                    return item.id_language
                })

                let idsArrayUniques = []

                idArrays.forEach(item => {
                    if (!idsArrayUniques.includes(item))
                        idsArrayUniques.push(item)
                })

                let finalArray = idsArrayUniques.map(item => {

                    const languageObjectFull = result.find(itemX => {
                        return itemX.id_language == item
                    })

                    const languageObj = {
                        id_language: languageObjectFull.id_language,
                        name: languageObjectFull.name,
                        description: languageObjectFull.description
                    }

                    return getAllForLanguage(languageObj, result)
                })

                resolve(finalArray)
            }
        })
    })
}

exports.getAllJobsForEachLanguages = getAllJobsForEachLanguages;

//////////////////////////////////////////////////////////////////////////

const getAllJobsForEachLocation = () => {

    return new Promise((resolve, reject) => {

        let sql = `SELECT JobsLanguages.id_language, Languages.name, count(case when Jobs.id_location = 1 then 1 else null end) as jobsUS, count(case when Jobs.id_location = 2 then 1 else null end) as jobsCA
        FROM Jobs

        INNER JOIN TimeSpan
        ON Jobs.id_timespan = TimeSpan.id_timespan
            
        INNER JOIN JobsLanguages
        ON Jobs.id_job = JobsLanguages.id_job

        INNER JOIN Languages
        ON JobsLanguages.id_Language = Languages.id_Language

        WHERE start = (SELECT MAX(start) FROM TimeSpan)

        GROUP BY JobsLanguages.id_language, TimeSpan.id_timespan
            
        ORDER BY Languages.id_Language ASC, TimeSpan.start ASC

        ;`

        connectionPool.query(sql, (error, result) => {
            if (error) {
                reject(error)
            } else {
                connectionPool.query(sql, (error, result) => {
                    if (error) {
                        reject(error)
                    } else {

                        let idArrays = result.map(item => {
                            return item.id_language
                        })

                        let idsArrayUniques = []

                        idArrays.forEach(item => {
                            if (!idsArrayUniques.includes(item))
                                idsArrayUniques.push(item)
                        })

                        let finalArray = idsArrayUniques.map(item => {

                            const languageObjectFull = result.find(itemX => {
                                return itemX.id_language == item
                            })

                            const languageObj = {
                                id_language: languageObjectFull.id_language,
                                name: languageObjectFull.name,
                                description: languageObjectFull.description
                            }

                            return getAllForLanguage(languageObj, result)
                        })

                        resolve(getFinalResponse(finalArray))
                    }
                })  //End inner query
            }
        })  //End Outer Query
    })
}


/**
 * Mapping the final response to follow the same pattern
 * as in "/comparison/trends"
 */
const getFinalResponse = (finalArray) => {

    let finalArrayCountries = []

    let objUS = {
        country: "US",
        data: []
    }

    let objCA = {
        country: "CA",
        data: []
    }


    //...
    finalArray.forEach(item => {

        objUS.data.push({
            id_language: item.language.id_language,
            name: item.language.name,
            totalJobs: item.timeSpansArray[0].jobsUS
        })

        objCA.data.push({
            id_language: item.language.id_language,
            name: item.language.name,
            totalJobs: item.timeSpansArray[0].jobsCA
        })

    })
    //...

    finalArrayCountries.push(objUS)
    finalArrayCountries.push(objCA)


    return finalArrayCountries

}

exports.getAllJobsForEachLocation = getAllJobsForEachLocation;

/////////////////////////////////////////////////////////

const getQuotes = () => {

    return new Promise((resolve, reject) => {

        let sql = `SELECT Quotes.quote, Quotes.id_quote, Languages.id_language, Languages.name
        FROM Quotes

        INNER JOIN Languages
        ON Quotes.id_Language = Languages.id_Language
        
        ;`

        connectionPool.query(sql, (error, result) => {
            if (error) {
                reject(error)
            } else {

                const getAllForQuotes = (languageObject, array) => {
                    let fullArrayTimespans = array.filter(item => {
                        return item.id_language == languageObject.id_language
                    })

                    let quotesArray = fullArrayTimespans.map(item => {


                        //Deletes all fields from the language obj
                        //that are inside the timespan obj.
                        Object.keys(languageObject).forEach(key => {
                            delete item[key]
                        })


                        return item
                    })

                    return {
                        // language: languageObject.id_language,
                        language: languageObject,
                        quotesArray: quotesArray
                    }
                }

                let idArrays = result.map(item => {
                    return item.id_language
                })

                let idsArrayUniques = []

                idArrays.forEach(item => {
                    if (!idsArrayUniques.includes(item))
                        idsArrayUniques.push(item)
                })

                let finalArray = idsArrayUniques.map(item => {

                    const languageObjectFull = result.find(itemX => {
                        return itemX.id_language == item
                    })

                    const languageObj = {
                        id_language: languageObjectFull.id_language,
                        name: languageObjectFull.name,
                        description: languageObjectFull.description
                    }

                    return getAllForQuotes(languageObj, result)
                })

                resolve(finalArray)
            }
        })
    })

}

exports.getQuotes = getQuotes;

/////////////////////////////////////////////////////////////////////////////

// const createUser = (req, res) => {

//     let newUserName = req.body.name
//     let newUserEmail = req.body.email
//     let newUserPassword = req.body.password
//     let userLanguagesArray = req.body.languages

//     const insertNewUser = () => {

//         return new Promise((resolve, reject) => {

//             let sql = `INSERT INTO Users (name, email, password) 
//             VALUES (${mysql.escape(newUserName)}, ${mysql.escape(newUserEmail)}, ${mysql.escape(newUserPassword)})
//             ;`

//             connectionPool.query(sql, (error, result) => {
//                 if (error) {
//                     res.send('Error:' + error)
//                     reject()

//                 } else {

//                     res.send('New User Name:' + newUserName + ', New User Email: ' + newUserEmail + ', New User Password: ' + newUserPassword + ', Favorite Languages: ' + userLanguagesArray)

//                     resolve()
//                 }

//             })

//         })

//     }

//     let languagesArray = []
//     let CreatedUserId

//     const getAllLanguages = () => {

//         return new Promise((resolve, reject) => {

//             let sql = `SELECT * 
//             FROM Languages
//             ;`

//             connectionPool.query(sql, (error, result) => {
//                 if (error) {
//                     res.send(error)
//                     reject()

//                 } else {

//                     languagesArray = result
//                     console.log('Languages Selected!!!');

//                     resolve(result)

//                     //console.log(languagesArray);
                    
//                 }

//             })

//         })

//     }  

//     const getCreatedUserId = () => {

//         return new Promise((resolve, reject) => {

//             let sql = `SELECT id_user 
//             FROM Users
//             WHERE email = ${mysql.escape(newUserEmail)}
//             ;`

//             connectionPool.query(sql, (error, result) => {
//                 if (error) {
//                     res.send(error)
//                     reject()

//                 } else {

//                     CreatedUserId = result

//                     console.log('CURRENT USER: ' + CreatedUserId[0].id_user);

//                     resolve()
//                 }

//             })

//         })

//     } 

//     const insertLanguagesUsersItems = () => {

//         return new Promise((resolve, reject) => {

//             //console.log(languagesArray);
            

//             let combinedSql = ''

//             userLanguagesArray.forEach(item =>{
//                 console.log('FAVORITE LANGUAGES: ' + item); 
                
//                 for (let i = 0; i < languagesArray.length; i++) {

//                     if (item == languagesArray[i].name) {
                                               
//                         combinedSql += `INSERT INTO LanguagesUsers (id_language, id_user) 
//                         VALUES (${mysql.escape(languagesArray[i].id_language)}, ${CreatedUserId[0].id_user})
//                         ;`

//                         console.log('Favorite Language:' + item + ' ----> Language Id: ' + languagesArray[i].id_language);

                        

//                     } else {
//                         console.log('NOT FOUND --> Favorite Language: ' + item + ' ----> Language Object: ' +  languagesArray[i].name);
                        
                        
//                     }
//                 }
//             })


//             connectionPool.query(combinedSql, (error, result) => {
//                 if (error) {
//                     console.log(error);
//                 } else {
//                     console.log('LanguagesUsers Item Inserted!');
//                 }

//             })

//         })  
//     }
   
//     insertNewUser()
//         .then( getAllLanguages() )        
//         .then( getCreatedUserId() )
//         .then( insertLanguagesUsersItems() )
//         .catch(err => console.log(err) )


// }

// exports.createUser = createUser;

// //////////////////////////////////////////////////////////////////////

// const loginUser = (req, res) => {

//     let userEmail = req.body.email
//     let userPassword = req.body.password
//     //WHERE email = ${mysql.escape(userEmail)}
//     let sql = `SELECT *
       
//         FROM Users

//         INNER JOIN LanguagesUsers

//         ON Users.id_user = LanguagesUsers.id_user

//         WHERE email = ${mysql.escape(userEmail)} AND password = ${mysql.escape(userPassword)}

//         ;`

//     connectionPool.query(sql, (error, result) => {
//         if (error) {
//             res.send('Error:' + error)

//         } else if (result.length < 1) {
//             res.send('Email or Password Incorrect!')
//         } else {

//             let favoriteLanguages = []

//             result.map(item =>{
//                 favoriteLanguages.push(item.id_language)
//             })

//             const currentUser = {
//                 "id_user": result[0].id_user,
//                 "name": result[0].name,
//                 "email": result[0].email,
//                 "favoriteLanguages": favoriteLanguages
//             }

//             res.send(currentUser)
//         }

//     })

// }

// exports.loginUser = loginUser;