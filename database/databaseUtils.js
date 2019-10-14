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

