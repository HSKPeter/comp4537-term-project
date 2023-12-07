const mysql = require('mysql2');

const dbPool = mysql.createPool({
    host: "localhost",
    user: "root", // Change this upon hosting
    password: "", // Change this upon hosting
    database: "comp4537_project", // Change this upon hosting
    port: 3306 // Feel free to remove this
});

const CREATE_TABLE_QUERIES = {
    User: `
        CREATE TABLE IF NOT EXISTS User (
            UserID INT NOT NULL AUTO_INCREMENT,
            Name VARCHAR(100) NOT NULL,
            Password VARCHAR(100) NOT NULL,
            UserType INT NOT NULL,
            Email VARCHAR(100) NOT NULL,
            PRIMARY KEY (UserID),
            FOREIGN KEY (UserType) REFERENCES UserType(UserTypeID)
        );
    `,
    UserType: `
        CREATE TABLE IF NOT EXISTS UserType (
            UserTypeID INT NOT NULL AUTO_INCREMENT,
            PRIMARY KEY (UserTypeID),
            UserAuthorization VARCHAR(100) NOT NULL
        );
    `,
    APICall: `
        CREATE TABLE IF NOT EXISTS APICall (
            API_Call_ID INT NOT NULL AUTO_INCREMENT,
            UserID INT NOT NULL,
            Time DATETIME,
            Method VARCHAR(100) NOT NULL,
            Endpoint VARCHAR(100) NOT NULL,
            PRIMARY KEY (API_Call_ID),
            FOREIGN KEY (UserID) REFERENCES User(UserID)
        );
    `,
    BookmarkWords: `
        CREATE TABLE IF NOT EXISTS BookmarkWord (
            WordID INT NOT NULL AUTO_INCREMENT,
            UserID INT NOT NULL,
            Word VARCHAR(100) NOT NULL,
            PRIMARY KEY (WordID),
            FOREIGN KEY (UserID) REFERENCES User(UserID)
        );`
};

const INSERT_QUERIES = {
    UserType: `INSERT INTO UserType (UserAuthorization) VALUES ('Admin'), ('Regular');`
}

const UserTypes = {
    Admin: 1,
    Regular: 2,
}

function runSQLQuery(sqlQuery, params = []) {
    return new Promise((resolve, reject) => {
        dbPool.query(sqlQuery, params, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    })
}

async function setupDatabase() {
    try {
        console.log('Setting up database');

        // Execute the CREATE TABLE queries
        await runSQLQuery(CREATE_TABLE_QUERIES.UserType);
        await runSQLQuery(CREATE_TABLE_QUERIES.User);
        await runSQLQuery(CREATE_TABLE_QUERIES.APICall);
        await runSQLQuery(CREATE_TABLE_QUERIES.BookmarkWords);

        // Execute the INSERT queries
        let results = await runSQLQuery('SELECT * FROM UserType');
        if (results.length === 0) {
            await runSQLQuery(INSERT_QUERIES.UserType);
        }
        console.log('Database setup complete');
    } catch (err) {
        console.error('Error setting up database: ', err);
    }
}

module.exports = {
    runSQLQuery,
    setupDatabase,
    UserTypes
}
