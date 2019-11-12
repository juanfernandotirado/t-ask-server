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

const { routerIndex } = require('./routes/index.js')
app.use('/api', routerIndex)

//*** ***/



/**
 * ENCRYPTION ***
 */
app.get('/publicKey', (req, res) => {

    const { getPubKey, encrypt, decrypt } = require('./openPGP.js');

    getPubKey()
        .then(key => {

            if (key) {
                res.send(key)
            } else {
                res.statusCode = 404
                res.send('Not found.')
            }
        })
})

/**
 * DEBUG - DEVELOPMENT
 */
if (process.env.NODE_ENV === 'development') {

    const { countJobs } = require('./database/databaseUtils.js')
    app.get('/count', (req, res) => {
        countJobs()
            .then(r => {
                res.send(r)
            })
    })

    const { countJobsLangs } = require('./database/databaseUtils.js')
    app.get('/count2', (req, res) => {
        countJobsLangs()
            .then(r => {
                res.send(r)
            })
    })
}

/* *** END DEBUG - DEVELOPMENT *** */

app.get('*', (req, res) => {
    res.send('t-ask api v1')
})

//Error Handler:
const { errorHandler } = require("./middlewares/errorHandler.js")
app.use(errorHandler)


app.set('port', process.env.PORT || 8080);

const server = app.listen(app.get('port'), () => {
    console.log("Server listening on ", app.get('port'));
});