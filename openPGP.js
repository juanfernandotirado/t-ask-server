const openpgp = require('openpgp') // use as CommonJS, AMD, ES6 module or via window.openpgp

const getPubKey = () => {

    return getKey('pubKey')
}

const getPrivKey = () => {

    return getKey('privKey')
}

const getRevokeKey = () => {

    return getKey('privKey')
}


const encrypt = async (object) => {

    await openpgp.initWorker({ path: 'openpgp.worker.js' }) // set the relative web worker path

    const PUBLIC_KEY = await getPubKey();

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

const decrypt = async (text) => {

    const PRIVATE_KEY = await getPrivKey();

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

////////////////////////////////////////////////////////////////////////
// Util
////////////////////////////////////////////////////////////////////////
const fs = require('fs');

const getKey = (type) => {

    return new Promise((resolve, reject) => {

        fs.readFile(`./${type}.PGP`, 'utf8', function (err, data) {

            if (err) {
                console.log(err);
            }

            resolve(data)
        });

    })
}

////////////////////////////////////////////////////////////////////////

module.exports.getPubKey = getPubKey
module.exports.encrypt = encrypt
module.exports.decrypt = decrypt