/**
 * Run this script to create the RSA keys to use.
 * 
 * node -r dotenv/config openPGPCreateKeys.js
 */

const openpgp = require('openpgp') // use as CommonJS, AMD, ES6 module or via window.openpgp

const generateRSA = () => {
    var options = {
        userIds: [{ name: process.env.PRIV_KEY_NAME, email: process.env.PRIV_KEY_EMAIL }], // multiple user IDs
        rsaBits: 4096,                                            // RSA key size
        passphrase: process.env.PRIV_KEY_PASSPHRASE         // protects the private key
    };

    openpgp.generateKey(options).then(function (key) {
        var privkey = key.privateKeyArmored; // '-----BEGIN PGP PRIVATE KEY BLOCK ... '
        var pubkey = key.publicKeyArmored;   // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
        var revocationCertificate = key.revocationCertificate; // '-----BEGIN PGP PUBLIC KEY BLOCK ... '

        saveFile('privKey', privkey)
        saveFile('pubKey', pubkey)
        saveFile('revogCert', revocationCertificate)

    });
}

module.exports.generateRSA = generateRSA



const saveFile = (name, obj) => {

    name = './' + name + ".PGP"

    var fs = require('fs')

    console.log("Saving...");

    fs.writeFile(name, obj, function (err) {

        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });

}

generateRSA()