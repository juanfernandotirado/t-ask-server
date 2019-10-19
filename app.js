const express = require('express')


//*** SETUP BASE ENVIRONMENT ***
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
require('dotenv').config()

//*** SETUP EXPRESS ***
const app = express()
require('./appSetup.js')(app)


//*** API ***
const { sendContactMessage } = require(__dirname + '/mailer/mailer-server')

app.post('/contact-message', (req, res) => {
    sendContactMessage(req.body).then(() => {
        res.status(200)
            .send({ isSent: true });
    }).catch((error) => {
        res.status(500)
            .send({ isSent: false, error: error });
    });

});

//*** ***/

const {routerIndex} = require('./routes/index.js')
app.use('/api',routerIndex)


//*** ***/

//*** API START ***
app.set('port', process.env.PORT || 8080);

const server = app.listen(app.get('port'), () => {
    console.log("Server listening on ", app.get('port'));
});