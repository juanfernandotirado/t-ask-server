const openpgp = require('openpgp') // use as CommonJS, AMD, ES6 module or via window.openpgp
const fs = require('fs');

let PRIVATE_KEY;
fs.readFile('./privKey.PGP', 'utf8', function (err, data) {
    if (err) throw err;
    console.log(data);
    PRIVATE_KEY = data
});


let PUBLIC_KEY;
fs.readFile('./pubKey.PGP', 'utf8', function (err, data) {
    if (err) throw err;
    console.log(data);
    PUBLIC_KEY = data
});


const encrypt = async (object) => {

    await openpgp.initWorker({ path: 'openpgp.worker.js' }) // set the relative web worker path

    let pubkeys = [PUBLIC_KEY]

    let publicKeysPromises = pubkeys.map(async (key) => {
        return (await openpgp.key.readArmored(key)).keys[0]
    });

    const options = {
        message: openpgp.message.fromText(object),
        // resolve all promises returned before
        publicKeys: await Promise.all(publicKeysPromises),       // for encryption
        // privateKeys: [privKeyObj]                                 // for signing (optional)
    }

    return openpgp.encrypt(options).then(ciphertext => {
        const encrypted = ciphertext.data // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'
        return encrypted
    })
}
//...

module.exports.encrypt = encrypt

const decrypt = async (text) => {

    //First gets private key and decrypts it with the password:
    const privKeyObj = (await openpgp.key.readArmored(PRIVATE_KEY)).keys[0]
    await privKeyObj.decrypt(process.env.PRIV_KEY_PASSPHRASE)

    //Config for decryption:
    const options = {
        message: await openpgp.message.readArmored(text),    // parse armored message
        privateKeys: [privKeyObj]                                 // for decryption
    }

    //Then decrypts the message with the private key:
    return openpgp.decrypt(options).then(plaintext => {
        return plaintext.data   //Decrypted message!
    })
}

module.exports.decrypt = decrypt