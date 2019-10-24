//Run from project root folder:
//node -r dotenv/config database/createTables.js

const { connectionPool } = require('./connection.js');

const createTables = `

CREATE TABLE JobCategories (
    soc int NOT NULL,
    name varchar(255),
    PRIMARY KEY (soc)
    );

CREATE TABLE Jobs (
    id_job int AUTO_INCREMENT,
    id_location int,
    created datetime,
    soc int,
    PRIMARY KEY (id_job),
    FOREIGN KEY (soc) REFERENCES JobCategories(soc),
    FOREIGN KEY (id_location) REFERENCES Location(id_location),
    FOREIGN KEY (id_timespan) REFERENCES TimeSpan(id_timespan)
    );
  
    CREATE TABLE TimeSpan (
        id_timespan int AUTO_INCREMENT,
        start datetime,
        end datetime,
        PRIMARY KEY (id_timespan)
        );
            
        CREATE TABLE Users (
        id_user int AUTO_INCREMENT,
        name varchar(255),
        password varchar(255),
        email varchar(255),
        PRIMARY KEY (id_user)
        );
            
        CREATE TABLE Languages (
        id_language int AUTO_INCREMENT,
        name varchar(255),
        description text,
        PRIMARY KEY (id_language)
        );
            
        CREATE TABLE Location (
        id_location int AUTO_INCREMENT,
        name varchar(255),
        PRIMARY KEY (id_location)
        );
            
        CREATE TABLE JobsLanguages (
        id_job int,
        id_language int,
        PRIMARY KEY (id_job, id_language),
        FOREIGN KEY (id_job) REFERENCES Jobs(id_job),
        FOREIGN KEY (id_language) REFERENCES Languages(id_language)
        );
            
        CREATE TABLE LanguagesUsers (
        id_language int,
        id_user int,
        FOREIGN KEY (id_language) REFERENCES Languages(id_language),
        FOREIGN KEY (id_user) REFERENCES Users(id_user)
        );
            
        CREATE TABLE FavoriteEvevents (
        id_event int AUTO_INCREMENT,
        id_user int,
        PRIMARY KEY (id_event),
        FOREIGN KEY (id_user) REFERENCES Users(id_user)
        );
            
        CREATE TABLE FavoriteArticles (
        id_article int AUTO_INCREMENT,
        id_user int,
        PRIMARY KEY (id_article),
        FOREIGN KEY (id_user) REFERENCES Users(id_user)
        );
            
            
        CREATE TABLE Quotes (
        id_quote int AUTO_INCREMENT,
        quote text,
        id_language int,
        PRIMARY KEY (id_quote),
        FOREIGN KEY (id_language) REFERENCES Languages(id_language)
        );
            
            
        CREATE TABLE UsersLocations (
        id_location int,
        id_user int,
        PRIMARY KEY (id_location, id_user),
        FOREIGN KEY (id_location) REFERENCES Location(id_location),
        FOREIGN KEY (id_user) REFERENCES Users(id_user)
        );
            
        CREATE TABLE LanguagesTimeSpan (
        id_language int,
        id_timespan int,
        total int,
        PRIMARY KEY (id_language, id_timespan),
        FOREIGN KEY (id_language) REFERENCES Languages(id_language),
        FOREIGN KEY (id_timespan) REFERENCES TimeSpan(id_timespan)
        );
`

connectionPool.query(createTables, (error, result) => {
    if (error) {
        console.log(error);
    } else {
        console.log(result);
    }
})