const { check } = require('express-validator');
const validator = require('validator');

exports.createUserValidators = [

    check('name', 'Please enter a valid name')
    .isLength({ min: 1, max: 30 })
        .trim()
        .escape(),

    check('email', 'Please enter a valid email')
        .normalizeEmail()
        .isEmail(),

    check('password', 'Password has to be at least 6 characters.')
    .isLength({ min: 6})
        .trim()
        .escape(),

    check('languages', 'Choose at least 3 languages')
        .custom(value => {

            let result = Array.isArray(value);

            if (!value || !result || value.length < 3) {
                return false;
            } else {
                return true
            };
        }),

    check('languages')

        .customSanitizer(value => {

            if (value) {
                return value.map(element => {
                    return validator.escape(element)
                });
            }
        })

]

///////////////////////////////////////////////////////////////

exports.loginValidators = [

    check('email', 'Please enter a valid email')
        .normalizeEmail()
        .isEmail(),

    check('password', 'Password has to be at least 6 characters.')
    .isLength({ min: 6})
        .trim()
        .escape(),

]
