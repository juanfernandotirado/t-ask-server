const express = require('express');
const cors = require('cors')
const {connectionPool} = require(__dirname + '/database/connection.js');
const {sendContactMessage} = require(__dirname + '/mailer/mailer-server');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
// app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use(cors());

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


app.post('/contact-message',(req,res)=>{
    sendContactMessage(req.body).then(() => {
        res.status(200)
            .send({isSent: true});
    }).catch((error)=>{
        res.status(500)
            .send({isSent: false,error:error});
    });
    
});


app.set('port', process.env.PORT || 8080);

const server = app.listen(app.get('port'),()=>{
    console.log("Server listening on ",app.get('port'));
});