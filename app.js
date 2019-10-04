const express = require('express');
const {connectionPool} = require(__dirname + '/database/connection.js');


const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

//Router start here.....
app.get('/dogs',(req,res)=>{
    connectionPool.query(`SELECT * FROM dogs;`,(error,results)=>{
        if(error){
            res.send(error);
        }
        else{
            res.send(results);
        }
    });
});






app.set('port', process.env.PORT || 8080);

const server = app.listen(app.get('port'),()=>{
    console.log("Server listening on ",app.get('port'));
});