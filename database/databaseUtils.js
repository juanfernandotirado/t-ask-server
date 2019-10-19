const {connectionPool} = require('./connection.js');

const getLanguages = () =>{
    
    return new Promise((resolve,reject)=>{

        let sql = `SELECT * FROM Languages;`
        
        connectionPool.query(sql, (error,result)=>{
            if(error){
                reject(error)
            }else{resolve(result)}
        })
    })
}

exports.getLanguages = getLanguages;

///////////////////////////////////////////////////////////////

const getTimeSpans = () =>{
    
    return new Promise((resolve,reject)=>{

        let sql = `SELECT * FROM TimeSpan;`
        
        connectionPool.query(sql, (error,result)=>{
            if(error){
                reject(error)
            }else{resolve(result)}
        })
    })
}

exports.getTimeSpans = getTimeSpans;

//////////////////////////////////////////////////////////////////////

const getLanguagesLatestCount = () =>{
    
    return new Promise((resolve,reject)=>{

        const SQL_LATEST_TIMESPAN_ID = `SELECT id_timespan FROM TimeSpan WHERE start = (SELECT MAX(start) FROM TimeSpan)`

        let sql = `SELECT Languages.id_language, Languages.name, Languages.description, LanguagesTimeSpan.total
            FROM Languages
            INNER JOIN LanguagesTimeSpan
            ON Languages.id_language = LanguagesTimeSpan.id_language
            WHERE LanguagesTimeSpan.id_timespan = (${SQL_LATEST_TIMESPAN_ID})
            ORDER BY LanguagesTimeSpan.total DESC;`
        
        connectionPool.query(sql, (error,result)=>{
            if(error){
                reject(error)
            }else{resolve(result)}
        })
    })
}

exports.getLanguagesLatestCount = getLanguagesLatestCount;

//////////////////////////////////////////////////////////////////////////


