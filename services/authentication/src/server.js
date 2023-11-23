const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config({ path: './.env' });

const { swaggerSpecs } = require('./swagger/swaggerDocs');

const dbPool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "comp4537_project",
    port: 3306
});

const CREATE_TABLE_QUERIES = {
    User: `
        CREATE TABLE IF NOT EXISTS User (
            UserID INT PRIMARY KEY AUTO_INCREMENT,
            Name VARCHAR(100),
            Password VARCHAR(100),
            UserType INT,
            FOREIGN KEY (UserType) REFERENCES UserType(UserTypeID)
        );
    `,
    UserType: `
        CREATE TABLE IF NOT EXISTS UserType (
            UserTypeID INT PRIMARY KEY AUTO_INCREMENT,
            UserAuthorization VARCHAR(100)
        );
    `,
    APICall: `
        CREATE TABLE IF NOT EXISTS APICall (
            API_Call_ID INT PRIMARY KEY AUTO_INCREMENT,
            UserID INT,
            Time DATETIME,
            FOREIGN KEY (UserID) REFERENCES User(UserID)
        );
    `
}

const app = express();

const swaggerPath = '/api-docs';
app.use(swaggerPath, swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use(cors());
app.use(express.json());

const PORT = 8000;
const SECRET_KEY = process.env.JWT_SECRET_KEY;

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username already exists
        const userExists = await runSQLQuery(`SELECT * FROM User WHERE Name = ?`, [username]);

        if (userExists.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the database
        await runSQLQuery('INSERT INTO User (Name, Password) VALUES (?, ?)', [username, hashedPassword]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username exists
        const user = await runSQLQuery('SELECT * FROM User WHERE Name = ?', [username]);

        if (user.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user[0].Password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Sign a JWT token
        const token = jwt.sign({ userID: user[0].UserID, username: user[0].Name }, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

function decodeToken(token) {
    try {
        const decodedToken = jwt.verify(token, SECRET_KEY);
        return decodedToken;
    } catch (error) {
        return null;
    }
}

function checkIfTokenExpired(token) {
    try {
        const decodedToken = decodeToken(token);

        const tokenExpirationEpoch = decodedToken?.exp;

        if (!tokenExpirationEpoch) {
            return false;
        }

        const currentEpoch = Math.floor(Date.now() / 1000);

        return tokenExpirationEpoch < currentEpoch;
    } catch (error) {
        return false;
    }
}

function checkIfUserHasRemainingQuota(token) {
    // TODO: Get the information (e.g. user ID) from the token payload
    const decodedToken = decodeToken(token);
    const username = decodedToken.username;
    const userID = runSQLQuery('SELECT UserID FROM User WHERE Name = ?', [username]);
    const apiCalls = runSQLQuery('SELECT COUNT(*) AS callCount FROM APICall WHERE UserID = ?', [userID]);

    // TODO: Read database to determine if the user has remaining quota
    if (apiCalls > 20) {
        return false;
    }

    return true;
}

app.post('/user', async (req, res) => {
    try {
        const { token } = req.body;

        // TODO: Remove the below commented code
        const isTokenValid = decodeToken(token) !== null;

        if (!isTokenValid) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }

        const isTokenExpired = checkIfTokenExpired(token);

        if (isTokenExpired) {
            res.status(401).json({ error: 'Token expired' });
            return;
        }

        const hasRemainingQuota = checkIfUserHasRemainingQuota(token);

        res.status(200).json({ hasRemainingQuota });
    } catch (error) {
        console.error('Error authenticating token: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}${swaggerPath}`);
    try {
        setupDatabase();
    } catch (error) {
        console.log(error);
    }
});

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
        await runSQLQuery(CREATE_TABLE_QUERIES.UserType);
        await runSQLQuery(CREATE_TABLE_QUERIES.User);
        await runSQLQuery(CREATE_TABLE_QUERIES.APICall);
        console.log('Database setup complete');
    } catch (err) {
        console.error('Error setting up database: ', err);
    }
}
