const mysql = require('mysql');
const {databaseConfig} = require( __dirname + '/db_configuration.js');

exports.connectionPool = mysql.createPool(databaseConfig);