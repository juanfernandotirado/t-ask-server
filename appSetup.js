const express = require('express')
const cors = require('cors')

module.exports = (app) => {

    app.use(express.static('public'));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    // app.use(cors({origin: 'http://localhost:3000', credentials: true}));
    app.use(cors());
}
