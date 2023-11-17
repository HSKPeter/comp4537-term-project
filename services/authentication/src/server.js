const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const dbPool = mysql.createPool({
    host: "localhost", 
    user: "root",
    password: "",
    database: "comp4537_project"
});

const CREATE_TABLE_QUERIES = {
    User: `
        CREATE TABLE IF NOT EXISTS User (
            UserID INT PRIMARY KEY,
            Name VARCHAR(100),
            Password VARCHAR(100),
            UserType INT,
            FOREIGN KEY (UserType) REFERENCES UserType(UserTypeID)
        );
    `,
    UserType: `
        CREATE TABLE IF NOT EXISTS UserType (
            UserTypeID INT PRIMARY KEY,
            UserAuthorization VARCHAR(100)
        );
    `,
    APICall: `
        CREATE TABLE IF NOT EXISTS APICall (
            API_Call_ID INT PRIMARY KEY,
            UserID INT,
            Time DATETIME,
            FOREIGN KEY (UserID) REFERENCES User(UserID)
        );
    `
}

const app = express();

app.use(cors());

const PORT = 8000;


app.post('/register', (req, res) => {
    
});

app.post('/login', (req, res) => {
    
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        setupDatabase();
    } catch (error) {
        console.log(error);
    }
});

function runSQLQuery(sqlQuery) {
    return new Promise((resolve, reject) => {
        dbPool.query(sqlQuery, (err, results) => {
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
        await runSQLQuery(CREATE_TABLE_QUERIES.UserType);
        await runSQLQuery(CREATE_TABLE_QUERIES.User);
        await runSQLQuery(CREATE_TABLE_QUERIES.APICall);
        console.log('Database setup complete');
    } catch (err) {
        console.error('Error setting up database: ', err);
    }
}
