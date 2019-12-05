//Run from project root folder:
//node -r dotenv/config database/createTables.js

const { connectionPool } = require('./connection.js');

const createTables = `

CREATE TABLE JobCategories (
    soc int NOT NULL AUTO_INCREMENT,
    name varchar(255),
    description text,
    PRIMARY KEY (soc)
    );

CREATE TABLE Jobs (
    id_job int NOT NULL AUTO_INCREMENT,
    id_location int,
    created datetime,
    soc int,
    hash text NULL,
    PRIMARY KEY (id_job),
    FOREIGN KEY (soc) REFERENCES JobCategories(soc),
    FOREIGN KEY (id_location) REFERENCES Location(id_location),
    FOREIGN KEY (id_timespan) REFERENCES TimeSpan(id_timespan)
    );
  
    CREATE TABLE TimeSpan (
        id_timespan int NOT NULL AUTO_INCREMENT,
        start datetime,
        end datetime,
        PRIMARY KEY (id_timespan)
        );
            
        CREATE TABLE Users (
        id_user int NOT NULL AUTO_INCREMENT,
        name varchar(255),
        password varchar(255),
        email varchar(255),
        PRIMARY KEY (id_user)
        );
            
        CREATE TABLE Languages (
        id_language int NOT NULL AUTO_INCREMENT,
        name varchar(255),
        description text,
        logoUrl varchar(255),
        PRIMARY KEY (id_language)
        );
            
        CREATE TABLE Location (
        id_location int NOT NULL AUTO_INCREMENT,
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
        PRIMARY KEY (id_language, id_user),
        FOREIGN KEY (id_language) REFERENCES Languages(id_language),
        FOREIGN KEY (id_user) REFERENCES Users(id_user)
        );
            
        CREATE TABLE FavoriteEvevents (
        id_event int NOT NULL AUTO_INCREMENT,
        id_user int,
        PRIMARY KEY (id_event),
        FOREIGN KEY (id_user) REFERENCES Users(id_user)
        );
            
        CREATE TABLE FavoriteArticles (
        id_article int NOT NULL AUTO_INCREMENTT,
        id_user int,
        PRIMARY KEY (id_article),
        FOREIGN KEY (id_user) REFERENCES Users(id_user)
        );
            
            
        CREATE TABLE Quotes (
        id_quote int NOT NULL AUTO_INCREMENT,
        quote text,
        id_language int,
        type varchar(255),
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

        CREATE TABLE Login (
            id_login int NOT NULL AUTO_INCREMENT,
            id_user int,
            created timestamp DEFAULT CURRENT_TIMESTAMP,
            token text,        
            valid BOOLEAN NOT NULL DEFAULT TRUE,
            PRIMARY KEY (id_login),
            FOREIGN KEY (id_user) REFERENCES Users(id_user)
        );
`

const createTablesDatabase = () => {
    connectionPool.query(createTables, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            console.log(result);
        }
    })
}

////////////////////////////////////////////////
// jobs_languages VIEW
////////////////////////////////////////////////
let DROP_VIEW_JOBS_LANGUAGES = `DROP VIEW IF EXISTS jobs_languages;`

let QUERY_JOSBS_LANGUAGES =
    `
SELECT JobsLanguages.id_language, Jobs.id_timespan, TimeSpan.start, TimeSpan.end, Languages.name,COUNT (*) AS 'totalJobs'
            FROM Jobs

            INNER JOIN TimeSpan
            ON Jobs.id_timespan = TimeSpan.id_timespan
            
            INNER JOIN JobsLanguages
            ON Jobs.id_job = JobsLanguages.id_job

            INNER JOIN Languages
            ON JobsLanguages.id_Language = Languages.id_Language

            GROUP BY JobsLanguages.id_language, TimeSpan.id_timespan
            
            ORDER BY Languages.id_Language ASC, TimeSpan.start ASC

            ;
`

const SQL_VIEW_JOBS_LANGUAGES =
    `   CREATE VIEW jobs_languages AS ${QUERY_JOSBS_LANGUAGES};
    `

const jobsLanguagesView = () => {
    connectionPool.query(DROP_VIEW_JOBS_LANGUAGES + SQL_VIEW_JOBS_LANGUAGES, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            console.log(result);
        }
    })
}

////////////////////////////////////////////////  

/////

////////////////////////////////////////////////
// jobs_locations VIEW
////////////////////////////////////////////////
let DROP_VIEW_JOSBS_LOCATIONS = `DROP VIEW IF EXISTS jobs_locations;`

let QUERY_JOSBS_LOCATIONS =
    `
    SELECT JobsLanguages.id_language, Languages.name, count(case when Jobs.id_location = 1 then 1 else null end) as jobsUS, count(case when Jobs.id_location = 2 then 1 else null end) as jobsCA
    FROM Jobs

    INNER JOIN TimeSpan
    ON Jobs.id_timespan = TimeSpan.id_timespan
        
    INNER JOIN JobsLanguages
    ON Jobs.id_job = JobsLanguages.id_job

    INNER JOIN Languages
    ON JobsLanguages.id_Language = Languages.id_Language

    WHERE start = (SELECT MAX(start) FROM TimeSpan)

    GROUP BY JobsLanguages.id_language, TimeSpan.id_timespan
        
    ORDER BY Languages.id_Language ASC, TimeSpan.start ASC

    ;
`

const SQL_VIEW_JOSBS_LOCATIONS =
    `   CREATE VIEW jobs_locations AS ${QUERY_JOSBS_LOCATIONS};
    `

const jobsLocationsView = () => {
    connectionPool.query(DROP_VIEW_JOSBS_LOCATIONS + SQL_VIEW_JOSBS_LOCATIONS, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            console.log(result);
        }
    })
}

////////////////////////////////////////////////

/////

////////////////////////////////////////////////
// jobs_categories VIEW
////////////////////////////////////////////////
let DROP_VIEW_JOSBS_CATEGORIES = `DROP VIEW IF EXISTS jobs_categories;`

let QUERY_JOSBS_CATEGORIES =
`
SELECT Jobs.soc, JobCategories.name, Jobs.id_location, JobCategories.description, count(case when Jobs.id_location = 1 then 1 else null end) as US, count(case when Jobs.id_location = 2 then 1 else null end) as CA
        FROM Jobs

        INNER JOIN JobCategories
        ON JobCategories.soc = Jobs.soc

        WHERE Jobs.created > (SELECT MAX(start) FROM TimeSpan)

        GROUP BY Jobs.id_location,JobCategories.soc

        ;
`

const SQL_VIEW_JOSBS_CATEGORIES =
    `   CREATE VIEW jobs_categories AS ${QUERY_JOSBS_CATEGORIES};
    `

const jobsCategoriesView = () => {
    connectionPool.query(DROP_VIEW_JOSBS_CATEGORIES + SQL_VIEW_JOSBS_CATEGORIES, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            console.log(result);
        }
    })
}

////////////////////////////////////////////////

// To create all tables at once, uncomment an run below function

// createTablesDatabase()

////////////////////////////////////////////////

// To create Views uncomment and run the functions below

// jobsLanguagesView()
// jobsLocationsView()
// jobsCategoriesView()