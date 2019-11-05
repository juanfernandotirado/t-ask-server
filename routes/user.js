const express = require("express");
const router = express.Router();

const { createUser, loginUser } = require('../controllers/userController.js')

const securityMiddleware = (req, res, next) => {

    // const { decrypt } = require('../openPGP.js');

    // let message = req.body.message

    // //First we decrypt the message
    // decrypt(message)
    //     .then(result => {

    //         //Then we remove the message from the body
    //         delete req.body.message

    //         //Then we parse the decrypted message to an actual json object
    //         result = JSON.parse(result)

    //         //Finally we put into the body the actual data:
    //         Object.keys(result).forEach(key => {
    //             req.body[key] = result[key]
    //         })

    //         next()
    //     })
    //     .catch(err => {

    //         //TODO - add error handler
    //         console.log(err);
    //         next('Error decrypting message.')
    //     })

    next()
}

router.post('/signup', securityMiddleware, createUser)

router.post('/login', securityMiddleware, loginUser)

module.exports.userRouter = router;