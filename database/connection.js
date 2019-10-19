const mysql = require('mysql');

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

//One of the configs will be used, depending on the environment:
const databaseConfig = {
    'development': {
        host: process.env.DATABASE_HOST_DEV,
        user: process.env.DATABASE_USER_DEV,
        password: process.env.DATABASE_PASSWORD_DEV,
        database: process.env.DATABASE_DATABASE_DEV,
        multipleStatements: true,
        connectionLimit: 5
    },

    'production': {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DATABASE,
        multipleStatements: true,
        connectionLimit: 5
    }
}


//Uses one of the configs depending on the environment:
exports.connectionPool =
    mysql.createPool(databaseConfig[process.env.NODE_ENV]);