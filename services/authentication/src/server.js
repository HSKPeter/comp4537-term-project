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
            UserID INT NOT NULL AUTO_INCREMENT,
            Name VARCHAR(100) NOT NULL,
            Password VARCHAR(100) NOT NULL,
            UserType INT NOT NULL,
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
            PRIMARY KEY (API_Call_ID),
            FOREIGN KEY (UserID) REFERENCES User(UserID)
        );
    `
}

// Dummy data for insertion into the database
const DUMMY_DATA = {
    User: [
        "INSERT INTO User (Name, Password, UserType) VALUES ('admin', '111', 1);",
        "INSERT INTO User (Name, Password, UserType) VALUES ('john', '123', 2);",
        "INSERT INTO User (Name, Password, UserType) VALUES ('Alice Johnson', 'password3', 2);",
        "INSERT INTO User (Name, Password, UserType) VALUES ('Bob White', 'password4', 2);",
        "INSERT INTO User (Name, Password, UserType) VALUES ('Eva Brown', 'password5', 2);",
    ],
    UserType: [
        "INSERT INTO UserType (UserAuthorization) VALUES ('Admin');",
        "INSERT INTO UserType (UserAuthorization) VALUES ('Regular');",
    ],
    APICall: [
        "INSERT INTO APICall (UserID, Time) VALUES (1, '2023-01-01 12:00:00');",
        "INSERT INTO APICall (UserID, Time) VALUES (2, '2023-01-02 15:30:00');",
        "INSERT INTO APICall (UserID, Time) VALUES (1, '2023-01-03 10:45:00');",
        "INSERT INTO APICall (UserID, Time) VALUES (2, '2023-01-04 18:20:00');",
        "INSERT INTO APICall (UserID, Time) VALUES (2, '2023-01-05 08:30:00');",
        ...Array(21).fill("INSERT INTO APICall (UserID, Time) VALUES (3, '2023-01-06 01:00:00');"),
    ],
};


const UserTypes = {
    Admin: 1,
    Regular: 2,
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
            return res.status(500).json({ error: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the database
        await runSQLQuery('INSERT INTO User (Name, Password, UserType) VALUES (?, ?, ?)', [username, hashedPassword, UserTypes.Regular]);

        const role = 'user'; // TODO: Get the role from the auth server

        const payload = {
            username,
            role,
        };

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
        res.status(201).json({ message: 'User registered successfully', token, role });
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

        const role = 'user'; // TODO: Get the role from the auth server

        // Sign a JWT token
        const token = jwt.sign({ userID: user[0].UserID, username: user[0].Name, role }, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ token, role });
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
    console.log(`Decoded token: ${JSON.stringify(decodedToken)}`);
    const userID = decodedToken.userID;
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

app.post('/role', async (req, res) => {
    try {
        const { token } = req.body;
        const decodedToken = jwt.verify(token, SECRET_KEY);
        const { role } = decodedToken;
        res.status(200).json({ role });
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

        // Execute the CREATE TABLE queries
        await runSQLQuery(CREATE_TABLE_QUERIES.UserType);
        await runSQLQuery(CREATE_TABLE_QUERIES.User);
        await runSQLQuery(CREATE_TABLE_QUERIES.APICall);

        // Insert dummy data - COMMENT OUT FOR PRODUCTION
        // for (const query of DUMMY_DATA.UserType) {
        //     await runSQLQuery(query);
        // }
        // for (const query of DUMMY_DATA.User) {
        //     await runSQLQuery(query);
        // }
        // for (const query of DUMMY_DATA.APICall) {
        //     await runSQLQuery(query);
        // }

        console.log('Database setup complete');
    } catch (err) {
        console.error('Error setting up database: ', err);
    }
}
