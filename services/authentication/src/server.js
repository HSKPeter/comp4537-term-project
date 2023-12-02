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

const DEFAULT_TOKEN_EXPIRES_IN = 60 * 15; // 15 minutes

const app = express();

const swaggerPath = '/api-docs';
app.use(swaggerPath, swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use(cors());
app.use(express.json());

const PORT = 8000;
const SECRET_KEY = process.env.JWT_SECRET_KEY;

// TODO: Remove 'abcd' from the below line
// const API_SECRET_KEY = process.env.API_SECRET_KEY ?? 'abcd';

// const BEARER_TOKEN_PREFIX = 'Bearer ';
// app.use((req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;

//         if (!authHeader) {
//             res.status(401).json({ error: 'No token provided' });
//             return;
//         }

//         if (!authHeader.startsWith(BEARER_TOKEN_PREFIX)) {
//             res.status(401).json({ error: 'Invalid token' });
//             return;
//         }

//         const apiKey = authHeader.substring(BEARER_TOKEN_PREFIX.length);

//         // TODO: Find the API key in the database
//         if (apiKey !== API_SECRET_KEY) {
//             res.status(401).json({ error: 'Invalid token' });
//             return;
//         }

//         next();
//     } catch (error) {
//         console.error('Error authenticating token: ', error);
//         res.status(401).json({ error: 'Invalid token' });
//     }
// });

function renewToken(payload) {
    const { iat, exp, expiresIn, ...corePayload } = payload;
    const newToken = jwt.sign(corePayload, SECRET_KEY, { expiresIn: DEFAULT_TOKEN_EXPIRES_IN });
    return newToken;
}

app.use((req, res, next) => {
    const method = req.method;
    const url = req.url;
    console.log(`[${method}] ${url}`);
    next();
})

app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        // Check if the username already exists
        const userExists = await runSQLQuery(`SELECT * FROM User WHERE Name = ?`, [username]);

        if (userExists.length > 0) {
            return res.status(500).json({ error: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the database
        await runSQLQuery('INSERT INTO User (Name, Password, UserType, Email) VALUES (?, ?, ?, ?)', [username, hashedPassword, UserTypes.Regular, email]);

        // Obtain the user type from the database        
        let queryResult = await runSQLQuery(`
            SELECT UserAuthorization 
            FROM UserType 
            WHERE UserTypeID = (
                SELECT UserType AS SelectedUserType 
                FROM User 
                WHERE Name = ?
            )`,
            [username]
        );
        
        const role = queryResult[0].UserAuthorization;

        const payload = {
            username,
            role,
        };

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: DEFAULT_TOKEN_EXPIRES_IN });
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

        const role = 'user'; // TODO: Get the role from database

        // Sign a JWT token
        const token = jwt.sign({ userID: user[0].UserID, username: user[0].Name, role }, SECRET_KEY, { expiresIn: DEFAULT_TOKEN_EXPIRES_IN });

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


async function checkIfUserHasRemainingQuota(token) {
    const decodedToken = decodeToken(token);
    const userID = decodedToken.userID;
    const apiCalls = await runSQLQuery('SELECT COUNT(*) AS callCount FROM APICall WHERE UserID = ?', [userID]);

    // TODO: Read database to determine if the user has remaining quota
    if (apiCalls > 20) {
        return false;
    }

    return true;
}

app.post('/user', async (req, res) => {
    try {
        const { token } = req.body;

        const payload = decodeToken(token);

        if (!payload) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }

        const hasRemainingQuota = await checkIfUserHasRemainingQuota(token);
        const newToken = renewToken(payload);

        res.status(200).json({ hasRemainingQuota, newToken });
    } catch (error) {
        console.error('Error authenticating token: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/role', async (req, res) => {
    try {
        const { token } = req.body;
        const payload = decodeToken(token);
        if (!payload) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }
        const { role } = payload;
        const newToken = renewToken(payload);
        res.status(200).json({ role, newToken });
    } catch (error) {
        console.error('Error retrieving role: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/bookmark-words/:userID', async (req, res) => {
    try {
        const {userID} = req.params;
        runSQLQuery('SELECT word FROM BookmarkWord WHERE UserID = ?', [userID])
        .then((wordsQueryResults) => {
            const words = wordsQueryResults.map((wordQueryResult) => wordQueryResult.word);
            res.status(200).json({ words });
        })
        .catch((err) => {
            console.error('Error retrieving bookmarked words: ', err);
            res.status(500).json({ error: 'Internal server error' });
        });
    } catch (error) {
        console.error('Error retrieving bookmarked words: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/bookmark-words/:userID', async (req, res) => {
    try {
        const {userID} = req.params;
    
        const { word } = req.body;
    
        runSQLQuery('SELECT * FROM BookmarkWord WHERE UserID = ? AND Word = ?', [userID, word])
        .then((wordExists) => {
            if (wordExists.length > 0) {
                res.status(400).json({ error: 'Word already bookmarked' });
                return;
            }
    
            runSQLQuery('INSERT INTO BookmarkWord (UserID, Word) VALUES (?, ?)', [userID, word])
            .then(() => {
                res.status(201).json({ message: 'Word bookmarked successfully' });
            })
            .catch((err) => {
                console.error('Error bookmarking word: ', err);
                res.status(500).json({ error: 'Internal server error' });
            });
        });
    } catch (error) {
        console.error('Error bookmarking word: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/bookmark-words/:userID', async (req, res) => {
    try {
        const {userID} = req.params;

        const { originalWord, newWord } = req.body;
    
        runSQLQuery('UPDATE BookmarkWord SET Word = ? WHERE UserID = ? AND Word = ?', [newWord, userID, originalWord])
        .then(() => {
            res.status(200).json({ message: 'Word updated successfully' });
        })
        .catch((err) => {
            console.error('Error updating bookmarked word: ', err);
            res.status(500).json({ error: 'Internal server error' });
        });
    } catch (error) {
        console.error('Error updating bookmarked word: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/bookmark-words/:userID', async (req, res) => {
    try {
        const {userID} = req.params;

        const toDeleteAll = req.query.all === 'true';
    
        if (toDeleteAll) {
            runSQLQuery('DELETE FROM BookmarkWord WHERE UserID = ?', [userID])
            .then(() => {
                res.status(200).json({ message: 'All words deleted successfully' });
            })
            .catch((err) => {
                console.error('Error deleting all bookmarked words: ', err);
                res.status(500).json({ error: 'Internal server error' });
            });
            return;
        } 
    
        const { word } = req.body;
    
        if (!word) {
            res.status(400).json({ error: 'Word is required' });
            return;
        }
    
        runSQLQuery('DELETE FROM BookmarkWord WHERE UserID = ? AND Word = ?', [userID, word])
        .then(() => {
            res.status(200).json({ message: 'Word deleted successfully' });
        })
        .catch((err) => {
            console.error('Error deleting bookmarked word: ', err);
            res.status(500).json({ error: 'Internal server error' });
        });
    } catch (error) {
        console.error('Error deleting bookmarked word: ', error);
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
