const openpgp = require('openpgp') // use as CommonJS, AMD, ES6 module or via window.openpgp

/**
 * Heroku is servers are read-only, so we cannot create cert files there.
 * Therefore we are having the cert keys stored as ENV variables.
 */

const PUBLIC_KEY = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v4.6.2
Comment: https://openpgpjs.org

xsBNBF2/mJQBCAC4s8hS4VpZfKv6PjCVu5XS1NdQkyLkBIGmOOdrkrsY4/tV
E3989PipG0YgWiB9PAICMDdprWaINokpwNP1XgWzR7aCwkHIXR/2+8x1njTX
hKyuBnwNbWq+seHGvO9Kdqp1K5kq556QKP1yqKFHieM/0YmbH4evX5b5p+RR
yZ1GK4BtUy40HvenDbS6gD7Djw9m3fanBM0GiW/FtDt4yzCOmF8pamI8Am2o
BsopWm4dHxwm7Fji/YNResn4dXRdGtlksPDrNTKOQhejKQ5AVKssZW6UCFNz
N/X95+zGvTgcvxt9DQbLnyjNH6ANTE4Ir0nrskGd3f/mZrQWebwIFPFfABEB
AAHNJFBlbmd1aW5zIDxtaXhlZGJhZ2xhbmdhcmFAZ21haWwuY29tPsLAdQQQ
AQgAHwUCXb+YlAYLCQcIAwIEFQgKAgMWAgECGQECGwMCHgEACgkQD/3yAkG7
3Q2htQgAodlcpt0sFk57AuYzttxmipAcVL2qq+YlYYhLLYLgm8ijoOiAPtZx
LJL/EXg2GybOHtgUPm9qLzQr3M11h7d/w9TebXz/XS6CR2yD4TrE1/ZcBy5Q
9/A7xpjUglf72V/wLd+4knKTyrXYDxwA81Lhm0ASVl/hpFZ+UqKshLDTnTyT
dpW8H8s+s9aewvsnoC+jxXoiOKSzJrGHuAwMzk5tCDDZwgQswc+eMdPpaEYe
fRipR/WmdloVW3l3jn6pEqq27XNrI4GyiOWjDyMlx6F7KUgAQUfXyQBW+eCf
kFDsu7/w6dhQ4a0izrrfiVGr61GH7rm7feIxvP9NHXG6ksyrBc7ATQRdv5iU
AQgAsvQs4OQYQKunJpgJSAxqYEGua6TLTE4yVpbo14Qll3eHp/l8cbq0eUEd
tAxfE2PRRutkOTW60B8F1buAZpjhgQ0Uh8FoEfMI5eArgRwxrN2OqMd8k32B
ur1qcnBm8AvmXFALM4Bf99yquKMvDzDrz6knsFsapUARjB72+LRziVCqgBkA
orfeCKXQbYjUKhUbHLLFH4i0iJjrCqm7Ua17Qh3YqwdwV4Xz1Vpowp+udm03
SSHa4sxjQf65JsnZvoSvfrYos/u7oqCax8v/2x3cagrfae9Ed/XMAxQwm/Hm
Z0Orkb/XMJk5Ex/uaQyX7ksZF69dkH/Adi3SxJGjCMewdQARAQABwsBfBBgB
CAAJBQJdv5iUAhsMAAoJEA/98gJBu90N7KcH/0K3X0nwDlpA3oCieUFzKoCi
oYRWXu/XqzJ1JCnoHOtdVouNw9OZngs8u5VzEzSa5jo4dTkfIokLuEZ5ounL
M0I5yCkOL46yxUZOpp3lJPUvGkKDBpIKJRJWFnXhBlkVvCtIlBYvTSmtZHar
73ccfGJWhM28HiHMHTng6PHXePOax3FUM//Y1poArGi1W38Kjq2f6EhDQEDg
LlkPpglgaHCDaLF8YJDUO0vLjrr1E4PbMYs0Ko7VGQXvDghFgyB3Pj/7aoNC
SoyAN7n0/jwDQClBpCHcKhpYdsMm+ygjR3rCzWZURrau7wcQ1MEQw2BqkSlH
dcKXu3v3npTBgTjsffI=
=2NJP
-----END PGP PUBLIC KEY BLOCK-----
`

const PRIVATE_KEY = `-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: OpenPGP.js v4.6.2
Comment: https://openpgpjs.org

${process.env.PRIVATE_KEY}
-----END PGP PRIVATE KEY BLOCK-----
`

const REVOKE_CERT = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v4.6.2
Comment: https://openpgpjs.org
Comment: This is a revocation certificate

${process.env.REVOKE_CERT}
-----END PGP PUBLIC KEY BLOCK-----
`

const getPubKey = async () => {

    return PUBLIC_KEY

    // return getKey('pubKey')
}

const getPrivKey = async () => {

    return PRIVATE_KEY
    // return getKey('privKey')
}

const getRevokeKey = () => {

    return ``

    // return getKey('revogCert')
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